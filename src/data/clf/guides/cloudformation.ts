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
      quiz: [
        {
          question:
            "What is Infrastructure as Code (IaC) in the context of AWS CloudFormation?",
          options: [
            "Writing application code that runs on AWS Lambda",
            "Managing and provisioning cloud infrastructure through machine-readable definition files",
            "Monitoring AWS infrastructure using CloudWatch dashboards",
            "Manually configuring AWS resources through the console",
          ],
          correctIndex: 1,
          explanation:
            "IaC is the practice of managing infrastructure through definition files (like CloudFormation templates) rather than manual processes. This enables repeatability, version control, and automation.",
        },
        {
          question: "How much does AWS CloudFormation itself cost to use?",
          options: [
            "A flat monthly fee based on the number of stacks",
            "Per-resource charge for each item it creates",
            "Nothing — CloudFormation is free; you pay only for the resources it creates",
            "A percentage of the total cost of resources it manages",
          ],
          correctIndex: 2,
          explanation:
            "CloudFormation itself is free. You pay only for the underlying AWS resources (EC2, S3, RDS, etc.) that CloudFormation creates on your behalf.",
        },
        {
          question:
            "Which benefit of Infrastructure as Code ensures that dev, staging, and production environments have identical configurations?",
          options: [
            "Version control",
            "Repeatability",
            "Automation",
            "Cost optimization",
          ],
          correctIndex: 1,
          explanation:
            "Repeatability means the same CloudFormation template produces identical environments every time it is deployed, eliminating configuration drift between environments.",
        },
      ],
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
      quiz: [
        {
          question:
            "What is the only required section in a CloudFormation template?",
          options: ["Parameters", "Outputs", "Resources", "Conditions"],
          correctIndex: 2,
          explanation:
            "The Resources section is the only required section in a CloudFormation template. It defines the AWS resources to create and their configuration. All other sections (Parameters, Outputs, Mappings, Conditions) are optional.",
        },
        {
          question: "What happens when you delete a CloudFormation stack?",
          options: [
            "The stack is archived but resources remain running",
            "Only the template is deleted; resources continue to exist",
            "All AWS resources created by the stack are deleted simultaneously",
            "You must manually delete each resource before deleting the stack",
          ],
          correctIndex: 2,
          explanation:
            "Deleting a CloudFormation stack removes all the AWS resources that were created from that template simultaneously. This makes it easy to tear down entire environments cleanly.",
        },
        {
          question:
            "What CloudFormation template section allows you to pass in values like instance type or environment name when creating the stack?",
          options: ["Outputs", "Mappings", "Conditions", "Parameters"],
          correctIndex: 3,
          explanation:
            "The Parameters section allows inputs to be supplied when creating or updating a stack, making templates reusable across different environments or configurations.",
        },
      ],
    },
    {
      heading: "Change Sets and Drift Detection",
      body: `CloudFormation provides safeguards to prevent accidental changes to production infrastructure.

A **Change Set** is a preview of the changes that would occur if you apply a template update to an existing stack. Before deploying, you create a change set, review it, and approve or reject it. This is especially valuable for understanding whether an update will cause resource replacement (which can mean downtime) or simple modification.

**Drift Detection** identifies resources whose configuration has diverged from the CloudFormation template — for example, if someone manually changed an EC2 security group through the Console without updating the template. Running drift detection shows you which resources drifted and what changed. This helps enforce the discipline of making all infrastructure changes through CloudFormation rather than manual console actions.`,
      quiz: [
        {
          question: "What is a CloudFormation Change Set used for?",
          options: [
            "Rolling back a failed stack deployment automatically",
            "Previewing the changes that would occur if a template update is applied to a stack",
            "Detecting resources that were manually changed outside CloudFormation",
            "Copying a stack to a different AWS region",
          ],
          correctIndex: 1,
          explanation:
            "A Change Set previews what would change if you apply a template update to an existing stack. You review the proposed changes and approve or reject them before any modifications occur, preventing unintended changes to production resources.",
        },
        {
          question:
            "A developer manually modified an EC2 security group through the AWS Console without updating the CloudFormation template. Which CloudFormation feature would identify this discrepancy?",
          options: [
            "Change Sets",
            "Rollback triggers",
            "Drift Detection",
            "Stack policies",
          ],
          correctIndex: 2,
          explanation:
            "Drift Detection identifies resources whose actual configuration has diverged from what the CloudFormation template specifies. It shows which resources drifted and what changed, helping enforce the practice of making all changes through CloudFormation.",
        },
      ],
    },
    {
      heading: "Nested Stacks and StackSets",
      body: `For large, complex infrastructure, CloudFormation provides tools to organize and reuse templates.

**Nested Stacks** allow one CloudFormation template to reference and deploy other templates. A common pattern is to create reusable "module" templates for your VPC network configuration, security groups, and IAM roles, then reference them from environment templates. This promotes reuse and keeps individual templates manageable.

**CloudFormation StackSets** extend stacks across multiple AWS accounts and multiple regions in a single operation. An administrator creates a StackSet and deploys it to target accounts and regions. This is powerful for governance — for example, deploying a standard security configuration or logging setup to hundreds of accounts in an AWS Organization simultaneously.

**Rollback** is automatic: if CloudFormation encounters an error during stack creation or update, it automatically rolls back all changes to the last known good state. This prevents partial deployments that leave infrastructure in an inconsistent state.`,
      quiz: [
        {
          question: "What is the purpose of CloudFormation StackSets?",
          options: [
            "To preview changes before applying a template update",
            "To deploy stacks across multiple AWS accounts and regions in a single operation",
            "To create reusable template modules referenced by other templates",
            "To detect configuration drift in existing resources",
          ],
          correctIndex: 1,
          explanation:
            "StackSets extend CloudFormation stacks across multiple AWS accounts and regions in a single operation. This is powerful for governance use cases like deploying standard security configurations to hundreds of accounts in an AWS Organization.",
        },
        {
          question:
            "What happens automatically if CloudFormation encounters an error during stack creation or update?",
          options: [
            "CloudFormation pauses and waits for manual intervention",
            "The deployment continues with a warning logged to CloudWatch",
            "CloudFormation rolls back all changes to the last known good state",
            "Only the failed resource is deleted; other changes remain",
          ],
          correctIndex: 2,
          explanation:
            "CloudFormation automatically rolls back all changes if it encounters an error during stack creation or update. This prevents partial deployments that leave infrastructure in an inconsistent state.",
        },
        {
          question:
            "What CloudFormation feature allows one template to reference and deploy other templates, promoting reuse?",
          options: [
            "StackSets",
            "Nested Stacks",
            "Change Sets",
            "Drift Detection",
          ],
          correctIndex: 1,
          explanation:
            "Nested Stacks allow one CloudFormation template to reference and deploy other templates. This is commonly used to create reusable module templates for VPC configurations, security groups, and IAM roles.",
        },
      ],
    },
    {
      heading: "CloudFormation vs. Other IaC Tools",
      body: `CloudFormation is AWS-native, but it is not the only IaC tool available. For the Cloud Practitioner exam, it helps to understand CloudFormation's position in the ecosystem.

**AWS CDK (Cloud Development Kit)** allows you to define cloud infrastructure using familiar programming languages (TypeScript, Python, Java, C#) instead of YAML or JSON. CDK synthesizes your code into CloudFormation templates, which are then deployed through the CloudFormation service. CDK is an abstraction on top of CloudFormation.

**Terraform** (by HashiCorp) is a popular open-source IaC tool that works with AWS and many other cloud providers. Unlike CloudFormation, Terraform is multi-cloud. Many organizations use Terraform for its flexibility across providers.

**AWS Elastic Beanstalk** and **AWS SAM (Serverless Application Model)** also use CloudFormation under the hood, abstracting away some of its complexity for specific use cases (web applications and serverless applications, respectively).

For the Cloud Practitioner exam, you should know that CloudFormation enables infrastructure as code on AWS, templates are YAML or JSON, stacks group related resources, and the service is free (you pay for the resources it creates, not CloudFormation itself).`,
      quiz: [
        {
          question:
            "AWS CDK (Cloud Development Kit) is best described as which of the following?",
          options: [
            "A replacement for CloudFormation that uses a different deployment engine",
            "An abstraction on top of CloudFormation that lets you define infrastructure in programming languages",
            "A multi-cloud IaC tool that competes with Terraform",
            "A tool for monitoring CloudFormation stack deployments",
          ],
          correctIndex: 1,
          explanation:
            "AWS CDK lets you define cloud infrastructure using familiar programming languages (TypeScript, Python, Java, C#). CDK synthesizes your code into CloudFormation templates, which are then deployed through CloudFormation. It is an abstraction layer on top of CloudFormation.",
        },
        {
          question:
            "Which IaC tool is known for being multi-cloud and works with AWS as well as other cloud providers?",
          options: ["AWS CDK", "AWS SAM", "Terraform", "AWS Elastic Beanstalk"],
          correctIndex: 2,
          explanation:
            "Terraform (by HashiCorp) is a popular open-source IaC tool that works with AWS and many other cloud providers. Unlike CloudFormation, which is AWS-native, Terraform's multi-cloud flexibility makes it popular for organizations using multiple cloud providers.",
        },
        {
          question:
            "Which AWS service uses CloudFormation under the hood to simplify deployments of serverless applications?",
          options: [
            "AWS CDK",
            "AWS SAM (Serverless Application Model)",
            "Terraform",
            "AWS Config",
          ],
          correctIndex: 1,
          explanation:
            "AWS SAM (Serverless Application Model) uses CloudFormation under the hood, abstracting away some of its complexity for serverless use cases. AWS Elastic Beanstalk also uses CloudFormation but for web applications.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A company wants to deploy identical infrastructure environments for development, staging, and production. Which AWS service is best suited for this?",
      options: [
        "AWS CodeDeploy",
        "Amazon CloudWatch",
        "AWS CloudFormation",
        "AWS Config",
      ],
      correctIndex: 2,
      explanation:
        "AWS CloudFormation enables Infrastructure as Code, allowing the same template to repeatedly create identical environments. This ensures dev, staging, and production all have the same configuration and eliminates manual configuration errors.",
    },
    {
      question: "What format are CloudFormation templates written in?",
      options: [
        "XML or CSV",
        "YAML or JSON",
        "Python or JavaScript",
        "HCL (HashiCorp Configuration Language)",
      ],
      correctIndex: 1,
      explanation:
        "CloudFormation templates are written in YAML or JSON. Both formats are supported and describe the desired AWS resources and their configurations.",
    },
    {
      question:
        "A team wants to update a production CloudFormation stack but wants to review exactly what will change before applying the update. Which feature should they use?",
      options: [
        "Drift Detection",
        "Stack policies",
        "Change Sets",
        "StackSets",
      ],
      correctIndex: 2,
      explanation:
        "Change Sets allow you to preview the changes that would occur if you apply a template update to an existing stack. You can review and approve or reject the changes before anything is modified in production.",
    },
    {
      question:
        "An organization needs to deploy a standard security configuration to 200 AWS accounts across 5 regions simultaneously. Which CloudFormation feature enables this?",
      options: ["Nested Stacks", "Change Sets", "Drift Detection", "StackSets"],
      correctIndex: 3,
      explanation:
        "CloudFormation StackSets extend stacks across multiple AWS accounts and regions in a single operation. This is ideal for governance tasks like deploying standard security configurations to all accounts in an AWS Organization.",
    },
    {
      question:
        "Which section of a CloudFormation template is the only required section?",
      options: ["Parameters", "Outputs", "Resources", "Conditions"],
      correctIndex: 2,
      explanation:
        "The Resources section is the only required section in a CloudFormation template. It defines the AWS resources to create. Parameters, Outputs, Mappings, and Conditions are all optional sections.",
    },
    {
      question:
        "What does CloudFormation do automatically if a stack creation or update fails partway through?",
      options: [
        "Leaves the partially created resources in place and sends an alert",
        "Rolls back all changes to the last known good state",
        "Pauses the deployment and waits for manual approval to continue",
        "Retries the entire operation three times before stopping",
      ],
      correctIndex: 1,
      explanation:
        "CloudFormation automatically rolls back all changes if it encounters an error during stack creation or update. This prevents partial deployments that leave infrastructure in an inconsistent or broken state.",
    },
    {
      question:
        "AWS CDK (Cloud Development Kit) differs from writing CloudFormation templates directly in which key way?",
      options: [
        "CDK deploys resources without using CloudFormation at all",
        "CDK only supports Python while CloudFormation supports all languages",
        "CDK lets you define infrastructure in familiar programming languages, which synthesizes into CloudFormation templates",
        "CDK is multi-cloud while CloudFormation is AWS-only",
      ],
      correctIndex: 2,
      explanation:
        "AWS CDK allows you to define cloud infrastructure using familiar programming languages (TypeScript, Python, Java, C#) instead of YAML or JSON. CDK then synthesizes the code into CloudFormation templates and deploys through CloudFormation.",
    },
    {
      question:
        "If an administrator manually changes an EC2 security group through the AWS Console without updating the CloudFormation template, what will CloudFormation's Drift Detection report?",
      options: [
        "No issues — manual changes are tracked automatically",
        "The resource is in a drifted state with the changes identified",
        "The stack is invalid and must be deleted and redeployed",
        "A Change Set is automatically created to reconcile the difference",
      ],
      correctIndex: 1,
      explanation:
        "Drift Detection identifies resources whose actual configuration has diverged from what the CloudFormation template specifies. It reports the resource as drifted and shows what changed, helping teams identify unauthorized manual changes.",
    },
  ],
};
