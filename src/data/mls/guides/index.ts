import { ServiceGuide } from "../../../types/guide";
import { sagemakerGuide } from "./sagemaker";
import { s3MlGuide } from "./s3-ml";
import { glueGuide } from "./glue";
import { kinesisGuide } from "./kinesis";
import { emrGuide } from "./emr";
import { rekognitionGuide } from "./rekognition";
import { comprehendGuide } from "./comprehend";
import { translateGuide } from "./translate";
import { pollyTranscribeGuide } from "./polly-transcribe";
import { forecastGuide } from "./forecast";
import { personalizeGuide } from "./personalize";
import { lakeFormationGuide } from "./lake-formation";
import { athenaGuide } from "./athena";
import { redshiftGuide } from "./redshift";
import { dataPreparationGuide } from "./data-preparation";
import { modelTrainingGuide } from "./model-training";
import { modelEvaluationGuide } from "./model-evaluation";
import { modelDeploymentGuide } from "./model-deployment";
import { mlSecurityGuide } from "./ml-security";
import { mlopsGuide } from "./mlops";

export const allGuides: ServiceGuide[] = [
  // Services — AWS ML Services
  sagemakerGuide,
  s3MlGuide,
  glueGuide,
  kinesisGuide,
  emrGuide,
  rekognitionGuide,
  comprehendGuide,
  translateGuide,
  pollyTranscribeGuide,
  forecastGuide,
  personalizeGuide,
  lakeFormationGuide,
  athenaGuide,
  redshiftGuide,
  // Fundamentals — ML Concepts
  dataPreparationGuide,
  modelTrainingGuide,
  modelEvaluationGuide,
  // Deployment — MLOps & Deployment
  modelDeploymentGuide,
  mlopsGuide,
  // Security
  mlSecurityGuide,
];

export const guidesByDomain = allGuides.reduce<Record<string, ServiceGuide[]>>(
  (acc, guide) => {
    if (!acc[guide.domain]) acc[guide.domain] = [];
    acc[guide.domain].push(guide);
    return acc;
  },
  {},
);
