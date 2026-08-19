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
    },
    {
      heading: "Security, Reliability, and Performance Pillars",
      body: `The **Security** pillar focuses on protecting information, systems, and assets while delivering business value through risk assessments and mitigation strategies. Design principles include implementing a strong identity foundation (IAM, MFA), enabling traceability (CloudTrail, Config), applying security at all layers (defense in depth), automating security best practices, and protecting data in transit and at rest.

The **Reliability** pillar focuses on ensuring a workload performs its intended function correctly and consistently, recovering from failures when they occur. Key principles include automatically recovering from failure, testing recovery procedures, scaling horizontally for availability, stopping guessing capacity (use Auto Scaling), and managing change through automation. Multi-AZ deployments, Auto Scaling, Elastic Load Balancing, Route 53 health checks, and RDS Multi-AZ are central reliability tools.

The **Performance Efficiency** pillar focuses on using computing resources efficiently and maintaining that efficiency as demand changes and technologies evolve. Principles include democratizing advanced technologies (use managed services instead of building your own), going global in minutes (use CloudFront and multiple regions), using serverless architectures, experimenting more often, and using the mechanical sympathy (choose the right tool for the job — the right database, compute, and storage types for each workload).`,
    },
    {
      heading: "Cost Optimization and Sustainability Pillars",
      body: `The **Cost Optimization** pillar focuses on delivering business value at the lowest price point. Design principles include implementing Cloud Financial Management, adopting a consumption model (pay for what you use), measuring overall efficiency, stopping spending money on undifferentiated heavy lifting (use managed services), and analyzing and attributing expenditure (tag resources, use Cost Explorer).

Practical cost optimization actions include using Reserved Instances and Savings Plans for sustained workloads, Spot Instances for fault-tolerant batch work, S3 Lifecycle Policies for storage tier management, Auto Scaling to avoid over-provisioning, and right-sizing EC2 instances based on actual utilization metrics from CloudWatch.

The **Sustainability** pillar (added in 2021) focuses on minimizing the environmental impact of cloud workloads. Design principles include understanding your environmental impact, establishing sustainability goals, maximizing utilization (running instances near capacity rather than at low utilization), adopting more efficient hardware and software offerings, and using managed services to reduce the infrastructure needed to support your workloads. Higher utilization means fewer servers needed per workload, directly reducing energy consumption and carbon footprint.`,
    },
    {
      heading: "Well-Architected Reviews and the Tool",
      body: `A **Well-Architected Review** is a structured conversation between an AWS Solution Architect (or a trained practitioner) and a customer team to assess a workload against the six pillars. The review identifies architectural risks and provides a prioritized list of improvements.

The **AWS Well-Architected Tool** in the AWS console automates this process. You create a workload, answer a series of questions about your architecture across each pillar, and the tool generates a report highlighting **High Risk Issues (HRI)**, **Medium Risk Issues (MRI)**, and improvement recommendations. The tool also tracks your improvement status over time.

**AWS Well-Architected Lenses** extend the framework for specific industry verticals and technology domains. Examples include the Serverless Lens, the Machine Learning Lens, the Financial Services Industry Lens, and the Healthcare Lens — each providing pillar-specific guidance for those contexts.

For the Cloud Practitioner exam, you should know the names of all six pillars, their general focus area, and that the Well-Architected Framework is a set of best practices (not a service itself) for evaluating and improving AWS architectures. The Well-Architected Tool is the service that operationalizes the framework.`,
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
};
