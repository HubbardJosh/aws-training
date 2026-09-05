import { ServiceGuide } from "../../../types/guide";

export const lakeFormationGuide: ServiceGuide = {
  id: "mls-lake-formation",
  service: "AWS Lake Formation",
  domain: "services",
  tagline:
    "Centralized data lake governance service with fine-grained access control for ML data",
  intro:
    "AWS Lake Formation simplifies building, securing, and managing data lakes by providing centralized access control, automated data ingestion via Blueprints, data catalog management via the Glue Data Catalog, and cross-account data sharing — enabling ML teams to access the right data with the right permissions.",

  sections: [
    {
      heading: "Lake Formation Data Lake Concept and Architecture",
      body: `A data lake is a centralized repository that stores structured, semi-structured, and unstructured data at any scale in its raw form. In AWS, S3 serves as the data lake storage layer, and Lake Formation serves as the governance and access control layer on top of it. Lake Formation manages permissions on both the Glue Data Catalog (table and column metadata) and the underlying S3 data, providing a unified permission model that replaces the combination of S3 bucket policies + IAM policies + Glue resource policies that teams previously had to configure separately.

The key insight is that Lake Formation provides column-level and row-level access control on data stored in S3 and cataloged in Glue — capabilities that IAM and S3 policies alone cannot provide at the column or row level. For ML, this means a data scientist can be granted read access to specific columns of a training dataset (e.g., all columns except PII columns) without requiring a separate S3 bucket per permission profile. The same physical dataset serves all consumers with fine-grained access enforced centrally.`,
      quiz: [
        {
          question:
            "What governance capability does AWS Lake Formation provide that S3 bucket policies and IAM policies cannot achieve at scale?",
          options: [
            "Encryption of data at rest using KMS — IAM policies cannot control encryption",
            "Column-level and row-level access control on data stored in S3 and cataloged in Glue",
            "Automatic data format conversion from CSV to Parquet for ML training",
            "Cross-region data replication for ML training in multiple regions",
          ],
          correctIndex: 1,
          explanation:
            "Lake Formation provides column-level and row-level permissions on Glue Data Catalog tables — capabilities that cannot be achieved with S3 bucket policies or IAM policies alone, which operate at the object/bucket level. This enables fine-grained access control on ML training data without creating separate physical datasets per permission profile.",
        },
      ],
    },
    {
      heading: "Lake Formation Permissions Model",
      body: `Lake Formation uses a permission model layered on top of IAM. There are two layers: IAM permissions (which must allow the action) and Lake Formation permissions (which are additionally required). Both must grant access for a principal to successfully query data. Lake Formation permissions are granted on catalog resources: databases, tables, columns, and underlying S3 data locations. Permissions include SELECT, INSERT, DELETE, ALTER, DESCRIBE, and CREATE.

The Lake Formation administrator configures a Data Lake Admin who can grant permissions to other principals. Tag-based access control (LF-Tags) enables attribute-based access control (ABAC): you assign tags (e.g., \`sensitivity=PII\`, \`domain=finance\`) to database tables and columns, then grant permissions based on tag values rather than listing individual tables. This scales elegantly for ML environments with hundreds of datasets — you grant a data scientist access to all tables tagged \`sensitivity=public\` without enumerating every table.`,
      quiz: [
        {
          question:
            "A data lake has 500 tables tagged with sensitivity levels (public, internal, restricted). How can a data science team be granted access to all 'public' tables without listing each one?",
          options: [
            "Create an IAM policy listing all 500 table ARNs",
            "Create separate S3 buckets for public, internal, and restricted data",
            "Use Lake Formation LF-Tags — grant the team access to all resources tagged sensitivity=public",
            "Use Glue Data Catalog resource policies to filter by table name prefix",
          ],
          correctIndex: 2,
          explanation:
            "Lake Formation tag-based access control (LF-Tags) enables attribute-based access control. Tagging tables with sensitivity=public and granting the team access to all tables with that tag is scalable — new public tables added in the future are automatically accessible without updating the permission grant.",
        },
      ],
    },
    {
      heading: "Lake Formation Blueprints for Data Ingestion",
      body: `Lake Formation Blueprints are pre-defined workflow templates for ingesting data into the data lake. Available Blueprint types include Database Snapshot (full load from a JDBC source like RDS or on-premises database), Incremental Database (captures changes since the last workflow run using a bookmark column), and Log File (ingests log files from S3). Blueprints use AWS Glue under the hood and create the necessary Glue connections, crawlers, and ETL jobs automatically.

For ML pipelines, Blueprints simplify the initial data lake population step. A database snapshot Blueprint can ingest a production RDS MySQL database into S3 as Parquet, catalog it in Glue, and apply Lake Formation permissions — with all infrastructure managed by Lake Formation. This eliminates manual Glue connection and ETL job configuration for standard ingestion patterns. Incremental blueprints then keep the data lake current as source data changes.`,
      quiz: [
        {
          question:
            "An ML team wants to replicate a production PostgreSQL database into their S3 data lake with daily incremental updates. Which Lake Formation feature simplifies this?",
          options: [
            "Lake Formation LF-Tags — tag the database for incremental ingestion",
            "Lake Formation Blueprints — use the Incremental Database blueprint to capture changes since the last run",
            "Lake Formation Cross-Account Access — share the RDS database across accounts",
            "Lake Formation Column-level permissions — grant ML team access to RDS columns directly",
          ],
          correctIndex: 1,
          explanation:
            "Lake Formation's Incremental Database Blueprint automates the ingestion of changes from JDBC sources (like PostgreSQL) since the last run. It creates the required Glue connections, ETL jobs, and crawlers automatically, providing a managed daily incremental ingestion pipeline without custom code.",
        },
      ],
    },
    {
      heading: "Cross-Account Data Sharing",
      body: `Lake Formation enables cross-account data sharing, allowing a central data lake account to share specific tables or databases with consumer accounts (analytics teams, ML accounts, partner organizations) without copying data. The producer account grants Lake Formation permissions to the consumer account's IAM role, and the consumer's IAM principal can query the shared data via Athena or EMR without the data moving to the consumer account.

This is particularly valuable in multi-account ML architectures where production data lives in a data engineering account and ML training happens in a separate ML account. The ML account can access the latest production data through Lake Formation cross-account sharing without giving ML engineers broad access to the production account. Access revocation is immediate — removing the cross-account grant stops access without requiring data deletion or policy updates across multiple accounts.`,
      quiz: [
        {
          question:
            "An organization wants ML engineers in a separate AWS account to access training data stored in a central data lake account without copying the data. Which Lake Formation feature enables this?",
          options: [
            "Lake Formation Blueprints — create an ingestion job that copies data to the ML account",
            "Lake Formation cross-account data sharing — grant the ML account access to specific catalog tables without data movement",
            "S3 Cross-Region Replication — replicate training data to the ML account's S3 bucket",
            "Glue Data Catalog replication — copy the catalog schema to the ML account",
          ],
          correctIndex: 1,
          explanation:
            "Lake Formation cross-account sharing allows a central data lake account to grant access to specific catalog tables to principals in other accounts. The data remains in the producer account — no copying required. This is the standard multi-account ML data access pattern for organizations with centralized data lakes.",
        },
      ],
    },
    {
      heading: "Lake Formation and ML Security Best Practices",
      body: `In ML workflows, Lake Formation addresses three key security concerns. First, PII isolation: tag columns containing PII (names, SSNs, email addresses) and restrict access so only approved data processing roles (not ML training roles) can read them. ML training jobs access only the approved non-PII columns, enforcing privacy requirements without restructuring datasets. Second, audit: Lake Formation integrates with CloudTrail to log all data access at the table and column level, providing complete audit trails for compliance.

Third, least-privilege training data access: ML training roles are granted the minimum columns from the minimum tables needed for a specific training job. Different ML projects accessing different portions of the same data lake get scoped permissions without dataset duplication. Combined with SageMaker VPC endpoints and IAM execution roles, Lake Formation forms the access control layer in a defense-in-depth security architecture for ML training data. For the MLS-C01 exam, Lake Formation is the answer when questions involve fine-grained column-level access control on ML data.`,
      quiz: [
        {
          question:
            "An ML training dataset contains customer age and purchase history (safe for training) plus customer names and email addresses (PII, not allowed in training). How should access be configured?",
          options: [
            "Create two S3 buckets: one with PII columns removed for training, one with all columns for reporting",
            "Use Lake Formation column-level permissions to grant the ML training role access to only the non-PII columns",
            "Encrypt the PII columns using KMS and give the ML training role a key policy that denies decryption",
            "Use IAM condition keys to restrict access to specific column names in S3",
          ],
          correctIndex: 1,
          explanation:
            "Lake Formation column-level permissions allow granting SELECT access on specific columns to the ML training role, excluding PII columns. The single physical dataset serves both ML (restricted columns) and reporting (all columns) with fine-grained access enforced centrally — no data duplication required.",
        },
      ],
    },
  ],

  keyFacts: [
    "Lake Formation = governance layer on top of S3 + Glue Data Catalog — not a storage service",
    "Provides column-level and row-level access control that IAM/S3 policies alone cannot achieve",
    "LF-Tags: attribute-based access control — tag resources and grant permissions by tag value",
    "Both IAM AND Lake Formation permissions must allow access — additive security layers",
    "Blueprints: pre-built ingestion workflows (Database Snapshot, Incremental, Log File)",
    "Cross-account sharing: share tables without data movement — ML account queries central data lake",
    "CloudTrail integration provides column-level audit trails for compliance",
    "Lake Formation admin delegates permissions without requiring broad IAM policies",
    "PII isolation: tag PII columns and restrict to approved roles — ML training roles get non-PII only",
    "Fine-grained access without dataset duplication — one physical dataset, multiple permission profiles",
  ],

  relatedServices: [
    "AWS Glue",
    "Amazon S3",
    "Amazon Athena",
    "Amazon EMR",
    "Amazon SageMaker",
    "AWS IAM",
  ],

  examTips: [
    "Lake Formation = column-level and row-level permissions — the answer for fine-grained ML data access",
    "LF-Tags = scalable ABAC; use when you have many tables with shared classification attributes",
    "Both IAM and Lake Formation must grant access — missing either layer blocks access",
    "Cross-account sharing = no data copying; central data lake serves multiple consumer accounts",
    "Blueprints automate standard ingestion patterns — database snapshot, incremental, log file",
    "Lake Formation is the PII isolation answer for ML training: restrict columns without duplicating data",
    "CloudTrail logs all Lake Formation data access at the column level for compliance auditing",
    "Lake Formation permissions override S3 bucket policy granularity — enables column scoping beyond object-level S3",
  ],

  topicQuiz: [
    {
      question:
        "An organization has 300 data lake tables, each tagged with a data classification (public, internal, confidential). Data scientists should access only public tables. What is the most scalable way to grant this access?",
      options: [
        "Create an IAM policy listing all 300 public table ARNs",
        "Grant Lake Formation permissions using LF-Tags — grant SELECT on all resources where classification=public",
        "Create separate S3 buckets for each classification and grant S3 access to the public bucket",
        "Use Glue resource policies to filter table access by the public tag",
      ],
      correctIndex: 1,
      explanation:
        "LF-Tag-based access control grants permissions based on tag values rather than specific resource ARNs. Granting access to all resources tagged classification=public means new public tables added in the future are automatically accessible — far more scalable than maintaining a 300-item IAM policy that needs updating with every new table.",
    },
    {
      question:
        "A centralized data engineering team in Account A wants to share processed ML training datasets with an ML team in Account B without copying data. Which Lake Formation feature enables this?",
      options: [
        "Lake Formation Blueprints — create a blueprint that replicates data to Account B",
        "S3 bucket policy allowing Account B IAM roles to read the training data directly",
        "Lake Formation cross-account data sharing — grant Account B's ML role access to specific catalog tables",
        "AWS Resource Access Manager (RAM) to share the S3 bucket across accounts",
      ],
      correctIndex: 2,
      explanation:
        "Lake Formation cross-account data sharing allows Account A to grant specific table access to Account B's principals through Lake Formation permissions. Account B queries the data via Athena or EMR without the data being copied — it remains in Account A's S3. This is the managed, auditable pattern for multi-account ML data access.",
    },
  ],
};
