export type Domain =
  "development" | "security" | "deployment" | "troubleshooting";

export type Difficulty = "easy" | "medium" | "hard";

export interface FlashCard {
  id: string;
  service: string;
  domain: Domain;
  question: string;
  answer: string;
  keyPoints: string[];
  difficulty: Difficulty;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  domain: Domain;
  difficulty: Difficulty;
  type: "single" | "multi";
  question: string;
  options: string[];
  correctIndices: number[];
  explanation: string;
  optionExplanations?: string[];
  service: string;
  tags: string[];
}

export interface GuideProgress {
  viewedAt: string;
  sectionsRead: number[];
  completed: boolean;
}

export interface WeakTopic {
  service: string;
  wrongCount: number;
  lastMissed: string;
  needsReview: boolean;
}

export interface UserProgress {
  studiedCards: Record<string, "known" | "learning" | "unseen">;
  quizHistory: QuizAttempt[];
  domainScores: Record<Domain, DomainScore>;
  totalQuestionsAnswered: number;
  totalCorrect: number;
  streakDays: number;
  lastStudied: string | null;
  guideProgress: Record<string, GuideProgress>;
  weakTopics: Record<string, WeakTopic>;
}

export interface DomainScore {
  attempted: number;
  correct: number;
}

export interface QuizAttempt {
  id: string;
  date: string;
  domain: Domain | "all";
  score: number;
  total: number;
  timeSeconds: number;
  questionIds: string[];
}

export interface QuizSession {
  questions: QuizQuestion[];
  domain: Domain | "all";
  difficulty: Difficulty | "all";
  currentIndex: number;
  answers: (number[] | null)[];
  startTime: number;
}
