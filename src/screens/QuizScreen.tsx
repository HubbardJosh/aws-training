import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, radius, fontSize, DOMAIN_META } from "../utils/theme";
import {
  QuizQuestion,
  Domain,
  Difficulty,
  UserProgress,
  QuizAttempt,
} from "../types";
import {
  loadProgress,
  saveProgress,
  touchStreak,
  recordWrongAnswers,
} from "../utils/storage";
import { RootStackParamList } from "../navigation";
import { useCert } from "../context/CertContext";
import { useCertData } from "../context/useCertData";

type Route = RouteProp<RootStackParamList, "Quiz">;
type Nav = NativeStackNavigationProp<RootStackParamList>;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { domain, difficulty, count, service } = route.params;
  const { certMeta } = useCert();
  const { quizQuestions } = useCertData();

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [answers, setAnswers] = useState<(number[] | null)[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [finished, setFinished] = useState(false);
  const startTime = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const filtered = quizQuestions.filter((q) => {
      const domainMatch = domain === "all" || q.domain === (domain as Domain);
      const diffMatch =
        difficulty === "all" || q.difficulty === (difficulty as Difficulty);
      const serviceMatch = !service || q.service === service;
      return domainMatch && diffMatch && serviceMatch;
    });
    const selected = shuffle(filtered).slice(0, count);
    setQuestions(selected);
    setAnswers(new Array(selected.length).fill(null));
  }, [domain, difficulty, count]);

  useEffect(() => {
    timerRef.current = setInterval(
      () => setElapsed(Math.floor((Date.now() - startTime.current) / 1000)),
      1000,
    );
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const currentQ = questions[currentIndex];

  const toggleOption = (idx: number) => {
    if (submitted) return;
    if (currentQ.type === "single") {
      setSelectedOptions([idx]);
    } else {
      setSelectedOptions((prev) =>
        prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
      );
    }
  };

  const handleSubmit = useCallback(async () => {
    if (selectedOptions.length === 0) return;
    setSubmitted(true);
    const newAnswers = [...answers];
    newAnswers[currentIndex] = selectedOptions;
    setAnswers(newAnswers);

    if (currentIndex === questions.length - 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      setFinished(true);

      // Calculate score and persist
      let correct = 0;
      const finalAnswers = newAnswers;
      questions.forEach((q, i) => {
        const ans = finalAnswers[i];
        if (!ans) return;
        const sorted = [...ans].sort().join(",");
        const expected = [...q.correctIndices].sort().join(",");
        if (sorted === expected) correct++;
      });

      const progress = await loadProgress(certMeta.storageKey);
      const attempt: QuizAttempt = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        domain: domain as Domain | "all",
        score: correct,
        total: questions.length,
        timeSeconds: elapsed,
        questionIds: questions.map((q) => q.id),
      };

      const updatedDomainScores = { ...progress.domainScores };
      const wrongServices: string[] = [];
      questions.forEach((q, i) => {
        const ans = finalAnswers[i];
        if (!ans) return;
        const sorted = [...ans].sort().join(",");
        const expected = [...q.correctIndices].sort().join(",");
        const isCorrect = sorted === expected;
        updatedDomainScores[q.domain] = {
          attempted: updatedDomainScores[q.domain].attempted + 1,
          correct: updatedDomainScores[q.domain].correct + (isCorrect ? 1 : 0),
        };
        if (!isCorrect) wrongServices.push(q.service);
      });

      const withWeak = recordWrongAnswers(progress, wrongServices);
      const updated: UserProgress = touchStreak({
        ...withWeak,
        quizHistory: [attempt, ...progress.quizHistory].slice(0, 50),
        domainScores: updatedDomainScores,
        totalQuestionsAnswered:
          progress.totalQuestionsAnswered + questions.length,
        totalCorrect: progress.totalCorrect + correct,
      });
      await saveProgress(updated, certMeta.storageKey);
    }
  }, [selectedOptions, answers, currentIndex, questions, domain, elapsed]);

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOptions([]);
      setSubmitted(false);
    }
  };

  const handleQuit = () => {
    Alert.alert(
      "Quit Quiz",
      "Are you sure you want to quit? Progress will be lost.",
      [
        { text: "Continue", style: "cancel" },
        {
          text: "Quit",
          style: "destructive",
          onPress: () => {
            if (timerRef.current) clearInterval(timerRef.current);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)
      .toString()
      .padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  if (questions.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Loading questions…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentQ) return null;

  const meta = DOMAIN_META[currentQ.domain];
  const isCorrect =
    submitted &&
    [...selectedOptions].sort().join(",") ===
      [...currentQ.correctIndices].sort().join(",");

  // Score so far
  const scoredSoFar = answers.slice(0, currentIndex).filter((a, i) => {
    if (!a) return false;
    return (
      [...a].sort().join(",") ===
      [...questions[i].correctIndices].sort().join(",")
    );
  }).length;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleQuit} style={styles.headerBtn}>
          <Ionicons name="close" size={22} color={colors.textSecondary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerCount}>
            {currentIndex + 1} / {questions.length}
          </Text>
          <View
            style={[styles.domainTag, { backgroundColor: meta.color + "22" }]}
          >
            <Text style={[styles.domainTagText, { color: meta.color }]}>
              {meta.label}
            </Text>
          </View>
        </View>
        <View style={styles.timerBox}>
          <Ionicons
            name="time-outline"
            size={14}
            color={colors.textSecondary}
          />
          <Text style={styles.timerText}>{formatTime(elapsed)}</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((currentIndex + 1) / questions.length) * 100}%`,
              backgroundColor: meta.color,
            },
          ]}
        />
      </View>

      {/* Score tracker */}
      <View style={styles.scoreTracker}>
        <Text style={styles.scoreTrackerText}>
          Score: {scoredSoFar}/{currentIndex} correct
        </Text>
        <View
          style={[
            styles.typeBadge,
            {
              backgroundColor:
                currentQ.type === "multi"
                  ? colors.accent + "22"
                  : colors.primary + "22",
            },
          ]}
        >
          <Text
            style={[
              styles.typeBadgeText,
              {
                color:
                  currentQ.type === "multi" ? colors.accent : colors.primary,
              },
            ]}
          >
            {currentQ.type === "multi" ? "Select all that apply" : "Select one"}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Question */}
        <View style={styles.questionCard}>
          <View style={styles.questionMeta}>
            <View
              style={[
                styles.serviceBadge,
                { backgroundColor: meta.color + "22" },
              ]}
            >
              <Text style={[styles.serviceBadgeText, { color: meta.color }]}>
                {currentQ.service}
              </Text>
            </View>
            <View
              style={[
                styles.diffBadge,
                {
                  backgroundColor:
                    currentQ.difficulty === "easy"
                      ? colors.easy + "22"
                      : currentQ.difficulty === "medium"
                        ? colors.medium + "22"
                        : colors.hard + "22",
                },
              ]}
            >
              <Text
                style={[
                  styles.diffBadgeText,
                  {
                    color:
                      currentQ.difficulty === "easy"
                        ? colors.easy
                        : currentQ.difficulty === "medium"
                          ? colors.medium
                          : colors.hard,
                  },
                ]}
              >
                {currentQ.difficulty}
              </Text>
            </View>
          </View>
          <Text style={styles.questionText}>{currentQ.question}</Text>
        </View>

        {/* Options */}
        {currentQ.options.map((option, idx) => {
          const isSelected = selectedOptions.includes(idx);
          const isCorrectOption = currentQ.correctIndices.includes(idx);
          let bgColor = colors.surface;
          let borderColor = colors.border;
          let textColor = colors.textPrimary;
          let icon: string | null = null;

          if (submitted) {
            if (isCorrectOption) {
              bgColor = colors.correct + "22";
              borderColor = colors.correct;
              textColor = colors.correct;
              icon = "checkmark-circle";
            } else if (isSelected && !isCorrectOption) {
              bgColor = colors.incorrect + "22";
              borderColor = colors.incorrect;
              textColor = colors.incorrect;
              icon = "close-circle";
            }
          } else if (isSelected) {
            bgColor = colors.primary + "22";
            borderColor = colors.primary;
          }

          return (
            <TouchableOpacity
              key={idx}
              style={[styles.option, { backgroundColor: bgColor, borderColor }]}
              onPress={() => toggleOption(idx)}
              disabled={submitted}
              activeOpacity={0.8}
            >
              <View style={styles.optionLeft}>
                <View
                  style={[
                    currentQ.type === "single" ? styles.radio : styles.checkbox,
                    isSelected && !submitted && { borderColor: colors.primary },
                    submitted &&
                      isCorrectOption && {
                        borderColor: colors.correct,
                        backgroundColor: colors.correct,
                      },
                    submitted &&
                      isSelected &&
                      !isCorrectOption && {
                        borderColor: colors.incorrect,
                        backgroundColor: colors.incorrect,
                      },
                  ]}
                >
                  {(isSelected || (submitted && isCorrectOption)) && (
                    <View
                      style={[
                        currentQ.type === "single"
                          ? styles.radioDot
                          : styles.checkMark,
                        submitted
                          ? { backgroundColor: colors.textPrimary }
                          : { backgroundColor: colors.primary },
                      ]}
                    />
                  )}
                </View>
              </View>
              <Text style={[styles.optionText, { color: textColor }]}>
                {option}
              </Text>
              {submitted && icon && (
                <Ionicons
                  name={icon as any}
                  size={20}
                  color={isCorrectOption ? colors.correct : colors.incorrect}
                />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Explanation */}
        {submitted && (
          <View
            style={[
              styles.explanationCard,
              {
                borderColor: isCorrect
                  ? colors.correct + "55"
                  : colors.incorrect + "55",
              },
            ]}
          >
            <View style={styles.explanationHeader}>
              <Ionicons
                name={isCorrect ? "checkmark-circle" : "close-circle"}
                size={22}
                color={isCorrect ? colors.correct : colors.incorrect}
              />
              <Text
                style={[
                  styles.explanationTitle,
                  { color: isCorrect ? colors.correct : colors.incorrect },
                ]}
              >
                {isCorrect ? "Correct!" : "Incorrect"}
              </Text>
            </View>

            {/* Per-option "why wrong" breakdown when answer is incorrect */}
            {!isCorrect &&
              currentQ.optionExplanations &&
              selectedOptions
                .filter((idx) => !currentQ.correctIndices.includes(idx))
                .map((idx) => (
                  <View key={idx} style={styles.wrongReasonBox}>
                    <View style={styles.wrongReasonHeader}>
                      <Ionicons
                        name="close-circle"
                        size={14}
                        color={colors.incorrect}
                      />
                      <Text style={styles.wrongReasonLabel} numberOfLines={1}>
                        {currentQ.options[idx]}
                      </Text>
                    </View>
                    <Text style={styles.wrongReasonText}>
                      {currentQ.optionExplanations![idx]}
                    </Text>
                  </View>
                ))}

            <View style={styles.correctReasonBox}>
              <View style={styles.explanationSubHeader}>
                <Ionicons
                  name="bulb-outline"
                  size={15}
                  color={colors.correct}
                />
                <Text style={styles.explanationSubTitle}>
                  {isCorrect
                    ? "Why this is correct"
                    : "Why the correct answer is right"}
                </Text>
              </View>
              <Text style={styles.explanationText}>{currentQ.explanation}</Text>
            </View>

            <View style={styles.tagRow}>
              {currentQ.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 16 }} />
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.bottomBar}>
        {!submitted ? (
          <TouchableOpacity
            style={[
              styles.submitBtn,
              selectedOptions.length === 0 && styles.submitBtnDisabled,
            ]}
            onPress={handleSubmit}
            disabled={selectedOptions.length === 0}
          >
            <Text
              style={[
                styles.submitBtnText,
                selectedOptions.length === 0 && { color: colors.textMuted },
              ]}
            >
              Submit Answer
            </Text>
          </TouchableOpacity>
        ) : currentIndex < questions.length - 1 ? (
          <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
            <Text style={styles.nextBtnText}>Next Question</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.secondary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.finishBtn}
            onPress={() =>
              navigation.navigate("QuizResult", {
                sessionId: Date.now().toString(),
              })
            }
          >
            <Ionicons name="flag" size={20} color={colors.secondary} />
            <Text style={styles.finishBtnText}>View Results</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: fontSize.lg, color: colors.textMuted },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerBtn: { padding: spacing.xs },
  headerCenter: { flex: 1, alignItems: "center", gap: 4 },
  headerCount: {
    fontSize: fontSize.md,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  domainTag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  domainTagText: { fontSize: fontSize.xs, fontWeight: "700" },
  timerBox: { flexDirection: "row", alignItems: "center", gap: 4 },
  timerText: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textSecondary,
    minWidth: 42,
  },

  progressBg: {
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing.xs,
  },
  progressFill: { height: "100%", borderRadius: radius.full },

  scoreTracker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  scoreTrackerText: { fontSize: fontSize.xs, color: colors.textSecondary },
  typeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  typeBadgeText: { fontSize: fontSize.xs, fontWeight: "700" },

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.md, gap: spacing.sm },

  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xs,
  },
  questionMeta: {
    flexDirection: "row",
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  serviceBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  serviceBadgeText: { fontSize: fontSize.xs, fontWeight: "700" },
  diffBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.full,
  },
  diffBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "capitalize",
  },
  questionText: {
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
    lineHeight: 24,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1.5,
    gap: spacing.sm,
  },
  optionLeft: { width: 24, alignItems: "center" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioDot: { width: 8, height: 8, borderRadius: radius.full },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  checkMark: { width: 10, height: 10, borderRadius: 2 },
  optionText: { flex: 1, fontSize: fontSize.sm, lineHeight: 20 },

  explanationCard: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  explanationHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  explanationTitle: { fontSize: fontSize.md, fontWeight: "800" },

  wrongReasonBox: {
    backgroundColor: colors.incorrect + "11",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.incorrect + "33",
    padding: spacing.sm,
    gap: 4,
  },
  wrongReasonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  wrongReasonLabel: {
    flex: 1,
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.incorrect,
  },
  wrongReasonText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    lineHeight: 18,
  },

  correctReasonBox: {
    backgroundColor: colors.correct + "0D",
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.correct + "33",
    padding: spacing.sm,
    gap: 6,
  },
  explanationSubHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  explanationSubTitle: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.correct,
  },

  explanationText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginTop: 4 },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: fontSize.xs, color: colors.textMuted },

  bottomBar: {
    padding: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  submitBtnDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  submitBtnText: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.secondary,
  },

  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  nextBtnText: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.secondary,
  },

  finishBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.correct,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  finishBtnText: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.secondary,
  },
});
