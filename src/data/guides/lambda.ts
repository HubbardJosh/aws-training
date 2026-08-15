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
      body: `Lambda executes **functions** — discrete units of code packaged as a ZIP or container image. Each function has:

- **Handler**: the entry point Lambda calls (e.g. \`index.handler\`)
- **Runtime**: the language environment (Node.js 20.x, Python 3.12, Java 21, Go 1.x, etc.)
- **Memory**: 128 MB – 10,240 MB (CPU scales proportionally)
- **Timeout**: max 15 minutes per invocation
- **Execution Role**: IAM role granting the function permissions to call other AWS services

Lambda manages a fleet of **execution environments** (micro-VMs). Your code runs inside one. Between invocations the environment may be frozen and reused (**warm start**) or a new one is created (**cold start**).`,
    },
    {
      heading: "Invocation Types",
      body: `**Synchronous (RequestResponse)**
Caller waits for the function to finish and returns the result. Used by API Gateway, ALB, Cognito triggers, and direct SDK calls. Errors propagate back to the caller — the caller must handle retries.

**Asynchronous (Event)**
Lambda places the event on an internal queue and returns immediately (HTTP 202). Lambda retries failures twice (3 total attempts). Use **Destinations** or a **DLQ** to capture final failures. Sources: S3, SNS, EventBridge, SES.

**Polling (Stream/Queue)**
Lambda polls the source on your behalf (event source mapping). Sources: SQS, Kinesis Data Streams, DynamoDB Streams, Kafka, MQ. Lambda manages the polling loop, batch size, and concurrency.`,
    },
    {
      heading: "Execution Environment & Cold Starts",
      body: `When Lambda receives an invocation with no warm environment available it:
1. Downloads your deployment package (or pulls the container image)
2. Starts the runtime process
3. Runs **initialization code** (code outside your handler)
4. Calls your handler

Steps 1–3 are the **cold start** — typically 100ms–1s for interpreted runtimes, up to several seconds for JVM/container.

**Mitigation strategies:**
- **Provisioned Concurrency**: pre-warms N environments. Eliminates cold starts; billed even when idle.
- **Minimize package size**: smaller ZIP = faster download. Use tree-shaking, exclude dev deps.
- **Move init outside handler**: DB connections, SDK clients initialized once per environment.
- **Choose faster runtimes**: Node.js and Python cold-start faster than Java/.NET.
- **Keep functions warm** (schedule a ping every 5 min) — low-cost but not reliable at scale.`,
    },
    {
      heading: "Concurrency & Throttling",
      body: `**Unreserved concurrency**: shared pool across all functions in a region. Default account limit: **1,000 concurrent executions** (can be raised via Service Quotas).

**Reserved concurrency**: guarantees N slots for a specific function. Subtracts from the unreserved pool. Setting to 0 disables the function. Use to protect other functions from a runaway one.

**Provisioned concurrency**: pre-initializes environments so they are always ready. Counts against reserved concurrency. Best for latency-sensitive workloads with predictable traffic (use auto-scaling to match schedule or traffic patterns).

When concurrency limit is hit, Lambda returns **429 TooManyRequestsException**. Synchronous callers receive the error immediately. Async invocations are queued up to 6 hours.`,
    },
    {
      heading: "Deployment Packages & Layers",
      body: `**ZIP deployment**: package your code + dependencies into a ZIP ≤ 50 MB (compressed) / 250 MB (unzipped). Upload directly or via S3.

**Container image**: package code as a Docker image up to **10 GB**. Must implement the Lambda Runtime Interface. Enables custom runtimes, larger dependencies (ML models), consistent dev/prod environments.

**Layers**: ZIP archives deployed independently and shared across functions. Up to **5 layers** per function. Extracted to \`/opt\` in the execution environment. Versioned — functions pin to a specific layer version. Ideal for: shared libraries, custom runtimes, configuration files.`,
    },
    {
      heading: "Environment Variables & Configuration",
      body: `Environment variables are key-value pairs injected into the runtime as \`process.env\` (Node) or \`os.environ\` (Python). Total size limit: **4 KB**.

**Security**: variables are stored in plain text by default. Encrypt sensitive values using a **KMS Customer Managed Key** (CMK). The execution role needs \`kms:Decrypt\`.

**Best practice**: use environment variables for non-secret config (log level, feature flags, region). Use **Secrets Manager** or **SSM Parameter Store** for credentials — fetch at init time and cache.

**Aliases & versions**: publish a version to snapshot code + config. Create an alias (e.g. \`prod\`, \`staging\`) pointing to a version. Aliases support **traffic shifting** (weighted alias) for canary deployments without CodeDeploy.`,
    },
    {
      heading: "Error Handling",
      body: `**Synchronous**: Lambda returns the error to the caller. No automatic retry. Caller must implement retry with backoff.

**Asynchronous**: Lambda retries up to **2 additional times** (3 total). Between retries: 1 min wait, then 2 min wait. Configure **Maximum Retry Attempts** (0–2) and **Maximum Event Age** (60s–6h). After exhausting retries, route to:
- **Lambda Destinations (OnFailure)**: sends event + metadata to SQS, SNS, Lambda, or EventBridge.
- **DLQ**: sends failed event to SQS or SNS (less metadata than Destinations).

**Stream-based (Kinesis/DynamoDB Streams)**:
- Lambda blocks the shard and retries until success or data expires.
- \`BisectBatchOnFunctionError\`: splits failing batch in half to isolate bad records.
- \`MaximumRetryAttempts\`: controls retry count before routing to failure destination.
- \`DestinationConfig.OnFailure\`: routes isolated bad records to SQS/SNS.

**SQS event source**: failed messages return to queue after visibility timeout expires. After \`maxReceiveCount\` receives, SQS routes to the DLQ. Set visibility timeout ≥ 6× function timeout.`,
    },
    {
      heading: "VPC Access",
      body: `By default Lambda runs outside your VPC (has internet access, can reach AWS APIs). To access resources inside a VPC (RDS, ElastiCache, internal services), attach Lambda to the VPC by specifying **subnets and security groups**.

Lambda creates **Elastic Network Interfaces (ENIs)** in your VPC subnets using the **Hyperplane ENI** model (shared ENIs, not one per invocation — solved the ENI exhaustion and cold-start problem from the older model).

**Internet access from VPC Lambda**: VPC Lambda has no internet by default. Add a **NAT Gateway** in a public subnet. Private subnet → NAT → Internet Gateway.

**AWS service access from VPC Lambda (no internet)**: use **VPC Endpoints (PrivateLink)** to route traffic to S3, DynamoDB, SQS, etc. without a NAT Gateway. Cheaper and no internet exposure.`,
    },
    {
      heading: "Performance Tuning",
      body: `**Memory**: increasing memory also increases CPU. A function that uses 100ms at 1024 MB may use 400ms at 256 MB — cost may be similar or lower at higher memory. Use **AWS Lambda Power Tuning** (open-source Step Functions state machine) to find the optimal memory setting.

**Timeout**: set to slightly above your p99 execution time. Too low = unnecessary failures. Too high = runaway invocations accumulate cost.

**Connection reuse**: initialize SDK clients and DB connections **outside the handler**. Lambda reuses the execution environment — subsequent invocations reuse the warm client.

**X-Ray tracing**: enable active tracing to profile cold starts, handler duration, and downstream call latency. Subsegments auto-capture DynamoDB, S3, SQS, SNS calls made via AWS SDK.`,
    },
    {
      heading: "Lambda with Other Services",
      body: `**API Gateway → Lambda**: most common serverless pattern. API Gateway passes HTTP request as event; Lambda returns response body + status code. Use Lambda Proxy integration for simplicity or non-proxy for VTL mapping.

**SQS → Lambda**: event source mapping polls the queue. Lambda processes batches (up to 10,000 messages). Configure \`BatchSize\`, \`MaximumBatchingWindowInSeconds\`, and \`FunctionResponseTypes: [ReportBatchItemFailures]\` to return partial failures.

**DynamoDB Streams → Lambda**: trigger Lambda on table changes. Use for real-time aggregation, cross-region replication, audit logs.

**S3 → Lambda**: trigger on object events (PUT, DELETE). Build image processing pipelines, ETL jobs, virus scanning.

**EventBridge → Lambda**: trigger on schedule (cron/rate) or event pattern. Best for event-driven microservices.

**Step Functions → Lambda**: Lambda as a Task state. Step Functions handles retries, timeouts, and orchestration so Lambda functions stay simple.

**Cognito → Lambda**: triggers for Pre-SignUp, Post-Confirmation, Pre-Token-Generation, Custom-Auth. Customize auth flow and user data.`,
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
