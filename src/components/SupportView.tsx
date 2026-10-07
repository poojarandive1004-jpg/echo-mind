import React, { useState } from 'react';
import {
  LifeBuoy,
  PhoneCall,
  ShieldAlert,
  Heart,
  Wind,
  CheckCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SupportView: React.FC = () => {
  const { setIsBreathingOpen } = useApp();
  const [currentStep, setCurrentStep] = useState(0);

  const groundingSteps = [
    { count: '5', sense: 'Things you can SEE', desc: 'Look around you right now: notice the texture of your desk, the color of a leaf, light on a wall, your own shoes, or a book cover.' },
    { count: '4', sense: 'Things you can TOUCH or FEEL', desc: 'Feel the fabric of your sweater, the coolness of your keys, your feet resting firmly on the floor, or the smooth back of your phone.' },
    { count: '3', sense: 'Things you can HEAR', desc: 'Listen attentively: the hum of a computer fan, birds outside your window, or distant voices in a hallway.' },
    { count: '2', sense: 'Things you can SMELL', desc: 'Inhale gently: the scent of warm tea, laundry detergent, rain in the air, or hand lotion.' },
    { count: '1', sense: 'Thing you can TASTE or APPRECIATE', desc: 'Sip some cool water, notice the lingering taste of mint or tea, or whisper one kind word of appreciation to your heart.' },
  ];

  const helplines = [
    { country: 'India (Government National)', name: 'Tele-MANAS Comprehensive Mental Health Service', number: '14416 / 1800-891-4416', available: '24/7 • Free & Multi-lingual' },
    { country: 'India (Non-profit)', name: 'Vandrevala Foundation Helpline', number: '+91 9999 666 555', available: '24/7 • Free & Confidential' },
    { country: 'India (Govt Ministry of Social Justice)', name: 'KIRAN Helpline', number: '1800-599-0019', available: '24/7 • 13 Languages' },
    { country: 'USA & Canada', name: 'Suicide & Crisis Lifeline', number: 'Dial 988', available: '24/7 • Free & Confidential' },
    { country: 'UK', name: 'Samaritans', number: '116 123', available: '24/7 • Free call' },
    { country: 'International Crisis Text', name: 'Crisis Text Line', number: 'Text HOME to 741741', available: '24/7 Support via SMS' },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Warning Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300 shrink-0">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading text-rose-900 dark:text-rose-200">
            Emergency Care & Professional Human Support
          </h1>
          <p className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
            Echo Mind is an educational emotional wellness tool and companion. It is <strong>NOT a replacement for a licensed doctor, therapist, or emergency medical care</strong>. If you or someone you know is in acute distress or feeling unsafe, please reach out immediately to a trained crisis counselor.
          </p>
        </div>
      </div>

      {/* 24/7 Helplines Directory */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-5 h-5 text-pink-500" />
          <h2 className="text-lg font-bold font-heading text-stone-800 dark:text-stone-100">
            24/7 Free & Confidential Crisis Helplines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {helplines.map((hl, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-stone-50/70 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  {hl.country}
                </span>
                <h3 className="text-xs font-bold text-stone-800 dark:text-stone-200 mt-0.5">
                  {hl.name}
                </h3>
              </div>
              <div className="mt-3 pt-2 border-t border-stone-200/60 dark:border-stone-700 flex items-center justify-between">
                <span className="text-sm font-mono font-bold text-pink-600 dark:text-pink-400">
                  {hl.number}
                </span>
                <span className="text-[11px] text-stone-400">{hl.available}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive 5-4-3-2-1 Grounding Tool */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg font-bold font-heading text-stone-800 dark:text-stone-100">
              Interactive 5-4-3-2-1 Sensory Grounding Technique
            </h2>
          </div>
          <button
            onClick={() => setIsBreathingOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-semibold"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Open Breathing Pacer</span>
          </button>
        </div>

        <p className="text-xs text-stone-500 dark:text-stone-400">
          When panic or spiral thoughts take over, this somatic exercise brings your awareness gently back to the physical room.
        </p>

        <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-stone-800 dark:to-stone-850 border border-indigo-100 dark:border-stone-700 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500 text-white font-extrabold flex items-center justify-center text-lg">
              {groundingSteps[currentStep].count}
            </div>
            <div>
              <span className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                Step {currentStep + 1} of 5:
              </span>
              <h3 className="text-base font-bold text-stone-800 dark:text-stone-100 font-heading">
                {groundingSteps[currentStep].sense}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed pl-13">
            {groundingSteps[currentStep].desc}
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-indigo-100/60 dark:border-stone-700">
            <button
              onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
              disabled={currentStep === 0}
              className="text-xs text-stone-500 hover:text-stone-800 disabled:opacity-30"
            >
              Previous Step
            </button>
            <button
              onClick={() => setCurrentStep((p) => (p + 1) % groundingSteps.length)}
              className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              {currentStep === 4 ? 'Cycle Again' : 'Next Grounding Step'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
