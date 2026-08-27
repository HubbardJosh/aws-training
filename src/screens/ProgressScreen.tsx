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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors, spacing, radius, fontSize, DOMAIN_META } from "../utils/theme";
import {
  loadProgress,
  saveProgress,
  resetProgress,
  resetGuideProgress,
  resetAllGuides,
  resetAllFlashcards,
  resetAllQuizzes,
  resetDomainScore,
  getDomainAccuracy,
  getOverallAccuracy,
  getGuidesCompleted,
  getGuidesViewed,
  toggleNeedsReview,
  getSortedWeakTopics,
} from "../utils/storage";
import { UserProgress, Domain, QuizAttempt, WeakTopic } from "../types";
import { RootStackParamList } from "../navigation";
import { useCert } from "../context/CertContext";
import { useCertData } from "../context/useCertData";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOMAINS: Domain[] = [
  "development",
  "security",
  "deployment",
  "troubleshooting",
];

export default function ProgressScreen() {
  const navigation = useNavigation<Nav>();
  const { certMeta } = useCert();
  const { flashcards, guides: allGuides } = useCertData();
  const [progress, setProgress] = useState<UserProgress | null>(null);

  useEffect(() => {
    loadProgress(certMeta.storageKey).then(setProgress);
  }, [certMeta.storageKey]);

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
            await resetProgress(certMeta.storageKey);
            const fresh = await loadProgress(certMeta.storageKey);
            setProgress(fresh);
          },
        },
      ],
    );
  };

  const handleToggleReview = async (service: string) => {
    if (!progress) return;
    const updated = toggleNeedsReview(progress, service);
    setProgress(updated);
    await saveProgress(updated, certMeta.storageKey);
  };

  const handleResetGuide = (guideId: string, service: string) => {
    Alert.alert(
      `Reset "${service}"`,
      "Clears section progress for this topic. Quiz history and flashcard status are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetGuideProgress(progress, guideId, service);
            setProgress(updated);
            await saveProgress(updated, certMeta.storageKey);
          },
        },
      ],
    );
  };

  const handleResetAllGuides = () => {
    Alert.alert(
      "Reset All Guides",
      "Clears section progress and completion status for every guide. Quiz history and flashcards are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetAllGuides(progress);
            setProgress(updated);
            await saveProgress(updated, certMeta.storageKey);
          },
        },
      ],
    );
  };

  const handleResetAllFlashcards = () => {
    Alert.alert(
      "Reset Flashcards",
      "Marks all flashcards as unseen. Quiz history and guide progress are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetAllFlashcards(progress);
            setProgress(updated);
            await saveProgress(updated, certMeta.storageKey);
          },
        },
      ],
    );
  };

  const handleResetAllQuizzes = () => {
    Alert.alert(
      "Reset Quiz History",
      "Clears all quiz history, domain scores, and weak topics. Guide progress and flashcards are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetAllQuizzes(progress);
            setProgress(updated);
            await saveProgress(updated, certMeta.storageKey);
          },
        },
      ],
    );
  };

  const handleResetDomain = (domain: Domain, label: string) => {
    Alert.alert(
      `Reset "${label}"`,
      "Clears quiz accuracy scores for this domain. Quiz history and other data are kept.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: async () => {
            if (!progress) return;
            const updated = resetDomainScore(progress, domain);
            setProgress(updated);
            await saveProgress(updated, certMeta.storageKey);
          },
        },
      ],
    );
  };

  if (!progress) return null;

  const topicsWithProgress = allGuides.filter(
    (g) => progress.guideProgress[g.id] !== undefined,
  );

  const overallAccuracy = getOverallAccuracy(progress);
  const weakTopics = getSortedWeakTopics(progress);
  const knownCards = Object.values(progress.studiedCards).filter(
    (s) => s === "known",
  ).length;
  const learningCards = Object.values(progress.studiedCards).filter(
    (s) => s === "learning",
  ).length;
  const totalCards = flashcards.length;
  const unseenCards = totalCards - knownCards - learningCards;

  const recentHistory = progress.quizHistory.slice(0, 10);
  const guidesCompleted = getGuidesCompleted(progress);
  const guidesViewed = getGuidesViewed(progress);
  const totalGuides = allGuides.length;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Your Progress</Text>
        <Text style={styles.subtitle}>{certMeta.name} Exam Readiness</Text>

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

        {/* Guide progress */}
        <Text style={styles.sectionTitle}>Guide Progress</Text>
        <View style={styles.masteryCard}>
          <View style={styles.masteryBar}>
            <View
              style={[
                styles.masterySegment,
                { flex: guidesCompleted, backgroundColor: colors.correct },
              ]}
            />
            <View
              style={[
                styles.masterySegment,
                {
                  flex: Math.max(guidesViewed - guidesCompleted, 0),
                  backgroundColor: colors.warning,
                },
              ]}
            />
            <View
              style={[
                styles.masterySegment,
                {
                  flex: Math.max(totalGuides - guidesViewed, 0.01),
                  backgroundColor: colors.border,
                },
              ]}
            />
          </View>
          <View style={styles.masteryLegend}>
            <LegendDot
              color={colors.correct}
              label={`Completed (${guidesCompleted})`}
            />
            <LegendDot
              color={colors.warning}
              label={`In progress (${guidesViewed - guidesCompleted})`}
            />
            <LegendDot
              color={colors.border}
              label={`Unread (${totalGuides - guidesViewed})`}
            />
          </View>
          <Text style={styles.masteryTotal}>
            {guidesCompleted} of {totalGuides} guides completed (
            {Math.round((guidesCompleted / totalGuides) * 100)}%)
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

        {/* Weak Topics */}
        <Text style={styles.sectionTitle}>Weak Topics</Text>
        {weakTopics.length === 0 ? (
          <View style={styles.emptyHistory}>
            <Ionicons
              name="checkmark-circle-outline"
              size={36}
              color={colors.textMuted}
            />
            <Text style={styles.emptyHistoryText}>
              No weak topics yet — take a quiz to get started
            </Text>
          </View>
        ) : (
          weakTopics.map((topic) => (
            <WeakTopicRow
              key={topic.service}
              topic={topic}
              onToggleReview={() => handleToggleReview(topic.service)}
              onPractice={() =>
                navigation.navigate("Quiz", {
                  domain: "all",
                  difficulty: "all",
                  count: 10,
                  service: topic.service,
                })
              }
            />
          ))
        )}

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
          <MiniStat
            icon="library"
            color={colors.accent}
            value={guidesCompleted}
            label="Guides Done"
          />
        </View>

        {/* ── Reset ─────────────────────────────────── */}
        {(() => {
          const studiedCardCount = knownCards + learningCards;
          const domainsWithAttempts = DOMAINS.filter(
            (d) => progress.domainScores[d].attempted > 0,
          );
          const hasAnyReset =
            studiedCardCount > 0 ||
            progress.quizHistory.length > 0 ||
            domainsWithAttempts.length > 0 ||
            topicsWithProgress.length > 0;

          if (!hasAnyReset) return null;

          return (
            <>
              <Text style={styles.sectionTitle}>Reset Progress</Text>

              {/* Flashcards — only if any studied */}
              {studiedCardCount > 0 && (
                <ResetCategoryRow
                  label="Flashcards"
                  detail={`${studiedCardCount} of ${totalCards} studied`}
                  icon="layers-outline"
                  onReset={handleResetAllFlashcards}
                />
              )}

              {/* Quizzes — only if any taken */}
              {progress.quizHistory.length > 0 && (
                <ResetCategoryRow
                  label="Quiz History"
                  detail={`${progress.quizHistory.length} quiz${progress.quizHistory.length !== 1 ? "zes" : ""} · ${progress.totalQuestionsAnswered} questions answered`}
                  icon="help-circle-outline"
                  onReset={handleResetAllQuizzes}
                />
              )}

              {/* Domains — only domains with attempts */}
              {domainsWithAttempts.length > 0 && (
                <View style={styles.resetGroup}>
                  <View style={styles.resetGroupHeader}>
                    <Text style={styles.resetGroupLabel}>Domains</Text>
                    <Text style={styles.resetGroupSub}>
                      reset accuracy per domain
                    </Text>
                  </View>
                  {domainsWithAttempts.map((domain, di) => {
                    const meta = DOMAIN_META[domain];
                    const { attempted, correct } =
                      progress.domainScores[domain];
                    return (
                      <View
                        key={domain}
                        style={[
                          styles.groupRow,
                          di < domainsWithAttempts.length - 1 &&
                            styles.groupRowDivider,
                        ]}
                      >
                        <View
                          style={[
                            styles.resetDomainIcon,
                            { backgroundColor: meta.color + "22" },
                          ]}
                        >
                          <Ionicons
                            name={meta.icon as any}
                            size={14}
                            color={meta.color}
                          />
                        </View>
                        <View style={styles.topicResetInfo}>
                          <Text style={styles.topicResetName}>
                            {meta.label}
                          </Text>
                          <Text style={styles.topicResetMeta}>
                            {correct}/{attempted} correct
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.topicResetBtn}
                          onPress={() => handleResetDomain(domain, meta.label)}
                        >
                          <Ionicons
                            name="refresh-outline"
                            size={14}
                            color={colors.incorrect}
                          />
                          <Text style={styles.topicResetBtnText}>Reset</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Guides — only topics with progress */}
              {topicsWithProgress.length > 0 && (
                <View style={styles.resetGroup}>
                  <View style={styles.resetGroupHeader}>
                    <Text style={styles.resetGroupLabel}>Guides</Text>
                    <View style={styles.resetGroupHeaderRight}>
                      <Text style={styles.resetGroupSub}>reset per topic</Text>
                      <TouchableOpacity onPress={handleResetAllGuides}>
                        <Text style={styles.resetAllLink}>Reset all</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {topicsWithProgress.map((g, gi) => {
                    const gp = progress.guideProgress[g.id];
                    const completed = gp?.completed ?? false;
                    const sectionsRead = gp?.sectionsRead.length ?? 0;
                    return (
                      <View
                        key={g.id}
                        style={[
                          styles.groupRow,
                          gi < topicsWithProgress.length - 1 &&
                            styles.groupRowDivider,
                        ]}
                      >
                        {completed && (
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color={colors.correct}
                          />
                        )}
                        <View style={styles.topicResetInfo}>
                          <Text style={styles.topicResetName}>{g.service}</Text>
                          <Text style={styles.topicResetMeta}>
                            {completed
                              ? "Completed"
                              : `${sectionsRead} section${sectionsRead !== 1 ? "s" : ""} read`}
                          </Text>
                        </View>
                        <TouchableOpacity
                          style={styles.topicResetBtn}
                          onPress={() => handleResetGuide(g.id, g.service)}
                        >
                          <Ionicons
                            name="refresh-outline"
                            size={14}
                            color={colors.incorrect}
                          />
                          <Text style={styles.topicResetBtnText}>Reset</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          );
        })()}

        {/* Reset all */}
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
          <Ionicons name="trash-outline" size={18} color={colors.incorrect} />
          <Text style={styles.resetBtnText}>Reset Everything</Text>
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

function WeakTopicRow({
  topic,
  onToggleReview,
  onPractice,
}: {
  topic: WeakTopic;
  onToggleReview: () => void;
  onPractice: () => void;
}) {
  const lastMissed = new Date(topic.lastMissed).toLocaleDateString();
  return (
    <View
      style={[
        styles.weakTopicRow,
        topic.needsReview && styles.weakTopicRowFlagged,
      ]}
    >
      <View style={styles.weakTopicLeft}>
        <View style={styles.weakTopicHeader}>
          <Text style={styles.weakTopicService}>{topic.service}</Text>
          {topic.needsReview && (
            <View style={styles.reviewBadge}>
              <Ionicons name="flag" size={10} color={colors.warning} />
              <Text style={styles.reviewBadgeText}>Needs Review</Text>
            </View>
          )}
        </View>
        <Text style={styles.weakTopicMeta}>
          {topic.wrongCount} wrong answer{topic.wrongCount !== 1 ? "s" : ""} ·
          last missed {lastMissed}
        </Text>
      </View>
      <View style={styles.weakTopicActions}>
        <TouchableOpacity
          style={[
            styles.weakTopicBtn,
            topic.needsReview
              ? styles.weakTopicBtnActive
              : styles.weakTopicBtnInactive,
          ]}
          onPress={onToggleReview}
        >
          <Ionicons
            name={topic.needsReview ? "flag" : "flag-outline"}
            size={14}
            color={topic.needsReview ? colors.warning : colors.textMuted}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.practiceBtn} onPress={onPractice}>
          <Text style={styles.practiceBtnText}>Practice</Text>
        </TouchableOpacity>
      </View>
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

function ResetCategoryRow({
  label,
  detail,
  icon,
  onReset,
}: {
  label: string;
  detail: string;
  icon: string;
  onReset: () => void;
}) {
  return (
    <View style={styles.topicResetRow}>
      <Ionicons name={icon as any} size={18} color={colors.textMuted} />
      <View style={styles.topicResetInfo}>
        <Text style={styles.topicResetName}>{label}</Text>
        <Text style={styles.topicResetMeta}>{detail}</Text>
      </View>
      <TouchableOpacity style={styles.topicResetBtn} onPress={onReset}>
        <Ionicons name="refresh-outline" size={14} color={colors.incorrect} />
        <Text style={styles.topicResetBtnText}>Reset</Text>
      </TouchableOpacity>
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

  weakTopicRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  weakTopicRowFlagged: {
    borderColor: colors.warning + "55",
    backgroundColor: colors.warning + "08",
  },
  weakTopicLeft: { flex: 1, gap: 3 },
  weakTopicHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    flexWrap: "wrap",
  },
  weakTopicService: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  reviewBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.warning + "22",
    borderRadius: radius.sm,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  reviewBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.warning,
  },
  weakTopicMeta: { fontSize: fontSize.xs, color: colors.textSecondary },
  weakTopicActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  weakTopicBtn: {
    width: 32,
    height: 32,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  weakTopicBtnActive: {
    borderColor: colors.warning + "55",
    backgroundColor: colors.warning + "15",
  },
  weakTopicBtnInactive: {
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  practiceBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
  },
  practiceBtnText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.secondary,
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

  resetGroup: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: spacing.sm,
  },
  resetGroupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resetGroupLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  resetGroupHeaderRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  resetGroupSub: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  resetAllLink: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.incorrect,
  },
  resetDomainIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  groupRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  groupRowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  topicResetList: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  topicResetRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
  },
  topicResetInfo: { flex: 1 },
  topicResetName: {
    fontSize: fontSize.sm,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  topicResetMeta: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginTop: 2,
  },
  topicResetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderWidth: 1,
    borderColor: colors.incorrect + "55",
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  topicResetBtnText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.incorrect,
  },
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
