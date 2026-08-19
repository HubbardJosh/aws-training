import { ServiceGuide } from "../../../types/guide";
import { ec2Guide } from "./ec2";
import { s3Guide } from "./s3";
import { vpcGuide } from "./vpc";
import { rdsGuide } from "./rds";
import { iamGuide } from "./iam";
import { cloudfrontGuide } from "./cloudfront";
import { lambdaGuide } from "./lambda";
import { dynamodbGuide } from "./dynamodb";
import { snsGuide } from "./sns";
import { sqsGuide } from "./sqs";
import { cloudwatchGuide } from "./cloudwatch";
import { cloudformationGuide } from "./cloudformation";
import { ecsGuide } from "./ecs";
import { elasticBeanstalkGuide } from "./elasticbeanstalk";
import { pricingGuide } from "./pricing";
import { supportPlansGuide } from "./supportPlans";
import { sharedResponsibilityGuide } from "./sharedResponsibility";
import { wellArchitectedGuide } from "./wellArchitected";
import { globalInfrastructureGuide } from "./globalInfrastructure";
import { route53Guide } from "./route53";

export const allGuides: ServiceGuide[] = [
  // Development
  lambdaGuide,
  s3Guide,
  dynamodbGuide,
  rdsGuide,
  snsGuide,
  sqsGuide,
  cloudfrontGuide,
  route53Guide,
  // Security
  iamGuide,
  sharedResponsibilityGuide,
  // Deployment
  ec2Guide,
  vpcGuide,
  cloudwatchGuide,
  cloudformationGuide,
  ecsGuide,
  elasticBeanstalkGuide,
  // Troubleshooting / Foundational
  pricingGuide,
  supportPlansGuide,
  wellArchitectedGuide,
  globalInfrastructureGuide,
];

export const guidesByDomain = {
  development: allGuides.filter((g) => g.domain === "development"),
  security: allGuides.filter((g) => g.domain === "security"),
  deployment: allGuides.filter((g) => g.domain === "deployment"),
  troubleshooting: allGuides.filter((g) => g.domain === "troubleshooting"),
};

export { ServiceGuide };
