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
import { colors, spacing, radius, fontSize } from "../utils/theme";
import {
  useCert,
  CertificationId,
  CERT_META,
  CertMeta,
} from "../context/CertContext";
import { RootStackParamList } from "../navigation";

type Nav = NativeStackNavigationProp<RootStackParamList>;

const CERTS: CertMeta[] = [
  CERT_META["dva-c02"],
  CERT_META["clf-c02"],
  CERT_META["aif-c01"],
];

export default function CertSelectScreen() {
  const navigation = useNavigation<Nav>();
  const { certId, setCert } = useCert();

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

        {CERTS.map((cert) => {
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
                        style={[styles.activeBadgeText, { color: cert.color }]}
                      >
                        Active
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.certName}>{cert.fullName}</Text>
                <Text style={styles.examInfo}>{cert.examInfo}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={active ? cert.color : colors.textMuted}
              />
            </TouchableOpacity>
          );
        })}

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

const styles = StyleSheet.create({
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

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    marginBottom: spacing.md,
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
