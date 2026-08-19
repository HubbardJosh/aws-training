import { ServiceGuide } from "../../../types/guide";

export const kinesisGuide: ServiceGuide = {
  id: "amazon-kinesis",
  service: "Amazon Kinesis",
  domain: "development",
  tagline: "Real-time data streaming and analytics at scale",
  intro:
    "Kinesis is a family of services for collecting, processing, and analyzing real-time streaming data. It enables you to process and respond to data in milliseconds instead of waiting for batch jobs.",

  sections: [
    {
      heading: "Kinesis Family Overview",
      body: `The Kinesis family consists of four services that solve different parts of the streaming data problem. **Kinesis Data Streams (KDS)** is the core streaming service — it ingests data in real time, stores it durably in shards, and makes it available to consumers you write yourself. It offers configurable retention (1–365 days) and sub-second latency, which makes it the right choice when you need custom processing logic or the ability to replay historical data.

**Kinesis Data Firehose** trades flexibility for simplicity. It's a fully managed delivery service that buffers incoming records and delivers them in batches to a destination — S3, Redshift, OpenSearch, Splunk, or HTTP endpoints. You write no consumer code at all; Firehose handles everything from buffering to format conversion. The tradeoff is latency: Firehose's minimum buffer interval is 60 seconds, so it's near-real-time rather than truly real-time.

**Kinesis Data Analytics** (for Apache Flink) sits between the two: you run managed Apache Flink applications that read from a Data Stream or Firehose and write results to another stream or service. This is the right tool when you need stateful stream processing — windowed aggregations, joins across streams, anomaly detection — without managing your own Flink cluster. **Kinesis Video Streams** handles live video ingestion from devices and is not covered in the DVA-C02 exam.`,
    },
    {
      heading: "Kinesis Data Streams — Shards & Capacity",
      body: `A Kinesis stream is made up of **shards**, and each shard is an independently scalable unit of throughput. Each shard provides 1 MB/s or 1,000 records per second of write capacity, and 2 MB/s of read capacity. Understanding this model is critical for both design and troubleshooting.

The read capacity limit deserves special attention: the 2 MB/s is shared among all standard consumers polling a shard. If you have three applications all reading from the same shard, they compete for that 2 MB/s budget. **Enhanced Fan-Out (EFO)** solves this by giving each registered consumer its own dedicated 2 MB/s per shard via a push-based HTTP/2 delivery model, reducing per-consumer latency from ~200ms to ~70ms. EFO costs more per consumer-shard-hour but is the right choice when multiple independent consumers all need full throughput.

**Scaling** is manual in provisioned mode — you split a shard to double its capacity or merge two adjacent shards to reduce it. **On-demand mode** handles scaling automatically at higher cost, removing the need to calculate and manage shard counts.

The **partition key** you assign to each record determines which shard receives it. Kinesis hashes the key to a shard, so high-cardinality keys (user IDs, UUIDs, device IDs) distribute load evenly across shards. Low-cardinality keys create hot shards where all writes go to one or two shards, quickly exhausting their throughput limits and causing \`ProvisionedThroughputExceededException\`. Records within a shard are ordered by their **sequence number** — the guarantee of ordering is per-shard, not across the entire stream.`,
    },
    {
      heading: "Producing Records",
      body: `Writing records to a Kinesis stream can be done at different levels of efficiency depending on your volume requirements. **PutRecord** sends a single record and returns its sequence number and shard ID — simple and useful for low-volume use cases but inefficient at scale. **PutRecords** batches up to 500 records in a single API call and returns individual success or failure status for each record, so you retry only the failed records rather than the whole batch.

For high-volume producers, the **Kinesis Producer Library (KPL)** goes further by automatically aggregating multiple small records into a single Kinesis record (up to 1 MB). This aggregation dramatically increases the effective throughput per shard for applications that produce many small records. The KPL also handles retry logic, rate limiting, and CloudWatch metrics automatically. The important caveat: KPL-aggregated records must be deserialized by a KCL consumer or a deaggregation library — a standard \`GetRecords\` call will return the aggregated record as an opaque blob that your application must unpack.

Every record contains the actual data payload (up to 1 MB, base64-encoded in the API), a partition key, and an optional explicit hash key that overrides the default partition-key hashing. When a shard is throttled, implement exponential backoff in your retry logic — the KPL handles this automatically, which is one of the main reasons to use it over raw API calls for high-throughput producers.`,
    },
    {
      heading: "Consuming Records",
      body: `Kinesis supports two fundamentally different consumption models, and choosing the wrong one for your architecture is a common source of performance problems.

**Standard polling consumers** use the \`GetRecords\` API to pull batches of records from a shard. The critical constraint is that the 2 MB/s read throughput per shard is shared across all polling consumers. As you add more consumers, each gets a smaller share of the bandwidth and must poll more frequently to keep up. The **Kinesis Consumer Library (KCL)** is the standard tool for building polling consumers — it handles shard enumeration, checkpointing progress, lease coordination across multiple worker instances, and failure recovery. KCL consumers run as long-lived processes on EC2 or ECS.

**Enhanced Fan-Out** consumers use a push model: each registered consumer gets its own dedicated 2 MB/s per shard, delivered via HTTP/2 with ~70ms latency. Adding a new EFO consumer doesn't degrade existing consumers' throughput. The limit is 20 registered EFO consumers per stream. EFO is the right choice when you're adding a third or fourth consumer to a stream, or when any consumer is latency-sensitive.

**Lambda** can consume from Kinesis via event source mapping using the standard polling model (EFO for Lambda is also available but must be explicitly configured). Lambda processes records in shard order within each shard, with multiple shards executing as separate concurrent invocations. If Lambda fails to process a batch, it retries until the records expire from the stream — configuring \`BisectBatchOnFunctionError\` splits a failing batch in half to isolate the problematic record rather than blocking the entire shard.`,
    },
    {
      heading: "Kinesis Data Firehose",
      body: `Firehose is designed for the common case where you want to land streaming data in a data store without writing any consumer code. You configure a delivery stream, point producers at it, and Firehose handles buffering, compression, format conversion, and delivery to your chosen destination.

**Sources** include Kinesis Data Streams, Amazon MSK (managed Kafka), direct PUT from the SDK or Kinesis Agent, CloudWatch Logs, IoT, and EventBridge. **Destinations** are S3, Amazon Redshift (via S3 staging), OpenSearch Service, Splunk, and HTTP endpoints including Datadog and New Relic. The buffering configuration — size (1–128 MB) and interval (60–900 seconds) — determines when Firehose delivers a batch. Data is delivered as soon as either threshold is met, so a 128 MB buffer with a 300-second interval will deliver when 128 MB accumulates or after 5 minutes, whichever comes first.

Two capabilities make Firehose more powerful than a simple forwarder. **Lambda transformation** lets you invoke a Lambda function on each batch to parse, filter, enrich, or reshape records before delivery. Records that the function fails to transform go to an S3 error bucket, and the function must return results within 5 minutes. **Format conversion** uses AWS Glue Data Catalog schema definitions to convert JSON records to Parquet or ORC format on the fly — critical for cost-efficient Athena queries on S3 data, where columnar formats can reduce query cost by 90% or more. GZIP, ZIP, and Snappy compression are also available for S3 deliveries.`,
    },
    {
      heading: "Kinesis Data Analytics",
      body: `Kinesis Data Analytics (for Apache Flink) lets you run stateful stream processing without provisioning or managing a Flink cluster. You write a Flink application in Java, Scala, or Python, and the managed service handles cluster management, auto-scaling, checkpointing to S3, and failure recovery and restart.

The service reads from Kinesis Data Streams or Firehose and writes results to Kinesis Data Streams, Firehose, or Lambda. A legacy SQL-based application mode is also supported but Apache Flink applications are preferred for new development, as they support the full Flink API including windowed aggregations, stateful processing, complex event processing, and stream joins.

The practical use cases are workloads that need real-time computation on the stream itself rather than just moving data from point A to point B: detecting anomalies in IoT sensor telemetry, computing rolling aggregates for a real-time dashboard, analyzing click-stream sequences to detect fraud patterns, or joining an event stream with a reference data set to enrich events before forwarding them. The managed aspect is significant — running Apache Flink yourself requires significant operational expertise, and Kinesis Data Analytics removes that burden.`,
    },
    {
      heading: "Kinesis vs SQS vs SNS",
      body: `These three services all move data between components but serve very different purposes, and choosing the right one depends primarily on the relationship between producers and consumers.

**Kinesis** is built for ordered, replayable data streams where multiple consumers need to independently read the same data. Records stay in the stream after being read — a consumer's position is tracked separately from the data itself, so you can replay the last 24 hours (or up to 365 days with extended retention), run multiple independent consumers in parallel, and backfill a new consumer from the beginning of the retention window. Use Kinesis when you need real-time analytics, sub-second latency, ordered processing within a partition, or the ability to replay data.

**SQS** is built for work queues where each message should be processed by exactly one consumer. Once a consumer successfully processes a message, it's deleted. SQS provides excellent buffering for variable-rate producers and consumers — when the consumer is slow, messages queue up safely. Use SQS when you need to decouple a producer from a consumer, buffer work items, or ensure each task is processed once.

**SNS** is a push notification service — it delivers a copy of each message to all subscribers immediately and discards it. There's no persistence, no replay, and no way for a slow subscriber to catch up on missed messages. SNS is the right choice for fan-out notification where you want to simultaneously notify multiple systems of an event. The canonical pattern is SNS + SQS: SNS delivers to multiple SQS queues, combining fan-out with durable buffering for each consumer.`,
    },
    {
      heading: "Kinesis with Other Services",
      body: `**Kinesis → Lambda** is one of the most common streaming patterns. Lambda's event source mapping polls the stream (or uses Enhanced Fan-Out), invokes Lambda with a batch of records per shard, and manages checkpointing. Because Lambda scales to one concurrent invocation per shard, adding shards is the mechanism for increasing parallel Lambda processing.

**Kinesis → Firehose → S3** is the standard pattern for building a data lake from streaming events. Kinesis Data Streams provides real-time access for operational consumers; Firehose delivers a copy to S3 in Parquet format for analytical queries with Athena. This separates operational and analytical concerns without duplicating your producer code.

**Kinesis → Data Analytics → Kinesis/Lambda** handles real-time stream enrichment or anomaly detection. The Analytics application reads the raw stream, computes an aggregate or detects a pattern, and writes results to a separate output stream or invokes Lambda to trigger an alert.

**API Gateway → Kinesis** uses API Gateway's AWS Service integration to write records directly to a Kinesis stream without a Lambda intermediary. Clients POST event data, API Gateway calls \`PutRecord\` on their behalf, and producers never interact with the Kinesis API directly. This is a clean pattern for high-volume event ingestion endpoints. **CloudWatch Logs → Kinesis Firehose** via subscription filters streams log data to Firehose for delivery to S3 or OpenSearch, enabling centralized log analytics without exporting logs manually.`,
    },
  ],

  keyFacts: [
    "Each shard: 1 MB/s write, 2 MB/s read (shared) or 2 MB/s per consumer (EFO)",
    "Max record size: 1 MB",
    "Default retention: 24 hours; max: 365 days",
    "Firehose minimum buffer: 60 seconds",
    "Firehose destinations: S3, Redshift, OpenSearch, Splunk, HTTP",
    "EFO: dedicated 2 MB/s per consumer per shard, up to 20 consumers per stream",
    "PutRecords: up to 500 records per request",
    "Hot shard: ProvisionedThroughputExceededException — use high-cardinality partition key",
    "KCL handles checkpointing, lease coordination, and failure recovery",
    "On-demand mode: auto-scales shards, no capacity management",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon S3",
    "Amazon Redshift",
    "Amazon OpenSearch Service",
    "Amazon Athena",
    "AWS Glue",
    "Amazon EventBridge",
    "Amazon API Gateway",
  ],

  examTips: [
    "Kinesis records stay in stream after reading (replayable); SQS messages are deleted.",
    "EFO: each consumer gets dedicated 2 MB/s per shard (no sharing) — use for multiple consumers.",
    "ProvisionedThroughputExceededException = hot shard or capacity exceeded. Split shard or use randomized partition key.",
    "Firehose minimum latency: 60 seconds (buffer interval). Not truly real-time.",
    "Lambda + Kinesis: one concurrent invocation per shard. More shards = more parallelism.",
    "BisectBatchOnFunctionError splits failing batch to isolate poison-pill records.",
    "KPL aggregates records; KCL consumer must deaggregate (or use deaggregation library).",
    "Firehose Lambda transformation: must complete within 5 minutes per batch.",
  ],
};
