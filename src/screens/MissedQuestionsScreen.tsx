import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AbbreviatedText } from "../components/AbbreviatedText";
import { fontSize, radius, spacing, ThemeColors } from "../utils/theme";
import { useTheme } from "../context/ThemeContext";
import { useCert } from "../context/CertContext";
import {
  getMissedQuestions,
  loadProgress,
  removeMissedQuestion,
  saveProgress,
} from "../utils/storage";
import { MissedQuestion, UserProgress } from "../types";

export default function MissedQuestionsScreen() {
  const navigation = useNavigation();
  const { certMeta } = useCert();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    loadProgress(certMeta.storageKey).then(setProgress);
  }, [certMeta.storageKey]);

  const missed = progress ? getMissedQuestions(progress) : [];

  const handleDismiss = useCallback(
    async (id: string) => {
      if (!progress) return;
      const updated = removeMissedQuestion(progress, id);
      setProgress(updated);
      await saveProgress(updated, certMeta.storageKey);
    },
    [progress, certMeta.storageKey],
  );

  const handleDismissCurrent = useCallback(async () => {
    if (!progress || !missed[quizIndex]) return;
    await handleDismiss(missed[quizIndex].id);
    // Stay on the same index; the list will shift
    setSelected(null);
    setRevealed(false);
  }, [progress, missed, quizIndex, handleDismiss]);

  const handleNext = () => {
    if (quizIndex + 1 >= missed.length) {
      setDone(true);
    } else {
      setQuizIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRestart = () => {
    setQuizIndex(0);
    setSelected(null);
    setRevealed(false);
    setDone(false);
  };

  // ── Quiz mode ──────────────────────────────────────────────────────────────

  if (quizMode) {
    if (missed.length === 0 || done) {
      return (
        <SafeAreaView style={styles.safe} edges={["top"]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => {
                setQuizMode(false);
                setDone(false);
                setQuizIndex(0);
              }}
            >
              <Ionicons
                name="arrow-back"
                size={22}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Missed Questions</Text>
          </View>
          <View style={styles.emptyState}>
            <Ionicons
              name="checkmark-circle"
              size={48}
              color={colors.correct}
            />
            <Text style={styles.emptyTitle}>Quiz complete!</Text>
            <Text style={styles.emptyBody}>
              You reviewed all {quizIndex} question
              {quizIndex !== 1 ? "s" : ""}.
            </Text>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
              onPress={handleRestart}
            >
              <Text style={styles.startBtnText}>Restart</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const q = missed[quizIndex];
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => {
              setQuizMode(false);
              setDone(false);
              setQuizIndex(0);
              setSelected(null);
              setRevealed(false);
            }}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Missed Questions</Text>
          <Text style={styles.counter}>
            {quizIndex + 1}/{missed.length}
          </Text>
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <QuizCard
            q={q}
            selected={selected}
            revealed={revealed}
            colors={colors}
            onSelect={(i) => {
              if (!revealed) setSelected(i);
            }}
            onCheck={() => {
              if (selected !== null) setRevealed(true);
            }}
            onNext={handleNext}
            onDismiss={handleDismissCurrent}
          />
          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── List mode ──────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Missed Questions</Text>
        {missed.length > 0 && (
          <Text style={styles.counter}>{missed.length}</Text>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {missed.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="ribbon" size={48} color={colors.correct} />
            <Text style={styles.emptyTitle}>No missed questions</Text>
            <Text style={styles.emptyBody}>
              Questions you answer incorrectly in guide quizzes will appear here
              for review.
            </Text>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.startBtn, { backgroundColor: colors.primary }]}
              onPress={() => {
                setQuizIndex(0);
                setSelected(null);
                setRevealed(false);
                setDone(false);
                setQuizMode(true);
              }}
            >
              <Ionicons name="play" size={16} color="#fff" />
              <Text style={styles.startBtnText}>
                Start Review ({missed.length})
              </Text>
            </TouchableOpacity>

            {missed.map((q) => (
              <ListCard
                key={q.id}
                q={q}
                colors={colors}
                onDismiss={() => handleDismiss(q.id)}
              />
            ))}
          </>
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── List card ────────────────────────────────────────────────────────────────

function ListCard({
  q,
  colors,
  onDismiss,
}: {
  q: MissedQuestion;
  colors: ThemeColors;
  onDismiss: () => void;
}) {
  const styles = makeStyles(colors);
  return (
    <View style={styles.listCard}>
      <View style={styles.listCardHeader}>
        <View style={styles.sourceBadge}>
          <Text style={[styles.sourceText, { color: colors.primary }]}>
            {q.source}
          </Text>
        </View>
        <View style={styles.missBadge}>
          <Ionicons name="close-circle" size={12} color={colors.incorrect} />
          <Text style={[styles.missCount, { color: colors.incorrect }]}>
            ×{q.missCount}
          </Text>
        </View>
      </View>
      <AbbreviatedText text={q.question} style={styles.listQuestion} />
      <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
        <Ionicons name="trash-outline" size={14} color={colors.textMuted} />
        <Text style={styles.dismissText}>Dismiss</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Quiz card ────────────────────────────────────────────────────────────────

function QuizCard({
  q,
  selected,
  revealed,
  colors,
  onSelect,
  onCheck,
  onNext,
  onDismiss,
}: {
  q: MissedQuestion;
  selected: number | null;
  revealed: boolean;
  colors: ThemeColors;
  onSelect: (i: number) => void;
  onCheck: () => void;
  onNext: () => void;
  onDismiss: () => void;
}) {
  const styles = makeStyles(colors);

  return (
    <View style={styles.quizCard}>
      <View style={styles.listCardHeader}>
        <View style={styles.sourceBadge}>
          <Text style={[styles.sourceText, { color: colors.primary }]}>
            {q.source}
          </Text>
        </View>
        <View style={styles.missBadge}>
          <Ionicons name="close-circle" size={12} color={colors.incorrect} />
          <Text style={[styles.missCount, { color: colors.incorrect }]}>
            ×{q.missCount}
          </Text>
        </View>
      </View>

      <AbbreviatedText text={q.question} style={styles.quizQuestion} />

      {q.options.map((opt, i) => {
        let bg = colors.surfaceElevated;
        let border = colors.border;
        let textColor = colors.textSecondary;

        if (revealed) {
          if (i === q.correctIndex) {
            bg = colors.correct + "22";
            border = colors.correct;
            textColor = colors.correct;
          } else if (i === selected) {
            bg = colors.incorrect + "22";
            border = colors.incorrect;
            textColor = colors.incorrect;
          }
        } else if (i === selected) {
          bg = colors.primary + "22";
          border = colors.primary;
          textColor = colors.textPrimary;
        }

        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.option,
              { backgroundColor: bg, borderColor: border },
            ]}
            onPress={() => onSelect(i)}
            activeOpacity={0.7}
          >
            <View style={[styles.optionDot, { borderColor: border }]}>
              {revealed && i === q.correctIndex && (
                <Ionicons name="checkmark" size={10} color={colors.correct} />
              )}
              {revealed && i === selected && i !== q.correctIndex && (
                <Ionicons name="close" size={10} color={colors.incorrect} />
              )}
              {!revealed && i === selected && (
                <View
                  style={[styles.dotFill, { backgroundColor: colors.primary }]}
                />
              )}
            </View>
            <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
          </TouchableOpacity>
        );
      })}

      {revealed && (
        <View style={styles.explanation}>
          <Ionicons
            name="information-circle"
            size={14}
            color={colors.textMuted}
            style={{ marginTop: 2 }}
          />
          <AbbreviatedText
            text={q.explanation}
            style={styles.explanationText}
          />
        </View>
      )}

      <View style={styles.actions}>
        {!revealed ? (
          <TouchableOpacity
            style={[
              styles.actionBtn,
              {
                backgroundColor:
                  selected !== null ? colors.primary : colors.surfaceElevated,
              },
            ]}
            onPress={onCheck}
            disabled={selected === null}
          >
            <Text
              style={[
                styles.actionText,
                { color: selected !== null ? "#fff" : colors.textMuted },
              ]}
            >
              Check Answer
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.revealedActions}>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.dismissActionBtn,
                { borderColor: colors.border },
              ]}
              onPress={onDismiss}
            >
              <Ionicons
                name="trash-outline"
                size={14}
                color={colors.textMuted}
              />
              <Text style={[styles.actionText, { color: colors.textMuted }]}>
                Dismiss
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionBtn,
                styles.nextActionBtn,
                { backgroundColor: colors.primary },
              ]}
              onPress={onNext}
            >
              <Text style={[styles.actionText, { color: "#fff" }]}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backBtn: {
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.sm,
    },
    headerTitle: {
      flex: 1,
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    counter: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textMuted,
    },
    scroll: { flex: 1 },
    content: { padding: spacing.md, gap: spacing.sm },

    emptyState: {
      alignItems: "center",
      paddingVertical: spacing.xl * 2,
      gap: spacing.sm,
    },
    emptyTitle: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    emptyBody: {
      fontSize: fontSize.sm,
      color: colors.textSecondary,
      textAlign: "center",
      lineHeight: 20,
      maxWidth: 280,
    },

    startBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      borderRadius: radius.md,
      paddingVertical: spacing.sm + 2,
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xs,
    },
    startBtnText: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: "#fff",
    },

    listCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.sm,
    },
    listCardHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    sourceBadge: {
      backgroundColor: colors.primary + "18",
      borderRadius: radius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
    },
    sourceText: { fontSize: fontSize.xs, fontWeight: "600" },
    missBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: 3,
    },
    missCount: { fontSize: fontSize.xs, fontWeight: "700" },
    listQuestion: {
      fontSize: fontSize.sm,
      color: colors.textPrimary,
      lineHeight: 20,
      fontWeight: "600",
    },
    dismissBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      alignSelf: "flex-end",
    },
    dismissText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },

    quizCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.md,
      gap: spacing.sm,
    },
    quizQuestion: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
      lineHeight: 20,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      borderWidth: 1,
      borderRadius: radius.md,
      padding: spacing.sm + 2,
    },
    optionDot: {
      width: 18,
      height: 18,
      borderRadius: radius.full,
      borderWidth: 1.5,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },
    dotFill: { width: 8, height: 8, borderRadius: radius.full },
    optionText: { fontSize: fontSize.sm, flex: 1, lineHeight: 18 },
    explanation: {
      flexDirection: "row",
      gap: spacing.xs,
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.sm,
      padding: spacing.sm,
    },
    explanationText: {
      flex: 1,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      lineHeight: 18,
    },
    actions: { marginTop: spacing.xs },
    actionBtn: {
      borderRadius: radius.md,
      paddingVertical: spacing.sm + 2,
      alignItems: "center",
      justifyContent: "center",
    },
    actionText: { fontSize: fontSize.sm, fontWeight: "700" },
    revealedActions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    dismissActionBtn: {
      flex: 1,
      flexDirection: "row",
      gap: 6,
      borderWidth: 1,
    },
    nextActionBtn: {
      flex: 2,
    },
  });
}
