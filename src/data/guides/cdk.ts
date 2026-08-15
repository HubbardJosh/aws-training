import { ServiceGuide } from "../../types/guide";

export const cdkGuide: ServiceGuide = {
  id: "aws-cdk",
  service: "AWS CDK",
  domain: "deployment",
  tagline: "Define cloud infrastructure using familiar programming languages",
  intro:
    "AWS CDK (Cloud Development Kit) lets you define AWS infrastructure using TypeScript, Python, Java, Go, C#, or JavaScript. CDK code synthesizes into CloudFormation templates. You get IDE autocompletion, type safety, loops, conditionals, and reusable constructs — dramatically reducing the verbosity of raw CloudFormation.",

  sections: [
    {
      heading: "Core Concepts",
      body: `**App**: the root of a CDK application. Contains one or more Stacks.

**Stack**: maps to a CloudFormation stack. Deploy independently. One stack per environment (account/region) typically.

**Construct**: the basic building block. Represents one or more CloudFormation resources. Three levels:
- *L1 (Cfn constructs)*: direct CloudFormation resource wrappers (\`CfnBucket\`). One-to-one with CF resources. All properties, no defaults.
- *L2 (AWS constructs)*: curated, higher-level constructs with sensible defaults and helper methods. Most commonly used (\`Bucket\`, \`Function\`, \`Table\`).
- *L3 (Patterns)*: multi-resource patterns for common architectures (\`ApplicationLoadBalancedFargateService\`, \`LambdaRestApi\`).

**Synthesis**: CDK converts your code to a CloudFormation template (\`cdk synth\`). The output is a standard CF JSON/YAML template.

**Environment**: account + region. Specify per stack or inherit from CLI context.

\`\`\`typescript
new MyStack(app, 'MyStack', {
  env: { account: '123456789', region: 'us-east-1' }
});
\`\`\``,
    },
    {
      heading: "CDK Code Example",
      body: `\`\`\`typescript
import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export class OrdersStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, 'OrdersTable', {
      partitionKey: { name: 'orderId', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // for dev only
    });

    const handler = new lambda.Function(this, 'OrdersHandler', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'orders.handler',
      environment: {
        TABLE_NAME: table.tableName,
      },
    });

    table.grantReadWriteData(handler); // adds IAM permissions automatically

    new apigateway.LambdaRestApi(this, 'OrdersApi', {
      handler,
    });
  }
}
\`\`\`

Key patterns:
- **grantX methods**: L2 constructs provide \`grant*()\` methods that automatically add correct IAM permissions (\`grantRead\`, \`grantReadWriteData\`, \`grantPut\`, etc.)
- **RemovalPolicy**: controls what happens to resources when stack is deleted (DESTROY, RETAIN, SNAPSHOT)
- **Code.fromAsset**: bundle local directory as Lambda deployment package`,
    },
    {
      heading: "CDK CLI Commands",
      body: `**cdk init**: scaffold a new CDK project in your chosen language.

**cdk synth**: synthesize to CloudFormation template. Output to \`cdk.out/\`. Run this to review what will be deployed.

**cdk deploy**: deploy (or update) the stack. Runs \`cdk synth\` first, then deploys the generated template via CloudFormation.
\`\`\`
cdk deploy MyStack
cdk deploy --all  # deploy all stacks in the app
cdk deploy --require-approval never  # skip manual approval for security group changes
\`\`\`

**cdk diff**: show differences between deployed stack and local code. Like a change set preview.

**cdk destroy**: delete the stack and all its resources.

**cdk bootstrap**: deploy the CDK bootstrapping stack (\`CDKToolkit\`) to the target account/region. Creates S3 bucket and ECR repository for CDK assets. **Must be run before first deploy**.

**cdk ls**: list all stacks in the app.

**cdk watch**: watch for code changes and automatically deploy (like \`sam sync\`). Slower than SAM for Lambda-only changes.

**Context and feature flags**: \`cdk.json\` stores context values and CDK feature flags. Control CDK behavior and pass environment-specific configuration.`,
    },
    {
      heading: "Constructs Library & Patterns",
      body: `**aws-cdk-lib**: the main CDK library containing all AWS service constructs. Import per service:
\`\`\`typescript
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs-patterns';
\`\`\`

**L3 Patterns** (aws-cdk-lib/aws-ecs-patterns, etc.):
- \`ApplicationLoadBalancedFargateService\`: ALB + ECS Fargate service + task definition + security groups in ~5 lines
- \`LambdaRestApi\`: API Gateway REST API + Lambda integration
- \`SqsEventSource\`: trigger Lambda from SQS (handles event source mapping)
- \`ScheduledFargateTask\`: EventBridge-triggered ECS task

**Custom Constructs**: create reusable constructs for your organization:
\`\`\`typescript
export class SecureS3Bucket extends Construct {
  public readonly bucket: s3.Bucket;
  constructor(scope: Construct, id: string) {
    super(scope, id);
    this.bucket = new s3.Bucket(this, 'Bucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      versioned: true,
    });
  }
}
\`\`\`

**Escape hatch**: access the underlying L1 construct to set properties not exposed by L2:
\`\`\`typescript
const cfnBucket = bucket.node.defaultChild as s3.CfnBucket;
cfnBucket.addPropertyOverride('LifecycleConfiguration.Rules.0.Status', 'Disabled');
\`\`\``,
    },
    {
      heading: "CDK vs CloudFormation vs SAM",
      body: `**CloudFormation**: declarative JSON/YAML. Verbose. Full control. Difficult to reuse. Best for: orgs requiring reviewed, static templates.

**SAM**: CloudFormation extension. Simplified syntax for serverless. Local testing with SAM CLI. Best for: pure serverless apps, teams comfortable with YAML.

**CDK**: imperative code. IDE support, type safety, reusable constructs. Generates CloudFormation. Best for: complex architectures, teams preferring code over YAML, reusability across projects.

**When to choose CDK**:
- Large or complex infrastructure
- Want to reuse infrastructure patterns across teams
- Prefer TypeScript/Python over YAML
- Need loops, conditionals, or programmatic generation

**When to choose SAM**:
- Purely serverless (Lambda + API Gateway + DynamoDB)
- Want local testing with \`sam local\`
- Simpler, YAML-based workflow

**When to choose CloudFormation directly**:
- Strict compliance requirements for reviewed static templates
- Organization-wide standardized templates
- No programming language allowed in IaC review

Note: SAM and CDK both ultimately deploy via CloudFormation. They're all interoperable.`,
    },
    {
      heading: "CDK with Other Services",
      body: `**CDK + CloudFormation**: CDK synthesizes to CF templates. Deploy via CloudFormation stacks. All CloudFormation features (drift detection, change sets, rollback) apply.

**CDK + CodePipeline**: \`aws-cdk-lib/aws-codepipeline-actions\` provides CDK-native pipeline constructs. \`pipelines.CodePipeline\` L3 construct creates a self-mutating CDK pipeline — the pipeline updates itself when CDK code changes.

**CDK + Lambda**: \`Code.fromAsset\` bundles local directory. \`NodejsFunction\` construct (from \`@aws-cdk/aws-lambda-nodejs\`) bundles with esbuild automatically. Docker-based bundling for other runtimes.

**CDK + ECS**: \`ApplicationLoadBalancedFargateService\` creates the full stack: ALB, target group, ECS service, task definition, security groups, IAM roles. Reduces hundreds of lines of CF to ~10 lines of CDK.

**CDK + IAM**: \`grant*()\` methods (grantRead, grantWrite, grantInvoke) automatically add correct IAM permissions without manual policy JSON. \`iam.PolicyStatement\` for custom policies.

**CDK + Testing**: \`aws-cdk-lib/assertions\` for unit testing CDK constructs:
\`\`\`typescript
Template.fromStack(myStack).hasResourceProperties('AWS::S3::Bucket', {
  VersioningConfiguration: { Status: 'Enabled' },
});
\`\`\``,
    },
  ],

  keyFacts: [
    "CDK synthesizes to CloudFormation — deploy via CloudFormation stacks",
    "L1 = Cfn wrappers (raw CF). L2 = curated with defaults. L3 = multi-resource patterns.",
    "cdk bootstrap: must run once per account/region before first deploy",
    "grant*() methods: automatically add correct IAM permissions (grantRead, grantReadWriteData)",
    "cdk diff: preview changes like a CloudFormation change set",
    "Escape hatch: access underlying CfnResource to set properties not in L2",
    "RemovalPolicy.DESTROY: deletes resource on stack delete (use carefully in prod)",
    "CDK Pipelines (pipelines.CodePipeline): self-mutating pipeline that updates itself",
    "NodejsFunction construct: auto-bundles TypeScript with esbuild",
    "Context values in cdk.json: environment-specific config without hardcoding",
  ],

  relatedServices: [
    "AWS CloudFormation",
    "AWS SAM",
    "AWS CodePipeline",
    "AWS Lambda",
    "Amazon ECS",
    "Amazon S3",
    "Amazon DynamoDB",
    "Amazon API Gateway",
    "AWS IAM",
  ],

  examTips: [
    "CDK synthesizes CloudFormation — understanding CF is still required for exam.",
    "cdk bootstrap: creates CDKToolkit stack with S3/ECR for assets — required before deploy.",
    "L2 constructs: sensible defaults + grant() methods. L1: direct CF resource, no defaults.",
    "L3 patterns: create full solutions (ALB + Fargate + security groups) in minimal code.",
    "CDK Pipelines: self-mutating — pipeline updates itself when CDK app code changes.",
    "RemovalPolicy.RETAIN vs DESTROY: production vs dev/test — critical distinction.",
    "grant*() methods: preferred over manual IAM policy statements in CDK.",
    "escape hatch: node.defaultChild as CfnResource to access L1 properties from L2.",
  ],
};
