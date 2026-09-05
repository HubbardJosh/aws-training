import { FlashCard } from "../../types";

export const flashcards: FlashCard[] = [
  // ── Amazon SageMaker ──────────────────────────────────────────────────────

  {
    id: "mls-sagemaker-1",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "easy",
    question:
      "What are the four drift types that SageMaker Model Monitor detects?",
    answer:
      "Data quality drift (feature statistics changed), model quality drift (accuracy degraded), bias drift (fairness metrics changed), and feature attribution drift (SHAP values shifted).",
    keyPoints: [
      "Model Monitor requires a baseline captured from the training dataset",
      "Metrics are published to CloudWatch for alarming",
      "Each drift type has its own monitor type in SageMaker",
      "Bias and attribution drift require SageMaker Clarify",
    ],
    tags: ["sagemaker", "model-monitor", "drift", "mlops"],
  },
  {
    id: "mls-sagemaker-2",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the difference between SageMaker Batch Transform and a Real-Time Endpoint?",
    answer:
      "Batch Transform runs asynchronous bulk inference over S3 datasets — no persistent endpoint, ideal for nightly scoring. Real-Time Endpoints are persistent HTTPS endpoints with auto-scaling for synchronous low-latency inference.",
    keyPoints: [
      "Batch Transform reads from S3 and writes results back to S3",
      "Batch Transform has no endpoint to maintain — cost-efficient for scheduled jobs",
      "Real-Time Endpoint supports Blue/Green deployments",
      "Serverless Inference scales to zero for bursty low-traffic patterns",
    ],
    tags: ["sagemaker", "inference", "batch-transform", "endpoint"],
  },
  {
    id: "mls-sagemaker-3",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "hard",
    question: "How does SageMaker Feature Store prevent training-serving skew?",
    answer:
      "Feature Store maintains a single versioned feature definition with an offline store (S3/Parquet for training) and an online store (DynamoDB-backed for millisecond-latency real-time inference). Both stores use identical feature logic, eliminating skew.",
    keyPoints: [
      "Online store: DynamoDB-backed, millisecond reads for inference",
      "Offline store: S3 Parquet, used for batch training and analytics",
      "Feature groups are versioned for reproducibility",
      "Eliminates the need to reimplement feature logic for serving",
    ],
    tags: ["sagemaker", "feature-store", "training-serving-skew"],
  },
  {
    id: "mls-sagemaker-4",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    question:
      "What is SageMaker Automatic Model Tuning and which optimization strategy does it use by default?",
    answer:
      "Automatic Model Tuning (AMT) automates hyperparameter optimization by running training jobs and exploring the hyperparameter search space. Default strategy is Bayesian optimization — uses prior results to predict most promising configurations, outperforming grid and random search.",
    keyPoints: [
      "Configure objective metric, its regex, and hyperparameter ranges",
      "Keep concurrent jobs low so Bayesian optimizer learns from prior results",
      "Warm starting reuses exploration from a previous tuning job",
      "Supports continuous, integer, and categorical hyperparameter types",
    ],
    tags: ["sagemaker", "hyperparameter-tuning", "bayesian-optimization"],
  },
  {
    id: "mls-sagemaker-5",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "easy",
    question:
      "What does SageMaker Spot Training do and what is required to use it safely?",
    answer:
      "Spot Training uses EC2 Spot Instances to reduce training costs by up to 90%. Checkpointing must be enabled so interrupted jobs resume from the last checkpoint rather than restarting from scratch.",
    keyPoints: [
      "Up to 90% cost reduction vs On-Demand pricing",
      "Checkpointing saves model state to S3 periodically",
      "Spot interruptions are handled by SageMaker automatically",
      "Not suitable for jobs that cannot tolerate interruption without checkpointing",
    ],
    tags: ["sagemaker", "spot-training", "cost-optimization", "checkpointing"],
  },
  {
    id: "mls-sagemaker-6",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the Model Registry in SageMaker and how does it support MLOps?",
    answer:
      "The Model Registry is a versioned catalog of trained models with approval workflows. Models move from Pending to Approved status before automated deployment systems promote them to production, providing governance and audit trails.",
    keyPoints: [
      "Supports versioning of model artifacts and metadata",
      "Approval workflow: Pending → Approved → Rejected",
      "Integrates with SageMaker Pipelines for CI/CD of models",
      "Can trigger deployment pipelines automatically when a model is approved",
    ],
    tags: ["sagemaker", "model-registry", "mlops", "governance"],
  },
  {
    id: "mls-sagemaker-7",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "hard",
    question:
      "When would you use model parallelism vs. data parallelism in SageMaker distributed training?",
    answer:
      "Use model parallelism when the model is too large to fit in a single GPU's memory — the model is split across GPUs. Use data parallelism when the dataset is large and you want faster training — the dataset is sharded across GPUs, each running a full model copy, with gradients averaged.",
    keyPoints: [
      "Data parallelism: each GPU has a full model copy, different data shard",
      "Model parallelism: model layers are split across GPUs",
      "Strategies can be combined for very large models on large datasets",
      "SageMaker Data Parallel and Model Parallel libraries support PyTorch and TensorFlow",
    ],
    tags: [
      "sagemaker",
      "distributed-training",
      "model-parallelism",
      "data-parallelism",
    ],
  },

  // ── Amazon S3 for ML ──────────────────────────────────────────────────────

  {
    id: "mls-s3ml-1",
    service: "Amazon S3",
    domain: "services",
    difficulty: "easy",
    question:
      "Why is Amazon S3 the primary storage layer for ML training data on AWS?",
    answer:
      "S3 provides virtually unlimited scalable storage, integrates natively with SageMaker Training Jobs, Glue ETL, and Athena, supports Parquet/ORC columnar formats for efficient ML reads, and is durable at 11 nines.",
    keyPoints: [
      "SageMaker Training Jobs stream data from S3 via File or Pipe mode",
      "Parquet/ORC are columnar formats — faster than CSV for ML training",
      "S3 versioning enables dataset reproducibility",
      "S3 lifecycle policies move old training data to cheaper storage tiers",
    ],
    tags: ["s3", "ml-data", "storage"],
  },
  {
    id: "mls-s3ml-2",
    service: "Amazon S3",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the difference between SageMaker File Mode and Pipe Mode for reading S3 training data?",
    answer:
      "File Mode downloads all training data to the instance storage before training starts (simpler, adds startup time). Pipe Mode streams data directly from S3 during training, reducing startup time and enabling training on datasets larger than local disk.",
    keyPoints: [
      "File Mode: entire dataset downloaded before training begins",
      "Pipe Mode: data streamed on demand, no local disk requirement",
      "Pipe Mode requires framework support (TensorFlow, PyTorch natively support it)",
      "FastFile Mode (S3 Mountpoint) is the modern alternative to Pipe Mode",
    ],
    tags: ["s3", "sagemaker", "file-mode", "pipe-mode"],
  },
  {
    id: "mls-s3ml-3",
    service: "Amazon S3",
    domain: "services",
    difficulty: "medium",
    question:
      "How does S3 partitioning strategy affect ML pipeline performance?",
    answer:
      "Partitioning by date, category, or region creates S3 prefixes that Athena and Glue can prune — only reading relevant partitions instead of scanning all objects. Proper partitioning reduces query time and cost by orders of magnitude for large datasets.",
    keyPoints: [
      "Hive-style partitions: s3://bucket/data/year=2024/month=01/",
      "Athena uses partition pruning to skip irrelevant data",
      "Glue Crawlers detect partition structure automatically",
      "Too many small files degrade performance — consider compaction",
    ],
    tags: ["s3", "partitioning", "athena", "glue", "performance"],
  },
  {
    id: "mls-s3ml-4",
    service: "Amazon S3",
    domain: "services",
    difficulty: "easy",
    question:
      "What S3 storage class is most cost-effective for ML training datasets accessed infrequently?",
    answer:
      "S3 Intelligent-Tiering automatically moves objects between frequent and infrequent access tiers based on access patterns. For datasets with unpredictable access, it is most cost-effective. For known infrequent access, S3-IA or S3 Glacier Instant Retrieval are cheaper.",
    keyPoints: [
      "S3 Standard: frequent access, lowest latency",
      "S3-IA: infrequent access, retrieval fee applies",
      "Intelligent-Tiering: automatic tier movement, no retrieval fees",
      "Glacier: archive — not suitable for active training data",
    ],
    tags: ["s3", "storage-class", "cost-optimization"],
  },
  {
    id: "mls-s3ml-5",
    service: "Amazon S3",
    domain: "services",
    difficulty: "hard",
    question:
      "How does S3 encryption work for protecting ML training data at rest?",
    answer:
      "S3 supports SSE-S3 (AWS manages keys), SSE-KMS (customer manages KMS keys, with audit trail via CloudTrail), and SSE-C (customer provides their own keys). For ML data with compliance requirements, SSE-KMS is preferred because it provides key rotation and CloudTrail audit logging.",
    keyPoints: [
      "SSE-S3: simplest, AWS manages keys automatically",
      "SSE-KMS: customer-managed keys, CloudTrail auditing, key rotation",
      "SSE-C: customer provides key on each request, AWS never stores it",
      "SageMaker Training Jobs can specify KMS keys for S3 output encryption",
    ],
    tags: ["s3", "encryption", "kms", "security"],
  },
  {
    id: "mls-s3ml-6",
    service: "Amazon S3",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the small files problem in S3 for ML and how is it mitigated?",
    answer:
      "Having millions of small files (under 1MB each) degrades S3 LIST performance, increases Glue ETL overhead, and slows SageMaker Training Job startup. Mitigation: compact small files into larger Parquet files using Glue ETL or Spark, targeting 128MB–1GB per file.",
    keyPoints: [
      "Small files increase S3 API request costs (per-request billing)",
      "Spark reads one executor task per file — too many small files underutilizes parallelism",
      "Compaction jobs merge small files into larger optimally-sized files",
      "Target 128MB–1GB per file for optimal Spark/Glue performance",
    ],
    tags: ["s3", "small-files", "performance", "glue"],
  },

  // ── AWS Glue ──────────────────────────────────────────────────────────────

  {
    id: "mls-glue-1",
    service: "AWS Glue",
    domain: "services",
    difficulty: "easy",
    question: "What is the AWS Glue Data Catalog and what services use it?",
    answer:
      "The Glue Data Catalog is a centralized metadata repository storing table definitions, schemas, and partition info for datasets in S3 and other sources. It is used by Athena, EMR, Redshift Spectrum, and SageMaker Processing — all sharing a single schema definition.",
    keyPoints: [
      "Compatible with Apache Hive Metastore",
      "Glue Crawlers populate the catalog automatically",
      "Athena queries reference Glue catalog tables",
      "Lake Formation uses Glue catalog for fine-grained access control",
    ],
    tags: ["glue", "data-catalog", "metadata"],
  },
  {
    id: "mls-glue-2",
    service: "AWS Glue",
    domain: "services",
    difficulty: "medium",
    question:
      "What is a Glue DynamicFrame and why is it preferred over Spark DataFrames for ML data prep?",
    answer:
      "A Glue DynamicFrame tolerates schema inconsistencies, nested structures, and type mismatches that cause Spark DataFrames to fail. It allows processing real-world messy data without failing the entire ETL job.",
    keyPoints: [
      "DynamicFrame tracks a 'choice' type for fields with inconsistent types",
      "Can be converted to a Spark DataFrame after schema resolution",
      "resolveChoice() reconciles mixed types into a single consistent type",
      "Ideal for raw log data, JSON events, or semi-structured IoT data",
    ],
    tags: ["glue", "dynamicframe", "etl", "schema"],
  },
  {
    id: "mls-glue-3",
    service: "AWS Glue",
    domain: "services",
    difficulty: "medium",
    question:
      "How does Glue Streaming ETL differ from Glue batch ETL and when is it used in ML?",
    answer:
      "Glue Streaming ETL uses Spark Structured Streaming to continuously process data from Kinesis Data Streams or Kafka in near real-time, keeping a job running persistently. Used in ML when features must be derived from recent streaming events, such as real-time fraud detection.",
    keyPoints: [
      "Batch ETL: runs once per invocation, terminates when done",
      "Streaming ETL: continuously running Spark Structured Streaming job",
      "Can write computed features directly to SageMaker Feature Store online store",
      "Kinesis → Glue Streaming → Feature Store is the canonical real-time feature pipeline",
    ],
    tags: ["glue", "streaming", "kinesis", "feature-engineering"],
  },
  {
    id: "mls-glue-4",
    service: "AWS Glue",
    domain: "services",
    difficulty: "easy",
    question: "What is AWS Glue DataBrew and how does it differ from Glue ETL?",
    answer:
      "Glue DataBrew is a visual, no-code data preparation tool with 250+ built-in transforms targeting analysts. Glue ETL is code-driven PySpark/Scala for data engineers building complex transformation pipelines.",
    keyPoints: [
      "DataBrew: visual UI, no coding, 250+ transforms, data profiling",
      "Glue ETL: PySpark or Scala, full programmatic control",
      "DataBrew recipes are versioned and reusable",
      "Both output to S3 for downstream ML training",
    ],
    tags: ["glue", "databrew", "etl", "no-code"],
  },
  {
    id: "mls-glue-5",
    service: "AWS Glue",
    domain: "services",
    difficulty: "hard",
    question: "What is a Glue Job Bookmark and when should you use it?",
    answer:
      "A Glue Job Bookmark tracks which data has been processed by a previous job run, allowing incremental ETL — processing only new or changed data on subsequent runs. Prevents reprocessing of already-processed data in pipelines with daily incremental ingestion.",
    keyPoints: [
      "Bookmarks track S3 object keys and timestamps already processed",
      "Enables incremental ETL without reprocessing historical data",
      "Must be enabled explicitly in the Glue job configuration",
      "Works with S3 sources; JDBC sources use primary key tracking",
    ],
    tags: ["glue", "job-bookmark", "incremental", "etl"],
  },
  {
    id: "mls-glue-6",
    service: "AWS Glue",
    domain: "services",
    difficulty: "medium",
    question:
      "What output formats does Glue ETL produce and why are they preferred for ML training?",
    answer:
      "Glue ETL can write Parquet and ORC (columnar, compressed binary formats) that are optimal for ML training. Columnar formats allow SageMaker Training Jobs to read only the feature columns they need, reducing I/O and speeding up data loading.",
    keyPoints: [
      "Parquet: Apache columnar format, widely supported, good compression",
      "ORC: columnar format with better performance in some Hive/EMR scenarios",
      "Both support predicate pushdown for partial column reads",
      "CSV is row-oriented — reads all columns even if only some are needed",
    ],
    tags: ["glue", "parquet", "orc", "columnar"],
  },

  // ── Amazon Kinesis ────────────────────────────────────────────────────────

  {
    id: "mls-kinesis-1",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "easy",
    question:
      "What are the four Amazon Kinesis services and their primary use cases?",
    answer:
      "Kinesis Data Streams: real-time event streaming with custom processing. Kinesis Data Firehose: fully managed delivery to S3/Redshift/ES. Kinesis Data Analytics: SQL or Flink analytics on streams. Kinesis Video Streams: video ingestion for ML/CV workloads.",
    keyPoints: [
      "Data Streams: low-latency, custom consumer code, multiple consumers",
      "Firehose: no code, automatic delivery, built-in transformation via Lambda",
      "Data Analytics: serverless SQL/Flink on streams",
      "Video Streams: frame-by-frame ML inference from video",
    ],
    tags: ["kinesis", "streaming", "real-time"],
  },
  {
    id: "mls-kinesis-2",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "medium",
    question:
      "How does Kinesis Data Streams shard capacity work and how do you scale it?",
    answer:
      "Each shard provides 1 MB/s write and 2 MB/s read capacity. A stream's total capacity is the sum of shard capacities. Scale by splitting shards (add capacity) or merging shards (reduce cost). Partition keys determine which shard each record goes to.",
    keyPoints: [
      "Shard: 1 MB/s ingest, 2 MB/s read, up to 1000 records/s",
      "Partition key → shard assignment via MD5 hash",
      "Hot shards occur when partition keys are uneven — use high-cardinality keys",
      "On-Demand mode automatically scales shards",
    ],
    tags: ["kinesis", "shards", "scaling", "partition-key"],
  },
  {
    id: "mls-kinesis-3",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "medium",
    question:
      "What is Kinesis Data Firehose and how does it differ from Kinesis Data Streams for ML pipelines?",
    answer:
      "Firehose is a fully managed delivery service that buffers and delivers streaming data to S3, Redshift, OpenSearch, or Splunk — no consumer code required. Data Streams requires custom consumers but offers lower latency and multiple consumer support.",
    keyPoints: [
      "Firehose: managed, 60-second minimum buffer, automatic delivery",
      "Firehose supports Lambda-based record transformation before delivery",
      "Data Streams: millisecond latency, multiple independent consumers",
      "For ML: Firehose to S3 is the common pattern for batch training data collection",
    ],
    tags: ["kinesis", "firehose", "s3", "streaming"],
  },
  {
    id: "mls-kinesis-4",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "hard",
    question:
      "How does Kinesis Data Analytics (Flink) enable real-time ML feature computation?",
    answer:
      "Kinesis Data Analytics runs serverless Apache Flink applications that can compute windowed aggregations, joins, and transformations on streaming data. Real-time features like 5-minute transaction count per user can be computed and pushed to SageMaker Feature Store's online store.",
    keyPoints: [
      "Flink: stateful stream processing with exactly-once semantics",
      "Tumbling windows: fixed non-overlapping time windows",
      "Sliding windows: overlapping windows for moving averages",
      "Output to Kinesis Streams, Firehose, or Lambda for downstream processing",
    ],
    tags: ["kinesis", "flink", "real-time", "feature-engineering"],
  },
  {
    id: "mls-kinesis-5",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the data retention period for Kinesis Data Streams and why does it matter for ML?",
    answer:
      "Default retention is 24 hours, extendable to 365 days (enhanced retention). Longer retention allows ML training pipelines to replay historical stream data for model retraining, debugging, or feature backfilling without re-ingesting from the original source.",
    keyPoints: [
      "Default: 24 hours; max: 365 days with enhanced retention",
      "Extended retention incurs additional cost per GB-hour",
      "Iterators allow reading from any position in the retention window",
      "Replay capability is a key advantage over pure queue-based systems",
    ],
    tags: ["kinesis", "retention", "replay", "training"],
  },
  {
    id: "mls-kinesis-6",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "easy",
    question:
      "What is the role of Amazon Kinesis Video Streams in ML computer vision pipelines?",
    answer:
      "Kinesis Video Streams ingests video from cameras, drones, and IoT devices and makes it available for real-time or batch ML inference. Integrates with Amazon Rekognition Video for managed CV analysis or can stream frames to custom SageMaker endpoints.",
    keyPoints: [
      "Supports HLS and DASH for playback",
      "Fragments are indexed by producer and server timestamps",
      "Rekognition Video can analyze stored or streaming video",
      "Can extract frames as images for SageMaker custom model inference",
    ],
    tags: ["kinesis", "video", "computer-vision", "rekognition"],
  },

  // ── Amazon EMR ────────────────────────────────────────────────────────────

  {
    id: "mls-emr-1",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "easy",
    question:
      "What is Amazon EMR and what frameworks does it support for ML data processing?",
    answer:
      "Amazon EMR is a managed big data platform running Apache Spark, Hadoop, Hive, Presto, and HBase on EC2 clusters. For ML data processing, Spark is the primary framework — PySpark enables large-scale feature engineering, data transformation, and ETL at petabyte scale.",
    keyPoints: [
      "EMR handles cluster provisioning, scaling, and Spark configuration",
      "Supports Spot Instances for up to 90% cost reduction on worker nodes",
      "EMR Serverless: no cluster management, automatic scaling",
      "Persistent vs. transient clusters: transient shuts down after job completion",
    ],
    tags: ["emr", "spark", "big-data", "pyspark"],
  },
  {
    id: "mls-emr-2",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "medium",
    question: "What is the EMRFS and how does it affect ML data pipelines?",
    answer:
      "EMRFS (EMR File System) allows Spark on EMR to use S3 as the persistent storage layer instead of HDFS. This enables a decoupled architecture where compute (EMR cluster) and storage (S3) scale independently, and data persists after cluster termination.",
    keyPoints: [
      "EMRFS maps HDFS calls to S3 API calls transparently",
      "Consistent view: EMRFS tracks S3 objects to prevent stale reads after writes",
      "Storage in S3 survives cluster termination — data persists",
      "Enables transient clusters: start cluster, run job, terminate, repeat",
    ],
    tags: ["emr", "emrfs", "s3", "storage"],
  },
  {
    id: "mls-emr-3",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "medium",
    question:
      "How does EMR Serverless differ from an EMR cluster for ML workloads?",
    answer:
      "EMR Serverless eliminates cluster management — you submit jobs and AWS automatically provisions resources, scales them during execution, and releases them when done. Ideal for variable ML workloads where managing persistent clusters is impractical.",
    keyPoints: [
      "No cluster to provision, scale, or terminate",
      "Pre-initialized capacity available for warm starts",
      "Pay per vCPU-hour and GB-hour consumed by the job",
      "Not suitable when you need fine-grained cluster configuration (e.g., custom AMIs)",
    ],
    tags: ["emr", "serverless", "scaling"],
  },
  {
    id: "mls-emr-4",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "hard",
    question:
      "What is Spark MLlib and when would you use it on EMR over SageMaker?",
    answer:
      "Spark MLlib is the distributed machine learning library built into Apache Spark, supporting classification, regression, clustering, collaborative filtering, and feature engineering at scale. Use on EMR when you already have a Spark-based data pipeline and want to integrate ML without moving data to SageMaker.",
    keyPoints: [
      "MLlib algorithms are natively distributed — no code changes for scaling",
      "Supports pipelines: chain transformers and estimators",
      "Collaborative filtering with ALS for recommendation systems",
      "SageMaker is preferred for deep learning and GPU-based training",
    ],
    tags: ["emr", "spark", "mllib", "training"],
  },
  {
    id: "mls-emr-5",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the recommended EMR node configuration for ML data processing jobs?",
    answer:
      "Master node: On-Demand (stable control node). Core nodes: On-Demand or mix (store HDFS replicas). Task nodes: Spot Instances (no HDFS, safe to interrupt — just lose computation, not data). This maximizes cost savings while protecting data integrity.",
    keyPoints: [
      "Task nodes: stateless compute, safe to run on Spot",
      "Core nodes: run HDFS DataNode — avoid Spot for data safety",
      "Instance fleets mix multiple instance types to improve Spot availability",
      "Spot price set by EMR automatically based on On-Demand price",
    ],
    tags: ["emr", "spot", "cost-optimization", "nodes"],
  },
  {
    id: "mls-emr-6",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "easy",
    question:
      "How does EMR integrate with the Glue Data Catalog for ML pipelines?",
    answer:
      "EMR can be configured to use the Glue Data Catalog as its Hive Metastore, enabling Spark and Hive on EMR to query the same table definitions as Athena and Redshift Spectrum — avoiding duplicate schema management across tools.",
    keyPoints: [
      "Configure Hive metastore to use Glue catalog in EMR configuration",
      "Tables created in Glue are immediately queryable from EMR Spark/Hive",
      "Enables seamless handoff between Glue ETL, Athena, and EMR",
      "Lake Formation permissions apply to EMR queries through the catalog",
    ],
    tags: ["emr", "glue", "data-catalog", "hive"],
  },

  // ── Amazon Rekognition ────────────────────────────────────────────────────

  {
    id: "mls-rekognition-1",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "easy",
    question:
      "What computer vision capabilities does Amazon Rekognition provide?",
    answer:
      "Rekognition provides managed CV APIs for object/scene detection, facial analysis and recognition, celebrity recognition, text in image/video (OCR), content moderation, PPE detection, and custom label detection. No ML expertise required — call the API with an image.",
    keyPoints: [
      "Image and Video analysis are separate API surfaces",
      "Rekognition Custom Labels: fine-tune on your own labeled images",
      "Confidence scores returned for every detected entity",
      "Face collections store indexed face vectors for face search",
    ],
    tags: ["rekognition", "computer-vision", "image-analysis"],
  },
  {
    id: "mls-rekognition-2",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "medium",
    question:
      "How does Rekognition Custom Labels work and when would you use it?",
    answer:
      "Rekognition Custom Labels fine-tunes Amazon's pre-trained CV models on your labeled images using AutoML. Provide 10+ images per label, label them in Rekognition's interface, and train. Use when standard Rekognition APIs don't detect your domain-specific objects (e.g., specific products, defects).",
    keyPoints: [
      "AutoML selects the best model architecture for your dataset",
      "Minimum ~10 images per label to start training",
      "Deployed to a dedicated endpoint — you pay while running",
      "Evaluation metrics (F1, precision, recall) provided post-training",
    ],
    tags: ["rekognition", "custom-labels", "automl", "fine-tuning"],
  },
  {
    id: "mls-rekognition-3",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "medium",
    question:
      "What is a Rekognition Face Collection and how is it used for face search?",
    answer:
      "A Face Collection is an index of facial feature vectors stored in Rekognition. You index faces using IndexFaces, then call SearchFacesByImage to find matching faces. Used for employee identification, access control, and celebrity recognition.",
    keyPoints: [
      "IndexFaces: stores face embedding vectors, not the images themselves",
      "SearchFacesByImage: finds faces in a collection matching a query image",
      "SearchFaces: finds faces matching an indexed face ID",
      "Similarity threshold controls match confidence",
    ],
    tags: ["rekognition", "face-collection", "face-search", "biometrics"],
  },
  {
    id: "mls-rekognition-4",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "easy",
    question:
      "How does Rekognition Video analysis differ from Rekognition Image analysis?",
    answer:
      "Rekognition Video analysis is asynchronous — start a job with StartLabelDetection (or similar), and poll for completion with GetLabelDetection. Rekognition Image analysis is synchronous — pass an image and get immediate results in the same API response.",
    keyPoints: [
      "Video jobs can take minutes depending on video length",
      "Video APIs: StartLabelDetection, StartFaceDetection, StartContentModeration",
      "Results include timestamps for where events occur in the video",
      "Kinesis Video Streams integration for real-time video analysis",
    ],
    tags: ["rekognition", "video", "async", "image"],
  },
  {
    id: "mls-rekognition-5",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "medium",
    question:
      "What is content moderation in Rekognition and what ML exam scenario does it address?",
    answer:
      "Rekognition Content Moderation detects explicit, suggestive, or violent content in images and video using a managed ML model. Returns a confidence score and moderation label. Common exam scenario: automatically flag user-uploaded images before display on a platform.",
    keyPoints: [
      "Returns moderation labels with confidence scores",
      "Human review workflow via Amazon Augmented AI (A2I) for low-confidence results",
      "Minimum confidence threshold configurable to tune precision/recall",
      "Video moderation returns timestamps of flagged content",
    ],
    tags: ["rekognition", "content-moderation", "a2i"],
  },
  {
    id: "mls-rekognition-6",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "hard",
    question:
      "How does Rekognition integrate with Amazon A2I for human-in-the-loop review?",
    answer:
      "Amazon Augmented AI (A2I) routes low-confidence Rekognition predictions to human reviewers. You configure a human review workflow with a confidence threshold — predictions below that threshold go to a private workforce (employees or Mechanical Turk) for human review before action is taken.",
    keyPoints: [
      "A2I supports Rekognition, Textract, and custom ML model outputs",
      "Human review results can be used to improve model retraining datasets",
      "Private workforce: your employees; public workforce: Mechanical Turk",
      "Flow definitions configure conditions, worker UIs, and task types",
    ],
    tags: ["rekognition", "a2i", "human-review", "labeling"],
  },

  // ── Amazon Comprehend ─────────────────────────────────────────────────────

  {
    id: "mls-comprehend-1",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "easy",
    question: "What NLP capabilities does Amazon Comprehend provide natively?",
    answer:
      "Comprehend provides managed NLP APIs for: entity recognition (NER), key phrase extraction, sentiment analysis (positive/negative/neutral/mixed), language detection, syntax analysis (POS tagging), and topic modeling (LDA). No ML expertise required.",
    keyPoints: [
      "Entity types: Person, Location, Organization, Date, Quantity, etc.",
      "Sentiment: document-level and targeted sentiment per entity",
      "Topic modeling: discovers abstract topics in a document corpus",
      "Comprehend Medical: specialized NER for clinical text",
    ],
    tags: ["comprehend", "nlp", "sentiment", "ner"],
  },
  {
    id: "mls-comprehend-2",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "medium",
    question:
      "What is Comprehend Custom and when would you use it instead of the native APIs?",
    answer:
      "Comprehend Custom provides Custom Classification (train a text classifier on your categories) and Custom Entity Recognition (train NER to detect domain-specific entities not in standard Comprehend). Use when standard entities/categories don't match your business domain.",
    keyPoints: [
      "Custom Classification: multi-class and multi-label text classification",
      "Custom Entity Recognition: train on annotated examples of your entities",
      "Minimum ~1000 examples per class for Custom Classification",
      "Models deployed as real-time endpoints or used for async batch jobs",
    ],
    tags: ["comprehend", "custom-classification", "custom-ner", "fine-tuning"],
  },
  {
    id: "mls-comprehend-3",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "medium",
    question:
      "What is Comprehend Medical and how does it differ from standard Comprehend?",
    answer:
      "Comprehend Medical is a specialized version tuned for clinical and medical text. It detects medical entities: conditions, medications, dosages, anatomy, and Protected Health Information (PHI). Standard Comprehend's generic NER does not reliably detect medical-specific entities.",
    keyPoints: [
      "PHI detection for HIPAA compliance",
      "ICD-10-CM and RxNorm ontology linking",
      "Detects: medical conditions, medications, anatomy, test/treatment/procedure",
      "HIPAA-eligible service — PHI data stays in your account",
    ],
    tags: ["comprehend", "medical", "nlp", "hipaa"],
  },
  {
    id: "mls-comprehend-4",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "easy",
    question:
      "What is Comprehend topic modeling and what algorithm does it use?",
    answer:
      "Comprehend topic modeling discovers abstract topics in a collection of documents using Latent Dirichlet Allocation (LDA). You specify the number of topics and Comprehend returns topic representations (top terms per topic) and document-topic associations.",
    keyPoints: [
      "LDA: probabilistic model that assumes each document is a mixture of topics",
      "Topics are unlabeled — you interpret each cluster of terms",
      "Useful for corpus exploration and content categorization at scale",
      "Batch operation: runs asynchronously on S3 input document sets",
    ],
    tags: ["comprehend", "topic-modeling", "lda", "unsupervised"],
  },
  {
    id: "mls-comprehend-5",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "medium",
    question:
      "How does Comprehend targeted sentiment differ from document-level sentiment?",
    answer:
      "Document-level sentiment returns a single overall sentiment for an entire document. Targeted sentiment identifies specific entities within text and assigns sentiment to each entity individually — e.g., one review could be positive about the product but negative about delivery.",
    keyPoints: [
      "Targeted sentiment: per-entity sentiment (person, product, service, etc.)",
      "More granular than document-level — captures mixed reviews accurately",
      "Returns: POSITIVE, NEGATIVE, NEUTRAL, MIXED per mentioned entity",
      "Useful for aspect-based sentiment analysis in product reviews",
    ],
    tags: ["comprehend", "sentiment", "targeted-sentiment"],
  },
  {
    id: "mls-comprehend-6",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "hard",
    question:
      "How can Comprehend batch inference results be used to build ML training datasets?",
    answer:
      "Comprehend batch jobs process S3 documents and output labeled entity/sentiment annotations to S3. These annotations can serve as silver-label training data for custom models, reducing the manual labeling effort. The output integrates with SageMaker Ground Truth for human review of low-confidence labels.",
    keyPoints: [
      "Batch inference via StartEntitiesDetectionJob for large document sets",
      "Output: JSON lines with entity/sentiment predictions per document",
      "Silver labels from Comprehend + human review = efficient dataset creation",
      "Reduces cold start problem for Custom NER training",
    ],
    tags: ["comprehend", "batch", "training-data", "labeling"],
  },

  // ── Amazon Translate ──────────────────────────────────────────────────────

  {
    id: "mls-translate-1",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "easy",
    question:
      "What translation capabilities does Amazon Translate provide and what technology powers it?",
    answer:
      "Amazon Translate provides neural machine translation between 75+ languages using deep learning transformer models. Supports real-time translation via API and asynchronous batch translation of S3 documents. Can detect source language automatically.",
    keyPoints: [
      "Real-time: TranslateText API for single documents",
      "Batch: StartTextTranslationJob for bulk S3 document translation",
      "Auto language detection: specify 'auto' as source language",
      "Supports HTML and XML documents preserving structure",
    ],
    tags: ["translate", "nlp", "neural-machine-translation"],
  },
  {
    id: "mls-translate-2",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "medium",
    question:
      "What is a Custom Terminology in Amazon Translate and when is it needed?",
    answer:
      "Custom Terminology is a CSV/TMX file mapping source terms to required translations — for brand names, product names, or technical terms that must be translated exactly. Without it, Translate may use alternative translations for domain-specific vocabulary.",
    keyPoints: [
      "CSV format: source term, target translation",
      "Supports multiple target languages in one terminology file",
      "Exact match: terms in the terminology are translated verbatim",
      "Use for: brand names, medical terms, legal terminology",
    ],
    tags: ["translate", "custom-terminology", "domain-specific"],
  },
  {
    id: "mls-translate-3",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "medium",
    question:
      "What is Amazon Translate Active Custom Translation and how does it improve quality?",
    answer:
      "Active Custom Translation allows you to train Translate with parallel bilingual data (source-target document pairs). The custom model learns domain-specific translation patterns, improving quality for specialized content like medical records or legal contracts beyond generic neural MT.",
    keyPoints: [
      "Requires parallel corpus: aligned source and target language document pairs",
      "Custom models improve BLEU score for domain-specific content",
      "Models are deployed and invoked using the custom model ARN",
      "More expensive than standard translation due to custom training",
    ],
    tags: ["translate", "custom-model", "active-custom-translation"],
  },
  {
    id: "mls-translate-4",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "easy",
    question:
      "How does Amazon Translate integrate with other AWS AI services in an ML pipeline?",
    answer:
      "Translate integrates with Comprehend (translate non-English text before NLP analysis), S3 (batch translation of documents), and Lambda (real-time translation in event-driven pipelines). Common pattern: multilingual customer feedback → Translate to English → Comprehend sentiment.",
    keyPoints: [
      "Translate first, then Comprehend: all NLP on English for consistency",
      "Firehose + Lambda + Translate: real-time translation of event streams",
      "Batch: S3 input → StartTextTranslationJob → S3 output",
      "Supports 75+ source/target language pairs",
    ],
    tags: ["translate", "comprehend", "pipeline", "integration"],
  },
  {
    id: "mls-translate-5",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "medium",
    question:
      "What is a Translate Parallel Data resource and how does it improve translation quality?",
    answer:
      "Parallel Data is a collection of aligned bilingual sentence pairs used to customize Translate's output style and vocabulary for a specific domain. It acts as examples for the model to follow, improving terminology consistency without full Active Custom Translation.",
    keyPoints: [
      "Lighter-weight customization than Active Custom Translation",
      "Parallel data: sentence-level bilingual pairs in TMX or CSV format",
      "Applied at inference time to bias translations toward provided examples",
      "Useful for style alignment without a full domain-specific training corpus",
    ],
    tags: ["translate", "parallel-data", "customization"],
  },
  {
    id: "mls-translate-6",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "easy",
    question:
      "How does Amazon Translate batch translation work for large document sets?",
    answer:
      "Batch translation reads documents from an S3 input location, translates them, and writes translated documents to an S3 output location. Use StartTextTranslationJob and poll with DescribeTextTranslationJob or use EventBridge to detect completion.",
    keyPoints: [
      "Input: S3 prefix with documents (TXT, HTML, DOCX, XLSX, PPTX, XLIFF)",
      "Output: S3 prefix with translated files in the same format",
      "Supports multiple target languages in a single job",
      "Job status: SUBMITTED, IN_PROGRESS, COMPLETED, FAILED",
    ],
    tags: ["translate", "batch", "s3", "async"],
  },

  // ── Amazon Polly & Transcribe ─────────────────────────────────────────────

  {
    id: "mls-pollytranscribe-1",
    service: "Amazon Polly",
    domain: "services",
    difficulty: "easy",
    question:
      "What is Amazon Polly and what two types of voices does it support?",
    answer:
      "Amazon Polly is a text-to-speech (TTS) service using deep learning. It supports Standard voices (concatenative synthesis) and Neural voices (NTTS — higher quality, more natural) using neural TTS technology. Neural voices are preferred for production but cost more.",
    keyPoints: [
      "Neural TTS (NTTS): more natural, higher quality, more expensive",
      "Standard: concatenative, lower quality, lower cost",
      "75+ voices across 30+ languages",
      "SSML support: control pronunciation, emphasis, pauses, speaking rate",
    ],
    tags: ["polly", "tts", "neural", "speech"],
  },
  {
    id: "mls-pollytranscribe-2",
    service: "Amazon Polly",
    domain: "services",
    difficulty: "medium",
    question:
      "What is SSML in Amazon Polly and why is it important for ML applications?",
    answer:
      "Speech Synthesis Markup Language (SSML) is an XML-based markup that controls Polly's speech output — adding pauses, emphasis, changing speaking rate, controlling pronunciation of abbreviations. Enables fine-grained control over synthesized speech for applications requiring natural-sounding audio.",
    keyPoints: [
      "<break time='1s'/>: insert a pause",
      "<emphasis level='strong'>: add emphasis",
      "<say-as interpret-as='digits'>: spell out digits",
      "<prosody rate='slow'>: change speaking speed",
    ],
    tags: ["polly", "ssml", "tts", "speech-control"],
  },
  {
    id: "mls-pollytranscribe-3",
    service: "Amazon Transcribe",
    domain: "services",
    difficulty: "easy",
    question:
      "What is Amazon Transcribe and what are its key capabilities for ML?",
    answer:
      "Amazon Transcribe is a speech-to-text (STT) service using deep learning. Key capabilities: speaker diarization (who spoke when), custom vocabulary, custom language models, medical transcription, real-time and batch transcription.",
    keyPoints: [
      "Speaker diarization: labels transcript segments by speaker",
      "Custom vocabulary: add domain-specific terms for better accuracy",
      "Transcribe Medical: specialized for medical conversations",
      "Real-time: WebSocket streaming; Batch: async S3 audio → S3 transcript",
    ],
    tags: ["transcribe", "stt", "speech-recognition", "diarization"],
  },
  {
    id: "mls-pollytranscribe-4",
    service: "Amazon Transcribe",
    domain: "services",
    difficulty: "medium",
    question:
      "What is a Custom Language Model in Transcribe and when should you use it?",
    answer:
      "A Custom Language Model (CLM) trains Transcribe on domain-specific text to improve recognition of domain vocabulary (medical, legal, technical). Provide plain text documents and Transcribe fine-tunes its language model. Use when custom vocabulary alone is insufficient for complex domain terminology.",
    keyPoints: [
      "Custom vocabulary: add/boost specific words",
      "Custom Language Model: full domain adaptation with text corpus",
      "CLM requires plain text training data (e.g., domain documents, scripts)",
      "CLM improves both accuracy and contextual understanding",
    ],
    tags: ["transcribe", "custom-language-model", "domain-adaptation"],
  },
  {
    id: "mls-pollytranscribe-5",
    service: "Amazon Transcribe",
    domain: "services",
    difficulty: "medium",
    question:
      "How does call analytics in Transcribe support ML-driven customer experience analysis?",
    answer:
      "Transcribe Call Analytics transcribes and analyzes call center recordings — detecting sentiment per speaker per turn, interruptions, non-talk time, talk speed, and issue categories. Outputs structured analytics JSON that feeds downstream ML models or BI dashboards.",
    keyPoints: [
      "Two-channel audio: separate agent and customer channels for clarity",
      "Sentiment: per-speaker, per-turn sentiment scores",
      "Interruptions: detected when speakers talk over each other",
      "Contact Lens for Amazon Connect uses Transcribe Call Analytics under the hood",
    ],
    tags: ["transcribe", "call-analytics", "sentiment", "contact-center"],
  },
  {
    id: "mls-pollytranscribe-6",
    service: "Amazon Polly",
    domain: "services",
    difficulty: "hard",
    question:
      "What are Polly Lexicons and how do they differ from SSML for pronunciation control?",
    answer:
      "Polly Lexicons are XML files (PLS format) that define pronunciation rules for specific words — applied globally when the lexicon is associated with a Polly request. SSML provides inline, per-request pronunciation control. Lexicons are reusable across requests; SSML requires modification of each input text.",
    keyPoints: [
      "Lexicon: Pronunciation Lexicon Specification (PLS) XML file",
      "Lexicons uploaded to Polly and referenced by name in SynthesizeSpeech",
      "Up to 5 lexicons per SynthesizeSpeech call",
      "SSML <phoneme> tag: per-word inline IPA or x-sampa pronunciation",
    ],
    tags: ["polly", "lexicon", "pronunciation", "ssml"],
  },

  // ── Amazon Forecast ────────────────────────────────────────────────────────

  {
    id: "mls-forecast-1",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "easy",
    question: "What is Amazon Forecast and what ML techniques does it use?",
    answer:
      "Amazon Forecast is a fully managed time series forecasting service using deep learning (DeepAR, NPTS) and classical methods (ARIMA, ETS, Prophet). AutoPredictor selects and ensembles the best algorithms automatically. No ML expertise required.",
    keyPoints: [
      "AutoPredictor: trains multiple models, ensembles best ones",
      "DeepAR: LSTM-based, learns across multiple related time series",
      "Input: target time series + optional related time series + item metadata",
      "Probabilistic forecasts: returns P10, P50, P90 quantile predictions",
    ],
    tags: ["forecast", "time-series", "deepar", "automl"],
  },
  {
    id: "mls-forecast-2",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "medium",
    question:
      "What data types does Amazon Forecast accept and what is the target time series?",
    answer:
      "The target time series is the metric you want to forecast (e.g., weekly sales volume). Related time series are correlated variables that influence the target (e.g., promotions, price, weather). Item metadata provides static attributes of each series (e.g., product category, location).",
    keyPoints: [
      "Target time series: required — the metric to forecast",
      "Related time series: optional — correlated covariates",
      "Item metadata: optional — static features per item",
      "Data must be uploaded to S3 in CSV format",
    ],
    tags: ["forecast", "time-series", "related-time-series", "metadata"],
  },
  {
    id: "mls-forecast-3",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the DeepAR algorithm in Amazon Forecast and what makes it suitable for large-scale forecasting?",
    answer:
      "DeepAR is an LSTM-based algorithm that jointly trains on many related time series simultaneously, learning shared patterns across series. It excels when you have many related series (e.g., thousands of product-location combinations) with limited history per series.",
    keyPoints: [
      "Trains globally across all series — shares statistical strength",
      "Handles cold-start: can forecast new series using shared patterns",
      "Probabilistic: outputs full predictive distributions",
      "Better than ARIMA for high-dimensional, related time series datasets",
    ],
    tags: ["forecast", "deepar", "lstm", "time-series"],
  },
  {
    id: "mls-forecast-4",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "easy",
    question:
      "What is a Forecast Predictor and how does the Explainability feature work?",
    answer:
      "A Predictor is a trained forecasting model in Amazon Forecast. Forecast Explainability uses SHAP values to explain which time points and features most influenced each forecast, helping diagnose model behavior and business interpretation.",
    keyPoints: [
      "Predictor: trained model artifact, referenced when creating forecasts",
      "AutoPredictor vs legacy Predictor: AutoPredictor is newer and preferred",
      "Explainability: SHAP values at forecast-item and time-step level",
      "Backtest results: held-out evaluation on historical data",
    ],
    tags: ["forecast", "predictor", "explainability", "shap"],
  },
  {
    id: "mls-forecast-5",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "medium",
    question:
      "How does Amazon Forecast handle cold-start forecasting for new items?",
    answer:
      "DeepAR and other global models in Forecast can generate forecasts for new items with no historical data by using item metadata and learned patterns from similar items. The model generalizes from existing series to make reasonable predictions for new product launches.",
    keyPoints: [
      "Cold start = no historical target time series for the item",
      "Item metadata attributes help identify similar items",
      "DeepAR's global training enables cross-series generalization",
      "Local models (ARIMA, ETS) cannot handle cold start — they need history",
    ],
    tags: ["forecast", "cold-start", "deepar", "item-metadata"],
  },
  {
    id: "mls-forecast-6",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "hard",
    question:
      "What is the Weighted Quantile Loss (WQL) metric and why does Amazon Forecast use it?",
    answer:
      "WQL measures forecast accuracy for probabilistic forecasts — it penalizes under-forecasting and over-forecasting asymmetrically at each quantile (P10, P50, P90). Lower WQL is better. Amazon Forecast optimizes for WQL because business costs of over/under-stock are often asymmetric.",
    keyPoints: [
      "WQL = weighted average of quantile losses across all quantiles",
      "Quantile loss: asymmetric — depends on quantile being evaluated",
      "P10 underestimation is penalized less than P90 underestimation",
      "RMSE also provided for point forecast comparison",
    ],
    tags: ["forecast", "wql", "metrics", "probabilistic"],
  },

  // ── Amazon Personalize ────────────────────────────────────────────────────

  {
    id: "mls-personalize-1",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "easy",
    question:
      "What is Amazon Personalize and what recommendation use cases does it support?",
    answer:
      "Amazon Personalize is a fully managed recommendation service using deep learning. Supports user-item recommendations, similar item retrieval, personalized ranking of item lists, user segmentation, and real-time personalization — without ML expertise.",
    keyPoints: [
      "User-personalization recipe: recommendations for a given user",
      "Similar items recipe: items similar to a given item",
      "Personalized ranking: rerank a list of items for a user",
      "Real-time events update recommendations without retraining",
    ],
    tags: ["personalize", "recommendations", "collaborative-filtering"],
  },
  {
    id: "mls-personalize-2",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "medium",
    question:
      "What input data does Amazon Personalize require to train a recommendation model?",
    answer:
      "Personalize requires an Interactions dataset (user-item interaction events — clicks, purchases, ratings) as a minimum. Optional: an Items dataset (item metadata like category, genre) and a Users dataset (user demographics). Interactions must have userId, itemId, and timestamp.",
    keyPoints: [
      "Interactions dataset: required — userId, itemId, timestamp",
      "Items dataset: optional — item metadata for content-based signals",
      "Users dataset: optional — user attributes for demographic-based personalization",
      "Minimum ~1000 unique users and ~25 interactions per user recommended",
    ],
    tags: ["personalize", "interactions", "dataset", "training-data"],
  },
  {
    id: "mls-personalize-3",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "medium",
    question:
      "What is a Personalize Campaign and how does real-time personalization work?",
    answer:
      "A Campaign is a deployed recommendation endpoint. You call GetRecommendations with a userId to get personalized recommendations. For real-time personalization, putEvents records real-time user interactions that update recommendations without retraining the model.",
    keyPoints: [
      "Campaign: deployed model endpoint for real-time recommendations",
      "GetRecommendations: get recommendations for a userId",
      "PutEvents: record real-time user events (impressions, clicks)",
      "Minimum provisioned TPS: controls throughput and cost",
    ],
    tags: ["personalize", "campaign", "real-time", "put-events"],
  },
  {
    id: "mls-personalize-4",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "hard",
    question:
      "What is a Personalize Recipe and what are the three main recipe types?",
    answer:
      "A Recipe is a pre-configured ML algorithm in Personalize. Three types: USER_PERSONALIZATION (recommendations for a user), RELATED_ITEMS (items similar to a given item), and PERSONALIZED_RANKING (rerank a list of items for a user). AutoML recipes (USER_PERSONALIZATION_V2) select the best algorithm automatically.",
    keyPoints: [
      "USER_PERSONALIZATION: top-N items for a user (collaborative filtering)",
      "RELATED_ITEMS: items similar to input item (item-to-item similarity)",
      "PERSONALIZED_RANKING: filter/rerank an external list for a user",
      "Recipes encapsulate algorithm, hyperparameters, and training config",
    ],
    tags: ["personalize", "recipe", "algorithm", "collaborative-filtering"],
  },
  {
    id: "mls-personalize-5",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "medium",
    question:
      "How does Amazon Personalize handle the cold-start problem for new users or items?",
    answer:
      "For new users with no interaction history, Personalize can return popular items or use user metadata from the Users dataset. For new items, the Items dataset metadata allows content-based recommendations. Real-time putEvents quickly warms up new user profiles with minimal interaction data.",
    keyPoints: [
      "New user: popularity-based fallback or metadata-based inference",
      "New item: item metadata similarity until enough interactions accumulate",
      "PutEvents: 2-3 real-time events can begin personalizing a new user",
      "Exploration: automatically surfaces new items to gather interaction data",
    ],
    tags: ["personalize", "cold-start", "exploration", "new-user"],
  },
  {
    id: "mls-personalize-6",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "easy",
    question:
      "What is a Personalize Batch Inference Job and when is it preferred over a Campaign?",
    answer:
      "A Batch Inference Job generates recommendations for all users offline in bulk, writing results to S3. Used when real-time API latency is not needed — e.g., pre-compute personalized email content or generate nightly recommendation batches for display.",
    keyPoints: [
      "Input: S3 JSON file with userIds to generate recommendations for",
      "Output: S3 JSON file with recommendations per userId",
      "No Campaign needed — no persistent endpoint cost",
      "Runs as a batch job, no per-request API call",
    ],
    tags: ["personalize", "batch-inference", "s3", "offline"],
  },

  // ── AWS Lake Formation ─────────────────────────────────────────────────────

  {
    id: "mls-lakeformation-1",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "easy",
    question:
      "What is AWS Lake Formation and what problem does it solve for ML data pipelines?",
    answer:
      "Lake Formation is a managed service for building, securing, and managing data lakes on S3. It centralizes access control — providing table, column, row, and cell-level permissions on the Glue Data Catalog — enabling ML teams to access only authorized data without direct S3 bucket permissions.",
    keyPoints: [
      "Centralized security: one place to manage all data lake permissions",
      "Column-level security: ML models only see authorized feature columns",
      "Row-level filtering: restrict training data by geographic or business filters",
      "Blueprint-driven ingestion for automated data lake population",
    ],
    tags: ["lake-formation", "security", "data-lake", "access-control"],
  },
  {
    id: "mls-lakeformation-2",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "medium",
    question: "How does Lake Formation column-level security benefit ML teams?",
    answer:
      "Column-level security prevents ML engineers from accessing sensitive columns (PII, salary, SSN) in training data tables while granting access to feature columns needed for modeling. This enforces data minimization principles and regulatory compliance without creating separate tables.",
    keyPoints: [
      "Grant SELECT on specific columns of a Glue catalog table",
      "Athena and Redshift Spectrum queries automatically filter to authorized columns",
      "SageMaker Processing Jobs using Glue catalog respect Lake Formation permissions",
      "Avoids duplicating tables with sensitive columns removed",
    ],
    tags: ["lake-formation", "column-level-security", "pii", "compliance"],
  },
  {
    id: "mls-lakeformation-3",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "medium",
    question:
      "What is a Lake Formation Blueprint and how does it automate data lake ingestion?",
    answer:
      "Blueprints are pre-built workflow templates that automate the process of moving data from sources (RDS, DynamoDB, logs) into the data lake. They create Glue workflows with crawlers and ETL jobs, handling incremental loads and schema evolution automatically.",
    keyPoints: [
      "Blueprint types: Database snapshot, Incremental database, CloudTrail log",
      "Creates a Glue workflow with pre-configured crawlers and ETL jobs",
      "Handles incremental loads with built-in checkpoint tracking",
      "Target: S3 data lake with Glue catalog registration",
    ],
    tags: ["lake-formation", "blueprint", "ingestion", "glue"],
  },
  {
    id: "mls-lakeformation-4",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "hard",
    question:
      "What is Lake Formation row-level security and how is it implemented?",
    answer:
      "Row-level security (RLS) uses Data Filters to restrict which rows a principal can access when querying via Athena or Redshift Spectrum. A Data Filter defines column inclusion/exclusion and row filter expressions (WHERE conditions) applied at query time.",
    keyPoints: [
      "Data Filter: column projection + row filter expression",
      "Applied automatically when the principal queries via Athena",
      "Example: restrict ML engineers to training data rows where region='US-EAST'",
      "Combines with column-level security for comprehensive cell-level access",
    ],
    tags: ["lake-formation", "row-level-security", "data-filter"],
  },
  {
    id: "mls-lakeformation-5",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "easy",
    question: "How does Lake Formation relate to the Glue Data Catalog?",
    answer:
      "Lake Formation uses the Glue Data Catalog as its metadata store. Lake Formation adds a permission layer on top of the catalog — you grant/revoke table, column, and database permissions through Lake Formation, and they apply to all Glue-catalog-aware services (Athena, EMR, Redshift Spectrum).",
    keyPoints: [
      "Glue Data Catalog = metadata (schemas, partitions)",
      "Lake Formation = permissions on top of that metadata",
      "LF permissions replace the need for S3 bucket policy + Glue IAM policies",
      "Must grant LF permissions AND IAM permissions (LF does not replace IAM entirely)",
    ],
    tags: ["lake-formation", "glue-catalog", "permissions"],
  },
  {
    id: "mls-lakeformation-6",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "medium",
    question:
      "What is the Lake Formation cross-account access pattern for ML data sharing?",
    answer:
      "Lake Formation enables cross-account data sharing by granting another AWS account's principals (IAM roles) access to Glue catalog resources (databases, tables). The receiving account queries data via Athena without needing direct S3 access — data stays in the owning account's S3.",
    keyPoints: [
      "Data producer: grants LF permissions to external account's IAM principal",
      "Data consumer: creates a resource link in their catalog to the shared resource",
      "Data stays in producer's S3 — only metadata and query permissions are shared",
      "Useful for ML teams in separate accounts consuming shared training datasets",
    ],
    tags: ["lake-formation", "cross-account", "data-sharing"],
  },

  // ── Amazon Athena ─────────────────────────────────────────────────────────

  {
    id: "mls-athena-1",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "easy",
    question: "What is Amazon Athena and how is it priced?",
    answer:
      "Athena is a serverless, interactive SQL query engine for data in S3. It queries Parquet, ORC, JSON, CSV, and Avro directly. Pricing is $5 per TB of data scanned — columnar formats and partitioning dramatically reduce scanned data and cost.",
    keyPoints: [
      "No infrastructure to manage — serverless",
      "Uses the Glue Data Catalog for table definitions",
      "Partition pruning reduces scanned data and cost",
      "Columnar formats (Parquet/ORC) compress and minimize bytes scanned",
    ],
    tags: ["athena", "sql", "serverless", "s3"],
  },
  {
    id: "mls-athena-2",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "medium",
    question:
      "How does partitioning reduce Athena query cost in ML EDA workflows?",
    answer:
      "Partitioning organizes S3 data into directory hierarchies by column values (e.g., year/month/day). Athena's query planner uses partition values in WHERE clauses to skip entire partitions, scanning only relevant data and reducing the per-TB scanned cost.",
    keyPoints: [
      "Hive-style: s3://bucket/data/year=2024/month=03/",
      "Athena reads partition metadata from the Glue catalog",
      "Without partitioning: full table scan on every query",
      "Partition projection: virtual partitions without metadata overhead",
    ],
    tags: ["athena", "partitioning", "cost-optimization"],
  },
  {
    id: "mls-athena-3",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "medium",
    question:
      "What is Athena Federated Query and how does it support ML feature engineering?",
    answer:
      "Athena Federated Query uses Lambda-based data source connectors to query data outside S3 — including DynamoDB, RDS, Redshift, CloudWatch, and on-premises databases — joining them with S3 data in a single SQL query for feature engineering.",
    keyPoints: [
      "Connectors: Lambda functions translating Athena requests to source APIs",
      "Supports DynamoDB, RDS, Aurora, Redshift, Elasticsearch, CloudWatch Logs",
      "Join S3 historical data with DynamoDB real-time data in one query",
      "Results cached in S3 spill bucket for large queries",
    ],
    tags: ["athena", "federated-query", "lambda", "feature-engineering"],
  },
  {
    id: "mls-athena-4",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "easy",
    question:
      "What is Athena CTAS (CREATE TABLE AS SELECT) and how is it used in ML pipelines?",
    answer:
      "CTAS creates a new S3 table from the results of a SELECT query, storing output in Parquet or ORC. Used in ML pipelines to materialize transformed datasets into optimized formats without running Glue ETL jobs — converting CSV to Parquet or extracting feature subsets.",
    keyPoints: [
      "CREATE TABLE AS SELECT ... WITH (format='PARQUET')",
      "Creates a new Glue catalog table backed by S3",
      "Much simpler than Glue ETL for format conversion tasks",
      "Partitioned CTAS: writes partitioned output automatically",
    ],
    tags: ["athena", "ctas", "parquet", "etl-alternative"],
  },
  {
    id: "mls-athena-5",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "medium",
    question:
      "How does Athena integrate with SageMaker for ML exploratory data analysis?",
    answer:
      "SageMaker Studio notebooks use the awswrangler (AWS Data Wrangler) Python library to query Athena and return results as Pandas DataFrames. This enables interactive EDA on S3 data at scale without downloading entire datasets — queries push computation to Athena's serverless engine.",
    keyPoints: [
      "awswrangler.athena.read_sql_query(): returns Pandas DataFrame",
      "Results stored temporarily in an S3 output location before loading",
      "Athena handles large-scale aggregation; pandas does local analysis",
      "Athena ML extension (CREATE MODEL) trains ML models in SQL",
    ],
    tags: ["athena", "sagemaker", "pandas", "eda"],
  },
  {
    id: "mls-athena-6",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "hard",
    question:
      "What is Athena ML and how does it enable inference in SQL queries?",
    answer:
      "Athena ML allows you to invoke SageMaker endpoint models directly from SQL queries using the ML WITH SERDEPROPERTIES syntax. This enables batch scoring of S3 datasets by writing a SELECT query with a model invocation — no ETL job needed for scoring.",
    keyPoints: [
      "Uses a SageMaker endpoint to score rows from a SQL SELECT",
      "Athena sends batches of rows to the endpoint and joins results",
      "Requires an IAM role with SageMaker:InvokeEndpoint permission",
      "Useful for ad-hoc scoring without full Batch Transform infrastructure",
    ],
    tags: ["athena", "ml", "inference", "sagemaker"],
  },

  // ── Amazon Redshift ───────────────────────────────────────────────────────

  {
    id: "mls-redshift-1",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "easy",
    question:
      "What is Amazon Redshift and what makes it suitable for ML feature engineering?",
    answer:
      "Redshift is a fully managed petabyte-scale column-store data warehouse. Its columnar storage, parallel query execution (MPP), and SQL interface make it efficient for large-scale aggregations and feature engineering over structured data before training.",
    keyPoints: [
      "Columnar storage: reads only needed columns, high compression",
      "MPP: queries distributed across multiple nodes in parallel",
      "Redshift Spectrum: query external S3 data from Redshift SQL",
      "Native integration with SageMaker for training data export",
    ],
    tags: ["redshift", "data-warehouse", "columnar", "feature-engineering"],
  },
  {
    id: "mls-redshift-2",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "medium",
    question:
      "What is Redshift Spectrum and how does it extend Redshift for ML data pipelines?",
    answer:
      "Redshift Spectrum allows Redshift to query data stored in S3 directly using Redshift SQL — joining S3 external tables with Redshift internal tables in a single query. Uses the Glue Data Catalog for external table definitions.",
    keyPoints: [
      "External tables: defined in Glue catalog, data lives in S3",
      "No data movement — S3 data read directly at query time",
      "Spectrum scales compute separately from the Redshift cluster",
      "Useful for joining historical S3 training data with live warehouse data",
    ],
    tags: ["redshift", "spectrum", "s3", "glue-catalog"],
  },
  {
    id: "mls-redshift-3",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "medium",
    question: "What is Redshift ML and how does it integrate with SageMaker?",
    answer:
      "Redshift ML enables data engineers to create, train, and invoke ML models using SQL. Behind the scenes, it exports training data to S3, runs AutoML training on SageMaker Autopilot, registers the model, and makes it callable as a SQL function.",
    keyPoints: [
      "CREATE MODEL: SQL command that trains a SageMaker Autopilot model",
      "Training data: result of a SELECT query in Redshift",
      "Inference: call the model as a SQL function in SELECT statements",
      "Problem types: regression, classification, time series forecasting",
    ],
    tags: ["redshift", "redshift-ml", "autopilot", "sagemaker"],
  },
  {
    id: "mls-redshift-4",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "easy",
    question:
      "What is the COPY command in Redshift and why is it preferred for bulk data loading?",
    answer:
      "The COPY command bulk-loads data from S3, DynamoDB, or Kinesis Firehose into Redshift in parallel using all cluster nodes. It is orders of magnitude faster than INSERT for large datasets and is the standard method for loading ML training data exports into Redshift.",
    keyPoints: [
      "Reads from S3 in parallel across all compute nodes",
      "Supports CSV, JSON, Parquet, ORC, Avro, and more",
      "Automatically decompresses gzip, bzip2, zstd files",
      "INSERT is for single-row operations — COPY for bulk loads",
    ],
    tags: ["redshift", "copy", "bulk-load", "s3"],
  },
  {
    id: "mls-redshift-5",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "medium",
    question:
      "What distribution styles does Redshift support and how do they affect query performance?",
    answer:
      "EVEN: rows distributed evenly across nodes (default, good for tables without known join keys). KEY: rows with same key value co-located on the same node (good for join keys). ALL: full table copy on every node (good for small lookup/dimension tables to avoid redistribution).",
    keyPoints: [
      "EVEN: balanced storage, but joins may require data redistribution",
      "KEY: eliminates redistribution for joins on that key column",
      "ALL: eliminates joins entirely for small dimension tables",
      "Distribution style chosen at table creation — affects query performance significantly",
    ],
    tags: ["redshift", "distribution-style", "performance", "mpp"],
  },
  {
    id: "mls-redshift-6",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "hard",
    question:
      "How does Redshift Serverless differ from provisioned Redshift for ML workloads?",
    answer:
      "Redshift Serverless automatically scales compute capacity based on workload demand and charges per RPU-second (Redshift Processing Unit). No cluster sizing needed. Ideal for variable ML EDA workloads that spike during active development and idle overnight.",
    keyPoints: [
      "RPU: Redshift Processing Unit — compute capacity unit",
      "Auto scales from 8 to 512 RPUs based on query demand",
      "No maintenance windows or manual resizing",
      "Pay per RPU-second — cost-efficient for intermittent ML workloads",
    ],
    tags: ["redshift", "serverless", "scaling", "cost"],
  },

  // ── ML Data Preparation ───────────────────────────────────────────────────

  {
    id: "mls-dataprep-1",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "easy",
    question: "What is feature scaling and which ML algorithms require it?",
    answer:
      "Feature scaling normalizes numeric feature ranges so no single feature dominates due to magnitude. Standardization (z-score) and min-max normalization are common methods. Required for distance-based algorithms (KNN, SVM, neural networks). Tree-based models (XGBoost, random forest) are scale-invariant.",
    keyPoints: [
      "Standardization: (x - mean) / std — zero mean, unit variance",
      "Min-max: (x - min) / (max - min) — scales to [0,1]",
      "Neural networks, SVM, KNN: sensitive to feature scale",
      "Tree models: split on feature values, scale doesn't matter",
    ],
    tags: ["data-prep", "feature-scaling", "normalization", "standardization"],
  },
  {
    id: "mls-dataprep-2",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What is SMOTE and how does it address class imbalance differently than simple oversampling?",
    answer:
      "SMOTE (Synthetic Minority Over-sampling Technique) generates new synthetic examples by interpolating between existing minority class samples in feature space. Unlike random oversampling (duplication), SMOTE creates diverse new examples, reducing overfitting to specific minority instances.",
    keyPoints: [
      "Algorithm: for each minority sample, find K nearest minority neighbors, interpolate",
      "Generates diverse synthetic minority samples rather than duplicating",
      "Can be combined with random undersampling of the majority class",
      "ADASYN is a variant that generates more samples near difficult boundary regions",
    ],
    tags: ["data-prep", "smote", "class-imbalance", "oversampling"],
  },
  {
    id: "mls-dataprep-3",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What is the difference between missing completely at random (MCAR), missing at random (MAR), and missing not at random (MNAR)?",
    answer:
      "MCAR: missingness has no relationship to any data — safe to delete rows. MAR: missingness depends on observed variables (can be modeled). MNAR: missingness depends on the unobserved missing value itself — most problematic, requires careful analysis before imputation.",
    keyPoints: [
      "MCAR: deletion safe, but reduces sample size",
      "MAR: imputation valid using other features as predictors",
      "MNAR: requires domain knowledge — imputation can introduce bias",
      "Little's MCAR test checks if data is MCAR statistically",
    ],
    tags: ["data-prep", "missing-values", "imputation", "mcar", "mnar"],
  },
  {
    id: "mls-dataprep-4",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "hard",
    question:
      "What is target leakage in ML and what data preparation steps prevent it?",
    answer:
      "Target leakage occurs when features available at training time are not available at prediction time (future data leaks into training), or when the target variable's value is directly or indirectly encoded in features. Prevents by enforcing strict temporal separation and auditing feature derivation logic.",
    keyPoints: [
      "Example leak: using 'refund_requested' to predict fraud — it happens after fraud",
      "Test set contamination: using test labels to select features is leakage",
      "Target encoding: compute target mean within CV folds, not on full training set",
      "Feature audit: trace each feature to its data source and collection timestamp",
    ],
    tags: ["data-prep", "target-leakage", "feature-engineering", "validation"],
  },
  {
    id: "mls-dataprep-5",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "easy",
    question:
      "What is the purpose of a train/validation/test split and what role does each set play?",
    answer:
      "Training set: used to fit model parameters. Validation set: used to tune hyperparameters and compare models during development. Test set: held out until the very end — provides an unbiased estimate of final generalization performance. Using the test set for decisions contaminates it.",
    keyPoints: [
      "Train/val/test: typical ratios 70/15/15 or 80/10/10",
      "Validation set guides model selection and hyperparameter tuning",
      "Test set: touch once — any decision based on it invalidates it as an unbiased estimate",
      "K-fold CV: uses all training data for validation by rotating folds",
    ],
    tags: ["data-prep", "train-test-split", "validation", "evaluation"],
  },
  {
    id: "mls-dataprep-6",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What is SageMaker Ground Truth and how does its active learning reduce labeling cost?",
    answer:
      "Ground Truth is a managed data labeling service supporting image classification, object detection, text classification, NER, and video labeling. Active learning automatically labels high-confidence examples with a model, routing only ambiguous examples to human labelers — reducing cost up to 70%.",
    keyPoints: [
      "Supports image, text, video, point cloud labeling tasks",
      "Private workforce: your employees; Mechanical Turk: public workers",
      "Active learning: model auto-labels easy cases, humans handle hard ones",
      "Output: labeled dataset in S3 with manifest file for SageMaker training",
    ],
    tags: ["data-prep", "ground-truth", "labeling", "active-learning"],
  },
  {
    id: "mls-dataprep-7",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "hard",
    question: "What is the Winsorization technique for outlier treatment?",
    answer:
      "Winsorization (capping) replaces extreme values at specified percentile boundaries rather than deleting them. For example, cap all values above the 99th percentile at the 99th percentile value. Preserves sample size while reducing the influence of extreme outliers on model training.",
    keyPoints: [
      "Also called percentile capping or clipping",
      "Preserves all rows — no data loss like deletion",
      "Symmetric or asymmetric: can cap only the upper tail",
      "Alternative to log transformation for right-skewed features",
    ],
    tags: ["data-prep", "outliers", "winsorization", "feature-engineering"],
  },

  // ── ML Model Training ──────────────────────────────────────────────────────

  {
    id: "mls-training-1",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "easy",
    question: "What is the bias-variance tradeoff in ML?",
    answer:
      "High bias (underfitting): model is too simple, misses patterns in training data. High variance (overfitting): model memorizes training data, fails to generalize. The optimal model has low bias AND low variance. Regularization, more data, and cross-validation help manage this tradeoff.",
    keyPoints: [
      "Bias: systematic error from wrong model assumptions",
      "Variance: sensitivity to fluctuations in training data",
      "Overfitting: low training loss, high validation loss",
      "Underfitting: high training AND validation loss",
    ],
    tags: ["training", "bias-variance", "overfitting", "underfitting"],
  },
  {
    id: "mls-training-2",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What are L1 and L2 regularization and how do they differ?",
    answer:
      "L1 (Lasso): adds sum of absolute weight values to the loss function — drives some weights to exactly zero, producing sparse models with automatic feature selection. L2 (Ridge): adds sum of squared weights — shrinks weights toward zero without eliminating them, producing smoother models.",
    keyPoints: [
      "L1: penalty = lambda * sum(|w|) — sparse, feature selection",
      "L2: penalty = lambda * sum(w^2) — smooth shrinkage, no sparsity",
      "Elastic Net: combines L1 + L2 penalties",
      "Lambda (alpha): hyperparameter controlling regularization strength",
    ],
    tags: ["training", "regularization", "l1", "l2", "lasso", "ridge"],
  },
  {
    id: "mls-training-3",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is gradient descent and what are the three variants?",
    answer:
      "Gradient descent minimizes the loss function by iteratively moving in the direction of the negative gradient. Batch GD: compute gradient on full dataset (slow, stable). SGD: gradient on one sample (fast, noisy). Mini-batch SGD: gradient on a small batch (balance of both — standard in deep learning).",
    keyPoints: [
      "Learning rate: controls step size — too large: diverge; too small: slow convergence",
      "Momentum: accumulates gradient history to smooth updates",
      "Adam optimizer: adaptive learning rates per parameter (most popular in DL)",
      "Learning rate schedules: decrease LR over training for fine convergence",
    ],
    tags: ["training", "gradient-descent", "sgd", "optimizer"],
  },
  {
    id: "mls-training-4",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "hard",
    question: "What is transfer learning and when should it be used in ML?",
    answer:
      "Transfer learning uses a model pre-trained on a large dataset (e.g., ImageNet, BERT) as a starting point for a new task. Fine-tune the last layers on your task-specific data. Use when you have limited labeled data but the source domain is related — saves training time and improves performance.",
    keyPoints: [
      "Feature extraction: freeze pre-trained layers, train only a new classification head",
      "Fine-tuning: unfreeze some pre-trained layers and train with small LR",
      "Domain similarity matters: ImageNet → medical imaging less effective than ImageNet → product photos",
      "SageMaker JumpStart provides pre-trained models for fine-tuning",
    ],
    tags: ["training", "transfer-learning", "fine-tuning", "deep-learning"],
  },
  {
    id: "mls-training-5",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What are the key SageMaker built-in algorithms and their use cases?",
    answer:
      "XGBoost: tabular classification/regression (most popular). Linear Learner: logistic/linear regression at scale. K-Means: unsupervised clustering. BlazingText: text classification and word2vec embeddings. Object Detection, Semantic Segmentation: CV tasks. DeepAR: time series forecasting.",
    keyPoints: [
      "XGBoost: gradient boosted trees — best for structured/tabular data",
      "K-Means: clustering — needs number of clusters specified upfront",
      "BlazingText: word2vec or text classification, word similarity",
      "All built-in algorithms support distributed training natively",
    ],
    tags: ["training", "sagemaker", "built-in-algorithms", "xgboost"],
  },
  {
    id: "mls-training-6",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "hard",
    question:
      "What is a neural network activation function and what are the common choices?",
    answer:
      "Activation functions introduce non-linearity into neural networks. ReLU (Rectified Linear Unit): max(0,x) — simple, avoids vanishing gradient, default for hidden layers. Sigmoid: output in (0,1) — used for binary output layers. Softmax: probability distribution over classes — used for multi-class output layers.",
    keyPoints: [
      "ReLU: fast, sparse activations, but 'dying ReLU' problem (neurons that always output 0)",
      "Leaky ReLU / ELU: variants that fix dying ReLU",
      "Tanh: output in (-1,1), zero-centered — sometimes better than sigmoid",
      "Sigmoid + cross-entropy = binary classification output",
    ],
    tags: ["training", "neural-network", "activation-function", "relu"],
  },
  {
    id: "mls-training-7",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is an epoch, batch size, and iteration in ML training?",
    answer:
      "Epoch: one full pass through the entire training dataset. Batch size: number of training examples processed before a weight update. Iteration: one weight update step (one batch forward + backward pass). Total iterations per epoch = dataset size / batch size.",
    keyPoints: [
      "Large batch: more stable gradients, requires more memory, can reduce generalization",
      "Small batch: noisy gradients, implicit regularization effect, faster per-iteration",
      "Training usually runs for multiple epochs until validation loss stops improving",
      "Early stopping: stop training when validation loss stops improving to prevent overfitting",
    ],
    tags: ["training", "epoch", "batch-size", "iteration"],
  },

  // ── ML Model Evaluation ───────────────────────────────────────────────────

  {
    id: "mls-evaluation-1",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "easy",
    question:
      "What is a confusion matrix and what four quantities does it contain?",
    answer:
      "A confusion matrix shows predicted vs. actual class labels for a classification model. The four cells: True Positive (TP), True Negative (TN), False Positive (FP — Type I error), False Negative (FN — Type II error). All classification metrics derive from these four values.",
    keyPoints: [
      "TP: correctly predicted positive",
      "TN: correctly predicted negative",
      "FP: predicted positive, actually negative (Type I error)",
      "FN: predicted negative, actually positive (Type II error)",
    ],
    tags: ["evaluation", "confusion-matrix", "classification-metrics"],
  },
  {
    id: "mls-evaluation-2",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is precision vs. recall and when do you optimize for each?",
    answer:
      "Precision = TP/(TP+FP): of all positive predictions, how many are correct. Optimize when FP is costly (spam detection — legitimate mail flagged as spam). Recall = TP/(TP+FN): of all actual positives, how many were found. Optimize when FN is costly (cancer detection — missing a cancer is worse than a false alarm).",
    keyPoints: [
      "Precision: what fraction of positives you predicted are actually positive",
      "Recall (sensitivity): what fraction of true positives you caught",
      "F1 score: harmonic mean of precision and recall",
      "Precision-recall tradeoff: adjusting threshold shifts the balance",
    ],
    tags: ["evaluation", "precision", "recall", "f1"],
  },
  {
    id: "mls-evaluation-3",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "medium",
    question: "What is AUC-ROC and what does it measure?",
    answer:
      "AUC-ROC (Area Under the Receiver Operating Characteristic Curve) measures a classifier's ability to discriminate between classes at all decision thresholds. AUC=1.0: perfect; AUC=0.5: random classifier. Threshold-independent metric, useful for imbalanced datasets.",
    keyPoints: [
      "ROC curve: True Positive Rate vs. False Positive Rate at all thresholds",
      "AUC summarizes the ROC curve as a single number",
      "Threshold-independent: evaluates model at all operating points",
      "For severe imbalance, AUC-PR (precision-recall AUC) is more informative",
    ],
    tags: ["evaluation", "auc-roc", "classification", "threshold"],
  },
  {
    id: "mls-evaluation-4",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "easy",
    question:
      "What is RMSE and MAE for regression evaluation and how do they differ?",
    answer:
      "RMSE (Root Mean Square Error): square root of mean squared errors — penalizes large errors more heavily due to squaring. MAE (Mean Absolute Error): mean of absolute errors — treats all errors equally. Use RMSE when large errors are especially costly; MAE for more interpretable, outlier-robust evaluation.",
    keyPoints: [
      "RMSE = sqrt(mean((y_pred - y_true)^2)) — same units as target",
      "MAE = mean(|y_pred - y_true|) — same units as target",
      "RMSE >= MAE always — gap indicates outlier errors",
      "MAPE: mean absolute percentage error — scale-independent",
    ],
    tags: ["evaluation", "rmse", "mae", "regression"],
  },
  {
    id: "mls-evaluation-5",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What is k-fold cross-validation and why does it give a more reliable evaluation than a single holdout?",
    answer:
      "K-fold CV partitions data into K subsets, trains K models each using a different fold as validation, and averages performance. Each data point is used for both training and validation — giving a more reliable performance estimate that is less sensitive to the particular random split.",
    keyPoints: [
      "5-fold or 10-fold are standard choices",
      "Stratified k-fold preserves class proportions in each fold",
      "Variance of the estimate reduces as K increases",
      "Computationally K times more expensive than a single holdout",
    ],
    tags: ["evaluation", "cross-validation", "k-fold", "validation"],
  },
  {
    id: "mls-evaluation-6",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "hard",
    question: "What are BLEU and ROUGE scores and what ML tasks use them?",
    answer:
      "BLEU (Bilingual Evaluation Understudy): measures n-gram precision overlap between machine-generated and reference translations — used for machine translation evaluation. ROUGE (Recall-Oriented Understudy for Gisting Evaluation): measures n-gram recall overlap — used for text summarization evaluation.",
    keyPoints: [
      "BLEU: precision-focused, primary metric for MT (Amazon Translate evaluation)",
      "ROUGE-1: unigram overlap; ROUGE-2: bigram; ROUGE-L: longest common subsequence",
      "ROUGE: recall-focused — how much of the reference did the summary capture",
      "Both are reference-based metrics — require human-written reference text",
    ],
    tags: ["evaluation", "bleu", "rouge", "nlp", "translation"],
  },
  {
    id: "mls-evaluation-7",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "medium",
    question:
      "What is SageMaker Clarify and what types of bias does it detect?",
    answer:
      "SageMaker Clarify detects pre-training bias (class imbalance and data skew in training data) and post-training bias (disparities in model predictions across demographic groups). It also generates SHAP-based feature importance and model explanations for explainability.",
    keyPoints: [
      "Pre-training bias: analyzed before model is trained on dataset statistics",
      "Post-training bias: analyzed after training on model predictions",
      "Bias metrics: DPL, TVD, KS, CI — each measures different fairness criteria",
      "SHAP explanations: feature importance for individual predictions",
    ],
    tags: ["evaluation", "clarify", "bias", "explainability", "shap"],
  },

  // ── ML Model Deployment ────────────────────────────────────────────────────

  {
    id: "mls-deployment-1",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "easy",
    question:
      "What are the four SageMaker inference deployment patterns and when is each used?",
    answer:
      "Real-Time Endpoint: persistent HTTPS endpoint, low-latency synchronous inference. Batch Transform: asynchronous bulk S3 inference, no endpoint. Serverless Inference: scale-to-zero for bursty low-traffic. Asynchronous Inference: queued requests, results written to S3 for large payloads or long inference.",
    keyPoints: [
      "Real-Time: persistent, auto-scaling, low-latency (ms)",
      "Batch Transform: offline bulk scoring, no endpoint cost",
      "Serverless: zero cost at idle, cold start latency",
      "Async: large payloads (up to 1GB), long-running inference (up to 1 hour)",
    ],
    tags: ["deployment", "sagemaker", "inference", "endpoint"],
  },
  {
    id: "mls-deployment-2",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is a SageMaker Multi-Model Endpoint and when should it be used?",
    answer:
      "A Multi-Model Endpoint hosts thousands of models on a single endpoint — models are loaded from S3 on demand and cached in memory. Used when you have many models (e.g., per-customer models) that don't need to be loaded simultaneously — reduces cost significantly vs. one endpoint per model.",
    keyPoints: [
      "Models loaded lazily on first request — cold load latency for first call",
      "Frequently used models cached in memory, rarely used models evicted",
      "Models stored in S3, loaded to endpoint container on demand",
      "Saves cost: N models on 1 endpoint vs. N separate endpoints",
    ],
    tags: ["deployment", "multi-model-endpoint", "cost-optimization"],
  },
  {
    id: "mls-deployment-3",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is a SageMaker Blue/Green deployment and how does it minimize risk?",
    answer:
      "Blue/Green deployment creates a new production variant (green) while keeping the current one running (blue), then gradually shifts traffic from blue to green. If the green variant performs correctly, traffic shifts to 100% and blue is terminated. Allows rollback at any point.",
    keyPoints: [
      "Traffic shifting: immediate, canary (small % first), or linear",
      "Auto-rollback: CloudWatch alarms trigger rollback if error rate increases",
      "Zero downtime: traffic always served during the switch",
      "Required for SageMaker endpoint production updates",
    ],
    tags: ["deployment", "blue-green", "traffic-shifting", "rollback"],
  },
  {
    id: "mls-deployment-4",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is model serving latency vs. throughput and what factors affect each?",
    answer:
      "Latency: time from request to response (ms). Throughput: requests served per second. They are often in tension — batching requests increases throughput but increases individual request latency. GPU instances improve both but cost more. Instance type choice, batch size, and model optimization (quantization, TorchScript) all affect these.",
    keyPoints: [
      "Real-time: optimize for latency — large instances, no batching",
      "Bulk inference: optimize for throughput — batch inputs, GPU instances",
      "Model quantization (FP16, INT8): reduces model size, increases throughput",
      "SageMaker auto-scaling: adds instances under load to maintain throughput",
    ],
    tags: ["deployment", "latency", "throughput", "optimization"],
  },
  {
    id: "mls-deployment-5",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "hard",
    question:
      "What is model quantization and how does it speed up ML inference?",
    answer:
      "Quantization reduces model numerical precision from FP32 to FP16 or INT8, reducing model size by 2-4x and increasing inference speed. Trade-off: slight accuracy degradation. Post-training quantization (PTQ) applies without retraining; quantization-aware training (QAT) maintains accuracy better.",
    keyPoints: [
      "FP32 → FP16: 2x memory reduction, hardware-accelerated on modern GPUs",
      "FP32 → INT8: 4x memory reduction, 2-4x throughput improvement",
      "PTQ: apply after training, easiest — small accuracy drop",
      "QAT: simulate quantization during training — better accuracy",
    ],
    tags: ["deployment", "quantization", "optimization", "inference"],
  },
  {
    id: "mls-deployment-6",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "easy",
    question:
      "What is SageMaker Neo and how does it optimize models for edge deployment?",
    answer:
      "SageMaker Neo compiles ML models to run efficiently on target hardware (CPU, GPU, ARM, x86, Graviton). It applies hardware-specific optimizations (operator fusion, memory optimization) that typically reduce inference latency by 2-10x on the target device.",
    keyPoints: [
      "Supports TensorFlow, PyTorch, MXNet, ONNX models",
      "Target hardware: AWS Inferentia, Graviton, NVIDIA, Intel, Arm",
      "Compiled model is smaller and faster on the specific hardware",
      "IoT Greengrass integration: deploy Neo-optimized models to edge devices",
    ],
    tags: ["deployment", "neo", "edge", "optimization", "compilation"],
  },

  // ── ML Security & IAM ──────────────────────────────────────────────────────

  {
    id: "mls-security-1",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "easy",
    question:
      "What IAM permissions does a SageMaker Training Job execution role need?",
    answer:
      "The SageMaker Training Job execution role needs: S3 read access for training data and write access for model output, ECR read access for container images, CloudWatch Logs write access for training logs, and optionally KMS permissions if data is encrypted.",
    keyPoints: [
      "Principle of least privilege: grant only what the job needs",
      "Role is assumed by SageMaker, not a human user",
      "S3 bucket policies must also grant access to the role",
      "SageMaker managed policies available: AmazonSageMakerFullAccess (too broad for production)",
    ],
    tags: ["security", "iam", "sagemaker", "training-job"],
  },
  {
    id: "mls-security-2",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "medium",
    question:
      "How does VPC isolation improve security for SageMaker Training Jobs?",
    answer:
      "Running Training Jobs in a VPC prevents data from traversing the public internet — all S3 access goes through a VPC endpoint (S3 Gateway), and job compute is in private subnets. Combined with security groups, this enforces network-level isolation for sensitive training data.",
    keyPoints: [
      "VPC endpoint for S3: traffic stays within AWS network",
      "Private subnets: training instances not publicly accessible",
      "Security groups: control inbound/outbound traffic for training instances",
      "Inter-container traffic encryption: encrypts distributed training communication",
    ],
    tags: ["security", "vpc", "sagemaker", "network-isolation"],
  },
  {
    id: "mls-security-3",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "medium",
    question: "How does AWS KMS protect ML training data and model artifacts?",
    answer:
      "KMS customer-managed keys (CMKs) encrypt S3 training datasets (SSE-KMS), SageMaker Training Job output model artifacts, and EBS volumes used during training. Key policies and grants control which IAM roles can encrypt/decrypt — providing audit trails via CloudTrail.",
    keyPoints: [
      "SSE-KMS on S3: SageMaker role must have kms:GenerateDataKey and kms:Decrypt",
      "SageMaker Training Job VolumeKmsKeyId: encrypts EBS during training",
      "Key rotation: annual automatic rotation for CMKs",
      "CloudTrail logs every KMS API call — audit trail for compliance",
    ],
    tags: ["security", "kms", "encryption", "sagemaker"],
  },
  {
    id: "mls-security-4",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "hard",
    question:
      "What is SageMaker Studio domain isolation and how does it enforce multi-user security?",
    answer:
      "SageMaker Studio Domain supports IAM or SSO authentication with user profile isolation — each user profile has its own EFS home directory and execution role, preventing cross-user data access. VPC-only mode routes all Studio traffic through your VPC.",
    keyPoints: [
      "User profile: isolated environment per user with dedicated execution role",
      "EFS: each user has a separate home directory on shared EFS",
      "Domain-level network: VPC or public internet access mode",
      "IAM condition keys: restrict SageMaker actions to specific Studio users",
    ],
    tags: ["security", "studio", "multi-user", "isolation"],
  },
  {
    id: "mls-security-5",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "medium",
    question:
      "What is the principle of least privilege applied to ML pipelines on AWS?",
    answer:
      "Each component in an ML pipeline should have only the permissions it needs: Training Jobs read training S3 paths only; Processing Jobs write output S3 paths only; endpoints invoke the model only; pipelines have separate roles from individual jobs. Use separate IAM roles per job type.",
    keyPoints: [
      "Separate roles: training, processing, serving, pipeline orchestration",
      "Resource-based policies: S3 bucket policies limit access to specific prefixes",
      "IAM permission boundaries: limit maximum permissions a role can have",
      "Deny by default: explicit deny overrides any allow",
    ],
    tags: ["security", "iam", "least-privilege", "ml-pipeline"],
  },
  {
    id: "mls-security-6",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "easy",
    question:
      "What AWS services provide audit and compliance capabilities for ML workloads?",
    answer:
      "CloudTrail: logs all API calls (who invoked what SageMaker/S3/KMS action and when). CloudWatch: metrics and alarms for endpoint error rates, training job status. Config: tracks configuration changes to SageMaker and S3 resources over time. GuardDuty: threat detection for anomalous ML workload access.",
    keyPoints: [
      "CloudTrail: immutable API audit log — required for compliance",
      "CloudWatch: operational metrics and alerting",
      "Config: configuration history and compliance rules",
      "Macie: detects PII in S3 training data automatically",
    ],
    tags: ["security", "cloudtrail", "cloudwatch", "compliance", "audit"],
  },
  {
    id: "mls-security-7",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "hard",
    question:
      "What is inter-container traffic encryption in SageMaker distributed training?",
    answer:
      "Inter-container traffic encryption (VPC mode with encryption enabled) encrypts all communication between instances in a distributed training job using TLS. Required when training data or intermediate gradients are sensitive — prevents interception of model parameters or training data during communication.",
    keyPoints: [
      "Enabled via EnableInterContainerTrafficEncryption in Training Job config",
      "Requires training job to run in a VPC",
      "TLS encryption for all Allreduce/parameter server communications",
      "Small performance overhead (~5%) due to encryption/decryption",
    ],
    tags: ["security", "encryption", "distributed-training", "inter-container"],
  },

  // ── ML Pipeline & MLOps ────────────────────────────────────────────────────

  {
    id: "mls-mlops-1",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "easy",
    question: "What is a SageMaker Pipeline and what problem does it solve?",
    answer:
      "SageMaker Pipelines is a DAG-based ML workflow orchestration engine that chains processing, training, tuning, and deployment steps into a versioned, repeatable, and auditable pipeline. Solves the problem of manual, ad-hoc ML workflows that are not reproducible or scalable.",
    keyPoints: [
      "Steps: ProcessingStep, TrainingStep, TuningStep, ModelStep, TransformStep, ConditionStep",
      "Each run is versioned with parameters captured for reproducibility",
      "Integrates with Model Registry for automated model approval and deployment",
      "Pipelines are defined in Python SDK and compiled to a JSON DAG",
    ],
    tags: ["mlops", "pipelines", "orchestration", "sagemaker"],
  },
  {
    id: "mls-mlops-2",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is CI/CD for ML (CI/CD ML) and how does it differ from software CI/CD?",
    answer:
      "CI/CD for ML automates the pipeline of data validation, model training, evaluation, registration, and deployment triggered by new data or code changes. Unlike software CI/CD (testing and deploying code), ML CI/CD also validates data quality, model accuracy, and bias metrics before deployment.",
    keyPoints: [
      "Triggers: new data arrival, code commit, scheduled retraining",
      "Gates: model evaluation must exceed baseline accuracy before deployment",
      "CodePipeline + SageMaker Pipelines: common CI/CD architecture",
      "Automated rollback: CloudWatch alarms trigger rollback on degraded metrics",
    ],
    tags: ["mlops", "ci-cd", "automation", "retraining"],
  },
  {
    id: "mls-mlops-3",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is SageMaker Model Monitor and how does it trigger retraining?",
    answer:
      "Model Monitor continuously baselines live inference traffic and detects data quality and model quality drift by comparing live statistics against a training baseline. When drift exceeds thresholds, CloudWatch alarms fire — which can trigger EventBridge rules that kick off SageMaker Pipelines retraining jobs.",
    keyPoints: [
      "Baseline: computed from training dataset statistics using ProcessingJob",
      "Schedule: monitoring runs on a configurable schedule (hourly, daily)",
      "CloudWatch metrics: constraint violations published as CloudWatch metrics",
      "EventBridge: alarm → EventBridge → SageMaker Pipeline retrain trigger",
    ],
    tags: ["mlops", "model-monitor", "drift", "retraining"],
  },
  {
    id: "mls-mlops-4",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "hard",
    question:
      "What is ML experiment tracking and what does SageMaker Experiments capture?",
    answer:
      "Experiment tracking records hyperparameters, metrics, and artifacts for every model training run, enabling comparison and reproducibility. SageMaker Experiments captures this in a 3-level hierarchy: Experiment → Trial → Trial Component (individual training, processing, or evaluation steps).",
    keyPoints: [
      "Enables comparison of many training runs side-by-side",
      "Hyperparameters, metrics (loss, accuracy), and artifact locations stored per trial",
      "Integrated with SageMaker Studio for visual comparison",
      "Trial Component links back to the specific Training Job for full lineage",
    ],
    tags: ["mlops", "experiments", "tracking", "reproducibility"],
  },
  {
    id: "mls-mlops-5",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is A/B testing for ML models and how is it implemented in SageMaker?",
    answer:
      "A/B testing serves a fraction of production traffic to a new model variant while the majority goes to the current model, comparing real-world performance metrics. In SageMaker, endpoint Production Variants allow multiple model versions with traffic weights — e.g., 90% to model-A, 10% to model-B.",
    keyPoints: [
      "Production Variants: named model variants with InitialVariantWeight",
      "UpdateEndpointWeightsAndCapacities: shift traffic percentage between variants",
      "CloudWatch captures InvocationByVariant metrics per variant",
      "Shadow testing: new model receives all traffic but results are discarded",
    ],
    tags: ["mlops", "ab-testing", "endpoint", "canary"],
  },
  {
    id: "mls-mlops-6",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "easy",
    question:
      "What is MLflow and how does it compare to SageMaker Experiments for MLOps?",
    answer:
      "MLflow is an open-source ML lifecycle management platform supporting experiment tracking, model packaging, and model registry. SageMaker Experiments provides similar experiment tracking natively integrated with SageMaker Training Jobs. MLflow on AWS can run on SageMaker Managed MLflow or self-hosted on EC2/ECS.",
    keyPoints: [
      "MLflow: open-source, framework-agnostic, runs anywhere",
      "SageMaker Experiments: native AWS integration, automatic metric capture",
      "Both support: hyperparameter logging, metric tracking, artifact versioning",
      "SageMaker Managed MLflow: fully managed MLflow server on AWS",
    ],
    tags: ["mlops", "mlflow", "experiments", "tracking"],
  },
  {
    id: "mls-mlops-7",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "hard",
    question:
      "What is the SageMaker Model Registry approval workflow and why is it important for governance?",
    answer:
      "The Model Registry stores versioned model packages with status: PendingManualApproval, Approved, or Rejected. Only Approved models can be deployed by automated pipelines. This gates production deployment on human review — ensuring business stakeholders validate model quality before serving traffic.",
    keyPoints: [
      "Model package: model artifact + inference container + evaluation metrics",
      "Approval: manual (ML engineer reviews) or automated (metrics threshold check)",
      "EventBridge: fires on model approval → triggers deployment pipeline",
      "Audit trail: who approved which model version and when",
    ],
    tags: ["mlops", "model-registry", "governance", "approval"],
  },
];
