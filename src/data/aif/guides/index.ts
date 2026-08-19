import { ServiceGuide } from "../../../types/guide";
import { bedrockGuide } from "./bedrock";
import { sagemakerGuide } from "./sagemaker";
import { rekognitionGuide } from "./rekognition";
import { comprehendGuide } from "./comprehend";
import { lexGuide } from "./lex";
import { pollyGuide } from "./polly";
import { transcribeGuide } from "./transcribe";
import { translateGuide } from "./translate";
import { textractGuide } from "./textract";
import { personalizeGuide } from "./personalize";
import { mlFundamentalsGuide } from "./mlFundamentals";
import { responsibleAIGuide } from "./responsibleAI";
import { generativeAIGuide } from "./generativeAI";
import { amazonQGuide } from "./amazonQ";
import { trainiumInferentiaGuide } from "./trainiumInferentia";
import { kendraGuide } from "./kendra";
import { panoramaGuide } from "./panorama";
import { aiSecurityGuide } from "./aiSecurity";
import { forecastGuide } from "./forecast";

export const allGuides: ServiceGuide[] = [
  // Development
  bedrockGuide,
  sagemakerGuide,
  rekognitionGuide,
  comprehendGuide,
  lexGuide,
  pollyGuide,
  transcribeGuide,
  translateGuide,
  textractGuide,
  personalizeGuide,
  mlFundamentalsGuide,
  generativeAIGuide,
  amazonQGuide,
  kendraGuide,
  forecastGuide,
  // Security
  responsibleAIGuide,
  aiSecurityGuide,
  // Deployment
  trainiumInferentiaGuide,
  panoramaGuide,
];

export const guidesByDomain = {
  development: allGuides.filter((g) => g.domain === "development"),
  security: allGuides.filter((g) => g.domain === "security"),
  deployment: allGuides.filter((g) => g.domain === "deployment"),
  troubleshooting: allGuides.filter((g) => g.domain === "troubleshooting"),
};

export { ServiceGuide };
