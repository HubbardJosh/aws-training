import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { colors, spacing, radius, fontSize, DOMAIN_META } from "../utils/theme";
import { allGuides } from "../data/guides";
import { RootStackParamList } from "../navigation";
import {
  loadProgress,
  saveProgress,
  touchGuide,
  markSectionRead,
  getGuideProgress,
} from "../utils/storage";
import { UserProgress } from "../types";

type RouteT = RouteProp<RootStackParamList, "GuideDetail">;

type Tab = "content" | "facts" | "exam";

export default function GuideDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const guide = allGuides.find((g) => g.id === route.params.id);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const progressRef = useRef<UserProgress | null>(null);

  // Load progress and mark guide as viewed on mount
  useEffect(() => {
    if (!guide) return;
    loadProgress().then((p) => {
      const updated = touchGuide(p, guide.id, guide.sections.length);
      progressRef.current = updated;
      setProgress(updated);
      saveProgress(updated);
    });
  }, [guide?.id]);

  const handleSectionToggle = useCallback(
    async (i: number) => {
      if (!guide) return;
      const next = expandedSection === i ? null : i;
      setExpandedSection(next);

      // Mark the section as read when opened
      if (next !== null && progressRef.current) {
        const updated = markSectionRead(
          progressRef.current,
          guide.id,
          next,
          guide.sections.length,
        );
        progressRef.current = updated;
        setProgress(updated);
        await saveProgress(updated);
      }
    },
    [expandedSection, guide],
  );

  if (!guide) {
    return (
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <Text style={styles.errorText}>Guide not found.</Text>
      </SafeAreaView>
    );
  }

  const meta = DOMAIN_META[guide.domain];
  const gp = progress ? getGuideProgress(progress, guide.id) : null;
  const sectionsRead = gp?.sectionsRead.length ?? 0;
  const isCompleted = gp?.completed ?? false;

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.headerTitleRow}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {guide.service}
            </Text>
            {isCompleted && (
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.correct}
              />
            )}
          </View>
          <View style={styles.headerBadges}>
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
            <Text style={styles.progressText}>
              {sectionsRead}/{guide.sections.length} sections read
            </Text>
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(
          [
            { key: "content", label: "Content", icon: "document-text" },
            { key: "facts", label: "Key Facts", icon: "list" },
            { key: "exam", label: "Exam Tips", icon: "school" },
          ] as { key: Tab; label: string; icon: string }[]
        ).map(({ key, label, icon }) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, activeTab === key && styles.tabActive]}
            onPress={() => setActiveTab(key)}
          >
            <Ionicons
              name={icon as any}
              size={14}
              color={activeTab === key ? colors.primary : colors.textMuted}
            />
            <Text
              style={[
                styles.tabText,
                activeTab === key && styles.tabTextActive,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro always shown */}
        <View style={styles.introCard}>
          <Text style={styles.tagline}>{guide.tagline}</Text>
          <Text style={styles.intro}>{guide.intro}</Text>
        </View>

        {/* Content tab: accordion sections */}
        {activeTab === "content" &&
          guide.sections.map((section, i) => {
            const sectionRead = gp?.sectionsRead.includes(i) ?? false;
            return (
              <View key={i} style={styles.sectionCard}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => handleSectionToggle(i)}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.sectionNum,
                      {
                        backgroundColor: sectionRead
                          ? colors.correct + "22"
                          : meta.color + "22",
                      },
                    ]}
                  >
                    {sectionRead ? (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color={colors.correct}
                      />
                    ) : (
                      <Text
                        style={[styles.sectionNumText, { color: meta.color }]}
                      >
                        {i + 1}
                      </Text>
                    )}
                  </View>
                  <Text style={styles.sectionHeading}>{section.heading}</Text>
                  <Ionicons
                    name={expandedSection === i ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={colors.textMuted}
                  />
                </TouchableOpacity>

                {expandedSection === i && (
                  <View style={styles.sectionBody}>
                    <MarkdownBody text={section.body} />
                  </View>
                )}
              </View>
            );
          })}

        {/* Key Facts tab */}
        {activeTab === "facts" && (
          <View>
            <Text style={styles.tabSectionTitle}>Key Facts to Remember</Text>
            {guide.keyFacts.map((fact, i) => (
              <View key={i} style={styles.factRow}>
                <View
                  style={[styles.factBullet, { backgroundColor: meta.color }]}
                />
                <Text style={styles.factText}>{fact}</Text>
              </View>
            ))}

            {guide.relatedServices.length > 0 && (
              <>
                <Text
                  style={[styles.tabSectionTitle, { marginTop: spacing.lg }]}
                >
                  Related Services
                </Text>
                <View style={styles.relatedGrid}>
                  {guide.relatedServices.map((svc, i) => (
                    <View key={i} style={styles.relatedChip}>
                      <Text style={styles.relatedText}>{svc}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>
        )}

        {/* Exam Tips tab */}
        {activeTab === "exam" && (
          <View>
            <Text style={styles.tabSectionTitle}>Exam Tips</Text>
            <View
              style={[styles.examBanner, { borderLeftColor: colors.warning }]}
            >
              <Ionicons
                name="school"
                size={16}
                color={colors.warning}
                style={{ marginBottom: 4 }}
              />
              <Text style={styles.examBannerText}>
                These are the highest-yield points for DVA-C02 exam questions on{" "}
                {guide.service}.
              </Text>
            </View>
            {guide.examTips.map((tip, i) => (
              <View key={i} style={styles.tipCard}>
                <View style={styles.tipNumber}>
                  <Text style={styles.tipNumberText}>{i + 1}</Text>
                </View>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function MarkdownBody({ text }: { text: string }) {
  const lines = text.split("\n");

  return (
    <View style={{ gap: 6 }}>
      {lines.map((line, i) => {
        if (line.trim() === "") return <View key={i} style={{ height: 4 }} />;

        // Code block delimiter — skip (content handled below)
        if (line.trim() === "```" || line.trim().startsWith("```")) {
          return null;
        }

        // Bullet list
        if (line.trim().startsWith("- ")) {
          const content = line.trim().slice(2);
          return (
            <View key={i} style={mdStyles.bulletRow}>
              <Text style={mdStyles.bulletDot}>•</Text>
              <InlineText text={content} />
            </View>
          );
        }

        // Numbered list
        const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <View key={i} style={mdStyles.bulletRow}>
              <Text style={mdStyles.bulletDot}>{numberedMatch[1]}.</Text>
              <InlineText text={numberedMatch[2]} />
            </View>
          );
        }

        // Code line (indented 4+ spaces or inside ``` block)
        if (line.startsWith("    ") || line.startsWith("\t")) {
          return (
            <View key={i} style={mdStyles.codeLine}>
              <Text style={mdStyles.codeText}>{line.trim()}</Text>
            </View>
          );
        }

        // Heading
        if (
          line.startsWith("**") &&
          line.endsWith("**") &&
          !line.includes(" ")
        ) {
          return (
            <Text key={i} style={mdStyles.bold}>
              {line.slice(2, -2)}
            </Text>
          );
        }

        // Regular paragraph
        return <InlineText key={i} text={line} />;
      })}
    </View>
  );
}

function InlineText({ text }: { text: string }) {
  // Split on **bold** markers
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <Text style={mdStyles.para}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <Text key={i} style={mdStyles.boldInline}>
              {part.slice(2, -2)}
            </Text>
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <Text key={i} style={mdStyles.inlineCode}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        return <Text key={i}>{part}</Text>;
      })}
    </Text>
  );
}

const mdStyles = StyleSheet.create({
  para: {
    flex: 1,
    flexWrap: "wrap",
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  bold: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  boldInline: {
    fontWeight: "700",
    color: colors.textPrimary,
  },
  inlineCode: {
    fontFamily: "monospace",
    backgroundColor: colors.surfaceElevated,
    color: colors.primary,
    fontSize: fontSize.xs,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  codeLine: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    marginVertical: 2,
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: fontSize.xs,
    color: colors.accent,
    lineHeight: 18,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    paddingLeft: spacing.xs,
  },
  bulletDot: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    lineHeight: 22,
    minWidth: 16,
  },
});

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  errorText: {
    color: colors.textSecondary,
    padding: spacing.lg,
    fontSize: fontSize.md,
  },

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
  headerInfo: { flex: 1, gap: 4 },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: "800",
    color: colors.textPrimary,
    flexShrink: 1,
  },
  headerBadges: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  domainBadge: {
    alignSelf: "flex-start",
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  domainText: { fontSize: fontSize.xs, fontWeight: "600" },
  progressText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabActive: { borderBottomColor: colors.primary },
  tabText: {
    fontSize: fontSize.xs,
    fontWeight: "600",
    color: colors.textMuted,
  },
  tabTextActive: { color: colors.primary },

  scroll: { flex: 1 },
  content: { padding: spacing.md },

  introCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tagline: {
    fontSize: fontSize.md,
    fontWeight: "700",
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  intro: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
  },

  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    gap: spacing.sm,
  },
  sectionNum: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionNumText: { fontSize: fontSize.sm, fontWeight: "700" },
  sectionHeading: {
    flex: 1,
    fontSize: fontSize.md,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  sectionBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },

  tabSectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  factRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  factBullet: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    marginTop: 7,
    flexShrink: 0,
  },
  factText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  relatedGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  relatedChip: {
    backgroundColor: colors.surfaceElevated,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  relatedText: { fontSize: fontSize.xs, color: colors.textSecondary },

  examBanner: {
    backgroundColor: colors.warning + "11",
    borderLeftWidth: 3,
    borderRadius: radius.sm,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  examBannerText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },

  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    marginBottom: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tipNumber: {
    width: 24,
    height: 24,
    borderRadius: radius.full,
    backgroundColor: colors.primary + "22",
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  tipNumberText: {
    fontSize: fontSize.xs,
    fontWeight: "700",
    color: colors.primary,
  },
  tipText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
