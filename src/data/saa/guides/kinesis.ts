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
      quiz: [
        {
          question:
            "What is the ingest capacity of a single Kinesis Data Stream shard?",
          options: [
            "5 MB/s or 5,000 records/s",
            "1 MB/s or 1,000 records/s",
            "2 MB/s or 2,000 records/s",
            "10 MB/s or 10,000 records/s",
          ],
          correctIndex: 1,
          explanation:
            "Each Kinesis Data Stream shard provides 1 MB/s or 1,000 records/s of write (ingest) capacity and 2 MB/s of read capacity. To handle more throughput, you must increase the number of shards by splitting them.",
        },
        {
          question:
            "A Kinesis Data Stream has five consumers all polling the same shard. Which feature provides each consumer with a dedicated 2 MB/s read throughput without sharing?",
          options: [
            "Shard splitting",
            "Provisioned throughput mode",
            "Enhanced Fan-Out",
            "Extended data retention",
          ],
          correctIndex: 2,
          explanation:
            "Enhanced Fan-Out provides each registered consumer with a dedicated 2 MB/s throughput per shard via a push model using HTTP/2. Without Enhanced Fan-Out, all polling consumers share the shard's 2 MB/s read limit, which degrades per-consumer throughput as the number of consumers grows.",
        },
        {
          question:
            "What is the default data retention period for Kinesis Data Streams, and what is the maximum?",
          options: [
            "12 hours default, 90 days maximum",
            "24 hours default, 365 days maximum",
            "7 days default, 30 days maximum",
            "1 hour default, 7 days maximum",
          ],
          correctIndex: 1,
          explanation:
            "Kinesis Data Streams retains records for 24 hours by default. Extended data retention can be configured up to 365 days, enabling replay of historical data for reprocessing after consumer bugs or for new consumers that need to catch up from the beginning of the stream.",
        },
      ],
    },
    {
      heading: "Kinesis Data Firehose: Managed Delivery",
      body: `Kinesis Data Firehose is the simplest way to load streaming data into data stores and analytics services — it requires no consumer code and no shard management. Firehose receives records from producers (or from a Kinesis Data Stream) and delivers them in near-real time (60-second minimum latency or when the buffer fills) to Amazon S3, Amazon Redshift, Amazon OpenSearch Service, Splunk, or HTTP endpoints. Firehose can apply transformations to records before delivery using a Lambda function — for example, parsing JSON, converting formats (JSON to Parquet or ORC for columnar efficiency in S3), filtering records, and enriching data with reference data. Firehose automatically scales with no shard management, compresses data before delivery (GZIP, Snappy, ZIP), and can partition S3 output by custom prefixes including timestamp-based partitioning (year/month/day/hour) for efficient Athena or Glue queries. For the SAA-C03 exam, Firehose is the answer when you need to deliver streaming data to a destination store without writing consumer code.`,
      quiz: [
        {
          question:
            "A team wants to stream application logs to Amazon S3 in near-real time without writing any consumer code. Which Kinesis service is most appropriate?",
          options: [
            "Amazon MSK with S3 connector",
            "Kinesis Data Analytics with SQL output",
            "Kinesis Data Streams with a custom consumer Lambda",
            "Kinesis Data Firehose",
          ],
          correctIndex: 3,
          explanation:
            "Kinesis Data Firehose is purpose-built for managed delivery of streaming data to destinations like S3, Redshift, and OpenSearch without requiring consumer code or shard management. It handles buffering, compression, and delivery automatically, making it the correct choice when you want managed streaming delivery without custom processing code.",
        },
        {
          question:
            "What is the minimum latency for Kinesis Data Firehose delivery?",
          options: ["60 seconds", "10 seconds", "1 second", "5 minutes"],
          correctIndex: 0,
          explanation:
            "Kinesis Data Firehose delivers data in near-real time with a minimum latency of 60 seconds (or when the buffer size threshold is reached). This buffer-based delivery model means Firehose is not suitable for use cases requiring sub-minute real-time processing — Kinesis Data Streams with a custom consumer is needed for sub-second latency.",
        },
        {
          question:
            "How can Kinesis Data Firehose convert JSON records to Parquet format before delivering to S3?",
          options: [
            "By enabling columnar compression in the Firehose delivery stream settings",
            "By using a Glue ETL job triggered by Firehose",
            "By attaching a Lambda transformation function to the Firehose delivery stream",
            "By configuring an S3 lifecycle rule to convert format on arrival",
          ],
          correctIndex: 2,
          explanation:
            "Kinesis Data Firehose can invoke a Lambda function to transform records before delivery. This Lambda function can convert JSON to Parquet or ORC format, filter records, enrich data, or perform any other transformation. The transformed records are then delivered to the destination (S3, Redshift, etc.).",
        },
      ],
    },
    {
      heading: "Kinesis Data Analytics: SQL and Apache Flink",
      body: `Kinesis Data Analytics enables real-time processing of streaming data using either SQL queries or Apache Flink applications. The SQL interface reads from Kinesis Data Streams or Firehose, applies continuous SQL queries (windowed aggregations, joins, filtering), and writes results to another stream, Firehose, or Lambda for downstream processing — enabling real-time dashboards, anomaly detection, and metric computation without writing Java or Scala code. Kinesis Data Analytics for Apache Flink (now Amazon Managed Service for Apache Flink) runs Flink applications for complex stateful stream processing — time-window aggregations, pattern detection, machine learning inference on streams, and event-time processing with watermarks. Use SQL-based analytics for straightforward aggregations and filtering; use Flink for complex stateful processing, multiple input streams, sophisticated windowing strategies, and custom processing logic beyond SQL's expressive power.`,
      quiz: [
        {
          question:
            "A team needs to detect anomalies in a stream of IoT sensor data using complex stateful processing with event-time windowing and custom logic. Which Kinesis Data Analytics option should they use?",
          options: [
            "Amazon Managed Service for Apache Flink (Kinesis Data Analytics for Flink)",
            "Kinesis Data Firehose with Lambda transformation",
            "Kinesis Data Streams with a polling consumer",
            "Kinesis Data Analytics SQL interface",
          ],
          correctIndex: 0,
          explanation:
            "Amazon Managed Service for Apache Flink is the right choice for complex stateful stream processing including event-time windowing, pattern detection, and custom logic beyond what SQL can express. The SQL interface is better suited to straightforward windowed aggregations and filtering, but cannot handle the complex stateful processing required for sophisticated anomaly detection.",
        },
        {
          question:
            "Kinesis Data Analytics SQL processes streaming data from which sources?",
          options: [
            "From any AWS service that supports EventBridge events",
            "From Amazon S3 buckets and DynamoDB tables only",
            "Only from Amazon SQS queues",
            "From Kinesis Data Streams or Kinesis Data Firehose",
          ],
          correctIndex: 3,
          explanation:
            "Kinesis Data Analytics SQL reads from Kinesis Data Streams or Kinesis Data Firehose as input sources. It applies continuous SQL queries and writes results to output streams, Firehose, or Lambda for downstream processing.",
        },
      ],
    },
    {
      heading: "Scaling Kinesis Data Streams",
      body: `Kinesis Data Streams scales by adding or removing shards — a process called resharding. Shard splitting divides one shard into two, doubling the ingest capacity for a partition range; shard merging combines two adjacent shards into one, reducing cost when throughput decreases. The number of shards required is calculated from the maximum ingest rate (total MB/s divided by 1 MB/s per shard) and the maximum read rate (total MB/s consumed divided by 2 MB/s per shard, or 2 MB/s per consumer per shard with Enhanced Fan-Out). On-Demand mode eliminates manual shard management by automatically scaling capacity based on observed throughput, scaling up instantly and scaling down after 24 hours of reduced traffic — appropriate for streams with unpredictable traffic patterns. Provisioned mode requires manual shard count management but provides predictable cost for stable, well-understood throughput requirements.`,
      quiz: [
        {
          question:
            "A Kinesis Data Stream needs to handle 8 MB/s of ingest throughput. How many shards are required in Provisioned mode?",
          options: ["8 shards", "24 shards", "4 shards", "16 shards"],
          correctIndex: 0,
          explanation:
            "Each shard provides 1 MB/s of ingest capacity. For 8 MB/s of throughput, you need 8 shards (8 MB/s ÷ 1 MB/s per shard). You also need to verify the read side: 8 shards × 2 MB/s read = 16 MB/s of total read capacity, which must be sufficient for all consumers.",
        },
        {
          question:
            "Which Kinesis Data Streams capacity mode automatically scales shard count based on traffic without manual management?",
          options: [
            "On-Demand mode",
            "Burst mode",
            "Enhanced Fan-Out mode",
            "Provisioned mode with auto-scaling enabled",
          ],
          correctIndex: 0,
          explanation:
            "On-Demand mode automatically scales shard capacity based on observed throughput peaks, scaling up instantly and scaling down after 24 hours of reduced traffic. This eliminates the need for manual shard management, making it ideal for unpredictable workloads. Provisioned mode requires manual shard count adjustments via resharding.",
        },
        {
          question:
            "A Kinesis stream has consistently low throughput for the last month. To reduce costs while keeping the stream operational, what resharding operation should be performed?",
          options: [
            "Shard merging to combine adjacent shards",
            "Shard splitting to increase parallelism",
            "Enabling On-Demand mode to reduce active shards",
            "Decreasing the data retention period",
          ],
          correctIndex: 0,
          explanation:
            "Shard merging combines two adjacent shards into one, halving the cost for that partition range. When throughput is consistently low, merging shards reduces the per-shard hourly cost without impacting throughput capacity requirements. Splitting would increase shard count and cost, not decrease it.",
        },
      ],
    },
    {
      heading: "Kinesis vs. SQS: Choosing the Right Service",
      body: `Kinesis Data Streams and SQS serve different streaming and messaging needs, and the SAA-C03 exam frequently asks you to distinguish them. Kinesis is appropriate when multiple consumers need to read the same data independently (replay and fan-out from a single stream), when data ordering within a shard is required, when records must be retained for replay over hours or days, and when processing real-time analytics on a continuous stream of data. SQS is appropriate when a message must be processed by exactly one consumer (work queue pattern), when you need simple decoupling between a producer and a single consumer type, and when you do not need multi-consumer fan-out or replay. For fan-out to multiple consumers, SNS feeding multiple SQS queues achieves parallel processing without Kinesis; for ordered, multi-consumer streaming with replay capability and high-throughput ingestion, Kinesis Data Streams is the correct choice. Kinesis also retains data after consumption; SQS deletes messages once consumed.`,
      quiz: [
        {
          question:
            "A company receives clickstream events that must be processed by three independent consumer applications simultaneously, each maintaining its own processing position. Which service is most appropriate?",
          options: [
            "Amazon SNS with a single subscription",
            "Amazon SQS FIFO queue",
            "Amazon SQS Standard queue",
            "Amazon Kinesis Data Streams",
          ],
          correctIndex: 3,
          explanation:
            "Kinesis Data Streams supports multiple independent consumers, each maintaining their own checkpoint (sequence number position) in the stream. All consumers see the same data, enabling replay and independent processing. SQS deletes messages after consumption, making it impossible for multiple consumers to independently process the same messages.",
        },
        {
          question:
            "Which is a key advantage of Kinesis Data Streams over Amazon SQS for streaming workloads?",
          options: [
            "Kinesis supports more message types than SQS",
            "Kinesis has lower latency than SQS for all operations",
            "Kinesis retains data for replay; SQS deletes messages after consumption",
            "Kinesis is cheaper than SQS for all use cases",
          ],
          correctIndex: 2,
          explanation:
            "Kinesis Data Streams retains records for up to 365 days, allowing multiple consumers to replay data from any point in the retention window. SQS destructively removes messages after a consumer successfully processes them, making replay impossible. This retention and replay capability is a fundamental advantage of Kinesis for multi-consumer streaming.",
        },
      ],
    },
    {
      heading: "Architecture Patterns with Kinesis",
      body: `The canonical Kinesis architecture for a clickstream analytics pipeline ingests events from millions of web clients via the Kinesis Producer Library (KPL) or the Kinesis Agent, stores them in a Kinesis Data Stream with shards scaled to match peak ingest rate, processes them in real time using Kinesis Data Analytics for aggregations (page views per minute, session durations), delivers raw events to S3 via Kinesis Data Firehose for long-term storage and batch analytics with Athena or EMR, and streams processed results to DynamoDB for a real-time dashboard. For IoT workloads, AWS IoT Core routes device messages to Kinesis Data Streams using IoT Rules, enabling real-time anomaly detection on sensor telemetry. Lambda can consume from Kinesis Data Streams using event source mapping — Lambda polls each shard, processes batches of records, and checkpoints after successful processing, with configurable batch size and parallelization factor per shard.`,
      quiz: [
        {
          question:
            "A Lambda function is configured as a consumer of a Kinesis Data Stream. The function processes a batch of 100 records and 3 records fail. What happens by default?",
          options: [
            "Only the 3 failed records are retried",
            "The stream shard is paused until the failures are resolved",
            "The entire batch of 100 records is retried because Lambda checkpoints at the batch level",
            "Failed records are moved to a DLQ automatically",
          ],
          correctIndex: 2,
          explanation:
            "By default, when a Lambda function fails to process any record in a Kinesis batch, the entire batch is retried. To avoid reprocessing the 97 successfully handled records, you should enable 'Report Batch Item Failures', which allows Lambda to return only the IDs of the failed records, so only those are retried.",
        },
        {
          question:
            "A hot shard issue is observed in a Kinesis Data Stream where most records are routing to a single shard. What is the most likely cause?",
          options: [
            "The stream has too many consumers",
            "Enhanced Fan-Out is not enabled",
            "The partition key has low cardinality, causing most records to hash to the same shard",
            "The data retention period is too long",
          ],
          correctIndex: 2,
          explanation:
            "A hot shard occurs when records disproportionately route to a single shard. This is caused by a low-cardinality partition key where most values hash to the same shard. Choosing a high-cardinality partition key (such as a user ID or request ID) distributes records evenly across all shards.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "How many MB/s of write capacity does a single Kinesis Data Stream shard provide?",
      options: ["5 MB/s", "0.5 MB/s", "1 MB/s", "2 MB/s"],
      correctIndex: 2,
      explanation:
        "Each Kinesis Data Stream shard provides 1 MB/s or 1,000 records/s of write (ingest) capacity. The read capacity is 2 MB/s per shard. These limits determine how many shards are required for a given throughput requirement.",
    },
    {
      question:
        "Which Kinesis service requires no consumer code and delivers streaming data directly to S3, Redshift, or OpenSearch?",
      options: [
        "Amazon Managed Service for Apache Flink",
        "Kinesis Video Streams",
        "Kinesis Data Streams",
        "Kinesis Data Firehose",
      ],
      correctIndex: 3,
      explanation:
        "Kinesis Data Firehose is a fully managed delivery service that requires no consumer code. It buffers, compresses, and delivers streaming data to destinations including S3, Redshift, OpenSearch, and Splunk, with optional Lambda-based transformation before delivery.",
    },
    {
      question:
        "A Kinesis Data Stream consumer needs dedicated 2 MB/s throughput per shard regardless of how many other consumers are reading the same stream. Which feature provides this?",
      options: [
        "On-Demand mode with automatic scaling",
        "Provisioned mode with reserved throughput",
        "Shard splitting to add more read capacity",
        "Enhanced Fan-Out with HTTP/2 push delivery",
      ],
      correctIndex: 3,
      explanation:
        "Enhanced Fan-Out registers consumers for a dedicated 2 MB/s throughput per shard, delivered via HTTP/2 push rather than polling. This dedicated throughput is independent of how many other consumers are reading the stream, eliminating read throughput contention.",
    },
    {
      question:
        "What is the minimum delivery latency for Kinesis Data Firehose?",
      options: ["1 second", "5 seconds", "60 seconds", "5 minutes"],
      correctIndex: 2,
      explanation:
        "Kinesis Data Firehose has a minimum buffer time of 60 seconds before delivering records to the destination. Data is delivered either when the buffer is full or after 60 seconds, whichever comes first. For sub-minute real-time processing, Kinesis Data Streams with a custom consumer is required.",
    },
    {
      question:
        "A streaming application needs to detect complex patterns across multiple input streams with custom stateful logic. Which Kinesis Analytics option is appropriate?",
      options: [
        "Kinesis Data Streams with polling consumers",
        "Amazon Managed Service for Apache Flink",
        "Kinesis Data Firehose with Lambda transformation",
        "Kinesis Data Analytics SQL interface",
      ],
      correctIndex: 1,
      explanation:
        "Amazon Managed Service for Apache Flink (formerly Kinesis Data Analytics for Flink) supports complex stateful stream processing with multiple input streams, event-time windowing, pattern detection, and custom application logic. The SQL interface is limited to simpler aggregations and does not support the full expressiveness of Flink.",
    },
    {
      question:
        "Why is a high-cardinality value recommended as a Kinesis partition key?",
      options: [
        "High-cardinality keys distribute records evenly across shards, preventing hot shards",
        "High-cardinality keys enable Enhanced Fan-Out automatically",
        "High-cardinality keys reduce the data retention period",
        "High-cardinality keys reduce the per-record cost in Kinesis",
      ],
      correctIndex: 0,
      explanation:
        "The partition key is hashed to determine which shard receives each record. A low-cardinality partition key (such as a boolean or a value with few distinct values) causes most records to hash to the same shard, creating a hot shard. A high-cardinality key (such as a user ID or UUID) distributes records evenly across all shards.",
    },
    {
      question:
        "What happens by default when a Lambda function fails to process a Kinesis Data Stream batch?",
      options: [
        "The entire batch is retried from the beginning",
        "Failed records are automatically sent to a DLQ",
        "The shard iterator is advanced past the failed batch",
        "Only the failed records are retried",
      ],
      correctIndex: 0,
      explanation:
        "By default, Lambda retries the entire batch when any record fails. To retry only failed records and avoid reprocessing successes, you must enable 'Report Batch Item Failures' on the Lambda event source mapping, which allows Lambda to return specific failed message IDs for targeted retry.",
    },
    {
      question:
        "Which Kinesis Data Streams capacity mode is best suited for workloads with unpredictable traffic patterns?",
      options: [
        "Provisioned mode with manual resharding",
        "Enhanced Fan-Out mode",
        "On-Demand mode with automatic scaling",
        "Extended retention mode",
      ],
      correctIndex: 2,
      explanation:
        "On-Demand mode automatically scales shard capacity based on observed throughput peaks without requiring manual shard management. It scales up instantly when traffic increases and scales down after 24 hours of reduced traffic, making it ideal for unpredictable or variable workloads. Provisioned mode is more cost-effective for stable, predictable throughput.",
    },
  ],
};
