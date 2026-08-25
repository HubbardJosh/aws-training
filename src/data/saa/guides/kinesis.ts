import { ServiceGuide } from "../../../types/guide";

export const kinesisGuide: ServiceGuide = {
  id: "saa-kinesis",
  service: "Amazon Kinesis",
  domain: "development",
  tagline:
    "Real-time streaming data ingestion, processing, and analytics at any scale",
  intro:
    "Amazon Kinesis is a family of fully managed services for collecting, processing, and analyzing real-time streaming data — including clickstreams, application logs, IoT telemetry, financial transactions, and social media feeds — enabling decisions and actions in seconds rather than hours.",

  sections: [
    {
      heading: "Kinesis Data Streams: Core Concepts",
      body: `Kinesis Data Streams (KDS) is the core streaming service that ingests data records in real time and retains them for custom processing by one or more consumers. A stream is divided into shards — each shard provides 1 MB/s or 1,000 records/s of ingest capacity and 2 MB/s of read capacity. Producers write records to specific shards using a partition key, which is hashed to determine the shard assignment — choosing a high-cardinality partition key distributes records evenly across shards and prevents hot shards. Data records are retained in the stream for a configurable period: 24 hours by default, extendable up to 365 days (extended data retention). Multiple consumers can read the same stream independently, each maintaining their own checkpoint of which records they have processed — this is the fundamental advantage of KDS over SQS, which destructively removes messages after consumption. Enhanced Fan-Out provides dedicated 2 MB/s throughput per consumer per shard via a push model using HTTP/2, eliminating the read throughput sharing of polling consumers.`,
    },
    {
      heading: "Kinesis Data Firehose: Managed Delivery",
      body: `Kinesis Data Firehose is the simplest way to load streaming data into data stores and analytics services — it requires no consumer code and no shard management. Firehose receives records from producers (or from a Kinesis Data Stream) and delivers them in near-real time (60-second minimum latency or when the buffer fills) to Amazon S3, Amazon Redshift, Amazon OpenSearch Service, Splunk, or HTTP endpoints. Firehose can apply transformations to records before delivery using a Lambda function — for example, parsing JSON, converting formats (JSON to Parquet or ORC for columnar efficiency in S3), filtering records, and enriching data with reference data. Firehose automatically scales with no shard management, compresses data before delivery (GZIP, Snappy, ZIP), and can partition S3 output by custom prefixes including timestamp-based partitioning (year/month/day/hour) for efficient Athena or Glue queries. For the SAA-C03 exam, Firehose is the answer when you need to deliver streaming data to a destination store without writing consumer code.`,
    },
    {
      heading: "Kinesis Data Analytics: SQL and Apache Flink",
      body: `Kinesis Data Analytics enables real-time processing of streaming data using either SQL queries or Apache Flink applications. The SQL interface reads from Kinesis Data Streams or Firehose, applies continuous SQL queries (windowed aggregations, joins, filtering), and writes results to another stream, Firehose, or Lambda for downstream processing — enabling real-time dashboards, anomaly detection, and metric computation without writing Java or Scala code. Kinesis Data Analytics for Apache Flink (now Amazon Managed Service for Apache Flink) runs Flink applications for complex stateful stream processing — time-window aggregations, pattern detection, machine learning inference on streams, and event-time processing with watermarks. Use SQL-based analytics for straightforward aggregations and filtering; use Flink for complex stateful processing, multiple input streams, sophisticated windowing strategies, and custom processing logic beyond SQL's expressive power.`,
    },
    {
      heading: "Scaling Kinesis Data Streams",
      body: `Kinesis Data Streams scales by adding or removing shards — a process called resharding. Shard splitting divides one shard into two, doubling the ingest capacity for a partition range; shard merging combines two adjacent shards into one, reducing cost when throughput decreases. The number of shards required is calculated from the maximum ingest rate (total MB/s divided by 1 MB/s per shard) and the maximum read rate (total MB/s consumed divided by 2 MB/s per shard, or 2 MB/s per consumer per shard with Enhanced Fan-Out). On-Demand mode eliminates manual shard management by automatically scaling capacity based on observed throughput, scaling up instantly and scaling down after 24 hours of reduced traffic — appropriate for streams with unpredictable traffic patterns. Provisioned mode requires manual shard count management but provides predictable cost for stable, well-understood throughput requirements.`,
    },
    {
      heading: "Kinesis vs. SQS: Choosing the Right Service",
      body: `Kinesis Data Streams and SQS serve different streaming and messaging needs, and the SAA-C03 exam frequently asks you to distinguish them. Kinesis is appropriate when multiple consumers need to read the same data independently (replay and fan-out from a single stream), when data ordering within a shard is required, when records must be retained for replay over hours or days, and when processing real-time analytics on a continuous stream of data. SQS is appropriate when a message must be processed by exactly one consumer (work queue pattern), when you need simple decoupling between a producer and a single consumer type, and when you do not need multi-consumer fan-out or replay. For fan-out to multiple consumers, SNS feeding multiple SQS queues achieves parallel processing without Kinesis; for ordered, multi-consumer streaming with replay capability and high-throughput ingestion, Kinesis Data Streams is the correct choice. Kinesis also retains data after consumption; SQS deletes messages once consumed.`,
    },
    {
      heading: "Architecture Patterns with Kinesis",
      body: `The canonical Kinesis architecture for a clickstream analytics pipeline ingests events from millions of web clients via the Kinesis Producer Library (KPL) or the Kinesis Agent, stores them in a Kinesis Data Stream with shards scaled to match peak ingest rate, processes them in real time using Kinesis Data Analytics for aggregations (page views per minute, session durations), delivers raw events to S3 via Kinesis Data Firehose for long-term storage and batch analytics with Athena or EMR, and streams processed results to DynamoDB for a real-time dashboard. For IoT workloads, AWS IoT Core routes device messages to Kinesis Data Streams using IoT Rules, enabling real-time anomaly detection on sensor telemetry. Lambda can consume from Kinesis Data Streams using event source mapping — Lambda polls each shard, processes batches of records, and checkpoints after successful processing, with configurable batch size and parallelization factor per shard.`,
    },
  ],

  keyFacts: [
    "Each KDS shard: 1 MB/s ingest, 1,000 records/s ingest, 2 MB/s read throughput",
    "KDS data retention: 24 hours default, up to 365 days — enables replay by multiple consumers",
    "Enhanced Fan-Out: dedicated 2 MB/s per consumer per shard via HTTP/2 push",
    "Firehose delivers to S3, Redshift, OpenSearch, Splunk — no consumer code required",
    "Firehose minimum latency is 60 seconds (buffer-based delivery)",
    "Kinesis Data Analytics: SQL for simple aggregations; Flink for complex stateful processing",
    "On-Demand KDS mode auto-scales shards; Provisioned mode requires manual shard management",
    "KDS vs SQS: KDS for multi-consumer replay and ordering; SQS for single-consumer work queue",
    "Partition key determines shard placement — use high-cardinality keys to avoid hot shards",
    "Lambda + KDS event source mapping polls shards and checkpoints after successful batch processing",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Lambda",
    "Amazon Redshift",
    "Amazon DynamoDB",
    "Amazon MSK",
    "AWS Glue",
  ],

  examTips: [
    "Kinesis = ordered, multi-consumer, replay; SQS = single-consumer, at-most-once work queue",
    "Firehose = managed delivery to a destination, no consumer code — not for custom real-time processing",
    "Hot shard = low-cardinality partition key — choose a partition key with high cardinality",
    "Enhanced Fan-Out is needed when multiple consumers share a shard and need dedicated throughput",
    "On-Demand mode is for unpredictable traffic; Provisioned mode is cheaper for stable, known throughput",
    "Firehose Lambda transformation converts records before delivery (e.g., JSON to Parquet)",
    "KDS retention up to 365 days enables replay for reprocessing after consumer bugs are fixed",
    "Lambda parallelization factor per shard allows multiple concurrent Lambda invocations per shard",
  ],
};
