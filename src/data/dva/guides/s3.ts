import { ServiceGuide } from "../../../types/guide";

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
      body: `S3's data model is simpler than a filesystem: there are **buckets** (globally named containers tied to a specific region) and **objects** (the data itself, identified by a key). A bucket can hold an unlimited number of objects, and there is no real hierarchy — the "folder" structure you see in the S3 console is a visual representation of key prefixes (slashes in key names like \`images/profile/user123.jpg\`). Underneath, every object sits in a flat namespace within its bucket.

Each **object** consists of the data payload and associated metadata. Objects are immutable — you don't modify them in place, you replace them. The maximum object size is 5 TB, and objects can be as small as 0 bytes. The **key** is the object's full identifier within the bucket and is what determines partitioning for storage performance. S3 automatically distributes objects across multiple storage partitions based on key prefixes, providing at least 3,500 PUT/COPY/DELETE requests and 5,500 GET/HEAD requests per second per prefix.

An important consistency change happened in December 2020: S3 now provides **strong read-after-write consistency** for all operations. New objects are immediately readable after a successful PUT. Overwrites and deletes are also strongly consistent — a subsequent GET after a DELETE will never return the deleted object. This eliminates the class of bugs where applications read stale data immediately after writing, and you no longer need to design around eventual consistency for S3.`,
      quiz: [
        {
          question: "What is the maximum size of a single S3 object?",
          options: ["50 GB", "50 TB", "5 GB", "5 TB"],
          correctIndex: 3,
          explanation:
            "S3 supports objects up to 5 TB. Single-part PUT is limited to 5 GB; multipart upload is required for objects larger than 5 GB.",
        },
        {
          question:
            "Since December 2020, what consistency model does S3 provide for all operations?",
          options: [
            "Causal consistency",
            "Read-your-writes consistency for new objects only",
            "Eventual consistency",
            "Strong read-after-write consistency",
          ],
          correctIndex: 3,
          explanation:
            "S3 now provides strong read-after-write consistency for all operations including PUTs, overwrites, and DELETEs — no stale reads after a successful write.",
        },
      ],
    },
    {
      heading: "Storage Classes",
      body: `S3's storage classes let you trade access speed and availability against storage cost. The right class depends on how frequently and how quickly you need to retrieve each object.

**S3 Standard** is the default: 99.99% availability, three-or-more AZ replication, no retrieval fee, and no minimum storage duration. It's the most expensive per GB stored and is appropriate for actively accessed data. **S3 Standard-IA** (Infrequent Access) cuts the storage cost significantly but adds a per-GB retrieval fee and a 30-day minimum storage duration — economical for data accessed less than once a month, but counterproductive if you retrieve frequently. **S3 One Zone-IA** stores data in a single AZ, saving an additional 20% over Standard-IA, but the data is lost if the AZ is destroyed — only appropriate for reproducible data like thumbnail images or intermediate results.

The Glacier tier exists for archival at very low storage cost. **S3 Glacier Instant Retrieval** provides millisecond access (like Standard-IA) at lower storage cost, with a 90-day minimum. **S3 Glacier Flexible Retrieval** is for true archival where you accept retrieval times of minutes to hours — Expedited (1–5 min), Standard (3–5 hr), or Bulk (5–12 hr) — with a 90-day minimum. **S3 Glacier Deep Archive** is the cheapest tier: 12-hour Standard retrieval, 48-hour Bulk, and a 180-day minimum. Use it for regulatory compliance archives you might never read.

**S3 Intelligent-Tiering** removes the access-pattern guesswork by automatically moving objects between tiers based on actual access patterns, charging a small per-object monitoring fee in exchange. It's the right choice when you genuinely don't know or can't predict which objects will be accessed and how often.`,
      quiz: [
        {
          question:
            "Which S3 storage class has a minimum storage duration of 180 days and 12-hour standard retrieval?",
          options: [
            "S3 Glacier Flexible Retrieval",
            "S3 Glacier Instant Retrieval",
            "S3 Glacier Deep Archive",
            "S3 One Zone-IA",
          ],
          correctIndex: 2,
          explanation:
            "S3 Glacier Deep Archive has a 180-day minimum and 12-hour standard retrieval. It is the cheapest tier, designed for compliance archives rarely or never accessed.",
        },
        {
          question:
            "Which storage class automatically moves objects between tiers based on actual access patterns?",
          options: [
            "S3 One Zone-IA",
            "S3 Glacier Instant Retrieval",
            "S3 Standard-IA",
            "S3 Intelligent-Tiering",
          ],
          correctIndex: 3,
          explanation:
            "S3 Intelligent-Tiering monitors access patterns and moves objects automatically — ideal when you cannot predict access frequency.",
        },
      ],
    },
    {
      heading: "Lifecycle Policies",
      body: `Lifecycle policies let you automate the storage class transitions and object expiration that would otherwise require manual management. Without them, objects stay in the most expensive storage class forever even when they become infrequently accessed.

**Transition actions** move objects to a cheaper storage class after a specified number of days. A common pattern for log files moves them from Standard to Standard-IA after 30 days, then to Glacier Flexible Retrieval after 90 days, and finally to Deep Archive after a year. The policy handles this automatically — you configure it once and it runs indefinitely.

**Expiration actions** permanently delete objects after a specified number of days, which is important for controlling costs over time. A particularly useful expiration type is aborting incomplete multipart uploads: if a client starts a multipart upload but never completes it, the uploaded parts consume storage and incur charges even though no complete object exists. A lifecycle rule aborting incomplete multipart uploads after 7 days eliminates this cost accumulation automatically.

Policies can be scoped to the entire bucket or filtered by key prefix and object tags, giving you granular control. A single bucket can have multiple lifecycle rules with different conditions, making it straightforward to manage objects with different retention requirements in the same bucket.`,
      quiz: [
        {
          question:
            "What does a lifecycle rule that aborts incomplete multipart uploads prevent?",
          options: [
            "Accidental object overwrites",
            "Storage charges for abandoned upload parts",
            "Unauthorized cross-account uploads",
            "Objects being moved to Glacier prematurely",
          ],
          correctIndex: 1,
          explanation:
            "Incomplete multipart uploads leave parts in S3 that incur storage charges even though no complete object exists. A lifecycle rule aborting them after 7 days cleans these up automatically.",
        },
        {
          question:
            "Which lifecycle action moves objects to a cheaper storage class after a configured number of days?",
          options: [
            "Transition action",
            "Versioning action",
            "Expiration action",
            "Replication action",
          ],
          correctIndex: 0,
          explanation:
            "Transition actions change the storage class after N days. Expiration actions permanently delete objects.",
        },
      ],
    },
    {
      heading: "Upload Patterns",
      body: `Choosing the right upload mechanism matters for both reliability and performance, especially as object sizes grow.

**Single-part PUT** works for objects up to 5 GB and is simple to implement — one API call, one network transfer. The downside is that if the transfer fails, you must restart from the beginning.

**Multipart Upload** splits the object into parts (minimum 5 MB per part, except the last), uploads each part independently, and then sends a complete request that tells S3 to assemble them. This is recommended for objects over 100 MB and required for objects over 5 GB. The key advantage is resilience: if any individual part fails, you retry only that part, not the entire object. Parts can also upload in parallel, significantly reducing total upload time for large files. S3 keeps up to 10,000 parts per upload. Incomplete multipart uploads — where the upload started but the complete request was never sent — accumulate storage charges, so a lifecycle rule to abort them after 7 days is a best practice.

**S3 Transfer Acceleration** routes upload traffic through CloudFront's edge locations and the AWS backbone network rather than the public internet. This improves upload speeds for cross-continental transfers where the public internet path is congested or has high latency. You pay an additional per-GB fee and use the \`*.s3-accelerate.amazonaws.com\` endpoint.

**Presigned URLs** grant time-limited access to a specific object — either for downloading (GET) or uploading (PUT) — using the credentials of the URL creator. Generated server-side and shared with clients, they let users upload directly to S3 without your application server proxying the upload. The URL expires based on the creator's session: up to 7 days for IAM users, and up to the role session duration for IAM roles (which can be shorter than 7 days).`,
      quiz: [
        {
          question:
            "Multipart upload is required for S3 objects larger than what size?",
          options: ["5 GB", "1 GB", "10 GB", "100 MB"],
          correctIndex: 0,
          explanation:
            "Single-part PUT supports objects up to 5 GB; multipart upload is required beyond that. It is recommended for objects over 100 MB for resilience and parallel upload speed.",
        },
        {
          question:
            "What is the maximum expiry duration of a presigned URL created by an IAM user?",
          options: ["30 days", "7 days", "1 hour", "24 hours"],
          correctIndex: 1,
          explanation:
            "Presigned URLs created by IAM users expire in up to 7 days. URLs created by IAM roles expire no later than the role session duration, which may be shorter.",
        },
        {
          question:
            "S3 Transfer Acceleration improves upload speed by routing traffic through which AWS service's edge locations?",
          options: [
            "CloudFront",
            "Direct Connect",
            "Route 53",
            "Global Accelerator",
          ],
          correctIndex: 0,
          explanation:
            "Transfer Acceleration uses CloudFront edge locations to route uploads over the AWS backbone, bypassing congested public internet paths.",
        },
      ],
    },
    {
      heading: "Access Control",
      body: `S3 has multiple layers of access control that interact with each other, and understanding their precedence is important for both security and the exam.

**Block Public Access** is the master override — four settings that prevent any public access to the bucket, regardless of what other policies or ACLs might say. It can be set at the account level (blocking public access across all buckets) or per bucket. AWS now enables all four settings by default for new buckets, and enabling Block Public Access at the account level is the most effective way to prevent accidental public exposure. It overrides both bucket policies and ACLs.

**Bucket Policies** are resource-based IAM policies attached to the bucket. They're the recommended way to grant access because they support the full IAM policy language: conditions, principal matching, resource ARN patterns, and cross-account grants. A common use is restricting access to a specific VPC endpoint (using the \`aws:SourceVpce\` condition) or granting another account read access to specific prefixes.

**ACLs** are a legacy mechanism for per-object and per-bucket access control that predate bucket policies. AWS recommends disabling ACLs by setting Object Ownership to \`BucketOwnerEnforced\` — new buckets default to this. With ACLs disabled, the bucket owner owns all objects (even those uploaded by other accounts), which simplifies access management.

**S3 Access Points** create named endpoints with their own access policies, useful for large shared data sets where multiple teams need different access permissions. An access point for the analytics team can allow broad read access while an access point for the application team restricts reads to a specific prefix. VPC access points further restrict access to traffic originating from a specific VPC.`,
      quiz: [
        {
          question:
            "Which S3 access control mechanism overrides both bucket policies and ACLs?",
          options: [
            "IAM identity policies",
            "Block Public Access",
            "S3 Access Points",
            "Object Ownership",
          ],
          correctIndex: 1,
          explanation:
            "Block Public Access is the master override — it prevents public access regardless of what bucket policies or ACLs say. It can be set at the account or bucket level.",
        },
        {
          question:
            "What is the recommended way to grant cross-account access to an S3 bucket?",
          options: [
            "S3 Access Points only",
            "IAM role in the source account",
            "S3 ACLs",
            "Bucket Policy with cross-account principal",
          ],
          correctIndex: 3,
          explanation:
            "Bucket policies support cross-account grants using the full IAM policy language. ACLs are a legacy mechanism AWS recommends disabling.",
        },
      ],
    },
    {
      heading: "Encryption",
      body: `S3 offers encryption at rest through four mechanisms that differ in who controls the key material and how the encryption is performed.

**SSE-S3** is the default encryption option. S3 encrypts each object with AES-256 using a key that S3 manages entirely. You pay nothing extra for SSE-S3, and it requires no configuration on the client side — either set it as the bucket default or pass the \`x-amz-server-side-encryption: AES256\` header on PUT requests. This is appropriate for most workloads where you need encryption at rest but don't need visibility into or control over the key.

**SSE-KMS** uses a KMS key (AWS managed or customer managed) to protect the data encryption key. This adds several capabilities over SSE-S3: every encrypt and decrypt operation is logged in CloudTrail, you can control who can access the key via key policies, and you can rotate the key. The tradeoff is cost and throughput: every S3 GET or PUT against a SSE-KMS object makes a KMS API call, which counts against your KMS request quota and adds per-call cost. S3 Bucket Keys address this by generating a short-lived bucket-level key in S3 that reduces KMS calls by up to 99%.

**SSE-C** transfers the key management responsibility entirely to the client. You provide the encryption key on every request, S3 uses it to encrypt or decrypt, and then discards it — S3 never stores the key. Every request must use HTTPS and include the key material. **Client-Side Encryption** means you encrypt the data before it ever reaches S3 and decrypt it after downloading — S3 stores opaque bytes and cannot access the data at all. Encryption in transit is always available via HTTPS, and you can enforce HTTPS-only access with a bucket policy that denies requests where \`aws:SecureTransport\` is false.`,
      quiz: [
        {
          question:
            "Which S3 encryption option logs every encrypt and decrypt operation in CloudTrail?",
          options: ["SSE-S3", "SSE-KMS", "SSE-C", "Client-Side Encryption"],
          correctIndex: 1,
          explanation:
            "SSE-KMS uses a KMS key, and every KMS API call (GenerateDataKey, Decrypt) is logged in CloudTrail. SSE-S3 uses S3-managed keys with no per-call audit trail.",
        },
        {
          question: "What does S3 Bucket Keys do when SSE-KMS is enabled?",
          options: [
            "Disables CloudTrail logging for KMS calls",
            "Generates a separate KMS key per object",
            "Enables client-side encryption automatically",
            "Reduces KMS API calls by up to 99% using a short-lived bucket-level key",
          ],
          correctIndex: 3,
          explanation:
            "S3 Bucket Keys generate a bucket-level data key in S3, reducing the number of KMS API calls by up to 99% and lowering cost and quota pressure.",
        },
      ],
    },
    {
      heading: "Versioning & Replication",
      body: `Versioning and replication are two independent features that together give you a comprehensive data protection strategy.

**Versioning** keeps every version of an object, creating a full history of changes. Once enabled on a bucket, versioning cannot be fully disabled — only suspended, which stops creating new versions but preserves existing ones. When you delete a versioned object, S3 adds a **delete marker** rather than removing the data. The previous versions remain accessible by specifying their version ID. To recover from an accidental delete, you delete the delete marker; to recover a specific previous version, you copy it to make it current. Versioning has a cost: you pay for storage of every version, including old ones. **MFA Delete** adds an extra layer of protection by requiring multi-factor authentication to permanently delete versions or change versioning state, protecting against both accidental and malicious deletion.

**Cross-Region Replication (CRR)** asynchronously copies objects from a source bucket to a destination bucket in a different region. Both buckets must have versioning enabled. The primary uses are disaster recovery (a separate region has a copy), compliance with data residency requirements, or latency reduction for users in the destination region. **Same-Region Replication (SRR)** does the same within a single region, useful for aggregating logs from multiple source buckets or maintaining a synchronized copy in a different account for separation of concerns.

An important limitation: replication only applies to new objects created after the rule is configured. Existing objects are not replicated retroactively — you must use S3 Batch Operations to copy existing objects to the destination if you need to replicate historical data. Replication rules can filter by prefix or tag and optionally change the storage class during replication.`,
      quiz: [
        {
          question:
            "What happens when you delete a versioned S3 object without specifying a version ID?",
          options: [
            "A delete marker is added; all versions remain",
            "The object and all versions are permanently deleted",
            "The bucket is locked until deletion is confirmed",
            "The latest version is permanently deleted",
          ],
          correctIndex: 0,
          explanation:
            "Deleting without a version ID adds a delete marker. The object appears deleted but all versions remain accessible by version ID.",
        },
        {
          question:
            "Cross-Region Replication does NOT replicate which of the following?",
          options: [
            "Objects filtered by prefix",
            "Objects that existed before the replication rule was created",
            "Objects encrypted with SSE-KMS",
            "New objects created after the rule is configured",
          ],
          correctIndex: 1,
          explanation:
            "CRR only applies to new objects created after the rule is configured. Existing objects must be copied manually using S3 Batch Operations.",
        },
      ],
    },
    {
      heading: "Event Notifications",
      body: `S3 can emit notifications when objects are created, deleted, restored from Glacier, or transition through lifecycle events. This makes S3 a natural trigger for event-driven processing pipelines.

Supported event categories include \`s3:ObjectCreated:*\` (covers PUT, POST, COPY, multipart complete), \`s3:ObjectRemoved:*\`, \`s3:ObjectRestore:*\`, \`s3:Replication:*\`, and more granular variants. You can configure rules that filter by prefix or suffix to narrow notifications to specific object patterns.

S3 can deliver notifications directly to three targets — SQS, SNS, and Lambda — or to **EventBridge**. Direct delivery to Lambda is the simplest path for triggering processing on uploads. SNS enables fan-out where multiple systems respond to the same upload event. SQS adds durability and backpressure: if the processor is slow, events queue up rather than being dropped. EventBridge is the most flexible option: it supports richer content-based filtering, routing to over 20 target types, cross-account delivery, and event archiving and replay.

An important operational characteristic: S3 event notifications are delivered **at least once**, not exactly once. Your event processors must be idempotent — processing the same event twice should produce the same result as processing it once. This is especially important for operations like database writes or file moves that are not naturally idempotent.`,
      quiz: [
        {
          question: "S3 event notifications have which delivery guarantee?",
          options: [
            "Exactly-once delivery",
            "At-most-once delivery",
            "At-least-once delivery",
            "Ordered delivery",
          ],
          correctIndex: 2,
          explanation:
            "S3 event notifications are at-least-once — a notification may be delivered more than once. Event processors must be idempotent.",
        },
        {
          question:
            "Which S3 event notification target provides the most flexible routing, content-based filtering, and event replay?",
          options: ["SQS", "SNS", "EventBridge", "Lambda"],
          correctIndex: 2,
          explanation:
            "EventBridge supports rich content-based filtering, 20+ target types, cross-account delivery, and event archiving/replay — the most flexible option.",
        },
      ],
    },
    {
      heading: "Static Website Hosting & CloudFront",
      body: `S3 can serve static websites directly — HTML, CSS, JavaScript, and other assets — without any server infrastructure. Enable static website hosting on the bucket, set an index document (\`index.html\`) and an optional error document, and S3 exposes a website endpoint at \`bucket-name.s3-website-region.amazonaws.com\`. Direct S3 website hosting requires the bucket to allow public reads, which means disabling Block Public Access — not ideal for production workloads where you want more control.

The recommended production pattern is **CloudFront + S3 with Origin Access Control (OAC)**. CloudFront serves content from edge locations worldwide, reducing latency for users regardless of their location. OAC configures the S3 bucket to accept requests only from your CloudFront distribution — the bucket has no public read access and cannot be accessed directly by users, only through CloudFront. This gives you HTTPS with a custom domain, WAF integration, Lambda@Edge for request manipulation, and caching at the edge, all while keeping the origin bucket private.

For data analytics use cases, S3 pairs naturally with **Amazon Athena**, which provides serverless SQL queries against data stored in S3. Partitioning your data by date, region, or other dimensions in the key prefix (for example, \`year=2024/month=08/day=15/\`) allows Athena to skip partitions that don't match your query, dramatically reducing the amount of data scanned and lowering cost. Storing data in columnar formats like Parquet or ORC — which Firehose can convert to automatically — yields additional cost reductions of 70–90% compared to JSON or CSV.`,
      quiz: [
        {
          question:
            "What is the recommended way to serve a private S3 bucket through CloudFront?",
          options: [
            "Use Origin Access Control (OAC)",
            "Use Origin Access Identity (OAI)",
            "Configure a bucket policy allowing all CloudFront IPs",
            "Enable public read on the bucket",
          ],
          correctIndex: 0,
          explanation:
            "OAC is the current recommended mechanism. It restricts bucket access to only your CloudFront distribution, keeping the bucket private while CloudFront serves content globally.",
        },
        {
          question:
            "How does partitioning S3 data by date in key prefixes reduce Athena query costs?",
          options: [
            "It compresses the data automatically",
            "It lets Athena skip entire partitions that don't match the query",
            "It converts data to Parquet format",
            "It enables caching of query results",
          ],
          correctIndex: 1,
          explanation:
            "Athena charges per data scanned. Partition pruning lets Athena skip partitions that don't match the WHERE clause, dramatically reducing the data scanned.",
        },
      ],
    },
    {
      heading: "S3 with Other Services",
      body: `**S3 + Lambda** is the most common event-driven pattern for S3: an object upload triggers a Lambda function that processes the file — resizing an image, parsing a CSV, scanning for malware, or extracting metadata. The Lambda function receives the bucket name and key in the event payload and uses the SDK to read the object. For client-side uploads, presigned URLs let users upload directly to S3 without routing the file through your application server, which saves bandwidth and compute cost.

**S3 + CloudFront** is the standard CDN pattern for static content and websites. OAC restricts bucket access to CloudFront only, and CloudFront handles caching, HTTPS, custom domains, and geographic distribution. For high-traffic assets, the combination delivers dramatically better performance and lower origin cost than serving from S3 directly.

**S3 + Athena** (often with AWS Glue for schema management) enables ad-hoc analytics on large data sets without running a database or ETL pipeline. Glue crawlers can infer schema from S3 data automatically, and Athena queries it with standard SQL. This is the foundation of the serverless data lake pattern.

**S3 + CodePipeline and CodeBuild** makes S3 the artifact store for CI/CD pipelines — source code bundles, build outputs, and deployment artifacts all flow through S3 between pipeline stages. **S3 + Elastic Beanstalk** works the same way: Beanstalk stores application version bundles in S3 and deploys from there. **S3 + SageMaker** stores training data sets and model artifacts — SageMaker reads training data directly from S3, making S3 the natural staging area for machine learning workflows.`,
      quiz: [
        {
          question:
            "Why use presigned URLs for client-side S3 uploads instead of routing through your application server?",
          options: [
            "Presigned URLs support larger file sizes",
            "They save application server bandwidth and compute cost",
            "They bypass S3 encryption requirements",
            "They are required for multipart uploads",
          ],
          correctIndex: 1,
          explanation:
            "Presigned URLs let clients upload directly to S3 without the file passing through your server, eliminating the bandwidth and compute cost of proxying large uploads.",
        },
        {
          question:
            "Which AWS service pair enables serverless SQL analytics directly on S3 data without an ETL pipeline?",
          options: [
            "S3 + Redshift",
            "S3 + DynamoDB",
            "S3 + RDS",
            "S3 + Athena",
          ],
          correctIndex: 3,
          explanation:
            "Athena queries S3 data directly with standard SQL at no fixed cost — you pay per data scanned. No ETL or database server required.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "Multipart upload is required for S3 objects larger than what size?",
      options: ["5 GB", "1 GB", "10 GB", "100 MB"],
      correctIndex: 0,
      explanation:
        "Single-part PUT supports up to 5 GB. Multipart is required beyond that and recommended for objects over 100 MB.",
    },
    {
      question:
        "Which S3 storage class automatically moves objects between access tiers with no manual rules?",
      options: [
        "S3 Intelligent-Tiering",
        "S3 Glacier Flexible Retrieval",
        "S3 One Zone-IA",
        "S3 Standard-IA",
      ],
      correctIndex: 0,
      explanation:
        "S3 Intelligent-Tiering monitors access patterns and moves objects automatically, charging a small per-object monitoring fee.",
    },
    {
      question:
        "Which access control feature overrides all bucket policies and ACLs to prevent public access?",
      options: [
        "Bucket versioning",
        "Object Ownership",
        "S3 Access Points",
        "Block Public Access",
      ],
      correctIndex: 3,
      explanation:
        "Block Public Access is the master override. It can be set at the account level to prevent public access across all buckets regardless of other policies.",
    },
    {
      question:
        "What must both the source and destination bucket have enabled for S3 Cross-Region Replication to work?",
      options: [
        "Versioning",
        "Block Public Access disabled",
        "SSE-KMS encryption",
        "Static website hosting",
      ],
      correctIndex: 0,
      explanation:
        "CRR and SRR both require versioning enabled on source and destination buckets.",
    },
    {
      question:
        "Which SSE option gives you full CloudTrail audit logs of every S3 encrypt/decrypt operation?",
      options: ["SSE-KMS", "SSE-S3", "Client-Side Encryption", "SSE-C"],
      correctIndex: 0,
      explanation:
        "SSE-KMS uses KMS keys. Every KMS API call is logged in CloudTrail, giving you a complete audit trail of who accessed which object.",
    },
    {
      question: "S3 event notifications guarantee which delivery semantics?",
      options: [
        "At-most-once",
        "Exactly-once",
        "Ordered FIFO",
        "At-least-once",
      ],
      correctIndex: 3,
      explanation:
        "S3 notifications are at-least-once. Processors must be idempotent to handle duplicate deliveries safely.",
    },
    {
      question:
        "What is the current recommended mechanism to restrict S3 bucket access to only a CloudFront distribution?",
      options: [
        "Origin Access Identity (OAI)",
        "Bucket policy with CloudFront IP ranges",
        "S3 Access Points",
        "Origin Access Control (OAC)",
      ],
      correctIndex: 3,
      explanation:
        "OAC is the current recommended replacement for OAI. It keeps the bucket private and allows only your CloudFront distribution to access it.",
    },
    {
      question:
        "Which lifecycle rule type prevents accumulating storage charges from abandoned multipart uploads?",
      options: [
        "Abort incomplete multipart uploads",
        "MFA Delete",
        "Transition action to Glacier",
        "Expiration action on current versions",
      ],
      correctIndex: 0,
      explanation:
        "Aborting incomplete multipart uploads after 7 days cleans up upload parts that were never completed, eliminating the associated storage cost.",
    },
  ],
};
