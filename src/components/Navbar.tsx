import React, { useState } from 'react';
import {
  Heart,
  BookOpen,
  LineChart,
  ClipboardList,
  Sparkles,
  MessageCircle,
  Database,
  Moon,
  Sun,
  User,
  LogOut,
  Menu,
  X,
  Wind,
  LifeBuoy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    user,
    isAuthenticated,
    activeTab,
    setActiveTab,
    setIsBreathingOpen,
    setIsAuthModalOpen,
    setIsDbInspectorOpen,
    isDarkMode,
    toggleDarkMode,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: LineChart, requireAuth: true },
    { id: 'journal', label: 'Diary & Journals', icon: BookOpen, requireAuth: true },
    { id: 'moods', label: 'Mood Trends', icon: LineChart, requireAuth: true },
    { id: 'assessments', label: 'Assessments', icon: ClipboardList, requireAuth: false },
    { id: 'quizzes', label: 'Quizzes', icon: Sparkles, requireAuth: false },
    { id: 'echo', label: 'Talk to Echo', icon: MessageCircle, requireAuth: false },
  ];

  const handleNavClick = (tabId: string, requireAuth: boolean) => {
    if (requireAuth && !isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-stone-900/80 border-b border-pink-100/70 dark:border-stone-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'landing')}
          className="flex items-center gap-2.5 group text-left focus-visible:outline-pink-400"
        >
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-pink-300 via-rose-200 to-purple-300 dark:from-pink-900/60 dark:to-purple-900/60 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5 text-rose-600 dark:text-rose-300 fill-rose-500/30" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading font-extrabold text-lg tracking-tight bg-gradient-to-r from-pink-600 via-rose-600 to-purple-600 dark:from-pink-300 dark:to-purple-300 bg-clip-text text-transparent">
                Echo Mind
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200/50 dark:border-pink-900/50">
                BCA Project
              </span>
            </div>
            <p className="text-[10px] text-stone-500 dark:text-stone-400 hidden sm:block -mt-0.5">
              Emotional Wellness & Self-Awareness
            </p>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.requireAuth)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-pink-50 dark:bg-stone-800 text-pink-700 dark:text-pink-300 font-semibold shadow-xs'
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-pink-500' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Island */}
        <div className="flex items-center gap-2">
          {/* Quick Breathing Guide Button */}
          <button
            onClick={() => setIsBreathingOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60 text-xs font-medium transition-all active:scale-95"
            title="Take a 4-4-4-4 calming breath"
          >
            <Wind className="w-3.5 h-3.5 text-rose-500" />
            <span>Breathe</span>
          </button>

          {/* Database Inspector (BCA Viva) Button */}
          <button
            onClick={() => setIsDbInspectorOpen(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-900/60 text-xs font-medium transition-colors"
            title="View Database Entities & Architecture (BCA College Viva)"
          >
            <Database className="w-3.5 h-3.5 text-purple-500" />
            <span className="hidden md:inline">DB Inspector</span>
          </button>

          {/* Help & Support Button */}
          <button
            onClick={() => setActiveTab('support')}
            className={`p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors ${
              activeTab === 'support' ? 'bg-pink-50 text-pink-700 dark:bg-stone-800' : ''
            }`}
            title="Emergency Support & Helplines"
          >
            <LifeBuoy className="w-4 h-4" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Pastel' : 'Switch to Cozy Dark Violet'}
            aria-label="Toggle Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
          </button>

          {/* Auth State / Profile */}
          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-200 text-xs font-medium hover:border-pink-300 transition-all"
              >
                <span className="text-base">{user.avatar || '🌸'}</span>
                <span className="max-w-[80px] truncate hidden md:inline">{user.name.split(' ')[0]}</span>
              </button>

              {profileDropdownOpen && (
                <div
                  className="absolute right-0 mt-2 w-52 p-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl z-50 animate-fadeIn text-xs"
                  onClick={() => setProfileDropdownOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-stone-100 dark:border-stone-800 mb-1">
                    <p className="font-semibold text-stone-800 dark:text-stone-100 truncate">{user.name}</p>
                    <p className="text-[11px] text-stone-400 truncate">{user.email}</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-pink-50 dark:hover:bg-stone-800 text-left transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span>My Profile & Settings</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-pink-50 dark:hover:bg-stone-800 text-left transition-colors"
                  >
                    <LineChart className="w-3.5 h-3.5 text-stone-400" />
                    <span>Emotional Dashboard</span>
                  </button>
                  <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left transition-colors mt-1 border-t border-stone-100 dark:border-stone-800"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-1.5 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95"
            >
              Sign In
            </button>
          )}

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 px-4 py-4 space-y-1 animate-fadeIn text-sm">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.requireAuth)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-left ${
                  isActive
                    ? 'bg-pink-50 dark:bg-stone-800 text-pink-700 dark:text-pink-300 font-semibold'
                    : 'text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800'
                }`}
              >
                <Icon className="w-4 h-4 text-pink-500" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-2 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsBreathingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 text-xs font-semibold"
            >
              <Wind className="w-4 h-4" />
              <span>4-4-4-4 Box Breathing Guide</span>
            </button>

            <button
              onClick={() => {
                setIsDbInspectorOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 text-xs font-semibold"
            >
              <Database className="w-4 h-4" />
              <span>BCA Database Inspector</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
