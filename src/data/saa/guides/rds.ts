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
    },
    {
      heading: "Multi-AZ Deployments for High Availability",
      body: `Multi-AZ deployments provide automatic failover to a standby replica in a different Availability Zone. AWS maintains a synchronously replicated standby instance that shares the same connection endpoint as the primary; if the primary fails due to hardware failure, AZ disruption, or during maintenance, RDS automatically promotes the standby and updates the DNS endpoint within 60–120 seconds. During this failover window, in-flight transactions are lost and connections must be retried — applications should implement retry logic with exponential backoff. The standby replica does not serve read traffic; it exists solely for failover. Multi-AZ is not a scaling solution — it is a durability and availability solution. For Aurora, Multi-AZ is intrinsic to the storage architecture: the shared cluster volume replicates six copies of data across three AZs, and Aurora replicas double as both read scale-out targets and automatic failover candidates.`,
    },
    {
      heading: "Read Replicas for Read Scalability",
      body: `Read replicas extend RDS read capacity by maintaining asynchronously replicated copies of the primary database that can serve SELECT queries. RDS supports up to five read replicas per primary instance for MySQL, MariaDB, and PostgreSQL, while Aurora supports up to fifteen replicas with a shared cluster volume that makes replication lag near-zero. Read replicas can be promoted to standalone primary instances for disaster recovery or regional migration, though promotion requires application connection string changes. Cross-region read replicas support disaster recovery strategies and bring data closer to globally distributed users. Because replication is asynchronous, read replicas may lag behind the primary — architects must design applications to tolerate eventual consistency when routing reads to replicas. Aurora Global Database extends this pattern across regions with typically less than one second replication lag and supports a managed failover to a secondary region in under a minute.`,
    },
    {
      heading: "Backups, Snapshots, and Point-in-Time Recovery",
      body: `RDS performs automated backups daily during a configurable backup window, retaining transaction logs continuously to support Point-in-Time Recovery (PITR) to any second within the retention period (1–35 days). Automated backups are stored in S3 and are deleted when you delete the RDS instance unless you create a final snapshot. Manual DB snapshots are user-initiated and retained until explicitly deleted — use them before major schema changes or application deployments as a rollback point. Restoring from a snapshot or PITR creates a new RDS instance; you cannot restore into the existing instance. The \`RDS Restore to Point in Time\` operation supports recovery to the last five minutes of activity. For Aurora, backtrack lets you rewind the cluster to a specific time in-place without creating a new cluster — this is faster than restore but limited to a configurable backtrack window.`,
    },
    {
      heading: "Security: Encryption, IAM, and Network Isolation",
      body: `RDS instances should reside in private subnets within a VPC, reachable only from application tier security groups — they should never have public internet accessibility unless a specific use case demands it, and even then with strict IP restrictions. Encryption at rest uses AWS KMS: enabling encryption on an RDS instance encrypts the underlying storage, automated backups, read replicas, and snapshots. Encryption cannot be added to an existing unencrypted instance; the migration path is to take a snapshot, copy it with encryption enabled, and restore from the encrypted snapshot. In-transit encryption uses SSL/TLS for connections to RDS — enforce it by using the \`REQUIRE SSL\` constraint in MySQL or the \`sslmode=require\` parameter in PostgreSQL. IAM database authentication allows connecting to MySQL and PostgreSQL RDS instances using an IAM authentication token instead of a static password, which rotates every 15 minutes and eliminates the risk of credential leakage.`,
    },
    {
      heading: "RDS Proxy for Connection Management",
      body: `Applications with many short-lived connections — particularly serverless Lambda functions — can exhaust RDS connection limits, causing errors and performance degradation. RDS Proxy sits between the application and the database, pooling and sharing connections so that thousands of concurrent Lambda invocations share a much smaller number of actual database connections. RDS Proxy also improves failover time by maintaining connections during a Multi-AZ failover and reconnecting applications without requiring them to detect the new endpoint. Proxy supports IAM authentication and Secrets Manager for credential rotation without restarting the proxy. For Lambda-to-RDS architectures, RDS Proxy is the recommended integration layer that prevents connection storms and reduces failover impact on serverless workloads.`,
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
};
