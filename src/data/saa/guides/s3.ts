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
      quiz: [
        {
          question:
            "A company stores thumbnail images in S3 that can be regenerated from original source files if lost. They want the lowest-cost storage class that is still immediately accessible. Which storage class is most appropriate?",
          options: [
            "S3 Standard",
            "S3 Standard-IA",
            "S3 One Zone-IA",
            "S3 Glacier Instant Retrieval",
          ],
          correctIndex: 2,
          explanation:
            "S3 One Zone-IA is appropriate for reproducible data (like thumbnails that can be regenerated) because it stores data in a single AZ at lower cost than Standard-IA. If the AZ fails, data is lost — but since thumbnails can be recreated, this risk is acceptable. One Zone-IA is cheaper than Standard-IA and still provides immediate millisecond access.",
        },
        {
          question:
            "A company has S3 objects with unpredictable and variable access patterns. They want to avoid retrieval fees and don't want to manage storage class transitions manually. Which storage class is best?",
          options: [
            "S3 Standard",
            "S3 Standard-IA",
            "S3 Intelligent-Tiering",
            "S3 Glacier Flexible Retrieval",
          ],
          correctIndex: 2,
          explanation:
            "S3 Intelligent-Tiering automatically moves objects between Frequent Access, Infrequent Access, and Archive tiers based on observed access patterns, without retrieval fees. It is ideal when access patterns are unknown or variable, eliminating the need to manually manage storage class transitions while optimizing cost.",
        },
        {
          question: "What is the durability of all S3 storage classes?",
          options: [
            "99.9% (three nines)",
            "99.99% (four nines)",
            "99.999999999% (eleven nines)",
            "100%",
          ],
          correctIndex: 2,
          explanation:
            "All S3 storage classes (except S3 One Zone-IA, which has the same durability within its single AZ) provide 99.999999999% (11 nines) durability. This is achieved by redundantly storing data across multiple devices and multiple facilities, making the probability of data loss extremely small.",
        },
      ],
    },
    {
      heading: "Versioning, Lifecycle Policies, and Replication",
      body: `Versioning preserves every version of every object in a bucket, protecting against accidental deletion and overwrite. When versioning is enabled, a delete operation places a delete marker rather than removing the object, allowing restoration of previous versions. Lifecycle policies automate the transition of objects between storage classes and the expiration of old versions, reducing storage costs without manual intervention — for example, transitioning objects to Standard-IA after 30 days, to Glacier after 90 days, and deleting them after 365 days. S3 Cross-Region Replication (CRR) asynchronously copies new objects to a bucket in a different region, enabling geographic redundancy, compliance with data residency requirements, and lower-latency access for globally distributed users. S3 Same-Region Replication (SRR) copies objects to a bucket in the same region, useful for aggregating logs from multiple source buckets or maintaining a live copy for a separate account. Replication requires versioning on both source and destination buckets.`,
      quiz: [
        {
          question:
            "With S3 versioning enabled, what happens when a user deletes an object?",
          options: [
            "The object and all its versions are permanently deleted",
            "A delete marker is placed on the object, preserving all previous versions",
            "The most recent version is deleted; earlier versions remain accessible",
            "The object is moved to S3 Glacier for a 30-day grace period",
          ],
          correctIndex: 1,
          explanation:
            "When versioning is enabled and a delete operation is performed without specifying a version ID, S3 places a delete marker on the object. The object appears deleted to normal GET requests, but all previous versions are preserved. You can restore the object by deleting the delete marker. This protects against accidental deletion.",
        },
        {
          question:
            "S3 Cross-Region Replication requires which feature to be enabled on both source and destination buckets?",
          options: [
            "S3 Transfer Acceleration",
            "Server-side encryption with KMS",
            "Versioning",
            "S3 Block Public Access",
          ],
          correctIndex: 2,
          explanation:
            "Both the source and destination buckets must have versioning enabled for S3 Cross-Region Replication (and Same-Region Replication) to work. Versioning is required because replication works at the version level, tracking which versions have been replicated to avoid duplicate copies.",
        },
        {
          question:
            "Which S3 replication type would be used to aggregate access logs from multiple source buckets in different accounts into a single central logging bucket in the same region?",
          options: [
            "S3 Cross-Region Replication (CRR)",
            "S3 Same-Region Replication (SRR)",
            "S3 Batch Replication",
            "S3 Lifecycle replication",
          ],
          correctIndex: 1,
          explanation:
            "S3 Same-Region Replication (SRR) copies objects to a destination bucket in the same AWS region, even from different accounts. It is used for log aggregation (collecting logs from multiple source buckets into one central bucket), maintaining live copies in a separate account, and meeting compliance requirements that keep data in the same region.",
        },
      ],
    },
    {
      heading: "Security and Access Control",
      body: `S3 access is governed by a layered security model combining IAM policies, bucket policies, Access Control Lists (ACLs), and S3 Block Public Access. IAM policies attached to users or roles control what principals can do with S3 resources. Bucket policies are resource-based JSON policies attached to the bucket itself, allowing cross-account access and conditions based on IP address, VPC endpoint, MFA, or encryption status. S3 Block Public Access is a set of account-level and bucket-level settings that override any ACL or policy that would otherwise make objects publicly accessible — enabling this setting is the recommended default. Server-Side Encryption (SSE) protects data at rest: SSE-S3 uses AWS-managed keys, SSE-KMS uses keys you manage in AWS KMS (providing audit trails and key rotation control), and SSE-C uses customer-provided keys. S3 Presigned URLs grant temporary access to specific objects without requiring the recipient to have AWS credentials, useful for sharing downloads or allowing direct browser uploads.`,
      quiz: [
        {
          question:
            "Which S3 encryption option provides audit trails via CloudTrail and allows you to control key rotation, making it suitable for compliance-driven workloads?",
          options: [
            "SSE-S3 (S3-managed keys)",
            "SSE-KMS (AWS KMS-managed keys)",
            "SSE-C (customer-provided keys)",
            "Client-side encryption before upload",
          ],
          correctIndex: 1,
          explanation:
            "SSE-KMS uses customer-managed KMS keys, providing full audit trails of key usage via AWS CloudTrail and giving you control over key rotation, access policies, and key lifecycle. SSE-S3 uses AWS-managed keys with no audit trail or key control. SSE-C requires the customer to provide keys on every request, adding operational complexity.",
        },
        {
          question:
            "Which S3 feature overrides any ACL or bucket policy that would otherwise make objects publicly accessible, and is the recommended security default?",
          options: [
            "SSE-KMS encryption on all objects",
            "S3 Block Public Access",
            "IAM policies denying s3:GetObject",
            "Bucket policy with explicit deny for anonymous principals",
          ],
          correctIndex: 1,
          explanation:
            "S3 Block Public Access is an account-level and bucket-level setting that overrides any ACL or policy that would grant public access. Enabling it by default prevents accidental public exposure regardless of individual bucket or object permissions. It is the simplest and most reliable way to prevent public access to S3 data.",
        },
        {
          question:
            "A company wants to allow external partners to download a specific S3 object for the next 24 hours without giving them AWS credentials. What mechanism enables this?",
          options: [
            "Make the object public using a bucket ACL",
            "Create an IAM user for the partner with time-limited permissions",
            "Generate a presigned URL with a 24-hour expiration",
            "Share the bucket's ARN and the AWS account credentials",
          ],
          correctIndex: 2,
          explanation:
            "S3 Presigned URLs embed the necessary credentials and a time-limited signature to grant access to a specific S3 object. They expire after the configured duration, require no AWS credentials from the recipient, and do not require making the object publicly accessible. This is the recommended pattern for temporary, credential-free access to private S3 objects.",
        },
      ],
    },
    {
      heading: "Event Notifications and Integration Patterns",
      body: `S3 Event Notifications trigger downstream processing automatically when objects are created, deleted, restored, or replicated. Notifications can be sent to Amazon SNS topics (for fan-out to multiple subscribers), Amazon SQS queues (for reliable, decoupled processing), or AWS Lambda functions (for immediate serverless processing). A common architecture for media processing uses an S3 upload event to invoke a Lambda function that submits a transcoding job to Elastic Transcoder or MediaConvert. For higher event throughput and filtering, Amazon EventBridge receives S3 events and routes them to multiple targets based on content-based rules, including Step Functions, other Lambda functions, or even cross-account targets. S3 Object Lambda allows you to attach Lambda functions to S3 GET requests, transforming data on the fly — for example, redacting PII from documents before returning them to the caller without maintaining a separate sanitized copy.`,
      quiz: [
        {
          question:
            "An architecture requires that multiple downstream services (inventory, analytics, notification) each process every S3 object upload event independently. Which S3 event notification target best supports this fan-out requirement?",
          options: [
            "S3 → Lambda (single function handling all downstream services)",
            "S3 → SQS FIFO queue with message groups per service",
            "S3 → SNS topic with subscriptions for each downstream SQS queue or Lambda",
            "S3 → EventBridge → single target rule",
          ],
          correctIndex: 2,
          explanation:
            "Publishing to an SNS topic enables fan-out — SNS delivers the S3 event to multiple subscriptions simultaneously (one per downstream service). Each service has its own SQS queue or Lambda subscriber, receives the event independently, and processes it at its own pace. This decouples the services and allows independent scaling.",
        },
        {
          question: "S3 Object Lambda is best suited for which use case?",
          options: [
            "Transforming S3 event notifications before routing them to downstream services",
            "Applying Lambda-based transformations to data as it is retrieved from S3 via GET requests",
            "Running Lambda functions triggered by S3 lifecycle transitions",
            "Encrypting objects in S3 using a custom Lambda key management function",
          ],
          correctIndex: 1,
          explanation:
            "S3 Object Lambda intercepts S3 GET requests and invokes a Lambda function to transform the object data before returning it to the caller. This enables on-the-fly transformations like PII redaction, format conversion, or data enrichment without maintaining separate copies of transformed data in S3.",
        },
      ],
    },
    {
      heading: "Performance and Transfer Acceleration",
      body: `S3 scales horizontally to support extremely high request rates, but the key to maximizing performance is key naming and parallelism. S3 automatically partitions prefix namespaces to handle 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second per prefix — using randomized prefixes or hashes in object keys distributes load across partitions for high-throughput workloads. For uploading large objects, Multipart Upload splits the object into parts that are uploaded in parallel and assembled by S3, which both improves throughput and enables resumable uploads; it is required for objects over 5 GB and recommended above 100 MB. S3 Transfer Acceleration routes uploads through the AWS CloudFront edge network, reducing latency for clients uploading to a bucket in a distant region. S3 Byte-Range Fetches allow parallel downloads of large objects by requesting specific byte ranges concurrently, dramatically improving download throughput for analytics and batch processing.`,
      quiz: [
        {
          question:
            "A company needs to upload 10 GB files to S3. What upload technique is required and recommended for objects of this size?",
          options: [
            "Standard single-part upload with chunked transfer encoding",
            "Multipart Upload, which is required for objects over 5 GB",
            "S3 Transfer Acceleration with enhanced single-part upload",
            "S3 Byte-Range upload with parallel parts",
          ],
          correctIndex: 1,
          explanation:
            "Multipart Upload is required for objects larger than 5 GB and recommended for objects larger than 100 MB. It splits large objects into parts uploaded in parallel, improving throughput and enabling resumable uploads. S3 cannot accept a single-part upload larger than 5 GB.",
        },
        {
          question:
            "Users in Europe are experiencing slow upload times when uploading files to an S3 bucket in us-east-1. Which S3 feature can reduce upload latency by routing traffic through nearby edge locations?",
          options: [
            "S3 Cross-Region Replication to a European bucket",
            "S3 Transfer Acceleration",
            "Multipart Upload with parallel parts",
            "S3 Intelligent-Tiering for uploads",
          ],
          correctIndex: 1,
          explanation:
            "S3 Transfer Acceleration routes upload traffic through the nearest AWS CloudFront edge location, which has an optimized high-bandwidth connection to the S3 bucket's region. This can significantly reduce upload latency for users who are geographically distant from the target bucket's region, at an additional cost per GB transferred.",
        },
      ],
    },
    {
      heading: "Static Website Hosting and CloudFront Integration",
      body: `S3 can serve static websites directly from a bucket by enabling static website hosting and specifying index and error documents. The S3 website endpoint supports HTTP only; to serve HTTPS, you must place Amazon CloudFront in front of the bucket. The recommended architecture uses an Origin Access Control (OAC) on the CloudFront distribution, which restricts direct access to the bucket so all traffic flows through CloudFront — enabling HTTPS, caching, geo-restriction, and AWS WAF integration. For single-page applications, configuring CloudFront to redirect 403/404 errors to the \`index.html\` ensures client-side routing works correctly. S3 and CloudFront together provide a serverless, globally distributed content delivery architecture that scales to millions of requests without provisioning servers.`,
      quiz: [
        {
          question:
            "An S3-hosted static website needs to serve content over HTTPS. What must be added to the architecture?",
          options: [
            "Enable HTTPS on the S3 bucket's website endpoint",
            "Add an ACM certificate directly to the S3 bucket",
            "Place an Amazon CloudFront distribution in front of the S3 bucket",
            "Configure an Application Load Balancer with an SSL certificate in front of S3",
          ],
          correctIndex: 2,
          explanation:
            "The S3 static website endpoint only supports HTTP, not HTTPS. To serve content over HTTPS, you must place Amazon CloudFront in front of the S3 bucket. CloudFront supports HTTPS with ACM certificates, caches content at edge locations globally, and can enforce HTTPS-only access. An ALB cannot serve S3 static website content directly.",
        },
        {
          question:
            "Which CloudFront feature restricts direct access to an S3 bucket so that content can only be accessed through the CloudFront distribution?",
          options: [
            "CloudFront field-level encryption",
            "Origin Access Control (OAC)",
            "S3 Block Public Access",
            "CloudFront signed URLs",
          ],
          correctIndex: 1,
          explanation:
            "Origin Access Control (OAC) is the modern mechanism that grants CloudFront exclusive access to an S3 bucket origin. It configures the S3 bucket policy to allow access only from the specific CloudFront distribution, blocking all direct S3 access. This ensures all requests go through CloudFront, enabling HTTPS enforcement, caching, WAF, and geo-restriction.",
        },
      ],
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

  topicQuiz: [
    {
      question: "What is the durability guarantee for S3 Standard storage?",
      options: [
        "99.9% (three nines)",
        "99.99% (four nines)",
        "99.999999999% (eleven nines)",
        "100%",
      ],
      correctIndex: 2,
      explanation:
        "S3 Standard (and all other S3 storage classes) provides 99.999999999% (11 nines) durability by redundantly storing data across multiple devices in multiple facilities. This makes the probability of data loss extremely small — roughly one object lost per 10 million objects per 10,000 years.",
    },
    {
      question:
        "When versioning is enabled, what does a DELETE operation on an S3 object do?",
      options: [
        "Permanently deletes all versions of the object",
        "Deletes only the most recent version",
        "Places a delete marker, making the object appear deleted while preserving all versions",
        "Moves the object to S3 Glacier before deletion",
      ],
      correctIndex: 2,
      explanation:
        "With versioning enabled, a DELETE request without a specific version ID places a delete marker on the object. The object appears deleted to normal list and get requests, but all previous versions are preserved and can be restored by removing the delete marker. This provides protection against accidental deletion.",
    },
    {
      question:
        "Which S3 storage class stores data in a single Availability Zone and is appropriate for reproducible data that can be regenerated if lost?",
      options: [
        "S3 Standard-IA",
        "S3 One Zone-IA",
        "S3 Glacier Instant Retrieval",
        "S3 Intelligent-Tiering",
      ],
      correctIndex: 1,
      explanation:
        "S3 One Zone-IA stores data in a single Availability Zone, making it cheaper than Standard-IA but with the risk of data loss if the AZ fails. It is appropriate for data that can be recreated (like thumbnails generated from originals, or secondary backup copies) where the lower cost justifies the reduced durability.",
    },
    {
      question:
        "Which S3 encryption option provides AWS CloudTrail audit logs of key usage and gives you control over key rotation?",
      options: ["SSE-S3", "SSE-KMS", "SSE-C", "Client-side encryption"],
      correctIndex: 1,
      explanation:
        "SSE-KMS uses customer-managed KMS keys, which generates CloudTrail audit logs for every key usage (encryption/decryption), giving you full visibility and control. You manage key rotation policies and access controls. SSE-S3 uses AWS-managed keys with no audit trail or key control available to customers.",
    },
    {
      question:
        "A company wants to temporarily share a private S3 object with an external partner for 48 hours without granting them AWS credentials. What is the recommended approach?",
      options: [
        "Temporarily make the object public using a bucket ACL",
        "Create a temporary IAM user with S3 read permissions",
        "Generate a presigned URL with a 48-hour expiration",
        "Share the S3 bucket ARN and the owner's access key",
      ],
      correctIndex: 2,
      explanation:
        "Presigned URLs are time-limited URLs that embed the necessary authentication to access a specific S3 object. They expire after the configured duration (48 hours in this case), require no AWS credentials from the recipient, and do not require making the object publicly accessible. This is the safest and simplest approach for temporary access.",
    },
    {
      question:
        "Multipart Upload is required for S3 objects larger than what size?",
      options: ["100 MB", "1 GB", "5 GB", "10 GB"],
      correctIndex: 2,
      explanation:
        "Multipart Upload is required for objects larger than 5 GB — S3 cannot accept a single-part upload exceeding this limit. It is recommended (but not required) for objects larger than 100 MB. Multipart Upload enables parallel uploads and resumable transfers, improving throughput for large objects.",
    },
    {
      question:
        "Which feature enables an S3 bucket to serve content over HTTPS?",
      options: [
        "Enabling HTTPS on the S3 static website endpoint",
        "Applying an ACM certificate to the S3 bucket",
        "Placing an Amazon CloudFront distribution in front of the S3 bucket",
        "Enabling S3 Transfer Acceleration with TLS",
      ],
      correctIndex: 2,
      explanation:
        "The S3 static website endpoint only supports HTTP. To serve content over HTTPS, you must use Amazon CloudFront in front of S3. CloudFront supports HTTPS via ACM certificates, caches content at edge locations globally, and can be configured with Origin Access Control to restrict direct S3 access.",
    },
    {
      question:
        "Both S3 Cross-Region Replication and Same-Region Replication require which S3 feature enabled on both the source and destination buckets?",
      options: [
        "S3 Transfer Acceleration",
        "Server-side encryption with KMS",
        "Versioning",
        "S3 Lifecycle policies",
      ],
      correctIndex: 2,
      explanation:
        "Both CRR and SRR require versioning to be enabled on both the source and destination buckets. Versioning allows S3 to track object versions and determine which objects and versions need to be replicated. Without versioning on both buckets, replication cannot be configured.",
    },
  ],
};
