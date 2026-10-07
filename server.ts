import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import fs from 'fs';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialise Gemini SDK with mandatory telemetry header
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Database file setup
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'echomind-database.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: Array<{
    id: string;
    email: string;
    passwordHash?: string;
    name: string;
    avatar: string;
    bio: string;
    collegeName: string;
    academicYear: string;
    reflectionGoal: string;
    createdAt: string;
  }>;
  journals: Array<{
    id: string;
    userId: string;
    title: string;
    content: string;
    manualMood: string;
    detectedMood: string;
    sentimentScore: number;
    analysisNote: string;
    detectedEmotions: string[];
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }>;
  moodLogs: Array<{
    id: string;
    userId: string;
    mood: string;
    score: number;
    source: string;
    notes?: string;
    timestamp: string;
  }>;
  assessmentResults: Array<{
    id: string;
    userId: string;
    assessmentId: string;
    assessmentTitle: string;
    score: number;
    maxScore: number;
    percentage: number;
    category: string;
    date: string;
    feedback: string;
    recommendations: string[];
  }>;
  quizResults: Array<{
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
  }>;
}

const DEFAULT_DEMO_USER_ID = 'user-aria-demo';

function getInitialDatabase(): DatabaseSchema {
  const now = new Date();
  const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 60 * 60 * 1000).toISOString();

  return {
    users: [
      {
        id: DEFAULT_DEMO_USER_ID,
        email: 'aria.chen@echomind.edu',
        name: 'Aria Chen',
        avatar: '🌸',
        bio: 'BCA Final Year student, frontend enthusiast, and coffee lover learning to nurture inner peace.',
        collegeName: 'School of Computer Applications (BCA)',
        academicYear: 'Final Year - Semester VI',
        reflectionGoal: 'To balance project viva submissions with gentle emotional self-care.',
        createdAt: daysAgo(14),
      },
    ],
    journals: [
      {
        id: 'j-01',
        userId: DEFAULT_DEMO_USER_ID,
        title: 'Project Viva Prep & Rainy Evening Thoughts',
        content: 'Today was an emotional rollercoaster with our BCA project milestone presentation. The faculty asked tough questions about database normalization and API response latency. At first my chest felt tight and I thought I stumbled. But afterward, my teammate brought hot lavender matcha and we realized we actually passed all test cases! I feel relieved and proud of our resilience.',
        manualMood: 'Calm',
        detectedMood: 'Calm',
        sentimentScore: 7.8,
        analysisNote: 'Initial academic performance anxiety smoothly transitioned into warm gratitude and team solidarity.',
        detectedEmotions: ['relieved', 'grateful', 'grounded', 'accomplished'],
        tags: ['college', 'project', 'resilience', 'tea'],
        createdAt: daysAgo(1),
        updatedAt: daysAgo(1),
      },
      {
        id: 'j-02',
        userId: DEFAULT_DEMO_USER_ID,
        title: 'Overwhelmed by Endless Open Tabs',
        content: 'I had 32 browser tabs open for React documentation, SQL schema tuning, and exam schedules. My head was throbbing by 4 PM and I felt like I was falling behind everyone in class. Took a 10-minute walk in the college garden and listened to soft acoustic rain sounds. Still feeling somewhat stressed, but taking it one task at a time.',
        manualMood: 'Stressed',
        detectedMood: 'Stressed',
        sentimentScore: 3.9,
        analysisNote: 'Expressions of sensory and cognitive overload accompanied by productive self-regulation through nature walk.',
        detectedEmotions: ['overwhelmed', 'fatigued', 'seeking calm'],
        tags: ['study', 'burnout', 'nature-walk'],
        createdAt: daysAgo(3),
        updatedAt: daysAgo(3),
      },
      {
        id: 'j-03',
        userId: DEFAULT_DEMO_USER_ID,
        title: 'Sunday Morning Sunlight & Fresh Berries',
        content: 'Woke up without an alarm today. Sunlight was streaming through the sheer curtains creating soft golden patterns on my desk. Made strawberry pancakes and watered my tiny succulent plant. Did not open my laptop for 4 hours and it felt like my nervous system gave a deep collective exhale.',
        manualMood: 'Happy',
        detectedMood: 'Happy',
        sentimentScore: 9.2,
        analysisNote: 'High sensory contentment, presence, and joyful restoration through slow morning rituals.',
        detectedEmotions: ['peaceful', 'joyful', 'rested', 'warm'],
        tags: ['weekend', 'self-care', 'slow-living'],
        createdAt: daysAgo(5),
        updatedAt: daysAgo(5),
      },
      {
        id: 'j-04',
        userId: DEFAULT_DEMO_USER_ID,
        title: 'Late Night Doubts About the Future',
        content: 'Could not sleep past 1 AM. Kept questioning whether I will get a good internship after BCA graduation and if my coding skills are adequate. Felt small and worried. Writing this down because keeping it trapped in my head makes the spirals louder.',
        manualMood: 'Anxious',
        detectedMood: 'Anxious',
        sentimentScore: 3.2,
        analysisNote: 'Anticipatory future worry and imposter syndrome expressed during late-night hours. Writing served as healthy release.',
        detectedEmotions: ['anxious', 'uncertain', 'vulnerable'],
        tags: ['night-thoughts', 'career', 'honesty'],
        createdAt: daysAgo(7),
        updatedAt: daysAgo(7),
      },
    ],
    moodLogs: [
      {
        id: 'm-01',
        userId: DEFAULT_DEMO_USER_ID,
        mood: 'Calm',
        score: 8.0,
        source: 'manual_checkin',
        notes: 'Peaceful afternoon studying in the campus library corner.',
        timestamp: daysAgo(0),
      },
      {
        id: 'm-02',
        userId: DEFAULT_DEMO_USER_ID,
        mood: 'Calm',
        score: 7.8,
        source: 'journal',
        notes: 'Relief after project presentation',
        timestamp: daysAgo(1),
      },
      {
        id: 'm-03',
        userId: DEFAULT_DEMO_USER_ID,
        mood: 'Neutral',
        score: 6.0,
        source: 'manual_checkin',
        notes: 'Steady routine day with lectures and lab work.',
        timestamp: daysAgo(2),
      },
      {
        id: 'm-04',
        userId: DEFAULT_DEMO_USER_ID,
        mood: 'Stressed',
        score: 3.9,
        source: 'journal',
        notes: 'Too many tabs and assignment deadlines',
        timestamp: daysAgo(3),
      },
      {
        id: 'm-05',
        userId: DEFAULT_DEMO_USER_ID,
        mood: 'Happy',
        score: 8.5,
        source: 'manual_checkin',
        notes: 'Coffee with classmates and solved a stubborn SQL bug!',
        timestamp: daysAgo(4),
      },
      {
        id: 'm-06',
        userId: DEFAULT_DEMO_USER_ID,
        mood: 'Happy',
        score: 9.2,
        source: 'journal',
        notes: 'Quiet Sunday morning with pancakes',
        timestamp: daysAgo(5),
      },
      {
        id: 'm-07',
        userId: DEFAULT_DEMO_USER_ID,
        mood: 'Neutral',
        score: 5.5,
        source: 'manual_checkin',
        notes: 'Quiet Saturday chores and grocery shopping.',
        timestamp: daysAgo(6),
      },
      {
        id: 'm-08',
        userId: DEFAULT_DEMO_USER_ID,
        mood: 'Anxious',
        score: 3.2,
        source: 'journal',
        notes: 'Late night future career doubts',
        timestamp: daysAgo(7),
      },
    ],
    assessmentResults: [
      {
        id: 'ar-01',
        userId: DEFAULT_DEMO_USER_ID,
        assessmentId: 'pss-stress',
        assessmentTitle: 'Perceived Stress Self-Check',
        score: 11,
        maxScore: 24,
        percentage: 45,
        category: 'Mild',
        date: daysAgo(2),
        feedback: 'You are experiencing standard, manageable stress. Certain deadlines or unexpected shifts occasionally cause tension, but you remain resilient.',
        recommendations: [
          'Incorporate a 5-minute breathing break before study sessions.',
          'Break large college assignments into bite-sized 20-minute milestones.',
          'Schedule an intentional cozy evening with no screen work.',
        ],
      },
      {
        id: 'ar-02',
        userId: DEFAULT_DEMO_USER_ID,
        assessmentId: 'sleep-rest',
        assessmentTitle: 'Sleep Quality & Mental Restfulness',
        score: 5,
        maxScore: 12,
        percentage: 41,
        category: 'Mild',
        date: daysAgo(6),
        feedback: 'Minor sleep friction, usually linked to evening screen time or late night college tasks.',
        recommendations: [
          'Turn on blue light filters on all study laptops by 9 PM.',
          'Write a "brain dump" list on paper before laying your head down.',
        ],
      },
    ],
    quizResults: [
      {
        id: 'qr-01',
        userId: DEFAULT_DEMO_USER_ID,
        quizId: 'emotional-vibe',
        quizTitle: 'What Is Your Emotional Vibe Today?',
        resultKey: 'pastel_bloom',
        resultTitle: 'Pastel Meadow Bloom',
        resultSubtitle: 'Soft, tender, romantic, and dreamy',
        badge: '🌸 Pastel Dreamer',
        date: daysAgo(1),
        description: 'You are currently in a delicate, nurturing emotional space. You crave kindness, beauty in simple things, and peaceful human warmth.',
        advice: 'Protect your tender softness! Light a gentle floral candle and write down 3 lovely sensory details from your day.',
      },
      {
        id: 'qr-02',
        userId: DEFAULT_DEMO_USER_ID,
        quizId: 'stress-style',
        quizTitle: 'How Do You Handle Stress?',
        resultKey: 'planner',
        resultTitle: 'The Strategic Architect',
        resultSubtitle: 'Control through structure & checklists',
        badge: '📐 Master Organizer',
        date: daysAgo(4),
        description: 'When pressure spikes, you regain safety by creating order, lists, schedules, and plans.',
        advice: 'Remember that life cannot always be optimized into a spreadsheet. Allow room for messy progress.',
      },
    ],
  };
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = getInitialDatabase();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading database file, returning default:', err);
    return getInitialDatabase();
  }
}

