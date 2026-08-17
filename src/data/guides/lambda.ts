import { ServiceGuide } from "../../types/guide";

export const lambdaGuide: ServiceGuide = {
  id: "aws-lambda",
  service: "AWS Lambda",
  domain: "development",
  tagline: "Run code without provisioning or managing servers",
  intro:
    "Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying infrastructure. You pay only for the compute time you consume.",

  sections: [
    {
      heading: "Core Concepts",
      body: `Lambda executes **functions** — discrete units of code packaged as a ZIP archive or container image. Each function is defined by a **handler** (the entry point Lambda calls, e.g. \`index.handler\`), a **runtime** (the language environment such as Node.js 20.x, Python 3.12, or Java 21), and a **memory** allocation from 128 MB to 10,240 MB. CPU power scales proportionally with memory, so doubling memory roughly doubles compute capacity. Every function also has an **execution role** — an IAM role granting it permission to call other AWS services — and a **timeout** of up to 15 minutes per invocation.

Lambda manages a fleet of **execution environments** (isolated micro-VMs). When your function is invoked, it runs inside one of these environments. Between invocations the environment may be frozen and reused — this is a **warm start**, where initialization code has already run. When no warm environment is available, Lambda must create a new one, which is a **cold start** and adds latency while the runtime initializes.`,
    },
    {
      heading: "Invocation Types",
      body: `Lambda supports three fundamentally different invocation models, each with different error-handling behavior.

**Synchronous invocation** (RequestResponse) is the model used by API Gateway, ALB, Cognito triggers, and direct SDK calls. The caller waits for the function to complete and receives the result directly. If the function throws an error, the error propagates back to the caller, which is responsible for retrying.

**Asynchronous invocation** (Event) is used by S3, SNS, EventBridge, and SES. Lambda places the event on an internal queue and returns HTTP 202 immediately. If the function fails, Lambda automatically retries twice (three total attempts). After exhausting retries, you can capture the failed event using **Lambda Destinations** (which route to SQS, SNS, Lambda, or EventBridge with full metadata) or a **DLQ** (which routes to SQS or SNS with less context).

**Polling-based invocation** (event source mapping) applies to SQS, Kinesis Data Streams, DynamoDB Streams, Kafka, and Amazon MQ. Lambda manages the polling loop on your behalf — you don't write any polling code. Lambda handles batch sizing, concurrency, and checkpointing automatically, and scales the number of concurrent invocations based on the depth of the source.`,
    },
    {
      heading: "Execution Environment & Cold Starts",
      body: `When Lambda receives an invocation with no warm environment available, it goes through an initialization sequence: it downloads your deployment package (or pulls the container image), starts the runtime process, and runs any **initialization code** — the code outside your handler function. Only then does it call your handler. Steps 1 through 3 constitute the **cold start**, which typically adds 100ms to 1 second for interpreted runtimes like Node.js or Python, and several seconds for JVM or .NET runtimes.

Several strategies can reduce cold start impact. **Provisioned Concurrency** pre-warms a specified number of environments so they are always ready to handle requests with zero initialization delay — the tradeoff is that you're billed for provisioned environments even when idle. Minimizing your deployment package size reduces download time, and choosing faster runtimes (Node.js and Python start faster than Java or .NET) reduces startup time. Moving initialization code outside your handler — database connections, SDK clients, loaded config files — means that code runs once per environment rather than once per invocation, making warm starts faster and reducing the work done during cold starts.`,
    },
    {
      heading: "Concurrency & Throttling",
      body: `Lambda concurrency is the number of function instances processing requests simultaneously. Your account starts with a default limit of **1,000 concurrent executions** per region, shared across all functions. You can raise this limit through Service Quotas.

**Reserved concurrency** dedicates a portion of the account pool to a specific function. This guarantees that function can always scale up to its reserved amount, but it also caps the function at that limit — setting reserved concurrency to 0 disables the function entirely. Use reserved concurrency to protect other functions from a runaway one consuming the entire account pool.

**Provisioned concurrency** goes further: it pre-initializes a specific number of execution environments so they are always warm. These count against the function's reserved concurrency. You can configure Auto Scaling on provisioned concurrency to match scheduled traffic patterns or step-scale based on utilization.

When any concurrency limit is hit, Lambda returns **429 TooManyRequestsException**. Synchronous callers receive this error immediately and must handle retries. Asynchronous invocations are queued internally for up to 6 hours before being discarded or sent to a failure destination.`,
    },
    {
      heading: "Deployment Packages & Layers",
      body: `Lambda supports two packaging formats. **ZIP deployment** packages your code and dependencies into a ZIP file up to 50 MB compressed (250 MB unzipped). You can upload directly or via S3. **Container images** package your function as a Docker image up to 10 GB and must implement the Lambda Runtime Interface. Container images are the right choice for custom runtimes, large ML model dependencies, or when you want consistent dev/prod environments using Docker tooling.

**Lambda Layers** are a way to share code and dependencies across multiple functions without bundling them into each deployment package. A layer is a ZIP archive deployed independently and versioned separately. You attach up to 5 layers to a function, and Lambda extracts them to \`/opt\` in the execution environment. Functions pin to a specific layer version, so a layer update won't automatically affect any function — you update the reference explicitly. Layers are ideal for shared libraries, custom runtimes, and configuration files that multiple functions need.`,
    },
    {
      heading: "Environment Variables & Configuration",
      body: `Environment variables inject configuration into your runtime as key-value pairs accessible via \`process.env\` in Node.js or \`os.environ\` in Python. The total size limit across all variables is **4 KB**. By default, variables are stored in plain text and visible in the Lambda console, so you should never put sensitive values there directly.

For secrets, the right pattern is to store them in **Secrets Manager** or **SSM Parameter Store** and fetch them at initialization time in your function's init code (outside the handler). Caching the fetched value in a module-level variable means subsequent warm invocations reuse the cached value without additional API calls. If you must encrypt environment variables, you can use a **KMS Customer Managed Key** — Lambda will encrypt the variable value at rest, and your execution role needs \`kms:Decrypt\` to read it at runtime.

**Lambda aliases** are named pointers to specific published versions (e.g. \`prod\` pointing to version 47). Aliases support **weighted traffic shifting** — you can send 10% of traffic to a new version while keeping 90% on the current one. This enables canary deployments without requiring CodeDeploy. The function ARN with an alias suffix remains stable even as you promote new versions.`,
    },
    {
      heading: "Error Handling",
      body: `Error handling in Lambda differs significantly depending on the invocation type. For **synchronous invocations**, Lambda simply returns the error to the caller — there is no automatic retry, and the caller is entirely responsible for retry logic and backoff.

For **asynchronous invocations**, Lambda automatically retries failed invocations twice more (three total attempts), with a 1-minute wait before the second attempt and a 2-minute wait before the third. You can configure \`Maximum Retry Attempts\` (0–2) and \`Maximum Event Age\` (60 seconds to 6 hours) to control this behavior. After exhausting retries, you can route the failed event to a **Lambda Destination** (configured per OnFailure) or a DLQ. Destinations are preferred because they include the full invocation metadata — the original event, the response, and the request context — whereas DLQ only sends the original event.

For **stream-based sources** (Kinesis, DynamoDB Streams), Lambda must process records in order within each shard. A failing batch blocks the shard until it succeeds or expires. The key tools for managing this are \`BisectBatchOnFunctionError\` (which splits a failing batch in half to isolate the bad record) and \`MaximumRetryAttempts\` (which limits how many times a batch is retried before routing bad records to a failure destination). For SQS event sources, failed messages return to the queue after the visibility timeout expires and are retried up to \`maxReceiveCount\` times before going to the DLQ.`,
    },
    {
      heading: "VPC Access",
      body: `By default, Lambda runs outside any VPC and has internet access to reach AWS APIs and external services. If your function needs to access resources inside a VPC — an RDS database, an ElastiCache cluster, or an internal service — you attach it to the VPC by specifying subnets and security groups. Lambda then creates **Elastic Network Interfaces (ENIs)** in your VPC subnets using the Hyperplane ENI model, which shares ENIs across multiple function instances rather than creating one per invocation, solving the ENI exhaustion problem that plagued earlier Lambda VPC implementations.

When a Lambda function is attached to a VPC, it loses direct internet access — VPC-attached functions route through the VPC's network. To restore internet access (for calling external APIs, for example), you need a **NAT Gateway** in a public subnet with a route from your Lambda's private subnet through the NAT to the internet gateway. A cheaper and more secure alternative for AWS service calls is to use **VPC Endpoints (PrivateLink)** — these let your Lambda reach S3, DynamoDB, SQS, and other services without any internet routing, keeping traffic entirely within the AWS network.`,
    },
    {
      heading: "Performance Tuning",
      body: `Lambda's CPU allocation is tied to memory: more memory means proportionally more CPU. A function that completes in 100ms at 1,024 MB might take 400ms at 256 MB, and the cost difference may be small or even favor the higher memory setting. The open-source **Lambda Power Tuning** tool (built on Step Functions) runs your function at multiple memory configurations and produces a cost/performance chart, making it easy to find the optimal setting for your workload.

Set your function's timeout to slightly above the p99 execution time for your workload. Too low and you'll create unnecessary failures on slow requests; too high and runaway invocations accumulate cost before they're terminated. For functions that connect to databases or call external services, always initialize those connections **outside the handler** — Lambda reuses the execution environment across warm invocations, so a connection established in the init phase persists and is reused rather than re-established on every call.

Enable **X-Ray active tracing** to profile cold starts, handler duration, and downstream call latency. The X-Ray SDK automatically captures DynamoDB, S3, SQS, and SNS calls made through the AWS SDK, giving you a complete picture of where time is spent across your function's dependency chain.`,
    },
    {
      heading: "Lambda with Other Services",
      body: `The most common Lambda integration is **API Gateway → Lambda**, which forms the backbone of most serverless web APIs. API Gateway passes the full HTTP request as a structured event; Lambda processes it and returns a response object containing the status code, headers, and body. Lambda Proxy integration is the simplest approach — it passes everything through without transformation.

For queue-based processing, **SQS → Lambda** via event source mapping lets Lambda scale automatically with queue depth. Configure \`BatchSize\`, \`MaximumBatchingWindowInSeconds\`, and \`ReportBatchItemFailures\` for production-grade batch processing. For stream-based change capture, **DynamoDB Streams → Lambda** triggers processing on table changes — useful for real-time aggregation, cross-region replication, and audit logging.

**S3 → Lambda** triggers on object events like PUT and DELETE, enabling image processing pipelines, ETL jobs, and virus scanning. **EventBridge → Lambda** enables scheduled invocations (cron or rate expressions) and event-driven microservice patterns. **Step Functions → Lambda** places Lambda as a Task state, letting Step Functions handle retries, timeouts, and orchestration so each Lambda function can stay focused on a single well-defined operation. **Cognito → Lambda** triggers customize the authentication flow at pre-signup, post-confirmation, pre-token-generation, and custom auth challenge stages.`,
    },
  ],

  keyFacts: [
    "Max timeout: 15 minutes",
    "Memory: 128 MB – 10,240 MB",
    "Max deployment package: 50 MB (ZIP), 10 GB (container)",
    "Default concurrency limit: 1,000 per region",
    "Async retries: 2 (3 total attempts)",
    "Layers: up to 5 per function, extracted to /opt",
    "Env vars: 4 KB total limit",
    "VPC Lambda needs NAT Gateway for internet access",
    "Provisioned Concurrency eliminates cold starts",
    "SQS visibility timeout must be ≥ 6× function timeout",
  ],

  relatedServices: [
    "Amazon API Gateway",
    "Amazon SQS",
    "Amazon DynamoDB",
    "Amazon S3",
    "Amazon EventBridge",
    "AWS Step Functions",
    "Amazon Kinesis",
    "Amazon Cognito",
    "AWS X-Ray",
    "AWS KMS",
    "AWS Secrets Manager",
  ],

  examTips: [
    "Visibility timeout must be ≥ 6× function timeout to prevent SQS duplicate processing.",
    "Lambda Destinations support OnSuccess AND OnFailure; DLQ is failure-only.",
    "Provisioned Concurrency eliminates cold starts; Reserved Concurrency just limits max scale.",
    "Code outside the handler runs once per environment (init) — use for clients/connections.",
    "BisectBatchOnFunctionError isolates poison-pill records in Kinesis/DynamoDB Streams.",
    "Setting Reserved Concurrency = 0 disables the function entirely.",
    "VPC Lambda: private subnet + NAT Gateway for internet; VPC Endpoint for AWS services.",
    "Container images up to 10 GB; ZIP packages up to 250 MB unzipped.",
  ],
};
