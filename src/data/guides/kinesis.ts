import { ServiceGuide } from "../../types/guide";

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
      body: `**Kinesis Data Streams (KDS)**: real-time, custom consumers, configurable retention (1–365 days), shard-based capacity, sub-second latency. You write consumer code.

**Kinesis Data Firehose**: near-real-time (min 60-second buffer), fully managed delivery to S3, Redshift, OpenSearch, Splunk, or HTTP endpoints. No consumer code needed.

**Kinesis Data Analytics (for Apache Flink)**: run real-time SQL or Apache Flink applications on streaming data from KDS or Firehose. Managed Flink runtime.

**Kinesis Video Streams**: ingest, process, and store video streams from devices. Not covered in DVA-C02.`,
    },
    {
      heading: "Kinesis Data Streams — Shards & Capacity",
      body: `A stream is made up of **shards**. Each shard provides:
- **Write**: 1 MB/s or 1,000 records/s per shard
- **Read**: 2 MB/s per shard (shared across all consumers) OR 2 MB/s per consumer per shard with Enhanced Fan-Out (push-based, not polling)

**Scaling shards**:
- *Split shard*: divide one shard into two (double capacity)
- *Merge shards*: combine two adjacent shards (reduce capacity)
- *On-demand mode*: automatic scaling, no shard management, higher cost

**Partition key**: determines which shard receives a record. Kinesis hashes the key and maps to a shard. Use high-cardinality keys for even distribution. Hot shards cause throttling (ProvisionedThroughputExceededException).

**Sequence number**: unique identifier assigned to each record within a shard. Records within a shard are ordered by sequence number.

**Retention**: 24 hours default. Extend to 7 days (Enhanced, extra cost) or up to 365 days (Long-Term Retention, extra cost).`,
    },
    {
      heading: "Producing Records",
      body: `**PutRecord**: write one record at a time. Returns sequence number and shard ID. Simple but inefficient at high volume.

**PutRecords**: write up to 500 records per request. Returns individual success/failure per record. Retry only failed records. Much more efficient.

**Kinesis Producer Library (KPL)**: AWS-provided high-performance producer library. Features: automatic batching (aggregation), retry, rate limiting, CloudWatch metrics. Aggregates multiple small records into one Kinesis record (up to 1 MB). Consumers must use KCL or deaggregation library to unpack.

**Record structure**:
- Data: up to 1 MB (base64-encoded in API)
- Partition key: string, determines target shard
- Explicit hash key (optional): override partition-key hashing

**Throttling**: ProvisionedThroughputExceededException. Implement exponential backoff. KPL handles this automatically.`,
    },
    {
      heading: "Consuming Records",
      body: `**Standard consumers (GetRecords polling)**:
- Consumer polls shard via GetRecords API.
- Up to 2 MB/s read throughput **shared** across all consumers on a shard.
- Multiple consumers share the 2 MB/s limit — performance degrades with more consumers.
- Pull-based; consumer manages checkpointing.

**Enhanced Fan-Out (EFO)**:
- Each registered consumer gets **dedicated 2 MB/s** per shard (push-based via HTTP/2).
- Latency: ~70ms vs ~200ms for standard.
- Up to 20 registered consumers per stream.
- Additional cost per consumer-shard-hour.
- Best for multiple independent consumers needing full throughput.

**Kinesis Consumer Library (KCL)**: high-level consumer library. Handles shard enumeration, checkpointing, lease coordination (multiple worker instances), failure recovery. Run as a long-lived process on EC2 or ECS.

**Lambda as consumer**: event source mapping polls Kinesis (standard, not EFO by default). Configurable batch size, starting position, error handling. Lambda processes records in shard order. Multiple shards = multiple concurrent Lambda invocations.`,
    },
    {
      heading: "Kinesis Data Firehose",
      body: `Firehose is a fully managed delivery service — no shards, no consumers to code.

**Data flow**: Producer → Firehose Delivery Stream → (optional transform) → Destination

**Sources**: Kinesis Data Streams, MSK (Managed Kafka), Direct PUT (SDK/agent), CloudWatch Logs, IoT, EventBridge.

**Destinations**: Amazon S3, Amazon Redshift (via S3 staging), Amazon OpenSearch Service, Splunk, HTTP endpoint, Datadog, New Relic.

**Buffering**: Firehose buffers data before delivery. Configure by size (1–128 MB) and interval (60–900 seconds). Data delivered when either threshold is met. Minimum 60-second latency.

**Transformation**: optionally invoke a Lambda function to transform each record (parse, filter, enrich). Failed records go to an S3 error bucket. Lambda must return transformed records within 5 minutes.

**Format conversion**: convert JSON to Parquet or ORC using AWS Glue Data Catalog schema — no code needed. Essential for cost-efficient Athena queries.

**Compression**: GZIP, ZIP, Snappy for S3 delivery.`,
    },
    {
      heading: "Kinesis Data Analytics",
      body: `Kinesis Data Analytics (for Apache Flink) runs managed Apache Flink applications.

**Input**: Kinesis Data Streams, Kinesis Data Firehose, S3 (reference data for enrichment).
**Output**: Kinesis Data Streams, Kinesis Data Firehose, Lambda.

**SQL application (legacy)**: simpler SQL-based streaming queries. Still supported but Apache Flink is preferred.

**Flink application**: full Apache Flink programs (Java, Scala, Python). Stateful stream processing, windowing, complex event processing, joins.

**Use cases**: real-time dashboards, anomaly detection, click-stream analysis, IoT telemetry aggregation, fraud detection.

**Managed**: KDA handles Flink cluster management, auto-scaling, checkpointing (to S3), and failure recovery.`,
    },
    {
      heading: "Kinesis vs SQS vs SNS",
      body: `**Use Kinesis when**:
- You need ordered, replayable stream data
- Multiple consumers need to read the same data
- Real-time analytics or ML on the stream
- Sub-second latency matters
- Data retention for replay (hours to days)

**Use SQS when**:
- Decoupling producers and consumers
- Each message processed by exactly one consumer
- Variable processing speed (queue buffers the difference)
- Simple work queue pattern

**Use SNS when**:
- Fan-out to multiple subscribers
- Push-based notification (email, SMS, mobile push)
- No need for message replay or ordered processing

**Key difference**: Kinesis records remain in the stream after reading (replay possible); SQS messages are deleted after successful processing. SNS has no persistence — deliver-and-forget.`,
    },
    {
      heading: "Kinesis with Other Services",
      body: `**Kinesis → Lambda**: event source mapping. Lambda scales per shard. Error handling with BisectBatchOnFunctionError, destinations.

**Kinesis → Firehose → S3**: common pipeline. Real-time ingestion → near-real-time S3 delivery → Athena queries.

**Kinesis → Analytics → Kinesis/Lambda**: real-time stream processing. Analytics detects anomalies, triggers Lambda for alerts.

**API Gateway → Kinesis**: API Gateway AWS Service integration writes records directly to Kinesis. Clients POST events; API Gateway calls PutRecord without Lambda.

**IoT → Kinesis**: AWS IoT Core rules route device data to Kinesis streams for real-time analytics.

**CloudWatch Logs → Kinesis Firehose**: subscription filter streams log data to Firehose → S3/OpenSearch for log analytics.`,
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
