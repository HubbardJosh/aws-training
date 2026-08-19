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
      body: `An AWS **Region** is a geographic area that contains multiple, isolated data center clusters. As of 2024, AWS operates 30+ regions globally, with more announced. Each region has a name (like \`us-east-1\` for US East N. Virginia) and a friendly display name.

Regions are **completely independent** of each other. Services, data, and infrastructure in one region do not automatically replicate to another. If you deploy a resource in \`us-east-1\`, it exists only in that region unless you explicitly configure cross-region replication or deploy to other regions.

When choosing a region, consider four factors:
- **Compliance and data residency**: some regulations require data to remain in a specific country or jurisdiction
- **Latency**: choose the region closest to your users for the lowest latency
- **Service availability**: not all AWS services are available in all regions; newer regions may lack some services
- **Pricing**: the same service can have different prices in different regions

**Global services** like IAM, Route 53, and CloudFront are not region-specific — they operate globally and your configuration is available everywhere.`,
    },
    {
      heading: "Availability Zones",
      body: `Each AWS Region is divided into **Availability Zones (AZs)**. Most regions have 3 AZs; some have more. An AZ is one or more discrete data centers with redundant power, networking, and connectivity.

AZs within a region are **physically separated** from each other — typically tens of miles apart — but connected by high-bandwidth, low-latency private networking. This physical separation means a natural disaster, power outage, or facility failure affecting one AZ is unlikely to affect others.

AZ names in a region are designated by appending a letter to the region code: \`us-east-1a\`, \`us-east-1b\`, \`us-east-1c\`. Importantly, the name \`us-east-1a\` in your account may map to a different physical data center than \`us-east-1a\` in another account — AWS randomizes AZ letter assignments to distribute load evenly across AZs.

The fundamental design principle for high availability on AWS is to **spread resources across multiple AZs**. Running two EC2 instances in the same AZ still creates a single point of failure at the AZ level. Running one instance in each of two AZs means your application survives an AZ failure.`,
    },
    {
      heading: "Edge Locations and Points of Presence",
      body: `AWS operates hundreds of **edge locations** and **regional edge caches** around the world, in far more cities than there are full AWS regions. Edge locations are used by **Amazon CloudFront** (CDN), **Amazon Route 53** (DNS), and **AWS Shield** (DDoS protection).

When a user in Tokyo requests content from a CloudFront distribution, that request is served from the nearest edge location in Tokyo rather than traveling to the AWS region (which might be in the US or EU). This dramatically reduces latency for content delivery.

**Regional Edge Caches** are larger cache nodes positioned between edge locations and origin servers. They store content that is not popular enough to remain in individual edge locations but is more popular than what is served directly from the origin.

**AWS Local Zones** bring AWS infrastructure closer to large population centers that are not near an existing region. They allow you to place latency-sensitive applications (gaming, real-time collaboration, AR/VR) closer to end users. Local Zones are extensions of a parent region.

**AWS Wavelength** embeds AWS compute and storage at the edge of 5G networks, enabling ultra-low-latency applications for mobile and edge use cases.`,
    },
    {
      heading: "Data Sovereignty and Compliance",
      body: `One of the key reasons customers choose specific AWS regions is **data sovereignty** — legal and regulatory requirements about where data must be stored and processed.

Many regulations (GDPR in Europe, data localization laws in various countries, healthcare regulations like HIPAA) require that data about certain subjects or of certain types cannot leave a specific jurisdiction. AWS Regions are aligned with national and continental boundaries, making it possible to comply with these requirements by simply choosing the appropriate region.

**AWS does not move data between regions without your explicit action.** If you store data in the EU West (Ireland) region, it stays in Ireland unless you configure cross-region replication, take a cross-region snapshot, or use a global service. This data residency guarantee is fundamental to regulatory compliance.

For compliance programs broadly, AWS maintains certifications and accreditations including ISO 27001, SOC 1/2/3, PCI DSS, HIPAA eligibility, and FedRAMP. These certifications apply to the AWS infrastructure. Customers are still responsible for architecting their applications and workloads to meet their specific compliance requirements — the certifications cover AWS's infrastructure controls, not everything built on top of it.`,
    },
    {
      heading: "Designing for Global Availability",
      body: `Effective use of AWS Global Infrastructure enables you to build applications that are resilient at multiple levels: instance level, AZ level, region level, and globally.

**Multi-AZ within a region** is the baseline for production workloads. Deploying EC2 Auto Scaling Groups, RDS Multi-AZ, and ElastiCache across multiple AZs means your application survives the failure of any single AZ. This is relatively simple to achieve and is standard practice.

**Multi-Region** architectures provide resilience against regional outages (extremely rare but possible) and serve users globally with low latency. Services like **Route 53** with latency-based or geolocation routing, **CloudFront** for global content delivery, **DynamoDB Global Tables** for globally replicated databases, and **Aurora Global Database** for cross-region relational databases enable multi-region architectures.

**Recovery objectives** guide your architecture choices: **RTO** (Recovery Time Objective) is how long you can be down; **RPO** (Recovery Point Objective) is how much data you can afford to lose. More aggressive RTOs and RPOs require more complex, multi-region architectures and are more expensive. A simple backup-and-restore approach has an RTO of hours; an active-active multi-region architecture can have an RTO of seconds.

For the Cloud Practitioner exam, the key concepts are: Regions are geographic areas, AZs are isolated data centers within a region, edge locations serve CloudFront and Route 53, and you design for HA by spreading across AZs and regions.`,
    },
  ],

  keyFacts: [
    "AWS has 30+ regions globally, each a separate geographic area with independent infrastructure",
    "Each region has multiple Availability Zones (typically 3), each physically separate data centers",
    "AZs are connected by high-speed private fiber within a region",
    "Spreading across multiple AZs is the baseline for high availability",
    "Edge locations (400+) serve CloudFront, Route 53, and Shield — more locations than regions",
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
};
