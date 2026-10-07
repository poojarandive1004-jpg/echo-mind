import { User, JournalEntry, MoodLog, AssessmentResult, QuizResult, MoodToneAnalysis } from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('echomind_token') || 'user-aria-demo';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

export const api = {
  // Auth
  async login(email: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
  },

  async register(name: string, email: string): Promise<{ user: User; token: string }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Registration failed');
    }
    return res.json();
  },

  async getCurrentUser(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user');
    const data = await res.json();
    return data.user;
  },

  async updateProfile(updates: Partial<User>): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    const data = await res.json();
    return data.user;
  },

  // Journals
  async getJournals(): Promise<JournalEntry[]> {
    const res = await fetch(`${API_BASE}/journals`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch journals');
    const data = await res.json();
    return data.journals;
  },

  async createJournal(data: {
    title: string;
    content: string;
    manualMood?: string;
    tags?: string[];
  }): Promise<{ journal: JournalEntry; moodLog: MoodLog }> {
    const res = await fetch(`${API_BASE}/journals`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to save journal');
    return res.json();
  },

  async updateJournal(id: string, data: {
    title?: string;
    content?: string;
    manualMood?: string;
    tags?: string[];
  }): Promise<JournalEntry> {
    const res = await fetch(`${API_BASE}/journals/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update journal');
    const resData = await res.json();
    return resData.journal;
  },

  async deleteJournal(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/journals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete journal');
  },

  async analyzeMood(text: string): Promise<MoodToneAnalysis> {
    const res = await fetch(`${API_BASE}/analyze-mood`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error('Mood analysis failed');
    return res.json();
  },

  // Moods
  async getMoods(): Promise<{
    history: MoodLog[];
    stats: {
      totalLogs: number;
      averageScore: number;
      counts: Record<string, number>;
      latestMood: MoodLog | null;
    };
  }> {
    const res = await fetch(`${API_BASE}/moods`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch mood history');
    return res.json();
  },

  async logMood(mood: string, score?: number, notes?: string): Promise<MoodLog> {
    const res = await fetch(`${API_BASE}/moods`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ mood, score, notes }),
    });
    if (!res.ok) throw new Error('Failed to log mood');
    const data = await res.json();
    return data.moodLog;
  },

  // Assessments
  async getAssessmentHistory(): Promise<AssessmentResult[]> {
    const res = await fetch(`${API_BASE}/assessments/history`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch assessment history');
    const data = await res.json();
    return data.results;
  },

  async submitAssessment(data: {
    assessmentId: string;
    assessmentTitle: string;
    score: number;
    maxScore: number;
    category: string;
    feedback: string;
    recommendations: string[];
  }): Promise<AssessmentResult> {
    const res = await fetch(`${API_BASE}/assessments/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit assessment');
    const resData = await res.json();
    return resData.result;
  },

  // Quizzes
  async getQuizHistory(): Promise<QuizResult[]> {
    const res = await fetch(`${API_BASE}/quizzes/history`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch quiz history');
    const data = await res.json();
    return data.results;
  },

  async submitQuiz(data: {
    quizId: string;
    quizTitle: string;
    resultKey: string;
    resultTitle: string;
    resultSubtitle: string;
    badge: string;
    description: string;
    advice: string;
  }): Promise<QuizResult> {
    const res = await fetch(`${API_BASE}/quizzes/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to submit quiz');
    const resData = await res.json();
    return resData.result;
  },

  // Echo Chat
  async sendChatMessage(message: string, history: Array<{ sender: string; text: string }>): Promise<{
    reply: string;
    suggestedAction?: { label: string; actionType: 'breathe' | 'journal' | 'quiz' | 'assessment' | 'support' };
    isCrisis?: boolean;
  }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ message, conversationHistory: history }),
    });
    if (!res.ok) throw new Error('Failed to communicate with Echo');
    return res.json();
  },

  // DB Inspector
  async getDbInspection(): Promise<any> {
    const res = await fetch(`${API_BASE}/db/inspect`);
    if (!res.ok) throw new Error('Failed to inspect database');
    return res.json();
  },

  async resetDemoDb(): Promise<void> {
    await fetch(`${API_BASE}/db/reset-demo`, { method: 'POST' });
  },
};
