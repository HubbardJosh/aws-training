import { QuizQuestion } from "../../types";

export const quizQuestions: QuizQuestion[] = [
  // ── Amazon SageMaker ────────────────────────────────────────────────────────
  {
    id: "mls-qq-1",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A data scientist wants to train a machine learning model without managing any infrastructure. Which SageMaker feature provides fully managed training?",
    options: [
      "SageMaker Studio Lab",
      "SageMaker Training Jobs",
      "SageMaker Canvas",
      "SageMaker Ground Truth",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Training Jobs provision and manage the compute infrastructure automatically. You specify the algorithm, instance type, and training data location, and SageMaker handles provisioning, training, and teardown.",
    tags: ["sagemaker", "training", "managed"],
  },
  {
    id: "mls-qq-2",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company needs to host a low-latency ML model that receives sporadic traffic and wants to minimize cost. Which SageMaker hosting option is BEST?",
    options: [
      "Real-Time Endpoints with dedicated instances",
      "Batch Transform",
      "Serverless Inference",
      "Asynchronous Inference",
    ],
    correctIndices: [2],
    explanation:
      "Serverless Inference automatically scales to zero when there is no traffic, so you pay only for the compute used during inference. It is ideal for sporadic traffic patterns where cost matters more than cold-start latency.",
    tags: ["sagemaker", "inference", "serverless"],
  },
  {
    id: "mls-qq-3",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which SageMaker feature automatically tries multiple algorithms and hyperparameter combinations to find the best model?",
    options: [
      "SageMaker Clarify",
      "SageMaker Autopilot",
      "SageMaker Model Monitor",
      "SageMaker Debugger",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Autopilot is an automated ML (AutoML) service that automatically explores different algorithms, feature engineering approaches, and hyperparameter combinations, then ranks the resulting models by performance.",
    tags: ["sagemaker", "autopilot", "automl"],
  },
  {
    id: "mls-qq-4",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A team wants to detect when a deployed model's predictions are drifting from baseline due to changes in incoming data. Which SageMaker capability should they use?",
    options: [
      "SageMaker Debugger",
      "SageMaker Experiments",
      "SageMaker Model Monitor",
      "SageMaker Clarify",
    ],
    correctIndices: [2],
    explanation:
      "SageMaker Model Monitor continuously monitors data quality, model quality, bias drift, and feature attribution drift on live endpoints. It compares incoming data against a baseline captured from the training dataset and publishes violation alerts to CloudWatch.",
    tags: ["sagemaker", "model-monitor", "drift", "mlops"],
  },
  {
    id: "mls-qq-5",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO SageMaker features help explain model predictions and detect bias?",
    options: [
      "SageMaker Clarify",
      "SageMaker Autopilot",
      "SageMaker Debugger",
      "SageMaker Model Monitor",
      "SageMaker Feature Store",
    ],
    correctIndices: [0, 3],
    explanation:
      "SageMaker Clarify detects bias pre-training and post-deployment, and provides SHAP-based feature attribution to explain individual predictions. SageMaker Model Monitor's bias drift monitor continuously checks deployed endpoints for fairness metric degradation using Clarify under the hood. Debugger targets training health (vanishing gradients, tensor issues) — not bias or explainability.",
    tags: ["sagemaker", "clarify", "model-monitor", "bias"],
  },
  {
    id: "mls-qq-6",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is the purpose of SageMaker Feature Store?",
    options: [
      "To store trained model artifacts",
      "To store, share, and reuse ML features across teams and models",
      "To store training logs and metrics",
      "To store hyperparameter configurations",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Feature Store is a centralized repository for ML features. Teams can store computed features once and reuse them across multiple models and experiments, ensuring consistency between training and inference.",
    tags: ["sagemaker", "feature-store", "mlops"],
  },
  {
    id: "mls-qq-7",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A batch scoring job needs to run inference on 10 million records stored in S3. The results do not need to be returned in real time. Which SageMaker option is most appropriate?",
    options: [
      "Real-Time Endpoint",
      "Serverless Inference",
      "Asynchronous Inference",
      "Batch Transform",
    ],
    correctIndices: [3],
    explanation:
      "Batch Transform processes large datasets stored in S3 and writes predictions back to S3. It is designed for offline scoring of large datasets and automatically provisions the required compute, then tears it down when complete.",
    tags: ["sagemaker", "batch-transform", "inference"],
  },

  // ── Amazon S3 for ML ─────────────────────────────────────────────────────────
  {
    id: "mls-qq-8",
    service: "Amazon S3 for ML",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Which S3 feature allows SageMaker to access training data without downloading the entire dataset first, enabling faster training job startup?",
    options: [
      "S3 Transfer Acceleration",
      "S3 Requester Pays",
      "S3 Pipe Mode (S3 data channel)",
      "S3 Lifecycle policies",
    ],
    correctIndices: [2],
    explanation:
      "S3 Pipe Mode streams data directly from S3 into the training container as it is needed, eliminating the need to download the full dataset before training starts. This reduces startup time and storage costs for large datasets.",
    tags: ["s3", "sagemaker", "pipe-mode", "training"],
  },
  {
    id: "mls-qq-9",
    service: "Amazon S3 for ML",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company stores raw training data in S3 and wants to automatically move data older than 90 days to cheaper storage. Which S3 feature handles this?",
    options: [
      "S3 Replication",
      "S3 Lifecycle policies",
      "S3 Intelligent-Tiering",
      "S3 Object Lock",
    ],
    correctIndices: [1],
    explanation:
      "S3 Lifecycle policies automate transitioning objects between storage classes (e.g., Standard → Standard-IA → Glacier) based on age rules, reducing storage costs for infrequently accessed training data without manual intervention.",
    tags: ["s3", "lifecycle", "storage-cost"],
  },
  {
    id: "mls-qq-10",
    service: "Amazon S3 for ML",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "An ML team needs to organize datasets in S3 so that AWS Glue can discover schema automatically. What is the recommended format?",
    options: [
      "CSV with no header row",
      "JSON with nested arrays",
      "Apache Parquet with consistent partitioning",
      "Plain text with comma delimiters",
    ],
    correctIndices: [2],
    explanation:
      "Apache Parquet is a columnar format that includes schema information, supports efficient compression, and integrates natively with AWS Glue, Athena, and EMR. Consistent partitioning (e.g., by date) further improves query performance and Glue crawler efficiency.",
    tags: ["s3", "parquet", "glue", "data-engineering"],
  },
  {
    id: "mls-qq-11",
    service: "Amazon S3 for ML",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Which S3 storage class automatically moves objects between access tiers based on usage patterns, with no retrieval fees?",
    options: [
      "S3 Glacier Flexible Retrieval",
      "S3 Standard-IA",
      "S3 Intelligent-Tiering",
      "S3 One Zone-IA",
    ],
    correctIndices: [2],
    explanation:
      "S3 Intelligent-Tiering monitors access patterns and automatically moves objects between frequent, infrequent, and archive tiers with no retrieval charges. It is ideal for ML datasets with unpredictable access patterns.",
    tags: ["s3", "intelligent-tiering", "storage"],
  },
  {
    id: "mls-qq-12",
    service: "Amazon S3 for ML",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO S3 features are most important for securing sensitive training data used in ML pipelines?",
    options: [
      "Server-side encryption (SSE-KMS)",
      "S3 Transfer Acceleration",
      "S3 bucket policies restricting access to specific IAM roles",
      "S3 Requester Pays",
      "S3 Versioning",
    ],
    correctIndices: [0, 2],
    explanation:
      "SSE-KMS encrypts objects at rest using AWS KMS keys, allowing fine-grained key access control and audit trails via CloudTrail. Bucket policies restricting access to specific IAM roles enforce least-privilege access, ensuring only authorized SageMaker roles and pipelines can read training data.",
    tags: ["s3", "security", "encryption", "iam"],
  },
  {
    id: "mls-qq-13",
    service: "Amazon S3 for ML",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A data scientist accidentally overwrites a critical training dataset in S3. Which S3 feature allows recovery of the previous version?",
    options: [
      "S3 Replication",
      "S3 Versioning",
      "S3 Object Lock",
      "S3 Lifecycle policies",
    ],
    correctIndices: [1],
    explanation:
      "S3 Versioning keeps all versions of every object. When versioning is enabled, overwrites create a new version rather than deleting the old one, allowing you to retrieve or restore any previous version of a dataset.",
    tags: ["s3", "versioning", "data-recovery"],
  },

  // ── AWS Glue ─────────────────────────────────────────────────────────────────
  {
    id: "mls-qq-14",
    service: "AWS Glue",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is the primary purpose of the AWS Glue Data Catalog?",
    options: [
      "To run ETL jobs on large datasets",
      "To store and manage metadata about datasets across AWS services",
      "To stream data from Kinesis into S3",
      "To train machine learning models on structured data",
    ],
    correctIndices: [1],
    explanation:
      "The AWS Glue Data Catalog is a centralized metadata repository. It stores table definitions, schemas, and partition information discovered by Glue Crawlers, making data discoverable by Athena, EMR, Redshift Spectrum, and SageMaker.",
    tags: ["glue", "data-catalog", "metadata"],
  },
  {
    id: "mls-qq-15",
    service: "AWS Glue",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "An ML engineer needs to transform raw JSON logs in S3 into Parquet format for use in SageMaker training. Which AWS Glue component performs this transformation?",
    options: [
      "Glue Crawler",
      "Glue Data Catalog",
      "Glue ETL Job",
      "Glue DataBrew",
    ],
    correctIndices: [2],
    explanation:
      "Glue ETL Jobs run Apache Spark or Python Shell scripts to transform, clean, and move data between sources. You define the transformation logic, and Glue manages the serverless Spark infrastructure.",
    tags: ["glue", "etl", "spark", "parquet"],
  },
  {
    id: "mls-qq-16",
    service: "AWS Glue",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS Glue feature allows non-technical users to visually clean and normalize data without writing code?",
    options: [
      "Glue Crawler",
      "Glue ETL Jobs",
      "Glue DataBrew",
      "Glue Elastic Views",
    ],
    correctIndices: [2],
    explanation:
      "Glue DataBrew is a visual data preparation tool that allows analysts and data scientists to clean and normalize data using over 250 pre-built transformations without writing any code, significantly accelerating the data preparation phase of ML projects.",
    tags: ["glue", "databrew", "data-preparation"],
  },
  {
    id: "mls-qq-17",
    service: "AWS Glue",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What does a Glue Crawler do?",
    options: [
      "It runs ETL transformations on data stored in S3",
      "It streams real-time data into the Glue Data Catalog",
      "It automatically discovers and catalogs the schema of data stored in S3 or databases",
      "It trains machine learning models on structured datasets",
    ],
    correctIndices: [2],
    explanation:
      "A Glue Crawler scans data sources (S3, JDBC databases, etc.), infers schemas, and populates the Glue Data Catalog with table definitions and partition metadata automatically, without requiring manual schema definition.",
    tags: ["glue", "crawler", "schema", "data-catalog"],
  },
  {
    id: "mls-qq-18",
    service: "AWS Glue",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO AWS Glue features work together to enable serverless SQL queries on data stored in S3?",
    options: [
      "Glue Data Catalog",
      "Glue ETL Jobs",
      "Amazon Athena",
      "Glue DataBrew",
      "AWS Batch",
    ],
    correctIndices: [0, 2],
    explanation:
      "Athena uses the Glue Data Catalog as its metadata store. The Crawler populates the Catalog with table schemas from S3 data, and Athena queries that data using standard SQL — all serverless with no infrastructure to manage.",
    tags: ["glue", "athena", "data-catalog", "serverless"],
  },
  {
    id: "mls-qq-19",
    service: "AWS Glue",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A Glue ETL job needs to process 5 TB of data daily. Which Glue feature allows you to scale the job by adjusting the number of distributed processing units?",
    options: [
      "Glue Triggers",
      "Glue Workflows",
      "Glue DPUs (Data Processing Units)",
      "Glue Bookmarks",
    ],
    correctIndices: [2],
    explanation:
      "Glue ETL jobs scale by specifying the number of DPUs (Data Processing Units). Each DPU provides 4 vCPUs and 16 GB of memory. Increasing DPUs allows Glue to process larger datasets faster by distributing the Spark workload across more nodes.",
    tags: ["glue", "dpu", "scaling", "etl"],
  },

  // ── Amazon Kinesis ───────────────────────────────────────────────────────────
  {
    id: "mls-qq-20",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Which Kinesis service is designed for real-time stream processing with SQL queries?",
    options: [
      "Kinesis Data Streams",
      "Kinesis Data Firehose",
      "Kinesis Data Analytics",
      "Kinesis Video Streams",
    ],
    correctIndices: [2],
    explanation:
      "Kinesis Data Analytics allows you to run SQL or Apache Flink code on streaming data in real time. It reads from Kinesis Data Streams or Firehose and outputs results to destinations like S3, Redshift, or Lambda.",
    tags: ["kinesis", "analytics", "sql", "real-time"],
  },
  {
    id: "mls-qq-21",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company needs to load streaming clickstream data into Amazon S3 for ML training with minimal operational overhead. Which Kinesis service handles this automatically?",
    options: [
      "Kinesis Data Streams",
      "Kinesis Data Firehose",
      "Kinesis Data Analytics",
      "Kinesis Video Streams",
    ],
    correctIndices: [1],
    explanation:
      "Kinesis Data Firehose is a fully managed service that automatically buffers, transforms, and delivers streaming data to destinations like S3, Redshift, OpenSearch, and Splunk with no administration required.",
    tags: ["kinesis", "firehose", "s3", "streaming"],
  },
  {
    id: "mls-qq-22",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "How is Kinesis Data Streams capacity measured, and what determines throughput limits?",
    options: [
      "By the number of consumers; each consumer adds 1 MB/s of throughput",
      "By shards; each shard provides 1 MB/s ingest and 2 MB/s read throughput",
      "By the record size; larger records automatically provision more throughput",
      "By DPUs; each DPU provides 10 MB/s of throughput",
    ],
    correctIndices: [1],
    explanation:
      "Kinesis Data Streams capacity is defined by shards. Each shard supports up to 1 MB/s or 1,000 records/s for writes, and up to 2 MB/s for reads. To scale throughput, you add more shards by resharding the stream.",
    tags: ["kinesis", "shards", "throughput", "scaling"],
  },
  {
    id: "mls-qq-23",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "An ML pipeline needs to invoke a SageMaker real-time endpoint for each record in a Kinesis Data Stream as it arrives. Which approach is correct?",
    options: [
      "Configure Kinesis Data Firehose to call the SageMaker endpoint directly",
      "Use Kinesis Data Analytics with a Lambda function as the destination to invoke the endpoint",
      "Use an AWS Lambda function with a Kinesis trigger to invoke the SageMaker endpoint per record",
      "Configure Kinesis Data Streams to natively forward records to SageMaker",
    ],
    correctIndices: [2],
    explanation:
      "Lambda supports Kinesis Data Streams as an event source. Lambda polls the stream, batches records, and invokes your function. Your function then calls the SageMaker InvokeEndpoint API. This is the standard pattern for real-time ML inference on streaming data.",
    tags: ["kinesis", "lambda", "sagemaker", "real-time"],
  },
  {
    id: "mls-qq-24",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What is the default data retention period for records in Kinesis Data Streams?",
    options: ["1 hour", "24 hours", "7 days", "30 days"],
    correctIndices: [1],
    explanation:
      "Kinesis Data Streams retains records for 24 hours by default. You can extend retention up to 365 days (at additional cost). This allows consumers that fall behind to replay and reprocess records.",
    tags: ["kinesis", "retention", "data-streams"],
  },
  {
    id: "mls-qq-25",
    service: "Amazon Kinesis",
    domain: "services",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO destinations can Kinesis Data Firehose deliver data to natively?",
    options: [
      "Amazon S3",
      "Amazon SageMaker Training Jobs",
      "Amazon Redshift",
      "AWS Glue Data Catalog",
      "Amazon ECS",
    ],
    correctIndices: [0, 2],
    explanation:
      "Kinesis Data Firehose natively delivers to Amazon S3, Amazon Redshift (via S3 staging), Amazon OpenSearch Service, and Splunk. S3 and Redshift are the most common ML destinations for batch training data.",
    tags: ["kinesis", "firehose", "s3", "redshift"],
  },

  // ── Amazon EMR ───────────────────────────────────────────────────────────────
  {
    id: "mls-qq-26",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon EMR primarily used for in ML data pipelines?",
    options: [
      "Hosting trained ML models for inference",
      "Processing and transforming large datasets using Apache Spark, Hive, and Hadoop",
      "Streaming real-time data from IoT devices",
      "Storing model artifacts and training checkpoints",
    ],
    correctIndices: [1],
    explanation:
      "Amazon EMR (Elastic MapReduce) is a managed big data platform that runs Apache Spark, Hive, Hadoop, and other frameworks for large-scale data processing, transformation, and feature engineering before ML training.",
    tags: ["emr", "spark", "hadoop", "data-processing"],
  },
  {
    id: "mls-qq-27",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which EMR cluster node type manages job scheduling and cluster metadata, and should never run task workloads?",
    options: ["Core nodes", "Task nodes", "Master node", "Edge nodes"],
    correctIndices: [2],
    explanation:
      "The Master node (Primary node in newer EMR versions) manages cluster resources, schedules YARN jobs, and coordinates HDFS. It does not run user tasks. Core nodes store HDFS data and run tasks; Task nodes run tasks only (no HDFS).",
    tags: ["emr", "master-node", "cluster-architecture"],
  },
  {
    id: "mls-qq-28",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company runs nightly Spark jobs on EMR that process data for 3 hours. Which purchasing strategy minimizes cost?",
    options: [
      "On-Demand instances for all nodes",
      "Reserved Instances for master and core nodes, Spot Instances for task nodes",
      "Spot Instances for all nodes including the master",
      "Dedicated Hosts for all nodes",
    ],
    correctIndices: [1],
    explanation:
      "Using Reserved or On-Demand instances for master and core nodes ensures cluster stability (core nodes hold HDFS data). Task nodes, which only run compute, can safely use Spot Instances since their interruption does not cause data loss, reducing overall cost significantly.",
    tags: ["emr", "spot", "cost-optimization", "reserved"],
  },
  {
    id: "mls-qq-29",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "What is EMR on EKS, and what advantage does it provide over traditional EMR clusters?",
    options: [
      "EMR on EKS runs Spark jobs inside Docker containers on EC2, reducing startup time",
      "EMR on EKS allows Spark workloads to run on Kubernetes, enabling shared infrastructure with other containerized workloads",
      "EMR on EKS automatically migrates Hadoop jobs to SageMaker Training Jobs",
      "EMR on EKS provides a fully serverless Spark environment with per-second billing",
    ],
    correctIndices: [1],
    explanation:
      "EMR on EKS submits Spark jobs to an Amazon EKS (Kubernetes) cluster. This allows ML and data teams to share the same Kubernetes infrastructure with other workloads, improve resource utilization, and manage Spark alongside other containerized services using standard Kubernetes tooling.",
    tags: ["emr", "eks", "kubernetes", "spark"],
  },
  {
    id: "mls-qq-30",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Which storage option allows EMR to read and write data from S3 instead of HDFS, enabling stateless clusters?",
    options: ["EMRFS", "Instance Store", "Amazon EFS", "Amazon EBS"],
    correctIndices: [0],
    explanation:
      "EMRFS (EMR File System) is an implementation of HDFS that reads and writes data directly from Amazon S3. Using EMRFS allows clusters to be terminated after each job without losing data, enabling stateless, cost-efficient transient clusters.",
    tags: ["emr", "emrfs", "s3", "stateless"],
  },
  {
    id: "mls-qq-31",
    service: "Amazon EMR",
    domain: "services",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO frameworks can Amazon EMR run natively for large-scale ML feature engineering?",
    options: [
      "Apache Spark",
      "TensorFlow Serving",
      "Apache Hive",
      "NGINX",
      "Docker Compose",
    ],
    correctIndices: [0, 2],
    explanation:
      "EMR natively supports Apache Spark (for distributed data processing and MLlib) and Apache Hive (for SQL-based transformations on large datasets). Both are commonly used for feature engineering at scale before SageMaker training.",
    tags: ["emr", "spark", "hive", "feature-engineering"],
  },

  // ── Amazon Rekognition ───────────────────────────────────────────────────────
  {
    id: "mls-qq-32",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What type of AI service is Amazon Rekognition, and what inputs does it accept?",
    options: [
      "A text analysis service that accepts JSON documents",
      "A computer vision service that analyzes images and videos",
      "A speech recognition service that analyzes audio files",
      "A recommendation service that analyzes user behavior",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Rekognition is a managed computer vision service. It analyzes images and videos to detect objects, scenes, faces, text, unsafe content, and activities without requiring ML expertise.",
    tags: ["rekognition", "computer-vision", "images", "video"],
  },
  {
    id: "mls-qq-33",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A security company needs to compare a person's face against a database of 10 million known faces in real time. Which Rekognition feature handles this?",
    options: [
      "DetectFaces",
      "CompareFaces",
      "SearchFacesByImage using a Rekognition Collection",
      "IndexFaces with a local database",
    ],
    correctIndices: [2],
    explanation:
      "Rekognition Collections store face vectors indexed from images. SearchFacesByImage compares a query face against the collection at sub-second speed even at millions of faces, making it suitable for real-time identity verification and access control.",
    tags: ["rekognition", "face-search", "collection", "identity"],
  },
  {
    id: "mls-qq-34",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which Rekognition feature can detect personal protective equipment (PPE) on workers in images?",
    options: [
      "DetectLabels",
      "DetectProtectiveEquipment",
      "DetectModerationLabels",
      "RecognizeCelebrities",
    ],
    correctIndices: [1],
    explanation:
      "DetectProtectiveEquipment identifies PPE such as face covers, hand covers, and head covers on persons in images. It is used in workplace safety applications to automate compliance checking.",
    tags: ["rekognition", "ppe", "safety", "labels"],
  },
  {
    id: "mls-qq-35",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A media company needs to automatically flag inappropriate content in user-uploaded images. Which Rekognition API should they use?",
    options: [
      "DetectLabels",
      "DetectFaces",
      "DetectModerationLabels",
      "DetectText",
    ],
    correctIndices: [2],
    explanation:
      "DetectModerationLabels identifies potentially unsafe or inappropriate content in images, including explicit adult content, violence, and disturbing imagery, with a confidence score for each detected category.",
    tags: ["rekognition", "moderation", "content-safety"],
  },
  {
    id: "mls-qq-36",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A retail company wants to train a custom Rekognition model to detect their proprietary product line from images. Which Rekognition feature enables this?",
    options: [
      "Rekognition Labels",
      "Rekognition Custom Labels",
      "Rekognition Celebrities",
      "Rekognition Face Collections",
    ],
    correctIndices: [1],
    explanation:
      "Rekognition Custom Labels allows you to train a custom image classification or object detection model using your own labeled images, without deep ML expertise. The model is served through the same Rekognition API infrastructure.",
    tags: ["rekognition", "custom-labels", "fine-tuning"],
  },

  // ── Amazon Comprehend ─────────────────────────────────────────────────────────
  {
    id: "mls-qq-37",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon Comprehend primarily used for?",
    options: [
      "Translating text between languages",
      "Converting speech to text",
      "Natural language processing tasks like sentiment analysis and entity recognition",
      "Generating images from text descriptions",
    ],
    correctIndices: [2],
    explanation:
      "Amazon Comprehend is a managed NLP service that analyzes text to detect sentiment, extract key phrases and entities, classify documents, and identify the dominant language — without requiring ML expertise.",
    tags: ["comprehend", "nlp", "sentiment", "entities"],
  },
  {
    id: "mls-qq-38",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A healthcare company needs to identify and redact patient names and medical record numbers from clinical notes. Which Comprehend feature is specifically designed for healthcare text?",
    options: [
      "Comprehend Custom Classification",
      "Comprehend Detect Entities",
      "Comprehend Medical",
      "Comprehend PII Detection",
    ],
    correctIndices: [2],
    explanation:
      "Comprehend Medical is purpose-built for healthcare text. It identifies medical entities such as medications, diagnoses, procedures, anatomy, and protected health information (PHI) — structured for HIPAA-regulated workflows.",
    tags: ["comprehend", "medical", "phi", "healthcare"],
  },
  {
    id: "mls-qq-39",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which Comprehend feature allows you to train a custom model to categorize documents into your own defined categories?",
    options: [
      "Custom Entity Recognition",
      "Custom Classification",
      "Topic Modeling",
      "Key Phrase Extraction",
    ],
    correctIndices: [1],
    explanation:
      "Comprehend Custom Classification lets you train a multi-class or multi-label document classifier on your labeled examples. Once trained, the model can categorize incoming documents into your business-specific categories automatically.",
    tags: ["comprehend", "custom-classification", "nlp"],
  },
  {
    id: "mls-qq-40",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What sentiment values does Comprehend's DetectSentiment API return?",
    options: [
      "Happy, Sad, Angry, Neutral",
      "Positive, Negative, Mixed, Neutral",
      "Like, Dislike, Unknown",
      "1-5 star rating with confidence score",
    ],
    correctIndices: [1],
    explanation:
      "Comprehend's DetectSentiment returns one of four sentiment labels — Positive, Negative, Mixed, or Neutral — along with confidence scores for each. Mixed indicates the text contains both positive and negative signals.",
    tags: ["comprehend", "sentiment", "nlp"],
  },
  {
    id: "mls-qq-41",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO Comprehend capabilities can help a company identify sensitive customer information in support ticket text?",
    options: [
      "PII Entity Detection",
      "Topic Modeling",
      "Custom Entity Recognition",
      "Key Phrase Extraction",
      "Syntax Analysis",
    ],
    correctIndices: [0, 2],
    explanation:
      "PII Entity Detection identifies built-in sensitive types like credit card numbers, SSNs, and email addresses. Custom Entity Recognition lets you define and detect domain-specific entities like internal account IDs or proprietary identifiers not covered by built-in PII types.",
    tags: ["comprehend", "pii", "custom-entities", "security"],
  },

  // ── Amazon Translate ──────────────────────────────────────────────────────────
  {
    id: "mls-qq-42",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What is Amazon Translate and how does it integrate with ML pipelines?",
    options: [
      "A speech-to-text service that transcribes audio in multiple languages",
      "A neural machine translation service that translates text between languages",
      "A text-to-speech service that converts translated text to audio",
      "A language detection service that identifies the language of text",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Translate is a neural machine translation service that converts text between over 75 languages. In ML pipelines it is used to localize training data, standardize multilingual datasets to a single language, or build multilingual applications.",
    tags: ["translate", "nlp", "multilingual"],
  },
  {
    id: "mls-qq-43",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to ensure that their brand-specific terminology is always translated consistently. Which Translate feature supports this?",
    options: [
      "Active Custom Translation",
      "Custom Terminology",
      "Parallel Data",
      "Language Detection",
    ],
    correctIndices: [1],
    explanation:
      "Custom Terminology allows you to define a glossary of terms and their translations. Translate respects these overrides during translation, ensuring brand names, product names, and technical terms are always rendered consistently.",
    tags: ["translate", "custom-terminology", "localization"],
  },
  {
    id: "mls-qq-44",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which Translate feature allows you to fine-tune translation output style using examples of your preferred translations?",
    options: [
      "Custom Terminology",
      "Parallel Data (Active Custom Translation)",
      "Batch Translation",
      "Language Auto-detection",
    ],
    correctIndices: [1],
    explanation:
      "Parallel Data (used with Active Custom Translation) lets you provide examples of source-target sentence pairs representing your preferred translation style. Translate learns from these examples to match your domain-specific style and vocabulary.",
    tags: ["translate", "parallel-data", "fine-tuning"],
  },
  {
    id: "mls-qq-45",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "A company needs to translate 5 million product descriptions stored in S3 overnight. Which Translate mode is most appropriate?",
    options: [
      "Real-time translation API",
      "Batch translation jobs",
      "Streaming translation",
      "Edge translation",
    ],
    correctIndices: [1],
    explanation:
      "Translate Batch translation jobs process large volumes of documents stored in S3 asynchronously. They are ideal for high-volume, non-interactive translation workloads where results do not need to be returned immediately.",
    tags: ["translate", "batch", "s3"],
  },

  // ── Amazon Polly & Transcribe ─────────────────────────────────────────────────
  {
    id: "mls-qq-46",
    service: "Amazon Polly & Transcribe",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What is the difference between Amazon Polly and Amazon Transcribe?",
    options: [
      "Polly translates text; Transcribe detects language",
      "Polly converts text to speech; Transcribe converts speech to text",
      "Polly analyzes sentiment in audio; Transcribe generates audio from text",
      "Polly identifies speakers; Transcribe synthesizes voices",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Polly is a text-to-speech service that converts written text into natural-sounding audio. Amazon Transcribe is a speech-to-text service that converts audio recordings into text transcripts. They serve opposite directions of audio/text conversion.",
    tags: ["polly", "transcribe", "speech", "tts"],
  },
  {
    id: "mls-qq-47",
    service: "Amazon Polly & Transcribe",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A call center wants to automatically identify which agent is speaking in a recorded conversation. Which Transcribe feature enables this?",
    options: [
      "Vocabulary filtering",
      "Speaker diarization",
      "Channel identification",
      "Custom vocabulary",
    ],
    correctIndices: [1],
    explanation:
      "Speaker diarization (also called speaker identification) in Transcribe segments a transcript by speaker, labeling each portion with a speaker ID. This is essential for call center analytics where identifying agent versus customer speech is required.",
    tags: ["transcribe", "diarization", "speaker", "call-center"],
  },
  {
    id: "mls-qq-48",
    service: "Amazon Polly & Transcribe",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which Polly feature allows you to control pronunciation, speed, volume, and pauses in synthesized speech?",
    options: [
      "Neural TTS",
      "Speech Marks",
      "SSML (Speech Synthesis Markup Language)",
      "Custom Lexicons",
    ],
    correctIndices: [2],
    explanation:
      "SSML (Speech Synthesis Markup Language) is an XML-based markup language that lets you fine-tune Polly's speech output, controlling pronunciation, rate, pitch, volume, pauses, and emphasis at a granular level.",
    tags: ["polly", "ssml", "tts", "speech-control"],
  },
  {
    id: "mls-qq-49",
    service: "Amazon Polly & Transcribe",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A company needs to transcribe medical consultations accurately, including domain-specific terminology. Which Transcribe feature improves accuracy for specialized vocabularies?",
    options: [
      "Automatic language identification",
      "Speaker diarization",
      "Custom vocabulary",
      "Vocabulary filtering",
    ],
    correctIndices: [2],
    explanation:
      "Custom vocabulary in Transcribe allows you to provide a list of domain-specific words (medical terms, drug names, acronyms) with optional pronunciation hints. Transcribe uses these to improve recognition accuracy for specialized terms not in its default vocabulary.",
    tags: ["transcribe", "custom-vocabulary", "medical", "accuracy"],
  },
  {
    id: "mls-qq-50",
    service: "Amazon Polly & Transcribe",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Which Polly voice type uses a neural text-to-speech engine and is the standard recommendation for customer-facing applications?",
    options: [
      "Standard voices",
      "Neural voices",
      "Conversational voices",
      "Long-form voices",
    ],
    correctIndices: [1],
    explanation:
      "Neural voices use Amazon's NTTS (Neural Text-to-Speech) engine and produce significantly more natural, human-like speech than standard (concatenative) voices — making them the recommended choice for customer-facing applications. Long-form voices are a newer specialized engine optimized for narrating lengthy content (articles, books); for the MLS-C01 exam, Neural voices is the expected correct answer for general high-quality TTS.",
    tags: ["polly", "neural-tts", "voices"],
  },

  // ── Amazon Forecast ───────────────────────────────────────────────────────────
  {
    id: "mls-qq-51",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What type of problem does Amazon Forecast solve?",
    options: [
      "Image classification using historical pixel data",
      "Time-series forecasting for metrics like demand, revenue, or inventory",
      "Natural language understanding of customer reviews",
      "Anomaly detection in network traffic logs",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Forecast is a managed time-series forecasting service that uses machine learning to predict future values of metrics such as product demand, sales revenue, staffing levels, and inventory needs based on historical data.",
    tags: ["forecast", "time-series", "demand-planning"],
  },
  {
    id: "mls-qq-52",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which dataset type in Amazon Forecast includes external variables like promotions and holidays that influence demand?",
    options: [
      "Target Time Series",
      "Related Time Series",
      "Item Metadata",
      "Historical Time Series",
    ],
    correctIndices: [1],
    explanation:
      "Related Time Series datasets contain external variables that are known in advance and correlated with the target metric, such as promotional events, holidays, or economic indicators. These features improve forecast accuracy.",
    tags: ["forecast", "related-time-series", "features"],
  },
  {
    id: "mls-qq-53",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What is Amazon Forecast AutoPredictor and why is it recommended over manual predictor selection?",
    options: [
      "AutoPredictor automatically scales Forecast to multiple AWS regions",
      "AutoPredictor automatically selects and ensembles the best algorithms for your data, typically outperforming manually selected predictors",
      "AutoPredictor retrains the model daily with new data automatically",
      "AutoPredictor generates synthetic training data when historical data is insufficient",
    ],
    correctIndices: [1],
    explanation:
      "AutoPredictor evaluates multiple forecasting algorithms (DeepAR+, Prophet, NPTS, and others) and ensembles them using a combination strategy. It consistently outperforms manually selected single algorithms and is the recommended approach for most Forecast use cases.",
    tags: ["forecast", "autopredictor", "ensemble", "algorithms"],
  },
  {
    id: "mls-qq-54",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A retailer needs probabilistic demand forecasts (P10, P50, P90) rather than a single point estimate. How does Forecast support this?",
    options: [
      "Forecast only generates P50 (median) estimates by default",
      "Quantile forecasts are generated automatically and can be queried for any percentile",
      "Probabilistic forecasts require a separate SageMaker model",
      "Confidence intervals must be manually computed from the mean and standard deviation outputs",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Forecast generates quantile forecasts (P10, P50, P90, and custom percentiles) automatically for each predictor. Retailers use P10 for aggressive low-stock scenarios and P90 for buffer-stock scenarios, allowing risk-adjusted inventory decisions.",
    tags: ["forecast", "quantile", "probabilistic", "inventory"],
  },
  {
    id: "mls-qq-55",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What is the minimum amount of historical data required to start using Amazon Forecast?",
    options: [
      "1 week of data points",
      "300 data points per time series",
      "5 years of historical data",
      "At least 1 million records",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Forecast requires at least 300 historical data points per time series for the algorithms to learn patterns effectively. For shorter histories, Forecast may still run but with reduced accuracy.",
    tags: ["forecast", "data-requirements", "time-series"],
  },

  // ── Amazon Personalize ────────────────────────────────────────────────────────
  {
    id: "mls-qq-56",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon Personalize designed to do?",
    options: [
      "Detect faces and recognize celebrities in media content",
      "Build real-time personalized recommendation systems using ML",
      "Translate product descriptions into multiple languages",
      "Forecast inventory demand for retail businesses",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Personalize is a fully managed ML service for building real-time personalization and recommendation systems. It uses the same technology powering Amazon.com recommendations to deliver personalized item recommendations, rankings, and user segments.",
    tags: ["personalize", "recommendations", "real-time"],
  },
  {
    id: "mls-qq-57",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which Personalize dataset type records user actions like clicks, purchases, and views?",
    options: [
      "Users dataset",
      "Items dataset",
      "Interactions dataset",
      "Events dataset",
    ],
    correctIndices: [2],
    explanation:
      "The Interactions dataset is the most important dataset in Personalize. It records historical user-item interaction events (impressions, clicks, purchases, ratings) that the model learns behavioral patterns from.",
    tags: ["personalize", "interactions", "dataset"],
  },
  {
    id: "mls-qq-58",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A streaming service wants to display the top 25 movies most relevant to each user's taste. Which Personalize use case recipe is appropriate?",
    options: [
      "Similar Items (SIMS)",
      "User Personalization",
      "Personalized Ranking",
      "Popularity Count",
    ],
    correctIndices: [1],
    explanation:
      "User Personalization (the aws-user-personalization recipe) generates a personalized ranked list of items for each user. It considers the user's interaction history and contextual signals to recommend items the specific user is most likely to engage with.",
    tags: ["personalize", "user-personalization", "recommendations"],
  },
  {
    id: "mls-qq-59",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "How does Amazon Personalize handle the cold-start problem for new users with no interaction history?",
    options: [
      "It refuses to generate recommendations until the user has at least 5 interactions",
      "It falls back to popularity-based recommendations and incorporates real-time events as they arrive",
      "It asks the user to fill in a preference survey before generating recommendations",
      "It uses demographic data exclusively for new users",
    ],
    correctIndices: [1],
    explanation:
      "For users with no history (cold-start), Personalize falls back to popular items. As the user generates interaction events (which can be streamed in real time using the PutEvents API), recommendations personalize progressively within the same session.",
    tags: ["personalize", "cold-start", "real-time-events"],
  },
  {
    id: "mls-qq-60",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What does the Similar Items (SIMS) recipe in Personalize return?",
    options: [
      "A ranked list of items personalized for a specific user",
      "A list of items frequently interacted with together by similar users",
      "A list of trending items popular across all users",
      "A user segment based on shared behavioral patterns",
    ],
    correctIndices: [1],
    explanation:
      "The Similar Items (SIMS) recipe returns items that are frequently co-interacted with the query item by similar users. It powers 'customers who bought this also bought' style recommendations.",
    tags: ["personalize", "sims", "item-similarity"],
  },

  // ── AWS Lake Formation ────────────────────────────────────────────────────────
  {
    id: "mls-qq-61",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is the primary purpose of AWS Lake Formation?",
    options: [
      "To run distributed Spark jobs on large datasets",
      "To simplify building, securing, and managing data lakes on S3",
      "To stream real-time data into S3 from IoT devices",
      "To train machine learning models using S3 data",
    ],
    correctIndices: [1],
    explanation:
      "AWS Lake Formation simplifies the process of building and managing data lakes on Amazon S3. It centralizes access control, automates data ingestion and cataloging, and provides fine-grained column- and row-level security for data stored in S3.",
    tags: ["lake-formation", "data-lake", "s3", "governance"],
  },
  {
    id: "mls-qq-62",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which Lake Formation feature allows you to grant access to specific columns of a table, hiding sensitive columns from unauthorized users?",
    options: [
      "Row-level security",
      "Column-level security",
      "Data filters",
      "Tag-based access control",
    ],
    correctIndices: [1],
    explanation:
      "Column-level security in Lake Formation allows data lake administrators to restrict access to specific columns within a Glue Data Catalog table. Unauthorized users see only the permitted columns when querying via Athena or other Lake Formation-integrated services.",
    tags: ["lake-formation", "column-security", "access-control"],
  },
  {
    id: "mls-qq-63",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "How does Lake Formation complement the AWS Glue Data Catalog?",
    options: [
      "Lake Formation replaces the Glue Data Catalog with its own metadata store",
      "Lake Formation uses the Glue Data Catalog as its metadata repository and adds centralized access control on top",
      "Lake Formation runs ETL jobs that populate the Glue Data Catalog",
      "Lake Formation exports the Glue Data Catalog to external databases",
    ],
    correctIndices: [1],
    explanation:
      "Lake Formation builds on top of the Glue Data Catalog. The Catalog holds metadata; Lake Formation adds a centralized permission layer that controls who can access which databases, tables, columns, and rows across all Lake Formation-registered services.",
    tags: ["lake-formation", "glue", "data-catalog", "permissions"],
  },
  {
    id: "mls-qq-64",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A company needs to allow data analysts to query a table but only see rows where the region column matches their own business unit. Which Lake Formation feature enables this?",
    options: [
      "Column-level security",
      "Tag-based access control (LF-TBAC)",
      "Data filters (row-level security)",
      "Resource-based policies",
    ],
    correctIndices: [2],
    explanation:
      "Data filters in Lake Formation implement row-level security. You define a filter expression (e.g., `region = 'APAC'`) and associate it with a principal's grant, so when they query the table they only see rows matching the filter.",
    tags: ["lake-formation", "row-level-security", "data-filters"],
  },
  {
    id: "mls-qq-65",
    service: "AWS Lake Formation",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Which service works directly with Lake Formation to provide serverless SQL queries on the data lake?",
    options: [
      "Amazon Redshift",
      "Amazon Athena",
      "Amazon EMR only",
      "AWS Glue ETL jobs",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Athena is natively integrated with Lake Formation. When a user runs an Athena query, Lake Formation enforces the column, row, and table-level permissions defined in its centralized access control layer before returning results.",
    tags: ["lake-formation", "athena", "sql", "serverless"],
  },

  // ── Amazon Athena ─────────────────────────────────────────────────────────────
  {
    id: "mls-qq-66",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What is Amazon Athena and how does it differ from traditional databases?",
    options: [
      "A managed relational database that stores structured data in table rows",
      "A serverless query service that analyzes data in S3 using SQL with no infrastructure to manage",
      "A distributed in-memory cache that speeds up repeated SQL queries",
      "A data warehouse that requires data to be loaded and indexed before querying",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Athena is a serverless interactive query service. You write SQL queries against data stored directly in S3 — no loading, no infrastructure provisioning, no cluster management. You pay only for the data scanned per query.",
    tags: ["athena", "serverless", "sql", "s3"],
  },
  {
    id: "mls-qq-67",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which data format significantly reduces the amount of data scanned by Athena queries, lowering cost?",
    options: [
      "CSV with gzip compression",
      "JSON with line-delimited encoding",
      "Apache Parquet or ORC (columnar formats)",
      "XML with schema validation",
    ],
    correctIndices: [2],
    explanation:
      "Parquet and ORC are columnar formats — Athena only reads the specific columns referenced in the query, dramatically reducing data scanned. Combined with partitioning, columnar formats can reduce query costs by 60-90% compared to CSV.",
    tags: ["athena", "parquet", "orc", "cost-optimization"],
  },
  {
    id: "mls-qq-68",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "How does S3 partitioning improve Athena query performance?",
    options: [
      "Partitioning compresses data so Athena reads less bytes",
      "Partitioning organizes data into directories by partition key, allowing Athena to skip irrelevant partitions entirely",
      "Partitioning indexes data in Athena's metadata store for faster lookups",
      "Partitioning distributes queries across multiple Athena workers automatically",
    ],
    correctIndices: [1],
    explanation:
      "When data is partitioned (e.g., by year/month/day), Athena reads only the S3 prefixes matching the WHERE clause filters. This partition pruning avoids scanning irrelevant data, reducing both query time and cost.",
    tags: ["athena", "partitioning", "s3", "performance"],
  },
  {
    id: "mls-qq-69",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A data scientist needs to run feature engineering SQL queries repeatedly on the same dataset. Which Athena feature helps avoid re-reading the same data?",
    options: [
      "Athena Workgroups",
      "Athena Query Result Reuse",
      "Athena Federated Query",
      "Athena Named Queries",
    ],
    correctIndices: [1],
    explanation:
      "Athena Query Result Reuse caches query results for up to 7 days. If an identical query is run again within the cache window, Athena returns results from cache at no additional scanning cost, ideal for repeated exploratory queries.",
    tags: ["athena", "query-reuse", "caching", "cost"],
  },
  {
    id: "mls-qq-70",
    service: "Amazon Athena",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What does Athena Federated Query allow you to do?",
    options: [
      "Run SQL queries across data sources beyond S3, such as RDS, DynamoDB, and on-premises databases",
      "Federate Athena results to multiple S3 buckets simultaneously",
      "Run the same query across multiple AWS accounts at once",
      "Distribute a single large query across multiple Athena clusters",
    ],
    correctIndices: [0],
    explanation:
      "Athena Federated Query uses Lambda-based connectors to query data in sources outside S3, including RDS, DynamoDB, Redshift, and on-premises databases. This allows joining data across multiple sources in a single SQL query.",
    tags: ["athena", "federated-query", "multi-source"],
  },

  // ── Amazon Redshift ───────────────────────────────────────────────────────────
  {
    id: "mls-qq-71",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What type of database is Amazon Redshift and what is it optimized for?",
    options: [
      "A row-based relational database optimized for OLTP (transactional) workloads",
      "A columnar data warehouse optimized for OLAP (analytical) queries on large datasets",
      "A key-value store optimized for sub-millisecond read/write operations",
      "A document database optimized for semi-structured JSON data",
    ],
    correctIndices: [1],
    explanation:
      "Amazon Redshift is a columnar, massively parallel processing (MPP) data warehouse designed for OLAP workloads. It excels at running complex analytical queries over petabytes of structured data, making it a common ML feature store for structured data.",
    tags: ["redshift", "data-warehouse", "olap", "columnar"],
  },
  {
    id: "mls-qq-72",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which Redshift feature allows you to query data directly in S3 without loading it into Redshift?",
    options: [
      "Redshift COPY command",
      "Redshift Spectrum",
      "Redshift Federated Query",
      "Redshift Data Sharing",
    ],
    correctIndices: [1],
    explanation:
      "Redshift Spectrum pushes query processing down to a separate, scalable layer that reads data directly from S3. This allows joining Redshift data with cold data in the data lake without loading it into Redshift cluster storage.",
    tags: ["redshift", "spectrum", "s3", "data-lake"],
  },
  {
    id: "mls-qq-73",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "What is Redshift ML and how does it integrate with SageMaker?",
    options: [
      "Redshift ML is a SageMaker feature that imports data from Redshift for training",
      "Redshift ML allows you to train and invoke SageMaker models using SQL statements directly within Redshift",
      "Redshift ML exports trained model artifacts to S3 for SageMaker deployment",
      "Redshift ML is a built-in anomaly detection feature for Redshift performance metrics",
    ],
    correctIndices: [1],
    explanation:
      "Redshift ML allows data analysts to create, train, and invoke ML models using SQL. Under the hood, it uses SageMaker Autopilot to train the model on data exported from Redshift, then makes the model available as a SQL function for scoring.",
    tags: ["redshift", "redshift-ml", "sagemaker", "autopilot"],
  },
  {
    id: "mls-qq-74",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Which Redshift distribution style stores a full copy of a table on every node, best for small dimension tables?",
    options: [
      "KEY distribution",
      "EVEN distribution",
      "ALL distribution",
      "AUTO distribution",
    ],
    correctIndices: [2],
    explanation:
      "ALL distribution replicates the entire table on every compute node. This eliminates data redistribution during joins and is ideal for small dimension tables used frequently in joins. Large tables should use KEY or EVEN distribution.",
    tags: ["redshift", "distribution-style", "performance"],
  },
  {
    id: "mls-qq-75",
    service: "Amazon Redshift",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO Redshift features help reduce storage costs and improve query performance for ML training data?",
    options: [
      "Columnar compression using encoding schemes",
      "Row-level security policies",
      "Automatic table sort keys",
      "Materialized views with auto-refresh",
      "VACUUM FULL operations",
    ],
    correctIndices: [0, 2],
    explanation:
      "Columnar compression encodes columns using schemes like ZSTD or AZ64, dramatically reducing storage footprint. Sort keys determine the physical sort order of data on disk, allowing range-restricted queries to skip blocks of data via zone maps — both directly improve query performance for ML feature queries.",
    tags: ["redshift", "compression", "sort-key", "performance"],
  },

  // ── ML Data Preparation ───────────────────────────────────────────────────────
  {
    id: "mls-qq-76",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question: "What is the purpose of feature scaling in machine learning?",
    options: [
      "To increase the number of features in the training dataset",
      "To bring numerical features to a comparable range, preventing features with large magnitudes from dominating",
      "To remove outliers from the training dataset automatically",
      "To split the dataset into training, validation, and test sets",
    ],
    correctIndices: [1],
    explanation:
      "Feature scaling normalizes numerical features to a similar range (e.g., 0-1 or zero mean/unit variance). Without scaling, features with large values (like salary in thousands) dominate gradient-based algorithms over features with small values (like age).",
    tags: ["data-preparation", "feature-scaling", "normalization"],
  },
  {
    id: "mls-qq-77",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A dataset has missing values in a numerical feature. Which imputation strategy is most appropriate when the feature has a skewed distribution?",
    options: [
      "Mean imputation",
      "Median imputation",
      "Mode imputation",
      "Dropping all rows with missing values",
    ],
    correctIndices: [1],
    explanation:
      "Median imputation is preferred over mean imputation for skewed distributions because the mean is sensitive to outliers. Median represents the central tendency more robustly when data is skewed or has extreme values.",
    tags: ["data-preparation", "missing-values", "imputation"],
  },
  {
    id: "mls-qq-78",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question: "What is one-hot encoding used for in ML data preparation?",
    options: [
      "Encrypting sensitive categorical features before training",
      "Converting categorical variables into binary indicator columns that ML algorithms can process",
      "Reducing the dimensionality of continuous numerical features",
      "Normalizing text data to lowercase before tokenization",
    ],
    correctIndices: [1],
    explanation:
      "One-hot encoding converts a categorical feature with n categories into n binary columns, one per category. This allows algorithms that require numerical input (like linear regression and neural networks) to work with categorical data without imposing an ordinal relationship.",
    tags: ["data-preparation", "one-hot-encoding", "categorical"],
  },
  {
    id: "mls-qq-79",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    question:
      "A training dataset has 95% negative examples and 5% positive examples. What technique helps address this class imbalance?",
    options: [
      "Feature normalization using min-max scaling",
      "SMOTE (oversampling the minority class) or adjusting class weights in the model",
      "Dropping the majority class entirely from the training set",
      "Increasing the learning rate to force the model to learn the minority class",
    ],
    correctIndices: [1],
    explanation:
      "Class imbalance causes models to bias toward the majority class. SMOTE synthesizes new minority-class examples to balance the dataset. Alternatively, increasing the penalty for misclassifying the minority class (class weights) achieves a similar effect without generating synthetic data.",
    tags: ["data-preparation", "class-imbalance", "smote", "oversampling"],
  },
  {
    id: "mls-qq-80",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO techniques reduce overfitting caused by high-dimensional feature spaces?",
    options: [
      "Principal Component Analysis (PCA)",
      "Feature augmentation",
      "L1 regularization (Lasso)",
      "Increasing batch size",
      "Adding more training epochs",
    ],
    correctIndices: [0, 2],
    explanation:
      "PCA reduces dimensionality by projecting features onto principal components, removing noise and correlated features. L1 regularization adds a penalty for the absolute value of weights, driving less important feature weights to zero — effectively performing automatic feature selection.",
    tags: ["data-preparation", "pca", "lasso", "dimensionality"],
  },
  {
    id: "mls-qq-81",
    service: "ML Data Preparation",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "What is the purpose of splitting data into training, validation, and test sets?",
    options: [
      "Training set trains the model; validation set tunes hyperparameters; test set provides unbiased final evaluation",
      "All three sets are used for training, and the best result is selected",
      "Training set trains the model; test set tunes hyperparameters; validation set is discarded",
      "Training and validation sets are interchangeable; the test set provides backup data",
    ],
    correctIndices: [0],
    explanation:
      "The training set fits model parameters. The validation set is used to compare models and tune hyperparameters without contaminating the final evaluation. The test set is held out completely and used only once to provide an unbiased estimate of final model performance.",
    tags: ["data-preparation", "train-test-split", "validation"],
  },

  // ── ML Model Training ──────────────────────────────────────────────────────────
  {
    id: "mls-qq-82",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question: "What is a hyperparameter in machine learning?",
    options: [
      "A learned parameter updated by backpropagation during training",
      "A configuration setting specified before training that controls the learning process",
      "A feature derived from the training dataset during preprocessing",
      "A weight assigned to training examples to handle class imbalance",
    ],
    correctIndices: [1],
    explanation:
      "Hyperparameters are configuration values set before training begins that control the learning process, such as learning rate, number of epochs, tree depth, and regularization strength. They are distinct from model parameters, which are learned from data.",
    tags: ["model-training", "hyperparameters", "configuration"],
  },
  {
    id: "mls-qq-83",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "Which SageMaker feature automates hyperparameter tuning by using Bayesian optimization to find the best configuration?",
    options: [
      "SageMaker Autopilot",
      "SageMaker Hyperparameter Tuning (HPO)",
      "SageMaker Debugger",
      "SageMaker Experiments",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Hyperparameter Tuning (HPO) runs multiple training jobs with different hyperparameter combinations. Using Bayesian optimization, it learns from previous jobs to focus search on promising regions of the hyperparameter space, finding better configurations faster than grid search.",
    tags: ["model-training", "hpo", "bayesian-optimization", "sagemaker"],
  },
  {
    id: "mls-qq-84",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "What is the difference between underfitting and overfitting in a trained model?",
    options: [
      "Underfitting: too few training epochs; Overfitting: too many training features",
      "Underfitting: model is too simple and fails to capture patterns; Overfitting: model memorizes training data and fails to generalize",
      "Underfitting: model uses too much memory; Overfitting: model runs too slowly during inference",
      "Underfitting: test accuracy is too high; Overfitting: training accuracy is too low",
    ],
    correctIndices: [1],
    explanation:
      "Underfitting occurs when the model is too simple (high bias) — it fails to learn the underlying patterns in training data. Overfitting occurs when the model is too complex (high variance) — it memorizes training data noise and performs poorly on new data.",
    tags: ["model-training", "overfitting", "underfitting", "bias-variance"],
  },
  {
    id: "mls-qq-85",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    question:
      "A neural network training loss drops quickly but validation loss starts increasing after epoch 20. What is the most appropriate remediation?",
    options: [
      "Increase the learning rate to speed up convergence",
      "Add more layers to increase model capacity",
      "Apply early stopping and dropout regularization",
      "Remove the validation set and train on all available data",
    ],
    correctIndices: [2],
    explanation:
      "Rising validation loss while training loss continues to decrease is the classic sign of overfitting. Early stopping halts training when validation loss stops improving. Dropout randomly deactivates neurons during training, acting as a regularizer that reduces overfitting.",
    tags: ["model-training", "overfitting", "early-stopping", "dropout"],
  },
  {
    id: "mls-qq-86",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO built-in SageMaker algorithms are appropriate for binary classification tasks?",
    options: [
      "XGBoost",
      "DeepAR",
      "Linear Learner",
      "BlazingText Word2Vec",
      "Neural Topic Model (NTM)",
    ],
    correctIndices: [0, 2],
    explanation:
      "XGBoost is a gradient-boosted tree algorithm widely used for classification. Linear Learner trains linear models (logistic regression for classification) efficiently on large datasets. Both are built-in SageMaker algorithms with native distributed training support.",
    tags: ["model-training", "xgboost", "linear-learner", "classification"],
  },
  {
    id: "mls-qq-87",
    service: "ML Model Training",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question: "What is transfer learning in the context of ML model training?",
    options: [
      "Moving a trained model from one AWS region to another",
      "Starting training with a pre-trained model's weights and fine-tuning on new data",
      "Exporting model artifacts from SageMaker to a local environment",
      "Copying hyperparameters from one successful training job to a new one",
    ],
    correctIndices: [1],
    explanation:
      "Transfer learning uses a model pre-trained on a large dataset (e.g., ImageNet for vision, BERT for NLP) as a starting point, then fine-tunes it on domain-specific data. This reduces training time and data requirements significantly.",
    tags: ["model-training", "transfer-learning", "fine-tuning"],
  },

  // ── ML Model Evaluation ───────────────────────────────────────────────────────
  {
    id: "mls-qq-88",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "In a binary classification problem, what does precision measure?",
    options: [
      "Of all actual positive cases, how many did the model correctly identify?",
      "Of all cases the model predicted as positive, how many were actually positive?",
      "The proportion of correct predictions over all predictions made",
      "The area under the ROC curve for the model's predictions",
    ],
    correctIndices: [1],
    explanation:
      "Precision = TP / (TP + FP). Of all the examples the model predicted as positive, precision measures what fraction were truly positive. High precision means few false positives — important when false alarms are costly.",
    tags: ["model-evaluation", "precision", "classification"],
  },
  {
    id: "mls-qq-89",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "In a fraud detection system, missing actual fraud cases is more costly than false alarms. Which metric should be prioritized?",
    options: ["Precision", "Recall (Sensitivity)", "Specificity", "Accuracy"],
    correctIndices: [1],
    explanation:
      "Recall = TP / (TP + FN). It measures the fraction of actual positive cases that the model catches. In fraud detection, missing real fraud (false negatives) is more costly than investigating false alarms, so maximizing recall is critical.",
    tags: ["model-evaluation", "recall", "fraud-detection"],
  },
  {
    id: "mls-qq-90",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "What does the AUC-ROC metric measure and what values indicate a good model?",
    options: [
      "The average loss per epoch; values close to 0 indicate a good model",
      "The model's ability to distinguish between classes across all thresholds; values close to 1.0 indicate a good model",
      "The fraction of correct predictions on the test set; values above 0.5 indicate a good model",
      "The ratio of true positives to false positives at a single decision threshold",
    ],
    correctIndices: [1],
    explanation:
      "AUC-ROC measures the area under the Receiver Operating Characteristic curve, which plots true positive rate vs. false positive rate across all classification thresholds. AUC of 1.0 is perfect; 0.5 is random. Values above 0.8 generally indicate a good model.",
    tags: ["model-evaluation", "auc-roc", "classification"],
  },
  {
    id: "mls-qq-91",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "Which regression metric penalizes large prediction errors more heavily due to its squared component?",
    options: [
      "Mean Absolute Error (MAE)",
      "Mean Squared Error (MSE)",
      "R-squared (R²)",
      "Mean Absolute Percentage Error (MAPE)",
    ],
    correctIndices: [1],
    explanation:
      "MSE squares the prediction errors before averaging them, which means large errors are penalized much more than small errors. This makes MSE sensitive to outliers. RMSE (the square root of MSE) is in the same units as the target variable.",
    tags: ["model-evaluation", "mse", "regression"],
  },
  {
    id: "mls-qq-92",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO evaluation techniques help ensure a model's performance estimate is reliable when data is limited?",
    options: [
      "k-fold cross-validation",
      "Holdout validation on a fixed 80/20 split",
      "Stratified sampling for train/test split",
      "Training on 100% of available data",
      "Using only the training accuracy as the final metric",
    ],
    correctIndices: [0, 2],
    explanation:
      "k-fold cross-validation trains and evaluates the model k times on different data partitions, providing a more robust performance estimate. Stratified sampling ensures class proportions are preserved in each split, preventing misleading results when classes are imbalanced.",
    tags: ["model-evaluation", "cross-validation", "stratified-sampling"],
  },
  {
    id: "mls-qq-93",
    service: "ML Model Evaluation",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "What is the F1 score and when is it more appropriate than accuracy?",
    options: [
      "F1 is accuracy weighted by class frequency; it is better for balanced datasets",
      "F1 is the harmonic mean of precision and recall; it is better when classes are imbalanced",
      "F1 is the geometric mean of AUC and accuracy; it penalizes large errors more",
      "F1 measures how quickly a model reaches convergence during training",
    ],
    correctIndices: [1],
    explanation:
      "F1 = 2 × (Precision × Recall) / (Precision + Recall). As the harmonic mean, it balances both precision and recall. When classes are imbalanced, accuracy can be misleadingly high (a model predicting majority class always), while F1 penalizes both false positives and false negatives.",
    tags: ["model-evaluation", "f1-score", "imbalanced"],
  },

  // ── ML Model Deployment ───────────────────────────────────────────────────────
  {
    id: "mls-qq-94",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is A/B testing in the context of ML model deployment?",
    options: [
      "Testing the model on two separate training datasets to compare accuracy",
      "Splitting live traffic between two model variants to compare their performance on real users",
      "Running two training jobs simultaneously to compare training speed",
      "Comparing the model's performance before and after hyperparameter tuning",
    ],
    correctIndices: [1],
    explanation:
      "A/B testing routes a percentage of live production traffic to a new model variant while the rest goes to the current model. SageMaker supports this via production variant weights on a single endpoint, enabling safe comparison of model versions on real traffic.",
    tags: ["model-deployment", "ab-testing", "sagemaker"],
  },
  {
    id: "mls-qq-95",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to deploy multiple ML models on a single endpoint to reduce cost. Which SageMaker feature enables this?",
    options: [
      "SageMaker Batch Transform",
      "SageMaker Multi-Model Endpoints",
      "SageMaker Pipelines",
      "SageMaker Model Registry",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Multi-Model Endpoints host multiple models behind a single endpoint. Models are loaded and unloaded from memory dynamically based on traffic, sharing the underlying compute resources and reducing cost when each model serves intermittent traffic.",
    tags: ["model-deployment", "multi-model-endpoint", "cost"],
  },
  {
    id: "mls-qq-96",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which SageMaker deployment feature hosts inference code alongside a model's preprocessing and postprocessing logic in a single container chain?",
    options: [
      "Multi-Model Endpoints",
      "Inference Pipelines",
      "Serial Inference",
      "Elastic Inference",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Inference Pipelines chain up to 15 containers in sequence on a single endpoint. This allows preprocessing (e.g., feature scaling), ML model inference, and postprocessing to run in a single real-time call without client-side orchestration.",
    tags: ["model-deployment", "inference-pipeline", "preprocessing"],
  },
  {
    id: "mls-qq-97",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A model requires GPU inference but receives very light and infrequent traffic. Which approach minimizes cost while still enabling GPU acceleration?",
    options: [
      "Deploy a large GPU instance (p3.2xlarge) as a dedicated real-time endpoint",
      "Use SageMaker Elastic Inference to attach a fractional GPU accelerator to a CPU instance",
      "Use SageMaker Serverless Inference with a GPU-backed instance",
      "Deploy the model on Lambda with GPU support",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Elastic Inference attaches a fractional GPU accelerator (EIA) to a CPU instance, providing GPU acceleration at a fraction of the cost of a full GPU instance. It is ideal for latency-sensitive inference that needs some GPU capability but not full GPU throughput. Note: AWS deprecated Elastic Inference in April 2023 — in current practice, AWS Inferentia-based instances (ml.inf1, ml.inf2) are the recommended cost-efficient alternative for GPU inference.",
    tags: ["model-deployment", "elastic-inference", "gpu", "cost"],
  },
  {
    id: "mls-qq-98",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is the purpose of SageMaker Model Registry?",
    options: [
      "To store trained model artifacts in S3",
      "To centrally catalog, version, and manage ML model approvals across the ML lifecycle",
      "To deploy models to multiple AWS regions simultaneously",
      "To monitor model performance after deployment",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Model Registry provides a centralized repository to catalog model versions, track metadata (training metrics, lineage, dataset info), manage approval workflows, and deploy approved versions to endpoints — an essential MLOps component.",
    tags: ["model-deployment", "model-registry", "mlops"],
  },
  {
    id: "mls-qq-99",
    service: "ML Model Deployment",
    domain: "deployment",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO SageMaker deployment strategies help minimize risk when rolling out a new model version?",
    options: [
      "Blue/Green deployments with traffic shifting",
      "Batch Transform on production data",
      "Canary deployments (sending a small percentage of traffic to the new version)",
      "Retraining the model on production data before deployment",
      "Deploying to a Spot Instance endpoint",
    ],
    correctIndices: [0, 2],
    explanation:
      "Blue/Green deployment creates a new (green) endpoint, shifts traffic from the old (blue), and monitors before full cutover. Canary deployment sends a small percentage of traffic to the new version first, allowing comparison before full rollout. Both reduce the blast radius of a bad model deployment.",
    tags: ["model-deployment", "blue-green", "canary", "risk"],
  },

  // ── ML Security & IAM ─────────────────────────────────────────────────────────
  {
    id: "mls-qq-100",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "What IAM mechanism should be used to grant a SageMaker training job access to S3 training data?",
    options: [
      "IAM user credentials embedded in the training script",
      "An IAM execution role attached to the SageMaker training job",
      "An S3 bucket with public read access",
      "An IAM group containing the SageMaker service principal",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker training jobs, notebook instances, and endpoints assume an IAM execution role. The role's policies grant the specific permissions needed (e.g., S3 GetObject). This is the secure approach — no long-term credentials are embedded in code.",
    tags: ["security", "iam", "execution-role", "sagemaker"],
  },
  {
    id: "mls-qq-101",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A SageMaker training job must run in a VPC with no internet access. How should the job access an S3 bucket in the same region?",
    options: [
      "Enable a NAT Gateway in the VPC for S3 access",
      "Attach a public IP to the training container",
      "Use an S3 VPC Endpoint (Gateway endpoint) so traffic stays within AWS",
      "Make the S3 bucket publicly accessible",
    ],
    correctIndices: [2],
    explanation:
      "An S3 Gateway VPC Endpoint routes S3 traffic through the AWS private network without traversing the internet. This satisfies security requirements for isolated VPC training environments while maintaining S3 access without a NAT Gateway.",
    tags: ["security", "vpc", "vpc-endpoint", "s3", "sagemaker"],
  },
  {
    id: "mls-qq-102",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service provides a managed key store for encrypting SageMaker notebook EBS volumes, model artifacts, and S3 training data?",
    options: [
      "AWS Secrets Manager",
      "AWS Certificate Manager",
      "AWS Key Management Service (KMS)",
      "AWS IAM",
    ],
    correctIndices: [2],
    explanation:
      "AWS KMS manages encryption keys used to encrypt data at rest. SageMaker integrates with KMS for encrypting EBS volumes attached to notebook instances, training job outputs, model artifacts in S3, and endpoint data — providing centralized key management and audit via CloudTrail.",
    tags: ["security", "kms", "encryption", "sagemaker"],
  },
  {
    id: "mls-qq-103",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "SageMaker Studio is deployed in a company's VPC. Which configuration prevents Studio notebooks from accessing the internet while still allowing access to SageMaker APIs and S3?",
    options: [
      "Enable public internet access on the Studio domain",
      "Configure VPC-only mode with Interface VPC Endpoints for SageMaker and a Gateway Endpoint for S3",
      "Use a NAT Gateway for outbound internet traffic from Studio",
      "Deploy Studio in a public subnet with a security group blocking port 80",
    ],
    correctIndices: [1],
    explanation:
      "VPC-only mode for SageMaker Studio disables direct internet access. Interface VPC Endpoints (AWS PrivateLink) provide private connectivity to SageMaker APIs. A Gateway Endpoint routes S3 traffic through the AWS backbone. This architecture meets strict network isolation requirements.",
    tags: ["security", "vpc", "privatelink", "sagemaker-studio"],
  },
  {
    id: "mls-qq-104",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO practices implement the principle of least privilege for ML workflows in AWS?",
    options: [
      "Granting SageMaker execution roles only the specific S3 bucket access needed",
      "Using a single shared IAM user for all data scientists in the team",
      "Using IAM condition keys to restrict SageMaker actions to specific resource tags",
      "Granting AdministratorAccess to all ML engineers for convenience",
      "Sharing root account credentials for urgent production deployments",
    ],
    correctIndices: [0, 2],
    explanation:
      "Scoping execution role permissions to specific S3 buckets (via bucket ARNs in the policy resource) ensures jobs cannot access unintended data. IAM condition keys (e.g., ResourceTag conditions) enforce additional constraints, ensuring policies apply only to tagged resources.",
    tags: ["security", "iam", "least-privilege", "conditions"],
  },
  {
    id: "mls-qq-105",
    service: "ML Security & IAM",
    domain: "security",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS service provides audit logs showing which IAM principal made which API calls to SageMaker and S3?",
    options: [
      "Amazon CloudWatch Metrics",
      "AWS CloudTrail",
      "Amazon GuardDuty",
      "AWS Config",
    ],
    correctIndices: [1],
    explanation:
      "AWS CloudTrail records all API calls made to AWS services, including SageMaker and S3, with the caller identity, timestamp, source IP, and request parameters. This audit trail is essential for security investigations and compliance requirements.",
    tags: ["security", "cloudtrail", "audit", "compliance"],
  },

  // ── ML Pipeline & MLOps ───────────────────────────────────────────────────────
  {
    id: "mls-qq-106",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is SageMaker Pipelines used for?",
    options: [
      "Streaming real-time data from Kinesis into SageMaker training jobs",
      "Orchestrating end-to-end ML workflows including data processing, training, evaluation, and deployment",
      "Managing the lifecycle of SageMaker notebook instances",
      "Monitoring model performance metrics after deployment",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Pipelines is a CI/CD workflow orchestration service for ML. It chains together steps for data preprocessing, training, evaluation, conditional branching (e.g., only deploy if accuracy > threshold), and model registration into a repeatable, versionable pipeline.",
    tags: ["mlops", "sagemaker-pipelines", "orchestration"],
  },
  {
    id: "mls-qq-107",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "What triggers automatic retraining in a SageMaker MLOps pipeline when model quality degrades?",
    options: [
      "SageMaker Model Monitor detects drift and publishes a CloudWatch alarm, which triggers a pipeline execution via EventBridge",
      "SageMaker Debugger automatically retriggers training when validation loss increases",
      "SageMaker Autopilot continuously monitors and retrains models on a fixed schedule",
      "SageMaker Experiments logs degraded metrics and automatically resubmits the training job",
    ],
    correctIndices: [0],
    explanation:
      "Model Monitor publishes violation metrics to CloudWatch. A CloudWatch alarm triggers an EventBridge rule when thresholds are breached. EventBridge then starts a SageMaker Pipeline execution to retrain and redeploy the model — this event-driven retraining pattern is a standard MLOps architecture.",
    tags: ["mlops", "model-monitor", "eventbridge", "retraining"],
  },
  {
    id: "mls-qq-108",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question: "What does ML lineage tracking in SageMaker record?",
    options: [
      "The Git commit history for the training script",
      "The computational relationships between datasets, processing jobs, training jobs, models, and endpoints",
      "The cost breakdown for each SageMaker training job",
      "The network traffic logs between SageMaker and S3",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker ML Lineage Tracking automatically records the relationships between artifacts in the ML workflow — which dataset was used to train which model, which model is deployed on which endpoint. This enables reproducibility, auditability, and impact analysis.",
    tags: ["mlops", "lineage", "reproducibility", "sagemaker"],
  },
  {
    id: "mls-qq-109",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A team wants to gate model deployment on a minimum accuracy threshold within a SageMaker Pipeline. Which step type enables this conditional logic?",
    options: [
      "SageMaker Processing Step",
      "SageMaker Training Step",
      "SageMaker Condition Step",
      "SageMaker Transform Step",
    ],
    correctIndices: [2],
    explanation:
      "The Condition Step in SageMaker Pipelines evaluates a condition (e.g., accuracy > 0.85) and branches the pipeline execution accordingly — proceeding to model registration and deployment if the condition passes, or triggering a notification/failure if it does not.",
    tags: ["mlops", "sagemaker-pipelines", "condition-step", "gating"],
  },
  {
    id: "mls-qq-110",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question: "What is the purpose of SageMaker Experiments?",
    options: [
      "To run A/B tests on deployed model endpoints",
      "To track, compare, and organize multiple training runs with their hyperparameters and metrics",
      "To automatically deploy the best-performing model to production",
      "To detect anomalies in training data distributions",
    ],
    correctIndices: [1],
    explanation:
      "SageMaker Experiments organizes training runs into experiments and trials, automatically logging hyperparameters, metrics, and artifact locations. Teams can compare runs side-by-side to identify the best configuration, enabling reproducible ML research.",
    tags: ["mlops", "experiments", "tracking", "reproducibility"],
  },
  {
    id: "mls-qq-111",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO components are essential for a production-grade MLOps pipeline on AWS?",
    options: [
      "SageMaker Model Registry for versioning and approval workflows",
      "SageMaker Ground Truth for labeling all production data",
      "SageMaker Model Monitor for detecting data and model drift",
      "SageMaker Canvas for no-code model building",
      "Amazon Mechanical Turk for model evaluation",
    ],
    correctIndices: [0, 2],
    explanation:
      "Model Registry provides centralized version control, metadata tracking, and approval gates before deployment — preventing unapproved models from reaching production. Model Monitor detects drift post-deployment and triggers retraining pipelines, closing the feedback loop in the MLOps cycle.",
    tags: ["mlops", "model-registry", "model-monitor", "production"],
  },
  {
    id: "mls-qq-112",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    question:
      "A financial services company requires a complete audit trail showing which training data produced a deployed model. Which SageMaker MLOps feature provides this?",
    options: [
      "SageMaker Debugger",
      "SageMaker Experiments",
      "SageMaker ML Lineage Tracking",
      "SageMaker Model Monitor",
    ],
    correctIndices: [2],
    explanation:
      "ML Lineage Tracking records the provenance chain: training dataset → processing job → training job → model artifact → model package → endpoint. This bidirectional lineage graph satisfies regulatory audit requirements by proving exactly which data produced which deployed model.",
    tags: ["mlops", "lineage", "compliance", "audit"],
  },
  {
    id: "mls-qq-113",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which AWS service can trigger a SageMaker Pipeline execution on a schedule (e.g., weekly retraining)?",
    options: [
      "AWS Lambda",
      "Amazon EventBridge Scheduler",
      "AWS Step Functions",
      "Amazon SQS",
    ],
    correctIndices: [1],
    explanation:
      "Amazon EventBridge Scheduler (formerly CloudWatch Events schedules) can trigger SageMaker Pipeline executions on cron or rate schedules. This enables automated weekly or monthly retraining pipelines without human intervention.",
    tags: ["mlops", "eventbridge", "scheduling", "retraining"],
  },
  {
    id: "mls-qq-114",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "What is the main benefit of infrastructure-as-code (IaC) for ML infrastructure in AWS?",
    options: [
      "IaC makes SageMaker training jobs run faster by pre-provisioning resources",
      "IaC enables reproducible, version-controlled deployment of SageMaker endpoints and pipelines",
      "IaC automatically tunes hyperparameters based on infrastructure specifications",
      "IaC reduces the cost of SageMaker endpoints by optimizing instance selection",
    ],
    correctIndices: [1],
    explanation:
      "Infrastructure-as-code (CloudFormation, CDK, Terraform) captures ML infrastructure configuration in version-controlled code. This ensures environments are reproducible, eliminates manual configuration drift, and enables environment promotion (dev → staging → prod) consistently.",
    tags: ["mlops", "iac", "cloudformation", "reproducibility"],
  },
  {
    id: "mls-qq-115",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which SageMaker feature provides a visual, drag-and-drop environment for building and orchestrating ML pipelines without writing DAG code?",
    options: [
      "SageMaker Studio Classic",
      "SageMaker Canvas",
      "SageMaker Pipeline Designer (Studio visual pipeline editor)",
      "SageMaker Autopilot",
    ],
    correctIndices: [2],
    explanation:
      "The SageMaker Studio visual pipeline editor (Pipeline Designer) allows users to construct SageMaker Pipelines by dragging and connecting step nodes graphically. The underlying pipeline definition is standard SageMaker Pipelines JSON, so it integrates with CI/CD workflows.",
    tags: ["mlops", "pipeline-designer", "sagemaker-studio"],
  },
  {
    id: "mls-qq-116",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO AWS services can integrate with SageMaker Pipelines to provide CI/CD capabilities for ML model deployment?",
    options: [
      "AWS CodePipeline",
      "Amazon Kinesis Data Firehose",
      "AWS CodeBuild",
      "Amazon CloudFront",
      "AWS Glue DataBrew",
    ],
    correctIndices: [0, 2],
    explanation:
      "AWS CodePipeline orchestrates CI/CD stages and can trigger SageMaker Pipeline executions on code commits. AWS CodeBuild runs unit tests, linting, and validation of training scripts before they are packaged for SageMaker. Together they bring software engineering best practices to ML workflows.",
    tags: ["mlops", "codepipeline", "codebuild", "cicd"],
  },
  {
    id: "mls-qq-117",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "A team wants to reuse common preprocessing code across multiple ML pipelines. Which SageMaker Pipeline feature supports modular, reusable step definitions?",
    options: [
      "SageMaker Pipeline Parameters",
      "Step Decorator (@step)",
      "SageMaker Pipeline Steps with shared Processing Job definitions",
      "SageMaker Experiments trials",
    ],
    correctIndices: [1],
    explanation:
      "The @step decorator (available in the SageMaker Python SDK) allows you to wrap arbitrary Python functions as pipeline steps. These decorated functions can be imported and reused across multiple pipelines as modular, versioned components.",
    tags: ["mlops", "pipelines", "step-decorator", "reusability"],
  },
  {
    id: "mls-qq-118",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "easy",
    type: "single",
    question:
      "What is feature drift and why does it matter for deployed ML models?",
    options: [
      "Feature drift is when new features are added to the model after deployment",
      "Feature drift occurs when the statistical distribution of input features changes over time, causing model performance to degrade",
      "Feature drift is when feature engineering code changes between model versions",
      "Feature drift describes the gradual increase in feature count as more data is collected",
    ],
    correctIndices: [1],
    explanation:
      "Feature drift (data drift) occurs when the real-world distribution of input features shifts away from what the model was trained on. This causes model predictions to become less accurate over time, requiring retraining on fresh data. SageMaker Model Monitor detects this automatically.",
    tags: ["mlops", "feature-drift", "data-drift", "model-monitor"],
  },
  {
    id: "mls-qq-119",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    question:
      "Which SageMaker Pipelines feature allows the same pipeline to run with different input parameters (e.g., different datasets or hyperparameters) without modifying the pipeline definition?",
    options: [
      "Pipeline Steps",
      "Pipeline Parameters",
      "Pipeline Conditions",
      "Pipeline Callbacks",
    ],
    correctIndices: [1],
    explanation:
      "Pipeline Parameters are named variables defined at pipeline creation time with default values. When starting a pipeline execution, you can override parameter values (e.g., specify a new training dataset S3 path) without changing the pipeline definition itself.",
    tags: ["mlops", "pipeline-parameters", "sagemaker-pipelines"],
  },
  {
    id: "mls-qq-120",
    service: "ML Pipeline & MLOps",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO practices help reduce SageMaker training costs in a production MLOps environment?",
    options: [
      "Using Spot Training instances for fault-tolerant training jobs with checkpointing",
      "Always using the largest available GPU instance for all training jobs",
      "Using SageMaker Managed Warm Pools to reduce startup time for iterative experiments",
      "Disabling distributed training to simplify infrastructure",
      "Running all training jobs on a single shared notebook instance",
    ],
    correctIndices: [0, 2],
    explanation:
      "Spot Training uses EC2 Spot capacity at up to 90% discount; checkpointing to S3 allows jobs to resume after interruption. Managed Warm Pools keep compute infrastructure warm between training jobs, eliminating startup latency and reducing the overhead cost of iterative experimentation.",
    tags: ["mlops", "spot-training", "warm-pools", "cost-optimization"],
  },
];
