import { ServiceGuide } from "../../../types/guide";

export const wellArchitectedGuide: ServiceGuide = {
  id: "clf-well-architected",
  service: "AWS Well-Architected Framework",
  domain: "troubleshooting",
  tagline:
    "Six pillars for building secure, high-performing, resilient cloud systems",
  intro:
    "The AWS Well-Architected Framework provides best practices and guiding principles organized into six pillars to help architects build secure, high-performing, resilient, and efficient infrastructure for their applications and workloads on AWS.",

  sections: [
    {
      heading: "What Is the Well-Architected Framework?",
      body: `The AWS Well-Architected Framework is a set of architectural best practices developed by AWS Solutions Architects based on years of experience reviewing customer architectures. It provides a consistent approach for evaluating architectures and implementing designs that scale over time.

The framework is organized around **six pillars**, each representing a critical dimension of a well-designed cloud architecture. For each pillar, the framework provides **design principles** (high-level guidelines) and **best practices** (specific implementation recommendations).

The **AWS Well-Architected Tool** is a free, self-service tool in the AWS console that lets you review your workloads against the six pillars, answer questions about your architecture, and receive a report with potential issues and improvement recommendations.

The framework is not a checklist you complete once — it is a living practice. As your workloads evolve and AWS introduces new services, you revisit your architecture through regular Well-Architected Reviews.`,
      quiz: [
        {
          question: "What is the AWS Well-Architected Framework?",
          options: [
            "An automated tool that enforces mandatory architecture standards for all AWS workloads",
            "A pricing model that rewards customers who follow AWS recommended architecture patterns",
            "A set of architectural best practices organized into six pillars for evaluating and improving cloud architectures",
            "A compliance certification that AWS grants to customers who pass an architectural review",
          ],
          correctIndex: 2,
          explanation:
            "The AWS Well-Architected Framework is a set of architectural best practices developed by AWS Solutions Architects, organized into six pillars. It is not a certification or compliance standard — it provides guidance for evaluating and improving architectures over time.",
        },
        {
          question: "What is the AWS Well-Architected Tool?",
          options: [
            "A paid consulting service where AWS architects review your infrastructure",
            "A compliance scanner that checks AWS resources against CIS benchmarks",
            "A command-line tool that automatically remediates architectural issues in your AWS account",
            "A free self-service tool in the AWS console for reviewing workloads against the six pillars and identifying risk areas",
          ],
          correctIndex: 3,
          explanation:
            "The AWS Well-Architected Tool is a free, self-service tool in the AWS console. You create a workload, answer questions about your architecture across each pillar, and the tool generates a report identifying High Risk Issues (HRIs) and Medium Risk Issues (MRIs) with improvement recommendations.",
        },
      ],
    },
    {
      heading: "Operational Excellence Pillar",
      body: `The **Operational Excellence** pillar focuses on running and monitoring systems to deliver business value and continually improving processes and procedures.

Key design principles include:
- **Perform operations as code**: use Infrastructure as Code (CloudFormation, CDK) to manage infrastructure so operations are versioned, testable, and automated
- **Make frequent, small, reversible changes**: small deployments are easier to test, faster to roll back, and reduce risk compared to large infrequent releases
- **Refine operations procedures frequently**: regularly review and improve runbooks and response procedures
- **Anticipate failure**: design for and regularly test failure scenarios (Game Days, chaos engineering)
- **Learn from all operational failures**: conduct post-mortems after incidents and share learnings

Key AWS services for this pillar include CloudFormation (IaC), CloudWatch (monitoring), CloudTrail (audit), Config (compliance), and Systems Manager (operational management at scale).`,
      quiz: [
        {
          question:
            "Which Well-Architected pillar emphasizes using Infrastructure as Code (IaC) and making frequent, small, reversible changes to deployments?",
          options: [
            "Reliability — to ensure systems recover quickly from failures",
            "Operational Excellence — to run and monitor systems with continually improving processes",
            "Performance Efficiency — to use computing resources efficiently",
            "Security — to protect infrastructure through automated controls",
          ],
          correctIndex: 1,
          explanation:
            "The Operational Excellence pillar focuses on running and monitoring systems to deliver business value. Its key principles include performing operations as code (IaC), making frequent small reversible changes, anticipating failure, and learning from operational incidents.",
        },
        {
          question:
            "According to the Operational Excellence pillar, what is the benefit of making 'frequent, small, reversible changes' rather than large infrequent deployments?",
          options: [
            "Smaller changes cost less because they use fewer AWS resources during deployment",
            "Smaller changes are easier to test, faster to roll back if something goes wrong, and reduce overall deployment risk",
            "AWS charges lower data transfer fees for incremental deployments",
            "Smaller changes bypass the need for change management approvals",
          ],
          correctIndex: 1,
          explanation:
            "Making frequent, small, reversible changes reduces risk: each change is smaller in scope and easier to test, and if something goes wrong it can be rolled back quickly. Large infrequent releases are harder to test comprehensively and much riskier to roll back.",
        },
      ],
    },
    {
      heading: "Security, Reliability, and Performance Pillars",
      body: `The **Security** pillar focuses on protecting information, systems, and assets while delivering business value through risk assessments and mitigation strategies. Design principles include implementing a strong identity foundation (IAM, MFA), enabling traceability (CloudTrail, Config), applying security at all layers (defense in depth), automating security best practices, and protecting data in transit and at rest.

The **Reliability** pillar focuses on ensuring a workload performs its intended function correctly and consistently, recovering from failures when they occur. Key principles include automatically recovering from failure, testing recovery procedures, scaling horizontally for availability, stopping guessing capacity (use Auto Scaling), and managing change through automation. Multi-AZ deployments, Auto Scaling, Elastic Load Balancing, Route 53 health checks, and RDS Multi-AZ are central reliability tools.

The **Performance Efficiency** pillar focuses on using computing resources efficiently and maintaining that efficiency as demand changes and technologies evolve. Principles include democratizing advanced technologies (use managed services instead of building your own), going global in minutes (use CloudFront and multiple regions), using serverless architectures, experimenting more often, and using the mechanical sympathy (choose the right tool for the job — the right database, compute, and storage types for each workload).`,
      quiz: [
        {
          question:
            "A company deploys their application across multiple Availability Zones with Auto Scaling and Elastic Load Balancing to ensure it continues operating during failures. Which Well-Architected pillar does this primarily address?",
          options: [
            "Security — protecting the application from external threats",
            "Operational Excellence — automating operational processes",
            "Reliability — ensuring the workload performs correctly and recovers from failures",
            "Performance Efficiency — using resources efficiently at scale",
          ],
          correctIndex: 2,
          explanation:
            "The Reliability pillar focuses on ensuring a workload performs its intended function and recovers from failures. Multi-AZ deployments, Auto Scaling, and Elastic Load Balancing are all reliability tools that help achieve high availability and automatic recovery.",
        },
        {
          question:
            "The Performance Efficiency pillar recommends 'democratizing advanced technologies' — what does this mean in practice?",
          options: [
            "Using AWS managed services (like RDS, DynamoDB, SageMaker) instead of building and managing the same capabilities yourself",
            "Making AWS services available at lower cost for startups and small businesses",
            "Open-sourcing all internal tools so other teams can benefit from them",
            "Sharing EC2 instances across multiple teams to improve utilization",
          ],
          correctIndex: 0,
          explanation:
            "Democratizing advanced technologies means using AWS managed services (RDS, DynamoDB, SageMaker, etc.) rather than building and managing those capabilities yourself. This lets teams focus on their application logic rather than infrastructure management, accelerating innovation.",
        },
      ],
    },
    {
      heading: "Cost Optimization and Sustainability Pillars",
      body: `The **Cost Optimization** pillar focuses on delivering business value at the lowest price point. Design principles include implementing Cloud Financial Management, adopting a consumption model (pay for what you use), measuring overall efficiency, stopping spending money on undifferentiated heavy lifting (use managed services), and analyzing and attributing expenditure (tag resources, use Cost Explorer).

Practical cost optimization actions include using Reserved Instances and Savings Plans for sustained workloads, Spot Instances for fault-tolerant batch work, S3 Lifecycle Policies for storage tier management, Auto Scaling to avoid over-provisioning, and right-sizing EC2 instances based on actual utilization metrics from CloudWatch.

The **Sustainability** pillar (added in 2021) focuses on minimizing the environmental impact of cloud workloads. Design principles include understanding your environmental impact, establishing sustainability goals, maximizing utilization (running instances near capacity rather than at low utilization), adopting more efficient hardware and software offerings, and using managed services to reduce the infrastructure needed to support your workloads. Higher utilization means fewer servers needed per workload, directly reducing energy consumption and carbon footprint.`,
      quiz: [
        {
          question:
            "A company runs EC2 instances 24/7 for the next 3 years to support a stable production workload. Which Cost Optimization approach would most reduce their compute costs?",
          options: [
            "Use Spot Instances for maximum savings on stable production workloads",
            "Use On-Demand Instances and right-size them based on CloudWatch metrics",
            "Purchase Reserved Instances or Savings Plans to commit to usage in exchange for significant discounts",
            "Use Auto Scaling to automatically shut down instances during low-traffic periods",
          ],
          correctIndex: 2,
          explanation:
            "Reserved Instances and Savings Plans provide significant discounts (up to 72%) compared to On-Demand pricing in exchange for a commitment to a certain level of usage over 1 or 3 years. They are ideal for stable, predictable production workloads running continuously.",
        },
        {
          question:
            "The Sustainability pillar was added to the Well-Architected Framework in which year?",
          options: ["2018", "2023", "2019", "2021"],
          correctIndex: 3,
          explanation:
            "The Sustainability pillar was added as the sixth pillar to the AWS Well-Architected Framework in 2021. It focuses on minimizing the environmental impact of cloud workloads through principles like maximizing utilization, using managed services, and adopting more efficient hardware.",
        },
      ],
    },
    {
      heading: "Well-Architected Reviews and the Tool",
      body: `A **Well-Architected Review** is a structured conversation between an AWS Solution Architect (or a trained practitioner) and a customer team to assess a workload against the six pillars. The review identifies architectural risks and provides a prioritized list of improvements.

The **AWS Well-Architected Tool** in the AWS console automates this process. You create a workload, answer a series of questions about your architecture across each pillar, and the tool generates a report highlighting **High Risk Issues (HRI)**, **Medium Risk Issues (MRI)**, and improvement recommendations. The tool also tracks your improvement status over time.

**AWS Well-Architected Lenses** extend the framework for specific industry verticals and technology domains. Examples include the Serverless Lens, the Machine Learning Lens, the Financial Services Industry Lens, and the Healthcare Lens — each providing pillar-specific guidance for those contexts.

For the Cloud Practitioner exam, you should know the names of all six pillars, their general focus area, and that the Well-Architected Framework is a set of best practices (not a service itself) for evaluating and improving AWS architectures. The Well-Architected Tool is the service that operationalizes the framework.`,
      quiz: [
        {
          question: "What are AWS Well-Architected Lenses?",
          options: [
            "CloudWatch dashboards that visualize Well-Architected metrics for specific workloads",
            "Extensions to the Well-Architected Framework that provide domain-specific guidance for verticals like Serverless, Machine Learning, or Financial Services",
            "IAM permission sets that restrict access to sensitive Well-Architected Tool results",
            "AWS Partner certifications for architects who have completed Well-Architected training",
          ],
          correctIndex: 1,
          explanation:
            "Well-Architected Lenses extend the framework with domain-specific guidance for specific industry verticals and technology domains — such as the Serverless Lens, Machine Learning Lens, Financial Services Industry Lens, and Healthcare Lens. Each lens provides pillar-specific best practices for its domain.",
        },
        {
          question:
            "After completing a Well-Architected Review using the AWS Well-Architected Tool, what types of findings does the tool report?",
          options: [
            "Pass/Fail results for each pillar with mandatory remediation deadlines",
            "Critical, Warning, and Informational alerts similar to AWS Trusted Advisor",
            "Compliance scores mapped to specific regulatory frameworks like PCI DSS or HIPAA",
            "High Risk Issues (HRI) and Medium Risk Issues (MRI) with improvement recommendations",
          ],
          correctIndex: 3,
          explanation:
            "The AWS Well-Architected Tool generates a report identifying High Risk Issues (HRIs) and Medium Risk Issues (MRIs) with prioritized improvement recommendations. The tool tracks improvement status over time as issues are addressed.",
        },
      ],
    },
  ],

  keyFacts: [
    "The Well-Architected Framework has six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability",
    "Sustainability was added as the sixth pillar in 2021",
    "Each pillar has design principles and best practices for cloud architecture",
    "The Well-Architected Tool is a free AWS console service for reviewing workloads",
    "Well-Architected Reviews identify High Risk Issues and Medium Risk Issues",
    "Operational Excellence: run and monitor systems, improve procedures, use IaC",
    "Security: identity foundation, traceability, defense in depth, encryption",
    "Reliability: auto-recover from failure, test procedures, scale horizontally, use Auto Scaling",
    "Performance Efficiency: use managed services, go global in minutes, choose right tools",
    "Cost Optimization: consumption model, Reserved Instances, right-sizing, stop undifferentiated heavy lifting",
  ],

  relatedServices: [
    "AWS Trusted Advisor",
    "Amazon CloudWatch",
    "AWS CloudTrail",
    "AWS Config",
    "AWS Cost Explorer",
  ],

  examTips: [
    "Know all six pillars by name and their focus area — frequently tested",
    "Sustainability was the sixth, most recently added pillar",
    "Well-Architected Tool is free and lives in the AWS console",
    "The framework provides BEST PRACTICES — it is not a compliance standard or certification",
    "Reliability pillar = focus on recovery and availability; Operational Excellence = focus on processes",
    "Cost Optimization pillar: Reserved Instances and Savings Plans for committed workloads; Spot for batch",
    "Performance Efficiency: use managed services and serverless rather than self-managed infrastructure",
    "Well-Architected Lenses extend the framework for specific domains (Serverless, ML, Financial Services)",
  ],

  topicQuiz: [
    {
      question:
        "How many pillars does the AWS Well-Architected Framework have?",
      options: ["Seven", "Six", "Four", "Five"],
      correctIndex: 1,
      explanation:
        "The AWS Well-Architected Framework has six pillars: Operational Excellence, Security, Reliability, Performance Efficiency, Cost Optimization, and Sustainability. Sustainability was added as the sixth pillar in 2021.",
    },
    {
      question:
        "Which Well-Architected pillar focuses on protecting information, systems, and assets through identity management, traceability, and defense in depth?",
      options: [
        "Cost Optimization",
        "Reliability",
        "Operational Excellence",
        "Security",
      ],
      correctIndex: 3,
      explanation:
        "The Security pillar focuses on protecting information, systems, and assets. Its key principles include implementing a strong identity foundation (IAM, MFA), enabling traceability (CloudTrail, Config), applying security at all layers (defense in depth), and protecting data in transit and at rest.",
    },
    {
      question:
        "A company wants to minimize costs by using Spot Instances for batch processing and Reserved Instances for steady-state production workloads. Which Well-Architected pillar does this practice align with?",
      options: [
        "Sustainability — maximizing resource utilization to reduce energy consumption",
        "Performance Efficiency — using the right compute type for each workload",
        "Reliability — ensuring workloads run consistently without interruption",
        "Cost Optimization — delivering business value at the lowest price point",
      ],
      correctIndex: 3,
      explanation:
        "The Cost Optimization pillar focuses on delivering business value at the lowest price point. Using Spot Instances for fault-tolerant batch work and Reserved Instances for stable production workloads are classic Cost Optimization practices that reduce compute costs significantly.",
    },
    {
      question:
        "Which Well-Architected pillar recommends 'testing recovery procedures' and 'automatically recovering from failure'?",
      options: [
        "Performance Efficiency",
        "Reliability",
        "Security",
        "Operational Excellence",
      ],
      correctIndex: 1,
      explanation:
        "The Reliability pillar focuses on ensuring workloads perform correctly and recover from failures. Its key principles include automatically recovering from failure, testing recovery procedures, scaling horizontally, and managing change through automation.",
    },
    {
      question:
        "What is the primary focus of the Sustainability pillar in the Well-Architected Framework?",
      options: [
        "Ensuring workloads can sustain high traffic loads without degradation",
        "Minimizing the environmental impact of cloud workloads by maximizing utilization and using efficient services",
        "Sustaining a consistent operational rhythm through automation and runbooks",
        "Maintaining long-term cost sustainability through financial management practices",
      ],
      correctIndex: 1,
      explanation:
        "The Sustainability pillar focuses on minimizing the environmental impact of cloud workloads. Its principles include understanding environmental impact, maximizing utilization (running instances near capacity), adopting more efficient hardware and software, and using managed services to reduce the infrastructure footprint.",
    },
    {
      question:
        "The Performance Efficiency pillar recommends 'going global in minutes.' Which AWS services enable this capability?",
      options: [
        "AWS Organizations and Control Tower — for deploying accounts in multiple regions",
        "AWS Direct Connect and Transit Gateway — for private global connectivity",
        "Amazon CloudFront and deploying workloads across multiple AWS regions",
        "Amazon Route 53 and AWS Global Accelerator — for DNS-based global routing",
      ],
      correctIndex: 2,
      explanation:
        "The Performance Efficiency principle of 'going global in minutes' refers to using Amazon CloudFront (CDN with global edge locations) and deploying application infrastructure across multiple AWS regions to serve users worldwide with low latency.",
    },
    {
      question:
        "Is the AWS Well-Architected Framework a compliance certification that AWS grants to qualifying customers?",
      options: [
        "Yes — customers who pass a Well-Architected Review receive an AWS compliance certification",
        "No — it is a set of best practices and guidelines, not a compliance standard or certification",
        "Yes — but only for Enterprise Support customers who complete annual reviews",
        "No — it is only for internal AWS use when designing new AWS services",
      ],
      correctIndex: 1,
      explanation:
        "The AWS Well-Architected Framework is a set of best practices and guiding principles — it is NOT a compliance standard or certification. It provides guidance for evaluating and improving architectures. The Well-Architected Tool operationalizes the framework as a self-service review tool.",
    },
    {
      question:
        "A financial services company wants to apply Well-Architected best practices specifically tailored to their industry's regulatory requirements and technology patterns. What should they use?",
      options: [
        "The standard Well-Architected Tool with all six pillars applied equally",
        "AWS Trusted Advisor, which has financial services-specific compliance checks",
        "AWS Artifact, which provides compliance reports for financial regulations",
        "The Well-Architected Financial Services Industry Lens, which extends the framework with domain-specific guidance",
      ],
      correctIndex: 3,
      explanation:
        "Well-Architected Lenses extend the framework with domain-specific guidance. The Financial Services Industry Lens provides pillar-specific best practices tailored to the regulatory requirements and technology patterns of financial services organizations, going beyond the generic framework guidance.",
    },
  ],
};
