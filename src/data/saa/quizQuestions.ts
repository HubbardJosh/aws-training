import { QuizQuestion } from "../../types";

export const quizQuestions: QuizQuestion[] = [
  // ─── Amazon EC2 (1–8) ───────────────────────────────────────────────────────
  {
    id: "saa-qq-1",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A company needs to run a web server for a variable workload with no upfront commitment. Which EC2 purchasing option is MOST appropriate?",
    options: [
      "On-Demand Instances",
      "Reserved Instances (1-year)",
      "Spot Instances",
      "Dedicated Hosts",
    ],
    correctIndices: [0],
    explanation:
      "On-Demand Instances provide compute capacity with no upfront commitment and no long-term contract, paying only for what you use by the second. This makes them ideal for variable or unpredictable workloads where you need flexibility.",
    tags: ["ec2", "pricing", "on-demand"],
  },
  {
    id: "saa-qq-2",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A company runs a steady-state production database workload 24/7 for the next 3 years. Which EC2 pricing model provides the GREATEST cost savings?",
    options: [
      "On-Demand Instances",
      "Spot Instances",
      "Reserved Instances (3-year, all upfront)",
      "Dedicated Hosts",
    ],
    correctIndices: [2],
    explanation:
      "Reserved Instances with a 3-year all-upfront commitment provide the largest discount (up to 72%) compared to On-Demand pricing. For steady, predictable workloads running continuously, this is the most cost-effective option.",
    tags: ["ec2", "pricing", "reserved"],
  },
  {
    id: "saa-qq-3",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A data processing job can be interrupted and restarted without impact. The job needs to complete within a flexible 6-hour window each night. Which EC2 option minimizes cost?",
    options: [
      "On-Demand Instances",
      "Spot Instances",
      "Reserved Instances",
      "Dedicated Instances",
    ],
    correctIndices: [1],
    explanation:
      "Spot Instances offer up to 90% discount over On-Demand pricing and are ideal for fault-tolerant, flexible workloads that can be interrupted. Since the job can be restarted, Spot is the optimal cost choice for this batch workload.",
    tags: ["ec2", "spot", "pricing", "batch"],
  },
  {
    id: "saa-qq-4",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A solutions architect needs to ensure EC2 instances in a placement group have the lowest possible network latency between them. Which placement group strategy should be used?",
    options: [
      "Cluster placement group",
      "Partition placement group",
      "Spread placement group",
      "Regional placement group",
    ],
    correctIndices: [0],
    explanation:
      "Cluster placement groups pack instances close together within a single Availability Zone, providing the lowest network latency and highest throughput between instances. They are ideal for HPC and tightly coupled applications.",
    tags: ["ec2", "placement-group", "networking"],
  },
  {
    id: "saa-qq-5",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company requires that its EC2 instances use dedicated physical servers due to regulatory compliance. No other customer's instances should share the hardware. Which option meets this requirement at the LOWEST cost?",
    options: [
      "Reserved Instances (No Upfront)",
      "Dedicated Instances",
      "Dedicated Hosts",
      "On-Demand Instances",
    ],
    correctIndices: [1],
    explanation:
      "Dedicated Instances run on hardware dedicated to a single customer but do not provide visibility into or control over the underlying host. Dedicated Hosts provide the same isolation plus host-level control but are more expensive. Dedicated Instances are the lower-cost compliance option.",
    tags: ["ec2", "dedicated", "compliance"],
  },
  {
    id: "saa-qq-6",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "An EC2 instance stores critical temporary data on an instance store volume. The instance is stopped and then started again. What happens to the instance store data?",
    options: [
      "The data is lost when the instance is stopped",
      "The data is replicated to another instance store",
      "The data persists across stop/start cycles",
      "The data is automatically backed up to S3",
    ],
    correctIndices: [0],
    explanation:
      "Instance store volumes are ephemeral — data is lost when the instance is stopped, hibernated, or terminated. Only a reboot preserves instance store data. For persistent storage, EBS volumes or S3 should be used instead.",
    tags: ["ec2", "instance-store", "storage"],
  },
  {
    id: "saa-qq-7",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to improve the availability of its EC2-based application across multiple Availability Zones. Which TWO actions should the solutions architect take?",
    options: [
      "Deploy EC2 instances in an Auto Scaling group across multiple AZs",
      "Use a single EC2 instance with enhanced networking enabled",
      "Place an Application Load Balancer in front of the EC2 instances",
      "Store all application state on the local instance store volume",
      "Deploy all instances in a single Availability Zone for lower latency",
    ],
    correctIndices: [0, 2],
    explanation:
      "Deploying instances in an Auto Scaling group across multiple AZs ensures that if one AZ fails, traffic continues in surviving AZs. An Application Load Balancer distributes traffic across healthy instances and performs health checks, completing the high-availability pattern.",
    tags: ["ec2", "availability", "multi-az", "alb"],
  },
  {
    id: "saa-qq-8",
    service: "Amazon EC2",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which EC2 instance type family is optimized for memory-intensive workloads such as in-memory databases and real-time processing of large datasets?",
    options: [
      "R5 (Memory Optimized)",
      "C5 (Compute Optimized)",
      "P3 (Accelerated Computing)",
      "T3 (General Purpose Burstable)",
    ],
    correctIndices: [0],
    explanation:
      "R-family instances (Memory Optimized) are designed for workloads that require large amounts of RAM, such as in-memory databases (Redis, Memcached), real-time big data analytics, and high-performance databases like SAP HANA.",
    tags: ["ec2", "instance-types", "memory"],
  },

  // ─── Amazon S3 (9–16) ───────────────────────────────────────────────────────
  {
    id: "saa-qq-9",
    service: "Amazon S3",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to host a static website using Amazon S3. What must be configured on the S3 bucket to allow public read access to the website files?",
    options: [
      "Enable S3 Transfer Acceleration",
      "Enable S3 Versioning",
      "Disable Block Public Access and attach a bucket policy allowing public reads",
      "Configure an S3 Access Point",
    ],
    correctIndices: [2],
    explanation:
      "To serve a public static website, you must disable Block Public Access settings and attach a bucket policy that grants s3:GetObject to everyone (Principal: *). Block Public Access overrides bucket policies, so both steps are required.",
    tags: ["s3", "static-website", "bucket-policy"],
  },
  {
    id: "saa-qq-10",
    service: "Amazon S3",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company stores infrequently accessed compliance documents in Amazon S3 that must be retrieved within minutes when needed. Which storage class provides the LOWEST cost while meeting this requirement?",
    options: [
      "S3 Glacier Flexible Retrieval",
      "S3 One Zone-Infrequent Access",
      "S3 Standard",
      "S3 Standard-Infrequent Access (S3 Standard-IA)",
    ],
    correctIndices: [3],
    explanation:
      "S3 Standard-IA is designed for infrequently accessed data that still requires millisecond retrieval. It costs less than S3 Standard while providing the same durability and availability, making it the right fit for compliance documents needing quick but rare access.",
    tags: ["s3", "storage-class", "infrequent-access"],
  },
  {
    id: "saa-qq-11",
    service: "Amazon S3",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company needs to ensure that objects deleted from an S3 bucket can be recovered for up to 30 days. Which feature should be enabled?",
    options: [
      "S3 Cross-Region Replication",
      "S3 Versioning with a lifecycle rule to expire non-current versions after 30 days",
      "S3 Object Lock in COMPLIANCE mode",
      "S3 Transfer Acceleration",
    ],
    correctIndices: [1],
    explanation:
      "S3 Versioning preserves every version of an object, including delete markers, so deleted objects can be recovered. Adding a lifecycle rule to expire non-current versions after 30 days controls storage costs while meeting the 30-day recovery requirement.",
    tags: ["s3", "versioning", "lifecycle"],
  },
  {
    id: "saa-qq-12",
    service: "Amazon S3",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "An application uploads many small objects to Amazon S3. A solutions architect notices high request costs. Which S3 feature can automatically move objects to cheaper storage classes based on access patterns without writing lifecycle rules?",
    options: [
      "S3 Replication",
      "S3 Intelligent-Tiering",
      "S3 Standard-IA",
      "S3 Glacier Instant Retrieval",
    ],
    correctIndices: [1],
    explanation:
      "S3 Intelligent-Tiering automatically moves objects between access tiers (Frequent, Infrequent, Archive Instant) based on changing access patterns, with no retrieval fees. It eliminates the need to manually write lifecycle rules for unpredictable workloads.",
    tags: ["s3", "intelligent-tiering", "cost-optimization"],
  },
  {
    id: "saa-qq-13",
    service: "Amazon S3",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A financial institution requires that S3 objects cannot be deleted or overwritten for 7 years to meet regulatory requirements. Which S3 feature enforces this?",
    options: [
      "S3 MFA Delete",
      "S3 Versioning",
      "S3 Bucket Policy denying DeleteObject",
      "S3 Object Lock in COMPLIANCE mode with a 7-year retention period",
    ],
    correctIndices: [3],
    explanation:
      "S3 Object Lock in COMPLIANCE mode prevents any user, including the root account, from deleting or overwriting objects before the retention period expires. This is the only S3 mechanism that satisfies SEC Rule 17a-4 and similar immutability regulations.",
    tags: ["s3", "object-lock", "compliance", "worm"],
  },
  {
    id: "saa-qq-14",
    service: "Amazon S3",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A solutions architect needs to replicate S3 objects from a bucket in us-east-1 to a bucket in eu-west-1. Objects must be encrypted with customer-managed KMS keys in both regions. Which combination of settings is required?",
    options: [
      "Enable CRR; S3 automatically re-encrypts objects with the destination region's default KMS key",
      "Enable SRR; specify the destination bucket and enable SSE-S3",
      "Enable CRR; specify a destination KMS key in eu-west-1 and grant the S3 replication role kms:GenerateDataKey and kms:Decrypt permissions",
      "Enable CRR; use the same KMS key ARN in both regions",
    ],
    correctIndices: [2],
    explanation:
      "Cross-Region Replication (CRR) with SSE-KMS requires specifying a destination KMS key in the target region and granting the IAM replication role kms:Decrypt on the source key and kms:GenerateDataKey on the destination key. KMS keys are region-specific and cannot be shared across regions.",
    tags: ["s3", "crr", "kms", "encryption", "replication"],
  },
  {
    id: "saa-qq-15",
    service: "Amazon S3",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to reduce S3 costs for a large archive of objects that are accessed once a year. The objects must be retrievable within 12 hours. Which TWO actions together achieve the lowest cost?",
    options: [
      "Move objects to S3 Glacier Flexible Retrieval using a lifecycle rule",
      "Keep objects in S3 Standard-IA",
      "Use S3 Batch Operations to restore objects on demand",
      "Enable S3 Intelligent-Tiering with Archive Access tier enabled",
      "Store objects in S3 One Zone-IA",
    ],
    correctIndices: [0, 3],
    explanation:
      "S3 Glacier Flexible Retrieval (via lifecycle rule) and S3 Intelligent-Tiering with Archive Access tier both support retrievals within hours and are the cheapest options for annually accessed data. Glacier Flexible Retrieval's Standard retrieval is 3–5 hours; the Archive Access tier in Intelligent-Tiering is similar.",
    tags: ["s3", "glacier", "intelligent-tiering", "cost"],
  },
  {
    id: "saa-qq-16",
    service: "Amazon S3",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to grant a partner company's AWS account read access to specific S3 objects without creating IAM users. What is the MOST secure approach?",
    options: [
      "Make the S3 bucket public and share the object URLs",
      "Share the root account access keys with the partner",
      "Create a bucket policy that allows the partner's AWS account ID access to the specific objects",
      "Enable S3 Transfer Acceleration for the partner",
    ],
    correctIndices: [2],
    explanation:
      "A bucket policy using the aws:PrincipalAccount condition or specifying the partner's account ARN grants cross-account access securely without sharing credentials. This is the standard AWS pattern for cross-account S3 access.",
    tags: ["s3", "bucket-policy", "cross-account"],
  },

  // ─── Amazon VPC (17–24) ──────────────────────────────────────────────────────
  {
    id: "saa-qq-17",
    service: "Amazon VPC",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A solutions architect needs EC2 instances in a private subnet to download software updates from the internet without being directly accessible from the internet. What should be used?",
    options: [
      "AWS Direct Connect",
      "VPC Peering connection to a public VPC",
      "NAT Gateway in a public subnet with a route from the private subnet",
      "Internet Gateway attached to the private subnet",
    ],
    correctIndices: [2],
    explanation:
      "A NAT Gateway placed in a public subnet allows instances in private subnets to initiate outbound internet connections while preventing inbound connections from the internet. The private subnet route table must point 0.0.0.0/0 to the NAT Gateway.",
    tags: ["vpc", "nat-gateway", "private-subnet"],
  },
  {
    id: "saa-qq-18",
    service: "Amazon VPC",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which VPC component acts as a virtual firewall at the subnet level, controlling inbound and outbound traffic with stateless rules?",
    options: [
      "Security Group",
      "Network ACL (NACL)",
      "Internet Gateway",
      "Route Table",
    ],
    correctIndices: [1],
    explanation:
      "Network ACLs (NACLs) are stateless subnet-level firewalls that evaluate each packet against numbered allow/deny rules independently for inbound and outbound traffic. Security groups, by contrast, are stateful and operate at the instance level.",
    tags: ["vpc", "nacl", "security"],
  },
  {
    id: "saa-qq-19",
    service: "Amazon VPC",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company has two VPCs in the same AWS account and region that need to communicate privately. VPC-A uses CIDR 10.0.0.0/16 and VPC-B uses 10.1.0.0/16. What is the SIMPLEST solution?",
    options: [
      "Use AWS PrivateLink to expose services between the VPCs",
      "Deploy a Transit Gateway connecting both VPCs",
      "Create a VPC Peering connection between VPC-A and VPC-B and update route tables in both VPCs",
      "Create an AWS Site-to-Site VPN between the two VPCs",
    ],
    correctIndices: [2],
    explanation:
      "VPC Peering is the simplest solution for direct private connectivity between two VPCs with non-overlapping CIDRs. After creating the peering connection, you add routes in each VPC's route table pointing to the peer VPC CIDR via the peering connection.",
    tags: ["vpc", "peering", "networking"],
  },
  {
    id: "saa-qq-20",
    service: "Amazon VPC",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company has 10 VPCs that all need to communicate with each other and share a connection to on-premises. Managing VPC peering connections is becoming complex. What AWS service simplifies this hub-and-spoke networking?",
    options: [
      "AWS Transit Gateway",
      "VPC Peering with full mesh topology",
      "AWS VPN CloudHub",
      "AWS Direct Connect Gateway",
    ],
    correctIndices: [0],
    explanation:
      "AWS Transit Gateway acts as a regional hub that allows transitive routing between thousands of VPCs and on-premises networks through a single gateway. It eliminates the need for complex full-mesh VPC peering and simplifies network management.",
    tags: ["vpc", "transit-gateway", "networking"],
  },
  {
    id: "saa-qq-21",
    service: "Amazon VPC",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "An application needs to connect to an AWS service (e.g., S3) from a private subnet without traffic traversing the public internet. Which feature should be used?",
    options: [
      "Internet Gateway",
      "VPC Endpoint",
      "AWS Direct Connect",
      "NAT Gateway",
    ],
    correctIndices: [1],
    explanation:
      "VPC Endpoints (Gateway endpoints for S3/DynamoDB, Interface endpoints for other services) allow private subnet resources to communicate with AWS services over the AWS private network, without requiring internet access, a NAT gateway, or public IPs.",
    tags: ["vpc", "vpc-endpoint", "s3", "private"],
  },
  {
    id: "saa-qq-22",
    service: "Amazon VPC",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A company runs a multi-tier application with web servers in public subnets and database servers in private subnets. The database servers need OS patches from the internet but must not be publicly accessible. What is the CORRECT architecture?",
    options: [
      "Create an Internet Gateway and attach it directly to the private subnet",
      "Place the database servers in a public subnet with a strict security group",
      "Assign public IP addresses to the database servers",
      "Create a NAT Gateway in a public subnet; add a route in the private subnet route table to the NAT Gateway for 0.0.0.0/0",
    ],
    correctIndices: [3],
    explanation:
      "A NAT Gateway in a public subnet (which has an Internet Gateway route) allows private subnet instances to initiate outbound traffic to the internet for updates while preventing unsolicited inbound connections. This is the standard AWS pattern for private subnet internet access.",
    tags: ["vpc", "nat-gateway", "multi-tier", "security"],
  },
  {
    id: "saa-qq-23",
    service: "Amazon VPC",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "A solutions architect is designing a highly available NAT solution across two Availability Zones. Which TWO design choices are required?",
    options: [
      "Deploy one NAT Gateway in each Availability Zone",
      "Deploy a single NAT Gateway in one AZ and share it across all private subnets",
      "Update each AZ's private subnet route table to use the NAT Gateway in the same AZ",
      "Use a NAT instance in an Auto Scaling group across multiple AZs",
      "Create a VPC peering connection to provide NAT redundancy",
    ],
    correctIndices: [0, 2],
    explanation:
      "For high availability, AWS recommends deploying one NAT Gateway per AZ and configuring each private subnet's route table to route outbound traffic to the NAT Gateway in the same AZ. This prevents a single AZ failure from taking down internet access for all private subnets.",
    tags: ["vpc", "nat-gateway", "high-availability", "multi-az"],
  },
  {
    id: "saa-qq-24",
    service: "Amazon VPC",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "Which VPC component controls traffic at the EC2 instance level and is stateful, meaning return traffic is automatically allowed?",
    options: [
      "Network ACL",
      "Route Table",
      "Internet Gateway",
      "Security Group",
    ],
    correctIndices: [3],
    explanation:
      "Security groups are stateful firewalls that operate at the instance level. When you allow inbound traffic on a port, the response traffic is automatically allowed regardless of outbound rules. NACLs are stateless and require explicit rules for both directions.",
    tags: ["vpc", "security-group", "stateful"],
  },

  // ─── Amazon RDS (25–32) ──────────────────────────────────────────────────────
  {
    id: "saa-qq-25",
    service: "Amazon RDS",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company runs an RDS MySQL database and wants to offload read traffic from the primary instance to improve performance. Which RDS feature should be used?",
    options: [
      "RDS Automated Backups",
      "RDS Multi-AZ deployment",
      "RDS Read Replica",
      "RDS Proxy",
    ],
    correctIndices: [2],
    explanation:
      "RDS Read Replicas create asynchronous copies of the primary database that can serve SELECT queries, offloading read traffic and improving overall throughput. They can be created in the same Region, a different AZ, or a different Region.",
    tags: ["rds", "read-replica", "performance"],
  },
  {
    id: "saa-qq-26",
    service: "Amazon RDS",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company needs its RDS database to automatically failover to a standby instance in a different AZ with minimal downtime if the primary instance fails. Which RDS feature provides this?",
    options: [
      "RDS Multi-AZ deployment",
      "RDS Read Replica",
      "RDS Automated Backups",
      "RDS Performance Insights",
    ],
    correctIndices: [0],
    explanation:
      "RDS Multi-AZ maintains a synchronous standby replica in a different AZ. If the primary fails, RDS automatically fails over to the standby (typically within 1–2 minutes) by updating the DNS endpoint, requiring no application changes.",
    tags: ["rds", "multi-az", "high-availability", "failover"],
  },
  {
    id: "saa-qq-27",
    service: "Amazon RDS",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "An application uses Lambda functions that frequently open and close database connections to RDS, causing connection exhaustion. What is the BEST solution?",
    options: [
      "Use RDS Proxy to pool and share database connections",
      "Enable RDS Multi-AZ to distribute connection load",
      "Increase the RDS instance size to a larger DB instance class",
      "Add a Read Replica and direct Lambda connections there",
    ],
    correctIndices: [0],
    explanation:
      "RDS Proxy maintains a pool of established connections to the database and allows Lambda functions (and other applications) to reuse them, dramatically reducing connection overhead. It is purpose-built for serverless workloads that open many short-lived connections.",
    tags: ["rds", "rds-proxy", "lambda", "connections"],
  },
  {
    id: "saa-qq-28",
    service: "Amazon RDS",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company needs a fully managed relational database that automatically scales storage and compute, supports MySQL and PostgreSQL compatibility, and provides up to 5x better performance than standard MySQL. Which AWS service meets these requirements?",
    options: [
      "Amazon Aurora",
      "Amazon Redshift",
      "Amazon RDS for MySQL",
      "Amazon DynamoDB",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Aurora is AWS's cloud-native relational database offering MySQL and PostgreSQL compatibility with up to 5x (MySQL) and 3x (PostgreSQL) better performance than standard engines. Aurora storage automatically grows in 10 GB increments up to 128 TB.",
    tags: ["rds", "aurora", "performance"],
  },
  {
    id: "saa-qq-29",
    service: "Amazon RDS",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company's RDS for PostgreSQL database is experiencing slow query performance. A solutions architect wants to identify the top SQL queries consuming the most database load. Which RDS feature should be used?",
    options: [
      "RDS Performance Insights",
      "RDS Enhanced Monitoring",
      "AWS X-Ray",
      "Amazon CloudWatch Logs",
    ],
    correctIndices: [0],
    explanation:
      "RDS Performance Insights provides a dashboard to analyze database load and identify the top SQL queries, wait events, users, and hosts consuming resources. It uses a DB Load metric that makes it easy to pinpoint performance bottlenecks.",
    tags: ["rds", "performance-insights", "troubleshooting"],
  },
  {
    id: "saa-qq-30",
    service: "Amazon RDS",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A company uses Aurora MySQL with one primary and two read replicas. A solutions architect wants to ensure the application automatically connects to the primary for writes and distributes reads across replicas without changing the application's connection string. How can this be achieved?",
    options: [
      "Use the cluster endpoint for writes and the reader endpoint for reads, both of which are provided automatically by Aurora",
      "Use the reader endpoint for write connections and individual instance endpoints for reads",
      "Deploy an RDS Proxy and configure it with read/write splitting rules",
      "Use the cluster endpoint for all connections",
    ],
    correctIndices: [0],
    explanation:
      "Aurora provides a cluster endpoint (always points to the primary) for write traffic and a reader endpoint that load-balances across all read replicas. Using both endpoints allows the application to separate reads and writes without tracking individual instance endpoints.",
    tags: ["rds", "aurora", "endpoints", "read-replica"],
  },
  {
    id: "saa-qq-31",
    service: "Amazon RDS",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to migrate an on-premises Oracle database to AWS with the LEAST administrative overhead and lowest licensing cost. Which TWO approaches should be considered?",
    options: [
      "Migrate to Amazon RDS for Oracle with License Included",
      "Migrate to Amazon Aurora PostgreSQL using AWS Schema Conversion Tool (SCT) and DMS",
      "Run Oracle on EC2 instances with BYOL",
      "Migrate to Amazon RDS for Oracle BYOL",
      "Migrate to Amazon DynamoDB",
    ],
    correctIndices: [1, 3],
    explanation:
      "Migrating to Aurora PostgreSQL using SCT and DMS eliminates Oracle licensing entirely and reduces administrative overhead with a managed service. If Oracle compatibility must be retained, RDS for Oracle BYOL allows using existing licenses while AWS manages the infrastructure.",
    tags: ["rds", "migration", "oracle", "aurora"],
  },
  {
    id: "saa-qq-32",
    service: "Amazon RDS",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "By default, how long does Amazon RDS retain automated backups?",
    options: ["7 days", "1 day", "35 days", "90 days"],
    correctIndices: [0],
    explanation:
      "RDS automated backups are retained for 7 days by default. This can be configured from 1 to 35 days. Automated backups enable point-in-time recovery within the retention window.",
    tags: ["rds", "backup", "retention"],
  },

  // ─── Amazon DynamoDB (33–40) ─────────────────────────────────────────────────
  {
    id: "saa-qq-33",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "A developer needs a fully managed NoSQL database that can handle millions of requests per second with single-digit millisecond latency. Which AWS service is BEST suited?",
    options: [
      "Amazon Redshift",
      "Amazon RDS for MySQL",
      "Amazon DynamoDB",
      "Amazon Aurora",
    ],
    correctIndices: [2],
    explanation:
      "Amazon DynamoDB is a fully managed, serverless NoSQL key-value and document database that delivers single-digit millisecond performance at any scale. It is designed for high-throughput, low-latency workloads with automatic scaling.",
    tags: ["dynamodb", "nosql", "performance"],
  },
  {
    id: "saa-qq-34",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "A DynamoDB table uses partition key 'userId' and sort key 'timestamp'. A query needs to find all items for a specific userId ordered by timestamp. Which DynamoDB operation is MOST efficient?",
    options: ["Query", "Scan", "BatchGetItem", "GetItem"],
    correctIndices: [0],
    explanation:
      "The Query operation retrieves all items with a given partition key value and can filter/sort by sort key. It is far more efficient than a Scan, which reads every item in the table. Query only consumes capacity for items in the specified partition.",
    tags: ["dynamodb", "query", "scan", "performance"],
  },
  {
    id: "saa-qq-35",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A DynamoDB table is experiencing throttling on reads for a small number of hot partition keys, while other partitions are underutilized. What is the BEST solution to reduce throttling?",
    options: [
      "Switch from Provisioned to On-Demand capacity mode",
      "Enable DynamoDB Accelerator (DAX) to cache frequently read items",
      "Increase the number of global secondary indexes",
      "Enable DynamoDB Streams",
    ],
    correctIndices: [1],
    explanation:
      "DynamoDB Accelerator (DAX) is an in-memory cache that serves read requests in microseconds, reducing the load on hot partition keys. When most reads are for a few popular items, DAX absorbs the read traffic before it hits DynamoDB, eliminating throttling.",
    tags: ["dynamodb", "dax", "hot-partition", "caching"],
  },
  {
    id: "saa-qq-36",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "An application needs to query DynamoDB items based on an attribute that is not the primary key. The query pattern is known in advance. What is the MOST efficient solution?",
    options: [
      "Perform a full table Scan with a FilterExpression",
      "Create a Global Secondary Index (GSI) on the attribute",
      "Store a copy of the data sorted by the attribute in a separate table",
      "Use DynamoDB Streams to index data in another service",
    ],
    correctIndices: [1],
    explanation:
      "A Global Secondary Index (GSI) allows querying DynamoDB on non-primary-key attributes with the same efficiency as querying the base table. GSIs have their own partition and sort keys and can project any subset of attributes.",
    tags: ["dynamodb", "gsi", "index", "query"],
  },
  {
    id: "saa-qq-37",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to replicate a DynamoDB table across three AWS regions for disaster recovery and low-latency global access. Which DynamoDB feature supports this?",
    options: [
      "DynamoDB Streams",
      "DynamoDB Global Tables",
      "DynamoDB Accelerator (DAX)",
      "DynamoDB On-Demand mode",
    ],
    correctIndices: [1],
    explanation:
      "DynamoDB Global Tables provide fully managed, multi-region, active-active replication. Writes to any replica table are propagated to all other regions within seconds, enabling low-latency reads and writes globally with built-in disaster recovery.",
    tags: ["dynamodb", "global-tables", "multi-region", "disaster-recovery"],
  },
  {
    id: "saa-qq-38",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "hard",
    type: "single",
    question:
      "A DynamoDB table uses provisioned capacity. Read traffic spikes unpredictably during flash sales, causing ReadThrottle events. The company wants to automatically handle these spikes without over-provisioning. Which feature should be enabled?",
    options: [
      "DynamoDB Auto Scaling with target tracking",
      "DynamoDB Accelerator (DAX)",
      "DynamoDB Streams with Lambda processing",
      "DynamoDB On-Demand capacity mode",
    ],
    correctIndices: [3],
    explanation:
      "On-Demand capacity mode automatically handles sudden traffic spikes by instantly accommodating any request volume without throttling, with no capacity planning required. While it costs more per request than well-provisioned capacity, it eliminates throttling during unpredictable flash sales.",
    tags: ["dynamodb", "on-demand", "capacity", "throttling"],
  },
  {
    id: "saa-qq-39",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    question:
      "A solutions architect needs to enable event-driven processing whenever items are created or updated in a DynamoDB table. Which TWO components are required?",
    options: [
      "Enable DynamoDB Streams on the table",
      "Enable DynamoDB Accelerator (DAX)",
      "Create a Lambda function with the DynamoDB stream as an event source",
      "Create an SQS queue and poll it from EC2",
      "Enable DynamoDB Global Tables",
    ],
    correctIndices: [0, 2],
    explanation:
      "DynamoDB Streams captures a time-ordered sequence of item-level changes. By enabling Streams and configuring a Lambda event source mapping to the stream ARN, Lambda is automatically invoked with each batch of changes, enabling serverless event-driven processing.",
    tags: ["dynamodb", "streams", "lambda", "event-driven"],
  },
  {
    id: "saa-qq-40",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "What are the two required components of a DynamoDB primary key when using a composite primary key?",
    options: [
      "Partition key and Global Secondary Index",
      "Hash key and Range key (these are alternative names for Partition key and Sort key)",
      "Primary key and Foreign key",
      "Partition key and Sort key",
    ],
    correctIndices: [3],
    explanation:
      "A DynamoDB composite primary key consists of a Partition key (also called hash key) and a Sort key (also called range key). The combination must be unique across all items. The partition key determines the physical partition, while the sort key allows ordering within a partition.",
    tags: ["dynamodb", "primary-key", "fundamentals"],
  },

  // ─── AWS IAM (41–48) ─────────────────────────────────────────────────────────
  {
    id: "saa-qq-41",
    service: "AWS IAM",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "An EC2 instance needs to access an S3 bucket. What is the MOST secure way to grant this access?",
    options: [
      "Store AWS access keys in the EC2 instance's environment variables",
      "Hard-code access keys in the application source code",
      "Attach an IAM role with an S3 access policy to the EC2 instance",
      "Create an IAM user and store its credentials in a config file on the instance",
    ],
    correctIndices: [2],
    explanation:
      "IAM roles for EC2 instances provide temporary, automatically rotated credentials via the instance metadata service. This eliminates the need to store or manage long-term access keys, which is the most secure pattern for granting AWS service access to EC2.",
    tags: ["iam", "roles", "ec2", "best-practices"],
  },
  {
    id: "saa-qq-42",
    service: "AWS IAM",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "A company has multiple developers who need the same set of permissions. What is the MOST efficient way to manage this in IAM?",
    options: [
      "Create an IAM group, attach the required policies to the group, and add all developers to the group",
      "Share a single IAM user account among all developers",
      "Give all developers administrator access",
      "Attach individual policies to each IAM user",
    ],
    correctIndices: [0],
    explanation:
      "IAM groups allow you to assign permissions to multiple users at once. Adding users to a group is the most efficient and maintainable approach — when permissions need to change, you update the group policy once rather than updating each user individually.",
    tags: ["iam", "groups", "best-practices"],
  },
  {
    id: "saa-qq-43",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A company uses AWS Organizations with multiple accounts. The security team wants to prevent any account in the organization from disabling AWS CloudTrail, regardless of IAM permissions in individual accounts. What should be used?",
    options: [
      "IAM permission boundaries in each account",
      "AWS Config rules in each account",
      "IAM role trust policies",
      "A Service Control Policy (SCP) attached to the organization root or OUs",
    ],
    correctIndices: [3],
    explanation:
      "Service Control Policies (SCPs) in AWS Organizations set maximum permission guardrails for all accounts in the organization. An SCP denying cloudtrail:StopLogging and cloudtrail:DeleteTrail cannot be overridden by any IAM policy in member accounts, even by account administrators.",
    tags: ["iam", "scp", "organizations", "cloudtrail"],
  },
  {
    id: "saa-qq-44",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A developer's IAM policy allows s3:PutObject on a specific bucket, but a bucket policy on that bucket has a Deny for the developer's IAM user. What is the effective permission?",
    options: [
      "Allow — the IAM policy takes precedence over the bucket policy",
      "Deny — an explicit Deny in any policy always overrides any Allow",
      "Allow — resource-based policies override identity-based policies",
      "It depends on which policy was created first",
    ],
    correctIndices: [1],
    explanation:
      "In AWS IAM policy evaluation, an explicit Deny always overrides any Allow, regardless of which policy type contains it. The order or type of policies (identity vs. resource-based) does not matter — an explicit Deny wins.",
    tags: ["iam", "policy-evaluation", "deny", "s3"],
  },
  {
    id: "saa-qq-45",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to allow users to assume an IAM role only when they are accessing from the corporate IP range. Which IAM policy element enforces this?",
    options: [
      "Resource element in the permissions policy",
      "Effect element set to Deny",
      "Condition element with the aws:SourceIp condition key",
      "Principal element in the role trust policy",
    ],
    correctIndices: [2],
    explanation:
      "The Condition element with aws:SourceIp allows you to restrict who can assume a role based on the requester's IP address. When added to a role's trust policy, users outside the specified IP range cannot successfully call sts:AssumeRole.",
    tags: ["iam", "conditions", "ip-restriction", "trust-policy"],
  },
  {
    id: "saa-qq-46",
    service: "AWS IAM",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "A solutions architect needs to allow an IAM user to launch EC2 instances of only t3.micro type and no other instance types. Which IAM policy element achieves this with the LEAST privilege?",
    options: [
      "Use an Allow policy for ec2:RunInstances with a Condition on ec2:InstanceType equaling t3.micro",
      "Attach an AWS managed policy for EC2 ReadOnly access",
      "Use a Resource ARN in the IAM policy scoped to t3.micro instances",
      "Use a Deny policy for all EC2 actions except RunInstances",
    ],
    correctIndices: [0],
    explanation:
      "The ec2:InstanceType condition key can be used in the Condition block of an IAM policy to restrict RunInstances calls to specific instance types. This follows the principle of least privilege by allowing only the exact instance type needed.",
    tags: ["iam", "conditions", "least-privilege", "ec2"],
  },
  {
    id: "saa-qq-47",
    service: "AWS IAM",
    domain: "security",
    difficulty: "hard",
    type: "multi",
    question:
      "A company uses IAM Identity Center (SSO) for centralized access to multiple AWS accounts. Which TWO are benefits of this approach compared to managing IAM users in each account?",
    options: [
      "Users log in once and access multiple AWS accounts without separate credentials per account",
      "IAM users are automatically created in each account for audit trails",
      "Permission sets can be centrally defined and applied across accounts",
      "All accounts share the same IAM user database as the management account",
      "MFA is not required because SSO provides sufficient security",
    ],
    correctIndices: [0, 2],
    explanation:
      "IAM Identity Center provides single sign-on across all organization accounts from one portal, eliminating per-account IAM user management. Permission sets are defined centrally and provisioned to accounts, making access management scalable and consistent across the organization.",
    tags: ["iam", "identity-center", "sso", "organizations"],
  },
  {
    id: "saa-qq-48",
    service: "AWS IAM",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "What is the IAM security best practice for the AWS account root user?",
    options: [
      "Enable MFA on the root user and avoid using it for routine tasks",
      "Use the root user for day-to-day administrative tasks",
      "Share root user credentials with the security team for emergency access",
      "Create access keys for the root user and store them securely",
    ],
    correctIndices: [0],
    explanation:
      "AWS strongly recommends enabling MFA on the root account and using it only for tasks that specifically require root access (e.g., changing account settings, closing the account). All other tasks should be performed using IAM users or roles with appropriate permissions.",
    tags: ["iam", "root-user", "mfa", "best-practices"],
  },

  // ─── Elastic Load Balancing (49–55) ──────────────────────────────────────────
  {
    id: "saa-qq-49",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A company runs a web application on EC2 instances and needs to distribute HTTP/HTTPS traffic across multiple instances with support for path-based routing. Which load balancer type should be used?",
    options: [
      "Network Load Balancer",
      "Classic Load Balancer",
      "Gateway Load Balancer",
      "Application Load Balancer",
    ],
    correctIndices: [3],
    explanation:
      "Application Load Balancer (ALB) operates at Layer 7 (HTTP/HTTPS) and supports advanced routing features including path-based routing, host-based routing, and query string routing. It is the ideal choice for modern web applications and microservices.",
    tags: ["elb", "alb", "routing", "layer7"],
  },
  {
    id: "saa-qq-50",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A company needs to handle millions of TCP connections per second with ultra-low latency for a real-time trading application. Which load balancer type is MOST appropriate?",
    options: [
      "Network Load Balancer",
      "Classic Load Balancer",
      "Gateway Load Balancer",
      "Application Load Balancer",
    ],
    correctIndices: [0],
    explanation:
      "Network Load Balancer (NLB) operates at Layer 4 (TCP/UDP) and is designed for extreme performance — millions of requests per second with sub-millisecond latency. It is ideal for latency-sensitive applications like gaming, IoT, and financial trading.",
    tags: ["elb", "nlb", "performance", "layer4"],
  },
  {
    id: "saa-qq-51",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "An application requires that each user session is consistently routed to the same EC2 instance. Which ALB feature provides this behavior?",
    options: [
      "Cross-Zone Load Balancing",
      "Sticky Sessions (Session Affinity)",
      "Connection Draining",
      "Health Check configuration",
    ],
    correctIndices: [1],
    explanation:
      "Sticky sessions (session affinity) use cookies to bind a user's session to a specific target. When enabled, the ALB uses a cookie to route requests from the same client to the same target, ensuring session state on the instance is reachable throughout the session.",
    tags: ["elb", "alb", "sticky-sessions", "session-affinity"],
  },
  {
    id: "saa-qq-52",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to deploy third-party network appliances (firewalls, intrusion detection systems) in AWS to inspect all inbound and outbound traffic. Which load balancer type enables this pattern?",
    options: [
      "Gateway Load Balancer",
      "Classic Load Balancer",
      "Application Load Balancer",
      "Network Load Balancer",
    ],
    correctIndices: [0],
    explanation:
      "Gateway Load Balancer (GWLB) operates at Layer 3 and enables deployment of, and traffic routing through, third-party virtual network appliances. It uses the GENEVE protocol to encapsulate traffic, making it ideal for inline security inspection scenarios.",
    tags: ["elb", "gwlb", "security", "network-appliances"],
  },
  {
    id: "saa-qq-53",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "An ALB serves two applications — one at /app1/* and one at /app2/* — on separate target groups. A user requests /app1/page. Which routing feature of ALB handles this?",
    options: [
      "Query string routing",
      "Weighted target group routing",
      "Path-based routing",
      "Host-based routing",
    ],
    correctIndices: [2],
    explanation:
      "Path-based routing uses the URL path in the request to direct traffic to different target groups. Rules on the ALB listener match the path prefix (/app1/* vs /app2/*) and forward requests to the corresponding target group, enabling a single ALB to serve multiple applications.",
    tags: ["elb", "alb", "path-routing", "target-groups"],
  },
  {
    id: "saa-qq-54",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A solutions architect is configuring an ALB and wants to ensure that unhealthy instances stop receiving traffic within 30 seconds of failing. Which setting directly controls this?",
    options: [
      "Connection idle timeout",
      "Load balancer deletion protection",
      "Health check interval and unhealthy threshold settings on the target group",
      "Deregistration delay",
    ],
    correctIndices: [2],
    explanation:
      "The health check interval (time between checks) multiplied by the unhealthy threshold (number of consecutive failures) determines how quickly the ALB marks a target unhealthy. Setting interval to 10 seconds and threshold to 3 means unhealthy targets are removed in ~30 seconds.",
    tags: ["elb", "alb", "health-checks", "target-group"],
  },
  {
    id: "saa-qq-55",
    service: "Elastic Load Balancing",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "A company uses an Application Load Balancer with EC2 instances in two AZs. One AZ has 2 instances and the other has 8 instances. Which TWO statements are true when cross-zone load balancing is ENABLED?",
    options: [
      "Each instance receives an equal share (10%) of traffic regardless of which AZ it is in",
      "Each AZ receives 50% of traffic; instances within an AZ share equally",
      "The 2 instances in the smaller AZ receive more traffic per instance than the 8 in the larger AZ",
      "Cross-zone load balancing distributes traffic evenly across all registered targets in all AZs",
      "Cross-zone load balancing is disabled by default for ALB",
    ],
    correctIndices: [0, 3],
    explanation:
      "With cross-zone load balancing enabled (the default for ALB), each load balancer node distributes traffic evenly across all registered targets in all Availability Zones. Each of the 10 instances receives 10% of total traffic, regardless of AZ distribution.",
    tags: ["elb", "alb", "cross-zone", "load-balancing"],
  },

  // ─── AWS Auto Scaling (56–62) ─────────────────────────────────────────────────
  {
    id: "saa-qq-56",
    service: "AWS Auto Scaling",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants EC2 instances to automatically scale out when CPU utilization exceeds 70%. Which Auto Scaling policy type is MOST appropriate?",
    options: [
      "Simple scaling policy",
      "Target tracking scaling policy",
      "Scheduled scaling policy",
      "Step scaling policy",
    ],
    correctIndices: [1],
    explanation:
      "Target tracking scaling automatically adjusts capacity to maintain a specified metric target (e.g., 70% CPU). AWS manages the scaling actions and the policy continuously adjusts capacity up or down to keep the metric at the target, similar to a thermostat.",
    tags: ["auto-scaling", "target-tracking", "cpu"],
  },
  {
    id: "saa-qq-57",
    service: "AWS Auto Scaling",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A company knows that its e-commerce application receives a traffic spike every Saturday morning at 9:00 AM. What Auto Scaling feature should be used to proactively add capacity before the spike?",
    options: [
      "Scheduled scaling",
      "Target tracking scaling",
      "Step scaling",
      "Predictive scaling",
    ],
    correctIndices: [0],
    explanation:
      "Scheduled scaling allows you to set specific times to scale in or out based on known traffic patterns. By scheduling an increase in minimum capacity before 9:00 AM on Saturdays, you ensure instances are warmed up and ready before the traffic spike arrives.",
    tags: ["auto-scaling", "scheduled-scaling", "planned-capacity"],
  },
  {
    id: "saa-qq-58",
    service: "AWS Auto Scaling",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "An Auto Scaling group launches new EC2 instances behind an ALB. New instances are serving traffic before the application has fully started, causing errors. What is the BEST solution?",
    options: [
      "Increase the cooldown period for the scaling policy",
      "Increase the ALB health check interval",
      "Use a larger instance type so the application starts faster",
      "Configure a lifecycle hook on the 'EC2_INSTANCE_LAUNCHING' transition to delay registration until the application is ready",
    ],
    correctIndices: [3],
    explanation:
      "Lifecycle hooks pause instance launch in a 'Pending:Wait' state, allowing custom actions (e.g., running a startup script, waiting for application initialization) before the instance is placed InService and receives traffic from the ALB.",
    tags: ["auto-scaling", "lifecycle-hooks", "alb"],
  },
  {
    id: "saa-qq-59",
    service: "AWS Auto Scaling",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "An Auto Scaling group has instances in us-east-1a, us-east-1b, and us-east-1c. After a scale-in event, which AZ does Auto Scaling terminate an instance from first by default?",
    options: [
      "The AZ with the most instances to rebalance across AZs",
      "The AZ closest to the minimum capacity",
      "A random AZ",
      "The AZ with the oldest launch template",
    ],
    correctIndices: [0],
    explanation:
      "Auto Scaling's default termination policy first identifies the AZ with the most instances (or selects randomly among AZs with equal counts), then terminates the instance using the oldest launch configuration/template. This rebalancing behavior maintains even distribution across AZs.",
    tags: ["auto-scaling", "termination-policy", "scale-in"],
  },
  {
    id: "saa-qq-60",
    service: "AWS Auto Scaling",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company uses Auto Scaling for its web tier. During peak hours, the group scales out to 20 instances. After peak hours, it scales in to 4 instances. The company wants to avoid terminating instances that still have active long-running jobs. Which feature prevents premature termination?",
    options: [
      "Cooldown period",
      "Instance protection",
      "Termination policy",
      "Warm pool",
    ],
    correctIndices: [1],
    explanation:
      "Instance protection allows specific instances to be marked as protected from scale-in termination. You can set protection on individual instances (e.g., via a lifecycle hook or application logic), ensuring Auto Scaling skips them during scale-in events until protection is removed.",
    tags: ["auto-scaling", "instance-protection", "scale-in"],
  },
  {
    id: "saa-qq-61",
    service: "AWS Auto Scaling",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "An application experiences long instance startup times (8–10 minutes). This causes Auto Scaling to be slow to respond to traffic spikes. What feature pre-initializes instances so they are ready to serve traffic quickly when needed?",
    options: [
      "Auto Scaling Warm Pools",
      "Scheduled scaling with longer lead times",
      "Predictive scaling only",
      "Launch Templates with user data optimization",
    ],
    correctIndices: [0],
    explanation:
      "Warm Pools maintain a pool of pre-initialized instances in a stopped or running state. When Auto Scaling needs to scale out, it uses warm pool instances (which are already initialized) instead of launching new ones, dramatically reducing the time to serve traffic during spikes.",
    tags: ["auto-scaling", "warm-pools", "startup-time"],
  },
  {
    id: "saa-qq-62",
    service: "AWS Auto Scaling",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "A solutions architect needs to ensure that an Auto Scaling group maintains high availability across AZs and replaces unhealthy instances automatically. Which TWO features work together to achieve this?",
    options: [
      "Configure the ASG to span multiple Availability Zones",
      "Use a single AZ with Reserved Instances for cost savings",
      "Enable EC2 health checks or ELB health checks in the ASG",
      "Set the ASG cooldown period to 0",
      "Use Spot Instances for all capacity",
    ],
    correctIndices: [0, 2],
    explanation:
      "Spanning an ASG across multiple AZs ensures that if one AZ becomes unavailable, Auto Scaling launches replacement instances in healthy AZs. Health checks (EC2 or ELB) detect unhealthy instances and trigger automatic replacement, maintaining the desired capacity.",
    tags: ["auto-scaling", "multi-az", "health-checks", "high-availability"],
  },

  // ─── Amazon CloudFront (63–69) ────────────────────────────────────────────────
  {
    id: "saa-qq-63",
    service: "Amazon CloudFront",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company hosts a static website on S3 and wants to serve it globally with low latency and HTTPS support. Which AWS service should be placed in front of the S3 bucket?",
    options: [
      "Elastic Load Balancing",
      "AWS Global Accelerator",
      "Amazon CloudFront",
      "Amazon Route 53",
    ],
    correctIndices: [2],
    explanation:
      "Amazon CloudFront is a CDN that caches content at edge locations worldwide, reducing latency for global users. It provides HTTPS support via SSL/TLS certificates from AWS Certificate Manager (ACM) and can serve S3 static content with Origin Access Control for security.",
    tags: ["cloudfront", "cdn", "s3", "https"],
  },
  {
    id: "saa-qq-64",
    service: "Amazon CloudFront",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company uses CloudFront to serve an S3 bucket. They want to ensure that users cannot access the S3 bucket directly — only through CloudFront. What is the RECOMMENDED approach?",
    options: [
      "Enable S3 Block Public Access and use a signed URL for all requests",
      "Set the S3 bucket to private and enable CloudFront Origin Access Control (OAC)",
      "Enable S3 Transfer Acceleration and restrict access by IP",
      "Put a Network Load Balancer in front of S3",
    ],
    correctIndices: [1],
    explanation:
      "Origin Access Control (OAC) is the recommended way to restrict S3 bucket access to CloudFront only. The S3 bucket policy allows access from the CloudFront distribution's OAC, and Block Public Access prevents direct S3 access from the internet.",
    tags: ["cloudfront", "s3", "oac", "security"],
  },
  {
    id: "saa-qq-65",
    service: "Amazon CloudFront",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A media company distributes premium video content through CloudFront and needs to ensure only paid subscribers can access the content. Which CloudFront feature restricts access to authenticated users?",
    options: [
      "CloudFront geo-restriction",
      "CloudFront Signed URLs or Signed Cookies",
      "CloudFront Origin Shield",
      "CloudFront Functions",
    ],
    correctIndices: [1],
    explanation:
      "CloudFront Signed URLs and Signed Cookies restrict content access to authorized users. Signed URLs control access to individual files, while Signed Cookies control access to multiple files. Both use a key pair to create time-limited, optionally IP-restricted access tokens.",
    tags: ["cloudfront", "signed-url", "signed-cookie", "access-control"],
  },
  {
    id: "saa-qq-66",
    service: "Amazon CloudFront",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company updated static assets on S3 but CloudFront is still serving the old cached versions. What is the FASTEST way to force CloudFront to serve the new content?",
    options: [
      "Create a CloudFront invalidation for the affected paths",
      "Change the S3 bucket name",
      "Create a new CloudFront distribution",
      "Wait for the cache TTL to expire naturally",
    ],
    correctIndices: [0],
    explanation:
      "A CloudFront invalidation removes objects from the edge cache before their TTL expires, forcing CloudFront to fetch fresh content from the origin on the next request. Invalidation can target specific paths or /* for all objects, though invalidations have a small cost.",
    tags: ["cloudfront", "cache", "invalidation", "ttl"],
  },
  {
    id: "saa-qq-67",
    service: "Amazon CloudFront",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A company wants to run lightweight JavaScript code at CloudFront edge locations to customize HTTP responses (e.g., add security headers) with the lowest possible latency. Which feature is MOST appropriate?",
    options: [
      "Lambda@Edge",
      "CloudFront Origin Shield",
      "CloudFront Functions",
      "AWS Lambda with CloudFront triggers",
    ],
    correctIndices: [2],
    explanation:
      "CloudFront Functions run at 600+ edge locations (all Points of Presence) with sub-millisecond startup times and are designed for lightweight, simple operations like header manipulation, URL rewrites, and request normalization. Lambda@Edge runs at regional edge caches and supports more complex logic but with higher latency and cost.",
    tags: ["cloudfront", "cloudfront-functions", "edge-computing"],
  },
  {
    id: "saa-qq-68",
    service: "Amazon CloudFront",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A CloudFront distribution serves an API from an ALB origin. The company wants to reduce load on the ALB by caching API responses. However, some API endpoints return user-specific data and should never be cached. How should the distribution be configured?",
    options: [
      "Set the default TTL to 0 for all cache behaviors",
      "Enable Origin Shield for the ALB origin",
      "Use a Lambda@Edge function to bypass caching based on cookies",
      "Create separate cache behaviors: one with caching enabled for public endpoints and one with TTL=0 for user-specific endpoints",
    ],
    correctIndices: [3],
    explanation:
      "CloudFront cache behaviors allow different caching configurations based on URL path patterns. By creating one behavior for public API paths (with caching) and another for user-specific paths (with TTL=0 or no caching), you get optimal performance without serving stale user-specific data.",
    tags: ["cloudfront", "cache-behavior", "ttl", "api"],
  },
  {
    id: "saa-qq-69",
    service: "Amazon CloudFront",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company needs to block CloudFront from serving content to users in specific countries due to licensing restrictions. Which CloudFront feature provides this?",
    options: [
      "CloudFront geographic restriction (geo-restriction)",
      "WAF geographic match rules",
      "CloudFront Signed Cookies",
      "CloudFront Origin Shield",
    ],
    correctIndices: [0],
    explanation:
      "CloudFront's built-in geographic restriction (geo-restriction) allows you to create an allowlist or blocklist of countries. When a user from a blocked country requests content, CloudFront returns a 403 Forbidden response without forwarding the request to the origin.",
    tags: ["cloudfront", "geo-restriction", "compliance"],
  },

  // ─── Amazon Route 53 (70–76) ──────────────────────────────────────────────────
  {
    id: "saa-qq-70",
    service: "Amazon Route 53",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to route users to the AWS region with the lowest network latency. Which Route 53 routing policy should be used?",
    options: [
      "Simple routing",
      "Latency-based routing",
      "Weighted routing",
      "Geolocation routing",
    ],
    correctIndices: [1],
    explanation:
      "Latency-based routing directs users to the AWS region that provides the lowest latency. Route 53 measures actual network latency between users and AWS regions and routes requests to the endpoint with the best latency, improving application performance for global users.",
    tags: ["route53", "latency-routing", "global"],
  },
  {
    id: "saa-qq-71",
    service: "Amazon Route 53",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company is performing a gradual blue-green deployment. They want to send 10% of traffic to the new (green) environment and 90% to the existing (blue) environment. Which Route 53 routing policy supports this?",
    options: [
      "Weighted routing",
      "Geolocation routing",
      "Failover routing",
      "Latency-based routing",
    ],
    correctIndices: [0],
    explanation:
      "Weighted routing lets you assign relative weights to DNS records (e.g., weight 10 for green, weight 90 for blue). Route 53 routes traffic proportionally based on these weights, making it ideal for gradual deployments, A/B testing, and canary releases.",
    tags: ["route53", "weighted-routing", "blue-green", "deployment"],
  },
  {
    id: "saa-qq-72",
    service: "Amazon Route 53",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company has a primary application in us-east-1 and a disaster recovery site in eu-west-1. Route 53 should send all traffic to the primary, but automatically switch to the DR site if the primary fails. Which routing policy achieves this?",
    options: [
      "Latency-based routing",
      "Weighted routing with 99/1 split",
      "Geolocation routing",
      "Failover routing with health checks",
    ],
    correctIndices: [3],
    explanation:
      "Route 53 failover routing uses health checks to monitor the primary endpoint. If the health check fails, Route 53 automatically routes traffic to the secondary (DR) endpoint. This provides DNS-level failover for active-passive disaster recovery configurations.",
    tags: ["route53", "failover", "disaster-recovery", "health-check"],
  },
  {
    id: "saa-qq-73",
    service: "Amazon Route 53",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants European users to be served from a European data center and US users from a US data center. Which Route 53 routing policy achieves this?",
    options: [
      "Latency-based routing",
      "Geolocation routing",
      "Geoproximity routing",
      "Weighted routing",
    ],
    correctIndices: [1],
    explanation:
      "Geolocation routing routes traffic based on the geographic location of the DNS requester (country or continent). By creating records for Europe (→ EU endpoint) and North America (→ US endpoint), users are served from their nearest data center.",
    tags: ["route53", "geolocation-routing", "global"],
  },
  {
    id: "saa-qq-74",
    service: "Amazon Route 53",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company hosts a web application behind an ALB and wants to use a custom domain name (e.g., www.example.com) pointing to the ALB. Which Route 53 record type should be used?",
    options: [
      "MX record pointing to the ALB",
      "CNAME record pointing to the ALB DNS name",
      "A record with an Alias target pointing to the ALB",
      "TXT record with the ALB DNS name",
    ],
    correctIndices: [2],
    explanation:
      "Route 53 Alias records are the preferred way to point a domain (including the zone apex like example.com) to AWS resources like ALBs, CloudFront distributions, and S3 websites. Alias records are free (no charge per query) and support the zone apex, which CNAME records cannot.",
    tags: ["route53", "alias-record", "alb", "dns"],
  },
  {
    id: "saa-qq-75",
    service: "Amazon Route 53",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A global application needs to route users to the closest geographic endpoint but with the ability to shift traffic bias toward specific regions during deployments. Which Route 53 policy supports this?",
    options: [
      "Geolocation routing",
      "Latency-based routing",
      "Geoproximity routing with Traffic Flow bias settings",
      "Weighted routing",
    ],
    correctIndices: [2],
    explanation:
      "Geoproximity routing routes traffic based on geographic distance between users and resources, and supports a bias value (+/-) to expand or shrink the geographic region each endpoint serves. This allows traffic shifting toward specific regions during deployments or maintenance.",
    tags: ["route53", "geoproximity", "traffic-flow", "bias"],
  },
  {
    id: "saa-qq-76",
    service: "Amazon Route 53",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants Route 53 health checks to monitor an HTTP endpoint and automatically failover if the endpoint is unhealthy. Which TWO configurations are required?",
    options: [
      "Create a Route 53 health check targeting the endpoint's IP or domain on the correct port and path",
      "Enable Route 53 DNSSEC for the hosted zone",
      "Associate the health check with the primary DNS record in a failover routing policy",
      "Configure Route 53 to send SNS notifications only — no automatic failover occurs",
      "Set the TTL to 0 on all Route 53 records",
    ],
    correctIndices: [0, 2],
    explanation:
      "Route 53 health checks monitor endpoints and report healthy/unhealthy status. To enable automatic failover, the health check must be associated with the primary record in a failover routing configuration. Route 53 then stops routing to unhealthy primary records and uses the secondary instead.",
    tags: ["route53", "health-check", "failover", "routing"],
  },

  // ─── AWS Lambda (77–84) ───────────────────────────────────────────────────────
  {
    id: "saa-qq-77",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to run backend code in response to HTTP requests without managing servers. Which AWS service is MOST appropriate?",
    options: [
      "Amazon ECS on EC2",
      "Amazon EC2 with Auto Scaling",
      "AWS Elastic Beanstalk",
      "AWS Lambda with Amazon API Gateway",
    ],
    correctIndices: [3],
    explanation:
      "AWS Lambda is a serverless compute service that runs code in response to events without requiring server management. Combined with API Gateway, it forms the standard serverless architecture for HTTP-triggered backend logic, scaling automatically with request volume.",
    tags: ["lambda", "serverless", "api-gateway"],
  },
  {
    id: "saa-qq-78",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "What is the maximum execution timeout for a single AWS Lambda function invocation?",
    options: ["15 minutes", "5 minutes", "30 seconds", "1 hour"],
    correctIndices: [0],
    explanation:
      "AWS Lambda functions have a maximum execution timeout of 15 minutes (900 seconds). For workloads that require longer processing, consider AWS Step Functions, AWS Batch, or EC2-based solutions.",
    tags: ["lambda", "limits", "timeout"],
  },
  {
    id: "saa-qq-79",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A Lambda function is experiencing cold start latency issues for a latency-sensitive application. Which feature reduces cold start latency by keeping function instances initialized?",
    options: [
      "Lambda Layers",
      "Lambda Provisioned Concurrency",
      "Lambda Reserved Concurrency",
      "Lambda@Edge",
    ],
    correctIndices: [1],
    explanation:
      "Provisioned Concurrency keeps a specified number of Lambda execution environments initialized and ready to respond immediately. This eliminates cold start latency for pre-provisioned instances, which is critical for latency-sensitive production workloads.",
    tags: ["lambda", "cold-start", "provisioned-concurrency"],
  },
  {
    id: "saa-qq-80",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A Lambda function is being throttled because it is consuming all available concurrency in the account, starving other functions. Which Lambda feature limits the maximum concurrent executions for this specific function?",
    options: [
      "Lambda Dead Letter Queue",
      "Lambda Destinations",
      "Provisioned Concurrency",
      "Reserved Concurrency",
    ],
    correctIndices: [3],
    explanation:
      "Reserved Concurrency sets both a maximum and a guarantee for a specific function. By setting reserved concurrency on the high-traffic function, you cap its concurrency usage, ensuring that remaining account-level concurrency remains available for other functions.",
    tags: ["lambda", "reserved-concurrency", "throttling"],
  },
  {
    id: "saa-qq-81",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A Lambda function processes messages from an SQS queue. Some messages consistently fail processing and need to be isolated for inspection without blocking the queue. What should be configured?",
    options: [
      "Increase the Lambda function timeout",
      "Configure a Dead Letter Queue (DLQ) on the SQS queue or Lambda event source mapping",
      "Enable Lambda Reserved Concurrency",
      "Set the SQS visibility timeout to match the Lambda timeout",
    ],
    correctIndices: [1],
    explanation:
      "A Dead Letter Queue captures messages that repeatedly fail processing after the maximum receive count. Failed messages are moved to the DLQ where they can be inspected and reprocessed without blocking successful messages in the main queue.",
    tags: ["lambda", "sqs", "dlq", "error-handling"],
  },
  {
    id: "saa-qq-82",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "hard",
    type: "single",
    question:
      "A Lambda function needs to access an RDS database inside a private VPC. The function also needs to call a public AWS API (e.g., S3). What configuration is required?",
    options: [
      "Deploy the Lambda in the VPC; add a NAT Gateway in a public subnet for outbound internet/S3 access",
      "Deploy the Lambda outside the VPC; connect to RDS using a public endpoint",
      "Deploy the Lambda in the VPC; use the default internet route via the VPC's Internet Gateway",
      "Deploy the Lambda in the VPC; no additional networking is needed",
    ],
    correctIndices: [0],
    explanation:
      "When a Lambda function is deployed in a VPC, it loses default internet access. To call public AWS APIs (or reach S3 without a VPC endpoint), a NAT Gateway in a public subnet is required. Alternatively, a VPC endpoint for S3 avoids the need for a NAT Gateway.",
    tags: ["lambda", "vpc", "nat-gateway", "networking"],
  },
  {
    id: "saa-qq-83",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to share common code (e.g., a database library and utility functions) across multiple Lambda functions without duplicating the code in each deployment package. Which TWO approaches support this?",
    options: [
      "Create a Lambda Layer containing the shared code and attach it to each function",
      "Package the shared code directly into each Lambda deployment package",
      "Use Lambda Destinations to share code between functions",
      "Store the shared code in an S3 bucket and reference it as a Lambda Layer",
      "Use AWS SAM to bundle shared code as a nested stack",
    ],
    correctIndices: [0, 3],
    explanation:
      "Lambda Layers allow shared libraries and code to be maintained independently and attached to multiple functions. Layers can be stored in S3 and published as versioned Lambda layers, enabling consistent code sharing across functions without bloating individual deployment packages.",
    tags: ["lambda", "layers", "code-sharing"],
  },
  {
    id: "saa-qq-84",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "A Lambda function needs to access a secret API key stored in AWS Secrets Manager. What is the MOST secure way to pass this secret to the function?",
    options: [
      "Store the API key in a Lambda environment variable in plaintext",
      "Grant the Lambda execution role permissions to retrieve the secret from Secrets Manager at runtime",
      "Pass the API key as a query string parameter in the function's trigger",
      "Hard-code the API key in the Lambda function code",
    ],
    correctIndices: [1],
    explanation:
      "The best practice is to grant the Lambda execution role the secretsmanager:GetSecretValue permission and retrieve the secret at runtime. This avoids storing secrets in code or environment variables, and Secrets Manager handles rotation automatically.",
    tags: ["lambda", "secrets-manager", "security"],
  },

  // ─── Amazon SQS (85–91) ───────────────────────────────────────────────────────
  {
    id: "saa-qq-85",
    service: "Amazon SQS",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to decouple a web application from a backend processing service so that traffic spikes do not overwhelm the backend. Which AWS service is MOST appropriate?",
    options: [
      "AWS Step Functions",
      "Amazon SNS",
      "Amazon Kinesis Data Streams",
      "Amazon SQS",
    ],
    correctIndices: [3],
    explanation:
      "Amazon SQS is a fully managed message queuing service that decouples application components. The web app puts messages into the queue, and the backend processes them at its own pace. SQS acts as a buffer, absorbing traffic spikes without overwhelming downstream services.",
    tags: ["sqs", "decoupling", "queuing"],
  },
  {
    id: "saa-qq-86",
    service: "Amazon SQS",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "A financial application requires that messages in SQS are processed in the exact order they are sent, and that each message is processed only once. Which SQS queue type meets these requirements?",
    options: [
      "Delay Queue",
      "Standard Queue",
      "FIFO Queue",
      "Dead Letter Queue",
    ],
    correctIndices: [2],
    explanation:
      "SQS FIFO (First-In-First-Out) queues guarantee message ordering and exactly-once processing by deduplicating messages using a MessageDeduplicationId. Standard queues provide at-least-once delivery and best-effort ordering, which is insufficient for financial transactions.",
    tags: ["sqs", "fifo", "ordering", "exactly-once"],
  },
  {
    id: "saa-qq-87",
    service: "Amazon SQS",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A consumer receives an SQS message and needs 10 minutes to process it. The queue's visibility timeout is 30 seconds. What will happen if the consumer doesn't finish processing in time?",
    options: [
      "The message is moved to the Dead Letter Queue",
      "SQS automatically extends the visibility timeout",
      "The message is permanently deleted after 30 seconds",
      "The message becomes visible again in the queue and may be delivered to another consumer",
    ],
    correctIndices: [3],
    explanation:
      "When the visibility timeout expires, SQS makes the message visible again so another consumer can receive it. To prevent this, the consumer should either extend the visibility timeout using ChangeMessageVisibility or the visibility timeout should be set longer than the maximum processing time.",
    tags: ["sqs", "visibility-timeout", "message-processing"],
  },
  {
    id: "saa-qq-88",
    service: "Amazon SQS",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "An application sends messages to SQS that should not be processed for 5 minutes after being sent (e.g., to allow cancellation). Which SQS feature supports this?",
    options: [
      "Visibility timeout",
      "Message retention period",
      "Delay queue (delivery delay)",
      "Long polling",
    ],
    correctIndices: [2],
    explanation:
      "SQS delivery delay (delay queue) postpones the delivery of new messages for a specified period (up to 15 minutes). During this delay, the message is invisible to consumers. This is commonly used to allow order cancellations before processing begins.",
    tags: ["sqs", "delay-queue", "message-delivery"],
  },
  {
    id: "saa-qq-89",
    service: "Amazon SQS",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A polling consumer frequently makes empty ReceiveMessage calls to SQS when the queue is empty, incurring unnecessary API costs. Which SQS feature reduces empty receives?",
    options: [
      "Short polling with a high WaitTimeSeconds",
      "Enabling message retention",
      "Increasing the visibility timeout",
      "Long polling by setting WaitTimeSeconds to up to 20 seconds",
    ],
    correctIndices: [3],
    explanation:
      "SQS long polling (WaitTimeSeconds 1–20) keeps the connection open until a message arrives or the wait time expires. This eliminates empty responses when no messages are available, reducing API calls and costs compared to short polling, which returns immediately even if the queue is empty.",
    tags: ["sqs", "long-polling", "cost-optimization"],
  },
  {
    id: "saa-qq-90",
    service: "Amazon SQS",
    domain: "applications",
    difficulty: "hard",
    type: "single",
    question:
      "A company uses SQS to process orders. Some messages fail repeatedly and should be isolated after 3 failed processing attempts. What is the correct configuration?",
    options: [
      "Create a Dead Letter Queue and configure a redrive policy on the main queue with maxReceiveCount=3",
      "Use SQS message attributes to track failure counts",
      "Enable FIFO queue with content-based deduplication",
      "Set the visibility timeout to a very high value to prevent redelivery",
    ],
    correctIndices: [0],
    explanation:
      "A Dead Letter Queue (DLQ) with a redrive policy captures messages that exceed the maxReceiveCount. After 3 failed receives, SQS moves the message to the DLQ, preventing poison pill messages from blocking the main queue and enabling separate analysis of failed messages.",
    tags: ["sqs", "dlq", "redrive-policy", "error-handling"],
  },
  {
    id: "saa-qq-91",
    service: "Amazon SQS",
    domain: "applications",
    difficulty: "hard",
    type: "multi",
    question:
      "A company needs to fan out a single event to multiple SQS queues so that different services can process it independently. Which TWO AWS services work together to implement this pattern?",
    options: [
      "Amazon SNS as the publisher with SQS queues as subscribers",
      "Amazon SQS alone with multiple consumers polling the same queue",
      "Amazon EventBridge with SQS as a target for multiple rules",
      "AWS Step Functions distributing messages to multiple queues",
      "Amazon Kinesis Data Streams with SQS as a consumer",
    ],
    correctIndices: [0, 2],
    explanation:
      "The SNS-to-SQS fan-out pattern (SNS topic with multiple SQS subscriptions) is the classic approach — one publish delivers to all subscribed queues. Amazon EventBridge can also route a single event to multiple SQS targets via separate rules, achieving the same fan-out independently.",
    tags: ["sqs", "sns", "eventbridge", "fan-out", "pub-sub"],
  },

  // ─── Amazon SNS (92–98) ───────────────────────────────────────────────────────
  {
    id: "saa-qq-92",
    service: "Amazon SNS",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to send notifications to multiple endpoints (email, SMS, SQS, Lambda) whenever a new order is placed. Which AWS service implements this pub/sub pattern?",
    options: [
      "Amazon SQS",
      "Amazon EventBridge",
      "AWS Step Functions",
      "Amazon SNS",
    ],
    correctIndices: [3],
    explanation:
      "Amazon SNS (Simple Notification Service) is a fully managed pub/sub messaging service. Publishers send messages to SNS topics, and SNS fans out the message to all subscribed endpoints simultaneously — including email, SMS, SQS queues, Lambda functions, and HTTP endpoints.",
    tags: ["sns", "pub-sub", "fan-out", "notifications"],
  },
  {
    id: "saa-qq-93",
    service: "Amazon SNS",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to ensure that only specific SNS subscribers receive messages matching certain attributes (e.g., only the 'payments' service receives messages with 'category=payment'). Which SNS feature enables this?",
    options: [
      "SNS FIFO topics",
      "SNS message filtering with subscription filter policies",
      "SNS message deduplication",
      "SNS delivery retry policies",
    ],
    correctIndices: [1],
    explanation:
      "SNS subscription filter policies allow subscribers to define a JSON policy that SNS uses to filter which messages are delivered to that subscription. Only messages whose attributes match the filter policy are delivered, reducing unnecessary message processing.",
    tags: ["sns", "filter-policy", "message-filtering"],
  },
  {
    id: "saa-qq-94",
    service: "Amazon SNS",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A company needs to send SMS alerts to on-call engineers when a CloudWatch alarm triggers. Which integration achieves this with the LEAST custom code?",
    options: [
      "CloudWatch Alarm → SNS topic with SMS subscriptions",
      "CloudWatch Alarm → EventBridge → custom target",
      "CloudWatch Alarm → SQS queue → EC2 SMS sender",
      "CloudWatch Alarm → Lambda → custom SMS API",
    ],
    correctIndices: [0],
    explanation:
      "CloudWatch Alarms natively support SNS as an action target. SNS topics can have phone number SMS subscriptions, delivering texts directly when the alarm triggers — no custom code required. This is the simplest, most reliable pattern for operational alerting.",
    tags: ["sns", "cloudwatch", "sms", "alerting"],
  },
  {
    id: "saa-qq-95",
    service: "Amazon SNS",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question: "What is the key difference between Amazon SNS and Amazon SQS?",
    options: [
      "SNS stores messages for up to 14 days; SQS delivers immediately",
      "SNS pushes messages to subscribers immediately (pub/sub); SQS stores messages for consumers to poll",
      "SQS supports multiple subscribers; SNS only supports one",
      "SNS is only for email; SQS is for all message types",
    ],
    correctIndices: [1],
    explanation:
      "SNS is a push-based pub/sub service that immediately fans out messages to all subscribers. SQS is a pull-based queue where messages are stored durably until consumers poll and process them. They are often used together: SNS for fan-out, SQS for reliable, decoupled processing.",
    tags: ["sns", "sqs", "comparison", "pub-sub"],
  },
  {
    id: "saa-qq-96",
    service: "Amazon SNS",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A company needs ordered message delivery and exactly-once deduplication for notifications between microservices using SNS. Which SNS feature supports this?",
    options: [
      "Standard SNS topic with message filtering",
      "Standard SNS topic with SQS FIFO subscription",
      "SNS topic with Lambda subscribers",
      "SNS FIFO topic with SQS FIFO queue subscribers",
    ],
    correctIndices: [3],
    explanation:
      "SNS FIFO topics provide strict message ordering and deduplication within a message group. When subscribed to SQS FIFO queues, the entire fan-out pipeline maintains ordering and exactly-once semantics, which is required for scenarios like financial event processing.",
    tags: ["sns", "fifo", "ordering", "deduplication"],
  },
  {
    id: "saa-qq-97",
    service: "Amazon SNS",
    domain: "applications",
    difficulty: "hard",
    type: "single",
    question:
      "An SNS topic delivers messages to an HTTPS endpoint. The endpoint occasionally returns errors. What does SNS do with failed deliveries by default?",
    options: [
      "Discards the message immediately after the first failure",
      "Retries delivery using an exponential backoff strategy for a configured retry period",
      "Moves the message to an SQS Dead Letter Queue automatically",
      "Sends an alert to the AWS account owner",
    ],
    correctIndices: [1],
    explanation:
      "SNS has a built-in retry policy for HTTP/HTTPS subscribers. The default policy attempts 3 retries with a 20-second delay between each (total retry window of roughly 1 minute). A custom delivery policy can increase retries up to 100 with configurable backoff phases. A DLQ can optionally be configured on the subscription to capture messages that exhaust all retries.",
    tags: ["sns", "retry-policy", "delivery", "https"],
  },
  {
    id: "saa-qq-98",
    service: "Amazon SNS",
    domain: "applications",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to implement a fan-out pattern where a single application event triggers processing by two different Lambda functions and stores a copy in an SQS queue. Which TWO components are needed?",
    options: [
      "An SNS topic that the application publishes to",
      "Three separate SQS queues, one per subscriber",
      "Two Lambda subscriptions and one SQS subscription on the SNS topic",
      "An SQS queue that feeds all three consumers sequentially",
      "An EventBridge event bus as the only alternative",
    ],
    correctIndices: [0, 2],
    explanation:
      "Publishing to a single SNS topic with two Lambda subscriptions and one SQS subscription achieves the fan-out pattern — SNS delivers a copy of each message to all three subscribers simultaneously. This decouples producers from consumers and enables parallel, independent processing.",
    tags: ["sns", "fan-out", "lambda", "sqs"],
  },

  // ─── Amazon CloudWatch (99–105) ───────────────────────────────────────────────
  {
    id: "saa-qq-99",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "easy",
    type: "single",
    question:
      "A solutions architect needs to monitor CPU utilization of EC2 instances and trigger an alarm when it exceeds 80% for 5 consecutive minutes. Which AWS service provides this capability?",
    options: [
      "Amazon CloudWatch",
      "AWS CloudTrail",
      "AWS Trusted Advisor",
      "AWS Config",
    ],
    correctIndices: [0],
    explanation:
      "Amazon CloudWatch collects metrics from AWS services including EC2 CPU utilization. CloudWatch Alarms evaluate metrics over a specified period and trigger actions (SNS notification, Auto Scaling, etc.) when thresholds are breached for a configured number of evaluation periods.",
    tags: ["cloudwatch", "alarms", "ec2", "cpu"],
  },
  {
    id: "saa-qq-100",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "easy",
    type: "single",
    question:
      "An application running on EC2 generates application logs that need to be centrally stored and searchable. Which CloudWatch feature handles this?",
    options: [
      "CloudWatch Metrics",
      "CloudWatch Dashboards",
      "CloudWatch Events",
      "CloudWatch Logs",
    ],
    correctIndices: [3],
    explanation:
      "CloudWatch Logs collects, stores, and enables searching of log data from EC2 instances (via the CloudWatch agent), Lambda functions, API Gateway, and other services. Log groups and log streams organize logs, and CloudWatch Logs Insights enables SQL-like queries.",
    tags: ["cloudwatch", "logs", "centralized-logging"],
  },
  {
    id: "saa-qq-101",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to monitor memory utilization of EC2 instances. They notice that memory metrics are not available in the default CloudWatch metrics. What must be done?",
    options: [
      "Install and configure the CloudWatch agent on the EC2 instance",
      "Use AWS Systems Manager to push memory metrics automatically",
      "Create a custom CloudWatch dashboard",
      "Enable detailed monitoring on the EC2 instance",
    ],
    correctIndices: [0],
    explanation:
      "EC2 default CloudWatch metrics are hypervisor-level and do not include memory, disk usage, or other OS-level metrics. Installing the CloudWatch agent on the instance enables collection of custom metrics including memory, disk, and custom application metrics.",
    tags: ["cloudwatch", "agent", "custom-metrics", "memory"],
  },
  {
    id: "saa-qq-102",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to trigger a Lambda function automatically whenever an EC2 instance state changes to 'stopped'. Which CloudWatch feature should be used?",
    options: [
      "CloudWatch Alarms",
      "CloudWatch Logs subscription filters",
      "Amazon EventBridge (formerly CloudWatch Events) rules",
      "CloudWatch Metrics Insights",
    ],
    correctIndices: [2],
    explanation:
      "Amazon EventBridge (the evolved CloudWatch Events) captures AWS service events including EC2 state changes. An EventBridge rule matching the EC2 instance state change event can invoke a Lambda function, SNS topic, or other targets in near real-time.",
    tags: ["cloudwatch", "eventbridge", "events", "lambda"],
  },
  {
    id: "saa-qq-103",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    question:
      "A solutions architect needs to query large volumes of CloudWatch log data to find specific error patterns across multiple log groups. Which CloudWatch feature is MOST appropriate?",
    options: [
      "CloudWatch Synthetics",
      "CloudWatch Metrics",
      "CloudWatch Logs Insights",
      "CloudWatch Contributor Insights",
    ],
    correctIndices: [2],
    explanation:
      "CloudWatch Logs Insights provides an interactive SQL-like query language for analyzing log data across one or more log groups. It can process billions of log events and return results in seconds, making it ideal for ad-hoc troubleshooting and pattern analysis.",
    tags: ["cloudwatch", "logs-insights", "querying"],
  },
  {
    id: "saa-qq-104",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    question:
      "A company wants to create a unified operational view showing metrics from EC2, RDS, and Lambda on a single screen for their operations team. Which CloudWatch feature provides this?",
    options: [
      "CloudWatch Logs",
      "CloudWatch Alarms",
      "CloudWatch Dashboards",
      "AWS Health Dashboard",
    ],
    correctIndices: [2],
    explanation:
      "CloudWatch Dashboards provide customizable, shareable views of metrics and alarms from multiple AWS services and accounts. Widgets can display line graphs, number metrics, alarm statuses, and log queries, enabling a unified operational view for the ops team.",
    tags: ["cloudwatch", "dashboards", "monitoring"],
  },
  {
    id: "saa-qq-105",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to receive alerts when their API error rate exceeds 5% based on application log data. Which TWO steps are required?",
    options: [
      "Create a CloudWatch Logs metric filter to extract error counts from the log group",
      "Install the CloudWatch agent to enable default API metrics",
      "Create a CloudWatch Alarm on the custom metric created by the metric filter",
      "Use CloudWatch Logs Insights to generate alarms directly from queries",
      "Configure CloudWatch Synthetics to generate the metric",
    ],
    correctIndices: [0, 2],
    explanation:
      "A CloudWatch Logs metric filter extracts numeric values from log data and publishes them as a custom CloudWatch metric. A CloudWatch Alarm can then monitor that custom metric and notify via SNS when the error rate threshold is exceeded, completing the alerting pipeline.",
    tags: ["cloudwatch", "metric-filter", "alarms", "logs"],
  },

  // ─── AWS CloudFormation (106–112) ─────────────────────────────────────────────
  {
    id: "saa-qq-106",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to define its entire AWS infrastructure as code and deploy it consistently across multiple environments. Which AWS service is MOST appropriate?",
    options: [
      "AWS Service Catalog",
      "AWS OpsWorks",
      "AWS Systems Manager",
      "AWS CloudFormation",
    ],
    correctIndices: [3],
    explanation:
      "AWS CloudFormation is an infrastructure-as-code service that allows you to define AWS resources in JSON or YAML templates. CloudFormation provisions and manages resources consistently, supports drift detection, and enables repeatable deployments across dev, staging, and production environments.",
    tags: ["cloudformation", "iac", "infrastructure-as-code"],
  },
  {
    id: "saa-qq-107",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "A CloudFormation stack update fails partway through and some resources are left in an inconsistent state. What does CloudFormation do by default?",
    options: [
      "Rolls back all changes to the previously known good state",
      "Leaves the stack in the partial state and requires manual cleanup",
      "Pauses and waits for manual intervention",
      "Deletes the entire stack",
    ],
    correctIndices: [0],
    explanation:
      "By default, CloudFormation automatically rolls back a failed stack update to the previous known good state (ROLLBACK_COMPLETE). This ensures that a failed update doesn't leave infrastructure in a partial, inconsistent state. Rollback on failure can be disabled for debugging.",
    tags: ["cloudformation", "rollback", "stack-update"],
  },
  {
    id: "saa-qq-108",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A solutions architect wants to reuse common CloudFormation resource definitions (e.g., a standard VPC) across multiple stacks. What is the BEST CloudFormation feature for this?",
    options: [
      "CloudFormation Mappings",
      "Nested Stacks (using AWS::CloudFormation::Stack resource)",
      "CloudFormation Conditions",
      "CloudFormation Parameters",
    ],
    correctIndices: [1],
    explanation:
      "Nested stacks allow you to create modular, reusable CloudFormation templates. A parent stack references child stacks using the AWS::CloudFormation::Stack resource, enabling shared infrastructure components (VPCs, security groups) to be defined once and reused across multiple parent stacks.",
    tags: ["cloudformation", "nested-stacks", "reuse", "modularity"],
  },
  {
    id: "saa-qq-109",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company uses CloudFormation to manage production infrastructure. They want to prevent accidental deletion of a critical RDS database when the stack is deleted. Which CloudFormation feature protects against this?",
    options: [
      "CloudFormation drift detection",
      "CloudFormation StackSets",
      "AWS Config rules",
      "DeletionPolicy: Retain on the RDS resource",
    ],
    correctIndices: [3],
    explanation:
      "The DeletionPolicy attribute on a CloudFormation resource controls what happens when the resource is removed from the stack. Setting DeletionPolicy: Retain preserves the resource even when the stack is deleted, preventing accidental data loss for critical resources like databases.",
    tags: ["cloudformation", "deletion-policy", "retain", "rds"],
  },
  {
    id: "saa-qq-110",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company needs to deploy the same CloudFormation stack across 20 AWS accounts and 3 regions simultaneously. Which CloudFormation feature enables this?",
    options: [
      "Nested Stacks",
      "CloudFormation Change Sets",
      "CloudFormation StackSets",
      "CloudFormation Drift Detection",
    ],
    correctIndices: [2],
    explanation:
      "CloudFormation StackSets extend CloudFormation stacks across multiple AWS accounts and regions with a single operation. With AWS Organizations integration, StackSets can automatically deploy to all accounts in specified OUs, making multi-account, multi-region deployments scalable.",
    tags: ["cloudformation", "stacksets", "multi-account", "multi-region"],
  },
  {
    id: "saa-qq-111",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A solutions architect wants to preview exactly which resources will be created, modified, or deleted before executing a CloudFormation stack update. Which feature provides this preview?",
    options: [
      "CloudFormation Drift Detection",
      "CloudFormation Change Sets",
      "CloudFormation Stack Policies",
      "CloudFormation Resource Import",
    ],
    correctIndices: [1],
    explanation:
      "CloudFormation Change Sets show a preview of what changes will occur before a stack update is executed. They list resource actions (Add, Modify, Remove), the replacement status (True/False), and which properties will change, enabling review and approval before committing the update.",
    tags: ["cloudformation", "change-sets", "preview"],
  },
  {
    id: "saa-qq-112",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "A company has existing AWS resources that were created manually and wants to bring them under CloudFormation management. Which TWO options allow this?",
    options: [
      "Use CloudFormation Resource Import to import existing resources into a stack",
      "Delete and recreate all resources using CloudFormation",
      "Use the CloudFormation console's 'Detect Drift' feature to automatically import resources",
      "Use AWS CloudFormation IaC Generator to generate templates from existing resources",
      "Use AWS Config to automatically create CloudFormation stacks",
    ],
    correctIndices: [0, 3],
    explanation:
      "CloudFormation Resource Import allows existing resources to be adopted into a stack without recreation. The IaC Generator (a separate capability launched in 2024, not to be confused with CloudFormation Designer) can scan existing resources and generate template definitions, making it easier to bootstrap IaC for manually created infrastructure.",
    tags: ["cloudformation", "resource-import", "iac-generator"],
  },

  // ─── Amazon ElastiCache (113–118) ─────────────────────────────────────────────
  {
    id: "saa-qq-113",
    service: "Amazon ElastiCache",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company's RDS database is experiencing high read latency due to repeated queries for the same data. What is the BEST solution to reduce database load and improve response times?",
    options: [
      "Add more RDS Read Replicas",
      "Add an Amazon ElastiCache layer in front of the database",
      "Increase the RDS instance size",
      "Enable RDS Multi-AZ",
    ],
    correctIndices: [1],
    explanation:
      "ElastiCache (Redis or Memcached) provides an in-memory caching layer that serves frequently accessed data at microsecond latency. Caching read-heavy query results reduces database load significantly, improving application response times and reducing database costs.",
    tags: ["elasticache", "caching", "rds", "performance"],
  },
  {
    id: "saa-qq-114",
    service: "Amazon ElastiCache",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company needs an in-memory caching solution that supports data persistence, pub/sub messaging, sorted sets, and automatic failover. Which ElastiCache engine should be used?",
    options: [
      "Memcached",
      "Redis",
      "DynamoDB Accelerator (DAX)",
      "Amazon MemoryDB for Redis",
    ],
    correctIndices: [1],
    explanation:
      "ElastiCache for Redis supports advanced data structures (sorted sets, lists, hashes), pub/sub messaging, data persistence (RDB/AOF snapshots), and Multi-AZ with automatic failover. Memcached is simpler and supports multithreading but lacks these advanced features.",
    tags: ["elasticache", "redis", "memcached", "comparison"],
  },
  {
    id: "saa-qq-115",
    service: "Amazon ElastiCache",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company uses ElastiCache for Redis to store user session data. They need the cache to scale horizontally to handle millions of concurrent users. Which Redis deployment mode enables horizontal scaling?",
    options: [
      "Redis Single-Node",
      "Redis Multi-AZ with Cluster Mode Disabled",
      "Redis Replication Group without clustering",
      "Redis Cluster Mode Enabled",
    ],
    correctIndices: [3],
    explanation:
      "Redis Cluster Mode Enabled (also called Redis Cluster) shards data across multiple node groups (shards), enabling horizontal scaling of both read and write capacity. Each shard holds a subset of the keyspace, allowing the cache to scale beyond the memory of a single node.",
    tags: ["elasticache", "redis-cluster", "scaling", "sharding"],
  },
  {
    id: "saa-qq-116",
    service: "Amazon ElastiCache",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to use ElastiCache for session management but needs the session store to survive a node failure without data loss. Which feature provides this?",
    options: [
      "Memcached with consistent hashing",
      "Redis in single-node mode with snapshots",
      "Redis with Multi-AZ replication and automatic failover",
      "Memcached with multi-threading",
    ],
    correctIndices: [2],
    explanation:
      "ElastiCache for Redis with Multi-AZ creates a synchronous read replica in another AZ. If the primary node fails, ElastiCache automatically promotes the replica to primary within seconds, ensuring session data survives node failures with minimal downtime.",
    tags: ["elasticache", "redis", "multi-az", "failover", "sessions"],
  },
  {
    id: "saa-qq-117",
    service: "Amazon ElastiCache",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "An application uses the lazy loading caching strategy with ElastiCache. What is a key disadvantage of this approach?",
    options: [
      "The cache is always warm, leading to high memory costs",
      "On a cache miss, the data must be fetched from the database and written to the cache, resulting in a slower initial response",
      "All data is always cached, even if it is never requested",
      "The cache cannot be invalidated when data changes in the database",
    ],
    correctIndices: [1],
    explanation:
      "With lazy loading (cache-aside), a cache miss requires three round trips: check the cache, read from the database, and write to the cache. This results in a higher latency for the first request for any given data. However, only requested data is cached, keeping cache utilization efficient.",
    tags: ["elasticache", "caching-strategies", "lazy-loading"],
  },
  {
    id: "saa-qq-118",
    service: "Amazon ElastiCache",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to implement ElastiCache for Redis in a way that maximizes both performance and availability. Which TWO configurations should be implemented?",
    options: [
      "Enable Multi-AZ with automatic failover for the Redis replication group",
      "Use a single-node Redis cluster to minimize latency",
      "Add read replicas to distribute read traffic across multiple nodes",
      "Disable Redis persistence to maximize write throughput",
      "Use Memcached instead of Redis for better availability",
    ],
    correctIndices: [0, 2],
    explanation:
      "Multi-AZ with automatic failover ensures high availability by promoting a replica during primary node failures. Adding read replicas distributes read traffic, improving throughput and performance for read-heavy workloads while the primary handles writes.",
    tags: ["elasticache", "redis", "multi-az", "read-replica", "availability"],
  },

  // ─── Amazon EFS (119–124) ─────────────────────────────────────────────────────
  {
    id: "saa-qq-119",
    service: "Amazon EFS",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Multiple EC2 instances in different Availability Zones need to share the same file system simultaneously. Which AWS storage service supports this?",
    options: [
      "Amazon EBS (gp3 volume)",
      "Amazon FSx for Windows File Server",
      "Amazon S3",
      "Amazon EFS (Elastic File System)",
    ],
    correctIndices: [3],
    explanation:
      "Amazon EFS is a fully managed NFS file system that can be mounted concurrently by thousands of EC2 instances across multiple AZs in a region. EBS volumes can only be attached to one instance at a time (in most configurations), making EFS the right choice for shared concurrent access.",
    tags: ["efs", "shared-storage", "multi-az", "nfs"],
  },
  {
    id: "saa-qq-120",
    service: "Amazon EFS",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company hosts Windows-based EC2 instances that need a managed file system compatible with the SMB protocol. Which AWS service should be used?",
    options: [
      "Amazon EFS",
      "Amazon EBS Multi-Attach",
      "Amazon S3",
      "Amazon FSx for Windows File Server",
    ],
    correctIndices: [3],
    explanation:
      "Amazon FSx for Windows File Server provides a fully managed Windows-native file system that supports the SMB protocol, Windows NTFS, Active Directory integration, and DFS namespaces. EFS uses NFS and is designed for Linux workloads.",
    tags: ["efs", "fsx", "windows", "smb"],
  },
  {
    id: "saa-qq-121",
    service: "Amazon EFS",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company's EFS file system stores large amounts of infrequently accessed files. They want to reduce storage costs automatically without changing their application. Which EFS feature moves cold files to cheaper storage?",
    options: [
      "EFS Lifecycle Management with Infrequent Access (IA) storage class",
      "EFS Burst Throughput",
      "EFS Intelligent-Tiering",
      "EFS Provisioned Throughput",
    ],
    correctIndices: [0],
    explanation:
      "EFS Lifecycle Management automatically moves files that haven't been accessed for a configurable period (7, 14, 30, 60, or 90 days) to the EFS Infrequent Access (IA) storage class, which costs significantly less than Standard. Files are seamlessly moved back to Standard on access.",
    tags: ["efs", "lifecycle", "infrequent-access", "cost"],
  },
  {
    id: "saa-qq-122",
    service: "Amazon EFS",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "An EFS file system is mounted by EC2 instances and needs to deliver consistent, high throughput for a media processing workload regardless of the amount of data stored. Which EFS throughput mode should be used?",
    options: [
      "Elastic Throughput",
      "Provisioned Throughput",
      "Bursting Throughput",
      "Enhanced Throughput",
    ],
    correctIndices: [1],
    explanation:
      "EFS Provisioned Throughput allows you to specify a fixed throughput level (in MiB/s) independent of the file system's storage size. This is ideal for workloads requiring consistent, predictable throughput that exceeds what bursting credits can sustain.",
    tags: ["efs", "provisioned-throughput", "performance"],
  },
  {
    id: "saa-qq-123",
    service: "Amazon EFS",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A company wants to use Amazon EFS across multiple AWS regions for disaster recovery. How can EFS data be replicated to another region?",
    options: [
      "Mount the EFS file system in both regions simultaneously",
      "EFS natively supports cross-region replication via the EFS console",
      "Use S3 Cross-Region Replication to replicate EFS data",
      "Use AWS DataSync to replicate EFS data to another EFS file system in a different region",
    ],
    correctIndices: [1],
    explanation:
      "Amazon EFS Replication enables automatic, continuous replication to another EFS file system in a different region with a recovery point objective (RPO) of minutes. This is configured directly in the EFS console and requires no custom tooling.",
    tags: ["efs", "replication", "disaster-recovery", "cross-region"],
  },
  {
    id: "saa-qq-124",
    service: "Amazon EFS",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to control access to an EFS file system at the directory and file level, ensuring different EC2 instances have different levels of access. Which TWO mechanisms should be used?",
    options: [
      "EFS Access Points with POSIX user and group enforcement",
      "S3 bucket policies applied to EFS mount targets",
      "EFS resource-based policies to restrict IAM principals",
      "Security groups on EC2 instances only",
      "EFS encryption keys in KMS",
    ],
    correctIndices: [0, 2],
    explanation:
      "EFS Access Points provide application-specific entry points with enforced POSIX user identity and a root directory, ensuring different applications see only their designated directory. EFS resource-based policies (file system policies) control which IAM principals can mount and access the file system.",
    tags: ["efs", "access-points", "iam", "access-control"],
  },

  // ─── Amazon S3 Glacier (125–130) ──────────────────────────────────────────────
  {
    id: "saa-qq-125",
    service: "Amazon S3 Glacier",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company needs to archive compliance records that must be retained for 7 years but are rarely accessed. Cost is the primary concern. Which S3 storage class is MOST cost-effective?",
    options: [
      "S3 Glacier Deep Archive",
      "S3 Glacier Instant Retrieval",
      "S3 Standard-IA",
      "S3 Standard",
    ],
    correctIndices: [0],
    explanation:
      "S3 Glacier Deep Archive is the lowest-cost S3 storage class, designed for data that is rarely accessed and can tolerate retrieval times of 12 hours (Standard retrieval) or 48 hours (Bulk retrieval). At roughly $0.00099/GB-month, it is ideal for long-term compliance archiving.",
    tags: ["s3-glacier", "deep-archive", "cost", "compliance"],
  },
  {
    id: "saa-qq-126",
    service: "Amazon S3 Glacier",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company stores archived medical images in S3 Glacier Flexible Retrieval. Occasionally, an urgent request requires an image within 5 minutes. Which retrieval option meets this requirement?",
    options: [
      "Bulk retrieval (5-12 hours)",
      "Instant retrieval (milliseconds)",
      "Standard retrieval (3-5 hours)",
      "Expedited retrieval (1-5 minutes)",
    ],
    correctIndices: [3],
    explanation:
      "Expedited retrievals from S3 Glacier Flexible Retrieval typically complete within 1–5 minutes and are available for archives under 250 MB. Provisioned retrieval capacity can be purchased to guarantee expedited retrieval capacity is available when needed.",
    tags: ["s3-glacier", "expedited-retrieval", "retrieval-options"],
  },
  {
    id: "saa-qq-127",
    service: "Amazon S3 Glacier",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to prevent anyone from deleting Glacier archives for the duration of a regulatory hold (up to 10 years), even AWS support. Which feature enforces this?",
    options: [
      "S3 Bucket Policy with Deny Delete",
      "S3 Object Lock in Governance mode",
      "IAM policy denying glacier:DeleteArchive",
      "Glacier Vault Lock with a Compliance control policy",
    ],
    correctIndices: [3],
    explanation:
      "Glacier Vault Lock enforces compliance controls by locking a vault policy permanently. Once locked, no one — including the root account or AWS — can delete archives before the retention period expires. This satisfies SEC Rule 17a-4(f), HIPAA, and similar immutability requirements.",
    tags: ["s3-glacier", "vault-lock", "compliance", "worm"],
  },
  {
    id: "saa-qq-128",
    service: "Amazon S3 Glacier",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What is the minimum storage duration charge for objects stored in S3 Glacier Flexible Retrieval?",
    options: ["30 days", "90 days", "180 days", "60 days"],
    correctIndices: [1],
    explanation:
      "S3 Glacier Flexible Retrieval has a minimum storage duration of 90 days. Objects deleted, overwritten, or transitioned before 90 days incur a pro-rated early deletion fee for the remaining days. S3 Glacier Deep Archive has a minimum of 180 days.",
    tags: ["s3-glacier", "minimum-storage", "pricing"],
  },
  {
    id: "saa-qq-129",
    service: "Amazon S3 Glacier",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A company uses S3 Glacier Flexible Retrieval and needs to retrieve archives urgently but finds that Expedited retrieval is being throttled. What can be provisioned to guarantee Expedited retrieval capacity?",
    options: [
      "Reserved Vault Capacity",
      "S3 Transfer Acceleration for Glacier",
      "Provisioned Retrieval Capacity units",
      "Dedicated Glacier instances",
    ],
    correctIndices: [2],
    explanation:
      "Provisioned Retrieval Capacity guarantees that Expedited retrievals will not be throttled. Each unit of provisioned capacity ensures that at least 3 Expedited retrievals can be performed every 5 minutes and provides up to 150 MB/s of retrieval throughput.",
    tags: ["s3-glacier", "provisioned-capacity", "expedited-retrieval"],
  },
  {
    id: "saa-qq-130",
    service: "Amazon S3 Glacier",
    domain: "services",
    difficulty: "medium",
    type: "multi",
    question:
      "A company wants to automatically archive S3 Standard objects to S3 Glacier Deep Archive after 365 days and delete them after 10 years. Which TWO S3 features work together to achieve this?",
    options: [
      "S3 Lifecycle rules with transition actions",
      "S3 Replication rules",
      "S3 Lifecycle rules with expiration actions",
      "S3 Intelligent-Tiering with archive configuration",
      "S3 Batch Operations",
    ],
    correctIndices: [0, 2],
    explanation:
      "S3 Lifecycle rules support both transition actions (move objects to a cheaper storage class after a specified number of days) and expiration actions (permanently delete objects after a specified period). Combining both in one lifecycle rule automates the full archive-and-delete workflow.",
    tags: ["s3-glacier", "lifecycle", "transition", "expiration"],
  },

  // ─── Amazon Kinesis (131–137) ─────────────────────────────────────────────────
  {
    id: "saa-qq-131",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "A company needs to collect and process streaming clickstream data from millions of website visitors in real time. Which AWS service is MOST appropriate?",
    options: [
      "Amazon S3",
      "AWS Batch",
      "Amazon SQS",
      "Amazon Kinesis Data Streams",
    ],
    correctIndices: [3],
    explanation:
      "Amazon Kinesis Data Streams is designed for real-time ingestion and processing of large streams of data records. It supports multiple consumers reading from the same stream simultaneously, making it ideal for real-time analytics on high-volume event streams like clickstream data.",
    tags: ["kinesis", "streaming", "real-time", "clickstream"],
  },
  {
    id: "saa-qq-132",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to load streaming data directly into Amazon S3, Amazon Redshift, or Amazon OpenSearch Service without writing custom consumer code. Which Kinesis service supports this?",
    options: [
      "Amazon Kinesis Data Streams",
      "Amazon Kinesis Data Firehose",
      "Amazon Kinesis Video Streams",
      "Amazon Kinesis Data Analytics",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Kinesis Data Firehose is a fully managed service that loads streaming data into destinations like S3, Redshift, OpenSearch Service, and Splunk. It handles batching, compression, and encryption automatically with no consumer application code required.",
    tags: ["kinesis", "firehose", "etl", "s3", "redshift"],
  },
  {
    id: "saa-qq-133",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A Kinesis Data Stream is experiencing high read throughput from multiple consumers. The stream has 4 shards and each consumer is hitting the 2 MB/s read limit per shard. What is the BEST solution to increase read throughput without re-sharding?",
    options: [
      "Convert the stream to a Kinesis Data Firehose",
      "Add more producers to the stream",
      "Increase the retention period of the stream",
      "Enable Enhanced Fan-Out for each consumer",
    ],
    correctIndices: [3],
    explanation:
      "Enhanced Fan-Out provides each registered consumer with a dedicated 2 MB/s throughput per shard via HTTP/2 push, rather than sharing the 2 MB/s limit. With n consumers using Enhanced Fan-Out, total read throughput becomes n × 2 MB/s per shard.",
    tags: ["kinesis", "enhanced-fan-out", "throughput", "consumers"],
  },
  {
    id: "saa-qq-134",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A company uses Kinesis Data Streams to process IoT sensor events. They need to ensure that all events from the same device are processed in order by the same consumer. What determines record ordering and routing to shards?",
    options: [
      "The arrival timestamp of the record",
      "The partition key, which maps each record to a specific shard",
      "The sequence number assigned by Kinesis",
      "The consumer's shard iterator position",
    ],
    correctIndices: [1],
    explanation:
      "The partition key provided when putting a record into Kinesis determines which shard the record is assigned to via MD5 hashing. By using the device ID as the partition key, all events from the same device go to the same shard and are processed in order by the consumer reading that shard.",
    tags: ["kinesis", "partition-key", "ordering", "shards"],
  },
  {
    id: "saa-qq-135",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "medium",
    type: "single",
    question:
      "A Kinesis Data Stream has 10 shards. Each shard can ingest 1 MB/s or 1,000 records/second. The stream is receiving 8,000 records/second and is experiencing write throttling (ProvisionedThroughputExceededException). What is the MOST appropriate action?",
    options: [
      "Enable Enhanced Fan-Out",
      "Increase the number of shards (re-shard the stream)",
      "Increase the record size to reduce the number of records",
      "Switch to Kinesis Data Firehose",
    ],
    correctIndices: [1],
    explanation:
      "Write throughput is limited by the number of shards (10 shards × 1,000 records/s = 10,000 records/s). With 8,000 records/s approaching the limit, adding shards via re-sharding increases write capacity. Enhanced Fan-Out increases read throughput, not write throughput.",
    tags: ["kinesis", "resharding", "throttling", "write-throughput"],
  },
  {
    id: "saa-qq-136",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "hard",
    type: "single",
    question:
      "A company uses Kinesis Data Firehose to deliver streaming data to S3. They need to transform the records (e.g., convert JSON to Parquet) before delivery. Which Firehose feature supports in-stream transformation?",
    options: [
      "Kinesis Firehose format conversion to Parquet/ORC via built-in schema integration with Glue",
      "Both B and C are valid approaches",
      "Kinesis Firehose data transformation using AWS Lambda",
      "Kinesis Data Analytics for Apache Flink",
    ],
    correctIndices: [1],
    explanation:
      "Kinesis Data Firehose supports two transformation mechanisms: Lambda-based transformation (invoke a Lambda function to process each batch) and built-in format conversion (convert JSON to Parquet or ORC using an AWS Glue Data Catalog schema). Both are valid depending on the use case.",
    tags: ["kinesis", "firehose", "transformation", "lambda", "glue"],
  },
  {
    id: "saa-qq-137",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    question:
      "A company needs to run real-time SQL queries on a Kinesis Data Stream to detect anomalies and send alerts. Which TWO services work together to achieve this?",
    options: [
      "Amazon Kinesis Data Analytics (Apache Flink) to process the stream with SQL or Flink applications",
      "Amazon Kinesis Data Firehose as the processing engine",
      "Amazon SNS or Lambda as the destination for anomaly alerts",
      "Amazon Redshift for real-time stream processing",
      "AWS Glue Streaming ETL for real-time anomaly detection",
    ],
    correctIndices: [0, 2],
    explanation:
      "Kinesis Data Analytics for Apache Flink allows real-time SQL or Java/Python Flink applications to process streaming data from Kinesis Data Streams. Results (anomalies) can be sent to Lambda for custom alerting or to SNS for notifications, completing the real-time detection pipeline.",
    tags: ["kinesis", "data-analytics", "flink", "real-time", "alerting"],
  },

  // ─── AWS WAF (138–144) ────────────────────────────────────────────────────────
  {
    id: "saa-qq-138",
    service: "AWS WAF",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "A company wants to protect its web application from common web exploits like SQL injection and cross-site scripting (XSS). Which AWS service provides this protection?",
    options: [
      "AWS Shield Standard",
      "AWS WAF (Web Application Firewall)",
      "Amazon GuardDuty",
      "AWS Network Firewall",
    ],
    correctIndices: [1],
    explanation:
      "AWS WAF is a web application firewall that protects applications from common web exploits by allowing you to define rules that block, allow, or count requests based on conditions like SQL injection patterns, XSS signatures, IP addresses, and geographic location.",
    tags: ["waf", "sql-injection", "xss", "web-security"],
  },
  {
    id: "saa-qq-139",
    service: "AWS WAF",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS services can AWS WAF be deployed in front of to protect web applications? (Choose the MOST complete correct answer)",
    options: [
      "Amazon EC2 instances only",
      "Amazon CloudFront, Application Load Balancer, API Gateway, and AWS AppSync",
      "Amazon S3 and Amazon RDS",
      "Amazon VPC and AWS Direct Connect",
    ],
    correctIndices: [1],
    explanation:
      "AWS WAF can be associated with Amazon CloudFront distributions, Application Load Balancers, Amazon API Gateway REST APIs, AWS AppSync GraphQL APIs, and Amazon Cognito user pools. It cannot be directly applied to EC2 instances, S3, or RDS.",
    tags: ["waf", "deployment", "cloudfront", "alb", "api-gateway"],
  },
  {
    id: "saa-qq-140",
    service: "AWS WAF",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A company is experiencing a DDoS attack targeting its web application with a flood of HTTP requests from thousands of IP addresses. Which WAF feature can automatically block IP addresses sending too many requests?",
    options: [
      "AWS WAF IP set rules",
      "AWS WAF rate-based rules",
      "AWS WAF regex pattern rules",
      "AWS WAF managed rule groups",
    ],
    correctIndices: [1],
    explanation:
      "WAF rate-based rules automatically track the number of requests from individual IP addresses over a rolling 5-minute window. When an IP exceeds the configured threshold, WAF blocks subsequent requests from that IP until the rate drops below the threshold.",
    tags: ["waf", "rate-limiting", "ddos", "rate-based-rules"],
  },
  {
    id: "saa-qq-141",
    service: "AWS WAF",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to quickly add protection against the OWASP Top 10 vulnerabilities to their CloudFront distribution without writing custom WAF rules. What is the EASIEST approach?",
    options: [
      "Use Amazon GuardDuty with WAF integration",
      "Enable AWS Shield Advanced",
      "Write custom regex rules for each OWASP vulnerability",
      "Use AWS WAF Managed Rule Groups (e.g., AWS Managed Rules for Core Rule Set)",
    ],
    correctIndices: [3],
    explanation:
      "AWS Managed Rule Groups are pre-configured rule sets maintained by AWS and AWS Marketplace sellers that protect against common threats like the OWASP Top 10. The AWS Core Rule Set (CRS) covers SQL injection, XSS, and other common vulnerabilities without any rule authoring.",
    tags: ["waf", "managed-rules", "owasp", "crs"],
  },
  {
    id: "saa-qq-142",
    service: "AWS WAF",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A company uses AWS WAF across 50 AWS accounts and wants to centrally manage WAF rules and apply them consistently. Which AWS service enables centralized WAF policy management?",
    options: [
      "AWS Organizations SCPs",
      "AWS Firewall Manager",
      "AWS Security Hub",
      "AWS Config",
    ],
    correctIndices: [1],
    explanation:
      "AWS Firewall Manager provides centralized security policy management across AWS accounts and resources in AWS Organizations. It allows security admins to create WAF rules once and automatically apply them to all accounts and resources (ALBs, CloudFront, API Gateway) across the organization.",
    tags: ["waf", "firewall-manager", "organizations", "centralized"],
  },
  {
    id: "saa-qq-143",
    service: "AWS WAF",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "A company's WAF is blocking legitimate bot traffic from a search engine crawler. They need to allow specific bots while blocking malicious ones. Which WAF feature addresses this?",
    options: [
      "Rate-based rules set to a high threshold for all bots",
      "AWS WAF Bot Control managed rule group with targeted inspection for common bots",
      "Custom IP set rules whitelisting search engine IP ranges",
      "AWS Shield Advanced bot protection",
    ],
    correctIndices: [1],
    explanation:
      "AWS WAF Bot Control is a managed rule group that categorizes bots (common bots, verified bots, malicious bots). It can verify legitimate search engine crawlers (Google, Bing) using their verified signatures and allow them while blocking unverified or malicious bots.",
    tags: ["waf", "bot-control", "managed-rules", "bots"],
  },
  {
    id: "saa-qq-144",
    service: "AWS WAF",
    domain: "security",
    difficulty: "hard",
    type: "multi",
    question:
      "A company wants to use AWS WAF to protect their API Gateway and needs to block requests from specific countries and limit each user to 1000 requests per minute. Which TWO WAF rule types achieve this?",
    options: [
      "A geographic match rule blocking traffic from specified countries",
      "A managed rule group for country-based blocking",
      "A rate-based rule with a threshold of 1000 requests and IP-based aggregation",
      "An IP set rule listing all IPs from blocked countries",
      "A regex pattern rule matching country codes in request headers",
    ],
    correctIndices: [0, 2],
    explanation:
      "A geographic match rule in WAF allows you to block or allow requests based on the country of origin detected from the request's IP address. A rate-based rule with a 1000-request threshold and IP-based aggregation automatically blocks IPs that exceed the rate limit within the evaluation window.",
    tags: ["waf", "geo-match", "rate-based", "api-gateway"],
  },
];
