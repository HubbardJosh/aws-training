import { ServiceGuide } from "../../types/guide";

export const sqsGuide: ServiceGuide = {
  id: "amazon-sqs",
  service: "Amazon SQS",
  domain: "development",
  tagline: "Fully managed message queuing for decoupling distributed systems",
  intro:
    "SQS is a fully managed message queue service that enables you to decouple and scale microservices, distributed systems, and serverless applications. Messages are stored durably until processed and deleted.",

  sections: [
    {
      heading: "Queue Types",
      body: `**Standard Queue**
- **Unlimited throughput**: nearly unlimited transactions per second.
- **At-least-once delivery**: a message may be delivered more than once (design for idempotency).
- **Best-effort ordering**: messages are generally delivered in the order sent, but not guaranteed.
- Use for maximum throughput where duplicate processing is tolerable.

**FIFO Queue**
- **Exactly-once processing**: deduplication prevents duplicate processing within a 5-minute window.
- **Strict ordering**: messages within a **MessageGroupId** are delivered in exact FIFO order.
- **Throughput**: 300 API calls/second (3,000 with batching). Can request higher quota.
- Queue name must end in \`.fifo\`.
- Use for financial transactions, order processing, inventory updates — anywhere ordering and exactness matter.`,
    },
    {
      heading: "Core Message Attributes",
      body: `**MessageBody**: the payload. Up to **256 KB**. For larger payloads use the S3-backed Extended Client Library or store in S3 and send the S3 key as the message body.

**MessageGroupId** (FIFO only): groups related messages that must be processed in order. Messages in the same group go to the same consumer (one consumer per group at a time).

**MessageDeduplicationId** (FIFO only): unique ID for deduplication within a 5-minute window. If a message with the same ID is sent twice in 5 minutes, the second is discarded. Can be content-based (SHA-256 hash of body) or explicit.

**MessageAttributes**: metadata key-value pairs (up to 10). Typed (String, Number, Binary). Useful for routing decisions without parsing the body.

**DelaySeconds**: delay before message becomes visible (0–900s per message). Override the queue default delay.`,
    },
    {
      heading: "Visibility Timeout",
      body: `When a consumer receives a message it becomes **invisible** for the visibility timeout period. The consumer must **delete the message before the timeout expires** or it reappears in the queue.

- Default: **30 seconds**. Maximum: **12 hours**.
- Set at queue level (default) or per-message (ReceiveMessage call).
- **Extend with ChangeMessageVisibility**: if processing takes longer than expected, call this API to extend the timeout before it expires.
- **Best practice**: set visibility timeout to at least **6× the Lambda function timeout** (Lambda may retry internally up to 3 times on throttle before returning the message).

If visibility timeout expires before deletion:
- Standard queue: message reappears (potential duplicate processing)
- FIFO queue: message reappears and blocks its message group

**Design for idempotency**: always assume a message may be processed more than once.`,
    },
    {
      heading: "Dead Letter Queues (DLQ)",
      body: `A DLQ receives messages that failed processing after **maxReceiveCount** receive attempts (1–1,000).

**Setup**: create a DLQ (same type as source), then configure the source queue's redrive policy pointing to the DLQ with a maxReceiveCount.

**Rules**:
- DLQ must be the same type as source (Standard→Standard, FIFO→FIFO).
- DLQ retention period should be **longer than the source queue** retention so you have time to inspect failed messages.

**DLQ Redrive (replay)**: move messages from DLQ back to source queue for reprocessing after fixing the bug. Available in the console or via StartMessageMoveTask API.

**Monitoring**: alarm on \`ApproximateNumberOfMessagesVisible\` in DLQ > 0 to detect processing failures early.

**Lambda DLQ**: Lambda functions (async invocations) can also have their own DLQ — separate from the SQS queue DLQ.`,
    },
    {
      heading: "Polling",
      body: `**Short Polling** (default)
ReceiveMessage returns immediately with 0–10 messages. May return empty responses even if messages exist (sampling across a subset of servers). Wastes API calls; increases cost.

**Long Polling** (recommended)
ReceiveMessage waits up to **20 seconds** (WaitTimeSeconds parameter) for messages to arrive before returning. Eliminates empty responses. Reduces API calls and cost. Enable at queue level (\`ReceiveMessageWaitTimeSeconds\`) or per-request.

**Always use long polling in production.** Lambda event source mapping uses long polling internally.

**Batching**: receive up to **10 messages** per ReceiveMessage call. Process in parallel. Delete with SendMessageBatch (1 API call for up to 10 deletes). Lambda processes up to 10,000 messages per batch (configurable).`,
    },
    {
      heading: "Message Retention & Queue Settings",
      body: `**Message retention period**: how long SQS keeps undelivered messages. Default: **4 days**. Min: 60 seconds. Max: **14 days**. Set longer for critical queues to ensure DLQ inspection window.

**Delivery delay**: delay before message becomes visible after send. Queue default: 0–900s. Per-message override via DelaySeconds.

**Maximum message size**: 256 KB. Use S3 + Extended Client Library for larger messages.

**Encryption**: SSE-SQS (free, managed by SQS) or SSE-KMS (your CMK, audit trail, cross-account). Encrypts message body at rest.

**Access control**: SQS resource-based policy (queue policy) and IAM identity policies. For cross-account access, use queue policy.`,
    },
    {
      heading: "SQS with Lambda",
      body: `Lambda polls SQS via **event source mapping**. Lambda manages the polling loop.

**Configuration**:
- \`BatchSize\`: 1–10,000 messages per invocation.
- \`MaximumBatchingWindowInSeconds\`: wait up to N seconds to accumulate a full batch (0–300s).
- \`FunctionResponseTypes: [ReportBatchItemFailures]\`: return partial batch failures — only failed messages return to queue, successful ones are deleted.

**Concurrency**: Lambda scales up (one concurrent invocation per active message group for FIFO; up to 1,000 for Standard) as backlog grows. With standard queues, Lambda can scale to 1,000 concurrent functions quickly.

**Visibility timeout**: set queue visibility timeout to **6× Lambda timeout** — Lambda retries 3 times internally before returning a message on throttling.

**Error handling**: failed messages return to queue after visibility timeout. After maxReceiveCount, go to DLQ. Use ReportBatchItemFailures to avoid re-processing already-succeeded messages.`,
    },
    {
      heading: "SQS with Other Services",
      body: `**SQS + SNS (Fan-out)**: SNS topic → multiple SQS queues. Each queue gets every message. Decouples publisher from multiple consumers. Queues provide buffering and independent retry.

**SQS + EC2/ECS workers**: worker instances or containers poll SQS for tasks. Scale workers with Auto Scaling based on \`ApproximateNumberOfMessagesVisible\`. Classic work-queue pattern.

**SQS + Lambda**: Lambda scales automatically with queue depth. Zero-capacity when queue is empty (pay nothing). Instant scale-out on traffic spike.

**SQS + EventBridge Pipes**: EventBridge Pipes can use SQS as source, apply filtering and enrichment, then deliver to a target — without Lambda code.

**SQS + API Gateway**: API Gateway writes to SQS directly (AWS Service integration). Client gets immediate 200 response; backend processes asynchronously.`,
    },
  ],

  keyFacts: [
    "Standard: unlimited throughput, at-least-once, best-effort order",
    "FIFO: exactly-once, strict order within group, 300 TPS (3,000 with batching)",
    "Visibility timeout default: 30s; max: 12 hours",
    "Set visibility timeout ≥ 6× Lambda timeout",
    "Long polling: wait up to 20s — eliminates empty responses",
    "Max message size: 256 KB (use S3 Extended Client for larger)",
    "Retention: default 4 days; max 14 days",
    "DLQ must match source queue type (Standard or FIFO)",
    "Lambda batch size: 1–10,000 messages per invocation",
    "ReportBatchItemFailures: partial batch success — only failed items retry",
  ],

  relatedServices: [
    "Amazon SNS",
    "AWS Lambda",
    "Amazon EventBridge",
    "Amazon EC2",
    "Amazon ECS",
    "AWS Step Functions",
    "Amazon API Gateway",
  ],

  examTips: [
    "Visibility timeout expiry → message reappears → duplicate processing. Set ≥ 6× Lambda timeout.",
    "FIFO queue names must end in .fifo; deduplication within 5-minute window.",
    "Long polling (WaitTimeSeconds=20) reduces empty responses and API costs.",
    "DLQ: same type as source, longer retention than source queue.",
    "ReportBatchItemFailures lets Lambda delete successful messages; failed ones retry.",
    "Fan-out pattern: SNS topic → multiple SQS queues (not one queue shared by consumers).",
    "Messages > 256 KB: store in S3, send S3 reference in message (Extended Client Library).",
    "maxReceiveCount on source queue controls when messages go to DLQ.",
  ],
};
