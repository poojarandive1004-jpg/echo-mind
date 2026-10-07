import React, { useState, useEffect } from 'react';
import { X, Sparkles, Heart, Pause, Play, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BreathingPacerModal: React.FC = () => {
  const { isBreathingOpen, setIsBreathingOpen } = useApp();
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [secondsLeft, setSecondsLeft] = useState<number>(4);
  const [isActive, setIsActive] = useState<boolean>(true);
  const [cycleCount, setCycleCount] = useState<number>(0);

  useEffect(() => {
    if (!isBreathingOpen || !isActive) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev > 1) return prev - 1;

        // Transition phases
        if (phase === 'Inhale') {
          setPhase('Hold');
          return 4;
        } else if (phase === 'Hold') {
          setPhase('Exhale');
          return 4;
        } else if (phase === 'Exhale') {
          setPhase('Rest');
          return 4;
        } else {
          setPhase('Inhale');
          setCycleCount((c) => c + 1);
          return 4;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBreathingOpen, isActive, phase]);

  if (!isBreathingOpen) return null;

  const phaseInstruction = {
    Inhale: 'Breathe in slowly through your nose... filling your chest with gentle light',
    Hold: 'Gently hold this breath... letting stillness settle into your body',
    Exhale: 'Slowly release through parted lips... melting away tension and hurry',
    Rest: 'Rest in this peaceful emptiness... safe, calm, and grounded',
  }[phase];

  const phaseColor = {
    Inhale: 'from-pink-300 to-rose-300 text-rose-800 border-pink-200',
    Hold: 'from-purple-300 to-indigo-300 text-purple-800 border-purple-200',
    Exhale: 'from-sky-300 to-cyan-300 text-sky-800 border-sky-200',
    Rest: 'from-emerald-200 to-teal-300 text-teal-800 border-teal-200',
  }[phase];

  const scaleClass = {
    Inhale: 'scale-110',
    Hold: 'scale-110',
    Exhale: 'scale-90',
    Rest: 'scale-90',
  }[phase];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-8 bg-white/95 dark:bg-stone-900/95 border border-pink-100 dark:border-stone-800 rounded-3xl shadow-2xl text-center overflow-hidden">
        {/* Soft background aura */}
        <div className="absolute -top-20 -left-20 w-52 h-52 bg-pink-200/50 dark:bg-pink-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-52 h-52 bg-purple-200/50 dark:bg-purple-900/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={() => setIsBreathingOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          aria-label="Close breathing modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 text-xs font-semibold rounded-full border border-pink-100 dark:border-pink-900/50">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Echo's Box Breathing Guide</span>
        </div>

        <h3 className="text-xl font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
          Gentle 4-4-4-4 Nervous System Reset
        </h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mb-8 max-w-xs mx-auto">
          Synchronize your breath to calm your heart rate and ease study tension.
        </p>

        {/* Breathing Orb */}
        <div className="relative flex items-center justify-center w-52 h-52 mx-auto my-4">
          <div
            className={`absolute inset-0 rounded-full bg-gradient-to-tr ${phaseColor} opacity-30 blur-xl transition-all duration-1000 ${scaleClass}`}
          />
          <div
            className={`w-44 h-44 rounded-full bg-gradient-to-br ${phaseColor} shadow-inner flex flex-col items-center justify-center transition-all duration-1000 ease-in-out border-4 ${scaleClass}`}
          >
            <span className="text-xs font-bold uppercase tracking-wider mb-0.5 opacity-80">
              {phase}
            </span>
            <span className="text-5xl font-extrabold font-heading tabular-nums">
              {secondsLeft}s
            </span>
            <span className="text-[10px] opacity-75 mt-1 font-medium">
              Cycle {cycleCount + 1}
            </span>
          </div>
        </div>

        {/* Dynamic prompt */}
        <p className="text-sm font-medium text-stone-700 dark:text-stone-300 min-h-[44px] flex items-center justify-center px-4 mb-6">
          {phaseInstruction}
        </p>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsActive(!isActive)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-medium text-xs shadow-md shadow-pink-200/50 dark:shadow-none transition-all active:scale-95"
          >
            {isActive ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Resume
              </>
            )}
          </button>
          <button
            onClick={() => {
              setPhase('Inhale');
              setSecondsLeft(4);
              setCycleCount(0);
              setIsActive(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 text-xs font-medium hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>
    </div>
  );
};
