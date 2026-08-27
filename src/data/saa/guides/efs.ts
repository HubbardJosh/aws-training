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
      quiz: [
        {
          question:
            "Multiple EC2 instances in different Availability Zones need concurrent read/write access to the same file system. Which AWS storage service should be used?",
          options: [
            "Amazon EBS with Multi-Attach enabled",
            "Amazon EFS — a shared NFS file system mountable by thousands of instances across all AZs",
            "Amazon S3 mounted via s3fs-fuse",
            "An EC2 instance acting as an NFS server",
          ],
          correctIndex: 1,
          explanation:
            "EFS is a shared POSIX-compliant NFS file system that can be mounted simultaneously by thousands of EC2 instances across all Availability Zones in a region. EBS Multi-Attach is limited to a single AZ and the io1/io2 volume type.",
        },
        {
          question:
            "Which storage type is most appropriate for storing millions of discrete objects (images, logs) accessed via an API?",
          options: [
            "Amazon EFS — shared file system",
            "Amazon EBS — block storage",
            "Amazon S3 — object storage",
            "Amazon FSx — managed file system",
          ],
          correctIndex: 2,
          explanation:
            "Amazon S3 is purpose-built for storing and retrieving discrete objects at massive scale via HTTP/S API calls. It is not a mountable file system but excels for object storage, data lakes, and content distribution.",
        },
      ],
    },
    {
      heading: "Performance Modes and Throughput Modes",
      body: `EFS offers two performance modes and two throughput modes that can be combined based on workload requirements. General Purpose performance mode (the default) offers the lowest latency for most workloads and is appropriate for web serving, content management, and home directories. Max I/O performance mode scales to higher levels of aggregate throughput and operations per second with slightly higher latency, designed for highly parallelized workloads like big data analytics and media processing that can tolerate higher per-operation latency in exchange for aggregate throughput. Bursting throughput mode (the default) provides a baseline throughput rate proportional to stored data (50 MB/s per TB) with the ability to burst to 100 MB/s for file systems under 1 TB, using burst credits accumulated during quiet periods. Provisioned throughput mode allows you to specify throughput independent of storage size, which is appropriate when your throughput requirements exceed what the bursting model can sustain — for example, a small file system with high throughput needs.`,
      quiz: [
        {
          question:
            "An EFS file system stores only 100 GB but needs consistent 500 MB/s throughput for a video processing workload. Which throughput mode should be used?",
          options: [
            "Bursting throughput — it automatically bursts as needed",
            "Provisioned throughput — throughput is specified independently of storage size",
            "Max I/O performance mode — it provides unlimited throughput",
            "General Purpose performance mode with enhanced networking",
          ],
          correctIndex: 1,
          explanation:
            "Provisioned throughput mode allows you to specify throughput independently of storage size. With only 100 GB stored, bursting mode would provide very limited baseline throughput (50 MB/s per TB = ~5 MB/s baseline), which is insufficient for a 500 MB/s requirement.",
        },
        {
          question:
            "Which EFS performance mode is recommended for highly parallelized big data analytics workloads?",
          options: [
            "General Purpose mode — lowest latency for all workloads",
            "Max I/O mode — scales to higher aggregate throughput at the cost of slightly higher per-operation latency",
            "Provisioned throughput mode — independent throughput configuration",
            "Bursting mode — provides credits for peak usage",
          ],
          correctIndex: 1,
          explanation:
            "Max I/O performance mode is designed for highly parallelized workloads that can tolerate higher per-operation latency in exchange for higher aggregate throughput and IOPS. General Purpose mode has the lowest latency but lower maximum aggregate throughput.",
        },
      ],
    },
    {
      heading: "Storage Classes and Lifecycle Management",
      body: `EFS Intelligent-Tiering automatically moves files between two storage tiers based on access patterns. The Standard storage class provides the lowest latency for frequently accessed files. The Infrequent Access (EFS-IA) storage class offers storage at up to 92% lower cost than Standard for files not accessed for a configurable number of days (7, 14, 30, 60, or 90 days). The One Zone storage classes (EFS One Zone and EFS One Zone-IA) store data in a single Availability Zone at lower cost, appropriate for development environments or workloads that can tolerate an AZ failure losing access to the file system. Lifecycle policies move files between Standard and IA tiers based on the last access time, and the transition back to Standard is triggered automatically when the file is next accessed. For the SAA-C03 exam, EFS Intelligent-Tiering (Standard + IA with lifecycle policies) is the cost-optimized choice for file systems with mixed access patterns.`,
      quiz: [
        {
          question:
            "How much cheaper is EFS Infrequent Access (EFS-IA) storage compared to EFS Standard?",
          options: [
            "Up to 30% cheaper",
            "Up to 60% cheaper",
            "Up to 92% cheaper",
            "The same price — EFS-IA only reduces retrieval costs",
          ],
          correctIndex: 2,
          explanation:
            "EFS Infrequent Access (EFS-IA) storage costs up to 92% less than EFS Standard for files that are not frequently accessed. Lifecycle policies automatically move files to EFS-IA after a configurable number of days without access.",
        },
        {
          question:
            "What is the risk of using EFS One Zone storage classes for production workloads?",
          options: [
            "One Zone EFS does not support NFS protocol version 4",
            "One Zone EFS has lower maximum throughput than Standard EFS",
            "Data is stored in a single AZ — an AZ failure could lose access to or damage the file system",
            "One Zone EFS cannot use lifecycle policies for cost optimization",
          ],
          correctIndex: 2,
          explanation:
            "EFS One Zone storage classes store data in a single Availability Zone, making them lower cost but unsuitable for production workloads where high availability across AZ failures is required.",
        },
      ],
    },
    {
      heading: "Mount Targets and VPC Connectivity",
      body: `EFS file systems are accessed through mount targets — network endpoints placed in specific VPC subnets that EC2 instances connect to using the NFS protocol (port 2049). For high availability, create one mount target per Availability Zone — EC2 instances in each AZ mount the file system via the local AZ's mount target, avoiding cross-AZ data transfer costs and reducing latency. Security groups control access to mount targets: the mount target's security group must allow inbound NFS (TCP 2049) from the EC2 instances' security groups. On-premises systems access EFS via AWS Direct Connect or AWS Site-to-Site VPN using the mount target IP addresses or DNS names. The Amazon EFS mount helper (\`amazon-efs-utils\`) simplifies mounting on Amazon Linux and other distributions, supporting TLS encryption in transit and automatic reconnection after network interruptions.`,
      quiz: [
        {
          question:
            "What is the best practice for EFS mount target placement in a multi-AZ architecture?",
          options: [
            "Create one mount target in the primary AZ; all instances use it",
            "Create one mount target per Availability Zone so instances connect locally",
            "Create mount targets in public subnets for internet accessibility",
            "Use a single mount target in a Transit Gateway subnet for centralized access",
          ],
          correctIndex: 1,
          explanation:
            "Best practice is to create one EFS mount target per Availability Zone. EC2 instances connect to the mount target in their own AZ, avoiding cross-AZ data transfer charges and reducing latency.",
        },
        {
          question:
            "Which port must the EFS mount target's security group allow inbound from EC2 instances?",
          options: [
            "TCP 443 (HTTPS)",
            "TCP 2049 (NFS)",
            "TCP 445 (SMB)",
            "UDP 111 (RPC)",
          ],
          correctIndex: 1,
          explanation:
            "EFS uses the NFS protocol on TCP port 2049. The mount target's security group must allow inbound TCP 2049 from the security groups of EC2 instances that need to mount the file system.",
        },
      ],
    },
    {
      heading: "Access Control and Encryption",
      body: `EFS access control uses a combination of POSIX permissions (standard Unix file system ownership and permission bits) and EFS Access Points. POSIX permissions control which OS users and groups can read, write, or execute files — appropriate for multi-user Linux environments where each user has their own home directory. EFS Access Points are application-specific entry points that enforce a user identity (POSIX UID/GID) for all file system operations through the access point, regardless of the client's OS user, and can root the access point at a specific directory within the file system — enabling isolated, secure access for different applications or containers sharing a single EFS file system. IAM authorization for EFS uses resource-based policies and IAM conditions to control which IAM principals can mount and access the file system. Encryption in transit uses TLS between clients and mount targets. Encryption at rest uses AWS KMS — must be enabled at creation time.`,
      quiz: [
        {
          question:
            "Multiple containers sharing an EFS file system need to be isolated from each other — each container should only see its own directory and use a specific user identity. Which EFS feature provides this?",
          options: [
            "POSIX permissions set on each directory",
            "EFS Access Points — they enforce a POSIX user identity and root the access point at a specific directory",
            "IAM policies restricting each container's IAM role",
            "Separate EFS file systems for each container",
          ],
          correctIndex: 1,
          explanation:
            "EFS Access Points enforce a specific POSIX UID/GID for all operations and can restrict access to a specific root directory within the file system. This enables multiple applications or containers to share one EFS file system with complete isolation.",
        },
        {
          question:
            "An EFS file system needs encryption at rest. When must encryption be enabled?",
          options: [
            "It can be enabled at any time by modifying the file system",
            "Only during the first 24 hours after creation",
            "At creation time — encryption at rest cannot be enabled on an existing unencrypted EFS file system",
            "Encryption is always enabled by default and cannot be disabled",
          ],
          correctIndex: 2,
          explanation:
            "EFS encryption at rest must be enabled at creation time using AWS KMS. It cannot be enabled on an existing unencrypted file system. The migration path is to create a new encrypted file system and copy data to it.",
        },
      ],
    },
    {
      heading: "EFS with Containers and Serverless",
      body: `EFS integrates natively with Amazon ECS and AWS Fargate as a volume driver for container persistent storage, allowing containers to read and write shared files that persist beyond the container lifecycle and are accessible from any container in any task running in any AZ. This is essential for stateful containerized applications like CMS platforms (WordPress), CI/CD build systems that share artifacts across pipeline stages, and ML training jobs that read from a shared dataset. AWS Lambda supports EFS as a shared file system for Lambda functions, enabling functions to share large files, models, and datasets that exceed the Lambda /tmp storage limit (512 MB, expandable to 10 GB) and that must persist across invocations. Lambda connects to EFS through a VPC (Lambda must be in the same VPC as the EFS mount target), enabling ML inference functions to load large model files from EFS on initialization rather than packaging them in the Lambda deployment.`,
      quiz: [
        {
          question:
            "A machine learning Lambda function needs to load a 5 GB model file on every cold start. The model is too large for the Lambda deployment package or /tmp storage. What is the recommended solution?",
          options: [
            "Increase the Lambda memory limit to accommodate the model",
            "Store the model in S3 and download it on every invocation",
            "Mount an EFS file system to the Lambda function and load the model from EFS",
            "Use Lambda Layers to package the model separately from the function code",
          ],
          correctIndex: 2,
          explanation:
            "EFS provides persistent shared storage that Lambda functions can mount via VPC. A large ML model stored on EFS can be loaded at function initialization, persisting across invocations without re-downloading from S3 each time.",
        },
        {
          question:
            "ECS tasks across multiple AZs need to read and write to shared persistent storage. Which storage solution is most appropriate?",
          options: [
            "An EBS volume attached to one EC2 instance acting as an NFS server",
            "Amazon EFS mounted as a volume in the ECS task definition",
            "S3 with s3fs-fuse mounted in each container",
            "An EC2 instance store volume shared via NFS",
          ],
          correctIndex: 1,
          explanation:
            "Amazon EFS integrates natively with ECS and Fargate as a volume driver. EFS file systems can be mounted simultaneously by tasks running in any AZ, providing shared persistent storage that survives container restarts and replacements.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "Ten EC2 instances across three Availability Zones need concurrent read/write access to the same set of configuration files. Which storage service is the correct choice?",
      options: [
        "Amazon EBS with Multi-Attach",
        "Amazon S3 with a VPC endpoint",
        "Amazon EFS — shared NFS file system mountable across all AZs simultaneously",
        "An EC2 instance running Samba as a file server",
      ],
      correctIndex: 2,
      explanation:
        "EFS is the correct choice for shared file system access across multiple EC2 instances in different AZs. It is a fully managed NFS file system that scales automatically and supports thousands of simultaneous mounts.",
    },
    {
      question:
        "An EFS file system stores 200 GB but requires 1 GB/s sustained throughput. Which throughput mode should be configured?",
      options: [
        "Bursting — it automatically provides 1 GB/s when needed",
        "Provisioned throughput — throughput is set independently of storage size",
        "Max I/O performance mode",
        "General Purpose mode with enhanced networking on EC2",
      ],
      correctIndex: 1,
      explanation:
        "Provisioned throughput allows you to specify throughput independently of storage size. With 200 GB stored, bursting mode would only provide about 10 MB/s baseline (50 MB/s per TB), far below the 1 GB/s requirement.",
    },
    {
      question:
        "What is the cost savings advantage of EFS Infrequent Access (EFS-IA) compared to EFS Standard?",
      options: [
        "Up to 40% cost reduction",
        "Up to 75% cost reduction",
        "Up to 92% cost reduction for storage",
        "EFS-IA is the same storage price but retrieval is free",
      ],
      correctIndex: 2,
      explanation:
        "EFS-IA storage costs up to 92% less than EFS Standard. Files are automatically transitioned to EFS-IA by lifecycle policies after a configurable period without access, and transitioned back to Standard when accessed again.",
    },
    {
      question:
        "How many EFS mount targets should be created for a multi-AZ VPC with three Availability Zones?",
      options: [
        "One mount target for the entire VPC",
        "Three mount targets — one per Availability Zone",
        "One per subnet in the primary AZ",
        "As many as the number of EC2 instances",
      ],
      correctIndex: 1,
      explanation:
        "Best practice is to create one EFS mount target per Availability Zone. Instances connect to the mount target in their own AZ to avoid cross-AZ data transfer charges and minimize latency.",
    },
    {
      question:
        "A Lambda function needs access to a shared 8 GB dataset that persists across invocations and is too large for /tmp. Which solution is correct?",
      options: [
        "Increase Lambda memory to 10 GB and store the dataset in /tmp",
        "Use a Lambda Layer to package the 8 GB dataset",
        "Mount an EFS file system to the Lambda function via VPC",
        "Store the dataset in S3 and cache it in DynamoDB for fast access",
      ],
      correctIndex: 2,
      explanation:
        "Lambda supports EFS as a shared file system. The Lambda function must be VPC-enabled (in the same VPC as the EFS mount target). EFS provides persistent storage that survives across invocations, unlike /tmp which is reset between cold starts.",
    },
    {
      question:
        "Multiple containerized applications sharing an EFS file system need to be isolated — each app should only access its own directory and operate as a specific user. Which feature provides this isolation?",
      options: [
        "Separate IAM roles per container",
        "EFS lifecycle policies per application directory",
        "EFS Access Points with enforced POSIX UID/GID and root directory",
        "POSIX chmod permissions set manually on each directory",
      ],
      correctIndex: 2,
      explanation:
        "EFS Access Points enforce a specific POSIX user identity (UID/GID) and root directory for all access through the access point, regardless of the OS user in the container. This provides strong isolation between applications sharing one file system.",
    },
    {
      question:
        "An EFS file system needs to be encrypted at rest. When must encryption be enabled?",
      options: [
        "It can be enabled at any time using the AWS console",
        "Within 30 days of file system creation",
        "At file system creation time — it cannot be enabled on existing unencrypted file systems",
        "Only when the file system contains sensitive data",
      ],
      correctIndex: 2,
      explanation:
        "EFS encryption at rest must be configured at creation time. It cannot be enabled on an existing unencrypted EFS file system. Organizations that need encryption must create a new encrypted file system and migrate data.",
    },
    {
      question:
        "Which EFS performance mode is appropriate for web serving and home directory workloads with low latency requirements?",
      options: [
        "Max I/O — provides the highest throughput",
        "General Purpose — lowest per-operation latency, appropriate for most workloads",
        "Provisioned throughput — independent of storage size",
        "Bursting — accumulates credits during low-traffic periods",
      ],
      correctIndex: 1,
      explanation:
        "General Purpose performance mode provides the lowest per-operation latency and is recommended for the majority of workloads including web serving, CMS, and home directories. Max I/O is reserved for highly parallelized big data workloads.",
    },
  ],
};
