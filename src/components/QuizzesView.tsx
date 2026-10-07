import React, { useState } from 'react';
import {
  Sparkles,
  Heart,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Share2,
  Check,
  Award,
  Shield,
  HelpCircle,
  Battery,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { QUIZZES } from '../data/assessmentsAndQuizzes';
import { Quiz, QuizVibeResult } from '../types';

export const QuizzesView: React.FC = () => {
  const { quizResults, submitQuizResult, setActiveTab, setNotification } = useApp();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [resultVibe, setResultVibe] = useState<QuizVibeResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentIdx(0);
    setSelectedVibes([]);
    setResultVibe(null);
  };

  const handleSelectOption = (vibeTag: string) => {
    setSelectedVibes((prev) => {
      const next = [...prev];
      next[currentIdx] = vibeTag;
      return next;
    });
  };

  const handleNext = async () => {
    if (!activeQuiz) return;

    if (currentIdx < activeQuiz.questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      // Calculate dominant vibe tag
      setIsSubmitting(true);
      const frequency: Record<string, number> = {};
      selectedVibes.forEach((v) => {
        frequency[v] = (frequency[v] || 0) + 1;
      });

      let topVibeKey = Object.keys(frequency)[0] || Object.keys(activeQuiz.results)[0];
      let maxCount = 0;
      for (const [k, c] of Object.entries(frequency)) {
        if (c > maxCount) {
          maxCount = c;
          topVibeKey = k;
        }
      }

      const vibeData = activeQuiz.results[topVibeKey] || Object.values(activeQuiz.results)[0];
      setResultVibe(vibeData);

      try {
        await submitQuizResult({
          quizId: activeQuiz.id,
          quizTitle: activeQuiz.title,
          resultKey: vibeData.key,
          resultTitle: vibeData.title,
          resultSubtitle: vibeData.subtitle,
          badge: vibeData.badge,
          description: vibeData.description,
          advice: vibeData.advice,
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleShareResult = () => {
    if (navigator.clipboard && resultVibe) {
      navigator.clipboard.writeText(
        `I just took the "${activeQuiz?.title}" quiz on Echo Mind and got: ${resultVibe.badge} (${resultVibe.title})! 🌸`
      );
      setNotification({ message: 'Result text copied to clipboard! Share the lovely vibe ✨', type: 'success' });
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-stone-800 dark:text-stone-100">
              Interactive Self-Reflection Quizzes
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Playful, compassionate personality and emotional reflections to brighten your day and unpack your coping style.
          </p>
        </div>

        {activeQuiz && (
          <button
            onClick={() => setActiveQuiz(null)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Quizzes</span>
          </button>
        )}
      </div>

      {/* Active Quiz Card / Result */}
      {activeQuiz ? (
        <div className="max-w-2xl mx-auto">
          {resultVibe ? (
            /* Result Card */
            <div className={`p-6 sm:p-8 rounded-3xl ${resultVibe.colorScheme.bg} dark:bg-stone-900 border ${resultVibe.colorScheme.border} dark:border-stone-800 shadow-xl space-y-6 text-center animate-fadeIn`}>
              <div className="space-y-2">
                <span className="text-4xl block my-1">
                  {resultVibe.badge.split(' ')[0]}
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  Your Reflection Result
                </span>
                <h2 className={`text-2xl sm:text-3xl font-bold font-heading ${resultVibe.colorScheme.text} dark:text-pink-300`}>
                  {resultVibe.title}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-stone-600 dark:text-stone-300">
                  {resultVibe.subtitle}
                </p>
              </div>

              {/* Description */}
              <div className="p-5 rounded-2xl bg-white/80 dark:bg-stone-800/80 border border-white dark:border-stone-700 text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed text-left">
                {resultVibe.description}
              </div>

              {/* Gentle Reflection Advice */}
              <div className="p-4 rounded-2xl bg-pink-100/60 dark:bg-pink-950/40 border border-pink-200/60 dark:border-pink-900/40 text-xs text-stone-800 dark:text-pink-200 text-left space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-pink-700 dark:text-pink-300 text-[11px] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Echo's Reflective Advice:
                </span>
                <p className="leading-relaxed">
                  {resultVibe.advice}
                </p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-stone-200/60 dark:border-stone-800">
                <button
                  onClick={() => handleStartQuiz(activeQuiz)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-white/60 dark:hover:bg-stone-800 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Play Again</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleShareResult}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium hover:bg-stone-50"
                  >
                    <Share2 className="w-3.5 h-3.5 text-pink-500" />
                    <span>Copy Badge</span>
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="px-5 py-2 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-xs font-semibold"
                  >
                    Explore More Quizzes
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Quiz Questions */
            <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-md space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>Question {currentIdx + 1} of {activeQuiz.questions.length}</span>
                  <span>{activeQuiz.title}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / activeQuiz.questions.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="py-2">
                <h3 className="text-lg sm:text-xl font-bold font-heading text-stone-800 dark:text-stone-100 leading-snug">
                  {activeQuiz.questions[currentIdx].text}
                </h3>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeQuiz.questions[currentIdx].options.map((opt) => {
                  const isSelected = selectedVibes[currentIdx] === opt.vibeTag;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleSelectOption(opt.vibeTag)}
                      className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-400 text-amber-900 dark:text-amber-200 shadow-xs scale-101'
                          : 'bg-stone-50/50 dark:bg-stone-800/40 border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100/70 dark:hover:bg-stone-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl">{opt.emoji || '✨'}</span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-amber-500 bg-amber-500' : 'border-stone-300'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <span className="text-xs sm:text-sm font-medium leading-snug">
                        {opt.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  disabled={currentIdx === 0}
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-medium text-stone-500 hover:text-stone-800 disabled:opacity-30"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedVibes[currentIdx] || isSubmitting}
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 hover:from-amber-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-amber-200/50 dark:shadow-none transition-all active:scale-95 disabled:opacity-40"
                >
                  <span>{currentIdx === activeQuiz.questions.length - 1 ? (isSubmitting ? 'Revealing Vibe...' : 'Reveal My Vibe!') : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Catalog */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {QUIZZES.map((quiz) => {
            const past = quizResults.find((r) => r.quizId === quiz.id);

            return (
              <div
                key={quiz.id}
                className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xl group-hover:scale-105 transition-transform">
                      <Sparkles className="w-5 h-5 text-amber-500" />
                    </div>
                    {past && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200">
                        {past.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-medium mb-2">
                    {quiz.tagline}
                  </p>
                  <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 dark:border-stone-800 space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>{quiz.questions.length} questions</span>
                    <span>Self-reflection badge</span>
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-stone-800 dark:hover:bg-stone-750 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>{past ? 'Play Again' : 'Play Quiz'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Badges Collection Showcase */}
      {quizResults.length > 0 && !activeQuiz && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100">
              Your Earned Vibe Badges
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {quizResults.map((qr) => (
              <div
                key={qr.id}
                className="p-4 rounded-2xl bg-amber-50/50 dark:bg-stone-800/40 border border-amber-100 dark:border-stone-800 space-y-1"
              >
                <span className="text-sm font-bold text-amber-900 dark:text-amber-300 block">
                  {qr.badge}
                </span>
                <span className="text-xs font-semibold text-stone-800 dark:text-stone-200 block">
                  {qr.resultTitle}
                </span>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 line-clamp-2">
                  {qr.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
