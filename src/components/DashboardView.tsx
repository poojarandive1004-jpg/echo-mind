import React, { useState } from 'react';
import {
  Heart,
  BookOpen,
  LineChart,
  ClipboardList,
  Sparkles,
  MessageCircle,
  Plus,
  ArrowRight,
  Smile,
  Calendar,
  Clock,
  TrendingUp,
  RefreshCw,
  Wind,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MoodType } from '../types';

export const DashboardView: React.FC = () => {
  const {
    user,
    journals,
    moodLogs,
    moodStats,
    assessmentResults,
    quizResults,
    setActiveTab,
    setIsBreathingOpen,
    addMoodCheckIn,
  } = useApp();

  const [quickMood, setQuickMood] = useState<MoodType | null>(null);
  const [quickNote, setQuickNote] = useState<string>('');
  const [isSubmittingMood, setIsSubmittingMood] = useState(false);

  // Daily positive affirmations bank
  const affirmations = [
    "You don't have to carry the whole semester at once. You only need to breathe through this moment.",
    'Your intelligence and character are far greater than any difficult code bug or exam score.',
    'Rest is not a reward you have to earn; it is the vital soil where your thoughts blossom.',
    'Give yourself permission to be a work in progress, blooming quietly at your own pace.',
    'Gentle progress each day is far more sustainable than harsh perfection.',
  ];
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(0);

  const handleNextAffirmation = () => {
    setCurrentAffirmationIndex((prev) => (prev + 1) % affirmations.length);
  };

  const handleQuickMoodSubmit = async (mood: MoodType) => {
    setQuickMood(mood);
    setIsSubmittingMood(true);
    try {
      await addMoodCheckIn(mood, undefined, quickNote || 'Quick dashboard check-in');
      setQuickNote('');
    } finally {
      setIsSubmittingMood(false);
    }
  };

  const moodColors: Record<MoodType, { bg: string; text: string; dot: string; border: string }> = {
    Happy: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: '#10B981', border: 'border-emerald-200 dark:border-emerald-900/60' },
    Calm: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', dot: '#0EA5E9', border: 'border-sky-200 dark:border-sky-900/60' },
    Neutral: { bg: 'bg-stone-50 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300', dot: '#78716C', border: 'border-stone-200 dark:border-stone-700' },
    Sad: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', dot: '#6366F1', border: 'border-indigo-200 dark:border-indigo-900/60' },
    Anxious: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: '#F59E0B', border: 'border-amber-200 dark:border-amber-900/60' },
    Stressed: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', dot: '#F43F5E', border: 'border-rose-200 dark:border-rose-900/60' },
  };

  const latestMoodName = (moodStats.latestMood?.mood as MoodType) || 'Calm';
  const latestMoodStyling = moodColors[latestMoodName] || moodColors.Calm;

  // Compute 7-day trend data points
  const recentLogs = [...moodLogs].reverse().slice(-7);
  const chartPoints = recentLogs.length > 0 ? recentLogs : [
    { mood: 'Calm', score: 7.5, timestamp: new Date().toISOString() },
    { mood: 'Happy', score: 8.5, timestamp: new Date().toISOString() },
    { mood: 'Neutral', score: 6.0, timestamp: new Date().toISOString() },
    { mood: 'Calm', score: 7.8, timestamp: new Date().toISOString() },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-100/70 via-rose-50/80 to-purple-100/60 dark:from-stone-900 dark:via-stone-900 dark:to-stone-800 border border-pink-200/60 dark:border-stone-800 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-white dark:bg-stone-800 shadow-sm flex items-center justify-center text-3xl border border-pink-100 dark:border-stone-700">
            {user?.avatar || '🌸'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-stone-800 dark:text-stone-100">
                Welcome, {user?.name || 'Aria'} 🌸
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 mt-1 max-w-md">
              {user?.reflectionGoal || 'Take a deep breath and let your thoughts find gentle rest today.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('journal')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Write in Diary</span>
          </button>
          <button
            onClick={() => setIsBreathingOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-200 hover:bg-stone-50 text-xs font-medium transition-colors"
          >
            <Wind className="w-3.5 h-3.5 text-pink-500" />
            <span>Breathing Pacer</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Latest Detected Mood */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span>Latest Mood</span>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: latestMoodStyling.dot }} />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100">
              {moodStats.latestMood ? moodStats.latestMood.mood : 'Calm'}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">
            Score: {moodStats.latestMood ? moodStats.latestMood.score : 7.8} / 10
          </span>
        </div>

        {/* Total Journal Entries */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span>Diary Reflections</span>
            <BookOpen className="w-4 h-4 text-pink-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100 tabular-nums">
              {journals.length}
            </span>
            <span className="text-xs text-stone-400">entries</span>
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">
            Safe & private to your account
          </span>
        </div>

        {/* Completed Assessments */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span>Self-Assessments</span>
            <ClipboardList className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100 tabular-nums">
              {assessmentResults.length}
            </span>
            <span className="text-xs text-stone-400">completed</span>
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">
            Stress, Anxiety & Rest checks
          </span>
        </div>

        {/* Completed Quizzes */}
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 mb-2">
            <span>Vibe Quizzes</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100 tabular-nums">
              {quizResults.length}
            </span>
            <span className="text-xs text-stone-400">badges earned</span>
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">
            Personality reflections
          </span>
        </div>
      </div>

      {/* Main Grid: Visual Graphs & Quick Check-in */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Weekly Emotional Flow SVG Chart (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100">
                Emotional Equilibrium Rhythm
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Score progression (1 to 10) across recent journal and mood check-ins
              </p>
            </div>
            <button
              onClick={() => setActiveTab('moods')}
              className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="h-56 w-full pt-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
              {/* Horizontal guide lines */}
              <line x1="0" y1="20" x2="500" y2="20" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeDasharray="3 3" />
              <line x1="0" y1="70" x2="500" y2="70" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeDasharray="3 3" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeDasharray="3 3" />

              {/* Data points math */}
              {(() => {
                const step = 500 / Math.max(1, chartPoints.length - 1);
                const coords = chartPoints.map((pt, i) => {
                  const x = i * step;
                  // Map score 1-10 to y 140 -> 20
                  const y = 140 - ((pt.score - 1) / 9) * 120;
                  return { x, y, pt };
                });

                const linePath = coords.reduce((acc, c, i) => {
                  return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
                }, '');

                const areaPath = coords.length > 0
                  ? `${linePath} L ${coords[coords.length - 1].x} 150 L ${coords[0].x} 150 Z`
                  : '';

                return (
                  <>
                    {/* Fill Area Gradient */}
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F472B6" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#DDD6FE" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#curveGradient)" />
                    <path d={linePath} fill="none" stroke="#EC4899" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {coords.map((c, idx) => (
                      <g key={idx} className="group cursor-pointer">
                        <circle
                          cx={c.x}
                          cy={c.y}
                          r="5"
                          className="fill-white dark:fill-stone-900 stroke-pink-500 stroke-2 hover:r-7 transition-all"
                        />
                        <text
                          x={c.x}
                          y={c.y - 10}
                          textAnchor="middle"
                          className="text-[10px] fill-stone-500 dark:fill-stone-400 font-mono font-medium"
                        >
                          {c.pt.score}
                        </text>
                      </g>
                    ))}
                  </>
                );
              })()}
            </svg>

            {/* Bottom X-Labels */}
            <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-mono">
              {chartPoints.map((pt, idx) => (
                <span key={idx}>
                  {new Date(pt.timestamp).toLocaleDateString([], { weekday: 'short' })}
                </span>
              ))}
            </div>
          </div>

          {/* Mood Distribution Bar Breakdown */}
          <div className="mt-6 pt-6 border-t border-stone-100 dark:border-stone-800">
            <h3 className="text-xs font-semibold text-stone-700 dark:text-stone-300 mb-3">
              Mood Category Distribution
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
              {(['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Stressed'] as MoodType[]).map((mKey) => {
                const count = moodStats.counts[mKey] || 0;
                const styling = moodColors[mKey];
                return (
                  <div key={mKey} className={`p-2.5 rounded-2xl ${styling.bg} border ${styling.border}`}>
                    <span className="text-[11px] block font-medium opacity-80">{mKey}</span>
                    <span className={`text-base font-bold font-heading ${styling.text}`}>
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Quick Mood Check-In & Daily Affirmation */}
        <div className="space-y-6">
          {/* Quick Check-in Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
            <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
              How are you feeling right now?
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Tap a feeling to record your current emotional pulse.
            </p>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {(['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Stressed'] as MoodType[]).map((m) => (
                <button
                  key={m}
                  onClick={() => handleQuickMoodSubmit(m)}
                  disabled={isSubmittingMood}
                  className={`py-2 px-2 rounded-xl text-xs font-medium border text-center transition-all active:scale-95 ${
                    quickMood === m
                      ? 'bg-pink-100 dark:bg-pink-950 text-pink-800 dark:text-pink-200 border-pink-300'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-pink-50/50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <input
              type="text"
              placeholder="Optional: add a short note..."
              value={quickNote}
              onChange={(e) => setQuickNote(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-pink-300 mb-3"
            />
            <p className="text-[10px] text-stone-400 text-center">
              Recorded instantly to your mood history and analytics.
            </p>
          </div>

          {/* Daily Affirmation Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-tr from-pink-50 via-rose-50/60 to-purple-50 dark:from-stone-900 dark:to-stone-800/80 border border-pink-100 dark:border-stone-800 relative shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300">
                Daily Gentle Affirmation
              </span>
              <button
                onClick={handleNextAffirmation}
                className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
                title="Next affirmation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-xs text-stone-700 dark:text-stone-200 italic leading-relaxed">
              "{affirmations[currentAffirmationIndex]}"
            </p>
          </div>
        </div>
      </div>

      {/* Quick Launchpad & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Launchpad Buttons (1 col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs space-y-2.5">
          <h2 className="text-sm font-bold font-heading text-stone-800 dark:text-stone-100 mb-3">
            Quick Actions
          </h2>
          <button
            onClick={() => setActiveTab('journal')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-pink-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-pink-500" />
              <span>Write a New Diary Entry</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            onClick={() => setActiveTab('echo')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-pink-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-rose-500" />
              <span>Talk to Companion Echo</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            onClick={() => setActiveTab('assessments')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-pink-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList className="w-4 h-4 text-purple-500" />
              <span>Take a Self-Assessment</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className="w-full flex items-center justify-between p-3 rounded-2xl bg-stone-50 dark:bg-stone-800/60 hover:bg-pink-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-medium transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Play Interactive Vibe Quiz</span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

        {/* Recent Journal Reflections Timeline (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold font-heading text-stone-800 dark:text-stone-100">
              Recent Diary Entries & Detected Tones
            </h2>
            <button
              onClick={() => setActiveTab('journal')}
              className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline"
            >
              View All ({journals.length})
            </button>
          </div>

          {journals.length === 0 ? (
            <div className="py-8 text-center text-xs text-stone-400">
              Your diary is waiting for its first gentle entry.
            </div>
          ) : (
            <div className="space-y-3">
              {journals.slice(0, 3).map((entry) => {
                const styling = moodColors[entry.detectedMood] || moodColors.Neutral;
                return (
                  <div
                    key={entry.id}
                    onClick={() => setActiveTab('journal')}
                    className="p-4 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 hover:bg-pink-50/50 dark:hover:bg-stone-800 border border-stone-100 dark:border-stone-800 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate max-w-sm">
                        {entry.title}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${styling.bg} ${styling.text}`}>
                          {entry.detectedMood} ({entry.sentimentScore}/10)
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-400 line-clamp-2 leading-relaxed">
                      {entry.content}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
