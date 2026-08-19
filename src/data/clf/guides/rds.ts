import { ServiceGuide } from "../../../types/guide";

export const rdsGuide: ServiceGuide = {
  id: "clf-rds",
  service: "Amazon RDS",
  domain: "development",
  tagline: "Managed relational database service in the cloud",
  intro:
    "Amazon Relational Database Service (RDS) makes it easy to set up, operate, and scale relational databases in the cloud, handling routine tasks like backups, patching, and replication so you can focus on your application.",

  sections: [
    {
      heading: "What Is Amazon RDS?",
      body: `Amazon RDS is a **managed database service** that handles the undifferentiated heavy lifting of running a relational database: provisioning hardware, installing database software, taking backups, applying patches, and monitoring health. You choose a database engine and instance size, and RDS handles the rest.

RDS supports six popular database engines: **Amazon Aurora** (MySQL- and PostgreSQL-compatible, AWS-built), **MySQL**, **PostgreSQL**, **MariaDB**, **Oracle Database**, and **Microsoft SQL Server**. For the Cloud Practitioner exam, knowing these engines exist is sufficient — you do not need to know their internal differences deeply.

The key benefit of RDS over running your own database on EC2 is that AWS manages the operational burden. You still control the schema, queries, and application logic, but AWS handles the infrastructure layer.`,
    },
    {
      heading: "High Availability with Multi-AZ",
      body: `**Multi-AZ deployment** is RDS's primary high-availability feature. When you enable Multi-AZ, RDS automatically provisions a **standby instance** in a different Availability Zone and synchronously replicates all data from the primary to the standby.

If the primary instance fails — due to hardware failure, an AZ outage, or a maintenance event — RDS automatically fails over to the standby. The failover typically completes in **60–120 seconds**. Your application reconnects to the same DNS endpoint (RDS provides a single DNS hostname), so no code changes are required.

Multi-AZ is about **availability and durability**, not performance. The standby instance does not serve read traffic. If you want to scale read traffic, you use Read Replicas instead. Multi-AZ and Read Replicas can be used together.`,
    },
    {
      heading: "Read Replicas",
      body: `A **Read Replica** is a copy of your database that handles read-only queries, allowing you to scale read capacity horizontally. RDS uses **asynchronous replication** to keep replicas in sync with the primary. Because replication is asynchronous, there may be slight lag between the primary and replica — this is called **replication lag**.

You can create Read Replicas in the same region, a different region, or even a different AWS account. Cross-region Read Replicas are useful for serving read traffic closer to global users or for disaster recovery.

RDS supports up to **5 Read Replicas** per primary instance for MySQL and PostgreSQL. Aurora supports up to 15 Aurora Replicas. Your application connects to separate endpoints: the primary endpoint for writes, and replica endpoints for reads.

A Read Replica can be promoted to become an independent primary database, which is useful for disaster recovery scenarios or for creating a new production database from an existing one.`,
    },
    {
      heading: "Backups and Snapshots",
      body: `RDS provides two backup mechanisms to protect your data.

**Automated backups** are enabled by default and run daily during a configurable backup window. RDS backs up the entire database instance and transaction logs, allowing **point-in-time recovery** to any second within the retention period (1 to 35 days). These backups are stored in S3 and are deleted when you delete the RDS instance.

**Manual snapshots** are user-initiated backups that persist until you explicitly delete them. Use snapshots before major changes, for long-term archival, or to copy a database to another region.

You can **restore** from either backup type, but this always creates a **new** RDS instance — you cannot restore in place. After restoration, you update your application's connection string to point to the new instance.

**Encryption at rest** is configured when you create the instance using AWS KMS. An encrypted instance has its storage, automated backups, read replicas, and snapshots all encrypted. You cannot enable encryption on an existing unencrypted instance — you must create a snapshot, copy it with encryption enabled, and restore from the encrypted snapshot.`,
    },
    {
      heading: "Amazon Aurora",
      body: `**Amazon Aurora** is AWS's own cloud-native relational database engine, compatible with both MySQL and PostgreSQL. Aurora is designed for the cloud and offers significant advantages over standard RDS engines.

Aurora stores data across **6 copies** spread across 3 Availability Zones, providing exceptional durability. Its storage automatically grows in 10 GB increments up to 128 TB. Aurora typically delivers **up to 5x the throughput of MySQL** and **3x the throughput of PostgreSQL** on the same hardware.

**Aurora Serverless** is an on-demand, auto-scaling configuration of Aurora. The database starts, scales, and shuts down automatically based on application needs. It is ideal for infrequent or unpredictable workloads where you want to pay only for the database capacity you use.

For the Cloud Practitioner exam, remember that Aurora is AWS's premium managed relational database with higher performance, better availability, and automatic storage scaling — but at a higher cost than standard RDS engines.`,
    },
  ],

  keyFacts: [
    "RDS is a managed relational database service — AWS handles patching, backups, and hardware",
    "Supported engines: Aurora, MySQL, PostgreSQL, MariaDB, Oracle, SQL Server",
    "Multi-AZ creates a synchronous standby in another AZ for high availability and automatic failover",
    "Multi-AZ is for availability, NOT read scaling — standby does not serve reads",
    "Read Replicas use asynchronous replication and serve read-only traffic",
    "Automated backups allow point-in-time recovery within 1–35 days retention",
    "Manual snapshots persist until you delete them",
    "Restoring always creates a new RDS instance, not in-place restoration",
    "Aurora offers up to 5x MySQL throughput and stores 6 copies across 3 AZs",
    "Aurora Serverless auto-scales for unpredictable or infrequent workloads",
  ],

  relatedServices: [
    "Amazon Aurora",
    "Amazon DynamoDB",
    "Amazon VPC",
    "AWS KMS",
    "Amazon ElastiCache",
  ],

  examTips: [
    "Multi-AZ = high availability with synchronous replication and automatic failover",
    "Read Replicas = read scalability with asynchronous replication (may have lag)",
    "Multi-AZ standby does NOT serve read traffic — only Read Replicas do",
    "Automated backups enable point-in-time recovery; manual snapshots are permanent until deleted",
    "Restoration from backup always creates a NEW instance",
    "Aurora is AWS's cloud-native engine with higher performance and up to 15 read replicas",
    "Encryption must be enabled at creation; you cannot encrypt an existing unencrypted instance directly",
  ],
};
