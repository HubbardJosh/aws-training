import { ServiceGuide } from "../../../types/guide";
import { ec2Guide } from "./ec2";
import { s3Guide } from "./s3";
import { vpcGuide } from "./vpc";
import { rdsGuide } from "./rds";
import { dynamodbGuide } from "./dynamodb";
import { iamGuide } from "./iam";
import { elbGuide } from "./elb";
import { autoscalingGuide } from "./autoscaling";
import { cloudfrontGuide } from "./cloudfront";
import { route53Guide } from "./route53";
import { lambdaGuide } from "./lambda";
import { sqsGuide } from "./sqs";
import { snsGuide } from "./sns";
import { cloudwatchGuide } from "./cloudwatch";
import { cloudformationGuide } from "./cloudformation";
import { elasticacheGuide } from "./elasticache";
import { efsGuide } from "./efs";
import { glacierGuide } from "./glacier";
import { kinesisGuide } from "./kinesis";
import { wafGuide } from "./waf";

export const allGuides: ServiceGuide[] = [
  // Deployment
  ec2Guide,
  vpcGuide,
  elbGuide,
  autoscalingGuide,
  cloudformationGuide,
  // Services
  s3Guide,
  rdsGuide,
  cloudfrontGuide,
  route53Guide,
  elasticacheGuide,
  efsGuide,
  glacierGuide,
  // Development
  dynamodbGuide,
  lambdaGuide,
  kinesisGuide,
  // Applications
  sqsGuide,
  snsGuide,
  // Security
  iamGuide,
  wafGuide,
  // Troubleshooting
  cloudwatchGuide,
];

export const guidesByDomain = allGuides.reduce<Record<string, ServiceGuide[]>>(
  (acc, guide) => {
    if (!acc[guide.domain]) acc[guide.domain] = [];
    acc[guide.domain].push(guide);
    return acc;
  },
  {},
);
