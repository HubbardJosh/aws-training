import { ServiceGuide } from "../../../types/guide";

export const s3Guide: ServiceGuide = {
  id: "saa-s3",
  service: "Amazon S3",
  domain: "services",
  tagline: "Infinitely scalable object storage for any architecture",
  intro:
    "Amazon Simple Storage Service (S3) provides highly durable, available, and scalable object storage that serves as the backbone for data lakes, static websites, backup archives, application assets, and event-driven pipelines across virtually every AWS architecture.",

  sections: [
    {
      heading: "Storage Classes and Cost Optimization",
      body: `S3 offers a tiered storage class model that lets architects optimize cost based on access frequency and retrieval latency requirements. S3 Standard provides 99.999999999% (11 nines) durability and millisecond access for frequently accessed data — it is the default for active application data and content distribution. S3 Standard-IA (Infrequent Access) retains the same durability and low latency but charges a per-GB retrieval fee, making it suitable for disaster recovery copies and data accessed less than once a month. S3 One Zone-IA stores data in a single Availability Zone at lower cost, appropriate for reproducible data like thumbnail images that can be regenerated if the AZ fails. S3 Glacier Instant Retrieval delivers archival pricing with millisecond access, ideal for medical imaging or news media retrieved once a quarter. S3 Glacier Flexible Retrieval (formerly just Glacier) targets bulk archive with retrieval in minutes to hours. S3 Glacier Deep Archive is the lowest-cost option with retrieval times of 12 hours, designed for data retained for regulatory compliance over 7–10 years. S3 Intelligent-Tiering automatically moves objects between frequent and infrequent tiers based on access patterns, eliminating the need to manage tiering manually when access patterns are unknown or variable.`,
    },
    {
      heading: "Versioning, Lifecycle Policies, and Replication",
      body: `Versioning preserves every version of every object in a bucket, protecting against accidental deletion and overwrite. When versioning is enabled, a delete operation places a delete marker rather than removing the object, allowing restoration of previous versions. Lifecycle policies automate the transition of objects between storage classes and the expiration of old versions, reducing storage costs without manual intervention — for example, transitioning objects to Standard-IA after 30 days, to Glacier after 90 days, and deleting them after 365 days. S3 Cross-Region Replication (CRR) asynchronously copies new objects to a bucket in a different region, enabling geographic redundancy, compliance with data residency requirements, and lower-latency access for globally distributed users. S3 Same-Region Replication (SRR) copies objects to a bucket in the same region, useful for aggregating logs from multiple source buckets or maintaining a live copy for a separate account. Replication requires versioning on both source and destination buckets.`,
    },
    {
      heading: "Security and Access Control",
      body: `S3 access is governed by a layered security model combining IAM policies, bucket policies, Access Control Lists (ACLs), and S3 Block Public Access. IAM policies attached to users or roles control what principals can do with S3 resources. Bucket policies are resource-based JSON policies attached to the bucket itself, allowing cross-account access and conditions based on IP address, VPC endpoint, MFA, or encryption status. S3 Block Public Access is a set of account-level and bucket-level settings that override any ACL or policy that would otherwise make objects publicly accessible — enabling this setting is the recommended default. Server-Side Encryption (SSE) protects data at rest: SSE-S3 uses AWS-managed keys, SSE-KMS uses keys you manage in AWS KMS (providing audit trails and key rotation control), and SSE-C uses customer-provided keys. S3 Presigned URLs grant temporary access to specific objects without requiring the recipient to have AWS credentials, useful for sharing downloads or allowing direct browser uploads.`,
    },
    {
      heading: "Event Notifications and Integration Patterns",
      body: `S3 Event Notifications trigger downstream processing automatically when objects are created, deleted, restored, or replicated. Notifications can be sent to Amazon SNS topics (for fan-out to multiple subscribers), Amazon SQS queues (for reliable, decoupled processing), or AWS Lambda functions (for immediate serverless processing). A common architecture for media processing uses an S3 upload event to invoke a Lambda function that submits a transcoding job to Elastic Transcoder or MediaConvert. For higher event throughput and filtering, Amazon EventBridge receives S3 events and routes them to multiple targets based on content-based rules, including Step Functions, other Lambda functions, or even cross-account targets. S3 Object Lambda allows you to attach Lambda functions to S3 GET requests, transforming data on the fly — for example, redacting PII from documents before returning them to the caller without maintaining a separate sanitized copy.`,
    },
    {
      heading: "Performance and Transfer Acceleration",
      body: `S3 scales horizontally to support extremely high request rates, but the key to maximizing performance is key naming and parallelism. S3 automatically partitions prefix namespaces to handle 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second per prefix — using randomized prefixes or hashes in object keys distributes load across partitions for high-throughput workloads. For uploading large objects, Multipart Upload splits the object into parts that are uploaded in parallel and assembled by S3, which both improves throughput and enables resumable uploads; it is required for objects over 5 GB and recommended above 100 MB. S3 Transfer Acceleration routes uploads through the AWS CloudFront edge network, reducing latency for clients uploading to a bucket in a distant region. S3 Byte-Range Fetches allow parallel downloads of large objects by requesting specific byte ranges concurrently, dramatically improving download throughput for analytics and batch processing.`,
    },
    {
      heading: "Static Website Hosting and CloudFront Integration",
      body: `S3 can serve static websites directly from a bucket by enabling static website hosting and specifying index and error documents. The S3 website endpoint supports HTTP only; to serve HTTPS, you must place Amazon CloudFront in front of the bucket. The recommended architecture uses an Origin Access Control (OAC) on the CloudFront distribution, which restricts direct access to the bucket so all traffic flows through CloudFront — enabling HTTPS, caching, geo-restriction, and AWS WAF integration. For single-page applications, configuring CloudFront to redirect 403/404 errors to the \`index.html\` ensures client-side routing works correctly. S3 and CloudFront together provide a serverless, globally distributed content delivery architecture that scales to millions of requests without provisioning servers.`,
    },
  ],

  keyFacts: [
    "S3 durability is 11 nines (99.999999999%) across all storage classes",
    "Storage classes: Standard, Standard-IA, One Zone-IA, Glacier Instant, Glacier Flexible, Glacier Deep Archive, Intelligent-Tiering",
    "Versioning protects against accidental deletion by placing delete markers instead of removing objects",
    "Lifecycle policies automate transitions between storage classes and expiration of old versions",
    "CRR copies objects cross-region; SRR copies within the same region — both require versioning",
    "SSE-S3, SSE-KMS, and SSE-C are the three server-side encryption options",
    "S3 Block Public Access overrides any ACL or policy that would make objects public",
    "Presigned URLs grant temporary, credential-free access to specific objects",
    "Multipart Upload is required for objects over 5 GB and recommended above 100 MB",
    "Static websites on S3 serve HTTP only; HTTPS requires CloudFront with OAC",
  ],

  relatedServices: [
    "Amazon CloudFront",
    "AWS Lambda",
    "Amazon SQS",
    "Amazon SNS",
    "AWS KMS",
    "Amazon Glacier",
  ],

  examTips: [
    "S3 Standard-IA charges a retrieval fee — cost-effective only if access is truly infrequent",
    "One Zone-IA stores data in a single AZ — not suitable for data that cannot be recreated",
    "Intelligent-Tiering avoids retrieval fees and is ideal when access patterns are unknown",
    "CRR requires versioning on both source and destination buckets",
    "S3 Block Public Access is the account-level override — enable it by default",
    "SSE-KMS gives you audit trails via CloudTrail and key rotation control — preferred for compliance",
    "Presigned URLs expire — use them for temporary sharing, not long-term access",
    "Multipart Upload enables parallel, resumable transfers for large objects",
  ],
};
