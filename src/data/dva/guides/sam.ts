import { ServiceGuide } from "../../../types/guide";

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
      body: `A SAM template is a CloudFormation template with one key addition: the \`Transform: AWS::Serverless-2016-10-31\` declaration at the top. This tells CloudFormation's transform engine to expand SAM's shorthand resource types into their full CloudFormation equivalents before deployment. Without this transform declaration, the SAM-specific resource types would be rejected by CloudFormation.

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

The **Globals** section sets default property values that apply to all functions, APIs, or tables in the template. Individual resources can override any global setting. This eliminates the repetition of copying \`Runtime: nodejs20.x\` and \`Timeout: 30\` to every function definition — a significant quality-of-life improvement in templates with many functions. Because SAM generates standard CloudFormation under the hood, all CloudFormation features — parameters, outputs, conditionals, intrinsic functions, and nested stacks — work exactly as they do in native CloudFormation templates.`,
      quiz: [
        {
          question:
            "What is required at the top of every SAM template to activate the SAM transform?",
          options: [
            "Transform: AWS::Serverless-2016-10-31",
            "AWSTemplateFormatVersion: SAM-2016-10-31",
            "SAMVersion: 2016-10-31",
            "Type: AWS::SAM::Transform",
          ],
          correctIndex: 0,
          explanation:
            "The 'Transform: AWS::Serverless-2016-10-31' declaration is required at the top of every SAM template. It tells CloudFormation's transform engine to expand SAM shorthand resource types into full CloudFormation equivalents before deployment.",
        },
        {
          question:
            "What does the Globals section in a SAM template accomplish?",
          options: [
            "Sets default properties applied to all functions, APIs, or tables in the template",
            "Defines global IAM permissions for all resources",
            "Specifies the AWS region for deployment",
            "Declares shared environment variables visible across all AWS accounts",
          ],
          correctIndex: 0,
          explanation:
            "The Globals section sets default property values (like Runtime, Timeout, Environment) that apply to all functions, APIs, or tables. Individual resources can override any global setting, eliminating repetition across large templates.",
        },
      ],
    },
    {
      heading: "SAM Resource Types",
      body: `SAM introduces shorthand resource types that expand into the full set of CloudFormation resources a serverless application needs. A single \`AWS::Serverless::Function\` with an API event, for example, expands into a Lambda function, an API Gateway REST API, stages, deployment, and the permission that allows API Gateway to invoke the function — all from a few lines of SAM YAML.

**AWS::Serverless::Function** is the core type. Its \`Events\` block maps event sources to the function: \`Api\` and \`HttpApi\` for API Gateway, \`S3\` for object uploads, \`SQS\` for queue processing, \`SNS\` for topic subscriptions, \`DynamoDB\` for stream processing, \`EventBridge\` for event patterns, \`Schedule\` for cron/rate expressions, and \`IoT\` for IoT rules. The \`Policies\` block accepts SAM policy templates (described in the next section) or standard IAM policy documents.

**AWS::Serverless::Api** creates a REST API with configurable stages, authorizers, CORS settings, usage plans, and API keys. **AWS::Serverless::HttpApi** creates the newer HTTP API (API Gateway v2), which is cheaper, has lower latency, and supports JWT authorizers natively but has fewer features than REST API. **AWS::Serverless::SimpleTable** creates a DynamoDB table with a single primary key — the simplest possible DynamoDB configuration for straightforward use cases.

**AWS::Serverless::LayerVersion** packages shared code or dependencies (Node.js modules, Python packages, binaries) as a Lambda layer that multiple functions can reference. **AWS::Serverless::Application** embeds a SAM application from the Serverless Application Repository or another S3-hosted template, enabling nested application composition. **AWS::Serverless::StateMachine** defines a Step Functions state machine inline or from a separate JSON/YAML file.`,
      quiz: [
        {
          question:
            "What is the difference between AWS::Serverless::Api and AWS::Serverless::HttpApi in SAM?",
          options: [
            "HttpApi is API Gateway v2 (cheaper, lower latency, JWT auth); Api is REST API (more features)",
            "Api supports HTTP methods; HttpApi supports WebSockets only",
            "HttpApi requires a VPC; Api is public by default",
            "Api is the newer version that replaces HttpApi",
          ],
          correctIndex: 0,
          explanation:
            "AWS::Serverless::HttpApi creates an HTTP API (API Gateway v2) which is cheaper, has lower latency, and supports JWT authorizers natively. AWS::Serverless::Api creates a REST API with more features but higher cost and latency.",
        },
        {
          question:
            "Which SAM resource type would you use to define a Step Functions state machine in a SAM template?",
          options: [
            "AWS::Serverless::StateMachine",
            "AWS::Serverless::StepFunction",
            "AWS::Serverless::Workflow",
            "AWS::StepFunctions::StateMachine",
          ],
          correctIndex: 0,
          explanation:
            "AWS::Serverless::StateMachine is the SAM resource type for defining a Step Functions state machine. It can define the machine inline or reference a separate JSON/YAML file.",
        },
      ],
    },
    {
      heading: "SAM CLI",
      body: `The SAM CLI is the developer workflow tool that makes serverless development significantly faster than working with CloudFormation and Lambda directly.

**sam init** bootstraps a new project from a predefined template — Hello World, Step Functions, event-driven processing, and others — with the correct directory structure and a working template.

**sam build** compiles your application code and resolves dependencies, placing the build output in \`.aws-sam/build/\`. It respects \`BuildMethod\` in the template, so TypeScript projects can use esbuild for fast transpilation, and projects with complex build requirements can use a Makefile. Running \`sam build\` before deployment ensures you're deploying the compiled output, not raw source files.

**sam local invoke** runs a Lambda function in a Docker container matching the function's runtime:
\`\`\`
sam local invoke OrdersFunction --event events/order.json
\`\`\`
This lets you validate the function logic against a realistic event without deploying to AWS.

**sam local start-api** starts a local HTTP server at \`localhost:3000\` that emulates API Gateway, routing requests to the appropriate Lambda function containers. Combined with \`--warm-containers\`, containers are kept alive between requests, reducing the overhead of repeated testing.

**sam deploy** packages your build output to S3 and creates or updates the CloudFormation stack:
\`\`\`
sam deploy --guided  # interactive first-time setup
sam deploy           # subsequent deploys using samconfig.toml
\`\`\`
The \`samconfig.toml\` file stores deployment configuration — stack name, region, S3 bucket, capabilities — and is committed to the repository so the team deploys consistently. **sam sync** is an incremental deployment tool that detects code-only changes and syncs them directly to Lambda without a full CloudFormation update, reducing deployment time from minutes to seconds during active development. With \`--watch\`, it continuously syncs as you save files.`,
      quiz: [
        {
          question:
            "What does 'sam sync --watch' do that makes it faster than 'sam deploy'?",
          options: [
            "Detects code-only changes and updates Lambda directly without a full CloudFormation update",
            "Builds the project in parallel across multiple CPU cores",
            "Caches CloudFormation templates to avoid re-uploading to S3",
            "Skips validation steps to speed up the deployment pipeline",
          ],
          correctIndex: 0,
          explanation:
            "sam sync --watch detects code-only changes and syncs them directly to Lambda without running a full CloudFormation stack update. This reduces deployment time from minutes to seconds, creating a fast inner development loop.",
        },
        {
          question:
            "What file does 'sam deploy --guided' create for future deployments?",
          options: [
            "samconfig.toml",
            "sam-deploy.json",
            "template-config.yaml",
            ".sam/settings.toml",
          ],
          correctIndex: 0,
          explanation:
            "sam deploy --guided writes deployment configuration (stack name, region, S3 bucket, capabilities) to samconfig.toml. Subsequent 'sam deploy' calls read from this file for reproducible deployments.",
        },
      ],
    },
    {
      heading: "SAM Policy Templates",
      body: `SAM policy templates are one of the most practical features for day-to-day development. They're shorthand aliases for the IAM policy statements that serverless functions need most frequently, and they expand into proper least-privilege policies automatically.

Common templates include \`DynamoDBCrudPolicy\` (GetItem, PutItem, UpdateItem, DeleteItem, Query, Scan on a specified table), \`DynamoDBReadPolicy\` (GetItem, Query, Scan), \`S3CrudPolicy\` (PutObject, GetObject, DeleteObject on a bucket), \`S3ReadPolicy\` (GetObject, ListBucket), \`SQSPollerPolicy\` (ReceiveMessage, DeleteMessage, GetQueueAttributes for SQS event source mapping), \`SQSSendMessagePolicy\` (SendMessage to a queue), \`SNSPublishMessagePolicy\` (Publish to a topic), and \`VPCAccessPolicy\` (the ENI permissions Lambda needs to run in a VPC).

\`\`\`yaml
Policies:
  - DynamoDBCrudPolicy:
      TableName: !Ref MyTable
  - SQSSendMessagePolicy:
      QueueName: !GetAtt MyQueue.QueueName
\`\`\`

The value over writing raw IAM policies is threefold: you avoid writing verbose IAM JSON for common patterns, the templates are maintained by AWS so they reflect current best practices, and they're parameterized by resource reference so the permissions are automatically scoped to the correct resource ARN. You don't need to look up what permissions \`DynamoDBCrudPolicy\` grants — the name tells you what it does.`,
      quiz: [
        {
          question:
            "What IAM actions does the SAM DynamoDBCrudPolicy template grant?",
          options: [
            "GetItem, PutItem, UpdateItem, DeleteItem, Query, Scan",
            "GetItem, PutItem, UpdateItem only",
            "All DynamoDB actions including CreateTable and DeleteTable",
            "GetItem, Query, Scan (read-only)",
          ],
          correctIndex: 0,
          explanation:
            "DynamoDBCrudPolicy grants GetItem, PutItem, UpdateItem, DeleteItem, Query, and Scan on the specified table. It's scoped to data operations only — not admin operations like CreateTable or DeleteTable.",
        },
        {
          question:
            "Which SAM policy template grants the ENI permissions Lambda needs to run inside a VPC?",
          options: [
            "VPCAccessPolicy",
            "LambdaVPCPolicy",
            "NetworkInterfacePolicy",
            "SubnetAccessPolicy",
          ],
          correctIndex: 0,
          explanation:
            "VPCAccessPolicy is the SAM policy template that grants Lambda the ENI (Elastic Network Interface) permissions needed to run inside a VPC. It expands into the ec2:CreateNetworkInterface, ec2:DeleteNetworkInterface, and ec2:DescribeNetworkInterfaces permissions.",
        },
      ],
    },
    {
      heading: "Local Testing & Debugging",
      body: `SAM's local testing capabilities require Docker, which provides the Lambda runtime environment. When you run \`sam local invoke\` or \`sam local start-api\`, SAM pulls the appropriate Lambda runtime Docker image and runs your function code inside it, giving you an accurate representation of the actual Lambda execution environment.

Generating realistic test events is easier with \`sam local generate-event\`, which produces sample event JSON for any supported trigger type:
\`\`\`
sam local generate-event apigateway aws-proxy > events/apigw.json
sam local generate-event s3 put > events/s3-put.json
\`\`\`
You can then customize these generated events to match your specific test cases and commit them to the repository as test fixtures.

For debugging, the \`--debug-port\` flag keeps the container running and exposes a debug port that you can attach to from VS Code or another IDE. This gives you full breakpoint debugging inside a Lambda-compatible container without any mock frameworks. Environment variables can be overridden for local testing using \`--env-vars env.json\`, allowing you to point to local or test services without changing the template.

**SAM Accelerate** (the \`sam sync --watch\` mode) is the most impactful productivity feature for active development. Rather than running a full CloudFormation update on every change — which can take several minutes — \`sam sync\` detects code-only changes and updates the Lambda function directly, completing in seconds. This transforms the inner development loop from a multi-minute cycle into a near-instant feedback loop.`,
      quiz: [
        {
          question:
            "What is required on your local machine to run 'sam local invoke' or 'sam local start-api'?",
          options: [
            "Docker, to run the Lambda runtime environment locally",
            "An active AWS account with Lambda permissions",
            "The AWS CDK toolkit installed",
            "A running EC2 instance in the same region",
          ],
          correctIndex: 0,
          explanation:
            "SAM local testing commands require Docker because SAM pulls the appropriate Lambda runtime Docker image and runs your function code inside it, providing an accurate local representation of the Lambda execution environment.",
        },
        {
          question:
            "How would you generate a sample S3 PutObject event JSON for local testing with SAM?",
          options: [
            "sam local generate-event s3 put",
            "sam generate-event --type s3 --action put",
            "sam local invoke --generate-event s3",
            "sam event create --source s3 --trigger put",
          ],
          correctIndex: 0,
          explanation:
            "The command 'sam local generate-event s3 put' generates sample event JSON for an S3 PutObject event. You can redirect the output to a file and customize it as a test fixture.",
        },
      ],
    },
    {
      heading: "SAM with Other Services",
      body: `**SAM + CloudFormation** is the foundational relationship: SAM templates deploy as CloudFormation stacks, with the SAM transform expanding shorthand types before CloudFormation processes them. All CloudFormation capabilities are available — parameters, outputs, conditionals, intrinsic functions, stack references, and nested stacks. You can mix SAM shorthand types and native CloudFormation types freely in the same template.

**SAM + CodePipeline and CodeBuild** is the standard CI/CD pattern for SAM applications. A buildspec.yml runs \`sam build\` followed by \`sam deploy\`, with the CodeBuild service role granted permissions for CloudFormation, S3, Lambda, and API Gateway. CodePipeline orchestrates the source, build, and deploy stages, triggering on code commits.

**SAM + Lambda Layers** works through the \`AWS::Serverless::LayerVersion\` resource type. Shared code (utility libraries, database drivers, authentication middleware) goes in a layer referenced by multiple functions, reducing deployment package size and enabling updates to shared code without touching every function that uses it.

**SAM + API Gateway** is handled automatically through the Events block on functions. When you add an \`Api\` event, SAM creates the REST API, stage, deployment, and invoke permission. Authorizers, CORS, usage plans, and API keys are configured on the \`AWS::Serverless::Api\` resource that SAM creates or that you define explicitly in the template.

**SAM + X-Ray** requires a single line in the function definition: \`Tracing: Active\`. SAM sets the Lambda tracing mode, adds the required \`xray:PutTraceSegments\` permission to the function's execution role, and enables X-Ray in the API Gateway stage if you're using one. The \`sam traces\` CLI command pulls recent X-Ray traces for quick debugging after deployment.`,
      quiz: [
        {
          question:
            "How do you enable X-Ray tracing for a Lambda function defined in a SAM template?",
          options: [
            "Add 'Tracing: Active' to the function definition in the SAM template",
            "Install the X-Ray SDK and call xray.init() in the handler",
            "Add a separate AWS::XRay::SamplingRule resource to the template",
            "Enable tracing in the Globals section under API settings",
          ],
          correctIndex: 0,
          explanation:
            "Adding 'Tracing: Active' to a SAM function definition enables X-Ray. SAM automatically sets the Lambda tracing mode and adds the required xray:PutTraceSegments permission to the function's execution role.",
        },
        {
          question:
            "In a SAM + CodeBuild CI/CD pipeline, what two SAM CLI commands does the buildspec.yml typically run?",
          options: [
            "sam build followed by sam deploy",
            "sam init followed by sam package",
            "sam validate followed by sam publish",
            "sam build followed by sam sync",
          ],
          correctIndex: 0,
          explanation:
            "The standard SAM CI/CD pattern uses 'sam build' to compile and resolve dependencies, then 'sam deploy' to package artifacts to S3 and create/update the CloudFormation stack.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A developer wants to deploy a SAM application for the first time. Which command should they run?",
      options: [
        "sam deploy --guided",
        "sam init --deploy",
        "sam publish --first-run",
        "sam package --deploy",
      ],
      correctIndex: 0,
      explanation:
        "sam deploy --guided runs an interactive setup that prompts for stack name, region, S3 bucket, and capabilities, then writes the answers to samconfig.toml for future deployments.",
    },
    {
      question:
        "What must be present in a SAM template for CloudFormation to process SAM-specific resource types?",
      options: [
        "Transform: AWS::Serverless-2016-10-31",
        "SAMVersion: latest",
        "Mode: Serverless",
        "AWSTemplateFormatVersion: SAM",
      ],
      correctIndex: 0,
      explanation:
        "Transform: AWS::Serverless-2016-10-31 is required to activate the SAM transform engine. Without it, CloudFormation rejects SAM resource types like AWS::Serverless::Function.",
    },
    {
      question:
        "A SAM template defines 10 Lambda functions. A developer wants all functions to use Python 3.12 without repeating the Runtime property 10 times. What is the best approach?",
      options: [
        "Use the Globals section to set Runtime: python3.12 for all functions",
        "Create a custom CloudFormation macro to inject the runtime",
        "Use a for loop with CloudFormation conditions",
        "Set a default runtime in samconfig.toml",
      ],
      correctIndex: 0,
      explanation:
        "The Globals section sets default properties for all functions. Setting Runtime: python3.12 in Globals.Function applies it to every Lambda function in the template, with individual functions able to override if needed.",
    },
    {
      question:
        "A developer is actively coding a Lambda function and wants changes to deploy in seconds rather than minutes. Which SAM command should they use?",
      options: [
        "sam sync --watch",
        "sam deploy --fast",
        "sam build --incremental",
        "sam local hot-reload",
      ],
      correctIndex: 0,
      explanation:
        "sam sync --watch detects code-only changes and updates Lambda directly without a full CloudFormation stack update, completing in seconds. It watches for file changes and continuously syncs.",
    },
    {
      question:
        "What is the primary advantage of SAM policy templates like DynamoDBCrudPolicy over writing raw IAM policies?",
      options: [
        "They are shorthand for common IAM patterns, maintained by AWS, and automatically scoped to the specified resource",
        "They grant broader permissions to ensure Lambda functions never get permission denied errors",
        "They skip IAM validation, making deployments faster",
        "They are stored in Parameter Store and can be updated without redeploying",
      ],
      correctIndex: 0,
      explanation:
        "SAM policy templates are shorthand for common patterns (like DynamoDB CRUD operations), maintained by AWS with current best practices, and automatically scoped to the resource ARN you specify. They eliminate writing verbose IAM JSON.",
    },
    {
      question:
        "Which SAM command is used to run a Lambda function locally with a test event?",
      options: [
        "sam local invoke FunctionName --event events/test.json",
        "sam test invoke FunctionName --payload events/test.json",
        "sam run local FunctionName --event events/test.json",
        "sam execute FunctionName --event events/test.json",
      ],
      correctIndex: 0,
      explanation:
        "sam local invoke runs a Lambda function in a Docker container matching the function's runtime. The --event flag specifies the JSON event file to pass to the handler.",
    },
    {
      question:
        "A team wants to run SAM in a CodeBuild CI/CD pipeline. What two SAM CLI commands should the buildspec.yml include?",
      options: [
        "sam build and sam deploy",
        "sam init and sam package",
        "sam validate and sam publish",
        "sam build and sam sync",
      ],
      correctIndex: 0,
      explanation:
        "The standard CI/CD pattern runs 'sam build' to compile code and resolve dependencies, then 'sam deploy' to upload artifacts and create/update the CloudFormation stack.",
    },
    {
      question:
        "A developer adds an Api event to an AWS::Serverless::Function. What CloudFormation resources does SAM automatically create?",
      options: [
        "Lambda function, API Gateway REST API, stage, deployment, and invoke permission",
        "Lambda function and API Gateway only",
        "Lambda function, API Gateway, and an IAM role",
        "Lambda function and a CloudFront distribution",
      ],
      correctIndex: 0,
      explanation:
        "When you add an Api event, SAM expands it into a Lambda function, an API Gateway REST API, stages, deployment, and the resource-based permission that allows API Gateway to invoke the function — all from a few lines of YAML.",
    },
  ],
};
