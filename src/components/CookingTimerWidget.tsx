import React, { useEffect, useState } from 'react';
import { Clock, Play, Pause, RotateCcw, X, Volume2, VolumeX, Bell } from 'lucide-react';
import { ActiveCookingTimer } from '../types';

interface CookingTimerWidgetProps {
  timers: ActiveCookingTimer[];
  onToggleTimer: (id: string) => void;
  onResetTimer: (id: string) => void;
  onDeleteTimer: (id: string) => void;
  onTickTimers: () => void;
}

export const CookingTimerWidget: React.FC<CookingTimerWidgetProps> = ({
  timers,
  onToggleTimer,
  onResetTimer,
  onDeleteTimer,
  onTickTimers,
}) => {
  const [minimized, setMinimized] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Play chime for completed timers
  const playAlert = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.2); // A5
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    const hasRunning = timers.some((t) => t.isRunning && t.remainingSeconds > 0);
    if (!hasRunning) return;

    const interval = setInterval(() => {
      onTickTimers();
    }, 1000);

    return () => clearInterval(interval);
  }, [timers, onTickTimers]);

  useEffect(() => {
    timers.forEach((t) => {
      if (t.remainingSeconds === 0 && t.isRunning) {
        playAlert();
      }
    });
  }, [timers]);

  if (timers.length === 0) return null;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      id="docked-timer-widget"
      className="no-print fixed bottom-4 right-4 z-40 max-w-sm w-full bg-[#1c1815] text-white rounded-2xl shadow-2xl border border-[#3e342c] overflow-hidden animate-slideUp"
    >
      {/* Header */}
      <div className="p-3 bg-[#26201b] border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 bg-[#c85a32] rounded-lg text-white">
            <Clock className="w-4 h-4" />
          </div>
          <span className="font-serif-display font-bold text-sm text-white">
            Kitchen Timers ({timers.length})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded-md text-white/70 hover:text-white hover:bg-white/10"
            title={soundEnabled ? 'Mute' : 'Unmute'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setMinimized(!minimized)}
            className="text-xs text-white/70 hover:text-white px-2 py-0.5 rounded hover:bg-white/10"
          >
            {minimized ? 'Expand' : 'Minimize'}
          </button>
        </div>
      </div>

      {/* Timer List */}
      {!minimized && (
        <div className="p-3 space-y-2.5 max-h-60 overflow-y-auto">
          {timers.map((t) => (
            <div
              key={t.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                t.remainingSeconds === 0
                  ? 'bg-red-950/60 border-red-500 animate-pulse'
                  : 'bg-white/5 border-white/10'
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {t.label}
                </p>
                {t.recipeTitle && (
                  <p className="text-[10px] text-[#b3a496] truncate">
                    {t.recipeTitle}
                  </p>
                )}
                <span className="font-mono text-lg font-bold text-[#ffc4a8]">
                  {formatTimer(t.remainingSeconds)}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => onToggleTimer(t.id)}
                  className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                    t.isRunning
                      ? 'bg-amber-600 hover:bg-amber-700 text-white'
                      : 'bg-[#c85a32] hover:bg-[#b04a25] text-white'
                  }`}
                  title={t.isRunning ? 'Pause' : 'Start'}
                >
                  {t.isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                </button>

                <button
                  onClick={() => onResetTimer(t.id)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Reset"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => onDeleteTimer(t.id)}
                  className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/10 transition-colors"
                  title="Remove Timer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
