import { QuizQuestion } from "../../types";

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
      "Lambda Layers are the purpose-built solution for sharing code and dependencies across functions. Each function can reference up to 5 layers, and a layer can be attached to any number of functions. The layer is extracted to /opt in the execution environment. Packaging into each ZIP wastes space and makes updates tedious. EFS mounting works but adds latency and cost. S3 downloads at runtime adds cold start time.",
    optionExplanations: [
      "Correct. Lambda Layers are the purpose-built solution for sharing libraries — the layer is extracted to /opt in the execution environment and can be attached to any number of functions (each function can reference up to 5 layers).",
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
      "The Lambda function has reserved concurrency set to 0",
      "The function execution time exceeds the SQS visibility timeout",
      "The SQS queue has long polling disabled",
      "The SQS queue is configured as a FIFO queue",
    ],
    correctIndices: [1],
    explanation:
      "When a Lambda function takes longer than the SQS visibility timeout to process a message, the message becomes visible again and can be picked up by another invocation — causing duplicate processing. The fix is to set the visibility timeout to at least 6× the function timeout. FIFO queues actually prevent duplicates. Reserved concurrency of 0 would disable the function entirely. Long polling affects how fast messages are received, not duplicates.",
    optionExplanations: [
      "Incorrect. Reserved concurrency of 0 would prevent any concurrent executions, effectively disabling the function entirely — it would not cause duplicate processing.",
      "Correct. When a Lambda function's execution time exceeds the SQS visibility timeout, the message becomes visible again and another Lambda invocation picks it up — causing the same message to be processed more than once. The fix is to set visibility timeout to at least 6× the function timeout.",
      "Incorrect. Long polling affects how quickly Lambda detects messages in the queue; it has no impact on whether messages are processed more than once.",
      "Incorrect. FIFO queues actually prevent duplicate delivery with their deduplication window — they would reduce duplicates, not cause them.",
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
      "GetItem with projection expression",
      "Query with a KeyConditionExpression on userId and date range",
      "Scan with a FilterExpression on userId and date",
      "BatchGetItem with multiple user IDs",
    ],
    correctIndices: [1],
    explanation:
      "Query is the correct operation — it requires the partition key and supports sort key conditions like BETWEEN, begins_with, and comparison operators. This reads only the relevant partition. Scan reads the entire table and is extremely inefficient and costly for this use case. GetItem retrieves a single item by full primary key. BatchGetItem retrieves multiple specific items by key.",
    optionExplanations: [
      "Incorrect. Query with a KeyConditionExpression is the right operation — it requires specifying the partition key (userId) and optionally a sort key condition (date range using BETWEEN or comparison operators), reading only the items in that partition efficiently.",
      "Correct. Scan reads every item in the entire table and then applies a FilterExpression to discard non-matching items — it consumes RCU for all items scanned, making it extremely expensive and slow for targeted lookups.",
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
      "Enable server-side encryption on the queue",
      "Increase the message retention period",
      "Check if the consumer processing time exceeds the visibility timeout and extend it",
      "Switch to a FIFO queue to ensure exactly-once processing",
    ],
    correctIndices: [2],
    explanation:
      "The most common cause of duplicate processing with SQS is that the consumer takes longer to process a message than the visibility timeout, causing the message to reappear. Extending the visibility timeout (or calling ChangeMessageVisibility during processing) fixes this. While switching to FIFO adds exactly-once processing, it also limits throughput. SQS Standard inherently delivers at-least-once — idempotent consumers are the right design. Retention period and encryption are unrelated.",
    optionExplanations: [
      "Incorrect. When a consumer takes longer to process a message than the queue's visibility timeout, SQS makes the message visible again for another consumer, causing duplicate processing. Extending the visibility timeout (or calling ChangeMessageVisibility mid-processing) resolves this.",
      "Incorrect. Switching to a FIFO queue adds exactly-once processing deduplication, which would prevent duplicates, but it also limits throughput to 300 messages/second (3,000 with batching) and does not address the root cause of the visibility timeout mismatch.",
      "Correct. The message retention period controls how long SQS keeps undelivered messages; increasing it has no effect on whether messages are redelivered while a consumer is still processing them.",
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
      "The data will be buffered and delivered eventually with no errors",
      "ProvisionedThroughputExceededException will occur; add more shards via shard splitting",
      "The producer should switch to Kinesis Data Firehose instead",
      "The stream will automatically scale to accommodate the additional throughput",
    ],
    correctIndices: [1],
    explanation:
      "Each Kinesis shard supports 1 MB/s write throughput. 4 shards = 4 MB/s maximum write capacity. Writing 5 MB/s exceeds this and causes ProvisionedThroughputExceededException. The fix is to split shards (add capacity) to reach at least 5 shards. Kinesis Data Streams does NOT auto-scale — you must manually scale or use on-demand mode. Firehose is a different service with different use cases.",
    optionExplanations: [
      "Incorrect. Each Kinesis shard supports 1 MB/s write throughput, so 4 shards = 4 MB/s total capacity. Writing 5 MB/s exceeds this limit and throws ProvisionedThroughputExceededException; the fix is to split shards until capacity meets demand.",
      "Correct. Kinesis Data Streams in provisioned mode does NOT auto-scale. You must manually add shards via shard splitting, or switch to on-demand mode to get automatic capacity adjustments.",
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
      "Enable public write access on the S3 bucket",
      "Create an IAM user with S3 write permissions and embed credentials in the frontend",
      "Use an API Gateway proxy to forward uploads to S3",
      "Generate a pre-signed URL with PUT method and provide it to the client",
    ],
    correctIndices: [3],
    explanation:
      "Pre-signed URLs grant temporary, time-limited access to perform a specific S3 operation (PUT for upload) without requiring the user to have AWS credentials. The server generates the URL using AWS credentials and the client uses it directly. Embedding IAM credentials in frontend code is a severe security vulnerability. Enabling public write access would allow anyone to upload anything to your bucket. API Gateway proxy adds unnecessary complexity and cost for large file uploads.",
    optionExplanations: [
      "Incorrect. Pre-signed URLs let the server generate a time-limited, scoped URL using its own AWS credentials so the client can upload directly to S3 without ever receiving AWS keys.",
      "Incorrect. Embedding IAM user credentials in frontend code exposes long-term AWS access keys to anyone who inspects the page or bundle, which is a critical security vulnerability.",
      "Incorrect. Enabling public write access allows any person on the internet to upload arbitrary content to your bucket, creating massive security and cost risks.",
      "Correct. Proxying large file uploads through API Gateway adds latency, cost, and payload size limitations (10 MB for API Gateway); pre-signed URLs let clients upload directly to S3.",
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
      "Compress the file to under 5 GB before uploading as a single PUT",
      "Use the AWS CLI sync command which handles retries automatically",
      "Use S3 Transfer Acceleration for more reliable uploads",
      "Use multipart upload with individual part retries on failure",
    ],
    correctIndices: [3],
    explanation:
      "Multipart upload is required for objects over 5 GB and strongly recommended for objects over 100 MB. It uploads the file in parts that can be retried individually on failure — you do not need to restart the entire upload. S3 Transfer Acceleration improves speed over long distances but does not change reliability for mid-upload failures. AWS CLI sync does retry, but multipart with individual part retries is the underlying mechanism that makes large uploads reliable.",
    optionExplanations: [
      "Incorrect. Multipart upload splits the file into independently uploadable parts (minimum 5 MB each, up to 10,000 parts); a failed part can be retried without restarting the entire transfer, making it the most reliable approach for large objects.",
      "Incorrect. S3 supports single PUT objects only up to 5 GB, and compressing a 10 GB file to under 5 GB may not always be feasible; even if it were, a mid-upload failure still loses the entire upload.",
      "Incorrect. S3 Transfer Acceleration routes data through AWS edge locations for improved speed over long geographic distances, but it does not add resilience against mid-upload failures.",
      "Correct. The AWS CLI sync command does implement retries and uses multipart upload under the hood, but the underlying mechanism providing reliability is multipart upload—making it the more fundamental and direct answer.",
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
      "Use query parameters to determine which Lambda version to invoke",
      "Use API Gateway canary deployments to split traffic between versions",
      "Create a separate API Gateway for each environment",
      "Use stage variables to reference different Lambda aliases per stage",
    ],
    correctIndices: [3],
    explanation:
      "Stage variables allow you to parameterize the integration target per stage. For example, the Lambda function ARN can include a stage variable: arn:aws:lambda:region:account:function:myFunction:${stageVariables.lambdaAlias}. Each stage (dev/staging/prod) sets lambdaAlias to the appropriate Lambda alias. This maintains one API definition while routing to different function versions per environment. Creating separate APIs is duplication. Query parameters would require application logic changes. Canary deployments are for gradual traffic shifting, not environment isolation.",
    optionExplanations: [
      "Incorrect. Stage variables parameterize the integration target per stage, so the Lambda function ARN can reference a stage variable (e.g., ${stageVariables.lambdaAlias}) and each stage sets that variable to the appropriate Lambda alias, maintaining a single API definition across all environments.",
      "Incorrect. Creating a separate API Gateway for each environment duplicates the API definition and forces developers to maintain multiple configurations in sync, increasing operational overhead without providing any advantage over stage variables.",
      "Incorrect. Using query parameters to select a Lambda version requires the client to be aware of environment-specific values and adds application-level logic to route between versions, which is a fragile approach that leaks infrastructure concerns into the API contract.",
      "Correct. API Gateway canary deployments gradually shift traffic between two versions of the same deployment within a single stage; they are designed for safe production releases, not for environment isolation across dev, staging, and production.",
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
      "A single SQS queue with all three services polling from it",
      "Three separate SNS topics, one per service",
      "SNS topic with three Lambda subscriptions",
      "SNS topic with three SQS queue subscriptions (fan-out pattern)",
    ],
    correctIndices: [3],
    explanation:
      "The fan-out pattern uses one SNS topic subscribed by three SQS queues — each queue belongs to one service. Every service gets a copy of every message. SQS queues provide buffering, retry, and decoupling. Using three separate topics would require the publisher to know about all consumers. A single SQS queue shared by three services means each message is processed by only one service (messages are consumed, not broadcast). Lambda subscriptions work but lack buffering and retry capabilities of SQS.",
    optionExplanations: [
      "Incorrect. The SNS fan-out pattern uses one topic with three separate SQS queue subscriptions—each queue belongs to one downstream service. Every published message is delivered to all three queues, ensuring each service receives every order. SQS queues provide buffering, retry, and decoupling between the publisher and each consumer.",
      "Incorrect. Using three separate SNS topics would require the order publisher to be aware of and publish to each individual topic, tightly coupling the publisher to every downstream consumer and making it harder to add new consumers later.",
      "Incorrect. A single SQS queue shared by three services means SQS delivers each message to only one consumer (messages are consumed, not broadcast). Only one of the three services would process each order, not all three.",
      "Correct. SNS can invoke Lambda functions directly, but Lambda invocations lack the buffering and retry capabilities that SQS provides. If a Lambda function fails, the message can be lost unless a DLQ is configured on the Lambda, making this a less robust architecture than SNS→SQS→service.",
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
      "Split the file into 4 KB chunks and encrypt each chunk separately with KMS",
      "Use KMS GenerateDataKey to get a DEK, encrypt the file locally with the DEK, store the encrypted DEK alongside the file",
      "Base64 encode the file to work within KMS limits",
      "Use SSE-KMS on S3 to encrypt the file automatically during upload",
    ],
    correctIndices: [1],
    explanation:
      "KMS Encrypt is limited to 4 KB. Envelope encryption solves this: call GenerateDataKey to get a plaintext DEK and an encrypted DEK. Use the plaintext DEK with a local encryption library (AES-256) to encrypt the large file. Discard the plaintext DEK. Store the encrypted DEK alongside the encrypted data. To decrypt: call KMS Decrypt on the encrypted DEK, then use the plaintext DEK locally. Splitting into 4 KB chunks is impractical and inefficient. SSE-KMS is for S3-managed encryption, not Lambda-side encryption.",
    optionExplanations: [
      "Incorrect. This is envelope encryption: GenerateDataKey returns a plaintext DEK and an encrypted DEK. Use the plaintext DEK locally (e.g., AES-256) to encrypt the large file, then discard the plaintext DEK and store the encrypted DEK alongside the ciphertext. To decrypt, call KMS Decrypt on the stored encrypted DEK, then use the resulting plaintext DEK to decrypt the file locally.",
      "Correct. Splitting a 50 MB file into thousands of 4 KB chunks and calling KMS Encrypt on each is impractical, extremely slow, and would consume enormous numbers of KMS API calls. Envelope encryption is the correct and efficient solution for data larger than 4 KB.",
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
      "Cache the secret in a Lambda Layer updated during rotation",
      "Store the secret in an environment variable and update it manually after each rotation",
      "Use a DynamoDB table to store credentials and update it via a rotation Lambda",
      "Retrieve the secret from Secrets Manager at each invocation and implement retry logic for authentication failures",
    ],
    correctIndices: [3],
    explanation:
      "The recommended pattern is to retrieve the secret from Secrets Manager on each invocation (or cache with a short TTL) and implement retry logic: if authentication fails, refresh the cached secret and retry once. This handles the brief window during rotation when old credentials are invalidated. Secrets Manager caching libraries (AWS SDK) handle this automatically. Environment variables require manual updates — defeating the purpose of auto-rotation. Lambda Layers are for code/dependencies, not runtime secrets.",
    optionExplanations: [
      "Incorrect. The recommended pattern is to retrieve the secret from Secrets Manager on each invocation (or cache it with a short TTL using the AWS Secrets Manager caching library) and implement retry logic: if the database authentication fails, refresh the cached secret and retry once. This handles the brief overlap during rotation when old credentials may be invalidated before the new credentials are fully propagated.",
      "Incorrect. Lambda Layers are designed to share code, libraries, or binaries — not runtime secrets. A Layer is bundled at deployment time and cannot be updated dynamically during automatic rotation without a full redeployment. Using a Layer for credentials would reintroduce the problem of stale secrets.",
      "Incorrect. Storing secrets in Lambda environment variables defeats the purpose of Secrets Manager auto-rotation. Environment variables are set at deployment time and cannot be updated automatically when rotation occurs; every rotation would require manually updating the Lambda configuration and redeploying the function.",
      "Correct. Using a DynamoDB table as a credentials store is a custom anti-pattern that adds complexity, latency, and operational burden without the security benefits of Secrets Manager (automatic rotation, encryption, audit logging, fine-grained IAM access control). It also requires writing a custom rotation mechanism.",
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
      "AWS Organizations must be enabled with both accounts in the same OU",
      "VPC peering between Account A and Account B",
      "A trust policy on the IAM role in Account B that allows Account A principal to assume it, and the developer must call sts:AssumeRole",
      "A resource-based policy in Account B that grants the Account A user access directly",
    ],
    correctIndices: [2],
    explanation:
      "Cross-account role assumption requires: 1) An IAM role in Account B with a trust policy (principal = Account A user/role ARN) allowing sts:AssumeRole. 2) The Account A user's identity policy must allow sts:AssumeRole on the Account B role ARN. The developer calls sts:AssumeRole and gets temporary credentials scoped to the Account B role. Resource-based policies can grant cross-account access for some services (S3, Lambda, etc.) but not via STS. VPC peering and Organizations are unrelated.",
    optionExplanations: [
      "Incorrect. Cross-account access via role assumption requires two things: (1) an IAM role in Account B with a trust policy that explicitly trusts the Account A principal (allowing sts:AssumeRole), and (2) the developer calling sts:AssumeRole and exchanging permanent credentials for temporary, scoped credentials in Account B.",
      "Incorrect. Resource-based policies (e.g., on S3 buckets or Lambda functions) can grant cross-account access to specific resources, but they do not provide a general mechanism for assuming an identity across accounts the way STS role assumption does. For cross-account access to many services, role assumption is the standard approach.",
      "Correct. VPC peering enables private network connectivity between VPCs in different accounts but has nothing to do with IAM authentication or authorization. Network connectivity and permission to call AWS APIs are completely separate concerns.",
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
      "CodeDeployDefault.LambdaLinear10PercentEvery5Minutes",
      "CodeDeployDefault.LambdaBlueGreen",
      "CodeDeployDefault.LambdaAllAtOnce",
      "CodeDeployDefault.LambdaCanary10Percent5Minutes",
    ],
    correctIndices: [3],
    explanation:
      'Canary deployments shift a small percentage of traffic to the new version, wait, then shift the remainder. LambdaCanary10Percent5Minutes shifts 10% for 5 minutes, then 90% at once. Linear deployments shift traffic incrementally over time (e.g., 10% every 5 minutes until 100%). AllAtOnce shifts immediately with no safety period. There is no "BlueGreen" configuration for Lambda — blue/green is used for EC2.',
    optionExplanations: [
      "Incorrect. LambdaCanary10Percent5Minutes is a CodeDeploy built-in configuration that shifts 10% of traffic to the new Lambda version for 5 minutes and then — if no alarms fire — shifts the remaining 90% all at once.",
      "Incorrect. LambdaLinear10PercentEvery5Minutes increases traffic by 10% every 5 minutes in equal increments (10% → 20% → 30% … → 100%), taking 50 minutes total; this does not match the 'hold at 10% then shift all at once' pattern described.",
      "Incorrect. LambdaAllAtOnce immediately routes 100% of traffic to the new version with no safety period, providing no ability to catch errors before full rollout.",
      "Correct. There is no CodeDeployDefault.LambdaBlueGreen configuration; blue/green terminology is used for EC2 deployments, not Lambda. Lambda traffic shifting uses canary or linear strategies.",
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
      "sam validate --local",
      "sam deploy --dry-run",
      "sam build --local",
      "sam local invoke",
    ],
    correctIndices: [3],
    explanation:
      "sam local invoke runs a Lambda function locally in a Docker container that simulates the Lambda runtime. You can pass an event JSON file with -e event.json. sam local start-api starts a local API Gateway. sam deploy performs actual deployment. sam build compiles/packages the application. sam validate checks the template syntax.",
    optionExplanations: [
      "Incorrect. sam local invoke runs the specified Lambda function inside a Docker container that mimics the Lambda execution environment, accepting a JSON event file via -e and printing the function's response to stdout.",
      "Incorrect. sam deploy performs an actual deployment to AWS using CloudFormation; there is no --dry-run flag for sam deploy, and this command does not run the function locally.",
      "Incorrect. sam build compiles source code and packages dependencies into the .aws-sam build directory; the --local flag does not exist for sam build and the command does not execute the Lambda function.",
      "Correct. sam validate checks the SAM/CloudFormation template file for syntax and structural correctness; it does not run or invoke the Lambda function, and there is no --local flag for validation.",
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
      "Use the stack policy to override the failed resource update",
      "Delete the stack and recreate it from scratch",
      "Use the ContinueUpdateRollback API to skip the failed resources and complete the rollback",
      "Manually fix the resource in the console and the stack will automatically recover",
    ],
    correctIndices: [2],
    explanation:
      'UPDATE_ROLLBACK_FAILED means CloudFormation tried to roll back changes but failed. The ContinueUpdateRollback API (or "Continue rollback" in console) lets you retry the rollback, optionally skipping specific resources that cannot be rolled back. After specifying resources to skip, CloudFormation completes the rollback and the stack enters UPDATE_ROLLBACK_COMPLETE. Deleting a failed stack is possible but loses all resources. Manually fixing resources without telling CloudFormation creates drift.',
    optionExplanations: [
      "Incorrect. The ContinueUpdateRollback API (or 'Continue rollback' in the console) retries a stuck rollback and allows you to specify specific resources to skip if they cannot be rolled back, eventually returning the stack to UPDATE_ROLLBACK_COMPLETE.",
      "Incorrect. Deleting a failed stack is possible but destructive — it removes all CloudFormation-managed resources from the account; it is a last resort, not the recommended recovery path for UPDATE_ROLLBACK_FAILED.",
      "Correct. A CloudFormation stack policy prevents specified resources from being updated during future stack updates; it does not help recover a stack already stuck in UPDATE_ROLLBACK_FAILED state.",
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
    options: ["cdk validate", "cdk preview", "cdk plan", "cdk diff"],
    correctIndices: [3],
    explanation:
      "cdk diff compares the synthesized CloudFormation template against the currently deployed stack and shows what resources will be added, modified, or deleted — similar to terraform plan. cdk synth generates the CloudFormation template. cdk deploy deploys the changes. cdk validate is not a standard CDK command (CloudFormation has cfn validate). cdk plan and cdk preview do not exist.",
    optionExplanations: [
      "Incorrect. cdk diff synthesizes the CDK app into a CloudFormation template and compares it to the currently deployed stack, showing a human-readable diff of resources that will be added, modified, or deleted — similar to terraform plan.",
      "Incorrect. cdk preview is not a standard CDK CLI command; there is no such command in the AWS CDK toolchain.",
      "Incorrect. cdk plan is not a standard CDK CLI command; this terminology comes from Terraform and does not exist in the CDK CLI.",
      "Correct. cdk validate is not a standard CDK CLI command; CloudFormation template validation can be done with cfn-lint or aws cloudformation validate-template, but CDK uses cdk synth and cdk diff for pre-deployment review.",
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
      "Metadata — non-indexed key-value pairs for additional context",
      "Subsegments — child segments for capturing additional trace data",
      "Annotations — indexed key-value pairs searchable in the X-Ray console",
      "Sampling rules — configurable trace collection rates",
    ],
    correctIndices: [2],
    explanation:
      "X-Ray Annotations are indexed key-value pairs that you can use to filter and search traces in the X-Ray console and API. Use annotations for data you will query (orderId, userId, environment). Metadata stores additional non-indexed information visible in trace details but not searchable. Subsegments capture timing for downstream calls. Sampling rules control what percentage of requests are traced.",
    optionExplanations: [
      "Incorrect. X-Ray Annotations are indexed key-value pairs (strings, numbers, or Booleans) that you can filter and search on in the X-Ray console and Groups — ideal for business identifiers like orderId or userId.",
      "Incorrect. X-Ray Metadata stores arbitrary non-indexed data visible in trace detail views but cannot be used in filter expressions to search for specific traces in the console or API.",
      "Correct. Subsegments are timing wrappers around downstream calls (HTTP, DynamoDB, etc.) that appear as child segments in a trace; they are for performance breakdown, not for attaching searchable business data.",
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
      "Use X-Ray annotations to capture metric values",
      "Aggregate metrics in Lambda and call PutMetricData once per hour",
      "Use CloudWatch Embedded Metric Format (EMF) to embed metrics in structured log output",
      "Write metrics to DynamoDB and query them with CloudWatch",
    ],
    correctIndices: [2],
    explanation:
      "CloudWatch Embedded Metric Format (EMF) lets functions write metric data as part of structured JSON log output. CloudWatch Logs automatically extracts and publishes the metrics — no PutMetricData API call needed. This works with the existing logging infrastructure and costs nothing extra beyond log storage. Aggregating in Lambda state is not possible at scale because Lambda is stateless. X-Ray annotations are for trace filtering, not metrics.",
    optionExplanations: [
      "Incorrect. CloudWatch Embedded Metric Format (EMF) lets Lambda write metric data as structured JSON log lines; CloudWatch Logs automatically extracts and publishes the metrics without any PutMetricData API call.",
      "Incorrect. DynamoDB is a key-value store, not a metrics pipeline; writing metrics there requires a separate polling or ETL process and does not integrate with CloudWatch Alarms natively.",
      "Correct. Lambda is stateless — each invocation runs in an isolated environment, so in-memory aggregation across invocations is not possible at scale and would produce inaccurate counts.",
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
      "Add ElastiCache Redis as an application-level cache",
      "Add a DAX (DynamoDB Accelerator) cluster in front of DynamoDB",
      "Enable DynamoDB auto-scaling to add capacity",
      "Switch to eventually consistent reads to reduce latency",
    ],
    correctIndices: [1],
    explanation:
      "DAX provides microsecond read latency for DynamoDB and is a drop-in compatible cache — the application uses the DAX client instead of the DynamoDB client with minimal code changes. It provides lower latency than ElastiCache because it is designed specifically for DynamoDB and is API-compatible. ElastiCache Redis requires application-level cache logic (check cache → miss → read DB → write cache). Auto-scaling helps with throughput but not latency. Eventually consistent reads reduce cost but have minimal impact on latency.",
    optionExplanations: [
      "Incorrect. DAX (DynamoDB Accelerator) is API-compatible with DynamoDB and provides microsecond read latency by caching responses in-memory; switching from the DynamoDB client to the DAX client requires minimal code changes.",
      "Correct. DynamoDB auto-scaling adjusts provisioned throughput capacity to handle more concurrent requests, which helps prevent throttling, but it does not reduce the fundamental read latency experienced by the application.",
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
      "Add a Dead Letter Queue to the Lambda function",
      "Enable BisectBatchOnFunctionError and configure an OnFailure destination to route failed records to SQS",
      "Switch to a Standard SQS queue as the event source",
      "Increase the function timeout and retry the failed batch indefinitely",
    ],
    correctIndices: [1],
    explanation:
      "BisectBatchOnFunctionError splits a failing batch in half recursively to isolate the poison-pill record. Combined with an OnFailure destination (SQS or SNS), the isolated bad record is routed out of the stream so processing can continue. MaximumRetryAttempts controls how many times a batch is retried before routing to the destination. Simply increasing timeout keeps retrying the same bad message indefinitely. Lambda DLQs only apply to asynchronous invocations, not stream-based event sources.",
    optionExplanations: [
      "Incorrect. BisectBatchOnFunctionError splits the failing batch in half recursively to isolate the poison-pill record, and OnFailure destination routes the bad record to SQS so the rest of the shard continues processing.",
      "Correct. Increasing the timeout just retries the same bad record indefinitely — the shard remains blocked and no progress is made.",
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
      "Pauses the deployment and waits for manual approval to continue",
      "Rolls back to the previous configuration if a CloudWatch alarm is linked as a rollback trigger",
      "Increases the deployment interval to slow down the rollout",
      "Sends an SNS notification to the team but continues the deployment",
    ],
    correctIndices: [1],
    explanation:
      "AppConfig supports CloudWatch alarm-based rollback triggers. If a linked alarm enters ALARM state during a deployment, AppConfig automatically stops the deployment and rolls back to the previously deployed configuration. This provides automated safety for configuration changes — similar to CodeDeploy rollback triggers. AppConfig does not pause and wait or adjust intervals automatically.",
    optionExplanations: [
      "Incorrect. AppConfig supports CloudWatch alarm-based rollback triggers; when a linked alarm enters ALARM state during a deployment, AppConfig automatically stops the deployment and reverts to the previously deployed configuration version.",
      "Correct. AppConfig does not merely send SNS notifications and continue; when a rollback alarm fires, it actively stops and rolls back the deployment rather than just notifying the team while continuing to push the new configuration.",
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
      "EventBridge Archive with a replay schedule",
      "EventBridge Rule with an event pattern matching a custom time event",
      "EventBridge Pipe connected to a CloudWatch alarm",
      "EventBridge Scheduler with a cron expression: cron(0 9 ? * MON-FRI *)",
    ],
    correctIndices: [3],
    explanation:
      "EventBridge Scheduler (or EventBridge Rules with schedule expressions) supports cron and rate expressions for time-based triggers. cron(0 9 ? * MON-FRI *) fires at 9:00 AM UTC Monday through Friday. The target can be a Lambda function, SQS queue, Step Functions, or 200+ other AWS services. EventBridge Pipes connect event sources to targets with filtering and enrichment. Archives are for replaying past events.",
    optionExplanations: [
      "Incorrect. EventBridge Scheduler (and EventBridge Rules with schedule expressions) supports cron expressions for time-based triggers. The expression cron(0 9 ? * MON-FRI *) fires at 9:00 AM UTC every Monday through Friday and can target a Lambda function directly.",
      "Incorrect. EventBridge Rules with event patterns match incoming events based on their structure and content; they do not trigger on a time schedule and cannot replace a cron expression for a scheduled task.",
      "Incorrect. EventBridge Pipes connect a supported source (like SQS or Kinesis) to a target with optional filtering and enrichment; a CloudWatch alarm is not a Pipe source and this combination does not implement time-based scheduling.",
      "Correct. EventBridge Archive captures events that have already been published to an event bus and allows replaying them later; it is not a scheduling mechanism and cannot trigger a Lambda function on a recurring time-based schedule.",
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
      "Increase the max_connections parameter on the RDS instance",
      "Switch to DynamoDB for better serverless scaling",
      "Use connection pooling libraries in the Lambda function code",
      "Add an RDS Proxy between Lambda and RDS to pool and manage database connections",
    ],
    correctIndices: [3],
    explanation:
      "RDS Proxy solves the Lambda connection exhaustion problem. Lambda can create thousands of concurrent invocations each trying to open a database connection — quickly exceeding RDS max_connections. RDS Proxy maintains a connection pool and multiplexes thousands of application connections into a smaller set of long-lived database connections. It handles connection reuse, reduces connection overhead, and improves failover time. Increasing max_connections has hard limits. Connection pooling in Lambda is limited because Lambda environments are short-lived and pooling is per-environment.",
    optionExplanations: [
      "Incorrect. RDS Proxy is the purpose-built solution for the Lambda-to-RDS connection exhaustion problem. It maintains a pool of long-lived database connections and multiplexes thousands of short-lived Lambda connections into that pool, dramatically reducing the number of actual database connections. RDS Proxy also improves failover handling and supports IAM authentication.",
      "Incorrect. Increasing max_connections provides temporary relief but does not scale to meet unpredictable serverless traffic. Each database connection consumes memory on the RDS instance, and setting max_connections too high can exhaust instance memory, causing database instability. The root cause (Lambda opening a new connection per invocation) is not addressed.",
      "Incorrect. Switching to DynamoDB would be a major architectural change that might not be appropriate for all workloads, particularly those requiring relational data, complex joins, or ACID transactions. It is not a targeted solution to the connection exhaustion problem and would require significant application refactoring.",
      "Correct. Connection pooling libraries in Lambda code (like SQLAlchemy pooling in Python) are partially effective: a pool is maintained per Lambda execution environment (a warm Lambda container), but new environments are created during scale-out events, each establishing their own connections. Under heavy load with thousands of concurrent invocations, this still results in too many connections to RDS.",
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
      "Test action with a quality gate",
      "Source action with a branch protection rule",
      "Lambda Invoke action with approval logic",
      "Manual Approval action",
    ],
    correctIndices: [3],
    explanation:
      "CodePipeline Manual Approval actions pause the pipeline and send an SNS notification to approvers. The pipeline waits (up to 7 days) for an approve or reject decision via the console, CLI, or API before proceeding. Lambda Invoke could implement custom logic but adds unnecessary complexity. Test actions run automated tests — they do not provide human approval gates. Source actions relate to code retrieval.",
    optionExplanations: [
      "Incorrect. A Manual Approval action pauses the pipeline, sends an SNS notification to specified approvers, and waits up to 7 days for someone to approve or reject via the AWS Console, CLI, or API before the pipeline proceeds.",
      "Incorrect. A Lambda Invoke action can execute custom approval logic programmatically, but it requires building and maintaining that logic; a Manual Approval action is the built-in, purpose-built solution for human gate review.",
      "Incorrect. A Test action in CodePipeline runs automated tests (e.g., with CodeBuild or a third-party testing service); it evaluates pass/fail criteria automatically and cannot wait for a human decision.",
      "Correct. A Source action retrieves the latest code from the source repository (CodeCommit, GitHub, S3); it is the first stage of a pipeline and has nothing to do with human approval gates between stages.",
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
      "Lambda cannot access the internet from a VPC; use API Gateway as a proxy instead",
      "VPC-connected Lambda has no internet access by default; add a NAT Gateway in a public subnet and route private subnet traffic through it",
      "Enable the Lambda function URL to bypass VPC restrictions",
      "The Lambda execution role is missing internet access permissions",
    ],
    correctIndices: [1],
    explanation:
      "When Lambda is placed inside a VPC, it loses its default internet access. The fix is a NAT Gateway deployed in a public subnet with the private subnet's route table pointing 0.0.0.0/0 to the NAT Gateway. Lambda can then reach the internet while remaining inside the VPC. Lambda execution roles control AWS service access, not internet connectivity. Lambda function URLs are inbound, not outbound. Lambda can access the internet from a VPC — it just needs NAT.",
    optionExplanations: [
      "Incorrect. When Lambda is placed inside a VPC, it loses its default internet access. The correct fix is a NAT Gateway in a public subnet with the private subnet's route table pointing 0.0.0.0/0 to the NAT Gateway, allowing outbound internet traffic while keeping the function private.",
      "Correct. Lambda can absolutely access the internet from inside a VPC — it just requires a NAT Gateway. API Gateway is an inbound trigger for Lambda, not an outbound proxy for Lambda's internet traffic.",
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
    options: ["5 minutes", "30 minutes", "15 minutes", "1 hour"],
    correctIndices: [2],
    explanation:
      "Lambda functions have a maximum execution timeout of 15 minutes (900 seconds). The default is 3 seconds. For workloads exceeding 15 minutes, consider AWS Fargate, EC2, AWS Batch, or Step Functions to orchestrate multiple shorter Lambda executions.",
    optionExplanations: [
      "Incorrect. The maximum execution timeout for a Lambda function is 15 minutes (900 seconds). For workloads that require longer execution, use Fargate, EC2, AWS Batch, or Step Functions to orchestrate multiple shorter Lambda executions.",
      "Incorrect. 5 minutes was an earlier limit but the current maximum timeout is 15 minutes (900 seconds).",
      "Correct. Lambda does not support a 1-hour timeout — the hard limit is 15 minutes regardless of memory or configuration.",
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
      "A Lambda function is hitting the 512 MB default /tmp storage limit. Which TWO alternatives can provide larger or shared persistent storage for Lambda? (Select TWO)",
    options: [
      "Mount an Amazon EFS file system to the Lambda function",
      "Use an S3 bucket to store and retrieve large files during execution",
      "Increase the Lambda memory allocation to get more /tmp space",
      "Use an SQS queue to buffer data across invocations",
      "Enable Lambda Provisioned Concurrency to persist /tmp across invocations",
    ],
    correctIndices: [0, 1],
    explanation:
      "EFS can be mounted to Lambda functions within a VPC, providing virtually unlimited shared storage that persists across invocations and is accessible by multiple functions simultaneously. S3 provides unlimited object storage accessible within Lambda execution via the SDK — ideal for large files. /tmp defaults to 512 MB and can be configured up to 10,240 MB (10 GB), but it is NOT shared across invocations. Memory allocation does not affect /tmp size. Provisioned Concurrency keeps environments warm but /tmp is still isolated per environment.",
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
      "Lambda scales to exactly one concurrent execution per SQS shard",
      "Lambda processes exactly one message at a time regardless of queue depth",
      "Lambda stops scaling after 1,000 concurrent executions for SQS triggers",
      "Lambda automatically scales up to process messages faster, limited by the function's reserved or account concurrency limit",
    ],
    correctIndices: [3],
    explanation:
      "When Lambda polls SQS, it scales concurrency based on the number of in-flight message batches. As queue depth grows, Lambda adds more concurrent executions (up to 300 additional concurrent executions per minute). Scaling is limited by the function's reserved concurrency (if set) or the account-level concurrency limit (default 1,000, adjustable). There is no SQS-specific concurrency cap at 1,000 — that is the account default which applies across all functions.",
    optionExplanations: [
      "Incorrect. Lambda automatically scales concurrency as SQS queue depth grows — it adds more concurrent executions (up to 300 additional concurrent executions per minute) until the queue drains or concurrency limits are reached.",
      "Incorrect. Lambda absolutely does scale beyond one concurrent execution for SQS — it increases parallelism based on queue depth and the configured batch size.",
      "Incorrect. SQS does not have shards (that is a Kinesis concept); Lambda scales based on the number of in-flight message batches, not a fixed one-per-shard rule.",
      "Correct. The 1,000 concurrent execution figure is the account-level default limit that applies across all functions — it is not an SQS-specific cap, and it can be increased by requesting a quota increase.",
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
      "Use TransactGetItems to check existence before PutItem",
      "Use a ConditionExpression: attribute_not_exists(pk)",
      "Use a FilterExpression on the PutItem call",
      "Use BatchWriteItem which automatically skips existing items",
    ],
    correctIndices: [1],
    explanation:
      "ConditionExpression with attribute_not_exists(pk) on PutItem causes the operation to fail with ConditionalCheckFailedException if an item with that partition key already exists. This is an atomic check-and-write — no race condition. FilterExpression is only for Query and Scan — not PutItem. TransactGetItems + PutItem would require two operations with potential race conditions. BatchWriteItem does not check for existing items — it overwrites.",
    optionExplanations: [
      "Incorrect. TransactGetItems retrieves items for reading; combining it with PutItem in separate calls creates a time-of-check to time-of-use (TOCTOU) race condition — the ConditionExpression approach is the atomic alternative.",
      "Correct. ConditionExpression with attribute_not_exists(pk) on a PutItem call makes the operation fail atomically with ConditionalCheckFailedException if an item with that partition key already exists — preventing overwrites without a separate read.",
      "Incorrect. FilterExpression is used only with Query and Scan operations to filter results after items are retrieved — it cannot be used with PutItem to conditionally prevent writes.",
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
    options: ["1 MB", "16 MB", "400 KB", "64 KB"],
    correctIndices: [2],
    explanation:
      "DynamoDB has a maximum item size of 400 KB, including attribute names and values. For items larger than 400 KB, store the large data in S3 and store the S3 object key in DynamoDB. This is a common pattern for documents, images, or large JSON payloads.",
    optionExplanations: [
      "Incorrect. 1 MB exceeds the DynamoDB item size limit — attempts to write items larger than 400 KB will fail with a ValidationException. The correct maximum is 400 KB.",
      "Incorrect. 16 MB is the maximum document size for MongoDB — DynamoDB's item size limit is 400 KB, which is far smaller.",
      "Correct. DynamoDB enforces a maximum item size of 400 KB, including all attribute names and their values. Items exceeding this limit must be redesigned — typically by storing large payloads in S3 and keeping only the S3 object reference in DynamoDB.",
      "Incorrect. 64 KB is well below the actual 400 KB limit — items can be up to 400 KB in total size, so this value is not the maximum.",
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
      "Enable S3 Inventory and process the inventory report with Lambda",
      "Create a CloudWatch Events rule that monitors S3 object creation",
      "Configure an S3 Event Notification with ObjectCreated event type and prefix filter /uploads/",
      "Use S3 Access Logs to detect new object creation and trigger Lambda",
    ],
    correctIndices: [2],
    explanation:
      "S3 Event Notifications natively trigger Lambda (or SQS, SNS) on object events like s3:ObjectCreated:*. You can filter by prefix and suffix to target specific paths. This is the simplest and lowest-latency approach. CloudWatch Events can capture S3 API calls via CloudTrail but adds latency and complexity. S3 Inventory generates daily/weekly reports — not real-time. S3 Access Logs are for access auditing, not real-time triggers.",
    optionExplanations: [
      "Incorrect. S3 Event Notifications can be configured to invoke Lambda (or send to SQS/SNS) on s3:ObjectCreated:* events, with prefix and suffix filters to target only the /uploads/ path, providing the lowest-latency and simplest trigger.",
      "Incorrect. CloudWatch Events (EventBridge) can detect S3 API calls via CloudTrail, but this adds extra latency and requires CloudTrail data events to be enabled, making it more complex and slower than native S3 Event Notifications.",
      "Correct. S3 Inventory produces daily or weekly reports of bucket contents—it is designed for auditing and compliance, not for real-time event-driven processing of new uploads.",
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
      "The S3 bucket policy is preventing CloudFront from reading new objects",
      "CloudFront needs a redeployment to pick up new S3 content",
      "CloudFront is serving cached objects; the developer must create a CloudFront invalidation or use versioned file names",
      "S3 object versioning is serving old versions to users with cached URLs",
    ],
    correctIndices: [2],
    explanation:
      "CloudFront caches objects at edge locations based on TTL. Updating the origin (S3) does not automatically push new content to edges. Solutions: 1) Create a CloudFront invalidation for the changed paths (first 1,000 paths/month free). 2) Use versioned file names (e.g., app.v2.js) so new files have new URLs — no invalidation needed. S3 versioning serves the latest version by default. Bucket policies control access, not caching. CloudFront does not need redeployment.",
    optionExplanations: [
      "Incorrect. CloudFront caches objects at edge locations based on TTL; updating the S3 origin does not push new content to edges automatically. You must either invalidate the cached paths or use versioned file names (e.g., app.v2.js) so browsers and CloudFront fetch new URLs.",
      "Incorrect. S3 Object Versioning keeps multiple versions of an object but always serves the latest version by default; it does not cause CloudFront to serve old versions when the S3 object has been updated.",
      "Correct. S3 bucket policies control access permissions; if the policy were blocking CloudFront, no users would see the content at all rather than seeing a stale version.",
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
      "Use S3 Object Lock to enforce encryption on all objects",
      "Enable S3 MFA Delete to require encryption confirmation",
      "Add a bucket policy with a Deny statement for s3:PutObject when aws:SecureTransport is false or SSE header is missing",
      "Enable S3 default encryption — it automatically rejects unencrypted PUT requests",
    ],
    correctIndices: [2],
    explanation:
      "A bucket policy with Deny + condition on the absence of the x-amz-server-side-encryption header rejects PUTs that don't specify encryption. S3 default encryption encrypts objects that arrive without encryption headers — it does NOT reject unencrypted requests; it transparently applies encryption. Object Lock prevents deletion/modification but does not enforce encryption. MFA Delete requires MFA for version deletion, unrelated to encryption enforcement.",
    optionExplanations: [
      "Incorrect. A bucket policy with an explicit Deny on s3:PutObject conditioned on the absence of the x-amz-server-side-encryption request header actively rejects PUT requests that do not specify server-side encryption, enforcing the requirement at the API level.",
      "Incorrect. S3 default encryption transparently encrypts objects that arrive without encryption headers—it does not reject those requests. Objects are stored encrypted, but the absence of an SSE header does not cause the PUT to fail.",
      "Correct. S3 Object Lock enforces write-once-read-many (WORM) retention policies to prevent object deletion or overwriting; it has no mechanism to enforce the presence of encryption headers on PUT requests.",
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
      "SQS Standard queue with message group IDs",
      "SQS FIFO queue without deduplication — it handles ordering automatically",
      "SQS FIFO queue with content-based deduplication enabled",
      "SQS Standard queue with a Dead Letter Queue for deduplication",
    ],
    correctIndices: [2],
    explanation:
      "SQS FIFO queues guarantee ordering and exactly-once processing. Content-based deduplication (or explicit MessageDeduplicationId) prevents duplicate messages within a 5-minute window. Standard queues guarantee at-least-once delivery and best-effort ordering only — not suitable for strict ordering or exactly-once. Message Group IDs on Standard queues do not exist (they are a FIFO feature). DLQ handles failures, not deduplication.",
    optionExplanations: [
      "Incorrect. SQS FIFO queues guarantee that messages are processed in the exact order they are sent and provide exactly-once processing within a 5-minute deduplication window using either content-based deduplication or an explicit MessageDeduplicationId.",
      "Incorrect. SQS Standard queues guarantee at-least-once delivery with best-effort ordering only—they do not guarantee strict FIFO order, and message group IDs are a FIFO-queue concept that does not exist on Standard queues.",
      "Correct. A Dead Letter Queue (DLQ) on a Standard queue captures messages that fail processing after a configured number of attempts; it handles error scenarios but does not provide deduplication or strict ordering.",
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
      "The DeleteMessage API has a propagation delay of up to 10 seconds",
      "The visibility timeout expired before DeleteMessage was called, allowing re-delivery",
      "Nothing went wrong — the first consumer deleted the message after 25 seconds and the second consumer received a different copy that was already in flight before the delete",
      "SQS delivered the message twice due to at-least-once delivery semantics",
    ],
    correctIndices: [3],
    explanation:
      "SQS Standard queues provide at-least-once delivery — a message may be delivered more than once even if successfully processed and deleted. This is a fundamental characteristic of Standard queues. The visibility timeout (30s) was not exceeded (25s < 30s) and DeleteMessage was called before expiry, but SQS can still deliver duplicate copies that were already stored internally. Applications using Standard SQS must be idempotent. Use FIFO queues if exactly-once is required.",
    optionExplanations: [
      "Incorrect. The DeleteMessage API does not have a known propagation delay of 10 seconds; once acknowledged, the message is removed. The duplicate delivery in this scenario stems from at-least-once delivery semantics, not a delete lag.",
      "Incorrect. The visibility timeout was 30 seconds and the consumer finished and deleted the message in 25 seconds, so the timeout was not exceeded; this is not the cause of the duplicate in this scenario.",
      "Incorrect. This describes how a duplicate might manifest, but the root cause is SQS Standard at-least-once delivery semantics — the distributed backend may store multiple copies of a message, so a second copy can arrive even after the first was successfully processed and deleted.",
      "Correct. SQS Standard queues provide at-least-once delivery, meaning the same message may be stored and delivered as more than one copy in the queue's distributed backend. Even when the first consumer deleted the message before the visibility timeout expired, a duplicate copy already in flight can still be delivered to another consumer.",
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
      "SNS Delivery policies with conditional routing",
      "SNS Topic partitioning by message attribute",
      "SNS FIFO topics with message group IDs",
      "SNS Message Filtering using subscription filter policies",
    ],
    correctIndices: [3],
    explanation:
      "SNS subscription filter policies let each subscriber define which messages it wants to receive based on message attributes (e.g., eventType = 'order.cancelled'). The publisher sets a MessageAttribute on the SNS message; SNS evaluates each subscriber's filter policy and delivers only to matching subscribers. This avoids creating one topic per event type. Topic partitioning and conditional routing are not SNS concepts. FIFO topics provide ordering, not filtering by attribute.",
    optionExplanations: [
      "Incorrect. SNS subscription filter policies allow each subscriber to specify which messages it wants to receive based on message attributes (e.g., eventType = 'order.cancelled'). SNS evaluates the filter policy for each subscriber and delivers the message only to those that match, enabling event routing on a single topic without creating per-event-type topics.",
      "Incorrect. SNS does not have a concept of 'topic partitioning by message attribute'; this is not a real SNS feature. Partitioning and routing are accomplished through subscription filter policies.",
      "Incorrect. SNS delivery policies configure retry behavior and backoff for failed deliveries (e.g., to HTTP endpoints); they do not provide conditional message routing based on content or attributes.",
      "Correct. SNS FIFO topics guarantee message ordering and exactly-once delivery within a message group; message group IDs are used to sequence related messages, not to filter which subscribers receive which messages.",
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
      "SNS automatically switches to email delivery if HTTP delivery fails",
      "SNS stores failed messages internally for 14 days and retries continuously",
      "SNS retries with exponential backoff according to the delivery retry policy, then moves undeliverable messages to a Dead Letter Queue if configured",
      "SNS drops the message immediately if the HTTP endpoint returns a non-200 response",
    ],
    correctIndices: [2],
    explanation:
      "SNS has a configurable delivery retry policy for HTTP/HTTPS endpoints with up to 100,015 retries in three phases: immediate, pre-backoff, backoff (exponential), and post-backoff. After all retries are exhausted, if a Dead Letter Queue (SQS queue) is configured on the subscription, undeliverable messages are sent there. Without a DLQ, messages are permanently lost after retry exhaustion. SNS does not store failed messages internally beyond the retry window or switch delivery protocols.",
    optionExplanations: [
      "Incorrect. SNS applies an exponential backoff retry policy for HTTP/HTTPS endpoint delivery failures, retrying up to 100,015 times across immediate, pre-backoff, backoff, and post-backoff phases. After retries are exhausted, if a Dead Letter Queue (SQS) is configured on the subscription, the undeliverable message is routed there for investigation and manual reprocessing.",
      "Incorrect. SNS does not drop messages on the first non-200 response; it retries according to the configured delivery retry policy. Dropping immediately would violate the retry behavior that SNS is designed to provide.",
      "Correct. SNS does not maintain an internal 14-day message store for failed HTTP deliveries. Messages that exhaust all retry attempts are either sent to a configured DLQ or permanently discarded. The 14-day retention period is an SQS concept, not SNS.",
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
      "7 days default; up to 365 days with extended retention",
      "24 hours default; up to 365 days with extended retention",
      "3 days default; up to 30 days with extended retention",
      "24 hours default; up to 7 days with extended retention",
    ],
    correctIndices: [1],
    explanation:
      "Kinesis Data Streams retains records for 24 hours by default. Extended data retention increases this to up to 7 days at additional cost. Long-term retention (up to 365 days) is available as an additional feature. Records beyond the retention period are automatically removed. This is separate from Kinesis Firehose, which delivers to destinations and does not have an independent retention period.",
    optionExplanations: [
      "Incorrect. Kinesis Data Streams retains records for 24 hours by default. Extended data retention can be enabled to increase this up to 7 days, and long-term retention extends it further to up to 365 days at additional cost.",
      "Correct. The default retention period for Kinesis Data Streams is 24 hours, not 7 days; 7 days is actually the maximum for the standard extended retention tier, not the default.",
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
      "Process records with EMR after Firehose delivers JSON to S3",
      "Add a Kinesis Data Analytics application between the stream and Firehose",
      "Enable Firehose record format conversion using an AWS Glue Data Catalog schema",
      "Use a Lambda transformation function in Firehose to convert each record",
    ],
    correctIndices: [2],
    explanation:
      "Kinesis Data Firehose natively supports record format conversion from JSON to Apache Parquet or ORC using an AWS Glue Data Catalog schema definition — no Lambda code required. Lambda transformation is used for custom record manipulation (filtering, enrichment, masking) before delivery, not format conversion. Kinesis Data Analytics is for SQL-based stream processing, not format conversion. EMR post-processing adds latency and complexity.",
    optionExplanations: [
      "Incorrect. Kinesis Data Firehose has built-in record format conversion that uses an AWS Glue Data Catalog table schema to convert JSON records to Apache Parquet or ORC format natively, with no Lambda code required.",
      "Incorrect. Lambda data transformation in Firehose is used for custom record manipulation such as filtering, enrichment, or masking individual fields, but it does not provide built-in JSON-to-Parquet conversion; you would have to implement the Parquet serialization yourself.",
      "Correct. Kinesis Data Analytics (now Amazon Managed Service for Apache Flink) is for SQL-based or Flink-based stream processing; it does not serve as a format-conversion step between a stream and Firehose, and adding it introduces unnecessary architectural complexity.",
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
      "Configure EventBridge Schema Registry to accept inbound HTTP events",
      "Create an EventBridge Pipe from SQS to Lambda and configure the webhook to send to SQS",
      "Use EventBridge to poll the third-party service's REST API on a schedule",
      "EventBridge API Destinations to call the third-party service — but for inbound webhooks, use an API Gateway endpoint that publishes to EventBridge",
    ],
    correctIndices: [3],
    explanation:
      "For inbound webhooks (third-party → your system), the pattern is: third-party POSTs to an API Gateway endpoint → API Gateway publishes the event to EventBridge (using PutEvents) → EventBridge routes to Lambda. API Destinations are for EventBridge calling outbound to third-party APIs. EventBridge Pipes with SQS works but adds a queue hop. EventBridge does not poll third-party APIs. Schema Registry validates event schemas, not ingestion.",
    optionExplanations: [
      "Incorrect. For inbound webhooks from a third party, the correct pattern is: the third party POSTs to an API Gateway endpoint, API Gateway publishes the event to EventBridge using PutEvents, and EventBridge routes to Lambda. API Destinations are the reverse — they send EventBridge events outbound to third-party HTTP endpoints.",
      "Incorrect. An EventBridge Pipe with SQS as a source and Lambda as a target works, but it requires the third-party webhook to send to SQS rather than a direct HTTP endpoint, which many webhook providers do not support natively and adds an unnecessary queue hop.",
      "Incorrect. EventBridge cannot poll third-party REST APIs on a schedule; polling is a different pattern that would require a Lambda function or a Kinesis connector, not a native EventBridge feature.",
      "Correct. EventBridge Schema Registry discovers event schema from events published to a bus; it is not an HTTP ingestion endpoint and cannot accept inbound HTTP POST requests from external systems.",
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
      "Use API Gateway usage plans to throttle high-frequency callers",
      "Move the Lambda function to Provisioned Concurrency to reduce cold starts",
      "Enable API Gateway caching on the stage with a TTL of 300 seconds for the GET endpoint",
      "Switch to HTTP API which has lower latency than REST API",
    ],
    correctIndices: [2],
    explanation:
      "API Gateway REST API caching stores responses at the API Gateway level. With TTL=300s, the first request goes to Lambda, subsequent identical requests are served from the cache for 5 minutes. This eliminates Lambda cold starts and downstream database calls entirely for cached requests. Provisioned Concurrency reduces cold starts but does not eliminate the Lambda execution time. HTTP API does not support built-in response caching. Throttling limits traffic but does not improve latency for allowed requests.",
    optionExplanations: [
      "Incorrect. API Gateway REST API caching stores the Lambda response at the edge for the specified TTL. With a 300-second TTL matching the 5-minute data freshness requirement, repeated identical GET requests are served directly from the cache, eliminating Lambda invocations and downstream database calls entirely.",
      "Incorrect. Provisioned Concurrency keeps Lambda execution environments pre-initialized to eliminate cold starts, which reduces latency for the first invocation but still executes the full Lambda and downstream database logic on every request — it does not cache responses.",
      "Correct. HTTP APIs (v2) generally have lower overhead than REST APIs, but they do not support built-in response caching; switching to HTTP API would not eliminate the Lambda invocation latency for repeated identical requests.",
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
      "Configure the Lambda reserved concurrency to equal the array length",
      "Set MaxConcurrency on the Map state to limit parallel iterations",
      "Set MaxItems on the Map state to process a subset of elements",
      "Use a Parallel state instead of Map to control concurrency",
    ],
    correctIndices: [1],
    explanation:
      "Map state's MaxConcurrency parameter controls how many iterations run simultaneously. Setting MaxConcurrency=10 processes 10 elements at a time, preventing Lambda throttling. MaxConcurrency=0 means unlimited parallelism (all 10,000 at once — which would cause throttling). MaxItems does not exist as a Map state parameter (you'd use InputPath/Parameters to slice the array). Lambda reserved concurrency limits concurrent executions but does not control the Map state's behavior.",
    optionExplanations: [
      "Incorrect. The Map state's MaxConcurrency parameter directly controls how many iterations execute in parallel. Setting it to a value like 10 or 50 prevents all 10,000 iterations from invoking the downstream Lambda simultaneously, eliminating throttling while still processing the full array.",
      "Correct. MaxItems is not a valid Map state parameter. To process a subset of the input array you would use InputPath or Parameters to slice the data before the Map state—but this does not control parallelism; it controls the size of the input.",
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
      "Nothing — permission boundaries and identity policies cannot both be applied",
      "s3:PutObject only — permission boundaries act as a whitelist that overrides identity policies",
      "Both s3:GetObject and s3:PutObject — the identity policy is more specific",
      "Only s3:GetObject — the permission boundary limits effective permissions to the intersection",
    ],
    correctIndices: [3],
    explanation:
      "Permission boundaries set the maximum permissions a principal can have. Effective permissions are the intersection of the permission boundary and the identity policy. The boundary allows s3:GetObject only, the identity policy allows GetObject + PutObject — the intersection is s3:GetObject only. The boundary does not grant permissions on its own; it only limits. Even if the identity policy allows s3:PutObject, the boundary prevents it.",
    optionExplanations: [
      "Incorrect. Permission boundaries establish the maximum permissions a principal can have. The effective permissions are the intersection of the permission boundary and the identity policy. Since the boundary only allows s3:GetObject, even though the identity policy also grants s3:PutObject, the role can only perform s3:GetObject.",
      "Incorrect. Identity policies are not 'more specific' than permission boundaries—they serve different purposes. A permission boundary acts as a ceiling; no matter how broadly the identity policy allows actions, the boundary restricts what can actually be exercised. The identity policy cannot exceed the boundary.",
      "Incorrect. Permission boundaries and identity policies are designed to be used together. The boundary limits the maximum scope; the identity policy grants permissions within that scope. There is no rule preventing both from being attached simultaneously.",
      "Correct. The permission boundary does not act as a whitelist that overrides identity policies in the sense of granting permissions on its own. A boundary only restricts—it cannot grant permissions that the identity policy doesn't also allow. s3:PutObject is not in the boundary, so it cannot be used regardless of what the identity policy says.",
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
      "The condition has no effect on global AWS services like IAM and S3",
      "The request is denied — the condition prevents actions outside us-east-1",
      "The request is denied only if the attacker uses the console",
      "The request succeeds — conditions only apply to console access, not API calls",
    ],
    correctIndices: [1],
    explanation:
      "aws:RequestedRegion is a global condition key that restricts which AWS region the API call can target. When set to us-east-1 in a Deny or as a condition on an Allow, any API call to eu-west-1 will be denied. This works for all API calls and all access methods (console, CLI, SDK). Note: global services like IAM always route to us-east-1 regardless of the region specified, so regional restrictions may not apply to IAM actions.",
    optionExplanations: [
      "Incorrect. aws:RequestedRegion is a global IAM condition key that evaluates the region targeted by the API call. When used in a Deny statement (or as a condition on an Allow), any API call targeting a region other than us-east-1—including API calls made via CLI, SDK, or console—will be denied.",
      "Correct. IAM condition keys apply to all access methods equally: console, CLI, and SDK. There is no distinction between console access and API access for condition evaluation—all requests go through the same IAM policy evaluation engine.",
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
      "An IAM groups policy with a Deny on s3:DeleteBucket",
      "A resource-based bucket policy with an explicit Deny on s3:DeleteBucket for all principals",
      "An IAM permission boundary applied to all users",
      "An SCP that denies s3:DeleteBucket for the specific bucket ARN",
    ],
    correctIndices: [1],
    explanation:
      "An explicit Deny in a resource-based policy (S3 bucket policy) that targets all principals (Principal: '*') with a Deny on s3:DeleteBucket wins over any identity-based policy that allows it. Explicit Deny always takes precedence. SCPs operate at the account level and apply account-wide to all principals — they cannot be scoped to protect a single specific resource. Permission boundaries must be attached individually to each principal. IAM group policies apply to group members only — not all users, and can be overridden by explicit Deny.",
    optionExplanations: [
      "Incorrect. An explicit Deny in a resource-based policy (S3 bucket policy) with Principal: '*' applies to all principals, including those with identity policies that would otherwise allow the action. Explicit Deny always takes precedence over any Allow in IAM policy evaluation, making this the most reliable way to protect a specific resource.",
      "Correct. While SCPs can include resource ARN conditions in their policy statements, they apply account-wide to all principals in the account — they cannot selectively protect a single S3 bucket without also restricting access to all other S3 buckets for the entire account. A resource-based bucket policy is the targeted, resource-scoped solution.",
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
      "Pre Authentication trigger",
      "Post Confirmation trigger",
      "Post Authentication trigger",
      "Pre Token Generation trigger",
    ],
    correctIndices: [3],
    explanation:
      "The Pre Token Generation Lambda trigger fires before Cognito issues ID and access tokens and allows you to add, suppress, or modify token claims. For example, you can add a custom 'role' claim based on database lookup. Post Authentication fires after sign-in but cannot modify tokens. Pre Authentication validates conditions before authentication proceeds. Post Confirmation fires after a user confirms registration — tokens haven't been issued yet.",
    optionExplanations: [
      "Incorrect. The Pre Token Generation Lambda trigger fires just before Cognito issues ID and access tokens. It receives the token claims and can add, modify, or suppress claims in the response—allowing you to inject custom attributes (like a 'role' or 'tenantId') from an external database into every token.",
      "Incorrect. Post Authentication fires after a user successfully authenticates but before tokens are issued. It is used for tasks like logging sign-in events or recording analytics—it cannot modify the token claims because tokens have not been generated yet at that point.",
      "Incorrect. Pre Authentication fires before Cognito validates the user's credentials. It can be used to block sign-in attempts based on custom logic (e.g., check if the user's account is suspended), but it runs before authentication is complete and cannot modify tokens.",
      "Correct. Post Confirmation fires after a user confirms their registration (e.g., verifies their email). At this point the user has not yet signed in, so no tokens are being issued. This trigger is typically used to set up user data in a database after registration.",
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
      "200 OK — API Gateway does not check token expiry",
      "403 Forbidden — expired tokens are treated as invalid permissions",
      "The request is redirected to Cognito for re-authentication automatically",
      "401 Unauthorized — the token signature validates but the exp claim is in the past",
    ],
    correctIndices: [3],
    explanation:
      "API Gateway's Cognito authorizer validates the JWT including the expiry (exp) claim. An expired token fails validation and returns 401 Unauthorized. The client must use the refresh token to obtain a new access/ID token pair from Cognito and retry. API Gateway does not automatically redirect for re-authentication. 403 would indicate valid authentication but insufficient permissions. The authorizer always checks token expiry.",
    optionExplanations: [
      "Incorrect. API Gateway's Cognito authorizer validates JWT signatures and all standard claims including the expiry (exp) claim. When the exp timestamp is in the past, the token fails validation and API Gateway returns HTTP 401 Unauthorized. The client must use its refresh token to obtain a new access token from Cognito before retrying.",
      "Incorrect. HTTP 403 Forbidden indicates that the request is authenticated (the identity is known) but the caller lacks permission to perform the action. An expired token fails authentication entirely, which maps to 401 Unauthorized, not 403 Forbidden.",
      "Incorrect. API Gateway always validates the JWT expiry when using a Cognito authorizer. Serving a 200 OK response with an expired token would be a significant security flaw. The authorizer is specifically designed to enforce token validity including expiration.",
      "Correct. API Gateway does not perform automatic redirects for re-authentication. It is a stateless API layer that simply validates the token and returns 401 if validation fails. Re-authentication and token refresh are the responsibility of the client application using the Cognito SDK.",
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
      "Decryption succeeds but the returned data is corrupted",
      "Decryption succeeds — encryption context is optional and not validated on decrypt",
      "KMS prompts the user to provide the encryption context interactively",
      "Decryption fails with InvalidCiphertextException — the encryption context must match exactly",
    ],
    correctIndices: [3],
    explanation:
      "Encryption context is additional authenticated data (AAD) bound to the ciphertext. KMS requires the exact same encryption context on Decrypt that was used on Encrypt. If context is missing or different, KMS returns InvalidCiphertextException. This prevents decryption of ciphertext in a different context than intended (e.g., using a payment ciphertext in a different application). Encryption context is not stored by KMS — the caller must provide it consistently.",
    optionExplanations: [
      "Incorrect. Encryption context is additional authenticated data (AAD) that is cryptographically bound to the ciphertext. KMS requires the exact same key-value pairs during Decrypt that were provided during Encrypt. Omitting the context (or providing different values) causes KMS to return InvalidCiphertextException — the decryption is rejected.",
      "Incorrect. Encryption context is not optional at decrypt time when it was used at encrypt time. KMS enforces that the same context is provided on both operations. Omitting it at decryption is treated as a mismatch and the call fails.",
      "Incorrect. KMS does not return corrupted data — the decryption either succeeds with valid plaintext or fails with an exception. If the encryption context does not match, KMS refuses the operation entirely and returns InvalidCiphertextException rather than returning garbled output.",
      "Correct. KMS is an API-driven service and has no interactive prompting capability. The encryption context must be provided programmatically by the application code making the API call. There is no mechanism for KMS to ask the caller for missing parameters at runtime.",
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
      "aws:SourceArn with the S3 bucket ARN",
      "kms:ViaService with value s3.us-east-1.amazonaws.com",
      "aws:RequestedRegion with us-east-1",
      "kms:EncryptionAlgorithm with AES-256 restriction",
    ],
    correctIndices: [1],
    explanation:
      "kms:ViaService restricts key usage to calls made by a specific AWS service on your behalf. Setting kms:ViaService to 's3.us-east-1.amazonaws.com' ensures only S3 in us-east-1 can use the key. Direct application calls to KMS would be denied. aws:SourceArn restricts based on the requesting resource ARN (useful for cross-service scenarios but not for service-level restriction). EncryptionAlgorithm restricts the algorithm used. RequestedRegion restricts where the KMS API call goes, not which service invokes it.",
    optionExplanations: [
      "Incorrect. The kms:ViaService condition key in the KMS key policy restricts usage to calls that originate from a specific AWS service acting on your behalf. Setting it to 's3.us-east-1.amazonaws.com' ensures only S3 in us-east-1 can invoke KMS using this key; direct application calls to KMS or calls from other services are denied.",
      "Correct. aws:SourceArn identifies the ARN of the specific resource (e.g., a specific S3 bucket or Lambda function) that is making the request in certain cross-service scenarios. It does not restrict key usage to a particular service type, and it is not the appropriate condition key for service-level restrictions.",
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
    options: ["AWSROTATING", "AWSCURRENT", "AWSPREVIOUS", "AWSPENDING"],
    correctIndices: [3],
    explanation:
      "During rotation, the rotation Lambda creates new credentials tagged with AWSPENDING. After setting and testing the new credentials, the finishSecret phase moves AWSPENDING to AWSCURRENT and the old AWSCURRENT to AWSPREVIOUS. Applications should always request AWSCURRENT (the default) to get active credentials. AWSROTATING does not exist as a staging label.",
    optionExplanations: [
      "Incorrect. During rotation, the rotation Lambda function creates the new secret value and tags it with the AWSPENDING staging label. The rotation process then tests the new credentials while AWSCURRENT still holds the active credentials. Only after successful testing does the finishSecret phase promote AWSPENDING to AWSCURRENT and demote the old AWSCURRENT to AWSPREVIOUS.",
      "Incorrect. AWSCURRENT is the staging label for the currently active, production-ready secret value. Applications retrieve AWSCURRENT (the default) to get the credentials currently in use. During rotation, AWSCURRENT continues to hold the old credentials until the new ones are verified and promoted.",
      "Incorrect. AWSPREVIOUS is the label applied to the previously active secret after a successful rotation completes — it is the 'old' version retained for a grace period in case the application still holds a cached reference to it. It is not used for the secret being created during rotation.",
      "Correct. AWSROTATING is not a valid staging label in AWS Secrets Manager. The three valid staging labels used during the rotation lifecycle are AWSPENDING (new, being tested), AWSCURRENT (active), and AWSPREVIOUS (recently replaced).",
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
      "The container's application code — it must authenticate separately",
      "The ECS task role — it provides all permissions the container needs",
      "The ECS cluster service role — it manages the underlying Fargate infrastructure",
      "The ECS task execution role — it handles ECR authentication and CloudWatch Logs creation",
    ],
    correctIndices: [3],
    explanation:
      "The ECS task execution role is used by the ECS agent (not the application) for infrastructure operations: pulling images from ECR, creating CloudWatch log groups, and fetching secrets from Secrets Manager/SSM at task startup. The task role is what the application code inside the container uses to call AWS services (DynamoDB, S3, etc.). These are two separate IAM roles with different purposes. The cluster service role manages EC2 instances in EC2 launch type, not Fargate.",
    optionExplanations: [
      "Incorrect. The ECS task execution role is the IAM role assumed by the ECS agent (not the application) to perform infrastructure-level operations on behalf of the task: pulling container images from ECR (ecr:GetAuthorizationToken, ecr:BatchGetImage), creating CloudWatch log groups (logs:CreateLogGroup, logs:PutLogEvents), and fetching secrets from Secrets Manager or SSM at startup. It must be granted the AmazonECSTaskExecutionRolePolicy managed policy at minimum.",
      "Incorrect. The ECS task role is the IAM role assumed by the application code running inside the container to call AWS services such as DynamoDB, S3, SQS, or KMS. It is separate from the execution role and is only used after the container has started. The task role does not handle ECR authentication or CloudWatch Logs creation.",
      "Incorrect. The ECS cluster service role (ecsServiceRole or AmazonECSServiceRolePolicy) is used for the ECS service to manage resources like Elastic Load Balancers and register/deregister container instances. It is used with the EC2 launch type for managing the underlying instances, not for pulling images or logging in the Fargate launch type.",
      "Correct. In the Fargate launch type, the application code inside the container does not authenticate separately to ECR to pull the image — the container image is pulled before the application code runs. The ECS agent handles this using the task execution role, transparently and before the container process starts.",
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
      "ECS Cluster Auto Scaling triggered directly by SQS queue depth",
      "Application Load Balancer target tracking scaling based on request count",
      "ECS Service Auto Scaling with a custom CloudWatch metric (ApproximateNumberOfMessagesVisible) and step scaling policy",
      "Lambda function that calls UpdateService to change desired count based on SQS metrics",
    ],
    correctIndices: [2],
    explanation:
      "ECS Service Auto Scaling supports custom CloudWatch metrics. SQS publishes ApproximateNumberOfMessagesVisible as a CloudWatch metric. A step scaling policy can scale ECS tasks out when the metric exceeds 1,000 and scale in when below 100. ECS Cluster Auto Scaling scales EC2 instances (not tasks) and cannot directly trigger on SQS metrics. A Lambda workaround is possible but less efficient. ALB target tracking is for request-based metrics, not SQS queue depth.",
    optionExplanations: [
      "Incorrect. ECS Service Auto Scaling integrates with Application Auto Scaling and supports custom CloudWatch metrics as scaling triggers. SQS automatically publishes ApproximateNumberOfMessagesVisible to CloudWatch every minute. A step scaling policy can be configured to add tasks when the metric exceeds 1,000 and remove tasks when it drops below 100, providing precise threshold-based scaling driven by queue depth.",
      "Incorrect. ECS Cluster Auto Scaling manages the capacity of the underlying EC2 instances in the cluster (for the EC2 launch type) using Capacity Providers. It does not directly scale the number of ECS tasks, and it cannot be triggered directly by SQS queue depth metrics. Task scaling and cluster (instance) scaling are separate concerns.",
      "Correct. Writing a Lambda function to call ECS UpdateService is a custom workaround that duplicates functionality built into ECS Service Auto Scaling. It adds operational overhead (Lambda management, error handling, invocation scheduling) and is less reliable than the native auto scaling integration, which handles cooldown periods, scale-in protection, and CloudWatch alarm evaluation automatically.",
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
      "Secrets Manager with auto-rotation — store the password in Secrets Manager",
      "AWS Certificate Manager — use TLS client certificates for authentication",
      "SSM Parameter Store SecureString — store and retrieve the password at runtime",
      "IAM Database Authentication — generate an auth token using the IAM role and use it as the password",
    ],
    correctIndices: [3],
    explanation:
      "IAM Database Authentication allows Lambda to authenticate to RDS using the Lambda execution role's IAM credentials. The SDK generates a temporary authentication token (valid 15 minutes) using the role's credentials, and the token is used as the database password. No stored passwords. Secrets Manager still stores a password (it rotates it, but there is a stored secret). ACM certificates are for TLS transport, not database login. SSM SecureString still stores a password — just encrypted.",
    optionExplanations: [
      "Incorrect. IAM Database Authentication allows the Lambda execution role to generate a temporary database authentication token (using rds:connect IAM permission and the GenerateDBAuthToken SDK call). The token is valid for 15 minutes, is used as the database password, and requires no stored credentials anywhere. This is supported for MySQL and PostgreSQL on RDS and Aurora.",
      "Incorrect. Secrets Manager is an excellent secret management solution, but it still stores a database password (rotated automatically) as a secret value. Retrieving the secret at runtime avoids hardcoded credentials, but there is a stored credential — just encrypted and managed by Secrets Manager. It does not fully eliminate stored passwords the way IAM auth does.",
      "Incorrect. AWS Certificate Manager (ACM) is used for TLS/SSL certificates to encrypt data in transit between the application and RDS using SSL/TLS. TLS client certificates are for transport-layer mutual authentication (mTLS), not for database login authentication. ACM does not provide database credentials.",
      "Correct. SSM Parameter Store SecureString encrypts the stored value using KMS and allows retrieval at runtime, which avoids embedding credentials in application code. However, a plaintext password still exists — it is stored encrypted in SSM. This does not eliminate stored database passwords; it only encrypts where they are stored.",
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
      "Memory metrics are only available for instances using the Nitro hypervisor",
      "EC2 does not publish memory metrics by default; install the CloudWatch Agent on each instance to collect and publish memory metrics",
      "Memory metrics require CloudWatch detailed monitoring to be enabled on the EC2 instance",
      "Memory metrics must be viewed in AWS Cost Explorer, not CloudWatch",
    ],
    correctIndices: [1],
    explanation:
      "EC2 publishes hypervisor-level metrics to CloudWatch by default (CPU, network, disk I/O) but cannot access OS-level metrics like memory utilization from outside the VM. The CloudWatch Agent runs inside the EC2 instance and can collect memory utilization, swap, disk space, and application-level metrics, publishing them to a custom namespace (CWAgent). Detailed monitoring increases sampling frequency for existing metrics from 5-min to 1-min but does not add memory metrics.",
    optionExplanations: [
      "Incorrect. EC2 cannot publish OS-level metrics (memory, swap, disk usage) because they are inside the VM; the CloudWatch Agent must be installed and configured on each instance to collect and publish those metrics to a custom CWAgent namespace.",
      "Correct. Detailed monitoring increases the sampling frequency of existing hypervisor-level metrics (CPU, network, disk I/O) from 5-minute to 1-minute intervals but does not add any new metric types such as memory utilization.",
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
      "Set the alarm threshold higher so brief spikes don't trigger it",
      "Increase the Lambda timeout to prevent transient errors from being reported",
      "Use a CloudWatch Composite Alarm combining two error metrics with AND logic",
      "Set evaluation period to 5 periods of 1 minute with 'datapoints to alarm' = 3 of 5, so errors must persist across 3 consecutive periods",
    ],
    correctIndices: [3],
    explanation:
      "The 'M of N' (datapoints to alarm) configuration prevents transient spikes from triggering alarms. By requiring 3 of 5 consecutive 1-minute periods to breach the threshold, a brief 1-minute spike will not trigger the alarm — it needs to persist for at least 3 minutes. Increasing timeout reduces actual errors but doesn't fix alarm sensitivity. Composite alarms combine independent alarm states. Raising the threshold may miss real errors.",
    optionExplanations: [
      "Incorrect. The 'M of N' datapoints-to-alarm setting (e.g., 3 of 5 consecutive 1-minute periods) requires the threshold to be breached persistently before alerting, so a single brief spike that resolves within one period does not trigger the alarm.",
      "Incorrect. Increasing the Lambda timeout reduces the likelihood of timeout errors but does not change how the CloudWatch Alarm evaluates the error rate metric; transient spikes unrelated to timeouts would still trigger a sensitive alarm.",
      "Incorrect. A Composite Alarm ANDs or ORs the states of other independent alarms; it does not add temporal smoothing to a single metric and would not prevent a false positive caused by a one-period spike.",
      "Correct. Raising the threshold means more errors must occur before the alarm fires, but a high spike could still breach a higher threshold in a single period; this trades false positives for missed real incidents rather than filtering transient noise.",
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
      "The service has high latency but no errors",
      "The service is receiving throttled requests (429)",
      "The X-Ray daemon cannot connect to the service",
      "The service is experiencing faults (5xx errors) — server-side errors",
    ],
    correctIndices: [3],
    explanation:
      "X-Ray service map color coding: Green = healthy (no errors above threshold), Yellow = errors (4xx client errors or throttling), Orange = throttle (429 Too Many Requests), Red = fault (5xx server errors). A red node indicates the service is generating server-side errors. Click the node to see detailed trace data showing which requests failed and why.",
    optionExplanations: [
      "Incorrect. X-Ray color codes service map nodes as: green (healthy), yellow (4xx client errors), orange (429 throttle), and red (5xx fault/server errors); a red node indicates the service is returning server-side faults.",
      "Incorrect. High latency without errors is represented in X-Ray by response-time percentile data on the node's tooltip; the node color does not turn red for latency alone — it turns red only when 5xx faults are present.",
      "Incorrect. Throttled requests (HTTP 429 Too Many Requests) are represented in X-Ray with an orange color code, not red; orange specifically indicates throttling, which is a separate category from faults.",
      "Correct. If the X-Ray daemon cannot connect to the service, that would appear as a gap or missing segment in the trace, not as a red node; a red node means the service itself is generating 5xx responses.",
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
      "Create an S3 VPC Interface Endpoint (PrivateLink) — private connectivity to S3",
      "Use S3 Transfer Acceleration for direct private connectivity",
      "Add a NAT Gateway in the private subnet to enable S3 access",
      "Create an S3 VPC Gateway Endpoint — traffic routes through the endpoint for free",
    ],
    correctIndices: [3],
    explanation:
      "S3 Gateway Endpoints are free — add the endpoint to the route table and Lambda traffic to S3 routes through the AWS backbone without internet or NAT. Gateway endpoints are available for S3 and DynamoDB only. Interface endpoints (PrivateLink) work for most other services but cost hourly + per-GB data charges. NAT Gateway costs $0.045/hour plus data transfer. S3 Transfer Acceleration is for faster uploads over the internet, not private VPC access.",
    optionExplanations: [
      "Incorrect. S3 Gateway Endpoints are free to create and use; adding one to the VPC route table redirects S3-bound traffic through the AWS backbone without requiring a NAT Gateway, eliminating both NAT Gateway hourly charges and per-GB data transfer costs.",
      "Incorrect. S3 Interface Endpoints (PrivateLink) provide private DNS resolution for S3 within the VPC but incur an hourly charge (~$0.01/hr per AZ) plus per-GB data processing fees, making them more expensive than the free Gateway Endpoint for S3.",
      "Incorrect. A NAT Gateway placed in a private subnet would not provide internet access (NAT Gateways must be in public subnets with an internet gateway); additionally, using NAT for S3 access incurs per-GB data transfer charges that can be avoided with a Gateway Endpoint.",
      "Correct. S3 Transfer Acceleration uses CloudFront edge locations to accelerate uploads and downloads over the public internet; it does not provide private VPC connectivity and incurs additional per-GB charges on top of standard S3 rates.",
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
      "AWS Config — records security group rule changes and network ACL events",
      "VPC Flow Logs — captures all IP traffic with ACCEPT/REJECT action fields",
      "CloudTrail — logs all API calls including network traffic events",
      "Security Group flow logs — capture traffic allowed by security groups",
    ],
    correctIndices: [1],
    explanation:
      "VPC Flow Logs capture metadata about IP traffic flowing through network interfaces, subnets, or the entire VPC. Each log record includes srcaddr, dstaddr, ports, protocol, and an action field with ACCEPT or REJECT. REJECT entries show traffic that was denied by security groups or NACLs. CloudTrail logs API calls, not network traffic. Security groups don't have independent flow logs. AWS Config tracks configuration changes, not traffic.",
    optionExplanations: [
      "Incorrect. VPC Flow Logs capture metadata for all IP traffic at the ENI, subnet, or VPC level, including an 'action' field that shows ACCEPT for traffic allowed by security groups/NACLs and REJECT for traffic denied — both types are recorded.",
      "Correct. AWS CloudTrail logs API calls made to AWS service control planes (e.g., ec2:RunInstances, s3:PutObject); it does not capture network-level IP traffic flowing through EC2 instance network interfaces.",
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
      "Block all public access on S3 and use signed cookies for all requests",
      "Use Origin Access Identity (OAI) — create an OAI and attach it to the distribution",
      "Enable S3 bucket versioning and restrict access by version ID",
      "Use Origin Access Control (OAC) — update the S3 bucket policy to allow only the CloudFront service principal",
    ],
    correctIndices: [3],
    explanation:
      "Origin Access Control (OAC) is the current recommended method (replacing OAI) for restricting S3 bucket access to CloudFront. OAC supports all S3 regions, AWS Signature Version 4, and SSE-KMS encrypted buckets. The S3 bucket policy grants access to the CloudFront service principal with a condition on the specific distribution. OAI (Origin Access Identity) still works but is the legacy approach and has limitations with SSE-KMS. Signed cookies control user access to content but don't restrict origin access.",
    optionExplanations: [
      "Incorrect. Origin Access Control (OAC) is the current AWS-recommended replacement for OAI; it uses AWS Signature Version 4 signing and supports SSE-KMS encrypted S3 buckets and all AWS regions, with the S3 bucket policy granting access only to the CloudFront service principal.",
      "Incorrect. Origin Access Identity (OAI) is the legacy approach that CloudFront used before OAC was introduced; it has limitations including no support for SSE-KMS encrypted S3 buckets and some newer S3 regions, so AWS now recommends OAC instead.",
      "Incorrect. S3 bucket versioning stores multiple versions of an object for recovery purposes but does not restrict who can access current objects; it does not prevent direct S3 access bypassing CloudFront.",
      "Correct. Signed cookies control which authenticated users can access CloudFront-distributed content; they restrict user access at the CDN edge but do not prevent direct requests to the S3 origin URL from bypassing CloudFront entirely.",
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
      "API Gateway integration — add headers in the Lambda function response",
      "CloudFront response headers policy — configure security headers in distribution settings",
      "CloudFront Functions at the viewer response event — lightweight JavaScript runs in under 1ms",
      "Lambda@Edge at the origin response event — add headers from the Lambda runtime",
    ],
    correctIndices: [1],
    explanation:
      "CloudFront Response Headers Policies are the simplest and most efficient solution for adding security headers. You configure standard headers (HSTS, X-Content-Type-Options, X-Frame-Options, CSP, etc.) directly in CloudFront distribution settings — no code required. CloudFront adds them to every response. CloudFront Functions can also do this but require JavaScript code. Lambda@Edge adds more latency and cost. API Gateway is the origin, not the CDN edge.",
    optionExplanations: [
      "Incorrect. CloudFront Functions run lightweight JavaScript at the viewer request/response events and can add headers, but for simply adding standard security headers, a Response Headers Policy requires no code at all and is the simpler solution.",
      "Correct. Lambda@Edge can add headers at the origin response event but runs in a full Lambda runtime, adding milliseconds of latency and cost; it is better suited for complex logic that CloudFront Functions or Response Headers Policies cannot handle.",
      "Incorrect. CloudFront Response Headers Policies let you configure standard security headers (HSTS, X-Content-Type-Options, X-Frame-Options, Content Security Policy, etc.) directly in distribution settings with no code; CloudFront automatically appends them to every response.",
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
      "Enhanced networking — Docker builds require higher network throughput",
      "Privileged mode in the build environment — required to run Docker daemon inside CodeBuild",
      "VPC mode — Docker requires a VPC endpoint to pull base images",
      "Docker Hub credentials in the CodeBuild environment variables",
    ],
    correctIndices: [1],
    explanation:
      "CodeBuild runs builds inside containers. To run Docker commands inside a build (Docker-in-Docker), the build container needs elevated privileges. Enabling 'Privileged mode' in the build environment configuration grants the necessary privileges to run the Docker daemon. Without it, Docker commands fail. VPC mode is for accessing private resources. Enhanced networking is an EC2 feature. Docker Hub credentials are needed for pulling private images, not for running the daemon.",
    optionExplanations: [
      "Incorrect. Running Docker commands inside a CodeBuild container requires 'Docker-in-Docker' capability; enabling Privileged mode grants the build container elevated Linux capabilities needed to run the Docker daemon.",
      "Correct. VPC mode connects the CodeBuild build environment to resources in a private VPC (like RDS or ElastiCache); it is not required to run Docker commands and would not fix a 'Cannot connect to Docker daemon' error.",
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
      "The Lambda function exceeded its 15-minute timeout and CodePipeline is retrying",
      "The Lambda function needs to publish a CloudWatch event when it completes",
      "CodePipeline has a bug and is not checking the Lambda function status",
      "The Lambda function has not called PutJobSuccessResult or PutJobFailureResult to signal completion back to CodePipeline",
    ],
    correctIndices: [3],
    explanation:
      "When CodePipeline invokes a Lambda function as an action, the pipeline waits for the Lambda to call either PutJobSuccessResult or PutJobFailureResult with the job ID it received. If neither is called, the pipeline hangs until the action timeout (default 1 hour). This is a common mistake — developers forget to signal completion. If Lambda times out at 15 minutes, CodePipeline would eventually time out the action, but the symptom described (still waiting at 20 minutes) points to missing signal.",
    optionExplanations: [
      "Incorrect. When CodePipeline invokes a Lambda function as an action, the pipeline waits indefinitely for the Lambda to call PutJobSuccessResult or PutJobFailureResult with the job ID; forgetting to call either method causes the pipeline to hang until the action timeout.",
      "Incorrect. CodePipeline actively polls for the Lambda completion signal via the CodePipeline service; there is no bug causing it to ignore Lambda status — the pipeline is working correctly by waiting for the signal it expects.",
      "Incorrect. If the Lambda function itself timed out at its 15-minute execution timeout, Lambda would have already called back to CodePipeline with an error; the pipeline would show a failure, not a 20-minute wait with no response.",
      "Correct. CloudWatch Events are not used to signal CodePipeline from a Lambda action; the only mechanism for a Lambda action to communicate success or failure to CodePipeline is via PutJobSuccessResult or PutJobFailureResult.",
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
      "sam sync uses CloudFormation change sets for safer deployments than sam deploy",
      "sam sync provides a local preview of changes before they go to AWS",
      "sam sync automatically runs tests before syncing code changes",
      "sam sync bypasses CloudFormation for code-only changes, updating the Lambda function directly in seconds instead of minutes",
    ],
    correctIndices: [3],
    explanation:
      "sam sync --watch watches for file changes and syncs Lambda code directly using the Lambda UpdateFunctionCode API, bypassing the full CloudFormation stack update cycle. This reduces deployment time from 2-3 minutes (CloudFormation) to a few seconds. For infrastructure changes (new resources, IAM policies), sam sync still uses CloudFormation. This dramatically speeds up the inner development loop. It does not run tests or provide local preview — that's sam local.",
    optionExplanations: [
      "Incorrect. sam sync --watch detects Lambda code changes and updates the function directly via the Lambda UpdateFunctionCode API, bypassing the CloudFormation stack update cycle and reducing deployment time from minutes to seconds.",
      "Incorrect. sam sync does not use CloudFormation change sets for code-only changes; it bypasses CloudFormation entirely for Lambda code updates to achieve faster iteration (change sets are used by sam deploy for infrastructure changes).",
      "Incorrect. sam sync --watch does not run tests before syncing; running tests is the developer's responsibility or can be integrated into a CI script — sam sync is purely a code synchronization tool.",
      "Correct. sam sync --watch does not provide a local preview; local previews and testing are handled by sam local, which runs Lambda functions in a Docker container without deploying to AWS.",
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
      "Use a CloudFormation Custom Resource to generate and store the password",
      "Dynamic reference: {{resolve:secretsmanager:MyDBSecret:SecretString:password}}",
      "Reference an SSM SecureString parameter using {{resolve:ssm-secure:/db/password}}",
      "Pass the password as a CloudFormation Parameter with NoEcho: true",
    ],
    correctIndices: [1],
    explanation:
      "CloudFormation dynamic references resolve values from Secrets Manager at deployment time without exposing the value in the template. The syntax {{resolve:secretsmanager:SecretName:SecretString:jsonKey}} fetches the password field from the secret. The value is never visible in CloudFormation events or the console. NoEcho parameters hide values in the console but require passing the password at deployment time. Custom Resources add complexity. SSM SecureString dynamic references also work but Secrets Manager is preferred for database passwords (auto-rotation support).",
    optionExplanations: [
      "Incorrect. The {{resolve:secretsmanager:SecretName:SecretString:jsonKey}} dynamic reference causes CloudFormation to fetch the secret value from Secrets Manager at deployment time and inject it directly into the resource property without ever exposing it in the template or CloudFormation events.",
      "Correct. A CloudFormation Parameter with NoEcho: true prevents the value from appearing in the console but still requires the developer to manually pass the password at each deployment; it does not integrate with Secrets Manager and does not avoid storing the password externally.",
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
      "new iam.ManagedPolicy(this, 'S3Policy', { statements: [...] })",
      "bucket.grantReadWrite(lambdaFunction) — CDK automatically creates the IAM policy",
      "lambdaFunction.addToRolePolicy(new iam.PolicyStatement({...})) with S3 actions",
      "lambdaFunction.addEnvironment('BUCKET_ARN', bucket.bucketArn) to pass the ARN",
    ],
    correctIndices: [1],
    explanation:
      "CDK L2 constructs provide grant*() methods that automatically create least-privilege IAM policy statements. bucket.grantReadWrite(lambdaFunction) adds GetObject and PutObject (and ListBucket) to the Lambda execution role — no manual IAM JSON required. addToRolePolicy works but requires writing the IAM statement manually. addEnvironment passes the ARN as a variable but doesn't grant permissions. Creating a ManagedPolicy manually is verbose and defeats the purpose of CDK abstractions.",
    optionExplanations: [
      "Incorrect. CDK L2 constructs expose grant*() methods (grantRead, grantWrite, grantReadWrite, etc.) that automatically construct least-privilege IAM policy statements and attach them to the grantee's execution role — no manual IAM JSON required.",
      "Correct. lambdaFunction.addToRolePolicy() works but requires manually writing the IAM PolicyStatement with all action strings and resource ARNs; this is verbose and more error-prone than using the built-in grant methods.",
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
      "Add the script to the application's Procfile so Beanstalk runs it at startup",
      "Add a .ebextensions config file with a 'commands' or 'container_commands' section specifying the script",
      "Configure the script in the Beanstalk environment's 'Custom Platform' settings",
      "Use a CodeDeploy lifecycle hook triggered by Beanstalk deployment",
    ],
    correctIndices: [1],
    explanation:
      ".ebextensions configuration files (YAML/JSON with .config extension) in your application bundle allow customizing the Elastic Beanstalk environment. 'commands' run before the application is installed; 'container_commands' run after the application files are extracted (with access to application source). They run as root. The Procfile defines application processes (like a web server). CodeDeploy is a separate service. Custom Platforms are for building custom AMIs, not running scripts during app deployment.",
    optionExplanations: [
      "Incorrect. .ebextensions config files (YAML with .config extension) placed in the .ebextensions/ directory of the application bundle allow running shell commands during deployment; 'container_commands' run after application files are extracted with access to the new source code.",
      "Correct. The Procfile defines the commands Beanstalk uses to start application processes (like a web server or worker); it runs after deployment is complete during the application start phase and cannot be used to run scripts during the deployment process itself.",
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
      "Enable AppSync caching and scope cache keys to the user's access token",
      "In the resolver, use $ctx.identity.sub (the user's Cognito UUID) as a filter condition in the DynamoDB query",
      "Configure AppSync field-level authorization with @aws_auth to hide other users' records",
      "Create separate AppSync APIs for each user",
    ],
    correctIndices: [1],
    explanation:
      "When Cognito User Pools is the auth mode, $ctx.identity contains the authenticated user's claims including sub (Cognito UUID), username, and groups. In the resolver, use $ctx.identity.sub as a filter or key condition to restrict DynamoDB queries to the current user's data. @aws_auth controls which auth modes can access a type/field — it doesn't filter data by user. Separate APIs per user is unscalable. Caching doesn't handle authorization.",
    optionExplanations: [
      "Incorrect. When Cognito User Pools is the auth mode, $ctx.identity.sub contains the authenticated user's immutable Cognito UUID; using it as a filter or key condition in the DynamoDB resolver ensures each user only retrieves their own records.",
      "Correct. @aws_auth (or @aws_cognito_user_pools) is a GraphQL directive that controls which authentication modes can access a field or type; it does not filter query results by the current user's identity — it only controls who can call the field at all.",
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
      "AppSync subscriptions require HTTP polling to receive events — WebSocket is not supported",
      "The client's Cognito token expired and WebSocket was silently disconnected",
      "The subscription field arguments do not match the mutation's return values — AppSync filters out non-matching events",
      "The Lambda resolver for the subscription is not returning data",
    ],
    correctIndices: [2],
    explanation:
      "AppSync subscription filtering: if a subscription specifies arguments (e.g., onCreateTodo(owner: \"alice\")), AppSync only delivers events where the mutation result matches those arguments. If the mutation returns data that doesn't match the subscription filter, the event is silently dropped. This is a common source of 'no events received' bugs. AppSync uses WebSocket (not polling). Token expiry would disconnect the WebSocket (client would receive a disconnect event). Subscriptions don't have their own Lambda resolver — they piggyback on mutations.",
    optionExplanations: [
      "Incorrect. AppSync evaluates subscription arguments against the mutation's return data; if the subscription filter arguments do not match the mutation's result fields (e.g., different owner value), the event is silently dropped and the client receives nothing.",
      "Incorrect. AppSync subscriptions use WebSocket connections (over MQTT or HTTP/2) for real-time event delivery; HTTP polling is not used and is not supported as an alternative for AppSync subscriptions.",
      "Correct. While a Cognito token expiry would cause the WebSocket to disconnect, the client would typically receive a disconnect notification or error; the question describes receiving no events while the mutation succeeds, which points to filtering, not disconnection.",
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
      "SSM State Manager — continuously applies the script as desired state",
      "SSM Run Command — executes commands on EC2 instances via the SSM Agent without SSH",
      "SSM Patch Manager — deploys configuration files as patches",
      "SSM Session Manager — opens a shell session to each instance for the script",
    ],
    correctIndices: [1],
    explanation:
      "SSM Run Command executes shell scripts or PowerShell on multiple EC2 instances simultaneously without opening SSH ports. Target instances by tag, instance ID, or resource group. Results (stdout, stderr, exit codes) are logged to S3 or CloudWatch Logs. The SSM Agent on each instance handles the request securely. Session Manager opens interactive sessions (one at a time per session). Patch Manager handles OS patches. State Manager enforces ongoing desired state (periodic, not one-time).",
    optionExplanations: [
      "Incorrect. SSM Run Command executes shell scripts or AWS Systems Manager documents on multiple EC2 instances simultaneously via the SSM Agent; no SSH ports or bastion hosts are needed, and results are returned through the SSM service.",
      "Correct. SSM Session Manager opens an interactive terminal session to a single EC2 instance at a time; it is suitable for ad-hoc troubleshooting but not for running the same script across 500 instances simultaneously.",
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
      "AppConfig deployments take up to 1 hour to propagate to all Lambda instances",
      "The AppConfig deployment strategy is set to AllAtOnce but Lambda only receives updates on cold start",
      "Lambda environment variables are cached and override AppConfig values",
      "The Lambda extension for AppConfig caches configuration locally — the cache TTL has not expired yet",
    ],
    correctIndices: [3],
    explanation:
      "The AppConfig Lambda extension caches configuration locally at localhost:2772 to avoid API calls on every invocation. The cache has a configurable TTL (default varies — typically 45 seconds to several minutes). Until the TTL expires, Lambda reads from cache rather than fetching the new config. Solution: reduce the cache TTL, or force a cache refresh by calling the extension's clear-cache endpoint. AppConfig deployments propagate quickly — the cache is the delay. Lambda env vars are separate from AppConfig.",
    optionExplanations: [
      "Incorrect. The AppConfig Lambda extension caches the fetched configuration locally on localhost:2772 to avoid making an HTTP call to AppConfig on every Lambda invocation; until the cache TTL expires, Lambda reads the stale cached value even after a new configuration is deployed.",
      "Incorrect. AppConfig deployments propagate to the service endpoint within seconds; the multi-minute delay observed is caused by the Lambda extension's local cache TTL, not by slow AppConfig deployment propagation.",
      "Incorrect. Lambda environment variables are static values set at function configuration time and are unrelated to AppConfig; AppConfig configuration is fetched at runtime via an HTTP call to the extension, not read from environment variables.",
      "Correct. AppConfig's AllAtOnce deployment strategy instantly makes the new configuration available at the AppConfig service endpoint; however, even with immediate propagation, the Lambda extension cache means function instances continue reading the cached old value until the TTL expires.",
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
      "Access granted — the identity policy Allow overrides the bucket policy Deny",
      "Access denied — the bucket policy Deny applies to the developer since they are not the AdminRole",
      "Access denied — you cannot mix identity and resource policies for S3",
      "Access granted — the condition makes the Deny only apply to the AdminRole",
    ],
    correctIndices: [1],
    explanation:
      "Explicit Deny always wins. The bucket policy has Deny on s3:DeleteObject for Principal: * with a condition: if the caller is NOT AdminRole, the Deny applies. The developer is not the AdminRole, so the condition evaluates to true — the Deny applies. Explicit Deny overrides any Allow in any identity or resource policy. The developer's s3:* Allow in their identity policy is irrelevant once an explicit Deny is in effect. Remember: Deny > Allow, no exceptions.",
    optionExplanations: [
      "Incorrect. The bucket policy has Deny for s3:DeleteObject on Principal: * with the condition aws:PrincipalArn != AdminRole ARN. Because the developer is not the AdminRole, the condition is true (they ARE not the AdminRole), so the Deny statement applies. Explicit Deny always wins over any Allow—the developer's identity policy Allow for s3:* is irrelevant.",
      "Correct. Explicit Deny in a resource-based policy always overrides an Allow in an identity policy. This is a foundational rule of IAM policy evaluation: Allow + explicit Deny = Deny. The identity policy's Allow cannot 'win' against a Deny.",
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
      "Lambda is hitting the 15-minute timeout and returning 429 to indicate timeout",
      "API Gateway is rate limiting requests to 10 per second based on usage plan settings",
      "The function is out of memory and returning 429 as the error code",
      "Lambda is throttling requests because concurrency = 10 is exceeded; API Gateway returns 429. Increase reserved concurrency or remove it to use account-level concurrency",
    ],
    correctIndices: [3],
    explanation:
      "Reserved concurrency of 10 means only 10 concurrent executions are allowed. If the 11th request arrives while 10 are in-flight, Lambda throttles it — returns TooManyRequestsException (HTTP 429). API Gateway surfaces this as a 429 to the client. Solutions: increase reserved concurrency, remove it (use account pool), or set up retry logic with exponential backoff. Reserved concurrency both limits the function AND reserves that concurrency from the account pool. API Gateway usage plan rate limits are separate. Lambda returns 429 for throttle specifically — not for timeout or OOM.",
    optionExplanations: [
      "Incorrect. Reserved concurrency of 10 means a maximum of 10 concurrent Lambda executions are allowed. When the 11th request arrives while all 10 slots are in use, Lambda returns TooManyRequestsException (HTTP 429), which API Gateway surfaces to the client as a 429 Too Many Requests error.",
      "Incorrect. API Gateway usage plan rate limits are a separate throttling mechanism configured on the API stage or API key — they are independent of Lambda reserved concurrency and produce different error details.",
      "Incorrect. Lambda timeout results in a task timed out error after the configured timeout duration — it does not return a 429 HTTP status code. Lambda returns 429 specifically for throttling (concurrency exceeded).",
      "Correct. Out-of-memory errors cause the Lambda invocation to fail with an OOM error logged to CloudWatch — the HTTP response to the caller via API Gateway would be a 502 Bad Gateway, not a 429.",
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
      "CodeDeploy automatically rolls back and the instances run the previous version",
      "The instances have the new version partially installed and are in an indeterminate state",
      "The instances are terminated and replaced with new ones",
      "The instances still run the previous application version — BeforeInstall runs before files are copied",
    ],
    correctIndices: [3],
    explanation:
      "In-place deployment lifecycle: ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService. BeforeInstall runs BEFORE the new application files are copied. If it fails, the instances still have the old application running. CodeDeploy does not automatically roll back on hook failure — you must configure automatic rollback or trigger it manually. Only Install and later hooks result in files being changed on the instance.",
    optionExplanations: [
      "Incorrect. BeforeInstall is the first hook that runs after the application bundle is downloaded from S3 but before any application files are copied to the instance; if BeforeInstall fails, the old application version is still intact and running.",
      "Incorrect. The new version files are not copied until the Install lifecycle event, which comes after BeforeInstall; a BeforeInstall failure means no new files have been touched, so the instance is not in a partially installed state.",
      "Incorrect. CodeDeploy in-place deployments do not terminate EC2 instances on failure; the instances remain running with whatever application was previously installed — in this case, the previous version.",
      "Correct. CodeDeploy does not automatically roll back on lifecycle hook failure unless automatic rollback is explicitly configured in the deployment group settings; without that configuration, a failed deployment remains in a failed state requiring manual action.",
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
      "Set batch size to 1 so each message is processed independently",
      "Enable ReportBatchItemFailures and return a batchItemFailures list with only the failed message IDs",
      "Use a FIFO queue which automatically retries only failed messages",
      "Delete the 7 successfully processed messages manually and let SQS retry the batch",
    ],
    correctIndices: [1],
    explanation:
      "Lambda's SQS event source mapping supports partial batch response (ReportBatchItemFailures). When enabled, the Lambda function can return a response with batchItemFailures listing only the message IDs that failed. Lambda deletes the successful messages and returns only the failed ones to the queue for retry. Without this, the entire batch is retried on failure. Setting batch size to 1 works but reduces throughput. FIFO queues retry from the failed message position but don't support partial batch responses the same way.",
    optionExplanations: [
      "Incorrect. The ReportBatchItemFailures feature for SQS event source mappings allows a Lambda function to return a batchItemFailures list containing only the messageId values of messages that failed. Lambda deletes the successfully processed messages and returns only the failed ones to the queue for retry, preventing unnecessary reprocessing.",
      "Correct. Manually deleting the seven successful messages would work, but it requires the function to make seven additional DeleteMessage API calls and does not scale well. The built-in ReportBatchItemFailures mechanism is the purpose-built, more efficient solution.",
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
      "Custom Authentication trigger — implement entirely custom auth flow using legacy DB",
      "Post Confirmation trigger — migrate user data after they confirm their email",
      "Pre Authentication trigger — validate user credentials against the legacy DB before Cognito auth",
      "User Migration trigger — fires when a user signs in and doesn't exist in the User Pool; look up in legacy DB and migrate",
    ],
    correctIndices: [3],
    explanation:
      "The User Migration Lambda trigger fires when a user tries to sign in to the Cognito User Pool but doesn't have an account there. The Lambda can look up the user in the legacy system, validate their password against the legacy DB, and if valid, return the user attributes to Cognito which creates the account transparently. The user doesn't know migration happened. Pre Authentication can't migrate users. Post Confirmation is after registration, not migration. Custom Auth requires a full custom flow — more work.",
    optionExplanations: [
      "Incorrect. The User Migration Lambda trigger fires when a user attempts to sign in to the Cognito User Pool but does not have an existing account there. The Lambda can look up the user in the legacy system, validate the submitted password against the legacy database, and if valid, return the user's attributes so Cognito creates the account transparently—without the user needing to reset their password or re-register.",
      "Incorrect. Pre Authentication fires before Cognito validates the user's credentials, but it does not have the ability to create a new Cognito user account during the flow. Using it to validate against a legacy DB would still leave the user without a Cognito account, blocking a successful sign-in.",
      "Incorrect. Post Confirmation fires after a user completes registration and confirms their account (e.g., email verification). It is used to run post-registration logic, not to migrate users who are trying to sign in with credentials from a legacy system.",
      "Correct. Custom Authentication allows you to build a completely custom multi-step auth challenge flow using Define/Create/Verify Auth Challenge triggers. While technically possible to query a legacy DB during this flow, it replaces the entire standard Cognito auth mechanism and requires significantly more implementation work than the purpose-built User Migration trigger.",
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
      "Use Read Replicas instead of Multi-AZ for high availability",
      "Increase the Multi-AZ synchronization interval to reduce failover time",
      "Switch to a single-AZ deployment to avoid failover disruptions",
      "Implement retry logic with exponential backoff in the application and use RDS Proxy to absorb failover",
    ],
    correctIndices: [3],
    explanation:
      "RDS Multi-AZ failover typically takes 60-120 seconds — the DNS record is updated to point to the standby. Applications must reconnect. Two mitigations: 1) Implement retry logic with exponential backoff to reconnect after brief failures. 2) Use RDS Proxy — the proxy absorbs the failover, maintaining the connection endpoint and reducing application-visible downtime to seconds. Single-AZ removes HA. You cannot configure synchronization intervals. Read Replicas provide read scaling — they use asynchronous replication and can't be promoted automatically without manual intervention.",
    optionExplanations: [
      "Incorrect. RDS Multi-AZ failover involves updating the DNS record to point to the standby instance, which typically takes 60-120 seconds. Two mitigations work together: (1) Retry logic with exponential backoff in the application gracefully handles the brief connection loss by retrying reconnections until the new primary is reachable. (2) RDS Proxy maintains its own connection endpoint and absorbs the failover, re-routing connections to the new primary in seconds rather than waiting for DNS propagation.",
      "Incorrect. Switching to a single-AZ deployment removes the Multi-AZ standby entirely, eliminating automatic failover capability. A primary instance failure in single-AZ requires manual intervention to restore service, which results in far longer downtime than the 60-120 second failover experienced with Multi-AZ. This is the opposite of the desired improvement.",
      "Incorrect. The Multi-AZ synchronization interval is not a configurable parameter in RDS. Multi-AZ uses synchronous replication — every write to the primary is committed simultaneously on the standby before acknowledging success to the application. There is no configurable interval; failover time is determined by infrastructure factors like DNS TTL, not replication frequency.",
      "Correct. Read Replicas use asynchronous replication from the primary, which means they can lag behind the primary and may serve stale data. More critically, Read Replicas do not support automatic promotion to primary during a failure — they must be manually promoted, which takes time and requires application reconfiguration. They provide read scaling, not the automated high availability that Multi-AZ provides.",
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
      "Use EventBridge Archive to store events and manually replay them after the outage",
      "Configure a Dead Letter Queue (SQS) on the EventBridge rule target for retry overflow, and rely on EventBridge's built-in retry with exponential backoff",
      "Use EventBridge Pipes with a buffer to hold events during downstream failures",
      "Increase the EventBridge event bus throughput to queue events during outages",
    ],
    correctIndices: [1],
    explanation:
      "EventBridge retries failed target invocations with exponential backoff for up to 24 hours. If all retries are exhausted and a Dead Letter Queue (SQS) is configured on the target, the event is sent to the DLQ for later processing. This combination ensures no events are lost during transient outages. EventBridge Archive captures events for replay but requires manual replay after the outage — not automatic. EventBridge event buses don't queue events. Pipes add transformation/filtering but don't add buffering for target failures.",
    optionExplanations: [
      "Incorrect. EventBridge retries failed target invocations using exponential backoff for up to 24 hours automatically. Configuring a Dead Letter Queue (SQS) on the rule target ensures that events which exhaust all retries are captured and can be reprocessed once the downstream system recovers, guaranteeing no events are permanently lost.",
      "Correct. EventBridge Archive stores events for replay but requires a developer to manually initiate the replay after the outage is resolved; this does not provide automatic delivery assurance during the outage and requires operational intervention.",
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
      "cfn-init requires the AWS::CloudFormation::WaitCondition resource to be defined",
      "The cfn-init configuration requires the CloudWatch Agent to be installed first",
      "The UserData script is missing the cfn-init call and cfn-signal command",
      "The IAM instance profile does not have CloudFormation permissions",
    ],
    correctIndices: [2],
    explanation:
      "cfn-init is not executed automatically — you must call it explicitly from the EC2 instance's UserData script. The UserData script runs cfn-init -v --stack StackName --resource ResourceName --region Region to pull and apply the metadata configuration. Additionally, cfn-signal is required to signal CloudFormation that initialization completed (with success or failure), especially when using CreationPolicy. Missing the UserData cfn-init call is the most common reason cfn-init never runs.",
    optionExplanations: [
      "Incorrect. cfn-init is not self-executing; the EC2 instance's UserData script must explicitly call the cfn-init binary with the stack name and resource name, then call cfn-signal to report success or failure back to CloudFormation's CreationPolicy.",
      "Incorrect. cfn-init is independent of the CloudWatch Agent; the CloudWatch Agent is for metrics and log collection, and its presence or absence on the instance has no effect on whether cfn-init runs.",
      "Correct. cfn-init reads configuration from the CloudFormation stack's metadata via the CloudFormation API; it needs permissions to call cloudformation:DescribeStackResource, but missing IAM permissions would cause cfn-init to fail with an authorization error, not silently skip.",
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
    options: ["64 KB", "10 MB", "1 MB", "256 KB"],
    correctIndices: [3],
    explanation:
      "Amazon SNS supports messages up to 256 KB in size. For larger payloads, use the SNS Extended Client Library which stores the actual message in S3 and sends a reference in the SNS message. This is the same pattern used with SQS Extended Client Library. SQS also has a 256 KB message size limit.",
    optionExplanations: [
      "Incorrect. Amazon SNS enforces a maximum message payload size of 256 KB. For larger payloads, the SNS Extended Client Library stores the actual content in S3 and sends a reference pointer in the SNS message, keeping the message itself within the 256 KB limit.",
      "Incorrect. 1 MB exceeds the SNS maximum message size of 256 KB. SNS will reject messages larger than 256 KB with an error.",
      "Incorrect. 64 KB is below the actual limit; SNS supports messages up to 256 KB, so a 64 KB message is well within limits but this value is not the maximum.",
      "Correct. 10 MB far exceeds the SNS message size limit. This is closer to the maximum payload size for API Gateway (10 MB) or Lambda synchronous invocations, not SNS.",
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
      "Use SNS to publish to a topic that the WebSocket client subscribes to directly",
      "The backend Lambda cannot send to WebSocket clients — only client-initiated messages are supported",
      "Use the API Gateway Management API (PostToConnection) with the client's connectionId to push a message",
      "Store the message in DynamoDB and the client polls for updates via REST",
    ],
    correctIndices: [2],
    explanation:
      "API Gateway WebSocket APIs assign each connected client a connectionId. Backend services can push messages to specific clients using the API Gateway Management API endpoint: POST https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/@connections/{connectionId}. The backend Lambda stores connectionIds (typically in DynamoDB) and uses PostToConnection to push data. This enables server-initiated push. SNS does not support WebSocket clients directly.",
    optionExplanations: [
      "Incorrect. API Gateway WebSocket APIs assign each connected client a unique connectionId. Backend services push messages to a specific client by calling the API Gateway Management API's PostToConnection endpoint (POST to https://{api-id}.execute-api.{region}.amazonaws.com/{stage}/@connections/{connectionId}), enabling true server-initiated push.",
      "Incorrect. API Gateway WebSocket APIs fully support server-initiated message push to connected clients; the backend Lambda does not need to wait for a client message and can push at any time using a stored connectionId.",
      "Correct. Having the client poll DynamoDB via a REST endpoint defeats the purpose of WebSocket connections and introduces unnecessary latency; the PostToConnection API exists specifically to push data to clients without requiring a client request.",
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
      "The decrypt operation fails with AccessDeniedException — deletion removes key policy",
      "The decrypt operation succeeds — the key is still active during the waiting period",
      "The decrypt operation is queued and executed after the deletion is cancelled",
      "The decrypt operation fails with KMSInvalidStateException — keys in pending deletion state cannot be used",
    ],
    correctIndices: [3],
    explanation:
      "During the deletion waiting period (7-30 days), a KMS CMK is disabled and cannot be used for any cryptographic operations — encryption, decryption, signing, or verification will fail with KMSInvalidStateException. This is intentional — it gives you time to identify dependencies and cancel deletion if needed. The key is not yet deleted (it still exists in KMS), but it cannot be used. Cancel deletion before the waiting period ends to restore the key. After the period, the key is permanently deleted and all data encrypted with it is permanently inaccessible.",
    optionExplanations: [
      "Incorrect. During the deletion waiting period (minimum 7 days, up to 30 days), the CMK is placed in a 'Pending deletion' state. All cryptographic operations — Encrypt, Decrypt, GenerateDataKey, Sign, Verify — fail immediately with KMSInvalidStateException. This allows you to identify applications that still depend on the key and cancel deletion if needed.",
      "Incorrect. A CMK in pending deletion state is not active and cannot be used for any cryptographic operation. AWS intentionally disables the key during the waiting period so you can safely evaluate whether any system still depends on it before it is permanently destroyed.",
      "Incorrect. The failure is KMSInvalidStateException, not AccessDeniedException. AccessDeniedException indicates an IAM or key policy authorization failure. The key policy is not removed during pending deletion — the key is disabled for use, which is a different state than an authorization failure.",
      "Correct. KMS does not queue cryptographic operations for later execution. When a key is in pending deletion state, the operation fails immediately with KMSInvalidStateException. The only way to restore key usage is to cancel the deletion before the waiting period expires, after which the key returns to its previous enabled state.",
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

  // --- NEW: Amazon SQS ---
  {
    id: "qq-121",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SQS",
    question:
      "A Lambda function processes SQS messages in batches of 10. Some messages occasionally fail processing while others in the same batch succeed. How should the developer ensure only failed messages are retried?",
    options: [
      "Configure a DLQ on the SQS queue with maxReceiveCount of 1",
      "Return a list of failed message IDs using the ReportBatchItemFailures response type",
      "Set the batch size to 1 so each message is processed independently",
      "Catch exceptions and delete successful messages manually before throwing",
    ],
    correctIndices: [1],
    explanation:
      "ReportBatchItemFailures lets Lambda return a partial success response identifying which message IDs failed. SQS retries only those failed messages; successfully processed messages are deleted. Without this, any failure causes the entire batch to return to the queue.",
    optionExplanations: [
      "Incorrect. FunctionResponseTypes: [ReportBatchItemFailures] enables partial batch success — Lambda returns a batchItemFailures list and SQS only retries those specific messages.",
      "Correct. Manually deleting messages is error-prone and requires extra API calls. ReportBatchItemFailures is the built-in mechanism for this use case.",
      "Incorrect. A batch size of 1 works but eliminates the throughput benefits of batching and significantly increases cost and Lambda invocation count.",
      "Incorrect. A DLQ with maxReceiveCount of 1 would move messages to the DLQ after a single failure, preventing any retry at all.",
    ],
    tags: ["sqs", "lambda", "batch", "error-handling"],
  },

  // --- NEW: Amazon Kinesis ---
  {
    id: "qq-122",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "A Kinesis Data Stream has 4 shards. A Lambda consumer is experiencing high latency because multiple functions are reading from the same shards. What feature allows multiple consumers to read from the same shard simultaneously without competing?",
    options: [
      "Enhanced Fan-Out with dedicated throughput per consumer",
      "Increase the shard count to match the number of consumers",
      "Use GetRecords with a higher Limit parameter",
      "Switch to Kinesis Data Firehose for automatic fan-out",
    ],
    correctIndices: [0],
    explanation:
      "Enhanced Fan-Out gives each registered consumer its own 2 MB/s read throughput per shard via HTTP/2 push, rather than sharing the shard's standard 2 MB/s across all consumers using GetRecords polling. Multiple EFO consumers can read the same shard simultaneously without competing.",
    optionExplanations: [
      "Correct. Enhanced Fan-Out registers a consumer and provides dedicated 2 MB/s per shard throughput per consumer using SubscribeToShard (HTTP/2 push), eliminating read contention between consumers.",
      "Incorrect. Increasing shards scales write throughput and parallelism, but does not allow multiple consumers to read the same shard without competing unless Enhanced Fan-Out is used.",
      "Incorrect. A higher Limit just requests more records per GetRecords call — it doesn't provide dedicated throughput or allow simultaneous reads without contention.",
      "Incorrect. Firehose is a delivery service to S3/Redshift/OpenSearch — it doesn't solve the fan-out problem for Lambda consumers processing stream records.",
    ],
    tags: ["kinesis", "enhanced-fan-out", "consumers", "throughput"],
  },

  // --- NEW: Amazon API Gateway ---
  {
    id: "qq-123",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "A team wants to gradually shift traffic to a new Lambda function version without updating the API Gateway stage. What is the BEST approach?",
    options: [
      "Use API Gateway canary deployments to split traffic at the stage level",
      "Create a new API Gateway stage pointing to the new Lambda version",
      "Use a Lambda alias with a weighted routing configuration between two versions",
      "Deploy a new API Gateway API and use Route 53 weighted routing",
    ],
    correctIndices: [2],
    explanation:
      "A Lambda alias supports traffic shifting — you can route a percentage of invocations to a new version while the rest go to the stable version. The API Gateway integration points to the alias ARN, so no API Gateway changes are needed. API Gateway canary deployments split traffic between stage configurations, not Lambda versions.",
    optionExplanations: [
      "Incorrect. Lambda alias weighted routing (e.g. 90% to v1, 10% to v2) lets you gradually shift traffic between versions. The API Gateway integration uses the alias ARN and requires no changes.",
      "Incorrect. Creating a new stage requires updating clients or DNS and doesn't provide gradual traffic shifting within a single endpoint.",
      "Correct. API Gateway canary deployments split traffic between two stage configurations (e.g. different stage variables or throttle settings), not between Lambda function versions directly.",
      "Incorrect. Deploying a separate API and using Route 53 weighted routing works but is far more complex and operationally heavy than Lambda alias traffic shifting.",
    ],
    tags: ["api-gateway", "lambda", "canary", "traffic-shifting", "deployment"],
  },

  // --- NEW: Amazon CloudWatch ---
  {
    id: "qq-124",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudWatch",
    question:
      "A developer wants to count the number of ERROR log lines emitted by a Lambda function and trigger an alarm when the count exceeds 10 in 5 minutes. What is the correct sequence of steps?",
    options: [
      "Use CloudWatch Logs Insights to query errors, then set an alarm on query results",
      "Enable Lambda detailed monitoring, then create an alarm on the Errors metric",
      "Create a CloudWatch Synthetics canary that invokes the function and checks for errors",
      "Create a metric filter on the log group to extract a metric, then create an alarm on that metric",
    ],
    correctIndices: [3],
    explanation:
      "Metric filters parse log events matching a pattern and increment a custom CloudWatch metric. You then create an alarm on that metric. Lambda's built-in Errors metric counts invocation errors (unhandled exceptions), not log-level ERROR strings — so a metric filter is needed for log-based counting.",
    optionExplanations: [
      "Incorrect. A metric filter on the CloudWatch log group matches lines containing 'ERROR', publishes a count to a custom metric, and an alarm watches that metric over a 5-minute period.",
      "Incorrect. Lambda's built-in Errors metric counts function invocations that threw an unhandled exception — it does not count ERROR strings written to logs by the application.",
      "Incorrect. Logs Insights is for ad-hoc interactive queries — it does not continuously emit metrics or support alarms on query results.",
      "Correct. Synthetics canaries test endpoints and APIs from the outside — they don't inspect internal log output for error strings.",
    ],
    tags: ["cloudwatch", "metric-filters", "logs", "alarms", "lambda"],
  },

  // --- NEW: Amazon ElastiCache ---
  {
    id: "qq-125",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon ElastiCache",
    question:
      "A developer is caching database query results in ElastiCache Redis. After a cache miss, the application fetches from RDS and writes the result to Redis. What caching pattern is this, and what is its main risk?",
    options: [
      "Read-through; the risk is cache stampede on the first read of a key",
      "Write-behind; the risk is data loss if the cache fails before writing to the database",
      "Write-through; the risk is write latency on every database update",
      "Lazy loading (cache-aside); the risk is serving stale data if the database is updated without invalidating the cache",
    ],
    correctIndices: [3],
    explanation:
      "Lazy loading (cache-aside) only populates the cache on a miss — the application checks cache first, and on miss reads from DB and writes to cache. The main risk is stale data: if the underlying DB record changes, the cache still holds the old value until TTL expires or explicit invalidation occurs.",
    optionExplanations: [
      "Incorrect. This is the lazy loading / cache-aside pattern. Data is only written to cache after a miss. Stale reads are the primary risk — updates to the DB don't automatically update the cache.",
      "Incorrect. Write-through writes to both cache and DB on every write operation, keeping them in sync. The described pattern only writes to cache on a read miss, not on writes.",
      "Incorrect. Write-behind (write-back) writes to cache first and asynchronously persists to the DB later. The described pattern writes to the DB first (on miss) and then populates the cache.",
      "Correct. Read-through is similar but the cache itself fetches from the DB on a miss rather than the application doing it. The application in this scenario explicitly fetches from RDS and writes to Redis.",
    ],
    tags: ["elasticache", "caching", "lazy-loading", "patterns"],
  },

  // --- NEW: Amazon SNS ---
  {
    id: "qq-126",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SNS",
    question:
      "A developer needs different downstream services to receive only the SNS messages relevant to them, without creating separate topics per service. What feature enables this?",
    options: [
      "Lambda authorizers that inspect and route SNS messages",
      "SQS queue policies that filter messages on receipt",
      "SNS message routing rules attached to the topic",
      "Subscription filter policies based on message attributes",
    ],
    correctIndices: [3],
    explanation:
      "Subscription filter policies are JSON documents attached to individual subscriptions. They match against MessageAttributes on the published message and deliver only matching messages to that subscriber. Each subscriber can have a different filter, enabling content-based routing from a single topic.",
    optionExplanations: [
      "Incorrect. Filter policies are set per-subscription, not per-topic. SNS evaluates MessageAttributes against each subscription's filter policy and only delivers matching messages.",
      "Incorrect. SNS does not have topic-level routing rules. Filtering is done at the subscription level via filter policies.",
      "Incorrect. SQS queue policies control who can send to the queue — they don't filter messages based on content after delivery.",
      "Correct. Lambda authorizers are an API Gateway concept for request authorization — they have no role in SNS message routing.",
    ],
    tags: ["sns", "filtering", "subscriptions", "message-attributes"],
  },
  {
    id: "qq-127",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon SNS",
    question:
      "A mobile application uses SNS to send push notifications to iOS devices. After an app update, notifications stop being delivered. CloudWatch shows SNS is publishing successfully. What should the developer check FIRST?",
    options: [
      "Whether the APNS certificate or token credentials on the SNS platform application have expired",
      "Whether the SNS topic has the correct IAM permissions to invoke APNS",
      "Whether the mobile devices have re-subscribed to the SNS topic after the app update",
      "Whether the SNS topic type needs to be changed from Standard to FIFO",
    ],
    correctIndices: [0],
    explanation:
      "SNS mobile push uses platform application endpoints backed by APNS credentials (certificate or token-based auth). If the certificate expires or the token key is revoked, SNS will report success at the topic level but APNS will reject the delivery. This is the most common cause of push notifications silently failing after an app update.",
    optionExplanations: [
      "Correct. SNS communicates with APNS using credentials stored in the platform application. Expired certificates or rotated/revoked token credentials cause APNS to reject deliveries silently from SNS's perspective — SNS reports the publish as successful but the notification never reaches the device.",
      "Incorrect. SNS calls APNS as an AWS service using its own infrastructure — it doesn't use an IAM role to authenticate with APNS. APNS authentication uses Apple-issued certificates or tokens stored in the platform application.",
      "Incorrect. Device endpoint ARNs are registered per-device and persist across app updates. Devices don't need to re-subscribe unless the endpoint is explicitly deleted or disabled.",
      "Incorrect. FIFO topics only support SQS FIFO subscribers — they cannot be used for mobile push. Changing topic type would not fix delivery issues and is not possible without recreating the topic.",
    ],
    tags: ["sns", "mobile-push", "apns", "troubleshooting"],
  },

  // --- NEW: Amazon Cognito ---
  {
    id: "qq-128",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon Cognito",
    question:
      "A developer wants to customize the attributes added to a JWT before it is issued to a user after sign-in. Which Cognito Lambda trigger should they use?",
    options: [
      "Pre Authentication trigger",
      "Pre Token Generation trigger",
      "Post Confirmation trigger",
      "Post Authentication trigger",
    ],
    correctIndices: [1],
    explanation:
      "The Pre Token Generation trigger fires just before Cognito issues tokens and allows the Lambda function to add, suppress, or override claims in the ID token and access token. Post Authentication fires after sign-in but cannot modify tokens. Pre Authentication fires before credential validation.",
    optionExplanations: [
      "Incorrect. Pre Token Generation is invoked before Cognito issues the ID and access tokens, giving the Lambda function the opportunity to add custom claims, suppress existing claims, or override group membership in the token payload.",
      "Correct. Post Authentication fires after a successful sign-in and can be used for logging or triggering side effects, but it cannot modify the tokens that will be issued.",
      "Incorrect. Pre Authentication fires before Cognito validates credentials and can be used to allow or deny sign-in attempts, but it runs too early in the flow to modify token contents.",
      "Incorrect. Post Confirmation fires after a user confirms their account (e.g. via email verification) — it is not involved in the token issuance flow during sign-in.",
    ],
    tags: ["cognito", "lambda-triggers", "jwt", "tokens"],
  },
  {
    id: "qq-129",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "Amazon Cognito",
    question:
      "A web app authenticates users with a Cognito User Pool. The app needs to call an S3 API directly from the browser using the authenticated user's identity. What is the correct approach?",
    options: [
      "Exchange the User Pool token for temporary AWS credentials using a Cognito Identity Pool",
      "Attach an IAM user policy to each Cognito user granting S3 access",
      "Use the Cognito User Pool access token directly to sign S3 API requests",
      "Configure S3 to accept Cognito JWT tokens as authorization headers",
    ],
    correctIndices: [0],
    explanation:
      "Cognito Identity Pools (Federated Identities) exchange a User Pool token (or other identity provider token) for temporary AWS credentials via STS. The browser then uses those credentials to make signed AWS API calls directly. User Pool tokens are OIDC JWTs — they cannot sign AWS API requests.",
    optionExplanations: [
      "Correct. The Identity Pool authenticates the User Pool token and calls STS AssumeRoleWithWebIdentity to return temporary IAM credentials. The browser uses those credentials with SigV4 signing to call S3 directly.",
      "Incorrect. Cognito User Pool users are not IAM users — you cannot attach IAM policies to them. Access to AWS services requires going through an Identity Pool to obtain IAM credentials.",
      "Incorrect. User Pool tokens are OIDC JWTs used for application-level authentication. AWS service APIs require SigV4-signed requests using IAM credentials — JWTs cannot substitute for IAM credentials.",
      "Incorrect. S3 does not natively accept Cognito JWTs as authorization. All S3 API access requires IAM credentials for SigV4 signing (or presigned URLs generated server-side).",
    ],
    tags: ["cognito", "identity-pool", "s3", "credentials", "sts"],
  },

  // --- NEW: AWS KMS ---
  {
    id: "qq-130",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS KMS",
    question:
      "A developer needs to encrypt data larger than 4 KB in their application using KMS. What is the correct approach?",
    options: [
      "Call the KMS Encrypt API directly with the full data payload",
      "Store the plaintext data key in Secrets Manager and use it to encrypt data locally",
      "Split the data into 4 KB chunks and encrypt each chunk separately with KMS Encrypt",
      "Use GenerateDataKey to get a plaintext data key, encrypt the data locally, then store the encrypted data key alongside the ciphertext",
    ],
    correctIndices: [3],
    explanation:
      "KMS Encrypt has a 4 KB limit. For larger data, use envelope encryption: GenerateDataKey returns a plaintext data key and an encrypted copy. You encrypt your data locally with the plaintext key (using AES-256), discard the plaintext key, and store the encrypted data key with the ciphertext. To decrypt, call KMS Decrypt on the encrypted data key to recover the plaintext key, then decrypt locally.",
    optionExplanations: [
      "Incorrect. This is envelope encryption — the industry-standard pattern for encrypting large data with KMS. KMS protects the data key; the data key protects the actual data.",
      "Incorrect. The KMS Encrypt API has a hard limit of 4 KB for the plaintext payload. Larger data must use envelope encryption with GenerateDataKey.",
      "Incorrect. Splitting data into chunks and encrypting each separately with KMS Encrypt would generate thousands of KMS API calls for large files, incurring high cost and latency, and is not how envelope encryption works.",
      "Correct. Storing a plaintext encryption key in Secrets Manager defeats the purpose of KMS key management. The plaintext data key should be used in memory and immediately discarded — never persisted.",
    ],
    tags: ["kms", "envelope-encryption", "data-key", "encryption"],
  },
  {
    id: "qq-131",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS KMS",
    question:
      "A Lambda function in Account A needs to decrypt data encrypted with a KMS Customer Managed Key in Account B. What must be configured?",
    options: [
      "The Lambda execution role in Account A must have an inline policy granting kms:Decrypt on all KMS keys",
      "The KMS key policy in Account B must allow Account A's Lambda execution role as a principal, and Account A's IAM policy must allow kms:Decrypt on the key ARN",
      "The KMS key must be shared using AWS Resource Access Manager (RAM)",
      "A KMS key grant must be created in Account A pointing to Account B's key",
    ],
    correctIndices: [1],
    explanation:
      "Cross-account KMS access requires two things: the key policy in the key's account must explicitly allow the external principal (or account), AND the IAM policy in the caller's account must allow the kms:Decrypt action on the specific key ARN. Both must allow the action — either one alone is insufficient.",
    optionExplanations: [
      "Incorrect. Cross-account KMS access requires permissions on both sides: the key policy in Account B must trust Account A's Lambda role, and Account A's IAM policy must grant kms:Decrypt on the Account B key ARN.",
      "Correct. An IAM policy in Account A granting kms:Decrypt is necessary but not sufficient — the key policy in Account B must also explicitly allow the Account A principal. IAM alone cannot override a KMS key policy that doesn't grant access.",
      "Incorrect. KMS grants are created on a key in the key's own account and delegate permissions to principals — they cannot be created from a different account. The correct mechanism is key policy + IAM policy.",
      "Incorrect. KMS Customer Managed Keys cannot be shared via AWS RAM. Cross-account KMS access is managed through key policies and IAM policies, not RAM.",
    ],
    tags: ["kms", "cross-account", "key-policy", "iam"],
  },

  // --- NEW: AWS CloudFormation ---
  {
    id: "qq-132",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation stack update fails and rolls back. The developer needs to understand exactly which resource change caused the failure. Where should they look?",
    options: [
      "AWS CloudTrail logs for the CloudFormation API calls",
      "Amazon CloudWatch Logs for the CloudFormation service",
      "The stack Events tab in the CloudFormation console, filtered to FAILED status",
      "The stack Outputs section which lists failed resource changes",
    ],
    correctIndices: [2],
    explanation:
      "The CloudFormation stack Events tab shows a chronological log of every resource action during a stack operation, including the status reason for each FAILED event. This is the primary place to diagnose which resource failed and why during a stack update or rollback.",
    optionExplanations: [
      "Incorrect. The Events tab in the CloudFormation console (or DescribeStackEvents API) shows each resource's status transitions with a StatusReason field explaining failures. Filtering to FAILED events quickly identifies the root cause.",
      "Incorrect. CloudTrail logs CloudFormation API calls (CreateStack, UpdateStack, etc.) but does not provide resource-level failure details or the reason a specific resource change failed.",
      "Correct. The Outputs section displays exported values from the stack — it contains no information about deployment failures or resource errors.",
      "Incorrect. CloudFormation does not write detailed deployment logs to CloudWatch Logs by default. Resource-level failure details are in the stack Events, not CloudWatch.",
    ],
    tags: ["cloudformation", "troubleshooting", "events", "rollback"],
  },
  {
    id: "qq-133",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation template needs to provision a resource type that CloudFormation does not natively support. What is the correct approach?",
    options: [
      "Use a CloudFormation Macro to transform the template before deployment",
      "Use a CloudFormation StackSet to deploy the resource across multiple accounts",
      "Use AWS CDK to wrap the unsupported resource and synthesize a template",
      "Use a Custom Resource backed by a Lambda function to handle Create, Update, and Delete lifecycle events",
    ],
    correctIndices: [3],
    explanation:
      "Custom Resources let you run arbitrary Lambda code during stack operations. CloudFormation sends Create/Update/Delete events to the Lambda function, which provisions the resource and sends a success/failure signal back via a pre-signed S3 URL. This enables managing any resource — third-party APIs, on-premises resources, unsupported AWS services.",
    optionExplanations: [
      "Incorrect. Custom Resources (AWS::CloudFormation::CustomResource or Custom::MyResource) invoke a Lambda function for each lifecycle event. The function must respond with a presigned S3 URL callback indicating success or failure.",
      "Incorrect. CloudFormation Macros transform template syntax before deployment — they're used for template preprocessing (like loops or shorthand), not for provisioning unsupported resource types.",
      "Incorrect. CDK synthesizes CloudFormation templates — if CloudFormation doesn't natively support a resource, CDK alone doesn't add that capability. CDK can use Custom Resources, but the underlying mechanism is still a Custom Resource.",
      "Correct. StackSets deploy the same CloudFormation template across multiple accounts and regions — they don't add support for new resource types.",
    ],
    tags: ["cloudformation", "custom-resource", "lambda", "extensibility"],
  },

  // --- NEW: AWS X-Ray ---
  {
    id: "qq-134",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "AWS X-Ray",
    question:
      "A developer wants to add searchable business context to X-Ray traces — for example, tagging traces with a customer ID — so they can filter traces by customer in the X-Ray console. What should they use?",
    options: [
      "X-Ray annotations, which are indexed key-value pairs filterable in the console",
      "X-Ray metadata, which stores arbitrary data attached to segments",
      "Custom CloudWatch dimensions added alongside X-Ray trace IDs",
      "X-Ray subsegments with the customer ID in the subsegment name",
    ],
    correctIndices: [0],
    explanation:
      "Annotations are indexed key-value pairs (string, number, or boolean) attached to segments or subsegments. They can be used in filter expressions in the X-Ray console to find traces matching specific values. Metadata is not indexed and cannot be used for filtering — it's for storing large or complex data for debugging.",
    optionExplanations: [
      "Correct. Annotations are indexed and filterable. Use putAnnotation() in the SDK to add key-value pairs like customerId, then filter in the X-Ray console using annotation.customerId = '12345'.",
      "Incorrect. Metadata can store arbitrary objects (JSON) but is not indexed and cannot be used in filter expressions. It's useful for attaching debug context but not for searching traces.",
      "Incorrect. CloudWatch dimensions are for CloudWatch metrics — they have no effect on X-Ray trace filtering or searchability.",
      "Incorrect. Subsegment names appear in the service map and trace timeline but are not indexed as searchable attributes. Using them for business data would pollute the service map without enabling filtering.",
    ],
    tags: ["xray", "annotations", "tracing", "filtering"],
  },
  {
    id: "qq-135",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "AWS X-Ray",
    question:
      "An ECS task running on Fargate needs to send X-Ray trace data. The application uses the X-Ray SDK but traces are not appearing in the console. What is the MOST likely missing configuration?",
    options: [
      "The task definition does not specify a CloudWatch log group for X-Ray",
      "The X-Ray SDK must be replaced with the OpenTelemetry SDK on Fargate",
      "The ECS cluster does not have X-Ray enabled at the cluster level",
      "The X-Ray daemon is not running as a sidecar container in the task definition",
    ],
    correctIndices: [3],
    explanation:
      "The X-Ray SDK sends trace segments to the X-Ray daemon on UDP port 2000. On ECS Fargate, there is no host daemon — you must add the X-Ray daemon as a sidecar container in the same task definition. The sidecar receives segments from the SDK and forwards them to the X-Ray service.",
    optionExplanations: [
      "Incorrect. On ECS Fargate, there is no EC2 host to run the daemon. The X-Ray daemon must be added as a sidecar container (amazon/aws-xray-daemon) in the task definition. The SDK sends to localhost:2000 (UDP) which the sidecar listens on.",
      "Incorrect. X-Ray does not have a cluster-level enable setting in ECS. Tracing is configured at the task definition level by including the daemon sidecar and granting the task role xray:PutTraceSegments permission.",
      "Incorrect. X-Ray trace data is not sent via CloudWatch Logs — the daemon forwards segments directly to the X-Ray API. Log groups are not part of the trace data path.",
      "Correct. The X-Ray SDK works on Fargate — the issue is the missing daemon sidecar, not the SDK choice. OpenTelemetry is an alternative instrumentation approach but is not required on Fargate.",
    ],
    tags: ["xray", "ecs", "fargate", "daemon", "tracing"],
  },

  // --- NEW: Amazon EventBridge ---
  {
    id: "qq-136",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon EventBridge",
    question:
      "A developer wants to trigger a Lambda function every weekday at 9 AM UTC. What is the correct EventBridge rule configuration?",
    options: [
      "A schedule rule using cron(9 0 * * MON-FRI) in standard cron format",
      "A schedule rule using rate(1 day) with a start time of 9 AM",
      "An event pattern rule matching a custom event published at 9 AM",
      "A schedule rule using the cron expression cron(0 9 ? * MON-FRI *)",
    ],
    correctIndices: [3],
    explanation:
      "EventBridge cron expressions use the format cron(Minutes Hours Day-of-month Month Day-of-week Year). cron(0 9 ? * MON-FRI *) means minute 0, hour 9, any day-of-month (?), any month, Monday through Friday, any year. The ? is required when specifying day-of-week to avoid conflict with day-of-month.",
    optionExplanations: [
      "Incorrect. EventBridge cron syntax is cron(min hour dom month dow year). cron(0 9 ? * MON-FRI *) fires at 09:00 UTC on weekdays. The ? in the day-of-month field is required when day-of-week is specified.",
      "Incorrect. rate() expressions fire at a fixed interval (e.g. rate(1 day) fires every 24 hours from creation) — they do not support time-of-day or day-of-week targeting.",
      "Incorrect. Event pattern rules match events from AWS services or custom event buses — they respond to events, not schedules. You cannot use an event pattern to trigger on a time schedule.",
      "Correct. This uses standard Unix cron field order (min hour dom month dow), but EventBridge cron requires a sixth Year field and uses ? for unspecified fields. The field order here is also inverted from EventBridge's format.",
    ],
    tags: ["eventbridge", "schedule", "cron", "lambda"],
  },
  {
    id: "qq-137",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon EventBridge",
    question:
      "An application publishes custom events to EventBridge. A downstream team in a separate AWS account needs to consume these events. What must be configured to enable cross-account event delivery?",
    options: [
      "Use EventBridge Schema Registry to share event schemas across accounts",
      "Create an SNS topic as an intermediary and subscribe the target account's Lambda to it",
      "Enable EventBridge global endpoints and configure both accounts as endpoints",
      "Add a resource-based policy to the target account's event bus allowing the source account to put events, and create a rule in the source account targeting the destination event bus",
    ],
    correctIndices: [3],
    explanation:
      "Cross-account EventBridge delivery requires: (1) a resource policy on the target account's event bus granting the source account permission to send events, and (2) a rule in the source account with the target account's event bus ARN as the target. Events flow directly between event buses across accounts.",
    optionExplanations: [
      "Incorrect. The target account's event bus needs a resource-based policy allowing events:PutEvents from the source account. The source account creates a rule that routes matching events to the target event bus ARN.",
      "Incorrect. Using SNS as an intermediary adds unnecessary complexity and latency. EventBridge natively supports cross-account event bus targeting without requiring an SNS bridge.",
      "Incorrect. The Schema Registry stores and discovers event schemas to help developers understand event structure — it does not control event routing or cross-account delivery.",
      "Correct. EventBridge global endpoints provide multi-region failover for event ingestion — they are not a mechanism for cross-account event delivery.",
    ],
    tags: ["eventbridge", "cross-account", "event-bus", "resource-policy"],
  },

  // --- NEW: Amazon RDS ---
  {
    id: "qq-138",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon RDS",
    question:
      "A developer's application connects to RDS using a username and password stored in environment variables. The security team requires credentials to rotate automatically every 30 days without application downtime. What is the BEST solution?",
    options: [
      "Enable RDS IAM database authentication and remove the password entirely",
      "Use an RDS Proxy to cache credentials and rotate them at the proxy layer",
      "Store credentials in Secrets Manager with automatic rotation enabled and use the Secrets Manager SDK to retrieve credentials at runtime",
      "Store credentials in SSM Parameter Store SecureString and update them with a scheduled Lambda",
    ],
    correctIndices: [2],
    explanation:
      "Secrets Manager has built-in rotation support for RDS — it rotates the password on the database and in the secret automatically. Applications use the Secrets Manager API to retrieve credentials at runtime and cache them with a short TTL. When rotation occurs, the next cache miss retrieves the new credentials transparently.",
    optionExplanations: [
      "Incorrect. Secrets Manager's managed rotation for RDS automatically updates the database password and the secret value on the configured schedule. Applications retrieve the current secret at runtime, so rotation is transparent.",
      "Incorrect. SSM Parameter Store does not have built-in rotation for RDS credentials. You could build a custom rotation Lambda, but Secrets Manager already has this built in — it's the purpose-built solution.",
      "Correct. IAM database authentication is a valid approach for eliminating passwords, but it requires changes to how the application connects (using an auth token instead of a password) and does not work with all database engines or client libraries.",
      "Incorrect. RDS Proxy can work with Secrets Manager to retrieve credentials, but the Proxy itself does not rotate credentials — Secrets Manager does. Using a Proxy alone doesn't solve the rotation requirement.",
    ],
    tags: ["rds", "secrets-manager", "rotation", "credentials", "security"],
  },
  {
    id: "qq-139",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "Amazon RDS",
    question:
      "An RDS Multi-AZ deployment fails over to the standby instance. The application experiences a connection error for approximately 60 seconds after the failover. What is the BEST way to minimize the connection disruption?",
    options: [
      "Increase the RDS instance size to reduce failover time",
      "Configure the application to retry connections with exponential backoff",
      "Use RDS Proxy to pool and maintain connections, which reconnects automatically during failover",
      "Switch to RDS Aurora which has near-zero failover time",
    ],
    correctIndices: [2],
    explanation:
      "RDS Proxy maintains a connection pool to the database and handles failover transparently. When the primary instance fails over, the Proxy reconnects to the new primary without the application needing to re-establish connections. This reduces application-visible disruption from ~60s to a few seconds.",
    optionExplanations: [
      "Incorrect. RDS Proxy sits between the application and RDS, maintaining persistent connections to the database. During a Multi-AZ failover, the Proxy automatically reconnects to the new primary, significantly reducing the time applications experience connection errors.",
      "Incorrect. Failover time in Multi-AZ is determined by DNS propagation and instance promotion, not instance size. A larger instance does not reduce failover duration.",
      "Correct. Retry with exponential backoff is a good practice and reduces error impact, but the application still experiences ~60 seconds of failed connections before the DNS update propagates. It doesn't reduce the failover window itself.",
      "Incorrect. Aurora does have faster failover (typically under 30 seconds), but the question asks how to minimize disruption for an existing Multi-AZ deployment. RDS Proxy is the more targeted answer and works with standard RDS Multi-AZ.",
    ],
    tags: ["rds", "multi-az", "failover", "rds-proxy", "availability"],
  },

  // --- NEW: AWS Step Functions ---
  {
    id: "qq-140",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Step Functions",
    question:
      "A Step Functions state machine needs to process 1,000 records in parallel. Each record requires an independent Lambda invocation. What state type should the developer use?",
    options: [
      "Parallel state with 1,000 branches each containing a Lambda Task",
      "A single Task state invoking a Lambda function that processes all records",
      "Map state with the records as the input array and a Lambda Task as the iterator",
      "Choice state branching to different Lambda functions based on record count",
    ],
    correctIndices: [2],
    explanation:
      "The Map state dynamically iterates over an array and runs the same set of steps for each item, in parallel. It's purpose-built for processing collections. Parallel state has a fixed number of branches defined at design time — it cannot scale dynamically to 1,000 items.",
    optionExplanations: [
      "Incorrect. The Map state accepts an array input and runs an iterator state machine for each element, optionally in parallel up to a configurable concurrency limit. This handles any array size dynamically.",
      "Incorrect. Parallel state branches are fixed in the state machine definition — you cannot define a dynamic number of branches at runtime. It's used for running known, distinct workflows concurrently.",
      "Correct. A single Lambda invocation processing all 1,000 records loses the parallelism and fault isolation benefits of Step Functions orchestration, and risks hitting Lambda's 15-minute timeout.",
      "Incorrect. Choice state evaluates conditions to branch to different states — it's for conditional logic, not parallel iteration over a collection.",
    ],
    tags: ["step-functions", "map-state", "parallel", "lambda"],
  },
  {
    id: "qq-141",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Step Functions",
    question:
      "A Step Functions state machine calls a third-party API that occasionally returns transient 503 errors. How should the developer configure the state machine to retry on 503 errors before failing?",
    options: [
      "Wrap the Task state in a Try/Catch block within the Lambda function",
      "Use a Wait state before each API call to prevent rate limiting",
      "Add a Retry field to the Task state specifying the error type, max attempts, interval, and backoff rate",
      "Add a Catch field to the Task state and route 503 errors back to the same state",
    ],
    correctIndices: [2],
    explanation:
      "Step Functions Task states support a Retry field with rules specifying ErrorEquals (error types to match), MaxAttempts, IntervalSeconds (initial wait), and BackoffRate (multiplier). This handles transient failures without Lambda-level retry logic. Catch handles errors after all retries are exhausted.",
    optionExplanations: [
      "Incorrect. The Retry field on a Task state is the purpose-built mechanism for automatic retries. You specify the error types, number of attempts, initial interval, and exponential backoff rate declaratively in the state machine definition.",
      "Incorrect. Handling retries inside the Lambda function works but defeats the purpose of Step Functions orchestration. Lambda has its own timeout constraints and doesn't benefit from Step Functions' exponential backoff or state visibility.",
      "Correct. Catch handles errors that occur after all retries are exhausted — it's for fallback routing, not for retrying. Using Catch to loop back to the same state is an anti-pattern that bypasses retry semantics.",
      "Incorrect. Wait states introduce a fixed delay — they don't retry failed operations or respond to specific error conditions. They're used for scheduled delays, not error handling.",
    ],
    tags: ["step-functions", "retry", "error-handling", "task-state"],
  },
  {
    id: "qq-142",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Step Functions",
    question:
      "A developer needs to pause a Step Functions execution and wait for a human approval before continuing. The wait period could be up to 7 days. What pattern should they use?",
    options: [
      "Use a Wait state with a fixed duration of 7 days",
      "Use a Task state with .waitForTaskToken and send the token to an external system for approval",
      "Use an Activity task with a worker that checks for approval every minute",
      "Poll a DynamoDB table from a Lambda function until an approval flag is set",
    ],
    correctIndices: [1],
    explanation:
      "The .waitForTaskToken integration pattern pauses the state machine execution indefinitely until an external system calls SendTaskSuccess or SendTaskFailure with the token. This is the correct pattern for human-in-the-loop workflows — the execution waits at zero cost until the approval arrives.",
    optionExplanations: [
      "Incorrect. .waitForTaskToken sends the task token to an external system (via SQS, SNS, API Gateway, etc.). The state machine pauses and resumes only when the token is returned via SendTaskSuccess/SendTaskFailure — no polling, no fixed wait.",
      "Correct. Wait state pauses for a fixed duration — it cannot pause indefinitely or resume based on an external event. It would resume after exactly 7 days regardless of whether approval happened.",
      "Incorrect. Polling DynamoDB from a Lambda in a loop wastes Lambda invocations, incurs cost, and is not how Step Functions is designed to be used. .waitForTaskToken is the purpose-built mechanism.",
      "Incorrect. Activity tasks use a polling worker, which means the worker must continuously poll for the task token. This requires a long-running worker process and is more complex than .waitForTaskToken for human approval scenarios.",
    ],
    tags: [
      "step-functions",
      "wait-for-task-token",
      "human-approval",
      "callback",
    ],
  },

  // --- NEW: AWS Secrets Manager ---
  {
    id: "qq-143",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS Secrets Manager",
    question:
      "A Lambda function retrieves a database password from Secrets Manager on every invocation. The team notices high Secrets Manager API costs. What is the BEST way to reduce these costs?",
    options: [
      "Increase the Lambda timeout so fewer cold starts occur",
      "Cache the secret in the Lambda execution environment and refresh only when a decryption error occurs or TTL expires",
      "Store the secret in an environment variable after the first retrieval",
      "Switch to SSM Parameter Store which has lower API costs",
    ],
    correctIndices: [1],
    explanation:
      "Fetching the secret outside the handler (in the init code) caches it in the execution environment across warm invocations. The AWS Secrets Manager Lambda extension further automates this with a local HTTP cache. Storing in an environment variable bypasses Secrets Manager entirely and defeats its rotation and audit benefits.",
    optionExplanations: [
      "Incorrect. Initialize the secret outside the handler so it is cached per execution environment. On warm invocations, the cached value is reused. Implement a TTL or catch rotation-related errors to refresh. The Secrets Manager Lambda extension handles this automatically.",
      "Correct. Storing the secret in a Lambda environment variable means it is visible in plaintext in the Lambda configuration, bypasses Secrets Manager's rotation, and loses the audit trail — this undermines the entire purpose of Secrets Manager.",
      "Incorrect. SSM Parameter Store SecureString is cheaper for static secrets but lacks automatic rotation for database credentials. The goal here is reducing API calls through caching, not switching services.",
      "Incorrect. Lambda timeout controls how long a function can run — it does not affect API call frequency per invocation or reduce the number of GetSecretValue calls.",
    ],
    tags: ["secrets-manager", "lambda", "caching", "cost"],
  },
  {
    id: "qq-144",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS Secrets Manager",
    question:
      "A secret in Secrets Manager is configured with automatic rotation. After rotation, some application instances start returning authentication errors. What is the MOST likely cause?",
    options: [
      "Secrets Manager changed the secret ARN during rotation",
      "The rotation Lambda function deleted the old secret version immediately after rotation",
      "The application cached the old secret value and has not retrieved the new version yet",
      "The RDS instance rejected the new password because it does not meet complexity requirements",
    ],
    correctIndices: [2],
    explanation:
      "During rotation, Secrets Manager stages versions: the new secret is AWSPENDING during creation, then promoted to AWSCURRENT, while the old value moves to AWSPREVIOUS. Applications caching the old credentials will get auth errors until they refresh. The AWSPREVIOUS stage is kept for a grace period precisely to handle in-flight connections.",
    optionExplanations: [
      "Incorrect. Applications that cache credentials in memory will continue using the old password after rotation. They need to detect auth errors, invalidate the cache, and re-fetch the current secret. Secrets Manager retains the old version as AWSPREVIOUS during the grace period.",
      "Incorrect. Secrets Manager retains the previous secret version (AWSPREVIOUS stage label) during the rotation grace period specifically to allow in-flight connections to complete. The old version is not immediately deleted.",
      "Correct. The secret ARN never changes during rotation — only the secret value and version labels change. Applications that use the ARN to retrieve the secret will always get the current version.",
      "Incorrect. The rotation Lambda function is responsible for setting the new password on the database. If the password didn't meet complexity requirements, the rotation would have failed and the secret would have rolled back — not partially succeeded.",
    ],
    tags: ["secrets-manager", "rotation", "caching", "troubleshooting"],
  },
  {
    id: "qq-145",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS Secrets Manager",
    question:
      "An ECS task in Account A needs to access a secret stored in Secrets Manager in Account B. What must be configured?",
    options: [
      "The ECS task must assume a role in Account B using STS before accessing the secret",
      "The secret must be replicated to Account A using Secrets Manager cross-region replication",
      "The secret's resource policy in Account B must allow the ECS task role from Account A, and the task role must have secretsmanager:GetSecretValue permission",
      "A VPC peering connection must be established between the two accounts",
    ],
    correctIndices: [2],
    explanation:
      "Cross-account Secrets Manager access requires a resource-based policy on the secret allowing the external principal, plus an IAM policy on the caller granting secretsmanager:GetSecretValue. The secret must also be encrypted with a KMS CMK (not the default AWS-managed key) and the key policy must allow the cross-account principal.",
    optionExplanations: [
      "Incorrect. The secret needs a resource policy allowing the Account A task role, the task role needs an IAM policy granting GetSecretValue on the secret ARN, and the KMS key policy must also allow the Account A principal to use the key for decryption.",
      "Incorrect. Cross-region replication copies a secret to another region within the same account — it does not copy secrets to a different AWS account.",
      "Correct. Secrets Manager is accessed via HTTPS API endpoints — no VPC peering is required for cross-account access. Network connectivity (VPC endpoint or internet) is needed, but not peering.",
      "Incorrect. Role assumption is one way to achieve cross-account access, but it is not required. With the correct resource policy and IAM policy, the ECS task can call Secrets Manager in Account B directly without assuming a role in Account B.",
    ],
    tags: ["secrets-manager", "cross-account", "iam", "resource-policy"],
  },

  // --- NEW: AWS CodeDeploy ---
  {
    id: "qq-146",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeDeploy",
    question:
      "A CodeDeploy deployment to EC2 instances succeeds on some instances but fails on others. The deployment is marked as failed and a rollback begins. Where should the developer look to find the specific error on the failed instances?",
    options: [
      "Amazon CloudWatch metrics for the CodeDeploy deployment",
      "AWS CloudTrail logs for the CodeDeploy API calls",
      "The CodeDeploy deployment group configuration in the console",
      "The CodeDeploy agent log at /var/log/aws/codedeploy-agent/ and the deployment lifecycle event logs in the CodeDeploy console",
    ],
    correctIndices: [3],
    explanation:
      "The CodeDeploy agent runs on each instance and writes detailed logs including lifecycle hook output, script errors, and file operation failures. The console also shows per-instance deployment status with lifecycle event details. These are the primary sources for diagnosing instance-level deployment failures.",
    optionExplanations: [
      "Incorrect. The CodeDeploy agent log (/var/log/aws/codedeploy-agent/codedeploy-agent.log) records what the agent did on each instance. The console shows each lifecycle event's status and the stdout/stderr from lifecycle hook scripts.",
      "Incorrect. CloudTrail logs CodeDeploy API operations (CreateDeployment, etc.) — it does not capture what happened on individual EC2 instances during the deployment lifecycle.",
      "Incorrect. The deployment group configuration shows settings like deployment strategy and target instances — it does not contain runtime error information from a specific deployment.",
      "Correct. CodeDeploy publishes high-level deployment metrics to CloudWatch, but instance-level lifecycle errors are not surfaced there. The agent logs and console event details are the right diagnostic tools.",
    ],
    tags: ["codedeploy", "troubleshooting", "ec2", "lifecycle-hooks"],
  },
  {
    id: "qq-147",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodeDeploy",
    question:
      "A team uses CodeDeploy to deploy to ECS with a blue/green deployment strategy. They want to run integration tests against the new (green) task set before shifting production traffic. How should they configure this?",
    options: [
      "Configure the deployment to use a Canary strategy and test during the initial traffic shift",
      "Add a Wait state in the deployment group configuration with a manual approval step",
      "Use the AfterAllowTraffic hook to run tests and roll back if tests fail",
      "Configure a BeforeAllowTraffic lifecycle hook that runs tests and calls PutLifecycleEventHookExecutionStatus to signal success or failure",
    ],
    correctIndices: [3],
    explanation:
      "The BeforeAllowTraffic lifecycle hook fires after the green task set is registered with the test listener but before any production traffic is shifted. A Lambda function can run integration tests against the test listener endpoint and call PutLifecycleEventHookExecutionStatus with Succeeded or Failed to control whether the deployment proceeds.",
    optionExplanations: [
      "Incorrect. BeforeAllowTraffic is the correct hook for pre-traffic validation. The green task set is running and accessible via the test listener, but no production traffic has shifted yet. Tests run and signal the result via PutLifecycleEventHookExecutionStatus.",
      "Incorrect. CodeDeploy ECS deployments do not have a built-in manual approval step in the deployment group configuration. Manual approvals in a pipeline are handled by CodePipeline approval actions, not within CodeDeploy itself.",
      "Incorrect. AfterAllowTraffic fires after production traffic has already shifted to the green task set. Running tests here means real users are already receiving traffic from the untested deployment — the window for pre-traffic validation has passed.",
      "Correct. Canary deployment strategy shifts a percentage of traffic to green first, then all remaining — it doesn't provide a zero-traffic testing window before any production traffic is shifted.",
    ],
    tags: ["codedeploy", "ecs", "blue-green", "lifecycle-hooks", "testing"],
  },
  {
    id: "qq-148",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeDeploy",
    question:
      "A CodeDeploy appspec.yml for an EC2 deployment specifies a BeforeInstall lifecycle hook script. The script takes 45 seconds to run but CodeDeploy marks it as failed after 30 seconds. What should the developer change?",
    options: [
      "Set the CodeDeploy deployment group timeout to 60 seconds",
      "Move the script logic to the AfterInstall hook which has a longer default timeout",
      "Increase the timeout value for the BeforeInstall hook in the appspec.yml hooks configuration",
      "Split the script into two scripts and run them in separate hooks",
    ],
    correctIndices: [2],
    explanation:
      "Each lifecycle hook in appspec.yml can specify a timeout value (in seconds). The default is 3600 seconds for most hooks, but if a custom timeout is configured and is too short, the hook will be terminated. Setting an appropriate timeout in the hooks section resolves the issue.",
    optionExplanations: [
      "Incorrect. The appspec.yml hooks section supports a timeout field per hook script (e.g. timeout: 60). Increasing this value gives the script enough time to complete before CodeDeploy marks it as timed out.",
      "Incorrect. AfterInstall does not have a longer default timeout than BeforeInstall — both default to 3600 seconds. Moving logic between hooks changes deployment ordering, not timeout behavior.",
      "Correct. Splitting the script into two hooks does not increase the total time available — each hook still has its configured or default timeout. It also changes the logical structure unnecessarily.",
      "Incorrect. The deployment group timeout controls the overall maximum duration of the entire deployment, not individual lifecycle hook script timeouts. The hook-level timeout is configured in appspec.yml.",
    ],
    tags: ["codedeploy", "appspec", "lifecycle-hooks", "timeout"],
  },

  // --- NEW: AWS SAM ---
  {
    id: "qq-149",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS SAM",
    question:
      "A developer defines an AWS::Serverless::Function resource in a SAM template with an Api event source. What AWS resources does SAM automatically create in addition to the Lambda function?",
    options: [
      "An API Gateway REST API, a deployment, and a stage",
      "An API Gateway HTTP API and a CloudFront distribution",
      "An API Gateway REST API and an IAM role with full Lambda permissions",
      "An Application Load Balancer and a target group",
    ],
    correctIndices: [0],
    explanation:
      "When a SAM function includes an Api event source, SAM automatically generates an AWS::ApiGateway::RestApi, a deployment, and a stage (defaulting to 'Prod'). These implicit resources are created in the transformed CloudFormation template — the developer only needs to define the function and event in the SAM template.",
    optionExplanations: [
      "Correct. SAM transforms the AWS::Serverless::Function with an Api event into a Lambda function plus an API Gateway REST API, deployment, and stage. This is the SAM transform's core convenience — one resource definition creates several CloudFormation resources.",
      "Incorrect. SAM's Api event source creates a REST API, not an HTTP API. HTTP API is a different API Gateway product. SAM does not create a CloudFront distribution automatically.",
      "Incorrect. SAM does create an IAM execution role for the Lambda function, but it grants the Lambda service permission to invoke the function — not full Lambda permissions. The API Gateway resources are REST API + deployment + stage, not just the REST API.",
      "Incorrect. SAM does not create ALB resources. The Api event source maps to API Gateway, not a load balancer.",
    ],
    tags: ["sam", "api-gateway", "transform", "serverless"],
  },
  {
    id: "qq-150",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS SAM",
    question:
      "A team wants to use SAM to gradually shift traffic to a new Lambda version using a canary deployment, with automatic rollback if CloudWatch alarms fire. What SAM feature enables this?",
    options: [
      "SAM Accelerate (sam sync) with a canary flag",
      "A CodeDeploy deployment group referenced in the SAM template Globals section",
      "AWS::Serverless::Application with a nested SAM template for canary logic",
      "DeploymentPreference on the function resource specifying type, alarms, and hooks",
    ],
    correctIndices: [3],
    explanation:
      "SAM's DeploymentPreference property on AWS::Serverless::Function integrates with CodeDeploy to shift traffic gradually (Canary, Linear, or AllAtOnce strategies). You specify Alarms to trigger automatic rollback and Hooks for pre/post-traffic Lambda functions — all configured declaratively in the SAM template.",
    optionExplanations: [
      "Incorrect. DeploymentPreference creates a CodeDeploy application and deployment group automatically. Set Type to Canary10Percent5Minutes (or similar), list CloudWatch alarm ARNs for automatic rollback, and optionally specify pre/post-traffic hook functions.",
      "Incorrect. AWS::Serverless::Application is for embedding nested applications from the SAR — it is not a mechanism for configuring canary deployment strategies on a function.",
      "Incorrect. You do not reference CodeDeploy deployment groups directly in SAM — SAM creates and manages the CodeDeploy resources automatically when DeploymentPreference is specified.",
      "Correct. sam sync (SAM Accelerate) is a fast deployment tool for inner-loop development that syncs code changes without a full CloudFormation deployment — it does not support canary traffic shifting.",
    ],
    tags: ["sam", "deployment-preference", "canary", "codedeploy", "rollback"],
  },
  {
    id: "qq-151",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS SAM",
    question:
      "A developer wants to test a SAM Lambda function locally with a simulated API Gateway event before deploying. What command should they use?",
    options: [
      "sam logs --tail to stream logs from a locally running function",
      "sam build followed by sam deploy --dry-run",
      "sam local invoke with an event JSON file, or sam local start-api to run a local HTTP server",
      "sam validate to check the template and simulate invocations",
    ],
    correctIndices: [2],
    explanation:
      "sam local invoke runs a Lambda function locally using Docker, passing an event from a JSON file. sam local start-api starts a local HTTP server that simulates API Gateway and invokes the function on each request. Both require Docker to be running locally.",
    optionExplanations: [
      "Incorrect. sam local invoke MyFunction -e event.json runs the function with a specific event payload. sam local start-api starts a local server on port 3000 (by default) that routes HTTP requests to the function, mimicking API Gateway behavior.",
      "Incorrect. sam build packages the function code and dependencies. sam deploy deploys to AWS — --dry-run does not exist as a flag and would not invoke the function locally.",
      "Correct. sam validate checks the SAM template for syntax errors — it does not simulate or invoke Lambda functions.",
      "Incorrect. sam logs tails log output from a deployed AWS Lambda function — it requires an actual deployment and does not run functions locally.",
    ],
    tags: ["sam", "local-testing", "lambda", "api-gateway"],
  },

  // --- NEW: AWS CDK ---
  {
    id: "qq-152",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CDK",
    question:
      "A developer runs cdk deploy for the first time in a new AWS account and region and receives an error saying the environment is not bootstrapped. What does bootstrapping create, and how is it done?",
    options: [
      "Bootstrapping installs the CDK CLI in the AWS account; run aws cdk install",
      "Bootstrapping creates the CDK app's VPC and networking prerequisites; run cdk init",
      "Bootstrapping creates an S3 bucket for assets and an ECR repository plus IAM roles; run cdk bootstrap to create them",
      "Bootstrapping configures AWS credentials for the CDK CLI; run aws configure",
    ],
    correctIndices: [2],
    explanation:
      "CDK bootstrapping deploys a CloudFormation stack (CDKToolkit) that provisions resources CDK needs to deploy: an S3 bucket for assets (Lambda code, Docker images), an ECR repository, and IAM roles for deployment. Run cdk bootstrap aws://ACCOUNT-ID/REGION once per account/region combination.",
    optionExplanations: [
      "Incorrect. cdk bootstrap creates the CDKToolkit stack containing the S3 staging bucket, ECR repository, and IAM roles (CloudFormationExecutionRole, DeploymentActionRole, etc.) required for CDK deployments in that account/region.",
      "Incorrect. The CDK CLI is installed locally via npm (npm install -g aws-cdk) — there is nothing to install in the AWS account itself.",
      "Correct. cdk init creates a new CDK app project locally from a template — it does not create any AWS resources or configure account-level prerequisites.",
      "Incorrect. aws configure sets up local AWS credentials and region — it is a prerequisite for CDK but is not the bootstrapping process that cdk bootstrap performs.",
    ],
    tags: ["cdk", "bootstrap", "deployment", "cloudformation"],
  },
  {
    id: "qq-153",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CDK",
    question:
      "A CDK app defines an S3 bucket with a Lambda function. The developer wants to ensure every S3 bucket in the app has versioning enabled, without modifying each bucket construct individually. What CDK feature allows this?",
    options: [
      "CDK Aspects, which visit every node in the construct tree and can validate or mutate properties",
      "CDK Context values set in cdk.json that override bucket defaults",
      "A CDK Stack environment variable that applies to all child constructs",
      "CDK Escape hatches that override CloudFormation resource properties globally",
    ],
    correctIndices: [0],
    explanation:
      "Aspects implement the IAspect interface and are applied to a scope (stack, app, or construct). CDK calls visit() on every node in the tree during synthesis. An Aspect can inspect each node and, if it's a Bucket, enable versioning — affecting all buckets without touching individual construct definitions.",
    optionExplanations: [
      "Correct. Aspects traverse the entire construct tree during synthesis. By implementing IAspect and calling Aspects.of(app).add(new MyAspect()), you can enforce policies (like versioning) across all matching constructs automatically.",
      "Incorrect. cdk.json context values are key-value pairs for parameterizing construct behavior — they don't automatically apply properties across all instances of a construct type.",
      "Incorrect. CDK stacks don't have environment variables that propagate to child construct configurations. Stack environment (account/region) is different from construct property defaults.",
      "Incorrect. Escape hatches (cfnBucket.addPropertyOverride) modify a specific resource's CloudFormation properties — they operate on individual construct instances, not globally across all constructs of a type.",
    ],
    tags: ["cdk", "aspects", "compliance", "constructs"],
  },
  {
    id: "qq-154",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CDK",
    question: "What is the difference between L1, L2, and L3 CDK constructs?",
    options: [
      "L1 constructs are language-specific, L2 are cross-language, and L3 are AWS-managed",
      "L1 constructs are for development, L2 for staging, and L3 for production deployments",
      "L1 are basic constructs, L2 add IAM policies, and L3 add VPC networking automatically",
      "L1 are CloudFormation resource wrappers (Cfn*), L2 add defaults and helper methods, L3 (patterns) combine multiple resources into a reusable higher-level component",
    ],
    correctIndices: [3],
    explanation:
      "CDK has three abstraction layers. L1 (Cfn*) are direct CloudFormation resource mappings with no defaults. L2 constructs add sensible defaults, security best practices, and helper methods (e.g. bucket.grantRead()). L3 constructs (patterns) like aws-ecs-patterns.ApplicationLoadBalancedFargateService combine multiple L2 resources into complete architectural patterns.",
    optionExplanations: [
      "Incorrect. L1 = 1:1 CloudFormation mapping, fully explicit. L2 = higher-level with defaults and convenience methods. L3 = opinionated patterns combining multiple services (e.g. API + Lambda + DynamoDB as one construct).",
      "Incorrect. L1/L2/L3 are abstraction levels, not deployment environment tiers. All three can be used in any environment.",
      "Incorrect. All construct levels can configure IAM policies and VPC networking — these are not distinguishing features between levels.",
      "Correct. CDK constructs at all levels are available in all supported languages (TypeScript, Python, Java, C#, Go) — language is not the differentiator.",
    ],
    tags: ["cdk", "constructs", "l1", "l2", "l3"],
  },

  // --- NEW: Amazon ECS ---
  {
    id: "qq-155",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon ECS",
    question:
      "An ECS task definition has two containers: an application container and a sidecar. The application container must not start until the sidecar is healthy. How should the developer configure this?",
    options: [
      "Use a Lambda function to start the application container after verifying the sidecar",
      "Set a dependsOn condition of HEALTHY on the sidecar in the application container's definition",
      "Set the sidecar container as essential: false so it starts independently",
      "Configure the application container's entryPoint to sleep until the sidecar port is open",
    ],
    correctIndices: [1],
    explanation:
      "ECS container dependencies (dependsOn) allow you to specify startup ordering within a task. The condition HEALTHY waits for the dependency container's health check to pass before starting the dependent container. Conditions include START (just started), COMPLETE (exited 0), SUCCESS (exited 0), and HEALTHY (health check passed).",
    optionExplanations: [
      "Incorrect. The dependsOn field in the application container's definition lists the sidecar with condition: HEALTHY. ECS will not start the application container until the sidecar's health check reports healthy.",
      "Correct. Adding a sleep in the entrypoint is fragile — it uses a fixed wait time rather than responding to actual sidecar health, and it wastes startup time when the sidecar is ready early.",
      "Incorrect. Setting essential: false means the task continues running if the sidecar exits — it has no effect on startup ordering.",
      "Incorrect. ECS manages container lifecycle within a task — using Lambda to orchestrate container startup adds unnecessary complexity when dependsOn handles this natively.",
    ],
    tags: ["ecs", "container-dependencies", "task-definition", "health-check"],
  },
  {
    id: "qq-156",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "Amazon ECS",
    question:
      "An ECS service on Fargate is consistently showing tasks in STOPPED state with the error 'CannotPullContainerError'. What are the MOST likely causes?",
    options: [
      "The container image tag specified in the task definition does not exist in the repository",
      "The ECS service's desired count is set higher than the cluster's available capacity",
      "The Fargate platform version is incompatible with the container runtime",
      "The task's subnet has no route to the ECR endpoint, or the task execution role lacks ecr:GetAuthorizationToken and ecr:BatchGetImage permissions",
    ],
    correctIndices: [3],
    explanation:
      "CannotPullContainerError on Fargate has two main causes: network (the task's ENI cannot reach ECR — needs a NAT Gateway, public IP, or VPC endpoint) and permissions (the task execution role needs ecr:GetAuthorizationToken, ecr:BatchGetImage, and ecr:GetDownloadUrlForLayer). The image tag not existing would show a different error.",
    optionExplanations: [
      "Incorrect. Fargate tasks pull images at startup. If the subnet is private with no NAT Gateway or ECR VPC endpoint, the pull fails. If the execution role is missing ECR permissions, the authorization step fails. Both present as CannotPullContainerError.",
      "Incorrect. Fargate doesn't have cluster capacity constraints the same way EC2 does — Fargate allocates resources on-demand. A capacity issue would result in task placement failures before the container pull stage.",
      "Incorrect. A missing image tag would cause a different error related to the image not being found (manifest unknown or similar) rather than CannotPullContainerError, which specifically indicates a connectivity or authentication failure.",
      "Correct. Platform version incompatibilities are rare and would typically be a configuration error surfaced at service creation, not at container pull time.",
    ],
    tags: ["ecs", "fargate", "ecr", "troubleshooting", "networking"],
  },
  {
    id: "qq-157",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon ECS",
    question:
      "A developer needs to pass a database connection string to an ECS container securely without storing it as a plaintext environment variable in the task definition. What is the recommended approach?",
    options: [
      "Pass the connection string as a Docker build argument in the task definition",
      "Reference the secret ARN from Secrets Manager or SSM Parameter Store in the task definition's secrets field",
      "Store the connection string in an S3 object and have the container download it at startup",
      "Build the connection string into the container image at build time",
    ],
    correctIndices: [1],
    explanation:
      "ECS supports the secrets field in container definitions, which references Secrets Manager secret ARNs or SSM Parameter Store parameter ARNs. ECS (via the task execution role) fetches the value at task startup and injects it as an environment variable — the value is never stored in plaintext in the task definition.",
    optionExplanations: [
      "Incorrect. The secrets field in an ECS container definition accepts Secrets Manager ARNs and SSM Parameter Store ARNs. The task execution role needs secretsmanager:GetSecretValue or ssm:GetParameters. ECS decrypts and injects the value at startup.",
      "Correct. Building secrets into container images is a serious security risk — the secret is stored in image layers, potentially in registries, and visible in image history. Never embed secrets in images.",
      "Incorrect. Docker build arguments are for build-time parameters — they cannot be passed at ECS task runtime and are not a secure secret injection mechanism.",
      "Incorrect. Downloading secrets from S3 at startup requires the container to have S3 access and custom startup script logic. This works but is more complex than the native secrets field integration and still requires careful access control.",
    ],
    tags: ["ecs", "secrets", "secrets-manager", "ssm", "security"],
  },

  // --- NEW: Amazon CloudFront ---
  {
    id: "qq-158",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "A CloudFront distribution serves an S3 bucket. The developer wants to ensure users can only access the S3 content through CloudFront and not directly via the S3 URL. What should they configure?",
    options: [
      "S3 Block Public Access on the bucket and a signed URL requirement on CloudFront",
      "A Lambda@Edge function that rejects requests not coming from CloudFront IP ranges",
      "An S3 bucket policy denying all public access and enabling CloudFront Transfer Acceleration",
      "Origin Access Control (OAC) on the distribution and a bucket policy allowing only the CloudFront service principal",
    ],
    correctIndices: [3],
    explanation:
      "OAC is the current recommended mechanism. It gives CloudFront an identity that can be granted access in the S3 bucket policy via the cloudfront.amazonaws.com service principal with a condition on the distribution ARN. Users who try to access the S3 URL directly are denied because the bucket has no public access policy.",
    optionExplanations: [
      "Incorrect. OAC (replacing the older OAI) lets CloudFront sign requests to S3 using SigV4. The bucket policy allows only the CloudFront service principal (aws:SourceArn matching the distribution ARN). Direct S3 access is blocked because no other principal is allowed.",
      "Incorrect. Block Public Access and signed URLs are separate concepts. Signed URLs control who can access CloudFront, not whether S3 is directly accessible. You still need OAC/OAI to restrict direct S3 access.",
      "Incorrect. Transfer Acceleration is for accelerating uploads to S3 — it has nothing to do with restricting direct S3 access or enforcing CloudFront routing.",
      "Correct. Using Lambda@Edge to check CloudFront IPs is fragile (IP ranges change), adds latency, and is unnecessary when OAC + bucket policy is the purpose-built solution.",
    ],
    tags: ["cloudfront", "s3", "oac", "origin-access-control", "security"],
  },
  {
    id: "qq-159",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "A CloudFront distribution caches API responses. After deploying a bug fix, users are still receiving stale responses. The developer needs to immediately clear the cache for a specific API path. What should they do?",
    options: [
      "Update the CloudFront distribution configuration to set the TTL to 0 for that path",
      "Delete and recreate the CloudFront distribution to clear all cached content",
      "Create a CloudFront invalidation for the specific path pattern (e.g. /api/products/*)",
      "Change the API Gateway stage name to force CloudFront to treat it as a new origin path",
    ],
    correctIndices: [2],
    explanation:
      "CloudFront invalidations remove objects from edge caches before their TTL expires. You specify path patterns (e.g. /api/products/* or /*) and CloudFront propagates the invalidation to all edge locations. The first 1,000 paths per month are free; additional paths incur a charge.",
    optionExplanations: [
      "Incorrect. Create an invalidation in the CloudFront console or via the API with the path pattern to invalidate. CloudFront removes matching objects from all edge caches, forcing the next request to fetch from the origin.",
      "Incorrect. Changing the TTL to 0 affects future caching behavior — it does not purge objects already cached at edge locations. Users would still receive stale content until existing cached objects expire.",
      "Correct. Deleting and recreating the distribution is destructive, changes the distribution domain name, and takes much longer than creating an invalidation. It is never the right approach for cache clearing.",
      "Incorrect. Changing the API Gateway stage name changes the origin path but does not clear what CloudFront has already cached under the old path. Cached objects remain until TTL or invalidation.",
    ],
    tags: ["cloudfront", "invalidation", "caching", "deployment"],
  },
  {
    id: "qq-160",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "A developer needs to serve premium video content via CloudFront and ensure only authenticated, paying subscribers can download the files. What CloudFront feature should they use?",
    options: [
      "CloudFront field-level encryption to restrict access to subscriber data",
      "CloudFront signed URLs or signed cookies, generated server-side using a CloudFront key pair",
      "CloudFront Origin Access Control with subscriber-specific IAM roles",
      "S3 presigned URLs generated by a Lambda function for each request",
    ],
    correctIndices: [1],
    explanation:
      "Signed URLs grant time-limited access to a single object. Signed cookies grant access to multiple objects matching a pattern — better for streaming or multi-file subscriptions. Both are signed with a CloudFront key pair (Ed25519 or RSA) and can encode expiry, IP restrictions, and path patterns.",
    optionExplanations: [
      "Incorrect. Signed URLs are ideal for single file downloads. Signed cookies are better for HLS video streaming (multiple segments) or subscription access to a directory. Both restrict access to authenticated subscribers and expire after a configured time.",
      "Correct. OAC restricts which AWS service (CloudFront) can access the S3 origin — it doesn't authenticate end users or implement subscriber access control.",
      "Incorrect. S3 presigned URLs bypass CloudFront entirely and go directly to S3. This loses CloudFront's edge caching, CDN performance, and any other CloudFront features (WAF, geo-restriction, etc.).",
      "Incorrect. Field-level encryption protects sensitive form fields (like credit card numbers) in POST requests — it is not a mechanism for controlling who can access content objects.",
    ],
    tags: [
      "cloudfront",
      "signed-urls",
      "signed-cookies",
      "security",
      "access-control",
    ],
  },

  // --- NEW: AWS CodeBuild ---
  {
    id: "qq-161",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeBuild",
    question:
      "A CodeBuild project builds a Docker image and pushes it to ECR. The build is failing with 'AccessDeniedException' when pushing to ECR. What is the MOST likely cause?",
    options: [
      "The ECR repository does not exist in the same region as the CodeBuild project",
      "The buildspec.yml is missing the docker login command before the push",
      "The CodeBuild service role is missing ecr:GetAuthorizationToken and ecr:BatchCheckLayerAvailability/ecr:PutImage permissions",
      "CodeBuild cannot push to ECR — a separate Lambda function must perform the push",
    ],
    correctIndices: [2],
    explanation:
      "CodeBuild uses its service role for all AWS API calls. To push to ECR, the role needs ecr:GetAuthorizationToken (to get a login token) plus ecr:BatchCheckLayerAvailability, ecr:PutImage, and ecr:InitiateLayerUpload on the specific repository. The AWS-managed policy AmazonEC2ContainerRegistryPowerUser grants these.",
    optionExplanations: [
      "Incorrect. The CodeBuild service role is the identity used for all AWS API calls during the build. Missing ECR permissions on this role causes AccessDeniedException. The buildspec runs aws ecr get-login-password which calls ecr:GetAuthorizationToken using the service role's credentials.",
      "Incorrect. The buildspec does need docker login (or aws ecr get-login-password piped to docker login), but if that command fails with AccessDeniedException it's a role permissions issue, not a missing command issue.",
      "Correct. CodeBuild can push to ECR repositories in the same or different regions. A cross-region push works as long as the repository URI and permissions are correct.",
      "Incorrect. CodeBuild can absolutely push Docker images to ECR — this is one of the most common CodeBuild use cases. No Lambda intermediary is needed.",
    ],
    tags: ["codebuild", "ecr", "iam", "docker", "troubleshooting"],
  },
  {
    id: "qq-162",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeBuild",
    question:
      "A CodeBuild project runs npm install on every build, which takes 3 minutes. The developer wants to cache node_modules across builds to speed this up. What should they configure?",
    options: [
      "Use a custom Docker image with node_modules pre-installed as the CodeBuild environment image",
      "Add a pre_build phase that downloads node_modules from S3 before npm install",
      "Enable CodeBuild Local Cache on the build fleet to persist node_modules between builds",
      "Enable S3 caching in the CodeBuild project and specify /root/.npm or node_modules as cache paths in buildspec.yml",
    ],
    correctIndices: [3],
    explanation:
      "CodeBuild supports S3 caching for arbitrary local paths. After a build, CodeBuild zips the specified paths and stores them in S3. On subsequent builds, it restores the cache before the build phases. This is the standard way to cache package manager dependencies across builds.",
    optionExplanations: [
      "Incorrect. Configure cache type: S3 in the project settings and add cache paths (e.g. node_modules or /root/.npm) in buildspec.yml. CodeBuild saves and restores the cache automatically, reducing npm install time on cache hits.",
      "Incorrect. A custom Docker image with pre-installed node_modules would freeze dependencies at image build time and not reflect package.json changes — it doesn't actually cache the current build's dependencies dynamically.",
      "Incorrect. Manually managing an S3 cache in the buildspec is essentially rebuilding CodeBuild's built-in caching mechanism — it's unnecessary extra code.",
      "Correct. CodeBuild does support local caching (for source, Docker layers, and custom cache) when using a dedicated build fleet, but S3 caching is the standard approach for most projects and doesn't require a dedicated fleet.",
    ],
    tags: ["codebuild", "caching", "npm", "performance"],
  },
  {
    id: "qq-163",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeBuild",
    question:
      "A CodeBuild buildspec.yml needs to use a database password during integration tests. The developer does not want the password to appear in build logs. What is the correct approach?",
    options: [
      "Store the password in Secrets Manager or SSM Parameter Store and reference it as an environment variable with type SECRETS_MANAGER or PARAMETER_STORE in the project configuration",
      "Set the environment variable in buildspec.yml and mark the phase as no-export",
      "Base64-encode the password in the buildspec.yml env section to obscure it",
      "Use a CodeBuild private environment and the password will be automatically masked",
    ],
    correctIndices: [0],
    explanation:
      "CodeBuild environment variables support three types: PLAINTEXT, PARAMETER_STORE (SSM), and SECRETS_MANAGER. When using the latter two, CodeBuild retrieves the value at runtime and masks it in build logs. The password is never stored in the buildspec or project definition in plaintext.",
    optionExplanations: [
      "Correct. Set the environment variable type to SECRETS_MANAGER or PARAMETER_STORE in the CodeBuild project or buildspec env section. CodeBuild fetches the value at runtime and masks it in CloudWatch Logs automatically.",
      "Incorrect. buildspec.yml does not have a no-export flag for phases. Any plaintext value in the env section of buildspec.yml is stored in the project definition and visible in build logs.",
      "Incorrect. Base64 encoding is not encryption — it's trivially reversible and provides no security. The encoded value would still appear in build logs.",
      "Incorrect. There is no automatic masking of environment variables in a 'private environment'. CodeBuild masks values only for PARAMETER_STORE and SECRETS_MANAGER type environment variables.",
    ],
    tags: ["codebuild", "secrets", "security", "environment-variables"],
  },
  {
    id: "qq-164",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodeBuild",
    question:
      "A CodeBuild project needs to run integration tests against an RDS database in a private subnet with no internet access. What configuration is required?",
    options: [
      "Deploy a bastion host in the private subnet and have CodeBuild SSH through it",
      "Use an AWS PrivateLink endpoint for CodeBuild to access the private subnet",
      "Configure the CodeBuild project to run inside the VPC by specifying the VPC ID, subnets, and security group",
      "Create a VPC peering connection between the CodeBuild service VPC and the application VPC",
    ],
    correctIndices: [2],
    explanation:
      "CodeBuild supports VPC configuration — you specify a VPC ID, private subnets, and a security group. CodeBuild places the build environment ENIs in those subnets, giving builds direct network access to resources like RDS, ElastiCache, and internal services without internet exposure.",
    optionExplanations: [
      "Incorrect. VPC-enabled CodeBuild projects run with ENIs in your specified subnets. The security group controls inbound/outbound traffic. The RDS security group must allow inbound from the CodeBuild security group.",
      "Incorrect. CodeBuild builds run in AWS-managed infrastructure — there is no CodeBuild-owned VPC to peer with. The VPC configuration approach places build ENIs directly in your VPC.",
      "Correct. AWS PrivateLink endpoints allow private connectivity to AWS services from within a VPC, not the other way around. The solution is running CodeBuild inside the VPC, not adding an endpoint.",
      "Incorrect. SSH through a bastion adds complexity and requires managing SSH keys and bastion infrastructure. The native VPC configuration is the purpose-built solution.",
    ],
    tags: ["codebuild", "vpc", "rds", "networking", "private-subnet"],
  },

  // --- NEW: AWS Elastic Beanstalk ---
  {
    id: "qq-165",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Elastic Beanstalk",
    question:
      "A developer needs to install a custom package and configure a cron job on every EC2 instance in an Elastic Beanstalk environment. What is the correct approach?",
    options: [
      "Create a custom AMI with the package pre-installed and configure Beanstalk to use it",
      "Use AWS Systems Manager Run Command to execute configuration scripts after deployment",
      "Use .ebextensions configuration files in the application bundle to run commands and configure files during deployment",
      "SSH into each instance and manually configure the package and cron job",
    ],
    correctIndices: [2],
    explanation:
      ".ebextensions are YAML/JSON configuration files placed in a .ebextensions/ directory in the application bundle. They run during instance provisioning and deployment using the commands, container_commands, files, and packages keys — enabling package installation, file creation, and cron job configuration as code.",
    optionExplanations: [
      "Incorrect. .ebextensions files are processed on every instance during deployment. The packages key installs system packages, files creates or modifies files (including cron files in /etc/cron.d/), and commands runs shell commands.",
      "Incorrect. Manual SSH configuration is not repeatable, is wiped on instance replacement, and doesn't scale. Beanstalk can replace instances during scaling or health events.",
      "Correct. A custom AMI works for pre-installed packages but doesn't update automatically with new package versions, requires AMI management overhead, and doesn't handle per-deployment configuration changes.",
      "Incorrect. Systems Manager Run Command can execute scripts on instances but runs after Beanstalk deployment completes and requires SSM agent to be installed. .ebextensions is the purpose-built mechanism for instance configuration during deployment.",
    ],
    tags: ["elastic-beanstalk", "ebextensions", "configuration", "deployment"],
  },
  {
    id: "qq-166",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS Elastic Beanstalk",
    question:
      "An Elastic Beanstalk environment is running a web application. During a deployment, the team wants zero downtime and the ability to instantly roll back if the new version has issues. Which deployment policy should they use?",
    options: [
      "Rolling deployment with batch size 1 to minimize impact during updates",
      "Blue/green by using Beanstalk's environment swap (CNAME swap) after testing on a separate environment",
      "Immutable deployment, which launches a new set of instances and only cuts over after health checks pass",
      "All at once deployment for speed, relying on Beanstalk's automatic rollback",
    ],
    correctIndices: [2],
    explanation:
      "Immutable deployments launch a completely new set of instances with the new version in a temporary Auto Scaling group. Only if all new instances pass health checks does traffic shift. Rollback is instant — just terminate the new instances. The old instances continue serving traffic throughout.",
    optionExplanations: [
      "Incorrect. Immutable deployments maintain the old fleet in service throughout the deployment. A new ASG with new instances is launched, tested, then added to the load balancer. The old ASG is terminated. Rollback is instant: terminate the new ASG.",
      "Incorrect. Rolling deployments update instances in batches — during the update, some instances run the old version and some run the new. There is partial downtime (reduced capacity) and rollback requires another rolling deployment.",
      "Correct. All at once updates all instances simultaneously — there is downtime during the deployment and rollback requires redeploying the old version. This is the riskiest option.",
      "Incorrect. Blue/green with CNAME swap is also a valid zero-downtime strategy, but the question asks about a single environment. CNAME swap involves two full Beanstalk environments and is more operationally complex than immutable deployments.",
    ],
    tags: [
      "elastic-beanstalk",
      "deployment",
      "immutable",
      "zero-downtime",
      "rollback",
    ],
  },
  {
    id: "qq-167",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "AWS Elastic Beanstalk",
    question:
      "An Elastic Beanstalk deployment completes successfully but the application is returning 502 errors. Where should the developer look first to diagnose the issue?",
    options: [
      "The application logs accessible via the Beanstalk console Logs section, and the /var/log/nginx/error.log or /var/log/httpd/error_log on the instance",
      "AWS CloudTrail to find the API calls made during the deployment",
      "The Beanstalk environment configuration to check instance type and scaling settings",
      "CloudWatch metrics for the Elastic Load Balancer to identify throttling",
    ],
    correctIndices: [0],
    explanation:
      "502 Bad Gateway means the load balancer reached the instance but the application process returned an invalid response or wasn't listening on the expected port. Application logs show crashes and startup errors. The reverse proxy error log (nginx/Apache) shows exactly what happened between the proxy and the app process.",
    optionExplanations: [
      "Correct. The Beanstalk Logs section retrieves logs from all instances. Nginx or Apache error logs show 502 causes (upstream connection refused, app not listening on expected port, timeout). Application stdout/stderr logs show application crashes.",
      "Incorrect. CloudTrail logs API operations against Beanstalk — it does not contain application-level HTTP errors or runtime process failures.",
      "Incorrect. Instance type and scaling settings are configuration concerns — they don't explain why the application is returning 502 errors after a successful deployment.",
      "Incorrect. ELB throttling causes 503 errors (service unavailable), not 502. 502 specifically indicates the backend instance returned an invalid HTTP response or the connection was refused.",
    ],
    tags: ["elastic-beanstalk", "troubleshooting", "502", "logs"],
  },
  {
    id: "qq-168",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Elastic Beanstalk",
    question:
      "A developer needs to run a long-running background job that processes messages from an SQS queue, separate from the web tier that handles HTTP requests. What Elastic Beanstalk feature supports this architecture?",
    options: [
      "A Worker environment tier that automatically polls an SQS queue and delivers messages to the application via HTTP POST to /",
      "A second Web Server environment tier that is configured to poll SQS",
      "A Lambda function triggered by the SQS queue, deployed alongside the Beanstalk environment",
      "An EC2 Auto Scaling group deployed separately from Beanstalk that runs the worker process",
    ],
    correctIndices: [0],
    explanation:
      "Elastic Beanstalk Worker environments are designed for background processing. Beanstalk deploys an SQS daemon on each instance that polls the queue and delivers each message as an HTTP POST to localhost. The application only needs to expose an HTTP endpoint — no SQS SDK code required.",
    optionExplanations: [
      "Correct. Worker tier environments include a built-in SQS daemon. You configure the SQS queue and the worker tier polls it, posting messages to the application's / endpoint (or a configurable path). The web tier and worker tier are separate Beanstalk environments.",
      "Incorrect. Web Server tier environments are for handling HTTP requests from users via a load balancer — they are not designed for SQS polling and do not include the SQS daemon.",
      "Incorrect. A standalone Lambda function works but is not a Beanstalk feature. The question specifically asks about Elastic Beanstalk architecture — Worker tier is the Beanstalk-native answer.",
      "Incorrect. A standalone EC2 Auto Scaling group exists outside of Beanstalk and loses all of Beanstalk's deployment, monitoring, and management benefits. Worker tier is the managed Beanstalk solution.",
    ],
    tags: ["elastic-beanstalk", "worker-tier", "sqs", "background-processing"],
  },

  // --- NEW: AWS CodePipeline ---
  {
    id: "qq-169",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodePipeline",
    question:
      "A CodePipeline pipeline deploys to a production environment. The team wants a manual approval step before the production deployment executes. What should they add to the pipeline?",
    options: [
      "A CodeBuild action that sends an email and pauses until a reply is received",
      "A Manual Approval action in a stage between the build stage and the production deploy stage",
      "A Lambda action that checks an approval DynamoDB table before proceeding",
      "A Gate condition on the production deploy action using an IAM policy",
    ],
    correctIndices: [1],
    explanation:
      "CodePipeline has a built-in Manual Approval action type. When the pipeline reaches this action, it pauses and sends an SNS notification. A reviewer approves or rejects via the console, CLI, or SDK. The pipeline resumes on approval or fails on rejection.",
    optionExplanations: [
      "Incorrect. Add a stage with an Approval action between build and production deployment. Configure an SNS topic for notifications. The pipeline pauses until a reviewer with codepipeline:PutApprovalResult permission approves or rejects.",
      "Correct. CodeBuild cannot pause a pipeline — a CodeBuild action runs to completion. There is no mechanism for CodeBuild to pause the pipeline pending an email reply.",
      "Incorrect. A Lambda action runs to completion and signals success or failure — it cannot pause the pipeline indefinitely for a human decision. Lambda actions are for automated checks, not human approvals.",
      "Incorrect. CodePipeline does not support IAM-based gate conditions on individual actions. Access control determines who can interact with the pipeline, not whether it proceeds.",
    ],
    tags: ["codepipeline", "manual-approval", "deployment", "governance"],
  },
  {
    id: "qq-170",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodePipeline",
    question:
      "A CodePipeline pipeline has a CodeBuild stage that produces a build artifact. A later CodeDeploy stage needs to use that artifact. How are artifacts passed between stages in CodePipeline?",
    options: [
      "Artifacts are passed as environment variables between pipeline stages",
      "Each stage writes its output to a shared EFS file system that subsequent stages read from",
      "CodePipeline stores artifacts in an S3 bucket and passes the artifact reference between actions; each action specifies its input and output artifacts by name",
      "Each action must upload its output to a fixed S3 key that downstream actions know to read from",
    ],
    correctIndices: [2],
    explanation:
      "CodePipeline uses an S3 artifact bucket to pass data between actions. Each action declares InputArtifacts and OutputArtifacts by name. CodePipeline handles uploading and downloading automatically — actions access their input artifacts from the workspace without managing S3 keys directly.",
    optionExplanations: [
      "Incorrect. CodePipeline manages artifact storage in S3. A CodeBuild action declares an OutputArtifact named e.g. 'BuildOutput'. The CodeDeploy action declares 'BuildOutput' as its InputArtifact. CodePipeline passes the S3 location automatically.",
      "Incorrect. EFS is not used by CodePipeline for artifact passing. Actions run in separate environments (CodeBuild containers, CodeDeploy agent) — shared EFS would require complex network configuration.",
      "Correct. Environment variables in CodePipeline are used for action configuration parameters, not for passing binary artifacts like build outputs or deployment packages.",
      "Incorrect. While artifacts are stored in S3, actions don't manage S3 keys directly. CodePipeline abstracts the storage — actions reference artifacts by their declared name and CodePipeline handles the rest.",
    ],
    tags: ["codepipeline", "artifacts", "s3", "codebuild", "codedeploy"],
  },
  {
    id: "qq-171",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodePipeline",
    question:
      "A team wants their pipeline to trigger automatically whenever code is pushed to the main branch of their CodeCommit repository. What is the recommended way to configure this trigger?",
    options: [
      "Create an Amazon EventBridge rule that matches CodeCommit repository state change events and targets the CodePipeline StartPipelineExecution API",
      "Configure a CodeCommit trigger that calls the pipeline webhook directly",
      "Enable polling in the CodePipeline source action to check for new commits every minute",
      "Use a Lambda function subscribed to CodeCommit notifications to start the pipeline",
    ],
    correctIndices: [0],
    explanation:
      "EventBridge is the recommended trigger mechanism for CodePipeline. When new commits are pushed to CodeCommit, CodeCommit publishes an event to EventBridge. An EventBridge rule matches the event and invokes codepipeline:StartPipelineExecution. This is event-driven with low latency, unlike polling.",
    optionExplanations: [
      "Correct. EventBridge rules with CodeCommit as the source provide near-instant pipeline triggering on push. When you create a pipeline with a CodeCommit source in the console, the EventBridge rule is created automatically.",
      "Incorrect. CodeCommit triggers can notify SNS or invoke Lambda — they don't directly start CodePipeline executions. An EventBridge rule is the correct integration path.",
      "Incorrect. Polling checks for changes on a schedule (default 1 minute) and has higher latency than event-driven triggering. AWS recommends EventBridge over polling for all new pipelines.",
      "Incorrect. Using a Lambda function to start the pipeline via CodeCommit notifications adds an unnecessary intermediate step — EventBridge can invoke CodePipeline directly without a Lambda.",
    ],
    tags: ["codepipeline", "codecommit", "eventbridge", "triggers", "cicd"],
  },
  {
    id: "qq-172",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodePipeline",
    question:
      "A pipeline deploys to three environments: dev, staging, and production in separate AWS accounts. What is the BEST way to structure this multi-account deployment?",
    options: [
      "Use AWS Organizations to share the CodePipeline with all member accounts",
      "Use cross-account roles — each target account has a deployment role that the pipeline's CodePipeline role can assume, and CodeDeploy or CloudFormation executes in the target account",
      "Deploy all environments to the same account and use separate VPCs for isolation",
      "Create a separate CodePipeline in each account and trigger them sequentially via EventBridge",
    ],
    correctIndices: [1],
    explanation:
      "CodePipeline supports cross-account deployments via role assumption. The pipeline's IAM role assumes a cross-account role in each target account. CloudFormation or CodeDeploy actions run in the target account's context. The artifact S3 bucket must be accessible from all accounts (cross-account bucket policy or KMS CMK sharing).",
    optionExplanations: [
      "Incorrect. The pipeline role assumes account-specific deployment roles via STS. Each target account has a role trusting the pipeline's account. CloudFormation/CodeDeploy run under the assumed role in the target account. The artifact bucket key must allow cross-account access.",
      "Correct. Separate pipelines per account require complex triggering logic, duplicate pipeline definitions, and make it hard to enforce a single deployment sequence across environments.",
      "Incorrect. Using separate VPCs in one account does not provide the account-level isolation, billing separation, and security boundaries that separate accounts provide.",
      "Incorrect. AWS Organizations is for account management and SCP governance — it does not share CodePipeline across accounts or enable multi-account deployments.",
    ],
    tags: [
      "codepipeline",
      "cross-account",
      "multi-account",
      "iam",
      "deployment",
    ],
  },

  // --- NEW: Amazon VPC ---
  {
    id: "qq-173",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon VPC",
    question:
      "A Lambda function in a VPC needs to call the DynamoDB API without routing traffic through the internet. The VPC has no NAT Gateway. What is the MOST cost-effective solution?",
    options: [
      "Create a VPC Gateway Endpoint for DynamoDB, which routes DynamoDB traffic through AWS's private network at no additional cost",
      "Add a NAT Gateway to the VPC to enable internet access for the Lambda function",
      "Move the Lambda function outside the VPC so it can use the public DynamoDB endpoint",
      "Create a VPC Interface Endpoint (PrivateLink) for DynamoDB",
    ],
    correctIndices: [0],
    explanation:
      "DynamoDB and S3 support Gateway Endpoints, which are free and route traffic through AWS's private network via the VPC route table. No NAT Gateway, no internet gateway, and no per-hour or data processing charges. Interface Endpoints (PrivateLink) work for most other AWS services but incur hourly and data charges.",
    optionExplanations: [
      "Correct. Gateway Endpoints for DynamoDB and S3 are free. They add an entry to your route table directing DynamoDB traffic to the endpoint, keeping it within the AWS network. No NAT Gateway needed.",
      "Incorrect. A NAT Gateway costs $0.045/hour plus data processing charges — it's significantly more expensive than a free Gateway Endpoint, and unnecessary when a Gateway Endpoint achieves the same result.",
      "Incorrect. Moving Lambda outside the VPC gives it internet access but means it can no longer reach private VPC resources (RDS, ElastiCache, etc.) — it's a tradeoff that may break other requirements.",
      "Incorrect. DynamoDB supports both Gateway Endpoints (free) and Interface Endpoints (paid). For cost-effectiveness, Gateway Endpoint is the correct choice for DynamoDB and S3.",
    ],
    tags: ["vpc", "gateway-endpoint", "dynamodb", "lambda", "cost"],
  },
  {
    id: "qq-174",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "Amazon VPC",
    question:
      "A security team needs to audit all network traffic entering and leaving a VPC for compliance. They need to capture source IP, destination IP, ports, protocol, and whether the traffic was accepted or rejected. What should they enable?",
    options: [
      "Amazon GuardDuty to analyze VPC traffic patterns and detect anomalies",
      "AWS Config rules to evaluate VPC security group configurations",
      "AWS CloudTrail with data events enabled for all VPC API calls",
      "VPC Flow Logs published to CloudWatch Logs or S3, which capture IP traffic metadata for network interfaces",
    ],
    correctIndices: [3],
    explanation:
      "VPC Flow Logs capture IP traffic metadata (not packet contents) for ENIs, subnets, or the entire VPC. Each log record includes srcaddr, dstaddr, srcport, dstport, protocol, packets, bytes, and action (ACCEPT/REJECT). Published to CloudWatch Logs or S3 for analysis.",
    optionExplanations: [
      "Incorrect. VPC Flow Logs are the purpose-built tool for network traffic auditing in AWS. They capture the exact fields mentioned: source/destination IP, ports, protocol, and accept/reject action. They can be queried in CloudWatch Logs Insights or Athena.",
      "Incorrect. CloudTrail logs AWS API calls (management events) — it does not capture network-level IP traffic between resources. It would show 'CreateInstance' but not the TCP connections the instance makes.",
      "Incorrect. GuardDuty analyzes VPC Flow Logs and DNS logs to detect threats — it is a threat detection service built on top of flow data, not the raw audit log itself.",
      "Correct. AWS Config evaluates resource configurations against rules — it tracks configuration changes (e.g. 'security group rule changed') but does not capture runtime network traffic.",
    ],
    tags: ["vpc", "flow-logs", "auditing", "security", "compliance"],
  },
  {
    id: "qq-175",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon VPC",
    question:
      "A security group rule allows inbound traffic on port 443 from 0.0.0.0/0. A NACL on the same subnet denies inbound traffic on port 443. Which takes effect?",
    options: [
      "The NACL deny takes effect — NACLs are evaluated before security groups and an explicit NACL deny blocks traffic before it reaches the security group",
      "The security group allow takes effect — security groups have higher priority than NACLs",
      "Both are evaluated independently and traffic is allowed since at least one rule allows it",
      "The most restrictive rule wins — the deny takes effect because deny is more specific than allow",
    ],
    correctIndices: [0],
    explanation:
      "NACLs are stateless and evaluated at the subnet boundary before traffic reaches the instance (and its security group). An explicit NACL deny on port 443 drops the packet at the subnet level — it never reaches the instance for security group evaluation. Security groups only evaluate traffic that passes the NACL.",
    optionExplanations: [
      "Correct. NACLs operate at the subnet boundary and are stateless. Traffic hits the NACL first. If an explicit deny matches, the packet is dropped and never reaches the instance or its security group.",
      "Incorrect. Security groups do not have higher priority than NACLs — they operate at different layers. NACLs are subnet-level; security groups are instance-level. Subnet-level evaluation happens first.",
      "Incorrect. NACLs and security groups are not evaluated as a union — they are evaluated in sequence. A NACL deny means the packet doesn't reach the security group for evaluation.",
      "Incorrect. While the outcome (deny wins) is correct, the reasoning is wrong. It's not about specificity — it's about evaluation order. NACLs evaluate first, and an explicit deny stops processing before security groups are consulted.",
    ],
    tags: ["vpc", "nacl", "security-group", "networking", "traffic-filtering"],
  },
  {
    id: "qq-176",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon VPC",
    question:
      "Two VPCs need to communicate privately. VPC A has CIDR 10.0.0.0/16 and VPC B has CIDR 10.0.0.0/16. Which option allows private connectivity?",
    options: [
      "Use VPC sharing via AWS Resource Access Manager to share subnets between VPCs",
      "Create a VPC peering connection — peering works regardless of CIDR overlap",
      "Use AWS Transit Gateway which handles overlapping CIDRs through its routing table",
      "Neither VPC peering nor Transit Gateway will work due to overlapping CIDRs — redesign the IP address scheme",
    ],
    correctIndices: [3],
    explanation:
      "VPC peering and Transit Gateway do not support overlapping CIDR blocks. If two VPCs have the same CIDR range (both 10.0.0.0/16), routing is ambiguous — AWS cannot determine which VPC a destination IP belongs to. The solution is to use non-overlapping CIDRs from the start.",
    optionExplanations: [
      "Incorrect. VPC peering explicitly prohibits overlapping CIDRs, and Transit Gateway also requires non-overlapping CIDRs for connected VPCs. The only solution is to redesign the IP addressing so the VPCs have distinct CIDR ranges.",
      "Incorrect. VPC peering has a hard requirement for non-overlapping CIDRs. AWS will reject a peering request if the VPCs have overlapping IP ranges.",
      "Incorrect. Transit Gateway also requires non-overlapping CIDRs between attached VPCs. It cannot route traffic when the source and destination share the same IP range.",
      "Correct. VPC sharing (RAM) allows subnets from one VPC to be shared with another account — it doesn't create routing between separate VPCs with overlapping CIDRs.",
    ],
    tags: ["vpc", "peering", "cidr", "networking", "transit-gateway"],
  },

  // --- NEW: AWS AppSync ---
  {
    id: "qq-177",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS AppSync",
    question:
      "An AppSync API needs to combine data from DynamoDB and a Lambda function in a single GraphQL query response. What AppSync feature enables fetching from multiple data sources in one resolver?",
    options: [
      "A Lambda resolver that orchestrates calls to DynamoDB and other services",
      "Batch resolvers that parallelize requests to multiple data sources",
      "Pipeline resolvers, which chain multiple functions (each with its own data source) sequentially",
      "AppSync subscriptions that aggregate data from multiple sources",
    ],
    correctIndices: [2],
    explanation:
      "Pipeline resolvers consist of a before mapping template, an ordered list of AppSync Functions (each with a data source), and an after mapping template. Each function can call a different data source (DynamoDB, Lambda, HTTP, etc.), and the output of one function can be passed as input to the next.",
    optionExplanations: [
      "Incorrect. Pipeline resolvers chain AppSync Functions. Each function has its own data source and resolver mapping templates. The pipeline executes them in order, allowing data from DynamoDB to be enriched with Lambda results in a single GraphQL operation.",
      "Incorrect. AppSync does not have a 'batch resolver' type for parallelizing across multiple data sources. Pipeline resolvers execute sequentially; parallel execution requires Lambda orchestration.",
      "Correct. AppSync subscriptions push data to clients when mutations occur — they are for real-time updates, not for aggregating data from multiple sources in a query response.",
      "Incorrect. Using a Lambda resolver that calls DynamoDB internally works, but it adds Lambda overhead and latency. Pipeline resolvers are the native AppSync solution for multi-source composition without Lambda.",
    ],
    tags: ["appsync", "pipeline-resolver", "graphql", "dynamodb", "lambda"],
  },
  {
    id: "qq-178",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS AppSync",
    question:
      "An AppSync API needs to allow unauthenticated users to read public data and authenticated users to read and write their own private data. What authorization configuration supports this?",
    options: [
      "Use IAM authorization for all requests and create an IAM role for unauthenticated users",
      "Create two separate AppSync APIs — one public with API key auth and one private with Cognito auth",
      "Configure multiple authorization modes — API_KEY for unauthenticated reads and AMAZON_COGNITO_USER_POOLS for authenticated operations, using @auth directives to control access per field and type",
      "Use Lambda authorization that checks for the presence of a Cognito token and falls back to API key access",
    ],
    correctIndices: [2],
    explanation:
      "AppSync supports multiple authorization modes on a single API. The primary mode handles unauthenticated requests (API_KEY). Additional modes (Cognito User Pools, IAM, Lambda, OIDC) are applied per operation. @auth directives on schema types and fields control which authorization mode is required for each operation.",
    optionExplanations: [
      "Incorrect. AppSync's multiple auth mode support allows a single API to serve both public and authenticated users. @auth directives specify which mode is required per type or field, enabling fine-grained access control on the same schema.",
      "Incorrect. Two separate APIs require clients to know which endpoint to call, duplicate schema maintenance, and cannot easily combine public and private data in a single response.",
      "Correct. IAM authorization requires AWS credentials for every request — unauthenticated users (without AWS credentials) cannot access IAM-authorized APIs without additional complexity like Cognito Identity Pool unauthenticated identities.",
      "Incorrect. A Lambda authorizer can implement complex custom logic but is heavier and more expensive than using AppSync's built-in multiple auth mode support with declarative @auth directives.",
    ],
    tags: ["appsync", "authorization", "cognito", "api-key", "graphql"],
  },
  {
    id: "qq-179",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS AppSync",
    question:
      "An AppSync subscription is set up so mobile clients receive real-time updates when a DynamoDB item is updated. Updates are happening in DynamoDB but clients are not receiving subscription events. What is the MOST likely cause?",
    options: [
      "AppSync subscriptions are triggered by GraphQL mutations, not directly by DynamoDB changes — the application must call a mutation when updating DynamoDB",
      "AppSync WebSocket connections require an API Gateway WebSocket API to be configured as an intermediary",
      "DynamoDB Streams must be enabled and connected to AppSync via an EventBridge pipe",
      "Subscriptions only work when the client and server are in the same AWS region",
    ],
    correctIndices: [0],
    explanation:
      "AppSync subscriptions are triggered when a matching mutation is executed through AppSync — not by underlying data source changes. If data is written directly to DynamoDB (bypassing AppSync), no subscription event fires. The mutation must go through AppSync to trigger subscriber notifications.",
    optionExplanations: [
      "Correct. AppSync subscriptions listen for specific mutations. When a client or backend calls a mutation through AppSync, AppSync notifies all subscribed clients. Direct DynamoDB writes (via SDK, Lambda, console) bypass AppSync and produce no subscription events.",
      "Incorrect. AppSync manages WebSocket connections natively — no API Gateway WebSocket API is needed. AppSync's subscription infrastructure handles connection management and message delivery.",
      "Incorrect. AppSync does not natively integrate with DynamoDB Streams for subscription triggering. Subscriptions are mutation-driven within AppSync's own request/response cycle.",
      "Incorrect. AppSync subscriptions work across regions — clients connect to the AppSync endpoint regardless of their geographic location. Region mismatch between client and AppSync endpoint is not a constraint.",
    ],
    tags: ["appsync", "subscriptions", "real-time", "mutations", "dynamodb"],
  },
  {
    id: "qq-180",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS AppSync",
    question:
      "An AppSync resolver needs to call an existing REST API as a data source. What data source type should the developer configure?",
    options: [
      "RDS data source, since REST APIs return relational data",
      "Lambda data source, where a Lambda function proxies the HTTP call",
      "HTTP data source, which allows AppSync to make HTTP requests to any REST endpoint",
      "None data source, using local resolvers to return mock data while the REST API is built",
    ],
    correctIndices: [2],
    explanation:
      "AppSync HTTP data sources allow resolvers to make signed or unsigned HTTP requests to REST endpoints. The resolver mapping template builds the HTTP request (method, path, headers, body) and maps the response to the GraphQL return type. This avoids the Lambda overhead for simple REST proxy patterns.",
    optionExplanations: [
      "Incorrect. AppSync HTTP data sources connect directly to REST APIs. The request mapping template constructs the HTTP request, and the response mapping template transforms the JSON response to match the GraphQL schema.",
      "Incorrect. A Lambda data source works but adds unnecessary latency, cost, and operational overhead when AppSync's native HTTP data source can call the REST API directly without an intermediate function.",
      "Correct. None data source (local resolvers) evaluates a mapping template without calling any backend — it's for returning computed or hardcoded data, not for calling external REST APIs.",
      "Incorrect. RDS data source connects to Aurora Serverless v1 via the RDS Data API — it's for SQL databases, not REST APIs.",
    ],
    tags: ["appsync", "http-data-source", "rest-api", "resolver"],
  },

  // --- NEW: AWS Systems Manager ---
  {
    id: "qq-181",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Systems Manager",
    question:
      "A developer needs to run a shell script on 50 EC2 instances simultaneously to apply a security patch. No SSH access is configured on the instances. What SSM feature should they use?",
    options: [
      "SSM Patch Manager with a custom patch baseline that includes the security patch",
      "SSM Run Command with the AWS-RunShellScript document to execute commands on multiple instances without SSH",
      "SSM Session Manager to open a terminal session and manually run the script on each instance",
      "SSM Parameter Store to store the script and have instances pull and execute it on a schedule",
    ],
    correctIndices: [1],
    explanation:
      "Run Command sends commands to managed instances via the SSM agent without requiring SSH, open inbound ports, or bastion hosts. You specify a document (AWS-RunShellScript for Linux), the command, and a target (instance IDs, tags, or all managed instances). Output is captured to CloudWatch Logs or S3.",
    optionExplanations: [
      "Incorrect. Run Command is designed for this use case — executing commands at scale across multiple instances. Target 50 instances by tag or instance ID, specify the script in the Parameters, and Run Command distributes and executes it via the SSM agent.",
      "Correct. Session Manager opens interactive terminal sessions — it's for interactive access, not batch command execution across multiple instances. You'd need to run the script manually on each instance.",
      "Incorrect. Patch Manager automates OS patch management using pre-defined or custom patch baselines for OS packages — it's not designed to run arbitrary custom scripts.",
      "Incorrect. Parameter Store stores configuration values and secrets — it's not a script execution mechanism. Instances don't automatically pull and execute scripts stored in Parameter Store.",
    ],
    tags: ["systems-manager", "run-command", "ec2", "automation"],
  },
  {
    id: "qq-182",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS Systems Manager",
    question:
      "An application's configuration is stored in SSM Parameter Store. The Lambda function reads the parameter on every invocation, causing latency and unnecessary API calls. What is the BEST solution?",
    options: [
      "Use the AWS Parameters and Secrets Lambda Extension to cache parameter values locally with a configurable TTL",
      "Increase the Lambda memory to reduce the latency of GetParameter API calls",
      "Store the parameter value in a Lambda environment variable during deployment",
      "Use SSM Parameter Store Advanced tier which has lower API latency",
    ],
    correctIndices: [0],
    explanation:
      "The AWS Parameters and Secrets Lambda Extension runs as a Lambda layer and provides a local HTTP endpoint (localhost:2772). Lambda functions request parameters from this local endpoint — the extension caches values and refreshes them when the TTL expires, eliminating redundant GetParameter API calls across warm invocations.",
    optionExplanations: [
      "Correct. The extension caches parameter values in memory for the configurable TTL. The Lambda function calls localhost:2772/systemsmanager/parameters/get?name=... and gets the cached value without an SDK call or API latency.",
      "Incorrect. Lambda memory allocation affects CPU performance and function execution speed, not the latency of individual network API calls to SSM Parameter Store.",
      "Incorrect. Storing parameter values in environment variables loses the ability to update the configuration without redeploying Lambda, and the value is stored in plaintext in the Lambda configuration for SecureString parameters.",
      "Incorrect. SSM Parameter Store Advanced tier has higher throughput limits and supports parameter policies, but it does not reduce per-call latency — both tiers have similar API latency.",
    ],
    tags: [
      "systems-manager",
      "parameter-store",
      "lambda",
      "caching",
      "extension",
    ],
  },
  {
    id: "qq-183",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS Systems Manager",
    question:
      "A developer needs to securely connect to an EC2 instance in a private subnet for debugging. The subnet has no internet gateway and no inbound security group rules. What SSM feature enables this?",
    options: [
      "SSM Fleet Manager, which provides a graphical remote desktop connection",
      "SSM Session Manager, which creates an interactive shell session via the SSM agent without requiring inbound ports or SSH keys",
      "SSM Run Command with the AWS-StartInteractiveCommand document",
      "SSM Automation with a runbook that opens a temporary SSH tunnel",
    ],
    correctIndices: [1],
    explanation:
      "Session Manager connects to instances through the SSM agent's outbound HTTPS connection to the SSM service endpoint — no inbound ports needed, no SSH keys, no bastion host. The instance needs the SSM agent installed and an IAM instance profile with AmazonSSMManagedInstanceCore policy, plus outbound HTTPS (port 443) to the SSM service (or a VPC endpoint).",
    optionExplanations: [
      "Incorrect. Session Manager works via the SSM agent's outbound connection. For private subnets with no internet access, create VPC Interface Endpoints for ssm, ssmmessages, and ec2messages to allow the agent to communicate with the SSM service.",
      "Correct. AWS-StartInteractiveCommand is an SSM document for running a single command non-interactively via Run Command — it does not create a persistent interactive shell session. Session Manager is the correct feature for a full interactive terminal session.",
      "Incorrect. SSM Automation runs operational runbooks (multi-step automated tasks) — it does not create interactive debugging sessions or SSH tunnels.",
      "Incorrect. Fleet Manager provides a GUI-based view for managing instances (file browser, performance monitoring) — it does not provide an interactive terminal session for debugging.",
    ],
    tags: [
      "systems-manager",
      "session-manager",
      "ec2",
      "security",
      "private-subnet",
    ],
  },
  {
    id: "qq-184",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Systems Manager",
    question:
      "A team needs to automate patching EC2 instances every Sunday at 2 AM with minimal disruption. Instances should be patched in batches of 20% at a time, with health checks between batches. What SSM feature handles this?",
    options: [
      "Patch Manager with a maintenance window configured for Sunday 2 AM, using a patch baseline and concurrency settings",
      "SSM Run Command scheduled with EventBridge to run every Sunday at 2 AM",
      "SSM Automation with a custom runbook that calls aws ec2 reboot-instances in batches",
      "SSM State Manager with an association that applies a patch document on a weekly schedule",
    ],
    correctIndices: [0],
    explanation:
      "Patch Manager integrates with Maintenance Windows for scheduled patching. The Maintenance Window controls timing (Sunday 2 AM), concurrency (20% of targets at a time), and error thresholds (stop if X% fail). Patch Manager uses patch baselines to define which patches to apply and registers targets and tasks in the window.",
    optionExplanations: [
      "Correct. Maintenance Windows + Patch Manager is the purpose-built solution. The Maintenance Window defines the schedule, concurrency (e.g. 20%), and stop conditions. Patch Manager handles patch selection via baselines and instance patching. The concurrency setting controls how many instances patch simultaneously.",
      "Incorrect. Run Command with EventBridge can execute commands on a schedule, but it lacks the built-in concurrency controls, patch baseline integration, and health-check-between-batches behavior that Maintenance Windows provide.",
      "Incorrect. An SSM Automation runbook calling reboot-instances is a custom solution that requires building batch logic manually — Patch Manager + Maintenance Windows provides this natively.",
      "Incorrect. State Manager associations maintain desired state configuration continuously (e.g. ensure software is installed) — they don't provide the scheduling flexibility, concurrency controls, or maintenance window integration needed for controlled batch patching.",
    ],
    tags: [
      "systems-manager",
      "patch-manager",
      "maintenance-window",
      "automation",
    ],
  },

  // --- NEW: AWS STS ---
  {
    id: "qq-185",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS STS",
    question:
      "A developer calls sts:AssumeRole and receives temporary credentials with a 1-hour session. The application needs to continue operating beyond that hour. How should the application handle credential renewal?",
    options: [
      "Use the AWS SDK's credential provider chain, which automatically refreshes credentials by calling AssumeRole before they expire",
      "Call sts:RefreshCredentials before the session expires to extend the existing session",
      "Increase the role's MaxSessionDuration to 12 hours and call AssumeRole once at startup",
      "Store the credentials in Secrets Manager and have the application fetch them when needed",
    ],
    correctIndices: [0],
    explanation:
      "The AWS SDK's AssumeRoleProvider (or assume_role provider in various SDKs) automatically manages credential refresh. It calls AssumeRole before credentials expire and caches the new credentials. Applications using the SDK credential chain get seamless renewal without any manual logic.",
    optionExplanations: [
      "Correct. The AWS SDK's built-in assume role credential provider tracks expiration and proactively calls AssumeRole to refresh credentials. Applications using the SDK's credential chain (environment variables, instance profile, assume role provider) get this automatically.",
      "Incorrect. sts:RefreshCredentials does not exist as an API. Temporary credentials cannot be extended — you must call AssumeRole again to get a new set of credentials.",
      "Incorrect. Increasing MaxSessionDuration to 12 hours reduces the frequency of AssumeRole calls but doesn't eliminate the need for renewal. After 12 hours, the credentials still expire and the application would fail without renewal logic.",
      "Incorrect. Storing temporary credentials in Secrets Manager defeats their purpose — they're meant to be short-lived. Secrets Manager is for long-term secrets. Credentials from AssumeRole should be used directly by the SDK.",
    ],
    tags: ["sts", "assume-role", "credentials", "sdk", "renewal"],
  },
  {
    id: "qq-186",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS STS",
    question:
      "A third-party company needs to access resources in your AWS account without you sharing long-term credentials. They will assume a role in your account from their own AWS account. What security measure prevents the confused deputy problem?",
    options: [
      "Limit the role's session duration to 15 minutes to reduce exposure time",
      "Add an ExternalId condition to the role's trust policy that the third party must provide when calling AssumeRole",
      "Use a permission boundary on the role to limit what the third party can do",
      "Require the third party to use MFA before assuming the role",
    ],
    correctIndices: [1],
    explanation:
      "The confused deputy problem occurs when a third party could trick another service into using your role on their behalf. ExternalId is a secret value agreed upon between you and the third party. The trust policy requires ExternalId in the AssumeRole call — an attacker who knows only the role ARN cannot assume it without the ExternalId.",
    optionExplanations: [
      "Incorrect. ExternalId is the standard mitigation for the confused deputy problem. The third party provides ExternalId; you add it to the trust policy condition. An attacker knowing only the role ARN cannot assume it without the matching ExternalId.",
      "Correct. MFA requirements in trust policies add a human factor but don't address the confused deputy problem, which involves automated service calls. The third party's automated systems cannot satisfy an MFA condition.",
      "Incorrect. Short session duration limits the window of exposure after a successful assume role, but doesn't prevent an unauthorized assume role call from succeeding in the first place.",
      "Incorrect. Permission boundaries limit what the role can do after assumption — they don't prevent unauthorized parties from assuming the role. The trust policy and ExternalId control who can assume it.",
    ],
    tags: ["sts", "assume-role", "external-id", "confused-deputy", "security"],
  },
  {
    id: "qq-187",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS STS",
    question:
      "A mobile app authenticates users with Google Sign-In. After authentication, the app needs temporary AWS credentials to upload files directly to S3. What STS API should the app call?",
    options: [
      "sts:AssumeRoleWithWebIdentity, passing the Google ID token to obtain temporary AWS credentials",
      "sts:AssumeRole, using the Google access token as the RoleSessionName",
      "sts:GetSessionToken, which converts any OAuth token to AWS credentials",
      "sts:AssumeRoleWithSAML, passing the Google token as a SAML assertion",
    ],
    correctIndices: [0],
    explanation:
      "AssumeRoleWithWebIdentity is the STS API for web identity federation. The app passes the OIDC token (Google ID token) and the role ARN. STS validates the token with Google and returns temporary credentials if the trust policy allows the Google identity provider. Cognito Identity Pools wrap this API for mobile apps.",
    optionExplanations: [
      "Correct. AssumeRoleWithWebIdentity accepts an OIDC/OAuth2 ID token from a trusted identity provider (Google, Facebook, Amazon, or any OIDC provider) and returns temporary AWS credentials. The role's trust policy must allow the identity provider.",
      "Incorrect. AssumeRole is for IAM principals (roles, users) assuming other roles — it requires AWS credentials to sign the request. A Google-authenticated user doesn't have AWS credentials before getting them from STS.",
      "Incorrect. GetSessionToken generates temporary credentials for an IAM user with optional MFA — it requires existing IAM credentials and does not accept OAuth tokens from external identity providers.",
      "Incorrect. AssumeRoleWithSAML is for SAML 2.0 federation (typically enterprise SSO with ADFS or Okta) — it requires a SAML assertion, not an OIDC JWT. Google Sign-In uses OIDC, not SAML.",
    ],
    tags: ["sts", "web-identity", "oauth", "oidc", "federation"],
  },
  {
    id: "qq-188",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS STS",
    question:
      "A developer assumes a role that has full S3 access. They also pass a session policy that allows only s3:GetObject. What actions can the developer perform with the resulting credentials?",
    options: [
      "Full S3 access — the role's permissions override the more restrictive session policy",
      "Only s3:GetObject — the effective permissions are the intersection of the role's policies and the session policy",
      "No permissions — passing a session policy that doesn't match the role's policies causes an error",
      "s3:GetObject plus any actions explicitly denied in the session policy",
    ],
    correctIndices: [1],
    explanation:
      "Session policies can only restrict, never expand, permissions. The effective permissions are the intersection of the role's identity policies, permission boundaries (if any), and the session policy. The role has full S3 access but the session policy allows only GetObject — the intersection is GetObject only.",
    optionExplanations: [
      "Incorrect. Session policies are additive restrictions. Effective permissions = role policies AND session policy. The session policy limits the session to s3:GetObject even though the role allows all S3 actions.",
      "Correct. Session policies cannot be overridden by role policies. The session policy is always applied as an additional restriction — it can only reduce what the role allows, never expand it.",
      "Incorrect. Passing a session policy that is more restrictive than the role is valid and common — it doesn't cause an error. It simply results in a more limited credential set.",
      "Incorrect. Explicit denies work differently — an explicit deny in a session policy or role policy would block the action. But a session policy that allows only GetObject doesn't explicitly deny other actions — it just doesn't allow them, and without an allow, access is denied by default.",
    ],
    tags: ["sts", "session-policy", "permissions", "iam", "intersection"],
  },
  {
    id: "qq-189",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS STS",
    question:
      "An application running on EC2 needs to access DynamoDB. A junior developer suggests embedding IAM access keys in the application code. What is the correct alternative?",
    options: [
      "Encrypt the access keys with KMS and store them in the application's configuration file",
      "Store the access keys in the EC2 instance's /etc/environment file to keep them off the source code",
      "Use a Secrets Manager secret to store the access keys and retrieve them at startup",
      "Attach an IAM role to the EC2 instance via an instance profile — the AWS SDK automatically retrieves temporary credentials from the instance metadata service",
    ],
    correctIndices: [3],
    explanation:
      "EC2 instance profiles attach an IAM role to an instance. The AWS SDK's credential chain automatically calls the Instance Metadata Service (IMDS) at 169.254.169.254 to get temporary credentials. These rotate automatically — no long-term keys are needed anywhere.",
    optionExplanations: [
      "Incorrect. Instance profiles provide temporary, automatically-rotating credentials via IMDS. The SDK credential chain finds them automatically. No access keys need to be generated, stored, or rotated manually.",
      "Incorrect. Storing access keys in /etc/environment keeps them off source code but they're still long-term keys that could be accessed by anyone with OS-level access to the instance and won't auto-rotate.",
      "Incorrect. Encrypting access keys with KMS and storing them in config files adds complexity but doesn't solve the fundamental problem — long-term keys that must be manually rotated and could be compromised.",
      "Correct. Storing IAM access keys in Secrets Manager is better than hardcoding, but they're still long-term credentials requiring manual rotation. The instance profile approach eliminates long-term keys entirely.",
    ],
    tags: ["sts", "ec2", "instance-profile", "credentials", "imds"],
  },

  // --- NEW: AWS AppConfig ---
  {
    id: "qq-190",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS AppConfig",
    question:
      "A developer needs to roll out a new feature flag to 10% of Lambda function instances initially, then expand to 100% over 30 minutes with automatic rollback if error rates increase. What AppConfig feature supports this?",
    options: [
      "A feature flag configuration profile with a canary percentage attribute set to 10",
      "An AppConfig environment filter that targets specific Lambda instance IDs",
      "An AppConfig extension that integrates with Lambda aliases for traffic shifting",
      "A deployment strategy with a Linear rollout type, growth factor of 10, and a CloudWatch alarm configured for automatic rollback",
    ],
    correctIndices: [3],
    explanation:
      "AppConfig deployment strategies control how configuration changes roll out. A Linear strategy with growth factor 10 and interval of 3 minutes would update 10% of clients every 3 minutes over 30 minutes. CloudWatch alarms can trigger automatic rollback if metrics (error rate, latency) breach thresholds during rollout.",
    optionExplanations: [
      "Incorrect. AppConfig deployment strategies define Type (AllAtOnce, Linear, Exponential), GrowthFactor (percent per interval), DeploymentDurationInMinutes, and FinalBakeTimeInMinutes. CloudWatch alarms in the environment trigger rollback automatically when metrics breach thresholds.",
      "Incorrect. AppConfig feature flag configuration profiles define the feature flags themselves (name, type, value) — they don't contain rollout percentage attributes. Rollout behavior is controlled by the deployment strategy.",
      "Incorrect. AppConfig does not integrate with Lambda aliases for traffic shifting. Lambda alias routing is a separate mechanism managed through the Lambda service. AppConfig controls configuration rollout, not traffic routing.",
      "Correct. AppConfig targets environments (dev, staging, prod) rather than specific Lambda instance IDs. Lambda functions poll AppConfig and receive the current configuration regardless of instance identity.",
    ],
    tags: ["appconfig", "deployment-strategy", "feature-flags", "rollback"],
  },
  {
    id: "qq-191",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS AppConfig",
    question:
      "A Lambda function uses AppConfig to manage feature flags. The team wants the function to pick up configuration changes within 30 seconds without redeployment. How should they configure this?",
    options: [
      "Use the AppConfig Lambda Extension with a polling interval of 30 seconds — the extension caches and refreshes configuration from a local HTTP endpoint",
      "Set the Lambda function's timeout to 30 seconds and call AppConfig on each invocation",
      "Use EventBridge to trigger the Lambda function whenever AppConfig deployment completes",
      "Set TTL on the AppConfig environment to 30 seconds so changes propagate automatically",
    ],
    correctIndices: [0],
    explanation:
      "The AppConfig Lambda Extension runs alongside the function and polls AppConfig for configuration changes at the configured interval. The function reads configuration from localhost:2772 — a local HTTP endpoint. With a 30-second polling interval, the function picks up new deployments within 30 seconds without redeployment.",
    optionExplanations: [
      "Correct. The AppConfig extension handles polling and caching transparently. Set AWS_APPCONFIG_EXTENSION_POLL_INTERVAL_SECONDS=30 and the function reads from localhost:2772/applications/.../configurations/... on each invocation — the extension returns cached or fresh config.",
      "Incorrect. Lambda timeout controls maximum execution duration — it has no effect on configuration refresh frequency. Calling AppConfig on every invocation without caching would be expensive and slow.",
      "Incorrect. Triggering Lambda via EventBridge on AppConfig deployment completion would invoke the function to do something, but it wouldn't cause configuration to be refreshed in other running Lambda instances.",
      "Incorrect. AppConfig environments don't have a TTL setting. Configuration refresh is controlled by the client polling interval (extension or SDK), not an environment-level TTL.",
    ],
    tags: ["appconfig", "lambda", "extension", "feature-flags", "polling"],
  },
  {
    id: "qq-192",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS AppConfig",
    question:
      "An AppConfig configuration change is deployed. Five minutes later, a validator Lambda function is invoked and returns a failure. What happens to the deployment?",
    options: [
      "The deployment continues since validators only run before the deployment starts",
      "The deployment is rolled back to the previous configuration version automatically",
      "The deployment is paused and waits for manual approval to proceed or roll back",
      "The validator failure is logged but does not affect the ongoing deployment",
    ],
    correctIndices: [1],
    explanation:
      "AppConfig validators can be JSON Schema validators (run before deployment) or Lambda validators (run before and during deployment). If a Lambda validator returns a failure during the deployment, AppConfig automatically rolls back to the previous known-good configuration. This is the automated rollback mechanism.",
    optionExplanations: [
      "Incorrect. Lambda validators are invoked during deployment. A failure causes AppConfig to automatically roll back, restoring the previous configuration across all polling clients. This provides a safety net during gradual rollouts.",
      "Correct. Lambda validators run both before deployment starts (validation) and during deployment (as a hook). A failure during deployment triggers rollback, not continuation.",
      "Incorrect. AppConfig does not pause for manual intervention when a validator fails — it automatically rolls back. Manual approval is a deployment strategy choice, not a validator failure response.",
      "Incorrect. Validator failures are not merely logged — they are actionable events that trigger automatic rollback. This is the core safety guarantee of AppConfig validators.",
    ],
    tags: ["appconfig", "validators", "rollback", "deployment"],
  },
  {
    id: "qq-193",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS AppConfig",
    question:
      "A team stores feature flags in AppConfig and wants to prevent a bad configuration (e.g. invalid JSON or a missing required key) from being deployed. What AppConfig feature prevents invalid configurations from reaching production?",
    options: [
      "AppConfig environment variables that enforce schema constraints on configuration values",
      "AWS Config rules that evaluate AppConfig configuration profiles for compliance",
      "AppConfig deployment strategies that include a validation phase before traffic shifts",
      "Validators — either a JSON Schema validator that checks structure and types, or a Lambda validator with custom logic",
    ],
    correctIndices: [3],
    explanation:
      "AppConfig supports two validator types on configuration profiles. JSON Schema validators automatically reject configurations that don't match the schema before deployment begins. Lambda validators run custom validation logic — checking business rules, required keys, value ranges, etc. — and fail the deployment if validation fails.",
    optionExplanations: [
      "Incorrect. Attach a JSON Schema validator to the configuration profile to enforce structure and types. Use a Lambda validator for business logic validation (e.g. 'rate limit must be between 1 and 1000'). AppConfig rejects deployments that fail validation before any client receives the bad config.",
      "Incorrect. Deployment strategies control rollout speed and rollback triggers — they don't validate configuration content before deployment begins.",
      "Incorrect. AppConfig does not use environment variables for schema enforcement. Validation is done through the Validators configuration on configuration profiles.",
      "Correct. AWS Config evaluates AWS resource configurations for compliance against Config rules — it does not validate AppConfig configuration profile content.",
    ],
    tags: ["appconfig", "validators", "json-schema", "configuration"],
  },
  {
    id: "qq-194",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS AppConfig",
    question:
      "An AppConfig configuration profile stores a JSON document with database connection settings. The team wants the connection string value to be stored securely and referenced dynamically at deploy time rather than stored plaintext in AppConfig. What configuration profile type supports this?",
    options: [
      "A Lambda data source that retrieves the connection string from RDS Secrets Manager at runtime",
      "An AWS SSM Parameter Store or Secrets Manager sourced configuration profile that retrieves the value from Parameter Store or Secrets Manager at deployment time",
      "A hosted configuration profile with the value encrypted using AppConfig's built-in encryption",
      "A feature flag configuration profile with the secret stored as a boolean flag",
    ],
    correctIndices: [1],
    explanation:
      "AppConfig supports configuration profiles sourced from SSM Parameter Store and Secrets Manager. Instead of storing sensitive values in the AppConfig hosted configuration, you reference the Parameter Store path or Secrets Manager ARN. AppConfig retrieves the current value at deployment time. This keeps secrets out of AppConfig's storage.",
    optionExplanations: [
      "Incorrect. AppConfig SSM Parameter and Secrets Manager sourced profiles store a reference, not the value. At deployment time, AppConfig retrieves the current value from the source. This leverages Secrets Manager's rotation and encryption while using AppConfig's deployment and rollback capabilities.",
      "Correct. AppConfig hosted configuration profiles store configuration data directly in AppConfig. While data is encrypted at rest by AWS, the plaintext value is stored in AppConfig and visible to anyone with GetConfiguration access.",
      "Incorrect. Feature flag profiles are structured specifically for boolean/string/number feature flags — they don't support referencing external secrets or dynamic values.",
      "Incorrect. AppConfig does not have a Lambda data source type for configuration profiles. Lambda validators can validate configurations, but they don't serve as data sources for the configuration content itself.",
    ],
    tags: ["appconfig", "secrets-manager", "ssm", "configuration", "security"],
  },

  // --- NEW: AWS Amplify ---
  {
    id: "qq-195",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Amplify",
    question:
      "A team uses AWS Amplify Hosting to deploy a React app. They want the main branch to deploy to production and feature branches to automatically deploy to unique preview URLs. What Amplify feature enables this?",
    options: [
      "AWS CodePipeline integration that creates a separate Amplify app per branch",
      "CloudFront's multi-origin routing rules to serve different branches from different S3 buckets",
      "Amplify's manual deployment mode where developers upload build artifacts for each branch",
      "Amplify's branch-based deployments — each connected branch gets its own URL, and feature branch deployments are isolated from production",
    ],
    correctIndices: [3],
    explanation:
      "Amplify Hosting auto-detects new branches when connected to a Git repository and deploys each branch to a unique URL (https://branch-name.app-id.amplifyapp.com). Pull request previews create ephemeral environments for each PR. Production uses the main/master branch URL. No extra configuration needed for branch deployments.",
    optionExplanations: [
      "Incorrect. Connect Amplify to your Git repository and enable branch auto-detection. Each branch gets an isolated deployment with its own URL. Merge to main triggers production deployment. PR previews can be enabled for pull request environments.",
      "Incorrect. Manual deployment requires uploading a ZIP file of the build output — it doesn't support automatic branch detection or PR preview URLs.",
      "Incorrect. Creating a separate Amplify app per branch is unnecessary and operationally heavy. Amplify's single app supports multiple branch deployments natively.",
      "Correct. CloudFront multi-origin routing is a lower-level CDN configuration — Amplify abstracts all of this and provides branch deployments without needing to configure CloudFront directly.",
    ],
    tags: ["amplify", "hosting", "branch-deployments", "preview", "cicd"],
  },
  {
    id: "qq-196",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Amplify",
    question:
      "A mobile app built with Amplify needs to allow users to sign up, sign in, and sign out. Which Amplify library and backend resource should the developer use?",
    options: [
      "Amplify Auth category backed by Amazon Cognito User Pools, configured with amplify add auth",
      "Amplify API category with a REST API that validates username and password",
      "AWS SDK for Cognito called directly from the mobile app with hardcoded User Pool credentials",
      "Amplify Geo category with custom authentication logic",
    ],
    correctIndices: [0],
    explanation:
      "Amplify Auth is a category that wraps Cognito User Pools (and optionally Identity Pools). Running amplify add auth provisions the Cognito resources and generates configuration. The Amplify library provides signUp(), signIn(), signOut(), and other auth methods that handle token management, refresh, and storage automatically.",
    optionExplanations: [
      "Correct. amplify add auth provisions Cognito User Pool (and optionally Identity Pool) and generates the amplify/backend/auth configuration. The Amplify.Auth library provides high-level methods for all authentication flows including signup, signin, MFA, and password reset.",
      "Incorrect. A REST API for authentication would require building session management, password hashing, and token issuance from scratch — Cognito and Amplify Auth handle all of this.",
      "Incorrect. Using the raw Cognito SDK requires managing token storage, refresh logic, and configuration manually. Amplify Auth provides a higher-level abstraction that handles these concerns automatically.",
      "Incorrect. Amplify Geo provides location services (maps, place search) — it is entirely unrelated to user authentication.",
    ],
    tags: ["amplify", "auth", "cognito", "authentication"],
  },
  {
    id: "qq-197",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS Amplify",
    question:
      "An Amplify Gen 2 app uses Amplify's backend to define a DynamoDB-backed GraphQL API. A developer adds a new field to a data model. What happens when they run npx ampx sandbox?",
    options: [
      "Amplify generates a new GraphQL schema and requires manual deployment to CloudFormation",
      "Amplify updates the local mock server with the new field without touching AWS resources",
      "Amplify synthesizes a CloudFormation stack from the TypeScript backend definition and deploys the changes to a personal cloud sandbox environment",
      "Amplify creates a new DynamoDB table for the updated model and deletes the old one",
    ],
    correctIndices: [2],
    explanation:
      "Amplify Gen 2 uses TypeScript to define backend resources (data models, auth, storage). npx ampx sandbox synthesizes CloudFormation from the TypeScript definitions and deploys a personal sandbox environment in AWS — a real cloud environment isolated per developer. Changes to data models update the DynamoDB table and AppSync schema.",
    optionExplanations: [
      "Incorrect. Amplify Gen 2's sandbox command provisions or updates real AWS resources (AppSync, DynamoDB, Cognito, etc.) in a personal sandbox CloudFormation stack. Each developer gets an isolated environment. Changes are deployed immediately on save with file watching.",
      "Incorrect. Gen 2 does not generate a static GraphQL schema file for manual deployment — it synthesizes CloudFormation directly from TypeScript and deploys automatically.",
      "Correct. The sandbox command deploys to real AWS resources, not just a local mock. Amplify does support local mocking (amplify mock) separately, but sandbox is cloud-based.",
      "Incorrect. Amplify updates the existing DynamoDB table for model changes where possible. It does not drop and recreate tables for field additions — that would cause data loss.",
    ],
    tags: ["amplify", "gen2", "sandbox", "cloudformation", "deployment"],
  },
  {
    id: "qq-198",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Amplify",
    question:
      "An Amplify app needs to store user profile images so each user can only read and write their own files. What Amplify Storage access level provides this?",
    options: [
      "Custom access level defined in an S3 bucket policy based on Cognito user attributes",
      "Public access level with IAM conditions restricting writes to the file owner",
      "Private access level, which scopes files to the authenticated user's identity and prevents other users from accessing them",
      "Protected access level, which allows authenticated users to read each other's files but only write their own",
    ],
    correctIndices: [2],
    explanation:
      "Amplify Storage has three access levels: Public (all users read/write), Protected (all authenticated users can read, only owner can write), and Private (only the owner can read and write). Private is correct for profile images where users should only access their own files.",
    optionExplanations: [
      "Incorrect. Private access level stores files under a user-specific prefix (private/{identityId}/). Only the file owner can read and write their own files. Other authenticated users cannot access private files.",
      "Incorrect. Protected access level allows any authenticated user to read the files but only the owner to write — this is appropriate for content meant to be publicly shared among users, not private profile data.",
      "Correct. Public access level allows all users (including unauthenticated) to read and all authenticated users to write — there are no per-user write restrictions, and all users can read all files.",
      "Incorrect. Amplify Storage's built-in access levels handle user-scoped access automatically via S3 and IAM policies generated by Amplify — custom S3 bucket policies are not needed for standard per-user access control.",
    ],
    tags: ["amplify", "storage", "s3", "access-control", "private"],
  },
  {
    id: "qq-199",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Amplify",
    question:
      "An Amplify app uses DataStore for offline data synchronization. When the app comes back online after being offline, a conflict is detected between the local version and the server version of the same record. What is the default conflict resolution strategy?",
    options: [
      "Manual resolution — the app must implement a custom conflict handler function",
      "Auto Merge — Amplify attempts to merge non-conflicting fields; if fields conflict, the server version wins (last writer wins based on server timestamp)",
      "Server wins — the server version always overwrites local offline changes",
      "Client wins — the local offline changes always overwrite the server version",
    ],
    correctIndices: [1],
    explanation:
      "Amplify DataStore's default conflict resolution is Auto Merge. It compares the local and server versions field by field. Non-conflicting field changes are merged. For conflicting fields (both sides changed the same field), the server version takes precedence based on the _version counter. Custom handlers can override this behavior.",
    optionExplanations: [
      "Incorrect. Auto Merge is the default. DataStore uses AppSync's conflict detection (optimistic concurrency via _version) and attempts to merge changes. When fields conflict, the server version wins by default. This minimizes data loss while handling the most common offline edit patterns.",
      "Correct. Client wins is an available conflict resolution strategy but is not the default. It would cause data loss if two users edit the same record while offline.",
      "Incorrect. Server wins (Automerge with server priority) is available but not the default. It would discard all offline changes whenever any conflict exists, which is too aggressive for typical use cases.",
      "Incorrect. Manual resolution requires implementing a custom conflict handler, which is supported but opt-in. The default behavior is Auto Merge without requiring any custom code.",
    ],
    tags: ["amplify", "datastore", "offline", "conflict-resolution", "sync"],
  },

  // ─── SITUATIONAL ────────────────────────────────────────────────────────────

  {
    id: "qq-200",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Lambda",
    question:
      "Your team's Lambda function processes customer orders. During Black Friday load testing you observe that the function runs fine at 50 concurrent executions but at 500 concurrent executions database connections are exhausted and queries start failing. The database is Amazon RDS PostgreSQL. What is the BEST long-term fix?",
    options: [
      "Set Lambda reserved concurrency to 50 to cap concurrent executions",
      "Increase the RDS instance size to db.r6g.16xlarge to support more connections",
      "Switch the Lambda runtime to a connection-efficient language like Go",
      "Place Amazon RDS Proxy in front of the RDS instance to pool and reuse database connections",
    ],
    correctIndices: [3],
    explanation:
      "Each Lambda execution environment opens its own RDS connection. At high concurrency this exhausts RDS max_connections quickly. RDS Proxy maintains a pool of persistent connections to RDS and multiplexes Lambda invocations through that pool, dramatically reducing connection count. Upscaling the instance buys headroom but not scalability. Capping concurrency limits throughput. Switching runtime does not change the fundamental connection-per-environment pattern.",
    optionExplanations: [
      "Incorrect. RDS Proxy is the purpose-built solution for this exact problem. It maintains a warm pool of persistent connections to RDS and multiplexes many Lambda executions through fewer real database connections, eliminating connection exhaustion at scale.",
      "Incorrect. A larger instance does increase max_connections, but it is an expensive and non-scalable fix — you would need to keep upsizing as traffic grows, and it does not address the root cause of too many short-lived connections.",
      "Incorrect. Capping reserved concurrency to 50 would prevent connection exhaustion but would also throttle throughput, causing 429 errors and backed-up orders during peak load — the opposite of what you need on Black Friday.",
      "Correct. The runtime language does not change the connection model. Every Lambda execution environment, regardless of language, opens its own connection to RDS unless a proxy is used.",
    ],
    tags: ["lambda", "rds", "rds-proxy", "connection-pooling", "concurrency"],
  },
  {
    id: "qq-201",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodeDeploy",
    question:
      "You are deploying a critical payment API to a fleet of 200 EC2 instances. The business requires zero downtime and the ability to instantly roll back if the error rate rises above 1% after deployment. Which deployment configuration satisfies BOTH requirements?",
    options: [
      "CodeDeploy Canary deployment to a small percentage first, with CloudWatch alarms wired to trigger automatic rollback",
      "In-place All-at-once deployment with a CloudWatch alarm that pages on-call if errors spike",
      "Blue/green deployment replacing all instances simultaneously with manual rollback via console",
      "Rolling deployment updating 50 instances at a time with no alarms configured",
    ],
    correctIndices: [0],
    explanation:
      "A Canary deployment shifts a small percentage of traffic (e.g. 10%) to the new version first. CloudWatch alarms on error rate are natively integrated with CodeDeploy — if the alarm trips, CodeDeploy automatically rolls back without human intervention. Blue/green with simultaneous cutover meets the zero-downtime requirement but rollback is not instant if done manually. All-at-once causes downtime. Rolling without alarms cannot auto-rollback.",
    optionExplanations: [
      "Correct. Canary exposes a small slice of production traffic first. CodeDeploy's alarm-based automatic rollback triggers immediately if error rate exceeds the threshold — satisfying both zero downtime and instant, automatic rollback.",
      "Incorrect. All-at-once deployment replaces all instances simultaneously, causing downtime during the deployment window. A page to on-call is not an instant rollback.",
      "Incorrect. Blue/green provides zero downtime via the load balancer, but 'replacing all instances simultaneously' means the rollback requires routing traffic back to the old environment — this can be done but is not instant without pre-configured automatic rollback triggers.",
      "Incorrect. Rolling at 50 instances at a time preserves some capacity, but with no alarms there is no automatic rollback — a human must notice the error spike and manually intervene.",
    ],
    tags: [
      "codedeploy",
      "canary",
      "rollback",
      "cloudwatch",
      "zero-downtime",
      "deployment",
    ],
  },
  {
    id: "qq-202",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS Secrets Manager",
    question:
      "Your application retrieves a database password from Secrets Manager on every request. In production you notice the Secrets Manager API is being called 5,000 times per minute and you are hitting throttling errors. The password rotates once every 30 days. What is the MOST cost-effective fix?",
    options: [
      "Cache the secret in memory after the first retrieval and refresh the cache only when rotation is detected via a TTL or SecretsManager rotation event",
      "Request a Secrets Manager API throttling limit increase from AWS Support",
      "Store the password in an environment variable and redeploy whenever it rotates",
      "Move the secret to AWS Systems Manager Parameter Store Standard tier which has a higher default rate limit",
    ],
    correctIndices: [0],
    explanation:
      "The Secrets Manager SDK and many AWS SDKs include built-in client-side caching. You retrieve the secret once, cache it in process memory with a TTL (e.g. 1 hour), and only call the API again when the TTL expires or when an authentication error suggests the secret rotated. This drops API calls from thousands per minute to a handful per hour. Requesting a limit increase does not fix the architectural inefficiency. Environment variables require redeployment on rotation. SSM Parameter Store has higher limits but still requires caching at high call rates.",
    optionExplanations: [
      "Correct. In-process caching with a TTL aligned to your rotation window is the standard pattern. The AWS Secrets Manager caching client library implements this out of the box. It slashes API call volume without any risk of using a stale secret beyond the TTL.",
      "Incorrect. A limit increase treats the symptom, not the cause. It also adds cost (Secrets Manager charges per API call) and the higher limit may eventually be hit again as traffic grows.",
      "Incorrect. Baking the secret into an environment variable requires a redeployment on every rotation, introduces a window where the old value is live, and defeats the purpose of automatic rotation.",
      "Incorrect. SSM Parameter Store has a higher default throughput, but at 5,000 requests per minute you would hit those limits too. The correct fix is caching, not switching secret stores.",
    ],
    tags: [
      "secrets-manager",
      "caching",
      "throttling",
      "rotation",
      "performance",
    ],
  },
  {
    id: "qq-203",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "AWS X-Ray",
    question:
      "A distributed order service spans API Gateway, Lambda, SQS, and a downstream fulfillment Lambda. Users report that roughly 2% of orders silently fail — no error is surfaced to the user but the fulfillment step never runs. You need to identify exactly which service leg is dropping these requests. What is the FASTEST path to root cause?",
    options: [
      "Enable X-Ray active tracing on all services in the chain and use the X-Ray Service Map to identify which segment shows a fault percentage",
      "Add CloudWatch Logs Insights queries to each service and manually correlate log lines by timestamp",
      "Increase Lambda timeout and memory on both functions to eliminate resource-related drops",
      "Enable SQS dead-letter queue and inspect messages to find the failing Lambda invocations",
    ],
    correctIndices: [0],
    explanation:
      "X-Ray propagates a trace ID through the entire call chain — API Gateway → Lambda → SQS → Lambda. The Service Map renders every service as a node with its error, fault, and throttle rates. A 2% fault rate will appear visually on the affected node, letting you pinpoint the exact segment in minutes. Manual log correlation requires timestamp alignment across four services and is slow. Increasing resources addresses a guess, not the identified cause. A DLQ only captures SQS-level failures; if the fault is upstream, messages may never reach SQS.",
    optionExplanations: [
      "Correct. X-Ray end-to-end tracing with the Service Map is purpose-built for this problem. The trace ID propagates across all four services, and the map makes the failing segment visually obvious — no manual log correlation needed.",
      "Incorrect. CloudWatch Logs Insights can answer this question eventually, but correlating log lines by timestamp across four services is slow and error-prone. X-Ray is the right tool for distributed tracing.",
      "Incorrect. Increasing timeout and memory is a guess without evidence. You should identify the root cause first, then apply the appropriate fix — not speculatively tune resources.",
      "Incorrect. A DLQ captures messages that could not be processed by the fulfillment Lambda, but if the failure happens in API Gateway or the first Lambda before a message is ever enqueued, the DLQ reveals nothing. It covers only one leg of the chain.",
    ],
    tags: ["xray", "service-map", "tracing", "distributed", "troubleshooting"],
  },
  {
    id: "qq-204",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      "Your e-commerce app stores product reviews in DynamoDB with userId as the partition key and reviewId as the sort key. A new requirement asks you to display all reviews for a given productId, sorted by rating descending. The current table design does not include productId as a key. What is the MOST efficient solution?",
    options: [
      "Migrate the table to use productId as the partition key and userId as the sort key",
      "Create a Global Secondary Index (GSI) with productId as the partition key and rating as the sort key",
      "Perform a full table Scan with a FilterExpression on productId each time the page loads",
      "Add a Local Secondary Index (LSI) with rating as the sort key on the existing table",
    ],
    correctIndices: [1],
    explanation:
      "A GSI with productId as PK and rating as SK lets you Query for all reviews of a product already sorted by rating — a single, efficient Query call. A Scan reads every item in the table and is expensive and slow at scale. An LSI requires the same partition key as the base table (userId) and cannot support productId-based queries. Migrating the table's primary key would break all existing access patterns that rely on userId.",
    optionExplanations: [
      "Incorrect. A GSI with productId as the partition key and rating as the sort key lets you Query for all reviews of a specific product sorted by rating in one efficient call, without touching the base table's key structure.",
      "Correct. A Scan with FilterExpression reads every item in the entire table and then filters — it consumes full table read capacity and becomes extremely expensive and slow as the table grows.",
      "Incorrect. An LSI must share the same partition key as the base table (userId). It cannot support querying by a different partition key like productId.",
      "Incorrect. Changing the partition key from userId to productId would break every existing access pattern that looks up reviews by userId — a destructive change that requires a full data migration.",
    ],
    tags: ["dynamodb", "gsi", "index", "query", "access-patterns"],
  },
  {
    id: "qq-205",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation stack update is stuck in UPDATE_ROLLBACK_FAILED state. The team cannot delete or update the stack. What is the correct way to recover?",
    options: [
      "Delete the stack and redeploy from scratch — stacks in UPDATE_ROLLBACK_FAILED cannot be recovered",
      "Use the ContinueUpdateRollback API call, optionally skipping resources that cannot be rolled back, to bring the stack back to a stable state",
      "Contact AWS Support to reset the stack state from the backend",
      "Manually fix the underlying resources in the AWS console and then force-delete the stack",
    ],
    correctIndices: [1],
    explanation:
      "UPDATE_ROLLBACK_FAILED means CloudFormation started rolling back a failed update but one or more resources failed during rollback. ContinueUpdateRollback retries the rollback. If a specific resource is permanently stuck (e.g. the underlying resource no longer exists), you can pass it in the ResourcesToSkip parameter and CloudFormation will skip that resource and complete the rollback. The stack is not permanently broken and does not need to be deleted.",
    optionExplanations: [
      "Incorrect. ContinueUpdateRollback is the AWS-documented recovery path for UPDATE_ROLLBACK_FAILED. It retries the rollback operation and allows you to skip specific problematic resources so the stack reaches a stable ROLLBACK_COMPLETE or UPDATE_ROLLBACK_COMPLETE state.",
      "Correct. Stacks in UPDATE_ROLLBACK_FAILED can be recovered using ContinueUpdateRollback without deletion. Deleting and redeploying is a last resort that loses the stack's history and outputs.",
      "Incorrect. Manually fixing resources in the console can help unblock a stuck resource, but you still need to call ContinueUpdateRollback to tell CloudFormation to retry the rollback — console fixes alone do not change the stack state.",
      "Incorrect. AWS Support cannot reset stack state from the backend. ContinueUpdateRollback is the self-service API call designed for exactly this scenario.",
    ],
    tags: [
      "cloudformation",
      "update-rollback-failed",
      "continue-update-rollback",
      "recovery",
    ],
  },
  {
    id: "qq-206",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS IAM",
    question:
      "A developer accidentally committed long-term IAM access keys to a public GitHub repository. The keys are for an IAM user that has S3 read/write access to production buckets. What is the CORRECT order of remediation steps?",
    options: [
      "1) Create a new IAM user with fresh keys  2) Update the application  3) Delete the old user next sprint",
      "1) Add an S3 bucket policy denying the old key  2) Check S3 access logs for suspicious activity",
      "1) Remove the commit from Git history using git rebase  2) Notify the team  3) Rotate the keys in 48 hours during the next maintenance window",
      "1) Immediately deactivate or delete the exposed keys in IAM  2) Check CloudTrail for unauthorized API calls made with those keys  3) Rotate any data that may have been accessed or exfiltrated  4) Enforce short-lived credentials via IAM roles going forward",
    ],
    correctIndices: [3],
    explanation:
      "Once keys are pushed to a public repo they must be treated as fully compromised regardless of how quickly the commit is removed — bots scrape GitHub in seconds. The priority order is: (1) immediately cut off access by deactivating/deleting the key, (2) audit CloudTrail to understand what was done with the key, (3) assess and remediate any data impact, (4) fix the root cause by using IAM roles (which issue short-lived tokens) instead of long-term keys. Deleting from git history does not help — the key is already compromised.",
    optionExplanations: [
      "Incorrect. Deactivating the key first stops the bleeding. CloudTrail audit reveals what was accessed. Data remediation follows. Moving to IAM roles prevents recurrence. This is the AWS-recommended incident response sequence.",
      "Incorrect. Removing the commit is cosmetically useful but irrelevant to security — the keys are already scraped. Waiting 48 hours for a maintenance window is far too slow; damage can occur within minutes.",
      "Incorrect. Creating a new IAM user with fresh keys does not deactivate the compromised keys — the attacker can still use the old credentials until they are explicitly disabled.",
      "Correct. An S3 bucket policy can restrict one bucket, but the IAM user may have access to other resources. The keys must be deactivated in IAM to cut off all access immediately.",
    ],
    tags: [
      "iam",
      "security",
      "key-rotation",
      "incident-response",
      "cloudtrail",
    ],
  },
  {
    id: "qq-207",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    service: "Amazon DynamoDB",
    question:
      "Your DynamoDB table is experiencing hot partition issues — one partition key value (userId '12345') generates 80% of all writes. Which TWO design changes would MOST effectively eliminate the hot partition? (Select TWO)",
    options: [
      "Add a random suffix (1–N) to the partition key and aggregate reads across all suffixed partitions",
      "Enable DynamoDB Auto Scaling to automatically provision more capacity",
      "Switch the table from provisioned to on-demand capacity mode",
      "Use write sharding by appending a calculated shard number based on a hash of a secondary attribute",
      "Add a GSI to distribute reads across a secondary index",
    ],
    correctIndices: [0, 3],
    explanation:
      "Hot partitions occur when a single key receives a disproportionate share of traffic. Both random suffix sharding and calculated hash sharding spread writes across multiple logical partitions for the same userId, distributing the load. Auto Scaling and on-demand mode add capacity but do not fix the hot partition itself — DynamoDB still routes all writes for that key to the same partition, which will hit the per-partition throughput limit. A GSI redistributes reads but not writes.",
    optionExplanations: [
      "Correct. Adding a random suffix (e.g. userId#1 through userId#10) spreads writes evenly across 10 partition key values, distributing load across 10 physical partitions. Reads must query all suffixed partitions and aggregate results.",
      "Incorrect. Auto Scaling increases provisioned capacity but DynamoDB's partition routing is determined by the key. All writes to userId '12345' still land on the same partition — more capacity does not help if the per-partition limit is the bottleneck.",
      "Incorrect. On-demand mode removes capacity planning but does not change partition routing. A single hot partition can still hit per-partition throughput limits regardless of billing mode.",
      "Correct. Using a hash-based shard number derived from a secondary attribute (e.g. orderId % 10 appended to userId) distributes writes deterministically across multiple partitions while remaining predictable for reads.",
      "Incorrect. A GSI creates a separate index that can distribute read capacity, but it does not affect the write distribution on the base table. Hot write partitions on the base table remain hot.",
    ],
    tags: [
      "dynamodb",
      "hot-partition",
      "write-sharding",
      "partition-key",
      "performance",
    ],
  },
  {
    id: "qq-208",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS Elastic Beanstalk",
    question:
      "Your team deploys a Node.js API to Elastic Beanstalk. During a deployment using the 'Rolling' policy, a health check reports that instances in the first batch are unhealthy. What does Elastic Beanstalk do by default?",
    options: [
      "It terminates the unhealthy instances and replaces them with new ones running the old version",
      "It continues the deployment to the remaining batches regardless of the health check failure",
      "It stops the deployment and leaves the successfully updated batch on the new version while the remaining instances stay on the old version",
      "It automatically rolls back all instances to the previous version",
    ],
    correctIndices: [2],
    explanation:
      "With a Rolling deployment, Elastic Beanstalk updates one batch at a time. If a batch becomes unhealthy, the deployment stops at that point — it does not continue to further batches. Crucially, Beanstalk does NOT automatically roll back the already-updated batch. You end up in a mixed-version state: the first batch is on the new (broken) version, the rest are on the old. You must then deploy the old version again or use 'Rolling with additional batch' or 'Immutable' policies to avoid this mixed state.",
    optionExplanations: [
      "Incorrect. Rolling deployments stop on health check failure, leaving a mixed-version environment. This is a known limitation of the Rolling policy — it does not perform automatic rollback.",
      "Incorrect. Elastic Beanstalk's Rolling policy does not perform automatic rollback. Only 'Immutable' deployments can be aborted cleanly; rolling deployments leave the environment in a mixed state.",
      "Correct. Elastic Beanstalk stops the deployment when a batch is unhealthy — it does not continue deploying the broken version to additional batches.",
      "Incorrect. Beanstalk does not terminate the unhealthy instances and replace them with the old version automatically. You must take a manual action to resolve the mixed-version state.",
    ],
    tags: [
      "elastic-beanstalk",
      "rolling-deployment",
      "health-check",
      "deployment",
      "mixed-version",
    ],
  },
  {
    id: "qq-209",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "AWS Lambda",
    question:
      "A Lambda function that writes to DynamoDB is suddenly returning ThrottlingException errors in production. The DynamoDB table has provisioned capacity with Auto Scaling enabled, but scaling has not triggered. CloudWatch shows the table's consumed write capacity is well below provisioned capacity. What is the MOST likely cause?",
    options: [
      "The DynamoDB table is in a different region than the Lambda function",
      "The Lambda function is targeting a specific DynamoDB partition that is exceeding the per-partition throughput limit of 1,000 WCU",
      "Auto Scaling has a cooldown period and needs more time to respond",
      "The Lambda function's IAM role lacks the dynamodb:PutItem permission",
    ],
    correctIndices: [1],
    explanation:
      "DynamoDB throttles at two levels: table level and partition level. Each partition can handle up to 1,000 WCU writes per second. If a hot partition is receiving the majority of writes (common with poor partition key selection), that partition can be throttled even when the overall table capacity is nowhere near its limit — which is exactly what CloudWatch table-level metrics would show. IAM errors produce AccessDeniedException, not ThrottlingException. Auto Scaling cooldowns cause table-level throttling that shows up in metrics. Cross-region would cause connection errors or high latency, not throttling.",
    optionExplanations: [
      "Incorrect. DynamoDB has a per-partition limit of 1,000 WCU/s. If writes concentrate on a single partition (hot partition), that partition throttles even when table-level consumed capacity is low. CloudWatch's table-level metrics do not expose per-partition throughput, making this deceptive.",
      "Correct. A missing IAM permission would throw AccessDeniedException, not ThrottlingException. The error type itself tells you this is a capacity issue, not an authorization issue.",
      "Incorrect. Auto Scaling cooldowns delay scaling of table-level provisioned capacity. In this scenario, table-level capacity is sufficient — the issue is at the partition level, which Auto Scaling cannot address.",
      "Incorrect. Cross-region mismatches would typically produce connection errors, endpoint resolution failures, or very high latency — not ThrottlingException responses.",
    ],
    tags: [
      "dynamodb",
      "throttling",
      "hot-partition",
      "per-partition-limit",
      "troubleshooting",
    ],
  },
  {
    id: "qq-210",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "Amazon Cognito",
    question:
      "Your mobile app uses Cognito User Pools for authentication. A penetration tester reports that unauthenticated users can call your API Gateway endpoint directly by guessing valid JWT tokens. You need to ensure that only tokens issued by your specific Cognito User Pool are accepted. What is the MOST secure configuration?",
    options: [
      "Add a Lambda Authorizer that decodes the JWT payload and checks the 'sub' claim matches a known list of user IDs",
      "Enable AWS WAF on API Gateway with a rule that blocks requests without an Authorization header",
      "Attach a Cognito User Pool Authorizer to API Gateway — it validates the JWT signature, expiry, and issuer against your User Pool automatically",
      "Require callers to include the Cognito App Client ID as a query string parameter and validate it in a Lambda function",
    ],
    correctIndices: [2],
    explanation:
      "A Cognito User Pool Authorizer is natively integrated with API Gateway. It validates the JWT's cryptographic signature using the User Pool's JWKS endpoint, checks the token is not expired, and verifies the issuer (iss) claim matches your specific User Pool URL — all without any custom code. A Lambda Authorizer that only checks the 'sub' claim does not validate the signature and could be spoofed. Passing the App Client ID as a query string is not authentication. WAF can block missing headers but cannot validate JWT contents.",
    optionExplanations: [
      "Incorrect. The Cognito User Pool Authorizer performs full JWT validation: signature verification via JWKS, expiry check, and issuer validation against your User Pool's URL. It is the purpose-built, zero-code solution for this exact requirement.",
      "Incorrect. Checking only the 'sub' claim in a Lambda Authorizer does not validate the JWT signature. An attacker could forge a token with a valid 'sub' value, and this authorizer would accept it.",
      "Correct. The App Client ID is not a secret credential — it is embedded in the mobile app and can be extracted. Validating it provides no real authentication.",
      "Incorrect. WAF can enforce the presence of an Authorization header, but it cannot parse or validate a JWT. It would block requests with no header but allow any request with any value in that header.",
    ],
    tags: [
      "cognito",
      "api-gateway",
      "jwt",
      "authorizer",
      "authentication",
      "security",
    ],
  },
  {
    id: "qq-211",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Step Functions",
    question:
      "You are building an order fulfillment workflow in Step Functions that calls three external payment APIs sequentially. Occasionally, one API call fails with a transient HTTP 503 error. You want the workflow to retry the failed step up to 3 times with exponential backoff before failing the entire execution. What is the CORRECT way to configure this?",
    options: [
      "Wrap each API call in a Lambda function that catches exceptions and retries internally using a for loop",
      "Add a Retry block on the Task state with MaxAttempts: 3, BackoffRate: 2, and IntervalSeconds set to the initial wait time",
      "Enable Step Functions Express Workflows which have built-in automatic retry for transient failures",
      "Use a Choice state after each Task to check if the output is an error and loop back to the Task if it is",
    ],
    correctIndices: [1],
    explanation:
      "Step Functions Task states natively support a Retry block in the state definition. You specify the error types to catch (e.g. States.TaskFailed), MaxAttempts (3), IntervalSeconds for the initial wait, and BackoffRate for exponential multiplier. Step Functions handles the retry logic entirely, including the backoff timing, without any Lambda code changes. Lambda-internal retries hide failures from Step Functions and make the execution history less transparent. A Choice loop works but is complex and non-idiomatic. Express Workflows do not add built-in retry logic.",
    optionExplanations: [
      "Incorrect. The Retry field is a first-class feature of Step Functions Task states. It handles MaxAttempts, exponential backoff via BackoffRate, and error type filtering natively — no custom code required and the retry attempts are visible in the execution history.",
      "Correct. Retrying inside the Lambda function hides the retry attempts from Step Functions. The execution history shows a single Task invocation even if it retried 3 times internally, making debugging harder. It also ties retry logic to the Lambda rather than the workflow definition.",
      "Incorrect. Using a Choice state to loop back is a valid workaround but is verbose, error-prone to implement correctly, and non-idiomatic. The native Retry block was designed specifically to avoid this pattern.",
      "Incorrect. Express Workflows differ from Standard Workflows in execution semantics (at-least-once vs exactly-once) and duration limits — they do not add automatic retry logic beyond what the Retry block provides in any workflow type.",
    ],
    tags: [
      "step-functions",
      "retry",
      "error-handling",
      "backoff",
      "task-state",
    ],
  },
  {
    id: "qq-212",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "Your REST API behind API Gateway is returning HTTP 504 Gateway Timeout errors to clients, but the backend Lambda function logs show it completed successfully within 8 seconds. What is the MOST likely cause?",
    options: [
      "API Gateway has a maximum integration timeout of 29 seconds, but the client is timing out before that; however, a more common misconfiguration is that the Lambda function's response is not reaching API Gateway within the configured integration timeout",
      "The Lambda function is reaching its maximum execution time of 15 minutes",
      "The API Gateway stage has throttling limits set too low, causing requests to be rejected",
      "CloudFront in front of API Gateway is caching the 504 response from a previous request",
    ],
    correctIndices: [0],
    explanation:
      "API Gateway has a hard maximum integration timeout of 29 seconds. If the backend takes longer, or if there is a network-level delay between API Gateway and Lambda that causes the response to not arrive within the configured timeout, API Gateway returns a 504. Lambda logs showing '8 seconds' means the function itself ran for 8s — but if the API Gateway integration timeout is set lower (e.g. 5 seconds), API Gateway times out before Lambda finishes, even though Lambda eventually completes. The fix is to check and increase the API Gateway integration timeout, and ensure Lambda finishes well within that window.",
    optionExplanations: [
      "Correct. API Gateway has a configurable integration timeout (default 29 seconds, minimum 50ms). If Lambda takes longer than the configured timeout, API Gateway returns 504 — even if Lambda eventually succeeds. The Lambda logs showing completion does not mean API Gateway received the response in time.",
      "Incorrect. Lambda's maximum execution timeout is 15 minutes (900 seconds). An 8-second function is nowhere near this limit and this would not cause a 504 from API Gateway.",
      "Incorrect. Throttling at API Gateway returns HTTP 429 (Too Many Requests), not 504. A 504 specifically indicates a timeout or unreachable backend.",
      "Incorrect. CloudFront can cache error responses, but this would be a red herring — the root issue is the timeout configuration, not a cached stale 504.",
    ],
    tags: [
      "api-gateway",
      "504",
      "integration-timeout",
      "lambda",
      "troubleshooting",
    ],
  },
  {
    id: "qq-213",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SQS",
    question:
      "Your application publishes messages to an SQS queue and a downstream consumer processes them. During testing you notice that some messages are processed out of order. The business logic requires strict FIFO processing. What change is required?",
    options: [
      "Migrate from a Standard SQS queue to a FIFO queue and group related messages using the same MessageGroupId",
      "Set the SQS visibility timeout to a very high value so only one consumer processes one message at a time",
      "Reduce the number of consumer Lambda functions to a single instance to enforce serial processing",
      "Add a sequence number attribute to messages and sort them in the consumer application before processing",
    ],
    correctIndices: [0],
    explanation:
      "Standard SQS queues offer best-effort ordering and at-least-once delivery — they do not guarantee FIFO. FIFO queues guarantee exactly-once processing and strict ordering within a message group. Using the same MessageGroupId for related messages ensures they are processed in the exact order they were sent. Increasing visibility timeout does not enforce order. A single consumer reduces parallelism but still does not guarantee message order from the queue. Application-level sorting is complex and error-prone.",
    optionExplanations: [
      "Correct. FIFO queues are purpose-built for ordered, exactly-once delivery. Messages with the same MessageGroupId are delivered in strict FIFO order to consumers. This is the correct architectural change.",
      "Incorrect. A high visibility timeout ensures one consumer works on a message at a time but does nothing to enforce the order in which messages are delivered. Messages can still arrive out of order from a Standard queue.",
      "Incorrect. A single consumer reduces throughput but does not fix the ordering problem. The queue can still return messages in any order — the consumer just processes them one at a time in whatever order it receives them.",
      "Incorrect. Application-level sorting requires every message to arrive before processing can begin, which is impractical for streaming workloads and adds significant complexity. The correct fix is at the queue level.",
    ],
    tags: ["sqs", "fifo", "ordering", "message-group", "exactly-once"],
  },
  {
    id: "qq-214",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS KMS",
    question:
      "A Lambda function needs to decrypt an environment variable that was encrypted using a customer-managed KMS key (CMK). The function is in Account A. The CMK is in Account B. What must be configured to allow the cross-account decryption?",
    options: [
      "The KMS key policy in Account B must grant the Lambda execution role in Account A the kms:Decrypt permission, AND the IAM role in Account A must have an IAM policy allowing kms:Decrypt on that key ARN",
      "The Lambda execution role in Account A needs only an IAM policy with kms:Decrypt — KMS key policies in Account B are not required for cross-account access",
      "An S3 bucket must be used as an intermediary to pass the decryption token between accounts",
      "The Lambda function must assume a role in Account B using STS to perform the decryption locally in Account B",
    ],
    correctIndices: [0],
    explanation:
      "Cross-account KMS access requires permissions in BOTH accounts. The KMS key policy (resource-based policy) in Account B must explicitly grant the external principal (Account A's Lambda role or Account A root) access. Additionally, the IAM identity in Account A must have an IAM policy allowing it to call kms:Decrypt on that specific key ARN. Both conditions must be true — the key policy alone is not sufficient, and the IAM policy alone is not sufficient. This two-layer requirement is a common exam trap.",
    optionExplanations: [
      "Correct. Cross-account KMS access is a two-policy requirement: the key policy in the key-owning account must grant the cross-account principal, and the IAM policy in the calling account must permit the action on that key ARN. Missing either layer blocks access.",
      "Incorrect. For same-account access, an IAM policy alone can be sufficient if the key policy grants access to the account root. For cross-account access, the key policy MUST explicitly name the external principal — the IAM policy alone is not enough.",
      "Incorrect. No S3 intermediary or token-passing mechanism is needed. KMS natively supports cross-account API calls when both the key policy and IAM policy are configured correctly.",
      "Incorrect. Assuming a role in Account B is one valid approach, but it is not required — cross-account KMS calls can be made directly without role assumption when key and IAM policies are both configured correctly.",
    ],
    tags: ["kms", "cross-account", "key-policy", "iam", "decrypt", "security"],
  },
  {
    id: "qq-215",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS SAM",
    question:
      "A developer runs `sam deploy` and receives the error: 'S3 error: Access Denied' even though the IAM user has s3:PutObject permission on the deployment bucket. The SAM template includes a serverless application that references a layer. What is the MOST likely cause?",
    options: [
      "The Lambda layer ARN referenced in the template does not exist and SAM cannot upload a placeholder",
      "The SAM CLI is not installed correctly and needs to be reinstalled",
      "The AWS region in the SAM config does not match the region of the S3 bucket",
      "The deployment bucket has a bucket policy that requires s3:PutObjectAcl or object ownership settings that conflict with the IAM user's ability to upload",
    ],
    correctIndices: [3],
    explanation:
      "This is a common SAM/CloudFormation deployment trap. Even when an IAM identity has s3:PutObject, an S3 Access Denied can occur if the bucket has a policy requiring s3:PutObjectAcl (e.g. bucket-owner-full-control ACL) and the identity lacks that permission, or if the bucket's Object Ownership setting is set to 'Bucket owner enforced' which disables ACLs but the upload request tries to set one. Region mismatches produce a different error. A missing layer ARN fails at CloudFormation, not S3. Reinstalling SAM does not fix IAM/bucket policy issues.",
    optionExplanations: [
      "Incorrect. The most common cause of 'Access Denied' on SAM deployments when PutObject is granted is a bucket policy or Object Ownership configuration that requires ACL permissions the IAM identity lacks. Specifically, if the bucket requires uploads to include a bucket-owner-full-control ACL, you need s3:PutObjectAcl as well.",
      "Incorrect. SAM CLI installation issues produce entirely different error messages related to CLI execution, not S3 API errors.",
      "Incorrect. A missing Lambda layer ARN causes a CloudFormation template validation or deployment error — not an S3 access denied error during the artifact upload phase.",
      "Correct. A region mismatch typically produces a different error such as 'bucket does not exist in the specified region' or a redirect error — not a generic Access Denied.",
    ],
    tags: [
      "sam",
      "s3",
      "deployment",
      "access-denied",
      "bucket-policy",
      "troubleshooting",
    ],
  },
  {
    id: "qq-216",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "multi",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation stack fails with 'Resource handler returned message: Resource of type AWS::Lambda::Function already exists.' Which TWO actions can resolve this? (Select TWO)",
    options: [
      "Import the existing Lambda function resource into the CloudFormation stack using the resource import feature",
      "Delete the existing Lambda function manually, then retry the stack creation",
      "Add DeletionPolicy: Retain to the Lambda resource in the template",
      "Rename the Lambda function's LogicalId in the template to force CloudFormation to create a new function with a different name",
      "Add DependsOn between the Lambda and its execution role to ensure correct creation order",
    ],
    correctIndices: [0, 1],
    explanation:
      "This error occurs when CloudFormation tries to create a resource that already exists outside of the stack (an orphaned resource). Two valid fixes: (1) Use CloudFormation resource import (aws cloudformation import-stack) to bring the existing function under the stack's management without recreating it. (2) Delete the orphaned function manually so CloudFormation can create it cleanly. Adding DeletionPolicy: Retain applies to stack deletion, not creation failures. Renaming the LogicalId creates a differently-named function but doesn't resolve the existing one. DependsOn affects creation order, not name conflicts.",
    optionExplanations: [
      "Correct. CloudFormation resource import allows you to adopt an existing resource into a stack without deleting and recreating it. This is the non-destructive fix that preserves the existing function and its configuration.",
      "Correct. Deleting the orphaned resource removes the conflict, allowing CloudFormation to create it fresh with the desired configuration. This is destructive but straightforward when the existing resource has no state worth preserving.",
      "Incorrect. DeletionPolicy: Retain tells CloudFormation what to do with a resource when the stack is deleted — it has no effect on a creation failure caused by a pre-existing resource.",
      "Incorrect. Renaming the LogicalId causes CloudFormation to try creating a new function with a different physical name (if FunctionName is derived from the LogicalId), but the originally conflicting resource still exists and is now unmanaged by the stack.",
      "Incorrect. DependsOn controls the order in which CloudFormation creates resources within the stack. It does not resolve a conflict where the resource already exists outside the stack.",
    ],
    tags: [
      "cloudformation",
      "resource-import",
      "already-exists",
      "troubleshooting",
      "orphaned-resource",
    ],
  },
  {
    id: "qq-217",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "Your Kinesis Data Stream has 10 shards and processes clickstream data. A single shard is consistently hitting the 1 MB/s write limit. You identify that all clicks from a high-traffic webpage share the same partition key. What is the correct fix without increasing the number of shards?",
    options: [
      "Switch from PutRecord to PutRecords API to batch writes and reduce the per-call overhead",
      "Increase the shard's write limit by enabling enhanced fan-out on the stream",
      "Use a randomized or calculated partition key (e.g. append a random suffix or hash a secondary attribute) to distribute writes across all 10 shards",
      "Enable server-side encryption on the stream to reduce the data payload size per record",
    ],
    correctIndices: [2],
    explanation:
      "Kinesis routes records to shards based on the partition key hash. If all high-traffic records share the same partition key, they all map to the same shard, causing a hot shard. Distributing writes by varying the partition key spreads records across multiple shards, each with its own 1 MB/s limit. Enhanced fan-out is a read-side feature (increases read throughput per consumer) and has no effect on write limits. PutRecords batches API calls but does not change shard routing — the hot shard still receives all records. Encryption affects data security, not throughput.",
    optionExplanations: [
      "Incorrect. Varying the partition key (randomizing or hashing a secondary attribute) changes which shard each record maps to, distributing load across all 10 shards and effectively multiplying write throughput by up to 10x without adding shards.",
      "Incorrect. Enhanced fan-out (RegisterStreamConsumer) is a read-side feature that gives each registered consumer a dedicated 2 MB/s read pipe per shard instead of sharing the shard's 2 MB/s read budget. It has no impact on shard write limits.",
      "Correct. PutRecords reduces the number of API round trips by batching records in one call, but each record in the batch is still routed to its shard based on the partition key. If all records have the same key, they all go to the same shard.",
      "Incorrect. Server-side encryption (SSE) encrypts data at rest using KMS but does not compress or reduce the size of records in transit. It has no effect on shard throughput limits.",
    ],
    tags: [
      "kinesis",
      "hot-shard",
      "partition-key",
      "write-throughput",
      "sharding",
    ],
  },
  {
    id: "qq-218",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS STS",
    question:
      "A developer is building a mobile app that needs to give users temporary AWS credentials to upload files directly to S3. The users authenticate via Cognito User Pools. What is the CORRECT architecture for vending temporary AWS credentials to these authenticated users?",
    options: [
      "The backend issues long-term IAM access keys per user and stores them in the app's local storage",
      "The mobile app calls the AWS STS AssumeRole API directly using a hardcoded IAM access key embedded in the app binary",
      "Cognito Identity Pool (Federated Identities) exchanges the Cognito User Pool token for temporary STS credentials scoped to an IAM role, which the mobile app uses to call S3 directly",
      "API Gateway and Lambda generate presigned S3 URLs on behalf of the user, so no AWS credentials are needed in the app",
    ],
    correctIndices: [2],
    explanation:
      "Cognito Identity Pools are purpose-built for this pattern. After a user authenticates with a Cognito User Pool, the app passes the ID token to the Identity Pool. The Identity Pool calls STS AssumeRoleWithWebIdentity and returns temporary credentials (15 minutes to hours) scoped to an IAM role. The app uses these credentials directly to upload to S3. Hardcoding IAM keys in the app binary is a critical security vulnerability. Presigned URLs are a valid alternative but the question asks about credential vending. Long-term per-user keys are unscalable and insecure.",
    optionExplanations: [
      "Incorrect. Cognito Identity Pools exchange identity provider tokens (including Cognito User Pool tokens) for temporary AWS credentials via STS. This is the AWS-recommended pattern for giving authenticated mobile users scoped AWS access.",
      "Incorrect. Embedding IAM access keys in a mobile app binary is a severe security vulnerability — the keys can be extracted by anyone who downloads the app. This violates the principle of least privilege and AWS security best practices.",
      "Correct. Presigned URLs are a valid approach and may even be preferable in some cases, but the question specifically asks about vending AWS credentials to authenticated users. Presigned URLs solve a related but different problem and are generated server-side.",
      "Incorrect. Long-term per-user IAM access keys do not scale to many users, are difficult to rotate, and violate the principle of using temporary credentials. Storing them in local storage also makes them vulnerable to device theft.",
    ],
    tags: [
      "cognito",
      "identity-pool",
      "sts",
      "temporary-credentials",
      "mobile",
      "s3",
    ],
  },
  {
    id: "qq-219",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodePipeline",
    question:
      "Your CI/CD pipeline using CodePipeline, CodeBuild, and CodeDeploy is deploying a Lambda function. After a successful deployment, automated integration tests catch a regression. You need to automatically trigger a rollback to the previous Lambda version in the pipeline. What is the BEST approach?",
    options: [
      "Set the Lambda function's reserved concurrency to 0 to disable the broken version, then manually redeploy",
      "Add a post-deployment test stage in CodePipeline; if tests fail, the pipeline invokes a Lambda or CodeBuild action that publishes the previous Lambda version alias back to the stable alias",
      "Configure CodeDeploy with a Linear10PercentEvery1Minute deployment config so rollback is automatic if alarms fire",
      "Use CodePipeline's built-in automatic rollback feature to revert to the last successful pipeline execution",
    ],
    correctIndices: [1],
    explanation:
      "CodePipeline does not have a built-in automatic rollback to a previous execution. The pattern is: deploy the new version, then run integration tests as a pipeline stage. If that stage fails, a subsequent action (Lambda function or CodeBuild) updates the Lambda alias to point to the previously published version. CodeDeploy's alarm-based rollback works for traffic-shifting deployments (canary/linear) — if you are deploying via CodeDeploy with traffic shifting, option B would also work. For a pure CodePipeline flow, option A is the general pattern. Setting concurrency to 0 disables the function but does not deploy the old version.",
    optionExplanations: [
      "Incorrect. The standard pattern for CodePipeline rollback is to run integration tests as a stage and, on failure, invoke an action that updates the Lambda alias back to the stable version. This is explicit, auditable, and fits the pipeline model.",
      "Correct. CodeDeploy's Linear10PercentEvery1Minute deployment config with CloudWatch alarm-based rollback is a valid approach for traffic-shifting Lambda deployments, but it operates at the CodeDeploy level and requires CodeDeploy to be configured for Lambda traffic shifting — it is not a CodePipeline-level automatic rollback.",
      "Incorrect. CodePipeline does not have a native 'rollback to last successful execution' feature. Pipelines are one-directional — you must build the rollback logic explicitly as a pipeline stage or action.",
      "Incorrect. Setting reserved concurrency to 0 disables all invocations of the function, causing an outage. It does not restore the previous version. Users would experience failures until a new deployment restores service.",
    ],
    tags: [
      "codepipeline",
      "rollback",
      "lambda",
      "alias",
      "integration-tests",
      "cicd",
    ],
  },
];
