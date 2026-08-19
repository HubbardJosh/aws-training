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
    },
    {
      heading: "Storage Classes",
      body: `S3 offers multiple **storage classes** optimized for different access patterns and cost trade-offs. Choosing the right class can substantially reduce storage costs.

**S3 Standard** is the default class, designed for frequently accessed data. It provides 99.999999999% (eleven nines) durability and 99.99% availability, and is appropriate for active data, websites, and data analytics.

**S3 Standard-IA** (Infrequent Access) costs less per GB stored but charges a retrieval fee. It suits data accessed monthly or less, like backups or disaster recovery files.

**S3 One Zone-IA** is similar to Standard-IA but stores data in only one Availability Zone, reducing cost at the expense of resilience. Use it only for data you can reconstruct if lost.

**S3 Glacier Instant Retrieval**, **S3 Glacier Flexible Retrieval**, and **S3 Glacier Deep Archive** provide progressively cheaper storage for archival data, with retrieval times ranging from milliseconds to hours. Glacier Deep Archive is the lowest-cost storage in AWS.

**S3 Intelligent-Tiering** automatically moves objects between access tiers based on observed access patterns, making it a good fit when access patterns are unknown or variable.`,
    },
    {
      heading: "Durability, Availability, and Redundancy",
      body: `S3 is designed for **99.999999999% (11 nines) durability** — meaning if you store 10 million objects, you can expect to lose at most one object once in 10,000 years. AWS achieves this by automatically replicating data across at least three Availability Zones within a region (for Standard and Standard-IA).

**Availability** is distinct from durability. Standard provides 99.99% availability, meaning S3 may be unavailable for roughly 52 minutes per year. In practice, S3 is extremely reliable and outages are rare.

**Versioning** is an optional bucket feature that preserves every version of every object. When enabled, deleting an object places a delete marker instead of removing the data; you can restore previous versions at any time. Versioning is useful for protecting against accidental deletion and for audit trails.

**Cross-Region Replication (CRR)** automatically copies objects from one bucket to a bucket in a different region, useful for disaster recovery or serving content closer to global users.`,
    },
    {
      heading: "Access Control and Security",
      body: `S3 offers layered access control. **Bucket Policies** are JSON documents attached to a bucket that grant or deny access to principals (AWS accounts, IAM users, roles, or the public). **IAM Policies** attached to users or roles control access from within your AWS account. **Access Control Lists (ACLs)** are a legacy mechanism that should generally be avoided in favor of bucket policies.

**Block Public Access** is a safety mechanism — enabled by default on new buckets — that prevents accidental public exposure regardless of bucket policies or ACLs. Always verify this setting before hosting public content.

**S3 Bucket Policies** are commonly used to make a bucket publicly readable for static website hosting, or to restrict access to specific VPC endpoints or IP ranges.

**Server-Side Encryption** is enabled by default on all new S3 buckets. AWS encrypts each object with AES-256 using keys managed by AWS (SSE-S3), or you can use AWS KMS-managed keys (SSE-KMS) for finer control and audit trails.

For data in transit, S3 enforces HTTPS for all API calls, ensuring data is encrypted between your client and AWS.`,
    },
    {
      heading: "Common Use Cases",
      body: `S3's flexibility makes it suitable for a wide range of use cases across nearly every type of application.

**Static Website Hosting**: S3 can serve static HTML, CSS, and JavaScript files as a website. You enable the static website hosting feature on a bucket, configure an index document, and optionally attach a custom domain via Route 53. For global performance, you place CloudFront in front of S3 as a CDN.

**Data Lake**: Many organizations use S3 as the storage backbone of a data lake — a central repository for raw data in any format. AWS analytics services like Athena, Glue, and Redshift Spectrum can query data directly in S3.

**Backup and Archive**: S3 Lifecycle Policies automate transitions between storage classes and object expiration. For example, you can move objects to Standard-IA after 30 days and to Glacier after 90 days, reducing costs automatically.

**Content Distribution**: Applications upload user-generated content (images, videos, documents) to S3 and serve it directly or through CloudFront. Pre-signed URLs allow time-limited access to private objects without making them publicly readable.`,
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
};