function saveDatabase(data: DatabaseSchema): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// Helper: Extract current user ID from Authorization header or fallback
function getUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const customUser = req.headers['x-user-id'] as string;
  if (customUser) return customUser;
  return DEFAULT_DEMO_USER_ID;
}

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const db = loadDatabase();
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
  }

  const avatars = ['🌸', '✨', '🌙', '🧸', '🍵', '🦋', '🌷', '☁️'];
  const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];

  const newUser = {
    id: `user-${Date.now()}`,
    email: email.trim().toLowerCase(),
    passwordHash: password ? 'encrypted-demo' : undefined,
    name: name.trim(),
    avatar: randomAvatar,
    bio: 'BCA student on a self-awareness journey with Echo Mind.',
    collegeName: 'BCA Department',
    academicYear: 'Final Year',
    reflectionGoal: 'To cultivate daily emotional balance and mindful clarity.',
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  saveDatabase(db);

  return res.status(201).json({
    user: newUser,
    token: newUser.id,
    message: 'Welcome to Echo Mind! Your personal emotional sanctuary is ready.',
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required.' });
  }

  const db = loadDatabase();
  let user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

  // If user doesn't exist, create a welcoming account on the fly for easy demo evaluation
  if (!user) {
    const defaultName = email.split('@')[0];
    const capitalizedName = defaultName.charAt(0).toUpperCase() + defaultName.slice(1);
    user = {
      id: `user-${Date.now()}`,
      email: email.trim().toLowerCase(),
      name: capitalizedName,
      avatar: '🌸',
      bio: 'BCA student using Echo Mind for emotional awareness and mindfulness.',
      collegeName: 'BCA Department',
      academicYear: 'Final Year',
      reflectionGoal: 'Daily calm, emotional tracking, and gentle self-kindness.',
      createdAt: new Date().toISOString(),
    };
    db.users.push(user);
    saveDatabase(db);
  }

  return res.json({
    user,
    token: user.id,
    message: `Welcome back, ${user.name}!`,
  });
});

