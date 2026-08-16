import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProgress, Domain, GuideProgress, WeakTopic } from "../types";

const STORAGE_KEY = "aws_training_progress";

const defaultProgress: UserProgress = {
  studiedCards: {},
  quizHistory: [],
  domainScores: {
    development: { attempted: 0, correct: 0 },
    security: { attempted: 0, correct: 0 },
    deployment: { attempted: 0, correct: 0 },
    troubleshooting: { attempted: 0, correct: 0 },
  },
  totalQuestionsAnswered: 0,
  totalCorrect: 0,
  streakDays: 0,
  lastStudied: null,
  guideProgress: {},
  weakTopics: {},
};

export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    const parsed = JSON.parse(raw);
    return {
      ...defaultProgress,
      ...parsed,
      // Ensure nested objects are merged properly for new fields
      domainScores: {
        ...defaultProgress.domainScores,
        ...parsed.domainScores,
      },
      guideProgress: parsed.guideProgress ?? {},
      weakTopics: parsed.weakTopics ?? {},
    };
  } catch {
    return defaultProgress;
  }
}

export async function saveProgress(progress: UserProgress): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export async function resetProgress(): Promise<void> {
  await AsyncStorage.removeItem(STORAGE_KEY);
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

export function getGuidesCompleted(progress: UserProgress): number {
  return Object.values(progress.guideProgress).filter((g) => g.completed)
    .length;
}

export function getGuidesViewed(progress: UserProgress): number {
  return Object.keys(progress.guideProgress).length;
}
