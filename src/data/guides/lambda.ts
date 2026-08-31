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
      quiz: [
        {
          question: "What is the maximum timeout for a Lambda function?",
          options: ["15 minutes", "5 minutes", "30 minutes", "1 hour"],
          correctIndex: 0,
          explanation:
            "Lambda functions can run for up to 15 minutes per invocation. For longer workloads, use Step Functions or ECS.",
        },
        {
          question:
            "CPU power in Lambda scales proportionally with which setting?",
          options: [
            "Concurrency",
            "Layer count",
            "Timeout",
            "Memory allocation",
          ],
          correctIndex: 3,
          explanation:
            "Lambda allocates CPU proportionally to memory. Doubling memory roughly doubles available CPU — there is no separate CPU knob.",
        },
        {
          question:
            "A Lambda execution environment is reused between invocations without re-initialization. This is called a:",
          options: [
            "Warm start",
            "Provisioned start",
            "Hot reload",
            "Cold start",
          ],
          correctIndex: 0,
          explanation:
            "A warm start reuses an existing frozen execution environment. The handler runs immediately without re-running initialization code.",
        },
      ],
    },
    {
      heading: "Invocation Types",
      body: `Lambda supports three fundamentally different invocation models, each with different error-handling behavior.

**Synchronous invocation** (RequestResponse) is the model used by API Gateway, ALB, Cognito triggers, and direct SDK calls. The caller waits for the function to complete and receives the result directly. If the function throws an error, the error propagates back to the caller, which is responsible for retrying.

**Asynchronous invocation** (Event) is used by S3, SNS, EventBridge, and SES. Lambda places the event on an internal queue and returns HTTP 202 immediately. If the function fails, Lambda automatically retries twice (three total attempts). After exhausting retries, you can capture the failed event using **Lambda Destinations** (which route to SQS, SNS, Lambda, or EventBridge with full metadata) or a **DLQ** (which routes to SQS or SNS with less context).

**Polling-based invocation** (event source mapping) applies to SQS, Kinesis Data Streams, DynamoDB Streams, Kafka, and Amazon MQ. Lambda manages the polling loop on your behalf — you don't write any polling code. Lambda handles batch sizing, concurrency, and checkpointing automatically, and scales the number of concurrent invocations based on the depth of the source.`,
      quiz: [
        {
          question:
            "Which invocation type does API Gateway use when calling Lambda?",
          options: [
            "Asynchronous (Event)",
            "Polling-based (event source mapping)",
            "Synchronous (RequestResponse)",
            "Scheduled",
          ],
          correctIndex: 2,
          explanation:
            "API Gateway uses synchronous invocation. The caller waits for Lambda to respond and receives the result directly.",
        },
        {
          question:
            "How many total attempts does Lambda make for a failed asynchronous invocation by default?",
          options: ["3", "1", "5", "2"],
          correctIndex: 0,
          explanation:
            "Lambda retries twice after the initial attempt — 3 total. You can reduce this with MaximumRetryAttempts (0–2).",
        },
        {
          question:
            "Which service uses polling-based (event source mapping) invocation?",
          options: ["SNS", "SQS", "S3", "API Gateway"],
          correctIndex: 1,
          explanation:
            "SQS uses event source mapping — Lambda polls the queue on your behalf. S3 and SNS use asynchronous invocation; API Gateway uses synchronous.",
        },
      ],
    },
    {
      heading: "Execution Environment & Cold Starts",
      body: `When Lambda receives an invocation with no warm environment available, it goes through an initialization sequence: it downloads your deployment package (or pulls the container image), starts the runtime process, and runs any **initialization code** — the code outside your handler function. Only then does it call your handler. Steps 1 through 3 constitute the **cold start**, which typically adds 100ms to 1 second for interpreted runtimes like Node.js or Python, and several seconds for JVM or .NET runtimes.

Several strategies can reduce cold start impact. **Provisioned Concurrency** pre-warms a specified number of environments so they are always ready to handle requests with zero initialization delay — the tradeoff is that you're billed for provisioned environments even when idle. Minimizing your deployment package size reduces download time, and choosing faster runtimes (Node.js and Python start faster than Java or .NET) reduces startup time. Moving initialization code outside your handler — database connections, SDK clients, loaded config files — means that code runs once per environment rather than once per invocation, making warm starts faster and reducing the work done during cold starts.`,
      quiz: [
        {
          question:
            "Which feature completely eliminates Lambda cold starts for a function?",
          options: [
            "Reserved Concurrency",
            "Provisioned Concurrency",
            "Lambda Layers",
            "Reducing package size",
          ],
          correctIndex: 1,
          explanation:
            "Provisioned Concurrency pre-warms environments so they are always ready — zero cold start latency. Reserved Concurrency only limits scale, it does not pre-warm.",
        },
        {
          question:
            "Which runtime typically has the fastest cold start time in Lambda?",
          options: ["Node.js 20.x", "Go 1.x", "Java 21", ".NET 8"],
          correctIndex: 0,
          explanation:
            "Node.js and Python start significantly faster than JVM-based (Java) or CLR-based (.NET) runtimes due to lighter initialization overhead.",
        },
      ],
    },
    {
      heading: "Concurrency & Throttling",
      body: `Lambda concurrency is the number of function instances processing requests simultaneously. Your account starts with a default limit of **1,000 concurrent executions** per region, shared across all functions. You can raise this limit through Service Quotas.

**Reserved concurrency** dedicates a portion of the account pool to a specific function. This guarantees that function can always scale up to its reserved amount, but it also caps the function at that limit — setting reserved concurrency to 0 disables the function entirely. Use reserved concurrency to protect other functions from a runaway one consuming the entire account pool.

**Provisioned concurrency** goes further: it pre-initializes a specific number of execution environments so they are always warm. These count against the function's reserved concurrency. You can configure Auto Scaling on provisioned concurrency to match scheduled traffic patterns or step-scale based on utilization.

When any concurrency limit is hit, Lambda returns **429 TooManyRequestsException**. Synchronous callers receive this error immediately and must handle retries. Asynchronous invocations are queued internally for up to 6 hours before being discarded or sent to a failure destination.`,
      quiz: [
        {
          question:
            "What is the default account-level concurrency limit for Lambda per region?",
          options: ["100", "500", "1,000", "10,000"],
          correctIndex: 2,
          explanation:
            "The default regional concurrency limit is 1,000 concurrent executions, shared across all functions. This can be raised via Service Quotas.",
        },
        {
          question:
            "Setting Reserved Concurrency to 0 on a Lambda function has what effect?",
          options: [
            "Removes the concurrency cap",
            "Enables Provisioned Concurrency",
            "Disables the function entirely",
            "Limits the function to 1 concurrent execution",
          ],
          correctIndex: 2,
          explanation:
            "Reserved Concurrency of 0 means no execution environments are available — the function is effectively disabled and all invocations are throttled.",
        },
        {
          question:
            "Which error code does Lambda return when a concurrency limit is reached?",
          options: [
            "429 TooManyRequestsException",
            "400 BadRequest",
            "503 ServiceUnavailable",
            "500 InternalServerError",
          ],
          correctIndex: 0,
          explanation:
            "Lambda returns HTTP 429 TooManyRequestsException when throttled. Callers should implement exponential backoff and retry.",
        },
      ],
    },
    {
      heading: "Deployment Packages & Layers",
      body: `Lambda supports two packaging formats. **ZIP deployment** packages your code and dependencies into a ZIP file up to 50 MB compressed (250 MB unzipped). You can upload directly or via S3. **Container images** package your function as a Docker image up to 10 GB and must implement the Lambda Runtime Interface. Container images are the right choice for custom runtimes, large ML model dependencies, or when you want consistent dev/prod environments using Docker tooling.

**Lambda Layers** are a way to share code and dependencies across multiple functions without bundling them into each deployment package. A layer is a ZIP archive deployed independently and versioned separately. You attach up to 5 layers to a function, and Lambda extracts them to \`/opt\` in the execution environment. Functions pin to a specific layer version, so a layer update won't automatically affect any function — you update the reference explicitly. Layers are ideal for shared libraries, custom runtimes, and configuration files that multiple functions need.`,
      quiz: [
        {
          question: "What is the maximum size for a Lambda container image?",
          options: ["50 MB", "250 MB", "1 GB", "10 GB"],
          correctIndex: 3,
          explanation:
            "Container images can be up to 10 GB. ZIP packages are limited to 50 MB compressed / 250 MB unzipped.",
        },
        {
          question:
            "Where does Lambda extract layer content inside the execution environment?",
          options: ["/var/task", "/lambda", "/opt", "/tmp"],
          correctIndex: 2,
          explanation:
            "Lambda extracts all attached layers to /opt. Your code can reference shared libraries and binaries from that path.",
        },
        {
          question:
            "How many Lambda Layers can be attached to a single function?",
          options: ["10", "3", "1", "5"],
          correctIndex: 3,
          explanation:
            "You can attach up to 5 layers per function. Each layer is versioned independently and must be explicitly updated in the function config.",
        },
      ],
    },
    {
      heading: "Environment Variables & Configuration",
      body: `Environment variables inject configuration into your runtime as key-value pairs accessible via \`process.env\` in Node.js or \`os.environ\` in Python. The total size limit across all variables is **4 KB**. By default, variables are stored in plain text and visible in the Lambda console, so you should never put sensitive values there directly.

For secrets, the right pattern is to store them in **Secrets Manager** or **SSM Parameter Store** and fetch them at initialization time in your function's init code (outside the handler). Caching the fetched value in a module-level variable means subsequent warm invocations reuse the cached value without additional API calls. If you must encrypt environment variables, you can use a **KMS Customer Managed Key** — Lambda will encrypt the variable value at rest, and your execution role needs \`kms:Decrypt\` to read it at runtime.

**Lambda aliases** are named pointers to specific published versions (e.g. \`prod\` pointing to version 47). Aliases support **weighted traffic shifting** — you can send 10% of traffic to a new version while keeping 90% on the current one. This enables canary deployments without requiring CodeDeploy. The function ARN with an alias suffix remains stable even as you promote new versions.`,
      quiz: [
        {
          question:
            "What is the total size limit for all Lambda environment variables combined?",
          options: ["1 KB", "4 KB", "10 KB", "64 KB"],
          correctIndex: 1,
          explanation:
            "All environment variables combined must fit within 4 KB. Store secrets in Secrets Manager or SSM Parameter Store instead.",
        },
        {
          question:
            "Lambda aliases support weighted traffic shifting. What does this enable?",
          options: [
            "Canary deployments between two function versions",
            "Multi-region failover",
            "Automatic rollback on errors",
            "Reserved concurrency allocation",
          ],
          correctIndex: 0,
          explanation:
            "Aliases can split traffic between two versions (e.g. 90%/10%), enabling canary deployments without CodeDeploy.",
        },
      ],
    },
    {
      heading: "Error Handling",
      body: `Error handling in Lambda differs significantly depending on the invocation type. For **synchronous invocations**, Lambda simply returns the error to the caller — there is no automatic retry, and the caller is entirely responsible for retry logic and backoff.

For **asynchronous invocations**, Lambda automatically retries failed invocations twice more (three total attempts), with a 1-minute wait before the second attempt and a 2-minute wait before the third. You can configure \`Maximum Retry Attempts\` (0–2) and \`Maximum Event Age\` (60 seconds to 6 hours) to control this behavior. After exhausting retries, you can route the failed event to a **Lambda Destination** (configured per OnFailure) or a DLQ. Destinations are preferred because they include the full invocation metadata — the original event, the response, and the request context — whereas DLQ only sends the original event.

For **stream-based sources** (Kinesis, DynamoDB Streams), Lambda must process records in order within each shard. A failing batch blocks the shard until it succeeds or expires. The key tools for managing this are \`BisectBatchOnFunctionError\` (which splits a failing batch in half to isolate the bad record) and \`MaximumRetryAttempts\` (which limits how many times a batch is retried before routing bad records to a failure destination). For SQS event sources, failed messages return to the queue after the visibility timeout expires and are retried up to \`maxReceiveCount\` times before going to the DLQ.`,
      quiz: [
        {
          question:
            "Why are Lambda Destinations preferred over DLQs for failed async invocations?",
          options: [
            "They support more target services",
            "They include full invocation metadata, not just the original event",
            "They are cheaper",
            "They retry automatically",
          ],
          correctIndex: 1,
          explanation:
            "Destinations include the original event plus the response payload and request context. DLQs only capture the original event, making debugging harder.",
        },
        {
          question:
            "What does BisectBatchOnFunctionError do for Kinesis/DynamoDB stream sources?",
          options: [
            "Sends the batch to a DLQ immediately",
            "Splits the failing batch in half to isolate the bad record",
            "Retries the batch with a smaller window",
            "Pauses the shard for 60 seconds",
          ],
          correctIndex: 1,
          explanation:
            "BisectBatchOnFunctionError splits a failing batch into two halves and retries each half independently, narrowing down the poison-pill record.",
        },
      ],
    },
    {
      heading: "VPC Access",
      body: `By default, Lambda runs outside any VPC and has internet access to reach AWS APIs and external services. If your function needs to access resources inside a VPC — an RDS database, an ElastiCache cluster, or an internal service — you attach it to the VPC by specifying subnets and security groups. Lambda then creates **Elastic Network Interfaces (ENIs)** in your VPC subnets using the Hyperplane ENI model, which shares ENIs across multiple function instances rather than creating one per invocation, solving the ENI exhaustion problem that plagued earlier Lambda VPC implementations.

When a Lambda function is attached to a VPC, it loses direct internet access — VPC-attached functions route through the VPC's network. To restore internet access (for calling external APIs, for example), you need a **NAT Gateway** in a public subnet with a route from your Lambda's private subnet through the NAT to the internet gateway. A cheaper and more secure alternative for AWS service calls is to use **VPC Endpoints (PrivateLink)** — these let your Lambda reach S3, DynamoDB, SQS, and other services without any internet routing, keeping traffic entirely within the AWS network.`,
      quiz: [
        {
          question:
            "A VPC-attached Lambda function needs to call an external public API. What is required?",
          options: [
            "Nothing — VPC Lambda always has internet access",
            "An Internet Gateway attached to the Lambda subnet",
            "A NAT Gateway in a public subnet with a route from Lambda's private subnet",
            "A VPC Endpoint for the external API",
          ],
          correctIndex: 2,
          explanation:
            "VPC-attached Lambda loses direct internet access. A NAT Gateway in a public subnet allows outbound internet traffic from the private subnet Lambda runs in.",
        },
        {
          question:
            "What is the most cost-effective way for a VPC Lambda to call Amazon S3?",
          options: [
            "Internet Gateway",
            "VPC Endpoint (PrivateLink)",
            "Transit Gateway",
            "NAT Gateway",
          ],
          correctIndex: 1,
          explanation:
            "VPC Endpoints (PrivateLink) route traffic to S3, DynamoDB, and other AWS services privately without going through NAT or the internet — cheaper and more secure.",
        },
      ],
    },
    {
      heading: "Performance Tuning",
      body: `Lambda's CPU allocation is tied to memory: more memory means proportionally more CPU. A function that completes in 100ms at 1,024 MB might take 400ms at 256 MB, and the cost difference may be small or even favor the higher memory setting. The open-source **Lambda Power Tuning** tool (built on Step Functions) runs your function at multiple memory configurations and produces a cost/performance chart, making it easy to find the optimal setting for your workload.

Set your function's timeout to slightly above the p99 execution time for your workload. Too low and you'll create unnecessary failures on slow requests; too high and runaway invocations accumulate cost before they're terminated. For functions that connect to databases or call external services, always initialize those connections **outside the handler** — Lambda reuses the execution environment across warm invocations, so a connection established in the init phase persists and is reused rather than re-established on every call.

Enable **X-Ray active tracing** to profile cold starts, handler duration, and downstream call latency. The X-Ray SDK automatically captures DynamoDB, S3, SQS, and SNS calls made through the AWS SDK, giving you a complete picture of where time is spent across your function's dependency chain.`,
      quiz: [
        {
          question:
            "Where should database connections be initialized to maximize Lambda performance?",
          options: [
            "Inside the handler function, on every invocation",
            "Outside the handler, in the module initialization code",
            "In a Lambda Layer",
            "In an environment variable",
          ],
          correctIndex: 1,
          explanation:
            "Code outside the handler runs once per execution environment (warm start reuse). Initializing connections there means they persist across invocations rather than being re-created each time.",
        },
      ],
    },
    {
      heading: "Lambda with Other Services",
      body: `The most common Lambda integration is **API Gateway → Lambda**, which forms the backbone of most serverless web APIs. API Gateway passes the full HTTP request as a structured event; Lambda processes it and returns a response object containing the status code, headers, and body. Lambda Proxy integration is the simplest approach — it passes everything through without transformation.

For queue-based processing, **SQS → Lambda** via event source mapping lets Lambda scale automatically with queue depth. Configure \`BatchSize\`, \`MaximumBatchingWindowInSeconds\`, and \`ReportBatchItemFailures\` for production-grade batch processing. For stream-based change capture, **DynamoDB Streams → Lambda** triggers processing on table changes — useful for real-time aggregation, cross-region replication, and audit logging.

**S3 → Lambda** triggers on object events like PUT and DELETE, enabling image processing pipelines, ETL jobs, and virus scanning. **EventBridge → Lambda** enables scheduled invocations (cron or rate expressions) and event-driven microservice patterns. **Step Functions → Lambda** places Lambda as a Task state, letting Step Functions handle retries, timeouts, and orchestration so each Lambda function can stay focused on a single well-defined operation. **Cognito → Lambda** triggers customize the authentication flow at pre-signup, post-confirmation, pre-token-generation, and custom auth challenge stages.`,
      quiz: [
        {
          question:
            "What is the minimum SQS visibility timeout recommended when using Lambda as a consumer?",
          options: [
            "Equal to the Lambda timeout",
            "6× the Lambda timeout",
            "10× the Lambda timeout",
            "3× the Lambda timeout",
          ],
          correctIndex: 1,
          explanation:
            "AWS recommends the SQS visibility timeout be at least 6× the Lambda function timeout to prevent the message from becoming visible and being processed again while Lambda is still running.",
        },
        {
          question:
            "Which integration pattern lets Step Functions handle retries and orchestration so each Lambda stays focused on one operation?",
          options: [
            "SQS → Lambda",
            "API Gateway → Lambda",
            "EventBridge → Lambda",
            "Step Functions → Lambda (Task state)",
          ],
          correctIndex: 3,
          explanation:
            "Step Functions uses Lambda as a Task state and manages retries, timeouts, and branching logic externally, keeping each Lambda function simple and single-purpose.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "What is the maximum memory you can allocate to a Lambda function?",
      options: ["6,144 MB", "1,024 MB", "10,240 MB", "3,008 MB"],
      correctIndex: 2,
      explanation:
        "Lambda supports memory from 128 MB up to 10,240 MB (10 GB). CPU scales proportionally with memory.",
    },
    {
      question:
        "Which feature pre-warms Lambda execution environments to eliminate cold starts entirely?",
      options: [
        "Provisioned Concurrency",
        "Aliases",
        "Reserved Concurrency",
        "Lambda Layers",
      ],
      correctIndex: 0,
      explanation:
        "Provisioned Concurrency keeps environments initialized and ready. Reserved Concurrency caps scale but does not pre-warm.",
    },
    {
      question:
        "An async Lambda invocation fails all retry attempts. Where should you route the failed event to capture full metadata?",
      options: [
        "S3 bucket",
        "Dead Letter Queue (DLQ)",
        "CloudWatch Logs",
        "Lambda Destination (OnFailure)",
      ],
      correctIndex: 3,
      explanation:
        "Lambda Destinations capture the full invocation record including the original event, response, and request context. DLQs only get the original event.",
    },
    {
      question:
        "A Lambda function attached to a VPC needs to reach DynamoDB without internet traffic. What is the best solution?",
      options: [
        "NAT Gateway",
        "VPC Endpoint (PrivateLink)",
        "Internet Gateway",
        "Lambda@Edge",
      ],
      correctIndex: 1,
      explanation:
        "A VPC Endpoint for DynamoDB routes traffic privately within the AWS network — no NAT, no internet, lower cost and better security.",
    },
    {
      question:
        "You set Reserved Concurrency to 0 on a Lambda function. What happens?",
      options: [
        "Provisioned Concurrency takes over",
        "The function is limited to 1 concurrent execution",
        "The function scales to the account default limit",
        "The function is disabled — all invocations are throttled",
      ],
      correctIndex: 3,
      explanation:
        "Reserved Concurrency of 0 means no execution environments are allocated. Every invocation is throttled with a 429 error.",
    },
    {
      question:
        "What is the minimum recommended SQS visibility timeout when Lambda is the consumer?",
      options: [
        "6× the Lambda timeout",
        "Twice the batch window",
        "3× the Lambda timeout",
        "Equal to the Lambda timeout",
      ],
      correctIndex: 0,
      explanation:
        "AWS recommends visibility timeout ≥ 6× the function timeout to prevent messages from becoming visible and being re-processed while Lambda is still running.",
    },
    {
      question:
        "Lambda Layers are extracted to which path in the execution environment?",
      options: ["/var/task", "/lambda/layers", "/tmp", "/opt"],
      correctIndex: 3,
      explanation:
        "Lambda extracts all attached layers to /opt. Your function code can reference shared libraries and binaries from there.",
    },
    {
      question:
        "Which setting on a Kinesis event source mapping helps isolate a single bad record that causes repeated batch failures?",
      options: [
        "MaximumRetryAttempts",
        "BisectBatchOnFunctionError",
        "ReportBatchItemFailures",
        "DestinationConfig",
      ],
      correctIndex: 1,
      explanation:
        "BisectBatchOnFunctionError splits a failing batch in half on each retry, narrowing down to the poison-pill record and preventing the shard from being blocked indefinitely.",
    },
  ],
};
