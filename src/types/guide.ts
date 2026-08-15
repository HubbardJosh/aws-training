import { Domain } from "./index";

export interface GuideSection {
  heading: string;
  body: string; // markdown-lite: supports **bold**, `code`, bullet lines starting with "- "
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
}
