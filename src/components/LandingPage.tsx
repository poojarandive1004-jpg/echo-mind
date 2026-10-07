import React from 'react';
import {
  Heart,
  Sparkles,
  BookOpen,
  LineChart,
  ClipboardList,
  MessageCircle,
  Database,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Smile,
  CloudSun,
  Coffee,
  Wind,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsAuthModalOpen, setIsBreathingOpen, setIsDbInspectorOpen, isAuthenticated } = useApp();

  return (
    <div className="relative overflow-hidden">
      {/* Delicate background gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-pink-100/60 via-purple-50/40 to-transparent dark:from-pink-950/20 dark:via-purple-950/10 pointer-events-none -z-10 blur-3xl" />

      {/* Hero Section */}
      <section className="pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Academic Project Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-900/60 text-pink-800 dark:text-pink-300 text-xs font-semibold mb-6 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-500 animate-pulse" />
          <span>BCA Final-Year Capstone Project • AI Emotional Wellness Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading text-stone-900 dark:text-stone-100 tracking-tight leading-tight max-w-3xl mx-auto">
          A gentle digital sanctuary to{' '}
          <span className="bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
            listen, reflect & understand
          </span>{' '}
          your emotions.
        </h1>

        {/* Subtitle / Meaningful Tagline */}
        <p className="mt-6 text-base sm:text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
          Echo Mind brings together private emotional journaling, AI-driven sentiment analysis, longitudinal mood tracking, structured self-assessments, and a compassionate companion named <strong>Echo</strong>—designed to support student self-awareness and mindful calm.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => {
              if (isAuthenticated) {
                setActiveTab('dashboard');
              } else {
                setIsAuthModalOpen(true);
              }
            }}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-semibold text-sm shadow-md shadow-pink-200/60 dark:shadow-none flex items-center gap-2 transition-all active:scale-95"
          >
            <span>{isAuthenticated ? 'Open My Sanctuary Dashboard' : 'Begin Your Emotional Journey'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => setActiveTab('quizzes')}
            className="px-5 py-3.5 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 hover:border-pink-300 text-stone-700 dark:text-stone-200 font-medium text-sm shadow-xs flex items-center gap-2 transition-all hover:bg-stone-50 dark:hover:bg-stone-700/50"
          >
            <Sparkles className="w-4 h-4 text-pink-500" />
            <span>Take a Free Vibe Quiz</span>
          </button>

          <button
            onClick={() => setIsBreathingOpen(true)}
            className="px-4 py-3.5 rounded-2xl bg-rose-50 dark:bg-stone-800/80 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-stone-800 border border-rose-200/60 dark:border-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Wind className="w-4 h-4" />
            <span>2-Min Breathing</span>
          </button>
        </div>

        {/* Reassurance Disclaimer Notice */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Designed for emotional awareness & self-reflection • Not a medical diagnostic tool</span>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-stone-800 dark:text-stone-100">
            Everything your emotional well-being deserves
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-xl mx-auto">
            A cohesive architecture combining journaling, database persistence, NLP sentiment classification, and interactive psychometrics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Emotional Journaling */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-pink-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-11 h-11 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
              Private Diary & NLP Tone Analysis
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Write daily thoughts, exam anxieties, or small joys. Echo Mind gently analyzes text tone into primary moods (Happy, Calm, Neutral, Sad, Anxious, Stressed) without judgment.
            </p>
            <button
              onClick={() => setActiveTab('journal')}
              className="text-xs font-semibold text-pink-600 dark:text-pink-400 flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              <span>Explore Journal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Longitudinal Mood Tracking */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-purple-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-11 h-11 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <LineChart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
              Mood Trends & Visualization
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Visualize your emotional rhythm across days and weeks through interactive curves, distribution charts, and timeline logs. Spot what anchors your calm.
            </p>
            <button
              onClick={() => setActiveTab('moods')}
              className="text-xs font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              <span>View Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: AI Assistant Echo */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-rose-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-11 h-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <MessageCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
              Supportive AI Companion Echo
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Talk freely about your day, late-night worries, or study burnout. Echo responds with warmth, reflective reframing, and calming grounding exercises.
            </p>
            <button
              onClick={() => setActiveTab('echo')}
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              <span>Meet Echo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Structured Self-Assessments */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-teal-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-11 h-11 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <ClipboardList className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
              Structured Self-Assessments
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Scientific self-reflection questionnaires: Perceived Stress Scale (PSS), Anxiety checks, Flourishing well-being index, and Student burnout indicators.
            </p>
            <button
              onClick={() => setActiveTab('assessments')}
              className="text-xs font-semibold text-teal-600 dark:text-teal-400 flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 5: Playful Reflection Quizzes */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-amber-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
              Interactive Vibe Quizzes
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Playful, personality-style reflections: “What Is Your Emotional Vibe?”, “How Do You Handle Stress?”, and “Are You an Overthinker?” with shareable badges.
            </p>
            <button
              onClick={() => setActiveTab('quizzes')}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              <span>Play Quizzes</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 6: Database Management & Privacy */}
          <div className="p-6 rounded-3xl bg-white/90 dark:bg-stone-900/90 border border-indigo-100 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow group">
            <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-heading text-stone-800 dark:text-stone-100 mb-1">
              BCA Database Architecture
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed mb-4">
              Built on a normalized relational schema with strict per-user foreign-key privacy isolation. Demonstrates real-world CRUD and REST API engineering.
            </p>
            <button
              onClick={() => setIsDbInspectorOpen(true)}
              className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 hover:gap-1.5 transition-all"
            >
              <span>Inspect Schema & Tables</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* BCA Capstone Project Presentation Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="p-8 rounded-3xl bg-gradient-to-br from-pink-50 via-rose-50/50 to-purple-50 dark:from-stone-800/80 dark:to-stone-900 border border-pink-100 dark:border-stone-800 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-700 dark:text-pink-300">
            Academic Project Context
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-stone-800 dark:text-stone-100 mt-2 mb-3">
            Designed for BCA Final-Year Project Demonstration & Viva
          </h3>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl mx-auto mb-6">
            Echo Mind was conceptualized to solve the challenge of mental health stigma and emotional fragmentation among college students by marrying full-stack Web technologies with AI Natural Language Processing.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left max-w-2xl mx-auto text-xs">
            <div className="p-3 bg-white/80 dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700">
              <span className="text-stone-400 block text-[10px]">Frontend</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">React 19 + Tailwind</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700">
              <span className="text-stone-400 block text-[10px]">Backend</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">Node.js + Express</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700">
              <span className="text-stone-400 block text-[10px]">AI Model</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">Gemini 3.8 Flash</span>
            </div>
            <div className="p-3 bg-white/80 dark:bg-stone-800 rounded-2xl border border-stone-200/60 dark:border-stone-700">
              <span className="text-stone-400 block text-[10px]">Database</span>
              <span className="font-semibold text-stone-800 dark:text-stone-200">Document Relational</span>
            </div>
          </div>
        </div>
      </section>

      {/* Gentle Footer */}
      <footer className="mt-12 py-8 border-t border-stone-200/60 dark:border-stone-800 text-center text-xs text-stone-500 dark:text-stone-400">
        <p className="font-heading font-medium text-stone-700 dark:text-stone-300">
          Echo Mind • An Emotional Wellness & Self-Awareness Project
        </p>
        <p className="mt-1 text-[11px] text-stone-400 dark:text-stone-500">
          Created with care for student wellness and self-reflection. Not a substitute for licensed medical or psychiatric care.
        </p>
      </footer>
    </div>
  );
};
