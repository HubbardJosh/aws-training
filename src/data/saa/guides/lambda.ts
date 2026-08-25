import { ServiceGuide } from "../../../types/guide";

export const lambdaGuide: ServiceGuide = {
  id: "saa-lambda",
  service: "AWS Lambda",
  domain: "development",
  tagline: "Run code without provisioning servers — pay only for what you use",
  intro:
    "AWS Lambda executes code in response to events without requiring you to provision or manage servers, automatically scaling from zero to thousands of concurrent executions and charging only for the compute time consumed, making it the foundation of serverless architectures on AWS.",

  sections: [
    {
      heading: "Lambda Execution Model and Invocation Types",
      body: `Lambda functions are invoked in three ways that determine error handling and scaling behavior. Synchronous invocation waits for the function to complete and returns the result directly — API Gateway, ALB, and Cognito triggers use synchronous invocation, so the caller is blocked and receives the function's response or error. Asynchronous invocation places the event in an internal queue and returns immediately — S3 event notifications, SNS, and EventBridge use async invocation; Lambda retries failed async invocations up to two additional times with delays between attempts, and a Dead Letter Queue (DLQ) or Lambda Destinations can capture events that exhaust all retries. Event source mapping is used for streaming and queue sources — Lambda polls SQS queues, Kinesis Data Streams, DynamoDB Streams, and MSK topics, processing batches of records; failed batch processing can be configured to send partial batch failures to SQS or SNS via Lambda Destinations rather than retrying the entire batch.`,
    },
    {
      heading: "Concurrency, Throttling, and Scaling",
      body: `Lambda scales by launching additional concurrent execution environments in response to incoming events. The account-level concurrency limit (default 1,000 per region) is shared across all functions — if one function consumes all concurrency, other functions are throttled. Reserved concurrency allocates a fixed maximum concurrency to a specific function, guaranteeing it is never starved by other functions and simultaneously capping its maximum concurrency to prevent runaway scaling. Provisioned concurrency pre-initializes a specified number of execution environments, keeping them warm and ready to respond instantly without the cold start latency that occurs when Lambda must initialize a new runtime. Cold starts are most impactful for latency-sensitive synchronous workloads — provisioned concurrency is the solution for consistent sub-100ms response times. The Lambda burst limit controls how quickly concurrency scales up in a region (typically 500–3,000 concurrent executions per minute depending on region), after which scaling proceeds at 500 additional concurrent executions per minute.`,
    },
    {
      heading: "Event-Driven Architecture Patterns",
      body: `Lambda integrates natively with dozens of AWS services as both trigger sources and downstream targets, enabling rich event-driven architectures. The fan-out pattern uses SNS to publish an event that triggers multiple Lambda functions simultaneously — each subscriber processes the event independently, enabling parallel processing pipelines. The queue-based load leveling pattern uses SQS between the event source and Lambda, buffering bursts so Lambda processes at a controlled rate without overwhelming downstream databases or APIs. The choreography pattern uses EventBridge as a central event bus — services publish events without knowing who consumes them, and Lambda subscribers filter and react to relevant events, reducing coupling between services. Step Functions orchestrate Lambda functions into stateful workflows with branching, parallel execution, error handling, and retries defined in a state machine, making complex multi-step business processes observable and manageable without embedding orchestration logic in Lambda code.`,
    },
    {
      heading: "Lambda Layers, Container Images, and Deployment",
      body: `Lambda packages come in two forms. ZIP deployments bundle function code and dependencies into a ZIP archive up to 250 MB unzipped; Lambda Layers extract shared dependencies (libraries, runtimes, configuration) into separate archives that multiple functions share, reducing deployment package size and enabling centralized updates to shared libraries. Container image deployments package function code and all dependencies into a Docker container image up to 10 GB, enabling Lambda to run workloads with complex dependency trees that exceed ZIP size limits or require specific OS packages. Container images must implement the Lambda Runtime Interface to handle invocation events. Lambda supports custom runtimes via the Runtime Interface Client, enabling any language (Rust, C++, COBOL) beyond the natively supported Node.js, Python, Java, Go, .NET, and Ruby runtimes. Function versioning and aliases enable blue/green deployments at the Lambda level: aliases point to specific versions, and traffic shifting (weighted aliases) gradually shifts invocations from one version to another.`,
    },
    {
      heading: "VPC Integration and Security",
      body: `By default, Lambda functions run in an AWS-managed VPC with internet access but without access to resources in your private VPC. Attaching a Lambda function to a VPC places it in a specified subnet with access to VPC resources like RDS databases, ElastiCache clusters, and internal services — but outbound internet access then requires a NAT Gateway in a public subnet. Lambda functions in a VPC use Elastic Network Interfaces (ENIs) managed by AWS Hyperplane; the function must have sufficient ENI capacity in the subnet to accommodate peak concurrency. Lambda execution roles define what AWS services the function can call — following least-privilege, each function should have a role granting only the specific permissions it needs. Environment variables store configuration (database endpoints, feature flags) and can be encrypted with a KMS key. Secrets Manager or SSM Parameter Store are preferred for sensitive values, with Lambda fetching and caching them at initialization time.`,
    },
    {
      heading: "Lambda and API Gateway for Serverless APIs",
      body: `Amazon API Gateway combined with Lambda is the canonical serverless REST or HTTP API pattern — API Gateway handles request routing, authentication, throttling, and HTTPS termination while Lambda executes business logic without managing servers. HTTP APIs (API Gateway v2) are faster and cheaper than REST APIs for proxy integrations with Lambda, supporting JWT and IAM authorization but fewer features. REST APIs support more advanced features: request/response transformation, usage plans, API keys, custom domain names with ACM certificates, and direct service proxy integrations to DynamoDB or S3. Lambda Authorizers (custom authorizers) execute a Lambda function to validate bearer tokens or request parameters and return an IAM policy, enabling custom authentication schemes. For high-throughput, low-latency APIs, Lambda with provisioned concurrency and API Gateway with caching enabled can deliver consistent single-digit millisecond API response times at scale.`,
    },
  ],

  keyFacts: [
    "Synchronous invocation blocks and returns a result; asynchronous invocation queues the event and returns immediately",
    "Reserved concurrency guarantees and caps a function's concurrency; Provisioned concurrency pre-warms environments",
    "Default account concurrency limit is 1,000 per region — shared across all functions",
    "Lambda retries async invocations up to 2 additional times; DLQ/Destinations capture final failures",
    "ZIP deployments: 250 MB unzipped limit; Container images: 10 GB limit",
    "Lambda Layers share common dependencies across multiple functions",
    "VPC-attached Lambda needs a NAT Gateway for outbound internet access",
    "Lambda execution role = IAM role defining what AWS services the function can call",
    "Provisioned concurrency eliminates cold starts for latency-sensitive synchronous workloads",
    "Lambda Aliases + weighted traffic shifting enable blue/green and canary deployments",
  ],

  relatedServices: [
    "Amazon API Gateway",
    "Amazon SQS",
    "Amazon SNS",
    "Amazon EventBridge",
    "AWS Step Functions",
    "Amazon DynamoDB",
  ],

  examTips: [
    "Async invocation retries 2x automatically — use DLQ or Lambda Destinations to capture failures",
    "Reserved concurrency = ceiling AND guarantee; Provisioned concurrency = pre-warmed environments",
    "Lambda in a VPC requires a NAT Gateway for internet access — no direct internet from private subnet",
    "Cold starts affect synchronous latency-sensitive workloads — provisioned concurrency is the fix",
    "HTTP API (v2) is cheaper and faster than REST API for simple Lambda proxy integrations",
    "SQS event source mapping processes batches — use partial batch failure reporting to avoid reprocessing successes",
    "Step Functions orchestrate Lambda into stateful workflows — do not embed orchestration in Lambda code",
    "Environment variables for config; Secrets Manager for credentials — never hardcode secrets",
  ],
};
