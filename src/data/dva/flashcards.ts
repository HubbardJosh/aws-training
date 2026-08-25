import { FlashCard } from "../../types";

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
      "Standard: no explicit throughput cap (nearly unlimited scale), at-least-once delivery, best-effort ordering. FIFO: exactly-once processing, ordered delivery (within a message group), 300 msg/s default (3,000 with batching); enable High Throughput FIFO mode for higher limits.",
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
      "AWS managed keys: auto-rotate every 1 year (365 days)",
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

  // --- NEW: Amazon SNS ---
  {
    id: "fc-sns-003",
    service: "Amazon SNS",
    domain: "development",
    difficulty: "medium",
    question:
      "What is an SNS subscription filter policy and where is it applied?",
    answer:
      "A filter policy is a JSON document attached to a subscription (not the topic) that specifies which MessageAttribute values must match for SNS to deliver the message to that subscriber. Subscribers with no filter policy receive all messages.",
    keyPoints: [
      "Filter policies are per-subscription, not per-topic",
      "Filtering is based on MessageAttributes, not the message body",
      "Supports string match, prefix, numeric range, exists, anything-but operators",
      "Reduces unnecessary deliveries and downstream processing cost",
    ],
    tags: ["sns", "filtering", "pub-sub", "message-attributes"],
  },
  {
    id: "fc-sns-004",
    service: "Amazon SNS",
    domain: "development",
    difficulty: "medium",
    question: "What SNS delivery protocols and endpoint types are supported?",
    answer:
      "SNS can deliver to: SQS, Lambda, HTTP/HTTPS endpoints, email, email-JSON, SMS, mobile push (APNS, GCM/FCM, ADM), and Kinesis Data Firehose. Each subscription has its own protocol and endpoint. Failed HTTP/HTTPS deliveries can be retried with a delivery policy.",
    keyPoints: [
      "SQS and Lambda are the most common programmatic targets",
      "SMS supports transactional and promotional message types",
      "Mobile push requires platform application and device token",
      "Delivery policies control retry behavior for HTTP endpoints",
    ],
    tags: ["sns", "subscriptions", "protocols", "mobile-push"],
  },
  {
    id: "fc-sns-005",
    service: "Amazon SNS",
    domain: "security",
    difficulty: "medium",
    question:
      "How do you secure an SNS topic with encryption and access control?",
    answer:
      "Enable SSE (server-side encryption) using a KMS key on the topic. Control access with topic resource policies (who can publish/subscribe). Combine with IAM policies on publishers. Use VPC endpoints to keep traffic off the public internet.",
    keyPoints: [
      "SSE encrypts messages at rest using KMS",
      "Topic resource policy grants cross-account publish rights",
      "Enforce HTTPS-only delivery in the topic policy",
      "VPC endpoint for SNS keeps traffic within AWS network",
    ],
    tags: ["sns", "encryption", "kms", "security", "access-control"],
  },
  {
    id: "fc-sns-006",
    service: "Amazon SNS",
    domain: "development",
    difficulty: "hard",
    question:
      "What is SNS message archiving and analytics with Kinesis Firehose?",
    answer:
      "SNS supports Kinesis Data Firehose as a subscription endpoint, enabling durable archiving of all SNS messages to S3, Redshift, or OpenSearch. This allows analytics without custom consumers. The Firehose subscription receives the raw SNS message payload.",
    keyPoints: [
      "SNS → Kinesis Firehose → S3/Redshift/OpenSearch for analytics",
      "Enables audit trail of all published messages",
      "No custom Lambda needed for archiving",
      "Message format includes SNS metadata wrapper around payload",
    ],
    tags: ["sns", "firehose", "kinesis", "analytics", "archiving"],
  },

  // --- NEW: Amazon Kinesis ---
  {
    id: "fc-kinesis-003",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "medium",
    question: "What is Kinesis Enhanced Fan-Out and when should you use it?",
    answer:
      "Enhanced Fan-Out provides a dedicated 2 MB/s throughput per consumer per shard using a push model (HTTP/2). Standard GetRecords shares 2 MB/s across all consumers on a shard. Use Enhanced Fan-Out when you have multiple consumers competing for shard throughput.",
    keyPoints: [
      "Standard: 2 MB/s shared across all consumers on a shard",
      "Enhanced Fan-Out: 2 MB/s per registered consumer per shard",
      "Push-based via HTTP/2 SubscribeToShard API",
      "Higher cost than standard GetRecords polling",
    ],
    tags: ["kinesis", "enhanced-fan-out", "consumers", "throughput"],
  },
  {
    id: "fc-kinesis-004",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "medium",
    question: "How does Kinesis Data Firehose transform data before delivery?",
    answer:
      "Firehose can invoke a Lambda function to transform records (format conversion, enrichment) before writing to the destination. It also supports built-in format conversions (JSON to Parquet/ORC) using Glue schemas. Failed records can be delivered to a separate S3 prefix.",
    keyPoints: [
      "Lambda transformation: invoke custom code per batch",
      "Built-in conversion: JSON → Parquet/ORC using Glue Data Catalog",
      "Buffer hints control batch size (1–128 MB) and interval (60–900s)",
      "S3 backup captures records before or after transformation",
    ],
    tags: ["kinesis", "firehose", "transformation", "lambda", "glue"],
  },
  {
    id: "fc-kinesis-005",
    service: "Amazon Kinesis",
    domain: "troubleshooting",
    difficulty: "hard",
    question:
      "How do you troubleshoot ProvisionedThroughputExceededException in Kinesis?",
    answer:
      "This error occurs when write or read rate exceeds shard limits. Solutions: increase shard count (resharding), use randomized partition keys to distribute load evenly, implement exponential backoff with jitter in the producer, or use Kinesis Producer Library (KPL) which handles aggregation and retries.",
    keyPoints: [
      "Write limit: 1 MB/s or 1000 records/s per shard",
      "Read limit: 2 MB/s per shard (shared across consumers)",
      "Hot shards from low-cardinality partition keys",
      "KPL aggregates small records and handles retries automatically",
    ],
    tags: ["kinesis", "throttling", "troubleshooting", "resharding", "kpl"],
  },
  {
    id: "fc-kinesis-006",
    service: "Amazon Kinesis",
    domain: "development",
    difficulty: "medium",
    question:
      "What is Kinesis Data Streams retention and how does it affect consumers?",
    answer:
      "Default retention is 24 hours; extended to 7 days (standard) or 365 days (long-term) for additional cost. Consumers can replay data from any point within the retention window using sequence numbers or timestamps. Expired records are permanently deleted.",
    keyPoints: [
      "Default: 24 hours; max: 365 days (extra cost)",
      "Replay from any offset within retention window",
      "Use shard iterator types: TRIM_HORIZON (oldest), LATEST, AT_TIMESTAMP",
      "Extended retention enables disaster recovery and late consumers",
    ],
    tags: ["kinesis", "retention", "replay", "shard-iterator"],
  },

  // --- NEW: AWS Step Functions ---
  {
    id: "fc-stepfn-003",
    service: "AWS Step Functions",
    domain: "development",
    difficulty: "hard",
    question: "How does Step Functions handle errors and retries?",
    answer:
      "Each state can define Retry and Catch blocks. Retry: specify ErrorEquals, IntervalSeconds, MaxAttempts, BackoffRate. Catch: catch specific errors and transition to a fallback state. If no Catch matches after retries exhaust, the execution fails. Error names: States.ALL, States.Timeout, States.TaskFailed, etc.",
    keyPoints: [
      "Retry: exponential backoff with BackoffRate multiplier",
      "Catch: fallback state for unrecoverable errors",
      "States.ALL catches any error (use as last resort)",
      "States.Timeout occurs when task exceeds TimeoutSeconds",
    ],
    tags: ["step-functions", "error-handling", "retry", "catch"],
  },
  {
    id: "fc-stepfn-004",
    service: "AWS Step Functions",
    domain: "development",
    difficulty: "medium",
    question: "What is the Step Functions Map state and how does it work?",
    answer:
      "The Map state runs the same set of steps for each item in an array. It iterates over a JSON array (from input or a static list) and runs a sub-workflow for each element in parallel (up to MaxConcurrency). Use MaxConcurrency=1 for sequential iteration.",
    keyPoints: [
      "Replaces looping patterns and recursive Lambda calls",
      "MaxConcurrency controls parallelism (0 = unlimited)",
      "Each iteration is an independent execution with its own input",
      "Results collected into output array",
    ],
    tags: ["step-functions", "map-state", "parallel", "iteration"],
  },
  {
    id: "fc-stepfn-005",
    service: "AWS Step Functions",
    domain: "development",
    difficulty: "medium",
    question:
      "What are Step Functions service integrations and what is the difference between request-response and .sync patterns?",
    answer:
      "Step Functions can call AWS services directly without Lambda. Request-Response: submit task and move to next state immediately (fire-and-forget). .sync: wait for job/task to complete (e.g., ECS task, Glue job, Batch job). .waitForTaskToken: pause until external system calls SendTaskSuccess/SendTaskFailure.",
    keyPoints: [
      "request-response: async fire-and-forget",
      ".sync: waits for AWS service job to complete",
      ".waitForTaskToken: pause for callback from any system",
      "Reduces need for polling Lambda between steps",
    ],
    tags: [
      "step-functions",
      "service-integrations",
      "sync",
      "wait-for-task-token",
    ],
  },
  {
    id: "fc-stepfn-006",
    service: "AWS Step Functions",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do you debug and monitor Step Functions executions?",
    answer:
      "View execution history in the Step Functions console showing each state transition with input/output. Enable logging to CloudWatch Logs for Express workflows (Standard logs to execution history by default). Use X-Ray tracing for end-to-end visibility across downstream calls.",
    keyPoints: [
      "Standard workflows: full execution history stored for 90 days",
      "Express workflows: must use CloudWatch Logs for visibility",
      "X-Ray traces across Lambda, DynamoDB, SQS calls within workflow",
      "Execution history shows exact input/output for each state",
    ],
    tags: ["step-functions", "monitoring", "cloudwatch", "x-ray", "debugging"],
  },

  // --- NEW: Amazon Cognito ---
  {
    id: "fc-cognito-003",
    service: "Amazon Cognito",
    domain: "security",
    difficulty: "hard",
    question:
      "What are Cognito User Pool Lambda triggers and when would you use them?",
    answer:
      "Lambda triggers hook into authentication flows: Pre Sign-up (validate/deny), Post Confirmation, Pre Authentication, Post Authentication, Pre Token Generation (customize tokens), Custom Authentication (passwordless flows), User Migration (migrate from legacy). Triggered synchronously; errors halt the flow.",
    keyPoints: [
      "Pre Token Generation: add/remove claims in ID/access tokens",
      "Custom Authentication: challenge-response for passwordless (OTP, CAPTCHA)",
      "User Migration: transparent migration from legacy user store",
      "Triggers run synchronously; Lambda timeout affects auth latency",
    ],
    tags: ["cognito", "lambda-triggers", "authentication", "customization"],
  },
  {
    id: "fc-cognito-004",
    service: "Amazon Cognito",
    domain: "security",
    difficulty: "medium",
    question: "How does Cognito Hosted UI and OAuth 2.0 flow work?",
    answer:
      "Cognito Hosted UI provides a pre-built sign-in/sign-up web page. Supports Authorization Code grant (recommended), Implicit grant, and Client Credentials grant. After sign-in, Cognito redirects to your callback URL with an authorization code, which your app exchanges for tokens via the /oauth2/token endpoint.",
    keyPoints: [
      "Authorization Code flow: more secure, code exchanged server-side",
      "PKCE: required for public clients (mobile/SPA) with auth code flow",
      "App client scopes control what the access token can access",
      "Callback URLs must be pre-registered in the app client settings",
    ],
    tags: ["cognito", "hosted-ui", "oauth2", "authorization-code", "pkce"],
  },
  {
    id: "fc-cognito-005",
    service: "Amazon Cognito",
    domain: "security",
    difficulty: "medium",
    question:
      "What is Cognito Identity Pool role mapping and how does it work?",
    answer:
      "Identity Pools map authenticated and unauthenticated users to IAM roles. You can define rules to assign different roles based on token claims (e.g., group membership). The STS AssumeRoleWithWebIdentity call is made on behalf of the user, returning temporary AWS credentials.",
    keyPoints: [
      "Default authenticated role and unauthenticated (guest) role",
      "Rule-based mapping: assign roles based on claim values",
      "Credentials scoped to role's IAM permissions",
      "Enhanced flow: Cognito calls STS automatically; basic flow: you call STS",
    ],
    tags: ["cognito", "identity-pool", "iam-roles", "sts", "role-mapping"],
  },
  {
    id: "fc-cognito-006",
    service: "Amazon Cognito",
    domain: "security",
    difficulty: "easy",
    question: "What MFA options does Cognito User Pool support?",
    answer:
      "Cognito supports TOTP (Time-based One-Time Password via authenticator apps) and SMS-based MFA. MFA can be set to off, optional (user-configured), or required (all users). Adaptive authentication can automatically require MFA based on risk signals.",
    keyPoints: [
      "TOTP: Google Authenticator, Authy; more secure than SMS",
      "SMS MFA requires an SNS-enabled phone number",
      "Adaptive authentication: risk-based MFA challenges",
      "MFA can be required, optional, or disabled per user pool",
    ],
    tags: ["cognito", "mfa", "totp", "sms", "security"],
  },

  // --- NEW: AWS KMS ---
  {
    id: "fc-kms-003",
    service: "AWS KMS",
    domain: "security",
    difficulty: "hard",
    question:
      "What is KMS key policy and how does it differ from IAM policy for KMS access?",
    answer:
      "Every KMS key has a key policy (resource-based). Unlike other AWS services, IAM policies alone cannot grant access to KMS keys — the key policy must explicitly allow the principal or allow IAM to control access. The default key policy grants the AWS account root full access, enabling IAM policies to delegate.",
    keyPoints: [
      "Key policy must allow access; IAM alone is not sufficient",
      "Default key policy: allows root → enables IAM delegation",
      "Key grants: temporary programmatic access without policy changes",
      "Cross-account: key policy must allow external account; IAM in target account delegates to principals",
    ],
    tags: ["kms", "key-policy", "iam", "access-control", "security"],
  },
  {
    id: "fc-kms-004",
    service: "AWS KMS",
    domain: "security",
    difficulty: "medium",
    question: "What is KMS key rotation and how does it work?",
    answer:
      "Automatic key rotation generates new cryptographic material annually (365 days) for customer managed keys. The key ID and ARN remain the same; KMS retains old material to decrypt previously encrypted data. Rotation does not re-encrypt existing ciphertext.",
    keyPoints: [
      "Rotation: new key material, same key ID/ARN",
      "Old key material retained to decrypt historical ciphertext",
      "AWS managed keys rotate automatically every 1 year (365 days)",
      "Manual rotation: create new key, update applications, disable old key",
    ],
    tags: ["kms", "key-rotation", "cmk", "security"],
  },
  {
    id: "fc-kms-005",
    service: "AWS KMS",
    domain: "security",
    difficulty: "hard",
    question:
      "What are KMS grants and when would you use them over key policies?",
    answer:
      "Grants are temporary permissions delegated programmatically to an AWS principal. Created with CreateGrant API; retired with RetireGrant or RevokeGrant. Used when you need to give temporary access without modifying the key policy (e.g., grant encrypt/decrypt to a service role for a specific job).",
    keyPoints: [
      "Grants allow specific operations without editing key policy",
      "Granular: can limit to single operations (Decrypt, GenerateDataKey)",
      "Grants can be retired by the grantee or revoked by the key owner",
      "AWS services use grants internally (e.g., EBS, S3 SSE-KMS)",
    ],
    tags: ["kms", "grants", "access-control", "security"],
  },
  {
    id: "fc-kms-006",
    service: "AWS KMS",
    domain: "security",
    difficulty: "medium",
    question: "How is KMS used with S3 Server-Side Encryption?",
    answer:
      "S3 supports SSE-S3 (S3-managed keys), SSE-KMS (KMS-managed CMK), and SSE-C (customer-provided keys). With SSE-KMS, each object is encrypted with a unique DEK generated by KMS. Requires kms:GenerateDataKey and kms:Decrypt permissions. Bucket key reduces KMS API calls and cost.",
    keyPoints: [
      "SSE-KMS: one KMS API call per object by default",
      "S3 Bucket Key: generates DEKs locally, reducing KMS calls by ~99%",
      "Must have kms:GenerateDataKey to upload, kms:Decrypt to download",
      "CloudTrail logs every KMS call for audit",
    ],
    tags: ["kms", "s3", "sse-kms", "encryption", "bucket-key"],
  },

  // --- NEW: AWS CodeDeploy ---
  {
    id: "fc-codedeploy-003",
    service: "AWS CodeDeploy",
    domain: "deployment",
    difficulty: "medium",
    question: "What are CodeDeploy lifecycle event hooks for EC2 deployments?",
    answer:
      "EC2 lifecycle hooks in order: ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService. Scripts specified in appspec.yml run at each hook. A script failure at any hook stops the deployment and may trigger rollback.",
    keyPoints: [
      "ApplicationStop runs on current running version",
      "DownloadBundle: CodeDeploy agent downloads revision from S3/GitHub",
      "ValidateService: best place to run smoke tests",
      "Hooks run as root by default; timeout default 1800s per hook",
    ],
    tags: ["codedeploy", "lifecycle-hooks", "ec2", "appspec"],
  },
  {
    id: "fc-codedeploy-004",
    service: "AWS CodeDeploy",
    domain: "deployment",
    difficulty: "hard",
    question: "How does CodeDeploy blue/green deployment work for ECS?",
    answer:
      "CodeDeploy creates a new task set (green) in the ECS service alongside the current task set (blue). Traffic shifts from blue to green using the ALB target groups. Shift strategies: AllAtOnce, Canary, or Linear. After validation period, original task set (blue) is terminated.",
    keyPoints: [
      "Requires Application Load Balancer with two target groups",
      "CodeDeploy updates ALB listener rules to shift traffic",
      "Rollback: shift traffic back to original target group",
      "ValidateService hook Lambda can run automated tests before full shift",
    ],
    tags: ["codedeploy", "ecs", "blue-green", "alb", "traffic-shifting"],
  },
  {
    id: "fc-codedeploy-005",
    service: "AWS CodeDeploy",
    domain: "deployment",
    difficulty: "medium",
    question: "How does CodeDeploy automatic rollback work?",
    answer:
      "CodeDeploy can automatically rollback on deployment failure or when a CloudWatch alarm breaches during deployment. Rollback re-deploys the last known good revision. You can also manually trigger rollback via console or CLI.",
    keyPoints: [
      "Automatic rollback on: deployment failure, alarm breach",
      "CloudWatch alarms monitor metrics during deployment window",
      "Rollback is itself a new deployment of the previous revision",
      "Cannot rollback a rollback (must manually deploy desired version)",
    ],
    tags: ["codedeploy", "rollback", "cloudwatch", "deployment"],
  },
  {
    id: "fc-codedeploy-006",
    service: "AWS CodeDeploy",
    domain: "deployment",
    difficulty: "easy",
    question: "What is a CodeDeploy deployment group?",
    answer:
      "A deployment group defines the target set of instances or resources (EC2 instances by tags or ASG, ECS service, Lambda function). It also specifies the deployment configuration (strategy), service role, load balancer, and rollback settings.",
    keyPoints: [
      "Target EC2 by tags or Auto Scaling Group name",
      "One application can have multiple deployment groups (dev/prod)",
      "Deployment configuration: predefined (OneAtATime, HalfAtATime, AllAtOnce) or custom",
      "Service role needs CodeDeploy permissions to interact with AWS resources",
    ],
    tags: ["codedeploy", "deployment-group", "ec2", "ecs"],
  },

  // --- NEW: AWS CloudFormation ---
  {
    id: "fc-cfn-003",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What are CloudFormation intrinsic functions and when are they used?",
    answer:
      "Intrinsic functions provide dynamic values in templates. Common ones: !Ref (reference resource or parameter), !GetAtt (get resource attribute), !Sub (string substitution with variables), !Join (join strings), !Select (pick from list), !If (conditional value), !ImportValue (cross-stack export).",
    keyPoints: [
      "!Ref on a resource returns its physical ID; on a parameter returns the value",
      "!GetAtt retrieves specific attributes (e.g., !GetAtt MyBucket.Arn)",
      "!Sub supports ${Variable} syntax with optional mapping",
      "!ImportValue references Outputs exported from another stack",
    ],
    tags: ["cloudformation", "intrinsic-functions", "ref", "getatt", "sub"],
  },
  {
    id: "fc-cfn-004",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "hard",
    question:
      "What are CloudFormation custom resources and when do you use them?",
    answer:
      "Custom resources let you run arbitrary logic (via Lambda or SNS) during stack create/update/delete. CloudFormation sends a request to a Lambda function with event type (Create/Update/Delete), and Lambda must signal success or failure back to CloudFormation via a pre-signed S3 URL.",
    keyPoints: [
      "Use for unsupported AWS resources or third-party API calls",
      "Lambda receives Create/Update/Delete events",
      "Must send response to ResponseURL (pre-signed S3 URL) within 1 hour",
      "Failure to respond causes stack to hang and eventually roll back",
    ],
    tags: ["cloudformation", "custom-resources", "lambda", "automation"],
  },
  {
    id: "fc-cfn-005",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    question: "How do CloudFormation StackSets work?",
    answer:
      "StackSets deploy CloudFormation stacks across multiple accounts and regions from a single management account. You define the template once; StackSets handles deployment to target accounts. Requires delegated admin or org-level trust. Supports automatic deployment to new accounts in an OU.",
    keyPoints: [
      "Deploy to multiple accounts/regions simultaneously",
      "Requires StackSet administrator and target account roles",
      "SERVICE_MANAGED: integrated with AWS Organizations",
      "SELF_MANAGED: manually create IAM roles in each target account",
    ],
    tags: ["cloudformation", "stacksets", "multi-account", "organizations"],
  },
  {
    id: "fc-cfn-006",
    service: "AWS CloudFormation",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What are CloudFormation parameters and how do you use SSM parameter types?",
    answer:
      "Parameters let templates accept dynamic inputs at deploy time. AWS-specific parameter types (e.g., AWS::SSM::Parameter::Value<String>) fetch values from SSM Parameter Store at deploy time, allowing AMI IDs and configs to be centrally managed without template changes.",
    keyPoints: [
      "Parameter types: String, Number, List, CommaDelimitedList, AWS-specific",
      "SSM parameter type resolves value at deployment time from Parameter Store",
      "Pseudo-parameters: AWS::AccountId, AWS::Region, AWS::StackName",
      "Allowed values and constraints prevent invalid inputs",
    ],
    tags: ["cloudformation", "parameters", "ssm", "dynamic-references"],
  },

  // --- NEW: AWS X-Ray ---
  {
    id: "fc-xray-003",
    service: "AWS X-Ray",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do you enable X-Ray tracing for API Gateway and Lambda?",
    answer:
      "API Gateway: enable Active Tracing in the Stage settings. Lambda: enable Active Tracing in function configuration (or via SAM/CDK tracing property). Both automatically instrument requests and propagate trace headers (X-Amzn-Trace-Id) to downstream services.",
    keyPoints: [
      "API Gateway creates a segment for each request",
      "Lambda creates a segment per invocation (daemon built-in)",
      "Trace header propagated to downstream Lambda, HTTP calls",
      "IAM role needs xray:PutTraceSegments and xray:PutTelemetryRecords",
    ],
    tags: ["x-ray", "api-gateway", "lambda", "tracing", "configuration"],
  },
  {
    id: "fc-xray-004",
    service: "AWS X-Ray",
    domain: "troubleshooting",
    difficulty: "hard",
    question:
      "What is the X-Ray Service Map and what can you diagnose with it?",
    answer:
      "The Service Map visualizes all services and connections in a distributed application with response time and error rate data. Each node represents a service; edges show call relationships. Use it to identify latency bottlenecks, error hotspots, and dependencies causing cascading failures.",
    keyPoints: [
      "Nodes: color-coded by error rate (green=OK, yellow=error, red=fault)",
      "Edge labels: avg latency and request rate between services",
      "Drill down from map to specific trace IDs for individual requests",
      "Throttle errors show as separate color (cyan/blue)",
    ],
    tags: ["x-ray", "service-map", "troubleshooting", "latency", "errors"],
  },
  {
    id: "fc-xray-005",
    service: "AWS X-Ray",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "What are X-Ray annotations vs. metadata and how do they differ?",
    answer:
      "Annotations: indexed key-value pairs added to segments/subsegments; can be used in filter expressions to find specific traces. Metadata: non-indexed objects/arrays; visible in trace details but not searchable. Use annotations for filtering, metadata for rich context.",
    keyPoints: [
      "Annotations: string/number/boolean, indexed, searchable via filter",
      "Metadata: any object, not indexed, not filterable",
      "Filter traces by annotation: annotation.userId = '123'",
      "Add via X-Ray SDK putAnnotation / putMetadata methods",
    ],
    tags: ["x-ray", "annotations", "metadata", "filtering", "sdk"],
  },
  {
    id: "fc-xray-006",
    service: "AWS X-Ray",
    domain: "troubleshooting",
    difficulty: "hard",
    question: "How does X-Ray tracing work in a containerized ECS environment?",
    answer:
      "Run the X-Ray daemon as a sidecar container in the ECS task definition. Application containers send UDP data to the daemon on port 2000. Use the task role to grant X-Ray permissions. The daemon batches and forwards data to the X-Ray API.",
    keyPoints: [
      "X-Ray daemon runs as sidecar container in same task",
      "Application sends UDP to 127.0.0.1:2000 (localhost in same task)",
      "Task IAM role needs xray:PutTraceSegments permission",
      "Fargate and EC2 launch types both support this pattern",
    ],
    tags: ["x-ray", "ecs", "fargate", "sidecar", "daemon"],
  },

  // --- NEW: Amazon ElastiCache ---
  {
    id: "fc-cache-003",
    service: "Amazon ElastiCache",
    domain: "development",
    difficulty: "hard",
    question:
      "How does ElastiCache Redis Cluster Mode affect data distribution?",
    answer:
      "In Cluster Mode Enabled, data is sharded across 1–90 node groups using hash slots (0–16383). Each key maps to a slot; each node group owns a range. Horizontal scaling by adding/removing shards. All operations on multiple keys must use hash tags to ensure keys land in the same slot.",
    keyPoints: [
      "16384 hash slots distributed across shards",
      "Hash tags: {user}.session and {user}.cart land on same shard",
      "Cluster Mode Disabled: one shard, read replicas for scale-out reads",
      "Online resharding: add/remove shards without downtime",
    ],
    tags: ["elasticache", "redis", "cluster-mode", "sharding", "hash-slots"],
  },
  {
    id: "fc-cache-004",
    service: "Amazon ElastiCache",
    domain: "security",
    difficulty: "medium",
    question: "How do you secure ElastiCache Redis?",
    answer:
      "Enable in-transit encryption (TLS) and at-rest encryption. Use Redis AUTH token (password) or, for Redis 6+, RBAC (Role-Based Access Control) with user groups. Deploy in a private VPC subnet; use security groups to restrict access. Disable AUTH is not recommended for production.",
    keyPoints: [
      "TLS in-transit: supported for both Redis and Memcached",
      "At-rest encryption: enabled at cluster creation",
      "Redis AUTH: single password for all connections",
      "RBAC (Redis 6+): multiple users with different permissions",
    ],
    tags: ["elasticache", "redis", "security", "tls", "auth", "rbac"],
  },
  {
    id: "fc-cache-005",
    service: "Amazon ElastiCache",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "What causes cache eviction in ElastiCache and how do you prevent it?",
    answer:
      "Eviction occurs when the cache is full and new items must be added. Redis eviction policies: noeviction (error), allkeys-lru, volatile-lru, allkeys-lfu, volatile-ttl, allkeys-random. Monitor Evictions metric in CloudWatch. Prevent by increasing node size, adding replicas, or tuning TTLs.",
    keyPoints: [
      "Eviction policy set at cluster/parameter-group level",
      "allkeys-lru: evict least recently used keys (most common for caching)",
      "volatile-lru: only evict keys with TTL set",
      "Monitor Evictions and CacheHits/Misses CloudWatch metrics",
    ],
    tags: [
      "elasticache",
      "eviction",
      "troubleshooting",
      "memory",
      "cloudwatch",
    ],
  },
  {
    id: "fc-cache-006",
    service: "Amazon ElastiCache",
    domain: "development",
    difficulty: "medium",
    question: "What is ElastiCache for Redis Global Datastore?",
    answer:
      "Global Datastore provides active-passive cross-region replication for ElastiCache Redis. One primary region handles reads/writes; up to two secondary regions receive replicated data with sub-second latency. Supports failover: promote a secondary to primary.",
    keyPoints: [
      "Replication lag: typically < 1 second cross-region",
      "Secondary clusters are read-only",
      "Use for disaster recovery and low-latency global reads",
      "Promote secondary to primary for region failover",
    ],
    tags: [
      "elasticache",
      "redis",
      "global-datastore",
      "cross-region",
      "disaster-recovery",
    ],
  },

  // --- NEW: Amazon CloudFront ---
  {
    id: "fc-cf-003",
    service: "Amazon CloudFront",
    domain: "security",
    difficulty: "hard",
    question: "How do you restrict CloudFront access to an S3 origin?",
    answer:
      "Use Origin Access Control (OAC, recommended) or Origin Access Identity (OAI, legacy). OAC signs requests to S3 using SigV4. S3 bucket policy allows access only from the CloudFront distribution's OAC. This prevents users from bypassing CloudFront to access S3 directly.",
    keyPoints: [
      "OAC replaces legacy OAI; supports SSE-KMS and all HTTP methods",
      "S3 bucket policy: Allow Principal service:cloudfront.amazonaws.com with OAC condition",
      "Block S3 public access to enforce CloudFront-only access",
      "OAI: uses special IAM principal (CloudFront identity)",
    ],
    tags: ["cloudfront", "s3", "oac", "oai", "security", "origin-access"],
  },
  {
    id: "fc-cf-004",
    service: "Amazon CloudFront",
    domain: "security",
    difficulty: "medium",
    question: "What are CloudFront signed URLs vs. signed cookies?",
    answer:
      "Both restrict access to content to authorized users. Signed URL: per-object access, includes expiry and IP restriction in query params. Signed Cookie: grants access to multiple files with a single cookie set (good for HLS video streams). Use signed URLs for individual files, signed cookies for groups of files.",
    keyPoints: [
      "Both use CloudFront key pairs (not S3 pre-signed URLs)",
      "Signed URL: good for downloadable files, single resource",
      "Signed Cookie: good for video streaming, multiple resources",
      "Trusted key groups (recommended) or trusted signers for key management",
    ],
    tags: [
      "cloudfront",
      "signed-url",
      "signed-cookie",
      "security",
      "access-control",
    ],
  },
  {
    id: "fc-cf-005",
    service: "Amazon CloudFront",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "What CloudFront error codes indicate cache vs. origin problems?",
    answer:
      "CloudFront-generated errors: 502 (bad gateway — origin unreachable), 503 (service unavailable — origin overloaded), 504 (gateway timeout — origin too slow). 4xx from origin are forwarded. CloudFront caches 5xx responses for short period. Use custom error pages for user-friendly responses.",
    keyPoints: [
      "502/503/504: CloudFront cannot reach or get response from origin",
      "Origin errors are cached briefly (ErrorCachingMinTTL)",
      "Custom error pages: map HTTP codes to S3 objects",
      "Enable CloudFront access logs and origin-level logs to diagnose",
    ],
    tags: ["cloudfront", "troubleshooting", "error-codes", "origin", "caching"],
  },
  {
    id: "fc-cf-006",
    service: "Amazon CloudFront",
    domain: "development",
    difficulty: "medium",
    question: "How does CloudFront cache behavior and cache policy work?",
    answer:
      "Cache behaviors define rules per URL path pattern (e.g., /api/* vs /static/*). Cache policies control what goes into the cache key (headers, cookies, query strings) and TTLs. Origin request policies control what is forwarded to origin (separate from cache key). Use managed policies or create custom.",
    keyPoints: [
      "Default behavior: catch-all (*) path pattern",
      "More specific path patterns take precedence over wildcard",
      "CachingOptimized policy: no headers/cookies, ideal for static assets",
      "Origin request policies can forward headers not in cache key",
    ],
    tags: [
      "cloudfront",
      "cache-behavior",
      "cache-policy",
      "ttl",
      "path-patterns",
    ],
  },

  // --- NEW: Amazon ECS ---
  {
    id: "fc-ecs-003",
    service: "Amazon ECS",
    domain: "deployment",
    difficulty: "medium",
    question: "What is an ECS task definition and what does it contain?",
    answer:
      "A task definition is a blueprint for your application. It specifies: Docker image, CPU/memory, port mappings, environment variables, secrets, IAM roles (task role and execution role), logging configuration, and volume mounts. Task definitions are versioned; services reference a specific revision.",
    keyPoints: [
      "Task role: permissions the application code uses",
      "Task execution role: permissions ECS uses (pull image, write logs, get secrets)",
      "CPU/memory set at task and optionally container level",
      "awslogs log driver sends container logs to CloudWatch Logs",
    ],
    tags: ["ecs", "task-definition", "iam", "logging", "containers"],
  },
  {
    id: "fc-ecs-004",
    service: "Amazon ECS",
    domain: "deployment",
    difficulty: "hard",
    question: "How does ECS service auto scaling work?",
    answer:
      "ECS integrates with Application Auto Scaling to scale the desired task count. Scaling policies: Target Tracking (maintain metric at target value) or Step Scaling (scale by fixed amount based on alarm). Metrics: CPUUtilization, MemoryUtilization, ALBRequestCountPerTarget, or custom CloudWatch metrics.",
    keyPoints: [
      "Application Auto Scaling manages ECS desired count",
      "Target Tracking: simplest; scales in/out to maintain target metric",
      "Step Scaling: explicit scale up/down based on alarm thresholds",
      "Combine with cluster auto scaling (for EC2) or Fargate (automatic)",
    ],
    tags: [
      "ecs",
      "auto-scaling",
      "target-tracking",
      "step-scaling",
      "cloudwatch",
    ],
  },
  {
    id: "fc-ecs-005",
    service: "Amazon ECS",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do you troubleshoot ECS tasks that fail to start?",
    answer:
      "Check stopped task details in ECS console for stop reason. Common causes: image pull failure (ECR permissions, image not found), insufficient resources (CPU/memory on cluster), port already in use, IAM role missing permissions, health check failures causing task restart loops.",
    keyPoints: [
      "Stop reason and stopped reason in ECS console are key",
      "Image pull errors: task execution role needs ecr:GetAuthorizationToken",
      "OOMKilled: container exceeded memory limit — increase allocation",
      "Health check grace period prevents premature task replacement",
    ],
    tags: ["ecs", "troubleshooting", "task-failure", "ecr", "health-check"],
  },
  {
    id: "fc-ecs-006",
    service: "Amazon ECS",
    domain: "deployment",
    difficulty: "medium",
    question: "What is ECS service discovery and how does it work?",
    answer:
      "ECS integrates with AWS Cloud Map for service discovery. Each ECS service registers tasks as service instances in Cloud Map with DNS records. Other services resolve the DNS name to get task IPs. Supports both DNS-based and API-based discovery. Route 53 auto-creates records for ECS tasks.",
    keyPoints: [
      "Cloud Map creates DNS records (A/SRV) per ECS task",
      "Tasks registered/deregistered automatically as they start/stop",
      "Works with both ECS EC2 and Fargate",
      "Private DNS namespace for VPC-internal service mesh",
    ],
    tags: ["ecs", "service-discovery", "cloud-map", "dns", "networking"],
  },

  // --- NEW: Amazon EventBridge ---
  {
    id: "fc-eventbridge-002",
    service: "Amazon EventBridge",
    domain: "development",
    difficulty: "medium",
    question: "How does EventBridge event pattern matching work?",
    answer:
      "Event patterns are JSON documents that match against event fields. Supports exact match, prefix match, numeric range, exists/not-exists, anything-but, and IP address matching. Patterns are evaluated against the raw event JSON; only matching events trigger the rule targets.",
    keyPoints: [
      "Pattern fields must match event fields at the same JSON path",
      "Multiple values for a field = OR match",
      "Multiple fields in pattern = AND match",
      "prefix: match matches string prefix; numeric: supports range operators",
    ],
    tags: ["eventbridge", "event-patterns", "filtering", "rules"],
  },
  {
    id: "fc-eventbridge-003",
    service: "Amazon EventBridge",
    domain: "development",
    difficulty: "hard",
    question:
      "What is EventBridge Schema Registry and how does it help developers?",
    answer:
      "The Schema Registry automatically discovers and stores schemas for events on an event bus. Schemas describe event structure (JSON Schema). Developers can download code bindings (Java, Python, TypeScript) that deserialize events into typed objects, reducing boilerplate and catching errors at compile time.",
    keyPoints: [
      "Auto-discovery: schemas inferred from events flowing through bus",
      "Code bindings downloadable from console or CLI",
      "Schema versioning tracks event structure changes",
      "Works with custom events and AWS service events",
    ],
    tags: ["eventbridge", "schema-registry", "code-bindings", "development"],
  },
  {
    id: "fc-eventbridge-004",
    service: "Amazon EventBridge",
    domain: "development",
    difficulty: "medium",
    question: "What is EventBridge Pipes and how does it differ from rules?",
    answer:
      "EventBridge Pipes connects event sources (SQS, Kinesis, DynamoDB Streams, Kafka) to targets with optional filtering and enrichment (Lambda, Step Functions, API Gateway). Rules route events from a bus to targets. Pipes are point-to-point with enrichment; rules are fan-out from a bus.",
    keyPoints: [
      "Pipes: source → filter → enrich → target (point-to-point)",
      "Rules: event bus → multiple targets (fan-out)",
      "Pipes support polling sources like SQS and Kinesis",
      "Enrichment step transforms events before delivery to target",
    ],
    tags: ["eventbridge", "pipes", "rules", "enrichment", "event-driven"],
  },
  {
    id: "fc-eventbridge-005",
    service: "Amazon EventBridge",
    domain: "development",
    difficulty: "medium",
    question: "How does EventBridge Scheduler work?",
    answer:
      "EventBridge Scheduler creates scheduled tasks that invoke AWS service APIs or Lambda at fixed rates or cron expressions. Unlike CloudWatch Events cron rules, Scheduler supports time zones, flexible time windows, and a large volume of one-time or recurring schedules.",
    keyPoints: [
      "Cron and rate expressions for recurring schedules",
      "One-time schedules for future single executions",
      "Flexible time windows reduce API burst pressure",
      "Supports 200+ AWS service API targets directly",
    ],
    tags: ["eventbridge", "scheduler", "cron", "scheduled-tasks"],
  },
  {
    id: "fc-eventbridge-006",
    service: "Amazon EventBridge",
    domain: "development",
    difficulty: "hard",
    question: "How does cross-account event routing work in EventBridge?",
    answer:
      "You can send events from one account's event bus to another account's event bus using resource-based policies. The receiving bus must have a policy allowing the source account to PutEvents. Use this for centralized event processing, audit logging, or multi-account architectures.",
    keyPoints: [
      "Target: event bus ARN in another account",
      "Receiving bus needs resource policy: allow source account's events",
      "Rules in receiving account then route to local targets",
      "Organizations integration allows org-wide event routing",
    ],
    tags: ["eventbridge", "cross-account", "event-bus", "organizations"],
  },

  // --- NEW: AWS AppSync ---
  {
    id: "fc-appsync-002",
    service: "AWS AppSync",
    domain: "security",
    difficulty: "medium",
    question: "What authentication modes does AWS AppSync support?",
    answer:
      "AppSync supports four auth modes: API key (simple, dev/test), Amazon Cognito User Pools (JWT), AWS IAM (SigV4, service-to-service), and OIDC (third-party identity provider). Multiple auth modes can be configured; the default mode applies when no explicit mode is specified.",
    keyPoints: [
      "API key: simplest, rotate every 365 days max",
      "Cognito: recommended for end-user auth, uses ID token",
      "IAM: for AWS services and Lambda calling AppSync",
      "Multiple auth modes: use @auth directive per type/field",
    ],
    tags: ["appsync", "authentication", "cognito", "iam", "api-key"],
  },
  {
    id: "fc-appsync-003",
    service: "AWS AppSync",
    domain: "development",
    difficulty: "hard",
    question: "How do AppSync resolvers and pipeline resolvers work?",
    answer:
      "A resolver connects a GraphQL field to a data source. Unit resolver: one data source. Pipeline resolver: chains multiple functions (each hitting a data source) in sequence; output of one is input to next. Resolvers use VTL mapping templates or JavaScript (JS resolvers) for request/response transformation.",
    keyPoints: [
      "Pipeline resolvers: sequence of AppSync functions",
      "Each function has its own data source and mapping templates",
      "Before and after mapping templates wrap the pipeline",
      "JS resolvers (APPSYNC_JS runtime) replace VTL for simpler syntax",
    ],
    tags: ["appsync", "resolvers", "pipeline", "vtl", "graphql"],
  },
  {
    id: "fc-appsync-004",
    service: "AWS AppSync",
    domain: "development",
    difficulty: "medium",
    question: "How do AppSync real-time subscriptions work?",
    answer:
      "Subscriptions use WebSocket connections (MQTT over WebSocket). Clients subscribe to a GraphQL subscription field. When a mutation matching the subscription triggers, AppSync pushes the update to all connected subscribers. Subscription connections are managed by AppSync; you define the data shape.",
    keyPoints: [
      "WebSocket connection maintained by AppSync",
      "Subscriptions triggered by mutations",
      "Filter subscriptions using Enhanced Subscriptions filtering",
      "Connection limits: 1000 concurrent connections per API by default",
    ],
    tags: ["appsync", "subscriptions", "websocket", "real-time", "graphql"],
  },
  {
    id: "fc-appsync-005",
    service: "AWS AppSync",
    domain: "development",
    difficulty: "medium",
    question: "What data sources does AppSync support?",
    answer:
      "AppSync data sources: Amazon DynamoDB, AWS Lambda, Amazon OpenSearch, Amazon RDS (via RDS Data API), HTTP endpoints, and None (for local resolvers returning static data). Lambda is the most flexible — it can call any backend. None data source is useful for purely client-side mutations.",
    keyPoints: [
      "DynamoDB: direct integration, no Lambda needed",
      "Lambda: most flexible, handle any backend logic",
      "HTTP: call REST APIs from resolvers",
      "None: for subscriptions or local transformations without backend",
    ],
    tags: ["appsync", "data-sources", "dynamodb", "lambda", "graphql"],
  },
  {
    id: "fc-appsync-006",
    service: "AWS AppSync",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do you monitor and debug AppSync APIs?",
    answer:
      "Enable CloudWatch logging in AppSync settings (field-level logs for full request/response detail, error-only for just failures). Use CloudWatch Metrics (4xx, 5xx, latency). Enable X-Ray tracing for end-to-end visibility into resolver performance and downstream calls.",
    keyPoints: [
      "Field-level logging: captures request/response for each resolver",
      "Logging levels: NONE, ERROR, ALL",
      "Metrics: 4xxError, 5xxError, Latency available in CloudWatch",
      "X-Ray traces show resolver execution time and data source calls",
    ],
    tags: ["appsync", "monitoring", "cloudwatch", "x-ray", "debugging"],
  },

  // --- NEW: AWS Secrets Manager ---
  {
    id: "fc-secrets-002",
    service: "AWS Secrets Manager",
    domain: "security",
    difficulty: "hard",
    question: "How does Secrets Manager automatic rotation work?",
    answer:
      "Rotation uses a Lambda function that implements four steps: createSecret (new version), setSecret (set on target), testSecret (validate new credentials), finishSecret (mark new version as AWSCURRENT). Rotation can be immediate or on a schedule. During rotation, both old and new credentials briefly coexist.",
    keyPoints: [
      "Four Lambda lifecycle steps: create → set → test → finish",
      "AWSCURRENT: active version; AWSPENDING: new version during rotation",
      "AWSPREVIOUS: old version kept briefly for in-flight connections",
      "AWS provides rotation Lambda templates for common databases (RDS, Redshift)",
    ],
    tags: ["secrets-manager", "rotation", "lambda", "security"],
  },
  {
    id: "fc-secrets-003",
    service: "AWS Secrets Manager",
    domain: "security",
    difficulty: "medium",
    question: "How do applications retrieve secrets from Secrets Manager?",
    answer:
      "Call GetSecretValue API with the secret name or ARN. SDK caches the secret locally by default to reduce API calls. Use the AWS SDK caching client or implement your own caching with TTL. Avoid calling GetSecretValue on every request — it has API rate limits and incurs cost.",
    keyPoints: [
      "GetSecretValue: returns SecretString or SecretBinary",
      "SDK caching client: refreshes based on TTL, reduces API calls",
      "Rate limit: default 100 TPS per region (can be raised)",
      "IAM permission: secretsmanager:GetSecretValue on the secret ARN",
    ],
    tags: ["secrets-manager", "api", "caching", "sdk", "development"],
  },
  {
    id: "fc-secrets-004",
    service: "AWS Secrets Manager",
    domain: "security",
    difficulty: "medium",
    question: "How does cross-account secret sharing work in Secrets Manager?",
    answer:
      "Attach a resource policy to the secret granting access to principals in other accounts. The external account's principals also need IAM permission to call GetSecretValue. The KMS key used to encrypt the secret must also allow the external account to use it.",
    keyPoints: [
      "Resource policy on secret grants cross-account access",
      "Target account IAM policy must also allow secretsmanager:GetSecretValue",
      "KMS key policy must allow target account's kms:Decrypt",
      "Use secret ARN (not name) for cross-account access",
    ],
    tags: ["secrets-manager", "cross-account", "resource-policy", "kms"],
  },
  {
    id: "fc-secrets-005",
    service: "AWS Secrets Manager",
    domain: "security",
    difficulty: "easy",
    question: "What are Secrets Manager secret versions and staging labels?",
    answer:
      "Secrets Manager stores multiple versions of a secret simultaneously. Each version has one or more staging labels: AWSCURRENT (active), AWSPENDING (during rotation), AWSPREVIOUS (previous active). You can retrieve a specific version by staging label or version ID.",
    keyPoints: [
      "AWSCURRENT: version your application should use",
      "AWSPENDING: new version being tested during rotation",
      "AWSPREVIOUS: previous version kept for rollback",
      "GetSecretValue defaults to AWSCURRENT if no version specified",
    ],
    tags: ["secrets-manager", "versioning", "staging-labels", "rotation"],
  },
  {
    id: "fc-secrets-006",
    service: "AWS Secrets Manager",
    domain: "security",
    difficulty: "medium",
    question: "How do you use Secrets Manager with ECS and Lambda?",
    answer:
      "ECS: reference secrets in task definition using secrets field with Secrets Manager ARN; secrets injected as env vars at task launch. Lambda: call GetSecretValue in handler init code (outside handler function) and cache the value. Use SDK caching client for automatic refresh.",
    keyPoints: [
      "ECS: task execution role needs secretsmanager:GetSecretValue",
      "ECS injects secrets at task start — not dynamically refreshed",
      "Lambda: retrieve in init code (outside handler) for reuse across invocations",
      "SDK caching client handles refresh when secret rotates",
    ],
    tags: ["secrets-manager", "ecs", "lambda", "integration", "security"],
  },

  // --- NEW: AWS CodePipeline ---
  {
    id: "fc-codepipeline-002",
    service: "AWS CodePipeline",
    domain: "deployment",
    difficulty: "medium",
    question: "How does CodePipeline integrate with manual approval actions?",
    answer:
      "Add an Approval action to any stage. CodePipeline pauses and sends an SNS notification with a review link. Approver visits the link, reviews changes, and approves or rejects. On rejection, pipeline stops; on approval, it continues. Approval has a configurable timeout (default 7 days).",
    keyPoints: [
      "Approval action pauses pipeline at that stage",
      "SNS topic configured for notifications to reviewers",
      "Approval URL sent in notification with pipeline details",
      "Timeout: pipeline fails if no action taken within configured period",
    ],
    tags: ["codepipeline", "manual-approval", "ci-cd", "sns"],
  },
  {
    id: "fc-codepipeline-003",
    service: "AWS CodePipeline",
    domain: "deployment",
    difficulty: "hard",
    question: "How do you share artifacts between CodePipeline stages?",
    answer:
      "CodePipeline stores artifacts in a designated S3 bucket (artifact store). Output artifacts from one action are available as input artifacts to subsequent actions. Each artifact is a ZIP file. Actions define their InputArtifacts (what they consume) and OutputArtifacts (what they produce).",
    keyPoints: [
      "Artifact store: S3 bucket (encrypted with KMS)",
      "Artifacts are ZIP files uploaded between stages",
      "Action OutputArtifacts become available InputArtifacts to downstream actions",
      "Cross-region pipelines use artifact stores per region",
    ],
    tags: ["codepipeline", "artifacts", "s3", "ci-cd"],
  },
  {
    id: "fc-codepipeline-004",
    service: "AWS CodePipeline",
    domain: "deployment",
    difficulty: "medium",
    question: "How does CodePipeline trigger on source changes?",
    answer:
      "Source triggers: CodeCommit (CloudWatch Events/EventBridge rule), S3 (CloudWatch Events on object change), GitHub (webhooks via CodeStar Connections). Detection method: EventBridge rules (recommended, immediate) or periodic checking (polling, every minute, deprecated for some sources).",
    keyPoints: [
      "EventBridge: near-instant trigger on commit/push",
      "CodeStar Connections: links GitHub, Bitbucket, GitLab to CodePipeline",
      "S3 source: trigger on object version change",
      "Polling: fallback method, up to 1-min delay",
    ],
    tags: ["codepipeline", "triggers", "codecommit", "github", "eventbridge"],
  },
  {
    id: "fc-codepipeline-005",
    service: "AWS CodePipeline",
    domain: "deployment",
    difficulty: "medium",
    question: "How do you deploy to multiple environments with CodePipeline?",
    answer:
      "Add separate deploy stages for each environment (dev → staging → prod), each with its own Deploy action targeting the respective environment. Use manual approval before prod. Pass environment-specific config via stage-level variables or different artifact sets per deploy target.",
    keyPoints: [
      "Sequential stages enforce promotion gates (dev → staging → prod)",
      "Manual approval gate before production deploy",
      "Use CodeDeploy deployment groups per environment",
      "Namespace stage variables per stage for environment-specific config",
    ],
    tags: ["codepipeline", "environments", "promotion", "deployment", "ci-cd"],
  },
  {
    id: "fc-codepipeline-006",
    service: "AWS CodePipeline",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do you monitor and troubleshoot CodePipeline failures?",
    answer:
      "Pipeline execution history shows per-action status and failure reason. CloudWatch Events/EventBridge rules can detect FAILED state and trigger SNS notifications. For CodeBuild failures, check build logs in CloudWatch Logs. For CodeDeploy, check deployment events and instance logs.",
    keyPoints: [
      "Console shows per-action failure details and error messages",
      "EventBridge rule: trigger on pipeline execution state change",
      "CodeBuild log stream in CloudWatch Logs for build errors",
      "CodeDeploy deployment events show hook failures",
    ],
    tags: ["codepipeline", "troubleshooting", "monitoring", "cloudwatch"],
  },

  // --- NEW: AWS CodeBuild ---
  {
    id: "fc-codebuild-002",
    service: "AWS CodeBuild",
    domain: "deployment",
    difficulty: "medium",
    question: "How does CodeBuild caching improve build performance?",
    answer:
      "CodeBuild supports S3 cache and local cache. S3 cache: uploads specified paths (node_modules, Maven .m2) to S3 after build; downloads at next build start. Local cache: uses the underlying build machine cache (Docker layer, source, custom). Local cache is faster but not shared across build hosts.",
    keyPoints: [
      "S3 cache: shared across all builds, slower to upload/download",
      "Local Docker layer cache: speeds Docker image builds significantly",
      "Cache key uses project name and optional branch/hash",
      "Specify paths in buildspec.yml cache.paths section",
    ],
    tags: ["codebuild", "caching", "performance", "s3", "docker"],
  },
  {
    id: "fc-codebuild-003",
    service: "AWS CodeBuild",
    domain: "security",
    difficulty: "medium",
    question: "How do you securely pass secrets to CodeBuild?",
    answer:
      "Reference SSM Parameter Store or Secrets Manager values in buildspec.yml env.parameter-store or env.secrets-manager sections. CodeBuild resolves these at build time using the build project's service role. Never hardcode secrets in buildspec.yml or env.variables.",
    keyPoints: [
      "env.parameter-store: resolve SSM parameters by path",
      "env.secrets-manager: resolve Secrets Manager secrets",
      "Service role needs ssm:GetParameters or secretsmanager:GetSecretValue",
      "Values available as environment variables in build commands",
    ],
    tags: ["codebuild", "secrets", "ssm", "secrets-manager", "security"],
  },
  {
    id: "fc-codebuild-004",
    service: "AWS CodeBuild",
    domain: "deployment",
    difficulty: "hard",
    question: "How does CodeBuild work inside a VPC?",
    answer:
      "Configure CodeBuild with VPC, subnets, and security groups to give builds access to private resources (RDS, ElastiCache, private APIs). Build runs on an ENI in your VPC. For internet access (package downloads), the subnet must route through a NAT Gateway. VPC-attached builds cannot use public endpoints without NAT.",
    keyPoints: [
      "VPC config: VPC ID, subnets, security group IDs",
      "Private resources accessible from build environment",
      "Internet access requires NAT Gateway in private subnet",
      "Service role needs ec2:CreateNetworkInterface permission",
    ],
    tags: ["codebuild", "vpc", "networking", "nat-gateway", "security"],
  },
  {
    id: "fc-codebuild-005",
    service: "AWS CodeBuild",
    domain: "deployment",
    difficulty: "medium",
    question: "What are CodeBuild environment types and compute options?",
    answer:
      "CodeBuild offers Linux (Ubuntu, Amazon Linux), Windows, and ARM environments. Compute sizes range from small (3 GB RAM, 2 vCPU) to 2xlarge (145 GB RAM, 72 vCPU). Privileged mode must be enabled for Docker builds (to run Docker daemon inside the build container).",
    keyPoints: [
      "Privileged mode: required for docker build commands",
      "ARM compute: cheaper for ARM-native builds",
      "Larger compute: use for resource-intensive test suites",
      "Custom build images: use your own Docker image from ECR",
    ],
    tags: ["codebuild", "compute", "environments", "docker", "privileged-mode"],
  },
  {
    id: "fc-codebuild-006",
    service: "AWS CodeBuild",
    domain: "troubleshooting",
    difficulty: "easy",
    question:
      "Where do you find CodeBuild build logs and how do you access them?",
    answer:
      "CodeBuild streams build output to CloudWatch Logs (by default) and optionally to S3. Log group: /aws/codebuild/<project-name>. Each build has a unique log stream. Logs viewable in the CodeBuild console, CloudWatch Logs console, or via CLI. Enable S3 logs for long-term retention.",
    keyPoints: [
      "Default log group: /aws/codebuild/<project-name>",
      "Each build = one CloudWatch log stream",
      "Build phase details shown in console with timing",
      "S3 log export for long-term archiving beyond CloudWatch retention",
    ],
    tags: ["codebuild", "logging", "cloudwatch", "troubleshooting"],
  },

  // --- NEW: AWS SAM ---
  {
    id: "fc-sam-002",
    service: "AWS SAM",
    domain: "deployment",
    difficulty: "medium",
    question: "What SAM resource types are available and what do they create?",
    answer:
      "AWS::Serverless::Function → Lambda function + IAM execution role + event source mappings. AWS::Serverless::Api → API Gateway REST API + stages. AWS::Serverless::HttpApi → API Gateway HTTP API. AWS::Serverless::SimpleTable → DynamoDB table with basic config. AWS::Serverless::StateMachine → Step Functions state machine.",
    keyPoints: [
      "SAM types expand to multiple CloudFormation resources via Transform",
      "Serverless::Function: Events property defines triggers (API, S3, SQS, etc.)",
      "Serverless::Api: auto-generated from Function Events or explicit definition",
      "All standard CloudFormation resources also work in SAM templates",
    ],
    tags: ["sam", "serverless", "resource-types", "cloudformation"],
  },
  {
    id: "fc-sam-003",
    service: "AWS SAM",
    domain: "deployment",
    difficulty: "medium",
    question: "How does SAM local testing work?",
    answer:
      "sam local invoke runs a Lambda function locally in a Docker container matching the Lambda runtime. sam local start-api starts a local API Gateway. sam local start-lambda emulates the Lambda API for local testing. Requires Docker. Pass test events as JSON files with -e flag.",
    keyPoints: [
      "Requires Docker installed locally",
      "sam local invoke: one-shot function invocation",
      "sam local start-api: persistent local API Gateway on port 3000",
      "Environment variables loaded from .env.json or template Globals",
    ],
    tags: ["sam", "local-testing", "docker", "lambda", "development"],
  },
  {
    id: "fc-sam-004",
    service: "AWS SAM",
    domain: "deployment",
    difficulty: "hard",
    question: "How does SAM handle deployment and what does sam deploy do?",
    answer:
      "sam build packages your Lambda code and dependencies. sam deploy uploads the package to S3, then creates/updates a CloudFormation stack using the transformed template. First run uses --guided to set parameters (stack name, region, S3 bucket). Settings saved to samconfig.toml for subsequent runs.",
    keyPoints: [
      "sam build → local build artifact in .aws-sam/",
      "sam deploy → upload to S3 + CloudFormation create/update",
      "samconfig.toml persists deployment settings",
      "Supports CloudFormation change sets before executing (--no-confirm-changeset to skip)",
    ],
    tags: ["sam", "deployment", "cloudformation", "s3", "build"],
  },
  {
    id: "fc-sam-005",
    service: "AWS SAM",
    domain: "deployment",
    difficulty: "medium",
    question: "How do you define SAM policy templates and what are they?",
    answer:
      "SAM policy templates are pre-defined IAM policies you attach to Lambda functions using shorthand. Examples: DynamoDBReadPolicy, S3ReadPolicy, SQSPollerPolicy. They expand to full IAM policies with the correct actions and resource ARNs. Reduces boilerplate compared to writing raw IAM policies.",
    keyPoints: [
      "Policy templates referenced in Function Policies property",
      "Pass resource ARN as parameter (e.g., TableName: !Ref MyTable)",
      "Expands to least-privilege IAM policy automatically",
      "60+ built-in policy templates available",
    ],
    tags: ["sam", "policy-templates", "iam", "lambda", "security"],
  },
  {
    id: "fc-sam-006",
    service: "AWS SAM",
    domain: "deployment",
    difficulty: "medium",
    question: "How does SAM support gradual Lambda deployments?",
    answer:
      "SAM integrates with CodeDeploy to shift traffic to new Lambda versions. In Function properties, set DeploymentPreference type (Canary10Percent5Minutes, Linear10PercentEvery1Minute, AllAtOnce) and optional Hooks (PreTraffic and PostTraffic Lambda functions for validation).",
    keyPoints: [
      "DeploymentPreference: integrates CodeDeploy automatically",
      "PreTraffic hook: validate new version before any traffic",
      "PostTraffic hook: validate after full traffic shift",
      "Rollback triggered if hook Lambda fails or alarm breaches",
    ],
    tags: ["sam", "codedeploy", "canary", "traffic-shifting", "deployment"],
  },

  // --- NEW: AWS Elastic Beanstalk ---
  {
    id: "fc-eb-002",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    difficulty: "medium",
    question: "What is the .ebextensions directory and what can it configure?",
    answer:
      ".ebextensions is a folder in your application bundle with YAML/JSON config files (*.config). They configure environment resources (additional AWS resources via CloudFormation), EC2 instance settings (packages, files, commands, services), and environment variables.",
    keyPoints: [
      "Files must end in .config in the .ebextensions/ directory",
      "option_settings: configure Elastic Beanstalk environment properties",
      "Resources: add AWS resources (RDS, SQS, etc.) to the environment",
      "container_commands: run commands during deployment before app starts",
    ],
    tags: ["elastic-beanstalk", "ebextensions", "configuration", "deployment"],
  },
  {
    id: "fc-eb-003",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    difficulty: "hard",
    question: "How does Elastic Beanstalk worker tier differ from web tier?",
    answer:
      "Web tier: load-balanced, auto-scaling environment for HTTP traffic, fronted by ALB. Worker tier: processes background tasks from an SQS queue; each instance runs a daemon that polls SQS and POSTs messages to your application's / endpoint. Decouples long-running tasks from web request handling.",
    keyPoints: [
      "Worker tier polls SQS and POSTs to localhost as HTTP",
      "No load balancer on worker tier",
      "cron.yaml in app root defines periodic tasks (Elastic Beanstalk cron)",
      "Common pattern: web tier publishes jobs; worker tier consumes them",
    ],
    tags: ["elastic-beanstalk", "worker-tier", "sqs", "background-jobs"],
  },
  {
    id: "fc-eb-004",
    service: "AWS Elastic Beanstalk",
    domain: "troubleshooting",
    difficulty: "medium",
    question:
      "How do you view logs and troubleshoot Elastic Beanstalk deployments?",
    answer:
      "Request logs from the EB console or CLI (eb logs): retrieves last 100 lines of relevant logs (web server, deployment, eb-activity). Enable log streaming to CloudWatch Logs for persistent log retention. Check /var/log/eb-activity.log for deployment lifecycle events.",
    keyPoints: [
      "eb logs: snapshot or tail logs from instances",
      "CloudWatch Logs streaming: persistent, searchable logs",
      "/var/log/eb-activity.log: deployment hook output",
      "Health dashboard shows event history and environment health",
    ],
    tags: ["elastic-beanstalk", "logs", "troubleshooting", "cloudwatch"],
  },
  {
    id: "fc-eb-005",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    difficulty: "medium",
    question:
      "How do you pass configuration and secrets to an Elastic Beanstalk application?",
    answer:
      "Environment properties set key-value pairs accessible as environment variables in the app. For secrets, use SSM Parameter Store or Secrets Manager and read from the app at runtime using SDK. Avoid putting secrets in .ebextensions or environment properties (visible in console).",
    keyPoints: [
      "Environment properties: set via console, CLI, or .ebextensions",
      "Properties appear as OS environment variables in the instance",
      "Secrets: use SSM/Secrets Manager, not plain environment properties",
      "Instance profile needs permissions to read SSM/Secrets Manager",
    ],
    tags: ["elastic-beanstalk", "configuration", "secrets", "ssm", "security"],
  },
  {
    id: "fc-eb-006",
    service: "AWS Elastic Beanstalk",
    domain: "deployment",
    difficulty: "easy",
    question: "What platforms does Elastic Beanstalk support?",
    answer:
      "Elastic Beanstalk supports managed platforms for: Node.js, Python, Ruby, PHP, Java SE, Tomcat, .NET Core on Linux, .NET on Windows, Go, and Docker (single/multi-container). Platforms are versioned; you can pin or auto-update. Custom platforms can be built for unsupported runtimes.",
    keyPoints: [
      "Docker platform: deploy any container image",
      "Multi-container Docker: uses ECS under the hood (Dockerrun.aws.json v2)",
      "Platform versions updated regularly; update to get security patches",
      "Custom platform: build with Packer if managed platform insufficient",
    ],
    tags: ["elastic-beanstalk", "platforms", "docker", "runtimes"],
  },

  // --- NEW: AWS CDK ---
  {
    id: "fc-cdk-002",
    service: "AWS CDK",
    domain: "deployment",
    difficulty: "medium",
    question: "What is CDK bootstrapping and why is it required?",
    answer:
      "Bootstrapping provisions CDK toolkit resources in an account/region: an S3 bucket (for assets), ECR repository (for Docker images), and IAM roles for deployment. Run cdk bootstrap once per account/region before deploying. Bootstrap stack named CDKToolkit.",
    keyPoints: [
      "Creates CDKToolkit CloudFormation stack",
      "S3 bucket stores Lambda ZIPs, CloudFormation templates",
      "IAM roles: CloudFormation execution role, deployment role",
      "Cross-account deployments require bootstrapping in each target account",
    ],
    tags: ["cdk", "bootstrap", "deployment", "s3", "iam"],
  },
  {
    id: "fc-cdk-003",
    service: "AWS CDK",
    domain: "deployment",
    difficulty: "hard",
    question:
      "What is the CDK construct library and how do L1, L2, L3 constructs differ?",
    answer:
      "L1 (Cfn* classes): direct CloudFormation resource mapping, all properties exposed, low-level. L2 (e.g., s3.Bucket, lambda.Function): opinionated defaults, helper methods, type-safe, hides complexity. L3 (patterns, e.g., aws-ecs-patterns): complete solutions combining multiple L2s (e.g., ApplicationLoadBalancedFargateService).",
    keyPoints: [
      "L1: one-to-one with CloudFormation, prefix Cfn (CfnBucket)",
      "L2: sensible defaults, escape hatches to L1 via .node.defaultChild",
      "L3: patterns solve complete use cases in one construct",
      "Use L2 by default; drop to L1 only for unsupported properties",
    ],
    tags: ["cdk", "constructs", "l1", "l2", "l3", "construct-library"],
  },
  {
    id: "fc-cdk-004",
    service: "AWS CDK",
    domain: "deployment",
    difficulty: "medium",
    question: "What is CDK Aspects and how are they used?",
    answer:
      "Aspects are a mechanism to apply operations to all constructs in a scope. They implement the IAspect interface (visit method called on every node). Common use: enforce tagging policies, add security controls, inject permissions. Run during synthesis after the construct tree is fully defined.",
    keyPoints: [
      "Aspects.of(scope).add(myAspect): apply to all children",
      "IAspect.visit(node): called for every construct in scope",
      "Use to enforce org-wide policies (required tags, encryption)",
      "Runs during cdk synth, not at deploy time",
    ],
    tags: ["cdk", "aspects", "policy-enforcement", "tagging", "synthesis"],
  },
  {
    id: "fc-cdk-005",
    service: "AWS CDK",
    domain: "deployment",
    difficulty: "medium",
    question: "How does CDK handle environment (account/region) configuration?",
    answer:
      "Stacks can be environment-agnostic (resolved at deploy time) or environment-specific (hardcoded account/region). Specify env in Stack props: { account: '123456789', region: 'us-east-1' }. CDK_DEFAULT_ACCOUNT and CDK_DEFAULT_REGION env vars resolve to the CLI profile's account/region.",
    keyPoints: [
      "Env-agnostic: use CDK_DEFAULT_ACCOUNT/REGION — resolved at synthesis",
      "Env-specific: hardcode values for deterministic deployments",
      "Cross-environment references require concrete environments",
      "cdk deploy --profile myprofile selects AWS credentials",
    ],
    tags: ["cdk", "environment", "account", "region", "deployment"],
  },
  {
    id: "fc-cdk-006",
    service: "AWS CDK",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "What is CDK diff and how do you use it safely?",
    answer:
      "cdk diff compares the synthesized CloudFormation template against the currently deployed stack, showing resource additions, modifications, and deletions. Run before cdk deploy to preview changes. Replacement operations (shown with ~) destroy and recreate resources, causing downtime.",
    keyPoints: [
      "cdk diff: preview changes before deploy",
      "~ symbol: replacement — resource will be destroyed and recreated",
      "+ symbol: new resource addition",
      "- symbol: resource deletion — check carefully before accepting",
    ],
    tags: ["cdk", "diff", "change-preview", "deployment", "safety"],
  },

  // --- NEW: Amazon VPC ---
  {
    id: "fc-vpc-002",
    service: "Amazon VPC",
    domain: "development",
    difficulty: "medium",
    question:
      "What is the difference between a Security Group and a Network ACL?",
    answer:
      "Security Groups: stateful (return traffic allowed automatically), applies to ENI/instance level, allows only, evaluated as combined set. Network ACLs: stateless (must explicitly allow inbound AND outbound), applies at subnet level, allows and denies, rules evaluated by number (lowest first).",
    keyPoints: [
      "SG: stateful; NACL: stateless",
      "SG: instance/ENI level; NACL: subnet level",
      "NACL: explicit allow/deny rules with priority order",
      "Default NACL: allows all traffic; custom NACL: denies all by default",
    ],
    tags: ["vpc", "security-group", "nacl", "networking", "security"],
  },
  {
    id: "fc-vpc-003",
    service: "Amazon VPC",
    domain: "development",
    difficulty: "medium",
    question: "What is a VPC endpoint and what types are available?",
    answer:
      "VPC endpoints allow private connectivity to AWS services without internet, NAT, or VPN. Types: Gateway endpoints (S3 and DynamoDB only, free, added to route table), Interface endpoints (PrivateLink, creates ENI in subnet, supports most AWS services, per-hour cost).",
    keyPoints: [
      "Gateway endpoints: S3 and DynamoDB; free; route table entry",
      "Interface endpoints (PrivateLink): ENI in subnet; per-hour + data charge",
      "Endpoint policies restrict which API actions are allowed through endpoint",
      "Use VPC endpoints to avoid NAT Gateway cost for AWS service traffic",
    ],
    tags: [
      "vpc",
      "vpc-endpoints",
      "privatelink",
      "gateway-endpoint",
      "networking",
    ],
  },
  {
    id: "fc-vpc-004",
    service: "Amazon VPC",
    domain: "development",
    difficulty: "hard",
    question: "What is VPC peering and what are its limitations?",
    answer:
      "VPC peering connects two VPCs (same or different accounts/regions) allowing routing between them with private IPs. No overlapping CIDR blocks allowed. Not transitive: A-B and B-C does not allow A-C. For transitive routing, use Transit Gateway.",
    keyPoints: [
      "Non-transitive: must create peering for every VPC pair",
      "No overlapping CIDR ranges allowed",
      "Works cross-account and cross-region",
      "Transit Gateway: hub-and-spoke model, solves transitivity",
    ],
    tags: ["vpc", "vpc-peering", "transit-gateway", "networking"],
  },
  {
    id: "fc-vpc-005",
    service: "Amazon VPC",
    domain: "development",
    difficulty: "medium",
    question: "What is a NAT Gateway and when do you need it?",
    answer:
      "A NAT Gateway allows instances in private subnets to initiate outbound internet connections while preventing inbound connections from the internet. Deploy in a public subnet; update private subnet route tables to send 0.0.0.0/0 traffic to the NAT Gateway. Managed, scales automatically.",
    keyPoints: [
      "NAT Gateway in public subnet; routes from private subnets",
      "High availability: deploy one per AZ for redundancy",
      "Charged per hour + per GB of data processed",
      "NAT instance (EC2): cheaper but requires management and is a single point of failure",
    ],
    tags: [
      "vpc",
      "nat-gateway",
      "internet-access",
      "networking",
      "private-subnet",
    ],
  },
  {
    id: "fc-vpc-006",
    service: "Amazon VPC",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do you use VPC Flow Logs for troubleshooting?",
    answer:
      "VPC Flow Logs capture IP traffic information for VPC, subnet, or ENI level. Published to CloudWatch Logs or S3. Log format includes source/dest IP, ports, protocol, action (ACCEPT/REJECT), and status. Use to diagnose security group/NACL blocks, identify traffic patterns, and audit access.",
    keyPoints: [
      "Flow logs don't capture: DNS, DHCP, license activation, metadata traffic",
      "ACCEPT: traffic allowed; REJECT: blocked by SG or NACL",
      "Analyze with CloudWatch Logs Insights or Athena (S3 destination)",
      "Enable at VPC, subnet, or ENI level",
    ],
    tags: ["vpc", "flow-logs", "troubleshooting", "security", "networking"],
  },

  // --- NEW: AWS Amplify ---
  {
    id: "fc-amplify-002",
    service: "AWS Amplify",
    domain: "deployment",
    difficulty: "medium",
    question: "How does Amplify Hosting CI/CD work?",
    answer:
      "Amplify Hosting connects to your Git repository and automatically builds and deploys on every push to configured branches. Build settings defined in amplify.yml or auto-detected for popular frameworks. Each branch gets its own URL; feature branches get preview URLs.",
    keyPoints: [
      "Supports GitHub, GitLab, Bitbucket, CodeCommit, and manual zip uploads",
      "amplify.yml: define build, test, and deployment commands per branch",
      "Branch-based deployments: each branch = separate environment URL",
      "Pull Request previews: automatic preview URLs for PRs",
    ],
    tags: ["amplify", "hosting", "ci-cd", "git", "deployment"],
  },
  {
    id: "fc-amplify-003",
    service: "AWS Amplify",
    domain: "development",
    difficulty: "medium",
    question: "What is Amplify Gen 2 and how does it differ from Gen 1?",
    answer:
      "Amplify Gen 2 uses TypeScript-first, code-based backend definitions (no Amplify CLI category commands). Backend resources defined in amplify/ directory using TypeScript; changes deployed via Git-based CI/CD or sandbox. Gen 1 used amplify add commands and JSON configuration files.",
    keyPoints: [
      "Gen 2: TypeScript code defines backend (auth, data, storage, functions)",
      "amplify sandbox: local dev environment with hot-reload backend",
      "Git-based deployment: push to branch → deploy backend + frontend",
      "Gen 1: amplify add auth/api/storage + JSON config (still supported)",
    ],
    tags: ["amplify", "gen2", "typescript", "backend", "development"],
  },
  {
    id: "fc-amplify-004",
    service: "AWS Amplify",
    domain: "security",
    difficulty: "medium",
    question: "How does Amplify handle authentication?",
    answer:
      "Amplify Auth uses Cognito User Pools under the hood. Provides pre-built UI components (Authenticator) and JS/mobile library calls for sign-up, sign-in, MFA, social sign-in, and token management. Handles token refresh automatically. Configure via amplify/auth/resource.ts (Gen 2) or amplify add auth (Gen 1).",
    keyPoints: [
      "Backed by Cognito User Pool and optional Identity Pool",
      "Amplify Authenticator: drop-in React/Vue/Angular UI component",
      "Social providers (Google, Apple, Facebook) via hosted UI",
      "Tokens automatically refreshed by Amplify library",
    ],
    tags: ["amplify", "authentication", "cognito", "security"],
  },
  {
    id: "fc-amplify-005",
    service: "AWS Amplify",
    domain: "development",
    difficulty: "medium",
    question: "How does Amplify DataStore work?",
    answer:
      "DataStore provides local storage (IndexedDB/SQLite) synchronized with a cloud GraphQL backend (AppSync + DynamoDB). Works offline and online. Data is defined with a schema; DataStore auto-generates save/query/delete operations. Conflict resolution strategies: Auto Merge, Optimistic Concurrency, Lambda.",
    keyPoints: [
      "Offline-first: stores data locally, syncs when online",
      "Backed by AppSync + DynamoDB automatically",
      "Conflict resolution configured per model",
      "Subscription-based real-time sync via WebSocket",
    ],
    tags: ["amplify", "datastore", "offline", "appsync", "graphql"],
  },
  {
    id: "fc-amplify-006",
    service: "AWS Amplify",
    domain: "deployment",
    difficulty: "easy",
    question:
      "What is the difference between Amplify Hosting and Amplify Backend?",
    answer:
      "Amplify Hosting: static web hosting with CDN, CI/CD, custom domains, SSL, and branch previews. Amplify Backend: provisioning and managing cloud resources (Auth, API, Storage, Functions) via Amplify CLI or Gen 2 TypeScript code. They are independent — you can use one without the other.",
    keyPoints: [
      "Hosting: deploy frontend (React, Next.js, Vue, static sites)",
      "Backend: Cognito, AppSync, S3, Lambda managed via Amplify",
      "Can use Amplify Hosting with any non-Amplify backend",
      "Can use Amplify Backend with any frontend hosting solution",
    ],
    tags: ["amplify", "hosting", "backend", "deployment"],
  },

  // --- NEW: Amazon RDS ---
  {
    id: "fc-rds-002",
    service: "Amazon RDS",
    domain: "development",
    difficulty: "medium",
    question: "What is RDS Multi-AZ and how does it differ from Read Replicas?",
    answer:
      "Multi-AZ: synchronous replication to standby in another AZ for high availability. Automatic failover (60–120s). Standby not readable. Read Replicas: asynchronous replication, used for read scaling, can be in same/different region, readable, manual promotion required.",
    keyPoints: [
      "Multi-AZ: synchronous, HA failover, standby is not a read endpoint",
      "Read Replica: async, scale reads, can be cross-region",
      "Failover: Multi-AZ automatic; Read Replica manual promotion",
      "Cross-region Read Replica: disaster recovery + local read latency",
    ],
    tags: [
      "rds",
      "multi-az",
      "read-replica",
      "high-availability",
      "replication",
    ],
  },
  {
    id: "fc-rds-003",
    service: "Amazon RDS",
    domain: "security",
    difficulty: "medium",
    question: "How do you encrypt RDS databases and what are the requirements?",
    answer:
      "Enable encryption at creation time using KMS CMK (cannot enable on existing unencrypted instances). Encryption covers data at rest: storage, automated backups, Read Replicas, snapshots. Encrypt an existing instance by taking a snapshot, copying it with encryption enabled, and restoring.",
    keyPoints: [
      "Encryption must be enabled at creation — cannot add later",
      "Encrypted snapshot → restore → encrypted instance",
      "Read Replicas of encrypted instance must also be encrypted",
      "In-transit: use SSL/TLS connection; enforce via RDS parameter group",
    ],
    tags: ["rds", "encryption", "kms", "security", "ssl"],
  },
  {
    id: "fc-rds-004",
    service: "Amazon RDS",
    domain: "development",
    difficulty: "hard",
    question: "What is Amazon Aurora and how does it differ from standard RDS?",
    answer:
      "Aurora is an AWS-optimized relational database compatible with MySQL and PostgreSQL. Shared storage auto-scales (10 GB increments, up to 128 TB). 6-way replication across 3 AZs. Up to 15 Aurora Replicas (vs 5 for RDS). Faster failover (~30s). Aurora Serverless v2 scales compute automatically.",
    keyPoints: [
      "Storage: shared, 6 copies across 3 AZs, auto-scales",
      "Up to 15 read replicas with lag < 100ms",
      "Failover: promotes replica in ~30 seconds",
      "Aurora Global Database: cross-region with < 1s replication lag",
    ],
    tags: ["rds", "aurora", "mysql", "postgresql", "high-availability"],
  },
  {
    id: "fc-rds-005",
    service: "Amazon RDS",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do you monitor RDS performance and what key metrics matter?",
    answer:
      "CloudWatch provides: CPUUtilization, DatabaseConnections, FreeStorageSpace, ReadIOPS/WriteIOPS, ReadLatency/WriteLatency, FreeableMemory. Enable Enhanced Monitoring for OS-level metrics (1-second granularity). Performance Insights shows query-level analysis and DB load.",
    keyPoints: [
      "DatabaseConnections: monitor for connection exhaustion",
      "Performance Insights: top SQL queries by wait type",
      "Enhanced Monitoring: OS metrics not visible in CloudWatch (per-process)",
      "FreeStorageSpace: set alarm before storage exhausted",
    ],
    tags: [
      "rds",
      "monitoring",
      "cloudwatch",
      "performance-insights",
      "troubleshooting",
    ],
  },
  {
    id: "fc-rds-006",
    service: "Amazon RDS",
    domain: "development",
    difficulty: "medium",
    question: "How does RDS IAM database authentication work?",
    answer:
      "With IAM auth enabled, users authenticate using an IAM authentication token (generated via generate-db-auth-token) instead of a password. The token is valid for 15 minutes. Useful for EC2/Lambda that already have IAM roles — no need to store DB credentials. Supported for MySQL and PostgreSQL.",
    keyPoints: [
      "Token generated via AWS CLI or SDK (valid 15 min)",
      "IAM policy must allow rds-db:connect for the DB user",
      "No password management; credentials tied to IAM identity",
      "Supported for MySQL and PostgreSQL on RDS and Aurora",
    ],
    tags: ["rds", "iam-authentication", "security", "credentials"],
  },

  // --- NEW: AWS Systems Manager ---
  {
    id: "fc-ssm-002",
    service: "AWS Systems Manager",
    domain: "deployment",
    difficulty: "medium",
    question: "What is SSM Parameter Store and what are its parameter types?",
    answer:
      "Parameter Store stores configuration data and secrets as key-value pairs. Types: String, StringList, SecureString (encrypted with KMS). Tiers: Standard (free, 4KB max, 10K parameters) and Advanced ($0.05/10K API calls, 8KB max, 100K parameters, parameter policies).",
    keyPoints: [
      "SecureString: encrypted at rest with KMS; use for passwords/keys",
      "Parameter hierarchy: /myapp/prod/db-password for organization",
      "Integration with Lambda, EC2, ECS, CodeBuild natively",
      "GetParametersByPath: retrieve all params in a hierarchy at once",
    ],
    tags: ["ssm", "parameter-store", "configuration", "secrets", "kms"],
  },
  {
    id: "fc-ssm-003",
    service: "AWS Systems Manager",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is SSM Session Manager and why is it preferred over SSH bastion hosts?",
    answer:
      "Session Manager provides browser or CLI-based shell access to EC2 instances without SSH keys, bastion hosts, or open inbound ports. Access controlled via IAM. Session logs audited to CloudWatch/S3. Works for instances without public IPs via SSM Agent.",
    keyPoints: [
      "No SSH keys, no bastion host, no open port 22 required",
      "Access via IAM: ssm:StartSession permission",
      "Logs all session activity to CloudWatch Logs or S3",
      "Requires SSM Agent on instance and instance profile with SSM permissions",
    ],
    tags: ["ssm", "session-manager", "security", "access", "ec2"],
  },
  {
    id: "fc-ssm-004",
    service: "AWS Systems Manager",
    domain: "deployment",
    difficulty: "medium",
    question: "What is SSM Run Command and when would you use it?",
    answer:
      "Run Command executes scripts or predefined documents on multiple EC2 instances simultaneously without SSH. Supports targeting by instance ID, tags, or resource groups. Output captured to S3 or CloudWatch Logs. Common use: install software, patch instances, collect diagnostics.",
    keyPoints: [
      "No SSH or bastion needed — uses SSM Agent",
      "Target by instance ID, tag, or Resource Group",
      "AWS-RunShellScript: run shell commands on Linux",
      "Rate control: concurrency limit and error threshold",
    ],
    tags: ["ssm", "run-command", "automation", "ec2", "management"],
  },
  {
    id: "fc-ssm-005",
    service: "AWS Systems Manager",
    domain: "deployment",
    difficulty: "hard",
    question: "What is SSM Automation and how does it differ from Run Command?",
    answer:
      "SSM Automation runs multi-step workflows (SSM Documents) that can call AWS APIs, run scripts, and approve with human input. Unlike Run Command (which runs on EC2 instances), Automation orchestrates AWS services (restart instances, create AMIs, update CloudFormation stacks). Automation documents use YAML/JSON.",
    keyPoints: [
      "Automation: orchestrates AWS API calls across services",
      "Run Command: executes commands on EC2 instances",
      "Built-in documents: AWS-RestartEC2Instance, AWS-CreateImage, etc.",
      "Maintenance Windows: schedule Automation/Run Command at defined times",
    ],
    tags: ["ssm", "automation", "run-command", "workflows", "documents"],
  },
  {
    id: "fc-ssm-006",
    service: "AWS Systems Manager",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "How do you use SSM Patch Manager to keep instances up to date?",
    answer:
      "Patch Manager defines patch baselines (approved patches by severity/classification) and patch groups (instances by tags). Maintenance Windows schedule patch operations. AWS-RunPatchBaseline document checks compliance and installs approved patches. Compliance reports show patch status.",
    keyPoints: [
      "Patch baseline: rules defining which patches are approved",
      "Patch group: tag key PatchGroup links instances to baseline",
      "Maintenance window: define schedule for patching",
      "Compliance dashboard: view patch compliance across fleet",
    ],
    tags: [
      "ssm",
      "patch-manager",
      "patching",
      "compliance",
      "maintenance-window",
    ],
  },

  // --- NEW: Amazon S3 ---
  {
    id: "fc-s3-006",
    service: "Amazon S3",
    domain: "development",
    difficulty: "hard",
    question: "What is S3 Object Lock and how does it provide WORM compliance?",
    answer:
      "S3 Object Lock prevents object deletion or overwrite for a fixed period or indefinitely. Modes: Governance (authorized users can override) and Compliance (no one, including root, can delete before retention expires). Legal Hold: indefinite lock that can be removed by authorized users. Requires versioning.",
    keyPoints: [
      "Versioning must be enabled before enabling Object Lock",
      "Compliance mode: strongest protection, cannot be disabled once set",
      "Governance mode: admins with s3:BypassGovernanceRetention can override",
      "Legal Hold: on/off toggle independent of retention period",
    ],
    tags: ["s3", "object-lock", "compliance", "worm", "security"],
  },

  // --- NEW: Amazon API Gateway ---
  {
    id: "fc-apigw-005",
    service: "Amazon API Gateway",
    domain: "development",
    difficulty: "medium",
    question: "What is API Gateway caching and how does it work?",
    answer:
      "API Gateway REST API caches responses from integrations. Cache capacity: 0.5 GB to 237 GB. TTL: 0–3600s. Cache key includes method request path, query strings, and headers (configurable). Cache hit returns response without calling integration. Per-stage setting.",
    keyPoints: [
      "Caching available on REST API, not HTTP API",
      "Reduces backend load and improves latency for repeated requests",
      "Cache can be invalidated by clients with Cache-Control: max-age=0 header",
      "Encryption at rest available for cached data",
    ],
    tags: ["api-gateway", "caching", "performance", "rest-api"],
  },
  {
    id: "fc-apigw-006",
    service: "Amazon API Gateway",
    domain: "development",
    difficulty: "medium",
    question: "What is API Gateway throttling and usage plans?",
    answer:
      "Throttling: limit requests per second (burst: 5000 req, steady: 10000 req/s at account level). Usage plans: associate API keys with rate limits and quotas (daily/weekly/monthly). API keys passed in x-api-key header. Use to monetize or rate-limit API consumers.",
    keyPoints: [
      "Account default: 10000 req/s, burst 5000 (can be raised)",
      "Usage plans: per-client rate limits and monthly quotas",
      "API key: passed in x-api-key header; not authentication",
      "Per-method throttling can be configured on individual routes",
    ],
    tags: [
      "api-gateway",
      "throttling",
      "usage-plans",
      "api-keys",
      "rate-limiting",
    ],
  },

  // --- NEW: AWS IAM ---
  {
    id: "fc-iam-004",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    question: "What is IAM Access Analyzer and what does it detect?",
    answer:
      "IAM Access Analyzer identifies resources shared with external principals (outside your AWS organization or account). It analyzes resource policies for S3, IAM roles, KMS keys, SQS queues, Lambda functions, and more. Generates findings for any policy granting external access.",
    keyPoints: [
      "Analyzes resource-based policies for external access",
      "Zone of trust: AWS account or AWS Organization",
      "Findings: resource + external principal + access level",
      "Policy validation: checks IAM policies for errors and best practices",
    ],
    tags: ["iam", "access-analyzer", "security", "external-access"],
  },
  {
    id: "fc-iam-005",
    service: "AWS IAM",
    domain: "security",
    difficulty: "medium",
    question: "What are IAM policy conditions and common condition keys?",
    answer:
      "Conditions add context-based restrictions to policy statements. Common condition keys: aws:SourceIp (restrict by IP), aws:RequestedRegion (restrict to region), aws:MultiFactorAuthPresent (require MFA), aws:PrincipalTag (tag-based), aws:CurrentTime (time-based). Conditions use condition operators (StringEquals, IpAddress, Bool, etc.).",
    keyPoints: [
      "Conditions narrow when a policy statement applies",
      "aws:SecureTransport: enforce HTTPS-only access",
      "aws:RequestedRegion: prevent actions outside allowed regions",
      "Multiple conditions: all must be true (AND logic within a condition block)",
    ],
    tags: ["iam", "conditions", "condition-keys", "security", "policy"],
  },
  {
    id: "fc-iam-006",
    service: "AWS IAM",
    domain: "security",
    difficulty: "hard",
    question:
      "What is the difference between identity-based and resource-based IAM policies?",
    answer:
      "Identity-based policies attach to IAM users, groups, or roles (control what the identity can do). Resource-based policies attach to resources like S3 buckets, KMS keys, SQS queues (control who can access the resource). Resource-based policies can grant cross-account access without role assumption.",
    keyPoints: [
      "Identity-based: attached to principal; defines allowed actions",
      "Resource-based: attached to resource; defines who can access",
      "Cross-account: resource policy must explicitly allow external principal",
      "Lambda resource policy = function policy; allows invokers",
    ],
    tags: [
      "iam",
      "identity-policy",
      "resource-policy",
      "cross-account",
      "policy-types",
    ],
  },

  // --- NEW: Amazon CloudWatch ---
  {
    id: "fc-cw-004",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "What is CloudWatch Logs Insights and how do you query logs?",
    answer:
      "Logs Insights is an interactive log analytics service. Run queries using CloudWatch query language on log groups. Supports parsing JSON logs, filtering, aggregation, and time-series visualization. Results show matching log events and aggregate stats. Queries can be saved and run on dashboards.",
    keyPoints: [
      "Query syntax: fields, filter, stats, sort, limit commands",
      "Auto-discovers fields in JSON logs",
      "stats count(*) by bin(5m): time-series aggregation",
      "Query multiple log groups simultaneously",
    ],
    tags: ["cloudwatch", "logs-insights", "querying", "analytics"],
  },
  {
    id: "fc-cw-005",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "medium",
    question: "What is CloudWatch Container Insights?",
    answer:
      "Container Insights collects, aggregates, and summarizes metrics and logs from containerized applications on ECS, EKS, and Kubernetes on EC2. Provides pre-built dashboards for cluster, node, pod, and container level metrics. Uses CloudWatch agent or Fluent Bit as a daemon.",
    keyPoints: [
      "Metrics: CPU, memory, disk, network per pod/container",
      "Works with ECS, EKS, and self-managed Kubernetes",
      "CloudWatch agent or Fluent Bit collects and ships metrics/logs",
      "Performance logs stored in structured CloudWatch Logs format",
    ],
    tags: ["cloudwatch", "container-insights", "ecs", "eks", "monitoring"],
  },
  {
    id: "fc-cw-006",
    service: "Amazon CloudWatch",
    domain: "troubleshooting",
    difficulty: "hard",
    question: "What is CloudWatch anomaly detection and how does it work?",
    answer:
      "Anomaly detection uses ML to model the expected behavior of a metric based on historical data, including seasonality and trends. Creates an anomaly detection band (expected range). Alarms can trigger when metric falls outside the band. No fixed threshold needed — adapts to patterns.",
    keyPoints: [
      "ML model built on 2 weeks of historical data",
      "Adapts to time-of-day and day-of-week patterns",
      "Alarm threshold: ANOMALY_DETECTION_BAND function",
      "Useful for metrics without predictable absolute thresholds",
    ],
    tags: ["cloudwatch", "anomaly-detection", "ml", "alarms", "monitoring"],
  },

  // --- NEW: Amazon SQS ---
  {
    id: "fc-sqs-005",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "medium",
    question:
      "What is the SQS message retention period and message size limit?",
    answer:
      "Messages are retained from 1 minute to 14 days (default 4 days). Maximum message size is 256 KB. For larger payloads, use the SQS Extended Client Library which stores the payload in S3 and sends only a reference in the SQS message.",
    keyPoints: [
      "Retention: 1 min to 14 days; default 4 days",
      "Max message size: 256 KB",
      "SQS Extended Client Library: stores body in S3, sends pointer in SQS",
      "Batch operations: SendMessageBatch/ReceiveMessage/DeleteMessageBatch (up to 10 messages)",
    ],
    tags: ["sqs", "retention", "message-size", "extended-client", "s3"],
  },
  {
    id: "fc-sqs-006",
    service: "Amazon SQS",
    domain: "development",
    difficulty: "hard",
    question: "How does Lambda event source mapping with SQS work?",
    answer:
      "Lambda polls the SQS queue and invokes the function with a batch of messages (batch size 1–10,000). Lambda manages the polling; you don't need consumers. On success, Lambda deletes messages. On failure, messages return to queue (or go to DLQ). Use ReportBatchItemFailures for partial batch success.",
    keyPoints: [
      "Lambda polls SQS — you don't write polling code",
      "Batch size: 1–10,000 messages; batch window up to 300s",
      "All messages in batch deleted on function success",
      "ReportBatchItemFailures: return failed message IDs; others are deleted",
    ],
    tags: ["sqs", "lambda", "event-source-mapping", "batch-processing"],
  },
];
