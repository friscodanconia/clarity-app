export type QuestionType = 'big-picture' | 'drill-down' | 'curveball' | 'defend' | 'simplify';

export type Domain =
  | 'marketing' | 'ai' | 'product' | 'strategy' | 'finance'
  | 'engineering' | 'design' | 'sales' | 'operations' | 'leadership';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Prompt {
  id: string;
  text: string;
  type: QuestionType;
  domains: Domain[];
  difficulty?: Difficulty;
}

export interface UserProfile {
  domains: Domain[];
  createdAt: string;
  timedMode?: boolean;
  timerDuration?: 60 | 90 | 120;
  preferredDifficulty?: Difficulty;
}

export interface DimensionScore {
  score: number;
  note: string;
}

export interface AnalysisResult {
  overall: number;
  dimensions: {
    structure: DimensionScore;
    clarity: DimensionScore;
    conciseness: DimensionScore;
    altitude: DimensionScore;
    confidence: DimensionScore;
  };
  summary: string;
  keyImprovement: string;
  polishedVersion: string;
  fillerWords: string[];
}

export interface Attempt {
  transcript: string;
  duration: number;
  analysis: AnalysisResult;
  recordedAt: string;
}

export interface Session {
  id: string;
  prompt: Prompt;
  attempts: Attempt[];
  createdAt: string;
}

export type DrillPhase = 'ready' | 'recording' | 'transcribing' | 'analyzing' | 'feedback' | 'retrying';

export interface SessionState {
  phase: DrillPhase;
  prompt: Prompt | null;
  currentTranscript: string;
  attempts: Attempt[];
  isRecording: boolean;
  elapsed: number;
}

export interface Stats {
  totalSessions: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  averageImprovement: number;
  scoresByDimension: Record<string, number>;
  recentScores: { date: string; score: number }[];
}
