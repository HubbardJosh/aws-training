import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { spacing, radius, fontSize, ThemeColors } from "../utils/theme";
import {
  useCert,
  CertificationId,
  CERT_META,
  CertMeta,
} from "../context/CertContext";
import { RootStackParamList } from "../navigation";
import { useTheme } from "../context/ThemeContext";

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface CertEntry {
  meta: CertMeta;
  prev?: string;
  next?: string;
}

interface CertGroup {
  level: string;
  description: string;
  certs: CertEntry[];
}

const CERT_GROUPS: CertGroup[] = [
  {
    level: "Foundational",
    description: "No prior cloud experience required",
    certs: [
      {
        meta: CERT_META["clf-c02"],
        next: "DVA-C02 / SAA-C03 / AIF-C01",
      },
    ],
  },
  {
    level: "Associate",
    description: "Recommended 1+ year of AWS experience",
    certs: [
      {
        meta: CERT_META["dva-c02"],
        prev: "CLF-C02",
        next: "DOP-C02 / SAP-C02",
      },
    ],
  },
  {
    level: "Specialty",
    description: "Domain-specific expertise",
    certs: [
      {
        meta: CERT_META["aif-c01"],
        prev: "CLF-C02",
        next: "MLS-C01 / ANS-C01",
      },
    ],
  },
];

export default function CertSelectScreen() {
  const navigation = useNavigation<Nav>();
  const { certId, setCert } = useCert();
  const { colors } = useTheme();
  const styles = makeStyles(colors);

  const handleSelect = (id: CertificationId) => {
    setCert(id);
    navigation.navigate("Tabs");
  };

  return (
    <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.logoWrap}>
            <Ionicons name="ribbon" size={36} color={colors.primary} />
          </View>
          <Text style={styles.title}>AWS Certifications</Text>
          <Text style={styles.subtitle}>
            Choose a certification to study for
          </Text>
        </View>

        {CERT_GROUPS.map((group) => (
          <View key={group.level} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={styles.groupLevel}>{group.level}</Text>
              <Text style={styles.groupDesc}>{group.description}</Text>
            </View>

            {group.certs.map(({ meta: cert, prev, next }) => {
              const active = certId === cert.id;
              return (
                <TouchableOpacity
                  key={cert.id}
                  style={[
                    styles.card,
                    active && { borderColor: cert.color, borderWidth: 2 },
                  ]}
                  onPress={() => handleSelect(cert.id)}
                  activeOpacity={0.8}
                >
                  <View
                    style={[
                      styles.iconWrap,
                      { backgroundColor: cert.color + "22" },
                    ]}
                  >
                    <Ionicons
                      name={cert.icon as any}
                      size={28}
                      color={cert.color}
                    />
                  </View>
                  <View style={styles.cardText}>
                    <View style={styles.cardTitleRow}>
                      <Text style={[styles.certCode, { color: cert.color }]}>
                        {cert.name}
                      </Text>
                      {active && (
                        <View
                          style={[
                            styles.activeBadge,
                            { backgroundColor: cert.color + "22" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.activeBadgeText,
                              { color: cert.color },
                            ]}
                          >
                            Active
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.certName}>{cert.fullName}</Text>
                    <Text style={styles.examInfo}>{cert.examInfo}</Text>
                    {(prev || next) && (
                      <View style={styles.progressionStack}>
                        {prev && (
                          <View style={styles.progressionItem}>
                            <Text style={styles.progressionLabel}>Prereq:</Text>
                            <Text style={styles.progressionText}>{prev}</Text>
                          </View>
                        )}
                        {next && (
                          <View style={styles.progressionItem}>
                            <Text style={styles.progressionLabel}>Next:</Text>
                            <Text style={styles.progressionText}>{next}</Text>
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={active ? cert.color : colors.textMuted}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={styles.footer}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.textMuted}
          />
          <Text style={styles.footerText}>
            Progress is tracked separately for each certification.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background },
    scroll: { flex: 1 },
    content: {
      padding: spacing.lg,
      paddingTop: spacing.xl,
    },

    header: {
      alignItems: "center",
      marginBottom: spacing.xl,
    },
    logoWrap: {
      width: 72,
      height: 72,
      borderRadius: radius.xl,
      backgroundColor: colors.primary + "18",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: spacing.md,
    },
    title: {
      fontSize: fontSize.xxl,
      fontWeight: "900",
      color: colors.textPrimary,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: fontSize.md,
      color: colors.textSecondary,
    },

    group: {
      marginBottom: spacing.lg,
    },
    groupHeader: {
      marginBottom: spacing.sm,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
      paddingLeft: spacing.sm,
    },
    groupLevel: {
      fontSize: fontSize.xs,
      fontWeight: "800",
      color: colors.primary,
      letterSpacing: 1,
      textTransform: "uppercase",
    },
    groupDesc: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      marginTop: 2,
    },

    card: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      gap: spacing.md,
    },
    iconWrap: {
      width: 56,
      height: 56,
      borderRadius: radius.lg,
      justifyContent: "center",
      alignItems: "center",
    },
    cardText: { flex: 1, gap: 3 },
    cardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    certCode: {
      fontSize: fontSize.lg,
      fontWeight: "800",
    },
    activeBadge: {
      borderRadius: radius.full,
      paddingHorizontal: 8,
      paddingVertical: 2,
    },
    activeBadgeText: {
      fontSize: fontSize.xs,
      fontWeight: "700",
    },
    certName: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
    },
    examInfo: {
      fontSize: fontSize.xs,
      color: colors.textSecondary,
      marginTop: 1,
    },
    progressionStack: {
      marginTop: spacing.xs,
      gap: 3,
    },
    progressionItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    progressionLabel: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      fontWeight: "600",
    },
    progressionText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },

    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      justifyContent: "center",
      marginTop: spacing.sm,
      paddingBottom: spacing.lg,
    },
    footerText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
    },
  });
}
