import { ServiceGuide } from "../../types/guide";

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
      body: `A CloudFormation template is a JSON or YAML document with these sections:

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

**Required section**: only \`Resources\` is required. All other sections are optional.

**Parameters**: runtime inputs. Types: String, Number, List, AWS-specific (AWS::EC2::KeyPair::KeyName, AWS::SSM::Parameter::Value, etc.). SSM parameter type fetches value from SSM at deploy time.

**Mappings**: static lookup tables (e.g. AMI IDs per region). Accessed with \`!FindInMap [MapName, Key1, Key2]\`.

**Conditions**: boolean expressions. Use \`!If\`, \`!Equals\`, \`!And\`, \`!Or\`, \`!Not\`. Control whether resources are created or what values they use.

**Outputs**: values to export (cross-stack references) or display after stack creation.`,
    },
    {
      heading: "Intrinsic Functions & Pseudo-Parameters",
      body: `**Intrinsic functions** (YAML short form):
- \`!Ref\`: reference a parameter, resource (returns ID/name), or pseudo-parameter
- \`!Sub "string-\${Variable}"\`: string substitution with references
- \`!GetAtt Resource.Attribute\`: get a specific attribute of a resource (e.g. \`!GetAtt MyBucket.Arn\`)
- \`!Join [delimiter, [values]]\`: join values with delimiter
- \`!Select [index, list]\`: select element from a list
- \`!FindInMap [map, key1, key2]\`: lookup in Mappings
- \`!If [condition, true-val, false-val]\`: conditional value
- \`!ImportValue ExportName\`: import output from another stack
- \`!Split [delimiter, string]\`: split string into list
- \`!Base64 string\`: base64 encode (for UserData)
- \`!Cidr [ipBlock, count, sizeMask]\`: generate CIDR blocks

**Pseudo-parameters** (no declaration needed):
- \`AWS::AccountId\`: current account ID
- \`AWS::Region\`: current region
- \`AWS::StackName\`: current stack name
- \`AWS::StackId\`: full stack ARN
- \`AWS::NoValue\`: removes the property (like null)

**Dynamic References**: reference secrets/parameters without hard-coding:
- \`{{resolve:ssm:/myapp/param}}\`: SSM Parameter Store
- \`{{resolve:ssm-secure:/myapp/param}}\`: SSM SecureString
- \`{{resolve:secretsmanager:MySecret:SecretString:password}}\`: Secrets Manager`,
    },
    {
      heading: "Stacks & Change Sets",
      body: `**Stack**: a collection of AWS resources managed as a single unit. Create, update, or delete the stack to manage all resources together.

**Stack operations**:
- Create: provision all resources in the template
- Update: apply changes to existing stack; CloudFormation determines what changed
- Delete: destroy all resources in the stack (respects DeletionPolicy)

**Change Sets**: preview what CloudFormation will do before executing. Create a change set → review additions, modifications, replacements → execute or discard.

**Update behaviors**:
- *No interruption*: update without stopping the resource (e.g. add tag)
- *Some interruption*: brief outage (e.g. change EC2 instance type — reboot)
- *Replacement*: new resource created, old deleted (e.g. change RDS engine). Old resource deleted after new one is healthy.

**DeletionPolicy**: control what happens to a resource when the stack is deleted:
- \`Delete\` (default): delete the resource
- \`Retain\`: keep the resource (remove from CloudFormation management)
- \`Snapshot\`: take a final snapshot before deleting (RDS, EBS, Redshift)

**UpdateReplacePolicy**: same options as DeletionPolicy but for resource replacement during update.

**Rollback**: if stack creation/update fails, CloudFormation rolls back to the previous state. On create failure: rolls back and deletes all created resources (or retain with \`--disable-rollback\` for debugging).`,
    },
    {
      heading: "Nested Stacks & Stack Sets",
      body: `**Nested Stacks**: stacks that create other stacks using \`AWS::CloudFormation::Stack\`. The root template references nested templates stored in S3.

\`\`\`yaml
NetworkStack:
  Type: AWS::CloudFormation::Stack
  Properties:
    TemplateURL: https://s3.amazonaws.com/bucket/network.yaml
    Parameters:
      VpcCidr: 10.0.0.0/16
\`\`\`

Use for: modularizing large templates, reusing common components (VPC, security groups) across applications.

**Cross-Stack References**: share values between stacks using Outputs with Export + \`!ImportValue\`. Looser coupling than nested stacks — independent lifecycle.

**Stack Sets**: deploy stacks to multiple accounts and regions simultaneously. Uses service-linked roles or self-managed roles. Use for: landing zone setup, security baseline, centralized logging — applied across an AWS Organization.

**StackSets with Organizations**: automatic deployment to all existing and future accounts in an OU. New accounts get the stack automatically.`,
    },
    {
      heading: "CloudFormation Helper Scripts & cfn-init",
      body: `**cfn-init**: runs on EC2 instances at launch to configure software. Reads \`AWS::CloudFormation::Init\` metadata from the template.

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
        /opt/aws/bin/cfn-init -v --stack \${AWS::StackName} \\
          --resource MyInstance --region \${AWS::Region}
        /opt/aws/bin/cfn-signal -e $? --stack \${AWS::StackName} \\
          --resource MyInstance --region \${AWS::Region}
\`\`\`

**cfn-signal**: sends a success/failure signal back to CloudFormation. Used with \`CreationPolicy\` to wait for EC2 instances to complete initialization before marking the resource as created.

**cfn-hup**: daemon that detects metadata changes and re-runs cfn-init. Enables config updates without replacing instances.

**CreationPolicy**: wait for N success signals within a timeout before stack creation continues.`,
    },
    {
      heading: "CloudFormation with Other Services",
      body: `**CloudFormation + CodePipeline**: infrastructure as code pipeline. Template changes → CodePipeline → CloudFormation action (CHANGE_SET_CREATE → approval → CHANGE_SET_EXECUTE). Safe, auditable infrastructure changes.

**CloudFormation + SAM**: SAM templates ARE CloudFormation templates with a Transform. SAM CLI deploys via CloudFormation. Stack visible in CloudFormation console.

**CloudFormation + CDK**: CDK synthesizes to CloudFormation templates. CDK deploy triggers CloudFormation stack deployment. CDK is an abstraction layer over CloudFormation.

**CloudFormation + Service Catalog**: package CloudFormation templates as "products" in Service Catalog. End users deploy approved, compliant infrastructure through a self-service portal without needing CloudFormation expertise.

**CloudFormation + Systems Manager**: parameter type \`AWS::SSM::Parameter::Value<String>\` fetches SSM parameter values at deploy time. Dynamic references work for secrets and parameters.

**CloudFormation + EventBridge**: stack events (CREATE_COMPLETE, UPDATE_ROLLBACK_COMPLETE, etc.) published to EventBridge. Trigger Lambda, SNS, or other targets on stack events.

**CloudFormation Custom Resources**: invoke Lambda from within a template to provision non-AWS resources or do complex logic. Lambda receives Create/Update/Delete events and must respond with a success/failure signal to a pre-signed S3 URL.`,
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
