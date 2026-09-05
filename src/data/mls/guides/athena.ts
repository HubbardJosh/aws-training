import { ServiceGuide } from "../../../types/guide";

export const athenaGuide: ServiceGuide = {
  id: "mls-athena",
  service: "Amazon Athena",
  domain: "services",
  tagline:
    "Serverless interactive SQL query service for analyzing ML datasets stored in S3",
  intro:
    "Amazon Athena is a serverless, interactive SQL query service that analyzes data directly in S3 without loading it into a database. It uses the Glue Data Catalog for schema management and supports Parquet, ORC, JSON, CSV, and Avro formats — making it the primary tool for exploratory data analysis on ML datasets stored in S3.",

  sections: [
    {
      heading: "Athena Architecture and How It Works",
      body: `Athena uses Apache Presto under the hood and is fully serverless — you pay per query based on the amount of data scanned (per TB scanned). There are no clusters to provision, no infrastructure to manage, and no data to load. You simply point Athena at S3 data registered in the Glue Data Catalog and run standard SQL. Results are written to an S3 output location and cached for 60 seconds to avoid duplicate charges for identical queries.

For ML workflows, Athena is the EDA tool of choice when data is already in S3. Data scientists can run complex SQL aggregations, distributions, and joins directly on training datasets to understand feature distributions, detect class imbalances, identify outliers, and validate data quality — all without spinning up an EMR cluster or loading data into Redshift. The schema-on-read model means you can query data in its raw form without ETL preprocessing.`,
      quiz: [
        {
          question: "What is the primary cost model for Amazon Athena?",
          options: [
            "Per instance-hour for the Presto cluster running the query",
            "Per query submitted regardless of data scanned",
            "Per TB of data scanned — queries that scan less data cost less",
            "Per row returned in the query result",
          ],
          correctIndex: 2,
          explanation:
            "Athena charges per TB of data scanned. This means that using columnar formats like Parquet and partitioning data to reduce scan volume directly reduces query cost. Queries that scan compressed Parquet files partitioned by date cost far less than queries scanning uncompressed CSV files.",
        },
      ],
    },
    {
      heading: "Optimizing Athena Queries for ML Data",
      body: `Athena query performance and cost are heavily influenced by data format and partitioning. Columnar formats (Parquet, ORC) allow Athena to read only the columns referenced in the SELECT clause, skipping columns not needed by the query. For a training dataset with 100 columns, a query selecting 5 columns scans approximately 5% of the raw data volume — a 95% cost reduction compared to CSV. Compression within Parquet (Snappy, GZIP) further reduces scanned bytes and query time.

Partitioning divides data into directory hierarchies by column values — for example, \`s3://bucket/data/year=2024/month=06/\`. When queries include a WHERE clause filtering by partition column (\`WHERE year = 2024 AND month = 06\`), Athena only scans the matching partitions, skipping irrelevant data. For daily ML training datasets, partitioning by date ensures that queries analyzing a specific time window only scan that window's data. Partition projection (a metadata-free alternative) configures partition rules directly in Athena without requiring Glue Crawler updates for each new partition.`,
      quiz: [
        {
          question:
            "A data scientist queries a 50 TB S3 training dataset in CSV format daily for feature distribution analysis. Monthly Athena costs are very high. What two changes will most reduce costs?",
          options: [
            "Switch to Athena Workgroup with higher limits and increase query parallelism",
            "Convert CSV to Parquet with Snappy compression and partition by date — reduces data scanned per query dramatically",
            "Move data from S3 to Amazon Redshift for faster, cheaper SQL queries",
            "Use Athena result caching and increase the 60-second cache duration",
          ],
          correctIndex: 1,
          explanation:
            "Converting to Parquet reduces scanned data by reading only relevant columns (columnar skip). Snappy compression further reduces bytes scanned. Partitioning by date ensures daily queries only scan that day's partition rather than the full 50 TB. These two changes typically reduce Athena costs by 80-95% for column-selective, time-filtered queries.",
        },
      ],
    },
    {
      heading: "Athena for ML Exploratory Data Analysis",
      body: `Athena's SQL interface makes exploratory data analysis on large datasets accessible to data scientists who are not Spark experts. Common EDA queries in ML preparation include: feature distribution histograms (\`SELECT feature, COUNT(*) FROM data GROUP BY feature\`), null value counts per column, outlier detection (\`WHERE value > AVG(value) + 3*STDDEV(value)\`), class label distribution (checking for imbalance), and join completeness validation (checking if training records have all required feature columns from joined tables).

Athena integrates with Amazon QuickSight for visualization — run SQL queries in Athena and connect QuickSight to visualize feature distributions as charts. For Jupyter notebook-based EDA, the Athena Python SDK (PyAthena or the AWS Data Wrangler library) enables running Athena queries directly from notebook cells and loading results as Pandas DataFrames. This workflow combines Athena's scale (querying TB-scale data in S3) with the Pandas/Python ecosystem familiar to data scientists.`,
      quiz: [
        {
          question:
            "A data scientist in a Jupyter notebook needs to run SQL analysis on a 5 TB training dataset in S3 and load results as a Pandas DataFrame. What is the correct tool combination?",
          options: [
            "Download the dataset to the notebook instance and use pandas.read_csv",
            "Use PyAthena or AWS Data Wrangler to run Athena SQL queries from the notebook and return results as Pandas DataFrames",
            "Load the dataset into Amazon RDS and query with psycopg2",
            "Use Spark in a SageMaker Processing Job and export results to the notebook",
          ],
          correctIndex: 1,
          explanation:
            "PyAthena and AWS Data Wrangler provide Python libraries that execute Athena queries from Jupyter notebooks and return results as Pandas DataFrames. This combines Athena's serverless scale (querying 5 TB in S3 without infrastructure) with the Python/Pandas workflow familiar to data scientists.",
        },
      ],
    },
    {
      heading: "Athena Federated Query and ML Data Integration",
      body: `Athena Federated Query extends SQL analysis beyond S3 to include over 25 additional data sources including RDS, Aurora, DynamoDB, Redshift, ElastiCache, and on-premises databases. Federated queries use Lambda-based connectors — when you query a federated source, Athena invokes a Lambda function that translates the SQL into the source's native query language, executes it, and returns results in a format Athena can join with S3 data.

For ML, federated query enables feature engineering across multiple data sources in a single SQL statement — joining S3-stored behavioral data with RDS customer profiles and DynamoDB session data without ETL preprocessing. This makes it possible to run complex feature SQL across the entire data ecosystem from a single Athena query, outputting the result to S3 for SageMaker Training Job consumption. Athena also integrates with SageMaker directly: you can register Athena as a data source in SageMaker Data Wrangler to build feature pipelines using SQL without separate ETL jobs.`,
      quiz: [
        {
          question:
            "An ML team needs to join S3 click event data with customer profile data stored in RDS for feature engineering. They want to avoid a separate ETL pipeline. What Athena feature allows this?",
          options: [
            "Athena standard queries — it already supports joining S3 and RDS by default",
            "Athena Federated Query with the RDS connector — joins S3 and RDS data in a single SQL statement using Lambda connectors",
            "Athena Workgroup — a dedicated workgroup can access RDS without connectors",
            "Athena CTAS (Create Table As Select) — materializes the join result to a new S3 table",
          ],
          correctIndex: 1,
          explanation:
            "Athena Federated Query uses Lambda-based connectors to query non-S3 sources like RDS. You can join S3 data and RDS data in a single SQL query. The query optimizer dispatches portions of the query to the appropriate source via the Lambda connector and joins the results — eliminating separate ETL preprocessing.",
        },
      ],
    },
    {
      heading: "Athena Workgroups and Cost Control",
      body: `Athena Workgroups provide query isolation, cost control, and access management for multi-team ML environments. Each workgroup has its own query history, query limits (maximum data scanned per query, maximum per-workgroup spend), and output S3 location. Data science teams can be assigned to specific workgroups with cost limits to prevent runaway queries from scanning the entire data lake. Workgroups also enforce encryption settings on query results stored in S3.

CloudWatch metrics for Athena track data scanned and query counts per workgroup, enabling cost allocation dashboards and budget alerts. AWS Budgets can alert when Athena costs exceed a threshold. For multi-team ML environments, the recommended governance pattern is a Workgroup per team with query data scan limits and encrypted output locations — preventing any single team from accidentally scanning the full data lake with an expensive query and ensuring result data is protected.`,
      quiz: [
        {
          question:
            "How can an organization prevent data scientists from accidentally running Athena queries that scan the entire 100 TB data lake?",
          options: [
            "Use IAM policies to restrict which S3 prefixes the data science role can access",
            "Configure an Athena Workgroup for the data science team with a per-query data scan limit",
            "Enable Athena query result reuse so repeated queries don't scan data again",
            "Store training data in compressed Parquet to reduce the effective TB scanned",
          ],
          correctIndex: 1,
          explanation:
            "Athena Workgroups allow setting per-query scan limits — if a query would scan more than the limit, it fails before executing. This prevents expensive runaway queries and forces data scientists to partition-filter their queries appropriately. It is the cost control mechanism in multi-team Athena environments.",
        },
      ],
    },
  ],

  keyFacts: [
    "Athena is serverless SQL on S3 — no infrastructure, pay per TB scanned",
    "Uses Glue Data Catalog for table schemas and partition metadata",
    "Parquet/ORC columnar formats + partitioning reduces cost by 80-95% vs. uncompressed CSV",
    "Partition projection: configure partition rules in Athena without Glue Crawler updates",
    "Federated Query: join S3 with RDS, DynamoDB, Redshift in a single SQL via Lambda connectors",
    "PyAthena and AWS Data Wrangler enable Athena queries from Jupyter notebooks as Pandas DataFrames",
    "Workgroups: query isolation, scan limits, cost control, encrypted output locations",
    "CTAS (Create Table As Select): materialize query results as a new partitioned Parquet table in S3",
    "QuickSight integration: visualize Athena query results in BI dashboards",
    "Results cached 60 seconds — identical queries within the window don't rescan data",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Glue",
    "AWS Lake Formation",
    "Amazon QuickSight",
    "Amazon SageMaker",
    "Amazon Redshift",
  ],

  examTips: [
    "Athena cost optimization = Parquet format + partitioning + column selection — reduces TB scanned",
    "Federated Query = join S3 with non-S3 sources (RDS, DynamoDB) without ETL",
    "Workgroup scan limits = cost control in multi-team environments — not IAM, not S3 policies",
    "Partition projection = metadata-free partition management — no crawler needed for new partitions",
    "Athena is the EDA tool for ML on S3 data — SQL interface, no cluster management",
    "CTAS writes query results as a new Parquet/partitioned table in S3 — useful for feature materialization",
    "Data scanned = the billing unit — always scan less to pay less (filter, compress, columnize)",
    "Athena + SageMaker Data Wrangler integration: use SQL feature engineering without separate ETL",
  ],

  topicQuiz: [
    {
      question:
        "A data scientist runs an Athena query on a 10 TB CSV training dataset and scans the full 10 TB because there is no partitioning. Which two changes will most reduce the cost of this query?",
      options: [
        "Convert CSV to Parquet with column compression, and partition data by a column referenced in the WHERE clause",
        "Run the query in a different Athena Workgroup with lower per-TB pricing",
        "Enable Athena result caching and run the query during off-peak hours for lower rates",
        "Move data to S3 Glacier before querying — Glacier data is cheaper to scan",
      ],
      correctIndex: 0,
      explanation:
        "Parquet's columnar format allows Athena to skip columns not referenced in SELECT, and compression reduces bytes scanned. Partitioning by a WHERE clause column (e.g., date) limits scan to only the relevant partition. Together, these changes can reduce scanned data by 80-95%, directly reducing Athena cost proportionally.",
    },
    {
      question:
        "Which AWS service would you use to query a training dataset stored in S3 using SQL directly from a Jupyter notebook and load the results as a Pandas DataFrame?",
      options: [
        "Amazon RDS — load the dataset into RDS and query with SQLAlchemy",
        "Amazon EMR — run a PySpark SQL job and return results to the notebook",
        "Amazon Athena with PyAthena or AWS Data Wrangler — serverless SQL on S3 with Pandas integration",
        "Amazon Redshift — copy S3 data to Redshift and query with psycopg2",
      ],
      correctIndex: 2,
      explanation:
        "Athena with PyAthena or AWS Data Wrangler provides serverless SQL on S3 data directly from Jupyter notebooks. AWS Data Wrangler's \`wr.athena.read_sql_query()\` runs Athena SQL and returns a Pandas DataFrame in one call — the most efficient path for EDA on large S3 datasets without infrastructure.",
    },
  ],
};
