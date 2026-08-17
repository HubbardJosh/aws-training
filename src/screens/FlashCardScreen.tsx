import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { colors, spacing, radius, fontSize, DOMAIN_META } from "../utils/theme";
import { flashcards } from "../data/flashcards";
import { FlashCard, Domain, Difficulty, UserProgress } from "../types";
import { loadProgress, saveProgress } from "../utils/storage";
import { RootStackParamList } from "../navigation";

type Route = RouteProp<RootStackParamList, "FlashCard">;

const { width } = Dimensions.get("window");
const CARD_HEIGHT = 380;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FlashCardScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { domain, difficulty, service } = route.params;

  const [cards, setCards] = useState<FlashCard[]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [sessionKnown, setSessionKnown] = useState(0);
  const [sessionLearning, setSessionLearning] = useState(0);

  // Fade between front and back
  const fadeAnim = useRef(new Animated.Value(1)).current;
  // Slide between cards
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const filtered = flashcards.filter((c) => {
      const domainMatch = domain === "all" || c.domain === (domain as Domain);
      const diffMatch =
        difficulty === "all" || c.difficulty === (difficulty as Difficulty);
      const serviceMatch = !service || c.service === service;
      return domainMatch && diffMatch && serviceMatch;
    });
    setCards(shuffle(filtered));
    loadProgress().then(setProgress);
  }, [domain, difficulty]);

  const currentCard = cards[index];

  const handleFlip = useCallback(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    // Toggle after fade-out starts so the new content appears on fade-in
    setTimeout(() => setFlipped((f) => !f), 120);
  }, [fadeAnim]);

  const navigateCard = useCallback(
    (direction: "next" | "prev") => {
      const nextIndex = direction === "next" ? index + 1 : index - 1;
      if (nextIndex < 0 || nextIndex >= cards.length) return;

      const toValue = direction === "next" ? -width : width;
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: direction === "next" ? width : -width,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      setFlipped(false);
      setIndex(nextIndex);
    },
    [index, cards.length, slideAnim],
  );

  const markCard = useCallback(
    async (status: "known" | "learning") => {
      if (!currentCard || !progress) return;

      const updated: UserProgress = {
        ...progress,
        studiedCards: {
          ...progress.studiedCards,
          [currentCard.id]: status,
        },
        lastStudied: new Date().toISOString(),
      };
      setProgress(updated);
      await saveProgress(updated);

      if (status === "known") setSessionKnown((n) => n + 1);
      else setSessionLearning((n) => n + 1);

      if (index < cards.length - 1) {
        navigateCard("next");
      }
    },
    [currentCard, progress, index, cards.length, navigateCard],
  );

  if (cards.length === 0) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.empty}>
          <Ionicons name="search" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>No cards match these filters</Text>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!currentCard) return null;

  const meta = DOMAIN_META[currentCard.domain];
  const cardStatus = progress?.studiedCards[currentCard.id];
  const isLast = index === cards.length - 1;

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBtn}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerCount}>
            {index + 1} / {cards.length}
          </Text>
          <Text style={styles.headerDomain}>{service ?? meta.label}</Text>
        </View>
        <View style={styles.sessionStats}>
          <Ionicons name="checkmark-circle" size={16} color={colors.correct} />
          <Text style={[styles.sessionStat, { color: colors.correct }]}>
            {sessionKnown}
          </Text>
          <Ionicons name="refresh-circle" size={16} color={colors.warning} />
          <Text style={[styles.sessionStat, { color: colors.warning }]}>
            {sessionLearning}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${((index + 1) / cards.length) * 100}%`,
              backgroundColor: meta.color,
            },
          ]}
        />
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.cardSlide, { transform: [{ translateX: slideAnim }] }]}
        >
          <Animated.View style={[styles.cardInner, { opacity: fadeAnim }]}>
            <TouchableOpacity
              style={[
                styles.card,
                {
                  borderColor: meta.color + "44",
                  backgroundColor: flipped
                    ? colors.surfaceElevated
                    : colors.surface,
                },
              ]}
              onPress={handleFlip}
              activeOpacity={0.97}
            >
              {!flipped ? (
                /* ── FRONT ── */
                <>
                  <View style={styles.cardTopRow}>
                    <View
                      style={[
                        styles.serviceBadge,
                        { backgroundColor: meta.color + "22" },
                      ]}
                    >
                      <Ionicons
                        name={meta.icon as any}
                        size={14}
                        color={meta.color}
                      />
                      <Text
                        style={[styles.serviceBadgeText, { color: meta.color }]}
                      >
                        {currentCard.service}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.diffBadge,
                        {
                          backgroundColor:
                            currentCard.difficulty === "easy"
                              ? colors.easy + "22"
                              : currentCard.difficulty === "medium"
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
                              currentCard.difficulty === "easy"
                                ? colors.easy
                                : currentCard.difficulty === "medium"
                                  ? colors.medium
                                  : colors.hard,
                          },
                        ]}
                      >
                        {currentCard.difficulty}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBody}>
                    <Ionicons
                      name="help-circle-outline"
                      size={32}
                      color={meta.color}
                      style={styles.cardIcon}
                    />
                    <Text style={styles.questionText}>
                      {currentCard.question}
                    </Text>
                  </View>

                  <View style={styles.cardFooter}>
                    {cardStatus && (
                      <View
                        style={[
                          styles.statusIndicator,
                          {
                            backgroundColor:
                              cardStatus === "known"
                                ? colors.correct + "22"
                                : colors.warning + "22",
                          },
                        ]}
                      >
                        <Ionicons
                          name={
                            cardStatus === "known"
                              ? "checkmark-circle"
                              : "refresh-circle"
                          }
                          size={14}
                          color={
                            cardStatus === "known"
                              ? colors.correct
                              : colors.warning
                          }
                        />
                        <Text
                          style={[
                            styles.statusText,
                            {
                              color:
                                cardStatus === "known"
                                  ? colors.correct
                                  : colors.warning,
                            },
                          ]}
                        >
                          {cardStatus === "known" ? "Known" : "Learning"}
                        </Text>
                      </View>
                    )}
                    <View style={styles.cardHint}>
                      <Ionicons
                        name="hand-left-outline"
                        size={14}
                        color={colors.textMuted}
                      />
                      <Text style={styles.hintText}>Tap to reveal answer</Text>
                    </View>
                  </View>
                </>
              ) : (
                /* ── BACK ── */
                <ScrollView
                  contentContainerStyle={styles.backContent}
                  showsVerticalScrollIndicator={false}
                >
                  <View style={styles.cardTopRow}>
                    <Text style={styles.answerLabel}>Answer</Text>
                    <View
                      style={[
                        styles.serviceBadge,
                        { backgroundColor: meta.color + "22" },
                      ]}
                    >
                      <Text
                        style={[styles.serviceBadgeText, { color: meta.color }]}
                      >
                        {currentCard.service}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.answerText}>{currentCard.answer}</Text>

                  <View style={styles.keyPointsSection}>
                    <Text style={styles.keyPointsLabel}>Key Points</Text>
                    {currentCard.keyPoints.map((pt, i) => (
                      <View key={i} style={styles.keyPoint}>
                        <View
                          style={[
                            styles.bullet,
                            { backgroundColor: meta.color },
                          ]}
                        />
                        <Text style={styles.keyPointText}>{pt}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.tagRow}>
                    {currentCard.tags.map((tag) => (
                      <View key={tag} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              )}
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        {flipped ? (
          <View style={styles.ratingRow}>
            <TouchableOpacity
              style={[
                styles.ratingBtn,
                {
                  backgroundColor: colors.warning + "22",
                  borderColor: colors.warning,
                },
              ]}
              onPress={() => markCard("learning")}
            >
              <Ionicons
                name="refresh-circle"
                size={22}
                color={colors.warning}
              />
              <Text style={[styles.ratingBtnText, { color: colors.warning }]}>
                Still Learning
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.ratingBtn,
                {
                  backgroundColor: colors.correct + "22",
                  borderColor: colors.correct,
                },
              ]}
              onPress={() => markCard("known")}
            >
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={colors.correct}
              />
              <Text style={[styles.ratingBtnText, { color: colors.correct }]}>
                Got It!
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.navRow}>
            <TouchableOpacity
              style={[styles.navBtn, index === 0 && styles.navBtnDisabled]}
              onPress={() => navigateCard("prev")}
              disabled={index === 0}
            >
              <Ionicons
                name="arrow-back-circle"
                size={44}
                color={index === 0 ? colors.textMuted : colors.primary}
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.flipBtn} onPress={handleFlip}>
              <Ionicons name="eye-outline" size={20} color={colors.secondary} />
              <Text style={styles.flipBtnText}>Show Answer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.navBtn, isLast && styles.navBtnDisabled]}
              onPress={() => navigateCard("next")}
              disabled={isLast}
            >
              <Ionicons
                name="arrow-forward-circle"
                size={44}
                color={isLast ? colors.textMuted : colors.primary}
              />
            </TouchableOpacity>
          </View>
        )}

        {isLast && flipped && (
          <TouchableOpacity
            style={styles.doneBtn}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="flag" size={18} color={colors.secondary} />
            <Text style={styles.doneBtnText}>
              Done · {sessionKnown} known · {sessionLearning} learning
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  headerBtn: { padding: spacing.xs },
  headerCenter: { flex: 1, alignItems: "center" },
  headerCount: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.textPrimary,
  },
  headerDomain: { fontSize: fontSize.xs, color: colors.textSecondary },
  sessionStats: { flexDirection: "row", alignItems: "center", gap: 4 },
  sessionStat: { fontSize: fontSize.sm, fontWeight: "700", marginRight: 6 },

  progressBarBg: {
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: spacing.md,
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing.md,
  },
  progressBarFill: { height: "100%", borderRadius: radius.full },

  cardContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    justifyContent: "center",
  },
  cardSlide: { height: CARD_HEIGHT },
  cardInner: { flex: 1 },

  card: {
    flex: 1,
    borderRadius: radius.xl,
    borderWidth: 1.5,
    overflow: "hidden",
  },

  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    paddingBottom: spacing.sm,
  },
  serviceBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  serviceBadgeText: { fontSize: fontSize.xs, fontWeight: "700" },
  diffBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  diffBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  cardBody: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  cardIcon: { marginBottom: spacing.md },
  questionText: {
    fontSize: fontSize.lg,
    fontWeight: "600",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 26,
  },

  cardFooter: {
    alignItems: "center",
    paddingBottom: spacing.md,
    gap: spacing.xs,
  },
  cardHint: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  hintText: { fontSize: fontSize.xs, color: colors.textMuted },
  statusIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.full,
  },
  statusText: { fontSize: fontSize.xs, fontWeight: "600" },

  backContent: { padding: spacing.md, paddingBottom: spacing.lg },
  answerLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  answerText: {
    fontSize: fontSize.md,
    color: colors.textPrimary,
    lineHeight: 24,
    marginVertical: spacing.md,
  },
  keyPointsSection: { marginBottom: spacing.md },
  keyPointsLabel: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  keyPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: spacing.sm,
  },
  bullet: { width: 6, height: 6, borderRadius: radius.full, marginTop: 7 },
  keyPointText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  tag: {
    backgroundColor: colors.surface,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagText: { fontSize: fontSize.xs, color: colors.textMuted },

  controls: { padding: spacing.md, paddingTop: spacing.sm, gap: spacing.sm },
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  navBtn: { padding: spacing.xs },
  navBtnDisabled: { opacity: 0.3 },
  flipBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 4,
    borderRadius: radius.full,
  },
  flipBtnText: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.secondary,
  },

  ratingRow: { flexDirection: "row", gap: spacing.sm },
  ratingBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    borderWidth: 1.5,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
  },
  ratingBtnText: { fontSize: fontSize.md, fontWeight: "700" },

  doneBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.sm + 4,
  },
  doneBtnText: {
    fontSize: fontSize.sm,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  emptyText: { fontSize: fontSize.lg, color: colors.textMuted },
  backBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  backBtnText: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.secondary,
  },
});
