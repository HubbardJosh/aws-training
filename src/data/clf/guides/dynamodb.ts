import { ServiceGuide } from "../../../types/guide";

export const dynamodbGuide: ServiceGuide = {
  id: "clf-dynamodb",
  service: "Amazon DynamoDB",
  domain: "development",
  tagline:
    "Fully managed NoSQL database with single-digit millisecond performance",
  intro:
    "Amazon DynamoDB is a fully managed, serverless NoSQL database that delivers fast and predictable performance at any scale, with no servers to manage, no database administration tasks, and automatic scaling to handle any amount of traffic.",

  sections: [
    {
      heading: "What Is DynamoDB?",
      body: `DynamoDB is a **NoSQL** (non-relational) database, which means it does not use tables with fixed schemas and SQL queries in the traditional sense. Instead, DynamoDB stores **items** (analogous to rows) in **tables**, where each item can have a different set of **attributes** (analogous to columns). This schema-less nature makes it flexible for evolving data models.

The key difference from relational databases like RDS is that DynamoDB is optimized for **key-value and document access patterns** rather than complex ad-hoc queries with joins. If your application primarily accesses data by a specific key (user ID, order ID, session token), DynamoDB is an excellent fit. If your application needs complex multi-table joins or ad-hoc reporting queries, a relational database may be more appropriate.

DynamoDB is **fully managed and serverless** — there is no database engine to install, no infrastructure to manage, and no capacity to provision manually (in on-demand mode). It scales to handle millions of requests per second automatically.`,
      quiz: [
        {
          question: "Which type of database is Amazon DynamoDB?",
          options: [
            "Relational database optimized for SQL queries and joins",
            "NoSQL key-value and document database",
            "In-memory cache database",
            "Graph database for relationship data",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB is a NoSQL (non-relational) key-value and document database. It is schema-less and optimized for key-based access patterns rather than complex SQL queries with joins.",
        },
        {
          question:
            "When is DynamoDB a better fit than a relational database like RDS?",
          options: [
            "When your application requires complex multi-table joins and ad-hoc SQL queries",
            "When your application primarily accesses data by a specific key like user ID or order ID",
            "When you need to run stored procedures and database triggers",
            "When your data has a highly normalized, fixed schema",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB is optimized for key-value and document access patterns. If your application primarily looks up data by a specific key (user ID, order ID, session token), DynamoDB excels. For complex joins and ad-hoc queries, a relational database is more appropriate.",
        },
        {
          question:
            "What does it mean that DynamoDB is 'fully managed and serverless'?",
          options: [
            "DynamoDB runs your application code as well as storing data",
            "There is no database engine to install, no infrastructure to manage, and it scales automatically",
            "DynamoDB is free to use with no charges for any usage",
            "DynamoDB can only be accessed through AWS Lambda functions",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB being fully managed and serverless means AWS handles all infrastructure: no database engine to install, no servers to patch, and no capacity to provision manually. It scales automatically to millions of requests per second.",
        },
      ],
    },
    {
      heading: "Keys and Data Model",
      body: `Every DynamoDB table has a **primary key** that uniquely identifies each item. There are two types:

A **Simple Primary Key** consists of just a **Partition Key** (also called a hash key). DynamoDB uses the partition key to determine which physical partition stores the item. All items with the same partition key are in the same partition.

A **Composite Primary Key** combines a **Partition Key** and a **Sort Key** (range key). Items with the same partition key are stored together and sorted by the sort key, allowing efficient range queries within a partition.

For example, a table of user orders might use \`userId\` as the partition key and \`orderId\` as the sort key. You can then query "all orders for user 123" efficiently.

**Attributes** are the data fields of an item — DynamoDB supports strings, numbers, booleans, binary data, lists, maps, and sets. There is no fixed schema; each item can have different attributes beyond the required key attributes.

**Global Secondary Indexes (GSIs)** allow you to query the table by attributes other than the primary key, creating an alternate view of the data with a different partition key and sort key.`,
      quiz: [
        {
          question:
            "A DynamoDB table uses 'userId' as the partition key and 'orderId' as the sort key. What type of primary key is this?",
          options: [
            "Simple primary key",
            "Composite primary key",
            "Global secondary index",
            "Local secondary index",
          ],
          correctIndex: 1,
          explanation:
            "A composite primary key combines a partition key and a sort key. Using userId + orderId as a composite key allows you to efficiently query all orders for a specific user, since items with the same partition key are stored together and sorted by the sort key.",
        },
        {
          question:
            "What are Global Secondary Indexes (GSIs) used for in DynamoDB?",
          options: [
            "Replicating table data to other AWS regions",
            "Querying the table by attributes other than the primary key",
            "Creating backups of the table at specific points in time",
            "Encrypting sensitive attributes within a table item",
          ],
          correctIndex: 1,
          explanation:
            "GSIs create an alternate view of the data with a different partition key and sort key, allowing you to query the table on attributes other than the primary key. Without GSIs, you can only query by the table's primary key.",
        },
        {
          question:
            "In DynamoDB, what term is used for a single record in a table (analogous to a row in a relational database)?",
          options: ["Document", "Record", "Item", "Entry"],
          correctIndex: 2,
          explanation:
            "In DynamoDB, a single record is called an item (analogous to a row in a relational database). Each item is identified by its primary key and can have different attributes (analogous to columns) beyond the key attributes.",
        },
      ],
    },
    {
      heading: "Capacity and Scaling",
      body: `DynamoDB offers two capacity modes that determine how throughput is provisioned and billed.

**On-Demand Mode** (the simpler option) automatically scales to accommodate any traffic level. You pay per request — per read request unit (RRU) and write request unit (WRU) — with no capacity planning needed. This mode is ideal for unpredictable traffic, new applications, or workloads with significant spikes.

**Provisioned Mode** requires you to specify the number of **Read Capacity Units (RCUs)** and **Write Capacity Units (WCUs)** per second your table needs. You can enable **Auto Scaling** to automatically adjust provisioned capacity based on actual traffic, keeping utilization near a target percentage. Provisioned mode is more cost-effective for predictable, steady traffic.

One RCU supports one strongly consistent read (or two eventually consistent reads) of an item up to 4 KB per second. One WCU supports one write of an item up to 1 KB per second. For the Cloud Practitioner exam, you do not need to calculate RCUs and WCUs — just understand that capacity modes exist and on-demand is simpler.`,
      quiz: [
        {
          question:
            "Which DynamoDB capacity mode is best suited for a new application with unpredictable or highly variable traffic?",
          options: [
            "Provisioned mode with manual capacity configuration",
            "Provisioned mode with Auto Scaling enabled",
            "On-Demand mode",
            "Reserved capacity mode",
          ],
          correctIndex: 2,
          explanation:
            "On-Demand mode automatically scales to any traffic level with no capacity planning needed. You pay per request, making it ideal for unpredictable traffic, new applications, or workloads with significant spikes.",
        },
        {
          question:
            "When is DynamoDB Provisioned mode more cost-effective than On-Demand mode?",
          options: [
            "Always — Provisioned mode is always cheaper than On-Demand",
            "For predictable, steady-state traffic where you can accurately forecast capacity needs",
            "For workloads that require sub-millisecond response times",
            "For tables with more than 1 TB of data",
          ],
          correctIndex: 1,
          explanation:
            "Provisioned mode is more cost-effective for predictable, steady-state traffic because you pay a lower per-unit rate for pre-allocated capacity. On-Demand mode is simpler but costs more per request, making it better suited for unpredictable workloads.",
        },
      ],
    },
    {
      heading: "Global Tables and High Availability",
      body: `DynamoDB is designed from the ground up for high availability. It automatically replicates data across **three Availability Zones** within an AWS region, ensuring your table survives the loss of any single AZ with no action on your part.

**DynamoDB Global Tables** extend this replication across **multiple AWS regions**, creating a fully replicated, multi-master table. Any region can serve both reads and writes, and DynamoDB automatically propagates changes to all other regions within seconds. Global Tables provide **extremely low latency** for globally distributed applications and act as a built-in disaster recovery solution — if a region fails, your application can seamlessly use another region.

**Point-in-Time Recovery (PITR)** continuously backs up your table and lets you restore it to any second within the past 35 days. Enabling PITR is a best practice for production tables. **On-demand backups** create a full backup of your table at any point in time, stored until you delete them.`,
      quiz: [
        {
          question:
            "DynamoDB automatically replicates data across how many Availability Zones within a region?",
          options: ["1", "2", "3", "5"],
          correctIndex: 2,
          explanation:
            "DynamoDB automatically replicates data across three Availability Zones within an AWS region, providing high availability and durability without any configuration on your part.",
        },
        {
          question: "What is the key benefit of DynamoDB Global Tables?",
          options: [
            "Automatic schema migration across table versions",
            "Multi-region, multi-master replication for globally distributed applications and disaster recovery",
            "Unlimited read capacity without any provisioning",
            "Cross-account access to a single DynamoDB table",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB Global Tables create a fully replicated, multi-master table across multiple AWS regions. Any region can serve reads and writes, providing extremely low latency for global users and built-in disaster recovery if a region fails.",
        },
        {
          question:
            "DynamoDB Point-in-Time Recovery (PITR) allows you to restore a table to any second within the past how many days?",
          options: ["7 days", "14 days", "35 days", "90 days"],
          correctIndex: 2,
          explanation:
            "PITR continuously backs up your DynamoDB table and allows restoration to any second within the past 35 days. Enabling PITR is a best practice for production tables to protect against accidental data deletion or corruption.",
        },
      ],
    },
    {
      heading: "DynamoDB Streams and Event-Driven Patterns",
      body: `**DynamoDB Streams** captures a time-ordered sequence of item-level changes (inserts, updates, deletes) to a table. The stream records each change within 24 hours, and other services can consume these changes in near-real-time.

The most common pattern is to connect DynamoDB Streams to a **Lambda function**. Every time an item changes in DynamoDB, Lambda is invoked automatically with the change record. This enables powerful event-driven patterns:
- Sending a welcome email when a new user record is created
- Updating a search index when a product listing changes
- Replicating changes to another data store for analytics
- Invalidating a cache entry when the underlying data is updated

For the Cloud Practitioner exam, the key concept is that DynamoDB Streams enables **reactive, event-driven architectures** where other parts of your system automatically respond to database changes.

**DynamoDB Accelerator (DAX)** is a fully managed, in-memory cache purpose-built for DynamoDB. DAX delivers **microsecond read latency** by caching DynamoDB read results in memory and serving repeated requests directly from the cache without hitting the main table. DAX is API-compatible with DynamoDB, so switching requires minimal code changes. It is ideal for read-heavy workloads like leaderboards, product catalogs, or real-time bidding systems that require the absolute lowest read latency.

DynamoDB is also commonly used with **Amazon ElastiCache** (Redis) as a more general-purpose caching layer. For read-heavy workloads, your application reads from ElastiCache first and only queries DynamoDB on a cache miss, reducing latency and read costs.`,
      quiz: [
        {
          question: "What does DynamoDB Streams capture?",
          options: [
            "SQL query logs for auditing database access",
            "A time-ordered sequence of item-level changes (inserts, updates, deletes) to a table",
            "Metrics about table throughput and latency",
            "Snapshots of the entire table at regular intervals",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB Streams captures a time-ordered sequence of item-level changes — inserts, updates, and deletes — to a table. Each change is recorded and available for consumption within 24 hours.",
        },
        {
          question:
            "A company wants to automatically send a welcome email whenever a new user record is created in DynamoDB. What is the recommended AWS architecture?",
          options: [
            "Poll DynamoDB every minute from an EC2 instance to check for new records",
            "Use DynamoDB Streams connected to a Lambda function that sends the email",
            "Use DynamoDB automated backups to trigger email notifications",
            "Configure an RDS trigger to call an SNS topic when records are inserted",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB Streams + Lambda is the recommended event-driven pattern. When a new user record is created, the stream captures the change and invokes a Lambda function that sends the welcome email — no polling required.",
        },
        {
          question:
            "Why is Amazon ElastiCache commonly used alongside DynamoDB?",
          options: [
            "ElastiCache provides schema validation that DynamoDB lacks",
            "ElastiCache acts as an in-memory caching layer to reduce DynamoDB read latency and costs for read-heavy workloads",
            "ElastiCache stores DynamoDB backups more cost-effectively than S3",
            "ElastiCache enables SQL queries against DynamoDB data",
          ],
          correctIndex: 1,
          explanation:
            "For read-heavy workloads, ElastiCache (Redis) acts as an in-memory cache in front of DynamoDB. The application reads from ElastiCache first and only queries DynamoDB on a cache miss, reducing latency to microseconds and lowering read costs.",
        },
      ],
    },
  ],

  keyFacts: [
    "DynamoDB is a fully managed, serverless NoSQL key-value and document database",
    "No servers to manage — AWS handles all database administration",
    "Delivers single-digit millisecond performance at any scale",
    "Every table has a primary key: partition key alone, or partition key + sort key",
    "On-Demand mode: pay per request, no capacity planning; Provisioned mode: specify RCU/WCU",
    "Automatically replicates across 3 AZs within a region for high availability",
    "Global Tables replicate across multiple regions for global low latency and disaster recovery",
    "Point-in-Time Recovery (PITR) allows restore to any second in the past 35 days",
    "DynamoDB Streams captures item-level changes for event-driven processing",
    "Global Secondary Indexes (GSIs) allow querying by non-primary key attributes",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon ElastiCache",
    "Amazon S3",
    "Amazon Kinesis",
    "Amazon DynamoDB Accelerator (DAX)",
  ],

  examTips: [
    "DynamoDB is NoSQL — schema-less, optimized for key-value access, not SQL joins",
    "On-demand mode = simpler, pay per request; provisioned mode = cheaper for steady traffic",
    "Global Tables = multi-region, multi-master replication for global apps",
    "DynamoDB Streams + Lambda = event-driven reactions to database changes",
    "PITR enables restore to any point in the past 35 days — enable it for production",
    "DynamoDB automatically replicates across 3 AZs — no configuration needed",
    "Use GSIs to query by attributes other than the primary key",
    "DAX (DynamoDB Accelerator) is an in-memory cache for DynamoDB — microsecond latency",
  ],

  topicQuiz: [
    {
      question:
        "Which AWS database service is best suited for an application that needs to look up user sessions by session ID with single-digit millisecond performance at any scale?",
      options: [
        "Amazon RDS with Multi-AZ",
        "Amazon Redshift",
        "Amazon DynamoDB",
        "Amazon Aurora",
      ],
      correctIndex: 2,
      explanation:
        "DynamoDB is a NoSQL key-value database designed for single-digit millisecond performance at any scale. Looking up sessions by a key (session ID) is exactly the access pattern DynamoDB is optimized for.",
    },
    {
      question:
        "A DynamoDB table needs to support queries by both 'email address' and 'username' in addition to the primary key. What feature enables this?",
      options: [
        "DynamoDB Streams",
        "Global Secondary Indexes (GSIs)",
        "Point-in-Time Recovery",
        "DynamoDB Accelerator (DAX)",
      ],
      correctIndex: 1,
      explanation:
        "Global Secondary Indexes (GSIs) create alternate views of the table with different partition and sort keys, allowing queries on attributes other than the primary key, such as email address or username.",
    },
    {
      question:
        "What is the difference between DynamoDB On-Demand mode and Provisioned mode?",
      options: [
        "On-Demand is only available in us-east-1; Provisioned is available globally",
        "On-Demand automatically scales with pay-per-request pricing; Provisioned requires you to specify RCU/WCU capacity",
        "On-Demand supports only eventually consistent reads; Provisioned supports strongly consistent reads",
        "On-Demand is for small tables under 10 GB; Provisioned is for larger tables",
      ],
      correctIndex: 1,
      explanation:
        "On-Demand mode automatically scales to any traffic level with pay-per-request pricing — ideal for unpredictable workloads. Provisioned mode requires you to specify Read and Write Capacity Units, which is more cost-effective for predictable, steady-state traffic.",
    },
    {
      question: "DynamoDB Global Tables provide which capabilities?",
      options: [
        "Single-region replication across 6 Availability Zones",
        "Multi-region, multi-master replication with automatic propagation of changes",
        "Cross-account table sharing without replication",
        "Read-only replicas in other regions, with writes only in the primary region",
      ],
      correctIndex: 1,
      explanation:
        "DynamoDB Global Tables create a fully replicated, multi-master table across multiple AWS regions. Any region can serve both reads and writes, and changes are automatically propagated to all other regions within seconds.",
    },
    {
      question:
        "A developer accidentally deleted thousands of items from a production DynamoDB table. Which feature allows them to recover the data?",
      options: [
        "DynamoDB Streams — replay the delete events in reverse",
        "Point-in-Time Recovery (PITR) — restore to any second in the past 35 days",
        "Global Tables — failover to another region's copy",
        "DynamoDB Accelerator (DAX) — retrieve items from the in-memory cache",
      ],
      correctIndex: 1,
      explanation:
        "Point-in-Time Recovery (PITR) continuously backs up the table and allows restoration to any second within the past 35 days. This is the correct tool for recovering from accidental data deletion or corruption.",
    },
    {
      question:
        "How does DynamoDB achieve high availability within an AWS region by default?",
      options: [
        "It stores a single copy of data on highly reliable SSD storage",
        "It automatically replicates data across three Availability Zones",
        "It requires you to configure Multi-AZ like RDS",
        "It stores data across multiple regions by default",
      ],
      correctIndex: 1,
      explanation:
        "DynamoDB automatically replicates data across three Availability Zones within a region, providing high availability and durability with no configuration required. This is different from RDS Multi-AZ, which requires explicit configuration.",
    },
    {
      question: "What is the primary use case for DynamoDB Streams?",
      options: [
        "Streaming analytics data to Amazon Kinesis for real-time dashboards",
        "Capturing item-level changes to enable event-driven processing with other services like Lambda",
        "Streaming table backups to Amazon S3 continuously",
        "Providing a real-time feed of DynamoDB metrics to CloudWatch",
      ],
      correctIndex: 1,
      explanation:
        "DynamoDB Streams captures a time-ordered sequence of item-level changes (inserts, updates, deletes). The most common use case is triggering Lambda functions to react to these changes in near-real-time, enabling event-driven architectures.",
    },
    {
      question:
        "Which DynamoDB feature provides in-memory caching with microsecond read latency?",
      options: [
        "DynamoDB Streams",
        "Global Secondary Indexes",
        "DynamoDB Accelerator (DAX)",
        "DynamoDB Global Tables",
      ],
      correctIndex: 2,
      explanation:
        "DynamoDB Accelerator (DAX) is a fully managed, in-memory cache for DynamoDB that delivers microsecond read latency. It sits in front of DynamoDB and serves cached reads without hitting the main table, reducing both latency and read capacity consumption.",
    },
  ],
};
