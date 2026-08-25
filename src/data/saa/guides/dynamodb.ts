import { ServiceGuide } from "../../../types/guide";

export const dynamodbGuide: ServiceGuide = {
  id: "saa-dynamodb",
  service: "Amazon DynamoDB",
  domain: "development",
  tagline:
    "Serverless NoSQL database delivering single-digit millisecond performance at any scale",
  intro:
    "Amazon DynamoDB is a fully managed, serverless NoSQL key-value and document database that delivers consistent single-digit millisecond performance at any scale, making it the go-to choice for high-throughput, low-latency applications that outgrow relational databases.",

  sections: [
    {
      heading: "Data Model: Tables, Items, and Keys",
      body: `DynamoDB organizes data into tables, where each item (row) is identified by a primary key. A simple primary key consists of a single partition key, while a composite primary key combines a partition key with a sort key. The partition key determines which physical partition stores the item — DynamoDB uses consistent hashing internally — so choosing a high-cardinality partition key that distributes access evenly is critical to avoiding hot partitions. The sort key enables range queries and sorting within a partition, making composite keys natural for time-series data (user ID as partition, timestamp as sort), hierarchical data, and one-to-many relationships. Items can have different attributes; unlike relational tables, DynamoDB does not enforce a fixed schema beyond the primary key, allowing flexible, evolving data models. Attribute types include strings, numbers, binary, sets, lists, maps, and booleans.`,
    },
    {
      heading: "Read and Write Capacity: Provisioned vs. On-Demand",
      body: `DynamoDB offers two capacity modes. Provisioned capacity requires you to specify Read Capacity Units (RCUs) and Write Capacity Units (WCUs) — one RCU supports one strongly consistent read or two eventually consistent reads per second for items up to 4 KB, while one WCU supports one write per second for items up to 1 KB. Provisioned mode is cost-effective for predictable, steady-state workloads and supports Auto Scaling to adjust capacity within defined bounds. On-Demand capacity mode eliminates capacity planning entirely — DynamoDB instantly accommodates any request rate and charges per request, making it ideal for new applications with unknown traffic, unpredictable spikes, or development environments. Switching between modes is possible once per 24 hours; choose On-Demand for variable workloads and Provisioned with Auto Scaling for stable, cost-sensitive workloads.`,
    },
    {
      heading: "Global Secondary Indexes and Local Secondary Indexes",
      body: `DynamoDB indexes extend query flexibility beyond the primary key. A Local Secondary Index (LSI) shares the same partition key as the base table but uses a different sort key, enabling alternate sort orders within a partition. LSIs must be created at table creation time, share the table's throughput, and support both eventually and strongly consistent reads. A Global Secondary Index (GSI) can use any attribute as partition and sort keys, spanning the entire table regardless of the base table's partition key. GSIs have their own provisioned throughput separate from the base table and support only eventually consistent reads. You can create up to 20 GSIs after table creation. When designing for query patterns, work backwards from the queries your application needs — each unique access pattern typically maps to either the primary key or a GSI, and DynamoDB schemas are often query-driven rather than entity-driven as in relational modeling.`,
    },
    {
      heading: "DynamoDB Streams and Event-Driven Architecture",
      body: `DynamoDB Streams capture an ordered sequence of item-level changes in a DynamoDB table — creates, updates, and deletes — and make them available for up to 24 hours. Stream records can include the new image (state after the change), the old image (state before), both, or just the key attributes. This enables powerful event-driven patterns: a Lambda function triggered by a stream can replicate changes to Elasticsearch for full-text search, send notifications via SNS, maintain aggregate counts in another table, or replicate data to another region before Global Tables existed. DynamoDB Streams combined with Lambda is the standard pattern for change data capture (CDC) on DynamoDB, and it underpins audit logging, cross-table consistency, and real-time dashboards. Each shard in a DynamoDB Stream is processed by at most one Lambda concurrent execution, so Lambda scales with the number of shards automatically.`,
    },
    {
      heading: "Global Tables and Multi-Region Replication",
      body: `DynamoDB Global Tables provide fully managed, multi-region, multi-active replication, allowing applications to read and write to any replica table in any configured region with automatic conflict resolution (last-writer-wins based on timestamps). Global Tables are built on DynamoDB Streams and require streams to be enabled. This architecture is ideal for globally distributed applications where users in different continents need low-latency access to the same dataset, and for disaster recovery with an RPO of seconds and an RTO of minutes. Unlike read replicas in RDS, Global Table replicas accept both reads and writes — making them active-active rather than active-passive. Adding a region to a Global Table live-streams existing data to the new region automatically. Global Tables version 2019.11.21 is the current version and should be used for all new implementations.`,
    },
    {
      heading: "DynamoDB Accelerator (DAX) for Caching",
      body: `DynamoDB Accelerator (DAX) is a fully managed, in-memory cache for DynamoDB that delivers microsecond read latency for eventually consistent reads without requiring application code changes beyond swapping the DynamoDB client for the DAX client. DAX is cluster-based, deployed inside your VPC, and maintains a write-through cache — writes go to DynamoDB and DAX simultaneously, keeping the cache consistent. It is most beneficial for read-heavy workloads with repeated access to the same items: product catalogs, session stores, and leaderboards are common examples. DAX does not help with write-heavy workloads, strongly consistent reads (which bypass the cache and go directly to DynamoDB), or infrequently accessed data where cache hit rates would be low. For strongly consistent read requirements, ElastiCache is the alternative caching layer. DAX clusters support Multi-AZ deployment for high availability.`,
    },
  ],

  keyFacts: [
    "DynamoDB uses partition key (hash) for distribution; composite keys add a sort key for range queries",
    "1 RCU = 1 strongly consistent read OR 2 eventually consistent reads per second for ≤4 KB items",
    "1 WCU = 1 write per second for items ≤1 KB",
    "On-Demand mode scales instantly with no capacity planning; Provisioned is cheaper for steady workloads",
    "LSIs must be created at table creation; GSIs can be added/removed after creation",
    "DynamoDB Streams retain change records for 24 hours — ideal for Lambda-driven CDC patterns",
    "Global Tables provide multi-region, multi-active replication with last-writer-wins conflict resolution",
    "DAX delivers microsecond read latency as a write-through in-memory cache",
    "Hot partitions occur with low-cardinality partition keys — choose high-cardinality keys",
    "GSIs have eventually consistent reads only; LSIs support both consistent and eventually consistent reads",
  ],

  relatedServices: [
    "AWS Lambda",
    "DynamoDB Accelerator (DAX)",
    "Amazon Kinesis Data Streams",
    "Amazon S3",
    "AWS AppSync",
    "Amazon ElastiCache",
  ],

  examTips: [
    "Hot partition = bad partition key choice — use high-cardinality attributes or add a random suffix",
    "LSI must be created at table creation; GSI can be added later — know this difference",
    "DynamoDB Streams + Lambda is the standard CDC pattern — not Kinesis for DynamoDB changes",
    "Global Tables are multi-active (read AND write in every region) — not just read replicas",
    "DAX only improves eventually consistent reads — strongly consistent reads bypass the cache",
    "On-Demand mode is the answer when traffic is truly unpredictable or bursty",
    "Provisioned + Auto Scaling is cost-optimized for known, steady traffic patterns",
    "Scan reads every item in a table — avoid it at scale; use Query with a partition key instead",
  ],
};
