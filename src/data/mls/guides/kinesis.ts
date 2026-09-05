import { ServiceGuide } from "../../../types/guide";

export const kinesisGuide: ServiceGuide = {
  id: "mls-kinesis",
  service: "Amazon Kinesis",
  domain: "services",
  tagline:
    "Real-time data streaming platform for ingesting and processing ML training and inference data",
  intro:
    "Amazon Kinesis is the AWS streaming data platform, enabling real-time ingestion, processing, and delivery of data for ML pipelines. It includes Kinesis Data Streams for custom processing, Kinesis Data Firehose for managed delivery to storage, and Kinesis Data Analytics for SQL-based stream processing.",

  sections: [
    {
      heading: "Kinesis Data Streams for ML Ingestion",
      body: `Kinesis Data Streams (KDS) is a durable, real-time data streaming service that captures data from thousands of producers and makes it available to multiple consumers. Data is organized into shards, each providing 1 MB/s write and 2 MB/s read throughput. For ML pipelines, KDS serves as the ingestion layer for clickstream data, IoT sensor readings, transaction events, and application logs that will feed real-time feature computation or be accumulated for batch training.

Shards are the unit of throughput scaling — you add shards to increase capacity. On-Demand mode automatically scales shards based on traffic, eliminating manual shard management. Data retention is configurable from 24 hours to 365 days, enabling replay of historical events for model retraining. KDS supports Enhanced Fan-Out, which provides dedicated 2 MB/s throughput per consumer per shard using HTTP/2 push, enabling multiple ML consumers (feature computation, model serving, monitoring) to read the same stream concurrently without competing for bandwidth.`,
      quiz: [
        {
          question:
            "What is the throughput capacity of a single Kinesis Data Streams shard?",
          options: [
            "10 MB/s write and 10 MB/s read",
            "1 MB/s write and 2 MB/s read",
            "5 MB/s write and 5 MB/s read",
            "2 MB/s write and 4 MB/s read",
          ],
          correctIndex: 1,
          explanation:
            "Each Kinesis Data Streams shard provides 1 MB/s (or 1,000 records/s) write throughput and 2 MB/s read throughput. To scale, you add shards. Enhanced Fan-Out provides 2 MB/s dedicated read throughput per consumer per shard via HTTP/2.",
        },
      ],
    },
    {
      heading: "Kinesis Data Firehose for ML Data Delivery",
      body: `Kinesis Data Firehose is a fully managed delivery service that automatically loads streaming data into S3, Redshift, OpenSearch, or Splunk. Unlike KDS, there are no shards to manage — Firehose scales automatically. It buffers incoming data and delivers it in batches based on configurable size (up to 128 MB) or time (up to 900 seconds) thresholds. For ML pipelines, Firehose is the simplest way to accumulate streaming events into S3 for batch training without building a custom consumer.

Firehose supports inline transformation using Lambda: each record passes through a Lambda function for format conversion, filtering, or enrichment before delivery. This enables converting JSON events to Parquet (required for efficient SageMaker training) without a separate ETL job. Firehose can also invoke a data format conversion to Parquet or ORC using an Apache Arrow schema from the Glue Data Catalog, making it a fully managed path from streaming events to training-ready columnar data in S3.`,
      quiz: [
        {
          question:
            "Which Kinesis service is most appropriate when you need to automatically deliver streaming ML training data to S3 in Parquet format with no infrastructure management?",
          options: [
            "Kinesis Data Streams with a Lambda consumer that writes to S3",
            "Kinesis Data Firehose with built-in format conversion to Parquet using Glue Data Catalog schema",
            "Kinesis Data Analytics with an S3 output destination",
            "Amazon MSK (Managed Streaming for Kafka) with a Kafka Connect S3 sink",
          ],
          correctIndex: 1,
          explanation:
            "Kinesis Data Firehose is a fully managed delivery service that requires no infrastructure management. Its built-in format conversion feature converts JSON to Parquet or ORC using a schema from the Glue Data Catalog, making it the simplest fully managed path for delivering streaming data to S3 in a training-ready columnar format.",
        },
      ],
    },
    {
      heading: "Kinesis Data Analytics for Real-Time Feature Engineering",
      body: `Kinesis Data Analytics (now part of Amazon Managed Service for Apache Flink) enables real-time SQL or Java/Scala Flink applications on streaming data. For ML, it computes time-windowed aggregations — such as a user's click count in the last 5 minutes, average transaction value in the last hour, or rolling standard deviation of sensor readings — that serve as real-time features for online inference. These computed features can be written to SageMaker Feature Store's online store for millisecond retrieval during inference.

Tumbling windows (non-overlapping fixed-size time buckets) and sliding windows (overlapping windows that advance every N seconds) are the two primary aggregation patterns in streaming feature engineering. Tumbling windows are simpler and used for hourly or daily aggregations; sliding windows compute continuously updated features with higher freshness. For fraud detection, recommendation systems, and dynamic pricing ML models, real-time windowed features computed by Kinesis Analytics are often more predictive than static batch features.`,
      quiz: [
        {
          question:
            "A recommendation system needs features representing a user's clicks in the last 10 minutes, updated every 30 seconds. Which Kinesis Data Analytics window type is appropriate?",
          options: [
            "Tumbling window — 10-minute non-overlapping buckets updated every 10 minutes",
            "Sliding window — 10-minute window that advances every 30 seconds, giving continuously updated features",
            "Session window — windows that open on user login and close after inactivity",
            "Global window — aggregates all data since stream creation",
          ],
          correctIndex: 1,
          explanation:
            "A sliding window of 10 minutes advancing every 30 seconds computes a continuously updated count of the last 10 minutes of clicks, refreshed every 30 seconds. This is more appropriate than a tumbling window (which would reset every 10 minutes) for near-real-time recommendation features.",
        },
      ],
    },
    {
      heading: "Kinesis and the Real-Time ML Inference Architecture",
      body: `In a real-time ML serving architecture, Kinesis often connects the data plane (user events) to the ML feature layer. A canonical pattern is: user actions → Kinesis Data Streams → AWS Lambda or Kinesis Analytics (feature computation) → SageMaker Feature Store online store → SageMaker endpoint reads features → returns prediction. This pipeline enables sub-100ms inference latency while ensuring features reflect the most recent user behavior.

For model monitoring in production, inference requests and responses can be captured to Kinesis Data Streams and then to S3 via Firehose, where SageMaker Model Monitor baselines them against training data distributions to detect drift. SageMaker endpoint data capture integrates directly with this pattern. Understanding this end-to-end architecture — from event ingestion through feature computation to inference and monitoring — is central to the MLS-C01 Implementation and Operations domain.`,
      quiz: [
        {
          question:
            "In a real-time ML inference architecture, what role does Kinesis Data Streams typically play?",
          options: [
            "It stores model artifacts and serves them to inference endpoints",
            "It ingests real-time user events and routes them to feature computation and monitoring pipelines",
            "It runs inference directly on streaming data using built-in ML algorithms",
            "It replaces SageMaker endpoints for real-time predictions",
          ],
          correctIndex: 1,
          explanation:
            "Kinesis Data Streams is the ingestion and routing layer. It captures real-time user events and fans them out to consumers: feature computation pipelines (Lambda, Kinesis Analytics), monitoring systems, and training data accumulators. It does not perform inference itself — that is SageMaker's role.",
        },
      ],
    },
    {
      heading: "Kinesis Scaling, Ordering, and Partitioning for ML",
      body: `For ML workloads, the partition key used when writing to Kinesis Data Streams determines both ordering guarantees and load distribution. Records with the same partition key go to the same shard and are delivered in order — important when computing user-level features where event sequence matters. If partition keys are not diverse enough, hot shards form where one shard receives disproportionate traffic. For ML training data ingestion, use high-cardinality partition keys (user ID, session ID, device ID) to distribute load evenly.

Enhanced Fan-Out (EFO) is critical when multiple consumers need to read the same stream concurrently — for example, one consumer computing features for real-time inference and another writing raw events to S3 for offline training. Without EFO, all consumers share the 2 MB/s read limit per shard and compete for bandwidth. With EFO, each registered consumer gets its own 2 MB/s channel per shard, enabling parallel consumption without throughput degradation.`,
      quiz: [
        {
          question:
            "A Kinesis Data Streams pipeline has two consumers reading the same stream: one for real-time feature computation and one for writing to S3 for training. What should be enabled to prevent them from competing for read throughput?",
          options: [
            "Increase shard count to double the read capacity",
            "Enable Enhanced Fan-Out — each registered consumer gets dedicated 2 MB/s throughput per shard",
            "Use two separate Kinesis streams, one per consumer",
            "Use Kinesis Data Firehose as a second consumer since it has unlimited read throughput",
          ],
          correctIndex: 1,
          explanation:
            "Enhanced Fan-Out (EFO) provides each registered consumer with dedicated 2 MB/s read throughput per shard via HTTP/2 push, preventing consumers from competing for the shared read limit. This is the correct approach when multiple independent consumers need to read the same stream concurrently.",
        },
      ],
    },
  ],

  keyFacts: [
    "Kinesis Data Streams: 1 MB/s write, 2 MB/s read per shard; add shards to scale",
    "Enhanced Fan-Out: dedicated 2 MB/s per consumer per shard via HTTP/2 — prevents consumer contention",
    "Data retention: 24 hours default, up to 365 days — enables event replay for retraining",
    "Kinesis Data Firehose: fully managed delivery to S3, Redshift, OpenSearch — auto-scales, no shards",
    "Firehose built-in Parquet/ORC conversion uses Glue Data Catalog schema — managed columnar conversion",
    "Kinesis Data Analytics (Apache Flink): tumbling and sliding windows for real-time feature aggregation",
    "Partition key = determines shard routing and ordering; use high-cardinality keys to avoid hot shards",
    "On-Demand mode: KDS automatically scales shards based on traffic",
    "Real-time ML pattern: events → KDS → feature computation → Feature Store → SageMaker endpoint",
    "SageMaker endpoint data capture → Firehose → S3 → Model Monitor for production drift detection",
  ],

  relatedServices: [
    "Amazon SageMaker",
    "AWS Glue",
    "AWS Lambda",
    "Amazon S3",
    "Amazon MSK",
    "Amazon EMR",
  ],

  examTips: [
    "KDS = custom processing with control; Firehose = managed delivery to destinations — know when to use each",
    "EFO is required when multiple independent consumers need the same stream without throughput competition",
    "Partition key determines ordering AND shard distribution — high cardinality prevents hot shards",
    "Firehose Lambda transform = convert, filter, or enrich records inline before S3 delivery",
    "Tumbling windows = non-overlapping buckets; sliding windows = overlapping, higher freshness",
    "KDS + Glue Streaming → Feature Store = the real-time feature engineering pattern for MLS-C01",
    "Firehose Parquet conversion eliminates a separate Glue job for training data preparation",
    "Data retention up to 365 days enables dataset versioning and event replay for retraining",
  ],

  topicQuiz: [
    {
      question:
        "A company wants to stream clickstream events to S3 in Parquet format for daily SageMaker training with no custom consumer code. Which is the simplest architecture?",
      options: [
        "Kinesis Data Streams → Lambda consumer → custom Parquet writer → S3",
        "Kinesis Data Firehose with Parquet format conversion using Glue Data Catalog schema → S3",
        "Kinesis Data Streams → Glue Streaming ETL → S3",
        "Amazon MSK → Kafka Connect S3 sink with Avro serialization",
      ],
      correctIndex: 1,
      explanation:
        "Kinesis Data Firehose with built-in Parquet format conversion is fully managed — no consumer code required. It automatically buffers, converts to Parquet using a Glue Data Catalog schema, and delivers to S3. This is simpler than building custom consumers or running Glue Streaming jobs.",
    },
    {
      question:
        "Which Kinesis Data Streams feature should be enabled when multiple downstream ML systems (feature computation and monitoring) need to independently read the same stream at full throughput?",
      options: [
        "Shard splitting — double the shards to double total read throughput",
        "Extended data retention — keep data longer so consumers can read at their own pace",
        "Enhanced Fan-Out — provides dedicated 2 MB/s throughput per consumer per shard",
        "On-Demand scaling — automatically adds shards when consumer demand increases",
      ],
      correctIndex: 2,
      explanation:
        "Enhanced Fan-Out (EFO) gives each registered consumer its own dedicated 2 MB/s throughput per shard via HTTP/2 push. Without EFO, all consumers share the 2 MB/s read limit and compete for bandwidth. EFO is the correct solution for independent concurrent consumers.",
    },
  ],
};
