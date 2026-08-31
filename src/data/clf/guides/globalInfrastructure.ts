import { ServiceGuide } from "../../../types/guide";

export const globalInfrastructureGuide: ServiceGuide = {
  id: "clf-global-infrastructure",
  service: "AWS Global Infrastructure",
  domain: "troubleshooting",
  tagline: "The physical foundation of AWS — regions, AZs, and edge locations",
  intro:
    "AWS Global Infrastructure is the worldwide network of physical data centers, networking, and edge locations that powers all AWS services — understanding it helps you design highly available, low-latency, and compliant architectures.",

  sections: [
    {
      heading: "Regions",
      body: `An AWS **Region** is a geographic area that contains multiple, isolated data center clusters. As of 2025, AWS operates 36+ regions globally, with more announced. Each region has a name (like \`us-east-1\` for US East N. Virginia) and a friendly display name.

Regions are **completely independent** of each other. Services, data, and infrastructure in one region do not automatically replicate to another. If you deploy a resource in \`us-east-1\`, it exists only in that region unless you explicitly configure cross-region replication or deploy to other regions.

When choosing a region, consider four factors:
- **Compliance and data residency**: some regulations require data to remain in a specific country or jurisdiction
- **Latency**: choose the region closest to your users for the lowest latency
- **Service availability**: not all AWS services are available in all regions; newer regions may lack some services
- **Pricing**: the same service can have different prices in different regions

**Global services** like IAM, Route 53, and CloudFront are not region-specific — they operate globally and your configuration is available everywhere.`,
      quiz: [
        {
          question:
            "Which of the following is NOT one of the four factors to consider when choosing an AWS Region?",
          options: [
            "Latency to your end users",
            "Compliance and data residency requirements",
            "Pricing differences between regions",
            "Number of Availability Zones in the region",
          ],
          correctIndex: 3,
          explanation:
            "The four factors for region selection are: compliance/data residency, latency to users, service availability (not all services exist in all regions), and pricing. The number of AZs is not a primary selection factor — most regions have 3 or more AZs.",
        },
        {
          question:
            "Which of the following AWS services is a global service and not tied to a specific region?",
          options: ["Amazon S3", "AWS IAM", "Amazon EC2", "Amazon RDS"],
          correctIndex: 1,
          explanation:
            "AWS IAM is a global service — your users, groups, roles, and policies are available across all regions. Other global services include Route 53 and CloudFront. EC2, RDS, and S3 are regional services (though S3 bucket names are globally unique).",
        },
        {
          question:
            "If you deploy an EC2 instance in us-east-1, where does that instance exist?",
          options: [
            "It is automatically replicated to all AWS regions for redundancy",
            "Across all US-based regions for compliance with US data laws",
            "In us-east-1 and the nearest region for latency-based failover",
            "Only in us-east-1 — regions are independent and data does not replicate automatically",
          ],
          correctIndex: 3,
          explanation:
            "AWS Regions are completely independent. A resource deployed in us-east-1 exists only in that region. AWS does not automatically replicate data or infrastructure across regions — cross-region replication must be explicitly configured.",
        },
      ],
    },
    {
      heading: "Availability Zones",
      body: `Each AWS Region is divided into **Availability Zones (AZs)**. Most regions have 3 AZs; some have more. An AZ is one or more discrete data centers with redundant power, networking, and connectivity.

AZs within a region are **physically separated** from each other — typically tens of miles apart — but connected by high-bandwidth, low-latency private networking. This physical separation means a natural disaster, power outage, or facility failure affecting one AZ is unlikely to affect others.

AZ names in a region are designated by appending a letter to the region code: \`us-east-1a\`, \`us-east-1b\`, \`us-east-1c\`. Importantly, the name \`us-east-1a\` in your account may map to a different physical data center than \`us-east-1a\` in another account — AWS randomizes AZ letter assignments to distribute load evenly across AZs.

The fundamental design principle for high availability on AWS is to **spread resources across multiple AZs**. Running two EC2 instances in the same AZ still creates a single point of failure at the AZ level. Running one instance in each of two AZs means your application survives an AZ failure.`,
      quiz: [
        {
          question: "What is an AWS Availability Zone (AZ)?",
          options: [
            "One or more discrete data centers within a region with redundant power and networking",
            "A geographic region containing multiple independent data center clusters",
            "A logical grouping of AWS accounts within an organization",
            "A content delivery edge location for CloudFront",
          ],
          correctIndex: 0,
          explanation:
            "An Availability Zone is one or more discrete data centers within a region, each with redundant power, networking, and connectivity. AZs are physically separated from each other but connected by high-bandwidth, low-latency private networking.",
        },
        {
          question:
            "Why does AWS randomize the mapping of AZ letter names (e.g., us-east-1a) between AWS accounts?",
          options: [
            "To provide stronger security isolation between customer workloads",
            "To distribute customer load evenly across physical data centers",
            "To allow AZ names to change as new data centers are added",
            "To prevent customers from targeting the same physical hardware",
          ],
          correctIndex: 1,
          explanation:
            "AWS randomizes AZ letter assignments between accounts so that 'us-east-1a' in one account may point to a different physical data center than 'us-east-1a' in another account. This distributes customer load evenly across all physical AZs.",
        },
        {
          question:
            "A company runs two EC2 instances in the same Availability Zone. What single point of failure remains?",
          options: [
            "The AWS Region — a regional outage affects both instances",
            "Both instances share the same IAM role",
            "The Availability Zone itself — an AZ failure takes both instances offline",
            "The EC2 instance type — both instances use the same hardware family",
          ],
          correctIndex: 2,
          explanation:
            "Running two instances in the same AZ does not protect against AZ-level failures. If that AZ experiences a power outage, network failure, or natural disaster, both instances are affected. For true high availability, spread instances across multiple AZs.",
        },
      ],
    },
    {
      heading: "Edge Locations and Points of Presence",
      body: `AWS operates hundreds of **edge locations** and **regional edge caches** around the world, in far more cities than there are full AWS regions. Edge locations are used by **Amazon CloudFront** (CDN), **Amazon Route 53** (DNS), and **AWS Shield** (DDoS protection).

When a user in Tokyo requests content from a CloudFront distribution, that request is served from the nearest edge location in Tokyo rather than traveling to the AWS region (which might be in the US or EU). This dramatically reduces latency for content delivery.

**Regional Edge Caches** are larger cache nodes positioned between edge locations and origin servers. They store content that is not popular enough to remain in individual edge locations but is more popular than what is served directly from the origin.

**AWS Local Zones** bring AWS infrastructure closer to large population centers that are not near an existing region. They allow you to place latency-sensitive applications (gaming, real-time collaboration, AR/VR) closer to end users. Local Zones are extensions of a parent region.

**AWS Wavelength** embeds AWS compute and storage at the edge of 5G networks, enabling ultra-low-latency applications for mobile and edge use cases.`,
      quiz: [
        {
          question:
            "What AWS services use edge locations in the global infrastructure?",
          options: [
            "Amazon EC2, Amazon RDS, and Amazon S3",
            "Amazon CloudFront, Amazon Route 53, and AWS Shield",
            "AWS Lambda, Amazon SQS, and Amazon SNS",
            "Amazon ECS, Amazon EKS, and AWS Fargate",
          ],
          correctIndex: 1,
          explanation:
            "Edge locations are used by Amazon CloudFront (CDN for content delivery), Amazon Route 53 (DNS resolution), and AWS Shield (DDoS protection). These services benefit from being geographically close to end users for low latency.",
        },
        {
          question:
            "How do edge locations differ from AWS Regions in terms of quantity and purpose?",
          options: [
            "Edge locations are far more numerous than regions and serve content caching/DNS rather than hosting services",
            "Edge locations host full AWS services while regions are only for content delivery",
            "Edge locations and regions are the same concept with different names",
            "Edge locations are fewer but more powerful than regions",
          ],
          correctIndex: 0,
          explanation:
            "AWS has 600+ edge locations compared to 36+ regions. Edge locations serve content caching (CloudFront), DNS (Route 53), and DDoS protection (Shield) — they are not full AWS regions and do not host services like EC2 or RDS.",
        },
        {
          question: "What is the purpose of AWS Local Zones?",
          options: [
            "To extend AWS services to on-premises data centers",
            "To provide DNS resolution for Route 53 in remote areas",
            "To bring AWS infrastructure closer to large population centers for latency-sensitive applications",
            "To cache S3 objects closer to users who frequently access them",
          ],
          correctIndex: 2,
          explanation:
            "AWS Local Zones bring AWS compute, storage, and database services closer to large metropolitan areas not near a full AWS region. They enable latency-sensitive applications like gaming, real-time collaboration, and AR/VR to run with ultra-low latency for local users.",
        },
      ],
    },
    {
      heading: "Data Sovereignty and Compliance",
      body: `One of the key reasons customers choose specific AWS regions is **data sovereignty** — legal and regulatory requirements about where data must be stored and processed.

Many regulations (GDPR in Europe, data localization laws in various countries, healthcare regulations like HIPAA) require that data about certain subjects or of certain types cannot leave a specific jurisdiction. AWS Regions are aligned with national and continental boundaries, making it possible to comply with these requirements by simply choosing the appropriate region.

**AWS does not move data between regions without your explicit action.** If you store data in the EU West (Ireland) region, it stays in Ireland unless you configure cross-region replication, take a cross-region snapshot, or use a global service. This data residency guarantee is fundamental to regulatory compliance.

For compliance programs broadly, AWS maintains certifications and accreditations including ISO 27001, SOC 1/2/3, PCI DSS, HIPAA eligibility, and FedRAMP. These certifications apply to the AWS infrastructure. Customers are still responsible for architecting their applications and workloads to meet their specific compliance requirements — the certifications cover AWS's infrastructure controls, not everything built on top of it.`,
      quiz: [
        {
          question: "What is data sovereignty in the context of AWS regions?",
          options: [
            "The ability to encrypt data so only authorized users can access it",
            "Legal and regulatory requirements that data must be stored and processed within a specific jurisdiction",
            "AWS's ownership of all data stored in its infrastructure",
            "The process of backing up data across multiple regions for redundancy",
          ],
          correctIndex: 1,
          explanation:
            "Data sovereignty refers to legal and regulatory requirements that certain data must remain within a specific country or jurisdiction. By choosing a region aligned with the required jurisdiction, AWS customers can meet these compliance requirements.",
        },
        {
          question:
            "Under what circumstances will AWS move your data from one region to another?",
          options: [
            "Never — AWS does not move data between regions without your explicit configuration",
            "When a region experiences high load, AWS may temporarily move data to balance capacity",
            "Automatically, when AWS detects lower-cost storage is available in another region",
            "Automatically every 90 days for security compliance purposes",
          ],
          correctIndex: 0,
          explanation:
            "AWS never moves data between regions without your explicit action. If data is stored in EU West (Ireland), it stays in Ireland. Cross-region movement only happens if you explicitly configure replication, take cross-region snapshots, or use specific global services.",
        },
      ],
    },
    {
      heading: "Designing for Global Availability",
      body: `Effective use of AWS Global Infrastructure enables you to build applications that are resilient at multiple levels: instance level, AZ level, region level, and globally.

**Multi-AZ within a region** is the baseline for production workloads. Deploying EC2 Auto Scaling Groups, RDS Multi-AZ, and ElastiCache across multiple AZs means your application survives the failure of any single AZ. This is relatively simple to achieve and is standard practice.

**Multi-Region** architectures provide resilience against regional outages (extremely rare but possible) and serve users globally with low latency. Services like **Route 53** with latency-based or geolocation routing, **CloudFront** for global content delivery, **DynamoDB Global Tables** for globally replicated databases, and **Aurora Global Database** for cross-region relational databases enable multi-region architectures.

**Recovery objectives** guide your architecture choices: **RTO** (Recovery Time Objective) is how long you can be down; **RPO** (Recovery Point Objective) is how much data you can afford to lose. More aggressive RTOs and RPOs require more complex, multi-region architectures and are more expensive. A simple backup-and-restore approach has an RTO of hours; an active-active multi-region architecture can have an RTO of seconds.

For the Cloud Practitioner exam, the key concepts are: Regions are geographic areas, AZs are isolated data centers within a region, edge locations serve CloudFront and Route 53, and you design for HA by spreading across AZs and regions.`,
      quiz: [
        {
          question: "What do RTO and RPO mean in disaster recovery planning?",
          options: [
            "RTO = the time to replicate data; RPO = the time to restore from backup",
            "RTO = how much data you can lose; RPO = how long you can be offline",
            "RTO = how long you can be offline; RPO = how much data you can lose",
            "RTO = recovery test objective; RPO = recovery plan objective",
          ],
          correctIndex: 2,
          explanation:
            "RTO (Recovery Time Objective) is how long your system can be down before it must be restored. RPO (Recovery Point Objective) is how much data loss is acceptable (e.g., up to 1 hour of data). More aggressive (smaller) values require more complex and expensive architectures.",
        },
        {
          question:
            "Which is the baseline high-availability pattern for production workloads on AWS?",
          options: [
            "Using only managed services like Lambda and DynamoDB to eliminate server failures",
            "Multi-Region deployment — replicating all resources across at least three regions",
            "Deploying to a single large instance type for maximum reliability",
            "Multi-AZ deployment — spreading resources across multiple Availability Zones within a region",
          ],
          correctIndex: 3,
          explanation:
            "Multi-AZ deployment is the baseline for production workloads. Spreading EC2 Auto Scaling Groups, RDS Multi-AZ, and other services across multiple AZs within a region ensures the application survives any single AZ failure.",
        },
        {
          question:
            "Which AWS service enables global content delivery with ultra-low latency by caching at edge locations?",
          options: [
            "AWS Direct Connect",
            "AWS Transit Gateway",
            "Amazon Route 53",
            "Amazon CloudFront",
          ],
          correctIndex: 3,
          explanation:
            "Amazon CloudFront is AWS's CDN service that caches content at 600+ edge locations globally. Users are served from the nearest edge location, delivering ultra-low latency regardless of where the origin server is located.",
        },
      ],
    },
  ],

  keyFacts: [
    "AWS has 30+ regions globally, each a separate geographic area with independent infrastructure",
    "Each region has multiple Availability Zones (typically 3), each physically separate data centers",
    "AZs are connected by high-speed private fiber within a region",
    "Spreading across multiple AZs is the baseline for high availability",
    "Edge locations (600+) serve CloudFront, Route 53, and Shield — more locations than regions",
    "AWS does not move data between regions without explicit customer action (data residency)",
    "Global services (IAM, Route 53, CloudFront) are not tied to a specific region",
    "Local Zones extend AWS infrastructure to large population centers near users",
    "Region selection factors: compliance, latency, service availability, pricing",
    "RTO = how long you can be down; RPO = how much data you can lose",
  ],

  relatedServices: [
    "Amazon CloudFront",
    "Amazon Route 53",
    "AWS Shield",
    "Amazon RDS Multi-AZ",
    "Amazon DynamoDB Global Tables",
  ],

  examTips: [
    "Region = geographic area; AZ = isolated data center within a region; edge location = CDN/DNS point",
    "AZs are physically separate but connected by high-speed private networking within a region",
    "Spreading across AZs = high availability; AWS does NOT guarantee cross-AZ isolation from all failures",
    "AWS never moves data between regions without your explicit configuration",
    "IAM, Route 53, CloudFront are global services — not region-specific",
    "Choose region based on: data residency rules, user proximity (latency), service availability, pricing",
    "Edge locations are far more numerous than regions — they power CloudFront CDN globally",
    "Local Zones bring AWS compute closer to end users in specific metro areas",
  ],

  topicQuiz: [
    {
      question:
        "What is the correct hierarchy of AWS global infrastructure from largest to smallest?",
      options: [
        "Edge Location → Availability Zone → Region",
        "Availability Zone → Region → Edge Location",
        "Region → Availability Zone → Edge Location",
        "Region → Edge Location → Availability Zone",
      ],
      correctIndex: 2,
      explanation:
        "The hierarchy is: Region (geographic area) → Availability Zone (isolated data centers within a region) → Edge Locations (distributed globally for CDN/DNS, not within regions in the same sense). Edge locations are separate infrastructure for CloudFront and Route 53.",
    },
    {
      question:
        "A European company must ensure all customer data stays within the EU due to GDPR regulations. How does AWS support this requirement?",
      options: [
        "AWS automatically encrypts EU customer data so it cannot leave the EU",
        "AWS's global backbone network keeps all data within the origin continent automatically",
        "EU data is automatically replicated to a backup EU region for compliance",
        "By deploying resources in an EU region — AWS never moves data between regions without explicit customer action",
      ],
      correctIndex: 3,
      explanation:
        "AWS provides regional isolation as a core feature. Data stored in an EU region stays in that region — AWS never moves it without your explicit configuration. This data residency guarantee is fundamental for GDPR and similar regulations.",
    },
    {
      question:
        "Which AWS services are considered 'global services' not tied to a specific region?",
      options: [
        "Amazon DynamoDB and Amazon SQS",
        "Amazon RDS and Amazon ECS",
        "Amazon EC2 and Amazon S3",
        "AWS IAM, Amazon Route 53, and Amazon CloudFront",
      ],
      correctIndex: 3,
      explanation:
        "AWS IAM, Amazon Route 53, and Amazon CloudFront are global services. IAM users/roles/policies are available globally, Route 53 operates from a global DNS network, and CloudFront uses a global edge network. EC2, RDS, S3, and most services are regional.",
    },
    {
      question:
        "A company has a gaming application requiring ultra-low latency for users in Los Angeles, which is far from the nearest AWS region. Which AWS feature should they use?",
      options: [
        "AWS Wavelength embedded in a 5G network",
        "An additional VPC in the nearest region",
        "AWS Local Zone in Los Angeles",
        "CloudFront edge location in Los Angeles",
      ],
      correctIndex: 2,
      explanation:
        "AWS Local Zones bring AWS compute, storage, and database services to large metropolitan areas not near a full region. Local Zones are extensions of a parent region and are designed for latency-sensitive applications like gaming, AR/VR, and real-time collaboration.",
    },
    {
      question:
        "What is the minimum number of Availability Zones in a standard AWS Region?",
      options: ["3", "1", "5", "2"],
      correctIndex: 0,
      explanation:
        "Most AWS Regions have at least 3 Availability Zones, with some regions having more. Each AZ is one or more physically separate data centers with independent power, cooling, and networking.",
    },
    {
      question:
        "An architect wants to design a system where if the entire us-east-1 region fails, the application can continue serving traffic. What type of architecture is required?",
      options: [
        "RDS Multi-AZ with cross-AZ replication",
        "Multi-AZ deployment within us-east-1",
        "Multi-Region architecture with an active secondary region",
        "A larger EC2 instance type that is more resilient to failures",
      ],
      correctIndex: 2,
      explanation:
        "Multi-AZ protects against AZ-level failures but not regional failures. To survive an entire region failure, you need a Multi-Region architecture with an active secondary region, using services like Route 53 failover routing, DynamoDB Global Tables, and Aurora Global Database.",
    },
    {
      question: "Why are there more AWS edge locations than AWS Regions?",
      options: [
        "Edge locations are smaller and cheaper to build than full regions",
        "Edge locations back up region data so there must be more of them",
        "Edge locations host more services so they require more physical locations",
        "Edge locations serve CDN and DNS traffic and need to be near end users globally — far more cities need low-latency access than full AWS service regions",
      ],
      correctIndex: 3,
      explanation:
        "Edge locations serve CloudFront (CDN) and Route 53 (DNS), which need to be near end users in hundreds of cities globally to minimize latency. Full AWS regions require massive infrastructure investment and are placed strategically, not in every city.",
    },
    {
      question:
        "What does RPO (Recovery Point Objective) measure in disaster recovery planning?",
      options: [
        "How much data loss is acceptable — the maximum age of data that can be lost",
        "How long the system can be offline before users notice",
        "The geographic recovery point where failover occurs",
        "How many regions must be available for the system to function",
      ],
      correctIndex: 0,
      explanation:
        "RPO (Recovery Point Objective) defines how much data loss is acceptable — specifically, the maximum age of data that can be lost during a failure. An RPO of 1 hour means you can tolerate losing up to 1 hour of data. Smaller RPOs require more frequent backups or replication.",
    },
  ],
};
