import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Clock,
  Sparkles,
  Info,
  CheckCircle,
  ThermometerSun,
  ChefHat
} from 'lucide-react';
import { Recipe } from '../types';

interface CookingModeModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const CookingModeModal: React.FC<CookingModeModalProps> = ({ recipe, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [speaking, setSpeaking] = useState<boolean>(false);

  const step = recipe.steps[currentStepIndex];
  const totalSteps = recipe.steps.length;

  // Initialize step timer if defined
  useEffect(() => {
    if (step.timerSeconds) {
      setTimerSeconds(step.timerSeconds);
      setTimerRunning(false);
    } else {
      setTimerSeconds(0);
      setTimerRunning(false);
    }
  }, [currentStepIndex, step]);

  // Audio Chime
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.7);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.7);
    } catch {
      // Audio fallback
    }
  };

  // Timer Tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerRunning && timerSeconds === 0) {
      setTimerRunning(false);
      playChime();
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerSeconds]);

  // Text-To-Speech Step Reader
  const speakStep = () => {
    if (!('speechSynthesis' in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = `Step ${step.step}: ${step.title}. ${step.desc}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        if (currentStepIndex < totalSteps - 1) {
          setCurrentStepIndex((prev) => prev + 1);
        }
      } else if (e.key === 'ArrowLeft') {
        if (currentStepIndex > 0) {
          setCurrentStepIndex((prev) => prev - 1);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, [currentStepIndex, totalSteps, onClose]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = ((currentStepIndex + 1) / totalSteps) * 100;

  return (
    <div
      id="cooking-mode-modal"
      className="fixed inset-0 z-50 bg-[#171412] text-[#f7f2ed] flex flex-col justify-between overflow-y-auto"
    >
      {/* Top Header Bar */}
      <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-4 bg-[#1f1a17]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#c85a32] text-white flex items-center justify-center font-bold text-sm">
            {currentStepIndex + 1}/{totalSteps}
          </div>
          <div>
            <h2 className="font-serif-display font-bold text-lg sm:text-xl text-white tracking-tight line-clamp-1">
              {recipe.title}
            </h2>
            <p className="text-xs text-[#a99c90]">Hands-Free Interactive Cooking Mode</p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Read Aloud */}
          <button
            onClick={speakStep}
            className={`p-2.5 rounded-xl border transition-all text-xs font-semibold flex items-center gap-1.5 ${
              speaking
                ? 'bg-[#c85a32] text-white border-[#c85a32] animate-pulse'
                : 'bg-white/10 hover:bg-white/15 text-white/90 border-white/10'
            }`}
            title="Read Step Instructions Aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">{speaking ? 'Reading...' : 'Read Aloud'}</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 transition-colors"
            title={soundEnabled ? 'Mute Alert Sound' : 'Enable Alert Sound'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Close Modal */}
          <button
            id="exit-cooking-mode-btn"
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Exit Cooking Mode (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-white/10 h-1.5">
        <div
          className="bg-gradient-to-r from-[#c85a32] to-[#e6754b] h-1.5 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Center Main Step Body */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 sm:py-12 flex flex-col justify-center">
        
        {/* Step Badge & Time */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#ffaa80] bg-[#c85a32]/20 border border-[#c85a32]/40 px-3 py-1 rounded-full">
            Step {step.step} of {totalSteps}
          </span>
          <span className="text-xs text-white/70 bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#ffaa80]" />
            {step.time}
          </span>
          {step.temp && (
            <span className="text-xs font-bold text-[#ffb594] bg-white/10 px-3 py-1 rounded-full flex items-center gap-1.5">
              <ThermometerSun className="w-3.5 h-3.5 text-[#ff804a]" />
              {step.temp}
            </span>
          )}
        </div>

        {/* Step Title */}
        <h1 className="font-serif-display text-2xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
          {step.title}
        </h1>

        {/* Big Instruction Text */}
        <p className="text-lg sm:text-2xl text-[#ded4ca] font-normal leading-relaxed mb-8">
          {step.desc}
        </p>

        {/* Step Timer if present */}
        {step.timerSeconds && (
          <div className="mb-8 p-5 sm:p-6 bg-white/5 border border-white/15 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#c85a32] text-white flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <span className="font-mono text-3xl sm:text-4xl font-bold text-[#ffbe9e] tracking-tight">
                  {formatTimer(timerSeconds)}
                </span>
                <p className="text-xs text-[#a99c90]">Step Timer</p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`flex-1 sm:flex-initial px-6 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  timerRunning
                    ? 'bg-amber-600 hover:bg-amber-700 text-white'
                    : 'bg-[#c85a32] hover:bg-[#b04a25] text-white'
                }`}
              >
                {timerRunning ? (
                  <>
                    <Pause className="w-4 h-4" /> Pause
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" /> Start Timer
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(step.timerSeconds || 0);
                }}
                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Chef Secret / Pro Tip Callout in Dark Theme */}
        {step.secret && (
          <div className="p-4 sm:p-5 bg-[#2a221c] rounded-2xl border border-[#523d30] flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-[#ff9c6b] shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#ff9c6b] mb-1">
                Chef's Secret
              </p>
              <p className="text-sm text-[#e6dcd3] leading-relaxed">
                {step.secret}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-4 sm:p-6 border-t border-white/10 bg-[#1f1a17] flex items-center justify-between gap-4">
        <button
          onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
          disabled={currentStepIndex === 0}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
            currentStepIndex === 0
              ? 'opacity-30 cursor-not-allowed bg-white/5 text-white/50'
              : 'bg-white/10 hover:bg-white/20 text-white active:scale-95'
          }`}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="hidden xs:inline">Previous Step</span>
        </button>

        <div className="text-xs text-[#9d9084] font-medium hidden sm:block">
          Use Left/Right arrow keys to navigate
        </div>

        {currentStepIndex < totalSteps - 1 ? (
          <button
            onClick={() => setCurrentStepIndex((prev) => Math.min(totalSteps - 1, prev + 1))}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#c85a32] hover:bg-[#b04a25] text-white font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <span>Next Step</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold text-sm transition-all shadow-md active:scale-95"
          >
            <CheckCircle className="w-5 h-5" />
            <span>Finish Recipe</span>
          </button>
        )}
      </div>
    </div>
  );
};
