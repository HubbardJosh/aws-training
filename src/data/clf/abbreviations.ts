export const CLF_ABBREVIATIONS: Record<string, string> = {
  // Core compute
  EC2: "Elastic Compute Cloud — virtual server instances in the cloud",
  ECS: "Elastic Container Service — managed Docker container orchestration",
  EKS: "Elastic Kubernetes Service — managed Kubernetes cluster service",
  ECR: "Elastic Container Registry — Docker image storage and management",
  EBS: "Elastic Block Store — persistent block storage for EC2 instances",
  EFS: "Elastic File System — scalable NFS shared file storage",
  AMI: "Amazon Machine Image — template used to launch EC2 instances",
  ASG: "Auto Scaling Group — automatically adjusts EC2 fleet size to demand",
  ALB: "Application Load Balancer — Layer 7 HTTP/HTTPS load balancer",
  NLB: "Network Load Balancer — Layer 4 TCP/UDP ultra-low-latency load balancer",
  ELB: "Elastic Load Balancing — distributes incoming traffic across instances",
  EB: "Elastic Beanstalk — PaaS that handles deployment, scaling, and monitoring",

  // Storage
  S3: "Simple Storage Service — object storage with 99.999999999% durability",
  RDS: "Relational Database Service — managed SQL databases (MySQL, PostgreSQL, etc.)",
  DDB: "DynamoDB — fully managed serverless NoSQL key-value database",
  ElastiCache: "ElastiCache — managed in-memory caching (Redis or Memcached)",

  // Networking & CDN
  VPC: "Virtual Private Cloud — logically isolated network in AWS",
  IGW: "Internet Gateway — connects a VPC to the public internet",
  NAT: "Network Address Translation — lets private subnets reach the internet",
  NACL: "Network Access Control List — stateless subnet-level firewall rules",
  SG: "Security Group — stateful instance-level virtual firewall",
  CF: "CloudFront — global CDN with hundreds of edge locations",
  CDN: "Content Delivery Network — caches content close to end users worldwide",
  DNS: "Domain Name System — translates human-readable domain names to IP addresses",
  ACM: "AWS Certificate Manager — provision and manage SSL/TLS certificates for free",
  WAF: "Web Application Firewall — filters common web exploits from HTTP traffic",
  Route53:
    "Amazon Route 53 — scalable cloud DNS and domain registration service",

  // IAM & security
  IAM: "Identity and Access Management — controls who can access which AWS resources",
  MFA: "Multi-Factor Authentication — extra login verification beyond a password",
  ARN: "Amazon Resource Name — globally unique identifier for any AWS resource",
  KMS: "Key Management Service — create and manage encryption keys",
  SSE: "Server-Side Encryption — AWS encrypts data at rest on your behalf",
  SSM: "Systems Manager — operational management and automation for AWS resources",
  STS: "Security Token Service — issues short-lived temporary AWS credentials",
  ACL: "Access Control List — rules that specify which users can access a resource",
  PoLP: "Principle of Least Privilege — grant only the minimum permissions needed",

  // Deployment & management
  CFN: "CloudFormation — infrastructure-as-code using JSON or YAML templates",
  CDK: "Cloud Development Kit — define AWS infrastructure in code (TypeScript, Python, etc.)",
  CW: "CloudWatch — monitoring, logging, and alerting for AWS resources",
  SNS: "Simple Notification Service — pub/sub messaging and mobile push notifications",
  SQS: "Simple Queue Service — fully managed message queuing service",

  // Cloud concepts
  AZ: "Availability Zone — isolated data centre within an AWS Region",
  HA: "High Availability — architecture that minimises downtime",
  DR: "Disaster Recovery — strategies to recover from major failures",
  RPO: "Recovery Point Objective — maximum acceptable data loss measured in time",
  RTO: "Recovery Time Objective — maximum acceptable downtime after a failure",
  SLA: "Service Level Agreement — contractual uptime and performance commitments",
  TCO: "Total Cost of Ownership — full cost of a technology over its lifetime",
  IaC: "Infrastructure as Code — managing infrastructure through version-controlled config",
  PaaS: "Platform as a Service — provider manages the platform; you manage the app",
  IaaS: "Infrastructure as a Service — you manage OS and above; provider manages hardware",
  FaaS: "Function as a Service — serverless compute (Lambda) billed per invocation",
  SaaS: "Software as a Service — fully managed application delivered over the internet",
  BYOL: "Bring Your Own License — use existing software licences on AWS infrastructure",

  // Pricing & support
  RI: "Reserved Instance — up to 72% discount in exchange for 1- or 3-year commitment",
  SP: "Savings Plan — flexible discount in exchange for a $/hr spend commitment",
  SPOT: "Spot Instance — spare EC2 capacity at up to 90% discount, can be interrupted",
  PAYG: "Pay As You Go — AWS billing model where you pay only for what you use",
  TAM: "Technical Account Manager — dedicated AWS advisor for Enterprise Support customers",

  // Shared responsibility
  AWS: "Amazon Web Services — the cloud platform providing 200+ services globally",

  // Protocols & standards
  TLS: "Transport Layer Security — cryptographic protocol securing network communication",
  SSL: "Secure Sockets Layer — predecessor to TLS; term still widely used",
  HTTPS: "HTTP Secure — HTTP encrypted with TLS/SSL",
  HTTP: "HyperText Transfer Protocol — foundation of data communication on the web",
  JSON: "JavaScript Object Notation — lightweight, human-readable data format",
  YAML: "YAML Ain't Markup Language — human-readable data serialisation format",

  // Well-Architected pillars (CLF loves these)
  OE: "Operational Excellence — running and monitoring systems to deliver business value",
  REL: "Reliability — recovering from failures and meeting demand dynamically",
  PERF: "Performance Efficiency — using resources efficiently as requirements change",
  COST: "Cost Optimisation — avoiding unnecessary costs and getting best value",
  SEC: "Security — protecting information, systems, and assets appropriately",
  SUS: "Sustainability — minimising environmental impact of running cloud workloads",

  // Exam shorthand
  CLF: "AWS Certified Cloud Practitioner (CLF-C02)",
  DVA: "AWS Certified Developer – Associate (DVA-C02)",
  SAA: "AWS Certified Solutions Architect – Associate",
  AIF: "AWS Certified AI Practitioner (AIF-C01)",
};
