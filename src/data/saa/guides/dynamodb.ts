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
      quiz: [
        {
          question:
            "A DynamoDB table stores user activity events. The design uses userId as the partition key and timestamp as the sort key. What type of primary key is this?",
          options: [
            "Local secondary index key",
            "Global secondary index key",
            "Simple primary key — a single partition key",
            "Composite primary key — a partition key combined with a sort key",
          ],
          correctIndex: 3,
          explanation:
            "A composite primary key combines a partition key (userId) with a sort key (timestamp). This enables range queries and sorting within a user's partition, making it natural for time-series and one-to-many data.",
        },
        {
          question:
            "Why is choosing a high-cardinality partition key critical in DynamoDB?",
          options: [
            "DynamoDB charges more for low-cardinality partition keys",
            "Low-cardinality keys cause hot partitions, concentrating access on a few physical partitions and limiting throughput",
            "DynamoDB requires partition keys to have at least 1,000 unique values",
            "High-cardinality keys enable strongly consistent reads across all partitions",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB uses consistent hashing to distribute items across partitions based on the partition key. A low-cardinality key (e.g., status with values 'active'/'inactive') creates hot partitions where most traffic is concentrated, exhausting the throughput of a few partitions while others are idle.",
        },
        {
          question:
            "What schema constraints does DynamoDB enforce beyond the primary key?",
          options: [
            "All attributes must be declared at table creation with specific data types",
            "Items must have at least 5 attributes",
            "No schema constraints beyond the primary key — items can have different attributes",
            "All string attributes must not exceed 400 KB per item",
          ],
          correctIndex: 2,
          explanation:
            "DynamoDB is schemaless beyond the primary key. Items in the same table can have completely different sets of attributes, enabling flexible and evolving data models without schema migrations.",
        },
      ],
    },
    {
      heading: "Read and Write Capacity: Provisioned vs. On-Demand",
      body: `DynamoDB offers two capacity modes. Provisioned capacity requires you to specify Read Capacity Units (RCUs) and Write Capacity Units (WCUs) — one RCU supports one strongly consistent read or two eventually consistent reads per second for items up to 4 KB, while one WCU supports one write per second for items up to 1 KB. For items larger than 4 KB, DynamoDB rounds up to the nearest 4 KB boundary using ceiling division: a 6 KB item requires ceiling(6 / 4) = 2 RCUs per strongly consistent read, and a 9 KB item requires ceiling(9 / 4) = 3 RCUs. To calculate the total RCUs needed, multiply the per-item RCU cost by the number of reads per second — for example, 10 strongly consistent reads per second of 6 KB items requires 10 × 2 = 20 RCUs. The same ceiling rule applies to WCUs: a 2.5 KB item requires ceiling(2.5 / 1) = 3 WCUs per write. Provisioned mode is cost-effective for predictable, steady-state workloads and supports Auto Scaling to adjust capacity within defined bounds. On-Demand capacity mode eliminates capacity planning entirely — DynamoDB instantly accommodates any request rate and charges per request, making it ideal for new applications with unknown traffic, unpredictable spikes, or development environments. Switching between modes is possible once per 24 hours; choose On-Demand for variable workloads and Provisioned with Auto Scaling for stable, cost-sensitive workloads.`,
      quiz: [
        {
          question:
            "How many eventually consistent reads per second does 1 RCU support for items up to 4 KB?",
          options: ["0.5", "2", "1", "4"],
          correctIndex: 1,
          explanation:
            "One RCU supports one strongly consistent read OR two eventually consistent reads per second for items up to 4 KB. Eventually consistent reads are cheaper because they may return slightly stale data by reading from any replica.",
        },
        {
          question:
            "A startup is launching a new mobile app with completely unknown traffic patterns. Which DynamoDB capacity mode is most appropriate?",
          options: [
            "On-Demand — eliminates capacity planning and accommodates any request rate instantly",
            "Provisioned with Auto Scaling set to 0 minimum",
            "On-Demand for reads, Provisioned for writes",
            "Provisioned with a very high maximum to handle worst-case traffic",
          ],
          correctIndex: 0,
          explanation:
            "On-Demand capacity mode is ideal for new applications with unknown traffic patterns. DynamoDB instantly scales to handle any volume without capacity planning, and you pay per request rather than for pre-allocated capacity.",
        },
      ],
    },
    {
      heading: "Global Secondary Indexes and Local Secondary Indexes",
      body: `DynamoDB indexes extend query flexibility beyond the primary key. A Local Secondary Index (LSI) shares the same partition key as the base table but uses a different sort key, enabling alternate sort orders within a partition. LSIs must be created at table creation time, share the table's throughput, and support both eventually and strongly consistent reads. A Global Secondary Index (GSI) can use any attribute as partition and sort keys, spanning the entire table regardless of the base table's partition key. GSIs have their own provisioned throughput separate from the base table and support only eventually consistent reads. You can create up to 20 GSIs after table creation. When designing for query patterns, work backwards from the queries your application needs — each unique access pattern typically maps to either the primary key or a GSI, and DynamoDB schemas are often query-driven rather than entity-driven as in relational modeling.`,
      quiz: [
        {
          question:
            "A DynamoDB table was created without an LSI. The team now needs to query by a different sort key on the same partition. What is the only option?",
          options: [
            "Alter the table to add an LSI after creation",
            "Create a Global Secondary Index (GSI) which can be added after table creation",
            "Use a DynamoDB Stream to backfill a new table with an LSI",
            "LSIs cannot be added after creation; the table must be deleted and recreated",
          ],
          correctIndex: 1,
          explanation:
            "LSIs must be created at table creation time and cannot be added later. GSIs can be created and deleted after table creation, making them the only way to add new query patterns to an existing table.",
        },
        {
          question:
            "Which statement about Global Secondary Index (GSI) reads is correct?",
          options: [
            "GSIs support both strongly consistent and eventually consistent reads",
            "GSI read consistency depends on the base table's consistency setting",
            "GSIs support only strongly consistent reads",
            "GSIs support only eventually consistent reads",
          ],
          correctIndex: 3,
          explanation:
            "GSIs support only eventually consistent reads. Strongly consistent reads are only available on the base table or LSIs. This is a key difference between GSIs and LSIs that the exam frequently tests.",
        },
      ],
    },
    {
      heading: "DynamoDB Streams and Event-Driven Architecture",
      body: `DynamoDB Streams capture an ordered sequence of item-level changes in a DynamoDB table — creates, updates, and deletes — and make them available for up to 24 hours. Stream records can include the new image (state after the change), the old image (state before), both, or just the key attributes. This enables powerful event-driven patterns: a Lambda function triggered by a stream can replicate changes to Elasticsearch for full-text search, send notifications via SNS, maintain aggregate counts in another table, or replicate data to another region before Global Tables existed. DynamoDB Streams combined with Lambda is the standard pattern for change data capture (CDC) on DynamoDB, and it underpins audit logging, cross-table consistency, and real-time dashboards. Each shard in a DynamoDB Stream is processed by at most one Lambda concurrent execution, so Lambda scales with the number of shards automatically.`,
      quiz: [
        {
          question:
            "How long are DynamoDB Stream records retained before they expire?",
          options: ["7 days", "12 hours", "1 hour", "24 hours"],
          correctIndex: 3,
          explanation:
            "DynamoDB Stream records are retained for 24 hours. After this window, records are no longer available for processing. This is sufficient for near-real-time CDC patterns but not for long-term replay.",
        },
        {
          question:
            "Which DynamoDB Stream view type captures both the state of an item before and after a modification?",
          options: [
            "KEYS_ONLY",
            "OLD_IMAGE",
            "NEW_AND_OLD_IMAGES",
            "NEW_IMAGE",
          ],
          correctIndex: 2,
          explanation:
            "The NEW_AND_OLD_IMAGES stream view type captures both the old item state (before the change) and the new item state (after the change). This is useful for audit logging and computing diffs between versions.",
        },
      ],
    },
    {
      heading: "Global Tables and Multi-Region Replication",
      body: `DynamoDB Global Tables provide fully managed, multi-region, multi-active replication, allowing applications to read and write to any replica table in any configured region with automatic conflict resolution (last-writer-wins based on timestamps). Global Tables are built on DynamoDB Streams and require streams to be enabled. This architecture is ideal for globally distributed applications where users in different continents need low-latency access to the same dataset, and for disaster recovery with an RPO of seconds and an RTO of minutes. Unlike read replicas in RDS, Global Table replicas accept both reads and writes — making them active-active rather than active-passive. Adding a region to a Global Table live-streams existing data to the new region automatically. Global Tables version 2019.11.21 is the current version and should be used for all new implementations.`,
      quiz: [
        {
          question:
            "What conflict resolution strategy does DynamoDB Global Tables use when two replicas receive concurrent writes to the same item?",
          options: [
            "The write in the primary region always wins",
            "The write with the highest timestamp wins (last-writer-wins)",
            "Both writes are preserved and merged using CRDT logic",
            "A conflict exception is thrown and the application must resolve it",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB Global Tables use last-writer-wins conflict resolution based on timestamps. The write with the highest timestamp is accepted, and the conflicting write is discarded. Applications should design for this behavior.",
        },
        {
          question:
            "How do DynamoDB Global Table replicas differ from RDS read replicas?",
          options: [
            "Global Table replicas are read-only; RDS read replicas can accept writes",
            "Global Table replicas accept both reads and writes (active-active); RDS read replicas are read-only (active-passive)",
            "Global Table replicas are synchronously replicated; RDS read replicas are asynchronous",
            "Global Tables require manual failover; RDS read replicas support automatic failover",
          ],
          correctIndex: 1,
          explanation:
            "DynamoDB Global Table replicas are multi-active — all replicas accept both reads and writes simultaneously. RDS read replicas are read-only and require promotion to accept writes, making them active-passive rather than active-active.",
        },
      ],
    },
    {
      heading: "DynamoDB Accelerator (DAX) for Caching",
      body: `DynamoDB Accelerator (DAX) is a fully managed, in-memory cache for DynamoDB that delivers microsecond read latency for eventually consistent reads without requiring application code changes beyond swapping the DynamoDB client for the DAX client. DAX is cluster-based, deployed inside your VPC, and maintains a write-through cache — writes go to DynamoDB and DAX simultaneously, keeping the cache consistent. It is most beneficial for read-heavy workloads with repeated access to the same items: product catalogs, session stores, and leaderboards are common examples. DAX does not help with write-heavy workloads, strongly consistent reads (which bypass the cache and go directly to DynamoDB), or infrequently accessed data where cache hit rates would be low. For strongly consistent read requirements, ElastiCache is the alternative caching layer. DAX clusters support Multi-AZ deployment for high availability.`,
      quiz: [
        {
          question:
            "A DynamoDB table serves a product catalog that is read thousands of times per second but rarely updated. Which caching option delivers microsecond read latency with minimal code changes?",
          options: [
            "CloudFront with DynamoDB as a custom origin",
            "Amazon ElastiCache Redis with lazy loading",
            "DynamoDB On-Demand mode with Global Tables",
            "DynamoDB Accelerator (DAX) — swap the DynamoDB client for the DAX client",
          ],
          correctIndex: 3,
          explanation:
            "DAX delivers microsecond read latency for eventually consistent reads with minimal code changes — just swap the DynamoDB client for the DAX client. It is purpose-built for DynamoDB and maintains a write-through cache.",
        },
        {
          question: "When does DAX NOT improve DynamoDB read performance?",
          options: [
            "For strongly consistent reads, which bypass the DAX cache and go directly to DynamoDB",
            "For session stores accessed by millions of users",
            "For product catalog lookups with high read frequency",
            "For leaderboard data read by gaming clients",
          ],
          correctIndex: 0,
          explanation:
            "Strongly consistent reads bypass the DAX cache and are served directly from DynamoDB, so DAX provides no latency benefit for them. DAX is most beneficial for eventually consistent reads on frequently accessed items.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A DynamoDB table has a partition key of 'status' with values 'active' or 'inactive'. What problem will this cause at scale?",
      options: [
        "Hot partitions — all traffic concentrates on one of two physical partitions, exhausting their throughput",
        "DynamoDB will refuse to store items with only two partition key values",
        "Global Tables cannot replicate tables with low-cardinality partition keys",
        "Items cannot be queried without a sort key when there are only two partition key values",
      ],
      correctIndex: 0,
      explanation:
        "A low-cardinality partition key like 'status' creates hot partitions because all traffic for 'active' items goes to one partition. The solution is to choose a high-cardinality key or add a random suffix to distribute writes.",
    },
    {
      question:
        "Which DynamoDB index type must be created at table creation time and shares the base table's provisioned throughput?",
      options: [
        "Primary Index",
        "Global Secondary Index (GSI)",
        "Local Secondary Index (LSI)",
        "Composite Index",
      ],
      correctIndex: 2,
      explanation:
        "Local Secondary Indexes (LSIs) must be defined when the table is created — they cannot be added or removed afterward. LSIs share the base table's provisioned throughput and support both strongly consistent and eventually consistent reads.",
    },
    {
      question:
        "A Lambda function should be triggered automatically whenever a DynamoDB item is created or updated. Which feature enables this?",
      options: [
        "DynamoDB Streams with a Lambda event source mapping",
        "DynamoDB Global Tables replication events",
        "Amazon EventBridge with a DynamoDB change rule",
        "CloudWatch metric filter on DynamoDB write metrics",
      ],
      correctIndex: 0,
      explanation:
        "DynamoDB Streams capture item-level changes (creates, updates, deletes) and Lambda event source mappings process stream records automatically. This is the standard change data capture (CDC) pattern for DynamoDB.",
    },
    {
      question:
        "A globally distributed gaming application needs to allow players in US and EU to write to the same DynamoDB table with low latency. Which feature enables this?",
      options: [
        "DynamoDB Global Tables providing multi-region, multi-active replication",
        "DAX clusters deployed in multiple regions with a shared cache",
        "Cross-region read replicas with manual failover",
        "DynamoDB Streams replicating data between two separate regional tables",
      ],
      correctIndex: 0,
      explanation:
        "DynamoDB Global Tables provide fully managed multi-region, multi-active replication. All replicas accept both reads and writes, giving players in each region low-latency access to the same data with automatic conflict resolution.",
    },
    {
      question:
        "How many Read Capacity Units (RCUs) are required to perform 10 strongly consistent reads per second of items that are 6 KB each?",
      options: ["20", "10", "30", "15"],
      correctIndex: 0,
      explanation:
        "One RCU supports one strongly consistent read per second for items up to 4 KB. A 6 KB item requires 2 RCUs (ceiling of 6/4). For 10 reads/second: 10 × 2 = 20 RCUs.",
    },
    {
      question:
        "An existing DynamoDB table needs a new query pattern that filters by email address. The email attribute is not part of the primary key. What is the solution?",
      options: [
        "Create a Local Secondary Index on the email attribute",
        "Recreate the table with email as a sort key in a composite primary key",
        "Use a Scan with a FilterExpression on the email attribute",
        "Create a Global Secondary Index (GSI) with email as the partition key",
      ],
      correctIndex: 3,
      explanation:
        "A Global Secondary Index (GSI) with email as the partition key enables efficient queries on email. Unlike LSIs, GSIs can be added after table creation. Scan is inefficient at scale as it reads every item in the table.",
    },
    {
      question:
        "Which DynamoDB caching solution requires the least application code change to implement?",
      options: [
        "Amazon ElastiCache Redis with lazy loading pattern",
        "DynamoDB Accelerator (DAX) — swap the DynamoDB client for the DAX client",
        "Amazon CloudFront caching DynamoDB API responses",
        "AWS AppSync with built-in DynamoDB caching",
      ],
      correctIndex: 1,
      explanation:
        "DAX requires only swapping the DynamoDB SDK client for the DAX client — all existing DynamoDB API calls work without modification. ElastiCache requires implementing the caching pattern (lazy loading or write-through) in application code.",
    },
    {
      question:
        "A company needs a DynamoDB table that can handle unpredictable traffic spikes without throttling errors and without the overhead of capacity management. Which capacity mode should be used?",
      options: [
        "Provisioned with Auto Scaling and a wide max capacity",
        "DAX with On-Demand reads and Provisioned writes",
        "On-Demand — instantly accommodates any request rate with no capacity planning",
        "Provisioned with reserved capacity purchases for cost savings",
      ],
      correctIndex: 2,
      explanation:
        "On-Demand capacity mode instantly handles any request rate without throttling, with no capacity planning required. It charges per request rather than for pre-allocated capacity, making it ideal for unpredictable or highly variable workloads.",
    },
  ],
};
