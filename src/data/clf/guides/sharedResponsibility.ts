import { ServiceGuide } from "../../../types/guide";

export const sharedResponsibilityGuide: ServiceGuide = {
  id: "clf-shared-responsibility",
  service: "AWS Shared Responsibility Model",
  domain: "security",
  tagline: "Understanding what AWS secures vs. what you are responsible for",
  intro:
    "The AWS Shared Responsibility Model defines the division of security responsibilities between AWS and the customer — AWS is responsible for security OF the cloud (the infrastructure), while customers are responsible for security IN the cloud (their data, applications, and configurations).",

  sections: [
    {
      heading: "The Core Concept",
      body: `Security and compliance is a shared responsibility between AWS and the customer. This distinction is fundamental to understanding cloud security and is a central topic on the Cloud Practitioner exam.

**AWS is responsible for security OF the cloud** — the physical data centers, the hardware (servers, networking equipment, storage), the hypervisor that powers virtualization, and the managed service infrastructure that AWS operates. AWS secures the global infrastructure that runs all AWS services. Customers never need to worry about physical data center security, hardware failures, or the security of the AWS network.

**Customers are responsible for security IN the cloud** — everything they build and configure on top of the AWS infrastructure. This includes operating systems on EC2 instances, applications, data stored in AWS, network configuration (VPC, security groups, NACLs), IAM user and permission management, and encryption configuration.

The dividing line shifts depending on which AWS services you use, which is why understanding the model by service type is important.`,
    },
    {
      heading: "Infrastructure Services (IaaS)",
      body: `For **infrastructure services** like Amazon EC2, the customer has significant responsibility because they control the operating system and everything above it.

**AWS is responsible for**: the physical host hardware, the hypervisor, the data center physical security, the network infrastructure, and the availability zone and region infrastructure.

**The customer is responsible for**: the guest operating system (patching Windows or Linux), all application software installed on the instance, security group and NACL configuration, data stored on the instance and EBS volumes, encryption configuration, IAM roles and instance profiles, and firewall rules.

A common exam scenario: if an EC2 instance is compromised because the customer did not patch a Linux kernel vulnerability, that is the customer's responsibility. AWS does not patch your EC2 operating systems — that is explicitly on the customer's side of the line.`,
    },
    {
      heading: "Managed Services (PaaS and SaaS)",
      body: `For **managed services** like Amazon RDS, DynamoDB, Lambda, and S3, AWS takes on more responsibility because it manages more of the stack.

**For Amazon RDS**, AWS is responsible for: the EC2 infrastructure running the database engine, the operating system and database engine (including patching), database software installation, and automated backups. The customer is responsible for: what data they store, database user permissions (grants), encryption settings, security group rules controlling network access, and ensuring the database schema and queries are secure.

**For DynamoDB and S3** (fully managed services), AWS manages essentially everything below the data level: hardware, OS, service software, availability, and redundancy. The customer is responsible for: data itself, IAM policies controlling access, encryption configuration (client-side or server-side), S3 bucket policies, and ensuring Block Public Access is correctly configured.

**For Lambda**, AWS manages the compute infrastructure, the runtime environment, and automatic scaling. The customer is responsible for: the function code, the IAM execution role and its permissions, environment variables and secrets management, and the business logic that processes event data.

The general principle: the more managed a service is, the less infrastructure responsibility the customer has, but data and access control always remain the customer's responsibility.`,
    },
    {
      heading: "Inherited Controls and Shared Controls",
      body: `The shared responsibility model can be further divided into three categories of controls.

**AWS Inherited Controls** are controls that customers fully inherit from AWS. Customers do not need to implement or verify these. Examples include physical and environmental controls (data center security, temperature, fire suppression), hardware lifecycle management, and the security of the AWS global network.

**Shared Controls** are responsibilities that apply to both the infrastructure layer and the customer layer, but in separate contexts. **Patch management** is shared: AWS patches the infrastructure, hypervisors, and managed service software; customers patch their EC2 operating systems and application dependencies. **Configuration management** is shared: AWS configures the infrastructure; customers configure their resources, security groups, and IAM policies. **Awareness and training** is shared: AWS trains its employees; customers train their own employees.

**Customer Specific Controls** are entirely the customer's responsibility, such as data encryption (choosing to encrypt at rest and in transit), data integrity authentication, and defining the acceptable use policies for their applications.`,
    },
    {
      heading: "Practical Implications",
      body: `Understanding the Shared Responsibility Model has direct practical implications for how you secure your AWS workloads.

You must **patch your EC2 operating systems**. AWS does not do this. Use AWS Systems Manager Patch Manager to automate patching across your EC2 fleet. For managed services like RDS, AWS handles patching, but you must schedule the maintenance window appropriately.

You are responsible for **configuring security groups correctly**. An overly permissive security group (allowing SSH from 0.0.0.0/0) is entirely the customer's fault and responsibility to fix. Trusted Advisor's security checks help identify these misconfigurations.

**Encryption is the customer's choice**. AWS provides the tools (KMS, server-side encryption, TLS) but enabling them is the customer's responsibility. Encrypting data at rest and in transit is a customer obligation under most compliance frameworks.

**IAM is entirely the customer's domain**. Creating root account access keys, not enabling MFA, or granting overly broad IAM permissions are all customer mistakes. AWS provides the tools and best practice guidance, but the customer controls IAM configuration.

For the exam, the most tested concept is: **AWS secures the physical infrastructure and hardware; customers secure their data, OS, network configuration, and IAM.** When in doubt, ask "is this the cloud infrastructure itself, or is it what runs on top?"`,
    },
  ],

  keyFacts: [
    "AWS is responsible for security OF the cloud (physical infra, hardware, hypervisor, global network)",
    "Customers are responsible for security IN the cloud (data, OS, apps, IAM, configuration)",
    "The line shifts based on service type: more managed = less customer infrastructure responsibility",
    "For EC2: customers patch the OS — AWS does not patch your guest operating systems",
    "For RDS: AWS patches the DB engine; customers manage DB users, data, and network access",
    "For S3/DynamoDB: AWS manages hardware and service; customers manage data and access policies",
    "Data encryption is always the customer's responsibility — AWS provides the tools",
    "IAM configuration is entirely the customer's responsibility",
    "Physical data center security is entirely AWS's responsibility — customers never need to worry about it",
    "Shared controls: patch management, configuration management, training — each party handles their layer",
  ],

  relatedServices: [
    "AWS IAM",
    "Amazon EC2",
    "Amazon RDS",
    "AWS KMS",
    "AWS Config",
    "AWS CloudTrail",
  ],

  examTips: [
    "AWS = security OF the cloud (infrastructure); Customer = security IN the cloud (what you put there)",
    "EC2 OS patching is ALWAYS the customer's responsibility — this is a frequent exam question",
    "Physical data center security = always AWS; IAM configuration = always customer",
    "More managed service = less customer infrastructure responsibility (but data always yours)",
    "Encryption tools are provided by AWS but enabling them is the customer's choice/responsibility",
    "RDS: AWS patches the database engine; customer manages DB permissions and data",
    "Lambda: AWS manages the runtime; customer manages function code and execution role",
    "Shared Responsibility Model applies to every service — know the line for EC2, RDS, S3, Lambda",
  ],
};
