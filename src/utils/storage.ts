import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  UserProgress,
  Domain,
  GuideProgress,
  WeakTopic,
  MissedQuestion,
} from "../types";

const STORAGE_KEY = "aws_training_progress_dva";

const defaultProgress: UserProgress = {
  studiedCards: {},
  quizHistory: [],
  domainScores: {
    development: { attempted: 0, correct: 0 },
    security: { attempted: 0, correct: 0 },
    deployment: { attempted: 0, correct: 0 },
    troubleshooting: { attempted: 0, correct: 0 },
    fundamentals: { attempted: 0, correct: 0 },
    services: { attempted: 0, correct: 0 },
    applications: { attempted: 0, correct: 0 },
  },
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  streakDays: 0,
  lastStudied: null,
  guideProgress: {},
  weakTopics: {},
  missedQuestions: {},
};

export async function loadProgress(
  storageKey: string = STORAGE_KEY,
): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(storageKey);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      domainScores: {
        ...defaultProgress.domainScores,
        ...parsed.domainScores,
      },
      guideProgress: parsed.guideProgress ?? {},
      weakTopics: parsed.weakTopics ?? {},
      missedQuestions: parsed.missedQuestions ?? {},
    };
  } catch {
    return defaultProgress;
  }
}

export async function saveProgress(
  progress: UserProgress,
  storageKey: string = STORAGE_KEY,
): Promise<void> {
  await AsyncStorage.setItem(storageKey, JSON.stringify(progress));
}

export async function resetProgress(
  storageKey: string = STORAGE_KEY,
): Promise<void> {
  await AsyncStorage.removeItem(storageKey);
}

export function getDomainAccuracy(
  progress: UserProgress,
  domain: Domain,
): number {
  const score = progress.domainScores[domain];
  if (score.attempted === 0) return 0;
  return Math.round((score.correct / score.attempted) * 100);
}

export function getOverallAccuracy(progress: UserProgress): number {
  if (progress.totalQuestionsAnswered === 0) return 0;
  return Math.round(
    (progress.totalCorrect / progress.totalQuestionsAnswered) * 100,
  );
}

export function getGuideProgress(
  progress: UserProgress,
  guideId: string,
): GuideProgress | null {
  return progress.guideProgress[guideId] ?? null;
}

/** Record a guide as opened and update streak. Returns updated progress. */
export function touchGuide(
  progress: UserProgress,
  guideId: string,
  totalSections: number,
): UserProgress {
  const now = new Date().toISOString();
  const existing = progress.guideProgress[guideId];
  const sectionsRead = existing?.sectionsRead ?? [];
  return {
    ...withStreak(progress, now),
    guideProgress: {
      ...progress.guideProgress,
      [guideId]: {
        viewedAt: now,
        sectionsRead,
        completed: sectionsRead.length >= totalSections,
      },
    },
  };
}

/** Record a section as read within a guide. Returns updated progress. */
export function markSectionRead(
  progress: UserProgress,
  guideId: string,
  sectionIndex: number,
  totalSections: number,
): UserProgress {
  const existing = progress.guideProgress[guideId];
  const sectionsRead = existing
    ? Array.from(new Set([...existing.sectionsRead, sectionIndex]))
    : [sectionIndex];
  const completed = sectionsRead.length >= totalSections;
  return {
    ...progress,
    guideProgress: {
      ...progress.guideProgress,
      [guideId]: {
        viewedAt: existing?.viewedAt ?? new Date().toISOString(),
        sectionsRead,
        completed,
      },
    },
  };
}

/** Update streak based on last studied date. */
function withStreak(progress: UserProgress, now: string): UserProgress {
  const today = new Date(now).toDateString();
  const lastDay = progress.lastStudied
    ? new Date(progress.lastStudied).toDateString()
    : null;

  if (lastDay === today) {
    // Already studied today — no change to streak
    return { ...progress, lastStudied: now };
  }

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const wasYesterday = lastDay === yesterday.toDateString();

  return {
    ...progress,
    lastStudied: now,
    streakDays: wasYesterday ? progress.streakDays + 1 : 1,
  };
}

/** Call this whenever the user does any study activity (flashcards, quizzes). */
export function touchStreak(progress: UserProgress): UserProgress {
  return withStreak(progress, new Date().toISOString());
}

/**
 * Increment wrong-answer counts for the given services.
 * services is an array of service names from incorrect quiz questions.
 */
