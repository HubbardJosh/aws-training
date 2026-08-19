import { ServiceGuide } from "../../../types/guide";

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
      body: `CDK is organized around a hierarchy of three concepts. An **App** is the root of a CDK application and contains one or more Stacks. A **Stack** maps directly to a CloudFormation stack and represents a deployable unit — you typically have one stack per environment (account and region combination). A **Construct** is the fundamental building block, representing one or more CloudFormation resources.

Constructs come in three levels of abstraction, called L1, L2, and L3. **L1 constructs** (prefixed with \`Cfn\`, like \`CfnBucket\`) are direct, one-to-one wrappers around CloudFormation resources. They expose every CloudFormation property but provide no defaults or helper methods — they're the escape hatch when you need full control. **L2 constructs** are the most commonly used: they wrap resources with sensible defaults and convenience methods. \`Bucket\`, \`Function\`, and \`Table\` are L2 constructs — they set secure defaults automatically and provide \`grant*()\` methods for IAM. **L3 constructs** (also called patterns) compose multiple resources to implement a common architecture, like \`ApplicationLoadBalancedFargateService\` or \`LambdaRestApi\`, which stand up an entire stack of infrastructure in a few lines of code.

When you run \`cdk synth\`, CDK evaluates your code and emits a standard CloudFormation template to the \`cdk.out/\` directory. All CloudFormation features apply — CDK is ultimately just a code-based way to generate those templates.`,
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

Three patterns in this example are characteristic of idiomatic CDK. The **\`grant*()\` methods** on L2 constructs automatically generate the correct IAM policy statements — \`table.grantReadWriteData(handler)\` adds a policy to the Lambda's execution role that allows the exact DynamoDB actions needed, without you writing any IAM JSON. **\`RemovalPolicy\`** controls what happens to a resource when the stack is deleted: \`DESTROY\` deletes it (appropriate for dev), \`RETAIN\` keeps it (appropriate for prod databases), and \`SNAPSHOT\` takes a final snapshot before deletion (for RDS, EBS, Redshift). **\`Code.fromAsset\`** bundles a local directory as the Lambda deployment package, with optional bundling steps.`,
    },
    {
      heading: "CDK CLI Commands",
      body: `The CDK CLI is your interface for synthesizing, comparing, and deploying stacks. Before your first deployment to any account/region combination, you must run \`cdk bootstrap\`. This deploys the CDKToolkit CloudFormation stack, which creates an S3 bucket for assets and an ECR repository for container images. Without bootstrapping, deployments will fail.

\`cdk synth\` evaluates your CDK code and generates the CloudFormation template, writing it to \`cdk.out/\`. Run this to preview exactly what CloudFormation will receive — it's a good habit before any deployment. \`cdk diff\` compares the synthesized template against the currently deployed stack and shows you what will change, similar to a CloudFormation change set preview. Review \`cdk diff\` before deploying to catch unexpected changes.

\`\`\`
cdk deploy MyStack
cdk deploy --all  # deploy all stacks in the app
cdk deploy --require-approval never  # skip manual approval for security group changes
\`\`\`

\`cdk destroy\` tears down the stack and all its resources, respecting each resource's \`RemovalPolicy\`. \`cdk ls\` lists all stacks in the app. \`cdk watch\` monitors for code changes and automatically deploys — useful for Lambda development, though \`sam sync\` is faster for Lambda-only changes. Configuration and feature flags live in \`cdk.json\`.`,
    },
    {
      heading: "Constructs Library & Patterns",
      body: `The main CDK library is \`aws-cdk-lib\`, which contains constructs for every AWS service organized by module:

\`\`\`typescript
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs-patterns';
\`\`\`

L3 pattern constructs are particularly powerful for common architectures. \`ApplicationLoadBalancedFargateService\` creates an ALB, ECS Fargate service, task definition, target group, and all associated security groups in roughly 10 lines of CDK. \`LambdaRestApi\` creates an API Gateway REST API with Lambda proxy integration. \`SqsEventSource\` configures a Lambda event source mapping for SQS.

You can create your own reusable constructs by extending the \`Construct\` base class. An organization can publish a library of approved, secure constructs that teams use as building blocks — ensuring consistent security settings across projects without each team needing to know the details.

When an L2 construct doesn't expose a property you need, the **escape hatch** pattern lets you access the underlying L1 resource:

\`\`\`typescript
const cfnBucket = bucket.node.defaultChild as s3.CfnBucket;
cfnBucket.addPropertyOverride('LifecycleConfiguration.Rules.0.Status', 'Disabled');
\`\`\`

This gives you the full expressiveness of CloudFormation while keeping most of your code at the higher L2 level.`,
    },
    {
      heading: "CDK vs CloudFormation vs SAM",
      body: `All three tools deploy via CloudFormation — the difference is in the authoring experience and the level of abstraction they provide.

**CloudFormation** templates are declarative JSON or YAML. They're explicit, reviewable, and completely portable across teams and tools. The downside is verbosity — a production-grade serverless application can require thousands of lines of YAML. CloudFormation is the right choice for organizations that require static, reviewed templates for compliance, or that standardize on hand-authored templates.

**SAM** is a CloudFormation extension (a Transform) that provides simplified syntax specifically for serverless resources. A Lambda function with an API Gateway trigger that would be 100+ lines in CloudFormation is 10 lines in SAM. SAM's killer feature for developers is the CLI: \`sam local invoke\` and \`sam local start-api\` run your Lambda functions and API locally in Docker containers. SAM is the right choice for pure serverless workloads where local testing and YAML-based authoring are preferred.

**CDK** is the right choice when your infrastructure is complex enough to benefit from programming language features — loops, conditionals, functions, classes, and type systems. It's particularly powerful for teams that want to share infrastructure patterns across projects via construct libraries. CDK generates CloudFormation, so everything CloudFormation can do, CDK can do too, plus you get IDE support, compile-time validation, and the ability to write tests for your infrastructure code.`,
    },
    {
      heading: "CDK with Other Services",
      body: `CDK's integration with **CodePipeline** is especially powerful through the CDK Pipelines construct. \`pipelines.CodePipeline\` creates a **self-mutating pipeline** — a pipeline that automatically updates itself when you change your CDK app code. This means your pipeline definition and your application code live in the same repository and evolve together.

CDK's integration with **Lambda** includes the \`NodejsFunction\` construct (from \`@aws-cdk/aws-lambda-nodejs\`), which automatically bundles TypeScript with esbuild during synthesis. You don't need a separate build step — CDK handles the transpilation and bundling as part of \`cdk synth\`.

For testing CDK infrastructure code, \`aws-cdk-lib/assertions\` provides a test framework that evaluates the synthesized CloudFormation template:

\`\`\`typescript
Template.fromStack(myStack).hasResourceProperties('AWS::S3::Bucket', {
  VersioningConfiguration: { Status: 'Enabled' },
});
\`\`\`

This lets you write unit tests that verify your infrastructure has the properties you expect — catching misconfigurations before deployment. Combined with the \`grant*()\` method pattern for IAM and \`RemovalPolicy\` for resource lifecycle management, CDK provides a complete developer experience for infrastructure-as-code.`,
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
