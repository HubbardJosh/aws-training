import { ServiceGuide } from "../../../types/guide";

export const s3Guide: ServiceGuide = {
  id: "clf-s3",
  service: "Amazon S3",
  domain: "development",
  tagline: "Infinitely scalable object storage in the cloud",
  intro:
    "Amazon Simple Storage Service (S3) is a fully managed object storage service offering industry-leading scalability, durability, and availability for storing and retrieving any amount of data from anywhere on the web.",

  sections: [
    {
      heading: "Core Concepts: Buckets and Objects",
      body: `S3 organizes data into **buckets** — containers that hold your data. Each bucket has a globally unique name and is created in a specific AWS region. Inside a bucket you store **objects**, which consist of the data itself (up to 5 TB per object) plus metadata (key-value pairs describing the object).

Every object is identified by a **key**, which is essentially its full path within the bucket. For example, a key might be \`images/profile/user123.jpg\`. S3 is not a traditional file system — there are no actual folders — but tools often display the slash-delimited key structure as if there were a directory hierarchy.

You access objects via URLs in the format \`https://<bucket>.s3.<region>.amazonaws.com/<key>\`. By default, objects are private; you control access through bucket policies, access control lists, and IAM permissions.`,
      quiz: [
        {
          question:
            "What is the maximum size of a single object that can be stored in Amazon S3?",
          options: ["1 TB", "Unlimited", "10 TB", "5 TB"],
          correctIndex: 3,
          explanation:
            "A single S3 object can be up to 5 TB in size. The bucket itself has unlimited storage capacity and can hold any number of objects.",
        },
        {
          question:
            "Which of the following statements about Amazon S3 bucket names is correct?",
          options: [
            "Bucket names must be unique within an AWS region",
            "Bucket names must be unique within a single AWS account",
            "Bucket names can be reused after a bucket is deleted after 24 hours",
            "Bucket names must be globally unique across all AWS accounts",
          ],
          correctIndex: 3,
          explanation:
            "S3 bucket names must be globally unique across all AWS accounts and all regions. Because bucket names appear in URLs used to access objects, they form part of a global namespace.",
        },
      ],
    },
    {
      heading: "Storage Classes",
      body: `S3 offers multiple **storage classes** optimized for different access patterns and cost trade-offs. Choosing the right class can substantially reduce storage costs.

**S3 Standard** is the default class, designed for frequently accessed data. It provides 99.999999999% (eleven nines) durability and 99.99% availability, and is appropriate for active data, websites, and data analytics.

**S3 Standard-IA** (Infrequent Access) costs less per GB stored but charges a retrieval fee. It suits data accessed monthly or less, like backups or disaster recovery files.

**S3 One Zone-IA** is similar to Standard-IA but stores data in only one Availability Zone, reducing cost at the expense of resilience. Use it only for data you can reconstruct if lost.

**S3 Glacier Instant Retrieval**, **S3 Glacier Flexible Retrieval**, and **S3 Glacier Deep Archive** provide progressively cheaper storage for archival data, with retrieval times ranging from milliseconds to hours. Glacier Deep Archive is the lowest-cost storage in AWS.

**S3 Intelligent-Tiering** automatically moves objects between access tiers based on observed access patterns, making it a good fit when access patterns are unknown or variable.`,
      quiz: [
        {
          question:
            "A company stores compliance records that are rarely accessed but must be retained for 7 years at the lowest possible cost. Which S3 storage class is most appropriate?",
          options: [
            "S3 Standard, for maximum availability",
            "S3 Standard-IA, for infrequent access with fast retrieval",
            "S3 Glacier Deep Archive, for the lowest-cost long-term archival storage",
            "S3 One Zone-IA, to minimize cost by using a single AZ",
          ],
          correctIndex: 2,
          explanation:
            "S3 Glacier Deep Archive is the lowest-cost storage option in AWS, designed for long-term archival of data that is rarely accessed. It is ideal for compliance records that must be retained for years at minimal cost.",
        },
        {
          question:
            "A company has data with unpredictable access patterns — some objects are accessed frequently, others not at all. Which S3 storage class automatically optimizes costs based on access patterns?",
          options: [
            "S3 Intelligent-Tiering, which automatically moves objects between tiers based on access",
            "S3 Standard, because it handles all access patterns well",
            "S3 Glacier Instant Retrieval, which provides fast access at low cost",
            "S3 Standard-IA, because it charges only when data is retrieved",
          ],
          correctIndex: 0,
          explanation:
            "S3 Intelligent-Tiering automatically moves objects between access tiers based on observed access patterns. It is the best choice when access patterns are unknown or variable, as it optimizes cost without performance impact or retrieval fees.",
        },
      ],
    },
    {
      heading: "Durability, Availability, and Redundancy",
      body: `S3 is designed for **99.999999999% (11 nines) durability** — meaning if you store 10 million objects, you can expect to lose at most one object once in 10,000 years. AWS achieves this by automatically replicating data across at least three Availability Zones within a region (for Standard and Standard-IA).

**Availability** is distinct from durability. Standard provides 99.99% availability, meaning S3 may be unavailable for roughly 52 minutes per year. In practice, S3 is extremely reliable and outages are rare.

**Versioning** is an optional bucket feature that preserves every version of every object. When enabled, deleting an object places a delete marker instead of removing the data; you can restore previous versions at any time. Versioning is useful for protecting against accidental deletion and for audit trails.

**Cross-Region Replication (CRR)** automatically copies objects from one bucket to a bucket in a different region, useful for disaster recovery or serving content closer to global users.`,
      quiz: [
        {
          question:
            "What does enabling S3 Versioning do when an object is deleted?",
          options: [
            "Moves the object to the Glacier storage class for cost-efficient retention",
            "Copies the deleted object to a designated backup bucket automatically",
            "Permanently deletes the object and all previous versions immediately",
            "Places a delete marker on the object, preserving all previous versions for potential restoration",
          ],
          correctIndex: 3,
          explanation:
            "When versioning is enabled and an object is deleted, S3 places a delete marker instead of permanently removing the data. All previous versions are preserved and can be restored at any time, protecting against accidental deletion.",
        },
      ],
    },
    {
      heading: "Access Control and Security",
      body: `S3 offers layered access control. **Bucket Policies** are JSON documents attached to a bucket that grant or deny access to principals (AWS accounts, IAM users, roles, or the public). **IAM Policies** attached to users or roles control access from within your AWS account. **Access Control Lists (ACLs)** are a legacy mechanism that should generally be avoided in favor of bucket policies.

**Block Public Access** is a safety mechanism — enabled by default on new buckets — that prevents accidental public exposure regardless of bucket policies or ACLs. Always verify this setting before hosting public content.

**S3 Bucket Policies** are commonly used to make a bucket publicly readable for static website hosting, or to restrict access to specific VPC endpoints or IP ranges.

**Server-Side Encryption** is enabled by default on all new S3 buckets. AWS encrypts each object with AES-256 using keys managed by AWS (SSE-S3), or you can use AWS KMS-managed keys (SSE-KMS) for finer control and audit trails.

For data in transit, S3 enforces HTTPS for all API calls, ensuring data is encrypted between your client and AWS.`,
      quiz: [
        {
          question:
            "A developer configured a bucket policy to allow public read access, but objects are still not publicly accessible. What is the most likely cause?",
          options: [
            "S3 Block Public Access is enabled on the bucket, overriding the bucket policy",
            "Objects must be individually marked public using ACLs",
            "Public access requires an IAM policy in addition to a bucket policy",
            "The bucket is in a region that does not support public access",
          ],
          correctIndex: 0,
          explanation:
            "S3 Block Public Access is a safety mechanism that overrides bucket policies and ACLs to prevent accidental public exposure. It is enabled by default on new buckets. To allow public access, Block Public Access must be explicitly disabled before the bucket policy takes effect.",
        },
        {
          question:
            "What type of encryption does Amazon S3 use by default for new objects?",
          options: [
            "No encryption — it must be explicitly enabled by the bucket owner",
            "Client-side encryption using keys the customer manages locally",
            "Server-side encryption with AES-256 using AWS-managed keys (SSE-S3)",
            "Server-side encryption with RSA-2048 using customer-provided keys",
          ],
          correctIndex: 2,
          explanation:
            "Server-side encryption is enabled by default on all new S3 buckets. AWS encrypts each object using AES-256 with keys managed by AWS (SSE-S3). Customers can optionally use SSE-KMS for finer control and audit trails via AWS KMS.",
        },
      ],
    },
    {
      heading: "Common Use Cases",
      body: `S3's flexibility makes it suitable for a wide range of use cases across nearly every type of application.

**Static Website Hosting**: S3 can serve static HTML, CSS, and JavaScript files as a website. You enable the static website hosting feature on a bucket, configure an index document, and optionally attach a custom domain via Route 53. For global performance, you place CloudFront in front of S3 as a CDN.

**Data Lake**: Many organizations use S3 as the storage backbone of a data lake — a central repository for raw data in any format. AWS analytics services like Athena, Glue, and Redshift Spectrum can query data directly in S3.

**Backup and Archive**: S3 Lifecycle Policies automate transitions between storage classes and object expiration. For example, you can move objects to Standard-IA after 30 days and to Glacier after 90 days, reducing costs automatically.

**Content Distribution**: Applications upload user-generated content (images, videos, documents) to S3 and serve it directly or through CloudFront. Pre-signed URLs allow time-limited access to private objects without making them publicly readable.`,
      quiz: [
        {
          question:
            "A company wants to grant a user temporary access to download a private S3 object without making it publicly accessible. What is the correct approach?",
          options: [
            "Move the object to a public bucket and share the URL",
            "Temporarily disable Block Public Access and re-enable it after the download",
            "Create a public IAM policy and attach it to the requesting user",
            "Generate a pre-signed URL that grants time-limited access to the private object",
          ],
          correctIndex: 3,
          explanation:
            "Pre-signed URLs grant time-limited access to a specific private S3 object without changing the object's permissions or making it publicly readable. The URL includes an embedded expiry time after which access is revoked automatically.",
        },
        {
          question:
            "A company wants to automatically move S3 objects to a cheaper storage class after 30 days and delete them after 1 year. What feature should they configure?",
          options: [
            "S3 Versioning with automatic deletion rules",
            "Cross-Region Replication with storage class overrides",
            "S3 Lifecycle Policies that transition and expire objects based on age",
            "S3 Intelligent-Tiering with a custom retention period",
          ],
          correctIndex: 2,
          explanation:
            "S3 Lifecycle Policies automate transitions between storage classes and object expiration. You can define rules such as moving objects to Standard-IA after 30 days, to Glacier after 90 days, and expiring (deleting) them after 365 days.",
        },
      ],
    },
  ],

  keyFacts: [
    "S3 stores objects (files) in buckets; bucket names must be globally unique",
    "Objects can be up to 5 TB; the bucket itself has unlimited storage capacity",
    "Durability is 11 nines (99.999999999%) by default for Standard class",
    "Storage classes: Standard, Standard-IA, One Zone-IA, Glacier tiers, Intelligent-Tiering",
    "Block Public Access is on by default — protects against accidental public exposure",
    "Versioning preserves all object versions; restores from accidental deletion",
    "Lifecycle Policies automate transitions to cheaper storage classes",
    "Server-side encryption is enabled by default with AES-256 (SSE-S3)",
    "Static website hosting can be enabled on a bucket",
    "Cross-Region Replication copies objects automatically to another region",
  ],

  relatedServices: [
    "Amazon CloudFront",
    "AWS Glacier",
    "AWS KMS",
    "Amazon Athena",
    "Amazon Route 53",
  ],

  examTips: [
    "S3 is object storage — not a file system or block storage",
    "Durability (11 nines) and availability (99.99%) are different metrics",
    "Block Public Access overrides bucket policies — verify it is configured correctly",
    "Standard-IA and Glacier cost less per GB stored but charge retrieval fees",
    "Versioning prevents accidental deletion; costs more because all versions are stored",
    "Lifecycle Policies automatically move objects to cheaper storage to reduce cost",
    "Pre-signed URLs grant time-limited access to private objects without making them public",
    "Use CloudFront in front of S3 for global low-latency delivery of static content",
  ],

  topicQuiz: [
    {
      question: "What type of storage service is Amazon S3?",
      options: [
        "Block storage, like a hard drive attached to a server",
        "File storage, organized in a traditional folder hierarchy",
        "Object storage, where data is stored as objects with a key and metadata",
        "In-memory storage, for caching frequently accessed data",
      ],
      correctIndex: 2,
      explanation:
        "Amazon S3 is an object storage service. Data is stored as objects consisting of the data itself plus metadata, identified by a unique key. It is not a block storage or traditional file system.",
    },
    {
      question: "What is the durability rating of Amazon S3 Standard storage?",
      options: [
        "99.9% (three nines)",
        "99.99% (four nines)",
        "99.999% (five nines)",
        "99.999999999% (eleven nines)",
      ],
      correctIndex: 3,
      explanation:
        "Amazon S3 Standard is designed for 99.999999999% (eleven nines) durability. AWS achieves this by automatically replicating data across at least three Availability Zones within a region.",
    },
    {
      question:
        "Which S3 storage class stores data in only one Availability Zone, making it lower cost but less resilient?",
      options: [
        "S3 Intelligent-Tiering",
        "S3 Standard-IA",
        "S3 Glacier Instant Retrieval",
        "S3 One Zone-IA",
      ],
      correctIndex: 3,
      explanation:
        "S3 One Zone-IA stores data in only one Availability Zone, making it less expensive than Standard-IA but without the multi-AZ resilience. It should only be used for data that can be reconstructed if an AZ fails.",
    },
    {
      question:
        "A company needs to replicate S3 objects automatically to a bucket in a different AWS region for disaster recovery. Which feature should they enable?",
      options: [
        "Cross-Region Replication (CRR), which automatically copies objects to another region",
        "S3 Lifecycle Policies, which move objects between regions after a set period",
        "S3 Multi-AZ, which stores objects in multiple regions simultaneously",
        "S3 Versioning, which tracks all object versions across regions",
      ],
      correctIndex: 0,
      explanation:
        "Cross-Region Replication (CRR) automatically copies objects from one S3 bucket to a bucket in a different AWS region. It requires versioning to be enabled on both the source and destination buckets.",
    },
    {
      question:
        "Which S3 feature should a company use to serve their static website HTML, CSS, and JavaScript files directly from S3?",
      options: [
        "S3 Presigned URLs, which grant temporary access to objects",
        "S3 Replication, which copies content to edge locations",
        "S3 Static Website Hosting, which serves static content from a bucket",
        "S3 Transfer Acceleration, which speeds up uploads and downloads",
      ],
      correctIndex: 2,
      explanation:
        "S3 Static Website Hosting is a feature that lets you serve static HTML, CSS, and JavaScript files from an S3 bucket as a website. For global performance, CloudFront is typically placed in front of the S3 bucket as a CDN.",
    },
    {
      question: "What is the purpose of S3 Block Public Access?",
      options: [
        "To encrypt objects at rest using AWS-managed keys",
        "To block all external HTTP requests and allow only HTTPS access",
        "To prevent accidental public exposure of bucket contents, overriding any permissive bucket policies or ACLs",
        "To limit the number of API calls that can be made to a bucket per second",
      ],
      correctIndex: 2,
      explanation:
        "S3 Block Public Access is a safety mechanism enabled by default on new buckets that prevents accidental public exposure. It overrides bucket policies and ACLs, ensuring objects remain private even if a policy mistakenly grants public access.",
    },
    {
      question:
        "An application needs to store large user-generated video files. The videos are accessed frequently in the first week after upload, then rarely accessed afterward. Which approach minimizes cost?",
      options: [
        "Store videos in S3 One Zone-IA for lower cost from the beginning",
        "Store videos in S3 Standard permanently since retrieval fees make other classes more expensive",
        "Store all videos in S3 Glacier from the start to maximize savings",
        "Store videos in S3 Standard and use a Lifecycle Policy to transition them to Standard-IA after 30 days",
      ],
      correctIndex: 3,
      explanation:
        "Using S3 Standard for the first 30 days (when videos are frequently accessed) and then transitioning them to Standard-IA via a Lifecycle Policy minimizes cost. Standard-IA is cheaper per GB stored for infrequently accessed data, though it charges a retrieval fee.",
    },
    {
      question:
        "Which AWS analytics services can query data stored directly in S3 as part of a data lake architecture?",
      options: [
        "Amazon Athena, AWS Glue, and Amazon Redshift Spectrum",
        "Amazon DynamoDB and Amazon DocumentDB",
        "Amazon RDS and Amazon Aurora",
        "Amazon ElastiCache and Amazon MemoryDB",
      ],
      correctIndex: 0,
      explanation:
        "Amazon Athena, AWS Glue, and Amazon Redshift Spectrum can query data directly in S3 without requiring it to be loaded into a separate database. This makes S3 the foundation of a cost-effective data lake architecture.",
    },
  ],
};
