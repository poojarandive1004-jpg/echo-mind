import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DashboardView } from './components/DashboardView';
import { JournalView } from './components/JournalView';
import { MoodAnalyticsView } from './components/MoodAnalyticsView';
import { AssessmentsView } from './components/AssessmentsView';
import { QuizzesView } from './components/QuizzesView';
import { EchoChatView } from './components/EchoChatView';
import { ProfileView } from './components/ProfileView';
import { SupportView } from './components/SupportView';
import { BreathingPacerModal } from './components/BreathingPacerModal';
import { DbInspectorModal } from './components/DbInspectorModal';
import { AuthModal } from './components/AuthModal';
import { CheckCircle, Info, AlertCircle, X } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, notification, setNotification } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardView />;
      case 'journal':
        return <JournalView />;
      case 'moods':
        return <MoodAnalyticsView />;
      case 'assessments':
        return <AssessmentsView />;
      case 'quizzes':
        return <QuizzesView />;
      case 'echo':
        return <EchoChatView />;
      case 'profile':
        return <ProfileView />;
      case 'support':
        return <SupportView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="min-h-screen bg-rose-50/40 dark:bg-stone-950 text-stone-800 dark:text-stone-100 transition-colors flex flex-col font-sans selection:bg-pink-200 dark:selection:bg-pink-900/60 selection:text-pink-950">
      <Navbar />

      {/* Floating Gentle Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-fadeIn">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl border text-xs font-medium backdrop-blur-md ${
              notification.type === 'success'
                ? 'bg-emerald-50/95 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-200'
                : notification.type === 'error'
                ? 'bg-rose-50/95 border-rose-200 text-rose-800 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-200'
                : 'bg-stone-50/95 border-stone-200 text-stone-800 dark:bg-stone-900/90 dark:border-stone-800 dark:text-stone-200'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
            ) : notification.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            ) : (
              <Info className="w-4 h-4 text-stone-500 shrink-0" />
            )}
            <span>{notification.message}</span>
            <button
              onClick={() => setNotification(null)}
              className="p-1 hover:opacity-75 transition-opacity"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {renderActiveView()}
      </main>

      {/* Global Modals */}
      <BreathingPacerModal />
      <DbInspectorModal />
      <AuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
