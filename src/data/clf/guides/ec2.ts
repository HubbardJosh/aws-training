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
      quiz: [
        {
          question: "What is an Amazon EC2 instance?",
          options: [
            "A managed database service hosted by AWS",
            "A serverless function that runs code in response to events",
            "A dedicated container orchestration cluster",
            "A virtual machine that runs on physical AWS hardware",
          ],
          correctIndex: 3,
          explanation:
            "An EC2 instance is a virtual machine (VM) running on physical hardware in an AWS data center. You choose the OS, install software, and control network access — treating it like your own dedicated machine, but paying only for the time you use it.",
        },
        {
          question:
            "What is the primary advantage of using EC2 over purchasing physical servers?",
          options: [
            "EC2 is free for all workloads under 1 TB of storage",
            "EC2 instances always run faster than physical servers",
            "EC2 instances never require patching or maintenance",
            "You can launch instances in minutes and pay only for what you use, with no upfront hardware cost",
          ],
          correctIndex: 3,
          explanation:
            "EC2 eliminates upfront hardware investment — you launch instances in minutes and pay by the hour or second. This lets you scale up quickly and avoid over-provisioning by terminating instances you no longer need.",
        },
      ],
    },
    {
      heading: "Instance Types and Families",
      body: `EC2 offers a wide variety of instance types organized into **families** based on their intended workload. The naming convention encodes useful information: for example, \`m5.large\` means the M (general-purpose) family, fifth generation, large size.

**General Purpose** (M and T families) balance compute, memory, and networking — ideal for web servers, small databases, and development environments. The T family uses **burstable performance**, accumulating CPU credits during idle periods and spending them during spikes.

**Compute Optimized** (C family) offer a higher ratio of CPU to memory, suited for batch processing, high-traffic web servers, and scientific modeling. **Memory Optimized** (R, X families) provide large amounts of RAM for in-memory databases and real-time analytics. **Storage Optimized** (I, D families) deliver high sequential read/write throughput for NoSQL databases and data warehouses.

For the Cloud Practitioner exam, the key concept is that you pick an instance type to match your workload rather than over-provisioning an expensive type for a simple task.`,
      quiz: [
        {
          question:
            "Which EC2 instance family is best suited for a memory-intensive workload like an in-memory database?",
          options: [
            "T family (burstable general purpose)",
            "C family (compute optimized)",
            "I family (storage optimized)",
            "R or X family (memory optimized)",
          ],
          correctIndex: 3,
          explanation:
            "The R and X families are Memory Optimized instances that provide large amounts of RAM. They are suited for in-memory databases, real-time big data analytics, and other memory-intensive workloads.",
        },
        {
          question:
            "What is the burstable performance characteristic of T-family EC2 instances?",
          options: [
            "They automatically switch to a faster instance type during traffic spikes",
            "They accumulate CPU credits during idle periods and spend them during CPU spikes",
            "They burst to unlimited network bandwidth during peak hours",
            "They temporarily increase memory capacity when running low",
          ],
          correctIndex: 1,
          explanation:
            "T-family instances use a CPU credit model. Credits accumulate when CPU usage is below the baseline and are spent when CPU usage spikes above it. This makes T instances cost-effective for workloads with variable CPU usage.",
        },
        {
          question:
            "In the instance name 'm5.large', what does each part represent?",
          options: [
            "m = managed service, 5 = version 5, large = capacity tier",
            "m = memory type, 5 = number of cores, large = storage size",
            "m = multi-AZ capable, 5 = five 9s availability, large = high availability",
            "m = general-purpose family, 5 = fifth generation, large = instance size",
          ],
          correctIndex: 3,
          explanation:
            "The naming convention encodes: m = general-purpose family (M family), 5 = fifth generation of that family, large = the size tier within the family. This pattern applies across all EC2 instance types.",
        },
      ],
    },
    {
      heading: "Purchasing Options",
      body: `AWS offers several ways to pay for EC2, and choosing the right model dramatically affects cost.

**On-Demand** instances have no upfront cost and no long-term commitment. You pay per second (or hour) of running time. This is the default and most flexible option, best for unpredictable or short-lived workloads.

**Reserved Instances** (RIs) commit you to one or three years in exchange for discounts of up to 72% compared to On-Demand. You choose a specific instance type and region. Standard RIs are cheapest but inflexible; Convertible RIs allow you to change the instance family if your needs evolve.

**Savings Plans** are a flexible alternative to RIs. You commit to a minimum amount of compute spend per hour (e.g., $10/hr) for one or three years, and AWS applies discounts automatically across multiple services including Lambda and Fargate.

**Spot Instances** let you bid for spare EC2 capacity at discounts up to 90%. AWS can reclaim Spot instances with a two-minute warning, making them ideal for fault-tolerant batch jobs, big data processing, or stateless web tiers that can handle interruption.

**Dedicated Hosts** provide a physical server entirely for your use, which is required for software licenses tied to physical cores or sockets, or for compliance requirements that prohibit shared hardware.`,
      quiz: [
        {
          question:
            "Which EC2 purchasing option offers discounts up to 90% but can be interrupted by AWS with a two-minute warning?",
          options: [
            "Savings Plans",
            "Reserved Instances",
            "Dedicated Hosts",
            "Spot Instances",
          ],
          correctIndex: 3,
          explanation:
            "Spot Instances offer discounts up to 90% by using spare EC2 capacity, but AWS can reclaim them with a two-minute warning. They are ideal for fault-tolerant, interruptible workloads like batch processing, big data, and CI/CD jobs.",
        },
        {
          question:
            "A company runs a steady, predictable web application workload and wants to reduce EC2 costs by up to 72%. Which purchasing option is most appropriate?",
          options: [
            "Spot Instances",
            "Reserved Instances with a 1- or 3-year commitment",
            "Dedicated Hosts",
            "On-Demand Instances",
          ],
          correctIndex: 1,
          explanation:
            "Reserved Instances offer discounts up to 72% compared to On-Demand pricing in exchange for a 1- or 3-year commitment. They are ideal for steady, predictable workloads where you can forecast your capacity needs.",
        },
        {
          question:
            "When would you choose a Dedicated Host over other EC2 purchasing options?",
          options: [
            "When software licenses are tied to physical cores/sockets, or compliance requires dedicated hardware",
            "When you need instances that span multiple Availability Zones",
            "When you need the lowest possible cost for batch processing",
            "When you need instances that scale automatically with traffic",
          ],
          correctIndex: 0,
          explanation:
            "Dedicated Hosts provide a physical server entirely for your use. They are required when software licenses are tied to physical cores or sockets (like some Oracle or Windows licenses), or when compliance regulations prohibit sharing hardware with other AWS customers.",
        },
      ],
    },
    {
      heading: "Storage Options",
      body: `Every EC2 instance needs storage for its operating system and data. The two main categories are **instance store** and **Amazon EBS**.

Instance store is physically attached to the host hardware, delivering very high throughput and low latency. However, instance store data is **ephemeral** — it disappears when the instance stops or terminates. Use instance store only for temporary data like caches or scratch space.

**Amazon Elastic Block Store (EBS)** provides network-attached, persistent block storage. EBS volumes survive instance stops and terminations (unless you configure them to delete on termination). You can take **EBS snapshots** to back up a volume to S3 at any point. EBS volumes come in types including \`gp3\` (general-purpose SSD), \`io2\` (high-performance SSD for databases), and \`st1\` (throughput-optimized HDD for streaming workloads).

For the exam, remember that EBS persists independently of the instance lifecycle, while instance store does not.`,
      quiz: [
        {
          question:
            "What happens to data stored on an EC2 instance store when the instance is stopped or terminated?",
          options: [
            "The data is lost — instance store is ephemeral storage",
            "The data is moved to an EBS volume automatically",
            "The data is automatically backed up to Amazon S3",
            "The data persists and is available when the instance restarts",
          ],
          correctIndex: 0,
          explanation:
            "Instance store is ephemeral — data is lost when the instance stops or terminates. Instance store is physically attached to the host hardware and provides very high performance, but should only be used for temporary data like caches or scratch files.",
        },
        {
          question:
            "Which EC2 storage type provides persistent block storage that survives instance stops and terminations?",
          options: [
            "Instance store",
            "Amazon EBS (Elastic Block Store)",
            "Amazon S3",
            "Amazon EFS",
          ],
          correctIndex: 1,
          explanation:
            "Amazon EBS provides network-attached, persistent block storage. EBS volumes survive instance stops and terminations and can be detached from one instance and attached to another. EBS snapshots back up volumes to S3.",
        },
      ],
    },
    {
      heading: "Security and Networking",
      body: `EC2 instances launch inside a **VPC** (Virtual Private Cloud) and communicate over the network according to rules you define. **Security Groups** act as virtual firewalls at the instance level, controlling inbound and outbound traffic by port, protocol, and source IP. Security groups are stateful — if you allow inbound traffic on a port, the return traffic is automatically allowed.

Access to a Linux instance is typically via **SSH** using a **key pair**: AWS stores the public key and you keep the private key file (\`.pem\`). Windows instances use **RDP** and a password you decrypt with your private key.

EC2 instances can be assigned an **IAM Instance Profile**, which grants the instance an IAM role. This is the secure way to give your application running on EC2 access to other AWS services (like reading from S3 or writing to DynamoDB) without embedding credentials in code.

**Elastic IP addresses** are static public IP addresses you can associate with an instance. Normally, public IPs change if you stop and restart an instance, so Elastic IPs are useful when you need a fixed address.`,
      quiz: [
        {
          question:
            "What is the correct way to grant an EC2 application access to other AWS services like S3 or DynamoDB?",
          options: [
            "Enable public access on S3 buckets so the EC2 instance can access them without credentials",
            "Store access keys in the application's configuration file on the instance",
            "Assign an IAM Instance Profile (with an IAM role) to the EC2 instance",
            "Create a dedicated IAM user and share the credentials via environment variables",
          ],
          correctIndex: 2,
          explanation:
            "IAM Instance Profiles grant an IAM role to the EC2 instance, allowing the application to call AWS services using automatically rotated temporary credentials. This is the secure approach — embedding long-term access keys in code or config files is a security risk.",
        },
        {
          question:
            "Security Groups in AWS are described as 'stateful'. What does this mean?",
          options: [
            "Security group rules are saved and cannot be changed after creation",
            "Security groups maintain a log of all traffic that passes through them",
            "Security groups apply the same rules to all instances in the same VPC",
            "If an inbound rule allows traffic, the return traffic is automatically allowed without an explicit outbound rule",
          ],
          correctIndex: 3,
          explanation:
            "Stateful means that return traffic is automatically allowed. If you allow inbound HTTP traffic on port 80, the response traffic back to the client is automatically permitted, even without an explicit outbound rule. This differs from NACLs, which are stateless.",
        },
        {
          question:
            "Why would you assign an Elastic IP address to an EC2 instance?",
          options: [
            "To enable the instance to communicate with other instances in the same VPC",
            "To allow the instance to access the internet without a NAT Gateway",
            "To improve network performance by bypassing the standard AWS network",
            "To provide a static public IP address that does not change when the instance is stopped and restarted",
          ],
          correctIndex: 3,
          explanation:
            "When an EC2 instance is stopped and restarted, its public IP address changes. An Elastic IP is a static public IP that remains associated with your account until you release it, ensuring your instance is always reachable at the same address.",
        },
      ],
    },
    {
      heading: "Auto Scaling and High Availability",
      body: `Running a single EC2 instance creates a single point of failure. AWS provides **Auto Scaling Groups** (ASGs) to automatically add or remove instances based on demand or health checks. You define a minimum, desired, and maximum number of instances, and the ASG maintains that target automatically.

Combined with an **Elastic Load Balancer** (ELB), which distributes incoming traffic across multiple instances, Auto Scaling creates a resilient and scalable architecture. When an instance becomes unhealthy, the load balancer stops sending traffic to it and the ASG replaces it.

For high availability, you spread instances across multiple **Availability Zones** within a region. Each AZ is a separate physical data center with independent power, cooling, and networking, so a failure in one AZ does not affect instances in another.`,
      quiz: [
        {
          question:
            "What combination of AWS services provides both automatic scaling and high availability for EC2 workloads?",
          options: [
            "IAM roles and Security Groups",
            "CloudFormation and AWS Config",
            "Auto Scaling Groups and Elastic Load Balancer",
            "CloudWatch and AWS CloudTrail",
          ],
          correctIndex: 2,
          explanation:
            "Auto Scaling Groups (ASGs) automatically add or remove instances based on demand, while an Elastic Load Balancer distributes traffic across healthy instances. Together they provide both scalability and high availability.",
        },
        {
          question:
            "Why should production EC2 instances be spread across multiple Availability Zones?",
          options: [
            "A failure in one AZ does not affect instances in other AZs, ensuring the application remains available",
            "Spreading across AZs reduces EC2 pricing through volume discounts",
            "Multiple AZs are required to use Elastic Load Balancers",
            "Multiple AZs provide faster network speeds between instances",
          ],
          correctIndex: 0,
          explanation:
            "Each Availability Zone is a separate physical data center with independent power, cooling, and networking. Spreading instances across AZs means a failure (power outage, hardware failure) in one AZ does not take down the entire application.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A company has a batch processing workload that runs overnight and can tolerate interruptions. Which EC2 purchasing option minimizes cost?",
      options: [
        "On-Demand Instances",
        "Reserved Instances",
        "Spot Instances",
        "Dedicated Hosts",
      ],
      correctIndex: 2,
      explanation:
        "Spot Instances offer discounts up to 90% over On-Demand pricing. Since the batch workload can tolerate interruptions (it can retry or checkpoint progress), Spot Instances are the most cost-effective choice.",
    },
    {
      question:
        "What is the key difference between Amazon EBS and EC2 instance store?",
      options: [
        "EBS requires a Dedicated Host; instance store works with all instance types",
        "EBS is faster; instance store is slower but cheaper",
        "EBS is only available for Linux instances; instance store works with all OS types",
        "EBS is persistent and survives instance stops; instance store is ephemeral and lost on stop/terminate",
      ],
      correctIndex: 3,
      explanation:
        "EBS (Elastic Block Store) is persistent network-attached storage that survives instance stops and terminations. Instance store is physically attached ephemeral storage that is lost when the instance stops or terminates.",
    },
    {
      question:
        "An application running on EC2 needs to read objects from an S3 bucket. What is the most secure way to grant this access?",
      options: [
        "Assign an IAM Instance Profile with an appropriate S3 read role to the EC2 instance",
        "Store AWS access keys in the application's source code",
        "Make the S3 bucket public so the EC2 instance can access it without credentials",
        "Create an IAM user and hardcode the credentials in the EC2 instance's environment variables",
      ],
      correctIndex: 0,
      explanation:
        "IAM Instance Profiles attach an IAM role to an EC2 instance, providing automatically rotated temporary credentials. The application retrieves credentials from the instance metadata endpoint — no hardcoded keys needed.",
    },
    {
      question:
        "Which EC2 instance family would you choose for a high-traffic video transcoding workload that is CPU-intensive?",
      options: [
        "C family (compute optimized)",
        "T family (burstable general purpose)",
        "I family (storage optimized)",
        "R family (memory optimized)",
      ],
      correctIndex: 0,
      explanation:
        "The C family (Compute Optimized) provides a higher ratio of CPU to memory and is designed for CPU-intensive workloads like video transcoding, batch processing, high-performance web servers, and scientific modeling.",
    },
    {
      question:
        "A web application currently runs on a single EC2 instance. A senior architect wants to eliminate the single point of failure. What is the recommended solution?",
      options: [
        "Switch to a larger instance type for better reliability",
        "Enable Multi-AZ on the EC2 instance",
        "Deploy an Auto Scaling Group with instances across multiple Availability Zones behind an Elastic Load Balancer",
        "Take daily EBS snapshots for backup",
      ],
      correctIndex: 2,
      explanation:
        "An Auto Scaling Group across multiple AZs with an Elastic Load Balancer eliminates single points of failure at both the instance level (ASG replaces unhealthy instances) and the AZ level (traffic shifts to healthy AZs if one fails).",
    },
    {
      question:
        "What does 'Reserved Instance' mean in the context of EC2 pricing?",
      options: [
        "The instance is reserved for disaster recovery and does not run by default",
        "AWS reserves the instance for your exclusive use so no other customer can use that hardware",
        "You reserve the right to launch instances in any region at any time",
        "You commit to a 1- or 3-year term in exchange for discounts up to 72% compared to On-Demand pricing",
      ],
      correctIndex: 3,
      explanation:
        "Reserved Instances are a billing commitment, not a reservation of physical hardware. You commit to using a specific instance type in a specific region for 1 or 3 years and receive discounts up to 72% compared to On-Demand pricing.",
    },
    {
      question:
        "Which protocol is used to connect to a Linux EC2 instance, and what is used to authenticate?",
      options: [
        "Telnet with an access key ID",
        "RDP with username and password",
        "SSH with a key pair (.pem file)",
        "HTTPS with IAM credentials",
      ],
      correctIndex: 2,
      explanation:
        "Linux EC2 instances use SSH for remote access. Authentication uses a key pair: AWS stores the public key and you keep the private key (.pem file). Windows instances use RDP with a password decrypted using the private key.",
    },
    {
      question:
        "What is the purpose of an Elastic Load Balancer in an Auto Scaling architecture?",
      options: [
        "To automatically scale EC2 instances based on CPU utilization",
        "To distribute incoming traffic across all healthy EC2 instances in the group",
        "To assign static public IP addresses to each instance in the group",
        "To back up EC2 instance configurations across Availability Zones",
      ],
      correctIndex: 1,
      explanation:
        "An Elastic Load Balancer distributes incoming traffic across all healthy EC2 instances in the Auto Scaling Group. It also performs health checks and stops routing traffic to unhealthy instances, with the ASG replacing them automatically.",
    },
  ],
};
