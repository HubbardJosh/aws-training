import { ServiceGuide } from "../../../types/guide";

export const emrGuide: ServiceGuide = {
  id: "mls-emr",
  service: "Amazon EMR",
  domain: "services",
  tagline:
    "Managed big data platform running Spark, Hadoop, and Hive for large-scale ML data processing",
  intro:
    "Amazon EMR is the AWS managed big data platform for running Apache Spark, Hadoop, Hive, HBase, Presto, and other open-source frameworks on scalable EC2 clusters. For ML, EMR handles large-scale feature engineering, distributed model training with Spark MLlib, and EDA on datasets too large for single-node processing.",

  sections: [
    {
      heading: "EMR Architecture and Cluster Types",
      body: `An EMR cluster consists of a primary node (coordinates the cluster, runs the resource manager), core nodes (run tasks and store data in HDFS), and optional task nodes (add compute without HDFS storage). For ML workloads, using EMR with S3 as the data store (instead of HDFS) and task nodes as Spot Instances provides the best cost-performance balance — Spot task nodes add cheap compute for Spark jobs, and data persists in S3 even if Spot Instances are reclaimed.

EMR supports two deployment modes: long-running clusters (appropriate for interactive Spark sessions using EMR Studio or Jupyter notebooks for data exploration) and transient clusters (spin up, run a job, terminate — optimal for automated ML pipeline steps). Transient clusters with Spot task nodes and S3 storage are the cost-efficient architecture for ML feature engineering pipelines that run on a schedule. EMR Auto Scaling adjusts core and task node counts based on YARN queue depth or custom CloudWatch metrics.`,
      quiz: [
        {
          question:
            "What is the most cost-efficient EMR configuration for a nightly batch feature engineering job that runs for 2 hours?",
          options: [
            "Long-running cluster with Reserved Instances for core nodes",
            "Transient cluster with On-Demand primary/core nodes and Spot task nodes, storing data in S3",
            "Long-running cluster with Spot Instances for all nodes including primary",
            "Transient cluster with all Spot Instances including the primary node",
          ],
          correctIndex: 1,
          explanation:
            "A transient cluster (terminates after the job) eliminates idle cluster cost. On-Demand primary and core nodes ensure cluster stability, while Spot task nodes add cheap compute. S3 as the data store means data persists even if Spot task nodes are reclaimed. This is the standard cost-efficient pattern for batch ML jobs.",
        },
      ],
    },
    {
      heading: "Apache Spark on EMR for ML Feature Engineering",
      body: `Apache Spark is the most widely used framework on EMR for ML data preparation. Spark's distributed DataFrame API allows data engineers to apply transformations across hundreds of nodes concurrently, enabling feature engineering on terabyte-scale datasets. Typical ML feature engineering operations in Spark include joining behavioral and transactional datasets, computing user-level aggregations (average session duration, lifetime spend), one-hot encoding categoricals, scaling numerics, and writing Parquet output to S3 for SageMaker consumption.

Spark MLlib extends the Spark API with distributed ML algorithms including linear regression, random forests, gradient-boosted trees, k-means clustering, PCA, and TF-IDF vectorization. While SageMaker's built-in algorithms or custom models are typically used for production training, Spark MLlib is valuable for rapid prototyping, baseline model building on large datasets, and feature extraction pipelines that produce embeddings. EMR also supports SparkR and PySpark in EMR Studio notebooks for interactive EDA.`,
      quiz: [
        {
          question:
            "Which framework available on Amazon EMR provides distributed ML algorithms for training on large datasets using a parallel processing model?",
          options: [
            "Apache Hive — it provides SQL-based ML through HiveML extensions",
            "Apache Spark MLlib — it provides distributed implementations of common ML algorithms running on the Spark engine",
            "Presto — it uses distributed SQL execution for ML model training",
            "Apache HBase — it provides real-time read/write access for ML feature storage",
          ],
          correctIndex: 1,
          explanation:
            "Spark MLlib is the distributed ML library built on Apache Spark. It provides distributed implementations of linear regression, random forests, k-means, PCA, TF-IDF, and more. It leverages Spark's parallel processing model across EMR cluster nodes for ML on terabyte-scale datasets.",
        },
      ],
    },
    {
      heading: "EMR and the Glue Data Catalog",
      body: `EMR integrates natively with the AWS Glue Data Catalog as its Hive Metastore replacement. When configured to use the Glue catalog, Spark and Hive jobs on EMR can query tables defined by Glue Crawlers without redefining schemas. This shared catalog means data engineered by Glue ETL jobs and cataloged by Glue Crawlers is immediately available to EMR Spark jobs for further processing — and both can be queried by Athena using the same table definitions.

This catalog integration is architecturally important for ML pipelines because it creates a single schema definition used across all services. When a Glue ETL job produces a processed Parquet dataset and catalogs it, an EMR Spark job can immediately read it using Spark SQL without writing S3 paths or schema definitions in code. Lake Formation permissions control which EMR roles can access which catalog tables and columns, enabling column-level access control on ML training data.`,
      quiz: [
        {
          question:
            "How does configuring EMR to use the AWS Glue Data Catalog benefit an ML data pipeline?",
          options: [
            "It allows EMR to run Glue ETL jobs directly on the cluster without a separate Glue service",
            "It provides a shared schema layer where tables defined by Glue Crawlers are immediately queryable by EMR Spark jobs and Athena without duplicate schema definitions",
            "It enables EMR to write model artifacts directly to SageMaker Model Registry",
            "It automatically converts EMR Spark job output to Parquet format for SageMaker",
          ],
          correctIndex: 1,
          explanation:
            "When EMR uses the Glue Data Catalog as its Hive Metastore, tables cataloged by Glue Crawlers or Glue ETL jobs are immediately available to Spark SQL on EMR without redefining schemas. Athena can also query the same tables, creating a unified metadata layer across the ML pipeline.",
        },
      ],
    },
    {
      heading: "EMR Security and Network Configuration for ML",
      body: `EMR clusters for ML should always run in a VPC private subnet to prevent public internet exposure of training data. Security groups control inbound/outbound traffic — the primary node and core nodes require specific ports for Spark, YARN, HDFS, and SSH communication. EMR encryption covers data in transit (TLS between nodes and to S3) and data at rest (HDFS local disk encryption using LUKS, S3 encryption via SSE-KMS).

IAM roles for EMR include the EMR service role (grants EMR permission to create EC2 resources), the EC2 instance profile (grants cluster nodes access to S3, Glue, DynamoDB, and other services), and optionally Lake Formation permissions for catalog access. For regulated ML workloads, Kerberos authentication can be enabled for cluster node-to-node communication. EMR also supports Apache Ranger for fine-grained authorization on Hive and Spark SQL queries, controlling which users can access which columns in training datasets.`,
      quiz: [
        {
          question:
            "Which IAM component grants an EMR cluster's EC2 nodes permission to read training data from S3 and write processed features?",
          options: [
            "The EMR service role — it grants permissions for the cluster's data access",
            "The EC2 instance profile attached to cluster nodes — it defines what S3 buckets and other AWS services the nodes can access",
            "A resource-based policy on the S3 bucket allowing all EMR traffic",
            "The Glue Data Catalog policy — it grants read access to any data cataloged in Glue",
          ],
          correctIndex: 1,
          explanation:
            "The EC2 instance profile is an IAM role attached to the EC2 instances that make up the EMR cluster. It grants the cluster nodes their data plane permissions — reading from S3, writing to S3, accessing Glue, and calling DynamoDB. The EMR service role governs EMR's ability to create and manage EC2 resources, not data access.",
        },
      ],
    },
    {
      heading: "EMR vs Glue for ML Data Processing",
      body: `Choosing between EMR and Glue for ML data processing depends on complexity, control, and cost. Glue is serverless — no cluster management, automatic scaling, and a pay-per-DPU-second model. Glue is appropriate for most standard ETL tasks: joining tables, converting formats, applying transformations, and loading to destinations. It is the default choice for teams that want managed infrastructure and are not running workloads that require Spark customization.

EMR is appropriate when you need control over Spark configuration (custom Spark settings, specific library versions, native libraries), need to run frameworks unavailable in Glue (HBase, Presto, Flink on YARN), or are running interactive data science workflows in EMR Studio notebooks. EMR per-node pricing can be more cost-effective than Glue for very large, long-running jobs. For the MLS-C01 exam, know that Glue is the managed ETL default and EMR is for complex, customizable, or interactive big data workloads.`,
      quiz: [
        {
          question:
            "A data scientist needs an interactive Spark environment with custom library versions for exploratory feature engineering on a 10 TB dataset. Which service is more appropriate?",
          options: [
            "AWS Glue ETL — it provides a managed Spark environment with all popular libraries pre-installed",
            "Amazon EMR with EMR Studio — it provides a fully customizable Spark environment with interactive notebooks",
            "Amazon SageMaker Processing — it runs Spark containers for interactive exploration",
            "AWS Lambda — it runs Python feature engineering code serverlessly",
          ],
          correctIndex: 1,
          explanation:
            "EMR with EMR Studio provides a fully customizable Spark environment where you control Spark configuration, library versions, and cluster composition. EMR Studio provides Jupyter notebooks on live EMR clusters for interactive exploration. Glue does not support the same level of Spark customization or interactive cluster access.",
        },
      ],
    },
  ],

  keyFacts: [
    "EMR runs Spark, Hadoop, Hive, Presto, HBase — fully customizable open-source big data stack",
    "Transient clusters terminate after jobs — cost-efficient for scheduled ML batch processing",
    "Task nodes run compute only, no HDFS — ideal for Spot Instances since data is in S3",
    "Spark MLlib provides distributed ML algorithms: linear regression, random forests, k-means, PCA",
    "EMR + Glue Data Catalog = shared schema layer across Athena, EMR, and Glue",
    "EMR Auto Scaling adjusts core and task node count based on YARN queue or CloudWatch metrics",
    "EMR encryption: TLS in transit + LUKS at rest for HDFS + SSE-KMS for S3",
    "EMR Studio provides interactive Jupyter notebooks on live EMR clusters",
    "EC2 instance profile = the IAM role granting EMR nodes access to S3 and other services",
    "EMR vs Glue: use EMR for custom Spark config, interactive notebooks, or non-standard frameworks",
  ],

  relatedServices: [
    "AWS Glue",
    "Amazon S3",
    "Amazon SageMaker",
    "AWS Lake Formation",
    "Amazon Athena",
    "Amazon Kinesis",
  ],

  examTips: [
    "Spot task nodes + S3 storage = the cost-efficient EMR pattern for batch ML — task nodes are expendable",
    "Spark MLlib is for distributed ML on EMR; SageMaker built-in algorithms are for managed training",
    "EMR uses Glue Data Catalog as Hive Metastore — same tables queryable by Athena without duplication",
    "Transient clusters for batch; long-running clusters for interactive data science with EMR Studio",
    "EMR vs Glue: Glue = managed serverless; EMR = customizable, interactive, supports more frameworks",
    "EC2 instance profile (not the EMR service role) grants S3 data access to cluster nodes",
    "Apache Ranger on EMR = fine-grained SQL-level authorization for regulated ML data access",
    "Auto Scaling on EMR uses YARN queue depth or CloudWatch metrics to trigger scaling",
  ],

  topicQuiz: [
    {
      question:
        "A data engineering team uses EMR for daily feature engineering Spark jobs reading from and writing to S3. Which EMR configuration minimizes cost?",
      options: [
        "Long-running cluster with all Reserved Instances",
        "Transient cluster with On-Demand primary and core nodes, Spot task nodes, and S3 as the data store",
        "Long-running cluster with Auto Scaling based on CPU utilization",
        "Transient cluster with all Spot Instances including primary and core nodes",
      ],
      correctIndex: 1,
      explanation:
        "A transient cluster eliminates idle cluster cost. On-Demand primary and core nodes ensure stability (core nodes run HDFS if used, primary coordinates). Spot task nodes add cheap compute for parallelism. Storing data in S3 rather than HDFS means task node loss doesn't result in data loss.",
    },
    {
      question:
        "Which Spark framework available on EMR provides distributed implementations of k-means clustering and PCA for ML feature extraction on large datasets?",
      options: [
        "SparkSQL — it provides distributed aggregate functions for feature computation",
        "Spark MLlib — it includes distributed implementations of k-means, PCA, and other ML algorithms",
        "Spark Streaming — it processes streaming features in real-time for online inference",
        "GraphX — it provides graph-based feature extraction algorithms",
      ],
      correctIndex: 1,
      explanation:
        "Spark MLlib is the distributed ML library in Apache Spark. It provides distributed implementations of k-means, PCA, linear regression, random forests, and more, running across all nodes in an EMR cluster for ML on datasets that don't fit on a single machine.",
    },
  ],
};
