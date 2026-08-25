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
    },
    {
      heading: "Parameters, Mappings, and Conditions",
      body: `CloudFormation templates support dynamic configuration through parameters, mappings, and conditions that make a single template reusable across environments. Parameters allow callers to provide input values at stack creation or update time — instance types, AMI IDs, environment names, and database passwords. AWS Systems Manager Parameter Store integration allows parameters to reference SSM parameters dynamically, keeping sensitive values out of templates entirely. Mappings are static lookup tables embedded in the template — for example, mapping region names to AMI IDs for a region-specific AMI selection. Conditions evaluate boolean expressions based on parameter values and control whether specific resources and outputs are created — a \`CreateProdResources\` condition can gate the creation of expensive resources like Multi-AZ RDS instances to production deployments only. Together, parameters, mappings, and conditions enable a single template to deploy correctly across development, staging, and production with environment-appropriate configurations.`,
    },
    {
      heading: "Nested Stacks and Stack Sets",
      body: `As infrastructure grows, monolithic templates become difficult to manage. Nested stacks decompose large templates into a hierarchy of reusable component templates — a root stack creates child stacks using the \`AWS::CloudFormation::Stack\` resource type, passing outputs from one nested stack as inputs to another. This enables reusable infrastructure modules: a networking template that creates VPC, subnets, and security groups can be shared across multiple application stacks. Stack Sets extend CloudFormation to deploy a single template to multiple AWS accounts and regions simultaneously, managed from a central administrator account. Stack Sets are the primary mechanism for deploying baseline security controls, logging configurations, and guardrails across all accounts in an AWS Organization. With service-managed permissions, Stack Sets automatically deploy to new accounts added to an organizational unit without any manual action.`,
    },
    {
      heading: "Rollback Behavior and Stack Policies",
      body: `CloudFormation provides automatic rollback on failure: if any resource creation or update fails during a stack operation, CloudFormation rolls back all changes made in that operation, returning the stack to its last known stable state. Rollback can be disabled (for debugging purposes) using the \`--disable-rollback\` flag, allowing you to inspect the partial stack and understand why the failure occurred. Stack policies are JSON documents that control which resources in a stack can be updated or replaced after initial creation — attaching a stack policy with a Deny action on critical resources like production databases prevents accidental updates from CloudFormation operations. For updates to protected resources, you temporarily override the stack policy for that specific update. Drift detection identifies resources whose actual configuration has diverged from the template definition due to manual out-of-band changes, helping maintain configuration consistency and enabling remediation by re-applying the template.`,
    },
    {
      heading: "Custom Resources and CloudFormation Macros",
      body: `Custom Resources allow CloudFormation to manage resources not natively supported by CloudFormation or to execute arbitrary logic during stack operations. A Custom Resource calls a Lambda function or SNS topic during Create, Update, or Delete stack operations, enabling provisioning of third-party services, configuring resources that lack CloudFormation support, or running data initialization scripts. The Lambda function receives event data including the operation type and any properties defined in the template, performs the necessary action, and signals success or failure back to CloudFormation via a pre-signed S3 URL. CloudFormation Macros allow you to define template transformations processed by a Lambda function before CloudFormation evaluates the template — enabling custom DSLs, looping constructs, and dynamic template generation. The \`AWS::Serverless\` transform (SAM) is a built-in macro that transforms simplified serverless resource declarations into standard CloudFormation resources, making Lambda and API Gateway deployment dramatically simpler.`,
    },
    {
      heading: "CloudFormation and CI/CD Integration",
      body: `CloudFormation integrates with CI/CD pipelines to provide infrastructure-as-code deployment alongside application code. AWS CodePipeline has a native CloudFormation deployment action that creates, updates, or deletes stacks as a pipeline stage — enabling infrastructure changes to go through the same review, approval, and testing process as application code. CloudFormation StackSets combined with AWS Organizations enable automatic baseline infrastructure deployment (logging, security tooling, network baselines) to new accounts as they are added to the organization. The AWS CDK (Cloud Development Kit) is a higher-level abstraction that generates CloudFormation templates from code written in TypeScript, Python, Java, or C# — it provides constructs that encode architectural patterns and AWS best practices, making complex infrastructure expressible in familiar programming languages while retaining CloudFormation as the deployment engine.`,
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
