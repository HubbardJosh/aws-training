import { ServiceGuide } from "../../../types/guide";

export const cloudformationGuide: ServiceGuide = {
  id: "aws-cloudformation",
  service: "AWS CloudFormation",
  domain: "deployment",
  tagline: "Infrastructure as code for AWS resources",
  intro:
    "CloudFormation provisions and manages AWS infrastructure using templates (JSON or YAML). You declare your desired resources — VPCs, EC2 instances, RDS databases, Lambda functions — and CloudFormation creates and updates them in the right order, handles dependencies, and rolls back on failure.",

  sections: [
    {
      heading: "Template Structure",
      body: `A CloudFormation template is a JSON or YAML document. Only the \`Resources\` section is required — everything else is optional. Here's a template that illustrates the main sections working together:

\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Description: My application stack

Parameters:
  Environment:
    Type: String
    Default: dev
    AllowedValues: [dev, staging, prod]

Mappings:
  RegionAMI:
    us-east-1:
      AMI: ami-0abcdef1234567890

Conditions:
  IsProd: !Equals [!Ref Environment, prod]

Resources:
  MyBucket:
    Type: AWS::S3::Bucket
    Properties:
      BucketName: !Sub "my-app-\${Environment}"
      VersioningConfiguration:
        Status: !If [IsProd, Enabled, Suspended]

Outputs:
  BucketName:
    Value: !Ref MyBucket
    Export:
      Name: !Sub "\${AWS::StackName}-BucketName"
\`\`\`

**Parameters** are runtime inputs that callers provide when creating or updating the stack. Types include String, Number, comma-delimited List, and AWS-specific types like \`AWS::EC2::KeyPair::KeyName\` (validated against your account) and \`AWS::SSM::Parameter::Value<String>\` (fetches the value live from SSM at deploy time). **Mappings** are static lookup tables — for example, AMI IDs per region — accessed with \`!FindInMap [MapName, Key1, Key2]\`. **Conditions** are boolean expressions built from parameter values; resources and properties can be conditionally created or set using \`!If\`. **Outputs** export values (like resource ARNs or endpoint URLs) for display after stack creation or for use by other stacks via cross-stack references.`,
      quiz: [
        {
          question:
            "Which section of a CloudFormation template is the only one that is required?",
          options: ["Mappings", "Resources", "Outputs", "Parameters"],
          correctIndex: 1,
          explanation:
            "Only the Resources section is required in a CloudFormation template. All other sections (Parameters, Mappings, Conditions, Outputs) are optional.",
        },
        {
          question:
            "Which CloudFormation parameter type fetches a live value from SSM Parameter Store at deploy time?",
          options: [
            "String",
            "CommaDelimitedList",
            "AWS::EC2::KeyPair::KeyName",
            "AWS::SSM::Parameter::Value<String>",
          ],
          correctIndex: 3,
          explanation:
            "AWS::SSM::Parameter::Value<String> fetches the current value from SSM Parameter Store at stack deploy time. This makes templates environment-aware without hardcoding values.",
        },
        {
          question:
            "What CloudFormation section holds static lookup tables (e.g., AMI IDs per region)?",
          options: ["Parameters", "Mappings", "Globals", "Conditions"],
          correctIndex: 1,
          explanation:
            "Mappings are static lookup tables accessed with !FindInMap [MapName, Key1, Key2]. They're commonly used for region-to-AMI mappings or environment-specific configuration that doesn't change at runtime.",
        },
      ],
    },
    {
      heading: "Intrinsic Functions & Pseudo-Parameters",
      body: `CloudFormation's intrinsic functions let you compute values at deploy time rather than hardcoding them. The most frequently used are \`!Ref\` (returns a resource's ID or a parameter's value), \`!Sub\` (performs string interpolation with \`\${Variable}\` syntax), and \`!GetAtt\` (retrieves a specific attribute from a resource, like \`!GetAtt MyBucket.Arn\`). Others include \`!Join\`, \`!Select\`, \`!If\`, \`!FindInMap\`, \`!ImportValue\` (for cross-stack references), \`!Split\`, \`!Base64\` (for EC2 UserData), and \`!Cidr\` (for generating CIDR blocks).

**Pseudo-parameters** are built-in values that CloudFormation resolves automatically — \`AWS::AccountId\`, \`AWS::Region\`, \`AWS::StackName\`, \`AWS::StackId\`, and \`AWS::NoValue\` (which removes a property when used in a conditional expression).

**Dynamic References** let you pull values from external sources without hardcoding them in the template:
- \`{{resolve:ssm:/myapp/param}}\` fetches a value from SSM Parameter Store at deploy time
- \`{{resolve:ssm-secure:/myapp/param}}\` fetches a SecureString parameter
- \`{{resolve:secretsmanager:MySecret:SecretString:password}}\` fetches a specific field from Secrets Manager

Dynamic references are especially powerful for database passwords — you store the password in Secrets Manager and reference it from the template, so the password never appears in the template itself.`,
      quiz: [
        {
          question:
            "Which intrinsic function retrieves a specific attribute of a CloudFormation resource, such as an S3 bucket ARN?",
          options: ["!ImportValue", "!GetAtt", "!Ref", "!Sub"],
          correctIndex: 1,
          explanation:
            "!GetAtt retrieves a specific attribute of a resource — for example, !GetAtt MyBucket.Arn returns the ARN. !Ref returns a resource's physical ID or a parameter's value.",
        },
        {
          question:
            "What CloudFormation dynamic reference syntax fetches a Secrets Manager secret field at deploy time?",
          options: [
            "{{resolve:ssm:/myapp/secret}}",
            "!GetAtt MySecret.SecretString",
            "{{resolve:secretsmanager:MySecret:SecretString:password}}",
            "!Ref MySecret",
          ],
          correctIndex: 2,
          explanation:
            "{{resolve:secretsmanager:SecretName:SecretString:fieldKey}} fetches a specific field from a Secrets Manager secret at deploy time, keeping the actual value out of the template.",
        },
        {
          question:
            "Which pseudo-parameter resolves to the AWS account ID in which the stack is being created?",
          options: [
            "AWS::StackId",
            "AWS::Region",
            "AWS::StackName",
            "AWS::AccountId",
          ],
          correctIndex: 3,
          explanation:
            "AWS::AccountId is a pseudo-parameter that CloudFormation automatically resolves to the account ID where the stack is deployed. It's commonly used in ARN construction with !Sub.",
        },
      ],
    },
    {
      heading: "Stacks & Change Sets",
      body: `A **stack** is the fundamental unit of deployment in CloudFormation — a collection of AWS resources managed together. When you create a stack, CloudFormation provisions all the resources in the template in the correct dependency order. When you update a stack, CloudFormation compares the new template against the currently deployed stack and determines what changed.

**Change Sets** are the safe way to perform updates. Instead of executing an update immediately, you create a change set — CloudFormation computes what would change (additions, modifications, replacements, deletions) and presents it for review before you execute it. This is critical for catching **resource replacements** before they happen: some property changes cause CloudFormation to create a new resource and delete the old one, which means a new ARN or endpoint. This would break anything pointing to the old resource.

CloudFormation has three update behaviors: **No interruption** (resource is updated in place, no downtime), **Some interruption** (brief outage, like changing an EC2 instance type which requires a reboot), and **Replacement** (a new resource is created and the old one is deleted after the new one is healthy).

**DeletionPolicy** controls what happens to a resource when the stack is deleted. The default is \`Delete\`. \`Retain\` removes the resource from CloudFormation's management but leaves it running. \`Snapshot\` takes a final snapshot before deletion (available for RDS, EBS, and Redshift). **UpdateReplacePolicy** applies the same options but to resource replacement during an update. On creation failure, CloudFormation rolls back and deletes all resources it had already created — use \`--disable-rollback\` during debugging to inspect what was created.`,
      quiz: [
        {
          question:
            "What is the safest way to review changes before applying a CloudFormation stack update?",
          options: [
            "Deploy directly and use rollback if something breaks",
            "Use cdk diff before deploying",
            "Run cfn-lint to validate the template",
            "Create a Change Set to preview additions, modifications, and replacements first",
          ],
          correctIndex: 3,
          explanation:
            "Change Sets let you preview exactly what CloudFormation would change — including which resources would be replaced (getting a new ARN or endpoint) — before executing the update. This is especially important to catch replacements that would break dependent systems.",
        },
        {
          question:
            "Which DeletionPolicy value takes a final backup snapshot before removing an RDS database?",
          options: ["Retain", "Delete", "Backup", "Snapshot"],
          correctIndex: 3,
          explanation:
            "DeletionPolicy: Snapshot takes a final snapshot of the resource before deletion. It's available for RDS, EBS volumes, and Redshift clusters — preserving data even when the stack is deleted.",
        },
        {
          question:
            "A CloudFormation resource update requires replacing the resource (creating a new one and deleting the old). What is the impact?",
          options: [
            "The resource gets a new physical ID (ARN/endpoint) — anything referencing the old one breaks",
            "CloudFormation automatically updates all references to the new resource",
            "The update is blocked unless you set UpdateReplacePolicy: Allow",
            "The resource ARN and endpoint remain the same",
          ],
          correctIndex: 0,
          explanation:
            "Resource replacement creates a new resource with a new physical ID (ARN, endpoint, etc.) and deletes the old one. Any external system holding a reference to the old ARN or endpoint will break — which is why Change Sets should be reviewed before execution.",
        },
      ],
    },
    {
      heading: "Nested Stacks & Stack Sets",
      body: `As templates grow large, **nested stacks** let you decompose them into modular, reusable units. A parent template references child templates stored in S3 using the \`AWS::CloudFormation::Stack\` resource type. Parameters flow down from parent to child, and outputs flow back up.

\`\`\`yaml
NetworkStack:
  Type: AWS::CloudFormation::Stack
  Properties:
    TemplateURL: https://s3.amazonaws.com/bucket/network.yaml
    Parameters:
      VpcCidr: 10.0.0.0/16
\`\`\`

Nested stacks share a lifecycle with the parent — when you delete the parent, all nested stacks are deleted too. This tight coupling is the tradeoff compared to **cross-stack references**, which use \`Outputs\` with \`Export\` names and \`!ImportValue\` in other stacks. Cross-stack references have independent lifecycles — stacks can be updated separately — but come with a constraint: you cannot delete a stack whose exports are referenced by another stack.

**Stack Sets** extend deployment to multiple AWS accounts and regions simultaneously. A single Stack Set definition can deploy identical stacks across hundreds of accounts. When integrated with AWS Organizations, Stack Sets can automatically deploy to all existing accounts in an organizational unit and to any new accounts that join — making them ideal for security baselines, compliance guardrails, and landing zone configuration applied across your entire organization.`,
      quiz: [
        {
          question:
            "What is the key constraint when using cross-stack references with !ImportValue?",
          options: [
            "!ImportValue requires a VPC endpoint to resolve",
            "Cross-stack references only work within the same region",
            "You cannot delete a stack whose exports are currently imported by another stack",
            "Imported values are only updated when both stacks are deployed simultaneously",
          ],
          correctIndex: 2,
          explanation:
            "Cross-stack references with !ImportValue create a hard dependency — you cannot delete or update a stack's exported value while another stack is importing it. The importing stack must be updated or deleted first.",
        },
        {
          question:
            "How do Stack Sets with AWS Organizations handle new accounts that join an organizational unit?",
          options: [
            "New accounts must be added manually to the Stack Set",
            "Stack Sets automatically deploy to new accounts that join the OU",
            "New accounts receive the stack only during the next scheduled deployment",
            "Stack Sets do not support Organizations integration",
          ],
          correctIndex: 1,
          explanation:
            "When integrated with AWS Organizations, Stack Sets automatically deploy to new accounts as they join the target organizational unit — ideal for security baselines and compliance guardrails applied org-wide.",
        },
        {
          question:
            "Nested stacks are referenced in CloudFormation using which resource type?",
          options: [
            "AWS::CloudFormation::NestedStack",
            "AWS::CloudFormation::Include",
            "AWS::CloudFormation::Stack",
            "AWS::CloudFormation::Module",
          ],
          correctIndex: 2,
          explanation:
            "Nested stacks are defined using the AWS::CloudFormation::Stack resource type, referencing a child template stored in S3 via the TemplateURL property.",
        },
      ],
    },
    {
      heading: "CloudFormation Helper Scripts & cfn-init",
      body: `For EC2 instances that need software installed and configured at launch, CloudFormation provides a set of helper scripts. **\`cfn-init\`** reads configuration from \`AWS::CloudFormation::Init\` metadata in the template and applies it: installing packages, writing files, setting file permissions, and starting services.

\`\`\`yaml
MyInstance:
  Type: AWS::EC2::Instance
  Metadata:
    AWS::CloudFormation::Init:
      config:
        packages:
          yum:
            httpd: []
        files:
          /var/www/html/index.html:
            content: "Hello from CloudFormation!"
        services:
          sysvinit:
            httpd:
              enabled: true
              ensureRunning: true
  Properties:
    UserData:
      !Base64 |
        #!/bin/bash
        /opt/aws/bin/cfn-init -v --stack \${AWS::StackName} \
          --resource MyInstance --region \${AWS::Region}
        /opt/aws/bin/cfn-signal -e $? --stack \${AWS::StackName} \
          --resource MyInstance --region \${AWS::Region}
\`\`\`

**\`cfn-signal\`** sends a success or failure signal back to CloudFormation after initialization completes. Combined with a **CreationPolicy**, this tells CloudFormation to wait for the instance to signal success before marking the resource as created — ensuring the instance is fully configured before the stack proceeds. **\`cfn-hup\`** is a daemon that polls for metadata changes and re-runs \`cfn-init\` when the template changes, enabling config updates without replacing instances.`,
      quiz: [
        {
          question:
            "What is the purpose of cfn-signal combined with a CreationPolicy?",
          options: [
            "It tells CloudFormation to wait for the EC2 instance to signal success before marking it as created",
            "It sends CloudFormation logs to CloudWatch",
            "It polls for metadata changes and re-runs cfn-init",
            "It installs packages on the EC2 instance",
          ],
          correctIndex: 0,
          explanation:
            "cfn-signal sends a success or failure signal back to CloudFormation. With a CreationPolicy, CloudFormation waits for the signal before marking the resource as created, ensuring the instance is fully configured before the stack continues.",
        },
        {
          question: "What does cfn-hup do on an EC2 instance?",
          options: [
            "Polls for metadata changes and re-runs cfn-init when the template changes",
            "Rotates IAM credentials on the instance",
            "Installs packages from the CloudFormation Init metadata",
            "Sends CloudFormation signals when initialization is complete",
          ],
          correctIndex: 0,
          explanation:
            "cfn-hup is a daemon that polls for changes to CloudFormation metadata and re-runs cfn-init when changes are detected, allowing configuration updates to running instances without replacing them.",
        },
      ],
    },
    {
      heading: "CloudFormation with Other Services",
      body: `CloudFormation is the deployment engine that underlies several AWS developer tools. **SAM templates** are CloudFormation templates with a Transform header — the SAM CLI packages and deploys them via CloudFormation. **CDK** synthesizes your code into CloudFormation templates and deploys them via CloudFormation stacks. Understanding CloudFormation is therefore foundational even if you use CDK or SAM day-to-day.

Integrating CloudFormation with **CodePipeline** creates a safe infrastructure delivery pipeline: a template change triggers the pipeline, a CloudFormation action creates a change set, a manual approval action reviews it, and a second CloudFormation action executes it. This pattern keeps infrastructure changes auditable and reversible.

**Custom Resources** are the escape hatch for resources or operations that CloudFormation doesn't natively support. A Lambda function receives Create, Update, and Delete events from CloudFormation and must respond to a pre-signed S3 URL with a success or failure signal. This lets you provision non-AWS resources (like DNS records in third-party providers), run database migrations, or perform any custom logic as part of a CloudFormation deployment.

**Service Catalog** packages CloudFormation templates as catalog products that end users can deploy through a self-service portal without needing direct CloudFormation access — a way to offer approved, compliant infrastructure patterns to development teams.`,
      quiz: [
        {
          question:
            "A CloudFormation Custom Resource Lambda function must respond to CloudFormation how?",
          options: [
            "By returning a JSON response from the Lambda handler",
            "By calling the CloudFormation API directly",
            "By sending a success or failure signal to a pre-signed S3 URL",
            "By writing results to a DynamoDB table",
          ],
          correctIndex: 2,
          explanation:
            "Custom Resource Lambda functions must PUT a response (success or failure) to a pre-signed S3 URL that CloudFormation provides in the event. If no response is sent, the stack will hang until it times out.",
        },
        {
          question:
            "Which service packages CloudFormation templates as self-service catalog products for development teams?",
          options: [
            "AWS CDK",
            "AWS Config",
            "AWS Service Catalog",
            "AWS Control Tower",
          ],
          correctIndex: 2,
          explanation:
            "AWS Service Catalog packages CloudFormation templates as catalog products that teams can deploy through a self-service portal without direct CloudFormation access, enforcing approved and compliant patterns.",
        },
        {
          question:
            "SAM templates are CloudFormation templates with what addition?",
          options: [
            "A Transform: AWS::Serverless-2016-10-31 header",
            "A special SAM: prefix on all resource types",
            "An embedded Lambda function that deploys the stack",
            "A required Globals section",
          ],
          correctIndex: 0,
          explanation:
            "SAM templates are CloudFormation templates with Transform: AWS::Serverless-2016-10-31 at the top. This activates the SAM transform which expands SAM shorthand resource types into full CloudFormation resources before deployment.",
        },
      ],
    },
  ],

  keyFacts: [
    "Only Resources section is required; all other sections optional",
    "!Ref: returns resource ID. !GetAtt: returns specific attribute. !Sub: string substitution.",
    "Change Sets: preview changes before applying. Review replacements before executing.",
    "DeletionPolicy: Delete (default), Retain (keep resource), Snapshot (final backup)",
    "Replacement update: new resource created first, old deleted after — causes new ID/endpoint",
    "cfn-signal + CreationPolicy: EC2 must signal success before stack proceeds",
    "Nested stacks: modular templates referenced via AWS::CloudFormation::Stack",
    "Cross-stack references: Outputs with Export + !ImportValue",
    "StackSets: deploy one template to many accounts/regions (org-wide baselining)",
    "Dynamic references: {{resolve:secretsmanager:Name:SecretString:key}}",
  ],

  relatedServices: [
    "AWS SAM",
    "AWS CDK",
    "AWS CodePipeline",
    "AWS Service Catalog",
    "AWS Systems Manager",
    "AWS Secrets Manager",
    "Amazon EventBridge",
    "AWS Lambda",
  ],

  examTips: [
    "DeletionPolicy Snapshot: takes DB/volume snapshot before deletion — data preserved.",
    "Change Sets: safe way to preview infrastructure changes — especially replacements.",
    "Resource replacement: new resource is created, then old is deleted — temporary dual-run.",
    "cfn-signal: EC2 must call this after cfn-init for CreationPolicy wait to complete.",
    "!ImportValue: cross-stack reference — the exporting stack cannot be deleted while referenced.",
    "StackSets with Organizations: auto-deploy to new accounts as they join an OU.",
    "Custom Resources: Lambda-backed — handle Create/Update/Delete and respond to pre-signed URL.",
    "SSM parameter type in Parameters: fetches live value at deploy time.",
    "Rollback on failure: CloudFormation undoes ALL changes — use change sets to preview first.",
  ],

  topicQuiz: [
    {
      question:
        "Which CloudFormation section is the only one required in every template?",
      options: ["Conditions", "Resources", "Outputs", "Parameters"],
      correctIndex: 1,
      explanation:
        "Only the Resources section is required. All other sections (Parameters, Mappings, Conditions, Outputs) are optional.",
    },
    {
      question:
        "A CloudFormation stack update will replace an RDS instance, giving it a new endpoint. How do you catch this before it impacts production?",
      options: [
        "Create a Change Set and review it before executing",
        "Check CloudTrail for recent resource changes",
        "Deploy and roll back if it breaks",
        "Use cfn-lint to detect replacements",
      ],
      correctIndex: 0,
      explanation:
        "Change Sets show exactly what would change — including which resources would be replaced — before you execute the update. Reviewing replacements is one of the most important uses of Change Sets.",
    },
    {
      question:
        "You want to preserve an RDS database when its CloudFormation stack is deleted. Which DeletionPolicy should you use?",
      options: ["Retain", "Delete", "Archive", "Snapshot"],
      correctIndex: 0,
      explanation:
        "DeletionPolicy: Retain removes the resource from CloudFormation's management but leaves it running when the stack is deleted. DeletionPolicy: Snapshot takes a backup before deletion.",
    },
    {
      question:
        "What dynamic reference syntax fetches a Secrets Manager secret value inside a CloudFormation template?",
      options: [
        "!Ref MySecret",
        "{{ssm:/myapp/secret}}",
        "{{resolve:secretsmanager:MySecret:SecretString:password}}",
        "!GetAtt MySecret.SecretString",
      ],
      correctIndex: 2,
      explanation:
        "{{resolve:secretsmanager:SecretName:SecretString:fieldKey}} fetches the value from Secrets Manager at deploy time without embedding the secret in the template.",
    },
    {
      question:
        "A Custom Resource Lambda function must do what to signal success to CloudFormation?",
      options: [
        "PUT a response to the pre-signed S3 URL provided in the event",
        "Return { statusCode: 200 } from the Lambda handler",
        "Call cloudformation:SignalResource",
        "Write a success record to DynamoDB",
      ],
      correctIndex: 0,
      explanation:
        "Custom Resource Lambda functions must PUT a JSON response to the pre-signed S3 URL in the CloudFormation event. Failure to do so causes the stack to hang until it times out.",
    },
    {
      question:
        "Stack Sets with AWS Organizations integration automatically deploy to new accounts when they:",
      options: [
        "Join an organizational unit targeted by the Stack Set",
        "Are created in the same region as the Stack Set",
        "Request deployment via the AWS console",
        "Have the correct IAM permissions pre-configured",
      ],
      correctIndex: 0,
      explanation:
        "With Organizations integration, Stack Sets automatically deploy to any new account that joins a targeted organizational unit — enabling org-wide security baselines and compliance guardrails without manual action.",
    },
    {
      question:
        "Which intrinsic function is used to import an output value from another CloudFormation stack?",
      options: ["!ImportValue", "!GetAtt", "!Ref", "!Sub"],
      correctIndex: 0,
      explanation:
        "!ImportValue imports an exported output value from another stack. The exporting stack uses the Export/Name field in its Outputs section. The importing stack cannot be deleted while the export is referenced.",
    },
    {
      question:
        "cfn-signal combined with a CreationPolicy tells CloudFormation to:",
      options: [
        "Send CloudWatch metrics during instance initialization",
        "Install software packages on the EC2 instance",
        "Wait for the EC2 instance to signal success before marking it as created",
        "Retry failed resource creation automatically",
      ],
      correctIndex: 2,
      explanation:
        "cfn-signal sends a success/failure signal from the instance back to CloudFormation. The CreationPolicy causes CloudFormation to wait for the signal before marking the resource as successfully created.",
    },
  ],
};
