import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, JournalEntry, MoodLog, AssessmentResult, QuizResult, ChatMessage, MoodType } from '../types';
import { api } from '../services/api';

interface AppContextType {
  user: User | null;
  isAuthenticated: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  journals: JournalEntry[];
  moodLogs: MoodLog[];
  moodStats: {
    totalLogs: number;
    averageScore: number;
    counts: Record<string, number>;
    latestMood: MoodLog | null;
  };
  assessmentResults: AssessmentResult[];
  quizResults: QuizResult[];
  chatMessages: ChatMessage[];
  isEchoTyping: boolean;
  isBreathingOpen: boolean;
  setIsBreathingOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isDbInspectorOpen: boolean;
  setIsDbInspectorOpen: (open: boolean) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  login: (email: string) => Promise<void>;
  register: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  createJournalEntry: (data: { title: string; content: string; manualMood?: string; tags?: string[] }) => Promise<void>;
  deleteJournalEntry: (id: string) => Promise<void>;
  addMoodCheckIn: (mood: string, score?: number, notes?: string) => Promise<void>;
  submitAssessmentResult: (data: any) => Promise<AssessmentResult>;
  submitQuizResult: (data: any) => Promise<QuizResult>;
  sendMessageToEcho: (text: string) => Promise<void>;
  refreshData: () => Promise<void>;
  notification: { message: string; type: 'success' | 'info' | 'error' } | null;
  setNotification: (notif: { message: string; type: 'success' | 'info' | 'error' } | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>([]);
  const [moodStats, setMoodStats] = useState<{
    totalLogs: number;
    averageScore: number;
    counts: Record<string, number>;
    latestMood: MoodLog | null;
  }>({
    totalLogs: 0,
    averageScore: 7.0,
    counts: { Happy: 0, Calm: 0, Neutral: 0, Sad: 0, Anxious: 0, Stressed: 0 },
    latestMood: null,
  });
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResult[]>([]);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'echo',
      text: "Hello, lovely soul 🌸 I'm Echo, your gentle emotional companion here at Echo Mind. Whether you're feeling overwhelmed with college work, celebrating a peaceful moment, or just need someone kind to listen without judgment—I'm always here for you. How is your heart feeling today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [isEchoTyping, setIsEchoTyping] = useState<boolean>(false);
  const [isBreathingOpen, setIsBreathingOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isDbInspectorOpen, setIsDbInspectorOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('echomind_theme') === 'dark';
  });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Auto-dismiss notification after 4s
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Apply dark mode class to root
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('echomind_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('echomind_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  const refreshData = async () => {
    try {
      const [userData, journalData, moodData, assessData, quizData] = await Promise.all([
        api.getCurrentUser().catch(() => null),
        api.getJournals().catch(() => []),
        api.getMoods().catch(() => ({
          history: [],
          stats: { totalLogs: 0, averageScore: 7.0, counts: {}, latestMood: null },
        })),
        api.getAssessmentHistory().catch(() => []),
        api.getQuizHistory().catch(() => []),
      ]);

      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
      }
      setJournals(journalData);
      setMoodLogs(moodData.history);
      setMoodStats(moodData.stats);
      setAssessmentResults(assessData);
      setQuizResults(quizData);
    } catch (err) {
      console.warn('Data refresh encountered error:', err);
    }
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem('echomind_token');
        if (token) {
          await refreshData();
        } else {
          // Check if default demo user is reachable
          const demoUser = await api.getCurrentUser().catch(() => null);
          if (demoUser) {
            setUser(demoUser);
            setIsAuthenticated(true);
            await refreshData();
          }
        }
      } catch (err) {
        console.warn('Initial session check:', err);
      }
    };
    init();
  }, []);

  const login = async (email: string) => {
    const res = await api.login(email);
    localStorage.setItem('echomind_token', res.token);
    setUser(res.user);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
    setNotification({ message: `Welcome back, ${res.user.name}! 🌸`, type: 'success' });
    await refreshData();
  };

  const register = async (name: string, email: string) => {
    const res = await api.register(name, email);
    localStorage.setItem('echomind_token', res.token);
    setUser(res.user);
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    setActiveTab('dashboard');
    setNotification({ message: `Welcome to Echo Mind, ${res.user.name}! Your safe space is ready.`, type: 'success' });
    await refreshData();
  };

  const logout = () => {
    localStorage.removeItem('echomind_token');
    setUser(null);
    setIsAuthenticated(false);
    setActiveTab('landing');
    setNotification({ message: 'Logged out peacefully. Take gentle care of yourself! 🌙', type: 'info' });
  };

  const updateProfile = async (updates: Partial<User>) => {
    const updated = await api.updateProfile(updates);
    setUser(updated);
    setNotification({ message: 'Profile updated with lovely grace ✨', type: 'success' });
  };

  const createJournalEntry = async (data: { title: string; content: string; manualMood?: string; tags?: string[] }) => {
    const res = await api.createJournal(data);
    setJournals((prev) => [res.journal, ...prev]);
    // update mood logs
    setMoodLogs((prev) => [res.moodLog, ...prev]);
    setNotification({ message: `Journal saved! Detected tone: ${res.journal.detectedMood} 🌸`, type: 'success' });
    await refreshData();
  };

  const deleteJournalEntry = async (id: string) => {
    await api.deleteJournal(id);
    setJournals((prev) => prev.filter((j) => j.id !== id));
    setNotification({ message: 'Entry removed gently from your diary.', type: 'info' });
  };

  const addMoodCheckIn = async (mood: string, score?: number, notes?: string) => {
    const log = await api.logMood(mood, score, notes);
    setMoodLogs((prev) => [log, ...prev]);
    setNotification({ message: `Mood check-in logged: ${mood} 💖`, type: 'success' });
    await refreshData();
  };

  const submitAssessmentResult = async (data: any) => {
    const result = await api.submitAssessment(data);
    setAssessmentResults((prev) => [result, ...prev]);
    setNotification({ message: `Assessment complete: ${result.category} score recorded! ✨`, type: 'success' });
    await refreshData();
    return result;
  };

  const submitQuizResult = async (data: any) => {
    const result = await api.submitQuiz(data);
    setQuizResults((prev) => [result, ...prev]);
    setNotification({ message: `Vibe revealed: ${result.badge}! 💖`, type: 'success' });
    await refreshData();
    return result;
  };

  const sendMessageToEcho = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setIsEchoTyping(true);

    try {
      const historyForApi = chatMessages.slice(-6).map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const res = await api.sendChatMessage(text, historyForApi);

      const echoMsg: ChatMessage = {
        id: `msg-echo-${Date.now()}`,
        sender: 'echo',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedAction: res.suggestedAction,
      };

      setChatMessages((prev) => [...prev, echoMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `msg-echo-fallback-${Date.now()}`,
        sender: 'echo',
        text: "I'm right here with you. Take a slow, grounding breath and let your shoulders relax. You're doing the best you can today.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsEchoTyping(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated,
        activeTab,
        setActiveTab,
        journals,
        moodLogs,
        moodStats,
        assessmentResults,
        quizResults,
        chatMessages,
        isEchoTyping,
        isBreathingOpen,
        setIsBreathingOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isDbInspectorOpen,
        setIsDbInspectorOpen,
        isDarkMode,
        toggleDarkMode,
        login,
        register,
        logout,
        updateProfile,
        createJournalEntry,
        deleteJournalEntry,
        addMoodCheckIn,
        submitAssessmentResult,
        submitQuizResult,
        sendMessageToEcho,
        refreshData,
        notification,
        setNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
