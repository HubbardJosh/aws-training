import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProgress, Domain } from "../types";

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
};

export async function loadProgress(): Promise<UserProgress> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultProgress;
    return { ...defaultProgress, ...JSON.parse(raw) };
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
