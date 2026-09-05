import { ServiceGuide } from "../../../types/guide";

export const redshiftGuide: ServiceGuide = {
  id: "mls-redshift",
  service: "Amazon Redshift",
  domain: "services",
  tagline:
    "Cloud data warehouse for large-scale analytical queries that feed ML feature pipelines",
  intro:
    "Amazon Redshift is a fully managed, petabyte-scale cloud data warehouse optimized for OLAP (Online Analytical Processing) queries. For ML, it serves as the analytical layer where complex feature aggregations are computed over structured datasets before being exported to S3 for SageMaker training.",

  sections: [
    {
      heading: "Redshift Architecture and Storage",
      body: `Redshift uses a massively parallel processing (MPP) architecture where data is distributed across multiple compute nodes. The leader node receives queries, creates an execution plan, and coordinates parallel execution across slice nodes, which each process a portion of the data. Column-oriented storage means each column is stored contiguously on disk — the same principle as Parquet — enabling column-pruning and high compression ratios for OLAP queries that touch a small number of columns across many rows.

Redshift Serverless removes the need to manage cluster sizes — you configure a maximum RPU (Redshift Processing Unit) capacity and Redshift automatically scales compute. Provisioned clusters give you control over node type and count for predictable workloads. For ML feature engineering, Redshift is appropriate when data is already in the warehouse from OLTP systems (via DMS or Glue), and you need to compute complex aggregations (rolling averages, quantiles, sessionization) using SQL before exporting features for training.`,
      quiz: [
        {
          question:
            "Why is Amazon Redshift's column-oriented storage architecture beneficial for ML feature engineering queries?",
          options: [
            "It allows row-level updates needed for training data labeling workflows",
            "It reduces the data read for queries that select a small number of columns from wide tables, improving query speed and reducing I/O",
            "It enables full-text search on feature descriptions",
            "It provides transactional consistency needed for concurrent feature writes during training",
          ],
          correctIndex: 1,
          explanation:
            "Redshift's column-oriented storage reads only the columns referenced in a query, skipping irrelevant columns. For ML feature engineering where queries typically aggregate 5-10 features from tables with 100+ columns, this dramatically reduces I/O and query time compared to row-oriented storage.",
        },
      ],
    },
    {
      heading: "Redshift Spectrum for S3 Queries",
      body: `Redshift Spectrum extends Redshift SQL to data stored in S3 without loading it into Redshift tables. Spectrum queries use external tables defined in the Glue Data Catalog, enabling joins between data in Redshift (warm, frequently accessed) and data in S3 (cold historical or raw data). For ML, Spectrum enables feature engineering SQL that joins a Redshift customer dimension table with years of historical S3 clickstream data — combining the data warehouse and data lake in a single query.

Spectrum scales independently of the Redshift cluster — it uses thousands of Redshift Spectrum nodes to process S3 data in parallel. Best practices for Spectrum query performance align with Athena: use Parquet or ORC format with Snappy compression and partition by common filter columns. Spectrum is charged per TB scanned, similar to Athena. For ML pipelines that need both warehouse (structured, aggregated) and lake (historical raw events) data in the same feature query, Redshift + Spectrum is the appropriate choice over Athena alone.`,
      quiz: [
        {
          question:
            "An ML feature pipeline needs to join Redshift warehouse customer data with 5 years of raw S3 clickstream data. Loading the S3 data into Redshift is cost-prohibitive. What is the correct solution?",
          options: [
            "Use Athena to query S3 data and join the result with Redshift in application code",
            "Use Redshift Spectrum — create external tables on S3 data and join with Redshift tables in a single SQL query",
            "Use AWS Glue ETL to load S3 clickstream data into Redshift for the join",
            "Use Amazon EMR to merge both datasets and output features to S3",
          ],
          correctIndex: 1,
          explanation:
            "Redshift Spectrum allows joining Redshift tables with external S3 tables in a single SQL query. The Spectrum layer processes S3 data in parallel and returns results to the Redshift leader node for the join. This eliminates the need to load large S3 datasets into Redshift while still enabling rich JOIN operations.",
        },
      ],
    },
    {
      heading: "Redshift ML: Training and Inference in SQL",
      body: `Redshift ML integrates SageMaker Autopilot directly into Redshift SQL. You call \`CREATE MODEL\` with a SELECT statement that defines training data and a target column — Redshift exports the data to S3, triggers SageMaker Autopilot to train and evaluate models, and creates a SQL function you use to run inference: \`SELECT predict_churn(customer_id, tenure, spend) FROM customers\`. This end-to-end ML workflow happens within SQL without ever leaving Redshift.

Redshift ML supports classification, regression, and time-series forecasting models. It is appropriate for data that already lives in Redshift and where the simplicity of SQL-driven ML outweighs the flexibility of a full SageMaker pipeline. For the MLS-C01 exam, understand that Redshift ML lowers the barrier to ML for SQL-centric teams — a data analyst can train and run models without Python code. However, it is not a replacement for SageMaker when deep customization, advanced algorithms, or production MLOps features are required.`,
      quiz: [
        {
          question:
            "A data analyst wants to predict customer churn using data already in Redshift without writing Python or using SageMaker directly. What feature enables this?",
          options: [
            "Redshift Spectrum — query churn prediction results from S3",
            "Redshift ML — use CREATE MODEL with a training query and SELECT predict_churn() for inference in SQL",
            "Redshift Concurrency Scaling — run more prediction queries in parallel",
            "Redshift Materialized Views — pre-compute churn scores as a materialized view",
          ],
          correctIndex: 1,
          explanation:
            "Redshift ML integrates SageMaker Autopilot into Redshift SQL. CREATE MODEL defines training data via a SELECT, trains the model via SageMaker Autopilot, and creates a SQL prediction function. Analysts run inference using standard SELECT statements — no Python or SageMaker console required.",
        },
      ],
    },
    {
      heading: "Data Distribution and Sort Keys for ML Queries",
      body: `Redshift distributes rows across compute nodes using a distribution style. KEY distribution places rows with the same join key on the same node — critical for large joins between fact and dimension tables to avoid expensive data redistribution across nodes. ALL distribution copies a small dimension table to every node — appropriate for small reference tables joined frequently. EVEN distribution distributes round-robin — appropriate for tables not frequently joined. Choosing the wrong distribution style for ML feature join queries causes heavy data movement (called redistribution) that slows query performance.

Sort keys determine the physical order of rows on disk. Compound sort keys sort by multiple columns in order — useful when queries always filter by the same leading column (date, customer_id). Interleaved sort keys give equal weight to all sort key columns — useful when queries filter by different column combinations. For ML feature queries that filter by date range and join by customer ID, a compound sort key on (date, customer_id) with KEY distribution on customer_id gives optimal performance.`,
      quiz: [
        {
          question:
            "An ML feature query frequently joins a large Redshift fact table with a small dimension table on customer_id. Which distribution styles minimize data movement?",
          options: [
            "EVEN for fact table, EVEN for dimension table",
            "KEY distribution on customer_id for the fact table, ALL distribution for the dimension table",
            "KEY on customer_id for both tables — matching keys go to the same nodes",
            "ALL distribution for both tables — every node has all data",
          ],
          correctIndex: 1,
          explanation:
            "KEY distribution on customer_id places fact rows with the same customer_id on the same node, enabling co-located joins. ALL distribution replicates the small dimension table to every node, ensuring it is always available for local joins regardless of which node the fact row is on. Together, they eliminate network data redistribution.",
        },
      ],
    },
    {
      heading: "Exporting Redshift Data for SageMaker Training",
      body: `After computing features in Redshift, you export them to S3 for SageMaker Training Jobs using UNLOAD. The UNLOAD command writes query results to S3 in parallel across all Redshift nodes, producing multiple files that SageMaker can consume directly. UNLOAD supports Parquet format with partition syntax, enabling direct export of Redshift-computed features into a SageMaker-ready Parquet dataset. For large feature tables, UNLOAD is significantly faster than reading from a JDBC connection because it leverages Redshift's MPP parallelism.

The complete ML data pipeline for Redshift-centric architectures is: raw data loaded into Redshift (via DMS, Glue, or Firehose) → SQL feature engineering (aggregations, joins, transformations) → UNLOAD to S3 in Parquet → SageMaker Training Job → model artifact to S3 → SageMaker endpoint. Understanding this pipeline pattern — where Redshift is the feature computation layer and S3 is the handoff point to SageMaker — is key for MLS-C01 architecture questions.`,
      quiz: [
        {
          question:
            "What is the most efficient way to export ML features computed in Redshift to S3 for SageMaker training?",
          options: [
            "Use a Lambda function to read from Redshift via JDBC and write to S3 in chunks",
            "Use UNLOAD to write query results to S3 in parallel Parquet files across all Redshift nodes",
            "Use AWS DMS to replicate the Redshift feature table to S3 incrementally",
            "Use Glue ETL to read from Redshift via JDBC and write Parquet to S3",
          ],
          correctIndex: 1,
          explanation:
            "UNLOAD writes query results to S3 in parallel using all Redshift compute nodes, producing multiple files. It is the fastest way to export large feature tables from Redshift and supports Parquet format directly. Lambda JDBC and Glue JDBC reads are slower because they use a single connection rather than MPP parallelism.",
        },
      ],
    },
  ],

  keyFacts: [
    "Redshift is an MPP column-oriented data warehouse — optimized for OLAP, not OLTP",
    "Redshift Serverless: auto-scales compute (RPU) — no cluster management for variable workloads",
    "Redshift Spectrum: query S3 data via external tables and join with Redshift tables in a single SQL",
    "Redshift ML: CREATE MODEL → SageMaker Autopilot → SQL prediction function — end-to-end ML in SQL",
    "Distribution styles: KEY (co-locate joins), ALL (small tables on every node), EVEN (no joins)",
    "Sort keys: compound (multi-column ordered) vs. interleaved (equal weight per column)",
    "UNLOAD: export features to S3 in parallel Parquet — fastest Redshift-to-S3 transfer method",
    "Column-oriented storage: reads only queried columns — critical for wide ML feature tables",
    "Spectrum charges per TB scanned — use Parquet + partitioning for cost efficiency",
    "Redshift ML is for SQL-centric teams; SageMaker Pipelines for full MLOps control",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Glue",
    "Amazon SageMaker",
    "Amazon Athena",
    "AWS Lake Formation",
    "Amazon Kinesis Data Firehose",
  ],

  examTips: [
    "Redshift Spectrum = joins between Redshift tables and S3 external tables in one SQL query",
    "Redshift ML = CREATE MODEL + SageMaker Autopilot integration — ML without leaving SQL",
    "UNLOAD exports features to S3 in parallel Parquet — use it to feed SageMaker training",
    "KEY distribution = co-locate join key on same node; ALL = small tables on every node",
    "Redshift vs. Athena: Redshift for complex joins with warehouse data; Athena for pure S3 SQL",
    "Redshift + Spectrum = hybrid data lake/warehouse queries combining warm and cold data",
    "Compound sort keys match query filter order; interleaved suit multi-column filter combinations",
    "Redshift ML is NOT a replacement for SageMaker — it lacks MLOps, custom algorithms, and monitoring",
  ],

  topicQuiz: [
    {
      question:
        "A data team uses Redshift as their primary analytics warehouse and wants ML engineers to train models on Redshift features without custom Python ETL code. Which approach integrates Redshift with SageMaker most directly?",
      options: [
        "Use Redshift JDBC in a SageMaker Processing Job to read features",
        "Use Redshift ML CREATE MODEL which triggers SageMaker Autopilot and creates SQL prediction functions",
        "Use Glue ETL to export Redshift tables to S3 and then run SageMaker Training Jobs",
        "Use Redshift Spectrum to query SageMaker model outputs stored in S3",
      ],
      correctIndex: 1,
      explanation:
        "Redshift ML's CREATE MODEL integrates directly with SageMaker Autopilot — you provide a training query, and Redshift handles data export, model training, and creates a SQL prediction function. This is the most direct Redshift-to-SageMaker integration for SQL-centric teams who want ML without leaving SQL.",
    },
    {
      question:
        "Which Redshift feature allows an ML feature SQL query to join current Redshift warehouse data with 3 years of raw S3 event data without loading the S3 data into Redshift?",
      options: [
        "Redshift ML — it can read S3 data as training input",
        "Redshift Materialized Views — pre-compute and cache the S3 join result",
        "Redshift Spectrum — creates external tables on S3 and joins with Redshift tables in SQL",
        "UNLOAD — reads from S3 and loads into a temporary Redshift table for joining",
      ],
      correctIndex: 2,
      explanation:
        "Redshift Spectrum allows querying external S3 data using the Glue Data Catalog and joining with Redshift internal tables in a single SQL statement. The Spectrum layer processes S3 data in parallel without loading it into Redshift, enabling hybrid queries across both the data warehouse and the data lake.",
    },
  ],
};
