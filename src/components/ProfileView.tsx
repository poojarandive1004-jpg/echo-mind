import React, { useState } from 'react';
import {
  User as UserIcon,
  Sparkles,
  Heart,
  Save,
  BookOpen,
  ClipboardList,
  Calendar,
  GraduationCap,
  Target,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileView: React.FC = () => {
  const { user, updateProfile, journals, assessmentResults, quizResults, setNotification } = useApp();

  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '🌸');
  const [bio, setBio] = useState(user?.bio || '');
  const [collegeName, setCollegeName] = useState(user?.collegeName || 'School of Computer Applications');
  const [academicYear, setAcademicYear] = useState(user?.academicYear || 'BCA Final Year - Semester VI');
  const [reflectionGoal, setReflectionGoal] = useState(user?.reflectionGoal || 'Cultivating daily emotional peace');
  const [isSaving, setIsSaving] = useState(false);

  const avatarChoices = ['🌸', '✨', '🌙', '🧸', '🍵', '🦋', '🌷', '☁️', '🦔', '☕', '🌻', '🍓'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        avatar,
        bio: bio.trim(),
        collegeName: collegeName.trim(),
        academicYear: academicYear.trim(),
        reflectionGoal: reflectionGoal.trim(),
      });
    } catch (err: any) {
      setNotification({ message: err.message || 'Could not update profile', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex items-center gap-4 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-pink-100/70 via-rose-50/70 to-purple-100/70 dark:from-stone-900 dark:to-stone-850 border border-pink-200/70 dark:border-stone-800">
        <div className="w-20 h-20 rounded-3xl bg-white dark:bg-stone-800 shadow-sm flex items-center justify-center text-4xl border border-pink-100 dark:border-stone-700">
          {avatar}
        </div>
        <div>
          <h1 className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100">
            {user?.name || 'Aria Chen'}
          </h1>
          <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
            {user?.email} • Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString([], { month: 'short', year: 'numeric' }) : '2026'}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200/50">
              {academicYear}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/50">
              {collegeName}
            </span>
          </div>
        </div>
      </div>

      {/* Account Statistics Highlights */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 text-center">
          <span className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100">
            {journals.length}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
            Diary Entries
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 text-center">
          <span className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100">
            {assessmentResults.length}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
            Self-Checks Done
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 text-center">
          <span className="text-2xl font-bold font-heading text-stone-800 dark:text-stone-100">
            {quizResults.length}
          </span>
          <span className="text-xs text-stone-500 dark:text-stone-400 block mt-0.5">
            Vibe Badges
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs space-y-6">
        <h2 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 pb-3 border-b border-stone-100 dark:border-stone-800">
          Personalize Profile & Study Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Picker */}
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-2">
              Choose Your Gentle Avatar
            </label>
            <div className="flex flex-wrap gap-2.5">
              {avatarChoices.map((av) => (
                <button
                  type="button"
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`w-11 h-11 rounded-2xl text-xl flex items-center justify-center transition-all ${
                    avatar === av
                      ? 'bg-pink-100 dark:bg-pink-950/70 ring-2 ring-pink-400 scale-105'
                      : 'bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:scale-102'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                College / Institution
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Academic Program & Year
              </label>
              <input
                type="text"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
                Personal Reflection Goal
              </label>
              <input
                type="text"
                value={reflectionGoal}
                onChange={(e) => setReflectionGoal(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-stone-300 mb-1">
              Short Bio / About Yourself
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-pink-200/50 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
