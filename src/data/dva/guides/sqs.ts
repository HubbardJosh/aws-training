import { ServiceGuide } from "../../../types/guide";

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
      body: `SQS offers two queue types that serve fundamentally different use cases. **Standard queues** are designed for maximum throughput — they have no explicit throughput cap and scale to handle virtually any message volume, making them the right choice when raw speed matters more than perfect ordering. The tradeoff is that Standard queues guarantee **at-least-once delivery**, meaning a message may occasionally be delivered more than once due to the distributed nature of the service. Your consumers must be idempotent — processing the same message twice should have no harmful side effect.

**FIFO queues** trade throughput for correctness. They guarantee exactly-once processing by deduplicating messages within a 5-minute window using a \`MessageDeduplicationId\`, and they deliver messages in strict first-in, first-out order within a **MessageGroupId**. This makes FIFO the right choice for financial transactions, order processing, or any workflow where sequence and uniqueness are critical. The default throughput is 300 API calls per second (or 3,000 with batching); enable **High Throughput FIFO mode** for higher limits. Queue names must end in \`.fifo\`.`,
    },
    {
      heading: "Core Message Attributes",
      body: `Every SQS message is built from a few key pieces. The **MessageBody** carries your payload and can be up to **256 KB**. When your data exceeds that limit, the standard approach is to store the content in S3 and send the S3 key as the message body, using the extended client library to manage this transparently.

For FIFO queues, two additional attributes become critical. The **MessageGroupId** groups related messages that must be processed in order — all messages in the same group are processed sequentially and delivered to a single consumer at a time. The **MessageDeduplicationId** prevents duplicate processing: if you send two messages with the same ID within a 5-minute window, the second is silently discarded. You can generate this ID explicitly or let SQS compute it automatically as a SHA-256 hash of the message body.

**MessageAttributes** let you attach typed metadata (String, Number, or Binary values, up to 10 per message) without embedding it in the body — useful for routing decisions and filtering. The **DelaySeconds** attribute postpones delivery of an individual message by up to 900 seconds, overriding the queue's default delay setting.`,
    },
    {
      heading: "Visibility Timeout",
      body: `When a consumer calls \`ReceiveMessage\`, SQS makes the message invisible to other consumers for a configurable period — this is the **visibility timeout**. The consumer must process the message and delete it before the timeout expires, or the message becomes visible again and another consumer may pick it up. This is the mechanism that prevents two consumers from processing the same message simultaneously, but it also means duplicate processing is possible if your consumer crashes mid-work.

The default visibility timeout is **30 seconds**, and the maximum is 12 hours. You set it at the queue level, but you can also override it per-message at the time of receipt. If processing is taking longer than expected, you can call \`ChangeMessageVisibility\` to extend the timeout before it expires — this is essential for long-running tasks.

When integrating with Lambda, set the queue's visibility timeout to at least **6× the Lambda function timeout**. Lambda may retry an invocation up to 3 times on throttle before returning the message to the queue, and if the visibility timeout is too short, the message becomes visible before Lambda finishes, causing a duplicate delivery. Always design your message processors to be idempotent — assume a message may be processed more than once.`,
    },
    {
      heading: "Dead Letter Queues (DLQ)",
      body: `A **Dead Letter Queue** captures messages that have failed processing too many times. You configure this through a **redrive policy** on the source queue, specifying the DLQ ARN and a \`maxReceiveCount\` between 1 and 1,000. When a message has been received that many times without being deleted, SQS automatically moves it to the DLQ.

The DLQ must be the same type as its source — a Standard source needs a Standard DLQ, and a FIFO source needs a FIFO DLQ. You should also set the DLQ's retention period longer than the source queue's retention period, giving you enough time to inspect failed messages after fixing the underlying bug.

Once you've corrected the processing logic, you can replay failed messages back to the source queue using the **DLQ Redrive** feature (available in the console or via the \`StartMessageMoveTask\` API). For monitoring, create a CloudWatch alarm on the DLQ's \`ApproximateNumberOfMessagesVisible\` metric so you're notified the moment messages start failing. Lambda functions invoked asynchronously can also have their own DLQ, which is separate from the SQS queue's DLQ.`,
    },
    {
      heading: "Polling",
      body: `SQS supports two polling modes, and the choice between them has real cost and performance implications. **Short polling** (the default) returns immediately with whatever messages are available at the moment, sampling only a subset of SQS servers. This means you can get empty responses even when messages exist, and each empty response still costs you an API call.

**Long polling** is almost always the better choice. By setting \`WaitTimeSeconds\` to up to 20 seconds, SQS will hold the connection open and wait until messages are available before responding. This eliminates empty responses, reduces the total number of API calls, and lowers your bill. You can enable long polling at the queue level via \`ReceiveMessageWaitTimeSeconds\`, or per-request. Lambda event source mappings use long polling internally.

For throughput, always use batching. A single \`ReceiveMessage\` call can return up to 10 messages, and \`DeleteMessageBatch\` can delete 10 messages in one API call. When Lambda processes SQS, it can handle up to 10,000 messages per batch (configurable), making batch processing essential at scale.`,
    },
    {
      heading: "Message Retention & Queue Settings",
      body: `SQS retains undelivered messages for a configurable period. The default is **4 days**, the minimum is 60 seconds, and the maximum is **14 days**. For critical queues where you want a wide inspection window in the DLQ, set retention to the maximum. Once the retention period expires, SQS permanently deletes the message.

You can delay all new messages by default (0–900 seconds) using the queue's delivery delay setting, and individual messages can override this with their own \`DelaySeconds\` attribute. The maximum message size is 256 KB — beyond that, you must use the S3 Extended Client Library.

For encryption, SQS offers two options. **SSE-SQS** uses SQS-managed keys and is free. **SSE-KMS** uses your own Customer Managed Key, adding an audit trail in CloudTrail and enabling cross-account key sharing at additional cost. Only the message body is encrypted at rest — metadata like message attributes are not. Access control is handled through SQS resource-based queue policies (for cross-account access) and standard IAM identity policies.`,
    },
    {
      heading: "SQS with Lambda",
      body: `Lambda consumes SQS messages through an **event source mapping** — Lambda manages the polling loop entirely, so you don't write any polling code. You configure the behavior through three key settings: \`BatchSize\` controls how many messages Lambda receives per invocation (1–10,000), \`MaximumBatchingWindowInSeconds\` tells Lambda to wait up to N seconds to accumulate a full batch before invoking (0–300s), and \`FunctionResponseTypes: [ReportBatchItemFailures]\` enables partial batch success.

The partial batch failure pattern is important to understand. Without it, if any message in a batch fails, the entire batch returns to the queue and every message gets retried — including ones that succeeded. With \`ReportBatchItemFailures\`, your Lambda function returns a list of failed message IDs, and SQS only retries those specific messages. The successfully processed ones are deleted. This prevents unnecessary reprocessing at scale.

For concurrency, Lambda scales aggressively with Standard queues — it can reach 1,000 concurrent invocations as backlog grows. FIFO queues are more constrained: Lambda creates one concurrent invocation per active message group. Always set the queue's visibility timeout to at least **6× the Lambda function timeout** to prevent messages from becoming visible while Lambda is still processing them.`,
    },
    {
      heading: "SQS with Other Services",
      body: `The most important SQS integration pattern is **fan-out**: an SNS topic delivers a copy of each message to multiple SQS queues simultaneously. Each queue gets every message, and each downstream consumer operates independently — processing at its own pace, with its own DLQ and retry settings. This decouples a single publisher from multiple consumers without them knowing about each other.

For worker-based architectures, EC2 or ECS workers poll SQS for tasks and scale with Auto Scaling based on the \`ApproximateNumberOfMessagesVisible\` metric. This is the classic work-queue pattern — the queue absorbs traffic spikes while workers drain it at a controlled rate.

SQS also integrates directly with API Gateway using an AWS Service integration. API Gateway writes the client's request directly to an SQS queue and returns HTTP 200 immediately, while the backend processes the message asynchronously. This is useful for accepting high-volume writes without blocking the HTTP connection. EventBridge Pipes can use SQS as a source, applying filtering and enrichment before delivering to a target — a code-free alternative to a polling Lambda.`,
    },
  ],

  keyFacts: [
    "Standard: no explicit throughput cap (nearly unlimited scale), at-least-once, best-effort order",
    "FIFO: exactly-once, strict order within group, 300 TPS default (3,000 with batching); High Throughput mode available",
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
