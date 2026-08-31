import { ServiceGuide } from "../../types/guide";

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

Aurora's performance advantage comes from a fundamentally different storage architecture. Rather than replicating at the instance level, Aurora replicates at the storage level: six copies of your data are maintained across three Availability Zones automatically, with the storage auto-scaling in 10 GiB increments up to 128 TiB. You can attach up to 15 Aurora Read Replicas with sub-10ms replica lag, and automated failover to a replica completes in under 30 seconds.

For global applications and disaster recovery, **Aurora Global Database** replicates across regions with less than one second of lag, enabling failover to a secondary region in under a minute. **Aurora Serverless v2** scales capacity in fine-grained ACU (Aurora Capacity Unit) increments and scales to near-zero when idle — v2 addressed the cold-start latency problems that made v1 impractical for latency-sensitive workloads. **Aurora Multi-Master** allows multiple write nodes across AZs for active-active write scenarios. One Aurora-specific feature worth knowing for the exam is **Backtrack**: it can rewind an Aurora MySQL database to a specific point in time without restoring from a backup — the database stays on the same instance with the same endpoint.`,
    },
    {
      heading: "Multi-AZ & Read Replicas",
      body: `RDS offers two distinct replication features that solve different problems, and confusing them is one of the most common mistakes on the exam.

**Multi-AZ** is a high-availability feature. RDS maintains a synchronous standby replica in a different Availability Zone. Every write to the primary is synchronously confirmed on the standby before being acknowledged to the application. If the primary fails — due to hardware failure, AZ outage, or scheduled maintenance — RDS automatically updates the DNS record to point to the standby within 60–120 seconds, and the application reconnects transparently. The standby is not accessible for reads; it exists solely as a failover target. Multi-AZ adds resilience, not performance.

**Read Replicas** are for performance. They use asynchronous replication from the primary, meaning there's a small propagation lag before changes are visible on the replica. You can have up to 5 read replicas for MySQL and PostgreSQL, or up to 15 for Aurora. Read replicas have their own endpoints, so your application must be explicitly configured to direct read queries there. A read replica can be promoted to a standalone primary instance, but this breaks the replication relationship and is typically done only for failover, migration, or scaling decisions. Read replicas can span regions, enabling cross-region read scaling and providing a basis for disaster recovery.

The summary: Multi-AZ handles the case where your primary goes down. Read replicas handle the case where your primary can't keep up with query load. They're complementary, not interchangeable — and the exam frequently tests whether you know which one to recommend in a given scenario.`,
    },
    {
      heading: "Backups & Restore",
      body: `RDS provides two backup mechanisms with different purposes and retention characteristics.

**Automated backups** run daily during a configurable backup window and capture transaction logs continuously throughout the day. Together, these enable **Point-in-Time Recovery (PITR)**: you can restore the database to any second within the retention window (1–35 days, defaulting to 7). The automated backup takes a full snapshot and then uses the transaction logs to replay changes to the requested time. Restores always create a new RDS instance — you cannot restore in-place on the existing instance, and the new instance will have a different endpoint. For Multi-AZ instances, the backup is taken from the standby to avoid I/O impact on the primary.

**Manual snapshots** are user-initiated and retained until you explicitly delete them, independent of the automated backup retention period. They're useful for pre-migration checkpoints, compliance archives, and cross-account or cross-region sharing — you can copy a snapshot to another region for disaster recovery or share it with another AWS account.