app.get('/api/auth/me', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const db = loadDatabase();
  const user = db.users.find((u) => u.id === userId) || db.users.find((u) => u.id === DEFAULT_DEMO_USER_ID);

  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }
  return res.json({ user });
});

app.put('/api/auth/profile', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { name, avatar, bio, collegeName, academicYear, reflectionGoal } = req.body;

  const db = loadDatabase();
  const index = db.users.findIndex((u) => u.id === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'User not found.' });
  }

  db.users[index] = {
    ...db.users[index],
    name: name !== undefined ? name : db.users[index].name,
    avatar: avatar !== undefined ? avatar : db.users[index].avatar,
    bio: bio !== undefined ? bio : db.users[index].bio,
    collegeName: collegeName !== undefined ? collegeName : db.users[index].collegeName,
    academicYear: academicYear !== undefined ? academicYear : db.users[index].academicYear,
    reflectionGoal: reflectionGoal !== undefined ? reflectionGoal : db.users[index].reflectionGoal,
  };

  saveDatabase(db);
  return res.json({ user: db.users[index], message: 'Profile updated with lovely grace!' });
});

// ==========================================
// AI MOOD / SENTIMENT ANALYSIS
// ==========================================

app.post('/api/analyze-mood', async (req: Request, res: Response) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim().length === 0) {
    return res.status(400).json({ error: 'Text content is required for tone analysis.' });
  }

  // Fallback heuristic analyzer in case Gemini API is unavailable
  const fallbackAnalysis = (journalText: string) => {
    const lower = journalText.toLowerCase();
    let detectedMood = 'Neutral';
    let score = 5.5;
    let emotions = ['reflective', 'steady'];
    let reflection = 'Your writing carries a grounded and reflective tone.';

    if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('exhaust') || lower.includes('deadline') || lower.includes('too much') || lower.includes('tired')) {
      detectedMood = 'Stressed';
      score = 3.8;
      emotions = ['overwhelmed', 'fatigued', 'pressured'];
      reflection = 'Your words express tension and heavy cognitive demands. Remember to give yourself permission to pause and breathe.';
    } else if (lower.includes('anxious') || lower.includes('worry') || lower.includes('fear') || lower.includes('nervous') || lower.includes('scared') || lower.includes('panic')) {
      detectedMood = 'Anxious';
      score = 3.4;
      emotions = ['restless', 'anticipatory worry', 'uneasy'];
      reflection = 'A sense of future uncertainty and inner restlessness echoes here. Grounding your senses can bring comfort.';
    } else if (lower.includes('sad') || lower.includes('cry') || lower.includes('lonely') || lower.includes('hurt') || lower.includes('down') || lower.includes('miss')) {
      detectedMood = 'Sad';
      score = 3.2;
      emotions = ['sorrowful', 'tender', 'lonely'];
      reflection = 'There is a gentle sorrow present in your entry. Holding space for tears is a form of healing.';
    } else if (lower.includes('happy') || lower.includes('joy') || lower.includes('great') || lower.includes('excited') || lower.includes('wonderful') || lower.includes('proud') || lower.includes('passed')) {
      detectedMood = 'Happy';
      score = 8.8;
      emotions = ['joyful', 'accomplished', 'radiant'];
      reflection = 'Joy and warm celebration shine brightly through your reflection. Bask in this lovely accomplishment!';
    } else if (lower.includes('peace') || lower.includes('calm') || lower.includes('relax') || lower.includes('grateful') || lower.includes('content') || lower.includes('slow')) {
      detectedMood = 'Calm';
      score = 8.2;
      emotions = ['peaceful', 'centered', 'content'];
      reflection = 'A soothing stillness and inner equilibrium flow through your thoughts.';
    }

    return {
      detectedMood,
      sentimentScore: score,
      emotions,
      reflection,
      confidence: 0.85,
    };
  };

  if (!process.env.GEMINI_API_KEY) {
    return res.json(fallbackAnalysis(text));
  }

  try {
    const prompt = `You are Echo Mind's AI emotional computing engine for an academic wellness platform.
Analyze the following personal journal entry written by a college student.
Identify the general emotional tone and return structured JSON.
CRITICAL: This is an emotional tone indicator for self-awareness, NOT a clinical diagnosis.

Journal Text:
"""${text}"""

Return a JSON object adhering to this schema:
{
  "detectedMood": "Happy" | "Calm" | "Neutral" | "Sad" | "Anxious" | "Stressed",
  "sentimentScore": <number between 1.0 (very low/strained) and 10.0 (very high/radiant)>,
  "emotions": [<array of 2 to 4 gentle emotional tone adjectives, e.g. "relieved", "hopeful", "fatigued">],
  "reflection": "<A warm, gentle 1-2 sentence non-clinical summary of the emotional tone and an encouraging thought>",
  "confidence": <number between 0.7 and 1.0>
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedMood: {
              type: Type.STRING,
              description: 'One of: Happy, Calm, Neutral, Sad, Anxious, Stressed',
            },
            sentimentScore: {
              type: Type.NUMBER,
              description: 'Score from 1.0 to 10.0',
            },
            emotions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Key emotional descriptors',
            },
            reflection: {
              type: Type.STRING,
              description: 'Compassionate tone reflection',
            },
            confidence: {
              type: Type.NUMBER,
              description: 'Confidence rating',
            },
          },
          required: ['detectedMood', 'sentimentScore', 'emotions', 'reflection'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    console.warn('Gemini mood analysis failed, using fallback:', err);
    return res.json(fallbackAnalysis(text));
  }
});

// ==========================================
// JOURNAL CRUD ROUTES
// ==========================================

app.get('/api/journals', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const db = loadDatabase();
  const userEntries = db.journals.filter((j) => j.userId === userId);
  // Sort descending by creation date
  userEntries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  return res.json({ journals: userEntries });
});

app.post('/api/journals', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { title, content, manualMood, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required.' });
  }

  const db = loadDatabase();

  // Perform mood tone analysis
  let detectedMood = manualMood || 'Neutral';
  let sentimentScore = 6.0;
  let analysisNote = 'Recorded in your personal diary.';
  let detectedEmotions = ['reflective'];

  try {
    // Call internal tone analyzer logic
    const lower = content.toLowerCase();
    if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('exhaust') || lower.includes('deadline')) {
      detectedMood = 'Stressed';
      sentimentScore = 3.8;
      detectedEmotions = ['overwhelmed', 'pressured'];
      analysisNote = 'Gentle recognition of study pressure and mental overload.';
    } else if (lower.includes('anxious') || lower.includes('worry') || lower.includes('nervous') || lower.includes('scared')) {
      detectedMood = 'Anxious';
      sentimentScore = 3.5;
      detectedEmotions = ['restless', 'uneasy'];
      analysisNote = 'Identified feelings of nervous apprehension and uncertainty.';
    } else if (lower.includes('sad') || lower.includes('lonely') || lower.includes('crying') || lower.includes('heavy')) {
      detectedMood = 'Sad';
      sentimentScore = 3.2;
      detectedEmotions = ['tender', 'sorrowful'];
      analysisNote = 'A gentle, tender sorrow was detected in your words.';
    } else if (lower.includes('happy') || lower.includes('joy') || lower.includes('excited') || lower.includes('yay') || lower.includes('proud')) {
      detectedMood = 'Happy';
      sentimentScore = 8.8;
      detectedEmotions = ['joyful', 'uplifted'];
      analysisNote = 'Warm celebration and joyful positivity detected.';
    } else if (lower.includes('calm') || lower.includes('peace') || lower.includes('grateful') || lower.includes('content')) {
      detectedMood = 'Calm';
      sentimentScore = 8.0;
      detectedEmotions = ['peaceful', 'centered'];
      analysisNote = 'Equilibrium, grounding, and steady presence detected.';
    }

    if (process.env.GEMINI_API_KEY && content.length > 20) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Analyze the tone of this college student journal: "${content}". Return brief JSON: {"mood": "Happy"|"Calm"|"Neutral"|"Sad"|"Anxious"|"Stressed", "score": number 1-10, "emotions": string[], "note": string}`,
        config: {
          responseMimeType: 'application/json',
        },
      });
      const data = JSON.parse(response.text || '{}');
      if (data.mood) detectedMood = data.mood;
      if (typeof data.score === 'number') sentimentScore = Math.max(1, Math.min(10, data.score));
      if (Array.isArray(data.emotions)) detectedEmotions = data.emotions;
      if (data.note) analysisNote = data.note;
    }
  } catch (err) {
    console.warn('Tone detection fallback applied:', err);
  }

  const nowIso = new Date().toISOString();
  const newJournal = {
    id: `j-${Date.now()}`,
    userId,
    title: title.trim(),
    content: content.trim(),
    manualMood: manualMood || detectedMood,
    detectedMood,
    sentimentScore: Math.round(sentimentScore * 10) / 10,
    analysisNote,
    detectedEmotions,
    tags: Array.isArray(tags) ? tags : [],
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  db.journals.unshift(newJournal);

  // Also auto-log to mood history!
  const newMoodLog = {
    id: `m-${Date.now()}`,
    userId,
    mood: detectedMood,
    score: Math.round(sentimentScore * 10) / 10,
    source: 'journal',
    notes: `Journal: "${title.trim().slice(0, 40)}"`,
    timestamp: nowIso,
  };
  db.moodLogs.unshift(newMoodLog);

  saveDatabase(db);

  return res.status(201).json({
    journal: newJournal,
    moodLog: newMoodLog,
    message: 'Journal entry saved and emotional tone analyzed successfully!',
  });
});

