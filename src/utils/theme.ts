export const colors = {
  // AWS brand-inspired palette
  primary: "#FF9900", // AWS orange
  primaryDark: "#E68900",
  secondary: "#232F3E", // AWS dark navy
  secondaryLight: "#37475A",
  accent: "#00A8E8", // AWS blue

  // Domain colors
  development: "#00A8E8",
  security: "#E8433A",
  deployment: "#2ECC71",
  troubleshooting: "#9B59B6",

  // Difficulty
  easy: "#2ECC71",
  medium: "#F39C12",
  hard: "#E74C3C",

  // Neutrals
  background: "#0F1923",
  surface: "#1A2535",
  surfaceElevated: "#243044",
  border: "#2D3F56",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "#8FA3BF",
  textMuted: "#4A6080",

  // States
  correct: "#2ECC71",
  incorrect: "#E74C3C",
  warning: "#F39C12",
  info: "#3498DB",
};

export const DOMAIN_META: Record<
  string,
  { label: string; color: string; weight: string; icon: string }
> = {
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
};

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
