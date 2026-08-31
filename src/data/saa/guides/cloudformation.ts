import { ServiceGuide } from "../../../types/guide";

export const cloudformationGuide: ServiceGuide = {
  id: "saa-cloudformation",
  service: "AWS CloudFormation",
  domain: "deployment",
  tagline:
    "Infrastructure as Code for provisioning and managing AWS resources declaratively",
  intro:
    "AWS CloudFormation lets you model, provision, and manage your entire AWS infrastructure using declarative templates, enabling repeatable, version-controlled, and auditable infrastructure deployments across environments and accounts without manual configuration.",

  sections: [
    {
      heading: "Templates, Stacks, and Change Sets",
      body: `A CloudFormation template is a JSON or YAML document that declares the AWS resources to create, their configurations, and the relationships between them. CloudFormation reads the template and creates or updates a stack — a collection of AWS resources managed as a single unit. When you need to update a stack, creating a change set first previews exactly what resources will be added, modified, or replaced before any changes are applied, preventing unintended resource replacements (which cause data loss for stateful resources like RDS instances or S3 buckets). CloudFormation's dependency graph automatically determines the creation order — if a security group must exist before an EC2 instance, CloudFormation creates them in the correct order. You can also declare explicit dependencies using the \`DependsOn\` attribute for cases where implicit dependency detection is insufficient, such as waiting for an RDS instance to be available before configuring an application that connects to it.`,
      quiz: [
        {
          question:
            "Before updating a production CloudFormation stack that contains an RDS instance, what should you do to preview whether the update will replace the database?",
          options: [
            "Create a change set to preview additions, modifications, and replacements before applying",
            "Set the DependsOn attribute on the RDS resource",
            "Apply the update and inspect CloudTrail logs afterward",
            "Enable stack drift detection",
          ],
          correctIndex: 0,
          explanation:
            "Change sets preview exactly what CloudFormation will add, modify, or replace before any changes are applied. Replacement of a stateful resource like an RDS instance can cause data loss, so reviewing a change set is critical before updating production stacks.",
        },
        {
          question:
            "CloudFormation automatically determines resource creation order using its dependency graph. When is the DependsOn attribute necessary?",
          options: [
            "Only when creating resources in different Availability Zones",
            "When a resource must be created before an IAM role",
            "When an implicit dependency cannot be detected, such as waiting for an RDS instance to finish initializing before configuring the application",
            "Whenever two resources are in the same template",
          ],
          correctIndex: 2,
          explanation:
            "CloudFormation detects implicit dependencies through property references (e.g., Ref, Fn::GetAtt). DependsOn is needed when ordering is required but no property reference exists — for example, waiting for an RDS instance to be fully available before running an initialization script.",
        },
        {
          question: "What is a CloudFormation stack?",
          options: [
            "A JSON/YAML document that declares AWS resources",
            "A collection of AWS resources created and managed as a single unit from a template",
            "A multi-region deployment of the same template",
            "A set of IAM permissions that CloudFormation uses to create resources",
          ],
          correctIndex: 1,
          explanation:
            "A stack is the deployed instance of a template — the collection of AWS resources CloudFormation creates, updates, and deletes as a unit. The template is the blueprint; the stack is the result.",
        },
      ],
    },
    {
      heading: "Parameters, Mappings, and Conditions",
      body: `CloudFormation templates support dynamic configuration through parameters, mappings, and conditions that make a single template reusable across environments. Parameters allow callers to provide input values at stack creation or update time — instance types, AMI IDs, environment names, and database passwords. AWS Systems Manager Parameter Store integration allows parameters to reference SSM parameters dynamically, keeping sensitive values out of templates entirely. Mappings are static lookup tables embedded in the template — for example, mapping region names to AMI IDs for a region-specific AMI selection. Conditions evaluate boolean expressions based on parameter values and control whether specific resources and outputs are created — a \`CreateProdResources\` condition can gate the creation of expensive resources like Multi-AZ RDS instances to production deployments only. Together, parameters, mappings, and conditions enable a single template to deploy correctly across development, staging, and production with environment-appropriate configurations.`,
      quiz: [
        {
          question:
            "A team wants a single CloudFormation template that creates a Multi-AZ RDS instance only in the production environment, not dev or staging. Which template feature enables this?",
          options: [
            "Parameters with default values",
            "Conditions",
            "Nested stacks",
            "Mappings",
          ],
          correctIndex: 1,
          explanation:
            "Conditions evaluate boolean expressions based on parameter values and gate the creation of specific resources. A condition like CreateProdResources can be evaluated from an Environment parameter, and resources can reference that condition to be created only when it is true.",
        },
        {
          question:
            "What is the difference between Parameters and Mappings in a CloudFormation template?",
          options: [
            "Parameters accept caller-supplied values at deploy time; Mappings are static lookup tables embedded in the template",
            "Parameters are evaluated at runtime; Mappings are evaluated during stack rollback",
            "Parameters store secrets; Mappings store plaintext configuration",
            "Parameters are YAML-only; Mappings support JSON only",
          ],
          correctIndex: 0,
          explanation:
            "Parameters are dynamic — callers supply them when creating or updating a stack. Mappings are static key-value tables in the template itself, commonly used for region-to-AMI mappings or environment-to-configuration lookups.",
        },
        {
          question:
            "How does integrating CloudFormation Parameters with SSM Parameter Store improve security?",
          options: [
            "It enables automatic rotation of CloudFormation stack parameters",
            "It encrypts the CloudFormation template at rest",
            "It prevents unauthorized users from viewing parameter values in the AWS console",
            "It keeps sensitive values like passwords out of templates by referencing SSM parameters dynamically at deploy time",
          ],
          correctIndex: 3,
          explanation:
            "When parameters reference SSM Parameter Store values, the actual secrets never appear in the template source. CloudFormation fetches the current SSM value at deployment time, ensuring sensitive data is managed in SSM with its own access controls and audit trail.",
        },
      ],
    },
    {
      heading: "Nested Stacks and Stack Sets",
      body: `As infrastructure grows, monolithic templates become difficult to manage. Nested stacks decompose large templates into a hierarchy of reusable component templates — a root stack creates child stacks using the \`AWS::CloudFormation::Stack\` resource type, passing outputs from one nested stack as inputs to another. This enables reusable infrastructure modules: a networking template that creates VPC, subnets, and security groups can be shared across multiple application stacks. Stack Sets extend CloudFormation to deploy a single template to multiple AWS accounts and regions simultaneously, managed from a central administrator account. Stack Sets are the primary mechanism for deploying baseline security controls, logging configurations, and guardrails across all accounts in an AWS Organization. With service-managed permissions, Stack Sets automatically deploy to new accounts added to an organizational unit without any manual action.`,
      quiz: [
        {
          question:
            "A company wants to enforce a standard VPC architecture across 50 AWS accounts in its organization. New accounts should automatically receive the VPC configuration. Which CloudFormation feature enables this?",
          options: [
            "Change sets deployed by CodePipeline",
            "CloudFormation Macros",
            "Stack Sets with service-managed permissions",
            "Nested stacks with the AWS::CloudFormation::Stack resource",
          ],
          correctIndex: 2,
          explanation:
            "Stack Sets with service-managed permissions deploy a template to multiple accounts and regions from a central administrator account and automatically apply to new accounts added to an organizational unit — no manual action required per account.",
        },
        {
          question: "What is the primary benefit of using nested stacks?",
          options: [
            "They decompose large templates into reusable component modules that can be shared across application stacks",
            "They allow rollback to be disabled for individual resource groups",
            "They provide automatic drift detection on all child resources",
            "They enable multi-region deployment from a single template",
          ],
          correctIndex: 0,
          explanation:
            "Nested stacks break monolithic templates into reusable modules. A networking template (VPC, subnets, security groups) can be used as a child stack by multiple root stacks, avoiding duplication and promoting consistency.",
        },
        {
          question: "How does a root stack pass data to a nested stack?",
          options: [
            "Via SSM Parameter Store keys shared by both stacks",
            "By passing outputs from one nested stack as parameter inputs to another",
            "Through shared S3 bucket references in each template",
            "Using CloudFormation cross-stack references with Fn::ImportValue",
          ],
          correctIndex: 1,
          explanation:
            "In a nested stack hierarchy, the root stack can retrieve an output from one child stack (e.g., a VPC ID) and pass it as an input parameter to another child stack. This wires components together without hard-coding resource identifiers.",
        },
      ],
    },
    {
      heading: "Rollback Behavior and Stack Policies",
      body: `CloudFormation provides automatic rollback on failure: if any resource creation or update fails during a stack operation, CloudFormation rolls back all changes made in that operation, returning the stack to its last known stable state. Rollback can be disabled (for debugging purposes) using the \`--disable-rollback\` flag, allowing you to inspect the partial stack and understand why the failure occurred. Stack policies are JSON documents that control which resources in a stack can be updated or replaced after initial creation — attaching a stack policy with a Deny action on critical resources like production databases prevents accidental updates from CloudFormation operations. For updates to protected resources, you temporarily override the stack policy for that specific update. Drift detection identifies resources whose actual configuration has diverged from the template definition due to manual out-of-band changes, helping maintain configuration consistency and enabling remediation by re-applying the template.`,
      quiz: [
        {
          question:
            "What happens by default when a resource creation fails during a CloudFormation stack operation?",
          options: [
            "CloudFormation skips the failed resource and continues creating remaining resources",
            "CloudFormation pauses and sends an SNS notification for manual intervention",
            "CloudFormation marks the stack as UPDATE_FAILED and retains all partially created resources",
            "CloudFormation rolls back all changes made in that operation, returning the stack to its last stable state",
          ],
          correctIndex: 3,
          explanation:
            "CloudFormation automatically rolls back all changes from a failed operation, restoring the stack to its last known stable state. This prevents partial deployments that leave infrastructure in an inconsistent state.",
        },
        {
          question:
            "A stack policy has a Deny action on the production RDS instance. A developer needs to resize the database. What must happen first?",
          options: [
            "Temporarily override the stack policy for that specific update operation",
            "Disable rollback so the update can proceed without policy evaluation",
            "The update is permanently blocked and cannot be performed",
            "Delete the stack policy and recreate it after the update",
          ],
          correctIndex: 0,
          explanation:
            "Stack policies can be temporarily overridden for a specific update operation without permanently modifying or deleting the policy. After the update completes, the original policy remains in effect.",
        },
        {
          question:
            "A CloudFormation stack's EC2 instance was manually modified in the console (a security group rule was added). Which feature identifies this divergence?",
          options: [
            "Drift detection",
            "Stack rollback",
            "CloudTrail",
            "Change sets",
          ],
          correctIndex: 0,
          explanation:
            "Drift detection compares the actual configuration of stack resources against the expected configuration defined in the template, identifying any resources that have been modified outside of CloudFormation.",
        },
      ],
    },
    {
      heading: "Custom Resources and CloudFormation Macros",
      body: `Custom Resources allow CloudFormation to manage resources not natively supported by CloudFormation or to execute arbitrary logic during stack operations. A Custom Resource calls a Lambda function or SNS topic during Create, Update, or Delete stack operations, enabling provisioning of third-party services, configuring resources that lack CloudFormation support, or running data initialization scripts. The Lambda function receives event data including the operation type and any properties defined in the template, performs the necessary action, and signals success or failure back to CloudFormation via a pre-signed S3 URL. CloudFormation Macros allow you to define template transformations processed by a Lambda function before CloudFormation evaluates the template — enabling custom DSLs, looping constructs, and dynamic template generation. The \`AWS::Serverless\` transform (SAM) is a built-in macro that transforms simplified serverless resource declarations into standard CloudFormation resources, making Lambda and API Gateway deployment dramatically simpler.`,
      quiz: [
        {
          question:
            "A team needs CloudFormation to provision a third-party SaaS resource that has no native CloudFormation resource type. Which feature enables this?",
          options: [
            "Nested stacks referencing an external template",
            "CloudFormation Macros",
            "Stack Sets with service-managed permissions",
            "Custom Resources backed by a Lambda function",
          ],
          correctIndex: 3,
          explanation:
            "Custom Resources invoke a Lambda function (or SNS topic) during Create, Update, or Delete operations. The Lambda function performs the provisioning action against the third-party API and signals success or failure back to CloudFormation.",
        },
        {
          question:
            "What does the AWS::Serverless transform do in a CloudFormation template?",
          options: [
            "It is a built-in CloudFormation Macro that transforms simplified SAM resource declarations into standard CloudFormation resources",
            "It deploys the template to multiple AWS accounts simultaneously",
            "It enables rollback protection for Lambda and API Gateway resources",
            "It generates change sets automatically before every stack update",
          ],
          correctIndex: 0,
          explanation:
            "The AWS::Serverless transform (SAM) is a built-in CloudFormation Macro. Templates that declare it are pre-processed by SAM, which expands simplified serverless declarations into the equivalent standard CloudFormation resource definitions.",
        },
        {
          question:
            "How does a Custom Resource Lambda function signal success or failure back to CloudFormation?",
          options: [
            "By sending an HTTP PUT response to a pre-signed S3 URL provided in the event",
            "By returning a specific exit code from the Lambda handler",
            "By writing a success marker to a DynamoDB table",
            "By publishing a message to the stack's SNS topic",
          ],
          correctIndex: 0,
          explanation:
            "CloudFormation provides a pre-signed S3 URL in the Custom Resource event. The Lambda function must PUT a JSON response to that URL indicating SUCCESS or FAILED. If no response is received within the timeout, CloudFormation treats the operation as failed.",
        },
      ],
    },
    {
      heading: "CloudFormation and CI/CD Integration",
      body: `CloudFormation integrates with CI/CD pipelines to provide infrastructure-as-code deployment alongside application code. AWS CodePipeline has a native CloudFormation deployment action that creates, updates, or deletes stacks as a pipeline stage — enabling infrastructure changes to go through the same review, approval, and testing process as application code. CloudFormation StackSets combined with AWS Organizations enable automatic baseline infrastructure deployment (logging, security tooling, network baselines) to new accounts as they are added to the organization. The AWS CDK (Cloud Development Kit) is a higher-level abstraction that generates CloudFormation templates from code written in TypeScript, Python, Java, or C# — it provides constructs that encode architectural patterns and AWS best practices, making complex infrastructure expressible in familiar programming languages while retaining CloudFormation as the deployment engine.`,
      quiz: [
        {
          question:
            "A team wants infrastructure changes to go through the same approval pipeline as application code deployments. Which integration achieves this?",
          options: [
            "AWS Config rules that auto-remediate stack drift",
            "AWS CodePipeline with a native CloudFormation deployment action as a pipeline stage",
            "CloudFormation Stack Sets with automatic deployment to all accounts",
            "AWS CDK bootstrapping with a CI/CD construct",
          ],
          correctIndex: 1,
          explanation:
            "CodePipeline has a native CloudFormation action that creates, updates, or deletes stacks as a pipeline stage. This lets infrastructure changes go through the same source control, review, approval, and testing stages as application code.",
        },
        {
          question:
            "What is the relationship between the AWS CDK and CloudFormation?",
          options: [
            "CDK deploys resources directly via AWS APIs without using CloudFormation stacks",
            "CDK is a visual designer that produces CloudFormation templates without writing code",
            "CDK generates CloudFormation templates from code written in programming languages like TypeScript or Python, retaining CloudFormation as the deployment engine",
            "CDK is a replacement for CloudFormation that uses a different deployment engine",
          ],
          correctIndex: 2,
          explanation:
            "The AWS CDK is a higher-level abstraction that synthesizes CloudFormation templates from code written in familiar programming languages. CloudFormation remains the actual deployment engine — CDK just makes writing complex infrastructure more expressive.",
        },
        {
          question:
            "A company adds new AWS accounts to its organization regularly and wants each account to automatically receive baseline logging and security configuration. Which combination achieves this?",
          options: [
            "CloudFormation nested stacks with DependsOn ordering",
            "CloudFormation Stack Sets with service-managed permissions and AWS Organizations",
            "AWS Config rules with auto-remediation Lambda functions",
            "CodePipeline with a CloudFormation deploy action targeting all accounts",
          ],
          correctIndex: 1,
          explanation:
            "Stack Sets with service-managed permissions automatically deploy to new accounts as they are added to an organizational unit, with no manual action required per account. This is the canonical baseline infrastructure deployment pattern across an organization.",
        },
      ],
    },
  ],

  keyFacts: [
    "CloudFormation templates are declarative JSON/YAML documents; stacks are deployed instances",
    "Change sets preview resource additions, modifications, and replacements before applying",
    "DependsOn declares explicit resource creation order when implicit detection is insufficient",
    "Parameters allow runtime input; Mappings are static lookup tables; Conditions gate resource creation",
    "Nested stacks decompose large templates into reusable hierarchical components",
    "Stack Sets deploy one template to multiple accounts and regions from a central account",
    "Automatic rollback reverts all changes if any resource operation fails",
    "Stack policies prevent specific resources from being updated or replaced",
    "Drift detection identifies resources manually changed outside CloudFormation",
    "Custom Resources use Lambda to manage unsupported resources or run arbitrary logic",
  ],

  relatedServices: [
    "AWS CDK",
    "AWS CodePipeline",
    "AWS Organizations",
    "AWS Systems Manager",
    "AWS Lambda",
    "AWS Config",
  ],

  topicQuiz: [
    {
      question:
        "What is the safest way to update a production CloudFormation stack to avoid unintended resource replacements?",
      options: [
        "Disable rollback so you can inspect any failures",
        "Apply the update directly and review CloudTrail logs afterward",
        "Enable drift detection before updating",
        "Create a change set first to preview all additions, modifications, and replacements",
      ],
      correctIndex: 3,
      explanation:
        "Change sets preview every resource action before any change is applied. This is the critical safety step for production stacks, especially since replacements of stateful resources like RDS can cause data loss.",
    },
    {
      question:
        "Which CloudFormation feature allows a single template to deploy a Multi-AZ RDS instance in production but skip it in dev?",
      options: [
        "Conditions",
        "Mappings",
        "DependsOn",
        "Parameters with allowed values",
      ],
      correctIndex: 0,
      explanation:
        "Conditions evaluate boolean expressions based on parameter values and gate resource creation. A CreateProdResources condition tied to an Environment parameter can ensure the Multi-AZ RDS is only created when the environment is prod.",
    },
    {
      question:
        "A company needs to deploy the same security baseline template to 30 AWS accounts across 3 regions. New accounts should be covered automatically. Which feature handles this?",
      options: [
        "CodePipeline with a CloudFormation deploy action",
        "CloudFormation Macros",
        "Nested stacks with cross-stack references",
        "Stack Sets with service-managed permissions",
      ],
      correctIndex: 3,
      explanation:
        "Stack Sets with service-managed permissions deploy to multiple accounts and regions from one central template and automatically cover new accounts added to an organizational unit — no manual per-account setup required.",
    },
    {
      question:
        "CloudFormation needs to provision a resource type that has no native CloudFormation support. Which feature enables this?",
      options: [
        "CloudFormation Macros",
        "Stack policies",
        "Custom Resources backed by Lambda or SNS",
        "Nested stacks",
      ],
      correctIndex: 2,
      explanation:
        "Custom Resources invoke a Lambda function or SNS topic during stack operations to provision and manage resources that CloudFormation does not natively support, including third-party APIs and arbitrary automation logic.",
    },
    {
      question:
        "A stack's RDS instance was manually modified outside of CloudFormation. Which feature identifies this configuration drift?",
      options: [
        "Change sets",
        "Drift detection",
        "Stack policies",
        "CloudFormation rollback",
      ],
      correctIndex: 1,
      explanation:
        "Drift detection compares the actual configuration of each stack resource against the expected state defined in the template, flagging any resources that were changed outside of CloudFormation.",
    },
    {
      question:
        "The AWS CDK synthesizes outputs that are deployed by which service?",
      options: [
        "AWS CloudFormation",
        "AWS Elastic Beanstalk",
        "AWS CodeDeploy",
        "AWS Systems Manager",
      ],
      correctIndex: 0,
      explanation:
        "The AWS CDK generates CloudFormation templates from code written in TypeScript, Python, Java, or C#. CloudFormation is still the deployment engine — CDK is a higher-level abstraction on top of it.",
    },
    {
      question:
        "What does the AWS::Serverless transform declaration in a CloudFormation template do?",
      options: [
        "It instructs CloudFormation to pre-process the template using the SAM Macro, expanding simplified serverless declarations",
        "It invokes a Lambda function to validate the template before deployment",
        "It deploys the stack to a serverless compute environment",
        "It enables automatic rollback of Lambda and API Gateway resources",
      ],
      correctIndex: 0,
      explanation:
        "The AWS::Serverless transform is a built-in CloudFormation Macro (SAM). When declared, it pre-processes the template and expands simplified SAM resource types (AWS::Serverless::Function, etc.) into their equivalent standard CloudFormation resources.",
    },
    {
      question:
        "A stack policy has a Deny on an RDS instance. An authorized update to the database is needed. What is the correct approach?",
      options: [
        "Use a change set to bypass the stack policy",
        "Delete the stack policy, perform the update, then recreate the policy",
        "Disable rollback and apply the update directly",
        "Temporarily override the stack policy for that specific update operation",
      ],
      correctIndex: 3,
      explanation:
        "Stack policies support a temporary override for a specific update operation without permanently modifying the policy. This is the intended mechanism for performing authorized updates to protected resources.",
    },
  ],

  examTips: [
    "Always create a change set before updating a production stack — prevents surprise resource replacements",
    "Stack Sets + service-managed permissions auto-deploys to new org accounts without manual setup",
    "Custom Resources are the answer for managing non-AWS resources or running scripts during deployment",
    "Drift detection finds manual changes — remediate by updating the stack to re-apply the template",
    "Parameters + SSM integration keeps secrets out of templates (reference SSM SecureString parameters)",
    "Conditions enable a single template to work across dev/staging/prod with different resource configurations",
    "The SAM transform (\`AWS::Serverless\`) is a CloudFormation macro — templates using it must declare the transform",
    "Rollback can be disabled for debugging, but never in production automation pipelines",
  ],
};