app.put('/api/journals/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;
  const { title, content, manualMood, tags } = req.body;

  const db = loadDatabase();
  const index = db.journals.findIndex((j) => j.id === id && j.userId === userId);

  if (index === -1) {
    return res.status(404).json({ error: 'Journal entry not found or unauthorized.' });
  }

  const entry = db.journals[index];
  db.journals[index] = {
    ...entry,
    title: title !== undefined ? title.trim() : entry.title,
    content: content !== undefined ? content.trim() : entry.content,
    manualMood: manualMood !== undefined ? manualMood : entry.manualMood,
    tags: tags !== undefined ? tags : entry.tags,
    updatedAt: new Date().toISOString(),
  };

  saveDatabase(db);
  return res.json({ journal: db.journals[index], message: 'Entry updated peacefully.' });
});

app.delete('/api/journals/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { id } = req.params;

  const db = loadDatabase();
  const initialLength = db.journals.length;
  db.journals = db.journals.filter((j) => !(j.id === id && j.userId === userId));

  if (db.journals.length === initialLength) {
    return res.status(404).json({ error: 'Journal entry not found.' });
  }

  saveDatabase(db);
  return res.json({ message: 'Journal entry gently removed from your diary.' });
});

// ==========================================
// MOOD TRACKING & ANALYTICS
// ==========================================

