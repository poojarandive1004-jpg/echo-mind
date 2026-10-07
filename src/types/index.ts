export type MoodType = 'Happy' | 'Calm' | 'Neutral' | 'Sad' | 'Anxious' | 'Stressed';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  bio: string;
  collegeName?: string;
  academicYear?: string;
  reflectionGoal?: string;
  createdAt: string;
}

export interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  manualMood: MoodType;
  detectedMood: MoodType;
  sentimentScore: number; // 1 to 10
  analysisNote: string;
  detectedEmotions: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MoodLog {
  id: string;
  userId: string;
  mood: MoodType;
  score: number; // 1 to 10
  source: 'journal' | 'manual_checkin' | 'assessment';
  notes?: string;
  timestamp: string;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  options: { label: string; value: number }[];
}

export interface AssessmentInterpretation {
  minScore: number;
  maxScore: number;
  category: 'Minimal' | 'Mild' | 'Moderate' | 'High';
  title: string;
  feedback: string;
  recommendations: string[];
}

export interface Assessment {
  id: string;
  title: string;
  badge: string;
  category: string;
  subtitle: string;
  description: string;
  timeEstimate: string;
  iconName: string;
  accentColor: string;
  questions: AssessmentQuestion[];
  interpretations: AssessmentInterpretation[];
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentId: string;
  assessmentTitle: string;
  score: number;
  maxScore: number;
  percentage: number;
  category: 'Minimal' | 'Mild' | 'Moderate' | 'High';
  date: string;
  feedback: string;
  recommendations: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  emoji?: string;
  vibeTag: string;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
}

export interface QuizVibeResult {
  key: string;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  advice: string;
  colorScheme: {
    bg: string;
    border: string;
    text: string;
  };
}

export interface Quiz {
  id: string;
  title: string;
  tagline: string;
  icon: string;
  description: string;
  accentColor: string;
  questions: QuizQuestion[];
  results: Record<string, QuizVibeResult>;
}

export interface QuizResult {
  id: string;
  userId: string;
  quizId: string;
  quizTitle: string;
  resultKey: string;
  resultTitle: string;
  resultSubtitle: string;
  badge: string;
  date: string;
  description: string;
  advice: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'echo';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    actionType: 'breathe' | 'journal' | 'quiz' | 'assessment' | 'support';
  };
}

export interface MoodToneAnalysis {
  detectedMood: MoodType;
  sentimentScore: number; // 1 to 10
  emotions: string[];
  reflection: string;
  confidence: number;
}
