import React, { useState } from 'react';
import {
  LineChart as ChartIcon,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  Plus,
  Smile,
  Heart,
  BarChart2,
  PieChart,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MoodType, MoodLog } from '../types';

export const MoodAnalyticsView: React.FC = () => {
  const { moodLogs, moodStats, addMoodCheckIn, setActiveTab } = useApp();

  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d' | 'all'>('7d');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('All');
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [newMood, setNewMood] = useState<MoodType>('Calm');
  const [newScore, setNewScore] = useState<number>(8);
  const [newNotes, setNewNotes] = useState<string>('');
  const [isLogging, setIsLogging] = useState<boolean>(false);

  const moodColors: Record<MoodType, { bg: string; text: string; dot: string; bar: string; border: string }> = {
    Happy: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', dot: '#10B981', bar: 'bg-emerald-400', border: 'border-emerald-200' },
    Calm: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', dot: '#0EA5E9', bar: 'bg-sky-400', border: 'border-sky-200' },
    Neutral: { bg: 'bg-stone-50 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300', dot: '#78716C', bar: 'bg-stone-400', border: 'border-stone-200' },
    Sad: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', dot: '#6366F1', bar: 'bg-indigo-400', border: 'border-indigo-200' },
    Anxious: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', dot: '#F59E0B', bar: 'bg-amber-400', border: 'border-amber-200' },
    Stressed: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', dot: '#F43F5E', bar: 'bg-rose-400', border: 'border-rose-200' },
  };

  // Filter logs by timeframe
  const now = new Date().getTime();
  const filteredLogs = moodLogs.filter((log) => {
    const logTime = new Date(log.timestamp).getTime();
    const diffDays = (now - logTime) / (1000 * 60 * 60 * 24);

    let withinRange = true;
    if (timeframe === '7d') withinRange = diffDays <= 7;
    else if (timeframe === '14d') withinRange = diffDays <= 14;
    else if (timeframe === '30d') withinRange = diffDays <= 30;

    const matchesMood = selectedMoodFilter === 'All' || log.mood === selectedMoodFilter;
    return withinRange && matchesMood;
  });

  // Calculate timeframe stats
  const totalLogs = filteredLogs.length;
  const avgScore =
    totalLogs > 0
      ? Math.round((filteredLogs.reduce((acc, m) => acc + (m.score || 5), 0) / totalLogs) * 10) / 10
      : 7.0;

  // Mood counts for filtered
  const counts: Record<string, number> = {
    Happy: 0,
    Calm: 0,
    Neutral: 0,
    Sad: 0,
    Anxious: 0,
    Stressed: 0,
  };
  filteredLogs.forEach((l) => {
    if (counts[l.mood] !== undefined) counts[l.mood]++;
  });

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    try {
      await addMoodCheckIn(newMood, newScore, newNotes || 'Manual reflection check-in');
      setNewNotes('');
      setIsCheckInOpen(false);
    } finally {
      setIsLogging(false);
    }
  };

  // Prepare chart coordinates
  const reversedLogs = [...filteredLogs].reverse();
  const chartPoints = reversedLogs.length > 0 ? reversedLogs : [
    { mood: 'Calm' as MoodType, score: 7.5, timestamp: new Date().toISOString() },
    { mood: 'Happy' as MoodType, score: 8.5, timestamp: new Date().toISOString() },
  ];

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300">
              <ChartIcon className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-stone-800 dark:text-stone-100">
              Mood History & Analytics
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Observe your emotional landscape over time. Recognize natural rhythms, triggers, and peaceful recoveries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Timeframe selector */}
          <div className="flex p-1 bg-stone-100 dark:bg-stone-800 rounded-2xl">
            {(['7d', '14d', '30d', 'all'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                  timeframe === tf
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-2xs'
                    : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
              >
                {tf === '7d' ? '7 Days' : tf === '14d' ? '14 Days' : tf === '30d' ? '30 Days' : 'All'}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsCheckInOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold text-xs shadow-sm hover:from-pink-500 hover:to-rose-500 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Log Check-In</span>
          </button>
        </div>
      </div>

      {/* Manual Check-in Modal */}
      {isCheckInOpen && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-pink-200 dark:border-stone-800 shadow-xl space-y-4 animate-fadeIn max-w-xl mx-auto">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100 dark:border-stone-800">
            <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100">
              Record a Dedicated Mood Check-In
            </h3>
            <button
              onClick={() => setIsCheckInOpen(false)}
              className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 text-xs font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleManualCheckIn} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1.5">
                Select Current Emotion
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Stressed'] as MoodType[]).map((m) => {
                  const isSelected = newMood === m;
                  const styling = moodColors[m];
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => {
                        setNewMood(m);
                        const presetScores: Record<MoodType, number> = {
                          Happy: 9,
                          Calm: 8,
                          Neutral: 6,
                          Sad: 3,
                          Anxious: 4,
                          Stressed: 3,
                        };
                        setNewScore(presetScores[m]);
                      }}
                      className={`py-2 px-2 text-xs font-medium rounded-xl border transition-all ${
                        isSelected
                          ? `${styling.bg} ${styling.text} border-pink-400 font-bold shadow-xs`
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                <span>Subjective Equilibrium Score</span>
                <span className="font-mono text-pink-600 dark:text-pink-400">{newScore} / 10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={newScore}
                onChange={(e) => setNewScore(parseFloat(e.target.value))}
                className="w-full accent-pink-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
                <span>1 (Heavy / Depleted)</span>
                <span>5 (Neutral)</span>
                <span>10 (Radiant / Joyful)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Reflection Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Practicing my BCA viva speech with coffee..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-pink-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLogging}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold text-xs shadow-md shadow-pink-200/50 dark:shadow-none transition-all active:scale-95"
            >
              {isLogging ? 'Logging...' : 'Save Check-In to Timeline'}
            </button>
          </form>
        </div>
      )}

      {/* Analytics Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <span className="text-xs text-stone-400 block mb-1">Average Equilibrium Score</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-stone-800 dark:text-stone-100 tabular-nums">
              {avgScore}
            </span>
            <span className="text-xs text-stone-400">/ 10</span>
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">
            Calculated across {totalLogs} data points
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <span className="text-xs text-stone-400 block mb-1">Dominant Mood in Period</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-stone-800 dark:text-stone-100">
              {Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'Calm'}
            </span>
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">
            Most frequent emotional state
          </span>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <span className="text-xs text-stone-400 block mb-1">Total Logs Recorded</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-heading text-stone-800 dark:text-stone-100 tabular-nums">
              {totalLogs}
            </span>
            <span className="text-xs text-stone-400">logs</span>
          </div>
          <span className="text-[11px] text-stone-400 block mt-1">
            From journals & direct check-ins
          </span>
        </div>
      </div>

      {/* Main Graph & Distribution Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Longitudinal Graph (2 cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100">
                Emotional Trajectory Curve
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Visualizing peaks of inspiration and dips into fatigue
              </p>
            </div>
            <span className="text-xs text-stone-400 font-mono">
              {chartPoints.length} events
            </span>
          </div>

          {/* SVG Chart */}
          <div className="h-64 w-full pt-4 relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 600 180">
              <line x1="0" y1="20" x2="600" y2="20" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="600" y2="80" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeDasharray="3 3" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="currentColor" className="text-stone-100 dark:text-stone-800" strokeDasharray="3 3" />

              {(() => {
                const step = 600 / Math.max(1, chartPoints.length - 1);
                const coords = chartPoints.map((pt, i) => {
                  const x = i * step;
                  const y = 160 - ((pt.score - 1) / 9) * 140;
                  return { x, y, pt };
                });

                const linePath = coords.reduce((acc, c, i) => {
                  return i === 0 ? `M ${c.x} ${c.y}` : `${acc} L ${c.x} ${c.y}`;
                }, '');

                const areaPath = coords.length > 0
                  ? `${linePath} L ${coords[coords.length - 1].x} 175 L ${coords[0].x} 175 Z`
                  : '';

                return (
                  <>
                    <defs>
                      <linearGradient id="analyticsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#C084FC" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#F472B6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d={areaPath} fill="url(#analyticsGrad)" />
                    <path d={linePath} fill="none" stroke="#A855F7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

                    {coords.map((c, idx) => {
                      const dotCol = moodColors[c.pt.mood as MoodType]?.dot || '#A855F7';
                      return (
                        <g key={idx} className="group cursor-pointer">
                          <circle
                            cx={c.x}
                            cy={c.y}
                            r="5"
                            fill="#FFFFFF"
                            stroke={dotCol}
                            strokeWidth="3"
                          />
                          <text
                            x={c.x}
                            y={c.y - 12}
                            textAnchor="middle"
                            className="text-[10px] fill-stone-600 dark:fill-stone-300 font-mono font-medium"
                          >
                            {c.pt.score}
                          </text>
                        </g>
                      );
                    })}
                  </>
                );
              })()}
            </svg>

            <div className="flex justify-between text-[10px] text-stone-400 mt-2 font-mono">
              {chartPoints.map((pt, idx) => (
                <span key={idx}>
                  {new Date(pt.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Mood Distribution Progress Bars (1 col) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100">
              Distribution Breakdown
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Proportion of entries by detected emotion
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {(['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Stressed'] as MoodType[]).map((mKey) => {
              const count = counts[mKey] || 0;
              const pct = totalLogs > 0 ? Math.round((count / totalLogs) * 100) : 0;
              const styling = moodColors[mKey];

              return (
                <div key={mKey} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700 dark:text-stone-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: styling.dot }} />
                      <span>{mKey}</span>
                    </span>
                    <span className="font-mono text-stone-500 dark:text-stone-400">
                      {count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${styling.bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-stone-100 dark:border-stone-800 text-[11px] text-stone-500 dark:text-stone-400">
            💡 <strong>Pattern insight:</strong> Peaks in anxious and stressed moods align with mid-week college assignments. Weekly Sunday reflections show consistent recovery to Calm.
          </div>
        </div>
      </div>

      {/* Mood History Timeline Log Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
          <div>
            <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100">
              Detailed Mood Log History
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Every data point collected from journals, manual check-ins, and self-checks
            </p>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto">
            {['All', 'Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Stressed'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMoodFilter(m)}
                className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                  selectedMoodFilter === m
                    ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200 font-semibold'
                    : 'text-stone-500 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredLogs.map((log) => {
            const styling = moodColors[log.mood as MoodType] || moodColors.Neutral;
            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-stone-50/60 dark:bg-stone-800/40 border border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styling.bg} ${styling.text} border ${styling.border}`}>
                    {log.mood}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-stone-800 dark:text-stone-200">
                      {log.notes || 'Routine check-in'}
                    </p>
                    <span className="text-[10px] text-stone-400 font-mono">
                      Source: {log.source.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 font-mono">
                  <span className="font-bold text-stone-700 dark:text-stone-200">
                    {log.score} / 10
                  </span>
                  <span>
                    {new Date(log.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
