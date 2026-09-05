import React, { useState, useMemo, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  spacing,
  radius,
  fontSize,
  getDomainMeta,
  ThemeColors,
} from "../utils/theme";
import { RootStackParamList } from "../navigation";
import { loadProgress, getMissedQuestions } from "../utils/storage";
import { UserProgress } from "../types";
import { useCert } from "../context/CertContext";
import { useCertData } from "../context/useCertData";
import { useTheme } from "../context/ThemeContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function GuideListScreen() {
  const navigation = useNavigation<Nav>();
  const { certMeta } = useCert();
  const { guides: allGuides } = useCertData();
  const { colors } = useTheme();
  const styles = makeStyles(colors);
  const DOMAIN_META = getDomainMeta(colors);
  const [search, setSearch] = useState("");
  const [domain, setDomain] = useState("all");
  const [progress, setProgress] = useState<UserProgress | null>(null);

  const availableDomains = useMemo(() => {
    const seen = new Set<string>();
    allGuides.forEach((g) => seen.add(g.domain));
    return ["all", ...Array.from(seen).sort()];
  }, [allGuides]);

  useFocusEffect(
    useCallback(() => {
      loadProgress(certMeta.storageKey).then(setProgress);
    }, [certMeta.storageKey]),
  );

  const missedCount = progress ? getMissedQuestions(progress).length : 0;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return allGuides.filter((g) => {
      const domainMatch = domain === "all" || g.domain === domain;
      const searchMatch =
        !q ||
        g.service.toLowerCase().includes(q) ||
        g.tagline.toLowerCase().includes(q) ||
        g.relatedServices.some((s) => s.toLowerCase().includes(q));
      return domainMatch && searchMatch;
    });
  }, [search, domain]);

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Service Guides</Text>
        <Text style={styles.subtitle}>
          {allGuides.length} in-depth guides for {certMeta.name}
        </Text>

        {/* Search */}
        <View style={styles.searchRow}>
          <Ionicons
            name="search"
            size={16}
            color={colors.textMuted}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services…"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons
                name="close-circle"
                size={16}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Domain filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterRow}
        >
          {availableDomains.map((d) => {
            const meta = d === "all" ? null : DOMAIN_META[d];
            const color = meta ? meta.color : colors.primary;
            const label = meta ? meta.label : "All";
            return (
              <TouchableOpacity
                key={d}
                style={[
                  styles.chip,
                  domain === d
                    ? { backgroundColor: color, borderColor: color }
                    : { borderColor: color + "55" },
                ]}
                onPress={() => setDomain(d)}
              >
                <Text
                  style={[
                    styles.chipText,
                    { color: domain === d ? colors.secondary : color },
                  ]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Missed questions button */}
        {missedCount > 0 && (
          <TouchableOpacity
            style={styles.missedBtn}
            onPress={() =>
              navigation.navigate("MissedQuestions", { source: "guide" })
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

        {/* Results count */}
        <Text style={styles.resultCount}>
          {filtered.length} guide{filtered.length !== 1 ? "s" : ""}
        </Text>

        {/* Guide cards */}
        {filtered.map((guide) => {
          const meta = DOMAIN_META[guide.domain];
          const gp = progress?.guideProgress[guide.id];
          const sectionsRead = gp?.sectionsRead.length ?? 0;
          const isCompleted = gp?.completed ?? false;
          const isViewed = !!gp;
          return (
            <TouchableOpacity
              key={guide.id}
              style={[styles.card, isCompleted && styles.cardCompleted]}
              onPress={() =>
                navigation.navigate("GuideDetail", { id: guide.id })
              }
              activeOpacity={0.8}
            >
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: meta.color + "22" },
                  ]}
                >
                  <Ionicons
                    name={meta.icon as any}
                    size={18}
                    color={meta.color}
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{guide.service}</Text>
                  <Text style={styles.cardTagline} numberOfLines={1}>
                    {guide.tagline}
                  </Text>
                </View>
                {isCompleted ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.correct}
                  />
                ) : isViewed ? (
                  <Ionicons
                    name="ellipse"
                    size={10}
                    color={colors.primary}
                    style={{ marginRight: 3 }}
                  />
                ) : (
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={colors.textMuted}
                  />
                )}
              </View>
              <View style={styles.cardFooter}>
                <View
                  style={[
                    styles.domainBadge,
                    { backgroundColor: meta.color + "22" },
                  ]}
                >
                  <Text style={[styles.domainText, { color: meta.color }]}>
                    {meta.label}
                  </Text>
                </View>
                {isViewed ? (
                  <Text
                    style={[
                      styles.sectionCount,
                      { color: isCompleted ? colors.correct : colors.primary },
                    ]}
                  >
                    {sectionsRead}/{guide.sections.length} sections read
                  </Text>
                ) : (
                  <Text style={styles.sectionCount}>
                    {guide.sections.length} sections · {guide.keyFacts.length}{" "}
                    key facts
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.empty}>
            <Ionicons name="search" size={40} color={colors.textMuted} />
            <Text style={styles.emptyText}>No guides match your search</Text>
          </View>
        )}

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

    searchRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm + 2,
      marginBottom: spacing.sm,
    },
    searchIcon: { marginRight: spacing.sm },
    searchInput: {
      flex: 1,
      color: colors.textPrimary,
      fontSize: fontSize.md,
      padding: 0,
    },

    filterRow: { marginBottom: spacing.sm },
    chip: {
      borderWidth: 1,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs + 2,
      marginRight: spacing.xs,
    },
    chipText: { fontSize: fontSize.sm, fontWeight: "600" },

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
      marginBottom: spacing.sm,
    },
    missedBtnText: {
      flex: 1,
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.incorrect,
    },

    resultCount: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginBottom: spacing.sm,
    },

    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
    },
    cardCompleted: {
      borderColor: colors.correct + "44",
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    iconBox: {
      width: 36,
      height: 36,
      borderRadius: radius.sm,
      justifyContent: "center",
      alignItems: "center",
      marginRight: spacing.sm,
    },
    cardInfo: { flex: 1 },
    cardTitle: {
      fontSize: fontSize.md,
      fontWeight: "700",
      color: colors.textPrimary,
    },
    cardTagline: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 2,
    },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    domainBadge: {
      borderRadius: radius.sm,
      paddingHorizontal: 8,
      paddingVertical: 3,
    },
    domainText: { fontSize: fontSize.xs, fontWeight: "600" },
    sectionCount: { fontSize: fontSize.xs, color: colors.textMuted },

    empty: {
      alignItems: "center",
      paddingVertical: spacing.xxl,
      gap: spacing.md,
    },
    emptyText: { fontSize: fontSize.md, color: colors.textMuted },
  });
}
