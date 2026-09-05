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
      "Reserved Instances",
      "Spot Instances",
      "On-Demand Instances",
      "Dedicated Hosts",
    ],
    correctIndices: [2],
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
      "Dedicated Hosts (on-demand)",
      "Reserved Instances (3-year, all upfront)",
      "Spot Instances",
      "On-Demand Instances",
    ],
    correctIndices: [1],
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
      "Storage Optimized (I family)",
      "Memory Optimized (R family)",
      "Compute Optimized (C family)",
      "General Purpose (T family)",
    ],
    correctIndices: [1],
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
    options: ["IAM Roles", "Network ACLs", "Security Groups", "VPC Flow Logs"],
    correctIndices: [2],
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
      "Instance store is persistent; EBS is ephemeral",
      "EBS is persistent and survives instance stop/termination; instance store is ephemeral and lost when the instance stops",
      "Instance store provides higher durability than EBS",
      "EBS can only be used with dedicated hosts",
    ],
    correctIndices: [1],
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
    type: "single",
    question:
      "A company needs EC2 instances for a regulatory workload that requires dedicated physical servers and the ability to use existing per-socket software licenses. Which purchasing option meets these requirements?",
    options: [
      "Dedicated Hosts",
      "Dedicated Instances",
      "Reserved Instances",
      "Spot Instances",
    ],
    correctIndices: [0],
    explanation:
      "Dedicated Hosts provide a physical server fully dedicated to your use, giving visibility into sockets, cores, and host ID — which is required for per-socket or per-core BYOL software licensing. Dedicated Instances run on hardware dedicated to a single customer but do NOT provide socket/core visibility and therefore cannot satisfy per-socket BYOL licensing requirements.",
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
      "99.9% (three nines)",
      "99.99% (four nines)",
      "99.999999999% (11 nines)",
      "99% (two nines)",
    ],
    correctIndices: [2],
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
      "AWS Elastic Beanstalk",
      "Amazon Lightsail",
      "Amazon EC2 with Apache",
      "Amazon S3 static website hosting",
    ],
    correctIndices: [3],
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
      "S3 Standard for all objects",
      "S3 One Zone-IA from the start",
      "S3 Standard for 30 days, then transition to S3 Standard-IA",
      "S3 Glacier for all objects from the start",
    ],
    correctIndices: [2],
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
      "S3 One Zone-IA",
      "S3 Standard-IA",
      "S3 Intelligent-Tiering",
      "S3 Glacier Flexible Retrieval",
    ],
    correctIndices: [2],
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
      "S3 Transfer Acceleration",
      "S3 Lifecycle policies",
      "S3 Replication",
      "S3 Versioning",
    ],
    correctIndices: [3],
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
      "S3 Standard-IA",
      "S3 Glacier Instant Retrieval",
      "S3 Standard",
      "S3 Glacier Flexible Retrieval",
    ],
    correctIndices: [3],
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
      "RDS supports any custom database engine",
      "RDS instances cannot be stopped to save cost",
      "RDS provides unlimited storage at no extra cost",
      "AWS handles patching, backups, and hardware provisioning automatically",
    ],
    correctIndices: [3],
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
      "Automated backups",
      "Enhanced Monitoring",
      "Read Replicas",
      "Multi-AZ deployment",
    ],
    correctIndices: [3],
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
      "Move the database to DynamoDB",
      "Create an RDS Read Replica and point reporting queries to it",
      "Increase the RDS instance size (scale up)",
      "Enable Multi-AZ on the existing instance",
    ],
    correctIndices: [1],
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
      "MongoDB and Cassandra",
      "Only Amazon Aurora",
      "MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Amazon Aurora, and IBM Db2",
      "MySQL and DynamoDB only",
    ],
    correctIndices: [2],
    explanation:
      "Amazon RDS supports seven database engines: MySQL, PostgreSQL, MariaDB, Oracle, Microsoft SQL Server, Amazon Aurora, and IBM Db2. DynamoDB is a separate NoSQL service. MongoDB and Cassandra are not supported by RDS (though DocumentDB is compatible with MongoDB).",
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
      "Amazon DynamoDB",
      "Amazon RDS for MySQL",
      "Amazon Redshift",
      "Amazon Aurora",
    ],
    correctIndices: [3],
    explanation:
      "Amazon Aurora is a MySQL and PostgreSQL-compatible relational database built for the cloud. It automatically scales storage up to 128 TiB and provides up to 5x the throughput of standard MySQL on similar hardware. Aurora is part of the RDS service family but uses a cloud-native architecture.",
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
      "In-memory caching database",
      "Fully managed NoSQL key-value and document database",
      "Managed relational SQL database",
      "Graph database",
    ],
    correctIndices: [1],
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
      "Microsecond latency",
      "Under 10 milliseconds",
      "Single-digit millisecond latency",
      "Sub-second latency (under 1 second)",
    ],
    correctIndices: [2],
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
      "Amazon CloudFront",
      "AWS Global Accelerator",
      "DynamoDB Accelerator (DAX)",
      "Amazon ElastiCache",
    ],
    correctIndices: [2],
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
      "Lambda runs only inside a VPC and requires a NAT gateway",
      "Lambda functions run indefinitely until manually stopped",
      "You must provision and manage EC2 instances to run Lambda functions",
      "Serverless — you upload code and AWS runs it without managing servers",
    ],
    correctIndices: [3],
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
    options: ["5 minutes", "30 minutes", "15 minutes", "1 hour"],
    correctIndices: [2],
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
      "Pay only for memory allocated, not for actual invocations",
      "Pay per hour the function is deployed, whether or not it runs",
      "Pay per number of requests and duration of execution (GB-seconds)",
      "Pay a flat monthly fee regardless of usage",
    ],
    correctIndices: [2],
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
      "A CloudFormation custom resource",
      "An EC2 cron job that calls the Lambda API",
      "An SQS queue with a message sent manually each night",
      "Amazon EventBridge (CloudWatch Events) scheduled rule",
    ],
    correctIndices: [3],
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
      "Create an IAM user and store the credentials in the function code",
      "Attach an IAM execution role to the Lambda function with an S3 read policy",
      "Make the S3 bucket fully public",
      "Embed AWS access keys in the Lambda function's environment variables",
    ],
    correctIndices: [1],
    explanation:
      "The correct approach is to create an IAM role with the necessary S3 read permissions and assign it as the Lambda execution role. Lambda assumes this role when executing and receives temporary credentials automatically — no static credentials are needed. Embedding access keys or using IAM users with static credentials is a security anti-pattern.",
    tags: ["lambda", "iam", "security", "execution-role"],
  },

  // ─── IAM ────────────────────────────────────────────────────────────────────
  {
    id: "clf-qq-34",
    service: "AWS IAM",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "Which IAM entity should be used to grant an EC2 instance permissions to access AWS services like S3 or DynamoDB?",
    options: ["IAM user", "IAM group", "IAM role", "IAM policy"],
    correctIndices: [2],
    explanation:
      "IAM roles are designed for AWS services (like EC2) to assume. When you attach a role to an EC2 instance, the instance receives temporary credentials automatically via the instance metadata service. You should never embed IAM user credentials in an instance — that is a security anti-pattern.",
    tags: ["iam", "roles", "ec2"],
  },
  {
    id: "clf-qq-35",
    service: "AWS IAM",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question: "What is the AWS best practice for the root account user?",
    options: [
      "Use it for daily administrative tasks",
      "Share credentials with trusted team leads",
      "Enable MFA and avoid using it for everyday tasks",
      "Delete the root account after creating admin users",
    ],
    correctIndices: [2],
    explanation:
      "AWS recommends enabling multi-factor authentication (MFA) on the root account and then locking away the credentials. The root account has unrestricted access to all resources and cannot be restricted by IAM policies, so it should only be used for the small set of tasks that require it (like closing the account or changing the support plan).",
    tags: ["iam", "root", "mfa", "best-practice"],
  },
  {
    id: "clf-qq-36",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A developer needs read-only access to S3 and full access to DynamoDB. Which approach follows the principle of least privilege?",
    options: [
      "Attach AdministratorAccess managed policy",
      "Create a custom policy granting only S3 read and DynamoDB full access",
      "Attach AmazonS3FullAccess and AmazonDynamoDBFullAccess",
      "Create one IAM user per AWS service",
    ],
    correctIndices: [1],
    explanation:
      "Least privilege means granting only the permissions required. A custom IAM policy that allows s3:Get* and s3:List* plus dynamodb:* gives exactly what's needed. Attaching AdministratorAccess or FullAccess policies grants far more permission than necessary.",
    tags: ["iam", "least-privilege", "policies"],
  },
  {
    id: "clf-qq-37",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "Which IAM feature allows you to set a password policy that requires complexity and rotation for all IAM users?",
    options: [
      "IAM Access Analyzer",
      "IAM account password policy",
      "AWS Secrets Manager",
      "AWS Config",
    ],
    correctIndices: [1],
    explanation:
      "IAM account password policy lets you enforce minimum length, character requirements, password expiration, and reuse prevention for all IAM users in the account. This is the correct control for enforcing password hygiene across the organization.",
    tags: ["iam", "password-policy", "security"],
  },
  {
    id: "clf-qq-38",
    service: "AWS IAM",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "A company has multiple AWS accounts. They want to allow users from Account A to access resources in Account B without creating duplicate IAM users. What is the BEST solution?",
    options: [
      "Copy IAM user credentials from Account A to Account B",
      "Create identical IAM users in both accounts",
      "Use cross-account IAM roles with a trust policy",
      "Enable VPC peering between the accounts",
    ],
    correctIndices: [2],
    explanation:
      "Cross-account IAM roles allow users in a trusted account (Account A) to assume a role in the trusting account (Account B) using STS AssumeRole. This eliminates the need for duplicate credentials, provides temporary access, and is the AWS-recommended pattern for cross-account access.",
    tags: ["iam", "cross-account", "roles", "sts"],
  },

  // ─── VPC ────────────────────────────────────────────────────────────────────
  {
    id: "clf-qq-39",
    service: "Amazon VPC",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question: "What is an Amazon VPC?",
    options: [
      "A virtual private cloud that lets you provision a logically isolated section of AWS",
      "A managed VPN gateway for connecting on-premises networks to AWS",
      "A content delivery network for caching content at edge locations",
      "A dedicated physical server for running AWS workloads",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Virtual Private Cloud (VPC) lets you launch AWS resources in a logically isolated virtual network that you define. You have complete control over your virtual networking environment, including IP address ranges, subnets, route tables, and network gateways.",
    tags: ["vpc", "networking", "fundamentals"],
  },
  {
    id: "clf-qq-40",
    service: "Amazon VPC",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "Which VPC component acts as a virtual firewall at the subnet level, controlling inbound and outbound traffic?",
    options: [
      "Security Group",
      "Network Access Control List (NACL)",
      "Internet Gateway",
      "NAT Gateway",
    ],
    correctIndices: [1],
    explanation:
      "Network ACLs (NACLs) operate at the subnet level and evaluate traffic entering and leaving the subnet. They are stateless — return traffic must be explicitly allowed. Security Groups operate at the instance level and are stateful. NACLs are the subnet-level firewall.",
    tags: ["vpc", "nacl", "security-group", "networking"],
  },
  {
    id: "clf-qq-41",
    service: "Amazon VPC",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A company has EC2 instances in a private subnet that need to download software updates from the internet WITHOUT allowing inbound internet traffic. What should they use?",
    options: [
      "Internet Gateway",
      "VPC Peering",
      "NAT Gateway",
      "Direct Connect",
    ],
    correctIndices: [2],
    explanation:
      "A NAT (Network Address Translation) Gateway allows instances in a private subnet to initiate outbound connections to the internet while preventing inbound connections initiated from the internet. The NAT Gateway sits in a public subnet and routes traffic through the Internet Gateway.",
    tags: ["vpc", "nat-gateway", "private-subnet", "networking"],
  },
  {
    id: "clf-qq-42",
    service: "Amazon VPC",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "Which statement correctly describes the difference between Security Groups and Network ACLs?",
    options: [
      "Security Groups are stateless; NACLs are stateful",
      "Security Groups operate at the subnet level; NACLs at the instance level",
      "Security Groups are stateful; NACLs are stateless",
      "Both Security Groups and NACLs evaluate rules in order of priority",
    ],
    correctIndices: [2],
    explanation:
      "Security Groups are stateful — if you allow inbound traffic, the response is automatically allowed regardless of outbound rules. NACLs are stateless — you must explicitly allow both inbound and outbound traffic. Security Groups act at the instance level; NACLs at the subnet level.",
    tags: ["vpc", "security-group", "nacl", "stateful", "stateless"],
  },

  // ─── S3 Advanced ────────────────────────────────────────────────────────────
  {
    id: "clf-qq-43",
    service: "Amazon S3",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which S3 storage class is designed for data that is accessed less than once a month and offers the lowest storage cost among single-AZ classes?",
    options: [
      "S3 Standard",
      "S3 Standard-IA",
      "S3 One Zone-IA",
      "S3 Glacier Instant Retrieval",
    ],
    correctIndices: [2],
    explanation:
      "S3 One Zone-Infrequent Access stores data in a single AZ, making it 20% cheaper than Standard-IA. It is suitable for infrequently accessed data that can be recreated if lost (since a single AZ failure would destroy the data). Glacier classes are for archival, not infrequent access.",
    tags: ["s3", "storage-classes", "one-zone-ia"],
  },
  {
    id: "clf-qq-44",
    service: "Amazon S3",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to automatically move S3 objects to cheaper storage classes after 30 days and delete them after 365 days. Which S3 feature should they use?",
    options: [
      "S3 Object Lock",
      "S3 Replication",
      "S3 Lifecycle policies",
      "S3 Versioning",
    ],
    correctIndices: [2],
    explanation:
      "S3 Lifecycle policies allow you to define rules that automatically transition objects to cheaper storage classes (e.g., Standard → Standard-IA → Glacier) or expire (delete) objects after a specified number of days. This automates cost optimization without manual intervention.",
    tags: ["s3", "lifecycle", "cost-optimization"],
  },
  {
    id: "clf-qq-45",
    service: "Amazon S3",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "Which S3 feature prevents objects from being deleted or overwritten for a fixed retention period, supporting WORM (Write Once Read Many) compliance?",
    options: [
      "S3 Versioning",
      "S3 Object Lock",
      "S3 Replication",
      "S3 Bucket Policy",
    ],
    correctIndices: [1],
    explanation:
      "S3 Object Lock uses WORM model to protect objects from deletion or modification for a fixed period or indefinitely. It supports compliance mode (no one can override, including root) and governance mode (users with special permissions can override). It helps meet regulatory requirements like SEC Rule 17a-4.",
    tags: ["s3", "object-lock", "compliance", "worm"],
  },
  {
    id: "clf-qq-46",
    service: "Amazon S3",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A company needs to serve a static website globally with the lowest latency. Which combination of AWS services is BEST?",
    options: [
      "S3 static website hosting + CloudFront",
      "EC2 web server + Elastic Load Balancer",
      "S3 Transfer Acceleration + Route 53",
      "Elastic Beanstalk + RDS",
    ],
    correctIndices: [0],
    explanation:
      "S3 can host static websites natively. Adding CloudFront as a CDN in front of S3 caches content at edge locations worldwide, dramatically reducing latency for global users while also adding HTTPS support and DDoS protection via AWS Shield Standard.",
    tags: ["s3", "cloudfront", "static-website", "cdn"],
  },

  // ─── RDS ────────────────────────────────────────────────────────────────────
  {
    id: "clf-qq-47",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which Amazon RDS feature automatically creates a standby replica in a different Availability Zone and promotes it if the primary instance fails?",
    options: [
      "Read Replicas",
      "Multi-AZ deployment",
      "Automated backups",
      "RDS Proxy",
    ],
    correctIndices: [1],
    explanation:
      "RDS Multi-AZ maintains a synchronous standby replica in a different AZ. If the primary fails, RDS automatically promotes the standby with minimal downtime (typically 1-2 minutes). Read Replicas are asynchronous and used for scaling reads, not for high availability failover.",
    tags: ["rds", "multi-az", "high-availability", "failover"],
  },
  {
    id: "clf-qq-48",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company's application has heavy read traffic hitting the primary RDS database. Which RDS feature can offload read queries to reduce load on the primary?",
    options: [
      "Multi-AZ standby",
      "RDS Proxy",
      "Read Replicas",
      "Automated snapshots",
    ],
    correctIndices: [2],
    explanation:
      "RDS Read Replicas use asynchronous replication to create read-only copies of the primary database. Applications can direct read queries to replica endpoints, reducing load on the primary. Read Replicas also support cross-region replication for disaster recovery. Multi-AZ standbys do not serve read traffic.",
    tags: ["rds", "read-replicas", "scaling", "performance"],
  },
  {
    id: "clf-qq-49",
    service: "Amazon RDS",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS database service is a MySQL and PostgreSQL-compatible relational database that provides up to 5x the throughput of standard MySQL?",
    options: [
      "Amazon RDS for MySQL",
      "Amazon Aurora",
      "Amazon Redshift",
      "Amazon DynamoDB",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Aurora is a cloud-native relational database that is MySQL and PostgreSQL compatible. It provides up to 5x the throughput of MySQL and 3x that of PostgreSQL at a lower cost. Aurora automatically replicates data across 3 AZs with 6 copies and continuously backs up to S3.",
    tags: ["rds", "aurora", "mysql", "postgresql", "performance"],
  },

  // ─── DynamoDB ───────────────────────────────────────────────────────────────
  {
    id: "clf-qq-50",
    service: "Amazon DynamoDB",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What type of database is Amazon DynamoDB?",
    options: [
      "Relational SQL database",
      "Graph database",
      "Fully managed NoSQL key-value and document database",
      "In-memory caching database",
    ],
    correctIndices: [2],
    explanation:
      "Amazon DynamoDB is a fully managed, serverless NoSQL database that supports both key-value and document data models. It provides single-digit millisecond performance at any scale, with no servers to manage. It is not relational — it does not support SQL joins.",
    tags: ["dynamodb", "nosql", "fundamentals"],
  },
  {
    id: "clf-qq-51",
    service: "Amazon DynamoDB",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which DynamoDB feature allows tables to automatically scale read and write capacity in response to actual traffic without manual intervention?",
    options: [
      "DynamoDB Streams",
      "DynamoDB Accelerator (DAX)",
      "DynamoDB On-Demand mode",
      "DynamoDB Global Tables",
    ],
    correctIndices: [2],
    explanation:
      "DynamoDB On-Demand mode automatically scales read and write capacity to accommodate workload traffic without capacity planning. You pay per request rather than for provisioned capacity. This is ideal for unpredictable workloads. Provisioned mode with Auto Scaling also adapts, but requires setting min/max limits.",
    tags: ["dynamodb", "on-demand", "auto-scaling"],
  },
  {
    id: "clf-qq-52",
    service: "Amazon DynamoDB",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A gaming company needs a DynamoDB caching layer that reduces read latency from milliseconds to microseconds. Which service should they use?",
    options: [
      "Amazon ElastiCache for Redis",
      "DynamoDB Global Tables",
      "Amazon DynamoDB Accelerator (DAX)",
      "Amazon RDS read replicas",
    ],
    correctIndices: [2],
    explanation:
      "DAX (DynamoDB Accelerator) is a fully managed, in-memory caching service specifically for DynamoDB. It delivers up to 10x performance improvement, reducing response times from milliseconds to microseconds. It is API-compatible with DynamoDB, so minimal code changes are required.",
    tags: ["dynamodb", "dax", "caching", "performance"],
  },

  // ─── CloudFront ─────────────────────────────────────────────────────────────
  {
    id: "clf-qq-53",
    service: "Amazon CloudFront",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon CloudFront?",
    options: [
      "A managed DNS service that routes users to the nearest AWS Region",
      "A content delivery network (CDN) that caches content at edge locations worldwide",
      "A load balancer that distributes traffic across EC2 instances",
      "A firewall that protects applications from DDoS attacks",
    ],
    correctIndices: [1],
    explanation:
      "Amazon CloudFront is a fast CDN service that delivers data, videos, applications, and APIs globally with low latency and high transfer speeds. It caches content at over 400 edge locations worldwide, serving requests from the location nearest to the end user.",
    tags: ["cloudfront", "cdn", "edge", "fundamentals"],
  },
  {
    id: "clf-qq-54",
    service: "Amazon CloudFront",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which CloudFront feature allows you to run code at edge locations to customize content delivery without managing servers?",
    options: [
      "CloudFront Signed URLs",
      "CloudFront Lambda@Edge",
      "CloudFront Origin Shield",
      "CloudFront Invalidation",
    ],
    correctIndices: [1],
    explanation:
      "Lambda@Edge lets you run Lambda functions at CloudFront edge locations in response to viewer and origin requests/responses. Use cases include URL rewriting, A/B testing, authentication at the edge, and HTTP header manipulation — all without managing servers or paying for idle capacity.",
    tags: ["cloudfront", "lambda-at-edge", "edge-computing"],
  },

  // ─── Route 53 ───────────────────────────────────────────────────────────────
  {
    id: "clf-qq-55",
    service: "Amazon Route 53",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon Route 53?",
    options: [
      "A managed NAT gateway for VPC networking",
      "A scalable cloud DNS web service",
      "A distributed denial-of-service (DDoS) protection service",
      "A content acceleration service for S3",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Route 53 is a highly available and scalable Domain Name System (DNS) web service. It translates human-readable domain names into IP addresses. It also offers domain registration, health checking, and traffic routing policies like weighted, latency-based, failover, and geolocation routing.",
    tags: ["route53", "dns", "fundamentals"],
  },
  {
    id: "clf-qq-56",
    service: "Amazon Route 53",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to route 90% of traffic to their primary AWS Region and 10% to a secondary Region for testing. Which Route 53 routing policy should they use?",
    options: [
      "Latency-based routing",
      "Failover routing",
      "Weighted routing",
      "Geolocation routing",
    ],
    correctIndices: [2],
    explanation:
      "Weighted routing allows you to assign relative weights to resource record sets. Setting weights of 90 and 10 sends 90% of traffic to the primary endpoint and 10% to the secondary. This is useful for blue/green deployments and A/B testing. Latency-based routing sends traffic based on lowest network latency, not a fixed percentage.",
    tags: ["route53", "weighted-routing", "traffic-management"],
  },

  // ─── SNS / SQS ──────────────────────────────────────────────────────────────
  {
    id: "clf-qq-57",
    service: "Amazon SNS",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is the primary messaging pattern used by Amazon SNS?",
    options: [
      "Point-to-point (queue-based)",
      "Publish/subscribe (fan-out)",
      "Request/response (synchronous)",
      "Streaming (continuous data ingestion)",
    ],
    correctIndices: [1],
    explanation:
      "Amazon SNS uses a publish/subscribe model. A publisher sends a message to an SNS topic, and SNS fans it out to all subscribed endpoints simultaneously. Subscribers can be Lambda functions, SQS queues, HTTP endpoints, email addresses, or SMS. This decouples producers from consumers.",
    tags: ["sns", "pub-sub", "messaging", "fundamentals"],
  },
  {
    id: "clf-qq-58",
    service: "Amazon SQS",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "What is the main benefit of using Amazon SQS between two application components?",
    options: [
      "It provides real-time streaming of data between components",
      "It decouples components so they can scale and fail independently",
      "It encrypts messages in transit between components",
      "It provides a shared database for components to exchange state",
    ],
    correctIndices: [1],
    explanation:
      "SQS decouples producers from consumers by storing messages in a durable queue. If the consumer is slow or unavailable, messages accumulate in the queue without losing data. This allows each tier to scale independently and improves fault tolerance — a cornerstone of loosely coupled architectures.",
    tags: ["sqs", "decoupling", "messaging", "architecture"],
  },
  {
    id: "clf-qq-59",
    service: "Amazon SQS",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which SQS queue type guarantees that messages are delivered exactly once and in the exact order they are sent?",
    options: [
      "Standard Queue",
      "FIFO Queue",
      "Dead Letter Queue",
      "Delay Queue",
    ],
    correctIndices: [1],
    explanation:
      "SQS FIFO (First-In-First-Out) queues guarantee that messages are processed exactly once and in the exact order they are sent. Standard queues offer best-effort ordering and at-least-once delivery (duplicates possible). FIFO queues support up to 300 transactions per second (3,000 with batching).",
    tags: ["sqs", "fifo", "ordering", "exactly-once"],
  },

  // ─── CloudWatch ─────────────────────────────────────────────────────────────
  {
    id: "clf-qq-60",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS service provides monitoring and observability for AWS resources and applications, including metrics, logs, and alarms?",
    options: ["AWS CloudTrail", "Amazon CloudWatch", "AWS Config", "AWS X-Ray"],
    correctIndices: [1],
    explanation:
      "Amazon CloudWatch is the monitoring and observability service for AWS. It collects metrics from AWS services (CPU, memory, network), allows you to create alarms that trigger actions (like SNS notifications or Auto Scaling), and stores log data from applications and AWS services.",
    tags: ["cloudwatch", "monitoring", "metrics", "alarms"],
  },
  {
    id: "clf-qq-61",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to receive an email alert when their EC2 CPU utilization exceeds 80% for 5 minutes. Which combination of services should they use?",
    options: [
      "CloudWatch Alarm + Amazon SNS",
      "CloudTrail + Amazon SES",
      "AWS Config + Lambda",
      "CloudWatch Logs + SQS",
    ],
    correctIndices: [0],
    explanation:
      "Create a CloudWatch Alarm that monitors the EC2 CPUUtilization metric with a threshold of 80% over a 5-minute period. Configure the alarm action to publish to an SNS topic, which has an email subscription. When the alarm triggers, SNS sends the email notification.",
    tags: ["cloudwatch", "alarms", "sns", "ec2", "monitoring"],
  },

  // ─── CloudFormation ──────────────────────────────────────────────────────────
  {
    id: "clf-qq-62",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is AWS CloudFormation?",
    options: [
      "A service that monitors AWS resource configurations for compliance",
      "An Infrastructure as Code service that provisions AWS resources using templates",
      "A continuous integration and delivery pipeline service",
      "A service for migrating on-premises servers to AWS",
    ],
    correctIndices: [1],
    explanation:
      "AWS CloudFormation is an Infrastructure as Code (IaC) service that lets you model, provision, and manage AWS and third-party resources using JSON or YAML templates. CloudFormation handles resource dependencies, rollback on failure, and stack updates, enabling repeatable and consistent infrastructure deployments.",
    tags: ["cloudformation", "iac", "templates", "fundamentals"],
  },
  {
    id: "clf-qq-63",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A CloudFormation stack deployment fails halfway through. What does CloudFormation do by default?",
    options: [
      "Leaves the partially created resources in place for manual cleanup",
      "Rolls back all changes to the previous stable state",
      "Pauses and waits for manual intervention",
      "Continues deploying the remaining resources",
    ],
    correctIndices: [1],
    explanation:
      "By default, CloudFormation rolls back the entire stack to the last known stable state if any resource creation fails. This ensures your infrastructure is never left in a partial or inconsistent state. You can disable automatic rollback during troubleshooting using the --disable-rollback flag.",
    tags: ["cloudformation", "rollback", "stack", "deployment"],
  },

  // ─── Elastic Beanstalk ───────────────────────────────────────────────────────
  {
    id: "clf-qq-64",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What does AWS Elastic Beanstalk do?",
    options: [
      "Provides serverless function execution without any deployment configuration",
      "Deploys and manages web applications by automatically handling the underlying infrastructure",
      "Provisions bare-metal servers for high-performance computing",
      "Stores and retrieves arbitrary amounts of data as objects",
    ],
    correctIndices: [1],
    explanation:
      "Elastic Beanstalk is a PaaS that handles deployment details like capacity provisioning, load balancing, auto scaling, and health monitoring automatically. You simply upload your application code and Beanstalk manages the rest. You still retain full control over the underlying AWS resources.",
    tags: ["elastic-beanstalk", "paas", "deployment", "fundamentals"],
  },
  {
    id: "clf-qq-65",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Elastic Beanstalk supports which programming languages and platforms? (Select the BEST answer)",
    options: [
      "Only Java and Node.js",
      "Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker",
      "Only Docker containers",
      "Only languages supported by AWS Lambda",
    ],
    correctIndices: [1],
    explanation:
      "Elastic Beanstalk supports a wide range of platforms including Java, .NET, PHP, Node.js, Python, Ruby, Go, and Docker. For each platform, AWS provides a managed runtime environment. If your language isn't natively supported, you can use the Docker platform to run any language or runtime.",
    tags: ["elastic-beanstalk", "platforms", "languages"],
  },

  // ─── ECS / Fargate ──────────────────────────────────────────────────────────
  {
    id: "clf-qq-66",
    service: "Amazon ECS",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon ECS?",
    options: [
      "A fully managed Kubernetes service",
      "A highly scalable container orchestration service for Docker containers",
      "A serverless function execution environment",
      "A managed message queue service",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Elastic Container Service (ECS) is a fully managed container orchestration service that makes it easy to deploy, manage, and scale Docker containers. It integrates with IAM, VPC, load balancers, and CloudWatch. ECS can run on EC2 instances or serverlessly using Fargate.",
    tags: ["ecs", "containers", "docker", "fundamentals"],
  },
  {
    id: "clf-qq-67",
    service: "Amazon ECS",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "What is the difference between running ECS on EC2 launch type versus AWS Fargate?",
    options: [
      "EC2 launch type supports Docker; Fargate supports only Kubernetes",
      "Fargate is serverless — you don't manage the underlying EC2 instances; EC2 launch type requires you to manage the cluster instances",
      "EC2 launch type is free; Fargate charges per container task",
      "Fargate only supports Windows containers; EC2 supports Linux",
    ],
    correctIndices: [1],
    explanation:
      "With the EC2 launch type, you provision and manage the EC2 cluster instances yourself. With Fargate, AWS manages the underlying compute infrastructure — you only define your container requirements (CPU, memory) and pay per task. Fargate eliminates cluster management overhead.",
    tags: ["ecs", "fargate", "ec2", "serverless", "containers"],
  },

  // ─── Global Infrastructure ───────────────────────────────────────────────────
  {
    id: "clf-qq-68",
    service: "AWS Global Infrastructure",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is an AWS Availability Zone?",
    options: [
      "A geographic location where AWS has data centers",
      "One or more discrete data centers with redundant power, networking, and connectivity within a Region",
      "A global edge location for caching content",
      "A virtual private network connecting AWS Regions",
    ],
    correctIndices: [1],
    explanation:
      "An Availability Zone (AZ) is one or more discrete data centers with redundant power, networking, and connectivity housed in separate facilities. Each AWS Region contains multiple AZs (typically 3). Deploying across multiple AZs provides high availability and fault tolerance.",
    tags: ["availability-zones", "global-infrastructure", "regions"],
  },
  {
    id: "clf-qq-69",
    service: "AWS Global Infrastructure",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What are AWS Edge Locations primarily used for?",
    options: [
      "Running EC2 instances closer to end users",
      "Caching content for CloudFront and Route 53 DNS responses",
      "Hosting AWS databases for low-latency access",
      "Providing dedicated physical servers for enterprise customers",
    ],
    correctIndices: [1],
    explanation:
      "AWS Edge Locations (Points of Presence) are sites used by CloudFront to cache copies of content closer to viewers, and by Route 53 for DNS resolution. There are 400+ edge locations globally — far more than AWS Regions — enabling low-latency content delivery worldwide.",
    tags: ["edge-locations", "cloudfront", "route53", "global-infrastructure"],
  },
  {
    id: "clf-qq-70",
    service: "AWS Global Infrastructure",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service allows you to run AWS infrastructure on-premises using the same AWS APIs, tools, and hardware?",
    options: [
      "AWS Direct Connect",
      "AWS Outposts",
      "AWS Local Zones",
      "AWS Wavelength",
    ],
    correctIndices: [1],
    explanation:
      "AWS Outposts brings native AWS services, APIs, and infrastructure to on-premises locations. AWS delivers and installs Outposts racks in your data center, and you manage them via the AWS Console. This is ideal for workloads requiring low latency to on-premises systems or data residency requirements.",
    tags: ["outposts", "hybrid-cloud", "on-premises", "global-infrastructure"],
  },

  // ─── Shared Responsibility ───────────────────────────────────────────────────
  {
    id: "clf-qq-71",
    service: "AWS Shared Responsibility",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "Under the AWS Shared Responsibility Model, which of the following is AWS responsible for?",
    options: [
      "Patching the operating system on EC2 instances",
      "Managing IAM user access and permissions",
      "Physical security of data centers and global infrastructure hardware",
      "Encrypting application data stored in S3",
    ],
    correctIndices: [2],
    explanation:
      "AWS is responsible for 'security OF the cloud' — the global infrastructure including hardware, software, networking, and physical data center security. Customers are responsible for 'security IN the cloud' — OS patching, IAM management, application data encryption, and network configuration.",
    tags: ["shared-responsibility", "security", "fundamentals"],
  },
  {
    id: "clf-qq-72",
    service: "AWS Shared Responsibility",
    domain: "security",
    difficulty: "medium",
    type: "multi",
    question:
      "A company runs an application on EC2. Under the Shared Responsibility Model, which tasks are the customer's responsibility? (Choose TWO)",
    options: [
      "Patching the EC2 host hypervisor",
      "Patching the guest operating system on the EC2 instance",
      "Managing physical network infrastructure",
      "Configuring security groups and network ACLs",
      "Maintaining the physical data center facilities",
    ],
    correctIndices: [1, 3],
    explanation:
      "Customers are responsible for the guest OS (patching, updates), application software, firewall configuration (security groups, NACLs), and data. AWS is responsible for the hypervisor, physical hardware, networking infrastructure, and global facilities.",
    tags: ["shared-responsibility", "ec2", "security", "customer"],
  },
  {
    id: "clf-qq-73",
    service: "AWS Shared Responsibility",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "For AWS Lambda, which components are the customer's responsibility under the Shared Responsibility Model?",
    options: [
      "Patching and securing the underlying Lambda runtime infrastructure",
      "Managing the physical servers that run Lambda functions",
      "Writing secure application code and managing IAM permissions for the function",
      "Ensuring Lambda service availability and fault tolerance",
    ],
    correctIndices: [2],
    explanation:
      "With managed services like Lambda, AWS takes on more responsibility — including runtime patching, infrastructure security, and service availability. The customer remains responsible for their application code security, IAM execution role permissions, and protecting any sensitive data processed by the function.",
    tags: ["shared-responsibility", "lambda", "managed-services"],
  },

  // ─── Support Plans ───────────────────────────────────────────────────────────
  {
    id: "clf-qq-74",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS Support plan provides 24/7 access to Cloud Support Engineers via phone, chat, and email, plus a < 1 hour response time for production system down cases?",
    options: ["Basic", "Developer", "Business", "Enterprise"],
    correctIndices: [2],
    explanation:
      "The Business Support plan (starting at $100/month or 10% of monthly usage) provides 24/7 access to Cloud Support Engineers by phone, chat, and email. It includes a < 1 hour response SLA for production system down cases, full Trusted Advisor checks, and access to AWS Support API.",
    tags: ["support-plans", "business", "sla"],
  },
  {
    id: "clf-qq-75",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS Support plan assigns a dedicated Technical Account Manager (TAM) who provides proactive guidance and advocacy?",
    options: [
      "Developer Support",
      "Business Support",
      "Enterprise On-Ramp Support",
      "Enterprise Support",
    ],
    correctIndices: [3],
    explanation:
      "Enterprise Support (starting at $15,000/month) is the only plan with a dedicated Technical Account Manager (TAM). The TAM provides proactive guidance, coordinates access to programs and AWS experts, and is your primary point of contact for support. Enterprise On-Ramp provides a pool of TAMs (not dedicated).",
    tags: ["support-plans", "enterprise", "tam"],
  },
  {
    id: "clf-qq-76",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS Support plan is the MINIMUM required to get full access to all AWS Trusted Advisor checks?",
    options: ["Basic", "Developer", "Business", "Enterprise"],
    correctIndices: [2],
    explanation:
      "Basic and Developer plans only provide access to 6 core Trusted Advisor checks (service limits and security basics). The Business plan is the minimum to unlock all Trusted Advisor checks across cost optimization, performance, security, fault tolerance, and service limits.",
    tags: ["support-plans", "trusted-advisor", "business"],
  },

  // ─── Pricing & Billing ───────────────────────────────────────────────────────
  {
    id: "clf-qq-77",
    service: "AWS Pricing",
    domain: "deployment",
    difficulty: "easy",
    type: "multi",
    question:
      "Which TWO of the following are fundamental AWS pricing drivers that directly determine your AWS bill?",
    options: [
      "Compute (CPU/memory time consumed)",
      "Number of IAM users in the account",
      "Storage (amount of data stored)",
      "Number of AWS regions enabled",
      "Number of CloudWatch dashboards created",
    ],
    correctIndices: [0, 2],
    explanation:
      "AWS pricing is based on three core dimensions: Compute, Storage, and Outbound Data Transfer. Of the options listed, Compute and Storage are fundamental pricing drivers. The number of IAM users, regions enabled, and CloudWatch dashboards do not directly drive costs in the same foundational way.",
    tags: ["pricing", "fundamentals", "billing"],
  },
  {
    id: "clf-qq-78",
    service: "AWS Pricing",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS tool estimates the cost of migrating to and running workloads on AWS before you commit?",
    options: [
      "AWS Cost Explorer",
      "AWS Budgets",
      "AWS Pricing Calculator",
      "AWS Trusted Advisor",
    ],
    correctIndices: [2],
    explanation:
      "The AWS Pricing Calculator (calculator.aws) lets you estimate the cost of AWS services before you use them. You can model architecture, select services, set usage parameters, and generate a detailed cost estimate. It is ideal for migration planning and budget approvals.",
    tags: ["pricing-calculator", "cost-estimation", "billing"],
  },
  {
    id: "clf-qq-79",
    service: "AWS Pricing",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service allows you to set custom cost thresholds and receive alerts when your forecasted or actual spend exceeds those thresholds?",
    options: [
      "AWS Cost Explorer",
      "AWS Budgets",
      "AWS Pricing Calculator",
      "AWS Organizations",
    ],
    correctIndices: [1],
    explanation:
      "AWS Budgets lets you set custom cost, usage, reservation, and Savings Plans budgets. When actual or forecasted usage exceeds a threshold you define (e.g., 80% of monthly budget), AWS Budgets sends alerts via SNS or email. Cost Explorer is for analyzing historical spend, not for proactive alerting.",
    tags: ["budgets", "cost-management", "billing", "alerts"],
  },
  {
    id: "clf-qq-80",
    service: "AWS Pricing",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service provides a graphical interface to visualize, understand, and manage AWS costs and usage over time?",
    options: [
      "AWS Budgets",
      "AWS Pricing Calculator",
      "AWS Cost Explorer",
      "AWS Cost and Usage Report",
    ],
    correctIndices: [2],
    explanation:
      "AWS Cost Explorer provides an interactive interface for analyzing historical AWS spending patterns. You can filter by service, account, region, or tag; view daily/monthly cost trends; and identify cost drivers. It also provides forecasts based on historical usage. Cost and Usage Reports provide raw data exports.",
    tags: ["cost-explorer", "cost-management", "billing"],
  },

  // ─── Well-Architected Framework ──────────────────────────────────────────────
  {
    id: "clf-qq-81",
    service: "AWS Well-Architected",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "How many pillars does the AWS Well-Architected Framework have?",
    options: ["4", "5", "6", "7"],
    correctIndices: [2],
    explanation:
      "The AWS Well-Architected Framework has six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. Each pillar contains design principles and best practices for building well-architected cloud workloads.",
    tags: ["well-architected", "pillars", "fundamentals"],
  },
  {
    id: "clf-qq-82",
    service: "AWS Well-Architected",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which Well-Architected pillar focuses on the ability of a workload to recover from failures and dynamically acquire resources to meet demand?",
    options: [
      "Performance Efficiency",
      "Operational Excellence",
      "Reliability",
      "Cost Optimization",
    ],
    correctIndices: [2],
    explanation:
      "The Reliability pillar covers a workload's ability to perform its intended function correctly and consistently, recover from failures, and dynamically scale to meet demand. Key practices include implementing auto scaling, using multiple AZs, automated backups, and circuit breakers.",
    tags: ["well-architected", "reliability", "pillars"],
  },
  {
    id: "clf-qq-83",
    service: "AWS Well-Architected",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS tool helps you review your workloads against AWS best practices and identifies areas for improvement across the six Well-Architected pillars?",
    options: [
      "AWS Trusted Advisor",
      "AWS Well-Architected Tool",
      "AWS Config",
      "AWS Inspector",
    ],
    correctIndices: [1],
    explanation:
      "The AWS Well-Architected Tool (available free in the AWS Console) provides a consistent process for evaluating workloads against AWS best practices. You answer questions across the six pillars and receive a report with identified risks and improvement recommendations.",
    tags: ["well-architected", "tool", "best-practices"],
  },

  // ─── AWS Organizations ───────────────────────────────────────────────────────
  {
    id: "clf-qq-84",
    service: "AWS Organizations",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question: "What is AWS Organizations?",
    options: [
      "A service for organizing AWS resources using tags",
      "A service for centrally managing and governing multiple AWS accounts",
      "A project management tool for AWS teams",
      "A compliance monitoring service for a single AWS account",
    ],
    correctIndices: [1],
    explanation:
      "AWS Organizations lets you consolidate multiple AWS accounts into an organization so you can manage them centrally. Key features include consolidated billing, Service Control Policies (SCPs) to set guardrails across accounts, and organizational units (OUs) for grouping accounts by function or environment.",
    tags: ["organizations", "multi-account", "fundamentals"],
  },
  {
    id: "clf-qq-85",
    service: "AWS Organizations",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS Organizations feature allows you to set permission guardrails that restrict what actions member accounts can perform, even if those accounts have AdministratorAccess?",
    options: [
      "IAM Permission Boundaries",
      "Service Control Policies (SCPs)",
      "Resource-based policies",
      "AWS Config Rules",
    ],
    correctIndices: [1],
    explanation:
      "Service Control Policies (SCPs) are organization-wide guardrails that define the maximum permissions available to accounts in your organization. Even if an IAM user has AdministratorAccess, SCPs can deny specific actions (e.g., creating resources outside approved regions). SCPs do not grant permissions — they only restrict them.",
    tags: ["organizations", "scp", "guardrails", "permissions"],
  },
  {
    id: "clf-qq-86",
    service: "AWS Organizations",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question: "What is a benefit of consolidated billing in AWS Organizations?",
    options: [
      "All member accounts share the same IAM users",
      "Usage across all accounts is pooled for volume pricing discounts",
      "Security alerts are automatically shared across all accounts",
      "EC2 Spot Instance bids are pooled across accounts",
    ],
    correctIndices: [1],
    explanation:
      "With consolidated billing, all member account usage is aggregated. This helps reach volume pricing tiers faster (e.g., S3 storage discounts) and allows Reserved Instance and Savings Plan benefits to be shared across all accounts in the organization.",
    tags: ["organizations", "consolidated-billing", "pricing"],
  },

  // ─── Trusted Advisor ─────────────────────────────────────────────────────────
  {
    id: "clf-qq-87",
    service: "AWS Trusted Advisor",
    domain: "troubleshooting",
    difficulty: "easy",
    type: "single",
    question:
      "Which five categories of checks does AWS Trusted Advisor provide?",
    options: [
      "Compute, Storage, Database, Networking, Security",
      "Cost Optimization, Performance, Security, Fault Tolerance, Service Limits",
      "HA, DR, Backup, Compliance, Audit",
      "Development, Testing, Staging, Production, Archival",
    ],
    correctIndices: [1],
    explanation:
      "AWS Trusted Advisor checks your AWS environment against best practices in five categories: Cost Optimization (unused resources), Performance (throttling, underutilized), Security (open ports, MFA), Fault Tolerance (backups, multi-AZ), and Service Limits (approaching limits). Basic and Developer plans include only 6 core checks.",
    tags: ["trusted-advisor", "categories", "fundamentals"],
  },
  {
    id: "clf-qq-88",
    service: "AWS Trusted Advisor",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "Trusted Advisor shows a red flag indicating an S3 bucket has public read access. What does this mean?",
    options: [
      "The bucket has hit its storage limit",
      "The bucket is accessible by anyone on the internet",
      "The bucket is not replicated across regions",
      "Versioning is not enabled on the bucket",
    ],
    correctIndices: [1],
    explanation:
      "Trusted Advisor flags S3 buckets with public read access as a security risk. A publicly readable bucket means any internet user can list and download objects without authentication. Unless intentional (e.g., a public static website), buckets should block public access using S3 Block Public Access settings.",
    tags: ["trusted-advisor", "s3", "security", "public-access"],
  },

  // ─── Security Services ───────────────────────────────────────────────────────
  {
    id: "clf-qq-89",
    service: "AWS CloudTrail",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question: "What does AWS CloudTrail record?",
    options: [
      "CPU and memory metrics for EC2 instances",
      "API calls and events made within an AWS account",
      "Network traffic flowing through a VPC",
      "Application errors and stack traces",
    ],
    correctIndices: [1],
    explanation:
      "AWS CloudTrail records API calls and related events made in your AWS account, including the caller identity, time, source IP, request parameters, and response. It enables governance, compliance, and security auditing. Think of it as the audit log for 'who did what, when' in your AWS account.",
    tags: ["cloudtrail", "audit", "api-calls", "security"],
  },
  {
    id: "clf-qq-90",
    service: "AWS Config",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question: "What is the primary purpose of AWS Config?",
    options: [
      "Deploy configuration files to EC2 instances",
      "Track resource configuration changes and evaluate compliance against rules",
      "Monitor application performance metrics",
      "Automatically patch EC2 operating systems",
    ],
    correctIndices: [1],
    explanation:
      "AWS Config continuously records AWS resource configurations and changes over time. You can define Config Rules to evaluate whether resources comply with desired settings (e.g., 'Are all S3 buckets encrypted?'). It answers the question 'what did my AWS resource look like at a point in time?'",
    tags: ["config", "compliance", "configuration-history"],
  },
  {
    id: "clf-qq-91",
    service: "Amazon GuardDuty",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question: "What does Amazon GuardDuty do?",
    options: [
      "Scans EC2 instances for software vulnerabilities",
      "Provides intelligent threat detection by analyzing VPC Flow Logs, CloudTrail, and DNS logs using machine learning",
      "Blocks DDoS attacks at the network layer",
      "Manages SSL/TLS certificates for web applications",
    ],
    correctIndices: [1],
    explanation:
      "Amazon GuardDuty is a managed threat detection service that continuously analyzes VPC Flow Logs, CloudTrail events, and DNS logs using ML and threat intelligence to identify suspicious activity such as cryptocurrency mining, credential compromise, and unusual API calls.",
    tags: ["guardduty", "threat-detection", "security", "ml"],
  },
  {
    id: "clf-qq-92",
    service: "AWS Shield",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS service provides automatic protection against DDoS attacks at no additional cost for all AWS customers?",
    options: [
      "AWS WAF",
      "AWS Shield Standard",
      "AWS Shield Advanced",
      "Amazon GuardDuty",
    ],
    correctIndices: [1],
    explanation:
      "AWS Shield Standard is automatically enabled for all AWS customers at no extra cost. It protects against the most common and frequently occurring network and transport layer DDoS attacks. Shield Advanced is a paid service offering enhanced protection, 24/7 DDoS response team access, and cost protection.",
    tags: ["shield", "ddos", "security", "standard"],
  },
  {
    id: "clf-qq-93",
    service: "AWS WAF",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service allows you to define rules to block common web exploits like SQL injection and cross-site scripting (XSS)?",
    options: [
      "AWS Shield",
      "AWS WAF (Web Application Firewall)",
      "Security Groups",
      "Amazon Inspector",
    ],
    correctIndices: [1],
    explanation:
      "AWS WAF is a web application firewall that lets you monitor HTTP/S requests and define rules to block or allow traffic based on conditions like IP addresses, HTTP headers, URI strings, and patterns matching SQL injection or XSS. It integrates with CloudFront, ALB, API Gateway, and AppSync.",
    tags: ["waf", "sql-injection", "xss", "security"],
  },

  // ─── KMS / Secrets Manager ───────────────────────────────────────────────────
  {
    id: "clf-qq-94",
    service: "AWS KMS",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question: "What does AWS Key Management Service (KMS) provide?",
    options: [
      "SSH key pair management for EC2 instances",
      "Creation and management of cryptographic keys used to encrypt and decrypt data",
      "SSL/TLS certificate management for web applications",
      "Secure tunnels between VPCs",
    ],
    correctIndices: [1],
    explanation:
      "AWS KMS is a managed service for creating and controlling the encryption keys used to protect your data. KMS keys (formerly CMKs) can encrypt data in S3, EBS, RDS, Lambda environment variables, and more. AWS manages the key material and hardware security modules (HSMs).",
    tags: ["kms", "encryption", "keys", "security"],
  },
  {
    id: "clf-qq-95",
    service: "AWS Secrets Manager",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "What is the primary advantage of AWS Secrets Manager over storing credentials in environment variables or config files?",
    options: [
      "Secrets Manager is cheaper than environment variables",
      "Secrets Manager automatically rotates secrets and provides audit logging via CloudTrail",
      "Secrets Manager stores secrets as plaintext for easy retrieval",
      "Secrets Manager is only for database credentials",
    ],
    correctIndices: [1],
    explanation:
      "AWS Secrets Manager securely stores, retrieves, and automatically rotates secrets like database passwords and API keys. Rotation is built-in for RDS, Redshift, and DocumentDB, and supports custom Lambda rotation for other secret types. All access is logged via CloudTrail, providing full auditability.",
    tags: ["secrets-manager", "rotation", "credentials", "security"],
  },

  // ─── Amazon Inspector / Macie ────────────────────────────────────────────────
  {
    id: "clf-qq-96",
    service: "Amazon Inspector",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question: "What does Amazon Inspector do?",
    options: [
      "Monitors VPC network traffic for anomalies",
      "Automatically assesses EC2 instances and container images for software vulnerabilities and unintended network exposure",
      "Manages encryption keys for AWS services",
      "Detects and protects sensitive data in S3",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Inspector is an automated vulnerability management service that continuously scans EC2 instances, container images in ECR, and Lambda functions for software vulnerabilities (CVEs) and unintended network reachability. It integrates with AWS Security Hub for centralized findings.",
    tags: ["inspector", "vulnerability", "security", "cve"],
  },
  {
    id: "clf-qq-97",
    service: "Amazon Macie",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service uses machine learning to automatically discover and protect sensitive data like PII stored in Amazon S3?",
    options: ["Amazon GuardDuty", "AWS Config", "Amazon Macie", "AWS Shield"],
    correctIndices: [2],
    explanation:
      "Amazon Macie is a data security service that uses machine learning to automatically discover, classify, and protect sensitive data in S3. It identifies PII (names, addresses, credit card numbers, SSNs) and alerts you to security risks like unencrypted buckets containing sensitive data.",
    tags: ["macie", "pii", "s3", "data-security"],
  },

  // ─── TCO / Migration ─────────────────────────────────────────────────────────
  {
    id: "clf-qq-98",
    service: "AWS TCO",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS tool helps businesses compare the cost of running workloads on-premises versus migrating to AWS?",
    options: [
      "AWS Budgets",
      "AWS Cost Explorer",
      "AWS Total Cost of Ownership (TCO) Calculator / Migration Evaluator",
      "AWS Pricing Calculator",
    ],
    correctIndices: [2],
    explanation:
      "AWS Migration Evaluator (formerly TCO Calculator) helps organizations build a data-driven business case for AWS migration by analyzing on-premises infrastructure costs (hardware, software, staff, facilities, power) and comparing them to equivalent AWS costs.",
    tags: ["tco", "migration-evaluator", "cost-comparison", "migration"],
  },
  {
    id: "clf-qq-99",
    service: "AWS Migration",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "The '6 Rs' of cloud migration include Rehost, Replatform, Repurchase, Refactor, Retain, and Retire. Which strategy is also known as 'lift and shift'?",
    options: ["Refactor", "Replatform", "Rehost", "Repurchase"],
    correctIndices: [2],
    explanation:
      "Rehost (lift and shift) moves applications from on-premises to AWS without code changes, simply migrating the existing virtual machines to EC2. It is the fastest migration strategy with the least cloud optimization. AWS Application Migration Service (MGN) automates lift-and-shift migrations.",
    tags: ["migration", "6rs", "lift-and-shift", "rehost"],
  },

  // ─── Additional EC2 / Auto Scaling ───────────────────────────────────────────
  {
    id: "clf-qq-100",
    service: "AWS Auto Scaling",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What does an EC2 Auto Scaling group do?",
    options: [
      "Distributes incoming traffic across multiple EC2 instances",
      "Automatically adds or removes EC2 instances based on demand or schedules",
      "Creates encrypted snapshots of EC2 instances on a schedule",
      "Monitors EC2 instance CPU and sends CloudWatch alarms",
    ],
    correctIndices: [1],
    explanation:
      "An EC2 Auto Scaling group maintains a desired number of EC2 instances and can automatically scale out (add instances) when demand increases or scale in (remove instances) when demand decreases, based on scaling policies tied to CloudWatch metrics or scheduled actions.",
    tags: ["auto-scaling", "ec2", "scaling", "fundamentals"],
  },
  {
    id: "clf-qq-101",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is the purpose of Elastic Load Balancing (ELB)?",
    options: [
      "Automatically scale EC2 instances based on CPU utilization",
      "Distribute incoming application traffic across multiple targets like EC2 instances",
      "Cache frequently accessed database queries",
      "Encrypt data in transit between EC2 instances",
    ],
    correctIndices: [1],
    explanation:
      "Elastic Load Balancing automatically distributes incoming traffic across multiple targets (EC2 instances, containers, IP addresses, Lambda functions) in one or more AZs. It improves availability and fault tolerance by routing traffic only to healthy targets.",
    tags: ["elb", "load-balancing", "high-availability", "fundamentals"],
  },
  {
    id: "clf-qq-102",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which type of Elastic Load Balancer is BEST suited for HTTP/HTTPS traffic and supports path-based and host-based routing?",
    options: [
      "Classic Load Balancer",
      "Network Load Balancer",
      "Application Load Balancer",
      "Gateway Load Balancer",
    ],
    correctIndices: [2],
    explanation:
      "Application Load Balancer (ALB) operates at Layer 7 (HTTP/HTTPS) and supports advanced routing including path-based routing (/api/* to one target group, /images/* to another) and host-based routing. It also supports WebSockets, HTTP/2, and integrates with WAF and Cognito.",
    tags: ["elb", "alb", "layer7", "routing"],
  },

  // ─── Storage Services ────────────────────────────────────────────────────────
  {
    id: "clf-qq-103",
    service: "Amazon EBS",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What type of storage does Amazon EBS provide?",
    options: [
      "Object storage accessible via HTTP",
      "Persistent block storage volumes that attach to EC2 instances",
      "Shared file storage for multiple EC2 instances simultaneously",
      "Archival storage for infrequently accessed data",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Elastic Block Store (EBS) provides persistent block-level storage volumes that attach to EC2 instances. Unlike instance store, EBS data persists independently of the EC2 instance lifecycle. EBS volumes can be detached from one instance and attached to another in the same AZ.",
    tags: ["ebs", "block-storage", "ec2", "storage"],
  },
  {
    id: "clf-qq-104",
    service: "Amazon EFS",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS storage service provides a scalable, fully managed NFS file system that can be mounted by multiple EC2 instances simultaneously?",
    options: ["Amazon EBS", "Amazon S3", "Amazon EFS", "Amazon FSx"],
    correctIndices: [2],
    explanation:
      "Amazon Elastic File System (EFS) is a fully managed NFS file system that scales automatically and can be mounted concurrently by multiple EC2 instances across multiple AZs. Unlike EBS (which attaches to one instance), EFS supports shared access — ideal for shared content repositories and CMS systems.",
    tags: ["efs", "nfs", "shared-storage", "file-system"],
  },
  {
    id: "clf-qq-105",
    service: "AWS Storage Gateway",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service provides a hybrid cloud storage bridge, enabling on-premises applications to seamlessly use AWS cloud storage?",
    options: [
      "AWS DataSync",
      "AWS Direct Connect",
      "AWS Storage Gateway",
      "AWS Snowball",
    ],
    correctIndices: [2],
    explanation:
      "AWS Storage Gateway is a hybrid cloud storage service that gives on-premises access to AWS cloud storage. It exposes cloud storage as NFS, SMB, iSCSI, or tape interfaces, allowing on-premises applications to use S3, S3 Glacier, or EBS as if they were local storage.",
    tags: ["storage-gateway", "hybrid-cloud", "on-premises", "storage"],
  },

  // ─── Database Services ───────────────────────────────────────────────────────
  {
    id: "clf-qq-106",
    service: "Amazon ElastiCache",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service provides fully managed in-memory caching using Redis or Memcached to improve application performance?",
    options: [
      "Amazon DynamoDB DAX",
      "Amazon ElastiCache",
      "Amazon RDS for Redis",
      "Amazon MemoryDB",
    ],
    correctIndices: [1],
    explanation:
      "Amazon ElastiCache is a fully managed in-memory caching service that supports Redis and Memcached. It is used to cache frequently accessed database query results, session data, and computed values, reducing database load and application latency. DAX is specifically for DynamoDB caching.",
    tags: ["elasticache", "redis", "memcached", "caching", "performance"],
  },
  {
    id: "clf-qq-107",
    service: "Amazon Redshift",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service is a fully managed cloud data warehouse designed for analyzing large datasets using SQL?",
    options: [
      "Amazon RDS",
      "Amazon DynamoDB",
      "Amazon Redshift",
      "Amazon Athena",
    ],
    correctIndices: [2],
    explanation:
      "Amazon Redshift is a petabyte-scale cloud data warehouse optimized for OLAP (Online Analytical Processing) workloads. It uses columnar storage, parallel query execution, and result caching to deliver fast SQL analytics on large datasets. It integrates with S3 (Redshift Spectrum), Glue, and QuickSight.",
    tags: ["redshift", "data-warehouse", "analytics", "sql"],
  },

  // ─── Developer Tools ─────────────────────────────────────────────────────────
  {
    id: "clf-qq-108",
    service: "AWS CodePipeline",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS service automates the build, test, and deploy phases of a software release pipeline?",
    options: [
      "AWS CodeCommit",
      "AWS CodeBuild",
      "AWS CodePipeline",
      "AWS CodeDeploy",
    ],
    correctIndices: [2],
    explanation:
      "AWS CodePipeline is a fully managed continuous delivery service that orchestrates the build, test, and deploy phases whenever code changes occur. It integrates with CodeCommit, CodeBuild, CodeDeploy, GitHub, Jenkins, and many third-party tools to form a complete CI/CD pipeline.",
    tags: ["codepipeline", "cicd", "devops", "automation"],
  },
  {
    id: "clf-qq-109",
    service: "AWS CodeDeploy",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which deployment strategy does AWS CodeDeploy use to gradually shift traffic from the old version to the new version without downtime?",
    options: [
      "In-place deployment only",
      "Blue/Green deployment",
      "Rolling update",
      "Canary deployment",
    ],
    correctIndices: [1],
    explanation:
      "CodeDeploy supports Blue/Green deployments where traffic shifts from the original (blue) environment to the replacement (green) environment. This eliminates downtime during deployment. If issues arise, traffic can be shifted back to the original environment quickly. In-place deployments update instances on the existing fleet.",
    tags: ["codedeploy", "blue-green", "deployment", "zero-downtime"],
  },

  // ─── Serverless / Additional Services ────────────────────────────────────────
  {
    id: "clf-qq-110",
    service: "AWS API Gateway",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question: "What is the primary use of Amazon API Gateway?",
    options: [
      "To route network traffic between VPCs",
      "To create, publish, secure, and manage REST, HTTP, and WebSocket APIs at any scale",
      "To manage SSL certificates for web applications",
      "To provide a message queue for decoupling microservices",
    ],
    correctIndices: [1],
    explanation:
      "Amazon API Gateway is a fully managed service for creating and managing APIs. It handles request throttling, authorization (IAM, Cognito, Lambda authorizers), caching, and monitoring. It commonly serves as the front door for Lambda-based serverless applications, creating serverless APIs.",
    tags: ["api-gateway", "rest-api", "serverless", "microservices"],
  },
  {
    id: "clf-qq-111",
    service: "AWS Step Functions",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service lets you coordinate multiple Lambda functions and services into serverless workflows using state machines?",
    options: [
      "AWS EventBridge",
      "Amazon SWF",
      "AWS Step Functions",
      "AWS Batch",
    ],
    correctIndices: [2],
    explanation:
      "AWS Step Functions is a serverless orchestration service that lets you design and run workflows using state machines. Each step in the workflow can invoke Lambda functions, call AWS services, or wait for human approval. It handles error handling, retries, and branching logic visually.",
    tags: ["step-functions", "orchestration", "serverless", "workflows"],
  },

  // ─── Cloud Adoption & Value ───────────────────────────────────────────────────
  {
    id: "clf-qq-112",
    service: "AWS Cloud Value",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which of the following is a key benefit of cloud computing's 'trade capital expense for variable expense' principle?",
    options: [
      "You must buy hardware before knowing your requirements",
      "You only pay for resources you consume instead of investing in data center infrastructure upfront",
      "All cloud resources are free during the first year",
      "Capital expenses are eliminated by paying a fixed monthly subscription",
    ],
    correctIndices: [1],
    explanation:
      "One of the six core advantages of cloud computing is trading capital expense (CapEx — large upfront hardware purchases) for variable expense (OpEx — paying only for what you consume). This eliminates the risk of overprovisioning and allows you to invest savings in your business.",
    tags: ["cloud-benefits", "capex", "opex", "fundamentals"],
  },
  {
    id: "clf-qq-113",
    service: "AWS Cloud Value",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What does 'elasticity' mean in cloud computing?",
    options: [
      "The ability to physically stretch hardware across data centers",
      "The ability to acquire and release resources dynamically to match demand",
      "The ability to switch between AWS services at any time",
      "The resilience of the network to packet loss",
    ],
    correctIndices: [1],
    explanation:
      "Elasticity is the ability to automatically scale resources up (scale out) during peak demand and release them (scale in) when demand decreases. This means you provision exactly what you need at any moment, avoiding both over-provisioning (waste) and under-provisioning (poor performance).",
    tags: ["elasticity", "cloud-benefits", "auto-scaling", "fundamentals"],
  },

  // ─── Compliance & Governance ─────────────────────────────────────────────────
  {
    id: "clf-qq-114",
    service: "AWS Artifact",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS service provides on-demand access to AWS compliance reports and security documents like SOC 2, ISO 27001, and PCI DSS?",
    options: [
      "AWS Config",
      "AWS Audit Manager",
      "AWS Artifact",
      "AWS Security Hub",
    ],
    correctIndices: [2],
    explanation:
      "AWS Artifact is a self-service portal for on-demand access to AWS compliance reports (SOC 1/2/3, ISO 27001, PCI DSS, HIPAA) and online agreements (BAAs). These documents help customers demonstrate their own compliance and conduct due diligence on AWS's security posture.",
    tags: ["artifact", "compliance", "reports", "governance"],
  },
  {
    id: "clf-qq-115",
    service: "AWS Security Hub",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question: "What does AWS Security Hub provide?",
    options: [
      "A dedicated physical server for running compliance workloads",
      "A centralized view of security alerts and compliance status across multiple AWS accounts and services",
      "Automated penetration testing for AWS resources",
      "Hardware security modules for cryptographic key storage",
    ],
    correctIndices: [1],
    explanation:
      "AWS Security Hub aggregates security findings from multiple AWS services (GuardDuty, Inspector, Macie, IAM Access Analyzer) and third-party tools into a single dashboard. It continuously evaluates your environment against security best practices and compliance standards like CIS AWS Foundations Benchmark.",
    tags: ["security-hub", "compliance", "centralized", "findings"],
  },

  // ─── Networking Advanced ─────────────────────────────────────────────────────
  {
    id: "clf-qq-116",
    service: "AWS Direct Connect",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question: "What does AWS Direct Connect provide?",
    options: [
      "A software VPN connecting on-premises networks to AWS over the internet",
      "A dedicated private network connection from on-premises to AWS, bypassing the internet",
      "A CDN for accelerating data transfers to AWS",
      "A peering connection between two AWS VPCs",
    ],
    correctIndices: [1],
    explanation:
      "AWS Direct Connect establishes a dedicated, private network connection between your on-premises data center and AWS. It bypasses the public internet, offering more consistent network performance, lower latency, higher bandwidth, and reduced data transfer costs compared to site-to-site VPN.",
    tags: [
      "direct-connect",
      "hybrid-cloud",
      "networking",
      "private-connection",
    ],
  },
  {
    id: "clf-qq-117",
    service: "AWS VPN",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS service creates an encrypted connection over the public internet between an on-premises network and an AWS VPC?",
    options: [
      "AWS Direct Connect",
      "VPC Peering",
      "AWS Site-to-Site VPN",
      "AWS Transit Gateway",
    ],
    correctIndices: [2],
    explanation:
      "AWS Site-to-Site VPN creates an encrypted IPsec tunnel between your on-premises network (using a customer gateway device) and your AWS VPC (through a virtual private gateway). It uses the public internet but encrypts all traffic. Direct Connect is a private, dedicated line — faster and more consistent but costlier.",
    tags: ["vpn", "site-to-site", "hybrid-cloud", "encryption"],
  },

  // ─── Final Exam-Level Questions ───────────────────────────────────────────────
  {
    id: "clf-qq-118",
    service: "AWS Cloud Adoption Framework",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "The AWS Cloud Adoption Framework (CAF) organizes guidance into six perspectives. Which perspective focuses on aligning IT strategy with business strategy?",
    options: [
      "Platform Perspective",
      "Business Perspective",
      "Operations Perspective",
      "Governance Perspective",
    ],
    correctIndices: [1],
    explanation:
      "The Business Perspective of the AWS CAF focuses on ensuring that IT aligns with and supports business needs. It helps stakeholders understand how cloud adoption creates business value. Key capabilities include IT Finance, IT Strategy, Benefits Realization, and Business Risk Management.",
    tags: ["caf", "cloud-adoption-framework", "business", "strategy"],
  },
  {
    id: "clf-qq-119",
    service: "AWS IAM",
    domain: "security",
    difficulty: "hard",
    type: "multi",
    question:
      "Which of the following are AWS Identity and Access Management (IAM) best practices? (Choose TWO)",
    options: [
      "Grant maximum permissions and restrict later as needed",
      "Enable MFA for privileged IAM users and the root account",
      "Share IAM credentials between developers for convenience",
      "Use IAM roles for applications running on EC2",
      "Store IAM access keys in application source code for easy access",
    ],
    correctIndices: [1, 3],
    explanation:
      "IAM best practices include: enabling MFA for all privileged users and root; using IAM roles (not users) for EC2 and other services; granting least privilege (not maximum); and never sharing credentials. Roles use temporary credentials — more secure than long-lived access keys.",
    tags: ["iam", "best-practice", "mfa", "roles", "security"],
  },
  {
    id: "clf-qq-120",
    service: "AWS Cost Optimization",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to reduce AWS costs. Which of the following actions would MOST likely reduce their bill? (Choose TWO)",
    options: [
      "Switch EC2 On-Demand instances running 24/7 to Reserved Instances with a 1-year commitment",
      "Enable Multi-AZ for all RDS databases",
      "Purchase Savings Plans for predictable compute workloads",
      "Enable CloudTrail logging in all regions",
      "Enable VPC Flow Logs for all subnets",
    ],
    correctIndices: [0, 2],
    explanation:
      "Reserved Instances and Savings Plans provide significant discounts (up to 72%) over On-Demand pricing for predictable workloads. Multi-AZ increases costs (you pay for the standby replica). CloudTrail logging incurs storage costs. For cost reduction, commit to predictable usage via RIs or Savings Plans.",
    tags: [
      "cost-optimization",
      "reserved-instances",
      "savings-plans",
      "billing",
    ],
  },
];
