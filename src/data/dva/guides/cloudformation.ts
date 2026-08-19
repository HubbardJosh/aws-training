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
    },
    {
      heading: "Stacks & Change Sets",
      body: `A **stack** is the fundamental unit of deployment in CloudFormation — a collection of AWS resources managed together. When you create a stack, CloudFormation provisions all the resources in the template in the correct dependency order. When you update a stack, CloudFormation compares the new template against the currently deployed stack and determines what changed.

**Change Sets** are the safe way to perform updates. Instead of executing an update immediately, you create a change set — CloudFormation computes what would change (additions, modifications, replacements, deletions) and presents it for review before you execute it. This is critical for catching **resource replacements** before they happen: some property changes cause CloudFormation to create a new resource and delete the old one, which means a new ARN or endpoint. This would break anything pointing to the old resource.

CloudFormation has three update behaviors: **No interruption** (resource is updated in place, no downtime), **Some interruption** (brief outage, like changing an EC2 instance type which requires a reboot), and **Replacement** (a new resource is created and the old one is deleted after the new one is healthy).

**DeletionPolicy** controls what happens to a resource when the stack is deleted. The default is \`Delete\`. \`Retain\` removes the resource from CloudFormation's management but leaves it running. \`Snapshot\` takes a final snapshot before deletion (available for RDS, EBS, and Redshift). **UpdateReplacePolicy** applies the same options but to resource replacement during an update. On creation failure, CloudFormation rolls back and deletes all resources it had already created — use \`--disable-rollback\` during debugging to inspect what was created.`,
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
    },
    {
      heading: "CloudFormation with Other Services",
      body: `CloudFormation is the deployment engine that underlies several AWS developer tools. **SAM templates** are CloudFormation templates with a Transform header — the SAM CLI packages and deploys them via CloudFormation. **CDK** synthesizes your code into CloudFormation templates and deploys them via CloudFormation stacks. Understanding CloudFormation is therefore foundational even if you use CDK or SAM day-to-day.

Integrating CloudFormation with **CodePipeline** creates a safe infrastructure delivery pipeline: a template change triggers the pipeline, a CloudFormation action creates a change set, a manual approval action reviews it, and a second CloudFormation action executes it. This pattern keeps infrastructure changes auditable and reversible.

**Custom Resources** are the escape hatch for resources or operations that CloudFormation doesn't natively support. A Lambda function receives Create, Update, and Delete events from CloudFormation and must respond to a pre-signed S3 URL with a success or failure signal. This lets you provision non-AWS resources (like DNS records in third-party providers), run database migrations, or perform any custom logic as part of a CloudFormation deployment.

**Service Catalog** packages CloudFormation templates as catalog products that end users can deploy through a self-service portal without needing direct CloudFormation access — a way to offer approved, compliant infrastructure patterns to development teams.`,
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
};