**Aurora Backtrack** deserves special mention as a uniquely Aurora-MySQL capability. Rather than restoring from a backup to a new instance, Backtrack rewinds the existing Aurora cluster to a previous point in time without creating a new endpoint. This is faster and operationally simpler for recovering from accidental \`DELETE\` or \`UPDATE\` statements. Finally, **RDS Snapshot Export to S3** lets you export a snapshot in Apache Parquet format for analysis with Athena — without consuming any read capacity from the live database.`,
    },
    {
      heading: "Security",
      body: `Securing an RDS instance involves four layers that should all be configured together in production.

**Encryption at rest** using KMS must be enabled at database creation time — you cannot enable it on a running instance. Once enabled, all data files, automated backups, snapshots, and read replicas are encrypted with the same KMS key. If you need to encrypt an existing unencrypted instance, the path is: take a snapshot, copy the snapshot with encryption enabled, restore a new encrypted instance from the copy. It's a three-step process and the original unencrypted instance continues running until you cut over.

**Encryption in transit** uses SSL/TLS for client connections. You can enforce TLS-only connections through parameter group settings: \`rds.force_ssl=1\` for PostgreSQL or \`require_secure_transport=ON\` for MySQL. Without enforcement, some clients may connect unencrypted, so the parameter group setting is important for compliance.

**Network isolation** is achieved by placing RDS instances in private subnets within a VPC DB subnet group. Security groups control which sources can reach the database port — typically only the application tier's security group, with no public internet access. **IAM Database Authentication** provides an alternative to username/password authentication for MySQL and PostgreSQL: you generate a short-lived authentication token using the AWS CLI or SDK (\`generate-db-auth-token\`), pass it as the database password, and the token expires after 15 minutes. This is particularly useful for Lambda functions and ECS tasks where storing database passwords in environment variables is undesirable.

\`\`\`typescript
import { RDSClient } from "@aws-sdk/client-rds";
import { Signer } from "@aws-sdk/rds-signer";
import { Client } from "pg";

const signer = new Signer({
  hostname: process.env.DB_HOST!,
  port: 5432,
  region: "us-east-1",
  username: "iam_user",
});

// Token is valid for 15 minutes — generate before each connection
const token = await signer.getAuthToken();

const db = new Client({
  host: process.env.DB_HOST,
  port: 5432,
  database: "mydb",
  user: "iam_user",
  password: token, // IAM token used as the password
  ssl: { rejectUnauthorized: true }, // TLS required for IAM auth
});
await db.connect();
\`\`\`

**Secrets Manager** provides automatic credential rotation for RDS through built-in rotation Lambda functions. The application fetches credentials from Secrets Manager at startup, and Secrets Manager rotates the password on a schedule by updating both the RDS user's password and the secret value simultaneously.`,
    },
    {
      heading: "Performance & Scaling",
      body: `RDS scaling works differently depending on whether you're scaling compute, storage, or read capacity, and the mechanisms have different operational impacts.

**Vertical scaling** (changing the instance type) requires a reboot for most engines, causing a brief interruption. For Multi-AZ instances, you can apply the change during the maintenance window, and RDS performs the upgrade on the standby first, then fails over — minimizing downtime to the failover period rather than the full upgrade time. Aurora can perform some instance class changes without a reboot.

**Storage scaling** is one-directional: you can increase storage size but never decrease it. Enable **storage auto-scaling** to have RDS automatically expand storage when free space drops below a threshold — this prevents the "out of disk space" failure mode that would require a manual scaling operation at an inconvenient time.

**Connection pooling with RDS Proxy** is essential when your application tier generates many short-lived database connections — Lambda functions are the primary example. Lambda can have thousands of concurrent executions, each opening a new database connection, which quickly exhausts the database's connection limit and causes failures. RDS Proxy maintains a connection pool to the database and multiplexes many application connections through a smaller set of database connections. The proxy also integrates with Secrets Manager and IAM authentication, and it absorbs Multi-AZ failovers so the application sees a brief pause rather than a connection error.

**Enhanced Monitoring** provides OS-level metrics at 1-second granularity (CPU steal, per-process memory, I/O) that are not available in CloudWatch's standard RDS metrics. It's more detailed than CloudWatch's 1-minute minimum and is critical for diagnosing workload interference on shared hardware.`,
    },
    {
      heading: "RDS with Other Services",
      body: `**RDS + Lambda** is a common architecture for serverless applications that need relational data, but the connection model requires care. Lambda functions can create a new database connection on every cold start, and high concurrency means many simultaneous connections. RDS Proxy solves this by pooling connections — Lambda connects to the proxy instead of the database, and the proxy manages the actual database connections. Lambda also must be deployed inside the same VPC as RDS, since RDS has no public endpoint.

**RDS + Secrets Manager** is the recommended approach for credential management. Secrets Manager stores the database username, password, host, and port as a JSON secret, and its built-in rotation Lambda function rotates the RDS user's password on a schedule without any application downtime. Applications fetch credentials via \`GetSecretValue\` at startup and implement a retry-on-auth-failure pattern to handle the brief window during rotation.

**RDS + ElastiCache** follows the lazy-loading pattern: the application checks the cache for query results before hitting the database, writes cache misses to the cache after querying, and invalidates cache keys when the underlying data changes. On read-heavy workloads this can reduce RDS query load by an order of magnitude.

**RDS + DMS (Database Migration Service)** supports migrating from on-premises databases, other cloud providers, or different database engines to RDS. DMS supports continuous replication for near-zero-downtime migrations, making it possible to migrate production databases with only seconds of final cutover downtime. **RDS + IAM Authentication** is particularly clean for containerized workloads: ECS tasks and Lambda functions can authenticate to the database using their IAM role rather than a stored password, eliminating credential management entirely.`,
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
};
