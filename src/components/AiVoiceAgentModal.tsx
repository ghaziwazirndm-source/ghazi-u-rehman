import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  PhoneOff,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Send,
  MessageSquare,
  Calendar,
  CreditCard,
  AlertCircle,
  Radio,
  RefreshCw,
  Info,
} from 'lucide-react';
import { LiveAudioService } from '../services/LiveAudioService';
import regeneratedImage from '../assets/images/regenerated_image_1791099313510.jpg';
import { GHAZI_INFO } from '../data/content';

interface AiVoiceAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  navigate?: (route: string) => void;
}

type SessionStatus = 'DISCONNECTED' | 'CONNECTING' | 'CONNECTED' | 'ERROR';

interface TranscriptItem {
  sender: 'user' | 'ghazi';
  text: string;
  time: string;
}

export const AiVoiceAgentModal: React.FC<AiVoiceAgentModalProps> = ({
  isOpen,
  onClose,
  navigate,
}) => {
  // Hooks defined at top-level
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('DISCONNECTED');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [userAudioLevel, setUserAudioLevel] = useState(0);
  const [modelAudioLevel, setModelAudioLevel] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [micNotice, setMicNotice] = useState<string | null>(null);
  const [micDenied, setMicDenied] = useState(false);

  // Transcripts
  const [transcripts, setTranscripts] = useState<TranscriptItem[]>([
    {
      sender: 'ghazi',
      text: 'Marhaba! I am the AI Voice Agent of Ghazi Wazir, CEO of Back for Brand and CEO of Bab Al-Khaleej. How can I guide your business setup in Bahrain or tech expansion today?',
      time: 'Just now',
    },
  ]);
  const [textInput, setTextInput] = useState('');

  const wsRef = useRef<WebSocket | null>(null);
  const audioServiceRef = useRef<LiveAudioService | null>(null);
  const transcriptScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (transcriptScrollRef.current) {
      transcriptScrollRef.current.scrollTop = transcriptScrollRef.current.scrollHeight;
    }
  }, [transcripts]);

  // Connect to Gemini 3.8 Live API via server WebSocket
  const connectVoiceSession = async () => {
    setSessionStatus('CONNECTING');
    setErrorMessage(null);
    setMicNotice(null);

    try {
      const audioService = new LiveAudioService();
      audioServiceRef.current = audioService;
      await audioService.ensureAudioContext();

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setSessionStatus('CONNECTED');

        // Start mic recording with graceful permission handling
        const micResult = await audioService.startRecording(
          (base64Chunk) => {
            if (ws.readyState === WebSocket.OPEN && !isMicMuted) {
              ws.send(JSON.stringify({ audio: base64Chunk }));
            }
          },
          (level) => {
            if (!isMicMuted) {
              setUserAudioLevel(level);
            }
          }
        );

        if (!micResult.success) {
          setMicDenied(true);
          setMicNotice(
            micResult.permissionDenied
              ? 'Microphone permission was not enabled. Click "Enable Mic" below or type any question to hear Ghazi AI speak!'
              : micResult.error || 'Microphone capture is unavailable.'
          );
        } else {
          setMicDenied(false);
          setMicNotice(null);
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.error) {
            setErrorMessage(data.error);
            setSessionStatus('ERROR');
            return;
          }

          // Model Voice Output (24kHz Raw PCM)
          if (data.audio) {
            setIsAiSpeaking(true);
            audioService.playChunk(data.audio, (level) => {
              setModelAudioLevel(level);
            });

            // Auto-reset speaking state after delay
            setTimeout(() => {
              setIsAiSpeaking(false);
              setModelAudioLevel(0);
            }, 600);
          }

          // User Audio Transcription
          if (data.userTranscript) {
            setTranscripts((prev) => [
              ...prev,
              {
                sender: 'user',
                text: data.userTranscript,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }

          // Model Speech Transcription
          if (data.modelTranscript) {
            setTranscripts((prev) => [
              ...prev,
              {
                sender: 'ghazi',
                text: data.modelTranscript,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
          }

          // Model Interrupted by user
          if (data.interrupted) {
            setIsAiSpeaking(false);
            setModelAudioLevel(0);
            audioService.stopPlayback();
          }
        } catch (err) {
          console.warn('[LiveAPI] Message parse error:', err);
        }
      };

      ws.onerror = (err) => {
        console.warn('[LiveAPI] WebSocket connection issue:', err);
        setErrorMessage('Voice connection encountered an issue.');
        setSessionStatus('ERROR');
      };

      ws.onclose = () => {
        setSessionStatus('DISCONNECTED');
        setIsAiSpeaking(false);
        setUserAudioLevel(0);
        setModelAudioLevel(0);
      };
    } catch (err: any) {
      console.warn('[LiveAPI] Connection initialization issue:', err);
      setErrorMessage(err?.message || 'Could not connect to Live API.');
      setSessionStatus('ERROR');
    }
  };

  const disconnectVoiceSession = () => {
    if (audioServiceRef.current) {
      audioServiceRef.current.cleanup();
      audioServiceRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setSessionStatus('DISCONNECTED');
    setIsAiSpeaking(false);
    setUserAudioLevel(0);
    setModelAudioLevel(0);
  };

  const retryMicPermission = async () => {
    if (!audioServiceRef.current) {
      audioServiceRef.current = new LiveAudioService();
    }
    await audioServiceRef.current.ensureAudioContext();

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      await connectVoiceSession();
      return;
    }

    const res = await audioServiceRef.current.startRecording(
      (base64Chunk) => {
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN && !isMicMuted) {
          wsRef.current.send(JSON.stringify({ audio: base64Chunk }));
        }
      },
      (level) => {
        if (!isMicMuted) {
          setUserAudioLevel(level);
        }
      }
    );

    if (res.success) {
      setMicDenied(false);
      setMicNotice(null);
    } else {
      setMicDenied(true);
      setMicNotice(res.error || 'Please click Enable Mic or check your browser permissions.');
    }
  };

  // Connect on modal open
  useEffect(() => {
    if (isOpen) {
      connectVoiceSession();
    }
    return () => {
      disconnectVoiceSession();
    };
  }, [isOpen]);

  // Hook rules: Only return null AFTER hooks have been registered
  if (!isOpen) return null;

  const handleSendTextMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    audioServiceRef.current?.ensureAudioContext();
    wsRef.current.send(JSON.stringify({ text: textInput.trim() }));
    setTranscripts((prev) => [
      ...prev,
      {
        sender: 'user',
        text: textInput.trim(),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setTextInput('');
  };

  const samplePrompts = [
    'Can I own 100% of an IT company in Bahrain?',
    'What is the turnaround time for MOIC Sijilat approval?',
    'How do foreign investor visas work under LMRA?',
    'What is included in the Turnkey W.L.L. package?',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#14141d] border-2 border-[#e8c872]/60 rounded-3xl max-w-2xl w-full p-5 sm:p-7 relative shadow-[0_0_60px_rgba(232,200,114,0.25)] my-auto animate-in zoom-in-95 duration-200 text-left">
        {/* Close Button */}
        <button
          onClick={() => {
            disconnectVoiceSession();
            onClose();
          }}
          className="absolute top-4 right-4 text-[#a8a7b3] hover:text-white p-2 rounded-full bg-[#0a0a0f] border border-[#2a2a38] cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[#2a2a38] pb-4 mb-5">
          <div className="relative">
            <div className="w-14 h-14 rounded-full border-2 border-[#e8c872] overflow-hidden shadow-lg">
              <img
                src={regeneratedImage}
                alt="Ghazi Wazir CEO"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Live Indicator Pulse */}
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-[#14141d] ${
                sessionStatus === 'CONNECTED'
                  ? isAiSpeaking
                    ? 'bg-cyan-400 animate-ping'
                    : 'bg-emerald-500'
                  : sessionStatus === 'CONNECTING'
                  ? 'bg-amber-400 animate-pulse'
                  : 'bg-zinc-600'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#e8c872] bg-[#e8c872]/15 border border-[#e8c872]/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#e8c872]" />
                <span>Gemini 3.8 Live API Voice Engine</span>
              </span>
              <span className="text-[10px] font-mono text-emerald-400">Low-Latency PCM</span>
            </div>
            <h2 className="text-xl font-serif font-bold text-white mt-0.5">
              Ghazi Wazir · AI Executive Voice Twin
            </h2>
            <p className="text-xs text-[#a8a7b3]">
              Speaking on behalf of Ghazi Wazir · CEO of Back for Brand & CEO of Bab Al-Khaleej
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Mic Permission Guidance Notice */}
        {micNotice && (
          <div className="mb-4 p-3 bg-[#e8c872]/10 border border-[#e8c872]/30 rounded-xl text-xs text-[#e8c872] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-[#e8c872]" />
              <span>{micNotice}</span>
            </div>
            {micDenied && (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={retryMicPermission}
                  className="px-2.5 py-1 rounded-lg bg-[#e8c872] text-[#0a0a0f] font-bold text-[11px] whitespace-nowrap cursor-pointer hover:bg-[#d4b45d]"
                >
                  Enable Mic
                </button>
                {navigate && (
                  <button
                    type="button"
                    onClick={() => {
                      disconnectVoiceSession();
                      onClose();
                      navigate('diagnostics');
                    }}
                    className="px-2.5 py-1 rounded-lg bg-[#14141d] border border-[#e8c872]/40 text-[#e8c872] font-medium text-[11px] whitespace-nowrap cursor-pointer hover:bg-[#1f1f2e]"
                  >
                    Run Diagnostics
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Visualizer & Animated Voice Orb */}
        <div className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden mb-5">
          {/* Audio Wave Glow Rings */}
          <div
            className="w-24 h-24 rounded-full border-2 transition-all duration-150 flex items-center justify-center mb-3 relative"
            style={{
              borderColor: isAiSpeaking ? '#00C98D' : userAudioLevel > 0.05 ? '#e8c872' : '#2a2a38',
              boxShadow: isAiSpeaking
                ? `0 0 ${Math.max(20, modelAudioLevel * 50)}px rgba(0, 201, 141, 0.6)`
                : userAudioLevel > 0.05
                ? `0 0 ${Math.max(15, userAudioLevel * 40)}px rgba(232, 200, 114, 0.5)`
                : 'none',
              transform: `scale(${1 + Math.max(userAudioLevel, modelAudioLevel) * 0.25})`,
            }}
          >
            <img
              src={regeneratedImage}
              alt="Ghazi Wazir"
              className="w-20 h-20 rounded-full object-cover"
            />
          </div>

          <div className="font-serif font-bold text-sm text-white flex items-center gap-1.5">
            {sessionStatus === 'CONNECTING' && <span>Establishing Live Audio Session...</span>}
            {sessionStatus === 'CONNECTED' && (
              <>
                {isAiSpeaking ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <Volume2 className="w-4 h-4 animate-pulse" />
                    <span>Ghazi AI is Speaking (24kHz Live Voice)</span>
                  </span>
                ) : userAudioLevel > 0.05 ? (
                  <span className="text-[#e8c872] flex items-center gap-1.5">
                    <Mic className="w-4 h-4 animate-bounce" />
                    <span>Listening to your voice...</span>
                  </span>
                ) : micDenied ? (
                  <span className="text-cyan-300">Voice output ready — Type your question below</span>
                ) : (
                  <span className="text-[#a8a7b3]">Ready — Speak directly or ask any question</span>
                )}
              </>
            )}
            {sessionStatus === 'DISCONNECTED' && <span className="text-zinc-500">Session Closed</span>}
            {sessionStatus === 'ERROR' && <span className="text-red-400">Connection Issue</span>}
          </div>

          {/* Real-time Voice Activity Bar */}
          {!micDenied && sessionStatus === 'CONNECTED' && (
            <div className="flex items-center gap-1.5 mt-2 bg-[#14141d] px-3 py-1 rounded-full border border-[#2a2a38]">
              <Mic
                className={`w-3.5 h-3.5 ${
                  userAudioLevel > 0.05 ? 'text-emerald-400 animate-pulse' : 'text-[#a8a7b3]'
                }`}
              />
              <span className="text-[10px] text-[#a8a7b3]">
                {userAudioLevel > 0.05 ? 'Microphone picking up voice' : 'Microphone ready — Speak now'}
              </span>
              <div className="w-16 h-1.5 bg-[#2a2a38] rounded-full overflow-hidden ml-1">
                <div
                  className="h-full bg-emerald-400 transition-all duration-75 rounded-full"
                  style={{ width: `${Math.min(100, Math.max(8, userAudioLevel * 250))}%` }}
                />
              </div>
            </div>
          )}

          <p className="text-[11px] text-[#a8a7b3] max-w-sm mt-1">
            Grounded in Bahrain commercial law, MOIC decrees, foreign investor residency, and digital growth tech.
          </p>

          {/* Quick Voice Prompt Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
            {samplePrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  audioServiceRef.current?.ensureAudioContext();
                  if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                    wsRef.current.send(JSON.stringify({ text: p }));
                    setTranscripts((prev) => [
                      ...prev,
                      {
                        sender: 'user',
                        text: p,
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ]);
                  }
                }}
                className="text-[10px] text-[#e8c872] bg-[#14141d] hover:bg-[#1a1a26] border border-[#e8c872]/30 px-2.5 py-1 rounded-full cursor-pointer transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>

        {/* Live Conversation Transcript Feed */}
        <div
          ref={transcriptScrollRef}
          className="bg-[#0a0a0f] border border-[#2a2a38] rounded-2xl p-4 max-h-44 overflow-y-auto space-y-2.5 mb-4 text-xs"
        >
          {transcripts.map((t, i) => (
            <div
              key={i}
              className={`flex flex-col ${t.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3 ${
                  t.sender === 'user'
                    ? 'bg-[#e8c872]/20 border border-[#e8c872]/40 text-white rounded-tr-none'
                    : 'bg-[#14141d] border border-[#2a2a38] text-[#f5f1e8] rounded-tl-none'
                }`}
              >
                <div className="text-[10px] font-bold text-[#e8c872] mb-0.5">
                  {t.sender === 'user' ? 'You' : 'Ghazi Wazir (AI CEO Voice)'}
                </div>
                <p className="leading-relaxed">{t.text}</p>
              </div>
              <span className="text-[9px] text-[#777] mt-0.5 px-1">{t.time}</span>
            </div>
          ))}
        </div>

        {/* Controls Bar & Fallback Text Input */}
        <div className="space-y-3">
          <form onSubmit={handleSendTextMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Type any question to hear Ghazi's AI answer by voice..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              className="flex-1 bg-[#0a0a0f] border border-[#2a2a38] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#e8c872]"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || sessionStatus !== 'CONNECTED'}
              className="btn-gold px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#2a2a38]">
            <div className="flex items-center gap-2">
              {sessionStatus === 'CONNECTED' ? (
                <>
                  {!micDenied && (
                    <button
                      type="button"
                      onClick={() => setIsMicMuted(!isMicMuted)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        isMicMuted
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : 'bg-[#14141d] text-white border border-[#2a2a38] hover:border-[#e8c872]'
                      }`}
                    >
                      {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      <span>{isMicMuted ? 'Unmute Mic' : 'Mute Mic'}</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={disconnectVoiceSession}
                    className="px-3 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <PhoneOff className="w-3.5 h-3.5" />
                    <span>End Voice Session</span>
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={connectVoiceSession}
                  className="btn-gold px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Start Live Voice Session</span>
                </button>
              )}
            </div>

            {/* In-Call Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  disconnectVoiceSession();
                  onClose();
                  if (navigate) navigate('book');
                }}
                className="px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] hover:border-[#e8c872] text-xs text-white flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#e8c872]" />
                <span>Book 1-on-1</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  disconnectVoiceSession();
                  onClose();
                  if (navigate) navigate('packages');
                }}
                className="px-3 py-2 rounded-xl bg-[#0a0a0f] border border-[#2a2a38] hover:border-[#e8c872] text-xs text-white flex items-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>Pay Retainer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