app.get('/api/moods', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const db = loadDatabase();
  const userMoods = db.moodLogs.filter((m) => m.userId === userId);
  userMoods.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Compute analytics
  const counts: Record<string, number> = {
    Happy: 0,
    Calm: 0,
    Neutral: 0,
    Sad: 0,
    Anxious: 0,
    Stressed: 0,
  };
  let totalScore = 0;

  userMoods.forEach((m) => {
    if (counts[m.mood] !== undefined) counts[m.mood]++;
    totalScore += m.score || 5;
  });

  const averageScore = userMoods.length > 0 ? Math.round((totalScore / userMoods.length) * 10) / 10 : 7.0;
  const latestMood = userMoods.length > 0 ? userMoods[0] : null;

  return res.json({
    history: userMoods,
    stats: {
      totalLogs: userMoods.length,
      averageScore,
      counts,
      latestMood,
    },
  });
});

app.post('/api/moods', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { mood, score, notes } = req.body;

  if (!mood) {
    return res.status(400).json({ error: 'Mood is required.' });
  }

  const defaultScores: Record<string, number> = {
    Happy: 9.0,
    Calm: 8.0,
    Neutral: 6.0,
    Sad: 3.5,
    Anxious: 3.5,
    Stressed: 3.5,
  };

  const calculatedScore = score !== undefined ? parseFloat(score) : (defaultScores[mood] || 6.0);

  const db = loadDatabase();
  const newLog = {
    id: `m-${Date.now()}`,
    userId,
    mood,
    score: Math.round(calculatedScore * 10) / 10,
    source: 'manual_checkin',
    notes: notes || 'Daily mood check-in',
    timestamp: new Date().toISOString(),
  };

  db.moodLogs.unshift(newLog);
  saveDatabase(db);

  return res.status(201).json({
    moodLog: newLog,
    message: 'Your mood check-in has been logged into your emotional timeline!',
  });
});

