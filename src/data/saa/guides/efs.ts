import { ServiceGuide } from "../../../types/guide";

export const efsGuide: ServiceGuide = {
  id: "saa-efs",
  service: "Amazon EFS",
  domain: "services",
  tagline:
    "Fully managed elastic NFS file system for shared access across EC2 instances",
  intro:
    "Amazon Elastic File System (EFS) provides a fully managed, elastic, POSIX-compliant NFS file system that multiple EC2 instances, ECS tasks, Lambda functions, and on-premises servers can mount simultaneously, scaling storage capacity automatically without provisioning or managing servers.",

  sections: [
    {
      heading: "EFS vs. EBS vs. S3: Choosing the Right Storage",
      body: `Understanding when to use EFS versus EBS versus S3 is a core SAA-C03 competency. EBS volumes are block storage attached to a single EC2 instance in a single AZ — they provide the highest IOPS and lowest latency but cannot be shared across instances or AZs without complex multi-attach configurations. EFS is a shared file system mountable by thousands of instances simultaneously across all AZs in a region, ideal for workloads requiring shared access to a common file namespace. S3 is object storage accessed via API calls, not a mountable file system, and is best for storing and retrieving discrete objects at massive scale. Choose EFS when multiple EC2 instances or containers need concurrent read/write access to the same file system — web server content, shared configuration files, home directories, container persistent storage, and machine learning training datasets are archetypal EFS use cases.`,
    },
    {
      heading: "Performance Modes and Throughput Modes",
      body: `EFS offers two performance modes and two throughput modes that can be combined based on workload requirements. General Purpose performance mode (the default) offers the lowest latency for most workloads and is appropriate for web serving, content management, and home directories. Max I/O performance mode scales to higher levels of aggregate throughput and operations per second with slightly higher latency, designed for highly parallelized workloads like big data analytics and media processing that can tolerate higher per-operation latency in exchange for aggregate throughput. Bursting throughput mode (the default) provides a baseline throughput rate proportional to stored data (50 MB/s per TB) with the ability to burst to 100 MB/s for file systems under 1 TB, using burst credits accumulated during quiet periods. Provisioned throughput mode allows you to specify throughput independent of storage size, which is appropriate when your throughput requirements exceed what the bursting model can sustain — for example, a small file system with high throughput needs.`,
    },
    {
      heading: "Storage Classes and Lifecycle Management",
      body: `EFS Intelligent-Tiering automatically moves files between two storage tiers based on access patterns. The Standard storage class provides the lowest latency for frequently accessed files. The Infrequent Access (EFS-IA) storage class offers storage at up to 92% lower cost than Standard for files not accessed for a configurable number of days (7, 14, 30, 60, or 90 days). The One Zone storage classes (EFS One Zone and EFS One Zone-IA) store data in a single Availability Zone at lower cost, appropriate for development environments or workloads that can tolerate an AZ failure losing access to the file system. Lifecycle policies move files between Standard and IA tiers based on the last access time, and the transition back to Standard is triggered automatically when the file is next accessed. For the SAA-C03 exam, EFS Intelligent-Tiering (Standard + IA with lifecycle policies) is the cost-optimized choice for file systems with mixed access patterns.`,
    },
    {
      heading: "Mount Targets and VPC Connectivity",
      body: `EFS file systems are accessed through mount targets — network endpoints placed in specific VPC subnets that EC2 instances connect to using the NFS protocol (port 2049). For high availability, create one mount target per Availability Zone — EC2 instances in each AZ mount the file system via the local AZ's mount target, avoiding cross-AZ data transfer costs and reducing latency. Security groups control access to mount targets: the mount target's security group must allow inbound NFS (TCP 2049) from the EC2 instances' security groups. On-premises systems access EFS via AWS Direct Connect or AWS Site-to-Site VPN using the mount target IP addresses or DNS names. The Amazon EFS mount helper (\`amazon-efs-utils\`) simplifies mounting on Amazon Linux and other distributions, supporting TLS encryption in transit and automatic reconnection after network interruptions.`,
    },
    {
      heading: "Access Control and Encryption",
      body: `EFS access control uses a combination of POSIX permissions (standard Unix file system ownership and permission bits) and EFS Access Points. POSIX permissions control which OS users and groups can read, write, or execute files — appropriate for multi-user Linux environments where each user has their own home directory. EFS Access Points are application-specific entry points that enforce a user identity (POSIX UID/GID) for all file system operations through the access point, regardless of the client's OS user, and can root the access point at a specific directory within the file system — enabling isolated, secure access for different applications or containers sharing a single EFS file system. IAM authorization for EFS uses resource-based policies and IAM conditions to control which IAM principals can mount and access the file system. Encryption in transit uses TLS between clients and mount targets. Encryption at rest uses AWS KMS — must be enabled at creation time.`,
    },
    {
      heading: "EFS with Containers and Serverless",
      body: `EFS integrates natively with Amazon ECS and AWS Fargate as a volume driver for container persistent storage, allowing containers to read and write shared files that persist beyond the container lifecycle and are accessible from any container in any task running in any AZ. This is essential for stateful containerized applications like CMS platforms (WordPress), CI/CD build systems that share artifacts across pipeline stages, and ML training jobs that read from a shared dataset. AWS Lambda supports EFS as a shared file system for Lambda functions, enabling functions to share large files, models, and datasets that exceed the Lambda /tmp storage limit (512 MB, expandable to 10 GB) and that must persist across invocations. Lambda connects to EFS through a VPC (Lambda must be in the same VPC as the EFS mount target), enabling ML inference functions to load large model files from EFS on initialization rather than packaging them in the Lambda deployment.`,
    },
  ],

  keyFacts: [
    "EFS is a shared NFS file system mountable by thousands of EC2 instances across all AZs simultaneously",
    "EBS: single AZ, single instance (usually); EFS: multi-AZ, multi-instance; S3: object API, not mountable",
    "General Purpose mode: lowest latency; Max I/O mode: highest aggregate throughput for parallel workloads",
    "Bursting throughput: proportional to storage size; Provisioned throughput: independent of storage size",
    "EFS-IA costs up to 92% less than EFS Standard for infrequently accessed files",
    "Create one mount target per AZ for high availability and to avoid cross-AZ transfer costs",
    "EFS Access Points enforce POSIX user identity and root directory for application isolation",
    "Encryption at rest (KMS) must be enabled at creation; in-transit encryption uses TLS",
    "EFS integrates with ECS/Fargate and Lambda as a shared persistent volume",
    "One Zone storage classes save cost by storing data in a single AZ — not for production HA workloads",
  ],

  relatedServices: [
    "Amazon EC2",
    "Amazon ECS",
    "AWS Fargate",
    "AWS Lambda",
    "AWS Direct Connect",
    "AWS KMS",
  ],

  examTips: [
    "Multi-instance shared file access = EFS; single-instance block storage = EBS; object storage = S3",
    "EFS automatically scales capacity — no provisioning required, unlike EBS which requires size specification",
    "One mount target per AZ is the HA best practice — not one per VPC",
    "EFS Access Points provide per-application POSIX identity isolation on a shared file system",
    "Max I/O mode trades higher per-op latency for aggregate throughput — only for highly parallel big data workloads",
    "Provisioned throughput is needed when a small file system requires high sustained throughput",
    "Lambda + EFS enables loading large ML models that exceed Lambda /tmp storage limits",
    "EFS One Zone is significantly cheaper but risks data loss if the AZ fails — use only for non-critical data",
  ],
};
