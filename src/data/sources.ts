import { CertificationId } from "../context/CertContext";

export interface Source {
  title: string;
  url: string;
  topics: string[];
}

export interface CertSources {
  certId: CertificationId;
  sources: Source[];
}

export const SOURCES: CertSources[] = [
  {
    certId: "clf-c02",
    sources: [
      {
        title: "AWS Certified Cloud Practitioner – Exam Guide (CLF-C02)",
        url: "https://d1.awsstatic.com/training-and-certification/docs-cloud-practitioner/AWS-Certified-Cloud-Practitioner_Exam-Guide.pdf",
        topics: [
          "Exam domains and weightings",
          "Scope of services tested",
          "Passing score and format",
        ],
      },
      {
        title: "AWS Support Plans",
        url: "https://aws.amazon.com/premiumsupport/plans/",
        topics: [
          "Basic, Developer, Business, Enterprise On-Ramp, Enterprise tiers",
          "Response time SLAs per severity",
          "Trusted Advisor access by plan",
          "TAM availability",
        ],
      },
      {
        title: "AWS Pricing – How AWS Pricing Works",
        url: "https://docs.aws.amazon.com/whitepapers/latest/how-aws-pricing-works/how-aws-pricing-works.pdf",
        topics: [
          "Pay-as-you-go, Save when you commit, Pay less by using more",
          "EC2 pricing models (On-Demand, Reserved, Spot, Savings Plans)",
          "S3 storage class pricing",
          "Data transfer costs",
        ],
      },
      {
        title: "AWS Global Infrastructure",
        url: "https://aws.amazon.com/about-aws/global-infrastructure/",
        topics: [
          "Regions, Availability Zones, Local Zones",
          "Edge locations and CloudFront POPs",
          "AWS Wavelength and Outposts",
        ],
      },
      {
        title: "Amazon EC2 – User Guide",
        url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/concepts.html",
        topics: [
          "Instance types and families",
          "On-Demand, Reserved, Spot, Dedicated pricing models",
          "EC2 Auto Scaling",
          "Elastic Load Balancing",
        ],
      },
      {
        title: "AWS IAM – User Guide",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
        topics: [
          "Users, groups, roles, policies",
          "Policy evaluation logic",
          "MFA and least-privilege",
          "IAM Identity Center (SSO)",
        ],
      },
      {
        title: "Amazon S3 – User Guide",
        url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/Welcome.html",
        topics: [
          "Storage classes (Standard, IA, Glacier tiers, Intelligent-Tiering)",
          "Versioning and lifecycle policies",
          "S3 Transfer Acceleration",
          "Cross-region replication",
        ],
      },
      {
        title: "Amazon VPC – User Guide",
        url: "https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html",
        topics: [
          "Subnets, route tables, internet gateways",
          "Security groups vs. NACLs",
          "VPC Peering and Transit Gateway",
          "VPN and Direct Connect",
        ],
      },
      {
        title: "Amazon RDS – User Guide",
        url: "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Welcome.html",
        topics: [
          "Supported database engines",
          "Multi-AZ vs. Read Replicas",
          "Automated backups and snapshots",
          "Amazon Aurora",
        ],
      },
      {
        title: "Amazon DynamoDB – Developer Guide",
        url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
        topics: [
          "Partition keys and sort keys",
          "On-demand vs. provisioned capacity",
          "DynamoDB Streams and global tables",
          "DAX caching",
        ],
      },
      {
        title: "AWS Lambda – Developer Guide",
        url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        topics: [
          "Serverless execution model",
          "Triggers and event sources",
          "Concurrency and cold starts",
          "Pricing (requests + duration)",
        ],
      },
      {
        title: "Amazon CloudWatch – User Guide",
        url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        topics: [
          "Metrics, alarms, and dashboards",
          "CloudWatch Logs",
          "CloudWatch Events / EventBridge",
          "Container Insights",
        ],
      },
      {
        title: "AWS CloudFormation – User Guide",
        url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
        topics: [
          "Infrastructure as Code concepts",
          "Templates, stacks, and change sets",
          "Rollback behavior",
          "StackSets for multi-account deployments",
        ],
      },
      {
        title: "Amazon CloudFront – Developer Guide",
        url: "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/Introduction.html",
        topics: [
          "CDN and edge caching",
          "Origins and distributions",
          "Cache behaviors and TTLs",
          "OAC / OAI for S3 origin security",
        ],
      },
      {
        title: "Amazon Route 53 – Developer Guide",
        url: "https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html",
        topics: [
          "DNS routing policies (Simple, Weighted, Latency, Failover, Geolocation)",
          "Health checks",
          "Domain registration",
          "Private hosted zones",
        ],
      },
      {
        title: "Amazon SNS – Developer Guide",
        url: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html",
        topics: [
          "Pub/sub messaging",
          "Topics and subscriptions",
          "Fan-out pattern",
          "Mobile push notifications",
        ],
      },
      {
        title: "Amazon SQS – Developer Guide",
        url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
        topics: [
          "Standard vs. FIFO queues",
          "Visibility timeout and dead-letter queues",
          "Long polling",
          "Message retention and size limits",
        ],
      },
      {
        title: "Amazon ECS – Developer Guide",
        url: "https://docs.aws.amazon.com/AmazonECS/latest/developerguide/Welcome.html",
        topics: [
          "Tasks, services, and clusters",
          "EC2 launch type vs. Fargate",
          "Task definitions and IAM task roles",
          "Service Auto Scaling",
        ],
      },
      {
        title: "AWS Elastic Beanstalk – Developer Guide",
        url: "https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/Welcome.html",
        topics: [
          "PaaS managed deployment",
          "Supported platforms",
          "Deployment policies (Rolling, Blue/Green)",
          "Environment tiers (Web vs. Worker)",
        ],
      },
      {
        title: "AWS Well-Architected Framework",
        url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html",
        topics: [
          "Six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability",
          "Design principles per pillar",
          "Well-Architected Tool",
        ],
      },
      {
        title: "AWS Shared Responsibility Model",
        url: "https://aws.amazon.com/compliance/shared-responsibility-model/",
        topics: [
          "Security OF the cloud (AWS responsibility)",
          "Security IN the cloud (customer responsibility)",
          "Variation by service type (IaaS, PaaS, SaaS)",
        ],
      },
    ],
  },
  {
    certId: "dva-c02",
    sources: [
      {
        title: "AWS Certified Developer – Associate Exam Guide (DVA-C02)",
        url: "https://d1.awsstatic.com/training-and-certification/docs-dev-associate/AWS-Certified-Developer-Associate_Exam-Guide.pdf",
        topics: [
          "Exam domains and weightings",
          "Scope of services tested",
          "Passing score and format",
        ],
      },
      {
        title: "AWS Lambda – Developer Guide",
        url: "https://docs.aws.amazon.com/lambda/latest/dg/welcome.html",
        topics: [
          "Handler, context, and event objects",
          "Concurrency, reserved concurrency, provisioned concurrency",
          "Layers and extensions",
          "Lambda@Edge",
        ],
      },
      {
        title: "Amazon DynamoDB – Developer Guide",
        url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Introduction.html",
        topics: [
          "Partition key design and hot partitions",
          "GSIs and LSIs",
          "Conditional writes and transactions",
          "DynamoDB Streams",
        ],
      },
      {
        title: "Amazon API Gateway – Developer Guide",
        url: "https://docs.aws.amazon.com/apigateway/latest/developerguide/welcome.html",
        topics: [
          "REST vs. HTTP vs. WebSocket APIs",
          "Authorizers (Lambda, Cognito)",
          "Caching and throttling",
          "Deployment stages and canary releases",
        ],
      },
      {
        title: "AWS CodeDeploy – User Guide",
        url: "https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html",
        topics: [
          "In-place, Blue/Green, Canary, Linear deployment strategies",
          "AppSpec file",
          "Deployment groups and hooks",
        ],
      },
      {
        title: "AWS CodeBuild – User Guide",
        url: "https://docs.aws.amazon.com/codebuild/latest/userguide/welcome.html",
        topics: [
          "Build environments and buildspec.yml",
          "Artifacts and caching",
          "Integration with CodePipeline",
        ],
      },
      {
        title: "AWS CodePipeline – User Guide",
        url: "https://docs.aws.amazon.com/codepipeline/latest/userguide/welcome.html",
        topics: [
          "Pipeline stages: Source, Build, Test, Deploy",
          "Action types and providers",
          "Manual approval actions",
        ],
      },
      {
        title: "Amazon Cognito – Developer Guide",
        url: "https://docs.aws.amazon.com/cognito/latest/developerguide/what-is-amazon-cognito.html",
        topics: [
          "User Pools vs. Identity Pools",
          "JWT tokens (ID, Access, Refresh)",
          "Hosted UI and OAuth 2.0 flows",
          "Federation with external IdPs",
        ],
      },
      {
        title: "AWS X-Ray – Developer Guide",
        url: "https://docs.aws.amazon.com/xray/latest/devguide/aws-xray.html",
        topics: [
          "Traces, segments, and subsegments",
          "Service map",
          "Sampling rules",
          "Integration with Lambda, API Gateway, ECS",
        ],
      },
      {
        title: "AWS KMS – Developer Guide",
        url: "https://docs.aws.amazon.com/kms/latest/developerguide/overview.html",
        topics: [
          "CMKs, data keys, and envelope encryption",
          "Key policies and grants",
          "Automatic key rotation",
          "KMS with S3, DynamoDB, and Secrets Manager",
        ],
      },
      {
        title: "AWS Secrets Manager – User Guide",
        url: "https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html",
        topics: [
          "Secret storage and retrieval",
          "Automatic rotation with Lambda",
          "Integration with RDS, Redshift, DocumentDB",
        ],
      },
      {
        title: "Amazon SQS – Developer Guide",
        url: "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/welcome.html",
        topics: [
          "Standard vs. FIFO queues",
          "Visibility timeout and DLQs",
          "Long polling and batch operations",
          "SQS as Lambda trigger",
        ],
      },
      {
        title: "Amazon SNS – Developer Guide",
        url: "https://docs.aws.amazon.com/sns/latest/dg/welcome.html",
        topics: [
          "Fan-out architecture",
          "Message filtering",
          "SNS to SQS integration",
        ],
      },
      {
        title: "Amazon Kinesis – Developer Guide",
        url: "https://docs.aws.amazon.com/streams/latest/dev/introduction.html",
        topics: [
          "Kinesis Data Streams shards and partition keys",
          "Kinesis Data Firehose delivery streams",
          "Kinesis Data Analytics",
          "Enhanced fan-out",
        ],
      },
      {
        title: "AWS SAM – Developer Guide",
        url: "https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html",
        topics: [
          "SAM template syntax",
          "sam build, sam deploy, sam local",
          "AWS::Serverless resource types",
        ],
      },
      {
        title: "AWS CloudFormation – User Guide",
        url: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/Welcome.html",
        topics: [
          "Intrinsic functions and pseudo-parameters",
          "Nested stacks and cross-stack references",
          "Custom resources",
          "Change sets and drift detection",
        ],
      },
      {
        title: "Amazon ElastiCache – User Guide",
        url: "https://docs.aws.amazon.com/AmazonElastiCache/latest/red-ug/WhatIs.html",
        topics: [
          "Redis vs. Memcached",
          "Caching strategies (Lazy Loading, Write-Through)",
          "Cluster mode and replication groups",
          "Session state caching",
        ],
      },
      {
        title: "AWS Step Functions – Developer Guide",
        url: "https://docs.aws.amazon.com/step-functions/latest/dg/welcome.html",
        topics: [
          "Standard vs. Express workflows",
          "State types: Task, Choice, Wait, Parallel, Map",
          "Error handling and retries",
          "SDK integrations",
        ],
      },
      {
        title: "Amazon EventBridge – User Guide",
        url: "https://docs.aws.amazon.com/eventbridge/latest/userguide/eb-what-is.html",
        topics: [
          "Event buses (default, custom, partner)",
          "Rules and targets",
          "Event patterns and content filtering",
          "Scheduler",
        ],
      },
      {
        title: "AWS IAM – User Guide",
        url: "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html",
        topics: [
          "IAM roles for services and cross-account access",
          "Resource-based policies",
          "Permission boundaries",
          "STS and AssumeRole",
        ],
      },
      {
        title: "Amazon CloudWatch – User Guide",
        url: "https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html",
        topics: [
          "Custom metrics and EMF",
          "Metric filters on log groups",
          "Composite alarms",
          "CloudWatch Synthetics",
        ],
      },
    ],
  },
  {
    certId: "aif-c01",
    sources: [
      {
        title: "AWS Certified AI Practitioner – Exam Guide (AIF-C01)",
        url: "https://d1.awsstatic.com/training-and-certification/docs-ai-practitioner/AWS-Certified-AI-Practitioner_Exam-Guide.pdf",
        topics: [
          "Exam domains and weightings",
          "Scope of AI/ML services tested",
          "Passing score and format",
        ],
      },
      {
        title: "Amazon Bedrock – User Guide",
        url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html",
        topics: [
          "Foundation models and model providers",
          "Agents for Bedrock",
          "Knowledge Bases (RAG)",
          "Guardrails and responsible AI",
        ],
      },
      {
        title: "Amazon SageMaker – Developer Guide",
        url: "https://docs.aws.amazon.com/sagemaker/latest/dg/whatis.html",
        topics: [
          "Training jobs and hyperparameter tuning",
          "Model deployment and endpoints",
          "SageMaker Studio and Notebooks",
          "Built-in algorithms",
        ],
      },
      {
        title: "Amazon Q – User Guide",
        url: "https://docs.aws.amazon.com/amazonq/latest/qbusiness-ug/what-is.html",
        topics: [
          "Amazon Q Business vs. Amazon Q Developer",
          "Connecting data sources",
          "Access controls and relevance filtering",
        ],
      },
      {
        title: "AWS Responsible AI – Overview",
        url: "https://aws.amazon.com/machine-learning/responsible-ai/",
        topics: [
          "Fairness, explainability, privacy, robustness",
          "SageMaker Clarify for bias detection",
          "Model cards",
        ],
      },
      {
        title: "Amazon Rekognition – Developer Guide",
        url: "https://docs.aws.amazon.com/rekognition/latest/dg/what-is.html",
        topics: [
          "Image and video analysis",
          "Face detection and comparison",
          "Content moderation",
          "Custom labels",
        ],
      },
      {
        title: "Amazon Comprehend – Developer Guide",
        url: "https://docs.aws.amazon.com/comprehend/latest/dg/what-is.html",
        topics: [
          "Entity recognition and sentiment analysis",
          "Custom classifiers and entity recognizers",
          "PII detection and redaction",
        ],
      },
      {
        title: "Amazon Transcribe – Developer Guide",
        url: "https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html",
        topics: [
          "Automatic speech recognition (ASR)",
          "Custom vocabularies and language models",
          "Medical transcription",
        ],
      },
      {
        title: "Amazon Polly – Developer Guide",
        url: "https://docs.aws.amazon.com/polly/latest/dg/what-is.html",
        topics: [
          "Text-to-speech synthesis",
          "Standard vs. Neural voices",
          "SSML support",
        ],
      },
      {
        title: "Amazon Lex – Developer Guide",
        url: "https://docs.aws.amazon.com/lexv2/latest/dg/what-is.html",
        topics: [
          "Intents, slots, and utterances",
          "Bot building and deployment",
          "Integration with Lambda for fulfillment",
        ],
      },
      {
        title: "Amazon Kendra – Developer Guide",
        url: "https://docs.aws.amazon.com/kendra/latest/dg/what-is-kendra.html",
        topics: [
          "Intelligent enterprise search",
          "Data source connectors",
          "Relevance tuning",
        ],
      },
      {
        title: "Amazon Personalize – Developer Guide",
        url: "https://docs.aws.amazon.com/personalize/latest/dg/what-is-personalize.html",
        topics: [
          "Recipes and recommendation algorithms",
          "Interaction data and cold-start handling",
          "Real-time and batch recommendations",
        ],
      },
      {
        title: "Amazon Translate – Developer Guide",
        url: "https://docs.aws.amazon.com/translate/latest/dg/what-is.html",
        topics: [
          "Neural machine translation (NMT)",
          "Custom Terminology for brand names",
          "Real-time vs. batch translation",
        ],
      },
      {
        title: "Amazon Textract – Developer Guide",
        url: "https://docs.aws.amazon.com/textract/latest/dg/what-is.html",
        topics: [
          "Form and table extraction",
          "Queries API for targeted field extraction",
          "Async jobs with S3 and SNS",
        ],
      },
      {
        title: "Amazon Forecast – Developer Guide",
        url: "https://docs.aws.amazon.com/forecast/latest/dg/what-is-forecast.html",
        topics: [
          "Time-series forecasting and DeepAR+ algorithm",
          "Related time series and item metadata",
          "AWS Weather Index integration",
        ],
      },
      {
        title: "AWS Panorama – Developer Guide",
        url: "https://docs.aws.amazon.com/panorama/latest/dev/panorama-welcome.html",
        topics: [
          "Edge computer vision on existing camera networks",
          "Panorama appliance and SDK",
          "Deploying models from SageMaker to the edge",
        ],
      },
      {
        title: "AWS Trainium and Inferentia – Overview",
        url: "https://aws.amazon.com/machine-learning/trainium/",
        topics: [
          "Custom ML chips for training (Trainium) and inference (Inferentia)",
          "Cost and performance advantages",
          "Neuron SDK",
        ],
      },
      {
        title: "ML Fundamentals – AWS Machine Learning Blog",
        url: "https://aws.amazon.com/blogs/machine-learning/",
        topics: [
          "Supervised, unsupervised, and reinforcement learning concepts",
          "Model evaluation metrics",
          "Overfitting, underfitting, and regularization",
        ],
      },
    ],
  },
];
