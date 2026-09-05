import { ServiceGuide } from "../../../types/guide";

export const glueGuide: ServiceGuide = {
  id: "mls-glue",
  service: "AWS Glue",
  domain: "services",
  tagline:
    "Serverless ETL and data catalog service for preparing ML training data at scale",
  intro:
    "AWS Glue is the primary serverless ETL service used in ML pipelines for transforming raw data into training-ready datasets. It combines a managed Apache Spark environment for large-scale data processing with a centralized Data Catalog that makes datasets discoverable across AWS services.",

  sections: [
    {
      heading: "AWS Glue Data Catalog",
      body: `The Glue Data Catalog is a centralized metadata repository that stores table definitions, schema information, and partition metadata for datasets stored in S3, RDS, Redshift, and other data sources. It is compatible with the Apache Hive Metastore, meaning services like Amazon Athena, Amazon EMR, and Amazon Redshift Spectrum can all query the same catalog without duplicate schema definitions. For ML workflows, the Data Catalog makes raw and processed datasets discoverable across teams without sharing S3 bucket paths directly.

Glue Crawlers automatically scan data sources, infer schemas, and populate the Data Catalog. Crawlers can run on a schedule to detect new partitions or schema changes. In an ML pipeline, you might run a crawler after daily data ingestion to make the new partition available to Athena for exploratory queries and to SageMaker Processing for feature engineering. The catalog integrates with Lake Formation for fine-grained access control.`,
      quiz: [
        {
          question:
            "What is the primary purpose of the AWS Glue Data Catalog in an ML data pipeline?",
          options: [
            "To run ETL transformations on raw S3 data and output processed features",
            "To store centralized metadata (table definitions, schemas, partitions) making datasets discoverable and queryable across services like Athena, EMR, and SageMaker",
            "To encrypt datasets in S3 using AWS KMS before ML training begins",
            "To monitor data quality and detect anomalies in training datasets",
          ],
          correctIndex: 1,
          explanation:
            "The Glue Data Catalog is a metadata repository — it stores schemas and partition info, not the data itself. It makes S3 datasets queryable by Athena, EMR, and other services without duplicating schema definitions. Crawlers populate it automatically by scanning data sources.",
        },
      ],
    },
    {
      heading: "Glue ETL Jobs for ML Data Preparation",
      body: `Glue ETL Jobs run on a managed Apache Spark cluster and support Python (PySpark) and Scala. You define transformation logic in a script, specify input/output data sources, and Glue provisions the Spark cluster, runs the job, and terminates the cluster. This serverless model means there are no clusters to manage. For ML feature engineering, Glue ETL jobs handle operations like joining tables from different sources, pivoting data, computing aggregates, and writing output in Parquet format optimized for training.

Glue DynamicFrame is Glue's extension of the Spark DataFrame that handles semi-structured, messy, or schema-inconsistent data more gracefully — it tolerates nested structures and type inconsistencies that would cause Spark DataFrames to fail. For ML pipelines that ingest messy real-world data (logs, clickstreams, IoT events), DynamicFrames allow processing to continue even when records don't conform to a rigid schema. Glue jobs can write output directly to S3 in Parquet or ORC format, which are the optimal formats for SageMaker Training Jobs.`,
      quiz: [
        {
          question:
            "What is the advantage of Glue DynamicFrame over a standard Spark DataFrame when processing ML training data?",
          options: [
            "DynamicFrames run 10x faster because they use columnar storage internally",
            "DynamicFrames tolerate schema inconsistencies and nested structures in semi-structured data, allowing jobs to continue without failing on malformed records",
            "DynamicFrames automatically detect and remove outliers from training data",
            "DynamicFrames support GPU acceleration for faster data transformation",
          ],
          correctIndex: 1,
          explanation:
            "Glue DynamicFrame handles schema inconsistencies, type mismatches, and nested structures that would cause standard Spark DataFrames to throw exceptions. This makes it well-suited for real-world ML data preparation where raw data is often messy or semi-structured.",
        },
      ],
    },
    {
      heading: "Glue DataBrew for No-Code Data Preparation",
      body: `AWS Glue DataBrew is a visual data preparation tool designed for analysts who need to clean and normalize datasets without writing code. It provides over 250 pre-built transformations including handling missing values, removing duplicates, normalizing formats, and encoding categoricals. DataBrew profiles datasets to show statistics like missing value counts, outlier distributions, and cardinality, which directly supports the data quality assessment phase of ML projects.

DataBrew integrates with the Glue Data Catalog, S3, Redshift, and other sources. Recipes (sequences of transformations) are versioned and can be applied to new data as it arrives, supporting repeatable preprocessing. While SageMaker Data Wrangler serves a similar purpose within the SageMaker ecosystem, DataBrew is broader and works across data engineering teams that may not use SageMaker. For the MLS-C01 exam, know that DataBrew is a no-code data prep tool complementary to Glue ETL.`,
      quiz: [
        {
          question:
            "How does AWS Glue DataBrew differ from AWS Glue ETL Jobs in an ML data preparation context?",
          options: [
            "DataBrew uses Apache Spark; Glue ETL uses Python scripts on Lambda",
            "DataBrew is a visual no-code tool with 250+ built-in transforms for analysts; Glue ETL is code-based Spark for engineers building complex pipelines",
            "DataBrew only processes structured SQL data; Glue ETL handles unstructured data",
            "DataBrew runs in real-time; Glue ETL only supports batch processing",
          ],
          correctIndex: 1,
          explanation:
            "DataBrew provides a visual, no-code interface with pre-built transformation recipes, targeting analysts. Glue ETL uses PySpark or Scala scripts for complex, code-driven transformation pipelines, targeting data engineers. Both produce training-ready datasets but suit different users and complexity levels.",
        },
      ],
    },
    {
      heading: "Glue Streaming and Real-Time Feature Engineering",
      body: `AWS Glue Streaming ETL processes data from Kinesis Data Streams and Kafka in near real-time using a continuously running Spark Structured Streaming job. This is relevant for ML use cases that require features computed from streaming data, such as fraud detection models that need features derived from the last 10 minutes of transaction activity or recommendation systems needing real-time click-stream features.

Glue Streaming jobs output to S3, Kinesis Data Firehose, or direct to SageMaker Feature Store using the FeatureStore ingest API, enabling near-real-time feature materialization into the online store. The architecture for real-time ML typically combines Kinesis Data Streams (event ingestion) → Glue Streaming (feature computation) → SageMaker Feature Store Online Store (low-latency feature retrieval for inference). This pattern avoids the staleness problem in online inference where pre-computed batch features lag behind real-world events.`,
      quiz: [
        {
          question:
            "A fraud detection system needs ML features computed from the last 5 minutes of transaction data. Which AWS services form the optimal pipeline?",
          options: [
            "S3 → Glue ETL batch job → SageMaker Feature Store offline store",
            "Kinesis Data Streams → Glue Streaming ETL → SageMaker Feature Store online store",
            "DynamoDB Streams → Lambda → SageMaker Processing → S3",
            "Kinesis Firehose → S3 → SageMaker Batch Transform",
          ],
          correctIndex: 1,
          explanation:
            "For real-time feature computation, Kinesis Data Streams ingests events, Glue Streaming ETL computes features in near-real-time, and SageMaker Feature Store's online store (DynamoDB-backed) stores features for millisecond-latency retrieval during inference. This is the canonical real-time feature engineering pattern.",
        },
      ],
    },
    {
      heading: "Glue in the ML Pipeline Architecture",
      body: `In a complete ML pipeline, Glue occupies the data engineering layer between raw data sources and ML training. The typical flow is: raw data lands in an S3 landing zone → Glue Crawlers catalog it → Glue ETL Jobs transform and clean it → processed data written to S3 in Parquet format → SageMaker Training Jobs consume it. This clear separation of concerns means data engineers own the Glue layer and ML engineers own the SageMaker layer, with S3 and the Glue Data Catalog serving as the handoff point.

Glue integrates with AWS Lake Formation for centralized access control on the Data Catalog and S3 data. In regulated environments, Lake Formation column-level and row-level permissions ensure ML engineers only access authorized columns of training data. Glue also supports connections to JDBC sources (RDS, Redshift, on-premises databases), enabling ML pipelines to train on data residing outside S3 without manual data movement.`,
      quiz: [
        {
          question:
            "In an ML pipeline, what is the role of the AWS Glue Data Catalog between data ingestion and SageMaker training?",
          options: [
            "It runs ETL transformations that convert raw data into model-ready features",
            "It serves as the centralized metadata layer that makes datasets discoverable to Athena, EMR, and SageMaker without duplicating schema definitions",
            "It stores trained model artifacts for versioned deployment",
            "It encrypts training data using KMS and manages access keys",
          ],
          correctIndex: 1,
          explanation:
            "The Glue Data Catalog is the metadata layer — it stores schemas and partition info but not the data. It acts as the handoff point between data engineering (Glue ETL) and ML training (SageMaker), making datasets discoverable and queryable without sharing raw S3 paths.",
        },
      ],
    },
  ],

  keyFacts: [
    "Glue Data Catalog = centralized metadata repository compatible with Apache Hive Metastore",
    "Glue Crawlers automatically infer schemas and populate the catalog from S3, RDS, Redshift",
    "Glue ETL Jobs run on managed Spark clusters — serverless, no cluster management required",
    "DynamicFrame handles schema inconsistencies in messy real-world data better than Spark DataFrames",
    "DataBrew = visual no-code data prep with 250+ transforms for analysts",
    "Glue Streaming ETL processes Kinesis/Kafka streams for near-real-time feature engineering",
    "Glue integrates with Lake Formation for column-level and row-level access control",
    "Parquet and ORC output formats are optimal for SageMaker Training Job consumption",
    "JDBC connections allow Glue to ETL data from RDS, Redshift, and on-premises databases",
    "Glue is the data engineering layer between raw S3 data and ML training jobs",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Lake Formation",
    "Amazon Athena",
    "Amazon EMR",
    "Amazon SageMaker",
    "Amazon Kinesis",
  ],

  examTips: [
    "Glue ETL = code-based Spark jobs; DataBrew = visual no-code transforms — know which scenario requires which",
    "DynamicFrame tolerates messy/semi-structured data — use when raw data has inconsistent schemas",
    "Glue Crawlers populate the Data Catalog automatically — run them after ingestion to expose new partitions",
    "Glue Streaming + Feature Store online store = the pattern for real-time feature computation",
    "Parquet output from Glue is optimal for SageMaker Training Jobs — columnar, compressed, fast",
    "Glue Data Catalog is shared by Athena, EMR, Redshift Spectrum, and SageMaker — single source of truth",
    "Lake Formation uses the Glue catalog for fine-grained access control on ML training data",
    "Glue job bookmarks prevent reprocessing already-processed data in incremental pipelines",
  ],

  topicQuiz: [
    {
      question:
        "A data engineer needs to process semi-structured JSON logs with inconsistent schemas into Parquet for SageMaker training. Which Glue feature handles the schema inconsistencies?",
      options: [
        "Glue DataBrew — it profiles and normalizes schema automatically",
        "Glue DynamicFrame — it tolerates schema inconsistencies without failing on malformed records",
        "Glue Crawler — it infers the most common schema and drops non-conforming records",
        "Glue ETL with a strict Spark DataFrame schema enforcement",
      ],
      correctIndex: 1,
      explanation:
        "Glue DynamicFrame is designed for semi-structured data with inconsistent schemas. It processes records that don't conform to a rigid schema without failing the entire job, making it ideal for real-world log data ingestion pipelines that feed ML training.",
    },
    {
      question:
        "Which AWS service should be used to automatically catalog new S3 partitions created daily by a data ingestion pipeline so they become queryable in Athena?",
      options: [
        "AWS Lambda — trigger on S3 PutObject events to register partitions manually",
        "AWS Glue Crawler — scheduled to run after ingestion, automatically detecting new partitions and updating the Data Catalog",
        "Amazon EMR — run a Hive MSCK REPAIR TABLE command on a schedule",
        "Amazon Redshift Spectrum — it automatically discovers S3 partitions without a catalog",
      ],
      correctIndex: 1,
      explanation:
        "Glue Crawlers are designed to automatically scan data sources, detect new partitions, infer schemas, and update the Glue Data Catalog. Scheduling a crawler to run after daily ingestion ensures new data is immediately available to Athena, EMR, and SageMaker without manual partition registration.",
    },
  ],
};