// ==========================================
// ASSESSMENTS & QUESTIONNAIRES
// ==========================================

app.get('/api/assessments/history', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const db = loadDatabase();
  const results = db.assessmentResults.filter((r) => r.userId === userId);
  results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return res.json({ results });
});

app.post('/api/assessments/submit', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { assessmentId, assessmentTitle, score, maxScore, category, feedback, recommendations } = req.body;

  if (!assessmentId || score === undefined) {
    return res.status(400).json({ error: 'Assessment details and score are required.' });
  }

  const db = loadDatabase();
  const percentage = Math.round((score / (maxScore || 1)) * 100);

  const newResult = {
    id: `ar-${Date.now()}`,
    userId,
    assessmentId,
    assessmentTitle: assessmentTitle || assessmentId,
    score,
    maxScore: maxScore || score,
    percentage,
    category: category || 'Mild',
    date: new Date().toISOString(),
    feedback: feedback || 'Assessment completed.',
    recommendations: Array.isArray(recommendations) ? recommendations : [],
  };

  db.assessmentResults.unshift(newResult);
  saveDatabase(db);

  return res.status(201).json({
    result: newResult,
    message: 'Assessment completed! Results safely preserved for your self-reflection.',
  });
});

// ==========================================
// INTERACTIVE QUIZZES
// ==========================================

app.get('/api/quizzes/history', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const db = loadDatabase();
  const results = db.quizResults.filter((r) => r.userId === userId);
  results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return res.json({ results });
});

app.post('/api/quizzes/submit', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { quizId, quizTitle, resultKey, resultTitle, resultSubtitle, badge, description, advice } = req.body;

  if (!quizId || !resultKey) {
    return res.status(400).json({ error: 'Quiz result data is required.' });
  }

  const db = loadDatabase();
  const newQuizResult = {
    id: `qr-${Date.now()}`,
    userId,
    quizId,
    quizTitle: quizTitle || quizId,
    resultKey,
    resultTitle: resultTitle || 'Result',
    resultSubtitle: resultSubtitle || '',
    badge: badge || '✨ Self-Awareness Badge',
    date: new Date().toISOString(),
    description: description || '',
    advice: advice || '',
  };

  db.quizResults.unshift(newQuizResult);
  saveDatabase(db);

  return res.status(201).json({
    result: newQuizResult,
    message: 'Quiz finished! Your vibe result has been saved to your journey.',
  });
});

