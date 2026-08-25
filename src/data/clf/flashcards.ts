import { FlashCard } from "../../types";

export const flashcards: FlashCard[] = [
  // ── Amazon EC2 ──────────────────────────────────────────────────────────────
  {
    id: "clf-ec2-1",
    service: "Amazon EC2",
    domain: "deployment",
    question: "What does EC2 stand for and what does it provide?",
    answer:
      "Elastic Compute Cloud — it provides resizable virtual machines (instances) in the AWS cloud, letting you run applications without purchasing physical hardware.",
    keyPoints: [
      "Virtual machines called instances",
      "Pay per second/hour of use",
      "Choose OS, memory, CPU, storage",
    ],
    difficulty: "easy",
    tags: ["ec2", "compute", "virtual machines"],
  },
  {
    id: "clf-ec2-2",
    service: "Amazon EC2",
    domain: "deployment",
    question:
      "What is the difference between On-Demand, Reserved, and Spot Instance pricing?",
    answer:
      "On-Demand: pay per second, no commitment, most flexible. Reserved: 1–3 year commitment, up to 72% discount. Spot: bid for spare capacity, up to 90% discount but can be interrupted with 2-minute warning.",
    keyPoints: [
      "On-Demand = flexible, highest cost",
      "Reserved = committed, 72% savings",
      "Spot = interruptible, 90% savings",
    ],
    difficulty: "medium",
    tags: ["ec2", "pricing", "cost optimization"],
  },
  {
    id: "clf-ec2-3",
    service: "Amazon EC2",
    domain: "deployment",
    question: "What is the difference between EBS and instance store storage?",
    answer:
      "EBS (Elastic Block Store) is persistent network-attached storage that survives instance stops and terminations. Instance store is physically attached to the host and is ephemeral — data is lost when the instance stops or terminates.",
    keyPoints: [
      "EBS = persistent, survives stop/terminate",
      "Instance store = ephemeral, lost on stop/terminate",
      "Use instance store for temp data only",
    ],
    difficulty: "medium",
    tags: ["ec2", "storage", "ebs"],
  },
  {
    id: "clf-ec2-4",
    service: "Amazon EC2",
    domain: "deployment",
    question: "What is an EC2 Security Group?",
    answer:
      "A virtual firewall at the instance level that controls inbound and outbound traffic by port, protocol, and source IP. Security groups are stateful — return traffic is automatically allowed.",
    keyPoints: [
      "Instance-level firewall",
      "Stateful (return traffic automatic)",
      "Only allow rules — no explicit deny",
    ],
    difficulty: "easy",
    tags: ["ec2", "security", "networking"],
  },
  {
    id: "clf-ec2-5",
    service: "Amazon EC2",
    domain: "deployment",
    question: "What is an Auto Scaling Group and why is it used?",
    answer:
      "An Auto Scaling Group automatically adds or removes EC2 instances based on demand or health checks, maintaining a desired number of healthy instances. It provides scalability and high availability.",
    keyPoints: [
      "Auto adds/removes instances based on demand",
      "Defines min, desired, max instance count",
      "Replaces unhealthy instances automatically",
    ],
    difficulty: "medium",
    tags: ["ec2", "auto scaling", "high availability"],
  },
  {
    id: "clf-ec2-6",
    service: "Amazon EC2",
    domain: "deployment",
    question: "What are Dedicated Hosts in EC2 and when are they used?",
    answer:
      "Dedicated Hosts are physical servers exclusively allocated to your account. They are used for software licenses tied to physical cores/sockets (like Oracle DB) or compliance requirements that prohibit multi-tenant hardware.",
    keyPoints: [
      "Entire physical server for your use only",
      "Required for physical-core licensing (Oracle, Windows Server)",
      "Supports compliance requirements",
    ],
    difficulty: "hard",
    tags: ["ec2", "dedicated hosts", "licensing"],
  },
  {
    id: "clf-ec2-7",
    service: "Amazon EC2",
    domain: "deployment",
    question: "What is an IAM Instance Profile and why should you use one?",
    answer:
      "An IAM Instance Profile attaches an IAM role to an EC2 instance, allowing the instance to call AWS services (S3, DynamoDB, etc.) without embedding access keys in code. It provides temporary, automatically rotated credentials.",
    keyPoints: [
      "Attaches IAM role to EC2 instance",
      "No access keys in code — use roles instead",
      "Credentials are temporary and auto-rotated",
    ],
    difficulty: "medium",
    tags: ["ec2", "iam", "security"],
  },

  // ── Amazon S3 ───────────────────────────────────────────────────────────────
  {
    id: "clf-s3-1",
    service: "Amazon S3",
    domain: "development",
    question: "What type of storage is Amazon S3 and what is its durability?",
    answer:
      "S3 is object storage — it stores files (objects) in buckets. It provides 99.999999999% (11 nines) durability by replicating data across at least three Availability Zones automatically.",
    keyPoints: [
      "Object storage (not block or file system)",
      "11 nines durability (99.999999999%)",
      "Auto-replicates across 3+ AZs",
    ],
    difficulty: "easy",
    tags: ["s3", "storage", "durability"],
  },
  {
    id: "clf-s3-2",
    service: "Amazon S3",
    domain: "development",
    question: "What are the main S3 storage classes and when do you use each?",
    answer:
      "Standard: frequent access, highest cost. Standard-IA: infrequent access, retrieval fee. One Zone-IA: single AZ, cheaper, less resilient. Glacier tiers: archival, hours to retrieve. Intelligent-Tiering: unknown/variable access, auto-moves between tiers.",
    keyPoints: [
      "Standard = frequent access, default",
      "IA classes = cheaper storage but retrieval fees",
      "Glacier = lowest cost, archival, long retrieval",
    ],
    difficulty: "medium",
    tags: ["s3", "storage classes", "cost optimization"],
  },
  {
    id: "clf-s3-3",
    service: "Amazon S3",
    domain: "development",
    question: "What is S3 Versioning and what problem does it solve?",
    answer:
      "Versioning preserves every version of every object in a bucket. When enabled, deleting an object places a delete marker instead of removing the data. It protects against accidental deletion and allows restoring previous versions.",
    keyPoints: [
      "Keeps all versions of every object",
      "Delete marker instead of permanent deletion",
      "Enables restoration of previous versions",
    ],
    difficulty: "medium",
    tags: ["s3", "versioning", "data protection"],
  },
  {
    id: "clf-s3-4",
    service: "Amazon S3",
    domain: "development",
    question: "What is S3 Block Public Access and why is it important?",
    answer:
      "Block Public Access is a safety feature (enabled by default on new buckets) that prevents accidental public exposure of objects regardless of bucket policies or ACLs. It overrides any public-granting policies applied to the bucket.",
    keyPoints: [
      "Enabled by default on new buckets",
      "Prevents accidental public data exposure",
      "Overrides bucket policies and ACLs",
    ],
    difficulty: "easy",
    tags: ["s3", "security", "access control"],
  },
  {
    id: "clf-s3-5",
    service: "Amazon S3",
    domain: "development",
    question: "What is an S3 Lifecycle Policy?",
    answer:
      "A Lifecycle Policy automatically transitions objects between storage classes or expires (deletes) them after a defined period. For example, move to Standard-IA after 30 days, to Glacier after 90 days, and delete after 365 days.",
    keyPoints: [
      "Automates storage class transitions",
      "Reduces cost by moving old data to cheaper classes",
      "Can also expire (delete) objects automatically",
    ],
    difficulty: "medium",
    tags: ["s3", "lifecycle", "cost optimization"],
  },
  {
    id: "clf-s3-6",
    service: "Amazon S3",
    domain: "development",
    question: "What is a Pre-Signed URL in S3?",
    answer:
      "A Pre-Signed URL grants time-limited access to a private S3 object without making it publicly accessible. Generated by the object owner, it includes authentication credentials that expire after a set time (e.g., 1 hour).",
    keyPoints: [
      "Time-limited access to private objects",
      "No need to make bucket or object public",
      "URL expires after configured duration",
    ],
    difficulty: "medium",
    tags: ["s3", "security", "access control"],
  },
  {
    id: "clf-s3-7",
    service: "Amazon S3",
    domain: "development",
    question: "Can Amazon S3 host a static website? What is needed?",
    answer:
      "Yes. Enable the static website hosting feature on the bucket, specify an index document (e.g., index.html), and configure public access or a bucket policy. The bucket gets a website endpoint URL. Use CloudFront in front for HTTPS and global performance.",
    keyPoints: [
      "Enable static website hosting on bucket",
      "Specify index document",
      "Add CloudFront for HTTPS and CDN performance",
    ],
    difficulty: "easy",
    tags: ["s3", "static website", "cloudfront"],
  },

  // ── Amazon VPC ──────────────────────────────────────────────────────────────
  {
    id: "clf-vpc-1",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What is an Amazon VPC?",
    answer:
      "A Virtual Private Cloud is a logically isolated virtual network in AWS where you launch resources. You control the IP address range, subnets, routing, and security — it resembles a traditional data center network hosted in the cloud.",
    keyPoints: [
      "Logically isolated virtual network in AWS",
      "You define IP ranges, subnets, routing",
      "Region-scoped — spans all AZs in a region",
    ],
    difficulty: "easy",
    tags: ["vpc", "networking"],
  },
  {
    id: "clf-vpc-2",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What makes a subnet 'public' vs. 'private'?",
    answer:
      "A public subnet has a route in its route table pointing to an Internet Gateway (IGW), allowing direct internet communication. A private subnet has no IGW route — resources in private subnets cannot directly reach or be reached from the internet.",
    keyPoints: [
      "Public subnet = route to Internet Gateway",
      "Private subnet = no direct internet route",
      "Internet Gateway enables internet connectivity",
    ],
    difficulty: "medium",
    tags: ["vpc", "subnets", "networking"],
  },
  {
    id: "clf-vpc-3",
    service: "Amazon VPC",
    domain: "deployment",
    question:
      "What is the difference between a Security Group and a Network ACL?",
    answer:
      "Security Groups are stateful, instance-level firewalls with only allow rules. NACLs are stateless, subnet-level firewalls with both allow and deny rules. Stateful means return traffic is automatically allowed; stateless means you must explicitly allow both directions.",
    keyPoints: [
      "SG: stateful, instance-level, allow only",
      "NACL: stateless, subnet-level, allow + deny",
      "Stateful = return traffic automatic; stateless = explicit both ways",
    ],
    difficulty: "medium",
    tags: ["vpc", "security groups", "nacl", "networking"],
  },
  {
    id: "clf-vpc-4",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What is a NAT Gateway and when do you need one?",
    answer:
      "A NAT Gateway allows EC2 instances in private subnets to make outbound internet connections (e.g., for updates or API calls) while remaining unreachable from the internet. It lives in a public subnet and translates private IPs to its own public Elastic IP.",
    keyPoints: [
      "Placed in a public subnet",
      "Enables outbound internet for private instances",
      "Private instances remain unreachable from internet",
    ],
    difficulty: "medium",
    tags: ["vpc", "nat gateway", "networking"],
  },
  {
    id: "clf-vpc-5",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What is VPC Peering and what is its key limitation?",
    answer:
      "VPC Peering creates a direct, private network connection between two VPCs. The key limitation is that it is NOT transitive — if A peers with B and B peers with C, A cannot reach C through B. You would need Transit Gateway for mesh connectivity.",
    keyPoints: [
      "Direct private connection between two VPCs",
      "Not transitive — A→B→C does not give A access to C",
      "Use Transit Gateway for hub-and-spoke connectivity",
    ],
    difficulty: "hard",
    tags: ["vpc", "peering", "networking"],
  },
  {
    id: "clf-vpc-6",
    service: "Amazon VPC",
    domain: "deployment",
    question:
      "What is the difference between Site-to-Site VPN and AWS Direct Connect?",
    answer:
      "Site-to-Site VPN creates an encrypted tunnel over the public internet — quick to set up, lower cost. Direct Connect is a dedicated private physical connection bypassing the internet — consistent bandwidth, lower latency, but slower to provision and more expensive.",
    keyPoints: [
      "VPN = encrypted, over internet, quick setup",
      "Direct Connect = dedicated private line, more consistent",
      "Direct Connect for high-volume, latency-sensitive workloads",
    ],
    difficulty: "medium",
    tags: ["vpc", "direct connect", "vpn"],
  },
  {
    id: "clf-vpc-7",
    service: "Amazon VPC",
    domain: "deployment",
    question: "What is a VPC Endpoint and why would you use one?",
    answer:
      "A VPC Endpoint allows resources inside a VPC to communicate with AWS services (like S3 or DynamoDB) privately without going through the internet or NAT Gateway. Gateway endpoints (S3, DynamoDB) are free; Interface endpoints use AWS PrivateLink.",
    keyPoints: [
      "Private access to AWS services without internet",
      "Gateway endpoints (S3, DynamoDB) = free",
      "Reduces NAT Gateway data processing charges",
    ],
    difficulty: "hard",
    tags: ["vpc", "endpoints", "privatelink"],
  },

  // ── Amazon RDS ──────────────────────────────────────────────────────────────
  {
    id: "clf-rds-1",
    service: "Amazon RDS",
    domain: "development",
    question: "What database engines does Amazon RDS support?",
    answer:
      "RDS supports six engines: Amazon Aurora (MySQL/PostgreSQL-compatible), MySQL, PostgreSQL, MariaDB, Oracle Database, and Microsoft SQL Server.",
    keyPoints: [
      "Aurora, MySQL, PostgreSQL, MariaDB, Oracle, SQL Server",
      "Aurora is AWS's cloud-native engine with highest performance",
      "Managed — AWS handles patching and backups",
    ],
    difficulty: "easy",
    tags: ["rds", "database", "managed service"],
  },
  {
    id: "clf-rds-2",
    service: "Amazon RDS",
    domain: "development",
    question: "What is RDS Multi-AZ and what does it provide?",
    answer:
      "Multi-AZ creates a synchronous standby replica in a different Availability Zone. It provides high availability and automatic failover (60–120 seconds) if the primary fails, but the standby does NOT serve read traffic — it is for HA only.",
    keyPoints: [
      "Synchronous standby in another AZ",
      "Automatic failover in 60–120 seconds",
      "Standby does NOT serve read queries",
    ],
    difficulty: "medium",
    tags: ["rds", "multi-az", "high availability"],
  },
  {
    id: "clf-rds-3",
    service: "Amazon RDS",
    domain: "development",
    question:
      "What are RDS Read Replicas and how do they differ from Multi-AZ?",
    answer:
      "Read Replicas are asynchronous copies of the database that serve read-only traffic to scale read capacity. Multi-AZ is for availability with a synchronous standby that doesn't serve reads. Read Replicas can be in different regions; Multi-AZ standby is within the same region.",
    keyPoints: [
      "Read Replicas = asynchronous, serve reads, scale read capacity",
      "Multi-AZ = synchronous, high availability only, no reads served",
      "Can promote a Read Replica to an independent primary",
    ],
    difficulty: "medium",
    tags: ["rds", "read replicas", "scaling"],
  },
  {
    id: "clf-rds-4",
    service: "Amazon RDS",
    domain: "development",
    question:
      "What is the difference between RDS automated backups and manual snapshots?",
    answer:
      "Automated backups run daily and enable point-in-time recovery within 1–35 days; they are deleted when you delete the RDS instance. Manual snapshots persist until you explicitly delete them and can be kept indefinitely.",
    keyPoints: [
      "Automated: 1–35 day retention, deleted with instance",
      "Snapshots: persist until manually deleted",
      "Restore always creates a NEW instance",
    ],
    difficulty: "medium",
    tags: ["rds", "backup", "snapshots"],
  },
  {
    id: "clf-rds-5",
    service: "Amazon RDS",
    domain: "development",
    question: "What is Amazon Aurora and how does it differ from standard RDS?",
    answer:
      "Aurora is AWS's cloud-native relational database engine compatible with MySQL and PostgreSQL. It stores 6 copies across 3 AZs, delivers up to 5x MySQL throughput, supports up to 15 read replicas, and auto-scales storage up to 128 TB.",
    keyPoints: [
      "Cloud-native, MySQL/PostgreSQL-compatible",
      "6 copies across 3 AZs, higher durability",
      "Up to 15 read replicas (vs. 5 for standard RDS)",
    ],
    difficulty: "medium",
    tags: ["rds", "aurora", "database"],
  },
  {
    id: "clf-rds-6",
    service: "Amazon RDS",
    domain: "development",
    question:
      "Can you enable encryption on an existing unencrypted RDS instance?",
    answer:
      "No. You cannot directly enable encryption on an existing unencrypted instance. You must take a snapshot, copy it with encryption enabled, and restore from the encrypted snapshot — creating a new encrypted instance.",
    keyPoints: [
      "Cannot enable encryption on existing instance",
      "Workaround: snapshot → encrypt copy → restore",
      "Encryption must be configured at creation time",
    ],
    difficulty: "hard",
    tags: ["rds", "encryption", "security"],
  },
  {
    id: "clf-rds-7",
    service: "Amazon RDS",
    domain: "development",
    question: "What is Aurora Serverless?",
    answer:
      "Aurora Serverless is an on-demand auto-scaling configuration of Aurora that starts, scales, and shuts down automatically based on application traffic. You pay per second only when the database is active — ideal for infrequent or unpredictable workloads.",
    keyPoints: [
      "Auto-scales Aurora capacity up and down",
      "Pay per second only when active",
      "Ideal for infrequent or variable workloads",
    ],
    difficulty: "medium",
    tags: ["rds", "aurora", "serverless"],
  },

  // ── AWS IAM ─────────────────────────────────────────────────────────────────
  {
    id: "clf-iam-1",
    service: "AWS IAM",
    domain: "security",
    question: "What are the four main IAM components?",
    answer:
      "Users (individuals with long-term credentials), Groups (collections of users sharing policies), Roles (identities with temporary credentials assumed by services or users), and Policies (JSON documents defining permissions).",
    keyPoints: [
      "Users = long-term credentials for people/apps",
      "Groups = users sharing the same policies",
      "Roles = temporary credentials, assumed by services",
    ],
    difficulty: "easy",
    tags: ["iam", "security", "access management"],
  },
  {
    id: "clf-iam-2",
    service: "AWS IAM",
    domain: "security",
    question: "What is the Principle of Least Privilege?",
    answer:
      "Every user, role, or service should have only the minimum permissions necessary to perform its function — nothing more. Start with no permissions and grant only what is specifically required.",
    keyPoints: [
      "Grant minimum required permissions only",
      "Start with no access, add what is needed",
      "Reduces blast radius of compromised credentials",
    ],
    difficulty: "easy",
    tags: ["iam", "security", "best practices"],
  },
  {
    id: "clf-iam-3",
    service: "AWS IAM",
    domain: "security",
    question: "What is the AWS root user and what should you do with it?",
    answer:
      "The root user is created with the account email and has unrestricted access to everything. You should: enable MFA immediately, never use it for daily tasks, create IAM users for administration, and delete or not create root access keys.",
    keyPoints: [
      "Has unrestricted, unconstrained account access",
      "Enable MFA immediately",
      "Never use for daily operations",
    ],
    difficulty: "easy",
    tags: ["iam", "root user", "security", "mfa"],
  },
  {
    id: "clf-iam-4",
    service: "AWS IAM",
    domain: "security",
    question: "Why are IAM Roles preferred over IAM Users for applications?",
    answer:
      "Roles issue temporary, automatically rotated credentials rather than long-term static access keys. This is more secure because there are no long-lived credentials to steal, rotate manually, or accidentally expose.",
    keyPoints: [
      "Roles = temporary credentials, auto-rotated",
      "Users = long-term access keys (security risk)",
      "EC2/Lambda use roles via instance profiles",
    ],
    difficulty: "medium",
    tags: ["iam", "roles", "security"],
  },
  {
    id: "clf-iam-5",
    service: "AWS IAM",
    domain: "security",
    question: "What is IAM MFA and why is it important?",
    answer:
      "Multi-Factor Authentication requires a second factor (authenticator app or hardware token code) in addition to a password. It prevents account takeover even if a password is compromised, and should be enabled on all human users, especially the root account.",
    keyPoints: [
      "Second factor beyond password",
      "Protects against password compromise",
      "Required for root account and all privileged users",
    ],
    difficulty: "easy",
    tags: ["iam", "mfa", "security"],
  },
  {
    id: "clf-iam-6",
    service: "AWS IAM",
    domain: "security",
    question: "What does an IAM Policy document define?",
    answer:
      "An IAM Policy is a JSON document with statements that define: Effect (Allow/Deny), Action (the AWS API operation like s3:GetObject), Resource (the ARN of what the action applies to), and optional Condition. Explicit Deny always overrides Allow.",
    keyPoints: [
      "JSON: Effect, Action, Resource, Condition",
      "Explicit Deny always overrides Allow",
      "Attach policies to users, groups, or roles",
    ],
    difficulty: "medium",
    tags: ["iam", "policies", "security"],
  },
  {
    id: "clf-iam-7",
    service: "AWS IAM",
    domain: "security",
    question: "What is AWS IAM Identity Center (formerly AWS SSO)?",
    answer:
      "IAM Identity Center centrally manages access across multiple AWS accounts and applications. It integrates with external identity providers (Active Directory, Okta, Google) so users sign in once with their corporate credentials to access all permitted AWS accounts.",
    keyPoints: [
      "Central access management for multi-account orgs",
      "Integrates with external identity providers (federation)",
      "Single sign-on: one login for all AWS accounts",
    ],
    difficulty: "medium",
    tags: ["iam", "sso", "federation"],
  },

  // ── Amazon CloudFront ────────────────────────────────────────────────────────
  {
    id: "clf-cloudfront-1",
    service: "Amazon CloudFront",
    domain: "development",
    question: "What is Amazon CloudFront and what problem does it solve?",
    answer:
      "CloudFront is AWS's global Content Delivery Network (CDN). It caches content at 600+ Points of Presence (edge locations) worldwide, serving users from the nearest location rather than the origin server — reducing latency and offloading traffic from your origin.",
    keyPoints: [
      "Global CDN with 600+ edge locations",
      "Caches content near users to reduce latency",
      "Reduces load on origin server",
    ],
    difficulty: "easy",
    tags: ["cloudfront", "cdn", "performance"],
  },
  {
    id: "clf-cloudfront-2",
    service: "Amazon CloudFront",
    domain: "development",
    question: "What is Origin Access Control (OAC) in CloudFront?",
    answer:
      "OAC allows you to keep an S3 bucket private and restrict access so only CloudFront can read from it. Users access content through CloudFront (HTTPS, CDN) and cannot bypass CloudFront to access S3 directly.",
    keyPoints: [
      "S3 bucket remains private",
      "Only CloudFront can read the bucket",
      "Prevents direct S3 access bypassing CDN",
    ],
    difficulty: "medium",
    tags: ["cloudfront", "s3", "security"],
  },
  {
    id: "clf-cloudfront-3",
    service: "Amazon CloudFront",
    domain: "development",
    question:
      "What is CloudFront cache invalidation and when would you use it?",
    answer:
      "Cache invalidation forces CloudFront to remove cached objects from edge locations before their TTL expires. Use it after deploying updated content. It costs money per path beyond the free monthly allowance — versioning file names is often preferable.",
    keyPoints: [
      "Removes cached content before TTL expires",
      "Useful after content updates/deployments",
      "Costs money — versioning names is often better",
    ],
    difficulty: "medium",
    tags: ["cloudfront", "caching", "deployment"],
  },
  {
    id: "clf-cloudfront-4",
    service: "Amazon CloudFront",
    domain: "development",
    question: "How does AWS WAF integrate with CloudFront?",
    answer:
      "AWS WAF (Web Application Firewall) can be attached to a CloudFront distribution to block common web exploits (SQL injection, XSS), filter by IP reputation or geography, and apply rate limits — all at the edge before traffic reaches your origin.",
    keyPoints: [
      "WAF rules run at CloudFront edge locations",
      "Blocks SQLi, XSS, bad actors",
      "Rate limiting prevents DDoS from reaching origin",
    ],
    difficulty: "medium",
    tags: ["cloudfront", "waf", "security"],
  },
  {
    id: "clf-cloudfront-5",
    service: "Amazon CloudFront",
    domain: "development",
    question: "What is geo-restriction in CloudFront?",
    answer:
      "Geo-restriction allows you to block or allow CloudFront content delivery based on the geographic location of the viewer (by country). Useful for content licensing compliance or export control regulations.",
    keyPoints: [
      "Block or allow by country",
      "Uses viewer IP to determine country",
      "Common for content licensing compliance",
    ],
    difficulty: "medium",
    tags: ["cloudfront", "geo-restriction", "compliance"],
  },
  {
    id: "clf-cloudfront-6",
    service: "Amazon CloudFront",
    domain: "development",
    question: "What are CloudFront Signed URLs and Signed Cookies?",
    answer:
      "Signed URLs grant time-limited access to a single private object. Signed Cookies grant time-limited access to multiple private objects without changing URLs. Both restrict who can access private content without making it publicly available.",
    keyPoints: [
      "Signed URL = access to one specific file",
      "Signed Cookie = access to multiple files",
      "Both expire after a configured time",
    ],
    difficulty: "hard",
    tags: ["cloudfront", "security", "signed urls"],
  },

  // ── AWS Lambda ──────────────────────────────────────────────────────────────
  {
    id: "clf-lambda-1",
    service: "AWS Lambda",
    domain: "development",
    question: "What is AWS Lambda and what makes it 'serverless'?",
    answer:
      "Lambda is a serverless compute service that runs your code in response to events without you managing any servers. AWS handles all infrastructure provisioning, scaling, patching, and availability — you only write the function code.",
    keyPoints: [
      "No servers to manage — AWS handles everything",
      "Event-driven — runs only when invoked",
      "Pay only for compute time used",
    ],
    difficulty: "easy",
    tags: ["lambda", "serverless", "compute"],
  },
  {
    id: "clf-lambda-2",
    service: "AWS Lambda",
    domain: "development",
    question: "What is the maximum execution timeout for a Lambda function?",
    answer:
      "15 minutes (900 seconds) per invocation. For workloads requiring longer execution, use AWS Step Functions to orchestrate multiple Lambda calls or use EC2/ECS for long-running tasks.",
    keyPoints: [
      "Max timeout: 15 minutes per invocation",
      "For longer tasks: use Step Functions or EC2/ECS",
      "Memory: 128 MB to 10,240 MB",
    ],
    difficulty: "easy",
    tags: ["lambda", "limits", "serverless"],
  },
  {
    id: "clf-lambda-3",
    service: "AWS Lambda",
    domain: "development",
    question: "What is a Lambda cold start?",
    answer:
      "A cold start occurs when Lambda must initialize a new execution environment because no warm environment is available. This adds latency (100ms–1+ seconds depending on runtime) because Lambda must download the code and initialize the runtime before running the handler.",
    keyPoints: [
      "Occurs when no warm environment exists",
      "Adds latency: 100ms–1+ seconds",
      "Warm starts reuse existing environments and are faster",
    ],
    difficulty: "medium",
    tags: ["lambda", "performance", "cold start"],
  },
  {
    id: "clf-lambda-4",
    service: "AWS Lambda",
    domain: "development",
    question: "What is Lambda's pricing model?",
    answer:
      "Lambda charges for the number of requests (invocations) and the duration of compute (GB-seconds). The Free Tier includes 1 million requests and 400,000 GB-seconds per month permanently — many small applications run entirely within the free tier.",
    keyPoints: [
      "Pay per request + compute duration (GB-seconds)",
      "No idle cost — pay only when function runs",
      "Free Tier: 1M requests + 400K GB-seconds/month",
    ],
    difficulty: "medium",
    tags: ["lambda", "pricing", "free tier"],
  },
  {
    id: "clf-lambda-5",
    service: "AWS Lambda",
    domain: "development",
    question: "What AWS services can trigger a Lambda function?",
    answer:
      "Common triggers include API Gateway (HTTP requests), S3 (object events), SQS (messages), DynamoDB Streams (table changes), SNS (notifications), EventBridge (scheduled or event-driven), Kinesis (stream data), and Cognito (user pool events).",
    keyPoints: [
      "API Gateway = HTTP API invocations",
      "S3, DynamoDB Streams = data change events",
      "EventBridge = scheduled (cron) or event-driven",
    ],
    difficulty: "medium",
    tags: ["lambda", "triggers", "event-driven"],
  },
  {
    id: "clf-lambda-6",
    service: "AWS Lambda",
    domain: "development",
    question:
      "How should a Lambda function access other AWS services securely?",
    answer:
      "Attach an IAM execution role to the Lambda function with the minimum required permissions. Lambda automatically provides temporary credentials to the function. Never embed access keys in function code or environment variables.",
    keyPoints: [
      "Use IAM execution role — never embed keys",
      "Role provides temporary, auto-rotated credentials",
      "Apply Principle of Least Privilege to the role",
    ],
    difficulty: "medium",
    tags: ["lambda", "iam", "security"],
  },
  {
    id: "clf-lambda-7",
    service: "AWS Lambda",
    domain: "development",
    question: "What is the typical serverless API architecture on AWS?",
    answer:
      "API Gateway + Lambda + DynamoDB. API Gateway receives HTTP requests, invokes Lambda synchronously, Lambda processes the request and reads/writes DynamoDB, then returns the response. No EC2 or server management required.",
    keyPoints: [
      "API Gateway (HTTP) → Lambda (logic) → DynamoDB (data)",
      "Fully serverless — no servers to manage",
      "Scales automatically to any traffic level",
    ],
    difficulty: "easy",
    tags: ["lambda", "api gateway", "serverless architecture"],
  },

  // ── Amazon DynamoDB ─────────────────────────────────────────────────────────
  {
    id: "clf-dynamodb-1",
    service: "Amazon DynamoDB",
    domain: "development",
    question:
      "What type of database is DynamoDB and what performance does it deliver?",
    answer:
      "DynamoDB is a fully managed, serverless NoSQL key-value and document database that delivers single-digit millisecond performance at any scale — from a few requests per second to millions per second.",
    keyPoints: [
      "NoSQL (key-value / document)",
      "Single-digit millisecond performance",
      "Scales to millions of requests per second",
    ],
    difficulty: "easy",
    tags: ["dynamodb", "nosql", "performance"],
  },
  {
    id: "clf-dynamodb-2",
    service: "Amazon DynamoDB",
    domain: "development",
    question: "What are the two types of DynamoDB primary keys?",
    answer:
      "Simple Primary Key: Partition Key only — uniquely identifies each item. Composite Primary Key: Partition Key + Sort Key — allows multiple items with the same partition key, sorted by the sort key.",
    keyPoints: [
      "Partition key alone = simple primary key",
      "Partition key + sort key = composite primary key",
      "Sort key enables range queries within a partition",
    ],
    difficulty: "medium",
    tags: ["dynamodb", "primary key", "data modeling"],
  },
  {
    id: "clf-dynamodb-3",
    service: "Amazon DynamoDB",
    domain: "development",
    question:
      "What is the difference between DynamoDB On-Demand and Provisioned capacity modes?",
    answer:
      "On-Demand: automatically scales to any traffic level, pay per request — simpler, good for unpredictable workloads. Provisioned: you specify RCUs and WCUs, can enable Auto Scaling — more cost-effective for predictable steady traffic.",
    keyPoints: [
      "On-Demand = pay per request, no planning, scales automatically",
      "Provisioned = specify capacity, cheaper for steady traffic",
      "Both support Auto Scaling",
    ],
    difficulty: "medium",
    tags: ["dynamodb", "capacity", "pricing"],
  },
  {
    id: "clf-dynamodb-4",
    service: "Amazon DynamoDB",
    domain: "development",
    question: "What are DynamoDB Global Tables?",
    answer:
      "Global Tables provide fully replicated, multi-master DynamoDB tables across multiple AWS regions. Any region can serve both reads and writes, and changes propagate to all regions within seconds — enabling global low-latency access and built-in disaster recovery.",
    keyPoints: [
      "Multi-region, multi-master replication",
      "Any region can read and write",
      "Changes propagate globally within seconds",
    ],
    difficulty: "medium",
    tags: ["dynamodb", "global tables", "high availability"],
  },
  {
    id: "clf-dynamodb-5",
    service: "Amazon DynamoDB",
    domain: "development",
    question: "What is DynamoDB Point-in-Time Recovery (PITR)?",
    answer:
      "PITR continuously backs up your table and allows you to restore it to any second within the past 35 days. It is a best practice to enable PITR on production tables to protect against accidental writes or deletes.",
    keyPoints: [
      "Continuous backups for 35-day rolling window",
      "Restore to any second within that window",
      "Best practice: enable on all production tables",
    ],
    difficulty: "medium",
    tags: ["dynamodb", "backup", "pitr"],
  },
  {
    id: "clf-dynamodb-6",
    service: "Amazon DynamoDB",
    domain: "development",
    question: "What are DynamoDB Streams and how are they used?",
    answer:
      "DynamoDB Streams captures a time-ordered log of item-level changes (inserts, updates, deletes) to a table. Commonly paired with Lambda to trigger real-time reactions: sending emails when a user signs up, updating caches when data changes, replicating data to other systems.",
    keyPoints: [
      "Captures insert/update/delete events",
      "Events available for 24 hours",
      "Pairs with Lambda for event-driven processing",
    ],
    difficulty: "medium",
    tags: ["dynamodb", "streams", "event-driven"],
  },
  {
    id: "clf-dynamodb-7",
    service: "Amazon DynamoDB",
    domain: "development",
    question: "What is DynamoDB DAX (DynamoDB Accelerator)?",
    answer:
      "DAX is a fully managed, in-memory cache for DynamoDB that delivers microsecond read latency (vs. milliseconds from DynamoDB). It is API-compatible with DynamoDB — you only change the endpoint, not your application logic. Ideal for read-heavy workloads.",
    keyPoints: [
      "In-memory cache for DynamoDB",
      "Microsecond read latency",
      "API-compatible — minimal code changes",
    ],
    difficulty: "hard",
    tags: ["dynamodb", "dax", "caching", "performance"],
  },

  // ── Amazon SNS ──────────────────────────────────────────────────────────────
  {
    id: "clf-sns-1",
    service: "Amazon SNS",
    domain: "development",
    question: "What messaging pattern does SNS follow?",
    answer:
      "SNS follows the publish/subscribe (pub/sub) pattern. Publishers send messages to a topic, and all subscribers receive every message simultaneously (fan-out). The publisher does not know who subscribes or how many subscribers exist.",
    keyPoints: [
      "Pub/sub: publish once, delivered to all subscribers",
      "Fan-out: one message → multiple receivers",
      "Publisher and subscriber are decoupled",
    ],
    difficulty: "easy",
    tags: ["sns", "pub-sub", "messaging"],
  },
  {
    id: "clf-sns-2",
    service: "Amazon SNS",
    domain: "development",
    question: "What types of subscribers can receive SNS messages?",
    answer:
      "SNS supports: Email, Email-JSON, HTTP/HTTPS endpoints, Amazon SQS queues, AWS Lambda functions, SMS (text messages), and mobile push notifications (iOS/Android). One topic can have multiple different subscriber types simultaneously.",
    keyPoints: [
      "Email, SMS, HTTP, SQS, Lambda, mobile push",
      "Multiple subscriber types on one topic",
      "Email subscriptions require confirmation",
    ],
    difficulty: "easy",
    tags: ["sns", "subscriptions", "messaging"],
  },
  {
    id: "clf-sns-3",
    service: "Amazon SNS",
    domain: "development",
    question: "What is the SNS + SQS fan-out pattern?",
    answer:
      "A producer publishes to one SNS topic. Multiple SQS queues subscribe to the topic. SNS delivers the message to every queue simultaneously. Each queue is consumed independently by different services — enabling decoupled, parallel processing of one event.",
    keyPoints: [
      "One SNS publish → multiple SQS queues",
      "Each queue processed independently",
      "Foundation for resilient distributed systems",
    ],
    difficulty: "medium",
    tags: ["sns", "sqs", "fan-out", "architecture"],
  },
  {
    id: "clf-sns-4",
    service: "Amazon SNS",
    domain: "development",
    question: "What is SNS Message Filtering?",
    answer:
      "Message filtering lets subscribers receive only messages that match a filter policy attached to their subscription. Instead of receiving all messages on a topic, a subscriber with a filter policy receives only messages with matching attributes — reducing unnecessary processing.",
    keyPoints: [
      "Subscribers receive only matching messages",
      "Filter policy is JSON on the subscription",
      "Reduces unnecessary Lambda/SQS invocations",
    ],
    difficulty: "medium",
    tags: ["sns", "filtering", "messaging"],
  },
  {
    id: "clf-sns-5",
    service: "Amazon SNS",
    domain: "development",
    question: "How is SNS different from SQS?",
    answer:
      "SNS is push-based pub/sub — one message delivered to ALL subscribers simultaneously. SQS is a pull-based queue — one message consumed by ONE consumer. SNS is for notifications and fan-out; SQS is for work queues and buffering.",
    keyPoints: [
      "SNS = push, all subscribers, fan-out",
      "SQS = pull, one consumer per message",
      "Often combined: SNS fans out to multiple SQS queues",
    ],
    difficulty: "medium",
    tags: ["sns", "sqs", "comparison"],
  },
  {
    id: "clf-sns-6",
    service: "Amazon SNS",
    domain: "development",
    question: "What are SNS FIFO topics and when should you use them?",
    answer:
      "FIFO topics guarantee strict message ordering and exactly-once delivery. Supported subscribers include SQS FIFO queues, Lambda, HTTP/S endpoints, and Kinesis Firehose. Use them when the order of notifications matters — such as financial transaction events or inventory updates that must be processed in sequence.",
    keyPoints: [
      "Strict ordering + exactly-once delivery",
      "Delivers to SQS FIFO queues, Lambda, HTTP/S, and Kinesis Firehose",
      "Standard topics have no ordering guarantees",
    ],
    difficulty: "hard",
    tags: ["sns", "fifo", "ordering"],
  },

  // ── Amazon SQS ──────────────────────────────────────────────────────────────
  {
    id: "clf-sqs-1",
    service: "Amazon SQS",
    domain: "development",
    question: "What is Amazon SQS and what problem does it solve?",
    answer:
      "SQS is a fully managed message queue service that decouples producers and consumers. It buffers messages between components so they can operate independently and at different speeds, enabling asynchronous, resilient distributed architectures.",
    keyPoints: [
      "Decouples producers from consumers",
      "Buffers messages for async processing",
      "Fully managed — no servers to maintain",
    ],
    difficulty: "easy",
    tags: ["sqs", "messaging", "decoupling"],
  },
  {
    id: "clf-sqs-2",
    service: "Amazon SQS",
    domain: "development",
    question: "What is the difference between Standard and FIFO SQS queues?",
    answer:
      "Standard: at-least-once delivery (rare duplicates possible), best-effort ordering, unlimited throughput. FIFO: exactly-once processing, strict message ordering, up to 3,000 messages/second with batching.",
    keyPoints: [
      "Standard = at-least-once, best-effort order, high throughput",
      "FIFO = exactly-once, strict order, limited throughput",
      "Choose FIFO for transactions; Standard for high-volume processing",
    ],
    difficulty: "medium",
    tags: ["sqs", "fifo", "standard queue"],
  },
  {
    id: "clf-sqs-3",
    service: "Amazon SQS",
    domain: "development",
    question: "What is the SQS Visibility Timeout?",
    answer:
      "After a consumer retrieves a message, the Visibility Timeout makes it invisible to other consumers for that period (default 30s, max 12h). If the consumer deletes the message, it is gone. If the consumer fails and doesn't delete it, the message becomes visible again for reprocessing.",
    keyPoints: [
      "Message hidden from other consumers after retrieval",
      "Default 30 seconds, max 12 hours",
      "Must be longer than your processing time to avoid duplicates",
    ],
    difficulty: "medium",
    tags: ["sqs", "visibility timeout", "message processing"],
  },
  {
    id: "clf-sqs-4",
    service: "Amazon SQS",
    domain: "development",
    question: "What is a Dead Letter Queue (DLQ) in SQS?",
    answer:
      "A DLQ is a separate queue that receives messages that fail processing after a maximum number of retries (maxReceiveCount). It quarantines poison-pill messages to prevent them from blocking queue processing, and allows investigation and replay of failed messages.",
    keyPoints: [
      "Receives messages that failed maxReceiveCount times",
      "Quarantines poison-pill messages",
      "Monitor DLQ with CloudWatch alarms",
    ],
    difficulty: "medium",
    tags: ["sqs", "dlq", "error handling"],
  },
  {
    id: "clf-sqs-5",
    service: "Amazon SQS",
    domain: "development",
    question:
      "What is SQS Long Polling and why is it preferred over Short Polling?",
    answer:
      "Long Polling waits up to 20 seconds for a message to arrive before returning an empty response. Short Polling returns immediately even if no messages exist. Long Polling reduces empty API responses, saves cost, and reduces CPU usage in consumer applications.",
    keyPoints: [
      "Long Polling waits up to 20 seconds for messages",
      "Short Polling returns immediately (more empty responses)",
      "Long Polling is preferred for efficiency and cost",
    ],
    difficulty: "medium",
    tags: ["sqs", "long polling", "efficiency"],
  },
  {
    id: "clf-sqs-6",
    service: "Amazon SQS",
    domain: "development",
    question: "How is SQS queue depth used with Auto Scaling?",
    answer:
      "SQS queue depth (number of messages) is an ideal metric for Auto Scaling EC2 worker fleets. As the queue grows, Auto Scaling adds more workers to process messages faster. When the queue drains, it scales in to reduce cost — creating a self-regulating, cost-efficient system.",
    keyPoints: [
      "Queue depth = messages waiting to be processed",
      "High queue depth → add more EC2 workers",
      "Empty queue → scale in workers to reduce cost",
    ],
    difficulty: "medium",
    tags: ["sqs", "auto scaling", "architecture"],
  },
  {
    id: "clf-sqs-7",
    service: "Amazon SQS",
    domain: "development",
    question:
      "What is the maximum SQS message size and how do you handle larger payloads?",
    answer:
      "SQS maximum message size is 256 KB. For larger payloads, store the data in S3 and put the S3 object reference in the SQS message (the Extended Client Library pattern). The consumer reads the reference from SQS, then fetches the actual data from S3.",
    keyPoints: [
      "Max message size: 256 KB",
      "For larger data: store in S3, reference in SQS message",
      "Extended Client Library handles this pattern automatically",
    ],
    difficulty: "hard",
    tags: ["sqs", "limits", "s3"],
  },

  // ── Amazon CloudWatch ────────────────────────────────────────────────────────
  {
    id: "clf-cloudwatch-1",
    service: "Amazon CloudWatch",
    domain: "deployment",
    question: "What does Amazon CloudWatch provide?",
    answer:
      "CloudWatch is AWS's observability service providing metrics (performance data), logs (application/system logs), alarms (automated responses to metric thresholds), and dashboards (visual monitoring) for AWS resources and custom applications.",
    keyPoints: [
      "Metrics: time-series performance data",
      "Logs: centralized log storage and search",
      "Alarms: automated responses to thresholds",
    ],
    difficulty: "easy",
    tags: ["cloudwatch", "monitoring", "observability"],
  },
  {
    id: "clf-cloudwatch-2",
    service: "Amazon CloudWatch",
    domain: "deployment",
    question: "Does EC2 report memory utilization to CloudWatch by default?",
    answer:
      "No. EC2 does NOT report memory utilization (RAM usage) to CloudWatch by default. You must install the CloudWatch Agent on the instance and configure it to collect memory metrics. This is a frequently tested exam question.",
    keyPoints: [
      "Memory NOT reported by default from EC2",
      "Requires CloudWatch Agent installation",
      "CloudWatch Agent also collects disk usage and other OS metrics",
    ],
    difficulty: "medium",
    tags: ["cloudwatch", "ec2", "monitoring"],
  },
  {
    id: "clf-cloudwatch-3",
    service: "Amazon CloudWatch",
    domain: "deployment",
    question: "What are the three states of a CloudWatch Alarm?",
    answer:
      "OK (metric is within the acceptable threshold), ALARM (metric has breached the threshold and actions may be triggered), and INSUFFICIENT_DATA (not enough data points have been collected to determine state, often seen on new alarms).",
    keyPoints: [
      "OK: metric within threshold",
      "ALARM: threshold breached, actions triggered",
      "INSUFFICIENT_DATA: not enough data yet",
    ],
    difficulty: "medium",
    tags: ["cloudwatch", "alarms", "monitoring"],
  },
  {
    id: "clf-cloudwatch-4",
    service: "Amazon CloudWatch",
    domain: "deployment",
    question: "What actions can a CloudWatch Alarm trigger?",
    answer:
      "Alarms can trigger: SNS notifications (email, SMS, Lambda), EC2 actions (stop, terminate, reboot, recover instance), Auto Scaling actions (scale out or scale in), and Systems Manager Automation runbooks.",
    keyPoints: [
      "SNS: send notification or trigger services",
      "EC2 action: stop/start/reboot instance automatically",
      "Auto Scaling: add or remove instances",
    ],
    difficulty: "medium",
    tags: ["cloudwatch", "alarms", "automation"],
  },
  {
    id: "clf-cloudwatch-5",
    service: "Amazon CloudWatch",
    domain: "deployment",
    question: "What is a CloudWatch Metric Filter?",
    answer:
      "A Metric Filter extracts metric data from CloudWatch Logs. For example, you define a filter to count log lines containing 'ERROR' and publish that count as a CloudWatch metric. This lets you create alarms based on log content rather than native service metrics.",
    keyPoints: [
      "Extracts metrics from log events",
      "Example: count ERROR occurrences → metric → alarm",
      "Bridges log content and metric-based alerting",
    ],
    difficulty: "hard",
    tags: ["cloudwatch", "logs", "metric filter"],
  },
  {
    id: "clf-cloudwatch-6",
    service: "Amazon CloudWatch",
    domain: "deployment",
    question:
      "What is the difference between basic and detailed EC2 monitoring in CloudWatch?",
    answer:
      "Basic monitoring (free) provides metrics at 5-minute intervals. Detailed monitoring (paid) provides metrics at 1-minute intervals. For latency-sensitive auto scaling or fine-grained performance analysis, enable detailed monitoring.",
    keyPoints: [
      "Basic: 5-minute intervals, free",
      "Detailed: 1-minute intervals, additional cost",
      "Enable detailed for fast-scaling or fine-grained analysis",
    ],
    difficulty: "easy",
    tags: ["cloudwatch", "ec2", "monitoring"],
  },

  // ── AWS CloudFormation ───────────────────────────────────────────────────────
  {
    id: "clf-cloudformation-1",
    service: "AWS CloudFormation",
    domain: "deployment",
    question: "What is AWS CloudFormation?",
    answer:
      "CloudFormation is AWS's Infrastructure as Code (IaC) service. You write YAML or JSON templates describing your desired AWS resources, and CloudFormation provisions and configures them automatically — ensuring consistent, repeatable infrastructure deployments.",
    keyPoints: [
      "Infrastructure as Code — templates define desired state",
      "YAML or JSON template format",
      "CloudFormation itself is free — pay for resources created",
    ],
    difficulty: "easy",
    tags: ["cloudformation", "iac", "automation"],
  },
  {
    id: "clf-cloudformation-2",
    service: "AWS CloudFormation",
    domain: "deployment",
    question: "What is a CloudFormation Stack?",
    answer:
      "A stack is a collection of AWS resources that are created, managed, and deleted as a single unit from a CloudFormation template. Deleting a stack automatically deletes all resources that were created from that template.",
    keyPoints: [
      "Group of resources managed together",
      "Created from a single template",
      "Deleting stack = deleting all its resources",
    ],
    difficulty: "easy",
    tags: ["cloudformation", "stacks", "iac"],
  },
  {
    id: "clf-cloudformation-3",
    service: "AWS CloudFormation",
    domain: "deployment",
    question: "What is a CloudFormation Change Set?",
    answer:
      "A Change Set previews the changes that would occur if you apply a template update to an existing stack — before actually making the change. It shows which resources will be added, modified, or replaced, allowing you to review and approve before committing.",
    keyPoints: [
      "Preview of stack update changes before applying",
      "Shows add/modify/replace for each resource",
      "Safe update strategy for production stacks",
    ],
    difficulty: "medium",
    tags: ["cloudformation", "change sets", "deployment"],
  },
  {
    id: "clf-cloudformation-4",
    service: "AWS CloudFormation",
    domain: "deployment",
    question: "What is CloudFormation Drift Detection?",
    answer:
      "Drift Detection identifies resources in a stack whose configuration has been manually changed outside of CloudFormation (e.g., someone edited a security group via the console). It shows what changed and what the template expected, helping you enforce IaC discipline.",
    keyPoints: [
      "Detects manual changes made outside CloudFormation",
      "Compares actual resource config to template",
      "Helps enforce all-changes-through-code discipline",
    ],
    difficulty: "medium",
    tags: ["cloudformation", "drift", "governance"],
  },
  {
    id: "clf-cloudformation-5",
    service: "AWS CloudFormation",
    domain: "deployment",
    question: "What are CloudFormation StackSets?",
    answer:
      "StackSets allow you to deploy the same CloudFormation stack to multiple AWS accounts and/or multiple regions in a single operation. Useful for applying standard security configurations, logging setups, or compliance controls across an entire AWS Organization.",
    keyPoints: [
      "Deploy stacks across multiple accounts/regions",
      "Single operation for organization-wide changes",
      "Ideal for governance and compliance baselines",
    ],
    difficulty: "medium",
    tags: ["cloudformation", "stacksets", "multi-account"],
  },
  {
    id: "clf-cloudformation-6",
    service: "AWS CloudFormation",
    domain: "deployment",
    question: "What happens if a CloudFormation stack update fails?",
    answer:
      "CloudFormation automatically rolls back the update to the last known good state. This prevents partial deployments from leaving infrastructure in an inconsistent or broken state — you end up with either the full new state or the previous working state.",
    keyPoints: [
      "Automatic rollback on failure",
      "Returns to last known good state",
      "Prevents partial/inconsistent deployments",
    ],
    difficulty: "medium",
    tags: ["cloudformation", "rollback", "reliability"],
  },

  // ── Amazon ECS ──────────────────────────────────────────────────────────────
  {
    id: "clf-ecs-1",
    service: "Amazon ECS",
    domain: "deployment",
    question: "What is Amazon ECS?",
    answer:
      "Amazon Elastic Container Service is a fully managed container orchestration service for running Docker containers at scale on AWS. It handles scheduling, placement, scaling, health monitoring, and integration with AWS services.",
    keyPoints: [
      "Managed Docker container orchestration",
      "Handles scheduling and scaling of containers",
      "Integrates natively with IAM, CloudWatch, ELB",
    ],
    difficulty: "easy",
    tags: ["ecs", "containers", "docker"],
  },
  {
    id: "clf-ecs-2",
    service: "Amazon ECS",
    domain: "deployment",
    question:
      "What is the difference between ECS EC2 and ECS Fargate launch types?",
    answer:
      "EC2 launch type: you provision and manage EC2 instances as the cluster compute — you patch them and choose instance types. Fargate launch type: serverless compute managed by AWS — you specify CPU/memory per task and pay per task, no EC2 to manage.",
    keyPoints: [
      "EC2 = you manage host instances",
      "Fargate = AWS manages compute, pay per task",
      "Fargate is preferred for simplicity",
    ],
    difficulty: "medium",
    tags: ["ecs", "fargate", "serverless containers"],
  },
  {
    id: "clf-ecs-3",
    service: "Amazon ECS",
    domain: "deployment",
    question: "What is an ECS Task Definition?",
    answer:
      "A Task Definition is the blueprint for your application in ECS — it specifies the container image, CPU and memory requirements, port mappings, environment variables, logging configuration, and IAM task role. A Task is a running instance of a Task Definition.",
    keyPoints: [
      "Blueprint: image, CPU/memory, ports, env vars",
      "Task = running instance of a Task Definition",
      "Service = keeps desired number of tasks running",
    ],
    difficulty: "medium",
    tags: ["ecs", "task definition", "containers"],
  },
  {
    id: "clf-ecs-4",
    service: "Amazon ECS",
    domain: "deployment",
    question: "What is an IAM Task Role in ECS?",
    answer:
      "An IAM Task Role grants ECS containers permission to call AWS services without embedding credentials in the container image. Each task can have a different role, enforcing least privilege at the task level — analogous to EC2 instance profiles.",
    keyPoints: [
      "Grants containers permission to call AWS services",
      "No credentials in container images",
      "Different tasks can have different roles",
    ],
    difficulty: "medium",
    tags: ["ecs", "iam", "security"],
  },
  {
    id: "clf-ecs-5",
    service: "Amazon ECS",
    domain: "deployment",
    question: "What is the difference between ECS and EKS?",
    answer:
      "ECS uses AWS's own proprietary orchestration engine — simpler, more AWS-native, easier to learn. EKS runs Kubernetes — the open-source standard with a large ecosystem, portable across clouds, better for teams with Kubernetes expertise or multi-cloud strategies.",
    keyPoints: [
      "ECS = AWS-native, simpler orchestration",
      "EKS = managed Kubernetes, open-source, more portable",
      "Both support Fargate for serverless containers",
    ],
    difficulty: "medium",
    tags: ["ecs", "eks", "kubernetes"],
  },
  {
    id: "clf-ecs-6",
    service: "Amazon ECS",
    domain: "deployment",
    question: "What is Amazon ECR?",
    answer:
      "Amazon Elastic Container Registry is AWS's managed Docker image registry. You push container images to ECR and ECS/EKS pulls them at deployment. ECR is private by default, integrates with IAM for access control, and scans images for vulnerabilities.",
    keyPoints: [
      "Managed Docker container registry",
      "Private by default, IAM-controlled access",
      "Integrates natively with ECS and EKS",
    ],
    difficulty: "easy",
    tags: ["ecs", "ecr", "containers"],
  },

  // ── AWS Elastic Beanstalk ─────────────────────────────────────────────────
  {
    id: "clf-beanstalk-1",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    question: "What is AWS Elastic Beanstalk and what type of service is it?",
    answer:
      "Elastic Beanstalk is a Platform as a Service (PaaS). You upload application code and Beanstalk handles infrastructure provisioning, capacity, load balancing, auto scaling, health monitoring, and deployments automatically. Beanstalk itself is free.",
    keyPoints: [
      "PaaS — upload code, AWS handles infrastructure",
      "Creates standard AWS resources (EC2, ELB, ASG)",
      "Beanstalk service itself is free",
    ],
    difficulty: "easy",
    tags: ["beanstalk", "paas", "deployment"],
  },
  {
    id: "clf-beanstalk-2",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    question: "What deployment policies does Elastic Beanstalk support?",
    answer:
      "All at once (fastest, causes downtime), Rolling (deploys in batches, reduced capacity), Rolling with additional batch (adds new instances first, maintains capacity), Immutable (new instance set, zero downtime, easy rollback), and Blue/Green (swap environment URLs).",
    keyPoints: [
      "All at once = fastest, causes downtime",
      "Immutable = safest, no downtime, easy rollback",
      "Blue/Green = swap environments for instant cutover",
    ],
    difficulty: "medium",
    tags: ["beanstalk", "deployment", "zero downtime"],
  },
  {
    id: "clf-beanstalk-3",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    question: "What platforms does Elastic Beanstalk support?",
    answer:
      "Beanstalk supports Node.js, Python, Java (Tomcat), PHP, Ruby, .NET (IIS on Windows), Go, and Docker. AWS maintains and patches the managed runtime platforms automatically.",
    keyPoints: [
      "Node.js, Python, Java, PHP, Ruby, .NET, Go, Docker",
      "AWS patches managed runtime platforms",
      "Docker platform supports any language/framework",
    ],
    difficulty: "easy",
    tags: ["beanstalk", "platforms", "paas"],
  },
  {
    id: "clf-beanstalk-4",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    question: "What is the Elastic Beanstalk worker tier?",
    answer:
      "The worker tier processes background jobs by polling an SQS queue for messages. It decouples CPU-intensive background processing from the web-serving tier, improving responsiveness and resilience of the web application.",
    keyPoints: [
      "Polls SQS queue for background work",
      "Decouples web tier from background processing",
      "Scales independently from web tier",
    ],
    difficulty: "medium",
    tags: ["beanstalk", "worker tier", "sqs"],
  },
  {
    id: "clf-beanstalk-5",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    question: "How do you customize an Elastic Beanstalk environment?",
    answer:
      ".ebextensions: a folder of YAML/JSON config files in your application bundle that customizes the environment — installing packages, setting configuration options, running commands, configuring load balancer settings, and more.",
    keyPoints: [
      ".ebextensions folder with YAML/JSON files",
      "Customize environment without console clicks",
      "Included in your application deployment bundle",
    ],
    difficulty: "medium",
    tags: ["beanstalk", "configuration", "customization"],
  },
  {
    id: "clf-beanstalk-6",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    question: "Should you put an RDS database inside a Beanstalk environment?",
    answer:
      "For production, NO. If RDS is inside the Beanstalk environment, deleting the environment deletes the database. The best practice is to create an external RDS instance outside Beanstalk and configure the environment with the database endpoint — the DB persists independently.",
    keyPoints: [
      "RDS inside Beanstalk = deleted with environment",
      "Production: create RDS externally, reference endpoint",
      "Separation of lifecycle: app ≠ database",
    ],
    difficulty: "medium",
    tags: ["beanstalk", "rds", "best practices"],
  },

  // ── AWS Pricing & Billing ────────────────────────────────────────────────────
  {
    id: "clf-pricing-1",
    service: "AWS Pricing & Billing",
    domain: "troubleshooting",
    question: "What are the three AWS pricing principles?",
    answer:
      "Pay for what you use (no upfront, pay per unit), Pay less when you use more (volume discounts), and Pay less when you reserve (1–3 year commitments like Reserved Instances provide up to 72% discount).",
    keyPoints: [
      "Pay for what you use: no upfront, no termination fees",
      "Pay less with more: volume discounts (e.g., S3)",
      "Pay less reserved: commit 1–3 years for deep discounts",
    ],
    difficulty: "easy",
    tags: ["pricing", "billing", "cost"],
  },
  {
    id: "clf-pricing-2",
    service: "AWS Pricing & Billing",
    domain: "troubleshooting",
    question: "What are the three types of AWS Free Tier offers?",
    answer:
      "Always Free: permanently free up to a limit (e.g., 1M Lambda requests/month). 12 Months Free: free for 12 months after signup (e.g., t2.micro EC2 hours). Trials: short-term free trials of specific services (e.g., 60-day SageMaker trial).",
    keyPoints: [
      "Always Free: permanent (Lambda, DynamoDB 25GB)",
      "12 Months Free: post-signup year (EC2 t2.micro)",
      "Trials: service-specific short-term free use",
    ],
    difficulty: "easy",
    tags: ["pricing", "free tier", "billing"],
  },
  {
    id: "clf-pricing-3",
    service: "AWS Pricing & Billing",
    domain: "troubleshooting",
    question: "What is the data transfer cost rule in AWS?",
    answer:
      "Data transfer INTO AWS (ingress) is free. Data transfer OUT to the internet (egress) is charged per GB. Data transfer between services in the same region is generally free. Data transfer between regions is charged.",
    keyPoints: [
      "Ingress (into AWS) = free",
      "Egress (out to internet) = charged per GB",
      "Same-region inter-service transfer = generally free",
    ],
    difficulty: "medium",
    tags: ["pricing", "data transfer", "billing"],
  },
  {
    id: "clf-pricing-4",
    service: "AWS Pricing & Billing",
    domain: "troubleshooting",
    question: "What is AWS Cost Explorer?",
    answer:
      "Cost Explorer is a visual tool for analyzing your AWS costs and usage. It shows spending by service, region, account, or tag over 13 months of history and provides 3-month forecasts. It also recommends Reserved Instances based on your usage patterns.",
    keyPoints: [
      "Visualizes cost and usage history (13 months)",
      "3-month spend forecasting",
      "RI recommendations based on usage patterns",
    ],
    difficulty: "easy",
    tags: ["pricing", "cost explorer", "billing"],
  },
  {
    id: "clf-pricing-5",
    service: "AWS Pricing & Billing",
    domain: "troubleshooting",
    question: "What is AWS Budgets and how does it help control costs?",
    answer:
      "AWS Budgets lets you set custom cost, usage, or Reserved Instance budgets. When actual or forecasted spend exceeds a threshold, it sends alerts via email or SNS. It can also trigger automated actions like stopping EC2 instances when a budget is exceeded.",
    keyPoints: [
      "Set custom cost/usage thresholds",
      "Alerts when actual or forecasted spend exceeds threshold",
      "Can trigger automated actions on breach",
    ],
    difficulty: "easy",
    tags: ["pricing", "budgets", "cost management"],
  },
  {
    id: "clf-pricing-6",
    service: "AWS Pricing & Billing",
    domain: "troubleshooting",
    question: "What is Consolidated Billing in AWS Organizations?",
    answer:
      "Consolidated Billing combines all member accounts' usage into a single bill paid by the management account. Benefits include aggregated volume discounts (all accounts' usage combined for tier pricing) and Reserved Instance sharing across accounts.",
    keyPoints: [
      "One bill for all accounts in an Organization",
      "Combined usage qualifies for higher volume discount tiers",
      "RI and Savings Plans benefits shared across accounts",
    ],
    difficulty: "medium",
    tags: ["pricing", "consolidated billing", "organizations"],
  },
  {
    id: "clf-pricing-7",
    service: "AWS Pricing & Billing",
    domain: "troubleshooting",
    question: "What is the AWS Pricing Calculator?",
    answer:
      "The AWS Pricing Calculator (calculator.aws) is a free tool that estimates your monthly AWS bill before deploying any resources. You configure services and usage levels, and it calculates projected costs — useful for budgeting and architecture decision-making.",
    keyPoints: [
      "Estimate costs BEFORE deploying resources",
      "Supports all major AWS services",
      "Free to use, no AWS account required",
    ],
    difficulty: "easy",
    tags: ["pricing", "calculator", "cost estimation"],
  },

  // ── AWS Support Plans ────────────────────────────────────────────────────────
  {
    id: "clf-support-1",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    question: "What are the four AWS Support plan tiers?",
    answer:
      "Basic (free), Developer (email support, business hours), Business (24/7 phone/email/chat, production SLAs, full Trusted Advisor), and Enterprise (15-minute critical response, dedicated Technical Account Manager).",
    keyPoints: [
      "Basic: free, no technical support cases",
      "Business: 24/7 access, 1-hour production down SLA",
      "Enterprise: TAM + 15-minute critical response",
    ],
    difficulty: "easy",
    tags: ["support plans", "aws support"],
  },
  {
    id: "clf-support-2",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    question: "What is a Technical Account Manager (TAM)?",
    answer:
      "A TAM is a dedicated AWS employee assigned to Enterprise Support customers. They proactively engage with you to optimize architecture, prepare for events, review for risks, and advocate for your needs within AWS — not just reactive support.",
    keyPoints: [
      "Dedicated AWS expert for Enterprise customers",
      "Proactive architecture reviews and optimization",
      "Exclusive to Enterprise Support",
    ],
    difficulty: "medium",
    tags: ["support plans", "tam", "enterprise"],
  },
  {
    id: "clf-support-3",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    question:
      "Which support plan is the first to provide 24/7 phone support and production SLAs?",
    answer:
      "Business Support is the first plan with 24/7 phone, email, and chat access to Cloud Support Engineers, and guarantees 1-hour response for production system down scenarios.",
    keyPoints: [
      "Business = first plan with 24/7 phone support",
      "1-hour SLA for production system down",
      "Developer support is email-only, business hours",
    ],
    difficulty: "medium",
    tags: ["support plans", "business support", "sla"],
  },
  {
    id: "clf-support-4",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    question: "What is AWS Trusted Advisor?",
    answer:
      "Trusted Advisor analyzes your AWS environment and provides recommendations across five categories: Cost Optimization, Performance, Security, Fault Tolerance, and Service Limits. Basic/Developer plans get 7 core checks; Business/Enterprise get all checks.",
    keyPoints: [
      "5 categories: Cost, Performance, Security, Fault Tolerance, Limits",
      "Basic/Developer: 7 core checks (security + limits)",
      "Business/Enterprise: full checks across all categories",
    ],
    difficulty: "medium",
    tags: ["support plans", "trusted advisor"],
  },
  {
    id: "clf-support-5",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    question: "What does Basic Support include?",
    answer:
      "Basic Support (free) includes AWS documentation, whitepapers, knowledge center articles, community forums, and 7 core Trusted Advisor checks (security and service limits). It does NOT include the ability to open technical support cases.",
    keyPoints: [
      "Free with every AWS account",
      "Documentation, forums, knowledge base",
      "No technical support case access",
    ],
    difficulty: "easy",
    tags: ["support plans", "basic support"],
  },
  {
    id: "clf-support-6",
    service: "AWS Support Plans",
    domain: "troubleshooting",
    question: "What is Enterprise On-Ramp support?",
    answer:
      "Enterprise On-Ramp is positioned between Business and full Enterprise. It provides access to a pool of TAMs (rather than a dedicated one), 30-minute response for critical issues, and Concierge Support — at a lower price than full Enterprise.",
    keyPoints: [
      "Between Business and Enterprise tiers",
      "Pool of TAMs rather than dedicated TAM",
      "30-minute critical response (vs. 15-minute Enterprise)",
    ],
    difficulty: "hard",
    tags: ["support plans", "enterprise on-ramp"],
  },

  // ── AWS Shared Responsibility Model ──────────────────────────────────────────
  {
    id: "clf-shared-1",
    service: "AWS Shared Responsibility Model",
    domain: "security",
    question:
      "What does 'security OF the cloud' vs. 'security IN the cloud' mean?",
    answer:
      "Security OF the cloud: AWS is responsible for the physical infrastructure, hardware, hypervisor, data centers, and global network. Security IN the cloud: customers are responsible for their data, OS configuration, IAM, application security, and network settings.",
    keyPoints: [
      "OF the cloud: AWS = physical infra, hardware, hypervisor",
      "IN the cloud: customer = data, OS, IAM, apps",
      "Both parties share responsibility",
    ],
    difficulty: "easy",
    tags: ["shared responsibility", "security"],
  },
  {
    id: "clf-shared-2",
    service: "AWS Shared Responsibility Model",
    domain: "security",
    question: "Who is responsible for patching EC2 operating systems?",
    answer:
      "The customer. AWS does NOT patch guest operating systems on EC2 instances. The customer must patch Windows or Linux running on their instances. For managed services like RDS, AWS patches the database engine.",
    keyPoints: [
      "EC2 guest OS patching = customer's responsibility",
      "RDS database engine patching = AWS's responsibility",
      "Critical exam distinction",
    ],
    difficulty: "easy",
    tags: ["shared responsibility", "ec2", "patching"],
  },
  {
    id: "clf-shared-3",
    service: "AWS Shared Responsibility Model",
    domain: "security",
    question: "Who is responsible for encrypting data in S3?",
    answer:
      "Encryption is always the customer's choice and responsibility. AWS provides the tools (SSE-S3, SSE-KMS, client-side encryption) and enables SSE-S3 by default, but the customer decides the encryption configuration, key management, and compliance requirements.",
    keyPoints: [
      "AWS provides encryption tools",
      "Customer chooses encryption settings and key management",
      "SSE-S3 is on by default for new objects",
    ],
    difficulty: "medium",
    tags: ["shared responsibility", "s3", "encryption"],
  },
  {
    id: "clf-shared-4",
    service: "AWS Shared Responsibility Model",
    domain: "security",
    question: "Who is responsible for physical data center security in AWS?",
    answer:
      "AWS is entirely responsible for physical data center security — facility access controls, guards, cameras, hardware lifecycle, and environmental controls (power, cooling). Customers never need to worry about or have visibility into physical security.",
    keyPoints: [
      "AWS: physical facility, hardware, environmental controls",
      "Customer: no visibility or responsibility for physical layer",
      "This is an inherited control customers get for free",
    ],
    difficulty: "easy",
    tags: ["shared responsibility", "physical security"],
  },
  {
    id: "clf-shared-5",
    service: "AWS Shared Responsibility Model",
    domain: "security",
    question:
      "How does the shared responsibility model differ for managed services vs. EC2?",
    answer:
      "For EC2 (IaaS), customers manage the OS, applications, and everything above. For managed services like RDS, DynamoDB, and Lambda, AWS manages more of the stack (OS, runtime, patching), leaving customers responsible mainly for data, access control, and configuration.",
    keyPoints: [
      "EC2: customer manages OS, apps, network config",
      "Managed services: AWS manages more; customer owns data and access",
      "More managed = less customer infrastructure responsibility",
    ],
    difficulty: "medium",
    tags: ["shared responsibility", "managed services", "ec2"],
  },
  {
    id: "clf-shared-6",
    service: "AWS Shared Responsibility Model",
    domain: "security",
    question: "Who is responsible for IAM configuration?",
    answer:
      "The customer is entirely responsible for IAM. This includes creating and managing users, groups, roles, and policies; enabling MFA; enforcing least privilege; and auditing access with the Credentials Report. AWS provides the IAM service but the customer configures it.",
    keyPoints: [
      "IAM configuration = entirely customer responsibility",
      "AWS provides the service; customer operates it",
      "Includes MFA, least privilege, credential audits",
    ],
    difficulty: "easy",
    tags: ["shared responsibility", "iam", "security"],
  },

  // ── AWS Well-Architected Framework ───────────────────────────────────────────
  {
    id: "clf-wellarch-1",
    service: "AWS Well-Architected Framework",
    domain: "troubleshooting",
    question: "What are the six pillars of the AWS Well-Architected Framework?",
    answer:
      "Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. Sustainability was added as the sixth pillar in 2021.",
    keyPoints: [
      "6 pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, Sustainability",
      "Sustainability added in 2021 as the sixth pillar",
      "Each pillar has design principles and best practices",
    ],
    difficulty: "easy",
    tags: ["well-architected", "pillars", "best practices"],
  },
  {
    id: "clf-wellarch-2",
    service: "AWS Well-Architected Framework",
    domain: "troubleshooting",
    question: "What is the AWS Well-Architected Tool?",
    answer:
      "A free self-service tool in the AWS console that lets you review workloads against the six pillars by answering questions about your architecture. It generates a report identifying High Risk Issues (HRI) and Medium Risk Issues (MRI) with improvement recommendations.",
    keyPoints: [
      "Free self-service review tool in AWS console",
      "Answer questions per pillar → get risk report",
      "Identifies HRI and MRI with recommendations",
    ],
    difficulty: "medium",
    tags: ["well-architected", "tool", "review"],
  },
  {
    id: "clf-wellarch-3",
    service: "AWS Well-Architected Framework",
    domain: "troubleshooting",
    question: "What is the focus of the Reliability pillar?",
    answer:
      "The Reliability pillar focuses on ensuring a workload performs its intended function correctly and recovers from failures automatically. Key practices include multi-AZ deployments, auto scaling, testing recovery procedures, and managing change through automation.",
    keyPoints: [
      "Recover automatically from failures",
      "Multi-AZ, Auto Scaling, load balancing",
      "Test recovery procedures regularly",
    ],
    difficulty: "medium",
    tags: ["well-architected", "reliability", "high availability"],
  },
  {
    id: "clf-wellarch-4",
    service: "AWS Well-Architected Framework",
    domain: "troubleshooting",
    question: "What does the Cost Optimization pillar recommend?",
    answer:
      "Adopt a consumption model (pay for what you use), use managed services to reduce undifferentiated heavy lifting, measure efficiency, analyze expenditure, and use Reserved Instances/Savings Plans for committed workloads and Spot for fault-tolerant batch jobs.",
    keyPoints: [
      "Consumption model: pay per use, no idle waste",
      "Use managed services to avoid managing undifferentiated infra",
      "RI/Savings Plans for committed; Spot for batch",
    ],
    difficulty: "medium",
    tags: ["well-architected", "cost optimization", "savings"],
  },
  {
    id: "clf-wellarch-5",
    service: "AWS Well-Architected Framework",
    domain: "troubleshooting",
    question: "What is the Operational Excellence pillar's key principle?",
    answer:
      "Perform operations as code — use IaC (CloudFormation, CDK) for infrastructure, automate responses to events, make frequent small reversible changes, anticipate failures, and continuously learn from operational events through post-mortems.",
    keyPoints: [
      "Perform operations as code (IaC)",
      "Small, frequent, reversible changes",
      "Learn from all operational failures",
    ],
    difficulty: "medium",
    tags: ["well-architected", "operational excellence", "iac"],
  },
  {
    id: "clf-wellarch-6",
    service: "AWS Well-Architected Framework",
    domain: "troubleshooting",
    question: "What is the Sustainability pillar focused on?",
    answer:
      "Minimizing the environmental impact of cloud workloads by maximizing resource utilization, adopting efficient hardware and managed services, setting sustainability goals, and choosing options that reduce energy consumption and carbon footprint.",
    keyPoints: [
      "Minimize environmental impact",
      "Maximize utilization (fewer servers needed)",
      "Use managed services (higher utilization density)",
    ],
    difficulty: "medium",
    tags: ["well-architected", "sustainability", "environment"],
  },
  {
    id: "clf-wellarch-7",
    service: "AWS Well-Architected Framework",
    domain: "troubleshooting",
    question: "What are Well-Architected Lenses?",
    answer:
      "Lenses extend the Well-Architected Framework for specific industries or technologies. Examples include the Serverless Lens, Machine Learning Lens, Financial Services Industry Lens, and Healthcare Lens — each providing pillar-specific guidance for that domain.",
    keyPoints: [
      "Extend framework for specific domains",
      "Examples: Serverless, ML, Financial Services, Healthcare",
      "Apply on top of the base six-pillar framework",
    ],
    difficulty: "hard",
    tags: ["well-architected", "lenses", "domain-specific"],
  },

  // ── AWS Global Infrastructure ────────────────────────────────────────────────
  {
    id: "clf-global-1",
    service: "AWS Global Infrastructure",
    domain: "troubleshooting",
    question: "What is an AWS Region?",
    answer:
      "A Region is a geographic area containing multiple isolated Availability Zones. AWS has 30+ regions globally. Data stays in the chosen region unless you explicitly configure cross-region replication. Each region is completely independent.",
    keyPoints: [
      "Geographic area with multiple AZs",
      "30+ regions globally",
      "Data stays in region unless you configure replication",
    ],
    difficulty: "easy",
    tags: ["global infrastructure", "regions"],
  },
  {
    id: "clf-global-2",
    service: "AWS Global Infrastructure",
    domain: "troubleshooting",
    question: "What is an AWS Availability Zone?",
    answer:
      "An Availability Zone is one or more discrete, physically separate data centers within a region, with independent power, cooling, and networking. AZs within a region are connected by high-bandwidth, low-latency private fiber networking.",
    keyPoints: [
      "Physically separate data centers within a region",
      "Independent power, cooling, networking",
      "Connected by high-speed private fiber",
    ],
    difficulty: "easy",
    tags: ["global infrastructure", "availability zones"],
  },
  {
    id: "clf-global-3",
    service: "AWS Global Infrastructure",
    domain: "troubleshooting",
    question: "What are AWS Edge Locations and what services use them?",
    answer:
      "Edge locations are distributed points of presence (400+) in cities worldwide, more numerous than AWS regions. They are used by Amazon CloudFront (CDN caching), Amazon Route 53 (DNS), and AWS Shield (DDoS protection) to serve content and DNS queries with low latency.",
    keyPoints: [
      "400+ locations worldwide — more than regions",
      "Used by CloudFront, Route 53, Shield",
      "Serve content/DNS close to users",
    ],
    difficulty: "easy",
    tags: ["global infrastructure", "edge locations", "cloudfront"],
  },
  {
    id: "clf-global-4",
    service: "AWS Global Infrastructure",
    domain: "troubleshooting",
    question: "What factors should you consider when choosing an AWS Region?",
    answer:
      "Data residency and compliance requirements, proximity to users (latency), service availability (not all services available in all regions), and pricing (same services have different prices in different regions).",
    keyPoints: [
      "Compliance: where data must legally reside",
      "Latency: choose region close to users",
      "Service availability: not all regions have all services",
    ],
    difficulty: "medium",
    tags: ["global infrastructure", "regions", "region selection"],
  },
  {
    id: "clf-global-5",
    service: "AWS Global Infrastructure",
    domain: "troubleshooting",
    question: "What are AWS Local Zones?",
    answer:
      "Local Zones are extensions of AWS regions placed in large population centers not near an existing region. They bring compute, storage, and networking closer to end users, enabling single-digit millisecond latency for applications like gaming, AR/VR, and real-time collaboration.",
    keyPoints: [
      "Extensions of parent regions in metro areas",
      "Latency-sensitive applications: gaming, AR/VR",
      "Single-digit ms latency for nearby users",
    ],
    difficulty: "medium",
    tags: ["global infrastructure", "local zones", "latency"],
  },
  {
    id: "clf-global-6",
    service: "AWS Global Infrastructure",
    domain: "troubleshooting",
    question: "What does AWS guarantee about data residency across regions?",
    answer:
      "AWS does not automatically move customer data between regions. Data placed in a region stays in that region unless the customer explicitly configures cross-region replication, snapshots, or uses a global service. This enables data residency compliance (GDPR, etc.).",
    keyPoints: [
      "Data never leaves a region without customer action",
      "Enables GDPR and data residency compliance",
      "Global services (IAM, CloudFront) are exceptions",
    ],
    difficulty: "medium",
    tags: ["global infrastructure", "data residency", "compliance"],
  },

  // ── Amazon Route 53 ─────────────────────────────────────────────────────────
  {
    id: "clf-route53-1",
    service: "Amazon Route 53",
    domain: "development",
    question: "What are the three main functions of Amazon Route 53?",
    answer:
      "DNS service (translates domain names to IP addresses), Domain registration (purchase and manage domain names), and Health checking (monitors endpoint health and enables automatic DNS failover).",
    keyPoints: [
      "DNS resolution: domain names → IP addresses",
      "Domain registration: purchase and manage domains",
      "Health checks: monitor endpoints, enable failover",
    ],
    difficulty: "easy",
    tags: ["route53", "dns"],
  },
  {
    id: "clf-route53-2",
    service: "Amazon Route 53",
    domain: "development",
    question:
      "What is a Route 53 Alias record and how does it differ from a CNAME?",
    answer:
      "Alias records map a domain to an AWS resource (ELB, CloudFront, S3, Beanstalk) and are free with no per-query charge. They work at the zone apex (root domain). CNAME records map to another domain name, cannot be used at the zone apex, and are charged per query.",
    keyPoints: [
      "Alias: maps to AWS resources, free, works at zone apex",
      "CNAME: maps to domain name, cannot be at zone apex",
      "Alias is preferred for AWS resources",
    ],
    difficulty: "medium",
    tags: ["route53", "alias", "cname", "dns"],
  },
  {
    id: "clf-route53-3",
    service: "Amazon Route 53",
    domain: "development",
    question: "What is Route 53 Failover routing?",
    answer:
      "Failover routing configures a primary and secondary endpoint. Route 53 monitors the primary with health checks and automatically routes all traffic to the secondary if the primary fails. This implements active-passive DNS failover for disaster recovery.",
    keyPoints: [
      "Primary + secondary endpoint configuration",
      "Health checks trigger automatic failover",
      "Active-passive DR — no manual intervention needed",
    ],
    difficulty: "medium",
    tags: ["route53", "failover", "disaster recovery"],
  },
  {
    id: "clf-route53-4",
    service: "Amazon Route 53",
    domain: "development",
    question: "What is Latency-Based routing in Route 53?",
    answer:
      "Latency-based routing routes users to the AWS region with the lowest network latency for their location. If your app runs in us-east-1 and eu-west-1, US users automatically connect to us-east-1 and European users to eu-west-1.",
    keyPoints: [
      "Routes to region with lowest latency",
      "Automatic per-user optimization",
      "Based on measured network latency, not geography",
    ],
    difficulty: "medium",
    tags: ["route53", "latency-based routing", "performance"],
  },
  {
    id: "clf-route53-5",
    service: "Amazon Route 53",
    domain: "development",
    question: "What is Weighted routing in Route 53 and when would you use it?",
    answer:
      "Weighted routing distributes traffic across multiple endpoints according to assigned weights. For example, send 10% of traffic to a new version and 90% to the current version — enabling canary deployments and A/B testing at the DNS level.",
    keyPoints: [
      "Distribute traffic by percentage weights",
      "Canary deployments: test new version with small traffic %",
      "A/B testing without code changes",
    ],
    difficulty: "medium",
    tags: ["route53", "weighted routing", "deployment"],
  },
  {
    id: "clf-route53-6",
    service: "Amazon Route 53",
    domain: "development",
    question: "What is the Route 53 uptime SLA and why is it notable?",
    answer:
      "Route 53 has a 100% availability SLA — the only major AWS service with this commitment. It is achieved through AWS's global anycast network of DNS servers that provides redundancy at the global level.",
    keyPoints: [
      "100% availability SLA — unique among major AWS services",
      "Global anycast DNS network",
      "Authoritative DNS for your domains",
    ],
    difficulty: "medium",
    tags: ["route53", "availability", "sla"],
  },
  {
    id: "clf-route53-7",
    service: "Amazon Route 53",
    domain: "development",
    question: "What is a Route 53 Private Hosted Zone?",
    answer:
      "A Private Hosted Zone resolves DNS names only within one or more specified VPCs. Records in a private zone are not accessible from the public internet — ideal for internal service discovery and private endpoints that should not be publicly resolvable.",
    keyPoints: [
      "DNS resolution only within specified VPCs",
      "Not accessible from the public internet",
      "Used for internal service discovery",
    ],
    difficulty: "medium",
    tags: ["route53", "private hosted zone", "vpc"],
  },
];
