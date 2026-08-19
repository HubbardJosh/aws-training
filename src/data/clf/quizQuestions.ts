import { QuizQuestion } from "../../types";

export const quizQuestions: QuizQuestion[] = [
  // ─── EC2 ────────────────────────────────────────────────────────────────────
  {
    id: "clf-qq-1",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A startup wants to run a web server for an unpredictable workload with no upfront commitment. Which EC2 purchasing option is BEST?",
    options: [
      "On-Demand Instances",
      "Reserved Instances",
      "Spot Instances",
      "Dedicated Hosts",
    ],
    correctIndices: [0],
    explanation:
      "On-Demand Instances let you pay by the second with no upfront commitment or long-term contract, making them ideal for unpredictable workloads. Reserved Instances require a 1- or 3-year commitment. Spot Instances can be interrupted. Dedicated Hosts are for compliance/licensing needs.",
    tags: ["ec2", "pricing", "on-demand"],
  },
  {
    id: "clf-qq-2",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which EC2 purchasing option provides the LARGEST discount (up to 90%) compared to On-Demand pricing but can be interrupted with a 2-minute warning?",
    options: [
      "Spot Instances",
      "Reserved Instances",
      "Savings Plans",
      "Dedicated Instances",
    ],
    correctIndices: [0],
    explanation:
      "Spot Instances use spare AWS capacity and can provide up to 90% savings over On-Demand pricing. The trade-off is that AWS can reclaim them with a 2-minute warning when capacity is needed elsewhere. They are best for fault-tolerant, flexible workloads like batch processing.",
    tags: ["ec2", "spot", "pricing"],
  },
  {
    id: "clf-qq-3",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company runs a database on EC2 that must be available 24/7 for the next 3 years. Which purchasing option gives the MOST cost savings?",
    options: [
      "Reserved Instances (3-year, all upfront)",
      "On-Demand Instances",
      "Spot Instances",
      "Dedicated Hosts (on-demand)",
    ],
    correctIndices: [0],
    explanation:
      "Reserved Instances with a 3-year all-upfront commitment provide the maximum discount — up to 72% compared to On-Demand. For steady-state, predictable workloads running around the clock, Reserved Instances are the most cost-effective choice. Spot Instances are not suitable for databases that require continuous availability.",
    tags: ["ec2", "reserved", "cost-optimization"],
  },
  {
    id: "clf-qq-4",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which EC2 instance family is optimized for memory-intensive workloads such as in-memory databases and real-time big-data analytics?",
    options: [
      "Memory Optimized (R family)",
      "Compute Optimized (C family)",
      "Storage Optimized (I family)",
      "General Purpose (T family)",
    ],
    correctIndices: [0],
    explanation:
      "Memory Optimized instances (R, X, and z series) are designed for workloads that process large datasets in memory, such as in-memory databases (Redis, SAP HANA) and real-time analytics. Compute Optimized suits CPU-bound tasks, Storage Optimized suits high-IOPS workloads, and General Purpose balances CPU/memory/network.",
    tags: ["ec2", "instance-families", "memory"],
  },
  {
    id: "clf-qq-5",
    service: "Amazon EC2",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "Which EC2 feature acts as a virtual firewall controlling inbound and outbound traffic at the instance level?",
    options: ["Security Groups", "Network ACLs", "IAM Roles", "VPC Flow Logs"],
    correctIndices: [0],
    explanation:
      "Security Groups act as stateful virtual firewalls at the EC2 instance level, controlling which traffic is allowed in and out. They are stateful — if you allow inbound traffic, the return traffic is automatically allowed. Network ACLs operate at the subnet level and are stateless.",
    tags: ["ec2", "security-groups", "networking"],
  },
  {
    id: "clf-qq-6",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "What is the key difference between EBS (Elastic Block Store) and EC2 instance store storage?",
    options: [
      "EBS is persistent and survives instance stop/termination; instance store is ephemeral and lost when the instance stops",
      "Instance store is persistent; EBS is ephemeral",
      "EBS can only be used with dedicated hosts",
      "Instance store provides higher durability than EBS",
    ],
    correctIndices: [0],
    explanation:
      "EBS volumes are network-attached persistent storage that survive instance stops and can be detached and reattached. Instance store is physically attached to the host and is ephemeral — data is lost when the instance stops, terminates, or fails. Instance store offers higher throughput but no persistence.",
    tags: ["ec2", "ebs", "instance-store", "storage"],
  },
  {
    id: "clf-qq-7",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to automatically add EC2 instances when CPU exceeds 80% and remove them when it drops below 40%. Which AWS feature enables this?",
    options: [
      "EC2 Auto Scaling",
      "Elastic Load Balancing",
      "AWS Lambda",
      "Amazon CloudWatch Alarms",
    ],
    correctIndices: [0],
    explanation:
      "EC2 Auto Scaling automatically adjusts the number of EC2 instances in response to demand, using scaling policies tied to CloudWatch metrics. It ensures you have the right number of instances at all times — scaling out when load increases and scaling in when it decreases to optimize cost.",
    tags: ["ec2", "auto-scaling", "elasticity"],
  },
  {
    id: "clf-qq-8",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "A company needs EC2 instances for a regulatory workload that requires dedicated physical servers and the ability to use existing per-socket software licenses. Which TWO purchasing options meet these requirements?",
    options: [
      "Dedicated Hosts",
      "Dedicated Instances",
      "Reserved Instances",
      "Spot Instances",
      "On-Demand Instances",
    ],
    correctIndices: [0, 1],
    explanation:
      "Dedicated Hosts provide a physical server fully dedicated to your use, giving visibility into sockets and cores for license management. Dedicated Instances run on hardware dedicated to a single customer but do not provide socket/core visibility for BYOL licensing. Both satisfy physical isolation requirements.",
    tags: ["ec2", "dedicated-hosts", "dedicated-instances", "compliance"],
  },

  // ─── S3 ─────────────────────────────────────────────────────────────────────
  {
    id: "clf-qq-9",
    service: "Amazon S3",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is the durability guarantee of Amazon S3 Standard storage?",
    options: [
      "99.999999999% (11 nines)",
      "99.99% (four nines)",
      "99.9% (three nines)",
      "99% (two nines)",
    ],
    correctIndices: [0],
    explanation:
      "Amazon S3 is designed for 99.999999999% (11 nines) durability by redundantly storing data across multiple devices and Availability Zones. This means that on average, you would expect to lose a single object once every 10,000 years if you stored 10 million objects.",
    tags: ["s3", "durability", "storage"],
  },
  {
    id: "clf-qq-10",
    service: "Amazon S3",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to host a static website (HTML, CSS, JavaScript) at low cost with no servers to manage. Which AWS service is BEST suited?",
    options: [
      "Amazon S3 static website hosting",
      "Amazon EC2 with Apache",
      "AWS Elastic Beanstalk",
      "Amazon Lightsail",
    ],
    correctIndices: [0],
    explanation:
      "Amazon S3 supports static website hosting directly from a bucket. You simply enable the feature, upload your files, and configure the bucket policy for public access. There are no servers to manage, and you pay only for storage and data transfer — making it the lowest-cost option for static content.",
    tags: ["s3", "static-website", "hosting"],
  },
  {
    id: "clf-qq-11",
    service: "Amazon S3",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "An application stores log files in S3. The logs are accessed frequently for the first 30 days, then rarely after that. Which storage class combination minimizes cost?",
    options: [
      "S3 Standard for 30 days, then transition to S3 Standard-IA",
      "S3 Glacier for all objects from the start",
      "S3 Standard for all objects",
      "S3 One Zone-IA from the start",
    ],
    correctIndices: [0],
    explanation:
      "S3 Lifecycle policies can automatically transition objects to cheaper storage classes as they age. S3 Standard-IA (Infrequent Access) costs less than Standard for storage but charges a retrieval fee, making it cost-effective for objects accessed rarely after the initial period. Glacier would add retrieval latency that may be unacceptable even for infrequent access.",
    tags: ["s3", "storage-classes", "lifecycle", "cost"],
  },
  {
    id: "clf-qq-12",
    service: "Amazon S3",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which S3 storage class automatically moves data between frequent and infrequent access tiers based on changing access patterns, with no retrieval fees?",
    options: [
      "S3 Intelligent-Tiering",
      "S3 Standard-IA",
      "S3 One Zone-IA",
      "S3 Glacier Flexible Retrieval",
    ],
    correctIndices: [0],
    explanation:
      "S3 Intelligent-Tiering monitors access patterns and automatically moves objects between a frequent-access tier and a lower-cost infrequent-access tier. There are no retrieval charges and no minimum storage duration penalties when objects are moved between tiers, making it ideal for data with unknown or changing access patterns.",
    tags: ["s3", "intelligent-tiering", "storage-classes"],
  },
  {
    id: "clf-qq-13",
    service: "Amazon S3",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A company accidentally deleted critical files from an S3 bucket. Which S3 feature would have PREVENTED permanent data loss?",
    options: [
      "S3 Versioning",
      "S3 Replication",
      "S3 Lifecycle policies",
      "S3 Transfer Acceleration",
    ],
    correctIndices: [0],
    explanation:
      "S3 Versioning keeps multiple versions of every object. When versioning is enabled, a delete operation adds a delete marker rather than permanently removing the object, so you can restore previous versions. Without versioning, deleted objects cannot be recovered.",
    tags: ["s3", "versioning", "data-protection"],
  },
  {
    id: "clf-qq-14",
    service: "Amazon S3",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "Which S3 storage class is MOST cost-effective for archiving compliance data that must be retained for 7 years and will almost never be accessed, but must be retrievable within 12 hours?",
    options: [
      "S3 Glacier Flexible Retrieval",
      "S3 Standard",
      "S3 Standard-IA",
      "S3 Glacier Instant Retrieval",
    ],
    correctIndices: [0],
    explanation:
      "S3 Glacier Flexible Retrieval (formerly S3 Glacier) is designed for long-term archiving where data is rarely accessed. It offers retrieval times from minutes to hours (including a free bulk retrieval option of 5-12 hours) at a very low storage cost — ideal for compliance archives with a 12-hour retrieval tolerance.",
    tags: ["s3", "glacier", "archival", "compliance"],
  },
  {
    id: "clf-qq-15",
    service: "Amazon S3",
    domain: "security",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO mechanisms can be used to control access to objects in an Amazon S3 bucket?",
    options: [
      "S3 Bucket Policies",
      "IAM Policies",
      "Security Groups",
      "Network ACLs",
      "Route 53 Health Checks",
    ],
    correctIndices: [0, 1],
    explanation:
      "S3 access is controlled by bucket policies (resource-based policies attached to the bucket) and IAM policies (identity-based policies attached to users/roles). Security Groups and Network ACLs apply to VPC resources and EC2 instances, not S3. Route 53 health checks are for DNS routing, not S3 authorization.",
    tags: ["s3", "bucket-policy", "iam", "access-control"],
  },

  // ─── RDS ────────────────────────────────────────────────────────────────────
  {
    id: "clf-qq-16",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which of the following is a key benefit of Amazon RDS compared to running a database on a self-managed EC2 instance?",
    options: [
      "AWS handles patching, backups, and hardware provisioning automatically",
      "RDS supports any custom database engine",
      "RDS provides unlimited storage at no extra cost",
      "RDS instances cannot be stopped to save cost",
    ],
    correctIndices: [0],
    explanation:
      "Amazon RDS is a managed service — AWS handles undifferentiated heavy lifting such as hardware provisioning, database setup, patching, and automated backups. This reduces operational burden compared to self-managing a database on EC2, where you are responsible for all of these tasks.",
    tags: ["rds", "managed-service", "benefits"],
  },
  {
    id: "clf-qq-17",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants their RDS database to automatically failover to a standby replica in another Availability Zone if the primary instance fails. Which feature should they enable?",
    options: [
      "Multi-AZ deployment",
      "Read Replicas",
      "Automated backups",
      "Enhanced Monitoring",
    ],
    correctIndices: [0],
    explanation:
      "RDS Multi-AZ maintains a synchronous standby replica in a different Availability Zone. In case of primary instance failure, RDS automatically fails over to the standby with minimal downtime — typically 1-2 minutes. Read Replicas are for read scaling, not automatic failover.",
    tags: ["rds", "multi-az", "high-availability", "failover"],
  },
  {
    id: "clf-qq-18",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A reporting application generates heavy read traffic that is slowing down the production RDS database. What is the BEST solution to offload read traffic?",
    options: [
      "Create an RDS Read Replica and point reporting queries to it",
      "Enable Multi-AZ on the existing instance",
      "Increase the RDS instance size (scale up)",
      "Move the database to DynamoDB",
    ],
    correctIndices: [0],
    explanation:
      "RDS Read Replicas create asynchronous copies of the primary database that can serve read traffic, offloading SELECT queries from the primary instance. Multi-AZ is for failover/availability, not read scaling. Scaling up helps but doesn't distribute the load. Migrating to DynamoDB is a major architectural change.",
    tags: ["rds", "read-replica", "scaling", "performance"],
  },
  {
    id: "clf-qq-19",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which of the following database engines is supported by Amazon RDS? (Choose the BEST answer)",
    options: [
      "MySQL, PostgreSQL, Oracle, SQL Server, and MariaDB",
      "MySQL and DynamoDB only",
      "Only Amazon Aurora",
      "MongoDB and Cassandra",
    ],
    correctIndices: [0],
    explanation:
      "Amazon RDS supports six database engines: MySQL, PostgreSQL, MariaDB, Oracle, Microsoft SQL Server, and Amazon Aurora. DynamoDB is a separate NoSQL service. MongoDB and Cassandra are not supported by RDS (though DocumentDB is compatible with MongoDB).",
    tags: ["rds", "database-engines", "managed"],
  },
  {
    id: "clf-qq-20",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "How long does Amazon RDS retain automated backups by default, and what is the maximum retention period?",
    options: [
      "Default 7 days; maximum 35 days",
      "Default 1 day; maximum 7 days",
      "Default 30 days; maximum 90 days",
      "Default 7 days; maximum 7 days",
    ],
    correctIndices: [0],
    explanation:
      "RDS automated backups are enabled by default with a 7-day retention period. You can configure the retention period from 0 (disabled) to 35 days. The backups enable point-in-time recovery within the retention window. Manual DB snapshots are retained until explicitly deleted.",
    tags: ["rds", "backups", "retention"],
  },
  {
    id: "clf-qq-21",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A company needs a MySQL-compatible relational database that automatically scales storage and provides up to 5x throughput of standard MySQL. Which AWS service should they choose?",
    options: [
      "Amazon Aurora",
      "Amazon RDS for MySQL",
      "Amazon DynamoDB",
      "Amazon Redshift",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Aurora is a MySQL and PostgreSQL-compatible relational database built for the cloud. It automatically scales storage in 10 GB increments up to 128 TB and provides up to 5x the throughput of standard MySQL on similar hardware. Aurora is part of the RDS service family but uses a cloud-native architecture.",
    tags: ["rds", "aurora", "mysql", "performance"],
  },

  // ─── DynamoDB ───────────────────────────────────────────────────────────────
  {
    id: "clf-qq-22",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question: "What type of database is Amazon DynamoDB?",
    options: [
      "Fully managed NoSQL key-value and document database",
      "Managed relational SQL database",
      "In-memory caching database",
      "Graph database",
    ],
    correctIndices: [0],
    explanation:
      "DynamoDB is a fully managed NoSQL database service that supports both key-value and document data models. It is serverless — you do not provision or manage servers. It is not a relational database and does not use SQL for queries.",
    tags: ["dynamodb", "nosql", "managed"],
  },
  {
    id: "clf-qq-23",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "What is the read/write latency that DynamoDB is designed to deliver at any scale?",
    options: [
      "Single-digit millisecond latency",
      "Sub-second latency (under 1 second)",
      "Under 10 milliseconds",
      "Microsecond latency",
    ],
    correctIndices: [0],
    explanation:
      "DynamoDB is designed to deliver consistent single-digit millisecond latency at any scale. This is one of its core value propositions. For even faster reads (microsecond), you can add DynamoDB Accelerator (DAX), an in-memory cache.",
    tags: ["dynamodb", "latency", "performance"],
  },
  {
    id: "clf-qq-24",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A gaming company needs a DynamoDB table replicated across three AWS regions so players worldwide experience low-latency reads and writes. Which feature enables this?",
    options: [
      "DynamoDB Global Tables",
      "DynamoDB Streams",
      "DynamoDB Accelerator (DAX)",
      "DynamoDB On-Demand capacity",
    ],
    correctIndices: [0],
    explanation:
      "DynamoDB Global Tables provide fully managed, multi-region, multi-active replication. Any region can accept writes and changes are propagated to all other replica regions, enabling low-latency access for globally distributed applications. DynamoDB Streams capture change events but don't replicate across regions by themselves.",
    tags: ["dynamodb", "global-tables", "multi-region"],
  },
  {
    id: "clf-qq-25",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "An application reads the same DynamoDB items thousands of times per second, causing high read capacity consumption. Which solution adds microsecond caching in front of DynamoDB?",
    options: [
      "DynamoDB Accelerator (DAX)",
      "Amazon ElastiCache",
      "Amazon CloudFront",
      "AWS Global Accelerator",
    ],
    correctIndices: [0],
    explanation:
      "DAX (DynamoDB Accelerator) is an in-memory cache fully compatible with DynamoDB APIs that delivers microsecond response times for read-heavy workloads. It sits in front of DynamoDB and requires no application changes beyond pointing to the DAX endpoint instead of DynamoDB directly.",
    tags: ["dynamodb", "dax", "caching", "performance"],
  },
  {
    id: "clf-qq-26",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "Which DynamoDB capacity mode should a company choose when they cannot predict their application's read/write traffic in advance?",
    options: [
      "On-Demand capacity mode",
      "Provisioned capacity mode with Auto Scaling",
      "Reserved capacity",
      "Burst capacity",
    ],
    correctIndices: [0],
    explanation:
      "DynamoDB On-Demand capacity mode automatically scales to accommodate any request volume without capacity planning. You pay per request rather than for provisioned capacity. It is ideal for unpredictable or spiky workloads where you cannot accurately forecast throughput requirements.",
    tags: ["dynamodb", "on-demand", "capacity", "serverless"],
  },
  {
    id: "clf-qq-27",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO features of DynamoDB make it suitable for a serverless, globally distributed application?",
    options: [
      "Global Tables for multi-region replication",
      "On-Demand capacity with no server management",
      "Support for complex JOIN queries",
      "Automatic schema migrations",
      "Built-in relational integrity constraints",
    ],
    correctIndices: [0, 1],
    explanation:
      "DynamoDB Global Tables enable multi-region, multi-active replication for global low-latency access. On-Demand capacity mode means you never provision servers or capacity — it is fully serverless. DynamoDB does not support SQL JOINs, does not perform automatic schema migrations, and does not enforce relational integrity constraints.",
    tags: ["dynamodb", "global-tables", "serverless", "on-demand"],
  },

  // ─── Lambda ─────────────────────────────────────────────────────────────────
  {
    id: "clf-qq-28",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question: "What is the core characteristic of AWS Lambda's compute model?",
    options: [
      "Serverless — you upload code and AWS runs it without managing servers",
      "You must provision and manage EC2 instances to run Lambda functions",
      "Lambda runs only inside a VPC and requires a NAT gateway",
      "Lambda functions run indefinitely until manually stopped",
    ],
    correctIndices: [0],
    explanation:
      "Lambda is a serverless compute service. You provide your function code, and AWS handles all infrastructure management — servers, operating system patches, scaling, and availability. You pay only when your code runs, with no charge when it is idle.",
    tags: ["lambda", "serverless", "compute"],
  },
  {
    id: "clf-qq-29",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "What is the maximum execution timeout for an AWS Lambda function?",
    options: ["15 minutes", "5 minutes", "1 hour", "30 minutes"],
    correctIndices: [0],
    explanation:
      "AWS Lambda functions have a maximum execution timeout of 15 minutes (900 seconds). If your workload takes longer, you should consider Step Functions for orchestration, ECS/Fargate for longer-running containers, or breaking the work into smaller Lambda invocations.",
    tags: ["lambda", "timeout", "limits"],
  },
  {
    id: "clf-qq-30",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "Which of the following can trigger an AWS Lambda function? (Choose the MOST comprehensive answer)",
    options: [
      "API Gateway HTTP requests, S3 object events, DynamoDB Streams, SQS messages, CloudWatch Events",
      "Only API Gateway and S3",
      "Only SNS and SQS",
      "Only CloudWatch Events (scheduled triggers)",
    ],
    correctIndices: [0],
    explanation:
      "Lambda supports a wide range of event sources as triggers, including API Gateway, S3, DynamoDB Streams, SQS, SNS, Kinesis, CloudWatch Events/EventBridge, Cognito, and more. This broad integration makes Lambda a central piece of event-driven architectures.",
    tags: ["lambda", "triggers", "event-driven"],
  },
  {
    id: "clf-qq-31",
    service: "AWS Lambda",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question: "How does AWS Lambda pricing work?",
    options: [
      "Pay per number of requests and duration of execution (GB-seconds)",
      "Pay a flat monthly fee regardless of usage",
      "Pay per hour the function is deployed, whether or not it runs",
      "Pay only for memory allocated, not for actual invocations",
    ],
    correctIndices: [0],
    explanation:
      "Lambda pricing has two components: the number of requests (first 1 million requests per month are free) and the duration of execution measured in GB-seconds (memory allocated × execution time). You pay nothing when your code is not running, making it highly cost-efficient for sporadic workloads.",
    tags: ["lambda", "pricing", "billing"],
  },
  {
    id: "clf-qq-32",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to run a nightly batch process at 2:00 AM UTC to generate reports. Which is the SIMPLEST way to trigger a Lambda function on this schedule?",
    options: [
      "Amazon EventBridge (CloudWatch Events) scheduled rule",
      "An EC2 cron job that calls the Lambda API",
      "An SQS queue with a message sent manually each night",
      "A CloudFormation custom resource",
    ],
    correctIndices: [0],
    explanation:
      "Amazon EventBridge (formerly CloudWatch Events) supports cron and rate expressions to trigger Lambda functions on a schedule — no additional infrastructure needed. You simply create a rule with a cron expression and set the Lambda function as the target.",
    tags: ["lambda", "eventbridge", "scheduling", "cron"],
  },
  {
    id: "clf-qq-33",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "hard",
    type: "single",
    question:
      "A Lambda function needs read access to an S3 bucket. What is the correct and MOST secure way to grant this access?",
    options: [
      "Attach an IAM execution role to the Lambda function with an S3 read policy",
      "Embed AWS access keys in the Lambda function's environment variables",
      "Make the S3 bucket fully public",
      "Create an IAM user and store the credentials in the function code",
    ],
    correctIndices: [0],
    explanation:
      "The correct approach is to create an IAM role with the necessary S3 read permissions and assign it as the Lambda execution role. Lambda assumes this role when executing and receives temporary credentials automatically — no static credentials are needed. Embedding access keys or using IAM users with static credentials is a security anti-pattern.",
    tags: ["lambda", "iam", "security", "execution-role"],
  },
];
