import { ServiceGuide } from "../../../types/guide";

export const s3MlGuide: ServiceGuide = {
  id: "mls-s3-ml",
  service: "Amazon S3 for ML",
  domain: "services",
  tagline:
    "Scalable object storage serving as the data lake foundation for all ML workloads",
  intro:
    "Amazon S3 is the foundational storage layer for ML on AWS, providing durable, scalable object storage for raw datasets, processed features, model artifacts, training checkpoints, and inference results. Every major AWS ML service reads from and writes to S3.",

  sections: [
    {
      heading: "S3 as the ML Data Lake",
      body: `In an ML architecture, S3 functions as the centralized data lake where raw data lands first and processed data is staged before training. The typical flow is: raw data ingested into a landing prefix, processed by AWS Glue or SageMaker Processing into a curated prefix, then consumed by SageMaker Training Jobs via S3 URIs. S3's flat namespace with prefix-based pseudo-directories makes it easy to partition datasets by date, category, or split (train/validation/test).

S3's durability (11 nines) and virtually unlimited storage capacity make it the right choice for housing datasets that grow over years. Versioning enables audit trails of dataset changes, which is critical for model reproducibility — you need to know exactly which version of the training data produced a given model artifact. Lifecycle policies can automatically transition old raw data to S3 Glacier for cost reduction while keeping processed features in S3 Standard for fast access.`,
      quiz: [
        {
          question:
            "Why is Amazon S3 versioning particularly important in ML workflows?",
          options: [
            "It compresses datasets automatically to reduce storage costs",
            "It enables audit trails of dataset changes, supporting model reproducibility by linking training jobs to exact dataset versions",
            "It replicates datasets across multiple AWS regions for faster training",
            "It encrypts all training data at rest using AWS-managed keys",
          ],
          correctIndex: 1,
          explanation:
            "Model reproducibility requires knowing which exact data version produced a given model. S3 versioning maintains a history of object changes, allowing teams to link a trained model artifact back to the precise dataset version used, which is essential for auditability and debugging.",
        },
      ],
    },
    {
      heading: "Data Partitioning and Access Patterns for Training",
      body: `How you partition data in S3 significantly impacts training throughput. SageMaker Training Jobs support two input modes: File mode (S3 objects copied to instance storage before training begins) and Pipe mode (S3 data streamed directly to the training container via a named pipe). Pipe mode is preferred for large datasets because it eliminates the copy step and allows training to begin immediately, but requires training code to read from a pipe rather than a file system.

For distributed training across multiple instances, S3 ShardedByS3Key input mode distributes shards of data across training instances so each instance processes a unique subset. This is critical for data-parallel distributed training. Optimal S3 performance requires avoiding sequential key patterns — using random prefixes or hash-based naming prevents hot-shard bottlenecks in S3's internal partitioning.`,
      quiz: [
        {
          question:
            "Which SageMaker Training Job input mode allows training to begin immediately without waiting for S3 data to be copied to instance storage?",
          options: [
            "File mode — data is pre-fetched in the background while training starts",
            "Pipe mode — data is streamed from S3 directly to the training container via a named pipe",
            "Direct mode — data is accessed over the network during training",
            "Prefetch mode — data is cached in ElastiCache before the training job starts",
          ],
          correctIndex: 1,
          explanation:
            "Pipe mode streams S3 data directly to the training container through a FIFO named pipe, eliminating the initial copy step. Training begins immediately, making it the preferred option for large datasets. File mode copies all data to instance storage first, adding startup latency.",
        },
      ],
    },
    {
      heading: "S3 Storage Classes and Cost Optimization for ML",
      body: `ML workloads generate large volumes of intermediate artifacts — training checkpoints, experiment outputs, and evaluation results — that are accessed frequently during active development but rarely afterward. S3 Intelligent-Tiering automatically moves objects between frequent and infrequent access tiers based on access patterns, making it well-suited for ML artifact storage where access patterns are unpredictable. S3 Standard-IA is appropriate for training datasets accessed monthly for periodic model refreshes.

Large raw datasets that are archived after training are candidates for S3 Glacier Instant Retrieval (millisecond access, infrequent) or S3 Glacier Deep Archive for lowest-cost long-term storage with hours of retrieval time. Lifecycle rules can automate transitions: raw data to Standard-IA after 30 days, to Glacier after 90 days. Model artifacts in production should stay in S3 Standard for fast loading by inference endpoints.`,
      quiz: [
        {
          question:
            "A company stores ML training datasets that are accessed unpredictably — some are used weekly, others monthly. Which S3 storage class minimizes cost without requiring lifecycle rule management?",
          options: [
            "S3 Standard — provides fastest access regardless of frequency",
            "S3 Glacier — lowest cost with acceptable retrieval times",
            "S3 Intelligent-Tiering — automatically moves objects between tiers based on access patterns",
            "S3 Standard-IA — always lower cost than Standard for infrequent access",
          ],
          correctIndex: 2,
          explanation:
            "S3 Intelligent-Tiering monitors access patterns and automatically moves objects to lower-cost tiers when they are not accessed, and back to frequent-access tier when accessed again. This removes the need to manually configure lifecycle rules for unpredictable access patterns.",
        },
      ],
    },
    {
      heading: "S3 Security for ML Data",
      body: `ML training datasets often contain sensitive or regulated data, making S3 security configuration critical. Server-side encryption options include SSE-S3 (AWS-managed keys), SSE-KMS (customer-managed KMS keys with audit trail via CloudTrail), and SSE-C (customer-provided keys). SSE-KMS is preferred for regulated data because KMS provides key rotation, usage audit logs, and fine-grained access control via KMS key policies.

Bucket policies and IAM policies control which principals can read training data or write model artifacts. S3 Block Public Access should be enabled at the account level for all ML data buckets. VPC Endpoints for S3 (Gateway type) allow SageMaker Training Jobs running in a VPC to access S3 without traversing the public internet, which is required for compliance in many financial and healthcare workloads. S3 Object Lock provides WORM (write-once-read-many) protection for regulatory compliance.`,
      quiz: [
        {
          question:
            "A healthcare company needs S3 encryption for ML training data with full audit trails of key usage. Which encryption option should they choose?",
          options: [
            "SSE-S3 — AWS manages the keys with automatic rotation",
            "SSE-KMS — customer-managed KMS keys with CloudTrail audit logging of key usage",
            "SSE-C — customer-provided keys for maximum control",
            "Client-side encryption — data is encrypted before uploading to S3",
          ],
          correctIndex: 1,
          explanation:
            "SSE-KMS uses AWS KMS with customer-managed keys, and all KMS API calls (including decryption during training) are logged in CloudTrail. This audit trail is required for regulated industries like healthcare. SSE-S3 does not provide the same audit granularity.",
        },
      ],
    },
    {
      heading: "S3 Select and Athena for ML Data Sampling",
      body: `During data exploration and feature engineering, data scientists often need to sample or filter large datasets without downloading everything. S3 Select enables SQL-like filtering directly on S3 objects (CSV, JSON, Parquet, ORC), returning only the matching rows to the client. This can reduce data transfer by up to 400x for selective queries. It is useful for quickly sampling a subset of a large dataset for exploratory analysis before committing to full training runs.

For more complex queries involving joins and aggregations across many S3 objects, Amazon Athena is the appropriate tool. Athena uses Presto to run standard SQL against S3 data using schema-on-read, with no ETL required. Partitioning S3 data by date or category in Athena reduces the data scanned per query, directly reducing query cost and latency during EDA (Exploratory Data Analysis).`,
      quiz: [
        {
          question:
            "A data scientist wants to extract only rows where a 'label' column equals 1 from a 500 GB CSV file in S3 without downloading the entire file. Which approach is most efficient?",
          options: [
            "Download the file to an EC2 instance and filter with grep",
            "Use S3 Select to apply a SQL-like filter directly on the S3 object, returning only matching rows",
            "Load the file into RDS and run a SQL query",
            "Use AWS Glue to run a PySpark filter job on the CSV",
          ],
          correctIndex: 1,
          explanation:
            "S3 Select allows SQL-like predicates to be pushed down to the S3 layer, filtering data before it leaves S3. Only matching rows are returned, reducing data transfer by up to 400x compared to downloading and filtering client-side.",
        },
      ],
    },
  ],

  keyFacts: [
    "S3 is the data lake foundation for all AWS ML services — every ML service reads/writes S3",
    "File mode copies data to instance storage; Pipe mode streams data directly — Pipe mode is faster for large datasets",
    "S3 Intelligent-Tiering automatically optimizes costs for unpredictable ML artifact access patterns",
    "SSE-KMS provides encryption with CloudTrail audit trails — required for regulated ML workloads",
    "VPC Gateway Endpoints allow SageMaker to access S3 without traversing the public internet",
    "S3 versioning enables dataset version tracking for model reproducibility",
    "S3 Select filters data at the S3 layer — up to 400x less data transferred than full object downloads",
    "ShardedByS3Key input mode distributes data shards across distributed training instances",
    "Lifecycle rules automate cost optimization: Standard → Standard-IA → Glacier transitions",
    "S3 Block Public Access should always be enabled for ML data buckets",
  ],

  relatedServices: [
    "Amazon SageMaker",
    "AWS Glue",
    "Amazon Athena",
    "AWS Lake Formation",
    "Amazon Kinesis Data Firehose",
    "AWS KMS",
  ],

  examTips: [
    "Pipe mode vs File mode: Pipe streams directly to container, no copy — better for large datasets",
    "SageMaker Training Jobs access S3 via S3 URIs — understand input modes for throughput optimization",
    "SSE-KMS = encryption + audit trail; SSE-S3 = encryption without key-level audit",
    "VPC Endpoint for S3 keeps training data off the public internet — required for many compliance scenarios",
    "ShardedByS3Key is how distributed training instances each get a unique data shard",
    "S3 Select pushes filtering to S3 — efficient for EDA sampling from large datasets",
    "Versioning + lifecycle policies together enable both reproducibility and cost optimization",
    "Model artifacts (model.tar.gz) are stored in S3 by SageMaker after every training job",
  ],

  topicQuiz: [
    {
      question:
        "A SageMaker distributed training job uses 10 instances. How should training data be configured in S3 so each instance processes a unique subset of the data?",
      options: [
        "Use File mode — SageMaker automatically shards data across instances",
        "Use Pipe mode with ShardedByS3Key — S3 distributes unique key shards to each instance",
        "Manually split the dataset into 10 S3 prefixes before training",
        "Use S3 Select on each instance to filter its assigned partition",
      ],
      correctIndex: 1,
      explanation:
        "ShardedByS3Key distributes S3 objects across training instances so each instance receives a unique subset. Combined with Pipe mode, this is the optimal configuration for large-scale distributed training, avoiding data duplication across instances.",
    },
    {
      question:
        "Which S3 encryption method provides both encryption at rest AND an audit trail of every decryption event for compliance purposes?",
      options: [
        "SSE-S3 with automatic key rotation enabled",
        "SSE-KMS with customer-managed keys — KMS logs all API calls to CloudTrail",
        "SSE-C with customer-provided keys stored in AWS Secrets Manager",
        "Client-side encryption with application-managed keys",
      ],
      correctIndex: 1,
      explanation:
        "SSE-KMS uses AWS KMS for key management, and every KMS Decrypt call during training or inference is logged in CloudTrail with the caller's identity. This audit trail is the distinguishing feature required for compliance. SSE-S3 encrypts data but does not provide per-request key usage logs.",
    },
  ],
};