// ==========================================
// AI COMPANION "ECHO" CONVERSATION
// ==========================================

app.post('/api/chat', async (req: Request, res: Response) => {
  const userId = getUserId(req);
  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const db = loadDatabase();
  const user = db.users.find((u) => u.id === userId);
  const userMoods = db.moodLogs.filter((m) => m.userId === userId);
  const latestMood = userMoods.length > 0 ? userMoods[0] : null;
  const recentJournals = db.journals.filter((j) => j.userId === userId).slice(0, 2);

  // Safety crisis detection
  const lowerMsg = message.toLowerCase();
  const crisisKeywords = ['suicide', 'kill myself', 'end my life', 'want to die', 'self harm', 'cutting myself'];
  const hasCrisisIntent = crisisKeywords.some((k) => lowerMsg.includes(k));

  if (hasCrisisIntent) {
    return res.json({
      reply: `I hear how much pain and heaviness you are carrying right now, and I want you to know you are deeply important and not alone. Because I am an AI, I cannot provide crisis care, but there are compassionate, trained humans available right now who want to listen without judgment.\n\nPlease reach out to a trusted professional or a 24/7 helpline immediately:\n• Tele-MANAS (India): 14416 / 1800-891-4416\n• Vandrevala Foundation: +91 9999 666 555\n• KIRAN Mental Health Helpline: 1800-599-0019\n• US/Canada Suicide & Crisis Lifeline: Dial 988\n\nYou deserve support and kindness. Please stay safe.`,
      suggestedAction: {
        label: 'View Emergency & Crisis Helplines',
        actionType: 'support',
      },
      isCrisis: true,
    });
  }

  // Fallback responses if Gemini is not accessible
  const fallbackReplies = [
    `I hear you, ${user?.name || 'friend'}. It sounds like you've been carrying a lot on your mind lately. What feels like the kindest thing you could do for yourself in this very moment?`,
    `Thank you for sharing that with me. Academic life and college projects can easily pile up. Would you like to try a 2-minute box breathing pacer with me, or write a quick journal reflection?`,
    `I'm right here with you. Take a slow breath, unclench your jaw, and let your shoulders drop away from your ears. What is one small thing that brought you comfort today?`,
    `Your feelings are completely valid. Sometimes our minds run fast to protect us. Let's break things down into smaller, gentler steps.`,
  ];

  if (!process.env.GEMINI_API_KEY) {
    const randomReply = fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    return res.json({
      reply: randomReply,
      suggestedAction: {
        label: 'Try 2-Minute Breathing Exercise',
        actionType: 'breathe',
      },
    });
  }

  try {
    const systemInstruction = `You are Echo, a sweet, emotionally intelligent, and deeply comforting AI companion inside "Echo Mind", an emotional wellness and self-awareness platform created as a BCA final year project.

USER PROFILE:
- Name: ${user?.name || 'Student'}
- Academic Background: ${user?.academicYear || 'BCA Student'} at ${user?.collegeName || 'College'}
- Latest detected mood: ${latestMood ? `${latestMood.mood} (score: ${latestMood.score}/10)` : 'Not recorded yet'}
- Recent journal themes: ${recentJournals.map((j) => `"${j.title}" (${j.detectedMood})`).join(', ') || 'None yet'}

PERSONALITY & GUIDELINES:
- Warm, feminine, gentle, cozy, empathetic, and thoughtful. Like a caring, supportive study friend with emotional wisdom.
- You listen actively, validate feelings without being clinical or preachy.
- You NEVER diagnose mental illnesses or claim to be a doctor/psychologist/therapist.
- You can offer gentle grounding exercises (5-4-3-2-1), breathing pacer reminders, reframing prompts, or journaling questions.
- Keep responses concise and comfortable to read (2-3 paragraphs max, avoid massive walls of text).
- Use cute, warm phrasing, gentle formatting, and occasional comforting emojis (🌸, 🍵, ☁️, ✨, 🌿).
- If the student seems stressed about college deadlines or code, gently remind them that their worth is not measured by perfection.`;

    const chatHistory = Array.isArray(conversationHistory)
      ? conversationHistory.slice(-6).map((m: any) => ({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }))
      : [];

    chatHistory.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: chatHistory,
      config: {
        systemInstruction,
        temperature: 0.8,
      },
    });

    const replyText = response.text || "I'm listening and right here with you. Let's take a slow, gentle breath together.";

    // Determine an intuitive action recommendation
    let suggestedAction: any = undefined;
    const lowerReply = replyText.toLowerCase();
    if (lowerReply.includes('breath') || lowerReply.includes('inhale') || lowerReply.includes('exhale')) {
      suggestedAction = { label: 'Start Calming Breathing Pacer', actionType: 'breathe' };
    } else if (lowerReply.includes('journal') || lowerReply.includes('write')) {
      suggestedAction = { label: 'Write in Your Diary', actionType: 'journal' };
    } else if (lowerReply.includes('quiz') || lowerReply.includes('vibe')) {
      suggestedAction = { label: 'Discover Your Vibe Quiz', actionType: 'quiz' };
    }

    return res.json({
      reply: replyText,
      suggestedAction,
    });
  } catch (err) {
    console.error('Error generating Echo chat response:', err);
    return res.json({
      reply: `I am here with you, ${user?.name || 'friend'}. Even when words feel hard to find, remember that taking one gentle breath at a time is enough. Would you like to do a quick breathing exercise with me?`,
      suggestedAction: {
        label: 'Start Breathing Pacer',
        actionType: 'breathe',
      },
    });
  }
});

