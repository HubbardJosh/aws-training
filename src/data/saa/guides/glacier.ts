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
    },
    {
      heading: "Vaults, Archives, and Vault Lock",
      body: `When using Glacier directly via the Glacier API (rather than as an S3 storage class), data is organized into vaults (containers) and archives (individual data objects up to 40 TB each). Vault Lock enforces compliance controls by applying a Vault Lock policy that, once locked, cannot be changed or deleted — not even by the root account. This provides Write Once Read Many (WORM) protection critical for compliance with regulations like SEC Rule 17a-4, HIPAA, and CJIS. A Vault Lock policy is first applied in an in-progress state for validation, then locked within 24 hours to make it immutable. Common Vault Lock policies include denying delete operations, requiring multi-factor authentication for delete, and enforcing minimum retention periods. For most new workloads, S3 Glacier storage classes (accessed via S3 APIs) are preferred over the native Glacier API, but Vault Lock compliance controls remain a key exam topic.`,
    },
    {
      heading: "S3 Lifecycle Policies for Glacier Transitions",
      body: `The most common way data reaches Glacier is through S3 lifecycle policies that automatically transition objects from warmer storage classes to Glacier storage classes based on age. A typical lifecycle policy might transition objects from S3 Standard to S3 Standard-IA after 30 days, to S3 Glacier Instant Retrieval after 90 days, to S3 Glacier Flexible Retrieval after 180 days, and expire (delete) objects after 7 years. Lifecycle transitions follow a one-way, downward direction through the storage class hierarchy — you cannot transition from Glacier back to S3 Standard via a lifecycle rule; retrieval copies the object back to S3 temporarily. Minimum storage duration charges apply to each storage class (30 days for Standard-IA, 90 days for Glacier Instant Retrieval, 90 days for Glacier Flexible, 180 days for Glacier Deep Archive) — deleting objects before these minimums still incurs the full minimum duration charge. Lifecycle policies apply to all objects or to objects matching specific prefixes and tags.`,
    },
    {
      heading: "Retrieval Policies and Expedited Retrievals",
      body: `For S3 Glacier Flexible Retrieval, retrieval jobs must be initiated before data can be accessed, and retrieval time depends on the tier selected. Expedited retrievals (1–5 minutes) are the fastest but most expensive and require either on-demand capacity (best-effort availability) or provisioned retrieval capacity. Provisioned capacity guarantees that Expedited retrievals can be completed within 1–5 minutes, with capacity purchased in units of three Expedited retrievals per minute — appropriate for DR scenarios where fast recovery is critical. Standard retrievals (3–5 hours) are the default and appropriate for regular restore operations. Bulk retrievals (5–12 hours) are the most cost-effective for restoring large amounts of data when time is not a constraint, such as periodic compliance reporting or migrating data to another region. For S3 Glacier Deep Archive, Standard retrieval is 12 hours and Bulk is 48 hours — there is no Expedited tier.`,
    },
    {
      heading: "Compliance and Data Governance Use Cases",
      body: `Glacier is purpose-built for compliance-driven data retention requirements that mandate long-term storage with protection against deletion. Financial services firms retain trade records for 7 years (SEC regulations), healthcare organizations retain patient records for 6–10 years (HIPAA, state laws), and legal firms retain case files indefinitely. S3 Object Lock in Compliance mode (applied to S3 buckets with versioning enabled) provides the same WORM guarantees as Vault Lock but within the S3 API — objects locked in Compliance mode cannot be deleted or overwritten for the specified retention period, even by the root account, satisfying the same regulatory requirements while benefiting from S3's richer feature set, lifecycle management, and replication capabilities. Governance mode is a softer version that allows authorized IAM users with the \`s3:BypassGovernanceRetention\` permission to override the lock, useful for testing or legitimate business exceptions.`,
    },
    {
      heading: "Cost Optimization and Data Retrieval Architecture",
      body: `Glacier's cost advantage comes entirely from low storage pricing, offset by retrieval costs and minimum duration charges — optimizing for Glacier requires understanding when data will actually be retrieved. The optimal Glacier tier is determined by three factors: how often data is accessed (quarterly or less for Instant, annually or less for Flexible, almost never for Deep Archive), how quickly it must be retrieved when needed (milliseconds, hours, or days), and the minimum storage duration charge for the chosen tier. A common architecture for backup and recovery uses AWS Backup to centrally manage backup policies across EC2, EBS, RDS, DynamoDB, and EFS, with long-term backups automatically tiered to Glacier based on age. For restoring data at scale (bulk restore of many Glacier objects), the S3 Batch Operations service can initiate restores for millions of objects in a single job, tracking progress and triggering Lambda functions or SNS notifications on completion.`,
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
};
