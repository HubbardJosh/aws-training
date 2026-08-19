import { ServiceGuide } from "../../../types/guide";

export const ec2Guide: ServiceGuide = {
  id: "clf-ec2",
  service: "Amazon EC2",
  domain: "deployment",
  tagline: "Resizable virtual servers in the cloud",
  intro:
    "Amazon Elastic Compute Cloud (EC2) provides scalable virtual servers — called instances — in the AWS cloud, letting you run applications without upfront hardware investment.",

  sections: [
    {
      heading: "What Is EC2?",
      body: `Amazon EC2 is the foundation of AWS compute. It provides **virtual machines** (called instances) that you can launch within minutes, configure as you need, and terminate when done. Instead of purchasing physical servers, you rent compute capacity by the hour or second, paying only for what you use.

Each EC2 instance runs on physical hardware inside an AWS data center, but you interact with it as if it were your own dedicated machine. You choose the **operating system** (Amazon Linux, Ubuntu, Windows Server, and many others), install your software, and control network access through security groups and VPC settings.`,
    },
    {
      heading: "Instance Types and Families",
      body: `EC2 offers a wide variety of instance types organized into **families** based on their intended workload. The naming convention encodes useful information: for example, \`m5.large\` means the M (general-purpose) family, fifth generation, large size.

**General Purpose** (M and T families) balance compute, memory, and networking — ideal for web servers, small databases, and development environments. The T family uses **burstable performance**, accumulating CPU credits during idle periods and spending them during spikes.

**Compute Optimized** (C family) offer a higher ratio of CPU to memory, suited for batch processing, high-traffic web servers, and scientific modeling. **Memory Optimized** (R, X families) provide large amounts of RAM for in-memory databases and real-time analytics. **Storage Optimized** (I, D families) deliver high sequential read/write throughput for NoSQL databases and data warehouses.

For the Cloud Practitioner exam, the key concept is that you pick an instance type to match your workload rather than over-provisioning an expensive type for a simple task.`,
    },
    {
      heading: "Purchasing Options",
      body: `AWS offers several ways to pay for EC2, and choosing the right model dramatically affects cost.

**On-Demand** instances have no upfront cost and no long-term commitment. You pay per second (or hour) of running time. This is the default and most flexible option, best for unpredictable or short-lived workloads.

**Reserved Instances** (RIs) commit you to one or three years in exchange for discounts of up to 72% compared to On-Demand. You choose a specific instance type and region. Standard RIs are cheapest but inflexible; Convertible RIs allow you to change the instance family if your needs evolve.

**Savings Plans** are a flexible alternative to RIs. You commit to a minimum amount of compute spend per hour (e.g., $10/hr) for one or three years, and AWS applies discounts automatically across multiple services including Lambda and Fargate.

**Spot Instances** let you bid for spare EC2 capacity at discounts up to 90%. AWS can reclaim Spot instances with a two-minute warning, making them ideal for fault-tolerant batch jobs, big data processing, or stateless web tiers that can handle interruption.

**Dedicated Hosts** provide a physical server entirely for your use, which is required for software licenses tied to physical cores or sockets, or for compliance requirements that prohibit shared hardware.`,
    },
    {
      heading: "Storage Options",
      body: `Every EC2 instance needs storage for its operating system and data. The two main categories are **instance store** and **Amazon EBS**.

Instance store is physically attached to the host hardware, delivering very high throughput and low latency. However, instance store data is **ephemeral** — it disappears when the instance stops or terminates. Use instance store only for temporary data like caches or scratch space.

**Amazon Elastic Block Store (EBS)** provides network-attached, persistent block storage. EBS volumes survive instance stops and terminations (unless you configure them to delete on termination). You can take **EBS snapshots** to back up a volume to S3 at any point. EBS volumes come in types including \`gp3\` (general-purpose SSD), \`io2\` (high-performance SSD for databases), and \`st1\` (throughput-optimized HDD for streaming workloads).

For the exam, remember that EBS persists independently of the instance lifecycle, while instance store does not.`,
    },
    {
      heading: "Security and Networking",
      body: `EC2 instances launch inside a **VPC** (Virtual Private Cloud) and communicate over the network according to rules you define. **Security Groups** act as virtual firewalls at the instance level, controlling inbound and outbound traffic by port, protocol, and source IP. Security groups are stateful — if you allow inbound traffic on a port, the return traffic is automatically allowed.

Access to a Linux instance is typically via **SSH** using a **key pair**: AWS stores the public key and you keep the private key file (\`.pem\`). Windows instances use **RDP** and a password you decrypt with your private key.

EC2 instances can be assigned an **IAM Instance Profile**, which grants the instance an IAM role. This is the secure way to give your application running on EC2 access to other AWS services (like reading from S3 or writing to DynamoDB) without embedding credentials in code.

**Elastic IP addresses** are static public IP addresses you can associate with an instance. Normally, public IPs change if you stop and restart an instance, so Elastic IPs are useful when you need a fixed address.`,
    },
    {
      heading: "Auto Scaling and High Availability",
      body: `Running a single EC2 instance creates a single point of failure. AWS provides **Auto Scaling Groups** (ASGs) to automatically add or remove instances based on demand or health checks. You define a minimum, desired, and maximum number of instances, and the ASG maintains that target automatically.

Combined with an **Elastic Load Balancer** (ELB), which distributes incoming traffic across multiple instances, Auto Scaling creates a resilient and scalable architecture. When an instance becomes unhealthy, the load balancer stops sending traffic to it and the ASG replaces it.

For high availability, you spread instances across multiple **Availability Zones** within a region. Each AZ is a separate physical data center with independent power, cooling, and networking, so a failure in one AZ does not affect instances in another.`,
    },
  ],

  keyFacts: [
    "EC2 provides resizable virtual machines called instances",
    "Instance types are grouped into families: general purpose, compute optimized, memory optimized, storage optimized",
    "On-Demand: pay per second, no commitment; best for unpredictable workloads",
    "Reserved Instances save up to 72% with 1- or 3-year commitments",
    "Spot Instances save up to 90% but can be interrupted with 2-minute notice",
    "EBS provides persistent block storage; instance store is ephemeral",
    "Security Groups are stateful virtual firewalls at the instance level",
    "Auto Scaling Groups automatically add/remove instances based on demand",
    "Key pairs are used for SSH access to Linux instances",
    "IAM Instance Profiles let instances call AWS services without embedded credentials",
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
    "On-Demand = flexible, highest cost; Reserved = committed, 72% savings; Spot = interruptible, 90% savings",
    "Instance store is lost on stop/terminate; EBS persists independently",
    "Security groups are stateful (return traffic automatic); NACLs are stateless",
    "Spread instances across Availability Zones for high availability",
    "T-family instances use burstable CPU credits — good for variable workloads",
    "Dedicated Hosts are used for compliance or license requirements tied to physical hardware",
    "IAM Instance Profiles are the correct way to grant an EC2 app access to AWS services",
    "Auto Scaling + ELB together provide scalability and high availability",
  ],
};
