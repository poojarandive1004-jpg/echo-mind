import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Tag,
  Trash2,
  Edit3,
  Sparkles,
  Calendar,
  Clock,
  Heart,
  ChevronRight,
  Filter,
  Check,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { JournalEntry, MoodType } from '../types';
import { api } from '../services/api';

export const JournalView: React.FC = () => {
  const { journals, createJournalEntry, deleteJournalEntry, setNotification } = useApp();

  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [manualMood, setManualMood] = useState<MoodType>('Calm');
  const [tagsInput, setTagsInput] = useState('college, reflection');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterMood, setSelectedFilterMood] = useState<string>('All');
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Live tone preview state
  const [livePreviewTone, setLivePreviewTone] = useState<any>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const moodColors: Record<MoodType, { bg: string; text: string; border: string }> = {
    Happy: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200' },
    Calm: { bg: 'bg-sky-50 dark:bg-sky-950/40', text: 'text-sky-700 dark:text-sky-300', border: 'border-sky-200' },
    Neutral: { bg: 'bg-stone-50 dark:bg-stone-800', text: 'text-stone-700 dark:text-stone-300', border: 'border-stone-200' },
    Sad: { bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200' },
    Anxious: { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200' },
    Stressed: { bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200' },
  };

  const commonTags = ['college', 'exams', 'viva', 'self-care', 'friendship', 'sleep', 'gratitude', 'rain', 'coding'];

  const handleLiveAnalysis = async () => {
    if (!content.trim()) return;
    setIsPreviewing(true);
    try {
      const result = await api.analyzeMood(content);
      setLivePreviewTone(result);
    } catch (err) {
      console.warn('Tone analysis preview failed:', err);
    } finally {
      setIsPreviewing(false);
    }
  };

  const handleSaveEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setIsSubmitting(true);
    try {
      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().toLowerCase().replace(/^#/, ''))
        .filter(Boolean);

      await createJournalEntry({
        title: title.trim(),
        content: content.trim(),
        manualMood,
        tags: parsedTags,
      });

      // Reset
      setTitle('');
      setContent('');
      setManualMood('Calm');
      setTagsInput('');
      setLivePreviewTone(null);
      setIsWriting(false);
    } catch (err: any) {
      setNotification({ message: err.message || 'Could not save journal entry.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this diary entry?')) {
      await deleteJournalEntry(id);
      if (selectedEntry?.id === id) setSelectedEntry(null);
    }
  };

  // Filter journals
  const filteredJournals = journals.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesMood = selectedFilterMood === 'All' || entry.detectedMood === selectedFilterMood;
    return matchesSearch && matchesMood;
  });

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-stone-800 dark:text-stone-100">
              Personal Emotional Diary
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            Express your unfiltered thoughts in private. Echo Mind analyzes tone to nurture self-awareness.
          </p>
        </div>

        <button
          onClick={() => {
            setIsWriting(!isWriting);
            setLivePreviewTone(null);
          }}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-pink-200/50 dark:shadow-none transition-all active:scale-95"
        >
          {isWriting ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          <span>{isWriting ? 'Close Diary Form' : 'Write New Entry'}</span>
        </button>
      </div>

      {/* Writing Form Drawer */}
      {isWriting && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-pink-200/80 dark:border-stone-800 shadow-lg space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
            <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span>Dear Diary...</span>
            </h2>
            <span className="text-xs text-stone-400 font-mono">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>

          <form onSubmit={handleSaveEntry} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Entry Title
              </label>
              <input
                type="text"
                required
                placeholder="Give today’s thoughts a gentle title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                  How are you feeling right now?
                </label>
                <span className="text-[11px] text-stone-400">Your initial manual mood tag</span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {(['Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Stressed'] as MoodType[]).map((m) => {
                  const isSelected = manualMood === m;
                  const styling = moodColors[m];
                  return (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setManualMood(m)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
                        isSelected
                          ? `${styling.bg} ${styling.text} border-pink-400 shadow-xs scale-102`
                          : 'border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                      }`}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300">
                  Your Reflection
                </label>
                {content.length > 20 && (
                  <button
                    type="button"
                    onClick={handleLiveAnalysis}
                    disabled={isPreviewing}
                    className="text-xs text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isPreviewing ? 'Analyzing...' : 'Preview Tone Analysis'}</span>
                  </button>
                )}
              </div>
              <textarea
                required
                rows={6}
                placeholder="Pour your thoughts freely here... How was your college day? Did a presentation feel heavy, or did someone bring you a warm cup of coffee?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-pink-300 font-sans"
              />
            </div>

            {/* Live Tone Preview Card */}
            {livePreviewTone && (
              <div className="p-4 rounded-2xl bg-pink-50/70 dark:bg-stone-800/80 border border-pink-200 dark:border-pink-900/50 space-y-2 animate-fadeIn text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-pink-800 dark:text-pink-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    AI Detected Emotional Tone: {livePreviewTone.detectedMood} ({livePreviewTone.sentimentScore}/10)
                  </span>
                  <span className="text-[10px] text-stone-400">Non-Clinical Indication</span>
                </div>
                <p className="text-stone-700 dark:text-stone-300 leading-relaxed italic">
                  "{livePreviewTone.reflection}"
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-400">Identified Themes:</span>
                  {livePreviewTone.emotions?.map((em: string, idx: number) => (
                    <span key={idx} className="px-2 py-0.5 rounded-full bg-white dark:bg-stone-700 text-[10px] text-stone-600 dark:text-stone-200 border border-stone-200 dark:border-stone-600">
                      {em}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                placeholder="college, coding, tea, project"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs focus:outline-none focus:ring-1 focus:ring-pink-300"
              />
              <div className="flex flex-wrap gap-1.5 mt-2">
                {commonTags.map((tag) => (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => {
                      if (!tagsInput.includes(tag)) {
                        setTagsInput(tagsInput ? `${tagsInput}, ${tag}` : tag);
                      }
                    }}
                    className="px-2.5 py-1 text-[11px] rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-pink-100 dark:hover:bg-pink-950 transition-colors"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-100 dark:border-stone-800">
              <span className="text-[11px] text-stone-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Saved securely to your private database table</span>
              </span>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsWriting(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-semibold text-xs shadow-sm hover:from-pink-500 hover:to-rose-500 transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Analyzing & Saving...' : 'Save in Diary'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Search & Mood Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Search diary thoughts or #tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-pink-300"
          />
        </div>

        {/* Mood Filter Pill tabs */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto">
          {['All', 'Happy', 'Calm', 'Neutral', 'Sad', 'Anxious', 'Stressed'].map((mood) => {
            const isSelected = selectedFilterMood === mood;
            return (
              <button
                key={mood}
                onClick={() => setSelectedFilterMood(mood)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-pink-100 dark:bg-pink-950/70 text-pink-800 dark:text-pink-200 font-semibold shadow-2xs'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                {mood}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Entries Grid & Expanded Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Entries List (2 cols or full if no selection) */}
        <div className={`${selectedEntry ? 'lg:col-span-2' : 'lg:col-span-3'} space-y-4`}>
          {filteredJournals.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-stone-900 rounded-3xl border border-stone-200/70 dark:border-stone-800 p-8">
              <BookOpen className="w-8 h-8 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-stone-700 dark:text-stone-300">
                No diary entries found
              </h3>
              <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
                {searchQuery || selectedFilterMood !== 'All'
                  ? 'Try adjusting your search query or mood filter.'
                  : 'Start by writing your first gentle entry above!'}
              </p>
            </div>
          ) : (
            filteredJournals.map((entry) => {
              const styling = moodColors[entry.detectedMood] || moodColors.Neutral;
              const isSelected = selectedEntry?.id === entry.id;

              return (
                <div
                  key={entry.id}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-6 rounded-3xl bg-white dark:bg-stone-900 border transition-all cursor-pointer hover:shadow-md ${
                    isSelected
                      ? 'border-pink-400 ring-2 ring-pink-100 dark:ring-pink-950'
                      : 'border-stone-200/70 dark:border-stone-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100">
                        {entry.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-400 font-mono">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(entry.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3" />
                        <span>{new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${styling.bg} ${styling.text} border ${styling.border}`}>
                        {entry.detectedMood} • {entry.sentimentScore}/10
                      </span>
                      <button
                        onClick={(e) => handleDelete(entry.id, e)}
                        className="p-1.5 text-stone-400 hover:text-rose-500 rounded-lg hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                        title="Delete entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed line-clamp-3 my-3">
                    {entry.content}
                  </p>

                  {/* AI Note snippet */}
                  {entry.analysisNote && (
                    <div className="p-3 rounded-2xl bg-pink-50/50 dark:bg-stone-800/60 border border-pink-100 dark:border-stone-800 text-[11px] text-stone-600 dark:text-stone-300 flex items-start gap-2 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-pink-500 shrink-0 mt-0.5" />
                      <span className="italic">{entry.analysisNote}</span>
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {entry.tags.map((t, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 text-[10px] rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Selected Entry Detail View (Right Sidebar on lg) */}
        {selectedEntry && (
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-pink-200/80 dark:border-stone-800 shadow-md space-y-4 sticky top-24 self-start">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
              <span className="text-xs font-bold text-pink-700 dark:text-pink-300 uppercase tracking-wider font-heading">
                Tone & Emotional Analysis
              </span>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <h4 className="text-lg font-bold font-heading text-stone-800 dark:text-stone-100">
                {selectedEntry.title}
              </h4>
              <p className="text-[11px] text-stone-400 mt-0.5">
                Written on {new Date(selectedEntry.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
              </p>
            </div>

            {/* AI Breakdown Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-stone-800 dark:to-stone-850 border border-pink-100 dark:border-stone-700 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  Detected Emotional Mood
                </span>
                <span className="text-sm font-bold text-pink-700 dark:text-pink-300">
                  {selectedEntry.detectedMood}
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mb-1">
                  <span>Sentiment Positivity Score</span>
                  <span className="font-mono font-bold text-stone-700 dark:text-stone-200">{selectedEntry.sentimentScore} / 10</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-200 dark:bg-stone-700 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"
                    style={{ width: `${(selectedEntry.sentimentScore / 10) * 100}%` }}
                  />
                </div>
              </div>

              {selectedEntry.detectedEmotions && selectedEntry.detectedEmotions.length > 0 && (
                <div>
                  <span className="text-[11px] font-semibold text-stone-600 dark:text-stone-300 block mb-1.5">
                    Recognized Emotional Elements:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEntry.detectedEmotions.map((em, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-full bg-white dark:bg-stone-700 text-stone-700 dark:text-stone-200 text-[10px] font-medium border border-pink-100 dark:border-stone-600"
                      >
                        {em}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {selectedEntry.analysisNote && (
                <div className="pt-2 border-t border-pink-100/60 dark:border-stone-700 text-xs text-stone-700 dark:text-stone-300 italic">
                  "{selectedEntry.analysisNote}"
                </div>
              )}
            </div>

            {/* Full text reader */}
            <div className="pt-2">
              <span className="text-xs font-bold text-stone-500 dark:text-stone-400 block mb-2 uppercase tracking-wide text-[10px]">
                Full Written Diary Text
              </span>
              <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-200 leading-relaxed whitespace-pre-wrap">
                {selectedEntry.content}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
