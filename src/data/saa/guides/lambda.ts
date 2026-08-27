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
      quiz: [
        {
          question:
            "An S3 event notification triggers a Lambda function that fails during execution. How many total attempts does Lambda make by default for this asynchronous invocation?",
          options: ["1 attempt", "2 attempts", "3 attempts", "5 attempts"],
          correctIndex: 2,
          explanation:
            "For asynchronous invocations (such as S3 event notifications), Lambda retries failed invocations up to 2 additional times, for a total of 3 attempts. If all attempts fail, the event can be captured by a configured DLQ or Lambda Destination for further investigation.",
        },
        {
          question:
            "Which invocation type is used when API Gateway calls a Lambda function and waits for the response?",
          options: [
            "Asynchronous invocation",
            "Event source mapping",
            "Synchronous invocation",
            "Scheduled invocation",
          ],
          correctIndex: 2,
          explanation:
            "API Gateway uses synchronous invocation — it blocks and waits for the Lambda function to complete, then returns the result (or error) to the caller. Asynchronous invocation places the event in a queue and returns immediately. Event source mapping is used for streaming/queue sources like Kinesis and SQS.",
        },
        {
          question:
            "Lambda uses event source mapping to consume from which types of sources?",
          options: [
            "API Gateway, ALB, and Cognito",
            "S3, SNS, and EventBridge",
            "SQS, Kinesis Data Streams, DynamoDB Streams, and MSK",
            "CloudWatch Events and Step Functions",
          ],
          correctIndex: 2,
          explanation:
            "Event source mapping is used for polling-based sources where Lambda reads batches of records: SQS queues, Kinesis Data Streams, DynamoDB Streams, and Amazon MSK topics. API Gateway uses synchronous invocation, and S3/SNS/EventBridge use asynchronous invocation.",
        },
      ],
    },
    {
      heading: "Concurrency, Throttling, and Scaling",
      body: `Lambda scales by launching additional concurrent execution environments in response to incoming events. The account-level concurrency limit (default 1,000 per region) is shared across all functions — if one function consumes all concurrency, other functions are throttled. Reserved concurrency allocates a fixed maximum concurrency to a specific function, guaranteeing it is never starved by other functions and simultaneously capping its maximum concurrency to prevent runaway scaling. Provisioned concurrency pre-initializes a specified number of execution environments, keeping them warm and ready to respond instantly without the cold start latency that occurs when Lambda must initialize a new runtime. Cold starts are most impactful for latency-sensitive synchronous workloads — provisioned concurrency is the solution for consistent sub-100ms response times. The Lambda burst limit controls how quickly concurrency scales up in a region (typically 500–3,000 concurrent executions per minute depending on region), after which scaling proceeds at 500 additional concurrent executions per minute.`,
      quiz: [
        {
          question:
            "A critical Lambda function is occasionally starved of concurrency because other functions in the account consume the shared limit. What feature guarantees dedicated concurrency for this function?",
          options: [
            "Provisioned concurrency",
            "Reserved concurrency",
            "Enhanced concurrency mode",
            "Lambda@Edge deployment",
          ],
          correctIndex: 1,
          explanation:
            "Reserved concurrency allocates a dedicated pool of concurrency to a specific function, guaranteeing it is never starved by other functions consuming the account's shared concurrency limit. It also simultaneously caps the function's maximum concurrency. Provisioned concurrency pre-warms environments to eliminate cold starts, but does not prevent starvation.",
        },
        {
          question:
            "A latency-sensitive API backed by Lambda experiences intermittent cold start delays of 500ms on the first request after a period of inactivity. What is the recommended solution?",
          options: [
            "Increase the Lambda function's memory allocation",
            "Enable Reserved concurrency for the function",
            "Enable Provisioned concurrency for the function",
            "Move the function to a container image deployment",
          ],
          correctIndex: 2,
          explanation:
            "Provisioned concurrency pre-initializes a specified number of execution environments, eliminating cold start latency. These environments are kept warm and ready to respond instantly. Increasing memory can reduce cold start duration but does not eliminate it. Provisioned concurrency is the definitive solution for cold start elimination in latency-sensitive workloads.",
        },
        {
          question:
            "What is the default account-level concurrent execution limit for Lambda in a single region?",
          options: [
            "100 concurrent executions",
            "500 concurrent executions",
            "1,000 concurrent executions",
            "10,000 concurrent executions",
          ],
          correctIndex: 2,
          explanation:
            "The default account-level concurrency limit is 1,000 concurrent executions per region, shared across all Lambda functions in the account. This limit can be increased via a service quota request. If one function uses all 1,000, other functions will be throttled until concurrency becomes available.",
        },
      ],
    },
    {
      heading: "Event-Driven Architecture Patterns",
      body: `Lambda integrates natively with dozens of AWS services as both trigger sources and downstream targets, enabling rich event-driven architectures. The fan-out pattern uses SNS to publish an event that triggers multiple Lambda functions simultaneously — each subscriber processes the event independently, enabling parallel processing pipelines. The queue-based load leveling pattern uses SQS between the event source and Lambda, buffering bursts so Lambda processes at a controlled rate without overwhelming downstream databases or APIs. The choreography pattern uses EventBridge as a central event bus — services publish events without knowing who consumes them, and Lambda subscribers filter and react to relevant events, reducing coupling between services. Step Functions orchestrate Lambda functions into stateful workflows with branching, parallel execution, error handling, and retries defined in a state machine, making complex multi-step business processes observable and manageable without embedding orchestration logic in Lambda code.`,
      quiz: [
        {
          question:
            "A multi-step business process requires Lambda functions to execute in sequence with error handling, retries, and branching logic. Which service should orchestrate this workflow?",
          options: [
            "Amazon SNS with multiple subscriptions",
            "Amazon EventBridge with routing rules",
            "AWS Step Functions state machine",
            "Amazon SQS FIFO queue with ordering",
          ],
          correctIndex: 2,
          explanation:
            "AWS Step Functions orchestrates Lambda functions into stateful workflows with branching, parallel execution, error handling, and configurable retries defined in a state machine. This keeps orchestration logic outside of Lambda code and makes complex workflows observable. SNS and EventBridge are for event routing, not stateful workflow orchestration.",
        },
        {
          question:
            "An API endpoint receives traffic spikes that would overwhelm a downstream database. Which pattern should be used to buffer requests and process them at a sustainable rate?",
          options: [
            "SNS fan-out to multiple Lambda functions",
            "SQS queue between the API and Lambda for queue-based load leveling",
            "EventBridge scheduled rule to throttle processing",
            "Lambda reserved concurrency set to match database capacity",
          ],
          correctIndex: 1,
          explanation:
            "The queue-based load leveling pattern places an SQS queue between the API and Lambda. The queue absorbs traffic bursts, and Lambda processes messages at a controlled rate determined by the batch size and concurrency settings, preventing the downstream database from being overwhelmed. This decouples the spike absorption from the processing rate.",
        },
      ],
    },
    {
      heading: "Lambda Layers, Container Images, and Deployment",
      body: `Lambda packages come in two forms. ZIP deployments bundle function code and dependencies into a ZIP archive up to 250 MB unzipped; Lambda Layers extract shared dependencies (libraries, runtimes, configuration) into separate archives that multiple functions share, reducing deployment package size and enabling centralized updates to shared libraries. Container image deployments package function code and all dependencies into a Docker container image up to 10 GB, enabling Lambda to run workloads with complex dependency trees that exceed ZIP size limits or require specific OS packages. Container images must implement the Lambda Runtime Interface to handle invocation events. Lambda supports custom runtimes via the Runtime Interface Client, enabling any language (Rust, C++, COBOL) beyond the natively supported Node.js, Python, Java, Go, .NET, and Ruby runtimes. Function versioning and aliases enable blue/green deployments at the Lambda level: aliases point to specific versions, and traffic shifting (weighted aliases) gradually shifts invocations from one version to another.`,
      quiz: [
        {
          question:
            "A Lambda function shares a large machine learning library (150 MB) with 10 other functions. What is the best way to avoid including this library in each function's deployment package?",
          options: [
            "Upload the library to S3 and download it at function initialization",
            "Use a Lambda Layer to package the shared library once and attach it to all functions",
            "Use a container image deployment for each function",
            "Store the library in /tmp and share it across invocations",
          ],
          correctIndex: 1,
          explanation:
            "Lambda Layers are purpose-built for sharing common dependencies (libraries, runtimes, configuration) across multiple functions. The layer is uploaded once and attached to multiple functions, reducing each function's deployment package size and enabling centralized updates. The /tmp directory is ephemeral per execution environment and cannot be shared across functions.",
        },
        {
          question:
            "What is the maximum deployment package size for a Lambda function using a container image?",
          options: ["250 MB", "1 GB", "5 GB", "10 GB"],
          correctIndex: 3,
          explanation:
            "Lambda container image deployments support images up to 10 GB, significantly larger than the 250 MB unzipped limit for ZIP deployments. Container images are suitable for workloads with complex dependency trees, large ML models, or requirements for specific OS packages that cannot fit within the ZIP size constraint.",
        },
        {
          question:
            "How can a Lambda deployment gradually shift traffic from version 1 to version 2 to enable a canary or blue/green release?",
          options: [
            "Using Lambda Layers with version pinning",
            "Using a Lambda alias with weighted traffic shifting between two versions",
            "Using a separate Lambda function per version behind an ALB",
            "Using Lambda@Edge for geographic traffic shifting",
          ],
          correctIndex: 1,
          explanation:
            "Lambda aliases can be configured with weighted traffic shifting to send a percentage of invocations to one version and the remainder to another. For example, 90% to v1 and 10% to v2 enables canary testing. Once confident, traffic can be shifted to 100% v2. This enables blue/green and canary deployments at the Lambda function level.",
        },
      ],
    },
    {
      heading: "VPC Integration and Security",
      body: `By default, Lambda functions run in an AWS-managed VPC with internet access but without access to resources in your private VPC. Attaching a Lambda function to a VPC places it in a specified subnet with access to VPC resources like RDS databases, ElastiCache clusters, and internal services — but outbound internet access then requires a NAT Gateway in a public subnet. Lambda functions in a VPC use Elastic Network Interfaces (ENIs) managed by AWS Hyperplane; the function must have sufficient ENI capacity in the subnet to accommodate peak concurrency. Lambda execution roles define what AWS services the function can call — following least-privilege, each function should have a role granting only the specific permissions it needs. Environment variables store configuration (database endpoints, feature flags) and can be encrypted with a KMS key. Secrets Manager or SSM Parameter Store are preferred for sensitive values, with Lambda fetching and caching them at initialization time.`,
      quiz: [
        {
          question:
            "A Lambda function is configured to run inside a private VPC subnet to access an RDS database. The function also needs to call an external third-party API over the internet. What is required?",
          options: [
            "Attach an Elastic IP to the Lambda function",
            "Deploy the Lambda function in a public subnet with an Internet Gateway",
            "Add a NAT Gateway in a public subnet and update the private subnet's route table",
            "Enable VPC peering between the Lambda VPC and the internet",
          ],
          correctIndex: 2,
          explanation:
            "When a Lambda function is in a private VPC subnet, it loses direct internet access. To enable outbound internet connectivity, a NAT Gateway must be deployed in a public subnet, and the private subnet's route table must route 0.0.0.0/0 traffic to the NAT Gateway. Lambda functions in a VPC cannot directly use an Internet Gateway.",
        },
        {
          question:
            "Where should sensitive credentials (database passwords, API keys) be stored for Lambda functions, rather than in environment variables?",
          options: [
            "In the Lambda function's /tmp directory",
            "Hardcoded in the function source code",
            "In AWS Secrets Manager or SSM Parameter Store",
            "In an S3 bucket with restricted access",
          ],
          correctIndex: 2,
          explanation:
            "AWS Secrets Manager and SSM Parameter Store are the recommended stores for sensitive credentials. Lambda functions retrieve and cache these secrets at initialization time. Environment variables can store non-sensitive configuration but should not contain sensitive credentials even when encrypted with KMS, as they are visible to anyone with access to the Lambda console.",
        },
      ],
    },
    {
      heading: "Lambda and API Gateway for Serverless APIs",
      body: `Amazon API Gateway combined with Lambda is the canonical serverless REST or HTTP API pattern — API Gateway handles request routing, authentication, throttling, and HTTPS termination while Lambda executes business logic without managing servers. HTTP APIs (API Gateway v2) are faster and cheaper than REST APIs for proxy integrations with Lambda, supporting JWT and IAM authorization but fewer features. REST APIs support more advanced features: request/response transformation, usage plans, API keys, custom domain names with ACM certificates, and direct service proxy integrations to DynamoDB or S3. Lambda Authorizers (custom authorizers) execute a Lambda function to validate bearer tokens or request parameters and return an IAM policy, enabling custom authentication schemes. For high-throughput, low-latency APIs, Lambda with provisioned concurrency and API Gateway with caching enabled can deliver consistent single-digit millisecond API response times at scale.`,
      quiz: [
        {
          question:
            "A team is building a simple Lambda proxy API and wants the lowest cost and lowest latency API Gateway option. Which API Gateway type should they choose?",
          options: [
            "REST API (API Gateway v1) with usage plans",
            "HTTP API (API Gateway v2)",
            "WebSocket API",
            "Private API with VPC endpoint",
          ],
          correctIndex: 1,
          explanation:
            "HTTP APIs (API Gateway v2) are faster and cheaper than REST APIs for Lambda proxy integrations. They support JWT and IAM authorization and are the recommended choice when the advanced features of REST APIs (request/response transformation, usage plans, service proxy integrations) are not needed.",
        },
        {
          question:
            "Which API Gateway feature allows a Lambda function to validate a bearer token and return an IAM policy to authorize or deny the request?",
          options: [
            "Usage Plans with API Keys",
            "Lambda Authorizer (Custom Authorizer)",
            "Cognito User Pool Authorizer",
            "IAM authorization with SigV4 signing",
          ],
          correctIndex: 1,
          explanation:
            "A Lambda Authorizer executes a Lambda function to validate the incoming bearer token or request parameters and returns an IAM policy document that allows or denies the request. This enables custom authentication schemes beyond what built-in JWT or Cognito authorizers support.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "An S3 event notification invokes a Lambda function asynchronously. The function fails on the first attempt. How many more times will Lambda retry by default?",
      options: ["0 more times", "1 more time", "2 more times", "4 more times"],
      correctIndex: 2,
      explanation:
        "For asynchronous Lambda invocations, Lambda automatically retries failed executions up to 2 additional times (for a total of 3 attempts) with delays between attempts. If all 3 attempts fail, the event can be sent to a DLQ or Lambda Destination for further handling.",
    },
    {
      question:
        "A Lambda function requires guaranteed concurrency even when other functions in the account are consuming the shared limit. Which feature provides this?",
      options: [
        "Provisioned concurrency",
        "Reserved concurrency",
        "Lambda@Edge deployment",
        "Increasing the account concurrency limit",
      ],
      correctIndex: 1,
      explanation:
        "Reserved concurrency allocates a dedicated concurrency pool to a specific function, ensuring it is never starved by other functions. It also caps the function's maximum concurrency. Provisioned concurrency pre-warms environments to eliminate cold starts, not to guarantee concurrency availability.",
    },
    {
      question:
        "A Lambda function needs to access an RDS database in a private subnet AND call an external payment API over the internet. What VPC configuration is required?",
      options: [
        "Attach the Lambda to a public subnet with an Internet Gateway",
        "Use VPC peering between the Lambda VPC and the payment provider",
        "Attach the Lambda to a private subnet and add a NAT Gateway in a public subnet",
        "Use an interface VPC endpoint for the external payment API",
      ],
      correctIndex: 2,
      explanation:
        "A Lambda function in a private subnet has access to VPC resources like RDS but no direct internet access. To reach external internet services, traffic from the private subnet must route through a NAT Gateway in a public subnet. The NAT Gateway allows outbound-only internet connectivity.",
    },
    {
      question:
        "Which Lambda deployment package type supports up to 10 GB and is suitable for workloads with large ML models or complex dependency trees?",
      options: [
        "ZIP deployment with Lambda Layers",
        "Container image deployment",
        "S3-hosted ZIP with extended size limit",
        "Lambda@Edge deployment",
      ],
      correctIndex: 1,
      explanation:
        "Container image deployments support images up to 10 GB, which is significantly larger than the 250 MB unzipped ZIP limit. Container images are ideal for workloads with large ML models, complex dependency trees, or requirements for specific OS packages. The image must implement the Lambda Runtime Interface.",
    },
    {
      question:
        "Which API Gateway type is cheaper and faster for simple Lambda proxy integrations?",
      options: [
        "REST API (API Gateway v1)",
        "HTTP API (API Gateway v2)",
        "WebSocket API",
        "GraphQL API via AppSync",
      ],
      correctIndex: 1,
      explanation:
        "HTTP APIs (API Gateway v2) have lower latency and lower cost than REST APIs for Lambda proxy integrations. They are the recommended choice for simple use cases. REST APIs are needed only when advanced features like request/response transformation, usage plans, or direct service integrations are required.",
    },
    {
      question:
        "A Lambda function processes SQS messages in batches of 10. Three messages in a batch fail. What is the default behavior?",
      options: [
        "Only the 3 failed messages are retried",
        "All 10 messages in the batch are retried",
        "Failed messages are sent to the SQS DLQ immediately",
        "The batch is split into successful and failed sub-batches",
      ],
      correctIndex: 1,
      explanation:
        "By default, if any message in an SQS batch fails, the entire batch becomes visible again and all messages are retried, including the 7 that succeeded. To retry only the failed messages, you must enable 'Report Batch Item Failures' on the event source mapping, which lets Lambda return only the IDs of failed messages.",
    },
    {
      question:
        "How can a Lambda function progressively roll out a new version, sending 10% of traffic to the new version while keeping 90% on the old version?",
      options: [
        "Use two separate Lambda functions behind a weighted ALB listener rule",
        "Use a Lambda alias with weighted traffic shifting between two published versions",
        "Use Lambda@Edge with geographic routing",
        "Deploy the new version as a Lambda Layer and gradually update functions",
      ],
      correctIndex: 1,
      explanation:
        "Lambda aliases support weighted traffic shifting, allowing a percentage of invocations to be directed to one version and the remainder to another. This enables canary deployments (e.g., 10% new, 90% old) that can be gradually shifted as confidence grows, all through a single alias endpoint.",
    },
    {
      question:
        "Which AWS service should orchestrate a multi-step Lambda workflow with branching logic, error handling, and retries, rather than embedding this logic in the Lambda code itself?",
      options: [
        "Amazon EventBridge with multiple rules",
        "Amazon SNS with conditional filtering",
        "AWS Step Functions state machine",
        "Amazon SQS FIFO queue with message groups",
      ],
      correctIndex: 2,
      explanation:
        "AWS Step Functions provides a visual state machine for orchestrating Lambda functions with branching, parallel execution, error catching, and configurable retries. Keeping orchestration logic in Step Functions (rather than in Lambda code) makes workflows observable, maintainable, and easier to debug.",
    },
  ],
};
