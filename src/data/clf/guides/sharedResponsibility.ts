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
      quiz: [
        {
          question:
            "According to the AWS Shared Responsibility Model, which of the following is AWS responsible for?",
          options: [
            "Patching the operating systems on EC2 instances",
            "Configuring security groups and network ACLs",
            "Physical security of the data centers and underlying hardware",
            "Managing IAM users and their permissions",
          ],
          correctIndex: 2,
          explanation:
            "AWS is responsible for security OF the cloud, which includes physical data center security, hardware, networking equipment, and the hypervisor. Patching EC2 operating systems, configuring security groups, and managing IAM are all customer responsibilities.",
        },
        {
          question:
            "Which phrase best summarizes the customer's side of the AWS Shared Responsibility Model?",
          options: [
            "Security OF the cloud — protecting the physical infrastructure",
            "Security IN the cloud — protecting data, applications, and configurations built on AWS",
            "Security AROUND the cloud — managing perimeter network defenses",
            "Security BELOW the cloud — managing hypervisor and hardware security",
          ],
          correctIndex: 1,
          explanation:
            "Customers are responsible for security IN the cloud — everything they build and configure on top of AWS infrastructure, including their data, operating systems, applications, network configuration, and IAM.",
        },
      ],
    },
    {
      heading: "Infrastructure Services (IaaS)",
      body: `For **infrastructure services** like Amazon EC2, the customer has significant responsibility because they control the operating system and everything above it.

**AWS is responsible for**: the physical host hardware, the hypervisor, the data center physical security, the network infrastructure, and the availability zone and region infrastructure.

**The customer is responsible for**: the guest operating system (patching Windows or Linux), all application software installed on the instance, security group and NACL configuration, data stored on the instance and EBS volumes, encryption configuration, IAM roles and instance profiles, and firewall rules.

A common exam scenario: if an EC2 instance is compromised because the customer did not patch a Linux kernel vulnerability, that is the customer's responsibility. AWS does not patch your EC2 operating systems — that is explicitly on the customer's side of the line.`,
      quiz: [
        {
          question:
            "A company's EC2 instance was compromised because the Linux operating system had an unpatched vulnerability. Who is responsible for this security failure?",
          options: [
            "AWS, because they manage the EC2 service and its security",
            "The customer, because patching EC2 guest operating systems is the customer's responsibility",
            "Both AWS and the customer share equal responsibility for OS patching",
            "The customer's internet service provider, because the exploit came from outside",
          ],
          correctIndex: 1,
          explanation:
            "Patching the guest operating system on EC2 instances is explicitly the customer's responsibility. AWS manages the underlying hypervisor and hardware, but the OS and everything above it belongs to the customer's side of the Shared Responsibility Model.",
        },
      ],
    },
    {
      heading: "Managed Services (PaaS and SaaS)",
      body: `For **managed services** like Amazon RDS, DynamoDB, Lambda, and S3, AWS takes on more responsibility because it manages more of the stack.

**For Amazon RDS**, AWS is responsible for: the EC2 infrastructure running the database engine, the operating system and database engine (including patching), database software installation, and automated backups. The customer is responsible for: what data they store, database user permissions (grants), encryption settings, security group rules controlling network access, and ensuring the database schema and queries are secure.

**For DynamoDB and S3** (fully managed services), AWS manages essentially everything below the data level: hardware, OS, service software, availability, and redundancy. The customer is responsible for: data itself, IAM policies controlling access, encryption configuration (client-side or server-side), S3 bucket policies, and ensuring Block Public Access is correctly configured.

**For Lambda**, AWS manages the compute infrastructure, the runtime environment, and automatic scaling. The customer is responsible for: the function code, the IAM execution role and its permissions, environment variables and secrets management, and the business logic that processes event data.

The general principle: the more managed a service is, the less infrastructure responsibility the customer has, but data and access control always remain the customer's responsibility.`,
      quiz: [
        {
          question:
            "When using Amazon RDS, which of the following is the customer's responsibility?",
          options: [
            "Patching the underlying database engine software",
            "Managing the EC2 instances that host the database",
            "Configuring database user permissions and controlling network access via security groups",
            "Ensuring the physical hardware running the database is fault-tolerant",
          ],
          correctIndex: 2,
          explanation:
            "For RDS, AWS handles the underlying EC2 infrastructure, OS, and database engine patching. The customer is responsible for database user permissions (grants), encryption settings, security group rules controlling access, and the data itself.",
        },
        {
          question:
            "For AWS Lambda, what does the customer remain responsible for?",
          options: [
            "Patching the Lambda runtime environment and underlying compute infrastructure",
            "Managing the server capacity and scaling configuration for Lambda functions",
            "The function code, the IAM execution role permissions, and secrets management",
            "Installing and configuring the operating system that runs Lambda functions",
          ],
          correctIndex: 2,
          explanation:
            "AWS manages the Lambda compute infrastructure, runtime, and auto-scaling. The customer is responsible for the function code, the IAM execution role and its permissions, environment variables and secrets, and the business logic.",
        },
      ],
    },
    {
      heading: "Inherited Controls and Shared Controls",
      body: `The shared responsibility model can be further divided into three categories of controls.

**AWS Inherited Controls** are controls that customers fully inherit from AWS. Customers do not need to implement or verify these. Examples include physical and environmental controls (data center security, temperature, fire suppression), hardware lifecycle management, and the security of the AWS global network.

**Shared Controls** are responsibilities that apply to both the infrastructure layer and the customer layer, but in separate contexts. **Patch management** is shared: AWS patches the infrastructure, hypervisors, and managed service software; customers patch their EC2 operating systems and application dependencies. **Configuration management** is shared: AWS configures the infrastructure; customers configure their resources, security groups, and IAM policies. **Awareness and training** is shared: AWS trains its employees; customers train their own employees.

**Customer Specific Controls** are entirely the customer's responsibility, such as data encryption (choosing to encrypt at rest and in transit), data integrity authentication, and defining the acceptable use policies for their applications.`,
      quiz: [
        {
          question:
            "Which of the following is an example of a 'Shared Control' in the AWS Shared Responsibility Model?",
          options: [
            "Physical data center security — AWS owns it entirely",
            "Data encryption — the customer configures it entirely",
            "Patch management — AWS patches infrastructure while customers patch their EC2 OS and apps",
            "IAM user configuration — the customer owns it entirely",
          ],
          correctIndex: 2,
          explanation:
            "Patch management is a shared control: AWS patches the underlying infrastructure, hypervisors, and managed service software, while customers are responsible for patching their EC2 guest operating systems and application dependencies.",
        },
      ],
    },
    {
      heading: "Practical Implications",
      body: `Understanding the Shared Responsibility Model has direct practical implications for how you secure your AWS workloads.

You must **patch your EC2 operating systems**. AWS does not do this. Use AWS Systems Manager Patch Manager to automate patching across your EC2 fleet. For managed services like RDS, AWS handles patching, but you must schedule the maintenance window appropriately.

You are responsible for **configuring security groups correctly**. An overly permissive security group (allowing SSH from 0.0.0.0/0) is entirely the customer's fault and responsibility to fix. Trusted Advisor's security checks help identify these misconfigurations.

**Encryption is the customer's choice**. AWS provides the tools (KMS, server-side encryption, TLS) but enabling them is the customer's responsibility. Encrypting data at rest and in transit is a customer obligation under most compliance frameworks.

**IAM is entirely the customer's domain**. Creating root account access keys, not enabling MFA, or granting overly broad IAM permissions are all customer mistakes. AWS provides the tools and best practice guidance, but the customer controls IAM configuration.

For the exam, the most tested concept is: **AWS secures the physical infrastructure and hardware; customers secure their data, OS, network configuration, and IAM.** When in doubt, ask "is this the cloud infrastructure itself, or is it what runs on top?"`,
      quiz: [
        {
          question:
            "A security audit finds that an S3 bucket has a misconfigured bucket policy allowing unintended public access. According to the Shared Responsibility Model, who is responsible for fixing this?",
          options: [
            "AWS, because they are responsible for S3 service security",
            "The customer, because IAM policies and bucket policies are the customer's responsibility",
            "Both AWS and the customer share equal responsibility for bucket policy configuration",
            "AWS's Trusted Advisor team, which automatically fixes security misconfigurations",
          ],
          correctIndex: 1,
          explanation:
            "Bucket policies and access configurations are entirely the customer's responsibility. AWS provides the tools (S3, KMS, Block Public Access) but configuring them correctly falls on the customer's side of the Shared Responsibility Model.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "According to the Shared Responsibility Model, which of the following is always the customer's responsibility regardless of which AWS service is used?",
      options: [
        "Patching the underlying operating system",
        "Physical security of the servers",
        "Customer data and access control (IAM)",
        "Availability zone infrastructure maintenance",
      ],
      correctIndex: 2,
      explanation:
        "Customer data and access control (IAM) are always the customer's responsibility regardless of the service. Even for fully managed services like DynamoDB and S3, the customer controls their data and who can access it.",
    },
    {
      question:
        "Which category of controls in the Shared Responsibility Model includes physical data center security and hardware lifecycle management?",
      options: [
        "Shared controls — both AWS and the customer handle these together",
        "Customer specific controls — the customer handles these entirely",
        "AWS inherited controls — the customer fully inherits these from AWS",
        "Compliance controls — managed by third-party auditors",
      ],
      correctIndex: 2,
      explanation:
        "AWS inherited controls are controls customers fully inherit from AWS without needing to implement or verify them. Physical and environmental controls such as data center security, temperature management, and hardware lifecycle are AWS inherited controls.",
    },
    {
      question:
        "A company uses Amazon RDS for their database. Which of the following is AWS responsible for?",
      options: [
        "Defining database user permissions and roles",
        "Encrypting the data stored in the database",
        "Patching the underlying database engine software",
        "Configuring security groups to control network access to the database",
      ],
      correctIndex: 2,
      explanation:
        "For RDS, AWS is responsible for patching the underlying database engine software, the OS, and the EC2 infrastructure. The customer is responsible for database user permissions, encryption configuration, security group rules, and the data itself.",
    },
    {
      question:
        "A customer enables AWS KMS encryption on their S3 bucket. According to the Shared Responsibility Model, whose responsibility was it to enable this encryption?",
      options: [
        "AWS's responsibility — encryption should be automatic for all services",
        "The customer's responsibility — enabling encryption tools is a customer obligation",
        "A shared responsibility where AWS enables the tool and the customer pays for it",
        "A compliance team's responsibility under PCI DSS regulations",
      ],
      correctIndex: 1,
      explanation:
        "While AWS provides encryption tools like KMS, enabling encryption is the customer's responsibility. Choosing to encrypt data at rest and in transit is a customer-specific control and is required under most compliance frameworks.",
    },
    {
      question:
        "For which AWS service does the customer bear the MOST security responsibility?",
      options: [
        "Amazon DynamoDB — a fully managed NoSQL database",
        "AWS Lambda — a serverless compute service",
        "Amazon EC2 — an infrastructure service where the customer controls the OS",
        "Amazon S3 — a fully managed object storage service",
      ],
      correctIndex: 2,
      explanation:
        "EC2 is an infrastructure (IaaS) service where the customer controls the guest operating system and everything above it. This gives the customer the most responsibility — they must patch the OS, manage application software, configure security groups, and handle encryption.",
    },
    {
      question:
        "Which of the following is an example of a 'Customer Specific Control' under the Shared Responsibility Model?",
      options: [
        "Patching the AWS hypervisor",
        "Maintaining the physical security of AWS data centers",
        "Training AWS staff on security procedures",
        "Choosing to encrypt data at rest and defining acceptable use policies for applications",
      ],
      correctIndex: 3,
      explanation:
        "Customer specific controls are entirely the customer's responsibility. Choosing to encrypt data at rest and in transit, data integrity authentication, and defining acceptable use policies for their applications are all customer specific controls.",
    },
    {
      question:
        "A company is evaluating whether to use EC2 or RDS for their database. From a Shared Responsibility perspective, what is a key difference?",
      options: [
        "EC2 requires no OS patching; RDS requires patching the database engine",
        "With EC2 the customer patches the OS; with RDS, AWS patches the database engine and OS",
        "Both EC2 and RDS require the customer to patch the OS",
        "With RDS the customer patches the OS; with EC2, AWS manages the OS automatically",
      ],
      correctIndex: 1,
      explanation:
        "With EC2, the customer is responsible for patching the guest OS and any database software installed. With RDS (a managed service), AWS is responsible for patching the database engine and OS. The customer's responsibility is reduced to data, permissions, and network configuration.",
    },
    {
      question:
        "Under the Shared Responsibility Model, what is the customer responsible for when using AWS Lambda?",
      options: [
        "Managing the underlying server infrastructure and auto-scaling configuration",
        "Patching the Lambda runtime environment when security updates are released",
        "The function code, the IAM execution role permissions, and environment variable security",
        "Ensuring the physical hardware running Lambda functions is properly maintained",
      ],
      correctIndex: 2,
      explanation:
        "AWS manages the Lambda compute infrastructure, runtime, and scaling. The customer is responsible for the function code, the IAM execution role and its permissions, environment variables and any secrets stored in them, and the business logic.",
    },
  ],
};
