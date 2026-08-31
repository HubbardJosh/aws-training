import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import CodeHighlighter from "react-native-code-highlighter";
import {
  atomOneDark,
  atomOneLight,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { AbbreviatedText } from "../components/AbbreviatedText";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import {
  spacing,
  radius,
  fontSize,
  getDomainMeta,
  ThemeColors,
} from "../utils/theme";
import { RootStackParamList } from "../navigation";
import { useCert } from "../context/CertContext";
import { useCertData } from "../context/useCertData";
import { useTheme } from "../context/ThemeContext";
import {
  loadProgress,
  saveProgress,
  touchGuide,
  markSectionRead,
  getGuideProgress,
} from "../utils/storage";
import { UserProgress } from "../types";
import { GuideQuizQuestion } from "../types/guide";

type RouteT = RouteProp<RootStackParamList, "GuideDetail">;

type Tab = "content" | "facts" | "exam";

// ─── Inline Quiz ─────────────────────────────────────────────────────────────

interface InlineQuizProps {
  questions: GuideQuizQuestion[];
  accentColor: string;
  sectionBody: string;
  onComplete: () => void;
  colors: ThemeColors;
  isDark: boolean;
}

function InlineQuiz({
  questions,
  accentColor,
  sectionBody,
  onComplete,
  colors,
  isDark,
}: InlineQuizProps) {
  const qStyles = makeQuizStyles(colors);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [showBody, setShowBody] = useState(false);

  const q = questions[index];

  if (!started) {
    return (
      <View style={{ gap: spacing.md }}>
        <MarkdownBody text={sectionBody} colors={colors} isDark={isDark} />
        <TouchableOpacity
          style={[qStyles.startPrompt, { borderColor: accentColor + "44" }]}
          onPress={() => setStarted(true)}
          activeOpacity={0.8}
        >
          <View
            style={[qStyles.badge, { backgroundColor: accentColor + "22" }]}
          >
            <Text style={[qStyles.badgeText, { color: accentColor }]}>
              Section Quiz
            </Text>
          </View>
          <Text style={qStyles.startPromptText}>
            {questions.length} question{questions.length !== 1 ? "s" : ""} —
            test yourself on this section
          </Text>
          <View
            style={[qStyles.startPromptBtn, { backgroundColor: accentColor }]}
          >
            <Ionicons name="play" size={12} color="#fff" />
            <Text style={qStyles.startPromptBtnText}>Start Quiz</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSelect = (i: number) => {
    if (revealed) return;
    setSelected(i);
  };

  const handleCheck = () => {
    if (selected === null) return;
    if (selected === q.correctIndex) setScore((s) => s + 1);
    setRevealed(true);
  };

  const handleNext = () => {
    if (index + 1 >= questions.length) {
      if (score === questions.length) onComplete();
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRetry = () => {
    setStarted(false);
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setScore(0);
    setDone(false);
    setShowBody(false);
  };

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <View style={{ gap: spacing.md }}>
        <View style={[qStyles.resultCard, { borderColor: accentColor + "44" }]}>
          <Ionicons
            name={passed ? "checkmark-circle" : "refresh-circle"}
            size={32}
            color={passed ? colors.correct : colors.warning}
          />
          <Text style={qStyles.resultScore}>
            {score}/{questions.length} correct — {pct}%
          </Text>
          <Text style={qStyles.resultLabel}>
            {passed ? "Section mastered!" : "Review the section and try again"}
          </Text>
          <View style={qStyles.resultActions}>
            <TouchableOpacity
              style={[qStyles.retryBtn, { borderColor: accentColor + "66" }]}
              onPress={handleRetry}
            >
              <Text style={[qStyles.retryText, { color: accentColor }]}>
                Retry
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[qStyles.readBtn, { borderColor: accentColor + "66" }]}
              onPress={() => setShowBody((v) => !v)}
            >
              <Ionicons
                name={showBody ? "eye-off-outline" : "book-outline"}
                size={14}
                color={accentColor}
              />
              <Text style={[qStyles.retryText, { color: accentColor }]}>
                {showBody ? "Hide Section" : "Read Section"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {showBody && (
          <MarkdownBody text={sectionBody} colors={colors} isDark={isDark} />
        )}
      </View>
    );
  }

  return (
    <View style={[qStyles.card, { borderColor: accentColor + "44" }]}>
      <View style={qStyles.header}>
        <View style={[qStyles.badge, { backgroundColor: accentColor + "22" }]}>
          <Text style={[qStyles.badgeText, { color: accentColor }]}>
            Section Quiz
          </Text>
        </View>
        <Text style={qStyles.counter}>
          {index + 1}/{questions.length}
        </Text>
      </View>

      <Text style={qStyles.question}>{q.question}</Text>

      {q.options.map((opt, i) => {
        let bg = colors.surfaceElevated;
        let border = colors.border;
        let textColor = colors.textSecondary;

        if (revealed) {
          if (i === q.correctIndex) {
            bg = colors.correct + "22";
            border = colors.correct;
            textColor = colors.correct;
          } else if (i === selected) {
            bg = colors.incorrect + "22";
            border = colors.incorrect;
            textColor = colors.incorrect;
          }
        } else if (i === selected) {
          bg = accentColor + "22";
          border = accentColor;
          textColor = colors.textPrimary;
        }

        return (
          <TouchableOpacity
            key={i}
            style={[
              qStyles.option,
              { backgroundColor: bg, borderColor: border },
            ]}
            onPress={() => handleSelect(i)}
            activeOpacity={0.7}
          >
            <View style={[qStyles.optionDot, { borderColor: border }]}>
              {revealed && i === q.correctIndex && (
                <Ionicons name="checkmark" size={10} color={colors.correct} />
              )}
              {revealed && i === selected && i !== q.correctIndex && (
                <Ionicons name="close" size={10} color={colors.incorrect} />
              )}
              {!revealed && i === selected && (
                <View
                  style={[qStyles.dotFill, { backgroundColor: accentColor }]}
                />
              )}
            </View>
            <Text style={[qStyles.optionText, { color: textColor }]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}

      {revealed && (
        <View style={qStyles.explanation}>
          <Ionicons
            name="information-circle"
            size={14}
            color={colors.textMuted}
            style={{ marginTop: 2 }}
          />
          <AbbreviatedText
            text={q.explanation}
            style={qStyles.explanationText}
          />
        </View>
      )}

      <View style={qStyles.actions}>
        {!revealed ? (
          <TouchableOpacity
            style={[
              qStyles.actionBtn,
              {
                backgroundColor:
                  selected !== null ? accentColor : colors.surfaceElevated,
              },
            ]}
            onPress={handleCheck}
            disabled={selected === null}
          >
            <Text
              style={[
                qStyles.actionText,
                { color: selected !== null ? "#fff" : colors.textMuted },
              ]}
            >
              Check Answer
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[qStyles.actionBtn, { backgroundColor: accentColor }]}
            onPress={handleNext}
          >
            <Text style={[qStyles.actionText, { color: "#fff" }]}>
              {index + 1 >= questions.length ? "Finish" : "Next Question"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Topic Quiz ───────────────────────────────────────────────────────────────

interface TopicQuizProps {
  questions: GuideQuizQuestion[];
  accentColor: string;
  serviceName: string;
  colors: ThemeColors;
}

function TopicQuiz({
  questions,
  accentColor,
  serviceName,
  colors,
}: TopicQuizProps) {
  const qStyles = makeQuizStyles(colors);
  const tStyles = makeTopicStyles(colors);
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [done, setDone] = useState(false);

  const q = questions[index];

  const handleCheck = () => {
    if (selected === null) return;
    setRevealed(true);
  };

  const handleNext = () => {
    const correct = selected === q.correctIndex;
    const newAnswers = [...answers, correct];

    if (index + 1 >= questions.length) {
      setAnswers(newAnswers);
      setDone(true);
    } else {
      setAnswers(newAnswers);
      setIndex((i) => i + 1);
      setSelected(null);
      setRevealed(false);
    }
  };

  const handleRetry = () => {
    setIndex(0);
    setSelected(null);
    setRevealed(false);
    setAnswers([]);
    setDone(false);
  };

  if (!started) {
    return (
      <View style={[tStyles.startCard, { borderColor: accentColor + "44" }]}>
        <Ionicons name="trophy-outline" size={28} color={accentColor} />
        <Text style={tStyles.startTitle}>{serviceName} Topic Quiz</Text>
        <Text style={tStyles.startSub}>
          {questions.length} questions covering all sections
        </Text>
        <TouchableOpacity
          style={[tStyles.startBtn, { backgroundColor: accentColor }]}
          onPress={() => setStarted(true)}
        >
          <Text style={tStyles.startBtnText}>Start Quiz</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (done) {
    const score = answers.filter(Boolean).length;
    const pct = Math.round((score / questions.length) * 100);
    const passed = pct >= 70;
    return (
      <View style={[tStyles.resultCard, { borderColor: accentColor + "44" }]}>
        <Ionicons
          name={passed ? "trophy" : "refresh-circle"}
          size={40}
          color={passed ? colors.warning : colors.textMuted}
        />
        <Text style={tStyles.resultPct}>{pct}%</Text>
        <Text style={tStyles.resultScore}>
          {score} / {questions.length} correct
        </Text>
        <Text
          style={[
            tStyles.resultLabel,
            { color: passed ? colors.correct : colors.warning },
          ]}
        >
          {passed ? "Topic mastered!" : "Keep studying and try again"}
        </Text>
        <View style={tStyles.resultGrid}>
          {answers.map((correct, i) => (
            <View
              key={i}
              style={[
                tStyles.resultDot,
                {
                  backgroundColor: correct ? colors.correct : colors.incorrect,
                },
              ]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={[tStyles.retryBtn, { borderColor: accentColor }]}
          onPress={handleRetry}
        >
          <Text style={[tStyles.retryText, { color: accentColor }]}>
            Retry Quiz
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[tStyles.card, { borderColor: accentColor + "44" }]}>
      <View style={tStyles.header}>
        <Text style={[tStyles.headerTitle, { color: accentColor }]}>
          Topic Quiz
        </Text>
        <Text style={tStyles.counter}>
          {index + 1} / {questions.length}
        </Text>
      </View>

      <View style={tStyles.progressBar}>
        <View
          style={[
            tStyles.progressFill,
            {
              width: `${((index + 1) / questions.length) * 100}%`,
              backgroundColor: accentColor,
            },
          ]}
        />
      </View>

      <Text style={tStyles.question}>{q.question}</Text>

      {q.options.map((opt, i) => {
        let bg = colors.surfaceElevated;
        let border = colors.border;
        let textColor = colors.textSecondary;

        if (revealed) {
          if (i === q.correctIndex) {
            bg = colors.correct + "22";
            border = colors.correct;
            textColor = colors.correct;
          } else if (i === selected) {
            bg = colors.incorrect + "22";
            border = colors.incorrect;
            textColor = colors.incorrect;
          }
        } else if (i === selected) {
          bg = accentColor + "22";
          border = accentColor;
          textColor = colors.textPrimary;
        }

        return (
          <TouchableOpacity
            key={i}
            style={[
              qStyles.option,
              { backgroundColor: bg, borderColor: border },
            ]}
            onPress={() => !revealed && setSelected(i)}
            activeOpacity={0.7}
          >
            <View style={[qStyles.optionDot, { borderColor: border }]}>
              {revealed && i === q.correctIndex && (
                <Ionicons name="checkmark" size={10} color={colors.correct} />
              )}
              {revealed && i === selected && i !== q.correctIndex && (
                <Ionicons name="close" size={10} color={colors.incorrect} />
              )}
              {!revealed && i === selected && (
                <View
                  style={[qStyles.dotFill, { backgroundColor: accentColor }]}
                />
              )}
            </View>
            <Text style={[qStyles.optionText, { color: textColor }]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}

      {revealed && (
        <View style={qStyles.explanation}>
          <Ionicons
            name="information-circle"
            size={14}
            color={colors.textMuted}
            style={{ marginTop: 2 }}
          />
          <AbbreviatedText
            text={q.explanation}
            style={qStyles.explanationText}
          />
        </View>
      )}

      <View style={qStyles.actions}>
        {!revealed ? (
          <TouchableOpacity
            style={[
              qStyles.actionBtn,
              {
                backgroundColor:
                  selected !== null ? accentColor : colors.surfaceElevated,
              },
            ]}
            onPress={handleCheck}
            disabled={selected === null}
          >
            <Text
              style={[
                qStyles.actionText,
                { color: selected !== null ? "#fff" : colors.textMuted },
              ]}
            >
              Check Answer
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[qStyles.actionBtn, { backgroundColor: accentColor }]}
            onPress={handleNext}
          >
            <Text style={[qStyles.actionText, { color: "#fff" }]}>
              {index + 1 >= questions.length ? "See Results" : "Next Question"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function GuideDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<RouteT>();
  const { certMeta } = useCert();
  const { guides: allGuides } = useCertData();
  const { colors, isDark } = useTheme();
  const DOMAIN_META = getDomainMeta(colors);
  const guide = allGuides.find((g) => g.id === route.params.id);
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const progressRef = useRef<UserProgress | null>(null);

  useEffect(() => {
    if (!guide) return;
    loadProgress(certMeta.storageKey).then((p) => {
      const updated = touchGuide(p, guide.id, guide.sections.length);
      progressRef.current = updated;
      setProgress(updated);
      saveProgress(updated, certMeta.storageKey);
    });
  }, [guide?.id]);

  const handleSectionToggle = useCallback(
    (i: number) => {
      if (!guide) return;
      const next = expandedSection === i ? null : i;
      setExpandedSection(next);

      if (next !== null && progressRef.current) {
        const hasQuiz =
          guide.sections[next].quiz && guide.sections[next].quiz!.length > 0;
        if (!hasQuiz) {
          const updated = markSectionRead(
            progressRef.current,
            guide.id,
            next,
            guide.sections.length,
          );
          progressRef.current = updated;
          setProgress(updated);
          saveProgress(updated, certMeta.storageKey);
        }
      }
    },
    [expandedSection, guide],
  );

  const handleSectionComplete = useCallback(
    async (i: number) => {
      if (!guide || !progressRef.current) return;
      const updated = markSectionRead(
        progressRef.current,
        guide.id,
        i,
        guide.sections.length,
      );
      progressRef.current = updated;
      setProgress(updated);
      await saveProgress(updated, certMeta.storageKey);
    },
    [guide],
  );

  const styles = makeStyles(colors);

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
        {activeTab === "content" && (
          <>
            {guide.sections.map((section, i) => {
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
                      name={
                        expandedSection === i ? "chevron-up" : "chevron-down"
                      }
                      size={16}
                      color={colors.textMuted}
                    />
                  </TouchableOpacity>

                  {expandedSection === i && (
                    <View style={styles.sectionBody}>
                      {section.quiz && section.quiz.length > 0 ? (
                        <InlineQuiz
                          questions={section.quiz}
                          accentColor={meta.color}
                          sectionBody={section.body}
                          onComplete={() => handleSectionComplete(i)}
                          colors={colors}
                          isDark={isDark}
                        />
                      ) : (
                        <MarkdownBody
                          text={section.body}
                          colors={colors}
                          isDark={isDark}
                        />
                      )}
                    </View>
                  )}
                </View>
              );
            })}

            {guide.topicQuiz && guide.topicQuiz.length > 0 && (
              <View style={{ marginTop: spacing.md }}>
                <TopicQuiz
                  questions={guide.topicQuiz}
                  accentColor={meta.color}
                  serviceName={guide.service}
                  colors={colors}
                />
              </View>
            )}
          </>
        )}

        {/* Key Facts tab */}
        {activeTab === "facts" && (
          <View>
            <Text style={styles.tabSectionTitle}>Key Facts to Remember</Text>
            {guide.keyFacts.map((fact, i) => (
              <View key={i} style={styles.factRow}>
                <View
                  style={[styles.factBullet, { backgroundColor: meta.color }]}
                />
                <AbbreviatedText text={fact} style={styles.factText} />
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
                <AbbreviatedText text={tip} style={styles.tipText} />
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

type BodyToken =
  | { kind: "line"; index: number; content: string }
  | { kind: "codeBlock"; index: number; lines: string[]; language: string };

function tokenizeBody(lines: string[]): BodyToken[] {
  const tokens: BodyToken[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith("```")) {
      const language = lines[i].trim().slice(3).trim() || "typescript";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      tokens.push({
        kind: "codeBlock",
        index: tokens.length,
        lines: codeLines,
        language,
      });
    } else {
      tokens.push({ kind: "line", index: tokens.length, content: lines[i] });
      i++;
    }
  }
  return tokens;
}

function MarkdownBody({
  text,
  colors,
  isDark,
}: {
  text: string;
  colors: ThemeColors;
  isDark: boolean;
}) {
  const mdStyles = makeMdStyles(colors);
  const tokens = tokenizeBody(text.split("\n"));

  return (
    <View style={{ gap: 6 }}>
      {tokens.map((token) => {
        if (token.kind === "codeBlock") {
          const codeBg = isDark ? "#282c34" : "#fafafa";
          return (
            <View
              key={token.index}
              style={[mdStyles.codeContainer, { backgroundColor: codeBg }]}
            >
              <CodeHighlighter
                hljsStyle={isDark ? atomOneDark : atomOneLight}
                textStyle={mdStyles.codeText}
                containerStyle={mdStyles.codeInner}
                scrollViewProps={{
                  horizontal: true,
                  showsHorizontalScrollIndicator: false,
                  style: { backgroundColor: codeBg },
                  contentContainerStyle: { backgroundColor: codeBg },
                }}
                language={token.language ?? "typescript"}
              >
                {token.lines.join("\n")}
              </CodeHighlighter>
            </View>
          );
        }

        const line = token.content;

        if (line.trim() === "")
          return <View key={token.index} style={{ height: 4 }} />;

        if (line.trim().startsWith("- ")) {
          const content = line.trim().slice(2);
          return (
            <View key={token.index} style={mdStyles.bulletRow}>
              <Text style={mdStyles.bulletDot}>•</Text>
              <InlineText text={content} colors={colors} />
            </View>
          );
        }

        const numberedMatch = line.trim().match(/^(\d+)\.\s+(.*)/);
        if (numberedMatch) {
          return (
            <View key={token.index} style={mdStyles.bulletRow}>
              <Text style={mdStyles.bulletDot}>{numberedMatch[1]}.</Text>
              <InlineText text={numberedMatch[2]} colors={colors} />
            </View>
          );
        }

        if (line.startsWith("    ") || line.startsWith("\t")) {
          return (
            <View key={token.index} style={mdStyles.codeLine}>
              <Text style={mdStyles.codeText}>{line.trim()}</Text>
            </View>
          );
        }

        if (
          line.startsWith("**") &&
          line.endsWith("**") &&
          !line.includes(" ")
        ) {
          return (
            <Text key={token.index} style={mdStyles.bold}>
              {line.slice(2, -2)}
            </Text>
          );
        }

        return <InlineText key={token.index} text={line} colors={colors} />;
      })}
    </View>
  );
}

function InlineText({ text, colors }: { text: string; colors: ThemeColors }) {
  const mdStyles = makeMdStyles(colors);
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <Text style={mdStyles.para}>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <AbbreviatedText
              key={i}
              text={part.slice(2, -2)}
              style={mdStyles.boldInline}
              bold
            />
          );
        }
        if (part.startsWith("`") && part.endsWith("`")) {
          return (
            <Text key={i} style={mdStyles.inlineCode}>
              {part.slice(1, -1)}
            </Text>
          );
        }
        return <AbbreviatedText key={i} text={part} />;
      })}
    </Text>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

function makeQuizStyles(colors: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.md,
      gap: spacing.sm,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.xs,
    },
    badge: {
      borderRadius: radius.full,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
    },
    badgeText: { fontSize: fontSize.xs, fontWeight: "700" },
    counter: { fontSize: fontSize.xs, color: colors.textMuted },
    question: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
      lineHeight: 20,
      marginBottom: spacing.xs,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      borderWidth: 1,
      borderRadius: radius.md,
      padding: spacing.sm + 2,
    },
    optionDot: {
      width: 18,
      height: 18,
      borderRadius: radius.full,
      borderWidth: 1.5,
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },
    dotFill: {
      width: 8,
      height: 8,
      borderRadius: radius.full,
    },
    optionText: { fontSize: fontSize.sm, flex: 1, lineHeight: 18 },
    explanation: {
      flexDirection: "row",
      gap: spacing.xs,
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.sm,
      padding: spacing.sm,
      marginTop: spacing.xs,
    },
    explanationText: {
      flex: 1,
      fontSize: fontSize.xs,
      color: colors.textMuted,
      lineHeight: 18,
    },
    actions: { marginTop: spacing.xs },
    actionBtn: {
      borderRadius: radius.md,
      paddingVertical: spacing.sm + 2,
      alignItems: "center",
    },
    actionText: { fontSize: fontSize.sm, fontWeight: "700" },
    resultCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.lg,
      alignItems: "center",
      gap: spacing.sm,
    },
    resultScore: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    resultLabel: { fontSize: fontSize.sm, color: colors.textMuted },
    resultActions: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    retryBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    readBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      borderWidth: 1,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    retryText: {
      fontSize: fontSize.sm,
      fontWeight: "700",
    },
    startPrompt: {
      borderWidth: 1,
      borderRadius: radius.lg,
      padding: spacing.md,
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.surface,
    },
    startPromptText: {
      fontSize: fontSize.xs,
      color: colors.textMuted,
      textAlign: "center",
    },
    startPromptBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      borderRadius: radius.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      marginTop: spacing.xs,
    },
    startPromptBtnText: {
      fontSize: fontSize.sm,
      fontWeight: "700",
      color: "#fff",
    },
  });
}

function makeTopicStyles(colors: ThemeColors) {
  return StyleSheet.create({
    startCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.lg,
      alignItems: "center",
      gap: spacing.sm,
    },
    startTitle: {
      fontSize: fontSize.lg,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    startSub: { fontSize: fontSize.sm, color: colors.textMuted },
    startBtn: {
      marginTop: spacing.sm,
      borderRadius: radius.md,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm + 2,
    },
    startBtnText: { fontSize: fontSize.md, fontWeight: "700", color: "#fff" },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.md,
      gap: spacing.sm,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    headerTitle: { fontSize: fontSize.sm, fontWeight: "700" },
    counter: { fontSize: fontSize.xs, color: colors.textMuted },
    progressBar: {
      height: 3,
      backgroundColor: colors.border,
      borderRadius: radius.full,
      overflow: "hidden",
    },
    progressFill: { height: 3, borderRadius: radius.full },
    question: {
      fontSize: fontSize.sm,
      fontWeight: "600",
      color: colors.textPrimary,
      lineHeight: 20,
      marginTop: spacing.xs,
      marginBottom: spacing.xs,
    },
    resultCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      borderWidth: 1,
      padding: spacing.lg,
      alignItems: "center",
      gap: spacing.sm,
    },
    resultPct: {
      fontSize: fontSize.xxxl,
      fontWeight: "800",
      color: colors.textPrimary,
    },
    resultScore: { fontSize: fontSize.md, color: colors.textMuted },
    resultLabel: { fontSize: fontSize.sm, fontWeight: "600" },
    resultGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
      justifyContent: "center",
      marginTop: spacing.xs,
    },
    resultDot: {
      width: 10,
      height: 10,
      borderRadius: radius.full,
    },
    retryBtn: {
      marginTop: spacing.sm,
      borderWidth: 1.5,
      borderRadius: radius.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    retryText: { fontSize: fontSize.sm, fontWeight: "700" },
  });
}

function makeMdStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
    codeContainer: {
      borderRadius: radius.sm,
      overflow: "hidden",
      marginVertical: 2,
    },
    codeInner: {
      padding: 10,
    },
    codeText: {
      fontFamily: "monospace",
      fontSize: 12,
      lineHeight: 18,
    },
    codeLine: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      marginVertical: 2,
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
}

function makeStyles(colors: ThemeColors) {
  return StyleSheet.create({
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
}
