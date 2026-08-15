import { ServiceGuide } from "../../types/guide";

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
      body: `DynamoDB stores data as **items** (rows) in **tables**. Each item is a collection of **attributes** (fields). Items can have different attributes — the schema is flexible except for the primary key.

**Primary Key** (required, defined at table creation):
- *Simple Primary Key*: just a **Partition Key** (hash key). Each item uniquely identified by the partition key value.
- *Composite Primary Key*: **Partition Key + Sort Key** (range key). Multiple items can share a partition key but must have unique sort keys within that partition.

**Attribute Types**: String (S), Number (N), Binary (B), Boolean (BOOL), Null (NULL), List (L), Map (M), String Set (SS), Number Set (NS), Binary Set (BS).

**Item size limit**: 400 KB per item.
**Table size**: unlimited — DynamoDB scales horizontally across partitions automatically.`,
    },
    {
      heading: "Partition Key Design",
      body: `The partition key determines which physical partition stores the item. DynamoDB hashes the key and routes to a partition. Each partition handles **3,000 RCU** and **1,000 WCU**.

**High cardinality** (many distinct values) = even distribution = no hot partitions.
**Low cardinality** (few distinct values like \`status: active/inactive\`) = hot partitions = throttling.

**Good partition keys**: userId, orderId, deviceId, UUID — high cardinality, random distribution.
**Bad partition keys**: status, country, boolean flags — low cardinality.

**Write sharding**: append a random suffix (\`userId#1\`, \`userId#2\`) to hot keys. Distribute writes, then aggregate reads. Also usable with a calculated suffix: \`key + (hash(key) % N)\`.

**Time-series data**: include a date component in the partition key or sort key to distribute writes across time-based partitions. Avoid a single \`date\` partition key that channels all today's writes to one partition.`,
    },
    {
      heading: "Read & Write Capacity",
      body: `**Provisioned Mode**: you specify RCU and WCU. Predictable cost; can enable Auto Scaling (target utilization %, min/max capacity). Best for predictable workloads.

**On-Demand Mode**: pay per request. No capacity planning. Scales instantly to accommodate any traffic. Up to 2× previous peak immediately. Higher per-request cost. Best for unpredictable or spiky workloads.

**Read Capacity Units (RCU)**:
- 1 RCU = 1 strongly consistent read of up to 4 KB/s
- 1 RCU = 2 eventually consistent reads of up to 4 KB/s
- 2 RCU = 1 transactional read of up to 4 KB/s

**Write Capacity Units (WCU)**:
- 1 WCU = 1 write of up to 1 KB/s
- 2 WCU = 1 transactional write of up to 1 KB/s

Burst capacity: DynamoDB retains up to 5 minutes of unused capacity as burst. **ProvisionedThroughputExceededException** = throttling; use exponential backoff.`,
    },
    {
      heading: "Indexes (GSI & LSI)",
      body: `**Local Secondary Index (LSI)**
- Same partition key as base table, different sort key.
- Created **at table creation only** — cannot add later.
- Up to **5 LSIs** per table.
- Shares read/write capacity with the base table.
- Supports **strongly consistent reads**.
- Index size (per partition key value) ≤ 10 GB.

**Global Secondary Index (GSI)**
- Different partition key and/or sort key than base table.
- Can be **added or deleted at any time**.
- Up to **20 GSIs** per table.
- Has its **own RCU/WCU** (separate from table).
- **Eventually consistent reads only**.
- GSI writes consume GSI WCU — under-provisioned GSI causes throttling (writes to base table also fail if GSI is throttled).

**Projection**: choose which attributes to include in the index — KEYS_ONLY, INCLUDE (specified attrs), ALL. Fewer projected attributes = smaller index = lower cost.`,
    },
    {
      heading: "Operations",
      body: `**GetItem**: fetch a single item by full primary key. Strongly or eventually consistent. Reads exactly one item — most efficient read.

**PutItem**: create or fully replace an item by primary key. Add conditional expression to prevent overwrites.

**UpdateItem**: modify specific attributes of an existing item without replacing it. Supports atomic counters with ADD action. More efficient than get + put.

**DeleteItem**: remove an item by primary key. Support conditional expressions.

**Query**: fetch items by **partition key** (required) + optional sort key condition (=, <, >, BETWEEN, begins_with). Uses KeyConditionExpression. Reads only from the target partition — efficient. Add FilterExpression to filter results after reading (does not save RCU — you still pay for all items read).

**Scan**: reads **every item** in the table or index. Expensive. Use FilterExpression to reduce returned items, but you pay for all items scanned. Use **Parallel Scan** (divide into N segments, scan concurrently) to speed up large table scans. Avoid on production traffic paths.

**BatchGetItem**: up to 100 items / 16 MB in one request. Reads from one or more tables. Returns unprocessed keys if some items were throttled — must retry.

**BatchWriteItem**: up to 25 puts/deletes / 16 MB. No update support. Returns unprocessed items on partial failure.

**TransactGetItems / TransactWriteItems**: all-or-nothing operations across up to 100 items / 4 MB. 2× the RCU/WCU cost. Use for financial transactions, inventory updates, anything requiring atomicity.`,
    },
    {
      heading: "Consistency Models",
      body: `**Eventually Consistent Read** (default)
Returns data that may be up to ~1 second stale. Reads from any of the replica nodes. Costs 0.5 RCU per 4 KB.

**Strongly Consistent Read**
Always returns the most recent data. Reads from the leader node. Costs 1 RCU per 4 KB. Not available on GSIs. May have higher latency.

**When to use which**: use eventual consistency for read-heavy workloads where slight staleness is acceptable (product catalog, leaderboards). Use strong consistency when correctness is critical and the read immediately follows a write.`,
    },
    {
      heading: "Conditional Expressions & Optimistic Locking",
      body: `**Conditional expressions** make writes conditional on item state. The write only succeeds if the condition is true; otherwise **ConditionalCheckFailedException** is thrown.

Common patterns:
- \`attribute_not_exists(pk)\` — prevent overwriting existing items (safe put)
- \`attribute_exists(pk)\` — ensure item exists before update
- \`#version = :expected\` — optimistic locking version check

**Optimistic locking**:
1. Read item, note version attribute (e.g. \`version = 5\`)
2. Perform local computation
3. Write with condition \`version = 5\` and increment version to 6
4. If another writer changed the item first, your condition fails — retry from step 1

The AWS DynamoDB SDK has built-in optimistic locking support via the **@DynamoDBVersionAttribute** annotation (Java) and equivalent in other SDKs.

**Expression attribute names** (\`#name\`): use when attribute name is a reserved word.
**Expression attribute values** (\`\`:val\`): always use placeholders — never string-interpolate values into expressions.`,
    },
    {
      heading: "DynamoDB Streams",
      body: `Streams capture a **time-ordered sequence of item-level changes** (inserts, updates, deletes). Data retained for **24 hours**. Each change is a stream record.

**View types** (configured per table):
- \`KEYS_ONLY\`: only the key attributes of the modified item
- \`NEW_IMAGE\`: the entire item after the change
- \`OLD_IMAGE\`: the entire item before the change
- \`NEW_AND_OLD_IMAGES\`: both before and after — most useful for auditing and CDC

**Lambda integration**: Lambda polls the stream via event source mapping. Shard-based: Lambda processes records in order within a shard. Configure batch size, starting position (TRIM_HORIZON, LATEST, AT_TIMESTAMP), and error handling (BisectBatchOnFunctionError, destinations).

**Use cases**: trigger notifications on data changes, replicate to another table (global tables use streams internally), feed Elasticsearch/OpenSearch for full-text search, build audit logs, compute aggregates.`,
    },
    {
      heading: "Global Tables",
      body: `Global Tables provide **multi-region, multi-master** replication. Any replica can accept reads and writes. DynamoDB replicates changes to all replicas (typically <1 second lag).

**Conflict resolution**: last-writer-wins based on timestamp. Design to avoid write conflicts on the same item from multiple regions simultaneously.

**Use cases**: globally distributed applications that need low-latency reads/writes in multiple regions and disaster recovery with near-zero RPO/RTO.

Requirements: table must use on-demand mode or have Auto Scaling enabled. DynamoDB Streams must be enabled (used internally for replication).`,
    },
    {
      heading: "DynamoDB Accelerator (DAX)",
      body: `DAX is a fully managed, in-memory cache purpose-built for DynamoDB. Provides **microsecond read latency** (vs milliseconds for DynamoDB). API-compatible — replace the DynamoDB client with the DAX client.

**Write-through cache**: writes go to DynamoDB AND cache simultaneously. Cache is always consistent with the database for items that have been written through it.

**Item cache vs query cache**: DAX caches both individual items (GetItem, BatchGetItem) and query/scan results (Query, Scan).

**Not suitable for**: strongly consistent reads (DAX returns cached/eventually consistent data), write-heavy workloads (DAX doesn't reduce write cost), low QPS (overhead not worth it).

**Cluster**: Multi-AZ capable. Primary node handles writes; read replicas handle reads. Automatic failover.

**When to use**: read-heavy, latency-sensitive workloads with repeated reads of the same items (hot items, leaderboards, product details, session storage).`,
    },
    {
      heading: "TTL (Time to Live)",
      body: `TTL automatically deletes items after a specified Unix timestamp. You designate a Number attribute as the TTL attribute. DynamoDB checks TTL attributes every few minutes and deletes expired items — typically within 48 hours of expiry.

**Cost**: TTL deletes are free (no WCU consumed).
**Streams**: TTL deletes appear in DynamoDB Streams as normal delete events (useful for cleanup workflows).
**Use cases**: session management, temporary auth tokens, event logs, caching tables, subscription expiry.

Set TTL = \`Math.floor(Date.now() / 1000) + ttlSeconds\` (Unix epoch seconds).`,
    },
    {
      heading: "Backup & Point-in-Time Recovery",
      body: `**On-demand backups**: full table backups anytime. Retained until explicitly deleted. No impact on performance. Restored to a new table.

**Point-in-Time Recovery (PITR)**: continuous backups for the last **35 days**. Restore to any second within that window. Protect against accidental deletes or overwrites. Enable per table. Restored to a new table — cannot restore in-place.

**Export to S3**: export table data to S3 in DynamoDB JSON or Amazon Ion format without consuming RCU. PITR must be enabled. Use for analytics (Athena), data lake feeds, and migrations.`,
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
};
