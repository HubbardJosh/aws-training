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
      quiz: [
        {
          question:
            "A payment processing system requires that each transaction is processed exactly once and in strict order. Which SQS queue type should be used?",
          options: [
            "Standard queue with idempotent consumers",
            "Standard queue with deduplication enabled",
            "FIFO queue",
            "Standard queue with High Throughput mode",
          ],
          correctIndex: 2,
          explanation:
            "FIFO queues guarantee exactly-once processing (deduplication within a 5-minute window) and strict first-in, first-out ordering within a MessageGroupId. Standard queues provide at-least-once delivery with best-effort ordering, making them unsuitable for payment processing where duplicates and out-of-order delivery are unacceptable.",
        },
        {
          question:
            "A Standard SQS queue occasionally delivers the same message more than once. What must consumers implement to handle this correctly?",
          options: [
            "Message deduplication using MessageDeduplicationId",
            "Idempotent message processing so duplicate delivery has no harmful side effect",
            "Visibility timeout extension to prevent redelivery",
            "A Dead Letter Queue to catch duplicate messages",
          ],
          correctIndex: 1,
          explanation:
            "Standard queues guarantee at-least-once delivery — a message may be delivered more than once. Consumers must be idempotent, meaning processing the same message twice produces the same result with no harmful side effects. This is a fundamental design requirement for Standard queue consumers.",
        },
        {
          question: "What is the naming requirement for SQS FIFO queues?",
          options: [
            "Queue name must start with 'fifo-'",
            "Queue name must end in '.fifo'",
            "Queue name must be all uppercase",
            "Queue name must include the region code",
          ],
          correctIndex: 1,
          explanation:
            "SQS FIFO queue names must end in '.fifo' (e.g., 'payments.fifo'). This is a hard requirement — queue creation will fail if the name does not end with this suffix.",
        },
      ],
    },
    {
      heading: "Core Message Attributes",
      body: `Every SQS message is built from a few key pieces. The **MessageBody** carries your payload and can be up to **256 KB**. When your data exceeds that limit, the standard approach is to store the content in S3 and send the S3 key as the message body, using the extended client library to manage this transparently.

For FIFO queues, two additional attributes become critical. The **MessageGroupId** groups related messages that must be processed in order — all messages in the same group are processed sequentially and delivered to a single consumer at a time. The **MessageDeduplicationId** prevents duplicate processing: if you send two messages with the same ID within a 5-minute window, the second is silently discarded. You can generate this ID explicitly or let SQS compute it automatically as a SHA-256 hash of the message body.

**MessageAttributes** let you attach typed metadata (String, Number, or Binary values, up to 10 per message) without embedding it in the body — useful for routing decisions and filtering. The **DelaySeconds** attribute postpones delivery of an individual message by up to 900 seconds, overriding the queue's default delay setting.`,
      quiz: [
        {
          question:
            "An SQS message payload is 500 KB, exceeding the 256 KB limit. What is the standard approach?",
          options: [
            "Split the message into two separate SQS messages",
            "Use SQS Extended Client Library: store content in S3, send the S3 reference as the message body",
            "Enable SQS compression to reduce message size",
            "Use a FIFO queue which supports larger message sizes",
          ],
          correctIndex: 1,
          explanation:
            "When a message payload exceeds 256 KB, the standard pattern is to store the large content in S3 and include the S3 key as the SQS message body. The SQS Extended Client Library manages this transparently, handling the S3 upload and download automatically.",
        },
        {
          question:
            "In an SQS FIFO queue, what happens if two messages with the same MessageDeduplicationId are sent within a 5-minute window?",
          options: [
            "Both messages are delivered; the consumer must deduplicate",
            "The second message is silently discarded",
            "The second message overwrites the first",
            "Both messages are held in a DLQ for review",
          ],
          correctIndex: 1,
          explanation:
            "FIFO queues deduplicate messages within a 5-minute window using the MessageDeduplicationId. If a second message with the same ID is sent within that window, it is silently discarded — guaranteeing exactly-once delivery without the consumer needing to handle duplicates.",
        },
        {
          question:
            "A developer wants to delay delivery of a specific SQS message by 10 minutes without changing the queue's default delay. What attribute should be set on the message?",
          options: [
            "VisibilityTimeout on the message",
            "MessageRetentionPeriod on the message",
            "DelaySeconds on the message (up to 900 seconds)",
            "WaitTimeSeconds on the ReceiveMessage call",
          ],
          correctIndex: 2,
          explanation:
            "The DelaySeconds attribute on an individual message postpones its delivery by up to 900 seconds (15 minutes), overriding the queue's default delay setting. VisibilityTimeout controls how long a received message is hidden, not when it becomes available.",
        },
      ],
    },
    {
      heading: "Visibility Timeout",
      body: `When a consumer calls \`ReceiveMessage\`, SQS makes the message invisible to other consumers for a configurable period — this is the **visibility timeout**. The consumer must process the message and delete it before the timeout expires, or the message becomes visible again and another consumer may pick it up. This is the mechanism that prevents two consumers from processing the same message simultaneously, but it also means duplicate processing is possible if your consumer crashes mid-work.

The default visibility timeout is **30 seconds**, and the maximum is 12 hours. You set it at the queue level, but you can also override it per-message at the time of receipt. If processing is taking longer than expected, you can call \`ChangeMessageVisibility\` to extend the timeout before it expires — this is essential for long-running tasks.

When integrating with Lambda, set the queue's visibility timeout to at least **6× the Lambda function timeout**. Lambda may retry an invocation up to 3 times on throttle before returning the message to the queue, and if the visibility timeout is too short, the message becomes visible before Lambda finishes, causing a duplicate delivery. Always design your message processors to be idempotent — assume a message may be processed more than once.`,
      quiz: [
        {
          question:
            "A Lambda function with a 30-second timeout processes messages from an SQS queue. What should the queue's visibility timeout be set to at minimum?",
          options: [
            "30 seconds (equal to the Lambda timeout)",
            "60 seconds (2× the Lambda timeout)",
            "180 seconds (6× the Lambda timeout)",
            "12 hours (the maximum visibility timeout)",
          ],
          correctIndex: 2,
          explanation:
            "The SQS visibility timeout should be set to at least 6× the Lambda function timeout. Lambda may retry an invocation up to 3 times on throttle, and if the visibility timeout expires before Lambda finishes, the message becomes visible again causing duplicate processing. For a 30-second Lambda timeout, that means at least 180 seconds.",
        },
        {
          question:
            "A consumer is processing an SQS message that is taking longer than expected and the visibility timeout is about to expire. What should the consumer do?",
          options: [
            "Delete the message and requeue it manually",
            "Call ChangeMessageVisibility to extend the timeout before it expires",
            "Increase the queue's default visibility timeout",
            "Move the message to the DLQ to prevent duplicate processing",
          ],
          correctIndex: 1,
          explanation:
            "ChangeMessageVisibility extends the visibility timeout for an in-flight message before it expires. This is essential for long-running tasks — if the timeout expires, the message becomes visible to other consumers, causing duplicate delivery.",
        },
        {
          question:
            "What happens to an SQS message if a consumer receives it but crashes before deleting it, and the visibility timeout expires?",
          options: [
            "The message is permanently deleted",
            "The message is moved to the DLQ immediately",
            "The message becomes visible again and another consumer may pick it up",
            "The message is returned to the front of the queue in priority order",
          ],
          correctIndex: 2,
          explanation:
            "When the visibility timeout expires, SQS makes the message visible again to other consumers. This is why consumers must be idempotent — the same message may be processed more than once if a consumer fails mid-processing.",
        },
      ],
    },
    {
      heading: "Dead Letter Queues (DLQ)",
      body: `A **Dead Letter Queue** captures messages that have failed processing too many times. You configure this through a **redrive policy** on the source queue, specifying the DLQ ARN and a \`maxReceiveCount\` between 1 and 1,000. When a message has been received that many times without being deleted, SQS automatically moves it to the DLQ.

The DLQ must be the same type as its source — a Standard source needs a Standard DLQ, and a FIFO source needs a FIFO DLQ. You should also set the DLQ's retention period longer than the source queue's retention period, giving you enough time to inspect failed messages after fixing the underlying bug.

Once you've corrected the processing logic, you can replay failed messages back to the source queue using the **DLQ Redrive** feature (available in the console or via the \`StartMessageMoveTask\` API). For monitoring, create a CloudWatch alarm on the DLQ's \`ApproximateNumberOfMessagesVisible\` metric so you're notified the moment messages start failing. Lambda functions invoked asynchronously can also have their own DLQ, which is separate from the SQS queue's DLQ.`,
      quiz: [
        {
          question:
            "A source SQS FIFO queue has a redrive policy configured. What type of queue must the Dead Letter Queue be?",
          options: [
            "Standard queue for maximum throughput",
            "FIFO queue matching the source queue type",
            "Any queue type — DLQ type does not need to match",
            "A Standard queue with deduplication enabled",
          ],
          correctIndex: 1,
          explanation:
            "The DLQ must be the same type as the source queue. A FIFO source queue requires a FIFO DLQ, and a Standard source queue requires a Standard DLQ. Mismatched queue types will cause the redrive policy configuration to fail.",
        },
        {
          question:
            "The engineering team fixed a bug causing SQS messages to fail. How can they reprocess messages that are currently in the DLQ?",
          options: [
            "Manually read each message from the DLQ and publish it to the source queue",
            "Delete and recreate the source queue to trigger reprocessing",
            "Use the DLQ Redrive feature (StartMessageMoveTask API) to replay messages to the source queue",
            "Set maxReceiveCount to 0 to force messages back",
          ],
          correctIndex: 2,
          explanation:
            "The DLQ Redrive feature (available in the console or via the StartMessageMoveTask API) replays failed messages from the DLQ back to the source queue after the underlying bug has been fixed. This avoids manually re-publishing each message.",
        },
        {
          question:
            "What metric should a CloudWatch alarm monitor to detect when messages are consistently failing SQS processing?",
          options: [
            "NumberOfMessagesSent on the source queue",
            "ApproximateNumberOfMessagesVisible on the DLQ",
            "NumberOfMessagesDeleted on the source queue",
            "ApproximateAgeOfOldestMessage on the source queue",
          ],
          correctIndex: 1,
          explanation:
            "A CloudWatch alarm on ApproximateNumberOfMessagesVisible for the DLQ detects the moment failed messages start accumulating. This gives immediate visibility into processing failures without having to poll the queue manually.",
        },
      ],
    },
    {
      heading: "Polling",
      body: `SQS supports two polling modes, and the choice between them has real cost and performance implications. **Short polling** (the default) returns immediately with whatever messages are available at the moment, sampling only a subset of SQS servers. This means you can get empty responses even when messages exist, and each empty response still costs you an API call.

**Long polling** is almost always the better choice. By setting \`WaitTimeSeconds\` to up to 20 seconds, SQS will hold the connection open and wait until messages are available before responding. This eliminates empty responses, reduces the total number of API calls, and lowers your bill. You can enable long polling at the queue level via \`ReceiveMessageWaitTimeSeconds\`, or per-request. Lambda event source mappings use long polling internally.

For throughput, always use batching. A single \`ReceiveMessage\` call can return up to 10 messages, and \`DeleteMessageBatch\` can delete 10 messages in one API call. When Lambda processes SQS, it can handle up to 10,000 messages per batch (configurable), making batch processing essential at scale.`,
      quiz: [
        {
          question:
            "A consumer is receiving many empty responses from SQS even though messages exist in the queue, and API costs are high. What is the best fix?",
          options: [
            "Switch from Standard to FIFO queue",
            "Enable long polling by setting WaitTimeSeconds to up to 20 seconds",
            "Increase the message retention period",
            "Reduce the visibility timeout",
          ],
          correctIndex: 1,
          explanation:
            "Short polling (the default) samples only a subset of SQS servers and returns immediately, causing empty responses even when messages exist. Long polling (WaitTimeSeconds up to 20 seconds) holds the connection open until messages are available, eliminating empty responses and reducing API call costs.",
        },
        {
          question:
            "What is the maximum number of messages a single SQS ReceiveMessage call can return?",
          options: ["1", "5", "10", "100"],
          correctIndex: 2,
          explanation:
            "A single ReceiveMessage API call can return up to 10 messages. For Lambda event source mappings, the batch size is configurable up to 10,000 messages per invocation, but the individual ReceiveMessage API call is capped at 10.",
        },
        {
          question:
            "How does Lambda internally poll SQS when configured as an event source mapping?",
          options: [
            "Short polling, checking every second",
            "Long polling, internally managed by Lambda",
            "Webhook-based push from SQS to Lambda",
            "Event-driven polling using CloudWatch Events",
          ],
          correctIndex: 1,
          explanation:
            "Lambda event source mappings use long polling internally to poll SQS. Lambda manages the polling loop entirely — you do not write any polling code. Long polling reduces empty responses and API costs automatically.",
        },
      ],
    },
    {
      heading: "Message Retention & Queue Settings",
      body: `SQS retains undelivered messages for a configurable period. The default is **4 days**, the minimum is 60 seconds, and the maximum is **14 days**. For critical queues where you want a wide inspection window in the DLQ, set retention to the maximum. Once the retention period expires, SQS permanently deletes the message.

You can delay all new messages by default (0–900 seconds) using the queue's delivery delay setting, and individual messages can override this with their own \`DelaySeconds\` attribute. The maximum message size is 256 KB — beyond that, you must use the S3 Extended Client Library.

For encryption, SQS offers two options. **SSE-SQS** uses SQS-managed keys and is free. **SSE-KMS** uses your own Customer Managed Key, adding an audit trail in CloudTrail and enabling cross-account key sharing at additional cost. Only the message body is encrypted at rest — metadata like message attributes are not. Access control is handled through SQS resource-based queue policies (for cross-account access) and standard IAM identity policies.`,
      quiz: [
        {
          question:
            "What is the maximum message retention period for an SQS queue?",
          options: ["4 days", "7 days", "14 days", "30 days"],
          correctIndex: 2,
          explanation:
            "SQS supports a maximum message retention period of 14 days. The default is 4 days and the minimum is 60 seconds. For DLQs, it is best practice to set retention longer than the source queue to allow time to inspect failed messages.",
        },
        {
          question:
            "Which parts of an SQS message are encrypted at rest when SSE is enabled?",
          options: [
            "The message body and all message attributes",
            "Only the message body — message attributes are not encrypted",
            "Only message attributes — the body is stored in plaintext",
            "The entire message including metadata and timestamps",
          ],
          correctIndex: 1,
          explanation:
            "SQS SSE encrypts only the message body at rest. Message attributes (metadata) are not encrypted. This is an important distinction when deciding what sensitive data to include in attributes versus the message body.",
        },
        {
          question:
            "An application in Account B needs to send messages to an SQS queue owned by Account A. What is required to enable this cross-account access?",
          options: [
            "Only an IAM policy in Account B granting sqs:SendMessage",
            "Only a queue resource policy in Account A allowing Account B",
            "A queue resource policy in Account A AND an IAM policy in Account B",
            "An SNS topic subscription bridging the two accounts",
          ],
          correctIndex: 2,
          explanation:
            "Cross-account SQS access requires both: a resource-based queue policy in Account A explicitly allowing Account B's principal, and an IAM identity policy in Account B granting the relevant sqs: actions. Both must allow the access for the request to succeed.",
        },
      ],
    },
    {
      heading: "SQS with Lambda",
      body: `Lambda consumes SQS messages through an **event source mapping** — Lambda manages the polling loop entirely, so you don't write any polling code. You configure the behavior through three key settings: \`BatchSize\` controls how many messages Lambda receives per invocation (1–10,000), \`MaximumBatchingWindowInSeconds\` tells Lambda to wait up to N seconds to accumulate a full batch before invoking (0–300s), and \`FunctionResponseTypes: [ReportBatchItemFailures]\` enables partial batch success.

The partial batch failure pattern is important to understand. Without it, if any message in a batch fails, the entire batch returns to the queue and every message gets retried — including ones that succeeded. With \`ReportBatchItemFailures\`, your Lambda function returns a list of failed message IDs, and SQS only retries those specific messages. The successfully processed ones are deleted. This prevents unnecessary reprocessing at scale.

For concurrency, Lambda scales aggressively with Standard queues — it can reach 1,000 concurrent invocations as backlog grows. FIFO queues are more constrained: Lambda creates one concurrent invocation per active message group. Always set the queue's visibility timeout to at least **6× the Lambda function timeout** to prevent messages from becoming visible while Lambda is still processing them.`,
      quiz: [
        {
          question:
            "A Lambda function processes a batch of 10 SQS messages. One message fails. Without ReportBatchItemFailures configured, what happens?",
          options: [
            "Only the failed message is retried; successful ones are deleted",
            "The entire batch of 10 messages returns to the queue and all are retried",
            "The failed message is moved to the DLQ immediately",
            "Lambda retries only the failed message up to 3 times automatically",
          ],
          correctIndex: 1,
          explanation:
            "Without ReportBatchItemFailures, SQS treats the batch as an atomic unit. If any message fails, the entire batch is returned to the queue and all messages — including ones that succeeded — are retried. This causes unnecessary duplicate processing of successful messages.",
        },
        {
          question:
            "What does enabling FunctionResponseTypes: [ReportBatchItemFailures] on an SQS event source mapping allow Lambda to do?",
          options: [
            "Retry failed messages indefinitely without sending them to the DLQ",
            "Return a list of failed message IDs so only those messages are retried while successful ones are deleted",
            "Automatically move failed messages to a DLQ without consumer code",
            "Process messages in strict FIFO order even on Standard queues",
          ],
          correctIndex: 1,
          explanation:
            "ReportBatchItemFailures enables partial batch success. The Lambda function returns a list of failed message IDs, and SQS retries only those specific messages. Successfully processed messages are deleted, preventing unnecessary reprocessing at scale.",
        },
        {
          question:
            "Lambda is processing messages from an SQS FIFO queue. How does Lambda control concurrency for FIFO queues?",
          options: [
            "Lambda scales to 1,000 concurrent invocations as with Standard queues",
            "Lambda creates one concurrent invocation per active message group (MessageGroupId)",
            "FIFO queues limit Lambda to a single concurrent invocation",
            "Lambda does not support FIFO queues as event sources",
          ],
          correctIndex: 1,
          explanation:
            "For FIFO queues, Lambda creates one concurrent invocation per active MessageGroupId to preserve ordering within each group. Standard queues allow Lambda to scale aggressively up to 1,000 concurrent invocations as backlog grows.",
        },
      ],
    },
    {
      heading: "SQS with Other Services",
      body: `The most important SQS integration pattern is **fan-out**: an SNS topic delivers a copy of each message to multiple SQS queues simultaneously. Each queue gets every message, and each downstream consumer operates independently — processing at its own pace, with its own DLQ and retry settings. This decouples a single publisher from multiple consumers without them knowing about each other.

For worker-based architectures, EC2 or ECS workers poll SQS for tasks and scale with Auto Scaling based on the \`ApproximateNumberOfMessagesVisible\` metric. This is the classic work-queue pattern — the queue absorbs traffic spikes while workers drain it at a controlled rate.

SQS also integrates directly with API Gateway using an AWS Service integration. API Gateway writes the client's request directly to an SQS queue and returns HTTP 200 immediately, while the backend processes the message asynchronously. This is useful for accepting high-volume writes without blocking the HTTP connection. EventBridge Pipes can use SQS as a source, applying filtering and enrichment before delivering to a target — a code-free alternative to a polling Lambda.`,
      quiz: [
        {
          question:
            "An EC2 Auto Scaling group needs to scale based on how many messages are waiting in an SQS queue. Which CloudWatch metric should the scaling policy use?",
          options: [
            "NumberOfMessagesSent",
            "NumberOfMessagesDeleted",
            "ApproximateNumberOfMessagesVisible",
            "ApproximateAgeOfOldestMessage",
          ],
          correctIndex: 2,
          explanation:
            "ApproximateNumberOfMessagesVisible represents the number of messages available in the queue waiting to be processed. Auto Scaling policies use this metric to scale EC2 or ECS workers up as the backlog grows and down as it drains.",
        },
        {
          question:
            "An API must accept high-volume write requests without blocking HTTP connections while a backend processes them asynchronously. Which integration pattern achieves this?",
          options: [
            "API Gateway → Lambda → SQS (Lambda enqueues the message)",
            "API Gateway → SQS direct AWS Service integration (returns HTTP 200 immediately)",
            "API Gateway → SNS → SQS → Lambda",
            "API Gateway → Kinesis → SQS → backend",
          ],
          correctIndex: 1,
          explanation:
            "API Gateway supports a direct AWS Service integration with SQS. The client's request is written directly to SQS and API Gateway returns HTTP 200 immediately, without waiting for backend processing. This is more efficient than routing through Lambda just to enqueue a message.",
        },
        {
          question:
            "In the SNS fan-out pattern, what does each subscribed SQS queue receive?",
          options: [
            "A round-robin share of messages from the SNS topic",
            "A full copy of every message published to the SNS topic",
            "Only messages that match its subscription filter policy",
            "Messages only when other queues are at capacity",
          ],
          correctIndex: 1,
          explanation:
            "In the SNS fan-out pattern, every subscribed SQS queue receives a full copy of every message published to the SNS topic (subject to any filter policies). This is what makes fan-out different from a shared queue — each consumer gets its own independent copy rather than competing for messages.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "Which SQS queue type guarantees exactly-once processing and strict message ordering?",
      options: [
        "Standard queue with idempotent consumers",
        "Standard queue with High Throughput mode",
        "FIFO queue",
        "Standard queue with deduplication IDs",
      ],
      correctIndex: 2,
      explanation:
        "FIFO queues guarantee exactly-once processing (deduplication within a 5-minute window using MessageDeduplicationId) and strict FIFO ordering within a MessageGroupId. Standard queues provide at-least-once delivery with best-effort ordering.",
    },
    {
      question:
        "A Lambda function has a 60-second timeout and reads from an SQS queue. What is the minimum recommended visibility timeout for the queue?",
      options: ["60 seconds", "120 seconds", "360 seconds", "720 seconds"],
      correctIndex: 2,
      explanation:
        "The visibility timeout should be at least 6× the Lambda function timeout to account for Lambda retrying the invocation up to 3 times on throttle. For a 60-second Lambda timeout, the minimum is 360 seconds (6 minutes).",
    },
    {
      question: "What is the maximum SQS message retention period?",
      options: ["4 days", "7 days", "14 days", "30 days"],
      correctIndex: 2,
      explanation:
        "SQS supports a maximum retention period of 14 days. The default is 4 days. DLQs should be configured with a longer retention than their source queue to allow time for investigation after a bug fix.",
    },
    {
      question:
        "A batch of 10 SQS messages is processed by Lambda. Three messages fail. With ReportBatchItemFailures enabled, what happens to the 7 successful messages?",
      options: [
        "All 10 messages return to the queue and are retried",
        "All 10 messages are deleted regardless of failure",
        "The 7 successful messages are deleted; only the 3 failed ones are retried",
        "The 3 failed messages go to the DLQ immediately",
      ],
      correctIndex: 2,
      explanation:
        "ReportBatchItemFailures enables partial batch success. Lambda returns the IDs of the 3 failed messages, and SQS retries only those. The 7 successfully processed messages are deleted, preventing unnecessary reprocessing.",
    },
    {
      question:
        "A consumer is receiving many empty ReceiveMessage responses from SQS despite messages being in the queue. What is the most cost-effective fix?",
      options: [
        "Increase the message retention period",
        "Switch to a FIFO queue",
        "Enable long polling by setting WaitTimeSeconds to up to 20 seconds",
        "Reduce the visibility timeout",
      ],
      correctIndex: 2,
      explanation:
        "Short polling (the default) samples a subset of SQS servers and returns immediately, causing empty responses even when messages exist. Long polling holds the connection open until messages arrive, eliminating empty responses and reducing API call costs.",
    },
    {
      question:
        "An SQS message exceeds the 256 KB size limit. What is the correct handling approach?",
      options: [
        "Use FIFO queue which supports larger messages",
        "Enable SQS compression in the queue settings",
        "Store the payload in S3 and send the S3 reference using the Extended Client Library",
        "Split the message across multiple SQS messages",
      ],
      correctIndex: 2,
      explanation:
        "The SQS Extended Client Library stores the large payload in S3 and includes the S3 object reference in the SQS message body. The consumer retrieves the S3 object using the reference. This is the standard pattern for messages exceeding 256 KB.",
    },
    {
      question:
        "A Standard SQS queue has a maxReceiveCount of 3 in its redrive policy. After how many failed receive attempts is a message moved to the DLQ?",
      options: [
        "After 1 receive",
        "After 2 receives",
        "After 3 receives",
        "After 4 receives",
      ],
      correctIndex: 2,
      explanation:
        "The maxReceiveCount defines how many times a message can be received before SQS moves it to the DLQ. With maxReceiveCount of 3, the message is moved to the DLQ after it has been received 3 times without being successfully deleted.",
    },
    {
      question: "What type of DLQ must be configured for a FIFO source queue?",
      options: [
        "Standard DLQ for maximum throughput",
        "FIFO DLQ matching the source queue type",
        "Any queue type — DLQ type is independent of source",
        "A Standard DLQ with deduplication enabled",
      ],
      correctIndex: 1,
      explanation:
        "The DLQ must be the same type as the source queue. A FIFO source queue requires a FIFO DLQ. Mismatched types will cause redrive policy configuration to fail.",
    },
  ],
};
