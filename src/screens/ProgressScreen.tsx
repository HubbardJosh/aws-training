import React, { useEffect, useState } from "react";
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
import { colors, spacing, radius, fontSize, DOMAIN_META } from "../utils/theme";
import {
  loadProgress,
  saveProgress,
  resetProgress,
  getDomainAccuracy,
  getOverallAccuracy,
} from "../utils/storage";
import { UserProgress, Domain, QuizAttempt } from "../types";
import { flashcards } from "../data/flashcards";

const DOMAINS: Domain[] = [
  "development",
  "security",
  "deployment",
  "troubleshooting",
];

export default function ProgressScreen() {
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const handleReset = () => {
    Alert.alert(
      "Reset All Progress",
      "This will clear all quiz history, flashcard status, and scores. This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            await resetProgress();
            const fresh = await loadProgress();
            setProgress(fresh);
          },
        },
      ],
    );
  };

  if (!progress) return null;

  const overallAccuracy = getOverallAccuracy(progress);
  const knownCards = Object.values(progress.studiedCards).filter(
    (s) => s === "known",
  ).length;
  const learningCards = Object.values(progress.studiedCards).filter(
    (s) => s === "learning",
  ).length;
  const totalCards = flashcards.length;
  const unseenCards = totalCards - knownCards - learningCards;

  const recentHistory = progress.quizHistory.slice(0, 10);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>DVA-C02 Exam Readiness</Text>

        {/* Readiness score */}
        <View style={styles.readinessCard}>
          <View style={styles.readinessLeft}>
            <Text style={styles.readinessLabel}>Exam Readiness</Text>
            <Text
              style={[
                styles.readinessScore,
                {
                  color:
                    overallAccuracy >= 80
                      ? colors.correct
                      : overallAccuracy >= 60
                        ? colors.warning
                        : colors.incorrect,
                },
              ]}
            >
              {overallAccuracy}%
            </Text>
            <Text style={styles.readinessSub}>
              {overallAccuracy >= 80
                ? "Ready to sit the exam!"
                : overallAccuracy >= 60
                  ? "Getting close — keep going"
                  : "Keep studying — you'll get there"}
            </Text>
          </View>
          <View style={styles.readinessRight}>
            <ReadinessGauge pct={overallAccuracy} />
          </View>
        </View>

        {/* Flashcard mastery */}
        <Text style={styles.sectionTitle}>Flashcard Mastery</Text>
        <View style={styles.masteryCard}>
          <View style={styles.masteryBar}>
            <View
              style={[
                styles.masterySegment,
                { flex: knownCards, backgroundColor: colors.correct },
              ]}
            />
            <View
              style={[
                styles.masterySegment,
                { flex: learningCards, backgroundColor: colors.warning },
              ]}
            />
            <View
              style={[
                styles.masterySegment,
                {
                  flex: Math.max(unseenCards, 0.01),
                  backgroundColor: colors.border,
                },
              ]}
            />
          </View>
          <View style={styles.masteryLegend}>
            <LegendDot color={colors.correct} label={`Known (${knownCards})`} />
            <LegendDot
              color={colors.warning}
              label={`Learning (${learningCards})`}
            />
            <LegendDot
              color={colors.border}
              label={`Unseen (${unseenCards})`}
            />
          </View>
          <Text style={styles.masteryTotal}>
            {knownCards} of {totalCards} cards mastered (
            {Math.round((knownCards / totalCards) * 100)}%)
          </Text>
        </View>

        {/* Domain accuracy */}
        <Text style={styles.sectionTitle}>Domain Accuracy</Text>
        {DOMAINS.map((domain) => {
          const meta = DOMAIN_META[domain];
          const acc = getDomainAccuracy(progress, domain);
          const { attempted, correct } = progress.domainScores[domain];
          const domainCards = flashcards.filter(
            (c) => c.domain === domain,
          ).length;
          const domainKnown = Object.entries(progress.studiedCards).filter(
            ([id, status]) =>
              status === "known" &&
              flashcards.find((c) => c.id === id)?.domain === domain,
          ).length;

          return (
            <View key={domain} style={styles.domainCard}>
              <View style={styles.domainHeader}>
                <View
                  style={[
                    styles.domainIcon,
                    { backgroundColor: meta.color + "22" },
                  ]}
                >
                  <Ionicons
                    name={meta.icon as any}
                    size={18}
                    color={meta.color}
                  />
                </View>
                <View style={styles.domainInfo}>
                  <Text style={styles.domainLabel}>{meta.label}</Text>
                  <Text style={styles.domainWeight}>{meta.weight} of exam</Text>
                </View>
                <View style={styles.domainScoreBox}>
                  <Text
                    style={[
                      styles.domainScore,
                      {
                        color:
                          attempted === 0
                            ? colors.textMuted
                            : acc >= 80
                              ? colors.correct
                              : acc >= 60
                                ? colors.warning
                                : colors.incorrect,
                      },
                    ]}
                  >
                    {attempted === 0 ? "–" : `${acc}%`}
                  </Text>
                  <Text style={styles.domainAttempted}>
                    {attempted === 0
                      ? "No quizzes yet"
                      : `${correct}/${attempted} correct`}
                  </Text>
                </View>
              </View>

              {/* Quiz accuracy bar */}
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Quiz</Text>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${acc}%`,
                        backgroundColor:
                          acc >= 80
                            ? colors.correct
                            : acc >= 60
                              ? colors.warning
                              : colors.incorrect,
                      },
                    ]}
                  />
                </View>
              </View>

              {/* Cards mastery bar */}
              <View style={styles.barRow}>
                <Text style={styles.barLabel}>Cards</Text>
                <View style={styles.barBg}>
                  <View
                    style={[
                      styles.barFill,
                      {
                        width: `${Math.round((domainKnown / domainCards) * 100)}%`,
                        backgroundColor: meta.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barCount}>
                  {domainKnown}/{domainCards}
                </Text>
              </View>
            </View>
          );
        })}

        {/* Quiz history */}
        <Text style={styles.sectionTitle}>Recent Quiz History</Text>
        {recentHistory.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Ionicons
              name="trophy-outline"
              size={36}
              color={colors.textMuted}
            />
            <Text style={styles.emptyHistoryText}>No quizzes taken yet</Text>
          </View>
        ) : (
          recentHistory.map((attempt) => (
            <HistoryRow key={attempt.id} attempt={attempt} />
          ))
        )}

        {/* Stats summary */}
        <Text style={styles.sectionTitle}>All-Time Stats</Text>
        <View style={styles.statsGrid}>
          <MiniStat
            icon="help-circle"
            color={colors.primary}
            value={progress.totalQuestionsAnswered}
            label="Questions"
          />
          <MiniStat
            icon="checkmark-circle"
            color={colors.correct}
            value={progress.totalCorrect}
            label="Correct"
          />
          <MiniStat
            icon="trophy"
            color={colors.accent}
            value={progress.quizHistory.length}
            label="Quizzes"
          />
          <MiniStat
            icon="book"
            color={colors.warning}
            value={knownCards + learningCards}
            label="Cards Studied"
          />
        </View>

        {/* Reset */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Ionicons name="trash-outline" size={18} color={colors.incorrect} />
          <Text style={styles.resetBtnText}>Reset All Progress</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ReadinessGauge({ pct }: { pct: number }) {
  const color =
    pct >= 80 ? colors.correct : pct >= 60 ? colors.warning : colors.incorrect;
  return (
    <View style={styles.gaugeContainer}>
      <View style={[styles.gaugeOuter, { borderColor: color + "44" }]}>
        <View style={[styles.gaugeInner, { borderColor: color }]}>
          <Text style={[styles.gaugeText, { color }]}>{pct}%</Text>
        </View>
      </View>
      <Text style={[styles.gaugeLabel, { color }]}>
        {pct >= 80 ? "READY" : pct >= 60 ? "CLOSE" : "STUDY"}
      </Text>
    </View>
  );
}

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendDot}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

function HistoryRow({ attempt }: { attempt: QuizAttempt }) {
  const pct = Math.round((attempt.score / attempt.total) * 100);
  const passed = pct >= 72;
  const date = new Date(attempt.date);
  const meta = attempt.domain !== "all" ? DOMAIN_META[attempt.domain] : null;
  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  return (
    <View style={styles.historyRow}>
      <View
        style={[
          styles.historyIcon,
          {
            backgroundColor: passed
              ? colors.correct + "22"
              : colors.incorrect + "22",
          },
        ]}
      >
        <Ionicons
          name={passed ? "checkmark-circle" : "close-circle"}
          size={20}
          color={passed ? colors.correct : colors.incorrect}
        />
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyTitle}>
          {meta ? meta.label : "All Domains"} · {attempt.total} questions
        </Text>
        <Text style={styles.historySub}>
          {date.toLocaleDateString()} · {formatTime(attempt.timeSeconds)}
        </Text>
      </View>
      <Text
        style={[
          styles.historyScore,
          { color: passed ? colors.correct : colors.incorrect },
        ]}
      >
        {pct}%
      </Text>
    </View>
  );
}

function MiniStat({
  icon,
  color,
  value,
  label,
}: {
  icon: string;
  color: string;
  value: number;
  label: string;
}) {
  return (
    <View style={[styles.miniStat, { borderColor: color + "33" }]}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={styles.miniStatValue}>{value}</Text>
      <Text style={styles.miniStatLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md },

  title: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },

  readinessCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
  },
  readinessLeft: { flex: 1 },
  readinessLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  readinessScore: { fontSize: 48, fontWeight: "900", lineHeight: 56 },
  readinessSub: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 4,
  },
  readinessRight: { alignItems: "center" },

  gaugeContainer: { alignItems: "center", gap: 4 },
  gaugeOuter: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  gaugeInner: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  gaugeText: { fontSize: fontSize.md, fontWeight: "900" },
  gaugeLabel: { fontSize: fontSize.xs, fontWeight: "800", letterSpacing: 1 },

  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },

  masteryCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  masteryBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: radius.full,
    overflow: "hidden",
    gap: 2,
  },
  masterySegment: { borderRadius: radius.full },
  masteryLegend: { flexDirection: "row", gap: spacing.md },
  legendDot: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 8, height: 8, borderRadius: radius.full },
  legendLabel: { fontSize: fontSize.xs, color: colors.textSecondary },
  masteryTotal: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    textAlign: "center",
  },

  domainCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  domainHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  domainIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  domainInfo: { flex: 1 },
  domainLabel: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  domainWeight: { fontSize: fontSize.xs, color: colors.textSecondary },
  domainScoreBox: { alignItems: "flex-end" },
  domainScore: { fontSize: fontSize.xl, fontWeight: "800" },
  domainAttempted: { fontSize: fontSize.xs, color: colors.textMuted },

  barRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  barLabel: {
    width: 32,
    fontSize: fontSize.xs,
    color: colors.textMuted,
    fontWeight: "600",
  },
  barBg: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: radius.full },
  barCount: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    minWidth: 36,
    textAlign: "right",
  },

  emptyHistory: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  emptyHistoryText: { fontSize: fontSize.sm, color: colors.textMuted },

  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  historyIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  historyInfo: { flex: 1 },
  historyTitle: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  historySub: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  historyScore: { fontSize: fontSize.lg, fontWeight: "800" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  miniStat: {
    width: "47%",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
  },
  miniStatValue: {
    fontSize: fontSize.xl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  miniStatLabel: { fontSize: fontSize.xs, color: colors.textSecondary },

  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.incorrect + "15",
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    borderWidth: 1,
    borderColor: colors.incorrect + "44",
    marginTop: spacing.sm,
  },
  resetBtnText: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.incorrect,
  },
});
