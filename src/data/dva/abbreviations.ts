export const DVA_ABBREVIATIONS: Record<string, string> = {
  // Core compute & containers
  EC2: "Elastic Compute Cloud — virtual server instances",
  ECS: "Elastic Container Service — managed Docker container orchestration",
  EKS: "Elastic Kubernetes Service — managed Kubernetes cluster service",
  ECR: "Elastic Container Registry — Docker image storage and management",
  EBS: "Elastic Block Store — persistent block storage volumes for EC2",
  EFS: "Elastic File System — scalable NFS file storage for multiple EC2s",
  AMI: "Amazon Machine Image — template used to launch EC2 instances",
  ASG: "Auto Scaling Group — automatically adjusts EC2 fleet size",
  ALB: "Application Load Balancer — Layer 7 HTTP/HTTPS load balancer",
  NLB: "Network Load Balancer — Layer 4 TCP/UDP ultra-low-latency load balancer",
  ELB: "Elastic Load Balancing — distributes traffic across instances",

  // Serverless
  SAM: "Serverless Application Model — framework for serverless apps using CloudFormation",
  SNS: "Simple Notification Service — pub/sub messaging and mobile push",
  SQS: "Simple Queue Service — managed message queuing service",
  SES: "Simple Email Service — email sending and receiving service",

  // Storage & databases
  S3: "Simple Storage Service — object storage with 99.999999999% durability",
  RDS: "Relational Database Service — managed SQL databases (MySQL, PostgreSQL, etc.)",
  DDB: "DynamoDB — fully managed NoSQL key-value and document database",
  DAX: "DynamoDB Accelerator — in-memory cache for DynamoDB (microsecond reads)",
  TTL: "Time To Live — automatic item expiry in DynamoDB",
  GSI: "Global Secondary Index — DynamoDB index with different partition/sort key",
  LSI: "Local Secondary Index — DynamoDB index sharing the partition key",
  ElastiCache: "ElastiCache — managed Redis or Memcached caching layer",

  // Networking & CDN
  VPC: "Virtual Private Cloud — isolated network environment in AWS",
  IGW: "Internet Gateway — allows VPC resources to communicate with the internet",
  NAT: "Network Address Translation — lets private subnet resources reach the internet",
  NACL: "Network Access Control List — stateless subnet-level firewall",
  SG: "Security Group — stateful instance-level virtual firewall",
  CF: "CloudFront — global CDN with edge locations for low-latency delivery",
  CDN: "Content Delivery Network — caches content at edge locations worldwide",
  DNS: "Domain Name System — translates domain names to IP addresses",
  ACM: "AWS Certificate Manager — provision and manage SSL/TLS certificates",
  WAF: "Web Application Firewall — filters malicious HTTP requests",

  // IAM & security
  IAM: "Identity and Access Management — control who can do what in AWS",
  MFA: "Multi-Factor Authentication — extra verification step beyond password",
  ARN: "Amazon Resource Name — globally unique identifier for any AWS resource",
  KMS: "Key Management Service — create and control encryption keys",
  SSE: "Server-Side Encryption — AWS encrypts data at rest on your behalf",
  SSM: "Systems Manager — operational data and automation for AWS resources",
  "SSM Parameter Store":
    "Systems Manager Parameter Store — secure hierarchical storage for config and secrets",
  STS: "Security Token Service — issues temporary AWS credentials",
  SAML: "Security Assertion Markup Language — open standard for federated SSO",
  OIDC: "OpenID Connect — identity layer on top of OAuth 2.0",
  ACL: "Access Control List — rules specifying which principals can access a resource",
  RBAC: "Role-Based Access Control — permissions assigned to roles, not individuals",

  // Deployment & CI/CD
  CI: "Continuous Integration — automated build and test on each code commit",
  CD: "Continuous Deployment — automated release to production after passing tests",
  CodePipeline: "AWS CodePipeline — fully managed CI/CD pipeline orchestration",
  CodeBuild:
    "AWS CodeBuild — managed build service that compiles, tests, and packages",
  CodeDeploy:
    "AWS CodeDeploy — automates code deployments to EC2, Lambda, or ECS",
  CodeCommit: "AWS CodeCommit — managed private Git repository",
  CodeArtifact:
    "AWS CodeArtifact — managed package repository (npm, Maven, PyPI, etc.)",
  CFN: "CloudFormation — infrastructure-as-code using JSON/YAML templates",
  CDK: "Cloud Development Kit — define AWS infrastructure using code (TypeScript, Python, etc.)",
  SAR: "Serverless Application Repository — share and deploy serverless apps",
  EB: "Elastic Beanstalk — PaaS that automatically handles deployment, scaling, and monitoring",

  // Observability & monitoring
  CW: "CloudWatch — monitoring, logging, and alerting for AWS resources",
  "CW Logs": "CloudWatch Logs — centralised log storage and search",
  "CW Metrics":
    "CloudWatch Metrics — time-series data points for AWS resources",
  "CW Alarms":
    "CloudWatch Alarms — trigger actions when a metric crosses a threshold",
  "CW Events": "CloudWatch Events — respond to changes in AWS resource state",
  EB2: "EventBridge — serverless event bus connecting AWS services and SaaS apps",
  EventBridge:
    "EventBridge — serverless event bus connecting AWS services and SaaS apps",
  XRay: "AWS X-Ray — distributed tracing for analysing and debugging applications",
  "X-Ray":
    "AWS X-Ray — distributed tracing for analysing and debugging applications",

  // API & integration
  APIGW:
    "API Gateway — fully managed service to create, publish, and secure APIs",
  REST: "Representational State Transfer — stateless API architecture using HTTP",
  HTTP: "HyperText Transfer Protocol — foundation of data communication on the web",
  HTTPS: "HTTP Secure — HTTP encrypted with TLS/SSL",
  WebSocket: "WebSocket — bidirectional persistent connection protocol",
  gRPC: "gRPC Remote Procedure Call — high-performance RPC framework by Google",
  SDK: "Software Development Kit — libraries and tools for a specific platform or service",
  CLI: "Command Line Interface — text-based tool for interacting with AWS (aws CLI)",

  // Streaming & analytics
  Kinesis: "Amazon Kinesis — real-time data streaming and analytics platform",
  KDS: "Kinesis Data Streams — ingest and process real-time streaming data",
  KDF: "Kinesis Data Firehose — load streaming data into S3, Redshift, or Elasticsearch",
  KDA: "Kinesis Data Analytics — run SQL or Flink on streaming data",
  MSK: "Managed Streaming for Apache Kafka — fully managed Kafka service",
  EMR: "Elastic MapReduce — managed big-data framework (Hadoop, Spark)",
  Athena: "Amazon Athena — serverless interactive SQL query over S3 data",

  // Machine learning & AI
  SageMaker:
    "Amazon SageMaker — fully managed ML build, train, and deploy platform",
  Rekognition:
    "Amazon Rekognition — image and video analysis using deep learning",
  Comprehend: "Amazon Comprehend — NLP service for text insights and sentiment",
  Lex: "Amazon Lex — build conversational chatbots (powers Alexa)",
  Polly: "Amazon Polly — text-to-speech service",
  Transcribe: "Amazon Transcribe — automatic speech-to-text",
  Translate: "Amazon Translate — neural machine translation",

  // General cloud concepts
  AZ: "Availability Zone — isolated data centre location within an AWS Region",
  HA: "High Availability — design ensuring minimal downtime",
  DR: "Disaster Recovery — strategies to recover from catastrophic failures",
  RPO: "Recovery Point Objective — maximum tolerable data loss (time)",
  RTO: "Recovery Time Objective — maximum tolerable downtime after a failure",
  SLA: "Service Level Agreement — contractual uptime/performance commitments",
  SLO: "Service Level Objective — internal target for reliability or latency",
  TCO: "Total Cost of Ownership — full lifetime cost of a technology choice",
  IaC: "Infrastructure as Code — managing infrastructure through version-controlled config files",
  PaaS: "Platform as a Service — cloud model where provider manages the underlying platform",
  IaaS: "Infrastructure as a Service — cloud model where you manage OS and above",
  FaaS: "Function as a Service — serverless compute (Lambda) billed per invocation",
  SaaS: "Software as a Service — fully managed application delivered over the internet",
  BYOL: "Bring Your Own License — use existing software licences on AWS",
  PoLP: "Principle of Least Privilege — grant only the minimum permissions required",

  // Protocols & standards
  TCP: "Transmission Control Protocol — reliable, ordered network communication",
  UDP: "User Datagram Protocol — fast, connectionless network communication",
  TLS: "Transport Layer Security — cryptographic protocol for secure network communication",
  SSL: "Secure Sockets Layer — predecessor to TLS; term still commonly used",
  JWT: "JSON Web Token — compact, URL-safe token for authentication and claims",
  OAuth: "Open Authorisation — open standard for access delegation",
  CORS: "Cross-Origin Resource Sharing — browser security policy for cross-domain requests",
  JSON: "JavaScript Object Notation — lightweight data-interchange format",
  YAML: "YAML Ain't Markup Language — human-readable data serialisation format",
  XML: "Extensible Markup Language — tag-based data format",
  CSV: "Comma-Separated Values — tabular data as plain text",
  gzip: "GNU zip — lossless data compression format",

  // DVA-specific patterns
  DLQ: "Dead-Letter Queue — holds messages that failed processing after max retries",
  FIFO: "First In, First Out — ordering guarantee where the oldest message is processed first",
  LIFO: "Last In, First Out — ordering where the newest item is processed first",
  TTI: "Time to Interactive — performance metric for when a page becomes usable",
  OAC: "Origin Access Control — CloudFront mechanism to restrict direct S3 bucket access",
  OAI: "Origin Access Identity — legacy CloudFront mechanism to restrict S3 access",
  VTL: "Velocity Template Language — used in API Gateway mapping templates",
  VPC_EP:
    "VPC Endpoint — private connection from VPC to AWS services without internet",
  VPCE: "VPC Endpoint — private connection from VPC to AWS services without internet",
  ENI: "Elastic Network Interface — virtual network card attachable to an EC2 instance",
  EIP: "Elastic IP Address — static public IPv4 address for dynamic cloud computing",
  RI: "Reserved Instance — discounted EC2 pricing in exchange for 1- or 3-year commitment",
  SP: "Savings Plan — flexible discount in exchange for $/hr spend commitment",
  SPOT: "Spot Instance — spare EC2 capacity at up to 90% discount, interruptible",
  CRR: "Cross-Region Replication — automatically replicate S3 objects across regions",
  SRR: "Same-Region Replication — replicate S3 objects within the same region",
  MFA_DEL:
    "MFA Delete — requires MFA to permanently delete versioned S3 objects",
  ACE: "API Cache Encryption — encrypts data stored in API Gateway cache",

  // Exam shorthand
  DVA: "AWS Certified Developer – Associate (DVA-C02)",
  SAA: "AWS Certified Solutions Architect – Associate",
  SAP: "AWS Certified Solutions Architect – Professional",
  CLF: "AWS Certified Cloud Practitioner (CLF-C02)",
  AIF: "AWS Certified AI Practitioner",
  DOA: "AWS Certified DevOps Engineer – Professional",
};
