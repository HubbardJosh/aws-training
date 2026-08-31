import { ServiceGuide } from "../../../types/guide";

export const sqsGuide: ServiceGuide = {
  id: "saa-sqs",
  service: "Amazon SQS",
  domain: "applications",
  tagline:
    "Fully managed message queues for decoupling distributed application components",
  intro:
    "Amazon Simple Queue Service (SQS) provides fully managed message queuing that decouples and scales microservices, distributed systems, and serverless applications by buffering messages between producers and consumers, absorbing traffic bursts and preventing cascading failures.",

  sections: [
    {
      heading: "Standard vs. FIFO Queues",
      body: `SQS offers two queue types with different delivery guarantees. Standard queues provide maximum throughput (nearly unlimited transactions per second), at-least-once delivery, and best-effort ordering — messages may occasionally be delivered more than once or out of order, so consumers must be idempotent. Standard queues are appropriate for high-throughput workloads where the application can handle duplicate processing, such as image thumbnail generation, email sending, and log aggregation. FIFO (First-In, First-Out) queues guarantee exactly-once processing and strict ordering within a message group. FIFO queues support up to 300 transactions per second by default (or 3,000 with batching; High Throughput FIFO mode removes these limits) and require a MessageGroupId to determine ordering within the queue — messages with the same MessageGroupId are processed in strict order, while messages with different group IDs are processed independently. FIFO queues are appropriate for financial transactions, order processing, and any workflow where processing order is critical and duplicates are unacceptable.`,
      quiz: [
        {
          question:
            "An application processes financial transactions where duplicate processing or out-of-order execution would cause incorrect account balances. Which SQS queue type is required?",
          options: [
            "Standard queue with high throughput mode enabled",
            "FIFO queue with exactly-once processing and strict ordering",
            "Standard queue with a deduplication Lambda function",
            "Standard queue with idempotent consumers",
          ],
          correctIndex: 1,
          explanation:
            "FIFO queues guarantee exactly-once processing and strict ordering within a message group. For financial transactions where duplicates and out-of-order processing would cause incorrect balances, FIFO queues are required. Standard queues use at-least-once delivery with best-effort ordering, which is unsuitable for this use case.",
        },
        {
          question:
            "A high-throughput image thumbnail generation service processes millions of images per day. Occasional duplicate processing is acceptable as long as throughput is maximized. Which SQS queue type is most appropriate?",
          options: [
            "FIFO queue with High Throughput mode",
            "FIFO queue for guaranteed delivery",
            "Standard queue for maximum throughput",
            "Standard queue with a DLQ for duplicates",
          ],
          correctIndex: 2,
          explanation:
            "Standard queues support nearly unlimited throughput with at-least-once delivery. For image thumbnail generation, duplicate processing is harmless (idempotent operation — the same thumbnail can be generated twice without corruption), making Standard queues the right choice to maximize throughput. FIFO queues have throughput limits that would constrain a high-volume workload.",
        },
        {
          question:
            "What does the MessageGroupId attribute control in an SQS FIFO queue?",
          options: [
            "It defines ordering — messages with the same MessageGroupId are processed in strict order",
            "It controls message visibility timeout per group of messages",
            "It groups messages for batch processing regardless of ordering",
            "It determines which DLQ receives failed messages from the group",
          ],
          correctIndex: 0,
          explanation:
            "In SQS FIFO queues, the MessageGroupId determines ordering: messages with the same MessageGroupId are delivered and processed in the exact order they were sent. Messages with different MessageGroupIds can be processed in parallel and independently. This enables ordering within a specific entity (e.g., all orders for customer ID 123) while allowing parallelism across entities.",
        },
      ],
    },
    {
      heading: "Visibility Timeout and Message Lifecycle",
      body: `When a consumer retrieves a message from SQS (a receive operation), SQS makes the message invisible to other consumers for a configurable Visibility Timeout period — the consumer has this window to process the message and delete it before SQS makes it visible again for redelivery. If the consumer fails to delete the message within the timeout (due to a crash, timeout, or processing error), SQS automatically makes the message visible again for another consumer to attempt, providing automatic retry behavior. The visibility timeout should be set to at least the maximum expected processing time — if processing typically takes 30 seconds but occasionally takes 5 minutes, set the timeout to at least 5 minutes. Consumers can extend the visibility timeout programmatically (ChangeMessageVisibility) while processing long-running tasks. Messages have a maximum retention period of 14 days; if not consumed within the retention period, messages are automatically deleted. The Message Retention Period should be set long enough to survive planned outages and consumer deployments.`,
      quiz: [
        {
          question:
            "A Lambda function is processing SQS messages with a visibility timeout of 30 seconds, but some messages take up to 3 minutes to process. What is the consequence, and how should it be fixed?",
          options: [
            "Consequence: Lambda times out; Fix: increase Lambda timeout",
            "Consequence: messages are lost; Fix: enable long polling",
            "Consequence: messages are moved to the DLQ; Fix: increase maxReceiveCount",
            "Consequence: messages are duplicated; Fix: increase visibility timeout to at least 3 minutes",
          ],
          correctIndex: 3,
          explanation:
            "When the visibility timeout (30s) is shorter than the actual processing time (3 min), SQS makes the message visible again before the consumer finishes processing. Another consumer picks it up and processes it again — causing duplicate processing. The fix is to set the visibility timeout to at least the maximum expected processing time (3+ minutes).",
        },
        {
          question:
            "What is the maximum message retention period for Amazon SQS?",
          options: ["14 days", "30 days", "4 days", "1 day"],
          correctIndex: 0,
          explanation:
            "The maximum message retention period for SQS is 14 days. The default is 4 days. Messages not consumed within the retention period are automatically deleted. The retention period should be set long enough to survive planned outages and consumer deployments without losing messages.",
        },
      ],
    },
    {
      heading: "Dead Letter Queues",
      body: `A Dead Letter Queue (DLQ) is a separate SQS queue that receives messages that fail to be processed successfully after a configurable number of receive attempts (the maxReceiveCount). When a message exceeds its maxReceiveCount, SQS automatically moves it to the DLQ, preventing poison-pill messages from indefinitely blocking consumers and exhausting resources on retries. DLQs enable debugging and alerting on failed messages — you can inspect DLQ messages to understand why processing failed, fix the bug, and replay messages back to the source queue using SQS DLQ Redrive. A CloudWatch alarm on the DLQ's ApproximateNumberOfMessagesVisible metric provides automated alerting when messages begin accumulating, indicating a consumer-side problem. DLQs and their source queues must be of the same type — FIFO queues must use FIFO DLQs, and standard queues must use standard DLQs. Lambda functions with SQS event source mapping have their own retry and DLQ configuration separate from the SQS queue's DLQ.`,
      quiz: [
        {
          question:
            "A specific SQS message consistently fails processing and causes the consumer to crash. Each time it reappears, the consumer crashes again. How does the DLQ solve this?",
          options: [
            "The DLQ deletes poison-pill messages automatically",
            "After exceeding the maxReceiveCount, SQS moves the message to the DLQ, preventing it from blocking the main queue",
            "The DLQ quarantines the message until the consumer is patched",
            "The DLQ retries the message with a different consumer type",
          ],
          correctIndex: 1,
          explanation:
            "A DLQ solves the poison-pill problem by moving messages that exceed the maxReceiveCount to a separate queue. Once in the DLQ, the problematic message no longer appears in the main queue, allowing other messages to be processed normally. Engineers can then inspect the DLQ message to diagnose the failure, fix the bug, and replay it using SQS DLQ Redrive.",
        },
        {
          question: "What type of DLQ must a FIFO SQS queue use?",
          options: [
            "A FIFO SQS queue — DLQ and source queue must be the same type",
            "An SNS topic subscribed to by an SQS FIFO queue",
            "Any SQS queue type works for FIFO DLQs",
            "A standard SQS queue — FIFO DLQs are not supported",
          ],
          correctIndex: 0,
          explanation:
            "SQS DLQs must be the same queue type as the source queue. A FIFO source queue requires a FIFO DLQ, and a standard source queue requires a standard DLQ. Mixing queue types is not supported. This is an important detail when designing FIFO-based architectures with dead-letter handling.",
        },
        {
          question:
            "Which CloudWatch metric should be monitored to alert when messages accumulate in an SQS DLQ?",
          options: [
            "NumberOfMessagesSent",
            "NumberOfMessagesDeleted",
            "ApproximateNumberOfMessagesNotVisible",
            "ApproximateNumberOfMessagesVisible",
          ],
          correctIndex: 3,
          explanation:
            "ApproximateNumberOfMessagesVisible represents the number of messages available for retrieval from the queue. Setting a CloudWatch alarm on this metric for the DLQ provides automated alerting when messages start accumulating, indicating that the consumer is failing to process certain messages. A rising DLQ depth is a reliable signal of a consumer-side problem.",
        },
      ],
    },
    {
      heading: "Long Polling and Short Polling",
      body: `SQS supports two polling modes. Short polling returns immediately with available messages (or empty if none), even if the queue contains messages that were not yet sampled — SQS queries only a subset of servers, so short polling can miss messages even in a non-empty queue and generates unnecessary API calls when the queue is frequently empty, increasing costs. Long polling waits up to 20 seconds for messages to arrive before returning an empty response, reducing empty responses, decreasing API call costs (and therefore SQS pricing), and improving message detection accuracy since all queue servers are sampled. Long polling is enabled by setting WaitTimeSeconds on the ReceiveMessage call to 1–20 seconds and is the recommended default for most consumers. The only scenario where short polling is preferable is when the consumer must respond immediately even to an empty queue, which is rare in well-designed event-driven systems.`,
      quiz: [
        {
          question:
            "A consumer is making frequent ReceiveMessage API calls but getting many empty responses, driving up costs. What change would reduce empty responses and lower costs?",
          options: [
            "Enable long polling by setting WaitTimeSeconds to up to 20 seconds",
            "Switch to a FIFO queue to improve message detection",
            "Enable server-side encryption to improve queue performance",
            "Increase the visibility timeout to reduce re-queuing",
          ],
          correctIndex: 0,
          explanation:
            "Long polling (WaitTimeSeconds = 1–20) causes the ReceiveMessage call to wait for messages to arrive before returning. It queries all queue servers (not just a subset), reduces empty responses, and lowers API call frequency — all of which reduce SQS costs. It is the recommended default for almost all SQS consumers.",
        },
        {
          question:
            "What is the maximum wait time that can be configured for SQS long polling?",
          options: ["20 seconds", "60 seconds", "10 seconds", "5 seconds"],
          correctIndex: 0,
          explanation:
            "SQS long polling supports a WaitTimeSeconds value of 1 to 20 seconds. Setting it to 20 seconds is the maximum and provides the greatest reduction in empty responses and API call costs. The ReceiveMessage call waits up to 20 seconds for at least one message before returning.",
        },
      ],
    },
    {
      heading: "SQS and Lambda Integration",
      body: `SQS is a natural pairing with Lambda as an event source: Lambda polls the SQS queue, retrieves batches of messages, and invokes the Lambda function with a batch of records. This event source mapping automatically scales the number of concurrent Lambda invocations based on queue depth — Lambda scales out to process messages in parallel across multiple concurrent executions. The batch size (1–10,000 for standard queues, 1–10 for FIFO) and batch window (0–300 seconds, allowing Lambda to wait and collect more messages before invoking) control how aggressively Lambda processes the queue. If a Lambda invocation fails for any message in a batch, the entire batch becomes visible again and is retried — to avoid reprocessing successfully handled messages, enable report batch item failures on the function to return only the message IDs that failed. Combining SQS with Lambda is the standard queue-based load leveling pattern for absorbing traffic bursts from API endpoints without overloading downstream services.`,
      quiz: [
        {
          question:
            "A Lambda function processing SQS messages receives a batch of 10 messages. Two messages fail due to a transient error. By default, what happens?",
          options: [
            "Only the 2 failed messages are retried; the 8 successful ones are deleted",
            "All 10 messages become visible again and the entire batch is retried",
            "The 2 failed messages are moved to the DLQ immediately",
            "Lambda retries only the failed messages using partial batch processing",
          ],
          correctIndex: 1,
          explanation:
            "By default, if any message in an SQS batch fails, the entire batch becomes visible again and all messages (including the 8 that succeeded) are retried. To retry only the failed messages, you must enable 'Report Batch Item Failures' on the event source mapping, allowing the function to return just the IDs of failed messages for targeted retry.",
        },
        {
          question:
            "Lambda processes SQS messages using event source mapping. How does Lambda scale when the queue depth increases?",
          options: [
            "Lambda does not scale automatically — you must manually increase reserved concurrency",
            "Lambda automatically scales the number of concurrent invocations based on queue depth",
            "Lambda uses a single polling thread regardless of queue depth",
            "Lambda scales only up to the SQS queue's throughput limit, not the account concurrency limit",
          ],
          correctIndex: 1,
          explanation:
            "Lambda's SQS event source mapping automatically scales the number of concurrent invocations in response to increasing queue depth. As messages accumulate, Lambda adds more concurrent execution environments (up to the account concurrency limit or the function's reserved concurrency) to process the backlog faster. This automatic scaling is a key benefit of the Lambda + SQS pattern.",
        },
      ],
    },
    {
      heading: "Security, Encryption, and Access Control",
      body: `SQS queues are secured with a combination of IAM policies and SQS resource-based policies (queue policies). IAM policies on the caller's identity control which queues they can send to or receive from. Queue policies (resource-based) allow cross-account access and can restrict access by source IP, VPC endpoint, or time of day. Server-side encryption (SSE) with AWS KMS encrypts message bodies at rest — choose between AWS-managed keys (SSE-SQS) for simplicity or customer-managed KMS keys (SSE-KMS) for audit trail and key rotation control. Messages in transit are encrypted via HTTPS. For sensitive workloads in a VPC, VPC Endpoints for SQS allow instances and Lambda functions in private subnets to access SQS without routing traffic through the public internet, keeping queue access internal to the AWS network. FIFO queues require the \`sqs:SendMessage\` permission with a MessageDeduplicationId or the queue's content-based deduplication must be enabled.`,
      quiz: [
        {
          question:
            "EC2 instances in a private subnet need to send messages to SQS without routing traffic over the public internet. What enables this?",
          options: [
            "Direct Connect to the SQS service endpoint",
            "An S3 gateway endpoint that proxies SQS traffic",
            "A VPC Endpoint for SQS (interface endpoint)",
            "A NAT Gateway in a public subnet",
          ],
          correctIndex: 2,
          explanation:
            "A VPC Interface Endpoint for SQS places an ENI in the private subnet with a private IP address for the SQS service endpoint. EC2 instances and Lambda functions can send messages to SQS via this private endpoint without traffic leaving the AWS network. This eliminates the need for a NAT Gateway for SQS access from private subnets.",
        },
        {
          question:
            "Which SQS encryption option provides customer control over key rotation and CloudTrail audit logs of key usage?",
          options: [
            "TLS encryption for messages in transit",
            "SSE-SQS with AWS-managed keys",
            "SSE-KMS with customer-managed KMS keys",
            "Client-side encryption before enqueuing",
          ],
          correctIndex: 2,
          explanation:
            "SSE-KMS uses customer-managed KMS keys, which log every encryption and decryption operation to CloudTrail and give you control over key rotation policies and access. SSE-SQS uses AWS-managed keys for simplicity but without customer visibility or control over key management. For compliance-driven workloads requiring audit trails, SSE-KMS is the correct choice.",
        },
      ],
    },
  ],

  keyFacts: [
    "Standard queues: unlimited throughput, at-least-once delivery, best-effort ordering",
    "FIFO queues: exactly-once processing, strict ordering, 300 TPS default (3,000 with batching); High Throughput mode available",
    "Visibility Timeout hides a message while a consumer processes it — set to max expected processing time",
    "Dead Letter Queue receives messages that exceed maxReceiveCount failed receive attempts",
    "Long polling (WaitTimeSeconds 1–20) reduces empty responses and API costs — default recommendation",
    "Lambda event source mapping auto-scales concurrency based on SQS queue depth",
    "Message retention period: up to 14 days; default is 4 days",
    "DLQ Redrive allows replaying failed messages back to the source queue after fixing the bug",
    "SSE-KMS encrypts message bodies at rest with customer-managed keys",
    "FIFO queue DLQ must also be a FIFO queue",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon SNS",
    "Amazon EventBridge",
    "Amazon EC2",
    "AWS KMS",
    "Amazon CloudWatch",
  ],

  examTips: [
    "Standard = throughput-optimized, at-least-once; FIFO = order-guaranteed, exactly-once — know which to use",
    "Visibility timeout too short = duplicate processing; too long = slow retry after consumer failure",
    "DLQ is the answer for handling poison-pill messages that always fail processing",
    "Long polling is almost always better than short polling — set WaitTimeSeconds to 20",
    "Lambda + SQS: failed batch retries entire batch unless you enable report batch item failures",
    "FIFO deduplication: use MessageDeduplicationId or enable content-based deduplication on the queue",
    "SQS does not push — consumers poll; SNS pushes to subscribers (important architectural distinction)",
    "Fanout pattern: SNS → multiple SQS queues, allowing multiple consumers to process the same event independently",
  ],

  topicQuiz: [
    {
      question:
        "Which SQS queue type guarantees exactly-once message processing and strict ordering?",
      options: [
        "Standard queue with idempotent consumers",
        "FIFO queue",
        "Standard queue with High Throughput mode",
        "Standard queue with a DLQ configured",
      ],
      correctIndex: 1,
      explanation:
        "FIFO queues guarantee exactly-once processing (no duplicates) and strict ordering within a message group. Standard queues use at-least-once delivery (may deliver duplicates) and best-effort ordering. FIFO is required for use cases like financial transactions where ordering and deduplication are correctness requirements.",
    },
    {
      question:
        "A consumer sets a visibility timeout of 20 seconds, but processing sometimes takes 2 minutes. What problem does this cause?",
      options: [
        "Messages are moved to the DLQ after 20 seconds",
        "Messages become visible again before processing completes, causing duplicate delivery",
        "Messages are permanently deleted after the timeout expires",
        "The consumer is throttled after the timeout expires",
      ],
      correctIndex: 1,
      explanation:
        "When the visibility timeout expires before the consumer finishes processing, SQS makes the message visible again. Another consumer picks it up and processes the same message — causing duplicate processing. The visibility timeout should be set to at least the maximum expected processing time to prevent this.",
    },
    {
      question: "What is the purpose of an SQS Dead Letter Queue?",
      options: [
        "To hold messages while the primary queue is at capacity",
        "To buffer messages during consumer maintenance windows",
        "To store messages that have been successfully processed for audit purposes",
        "To capture messages that fail to process after exceeding the maxReceiveCount",
      ],
      correctIndex: 3,
      explanation:
        "A DLQ captures poison-pill messages that exceed the maxReceiveCount — messages that consistently fail to process. Once in the DLQ, they no longer block the main queue. Engineers can inspect DLQ messages to diagnose failures, fix the underlying bug, and replay messages using SQS DLQ Redrive.",
    },
    {
      question:
        "Which SQS polling mode reduces empty ReceiveMessage responses and lowers API call costs?",
      options: [
        "Short polling with a high polling frequency",
        "Long polling with WaitTimeSeconds set to 1–20 seconds",
        "Batch polling with a batch size of 10",
        "Priority polling with message attribute filtering",
      ],
      correctIndex: 1,
      explanation:
        "Long polling (WaitTimeSeconds = 1–20) waits for messages to arrive before returning, queries all queue servers (not just a subset), and dramatically reduces empty responses. This lowers the number of ReceiveMessage API calls and therefore reduces SQS costs. Long polling is the recommended default for most SQS consumers.",
    },
    {
      question:
        "A Lambda function processes an SQS batch of 10 messages. Three messages fail due to a bug. How can you configure Lambda to retry only the 3 failed messages?",
      options: [
        "Enable 'Report Batch Item Failures' on the Lambda event source mapping",
        "Set the batch size to 1 so each message is processed individually",
        "Configure a DLQ on the SQS queue with maxReceiveCount of 1",
        "Use a FIFO queue so failed messages are automatically separated",
      ],
      correctIndex: 0,
      explanation:
        "Enabling 'Report Batch Item Failures' allows the Lambda function to return a list of failed message IDs. SQS then makes only those specific messages visible again for retry, while the successfully processed messages remain deleted. Without this, the entire batch is retried, reprocessing the 7 messages that succeeded.",
    },
    {
      question:
        "What SQS queue type must be used as the DLQ for an SQS FIFO source queue?",
      options: [
        "A FIFO SQS queue — DLQ and source queue must be the same type",
        "A standard SQS queue for maximum DLQ throughput",
        "Either type — SQS DLQs are type-agnostic",
        "An SNS topic with SQS subscriptions",
      ],
      correctIndex: 0,
      explanation:
        "The SQS DLQ must be the same type as the source queue. A FIFO source queue requires a FIFO DLQ; a standard source queue requires a standard DLQ. Configuring a standard DLQ for a FIFO source queue is not supported.",
    },
    {
      question:
        "How does the Lambda SQS event source mapping respond to an increasing backlog of messages in a queue?",
      options: [
        "It maintains a fixed number of concurrent invocations regardless of backlog",
        "It automatically scales concurrent Lambda invocations to process the backlog faster",
        "It increases the batch size but not the concurrency",
        "It pauses polling until the backlog drops below a threshold",
      ],
      correctIndex: 1,
      explanation:
        "Lambda's SQS event source mapping automatically scales the number of concurrent Lambda invocations in response to the queue depth. As messages accumulate, Lambda adds more parallel execution environments (up to the function's concurrency limit) to process the backlog. This automatic scaling is the core benefit of the Lambda + SQS queue-based load leveling pattern.",
    },
    {
      question:
        "An EC2 instance in a private subnet needs to send messages to SQS without using a NAT Gateway. What provides private connectivity to SQS?",
      options: [
        "An Interface VPC endpoint for SQS",
        "A VPN connection to the SQS service",
        "A Gateway VPC endpoint for SQS",
        "Direct Connect to the SQS regional endpoint",
      ],
      correctIndex: 0,
      explanation:
        "An Interface VPC Endpoint (powered by AWS PrivateLink) for SQS places an ENI with a private IP in the subnet. EC2 instances route SQS API calls to this private endpoint, keeping traffic within the AWS network without requiring a NAT Gateway. Note: SQS uses an Interface endpoint, not a Gateway endpoint (which is only available for S3 and DynamoDB).",
    },
  ],
};
