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

  // Encryption & key management
  DEK: "Data Encryption Key — symmetric key that encrypts your actual data",
  CMK: "Customer Master Key — KMS key that encrypts/decrypts your data keys",
  "SSE-KMS":
    "Server-Side Encryption with KMS — AWS encrypts data at rest using a KMS-managed key",
  "SSE-S3":
    "Server-Side Encryption with S3-Managed Keys — AWS manages the encryption key entirely",
  "SSE-C":
    "Server-Side Encryption with Customer-Provided Keys — you supply the key on every request",
  "AES-256":
    "Advanced Encryption Standard (256-bit) — symmetric block cipher used by AWS for data at rest",
  BYOK: "Bring Your Own Key — import your own key material into KMS for regulatory compliance",
  WORM: "Write Once Read Many — immutable storage model preventing object modification or deletion",

  // Networking & infrastructure
  VPN: "Virtual Private Network — encrypted tunnel connecting your on-premises network to a VPC",
  CIDR: "Classless Inter-Domain Routing — notation (e.g. 10.0.0.0/16) for specifying IP address ranges",
  CNAME:
    "Canonical Name — DNS record that maps an alias to another domain name",
  IOPS: "Input/Output Operations Per Second — measure of storage throughput performance",
  IMDS: "Instance Metadata Service — EC2 endpoint (169.254.169.254) for retrieving instance metadata and credentials",
  POSIX:
    "Portable Operating System Interface — standard defining file system permissions and APIs (used by EFS)",

  // Identity & access
  SCP: "Service Control Policy — AWS Organizations policy that sets maximum permissions for member accounts",
  SSO: "Single Sign-On — allows users to authenticate once and access multiple systems",
  ABAC: "Attribute-Based Access Control — grant permissions based on tags/attributes rather than static roles",
  PKCE: "Proof Key for Code Exchange — OAuth 2.0 extension preventing authorization code interception attacks",
  RAM: "Resource Access Manager — AWS service for sharing resources across accounts",

  // Operations & storage
  PITR: "Point-In-Time Recovery — continuous backup that restores a table to any second within the retention window",
  SMS: "Simple Message Service (or Short Message Service) — text messaging via SNS mobile endpoints",
  EFO: "Enhanced Fan-Out — Kinesis Streams feature giving each consumer its own 2 MB/s read throughput",
  KCL: "Kinesis Client Library — Java library for building Kinesis consumer applications",
  KPL: "Kinesis Producer Library — library for efficiently batching records into Kinesis Data Streams",
  ORC: "Optimized Row Columnar — column-oriented file format used in data lakes for efficient analytics",

  // Security & web
  XSS: "Cross-Site Scripting — web attack that injects malicious scripts into pages viewed by other users",
  OWASP:
    "Open Web Application Security Project — community that maintains the Top 10 web vulnerability list",

  // Languages & formats
  HTML: "HyperText Markup Language — standard language for structuring web page content",
  NLU: "Natural Language Understanding — AI capability to interpret meaning and intent in human text",
  TTS: "Text-to-Speech — converts written text into spoken audio (used by Amazon Polly)",
  GZIP: "GNU Zip — lossless compression format; S3 and API Gateway support gzip-encoded responses",
  FIPS: "Federal Information Processing Standards — US government security standards for cryptographic modules",
  TOTP: "Time-Based One-Time Password — MFA method generating a 6-digit code that rotates every 30 seconds",
  CAPTCHA:
    "Completely Automated Public Turing test to tell Computers and Humans Apart — bot-detection challenge used by WAF",
  MQTT: "Message Queuing Telemetry Transport — lightweight pub/sub protocol for IoT devices (used by AWS IoT Core)",
  DMS: "Database Migration Service — migrates databases to AWS with minimal downtime",

  // Redis / ElastiCache commands (used in DVA guides)
  ZADD: "Sorted Set Add — Redis command to add members with scores to a sorted set",
  ZRANK:
    "Sorted Set Rank — Redis command to return the rank of a member in a sorted set",
  ZRANGE:
    "Sorted Set Range — Redis command to retrieve members by rank from a sorted set",
  LPUSH:
    "List Push Left — Redis command to prepend one or more values to a list",
  LLEN: "List Length — Redis command to return the number of elements in a list",
  HSET: "Hash Set — Redis command to set a field in a hash stored at a key",
  INCR: "Increment — Redis command to atomically increment an integer value",
  AOF: "Append-Only File — Redis persistence mode that logs every write operation",
  RDB: "Redis Database Backup — Redis point-in-time snapshot persistence format",

  // DVA-specific patterns
  WCU: "Write Capacity Unit — unit of DynamoDB write throughput (1 WCU = 1 KB/s)",
  RCU: "Read Capacity Unit — unit of DynamoDB read throughput (1 RCU = 4 KB/s strongly consistent)",
  A2A: "Application-to-Application — SNS messaging pattern between services",
  A2P: "Application-to-Person — SNS messaging pattern sending notifications to end users",
  FCM: "Firebase Cloud Messaging — Google's push notification service for Android",
  ADM: "Amazon Device Messaging — push notification service for Kindle Fire devices",
  APNS: "Apple Push Notification Service — Apple's push notification service for iOS/macOS",
  EMF: "Embedded Metrics Format — CloudWatch structured logging format for custom metrics from Lambda",
  SSH: "Secure Shell — encrypted protocol for remote command-line access to Linux servers",
  RDP: "Remote Desktop Protocol — graphical remote access protocol for Windows servers",
  PII: "Personally Identifiable Information — data that can identify a specific individual",
  WAR: "Web Application Archive — Java deployment package containing a web app",
  JAR: "Java ARchive — Java deployment package containing compiled class files",
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
