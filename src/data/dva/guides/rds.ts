import { ServiceGuide } from "../../../types/guide";

export const rdsGuide: ServiceGuide = {
  id: "amazon-rds",
  service: "Amazon RDS",
  domain: "development",
  tagline: "Managed relational database service",
  intro:
    "Amazon RDS (Relational Database Service) is a fully managed service for relational databases including MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Amazon Aurora. AWS handles provisioning, patching, backups, and Multi-AZ failover, letting you focus on your application rather than database administration.",

  sections: [
    {
      heading: "Supported Engines & Aurora",
      body: `RDS supports five standard open-source and commercial engines — MySQL, PostgreSQL, MariaDB, Oracle, and Microsoft SQL Server — with AWS handling the underlying infrastructure for all of them. For new workloads, **Amazon Aurora** is generally the better choice: it's an AWS-built engine with MySQL and PostgreSQL compatibility that delivers up to 5x the throughput of MySQL and 3x that of PostgreSQL.

Aurora's performance advantage comes from a fundamentally different storage architecture. Rather than replicating at the instance level, Aurora replicates at the storage level: six copies of your data are maintained across three Availability Zones automatically, with the storage auto-scaling in 10 GiB increments up to 128 TiB. You can attach up to 15 Aurora Read Replicas with typically low replica lag (single-digit to low-double-digit milliseconds), and automated failover to a replica completes in under 30 seconds.

For global applications and disaster recovery, **Aurora Global Database** replicates across regions with less than one second of lag, enabling failover to a secondary region in under a minute. **Aurora Serverless v2** scales capacity in fine-grained ACU (Aurora Capacity Unit) increments and scales to near-zero when idle — v2 addressed the cold-start latency problems that made v1 impractical for latency-sensitive workloads. **Aurora Multi-Master** allows multiple write nodes across AZs for active-active write scenarios. One Aurora-specific feature worth knowing for the exam is **Backtrack**: it can rewind an Aurora MySQL database to a specific point in time without restoring from a backup — the database stays on the same instance with the same endpoint.`,
      quiz: [
        {
          question:
            "How many copies of data does Aurora automatically maintain, and across how many Availability Zones?",
          options: [
            "2 copies across 2 AZs",
            "3 copies across 3 AZs",
            "6 copies across 3 AZs",
            "6 copies across 6 AZs",
          ],
          correctIndex: 2,
          explanation:
            "Aurora automatically maintains 6 copies of your data across 3 Availability Zones at the storage layer. This storage-level replication is what gives Aurora its high durability and enables fast automated failover.",
        },
        {
          question:
            "What is the unique capability of Aurora Backtrack compared to standard RDS point-in-time recovery?",
          options: [
            "Backtrack can restore data from up to 365 days ago",
            "Backtrack rewinds the existing cluster to a prior point without creating a new instance or endpoint",
            "Backtrack can restore individual tables rather than the whole database",
            "Backtrack works for all Aurora engine types including PostgreSQL",
          ],
          correctIndex: 1,
          explanation:
            "Aurora Backtrack rewinds the existing database cluster to a prior point in time without creating a new instance — the endpoint remains the same. Standard PITR always creates a new RDS instance with a new endpoint. Backtrack is only available for Aurora MySQL.",
        },
        {
          question:
            "What is the cross-region replication lag for Aurora Global Database?",
          options: [
            "Under 100 milliseconds",
            "Under 1 second",
            "1–5 minutes",
            "Up to 15 minutes",
          ],
          correctIndex: 1,
          explanation:
            "Aurora Global Database replicates across regions with less than 1 second of lag. In the event of a regional failure, failover to a secondary region can be completed in under a minute, making it suitable for global disaster recovery scenarios.",
        },
      ],
    },
    {
      heading: "Multi-AZ & Read Replicas",
      body: `RDS offers two distinct replication features that solve different problems, and confusing them is one of the most common mistakes on the exam.

**Multi-AZ** is a high-availability feature. RDS maintains a synchronous standby replica in a different Availability Zone. Every write to the primary is synchronously confirmed on the standby before being acknowledged to the application. If the primary fails — due to hardware failure, AZ outage, or scheduled maintenance — RDS automatically updates the DNS record to point to the standby within 60–120 seconds, and the application reconnects transparently. The standby is not accessible for reads; it exists solely as a failover target. Multi-AZ adds resilience, not performance.

**Read Replicas** are for performance. They use asynchronous replication from the primary, meaning there's a small propagation lag before changes are visible on the replica. You can have up to 5 read replicas for MySQL and PostgreSQL, or up to 15 for Aurora. Read replicas have their own endpoints, so your application must be explicitly configured to direct read queries there. A read replica can be promoted to a standalone primary instance, but this breaks the replication relationship and is typically done only for failover, migration, or scaling decisions. Read replicas can span regions, enabling cross-region read scaling and providing a basis for disaster recovery.

The summary: Multi-AZ handles the case where your primary goes down. Read replicas handle the case where your primary can't keep up with query load. They're complementary, not interchangeable — and the exam frequently tests whether you know which one to recommend in a given scenario.`,
      quiz: [
        {
          question:
            "A company needs their RDS database to automatically recover from an Availability Zone failure with minimal downtime. Which feature should they enable?",
          options: [
            "Read Replicas — they provide automatic failover",
            "Multi-AZ — it provides synchronous standby and automatic failover",
            "Aurora Serverless — it handles AZ failures automatically",
            "RDS Proxy — it absorbs failover events",
          ],
          correctIndex: 1,
          explanation:
            "Multi-AZ maintains a synchronous standby replica in a different AZ. On primary failure, RDS automatically updates the DNS record to point to the standby within 60–120 seconds. Read Replicas use asynchronous replication and are for read scaling, not automatic HA failover.",
        },
        {
          question:
            "Can the Multi-AZ standby replica be used to serve read queries during normal operation?",
          options: [
            "Yes, it can serve read traffic to reduce load on the primary",
            "Yes, but only during maintenance windows",
            "No, the standby is only a failover target and is not accessible",
            "No, unless you enable the Multi-AZ Read option in the console",
          ],
          correctIndex: 2,
          explanation:
            "The Multi-AZ standby replica is NOT accessible for reads. It exists solely as an automatic failover target. If you need read scaling, you must create Read Replicas (separate instances with their own endpoints) in addition to Multi-AZ.",
        },
        {
          question:
            "What type of replication do RDS Read Replicas use, and what is the implication?",
          options: [
            "Synchronous — reads from replicas always reflect the latest writes",
            "Asynchronous — there may be a small propagation lag before changes appear on replicas",
            "Synchronous — but replicas are read-only and can't accept writes",
            "Asynchronous — data on replicas is eventually consistent with up to 5 minutes of lag",
          ],
          correctIndex: 1,
          explanation:
            "Read Replicas use asynchronous replication, meaning there is a small propagation delay before writes on the primary appear on the replica. Applications must tolerate slightly stale reads when using replicas. Multi-AZ uses synchronous replication to ensure zero data loss on failover.",
        },
      ],
    },
    {
      heading: "Backups & Restore",
      body: `RDS provides two backup mechanisms with different purposes and retention characteristics.

**Automated backups** run daily during a configurable backup window and capture transaction logs continuously throughout the day. Together, these enable **Point-in-Time Recovery (PITR)**: you can restore the database to any second within the retention window (1–35 days, defaulting to 7). The automated backup takes a full snapshot and then uses the transaction logs to replay changes to the requested time. Restores always create a new RDS instance — you cannot restore in-place on the existing instance, and the new instance will have a different endpoint. For Multi-AZ instances, the backup is taken from the standby to avoid I/O impact on the primary.

**Manual snapshots** are user-initiated and retained until you explicitly delete them, independent of the automated backup retention period. They're useful for pre-migration checkpoints, compliance archives, and cross-account or cross-region sharing — you can copy a snapshot to another region for disaster recovery or share it with another AWS account.

**Aurora Backtrack** deserves special mention as a uniquely Aurora-MySQL capability. Rather than restoring from a backup to a new instance, Backtrack rewinds the existing Aurora cluster to a previous point in time without creating a new endpoint. This is faster and operationally simpler for recovering from accidental \`DELETE\` or \`UPDATE\` statements. Finally, **RDS Snapshot Export to S3** lets you export a snapshot in Apache Parquet format for analysis with Athena — without consuming any read capacity from the live database.`,
      quiz: [
        {
          question:
            "What is the maximum automated backup retention period for Amazon RDS?",
          options: ["7 days", "14 days", "30 days", "35 days"],
          correctIndex: 3,
          explanation:
            "RDS automated backup retention can be configured from 1 to 35 days (default is 7 days). Within this window, Point-in-Time Recovery allows restoring to any second. Manual snapshots are retained indefinitely until explicitly deleted.",
        },
        {
          question:
            "When you perform a Point-in-Time Recovery restore of an RDS instance, what is created?",
          options: [
            "The existing instance is restored in-place to the target time",
            "A new RDS instance with a new endpoint is created",
            "A read replica is created from the specified point in time",
            "The existing instance is rolled back and the endpoint remains the same",
          ],
          correctIndex: 1,
          explanation:
            "RDS PITR always creates a new RDS instance with a new endpoint — it never restores in-place. Your application must be updated to point to the new endpoint after recovery. This is different from Aurora Backtrack, which rewinds the existing cluster with the same endpoint.",
        },
        {
          question:
            "For a Multi-AZ RDS instance, where does AWS take the automated backup from?",
          options: [
            "The primary instance, causing brief I/O suspension",
            "The standby replica, to avoid I/O impact on the primary",
            "A separate dedicated backup instance",
            "Alternates between primary and standby on each backup",
          ],
          correctIndex: 1,
          explanation:
            "For Multi-AZ instances, RDS takes automated backups from the standby replica to avoid I/O suspension on the primary database. This ensures automated backups do not impact production query performance.",
        },
      ],
    },
    {
      heading: "Security",
      body: `Securing an RDS instance involves four layers that should all be configured together in production.

**Encryption at rest** using KMS must be enabled at database creation time — you cannot enable it on a running instance. Once enabled, all data files, automated backups, snapshots, and read replicas are encrypted with the same KMS key. If you need to encrypt an existing unencrypted instance, the path is: take a snapshot, copy the snapshot with encryption enabled, restore a new encrypted instance from the copy. It's a three-step process and the original unencrypted instance continues running until you cut over.

**Encryption in transit** uses SSL/TLS for client connections. You can enforce TLS-only connections through parameter group settings: \`rds.force_ssl=1\` for PostgreSQL or \`require_secure_transport=ON\` for MySQL. Without enforcement, some clients may connect unencrypted, so the parameter group setting is important for compliance.

**Network isolation** is achieved by placing RDS instances in private subnets within a VPC DB subnet group. Security groups control which sources can reach the database port — typically only the application tier's security group, with no public internet access. **IAM Database Authentication** provides an alternative to username/password authentication for MySQL and PostgreSQL: you generate a short-lived authentication token using the AWS CLI or SDK (\`generate-db-auth-token\`), pass it as the database password, and the token expires after 15 minutes. This is particularly useful for Lambda functions and ECS tasks where storing database passwords in environment variables is undesirable.

**Secrets Manager** provides automatic credential rotation for RDS through built-in rotation Lambda functions. The application fetches credentials from Secrets Manager at startup, and Secrets Manager rotates the password on a schedule by updating both the RDS user's password and the secret value simultaneously.`,
      quiz: [
        {
          question:
            "An unencrypted RDS instance needs to be encrypted. What is the correct process?",
          options: [
            "Modify the instance to enable encryption — it applies with the next maintenance window",
            "Take a snapshot, copy it with encryption enabled, restore a new encrypted instance from the copy",
            "Enable encryption at the parameter group level and restart the instance",
            "Attach a KMS key to the existing instance using the RDS console",
          ],
          correctIndex: 1,
          explanation:
            "RDS encryption must be enabled at creation time and cannot be enabled on a running instance. The three-step process is: (1) take a snapshot, (2) copy the snapshot with encryption enabled specifying the KMS key, (3) restore a new encrypted instance from the encrypted snapshot.",
        },
        {
          question:
            "IAM Database Authentication tokens for RDS are valid for how long?",
          options: ["5 minutes", "15 minutes", "1 hour", "12 hours"],
          correctIndex: 1,
          explanation:
            "IAM Database Authentication tokens are valid for 15 minutes. The token is generated using generate-db-auth-token and passed as the database password. This eliminates the need to store long-term database passwords in environment variables for ephemeral workloads like Lambda.",
        },
        {
          question:
            "Which parameter enforces TLS-only connections for a PostgreSQL RDS instance?",
          options: [
            "require_secure_transport=ON",
            "rds.force_ssl=1",
            "ssl_required=true",
            "enforce_tls=1",
          ],
          correctIndex: 1,
          explanation:
            "rds.force_ssl=1 in the parameter group enforces TLS-only connections for PostgreSQL RDS instances. For MySQL, the equivalent parameter is require_secure_transport=ON. Without enforcement, clients may connect unencrypted.",
        },
      ],
    },
    {
      heading: "Performance & Scaling",
      body: `RDS scaling works differently depending on whether you're scaling compute, storage, or read capacity, and the mechanisms have different operational impacts.

**Vertical scaling** (changing the instance type) requires a reboot for most engines, causing a brief interruption. For Multi-AZ instances, you can apply the change during the maintenance window, and RDS performs the upgrade on the standby first, then fails over — minimizing downtime to the failover period rather than the full upgrade time. Aurora can perform some instance class changes without a reboot.

**Storage scaling** is one-directional: you can increase storage size but never decrease it. Enable **storage auto-scaling** to have RDS automatically expand storage when free space drops below a threshold — this prevents the "out of disk space" failure mode that would require a manual scaling operation at an inconvenient time.

**Connection pooling with RDS Proxy** is essential when your application tier generates many short-lived database connections — Lambda functions are the primary example. Lambda can have thousands of concurrent executions, each opening a new database connection, which quickly exhausts the database's connection limit and causes failures. RDS Proxy maintains a connection pool to the database and multiplexes many application connections through a smaller set of database connections. The proxy also integrates with Secrets Manager and IAM authentication, and it absorbs Multi-AZ failovers so the application sees a brief pause rather than a connection error.

**Enhanced Monitoring** provides OS-level metrics at 1-second granularity (CPU steal, per-process memory, I/O) that are not available in CloudWatch's standard RDS metrics. It's more detailed than CloudWatch's 1-minute minimum and is critical for diagnosing workload interference on shared hardware.`,
      quiz: [
        {
          question:
            "Why is RDS Proxy particularly important for Lambda functions that access RDS?",
          options: [
            "Lambda functions cannot connect to RDS directly without a proxy",
            "Lambda can create thousands of concurrent connections, exhausting RDS connection limits — Proxy pools connections",
            "RDS Proxy provides faster query execution for serverless workloads",
            "Lambda requires RDS Proxy for IAM Database Authentication to work",
          ],
          correctIndex: 1,
          explanation:
            "Lambda functions can scale to thousands of concurrent executions, each potentially opening a new database connection. This quickly exhausts the database's connection limit. RDS Proxy maintains a pooled set of connections to the database and multiplexes many Lambda connections through fewer database connections.",
        },
        {
          question:
            "Can you decrease the storage size of an RDS instance after it has been increased?",
          options: [
            "Yes, during the next maintenance window",
            "Yes, but only down to the original provisioned size",
            "No, storage scaling is one-directional — you can only increase",
            "Yes, by taking a snapshot and restoring to a smaller instance",
          ],
          correctIndex: 2,
          explanation:
            "RDS storage scaling is one-directional — you can only increase storage size, never decrease it. If you need a smaller storage allocation, you would need to create a new RDS instance with the desired size and migrate your data.",
        },
        {
          question:
            "For a Multi-AZ RDS instance, how does RDS minimize downtime during a vertical scaling (instance type change)?",
          options: [
            "It applies the change online without any reboot",
            "It upgrades the standby first, then performs a failover — minimizing downtime to the failover period",
            "It creates a read replica, promotes it, then upgrades the original",
            "It uses blue/green deployment to switch between instance types",
          ],
          correctIndex: 1,
          explanation:
            "For Multi-AZ instances, RDS applies instance type changes to the standby first, then performs a failover to make the updated standby the new primary. This minimizes downtime to just the failover period (60–120 seconds) rather than the full instance upgrade time.",
        },
      ],
    },
    {
      heading: "RDS with Other Services",
      body: `**RDS + Lambda** is a common architecture for serverless applications that need relational data, but the connection model requires care. Lambda functions can create a new database connection on every cold start, and high concurrency means many simultaneous connections. RDS Proxy solves this by pooling connections — Lambda connects to the proxy instead of the database, and the proxy manages the actual database connections. Lambda also must be deployed inside the same VPC as RDS, since RDS has no public endpoint.

**RDS + Secrets Manager** is the recommended approach for credential management. Secrets Manager stores the database username, password, host, and port as a JSON secret, and its built-in rotation Lambda function rotates the RDS user's password on a schedule without any application downtime. Applications fetch credentials via \`GetSecretValue\` at startup and implement a retry-on-auth-failure pattern to handle the brief window during rotation.

**RDS + ElastiCache** follows the lazy-loading pattern: the application checks the cache for query results before hitting the database, writes cache misses to the cache after querying, and invalidates cache keys when the underlying data changes. On read-heavy workloads this can reduce RDS query load by an order of magnitude.

**RDS + DMS (Database Migration Service)** supports migrating from on-premises databases, other cloud providers, or different database engines to RDS. DMS supports continuous replication for near-zero-downtime migrations, making it possible to migrate production databases with only seconds of final cutover downtime. **RDS + IAM Authentication** is particularly clean for containerized workloads: ECS tasks and Lambda functions can authenticate to the database using their IAM role rather than a stored password, eliminating credential management entirely.`,
      quiz: [
        {
          question:
            "A Lambda function in a VPC needs to connect to an RDS database. What is required for this to work?",
          options: [
            "The RDS instance must have a public endpoint enabled",
            "The Lambda function must be deployed in the same VPC as RDS",
            "An Internet Gateway must be configured in the VPC",
            "RDS Proxy must be used — Lambda cannot connect directly to RDS",
          ],
          correctIndex: 1,
          explanation:
            "Lambda must be configured with VPC settings (subnets and security groups) to access RDS, since RDS instances are in private subnets with no public endpoint. The Lambda function's VPC configuration must allow it to reach the RDS instance's security group.",
        },
        {
          question:
            "What pattern does RDS + ElastiCache typically use for caching database query results?",
          options: [
            "Write-through — data is written to cache and DB simultaneously",
            "Lazy-loading — check cache first, query DB on miss, write result to cache",
            "Read-ahead — pre-populate cache based on predicted access patterns",
            "Write-behind — write to cache first, sync to DB asynchronously",
          ],
          correctIndex: 1,
          explanation:
            "The lazy-loading (also called cache-aside) pattern checks the cache first; on a miss, queries the database and writes the result to the cache for future reads. This is the most common caching pattern for RDS + ElastiCache and can reduce database query load significantly on read-heavy workloads.",
        },
        {
          question:
            "What AWS service enables near-zero-downtime migration of an on-premises database to RDS?",
          options: [
            "AWS DataSync",
            "AWS Database Migration Service (DMS)",
            "AWS Snowball Edge",
            "AWS Transfer Family",
          ],
          correctIndex: 1,
          explanation:
            "AWS Database Migration Service (DMS) supports continuous replication from source to target database while the source remains online. This enables near-zero-downtime migrations with only seconds of final cutover downtime when you update the application's connection string.",
        },
      ],
    },
  ],

  keyFacts: [
    "Multi-AZ: synchronous standby in different AZ; failover 60-120s; standby NOT readable",
    "Read Replicas: asynchronous replication; readable; up to 5 (MySQL/PostgreSQL), 15 (Aurora)",
    "Cannot encrypt existing unencrypted RDS in-place: snapshot → copy with encryption → restore",
    "IAM DB Auth: token-based auth (15min validity) for MySQL/PostgreSQL — no stored password",
    "RDS Proxy: pools connections (critical for Lambda + RDS), faster failover absorption",
    "Aurora storage: auto-scales to 128 TiB; 6 copies across 3 AZs",
    "Aurora Backtrack: rewind DB to prior point (same instance, Aurora MySQL only)",
    "Automated backup retention: 1-35 days; restores create a new DB instance",
    "PITR: restore to any second within retention window",
    "Database Activity Streams: real-time audit stream to Kinesis (Aurora only)",
  ],

  relatedServices: [
    "Amazon Aurora",
    "Amazon ElastiCache",
    "AWS Lambda",
    "Amazon ECS",
    "AWS Secrets Manager",
    "AWS KMS",
    "Amazon CloudWatch",
    "Amazon VPC",
    "AWS DMS",
    "Amazon Kinesis",
  ],

  examTips: [
    "Multi-AZ = HA (failover). Read Replica = performance (read scaling). Not interchangeable.",
    "Multi-AZ standby is NOT readable — it's only a failover target.",
    "Encrypt existing unencrypted RDS: snapshot → encrypted copy → restore (3 steps).",
    "RDS Proxy: reduces Lambda connection exhaustion; faster failover for applications.",
    "IAM DB Auth: generate token with CLI; valid 15 min; great for ephemeral workloads.",
    "Aurora Serverless v2: scales instantly without cold start issues of v1.",
    "Aurora Global Database: < 1 second cross-region replication for global DR.",
    "force_ssl parameter: require TLS connections to prevent unencrypted DB access.",
    "Backtrack: Aurora MySQL only; rewinds same instance — no new endpoint needed.",
  ],

  topicQuiz: [
    {
      question:
        "A read-heavy application is overwhelming the primary RDS instance. Which feature addresses this?",
      options: [
        "Enable Multi-AZ to distribute read traffic to the standby",
        "Create Read Replicas and configure the application to send reads to them",
        "Enable storage auto-scaling to handle more read capacity",
        "Use RDS Proxy to pool read connections on the primary",
      ],
      correctIndex: 1,
      explanation:
        "Read Replicas are designed for read scaling — they use asynchronous replication and provide their own endpoints for read queries. The Multi-AZ standby is not accessible for reads; it only serves as a failover target.",
    },
    {
      question:
        "Which RDS feature provides synchronous replication and automatic DNS failover within 60–120 seconds?",
      options: [
        "Read Replicas with automatic promotion",
        "Multi-AZ deployment",
        "Aurora Global Database",
        "RDS Proxy with failover absorption",
      ],
      correctIndex: 1,
      explanation:
        "Multi-AZ uses synchronous replication to a standby in a different AZ. On primary failure, RDS automatically updates the DNS record to point to the standby within 60–120 seconds. Applications using the RDS endpoint reconnect transparently.",
    },
    {
      question:
        "You need to migrate an existing unencrypted RDS instance to use KMS encryption. What is the correct sequence?",
      options: [
        "Enable encryption in Modify Instance → apply immediately",
        "Snapshot → copy snapshot with encryption → restore new encrypted instance",
        "Enable encryption at the storage level → restart the instance",
        "Create a read replica with encryption → promote the replica",
      ],
      correctIndex: 1,
      explanation:
        "RDS encryption cannot be enabled on a running instance. The three-step process is: (1) create a snapshot of the unencrypted instance, (2) copy the snapshot specifying a KMS key (which creates an encrypted copy), (3) restore a new RDS instance from the encrypted snapshot.",
    },
    {
      question:
        "Lambda functions are causing too many connections to an Aurora database, leading to errors. What is the recommended solution?",
      options: [
        "Increase Lambda reserved concurrency to limit connections",
        "Use RDS Proxy to pool connections between Lambda and Aurora",
        "Switch from Aurora to DynamoDB for better Lambda compatibility",
        "Increase Aurora's max_connections parameter",
      ],
      correctIndex: 1,
      explanation:
        "RDS Proxy pools connections to Aurora and multiplexes thousands of Lambda connections through a smaller set of database connections. This prevents connection exhaustion caused by Lambda's potentially high concurrency, and the proxy also absorbs failover events.",
    },
    {
      question:
        "What is the maximum automated backup retention period for RDS?",
      options: ["7 days", "14 days", "30 days", "35 days"],
      correctIndex: 3,
      explanation:
        "RDS automated backup retention can be set from 1 to 35 days. The default is 7 days. Within the retention window, Point-in-Time Recovery allows restoring to any second. Manual snapshots are kept indefinitely until explicitly deleted.",
    },
    {
      question:
        "Aurora Backtrack is available for which database engine and what makes it unique?",
      options: [
        "Aurora PostgreSQL — it creates a new instance from a snapshot faster than standard PITR",
        "Aurora MySQL — it rewinds the existing cluster to a prior time without creating a new instance",
        "All Aurora engines — it provides faster PITR than standard automated backups",
        "Aurora MySQL — it requires a separate backtrack-enabled replica to be running",
      ],
      correctIndex: 1,
      explanation:
        "Aurora Backtrack is available only for Aurora MySQL. Its key advantage is that it rewinds the existing Aurora cluster in-place to a previous point in time — the database stays on the same instance with the same endpoint. Standard PITR always creates a new instance with a new endpoint.",
    },
    {
      question:
        "Which RDS authentication method generates a short-lived token valid for 15 minutes, eliminating stored passwords?",
      options: [
        "Secrets Manager dynamic credentials",
        "IAM Database Authentication",
        "KMS token authentication",
        "Cognito identity federation for RDS",
      ],
      correctIndex: 1,
      explanation:
        "IAM Database Authentication generates a short-lived authentication token (valid for 15 minutes) using the AWS CLI or SDK generate-db-auth-token command. The token is passed as the database password, eliminating the need to store long-term credentials for MySQL and PostgreSQL RDS instances.",
    },
    {
      question: "Aurora Global Database is designed for which use case?",
      options: [
        "Distributing read traffic across multiple AZs within a region",
        "Cross-region replication with under 1 second lag for global reads and disaster recovery",
        "Scaling write capacity across multiple primary nodes in one region",
        "Providing point-in-time recovery across multiple regions simultaneously",
      ],
      correctIndex: 1,
      explanation:
        "Aurora Global Database replicates across AWS regions with less than 1 second of lag. It enables global read performance (local reads in each region) and cross-region disaster recovery with failover in under a minute, making it ideal for globally distributed applications.",
    },
  ],
};
