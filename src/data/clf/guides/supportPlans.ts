import { ServiceGuide } from "../../../types/guide";

export const supportPlansGuide: ServiceGuide = {
  id: "clf-support-plans",
  service: "AWS Support Plans",
  domain: "troubleshooting",
  tagline: "Choose the right level of AWS support for your needs",
  intro:
    "AWS offers four support plans — Basic, Developer, Business, and Enterprise — each providing progressively broader access to technical support, Trusted Advisor checks, and proactive guidance to help you run workloads successfully on AWS.",

  sections: [
    {
      heading: "Overview of Support Plans",
      body: `AWS support plans are tiered by the level of technical assistance, response time guarantees, and proactive services included. Choosing the right plan depends on the criticality of your workloads, your team's AWS expertise, and your budget.

All AWS accounts include **Basic Support** automatically at no cost. As your AWS usage matures and your workloads become more critical, upgrading to a paid plan provides access to faster response times, more Trusted Advisor checks, and dedicated technical account management.

The four plans are: **Basic** (free), **Developer** (monthly fee, starting ~$29/month or 3% of monthly usage), **Business** (monthly fee, starting ~$100/month or 10% of usage), and **Enterprise** (monthly fee, starting $15,000/month or a percentage of usage). For the Cloud Practitioner exam, you need to know the key features and differentiators of each plan.`,
    },
    {
      heading: "Basic Support",
      body: `**Basic Support** is included for free with every AWS account. Despite being the lowest tier, it provides meaningful resources.

Basic Support includes access to **AWS documentation**, whitepapers, and the **AWS Knowledge Center** — an extensive library of answers to common questions. It also provides access to the **AWS Community Forums** where you can ask questions and learn from other AWS users and advocates.

Basic Support provides **seven core Trusted Advisor checks** in the Security and Service Limits categories. These checks identify the most critical issues: security groups with unrestricted access, unused IAM access keys, S3 bucket public access, and whether you are approaching service limits.

Basic Support does not include access to **AWS technical support engineers** for case creation. If you have a technical problem with your account or resources, you cannot open a support case. You can contact AWS for billing and account questions.`,
    },
    {
      heading: "Developer and Business Support",
      body: `**Developer Support** is intended for development and testing environments. It adds the ability to open **technical support cases** via email, with response times of **12 business hours** for general guidance and **24 business hours** for system impairment. One person in your account can contact support.

**Business Support** is AWS's recommended plan for production workloads. It adds:
- **24/7 phone, email, and chat access** to Cloud Support Engineers
- **1-hour response** for production system down scenarios
- **4-hour response** for production system impairment
- **Full Trusted Advisor checks** — all checks across all five categories (Security, Performance, Cost Optimization, Fault Tolerance, and Service Limits)
- **AWS Support API** to programmatically create cases and retrieve information
- **Infrastructure Event Management** support (for additional fee) for planned events like product launches
- **Unlimited contacts** can open support cases

The key difference between Developer and Business is the 24/7 access to Cloud Support Engineers with guaranteed response SLAs for production outages, and the full suite of Trusted Advisor checks.`,
    },
    {
      heading: "Enterprise Support",
      body: `**Enterprise Support** is designed for mission-critical workloads where availability and rapid response are paramount.

Enterprise Support adds everything in Business Support plus:
- **15-minute response** for business-critical system down (with priority phone access)
- **Technical Account Manager (TAM)**: a designated AWS employee who knows your environment, architecture, and business goals, and proactively identifies optimization opportunities
- **Concierge Support Team**: billing and account experts for large enterprises
- **Infrastructure Event Management** included (for product launches, migrations)
- **Access to online courses, labs, and training** (AWS Support for AWS Well-Architected Reviews)

The **TAM** is the most distinctive feature of Enterprise Support. A TAM is not just reactive support — they proactively engage with you, help you prepare for events, review your architecture for risks, and advocate for your needs within AWS. Large enterprises managing significant AWS workloads find the TAM relationship invaluable.

**Enterprise On-Ramp** is a middle tier between Business and full Enterprise, with a pool of TAMs (rather than a dedicated one) and 30-minute response for critical issues, at a lower price point than Enterprise.`,
    },
    {
      heading: "AWS Trusted Advisor",
      body: `**AWS Trusted Advisor** is an automated advisory tool that analyzes your AWS environment and provides recommendations across five categories.

**Cost Optimization**: identifies unused or underutilized resources like idle EC2 instances, unattached EBS volumes, and Reserved Instances with low utilization. These recommendations can directly reduce your AWS bill.

**Performance**: checks for over-utilized EC2 instances, CloudFront configuration improvements, and opportunities to use provisioned IOPS for high-throughput databases.

**Security**: checks for overly permissive security group rules, IAM users without MFA, S3 buckets with public access, and root account access key existence. These are the seven free checks available to all accounts.

**Fault Tolerance**: checks for EC2 instances not in multiple AZs, RDS Multi-AZ not enabled, EBS volumes without recent snapshots, and Route 53 health checks.

**Service Limits**: checks how close you are to AWS service quotas across regions, helping you request limit increases before hitting them during peak events.

Only **Business and Enterprise Support** provide access to all Trusted Advisor checks. Basic and Developer plans access only the seven core security and service limits checks.`,
    },
  ],

  keyFacts: [
    "Four support tiers: Basic (free), Developer, Business, Enterprise",
    "Basic: documentation, community forums, 7 core Trusted Advisor checks, no technical support cases",
    "Developer: email support, 12–24 business hour response, 1 contact",
    "Business: 24/7 phone/email/chat, 1-hour response for production down, full Trusted Advisor",
    "Enterprise: 15-minute response for critical, dedicated Technical Account Manager (TAM)",
    "Enterprise On-Ramp: between Business and Enterprise, 30-minute critical response, pool of TAMs",
    "Technical Account Manager (TAM) is a dedicated AWS expert for proactive engagement",
    "Trusted Advisor covers: Cost Optimization, Performance, Security, Fault Tolerance, Service Limits",
    "Full Trusted Advisor checks require Business or Enterprise Support",
    "AWS Concierge is a billing/account expert team available in Enterprise Support",
  ],

  relatedServices: [
    "AWS Trusted Advisor",
    "AWS Health Dashboard",
    "AWS Organizations",
    "AWS Cost Explorer",
  ],

  examTips: [
    "Basic Support is free — includes 7 Trusted Advisor checks and documentation only",
    "Business Support = first plan with 24/7 phone access and full Trusted Advisor checks",
    "Enterprise Support = TAM (Technical Account Manager) + 15-minute critical response",
    "TAM is the key differentiator of Enterprise Support — proactive, dedicated relationship",
    "Full Trusted Advisor requires Business or Enterprise — not Developer or Basic",
    "Developer Support is email-only with business-hours response — not for production",
    "Production workloads should have at minimum Business Support for SLA guarantees",
    "Enterprise On-Ramp provides TAM pool access at lower cost than full Enterprise",
  ],
};
