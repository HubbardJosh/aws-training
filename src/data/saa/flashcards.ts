import { FlashCard } from "../../types";

export const flashcards: FlashCard[] = [
  // ── Amazon EC2 ──
  {
    id: "saa-ec2-1",
    service: "Amazon EC2",
    domain: "deployment",
    question:
      "What are the four EC2 purchasing options and when should you use each?",
    answer:
      "On-Demand for unpredictable workloads (pay per second, no commitment). Reserved for steady-state workloads (up to 72% savings, 1-3 year term). Spot for fault-tolerant batch jobs (up to 90% savings, can be interrupted). Dedicated Hosts for compliance or per-socket licensing requirements.",
    keyPoints: [
      "On-Demand: flexible, highest cost",
      "Reserved: committed, 72% savings",
      "Spot: interruptible, 90% savings",
      "Dedicated: physical isolation for compliance",
    ],
    difficulty: "medium",
    tags: ["ec2", "pricing", "compute"],
  },
  {
    id: "saa-ec2-2",
    service: "Amazon EC2",
    domain: "deployment",
    question: "What is an EC2 placement group and what are the three types?",
    answer:
      "A placement group controls how EC2 instances are placed on underlying hardware. Cluster places instances close together in one AZ for low latency. Spread places instances on separate hardware to reduce correlated failures. Partition divides instances into logical partitions on separate racks, useful for distributed systems like HDFS.",
    keyPoints: [
      "Cluster: low latency, same AZ",
      "Spread: max 7 instances per AZ per group",
      "Partition: separate racks, large distributed workloads",
    ],
    difficulty: "medium",
    tags: ["ec2", "placement", "compute"],
  },
  {
    id: "saa-ec2-3",
    service: "Amazon EC2",
    domain: "deployment",
    question:
      "What is the difference between an instance store and an EBS volume?",
    answer:
      "Instance store is physically attached to the host and provides the highest IOPS but data is lost when the instance stops or terminates. EBS is a network-attached persistent volume that survives instance stops and can be detached and reattached to other instances.",
    keyPoints: [
      "Instance store: ephemeral, high IOPS",
      "EBS: persistent, survives stop/start",
      "EBS can be snapshotted to S3",
    ],
    difficulty: "easy",
    tags: ["ec2", "storage", "compute"],
  },
  {
    id: "saa-ec2-4",
    service: "Amazon EC2",
    domain: "deployment",
    question: "What is EC2 User Data and when does it run?",
    answer:
      "User Data is a script that runs automatically on first boot of an EC2 instance. It runs as root and is used to bootstrap the instance—installing packages, pulling code, or configuring services. It only runs once by default unless explicitly configured to run on every start.",
    keyPoints: [
      "Runs on first boot only by default",
      "Executes as root user",
      "Used for bootstrapping and configuration",
    ],
    difficulty: "easy",
    tags: ["ec2", "bootstrap", "compute"],
  },
  {
    id: "saa-ec2-5",
    service: "Amazon EC2",
    domain: "deployment",
    question: "How does EC2 Auto Recovery differ from Auto Scaling?",
    answer:
      "Auto Recovery monitors a single instance with a CloudWatch alarm and automatically migrates it to new hardware if the underlying host fails, preserving the instance ID, IP addresses, and attached EBS volumes. Auto Scaling manages a fleet of instances, replacing terminated ones to maintain a desired count.",
    keyPoints: [
      "Auto Recovery: same instance, new hardware",
      "Auto Scaling: new instance from launch template",
      "Auto Recovery preserves instance ID and IPs",
    ],
    difficulty: "hard",
    tags: ["ec2", "recovery", "compute"],
  },
  {
    id: "saa-ec2-6",
    service: "Amazon EC2",
    domain: "deployment",
    question:
      "What EC2 instance types are optimized for memory-intensive workloads?",
    answer:
      "R-family instances (e.g., r6g, r6i) are memory-optimized for in-memory databases and real-time big data analytics. X-family instances offer the highest memory-to-compute ratio for SAP HANA and large in-memory databases. High Memory instances provide up to 24 TB of RAM.",
    keyPoints: [
      "R-family: general memory-optimized",
      "X-family: extreme memory/compute ratio",
      "z1d: high compute + high memory",
    ],
    difficulty: "medium",
    tags: ["ec2", "instance-types", "compute"],
  },
  {
    id: "saa-ec2-7",
    service: "Amazon EC2",
    domain: "deployment",
    question:
      "What is an EC2 Spot Fleet and how does it differ from a Spot Instance request?",
    answer:
      "A Spot Fleet is a collection of Spot Instances and optionally On-Demand instances that attempts to meet a target capacity. It automatically selects the best instance pools based on your allocation strategy (lowestPrice, diversified, or capacityOptimized). A single Spot Instance request targets one specific instance type and AZ.",
    keyPoints: [
      "Spot Fleet manages a mix of instance types",
      "Allocation strategies: lowestPrice, diversified, capacityOptimized",
      "Can include On-Demand instances as baseline",
    ],
    difficulty: "hard",
    tags: ["ec2", "spot", "compute"],
  },

  // ── Amazon S3 ──
  {
    id: "saa-s3-1",
    service: "Amazon S3",
    domain: "services",
    question: "What are the S3 storage classes and their use cases?",
    answer:
      "S3 Standard for frequently accessed data. S3 Standard-IA for infrequent access with rapid retrieval. S3 One Zone-IA for infrequent, non-critical data in one AZ. S3 Intelligent-Tiering for unknown or changing access patterns. S3 Glacier Instant Retrieval for archive data needing millisecond access. S3 Glacier Flexible and Deep Archive for long-term archival.",
    keyPoints: [
      "Standard: 99.99% availability, 3+ AZs",
      "IA classes: cheaper storage, retrieval fee",
      "Intelligent-Tiering: automatic cost optimization",
      "Glacier: archival, minutes to hours retrieval",
    ],
    difficulty: "medium",
    tags: ["s3", "storage", "storage-classes"],
  },
  {
    id: "saa-s3-2",
    service: "Amazon S3",
    domain: "services",
    question: "What is S3 Transfer Acceleration and when should you use it?",
    answer:
      "S3 Transfer Acceleration uses CloudFront edge locations to accelerate uploads to S3. Data is routed over the AWS backbone network instead of the public internet. It is most beneficial when uploading large files from geographically distant locations and can improve speeds by up to 500%.",
    keyPoints: [
      "Uses CloudFront edge locations",
      "Accelerates long-distance uploads",
      "Additional cost per GB transferred",
    ],
    difficulty: "easy",
    tags: ["s3", "performance", "storage"],
  },
  {
    id: "saa-s3-3",
    service: "Amazon S3",
    domain: "services",
    question:
      "What is S3 Versioning and what happens when you delete a versioned object?",
    answer:
      "Versioning keeps multiple versions of an object in the same bucket. When you delete a versioned object without specifying a version ID, S3 adds a delete marker rather than permanently removing the data. The previous versions remain and can be restored by deleting the delete marker.",
    keyPoints: [
      "Delete marker hides object, doesn't remove versions",
      "Must delete specific version IDs to purge data",
      "Versioning is bucket-level, once enabled cannot be disabled (only suspended)",
    ],
    difficulty: "medium",
    tags: ["s3", "versioning", "storage"],
  },
  {
    id: "saa-s3-4",
    service: "Amazon S3",
    domain: "services",
    question:
      "How does S3 Cross-Region Replication (CRR) work and what are its requirements?",
    answer:
      "CRR asynchronously replicates objects from a source bucket in one region to a destination bucket in a different region. Both buckets must have versioning enabled. CRR does not replicate existing objects (only new ones after configuration), delete markers, or objects encrypted with customer-managed keys by default.",
    keyPoints: [
      "Both buckets need versioning enabled",
      "Asynchronous replication",
      "Existing objects not replicated automatically",
      "Requires IAM role with replication permissions",
    ],
    difficulty: "medium",
    tags: ["s3", "replication", "storage"],
  },
  {
    id: "saa-s3-5",
    service: "Amazon S3",
    domain: "services",
    question: "What is an S3 pre-signed URL and when would you use it?",
    answer:
      "A pre-signed URL grants temporary access to a private S3 object without requiring AWS credentials. It is generated by an authorized user and includes a signature and expiration time. Use it to allow external users to upload or download specific objects securely without making the bucket public.",
    keyPoints: [
      "Time-limited access to private objects",
      "Inherits permissions of the generating IAM identity",
      "Supports both GET and PUT operations",
    ],
    difficulty: "easy",
    tags: ["s3", "security", "storage"],
  },
  {
    id: "saa-s3-6",
    service: "Amazon S3",
    domain: "services",
    question:
      "What is S3 Object Lock and what compliance modes does it support?",
    answer:
      "S3 Object Lock prevents objects from being deleted or overwritten for a specified retention period using a WORM (Write Once Read Many) model. Governance mode allows users with special permissions to override the lock. Compliance mode prevents anyone, including the root account, from deleting the object during the retention period.",
    keyPoints: [
      "Governance: privileged users can override",
      "Compliance: no one can delete, including root",
      "Requires versioning enabled on the bucket",
    ],
    difficulty: "hard",
    tags: ["s3", "compliance", "storage"],
  },
  {
    id: "saa-s3-7",
    service: "Amazon S3",
    domain: "services",
    question: "What is S3 multipart upload and when is it required?",
    answer:
      "Multipart upload allows uploading a single object as a set of parts in parallel, improving throughput and allowing recovery from network errors. It is required for objects larger than 5 GB and recommended for objects over 100 MB. Parts can be uploaded independently and in any order.",
    keyPoints: [
      "Required for objects > 5 GB",
      "Recommended for objects > 100 MB",
      "Parts uploaded in parallel for speed",
      "Incomplete uploads accrue storage costs unless lifecycle rule cleans them",
    ],
    difficulty: "medium",
    tags: ["s3", "performance", "storage"],
  },

  // ── Amazon VPC ──
  {
    id: "saa-vpc-1",
    service: "Amazon VPC",
    domain: "deployment",
    question:
      "What is the difference between a public subnet and a private subnet in a VPC?",
    answer:
      "A public subnet has a route to an Internet Gateway, allowing resources to receive inbound traffic from the internet. A private subnet has no direct internet route; instances use a NAT Gateway or NAT Instance to initiate outbound internet connections. Public subnets host load balancers and bastion hosts; private subnets host databases and application servers.",
    keyPoints: [
      "Public subnet: route to IGW exists",
      "Private subnet: outbound via NAT only",
      "NAT Gateway is managed; NAT Instance is self-managed",
    ],
    difficulty: "easy",
    tags: ["vpc", "networking", "subnets"],
  },
  {
    id: "saa-vpc-2",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What is a Security Group vs a Network ACL (NACL)?",
    answer:
      "Security Groups are stateful firewalls attached to instances/ENIs; return traffic is automatically allowed. NACLs are stateless firewalls at the subnet level; you must explicitly allow both inbound and outbound traffic. NACLs are evaluated in rule number order and support DENY rules; Security Groups only support ALLOW rules.",
    keyPoints: [
      "Security Group: stateful, instance level, allow only",
      "NACL: stateless, subnet level, allow and deny",
      "NACL rules evaluated in order (lowest number first)",
    ],
    difficulty: "medium",
    tags: ["vpc", "security", "networking"],
  },
  {
    id: "saa-vpc-3",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What is VPC Peering and what are its limitations?",
    answer:
      "VPC Peering creates a private network connection between two VPCs allowing traffic to route using private IP addresses. It works across accounts and regions. Key limitations: no transitive routing (A-B and B-C peered does not allow A-C traffic), no overlapping CIDR blocks, and no edge-to-edge routing through VPN or Direct Connect.",
    keyPoints: [
      "No transitive peering",
      "CIDRs must not overlap",
      "Works cross-account and cross-region",
    ],
    difficulty: "medium",
    tags: ["vpc", "peering", "networking"],
  },
  {
    id: "saa-vpc-4",
    service: "Amazon VPC",
    domain: "deployment",
    question:
      "What is AWS Transit Gateway and how does it simplify multi-VPC connectivity?",
    answer:
      "Transit Gateway acts as a regional hub that connects VPCs, VPNs, and Direct Connect connections through a single gateway. Instead of creating a mesh of VPC peering connections (N*(N-1)/2 connections for N VPCs), each VPC attaches once to the Transit Gateway. It supports transitive routing, route tables, and multicast.",
    keyPoints: [
      "Hub-and-spoke model replacing peering mesh",
      "Supports transitive routing",
      "Can connect VPCs, VPN, and Direct Connect",
    ],
    difficulty: "hard",
    tags: ["vpc", "transit-gateway", "networking"],
  },
  {
    id: "saa-vpc-5",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What is a VPC Endpoint and what types exist?",
    answer:
      "A VPC Endpoint allows private connectivity to AWS services without internet traffic. Interface Endpoints create an ENI with a private IP in your subnet (powered by PrivateLink) and support most AWS services. Gateway Endpoints are free, added to route tables, and support only S3 and DynamoDB.",
    keyPoints: [
      "Interface Endpoint: ENI-based, hourly charge, most services",
      "Gateway Endpoint: free, route-table-based, S3 and DynamoDB only",
      "Keeps traffic on AWS backbone",
    ],
    difficulty: "medium",
    tags: ["vpc", "endpoints", "networking"],
  },
  {
    id: "saa-vpc-6",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What is the purpose of an Elastic IP address in a VPC?",
    answer:
      "An Elastic IP (EIP) is a static public IPv4 address that you can allocate to your account and associate with instances or NAT Gateways. Unlike automatically assigned public IPs which change on stop/start, an EIP persists until you release it. You are charged when an EIP is allocated but not associated with a running instance.",
    keyPoints: [
      "Static public IPv4, persists across stop/start",
      "Charged when unattached",
      "One EIP free per running instance",
    ],
    difficulty: "easy",
    tags: ["vpc", "networking", "ip-addressing"],
  },
  {
    id: "saa-vpc-7",
    service: "Amazon VPC",
    domain: "deployment",
    question: "How does VPC Flow Logs help with network troubleshooting?",
    answer:
      "VPC Flow Logs capture metadata about IP traffic going to and from network interfaces in a VPC, subnet, or ENI. Logs include source/destination IPs, ports, protocol, packet count, and whether traffic was accepted or rejected. They are published to CloudWatch Logs or S3 and are essential for security analysis and troubleshooting connectivity issues.",
    keyPoints: [
      "Captures accepted and rejected traffic",
      "Does not capture payload, only metadata",
      "Published to CloudWatch Logs or S3",
    ],
    difficulty: "medium",
    tags: ["vpc", "monitoring", "networking"],
  },

  // ── Amazon RDS ──
  {
    id: "saa-rds-1",
    service: "Amazon RDS",
    domain: "services",
    question: "What is an RDS Multi-AZ deployment and how does failover work?",
    answer:
      "Multi-AZ creates a synchronous standby replica in a different AZ. AWS automatically fails over to the standby if the primary fails—the DNS endpoint is updated to point to the standby, typically within 1–2 minutes. The standby cannot serve read traffic; it exists only for high availability.",
    keyPoints: [
      "Synchronous replication to standby",
      "Automatic failover via DNS update",
      "Standby is not a read replica",
      "Protects against AZ failures",
    ],
    difficulty: "easy",
    tags: ["rds", "high-availability", "database"],
  },
  {
    id: "saa-rds-2",
    service: "Amazon RDS",
    domain: "services",
    question:
      "What is an RDS Read Replica and how does it differ from Multi-AZ?",
    answer:
      "Read Replicas use asynchronous replication and are used to scale read traffic horizontally. They can be in the same AZ, different AZ, or different region. Unlike Multi-AZ standbys, Read Replicas can serve read queries. They can be promoted to standalone DB instances but promotion breaks replication.",
    keyPoints: [
      "Asynchronous replication (slight lag possible)",
      "Serves read traffic, scales read performance",
      "Can be cross-region",
      "Promotion makes it an independent DB",
    ],
    difficulty: "medium",
    tags: ["rds", "read-replica", "database"],
  },
  {
    id: "saa-rds-3",
    service: "Amazon RDS",
    domain: "services",
    question:
      "What is Amazon Aurora and how does its storage architecture differ from standard RDS?",
    answer:
      "Aurora is a MySQL/PostgreSQL-compatible engine that uses a distributed, self-healing storage system spanning 6 copies across 3 AZs. It automatically repairs corrupted data and scales storage automatically up to 128 TB. Aurora typically provides up to 5x the throughput of MySQL and 3x that of PostgreSQL.",
    keyPoints: [
      "6 copies of data across 3 AZs",
      "Storage auto-scales up to 128 TB",
      "Compatible with MySQL and PostgreSQL",
      "Up to 15 read replicas with low replica lag",
    ],
    difficulty: "medium",
    tags: ["rds", "aurora", "database"],
  },
  {
    id: "saa-rds-4",
    service: "Amazon RDS",
    domain: "services",
    question:
      "How does RDS automated backup work and what is the retention policy?",
    answer:
      "RDS takes daily automated backups during a configurable backup window and captures transaction logs every 5 minutes. This enables point-in-time restore to any second within the retention period. Retention can be set from 1 to 35 days. Automated backups are deleted when you delete the DB instance unless you take a final snapshot.",
    keyPoints: [
      "Retention: 1–35 days",
      "Point-in-time restore to any second",
      "Transaction logs captured every 5 minutes",
    ],
    difficulty: "easy",
    tags: ["rds", "backup", "database"],
  },
  {
    id: "saa-rds-5",
    service: "Amazon RDS",
    domain: "services",
    question: "What is RDS Proxy and why would you use it?",
    answer:
      "RDS Proxy is a fully managed database proxy that pools and shares connections to RDS and Aurora databases. It reduces database load from connection overhead (important for Lambda and other serverless workloads that open many short-lived connections). It also improves failover time by up to 66% and supports IAM authentication and Secrets Manager.",
    keyPoints: [
      "Connection pooling reduces DB load",
      "Critical for Lambda + RDS patterns",
      "Improves failover time by up to 66%",
      "Supports IAM auth and Secrets Manager",
    ],
    difficulty: "hard",
    tags: ["rds", "proxy", "database"],
  },
  {
    id: "saa-rds-6",
    service: "Amazon RDS",
    domain: "services",
    question:
      "What encryption options does RDS support and when must you enable them?",
    answer:
      "RDS supports encryption at rest using AWS KMS for the DB instance, automated backups, read replicas, and snapshots. Encryption must be enabled at creation time and cannot be added to an existing unencrypted instance. To encrypt an existing DB: take a snapshot, copy it with encryption enabled, and restore from the encrypted snapshot.",
    keyPoints: [
      "Encryption enabled at creation only",
      "To encrypt existing: snapshot → encrypt copy → restore",
      "In-transit encryption via SSL/TLS",
    ],
    difficulty: "medium",
    tags: ["rds", "encryption", "database"],
  },
  {
    id: "saa-rds-7",
    service: "Amazon RDS",
    domain: "services",
    question:
      "When should you choose Aurora Serverless vs. provisioned Aurora?",
    answer:
      "Aurora Serverless v2 automatically scales capacity up and down based on application demand in fine-grained increments. Choose it for variable or unpredictable workloads, development/test environments, or multi-tenant applications with varying per-tenant loads. Provisioned Aurora is better for steady, predictable workloads where you need fixed, predictable capacity and cost.",
    keyPoints: [
      "Serverless: variable workloads, auto-scaling ACUs",
      "Provisioned: steady workload, predictable cost",
      "Serverless v2 scales in increments of 0.5 ACUs",
    ],
    difficulty: "hard",
    tags: ["rds", "aurora", "database"],
  },

  // ── Amazon DynamoDB ──
  {
    id: "saa-dynamodb-1",
    service: "Amazon DynamoDB",
    domain: "development",
    question:
      "What is DynamoDB's consistency model and what are the two read options?",
    answer:
      "DynamoDB offers Eventually Consistent Reads (default) which may return stale data but cost half as many read capacity units. Strongly Consistent Reads always return the most up-to-date data but cost more. For most use cases, eventual consistency is sufficient; use strong consistency when your application cannot tolerate stale reads.",
    keyPoints: [
      "Eventually consistent: default, cheaper, possible stale data",
      "Strongly consistent: latest data, 2x RCU cost",
      "Transactions always strongly consistent",
    ],
    difficulty: "easy",
    tags: ["dynamodb", "consistency", "nosql"],
  },
  {
    id: "saa-dynamodb-2",
    service: "Amazon DynamoDB",
    domain: "development",
    question:
      "What is a DynamoDB partition key and sort key, and how do they determine data distribution?",
    answer:
      "The partition key (hash key) is hashed to determine which partition stores the item. The sort key (range key) orders items within a partition and enables range queries. A high-cardinality partition key distributes data and load evenly; a low-cardinality key (e.g., a status field) causes hot partitions and throttling.",
    keyPoints: [
      "Partition key determines physical storage location",
      "Sort key enables range queries within a partition",
      "High cardinality partition key prevents hot partitions",
    ],
    difficulty: "medium",
    tags: ["dynamodb", "data-modeling", "nosql"],
  },
  {
    id: "saa-dynamodb-3",
    service: "Amazon DynamoDB",
    domain: "development",
    question:
      "What is a DynamoDB Global Secondary Index (GSI) vs a Local Secondary Index (LSI)?",
    answer:
      "A GSI has a different partition key (and optional sort key) than the base table and can be created at any time. It has its own capacity settings and can span all partitions. An LSI shares the same partition key as the base table but has a different sort key; it must be created at table creation time and shares the table's capacity.",
    keyPoints: [
      "GSI: different partition key, created anytime, own capacity",
      "LSI: same partition key, different sort key, created at table creation only",
      "Maximum 20 GSIs and 5 LSIs per table",
    ],
    difficulty: "hard",
    tags: ["dynamodb", "indexes", "nosql"],
  },
  {
    id: "saa-dynamodb-4",
    service: "Amazon DynamoDB",
    domain: "development",
    question:
      "What is DynamoDB Streams and how can it be used for event-driven architectures?",
    answer:
      "DynamoDB Streams captures a time-ordered sequence of item-level modifications in a table for up to 24 hours. Each record contains the type of modification (INSERT, MODIFY, REMOVE) and optionally the before/after images. Streams can trigger AWS Lambda functions to build event-driven pipelines, replicate data, or update search indexes.",
    keyPoints: [
      "24-hour retention window",
      "Triggers Lambda for event-driven processing",
      "Supports NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES",
    ],
    difficulty: "medium",
    tags: ["dynamodb", "streams", "nosql"],
  },
  {
    id: "saa-dynamodb-5",
    service: "Amazon DynamoDB",
    domain: "development",
    question: "What is DynamoDB Accelerator (DAX) and when should you use it?",
    answer:
      "DAX is a fully managed in-memory cache for DynamoDB that delivers microsecond latency for read-heavy workloads. It is API-compatible, so minimal code changes are required. Use DAX when you need sub-millisecond reads, handle high read traffic, or want to reduce read capacity unit costs. It does not benefit write-heavy workloads.",
    keyPoints: [
      "Microsecond read latency",
      "API-compatible with DynamoDB SDK",
      "Reduces read capacity unit consumption",
      "Not ideal for write-heavy or strongly-consistent-required workloads",
    ],
    difficulty: "medium",
    tags: ["dynamodb", "caching", "nosql"],
  },
  {
    id: "saa-dynamodb-6",
    service: "Amazon DynamoDB",
    domain: "development",
    question: "What are DynamoDB on-demand vs. provisioned capacity modes?",
    answer:
      "On-demand mode automatically scales to handle any traffic level with no capacity planning; you pay per request. Provisioned mode requires specifying read and write capacity units (RCUs/WCUs) in advance; Auto Scaling can adjust provisioned capacity. On-demand is best for unpredictable traffic; provisioned is cheaper for predictable, steady workloads.",
    keyPoints: [
      "On-demand: no capacity planning, pay per request, more expensive",
      "Provisioned: set RCU/WCU, cheaper for steady workloads",
      "Can switch modes twice per day",
    ],
    difficulty: "easy",
    tags: ["dynamodb", "capacity", "nosql"],
  },
  {
    id: "saa-dynamodb-7",
    service: "Amazon DynamoDB",
    domain: "development",
    question:
      "What is DynamoDB Global Tables and what consistency does it provide?",
    answer:
      "Global Tables provide multi-active replication across multiple AWS regions. Writes can be performed in any region and are replicated to all other regions within seconds. Global Tables use eventual consistency across regions; within a single region you can use strongly consistent reads. They are ideal for globally distributed, low-latency applications.",
    keyPoints: [
      "Multi-active: writes in any region",
      "Sub-second cross-region replication",
      "Built on DynamoDB Streams",
      "Eventual consistency across regions",
    ],
    difficulty: "hard",
    tags: ["dynamodb", "global-tables", "nosql"],
  },

  // ── AWS IAM ──
  {
    id: "saa-iam-1",
    service: "AWS IAM",
    domain: "security",
    question: "What is the difference between an IAM role and an IAM user?",
    answer:
      "An IAM user is a long-term identity with permanent credentials (password or access keys) associated with a specific person or application. An IAM role is an identity with temporary credentials that can be assumed by AWS services, users, or applications. Roles are preferred over users for applications running on AWS resources.",
    keyPoints: [
      "User: long-term credentials, person or service account",
      "Role: temporary credentials, assumed by services or users",
      "Use roles for EC2, Lambda, and cross-account access",
    ],
    difficulty: "easy",
    tags: ["iam", "security", "identity"],
  },
  {
    id: "saa-iam-2",
    service: "AWS IAM",
    domain: "security",
    question:
      "What is the IAM policy evaluation order and what is the effect of an explicit deny?",
    answer:
      "IAM evaluates policies in this order: explicit deny (any policy) → SCPs → resource-based policies → identity-based policies → session policies → permission boundaries. An explicit Deny in any policy always overrides any Allow, regardless of other policies. If no explicit allow exists, the default is an implicit deny.",
    keyPoints: [
      "Explicit Deny always wins",
      "Default is implicit deny (no access)",
      "SCPs restrict what is possible in an account",
    ],
    difficulty: "hard",
    tags: ["iam", "policy", "security"],
  },
  {
    id: "saa-iam-3",
    service: "AWS IAM",
    domain: "security",
    question: "What is an IAM Permission Boundary and when would you use it?",
    answer:
      "A permission boundary is a managed policy that sets the maximum permissions an IAM entity can have. Even if a user is granted AdministratorAccess, the effective permissions are the intersection of the identity-based policy and the boundary. Use it to delegate user/role creation to developers while preventing privilege escalation.",
    keyPoints: [
      "Sets maximum permissions, not grants permissions",
      "Effective permissions = identity policy ∩ boundary",
      "Prevents privilege escalation when delegating IAM management",
    ],
    difficulty: "hard",
    tags: ["iam", "permission-boundary", "security"],
  },
  {
    id: "saa-iam-4",
    service: "AWS IAM",
    domain: "security",
    question:
      "What is AWS STS AssumeRole and how does cross-account access work?",
    answer:
      "STS AssumeRole returns temporary security credentials for an IAM role. For cross-account access, Account A creates a role with a trust policy allowing Account B's principal. Users or services in Account B call AssumeRole to get temporary credentials and access Account A's resources. Credentials expire after 15 minutes to 12 hours.",
    keyPoints: [
      "Trust policy defines who can assume the role",
      "Returns temporary access key, secret key, and session token",
      "Credential duration: 15 min to 12 hours",
    ],
    difficulty: "medium",
    tags: ["iam", "sts", "security"],
  },
  {
    id: "saa-iam-5",
    service: "AWS IAM",
    domain: "security",
    question: "What are IAM policy conditions and give two common examples?",
    answer:
      "Conditions restrict when a policy statement applies. Common examples: aws:SourceIp restricts access to specific IP ranges; aws:MultiFactorAuthPresent requires MFA for sensitive actions; aws:RequestedRegion limits which regions can be accessed; s3:prefix restricts access to specific S3 key prefixes.",
    keyPoints: [
      "Conditions make policies context-aware",
      "aws:SourceIp: restrict by IP",
      "aws:MultiFactorAuthPresent: require MFA",
    ],
    difficulty: "medium",
    tags: ["iam", "policy", "security"],
  },
  {
    id: "saa-iam-6",
    service: "AWS IAM",
    domain: "security",
    question:
      "What is AWS Organizations Service Control Policy (SCP) and how does it differ from an IAM policy?",
    answer:
      "SCPs are organization-level guardrails applied to accounts or OUs that limit the maximum permissions for all principals in those accounts, including the root user. Unlike IAM policies that grant permissions, SCPs do not grant permissions—they only restrict what IAM policies can allow. They are critical for enforcing compliance across an organization.",
    keyPoints: [
      "SCPs restrict, never grant permissions",
      "Apply to entire accounts, including root",
      "IAM policies still needed to grant access within SCP limits",
    ],
    difficulty: "hard",
    tags: ["iam", "scp", "security"],
  },
  {
    id: "saa-iam-7",
    service: "AWS IAM",
    domain: "security",
    question:
      "What is the principle of least privilege and how does IAM Access Analyzer help enforce it?",
    answer:
      "Least privilege means granting only the minimum permissions required to perform a task. IAM Access Analyzer identifies resources shared outside your account or organization and analyzes CloudTrail logs to generate least-privilege policy recommendations based on actual API usage. It can also validate policies for syntax errors and policy grammar issues.",
    keyPoints: [
      "Grant only permissions needed for the task",
      "Access Analyzer: finds external resource sharing",
      "Generates policy recommendations from CloudTrail activity",
    ],
    difficulty: "medium",
    tags: ["iam", "least-privilege", "security"],
  },

  // ── Elastic Load Balancing ──
  {
    id: "saa-elb-1",
    service: "Elastic Load Balancing",
    domain: "deployment",
    question:
      "What are the three types of AWS load balancers and when do you use each?",
    answer:
      "Application Load Balancer (ALB) operates at Layer 7, routes based on HTTP/HTTPS content (path, host, headers), and is best for web applications and microservices. Network Load Balancer (NLB) operates at Layer 4, handles millions of requests per second with ultra-low latency, and supports static IPs. Gateway Load Balancer (GWLB) is used to deploy, scale, and manage third-party virtual network appliances like firewalls.",
    keyPoints: [
      "ALB: Layer 7, content-based routing",
      "NLB: Layer 4, extreme performance, static IP",
      "GWLB: transparent network appliance insertion",
    ],
    difficulty: "medium",
    tags: ["elb", "load-balancer", "networking"],
  },
  {
    id: "saa-elb-2",
    service: "Elastic Load Balancing",
    domain: "deployment",
    question:
      "What is ALB path-based routing and how does it support microservices?",
    answer:
      "ALB listener rules can route requests to different target groups based on the URL path (e.g., /api/* to API servers, /images/* to image servers). This allows a single load balancer to front multiple microservices, each in its own target group, reducing cost and simplifying DNS management.",
    keyPoints: [
      "Route on path, hostname, headers, query string, or method",
      "Each rule points to a separate target group",
      "One ALB can replace many separate load balancers",
    ],
    difficulty: "easy",
    tags: ["elb", "alb", "microservices"],
  },
  {
    id: "saa-elb-3",
    service: "Elastic Load Balancing",
    domain: "deployment",
    question:
      "What is sticky sessions (session affinity) and what are its trade-offs?",
    answer:
      "Sticky sessions bind a user's session to a specific target using a cookie, ensuring all requests from that user go to the same instance. ALB supports application-based (custom cookie) and duration-based (AWSALB cookie) stickiness. The trade-off is that it can cause uneven load distribution and prevents seamless instance replacement during deployments.",
    keyPoints: [
      "Cookie-based binding to a specific target",
      "ALB: AWSALB cookie (duration-based) or custom cookie",
      "Trade-off: uneven distribution, breaks if instance replaced",
    ],
    difficulty: "medium",
    tags: ["elb", "sessions", "load-balancer"],
  },
  {
    id: "saa-elb-4",
    service: "Elastic Load Balancing",
    domain: "deployment",
    question: "What is cross-zone load balancing and why does it matter?",
    answer:
      "Cross-zone load balancing distributes traffic evenly across all registered targets in all enabled AZs, regardless of how many targets are in each AZ. Without it, each load balancer node distributes traffic only to targets in its AZ, which can cause imbalance if AZs have different numbers of instances. ALB has cross-zone enabled by default; NLB has it disabled by default.",
    keyPoints: [
      "ALB: cross-zone enabled by default, no charge",
      "NLB: disabled by default, charged when enabled",
      "Prevents AZ imbalance with unequal instance counts",
    ],
    difficulty: "medium",
    tags: ["elb", "cross-zone", "load-balancer"],
  },
  {
    id: "saa-elb-5",
    service: "Elastic Load Balancing",
    domain: "deployment",
    question: "What is connection draining (deregistration delay) on an ELB?",
    answer:
      "Connection draining (called Deregistration Delay in ALB/NLB) gives in-flight requests time to complete before an instance is deregistered or marked unhealthy. The default is 300 seconds; it can be set from 1 to 3600 seconds or disabled. Setting it too low causes in-flight requests to fail; too high delays Auto Scaling termination.",
    keyPoints: [
      "Allows in-flight requests to complete during deregistration",
      "Default: 300 seconds, range: 1–3600 seconds",
      "Balance between graceful shutdown and fast replacement",
    ],
    difficulty: "easy",
    tags: ["elb", "connection-draining", "load-balancer"],
  },
  {
    id: "saa-elb-6",
    service: "Elastic Load Balancing",
    domain: "deployment",
    question:
      "How do you expose an NLB with a static IP and why would you need it?",
    answer:
      "NLB automatically assigns a static IP per AZ (or you can assign Elastic IPs). This is useful when clients need to whitelist specific IPs, for firewall rules, or when integrating with on-premises systems that cannot use DNS-based endpoints. ALB and Classic LB do not support static IPs.",
    keyPoints: [
      "NLB: static IP per AZ, or assign Elastic IP",
      "ALB: DNS-based only, IP can change",
      "Use NLB when clients must whitelist IPs",
    ],
    difficulty: "medium",
    tags: ["elb", "nlb", "networking"],
  },
  {
    id: "saa-elb-7",
    service: "Elastic Load Balancing",
    domain: "deployment",
    question:
      "What health check parameters does ELB use and what happens to an unhealthy target?",
    answer:
      "ELB health checks send periodic requests to a specified path and port. Key parameters: HealthyThresholdCount (consecutive successes to mark healthy), UnhealthyThresholdCount (consecutive failures to mark unhealthy), Interval, Timeout, and success HTTP codes. Unhealthy targets stop receiving traffic until they pass health checks again.",
    keyPoints: [
      "Configurable threshold, interval, and success codes",
      "Unhealthy targets removed from rotation",
      "Health checks run from load balancer nodes (allow in security groups)",
    ],
    difficulty: "easy",
    tags: ["elb", "health-checks", "load-balancer"],
  },

  // ── AWS Auto Scaling ──
  {
    id: "saa-asg-1",
    service: "AWS Auto Scaling",
    domain: "deployment",
    question:
      "What are the three Auto Scaling policy types and when do you use each?",
    answer:
      "Simple scaling triggers a single action when an alarm fires and waits for a cooldown before acting again—best for basic workloads. Step scaling adjusts capacity in steps based on alarm breach magnitude, with no cooldown wait—faster response. Target tracking maintains a metric at a target value (e.g., 60% CPU) by automatically adding/removing instances—simplest to configure.",
    keyPoints: [
      "Simple: single action, cooldown period required",
      "Step: graduated response, faster than simple",
      "Target tracking: recommended default, self-adjusting",
    ],
    difficulty: "medium",
    tags: ["auto-scaling", "scaling-policies", "scalability"],
  },
  {
    id: "saa-asg-2",
    service: "AWS Auto Scaling",
    domain: "deployment",
    question:
      "What is a Launch Template and how does it differ from a Launch Configuration?",
    answer:
      "Launch Templates are the modern successor to Launch Configurations, supporting versioning, inheritance, and a broader set of EC2 features including Spot and On-Demand mixed instances, T2/T3 Unlimited, dedicated hosts, and multiple instance types. Launch Configurations are immutable (no versioning) and do not support these features. AWS recommends using Launch Templates.",
    keyPoints: [
      "Launch Template: versioned, supports mixed instances and all EC2 features",
      "Launch Configuration: legacy, immutable, limited feature set",
      "Launch Templates required for new EC2 features",
    ],
    difficulty: "medium",
    tags: ["auto-scaling", "launch-template", "scalability"],
  },
  {
    id: "saa-asg-3",
    service: "AWS Auto Scaling",
    domain: "deployment",
    question:
      "What is the Auto Scaling cooldown period and how does it prevent thrashing?",
    answer:
      "The cooldown period is a configurable wait time (default 300 seconds) after a scaling activity completes before another scaling action can occur. It prevents the group from launching or terminating additional instances before the previous change takes effect and metrics stabilize. Target tracking and step scaling policies have their own warm-up settings instead of cooldowns.",
    keyPoints: [
      "Default: 300 seconds",
      "Prevents rapid add/remove cycles (thrashing)",
      "Instance warm-up used with target tracking",
    ],
    difficulty: "easy",
    tags: ["auto-scaling", "cooldown", "scalability"],
  },
  {
    id: "saa-asg-4",
    service: "AWS Auto Scaling",
    domain: "deployment",
    question:
      "What is predictive scaling and what workloads benefit most from it?",
    answer:
      "Predictive scaling uses machine learning to analyze historical CloudWatch metrics and forecast future demand, then schedules scaling actions in advance. It is most beneficial for workloads with recurring, predictable patterns (daily peaks, weekly cycles) where reactive scaling would be too slow. It can be combined with dynamic scaling for unpredictable spikes.",
    keyPoints: [
      "Proactive scaling based on ML forecast",
      "Best for recurring predictable patterns",
      "Requires at least 24 hours of metric history",
    ],
    difficulty: "hard",
    tags: ["auto-scaling", "predictive", "scalability"],
  },
  {
    id: "saa-asg-5",
    service: "AWS Auto Scaling",
    domain: "deployment",
    question:
      "What is the Auto Scaling termination policy and which instance is terminated first by default?",
    answer:
      "The default termination policy selects the AZ with the most instances, then terminates the instance launched from the oldest launch template/configuration, and finally the one closest to the next billing hour. This ensures capacity is balanced across AZs and configurations stay current. Custom termination policies like OldestInstance or NewestInstance are also available.",
    keyPoints: [
      "Default: balance AZs, then oldest launch template, then billing hour",
      "Custom policies: OldestInstance, NewestInstance, ClosestToNextInstanceHour",
      "Ensures AZ balance during scale-in",
    ],
    difficulty: "hard",
    tags: ["auto-scaling", "termination", "scalability"],
  },
  {
    id: "saa-asg-6",
    service: "AWS Auto Scaling",
    domain: "deployment",
    question:
      "What are lifecycle hooks in Auto Scaling and what can you do with them?",
    answer:
      "Lifecycle hooks pause instances at launch (pending:wait) or termination (terminating:wait) states, allowing custom actions before the instance is put into service or terminated. Common uses include installing software, draining connections, copying logs, or running custom shutdown scripts. The hook timeout is configurable from 30 seconds to 7200 seconds.",
    keyPoints: [
      "Pause instance during launch or termination",
      "Use for bootstrapping or graceful shutdown",
      "Send heartbeats to extend timeout (max 48 hours)",
    ],
    difficulty: "medium",
    tags: ["auto-scaling", "lifecycle-hooks", "scalability"],
  },
  {
    id: "saa-asg-7",
    service: "AWS Auto Scaling",
    domain: "deployment",
    question:
      "What is a mixed instances policy in an Auto Scaling group and why use it?",
    answer:
      "A mixed instances policy allows an ASG to use multiple instance types and purchase options (On-Demand and Spot) in a single group. You specify a base On-Demand capacity and a percentage split for the rest between On-Demand and Spot. This reduces cost while maintaining availability since interruption of one Spot pool doesn't take down the entire group.",
    keyPoints: [
      "Combines multiple instance types and Spot/On-Demand",
      "Base On-Demand for minimum reliability",
      "Spot diversification reduces interruption risk",
    ],
    difficulty: "hard",
    tags: ["auto-scaling", "mixed-instances", "scalability"],
  },

  // ── Amazon CloudFront ──
  {
    id: "saa-cloudfront-1",
    service: "Amazon CloudFront",
    domain: "services",
    question: "What is Amazon CloudFront and how does it reduce latency?",
    answer:
      "CloudFront is a Content Delivery Network (CDN) that caches content at over 400 global edge locations close to end users. Requests are served from the nearest edge location rather than the origin, reducing latency and origin load. It integrates with S3, ALB, EC2, and custom HTTP origins.",
    keyPoints: [
      "400+ edge locations globally",
      "Caches static and dynamic content",
      "Reduces origin load and improves TTL",
    ],
    difficulty: "easy",
    tags: ["cloudfront", "cdn", "performance"],
  },
  {
    id: "saa-cloudfront-2",
    service: "Amazon CloudFront",
    domain: "services",
    question:
      "What is a CloudFront Origin Access Control (OAC) and why use it?",
    answer:
      "OAC is the modern way to restrict S3 bucket access so that only CloudFront can read objects—blocking direct public access to S3. You configure the S3 bucket policy to allow only the CloudFront distribution's OAC. OAC replaces the older Origin Access Identity (OAI) and supports all S3 regions, SSE-KMS, and dynamic requests.",
    keyPoints: [
      "Prevents direct S3 access, forces traffic through CloudFront",
      "Replaces OAI; supports SSE-KMS",
      "Requires updating S3 bucket policy",
    ],
    difficulty: "medium",
    tags: ["cloudfront", "s3", "security"],
  },
  {
    id: "saa-cloudfront-3",
    service: "Amazon CloudFront",
    domain: "services",
    question: "What are CloudFront Cache Behaviors and how do you use them?",
    answer:
      "Cache Behaviors define how CloudFront handles requests matching a path pattern (e.g., /api/*, /images/*). Each behavior specifies the origin, cache TTL, allowed HTTP methods, whether to forward cookies/headers/query strings, and whether to require HTTPS. The default behavior handles any path not matched by a custom behavior.",
    keyPoints: [
      "Path-pattern routing to different origins",
      "Per-behavior TTL, forwarding, and HTTPS settings",
      "Default behavior acts as catch-all",
    ],
    difficulty: "medium",
    tags: ["cloudfront", "caching", "cdn"],
  },
  {
    id: "saa-cloudfront-4",
    service: "Amazon CloudFront",
    domain: "services",
    question: "What are CloudFront signed URLs vs. signed cookies?",
    answer:
      "Signed URLs grant access to a single specific file and are ideal for distributing individual protected resources. Signed cookies grant access to multiple files matching a pattern and are useful for protecting entire sections of a site (e.g., a paid video library). Both use public/private key pairs and support expiration times.",
    keyPoints: [
      "Signed URL: one file, one URL",
      "Signed cookie: multiple files, one cookie set",
      "Use cookies for subscription content libraries",
    ],
    difficulty: "medium",
    tags: ["cloudfront", "security", "cdn"],
  },
  {
    id: "saa-cloudfront-5",
    service: "Amazon CloudFront",
    domain: "services",
    question:
      "What is CloudFront Lambda@Edge and what use cases does it enable?",
    answer:
      "Lambda@Edge runs Lambda functions at CloudFront edge locations in response to four CloudFront events: viewer request, origin request, origin response, and viewer response. Use cases include A/B testing, URL rewrites, custom authentication, personalized content based on headers, and bot detection—all without round-tripping to an origin.",
    keyPoints: [
      "Runs at edge, not in a region",
      "Four trigger points in the request/response lifecycle",
      "Use for auth, redirects, personalization at edge",
    ],
    difficulty: "hard",
    tags: ["cloudfront", "lambda-edge", "cdn"],
  },
  {
    id: "saa-cloudfront-6",
    service: "Amazon CloudFront",
    domain: "services",
    question:
      "How does CloudFront handle HTTPS and what is the difference between Viewer Protocol and Origin Protocol policies?",
    answer:
      "Viewer Protocol Policy controls how CloudFront communicates with end users (HTTPS only, redirect HTTP to HTTPS, or allow both). Origin Protocol Policy controls how CloudFront communicates with the origin (HTTP, HTTPS, or match viewer). For security, configure both to require HTTPS to ensure end-to-end encryption.",
    keyPoints: [
      "Viewer Protocol: user ↔ CloudFront",
      "Origin Protocol: CloudFront ↔ origin",
      "Best practice: both set to HTTPS only",
    ],
    difficulty: "medium",
    tags: ["cloudfront", "https", "security"],
  },
  {
    id: "saa-cloudfront-7",
    service: "Amazon CloudFront",
    domain: "services",
    question: "What is CloudFront invalidation and when is it necessary?",
    answer:
      "Invalidation removes objects from CloudFront edge caches before their TTL expires, forcing the next request to fetch fresh content from the origin. It is necessary when you deploy updated content and cannot wait for the TTL to expire. You can invalidate specific paths or use a wildcard (/*). The first 1,000 invalidation paths per month are free.",
    keyPoints: [
      "Forces cache refresh before TTL expiration",
      "First 1,000 paths/month free; charged after",
      "Alternative: versioned file names (cache-busting) to avoid invalidation",
    ],
    difficulty: "easy",
    tags: ["cloudfront", "caching", "cdn"],
  },

  // ── Amazon Route 53 ──
  {
    id: "saa-route53-1",
    service: "Amazon Route 53",
    domain: "services",
    question:
      "What is an Alias record in Route 53 and how does it differ from a CNAME?",
    answer:
      "An Alias record is a Route 53-specific extension that maps a DNS name to AWS resources (ELB, CloudFront, S3 website endpoints, other Route 53 records). Unlike CNAMEs, Alias records work at the zone apex (root domain like example.com), have no TTL charge, and are natively integrated with health checks. CNAMEs cannot be used at the zone apex.",
    keyPoints: [
      "Alias: works at zone apex, free DNS queries",
      "CNAME: cannot be zone apex",
      "Alias natively health-check integrated",
    ],
    difficulty: "medium",
    tags: ["route53", "dns", "alias"],
  },
  {
    id: "saa-route53-2",
    service: "Amazon Route 53",
    domain: "services",
    question: "What are the Route 53 routing policies and a use case for each?",
    answer:
      "Simple: single resource, no health checks. Weighted: split traffic by percentage (A/B testing, blue/green). Latency: route to region with lowest network latency. Failover: active-passive HA with health checks. Geolocation: route based on user's geographic location. Geoproximity: route based on location bias (requires Traffic Flow). Multi-value: returns up to 8 healthy records.",
    keyPoints: [
      "Weighted: A/B testing or blue/green deploys",
      "Latency: performance routing across regions",
      "Failover: active-passive disaster recovery",
      "Geolocation: data sovereignty, localized content",
    ],
    difficulty: "medium",
    tags: ["route53", "routing", "dns"],
  },
  {
    id: "saa-route53-3",
    service: "Amazon Route 53",
    domain: "services",
    question: "What are Route 53 health checks and what can they monitor?",
    answer:
      "Route 53 health checks monitor the health of endpoints (IP or domain), other health checks (calculated health checks), or CloudWatch alarms. Endpoint health checks send requests from multiple global health checker locations. Health check results integrate with routing policies (Failover, Weighted, etc.) to automatically remove unhealthy endpoints from DNS responses.",
    keyPoints: [
      "Monitor endpoints, HTTP/HTTPS/TCP",
      "Calculated health checks combine multiple checks",
      "Triggers failover routing automatically",
    ],
    difficulty: "easy",
    tags: ["route53", "health-checks", "dns"],
  },
  {
    id: "saa-route53-4",
    service: "Amazon Route 53",
    domain: "services",
    question:
      "What is Route 53 Resolver and what problem does it solve for hybrid architectures?",
    answer:
      "Route 53 Resolver provides DNS resolution for VPCs. Resolver Inbound Endpoints allow on-premises networks to resolve AWS private hosted zone records via DNS forwarding. Resolver Outbound Endpoints allow VPC resources to forward DNS queries to on-premises DNS servers. This enables seamless DNS resolution across hybrid cloud environments.",
    keyPoints: [
      "Inbound: on-premises → AWS DNS resolution",
      "Outbound: AWS VPC → on-premises DNS resolution",
      "Resolver Rules control forwarding per domain",
    ],
    difficulty: "hard",
    tags: ["route53", "resolver", "hybrid"],
  },
  {
    id: "saa-route53-5",
    service: "Amazon Route 53",
    domain: "services",
    question: "What is a private hosted zone in Route 53?",
    answer:
      "A private hosted zone contains DNS records accessible only from within associated VPCs. It allows you to use custom domain names (e.g., app.internal) for internal resources without exposing them to the internet. You can associate a private hosted zone with multiple VPCs across accounts.",
    keyPoints: [
      "DNS resolution only within associated VPCs",
      "Can associate with VPCs across accounts",
      "Use for internal service discovery",
    ],
    difficulty: "easy",
    tags: ["route53", "private-hosted-zone", "dns"],
  },
  {
    id: "saa-route53-6",
    service: "Amazon Route 53",
    domain: "services",
    question:
      "How does Route 53 weighted routing enable blue/green deployments?",
    answer:
      "By creating two records (one for blue, one for green environment) with different weights, you can gradually shift traffic. Start with 100% weight on blue and 0% on green. After deploying and testing green, shift traffic incrementally (e.g., 10%/90%, then 50%/50%, then 0%/100%). If issues arise, shift weight back instantly.",
    keyPoints: [
      "Weights are relative: 10/90 sends 10% and 90%",
      "Zero weight stops traffic to that record",
      "Supports gradual traffic shifting with instant rollback",
    ],
    difficulty: "medium",
    tags: ["route53", "blue-green", "dns"],
  },
  {
    id: "saa-route53-7",
    service: "Amazon Route 53",
    domain: "services",
    question:
      "What is the TTL of a DNS record and how does it affect traffic routing changes?",
    answer:
      "TTL (Time To Live) is the duration in seconds that DNS resolvers cache a record before querying Route 53 again. A high TTL (e.g., 86400) reduces DNS query costs but means traffic routing changes take longer to propagate. Before planned changes (failover, migration), reduce TTL to 60–120 seconds to speed up propagation.",
    keyPoints: [
      "High TTL: fewer queries, slow propagation",
      "Low TTL: frequent queries, fast changes",
      "Reduce TTL before planned routing changes",
    ],
    difficulty: "easy",
    tags: ["route53", "ttl", "dns"],
  },

  // ── AWS Lambda ──
  {
    id: "saa-lambda-1",
    service: "AWS Lambda",
    domain: "development",
    question:
      "What are Lambda concurrency limits and the difference between reserved and provisioned concurrency?",
    answer:
      "Lambda has a default regional concurrency limit of 1,000 concurrent executions. Reserved concurrency sets a maximum for a specific function, preventing it from consuming the entire regional limit. Provisioned concurrency pre-initializes execution environments to eliminate cold starts, providing consistent low-latency responses for latency-sensitive applications.",
    keyPoints: [
      "Default regional limit: 1,000 concurrent executions",
      "Reserved: cap a function's maximum concurrency",
      "Provisioned: pre-warmed, eliminates cold starts",
    ],
    difficulty: "medium",
    tags: ["lambda", "concurrency", "serverless"],
  },
  {
    id: "saa-lambda-2",
    service: "AWS Lambda",
    domain: "development",
    question: "What is a Lambda cold start and what strategies reduce it?",
    answer:
      "A cold start occurs when Lambda must initialize a new execution environment (download code, start runtime, run init code) before handling a request. Strategies to reduce cold starts: use provisioned concurrency, minimize deployment package size, choose runtime carefully (Java/C# have higher cold starts than Python/Node.js), move heavy initialization outside the handler function.",
    keyPoints: [
      "Cold start: new environment initialization latency",
      "Provisioned concurrency: most effective solution",
      "Keep init code outside handler (reused across invocations)",
    ],
    difficulty: "medium",
    tags: ["lambda", "cold-start", "serverless"],
  },
  {
    id: "saa-lambda-3",
    service: "AWS Lambda",
    domain: "development",
    question: "What Lambda execution limits matter for architecture decisions?",
    answer:
      "Key limits: 15-minute maximum execution timeout, 10 GB maximum memory (CPU scales proportionally), 512 MB–10 GB /tmp ephemeral storage, 50 MB compressed deployment package (250 MB uncompressed), and 1,000 default concurrent executions per region. Use Step Functions for workflows exceeding 15 minutes.",
    keyPoints: [
      "Max timeout: 15 minutes",
      "Max memory: 10 GB",
      "Max /tmp storage: 10 GB",
      "Deployment package: 50 MB zipped, 250 MB unzipped",
    ],
    difficulty: "easy",
    tags: ["lambda", "limits", "serverless"],
  },
  {
    id: "saa-lambda-4",
    service: "AWS Lambda",
    domain: "development",
    question:
      "How does Lambda integrate with SQS and what is the event source mapping batch configuration?",
    answer:
      "Lambda's SQS event source mapping polls the queue and invokes the function with a batch of messages. Key settings: BatchSize (1–10,000 messages), MaximumBatchingWindowInSeconds (accumulation wait up to 300 seconds), and FunctionResponseTypes to control message deletion. If the function fails, the entire batch returns to the queue unless you use partial batch response reporting.",
    keyPoints: [
      "Polling is managed by Lambda (not triggered by SQS directly)",
      "Failed batch returns to queue; can cause poison messages",
      "Use partial batch response to only fail specific messages",
    ],
    difficulty: "hard",
    tags: ["lambda", "sqs", "serverless"],
  },
  {
    id: "saa-lambda-5",
    service: "AWS Lambda",
    domain: "development",
    question: "What is a Lambda Layer and what are its benefits?",
    answer:
      "A Lambda Layer is a ZIP archive containing libraries, custom runtimes, or other dependencies that can be shared across multiple Lambda functions. Functions can use up to 5 layers simultaneously. Layers reduce deployment package sizes, enable reuse of common code/dependencies, and allow updates to shared components without modifying individual functions.",
    keyPoints: [
      "Share code/libraries across functions",
      "Up to 5 layers per function",
      "Layer size counts toward 250 MB unzipped limit",
    ],
    difficulty: "easy",
    tags: ["lambda", "layers", "serverless"],
  },
  {
    id: "saa-lambda-6",
    service: "AWS Lambda",
    domain: "development",
    question: "What is Lambda Destinations and how does it differ from DLQ?",
    answer:
      "Lambda Destinations route the result of asynchronous invocations to an SQS queue, SNS topic, EventBridge event bus, or another Lambda function—separately for success and failure. A Dead Letter Queue (DLQ) captures only failed, unprocessed events after retries are exhausted. Destinations provide richer metadata including the function response, while DLQ only receives the event payload.",
    keyPoints: [
      "Destinations: separate success and failure routing",
      "DLQ: failure only, after all retries",
      "Destinations carry full response context",
    ],
    difficulty: "hard",
    tags: ["lambda", "destinations", "serverless"],
  },
  {
    id: "saa-lambda-7",
    service: "AWS Lambda",
    domain: "development",
    question:
      "How does Lambda handle VPC integration and what is the implication for internet access?",
    answer:
      "When a Lambda function is connected to a VPC, it runs in a VPC-managed internal subnet and loses access to the public internet. To restore internet access, you must route outbound traffic through a NAT Gateway in a public subnet. VPC Lambda functions can access private resources like RDS or ElastiCache but require NAT for external API calls.",
    keyPoints: [
      "VPC Lambda loses internet access by default",
      "Add NAT Gateway for internet access from VPC Lambda",
      "VPC endpoints allow access to AWS services without NAT",
    ],
    difficulty: "medium",
    tags: ["lambda", "vpc", "networking"],
  },

  // ── Amazon SQS ──
  {
    id: "saa-sqs-1",
    service: "Amazon SQS",
    domain: "applications",
    question: "What is the difference between SQS Standard and FIFO queues?",
    answer:
      "Standard queues offer unlimited throughput, at-least-once delivery, and best-effort ordering. FIFO queues guarantee exactly-once processing and strict ordering within message groups, but are limited to 3,000 messages per second with batching (300 without). Use FIFO when message order and deduplication matter; use Standard for maximum throughput.",
    keyPoints: [
      "Standard: unlimited TPS, best-effort order, at-least-once",
      "FIFO: 3,000 TPS with batching, exactly-once, strict order",
      "FIFO name must end in .fifo",
    ],
    difficulty: "easy",
    tags: ["sqs", "messaging", "queues"],
  },
  {
    id: "saa-sqs-2",
    service: "Amazon SQS",
    domain: "applications",
    question:
      "What is the SQS visibility timeout and how do you set it correctly?",
    answer:
      "When a consumer receives a message, SQS hides it from other consumers for the visibility timeout period. If the consumer processes and deletes the message within that time, it's removed. If not, it reappears for reprocessing. Set the visibility timeout to slightly longer than your maximum processing time to avoid duplicate processing while preventing message loss.",
    keyPoints: [
      "Default: 30 seconds, max: 12 hours",
      "Set > max expected processing time",
      "Consumer can extend timeout with ChangeMessageVisibility API",
    ],
    difficulty: "medium",
    tags: ["sqs", "visibility-timeout", "messaging"],
  },
  {
    id: "saa-sqs-3",
    service: "Amazon SQS",
    domain: "applications",
    question:
      "What is an SQS Dead Letter Queue (DLQ) and when is it triggered?",
    answer:
      "A DLQ is a separate queue that receives messages that failed processing after a specified number of receive attempts (maxReceiveCount). It prevents poison messages from blocking queue processing indefinitely. After analyzing and fixing the root cause, you can use the DLQ redrive feature to move messages back to the source queue for reprocessing.",
    keyPoints: [
      "Receives messages after maxReceiveCount failures",
      "Must be same type as source queue (FIFO→FIFO, Standard→Standard)",
      "DLQ redrive returns messages to source queue",
    ],
    difficulty: "medium",
    tags: ["sqs", "dlq", "messaging"],
  },
  {
    id: "saa-sqs-4",
    service: "Amazon SQS",
    domain: "applications",
    question:
      "What is SQS Long Polling and why is it preferred over Short Polling?",
    answer:
      "Long polling waits up to 20 seconds for messages to arrive before returning an empty response, reducing empty responses and API costs. Short polling returns immediately, even if no messages are available, resulting in more API calls and cost. Long polling is configured by setting WaitTimeSeconds > 0 on ReceiveMessage requests or on the queue itself.",
    keyPoints: [
      "Long poll: waits up to 20 seconds, fewer empty responses",
      "Short poll: returns immediately, more API calls",
      "Lower cost and latency with long polling",
    ],
    difficulty: "easy",
    tags: ["sqs", "polling", "messaging"],
  },
  {
    id: "saa-sqs-5",
    service: "Amazon SQS",
    domain: "applications",
    question:
      "What is the SQS message retention period and maximum message size?",
    answer:
      "SQS retains messages for a configurable period from 1 minute to 14 days (default: 4 days). Maximum message size is 256 KB. For larger payloads, use the SQS Extended Client Library which stores the message body in S3 and sends a reference in the SQS message. Messages not consumed within the retention period are automatically deleted.",
    keyPoints: [
      "Retention: 1 minute to 14 days (default 4 days)",
      "Max size: 256 KB",
      "Extended Client Library: stores body in S3 for larger messages",
    ],
    difficulty: "easy",
    tags: ["sqs", "limits", "messaging"],
  },
  {
    id: "saa-sqs-6",
    service: "Amazon SQS",
    domain: "applications",
    question: "How does the fan-out pattern work with SNS and SQS together?",
    answer:
      "In the fan-out pattern, a message is published once to an SNS topic, which delivers it to multiple SQS queues (subscribers) simultaneously. Each queue can be processed by a different microservice independently. This decouples publishers from consumers, allows each service to process at its own pace, and provides buffering and retry per subscriber.",
    keyPoints: [
      "SNS topic fans out to multiple SQS queues",
      "Each queue processes independently",
      "Provides buffering, decoupling, and retry per subscriber",
    ],
    difficulty: "medium",
    tags: ["sqs", "sns", "fan-out"],
  },
  {
    id: "saa-sqs-7",
    service: "Amazon SQS",
    domain: "applications",
    question:
      "What is FIFO message deduplication in SQS and what are the two methods?",
    answer:
      "FIFO queues provide exactly-once processing using deduplication. Content-based deduplication computes a SHA-256 hash of the message body and uses it as the deduplication ID—duplicate messages within a 5-minute window are discarded. Message deduplication ID allows you to specify an explicit unique ID per message, giving you control over deduplication logic.",
    keyPoints: [
      "5-minute deduplication window",
      "Content-based: SHA-256 of body",
      "Explicit ID: you control uniqueness logic",
    ],
    difficulty: "hard",
    tags: ["sqs", "fifo", "deduplication"],
  },

  // ── Amazon SNS ──
  {
    id: "saa-sns-1",
    service: "Amazon SNS",
    domain: "applications",
    question: "What is Amazon SNS and what delivery protocols does it support?",
    answer:
      "SNS is a fully managed pub/sub messaging service for sending notifications to multiple subscribers simultaneously. It supports delivery to SQS, Lambda, HTTP/HTTPS endpoints, email, SMS, and mobile push notifications (APNS, GCM/FCM). Pub/sub decouples publishers from subscribers, enabling scalable, asynchronous communication.",
    keyPoints: [
      "Pub/sub: one publish, many subscribers",
      "Protocols: SQS, Lambda, HTTP, email, SMS, mobile push",
      "No message persistence (unlike SQS)",
    ],
    difficulty: "easy",
    tags: ["sns", "notifications", "pub-sub"],
  },
  {
    id: "saa-sns-2",
    service: "Amazon SNS",
    domain: "applications",
    question:
      "What is SNS message filtering and how does it reduce unnecessary processing?",
    answer:
      "SNS message filtering allows subscribers to receive only messages matching a filter policy (JSON attribute conditions). Without filtering, every subscriber receives every message. With filtering, each service only receives relevant messages, reducing unnecessary Lambda invocations and SQS message processing, lowering cost and complexity.",
    keyPoints: [
      "Filter policy: JSON key-value conditions on message attributes",
      "Applied per subscription, not per topic",
      "Reduces downstream processing costs",
    ],
    difficulty: "medium",
    tags: ["sns", "filtering", "pub-sub"],
  },
  {
    id: "saa-sns-3",
    service: "Amazon SNS",
    domain: "applications",
    question: "What is SNS FIFO and how does it differ from Standard SNS?",
    answer:
      "SNS FIFO topics guarantee message ordering and deduplication, similar to SQS FIFO queues. They deliver to SQS FIFO queues only and are limited to 300 messages per second (or 3,000 with batching). Standard SNS topics support all subscriber types, offer higher throughput, but do not guarantee ordering.",
    keyPoints: [
      "FIFO: ordered, deduplicated, SQS FIFO subscribers only",
      "Standard: all subscriber types, higher throughput",
      "FIFO topic name must end in .fifo",
    ],
    difficulty: "medium",
    tags: ["sns", "fifo", "pub-sub"],
  },
  {
    id: "saa-sns-4",
    service: "Amazon SNS",
    domain: "applications",
    question:
      "What is SNS message archiving and analytics with Kinesis Data Firehose?",
    answer:
      "SNS can deliver messages directly to Kinesis Data Firehose, which then writes them to S3, Redshift, or OpenSearch. This allows archiving all published notifications for audit, compliance, or analytics without modifying publishers. It provides durable, long-term storage of messages that SNS would otherwise not persist.",
    keyPoints: [
      "SNS → Kinesis Firehose → S3/Redshift/OpenSearch",
      "Enables durable archiving of pub/sub messages",
      "Use for compliance, audit trails, analytics",
    ],
    difficulty: "hard",
    tags: ["sns", "firehose", "analytics"],
  },
  {
    id: "saa-sns-5",
    service: "Amazon SNS",
    domain: "applications",
    question:
      "How do you ensure SNS delivery to HTTP endpoints when the endpoint is temporarily unavailable?",
    answer:
      "SNS uses a retry policy for HTTP/HTTPS delivery with configurable retry attempts (default: 3 immediate, then exponential backoff). If all retries fail, the message is sent to a DLQ if configured. For reliability, prefer SQS as a subscriber (which buffers messages) rather than direct HTTP endpoints.",
    keyPoints: [
      "HTTP retry: immediate retries then exponential backoff",
      "Configure DLQ on subscription for failed deliveries",
      "SQS as subscriber is more reliable than direct HTTP",
    ],
    difficulty: "medium",
    tags: ["sns", "reliability", "notifications"],
  },
  {
    id: "saa-sns-6",
    service: "Amazon SNS",
    domain: "applications",
    question:
      "What is the SNS message size limit and how do you handle larger payloads?",
    answer:
      "SNS has a 256 KB message size limit. For larger payloads, use the SNS/SQS Extended Client Library: store the large payload in S3 and send only the S3 reference in the SNS message. Subscribers retrieve the full payload from S3. This pattern is common for event-driven architectures with large data payloads.",
    keyPoints: [
      "Max message size: 256 KB",
      "Extended Client Library: stores body in S3",
      "Reference in message; subscriber fetches from S3",
    ],
    difficulty: "easy",
    tags: ["sns", "limits", "notifications"],
  },
  {
    id: "saa-sns-7",
    service: "Amazon SNS",
    domain: "applications",
    question:
      "How does SNS support mobile push notifications and what is the platform application concept?",
    answer:
      "SNS mobile push uses platform-specific push notification services: APNS for iOS, FCM/GCM for Android, ADM for Kindle, and WNS for Windows. You create a Platform Application in SNS representing your app on a push platform, then create Platform Endpoints for each registered device. Publishing to a topic or endpoint sends notifications through the appropriate platform service.",
    keyPoints: [
      "Platform Application: represents your app on APNS/FCM/etc.",
      "Platform Endpoint: represents a specific device",
      "SNS abstracts platform-specific delivery details",
    ],
    difficulty: "medium",
    tags: ["sns", "mobile-push", "notifications"],
  },

  // ── Amazon CloudWatch ──
  {
    id: "saa-cloudwatch-1",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    question:
      "What is the difference between CloudWatch Metrics and CloudWatch Logs?",
    answer:
      "CloudWatch Metrics are numerical time-series data points (CPU utilization, request count, latency) used for monitoring performance and triggering alarms. CloudWatch Logs store log events as text from applications, Lambda functions, and AWS services, used for debugging and forensics. Logs Insights allows querying log data; Metric Filters extract metrics from logs.",
    keyPoints: [
      "Metrics: numerical, time-series, alarm-triggerable",
      "Logs: text events, searchable with Logs Insights",
      "Metric Filters: extract metrics from log patterns",
    ],
    difficulty: "easy",
    tags: ["cloudwatch", "metrics", "monitoring"],
  },
  {
    id: "saa-cloudwatch-2",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    question: "What is a CloudWatch Alarm and what states can it be in?",
    answer:
      "A CloudWatch Alarm watches a metric over a specified time period and performs actions when the metric crosses a threshold. States: OK (metric within threshold), ALARM (metric breached threshold), INSUFFICIENT_DATA (not enough data to evaluate). Actions include SNS notifications, Auto Scaling policies, EC2 actions, and Systems Manager OpsCenter items.",
    keyPoints: [
      "Three states: OK, ALARM, INSUFFICIENT_DATA",
      "Actions: SNS, Auto Scaling, EC2 recovery",
      "Evaluate over N periods of M seconds each",
    ],
    difficulty: "easy",
    tags: ["cloudwatch", "alarms", "monitoring"],
  },
  {
    id: "saa-cloudwatch-3",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    question: "What is CloudWatch Container Insights and what does it monitor?",
    answer:
      "Container Insights collects, aggregates, and summarizes metrics and logs from containerized applications on ECS, EKS, and Kubernetes on EC2. It provides pre-built dashboards for CPU, memory, disk I/O, network, and container-level performance. It uses a CloudWatch Agent as a DaemonSet to collect data from each node.",
    keyPoints: [
      "Works with ECS, EKS, and self-managed Kubernetes",
      "Collects CPU, memory, disk, network per container/pod",
      "Deployed as DaemonSet (CloudWatch Agent) in EKS",
    ],
    difficulty: "medium",
    tags: ["cloudwatch", "containers", "monitoring"],
  },
  {
    id: "saa-cloudwatch-4",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    question:
      "What is the CloudWatch Logs retention policy and what happens to logs after it expires?",
    answer:
      "CloudWatch Logs groups have a configurable retention policy from 1 day to 10 years (or never expire). After the retention period, logs are automatically deleted. To archive logs long-term, export to S3 (one-time or via subscriptions with Kinesis Firehose) before the retention period expires.",
    keyPoints: [
      "Retention: 1 day to 10 years or Never Expire",
      "Expired logs are automatically deleted",
      "Export to S3 for long-term archival",
    ],
    difficulty: "easy",
    tags: ["cloudwatch", "logs", "monitoring"],
  },
  {
    id: "saa-cloudwatch-5",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    question: "What are CloudWatch custom metrics and when do you need them?",
    answer:
      "CloudWatch provides standard metrics for AWS services, but custom metrics allow you to publish application-specific data (e.g., active sessions, queue depth, business KPIs). You publish custom metrics using the PutMetricData API. They support standard (1-minute) and high-resolution (1-second) granularity. The CloudWatch Agent can collect OS-level metrics like memory and disk usage that are not collected by default.",
    keyPoints: [
      "EC2 does not report memory/disk by default—use CloudWatch Agent",
      "High-resolution metrics: 1-second granularity",
      "PutMetricData API for custom application metrics",
    ],
    difficulty: "medium",
    tags: ["cloudwatch", "custom-metrics", "monitoring"],
  },
  {
    id: "saa-cloudwatch-6",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    question:
      "What is CloudWatch Logs Insights and how does it help with troubleshooting?",
    answer:
      "CloudWatch Logs Insights provides an interactive query language for analyzing log data. You can run queries to filter events, aggregate counts, extract fields, and visualize results. It automatically discovers fields in structured logs (JSON) and runs queries against multiple log groups simultaneously. Queries can be saved and added to CloudWatch Dashboards.",
    keyPoints: [
      "SQL-like query language for log analysis",
      "Queries multiple log groups simultaneously",
      "Auto-discovers fields from JSON logs",
    ],
    difficulty: "medium",
    tags: ["cloudwatch", "logs-insights", "troubleshooting"],
  },
  {
    id: "saa-cloudwatch-7",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    question:
      "What is CloudWatch Contributor Insights and what problems does it solve?",
    answer:
      "Contributor Insights analyzes log data to identify the top-N contributors to high latency, errors, or traffic spikes. For example, it can identify the top IP addresses generating errors, or the slowest API endpoints. It works on CloudWatch Logs and DynamoDB tables, providing time-series data showing which specific entities are driving performance issues.",
    keyPoints: [
      "Identifies top contributors to a metric",
      "Works on CloudWatch Logs and DynamoDB",
      "Helps find noisy neighbors, bad actors, or hot keys",
    ],
    difficulty: "hard",
    tags: ["cloudwatch", "contributor-insights", "troubleshooting"],
  },

  // ── AWS CloudFormation ──
  {
    id: "saa-cfn-1",
    service: "AWS CloudFormation",
    domain: "deployment",
    question:
      "What is a CloudFormation Stack and what happens if a resource fails to create?",
    answer:
      "A Stack is a collection of AWS resources managed as a single unit from a CloudFormation template. By default, if any resource fails during stack creation, CloudFormation rolls back the entire stack—deleting successfully created resources. You can disable rollback for troubleshooting. Stack rollback on update preserves the previous working state.",
    keyPoints: [
      "Stack: template + deployed resources",
      "Default: rollback on failure, deletes partial resources",
      "Rollback can be disabled for debugging",
    ],
    difficulty: "easy",
    tags: ["cloudformation", "iac", "stacks"],
  },
  {
    id: "saa-cfn-2",
    service: "AWS CloudFormation",
    domain: "deployment",
    question:
      "What are CloudFormation Change Sets and why should you use them before updating a stack?",
    answer:
      "A Change Set is a preview of the changes CloudFormation will make to a stack before execution. It shows which resources will be added, modified, or deleted—and whether modifications require replacement (new resource + delete old). Always review Change Sets before updating production stacks to avoid unexpected resource deletions.",
    keyPoints: [
      "Preview changes before applying",
      "Shows Add, Modify, Remove, and replacement impact",
      "Replacement: new resource created, old deleted",
    ],
    difficulty: "medium",
    tags: ["cloudformation", "change-sets", "iac"],
  },
  {
    id: "saa-cfn-3",
    service: "AWS CloudFormation",
    domain: "deployment",
    question: "What is a CloudFormation StackSet and when is it useful?",
    answer:
      "StackSets allow you to deploy a CloudFormation stack to multiple AWS accounts and/or regions from a single operation. Use them to enforce consistent baseline configuration (security controls, logging, networking) across all accounts in an AWS Organization. StackSets support automatic deployment to new accounts added to an OU.",
    keyPoints: [
      "Deploy to multiple accounts and regions simultaneously",
      "Managed via Organization for automatic deployment",
      "Ideal for org-wide security baselines",
    ],
    difficulty: "medium",
    tags: ["cloudformation", "stacksets", "iac"],
  },
  {
    id: "saa-cfn-4",
    service: "AWS CloudFormation",
    domain: "deployment",
    question:
      "What are CloudFormation Nested Stacks and what problem do they solve?",
    answer:
      "Nested Stacks allow you to reference other CloudFormation templates as resources within a parent stack using the AWS::CloudFormation::Stack resource type. They solve the problem of template size limits (51,200 bytes for inline, 460,800 bytes from S3) and enable modularization—reusing common infrastructure components (VPC, ECS cluster) across multiple parent stacks.",
    keyPoints: [
      "Reusable template modules",
      "Parent stack references child stack templates from S3",
      "Child stack outputs can be referenced by parent",
    ],
    difficulty: "hard",
    tags: ["cloudformation", "nested-stacks", "iac"],
  },
  {
    id: "saa-cfn-5",
    service: "AWS CloudFormation",
    domain: "deployment",
    question:
      "What is a CloudFormation DeletionPolicy and what values does it support?",
    answer:
      "DeletionPolicy controls what happens to a resource when its stack is deleted. Delete (default) removes the resource. Retain keeps the resource (now unmanaged by CloudFormation). Snapshot creates a final snapshot before deletion (supported by RDS, ElastiCache, Redshift). Use Retain or Snapshot for stateful resources to prevent accidental data loss.",
    keyPoints: [
      "Delete: default, removes resource",
      "Retain: keeps resource, unmanaged after",
      "Snapshot: creates backup before deletion (RDS, ElastiCache)",
    ],
    difficulty: "medium",
    tags: ["cloudformation", "deletion-policy", "iac"],
  },
  {
    id: "saa-cfn-6",
    service: "AWS CloudFormation",
    domain: "deployment",
    question:
      "What are CloudFormation Drift Detection and what does it tell you?",
    answer:
      "Drift detection compares the current state of stack resources against the expected state defined in the template. Resources are reported as IN_SYNC (no drift) or DRIFTED (differs from template). Drift occurs when resources are modified outside CloudFormation (console, CLI, SDK). Drift detection helps ensure infrastructure stays consistent with the IaC definition.",
    keyPoints: [
      "Detects out-of-band changes to managed resources",
      "Status: IN_SYNC or DRIFTED",
      "Does not automatically remediate drift",
    ],
    difficulty: "medium",
    tags: ["cloudformation", "drift", "iac"],
  },
  {
    id: "saa-cfn-7",
    service: "AWS CloudFormation",
    domain: "deployment",
    question:
      "What are CloudFormation custom resources and when do you use them?",
    answer:
      "Custom resources allow CloudFormation to manage resources or perform actions not supported natively. They use a Lambda function or SNS topic as the backend, which CloudFormation invokes during Create, Update, and Delete stack operations. Use cases: provisioning third-party resources, running database migrations, generating configuration files, or querying external APIs.",
    keyPoints: [
      "Lambda-backed or SNS-backed",
      "Invoked on Create, Update, Delete",
      "Extends CloudFormation to any API or resource",
    ],
    difficulty: "hard",
    tags: ["cloudformation", "custom-resources", "iac"],
  },

  // ── Amazon ElastiCache ──
  {
    id: "saa-elasticache-1",
    service: "Amazon ElastiCache",
    domain: "services",
    question: "What is the difference between ElastiCache Redis and Memcached?",
    answer:
      "Redis supports persistence (RDB snapshots, AOF logging), replication (read replicas), Multi-AZ failover, Pub/Sub, sorted sets, and Lua scripting. Memcached is simpler—in-memory only, no persistence, no replication, but supports multi-threaded operation and simple horizontal scaling. Choose Redis for feature richness and availability; Memcached for simple, high-throughput caching.",
    keyPoints: [
      "Redis: persistence, replication, Multi-AZ, pub/sub, data structures",
      "Memcached: simple, multi-threaded, no persistence",
      "Redis required for session persistence and failover",
    ],
    difficulty: "medium",
    tags: ["elasticache", "redis", "caching"],
  },
  {
    id: "saa-elasticache-2",
    service: "Amazon ElastiCache",
    domain: "services",
    question:
      "What are the two common caching strategies and when do you use each?",
    answer:
      "Lazy loading (cache-aside) only loads data into the cache when requested; a cache miss triggers a database read and cache write. It avoids caching unused data but has a cold start penalty. Write-through updates the cache on every database write; data is always current but wastes cache space for infrequently read items. Combine both with TTLs to balance freshness and performance.",
    keyPoints: [
      "Lazy loading: cache on miss, stale data possible",
      "Write-through: always current, wasteful for rarely read data",
      "TTL prevents stale data and unbounded cache growth",
    ],
    difficulty: "medium",
    tags: ["elasticache", "caching-strategies", "caching"],
  },
  {
    id: "saa-elasticache-3",
    service: "Amazon ElastiCache",
    domain: "services",
    question: "What is ElastiCache Redis Cluster Mode and what does it enable?",
    answer:
      "Redis Cluster Mode (enabled) shards data across multiple primary nodes (up to 500 nodes), each responsible for a subset of the keyspace (16,384 hash slots divided equally). This enables horizontal scaling of both read and write capacity beyond what a single node can handle. Each shard can have 0–5 read replicas. Cluster Mode Disabled uses a single shard with one primary and up to 5 replicas.",
    keyPoints: [
      "Cluster Mode Enabled: multiple shards, horizontal write scaling",
      "Cluster Mode Disabled: single shard, vertical scaling only",
      "Up to 500 nodes per cluster with sharding",
    ],
    difficulty: "hard",
    tags: ["elasticache", "redis", "sharding"],
  },
  {
    id: "saa-elasticache-4",
    service: "Amazon ElastiCache",
    domain: "services",
    question:
      "How does ElastiCache help with database scaling for read-heavy workloads?",
    answer:
      "ElastiCache offloads repetitive database reads by caching query results in memory, providing sub-millisecond response times. For read-heavy applications (social media feeds, product catalogs, leaderboards), caching reduces database load by 90%+. This allows the database to handle write operations and complex queries without being overwhelmed by repetitive reads.",
    keyPoints: [
      "Sub-millisecond in-memory reads",
      "Reduces database read load significantly",
      "Ideal for frequently read, infrequently changed data",
    ],
    difficulty: "easy",
    tags: ["elasticache", "read-scaling", "caching"],
  },
  {
    id: "saa-elasticache-5",
    service: "Amazon ElastiCache",
    domain: "services",
    question:
      "What is a cache eviction policy in Redis and what are the most important ones?",
    answer:
      "Eviction policies determine which keys Redis removes when maxmemory is reached. allkeys-lru removes the least recently used keys from all keys—good for general caching. volatile-lru removes LRU keys only from keys with TTL set. noeviction returns errors when memory is full—risky for caches. allkeys-lfu evicts least frequently used keys—better for uneven access patterns.",
    keyPoints: [
      "allkeys-lru: most common for general caching",
      "volatile-lru: only evicts keys with TTL",
      "noeviction: never evict, returns errors when full",
    ],
    difficulty: "hard",
    tags: ["elasticache", "eviction", "redis"],
  },
  {
    id: "saa-elasticache-6",
    service: "Amazon ElastiCache",
    domain: "services",
    question: "What is ElastiCache Global Datastore and when would you use it?",
    answer:
      "Global Datastore allows a single ElastiCache Redis cluster to span multiple AWS regions with sub-second replication. The primary cluster handles reads and writes; up to five secondary clusters in other regions handle local reads. Use it for globally distributed applications that need low-latency reads in multiple regions and disaster recovery.",
    keyPoints: [
      "Cross-region replication with sub-second lag",
      "One primary (read/write) and up to 5 secondary (read-only) clusters",
      "Enables global low-latency caching",
    ],
    difficulty: "hard",
    tags: ["elasticache", "global-datastore", "caching"],
  },
  {
    id: "saa-elasticache-7",
    service: "Amazon ElastiCache",
    domain: "services",
    question:
      "How do you use ElastiCache for session storage and why is it preferred over sticky sessions?",
    answer:
      "Storing user sessions in ElastiCache (Redis or Memcached) allows any instance behind a load balancer to retrieve session data, eliminating the need for sticky sessions. This enables true stateless application servers that can be freely scaled, replaced, and load balanced without session loss. Redis's persistence features also prevent session loss during cluster maintenance.",
    keyPoints: [
      "Stateless app servers with centralized session storage",
      "No sticky sessions needed = better load distribution",
      "Redis persistence protects sessions during maintenance",
    ],
    difficulty: "medium",
    tags: ["elasticache", "sessions", "caching"],
  },

  // ── Amazon EFS ──
  {
    id: "saa-efs-1",
    service: "Amazon EFS",
    domain: "services",
    question: "What is Amazon EFS and what makes it different from EBS?",
    answer:
      "EFS is a fully managed, scalable NFS file system for use with Linux EC2 instances, ECS, EKS, and Lambda. Unlike EBS, which is a block device that can only attach to one instance at a time (except Multi-Attach), EFS can be mounted by thousands of instances simultaneously across multiple AZs. Storage scales automatically without provisioning.",
    keyPoints: [
      "Shared NFS file system, many instances simultaneously",
      "Multi-AZ by default (Regional), scales automatically",
      "Linux only (NFS protocol)",
    ],
    difficulty: "easy",
    tags: ["efs", "file-storage", "shared-storage"],
  },
  {
    id: "saa-efs-2",
    service: "Amazon EFS",
    domain: "services",
    question: "What are the EFS performance modes and throughput modes?",
    answer:
      "Performance modes: General Purpose (default, low latency, recommended for most workloads) and Max I/O (higher aggregate throughput, higher latency, for parallel processing at scale). Throughput modes: Elastic (automatically scales, pay per use—recommended), Provisioned (specify throughput independently of storage), and Bursting (throughput scales with storage size using a credit system).",
    keyPoints: [
      "General Purpose: low latency, default",
      "Max I/O: higher throughput, higher latency",
      "Elastic throughput: recommended, auto-scaling, pay per use",
    ],
    difficulty: "medium",
    tags: ["efs", "performance", "file-storage"],
  },
  {
    id: "saa-efs-3",
    service: "Amazon EFS",
    domain: "services",
    question:
      "What are EFS storage classes and how does lifecycle management work?",
    answer:
      "EFS has two storage classes: Standard (for frequently accessed files) and Infrequent Access (EFS-IA, cheaper storage but per-access fee). Lifecycle management automatically moves files between Standard and IA based on a configurable policy (e.g., 30 days since last access). Intelligent-Tiering automatically moves files in both directions based on access patterns.",
    keyPoints: [
      "Standard: frequent access",
      "EFS-IA: infrequent access, lower storage cost + retrieval fee",
      "Lifecycle policies automate tiering",
    ],
    difficulty: "medium",
    tags: ["efs", "storage-classes", "file-storage"],
  },
  {
    id: "saa-efs-4",
    service: "Amazon EFS",
    domain: "services",
    question:
      "What is EFS One Zone and when should you use it instead of Regional EFS?",
    answer:
      "EFS One Zone stores data in a single AZ, making it 47% cheaper than Regional EFS (which stores data redundantly across 3+ AZs). Use One Zone for development/test environments, workloads that don't need high durability, or when all consuming instances are in the same AZ. For production workloads needing high availability, use Regional EFS.",
    keyPoints: [
      "One Zone: single AZ, ~47% cheaper",
      "Regional: 3+ AZs, high durability",
      "One Zone for dev/test or same-AZ workloads",
    ],
    difficulty: "easy",
    tags: ["efs", "availability", "file-storage"],
  },
  {
    id: "saa-efs-5",
    service: "Amazon EFS",
    domain: "services",
    question:
      "How do you control access to EFS and what are the two layers of access control?",
    answer:
      "Access to EFS is controlled at two layers: network access via Security Groups on EFS Mount Targets (restricting which instances can mount the file system over NFS port 2049) and file system access via IAM policies and EFS Access Points (which enforce a specific user identity and root directory for application access to the shared file system).",
    keyPoints: [
      "Network: Security Groups on mount targets, port 2049",
      "Identity: IAM policies and EFS Access Points",
      "Access Points enforce POSIX identity (UID/GID)",
    ],
    difficulty: "hard",
    tags: ["efs", "security", "access-control"],
  },
  {
    id: "saa-efs-6",
    service: "Amazon EFS",
    domain: "services",
    question:
      "What are EFS Access Points and how do they support multi-tenant applications?",
    answer:
      "EFS Access Points provide application-specific entry points with an enforced POSIX user identity (UID/GID) and a root directory within the file system. Each application or tenant gets its own Access Point, preventing access to other directories. Combined with IAM, you can grant different Lambda functions or containers access to isolated directory trees within the same EFS file system.",
    keyPoints: [
      "Enforced POSIX UID/GID and root directory",
      "Isolates application access within shared EFS",
      "Combined with IAM for per-application access control",
    ],
    difficulty: "hard",
    tags: ["efs", "access-points", "multi-tenant"],
  },
  {
    id: "saa-efs-7",
    service: "Amazon EFS",
    domain: "services",
    question:
      "How does Amazon EFS compare to Amazon FSx for Windows File Server for Windows workloads?",
    answer:
      "EFS uses the NFS protocol and supports Linux only. For Windows workloads requiring SMB protocol, Active Directory integration, Windows ACLs, and DFS namespaces, use Amazon FSx for Windows File Server. FSx for Windows is built on Windows Server and fully compatible with Windows applications, while EFS is optimized for Linux/POSIX workloads.",
    keyPoints: [
      "EFS: NFS, Linux only",
      "FSx for Windows: SMB, AD integration, Windows ACLs",
      "Choose based on protocol and OS requirements",
    ],
    difficulty: "medium",
    tags: ["efs", "fsx", "file-storage"],
  },

  // ── Amazon S3 Glacier ──
  {
    id: "saa-glacier-1",
    service: "Amazon S3 Glacier",
    domain: "services",
    question:
      "What are the S3 Glacier retrieval options and their retrieval times?",
    answer:
      "S3 Glacier Flexible Retrieval has three options: Expedited (1–5 minutes, highest cost), Standard (3–5 hours, moderate cost), and Bulk (5–12 hours, lowest cost). S3 Glacier Deep Archive offers Standard (12 hours) and Bulk (48 hours) options. Glacier Instant Retrieval provides millisecond access but at a higher storage cost than Flexible.",
    keyPoints: [
      "Instant Retrieval: milliseconds (most expensive Glacier tier)",
      "Flexible Expedited: 1–5 minutes",
      "Deep Archive Standard: 12 hours; Bulk: 48 hours",
    ],
    difficulty: "medium",
    tags: ["glacier", "retrieval", "archival"],
  },
  {
    id: "saa-glacier-2",
    service: "Amazon S3 Glacier",
    domain: "services",
    question: "What is Glacier Vault Lock and how does it support compliance?",
    answer:
      "Glacier Vault Lock allows you to deploy compliance controls using a Vault Lock policy that, once locked, cannot be changed or deleted—even by AWS. It enforces WORM (Write Once Read Many) storage and is used for SEC 17a-4(f), HIPAA, and other regulatory requirements that mandate immutable archives for a defined retention period.",
    keyPoints: [
      "Immutable policy once locked",
      "Enforces WORM for regulatory compliance",
      "24-hour initiation window before lock is final",
    ],
    difficulty: "medium",
    tags: ["glacier", "compliance", "vault-lock"],
  },
  {
    id: "saa-glacier-3",
    service: "Amazon S3 Glacier",
    domain: "services",
    question:
      "How does S3 Lifecycle configuration transition objects to Glacier?",
    answer:
      "S3 Lifecycle rules automatically transition objects to cheaper storage classes after a specified number of days. For Glacier, objects must first be in Standard or Standard-IA for at least 30 days before transitioning to Glacier Flexible Retrieval, and 90 days before Deep Archive. Transitions can be configured per prefix or tag for fine-grained control.",
    keyPoints: [
      "Rules based on age (days after creation or last modified)",
      "Minimum days in IA before Glacier: 30 days",
      "Automates cost optimization without manual intervention",
    ],
    difficulty: "easy",
    tags: ["glacier", "lifecycle", "archival"],
  },
  {
    id: "saa-glacier-4",
    service: "Amazon S3 Glacier",
    domain: "services",
    question: "What is a Glacier Archive vs. a Vault?",
    answer:
      "A Vault is a container for archives in Glacier, analogous to an S3 bucket. An Archive is any object stored in a Vault (a file, zip, TAR), analogous to an S3 object. Each archive receives a unique archive ID upon upload. You can have unlimited archives in a vault and unlimited vaults per account per region.",
    keyPoints: [
      "Vault: container (like S3 bucket)",
      "Archive: stored object (like S3 object)",
      "Archives receive unique ID—store it; Glacier doesn't provide names",
    ],
    difficulty: "easy",
    tags: ["glacier", "terminology", "archival"],
  },
  {
    id: "saa-glacier-5",
    service: "Amazon S3 Glacier",
    domain: "services",
    question:
      "When should you choose S3 Glacier Deep Archive vs. S3 Glacier Flexible Retrieval?",
    answer:
      "Choose Deep Archive for data that is rarely (if ever) accessed and can tolerate 12–48 hour retrieval times—regulatory archives, long-term backups, historical records. Choose Glacier Flexible Retrieval when you occasionally need to retrieve data within a few hours (disaster recovery, legal discovery). Deep Archive costs about 75% less than Flexible Retrieval storage.",
    keyPoints: [
      "Deep Archive: lowest cost, 12–48 hour retrieval",
      "Flexible Retrieval: occasional access, 1 min to 12 hours",
      "Deep Archive ~75% cheaper storage than Flexible",
    ],
    difficulty: "medium",
    tags: ["glacier", "deep-archive", "archival"],
  },
  {
    id: "saa-glacier-6",
    service: "Amazon S3 Glacier",
    domain: "services",
    question:
      "What are Glacier Expedited retrievals and how do you ensure capacity is available?",
    answer:
      "Expedited retrievals typically return data within 1–5 minutes but use shared capacity that may not be available during high-demand periods. For guaranteed availability, purchase Provisioned Retrieval Capacity units, which ensure Expedited retrievals succeed even during AWS-wide high demand. Each unit provides at least 3 retrievals per 5 minutes and up to 150 MB/s of retrieval throughput.",
    keyPoints: [
      "Expedited: 1–5 minutes, shared capacity",
      "Provisioned capacity: guaranteed Expedited availability",
      "3 retrievals per 5 min, 150 MB/s per unit",
    ],
    difficulty: "hard",
    tags: ["glacier", "expedited", "retrieval"],
  },
  {
    id: "saa-glacier-7",
    service: "Amazon S3 Glacier",
    domain: "services",
    question:
      "What are the minimum storage duration charges for Glacier storage classes?",
    answer:
      "S3 Glacier Instant Retrieval has a 90-day minimum storage duration. S3 Glacier Flexible Retrieval has a 90-day minimum. S3 Glacier Deep Archive has a 180-day minimum. If you delete objects before the minimum duration, you are charged for the remaining days. This affects decisions about archiving short-lived data.",
    keyPoints: [
      "Instant Retrieval: 90-day minimum",
      "Flexible Retrieval: 90-day minimum",
      "Deep Archive: 180-day minimum",
    ],
    difficulty: "medium",
    tags: ["glacier", "pricing", "archival"],
  },

  // ── Amazon Kinesis ──
  {
    id: "saa-kinesis-1",
    service: "Amazon Kinesis",
    domain: "development",
    question: "What are the four Kinesis services and their primary use cases?",
    answer:
      "Kinesis Data Streams: custom real-time processing, store streaming data with configurable retention. Kinesis Data Firehose: managed delivery to S3, Redshift, OpenSearch, or Splunk with optional transformation—no coding needed. Kinesis Data Analytics: run SQL or Apache Flink on streaming data in real time. Kinesis Video Streams: ingest and process video streams from devices.",
    keyPoints: [
      "Data Streams: custom processing, SDK consumers",
      "Firehose: managed delivery, no consumer code",
      "Data Analytics: real-time SQL/Flink on streams",
    ],
    difficulty: "medium",
    tags: ["kinesis", "streaming", "data-streams"],
  },
  {
    id: "saa-kinesis-2",
    service: "Amazon Kinesis",
    domain: "development",
    question:
      "What is a Kinesis Data Streams shard and what are its throughput limits?",
    answer:
      "A shard is the base throughput unit of a Kinesis Data Stream. Each shard supports 1 MB/s or 1,000 records per second for writes (PutRecord). For reads, each shard supports up to 2 MB/s or 5 reads per second using GetRecords. Using Enhanced Fan-Out, each registered consumer gets a dedicated 2 MB/s read pipe per shard.",
    keyPoints: [
      "Write: 1 MB/s or 1,000 records/s per shard",
      "Standard read: 2 MB/s shared across all consumers",
      "Enhanced Fan-Out: 2 MB/s per consumer per shard",
    ],
    difficulty: "medium",
    tags: ["kinesis", "shards", "streaming"],
  },
  {
    id: "saa-kinesis-3",
    service: "Amazon Kinesis",
    domain: "development",
    question:
      "What is Kinesis Data Streams data retention and how does it support replay?",
    answer:
      "Kinesis Data Streams retains data for 24 hours by default, extendable up to 365 days with Long-Term Data Retention. Because records are not deleted on read (unlike SQS), multiple consumers can independently process the same stream, and consumers can reprocess historical data by resetting their sequence number or timestamp—enabling replay and reprocessing scenarios.",
    keyPoints: [
      "Default retention: 24 hours, max: 365 days",
      "Records not deleted on read (unlike SQS)",
      "Multiple consumers can replay from any point",
    ],
    difficulty: "medium",
    tags: ["kinesis", "retention", "streaming"],
  },
  {
    id: "saa-kinesis-4",
    service: "Amazon Kinesis",
    domain: "development",
    question:
      "What is the difference between Kinesis Data Firehose and Kinesis Data Streams?",
    answer:
      "Kinesis Data Streams requires you to write consumer code (Lambda, KCL) and manages the stream for custom processing. Kinesis Data Firehose is fully managed with no consumer code—it buffers and delivers to destinations (S3, Redshift, OpenSearch) with built-in data transformation via Lambda. Data Streams offers near-real-time processing; Firehose introduces a 60-second to 15-minute buffer.",
    keyPoints: [
      "Streams: custom consumers, near-real-time",
      "Firehose: managed delivery, no consumer code, buffered",
      "Firehose buffer: 60 seconds minimum or 1–128 MB",
    ],
    difficulty: "medium",
    tags: ["kinesis", "firehose", "streaming"],
  },
  {
    id: "saa-kinesis-5",
    service: "Amazon Kinesis",
    domain: "development",
    question:
      "What is a partition key in Kinesis and how does it affect data distribution?",
    answer:
      "A partition key is specified per record and determines which shard receives the record via MD5 hash. Records with the same partition key always go to the same shard, preserving order for that key. Using a high-cardinality partition key (e.g., user ID) distributes load across shards. A low-cardinality key (e.g., country with few values) creates hot shards.",
    keyPoints: [
      "Same partition key → same shard (ordered per key)",
      "High cardinality key → even shard distribution",
      "Hot shard: low cardinality causes throughput throttling",
    ],
    difficulty: "hard",
    tags: ["kinesis", "partition-key", "streaming"],
  },
  {
    id: "saa-kinesis-6",
    service: "Amazon Kinesis",
    domain: "development",
    question: "When would you use Kinesis over SQS for a streaming use case?",
    answer:
      "Use Kinesis when you need: multiple independent consumers reading the same data, replay/reprocessing of historical records, ordered processing per partition key, or time-series analytics. Use SQS when you need: simple decoupling with one consumer type, at-least-once delivery with automatic visibility, or when message ordering is not required (Standard) or strictly FIFO with deduplication.",
    keyPoints: [
      "Kinesis: multiple consumers, replay, ordered per key",
      "SQS: simple decoupling, single consumer group, no replay",
      "Kinesis is streaming; SQS is queuing",
    ],
    difficulty: "hard",
    tags: ["kinesis", "sqs", "streaming"],
  },
  {
    id: "saa-kinesis-7",
    service: "Amazon Kinesis",
    domain: "development",
    question:
      "What is Kinesis Data Analytics and what real-time use cases does it support?",
    answer:
      "Kinesis Data Analytics allows you to run Apache Flink applications or SQL queries on data from Kinesis Data Streams or Firehose in real time. Use cases include anomaly detection, real-time dashboards, time-windowed aggregations (e.g., orders per minute), filtering and enrichment before delivery to downstream systems, and session analysis.",
    keyPoints: [
      "Run Flink or SQL on streaming data",
      "Sources: Kinesis Streams or Firehose",
      "Use for windowed aggregations and real-time analytics",
    ],
    difficulty: "medium",
    tags: ["kinesis", "analytics", "streaming"],
  },

  // ── AWS WAF ──
  {
    id: "saa-waf-1",
    service: "AWS WAF",
    domain: "security",
    question: "What is AWS WAF and what does it protect against?",
    answer:
      "AWS WAF (Web Application Firewall) filters HTTP/HTTPS traffic based on rules to protect against common web attacks. It protects against OWASP Top 10 threats including SQL injection, cross-site scripting (XSS), bad bots, malicious IPs, and oversized requests. WAF can be deployed on CloudFront, ALB, API Gateway, and AppSync.",
    keyPoints: [
      "Protects against SQLi, XSS, bot traffic",
      "Deploys on CloudFront, ALB, API Gateway, AppSync",
      "Rule-based allow/block/count decisions",
    ],
    difficulty: "easy",
    tags: ["waf", "security", "web-security"],
  },
  {
    id: "saa-waf-2",
    service: "AWS WAF",
    domain: "security",
    question: "What are WAF Web ACLs and rule groups?",
    answer:
      "A Web ACL (Access Control List) is the top-level WAF resource attached to a CloudFront distribution, ALB, or API Gateway. It contains rules or rule groups that inspect requests. A Rule Group is a reusable collection of rules that can be shared across Web ACLs. AWS Managed Rule Groups provide pre-built protection (OWASP Top 10, known bad inputs, bot control) without requiring custom rule authoring.",
    keyPoints: [
      "Web ACL: attached to a resource, contains rules",
      "Rule Group: reusable rule collection",
      "AWS Managed Rules: pre-built OWASP and bot protection",
    ],
    difficulty: "medium",
    tags: ["waf", "web-acl", "security"],
  },
  {
    id: "saa-waf-3",
    service: "AWS WAF",
    domain: "security",
    question: "What is WAF rate-based rules and how do they prevent DDoS?",
    answer:
      "Rate-based rules count requests from a single IP address over a 5-minute period and automatically block or challenge IPs that exceed the threshold. This mitigates volumetric attacks and brute force attempts. Unlike static IP blocking, rate-based rules dynamically respond to spikes, automatically unblocking IPs when their request rate drops below the threshold.",
    keyPoints: [
      "Counts requests per IP per 5-minute window",
      "Auto-blocks IPs exceeding threshold",
      "Auto-unblocks when rate drops",
    ],
    difficulty: "medium",
    tags: ["waf", "rate-limiting", "ddos"],
  },
  {
    id: "saa-waf-4",
    service: "AWS WAF",
    domain: "security",
    question: "How does AWS WAF Bot Control protect web applications?",
    answer:
      "WAF Bot Control is a managed rule group that identifies and manages bot traffic by classifying bots into verified good bots (Googlebot, etc.) and common bots. It can challenge suspicious bots with CAPTCHA or JavaScript challenges, count bot traffic for analysis, or block bots outright. This protects against scrapers, credential stuffing, and inventory hoarding.",
    keyPoints: [
      "Classifies bots: verified good, common, targeted",
      "Actions: allow, block, challenge (CAPTCHA/JS)",
      "Protects against scrapers and credential stuffing",
    ],
    difficulty: "medium",
    tags: ["waf", "bot-control", "security"],
  },
  {
    id: "saa-waf-5",
    service: "AWS WAF",
    domain: "security",
    question:
      "What is the difference between AWS WAF, AWS Shield, and AWS Firewall Manager?",
    answer:
      "AWS WAF filters application-layer (Layer 7) web traffic based on rules. AWS Shield provides managed DDoS protection at network (Layer 3/4) and application layers—Shield Standard is free; Shield Advanced adds 24/7 DDoS response team support. AWS Firewall Manager centrally configures and manages WAF rules, Shield protections, and Security Groups across multiple accounts in an AWS Organization.",
    keyPoints: [
      "WAF: Layer 7 rule-based filtering",
      "Shield: DDoS protection (L3/4, Standard free)",
      "Firewall Manager: centralized management across accounts",
    ],
    difficulty: "medium",
    tags: ["waf", "shield", "security"],
  },
  {
    id: "saa-waf-6",
    service: "AWS WAF",
    domain: "security",
    question: "What WAF rule conditions can you use to match requests?",
    answer:
      "WAF rules can match on: IP address or IP set (including geo-match by country), string match on headers, URI, query string, or body, regex pattern match, SQL injection detection, XSS detection, request size constraints, and label match (from other rules or managed rule groups). Conditions can be combined with AND/OR/NOT logic within a rule.",
    keyPoints: [
      "IP/geo match, string match, regex, SQLi, XSS detectors",
      "Match on URI, headers, query string, or body",
      "Combine with AND/OR/NOT logic",
    ],
    difficulty: "hard",
    tags: ["waf", "rules", "security"],
  },
  {
    id: "saa-waf-7",
    service: "AWS WAF",
    domain: "security",
    question:
      "How do you use WAF logging and metrics to investigate a security incident?",
    answer:
      "WAF can send full request logs to CloudWatch Logs, S3, or Kinesis Data Firehose. Logs include the matched rule, action taken, client IP, country, URI, and headers. CloudWatch metrics provide counts of allowed, blocked, and counted requests per rule. Use Logs Insights to query for specific IPs or attack patterns and adjust rules in response to findings.",
    keyPoints: [
      "Log destinations: CloudWatch Logs, S3, Kinesis Firehose",
      "Logs include rule match, action, IP, URI, headers",
      "CloudWatch metrics per rule for dashboards and alarms",
    ],
    difficulty: "hard",
    tags: ["waf", "logging", "security"],
  },

  // ── Amazon EBS ──
  {
    id: "saa-ebs-1",
    service: "Amazon EBS",
    domain: "storage",
    question: "What are the four EBS volume types and their primary use cases?",
    answer:
      "gp3 (General Purpose SSD) is the default for most workloads—up to 16,000 IOPS. io2 Block Express is the highest-performance SSD for I/O-intensive databases requiring durability. st1 (Throughput Optimized HDD) is for sequential big-data workloads like log processing. sc1 (Cold HDD) is the lowest-cost option for infrequently accessed data.",
    keyPoints: [
      "gp3: 3,000 IOPS baseline, 16,000 max, independently configurable throughput",
      "io2: up to 256,000 IOPS, 99.999% durability",
      "st1/sc1: HDD, cannot be boot volumes",
    ],
    difficulty: "medium",
    tags: ["ebs", "storage", "compute"],
  },
  {
    id: "saa-ebs-2",
    service: "Amazon EBS",
    domain: "storage",
    question: "How does EBS Multi-Attach work and what are its constraints?",
    answer:
      "Multi-Attach allows a single io1 or io2 volume to be attached to up to 16 Nitro-based EC2 instances in the same Availability Zone simultaneously. Each instance has full read/write permissions. The application must manage concurrent writes to prevent data corruption—it requires a cluster-aware file system (not standard ext4 or NTFS).",
    keyPoints: [
      "io1/io2 only, same AZ only",
      "Up to 16 instances simultaneously",
      "Requires cluster-aware file system (e.g., GFS2)",
    ],
    difficulty: "hard",
    tags: ["ebs", "multi-attach", "storage"],
  },
  {
    id: "saa-ebs-3",
    service: "Amazon EBS",
    domain: "storage",
    question: "What is EBS encryption and what does it cover?",
    answer:
      "EBS encryption uses AWS KMS to encrypt data at rest on the volume, data in transit between the volume and the instance, all snapshots, and volumes created from encrypted snapshots. Encryption is enabled per volume and has minimal performance impact. Snapshots of encrypted volumes are always encrypted; you cannot create an unencrypted snapshot from an encrypted volume.",
    keyPoints: [
      "Encrypts data at rest and in transit",
      "Uses KMS CMK (default or custom)",
      "Snapshots inherit encryption state of source volume",
    ],
    difficulty: "medium",
    tags: ["ebs", "encryption", "security"],
  },
  {
    id: "saa-ebs-4",
    service: "Amazon EBS",
    domain: "storage",
    question:
      "How do EBS snapshots work and how can you copy them across regions?",
    answer:
      "EBS snapshots are incremental backups stored in S3—only changed blocks since the last snapshot are saved. You can use the Copy Snapshot feature in the console or CLI to copy a snapshot to any other region, which creates an independent snapshot. Snapshots can be shared with other AWS accounts or made public.",
    keyPoints: [
      "Incremental: only changed blocks stored",
      "Stored in S3 (managed by AWS, not your bucket)",
      "Copy Snapshot for cross-region DR",
    ],
    difficulty: "easy",
    tags: ["ebs", "snapshots", "backup"],
  },
  {
    id: "saa-ebs-5",
    service: "Amazon EBS",
    domain: "storage",
    question: "What is Amazon Data Lifecycle Manager (DLM) used for?",
    answer:
      "Amazon DLM automates the creation, retention, and deletion of EBS snapshots and EBS-backed AMIs. You define lifecycle policies specifying snapshot frequency, retention count or age, and cross-region copy rules. DLM eliminates the need for custom Lambda scripts and enforces consistent backup schedules across volumes.",
    keyPoints: [
      "Automates snapshot creation, retention, deletion",
      "Supports cross-region copy in policy",
      "Reduces operational overhead vs. custom scripts",
    ],
    difficulty: "medium",
    tags: ["ebs", "dlm", "backup"],
  },
  {
    id: "saa-ebs-6",
    service: "Amazon EBS",
    domain: "storage",
    question: "What is EBS-optimized and why does it matter?",
    answer:
      "EBS-optimized instances provide a dedicated network path for EBS traffic, separate from general instance network traffic. This eliminates contention between EC2 and EBS I/O and ensures consistent performance. Most current generation instance types are EBS-optimized by default; older types may require enabling it explicitly.",
    keyPoints: [
      "Dedicated bandwidth for EBS I/O",
      "Eliminates network contention",
      "Enabled by default on current-gen instances",
    ],
    difficulty: "easy",
    tags: ["ebs", "performance", "compute"],
  },
  {
    id: "saa-ebs-7",
    service: "Amazon EBS",
    domain: "storage",
    question:
      "How do you increase EBS volume size or change type without downtime?",
    answer:
      "Use Elastic Volumes to modify a volume's size, type, or IOPS while it is attached to a running instance. After the modification completes, you must extend the OS file system (e.g., growpart + resize2fs on Linux) to use the extra space. Volume size can only be increased, never decreased.",
    keyPoints: [
      "Elastic Volumes: modify live without detaching",
      "File system resize is a separate OS step",
      "Size can only increase, not decrease",
    ],
    difficulty: "medium",
    tags: ["ebs", "elastic-volumes", "storage"],
  },

  // ── Amazon Aurora ──
  {
    id: "saa-aurora-1",
    service: "Amazon Aurora",
    domain: "database",
    question: "How does Aurora storage differ from standard RDS?",
    answer:
      "Aurora uses a distributed, auto-scaling storage layer that spans three Availability Zones with six copies of data (two per AZ). The storage automatically grows in 10 GB increments up to 128 TB with no provisioning required. Reads can tolerate losing two copies; writes can tolerate losing one copy.",
    keyPoints: [
      "6 copies across 3 AZs automatically",
      "Auto-grows up to 128 TB",
      "Tolerates 2 copy failures for reads, 1 for writes",
    ],
    difficulty: "hard",
    tags: ["aurora", "storage", "database"],
  },
  {
    id: "saa-aurora-2",
    service: "Amazon Aurora",
    domain: "database",
    question:
      "What is an Aurora Read Replica and how does it differ from RDS Read Replicas?",
    answer:
      "Aurora Read Replicas share the same underlying storage volume as the primary, so replication lag is typically under 10 ms. You can have up to 15 Aurora Read Replicas (vs. 5 for RDS). During failover, Aurora promotes a Read Replica in under 30 seconds without data loss, while RDS must replay binlog during failover.",
    keyPoints: [
      "Up to 15 replicas, sub-10 ms replication lag",
      "Shared storage—no data transfer cost for replication",
      "Failover in <30 seconds without data loss",
    ],
    difficulty: "medium",
    tags: ["aurora", "replication", "database"],
  },
  {
    id: "saa-aurora-3",
    service: "Amazon Aurora",
    domain: "database",
    question: "What is Aurora Serverless v2 and when should you use it?",
    answer:
      "Aurora Serverless v2 automatically scales compute capacity in fine-grained increments (0.5 ACU steps) based on actual load, within seconds. It is ideal for variable or unpredictable workloads, dev/test environments, and multi-tenant SaaS apps. Unlike v1, v2 can scale to zero only with appropriate settings and supports Multi-AZ.",
    keyPoints: [
      "Scales in 0.5 ACU increments within seconds",
      "Supports Multi-AZ and read replicas",
      "Ideal for unpredictable or spiky workloads",
    ],
    difficulty: "medium",
    tags: ["aurora", "serverless", "database"],
  },
  {
    id: "saa-aurora-4",
    service: "Amazon Aurora",
    domain: "database",
    question: "What is Aurora Global Database and what RPO/RTO does it offer?",
    answer:
      "Aurora Global Database spans up to five secondary AWS regions with replication lag under one second. In a regional outage the secondary can be promoted to primary in under one minute (RTO) with RPO of typically under five seconds. Secondary regions serve local read traffic, reducing cross-region latency for global applications.",
    keyPoints: [
      "Up to 5 secondary regions, <1 second replication lag",
      "Promote secondary in <1 minute (RTO)",
      "RPO typically <5 seconds",
    ],
    difficulty: "hard",
    tags: ["aurora", "global-database", "disaster-recovery"],
  },
  {
    id: "saa-aurora-5",
    service: "Amazon Aurora",
    domain: "database",
    question: "What is the Aurora cluster endpoint vs. reader endpoint?",
    answer:
      "The cluster endpoint (writer endpoint) always points to the current primary instance and handles write operations. The reader endpoint load-balances connections across all available Aurora Read Replicas. Applications should use the writer endpoint for writes and the reader endpoint for read-heavy queries to distribute load automatically.",
    keyPoints: [
      "Writer endpoint: always routes to primary",
      "Reader endpoint: load-balances across read replicas",
      "Custom endpoints can target specific instance subsets",
    ],
    difficulty: "easy",
    tags: ["aurora", "endpoints", "database"],
  },
  {
    id: "saa-aurora-6",
    service: "Amazon Aurora",
    domain: "database",
    question:
      "What is Aurora Backtrack and how does it differ from point-in-time restore?",
    answer:
      "Aurora Backtrack rewinds the database to a specific point in time without creating a new cluster—it is in-place and can complete in seconds. Point-in-time restore creates a new cluster from backups, which takes minutes. Backtrack is limited to 72 hours and is only available for Aurora MySQL.",
    keyPoints: [
      "In-place rewind, seconds to complete",
      "Max 72 hours lookback, Aurora MySQL only",
      "PITR creates a new cluster from backups",
    ],
    difficulty: "hard",
    tags: ["aurora", "backtrack", "backup"],
  },
  {
    id: "saa-aurora-7",
    service: "Amazon Aurora",
    domain: "database",
    question: "How does Aurora handle automatic failover?",
    answer:
      "Aurora automatically detects primary instance failure and promotes the Read Replica with the highest priority tier (0 is highest). Failover completes in under 30 seconds. The DNS for the cluster endpoint is updated automatically so applications reconnect without code changes. If no replica exists, Aurora creates a new primary in the same AZ.",
    keyPoints: [
      "Promotes replica by priority tier (0 = highest)",
      "Failover in <30 seconds",
      "Cluster endpoint DNS updated automatically",
    ],
    difficulty: "medium",
    tags: ["aurora", "failover", "ha"],
  },

  // ── Amazon Redshift ──
  {
    id: "saa-redshift-1",
    service: "Amazon Redshift",
    domain: "analytics",
    question:
      "What type of database is Amazon Redshift and what is it optimized for?",
    answer:
      "Redshift is a fully managed, petabyte-scale columnar data warehouse. It is optimized for OLAP (Online Analytical Processing) workloads—complex queries that aggregate large amounts of historical data. Columnar storage means only the columns needed for a query are read, reducing I/O. It is not suited for OLTP workloads with many small transactions.",
    keyPoints: [
      "Columnar storage, OLAP optimized",
      "Petabyte-scale data warehousing",
      "Not for OLTP—use RDS/Aurora for that",
    ],
    difficulty: "easy",
    tags: ["redshift", "analytics", "data-warehouse"],
  },
  {
    id: "saa-redshift-2",
    service: "Amazon Redshift",
    domain: "analytics",
    question: "What is Redshift Spectrum and what problem does it solve?",
    answer:
      "Redshift Spectrum allows you to query data stored directly in S3 without loading it into Redshift. It extends queries to exabytes of unstructured data in S3 using the same SQL as Redshift, with separate compute nodes for S3 queries. This avoids costly ETL and lets you store infrequently accessed cold data cheaply in S3 while still joining it with warm data in Redshift.",
    keyPoints: [
      "Query S3 data without ingestion",
      "Separate Spectrum compute nodes scale independently",
      "Use for cold/archival data to reduce Redshift storage costs",
    ],
    difficulty: "medium",
    tags: ["redshift", "spectrum", "analytics"],
  },
  {
    id: "saa-redshift-3",
    service: "Amazon Redshift",
    domain: "analytics",
    question: "What is Redshift Enhanced VPC Routing and why enable it?",
    answer:
      "Enhanced VPC Routing forces all COPY and UNLOAD traffic between the cluster and S3 to travel through the VPC instead of over the public internet. This allows you to apply VPC flow logs, security groups, and VPC endpoints for compliance and auditing. Without it, Redshift routes traffic through the internet, which bypasses VPC security controls.",
    keyPoints: [
      "Forces COPY/UNLOAD through VPC, not public internet",
      "Enables VPC flow logs and security groups on that traffic",
      "Required for compliance environments",
    ],
    difficulty: "medium",
    tags: ["redshift", "vpc", "security"],
  },
  {
    id: "saa-redshift-4",
    service: "Amazon Redshift",
    domain: "analytics",
    question: "How does Redshift Serverless differ from provisioned clusters?",
    answer:
      "Redshift Serverless automatically provisions and scales compute capacity based on query demand—you pay per RPU-second instead of for idle nodes. It is ideal for intermittent analytics, dev/test, or unpredictable workloads. Provisioned clusters give more control over node type, distribution keys, and sort keys, and are cost-effective for consistent, heavy workloads.",
    keyPoints: [
      "Serverless: auto-scales, pay per RPU-second",
      "Provisioned: fixed node count, better for steady workloads",
      "Serverless has no cluster management overhead",
    ],
    difficulty: "medium",
    tags: ["redshift", "serverless", "analytics"],
  },
  {
    id: "saa-redshift-5",
    service: "Amazon Redshift",
    domain: "analytics",
    question:
      "What are distribution styles in Redshift and why do they matter?",
    answer:
      "Distribution style controls how rows are distributed across compute nodes. AUTO lets Redshift choose. EVEN distributes rows round-robin—good when no join is performed on the table. KEY distributes rows by a column value—collocates matching rows for faster joins. ALL copies the entire table to every node—good for small dimension tables joined frequently.",
    keyPoints: [
      "EVEN: round-robin, good for fact tables with no co-located joins",
      "KEY: join-key distribution for large table joins",
      "ALL: full copy on every node for small dimension tables",
    ],
    difficulty: "hard",
    tags: ["redshift", "distribution", "analytics"],
  },
  {
    id: "saa-redshift-6",
    service: "Amazon Redshift",
    domain: "analytics",
    question: "How do you load data into Redshift efficiently?",
    answer:
      "The COPY command is the fastest way to load data—it reads in parallel from S3, DynamoDB, or EMR. Load from S3 in compressed, columnar formats (Parquet, ORC) split into multiple files matching the number of slices. Avoid single-file loads, which serialize I/O. Use manifest files to control exactly which S3 files are loaded.",
    keyPoints: [
      "COPY command parallelizes across slices",
      "Split files to match slice count for max throughput",
      "Compressed Parquet/ORC reduces I/O",
    ],
    difficulty: "medium",
    tags: ["redshift", "copy", "data-loading"],
  },
  {
    id: "saa-redshift-7",
    service: "Amazon Redshift",
    domain: "analytics",
    question:
      "What is Redshift Automated Snapshots and cross-region snapshot copy?",
    answer:
      "Redshift automatically takes snapshots every 8 hours or every 5 GB of data change, retaining them for 1–35 days. You can enable cross-region snapshot copy to automatically replicate snapshots to another region for DR. Manual snapshots are retained indefinitely until deleted and can also be copied cross-region.",
    keyPoints: [
      "Automated snapshots: every 8 hours or 5 GB, 1-35 day retention",
      "Cross-region copy for DR",
      "Manual snapshots retained indefinitely",
    ],
    difficulty: "easy",
    tags: ["redshift", "snapshots", "backup"],
  },

  // ── Amazon API Gateway ──
  {
    id: "saa-apigw-1",
    service: "Amazon API Gateway",
    domain: "integration",
    question:
      "What are the three types of APIs in API Gateway and their differences?",
    answer:
      "REST API is the original type—feature-rich with usage plans, API keys, caching, and request/response transformation. HTTP API is a newer, cheaper, lower-latency alternative to REST APIs with fewer features but native JWT authorization and CORS support. WebSocket API enables two-way persistent connections for real-time apps like chat and live dashboards.",
    keyPoints: [
      "REST API: full features, higher cost",
      "HTTP API: 70% cheaper than REST, lower latency, fewer features",
      "WebSocket API: persistent bidirectional connections",
    ],
    difficulty: "medium",
    tags: ["api-gateway", "rest", "serverless"],
  },
  {
    id: "saa-apigw-2",
    service: "Amazon API Gateway",
    domain: "integration",
    question: "What is API Gateway caching and when should you enable it?",
    answer:
      "API Gateway can cache endpoint responses at the stage level with a configurable TTL (0 to 3,600 seconds, default 300). Caching reduces backend hits for repeated identical requests. Cache capacity ranges from 0.5 GB to 237 GB. Enable it for read-heavy APIs where the same response can be served to many callers without hitting the backend each time.",
    keyPoints: [
      "Stage-level cache, TTL 0–3600 seconds",
      "Reduces backend invocations",
      "Cache can be invalidated per-request with header",
    ],
    difficulty: "medium",
    tags: ["api-gateway", "caching", "performance"],
  },
  {
    id: "saa-apigw-3",
    service: "Amazon API Gateway",
    domain: "integration",
    question: "How does API Gateway throttling protect backend services?",
    answer:
      "API Gateway enforces throttling at the account level (10,000 RPS, 5,000 burst by default) and per stage/method using usage plans. When limits are exceeded it returns HTTP 429 Too Many Requests. Usage plans link API keys to throttle limits and quotas, letting you offer different service tiers to clients.",
    keyPoints: [
      "Default: 10,000 RPS account-wide, 5,000 burst",
      "Per-stage/method overrides via usage plans",
      "429 returned when throttled",
    ],
    difficulty: "medium",
    tags: ["api-gateway", "throttling", "security"],
  },
  {
    id: "saa-apigw-4",
    service: "Amazon API Gateway",
    domain: "integration",
    question: "What are the authorization options available in API Gateway?",
    answer:
      "IAM authorization uses Signature V4 and is best for AWS service-to-service calls. Cognito User Pools authorization validates JWT tokens issued by Cognito. Lambda authorizers (formerly Custom Authorizers) run a Lambda function to evaluate a bearer token or request parameters—useful for third-party OAuth or custom auth schemes.",
    keyPoints: [
      "IAM: SigV4, best for internal AWS callers",
      "Cognito: JWT validation, no Lambda overhead",
      "Lambda authorizer: flexible, custom token validation",
    ],
    difficulty: "hard",
    tags: ["api-gateway", "authorization", "security"],
  },
  {
    id: "saa-apigw-5",
    service: "Amazon API Gateway",
    domain: "integration",
    question:
      "What is a stage in API Gateway and what can you configure per stage?",
    answer:
      "A stage is a named snapshot of the API deployment (e.g., dev, staging, prod). Per stage you can configure throttling limits, caching, logging verbosity, X-Ray tracing, and stage variables (environment-specific values like Lambda aliases or backend URLs). Stage variables let a single API definition route to different backends per environment.",
    keyPoints: [
      "Stages are named deployment snapshots",
      "Stage variables inject environment config at runtime",
      "Each stage can have independent throttle and cache settings",
    ],
    difficulty: "medium",
    tags: ["api-gateway", "stages", "deployment"],
  },
  {
    id: "saa-apigw-6",
    service: "Amazon API Gateway",
    domain: "integration",
    question:
      "How does API Gateway integrate with Lambda and what is Lambda proxy integration?",
    answer:
      "In Lambda proxy integration the entire HTTP request (headers, path, query string, body, context) is passed as a structured event to the Lambda function. The function is responsible for returning a properly formatted response object with statusCode, headers, and body. This gives Lambda full control but requires it to format responses correctly.",
    keyPoints: [
      "Proxy: full request forwarded as event",
      "Lambda must return {statusCode, headers, body}",
      "Non-proxy: API Gateway transforms request/response via mapping templates",
    ],
    difficulty: "medium",
    tags: ["api-gateway", "lambda", "integration"],
  },
  {
    id: "saa-apigw-7",
    service: "Amazon API Gateway",
    domain: "integration",
    question: "What is a VPC Link in API Gateway and when do you need one?",
    answer:
      "A VPC Link lets API Gateway connect to private resources inside a VPC—such as an NLB in front of ECS tasks or EC2 instances—without exposing those resources to the public internet. Without a VPC Link, API Gateway can only reach publicly accessible endpoints. VPC Links are supported for both REST APIs (via NLB) and HTTP APIs (via ALB or NLB through Cloud Map).",
    keyPoints: [
      "Connects API Gateway to private VPC resources",
      "REST API VPC Link uses NLB",
      "HTTP API VPC Link supports ALB and NLB via Cloud Map",
    ],
    difficulty: "hard",
    tags: ["api-gateway", "vpc-link", "networking"],
  },

  // ── AWS Step Functions ──
  {
    id: "saa-stepfn-1",
    service: "AWS Step Functions",
    domain: "integration",
    question: "What is AWS Step Functions and what problem does it solve?",
    answer:
      "Step Functions is a serverless orchestration service that coordinates multiple AWS services into workflows using state machines. It solves the problem of managing multi-step processes in distributed systems—handling retries, error handling, parallel execution, and wait states without writing custom coordination code in each service.",
    keyPoints: [
      "Orchestrates Lambda, ECS, DynamoDB, SQS, and 200+ services",
      "Built-in retry, catch, wait, and parallel states",
      "Replaces complex glue code in multi-service workflows",
    ],
    difficulty: "easy",
    tags: ["step-functions", "orchestration", "serverless"],
  },
  {
    id: "saa-stepfn-2",
    service: "AWS Step Functions",
    domain: "integration",
    question:
      "What is the difference between Standard and Express workflows in Step Functions?",
    answer:
      "Standard workflows run for up to one year, execute exactly-once, and maintain full execution history in the console—suited for long-running, auditable business processes. Express workflows run for up to five minutes, support at-least-once execution, and are priced per execution-duration—suited for high-volume, short-lived event processing.",
    keyPoints: [
      "Standard: up to 1 year, exactly-once, full history",
      "Express: up to 5 minutes, at-least-once, cheaper at scale",
      "Express: Synchronous or Asynchronous variants",
    ],
    difficulty: "medium",
    tags: ["step-functions", "workflow-types", "serverless"],
  },
  {
    id: "saa-stepfn-3",
    service: "AWS Step Functions",
    domain: "integration",
    question: "How do you handle errors and retries in Step Functions?",
    answer:
      "Each state can include a Retry block specifying ErrorEquals (error names to match), IntervalSeconds (initial backoff), MaxAttempts (retry count), and BackoffRate (multiplier). A Catch block redirects execution to a fallback state after all retries are exhausted. This declarative retry logic replaces try/catch code in individual Lambdas.",
    keyPoints: [
      "Retry: match error types, exponential backoff, max attempts",
      "Catch: redirect to fallback state after retries fail",
      "Error types: States.ALL matches any error",
    ],
    difficulty: "medium",
    tags: ["step-functions", "error-handling", "retry"],
  },
  {
    id: "saa-stepfn-4",
    service: "AWS Step Functions",
    domain: "integration",
    question: "What are the Step Functions state types and what does each do?",
    answer:
      "Task invokes a service (Lambda, ECS, SQS, etc.). Choice branches based on conditions. Parallel runs branches concurrently and waits for all to complete. Map iterates over an array. Wait pauses for a duration or until a timestamp. Pass passes input to output, optionally injecting data. Succeed and Fail terminate the workflow successfully or with an error.",
    keyPoints: [
      "Task: invoke any integrated AWS service",
      "Parallel/Map: concurrent and iterative execution",
      "Choice: conditional branching like switch/case",
    ],
    difficulty: "medium",
    tags: ["step-functions", "states", "orchestration"],
  },
  {
    id: "saa-stepfn-5",
    service: "AWS Step Functions",
    domain: "integration",
    question:
      "What is the callback pattern with Step Functions and when do you use it?",
    answer:
      "The callback pattern uses .waitForTaskToken—Step Functions pauses the workflow and sends a task token to an external system (via SQS, Lambda, etc.). The workflow resumes only when the external system calls SendTaskSuccess or SendTaskFailure with the token. This is used when a step requires a human approval or an asynchronous external process to complete before continuing.",
    keyPoints: [
      "waitForTaskToken: pause until external callback",
      "Token sent to SQS, Lambda, or API call",
      "Used for human approvals and async integrations",
    ],
    difficulty: "hard",
    tags: ["step-functions", "callback", "async"],
  },
  {
    id: "saa-stepfn-6",
    service: "AWS Step Functions",
    domain: "integration",
    question: "How does Step Functions integrate with services without Lambda?",
    answer:
      "Step Functions SDK Integrations (Optimized Integrations) let states directly call AWS APIs—DynamoDB PutItem, ECS RunTask, SNS Publish, SQS SendMessage, Bedrock InvokeModel, and more—without a Lambda wrapper. This reduces cost, latency, and operational overhead. Choose Request-Response (fire and forget), .sync (wait for completion), or .waitForTaskToken (wait for callback).",
    keyPoints: [
      "Direct SDK Integrations: no Lambda needed",
      "200+ AWS service APIs supported",
      "Reduces cost and latency vs. Lambda wrappers",
    ],
    difficulty: "hard",
    tags: ["step-functions", "sdk-integrations", "serverless"],
  },
  {
    id: "saa-stepfn-7",
    service: "AWS Step Functions",
    domain: "integration",
    question: "How do you pass data between states in Step Functions?",
    answer:
      "Each state receives its input as JSON and produces output JSON. InputPath selects a subset of the input to pass to the task. ResultPath controls where the task result is inserted in the state output (or discards it with null). OutputPath selects which part of the combined state to pass downstream. Parameters lets you construct a new JSON object to send to the task.",
    keyPoints: [
      "InputPath/OutputPath: filter input and output with JsonPath",
      "ResultPath: inject task result into state output",
      "Parameters: construct task input from selected fields",
    ],
    difficulty: "hard",
    tags: ["step-functions", "data-flow", "json"],
  },

  // ── AWS Secrets Manager ──
  {
    id: "saa-secrets-1",
    service: "AWS Secrets Manager",
    domain: "security",
    question:
      "What is AWS Secrets Manager and how does it differ from Parameter Store?",
    answer:
      "Secrets Manager stores, retrieves, and automatically rotates credentials such as database passwords, API keys, and OAuth tokens. It has built-in rotation integrations for RDS, Redshift, and DocumentDB. Parameter Store can store secrets but lacks native rotation and costs less for non-secret configuration. Secrets Manager is the right choice when automatic rotation is required.",
    keyPoints: [
      "Secrets Manager: built-in rotation, higher cost",
      "Parameter Store: cheaper, no native rotation",
      "Both integrate with KMS for encryption",
    ],
    difficulty: "easy",
    tags: ["secrets-manager", "security", "credentials"],
  },
  {
    id: "saa-secrets-2",
    service: "AWS Secrets Manager",
    domain: "security",
    question: "How does Secrets Manager automatic rotation work?",
    answer:
      "Rotation is triggered on a schedule or on demand. Secrets Manager invokes a Lambda rotation function that follows a four-step process: createSecret (create new version), setSecret (update the actual service like RDS), testSecret (validate the new credentials work), finishSecret (mark new version as current). During rotation both old and new credentials are valid to allow in-flight connections to complete.",
    keyPoints: [
      "Lambda function performs rotation in 4 steps",
      "AWSPENDING and AWSCURRENT labels during transition",
      "Both versions valid during rotation window",
    ],
    difficulty: "hard",
    tags: ["secrets-manager", "rotation", "security"],
  },
  {
    id: "saa-secrets-3",
    service: "AWS Secrets Manager",
    domain: "security",
    question: "How do you access a secret from an application securely?",
    answer:
      "Call the GetSecretValue API using the SDK with the secret name or ARN. Grant the application's IAM role secretsmanager:GetSecretValue permission scoped to that secret's ARN. Cache the secret value in memory and set a refresh TTL rather than calling the API on every request. Use the Secrets Manager Agent or SDK caching layer to reduce API calls and stay within rate limits.",
    keyPoints: [
      "IAM role must have GetSecretValue on secret ARN",
      "Cache locally to reduce API calls",
      "SDK caching layer available in Java, Python, .NET",
    ],
    difficulty: "medium",
    tags: ["secrets-manager", "iam", "application"],
  },
  {
    id: "saa-secrets-4",
    service: "AWS Secrets Manager",
    domain: "security",
    question:
      "What is resource-based policy in Secrets Manager and when do you use it?",
    answer:
      "A resource-based policy attached directly to the secret controls which principals (accounts, roles, services) can access it. This is used for cross-account access—allowing a Lambda in account B to retrieve a secret owned in account A without complex IAM role chaining. Resource policies are evaluated alongside the caller's identity-based policies.",
    keyPoints: [
      "Attached to the secret itself, not the caller",
      "Enables cross-account secret access",
      "Evaluated with identity policy (both must allow)",
    ],
    difficulty: "hard",
    tags: ["secrets-manager", "resource-policy", "cross-account"],
  },
  {
    id: "saa-secrets-5",
    service: "AWS Secrets Manager",
    domain: "security",
    question: "How does Secrets Manager integrate with RDS?",
    answer:
      "When you create an RDS database you can have Secrets Manager automatically create a secret for the master credentials. Secrets Manager uses a managed rotation Lambda that calls the RDS API to rotate the password on schedule. Applications retrieve the current password via GetSecretValue rather than storing it in config files, ensuring credentials are never hardcoded.",
    keyPoints: [
      "RDS can auto-create a secret at database creation",
      "Managed Lambda rotates password in RDS and Secrets Manager together",
      "Eliminates hardcoded credentials in app config",
    ],
    difficulty: "medium",
    tags: ["secrets-manager", "rds", "rotation"],
  },
  {
    id: "saa-secrets-6",
    service: "AWS Secrets Manager",
    domain: "security",
    question: "How do you replicate a secret across AWS regions?",
    answer:
      "Secrets Manager supports multi-region replication—you designate replica regions and Secrets Manager automatically copies and keeps secrets in sync. Each replica uses a regional KMS key for encryption. This is used for multi-region active-active or DR architectures so applications in each region read their local secret copy without cross-region API calls.",
    keyPoints: [
      "Designate replica regions in the secret settings",
      "Each replica encrypted with that region's KMS key",
      "Used for multi-region DR and latency reduction",
    ],
    difficulty: "medium",
    tags: ["secrets-manager", "replication", "disaster-recovery"],
  },
  {
    id: "saa-secrets-7",
    service: "AWS Secrets Manager",
    domain: "security",
    question: "What happens to a secret when you delete it in Secrets Manager?",
    answer:
      "Secrets Manager enforces a recovery window (7–30 days, default 30) during which the secret is scheduled for deletion but can be restored. You cannot immediately delete a secret unless you set the recovery window to 0 using --force-delete-without-recovery. During the recovery window, retrieval of the secret fails with a ResourceNotFoundException.",
    keyPoints: [
      "Recovery window: 7–30 days before permanent deletion",
      "Use --force-delete-without-recovery for immediate deletion",
      "Secret unretrievable during recovery window",
    ],
    difficulty: "medium",
    tags: ["secrets-manager", "deletion", "recovery"],
  },

  // ── AWS Transit Gateway ──
  {
    id: "saa-tgw-1",
    service: "AWS Transit Gateway",
    domain: "networking",
    question:
      "What problem does AWS Transit Gateway solve compared to VPC Peering?",
    answer:
      "VPC Peering requires a peering connection between every pair of VPCs (N*(N-1)/2 connections for N VPCs), which becomes unmanageable at scale and does not support transitive routing. Transit Gateway is a regional hub that any VPC or on-premises network attaches to, providing full transitive routing through a single managed service—N connections total instead of N².",
    keyPoints: [
      "Hub-and-spoke: N attachments vs. N² peering connections",
      "Supports transitive routing (VPC Peering does not)",
      "Scales to thousands of VPCs and VPN connections",
    ],
    difficulty: "medium",
    tags: ["transit-gateway", "networking", "vpc"],
  },
  {
    id: "saa-tgw-2",
    service: "AWS Transit Gateway",
    domain: "networking",
    question: "What types of attachments can Transit Gateway have?",
    answer:
      "Transit Gateway supports VPC attachments (one subnet per AZ), VPN attachments (connects to on-premises via IPsec), Direct Connect Gateway attachments (for private connectivity), Transit Gateway peering attachments (connects two TGWs across regions), and AWS Verified Access attachments. Each attachment type appears as a resource on the TGW routing table.",
    keyPoints: [
      "VPC, VPN, Direct Connect Gateway, TGW Peering",
      "VPC attachment: one subnet per AZ recommended",
      "TGW Peering enables cross-region transitive routing",
    ],
    difficulty: "medium",
    tags: ["transit-gateway", "attachments", "networking"],
  },
  {
    id: "saa-tgw-3",
    service: "AWS Transit Gateway",
    domain: "networking",
    question:
      "What is a Transit Gateway route table and how do you use multiple route tables?",
    answer:
      "A TGW route table contains static or dynamic routes mapping prefixes to attachments. By default all attachments share one route table. You can create multiple route tables to implement network segmentation—for example a 'Production' table that only routes between prod VPCs and a 'Shared Services' table that allows access from any VPC to a shared services VPC, without prod-to-dev routing.",
    keyPoints: [
      "Multiple route tables enable traffic segmentation",
      "Attachments associated with one table, propagate to others",
      "Enables hub-and-spoke with isolation between spokes",
    ],
    difficulty: "hard",
    tags: ["transit-gateway", "route-tables", "networking"],
  },
  {
    id: "saa-tgw-4",
    service: "AWS Transit Gateway",
    domain: "networking",
    question:
      "How does Transit Gateway integrate with AWS RAM for multi-account networking?",
    answer:
      "Transit Gateway can be shared across AWS accounts using AWS Resource Access Manager (RAM). The TGW owner shares it with member accounts or an AWS Organization. Member accounts can then create VPC attachments to the shared TGW, enabling centralized network management without deploying a TGW in each account.",
    keyPoints: [
      "Share TGW via RAM to other accounts or Organization",
      "Member accounts attach their VPCs to the shared TGW",
      "Centralized network team manages routing",
    ],
    difficulty: "hard",
    tags: ["transit-gateway", "ram", "multi-account"],
  },
  {
    id: "saa-tgw-5",
    service: "AWS Transit Gateway",
    domain: "networking",
    question: "What is Transit Gateway Network Manager?",
    answer:
      "Network Manager is a centralized console for monitoring and managing your global network built on Transit Gateways. It provides a visual topology map of all TGWs, VPCs, VPN connections, and on-premises links. It integrates with CloudWatch for metrics and can register third-party SD-WAN devices as on-premises network links in the topology.",
    keyPoints: [
      "Centralized topology map for global TGW network",
      "Integrates with CloudWatch Events and metrics",
      "Supports SD-WAN device registration",
    ],
    difficulty: "medium",
    tags: ["transit-gateway", "network-manager", "monitoring"],
  },
  {
    id: "saa-tgw-6",
    service: "AWS Transit Gateway",
    domain: "networking",
    question: "What is Transit Gateway Connect and when do you use it?",
    answer:
      "TGW Connect creates a high-throughput GRE tunnel attachment between the TGW and a network appliance (like a virtual router or SD-WAN device) running in a VPC. It uses BGP over GRE for dynamic routing and supports up to 5 Gbps per Connect attachment (vs. 1.25 Gbps for VPN). Use it when you need higher bandwidth than IPsec VPN provides for appliance-based connectivity.",
    keyPoints: [
      "GRE tunnel + BGP for dynamic routing",
      "Up to 5 Gbps vs. 1.25 Gbps for VPN",
      "Used for virtual routers and SD-WAN appliances in VPC",
    ],
    difficulty: "hard",
    tags: ["transit-gateway", "connect", "networking"],
  },
  {
    id: "saa-tgw-7",
    service: "AWS Transit Gateway",
    domain: "networking",
    question: "How does Transit Gateway support multicast?",
    answer:
      "Transit Gateway Multicast distributes a single data stream to multiple VPC subnet destinations without replication at the source. You create a multicast domain, associate subnets, and register multicast group members (EC2 instances). TGW handles packet replication across subnets. This is used for live media distribution, financial market data feeds, and other one-to-many workloads.",
    keyPoints: [
      "One-to-many packet distribution without source replication",
      "Multicast domain with associated subnets and members",
      "Use case: media streaming, financial feeds",
    ],
    difficulty: "hard",
    tags: ["transit-gateway", "multicast", "networking"],
  },

  // ── AWS Organizations ──
  {
    id: "saa-org-1",
    service: "AWS Organizations",
    domain: "governance",
    question:
      "What is AWS Organizations and what are its two main feature sets?",
    answer:
      "AWS Organizations lets you centrally manage multiple AWS accounts under a single management account. Consolidated Billing pools usage across all accounts so that combined usage qualifies for volume discounts and Reserved Instance sharing. All Features mode adds Service Control Policies (SCPs), tag policies, and AWS service integration for central governance.",
    keyPoints: [
      "Consolidated Billing: volume discounts, RI sharing",
      "All Features: SCPs, tag policies, governance",
      "Management account is root and cannot be restricted by SCPs",
    ],
    difficulty: "easy",
    tags: ["organizations", "multi-account", "governance"],
  },
  {
    id: "saa-org-2",
    service: "AWS Organizations",
    domain: "governance",
    question:
      "What are Service Control Policies (SCPs) and what do they control?",
    answer:
      "SCPs are JSON policies attached to Organization Units (OUs) or individual accounts that set the maximum permissions available to IAM principals in those accounts. SCPs never grant permissions—they only restrict what is otherwise allowed by IAM policies. Even the account's root user is subject to SCPs. An explicit Deny in an SCP overrides any IAM Allow.",
    keyPoints: [
      "SCPs are permission boundaries, not grants",
      "Apply to all principals including root user",
      "Explicit SCP Deny overrides any IAM Allow",
    ],
    difficulty: "medium",
    tags: ["organizations", "scp", "governance"],
  },
  {
    id: "saa-org-3",
    service: "AWS Organizations",
    domain: "governance",
    question:
      "What is an Organizational Unit (OU) and how do you structure them?",
    answer:
      "An OU is a container within an Organization that groups accounts and can have SCPs attached. OUs nest inside other OUs creating a hierarchy under the Root. A common structure is: Root → Security OU (audit, log-archive) → Infrastructure OU (network, shared services) → Workload OUs (prod, dev per business unit). SCPs inherit down the hierarchy.",
    keyPoints: [
      "OUs nest to create hierarchy under Root",
      "SCPs applied to OU affect all child OUs and accounts",
      "Common structure: Foundational + Workload OUs",
    ],
    difficulty: "medium",
    tags: ["organizations", "ou", "governance"],
  },
  {
    id: "saa-org-4",
    service: "AWS Organizations",
    domain: "governance",
    question:
      "How does Reserved Instance and Savings Plan sharing work in Organizations?",
    answer:
      "By default, Reserved Instances and Savings Plans purchased in any account are shared across the entire Organization for billing credit purposes. Any account that runs a matching workload benefits from the discounted rate even if they didn't purchase the reservation. The sharing can be disabled per OU or account through RI sharing settings in the management account.",
    keyPoints: [
      "RI/SP credits shared across all linked accounts by default",
      "Reduces effective cost without centralizing compute",
      "Sharing can be disabled at OU or account level",
    ],
    difficulty: "medium",
    tags: ["organizations", "reserved-instances", "billing"],
  },
  {
    id: "saa-org-5",
    service: "AWS Organizations",
    domain: "governance",
    question:
      "What is AWS Control Tower and how does it relate to Organizations?",
    answer:
      "Control Tower is a managed service that builds a well-architected multi-account environment (Landing Zone) on top of Organizations. It provisions OUs, creates baseline accounts (Log Archive, Audit), applies guardrails (SCPs + Config rules), and provides a self-service Account Factory. Control Tower automates what you would otherwise configure manually in Organizations.",
    keyPoints: [
      "Control Tower = automated Landing Zone on Organizations",
      "Creates Log Archive and Audit accounts",
      "Guardrails are SCPs + AWS Config rules",
    ],
    difficulty: "medium",
    tags: ["organizations", "control-tower", "landing-zone"],
  },
  {
    id: "saa-org-6",
    service: "AWS Organizations",
    domain: "governance",
    question:
      "What is the difference between an SCP Deny List and an SCP Allow List strategy?",
    answer:
      "Deny List strategy attaches the AWS-managed FullAWSAccess SCP to all OUs (allowing everything) and then adds specific Deny statements to block unwanted actions—simpler to start but grows complex over time. Allow List strategy removes FullAWSAccess and grants only explicitly listed services in SCPs—stricter, blocks access to any service not listed, better for high-compliance environments.",
    keyPoints: [
      "Deny List: FullAWSAccess + targeted Denies",
      "Allow List: no default, only explicitly listed services",
      "Allow List is stricter and preferred for regulated industries",
    ],
    difficulty: "hard",
    tags: ["organizations", "scp", "security"],
  },
  {
    id: "saa-org-7",
    service: "AWS Organizations",
    domain: "governance",
    question: "How do you use delegated administrator in Organizations?",
    answer:
      "A delegated administrator is a member account that has been granted administrative permissions for a specific AWS service on behalf of the Organization (e.g., GuardDuty, Security Hub, AWS Config). This lets the security team operate from a dedicated Audit account without using the management account directly, following the principle of least privilege for the management account.",
    keyPoints: [
      "Member account manages a service for the whole Org",
      "Reduces use of management account for day-to-day work",
      "Supported by GuardDuty, SecurityHub, Config, Firewall Manager, etc.",
    ],
    difficulty: "hard",
    tags: ["organizations", "delegated-admin", "governance"],
  },

  // ── AWS Glue ──
  {
    id: "saa-glue-1",
    service: "AWS Glue",
    domain: "analytics",
    question: "What is AWS Glue and what are its main components?",
    answer:
      "AWS Glue is a serverless ETL (Extract, Transform, Load) service. Its main components are: the Data Catalog (a central metadata repository for all data sources), Crawlers (automatically scan data sources and populate the Data Catalog), and ETL Jobs (Apache Spark-based scripts that transform and move data). Glue Studio provides a visual job authoring interface.",
    keyPoints: [
      "Data Catalog: metadata store used by Athena, EMR, Redshift Spectrum",
      "Crawlers: infer schema from S3, RDS, DynamoDB, etc.",
      "ETL Jobs: serverless Spark, Python Shell, or Ray",
    ],
    difficulty: "easy",
    tags: ["glue", "etl", "analytics"],
  },
  {
    id: "saa-glue-2",
    service: "AWS Glue",
    domain: "analytics",
    question: "What is the AWS Glue Data Catalog and who uses it?",
    answer:
      "The Glue Data Catalog is a persistent metadata store that holds table definitions, schemas, and location information for data across AWS services. Amazon Athena, Redshift Spectrum, and EMR all use the Glue Data Catalog as their metastore, allowing a single schema definition to be shared across all three query engines without duplication.",
    keyPoints: [
      "Single metadata store used by Athena, Redshift Spectrum, EMR",
      "Stores table location, schema, partition info",
      "Crawlers auto-populate by scanning data sources",
    ],
    difficulty: "medium",
    tags: ["glue", "data-catalog", "analytics"],
  },
  {
    id: "saa-glue-3",
    service: "AWS Glue",
    domain: "analytics",
    question: "What is a Glue Crawler and what triggers it?",
    answer:
      "A Glue Crawler connects to a data store (S3, RDS, DynamoDB, JDBC source), traverses the data, infers its schema, and creates or updates table definitions in the Data Catalog. Crawlers can be scheduled (cron-based), triggered on demand, or triggered by EventBridge events. When new partitions are added to S3, running the crawler updates partition metadata so Athena can query the new data.",
    keyPoints: [
      "Connects to S3, RDS, DynamoDB, JDBC sources",
      "Creates/updates table and partition metadata",
      "Schedule, on-demand, or event-driven trigger",
    ],
    difficulty: "medium",
    tags: ["glue", "crawler", "data-catalog"],
  },
  {
    id: "saa-glue-4",
    service: "AWS Glue",
    domain: "analytics",
    question: "What is Glue job bookmarking and why is it important?",
    answer:
      "Job bookmarking tracks which S3 objects or database rows a Glue ETL job has already processed. On subsequent runs only new or changed data is processed, preventing duplicate records. Without bookmarking, a job would reprocess all source data every run. Bookmarking is important for incremental ETL pipelines that run on a schedule.",
    keyPoints: [
      "Tracks already-processed data to avoid duplicates",
      "Enables incremental ETL on scheduled runs",
      "Enable per Glue job via job bookmark option",
    ],
    difficulty: "medium",
    tags: ["glue", "bookmarking", "etl"],
  },
  {
    id: "saa-glue-5",
    service: "AWS Glue",
    domain: "analytics",
    question:
      "What is Glue DataBrew and how does it differ from Glue ETL jobs?",
    answer:
      "Glue DataBrew is a visual data preparation tool that lets analysts clean and normalize data using 250+ built-in transformations without writing code. Glue ETL jobs use Apache Spark scripts for complex, large-scale transformations requiring custom code. DataBrew is designed for data analysts; ETL jobs are designed for data engineers.",
    keyPoints: [
      "DataBrew: no-code, 250+ transformations, for analysts",
      "ETL Jobs: Spark scripts, for engineers",
      "Both output transformed data to S3 or data stores",
    ],
    difficulty: "medium",
    tags: ["glue", "databrew", "analytics"],
  },
  {
    id: "saa-glue-6",
    service: "AWS Glue",
    domain: "analytics",
    question: "What is AWS Glue Elastic Views?",
    answer:
      "Glue Elastic Views (now part of AWS broader data integration strategy) allows you to create virtual tables that combine and replicate data across multiple data stores using SQL. It continuously replicates source data and keeps materialized views up to date without ETL jobs. This simplifies building unified data products from DynamoDB, Aurora, S3, and other sources.",
    keyPoints: [
      "SQL-based virtual views across multiple data stores",
      "Continuous replication keeps views current",
      "No ETL jobs needed for cross-store joins",
    ],
    difficulty: "hard",
    tags: ["glue", "elastic-views", "analytics"],
  },
  {
    id: "saa-glue-7",
    service: "AWS Glue",
    domain: "analytics",
    question: "How does Glue handle data partitioning in S3 for performance?",
    answer:
      "Glue ETL jobs write output to S3 in a Hive-compatible partition structure (e.g., year=2024/month=01/day=15/). When Athena queries this data it can use partition pruning to skip irrelevant partitions, drastically reducing data scanned and query cost. Crawlers detect these partitions and register them in the Data Catalog automatically.",
    keyPoints: [
      "Hive-style partitions: s3://bucket/year=2024/month=01/",
      "Athena uses partition pruning to scan only relevant data",
      "Crawlers register new partitions in Data Catalog",
    ],
    difficulty: "medium",
    tags: ["glue", "partitioning", "s3"],
  },

  // ── Amazon Athena ──
  {
    id: "saa-athena-1",
    service: "Amazon Athena",
    domain: "analytics",
    question: "What is Amazon Athena and how does it differ from Redshift?",
    answer:
      "Athena is a serverless, interactive query service that runs standard SQL queries directly against data in S3 using the Presto engine. There are no clusters to manage—you pay per TB scanned. Redshift is a provisioned or serverless data warehouse that stores data in its own managed storage. Athena is better for ad-hoc queries on S3 data; Redshift is better for complex, repeated analytics with large datasets that benefit from compression and sort keys.",
    keyPoints: [
      "Athena: serverless, query S3 directly, pay per TB scanned",
      "Redshift: managed warehouse, better for consistent heavy workloads",
      "Athena uses Glue Data Catalog for table metadata",
    ],
    difficulty: "easy",
    tags: ["athena", "analytics", "s3"],
  },
  {
    id: "saa-athena-2",
    service: "Amazon Athena",
    domain: "analytics",
    question: "How do you reduce Athena query cost and improve performance?",
    answer:
      "Convert data to columnar formats (Parquet or ORC) to reduce bytes scanned—Athena reads only the columns needed. Partition the data in S3 with Hive-style paths so partition filters prune irrelevant files. Compress data with Snappy or GZIP. Use Athena workgroups to set per-query data scan limits. These changes can reduce cost by 80–95% compared to scanning raw CSV.",
    keyPoints: [
      "Columnar format (Parquet/ORC): scan only needed columns",
      "Partitioning: skip irrelevant S3 prefixes",
      "Compression: fewer bytes = lower cost",
    ],
    difficulty: "medium",
    tags: ["athena", "performance", "cost"],
  },
  {
    id: "saa-athena-3",
    service: "Amazon Athena",
    domain: "analytics",
    question: "What is an Athena workgroup and what can you control with it?",
    answer:
      "A workgroup is a logical unit that groups users or teams and controls their query settings. Per workgroup you can set a maximum data scanned per query (kill query if exceeded), specify a dedicated S3 output location, enforce encryption of query results, and track cost and usage metrics separately. This enables cost allocation and prevents runaway expensive queries.",
    keyPoints: [
      "Per-query data scan limit prevents costly queries",
      "Dedicated output location per team",
      "Enables cost allocation by workgroup",
    ],
    difficulty: "medium",
    tags: ["athena", "workgroup", "governance"],
  },
  {
    id: "saa-athena-4",
    service: "Amazon Athena",
    domain: "analytics",
    question: "How does Athena Federated Query work?",
    answer:
      "Athena Federated Query uses Lambda-based data source connectors to query data stores beyond S3—including DynamoDB, RDS, ElastiCache, CloudWatch Logs, and custom JDBC sources. You register a data source connector Lambda in Athena and then write SQL that joins S3 data with live database tables in a single query. Results can be stored back to S3.",
    keyPoints: [
      "Lambda connectors extend Athena to non-S3 sources",
      "Query DynamoDB, RDS, ElastiCache, CloudWatch from SQL",
      "Join across sources in a single Athena query",
    ],
    difficulty: "hard",
    tags: ["athena", "federated-query", "analytics"],
  },
  {
    id: "saa-athena-5",
    service: "Amazon Athena",
    domain: "analytics",
    question: "How does Athena handle query result caching?",
    answer:
      "Athena stores query results in S3 for 45 days by default. If you rerun an identical query within that window, Athena can reuse the cached result without re-scanning data—returning results instantly at no data-scan cost. You can set the reuse-results age to any value up to 7 days in the query settings. This is useful for dashboards that repeatedly run the same summary queries.",
    keyPoints: [
      "Results cached in S3 for up to 45 days",
      "Reuse window configurable up to 7 days",
      "No data-scan charge for cache hits",
    ],
    difficulty: "medium",
    tags: ["athena", "caching", "analytics"],
  },
  {
    id: "saa-athena-6",
    service: "Amazon Athena",
    domain: "analytics",
    question: "What is Athena for Apache Spark and when would you use it?",
    answer:
      "Athena for Apache Spark lets you run serverless Spark workloads interactively in notebooks without managing EMR clusters. Use it for complex data transformations that SQL cannot express, machine learning preprocessing, or iterative data exploration requiring Python libraries. For pure SQL queries against S3 data, standard Athena SQL is simpler; use Spark when you need the full Spark API.",
    keyPoints: [
      "Serverless Spark in Athena notebooks",
      "No EMR cluster management",
      "Use for ML preprocessing or complex Python transformations",
    ],
    difficulty: "hard",
    tags: ["athena", "spark", "analytics"],
  },
  {
    id: "saa-athena-7",
    service: "Amazon Athena",
    domain: "analytics",
    question: "How do you control access to Athena and the data it queries?",
    answer:
      "Athena access is controlled via IAM policies for API actions (StartQueryExecution, GetQueryResults). The underlying S3 data and Glue Data Catalog tables need separate permissions—Athena uses the caller's IAM identity to access both. Lake Formation can be added for column-level and row-level security on the Data Catalog, restricting what data specific users can query.",
    keyPoints: [
      "IAM for Athena API + S3 bucket + Glue Data Catalog",
      "Lake Formation: column-level and row-level security",
      "Workgroup encryption enforces result encryption",
    ],
    difficulty: "hard",
    tags: ["athena", "iam", "security"],
  },
];
