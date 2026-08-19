import { ServiceGuide } from "../../../types/guide";

export const dynamodbGuide: ServiceGuide = {
  id: "clf-dynamodb",
  service: "Amazon DynamoDB",
  domain: "development",
  tagline: "Fully managed NoSQL database with single-digit millisecond performance",
  intro:
    "Amazon DynamoDB is a fully managed, serverless NoSQL database that delivers fast and predictable performance at any scale, with no servers to manage, no database administration tasks, and automatic scaling to handle any amount of traffic.",

  sections: [
    {
      heading: "What Is DynamoDB?",
      body: `DynamoDB is a **NoSQL** (non-relational) database, which means it does not use tables with fixed schemas and SQL queries in the traditional sense. Instead, DynamoDB stores **items** (analogous to rows) in **tables**, where each item can have a different set of **attributes** (analogous to columns). This schema-less nature makes it flexible for evolving data models.

The key difference from relational databases like RDS is that DynamoDB is optimized for **key-value and document access patterns** rather than complex ad-hoc queries with joins. If your application primarily accesses data by a specific key (user ID, order ID, session token), DynamoDB is an excellent fit. If your application needs complex multi-table joins or ad-hoc reporting queries, a relational database may be more appropriate.

DynamoDB is **fully managed and serverless** — there is no database engine to install, no infrastructure to manage, and no capacity to provision manually (in on-demand mode). It scales to handle millions of requests per second automatically.`,
    },
    {
      heading: "Keys and Data Model",
      body: `Every DynamoDB table has a **primary key** that uniquely identifies each item. There are two types:

A **Simple Primary Key** consists of just a **Partition Key** (also called a hash key). DynamoDB uses the partition key to determine which physical partition stores the item. All items with the same partition key are in the same partition.

A **Composite Primary Key** combines a **Partition Key** and a **Sort Key** (range key). Items with the same partition key are stored together and sorted by the sort key, allowing efficient range queries within a partition.

For example, a table of user orders might use \`userId\` as the partition key and \`orderId\` as the sort key. You can then query "all orders for user 123" efficiently.

**Attributes** are the data fields of an item — DynamoDB supports strings, numbers, booleans, binary data, lists, maps, and sets. There is no fixed schema; each item can have different attributes beyond the required key attributes.

**Global Secondary Indexes (GSIs)** allow you to query the table by attributes other than the primary key, creating an alternate view of the data with a different partition key and sort key.`,
    },
    {
      heading: "Capacity and Scaling",
      body: `DynamoDB offers two capacity modes that determine how throughput is provisioned and billed.

**On-Demand Mode** (the simpler option) automatically scales to accommodate any traffic level. You pay per request — per read request unit (RRU) and write request unit (WRU) — with no capacity planning needed. This mode is ideal for unpredictable traffic, new applications, or workloads with significant spikes.

**Provisioned Mode** requires you to specify the number of **Read Capacity Units (RCUs)** and **Write Capacity Units (WCUs)** per second your table needs. You can enable **Auto Scaling** to automatically adjust provisioned capacity based on actual traffic, keeping utilization near a target percentage. Provisioned mode is more cost-effective for predictable, steady traffic.

One RCU supports one strongly consistent read (or two eventually consistent reads) of an item up to 4 KB per second. One WCU supports one write of an item up to 1 KB per second. For the Cloud Practitioner exam, you do not need to calculate RCUs and WCUs — just understand that capacity modes exist and on-demand is simpler.`,
    },
    {
      heading: "Global Tables and High Availability",
      body: `DynamoDB is designed from the ground up for high availability. It automatically replicates data across **three Availability Zones** within an AWS region, ensuring your table survives the loss of any single AZ with no action on your part.

**DynamoDB Global Tables** extend this replication across **multiple AWS regions**, creating a fully replicated, multi-master table. Any region can serve both reads and writes, and DynamoDB automatically propagates changes to all other regions within seconds. Global Tables provide **extremely low latency** for globally distributed applications and act as a built-in disaster recovery solution — if a region fails, your application can seamlessly use another region.

**Point-in-Time Recovery (PITR)** continuously backs up your table and lets you restore it to any second within the past 35 days. Enabling PITR is a best practice for production tables. **On-demand backups** create a full backup of your table at any point in time, stored until you delete them.`,
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

DynamoDB is also commonly used with **Amazon ElastiCache** (Redis) as a caching layer. For read-heavy workloads, your application reads from ElastiCache first and only queries DynamoDB on a cache miss, reducing latency and read costs.`,
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
};
