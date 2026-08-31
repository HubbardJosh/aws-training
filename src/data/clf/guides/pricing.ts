import { ServiceGuide } from "../../../types/guide";

export const pricingGuide: ServiceGuide = {
  id: "clf-pricing",
  service: "AWS Pricing & Billing",
  domain: "troubleshooting",
  tagline: "Understand how AWS charges work and how to manage your costs",
  intro:
    "AWS uses a pay-as-you-go pricing model where you pay only for the services you consume with no upfront costs or long-term contracts required — understanding how billing works helps you optimize costs and avoid unexpected charges.",

  sections: [
    {
      heading: "AWS Pricing Fundamentals",
      body: `AWS pricing is based on three core principles: **pay for what you use**, **pay less when you use more**, and **pay less when you reserve capacity**.

**Pay for what you use** means there are no upfront costs or termination fees for most services. If you launch an EC2 instance and use it for one hour, you pay for one hour. If you store 100 GB in S3 for a month, you pay for 100 GB-months of storage. Most services are billed by the hour, second, request, or unit of data processed.

**Pay less when you use more** refers to volume discounts. AWS automatically reduces your per-unit price as your usage grows for services like S3 (price per GB decreases as you store more), data transfer, and others.

**Pay less when you reserve** applies to services like EC2 and RDS. Committing to use a service for 1 or 3 years reduces the price by up to 72% compared to on-demand pricing. Reserved Instances and Savings Plans offer these discounts.

Three key factors drive most AWS bills: **compute** (EC2, Lambda, Fargate), **storage** (S3, EBS, RDS), and **data transfer out** (data leaving AWS to the internet). Data transfer between services within the same region is generally free.`,
      quiz: [
        {
          question:
            "Which of the following is NOT one of AWS's three core pricing principles?",
          options: [
            "Pay a fixed monthly fee for all services",
            "Pay less when you use more",
            "Pay less when you reserve capacity",
            "Pay for what you use",
          ],
          correctIndex: 0,
          explanation:
            "The three AWS pricing principles are: pay for what you use (no upfront costs), pay less when you use more (volume discounts), and pay less when you reserve (discounts for 1- or 3-year commitments). AWS does not charge a fixed monthly fee — it is pay-as-you-go.",
        },
        {
          question: "Which type of data transfer on AWS is generally free?",
          options: [
            "Data transferred out from AWS to the internet",
            "Data transferred between AWS services within the same region",
            "Data transferred between AWS regions",
            "Data transferred from on-premises to AWS over Direct Connect",
          ],
          correctIndex: 1,
          explanation:
            "Data transferred between AWS services within the same region is generally free. Data transferred out to the internet (egress) is charged per GB. Data transferred between regions is also charged. Inbound data transfer (ingress) from the internet to AWS is free.",
        },
        {
          question: "What are the three main cost drivers on most AWS bills?",
          options: [
            "Networking, security, and compliance",
            "Regions, Availability Zones, and edge locations",
            "Compute, storage, and data transfer out",
            "IAM users, API calls, and CloudWatch metrics",
          ],
          correctIndex: 2,
          explanation:
            "The three main drivers of most AWS bills are compute (EC2, Lambda, Fargate), storage (S3, EBS, RDS), and data transfer out (data leaving AWS to the internet). Understanding these three dimensions helps prioritize cost optimization efforts.",
        },
      ],
    },
    {
      heading: "Key Billing Concepts",
      body: `Understanding the billing structure helps you manage costs proactively.

**AWS Free Tier** offers three types of free usage: **Always Free** (permanent, like 1M Lambda requests/month), **12 Months Free** (available for 12 months after first sign-up, like t2.micro EC2 hours), and **Trials** (short-term free trials of specific services). The Free Tier is designed to let you explore AWS and build small applications without cost.

**Data Transfer Costs** are often a surprise to new AWS users. Data transferred **into** AWS (ingress) is free. Data transferred **out** to the internet (egress) is charged per GB and can become significant at scale. Data transferred between AWS services in the same region is generally free. Data transferred between regions is charged.

**Multiple pricing dimensions** exist for each service. An EC2 instance has separate charges for the instance hours, EBS volumes, Elastic IPs, and data transfer out. S3 has charges for storage, API requests, and data retrieval (for Infrequent Access and Glacier classes). Understanding all dimensions of a service's pricing is important for accurate cost estimation.

The **AWS Pricing Calculator** (calculator.aws) lets you estimate your monthly bill before committing to any resources. It supports all major services and can model complex architectures.`,
      quiz: [
        {
          question:
            "Which type of AWS Free Tier offering is permanent and does not expire after 12 months?",
          options: [
            "12 Months Free (like t2.micro EC2 hours)",
            "Trials (short-term service trials)",
            "Always Free (like 1 million Lambda requests per month)",
            "All Free Tier offerings are permanent",
          ],
          correctIndex: 2,
          explanation:
            "The 'Always Free' tier is permanent and never expires, regardless of how long you've been an AWS customer. Examples include 1 million Lambda requests per month and 25 GB of DynamoDB storage. '12 Months Free' expires after the first year and 'Trials' are short-term.",
        },
        {
          question:
            "A company is surprised by high data transfer costs on their AWS bill. Which direction of data transfer is charged?",
          options: [
            "Data transferred between Availability Zones within a region",
            "Data transferred between services in the same AWS region",
            "Data transferred into AWS from the internet (ingress)",
            "Data transferred out from AWS to the internet (egress)",
          ],
          correctIndex: 3,
          explanation:
            "Data transferred out from AWS to the internet (egress) is charged per GB and can become significant at scale. Data transferred into AWS (ingress) is free. Data between services in the same region is generally free.",
        },
        {
          question: "What is the AWS Pricing Calculator used for?",
          options: [
            "Analyzing your actual monthly AWS spending history",
            "Setting budget alerts when spending exceeds a threshold",
            "Estimating your monthly AWS bill before deploying resources",
            "Automatically optimizing your infrastructure to reduce costs",
          ],
          correctIndex: 2,
          explanation:
            "The AWS Pricing Calculator (calculator.aws) is used to estimate your monthly AWS bill before committing to any resources. It supports all major services and lets you model complex architectures to understand costs upfront.",
        },
      ],
    },
    {
      heading: "Cost Management Tools",
      body: `AWS provides several tools to help you monitor, understand, and control your spending.

**AWS Cost Explorer** is a visual tool for analyzing your costs and usage over time. You can view costs by service, by region, by account, by tag, or by any dimension. Cost Explorer can show you your top cost drivers, your cost trends over 13 months of history, and forecasts for the next 3 months. It also provides **Reserved Instance recommendations** — suggestions for which Reserved Instances would save you money based on your usage patterns.

**AWS Budgets** lets you set custom cost and usage budgets with alerts. You can create a budget for total monthly spend, for spending on a specific service, or for Reserved Instance utilization. When your actual or forecasted spend exceeds the threshold, AWS sends you an alert via email or SNS. Budgets can even trigger automated actions like stopping EC2 instances when a threshold is hit.

**AWS Cost and Usage Report (CUR)** is the most detailed billing data available, delivered to an S3 bucket in CSV format. CUR contains every line item of your bill and is used by large organizations and FinOps teams for detailed cost allocation and chargeback.

**AWS Trusted Advisor** (discussed in support plans) includes cost optimization checks that identify idle EC2 instances, underutilized EBS volumes, and unused Reserved Instances.`,
      quiz: [
        {
          question:
            "What is the difference between AWS Cost Explorer and AWS Budgets?",
          options: [
            "They are the same tool with different names",
            "Cost Explorer is for future cost estimation; Budgets is for analyzing past spending",
            "Cost Explorer is only available with Enterprise Support; Budgets is available to all accounts",
            "Cost Explorer analyzes historical costs and forecasts; Budgets sets thresholds and sends alerts when spending exceeds them",
          ],
          correctIndex: 3,
          explanation:
            "Cost Explorer visualizes and analyzes your historical costs and usage (13 months of history, 3-month forecasts) to help you understand spending patterns. AWS Budgets lets you set thresholds and sends alerts (via email or SNS) when actual or forecasted spending exceeds those thresholds.",
        },
        {
          question:
            "How many months of cost history can AWS Cost Explorer display?",
          options: ["13 months", "6 months", "24 months", "3 months"],
          correctIndex: 0,
          explanation:
            "AWS Cost Explorer displays up to 13 months of cost and usage history, plus forecasts for the next 3 months. This allows you to analyze spending trends over more than a year to identify patterns and anomalies.",
        },
        {
          question:
            "Which AWS billing tool delivers the most granular billing data to an S3 bucket in CSV format?",
          options: [
            "AWS Cost Explorer",
            "AWS Budgets",
            "AWS Cost and Usage Report (CUR)",
            "AWS Trusted Advisor",
          ],
          correctIndex: 2,
          explanation:
            "The AWS Cost and Usage Report (CUR) provides the most detailed billing data available, with every line item of your bill delivered to an S3 bucket in CSV format. It is used by large organizations and FinOps teams for detailed cost allocation and chargeback reporting.",
        },
      ],
    },
    {
      heading: "Consolidated Billing",
      body: `Organizations with multiple AWS accounts can use **AWS Organizations** to consolidate billing across all accounts. One **management account** pays the bill for all **member accounts** in the organization.

Consolidated billing provides important advantages. **Combined usage** means all accounts' usage is aggregated for volume discount tiers. If account A uses 40 TB of S3 and account B uses 70 TB, the consolidated usage of 110 TB qualifies for a better price tier than either would get individually.

**Reserved Instance sharing** allows unused Reserved Instances in one account to be applied to matching usage in other accounts in the organization. This maximizes RI utilization across a portfolio.

**Single bill**: instead of managing payment for dozens of separate accounts, you receive one consolidated bill.

Organizations provides not only consolidated billing but also **Service Control Policies (SCPs)** — organization-wide permission guardrails that restrict what member accounts can do, regardless of their IAM policies. For example, an SCP can prevent any account in the organization from disabling CloudTrail or creating resources in unauthorized regions.`,
      quiz: [
        {
          question:
            "What is a key financial benefit of using AWS Organizations' consolidated billing?",
          options: [
            "Data transfer between member accounts becomes completely free",
            "Member accounts receive a 50% discount on all services automatically",
            "All accounts' usage is aggregated, potentially qualifying for volume discount pricing tiers",
            "The management account gets free Reserved Instances for all member accounts",
          ],
          correctIndex: 2,
          explanation:
            "Consolidated billing aggregates all member accounts' usage for volume discount calculations. For example, if multiple accounts collectively use 110 TB of S3, they may qualify for a better price tier than any single account would achieve individually at 40 or 70 TB.",
        },
        {
          question:
            "What are Service Control Policies (SCPs) in AWS Organizations?",
          options: [
            "Organization-wide permission guardrails that restrict what member accounts can do, regardless of their IAM policies",
            "Billing policies that control how costs are allocated between accounts",
            "Compliance policies that audit resource configurations across accounts",
            "IAM policies that apply to all users within a single AWS account",
          ],
          correctIndex: 0,
          explanation:
            "SCPs are organization-wide guardrails set by the management account that restrict what actions member accounts can perform, even if those accounts have IAM policies that would otherwise allow the action. For example, an SCP can prevent disabling CloudTrail across the entire organization.",
        },
        {
          question:
            "In consolidated billing, how does Reserved Instance sharing benefit an organization?",
          options: [
            "Reserved Instances purchased by any member account apply to the management account's usage",
            "Reserved Instances in one account can be applied to matching usage in other accounts in the organization",
            "Reserved Instances can be sold between member accounts at market price",
            "All member accounts automatically receive Reserved Instance discounts without purchasing them",
          ],
          correctIndex: 1,
          explanation:
            "With consolidated billing, unused Reserved Instances in one account can be applied to matching instance usage in other accounts within the same organization. This maximizes RI utilization across the portfolio and reduces waste.",
        },
      ],
    },
    {
      heading: "Cost Optimization Strategies",
      body: `Proactively managing costs is a core AWS skill. Several strategies help reduce your AWS bill without sacrificing capability.

**Right-sizing** means choosing the correct instance type and size for your workload. Many organizations over-provision compute resources out of caution. AWS Compute Optimizer analyzes actual utilization and recommends optimal instance types, often identifying opportunities to switch to smaller or more cost-efficient instance families with no performance impact.

**Reserved Instances and Savings Plans** are the single highest-impact cost reduction for predictable, sustained workloads. Committing to EC2 or compute spend for 1–3 years can reduce costs by up to 72%.

**Spot Instances** for fault-tolerant batch workloads (data processing, ML training, CI/CD) can reduce EC2 costs by up to 90%.

**Storage lifecycle management**: use S3 Lifecycle Policies to automatically move objects to cheaper storage classes (Standard-IA after 30 days, Glacier after 90 days) and expire objects that are no longer needed.

**Auto Scaling**: ensure you scale down during low-traffic periods. Running the same number of instances 24/7 when peak traffic only occurs 8 hours a day wastes money on 16 hours of idle capacity.

**Tagging**: apply resource tags consistently (like \`Project\`, \`Environment\`, \`Team\`) and use them in Cost Explorer to allocate costs to teams or projects. Without tags, it is difficult to understand which part of your organization is responsible for which spending.`,
      quiz: [
        {
          question:
            "What does 'right-sizing' mean in the context of AWS cost optimization?",
          options: [
            "Purchasing the largest available instance type to ensure you never run out of capacity",
            "Using only AWS-managed services to eliminate the need for instance sizing decisions",
            "Choosing the correct instance type and size that matches your actual workload needs",
            "Splitting workloads across the maximum number of small instances",
          ],
          correctIndex: 2,
          explanation:
            "Right-sizing means selecting the instance type and size that best matches your actual workload requirements. Many organizations over-provision out of caution. AWS Compute Optimizer analyzes utilization and identifies opportunities to downsize without impacting performance.",
        },
        {
          question:
            "Why is resource tagging important for cost management in AWS?",
          options: [
            "Tags prevent unauthorized users from accessing tagged resources",
            "Tags are required by AWS for all resources or billing stops",
            "Tags automatically apply Reserved Instance discounts to tagged resources",
            "Tags enable cost allocation reporting in Cost Explorer, showing which teams or projects are responsible for spending",
          ],
          correctIndex: 3,
          explanation:
            "Resource tags (like Project, Environment, Team) allow you to filter and group costs in AWS Cost Explorer. Without consistent tagging, it is difficult to attribute spending to specific teams or projects, making cost accountability and optimization much harder.",
        },
        {
          question:
            "Which cost optimization strategy automatically moves S3 objects to cheaper storage classes as they age?",
          options: [
            "S3 Lifecycle Policies",
            "S3 Versioning",
            "S3 Cross-Region Replication",
            "S3 Intelligent-Tiering",
          ],
          correctIndex: 0,
          explanation:
            "S3 Lifecycle Policies automatically transition objects to cheaper storage classes (Standard-IA after 30 days, Glacier after 90 days) and expire objects that are no longer needed. This reduces storage costs without manual intervention.",
        },
      ],
    },
  ],

  keyFacts: [
    "AWS pricing principles: pay for what you use, pay less with more, pay less when you reserve",
    "Data transfer INTO AWS is free; data transfer OUT to the internet is charged per GB",
    "Free Tier: Always Free (permanent), 12 Months Free (post-signup), and Trials",
    "AWS Pricing Calculator (calculator.aws) estimates monthly costs before deployment",
    "Cost Explorer visualizes spending history (13 months) and forecasts (3 months)",
    "AWS Budgets sends alerts when spending exceeds configured thresholds",
    "Consolidated Billing in AWS Organizations aggregates usage across accounts for volume discounts",
    "Reserved Instances and Savings Plans offer up to 72% discount for committed usage",
    "Spot Instances offer up to 90% discount for fault-tolerant, interruptible workloads",
    "Resource tagging enables cost allocation reporting by team, project, or environment",
  ],

  relatedServices: [
    "AWS Organizations",
    "AWS Cost Explorer",
    "AWS Budgets",
    "AWS Trusted Advisor",
    "AWS Compute Optimizer",
  ],

  examTips: [
    "Data transfer in is free; data transfer out to internet costs money — know this distinction",
    "Free Tier has three types: Always Free, 12 Months Free, and Trials",
    "Cost Explorer = analyze historical costs; Budgets = alert when spending exceeds threshold",
    "Consolidated Billing aggregates all accounts' usage for volume discount tiers",
    "Reserved Instances and Savings Plans = commit 1–3 years for up to 72% savings",
    "Spot Instances = cheapest compute but can be interrupted — use for batch/fault-tolerant jobs",
    "Tag resources to enable cost allocation reporting — critical for large organizations",
    "AWS Pricing Calculator is for estimating costs BEFORE you deploy resources",
  ],

  topicQuiz: [
    {
      question:
        "A company's AWS bill is unexpectedly high. They discover large charges for data leaving their VPC to the internet. Which type of data transfer is being charged?",
      options: [
        "Data transfer out from AWS to the internet (egress)",
        "Data transfer into AWS from on-premises (ingress)",
        "Data transfer between EC2 instances in the same Availability Zone",
        "Data transfer between S3 and EC2 in the same region",
      ],
      correctIndex: 0,
      explanation:
        "Data transfer out from AWS to the internet (egress) is charged per GB and can become significant at scale. Data transfer into AWS (ingress) is free, and data transfer between services in the same region is generally also free.",
    },
    {
      question:
        "Which AWS tool should you use to estimate your monthly costs before deploying a new architecture?",
      options: [
        "AWS Trusted Advisor",
        "AWS Pricing Calculator",
        "AWS Budgets",
        "AWS Cost Explorer",
      ],
      correctIndex: 1,
      explanation:
        "The AWS Pricing Calculator (calculator.aws) is specifically designed for estimating costs before deployment. Cost Explorer analyzes past spending. Budgets alerts on thresholds. Trusted Advisor identifies optimization opportunities in existing resources.",
    },
    {
      question:
        "Which AWS Free Tier type provides 1 million Lambda requests per month that never expire?",
      options: ["Always Free", "Trials", "On-Demand Free", "12 Months Free"],
      correctIndex: 0,
      explanation:
        "The 'Always Free' tier is permanent and includes resources like 1 million Lambda requests per month and 25 GB of DynamoDB storage. This is distinct from '12 Months Free' offerings which expire after the first year of account creation.",
    },
    {
      question:
        "A company with 10 AWS accounts wants to combine their S3 usage across all accounts to qualify for volume pricing discounts. Which AWS feature enables this?",
      options: [
        "AWS Organizations Consolidated Billing",
        "AWS Savings Plans",
        "S3 Intelligent-Tiering",
        "S3 Cross-Region Replication",
      ],
      correctIndex: 0,
      explanation:
        "AWS Organizations Consolidated Billing aggregates usage across all member accounts. If each account uses some S3 storage, the combined total may qualify for a better volume discount tier than any single account would achieve individually.",
    },
    {
      question:
        "What is the single highest-impact cost optimization for a company running predictable, sustained EC2 workloads?",
      options: [
        "Purchasing Reserved Instances or Savings Plans with 1- or 3-year commitments",
        "Moving to the smallest instance types available",
        "Using Spot Instances for all production workloads",
        "Switching all workloads to Lambda",
      ],
      correctIndex: 0,
      explanation:
        "Reserved Instances and Savings Plans offer discounts up to 72% compared to On-Demand pricing for 1- or 3-year commitments. For predictable, sustained workloads, this is the single highest-impact cost reduction available.",
    },
    {
      question: "AWS Budgets differs from AWS Cost Explorer in which key way?",
      options: [
        "Budgets analyzes historical spending; Cost Explorer sets spending alerts",
        "Budgets is only available with Business Support; Cost Explorer is available to all accounts",
        "Cost Explorer analyzes historical spending and forecasts; Budgets sets thresholds and sends proactive alerts",
        "Cost Explorer requires tagging; Budgets works without any resource tags",
      ],
      correctIndex: 2,
      explanation:
        "Cost Explorer is an analysis tool — it visualizes historical costs and usage and forecasts future spending. AWS Budgets is a proactive alerting tool — you set thresholds for spend or usage, and AWS notifies you via email or SNS when actual or forecasted spending approaches or exceeds the limit.",
    },
    {
      question:
        "Which cost optimization strategy would AWS Compute Optimizer help with?",
      options: [
        "Recommending right-sized instance types based on actual workload utilization",
        "Identifying unused Reserved Instances that can be sold on the Marketplace",
        "Automatically moving S3 objects to cheaper storage classes",
        "Consolidating multiple AWS accounts to reduce per-account overhead",
      ],
      correctIndex: 0,
      explanation:
        "AWS Compute Optimizer analyzes your actual resource utilization and recommends optimal instance types and sizes. It identifies over-provisioned resources where you could switch to a smaller or more cost-efficient instance family with no performance impact.",
    },
    {
      question:
        "Service Control Policies (SCPs) in AWS Organizations serve which purpose?",
      options: [
        "Enforcing resource tagging standards across all member accounts",
        "Automatically applying Reserved Instance discounts across all accounts",
        "Setting organization-wide permission guardrails that restrict what member accounts can do",
        "Controlling which AWS services are billed to which department",
      ],
      correctIndex: 2,
      explanation:
        "SCPs are organization-wide guardrails that restrict what actions member accounts can perform, even overriding IAM policies in those accounts. For example, an SCP can prevent all member accounts from creating resources in unauthorized regions or disabling AWS CloudTrail.",
    },
  ],
};
