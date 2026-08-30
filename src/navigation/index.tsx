import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../utils/theme";
import { CertProvider } from "../context/CertContext";
import { AbbreviationTooltipProvider } from "../components/AbbreviatedText";

import CertSelectScreen from "../screens/CertSelectScreen";
import HomeScreen from "../screens/HomeScreen";
import StudyScreen from "../screens/StudyScreen";
import FlashCardScreen from "../screens/FlashCardScreen";
import QuizMenuScreen from "../screens/QuizMenuScreen";
import QuizScreen from "../screens/QuizScreen";
import QuizResultScreen from "../screens/QuizResultScreen";
import ProgressScreen from "../screens/ProgressScreen";
import GuideListScreen from "../screens/GuideListScreen";
import GuideDetailScreen from "../screens/GuideDetailScreen";

export type RootStackParamList = {
  CertSelect: undefined;
  Tabs: undefined;
  FlashCard: { domain: string; difficulty: string; service?: string };
  Quiz: { domain: string; difficulty: string; count: number; service?: string };
  QuizResult: { sessionId: string };
  GuideDetail: { id: string };
};

export type TabParamList = {
  Home: undefined;
  Study: undefined;
  Guides: undefined;
  QuizMenu: undefined;
  Progress: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.secondary,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "600" },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, { active: string; inactive: string }> = {
            Home: { active: "home", inactive: "home-outline" },
            Study: { active: "book", inactive: "book-outline" },
            Guides: { active: "library", inactive: "library-outline" },
            QuizMenu: { active: "trophy", inactive: "trophy-outline" },
            Progress: { active: "bar-chart", inactive: "bar-chart-outline" },
          };
          const name = icons[route.name];
          return (
            <Ionicons
              name={(focused ? name.active : name.inactive) as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Dashboard" }}
      />
      <Tab.Screen
        name="Study"
        component={StudyScreen}
        options={{ title: "Study" }}
      />
      <Tab.Screen
        name="Guides"
        component={GuideListScreen}
        options={{ title: "Guides" }}
      />
      <Tab.Screen
        name="QuizMenu"
        component={QuizMenuScreen}
        options={{ title: "Quiz" }}
      />
      <Tab.Screen
        name="Progress"
        component={ProgressScreen}
        options={{ title: "Progress" }}
      />
    </Tab.Navigator>
  );
}

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CertSelect" component={CertSelectScreen} />
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="FlashCard" component={FlashCardScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizResult" component={QuizResultScreen} />
      <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <CertProvider>
      <AbbreviationTooltipProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AbbreviationTooltipProvider>
    </CertProvider>
  );
}
