import { ServiceGuide } from "../../../types/guide";

export const dynamodbGuide: ServiceGuide = {
  id: "amazon-dynamodb",
  service: "Amazon DynamoDB",
  domain: "development",
  tagline:
    "Serverless NoSQL database with single-digit millisecond performance at any scale",
  intro:
    "DynamoDB is a fully managed, serverless key-value and document database. It provides consistent single-digit millisecond latency at any scale, with built-in high availability across multiple AZs.",

  sections: [
    {
      heading: "Data Model",
      body: `DynamoDB stores data as **items** (analogous to rows) in **tables**. Each item is a collection of **attributes** — typed fields that can be strings, numbers, binaries, booleans, nulls, lists, maps, or sets. Unlike relational databases, DynamoDB has a flexible schema: different items in the same table can have completely different attributes. The only constraint is the primary key, which every item must have.

The **primary key** is defined at table creation and cannot be changed. A **simple primary key** uses only a **partition key** (hash key) — each item must have a unique partition key value. A **composite primary key** uses a **partition key plus a sort key** (range key) — multiple items can share a partition key as long as their sort keys are distinct within that partition. The composite key model is what enables rich query patterns within a partition, like "all orders for user X" where user ID is the partition key and order timestamp is the sort key.

Individual items are limited to **400 KB** each, but tables can grow to petabyte scale as DynamoDB partitions data automatically. Attribute types are String (S), Number (N), Binary (B), Boolean (BOOL), Null (NULL), List (L), Map (M), and Set variants (SS, NS, BS).`,
      quiz: [
        {
          question: "What is the maximum size of a single DynamoDB item?",
          options: ["400 KB", "64 KB", "1 MB", "10 MB"],
          correctIndex: 0,
          explanation:
            "Each DynamoDB item is limited to 400 KB. For larger data, store the payload in S3 and keep a reference in DynamoDB.",
        },
        {
          question:
            "A composite primary key in DynamoDB consists of which two components?",
          options: [
            "Partition key and Global Secondary Index",
            "Primary key and foreign key",
            "Hash key and range key are two separate systems",
            "Partition key and sort key",
          ],
          correctIndex: 3,
          explanation:
            "A composite primary key uses a partition key (hash key) plus a sort key (range key). Multiple items can share the same partition key as long as their sort keys are unique within that partition.",
        },
        {
          question: "Which statement about DynamoDB's schema is correct?",
          options: [
            "Different items in the same table can have completely different attributes",
            "All items in a table must have the same attributes",
            "Attributes must be declared before writing items",
            "DynamoDB has a fixed schema defined at table creation",
          ],
          correctIndex: 0,
          explanation:
            "DynamoDB has a flexible schema — different items in the same table can have completely different attributes. The only required attributes are those that form the primary key.",
        },
      ],
    },
    {
      heading: "Partition Key Design",
      body: `The partition key is one of the most important design decisions in DynamoDB. DynamoDB hashes the partition key value and uses the hash to route each item to a specific physical partition. Each partition has a throughput ceiling of **3,000 RCU** and **1,000 WCU** — if too much traffic concentrates on a small number of partition key values, you'll hit those limits, causing throttling.

The goal is **high cardinality** — many distinct partition key values — so that traffic distributes evenly across many partitions. User IDs, order IDs, device IDs, and UUIDs make excellent partition keys because each represents a distinct user, order, or device. Status fields (active/inactive), country codes, or boolean flags make terrible partition keys because they concentrate all traffic into just a few partitions, creating "hot" partitions that throttle.

When you genuinely need to use a low-cardinality value as part of your access pattern, **write sharding** is the standard solution. Append a random or computed suffix to the key value — for example, \`status#3\` instead of just \`status\` — distributing writes across N virtual partitions. Reads then need to query all N shards and aggregate the results. For time-series data, avoid using just a date as the partition key (all today's writes go to one partition). Instead, include a more selective component like a device ID or user ID.`,
      quiz: [
        {
          question:
            "What is the write capacity ceiling per DynamoDB partition?",
          options: ["500 WCU", "1,000 WCU", "3,000 WCU", "10,000 WCU"],
          correctIndex: 1,
          explanation:
            "Each DynamoDB partition supports up to 1,000 WCU and 3,000 RCU. Concentrating writes on a small number of partition key values causes throttling when these limits are reached.",
        },
        {
          question:
            "Why is a boolean 'isActive' field a poor choice for a DynamoDB partition key?",
          options: [
            "It creates too many partitions and increases cost",
            "Boolean attributes are not supported as partition keys",
            "It has low cardinality, concentrating all traffic into just two partitions",
            "DynamoDB cannot hash boolean values",
          ],
          correctIndex: 2,
          explanation:
            "A boolean field has only two possible values (true/false), meaning all writes go to one of only two partitions. This creates hot partitions that quickly hit throughput limits and throttle.",
        },
        {
          question:
            "What technique distributes writes for a low-cardinality partition key across multiple logical partitions?",
          options: [
            "Provisioned Auto Scaling",
            "Enabling DynamoDB Streams",
            "Creating a GSI with the same partition key",
            "Write sharding (appending a random suffix to the key value)",
          ],
          correctIndex: 3,
          explanation:
            "Write sharding appends a random or computed suffix to the partition key value (e.g., 'status#3') to distribute writes across N virtual partitions, preventing hot partition throttling.",
        },
      ],
    },
    {
      heading: "Read & Write Capacity",
      body: `DynamoDB offers two billing modes that determine how you pay for throughput.

In **provisioned mode**, you specify the number of Read Capacity Units (RCU) and Write Capacity Units (WCU) your table needs. One RCU supports one strongly consistent read of up to 4 KB per second, or two eventually consistent reads of the same size. One WCU supports one write of up to 1 KB per second. Transactional reads and writes cost twice as much (2 RCU per 4 KB, 2 WCU per 1 KB). Provisioned mode offers predictable costs and can use Auto Scaling to adjust capacity based on utilization targets. DynamoDB also retains up to 5 minutes of unused capacity as **burst capacity**, which can absorb short traffic spikes above your provisioned limits.

In **on-demand mode**, DynamoDB scales instantly to handle any request rate and you pay per request. It's more expensive per request but eliminates capacity planning — the table scales up to 2× the previous peak immediately. On-demand is the right choice for unpredictable or spiky workloads, new tables where traffic patterns are unknown, or any table where the cost of over-provisioning exceeds the per-request premium.

When provisioned capacity is exceeded, DynamoDB returns \`ProvisionedThroughputExceededException\`. Implement exponential backoff with jitter in your retry logic — the AWS SDK does this automatically for most operations.`,
      quiz: [
        {
          question:
            "How many RCUs does a strongly consistent read of a 4 KB item consume?",
          options: ["0.5 RCU", "2 RCU", "4 RCU", "1 RCU"],
          correctIndex: 3,
          explanation:
            "One RCU supports one strongly consistent read of up to 4 KB per second. Eventually consistent reads cost 0.5 RCU for the same size. Transactional reads cost 2 RCU per 4 KB.",
        },
        {
          question:
            "What exception does DynamoDB throw when provisioned throughput is exceeded?",
          options: [
            "ConditionalCheckFailedException",
            "ResourceNotFoundException",
            "ProvisionedThroughputExceededException",
            "ThrottlingException",
          ],
          correctIndex: 2,
          explanation:
            "DynamoDB throws ProvisionedThroughputExceededException when reads or writes exceed the provisioned capacity. The AWS SDK implements exponential backoff with jitter for retries automatically.",
        },
        {
          question:
            "Which DynamoDB capacity mode is best for a new table with completely unknown traffic patterns?",
          options: [
            "Reserved capacity mode",
            "On-demand mode",
            "Provisioned mode with maximum WCU set",
            "Provisioned mode with Auto Scaling",
          ],
          correctIndex: 1,
          explanation:
            "On-demand mode is ideal for new tables with unknown traffic patterns. It scales instantly to any request rate without capacity planning and eliminates the risk of under-provisioning.",
        },
      ],
    },
    {
      heading: "Indexes (GSI & LSI)",
      body: `DynamoDB's primary key structure limits how you can query items — you can only query efficiently by partition key. Indexes let you support additional query patterns on the same data without duplicating the entire table.

A **Local Secondary Index (LSI)** uses the same partition key as the base table but a different sort key. This lets you query the same set of items (within a partition) sorted or filtered by a different attribute. LSIs must be created at table creation time — you cannot add them later. Up to 5 LSIs are allowed per table, they share the table's read/write capacity, and they support strongly consistent reads. One important constraint: the total size of all items with the same partition key value across the table and all its LSIs cannot exceed 10 GB.

A **Global Secondary Index (GSI)** can have a completely different partition key and sort key than the base table — it's essentially a separate view of the data with its own query access pattern. GSIs can be added or deleted at any time after table creation. Each GSI has its own provisioned RCU and WCU (separate from the table's capacity), and they only support eventually consistent reads. A critical operational point: if a GSI's WCU is insufficient, writes to the base table that need to propagate to the GSI will be throttled — and those throttles surface as write failures on the base table.

Both index types use **projection** to control which attributes are copied into the index: KEYS_ONLY (just the key attributes), INCLUDE (key attributes plus specified additional attributes), or ALL (every attribute from the item). Smaller projections reduce cost but require additional reads if you need attributes not in the index.`,
      quiz: [
        {
          question:
            "When must a Local Secondary Index (LSI) be created on a DynamoDB table?",
          options: [
            "Only at table creation time — LSIs cannot be added later",
            "At any time — LSIs can be added or removed after table creation",
            "During the first write operation to the table",
            "Within 7 days of table creation",
          ],
          correctIndex: 0,
          explanation:
            "LSIs must be created at table creation time. Unlike GSIs, they cannot be added or deleted after the table exists. Plan your LSIs carefully before creating the table.",
        },
        {
          question:
            "A GSI has insufficient WCU. What is the impact on the base table?",
          options: [
            "GSI writes fail silently with no impact on the base table",
            "Base table writes that propagate to the GSI are throttled, surfacing as base table write failures",
            "The GSI is automatically scaled up using the base table's WCU",
            "GSI reads are throttled but writes are unaffected",
          ],
          correctIndex: 1,
          explanation:
            "If a GSI has insufficient WCU, writes to the base table that need to propagate to the GSI are throttled. These throttles surface as write failures on the base table — a critical operational point.",
        },
        {
          question: "Which consistency model do GSIs support?",
          options: [
            "Strongly consistent reads only",
            "Eventually consistent reads only",
            "Both strongly and eventually consistent reads",
            "Transactional reads only",
          ],
          correctIndex: 1,
          explanation:
            "GSIs only support eventually consistent reads. Strongly consistent reads are available on the base table and LSIs, but not on GSIs.",
        },
      ],
    },
    {
      heading: "Operations",
      body: `DynamoDB's API divides into single-item operations (most efficient) and multi-item operations (more powerful but more costly).

**GetItem** retrieves a single item by its full primary key and is the most efficient read — it consumes exactly the RCU for the item's size. **PutItem** creates or fully replaces an item. **UpdateItem** modifies specific attributes in-place without replacing the whole item; it supports atomic increment/decrement with the \`ADD\` action, which is how you implement counters without read-modify-write cycles. **DeleteItem** removes an item by primary key.

\`\`\`typescript
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({});

// Atomic counter increment — no read-modify-write race condition
await db.send(new UpdateItemCommand({
  TableName: "PageViews",
  Key: { pageId: { S: "home" } },
  UpdateExpression: "ADD #count :one",
  ExpressionAttributeNames: { "#count": "count" },  // 'count' is a reserved word
  ExpressionAttributeValues: { ":one": { N: "1" } },
}));
\`\`\`

**Query** retrieves multiple items efficiently by specifying the partition key (required) and an optional sort key condition (equals, less than, greater than, between, begins_with). It reads only from the specified partition, making it far more efficient than Scan. A **FilterExpression** can reduce the returned items further, but it does *not* reduce the RCU consumed — you pay for all items read before filtering.

**Scan** reads every item in the table or index sequentially. It's expensive and slow at scale, but sometimes necessary for administrative operations. **Parallel Scan** divides the table into N segments and scans them concurrently, improving throughput at the cost of RCU.

**BatchGetItem** retrieves up to 100 items across one or more tables in a single request. **BatchWriteItem** puts or deletes up to 25 items in a single request (updates are not supported in batch writes). **TransactGetItems** and **TransactWriteItems** provide all-or-nothing atomicity across up to 100 items — if any condition check fails or any write fails, the entire transaction is rolled back. Transactions cost twice the normal RCU/WCU.`,
      quiz: [
        {
          question:
            "A FilterExpression is applied to a DynamoDB Query that returns 500 items before filtering, reducing the result to 50. How many RCUs are consumed?",
          options: [
            "RCUs for 500 items — filtering does not reduce RCU consumption",
            "RCUs for 275 items (the average)",
            "RCUs for 50 items only",
            "No RCUs — FilterExpression is free",
          ],
          correctIndex: 0,
          explanation:
            "FilterExpression does NOT reduce RCU consumption. You pay for all items read before filtering. To reduce RCU, design your key schema or indexes to narrow the result set at the query level, not the filter level.",
        },
        {
          question:
            "Which DynamoDB operation supports atomic increment of a numeric attribute without a read-modify-write cycle?",
          options: [
            "UpdateItem with the ADD action",
            "TransactWriteItems with a counter update",
            "PutItem with a conditional expression",
            "BatchWriteItem with increment instructions",
          ],
          correctIndex: 0,
          explanation:
            "UpdateItem with the ADD action atomically increments or decrements a Number attribute. This is how counters are implemented in DynamoDB without the race conditions of a read-modify-write cycle.",
        },
        {
          question:
            "What is the maximum number of items in a DynamoDB TransactWriteItems request?",
          options: ["100 items", "10 items", "500 items", "25 items"],
          correctIndex: 0,
          explanation:
            "TransactWriteItems supports up to 100 items per transaction. Transactions provide all-or-nothing atomicity — if any item fails, the entire transaction is rolled back. Transactions cost 2× the normal RCU/WCU.",
        },
      ],
    },
    {
      heading: "Consistency Models",
      body: `DynamoDB replicates data across multiple Availability Zones, and the consistency model you choose determines which replicas your reads go to.

**Eventually consistent reads** are the default. They read from any available replica, which may be slightly behind the latest write — typically within a second or less. They cost 0.5 RCU per 4 KB (half the cost of strongly consistent reads). Eventually consistent reads are appropriate for most workloads where a brief window of staleness is acceptable: product catalogs, leaderboards, read-heavy dashboards.

**Strongly consistent reads** always go to the partition's primary (leader) node and return the most recent committed data. They cost 1 RCU per 4 KB, have slightly higher latency, and are not available on GSIs. Use strong consistency when your read immediately follows a write that another component is responsible for — for example, if you just updated a user's balance and need to read it back immediately to validate a transaction.`,
      quiz: [
        {
          question:
            "What is the RCU cost of an eventually consistent read of a 4 KB item?",
          options: ["0.25 RCU", "0.5 RCU", "1 RCU", "2 RCU"],
          correctIndex: 1,
          explanation:
            "Eventually consistent reads cost 0.5 RCU per 4 KB — half the cost of strongly consistent reads (1 RCU per 4 KB). This is because they can be served from any replica, reducing load on the primary node.",
        },
        {
          question:
            "Which DynamoDB index type does NOT support strongly consistent reads?",
          options: [
            "Local Secondary Index (LSI)",
            "Base table",
            "Primary key reads",
            "Global Secondary Index (GSI)",
          ],
          correctIndex: 3,
          explanation:
            "GSIs only support eventually consistent reads. Strongly consistent reads are available on the base table and LSIs. This is a key difference between LSIs and GSIs.",
        },
        {
          question:
            "When should you use strongly consistent reads in DynamoDB?",
          options: [
            "Only when reading from GSIs",
            "For all read operations to ensure data accuracy",
            "When a read immediately follows a write and must reflect the latest committed data",
            "When using DynamoDB Streams",
          ],
          correctIndex: 2,
          explanation:
            "Use strongly consistent reads when a read must immediately reflect the most recent committed write — for example, reading back a balance after an update to validate a transaction. For most workloads, eventually consistent reads are sufficient and cheaper.",
        },
      ],
    },
    {
      heading: "Conditional Expressions & Optimistic Locking",
      body: `DynamoDB's write operations are unconditional by default — \`PutItem\` will overwrite any existing item with the same primary key. **Conditional expressions** make writes atomic and safe by requiring a condition to be true before the write proceeds. If the condition fails, DynamoDB throws \`ConditionalCheckFailedException\` and the item is unchanged.

Three patterns cover most use cases. \`attribute_not_exists(pk)\` prevents overwriting an existing item — the safest way to create new items. \`attribute_exists(pk)\` ensures you're updating an item that already exists. A version check like \`#version = :expected\` implements **optimistic locking**: you read the item and note its version number, do your local computation, then write back with a condition that the version hasn't changed. If another writer modified the item between your read and write, the condition fails, and you retry from the read.

\`\`\`typescript
import { DynamoDBClient, PutItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({});

// Prevent overwriting an existing item
await db.send(new PutItemCommand({
  TableName: "Users",
  Item: { userId: { S: "u1" }, email: { S: "a@b.com" } },
  ConditionExpression: "attribute_not_exists(userId)",
}));

// Optimistic locking: only update if version matches
await db.send(new UpdateItemCommand({
  TableName: "Orders",
  Key: { orderId: { S: "o1" } },
  UpdateExpression: "SET #status = :new, #ver = :next",
  ConditionExpression: "#ver = :expected",
  ExpressionAttributeNames: { "#status": "status", "#ver": "version" },
  ExpressionAttributeValues: {
    ":new": { S: "SHIPPED" },
    ":next": { N: "2" },
    ":expected": { N: "1" },  // fails if another writer already incremented version
  },
}));
\`\`\`

When attribute names conflict with DynamoDB reserved words — and there are hundreds of them, including common words like \`name\`, \`status\`, and \`type\` — use **expression attribute names** (prefixed with \`#\`) as aliases. Always use **expression attribute values** (prefixed with \`:\`) for input values rather than string interpolation, which would create a security vulnerability and make expressions harder to read.`,
      quiz: [
        {
          question:
            "Which conditional expression prevents PutItem from overwriting an existing DynamoDB item?",
          options: [
            "attribute_not_exists(pk)",
            "attribute_exists(pk)",
            "item_does_not_exist(pk)",
            "if_not_exists(pk)",
          ],
          correctIndex: 0,
          explanation:
            "attribute_not_exists(pk) makes PutItem fail with ConditionalCheckFailedException if an item with the same primary key already exists. This is the safest way to create new items without accidentally overwriting existing ones.",
        },
        {
          question:
            "What exception does DynamoDB throw when a conditional expression check fails?",
          options: [
            "ProvisionedThroughputExceededException",
            "OptimisticLockException",
            "TransactionConflictException",
            "ConditionalCheckFailedException",
          ],
          correctIndex: 3,
          explanation:
            "When a conditional expression fails, DynamoDB throws ConditionalCheckFailedException and the item remains unchanged. Your application should catch this and decide whether to retry or report a conflict.",
        },
        {
          question:
            "Why are expression attribute names (prefixed with #) used in DynamoDB expressions?",
          options: [
            "To improve query performance by using indexes",
            "To support case-sensitive attribute name matching",
            "To encrypt attribute values in transit",
            "To avoid conflicts with DynamoDB reserved words like 'name', 'status', and 'type'",
          ],
          correctIndex: 3,
          explanation:
            "Expression attribute names (prefixed with #) are aliases for attribute names that conflict with DynamoDB reserved words. There are hundreds of reserved words including common ones like 'name', 'status', and 'type'.",
        },
      ],
    },
    {
      heading: "DynamoDB Streams",
      body: `**DynamoDB Streams** captures a time-ordered sequence of item-level changes — every insert, update, and delete — as a stream of records. Each change record includes the primary key and, depending on your configuration, the item state before the change, after the change, or both. Stream data is retained for **24 hours**.

You configure the stream's **view type** to control what each record contains: \`KEYS_ONLY\` (just the key attributes), \`NEW_IMAGE\` (the item after the change), \`OLD_IMAGE\` (the item before the change), or \`NEW_AND_OLD_IMAGES\` (both states, which is most useful for auditing and change data capture). The stream is sharded, and each shard's records are ordered — so all changes to a given partition key value appear in order within a shard.

Lambda integrates with DynamoDB Streams via event source mapping, processing records in shard order with configurable batch sizes. The common uses for Streams are triggering notifications when data changes, maintaining real-time aggregates (like item counts or running totals), replicating data to another DynamoDB table (Global Tables use this mechanism internally), feeding search indexes in OpenSearch, and building audit logs that capture every version of every item.`,
      quiz: [
        {
          question: "How long does DynamoDB Streams retain change records?",
          options: ["1 hour", "12 hours", "24 hours", "7 days"],
          correctIndex: 2,
          explanation:
            "DynamoDB Streams retains change records for 24 hours. After that, records are permanently deleted. Lambda event source mappings should process records promptly to avoid missing changes.",
        },
        {
          question:
            "Which DynamoDB Streams view type captures both the before and after state of a changed item?",
          options: [
            "NEW_AND_OLD_IMAGES",
            "OLD_IMAGE",
            "KEYS_ONLY",
            "NEW_IMAGE",
          ],
          correctIndex: 0,
          explanation:
            "NEW_AND_OLD_IMAGES captures both the item state before and after the change. This is the most useful view type for auditing, change data capture, and scenarios where you need to compare before/after states.",
        },
        {
          question:
            "Which AWS feature uses DynamoDB Streams internally for its replication mechanism?",
          options: [
            "DynamoDB Accelerator (DAX)",
            "DynamoDB on-demand capacity",
            "DynamoDB Point-in-Time Recovery",
            "DynamoDB Global Tables",
          ],
          correctIndex: 3,
          explanation:
            "DynamoDB Global Tables uses Streams internally to replicate item-level changes across regions. This is why Streams must be enabled on a table before it can be added to a Global Table.",
        },
      ],
    },
    {
      heading: "Global Tables",
      body: `**Global Tables** extend DynamoDB to multiple regions with **multi-master** replication — any replica in any region can accept both reads and writes. Changes replicate to all other regions with sub-second latency in most cases.

When two regions simultaneously write to the same item, DynamoDB uses **last-writer-wins** conflict resolution based on a timestamp. There's no merge or three-way reconciliation — the most recent write wins. If your application makes conflicting updates from multiple regions simultaneously, you need to design your access patterns to avoid it (for example, using separate ranges of sort keys for each region's writes).

Global Tables are appropriate for applications that need low-latency reads and writes across multiple geographic regions, and for disaster recovery setups where you want near-zero RPO (recovery point objective) — since any region has an up-to-date copy of the data, failing over to another region loses only seconds of data at most. Requirements: the table must use on-demand mode or have Auto Scaling enabled, and DynamoDB Streams must be enabled (which Global Tables uses internally for replication).`,
      quiz: [
        {
          question:
            "How does DynamoDB Global Tables resolve write conflicts when two regions write to the same item simultaneously?",
          options: [
            "The write from the primary region always wins",
            "The conflict is surfaced to the application for resolution",
            "Last-writer-wins based on a timestamp",
            "Both writes are merged using a CRDT algorithm",
          ],
          correctIndex: 2,
          explanation:
            "DynamoDB Global Tables uses last-writer-wins conflict resolution based on a timestamp. The most recent write wins — there is no merge or three-way reconciliation.",
        },
        {
          question:
            "What is required on a DynamoDB table before it can be added to a Global Table?",
          options: [
            "The table must have at least one GSI",
            "The table must use provisioned capacity only",
            "Point-in-Time Recovery must be enabled",
            "DynamoDB Streams must be enabled",
          ],
          correctIndex: 3,
          explanation:
            "DynamoDB Streams must be enabled because Global Tables uses Streams internally to replicate changes across regions. The table must also use on-demand mode or have Auto Scaling enabled.",
        },
        {
          question:
            "What write capability do DynamoDB Global Tables provide across regions?",
          options: [
            "Write quorum: a majority of regions must confirm before a write succeeds",
            "Active-passive: the primary region writes, secondary regions only serve reads",
            "Multi-master: any replica in any region can accept reads and writes",
            "Single-master: only one region accepts writes, others are read-only",
          ],
          correctIndex: 2,
          explanation:
            "Global Tables provide multi-master replication — any replica in any region can accept both reads and writes. Changes replicate to all other regions with sub-second latency in most cases.",
        },
      ],
    },
    {
      heading: "DynamoDB Accelerator (DAX)",
      body: `**DAX** (DynamoDB Accelerator) is a fully managed, purpose-built in-memory cache for DynamoDB. It reduces read latency from single-digit milliseconds to **microseconds** for cache hits, with no code changes to your application beyond swapping the DynamoDB client for the DAX client.

DAX uses a **write-through** caching strategy: writes go to DynamoDB and the cache simultaneously, so the cache is always consistent with the database for items that have been written. The cache stores both individual item results (from GetItem and BatchGetItem) and query/scan results, so repeated identical queries benefit from caching too.

DAX has clear cases where it's not appropriate. It returns cached (eventually consistent) data, so it's unsuitable when you need strongly consistent reads. Write-heavy workloads don't benefit because the write path is unchanged — DAX only accelerates reads. Low-traffic tables where most reads are cache misses add overhead without benefit. DAX runs as a cluster within your VPC and supports Multi-AZ configurations with automatic failover. The sweet spot is read-heavy workloads where the same items are read repeatedly at high frequency — leaderboards, session data, product catalog lookups.`,
      quiz: [
        {
          question:
            "What caching strategy does DAX use when writing to DynamoDB?",
          options: [
            "Lazy loading — the cache is populated only on cache misses",
            "Cache-aside — the application manages cache invalidation",
            "Write-through — writes go to DynamoDB and the cache simultaneously",
            "Write-back — writes go to the cache first, then asynchronously to DynamoDB",
          ],
          correctIndex: 2,
          explanation:
            "DAX uses write-through caching: writes go to both DynamoDB and the cache simultaneously, keeping the cache consistent with the database for items that have been written.",
        },
        {
          question: "What is a scenario where DAX is NOT appropriate?",
          options: [
            "A leaderboard with millions of reads per hour for the same top-10 items",
            "A session store read heavily by authenticated users",
            "A product catalog accessed by thousands of concurrent users",
            "A workload that requires strongly consistent reads",
          ],
          correctIndex: 3,
          explanation:
            "DAX returns cached (eventually consistent) data. If your application requires strongly consistent reads, DAX is not suitable because it cannot guarantee reading the most recently written value.",
        },
        {
          question:
            "By how much does DAX reduce DynamoDB read latency for cache hits?",
          options: [
            "From minutes to seconds",
            "From microseconds to nanoseconds",
            "From milliseconds to microseconds",
            "From seconds to milliseconds",
          ],
          correctIndex: 2,
          explanation:
            "DAX reduces DynamoDB read latency from single-digit milliseconds to microseconds for cache hits. It is purpose-built for read-heavy workloads where the same items are accessed repeatedly at high frequency.",
        },
      ],
    },
    {
      heading: "TTL (Time to Live)",
      body: `**TTL** (Time to Live) lets DynamoDB automatically delete items after a specified expiration time, with no additional cost. You designate a Number attribute as the TTL attribute and store Unix epoch timestamps (seconds since January 1, 1970) in it. DynamoDB periodically scans for items where the TTL attribute value is in the past and deletes them, typically within 48 hours of expiry.

TTL deletes consume no WCU — they're completely free. They appear in DynamoDB Streams as normal delete events (with \`userIdentity.type = "Service"\` to identify them as TTL deletes), so you can trigger cleanup workflows or archive data as it expires.

TTL is ideal for session management (user sessions that should expire after 30 minutes of inactivity), temporary tokens, caching tables where items should refresh periodically, event logs that only need to be retained for a fixed window, and any data with a natural expiration like subscription records or promotional offers. Set the TTL value as \`Math.floor(Date.now() / 1000) + ttlSeconds\`.

\`\`\`typescript
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({});

const TTL_SECONDS = 30 * 60; // 30-minute session expiry

await db.send(new PutItemCommand({
  TableName: "Sessions",
  Item: {
    sessionId: { S: "abc123" },
    userId: { S: "u1" },
    data: { S: JSON.stringify({ cart: [] }) },
    // DynamoDB deletes this item automatically after 30 minutes
    expiresAt: { N: String(Math.floor(Date.now() / 1000) + TTL_SECONDS) },
  },
}));
\`\`\``,
      quiz: [
        {
          question:
            "What data type and format must the DynamoDB TTL attribute contain?",
          options: [
            "A Boolean attribute set to true when the item should expire",
            "A Map attribute with 'expiry' and 'timestamp' fields",
            "A Number attribute containing a Unix epoch timestamp in seconds",
            "A String attribute with ISO 8601 date format",
          ],
          correctIndex: 2,
          explanation:
            "The TTL attribute must be a Number containing a Unix epoch timestamp in seconds. DynamoDB compares this value against the current time to determine which items to delete.",
        },
        {
          question:
            "How much does DynamoDB charge for TTL-based item deletions?",
          options: [
            "0.5 WCU per deleted item",
            "Standard WCU cost applies",
            "Nothing — TTL deletes consume no WCU and are free",
            "$0.01 per 1,000 TTL deletions",
          ],
          correctIndex: 2,
          explanation:
            "TTL deletes are completely free and consume no WCU. This makes TTL an excellent cost-free mechanism for automatically cleaning up expired data.",
        },
        {
          question:
            "How can you identify TTL-deleted items in DynamoDB Streams?",
          options: [
            "They have a special 'ttl_expired' event type",
            "TTL deletes do not appear in Streams",
            "They appear with userIdentity.type = 'Service' in the stream record",
            "TTL deletes are batched into a single stream record at midnight",
          ],
          correctIndex: 2,
          explanation:
            "TTL deletes appear in DynamoDB Streams as normal delete events, but the stream record includes userIdentity.type = 'Service' to identify them as system-initiated TTL deletions rather than application deletes.",
        },
      ],
    },
    {
      heading: "Backup & Point-in-Time Recovery",
      body: `DynamoDB provides two backup mechanisms with different tradeoffs.

**On-demand backups** create a full table snapshot at a specific moment in time. Backups are retained until you explicitly delete them, have no performance impact on the table, and can be restored to a new table in any region. They're appropriate for compliance archives, pre-migration checkpoints, and periodic snapshots.

**Point-in-Time Recovery (PITR)** provides continuous protection against accidental data corruption. When enabled, PITR maintains a rolling **35-day window** of every second of the table's change history. You can restore the table to any second within that window, which is invaluable when someone runs a bad migration, accidentally deletes records, or corrupt data is written. PITR restores always go to a new table — you cannot restore in-place. Enable PITR on any table that contains irreplaceable data.

**Export to S3** lets you export a full table snapshot (or a PITR-based snapshot at a specific time) to S3 in DynamoDB JSON or Amazon Ion format, without consuming any read capacity. You can then query the exported data with Amazon Athena, load it into a data warehouse, or use it for offline analysis. PITR must be enabled to use the export feature.`,
      quiz: [
        {
          question:
            "What is the retention window for DynamoDB Point-in-Time Recovery (PITR)?",
          options: ["14 days", "7 days", "90 days", "35 days"],
          correctIndex: 3,
          explanation:
            "PITR maintains a rolling 35-day window of the table's complete change history. You can restore to any second within that window, providing continuous protection against accidental data corruption.",
        },
        {
          question:
            "When restoring a DynamoDB table using PITR, where does the restored data go?",
          options: [
            "It is exported to S3 first, then reimported",
            "It overwrites the existing table in-place",
            "It is restored to the same table after a brief downtime",
            "It is restored to a new table with a different name",
          ],
          correctIndex: 3,
          explanation:
            "PITR restores always create a new table — you cannot restore in-place to the existing table. You then need to switch traffic from the old table to the restored one.",
        },
        {
          question:
            "What must be enabled on a DynamoDB table before you can use the Export to S3 feature?",
          options: [
            "DynamoDB Streams",
            "Point-in-Time Recovery (PITR)",
            "Global Tables replication",
            "On-demand capacity mode",
          ],
          correctIndex: 1,
          explanation:
            "Point-in-Time Recovery must be enabled to use the Export to S3 feature. The export uses PITR's change history to export a consistent snapshot without consuming any read capacity from the live table.",
        },
      ],
    },
  ],

  keyFacts: [
    "Item size limit: 400 KB",
    "Partition handles 3,000 RCU and 1,000 WCU",
    "LSI: created at table creation; same partition key; strongly consistent reads OK",
    "GSI: add anytime; own capacity; eventually consistent only",
    "Query needs partition key; Scan reads entire table",
    "Strongly consistent read = 1 RCU per 4 KB; eventual = 0.5 RCU",
    "Transactions cost 2× RCU/WCU; up to 100 items per transaction",
    "DynamoDB Streams retention: 24 hours",
    "TTL deletes are free (no WCU)",
    "PITR: 35-day window, restore to any second",
    "DAX: microsecond latency; write-through; not for strong consistency",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon DynamoDB Accelerator (DAX)",
    "Amazon EventBridge",
    "AWS Step Functions",
    "Amazon Kinesis",
    "Amazon OpenSearch Service",
    "Amazon S3",
    "AWS AppSync",
  ],

  examTips: [
    "Low-cardinality partition key (status, boolean) causes hot partitions — use high-cardinality keys.",
    "GSI throttling causes base table write failures — provision GSI WCU appropriately.",
    "FilterExpression does NOT save RCU — you pay for all items read before filtering.",
    "LSI must be created at table creation; GSI can be added later.",
    "Transactions: 2 RCU per 4 KB read, 2 WCU per 1 KB write.",
    "DAX is not suitable for strongly consistent reads or write-heavy workloads.",
    "Conditional expression attribute_not_exists(pk) prevents overwriting existing items.",
    "On-demand mode scales instantly; provisioned mode needs Auto Scaling or manual adjustment.",
    "BisectBatchOnFunctionError splits Streams batches to isolate poison-pill records.",
  ],

  topicQuiz: [
    {
      question:
        "A DynamoDB Query returns 200 items before a FilterExpression reduces the result to 10. How many RCUs are consumed?",
      options: [
        "Zero — Query with FilterExpression is free",
        "RCUs for 105 items (the average)",
        "RCUs for 200 items — FilterExpression does not reduce RCU consumption",
        "RCUs for 10 items — FilterExpression reduces consumption",
      ],
      correctIndex: 2,
      explanation:
        "FilterExpression does not reduce RCU consumption. You pay for all 200 items read from the partition before filtering. To reduce cost, design your key schema or indexes to narrow the result at the query level.",
    },
    {
      question:
        "A developer needs a DynamoDB index to support a completely different query access pattern with its own partition key. The table already exists. Which index should they create?",
      options: [
        "LSI with a different sort key",
        "Local Secondary Index (LSI)",
        "Global Secondary Index (GSI)",
        "Composite primary key index",
      ],
      correctIndex: 2,
      explanation:
        "A GSI can have a completely different partition key and sort key from the base table and can be added at any time after table creation. LSIs must be created at table creation time and must share the table's partition key.",
    },
    {
      question:
        "Which DynamoDB billing mode instantly scales to any request rate without capacity planning?",
      options: [
        "On-demand mode",
        "Provisioned mode with Auto Scaling",
        "Burst capacity mode",
        "Reserved capacity mode",
      ],
      correctIndex: 0,
      explanation:
        "On-demand mode scales instantly to handle any request rate and charges per request. It eliminates capacity planning and is ideal for unpredictable or spiky workloads and new tables with unknown traffic patterns.",
    },
    {
      question:
        "What exception is thrown when a DynamoDB conditional expression check fails?",
      options: [
        "ConditionalCheckFailedException",
        "OptimisticLockException",
        "ThrottlingException",
        "ProvisionedThroughputExceededException",
      ],
      correctIndex: 0,
      explanation:
        "DynamoDB throws ConditionalCheckFailedException when a conditional expression evaluates to false. The item remains unchanged and the application can decide to retry or report the conflict.",
    },
    {
      question:
        "A DynamoDB table's GSI has 100 WCU provisioned but the base table receives 500 WCU of writes. What happens?",
      options: [
        "Only 100 WCU of base table writes succeed per second",
        "The GSI automatically borrows capacity from the base table",
        "Base table writes that need to propagate to the GSI are throttled, surfacing as base table write failures",
        "The GSI silently drops excess writes with no impact on the base table",
      ],
      correctIndex: 2,
      explanation:
        "GSI throttling surfaces as base table write failures. When a GSI lacks sufficient WCU, writes to the base table that must propagate to the GSI are throttled. Always provision GSI WCU appropriately.",
    },
    {
      question:
        "Which DynamoDB Streams view type is most useful for auditing and change data capture?",
      options: ["OLD_IMAGE", "KEYS_ONLY", "NEW_AND_OLD_IMAGES", "NEW_IMAGE"],
      correctIndex: 2,
      explanation:
        "NEW_AND_OLD_IMAGES captures both the before and after state of each changed item. This is most useful for auditing, change data capture, and scenarios where you need to compare what changed.",
    },
    {
      question: "When is DAX NOT a suitable caching solution for DynamoDB?",
      options: [
        "When the table stores a product catalog accessed by many concurrent users",
        "When the table stores session data for millions of users",
        "When strongly consistent reads are required",
        "When the workload is read-heavy with repeated access to the same items",
      ],
      correctIndex: 2,
      explanation:
        "DAX is not suitable when strongly consistent reads are required because it returns cached (eventually consistent) data. It also does not benefit write-heavy workloads since the write path to DynamoDB is unchanged.",
    },
    {
      question:
        "How long does DynamoDB PITR retain the table's change history?",
      options: ["35 days", "14 days", "90 days", "7 days"],
      correctIndex: 0,
      explanation:
        "PITR maintains a rolling 35-day window. You can restore to any second within that window. PITR restores always go to a new table — you cannot restore in-place to the existing table.",
    },
  ],
};
