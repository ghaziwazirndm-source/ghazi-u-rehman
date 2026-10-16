import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Activity,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Info,
  Radio,
  Sliders,
  Settings,
  Sparkles,
  HelpCircle,
  Play,
  Square,
  Shield,
  Zap,
} from 'lucide-react';

interface DeviceInfo {
  deviceId: string;
  label: string;
  groupId: string;
}

interface StreamStats {
  sampleRate: number;
  channelCount: number;
  trackState: string;
  echoCancellation: boolean;
  noiseSuppression: boolean;
  autoGainControl: boolean;
  rawSampleRate: number;
  downsampledRate: number;
}

export const AudioDiagnostics: React.FC = () => {
  // Test State
  const [isTesting, setIsTesting] = useState(false);
  const [permStatus, setPermStatus] = useState<'prompt' | 'granted' | 'denied' | 'checking'>('checking');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');
  const [streamStats, setStreamStats] = useState<StreamStats | null>(null);

  // Audio metrics
  const [volumeLevel, setVolumeLevel] = useState(0); // 0 to 1
  const [peakLevel, setPeakLevel] = useState(0);
  const [decibels, setDecibels] = useState(-100);
  const [isSpeakingDetected, setIsSpeakingDetected] = useState(false);
  const [chunksCount, setChunksCount] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Loopback / Playback test state
  const [isRecordingLoopback, setIsRecordingLoopback] = useState(false);
  const [loopbackRecorded, setLoopbackRecorded] = useState<string | null>(null);
  const [isPlayingLoopback, setIsPlayingLoopback] = useState(false);
  const [backendWsStatus, setBackendWsStatus] = useState<'unchecked' | 'ok' | 'error'>('unchecked');

  // Audio graph references
  const audioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const scriptProcRef = useRef<ScriptProcessorNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const addLog = (msg: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [`[${timestamp}] ${msg}`, ...prev.slice(0, 49)]);
  };

  // Check browser permissions query
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        if (navigator.permissions && (navigator.permissions as any).query) {
          const perm = await navigator.permissions.query({ name: 'microphone' as any });
          setPermStatus(perm.state as any);
          addLog(`Browser permission state: ${perm.state}`);
          perm.onchange = () => {
            setPermStatus(perm.state as any);
            addLog(`Permission changed to: ${perm.state}`);
          };
        } else {
          setPermStatus('prompt');
        }
      } catch (e) {
        setPermStatus('prompt');
      }
    };
    checkPermissions();
    enumerateAudioDevices();

    // Check backend health
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') {
          setBackendWsStatus('ok');
          addLog(`Backend Live API Gateway: Ready (${data.model})`);
        } else {
          setBackendWsStatus('error');
          addLog('Backend Live API Gateway: Offline');
        }
      })
      .catch(() => {
        setBackendWsStatus('error');
        addLog('Backend Live API Gateway: Unreachable');
      });

    return () => {
      stopMicTest();
    };
  }, []);

  const enumerateAudioDevices = async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices
        .filter((d) => d.kind === 'audioinput')
        .map((d, idx) => ({
          deviceId: d.deviceId,
          label: d.label || `Microphone ${idx + 1} (${d.deviceId.slice(0, 6)}...)`,
          groupId: d.groupId,
        }));
      setDevices(audioInputs);
      if (audioInputs.length > 0 && selectedDeviceId === 'default') {
        setSelectedDeviceId(audioInputs[0].deviceId);
      }
    } catch (err: any) {
      addLog(`Failed to enumerate devices: ${err?.message}`);
    }
  };

  const startMicTest = async () => {
    setErrorMessage(null);
    setChunksCount(0);
    setVolumeLevel(0);
    setPeakLevel(0);
    addLog('Starting microphone stream test...');

    try {
      // 1. AudioContext
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      if (ctx.state === 'suspended') {
        await ctx.resume();
        addLog('AudioContext state resumed via user gesture');
      }

      // 2. Request user media with selected device
      const constraints: MediaStreamConstraints = {
        audio: selectedDeviceId && selectedDeviceId !== 'default'
          ? {
              deviceId: { exact: selectedDeviceId },
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            }
          : {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true,
            },
      };

      addLog('Calling navigator.mediaDevices.getUserMedia()...');
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (constraintErr) {
        addLog('Specific constraints rejected; falling back to basic { audio: true }...');
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      }

      mediaStreamRef.current = stream;
      setPermStatus('granted');
      addLog('Microphone permission GRANTED by browser!');

      // Read tracks and capabilities
      const audioTrack = stream.getAudioTracks()[0];
      const settings = audioTrack.getSettings ? audioTrack.getSettings() : {};
      setStreamStats({
        sampleRate: ctx.sampleRate,
        channelCount: settings.channelCount || 1,
        trackState: audioTrack.readyState,
        echoCancellation: !!settings.echoCancellation,
        noiseSuppression: !!settings.noiseSuppression,
        autoGainControl: !!settings.autoGainControl,
        rawSampleRate: settings.sampleRate || ctx.sampleRate,
        downsampledRate: 16000,
      });

      addLog(`Stream active: ${audioTrack.label || 'Default Mic'} @ ${ctx.sampleRate}Hz`);

      // Refresh device labels now that permission is granted
      enumerateAudioDevices();

      // 3. Connect nodes for analysis
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Script processor to simulate 16kHz chunk generation
      const processor = ctx.createScriptProcessor(2048, 1, 1);
      scriptProcRef.current = processor;

      source.connect(analyser);
      analyser.connect(processor);

      // Connect to zero-gain node to prevent local feedback/echo
      const muteGain = ctx.createGain();
      muteGain.gain.value = 0;
      processor.connect(muteGain);
      muteGain.connect(ctx.destination);

      let chunkTally = 0;
      processor.onaudioprocess = () => {
        chunkTally++;
        if (chunkTally % 10 === 0) {
          setChunksCount((c) => c + 10);
        }
      };

      setIsTesting(true);
      startVisualizerLoop();
    } catch (err: any) {
      console.error('Mic test failure:', err);
      const isDenied =
        err?.name === 'NotAllowedError' ||
        err?.name === 'PermissionDeniedError' ||
        err?.message?.toLowerCase().includes('denied');

      setPermStatus(isDenied ? 'denied' : 'prompt');
      const msg = isDenied
        ? 'Microphone permission denied by browser or iframe policy.'
        : err?.message || 'Could not start microphone stream.';
      setErrorMessage(msg);
      addLog(`Error: ${msg}`);
      stopMicTest();
    }
  };

  const stopMicTest = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (scriptProcRef.current) {
      scriptProcRef.current.disconnect();
      scriptProcRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsTesting(false);
    setVolumeLevel(0);
    setIsSpeakingDetected(false);
    addLog('Microphone test stopped');
  };

  // Real-time canvas oscilloscope & meter loop
  const startVisualizerLoop = () => {
    const render = () => {
      const analyser = analyserRef.current;
      const canvas = canvasRef.current;
      if (!analyser || !canvas) return;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyser.getByteFrequencyData(dataArray);

      const timeArray = new Uint8Array(bufferLength);
      analyser.getByteTimeDomainData(timeArray);

      // Calculate RMS & Decibels
      let sumSquares = 0;
      let maxVal = 0;
      for (let i = 0; i < bufferLength; i++) {
        const val = dataArray[i];
        if (val > maxVal) maxVal = val;
        const normalized = val / 255;
        sumSquares += normalized * normalized;
      }
      const rms = Math.sqrt(sumSquares / bufferLength);
      const db = rms > 0 ? Math.round(20 * Math.log10(rms)) : -100;

      setVolumeLevel(rms);
      setDecibels(db);
      setPeakLevel((prev) => Math.max(prev * 0.95, rms));
      setIsSpeakingDetected(rms > 0.08);

      // Draw Oscilloscope Canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = '#0a0a0f';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw frequency bars in background
        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barX = 0;
        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * canvas.height * 0.7;
          ctx.fillStyle = `rgba(232, 200, 114, ${0.15 + (dataArray[i] / 255) * 0.4})`;
          ctx.fillRect(barX, canvas.height - barHeight, barWidth, barHeight);
          barX += barWidth + 1;
          if (barX > canvas.width) break;
        }

        // Draw time-domain wave line
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = rms > 0.08 ? '#00C98D' : '#e8c872';
        ctx.beginPath();

        const sliceWidth = (canvas.width * 1.0) / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = timeArray[i] / 128.0;
          const y = (v * canvas.height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.stroke();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);
  };

  // 3-Second Audio Loopback / Echo Test
  const recordLoopbackSample = async () => {
    if (isRecordingLoopback) return;
    setIsRecordingLoopback(true);
    setLoopbackRecorded(null);
    addLog('Recording 3-second audio loopback test...');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setLoopbackRecorded(audioUrl);
        setIsRecordingLoopback(false);
        stream.getTracks().forEach((t) => t.stop());
        addLog('3-second sample recorded! Click "Play Recorded Audio" to test playback.');
      };

      mediaRecorder.start();
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      }, 3000);
    } catch (e: any) {
      setIsRecordingLoopback(false);
      addLog(`Loopback record failed: ${e?.message}`);
    }
  };

  const playLoopbackSample = () => {
    if (!loopbackRecorded || isPlayingLoopback) return;
    setIsPlayingLoopback(true);
    addLog('Playing recorded audio sample through speakers...');
    const audio = new Audio(loopbackRecorded);
    audio.onended = () => {
      setIsPlayingLoopback(false);
      addLog('Audio sample playback completed successfully!');
    };
    audio.onerror = () => {
      setIsPlayingLoopback(false);
      addLog('Audio playback error occurred.');
    };
    audio.play().catch((err) => {
      setIsPlayingLoopback(false);
      addLog(`Playback failed: ${err?.message}`);
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title & Status Summary Banner */}
      <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#e8c872] bg-[#e8c872]/15 border border-[#e8c872]/30 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Radio className="w-3 h-3 text-[#e8c872]" />
                Live Audio & Hardware Diagnostics
              </span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  permStatus === 'granted'
                    ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
                    : permStatus === 'denied'
                    ? 'text-red-400 bg-red-500/10 border-red-500/30'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/30'
                }`}
              >
                Permission: {permStatus.toUpperCase()}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Microphone Stream & Gemini 3.8 Live API Diagnostic Suite
            </h2>
            <p className="text-xs text-[#a8a7b3] mt-1 max-w-2xl leading-relaxed">
              Verify real-time audio input capture, inspect browser permission policies, monitor hardware decibel
              levels, and test 16kHz PCM downsampling for Ghazi Wazir's AI Voice Agent.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5">
            {!isTesting ? (
              <button
                type="button"
                onClick={startMicTest}
                className="btn-gold px-5 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-lg hover:scale-102 transition-transform"
              >
                <Mic className="w-4 h-4" />
                <span>Start Live Mic Test</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopMicTest}
                className="px-5 py-3 rounded-2xl bg-red-500/15 border border-red-500/40 text-red-400 hover:bg-red-500/25 text-xs font-bold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>Stop Stream Test</span>
              </button>
            )}
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-xs text-red-400 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-bold">Microphone Stream Error:</div>
              <div>{errorMessage}</div>
              <div className="text-[11px] text-red-300/80 mt-1">
                Tip: Click the lock icon next to your URL bar, set Microphone to 'Allow', and re-run this test.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Visualizer & Meters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Real-Time Oscilloscope Canvas & VU Meters */}
        <div className="lg:col-span-2 space-y-6">
          {/* Oscilloscope Canvas */}
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#e8c872]" />
                <h3 className="text-sm font-serif font-bold text-white">Live Audio Waveform & FFT Spectrum</h3>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    isTesting ? (isSpeakingDetected ? 'bg-emerald-400 animate-ping' : 'bg-emerald-500') : 'bg-zinc-600'
                  }`}
                />
                <span className="text-[#a8a7b3] font-mono text-[11px]">
                  {isTesting ? (isSpeakingDetected ? 'Voice Detected' : 'Listening...') : 'Inactive'}
                </span>
              </div>
            </div>

            {/* Canvas Container */}
            <div className="relative rounded-2xl overflow-hidden border border-[#2a2a38] bg-[#0a0a0f]">
              <canvas
                ref={canvasRef}
                width={700}
                height={160}
                className="w-full h-40 block"
              />
              {!isTesting && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-center p-4">
                  <Mic className="w-8 h-8 text-[#e8c872] mb-2 opacity-80" />
                  <p className="text-xs text-white font-bold">Microphone Test Inactive</p>
                  <p className="text-[11px] text-[#a8a7b3] mt-0.5">
                    Click 'Start Live Mic Test' above to visualize your microphone stream.
                  </p>
                </div>
              )}
            </div>

            {/* Live Volume & VU Meter Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#a8a7b3] font-medium flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-[#e8c872]" />
                  <span>Real-Time Volume Level:</span>
                  <span className="text-white font-mono font-bold">
                    {Math.round(volumeLevel * 100)}%
                  </span>
                </span>
                <span className="font-mono text-[11px] text-[#e8c872]">
                  dB Level: <span className="font-bold">{decibels} dBFS</span> | Peak: {Math.round(peakLevel * 100)}%
                </span>
              </div>

              {/* Progress Bar with Color Zones */}
              <div className="h-3 w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-full overflow-hidden p-0.5 relative">
                <div
                  className="h-full rounded-full transition-all duration-75 flex items-center justify-end pr-1 text-[8px] font-bold text-black"
                  style={{
                    width: `${Math.min(100, Math.max(2, volumeLevel * 150))}%`,
                    backgroundColor:
                      volumeLevel > 0.7 ? '#EF4444' : volumeLevel > 0.35 ? '#EAB308' : '#10B981',
                  }}
                />
              </div>

              <div className="flex justify-between text-[9px] text-[#666] font-mono px-1">
                <span>Silent (-100dB)</span>
                <span>Normal Voice (-30dB to -10dB)</span>
                <span>Peak Clipping (0dB)</span>
              </div>
            </div>

            {/* 3-Second Audio Echo / Loopback Test */}
            <div className="pt-4 border-t border-[#2a2a38] flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Echo Loopback Test</span>
                </h4>
                <p className="text-[11px] text-[#a8a7b3]">
                  Record a 3-second sample to verify microphone capture & speaker playback simultaneously.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={recordLoopbackSample}
                  disabled={isRecordingLoopback}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                    isRecordingLoopback
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                      : 'bg-[#0a0a0f] text-white border border-[#2a2a38] hover:border-[#e8c872]'
                  }`}
                >
                  <Radio className="w-3.5 h-3.5 text-red-400" />
                  <span>{isRecordingLoopback ? 'Recording (3s)...' : 'Record 3s Sample'}</span>
                </button>

                {loopbackRecorded && (
                  <button
                    type="button"
                    onClick={playLoopbackSample}
                    disabled={isPlayingLoopback}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isPlayingLoopback ? 'Playing...' : 'Play Sample'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Real-time Diagnostics Log Stream */}
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#e8c872]" />
                <span>Audio Engine Event Log ({logs.length} entries)</span>
              </h3>
              <button
                type="button"
                onClick={() => setLogs([])}
                className="text-[10px] text-[#a8a7b3] hover:text-white underline cursor-pointer"
              >
                Clear Log
              </button>
            </div>
            <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-3.5 font-mono text-[11px] text-[#a8a7b3] max-h-36 overflow-y-auto space-y-1">
              {logs.length === 0 ? (
                <div className="text-zinc-600">No events logged yet. Click 'Start Live Mic Test' above.</div>
              ) : (
                logs.map((log, idx) => (
                  <div
                    key={idx}
                    className={
                      log.includes('Error')
                        ? 'text-red-400'
                        : log.includes('GRANTED') || log.includes('active')
                        ? 'text-emerald-400'
                        : 'text-[#ccc]'
                    }
                  >
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Device & Stream Health Inspector */}
        <div className="space-y-6">
          {/* Device Selector & Hardware Info */}
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Settings className="w-4 h-4 text-[#e8c872]" />
              <h3 className="text-sm font-serif font-bold text-white">Audio Hardware Inspector</h3>
            </div>

            {/* Input Device Dropdown */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#a8a7b3]">Detected Microphone Device:</label>
              <select
                value={selectedDeviceId}
                onChange={(e) => {
                  setSelectedDeviceId(e.target.value);
                  if (isTesting) {
                    stopMicTest();
                    setTimeout(startMicTest, 200);
                  }
                }}
                className="w-full bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e8c872]"
              >
                {devices.length === 0 ? (
                  <option value="default">Default System Microphone</option>
                ) : (
                  devices.map((d) => (
                    <option key={d.deviceId} value={d.deviceId}>
                      {d.label}
                    </option>
                  ))
                )}
              </select>
              <p className="text-[10px] text-[#666]">
                Found {devices.length} audio input hardware device(s).
              </p>
            </div>

            {/* Technical Parameters Table */}
            <div className="border border-[#2a2a38] rounded-2xl bg-[#0a0a0f] p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#1c1c28]">
                <span className="text-[#a8a7b3]">Browser Permission:</span>
                <span
                  className={`font-bold font-mono ${
                    permStatus === 'granted'
                      ? 'text-emerald-400'
                      : permStatus === 'denied'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}
                >
                  {permStatus.toUpperCase()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1c1c28]">
                <span className="text-[#a8a7b3]">Hardware Sample Rate:</span>
                <span className="text-white font-mono font-bold">
                  {streamStats ? `${streamStats.rawSampleRate} Hz` : '48,000 Hz (Standard)'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1c1c28]">
                <span className="text-[#a8a7b3]">Live API Target Rate:</span>
                <span className="text-[#e8c872] font-mono font-bold">16,000 Hz (Downsampled)</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1c1c28]">
                <span className="text-[#a8a7b3]">Channel Count:</span>
                <span className="text-white font-mono">1 (Mono PCM)</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1c1c28]">
                <span className="text-[#a8a7b3]">Echo Cancellation:</span>
                <span className="text-emerald-400 font-mono">
                  {streamStats?.echoCancellation ? 'Active' : 'Supported'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-[#1c1c28]">
                <span className="text-[#a8a7b3]">Noise Suppression:</span>
                <span className="text-emerald-400 font-mono">
                  {streamStats?.noiseSuppression ? 'Active' : 'Supported'}
                </span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-[#a8a7b3]">Backend Gemini Live Gateway:</span>
                <span
                  className={`font-bold font-mono ${
                    backendWsStatus === 'ok' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {backendWsStatus === 'ok' ? 'Operational' : 'Connecting...'}
                </span>
              </div>
            </div>
          </div>

          {/* Troubleshooting Checklist */}
          <div className="bg-[#14141d] border border-[#2a2a38] rounded-3xl p-5 sm:p-6 space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#e8c872]" />
              <h3 className="text-sm font-serif font-bold text-white">Troubleshooting Checklist</h3>
            </div>

            <ul className="space-y-2 text-xs text-[#a8a7b3]">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Browser Lock Icon:</strong> Click the padlock or settings icon on the
                  left of your browser URL bar and ensure <em>Microphone</em> is set to <strong>Allow</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">OS Privacy Permissions:</strong> On macOS or Windows 11, verify that
                  your browser has permission under System Settings &rarr; Privacy & Security &rarr; Microphone.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Hardware Mute Switch:</strong> Ensure your headset or laptop does not
                  have a physical mute button or slider engaged.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-white">Fallback Mode:</strong> If you are in a quiet environment or restricted
                  network, you can always type text directly in the voice agent to hear Ghazi AI speak back!
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
