import { Domain } from "./index";

export interface GuideQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface GuideSection {
  heading: string;
  body: string; // markdown-lite: supports **bold**, `code`, bullet lines starting with "- "
  quiz?: GuideQuizQuestion[];
}

export interface ServiceGuide {
  id: string;
  service: string;
  domain: Domain;
  tagline: string;
  /** One-line "what it is" */
  intro: string;
  sections: GuideSection[];
  keyFacts: string[]; // short bullets for quick reference
  relatedServices: string[];
  examTips: string[];
  topicQuiz?: GuideQuizQuestion[];
}
