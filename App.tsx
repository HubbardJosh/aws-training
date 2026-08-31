import { StatusBar } from "expo-status-bar";
import Navigation from "./src/navigation";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

function AppInner() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <Navigation />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