export function recordWrongAnswers(
  progress: UserProgress,
  services: string[],
): UserProgress {
  const now = new Date().toISOString();
  const updated = { ...progress.weakTopics };
  for (const service of services) {
    const existing = updated[service];
    updated[service] = {
      service,
      wrongCount: (existing?.wrongCount ?? 0) + 1,
      lastMissed: now,
      needsReview: existing?.needsReview ?? false,
    };
  }
  return { ...progress, weakTopics: updated };
}

/** Toggle the needsReview flag for a service. */
export function toggleNeedsReview(
  progress: UserProgress,
  service: string,
): UserProgress {
  const existing = progress.weakTopics[service];
  if (!existing) return progress;
  return {
    ...progress,
    weakTopics: {
      ...progress.weakTopics,
      [service]: { ...existing, needsReview: !existing.needsReview },
    },
  };
}

/** Return weak topics sorted by wrongCount descending. */
export function getSortedWeakTopics(progress: UserProgress): WeakTopic[] {
  return Object.values(progress.weakTopics).sort(
    (a, b) => b.wrongCount - a.wrongCount,
  );
}

/** Remove all progress for a single guide (sections read, completed flag, weak topic entry). */
export function resetGuideProgress(
  progress: UserProgress,
  guideId: string,
  service: string,
): UserProgress {
  const guideProgress = { ...progress.guideProgress };
  delete guideProgress[guideId];
  const weakTopics = { ...progress.weakTopics };
  delete weakTopics[service];
  return { ...progress, guideProgress, weakTopics };
}

/** Clear all guide progress (sections read, completion flags). */
export function resetAllGuides(progress: UserProgress): UserProgress {
  return { ...progress, guideProgress: {} };
}

/** Clear all flashcard study status. */
export function resetAllFlashcards(progress: UserProgress): UserProgress {
  return { ...progress, studiedCards: {} };
}

/** Clear all quiz history and domain scores. */
export function resetAllQuizzes(progress: UserProgress): UserProgress {
  return {
    ...progress,
    quizHistory: [],
    totalQuestionsAnswered: 0,
    totalCorrect: 0,
    domainScores: {
      development: { attempted: 0, correct: 0 },
      security: { attempted: 0, correct: 0 },
      deployment: { attempted: 0, correct: 0 },
      troubleshooting: { attempted: 0, correct: 0 },
      fundamentals: { attempted: 0, correct: 0 },
      services: { attempted: 0, correct: 0 },
      applications: { attempted: 0, correct: 0 },
    },
    weakTopics: {},
  };
}

/** Clear domain scores for a single domain (quiz accuracy only, not history). */
export function resetDomainScore(
  progress: UserProgress,
  domain: Domain,
): UserProgress {
  const domainAttempted = progress.domainScores[domain]?.attempted ?? 0;
  const domainCorrect = progress.domainScores[domain]?.correct ?? 0;
  return {
    ...progress,
    domainScores: {
      ...progress.domainScores,
      [domain]: { attempted: 0, correct: 0 },
    },
    totalQuestionsAnswered: Math.max(
      0,
      progress.totalQuestionsAnswered - domainAttempted,
    ),
    totalCorrect: Math.max(0, progress.totalCorrect - domainCorrect),
  };
}

export function getGuidesCompleted(progress: UserProgress): number {
  return Object.values(progress.guideProgress).filter((g) => g.completed)
    .length;
}

export function getGuidesViewed(progress: UserProgress): number {
  return Object.keys(progress.guideProgress).length;
}

/** Simple hash of a string to use as a stable question ID. */
function hashString(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return (h >>> 0).toString(36);
}

/** Record a guide quiz question as missed. Increments missCount if already present. */
export function recordMissedQuestion(
  progress: UserProgress,
  question: Omit<MissedQuestion, "id" | "missedAt" | "missCount">,
): UserProgress {
  const id = hashString(question.question);
  const existing = progress.missedQuestions[id];
  return {
    ...progress,
    missedQuestions: {
      ...progress.missedQuestions,
      [id]: {
        ...question,
        id,
        missedAt: existing?.missedAt ?? new Date().toISOString(),
        missCount: (existing?.missCount ?? 0) + 1,
      },
    },
  };
}

/** Remove a question from the missed list (user dismissed it). */
export function removeMissedQuestion(
  progress: UserProgress,
  id: string,
): UserProgress {
  const updated = { ...progress.missedQuestions };
  delete updated[id];
  return { ...progress, missedQuestions: updated };
}

/** Return missed questions sorted by missCount descending. */
export function getMissedQuestions(progress: UserProgress): MissedQuestion[] {
  return Object.values(progress.missedQuestions).sort(
    (a, b) => b.missCount - a.missCount,
  );
}
