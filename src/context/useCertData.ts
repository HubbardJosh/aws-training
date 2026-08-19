import { useCert } from "./CertContext";
import { allGuides as dvaGuides } from "../data/dva/guides";
import { flashcards as dvaFlashcards } from "../data/dva/flashcards";
import { quizQuestions as dvaQuizQuestions } from "../data/dva/quizQuestions";
import { allGuides as clfGuides } from "../data/clf/guides";
import { flashcards as clfFlashcards } from "../data/clf/flashcards";
import { quizQuestions as clfQuizQuestions } from "../data/clf/quizQuestions";
import { allGuides as aifGuides } from "../data/aif/guides";
import { flashcards as aifFlashcards } from "../data/aif/flashcards";
import { quizQuestions as aifQuizQuestions } from "../data/aif/quizQuestions";

export function useCertData() {
  const { certId } = useCert();

  switch (certId) {
    case "clf-c02":
      return {
        guides: clfGuides,
        flashcards: clfFlashcards,
        quizQuestions: clfQuizQuestions,
      };
    case "aif-c01":
      return {
        guides: aifGuides,
        flashcards: aifFlashcards,
        quizQuestions: aifQuizQuestions,
      };
    default:
      return {
        guides: dvaGuides,
        flashcards: dvaFlashcards,
        quizQuestions: dvaQuizQuestions,
      };
  }
}