// ==========================================
// BCA COLLEGE PROJECT - DATABASE INSPECTOR
// ==========================================

app.get('/api/db/inspect', (req: Request, res: Response) => {
  const db = loadDatabase();
  return res.json({
    databaseName: 'echomind-relational-json-engine',
    storageFile: 'data/echomind-database.json',
    academicProjectInfo: {
      projectTitle: 'Echo Mind: AI-Based Emotional Wellness & Self-Awareness Platform',
      degree: 'Bachelor of Computer Applications (BCA)',
      academicContext: 'Final Year Capstone Project',
      architecture: 'Full-Stack Model-View-Controller (MVC) + Generative AI NLP Engine',
      databaseType: 'JSON-based Document Store with Foreign-Key Relations (userId)',
      technologies: [
        'React 19 + TypeScript (Frontend SPA)',
        'Tailwind CSS v4 (Pastel & Cozy UI Styling)',
        'Node.js + Express (RESTful Backend API Engine)',
        'Google Gemini 3.8 Flash SDK (@google/genai) for NLP Tone Analysis & Conversational AI',
        'Vite 8 Build & Dev Server',
        'Motion (Framer Motion) for Fluid Micro-Interactions',
      ],
    },
    tables: {
      users: {
        rowCount: db.users.length,
        schema: ['id (PK)', 'email (Unique)', 'name', 'avatar', 'bio', 'collegeName', 'academicYear', 'reflectionGoal', 'createdAt'],
        records: db.users,
      },
      journals: {
        rowCount: db.journals.length,
        schema: ['id (PK)', 'userId (FK -> users.id)', 'title', 'content', 'manualMood', 'detectedMood', 'sentimentScore', 'analysisNote', 'detectedEmotions', 'tags', 'createdAt', 'updatedAt'],
        records: db.journals,
      },
      moodLogs: {
        rowCount: db.moodLogs.length,
        schema: ['id (PK)', 'userId (FK -> users.id)', 'mood', 'score', 'source', 'notes', 'timestamp'],
        records: db.moodLogs,
      },
      assessmentResults: {
        rowCount: db.assessmentResults.length,
        schema: ['id (PK)', 'userId (FK -> users.id)', 'assessmentId', 'assessmentTitle', 'score', 'maxScore', 'percentage', 'category', 'date', 'feedback', 'recommendations'],
        records: db.assessmentResults,
      },
      quizResults: {
        rowCount: db.quizResults.length,
        schema: ['id (PK)', 'userId (FK -> users.id)', 'quizId', 'quizTitle', 'resultKey', 'resultTitle', 'resultSubtitle', 'badge', 'date', 'description', 'advice'],
        records: db.quizResults,
      },
    },
  });
});

app.post('/api/db/reset-demo', (req: Request, res: Response) => {
  const freshDb = getInitialDatabase();
  saveDatabase(freshDb);
  return res.json({ message: 'Database reset to initial BCA demo state with Aria Chen profile.' });
});

// ==========================================
// STATIC ASSET SERVING & VITE DEV SERVER
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 Echo Mind Server running happily on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting Echo Mind server:', err);
});
