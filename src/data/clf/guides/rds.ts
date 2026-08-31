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
      quiz: [
        {
          question:
            "Which of the following database engines is supported by Amazon RDS?",
          options: ["MongoDB", "Redis", "PostgreSQL", "Cassandra"],
          correctIndex: 2,
          explanation:
            "Amazon RDS supports six engines: Amazon Aurora, MySQL, PostgreSQL, MariaDB, Oracle Database, and Microsoft SQL Server. MongoDB, Redis, and Cassandra are NoSQL databases not supported by RDS (though AWS offers other services for those, like DocumentDB and ElastiCache).",
        },
        {
          question:
            "What is the primary advantage of using Amazon RDS over running your own database on an EC2 instance?",
          options: [
            "RDS supports more database engines than any self-managed option",
            "RDS databases run faster than databases on EC2",
            "RDS is free while running a database on EC2 incurs charges",
            "AWS manages backups, patching, and infrastructure so you focus on your application",
          ],
          correctIndex: 3,
          explanation:
            "RDS is a managed service — AWS handles provisioning hardware, installing software, taking backups, applying patches, and monitoring health. You retain control of your schema, queries, and application logic, but the operational burden of running the database is AWS's responsibility.",
        },
        {
          question:
            "Which component of a database does the customer remain responsible for when using Amazon RDS?",
          options: [
            "Patching the database engine software",
            "Provisioning the underlying EC2 hardware",
            "The database schema, queries, and application logic",
            "Configuring automated backups and retention windows",
          ],
          correctIndex: 2,
          explanation:
            "With RDS, AWS manages the infrastructure layer (hardware, OS, database engine patching, backups). The customer remains responsible for the schema design, SQL queries, application logic, database user permissions, and which data is stored.",
        },
      ],
    },
    {
      heading: "High Availability with Multi-AZ",
      body: `**Multi-AZ deployment** is RDS's primary high-availability feature. When you enable Multi-AZ, RDS automatically provisions a **standby instance** in a different Availability Zone and synchronously replicates all data from the primary to the standby.

If the primary instance fails — due to hardware failure, an AZ outage, or a maintenance event — RDS automatically fails over to the standby. The failover typically completes in **60–120 seconds**. Your application reconnects to the same DNS endpoint (RDS provides a single DNS hostname), so no code changes are required.

Multi-AZ is about **availability and durability**, not performance. The standby instance does not serve read traffic. If you want to scale read traffic, you use Read Replicas instead. Multi-AZ and Read Replicas can be used together.`,
      quiz: [
        {
          question: "What does RDS Multi-AZ deployment provide?",
          options: [
            "High availability with automatic failover to a standby instance in another Availability Zone",
            "Lower cost by sharing compute resources across multiple databases",
            "Improved read performance by distributing queries across multiple instances",
            "The ability to run different database engines in the same Multi-AZ group",
          ],
          correctIndex: 0,
          explanation:
            "RDS Multi-AZ automatically provisions a synchronous standby instance in a different AZ. If the primary fails, RDS automatically fails over to the standby — typically in 60–120 seconds — using the same DNS endpoint so no application code changes are needed.",
        },
        {
          question:
            "Can you use the RDS Multi-AZ standby instance to serve read traffic and improve performance?",
          options: [
            "Yes — the standby handles all read queries while the primary handles writes",
            "No — the standby instance does not serve read traffic; it is only for failover",
            "Yes — but only during maintenance windows",
            "No — you must purchase a separate read license to use the standby for reads",
          ],
          correctIndex: 1,
          explanation:
            "The RDS Multi-AZ standby instance does NOT serve read traffic. It exists solely for high availability and automatic failover. To scale read traffic, you must create Read Replicas, which are separate from Multi-AZ.",
        },
        {
          question:
            "When RDS Multi-AZ fails over to the standby instance, what must the application do to reconnect?",
          options: [
            "Update the connection string to point to the new primary's IP address",
            "Nothing — the application uses the same DNS endpoint, which RDS updates automatically",
            "Restart the application server to clear the old database connection",
            "Manually promote the standby instance to primary through the AWS console",
          ],
          correctIndex: 1,
          explanation:
            "RDS provides a single DNS endpoint for your database. During failover, RDS updates the DNS to point to the standby (now promoted to primary). Applications that reconnect using the DNS hostname automatically reach the new primary with no code changes.",
        },
      ],
    },
    {
      heading: "Read Replicas",
      body: `A **Read Replica** is a copy of your database that handles read-only queries, allowing you to scale read capacity horizontally. RDS uses **asynchronous replication** to keep replicas in sync with the primary. Because replication is asynchronous, there may be slight lag between the primary and replica — this is called **replication lag**.

You can create Read Replicas in the same region, a different region, or even a different AWS account. Cross-region Read Replicas are useful for serving read traffic closer to global users or for disaster recovery.

RDS supports up to **15 Read Replicas** per primary instance for MySQL, MariaDB, and PostgreSQL. Aurora supports up to 15 Aurora Replicas. Your application connects to separate endpoints: the primary endpoint for writes, and replica endpoints for reads.

A Read Replica can be promoted to become an independent primary database, which is useful for disaster recovery scenarios or for creating a new production database from an existing one.`,
      quiz: [
        {
          question: "What is the primary purpose of RDS Read Replicas?",
          options: [
            "To create encrypted copies of the primary database for compliance",
            "To provide automatic failover when the primary instance fails",
            "To replicate data across regions for billing consolidation",
            "To scale read capacity by handling read-only queries on separate instances",
          ],
          correctIndex: 3,
          explanation:
            "Read Replicas scale read capacity by offloading read-only queries to separate instances. Your application directs writes to the primary endpoint and reads to replica endpoints, distributing the read workload horizontally.",
        },
        {
          question:
            "What type of replication do RDS Read Replicas use, and what is a potential consequence?",
          options: [
            "Synchronous replication — data is always consistent with zero lag",
            "Asynchronous replication — there may be slight replication lag between primary and replica",
            "Batch replication — replicas are updated every 15 minutes",
            "Event-driven replication — replicas update only when the primary is idle",
          ],
          correctIndex: 1,
          explanation:
            "Read Replicas use asynchronous replication. This means the replica may be slightly behind the primary (replication lag). Applications that read from replicas might see slightly stale data. This is different from Multi-AZ, which uses synchronous replication.",
        },
        {
          question:
            "What is the key difference between RDS Multi-AZ and Read Replicas?",
          options: [
            "Multi-AZ is for high availability with synchronous replication and no read traffic; Read Replicas scale reads with asynchronous replication",
            "Multi-AZ requires more expensive instance types than Read Replicas",
            "Multi-AZ is for disaster recovery across regions; Read Replicas are for single-region HA",
            "Multi-AZ supports all database engines; Read Replicas only support Aurora",
          ],
          correctIndex: 0,
          explanation:
            "Multi-AZ uses synchronous replication for high availability — the standby doesn't serve reads, it's purely for failover. Read Replicas use asynchronous replication to scale read capacity — they actively serve read traffic but may have slight lag.",
        },
      ],
    },
    {
      heading: "Backups and Snapshots",
      body: `RDS provides two backup mechanisms to protect your data.

**Automated backups** are enabled by default and run daily during a configurable backup window. RDS backs up the entire database instance and transaction logs, allowing **point-in-time recovery** to any second within the retention period (1 to 35 days). These backups are stored in S3 and are deleted when you delete the RDS instance.

**Manual snapshots** are user-initiated backups that persist until you explicitly delete them. Use snapshots before major changes, for long-term archival, or to copy a database to another region.

You can **restore** from either backup type, but this always creates a **new** RDS instance — you cannot restore in place. After restoration, you update your application's connection string to point to the new instance.

**Encryption at rest** is configured when you create the instance using AWS KMS. An encrypted instance has its storage, automated backups, read replicas, and snapshots all encrypted. You cannot enable encryption on an existing unencrypted instance — you must create a snapshot, copy it with encryption enabled, and restore from the encrypted snapshot.`,
      quiz: [
        {
          question:
            "What is the maximum retention period for RDS automated backups?",
          options: ["7 days", "14 days", "90 days", "35 days"],
          correctIndex: 3,
          explanation:
            "RDS automated backups have a configurable retention period of 1 to 35 days. Within the retention window, you can restore to any second using point-in-time recovery. Automated backups are deleted when you delete the RDS instance.",
        },
        {
          question:
            "What happens when you restore an RDS database from a backup or snapshot?",
          options: [
            "The restore overwrites the most recent automated backup",
            "The existing database instance is restored in place with the original data",
            "The database is temporarily offline during restoration to the same instance",
            "A brand new RDS instance is created; the original instance is unaffected",
          ],
          correctIndex: 3,
          explanation:
            "Restoring from a backup or snapshot always creates a brand new RDS instance. The original instance (if it still exists) is unaffected. After restoration, you must update your application's connection string to point to the new instance.",
        },
        {
          question:
            "How do manual RDS snapshots differ from automated backups?",
          options: [
            "Manual snapshots only capture the last 24 hours of data; automated backups capture everything",
            "Manual snapshots persist until you explicitly delete them; automated backups are deleted when the RDS instance is deleted",
            "Automated backups are stored in S3; manual snapshots are stored on EBS",
            "Manual snapshots are free; automated backups incur additional charges",
          ],
          correctIndex: 1,
          explanation:
            "Manual snapshots persist until you explicitly delete them, making them suitable for long-term archival or pre-change checkpoints. Automated backups are retained for the configured period (up to 35 days) and are deleted when the RDS instance is deleted.",
        },
      ],
    },
    {
      heading: "Amazon Aurora",
      body: `**Amazon Aurora** is AWS's own cloud-native relational database engine, compatible with both MySQL and PostgreSQL. Aurora is designed for the cloud and offers significant advantages over standard RDS engines.

Aurora stores data across **6 copies** spread across 3 Availability Zones, providing exceptional durability. Its storage automatically grows in 10 GB increments up to 128 TB. Aurora typically delivers **up to 5x the throughput of MySQL** and **3x the throughput of PostgreSQL** on the same hardware.

**Aurora Serverless** is an on-demand, auto-scaling configuration of Aurora. The database starts, scales, and shuts down automatically based on application needs. It is ideal for infrequent or unpredictable workloads where you want to pay only for the database capacity you use.

For the Cloud Practitioner exam, remember that Aurora is AWS's premium managed relational database with higher performance, better availability, and automatic storage scaling — but at a higher cost than standard RDS engines.`,
      quiz: [
        {
          question:
            "How many copies of data does Amazon Aurora store, and across how many Availability Zones?",
          options: [
            "6 copies across 6 AZs",
            "6 copies across 3 AZs",
            "2 copies across 2 AZs",
            "3 copies across 3 AZs",
          ],
          correctIndex: 1,
          explanation:
            "Aurora stores 6 copies of your data spread across 3 Availability Zones. This provides exceptional durability and availability — Aurora can survive the loss of up to 2 copies without impacting write availability and up to 3 copies without impacting read availability.",
        },
        {
          question: "What is Aurora Serverless designed for?",
          options: [
            "Running Aurora in containers without managing EC2 instances",
            "Replacing Lambda for serverless application backends",
            "Running Aurora across multiple AWS accounts simultaneously",
            "On-demand, auto-scaling Aurora for infrequent or unpredictable workloads where you pay only for capacity used",
          ],
          correctIndex: 3,
          explanation:
            "Aurora Serverless is an on-demand, auto-scaling configuration of Aurora that starts, scales, and shuts down automatically based on application needs. It is ideal for infrequent or unpredictable workloads — you pay only for the database capacity actually used.",
        },
        {
          question:
            "Compared to standard MySQL running on RDS, Aurora typically delivers how much more throughput?",
          options: [
            "Up to 10x MySQL throughput",
            "Up to 2x MySQL throughput",
            "Up to 5x MySQL throughput",
            "The same throughput as MySQL",
          ],
          correctIndex: 2,
          explanation:
            "Aurora typically delivers up to 5x the throughput of MySQL and up to 3x the throughput of PostgreSQL on equivalent hardware. This performance advantage, combined with 6-way replication and automatic storage scaling, makes Aurora AWS's premium relational database offering.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A company's RDS database is experiencing high read traffic that is slowing down write performance. What is the recommended solution?",
      options: [
        "Enable Multi-AZ to distribute read traffic to the standby instance",
        "Create Read Replicas and direct read traffic to them",
        "Upgrade to a larger RDS instance type",
        "Enable Aurora Serverless to automatically scale read capacity",
      ],
      correctIndex: 1,
      explanation:
        "Read Replicas offload read-only queries from the primary instance to separate replica instances. The application directs reads to replica endpoints and writes to the primary endpoint, reducing the load on the primary and improving overall performance.",
    },
    {
      question:
        "What is the key purpose of RDS Multi-AZ, and what does the standby instance do during normal operation?",
      options: [
        "Multi-AZ improves performance; the standby serves half the read traffic",
        "Multi-AZ provides high availability; the standby receives synchronous data replication but serves no traffic until failover",
        "Multi-AZ provides disaster recovery across regions; the standby is in a different region",
        "Multi-AZ reduces cost; the standby uses smaller instance types",
      ],
      correctIndex: 1,
      explanation:
        "Multi-AZ provides high availability. The standby instance receives synchronous data replication from the primary but serves no read or write traffic during normal operation. It only becomes active when the primary fails, providing automatic failover in 60–120 seconds.",
    },
    {
      question:
        "A developer needs to restore a production RDS database to how it was exactly 3 days ago. Which backup feature enables this?",
      options: [
        "Read Replica promotion to the state from 3 days ago",
        "Manual snapshots — restore the snapshot taken 3 days ago",
        "Aurora Serverless automatic rollback",
        "Automated backups with point-in-time recovery",
      ],
      correctIndex: 3,
      explanation:
        "Automated backups enable point-in-time recovery to any second within the retention period (1–35 days). RDS backs up the full instance and transaction logs, allowing precise recovery. This would restore to the state exactly 3 days ago.",
    },
    {
      question:
        "Which RDS feature allows you to take a database backup that persists indefinitely until you explicitly delete it?",
      options: [
        "Multi-AZ standby copies",
        "Manual snapshots",
        "Point-in-time recovery",
        "Automated backups",
      ],
      correctIndex: 1,
      explanation:
        "Manual snapshots are user-initiated backups that persist until you explicitly delete them. Unlike automated backups (which are deleted when the RDS instance is deleted and expire after the retention period), manual snapshots are retained indefinitely.",
    },
    {
      question:
        "Amazon Aurora differs from standard RDS MySQL in which key way?",
      options: [
        "Aurora is MySQL-compatible but delivers up to 5x the throughput with 6-way replication across 3 AZs",
        "Aurora is only available in us-east-1 while standard MySQL is available globally",
        "Aurora requires you to manage the underlying EC2 instances",
        "Aurora supports SQL queries while standard MySQL uses a proprietary query language",
      ],
      correctIndex: 0,
      explanation:
        "Aurora is MySQL-compatible (and PostgreSQL-compatible) but is AWS's cloud-native engine built for the cloud. It delivers up to 5x MySQL throughput, automatically stores 6 copies across 3 AZs, and auto-scales storage up to 128 TB.",
    },
    {
      question:
        "You need to enable encryption on an existing unencrypted RDS instance. What is the correct process?",
      options: [
        "Enable encryption directly on the running instance in the RDS console",
        "Create a snapshot of the instance, copy it with encryption enabled, then restore from the encrypted snapshot",
        "Attach an AWS KMS key to the running instance to enable encryption",
        "Create a Read Replica with encryption enabled and promote it to primary",
      ],
      correctIndex: 1,
      explanation:
        "You cannot enable encryption on a running unencrypted RDS instance. The process is: create a snapshot of the unencrypted instance, copy the snapshot enabling encryption during the copy, then restore a new encrypted RDS instance from the encrypted snapshot.",
    },
    {
      question:
        "Which RDS backup type is automatically deleted when the RDS instance is deleted?",
      options: [
        "Manual snapshots",
        "Automated backups",
        "Both automated backups and manual snapshots",
        "Neither — all backups persist after instance deletion",
      ],
      correctIndex: 1,
      explanation:
        "Automated backups are tied to the RDS instance lifecycle and are deleted when the instance is deleted. Manual snapshots persist until you explicitly delete them, regardless of whether the source instance still exists.",
    },
    {
      question:
        "For which workload type is Aurora Serverless most appropriate?",
      options: [
        "A development database accessed infrequently and with unpredictable traffic patterns",
        "A database requiring strict data residency in a specific Availability Zone",
        "A database that requires synchronous replication to a standby instance",
        "A high-traffic e-commerce site with consistent, predictable load 24/7",
      ],
      correctIndex: 0,
      explanation:
        "Aurora Serverless is ideal for infrequent or unpredictable workloads. It starts, scales, and shuts down automatically based on actual usage — you pay only for the capacity used. For consistent 24/7 workloads, provisioned Aurora is more cost-effective.",
    },
  ],
};
