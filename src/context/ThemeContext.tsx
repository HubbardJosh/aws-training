import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import { darkColors, lightColors, ThemeColors } from "../utils/theme";

type ThemeMode = "system" | "light" | "dark";

interface ThemeContextValue {
  colors: ThemeColors;
  isDark: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkColors,
  isDark: true,
  themeMode: "system",
  setThemeMode: () => {},
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  const isDark =
    themeMode === "system" ? systemScheme !== "light" : themeMode === "dark";

  const toggleTheme = () => {
    setThemeMode((current) => {
      if (current === "system") return isDark ? "light" : "dark";
      return current === "dark" ? "light" : "dark";
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        colors: isDark ? darkColors : lightColors,
        isDark,
        themeMode,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
