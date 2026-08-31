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

**Amazon Managed Service for Apache Flink** (formerly Kinesis Data Analytics) sits between the two: you run managed Apache Flink applications that read from a Data Stream or Firehose and write results to another stream or service. This is the right tool when you need stateful stream processing — windowed aggregations, joins across streams, anomaly detection — without managing your own Flink cluster. **Kinesis Video Streams** handles live video ingestion from devices and is not covered in the DVA-C02 exam.`,
      quiz: [
        {
          question:
            "What is the minimum buffer interval for Kinesis Data Firehose, making it near-real-time rather than truly real-time?",
          options: ["5 minutes", "1 second", "10 seconds", "60 seconds"],
          correctIndex: 3,
          explanation:
            "Kinesis Data Firehose has a minimum buffer interval of 60 seconds. Data is held in the buffer until either the size threshold or the time threshold is reached. This means Firehose is near-real-time, not sub-second like Kinesis Data Streams.",
        },
        {
          question:
            "Which Kinesis service requires you to write your own consumer code and supports data replay?",
          options: [
            "Kinesis Data Firehose",
            "Kinesis Data Streams",
            "Amazon Managed Service for Apache Flink",
            "Kinesis Video Streams",
          ],
          correctIndex: 1,
          explanation:
            "Kinesis Data Streams requires consumers you write yourself (using KCL or the SDK) and supports data replay because records remain in the stream for the configured retention period (1–365 days). Firehose is fully managed with no consumer code required.",
        },
        {
          question:
            "Which Kinesis service is best suited for windowed aggregations and stateful stream processing?",
          options: [
            "Kinesis Data Streams with Enhanced Fan-Out",
            "Kinesis Data Firehose with Lambda transformation",
            "Kinesis Data Streams with KCL",
            "Amazon Managed Service for Apache Flink",
          ],
          correctIndex: 3,
          explanation:
            "Amazon Managed Service for Apache Flink (formerly Kinesis Data Analytics) runs managed Apache Flink applications that support the full Flink API including windowed aggregations, stateful processing, complex event processing, and stream joins.",
        },
      ],
    },
    {
      heading: "Kinesis Data Streams — Shards & Capacity",
      body: `A Kinesis stream is made up of **shards**, and each shard is an independently scalable unit of throughput. Each shard provides 1 MB/s or 1,000 records per second of write capacity, and 2 MB/s of read capacity. Understanding this model is critical for both design and troubleshooting.

The read capacity limit deserves special attention: the 2 MB/s is shared among all standard consumers polling a shard. If you have three applications all reading from the same shard, they compete for that 2 MB/s budget. **Enhanced Fan-Out (EFO)** solves this by giving each registered consumer its own dedicated 2 MB/s per shard via a push-based HTTP/2 delivery model, reducing per-consumer latency from ~200ms to ~70ms. EFO costs more per consumer-shard-hour but is the right choice when multiple independent consumers all need full throughput.

**Scaling** is manual in provisioned mode — you split a shard to double its capacity or merge two adjacent shards to reduce it. **On-demand mode** handles scaling automatically at higher cost, removing the need to calculate and manage shard counts.

