import React, { useState } from "react";
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  spacing,
  radius,
  fontSize,
  getDomainMeta,
  ThemeColors,
} from "../utils/theme";
import { Domain } from "../types";
import { RootStackParamList } from "../navigation";
import { useCert } from "../context/CertContext";
import { useCertData } from "../context/useCertData";
import { useTheme } from "../context/ThemeContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOMAINS: Domain[] = [
  "development",
  "security",
  "deployment",
  "troubleshooting",
];
const COUNTS = [5, 10, 20, 40];

export default function QuizMenuScreen() {
  const navigation = useNavigation<Nav>();
  const { certMeta } = useCert();
  const { quizQuestions } = useCertData();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const DOMAIN_META = getDomainMeta(colors);
  const [selectedDomain, setSelectedDomain] = useState<Domain | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");
  const [selectedCount, setSelectedCount] = useState(10);

  const available = quizQuestions.filter((q) => {
    const domainMatch = selectedDomain === "all" || q.domain === selectedDomain;
    const diffMatch =
      selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    return domainMatch && diffMatch;
  });

  const canStart = available.length > 0;
  const actualCount = Math.min(selectedCount, available.length);

  const QUICK_MODES = [
    {
      label: "Exam Simulation",
      description: "40 mixed questions · timed · all domains",
      domain: "all" as const,
      difficulty: "all" as const,
      count: 40,
      icon: "school",
      color: colors.primary,
    },
    {
      label: "Hard Questions Only",
      description: "Challenge mode · all domains",
      domain: "all" as const,
      difficulty: "hard" as const,
      count: 10,
      icon: "flame",
      color: colors.hard,
    },
    {
      label: "Security Deep Dive",
      description: "IAM, KMS, Cognito, Secrets Manager",
      domain: "security" as const,
      difficulty: "all" as const,
      count: 10,
      icon: "shield-checkmark",
      color: colors.security,
    },
    {
      label: "Deployment Sprint",
      description: "CodePipeline, SAM, CDK, ECS",
      domain: "deployment" as const,
      difficulty: "all" as const,
      count: 10,
      icon: "rocket",
      color: colors.deployment,
    },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Practice Quiz</Text>
        <Text style={styles.subtitle}>Configure your quiz session</Text>

        {/* Exam info */}
        <View style={styles.examCard}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={colors.primary}
          />
          <View style={styles.examCardText}>
            <Text style={styles.examCardTitle}>
              {certMeta.name} Exam Format
            </Text>
            <Text style={styles.examCardSub}>{certMeta.examInfo}</Text>
          </View>
        </View>

        {/* Domain */}
        <Text style={styles.sectionLabel}>Domain</Text>
        <TouchableOpacity
          style={[
            styles.optionRow,
            selectedDomain === "all" && styles.optionRowActive,
          ]}
          onPress={() => setSelectedDomain("all")}
        >
          <Ionicons name="grid-outline" size={20} color={colors.primary} />
          <View style={styles.optionText}>
            <Text style={styles.optionLabel}>All Domains</Text>
            <Text style={styles.optionSub}>
              {quizQuestions.length} total questions
            </Text>
          </View>
          {selectedDomain === "all" && (
            <Ionicons
              name="checkmark-circle"
              size={22}
              color={colors.primary}
            />
          )}
        </TouchableOpacity>

        {DOMAINS.map((d) => {
          const meta = DOMAIN_META[d];
          const count = quizQuestions.filter((q) => q.domain === d).length;
          return (
            <TouchableOpacity
              key={d}
              style={[
                styles.optionRow,
                selectedDomain === d && {
                  ...styles.optionRowActive,
                  borderColor: meta.color + "66",
                },
              ]}
              onPress={() => setSelectedDomain(d)}
            >
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
              <View style={styles.optionText}>
                <Text style={styles.optionLabel}>{meta.label}</Text>
                <Text style={styles.optionSub}>
                  {count} questions · {meta.weight} of exam
                </Text>
              </View>
              {selectedDomain === d && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={meta.color}
                />
              )}
            </TouchableOpacity>
          );
        })}

        {/* Difficulty */}
        <Text style={styles.sectionLabel}>Difficulty</Text>
        <View style={styles.pillRow}>
          {(["all", "easy", "medium", "hard"] as const).map((d) => {
            const color =
              d === "all"
                ? colors.primary
                : d === "easy"
                  ? colors.easy
                  : d === "medium"
                    ? colors.medium
                    : colors.hard;
            return (
              <TouchableOpacity
                key={d}
                style={[
                  styles.pill,
                  selectedDifficulty === d
                    ? { backgroundColor: color, borderColor: color }
                    : { borderColor: color + "55" },
                ]}
                onPress={() => setSelectedDifficulty(d)}
              >
                <Text
                  style={[
                    styles.pillText,
                    {
                      color:
                        selectedDifficulty === d ? colors.secondary : color,
                    },
                  ]}
                >
                  {d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Question count */}
        <Text style={styles.sectionLabel}>Number of Questions</Text>
        <View style={styles.pillRow}>
          {COUNTS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[
                styles.pill,
                selectedCount === c
                  ? {
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                    }
                  : { borderColor: colors.primary + "55" },
              ]}
              onPress={() => setSelectedCount(c)}
            >
              <Text
                style={[
                  styles.pillText,
                  {
                    color:
                      selectedCount === c ? colors.secondary : colors.primary,
                  },
                ]}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Available count */}
        <View style={styles.availableRow}>
          <Ionicons
            name={
              canStart ? "checkmark-circle-outline" : "alert-circle-outline"
            }
            size={16}
            color={canStart ? colors.correct : colors.warning}
          />
          <Text
            style={[
              styles.availableText,
              { color: canStart ? colors.correct : colors.warning },
            ]}
          >
            {canStart
              ? `${available.length} questions available · ${actualCount} will be selected`
              : "No questions match these filters"}
          </Text>
        </View>

        {/* Start */}
        <TouchableOpacity
          style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
          disabled={!canStart}
          onPress={() =>
            navigation.navigate("Quiz", {
              domain: selectedDomain,
              difficulty: selectedDifficulty,
              count: actualCount,
            })
          }
        >
          <Ionicons
            name="play"
            size={20}
            color={canStart ? colors.secondary : colors.textMuted}
          />
          <Text
            style={[
              styles.startBtnText,
              !canStart && { color: colors.textMuted },
            ]}
          >
            Start Quiz · {actualCount} Questions
          </Text>
        </TouchableOpacity>

        {/* Quick modes */}
        <Text style={styles.sectionLabel}>Quick Modes</Text>
        {QUICK_MODES.map((mode) => (
          <TouchableOpacity
            key={mode.label}
            style={styles.quickMode}
            onPress={() =>
              navigation.navigate("Quiz", {
                domain: mode.domain,
                difficulty: mode.difficulty,
                count: mode.count,
              })
            }
          >
            <View
              style={[
                styles.quickModeIcon,
                { backgroundColor: mode.color + "22" },
              ]}
            >
              <Ionicons name={mode.icon as any} size={20} color={mode.color} />
            </View>
            <View style={styles.optionText}>
              <Text style={styles.optionLabel}>{mode.label}</Text>
              <Text style={styles.optionSub}>{mode.description}</Text>
            </View>
            <Ionicons name="arrow-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
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

    examCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      backgroundColor: colors.primary + "15",
      borderRadius: radius.md,
      padding: spacing.md,
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    examCardText: { flex: 1 },
    examCardTitle: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.primary,
    },
    examCardSub: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
      lineHeight: 18,
    },

    sectionLabel: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: colors.textSecondary,
      marginBottom: spacing.sm,
      marginTop: spacing.md,
    },

    optionRow: {
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
    optionRowActive: {
      borderColor: colors.primary + "66",
      backgroundColor: colors.primary + "0D",
    },
    domainIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      justifyContent: "center",
      alignItems: "center",
    },
    optionText: { flex: 1 },
    optionLabel: {
      fontSize: fontSize.md,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    optionSub: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },

    pillRow: {
      flexDirection: "row",
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    pill: {
      borderWidth: 1,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
    },
    pillText: { fontSize: fontSize.sm, fontWeight: "700" },

    availableRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      marginVertical: spacing.sm,
    },
    availableText: { fontSize: fontSize.sm, fontWeight: "600" },

    startBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md + 2,
      marginBottom: spacing.lg,
    },
    startBtnDisabled: {
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
    },
    startBtnText: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.secondary,
    },

    quickMode: {
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
    quickModeIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      justifyContent: "center",
      alignItems: "center",
    },
  });
}
