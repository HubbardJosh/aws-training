import { ServiceGuide } from "../../../types/guide";

export const ec2Guide: ServiceGuide = {
  id: "saa-ec2",
  service: "Amazon EC2",
  domain: "deployment",
  tagline: "Scalable virtual servers powering diverse architectural workloads",
  intro:
    "Amazon Elastic Compute Cloud (EC2) provides resizable compute capacity in the cloud, enabling architects to design flexible, scalable, and highly available systems by selecting the right instance types, purchasing models, and placement strategies for each workload.",

  sections: [
    {
      heading: "Choosing the Right Instance Type",
      body: `Selecting an instance type is one of the most consequential architectural decisions when designing on EC2. The naming convention encodes the family, generation, and size — for example, \`r6g.2xlarge\` is the memory-optimized R family, sixth generation, Graviton2 processor, 2x large. General-purpose families (M and T) balance CPU, memory, and network for web servers and small databases. Compute-optimized C families excel for CPU-bound workloads like batch processing and machine learning inference. Memory-optimized R and X families suit in-memory databases, real-time analytics, and large SAP HANA deployments. Storage-optimized I and D families deliver high sequential I/O for NoSQL databases and data warehousing. For the SAA-C03 exam, you must match the workload characteristic to the correct family rather than default to the largest or cheapest type.`,
      quiz: [
        {
          question:
            "A team is running a large in-memory analytics database that requires 512 GB of RAM. Which EC2 instance family is most appropriate?",
          options: [
            "C family (Compute Optimized)",
            "M family (General Purpose)",
            "R or X family (Memory Optimized)",
            "I family (Storage Optimized)",
          ],
          correctIndex: 2,
          explanation:
            "Memory-optimized R and X families are designed for workloads requiring large amounts of RAM, such as in-memory databases, real-time analytics, and SAP HANA. They provide the highest memory-to-vCPU ratios.",
        },
        {
          question:
            "Which EC2 instance family is best suited for CPU-bound batch processing and machine learning inference workloads?",
          options: [
            "T family — burstable general purpose",
            "C family — compute optimized",
            "R family — memory optimized",
            "D family — storage optimized",
          ],
          correctIndex: 1,
          explanation:
            "The C (Compute Optimized) family provides a high ratio of vCPUs to memory and is designed for CPU-intensive workloads like batch processing, scientific modeling, and ML inference.",
        },
        {
          question:
            "What does the 'g' suffix in the instance type name r6g.2xlarge indicate?",
          options: [
            "GPU acceleration",
            "General-purpose storage",
            "AWS Graviton (ARM-based) processor",
            "Geographic availability in a specific region",
          ],
          correctIndex: 2,
          explanation:
            "The 'g' suffix indicates an AWS Graviton processor (ARM-based). Graviton instances typically offer better price-performance than equivalent x86 instances for supported workloads.",
        },
      ],
    },
    {
      heading: "Purchasing Models and Cost Optimization",
      body: `AWS offers multiple purchasing models, and architects layer them to minimize cost while meeting availability requirements. On-Demand instances provide maximum flexibility at full price — appropriate for short-lived, unpredictable, or stateful workloads where interruption is unacceptable. Reserved Instances (Standard or Convertible) commit to one or three years and save up to 72%; they suit predictable baselines. Savings Plans extend similar discounts across Lambda and Fargate in addition to EC2 without locking you to a specific instance type. Spot Instances offer up to 90% savings by utilizing spare capacity, but AWS may reclaim them with a two-minute warning, making them ideal for stateless web tiers, big data processing, and batch jobs designed to checkpoint and resume. A well-architected cost strategy typically combines Reserved or Savings Plans capacity for the baseline with Spot or On-Demand for burst, and Dedicated Hosts only where licensing or compliance mandates physical isolation.`,
      quiz: [
        {
          question:
            "A data processing job runs for 4 hours every night, is stateless, and can be restarted if interrupted. Which purchasing model provides the most cost savings?",
          options: [
            "On-Demand instances for maximum flexibility",
            "Spot Instances — up to 90% savings for fault-tolerant, stateless workloads",
            "Reserved Instances with a 1-year term",
            "Dedicated Hosts for consistent performance",
          ],
          correctIndex: 1,
          explanation:
            "Spot Instances are ideal for stateless, fault-tolerant workloads that can be interrupted and restarted. They offer up to 90% savings over On-Demand pricing by utilizing spare EC2 capacity.",
        },
        {
          question:
            "A company has a stable web application running 24/7 for at least the next 3 years. Which purchasing model provides the greatest cost savings?",
          options: [
            "Spot Instances — cheapest option",
            "On-Demand — most flexible",
            "Standard Reserved Instances with a 3-year term — up to 72% savings",
            "Dedicated Hosts with On-Demand pricing",
          ],
          correctIndex: 2,
          explanation:
            "Standard Reserved Instances with a 3-year term provide up to 72% savings over On-Demand for predictable, steady-state workloads. The long-term commitment justifies the discount for a 3-year deployment.",
        },
      ],
    },
    {
      heading: "Placement Groups and High Availability",
      body: `EC2 placement groups control how instances are distributed across underlying hardware to meet latency or fault-tolerance requirements. A **Cluster placement group** packs instances close together within a single Availability Zone, providing the lowest network latency and highest throughput for tightly coupled HPC workloads — at the cost of exposing all instances to the same physical failure domain. A **Spread placement group** places each instance on distinct underlying hardware, capping the blast radius of hardware failures; it supports up to seven running instances per AZ per group, making it ideal for small critical workloads like a primary database and its read replicas. A **Partition placement group** divides instances into logical partitions, each backed by its own rack, supporting hundreds of instances for large distributed systems like HDFS, HBase, and Cassandra. Spreading instances across multiple Availability Zones using Auto Scaling Groups remains the primary strategy for general high availability.`,
      quiz: [
        {
          question:
            "An HPC workload requires the lowest possible network latency between 20 EC2 instances. Which placement group type should be used?",
          options: [
            "Spread placement group",
            "Partition placement group",
            "Cluster placement group",
            "No placement group — default AWS placement is sufficient",
          ],
          correctIndex: 2,
          explanation:
            "Cluster placement groups pack instances close together within a single AZ, providing the lowest network latency and highest throughput. The trade-off is reduced fault isolation since all instances share the same physical failure domain.",
        },
        {
          question:
            "A critical application has 5 EC2 instances, and no two instances should share the same underlying hardware to minimize the blast radius of hardware failures. Which placement group type is appropriate?",
          options: [
            "Cluster placement group",
            "Spread placement group — each instance on distinct hardware, max 7 per AZ",
            "Partition placement group",
            "No placement group — instances are already on separate hardware by default",
          ],
          correctIndex: 1,
          explanation:
            "Spread placement groups place each instance on distinct underlying hardware within an AZ, ensuring hardware failures affect at most one instance. It supports up to 7 running instances per AZ per group, suitable for small critical workloads.",
        },
      ],
    },
    {
      heading: "Storage Architecture for EC2",
      body: `EC2 instances access storage through several mechanisms, each suited to different architectural needs. Instance store volumes are physically attached NVMe or SSD storage offering the highest possible throughput and IOPS, but data is lost when the instance stops, terminates, or encounters a hardware failure — use them only for ephemeral scratch data, temporary caches, or data that can be reconstructed from durable storage. Amazon EBS provides durable, network-attached block storage that persists beyond the instance lifecycle and can be snapshotted to S3 for backup or cross-region replication. EBS volume types matter: \`gp3\` is the default general-purpose SSD with independently configurable IOPS and throughput, \`io2 Block Express\` delivers sub-millisecond latency for the most demanding databases, \`st1\` provides cost-effective sequential throughput for log processing and streaming, and \`sc1\` offers the lowest cost for infrequently accessed sequential data. Amazon EFS allows multiple EC2 instances across different AZs to share a common POSIX file system, which is essential for shared content repositories, home directories, and CMS workloads.`,
      quiz: [
        {
          question:
            "An EC2 instance uses instance store volumes for a high-throughput cache. What happens to the data when the instance is stopped and started?",
          options: [
            "Data persists across stop/start cycles on instance store",
            "Data is automatically snapshotted to S3 before the instance stops",
            "Data is lost — instance store is ephemeral and does not survive stop or termination",
            "Data persists if the instance uses hibernate instead of stop",
          ],
          correctIndex: 2,
          explanation:
            "Instance store volumes are ephemeral — data is lost whenever the instance stops, terminates, or experiences a hardware failure. Instance store should only be used for temporary data that can be recreated or fetched from durable storage.",
        },
        {
          question:
            "Which EBS volume type allows IOPS and throughput to be configured independently, regardless of volume size?",
          options: [
            "gp2 — General Purpose SSD (legacy)",
            "gp3 — General Purpose SSD",
            "io1 — Provisioned IOPS SSD",
            "st1 — Throughput Optimized HDD",
          ],
          correctIndex: 1,
          explanation:
            "gp3 allows IOPS and throughput to be configured independently of volume size, unlike gp2 where IOPS scale with volume size. gp3 is the recommended default general-purpose SSD type.",
        },
      ],
    },
    {
      heading: "Networking, Security Groups, and IAM Integration",
      body: `EC2 instances launch within VPC subnets, and their network behavior is governed by Security Groups and Network ACLs. Security Groups are stateful virtual firewalls attached to the instance's elastic network interface (ENI); return traffic is automatically permitted, and rules are evaluated before traffic reaches the instance. Network ACLs are stateless subnet-level filters evaluated in numbered order — they are appropriate for broad subnet-level controls and blocking specific IP ranges. Elastic Network Interfaces can be moved between instances, enabling failover scenarios where an ENI carrying an Elastic IP is detached from a failed instance and reattached to a healthy one. IAM Instance Profiles attach an IAM role to an EC2 instance, allowing applications running on that instance to call AWS APIs using temporary credentials obtained from the Instance Metadata Service at \`169.254.169.254\` — this eliminates the need to embed long-lived credentials in code or configuration.`,
      quiz: [
        {
          question:
            "How do Security Groups differ from Network ACLs in terms of statefulness?",
          options: [
            "Both Security Groups and NACLs are stateful",
            "Security Groups are stateful (return traffic automatic); NACLs are stateless (both directions required)",
            "Security Groups are stateless; NACLs are stateful",
            "Both are stateless — all traffic requires explicit allow rules in both directions",
          ],
          correctIndex: 1,
          explanation:
            "Security Groups are stateful — return traffic for an allowed inbound connection is automatically permitted. NACLs are stateless — both inbound and outbound rules must explicitly allow traffic, including ephemeral return ports.",
        },
        {
          question:
            "What is the correct way to grant an EC2 application access to AWS services like S3 without embedding credentials?",
          options: [
            "Store access keys in environment variables on the EC2 instance",
            "Embed access keys in the application's configuration file",
            "Attach an IAM Instance Profile (IAM role) to the EC2 instance",
            "Use AWS Secrets Manager to retrieve hardcoded access keys at startup",
          ],
          correctIndex: 2,
          explanation:
            "IAM Instance Profiles attach an IAM role to an EC2 instance. Applications retrieve temporary, auto-rotating credentials from the Instance Metadata Service (169.254.169.254) without any hardcoded keys.",
        },
      ],
    },
    {
      heading: "AMIs and Launch Templates",
      body: `Amazon Machine Images (AMIs) are the blueprints for EC2 instances, encoding the operating system, pre-installed software, and configuration. Creating a custom AMI from a configured instance (a "golden AMI") enables fast, consistent instance launches in Auto Scaling scenarios because all dependencies are baked in rather than installed at boot. AMIs are regional resources but can be copied across regions for disaster recovery. Launch Templates supersede the older Launch Configurations and support versioning, Mixed Instance Policies (combining multiple instance types in an Auto Scaling Group), and Spot + On-Demand combinations in a single template. For the SAA-C03 exam, Launch Templates are the modern, recommended mechanism for defining how Auto Scaling Groups launch instances, and they unlock capabilities like Spot Fleet and EC2 Fleet.`,
      quiz: [
        {
          question:
            "Why is a golden AMI preferred over user data scripts for installing dependencies on Auto Scaling instances?",
          options: [
            "User data scripts are not supported in Auto Scaling Groups",
            "Golden AMIs have all dependencies pre-baked, enabling faster and more consistent instance launches without waiting for package installation",
            "User data scripts run after the instance is healthy, causing health check failures",
            "Golden AMIs are cheaper to launch than instances with user data scripts",
          ],
          correctIndex: 1,
          explanation:
            "Golden AMIs pre-install all dependencies so instances launch quickly and consistently without installing packages at boot time. This reduces scale-out latency and eliminates the risk of installation failures or version drift.",
        },
        {
          question:
            "Which EC2 feature is required to configure an Auto Scaling Group with a mix of Spot and On-Demand instances?",
          options: [
            "Launch Configurations with a Spot price override",
            "Launch Templates with a Mixed Instance Policy",
            "A separate ASG for Spot instances alongside an On-Demand ASG",
            "EC2 Fleet with manual instance management",
          ],
          correctIndex: 1,
          explanation:
            "Launch Templates (not the older Launch Configurations) are required for Mixed Instance Policies in Auto Scaling Groups. They support combining multiple instance types with a mix of Spot and On-Demand purchasing, unlocking significant cost optimization.",
        },
      ],
    },
  ],

  keyFacts: [
    "Instance families: General Purpose (M/T), Compute Optimized (C), Memory Optimized (R/X), Storage Optimized (I/D)",
    "On-Demand: no commitment; Reserved: up to 72% savings with 1/3-yr term; Spot: up to 90% with interruption risk",
    "Cluster placement groups minimize latency; Spread groups maximize fault isolation (max 7 per AZ)",
    "Instance store is ephemeral — data lost on stop/terminate; EBS is persistent and snapshottable",
    "gp3 is the default SSD type; io2 Block Express for highest IOPS databases",
    "Security Groups are stateful (return traffic automatic); Network ACLs are stateless (both directions required)",
    "IAM Instance Profiles provide temporary credentials via the Instance Metadata Service",
    "Golden AMIs pre-bake dependencies for fast, consistent Auto Scaling launches",
    "Launch Templates support versioning and mixed Spot/On-Demand policies in Auto Scaling Groups",
    "Elastic IPs are static public IPs that survive instance stop/start",
  ],

  relatedServices: [
    "Amazon VPC",
    "Amazon EBS",
    "Elastic Load Balancing",
    "AWS Auto Scaling",
    "Amazon CloudWatch",
    "AWS IAM",
  ],

  examTips: [
    "Match the workload to the instance family — CPU-bound → C family, memory-bound → R/X family",
    "Spot Instances require fault-tolerant, stateless, or checkpoint-capable workloads",
    "Cluster placement groups trade fault isolation for low latency — only use for tightly coupled HPC",
    "Instance store data is lost on any stop or termination — never use for durable data",
    "gp3 lets you set IOPS and throughput independently, unlike gp2 which ties them to volume size",
    "Security Groups allow only; NACLs allow and deny — use NACLs for blocking specific CIDRs",
    "IAM Instance Profile = the only correct way to give EC2 apps AWS API access without hardcoded keys",
    "Launch Templates (not Launch Configurations) are required for mixed Spot/On-Demand ASGs",
  ],

  topicQuiz: [
    {
      question:
        "A company runs a NoSQL database requiring consistently high random IOPS with sub-millisecond latency. Which EBS volume type is most appropriate?",
      options: [
        "gp3 — General Purpose SSD",
        "st1 — Throughput Optimized HDD",
        "io2 Block Express — Provisioned IOPS SSD for highest IOPS and lowest latency",
        "sc1 — Cold HDD",
      ],
      correctIndex: 2,
      explanation:
        "io2 Block Express delivers sub-millisecond latency and the highest IOPS for demanding databases. gp3 is a good general-purpose option but io2 Block Express is designed for the most demanding database workloads.",
    },
    {
      question:
        "Which EC2 purchasing model is appropriate for a stateless batch processing job that can handle interruption?",
      options: [
        "On-Demand — no interruption risk",
        "Spot Instances — up to 90% savings for fault-tolerant, interruptible workloads",
        "Reserved Instances — predictable cost",
        "Dedicated Hosts — physical isolation",
      ],
      correctIndex: 1,
      explanation:
        "Spot Instances offer up to 90% savings and are ideal for stateless, fault-tolerant workloads that can checkpoint and resume. AWS provides a 2-minute warning before reclaiming Spot capacity.",
    },
    {
      question:
        "An application requires that no two instances share the same physical rack to maximize fault isolation. Which placement group type enforces this?",
      options: [
        "Cluster placement group",
        "Partition placement group — each partition has its own rack",
        "Spread placement group — each instance on distinct hardware",
        "Default placement — AWS handles distribution automatically",
      ],
      correctIndex: 2,
      explanation:
        "Spread placement groups place each instance on distinct underlying hardware (separate racks), ensuring hardware failures affect at most one instance. Partition placement groups use separate racks per partition but can have multiple instances per partition.",
    },
    {
      question:
        "A team needs to give their EC2 application permission to read from an S3 bucket. What is the recommended approach?",
      options: [
        "Create an IAM user, generate access keys, and store them in the application configuration",
        "Store the root account access keys in an environment variable",
        "Attach an IAM Instance Profile with an IAM role that grants s3:GetObject permission",
        "Use an S3 bucket policy that allows all EC2 instances in the region",
      ],
      correctIndex: 2,
      explanation:
        "IAM Instance Profiles attach IAM roles to EC2 instances. Applications retrieve temporary, auto-rotating credentials from the Instance Metadata Service without hardcoded keys. This is the AWS-recommended approach and avoids long-lived credential exposure.",
    },
    {
      question:
        "EC2 basic monitoring publishes metrics to CloudWatch at what interval?",
      options: [
        "Every 10 seconds",
        "Every 1 minute",
        "Every 5 minutes",
        "Every 15 minutes",
      ],
      correctIndex: 2,
      explanation:
        "EC2 basic monitoring (the default) publishes metrics every 5 minutes. Detailed monitoring must be explicitly enabled to get 1-minute granularity, which is required for more responsive Auto Scaling policies.",
    },
    {
      question:
        "A new EC2 instance type is needed for an Auto Scaling Group that currently uses Launch Configurations. Which feature must the ASG migrate to in order to support Mixed Instance Policies?",
      options: [
        "EC2 Fleet with mixed configuration",
        "Launch Templates with a Mixed Instance Policy",
        "A second Auto Scaling Group for the new instance type",
        "Spot Fleet with On-Demand allocation strategy",
      ],
      correctIndex: 1,
      explanation:
        "Launch Templates (not Launch Configurations) are required for Mixed Instance Policies that combine multiple instance types with Spot and On-Demand purchasing in a single ASG. Launch Configurations are legacy and do not support this feature.",
    },
    {
      question:
        "Which EC2 instance family is designed for large-scale distributed data processing systems like HDFS and Cassandra that need a balance of storage and compute across many nodes?",
      options: [
        "M family — General Purpose",
        "C family — Compute Optimized",
        "R family — Memory Optimized",
        "I or D family — Storage Optimized",
      ],
      correctIndex: 3,
      explanation:
        "Storage-optimized I and D families provide high sequential I/O throughput and large local storage, making them well-suited for distributed data stores like HDFS, HBase, and Cassandra that require fast local disk access across many nodes.",
    },
    {
      question:
        "A Security Group rule allows inbound TCP port 443. A user connects via HTTPS. Do you need to add an explicit outbound rule to allow the response traffic?",
      options: [
        "Yes — both inbound and outbound rules must be explicitly configured",
        "No — Security Groups are stateful; return traffic is automatically allowed",
        "Yes — response traffic uses ephemeral ports that must be explicitly allowed",
        "Only if the destination is a different AZ",
      ],
      correctIndex: 1,
      explanation:
        "Security Groups are stateful. When you allow inbound traffic, the corresponding outbound response traffic is automatically permitted without an explicit outbound rule. This contrasts with NACLs, which are stateless and require explicit rules in both directions.",
    },
  ],
};