The **partition key** you assign to each record determines which shard receives it. Kinesis hashes the key to a shard, so high-cardinality keys (user IDs, UUIDs, device IDs) distribute load evenly across shards. Low-cardinality keys create hot shards where all writes go to one or two shards, quickly exhausting their throughput limits and causing \`ProvisionedThroughputExceededException\`. Records within a shard are ordered by their **sequence number** — the guarantee of ordering is per-shard, not across the entire stream.`,
      quiz: [
        {
          question:
            "What write capacity does each Kinesis Data Streams shard provide?",
          options: [
            "500 records/s or 512 KB/s",
            "1,000 records/s or 1 MB/s",
            "10,000 records/s or 10 MB/s",
            "2,000 records/s or 2 MB/s",
          ],
          correctIndex: 1,
          explanation:
            "Each Kinesis Data Streams shard provides 1,000 records per second or 1 MB/s of write capacity (whichever limit is hit first), and 2 MB/s of read capacity.",
        },
        {
          question:
            "A stream has 3 applications all reading from the same shard using standard polling. What read throughput does each consumer get?",
          options: [
            "They share the 2 MB/s shard read capacity",
            "The first consumer gets 2 MB/s; others get nothing",
            "6 MB/s total, since consumers add capacity",
            "2 MB/s each, since Kinesis scales automatically",
          ],
          correctIndex: 0,
          explanation:
            "The 2 MB/s read capacity per shard is shared among all standard polling consumers. Three consumers on one shard share that 2 MB/s budget. Enhanced Fan-Out (EFO) solves this by giving each registered consumer its own dedicated 2 MB/s.",
        },
        {
          question:
            "What exception is thrown when a hot shard's write capacity is exceeded due to a low-cardinality partition key?",
          options: [
            "ShardCapacityExceededException",
            "ThrottlingException",
            "ResourceInUseException",
            "ProvisionedThroughputExceededException",
          ],
          correctIndex: 3,
          explanation:
            "ProvisionedThroughputExceededException is thrown when a shard's write or read throughput limits are exceeded. This is commonly caused by hot shards resulting from low-cardinality partition keys that concentrate traffic on a small number of shards.",
        },
      ],
    },
    {
      heading: "Producing Records",
      body: `Writing records to a Kinesis stream can be done at different levels of efficiency depending on your volume requirements. **PutRecord** sends a single record and returns its sequence number and shard ID — simple and useful for low-volume use cases but inefficient at scale. **PutRecords** batches up to 500 records in a single API call and returns individual success or failure status for each record, so you retry only the failed records rather than the whole batch.

\`\`\`typescript
import { KinesisClient, PutRecordsCommand } from "@aws-sdk/client-kinesis";

const kinesis = new KinesisClient({});

const result = await kinesis.send(new PutRecordsCommand({
  StreamName: "OrderEvents",
  Records: events.map((e) => ({
    Data: Buffer.from(JSON.stringify(e)),
    PartitionKey: e.userId, // high-cardinality key distributes across shards
  })),
}));

// Retry only failed records — do not resend the whole batch
const failed = result.Records?.filter((r) => r.ErrorCode);
\`\`\`

For high-volume producers, the **Kinesis Producer Library (KPL)** goes further by automatically aggregating multiple small records into a single Kinesis record (up to 1 MB). This aggregation dramatically increases the effective throughput per shard for applications that produce many small records. The KPL also handles retry logic, rate limiting, and CloudWatch metrics automatically. The important caveat: KPL-aggregated records must be deserialized by a KCL consumer or a deaggregation library — a standard \`GetRecords\` call will return the aggregated record as an opaque blob that your application must unpack.

Every record contains the actual data payload (up to 1 MB, base64-encoded in the API), a partition key, and an optional explicit hash key that overrides the default partition-key hashing. When a shard is throttled, implement exponential backoff in your retry logic — the KPL handles this automatically, which is one of the main reasons to use it over raw API calls for high-throughput producers.`,
      quiz: [
        {
          question:
            "What is the maximum number of records that can be sent in a single PutRecords API call?",
          options: ["1,000", "100", "10", "500"],
          correctIndex: 3,
          explanation:
            "PutRecords batches up to 500 records in a single API call. It returns individual success or failure status for each record, so you can retry only the failed records rather than the entire batch.",
        },
        {
          question:
            "What is an important caveat when using the Kinesis Producer Library (KPL) for record aggregation?",
          options: [
            "KPL increases per-shard costs due to additional API calls",
            "KPL does not support custom partition keys",
            "KPL can only send records to FIFO streams",
            "KPL-aggregated records must be deaggregated by a KCL consumer or deaggregation library",
          ],
          correctIndex: 3,
          explanation:
            "KPL aggregates multiple small records into a single Kinesis record. Standard GetRecords calls return the aggregated blob as-is — consumers must use the KCL or an explicit deaggregation library to unpack the individual records from the aggregated blob.",
        },
        {
          question:
            "What is the maximum size of a single Kinesis Data Streams record payload?",
          options: ["5 MB", "256 KB", "512 KB", "1 MB"],
          correctIndex: 3,
          explanation:
            "Each Kinesis Data Streams record payload can be up to 1 MB. The data is base64-encoded in API calls. For larger data, you would need to store the data elsewhere (e.g., S3) and send a reference in the stream.",
        },
      ],
    },
    {
      heading: "Consuming Records",
      body: `Kinesis supports two fundamentally different consumption models, and choosing the wrong one for your architecture is a common source of performance problems.

**Standard polling consumers** use the \`GetRecords\` API to pull batches of records from a shard. The critical constraint is that the 2 MB/s read throughput per shard is shared across all polling consumers. As you add more consumers, each gets a smaller share of the bandwidth and must poll more frequently to keep up. The **Kinesis Consumer Library (KCL)** is the standard tool for building polling consumers — it handles shard enumeration, checkpointing progress, lease coordination across multiple worker instances, and failure recovery. KCL consumers run as long-lived processes on EC2 or ECS.

**Enhanced Fan-Out** consumers use a push model: each registered consumer gets its own dedicated 2 MB/s per shard, delivered via HTTP/2 with ~70ms latency. Adding a new EFO consumer doesn't degrade existing consumers' throughput. The limit is 20 registered EFO consumers per stream. EFO is the right choice when you're adding a third or fourth consumer to a stream, or when any consumer is latency-sensitive.

**Lambda** can consume from Kinesis via event source mapping using the standard polling model (EFO for Lambda is also available but must be explicitly configured). Lambda processes records in shard order within each shard, with multiple shards executing as separate concurrent invocations. If Lambda fails to process a batch, it retries until the records expire from the stream — configuring \`BisectBatchOnFunctionError\` splits a failing batch in half to isolate the problematic record rather than blocking the entire shard.

\`\`\`typescript
import { KinesisStreamEvent } from "aws-lambda";

export const handler = async (event: KinesisStreamEvent) => {
  for (const record of event.Records) {
    // Data arrives base64-encoded — decode before parsing
    const payload = Buffer.from(record.kinesis.data, "base64").toString("utf-8");
    const data = JSON.parse(payload);
    await processEvent(data);
  }
  // Returning without error checkpoints the batch; an exception retries it
};
\`\`\``,
      quiz: [
        {
          question:
            "What is the maximum number of Enhanced Fan-Out (EFO) consumers that can be registered per Kinesis stream?",
          options: ["20", "5", "50", "10"],
          correctIndex: 0,
          explanation:
            "Up to 20 Enhanced Fan-Out consumers can be registered per stream. Each EFO consumer gets its own dedicated 2 MB/s per shard via HTTP/2 push, without sharing throughput with other consumers.",
        },
        {
          question:
            "A Lambda function processing Kinesis records keeps failing on one bad record in a batch, blocking the entire shard. What configuration helps isolate the problematic record?",
          options: [
            "Reduce the shard count to limit parallelism",
            "Increase the batch size to dilute the bad record",
            "Enable Enhanced Fan-Out to separate the failing consumer",
            "Enable BisectBatchOnFunctionError to split failing batches in half",
          ],
          correctIndex: 3,
          explanation:
            "BisectBatchOnFunctionError splits a failing batch in half on each retry, progressively isolating the problematic record. This prevents one bad record (poison pill) from blocking the entire shard indefinitely.",
        },
        {
          question:
            "How does Lambda scale when consuming from a Kinesis Data Stream?",
          options: [
            "One concurrent Lambda invocation per shard",
            "Lambda auto-scales based on the number of records per shard",
            "One Lambda function processes all shards sequentially",
            "Lambda scales based on payload size, not shard count",
          ],
          correctIndex: 0,
          explanation:
            "Lambda creates one concurrent invocation per shard when consuming from Kinesis via event source mapping. To increase Lambda parallelism, you increase the number of shards in the stream.",
        },
      ],
    },
    {
      heading: "Kinesis Data Firehose",
      body: `Firehose is designed for the common case where you want to land streaming data in a data store without writing any consumer code. You configure a delivery stream, point producers at it, and Firehose handles buffering, compression, format conversion, and delivery to your chosen destination.

**Sources** include Kinesis Data Streams, Amazon MSK (managed Kafka), direct PUT from the SDK or Kinesis Agent, CloudWatch Logs, IoT, and EventBridge. **Destinations** are S3, Amazon Redshift (via S3 staging), OpenSearch Service, Splunk, and HTTP endpoints including Datadog and New Relic. The buffering configuration — size (1–128 MB) and interval (60–900 seconds) — determines when Firehose delivers a batch. Data is delivered as soon as either threshold is met, so a 128 MB buffer with a 300-second interval will deliver when 128 MB accumulates or after 5 minutes, whichever comes first.

Two capabilities make Firehose more powerful than a simple forwarder. **Lambda transformation** lets you invoke a Lambda function on each batch to parse, filter, enrich, or reshape records before delivery. Records that the function fails to transform go to an S3 error bucket, and the function must return results within 5 minutes. **Format conversion** uses AWS Glue Data Catalog schema definitions to convert JSON records to Parquet or ORC format on the fly — critical for cost-efficient Athena queries on S3 data, where columnar formats can reduce query cost by 90% or more. GZIP, ZIP, and Snappy compression are also available for S3 deliveries.`,
      quiz: [
        {
          question:
            "Which of the following is NOT a supported Kinesis Data Firehose destination?",
          options: [
            "Amazon DynamoDB",
            "Amazon S3",
            "Amazon Redshift",
            "Amazon OpenSearch Service",
          ],
          correctIndex: 0,
          explanation:
            "Amazon DynamoDB is not a supported Kinesis Data Firehose destination. Firehose delivers to S3, Redshift (via S3 staging), OpenSearch Service, Splunk, and HTTP endpoints. For DynamoDB ingestion, you would use Kinesis Data Streams with a Lambda consumer.",
        },
        {
          question:
            "A Kinesis Firehose Lambda transformation function takes 6 minutes to process a batch. What happens?",
          options: [
            "Firehose retries with a smaller batch until it succeeds",
            "Firehose delivers the untransformed records to the destination",
            "The transformation times out; records go to the S3 error bucket",
            "Firehose automatically increases the timeout and waits",
          ],
          correctIndex: 2,
          explanation:
            "Lambda transformation functions must return results within 5 minutes. If the function exceeds this timeout, the transformation fails and those records are routed to the configured S3 error bucket rather than the main destination.",
        },
        {
          question:
            "What Firehose feature converts JSON records to Parquet or ORC format on the fly for cost-efficient Athena queries?",
          options: [
            "Lambda transformation",
            "Compression with Snappy",
            "S3 intelligent tiering",
            "Format conversion using AWS Glue Data Catalog",
          ],
          correctIndex: 3,
          explanation:
            "Format conversion uses AWS Glue Data Catalog schema definitions to convert JSON records to columnar formats (Parquet or ORC) on the fly. Columnar formats can reduce Athena query costs by 90% or more compared to JSON or CSV.",
        },
      ],
    },
    {
      heading: "Amazon Managed Service for Apache Flink",
      body: `Amazon Managed Service for Apache Flink (formerly Kinesis Data Analytics) lets you run stateful stream processing without provisioning or managing a Flink cluster. You write a Flink application in Java, Scala, or Python, and the managed service handles cluster management, auto-scaling, checkpointing to S3, and failure recovery and restart.

The service reads from Kinesis Data Streams or Firehose and writes results to Kinesis Data Streams, Firehose, or Lambda. A legacy SQL-based application mode is also supported but Apache Flink applications are preferred for new development, as they support the full Flink API including windowed aggregations, stateful processing, complex event processing, and stream joins.

The practical use cases are workloads that need real-time computation on the stream itself rather than just moving data from point A to point B: detecting anomalies in IoT sensor telemetry, computing rolling aggregates for a real-time dashboard, analyzing click-stream sequences to detect fraud patterns, or joining an event stream with a reference data set to enrich events before forwarding them. The managed aspect is significant — running Apache Flink yourself requires significant operational expertise, and the managed service removes that burden.`,
      quiz: [
        {
          question:
            "Which programming languages are supported for writing applications on Amazon Managed Service for Apache Flink?",
          options: [
            "Go and Rust",
            "Only SQL",
            "Java, Scala, or Python",
            "JavaScript and TypeScript only",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Managed Service for Apache Flink supports Flink applications written in Java, Scala, or Python. A legacy SQL mode is also available but Apache Flink applications using the full Flink API are preferred for new development.",
        },
        {
          question:
            "What operational burden does Amazon Managed Service for Apache Flink remove compared to self-managed Flink?",
          options: [
            "Cluster management, auto-scaling, checkpointing, and failure recovery",
            "The need to write Flink application code",
            "The need for data sources and sinks",
            "Writing SQL queries for stream processing",
          ],
          correctIndex: 0,
          explanation:
            "The managed service handles cluster management, auto-scaling, checkpointing state to S3, and failure recovery and restart. Running Apache Flink yourself requires significant operational expertise that the managed service eliminates.",
        },
        {
          question:
            "What is a primary use case for Amazon Managed Service for Apache Flink that distinguishes it from Kinesis Data Firehose?",
          options: [
            "Delivering data to S3 without consumer code",
            "Real-time stateful computation like windowed aggregations and stream joins",
            "Buffering and compressing records before storage",
            "Converting JSON records to Parquet format",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Managed Service for Apache Flink is designed for real-time stateful computation on the stream: windowed aggregations, joins across streams, anomaly detection, and complex event processing. Firehose is for simple delivery from point A to point B.",
        },
      ],
    },
    {
      heading: "Kinesis vs SQS vs SNS",
      body: `These three services all move data between components but serve very different purposes, and choosing the right one depends primarily on the relationship between producers and consumers.

**Kinesis** is built for ordered, replayable data streams where multiple consumers need to independently read the same data. Records stay in the stream after being read — a consumer's position is tracked separately from the data itself, so you can replay the last 24 hours (or up to 365 days with extended retention), run multiple independent consumers in parallel, and backfill a new consumer from the beginning of the retention window. Use Kinesis when you need real-time analytics, sub-second latency, ordered processing within a partition, or the ability to replay data.

**SQS** is built for work queues where each message should be processed by exactly one consumer. Once a consumer successfully processes a message, it's deleted. SQS provides excellent buffering for variable-rate producers and consumers — when the consumer is slow, messages queue up safely. Use SQS when you need to decouple a producer from a consumer, buffer work items, or ensure each task is processed once.

**SNS** is a push notification service — it delivers a copy of each message to all subscribers immediately and discards it. There's no persistence, no replay, and no way for a slow subscriber to catch up on missed messages. SNS is the right choice for fan-out notification where you want to simultaneously notify multiple systems of an event. The canonical pattern is SNS + SQS: SNS delivers to multiple SQS queues, combining fan-out with durable buffering for each consumer.`,
      quiz: [
        {
          question:
            "A new analytics service needs to process all events from the past 7 days that have already been consumed by another service. Which service supports this requirement?",
          options: [
            "Kinesis Data Streams — records are retained and replayable",
            "SQS — messages can be retrieved after processing",
            "None — consumed messages cannot be replayed in any AWS service",
            "SNS — messages are retained for 7 days by default",
          ],
          correctIndex: 0,
          explanation:
            "Kinesis Data Streams retains records for a configurable period (1–365 days) and tracks consumer position separately from the data. A new consumer can be pointed to the beginning of the retention window to replay historical data, making it ideal for adding new consumers to historical data.",
        },
        {
          question:
            "What happens to an SQS message after it is successfully processed and deleted by a consumer?",
          options: [
            "It is permanently deleted and cannot be replayed",
            "It remains available for other consumers to read",
            "It is archived to S3 automatically",
            "It moves to a cold storage tier for 14 days",
          ],
          correctIndex: 0,
          explanation:
            "SQS is a work queue where each message is consumed by one consumer and then permanently deleted. Unlike Kinesis, there is no replay capability — once deleted, the message is gone.",
        },
        {
          question:
            "Which pattern combines fan-out delivery with durable per-consumer buffering?",
          options: [
            "SNS → multiple SQS queues",
            "Kinesis → Enhanced Fan-Out consumers",
            "SQS FIFO → Lambda",
            "EventBridge → Lambda",
          ],
          correctIndex: 0,
          explanation:
            "The SNS + SQS fan-out pattern delivers a copy of each message to multiple SQS queues simultaneously. Each queue provides durable buffering for its consumer, which processes independently at its own pace with its own retry and DLQ configuration.",
        },
      ],
    },
    {
      heading: "Kinesis with Other Services",
      body: `**Kinesis → Lambda** is one of the most common streaming patterns. Lambda's event source mapping polls the stream (or uses Enhanced Fan-Out), invokes Lambda with a batch of records per shard, and manages checkpointing. Because Lambda scales to one concurrent invocation per shard, adding shards is the mechanism for increasing parallel Lambda processing.

**Kinesis → Firehose → S3** is the standard pattern for building a data lake from streaming events. Kinesis Data Streams provides real-time access for operational consumers; Firehose delivers a copy to S3 in Parquet format for analytical queries with Athena. This separates operational and analytical concerns without duplicating your producer code.

**Kinesis → Data Analytics → Kinesis/Lambda** handles real-time stream enrichment or anomaly detection. The Analytics application reads the raw stream, computes an aggregate or detects a pattern, and writes results to a separate output stream or invokes Lambda to trigger an alert.

**API Gateway → Kinesis** uses API Gateway's AWS Service integration to write records directly to a Kinesis stream without a Lambda intermediary. Clients POST event data, API Gateway calls \`PutRecord\` on their behalf, and producers never interact with the Kinesis API directly. This is a clean pattern for high-volume event ingestion endpoints. **CloudWatch Logs → Kinesis Firehose** via subscription filters streams log data to Firehose for delivery to S3 or OpenSearch, enabling centralized log analytics without exporting logs manually.`,
      quiz: [
        {
          question:
            "How do you increase the number of concurrent Lambda invocations when consuming from Kinesis Data Streams?",
          options: [
            "Enable Enhanced Fan-Out for Lambda",
            "Increase the number of shards in the stream",
            "Increase the Lambda batch size",
            "Configure Lambda reserved concurrency",
          ],
          correctIndex: 1,
          explanation:
            "Lambda creates one concurrent invocation per shard. Increasing the number of shards increases the parallelism of Lambda processing. Batch size affects how many records each invocation processes, not how many invocations run concurrently.",
        },
        {
          question:
            "Which integration pattern writes records directly to Kinesis Data Streams without requiring a Lambda intermediary?",
          options: [
            "API Gateway AWS Service integration → Kinesis PutRecord",
            "CloudFront → Kinesis",
            "S3 event notifications → Kinesis",
            "CloudWatch alarms → Kinesis",
          ],
          correctIndex: 0,
          explanation:
            "API Gateway's AWS Service integration can call Kinesis PutRecord directly on behalf of clients. This eliminates the Lambda intermediary for high-volume event ingestion, reducing cost and latency.",
        },
        {
          question:
            "What is the standard pattern for building a data lake that simultaneously serves real-time consumers and analytical queries?",
          options: [
            "SNS → S3 → Athena",
            "SQS → Lambda → S3",
            "EventBridge → Glue → S3",
            "Kinesis Data Streams → Firehose → S3 (with Kinesis also serving operational consumers)",
          ],
          correctIndex: 3,
          explanation:
            "Kinesis Data Streams serves real-time operational consumers while also feeding Kinesis Data Firehose, which delivers data to S3 in columnar format for Athena queries. This separates operational and analytical concerns without duplicating producer code.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "You have 4 independent applications that all need to read from the same Kinesis stream with full throughput. What should you use?",
      options: [
        "Create 4 separate Kinesis streams, one per consumer",
        "Standard polling with KCL for each consumer",
        "Enhanced Fan-Out (EFO) — each consumer gets dedicated 2 MB/s per shard",
        "Use SQS instead, which supports multiple consumers natively",
      ],
      correctIndex: 2,
      explanation:
        "Enhanced Fan-Out gives each registered consumer its own dedicated 2 MB/s per shard via HTTP/2 push. With standard polling, all 4 consumers share the 2 MB/s read capacity per shard, each getting only 500 KB/s.",
    },
    {
      question:
        "A producer writes records with the same partition key for all events. What problem will occur at high volume?",
      options: [
        "Records will be delivered out of order",
        "The retention period will be shortened automatically",
        "ProvisionedThroughputExceededException due to hot shards",
        "Records will be duplicated across shards",
      ],
      correctIndex: 2,
      explanation:
        "A low-cardinality partition key causes all records to hash to the same shard, creating a hot shard. This quickly exhausts the 1 MB/s write capacity and causes ProvisionedThroughputExceededException. Use high-cardinality keys like UUIDs or user IDs.",
    },
    {
      question:
        "What is the minimum delivery latency you should expect from Kinesis Data Firehose?",
      options: [
        "At least 60 seconds",
        "At least 5 minutes",
        "Under 1 second",
        "About 5 seconds",
      ],
      correctIndex: 0,
      explanation:
        "Kinesis Data Firehose buffers records and delivers when either the size threshold OR the time threshold is reached. The minimum buffer interval is 60 seconds, making Firehose near-real-time, not sub-second.",
    },
    {
      question:
        "A Lambda function is stuck retrying a bad record in a Kinesis batch, blocking the entire shard. Which configuration resolves this?",
      options: [
        "Decrease the batch size to 1 record",
        "Use Enhanced Fan-Out to separate the Lambda consumer",
        "Enable BisectBatchOnFunctionError to progressively isolate the bad record",
        "Increase the Lambda timeout to allow more processing time",
      ],
      correctIndex: 2,
      explanation:
        "BisectBatchOnFunctionError splits a failing batch in half on each retry, progressively narrowing down to the problematic record. This prevents a single poison-pill record from blocking the entire shard indefinitely.",
    },
    {
      question:
        "Which Kinesis API sends up to 500 records in a single call and returns per-record success/failure?",
      options: ["PutRecords", "SendRecords", "PutRecord", "BatchPutRecords"],
      correctIndex: 0,
      explanation:
        "PutRecords sends up to 500 records in a single API call and returns individual success or failure status for each record in the response. This allows you to retry only the failed records rather than the entire batch.",
    },
    {
      question:
        "What is the key difference between Kinesis Data Streams and SQS for message consumption?",
      options: [
        "SQS supports ordering within partitions; Kinesis does not",
        "Kinesis is cheaper than SQS for high-volume workloads",
        "Kinesis supports larger message sizes than SQS",
        "Kinesis records persist and can be replayed; SQS messages are deleted after processing",
      ],
      correctIndex: 3,
      explanation:
        "Kinesis records remain in the stream for the configured retention period (up to 365 days) and can be replayed by pointing a consumer to an earlier position. SQS messages are permanently deleted once successfully processed.",
    },
    {
      question:
        "How many records per second can a single Kinesis shard ingest?",
      options: ["100", "500", "10,000", "1,000"],
      correctIndex: 3,
      explanation:
        "Each Kinesis shard supports up to 1,000 records per second or 1 MB/s of write throughput, whichever limit is reached first. Exceeding either limit causes ProvisionedThroughputExceededException.",
    },
    {
      question:
        "What does the Kinesis Producer Library (KPL) do that improves efficiency for high-volume small-record producers?",
      options: [
        "It aggregates multiple small records into a single Kinesis record up to 1 MB",
        "It compresses records using GZIP before sending",
        "It routes records to the least-loaded shard automatically",
        "It shards records automatically based on content",
      ],
      correctIndex: 0,
      explanation:
        "The KPL aggregates multiple small records into a single Kinesis record (up to 1 MB), dramatically increasing effective throughput per shard for workloads with many small records. KCL consumers or a deaggregation library must be used to unpack these aggregated records.",
    },
  ],
};
