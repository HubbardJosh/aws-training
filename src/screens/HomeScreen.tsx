import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, radius, fontSize, DOMAIN_META } from "../utils/theme";
import {
  loadProgress,
  getDomainAccuracy,
  getOverallAccuracy,
} from "../utils/storage";
import { UserProgress, Domain } from "../types";
import { flashcards } from "../data/flashcards";
import { quizQuestions } from "../data/quizQuestions";
import { RootStackParamList } from "../navigation";

const { width } = Dimensions.get("window");

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOMAINS: Domain[] = [
  "development",
  "security",
  "deployment",
  "troubleshooting",
];

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    loadProgress().then(setProgress);
  }, []);

  const overallAccuracy = progress ? getOverallAccuracy(progress) : 0;
  const totalStudied = progress
    ? Object.values(progress.studiedCards).filter((s) => s === "known").length
    : 0;
  const totalCards = flashcards.length;
  const totalQuizQ = quizQuestions.length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>AWS Dev Associate</Text>
            <Text style={styles.subtitle}>DVA-C02 Study App</Text>
          </View>
          <View style={styles.badge}>
            <Ionicons name="ribbon" size={22} color={colors.primary} />
          </View>
        </View>

        {/* Exam info banner */}
        <View style={styles.examBanner}>
          <Ionicons
            name="information-circle"
            size={18}
            color={colors.primary}
          />
          <Text style={styles.examBannerText}>
            65 questions · 130 min · Passing score: 720/1000
          </Text>
        </View>

        {/* Overall stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="checkmark-circle"
            color={colors.correct}
            label="Accuracy"
            value={`${overallAccuracy}%`}
          />
          <StatCard
            icon="book-open"
            color={colors.accent}
            label="Cards Mastered"
            value={`${totalStudied}/${totalCards}`}
          />
          <StatCard
            icon="help-circle"
            color={colors.primary}
            label="Quiz Questions"
            value={`${totalQuizQ}`}
          />
        </View>

        {/* Domain breakdown */}
        <Text style={styles.sectionTitle}>Exam Domains</Text>
        {DOMAINS.map((domain) => {
          const meta = DOMAIN_META[domain];
          const accuracy = progress ? getDomainAccuracy(progress, domain) : 0;
          const attempted = progress
            ? progress.domainScores[domain].attempted
            : 0;
          const domainCards = flashcards.filter(
            (c) => c.domain === domain,
          ).length;
          const domainQuestions = quizQuestions.filter(
            (q) => q.domain === domain,
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
                    size={20}
                    color={meta.color}
                  />
                </View>
                <View style={styles.domainInfo}>
                  <Text style={styles.domainLabel}>{meta.label}</Text>
                  <Text style={styles.domainMeta}>
                    {domainCards} cards · {domainQuestions} quiz questions ·{" "}
                    {meta.weight} of exam
                  </Text>
                </View>
                <Text
                  style={[
                    styles.domainAccuracy,
                    { color: accuracyColor(accuracy) },
                  ]}
                >
                  {attempted > 0 ? `${accuracy}%` : "–"}
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${accuracy}%`, backgroundColor: meta.color },
                  ]}
                />
              </View>
              <View style={styles.domainActions}>
                <TouchableOpacity
                  style={[styles.domainBtn, { borderColor: meta.color }]}
                  onPress={() =>
                    navigation.navigate("FlashCard", {
                      domain,
                      difficulty: "all",
                    })
                  }
                >
                  <Ionicons name="book-outline" size={14} color={meta.color} />
                  <Text style={[styles.domainBtnText, { color: meta.color }]}>
                    Study
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.domainBtn, { borderColor: meta.color }]}
                  onPress={() =>
                    navigation.navigate("Quiz", {
                      domain,
                      difficulty: "all",
                      count: 10,
                    })
                  }
                >
                  <Ionicons
                    name="trophy-outline"
                    size={14}
                    color={meta.color}
                  />
                  <Text style={[styles.domainBtnText, { color: meta.color }]}>
                    Quiz
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Quick start */}
        <Text style={styles.sectionTitle}>Quick Start</Text>
        <View style={styles.quickRow}>
          <TouchableOpacity
            style={[
              styles.quickCard,
              { backgroundColor: colors.primary + "18" },
            ]}
            onPress={() =>
              navigation.navigate("FlashCard", {
                domain: "all",
                difficulty: "all",
              })
            }
          >
            <Ionicons name="shuffle" size={28} color={colors.primary} />
            <Text style={styles.quickLabel}>Random Flashcards</Text>
            <Text style={styles.quickSub}>All {totalCards} cards</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.quickCard,
              { backgroundColor: colors.accent + "18" },
            ]}
            onPress={() =>
              navigation.navigate("Quiz", {
                domain: "all",
                difficulty: "all",
                count: 20,
              })
            }
          >
            <Ionicons name="timer" size={28} color={colors.accent} />
            <Text style={styles.quickLabel}>Full Practice Quiz</Text>
            <Text style={styles.quickSub}>20 questions · timed</Text>
          </TouchableOpacity>
        </View>

        {/* Exam tips */}
        <Text style={styles.sectionTitle}>Exam Tips</Text>
        {EXAM_TIPS.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <Ionicons
              name="bulb-outline"
              size={18}
              color={colors.primary}
              style={styles.tipIcon}
            />
            <Text style={styles.tipText}>{tip}</Text>
          </View>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({
  icon,
  color,
  label,
  value,
}: {
  icon: string;
  color: string;
  label: string;
  value: string;
}) {
  return (
    <View style={[styles.statCard, { borderColor: color + "44" }]}>
      <Ionicons name={icon as any} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function accuracyColor(pct: number): string {
  if (pct >= 80) return colors.correct;
  if (pct >= 60) return colors.warning;
  return colors.incorrect;
}

const EXAM_TIPS = [
  "Lambda + SQS: set visibility timeout to 6× the function timeout to prevent duplicate processing.",
  "DynamoDB hot partitions: avoid low-cardinality partition keys (status, boolean fields).",
  "IAM evaluation: explicit Deny always wins — SCPs, permission boundaries, then identity policies.",
  "KMS Encrypt is limited to 4 KB — use envelope encryption (GenerateDataKey) for larger data.",
  "CodeDeploy canary for Lambda: small % → wait → remainder (e.g. Canary10Percent5Minutes).",
  "CloudWatch EMF: embed custom metrics in logs to avoid costly PutMetricData API calls.",
  "SQS FIFO vs. Standard: FIFO = exactly-once + ordered but capped at 3,000 msg/s with batching.",
  "RDS Proxy: essential for Lambda → RDS to prevent connection exhaustion during traffic spikes.",
];

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  content: { padding: spacing.md },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.primary + "22",
    justifyContent: "center",
    alignItems: "center",
  },

  examBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary + "15",
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.md,
    gap: spacing.xs,
  },
  examBannerText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: "600",
  },

  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  statCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    alignItems: "center",
    borderWidth: 1,
    gap: 4,
  },
  statValue: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },

  domainCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  domainHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  domainIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.sm,
  },
  domainInfo: { flex: 1 },
  domainLabel: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  domainMeta: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  domainAccuracy: { fontSize: fontSize.lg, fontWeight: "800" },
  progressBarBg: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: radius.full },
  domainActions: { flexDirection: "row", gap: spacing.sm },
  domainBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingVertical: 8,
  },
  domainBtnText: { fontSize: fontSize.sm, fontWeight: "600" },

  quickRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  quickCard: {
    flex: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: "center",
    gap: spacing.xs,
  },
  quickLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  quickSub: { fontSize: fontSize.xs, color: colors.textSecondary },

  tipCard: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm + 4,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "flex-start",
  },
  tipIcon: { marginRight: spacing.sm, marginTop: 1 },
  tipText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
