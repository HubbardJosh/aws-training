export type ThemeColors = {
  primary: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  accent: string;

  development: string;
  security: string;
  deployment: string;
  troubleshooting: string;

  easy: string;
  medium: string;
  hard: string;

  background: string;
  surface: string;
  surfaceElevated: string;
  border: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  correct: string;
  incorrect: string;
  warning: string;
  info: string;
};

export const darkColors: ThemeColors = {
  primary: "#FF9900",
  primaryDark: "#E68900",
  secondary: "#232F3E",
  secondaryLight: "#37475A",
  accent: "#00A8E8",

  development: "#00A8E8",
  security: "#E8433A",
  deployment: "#2ECC71",
  troubleshooting: "#9B59B6",

  easy: "#2ECC71",
  medium: "#F39C12",
  hard: "#E74C3C",

  background: "#0F1923",
  surface: "#1A2535",
  surfaceElevated: "#243044",
  border: "#2D3F56",

  textPrimary: "#FFFFFF",
  textSecondary: "#8FA3BF",
  textMuted: "#4A6080",

  correct: "#2ECC71",
  incorrect: "#E74C3C",
  warning: "#F39C12",
  info: "#3498DB",
};

export const lightColors: ThemeColors = {
  primary: "#E68900",
  primaryDark: "#CC7A00",
  secondary: "#FFFFFF",
  secondaryLight: "#F5F5F5",
  accent: "#0077AA",

  development: "#0077AA",
  security: "#C0392B",
  deployment: "#27AE60",
  troubleshooting: "#7D3C98",

  easy: "#27AE60",
  medium: "#D68910",
  hard: "#C0392B",

  background: "#F0F4F8",
  surface: "#FFFFFF",
  surfaceElevated: "#E8EFF5",
  border: "#CBD5E0",

  textPrimary: "#1A202C",
  textSecondary: "#4A5568",
  textMuted: "#718096",

  correct: "#27AE60",
  incorrect: "#C0392B",
  warning: "#D68910",
  info: "#2980B9",
};

// Legacy export so existing imports still compile until screens are migrated
export const colors = darkColors;

export const DOMAIN_META: Record<
  string,
  { label: string; color: string; weight: string; icon: string }
> = {
  development: {
    label: "Development",
    color: darkColors.development,
    weight: "32%",
    icon: "code-slash",
  },
  security: {
    label: "Security",
    color: darkColors.security,
    weight: "26%",
    icon: "shield-checkmark",
  },
  deployment: {
    label: "Deployment",
    color: darkColors.deployment,
    weight: "24%",
    icon: "rocket",
  },
  troubleshooting: {
    label: "Troubleshooting",
    color: darkColors.troubleshooting,
    weight: "18%",
    icon: "build",
  },
  services: {
    label: "Services",
    color: darkColors.accent,
    weight: "",
    icon: "cloud",
  },
  fundamentals: {
    label: "Fundamentals",
    color: darkColors.primary,
    weight: "",
    icon: "school",
  },
};

export function getDomainMeta(
  colors: ThemeColors,
): Record<
  string,
  { label: string; color: string; weight: string; icon: string }
> {
  return {
    development: {
      label: "Development",
      color: colors.development,
      weight: "32%",
      icon: "code-slash",
    },
    security: {
      label: "Security",
      color: colors.security,
      weight: "26%",
      icon: "shield-checkmark",
    },
    deployment: {
      label: "Deployment",
      color: colors.deployment,
      weight: "24%",
      icon: "rocket",
    },
    troubleshooting: {
      label: "Troubleshooting",
      color: colors.troubleshooting,
      weight: "18%",
      icon: "build",
    },
    services: {
      label: "Services",
      color: colors.accent,
      weight: "",
      icon: "cloud",
    },
    fundamentals: {
      label: "Fundamentals",
      color: colors.primary,
      weight: "",
      icon: "school",
    },
  };
}

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const fontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
};
