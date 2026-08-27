import { ServiceGuide } from "../../../types/guide";

export const rdsGuide: ServiceGuide = {
  id: "saa-rds",
  service: "Amazon RDS",
  domain: "services",
  tagline:
    "Managed relational databases with automated operations and built-in HA",
  intro:
    "Amazon Relational Database Service (RDS) manages the operational complexity of relational databases — provisioning, patching, backups, monitoring, and failover — so architects can focus on schema design and query optimization rather than database administration.",

  sections: [
    {
      heading: "Supported Engines and When to Use RDS",
      body: `RDS supports MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Amazon Aurora (MySQL- and PostgreSQL-compatible). Choosing RDS over a self-managed database on EC2 is appropriate when you want automated backups, patching, multi-AZ failover, and read replica management without writing your own operational playbooks. Use RDS for OLTP workloads with well-defined schemas, foreign key relationships, complex transactions, and SQL query requirements. Aurora is AWS's cloud-native relational engine that stores data across three Availability Zones in a shared cluster volume, offering up to five times the throughput of standard MySQL and three times that of standard PostgreSQL — it is the preferred engine for most new relational workloads on AWS. Choose RDS over DynamoDB when your workload requires joins, transactions across multiple tables, or complex aggregations that are natural in SQL.`,
      quiz: [
        {
          question:
            "A new application requires a relational database with complex multi-table transactions and SQL joins. The team wants automated backups, patching, and high availability without managing database infrastructure. Which service should they choose?",
          options: [
            "Amazon DynamoDB with transactions enabled",
            "Amazon RDS (or Aurora) for managed relational database operations",
            "A self-managed MySQL database on EC2 for full control",
            "Amazon Redshift for SQL query support",
          ],
          correctIndex: 1,
          explanation:
            "Amazon RDS (or Aurora) is the right choice for OLTP workloads requiring SQL joins, multi-table transactions, and complex queries, combined with managed operations like automated backups, patching, and Multi-AZ failover. DynamoDB is NoSQL and does not support SQL joins natively. Redshift is for data warehousing, not OLTP.",
        },
        {
          question:
            "Amazon Aurora differs from standard RDS MySQL in which key architectural way?",
          options: [
            "Aurora uses in-memory caching that standard MySQL does not support",
            "Aurora stores data across three Availability Zones in a shared cluster volume, providing six copies of data",
            "Aurora requires manual patching while standard RDS is automated",
            "Aurora supports more concurrent connections than standard RDS MySQL",
          ],
          correctIndex: 1,
          explanation:
            "Aurora's shared cluster volume replicates data six times across three Availability Zones, providing higher durability and near-zero replication lag to Aurora replicas. Standard RDS MySQL uses asynchronous replication to read replicas and synchronous replication to the Multi-AZ standby. This architecture enables Aurora to offer up to 5x the throughput of standard MySQL.",
        },
      ],
    },
    {
      heading: "Multi-AZ Deployments for High Availability",
      body: `Multi-AZ deployments provide automatic failover to a standby replica in a different Availability Zone. AWS maintains a synchronously replicated standby instance that shares the same connection endpoint as the primary; if the primary fails due to hardware failure, AZ disruption, or during maintenance, RDS automatically promotes the standby and updates the DNS endpoint within 60–120 seconds. During this failover window, in-flight transactions are lost and connections must be retried — applications should implement retry logic with exponential backoff. The standby replica does not serve read traffic; it exists solely for failover. Multi-AZ is not a scaling solution — it is a durability and availability solution. For Aurora, Multi-AZ is intrinsic to the storage architecture: the shared cluster volume replicates six copies of data across three AZs, and Aurora replicas double as both read scale-out targets and automatic failover candidates.`,
      quiz: [
        {
          question:
            "Can the Multi-AZ standby instance in a standard RDS deployment serve read traffic?",
          options: [
            "Yes, it serves read traffic to reduce load on the primary",
            "Yes, but only during peak hours when enabled in the console",
            "No, the standby exists solely for automatic failover",
            "No, unless the instance is manually promoted to a read replica",
          ],
          correctIndex: 2,
          explanation:
            "The Multi-AZ standby instance does not serve read traffic. It exists purely for automatic failover — it is a synchronously replicated hot standby that takes over if the primary fails. To scale read traffic, you must create separate read replicas (which use asynchronous replication). This is a key exam distinction: Multi-AZ = HA, Read Replicas = read scaling.",
        },
        {
          question:
            "How long does an RDS Multi-AZ automatic failover typically take?",
          options: [
            "1–5 seconds",
            "10–30 seconds",
            "60–120 seconds",
            "5–10 minutes",
          ],
          correctIndex: 2,
          explanation:
            "An RDS Multi-AZ failover typically completes within 60–120 seconds. During this window, RDS promotes the standby and updates the DNS endpoint. In-flight transactions are lost and connections must be retried. Applications should implement retry logic with exponential backoff to handle this failover period.",
        },
        {
          question:
            "How does Aurora's Multi-AZ approach differ from standard RDS Multi-AZ?",
          options: [
            "Aurora Multi-AZ requires a separate standby instance like standard RDS",
            "Aurora's shared cluster volume inherently stores six copies across three AZs, and Aurora replicas serve both reads and failover",
            "Aurora Multi-AZ is not supported — it is only available for standard RDS",
            "Aurora Multi-AZ uses synchronous replication to a single standby, not six copies",
          ],
          correctIndex: 1,
          explanation:
            "Aurora's architecture is fundamentally different: the shared cluster volume always replicates data six times across three AZs as part of its core design. Aurora replicas read from this shared volume and can serve both read traffic and act as automatic failover candidates, unlike the standard RDS standby which can only serve as a failover target.",
        },
      ],
    },
    {
      heading: "Read Replicas for Read Scalability",
      body: `Read replicas extend RDS read capacity by maintaining asynchronously replicated copies of the primary database that can serve SELECT queries. RDS supports up to five read replicas per primary instance for MySQL, MariaDB, and PostgreSQL, while Aurora supports up to fifteen replicas with a shared cluster volume that makes replication lag near-zero. Read replicas can be promoted to standalone primary instances for disaster recovery or regional migration, though promotion requires application connection string changes. Cross-region read replicas support disaster recovery strategies and bring data closer to globally distributed users. Because replication is asynchronous, read replicas may lag behind the primary — architects must design applications to tolerate eventual consistency when routing reads to replicas. Aurora Global Database extends this pattern across regions with typically less than one second replication lag and supports a managed failover to a secondary region in under a minute.`,
      quiz: [
        {
          question:
            "A read-heavy application is overwhelming the RDS primary database. What should be added to scale read capacity?",
          options: [
            "Additional Multi-AZ standby instances",
            "Read replicas connected to the primary with asynchronous replication",
            "Increase the primary instance size to handle more connections",
            "Enable RDS Proxy to pool connections",
          ],
          correctIndex: 1,
          explanation:
            "Read replicas provide additional read capacity by maintaining asynchronously replicated copies of the primary that serve SELECT queries. Standard RDS supports up to 5 read replicas per primary; Aurora supports up to 15. Applications must route read queries to the replica endpoints. Multi-AZ standbys do not serve reads.",
        },
        {
          question:
            "What is a key consideration when routing SELECT queries to RDS read replicas?",
          options: [
            "Read replicas use different storage formats that require special query syntax",
            "Read replicas may lag behind the primary due to asynchronous replication — applications must tolerate eventual consistency",
            "Read replicas can only serve read queries from the same AWS account",
            "Queries routed to read replicas count against the primary's connection limit",
          ],
          correctIndex: 1,
          explanation:
            "Because read replica replication is asynchronous, replicas may lag behind the primary by some amount. Applications reading from replicas may see slightly stale data and must be designed to tolerate eventual consistency. Aurora's shared cluster volume minimizes this lag to near-zero, but standard RDS replicas can have more significant lag under heavy write load.",
        },
      ],
    },
    {
      heading: "Backups, Snapshots, and Point-in-Time Recovery",
      body: `RDS performs automated backups daily during a configurable backup window, retaining transaction logs continuously to support Point-in-Time Recovery (PITR) to any second within the retention period (1–35 days). Automated backups are stored in S3 and are deleted when you delete the RDS instance unless you create a final snapshot. Manual DB snapshots are user-initiated and retained until explicitly deleted — use them before major schema changes or application deployments as a rollback point. Restoring from a snapshot or PITR creates a new RDS instance; you cannot restore into the existing instance. The \`RDS Restore to Point in Time\` operation supports recovery to the last five minutes of activity. For Aurora, backtrack lets you rewind the cluster to a specific time in-place without creating a new cluster — this is faster than restore but limited to a configurable backtrack window.`,
      quiz: [
        {
          question:
            "An engineer accidentally runs a DROP TABLE statement on an RDS database. How can they recover the data to 5 minutes before the accidental deletion?",
          options: [
            "Promote a read replica that has the pre-deletion data",
            "Use Point-in-Time Recovery to restore the database to 5 minutes before the deletion",
            "Restore from the most recent daily automated backup",
            "Use the Multi-AZ standby which was not affected by the DROP statement",
          ],
          correctIndex: 1,
          explanation:
            "Point-in-Time Recovery (PITR) allows restoration to any second within the automated backup retention period, including 5 minutes before the accidental DELETE. PITR creates a new RDS instance from the automated backups and transaction logs. Restoring from a daily backup would lose up to a full day of data. The Multi-AZ standby replicates all changes synchronously and would also have the DROP TABLE applied.",
        },
        {
          question:
            "What is the maximum automated backup retention period for Amazon RDS?",
          options: ["7 days", "14 days", "35 days", "365 days"],
          correctIndex: 2,
          explanation:
            "RDS automated backups can be retained for 1 to 35 days. The retention period determines how far back you can perform Point-in-Time Recovery. Manual snapshots are retained indefinitely until explicitly deleted and are not affected by the automated backup retention setting.",
        },
        {
          question:
            "When restoring an RDS instance from a snapshot, what is created?",
          options: [
            "The existing instance is updated in-place with the snapshot data",
            "A new RDS instance is created — the original instance is not modified",
            "A read replica is created from the snapshot",
            "The snapshot data is applied as a patch to the running instance",
          ],
          correctIndex: 1,
          explanation:
            "Restoring from an RDS snapshot always creates a new RDS instance with a new endpoint. You cannot restore data in-place into an existing running instance. After the restore completes, you must update application connection strings to point to the new instance, or use a CNAME to redirect traffic.",
        },
      ],
    },
    {
      heading: "Security: Encryption, IAM, and Network Isolation",
      body: `RDS instances should reside in private subnets within a VPC, reachable only from application tier security groups — they should never have public internet accessibility unless a specific use case demands it, and even then with strict IP restrictions. Encryption at rest uses AWS KMS: enabling encryption on an RDS instance encrypts the underlying storage, automated backups, read replicas, and snapshots. Encryption cannot be added to an existing unencrypted instance; the migration path is to take a snapshot, copy it with encryption enabled, and restore from the encrypted snapshot. In-transit encryption uses SSL/TLS for connections to RDS — enforce it by using the \`REQUIRE SSL\` constraint in MySQL or the \`sslmode=require\` parameter in PostgreSQL. IAM database authentication allows connecting to MySQL and PostgreSQL RDS instances using an IAM authentication token instead of a static password, which rotates every 15 minutes and eliminates the risk of credential leakage.`,
      quiz: [
        {
          question:
            "An existing unencrypted RDS instance needs to be encrypted at rest. What is the correct migration path?",
          options: [
            "Enable encryption in the RDS console on the running instance",
            "Take a snapshot, copy the snapshot with encryption enabled, then restore from the encrypted snapshot",
            "Enable AWS KMS on the VPC where the RDS instance resides",
            "Apply an SSL certificate to the running instance to enable at-rest encryption",
          ],
          correctIndex: 1,
          explanation:
            "RDS encryption at rest cannot be enabled on an existing unencrypted instance — it must be set at creation time. The migration path is: (1) take a snapshot of the unencrypted instance, (2) copy the snapshot with encryption enabled using a KMS key, (3) restore a new RDS instance from the encrypted snapshot. The application must then be updated to use the new instance endpoint.",
        },
        {
          question:
            "What is the benefit of IAM database authentication for RDS MySQL/PostgreSQL compared to static passwords?",
          options: [
            "IAM authentication provides faster query execution than password authentication",
            "IAM authentication tokens rotate automatically every 15 minutes, eliminating long-lived credential exposure risk",
            "IAM authentication bypasses VPC security group rules for database connections",
            "IAM authentication enables read replica promotion without manual steps",
          ],
          correctIndex: 1,
          explanation:
            "IAM database authentication generates short-lived authentication tokens that rotate every 15 minutes. This eliminates the risk of long-lived static password exposure. Connections are authenticated via the AWS SDK's token generation mechanism, and no static database password needs to be stored in application configuration or Secrets Manager.",
        },
      ],
    },
    {
      heading: "RDS Proxy for Connection Management",
      body: `Applications with many short-lived connections — particularly serverless Lambda functions — can exhaust RDS connection limits, causing errors and performance degradation. RDS Proxy sits between the application and the database, pooling and sharing connections so that thousands of concurrent Lambda invocations share a much smaller number of actual database connections. RDS Proxy also improves failover time by maintaining connections during a Multi-AZ failover and reconnecting applications without requiring them to detect the new endpoint. Proxy supports IAM authentication and Secrets Manager for credential rotation without restarting the proxy. For Lambda-to-RDS architectures, RDS Proxy is the recommended integration layer that prevents connection storms and reduces failover impact on serverless workloads.`,
      quiz: [
        {
          question:
            "A Lambda function scales to 500 concurrent executions, each opening a new database connection to RDS. The database reaches its connection limit and starts failing requests. What should be added to resolve this?",
          options: [
            "Increase the Lambda reserved concurrency to 250 to reduce connections",
            "Add an RDS Proxy between Lambda and RDS to pool and share connections",
            "Upgrade to a larger RDS instance class with more connection capacity",
            "Use DynamoDB instead of RDS to handle the concurrent access",
          ],
          correctIndex: 1,
          explanation:
            "RDS Proxy pools database connections so that many Lambda invocations share a smaller number of actual database connections. This prevents the connection storm that occurs when hundreds of Lambda functions each open their own connection. RDS Proxy is the AWS-recommended solution for Lambda-to-RDS architectures.",
        },
        {
          question:
            "In addition to connection pooling, what other benefit does RDS Proxy provide during a Multi-AZ failover?",
          options: [
            "It prevents the failover from occurring by keeping the primary healthy",
            "It maintains connections during the failover and reconnects applications without requiring endpoint changes",
            "It promotes a read replica to primary faster than standard failover",
            "It replicates in-flight transactions to the standby before failover",
          ],
          correctIndex: 1,
          explanation:
            "During a Multi-AZ failover, RDS Proxy maintains the connection pool and handles the reconnection to the new primary transparently. Applications connected through the proxy do not need to detect the failover or update their connection strings — the proxy handles the transition, reducing failover impact on application availability.",
        },
      ],
    },
  ],

  keyFacts: [
    "RDS supports MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, and Amazon Aurora",
    "Multi-AZ uses synchronous replication for automatic failover — standby does not serve reads",
    "Read replicas use asynchronous replication for read scaling — up to 5 (MySQL/PG) or 15 (Aurora)",
    "Automated backups retain transaction logs for PITR up to 35 days",
    "Snapshots are manual, retained until deleted, and trigger a new instance on restore",
    "Encryption at rest must be enabled at creation — encrypted snapshot copy is the migration path",
    "RDS Proxy pools connections — critical for Lambda-to-RDS architectures",
    "Aurora stores 6 copies across 3 AZs in a shared cluster volume with near-zero replica lag",
    "Aurora Global Database provides cross-region replication with sub-second lag",
    "IAM database authentication rotates tokens every 15 minutes — eliminates static password risk",
  ],

  relatedServices: [
    "Amazon Aurora",
    "AWS RDS Proxy",
    "AWS KMS",
    "AWS Lambda",
    "Amazon VPC",
    "AWS Secrets Manager",
  ],

  examTips: [
    "Multi-AZ = high availability with automatic failover; Read Replica = read scalability — these are different features",
    "Multi-AZ standby does not serve reads — only Aurora replicas can serve reads and act as failover targets",
    "Automated backup retention is 1–35 days; snapshots persist until manually deleted",
    "Cannot enable encryption on an existing unencrypted instance — snapshot → encrypted copy → restore",
    "Cross-region read replicas support DR and global read distribution but have replication lag",
    "RDS Proxy is the answer when Lambda exhausts RDS connection limits",
    "Aurora Serverless v2 scales capacity in fine-grained increments — best for variable or unknown workloads",
    "For questions about connection pooling with failover, RDS Proxy handles both simultaneously",
  ],

  topicQuiz: [
    {
      question:
        "Can the Multi-AZ standby instance for a standard RDS deployment serve read queries?",
      options: [
        "Yes, it serves reads to reduce primary load",
        "Yes, but only when explicitly configured",
        "No, the standby exists solely for automatic failover",
        "No, only during maintenance windows",
      ],
      correctIndex: 2,
      explanation:
        "The Multi-AZ standby instance does not serve any read traffic. It is a synchronously replicated hot standby whose only purpose is automatic failover. To scale reads, you must create separate read replicas. This is a fundamental distinction tested frequently on the SAA-C03 exam.",
    },
    {
      question:
        "A company needs to migrate an existing unencrypted RDS instance to encrypted storage. What is the correct process?",
      options: [
        "Enable KMS encryption in the RDS instance settings panel",
        "Take a snapshot, copy it with encryption enabled, and restore a new instance from the encrypted snapshot",
        "Apply an SSL certificate to encrypt the existing instance's storage",
        "Use AWS DMS to migrate data to a new encrypted RDS instance without downtime",
      ],
      correctIndex: 1,
      explanation:
        "Encryption cannot be enabled on an existing unencrypted RDS instance. The only path is: take a snapshot of the unencrypted instance, copy that snapshot with encryption enabled (specifying a KMS key), then restore a new RDS instance from the encrypted snapshot. DMS could work but is not the simplest approach for this migration.",
    },
    {
      question:
        "Which RDS feature allows recovery to any point in time within the backup retention period?",
      options: [
        "Manual snapshot restore",
        "Aurora Backtrack",
        "Point-in-Time Recovery (PITR)",
        "Multi-AZ standby promotion",
      ],
      correctIndex: 2,
      explanation:
        "Point-in-Time Recovery (PITR) uses automated backups and continuously retained transaction logs to restore the database to any second within the retention period (up to 35 days). It always restores to a new RDS instance. Aurora Backtrack rewinds in-place but is specific to Aurora and has a configurable maximum backtrack window.",
    },
    {
      question:
        "A Lambda-based application scales to 800 concurrent executions, each opening a direct connection to an RDS MySQL instance. The database starts rejecting connections. What resolves this?",
      options: [
        "Enable Multi-AZ to share connection load between primary and standby",
        "Add RDS Proxy between Lambda and RDS to pool and share connections",
        "Increase Lambda reserved concurrency limit to 400 to reduce connections",
        "Switch to Aurora to support more concurrent connections",
      ],
      correctIndex: 1,
      explanation:
        "RDS Proxy pools database connections so many Lambda invocations share a much smaller number of actual database connections. It is the AWS-recommended solution for Lambda-to-RDS architectures where connection storms occur due to Lambda's rapid horizontal scaling. Multi-AZ does not help with connection limits.",
    },
    {
      question:
        "What is the maximum number of read replicas supported by Amazon Aurora?",
      options: ["5 replicas", "10 replicas", "15 replicas", "20 replicas"],
      correctIndex: 2,
      explanation:
        "Amazon Aurora supports up to 15 read replicas per cluster, compared to 5 for standard RDS MySQL and PostgreSQL. Aurora replicas read from the shared cluster volume with near-zero lag and can also serve as automatic failover targets, unlike standard RDS read replicas which use asynchronous replication.",
    },
    {
      question:
        "How does IAM database authentication improve security compared to static database passwords?",
      options: [
        "IAM tokens never expire and provide permanent access",
        "IAM tokens rotate every 15 minutes, eliminating long-lived credential exposure",
        "IAM authentication encrypts queries in transit using a separate key",
        "IAM authentication removes the need for VPC security groups on the database",
      ],
      correctIndex: 1,
      explanation:
        "IAM database authentication tokens have a 15-minute expiration and are generated dynamically using AWS credentials. This eliminates the need to store long-lived static passwords in application configuration or secrets managers, reducing the risk of credential leakage.",
    },
    {
      question: "What does restoring an RDS database from a snapshot create?",
      options: [
        "An in-place restore of the existing RDS instance to the snapshot state",
        "A new RDS instance with a new endpoint that contains the snapshot data",
        "A read replica of the original instance pre-populated with snapshot data",
        "A temporary rollback of the existing instance that can be cancelled",
      ],
      correctIndex: 1,
      explanation:
        "Restoring from an RDS snapshot always creates a new RDS instance with a new DNS endpoint. The original instance (if it still exists) is not modified. Applications must be updated to use the new endpoint, or a CNAME record can be updated to redirect traffic. You cannot restore in-place into a running instance.",
    },
    {
      question:
        "Which Aurora feature allows rewinding the database cluster to a specific past point in time without creating a new cluster?",
      options: [
        "Point-in-Time Recovery",
        "Aurora Backtrack",
        "Aurora Global Database rollback",
        "Aurora Serverless snapshot restore",
      ],
      correctIndex: 1,
      explanation:
        "Aurora Backtrack rewinds the Aurora cluster to a specific point in time in-place without creating a new cluster. This is faster than PITR (which creates a new instance) but is limited to the configured backtrack window. Backtrack is Aurora-specific and not available for standard RDS engines.",
    },
  ],
};
