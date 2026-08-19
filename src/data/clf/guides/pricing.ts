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
    },
    {
      heading: "Key Billing Concepts",
      body: `Understanding the billing structure helps you manage costs proactively.

**AWS Free Tier** offers three types of free usage: **Always Free** (permanent, like 1M Lambda requests/month), **12 Months Free** (available for 12 months after first sign-up, like t2.micro EC2 hours), and **Trials** (short-term free trials of specific services). The Free Tier is designed to let you explore AWS and build small applications without cost.

**Data Transfer Costs** are often a surprise to new AWS users. Data transferred **into** AWS (ingress) is free. Data transferred **out** to the internet (egress) is charged per GB and can become significant at scale. Data transferred between AWS services in the same region is generally free. Data transferred between regions is charged.

**Multiple pricing dimensions** exist for each service. An EC2 instance has separate charges for the instance hours, EBS volumes, Elastic IPs, and data transfer out. S3 has charges for storage, API requests, and data retrieval (for Infrequent Access and Glacier classes). Understanding all dimensions of a service's pricing is important for accurate cost estimation.

The **AWS Pricing Calculator** (calculator.aws) lets you estimate your monthly bill before committing to any resources. It supports all major services and can model complex architectures.`,
    },
    {
      heading: "Cost Management Tools",
      body: `AWS provides several tools to help you monitor, understand, and control your spending.

**AWS Cost Explorer** is a visual tool for analyzing your costs and usage over time. You can view costs by service, by region, by account, by tag, or by any dimension. Cost Explorer can show you your top cost drivers, your cost trends over 13 months of history, and forecasts for the next 3 months. It also provides **Reserved Instance recommendations** — suggestions for which Reserved Instances would save you money based on your usage patterns.

**AWS Budgets** lets you set custom cost and usage budgets with alerts. You can create a budget for total monthly spend, for spending on a specific service, or for Reserved Instance utilization. When your actual or forecasted spend exceeds the threshold, AWS sends you an alert via email or SNS. Budgets can even trigger automated actions like stopping EC2 instances when a threshold is hit.

**AWS Cost and Usage Report (CUR)** is the most detailed billing data available, delivered to an S3 bucket in CSV format. CUR contains every line item of your bill and is used by large organizations and FinOps teams for detailed cost allocation and chargeback.

**AWS Trusted Advisor** (discussed in support plans) includes cost optimization checks that identify idle EC2 instances, underutilized EBS volumes, and unused Reserved Instances.`,
    },
    {
      heading: "Consolidated Billing",
      body: `Organizations with multiple AWS accounts can use **AWS Organizations** to consolidate billing across all accounts. One **management account** pays the bill for all **member accounts** in the organization.

Consolidated billing provides important advantages. **Combined usage** means all accounts' usage is aggregated for volume discount tiers. If account A uses 40 TB of S3 and account B uses 70 TB, the consolidated usage of 110 TB qualifies for a better price tier than either would get individually.

**Reserved Instance sharing** allows unused Reserved Instances in one account to be applied to matching usage in other accounts in the organization. This maximizes RI utilization across a portfolio.

**Single bill**: instead of managing payment for dozens of separate accounts, you receive one consolidated bill.

Organizations provides not only consolidated billing but also **Service Control Policies (SCPs)** — organization-wide permission guardrails that restrict what member accounts can do, regardless of their IAM policies. For example, an SCP can prevent any account in the organization from disabling CloudTrail or creating resources in unauthorized regions.`,
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
};
