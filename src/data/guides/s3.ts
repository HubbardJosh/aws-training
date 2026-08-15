import { ServiceGuide } from "../../types/guide";

export const s3Guide: ServiceGuide = {
  id: "amazon-s3",
  service: "Amazon S3",
  domain: "development",
  tagline: "Object storage built to store and retrieve any amount of data",
  intro:
    "S3 is an object storage service offering 99.999999999% (11 nines) durability. Objects are stored in buckets and accessed via HTTP/HTTPS. S3 is the foundation for data lakes, static websites, backups, and application artifact storage.",

  sections: [
    {
      heading: "Core Concepts",
      body: `**Buckets**: containers for objects. Globally unique names. Created in a specific region. Unlimited objects per bucket. No hierarchy — prefixes (slashes in key names) simulate folders.

**Objects**: the data + metadata. Identified by a **key** (full path, e.g. \`images/profile/user123.jpg\`). Size: 0 bytes – 5 TB. Objects are immutable — you replace, not modify.

**Key naming**: key = prefix + object name. S3 uses the key prefix to partition storage across multiple servers. Random prefixes historically improved performance (now less critical since S3 auto-partitions at 3,500 PUT/s and 5,500 GET/s per prefix).

**Regions**: data stays in the region unless you explicitly replicate. Choose the region closest to your users or your compute.

**Consistency**: S3 provides **strong read-after-write consistency** for all operations (as of December 2020). New objects are immediately readable; overwrites and deletes are immediately consistent.`,
    },
    {
      heading: "Storage Classes",
      body: `**S3 Standard**: 99.99% availability. 3+ AZ replication. For frequently accessed data. Highest cost per GB stored; no retrieval fee.

**S3 Standard-IA (Infrequent Access)**: 99.9% availability. Lower storage cost; per-GB retrieval fee. Minimum storage duration: 30 days. For data accessed less than once a month.

**S3 One Zone-IA**: single AZ. 20% cheaper than Standard-IA. Data lost if AZ is destroyed. For reproducible infrequent-access data (e.g. thumbnail images).

**S3 Glacier Instant Retrieval**: archive with millisecond retrieval. Same as Standard-IA cost; lower storage cost. Min duration: 90 days. For quarterly-accessed archives needing fast retrieval.

**S3 Glacier Flexible Retrieval**: minutes–hours retrieval (Expedited 1–5 min, Standard 3–5 hr, Bulk 5–12 hr). Min duration: 90 days. For backup/DR data.

**S3 Glacier Deep Archive**: cheapest storage. Retrieval: Standard 12 hr, Bulk 48 hr. Min duration: 180 days. For regulatory data retention, multi-year archives.

**S3 Intelligent-Tiering**: auto-moves objects between access tiers based on usage patterns. No retrieval fee. Monitoring fee per object. Tiers: Frequent, Infrequent (30 days), Archive Instant (90 days), Archive (90 days, opt-in), Deep Archive (180 days, opt-in). Best for unknown or changing access patterns.`,
    },
    {
      heading: "Lifecycle Policies",
      body: `Lifecycle policies automate storage class transitions and object expiration.

**Transition actions**: move objects to a different storage class after N days. Example: Standard → Standard-IA after 30 days → Glacier after 90 days → Deep Archive after 365 days.

**Expiration actions**: permanently delete objects (or delete expired object delete markers, or delete incomplete multipart uploads) after N days.

**Scope**: apply to entire bucket or filter by prefix or tags.

**Common patterns**:
- Log files: Standard → IA after 30 days → Glacier after 90 days → expire after 365 days
- Application artifacts: expire after 90 days to save cost
- Incomplete multipart uploads: abort after 7 days (prevents storage cost accumulation)`,
    },
    {
      heading: "Upload Patterns",
      body: `**Single PUT upload**: objects up to 5 GB. Simple but no partial retry.

**Multipart Upload**:
- Recommended for objects > 100 MB; required for > 5 GB.
- Split object into parts (5 MB min per part, except last).
- Upload parts in parallel → complete multipart upload → S3 assembles.
- Individual parts can be retried on failure — no need to restart the whole upload.
- Up to 10,000 parts per upload.
- Incomplete uploads accumulate cost — use lifecycle policy to abort after N days.

**S3 Transfer Acceleration**: routes uploads through AWS edge locations (CloudFront network) to AWS backbone. Useful for cross-continental uploads. Additional cost per GB. Enable per bucket; use the \`*.s3-accelerate.amazonaws.com\` endpoint.

**Presigned URLs**: time-limited URLs that grant upload (PUT) or download (GET) access to a specific object using the creator's credentials. Generated server-side; used client-side. Expiry: up to 7 days (IAM user) or until role session expires (IAM role).`,
    },
    {
      heading: "Access Control",
      body: `**Block Public Access**: four settings (block public ACLs, ignore public ACLs, block public bucket policies, restrict public bucket policies). Recommended: enable all. Overrides any other policy that grants public access. Set at account or bucket level.

**Bucket Policies**: resource-based JSON IAM policies attached to the bucket. Control access by principal, action, resource, and condition. Support cross-account access. Example use: grant another account read access, restrict access to specific VPC or IP.

**ACLs (Access Control Lists)**: legacy per-object and per-bucket access control. AWS recommends disabling ACLs (Object Ownership = Bucket Owner Enforced). New buckets disable ACLs by default.

**Access Points**: named network endpoints with their own policies. Simplify access control for shared datasets. Each access point can have different policies for different consumers. VPC access points restrict access to specific VPC. Useful for data lakes with many teams.

**S3 Object Ownership**: \`BucketOwnerEnforced\` (ACLs disabled, bucket owner owns all objects — recommended), \`BucketOwnerPreferred\`, \`ObjectWriter\` (legacy).`,
    },
    {
      heading: "Encryption",
      body: `**SSE-S3 (Server-Side Encryption with S3 Managed Keys)**: AES-256. S3 manages keys entirely. Free. Default encryption option. Set via bucket default or per-object header \`x-amz-server-side-encryption: AES256\`.

**SSE-KMS (Server-Side Encryption with KMS Keys)**: uses KMS CMK. Audit key usage in CloudTrail. Control key rotation and access. Additional KMS API call cost. Set via \`x-amz-server-side-encryption: aws:kms\`. Specify key ARN or use S3-managed KMS key.

**SSE-C (Server-Side Encryption with Customer-Provided Keys)**: you provide the encryption key on every request. S3 encrypts/decrypts but does not store the key. Must use HTTPS. S3 stores an HMAC of the key for verification.

**Client-Side Encryption**: you encrypt before uploading and decrypt after downloading. Use KMS envelope encryption or your own key management. S3 stores encrypted bytes — S3 cannot read the data.

**Encryption in transit**: S3 supports HTTPS (TLS). Enforce HTTPS-only via bucket policy with condition \`aws:SecureTransport: false\` deny.`,
    },
    {
      heading: "Versioning & Replication",
      body: `**Versioning**: keep multiple versions of the same object. Once enabled, cannot be disabled (only suspended). Enables recovery from accidental deletes and overwrites. Delete request adds a **delete marker** (does not remove versions). Restore by deleting the delete marker. Cost: storage for all versions.

**MFA Delete**: require MFA to permanently delete versions or change versioning state. Extra protection for critical data.

**Cross-Region Replication (CRR)**: async replication to a bucket in another region. Requires versioning on both buckets. Use for: disaster recovery, compliance (data sovereignty), lower latency for remote users.

**Same-Region Replication (SRR)**: replicate within the same region. Use for: log aggregation, live replication between production and test accounts.

**Replication rules**: filter by prefix/tags. Replicate all objects or a subset. Can change storage class during replication. Existing objects are NOT replicated — use S3 Batch Operations to replicate existing objects.`,
    },
    {
      heading: "Event Notifications",
      body: `S3 sends notifications on object events to targets.

**Supported events**: \`s3:ObjectCreated:*\`, \`s3:ObjectRemoved:*\`, \`s3:ObjectRestore:*\`, \`s3:Replication:*\`, \`s3:LifecycleExpiration:*\`, and more.

**Destinations**:
- **SQS**: decouple; queue events for async processing.
- **SNS**: fan-out to multiple subscribers.
- **Lambda**: trigger function directly.
- **EventBridge**: most flexible — apply rules, route to 20+ targets, archive, replay.

**EventBridge vs direct notifications**: EventBridge supports richer filtering (any JSON field), fan-out to many targets, cross-account delivery, event replay. Direct S3→Lambda/SQS/SNS is simpler with less latency.

**Delivery guarantee**: at-least-once. Design processors to be idempotent.`,
    },
    {
      heading: "Static Website Hosting & CloudFront",
      body: `**Static website hosting**: enable per bucket. S3 serves HTML/CSS/JS directly. Set index document and error document. URL: \`bucket-name.s3-website-region.amazonaws.com\`. Requires public read access (or use CloudFront OAC).

**CloudFront + S3**: serve content from CloudFront edge locations worldwide. Use **Origin Access Control (OAC)** to restrict bucket access to CloudFront only (bucket policy allows only CloudFront service principal). Users cannot bypass CloudFront to access S3 directly. Enables HTTPS, custom domains, caching, WAF, and Lambda@Edge.

**S3 as data lake source**: query with **Amazon Athena** (serverless SQL on S3). Partition data by date/region/category for efficient queries. Store in columnar formats (Parquet, ORC) for best performance.`,
    },
    {
      heading: "S3 with Other Services",
      body: `**S3 + Lambda**: trigger processing on object uploads (image resize, CSV parsing, virus scan). S3 event → Lambda. Use presigned URLs to upload directly to S3 from client.

**S3 + CloudFront**: CDN for static assets and website. OAC restricts direct S3 access. Significant performance and cost improvements.

**S3 + Athena**: ad-hoc SQL queries on S3 data without ETL. Define schema in Glue Data Catalog. Partition by date for cost-efficient queries.

**S3 + Glacier**: lifecycle transitions archive data automatically. Glacier is a separate service but accessed as an S3 storage class.

**S3 + CodePipeline/CodeBuild**: S3 bucket as source for CodePipeline. Build artifacts stored in S3 between pipeline stages.

**S3 + Elastic Beanstalk**: EB stores application versions in S3. Deploy source bundles from S3.

**S3 + SageMaker**: store training data and model artifacts. SageMaker reads training data directly from S3.`,
    },
  ],

  keyFacts: [
    "Durability: 99.999999999% (11 nines)",
    "Max object size: 5 TB; multipart required > 5 GB, recommended > 100 MB",
    "Multipart: up to 10,000 parts, min part size 5 MB",
    "Presigned URL: max 7 days (IAM user), less for role sessions",
    "Strong read-after-write consistency for all operations (since Dec 2020)",
    "Standard-IA: 30-day min; Glacier Flexible: 90-day min; Deep Archive: 180-day min",
    "SSE-KMS: KMS API call per object read/write (cost + quota consideration)",
    "Versioning: once enabled cannot be disabled, only suspended",
    "CRR/SRR: versioning required on both source and destination buckets",
    "Block Public Access overrides bucket policies and ACLs",
  ],

  relatedServices: [
    "Amazon CloudFront",
    "AWS Lambda",
    "Amazon Athena",
    "AWS Glue",
    "Amazon EventBridge",
    "Amazon SQS",
    "Amazon SNS",
    "AWS KMS",
    "AWS CodePipeline",
    "AWS Elastic Beanstalk",
  ],

  examTips: [
    "Multipart upload: required > 5 GB, recommended > 100 MB, individual parts retryable.",
    "Presigned URL uses the creator's credentials — if role, URL expires with role session.",
    "SSE-KMS: GenerateDataKey + Decrypt API calls add cost and count against KMS quotas.",
    "CRR does not replicate existing objects — use S3 Batch Operations for those.",
    "Block Public Access is the master override — set at account level for full protection.",
    "Lifecycle abort-incomplete-multipart-uploads saves cost from abandoned uploads.",
    "S3 event notifications: at-least-once delivery — processors must be idempotent.",
    "Transfer Acceleration uses CloudFront edge for faster uploads — extra cost per GB.",
    "OAC (not OAI) is the current recommended way to restrict S3 access to CloudFront.",
  ],
};
