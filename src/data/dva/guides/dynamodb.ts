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
    },
    {
      heading: "Partition Key Design",
      body: `The partition key is one of the most important design decisions in DynamoDB. DynamoDB hashes the partition key value and uses the hash to route each item to a specific physical partition. Each partition has a throughput ceiling of **3,000 RCU** and **1,000 WCU** — if too much traffic concentrates on a small number of partition key values, you'll hit those limits, causing throttling.

The goal is **high cardinality** — many distinct partition key values — so that traffic distributes evenly across many partitions. User IDs, order IDs, device IDs, and UUIDs make excellent partition keys because each represents a distinct user, order, or device. Status fields (active/inactive), country codes, or boolean flags make terrible partition keys because they concentrate all traffic into just a few partitions, creating "hot" partitions that throttle.

When you genuinely need to use a low-cardinality value as part of your access pattern, **write sharding** is the standard solution. Append a random or computed suffix to the key value — for example, \`status#3\` instead of just \`status\` — distributing writes across N virtual partitions. Reads then need to query all N shards and aggregate the results. For time-series data, avoid using just a date as the partition key (all today's writes go to one partition). Instead, include a more selective component like a device ID or user ID.`,
    },
    {
      heading: "Read & Write Capacity",
      body: `DynamoDB offers two billing modes that determine how you pay for throughput.

In **provisioned mode**, you specify the number of Read Capacity Units (RCU) and Write Capacity Units (WCU) your table needs. One RCU supports one strongly consistent read of up to 4 KB per second, or two eventually consistent reads of the same size. One WCU supports one write of up to 1 KB per second. Transactional reads and writes cost twice as much (2 RCU per 4 KB, 2 WCU per 1 KB). Provisioned mode offers predictable costs and can use Auto Scaling to adjust capacity based on utilization targets. DynamoDB also retains up to 5 minutes of unused capacity as **burst capacity**, which can absorb short traffic spikes above your provisioned limits.

In **on-demand mode**, DynamoDB scales instantly to handle any request rate and you pay per request. It's more expensive per request but eliminates capacity planning — the table scales up to 2× the previous peak immediately. On-demand is the right choice for unpredictable or spiky workloads, new tables where traffic patterns are unknown, or any table where the cost of over-provisioning exceeds the per-request premium.

When provisioned capacity is exceeded, DynamoDB returns \`ProvisionedThroughputExceededException\`. Implement exponential backoff with jitter in your retry logic — the AWS SDK does this automatically for most operations.`,
    },
    {
      heading: "Indexes (GSI & LSI)",
      body: `DynamoDB's primary key structure limits how you can query items — you can only query efficiently by partition key. Indexes let you support additional query patterns on the same data without duplicating the entire table.

A **Local Secondary Index (LSI)** uses the same partition key as the base table but a different sort key. This lets you query the same set of items (within a partition) sorted or filtered by a different attribute. LSIs must be created at table creation time — you cannot add them later. Up to 5 LSIs are allowed per table, they share the table's read/write capacity, and they support strongly consistent reads. One important constraint: the total size of all items with the same partition key value across the table and all its LSIs cannot exceed 10 GB.

A **Global Secondary Index (GSI)** can have a completely different partition key and sort key than the base table — it's essentially a separate view of the data with its own query access pattern. GSIs can be added or deleted at any time after table creation. Each GSI has its own provisioned RCU and WCU (separate from the table's capacity), and they only support eventually consistent reads. A critical operational point: if a GSI's WCU is insufficient, writes to the base table that need to propagate to the GSI will be throttled — and those throttles surface as write failures on the base table.

Both index types use **projection** to control which attributes are copied into the index: KEYS_ONLY (just the key attributes), INCLUDE (key attributes plus specified additional attributes), or ALL (every attribute from the item). Smaller projections reduce cost but require additional reads if you need attributes not in the index.`,
    },
    {
      heading: "Operations",
      body: `DynamoDB's API divides into single-item operations (most efficient) and multi-item operations (more powerful but more costly).

**GetItem** retrieves a single item by its full primary key and is the most efficient read — it consumes exactly the RCU for the item's size. **PutItem** creates or fully replaces an item. **UpdateItem** modifies specific attributes in-place without replacing the whole item; it supports atomic increment/decrement with the \`ADD\` action, which is how you implement counters without read-modify-write cycles. **DeleteItem** removes an item by primary key.

**Query** retrieves multiple items efficiently by specifying the partition key (required) and an optional sort key condition (equals, less than, greater than, between, begins_with). It reads only from the specified partition, making it far more efficient than Scan. A **FilterExpression** can reduce the returned items further, but it does *not* reduce the RCU consumed — you pay for all items read before filtering.

**Scan** reads every item in the table or index sequentially. It's expensive and slow at scale, but sometimes necessary for administrative operations. **Parallel Scan** divides the table into N segments and scans them concurrently, improving throughput at the cost of RCU.

**BatchGetItem** retrieves up to 100 items across one or more tables in a single request. **BatchWriteItem** puts or deletes up to 25 items in a single request (updates are not supported in batch writes). **TransactGetItems** and **TransactWriteItems** provide all-or-nothing atomicity across up to 100 items — if any condition check fails or any write fails, the entire transaction is rolled back. Transactions cost twice the normal RCU/WCU.`,
    },
    {
      heading: "Consistency Models",
      body: `DynamoDB replicates data across multiple Availability Zones, and the consistency model you choose determines which replicas your reads go to.

**Eventually consistent reads** are the default. They read from any available replica, which may be slightly behind the latest write — typically within a second or less. They cost 0.5 RCU per 4 KB (half the cost of strongly consistent reads). Eventually consistent reads are appropriate for most workloads where a brief window of staleness is acceptable: product catalogs, leaderboards, read-heavy dashboards.

**Strongly consistent reads** always go to the partition's primary (leader) node and return the most recent committed data. They cost 1 RCU per 4 KB, have slightly higher latency, and are not available on GSIs. Use strong consistency when your read immediately follows a write that another component is responsible for — for example, if you just updated a user's balance and need to read it back immediately to validate a transaction.`,
    },
    {
      heading: "Conditional Expressions & Optimistic Locking",
      body: `DynamoDB's write operations are unconditional by default — \`PutItem\` will overwrite any existing item with the same primary key. **Conditional expressions** make writes atomic and safe by requiring a condition to be true before the write proceeds. If the condition fails, DynamoDB throws \`ConditionalCheckFailedException\` and the item is unchanged.

Three patterns cover most use cases. \`attribute_not_exists(pk)\` prevents overwriting an existing item — the safest way to create new items. \`attribute_exists(pk)\` ensures you're updating an item that already exists. A version check like \`#version = :expected\` implements **optimistic locking**: you read the item and note its version number, do your local computation, then write back with a condition that the version hasn't changed. If another writer modified the item between your read and write, the condition fails, and you retry from the read.

When attribute names conflict with DynamoDB reserved words — and there are hundreds of them, including common words like \`name\`, \`status\`, and \`type\` — use **expression attribute names** (prefixed with \`#\`) as aliases. Always use **expression attribute values** (prefixed with \`:\`) for input values rather than string interpolation, which would create a security vulnerability and make expressions harder to read.`,
    },
    {
      heading: "DynamoDB Streams",
      body: `**DynamoDB Streams** captures a time-ordered sequence of item-level changes — every insert, update, and delete — as a stream of records. Each change record includes the primary key and, depending on your configuration, the item state before the change, after the change, or both. Stream data is retained for **24 hours**.

You configure the stream's **view type** to control what each record contains: \`KEYS_ONLY\` (just the key attributes), \`NEW_IMAGE\` (the item after the change), \`OLD_IMAGE\` (the item before the change), or \`NEW_AND_OLD_IMAGES\` (both states, which is most useful for auditing and change data capture). The stream is sharded, and each shard's records are ordered — so all changes to a given partition key value appear in order within a shard.

Lambda integrates with DynamoDB Streams via event source mapping, processing records in shard order with configurable batch sizes. The common uses for Streams are triggering notifications when data changes, maintaining real-time aggregates (like item counts or running totals), replicating data to another DynamoDB table (Global Tables use this mechanism internally), feeding search indexes in OpenSearch, and building audit logs that capture every version of every item.`,
    },
    {
      heading: "Global Tables",
      body: `**Global Tables** extend DynamoDB to multiple regions with **multi-master** replication — any replica in any region can accept both reads and writes. Changes replicate to all other regions with sub-second latency in most cases.

When two regions simultaneously write to the same item, DynamoDB uses **last-writer-wins** conflict resolution based on a timestamp. There's no merge or three-way reconciliation — the most recent write wins. If your application makes conflicting updates from multiple regions simultaneously, you need to design your access patterns to avoid it (for example, using separate ranges of sort keys for each region's writes).

Global Tables are appropriate for applications that need low-latency reads and writes across multiple geographic regions, and for disaster recovery setups where you want near-zero RPO (recovery point objective) — since any region has an up-to-date copy of the data, failing over to another region loses only seconds of data at most. Requirements: the table must use on-demand mode or have Auto Scaling enabled, and DynamoDB Streams must be enabled (which Global Tables uses internally for replication).`,
    },
    {
      heading: "DynamoDB Accelerator (DAX)",
      body: `**DAX** (DynamoDB Accelerator) is a fully managed, purpose-built in-memory cache for DynamoDB. It reduces read latency from single-digit milliseconds to **microseconds** for cache hits, with no code changes to your application beyond swapping the DynamoDB client for the DAX client.

DAX uses a **write-through** caching strategy: writes go to DynamoDB and the cache simultaneously, so the cache is always consistent with the database for items that have been written. The cache stores both individual item results (from GetItem and BatchGetItem) and query/scan results, so repeated identical queries benefit from caching too.

DAX has clear cases where it's not appropriate. It returns cached (eventually consistent) data, so it's unsuitable when you need strongly consistent reads. Write-heavy workloads don't benefit because the write path is unchanged — DAX only accelerates reads. Low-traffic tables where most reads are cache misses add overhead without benefit. DAX runs as a cluster within your VPC and supports Multi-AZ configurations with automatic failover. The sweet spot is read-heavy workloads where the same items are read repeatedly at high frequency — leaderboards, session data, product catalog lookups.`,
    },
    {
      heading: "TTL (Time to Live)",
      body: `**TTL** (Time to Live) lets DynamoDB automatically delete items after a specified expiration time, with no additional cost. You designate a Number attribute as the TTL attribute and store Unix epoch timestamps (seconds since January 1, 1970) in it. DynamoDB periodically scans for items where the TTL attribute value is in the past and deletes them, typically within 48 hours of expiry.

TTL deletes consume no WCU — they're completely free. They appear in DynamoDB Streams as normal delete events (with \`userIdentity.type = "Service"\` to identify them as TTL deletes), so you can trigger cleanup workflows or archive data as it expires.

TTL is ideal for session management (user sessions that should expire after 30 minutes of inactivity), temporary tokens, caching tables where items should refresh periodically, event logs that only need to be retained for a fixed window, and any data with a natural expiration like subscription records or promotional offers. Set the TTL value as \`Math.floor(Date.now() / 1000) + ttlSeconds\`.`,
    },
    {
      heading: "Backup & Point-in-Time Recovery",
      body: `DynamoDB provides two backup mechanisms with different tradeoffs.

**On-demand backups** create a full table snapshot at a specific moment in time. Backups are retained until you explicitly delete them, have no performance impact on the table, and can be restored to a new table in any region. They're appropriate for compliance archives, pre-migration checkpoints, and periodic snapshots.

**Point-in-Time Recovery (PITR)** provides continuous protection against accidental data corruption. When enabled, PITR maintains a rolling **35-day window** of every second of the table's change history. You can restore the table to any second within that window, which is invaluable when someone runs a bad migration, accidentally deletes records, or corrupt data is written. PITR restores always go to a new table — you cannot restore in-place. Enable PITR on any table that contains irreplaceable data.

**Export to S3** lets you export a full table snapshot (or a PITR-based snapshot at a specific time) to S3 in DynamoDB JSON or Amazon Ion format, without consuming any read capacity. You can then query the exported data with Amazon Athena, load it into a data warehouse, or use it for offline analysis. PITR must be enabled to use the export feature.`,
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
