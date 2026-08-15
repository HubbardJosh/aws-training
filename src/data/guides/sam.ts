import { ServiceGuide } from "../../types/guide";

export const samGuide: ServiceGuide = {
  id: "aws-sam",
  service: "AWS SAM",
  domain: "deployment",
  tagline:
    "Serverless Application Model for defining and deploying serverless apps",
  intro:
    "AWS SAM (Serverless Application Model) is an open-source framework for building serverless applications. It extends CloudFormation with serverless-specific resource types (Lambda, API Gateway, DynamoDB tables) and provides a CLI for local testing, building, and deploying serverless applications.",

  sections: [
    {
      heading: "SAM Template",
      body: `SAM templates extend CloudFormation templates. Add \`Transform: AWS::Serverless-2016-10-31\` at the top — this tells CloudFormation to process it with the SAM transform.

\`\`\`yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: nodejs20.x
    Timeout: 30
    MemorySize: 512
    Environment:
      Variables:
        TABLE_NAME: !Ref OrdersTable

Resources:
  OrdersFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: src/orders.handler
      Events:
        ApiEvent:
          Type: Api
          Properties:
            Path: /orders
            Method: post
      Policies:
        - DynamoDBCrudPolicy:
            TableName: !Ref OrdersTable

  OrdersTable:
    Type: AWS::Serverless::SimpleTable
    Properties:
      PrimaryKey:
        Name: orderId
        Type: String

Outputs:
  ApiUrl:
    Value: !Sub "https://\${ServerlessRestApi}.execute-api.\${AWS::Region}.amazonaws.com/Prod/"
\`\`\`

**Globals**: set default properties for all functions, APIs, or tables. Individual resources can override.

**SAM generates standard CloudFormation** under the hood — the transform expands SAM resources into CloudFormation equivalents.`,
    },
    {
      heading: "SAM Resource Types",
      body: `**AWS::Serverless::Function**: Lambda function with event source mappings.
- Events: Api, HttpApi, S3, SQS, SNS, DynamoDB Streams, EventBridge, Schedule, IoT
- Policies: SAM policy templates (DynamoDBCrudPolicy, S3CrudPolicy, SQSPollerPolicy, etc.) — shorthand for common IAM permission patterns
- Layers: list of Lambda Layer ARNs
- VpcConfig, Environment, Tracing (Active for X-Ray)

**AWS::Serverless::Api**: API Gateway REST API.
- Stages, authorizers, CORS, usage plans, API keys

**AWS::Serverless::HttpApi**: API Gateway HTTP API (v2). Cheaper, faster, simpler.

**AWS::Serverless::SimpleTable**: DynamoDB table with a single primary key (simplest config).

**AWS::Serverless::LayerVersion**: Lambda layer for shared code/dependencies.

**AWS::Serverless::Application**: embed a SAM app from the Serverless Application Repository or another S3 template (nested applications).

**AWS::Serverless::StateMachine**: Step Functions state machine defined inline or from a file.`,
    },
    {
      heading: "SAM CLI",
      body: `The **SAM CLI** is the primary developer tool for SAM applications.

**sam init**: initialize a new SAM project from a template (Hello World, Step Functions, etc.).

**sam build**: build your application (resolve dependencies, compile code). Output in \`.aws-sam/build/\`. Respects \`BuildMethod\` in template (esbuild for TypeScript, makefile for custom).

**sam local invoke**: run a Lambda function locally. Starts a Docker container with the function runtime, invokes it with a test event.
\`\`\`
sam local invoke OrdersFunction --event events/order.json
\`\`\`

**sam local start-api**: start a local API Gateway on http://localhost:3000. Maps routes to Lambda functions locally. Hot reload with \`--warm-containers\`.

**sam local start-lambda**: local Lambda endpoint for use by other local services.

**sam deploy**: package and deploy to CloudFormation.
\`\`\`
sam deploy --guided  # interactive first-time setup
sam deploy           # subsequent deploys using samconfig.toml
\`\`\`

**samconfig.toml**: stores deploy configuration (stack name, region, S3 bucket, capabilities). Committed to repo for consistent deployments.

**sam logs**: tail CloudWatch Logs for a Lambda function.

**sam traces**: view X-Ray traces.

**sam sync**: incremental deployment — syncs code changes directly without a full CloudFormation update (faster for Lambda code-only changes). Uses the \`--watch\` flag for continuous sync during development.`,
    },
    {
      heading: "SAM Policy Templates",
      body: `SAM provides **policy templates** as shorthand for common IAM permissions. These expand into full IAM policy statements.

Common templates:
- **DynamoDBCrudPolicy**: GetItem, PutItem, UpdateItem, DeleteItem, Query, Scan on a table
- **DynamoDBReadPolicy**: GetItem, Query, Scan
- **S3CrudPolicy**: PutObject, GetObject, DeleteObject on a bucket
- **S3ReadPolicy**: GetObject, ListBucket
- **SQSPollerPolicy**: ReceiveMessage, DeleteMessage, GetQueueAttributes
- **SQSSendMessagePolicy**: SendMessage on a queue
- **SNSPublishMessagePolicy**: Publish to a topic
- **VPCAccessPolicy**: ec2:CreateNetworkInterface, ec2:DescribeNetworkInterfaces (for Lambda VPC)
- **SecretsManagerRotationPolicy**: for rotation Lambda functions
- **CloudWatchPutMetricPolicy**: PutMetricData

\`\`\`yaml
Policies:
  - DynamoDBCrudPolicy:
      TableName: !Ref MyTable
  - SQSSendMessagePolicy:
      QueueName: !GetAtt MyQueue.QueueName
\`\`\`

**Why use templates?**: avoid writing verbose IAM JSON; built-in least privilege; maintained by AWS.`,
    },
    {
      heading: "Local Testing & Debugging",
      body: `**Docker requirement**: local testing requires Docker. SAM starts Lambda runtime containers.

**Test events**: JSON files representing events. SAM provides sample events for common sources:
\`\`\`
sam local generate-event apigateway aws-proxy > events/apigw.json
sam local generate-event s3 put > events/s3-put.json
\`\`\`

**Environment variable overrides**: pass additional env vars for local testing:
\`\`\`
sam local invoke --env-vars env.json
\`\`\`

**Debugging**: attach a debugger to the running container. SAM supports \`--debug-port\` flag. Configure VS Code launch.json to attach to the debugger.

**SAM Accelerate (sam sync)**: watch mode continuously syncs code changes to Lambda without full CloudFormation deployment. Dramatically speeds up the inner dev loop. Code-only changes deploy in seconds vs minutes.

**Integration testing**: test against real AWS services (not fully local). Use separate AWS account or SAM-deployed test stack.`,
    },
    {
      heading: "SAM with Other Services",
      body: `**SAM + CloudFormation**: SAM is a CloudFormation extension. SAM templates deploy via CloudFormation stacks. All CloudFormation features (parameters, outputs, conditionals, nested stacks) work in SAM templates.

**SAM + CodePipeline**: CodePipeline build stage runs \`sam build\`, deploy stage runs \`sam deploy\` (or uses CloudFormation action with SAM template).

**SAM + CodeBuild**: buildspec runs \`sam build && sam deploy\`. CodeBuild service role needs CloudFormation, S3, Lambda, API Gateway permissions.

**SAM + Lambda Layers**: define layers in SAM template; reference from multiple functions. Share dependencies (node_modules, Python packages, binary utilities).

**SAM + API Gateway**: SAM creates the API Gateway stage/resources from Events in Function definition. Add authorizers, CORS, usage plans in the Serverless::Api resource.

**SAM + Step Functions**: define state machines in SAM template with \`AWS::Serverless::StateMachine\`. Include Policies for the state machine role.

**SAM + X-Ray**: enable tracing on functions: \`Tracing: Active\`. SAM passes this to Lambda and generates appropriate IAM permissions.

**SAM + Secrets Manager**: reference secrets in Lambda environment via \`!Sub '{{resolve:secretsmanager:\${SecretName}:SecretString:key}}'\` or fetch in code with SDK.`,
    },
  ],

  keyFacts: [
    "Transform: AWS::Serverless-2016-10-31 — required header to activate SAM transform",
    "SAM resource types: Serverless::Function, ::Api, ::HttpApi, ::SimpleTable, ::LayerVersion",
    "sam build: compiles code + resolves dependencies into .aws-sam/build/",
    "sam local invoke: runs Lambda locally in Docker container with test event",
    "sam local start-api: local API Gateway at localhost:3000",
    "sam deploy --guided: interactive first deploy; writes samconfig.toml",
    "sam sync --watch: incremental code-only deploys without full CloudFormation (seconds, not minutes)",
    "SAM policy templates: DynamoDBCrudPolicy, S3CrudPolicy, SQSPollerPolicy (least-privilege shorthand)",
    "Globals section: set default Function properties (Runtime, Timeout, Environment)",
    "SAM stateMachine resource: define Step Functions state machines inline in SAM template",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon API Gateway",
    "Amazon DynamoDB",
    "AWS CloudFormation",
    "AWS CodePipeline",
    "AWS CodeBuild",
    "AWS Step Functions",
    "AWS X-Ray",
    "Amazon EventBridge",
  ],

  examTips: [
    "Transform: AWS::Serverless-2016-10-31 is REQUIRED in SAM templates.",
    "SAM deploys via CloudFormation stacks — all CF features available.",
    "sam sync: faster inner loop for Lambda code changes (seconds vs minutes).",
    "sam local: requires Docker to emulate Lambda runtime.",
    "SAM policy templates: shorthand for common IAM patterns — no manual policy writing.",
    "Globals: set defaults for all functions; individual function can override.",
    "HttpApi vs Api: HttpApi is HTTP API v2 (cheaper, faster); Api is REST API.",
    "sam local generate-event: generates test event JSON for common triggers.",
    "samconfig.toml: stores deploy config — commit it for reproducible team deployments.",
  ],
};
