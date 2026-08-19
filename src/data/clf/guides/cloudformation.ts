import { ServiceGuide } from "../../../types/guide";

export const cloudformationGuide: ServiceGuide = {
  id: "clf-cloudformation",
  service: "AWS CloudFormation",
  domain: "deployment",
  tagline: "Define and provision AWS infrastructure as code",
  intro:
    "AWS CloudFormation lets you model, provision, and manage AWS and third-party resources by treating infrastructure as code — you write templates that define your desired resources and CloudFormation creates and configures them automatically and consistently.",

  sections: [
    {
      heading: "What Is Infrastructure as Code?",
      body: `**Infrastructure as Code (IaC)** is the practice of managing and provisioning cloud infrastructure through machine-readable definition files rather than manual processes. Instead of clicking through the AWS Console to create resources, you write a template that describes what you want, and an automation tool like CloudFormation creates it.

IaC provides several powerful benefits. **Repeatability**: the same template produces identical environments every time — dev, staging, and production all have the same configuration. **Version control**: templates live in Git, giving you a history of every infrastructure change. **Automation**: CI/CD pipelines can deploy infrastructure changes the same way they deploy code changes. **Consistency**: human error from manual configuration is eliminated.

CloudFormation is AWS's native IaC service, and it is free to use — you pay only for the AWS resources it creates, not for CloudFormation itself.`,
    },
    {
      heading: "Templates, Stacks, and Resources",
      body: `A **CloudFormation template** is a YAML or JSON document that describes the AWS resources you want to create. It defines resources like EC2 instances, VPCs, S3 buckets, RDS databases, Lambda functions, and nearly everything else in AWS.

A template has several key sections:
- **Resources** (required): the AWS resources to create and their configuration properties
- **Parameters**: inputs that can be supplied when creating the stack, making templates reusable (e.g., pass in the environment name or instance type)
- **Outputs**: values you want to export from the stack after creation (e.g., a load balancer DNS name or an S3 bucket name)
- **Mappings**: lookup tables for values that vary by region or environment
- **Conditions**: logic that controls whether certain resources are created based on parameter values

When you deploy a template, CloudFormation creates a **stack** — a collection of AWS resources managed as a single unit. The stack tracks all resources created from the template. You can update a stack by modifying the template; CloudFormation determines what changed and updates only those resources. Deleting a stack removes all its resources simultaneously.`,
    },
    {
      heading: "Change Sets and Drift Detection",
      body: `CloudFormation provides safeguards to prevent accidental changes to production infrastructure.

A **Change Set** is a preview of the changes that would occur if you apply a template update to an existing stack. Before deploying, you create a change set, review it, and approve or reject it. This is especially valuable for understanding whether an update will cause resource replacement (which can mean downtime) or simple modification.

**Drift Detection** identifies resources whose configuration has diverged from the CloudFormation template — for example, if someone manually changed an EC2 security group through the Console without updating the template. Running drift detection shows you which resources drifted and what changed. This helps enforce the discipline of making all infrastructure changes through CloudFormation rather than manual console actions.`,
    },
    {
      heading: "Nested Stacks and StackSets",
      body: `For large, complex infrastructure, CloudFormation provides tools to organize and reuse templates.

**Nested Stacks** allow one CloudFormation template to reference and deploy other templates. A common pattern is to create reusable "module" templates for your VPC network configuration, security groups, and IAM roles, then reference them from environment templates. This promotes reuse and keeps individual templates manageable.

**CloudFormation StackSets** extend stacks across multiple AWS accounts and multiple regions in a single operation. An administrator creates a StackSet and deploys it to target accounts and regions. This is powerful for governance — for example, deploying a standard security configuration or logging setup to hundreds of accounts in an AWS Organization simultaneously.

**Rollback** is automatic: if CloudFormation encounters an error during stack creation or update, it automatically rolls back all changes to the last known good state. This prevents partial deployments that leave infrastructure in an inconsistent state.`,
    },
    {
      heading: "CloudFormation vs. Other IaC Tools",
      body: `CloudFormation is AWS-native, but it is not the only IaC tool available. For the Cloud Practitioner exam, it helps to understand CloudFormation's position in the ecosystem.

**AWS CDK (Cloud Development Kit)** allows you to define cloud infrastructure using familiar programming languages (TypeScript, Python, Java, C#) instead of YAML or JSON. CDK synthesizes your code into CloudFormation templates, which are then deployed through the CloudFormation service. CDK is an abstraction on top of CloudFormation.

**Terraform** (by HashiCorp) is a popular open-source IaC tool that works with AWS and many other cloud providers. Unlike CloudFormation, Terraform is multi-cloud. Many organizations use Terraform for its flexibility across providers.

**AWS Elastic Beanstalk** and **AWS SAM (Serverless Application Model)** also use CloudFormation under the hood, abstracting away some of its complexity for specific use cases (web applications and serverless applications, respectively).

For the Cloud Practitioner exam, you should know that CloudFormation enables infrastructure as code on AWS, templates are YAML or JSON, stacks group related resources, and the service is free (you pay for the resources it creates, not CloudFormation itself).`,
    },
  ],

  keyFacts: [
    "CloudFormation is AWS's native Infrastructure as Code (IaC) service",
    "Templates are written in YAML or JSON and describe desired AWS resources",
    "A stack is a collection of resources deployed from a single template",
    "Deleting a stack removes all resources created from that template",
    "Change Sets preview template updates before applying them to a stack",
    "Drift Detection identifies resources that were manually changed outside CloudFormation",
    "Automatic rollback reverts failed stack updates to the last known good state",
    "CloudFormation itself is free — you pay only for the resources it creates",
    "StackSets deploy stacks across multiple accounts and regions simultaneously",
    "AWS CDK and AWS SAM use CloudFormation under the hood",
  ],

  relatedServices: [
    "AWS CDK",
    "AWS SAM",
    "AWS Elastic Beanstalk",
    "AWS CodePipeline",
    "AWS Organizations",
  ],

  examTips: [
    "CloudFormation = infrastructure as code — templates define desired state, CloudFormation makes it real",
    "Templates are YAML or JSON; stacks are deployed instances of a template",
    "Deleting a stack deletes all resources in it — useful for clean teardown of environments",
    "Change Sets = preview changes before applying; safe update strategy for production",
    "CloudFormation is free — only the resources it creates cost money",
    "Drift Detection finds resources manually changed outside CloudFormation",
    "StackSets deploy to many accounts/regions at once — great for governance",
    "Automatic rollback on error prevents partial/inconsistent infrastructure deployments",
  ],
};
