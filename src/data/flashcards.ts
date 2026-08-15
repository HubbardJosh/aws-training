import { FlashCard } from "../types";

export const flashcards: FlashCard[] = [
  // ─── DOMAIN 1: DEVELOPMENT WITH AWS SERVICES ───────────────────────────────

  // Lambda
  {
    id: "fc-lambda-001",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "medium",
    question: "What are the Lambda invocation types and when do you use each?",
    answer:
      "RequestResponse (synchronous) — caller waits for result. Event (asynchronous) — Lambda queues the event and returns immediately. DryRun — validates params without invoking.",
    keyPoints: [
      "API Gateway always uses synchronous (RequestResponse)",
      "S3, SNS, EventBridge use async (Event)",
      "Async invocations retry twice on failure",
      "Use Destinations or DLQ to capture async failures",
    ],
    tags: ["lambda", "invocation", "async", "sync"],
  },
  {
    id: "fc-lambda-002",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "hard",
    question: "Explain Lambda cold starts and how to mitigate them.",
    answer:
      "A cold start occurs when Lambda provisions a new execution environment — downloading code, initializing the runtime, and running handler init code. Mitigations: Provisioned Concurrency (pre-warms envs), keep functions warm with scheduled pings, minimize package size, choose faster runtimes (Node.js, Python over Java).",
    keyPoints: [
      "Provisioned Concurrency eliminates cold starts at cost",
      "Reserved Concurrency limits max concurrent executions",
      "Init code outside the handler runs once per environment",
      "VPC adds ~1-2s cold start due to ENI creation (improved with hyperplane ENI)",
    ],
    tags: ["lambda", "cold-start", "concurrency", "performance"],
  },
  {
    id: "fc-lambda-003",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "medium",
    question: "What is a Lambda Layer and when would you use one?",
    answer:
      "A Layer is a ZIP archive with libraries, custom runtimes, or config data. Functions can reference up to 5 layers. Layers are extracted to /opt in the execution environment. Used to share common dependencies across functions without bundling them into each deployment package.",
    keyPoints: [
      "Max 5 layers per function",
      "Layers are versioned; functions reference specific versions",
      "Layer code lives at /opt/[layer-contents]",
      "Reduces deployment package size",
    ],
    tags: ["lambda", "layers", "dependencies"],
  },
  {
    id: "fc-lambda-004",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "hard",
    question:
      "How does Lambda handle errors in stream-based (Kinesis/DynamoDB Streams) event sources?",
    answer:
      "Lambda retries the entire batch until success or the data expires. Use bisect-on-error to split failing batches, set maximum retry attempts, configure a destination for failed records, or use a DLQ to prevent indefinite blocking.",
    keyPoints: [
      "BisectBatchOnFunctionError splits the batch to isolate bad records",
      "MaximumRetryAttempts controls retry count",
      "DestinationConfig (OnFailure) sends failed batches to SQS or SNS",
      "Without handling, a poison pill blocks the shard",
    ],
    tags: ["lambda", "kinesis", "dynamodb-streams", "error-handling"],
  },
  {
    id: "fc-lambda-005",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "medium",
    question: "What is Lambda Destinations and how does it differ from DLQ?",
    answer:
      "Destinations route async invocation outcomes (success AND failure) to SQS, SNS, Lambda, or EventBridge. DLQ only captures failures and only supports SQS/SNS. Destinations provide richer metadata including the full request and response.",
    keyPoints: [
      "Destinations support OnSuccess and OnFailure routing",
      "DLQ = failure only, Destinations = both outcomes",
      "Destinations include function request/response context",
      "Prefer Destinations over DLQ for async functions",
    ],
    tags: ["lambda", "destinations", "dlq", "error-handling"],
  },
  {
    id: "fc-lambda-006",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "easy",
    question:
      "What are Lambda environment variable limits and security considerations?",
    answer:
      "Total size of all env vars is 4 KB. Stored as plain text by default; encrypt sensitive values using KMS. Access via process.env (Node) or os.environ (Python). Use Secrets Manager or SSM Parameter Store for rotation.",
    keyPoints: [
      "4 KB total env var storage",
      "Encrypt at-rest with KMS CMK",
      "Prefer Secrets Manager for credentials needing rotation",
      "Avoid putting secrets directly in env vars without encryption",
    ],
    tags: ["lambda", "environment-variables", "security", "kms"],
  },
  {
    id: "fc-lambda-007",
    service: "AWS Lambda",
    domain: "development",
    difficulty: "hard",
    question:
      "Explain Lambda concurrency: reserved vs. provisioned vs. unreserved.",
    answer:
      "Unreserved: shared pool across all functions in region (default 1000). Reserved: guarantees N concurrent executions for a function, throttles if exceeded; subtracts from unreserved pool. Provisioned: pre-initializes N environments to eliminate cold starts, counts against reserved.",
    keyPoints: [
      "Default account limit: 1000 concurrent (can be raised)",
      "Reserved = 0 effectively disables the function",
      "Provisioned Concurrency is billed even when idle",
      "Use Reserved to protect other functions from one runaway function",
    ],
    tags: ["lambda", "concurrency", "reserved", "provisioned"],
  },

  // API Gateway
  {
    id: "fc-apigw-001",
    service: "Amazon API Gateway",
    domain: "development",
    difficulty: "medium",
    question:
      "What are the differences between REST API, HTTP API, and WebSocket API in API Gateway?",
    answer:
      "REST API: full features (usage plans, API keys, request validation, caching, WAF). HTTP API: lower cost (~70% cheaper), lower latency, supports OIDC/OAuth2 natively, fewer features. WebSocket API: persistent bidirectional connections for real-time apps.",
    keyPoints: [
      "HTTP API lacks resource policies and usage plans",
      "REST API supports edge-optimized, regional, and private endpoints",
      "WebSocket uses $connect, $disconnect, $default route keys",
      "HTTP API is preferred for Lambda proxy integrations",
    ],
    tags: ["api-gateway", "rest", "http-api", "websocket"],
  },
  {
    id: "fc-apigw-002",
    service: "Amazon API Gateway",
    domain: "development",
    difficulty: "hard",
    question: "How does API Gateway request/response mapping work?",
    answer:
      "Mapping templates (VTL — Velocity Template Language) transform request body/headers before sending to integration, and transform integration response before returning to client. Used in non-proxy integrations. Proxy integrations pass through raw request.",
    keyPoints: [
      "VTL is used for mapping templates",
      "Proxy integration bypasses mapping — simpler but less flexible",
      "Integration request maps client input to backend format",
      "Integration response maps backend output to client format",
    ],
    tags: ["api-gateway", "mapping-templates", "vtl", "integration"],
  },
  {
    id: "fc-apigw-003",
    service: "Amazon API Gateway",
    domain: "development",
    difficulty: "medium",
    question: "What is API Gateway stage variables and how are they used?",
    answer:
      "Stage variables are key-value pairs associated with a deployment stage. Used to configure integrations dynamically (e.g., point to different Lambda aliases or HTTP endpoints per stage). Referenced with ${stageVariables.variableName} in integration URIs.",
    keyPoints: [
      "Enable one API definition across dev/test/prod stages",
      "Lambda ARN can include alias via stage variable",
      "Available in mapping templates and Lambda as context.stage",
      "Max 512 characters per value",
    ],
    tags: ["api-gateway", "stages", "stage-variables", "deployment"],
  },
  {
    id: "fc-apigw-004",
    service: "Amazon API Gateway",
    domain: "security",
    difficulty: "hard",
    question: "What are the three types of API Gateway authorizers?",
    answer:
      "IAM Authorization: uses SigV4 signed requests, identity from caller's AWS credentials. Lambda Authorizer (custom): runs a Lambda to validate tokens (JWT, OAuth) and return IAM policy. Cognito User Pool: validates JWT from Cognito, no Lambda needed.",
    keyPoints: [
      "IAM auth requires AWS credentials — good for service-to-service",
      "Lambda authorizer result can be cached (TTL up to 3600s)",
      "Cognito authorizer validates JWT automatically",
      "Resource policies restrict which principals can call the API",
    ],
    tags: ["api-gateway", "authorizer", "iam", "cognito", "lambda-authorizer"],
  },

  // DynamoDB
  {
    id: "fc-dynamo-001",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "hard",
    question:
      "Explain DynamoDB partition key design and why high cardinality matters.",
    answer:
      "DynamoDB distributes data across partitions using the partition key hash. High-cardinality keys spread reads/writes evenly. Low-cardinality keys (e.g., status: active/inactive) cause hot partitions, throttling, and poor performance. Use composite keys or write-sharding for hot keys.",
    keyPoints: [
      "Each partition handles 3000 RCU and 1000 WCU",
      "Write sharding: append random suffix to hot key",
      "Avoid sequential IDs (timestamps, auto-increment) as partition keys",
      "Use UUIDs or user_id for high cardinality",
    ],
    tags: ["dynamodb", "partition-key", "performance", "hot-partition"],
  },
  {
    id: "fc-dynamo-002",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    question: "What is the difference between a GSI and an LSI in DynamoDB?",
    answer:
      "LSI (Local Secondary Index): same partition key, different sort key; created at table creation only; shares throughput with table; strong consistency supported. GSI (Global Secondary Index): different partition and sort key; can be added anytime; has its own throughput; eventually consistent only.",
    keyPoints: [
      "Max 5 LSIs per table, created at table creation",
      "Max 20 GSIs per table, can be added/removed later",
      "GSI has its own RCU/WCU settings",
      "LSI supports strongly consistent reads; GSI does not",
    ],
    tags: ["dynamodb", "gsi", "lsi", "indexes"],
  },
  {
    id: "fc-dynamo-003",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    question: "What is DynamoDB Streams and what are common use cases?",
    answer:
      "DynamoDB Streams captures a time-ordered sequence of item-level changes. Retention: 24 hours. View types: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES. Use cases: trigger Lambda on changes, replicate data cross-region, audit trail, ETL pipelines.",
    keyPoints: [
      "24-hour retention window",
      "Each stream record appears exactly once",
      "Lambda polls stream via event source mapping",
      "Use NEW_AND_OLD_IMAGES for before/after comparison",
    ],
    tags: ["dynamodb", "streams", "lambda", "event-driven"],
  },
  {
    id: "fc-dynamo-004",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "hard",
    question:
      "Explain DynamoDB read consistency models and their capacity costs.",
    answer:
      "Eventually Consistent Read: may return stale data; costs 0.5 RCU per 4 KB. Strongly Consistent Read: always returns latest data; costs 1 RCU per 4 KB. Transactional Read (TransactGetItems): costs 2 RCU per 4 KB. GSIs only support eventual consistency.",
    keyPoints: [
      "Default reads are eventually consistent",
      "Strong consistency doubles RCU cost",
      "Transactions double the cost again (2x strong)",
      "Use eventual consistency when possible for lower cost",
    ],
    tags: ["dynamodb", "consistency", "rcu", "transactions"],
  },
  {
    id: "fc-dynamo-005",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "hard",
    question:
      "What is DynamoDB conditional expressions and optimistic locking?",
    answer:
      "Conditional expressions let you apply writes only if conditions are true (e.g., attribute_exists, attribute_not_exists, version = :expected). Optimistic locking uses a version attribute: read item, check version matches, write with condition version = read_version. If another write changed it, condition fails with ConditionalCheckFailedException.",
    keyPoints: [
      "Use attribute_not_exists(pk) to prevent overwrites on put",
      "Optimistic locking avoids pessimistic DB locks",
      "DynamoDB has a version_number pattern in its SDK",
      "ConditionalCheckFailedException = concurrent modification detected",
    ],
    tags: ["dynamodb", "conditional-expressions", "optimistic-locking"],
  },
  {
    id: "fc-dynamo-006",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    question: "What is DynamoDB Accelerator (DAX) and when should you use it?",
    answer:
      "DAX is an in-memory cache for DynamoDB providing microsecond read latency (vs millisecond). Write-through cache. Compatible with DynamoDB API. Use for read-heavy, latency-sensitive workloads. Not suitable for strongly consistent reads (DAX returns cached/eventually consistent data).",
    keyPoints: [
      "Microsecond latency for cached reads",
      "Write-through: writes go to DynamoDB AND cache",
      "Not for strongly consistent reads",
      "DAX is a cluster — Multi-AZ capable",
    ],
    tags: ["dynamodb", "dax", "caching", "performance"],
  },
  {
    id: "fc-dynamo-007",
    service: "Amazon DynamoDB",
    domain: "development",
    difficulty: "medium",
    question: "Compare DynamoDB Query vs. Scan operations.",
    answer:
      "Query: fetches items by partition key (required) + optional sort key condition; efficient; reads only relevant partition. Scan: reads every item in the table; expensive; use FilterExpression to reduce result size but you still pay for full scan. Use ProjectionExpression to limit attributes returned.",
    keyPoints: [
      "Query requires partition key; Scan does not",
      "Scan reads entire table — avoid on large tables",
      "Parallel Scan splits table into segments for faster results",
      "FilterExpression filters AFTER reading — does not save RCU",
    ],
    tags: ["dynamodb", "query", "scan", "performance"],
  },

  // S3
  {
    id: "fc-s3-001",
    service: "Amazon S3",
    domain: "development",
    difficulty: "medium",
    question: "What are the S3 storage classes and when do you use each?",
    answer:
      "Standard: frequent access, low latency. Standard-IA: infrequent access, lower cost, retrieval fee. One Zone-IA: infrequent, single AZ. Glacier Instant: archive, millisecond retrieval. Glacier Flexible: minutes-hours retrieval. Glacier Deep Archive: cheapest, 12-48h retrieval. Intelligent-Tiering: auto-moves objects between tiers.",
    keyPoints: [
      "Minimum storage duration: Standard-IA & One Zone-IA = 30 days; Glacier Instant = 90; Deep Archive = 180",
      "Retrieval fees apply for IA and Glacier classes",
      "Intelligent-Tiering has no retrieval fee, charges monitoring fee",
      "Use lifecycle policies to auto-transition objects",
    ],
    tags: ["s3", "storage-classes", "cost", "lifecycle"],
  },
  {
    id: "fc-s3-002",
    service: "Amazon S3",
    domain: "development",
    difficulty: "medium",
    question: "What is S3 Pre-Signed URL and when would you use it?",
    answer:
      "A pre-signed URL grants temporary access to a private S3 object using the credentials of the signer. Default expiry: 3600s (max 7 days with STS; max 12h with IAM role). Use case: allow users to upload/download objects without AWS credentials.",
    keyPoints: [
      "Signed with AWS credentials of creator",
      "Works for GET and PUT operations",
      "Expiry configurable up to 604800s (7 days) for IAM user",
      "IAM role-based pre-signed URLs expire when role credentials expire",
    ],
    tags: ["s3", "presigned-url", "security", "access"],
  },
  {
    id: "fc-s3-003",
    service: "Amazon S3",
    domain: "development",
    difficulty: "hard",
    question: "Explain S3 multipart upload and when it is required.",
    answer:
      "Multipart upload splits large objects into parts uploaded in parallel, then assembled. Required for objects > 5 GB; recommended for objects > 100 MB. Each part (except last) must be ≥ 5 MB. Parts can be uploaded in parallel. Unfinished uploads incur storage costs — use lifecycle policy to abort after N days.",
    keyPoints: [
      "Required: > 5 GB; recommended: > 100 MB",
      "Min part size: 5 MB (except last part)",
      "Max parts: 10,000",
      "Use S3 Transfer Acceleration + multipart for intercontinental uploads",
    ],
    tags: ["s3", "multipart-upload", "performance", "large-files"],
  },
  {
    id: "fc-s3-004",
    service: "Amazon S3",
    domain: "security",
    difficulty: "medium",
    question:
      "What is the difference between S3 bucket policy, ACL, and access points?",
    answer:
      "Bucket Policy: resource-based JSON policy; can grant cross-account access; supports conditions. ACL: legacy per-object or bucket access control; AWS recommends disabling ACLs. Access Points: named network endpoints with their own policies; simplify access control for shared datasets.",
    keyPoints: [
      "Block Public Access setting overrides bucket policies and ACLs",
      "ACLs are disabled by default on new buckets (recommended)",
      "Access Points work with VPC endpoint policies for private access",
      "Cross-account: use bucket policy, not ACL, for modern access control",
    ],
    tags: ["s3", "bucket-policy", "acl", "access-points", "security"],
  },
  {
    id: "fc-s3-005",
    service: "Amazon S3",
    domain: "development",
    difficulty: "medium",
    question: "How does S3 Event Notifications work?",
    answer:
      "S3 can send notifications on object events (PUT, POST, COPY, DELETE, lifecycle, replication) to SQS, SNS, Lambda, or EventBridge. EventBridge supports more filtering and routing options. Configure in bucket Properties > Event Notifications.",
    keyPoints: [
      "Destinations: SQS, SNS, Lambda, EventBridge",
      "EventBridge provides advanced filtering and fan-out",
      "Notifications may be delivered more than once (at-least-once)",
      "Use EventBridge for complex routing rules",
    ],
    tags: ["s3", "event-notifications", "lambda", "eventbridge"],
  },

  // SQS
  {
    id: "fc-sqs-001",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question: "What is the difference between SQS Standard and FIFO queues?",
    answer:
      "Standard: unlimited throughput, at-least-once delivery, best-effort ordering. FIFO: exactly-once processing, ordered delivery (within a message group), max 3000 msg/s with batching, 300 msg/s without.",
    keyPoints: [
      "FIFO queue names must end in .fifo",
      "FIFO uses MessageGroupId for ordering within a group",
      "MessageDeduplicationId prevents duplicate processing (5-min window)",
      "Use Standard for maximum throughput, FIFO for ordered processing",
    ],
    tags: ["sqs", "fifo", "standard", "ordering", "deduplication"],
  },
  {
    id: "fc-sqs-002",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What is SQS visibility timeout and how does it prevent duplicate processing?",
    answer:
      "When a consumer receives a message, it becomes invisible for the visibility timeout period (default 30s, max 12h). The consumer must delete it before timeout or it reappears for other consumers. Extend with ChangeMessageVisibility API call if processing takes longer.",
    keyPoints: [
      "Default: 30s, max: 12 hours",
      "Set timeout > max processing time",
      "Use ChangeMessageVisibility to extend on-the-fly",
      "Message not deleted → reappears → potential duplicate processing",
    ],
    tags: ["sqs", "visibility-timeout", "duplicate-prevention"],
  },
  {
    id: "fc-sqs-003",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    question: "What is SQS long polling vs. short polling?",
    answer:
      "Short polling: returns immediately even if queue is empty; can return empty responses. Long polling: waits up to 20s for messages (WaitTimeSeconds); reduces API calls and cost; eliminates empty responses. Prefer long polling in production.",
    keyPoints: [
      "Long polling max wait: 20 seconds",
      "Set ReceiveMessageWaitTimeSeconds on queue or in API call",
      "Reduces empty responses and API costs",
      "Lambda uses long polling internally for SQS event source mapping",
    ],
    tags: ["sqs", "long-polling", "short-polling", "cost"],
  },
  {
    id: "fc-sqs-004",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question: "What is the SQS Dead Letter Queue (DLQ) and how does it work?",
    answer:
      "A DLQ receives messages that failed processing after maxReceiveCount attempts. Use to isolate problematic messages for debugging. DLQ must be the same type as source queue (Standard→Standard, FIFO→FIFO). Retention period of DLQ should be longer than source queue.",
    keyPoints: [
      "maxReceiveCount: 1–1000, how many times a message is received before going to DLQ",
      "DLQ must match source queue type (Standard or FIFO)",
      "Use DLQ Redrive to replay messages back to source",
      "Set DLQ retention longer than source queue",
    ],
    tags: ["sqs", "dlq", "error-handling", "redrive"],
  },

  // SNS
  {
    id: "fc-sns-001",
    service: "Amazon SNS",
    domain: "development",
    difficulty: "medium",
    question: "What is SNS fan-out pattern and how is it implemented?",
    answer:
      "Fan-out: one SNS topic publishes to multiple SQS queues simultaneously. Decouples publishers from multiple consumers. Each SQS queue gets its own copy of the message. Used for parallel processing, replication, multi-system notifications.",
    keyPoints: [
      "SNS → multiple SQS queues = fan-out",
      "SQS queues must subscribe to SNS topic",
      "Each subscriber gets full copy of message",
      "Combined with SNS filtering for targeted delivery",
    ],
    tags: ["sns", "sqs", "fan-out", "pattern", "event-driven"],
  },
  {
    id: "fc-sns-002",
    service: "Amazon SNS",
    domain: "development",
    difficulty: "hard",
    question: "How does SNS message filtering work?",
    answer:
      "Subscription filter policies let each subscriber receive only messages matching attribute criteria. JSON policy on the subscription. Attributes are set on the message (MessageAttributes). Saves cost by preventing unwanted message delivery.",
    keyPoints: [
      "Filter policy is JSON on the subscription, not the topic",
      "Supports string matching, prefix, numeric range, and exists conditions",
      "Unmatched messages are not delivered (no cost to subscriber)",
      "Up to 5 attributes per filter policy (can request increase)",
    ],
    tags: ["sns", "filtering", "message-attributes", "cost"],
  },

  // Kinesis
  {
    id: "fc-kinesis-001",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "hard",
    question:
      "Compare Kinesis Data Streams, Kinesis Data Firehose, and Kinesis Data Analytics.",
    answer:
      "Data Streams: real-time, custom consumers, configurable retention (1–365 days), manual scaling (shards). Firehose: near-real-time (60s buffer), managed delivery to S3/Redshift/OpenSearch/Splunk/HTTP, no custom consumer needed. Analytics (for Apache Flink): real-time SQL or Flink processing of streaming data.",
    keyPoints: [
      "Streams: custom code, sub-second latency, shards",
      "Firehose: no code, 60s latency min, auto-scales",
      "Analytics: run SQL/Flink on streams",
      "Firehose can read from Kinesis Data Streams",
    ],
    tags: ["kinesis", "data-streams", "firehose", "analytics", "streaming"],
  },
  {
    id: "fc-kinesis-002",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "hard",
    question: "How does Kinesis Data Streams shard capacity work?",
    answer:
      "Each shard: 1 MB/s write (1000 records/s), 2 MB/s read. Records in a shard are ordered by arrival. Partition key determines which shard receives the record. Scale out (split) or in (merge) shards manually or with auto-scaling.",
    keyPoints: [
      "1 shard = 1 MB/s in, 2 MB/s out",
      "Hot shard: too many records with same partition key",
      "Enhanced fan-out: 2 MB/s per consumer per shard (push-based)",
      "Retention: 24h default, up to 365 days (extra cost)",
    ],
    tags: ["kinesis", "shards", "capacity", "partition-key"],
  },

  // EventBridge
  {
    id: "fc-eventbridge-001",
    service: "Amazon EventBridge",
    domain: "development",
    difficulty: "medium",
    question: "What is EventBridge and how does it differ from SNS?",
    answer:
      "EventBridge is a serverless event bus that routes events based on rules. Supports 3rd-party SaaS event sources, schema registry, replay, and archive. SNS is a pub/sub messaging service with simpler filtering. EventBridge has richer filtering (content-based), more targets, and schema discovery.",
    keyPoints: [
      "EventBridge: content-based filtering on any JSON field",
      "SNS: attribute-based filtering, simpler",
      "EventBridge supports SaaS sources (Zendesk, Datadog, etc.)",
      "Archive & Replay lets you reprocess past events",
    ],
    tags: ["eventbridge", "sns", "event-driven", "routing"],
  },

  // Step Functions
  {
    id: "fc-stepfn-001",
    service: "AWS Step Functions",
    domain: "development",
    difficulty: "hard",
    question:
      "What are the Step Functions workflow types and their differences?",
    answer:
      "Standard: exactly-once execution, up to 1 year, auditable history, pay per state transition. Express: at-least-once, max 5 minutes, high-throughput (100K/s), pay per duration. Synchronous Express: caller waits for result. Asynchronous Express: fire-and-forget.",
    keyPoints: [
      "Standard: durable, auditable, 1-year max",
      "Express: high volume, short-lived workflows",
      "Express does not guarantee exactly-once",
      "Use Standard for payment processing; Express for IoT/streaming pipelines",
    ],
    tags: ["step-functions", "standard", "express", "workflows"],
  },
  {
    id: "fc-stepfn-002",
    service: "AWS Step Functions",
    domain: "development",
    difficulty: "medium",
    question: "What are the common Step Functions state types?",
    answer:
      "Task: calls a resource (Lambda, ECS, etc.). Choice: conditional branching. Wait: pause execution. Parallel: run branches concurrently. Map: iterate over array. Pass: pass input to output (for testing/debugging). Succeed/Fail: terminal states.",
    keyPoints: [
      "Task integrates with 200+ AWS services natively",
      "Map state replaces looping with Lambda recursion",
      "Parallel branches run simultaneously; all must succeed",
      "Catch and Retry defined per state for error handling",
    ],
    tags: ["step-functions", "states", "task", "map", "parallel"],
  },

  // AppSync
  {
    id: "fc-appsync-001",
    service: "AWS AppSync",
    domain: "development",
    difficulty: "medium",
    question: "What is AWS AppSync and what use cases is it designed for?",
    answer:
      "AppSync is a managed GraphQL and Pub/Sub API service. Data sources: DynamoDB, Lambda, RDS, HTTP, OpenSearch. Supports real-time subscriptions via WebSocket. Use cases: mobile/web apps needing GraphQL, real-time data sync, offline-capable apps.",
    keyPoints: [
      "GraphQL API with managed resolvers",
      "Real-time subscriptions via WebSocket",
      "Offline sync with Amplify DataStore",
      "Resolver uses VTL mapping templates or JS resolvers",
    ],
    tags: ["appsync", "graphql", "real-time", "subscriptions"],
  },

  // ─── DOMAIN 2: SECURITY ─────────────────────────────────────────────────────

  // IAM
  {
    id: "fc-iam-001",
    service: "AWS IAM",
    domain: "security",
    difficulty: "hard",
    question: "Explain the IAM policy evaluation logic.",
    answer:
      "Evaluation order: 1) Explicit Deny (always wins). 2) Organizations SCPs — if SCP denies, request denied. 3) Resource-based policies. 4) Identity-based policies. 5) IAM permission boundaries. 6) Session policies. Default: implicit deny. Explicit Allow in identity policy + no SCP deny = allow.",
    keyPoints: [
      "Explicit Deny always overrides any Allow",
      "Default is implicit deny if no policy matches",
      "Permission boundaries limit max permissions, do not grant them",
      "SCP in AWS Organizations must allow action for it to succeed",
    ],
    tags: ["iam", "policy-evaluation", "deny", "allow", "scp"],
  },
  {
    id: "fc-iam-002",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    question: "What is an IAM permission boundary and how is it used?",
    answer:
      "A permission boundary is a managed policy that sets the maximum permissions an IAM entity can have. Even if identity-based policies grant more, the boundary limits the effective permissions to the intersection. Used to delegate IAM administration safely.",
    keyPoints: [
      "Boundary = ceiling, not floor; does not grant permissions itself",
      "Effective permissions = identity policy ∩ permission boundary",
      "Useful for delegating IAM creation to developers with guardrails",
      "Does not affect resource-based policies",
    ],
    tags: ["iam", "permission-boundary", "delegation"],
  },
  {
    id: "fc-iam-003",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    question: "How does IAM role assumption work with STS?",
    answer:
      "Call sts:AssumeRole with the role ARN. STS returns temporary credentials (AccessKeyId, SecretAccessKey, SessionToken) valid 15min–12h. Credentials inherit role's permissions. Cross-account: trust policy on target role must allow source account/principal.",
    keyPoints: [
      "sts:AssumeRole returns 3 values: key, secret, token",
      "Default session: 1h; max: 12h (if role allows)",
      "Cross-account requires trust policy on the role",
      "Use IAM roles for EC2/Lambda instead of long-term access keys",
    ],
    tags: ["iam", "sts", "assume-role", "credentials", "cross-account"],
  },

  // Cognito
  {
    id: "fc-cognito-001",
    service: "Amazon Cognito",
    domain: "security",
    difficulty: "hard",
    question:
      "What is the difference between Cognito User Pools and Identity Pools?",
    answer:
      "User Pools: user directory — handles sign-up/sign-in, MFA, email/phone verification, returns JWTs (ID, Access, Refresh tokens). Identity Pools (Federated Identities): exchange tokens (from User Pool, Google, Facebook, etc.) for temporary AWS credentials via STS.",
    keyPoints: [
      "User Pool = authentication (who are you?)",
      "Identity Pool = authorization (what can you access in AWS?)",
      "They are often used together: authenticate with User Pool → get AWS creds from Identity Pool",
      "Identity Pool supports unauthenticated (guest) access",
    ],
    tags: [
      "cognito",
      "user-pool",
      "identity-pool",
      "authentication",
      "authorization",
    ],
  },
  {
    id: "fc-cognito-002",
    service: "Amazon Cognito",
    domain: "security",
    difficulty: "medium",
    question: "What are Cognito User Pool tokens and their uses?",
    answer:
      "ID Token: contains user identity claims (name, email, sub); used to authenticate with backend. Access Token: contains scopes/groups; used to call Cognito APIs and protected API Gateway endpoints. Refresh Token: long-lived; used to get new ID/Access tokens without re-authentication.",
    keyPoints: [
      "ID token = who the user is (JWT with claims)",
      "Access token = what the user is allowed to do",
      "Refresh token default expiry: 30 days",
      "Access/ID token default expiry: 1 hour",
    ],
    tags: ["cognito", "jwt", "tokens", "id-token", "access-token"],
  },

  // KMS
  {
    id: "fc-kms-001",
    service: "AWS KMS",
    domain: "security",
    difficulty: "hard",
    question: "Explain KMS envelope encryption and why it is used.",
    answer:
      "Envelope encryption: generate a Data Encryption Key (DEK) using KMS GenerateDataKey. Encrypt data locally with DEK (fast, no data size limit). Store encrypted DEK alongside encrypted data. To decrypt: call KMS Decrypt on encrypted DEK, then decrypt data locally. KMS only handles key management, not data encryption at scale.",
    keyPoints: [
      "KMS GenerateDataKey returns plaintext + encrypted DEK",
      "Plaintext DEK used to encrypt data, then discarded",
      "Encrypted DEK stored with data",
      "Limits API calls to KMS — cheaper and faster",
    ],
    tags: ["kms", "envelope-encryption", "dek", "encryption"],
  },
  {
    id: "fc-kms-002",
    service: "AWS KMS",
    domain: "security",
    difficulty: "medium",
    question:
      "What are the KMS key types: AWS Managed, Customer Managed, and Customer Provided?",
    answer:
      "AWS Managed Keys: created/managed by AWS for specific services (free, rotated every year automatically). Customer Managed Keys (CMK): created by you, full control, manual or auto rotation, $1/month. Customer Provided Keys (SSE-C for S3): you manage key material outside AWS, no KMS involvement.",
    keyPoints: [
      "AWS managed keys: auto-rotate every 3 years (recently changed from 1 year)",
      "CMK auto-rotation: optional, every year",
      "CMK: can set resource policy, audit via CloudTrail",
      "SSE-C: S3 does not store key; you must provide it on every request",
    ],
    tags: ["kms", "cmk", "aws-managed-key", "sse-c", "rotation"],
  },

  // Secrets Manager
  {
    id: "fc-secrets-001",
    service: "AWS Secrets Manager",
    domain: "security",
    difficulty: "medium",
    question:
      "What is the difference between Secrets Manager and SSM Parameter Store?",
    answer:
      "Secrets Manager: built-in auto-rotation via Lambda, cross-account sharing, $0.40/secret/month, designed for secrets (DB passwords, API keys). SSM Parameter Store: free (Standard), $0.05/10K API calls (Advanced), up to 8KB (Standard), no auto-rotation, simpler use cases (config, flags).",
    keyPoints: [
      "Secrets Manager: auto-rotation, higher cost",
      "SSM Parameter Store Standard: free, 4KB max",
      "SSM Parameter Store Advanced: $0.05/10K calls, 8KB max",
      "Both integrate with Lambda, ECS, EC2 for secrets injection",
    ],
    tags: ["secrets-manager", "ssm", "parameter-store", "secrets", "rotation"],
  },

  // ─── DOMAIN 3: DEPLOYMENT ───────────────────────────────────────────────────

  // CodePipeline / CodeBuild / CodeDeploy
  {
    id: "fc-cicd-001",
    service: "AWS CodePipeline",
    domain: "deployment",
    difficulty: "medium",
    question: "What are the stages and action types in AWS CodePipeline?",
    answer:
      "Stages run sequentially; actions within a stage can run in parallel or series. Action categories: Source (CodeCommit, S3, GitHub), Build (CodeBuild), Test (CodeBuild, Lambda), Deploy (CodeDeploy, ECS, Elastic Beanstalk, CloudFormation, S3), Approval (manual), Invoke (Lambda).",
    keyPoints: [
      "Each stage has at least one action",
      "Actions in a stage can be parallel (runOrder)",
      "Artifacts stored in S3 between stages",
      "Pipeline triggers on source change automatically",
    ],
    tags: ["codepipeline", "ci-cd", "stages", "actions"],
  },
  {
    id: "fc-cicd-002",
    service: "AWS CodeBuild",
    domain: "deployment",
    difficulty: "medium",
    question: "What is the buildspec.yml file and what does it contain?",
    answer:
      "buildspec.yml defines build commands for CodeBuild. Phases: install (install tools), pre_build (setup, auth), build (compile, test), post_build (package, push). Also defines artifacts (output) and cache (for faster builds). Can be in repo root or specified in project config.",
    keyPoints: [
      "Phases: install → pre_build → build → post_build",
      "artifacts section defines what to pass to next stage",
      "cache: paths reduces rebuild time",
      "Environment variables and parameter-store refs supported",
    ],
    tags: ["codebuild", "buildspec", "ci-cd", "phases"],
  },
  {
    id: "fc-cicd-003",
    service: "AWS CodeDeploy",
    domain: "deployment",
    difficulty: "hard",
    question: "What deployment strategies does CodeDeploy support?",
    answer:
      "In-place (EC2/on-prem): deploy to existing instances, brief downtime. Rolling: update batch at a time. Rolling with additional batch: launch new instances first. Blue/Green: provision new environment, shift traffic, terminate old. Canary (Lambda/ECS): shift small % then 100%. Linear (Lambda/ECS): shift incrementally over time.",
    keyPoints: [
      "Blue/green requires Load Balancer",
      "Canary: e.g., Canary10Percent5Minutes = 10% for 5min then 90%",
      "Linear: e.g., Linear10PercentEvery1Minute",
      "AllAtOnce: fastest, no rollback protection",
    ],
    tags: [
      "codedeploy",
      "deployment-strategies",
      "blue-green",
      "canary",
      "rolling",
    ],
  },
  {
    id: "fc-cicd-004",
    service: "AWS CodeDeploy",
    domain: "deployment",
    difficulty: "medium",
    question: "What is the AppSpec file in CodeDeploy?",
    answer:
      "The appspec.yml defines deployment instructions. For EC2/on-prem: files section (what to copy where) and hooks (lifecycle event scripts: BeforeInstall, AfterInstall, ApplicationStart, ValidateService). For Lambda: functions section and hooks (BeforeAllowTraffic, AfterAllowTraffic).",
    keyPoints: [
      "EC2: files + hooks (shell scripts)",
      "Lambda: traffic shifting + hook Lambdas for validation",
      "ECS: containers/ports + hooks for validation",
      "Hooks run in defined lifecycle order; failure stops deployment",
    ],
    tags: ["codedeploy", "appspec", "hooks", "lifecycle"],
  },

  // SAM
  {
    id: "fc-sam-001",
    service: "AWS SAM",
    domain: "deployment",
    difficulty: "medium",
    question: "What is AWS SAM and how does it simplify serverless deployment?",
    answer:
      "SAM (Serverless Application Model) is a CloudFormation extension with shorthand resource types: AWS::Serverless::Function, ::Api, ::SimpleTable, etc. sam build packages code; sam deploy creates/updates CloudFormation stacks. sam local invoke tests Lambda locally.",
    keyPoints: [
      "SAM transforms to CloudFormation at deploy time",
      "AWS::Serverless::Function → Lambda + IAM role + event source mapping",
      "sam local: run Lambda/API Gateway locally for testing",
      "Globals section sets defaults for all functions",
    ],
    tags: [
      "sam",
      "serverless",
      "cloudformation",
      "deployment",
      "local-testing",
    ],
  },

  // CloudFormation
  {
    id: "fc-cfn-001",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "hard",
    question:
      "What are CloudFormation stack policies, change sets, and drift detection?",
    answer:
      "Stack Policy: JSON document preventing accidental updates/deletes to specified resources. Change Set: preview changes before applying; shows add/modify/delete for each resource. Drift Detection: compares actual resource config to template, identifies manual changes outside CloudFormation.",
    keyPoints: [
      "Stack policy does not prevent all updates — use DENY for critical resources",
      "Change sets do not execute automatically; you must execute them",
      "Drift detection is not continuous; run it manually or on schedule",
      "Nested stacks share resources via exports/cross-stack references",
    ],
    tags: ["cloudformation", "stack-policy", "change-sets", "drift"],
  },
  {
    id: "fc-cfn-002",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What are CloudFormation rollback triggers and when do stack updates fail?",
    answer:
      "Stack updates fail and rollback if: resource creation fails, custom resource returns failure, CloudWatch alarms in rollback triggers breach during deployment. Rollback restores previous state. Use --disable-rollback to keep failed state for debugging.",
    keyPoints: [
      "Rollback triggers monitor CloudWatch alarms during update",
      "If alarm breaches, rollback is triggered automatically",
      "ROLLBACK_COMPLETE state: stack rolled back; delete and re-create",
      "UPDATE_ROLLBACK_FAILED: manual intervention needed",
    ],
    tags: ["cloudformation", "rollback", "failure", "alarms"],
  },

  // Elastic Beanstalk
  {
    id: "fc-eb-001",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    difficulty: "medium",
    question: "What deployment policies does Elastic Beanstalk support?",
    answer:
      "All at once: fast, brief downtime. Rolling: update batch of instances at a time, reduced capacity. Rolling with additional batch: spin up new instances first, maintains full capacity. Immutable: spin up new ASG, swap on success. Blue/Green: swap environment URL via CNAME swap.",
    keyPoints: [
      "All at once: fastest, downtime, no extra cost",
      "Immutable: safest, highest cost, slowest",
      "Blue/Green: separate environments, use swap URLs feature",
      "Traffic splitting: canary testing with % to new version",
    ],
    tags: [
      "elastic-beanstalk",
      "deployment-policies",
      "rolling",
      "immutable",
      "blue-green",
    ],
  },

  // CDK
  {
    id: "fc-cdk-001",
    service: "AWS CDK",
    domain: "deployment",
    difficulty: "medium",
    question: "What is AWS CDK and how does it relate to CloudFormation?",
    answer:
      "CDK (Cloud Development Kit) lets you define AWS infrastructure using TypeScript, Python, Java, or Go. CDK synthesizes to CloudFormation templates (cdk synth). CDK constructs are reusable components at three levels: L1 (CloudFormation resources), L2 (opinionated defaults), L3 (patterns/solutions).",
    keyPoints: [
      "cdk synth → CloudFormation template",
      "cdk deploy → synthesize + deploy stack",
      "L1 constructs: direct CloudFormation (CfnBucket)",
      "L2 constructs: higher-level with sensible defaults (Bucket)",
    ],
    tags: ["cdk", "cloudformation", "infrastructure-as-code", "constructs"],
  },

  // ─── DOMAIN 4: TROUBLESHOOTING AND OPTIMIZATION ─────────────────────────────

  // CloudWatch
  {
    id: "fc-cw-001",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "What is the difference between CloudWatch Metrics, Logs, and Traces?",
    answer:
      'Metrics: numeric time-series data (CPU, error count, latency). Logs: text records of events (application output, access logs). Traces (X-Ray): distributed request tracing across services. Together they form observability: metrics for "what", logs for "why", traces for "where".',
    keyPoints: [
      "Metrics: 1-min granularity standard, 1-sec high-resolution (extra cost)",
      "Logs Insights: query language for log analysis",
      "CloudWatch Agent publishes OS-level metrics not available by default",
      "Contributor Insights: find top contributors to log patterns",
    ],
    tags: ["cloudwatch", "metrics", "logs", "observability"],
  },
  {
    id: "fc-cw-002",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "hard",
    question: "What is the CloudWatch Embedded Metric Format (EMF)?",
    answer:
      "EMF lets you embed CloudWatch metric data in structured log events (JSON). Lambda or application writes JSON with _aws.CloudWatchMetrics namespace/dimensions. CloudWatch auto-extracts and publishes metrics without PutMetricData API calls. Cheaper and simpler for high-volume custom metrics.",
    keyPoints: [
      "Embed metrics in logs — no PutMetricData calls needed",
      "JSON format with special _aws key",
      "Works with CloudWatch Logs agent",
      "Good for Lambda where PutMetricData per-invocation is expensive",
    ],
    tags: ["cloudwatch", "emf", "custom-metrics", "lambda"],
  },
  {
    id: "fc-cw-003",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do CloudWatch Alarms work and what are their states?",
    answer:
      "Alarm states: OK (metric within threshold), ALARM (metric breached threshold), INSUFFICIENT_DATA (not enough data). Actions on state change: send SNS notification, trigger Auto Scaling, start/stop EC2. Composite Alarms combine multiple alarms with AND/OR logic.",
    keyPoints: [
      "3 states: OK, ALARM, INSUFFICIENT_DATA",
      "Evaluation period and datapoints-to-alarm control sensitivity",
      "Composite alarms reduce alarm noise",
      "Alarm can trigger EC2 actions, ASG scaling, or SNS",
    ],
    tags: ["cloudwatch", "alarms", "states", "alerting"],
  },

  // X-Ray
  {
    id: "fc-xray-001",
    service: "AWS X-Ray",
    domain: "troubleshooting",
    difficulty: "hard",
    question:
      "How does X-Ray tracing work and what is a segment vs. subsegment?",
    answer:
      "X-Ray traces requests end-to-end. A trace = collection of segments. Segment: data from one service (timing, metadata, errors). Subsegment: breakdown within a segment (DB calls, HTTP requests, custom). The X-Ray daemon receives UDP data from SDKs and sends to X-Ray API.",
    keyPoints: [
      "SDK instruments calls and sends to daemon on port 2000 UDP",
      "Lambda runs the daemon automatically; just enable active tracing",
      "Annotations: indexed key-value pairs for filtering traces",
      "Metadata: non-indexed data for additional context",
    ],
    tags: ["x-ray", "tracing", "segments", "subsegments", "observability"],
  },
  {
    id: "fc-xray-002",
    service: "AWS X-Ray",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "What are X-Ray sampling rules?",
    answer:
      "Sampling controls what % of requests are traced (to reduce cost/noise). Default: first request per second + 5% of additional requests. Custom rules: define reservoir (fixed/s) + rate (%). Rules evaluated in priority order. Important requests can be sampled at 100% with a custom rule.",
    keyPoints: [
      "Default: 1 req/s + 5% of remainder",
      "Custom rules override default for matched conditions",
      "Reservoir = fixed number guaranteed per second",
      "Rate = % beyond reservoir",
    ],
    tags: ["x-ray", "sampling", "cost", "observability"],
  },

  // ElastiCache
  {
    id: "fc-cache-001",
    service: "Amazon ElastiCache",
    domain: "troubleshooting",
    difficulty: "hard",
    question: "Compare ElastiCache Redis vs. Memcached.",
    answer:
      "Redis: persistence (AOF/RDB), replication, cluster mode, Lua scripting, geospatial, streams, pub/sub, sorted sets. Memcached: multi-threaded, no persistence, no replication, simpler. Use Redis for complex data structures, persistence, or HA. Use Memcached for simple caching with horizontal scaling.",
    keyPoints: [
      "Redis: Multi-AZ with automatic failover (cluster mode disabled)",
      "Redis Cluster Mode: sharded across 1–90 shards",
      "Memcached: no persistence, no HA",
      "Redis supports read replicas; Memcached does not",
    ],
    tags: ["elasticache", "redis", "memcached", "caching", "performance"],
  },
  {
    id: "fc-cache-002",
    service: "Amazon ElastiCache",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "What are common caching strategies (lazy loading vs. write-through)?",
    answer:
      "Lazy Loading (Cache-Aside): check cache → if miss, read DB → write to cache. Cache may have stale data; cache only what is requested. Write-Through: write to DB AND cache simultaneously. Cache always fresh but wastes space for unread data. TTL helps with both strategies.",
    keyPoints: [
      "Lazy loading: cache miss penalty (2 extra calls); avoids stale data on write",
      "Write-through: always fresh cache; wasted entries for rarely read data",
      "TTL prevents stale data in lazy loading",
      "Combine both: write-through on create, TTL for expiry",
    ],
    tags: [
      "elasticache",
      "caching",
      "lazy-loading",
      "write-through",
      "pattern",
    ],
  },

  // VPC
  {
    id: "fc-vpc-001",
    service: "Amazon VPC",
    domain: "development",
    difficulty: "medium",
    question: "How does Lambda access resources inside a VPC?",
    answer:
      "Attach Lambda to a VPC by specifying subnets and security groups. Lambda creates Elastic Network Interfaces (ENIs) in your VPC. For internet access from VPC-attached Lambda, add a NAT Gateway (private subnet → NAT → IGW). Without NAT, VPC Lambda has no internet access.",
    keyPoints: [
      "Lambda in VPC uses ENIs from your subnets",
      "VPC Lambda has no internet by default",
      "NAT Gateway in public subnet enables internet for private Lambda",
      "VPC endpoints avoid NAT cost for AWS service access",
    ],
    tags: ["lambda", "vpc", "nat-gateway", "networking"],
  },

  // CloudFront
  {
    id: "fc-cf-001",
    service: "Amazon CloudFront",
    domain: "development",
    difficulty: "medium",
    question: "What is CloudFront and how does caching work?",
    answer:
      "CloudFront is a CDN distributing content from edge locations. Caches responses based on cache key (URL + optionally headers/cookies/query strings). Cache TTL controlled by Cache-Control/Expires headers or CloudFront policy. Invalidation purges cached objects (/path/*).",
    keyPoints: [
      "Cache hit serves content without hitting origin",
      "Cache key: URL + optionally headers/cookies/query strings",
      "TTL: 0 = never cache; high TTL = fewer origin hits",
      "Invalidation costs $0.005 per path (first 1000/month free)",
    ],
    tags: ["cloudfront", "cdn", "caching", "edge"],
  },
  {
    id: "fc-cf-002",
    service: "Amazon CloudFront",
    domain: "development",
    difficulty: "hard",
    question: "What are CloudFront Functions vs. Lambda@Edge?",
    answer:
      "CloudFront Functions: lightweight JS, runs at edge (200+ locations), sub-ms latency, viewer request/response only, max 2MB, 10ms CPU. Lambda@Edge: full Node.js/Python, runs at 13 regional edge caches, max 5s (viewer) or 30s (origin), can modify origin request/response too.",
    keyPoints: [
      "CloudFront Functions: cheaper, faster, viewer events only",
      "Lambda@Edge: heavier, all 4 event types (viewer req/resp, origin req/resp)",
      "Use CloudFront Functions for URL rewrites, header manipulation",
      "Use Lambda@Edge for auth, dynamic content, A/B testing",
    ],
    tags: ["cloudfront", "lambda-edge", "cloudfront-functions", "edge"],
  },

  // ECS / ECR
  {
    id: "fc-ecs-001",
    service: "Amazon ECS",
    domain: "deployment",
    difficulty: "medium",
    question: "What is the difference between ECS EC2 launch type and Fargate?",
    answer:
      "EC2 launch type: you manage the underlying EC2 instances (patching, scaling cluster capacity). Fargate: serverless containers — AWS manages infrastructure, you define CPU/memory per task. Fargate is simpler and no cluster management, but can be more expensive for sustained loads.",
    keyPoints: [
      "EC2: more control, cheaper at scale, must manage instances",
      "Fargate: no cluster management, pay per task vCPU/memory",
      "Both use task definitions and service definitions",
      "Fargate supports ephemeral storage up to 200 GB",
    ],
    tags: ["ecs", "fargate", "ec2", "containers"],
  },
  {
    id: "fc-ecs-002",
    service: "Amazon ECS",
    domain: "deployment",
    difficulty: "hard",
    question: "How does ECS handle secrets injection?",
    answer:
      "Task definitions reference secrets via secretsFrom (Secrets Manager) or valueFrom (SSM Parameter Store). ECS retrieves secrets at task launch and injects as environment variables. Task execution role needs secretsmanager:GetSecretValue or ssm:GetParameters permission.",
    keyPoints: [
      "secretsFrom: Secrets Manager ARN",
      "valueFrom: SSM Parameter Store ARN or name",
      "Task execution role (not task role) needs secrets permissions",
      "Secrets retrieved at container start — not dynamically refreshed",
    ],
    tags: ["ecs", "secrets", "secrets-manager", "ssm", "security"],
  },

  // Amplify
  {
    id: "fc-amplify-001",
    service: "AWS Amplify",
    domain: "deployment",
    difficulty: "easy",
    question: "What is AWS Amplify and what does it provide for developers?",
    answer:
      "Amplify is a full-stack platform for building web/mobile apps. Provides: hosting (CI/CD for frontend), backend (Auth via Cognito, API via AppSync/API Gateway, Storage via S3, Functions via Lambda), and Amplify Studio (visual builder). Configured via amplify.yml.",
    keyPoints: [
      "Amplify Hosting: git-based CI/CD, branch previews",
      "Amplify Libraries: JS/mobile SDKs for auth, API, storage",
      "amplify push provisions backend resources via CloudFormation",
      "Supports custom domains and HTTPS",
    ],
    tags: ["amplify", "hosting", "full-stack", "ci-cd"],
  },

  // RDS / Aurora
  {
    id: "fc-rds-001",
    service: "Amazon RDS",
    domain: "development",
    difficulty: "medium",
    question: "What is RDS Proxy and why would you use it with Lambda?",
    answer:
      "RDS Proxy is a managed database proxy that pools and reuses database connections. Lambda can create thousands of concurrent connections overwhelming RDS. RDS Proxy maintains a warm pool, reducing connection overhead. Also improves failover time for Multi-AZ.",
    keyPoints: [
      "Solves connection exhaustion from serverless/container bursting",
      "Reduces connection overhead (cold starts)",
      "Improves failover time from minutes to seconds",
      "Supports IAM authentication to database",
    ],
    tags: ["rds", "rds-proxy", "lambda", "connections", "performance"],
  },

  // Systems Manager
  {
    id: "fc-ssm-001",
    service: "AWS Systems Manager",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is AWS AppConfig and how does it differ from SSM Parameter Store?",
    answer:
      "AppConfig is designed for runtime application configuration with validation, gradual rollout, and rollback. Supports validators (JSON schema, Lambda), deployment strategies (linear, exponential), and monitoring alarms that trigger rollback. Parameter Store is simpler key-value storage without rollout capabilities.",
    keyPoints: [
      "AppConfig: validate config before deployment, gradual rollout",
      "If CloudWatch alarm fires during rollout, AppConfig auto-rolls back",
      "Use AppConfig for feature flags and runtime config changes",
      "AppConfig caches config locally — poll every few minutes",
    ],
    tags: ["appconfig", "ssm", "configuration", "feature-flags", "rollback"],
  },
];
