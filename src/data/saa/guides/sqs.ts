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
    },
    {
      heading: "Visibility Timeout and Message Lifecycle",
      body: `When a consumer retrieves a message from SQS (a receive operation), SQS makes the message invisible to other consumers for a configurable Visibility Timeout period — the consumer has this window to process the message and delete it before SQS makes it visible again for redelivery. If the consumer fails to delete the message within the timeout (due to a crash, timeout, or processing error), SQS automatically makes the message visible again for another consumer to attempt, providing automatic retry behavior. The visibility timeout should be set to at least the maximum expected processing time — if processing typically takes 30 seconds but occasionally takes 5 minutes, set the timeout to at least 5 minutes. Consumers can extend the visibility timeout programmatically (ChangeMessageVisibility) while processing long-running tasks. Messages have a maximum retention period of 14 days; if not consumed within the retention period, messages are automatically deleted. The Message Retention Period should be set long enough to survive planned outages and consumer deployments.`,
    },
    {
      heading: "Dead Letter Queues",
      body: `A Dead Letter Queue (DLQ) is a separate SQS queue that receives messages that fail to be processed successfully after a configurable number of receive attempts (the maxReceiveCount). When a message exceeds its maxReceiveCount, SQS automatically moves it to the DLQ, preventing poison-pill messages from indefinitely blocking consumers and exhausting resources on retries. DLQs enable debugging and alerting on failed messages — you can inspect DLQ messages to understand why processing failed, fix the bug, and replay messages back to the source queue using SQS DLQ Redrive. A CloudWatch alarm on the DLQ's ApproximateNumberOfMessagesVisible metric provides automated alerting when messages begin accumulating, indicating a consumer-side problem. DLQs and their source queues must be of the same type — FIFO queues must use FIFO DLQs, and standard queues must use standard DLQs. Lambda functions with SQS event source mapping have their own retry and DLQ configuration separate from the SQS queue's DLQ.`,
    },
    {
      heading: "Long Polling and Short Polling",
      body: `SQS supports two polling modes. Short polling returns immediately with available messages (or empty if none), even if the queue contains messages that were not yet sampled — SQS queries only a subset of servers, so short polling can miss messages even in a non-empty queue and generates unnecessary API calls when the queue is frequently empty, increasing costs. Long polling waits up to 20 seconds for messages to arrive before returning an empty response, reducing empty responses, decreasing API call costs (and therefore SQS pricing), and improving message detection accuracy since all queue servers are sampled. Long polling is enabled by setting WaitTimeSeconds on the ReceiveMessage call to 1–20 seconds and is the recommended default for most consumers. The only scenario where short polling is preferable is when the consumer must respond immediately even to an empty queue, which is rare in well-designed event-driven systems.`,
    },
    {
      heading: "SQS and Lambda Integration",
      body: `SQS is a natural pairing with Lambda as an event source: Lambda polls the SQS queue, retrieves batches of messages, and invokes the Lambda function with a batch of records. This event source mapping automatically scales the number of concurrent Lambda invocations based on queue depth — Lambda scales out to process messages in parallel across multiple concurrent executions. The batch size (1–10,000 for standard queues, 1–10 for FIFO) and batch window (0–300 seconds, allowing Lambda to wait and collect more messages before invoking) control how aggressively Lambda processes the queue. If a Lambda invocation fails for any message in a batch, the entire batch becomes visible again and is retried — to avoid reprocessing successfully handled messages, enable report batch item failures on the function to return only the message IDs that failed. Combining SQS with Lambda is the standard queue-based load leveling pattern for absorbing traffic bursts from API endpoints without overloading downstream services.`,
    },
    {
      heading: "Security, Encryption, and Access Control",
      body: `SQS queues are secured with a combination of IAM policies and SQS resource-based policies (queue policies). IAM policies on the caller's identity control which queues they can send to or receive from. Queue policies (resource-based) allow cross-account access and can restrict access by source IP, VPC endpoint, or time of day. Server-side encryption (SSE) with AWS KMS encrypts message bodies at rest — choose between AWS-managed keys (SSE-SQS) for simplicity or customer-managed KMS keys (SSE-KMS) for audit trail and key rotation control. Messages in transit are encrypted via HTTPS. For sensitive workloads in a VPC, VPC Endpoints for SQS allow instances and Lambda functions in private subnets to access SQS without routing traffic through the public internet, keeping queue access internal to the AWS network. FIFO queues require the \`sqs:SendMessage\` permission with a MessageDeduplicationId or the queue's content-based deduplication must be enabled.`,
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
};
