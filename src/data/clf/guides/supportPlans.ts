import { ServiceGuide } from "../../../types/guide";

export const supportPlansGuide: ServiceGuide = {
  id: "clf-support-plans",
  service: "AWS Support Plans",
  domain: "troubleshooting",
  tagline: "Choose the right level of AWS support for your needs",
  intro:
    "AWS offers five support plans — Basic, Developer, Business, Enterprise On-Ramp, and Enterprise — each providing progressively broader access to technical support, Trusted Advisor checks, and proactive guidance to help you run workloads successfully on AWS.",

  sections: [
    {
      heading: "Overview of Support Plans",
      body: `AWS support plans are tiered by the level of technical assistance, response time guarantees, and proactive services included. Choosing the right plan depends on the criticality of your workloads, your team's AWS expertise, and your budget.

All AWS accounts include **Basic Support** automatically at no cost. As your AWS usage matures and your workloads become more critical, upgrading to a paid plan provides access to faster response times, more Trusted Advisor checks, and dedicated technical account management.

The five plans are: **Basic** (free), **Developer** (monthly fee, starting ~$29/month or 3% of monthly usage), **Business** (monthly fee, starting ~$100/month or 10% of usage), **Enterprise On-Ramp** (monthly fee, starting ~$5,500/month or 10% of usage), and **Enterprise** (monthly fee, starting $15,000/month or a percentage of usage). For the Cloud Practitioner exam, you need to know the key features and differentiators of each plan.`,
      quiz: [
        {
          question:
            "How many AWS Support plan tiers are available, and which one is included free with every AWS account?",
          options: [
            "Three tiers; Developer is included free",
            "Four tiers; Basic Support is included free with every AWS account",
            "Five tiers; Basic Support is included free with every AWS account",
            "Four tiers; Developer Support is free for the first 12 months",
          ],
          correctIndex: 2,
          explanation:
            "AWS offers five support plan tiers: Basic, Developer, Business, Enterprise On-Ramp, and Enterprise. Basic Support is included free with every AWS account and provides documentation, community forums, and seven core Trusted Advisor checks.",
        },
      ],
    },
    {
      heading: "Basic Support",
      body: `**Basic Support** is included for free with every AWS account. Despite being the lowest tier, it provides meaningful resources.

Basic Support includes access to **AWS documentation**, whitepapers, and the **AWS Knowledge Center** — an extensive library of answers to common questions. It also provides access to the **AWS Community Forums** where you can ask questions and learn from other AWS users and advocates.

Basic Support provides **seven core Trusted Advisor checks** in the Security and Service Limits categories. These checks identify the most critical issues: security groups with unrestricted access, unused IAM access keys, S3 bucket public access, and whether you are approaching service limits.

Basic Support does not include access to **AWS technical support engineers** for case creation. If you have a technical problem with your account or resources, you cannot open a support case. You can contact AWS for billing and account questions.`,
      quiz: [
        {
          question:
            "A developer on the Basic Support plan encounters a technical issue with their EC2 instance. What support resource is available to them?",
          options: [
            "They can open a technical support case via email with a 24-business-hour response time",
            "They can call AWS support 24/7 for production issues",
            "They can access AWS documentation, the Knowledge Center, and community forums, but cannot open a technical support case",
            "They receive access to all Trusted Advisor checks to diagnose the issue",
          ],
          correctIndex: 2,
          explanation:
            "Basic Support does not include access to AWS technical support engineers for case creation. Customers on Basic Support can use AWS documentation, the Knowledge Center, and community forums. Opening technical support cases requires at least Developer Support.",
        },
        {
          question:
            "How many Trusted Advisor checks are available to AWS accounts on the Basic Support plan?",
          options: [
            "Seven core checks in the Security and Service Limits categories",
            "Twenty checks across Security and Cost Optimization",
            "All checks across all five categories",
            "No Trusted Advisor access — Trusted Advisor requires Business Support",
          ],
          correctIndex: 0,
          explanation:
            "Basic Support provides access to seven core Trusted Advisor checks in the Security and Service Limits categories. These cover the most critical issues like security groups with unrestricted access and service limit warnings. Full Trusted Advisor access requires Business or Enterprise Support.",
        },
      ],
    },
    {
      heading: "Developer and Business Support",
      body: `**Developer Support** is intended for development and testing environments. It adds the ability to open **technical support cases** via email, with response times of **24 business hours** for general guidance and **12 business hours** for system impairment. One person in your account can contact support.

**Business Support** is AWS's recommended plan for production workloads. It adds:
- **24/7 phone, email, and chat access** to Cloud Support Engineers
- **1-hour response** for production system down scenarios
- **4-hour response** for production system impairment
- **Full Trusted Advisor checks** — all checks across all five categories (Security, Performance, Cost Optimization, Fault Tolerance, and Service Limits)
- **AWS Support API** to programmatically create cases and retrieve information
- **Infrastructure Event Management** support (for additional fee) for planned events like product launches
- **Unlimited contacts** can open support cases

The key difference between Developer and Business is the 24/7 access to Cloud Support Engineers with guaranteed response SLAs for production outages, and the full suite of Trusted Advisor checks.`,
      quiz: [
        {
          question:
            "A company runs production workloads on AWS and needs 24/7 phone access to support engineers with a 1-hour response time for production outages. Which is the minimum support plan that meets these requirements?",
          options: [
            "Basic Support",
            "Developer Support",
            "Business Support",
            "Enterprise Support",
          ],
          correctIndex: 2,
          explanation:
            "Business Support is the minimum plan that provides 24/7 phone, email, and chat access to Cloud Support Engineers with a 1-hour response time for production system down scenarios. Developer Support is email-only with business-hours response and is not suitable for production workloads.",
        },
        {
          question:
            "Which AWS Support plan is the first tier to provide access to ALL Trusted Advisor checks across all five categories?",
          options: [
            "Business Support",
            "Enterprise Support",
            "Basic Support",
            "Developer Support",
          ],
          correctIndex: 0,
          explanation:
            "Business Support is the first tier to provide access to all Trusted Advisor checks across all five categories: Security, Performance, Cost Optimization, Fault Tolerance, and Service Limits. Basic and Developer plans only provide the seven core Security and Service Limits checks.",
        },
      ],
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
      quiz: [
        {
          question:
            "Which feature is the most distinctive differentiator of AWS Enterprise Support compared to Business Support?",
          options: [
            "24/7 phone access to Cloud Support Engineers",
            "Full access to all Trusted Advisor checks",
            "A dedicated Technical Account Manager (TAM) who proactively engages with the customer",
            "A 1-hour response time for production system down scenarios",
          ],
          correctIndex: 2,
          explanation:
            "The Technical Account Manager (TAM) is the most distinctive feature of Enterprise Support. A TAM is a designated AWS employee who proactively engages with the customer, reviews their architecture for risks, helps prepare for events, and advocates for the customer's needs within AWS.",
        },
        {
          question:
            "What is AWS Enterprise On-Ramp, and how does it differ from full Enterprise Support?",
          options: [
            "It is the entry level plan for startups, with 15-minute response but no TAM",
            "It is a trial version of Enterprise Support limited to 90 days",
            "It provides a pool of TAMs (not a dedicated one) and 30-minute critical response, at a lower price than full Enterprise",
            "It provides the same features as Enterprise Support but billed hourly instead of monthly",
          ],
          correctIndex: 2,
          explanation:
            "Enterprise On-Ramp sits between Business and full Enterprise Support. It provides access to a pool of TAMs (rather than a single dedicated TAM), a 30-minute response for critical issues (vs 15 minutes for full Enterprise), and costs less than full Enterprise Support.",
        },
      ],
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
      quiz: [
        {
          question:
            "An AWS account on the Developer Support plan wants to identify underutilized EC2 instances and unattached EBS volumes to reduce costs. Can Trusted Advisor help?",
          options: [
            "Yes — Developer Support includes full access to all Trusted Advisor checks including Cost Optimization",
            "No — Trusted Advisor is only available with Enterprise Support",
            "No — Cost Optimization checks in Trusted Advisor require Business or Enterprise Support",
            "Yes — Trusted Advisor Cost Optimization checks are available to all support plans",
          ],
          correctIndex: 2,
          explanation:
            "Cost Optimization checks in Trusted Advisor require Business or Enterprise Support. Developer Support only provides access to the seven core Trusted Advisor checks in the Security and Service Limits categories. To access Cost Optimization, Performance, and Fault Tolerance checks, the account must upgrade to at least Business Support.",
        },
        {
          question:
            "Which five categories does AWS Trusted Advisor provide recommendations across?",
          options: [
            "Security, Availability, Performance, Backup, and Compliance",
            "Cost Optimization, Performance, Security, Fault Tolerance, and Service Limits",
            "Cost, Speed, Safety, Reliability, and Scalability",
            "Compute, Storage, Database, Networking, and Security",
          ],
          correctIndex: 1,
          explanation:
            "AWS Trusted Advisor provides recommendations across five categories: Cost Optimization, Performance, Security, Fault Tolerance, and Service Limits. Basic and Developer plans only access the Security and Service Limits checks (7 core checks); Business and Enterprise unlock all five categories.",
        },
      ],
    },
  ],

  keyFacts: [
    "Five support tiers: Basic (free), Developer, Business, Enterprise On-Ramp, Enterprise",
    "Basic: documentation, community forums, 7 core Trusted Advisor checks, no technical support cases",
    "Developer: email support, 24 business hours for general guidance, 12 business hours for system impairment, 1 contact",
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

  topicQuiz: [
    {
      question:
        "A startup is testing their first AWS application in a development environment and needs the ability to open technical support cases via email. What is the minimum support plan they need?",
      options: [
        "Basic Support — it is free and includes email support",
        "Enterprise Support — the only plan with guaranteed response SLAs",
        "Business Support — required for any technical support case creation",
        "Developer Support — the first paid plan that allows opening technical support cases",
      ],
      correctIndex: 3,
      explanation:
        "Developer Support is the minimum plan that allows opening technical support cases via email. Basic Support does not include the ability to create technical support cases (only billing and account questions). Developer Support is suitable for development and testing environments.",
    },
    {
      question:
        "Which AWS Support plan provides a dedicated Technical Account Manager (TAM)?",
      options: [
        "Developer Support",
        "Business Support",
        "Enterprise On-Ramp (pool of TAMs)",
        "Enterprise Support (dedicated TAM)",
      ],
      correctIndex: 3,
      explanation:
        "Enterprise Support provides a dedicated Technical Account Manager (TAM) — a single designated AWS employee assigned to the customer. Enterprise On-Ramp provides access to a pool of TAMs (not a dedicated one). Business and Developer plans do not include a TAM.",
    },
    {
      question:
        "What is the response time SLA for a production system down incident under AWS Business Support?",
      options: [
        "1 hour via phone, email, or chat",
        "4 hours via email only",
        "15 minutes with priority phone access",
        "30 minutes via phone or chat",
      ],
      correctIndex: 0,
      explanation:
        "Business Support guarantees a 1-hour response time for production system down scenarios via phone, email, or chat. Enterprise Support offers 15-minute response for business-critical system down; Developer Support only offers business-hours email response.",
    },
    {
      question:
        "A company's AWS account is on Basic Support. Their security team wants to use Trusted Advisor to check for IAM users without MFA and overly permissive security groups. Is this possible?",
      options: [
        "Yes — all Trusted Advisor checks are available to all support plans",
        "No — Trusted Advisor requires at least Business Support",
        "Yes — these specific security checks are among the seven core checks available to all accounts including Basic",
        "No — security checks require at least Developer Support",
      ],
      correctIndex: 2,
      explanation:
        "The seven core Trusted Advisor checks in the Security category are available to all accounts including Basic Support. These include checks for security groups with unrestricted access, IAM users without MFA, S3 bucket public access, and root account access key existence.",
    },
    {
      question:
        "Which AWS Support plan is AWS's recommended minimum for production workloads?",
      options: [
        "Business Support — provides 24/7 access and production outage SLAs",
        "Developer Support — it provides email support at low cost",
        "Basic Support — it is free and sufficient for most workloads",
        "Enterprise Support — only it has SLAs appropriate for production",
      ],
      correctIndex: 0,
      explanation:
        "Business Support is AWS's recommended minimum plan for production workloads. It provides 24/7 phone, email, and chat access to Cloud Support Engineers, a 1-hour response for production system down, and full Trusted Advisor checks.",
    },
    {
      question:
        "The AWS Trusted Advisor 'Fault Tolerance' category checks for which of the following?",
      options: [
        "EC2 instances not deployed across multiple AZs and RDS instances without Multi-AZ enabled",
        "Idle EC2 instances and unused Reserved Instances",
        "IAM users without MFA and security groups with unrestricted access",
        "EC2 instances with high CPU utilization and underprovisioned database IOPS",
      ],
      correctIndex: 0,
      explanation:
        "The Fault Tolerance category in Trusted Advisor checks for architectural issues that reduce resilience, such as EC2 instances not deployed across multiple AZs, RDS without Multi-AZ enabled, EBS volumes without recent snapshots, and Route 53 health check configuration.",
    },
    {
      question:
        "What is the key difference between AWS Enterprise Support and AWS Enterprise On-Ramp?",
      options: [
        "Enterprise includes 24/7 phone support; Enterprise On-Ramp is email-only",
        "Enterprise includes Trusted Advisor; Enterprise On-Ramp does not",
        "Enterprise On-Ramp includes Infrastructure Event Management; Enterprise does not",
        "Enterprise provides a dedicated TAM and 15-minute response; Enterprise On-Ramp provides a pool of TAMs and 30-minute response at a lower price",
      ],
      correctIndex: 3,
      explanation:
        "Enterprise Support provides a single dedicated TAM and a 15-minute response for business-critical outages. Enterprise On-Ramp provides access to a pool of TAMs (not a dedicated one) and a 30-minute critical response time, at a lower price point than full Enterprise Support.",
    },
    {
      question:
        "A large enterprise on AWS Enterprise Support needs help optimizing their billing and managing their account at scale. Which Enterprise Support feature addresses this?",
      options: [
        "AWS Organizations, which consolidates billing across Enterprise Support accounts",
        "The Technical Account Manager (TAM), who handles all billing queries",
        "AWS Cost Explorer, which is only unlocked with Enterprise Support",
        "The AWS Concierge Support Team, which are billing and account experts for large enterprises",
      ],
      correctIndex: 3,
      explanation:
        "The AWS Concierge Support Team is a team of billing and account experts available exclusively to Enterprise Support customers. They help large enterprises manage their AWS bills, optimize costs, and navigate complex account structures.",
    },
  ],
};
