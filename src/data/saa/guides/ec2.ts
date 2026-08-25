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
    },
    {
      heading: "Purchasing Models and Cost Optimization",
      body: `AWS offers multiple purchasing models, and architects layer them to minimize cost while meeting availability requirements. On-Demand instances provide maximum flexibility at full price — appropriate for short-lived, unpredictable, or stateful workloads where interruption is unacceptable. Reserved Instances (Standard or Convertible) commit to one or three years and save up to 72%; they suit predictable baselines. Savings Plans extend similar discounts across Lambda and Fargate in addition to EC2 without locking you to a specific instance type. Spot Instances offer up to 90% savings by utilizing spare capacity, but AWS may reclaim them with a two-minute warning, making them ideal for stateless web tiers, big data processing, and batch jobs designed to checkpoint and resume. A well-architected cost strategy typically combines Reserved or Savings Plans capacity for the baseline with Spot or On-Demand for burst, and Dedicated Hosts only where licensing or compliance mandates physical isolation.`,
    },
    {
      heading: "Placement Groups and High Availability",
      body: `EC2 placement groups control how instances are distributed across underlying hardware to meet latency or fault-tolerance requirements. A **Cluster placement group** packs instances close together within a single Availability Zone, providing the lowest network latency and highest throughput for tightly coupled HPC workloads — at the cost of exposing all instances to the same physical failure domain. A **Spread placement group** places each instance on distinct underlying hardware, capping the blast radius of hardware failures; it supports up to seven running instances per AZ per group, making it ideal for small critical workloads like a primary database and its read replicas. A **Partition placement group** divides instances into logical partitions, each backed by its own rack, supporting hundreds of instances for large distributed systems like HDFS, HBase, and Cassandra. Spreading instances across multiple Availability Zones using Auto Scaling Groups remains the primary strategy for general high availability.`,
    },
    {
      heading: "Storage Architecture for EC2",
      body: `EC2 instances access storage through several mechanisms, each suited to different architectural needs. Instance store volumes are physically attached NVMe or SSD storage offering the highest possible throughput and IOPS, but data is lost when the instance stops, terminates, or encounters a hardware failure — use them only for ephemeral scratch data, temporary caches, or data that can be reconstructed from durable storage. Amazon EBS provides durable, network-attached block storage that persists beyond the instance lifecycle and can be snapshotted to S3 for backup or cross-region replication. EBS volume types matter: \`gp3\` is the default general-purpose SSD with independently configurable IOPS and throughput, \`io2 Block Express\` delivers sub-millisecond latency for the most demanding databases, \`st1\` provides cost-effective sequential throughput for log processing and streaming, and \`sc1\` offers the lowest cost for infrequently accessed sequential data. Amazon EFS allows multiple EC2 instances across different AZs to share a common POSIX file system, which is essential for shared content repositories, home directories, and CMS workloads.`,
    },
    {
      heading: "Networking, Security Groups, and IAM Integration",
      body: `EC2 instances launch within VPC subnets, and their network behavior is governed by Security Groups and Network ACLs. Security Groups are stateful virtual firewalls attached to the instance's elastic network interface (ENI); return traffic is automatically permitted, and rules are evaluated before traffic reaches the instance. Network ACLs are stateless subnet-level filters evaluated in numbered order — they are appropriate for broad subnet-level controls and blocking specific IP ranges. Elastic Network Interfaces can be moved between instances, enabling failover scenarios where an ENI carrying an Elastic IP is detached from a failed instance and reattached to a healthy one. IAM Instance Profiles attach an IAM role to an EC2 instance, allowing applications running on that instance to call AWS APIs using temporary credentials obtained from the Instance Metadata Service at \`169.254.169.254\` — this eliminates the need to embed long-lived credentials in code or configuration.`,
    },
    {
      heading: "AMIs and Launch Templates",
      body: `Amazon Machine Images (AMIs) are the blueprints for EC2 instances, encoding the operating system, pre-installed software, and configuration. Creating a custom AMI from a configured instance (a "golden AMI") enables fast, consistent instance launches in Auto Scaling scenarios because all dependencies are baked in rather than installed at boot. AMIs are regional resources but can be copied across regions for disaster recovery. Launch Templates supersede the older Launch Configurations and support versioning, Mixed Instance Policies (combining multiple instance types in an Auto Scaling Group), and Spot + On-Demand combinations in a single template. For the SAA-C03 exam, Launch Templates are the modern, recommended mechanism for defining how Auto Scaling Groups launch instances, and they unlock capabilities like Spot Fleet and EC2 Fleet.`,
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
};
