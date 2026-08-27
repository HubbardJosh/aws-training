import { ServiceGuide } from "../../../types/guide";

export const glacierGuide: ServiceGuide = {
  id: "saa-glacier",
  service: "Amazon S3 Glacier",
  domain: "services",
  tagline:
    "Ultra-low-cost archival storage for long-term data retention and compliance",
  intro:
    "Amazon S3 Glacier is a family of low-cost archival storage classes within Amazon S3 designed for data that is rarely accessed but must be retained for months, years, or decades — offering different retrieval speed tiers from milliseconds to hours at dramatically lower storage costs than S3 Standard.",

  sections: [
    {
      heading: "Glacier Storage Classes: Instant, Flexible, and Deep Archive",
      body: `The S3 Glacier family encompasses three distinct storage classes that trade retrieval speed for storage cost. S3 Glacier Instant Retrieval provides the same millisecond access as S3 Standard but at archival pricing (approximately 68% cheaper than Standard) — it is designed for data accessed quarterly or less frequently, such as medical images, news media, and genomics data. S3 Glacier Flexible Retrieval (the classic Glacier) offers three retrieval tiers: Expedited (1–5 minutes, highest cost), Standard (3–5 hours, mid-range cost), and Bulk (5–12 hours, lowest cost per GB retrieved) — appropriate for backups, compliance archives, and disaster recovery datasets. S3 Glacier Deep Archive is the lowest-cost storage option in AWS, with Standard retrieval in 12 hours and Bulk retrieval in 48 hours, designed for data retained for 7–10+ years for regulatory compliance (financial records, healthcare data, legal documents) that is almost never accessed.`,
      quiz: [
        {
          question:
            "A company needs archival storage for medical imaging data that is accessed approximately once per quarter and requires millisecond retrieval times. Which S3 Glacier storage class should they use?",
          options: [
            "S3 Glacier Flexible Retrieval",
            "S3 Glacier Deep Archive",
            "S3 Glacier Instant Retrieval",
            "S3 Standard-IA",
          ],
          correctIndex: 2,
          explanation:
            "S3 Glacier Instant Retrieval provides millisecond access at archival pricing and is specifically designed for data accessed quarterly or less frequently, such as medical images. Flexible Retrieval and Deep Archive have retrieval times measured in hours.",
        },
        {
          question:
            "What are the three retrieval tiers available for S3 Glacier Flexible Retrieval, in order from fastest to slowest?",
          options: [
            "Instant, Standard, Bulk",
            "Expedited, Standard, Bulk",
            "Fast, Medium, Slow",
            "Premium, Standard, Economy",
          ],
          correctIndex: 1,
          explanation:
            "S3 Glacier Flexible Retrieval offers Expedited (1–5 minutes), Standard (3–5 hours), and Bulk (5–12 hours) retrieval tiers. There is no 'Instant' tier in Flexible Retrieval — that is a separate storage class.",
        },
        {
          question:
            "What is the Standard retrieval time for S3 Glacier Deep Archive?",
          options: ["1–5 minutes", "3–5 hours", "12 hours", "48 hours"],
          correctIndex: 2,
          explanation:
            "S3 Glacier Deep Archive has a Standard retrieval time of 12 hours and a Bulk retrieval time of 48 hours. It is the lowest-cost storage in AWS and designed for data that is almost never accessed.",
        },
      ],
    },
    {
      heading: "Vaults, Archives, and Vault Lock",
      body: `When using Glacier directly via the Glacier API (rather than as an S3 storage class), data is organized into vaults (containers) and archives (individual data objects up to 40 TB each). Vault Lock enforces compliance controls by applying a Vault Lock policy that, once locked, cannot be changed or deleted — not even by the root account. This provides Write Once Read Many (WORM) protection critical for compliance with regulations like SEC Rule 17a-4, HIPAA, and CJIS. A Vault Lock policy is first applied in an in-progress state for validation, then locked within 24 hours to make it immutable. Common Vault Lock policies include denying delete operations, requiring multi-factor authentication for delete, and enforcing minimum retention periods. For most new workloads, S3 Glacier storage classes (accessed via S3 APIs) are preferred over the native Glacier API, but Vault Lock compliance controls remain a key exam topic.`,
      quiz: [
        {
          question:
            "A financial services company must comply with SEC Rule 17a-4, which requires that records cannot be altered or deleted for a specified retention period. Which Glacier feature provides this WORM protection?",
          options: [
            "Glacier Flexible Retrieval with provisioned capacity",
            "Vault Lock policy once locked",
            "S3 Lifecycle policy with expiration disabled",
            "IAM policy denying DeleteObject",
          ],
          correctIndex: 1,
          explanation:
            "Vault Lock creates an immutable compliance policy that, once locked, cannot be changed or deleted even by the root account. This provides WORM (Write Once Read Many) protection required by regulations like SEC Rule 17a-4. An IAM policy can be modified by privileged users and does not provide the same immutability guarantee.",
        },
        {
          question:
            "After applying a Vault Lock policy in the in-progress state, within how long must it be locked to become immutable?",
          options: ["1 hour", "12 hours", "24 hours", "7 days"],
          correctIndex: 2,
          explanation:
            "A Vault Lock policy is initially applied in an in-progress state, giving administrators time to validate it. It must be locked within 24 hours to become immutable. If not locked within 24 hours, the in-progress policy is automatically removed.",
        },
        {
          question:
            "For new workloads requiring WORM compliance, which is the preferred approach over native Glacier Vault Lock?",
          options: [
            "S3 Object Lock in Governance mode",
            "S3 Object Lock in Compliance mode",
            "IAM Permissions Boundary denying deletes",
            "S3 Bucket Policy with explicit deny on DeleteObject",
          ],
          correctIndex: 1,
          explanation:
            "S3 Object Lock in Compliance mode provides the same WORM guarantees as Vault Lock but via the S3 API, offering richer features, lifecycle management, and replication. Compliance mode prevents deletion even by the root account, matching Vault Lock's immutability. Governance mode allows authorized users to override it, and IAM/bucket policies can be modified by privileged users.",
        },
      ],
    },
    {
      heading: "S3 Lifecycle Policies for Glacier Transitions",
      body: `The most common way data reaches Glacier is through S3 lifecycle policies that automatically transition objects from warmer storage classes to Glacier storage classes based on age. A typical lifecycle policy might transition objects from S3 Standard to S3 Standard-IA after 30 days, to S3 Glacier Instant Retrieval after 90 days, to S3 Glacier Flexible Retrieval after 180 days, and expire (delete) objects after 7 years. Lifecycle transitions follow a one-way, downward direction through the storage class hierarchy — you cannot transition from Glacier back to S3 Standard via a lifecycle rule; retrieval copies the object back to S3 temporarily. Minimum storage duration charges apply to each storage class (30 days for Standard-IA, 90 days for Glacier Instant Retrieval, 90 days for Glacier Flexible, 180 days for Glacier Deep Archive) — deleting objects before these minimums still incurs the full minimum duration charge. Lifecycle policies apply to all objects or to objects matching specific prefixes and tags.`,
      quiz: [
        {
          question:
            "A lifecycle policy transitions an object to S3 Glacier Deep Archive. The object is deleted 60 days after the transition. What is the minimum storage duration charge the customer will incur for the Deep Archive class?",
          options: ["60 days", "90 days", "180 days", "365 days"],
          correctIndex: 2,
          explanation:
            "S3 Glacier Deep Archive has a minimum storage duration of 180 days. Even though the object was deleted after only 60 days, the customer is charged for the full 180-day minimum. This minimum duration must be factored into cost analysis when considering Deep Archive for short-retention scenarios.",
        },
        {
          question:
            "Can an S3 lifecycle rule transition objects from S3 Glacier Flexible Retrieval back to S3 Standard?",
          options: [
            "Yes, lifecycle rules support transitions in both directions",
            "No, lifecycle transitions are one-way and can only move objects to colder storage classes",
            "Yes, but only if the object was transitioned within the last 30 days",
            "No, but you can use S3 Batch Operations to move objects back",
          ],
          correctIndex: 1,
          explanation:
            "Lifecycle transitions are strictly one-way and can only move objects to colder (lower-cost) storage classes. To restore a Glacier object to S3 Standard, you must initiate a retrieval, which creates a temporary copy in S3. Lifecycle rules cannot reverse this direction.",
        },
        {
          question:
            "What is the minimum storage duration charge for S3 Glacier Instant Retrieval?",
          options: ["30 days", "60 days", "90 days", "180 days"],
          correctIndex: 2,
          explanation:
            "S3 Glacier Instant Retrieval has a minimum storage duration of 90 days, the same as S3 Glacier Flexible Retrieval. S3 Standard-IA has a 30-day minimum, and S3 Glacier Deep Archive has a 180-day minimum.",
        },
      ],
    },
    {
      heading: "Retrieval Policies and Expedited Retrievals",
      body: `For S3 Glacier Flexible Retrieval, retrieval jobs must be initiated before data can be accessed, and retrieval time depends on the tier selected. Expedited retrievals (1–5 minutes) are the fastest but most expensive and require either on-demand capacity (best-effort availability) or provisioned retrieval capacity. Provisioned capacity guarantees that Expedited retrievals can be completed within 1–5 minutes, with capacity purchased in units of three Expedited retrievals per minute — appropriate for DR scenarios where fast recovery is critical. Standard retrievals (3–5 hours) are the default and appropriate for regular restore operations. Bulk retrievals (5–12 hours) are the most cost-effective for restoring large amounts of data when time is not a constraint, such as periodic compliance reporting or migrating data to another region. For S3 Glacier Deep Archive, Standard retrieval is 12 hours and Bulk is 48 hours — there is no Expedited tier.`,
      quiz: [
        {
          question:
            "A disaster recovery plan requires that data archived in S3 Glacier Flexible Retrieval must be accessible within 5 minutes. Which configuration guarantees this requirement?",
          options: [
            "Expedited retrieval with on-demand capacity",
            "Standard retrieval with enhanced throughput",
            "Expedited retrieval with provisioned capacity",
            "Bulk retrieval with priority flag enabled",
          ],
          correctIndex: 2,
          explanation:
            "Provisioned capacity guarantees that Expedited retrievals complete within 1–5 minutes. On-demand Expedited capacity is best-effort and may not be available during high-demand periods. For DR scenarios where 5-minute recovery is a hard requirement, provisioned capacity must be purchased in advance.",
        },
        {
          question:
            "Which retrieval tier is NOT available for S3 Glacier Deep Archive?",
          options: [
            "Standard (12 hours)",
            "Bulk (48 hours)",
            "Expedited (1–5 minutes)",
            "All tiers are available for Deep Archive",
          ],
          correctIndex: 2,
          explanation:
            "S3 Glacier Deep Archive has only Standard (12-hour) and Bulk (48-hour) retrieval tiers. There is no Expedited tier for Deep Archive, which is designed for data that is almost never accessed and where retrieval speed is not critical.",
        },
      ],
    },
    {
      heading: "Compliance and Data Governance Use Cases",
      body: `Glacier is purpose-built for compliance-driven data retention requirements that mandate long-term storage with protection against deletion. Financial services firms retain trade records for 7 years (SEC regulations), healthcare organizations retain patient records for 6–10 years (HIPAA, state laws), and legal firms retain case files indefinitely. S3 Object Lock in Compliance mode (applied to S3 buckets with versioning enabled) provides the same WORM guarantees as Vault Lock but within the S3 API — objects locked in Compliance mode cannot be deleted or overwritten for the specified retention period, even by the root account, satisfying the same regulatory requirements while benefiting from S3's richer feature set, lifecycle management, and replication capabilities. Governance mode is a softer version that allows authorized IAM users with the \`s3:BypassGovernanceRetention\` permission to override the lock, useful for testing or legitimate business exceptions.`,
      quiz: [
        {
          question:
            "What is the key difference between S3 Object Lock Compliance mode and Governance mode?",
          options: [
            "Compliance mode supports versioning; Governance mode does not",
            "Governance mode allows authorized IAM users to override the lock; Compliance mode cannot be overridden even by root",
            "Compliance mode uses KMS encryption; Governance mode uses SSE-S3",
            "Governance mode provides longer retention periods than Compliance mode",
          ],
          correctIndex: 1,
          explanation:
            "The critical difference is who can override the lock. Governance mode allows IAM users with the s3:BypassGovernanceRetention permission to delete or modify locked objects, making it useful for testing. Compliance mode cannot be overridden by anyone, including the root account, for the specified retention period — this is the mode required for strict regulatory compliance.",
        },
        {
          question:
            "S3 Object Lock requires which S3 bucket feature to be enabled?",
          options: [
            "Server-side encryption with KMS",
            "Cross-Region Replication",
            "Versioning",
            "Static website hosting",
          ],
          correctIndex: 2,
          explanation:
            "S3 Object Lock requires versioning to be enabled on the bucket. Versioning allows Object Lock to track and protect each version of an object. Without versioning, Object Lock cannot function because there is no version-level protection mechanism.",
        },
      ],
    },
    {
      heading: "Cost Optimization and Data Retrieval Architecture",
      body: `Glacier's cost advantage comes entirely from low storage pricing, offset by retrieval costs and minimum duration charges — optimizing for Glacier requires understanding when data will actually be retrieved. The optimal Glacier tier is determined by three factors: how often data is accessed (quarterly or less for Instant, annually or less for Flexible, almost never for Deep Archive), how quickly it must be retrieved when needed (milliseconds, hours, or days), and the minimum storage duration charge for the chosen tier. A common architecture for backup and recovery uses AWS Backup to centrally manage backup policies across EC2, EBS, RDS, DynamoDB, and EFS, with long-term backups automatically tiered to Glacier based on age. For restoring data at scale (bulk restore of many Glacier objects), the S3 Batch Operations service can initiate restores for millions of objects in a single job, tracking progress and triggering Lambda functions or SNS notifications on completion.`,
      quiz: [
        {
          question:
            "A company needs to restore millions of objects from S3 Glacier Flexible Retrieval as part of a one-time data migration. Which service should be used to efficiently manage this at scale?",
          options: [
            "AWS DataSync with Glacier integration",
            "S3 Batch Operations to initiate restores for all objects in a single job",
            "A Lambda function that iterates through each object and initiates individual restore jobs",
            "AWS Storage Gateway with Tape Gateway",
          ],
          correctIndex: 1,
          explanation:
            "S3 Batch Operations can initiate restore jobs for millions of Glacier objects in a single managed job, tracking progress and triggering Lambda or SNS on completion. Running individual Lambda invocations per object is inefficient at scale and would require custom orchestration. S3 Batch Operations is purpose-built for large-scale S3 operations.",
        },
        {
          question:
            "Which AWS service provides centralized backup management across EC2, EBS, RDS, DynamoDB, and EFS with automatic tiering to Glacier?",
          options: [
            "AWS DataSync",
            "Amazon S3 Lifecycle Policies",
            "AWS Backup",
            "AWS Storage Gateway",
          ],
          correctIndex: 2,
          explanation:
            "AWS Backup provides centralized backup policy management across multiple AWS services including EC2, EBS, RDS, DynamoDB, and EFS. It can automatically tier long-term backups to S3 Glacier storage classes based on age, reducing storage costs without requiring service-specific backup configurations.",
        },
      ],
    },
  ],

  keyFacts: [
    "Glacier Instant: millisecond retrieval, ~68% cheaper than S3 Standard, for quarterly access",
    "Glacier Flexible: Expedited (1-5 min), Standard (3-5 hr), Bulk (5-12 hr) retrieval tiers",
    "Glacier Deep Archive: 12-hr Standard, 48-hr Bulk retrieval — lowest cost storage in AWS",
    "Vault Lock creates immutable WORM compliance policies that cannot be changed even by root",
    "Minimum storage duration: 30 days (Standard-IA), 90 days (Glacier Instant, Glacier Flexible), 180 days (Deep Archive)",
    "Lifecycle policies automate transitions from S3 Standard → IA → Glacier → Deep Archive",
    "Provisioned retrieval capacity guarantees Expedited (1-5 min) retrievals for DR scenarios",
    "S3 Object Lock Compliance mode provides WORM protection via S3 API (preferred over native Glacier API)",
    "Transitions through storage classes are one-way — retrieval is not a lifecycle transition",
    "S3 Batch Operations can initiate restore jobs for millions of Glacier objects simultaneously",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Backup",
    "AWS Storage Gateway",
    "Amazon S3 Batch Operations",
    "AWS KMS",
    "Amazon CloudWatch",
  ],

  examTips: [
    "Glacier Instant = archival price + millisecond access; Flexible = archival price + hours wait",
    "Deep Archive is for data never or almost never accessed — 12-hour minimum retrieval",
    "Vault Lock (Glacier API) and S3 Object Lock Compliance mode both provide WORM — S3 Object Lock is preferred for new workloads",
    "Minimum storage duration charges apply even if you delete early — know the durations per class",
    "Expedited retrieval + provisioned capacity = DR solution guaranteeing fast Glacier restores",
    "Lifecycle rules cannot transition objects back up the storage class hierarchy (e.g., Glacier → Standard)",
    "S3 Object Lock Compliance cannot be overridden even by root — Governance mode can be overridden by authorized users",
    "For cost questions, Glacier Deep Archive is the cheapest option but has the longest retrieval time",
  ],

  topicQuiz: [
    {
      question:
        "Which S3 Glacier storage class provides millisecond retrieval times at archival pricing?",
      options: [
        "S3 Glacier Flexible Retrieval",
        "S3 Glacier Deep Archive",
        "S3 Glacier Instant Retrieval",
        "S3 Standard-IA",
      ],
      correctIndex: 2,
      explanation:
        "S3 Glacier Instant Retrieval provides millisecond access at approximately 68% lower cost than S3 Standard. It is designed for data accessed quarterly or less, such as medical images and genomics data, where rapid retrieval is still required.",
    },
    {
      question:
        "A company stores compliance records in S3 Glacier Deep Archive. They delete the records after 100 days. What minimum storage duration will they be charged for?",
      options: ["90 days", "100 days", "180 days", "365 days"],
      correctIndex: 2,
      explanation:
        "S3 Glacier Deep Archive has a minimum storage duration charge of 180 days. Deleting objects before this minimum still incurs the full 180-day charge. This must be factored into cost analysis when evaluating Deep Archive for shorter retention requirements.",
    },
    {
      question:
        "Which feature allows a Glacier vault policy to become permanently immutable and unmodifiable even by the root account?",
      options: [
        "Vault Access Policy with explicit deny",
        "S3 Object Lock in Governance mode",
        "Vault Lock (once locked)",
        "IAM permissions boundary on the root account",
      ],
      correctIndex: 2,
      explanation:
        "Vault Lock, once locked, creates a permanently immutable WORM policy that cannot be changed or deleted by anyone, including the root account. This provides the compliance guarantees required by regulations like SEC Rule 17a-4 and HIPAA. Governance mode and IAM policies can be overridden by sufficiently privileged users.",
    },
    {
      question:
        "A DR plan requires guaranteed recovery of S3 Glacier Flexible Retrieval data within 5 minutes. What configuration is required?",
      options: [
        "Standard retrieval with enhanced throughput enabled",
        "Expedited retrieval with on-demand capacity",
        "Expedited retrieval with provisioned capacity",
        "Bulk retrieval initiated 6 hours before the expected need",
      ],
      correctIndex: 2,
      explanation:
        "Provisioned capacity guarantees that Expedited retrievals (1–5 minutes) will succeed. On-demand Expedited capacity is best-effort and may be unavailable during peak demand. For DR with a hard 5-minute SLA, provisioned capacity must be purchased in advance.",
    },
    {
      question:
        "Can an S3 lifecycle rule transition objects from S3 Glacier back to S3 Standard automatically?",
      options: [
        "Yes, lifecycle rules support bidirectional transitions",
        "Yes, but only within 90 days of the initial transition",
        "No, lifecycle transitions are one-way toward colder storage classes",
        "No, but you can use S3 Replication to copy objects back",
      ],
      correctIndex: 2,
      explanation:
        "S3 lifecycle transitions are strictly one-way and can only move objects toward colder (cheaper) storage classes. To access a Glacier object in S3 Standard, you must initiate a restore request, which creates a temporary copy. Lifecycle rules cannot reverse this direction.",
    },
    {
      question:
        "Which S3 Object Lock mode provides WORM protection that cannot be overridden even by the root account, making it suitable for SEC and HIPAA compliance?",
      options: [
        "Governance mode",
        "Compliance mode",
        "Legal Hold",
        "Retention mode",
      ],
      correctIndex: 1,
      explanation:
        "S3 Object Lock Compliance mode prevents objects from being deleted or overwritten for the specified retention period by anyone, including the root account. Governance mode allows authorized IAM users with the s3:BypassGovernanceRetention permission to override the lock, making it unsuitable for strict regulatory compliance.",
    },
    {
      question:
        "Which service should be used to initiate restore jobs for millions of objects stored in S3 Glacier as part of a large-scale data migration?",
      options: [
        "AWS DataSync",
        "S3 Batch Operations",
        "A custom Lambda function iterating through each object",
        "AWS Storage Gateway Tape Gateway",
      ],
      correctIndex: 1,
      explanation:
        "S3 Batch Operations is designed for large-scale S3 operations and can initiate restore jobs for millions of Glacier objects in a single managed job. It tracks progress and can trigger Lambda functions or SNS notifications on completion, making it far more efficient than custom solutions that iterate object by object.",
    },
    {
      question:
        "A company accesses certain archived data once per year and can wait up to 12 hours for retrieval. Which Glacier storage class provides the lowest storage cost for this use case?",
      options: [
        "S3 Glacier Instant Retrieval",
        "S3 Glacier Flexible Retrieval with Bulk tier",
        "S3 Glacier Deep Archive",
        "S3 Standard-IA",
      ],
      correctIndex: 2,
      explanation:
        "S3 Glacier Deep Archive is the lowest-cost storage option in AWS and has a Standard retrieval time of 12 hours, which meets the requirement. Since the data is accessed once per year and a 12-hour wait is acceptable, Deep Archive is more cost-effective than Glacier Flexible Retrieval or Glacier Instant Retrieval.",
    },
  ],
};
