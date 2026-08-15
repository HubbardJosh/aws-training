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
      body: `**Standard RDS engines**: MySQL, PostgreSQL, MariaDB, Oracle, Microsoft SQL Server.

**Amazon Aurora**: AWS-built relational engine compatible with MySQL and PostgreSQL.
- Up to 5x faster than MySQL, 3x faster than PostgreSQL
- Storage auto-scales up to 128 TiB in 10 GiB increments
- 6 copies of data across 3 AZs (storage-level replication, not instance-level)
- Up to 15 Aurora Read Replicas with sub-10ms replica lag
- Automated failover to a replica in < 30 seconds
- Aurora Global Database: replicate across regions with < 1 second latency
- Aurora Serverless v2: scales capacity in fine-grained increments; scales to zero (v1 had cold start issues)
- Aurora Multi-Master: multiple write nodes (active-active writes across AZs)
- **Backtrack**: rewind the database to a previous point in time without restoring from backup (Aurora MySQL only)

**Choosing Aurora vs RDS**: for new workloads, Aurora is generally preferred for performance, HA, and storage auto-scaling. Use standard engines when you need specific engine versions or licensing constraints.`,
    },
    {
      heading: "Multi-AZ & Read Replicas",
      body: `**Multi-AZ**: synchronous replication to a standby instance in a different AZ. Automatic failover on:
- Primary instance failure
- AZ failure
- Maintenance
- Manual failover trigger

Failover time: 60–120 seconds (DNS record updated to point to standby). The standby is NOT available for reads — it's only for failover. **Purpose: high availability, not performance**.

**Read Replicas**: asynchronous replication from primary. Can be in same region, different region, or different account. Used to offload read traffic. Up to 5 per MySQL/PostgreSQL, 15 for Aurora.

Can be promoted to standalone DB (breaks replication). Different endpoint from primary — application must be configured to send reads to replica endpoint.

**Multi-AZ vs Read Replica**:
| | Multi-AZ | Read Replica |
|--|---------|-------------|
| Replication | Synchronous | Asynchronous |
| Purpose | HA / failover | Read scaling |
| Readable | No | Yes |
| Failover | Automatic | Manual promotion |
| Cross-region | Yes (some engines) | Yes |`,
    },
    {
      heading: "Backups & Restore",
      body: `**Automated Backups**:
- Daily snapshot + transaction logs (point-in-time recovery)
- Retention: 1–35 days (default 7)
- Backups occur during backup window (minimal impact; brief I/O suspension for single-AZ)
- Restored to a new RDS instance (cannot restore in-place)
- Free storage up to the size of your DB

**Manual Snapshots**:
- User-initiated snapshot
- Retained until you delete them (not subject to retention period)
- Can be shared with other AWS accounts or copied to other regions
- Cross-region copy for DR

**Point-in-Time Restore (PITR)**: restore to any second within the retention window. Creates a new DB instance. Replays transaction logs from the last snapshot to the requested time.

**Aurora Backtrack**: rewind Aurora MySQL database to a specific time (not a restore — same instance, no new endpoint). Useful for recovering from accidental DELETE/UPDATE without waiting for full restore.

**RDS Snapshot Export to S3**: export RDS/Aurora snapshot to S3 as Apache Parquet format for analysis with Athena.`,
    },
    {
      heading: "Security",
      body: `**Encryption at rest**: enable at DB creation using KMS. All data, automated backups, snapshots, replicas encrypted with same key. **Cannot encrypt an unencrypted DB in place** — must: take snapshot → copy snapshot with encryption enabled → restore to new encrypted DB.

**Encryption in transit**: SSL/TLS for client connections. Force SSL with parameter group setting (\`rds.force_ssl=1\` for PostgreSQL, use \`require_secure_transport=ON\` for MySQL).

**VPC**: RDS instances run inside a VPC in a DB subnet group (subnets across multiple AZs). Configure security groups to allow only application layer to connect on DB port.

**IAM Database Authentication** (MySQL, PostgreSQL): authenticate with IAM credentials instead of username/password. Generate authentication token with \`generate-db-auth-token\` CLI; use as password. Token valid for 15 minutes. Great for Lambda, ECS — no need to store DB passwords.

**Secrets Manager integration**: store DB credentials in Secrets Manager. Enable auto-rotation (built-in Lambda for RDS). Application fetches credentials from Secrets Manager.

**Database Activity Streams**: real-time stream of DB activity to Kinesis. Used for audit, compliance monitoring. Aurora only.`,
    },
    {
      heading: "Performance & Scaling",
      body: `**Vertical scaling**: change instance type (requires reboot for most engines; Aurora can do some without reboot).

**Storage scaling**: increase storage (cannot decrease). Enable **storage auto-scaling** to automatically expand storage when threshold is reached.

**Read scaling**: add Read Replicas. Route read queries to replica endpoint.

**Connection pooling**: RDS Proxy — managed proxy that pools and shares connections to the database. Reduces connection overhead for Lambda (which opens many short-lived connections). Integrates with Secrets Manager and IAM for auth. No connection limit spikes.

**RDS Proxy**:
- Pools connections: Lambda functions share a small pool of DB connections
- Reduces latency from connection establishment
- Handles failover faster (proxy absorbs the failover; app sees brief pause, not disconnect)
- Supports MySQL, PostgreSQL, MariaDB, SQL Server, Aurora

**Parameter Groups**: engine configuration parameters. Tune memory, query cache, logging. Some changes require reboot (\`static\` parameters); others apply immediately (\`dynamic\`).

**Enhanced Monitoring**: 1-second OS-level metrics for RDS (CPU steal, memory, I/O per process). Separate from CloudWatch standard metrics (5-min default, 1-min with detailed).`,
    },
    {
      heading: "RDS with Other Services",
      body: `**RDS + Lambda**: Lambda connects to RDS for CRUD operations. Use RDS Proxy to handle connection pooling (Lambda creates many connections). Lambda must be in same VPC as RDS.

**RDS + Secrets Manager**: store DB password in Secrets Manager with auto-rotation. RDS-specific rotation Lambda built in. Application uses GetSecretValue at startup.

**RDS + ElastiCache**: cache query results to reduce RDS load. Lazy loading pattern: check cache first, populate on miss.

**RDS + CloudWatch**: CPU, IOPS, FreeStorageSpace, DatabaseConnections, ReadLatency metrics. Alarm on FreeStorageSpace to prevent running out.

**RDS + DMS (Database Migration Service)**: migrate from on-premises or other cloud DBs to RDS. Continuous replication for minimal downtime migration.

**RDS + Kinesis (Database Activity Streams)**: stream DB activity to Kinesis for real-time audit and compliance (Aurora only).

**RDS + IAM Authentication**: Lambda, ECS tasks authenticate with IAM tokens instead of passwords. Eliminates stored DB passwords in application config.

**RDS + VPC**: DB in private subnets. Application in private subnets. Security group allows app → DB on port. No public internet access.`,
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
