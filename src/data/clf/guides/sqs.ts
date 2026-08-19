import { ServiceGuide } from "../../../types/guide";

export const sqsGuide: ServiceGuide = {
  id: "clf-sqs",
  service: "Amazon SQS",
  domain: "development",
  tagline: "Fully managed message queuing for decoupled distributed systems",
  intro:
    "Amazon Simple Queue Service (SQS) is a fully managed message queuing service that enables you to decouple and scale microservices, distributed systems, and serverless applications by reliably delivering messages between components.",

  sections: [
    {
      heading: "What Is a Message Queue?",
      body: `A **message queue** is a buffer that stores messages between a producer (sender) and a consumer (receiver). Instead of the producer calling the consumer directly and waiting for a response, the producer places a message in the queue and continues with other work. The consumer reads messages from the queue at its own pace.

This **decoupling** is enormously valuable. If the consumer is temporarily unavailable, messages queue up and are processed when the consumer recovers — nothing is lost. If the consumer is slow, the queue buffers the backlog. If traffic spikes, the queue absorbs the surge while consumers process steadily.

SQS is a **pull-based** service: consumers actively poll the queue for new messages. When a consumer retrieves a message, SQS makes the message invisible to other consumers for a period called the **visibility timeout**. If the consumer processes the message successfully, it explicitly deletes it from the queue. If processing fails and the consumer does not delete it, the message becomes visible again and can be processed by another consumer.`,
    },
    {
      heading: "Standard vs. FIFO Queues",
      body: `SQS offers two queue types with different delivery guarantees.

**Standard Queues** offer **at-least-once delivery** — SQS guarantees every message is delivered at least once, but in rare cases a message might be delivered more than once (due to the distributed nature of the system). Standard queues also provide **best-effort ordering** — messages are generally in order but strict ordering is not guaranteed. Standard queues support virtually unlimited throughput.

**FIFO Queues** (First In, First Out) guarantee **exactly-once processing** — each message is delivered once and remains available until the consumer processes and deletes it. FIFO queues also guarantee **strict ordering** — messages are processed in the exact order they were sent. FIFO queues support up to 3,000 messages per second (with batching) or 300 messages per second without batching.

For the exam: use Standard when throughput matters most and your application can handle occasional duplicates. Use FIFO when ordering and exactly-once processing are critical, like financial transactions or inventory updates.`,
    },
    {
      heading: "Key Configuration Options",
      body: `Several SQS configuration settings are important for designing reliable systems.

**Visibility Timeout** is the period after a consumer retrieves a message during which the message is invisible to other consumers. The default is 30 seconds, and you can configure it up to 12 hours. Set it long enough that your consumer can realistically process and delete the message — if processing takes longer than the timeout, SQS will make the message visible again, leading to duplicate processing.

**Message Retention Period** determines how long SQS retains unprocessed messages before discarding them. The default is 4 days; the maximum is 14 days.

**Maximum Message Size** is 256 KB. For larger payloads, store the data in S3 and put the S3 object reference in the SQS message (the **Extended Client Library** pattern).

**Long Polling** reduces the number of empty responses when the queue is empty. With long polling, SQS waits up to 20 seconds for a message to arrive before returning an empty response. This is more efficient than **short polling**, which returns immediately (even if empty) and can cost more due to excessive API calls.

**Delay Queues** configure a delivery delay on new messages (0–15 minutes), postponing delivery to consumers. This is useful for scheduled or rate-limited processing.`,
    },
    {
      heading: "Dead Letter Queues",
      body: `A **Dead Letter Queue (DLQ)** is a separate SQS queue that receives messages that failed processing after a configurable number of attempts. You configure a **maxReceiveCount** on your source queue — when a message has been received (but not deleted) more than that many times, SQS automatically moves it to the DLQ.

DLQs are essential for debugging and reliability. Without a DLQ, a "poison pill" message — one that consistently causes processing failures — would loop indefinitely, blocking queue processing and potentially causing your application to spend all its time retrying the same broken message.

With a DLQ in place, poison pills are quarantined after a defined number of failures. You can then:
- Inspect the failed messages to identify the bug
- Fix the bug in your consumer
- Replay the messages from the DLQ back to the source queue for reprocessing

DLQs should be monitored with CloudWatch alarms — messages arriving in the DLQ indicate a processing problem that needs attention.`,
    },
    {
      heading: "SQS in Architecture Patterns",
      body: `SQS is a foundational building block for resilient, scalable AWS architectures. It appears in many common patterns.

**Web tier decoupling**: A web server receives a request, validates it, and places a work item in an SQS queue, then immediately returns a success response. Worker processes (EC2 or Lambda) consume messages from the queue and do the heavy processing (sending emails, generating reports, resizing images) asynchronously. Users are not blocked waiting for slow operations.

**Auto Scaling integration**: SQS queue depth is an excellent metric for Auto Scaling. When the queue grows long (processing is falling behind), Auto Scaling adds more EC2 workers. When the queue drains, it scales back in. This creates self-regulating, cost-efficient processing fleets.

**SNS + SQS fan-out**: SNS publishes one message to multiple SQS queues subscribed to a topic. Each queue is processed independently by different services. This is the standard pattern for distributing events to multiple consumers.

**Lambda integration**: Lambda can poll an SQS queue directly as an event source. When messages arrive, Lambda invokes your function with a batch of messages. Lambda automatically manages the polling and concurrency, and on success, removes the processed messages from the queue.`,
    },
  ],

  keyFacts: [
    "SQS is a fully managed message queue — decouples producers from consumers",
    "Pull-based: consumers poll the queue for messages (not push-based like SNS)",
    "Standard queues: at-least-once delivery, best-effort ordering, unlimited throughput",
    "FIFO queues: exactly-once processing, strict ordering, up to 3,000 msg/sec",
    "Visibility Timeout: period a message is hidden after retrieval (default 30s, max 12h)",
    "Message Retention: default 4 days, maximum 14 days",
    "Dead Letter Queue (DLQ) receives messages that fail processing after maxReceiveCount attempts",
    "Long Polling waits up to 20 seconds for messages — more efficient than short polling",
    "Maximum message size is 256 KB; use S3 for larger payloads",
    "Queue depth is an ideal metric for Auto Scaling EC2 worker fleets",
  ],

  relatedServices: [
    "Amazon SNS",
    "AWS Lambda",
    "Amazon EC2",
    "Amazon CloudWatch",
    "Amazon EventBridge",
  ],

  examTips: [
    "SQS decouples producers and consumers — buffers messages for async processing",
    "Standard = at-least-once delivery (possible duplicates); FIFO = exactly-once, strict order",
    "Visibility Timeout prevents duplicate processing — set it longer than your processing time",
    "DLQ quarantines poison-pill messages — monitor DLQ with CloudWatch alarms",
    "Long Polling is more efficient than short polling — reduces empty responses and cost",
    "SQS queue depth drives Auto Scaling: long queue = add workers; empty queue = scale in",
    "SNS + SQS fan-out is the canonical pattern for one-to-many event distribution",
    "Lambda can poll SQS directly — no need to write polling code yourself",
  ],
};
