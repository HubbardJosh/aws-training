import React, { createContext, useCallback, useContext, useState } from "react";
import {
  Dimensions,
  GestureResponderEvent,
  Modal,
  StyleSheet,
  Text,
  TextStyle,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { AIF_ABBREVIATIONS } from "../data/aif/abbreviations";
import { CLF_ABBREVIATIONS } from "../data/clf/abbreviations";
import { DVA_ABBREVIATIONS } from "../data/dva/abbreviations";
import { useTheme } from "../context/ThemeContext";
import { fontSize, radius, spacing } from "../utils/theme";

// ─── Abbreviation registry ────────────────────────────────────────────────────

const registries: Record<string, Record<string, string>> = {
  "dva-c02": DVA_ABBREVIATIONS,
  "clf-c02": CLF_ABBREVIATIONS,
  "aif-c01": AIF_ABBREVIATIONS,
};

export function registerAbbreviations(
  certKey: string,
  map: Record<string, string>,
) {
  registries[certKey] = map;
}

let activeCertKey = "dva-c02";
export function setActiveCert(key: string) {
  activeCertKey = key;
}

function lookupAbbreviation(word: string): string | undefined {
  const map = registries[activeCertKey];
  if (!map) return undefined;
  return map[word] ?? map[word.toUpperCase()] ?? undefined;
}

// ─── Token parser ─────────────────────────────────────────────────────────────

type Token =
  | { type: "abbr"; text: string; definition: string }
  | { type: "plain"; text: string };

function tokenise(text: string): Token[] {
  const tokens: Token[] = [];
  const parts = text.split(/(\b[\w-]+\b)/);
  for (const part of parts) {
    if (part === "") continue;
    const def = lookupAbbreviation(part);
    if (def) {
      tokens.push({ type: "abbr", text: part, definition: def });
    } else {
      const last = tokens[tokens.length - 1];
      if (last?.type === "plain") {
        last.text += part;
      } else {
        tokens.push({ type: "plain", text: part });
      }
    }
  }
  return tokens;
}

// ─── Tooltip context ──────────────────────────────────────────────────────────

interface TapPoint {
  x: number;
  y: number;
}

interface TooltipEntry {
  visible: boolean;
  abbr: string;
  definition: string;
  tap: TapPoint;
}

interface TooltipCtx {
  show: (abbr: string, definition: string, tap: TapPoint) => void;
}

const TooltipContext = createContext<TooltipCtx>({ show: () => {} });

const TOOLTIP_WIDTH = 300;
const TOOLTIP_GAP = 12;
const SCREEN_PADDING = 12;
const TAP_Y_OFFSET = 20;

export function AbbreviationTooltipProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { colors } = useTheme();
  const [entry, setEntry] = useState<TooltipEntry>({
    visible: false,
    abbr: "",
    definition: "",
    tap: { x: 0, y: 0 },
  });
  const [pos, setPos] = useState({ top: 0, left: 0 });

  const { width: screenW, height: screenH } = Dimensions.get("window");

  const show = useCallback(
    (abbr: string, definition: string, tap: TapPoint) => {
      const rawLeft = tap.x - TOOLTIP_WIDTH / 2;
      const left = Math.max(
        SCREEN_PADDING,
        Math.min(rawLeft, screenW - TOOLTIP_WIDTH - SCREEN_PADDING),
      );
      setPos({ top: tap.y + TAP_Y_OFFSET, left });
      setEntry({ visible: true, abbr, definition, tap });
    },
    [screenW],
  );

  const hide = useCallback(() => {
    setEntry((e) => ({ ...e, visible: false }));
  }, []);

  const handleCardLayout = useCallback(
    (cardH: number) => {
      const { tap } = entry;
      const rawLeft = tap.x - TOOLTIP_WIDTH / 2;
      const left = Math.max(
        SCREEN_PADDING,
        Math.min(rawLeft, screenW - TOOLTIP_WIDTH - SCREEN_PADDING),
      );
      const belowY = tap.y + TAP_Y_OFFSET;
      const aboveY = tap.y - cardH - TOOLTIP_GAP;
      const top =
        belowY + cardH > screenH - SCREEN_PADDING && aboveY > SCREEN_PADDING
          ? aboveY
          : belowY;
      setPos({ top, left });
    },
    [entry, screenW, screenH],
  );

  return (
    <TooltipContext.Provider value={{ show }}>
      {children}
      <Modal
        visible={entry.visible}
        transparent
        animationType="fade"
        onRequestClose={hide}
        statusBarTranslucent
      >
        <TouchableWithoutFeedback onPress={hide}>
          <View style={StyleSheet.absoluteFill}>
            <TouchableWithoutFeedback>
              <View
                style={[
                  {
                    position: "absolute",
                    backgroundColor: colors.surfaceElevated,
                    borderRadius: radius.lg,
                    borderWidth: 1,
                    borderColor: colors.accent + "44",
                    padding: spacing.md,
                    gap: spacing.sm,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.45,
                    shadowRadius: 16,
                    elevation: 16,
                  },
                  { left: pos.left, top: pos.top, width: TOOLTIP_WIDTH },
                ]}
                onLayout={(e) => handleCardLayout(e.nativeEvent.layout.height)}
              >
                <Text
                  style={{
                    fontSize: fontSize.lg,
                    fontWeight: "800",
                    color: colors.accent,
                    letterSpacing: 0.5,
                  }}
                >
                  {entry.abbr}
                </Text>
                <View style={{ height: 1, backgroundColor: colors.border }} />
                <Text
                  style={{
                    fontSize: fontSize.sm,
                    color: colors.textSecondary,
                    lineHeight: 20,
                  }}
                >
                  {entry.definition}
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </TooltipContext.Provider>
  );
}

// ─── AbbreviatedText ──────────────────────────────────────────────────────────

interface Props {
  text: string;
  style?: TextStyle;
  bold?: boolean;
  center?: boolean;
}

export function AbbreviatedText({ text, style, bold, center }: Props) {
  const { colors } = useTheme();
  const { show } = useContext(TooltipContext);

  const baseStyle: TextStyle = {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 22,
    flexShrink: 1,
    ...(style ?? {}),
    ...(bold ? { fontWeight: "700", color: colors.textPrimary } : {}),
  };

  const tokens = tokenise(text);
  const hasAbbr = tokens.some((t) => t.type === "abbr");

  if (!hasAbbr) {
    return (
      <Text style={[baseStyle, center ? { textAlign: "center" } : undefined]}>
        {text}
      </Text>
    );
  }

  return (
    <Text style={[baseStyle, center ? { textAlign: "center" } : undefined]}>
      {tokens.map((token, i) => {
        if (token.type === "abbr") {
          const handlePress = (evt: GestureResponderEvent) => {
            show(token.text, token.definition, {
              x: evt.nativeEvent.pageX,
              y: evt.nativeEvent.pageY,
            });
          };
          return (
            <Text
              key={i}
              style={{
                color: colors.accent,
                fontSize: fontSize.sm,
                fontWeight: "700",
              }}
              onPress={handlePress}
            >
              {token.text}
            </Text>
          );
        }
        return <Text key={i}>{token.text}</Text>;
      })}
    </Text>
  );
}
