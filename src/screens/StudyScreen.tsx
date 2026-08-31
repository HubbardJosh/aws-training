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
import { useCertData } from "../context/useCertData";
import { useTheme } from "../context/ThemeContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const DOMAINS: Domain[] = [
  "development",
  "security",
  "deployment",
  "troubleshooting",
];
const DIFFICULTIES = ["all", "easy", "medium", "hard"] as const;

export default function StudyScreen() {
  const navigation = useNavigation<Nav>();
  const { flashcards } = useCertData();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const DOMAIN_META = getDomainMeta(colors);
  const SERVICES = [...new Set(flashcards.map((c) => c.service))].sort();
  const [selectedDomain, setSelectedDomain] = useState<Domain | "all">("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "easy" | "medium" | "hard"
  >("all");

  const filtered = flashcards.filter((c) => {
    const domainMatch = selectedDomain === "all" || c.domain === selectedDomain;
    const diffMatch =
      selectedDifficulty === "all" || c.difficulty === selectedDifficulty;
    return domainMatch && diffMatch;
  });

  const serviceGroups = SERVICES.filter((svc) =>
    filtered.some((c) => c.service === svc),
  ).map((svc) => ({
    service: svc,
    cards: filtered.filter((c) => c.service === svc),
  }));

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Study Flashcards</Text>
        <Text style={styles.subtitle}>
          {filtered.length} card{filtered.length !== 1 ? "s" : ""} available
        </Text>

        {/* Domain filter */}
        <Text style={styles.filterLabel}>Domain</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          <FilterChip
            label="All"
            active={selectedDomain === "all"}
            color={colors.primary}
            onPress={() => setSelectedDomain("all")}
            colors={colors}
          />
          {DOMAINS.map((d) => (
            <FilterChip
              key={d}
              label={DOMAIN_META[d].label}
              active={selectedDomain === d}
              color={DOMAIN_META[d].color}
              onPress={() => setSelectedDomain(d)}
              colors={colors}
            />
          ))}
        </ScrollView>

        {/* Difficulty filter */}
        <Text style={styles.filterLabel}>Difficulty</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {DIFFICULTIES.map((d) => (
            <FilterChip
              key={d}
              label={
                d === "all" ? "All" : d.charAt(0).toUpperCase() + d.slice(1)
              }
              active={selectedDifficulty === d}
              color={
                d === "all"
                  ? colors.primary
                  : d === "easy"
                    ? colors.easy
                    : d === "medium"
                      ? colors.medium
                      : colors.hard
              }
              onPress={() => setSelectedDifficulty(d)}
              colors={colors}
            />
          ))}
        </ScrollView>

        {/* Start all button */}
        {filtered.length > 0 && (
          <TouchableOpacity
            style={styles.startAllBtn}
            onPress={() =>
              navigation.navigate("FlashCard", {
                domain: selectedDomain,
                difficulty: selectedDifficulty,
              })
            }
          >
            <Ionicons name="play-circle" size={20} color={colors.secondary} />
            <Text style={styles.startAllText}>
              Study All {filtered.length} Cards
            </Text>
          </TouchableOpacity>
        )}

        {/* Service groups */}
        {serviceGroups.map(({ service, cards }) => {
          const domain = cards[0].domain;
          const meta = DOMAIN_META[domain];
          return (
            <TouchableOpacity
              key={service}
              style={styles.serviceCard}
              onPress={() =>
                navigation.navigate("FlashCard", {
                  domain: selectedDomain,
                  difficulty: selectedDifficulty,
                  service,
                })
              }
              activeOpacity={0.8}
            >
              <View style={styles.serviceHeader}>
                <View
                  style={[
                    styles.serviceIcon,
                    { backgroundColor: meta.color + "22" },
                  ]}
                >
                  <Ionicons
                    name={meta.icon as any}
                    size={18}
                    color={meta.color}
                  />
                </View>
                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{service}</Text>
                  <Text style={styles.serviceMeta}>
                    {meta.label} · {cards.length} card
                    {cards.length !== 1 ? "s" : ""}
                  </Text>
                </View>
                <View style={styles.difficultyDots}>
                  {cards.map((c, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dot,
                        {
                          backgroundColor:
                            c.difficulty === "easy"
                              ? colors.easy
                              : c.difficulty === "medium"
                                ? colors.medium
                                : colors.hard,
                        },
                      ]}
                    />
                  ))}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textMuted}
                />
              </View>
              <View style={styles.tagRow}>
                {cards
                  .flatMap((c) => c.tags)
                  .filter((t, i, arr) => arr.indexOf(t) === i)
                  .slice(0, 5)
                  .map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
              </View>
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="search" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No cards match these filters</Text>
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function FilterChip({
  label,
  active,
  color,
  onPress,
  colors,
}: {
  label: string;
  active: boolean;
  color: string;
  onPress: () => void;
  colors: ThemeColors;
}) {
  const styles = makeStyles(colors);
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        active
          ? { backgroundColor: color, borderColor: color }
          : { borderColor: color + "55" },
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.chipText, { color: active ? colors.secondary : color }]}
      >
        {label}
      </Text>
    </TouchableOpacity>
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

    filterLabel: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    filterRow: { marginBottom: spacing.md },

    chip: {
      borderWidth: 1,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      marginRight: spacing.xs,
    },
    chipText: { fontSize: fontSize.sm, fontWeight: "600" },

    startAllBtn: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      backgroundColor: colors.primary,
      borderRadius: radius.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.lg,
    },
    startAllText: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.secondary,
    },

    serviceCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    serviceHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    serviceIcon: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.sm,
    },
    serviceInfo: { flex: 1 },
    serviceName: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    serviceMeta: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    difficultyDots: { flexDirection: "row", gap: 3, marginRight: spacing.xs },
    dot: { width: 7, height: 7, borderRadius: radius.full },

    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
    tag: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    tagText: { fontSize: fontSize.xs, color: colors.textMuted },

    empty: {
      alignItems: "center",
      paddingVertical: spacing.xxl,
      gap: spacing.md,
    },
    emptyText: { fontSize: fontSize.md, color: colors.textMuted },
  });
}
