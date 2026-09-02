import React, { useEffect, useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import {
  useNavigation,
  CommonActions,
  useFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  spacing,
  radius,
  fontSize,
  getDomainMeta,
  ThemeColors,
} from "../utils/theme";
import {
  loadProgress,
  getDomainAccuracy,
  getOverallAccuracy,
  getMissedQuizQuestions,
} from "../utils/storage";
import { useCert } from "../context/CertContext";
import { UserProgress, Domain } from "../types";
import { RootStackParamList } from "../navigation";
import { useTheme } from "../context/ThemeContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOMAINS: Domain[] = [
  "development",
  "security",
  "deployment",
  "troubleshooting",
];

export default function QuizResultScreen() {
  const navigation = useNavigation<Nav>();
  const { certMeta } = useCert();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const DOMAIN_META = getDomainMeta(colors);

  useFocusEffect(
    useCallback(() => {
      loadProgress(certMeta.storageKey).then(setProgress);
    }, [certMeta.storageKey]),
  );

  if (!progress) return null;

  const missedCount = getMissedQuizQuestions(progress).length;
  const lastAttempt = progress.quizHistory[0];
  if (!lastAttempt) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>No results found</Text>
          <TouchableOpacity
            style={styles.homeBtn}
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: "Tabs" }] }),
              )
            }
          >
            <Text style={styles.homeBtnText}>Go Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const { score, total, timeSeconds } = lastAttempt;
  const pct = Math.round((score / total) * 100);
  const passed = pct >= 72;
  const formatTime = (s: number) => `${Math.floor(s / 60)}m ${s % 60}s`;

  const overallAccuracy = getOverallAccuracy(progress);

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Result hero */}
        <View
          style={[
            styles.hero,
            {
              borderColor: passed
                ? colors.correct + "55"
                : colors.incorrect + "55",
            },
          ]}
        >
          <View
            style={[
              styles.heroIcon,
              {
                backgroundColor: passed
                  ? colors.correct + "22"
                  : colors.incorrect + "22",
              },
            ]}
          >
            <Ionicons
              name={passed ? "trophy" : "reload"}
              size={48}
              color={passed ? colors.correct : colors.incorrect}
            />
          </View>
          <Text
            style={[
              styles.heroTitle,
              { color: passed ? colors.correct : colors.incorrect },
            ]}
          >
            {passed ? "Great Work!" : "Keep Studying!"}
          </Text>
          <Text style={styles.heroScore}>
            {score} / {total} correct
          </Text>
          <View style={styles.pctCircle}>
            <Text
              style={[
                styles.pctText,
                { color: passed ? colors.correct : colors.incorrect },
              ]}
            >
              {pct}%
            </Text>
            <Text style={styles.pctSub}>accuracy</Text>
          </View>
          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Ionicons
                name="time-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.heroStatText}>{formatTime(timeSeconds)}</Text>
            </View>
            <View style={styles.heroStat}>
              <Ionicons
                name="calculator-outline"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.heroStatText}>
                ~{Math.round(timeSeconds / total)}s per question
              </Text>
            </View>
          </View>
          {passed ? (
            <View style={styles.passBanner}>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.correct}
              />
              <Text style={styles.passBannerText}>
                Above passing threshold (72%+ ≈ 720/1000)
              </Text>
            </View>
          ) : (
            <View
              style={[
                styles.passBanner,
                { backgroundColor: colors.incorrect + "15" },
              ]}
            >
              <Ionicons
                name="alert-circle"
                size={16}
                color={colors.incorrect}
              />
              <Text
                style={[styles.passBannerText, { color: colors.incorrect }]}
              >
                Need {72 - pct}% more to reach passing threshold
              </Text>
            </View>
          )}
        </View>

        {/* Domain breakdown */}
        <Text style={styles.sectionTitle}>Domain Performance</Text>
        {DOMAINS.map((domain) => {
          const meta = DOMAIN_META[domain];
          const acc = getDomainAccuracy(progress, domain);
          const { attempted, correct } = progress.domainScores[domain];
          return (
            <View key={domain} style={styles.domainRow}>
              <View
                style={[
                  styles.domainIcon,
                  { backgroundColor: meta.color + "22" },
                ]}
              >
                <Ionicons
                  name={meta.icon as any}
                  size={16}
                  color={meta.color}
                />
              </View>
              <View style={styles.domainInfo}>
                <View style={styles.domainTopRow}>
                  <Text style={styles.domainLabel}>{meta.label}</Text>
                  <Text
                    style={[
                      styles.domainAcc,
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
                    {attempted === 0
                      ? "No data"
                      : `${acc}% (${correct}/${attempted})`}
                  </Text>
                </View>
                <View style={styles.miniBarBg}>
                  <View
                    style={[
                      styles.miniBarFill,
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
            </View>
          );
        })}

        {/* Recommendations */}
        <Text style={styles.sectionTitle}>Study Recommendations</Text>
        {DOMAINS.filter((d) => {
          const acc = getDomainAccuracy(progress, d);
          return progress.domainScores[d].attempted > 0 && acc < 80;
        })
          .sort(
            (a, b) =>
              getDomainAccuracy(progress, a) - getDomainAccuracy(progress, b),
          )
          .map((domain) => {
            const meta = DOMAIN_META[domain];
            const acc = getDomainAccuracy(progress, domain);
            return (
              <View key={domain} style={styles.recCard}>
                <View
                  style={[
                    styles.recIcon,
                    { backgroundColor: meta.color + "22" },
                  ]}
                >
                  <Ionicons
                    name="warning-outline"
                    size={18}
                    color={meta.color}
                  />
                </View>
                <View style={styles.recText}>
                  <Text style={styles.recTitle}>
                    Focus on {meta.label} ({acc}%)
                  </Text>
                  <Text style={styles.recSub}>
                    {RECOMMENDATIONS[domain] ??
                      "Review flashcards and retry quiz questions for this domain."}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate("Quiz", {
                      domain,
                      difficulty: "all",
                      count: 10,
                    })
                  }
                >
                  <Ionicons name="play-circle" size={28} color={meta.color} />
                </TouchableOpacity>
              </View>
            );
          })}

        {/* Overall lifetime stats */}
        <Text style={styles.sectionTitle}>Lifetime Stats</Text>
        <View style={styles.statsGrid}>
          <StatBox
            label="Questions Answered"
            value={progress.totalQuestionsAnswered.toString()}
            icon="help-circle"
            color={colors.primary}
            colors={colors}
          />
          <StatBox
            label="Overall Accuracy"
            value={`${overallAccuracy}%`}
            icon="checkmark-circle"
            color={colors.correct}
            colors={colors}
          />
          <StatBox
            label="Quizzes Taken"
            value={progress.quizHistory.length.toString()}
            icon="trophy"
            color={colors.accent}
            colors={colors}
          />
          <StatBox
            label="Best Quiz Score"
            value={
              progress.quizHistory.length > 0
                ? `${Math.max(...progress.quizHistory.map((a) => Math.round((a.score / a.total) * 100)))}%`
                : "—"
            }
            icon="star"
            color={colors.warning}
            colors={colors}
          />
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() =>
              navigation.navigate("Quiz", {
                domain: lastAttempt.domain,
                difficulty: "all",
                count: lastAttempt.total,
              })
            }
          >
            <Ionicons name="reload" size={20} color={colors.secondary} />
            <Text style={styles.retryBtnText}>Retry Quiz</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.homeBtn2}
            onPress={() =>
              navigation.dispatch(
                CommonActions.reset({ index: 0, routes: [{ name: "Tabs" }] }),
              )
            }
          >
            <Ionicons name="home-outline" size={20} color={colors.primary} />
            <Text style={styles.homeBtnText2}>Dashboard</Text>
          </TouchableOpacity>
        </View>

        {missedCount > 0 && (
          <TouchableOpacity
            style={styles.missedBtn}
            onPress={() =>
              navigation.navigate("MissedQuestions", { source: "quiz" })
            }
            activeOpacity={0.8}
          >
            <Ionicons name="close-circle" size={15} color={colors.incorrect} />
            <Text style={styles.missedBtnText}>
              Review {missedCount} missed question
              {missedCount !== 1 ? "s" : ""}
            </Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={colors.incorrect + "99"}
            />
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({
  label,
  value,
  icon,
  color,
  colors,
}: {
  label: string;
  value: string;
  icon: string;
  color: string;
  colors: ThemeColors;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={[styles.statBox, { borderColor: color + "33" }]}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const RECOMMENDATIONS: Record<Domain, string> = {
  development:
    "Review Lambda concurrency, DynamoDB partition key design, and SQS visibility timeout patterns.",
  security:
    "Focus on IAM policy evaluation order, KMS envelope encryption, and Cognito User Pool vs. Identity Pool.",
  deployment:
    "Study CodeDeploy deployment strategies (canary/linear), SAM templates, and CloudFormation rollback triggers.",
  troubleshooting:
    "Practice X-Ray tracing setup, CloudWatch EMF for custom metrics, and ElastiCache caching strategies.",
  fundamentals:
    "Review core AI/ML concepts, generative AI fundamentals, and responsible AI principles.",
  services:
    "Study the key AWS AI/ML services: Bedrock, SageMaker, Rekognition, Comprehend, and their use cases.",
  applications:
    "Practice applying AI services to real-world scenarios and building end-to-end AI-powered solutions.",
};

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    content: { padding: spacing.md },
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      gap: spacing.md,
    },
    emptyText: { fontSize: fontSize.lg, color: colors.textMuted },

    hero: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      alignItems: "center",
      borderWidth: 1.5,
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    heroIcon: {
      width: 88,
      height: 88,
      borderRadius: radius.full,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    heroTitle: { fontSize: fontSize.xxl, fontWeight: "800" },
    heroScore: { fontSize: fontSize.lg, color: colors.textSecondary },
    pctCircle: { alignItems: "center", marginVertical: spacing.xs },
    pctText: { fontSize: fontSize.xxxl, fontWeight: "900" },
    pctSub: { fontSize: fontSize.sm, color: colors.textSecondary },
    heroStats: { flexDirection: "row", gap: spacing.lg },
    heroStat: { flexDirection: "row", alignItems: "center", gap: 4 },
    heroStatText: { fontSize: fontSize.sm, color: colors.textSecondary },
    passBanner: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: colors.correct + "15",
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    passBannerText: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.correct,
    },

    sectionTitle: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.textPrimary,
      marginBottom: spacing.sm,
      marginTop: spacing.xs,
    },

    domainRow: {
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
    domainIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      justifyContent: "center",
      alignItems: "center",
    },
    domainInfo: { flex: 1 },
    domainTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    domainLabel: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    domainAcc: { fontSize: fontSize.sm, fontWeight: "700" },
    miniBarBg: {
      height: 4,
      backgroundColor: colors.border,
      borderRadius: radius.full,
      overflow: "hidden",
    },
    miniBarFill: { height: "100%", borderRadius: radius.full },

    recCard: {
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
    recIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      justifyContent: "center",
      alignItems: "center",
    },
    recText: { flex: 1 },
    recTitle: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    recSub: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },

    statsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statBox: {
      width: "47%",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      padding: spacing.md,
      alignItems: "center",
      gap: 4,
      borderWidth: 1,
    },
    statValue: {
      fontSize: fontSize.xl,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    statLabel: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      textAlign: "center",
    },

    actions: { flexDirection: "row", gap: spacing.sm },
    retryBtn: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
    },
    retryBtnText: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.secondary,
    },
    homeBtn2: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      borderWidth: 1,
      borderColor: colors.primary + "55",
    },
    homeBtnText2: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.primary,
    },

    missedBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      backgroundColor: colors.incorrect + "12",
      borderWidth: 1,
      borderColor: colors.incorrect + "44",
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginTop: spacing.sm,
    },
    missedBtnText: {
      flex: 1,
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.incorrect,
    },

    homeBtn: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
    },
    homeBtnText: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.secondary,
    },
  });
}
