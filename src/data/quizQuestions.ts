import { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  // ─── DOMAIN 1: DEVELOPMENT ──────────────────────────────────────────────────

  {
    id: "qq-001",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Lambda",
    question:
      "A developer needs to share a common set of Python libraries across 10 Lambda functions without bundling the libraries into each deployment package. What is the MOST efficient approach?",
    options: [
      "Create a Lambda Layer containing the libraries and attach it to all functions",
      "Package the libraries into each function deployment ZIP",
      "Use an S3 bucket to store libraries and download them at runtime",
      "Store libraries in an EFS file system mounted to all functions",
    ],
    correctIndices: [0],
    explanation:
      "Lambda Layers are the purpose-built solution for sharing code and dependencies across functions. Each function can reference up to 5 layers. The layer is extracted to /opt in the execution environment. Packaging into each ZIP wastes space and makes updates tedious. EFS mounting works but adds latency and cost. S3 downloads at runtime adds cold start time.",
    optionExplanations: [
      "Correct. Lambda Layers are the purpose-built solution for sharing libraries — the layer is extracted to /opt in the execution environment and can be attached to up to 5 functions per layer (and each function can use up to 5 layers).",
      "Incorrect. Bundling into each ZIP wastes storage and means every function must be redeployed individually when a shared library is updated, defeating the purpose of code reuse.",
      "Incorrect. Downloading from S3 at runtime adds latency on every cold start (and potentially every invocation) and requires network calls that layers avoid entirely.",
      "Incorrect. EFS mounting works technically but requires VPC configuration, adds network latency, and incurs additional cost — Lambda Layers are the simpler, lower-latency, purpose-built alternative.",
    ],
    tags: ["lambda", "layers", "dependencies"],
  },
  {
    id: "qq-002",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Lambda",
    question:
      "A Lambda function processes messages from an SQS queue. After deployment, the team notices that some messages are being processed multiple times. What is the MOST likely cause?",
    options: [
      "The function execution time exceeds the SQS visibility timeout",
      "The SQS queue is configured as a FIFO queue",
      "The Lambda function has reserved concurrency set to 0",
      "The SQS queue has long polling disabled",
    ],
    correctIndices: [0],
    explanation:
      "When a Lambda function takes longer than the SQS visibility timeout to process a message, the message becomes visible again and can be picked up by another invocation — causing duplicate processing. The fix is to set the visibility timeout to at least 6× the function timeout. FIFO queues actually prevent duplicates. Reserved concurrency of 0 would disable the function entirely. Long polling affects how fast messages are received, not duplicates.",
    optionExplanations: [
      "Correct. When a Lambda function's execution time exceeds the SQS visibility timeout, the message becomes visible again and another Lambda invocation picks it up — causing the same message to be processed more than once. The fix is to set visibility timeout to at least 6× the function timeout.",
      "Incorrect. FIFO queues actually prevent duplicate delivery with their deduplication window — they would reduce duplicates, not cause them.",
      "Incorrect. Reserved concurrency of 0 would prevent any concurrent executions, effectively disabling the function entirely — it would not cause duplicate processing.",
      "Incorrect. Long polling affects how quickly Lambda detects messages in the queue; it has no impact on whether messages are processed more than once.",
    ],
    tags: ["lambda", "sqs", "visibility-timeout", "duplicate"],
  },
  {
    id: "qq-003",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    service: "AWS Lambda",
    question:
      "A Lambda function is experiencing cold start latency issues. Which TWO approaches will MOST effectively reduce cold start times? (Select TWO)",
    options: [
      "Enable Provisioned Concurrency for the function",
      "Increase the function memory allocation",
      "Move initialization code inside the handler function",
      "Minimize the deployment package size",
      "Set reserved concurrency to a high value",
    ],
    correctIndices: [0, 3],
    explanation:
      "Provisioned Concurrency pre-warms execution environments, eliminating cold starts entirely (at extra cost). Minimizing package size reduces the time to download and extract code during environment initialization. Moving initialization inside the handler actually makes cold starts worse (re-running init on every invocation). Increasing memory speeds up CPU but does not eliminate the cold start. Reserved concurrency only limits max concurrency — it does not pre-warm environments.",
    optionExplanations: [
      "Correct. Provisioned Concurrency pre-initializes a specified number of execution environments so they are always warm — this eliminates cold starts entirely for those environments, at extra cost.",
      "Incorrect. Increasing memory gives the function more CPU proportionally and can speed up initialization code, but it does not eliminate the cold start overhead of downloading and initializing the execution environment.",
      "Incorrect. Moving initialization code inside the handler makes cold starts worse, not better — the initialization runs on every invocation rather than once per environment lifecycle.",
      "Correct. A smaller deployment package (fewer dependencies, smaller code bundle) reduces the time Lambda takes to download and extract the package during environment initialization, directly cutting cold start duration.",
      "Incorrect. Reserved concurrency limits the maximum number of concurrent executions for a function — it does not pre-warm environments or eliminate cold starts in any way.",
    ],
    tags: ["lambda", "cold-start", "provisioned-concurrency", "performance"],
  },
  {
    id: "qq-004",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Lambda",
    question:
      "A developer wants to route failed asynchronous Lambda invocations to an SQS queue for later reprocessing, while also routing successful invocations to another Lambda function. Which Lambda feature should they use?",
    options: [
      "Lambda Destinations",
      "Dead Letter Queue (DLQ)",
      "SQS Event Source Mapping",
      "Lambda Aliases",
    ],
    correctIndices: [0],
    explanation:
      "Lambda Destinations support routing both OnSuccess and OnFailure outcomes of asynchronous invocations to SQS, SNS, another Lambda, or EventBridge. DLQ only handles failures and only supports SQS or SNS. SQS Event Source Mapping is for Lambda consuming from SQS, not routing results. Lambda Aliases are for traffic shifting between versions.",
    optionExplanations: [
      "Correct. Lambda Destinations support both OnSuccess and OnFailure routing for asynchronous invocations, and can target SQS, SNS, another Lambda function, or EventBridge — making them the right choice when you need to route both outcomes.",
      "Incorrect. A Dead Letter Queue (DLQ) only captures failed invocations (OnFailure) after all retries are exhausted, and only supports SQS or SNS as targets — it cannot route successful invocations.",
      "Incorrect. SQS Event Source Mapping is the configuration that makes Lambda consume from an SQS queue as an event source; it is not a mechanism for routing Lambda results somewhere after execution.",
      "Incorrect. Lambda Aliases are used for traffic shifting between function versions (canary/weighted deployments) — they have nothing to do with routing invocation results to downstream destinations.",
    ],
    tags: ["lambda", "destinations", "dlq", "async"],
  },
  {
    id: "qq-005",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      'A DynamoDB table stores user sessions. The partition key is "status" with values "active" or "inactive". The team is experiencing throttling. What is the ROOT CAUSE?',
    options: [
      "Low-cardinality partition key causing hot partitions",
      "Insufficient provisioned write capacity units",
      "Missing Global Secondary Index on the status attribute",
      "DynamoDB Streams is enabled and consuming read capacity",
    ],
    correctIndices: [0],
    explanation:
      'Using "status" with only two possible values (active/inactive) as a partition key creates extreme hot partitions — nearly all traffic hits one or two physical partitions. Each partition can only handle 3000 RCU and 1000 WCU. Increasing capacity would help temporarily but not fix the root cause. The fix is to redesign the partition key to use a high-cardinality attribute like user_id. DynamoDB Streams does not consume table capacity.',
    optionExplanations: [
      "Correct. Using a low-cardinality attribute like 'status' (with only two values: active/inactive) as the partition key routes nearly all traffic to one or two physical partitions. Each partition handles at most 3,000 RCU and 1,000 WCU, so the entire table's capacity is limited to what two partitions can sustain — causing hot partition throttling.",
      "Incorrect. Insufficient write capacity is a symptom that can be tuned, but it is not the root cause — even with infinite WCU, a hot-partition key design will still concentrate all load on two partitions and hit per-partition limits.",
      "Incorrect. A GSI on the status attribute would create the same hot-partition problem on the index — it does not fix the underlying data distribution issue caused by a low-cardinality key.",
      "Incorrect. DynamoDB Streams captures item-level change data for downstream processing and does not consume the table's provisioned read or write capacity units.",
    ],
    tags: ["dynamodb", "hot-partition", "partition-key", "throttling"],
  },
  {
    id: "qq-006",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      "A developer needs to query DynamoDB items for a specific user (partition key = userId) filtered by date range on the sort key. Which DynamoDB operation should they use?",
    options: [
      "Query with a KeyConditionExpression on userId and date range",
      "Scan with a FilterExpression on userId and date",
      "GetItem with projection expression",
      "BatchGetItem with multiple user IDs",
    ],
    correctIndices: [0],
    explanation:
      "Query is the correct operation — it requires the partition key and supports sort key conditions like BETWEEN, begins_with, and comparison operators. This reads only the relevant partition. Scan reads the entire table and is extremely inefficient and costly for this use case. GetItem retrieves a single item by full primary key. BatchGetItem retrieves multiple specific items by key.",
    optionExplanations: [
      "Correct. Query with a KeyConditionExpression is the right operation — it requires specifying the partition key (userId) and optionally a sort key condition (date range using BETWEEN or comparison operators), reading only the items in that partition efficiently.",
      "Incorrect. Scan reads every item in the entire table and then applies a FilterExpression to discard non-matching items — it consumes RCU for all items scanned, making it extremely expensive and slow for targeted lookups.",
      "Incorrect. GetItem retrieves a single item by its complete primary key (partition key + sort key) — it cannot retrieve a range of items and requires knowing the exact sort key value.",
      "Incorrect. BatchGetItem retrieves multiple specific items by their full primary keys in one API call — it does not support range queries or filtering, and still requires knowing each item's exact primary key.",
    ],
    tags: ["dynamodb", "query", "sort-key", "keyconditionexpression"],
  },
  {
    id: "qq-007",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    service: "Amazon DynamoDB",
    question:
      "A developer needs to create a DynamoDB table that supports two additional query patterns beyond the primary key. Which TWO options are available? (Select TWO)",
    options: [
      "Create a Global Secondary Index (GSI) for each additional query pattern",
      "Create a Local Secondary Index (LSI) for each additional query pattern",
      "Use DynamoDB Streams to replicate data to a separate table for each query pattern",
      "Use DynamoDB Accelerator (DAX) to support additional query patterns",
      "Use a Scan with FilterExpression for the additional query patterns",
    ],
    correctIndices: [0, 1],
    explanation:
      "GSIs and LSIs are the built-in mechanisms for supporting additional query patterns. GSIs can have different partition and sort keys (added anytime, up to 20 per table). LSIs share the same partition key but have a different sort key (must be created at table creation time, up to 5 per table). DynamoDB Streams is for change data capture, not query optimization. DAX improves read performance but does not enable new query patterns. Scan+FilterExpression is very inefficient.",
    optionExplanations: [
      "Correct. Global Secondary Indexes (GSIs) support completely different partition and sort keys from the base table, enabling new query patterns. You can add up to 20 GSIs per table, and they can be created at any time after table creation.",
      "Correct. Local Secondary Indexes (LSIs) share the same partition key as the base table but use a different sort key, enabling range queries on non-sort-key attributes within a partition. They must be defined at table creation time and are limited to 5 per table.",
      "Incorrect. DynamoDB Streams captures a time-ordered record of changes to table items for purposes like replication, triggers, and event-driven processing — it is not a mechanism for enabling additional query patterns on the same data.",
      "Incorrect. DAX (DynamoDB Accelerator) is an in-memory caching layer that dramatically reduces read latency — it does not add new query capabilities and only supports the same query patterns as the underlying DynamoDB table.",
      "Incorrect. Scan with FilterExpression reads the entire table and discards non-matching items after the fact — it is extremely inefficient for targeted queries and not a valid alternative to indexing for large tables.",
    ],
    tags: ["dynamodb", "gsi", "lsi", "query-patterns", "indexes"],
  },
  {
    id: "qq-008",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SQS",
    question:
      "An application publishes messages to an SQS Standard queue. A consumer processes messages and deletes them after successful processing. Some messages appear to be processed twice. What should the developer do to investigate?",
    options: [
      "Check if the consumer processing time exceeds the visibility timeout and extend it",
      "Switch to a FIFO queue to ensure exactly-once processing",
      "Increase the message retention period",
      "Enable server-side encryption on the queue",
    ],
    correctIndices: [0],
    explanation:
      "The most common cause of duplicate processing with SQS is that the consumer takes longer to process a message than the visibility timeout, causing the message to reappear. Extending the visibility timeout (or calling ChangeMessageVisibility during processing) fixes this. While switching to FIFO adds exactly-once processing, it also limits throughput. SQS Standard inherently delivers at-least-once — idempotent consumers are the right design. Retention period and encryption are unrelated.",
    optionExplanations: [
      "Correct. When a consumer takes longer to process a message than the queue's visibility timeout, SQS makes the message visible again for another consumer, causing duplicate processing. Extending the visibility timeout (or calling ChangeMessageVisibility mid-processing) resolves this.",
      "Incorrect. Switching to a FIFO queue adds exactly-once processing deduplication, which would prevent duplicates, but it also limits throughput to 300 messages/second (3,000 with batching) and does not address the root cause of the visibility timeout mismatch.",
      "Incorrect. The message retention period controls how long SQS keeps undelivered messages; increasing it has no effect on whether messages are redelivered while a consumer is still processing them.",
      "Incorrect. Server-side encryption protects message data at rest and in transit but has no relationship to message visibility, delivery behavior, or duplicate processing.",
    ],
    tags: ["sqs", "visibility-timeout", "duplicate", "idempotent"],
  },
  {
    id: "qq-009",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "A Kinesis Data Stream has 4 shards. A producer is writing 5 MB/s of data. What will happen and what is the correct fix?",
    options: [
      "ProvisionedThroughputExceededException will occur; add more shards via shard splitting",
      "The stream will automatically scale to accommodate the additional throughput",
      "The data will be buffered and delivered eventually with no errors",
      "The producer should switch to Kinesis Data Firehose instead",
    ],
    correctIndices: [0],
    explanation:
      "Each Kinesis shard supports 1 MB/s write throughput. 4 shards = 4 MB/s maximum write capacity. Writing 5 MB/s exceeds this and causes ProvisionedThroughputExceededException. The fix is to split shards (add capacity) to reach at least 5 shards. Kinesis Data Streams does NOT auto-scale — you must manually scale or use on-demand mode. Firehose is a different service with different use cases.",
    optionExplanations: [
      "Correct. Each Kinesis shard supports 1 MB/s write throughput, so 4 shards = 4 MB/s total capacity. Writing 5 MB/s exceeds this limit and throws ProvisionedThroughputExceededException; the fix is to split shards until capacity meets demand.",
      "Incorrect. Kinesis Data Streams in provisioned mode does NOT auto-scale. You must manually add shards via shard splitting, or switch to on-demand mode to get automatic capacity adjustments.",
      "Incorrect. Kinesis does not buffer excess writes silently. Records that exceed the per-shard write quota are rejected immediately with ProvisionedThroughputExceededException and must be retried by the producer.",
      "Incorrect. Kinesis Data Firehose is a different service used for delivering streaming data to destinations like S3 or Redshift; it does not solve a Kinesis Data Streams throughput problem, and switching services would change the architecture significantly.",
    ],
    tags: ["kinesis", "shards", "throughput", "scaling"],
  },
  {
    id: "qq-010",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon S3",
    question:
      "A developer needs to allow an unauthenticated user to upload a file directly to S3 from a browser without exposing AWS credentials. What is the BEST approach?",
    options: [
      "Generate a pre-signed URL with PUT method and provide it to the client",
      "Create an IAM user with S3 write permissions and embed credentials in the frontend",
      "Enable public write access on the S3 bucket",
      "Use an API Gateway proxy to forward uploads to S3",
    ],
    correctIndices: [0],
    explanation:
      "Pre-signed URLs grant temporary, time-limited access to perform a specific S3 operation (PUT for upload) without requiring the user to have AWS credentials. The server generates the URL using AWS credentials and the client uses it directly. Embedding IAM credentials in frontend code is a severe security vulnerability. Enabling public write access would allow anyone to upload anything to your bucket. API Gateway proxy adds unnecessary complexity and cost for large file uploads.",
    optionExplanations: [
      "Correct. Pre-signed URLs let the server generate a time-limited, scoped URL using its own AWS credentials so the client can upload directly to S3 without ever receiving AWS keys.",
      "Incorrect. Embedding IAM user credentials in frontend code exposes long-term AWS access keys to anyone who inspects the page or bundle, which is a critical security vulnerability.",
      "Incorrect. Enabling public write access allows any person on the internet to upload arbitrary content to your bucket, creating massive security and cost risks.",
      "Incorrect. Proxying large file uploads through API Gateway adds latency, cost, and payload size limitations (10 MB for API Gateway); pre-signed URLs let clients upload directly to S3.",
    ],
    tags: ["s3", "presigned-url", "security", "upload"],
  },
  {
    id: "qq-011",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon S3",
    question:
      "A developer needs to upload a 10 GB file to S3. The upload is failing midway through. Which approach ensures the MOST reliable upload?",
    options: [
      "Use multipart upload with individual part retries on failure",
      "Compress the file to under 5 GB before uploading as a single PUT",
      "Use S3 Transfer Acceleration for more reliable uploads",
      "Use the AWS CLI sync command which handles retries automatically",
    ],
    correctIndices: [0],
    explanation:
      "Multipart upload is required for objects over 5 GB and strongly recommended for objects over 100 MB. It uploads the file in parts that can be retried individually on failure — you do not need to restart the entire upload. S3 Transfer Acceleration improves speed over long distances but does not change reliability for mid-upload failures. AWS CLI sync does retry, but multipart with individual part retries is the underlying mechanism that makes large uploads reliable.",
    optionExplanations: [
      "Correct. Multipart upload splits the file into independently uploadable parts (minimum 5 MB each, up to 10,000 parts); a failed part can be retried without restarting the entire transfer, making it the most reliable approach for large objects.",
      "Incorrect. S3 supports single PUT objects only up to 5 GB, and compressing a 10 GB file to under 5 GB may not always be feasible; even if it were, a mid-upload failure still loses the entire upload.",
      "Incorrect. S3 Transfer Acceleration routes data through AWS edge locations for improved speed over long geographic distances, but it does not add resilience against mid-upload failures.",
      "Incorrect. The AWS CLI sync command does implement retries and uses multipart upload under the hood, but the underlying mechanism providing reliability is multipart upload—making it the more fundamental and direct answer.",
    ],
    tags: ["s3", "multipart-upload", "reliability", "large-files"],
  },
  {
    id: "qq-012",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "A developer needs to use one API Gateway REST API definition across development, staging, and production environments with different Lambda function versions. What is the BEST approach?",
    options: [
      "Use stage variables to reference different Lambda aliases per stage",
      "Create a separate API Gateway for each environment",
      "Use query parameters to determine which Lambda version to invoke",
      "Use API Gateway canary deployments to split traffic between versions",
    ],
    correctIndices: [0],
    explanation:
      "Stage variables allow you to parameterize the integration target per stage. For example, the Lambda function ARN can include a stage variable: arn:aws:lambda:region:account:function:myFunction:${stageVariables.lambdaAlias}. Each stage (dev/staging/prod) sets lambdaAlias to the appropriate Lambda alias. This maintains one API definition while routing to different function versions per environment. Creating separate APIs is duplication. Query parameters would require application logic changes. Canary deployments are for gradual traffic shifting, not environment isolation.",
    optionExplanations: [
      "Correct. Stage variables parameterize the integration target per stage, so the Lambda function ARN can reference a stage variable (e.g., ${stageVariables.lambdaAlias}) and each stage sets that variable to the appropriate Lambda alias, maintaining a single API definition across all environments.",
      "Incorrect. Creating a separate API Gateway for each environment duplicates the API definition and forces developers to maintain multiple configurations in sync, increasing operational overhead without providing any advantage over stage variables.",
      "Incorrect. Using query parameters to select a Lambda version requires the client to be aware of environment-specific values and adds application-level logic to route between versions, which is a fragile approach that leaks infrastructure concerns into the API contract.",
      "Incorrect. API Gateway canary deployments gradually shift traffic between two versions of the same deployment within a single stage; they are designed for safe production releases, not for environment isolation across dev, staging, and production.",
    ],
    tags: ["api-gateway", "stage-variables", "lambda", "environments"],
  },
  {
    id: "qq-013",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Step Functions",
    question:
      "A workflow orchestrates 5 Lambda functions in sequence and must run 10,000 times per second. Total execution time per run is under 2 minutes. Which Step Functions workflow type is MOST cost-effective?",
    options: [
      "Express Workflows (Asynchronous)",
      "Standard Workflows",
      "Express Workflows (Synchronous)",
      "Nested Standard Workflows",
    ],
    correctIndices: [0],
    explanation:
      "Express Workflows support up to 100,000 executions per second and are billed per execution duration (GB-seconds), making them far cheaper for high-volume, short-duration workflows. Standard Workflows are billed per state transition and have a limit of 2,000 executions/s — at 10,000/s they would require quota increases and cost far more. Synchronous Express Workflows wait for the caller, which is fine here, but Asynchronous is fine when the caller does not need to wait for the result. The key differentiator is the high throughput requirement.",
    optionExplanations: [
      "Correct. Express Workflows support up to 100,000 executions per second and are billed per GB-second of duration, making them the most cost-effective choice for high-volume, short-duration workflows like this one (10,000/s, under 2 minutes each).",
      "Incorrect. Standard Workflows are billed per state transition and have a default limit of 2,000 executions per second. At 10,000 executions per second they require quota increases and are significantly more expensive than Express Workflows for high-throughput scenarios.",
      "Incorrect. Synchronous Express Workflows wait for the caller and return the result directly, which is useful when the caller needs a synchronous response. However, the key requirement here is high throughput (10,000/s) and cost-effectiveness—Asynchronous Express is equally valid when a synchronous response is not required and avoids the added latency of the caller waiting.",
      "Incorrect. Nested Standard Workflows inherit the same limitations as Standard Workflows—per-state-transition billing and lower throughput limits—so they do not solve the high-volume, cost-effective requirement.",
    ],
    tags: ["step-functions", "express", "standard", "cost", "throughput"],
  },
  {
    id: "qq-014",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SNS",
    question:
      "An application publishes order events to an SNS topic. Three different services need to process each order: inventory, billing, and shipping. Each service must receive every order. What is the BEST architecture?",
    options: [
      "SNS topic with three SQS queue subscriptions (fan-out pattern)",
      "Three separate SNS topics, one per service",
      "A single SQS queue with all three services polling from it",
      "SNS topic with three Lambda subscriptions",
    ],
    correctIndices: [0],
    explanation:
      "The fan-out pattern uses one SNS topic subscribed by three SQS queues — each queue belongs to one service. Every service gets a copy of every message. SQS queues provide buffering, retry, and decoupling. Using three separate topics would require the publisher to know about all consumers. A single SQS queue shared by three services means each message is processed by only one service (messages are consumed, not broadcast). Lambda subscriptions work but lack buffering and retry capabilities of SQS.",
    optionExplanations: [
      "Correct. The SNS fan-out pattern uses one topic with three separate SQS queue subscriptions—each queue belongs to one downstream service. Every published message is delivered to all three queues, ensuring each service receives every order. SQS queues provide buffering, retry, and decoupling between the publisher and each consumer.",
      "Incorrect. Using three separate SNS topics would require the order publisher to be aware of and publish to each individual topic, tightly coupling the publisher to every downstream consumer and making it harder to add new consumers later.",
      "Incorrect. A single SQS queue shared by three services means SQS delivers each message to only one consumer (messages are consumed, not broadcast). Only one of the three services would process each order, not all three.",
      "Incorrect. SNS can invoke Lambda functions directly, but Lambda invocations lack the buffering and retry capabilities that SQS provides. If a Lambda function fails, the message can be lost unless a DLQ is configured on the Lambda, making this a less robust architecture than SNS→SQS→service.",
    ],
    tags: ["sns", "sqs", "fan-out", "decoupling", "pattern"],
  },

  // ─── DOMAIN 2: SECURITY ─────────────────────────────────────────────────────

  {
    id: "qq-015",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS IAM",
    question:
      "A developer's IAM policy explicitly allows s3:PutObject on a bucket. An SCP on the AWS Organization OU does not include s3:PutObject in its allowed actions. What is the result when the developer attempts to upload a file?",
    options: [
      "Access denied — SCP must allow the action for it to succeed",
      "Access granted — the identity policy explicit Allow overrides the SCP",
      "Access denied — only SCPs determine access, not identity policies",
      "Access granted — SCPs only apply to root accounts",
    ],
    correctIndices: [0],
    explanation:
      "SCPs work as a filter on the maximum permissions available to accounts in an AWS Organization. If an SCP does not allow an action, no identity-based or resource-based policy in that account can grant it. The effective permissions are the intersection of what the SCP permits and what the identity policy allows. SCPs apply to all principals in the account except the management account root user.",
    optionExplanations: [
      "Correct. SCPs act as a permission guardrail (a maximum-permissions filter) on all principals in an AWS Organization account. If an action is not explicitly allowed by an SCP, no identity-based or resource-based policy in that account can grant it—the effective permission is the intersection of what the SCP permits and what the identity policy allows.",
      "Incorrect. An explicit Allow in an identity policy does not override an SCP. IAM policy evaluation always applies SCPs first; if the SCP does not permit the action, the request is denied regardless of what the identity policy says.",
      "Incorrect. Both SCPs and identity policies participate in the policy evaluation logic. SCPs set the upper bound of allowed permissions, but within that bound, identity policies and resource policies determine what is actually allowed. Saying 'only SCPs determine access' is inaccurate.",
      "Incorrect. SCPs apply to all IAM principals (users, roles, and the root user) in every member account of an AWS Organization. The only exception is the management account's root user, who is not subject to SCPs.",
    ],
    tags: ["iam", "scp", "organizations", "policy-evaluation"],
  },
  {
    id: "qq-016",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon Cognito",
    question:
      "A mobile app uses Cognito User Pools for authentication and needs to grant users temporary AWS credentials to access an S3 bucket directly from the app. Which Cognito feature provides the temporary AWS credentials?",
    options: [
      "Cognito Identity Pools (Federated Identities)",
      "Cognito User Pool built-in token exchange",
      "Cognito hosted UI with IAM integration",
      "Cognito User Pool app client credentials",
    ],
    correctIndices: [0],
    explanation:
      "Cognito Identity Pools exchange third-party tokens (including Cognito User Pool JWTs) for temporary AWS credentials via STS. The app authenticates with the User Pool to get a JWT, then exchanges it with the Identity Pool to get temporary IAM credentials scoped to a role. This allows the app to call AWS services directly. User Pools handle authentication only — they do not issue AWS credentials.",
    optionExplanations: [
      "Correct. Cognito Identity Pools (Federated Identities) exchange third-party identity tokens—including Cognito User Pool JWTs—for temporary AWS credentials via STS AssumeRoleWithWebIdentity. The app authenticates with the User Pool to get an ID token, then passes it to the Identity Pool to receive short-lived IAM credentials scoped to a mapped IAM role.",
      "Incorrect. Cognito User Pools handle authentication and issue JWTs (ID token, access token, refresh token), but they do not issue AWS credentials directly. There is no 'built-in token exchange' within User Pools for obtaining STS credentials—that function belongs to Identity Pools.",
      "Incorrect. The Cognito hosted UI provides a pre-built sign-in/sign-up web interface and can integrate with social or enterprise identity providers, but it does not produce AWS IAM credentials on its own. After authentication through the hosted UI, you still need Identity Pools to obtain AWS credentials.",
      "Incorrect. App client credentials in Cognito User Pools are used for machine-to-machine (M2M) OAuth 2.0 client credentials flow—they authenticate the application itself, not the end user. They produce Cognito access tokens, not AWS IAM credentials.",
    ],
    tags: ["cognito", "identity-pool", "user-pool", "credentials", "sts"],
  },
  {
    id: "qq-017",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS KMS",
    question:
      "A Lambda function needs to encrypt a 50 MB file before storing it in S3. Using KMS Encrypt API directly is failing because the file exceeds the 4 KB limit. What is the correct approach?",
    options: [
      "Use KMS GenerateDataKey to get a DEK, encrypt the file locally with the DEK, store the encrypted DEK alongside the file",
      "Split the file into 4 KB chunks and encrypt each chunk separately with KMS",
      "Use SSE-KMS on S3 to encrypt the file automatically during upload",
      "Base64 encode the file to work within KMS limits",
    ],
    correctIndices: [0],
    explanation:
      "KMS Encrypt is limited to 4 KB. Envelope encryption solves this: call GenerateDataKey to get a plaintext DEK and an encrypted DEK. Use the plaintext DEK with a local encryption library (AES-256) to encrypt the large file. Discard the plaintext DEK. Store the encrypted DEK alongside the encrypted data. To decrypt: call KMS Decrypt on the encrypted DEK, then use the plaintext DEK locally. Splitting into 4 KB chunks is impractical and inefficient. SSE-KMS is for S3-managed encryption, not Lambda-side encryption.",
    optionExplanations: [
      "Correct. This is envelope encryption: GenerateDataKey returns a plaintext DEK and an encrypted DEK. Use the plaintext DEK locally (e.g., AES-256) to encrypt the large file, then discard the plaintext DEK and store the encrypted DEK alongside the ciphertext. To decrypt, call KMS Decrypt on the stored encrypted DEK, then use the resulting plaintext DEK to decrypt the file locally.",
      "Incorrect. Splitting a 50 MB file into thousands of 4 KB chunks and calling KMS Encrypt on each is impractical, extremely slow, and would consume enormous numbers of KMS API calls. Envelope encryption is the correct and efficient solution for data larger than 4 KB.",
      "Incorrect. SSE-KMS on S3 is server-side encryption managed by S3 during the PUT/GET operations — S3 calls KMS on your behalf. It does not satisfy the requirement of the Lambda function encrypting the file itself before upload. The question asks for Lambda-side (client-side) encryption.",
      "Incorrect. Base64 encoding is a text encoding scheme that does not reduce data size; it actually increases it by ~33%. It cannot make a 50 MB file fit within the 4 KB KMS Encrypt limit and provides no encryption whatsoever.",
    ],
    tags: ["kms", "envelope-encryption", "dek", "lambda", "encryption"],
  },
  {
    id: "qq-018",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS Secrets Manager",
    question:
      "A Lambda function connects to an RDS database using credentials stored in Secrets Manager. The credentials are rotated every 30 days. How should the developer write the Lambda code to handle rotation without downtime?",
    options: [
      "Retrieve the secret from Secrets Manager at each invocation and implement retry logic for authentication failures",
      "Cache the secret in a Lambda Layer updated during rotation",
      "Store the secret in an environment variable and update it manually after each rotation",
      "Use a DynamoDB table to store credentials and update it via a rotation Lambda",
    ],
    correctIndices: [0],
    explanation:
      "The recommended pattern is to retrieve the secret from Secrets Manager on each invocation (or cache with a short TTL) and implement retry logic: if authentication fails, refresh the cached secret and retry once. This handles the brief window during rotation when old credentials are invalidated. Secrets Manager caching libraries (AWS SDK) handle this automatically. Environment variables require manual updates — defeating the purpose of auto-rotation. Lambda Layers are for code/dependencies, not runtime secrets.",
    optionExplanations: [
      "Correct. The recommended pattern is to retrieve the secret from Secrets Manager on each invocation (or cache it with a short TTL using the AWS Secrets Manager caching library) and implement retry logic: if the database authentication fails, refresh the cached secret and retry once. This handles the brief overlap during rotation when old credentials may be invalidated before the new credentials are fully propagated.",
      "Incorrect. Lambda Layers are designed to share code, libraries, or binaries — not runtime secrets. A Layer is bundled at deployment time and cannot be updated dynamically during automatic rotation without a full redeployment. Using a Layer for credentials would reintroduce the problem of stale secrets.",
      "Incorrect. Storing secrets in Lambda environment variables defeats the purpose of Secrets Manager auto-rotation. Environment variables are set at deployment time and cannot be updated automatically when rotation occurs; every rotation would require manually updating the Lambda configuration and redeploying the function.",
      "Incorrect. Using a DynamoDB table as a credentials store is a custom anti-pattern that adds complexity, latency, and operational burden without the security benefits of Secrets Manager (automatic rotation, encryption, audit logging, fine-grained IAM access control). It also requires writing a custom rotation mechanism.",
    ],
    tags: ["secrets-manager", "rotation", "lambda", "rds", "caching"],
  },
  {
    id: "qq-019",
    domain: "security",
    difficulty: "hard",
    type: "multi",
    service: "AWS IAM",
    question:
      "A developer needs an EC2 instance to access DynamoDB and S3 without storing long-term credentials. Which TWO steps are required? (Select TWO)",
    options: [
      "Create an IAM role with policies granting DynamoDB and S3 access",
      "Attach the IAM role to the EC2 instance as an instance profile",
      "Create an IAM user and store the access key in ~/.aws/credentials on the instance",
      "Set the AWS_ACCESS_KEY_ID environment variable on the EC2 instance",
      "Add the EC2 instance IP to the DynamoDB resource policy",
    ],
    correctIndices: [0, 1],
    explanation:
      "The correct approach for EC2 is to use IAM roles via instance profiles. Step 1: create an IAM role with the required permissions. Step 2: attach the role to the EC2 instance as an instance profile. The instance metadata service (IMDS) automatically provides temporary credentials to code running on the instance — no long-term keys needed. Storing access keys on the instance is a security anti-pattern. DynamoDB does not support resource-based policies.",
    optionExplanations: [
      "Correct. An IAM role defines the set of permissions the EC2 instance needs. Without the role, there are no permissions to attach to the instance—this is the first required step in granting EC2 access to AWS services without long-term credentials.",
      "Correct. An instance profile is the container that attaches an IAM role to an EC2 instance. When the role is attached via instance profile, the Instance Metadata Service (IMDS) automatically provides rotating temporary credentials to any code running on that instance.",
      "Incorrect. Storing long-term IAM access keys directly on an EC2 instance (in ~/.aws/credentials or elsewhere) is a security anti-pattern. If the instance is compromised, the static credentials are exposed. IAM roles with instance profiles are the AWS-recommended alternative.",
      "Incorrect. Setting AWS_ACCESS_KEY_ID as an environment variable on the instance still requires embedding long-term static credentials, which is the exact problem that IAM instance profiles solve. This approach is insecure and not recommended.",
      "Incorrect. DynamoDB does not support resource-based policies (unlike S3 or Lambda). Access to DynamoDB is controlled entirely through IAM identity-based policies attached to the EC2 instance's IAM role.",
    ],
    tags: ["iam", "ec2", "instance-profile", "roles", "credentials"],
  },
  {
    id: "qq-020",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS STS",
    question:
      "A developer in Account A needs to access resources in Account B. The developer has IAM credentials in Account A. What must be configured to allow cross-account access via role assumption?",
    options: [
      "A trust policy on the IAM role in Account B that allows Account A principal to assume it, and the developer must call sts:AssumeRole",
      "A resource-based policy in Account B that grants the Account A user access directly",
      "VPC peering between Account A and Account B",
      "AWS Organizations must be enabled with both accounts in the same OU",
    ],
    correctIndices: [0],
    explanation:
      "Cross-account role assumption requires: 1) An IAM role in Account B with a trust policy (principal = Account A user/role ARN) allowing sts:AssumeRole. 2) The Account A user's identity policy must allow sts:AssumeRole on the Account B role ARN. The developer calls sts:AssumeRole and gets temporary credentials scoped to the Account B role. Resource-based policies can grant cross-account access for some services (S3, Lambda, etc.) but not via STS. VPC peering and Organizations are unrelated.",
    optionExplanations: [
      "Correct. Cross-account access via role assumption requires two things: (1) an IAM role in Account B with a trust policy that explicitly trusts the Account A principal (allowing sts:AssumeRole), and (2) the developer calling sts:AssumeRole and exchanging permanent credentials for temporary, scoped credentials in Account B.",
      "Incorrect. Resource-based policies (e.g., on S3 buckets or Lambda functions) can grant cross-account access to specific resources, but they do not provide a general mechanism for assuming an identity across accounts the way STS role assumption does. For cross-account access to many services, role assumption is the standard approach.",
      "Incorrect. VPC peering enables private network connectivity between VPCs in different accounts but has nothing to do with IAM authentication or authorization. Network connectivity and permission to call AWS APIs are completely separate concerns.",
      "Incorrect. AWS Organizations is not required for cross-account role assumption. Any two independent AWS accounts can set up cross-account role assumption using trust policies and sts:AssumeRole, with no organizational relationship needed.",
    ],
    tags: ["sts", "cross-account", "assume-role", "trust-policy"],
  },

  // ─── DOMAIN 3: DEPLOYMENT ───────────────────────────────────────────────────

  {
    id: "qq-021",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeDeploy",
    question:
      "A team wants to deploy a new Lambda function version where 10% of traffic goes to the new version for 5 minutes before shifting 100% of traffic. Which CodeDeploy deployment configuration achieves this?",
    options: [
      "CodeDeployDefault.LambdaCanary10Percent5Minutes",
      "CodeDeployDefault.LambdaLinear10PercentEvery5Minutes",
      "CodeDeployDefault.LambdaAllAtOnce",
      "CodeDeployDefault.LambdaBlueGreen",
    ],
    correctIndices: [0],
    explanation:
      'Canary deployments shift a small percentage of traffic to the new version, wait, then shift the remainder. LambdaCanary10Percent5Minutes shifts 10% for 5 minutes, then 90% at once. Linear deployments shift traffic incrementally over time (e.g., 10% every 5 minutes until 100%). AllAtOnce shifts immediately with no safety period. There is no "BlueGreen" configuration for Lambda — blue/green is used for EC2.',
    optionExplanations: [
      "Correct. LambdaCanary10Percent5Minutes is a CodeDeploy built-in configuration that shifts 10% of traffic to the new Lambda version for 5 minutes and then — if no alarms fire — shifts the remaining 90% all at once.",
      "Incorrect. LambdaLinear10PercentEvery5Minutes increases traffic by 10% every 5 minutes in equal increments (10% → 20% → 30% … → 100%), taking 50 minutes total; this does not match the 'hold at 10% then shift all at once' pattern described.",
      "Incorrect. LambdaAllAtOnce immediately routes 100% of traffic to the new version with no safety period, providing no ability to catch errors before full rollout.",
      "Incorrect. There is no CodeDeployDefault.LambdaBlueGreen configuration; blue/green terminology is used for EC2 deployments, not Lambda. Lambda traffic shifting uses canary or linear strategies.",
    ],
    tags: [
      "codedeploy",
      "lambda",
      "canary",
      "deployment-strategy",
      "traffic-shifting",
    ],
  },
  {
    id: "qq-022",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodeBuild",
    question:
      'A CodeBuild project is failing with "BUILD_CONTAINER_UNABLE_TO_PULL_IMAGE." The project uses a custom Docker image in Amazon ECR. What is the MOST likely cause?',
    options: [
      "The CodeBuild service role does not have ECR pull permissions (ecr:GetAuthorizationToken, ecr:BatchGetImage)",
      "The ECR repository is in a different region than CodeBuild",
      "The Docker image is too large for CodeBuild to pull",
      "CodeBuild does not support custom Docker images from ECR",
    ],
    correctIndices: [0],
    explanation:
      "CodeBuild must authenticate to ECR to pull the custom image. The CodeBuild service role needs ecr:GetAuthorizationToken, ecr:BatchCheckLayerAvailability, and ecr:GetDownloadUrlForLayer permissions (or the AmazonEC2ContainerRegistryReadOnly managed policy). Cross-region ECR is supported. CodeBuild has a 15 GB limit per build for images but pulling fails at authentication before size is an issue. CodeBuild fully supports ECR custom images.",
    optionExplanations: [
      "Correct. CodeBuild requires the ecr:GetAuthorizationToken permission (and ecr:BatchCheckLayerAvailability, ecr:GetDownloadUrlForLayer, ecr:BatchGetImage) on the CodeBuild service role to authenticate to ECR and pull the custom image.",
      "Incorrect. CodeBuild can pull images from ECR repositories in the same or different regions; cross-region ECR access is supported by specifying the full ECR URI including the region-specific endpoint.",
      "Incorrect. CodeBuild does not impose a practical image size limit that would cause this specific error; authentication failure at the ECR authorization step occurs before any size check is performed.",
      "Incorrect. CodeBuild fully supports using custom Docker images from Amazon ECR as build environments; it is a core and well-supported feature of CodeBuild for teams using private container registries.",
    ],
    tags: ["codebuild", "ecr", "iam", "permissions", "docker"],
  },
  {
    id: "qq-023",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS SAM",
    question:
      "A developer wants to test a Lambda function locally before deploying to AWS. Which SAM CLI command should they use?",
    options: [
      "sam local invoke",
      "sam deploy --dry-run",
      "sam build --local",
      "sam validate --local",
    ],
    correctIndices: [0],
    explanation:
      "sam local invoke runs a Lambda function locally in a Docker container that simulates the Lambda runtime. You can pass an event JSON file with -e event.json. sam local start-api starts a local API Gateway. sam deploy performs actual deployment. sam build compiles/packages the application. sam validate checks the template syntax.",
    optionExplanations: [
      "Correct. sam local invoke runs the specified Lambda function inside a Docker container that mimics the Lambda execution environment, accepting a JSON event file via -e and printing the function's response to stdout.",
      "Incorrect. sam deploy performs an actual deployment to AWS using CloudFormation; there is no --dry-run flag for sam deploy, and this command does not run the function locally.",
      "Incorrect. sam build compiles source code and packages dependencies into the .aws-sam build directory; the --local flag does not exist for sam build and the command does not execute the Lambda function.",
      "Incorrect. sam validate checks the SAM/CloudFormation template file for syntax and structural correctness; it does not run or invoke the Lambda function, and there is no --local flag for validation.",
    ],
    tags: ["sam", "local-testing", "lambda", "cli"],
  },
  {
    id: "qq-024",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation stack update fails and enters UPDATE_ROLLBACK_FAILED state. What should the developer do to recover?",
    options: [
      "Use the ContinueUpdateRollback API to skip the failed resources and complete the rollback",
      "Delete the stack and recreate it from scratch",
      "Use the stack policy to override the failed resource update",
      "Manually fix the resource in the console and the stack will automatically recover",
    ],
    correctIndices: [0],
    explanation:
      'UPDATE_ROLLBACK_FAILED means CloudFormation tried to roll back changes but failed. The ContinueUpdateRollback API (or "Continue rollback" in console) lets you retry the rollback, optionally skipping specific resources that cannot be rolled back. After specifying resources to skip, CloudFormation completes the rollback and the stack enters UPDATE_ROLLBACK_COMPLETE. Deleting a failed stack is possible but loses all resources. Manually fixing resources without telling CloudFormation creates drift.',
    optionExplanations: [
      "Correct. The ContinueUpdateRollback API (or 'Continue rollback' in the console) retries a stuck rollback and allows you to specify specific resources to skip if they cannot be rolled back, eventually returning the stack to UPDATE_ROLLBACK_COMPLETE.",
      "Incorrect. Deleting a failed stack is possible but destructive — it removes all CloudFormation-managed resources from the account; it is a last resort, not the recommended recovery path for UPDATE_ROLLBACK_FAILED.",
      "Incorrect. A CloudFormation stack policy prevents specified resources from being updated during future stack updates; it does not help recover a stack already stuck in UPDATE_ROLLBACK_FAILED state.",
      "Incorrect. Manually fixing a resource in the console without informing CloudFormation creates configuration drift; CloudFormation will not automatically detect or recover from manual changes and the stack remains in UPDATE_ROLLBACK_FAILED.",
    ],
    tags: ["cloudformation", "rollback", "update-rollback-failed", "recovery"],
  },
  {
    id: "qq-025",
    domain: "deployment",
    difficulty: "medium",
    type: "multi",
    service: "AWS Elastic Beanstalk",
    question:
      "A team needs to deploy updates to an Elastic Beanstalk environment with ZERO downtime and the ability to quickly roll back. Which TWO deployment policies meet these requirements? (Select TWO)",
    options: [
      "Immutable deployment",
      "Blue/Green deployment (swap environment URLs)",
      "All at once deployment",
      "Rolling deployment",
      "Rolling with additional batch",
    ],
    correctIndices: [0, 1],
    explanation:
      "Immutable deployment launches a fresh set of instances in a new ASG, deploys the new version, then terminates the old instances. Rollback is instant — terminate new ASG. Zero downtime as old instances serve traffic until swap. Blue/Green uses two separate environments — swap URLs via CNAME for instant cutover; rollback by swapping back. All at once has downtime. Rolling reduces capacity during deployment. Rolling with additional batch maintains capacity but is slower to roll back.",
    optionExplanations: [
      "Correct. Immutable deployment launches a new Auto Scaling group with new instances running the new version; traffic continues on the old instances until the new ones pass health checks, enabling instant rollback by terminating the new ASG.",
      "Correct. Blue/Green deployment maintains two separate Beanstalk environments; a CNAME swap routes 100% of traffic to the new (green) environment instantly, and rolling back is as simple as swapping the CNAME back to the old (blue) environment.",
      "Incorrect. All at once deployment stops all instances, deploys the new version, and restarts them; this causes complete downtime during the deployment window and provides no rollback capability without a full re-deployment.",
      "Incorrect. Rolling deployment updates instances in batches, reducing capacity during deployment (unless extra batch is used); rolling back requires another rolling deployment of the old version, which takes time and temporarily reduces capacity.",
      "Incorrect. Rolling with additional batch maintains full capacity by adding a batch of new instances, but rollback still requires a full rolling re-deployment of the old version and is slower than immutable or blue/green approaches.",
    ],
    tags: [
      "elastic-beanstalk",
      "zero-downtime",
      "rollback",
      "immutable",
      "blue-green",
    ],
  },
  {
    id: "qq-026",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CDK",
    question:
      "A developer uses AWS CDK to define infrastructure. After running cdk synth, they want to preview what will change in the AWS account before deploying. Which command should they run?",
    options: ["cdk diff", "cdk preview", "cdk plan", "cdk validate"],
    correctIndices: [0],
    explanation:
      "cdk diff compares the synthesized CloudFormation template against the currently deployed stack and shows what resources will be added, modified, or deleted — similar to terraform plan. cdk synth generates the CloudFormation template. cdk deploy deploys the changes. cdk validate is not a standard CDK command (CloudFormation has cfn validate). cdk plan and cdk preview do not exist.",
    optionExplanations: [
      "Correct. cdk diff synthesizes the CDK app into a CloudFormation template and compares it to the currently deployed stack, showing a human-readable diff of resources that will be added, modified, or deleted — similar to terraform plan.",
      "Incorrect. cdk preview is not a standard CDK CLI command; there is no such command in the AWS CDK toolchain.",
      "Incorrect. cdk plan is not a standard CDK CLI command; this terminology comes from Terraform and does not exist in the CDK CLI.",
      "Incorrect. cdk validate is not a standard CDK CLI command; CloudFormation template validation can be done with cfn-lint or aws cloudformation validate-template, but CDK uses cdk synth and cdk diff for pre-deployment review.",
    ],
    tags: ["cdk", "diff", "cloudformation", "preview"],
  },
  {
    id: "qq-027",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon ECS",
    question:
      "An ECS task running on Fargate needs to retrieve database credentials from Secrets Manager at startup. How should this be configured?",
    options: [
      "Reference the Secrets Manager secret ARN in the task definition secrets section; grant the task execution role GetSecretValue permission",
      "Store credentials in the container image environment variables",
      "Use the task role to call Secrets Manager at runtime in application code",
      "Mount an EFS volume containing the credentials file",
    ],
    correctIndices: [0],
    explanation:
      "ECS injects secrets from Secrets Manager (or SSM Parameter Store) as environment variables at container startup when referenced in the task definition's secrets section. The task execution role (not the task role) must have secretsmanager:GetSecretValue. This is more secure than baking credentials into the image or passing them as plaintext environment variables. The task role is for the application to make AWS API calls — a different IAM role.",
    optionExplanations: [
      "Correct. ECS natively integrates with Secrets Manager and SSM Parameter Store via the task definition's 'secrets' section. At container startup, ECS (using the task execution role) calls Secrets Manager to retrieve the secret value and injects it as an environment variable into the container. The task execution role — not the task role — must have secretsmanager:GetSecretValue permission because the ECS agent performs this action before the container starts.",
      "Incorrect. Hardcoding database credentials into container image environment variables is a critical security anti-pattern. The credentials would be visible in the Dockerfile, image layers, task definition history, and to anyone with access to the container runtime. Credentials baked into images cannot be rotated without rebuilding and redeploying the image.",
      "Incorrect. Using the task role to call Secrets Manager at runtime in application code is a valid approach, but it is not the recommended pattern for startup credentials. It requires application code changes, adds latency at startup, and means the application must handle secret retrieval logic. The task definition 'secrets' injection approach is simpler and more secure.",
      "Incorrect. Mounting an EFS volume containing credentials files adds significant operational complexity: the credentials file must be pre-populated and kept in sync, access must be secured, and file permissions must be managed carefully. EFS is appropriate for large shared datasets, not for injecting secrets, and it does not integrate with Secrets Manager rotation.",
    ],
    tags: ["ecs", "fargate", "secrets-manager", "task-definition", "security"],
  },

  // ─── DOMAIN 4: TROUBLESHOOTING & OPTIMIZATION ───────────────────────────────

  {
    id: "qq-028",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "AWS X-Ray",
    question:
      "A developer wants to track custom business data (e.g., orderId, userId) in X-Ray traces to filter and search for specific traces. Which X-Ray mechanism should they use?",
    options: [
      "Annotations — indexed key-value pairs searchable in the X-Ray console",
      "Metadata — non-indexed key-value pairs for additional context",
      "Subsegments — child segments for capturing additional trace data",
      "Sampling rules — configurable trace collection rates",
    ],
    correctIndices: [0],
    explanation:
      "X-Ray Annotations are indexed key-value pairs that you can use to filter and search traces in the X-Ray console and API. Use annotations for data you will query (orderId, userId, environment). Metadata stores additional non-indexed information visible in trace details but not searchable. Subsegments capture timing for downstream calls. Sampling rules control what percentage of requests are traced.",
    optionExplanations: [
      "Correct. X-Ray Annotations are indexed key-value pairs (strings, numbers, or Booleans) that you can filter and search on in the X-Ray console and Groups — ideal for business identifiers like orderId or userId.",
      "Incorrect. X-Ray Metadata stores arbitrary non-indexed data visible in trace detail views but cannot be used in filter expressions to search for specific traces in the console or API.",
      "Incorrect. Subsegments are timing wrappers around downstream calls (HTTP, DynamoDB, etc.) that appear as child segments in a trace; they are for performance breakdown, not for attaching searchable business data.",
      "Incorrect. Sampling rules control the percentage of incoming requests that are traced; they define collection rates and do not attach custom data to individual traces.",
    ],
    tags: ["x-ray", "annotations", "metadata", "tracing", "filtering"],
  },
  {
    id: "qq-029",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "Amazon CloudWatch",
    question:
      "A Lambda function is invoked thousands of times per minute. The team needs custom business metrics (e.g., orders processed per minute) without making PutMetricData API calls on every invocation, which would be too costly. What is the BEST solution?",
    options: [
      "Use CloudWatch Embedded Metric Format (EMF) to embed metrics in structured log output",
      "Write metrics to DynamoDB and query them with CloudWatch",
      "Aggregate metrics in Lambda and call PutMetricData once per hour",
      "Use X-Ray annotations to capture metric values",
    ],
    correctIndices: [0],
    explanation:
      "CloudWatch Embedded Metric Format (EMF) lets functions write metric data as part of structured JSON log output. CloudWatch Logs automatically extracts and publishes the metrics — no PutMetricData API call needed. This works with the existing logging infrastructure and costs nothing extra beyond log storage. Aggregating in Lambda state is not possible at scale because Lambda is stateless. X-Ray annotations are for trace filtering, not metrics.",
    optionExplanations: [
      "Correct. CloudWatch Embedded Metric Format (EMF) lets Lambda write metric data as structured JSON log lines; CloudWatch Logs automatically extracts and publishes the metrics without any PutMetricData API call.",
      "Incorrect. DynamoDB is a key-value store, not a metrics pipeline; writing metrics there requires a separate polling or ETL process and does not integrate with CloudWatch Alarms natively.",
      "Incorrect. Lambda is stateless — each invocation runs in an isolated environment, so in-memory aggregation across invocations is not possible at scale and would produce inaccurate counts.",
      "Incorrect. X-Ray annotations are indexed key-value pairs for filtering traces, not a metrics system; they cannot be used to define CloudWatch Alarms or dashboards.",
    ],
    tags: ["cloudwatch", "emf", "custom-metrics", "lambda", "cost"],
  },
  {
    id: "qq-030",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon ElastiCache",
    question:
      "An application's DynamoDB reads are causing latency. The read pattern is highly repetitive — the same items are requested frequently. Which solution provides the LOWEST latency improvement?",
    options: [
      "Add a DAX (DynamoDB Accelerator) cluster in front of DynamoDB",
      "Enable DynamoDB auto-scaling to add capacity",
      "Switch to eventually consistent reads to reduce latency",
      "Add ElastiCache Redis as an application-level cache",
    ],
    correctIndices: [0],
    explanation:
      "DAX provides microsecond read latency for DynamoDB and is a drop-in compatible cache — the application uses the DAX client instead of the DynamoDB client with minimal code changes. It provides lower latency than ElastiCache because it is designed specifically for DynamoDB and is API-compatible. ElastiCache Redis requires application-level cache logic (check cache → miss → read DB → write cache). Auto-scaling helps with throughput but not latency. Eventually consistent reads reduce cost but have minimal impact on latency.",
    optionExplanations: [
      "Correct. DAX (DynamoDB Accelerator) is API-compatible with DynamoDB and provides microsecond read latency by caching responses in-memory; switching from the DynamoDB client to the DAX client requires minimal code changes.",
      "Incorrect. DynamoDB auto-scaling adjusts provisioned throughput capacity to handle more concurrent requests, which helps prevent throttling, but it does not reduce the fundamental read latency experienced by the application.",
      "Incorrect. Eventually consistent reads are cheaper (half the RCU cost) and marginally faster than strongly consistent reads in some cases, but the latency difference is minimal and does not address a highly repetitive read pattern.",
      "Incorrect. ElastiCache Redis can cache DynamoDB responses but requires the application to implement cache-aside logic (check cache → miss → read DB → write cache → return), making it more complex than DAX and not API-compatible.",
    ],
    tags: ["dynamodb", "dax", "elasticache", "caching", "latency"],
  },
  {
    id: "qq-031",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "AWS Lambda",
    question:
      'A Lambda function connected to a Kinesis Data Stream is processing data slowly. A single "poison pill" message keeps causing the function to fail, blocking all other messages in the shard. What is the BEST fix?',
    options: [
      "Enable BisectBatchOnFunctionError and configure an OnFailure destination to route failed records to SQS",
      "Increase the function timeout and retry the failed batch indefinitely",
      "Switch to a Standard SQS queue as the event source",
      "Add a Dead Letter Queue to the Lambda function",
    ],
    correctIndices: [0],
    explanation:
      "BisectBatchOnFunctionError splits a failing batch in half recursively to isolate the poison-pill record. Combined with an OnFailure destination (SQS or SNS), the isolated bad record is routed out of the stream so processing can continue. MaximumRetryAttempts controls how many times a batch is retried before routing to the destination. Simply increasing timeout keeps retrying the same bad message indefinitely. Lambda DLQs only apply to asynchronous invocations, not stream-based event sources.",
    optionExplanations: [
      "Correct. BisectBatchOnFunctionError splits the failing batch in half recursively to isolate the poison-pill record, and OnFailure destination routes the bad record to SQS so the rest of the shard continues processing.",
      "Incorrect. Increasing the timeout just retries the same bad record indefinitely — the shard remains blocked and no progress is made.",
      "Incorrect. Switching to SQS changes the event source architecture entirely and doesn't solve the root cause; the poison-pill record would still need to be handled with partial batch responses or a DLQ.",
      "Incorrect. Lambda DLQs apply only to asynchronous (event) invocations, not to stream-based (Kinesis/DynamoDB Streams) event source mappings — the OnFailure destination on the event source mapping is the correct mechanism.",
    ],
    tags: ["lambda", "kinesis", "poison-pill", "bisect", "error-handling"],
  },
  {
    id: "qq-032",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudWatch",
    question:
      "A developer needs to search CloudWatch Logs for all ERROR-level log entries across all Lambda functions in an account and view them in a single query. Which CloudWatch feature enables this?",
    options: [
      "CloudWatch Logs Insights with a cross-log-group query",
      "CloudWatch Metrics with a custom namespace filter",
      "CloudWatch Contributor Insights with error pattern matching",
      "CloudWatch Synthetics with error detection canaries",
    ],
    correctIndices: [0],
    explanation:
      "CloudWatch Logs Insights supports querying multiple log groups simultaneously using cross-log-group queries. You can specify multiple log groups or use a prefix pattern to match all Lambda log groups. Logs Insights uses a purpose-built query language to filter, aggregate, and visualize log data. Metrics do not contain log content. Contributor Insights analyzes log patterns to identify top contributors. Synthetics monitors application endpoints, not Lambda logs.",
    optionExplanations: [
      "Correct. CloudWatch Logs Insights supports querying multiple log groups simultaneously (cross-log-group queries), allowing you to search for ERROR entries across all Lambda log groups in a single query.",
      "Incorrect. CloudWatch Metrics store numeric time-series data (counts, averages); they do not contain log message text and cannot be filtered by log level like ERROR.",
      "Incorrect. CloudWatch Contributor Insights analyzes log patterns to identify top contributors to a metric (e.g., which IP addresses make the most requests); it is not designed for ad-hoc cross-group log searches.",
      "Incorrect. CloudWatch Synthetics creates canary scripts that monitor application endpoints for availability and latency; it does not analyze existing Lambda log output for errors.",
    ],
    tags: [
      "cloudwatch",
      "logs-insights",
      "lambda",
      "debugging",
      "cross-log-group",
    ],
  },
  {
    id: "qq-033",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "multi",
    service: "AWS X-Ray",
    question:
      "A microservices application has intermittent latency spikes. The team wants to trace requests end-to-end across Lambda, API Gateway, and DynamoDB. Which TWO actions are required? (Select TWO)",
    options: [
      "Enable X-Ray active tracing on the Lambda function",
      "Enable X-Ray tracing on the API Gateway stage",
      "Install the X-Ray daemon as a Lambda layer on each function",
      "Add X-Ray annotations to every DynamoDB API call",
      "Create a CloudWatch Logs subscription filter for X-Ray data",
    ],
    correctIndices: [0, 1],
    explanation:
      "To get end-to-end traces through API Gateway → Lambda → DynamoDB: enable X-Ray tracing on the API Gateway stage (adds trace header to requests) and enable active tracing on Lambda (Lambda automatically runs the X-Ray daemon and sends traces). DynamoDB calls are automatically captured as subsegments by the AWS SDK when tracing is enabled — no manual annotations needed for basic tracing. Lambda manages the X-Ray daemon automatically — no Layer needed. X-Ray data is not sent via CloudWatch Logs.",
    optionExplanations: [
      "Correct. Enabling active tracing on a Lambda function causes Lambda to automatically instrument the function and send trace segments to X-Ray — no manual daemon installation is needed because Lambda manages the daemon.",
      "Correct. Enabling X-Ray tracing on the API Gateway stage causes API Gateway to generate a root trace segment and propagate the X-Ray trace header to downstream integrations, creating an end-to-end trace across the service boundary.",
      "Incorrect. Lambda automatically runs and manages the X-Ray daemon in its execution environment; attaching the daemon as a Layer is unnecessary and would conflict with the built-in daemon.",
      "Incorrect. The AWS SDK automatically creates X-Ray subsegments for DynamoDB calls when tracing is enabled on the Lambda function; no manual annotation of each DynamoDB call is required for basic subsegment capture.",
      "Incorrect. X-Ray trace data is sent directly from the Lambda execution environment to the X-Ray service via the daemon; it does not travel through CloudWatch Logs, so a Logs subscription filter cannot capture it.",
    ],
    tags: ["x-ray", "api-gateway", "lambda", "tracing", "microservices"],
  },
  {
    id: "qq-034",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "An application returns stale data from CloudFront even after the origin was updated. The developer needs to immediately invalidate specific cached objects. Which action should they take?",
    options: [
      "Create a CloudFront invalidation for the specific paths (e.g., /api/products/*)",
      "Increase the CloudFront origin TTL to force more frequent origin fetches",
      "Disable caching on the CloudFront distribution temporarily",
      "Update the S3 object metadata to trigger CloudFront cache refresh",
    ],
    correctIndices: [0],
    explanation:
      "CloudFront invalidations remove specific objects from edge caches immediately. You specify path patterns (e.g., /images/*, /api/v1/products). First 1,000 invalidation paths per month are free; thereafter $0.005 per path. Increasing TTL makes caching worse, not better. Disabling caching impacts all users. Updating S3 metadata does not trigger CloudFront invalidation — CloudFront caches based on TTL, not object modification time.",
    optionExplanations: [
      "Correct. A CloudFront invalidation removes specific objects from all edge caches immediately by specifying path patterns; subsequent requests fetch fresh content from the origin until the cache is repopulated.",
      "Incorrect. Increasing the origin TTL (Cache-Control max-age) tells CloudFront to cache objects for a longer period, which would make stale content persist even longer — the opposite of what is needed to serve fresh content.",
      "Incorrect. Disabling caching removes the performance and cost benefits of the CDN for all users globally and is a disruptive change; it is not a targeted solution for refreshing specific stale objects.",
      "Incorrect. CloudFront does not monitor S3 object metadata for changes; it caches based solely on the configured TTL (Cache-Control headers or distribution settings), so updating metadata on S3 objects has no effect on cached edge copies.",
    ],
    tags: ["cloudfront", "cache-invalidation", "cdn", "stale-cache"],
  },
  {
    id: "qq-035",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "Amazon ElastiCache",
    question:
      "An application uses ElastiCache Redis for session storage. After a Redis primary node failure, users are being logged out. The team wants automatic failover with minimal data loss. What should be configured?",
    options: [
      "Enable Multi-AZ with automatic failover on the Redis replication group",
      "Switch to ElastiCache Memcached for better high availability",
      "Use Redis Cluster Mode with multiple shards",
      "Configure an Application Load Balancer in front of Redis",
    ],
    correctIndices: [0],
    explanation:
      "ElastiCache Redis supports Multi-AZ with automatic failover: a read replica in another AZ is promoted to primary within seconds of a primary failure. This minimizes data loss (replica lag is typically milliseconds) and downtime. Memcached does not support replication or automatic failover — it is strictly for simple caching. Redis Cluster Mode adds sharding (horizontal scaling) but the question is about availability, not capacity. Load balancers do not solve Redis failover.",
    optionExplanations: [
      "Correct. ElastiCache Redis with Multi-AZ enabled maintains one or more read replicas in separate Availability Zones; if the primary node fails, a replica is automatically promoted to primary within seconds, providing automatic failover.",
      "Incorrect. ElastiCache Memcached does not support replication or automatic failover — each node is independent; a node failure results in permanent cache loss for that node's data, making it unsuitable for session storage requiring HA.",
      "Incorrect. Redis Cluster Mode adds horizontal sharding by distributing keys across multiple shards, which increases total memory and throughput capacity; however, the question asks about availability after a primary failure, not capacity.",
      "Incorrect. Application Load Balancers route HTTP/HTTPS traffic to backend servers; they cannot front a Redis cluster and have no concept of Redis failover or replication — Redis is a TCP-level protocol not handled by ALBs.",
    ],
    tags: ["elasticache", "redis", "multi-az", "failover", "high-availability"],
  },
  {
    id: "qq-036",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS AppConfig",
    question:
      "A team uses AWS AppConfig to manage feature flags. After deploying a new configuration, a CloudWatch alarm fires indicating increased error rates. What does AppConfig do automatically?",
    options: [
      "Rolls back to the previous configuration if a CloudWatch alarm is linked as a rollback trigger",
      "Sends an SNS notification to the team but continues the deployment",
      "Pauses the deployment and waits for manual approval to continue",
      "Increases the deployment interval to slow down the rollout",
    ],
    correctIndices: [0],
    explanation:
      "AppConfig supports CloudWatch alarm-based rollback triggers. If a linked alarm enters ALARM state during a deployment, AppConfig automatically stops the deployment and rolls back to the previously deployed configuration. This provides automated safety for configuration changes — similar to CodeDeploy rollback triggers. AppConfig does not pause and wait or adjust intervals automatically.",
    optionExplanations: [
      "Correct. AppConfig supports CloudWatch alarm-based rollback triggers; when a linked alarm enters ALARM state during a deployment, AppConfig automatically stops the deployment and reverts to the previously deployed configuration version.",
      "Incorrect. AppConfig does not merely send SNS notifications and continue; when a rollback alarm fires, it actively stops and rolls back the deployment rather than just notifying the team while continuing to push the new configuration.",
      "Incorrect. AppConfig does not pause a deployment and wait for manual approval when an alarm fires; it performs an immediate automatic rollback to protect the application without requiring human intervention.",
      "Incorrect. AppConfig does not automatically adjust deployment intervals in response to alarms; the deployment strategy (linear, exponential, all-at-once) is fixed at configuration time and cannot be dynamically modified mid-deployment.",
    ],
    tags: ["appconfig", "rollback", "cloudwatch", "alarms", "feature-flags"],
  },
  {
    id: "qq-037",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "An API Gateway REST API must only be accessible from a specific VPC. What is the MOST restrictive and correct configuration?",
    options: [
      "Create a private API Gateway endpoint and attach a resource policy that allows access only from the specific VPC",
      "Use a WAF rule to block all traffic not originating from the VPC IP range",
      "Enable API Gateway usage plans with IP-based throttling",
      "Place API Gateway behind a Network Load Balancer inside the VPC",
    ],
    correctIndices: [0],
    explanation:
      "Private API Gateway endpoints are accessible only via VPC interface endpoints (PrivateLink). Combined with a resource policy that restricts access to a specific VPC ID or VPC endpoint ID, this ensures the API is only reachable from within the VPC. WAF operates at the network level and cannot enforce VPC-based access. Usage plans throttle by API key, not network origin. API Gateway cannot be placed behind an NLB in the traditional sense.",
    optionExplanations: [
      "Correct. Private API Gateway endpoints are only accessible via VPC interface endpoints (AWS PrivateLink); combining this with a resource policy that restricts access to a specific vpc-id or vpce-id ensures the API cannot be reached from the public internet.",
      "Incorrect. AWS WAF can block requests based on IP addresses but cannot enforce VPC-level network origin; traffic from VPC private IPs can be NAT'd to public IPs, so IP-based rules are insufficient to truly restrict access to a specific VPC.",
      "Incorrect. API Gateway usage plans with throttling control the rate and quota of API calls per API key; they are a traffic management tool, not a network access control mechanism, and do not restrict which network can reach the API.",
      "Incorrect. API Gateway is a managed service that cannot be directly deployed inside a VPC or placed behind a Network Load Balancer in the conventional sense; the correct VPC-restriction mechanism is a private endpoint with a resource policy.",
    ],
    tags: [
      "api-gateway",
      "private-endpoint",
      "vpc",
      "resource-policy",
      "security",
    ],
  },
  {
    id: "qq-038",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon EventBridge",
    question:
      "A developer wants to trigger a Lambda function every weekday at 9:00 AM UTC. Which EventBridge feature enables this?",
    options: [
      "EventBridge Scheduler with a cron expression: cron(0 9 ? * MON-FRI *)",
      "EventBridge Rule with an event pattern matching a custom time event",
      "EventBridge Pipe connected to a CloudWatch alarm",
      "EventBridge Archive with a replay schedule",
    ],
    correctIndices: [0],
    explanation:
      "EventBridge Scheduler (or EventBridge Rules with schedule expressions) supports cron and rate expressions for time-based triggers. cron(0 9 ? * MON-FRI *) fires at 9:00 AM UTC Monday through Friday. The target can be a Lambda function, SQS queue, Step Functions, or 200+ other AWS services. EventBridge Pipes connect event sources to targets with filtering and enrichment. Archives are for replaying past events.",
    optionExplanations: [
      "Correct. EventBridge Scheduler (and EventBridge Rules with schedule expressions) supports cron expressions for time-based triggers. The expression cron(0 9 ? * MON-FRI *) fires at 9:00 AM UTC every Monday through Friday and can target a Lambda function directly.",
      "Incorrect. EventBridge Rules with event patterns match incoming events based on their structure and content; they do not trigger on a time schedule and cannot replace a cron expression for a scheduled task.",
      "Incorrect. EventBridge Pipes connect a supported source (like SQS or Kinesis) to a target with optional filtering and enrichment; a CloudWatch alarm is not a Pipe source and this combination does not implement time-based scheduling.",
      "Incorrect. EventBridge Archive captures events that have already been published to an event bus and allows replaying them later; it is not a scheduling mechanism and cannot trigger a Lambda function on a recurring time-based schedule.",
    ],
    tags: ["eventbridge", "scheduler", "cron", "lambda", "scheduled-tasks"],
  },
  {
    id: "qq-039",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon RDS",
    question:
      'A serverless application with unpredictable traffic spikes uses Lambda functions connecting to an RDS MySQL database. During spikes, the application experiences "too many connections" errors. What is the BEST solution?',
    options: [
      "Add an RDS Proxy between Lambda and RDS to pool and manage database connections",
      "Increase the max_connections parameter on the RDS instance",
      "Switch to DynamoDB for better serverless scaling",
      "Use connection pooling libraries in the Lambda function code",
    ],
    correctIndices: [0],
    explanation:
      "RDS Proxy solves the Lambda connection exhaustion problem. Lambda can create thousands of concurrent invocations each trying to open a database connection — quickly exceeding RDS max_connections. RDS Proxy maintains a connection pool and multiplexes thousands of application connections into a smaller set of long-lived database connections. It handles connection reuse, reduces connection overhead, and improves failover time. Increasing max_connections has hard limits. Connection pooling in Lambda is limited because Lambda environments are short-lived and pooling is per-environment.",
    optionExplanations: [
      "Correct. RDS Proxy is the purpose-built solution for the Lambda-to-RDS connection exhaustion problem. It maintains a pool of long-lived database connections and multiplexes thousands of short-lived Lambda connections into that pool, dramatically reducing the number of actual database connections. RDS Proxy also improves failover handling and supports IAM authentication.",
      "Incorrect. Increasing max_connections provides temporary relief but does not scale to meet unpredictable serverless traffic. Each database connection consumes memory on the RDS instance, and setting max_connections too high can exhaust instance memory, causing database instability. The root cause (Lambda opening a new connection per invocation) is not addressed.",
      "Incorrect. Switching to DynamoDB would be a major architectural change that might not be appropriate for all workloads, particularly those requiring relational data, complex joins, or ACID transactions. It is not a targeted solution to the connection exhaustion problem and would require significant application refactoring.",
      "Incorrect. Connection pooling libraries in Lambda code (like SQLAlchemy pooling in Python) are partially effective: a pool is maintained per Lambda execution environment (a warm Lambda container), but new environments are created during scale-out events, each establishing their own connections. Under heavy load with thousands of concurrent invocations, this still results in too many connections to RDS.",
    ],
    tags: ["rds", "rds-proxy", "lambda", "connection-pooling", "serverless"],
  },
  {
    id: "qq-040",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodePipeline",
    question:
      "A CodePipeline pipeline must not proceed to production deployment without a senior engineer approving the change. Which action type should be added between the staging and production stages?",
    options: [
      "Manual Approval action",
      "Lambda Invoke action with approval logic",
      "Test action with a quality gate",
      "Source action with a branch protection rule",
    ],
    correctIndices: [0],
    explanation:
      "CodePipeline Manual Approval actions pause the pipeline and send an SNS notification to approvers. The pipeline waits (up to 7 days) for an approve or reject decision via the console, CLI, or API before proceeding. Lambda Invoke could implement custom logic but adds unnecessary complexity. Test actions run automated tests — they do not provide human approval gates. Source actions relate to code retrieval.",
    optionExplanations: [
      "Correct. A Manual Approval action pauses the pipeline, sends an SNS notification to specified approvers, and waits up to 7 days for someone to approve or reject via the AWS Console, CLI, or API before the pipeline proceeds.",
      "Incorrect. A Lambda Invoke action can execute custom approval logic programmatically, but it requires building and maintaining that logic; a Manual Approval action is the built-in, purpose-built solution for human gate review.",
      "Incorrect. A Test action in CodePipeline runs automated tests (e.g., with CodeBuild or a third-party testing service); it evaluates pass/fail criteria automatically and cannot wait for a human decision.",
      "Incorrect. A Source action retrieves the latest code from the source repository (CodeCommit, GitHub, S3); it is the first stage of a pipeline and has nothing to do with human approval gates between stages.",
    ],
    tags: ["codepipeline", "manual-approval", "ci-cd", "governance"],
  },

  // ─── ADDITIONAL QUESTIONS ────────────────────────────────────────────────────

  // AWS Lambda
  {
    id: "qq-041",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Lambda",
    question:
      "A Lambda function needs to access resources inside a private VPC subnet, such as an RDS database. After enabling VPC access, the team notices the function can no longer reach the internet to call an external API. What is the MOST likely cause and fix?",
    options: [
      "VPC-connected Lambda has no internet access by default; add a NAT Gateway in a public subnet and route private subnet traffic through it",
      "Lambda cannot access the internet from a VPC; use API Gateway as a proxy instead",
      "The Lambda execution role is missing internet access permissions",
      "Enable the Lambda function URL to bypass VPC restrictions",
    ],
    correctIndices: [0],
    explanation:
      "When Lambda is placed inside a VPC, it loses its default internet access. The fix is a NAT Gateway deployed in a public subnet with the private subnet's route table pointing 0.0.0.0/0 to the NAT Gateway. Lambda can then reach the internet while remaining inside the VPC. Lambda execution roles control AWS service access, not internet connectivity. Lambda function URLs are inbound, not outbound. Lambda can access the internet from a VPC — it just needs NAT.",
    optionExplanations: [
      "Correct. When Lambda is placed inside a VPC, it loses its default internet access. The correct fix is a NAT Gateway in a public subnet with the private subnet's route table pointing 0.0.0.0/0 to the NAT Gateway, allowing outbound internet traffic while keeping the function private.",
      "Incorrect. Lambda can absolutely access the internet from inside a VPC — it just requires a NAT Gateway. API Gateway is an inbound trigger for Lambda, not an outbound proxy for Lambda's internet traffic.",
      "Incorrect. The Lambda execution role controls which AWS services the function can call via IAM; it has no bearing on outbound TCP/IP internet connectivity, which is a network routing concern.",
      "Incorrect. Lambda function URLs provide an inbound HTTPS endpoint for invoking the function from the internet — they do not grant the function itself outbound internet access.",
    ],
    tags: ["lambda", "vpc", "nat-gateway", "networking"],
  },
  {
    id: "qq-042",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "AWS Lambda",
    question:
      "What is the maximum execution timeout for an AWS Lambda function?",
    options: ["15 minutes", "5 minutes", "1 hour", "30 minutes"],
    correctIndices: [0],
    explanation:
      "Lambda functions have a maximum execution timeout of 15 minutes (900 seconds). The default is 3 seconds. For workloads exceeding 15 minutes, consider AWS Fargate, EC2, AWS Batch, or Step Functions to orchestrate multiple shorter Lambda executions.",
    optionExplanations: [
      "Correct. The maximum execution timeout for a Lambda function is 15 minutes (900 seconds). For workloads that require longer execution, use Fargate, EC2, AWS Batch, or Step Functions to orchestrate multiple shorter Lambda executions.",
      "Incorrect. 5 minutes was an earlier limit but the current maximum timeout is 15 minutes (900 seconds).",
      "Incorrect. Lambda does not support a 1-hour timeout — the hard limit is 15 minutes regardless of memory or configuration.",
      "Incorrect. 30 minutes exceeds the absolute maximum Lambda timeout of 15 minutes.",
    ],
    tags: ["lambda", "timeout", "limits"],
  },
  {
    id: "qq-043",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    service: "AWS Lambda",
    question:
      "A Lambda function is hitting the 3 GB /tmp storage limit. Which TWO alternatives can provide larger or shared persistent storage for Lambda? (Select TWO)",
    options: [
      "Mount an Amazon EFS file system to the Lambda function",
      "Use an S3 bucket to store and retrieve large files during execution",
      "Increase the Lambda memory allocation to get more /tmp space",
      "Use an SQS queue to buffer data across invocations",
      "Enable Lambda Provisioned Concurrency to persist /tmp across invocations",
    ],
    correctIndices: [0, 1],
    explanation:
      "EFS can be mounted to Lambda functions within a VPC, providing virtually unlimited shared storage that persists across invocations and is accessible by multiple functions simultaneously. S3 provides unlimited object storage accessible within Lambda execution via the SDK — ideal for large files. /tmp is limited to 10 GB (recently increased from 512 MB) and is NOT shared across invocations. Memory allocation does not affect /tmp size. Provisioned Concurrency keeps environments warm but /tmp is still isolated per environment.",
    optionExplanations: [
      "Correct. Amazon EFS can be mounted to Lambda functions within a VPC, providing virtually unlimited shared persistent storage accessible simultaneously by multiple function instances — persisting data across invocations.",
      "Correct. Amazon S3 provides effectively unlimited object storage that Lambda can read from and write to via the AWS SDK during execution — it is the standard solution for large files that exceed /tmp limits.",
      "Incorrect. Lambda memory allocation and /tmp storage are completely independent — increasing memory does not increase the /tmp ephemeral storage size (which has its own separate limit).",
      "Incorrect. SQS is a message queue for decoupled communication between systems, not a storage layer for large data; it has a 256 KB message size limit and does not persist arbitrary binary data.",
      "Incorrect. Provisioned Concurrency keeps execution environments warm to reduce cold starts, but /tmp storage is still isolated per environment and is not shared or persisted across invocations.",
    ],
    tags: ["lambda", "efs", "s3", "storage", "tmp"],
  },
  {
    id: "qq-044",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Lambda",
    question:
      "A Lambda function must process events from an SQS queue. During a traffic spike, the queue depth grows to 100,000 messages. What happens to Lambda concurrency?",
    options: [
      "Lambda automatically scales up to process messages faster, limited by the function's reserved or account concurrency limit",
      "Lambda processes exactly one message at a time regardless of queue depth",
      "Lambda scales to exactly one concurrent execution per SQS shard",
      "Lambda stops scaling after 1,000 concurrent executions for SQS triggers",
    ],
    correctIndices: [0],
    explanation:
      "When Lambda polls SQS, it scales concurrency based on the number of in-flight message batches. As queue depth grows, Lambda adds more concurrent executions (up to 60 new instances per minute initially, then faster). Scaling is limited by the function's reserved concurrency (if set) or the account-level concurrency limit (default 1,000, adjustable). There is no SQS-specific concurrency cap at 1,000 — that is the account default which applies across all functions.",
    optionExplanations: [
      "Correct. Lambda automatically scales concurrency as SQS queue depth grows — it adds more concurrent executions (up to 60 new instances per minute initially, then faster) until the queue drains or concurrency limits are reached.",
      "Incorrect. Lambda absolutely does scale beyond one concurrent execution for SQS — it increases parallelism based on queue depth and the configured batch size.",
      "Incorrect. SQS does not have shards (that is a Kinesis concept); Lambda scales based on the number of in-flight message batches, not a fixed one-per-shard rule.",
      "Incorrect. The 1,000 concurrent execution figure is the account-level default limit that applies across all functions — it is not an SQS-specific cap, and it can be increased by requesting a quota increase.",
    ],
    tags: ["lambda", "sqs", "concurrency", "auto-scaling"],
  },

  // Amazon DynamoDB
  {
    id: "qq-045",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      "A developer needs to atomically increment a counter in a DynamoDB item without reading the item first. Which DynamoDB feature enables this?",
    options: [
      "UpdateItem with an ADD action on a numeric attribute",
      "PutItem with a ConditionExpression checking the current value",
      "TransactWriteItems combining GetItem and PutItem",
      "BatchWriteItem with multiple UpdateItem requests",
    ],
    correctIndices: [0],
    explanation:
      "DynamoDB's UpdateItem with the ADD action (or SET attribute = attribute + :val) atomically increments a numeric attribute without a read-modify-write cycle. This is safe under concurrent writes. PutItem replaces the entire item and requires knowing the current value. TransactWriteItems provides cross-item atomicity but is heavier than needed for a simple counter. BatchWriteItem only supports PutItem and DeleteItem — not UpdateItem.",
    optionExplanations: [
      "Correct. UpdateItem with the ADD action (or using SET attribute = attribute + :val in the UpdateExpression) atomically increments a numeric attribute in a single API call — no separate read is required, and it is safe under concurrent writes.",
      "Incorrect. PutItem replaces the entire item with the provided attribute values — to use it for a counter, you would need to read the current value first, creating a race condition under concurrent writes.",
      "Incorrect. TransactWriteItems can coordinate multiple operations atomically across items and tables, but it requires knowing the current value (typically via a condition) and is heavier than needed for a simple atomic counter.",
      "Incorrect. BatchWriteItem supports only PutItem and DeleteItem operations in batch — it does not support UpdateItem and therefore cannot perform atomic increment operations.",
    ],
    tags: ["dynamodb", "atomic-counter", "updateitem", "add"],
  },
  {
    id: "qq-046",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      "A DynamoDB table uses on-demand capacity mode. A burst of 50,000 writes per second hits the table. What happens?",
    options: [
      "DynamoDB handles the burst automatically up to twice the previous peak traffic; writes beyond that may be throttled",
      "DynamoDB scales instantly to any write rate with no throttling possible",
      "DynamoDB switches to provisioned mode automatically to handle the burst",
      "Writes are queued and processed in order without any throttling",
    ],
    correctIndices: [0],
    explanation:
      "DynamoDB on-demand mode adapts to traffic, but it has limits. It can instantly accommodate up to double the previous peak traffic within a given table. If traffic spikes beyond twice the peak (for a new table, the limit is 4,000 WCU/s initially), throttling may occur until DynamoDB scales to the new peak. On-demand does not switch to provisioned mode. There is no queue — throttled requests receive ProvisionedThroughputExceededException.",
    optionExplanations: [
      "Correct. DynamoDB on-demand mode adapts to traffic automatically, but it can instantly accommodate up to twice the previous peak traffic. If a table is new or traffic exceeds double the previous peak, some throttling may occur until DynamoDB internally scales to the new peak.",
      "Incorrect. On-demand mode is not unlimited — it can scale very high, but extremely sudden spikes beyond twice the previous peak can still result in throttling until DynamoDB adjusts its internal capacity allocation.",
      "Incorrect. DynamoDB on-demand mode never automatically switches to provisioned capacity mode — these are two distinct billing and capacity modes that must be explicitly changed by the user.",
      "Incorrect. DynamoDB does not queue write requests — throttled write operations immediately return a ProvisionedThroughputExceededException error to the caller, which must implement retry logic with exponential backoff.",
    ],
    tags: ["dynamodb", "on-demand", "throttling", "capacity-mode"],
  },
  {
    id: "qq-047",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      "A developer wants to ensure a DynamoDB PutItem only succeeds if the item does not already exist. Which approach is correct?",
    options: [
      "Use a ConditionExpression: attribute_not_exists(pk)",
      "Use a FilterExpression on the PutItem call",
      "Use TransactGetItems to check existence before PutItem",
      "Use BatchWriteItem which automatically skips existing items",
    ],
    correctIndices: [0],
    explanation:
      "ConditionExpression with attribute_not_exists(pk) on PutItem causes the operation to fail with ConditionalCheckFailedException if an item with that partition key already exists. This is an atomic check-and-write — no race condition. FilterExpression is only for Query and Scan — not PutItem. TransactGetItems + PutItem would require two operations with potential race conditions. BatchWriteItem does not check for existing items — it overwrites.",
    optionExplanations: [
      "Correct. ConditionExpression with attribute_not_exists(pk) on a PutItem call makes the operation fail atomically with ConditionalCheckFailedException if an item with that partition key already exists — preventing overwrites without a separate read.",
      "Incorrect. FilterExpression is used only with Query and Scan operations to filter results after items are retrieved — it cannot be used with PutItem to conditionally prevent writes.",
      "Incorrect. TransactGetItems retrieves items for reading; combining it with PutItem in separate calls creates a time-of-check to time-of-use (TOCTOU) race condition — the ConditionExpression approach is the atomic alternative.",
      "Incorrect. BatchWriteItem does not check for existing items before writing — it unconditionally overwrites any existing item with the same primary key, which is the opposite of the desired behavior.",
    ],
    tags: ["dynamodb", "conditional-write", "putitem", "attribute-not-exists"],
  },
  {
    id: "qq-048",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "Amazon DynamoDB",
    question: "What is the maximum item size in Amazon DynamoDB?",
    options: ["400 KB", "1 MB", "64 KB", "16 MB"],
    correctIndices: [0],
    explanation:
      "DynamoDB has a maximum item size of 400 KB, including attribute names and values. For items larger than 400 KB, store the large data in S3 and store the S3 object key in DynamoDB. This is a common pattern for documents, images, or large JSON payloads.",
    optionExplanations: [
      "Correct. DynamoDB enforces a maximum item size of 400 KB, including all attribute names and their values. Items exceeding this limit must be redesigned — typically by storing large payloads in S3 and keeping only the S3 object reference in DynamoDB.",
      "Incorrect. 1 MB exceeds the DynamoDB item size limit — attempts to write items larger than 400 KB will fail with a ValidationException.",
      "Incorrect. 64 KB is well below the actual 400 KB limit — items can be up to 400 KB in total size.",
      "Incorrect. 16 MB is the maximum document size for MongoDB — DynamoDB's limit is 400 KB, which is far smaller.",
    ],
    tags: ["dynamodb", "limits", "item-size"],
  },
  {
    id: "qq-049",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    service: "Amazon DynamoDB",
    question:
      "A developer needs to perform multiple write operations across different DynamoDB tables as an all-or-nothing transaction. Which TWO statements about DynamoDB Transactions are correct? (Select TWO)",
    options: [
      "TransactWriteItems can write to multiple tables in a single atomic operation",
      "Transactions consume twice the WCU compared to non-transactional writes",
      "Transactions can span multiple AWS accounts",
      "TransactGetItems supports up to 100 items across tables",
      "Transactions are eventually consistent by default",
    ],
    correctIndices: [0, 1],
    explanation:
      "TransactWriteItems allows up to 100 write operations across multiple tables atomically — all succeed or all fail. Transactions consume 2x the WCU/RCU because DynamoDB performs two underlying read/write operations (prepare and commit phases). Transactions cannot span AWS accounts — they are within one account and region. TransactGetItems also supports up to 100 items but uses strongly consistent reads (not eventually consistent).",
    optionExplanations: [
      "Correct. TransactWriteItems supports up to 100 write operations (Put, Update, Delete, ConditionCheck) across multiple tables in a single atomic transaction — all operations succeed together or all fail together.",
      "Correct. DynamoDB transactions consume 2× the WCU/RCU compared to equivalent non-transactional operations because DynamoDB performs two underlying phases (prepare and commit) to ensure atomicity.",
      "Incorrect. DynamoDB Transactions are scoped to a single AWS account and a single region — they cannot span multiple AWS accounts or regions.",
      "Incorrect. TransactGetItems does support reading up to 100 items across tables in a single call, but those reads are strongly consistent — not eventually consistent. (This statement is partially true for the item count but false on the consistency claim.)",
      "Incorrect. DynamoDB Transactions always use strongly consistent reads — they do not support eventually consistent reads, because eventual consistency would undermine the atomicity guarantees.",
    ],
    tags: ["dynamodb", "transactions", "transactwriteitems", "atomic"],
  },

  // Amazon S3
  {
    id: "qq-050",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon S3",
    question:
      "A developer needs to trigger a Lambda function whenever a new object is created in a specific S3 bucket prefix (/uploads/). What is the correct configuration?",
    options: [
      "Configure an S3 Event Notification with ObjectCreated event type and prefix filter /uploads/",
      "Create a CloudWatch Events rule that monitors S3 object creation",
      "Enable S3 Inventory and process the inventory report with Lambda",
      "Use S3 Access Logs to detect new object creation and trigger Lambda",
    ],
    correctIndices: [0],
    explanation:
      "S3 Event Notifications natively trigger Lambda (or SQS, SNS) on object events like s3:ObjectCreated:*. You can filter by prefix and suffix to target specific paths. This is the simplest and lowest-latency approach. CloudWatch Events can capture S3 API calls via CloudTrail but adds latency and complexity. S3 Inventory generates daily/weekly reports — not real-time. S3 Access Logs are for access auditing, not real-time triggers.",
    optionExplanations: [
      "Correct. S3 Event Notifications can be configured to invoke Lambda (or send to SQS/SNS) on s3:ObjectCreated:* events, with prefix and suffix filters to target only the /uploads/ path, providing the lowest-latency and simplest trigger.",
      "Incorrect. CloudWatch Events (EventBridge) can detect S3 API calls via CloudTrail, but this adds extra latency and requires CloudTrail data events to be enabled, making it more complex and slower than native S3 Event Notifications.",
      "Incorrect. S3 Inventory produces daily or weekly reports of bucket contents—it is designed for auditing and compliance, not for real-time event-driven processing of new uploads.",
      "Incorrect. S3 Access Logs record requests made to a bucket for auditing purposes, but they are delivered asynchronously and are not designed to trigger real-time actions when new objects arrive.",
    ],
    tags: ["s3", "event-notification", "lambda", "trigger"],
  },
  {
    id: "qq-051",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon S3",
    question:
      "An S3 bucket hosts static website content and uses CloudFront. After deploying new files, some users still see old content. The developer verified the S3 objects are updated. What is causing this?",
    options: [
      "CloudFront is serving cached objects; the developer must create a CloudFront invalidation or use versioned file names",
      "S3 object versioning is serving old versions to users with cached URLs",
      "The S3 bucket policy is preventing CloudFront from reading new objects",
      "CloudFront needs a redeployment to pick up new S3 content",
    ],
    correctIndices: [0],
    explanation:
      "CloudFront caches objects at edge locations based on TTL. Updating the origin (S3) does not automatically push new content to edges. Solutions: 1) Create a CloudFront invalidation for the changed paths (first 1,000 paths/month free). 2) Use versioned file names (e.g., app.v2.js) so new files have new URLs — no invalidation needed. S3 versioning serves the latest version by default. Bucket policies control access, not caching. CloudFront does not need redeployment.",
    optionExplanations: [
      "Correct. CloudFront caches objects at edge locations based on TTL; updating the S3 origin does not push new content to edges automatically. You must either invalidate the cached paths or use versioned file names (e.g., app.v2.js) so browsers and CloudFront fetch new URLs.",
      "Incorrect. S3 Object Versioning keeps multiple versions of an object but always serves the latest version by default; it does not cause CloudFront to serve old versions when the S3 object has been updated.",
      "Incorrect. S3 bucket policies control access permissions; if the policy were blocking CloudFront, no users would see the content at all rather than seeing a stale version.",
      "Incorrect. CloudFront distributions do not need to be redeployed to pick up new S3 objects; once the TTL expires (or an invalidation is created) the edge fetches the latest version from the origin automatically.",
    ],
    tags: ["s3", "cloudfront", "cache-invalidation", "deployment"],
  },
  {
    id: "qq-052",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon S3",
    question:
      "A company wants to ensure all data stored in S3 is encrypted and that any PUT request without server-side encryption is rejected. How should the developer enforce this?",
    options: [
      "Add a bucket policy with a Deny statement for s3:PutObject when aws:SecureTransport is false or SSE header is missing",
      "Enable S3 default encryption — it automatically rejects unencrypted PUT requests",
      "Use S3 Object Lock to enforce encryption on all objects",
      "Enable S3 MFA Delete to require encryption confirmation",
    ],
    correctIndices: [0],
    explanation:
      "A bucket policy with Deny + condition on the absence of the x-amz-server-side-encryption header rejects PUTs that don't specify encryption. S3 default encryption encrypts objects that arrive without encryption headers — it does NOT reject unencrypted requests; it transparently applies encryption. Object Lock prevents deletion/modification but does not enforce encryption. MFA Delete requires MFA for version deletion, unrelated to encryption enforcement.",
    optionExplanations: [
      "Correct. A bucket policy with an explicit Deny on s3:PutObject conditioned on the absence of the x-amz-server-side-encryption request header actively rejects PUT requests that do not specify server-side encryption, enforcing the requirement at the API level.",
      "Incorrect. S3 default encryption transparently encrypts objects that arrive without encryption headers—it does not reject those requests. Objects are stored encrypted, but the absence of an SSE header does not cause the PUT to fail.",
      "Incorrect. S3 Object Lock enforces write-once-read-many (WORM) retention policies to prevent object deletion or overwriting; it has no mechanism to enforce the presence of encryption headers on PUT requests.",
      "Incorrect. S3 MFA Delete requires multi-factor authentication to permanently delete object versions or change the versioning state of a bucket; it is unrelated to enforcing server-side encryption on uploads.",
    ],
    tags: ["s3", "encryption", "bucket-policy", "deny", "compliance"],
  },

  // Amazon SQS
  {
    id: "qq-053",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SQS",
    question:
      "A developer needs to ensure that messages in an SQS queue are processed in strict FIFO order and that each message is delivered exactly once. Which queue type should they use?",
    options: [
      "SQS FIFO queue with content-based deduplication enabled",
      "SQS Standard queue with message group IDs",
      "SQS Standard queue with a Dead Letter Queue for deduplication",
      "SQS FIFO queue without deduplication — it handles ordering automatically",
    ],
    correctIndices: [0],
    explanation:
      "SQS FIFO queues guarantee ordering and exactly-once processing. Content-based deduplication (or explicit MessageDeduplicationId) prevents duplicate messages within a 5-minute window. Standard queues guarantee at-least-once delivery and best-effort ordering only — not suitable for strict ordering or exactly-once. Message Group IDs on Standard queues do not exist (they are a FIFO feature). DLQ handles failures, not deduplication.",
    optionExplanations: [
      "Correct. SQS FIFO queues guarantee that messages are processed in the exact order they are sent and provide exactly-once processing within a 5-minute deduplication window using either content-based deduplication or an explicit MessageDeduplicationId.",
      "Incorrect. SQS Standard queues guarantee at-least-once delivery with best-effort ordering only—they do not guarantee strict FIFO order, and message group IDs are a FIFO-queue concept that does not exist on Standard queues.",
      "Incorrect. A Dead Letter Queue (DLQ) on a Standard queue captures messages that fail processing after a configured number of attempts; it handles error scenarios but does not provide deduplication or strict ordering.",
      "Incorrect. A FIFO queue does guarantee ordering, but without deduplication (either content-based or via MessageDeduplicationId) duplicate messages within a 5-minute window can still be enqueued and processed more than once.",
    ],
    tags: ["sqs", "fifo", "exactly-once", "deduplication", "ordering"],
  },
  {
    id: "qq-054",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon SQS",
    question:
      "An SQS queue has a visibility timeout of 30 seconds. A consumer receives a message, processes it for 25 seconds, and then calls DeleteMessage. 10 seconds later, another consumer receives the same message. What went wrong?",
    options: [
      "Nothing went wrong — the first consumer deleted the message after 25 seconds and the second consumer received a different copy that was already in flight before the delete",
      "The visibility timeout expired before DeleteMessage was called, allowing re-delivery",
      "SQS delivered the message twice due to at-least-once delivery semantics",
      "The DeleteMessage API has a propagation delay of up to 10 seconds",
    ],
    correctIndices: [2],
    explanation:
      "SQS Standard queues provide at-least-once delivery — a message may be delivered more than once even if successfully processed and deleted. This is a fundamental characteristic of Standard queues. The visibility timeout (30s) was not exceeded (25s < 30s) and DeleteMessage was called before expiry, but SQS can still deliver duplicate copies that were already stored internally. Applications using Standard SQS must be idempotent. Use FIFO queues if exactly-once is required.",
    optionExplanations: [
      "Incorrect. This explanation is plausible but does not match the fundamental cause—SQS Standard at-least-once delivery means a second copy can arrive independently of the delete operation's timing.",
      "Incorrect. The visibility timeout was 30 seconds and the consumer finished and deleted the message in 25 seconds, so the timeout was not exceeded; this is not the cause of the duplicate in this scenario.",
      "Correct. SQS Standard queues provide at-least-once delivery, meaning the same message may be stored and delivered as more than one copy in the queue's distributed backend. Even when the first consumer deleted the message before the visibility timeout expired, a duplicate copy already in flight can still be delivered to another consumer.",
      "Incorrect. The DeleteMessage API does not have a known propagation delay of 10 seconds; once acknowledged, the message is removed. The duplicate delivery in this scenario stems from at-least-once delivery semantics, not a delete lag.",
    ],
    tags: ["sqs", "at-least-once", "duplicate", "standard-queue", "idempotent"],
  },
  {
    id: "qq-055",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "Amazon SQS",
    question: "What is the maximum message retention period for an SQS queue?",
    options: ["14 days", "7 days", "30 days", "1 day"],
    correctIndices: [0],
    explanation:
      "SQS retains messages for a configurable period between 1 minute and 14 days. The default retention period is 4 days. After the retention period expires, messages are automatically deleted even if not consumed. For longer retention, consider storing messages in S3 and using S3 event notifications or SNS.",
    optionExplanations: [
      "Correct. SQS message retention is configurable from 1 minute to a maximum of 14 days; the default is 4 days. Messages that are not consumed within the retention period are permanently deleted by SQS.",
      "Incorrect. 7 days is a common misconception but is not the maximum; the maximum retention period is 14 days. The default is 4 days.",
      "Incorrect. 30 days exceeds the maximum SQS retention period. For longer storage of unprocessed events, a pattern like writing to S3 or DynamoDB would be required.",
      "Incorrect. 1 day (24 hours) is less than the default 4-day retention period and is not the maximum; the configurable minimum is 1 minute, not 1 day.",
    ],
    tags: ["sqs", "retention", "limits"],
  },

  // Amazon SNS
  {
    id: "qq-056",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SNS",
    question:
      "A developer needs to send notifications to only the subset of SNS subscribers interested in 'order.cancelled' events, without creating a separate topic per event type. Which SNS feature enables this?",
    options: [
      "SNS Message Filtering using subscription filter policies",
      "SNS Topic partitioning by message attribute",
      "SNS Delivery policies with conditional routing",
      "SNS FIFO topics with message group IDs",
    ],
    correctIndices: [0],
    explanation:
      "SNS subscription filter policies let each subscriber define which messages it wants to receive based on message attributes (e.g., eventType = 'order.cancelled'). The publisher sets a MessageAttribute on the SNS message; SNS evaluates each subscriber's filter policy and delivers only to matching subscribers. This avoids creating one topic per event type. Topic partitioning and conditional routing are not SNS concepts. FIFO topics provide ordering, not filtering by attribute.",
    optionExplanations: [
      "Correct. SNS subscription filter policies allow each subscriber to specify which messages it wants to receive based on message attributes (e.g., eventType = 'order.cancelled'). SNS evaluates the filter policy for each subscriber and delivers the message only to those that match, enabling event routing on a single topic without creating per-event-type topics.",
      "Incorrect. SNS does not have a concept of 'topic partitioning by message attribute'; this is not a real SNS feature. Partitioning and routing are accomplished through subscription filter policies.",
      "Incorrect. SNS delivery policies configure retry behavior and backoff for failed deliveries (e.g., to HTTP endpoints); they do not provide conditional message routing based on content or attributes.",
      "Incorrect. SNS FIFO topics guarantee message ordering and exactly-once delivery within a message group; message group IDs are used to sequence related messages, not to filter which subscribers receive which messages.",
    ],
    tags: ["sns", "filter-policy", "message-attributes", "routing"],
  },
  {
    id: "qq-057",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon SNS",
    question:
      "An SNS topic delivers to an HTTP endpoint that is occasionally unavailable. How does SNS handle delivery failures to HTTP endpoints?",
    options: [
      "SNS retries with exponential backoff according to the delivery retry policy, then moves undeliverable messages to a Dead Letter Queue if configured",
      "SNS drops the message immediately if the HTTP endpoint returns a non-200 response",
      "SNS stores failed messages internally for 14 days and retries continuously",
      "SNS automatically switches to email delivery if HTTP delivery fails",
    ],
    correctIndices: [0],
    explanation:
      "SNS has a configurable delivery retry policy for HTTP/HTTPS endpoints with up to 100,015 retries in three phases: immediate, pre-backoff, backoff (exponential), and post-backoff. After all retries are exhausted, if a Dead Letter Queue (SQS queue) is configured on the subscription, undeliverable messages are sent there. Without a DLQ, messages are permanently lost after retry exhaustion. SNS does not store failed messages internally beyond the retry window or switch delivery protocols.",
    optionExplanations: [
      "Correct. SNS applies an exponential backoff retry policy for HTTP/HTTPS endpoint delivery failures, retrying up to 100,015 times across immediate, pre-backoff, backoff, and post-backoff phases. After retries are exhausted, if a Dead Letter Queue (SQS) is configured on the subscription, the undeliverable message is routed there for investigation and manual reprocessing.",
      "Incorrect. SNS does not drop messages on the first non-200 response; it retries according to the configured delivery retry policy. Dropping immediately would violate the retry behavior that SNS is designed to provide.",
      "Incorrect. SNS does not maintain an internal 14-day message store for failed HTTP deliveries. Messages that exhaust all retry attempts are either sent to a configured DLQ or permanently discarded. The 14-day retention period is an SQS concept, not SNS.",
      "Incorrect. SNS does not automatically change the delivery protocol from HTTP to email when HTTP delivery fails. The delivery protocol is fixed at the time of subscription creation and does not change dynamically based on delivery outcomes.",
    ],
    tags: ["sns", "retry-policy", "dlq", "http-endpoint", "delivery"],
  },

  // Amazon Kinesis
  {
    id: "qq-058",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "A Kinesis Data Stream consumer needs to process records as fast as possible. Two Lambda functions need to process the same stream simultaneously with independent checkpoints. Which consumer type should be used?",
    options: [
      "Enhanced Fan-Out (EFO) consumers with dedicated 2 MB/s per shard per consumer",
      "Standard consumers sharing the 2 MB/s read throughput per shard",
      "Kinesis Data Firehose with two separate delivery streams",
      "Two separate Kinesis streams reading from the same DynamoDB Streams source",
    ],
    correctIndices: [0],
    explanation:
      "Enhanced Fan-Out (EFO) gives each registered consumer its own dedicated 2 MB/s throughput per shard via HTTP/2 push — consumers do not share throughput with each other. With two EFO consumers, each gets 2 MB/s regardless of how many total consumers exist. Standard consumers share the 2 MB/s per shard via polling — two consumers would each get at most 1 MB/s. Firehose delivers to S3/other destinations, not to Lambda for stream processing.",
    optionExplanations: [
      "Correct. Enhanced Fan-Out (EFO) gives each registered consumer its own dedicated 2 MB/s read throughput per shard via HTTP/2 server-push, so two EFO consumers each receive the full 2 MB/s independently with separate checkpoints.",
      "Incorrect. Standard consumers share the 2 MB/s read throughput per shard via polling; two consumers polling the same shard together get at most 1 MB/s each, and they compete for the same throughput budget.",
      "Incorrect. Kinesis Data Firehose is a managed delivery service that loads data to destinations like S3 or Redshift; it does not support Lambda-based stream processing with independent consumer checkpoints.",
      "Incorrect. Two separate Kinesis streams would require separate producers writing identical data to each stream, which adds complexity and cost; this does not solve the throughput problem and introduces data duplication concerns.",
    ],
    tags: ["kinesis", "enhanced-fan-out", "consumers", "throughput"],
  },
  {
    id: "qq-059",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "How long does Kinesis Data Streams retain records by default, and what is the maximum extended retention period?",
    options: [
      "24 hours default; up to 365 days with extended retention",
      "7 days default; up to 365 days with extended retention",
      "24 hours default; up to 7 days with extended retention",
      "3 days default; up to 30 days with extended retention",
    ],
    correctIndices: [0],
    explanation:
      "Kinesis Data Streams retains records for 24 hours by default. Extended data retention increases this to up to 7 days at additional cost. Long-term retention (up to 365 days) is available as an additional feature. Records beyond the retention period are automatically removed. This is separate from Kinesis Firehose, which delivers to destinations and does not have an independent retention period.",
    optionExplanations: [
      "Correct. Kinesis Data Streams retains records for 24 hours by default. Extended data retention can be enabled to increase this up to 7 days, and long-term retention extends it further to up to 365 days at additional cost.",
      "Incorrect. The default retention period for Kinesis Data Streams is 24 hours, not 7 days; 7 days is actually the maximum for the standard extended retention tier, not the default.",
      "Incorrect. While 24 hours is the correct default, the maximum extended retention is up to 365 days (not 7 days); 7 days is the limit of the first paid extension tier, but a higher long-term retention tier goes to 365 days.",
      "Incorrect. The default Kinesis retention is 24 hours, not 3 days, and the maximum retention available is 365 days, not 30 days.",
    ],
    tags: ["kinesis", "retention", "data-streams"],
  },
  {
    id: "qq-060",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "A Kinesis Data Firehose delivery stream must transform records before loading to S3 — specifically, convert JSON to Parquet format. How should the developer implement this?",
    options: [
      "Enable Firehose record format conversion using an AWS Glue Data Catalog schema",
      "Use a Lambda transformation function in Firehose to convert each record",
      "Add a Kinesis Data Analytics application between the stream and Firehose",
      "Process records with EMR after Firehose delivers JSON to S3",
    ],
    correctIndices: [0],
    explanation:
      "Kinesis Data Firehose natively supports record format conversion from JSON to Apache Parquet or ORC using an AWS Glue Data Catalog schema definition — no Lambda code required. Lambda transformation is used for custom record manipulation (filtering, enrichment, masking) before delivery, not format conversion. Kinesis Data Analytics is for SQL-based stream processing, not format conversion. EMR post-processing adds latency and complexity.",
    optionExplanations: [
      "Correct. Kinesis Data Firehose has built-in record format conversion that uses an AWS Glue Data Catalog table schema to convert JSON records to Apache Parquet or ORC format natively, with no Lambda code required.",
      "Incorrect. Lambda data transformation in Firehose is used for custom record manipulation such as filtering, enrichment, or masking individual fields, but it does not provide built-in JSON-to-Parquet conversion; you would have to implement the Parquet serialization yourself.",
      "Incorrect. Kinesis Data Analytics (now Amazon Managed Service for Apache Flink) is for SQL-based or Flink-based stream processing; it does not serve as a format-conversion step between a stream and Firehose, and adding it introduces unnecessary architectural complexity.",
      "Incorrect. Processing records with EMR after Firehose delivers raw JSON to S3 is a valid approach but adds significant latency and operational overhead; it is not the most efficient solution when Firehose's native format conversion can handle this without extra services.",
    ],
    tags: ["kinesis", "firehose", "parquet", "glue", "format-conversion"],
  },

  // Amazon EventBridge
  {
    id: "qq-061",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon EventBridge",
    question:
      "An application publishes events to EventBridge but some events are occasionally failing to reach the target Lambda function. The developer wants to investigate missed events. Which EventBridge feature should they enable?",
    options: [
      "EventBridge Archive to replay missed events and Dead Letter Queue on the rule target for delivery failures",
      "CloudWatch Logs subscription to capture all EventBridge events",
      "Enable EventBridge Pipes with SQS for guaranteed delivery",
      "Enable EventBridge Schema Registry to validate event structure",
    ],
    correctIndices: [0],
    explanation:
      "EventBridge Archive captures all events matching a filter from the event bus — you can replay archived events to reprocess missed deliveries. For delivery failures to targets, configure a Dead Letter Queue (SQS) on the EventBridge rule target — failed deliveries are routed there for investigation and reprocessing. CloudWatch Logs subscription captures log events, not arbitrary EventBridge events. Pipes are for point-to-point integrations. Schema Registry validates structure but does not help with delivery failures.",
    optionExplanations: [
      "Correct. EventBridge Archive records all matching events from the event bus so they can be replayed later to reprocess missed deliveries. Adding a Dead Letter Queue (SQS) to the rule target captures events that exhausted all retry attempts, enabling investigation and manual reprocessing of delivery failures.",
      "Incorrect. A CloudWatch Logs subscription filter captures log events from CloudWatch Logs log groups; it cannot intercept or capture arbitrary events traveling through an EventBridge event bus.",
      "Incorrect. EventBridge Pipes provide point-to-point integration between a source and a target with optional filtering and enrichment; while SQS can be a Pipe source, Pipes do not add guaranteed-delivery semantics for failures at the final target.",
      "Incorrect. EventBridge Schema Registry discovers and stores the structure of events on a bus; it validates and documents event schemas but does not investigate or handle delivery failures to Lambda targets.",
    ],
    tags: ["eventbridge", "archive", "replay", "dlq", "delivery-failure"],
  },
  {
    id: "qq-062",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon EventBridge",
    question:
      "A developer needs to integrate an application with a third-party webhook that sends HTTP POST requests to an endpoint. The events should be processed by Lambda. What is the MOST direct EventBridge solution?",
    options: [
      "EventBridge API Destinations to call the third-party service — but for inbound webhooks, use an API Gateway endpoint that publishes to EventBridge",
      "Create an EventBridge Pipe from SQS to Lambda and configure the webhook to send to SQS",
      "Use EventBridge to poll the third-party service's REST API on a schedule",
      "Configure EventBridge Schema Registry to accept inbound HTTP events",
    ],
    correctIndices: [0],
    explanation:
      "For inbound webhooks (third-party → your system), the pattern is: third-party POSTs to an API Gateway endpoint → API Gateway publishes the event to EventBridge (using PutEvents) → EventBridge routes to Lambda. API Destinations are for EventBridge calling outbound to third-party APIs. EventBridge Pipes with SQS works but adds a queue hop. EventBridge does not poll third-party APIs. Schema Registry validates event schemas, not ingestion.",
    optionExplanations: [
      "Correct. For inbound webhooks from a third party, the correct pattern is: the third party POSTs to an API Gateway endpoint, API Gateway publishes the event to EventBridge using PutEvents, and EventBridge routes to Lambda. API Destinations are the reverse — they send EventBridge events outbound to third-party HTTP endpoints.",
      "Incorrect. An EventBridge Pipe with SQS as a source and Lambda as a target works, but it requires the third-party webhook to send to SQS rather than a direct HTTP endpoint, which many webhook providers do not support natively and adds an unnecessary queue hop.",
      "Incorrect. EventBridge cannot poll third-party REST APIs on a schedule; polling is a different pattern that would require a Lambda function or a Kinesis connector, not a native EventBridge feature.",
      "Incorrect. EventBridge Schema Registry discovers event schema from events published to a bus; it is not an HTTP ingestion endpoint and cannot accept inbound HTTP POST requests from external systems.",
    ],
    tags: ["eventbridge", "api-destinations", "api-gateway", "webhook"],
  },

  // Amazon API Gateway
  {
    id: "qq-063",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "A REST API built on API Gateway and Lambda is receiving requests from a browser-based application. The browser preflight OPTIONS request is failing with a CORS error. What must the developer configure?",
    options: [
      "Enable CORS on the API Gateway resource to return Access-Control-Allow-Origin headers, and ensure Lambda also returns the header for non-preflight responses",
      "Add a WAF rule to allow OPTIONS requests from browser origins",
      "Switch to HTTP API which handles CORS automatically without configuration",
      "Add an ALB in front of API Gateway to handle CORS headers",
    ],
    correctIndices: [0],
    explanation:
      "For REST APIs, you must enable CORS on each API Gateway resource (which adds the OPTIONS method and response headers). Additionally, your Lambda integration response must include Access-Control-Allow-Origin (and other CORS headers) because API Gateway passes Lambda responses directly. HTTP APIs (v2) have simpler built-in CORS configuration but are a different product. WAF and ALB do not solve CORS — CORS headers must come from the API response itself.",
    optionExplanations: [
      "Correct. For REST APIs, you must enable CORS on each API Gateway resource (which creates the OPTIONS preflight method and adds Access-Control-Allow-* response headers). Your Lambda function must also return the Access-Control-Allow-Origin header on all non-preflight responses because REST API integrations pass the Lambda response through directly.",
      "Incorrect. WAF operates at the network and request level to filter malicious traffic; it cannot inject CORS headers into responses, and blocking or allowing OPTIONS requests at WAF does not resolve CORS failures — those must be addressed by the response headers.",
      "Incorrect. HTTP APIs (v2) do have simpler built-in CORS configuration, but they are a different product from REST APIs; switching from a REST API to an HTTP API is a significant architectural change and may not be appropriate just to simplify CORS setup.",
      "Incorrect. An Application Load Balancer placed in front of API Gateway does not resolve CORS issues because CORS headers must be returned by the API resource itself; the ALB cannot inject origin-specific Access-Control-Allow-Origin headers without additional Lambda or application logic.",
    ],
    tags: ["api-gateway", "cors", "lambda", "browser", "preflight"],
  },
  {
    id: "qq-064",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "An API Gateway REST API is experiencing latency spikes on frequently accessed GET endpoints that return slowly-changing data. The data changes every 5 minutes. What is the MOST efficient optimization?",
    options: [
      "Enable API Gateway caching on the stage with a TTL of 300 seconds for the GET endpoint",
      "Move the Lambda function to Provisioned Concurrency to reduce cold starts",
      "Switch to HTTP API which has lower latency than REST API",
      "Use API Gateway usage plans to throttle high-frequency callers",
    ],
    correctIndices: [0],
    explanation:
      "API Gateway REST API caching stores responses at the API Gateway level. With TTL=300s, the first request goes to Lambda, subsequent identical requests are served from the cache for 5 minutes. This eliminates Lambda cold starts and downstream database calls entirely for cached requests. Provisioned Concurrency reduces cold starts but does not eliminate the Lambda execution time. HTTP API does not support built-in response caching. Throttling limits traffic but does not improve latency for allowed requests.",
    optionExplanations: [
      "Correct. API Gateway REST API caching stores the Lambda response at the edge for the specified TTL. With a 300-second TTL matching the 5-minute data freshness requirement, repeated identical GET requests are served directly from the cache, eliminating Lambda invocations and downstream database calls entirely.",
      "Incorrect. Provisioned Concurrency keeps Lambda execution environments pre-initialized to eliminate cold starts, which reduces latency for the first invocation but still executes the full Lambda and downstream database logic on every request — it does not cache responses.",
      "Incorrect. HTTP APIs (v2) generally have lower overhead than REST APIs, but they do not support built-in response caching; switching to HTTP API would not eliminate the Lambda invocation latency for repeated identical requests.",
      "Incorrect. API Gateway usage plans with throttling limit the rate of requests to the API to protect backend resources; they reduce traffic volume but do not improve the latency of allowed requests or serve cached responses.",
    ],
    tags: ["api-gateway", "caching", "ttl", "performance", "latency"],
  },

  // AWS Step Functions
  {
    id: "qq-065",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Step Functions",
    question:
      "A Step Functions workflow needs to pause and wait for a human to approve a request before proceeding. The approval may take hours or days. Which pattern is correct?",
    options: [
      "Use a Wait for Callback (.waitForTaskToken) integration — send the task token to the approver; they call SendTaskSuccess or SendTaskFailure",
      "Use a Wait state set to 7 days to give humans time to approve",
      "Use a Choice state that polls an approval DynamoDB table every minute",
      "Use a Parallel state with one branch for approve and one for reject",
    ],
    correctIndices: [0],
    explanation:
      "The Callback pattern (.waitForTaskToken) is purpose-built for human approval workflows. Step Functions provides a task token when reaching the wait state; your code sends the token (via email, SNS, Slack, etc.) to the approver. The workflow pauses indefinitely until the approver calls SendTaskSuccess (approve) or SendTaskFailure (reject). A Wait state with a fixed duration does not wait for human input. Polling with Choice states wastes state transitions. Parallel states cannot wait for external input.",
    optionExplanations: [
      "Correct. The Callback pattern with .waitForTaskToken is the purpose-built Step Functions mechanism for human-in-the-loop workflows. The workflow provides a task token; your application forwards it to the approver (via email, SNS, Slack, etc.), and the execution pauses indefinitely until SendTaskSuccess or SendTaskFailure is called with that token.",
      "Incorrect. A Wait state with a fixed duration (e.g., 7 days) simply pauses the workflow for that exact duration regardless of any human action. It cannot receive an approval decision and will either time out too early or hold up the workflow unnecessarily.",
      "Incorrect. Using a Choice state to poll a DynamoDB table every minute is a polling anti-pattern. It consumes state transitions (each poll is a transition), adds complexity, and is not designed for event-driven human approval—the Callback pattern is the correct solution.",
      "Incorrect. A Parallel state runs two branches concurrently but cannot pause and wait for an external actor to choose one branch. Both branches would execute simultaneously, which is the opposite of waiting for a single human approval decision.",
    ],
    tags: ["step-functions", "callback", "task-token", "human-approval"],
  },
  {
    id: "qq-066",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Step Functions",
    question:
      "A Step Functions Map state is processing 10,000 array elements. The downstream Lambda is being throttled. Which Map state configuration controls the parallelism?",
    options: [
      "Set MaxConcurrency on the Map state to limit parallel iterations",
      "Set MaxItems on the Map state to process a subset of elements",
      "Configure the Lambda reserved concurrency to equal the array length",
      "Use a Parallel state instead of Map to control concurrency",
    ],
    correctIndices: [0],
    explanation:
      "Map state's MaxConcurrency parameter controls how many iterations run simultaneously. Setting MaxConcurrency=10 processes 10 elements at a time, preventing Lambda throttling. MaxConcurrency=0 means unlimited parallelism (all 10,000 at once — which would cause throttling). MaxItems does not exist as a Map state parameter (you'd use InputPath/Parameters to slice the array). Lambda reserved concurrency limits concurrent executions but does not control the Map state's behavior.",
    optionExplanations: [
      "Correct. The Map state's MaxConcurrency parameter directly controls how many iterations execute in parallel. Setting it to a value like 10 or 50 prevents all 10,000 iterations from invoking the downstream Lambda simultaneously, eliminating throttling while still processing the full array.",
      "Incorrect. MaxItems is not a valid Map state parameter. To process a subset of the input array you would use InputPath or Parameters to slice the data before the Map state—but this does not control parallelism; it controls the size of the input.",
      "Incorrect. Setting Lambda's reserved concurrency equal to the array length (10,000) would actually allow all iterations to run in parallel simultaneously, making throttling worse rather than better. Reserved concurrency limits total concurrent executions across all invocations of that function.",
      "Incorrect. A Parallel state executes a fixed set of branches defined at design time in the state machine definition. It cannot dynamically iterate over an array of arbitrary length and does not offer the per-item concurrency control that MaxConcurrency provides on the Map state.",
    ],
    tags: ["step-functions", "map-state", "maxconcurrency", "throttling"],
  },

  // AWS IAM
  {
    id: "qq-067",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS IAM",
    question:
      "A developer creates an IAM role with a permission boundary that allows only s3:GetObject. The role's identity policy grants s3:GetObject and s3:PutObject. What can the role actually do?",
    options: [
      "Only s3:GetObject — the permission boundary limits effective permissions to the intersection",
      "Both s3:GetObject and s3:PutObject — the identity policy is more specific",
      "Nothing — permission boundaries and identity policies cannot both be applied",
      "s3:PutObject only — permission boundaries act as a whitelist that overrides identity policies",
    ],
    correctIndices: [0],
    explanation:
      "Permission boundaries set the maximum permissions a principal can have. Effective permissions are the intersection of the permission boundary and the identity policy. The boundary allows s3:GetObject only, the identity policy allows GetObject + PutObject — the intersection is s3:GetObject only. The boundary does not grant permissions on its own; it only limits. Even if the identity policy allows s3:PutObject, the boundary prevents it.",
    optionExplanations: [
      "Correct. Permission boundaries establish the maximum permissions a principal can have. The effective permissions are the intersection of the permission boundary and the identity policy. Since the boundary only allows s3:GetObject, even though the identity policy also grants s3:PutObject, the role can only perform s3:GetObject.",
      "Incorrect. Identity policies are not 'more specific' than permission boundaries—they serve different purposes. A permission boundary acts as a ceiling; no matter how broadly the identity policy allows actions, the boundary restricts what can actually be exercised. The identity policy cannot exceed the boundary.",
      "Incorrect. Permission boundaries and identity policies are designed to be used together. The boundary limits the maximum scope; the identity policy grants permissions within that scope. There is no rule preventing both from being attached simultaneously.",
      "Incorrect. The permission boundary does not act as a whitelist that overrides identity policies in the sense of granting permissions on its own. A boundary only restricts—it cannot grant permissions that the identity policy doesn't also allow. s3:PutObject is not in the boundary, so it cannot be used regardless of what the identity policy says.",
    ],
    tags: [
      "iam",
      "permission-boundary",
      "effective-permissions",
      "policy-evaluation",
    ],
  },
  {
    id: "qq-068",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS IAM",
    question:
      "A developer's IAM policy uses the condition key aws:RequestedRegion to restrict actions to us-east-1. An attacker tries to make the same API call to eu-west-1. What happens?",
    options: [
      "The request is denied — the condition prevents actions outside us-east-1",
      "The request succeeds — conditions only apply to console access, not API calls",
      "The request is denied only if the attacker uses the console",
      "The condition has no effect on global AWS services like IAM and S3",
    ],
    correctIndices: [0],
    explanation:
      "aws:RequestedRegion is a global condition key that restricts which AWS region the API call can target. When set to us-east-1 in a Deny or as a condition on an Allow, any API call to eu-west-1 will be denied. This works for all API calls and all access methods (console, CLI, SDK). Note: global services like IAM always route to us-east-1 regardless of the region specified, so regional restrictions may not apply to IAM actions.",
    optionExplanations: [
      "Correct. aws:RequestedRegion is a global IAM condition key that evaluates the region targeted by the API call. When used in a Deny statement (or as a condition on an Allow), any API call targeting a region other than us-east-1—including API calls made via CLI, SDK, or console—will be denied.",
      "Incorrect. IAM condition keys apply to all access methods equally: console, CLI, and SDK. There is no distinction between console access and API access for condition evaluation—all requests go through the same IAM policy evaluation engine.",
      "Incorrect. aws:RequestedRegion applies to all access methods, not just the console. Whether the attacker uses the console, CLI, or SDK, the condition is evaluated the same way and the request to eu-west-1 would be denied.",
      "Incorrect. aws:RequestedRegion does have limited applicability to some global services (like IAM, which always routes through us-east-1), but the statement that it has 'no effect' on global services is misleading. For S3, which is the topic here, regional restrictions do apply because S3 API calls go to region-specific endpoints.",
    ],
    tags: ["iam", "conditions", "aws-requestedregion", "region-restriction"],
  },
  {
    id: "qq-069",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS IAM",
    question:
      "Which IAM policy type would you use to prevent ALL users in an AWS account from deleting a specific S3 bucket, even if their individual policies allow it?",
    options: [
      "A resource-based bucket policy with an explicit Deny on s3:DeleteBucket for all principals",
      "An SCP that denies s3:DeleteBucket for the specific bucket ARN",
      "An IAM permission boundary applied to all users",
      "An IAM groups policy with a Deny on s3:DeleteBucket",
    ],
    correctIndices: [0],
    explanation:
      "An explicit Deny in a resource-based policy (S3 bucket policy) that targets all principals (Principal: '*') with a Deny on s3:DeleteBucket wins over any identity-based policy that allows it. Explicit Deny always takes precedence. SCPs work at the account level but cannot target individual resource ARNs. Permission boundaries must be attached individually to each principal. IAM group policies apply to group members only — not all users, and can be overridden by explicit Deny.",
    optionExplanations: [
      "Correct. An explicit Deny in a resource-based policy (S3 bucket policy) with Principal: '*' applies to all principals, including those with identity policies that would otherwise allow the action. Explicit Deny always takes precedence over any Allow in IAM policy evaluation, making this the most reliable way to protect a specific resource.",
      "Incorrect. While SCPs can deny actions at the account level, SCPs operate on accounts (or OUs) within AWS Organizations and cannot be scoped to a specific resource ARN like a single S3 bucket. They apply to all resources of a given action across the account.",
      "Incorrect. Permission boundaries must be individually attached to each IAM user or role. They cannot be applied globally to 'all users' in an account in a single operation, and managing them at scale this way would be error-prone. A bucket policy is a simpler, resource-scoped solution.",
      "Incorrect. IAM group policies only apply to members of that group—they do not cover all principals in an account. A user not in the group, or a role, would not be subject to the group Deny. A resource-based bucket policy with Principal: '*' covers all principals universally.",
    ],
    tags: ["iam", "explicit-deny", "bucket-policy", "s3", "resource-policy"],
  },

  // Amazon Cognito
  {
    id: "qq-070",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon Cognito",
    question:
      "A Cognito User Pool Lambda trigger needs to add a custom claim to the ID token before it is issued to the user. Which trigger should the developer use?",
    options: [
      "Pre Token Generation trigger",
      "Post Authentication trigger",
      "Pre Authentication trigger",
      "Post Confirmation trigger",
    ],
    correctIndices: [0],
    explanation:
      "The Pre Token Generation Lambda trigger fires before Cognito issues ID and access tokens and allows you to add, suppress, or modify token claims. For example, you can add a custom 'role' claim based on database lookup. Post Authentication fires after sign-in but cannot modify tokens. Pre Authentication validates conditions before authentication proceeds. Post Confirmation fires after a user confirms registration — tokens haven't been issued yet.",
    optionExplanations: [
      "Correct. The Pre Token Generation Lambda trigger fires just before Cognito issues ID and access tokens. It receives the token claims and can add, modify, or suppress claims in the response—allowing you to inject custom attributes (like a 'role' or 'tenantId') from an external database into every token.",
      "Incorrect. Post Authentication fires after a user successfully authenticates but before tokens are issued. It is used for tasks like logging sign-in events or recording analytics—it cannot modify the token claims because tokens have not been generated yet at that point.",
      "Incorrect. Pre Authentication fires before Cognito validates the user's credentials. It can be used to block sign-in attempts based on custom logic (e.g., check if the user's account is suspended), but it runs before authentication is complete and cannot modify tokens.",
      "Incorrect. Post Confirmation fires after a user confirms their registration (e.g., verifies their email). At this point the user has not yet signed in, so no tokens are being issued. This trigger is typically used to set up user data in a database after registration.",
    ],
    tags: [
      "cognito",
      "pre-token-generation",
      "lambda-trigger",
      "custom-claims",
    ],
  },
  {
    id: "qq-071",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "Amazon Cognito",
    question:
      "An application uses Cognito User Pools with API Gateway. The API Gateway uses a Cognito authorizer. A user's access token has expired. What response does the user receive?",
    options: [
      "401 Unauthorized — the token signature validates but the exp claim is in the past",
      "403 Forbidden — expired tokens are treated as invalid permissions",
      "200 OK — API Gateway does not check token expiry",
      "The request is redirected to Cognito for re-authentication automatically",
    ],
    correctIndices: [0],
    explanation:
      "API Gateway's Cognito authorizer validates the JWT including the expiry (exp) claim. An expired token fails validation and returns 401 Unauthorized. The client must use the refresh token to obtain a new access/ID token pair from Cognito and retry. API Gateway does not automatically redirect for re-authentication. 403 would indicate valid authentication but insufficient permissions. The authorizer always checks token expiry.",
    optionExplanations: [
      "Correct. API Gateway's Cognito authorizer validates JWT signatures and all standard claims including the expiry (exp) claim. When the exp timestamp is in the past, the token fails validation and API Gateway returns HTTP 401 Unauthorized. The client must use its refresh token to obtain a new access token from Cognito before retrying.",
      "Incorrect. HTTP 403 Forbidden indicates that the request is authenticated (the identity is known) but the caller lacks permission to perform the action. An expired token fails authentication entirely, which maps to 401 Unauthorized, not 403 Forbidden.",
      "Incorrect. API Gateway always validates the JWT expiry when using a Cognito authorizer. Serving a 200 OK response with an expired token would be a significant security flaw. The authorizer is specifically designed to enforce token validity including expiration.",
      "Incorrect. API Gateway does not perform automatic redirects for re-authentication. It is a stateless API layer that simply validates the token and returns 401 if validation fails. Re-authentication and token refresh are the responsibility of the client application using the Cognito SDK.",
    ],
    tags: ["cognito", "api-gateway", "token-expiry", "401", "jwt"],
  },

  // AWS KMS
  {
    id: "qq-072",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS KMS",
    question:
      'A developer encrypts data using a KMS CMK with an encryption context of {"application": "payments"}. When decrypting, they omit the encryption context. What happens?',
    options: [
      "Decryption fails with InvalidCiphertextException — the encryption context must match exactly",
      "Decryption succeeds — encryption context is optional and not validated on decrypt",
      "Decryption succeeds but the returned data is corrupted",
      "KMS prompts the user to provide the encryption context interactively",
    ],
    correctIndices: [0],
    explanation:
      "Encryption context is additional authenticated data (AAD) bound to the ciphertext. KMS requires the exact same encryption context on Decrypt that was used on Encrypt. If context is missing or different, KMS returns InvalidCiphertextException. This prevents decryption of ciphertext in a different context than intended (e.g., using a payment ciphertext in a different application). Encryption context is not stored by KMS — the caller must provide it consistently.",
    optionExplanations: [
      "Correct. Encryption context is additional authenticated data (AAD) that is cryptographically bound to the ciphertext. KMS requires the exact same key-value pairs during Decrypt that were provided during Encrypt. Omitting the context (or providing different values) causes KMS to return InvalidCiphertextException — the decryption is rejected.",
      "Incorrect. Encryption context is not optional at decrypt time when it was used at encrypt time. KMS enforces that the same context is provided on both operations. Omitting it at decryption is treated as a mismatch and the call fails.",
      "Incorrect. KMS does not return corrupted data — the decryption either succeeds with valid plaintext or fails with an exception. If the encryption context does not match, KMS refuses the operation entirely and returns InvalidCiphertextException rather than returning garbled output.",
      "Incorrect. KMS is an API-driven service and has no interactive prompting capability. The encryption context must be provided programmatically by the application code making the API call. There is no mechanism for KMS to ask the caller for missing parameters at runtime.",
    ],
    tags: ["kms", "encryption-context", "decrypt", "aad", "security"],
  },
  {
    id: "qq-073",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS KMS",
    question:
      "A developer needs to restrict KMS key usage so that only S3 in us-east-1 can use the key to decrypt objects. Which KMS condition key enforces this?",
    options: [
      "kms:ViaService with value s3.us-east-1.amazonaws.com",
      "aws:SourceArn with the S3 bucket ARN",
      "kms:EncryptionAlgorithm with AES-256 restriction",
      "aws:RequestedRegion with us-east-1",
    ],
    correctIndices: [0],
    explanation:
      "kms:ViaService restricts key usage to calls made by a specific AWS service on your behalf. Setting kms:ViaService to 's3.us-east-1.amazonaws.com' ensures only S3 in us-east-1 can use the key. Direct application calls to KMS would be denied. aws:SourceArn restricts based on the requesting resource ARN (useful for cross-service scenarios but not for service-level restriction). EncryptionAlgorithm restricts the algorithm used. RequestedRegion restricts where the KMS API call goes, not which service invokes it.",
    optionExplanations: [
      "Correct. The kms:ViaService condition key in the KMS key policy restricts usage to calls that originate from a specific AWS service acting on your behalf. Setting it to 's3.us-east-1.amazonaws.com' ensures only S3 in us-east-1 can invoke KMS using this key; direct application calls to KMS or calls from other services are denied.",
      "Incorrect. aws:SourceArn identifies the ARN of the specific resource (e.g., a specific S3 bucket or Lambda function) that is making the request in certain cross-service scenarios. It does not restrict key usage to a particular service type, and it is not the appropriate condition key for service-level restrictions.",
      "Incorrect. kms:EncryptionAlgorithm restricts which cryptographic algorithm (e.g., SYMMETRIC_DEFAULT, RSAES_OAEP_SHA_256) may be used with the key. It does not control which service or caller is allowed to use the key, so it does not enforce the S3-only usage requirement.",
      "Incorrect. aws:RequestedRegion restricts which AWS region the KMS API call targets — it ensures the KMS endpoint itself is called in a particular region. It does not restrict which service (S3, application, etc.) is making the call, so an application in us-east-1 could still call KMS directly.",
    ],
    tags: ["kms", "viaservice", "key-policy", "s3", "condition"],
  },

  // AWS Secrets Manager
  {
    id: "qq-074",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS Secrets Manager",
    question:
      "During Secrets Manager automatic rotation, which version staging label is applied to the new secret value while it is being tested?",
    options: ["AWSPENDING", "AWSCURRENT", "AWSPREVIOUS", "AWSROTATING"],
    correctIndices: [0],
    explanation:
      "During rotation, the rotation Lambda creates new credentials tagged with AWSPENDING. After setting and testing the new credentials, the finishSecret phase moves AWSPENDING to AWSCURRENT and the old AWSCURRENT to AWSPREVIOUS. Applications should always request AWSCURRENT (the default) to get active credentials. AWSROTATING does not exist as a staging label.",
    optionExplanations: [
      "Correct. During rotation, the rotation Lambda function creates the new secret value and tags it with the AWSPENDING staging label. The rotation process then tests the new credentials while AWSCURRENT still holds the active credentials. Only after successful testing does the finishSecret phase promote AWSPENDING to AWSCURRENT and demote the old AWSCURRENT to AWSPREVIOUS.",
      "Incorrect. AWSCURRENT is the staging label for the currently active, production-ready secret value. Applications retrieve AWSCURRENT (the default) to get the credentials currently in use. During rotation, AWSCURRENT continues to hold the old credentials until the new ones are verified and promoted.",
      "Incorrect. AWSPREVIOUS is the label applied to the previously active secret after a successful rotation completes — it is the 'old' version retained for a grace period in case the application still holds a cached reference to it. It is not used for the secret being created during rotation.",
      "Incorrect. AWSROTATING is not a valid staging label in AWS Secrets Manager. The three valid staging labels used during the rotation lifecycle are AWSPENDING (new, being tested), AWSCURRENT (active), and AWSPREVIOUS (recently replaced).",
    ],
    tags: ["secrets-manager", "rotation", "staging-labels", "awspending"],
  },
  {
    id: "qq-075",
    domain: "security",
    difficulty: "hard",
    type: "multi",
    service: "AWS Secrets Manager",
    question:
      "A development team wants to share a database secret across multiple AWS accounts. Which TWO configurations are required? (Select TWO)",
    options: [
      "Add a resource-based policy on the secret allowing the target account's principal",
      "In the target account, create an IAM policy allowing secretsmanager:GetSecretValue on the secret ARN",
      "Enable secret replication to the target account's region",
      "Share the KMS key used to encrypt the secret with the target account",
      "Create a VPC endpoint in the target account for Secrets Manager",
    ],
    correctIndices: [0, 1],
    explanation:
      "Cross-account secret access requires both: 1) A resource-based policy on the secret granting the target account principal access. 2) An IAM policy in the target account allowing secretsmanager:GetSecretValue on the secret ARN. Additionally, if the secret uses a CMK (not AWS managed key), the CMK's key policy must also grant the target account access. Secret replication copies secrets to other regions within the same account — it does not enable cross-account access. VPC endpoints are for private network access, not cross-account.",
    optionExplanations: [
      "Correct. For cross-account secret access, the secret owner must attach a resource-based policy to the secret explicitly granting the target account's principal (e.g., an IAM role ARN or the account ID) permission to call secretsmanager:GetSecretValue. Without this policy, the target account principal cannot access the secret regardless of their own IAM permissions.",
      "Correct. Even with a resource-based policy granting cross-account access, the principal in the target account must also have an IAM identity policy that explicitly allows secretsmanager:GetSecretValue on the secret's ARN. Both sides of the permission must be satisfied for cross-account access — the resource policy controls who is allowed in, and the identity policy controls what the principal is allowed to do.",
      "Incorrect. Secret replication copies a secret to other AWS regions within the same AWS account for disaster recovery and low-latency access. It does not enable cross-account access and cannot share a secret across account boundaries. The replicated secret exists in the same account, not in a different account.",
      "Incorrect. Sharing the KMS key used to encrypt the secret is an additional requirement that is sometimes necessary (when the secret uses a customer-managed CMK rather than the AWS-managed key), but it is not one of the two primary required configurations listed. The two core requirements are the resource-based policy on the secret and the IAM policy in the target account. The KMS key sharing would be a third requirement if a CMK is used.",
      "Incorrect. A VPC endpoint for Secrets Manager provides private network connectivity, allowing resources inside a VPC to call Secrets Manager without traversing the public internet. It is a network-level configuration for private access and has no bearing on cross-account authorization. Cross-account access is controlled by IAM and resource-based policies, not VPC endpoints.",
    ],
    tags: ["secrets-manager", "cross-account", "resource-policy", "iam"],
  },

  // Amazon ECS
  {
    id: "qq-076",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon ECS",
    question:
      "An ECS Fargate task needs to write logs to CloudWatch Logs. Which component is responsible for pulling images from ECR and creating the CloudWatch log group?",
    options: [
      "The ECS task execution role — it handles ECR authentication and CloudWatch Logs creation",
      "The ECS task role — it provides all permissions the container needs",
      "The ECS cluster service role — it manages the underlying Fargate infrastructure",
      "The container's application code — it must authenticate separately",
    ],
    correctIndices: [0],
    explanation:
      "The ECS task execution role is used by the ECS agent (not the application) for infrastructure operations: pulling images from ECR, creating CloudWatch log groups, and fetching secrets from Secrets Manager/SSM at task startup. The task role is what the application code inside the container uses to call AWS services (DynamoDB, S3, etc.). These are two separate IAM roles with different purposes. The cluster service role manages EC2 instances in EC2 launch type, not Fargate.",
    optionExplanations: [
      "Correct. The ECS task execution role is the IAM role assumed by the ECS agent (not the application) to perform infrastructure-level operations on behalf of the task: pulling container images from ECR (ecr:GetAuthorizationToken, ecr:BatchGetImage), creating CloudWatch log groups (logs:CreateLogGroup, logs:PutLogEvents), and fetching secrets from Secrets Manager or SSM at startup. It must be granted the AmazonECSTaskExecutionRolePolicy managed policy at minimum.",
      "Incorrect. The ECS task role is the IAM role assumed by the application code running inside the container to call AWS services such as DynamoDB, S3, SQS, or KMS. It is separate from the execution role and is only used after the container has started. The task role does not handle ECR authentication or CloudWatch Logs creation.",
      "Incorrect. The ECS cluster service role (ecsServiceRole or AmazonECSServiceRolePolicy) is used for the ECS service to manage resources like Elastic Load Balancers and register/deregister container instances. It is used with the EC2 launch type for managing the underlying instances, not for pulling images or logging in the Fargate launch type.",
      "Incorrect. In the Fargate launch type, the application code inside the container does not authenticate separately to ECR to pull the image — the container image is pulled before the application code runs. The ECS agent handles this using the task execution role, transparently and before the container process starts.",
    ],
    tags: ["ecs", "fargate", "task-execution-role", "ecr", "cloudwatch"],
  },
  {
    id: "qq-077",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "Amazon ECS",
    question:
      "An ECS service needs to scale the number of tasks based on the number of messages in an SQS queue. When the queue depth exceeds 1,000 messages, add tasks; when below 100, remove tasks. How should auto scaling be configured?",
    options: [
      "ECS Service Auto Scaling with a custom CloudWatch metric (ApproximateNumberOfMessagesVisible) and step scaling policy",
      "ECS Cluster Auto Scaling triggered directly by SQS queue depth",
      "Lambda function that calls UpdateService to change desired count based on SQS metrics",
      "Application Load Balancer target tracking scaling based on request count",
    ],
    correctIndices: [0],
    explanation:
      "ECS Service Auto Scaling supports custom CloudWatch metrics. SQS publishes ApproximateNumberOfMessagesVisible as a CloudWatch metric. A step scaling policy can scale ECS tasks out when the metric exceeds 1,000 and scale in when below 100. ECS Cluster Auto Scaling scales EC2 instances (not tasks) and cannot directly trigger on SQS metrics. A Lambda workaround is possible but less efficient. ALB target tracking is for request-based metrics, not SQS queue depth.",
    optionExplanations: [
      "Correct. ECS Service Auto Scaling integrates with Application Auto Scaling and supports custom CloudWatch metrics as scaling triggers. SQS automatically publishes ApproximateNumberOfMessagesVisible to CloudWatch every minute. A step scaling policy can be configured to add tasks when the metric exceeds 1,000 and remove tasks when it drops below 100, providing precise threshold-based scaling driven by queue depth.",
      "Incorrect. ECS Cluster Auto Scaling manages the capacity of the underlying EC2 instances in the cluster (for the EC2 launch type) using Capacity Providers. It does not directly scale the number of ECS tasks, and it cannot be triggered directly by SQS queue depth metrics. Task scaling and cluster (instance) scaling are separate concerns.",
      "Incorrect. Writing a Lambda function to call ECS UpdateService is a custom workaround that duplicates functionality built into ECS Service Auto Scaling. It adds operational overhead (Lambda management, error handling, invocation scheduling) and is less reliable than the native auto scaling integration, which handles cooldown periods, scale-in protection, and CloudWatch alarm evaluation automatically.",
      "Incorrect. Application Load Balancer target tracking scaling adjusts task count based on request metrics like RequestCountPerTarget. It is designed for HTTP/HTTPS traffic from a load balancer, not for SQS queue-driven workloads. There is no native connection between ALB metrics and SQS queue depth.",
    ],
    tags: ["ecs", "auto-scaling", "sqs", "cloudwatch", "custom-metric"],
  },

  // Amazon RDS
  {
    id: "qq-078",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon RDS",
    question:
      "A developer needs to connect to an RDS MySQL database from a Lambda function without storing database passwords. Which authentication method eliminates stored credentials?",
    options: [
      "IAM Database Authentication — generate an auth token using the IAM role and use it as the password",
      "Secrets Manager with auto-rotation — store the password in Secrets Manager",
      "AWS Certificate Manager — use TLS client certificates for authentication",
      "SSM Parameter Store SecureString — store and retrieve the password at runtime",
    ],
    correctIndices: [0],
    explanation:
      "IAM Database Authentication allows Lambda to authenticate to RDS using the Lambda execution role's IAM credentials. The SDK generates a temporary authentication token (valid 15 minutes) using the role's credentials, and the token is used as the database password. No stored passwords. Secrets Manager still stores a password (it rotates it, but there is a stored secret). ACM certificates are for TLS transport, not database login. SSM SecureString still stores a password — just encrypted.",
    optionExplanations: [
      "Correct. IAM Database Authentication allows the Lambda execution role to generate a temporary database authentication token (using rds:connect IAM permission and the GenerateDBAuthToken SDK call). The token is valid for 15 minutes, is used as the database password, and requires no stored credentials anywhere. This is supported for MySQL and PostgreSQL on RDS and Aurora.",
      "Incorrect. Secrets Manager is an excellent secret management solution, but it still stores a database password (rotated automatically) as a secret value. Retrieving the secret at runtime avoids hardcoded credentials, but there is a stored credential — just encrypted and managed by Secrets Manager. It does not fully eliminate stored passwords the way IAM auth does.",
      "Incorrect. AWS Certificate Manager (ACM) is used for TLS/SSL certificates to encrypt data in transit between the application and RDS using SSL/TLS. TLS client certificates are for transport-layer mutual authentication (mTLS), not for database login authentication. ACM does not provide database credentials.",
      "Incorrect. SSM Parameter Store SecureString encrypts the stored value using KMS and allows retrieval at runtime, which avoids embedding credentials in application code. However, a plaintext password still exists — it is stored encrypted in SSM. This does not eliminate stored database passwords; it only encrypts where they are stored.",
    ],
    tags: ["rds", "iam-auth", "lambda", "no-password", "security"],
  },
  {
    id: "qq-079",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon RDS",
    question:
      "An Aurora MySQL cluster has a primary instance in us-east-1. A developer needs a read replica that serves users in Europe with under 1 second replication lag. What should they use?",
    options: [
      "Aurora Global Database with a secondary region in eu-west-1",
      "A standard Aurora Read Replica created in eu-west-1",
      "An RDS Multi-AZ standby replica configured in eu-west-1",
      "Aurora cross-region snapshot restore with automated replication",
    ],
    correctIndices: [0],
    explanation:
      "Aurora Global Database uses storage-level replication to propagate writes from the primary region to up to 5 secondary regions with typically under 1 second latency. Standard Aurora Read Replicas are limited to the same region as the primary — cross-region is not a standard Read Replica feature for Aurora. RDS Multi-AZ standbys are in the same region and not readable. Snapshot restore creates a new standalone database, not a live replica.",
    optionExplanations: [
      "Correct. Aurora Global Database uses dedicated storage-level replication infrastructure to asynchronously propagate writes from the primary region to up to 5 secondary regions. Replication lag is typically under 1 second (often under 100ms) because replication happens at the storage layer rather than through the database engine. Secondary regions serve low-latency reads for geographically distributed users.",
      "Incorrect. Standard Aurora Read Replicas are confined to the same region as the primary cluster. Aurora does not support cross-region standard read replicas in the way that standard RDS does. Cross-region replication for Aurora is achieved through Aurora Global Database, which uses a fundamentally different replication mechanism.",
      "Incorrect. RDS Multi-AZ standby instances are synchronously replicated within the same region as the primary for high availability and automatic failover. They are not readable (they exist only as a failover target) and they cannot be placed in a different region. Multi-AZ is a regional high availability feature, not a global distribution feature.",
      "Incorrect. A snapshot restore creates a new, independent Aurora cluster from a point-in-time snapshot. It is not a live replica and does not maintain continuous replication from the source cluster. After restore, the new cluster immediately diverges from the source and must be manually kept in sync, making it unsuitable for low-latency read serving.",
    ],
    tags: ["rds", "aurora", "global-database", "cross-region", "replication"],
  },

  // AWS CloudWatch
  {
    id: "qq-080",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudWatch",
    question:
      "A developer needs to monitor the memory utilization of EC2 instances. After checking CloudWatch, no memory metrics are available. What is the reason and fix?",
    options: [
      "EC2 does not publish memory metrics by default; install the CloudWatch Agent on each instance to collect and publish memory metrics",
      "Memory metrics require CloudWatch detailed monitoring to be enabled on the EC2 instance",
      "Memory metrics are only available for instances using the Nitro hypervisor",
      "Memory metrics must be viewed in AWS Cost Explorer, not CloudWatch",
    ],
    correctIndices: [0],
    explanation:
      "EC2 publishes hypervisor-level metrics to CloudWatch by default (CPU, network, disk I/O) but cannot access OS-level metrics like memory utilization from outside the VM. The CloudWatch Agent runs inside the EC2 instance and can collect memory utilization, swap, disk space, and application-level metrics, publishing them to a custom namespace (CWAgent). Detailed monitoring increases sampling frequency for existing metrics from 5-min to 1-min but does not add memory metrics.",
    optionExplanations: [
      "Correct. EC2 cannot publish OS-level metrics (memory, swap, disk usage) because they are inside the VM; the CloudWatch Agent must be installed and configured on each instance to collect and publish those metrics to a custom CWAgent namespace.",
      "Incorrect. Detailed monitoring increases the sampling frequency of existing hypervisor-level metrics (CPU, network, disk I/O) from 5-minute to 1-minute intervals but does not add any new metric types such as memory utilization.",
      "Incorrect. All EC2 instance types (Nitro and Xen hypervisor) have the same limitation regarding memory metrics; the hypervisor layer cannot access in-guest memory statistics regardless of the virtualization platform.",
      "Incorrect. AWS Cost Explorer tracks spending and usage cost data, not operational performance metrics like memory utilization; memory metrics belong in CloudWatch, not Cost Explorer.",
    ],
    tags: ["cloudwatch", "ec2", "memory-metrics", "cloudwatch-agent"],
  },
  {
    id: "qq-081",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "Amazon CloudWatch",
    question:
      "A CloudWatch alarm for Lambda error rate is triggering false positives because a brief spike triggers the alarm even though errors self-resolve within 1 minute. How should the developer configure the alarm to reduce noise?",
    options: [
      "Set evaluation period to 5 periods of 1 minute with 'datapoints to alarm' = 3 of 5, so errors must persist across 3 consecutive periods",
      "Increase the Lambda timeout to prevent transient errors from being reported",
      "Use a CloudWatch Composite Alarm combining two error metrics with AND logic",
      "Set the alarm threshold higher so brief spikes don't trigger it",
    ],
    correctIndices: [0],
    explanation:
      "The 'M of N' (datapoints to alarm) configuration prevents transient spikes from triggering alarms. By requiring 3 of 5 consecutive 1-minute periods to breach the threshold, a brief 1-minute spike will not trigger the alarm — it needs to persist for at least 3 minutes. Increasing timeout reduces actual errors but doesn't fix alarm sensitivity. Composite alarms combine independent alarm states. Raising the threshold may miss real errors.",
    optionExplanations: [
      "Correct. The 'M of N' datapoints-to-alarm setting (e.g., 3 of 5 consecutive 1-minute periods) requires the threshold to be breached persistently before alerting, so a single brief spike that resolves within one period does not trigger the alarm.",
      "Incorrect. Increasing the Lambda timeout reduces the likelihood of timeout errors but does not change how the CloudWatch Alarm evaluates the error rate metric; transient spikes unrelated to timeouts would still trigger a sensitive alarm.",
      "Incorrect. A Composite Alarm ANDs or ORs the states of other independent alarms; it does not add temporal smoothing to a single metric and would not prevent a false positive caused by a one-period spike.",
      "Incorrect. Raising the threshold means more errors must occur before the alarm fires, but a high spike could still breach a higher threshold in a single period; this trades false positives for missed real incidents rather than filtering transient noise.",
    ],
    tags: [
      "cloudwatch",
      "alarms",
      "datapoints-to-alarm",
      "false-positives",
      "noise",
    ],
  },

  // AWS X-Ray
  {
    id: "qq-082",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "AWS X-Ray",
    question:
      "An application's X-Ray service map shows a node in red. What does this indicate?",
    options: [
      "The service is experiencing faults (5xx errors) — server-side errors",
      "The service has high latency but no errors",
      "The service is receiving throttled requests (429)",
      "The X-Ray daemon cannot connect to the service",
    ],
    correctIndices: [0],
    explanation:
      "X-Ray service map color coding: Green = healthy (no errors above threshold), Yellow = errors (4xx client errors or throttling), Orange = throttle (429 Too Many Requests), Red = fault (5xx server errors). A red node indicates the service is generating server-side errors. Click the node to see detailed trace data showing which requests failed and why.",
    optionExplanations: [
      "Correct. X-Ray color codes service map nodes as: green (healthy), yellow (4xx client errors), orange (429 throttle), and red (5xx fault/server errors); a red node indicates the service is returning server-side faults.",
      "Incorrect. High latency without errors is represented in X-Ray by response-time percentile data on the node's tooltip; the node color does not turn red for latency alone — it turns red only when 5xx faults are present.",
      "Incorrect. Throttled requests (HTTP 429 Too Many Requests) are represented in X-Ray with an orange color code, not red; orange specifically indicates throttling, which is a separate category from faults.",
      "Incorrect. If the X-Ray daemon cannot connect to the service, that would appear as a gap or missing segment in the trace, not as a red node; a red node means the service itself is generating 5xx responses.",
    ],
    tags: ["x-ray", "service-map", "faults", "errors", "color-coding"],
  },

  // ElastiCache
  {
    id: "qq-083",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon ElastiCache",
    question:
      "An application uses ElastiCache Redis as a cache with lazy loading. After a code deployment that changes how cache keys are structured, users experience slow responses. What is happening?",
    options: [
      "Cache miss storm — all existing keys use the old structure and return misses, causing all requests to hit the database simultaneously",
      "Redis cluster is restarting due to the deployment and is temporarily unavailable",
      "The new key structure exceeds Redis max key length causing silent failures",
      "Write-through caching is preventing new keys from being stored",
    ],
    correctIndices: [0],
    explanation:
      "Changing cache key structure invalidates all existing cached data — new code looks for keys that don't exist, causing 100% cache misses (cache miss storm or thundering herd). Every request falls through to the database simultaneously, overloading it. Mitigation strategies: gradually deploy (canary), pre-warm the cache before cutover, use key versioning (append v2_ prefix to keys), or use a cache-aside pattern with graceful degradation. Redis max key length is 512 MB — not a practical concern.",
    optionExplanations: [
      "Correct. When cache key naming conventions change across a deployment, all previously cached items are stored under old keys; the new code looks up keys that do not exist in cache, causing a 100% cache miss rate and overloading the database simultaneously.",
      "Incorrect. An ElastiCache Redis cluster does not restart due to an application code deployment; the cache is an independent, always-on managed service that is unaffected by deployments to the application layer.",
      "Incorrect. Redis supports keys up to 512 MB in length; practical cache keys are typically a few dozen bytes, making exceeding the key length limit an extremely unlikely cause of cache misses in this scenario.",
      "Incorrect. Write-through caching proactively writes data to the cache on every database write; it would not prevent new keys from being stored but rather ensures the cache is always populated — the opposite of causing cache misses.",
    ],
    tags: [
      "elasticache",
      "cache-miss",
      "thundering-herd",
      "lazy-loading",
      "deployment",
    ],
  },
  {
    id: "qq-084",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon ElastiCache",
    question:
      "An application needs a distributed rate limiter that allows 100 requests per user per second. Which Redis data structure and command combination is MOST appropriate?",
    options: [
      "INCR on a key per user with EXPIRE set to 1 second — increment atomically and reject if count > 100",
      "ZADD with current timestamp as score and count members in sliding window",
      "LPUSH to a list and LLEN to check length with EXPIRE for TTL",
      "HSET with a hash per user and HGET to read current count",
    ],
    correctIndices: [0],
    explanation:
      "The INCR + EXPIRE pattern implements a fixed-window rate limiter atomically: INCR returns the new count. If count == 1, set EXPIRE of 1 second. If count > 100, reject. This is atomic and fast. ZADD with timestamp scores implements a sliding window (more accurate but slower). LPUSH + LLEN is less efficient. HSET requires two separate operations and is not atomic for increment+check. The INCR pattern is the standard Redis rate limiting approach.",
    optionExplanations: [
      "Correct. The INCR command atomically increments an integer key and returns the new value; pairing it with EXPIRE on first increment implements a fixed-window rate limiter that is simple, fast, and safe under concurrent access.",
      "Incorrect. ZADD with timestamp scores implements a sliding-window rate limiter that is more accurate (no boundary effects between windows) but requires ZADD, ZREMRANGEBYSCORE, and ZCARD in a Lua script, making it more complex and slower than INCR+EXPIRE.",
      "Incorrect. LPUSH + LLEN stores each request as a list element and counts them; it works but is less memory-efficient than a simple counter, requires a separate EXPIRE call, and does not benefit from INCR's atomic increment-and-return semantics.",
      "Incorrect. HSET stores a field in a hash; checking and incrementing the count requires separate HINCRBY and HGET operations that are not atomic unless wrapped in a Lua script, making this approach more complex than INCR.",
    ],
    tags: ["elasticache", "redis", "rate-limiting", "incr", "expire"],
  },

  // VPC
  {
    id: "qq-085",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon VPC",
    question:
      "A Lambda function in a private VPC subnet needs to access S3 without routing traffic through a NAT Gateway. What is the MOST cost-effective solution?",
    options: [
      "Create an S3 VPC Gateway Endpoint — traffic routes through the endpoint for free",
      "Create an S3 VPC Interface Endpoint (PrivateLink) — private connectivity to S3",
      "Add a NAT Gateway in the private subnet to enable S3 access",
      "Use S3 Transfer Acceleration for direct private connectivity",
    ],
    correctIndices: [0],
    explanation:
      "S3 Gateway Endpoints are free — add the endpoint to the route table and Lambda traffic to S3 routes through the AWS backbone without internet or NAT. Gateway endpoints are available for S3 and DynamoDB only. Interface endpoints (PrivateLink) work for most other services but cost hourly + per-GB data charges. NAT Gateway costs $0.045/hour plus data transfer. S3 Transfer Acceleration is for faster uploads over the internet, not private VPC access.",
    optionExplanations: [
      "Correct. S3 Gateway Endpoints are free to create and use; adding one to the VPC route table redirects S3-bound traffic through the AWS backbone without requiring a NAT Gateway, eliminating both NAT Gateway hourly charges and per-GB data transfer costs.",
      "Incorrect. S3 Interface Endpoints (PrivateLink) provide private DNS resolution for S3 within the VPC but incur an hourly charge (~$0.01/hr per AZ) plus per-GB data processing fees, making them more expensive than the free Gateway Endpoint for S3.",
      "Incorrect. A NAT Gateway placed in a private subnet would not provide internet access (NAT Gateways must be in public subnets with an internet gateway); additionally, using NAT for S3 access incurs per-GB data transfer charges that can be avoided with a Gateway Endpoint.",
      "Incorrect. S3 Transfer Acceleration uses CloudFront edge locations to accelerate uploads and downloads over the public internet; it does not provide private VPC connectivity and incurs additional per-GB charges on top of standard S3 rates.",
    ],
    tags: ["vpc", "s3", "gateway-endpoint", "nat", "cost"],
  },
  {
    id: "qq-086",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon VPC",
    question:
      "A security team requires all traffic to an EC2 instance to be logged, including traffic that is explicitly denied by security groups. Which VPC feature captures both ACCEPT and REJECT traffic?",
    options: [
      "VPC Flow Logs — captures all IP traffic with ACCEPT/REJECT action fields",
      "CloudTrail — logs all API calls including network traffic events",
      "Security Group flow logs — capture traffic allowed by security groups",
      "AWS Config — records security group rule changes and network ACL events",
    ],
    correctIndices: [0],
    explanation:
      "VPC Flow Logs capture metadata about IP traffic flowing through network interfaces, subnets, or the entire VPC. Each log record includes srcaddr, dstaddr, ports, protocol, and an action field with ACCEPT or REJECT. REJECT entries show traffic that was denied by security groups or NACLs. CloudTrail logs API calls, not network traffic. Security groups don't have independent flow logs. AWS Config tracks configuration changes, not traffic.",
    optionExplanations: [
      "Correct. VPC Flow Logs capture metadata for all IP traffic at the ENI, subnet, or VPC level, including an 'action' field that shows ACCEPT for traffic allowed by security groups/NACLs and REJECT for traffic denied — both types are recorded.",
      "Incorrect. AWS CloudTrail logs API calls made to AWS service control planes (e.g., ec2:RunInstances, s3:PutObject); it does not capture network-level IP traffic flowing through EC2 instance network interfaces.",
      "Incorrect. Security groups are stateful packet filters but do not have their own logging mechanism; traffic accepted by a security group is not independently logged — VPC Flow Logs are the correct tool for capturing network traffic.",
      "Incorrect. AWS Config records configuration changes to AWS resources (e.g., security group rule additions/removals) and evaluates compliance against rules; it does not capture live network traffic or log individual connection attempts.",
    ],
    tags: ["vpc", "flow-logs", "accept-reject", "security", "audit"],
  },

  // Amazon CloudFront
  {
    id: "qq-087",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "A CloudFront distribution serves private S3 content. The S3 bucket should only be accessible through CloudFront, not directly. What is the CURRENT recommended approach?",
    options: [
      "Use Origin Access Control (OAC) — update the S3 bucket policy to allow only the CloudFront service principal",
      "Use Origin Access Identity (OAI) — create an OAI and attach it to the distribution",
      "Enable S3 bucket versioning and restrict access by version ID",
      "Block all public access on S3 and use signed cookies for all requests",
    ],
    correctIndices: [0],
    explanation:
      "Origin Access Control (OAC) is the current recommended method (replacing OAI) for restricting S3 bucket access to CloudFront. OAC supports all S3 regions, AWS Signature Version 4, and SSE-KMS encrypted buckets. The S3 bucket policy grants access to the CloudFront service principal with a condition on the specific distribution. OAI (Origin Access Identity) still works but is the legacy approach and has limitations with SSE-KMS. Signed cookies control user access to content but don't restrict origin access.",
    optionExplanations: [
      "Correct. Origin Access Control (OAC) is the current AWS-recommended replacement for OAI; it uses AWS Signature Version 4 signing and supports SSE-KMS encrypted S3 buckets and all AWS regions, with the S3 bucket policy granting access only to the CloudFront service principal.",
      "Incorrect. Origin Access Identity (OAI) is the legacy approach that CloudFront used before OAC was introduced; it has limitations including no support for SSE-KMS encrypted S3 buckets and some newer S3 regions, so AWS now recommends OAC instead.",
      "Incorrect. S3 bucket versioning stores multiple versions of an object for recovery purposes but does not restrict who can access current objects; it does not prevent direct S3 access bypassing CloudFront.",
      "Incorrect. Signed cookies control which authenticated users can access CloudFront-distributed content; they restrict user access at the CDN edge but do not prevent direct requests to the S3 origin URL from bypassing CloudFront entirely.",
    ],
    tags: ["cloudfront", "oac", "s3", "origin-access-control", "security"],
  },
  {
    id: "qq-088",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "A developer needs to customize CloudFront responses by adding security headers (e.g., Strict-Transport-Security) to every response. The headers should be added at the edge with minimal latency. Which feature is MOST appropriate?",
    options: [
      "CloudFront Functions at the viewer response event — lightweight JavaScript runs in under 1ms",
      "Lambda@Edge at the origin response event — add headers from the Lambda runtime",
      "CloudFront response headers policy — configure security headers in distribution settings",
      "API Gateway integration — add headers in the Lambda function response",
    ],
    correctIndices: [2],
    explanation:
      "CloudFront Response Headers Policies are the simplest and most efficient solution for adding security headers. You configure standard headers (HSTS, X-Content-Type-Options, X-Frame-Options, CSP, etc.) directly in CloudFront distribution settings — no code required. CloudFront adds them to every response. CloudFront Functions can also do this but require JavaScript code. Lambda@Edge adds more latency and cost. API Gateway is the origin, not the CDN edge.",
    optionExplanations: [
      "Incorrect. CloudFront Functions run lightweight JavaScript at the viewer request/response events and can add headers, but for simply adding standard security headers, a Response Headers Policy requires no code at all and is the simpler solution.",
      "Incorrect. Lambda@Edge can add headers at the origin response event but runs in a full Lambda runtime, adding milliseconds of latency and cost; it is better suited for complex logic that CloudFront Functions or Response Headers Policies cannot handle.",
      "Correct. CloudFront Response Headers Policies let you configure standard security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Content Security Policy, etc.) directly in distribution settings with no code; CloudFront automatically appends them to every response.",
      "Incorrect. API Gateway is the upstream origin for an API-backed CloudFront distribution; adding headers in the Lambda response requires code changes in each Lambda function rather than a single centralized CloudFront configuration.",
    ],
    tags: ["cloudfront", "response-headers-policy", "security-headers", "hsts"],
  },

  // AWS CodePipeline / CodeBuild / CodeDeploy
  {
    id: "qq-089",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeBuild",
    question:
      "A CodeBuild project needs to build a Docker image and push it to ECR. The build is failing with 'Cannot connect to the Docker daemon.' What must be enabled on the CodeBuild project?",
    options: [
      "Privileged mode in the build environment — required to run Docker daemon inside CodeBuild",
      "VPC mode — Docker requires a VPC endpoint to pull base images",
      "Enhanced networking — Docker builds require higher network throughput",
      "Docker Hub credentials in the CodeBuild environment variables",
    ],
    correctIndices: [0],
    explanation:
      "CodeBuild runs builds inside containers. To run Docker commands inside a build (Docker-in-Docker), the build container needs elevated privileges. Enabling 'Privileged mode' in the build environment configuration grants the necessary privileges to run the Docker daemon. Without it, Docker commands fail. VPC mode is for accessing private resources. Enhanced networking is an EC2 feature. Docker Hub credentials are needed for pulling private images, not for running the daemon.",
    optionExplanations: [
      "Correct. Running Docker commands inside a CodeBuild container requires 'Docker-in-Docker' capability; enabling Privileged mode grants the build container elevated Linux capabilities needed to run the Docker daemon.",
      "Incorrect. VPC mode connects the CodeBuild build environment to resources in a private VPC (like RDS or ElastiCache); it is not required to run Docker commands and would not fix a 'Cannot connect to Docker daemon' error.",
      "Incorrect. Enhanced networking is an EC2 feature that uses the Elastic Network Adapter (ENA) for higher throughput; it is unrelated to Docker daemon access within a CodeBuild container.",
      "Incorrect. Docker Hub credentials are required to pull private images from Docker Hub; they are not needed to run the Docker daemon itself and would not resolve the 'Cannot connect to Docker daemon' error.",
    ],
    tags: ["codebuild", "docker", "privileged-mode", "ecr"],
  },
  {
    id: "qq-090",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodeDeploy",
    question:
      "A CodeDeploy deployment to EC2 instances is failing at the ApplicationStop lifecycle hook. The instances were previously deployed to. What is a common cause and fix?",
    options: [
      "The ApplicationStop script from the PREVIOUS deployment is running and failing; fix by editing the script in the previous revision or skipping ApplicationStop in the new deployment",
      "The CodeDeploy agent is not installed on the EC2 instances",
      "The new deployment package is missing the appspec.yml file",
      "The IAM role for CodeDeploy does not have EC2 permissions",
    ],
    correctIndices: [0],
    explanation:
      "ApplicationStop runs the script from the PREVIOUSLY DEPLOYED revision, not the new one. If the previous deployment's stop script has a bug, every subsequent deployment will fail at ApplicationStop. Fixes: correct the script and redeploy (use 'ignore application stop failures' option), or manually fix the script on the instance. The CodeDeploy agent failing would cause a different error. Missing appspec.yml fails at a different phase. IAM role issues cause a different error type.",
    optionExplanations: [
      "Correct. The ApplicationStop lifecycle hook runs the stop script from the previously deployed revision; if that previous script contains a bug, every new deployment will fail at this hook before any new files are deployed.",
      "Incorrect. If the CodeDeploy agent were not installed, the deployment would fail at a much earlier stage (the agent receives and orchestrates the deployment); ApplicationStop would never even be reached.",
      "Incorrect. A missing appspec.yml in the new deployment package would cause a download or validation failure before any lifecycle hooks are executed; it would not produce an ApplicationStop hook failure.",
      "Incorrect. IAM permission issues for the CodeDeploy service role would prevent CodeDeploy from creating the deployment or targeting instances; they would not manifest specifically as an ApplicationStop hook script failure.",
    ],
    tags: [
      "codedeploy",
      "applicationstop",
      "lifecycle-hook",
      "previous-revision",
    ],
  },
  {
    id: "qq-091",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodePipeline",
    question:
      "A Lambda function in a CodePipeline Invoke action has been running for 20 minutes and the pipeline is still waiting. What is most likely wrong?",
    options: [
      "The Lambda function has not called PutJobSuccessResult or PutJobFailureResult to signal completion back to CodePipeline",
      "CodePipeline has a bug and is not checking the Lambda function status",
      "The Lambda function exceeded its 15-minute timeout and CodePipeline is retrying",
      "The Lambda function needs to publish a CloudWatch event when it completes",
    ],
    correctIndices: [0],
    explanation:
      "When CodePipeline invokes a Lambda function as an action, the pipeline waits for the Lambda to call either PutJobSuccessResult or PutJobFailureResult with the job ID it received. If neither is called, the pipeline hangs until the action timeout (default 1 hour). This is a common mistake — developers forget to signal completion. If Lambda times out at 15 minutes, CodePipeline would eventually time out the action, but the symptom described (still waiting at 20 minutes) points to missing signal.",
    optionExplanations: [
      "Correct. When CodePipeline invokes a Lambda function as an action, the pipeline waits indefinitely for the Lambda to call PutJobSuccessResult or PutJobFailureResult with the job ID; forgetting to call either method causes the pipeline to hang until the action timeout.",
      "Incorrect. CodePipeline actively polls for the Lambda completion signal via the CodePipeline service; there is no bug causing it to ignore Lambda status — the pipeline is working correctly by waiting for the signal it expects.",
      "Incorrect. If the Lambda function itself timed out at its 15-minute execution timeout, Lambda would have already called back to CodePipeline with an error; the pipeline would show a failure, not a 20-minute wait with no response.",
      "Incorrect. CloudWatch Events are not used to signal CodePipeline from a Lambda action; the only mechanism for a Lambda action to communicate success or failure to CodePipeline is via PutJobSuccessResult or PutJobFailureResult.",
    ],
    tags: ["codepipeline", "lambda-action", "putjobsuccessresult", "invoke"],
  },

  // AWS SAM
  {
    id: "qq-092",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS SAM",
    question:
      "A SAM template defines a Lambda function with an API Gateway HTTP endpoint. The developer runs 'sam deploy' but the API endpoint URL is not shown in the terminal. How can the developer get the URL output?",
    options: [
      "Add an Outputs section to the SAM template with the API Gateway endpoint URL using !Sub",
      "Run 'sam describe' after deployment to see all resource URLs",
      "Check the Lambda function configuration in the console for the API URL",
      "The URL is only available in the SAM local environment, not after deployment",
    ],
    correctIndices: [0],
    explanation:
      "Add an Outputs section to the SAM/CloudFormation template. For a SAM-created REST API, the URL is accessible via !Sub 'https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/${ServerlessRestApiProdStage}/' or using !Sub with the API Gateway resource. CloudFormation outputs are displayed after stack creation. 'sam describe' is not a valid command. The Lambda console shows function config, not API Gateway URL. SAM local serves locally on localhost — deployment URLs are separate.",
    optionExplanations: [
      "Correct. Adding an Outputs section to the SAM/CloudFormation template with a Value using !Sub to reference the API Gateway endpoint prints the URL to the terminal after stack deployment and makes it queryable via the CloudFormation console and CLI.",
      "Incorrect. 'sam describe' is not a valid SAM CLI command; to view stack outputs after deployment, use aws cloudformation describe-stacks --stack-name <name> or check the CloudFormation console Outputs tab.",
      "Incorrect. The Lambda function configuration in the console shows function settings (memory, timeout, environment variables) but not the API Gateway endpoint URL; the URL is a property of the API Gateway stage, not the Lambda function itself.",
      "Incorrect. sam local start-api creates a locally running API server on localhost for development; deployment to AWS creates a real API Gateway endpoint that is only retrievable via CloudFormation stack outputs or the API Gateway console.",
    ],
    tags: ["sam", "cloudformation", "outputs", "api-gateway", "url"],
  },
  {
    id: "qq-093",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS SAM",
    question:
      "A developer uses 'sam sync --watch' during development. What advantage does this provide over 'sam deploy' for Lambda code changes?",
    options: [
      "sam sync bypasses CloudFormation for code-only changes, updating the Lambda function directly in seconds instead of minutes",
      "sam sync uses CloudFormation change sets for safer deployments than sam deploy",
      "sam sync automatically runs tests before syncing code changes",
      "sam sync provides a local preview of changes before they go to AWS",
    ],
    correctIndices: [0],
    explanation:
      "sam sync --watch watches for file changes and syncs Lambda code directly using the Lambda UpdateFunctionCode API, bypassing the full CloudFormation stack update cycle. This reduces deployment time from 2-3 minutes (CloudFormation) to a few seconds. For infrastructure changes (new resources, IAM policies), sam sync still uses CloudFormation. This dramatically speeds up the inner development loop. It does not run tests or provide local preview — that's sam local.",
    optionExplanations: [
      "Correct. sam sync --watch detects Lambda code changes and updates the function directly via the Lambda UpdateFunctionCode API, bypassing the CloudFormation stack update cycle and reducing deployment time from minutes to seconds.",
      "Incorrect. sam sync does not use CloudFormation change sets for code-only changes; it bypasses CloudFormation entirely for Lambda code updates to achieve faster iteration (change sets are used by sam deploy for infrastructure changes).",
      "Incorrect. sam sync --watch does not run tests before syncing; running tests is the developer's responsibility or can be integrated into a CI script — sam sync is purely a code synchronization tool.",
      "Incorrect. sam sync --watch does not provide a local preview; local previews and testing are handled by sam local, which runs Lambda functions in a Docker container without deploying to AWS.",
    ],
    tags: ["sam", "sync", "developer-experience", "hot-reload", "lambda"],
  },

  // AWS CloudFormation
  {
    id: "qq-094",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation template needs to create an RDS instance with a password stored in Secrets Manager without hardcoding the password in the template. Which approach should the developer use?",
    options: [
      "Dynamic reference: {{resolve:secretsmanager:MyDBSecret:SecretString:password}}",
      "Pass the password as a CloudFormation Parameter with NoEcho: true",
      "Use a CloudFormation Custom Resource to generate and store the password",
      "Reference an SSM SecureString parameter using {{resolve:ssm-secure:/db/password}}",
    ],
    correctIndices: [0],
    explanation:
      "CloudFormation dynamic references resolve values from Secrets Manager at deployment time without exposing the value in the template. The syntax {{resolve:secretsmanager:SecretName:SecretString:jsonKey}} fetches the password field from the secret. The value is never visible in CloudFormation events or the console. NoEcho parameters hide values in the console but require passing the password at deployment time. Custom Resources add complexity. SSM SecureString dynamic references also work but Secrets Manager is preferred for database passwords (auto-rotation support).",
    optionExplanations: [
      "Correct. The {{resolve:secretsmanager:SecretName:SecretString:jsonKey}} dynamic reference causes CloudFormation to fetch the secret value from Secrets Manager at deployment time and inject it directly into the resource property without ever exposing it in the template or CloudFormation events.",
      "Incorrect. A CloudFormation Parameter with NoEcho: true prevents the value from appearing in the console but still requires the developer to manually pass the password at each deployment; it does not integrate with Secrets Manager and does not avoid storing the password externally.",
      "Incorrect. A Custom Resource backed by Lambda can generate a random password and store it in Secrets Manager, but this pattern is more complex than a dynamic reference; the built-in dynamic reference syntax is simpler and the recommended approach.",
      "Incorrect. SSM SecureString dynamic references ({{resolve:ssm-secure:/db/password}}) work similarly but SSM Parameter Store is better suited for configuration values; Secrets Manager is preferred for database passwords because it natively supports automatic rotation.",
    ],
    tags: [
      "cloudformation",
      "dynamic-reference",
      "secrets-manager",
      "rds",
      "security",
    ],
  },
  {
    id: "qq-095",
    domain: "deployment",
    difficulty: "hard",
    type: "multi",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation stack is being deleted but fails because an S3 bucket still contains objects. Which TWO approaches prevent this deletion failure? (Select TWO)",
    options: [
      "Set DeletionPolicy: Retain on the S3 bucket resource so CloudFormation skips deletion",
      "Use a Custom Resource (Lambda) to empty the bucket before CloudFormation deletes it",
      "Enable S3 versioning so CloudFormation can delete objects and their versions",
      "Set the bucket ACL to private before stack deletion",
      "Create a CloudFormation macro to handle non-empty bucket deletion",
    ],
    correctIndices: [0, 1],
    explanation:
      "CloudFormation cannot delete a non-empty S3 bucket — it will fail. Solutions: 1) DeletionPolicy: Retain tells CloudFormation to remove the bucket from the stack without deleting it — the bucket and its contents remain. 2) A Custom Resource backed by Lambda can empty the bucket on stack deletion before CloudFormation attempts to delete it. S3 versioning adds version markers but does not help CloudFormation delete versioned objects. ACL changes don't allow CloudFormation to delete objects. CloudFormation macros transform templates at deploy time, not during deletion.",
    optionExplanations: [
      "Correct. DeletionPolicy: Retain on the S3 bucket resource instructs CloudFormation to remove the bucket from the stack's management without actually deleting it; the bucket and all its objects remain in the account after stack deletion.",
      "Correct. A Lambda-backed Custom Resource can empty the bucket during the Delete event (triggered when CloudFormation deletes the stack) by listing and deleting all objects and versions before CloudFormation proceeds to delete the now-empty bucket.",
      "Incorrect. Enabling S3 versioning adds version markers to objects but does not help CloudFormation delete a non-empty versioned bucket; CloudFormation still cannot delete a versioned bucket that has objects or delete markers.",
      "Incorrect. Changing the S3 bucket ACL to private restricts public access but does not affect CloudFormation's ability to delete the bucket; a non-empty bucket cannot be deleted by CloudFormation regardless of its access control configuration.",
      "Incorrect. CloudFormation macros transform templates at synthesis/deploy time, before the stack exists; they cannot execute logic during stack deletion to empty a bucket — that runtime behavior requires a Custom Resource.",
    ],
    tags: [
      "cloudformation",
      "s3",
      "deletion-policy",
      "custom-resource",
      "stack-deletion",
    ],
  },

  // AWS CDK
  {
    id: "qq-096",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CDK",
    question:
      "A developer uses CDK to create an S3 bucket and a Lambda function. They want the Lambda to automatically receive GetObject and PutObject permissions on the bucket without writing IAM policy JSON. Which CDK method achieves this?",
    options: [
      "bucket.grantReadWrite(lambdaFunction) — CDK automatically creates the IAM policy",
      "lambdaFunction.addToRolePolicy(new iam.PolicyStatement({...})) with S3 actions",
      "lambdaFunction.addEnvironment('BUCKET_ARN', bucket.bucketArn) to pass the ARN",
      "new iam.ManagedPolicy(this, 'S3Policy', { statements: [...] })",
    ],
    correctIndices: [0],
    explanation:
      "CDK L2 constructs provide grant*() methods that automatically create least-privilege IAM policy statements. bucket.grantReadWrite(lambdaFunction) adds GetObject and PutObject (and ListBucket) to the Lambda execution role — no manual IAM JSON required. addToRolePolicy works but requires writing the IAM statement manually. addEnvironment passes the ARN as a variable but doesn't grant permissions. Creating a ManagedPolicy manually is verbose and defeats the purpose of CDK abstractions.",
    optionExplanations: [
      "Correct. CDK L2 constructs expose grant*() methods (grantRead, grantWrite, grantReadWrite, etc.) that automatically construct least-privilege IAM policy statements and attach them to the grantee's execution role — no manual IAM JSON required.",
      "Incorrect. lambdaFunction.addToRolePolicy() works but requires manually writing the IAM PolicyStatement with all action strings and resource ARNs; this is verbose and more error-prone than using the built-in grant methods.",
      "Incorrect. addEnvironment() passes the bucket ARN as an environment variable so the Lambda code can read it at runtime, but it grants no IAM permissions; without the grant method, the Lambda will receive AccessDenied when it tries to access S3.",
      "Incorrect. Creating a managed policy manually with new iam.ManagedPolicy() and writing the policy statements by hand achieves the same result but is significantly more verbose and defeats the purpose of CDK's high-level L2 abstractions.",
    ],
    tags: ["cdk", "grant-methods", "iam", "s3", "lambda"],
  },
  {
    id: "qq-097",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CDK",
    question:
      "A CDK construct defines an L2 S3 bucket but needs to set a lifecycle rule property that is not exposed by the L2 construct. How should the developer set this property?",
    options: [
      "Use the escape hatch: (bucket.node.defaultChild as s3.CfnBucket).addPropertyOverride(...)",
      "Rewrite the construct as an L1 CfnBucket to access all CloudFormation properties",
      "Submit a GitHub issue to the CDK team and wait for the L2 to be updated",
      "Use a CDK Aspect to modify the synthesized CloudFormation template after synthesis",
    ],
    correctIndices: [0],
    explanation:
      "CDK's escape hatch pattern allows accessing the underlying L1 (CfnBucket) from an L2 construct via node.defaultChild. Cast it to CfnBucket and use addPropertyOverride or set properties directly. This is the recommended CDK pattern for using L2 conveniences while still accessing any CloudFormation property. Rewriting as L1 loses all the L2 convenience. CDK Aspects can modify the synth output but are more complex. The GitHub issue approach is not a solution for current development.",
    optionExplanations: [
      "Correct. CDK's escape hatch pattern accesses the underlying L1 CfnBucket construct through node.defaultChild and casts it to CfnBucket, allowing addPropertyOverride() or direct property assignment to set any CloudFormation property not exposed by the L2 API.",
      "Incorrect. Rewriting the entire construct as an L1 CfnBucket loses all the convenience of the L2 Bucket construct (automatic bucket policy handling, grant methods, event notifications, etc.); the escape hatch is less disruptive and is the CDK-recommended pattern.",
      "Incorrect. Waiting for a GitHub issue to be resolved could take weeks or months and blocks current development; the escape hatch pattern exists specifically to address gaps in L2 constructs without waiting for upstream changes.",
      "Incorrect. CDK Aspects traverse the construct tree after synthesis to inspect or modify constructs; while they can override properties, they are more complex and typically used for cross-cutting concerns (tagging, compliance checks), not for simple individual property overrides.",
    ],
    tags: ["cdk", "escape-hatch", "cfn-bucket", "l1", "l2"],
  },

  // Elastic Beanstalk
  {
    id: "qq-098",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Elastic Beanstalk",
    question:
      "A developer needs to run a custom shell script on all EC2 instances in an Elastic Beanstalk environment during deployment, after the application files are installed. Which mechanism enables this?",
    options: [
      "Add a .ebextensions config file with a 'commands' or 'container_commands' section specifying the script",
      "Add the script to the application's Procfile so Beanstalk runs it at startup",
      "Use a CodeDeploy lifecycle hook triggered by Beanstalk deployment",
      "Configure the script in the Beanstalk environment's 'Custom Platform' settings",
    ],
    correctIndices: [0],
    explanation:
      ".ebextensions configuration files (YAML/JSON with .config extension) in your application bundle allow customizing the Elastic Beanstalk environment. 'commands' run before the application is installed; 'container_commands' run after the application files are extracted (with access to application source). They run as root. The Procfile defines application processes (like a web server). CodeDeploy is a separate service. Custom Platforms are for building custom AMIs, not running scripts during app deployment.",
    optionExplanations: [
      "Correct. .ebextensions config files (YAML with .config extension) placed in the .ebextensions/ directory of the application bundle allow running shell commands during deployment; 'container_commands' run after application files are extracted with access to the new source code.",
      "Incorrect. The Procfile defines the commands Beanstalk uses to start application processes (like a web server or worker); it runs after deployment is complete during the application start phase and cannot be used to run scripts during the deployment process itself.",
      "Incorrect. AWS CodeDeploy is a separate deployment service; Elastic Beanstalk has its own deployment mechanism and does not trigger CodeDeploy lifecycle hooks — these are two independent services that are not used together this way.",
      "Incorrect. Custom Platforms in Elastic Beanstalk allow building completely custom AMI-based platforms using Packer; they are for teams that need an operating system or runtime not supported by standard Beanstalk platforms, not for running scripts during app deployments.",
    ],
    tags: [
      "elastic-beanstalk",
      "ebextensions",
      "container-commands",
      "deployment",
    ],
  },

  // AWS Amplify
  {
    id: "qq-099",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Amplify",
    question:
      "A Next.js application is deployed on Amplify Hosting. The team wants a preview environment for every pull request automatically. Which Amplify feature provides this?",
    options: [
      "Amplify Hosting branch deployments — each PR branch gets its own preview URL automatically",
      "Amplify Studio previews — visual previews of UI component changes",
      "AWS CodePipeline pull request triggers with a separate Beanstalk environment per PR",
      "S3 static hosting with a CloudFront distribution per pull request",
    ],
    correctIndices: [0],
    explanation:
      "Amplify Hosting automatically builds and deploys each connected Git branch to its own URL. When pull request previews are enabled, every PR gets a unique URL (pr-123.d111.amplifyapp.com) built and deployed automatically. The preview is torn down when the PR is closed. This is built into Amplify Hosting with no additional configuration needed beyond connecting the repository. Amplify Studio previews are for the visual editor. The other options require manual setup.",
    optionExplanations: [
      "Correct. Amplify Hosting's pull request previews automatically build and deploy each PR to a unique preview URL when enabled; the preview environment is created on PR open and torn down on PR close with no additional configuration.",
      "Incorrect. Amplify Studio is a visual development environment for building UI components and data models; its previews are visual component previews in the studio interface, not deployed preview environments for pull requests.",
      "Incorrect. Using CodePipeline with separate Beanstalk environments per PR requires significant custom configuration (trigger detection, environment provisioning, cleanup logic); Amplify Hosting provides this capability natively with zero additional setup.",
      "Incorrect. Creating individual S3 static hosting sites with CloudFront distributions per PR requires custom automation for provisioning and teardown on every PR lifecycle event; Amplify Hosting handles this entire workflow automatically and natively.",
    ],
    tags: ["amplify", "hosting", "pull-request-preview", "branch-deployment"],
  },

  // AWS AppSync
  {
    id: "qq-100",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS AppSync",
    question:
      "An AppSync API uses Cognito User Pools for authorization. A resolver needs to restrict results so users can only see their own records. Which approach is correct?",
    options: [
      "In the resolver, use $ctx.identity.sub (the user's Cognito UUID) as a filter condition in the DynamoDB query",
      "Configure AppSync field-level authorization with @aws_auth to hide other users' records",
      "Create separate AppSync APIs for each user",
      "Enable AppSync caching and scope cache keys to the user's access token",
    ],
    correctIndices: [0],
    explanation:
      "When Cognito User Pools is the auth mode, $ctx.identity contains the authenticated user's claims including sub (Cognito UUID), username, and groups. In the resolver, use $ctx.identity.sub as a filter or key condition to restrict DynamoDB queries to the current user's data. @aws_auth controls which auth modes can access a type/field — it doesn't filter data by user. Separate APIs per user is unscalable. Caching doesn't handle authorization.",
    optionExplanations: [
      "Correct. When Cognito User Pools is the auth mode, $ctx.identity.sub contains the authenticated user's immutable Cognito UUID; using it as a filter or key condition in the DynamoDB resolver ensures each user only retrieves their own records.",
      "Incorrect. @aws_auth (or @aws_cognito_user_pools) is a GraphQL directive that controls which authentication modes can access a field or type; it does not filter query results by the current user's identity — it only controls who can call the field at all.",
      "Incorrect. Creating a separate AppSync API for each user is completely impractical and does not scale; a single API with per-user authorization logic in resolvers is the correct and scalable pattern.",
      "Incorrect. AppSync caching stores resolver responses at the field level; while you can scope cache keys to include the user's identity, caching does not enforce authorization — a cache miss would still need the resolver to filter by user, and a misconfigured cache key could return another user's data.",
    ],
    tags: ["appsync", "cognito", "resolver", "authorization", "identity"],
  },
  {
    id: "qq-101",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS AppSync",
    question:
      "An AppSync subscription is configured for a Mutation. A client subscribes but receives no events when the mutation fires. The mutation is succeeding. What is the MOST likely cause?",
    options: [
      "The subscription field arguments do not match the mutation's return values — AppSync filters out non-matching events",
      "AppSync subscriptions require HTTP polling to receive events — WebSocket is not supported",
      "The client's Cognito token expired and WebSocket was silently disconnected",
      "The Lambda resolver for the subscription is not returning data",
    ],
    correctIndices: [0],
    explanation:
      "AppSync subscription filtering: if a subscription specifies arguments (e.g., onCreateTodo(owner: \"alice\")), AppSync only delivers events where the mutation result matches those arguments. If the mutation returns data that doesn't match the subscription filter, the event is silently dropped. This is a common source of 'no events received' bugs. AppSync uses WebSocket (not polling). Token expiry would disconnect the WebSocket (client would receive a disconnect event). Subscriptions don't have their own Lambda resolver — they piggyback on mutations.",
    optionExplanations: [
      "Correct. AppSync evaluates subscription arguments against the mutation's return data; if the subscription filter arguments do not match the mutation's result fields (e.g., different owner value), the event is silently dropped and the client receives nothing.",
      "Incorrect. AppSync subscriptions use WebSocket connections (over MQTT or HTTP/2) for real-time event delivery; HTTP polling is not used and is not supported as an alternative for AppSync subscriptions.",
      "Incorrect. While a Cognito token expiry would cause the WebSocket to disconnect, the client would typically receive a disconnect notification or error; the question describes receiving no events while the mutation succeeds, which points to filtering, not disconnection.",
      "Incorrect. AppSync subscriptions do not have their own dedicated resolver that runs when a mutation fires; the subscription piggybacks on the mutation resolver's output and AppSync filters that output based on subscription arguments.",
    ],
    tags: ["appsync", "subscriptions", "filtering", "mutation", "websocket"],
  },

  // Systems Manager
  {
    id: "qq-102",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Systems Manager",
    question:
      "A developer needs to run a shell script across 500 EC2 instances simultaneously to rotate a configuration file. The instances do not have SSH ports open. Which SSM feature enables this?",
    options: [
      "SSM Run Command — executes commands on EC2 instances via the SSM Agent without SSH",
      "SSM Session Manager — opens a shell session to each instance for the script",
      "SSM Patch Manager — deploys configuration files as patches",
      "SSM State Manager — continuously applies the script as desired state",
    ],
    correctIndices: [0],
    explanation:
      "SSM Run Command executes shell scripts or PowerShell on multiple EC2 instances simultaneously without opening SSH ports. Target instances by tag, instance ID, or resource group. Results (stdout, stderr, exit codes) are logged to S3 or CloudWatch Logs. The SSM Agent on each instance handles the request securely. Session Manager opens interactive sessions (one at a time per session). Patch Manager handles OS patches. State Manager enforces ongoing desired state (periodic, not one-time).",
    optionExplanations: [
      "Correct. SSM Run Command executes shell scripts or AWS Systems Manager documents on multiple EC2 instances simultaneously via the SSM Agent; no SSH ports or bastion hosts are needed, and results are returned through the SSM service.",
      "Incorrect. SSM Session Manager opens an interactive terminal session to a single EC2 instance at a time; it is suitable for ad-hoc troubleshooting but not for running the same script across 500 instances simultaneously.",
      "Incorrect. SSM Patch Manager scans and installs OS patches (security updates, bug fixes) on EC2 instances using patch baselines; it is not designed for deploying arbitrary configuration files or running custom application scripts.",
      "Incorrect. SSM State Manager continuously enforces a desired configuration state by periodically applying an association (document); it is designed for ongoing compliance enforcement, not one-time immediate script execution across a fleet.",
    ],
    tags: ["systems-manager", "run-command", "ec2", "no-ssh", "automation"],
  },
  {
    id: "qq-103",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS Systems Manager",
    question:
      "An application reads feature flag configuration from AWS AppConfig. After updating a feature flag, the Lambda function is still reading the old value for several minutes. What is the most likely reason?",
    options: [
      "The Lambda extension for AppConfig caches configuration locally — the cache TTL has not expired yet",
      "AppConfig deployments take up to 1 hour to propagate to all Lambda instances",
      "Lambda environment variables are cached and override AppConfig values",
      "The AppConfig deployment strategy is set to AllAtOnce but Lambda only receives updates on cold start",
    ],
    correctIndices: [0],
    explanation:
      "The AppConfig Lambda extension caches configuration locally at localhost:2772 to avoid API calls on every invocation. The cache has a configurable TTL (default varies — typically 45 seconds to several minutes). Until the TTL expires, Lambda reads from cache rather than fetching the new config. Solution: reduce the cache TTL, or force a cache refresh by calling the extension's clear-cache endpoint. AppConfig deployments propagate quickly — the cache is the delay. Lambda env vars are separate from AppConfig.",
    optionExplanations: [
      "Correct. The AppConfig Lambda extension caches the fetched configuration locally on localhost:2772 to avoid making an HTTP call to AppConfig on every Lambda invocation; until the cache TTL expires, Lambda reads the stale cached value even after a new configuration is deployed.",
      "Incorrect. AppConfig deployments propagate to the service endpoint within seconds; the multi-minute delay observed is caused by the Lambda extension's local cache TTL, not by slow AppConfig deployment propagation.",
      "Incorrect. Lambda environment variables are static values set at function configuration time and are unrelated to AppConfig; AppConfig configuration is fetched at runtime via an HTTP call to the extension, not read from environment variables.",
      "Incorrect. AppConfig's AllAtOnce deployment strategy instantly makes the new configuration available at the AppConfig service endpoint; however, even with immediate propagation, the Lambda extension cache means function instances continue reading the cached old value until the TTL expires.",
    ],
    tags: [
      "systems-manager",
      "appconfig",
      "lambda-extension",
      "cache",
      "feature-flags",
    ],
  },

  // Additional cross-service / tricky exam questions
  {
    id: "qq-104",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS IAM",
    question:
      "A developer's IAM identity policy has Effect: Allow for s3:* on arn:aws:s3:::my-bucket/*. A bucket policy has Effect: Deny for s3:DeleteObject for Principal: * with a condition aws:PrincipalArn != arn:aws:iam::123456789:role/AdminRole. The developer tries to delete an object. What happens?",
    options: [
      "Access denied — the bucket policy Deny applies to the developer since they are not the AdminRole",
      "Access granted — the identity policy Allow overrides the bucket policy Deny",
      "Access granted — the condition makes the Deny only apply to the AdminRole",
      "Access denied — you cannot mix identity and resource policies for S3",
    ],
    correctIndices: [0],
    explanation:
      "Explicit Deny always wins. The bucket policy has Deny on s3:DeleteObject for Principal: * with a condition: if the caller is NOT AdminRole, the Deny applies. The developer is not the AdminRole, so the condition evaluates to true — the Deny applies. Explicit Deny overrides any Allow in any identity or resource policy. The developer's s3:* Allow in their identity policy is irrelevant once an explicit Deny is in effect. Remember: Deny > Allow, no exceptions.",
    optionExplanations: [
      "Correct. The bucket policy has Deny for s3:DeleteObject on Principal: * with the condition aws:PrincipalArn != AdminRole ARN. Because the developer is not the AdminRole, the condition is true (they ARE not the AdminRole), so the Deny statement applies. Explicit Deny always wins over any Allow—the developer's identity policy Allow for s3:* is irrelevant.",
      "Incorrect. Explicit Deny in a resource-based policy always overrides an Allow in an identity policy. This is a foundational rule of IAM policy evaluation: Allow + explicit Deny = Deny. The identity policy's Allow cannot 'win' against a Deny.",
      "Incorrect. This is a common misreading of the condition. The condition aws:PrincipalArn != AdminRole means 'apply the Deny to everyone EXCEPT AdminRole.' So the Deny applies to the developer (who is not AdminRole), not to the AdminRole. AdminRole is the one entity that is exempt from the Deny.",
      "Incorrect. You absolutely can and should mix identity policies and resource-based policies for S3. Resource-based policies (bucket policies) are one of the primary access control mechanisms for S3. There is no restriction on combining them with identity policies.",
    ],
    tags: [
      "iam",
      "explicit-deny",
      "bucket-policy",
      "condition",
      "policy-evaluation",
    ],
  },
  {
    id: "qq-105",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    service: "Amazon DynamoDB",
    question:
      "A table uses partition key = userId, sort key = timestamp. A developer runs a Scan with a FilterExpression on userId. Why is this bad, and which TWO alternatives are better? (Select TWO)",
    options: [
      "Use Query with a KeyConditionExpression specifying userId as the partition key",
      "Create a GSI with userId as the partition key if userId is not the table's partition key",
      "Use BatchGetItem to retrieve all users and filter client-side",
      "Use Scan with Limit=1 to reduce costs",
      "Use a FilterExpression with userId and a ProjectionExpression to reduce data transfer",
    ],
    correctIndices: [0, 1],
    explanation:
      "If userId IS the partition key, Query with KeyConditionExpression is efficient — it reads only that partition. If userId is NOT the partition key (e.g., a non-key attribute), create a GSI with userId as the partition key to enable efficient querying. Scan reads the entire table regardless of FilterExpression — FilterExpression reduces returned items but not consumed RCU. BatchGetItem requires knowing the full primary keys. Limit=1 reduces returned items but not the cost of the scan. ProjectionExpression reduces data transferred but not RCU consumed.",
    optionExplanations: [
      "Correct. If userId is the table's partition key, Query with a KeyConditionExpression on userId is efficient — it reads only the relevant partition instead of the entire table, consuming far fewer RCU.",
      "Correct. If userId is not the partition key (e.g., it is a non-key attribute), a GSI with userId as the GSI partition key enables efficient Query operations on that attribute without full table scans.",
      "Incorrect. BatchGetItem requires knowing the complete primary key (partition key + sort key) for every item to retrieve — it cannot be used to find all items matching a userId value without prior knowledge of all their sort keys.",
      "Incorrect. Using Scan with Limit=1 returns at most 1 item but still consumes RCU for all items examined up to that limit — it does not meaningfully reduce the cost of scanning and defeats the purpose of finding all records for a userId.",
      "Incorrect. FilterExpression reduces the number of items returned to the caller but does not reduce the number of items read by DynamoDB — the full table scan still consumes RCU for every item examined, and ProjectionExpression reduces data transfer size but not read cost.",
    ],
    tags: [
      "dynamodb",
      "scan",
      "query",
      "gsi",
      "filter-expression",
      "performance",
    ],
  },
  {
    id: "qq-106",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "AWS Lambda",
    question:
      "A Lambda function has reserved concurrency set to 10. The function is triggered by an API Gateway. During a traffic spike, some API requests are returning 429 errors. What is happening and what should the developer do?",
    options: [
      "Lambda is throttling requests because concurrency = 10 is exceeded; API Gateway returns 429. Increase reserved concurrency or remove it to use account-level concurrency",
      "API Gateway is rate limiting requests to 10 per second based on usage plan settings",
      "Lambda is hitting the 15-minute timeout and returning 429 to indicate timeout",
      "The function is out of memory and returning 429 as the error code",
    ],
    correctIndices: [0],
    explanation:
      "Reserved concurrency of 10 means only 10 concurrent executions are allowed. If the 11th request arrives while 10 are in-flight, Lambda throttles it — returns TooManyRequestsException (HTTP 429). API Gateway surfaces this as a 429 to the client. Solutions: increase reserved concurrency, remove it (use account pool), or set up retry logic with exponential backoff. Reserved concurrency both limits the function AND reserves that concurrency from the account pool. API Gateway usage plan rate limits are separate. Lambda returns 429 for throttle specifically — not for timeout or OOM.",
    optionExplanations: [
      "Correct. Reserved concurrency of 10 means a maximum of 10 concurrent Lambda executions are allowed. When the 11th request arrives while all 10 slots are in use, Lambda returns TooManyRequestsException (HTTP 429), which API Gateway surfaces to the client as a 429 Too Many Requests error.",
      "Incorrect. API Gateway usage plan rate limits are a separate throttling mechanism configured on the API stage or API key — they are independent of Lambda reserved concurrency and produce different error details.",
      "Incorrect. Lambda timeout results in a task timed out error after the configured timeout duration — it does not return a 429 HTTP status code. Lambda returns 429 specifically for throttling (concurrency exceeded).",
      "Incorrect. Out-of-memory errors cause the Lambda invocation to fail with an OOM error logged to CloudWatch — the HTTP response to the caller via API Gateway would be a 502 Bad Gateway, not a 429.",
    ],
    tags: [
      "lambda",
      "reserved-concurrency",
      "throttling",
      "429",
      "api-gateway",
    ],
  },
  {
    id: "qq-107",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeDeploy",
    question:
      "A CodeDeploy in-place deployment to EC2 fails at the BeforeInstall hook. What is the state of the instances after this failure?",
    options: [
      "The instances still run the previous application version — BeforeInstall runs before files are copied",
      "The instances have the new version partially installed and are in an indeterminate state",
      "The instances are terminated and replaced with new ones",
      "CodeDeploy automatically rolls back and the instances run the previous version",
    ],
    correctIndices: [0],
    explanation:
      "In-place deployment lifecycle: ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService. BeforeInstall runs BEFORE the new application files are copied. If it fails, the instances still have the old application running. CodeDeploy does not automatically roll back on hook failure — you must configure automatic rollback or trigger it manually. Only Install and later hooks result in files being changed on the instance.",
    optionExplanations: [
      "Correct. BeforeInstall is the first hook that runs after the application bundle is downloaded from S3 but before any application files are copied to the instance; if BeforeInstall fails, the old application version is still intact and running.",
      "Incorrect. The new version files are not copied until the Install lifecycle event, which comes after BeforeInstall; a BeforeInstall failure means no new files have been touched, so the instance is not in a partially installed state.",
      "Incorrect. CodeDeploy in-place deployments do not terminate EC2 instances on failure; the instances remain running with whatever application was previously installed — in this case, the previous version.",
      "Incorrect. CodeDeploy does not automatically roll back on lifecycle hook failure unless automatic rollback is explicitly configured in the deployment group settings; without that configuration, a failed deployment remains in a failed state requiring manual action.",
    ],
    tags: [
      "codedeploy",
      "lifecycle-hooks",
      "beforeinstall",
      "in-place",
      "rollback",
    ],
  },
  {
    id: "qq-108",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SQS",
    question:
      "An SQS message processing Lambda is configured with a batch size of 10. 3 of the 10 messages in a batch fail processing. How should the developer ensure only the 3 failed messages are retried, not all 10?",
    options: [
      "Enable ReportBatchItemFailures and return a batchItemFailures list with only the failed message IDs",
      "Delete the 7 successfully processed messages manually and let SQS retry the batch",
      "Set batch size to 1 so each message is processed independently",
      "Use a FIFO queue which automatically retries only failed messages",
    ],
    correctIndices: [0],
    explanation:
      "Lambda's SQS event source mapping supports partial batch response (ReportBatchItemFailures). When enabled, the Lambda function can return a response with batchItemFailures listing only the message IDs that failed. Lambda deletes the successful messages and returns only the failed ones to the queue for retry. Without this, the entire batch is retried on failure. Setting batch size to 1 works but reduces throughput. FIFO queues retry from the failed message position but don't support partial batch responses the same way.",
    optionExplanations: [
      "Correct. The ReportBatchItemFailures feature for SQS event source mappings allows a Lambda function to return a batchItemFailures list containing only the messageId values of messages that failed. Lambda deletes the successfully processed messages and returns only the failed ones to the queue for retry, preventing unnecessary reprocessing.",
      "Incorrect. Manually deleting the seven successful messages would work, but it requires the function to make seven additional DeleteMessage API calls and does not scale well. The built-in ReportBatchItemFailures mechanism is the purpose-built, more efficient solution.",
      "Incorrect. Setting batch size to 1 guarantees each failure is isolated to a single message, but it dramatically reduces throughput and increases the number of Lambda invocations needed to process the queue; it is a workaround, not the recommended solution.",
      "Incorrect. SQS FIFO queues process messages in order within a message group; when a message fails, processing of that message group is blocked until the failed message is resolved. FIFO queues do not support partial batch response in the same way, and they have lower throughput limits than Standard queues.",
    ],
    tags: [
      "sqs",
      "lambda",
      "partial-batch-response",
      "batchitemfailures",
      "retry",
    ],
  },
  {
    id: "qq-109",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon Cognito",
    question:
      "A legacy application stores user accounts in a MySQL database. The team wants to migrate users to Cognito without requiring password resets. Which Cognito Lambda trigger enables transparent migration?",
    options: [
      "User Migration trigger — fires when a user signs in and doesn't exist in the User Pool; look up in legacy DB and migrate",
      "Pre Authentication trigger — validate user credentials against the legacy DB before Cognito auth",
      "Post Confirmation trigger — migrate user data after they confirm their email",
      "Custom Authentication trigger — implement entirely custom auth flow using legacy DB",
    ],
    correctIndices: [0],
    explanation:
      "The User Migration Lambda trigger fires when a user tries to sign in to the Cognito User Pool but doesn't have an account there. The Lambda can look up the user in the legacy system, validate their password against the legacy DB, and if valid, return the user attributes to Cognito which creates the account transparently. The user doesn't know migration happened. Pre Authentication can't migrate users. Post Confirmation is after registration, not migration. Custom Auth requires a full custom flow — more work.",
    optionExplanations: [
      "Correct. The User Migration Lambda trigger fires when a user attempts to sign in to the Cognito User Pool but does not have an existing account there. The Lambda can look up the user in the legacy system, validate the submitted password against the legacy database, and if valid, return the user's attributes so Cognito creates the account transparently—without the user needing to reset their password or re-register.",
      "Incorrect. Pre Authentication fires before Cognito validates the user's credentials, but it does not have the ability to create a new Cognito user account during the flow. Using it to validate against a legacy DB would still leave the user without a Cognito account, blocking a successful sign-in.",
      "Incorrect. Post Confirmation fires after a user completes registration and confirms their account (e.g., email verification). It is used to run post-registration logic, not to migrate users who are trying to sign in with credentials from a legacy system.",
      "Incorrect. Custom Authentication allows you to build a completely custom multi-step auth challenge flow using Define/Create/Verify Auth Challenge triggers. While technically possible to query a legacy DB during this flow, it replaces the entire standard Cognito auth mechanism and requires significantly more implementation work than the purpose-built User Migration trigger.",
    ],
    tags: ["cognito", "user-migration", "lambda-trigger", "legacy-auth"],
  },
  {
    id: "qq-110",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "multi",
    service: "Amazon CloudWatch",
    question:
      "A developer wants to receive an alert when the Lambda error rate exceeds 5% over the last 5 minutes, using CloudWatch Alarms. Which TWO configurations are needed? (Select TWO)",
    options: [
      "Create a Metric Math expression: errors / invocations * 100 for the error rate percentage",
      "Create an alarm on the Metric Math expression with threshold = 5",
      "Create separate alarms on Lambda Errors and Invocations metrics",
      "Enable Lambda X-Ray tracing to expose error rate as a CloudWatch metric",
      "Use CloudWatch Logs Insights to count errors and create an alarm on the results",
    ],
    correctIndices: [0, 1],
    explanation:
      "Lambda publishes Errors (count of failed invocations) and Invocations (total) as separate CloudWatch metrics — there is no built-in error rate metric. Metric Math lets you compute errors/invocations*100 to derive an error rate percentage. You then create a CloudWatch Alarm on that Metric Math expression with threshold=5. Two separate alarms (one for errors, one for invocations) can't compute a ratio. X-Ray provides trace data but doesn't create a CloudWatch error rate metric. Logs Insights generates query results but doesn't directly feed CloudWatch Alarms.",
    optionExplanations: [
      "Correct. Lambda publishes Errors and Invocations as separate metrics; Metric Math is required to compute the ratio (errors / invocations * 100) as a derived error-rate percentage that can then be monitored.",
      "Correct. Once the Metric Math expression is defined, you create a CloudWatch Alarm on that expression with a threshold of 5 (representing 5%) and the desired evaluation period.",
      "Incorrect. Two separate alarms (one on Errors, one on Invocations) cannot be combined to compute a ratio; you would need Metric Math to derive the percentage before alarming on it.",
      "Incorrect. X-Ray provides distributed tracing and shows error counts in the service map, but it does not publish a CloudWatch error-rate percentage metric that can be used directly in a CloudWatch Alarm.",
      "Incorrect. CloudWatch Logs Insights is an ad-hoc query tool; its results are not automatically published as a CloudWatch metric that feeds into an Alarm without additional custom metric publishing steps.",
    ],
    tags: ["cloudwatch", "metric-math", "lambda", "error-rate", "alarm"],
  },
  {
    id: "qq-111",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "Amazon S3",
    question:
      "Which S3 storage class is designed for data that is accessed infrequently but requires rapid retrieval when needed, offering lower storage cost than S3 Standard?",
    options: [
      "S3 Standard-Infrequent Access (S3 Standard-IA)",
      "S3 Glacier Instant Retrieval",
      "S3 One Zone-IA",
      "S3 Intelligent-Tiering",
    ],
    correctIndices: [0],
    explanation:
      "S3 Standard-IA is for data accessed less frequently but requiring millisecond retrieval when needed. It costs less for storage than S3 Standard but charges a per-GB retrieval fee. Minimum storage duration of 30 days. S3 Glacier Instant Retrieval has millisecond retrieval but is for archival data accessed once per quarter. S3 One Zone-IA is cheaper but stores data in a single AZ (less resilient). S3 Intelligent-Tiering automatically moves objects between tiers based on access patterns.",
    optionExplanations: [
      "Correct. S3 Standard-IA provides the same millisecond retrieval as S3 Standard at a lower per-GB storage price, but charges a per-GB retrieval fee, making it cost-effective for data accessed infrequently (less than once per month).",
      "Incorrect. S3 Glacier Instant Retrieval also provides millisecond retrieval and has lower storage costs than Standard-IA, but it is designed for archival data accessed roughly once per quarter—not for data that is merely infrequent but may be needed at any time.",
      "Incorrect. S3 One Zone-IA stores data in a single Availability Zone, which reduces storage cost further than Standard-IA but at the expense of resilience; data is lost if the AZ is destroyed, making it unsuitable for data that cannot be recreated.",
      "Incorrect. S3 Intelligent-Tiering automatically moves objects between access tiers based on changing access patterns, which is useful when access frequency is unknown or variable, but it adds a per-object monitoring fee and is a different value proposition than Standard-IA.",
    ],
    tags: ["s3", "storage-classes", "standard-ia", "infrequent-access"],
  },
  {
    id: "qq-112",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "A Kinesis Data Stream consumer reads records and checkpoints progress using the partition key. After a consumer crash, the new consumer instance should resume from where it left off. Which consumer library handles checkpointing automatically?",
    options: [
      "Kinesis Client Library (KCL) — maintains checkpoints in DynamoDB automatically",
      "Kinesis Data Firehose — buffers and retries from the stream automatically",
      "AWS SDK GetRecords API — built-in checkpoint management",
      "Lambda event source mapping — Lambda checkpoints automatically with no code",
    ],
    correctIndices: [0],
    explanation:
      "The Kinesis Client Library (KCL) is a Java library (with multilingual support via MultiLangDaemon) that handles shard discovery, load balancing across consumers, and checkpoint management in DynamoDB. When a consumer restarts, KCL reads the checkpoint from DynamoDB and resumes from the last processed sequence number. The SDK GetRecords API requires manually tracking sequence numbers. Lambda's SQS event source mapping handles checkpointing for SQS but for Kinesis, Lambda checkpoints at the shard iterator level automatically. Firehose delivers to destinations, not consumer checkpointing.",
    optionExplanations: [
      "Correct. The Kinesis Client Library (KCL) automatically stores shard-level checkpoints (sequence numbers) in a DynamoDB table it manages, so when a consumer restarts after a crash it reads the latest checkpoint and resumes from the correct position without data loss or reprocessing.",
      "Incorrect. Kinesis Data Firehose is a delivery service that loads data to destinations like S3 or Redshift; it does not act as a consumer checkpoint manager and is not used to resume processing after a consumer crash.",
      "Incorrect. The AWS SDK GetRecords API is a low-level API that returns records starting from a shard iterator; it has no built-in checkpoint management and requires the developer to manually track and store sequence numbers between restarts.",
      "Incorrect. Lambda's Kinesis event source mapping does advance the shard iterator automatically after a successful batch, but this is tied to the Lambda invocation lifecycle; it does not provide durable checkpointing that a separate consumer application can pick up from after a crash.",
    ],
    tags: ["kinesis", "kcl", "checkpointing", "dynamodb", "consumer"],
  },
  {
    id: "qq-113",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon RDS",
    question:
      "An RDS Multi-AZ deployment fails over to the standby instance. Applications experience a connection interruption of about 2 minutes. What should the developer do to minimize the impact on the application?",
    options: [
      "Implement retry logic with exponential backoff in the application and use RDS Proxy to absorb failover",
      "Switch to a single-AZ deployment to avoid failover disruptions",
      "Increase the Multi-AZ synchronization interval to reduce failover time",
      "Use Read Replicas instead of Multi-AZ for high availability",
    ],
    correctIndices: [0],
    explanation:
      "RDS Multi-AZ failover typically takes 60-120 seconds — the DNS record is updated to point to the standby. Applications must reconnect. Two mitigations: 1) Implement retry logic with exponential backoff to reconnect after brief failures. 2) Use RDS Proxy — the proxy absorbs the failover, maintaining the connection endpoint and reducing application-visible downtime to seconds. Single-AZ removes HA. You cannot configure synchronization intervals. Read Replicas provide read scaling — they use asynchronous replication and can't be promoted automatically without manual intervention.",
    optionExplanations: [
      "Correct. RDS Multi-AZ failover involves updating the DNS record to point to the standby instance, which typically takes 60-120 seconds. Two mitigations work together: (1) Retry logic with exponential backoff in the application gracefully handles the brief connection loss by retrying reconnections until the new primary is reachable. (2) RDS Proxy maintains its own connection endpoint and absorbs the failover, re-routing connections to the new primary in seconds rather than waiting for DNS propagation.",
      "Incorrect. Switching to a single-AZ deployment removes the Multi-AZ standby entirely, eliminating automatic failover capability. A primary instance failure in single-AZ requires manual intervention to restore service, which results in far longer downtime than the 60-120 second failover experienced with Multi-AZ. This is the opposite of the desired improvement.",
      "Incorrect. The Multi-AZ synchronization interval is not a configurable parameter in RDS. Multi-AZ uses synchronous replication — every write to the primary is committed simultaneously on the standby before acknowledging success to the application. There is no configurable interval; failover time is determined by infrastructure factors like DNS TTL, not replication frequency.",
      "Incorrect. Read Replicas use asynchronous replication from the primary, which means they can lag behind the primary and may serve stale data. More critically, Read Replicas do not support automatic promotion to primary during a failure — they must be manually promoted, which takes time and requires application reconfiguration. They provide read scaling, not the automated high availability that Multi-AZ provides.",
    ],
    tags: ["rds", "multi-az", "failover", "rds-proxy", "retry"],
  },
  {
    id: "qq-114",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon EventBridge",
    question:
      "An application generates events that need to be processed by a downstream system, but the downstream system is intermittently unavailable. The developer wants events to not be lost during outages. What EventBridge feature ensures delivery?",
    options: [
      "Configure a Dead Letter Queue (SQS) on the EventBridge rule target for retry overflow, and rely on EventBridge's built-in retry with exponential backoff",
      "Use EventBridge Archive to store events and manually replay them after the outage",
      "Increase the EventBridge event bus throughput to queue events during outages",
      "Use EventBridge Pipes with a buffer to hold events during downstream failures",
    ],
    correctIndices: [0],
    explanation:
      "EventBridge retries failed target invocations with exponential backoff for up to 24 hours. If all retries are exhausted and a Dead Letter Queue (SQS) is configured on the target, the event is sent to the DLQ for later processing. This combination ensures no events are lost during transient outages. EventBridge Archive captures events for replay but requires manual replay after the outage — not automatic. EventBridge event buses don't queue events. Pipes add transformation/filtering but don't add buffering for target failures.",
    optionExplanations: [
      "Correct. EventBridge retries failed target invocations using exponential backoff for up to 24 hours automatically. Configuring a Dead Letter Queue (SQS) on the rule target ensures that events which exhaust all retries are captured and can be reprocessed once the downstream system recovers, guaranteeing no events are permanently lost.",
      "Incorrect. EventBridge Archive stores events for replay but requires a developer to manually initiate the replay after the outage is resolved; this does not provide automatic delivery assurance during the outage and requires operational intervention.",
      "Incorrect. EventBridge event buses do not buffer or queue events internally when a target is unavailable; increasing throughput capacity does not affect whether events are held during a downstream outage.",
      "Incorrect. EventBridge Pipes connect a source to a target with filtering and enrichment, but they do not add durable buffering for failures at the final target; events that cannot be delivered to the target are still subject to the same retry and DLQ behavior.",
    ],
    tags: ["eventbridge", "dlq", "retry", "reliability", "delivery"],
  },
  {
    id: "qq-115",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation template includes an EC2 instance with cfn-init metadata. After deployment, the developer finds the instance did not run the cfn-init configuration. What is MOST likely missing?",
    options: [
      "The UserData script is missing the cfn-init call and cfn-signal command",
      "The cfn-init configuration requires the CloudWatch Agent to be installed first",
      "The IAM instance profile does not have CloudFormation permissions",
      "cfn-init requires the AWS::CloudFormation::WaitCondition resource to be defined",
    ],
    correctIndices: [0],
    explanation:
      "cfn-init is not executed automatically — you must call it explicitly from the EC2 instance's UserData script. The UserData script runs cfn-init -v --stack StackName --resource ResourceName --region Region to pull and apply the metadata configuration. Additionally, cfn-signal is required to signal CloudFormation that initialization completed (with success or failure), especially when using CreationPolicy. Missing the UserData cfn-init call is the most common reason cfn-init never runs.",
    optionExplanations: [
      "Correct. cfn-init is not self-executing; the EC2 instance's UserData script must explicitly call the cfn-init binary with the stack name and resource name, then call cfn-signal to report success or failure back to CloudFormation's CreationPolicy.",
      "Incorrect. cfn-init is independent of the CloudWatch Agent; the CloudWatch Agent is for metrics and log collection, and its presence or absence on the instance has no effect on whether cfn-init runs.",
      "Incorrect. cfn-init reads configuration from the CloudFormation stack's metadata via the CloudFormation API; it needs permissions to call cloudformation:DescribeStackResource, but missing IAM permissions would cause cfn-init to fail with an authorization error, not silently skip.",
      "Incorrect. AWS::CloudFormation::WaitCondition is used alongside cfn-signal to pause stack creation until a signal is received; it is separate from cfn-init and not required for cfn-init to run — cfn-init runs whenever the UserData script calls it.",
    ],
    tags: ["cloudformation", "cfn-init", "userdata", "cfn-signal", "ec2"],
  },
  {
    id: "qq-116",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "AWS X-Ray",
    question:
      "A developer instruments a Python Lambda function with the X-Ray SDK and calls patch_all(). However, DynamoDB calls are not appearing as subsegments in traces. What is the most likely cause?",
    options: [
      "patch_all() must be called before boto3 is imported, or use xray_recorder.capture() as a decorator on the handler",
      "DynamoDB is not supported by the X-Ray Python SDK",
      "The Lambda function needs a higher memory allocation to collect subsegments",
      "DynamoDB subsegments only appear in X-Ray if the DynamoDB table has Streams enabled",
    ],
    correctIndices: [0],
    explanation:
      "X-Ray's patch_all() patches boto3 clients to automatically create subsegments for AWS SDK calls. However, if boto3 is imported BEFORE patch_all() is called, the client is not patched. The correct order: import xray_sdk modules → call patch_all() → import boto3. Alternatively, create boto3 clients after calling patch_all(). DynamoDB is fully supported by the X-Ray SDK. Memory and DynamoDB Streams are unrelated to X-Ray subsegment collection.",
    optionExplanations: [
      "Correct. patch_all() must be called before any boto3 imports because it patches the boto3 library at import time; if boto3 is already imported, the client is not instrumented and no subsegments are recorded for its calls.",
      "Incorrect. DynamoDB is fully supported by the X-Ray Python SDK; boto3's DynamoDB client is among the AWS SDK clients that patch_all() instruments to automatically generate subsegments.",
      "Incorrect. Memory allocation controls CPU allocation and /tmp storage for a Lambda function, but it has no effect on the X-Ray SDK's ability to capture and record subsegments for AWS SDK calls.",
      "Incorrect. DynamoDB Streams is a change-data-capture feature for the table itself; it has no relationship to whether X-Ray subsegments are collected for DynamoDB API calls made by the application.",
    ],
    tags: ["x-ray", "python", "patch-all", "boto3", "subsegments"],
  },
  {
    id: "qq-117",
    domain: "development",
    difficulty: "easy",
    type: "single",
    service: "Amazon SNS",
    question: "What is the maximum message size for Amazon SNS?",
    options: ["256 KB", "1 MB", "64 KB", "10 MB"],
    correctIndices: [0],
    explanation:
      "Amazon SNS supports messages up to 256 KB in size. For larger payloads, use the SNS Extended Client Library which stores the actual message in S3 and sends a reference in the SNS message. This is the same pattern used with SQS Extended Client Library. SQS also has a 256 KB message size limit.",
    optionExplanations: [
      "Correct. Amazon SNS enforces a maximum message payload size of 256 KB. For larger payloads, the SNS Extended Client Library stores the actual content in S3 and sends a reference pointer in the SNS message, keeping the message itself within the 256 KB limit.",
      "Incorrect. 1 MB exceeds the SNS maximum message size of 256 KB. SNS will reject messages larger than 256 KB with an error.",
      "Incorrect. 64 KB is below the actual limit; SNS supports messages up to 256 KB, so a 64 KB message is well within limits but this value is not the maximum.",
      "Incorrect. 10 MB far exceeds the SNS message size limit. This is closer to the maximum payload size for API Gateway (10 MB) or Lambda synchronous invocations, not SNS.",
    ],
    tags: ["sns", "limits", "message-size"],
  },
  {
    id: "qq-118",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "An API Gateway WebSocket API needs to push messages to connected clients from a backend Lambda that is triggered by an SQS event (not from the client's WebSocket request). How does the backend Lambda send a message to a specific client?",
    options: [
      "Use the API Gateway Management API (PostToConnection) with the client's connectionId to push a message",
      "The backend Lambda cannot send to WebSocket clients — only client-initiated messages are supported",
      "Store the message in DynamoDB and the client polls for updates via REST",
      "Use SNS to publish to a topic that the WebSocket client subscribes to directly",
    ],
    correctIndices: [0],
    explanation:
      "API Gateway WebSocket APIs assign each connected client a connectionId. Backend services can push messages to specific clients using the API Gateway Management API endpoint: POST https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/@connections/{connectionId}. The backend Lambda stores connectionIds (typically in DynamoDB) and uses PostToConnection to push data. This enables server-initiated push. SNS does not support WebSocket clients directly.",
    optionExplanations: [
      "Correct. API Gateway WebSocket APIs assign each connected client a unique connectionId. Backend services push messages to a specific client by calling the API Gateway Management API's PostToConnection endpoint (POST to https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/@connections/{connectionId}), enabling true server-initiated push.",
      "Incorrect. API Gateway WebSocket APIs fully support server-initiated message push to connected clients; the backend Lambda does not need to wait for a client message and can push at any time using a stored connectionId.",
      "Incorrect. Having the client poll DynamoDB via a REST endpoint defeats the purpose of WebSocket connections and introduces unnecessary latency; the PostToConnection API exists specifically to push data to clients without requiring a client request.",
      "Incorrect. SNS delivers notifications to subscribed endpoints such as HTTP URLs, SQS queues, or Lambda functions; it does not have a mechanism to deliver messages directly into a WebSocket connection maintained by API Gateway.",
    ],
    tags: [
      "api-gateway",
      "websocket",
      "connectionid",
      "posttoconnection",
      "push",
    ],
  },
  {
    id: "qq-119",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS KMS",
    question:
      "A CMK is scheduled for deletion with a 7-day waiting period. During this period, an application tries to use the key to decrypt data. What happens?",
    options: [
      "The decrypt operation fails with KMSInvalidStateException — keys in pending deletion state cannot be used",
      "The decrypt operation succeeds — the key is still active during the waiting period",
      "The decrypt operation fails with AccessDeniedException — deletion removes key policy",
      "The decrypt operation is queued and executed after the deletion is cancelled",
    ],
    correctIndices: [0],
    explanation:
      "During the deletion waiting period (7-30 days), a KMS CMK is disabled and cannot be used for any cryptographic operations — encryption, decryption, signing, or verification will fail with KMSInvalidStateException. This is intentional — it gives you time to identify dependencies and cancel deletion if needed. The key is not yet deleted (it still exists in KMS), but it cannot be used. Cancel deletion before the waiting period ends to restore the key. After the period, the key is permanently deleted and all data encrypted with it is permanently inaccessible.",
    optionExplanations: [
      "Correct. During the deletion waiting period (minimum 7 days, up to 30 days), the CMK is placed in a 'Pending deletion' state. All cryptographic operations — Encrypt, Decrypt, GenerateDataKey, Sign, Verify — fail immediately with KMSInvalidStateException. This allows you to identify applications that still depend on the key and cancel deletion if needed.",
      "Incorrect. A CMK in pending deletion state is not active and cannot be used for any cryptographic operation. AWS intentionally disables the key during the waiting period so you can safely evaluate whether any system still depends on it before it is permanently destroyed.",
      "Incorrect. The failure is KMSInvalidStateException, not AccessDeniedException. AccessDeniedException indicates an IAM or key policy authorization failure. The key policy is not removed during pending deletion — the key is disabled for use, which is a different state than an authorization failure.",
      "Incorrect. KMS does not queue cryptographic operations for later execution. When a key is in pending deletion state, the operation fails immediately with KMSInvalidStateException. The only way to restore key usage is to cancel the deletion before the waiting period expires, after which the key returns to its previous enabled state.",
    ],
    tags: ["kms", "key-deletion", "pending-deletion", "kms-invalid-state"],
  },
  {
    id: "qq-120",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "multi",
    service: "Amazon ElastiCache",
    question:
      "An ElastiCache Redis cluster is experiencing high Evictions metrics in CloudWatch. Which TWO actions should the developer take? (Select TWO)",
    options: [
      "Scale up to a larger node type with more memory",
      "Review application cache TTLs and reduce them for less-accessed data",
      "Enable Redis persistence (AOF) to prevent evictions",
      "Switch to Memcached which has better eviction handling",
      "Enable Redis Cluster Mode to distribute data across more nodes",
    ],
    correctIndices: [0, 4],
    explanation:
      "High evictions mean the cache is running out of memory and evicting keys to make room for new ones. Solutions: 1) Scale up to a larger node type with more memory (vertical scaling). 2) Enable Cluster Mode to distribute data across more nodes (horizontal scaling). Reducing TTLs makes evictions worse — data expires faster, requiring more DB reads, and new data is written back to the cache. AOF persistence writes data to disk for crash recovery — it doesn't prevent evictions (evictions are a memory management policy). Memcached also evicts when full — switching engines doesn't solve the root cause.",
    optionExplanations: [
      "Correct. Scaling up to a node type with more RAM gives the cache more memory to hold data, directly reducing evictions caused by memory pressure.",
      "Incorrect. Reducing cache TTLs causes items to expire sooner, freeing memory temporarily, but also means more cache misses and more frequent database reads; this does not reliably reduce evictions and can increase overall load.",
      "Incorrect. Redis AOF (Append-Only File) persistence writes every write operation to disk for crash recovery; it has no effect on memory eviction policy — evictions occur when maxmemory is reached regardless of persistence settings.",
      "Incorrect. Memcached also evicts the least recently used items when it runs out of memory; switching engines does not increase the total available memory or solve the root cause of high evictions.",
      "Correct. Enabling Redis Cluster Mode distributes keys across multiple shards (nodes), effectively multiplying total available memory across the cluster and reducing evictions by giving each shard a smaller working set.",
    ],
    tags: ["elasticache", "redis", "evictions", "memory", "scaling"],
  },
];
