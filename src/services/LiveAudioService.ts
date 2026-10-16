// LiveAudioService: Resilient 16kHz PCM Capture, 24kHz Audio Playback, Downsampling & VAD Visualizer

export class LiveAudioService {
  private inputAudioCtx: AudioContext | null = null;
  private outputAudioCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private scriptProcessor: ScriptProcessorNode | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private analyserNode: AnalyserNode | null = null;

  private scheduledEndTime = 0;
  private activeSourceNodes: AudioBufferSourceNode[] = [];
  private onAudioLevelCallback?: (level: number) => void;

  /**
   * Resumes or creates the output AudioContext within a user interaction (click/touch).
   * Crucial for satisfying browser autoplay policies (Chrome, Safari, Edge).
   */
  public async ensureAudioContext(): Promise<void> {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!this.outputAudioCtx) {
        this.outputAudioCtx = new AudioCtx();
        this.scheduledEndTime = this.outputAudioCtx.currentTime;
      }
      if (this.outputAudioCtx.state === 'suspended') {
        await this.outputAudioCtx.resume();
      }
    } catch (e) {
      console.warn('[LiveAudioService] Failed to resume output AudioContext:', e);
    }
  }

  /**
   * Initializes microphone capture, downsampling hardware sample rate (e.g. 48kHz/44.1kHz) to 16kHz PCM
   */
  public async startRecording(
    onChunk: (base64Audio: string) => void,
    onLevel?: (level: number) => void
  ): Promise<{ success: boolean; error?: string; permissionDenied?: boolean }> {
    this.onAudioLevelCallback = onLevel;

    // Clean up any existing recording session before starting a new one
    this.stopRecording();

    if (!navigator?.mediaDevices?.getUserMedia) {
      return {
        success: false,
        error: 'Microphone capture is not supported in this browser.',
        permissionDenied: true,
      };
    }

    try {
      // Request mic stream with fallback constraints
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            channelCount: 1,
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (constraintErr) {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      this.mediaStream = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      // Do not force 16000Hz on the hardware AudioContext because Safari/macOS will fail
      this.inputAudioCtx = new AudioCtx();

      if (this.inputAudioCtx.state === 'suspended') {
        await this.inputAudioCtx.resume();
      }

      const inputRate = this.inputAudioCtx.sampleRate;
      this.sourceNode = this.inputAudioCtx.createMediaStreamSource(this.mediaStream);
      this.analyserNode = this.inputAudioCtx.createAnalyser();
      this.analyserNode.fftSize = 256;

      // Buffer size of 4096 gives ~85ms chunks at 48kHz
      this.scriptProcessor = this.inputAudioCtx.createScriptProcessor(4096, 1, 1);

      this.sourceNode.connect(this.analyserNode);
      this.analyserNode.connect(this.scriptProcessor);
      // Connect to a mute gain node instead of destination to prevent feedback loop
      const muteGain = this.inputAudioCtx.createGain();
      muteGain.gain.value = 0;
      this.scriptProcessor.connect(muteGain);
      muteGain.connect(this.inputAudioCtx.destination);

      const freqData = new Uint8Array(this.analyserNode.frequencyBinCount);

      this.scriptProcessor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);

        // 1. Calculate mic volume level for visualizer
        if (this.analyserNode && this.onAudioLevelCallback) {
          this.analyserNode.getByteFrequencyData(freqData);
          let sum = 0;
          for (let i = 0; i < freqData.length; i++) {
            sum += freqData[i];
          }
          const avg = sum / freqData.length / 255;
          this.onAudioLevelCallback(avg);
        }

        // 2. Downsample audio to 16kHz
        const downsampled = this.downsampleTo16kHz(inputData, inputRate);

        // 3. Convert to 16-bit PCM little-endian Base64
        const base64 = this.float32ToPcm16Base64(downsampled);
        if (base64) {
          onChunk(base64);
        }
      };

      return { success: true };
    } catch (err: any) {
      console.warn('[LiveAudioService] Mic access error:', err);
      const isDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.toLowerCase().includes('denied') ||
        err?.message?.toLowerCase().includes('permission');

      return {
        success: false,
        error: isDenied
          ? 'Microphone permission was not allowed in browser settings.'
          : err?.message || 'Could not access microphone.',
        permissionDenied: isDenied,
      };
    }
  }

  /**
   * Linear downsampling from hardware rate (44.1k/48k) to standard 16kHz
   */
  private downsampleTo16kHz(buffer: Float32Array, inputRate: number): Float32Array {
    if (inputRate === 16000) {
      return buffer;
    }
    const ratio = inputRate / 16000;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : buffer[offsetBuffer] || 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  /**
   * Plays a 24kHz raw PCM chunk received from Gemini Live API
   */
  public playChunk(base64PCM: string, onModelLevel?: (level: number) => void): void {
    if (!this.outputAudioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.outputAudioCtx = new AudioCtx();
      this.scheduledEndTime = this.outputAudioCtx.currentTime;
    }

    const ctx = this.outputAudioCtx;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    try {
      const binary = atob(base64PCM);
      const len = binary.length;
      if (len === 0) return;

      const buffer = new ArrayBuffer(len);
      const view = new DataView(buffer);

      for (let i = 0; i < len; i++) {
        view.setUint8(i, binary.charCodeAt(i));
      }

      const samplesCount = Math.floor(len / 2);
      if (samplesCount <= 0) return;

      // Gemini Live returns 24kHz raw 16-bit PCM
      const audioBuffer = ctx.createBuffer(1, samplesCount, 24000);
      const channelData = audioBuffer.getChannelData(0);

      let peak = 0;
      for (let i = 0; i < samplesCount; i++) {
        const int16 = view.getInt16(i * 2, true);
        const floatVal = int16 / 32768.0;
        channelData[i] = floatVal;
        const absVal = Math.abs(floatVal);
        if (absVal > peak) peak = absVal;
      }

      if (onModelLevel) {
        onModelLevel(Math.min(1, peak * 1.8));
      }

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      // If playback lagged or gap detected, catch up
      if (this.scheduledEndTime < currentTime) {
        this.scheduledEndTime = currentTime;
      }

      source.start(this.scheduledEndTime);
      this.scheduledEndTime += audioBuffer.duration;

      this.activeSourceNodes.push(source);
      source.onended = () => {
        this.activeSourceNodes = this.activeSourceNodes.filter((s) => s !== source);
      };
    } catch (err) {
      console.warn('[LiveAudioService] Playback error:', err);
    }
  }

  /**
   * Immediately stops playback when interrupted
   */
  public stopPlayback(): void {
    for (const source of this.activeSourceNodes) {
      try {
        source.stop();
        source.disconnect();
      } catch {
        // ignore
      }
    }
    this.activeSourceNodes = [];
    if (this.outputAudioCtx) {
      this.scheduledEndTime = this.outputAudioCtx.currentTime;
    }
  }

  public stopRecording(): void {
    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor.onaudioprocess = null;
      this.scriptProcessor = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.analyserNode) {
      this.analyserNode.disconnect();
      this.analyserNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.inputAudioCtx) {
      this.inputAudioCtx.close().catch(() => {});
      this.inputAudioCtx = null;
    }
  }

  public cleanup(): void {
    this.stopPlayback();
    this.stopRecording();
    if (this.outputAudioCtx) {
      this.outputAudioCtx.close().catch(() => {});
      this.outputAudioCtx = null;
    }
  }

  /**
   * Converts Float32Array to 16-bit PCM Base64 string
   */
  private float32ToPcm16Base64(float32Array: Float32Array): string {
    const len = float32Array.length;
    const buffer = new ArrayBuffer(len * 2);
    const view = new DataView(buffer);

    for (let i = 0; i < len; i++) {
      let s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    let binary = '';
    const bytes = new Uint8Array(buffer);
    const chunkSize = 4096;
    for (let i = 0; i < bytes.length; i += chunkSize) {
      const sub = bytes.subarray(i, i + chunkSize);
      for (let j = 0; j < sub.length; j++) {
        binary += String.fromCharCode(sub[j]);
      }
    }
    return btoa(binary);
  }
}
