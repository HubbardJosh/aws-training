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
      quiz: [
        {
          question:
            "How does Amazon SQS deliver messages to consumers — push or pull?",
          options: [
            "Push-based — SQS automatically pushes messages to consumer endpoints",
            "Pull-based — consumers actively poll the queue for new messages",
            "Both — each queue can be configured for either push or pull delivery",
            "Event-driven — SQS triggers consumers via CloudWatch Events",
          ],
          correctIndex: 1,
          explanation:
            "SQS is pull-based: consumers actively poll the queue for new messages. This is the opposite of SNS, which is push-based. When a consumer retrieves a message, SQS makes it invisible to other consumers during processing via the visibility timeout.",
        },
        {
          question:
            "What is the SQS visibility timeout and why is it important?",
          options: [
            "The maximum time a message can remain in the queue before being automatically deleted",
            "The period after a consumer retrieves a message during which it is hidden from other consumers, preventing duplicate processing",
            "The time SQS waits before retrying delivery to an unavailable consumer",
            "The duration a consumer must wait after processing before polling for new messages",
          ],
          correctIndex: 1,
          explanation:
            "The visibility timeout is the period after a consumer retrieves a message during which the message is hidden from other consumers. If the consumer processes and deletes the message within this window, no duplicate processing occurs. If not, the message becomes visible again for another consumer to pick up.",
        },
      ],
    },
    {
      heading: "Standard vs. FIFO Queues",
      body: `SQS offers two queue types with different delivery guarantees.

**Standard Queues** offer **at-least-once delivery** — SQS guarantees every message is delivered at least once, but in rare cases a message might be delivered more than once (due to the distributed nature of the system). Standard queues also provide **best-effort ordering** — messages are generally in order but strict ordering is not guaranteed. Standard queues support virtually unlimited throughput.

**FIFO Queues** (First In, First Out) guarantee **exactly-once processing** — each message is delivered once and remains available until the consumer processes and deletes it. FIFO queues also guarantee **strict ordering** — messages are processed in the exact order they were sent. FIFO queues support up to 3,000 messages per second (with batching) or 300 messages per second without batching.

For the exam: use Standard when throughput matters most and your application can handle occasional duplicates. Use FIFO when ordering and exactly-once processing are critical, like financial transactions or inventory updates.`,
      quiz: [
        {
          question:
            "A payment processing system requires that transactions are processed in the exact order they are received, with no duplicate processing. Which SQS queue type should be used?",
          options: [
            "Standard queue, because it offers higher throughput for financial workloads",
            "FIFO queue, because it guarantees strict ordering and exactly-once processing",
            "Standard queue with a Dead Letter Queue to catch any duplicates",
            "FIFO queue with long polling enabled to reduce duplicate delivery",
          ],
          correctIndex: 1,
          explanation:
            "FIFO (First In, First Out) queues guarantee strict ordering and exactly-once processing — each message is delivered and processed exactly once, in the order it was sent. This is essential for payment processing where duplicates or out-of-order transactions would cause data integrity issues.",
        },
        {
          question:
            "What delivery guarantee does an SQS Standard queue provide?",
          options: [
            "Exactly-once delivery with strict ordering",
            "At-most-once delivery with best-effort ordering",
            "At-least-once delivery with best-effort ordering",
            "Exactly-once delivery with best-effort ordering",
          ],
          correctIndex: 2,
          explanation:
            "SQS Standard queues provide at-least-once delivery (every message is delivered at least once, but may occasionally be delivered more than once) and best-effort ordering (messages are generally in order but strict ordering is not guaranteed).",
        },
      ],
    },
    {
      heading: "Key Configuration Options",
      body: `Several SQS configuration settings are important for designing reliable systems.

**Visibility Timeout** is the period after a consumer retrieves a message during which the message is invisible to other consumers. The default is 30 seconds, and you can configure it up to 12 hours. Set it long enough that your consumer can realistically process and delete the message — if processing takes longer than the timeout, SQS will make the message visible again, leading to duplicate processing.

**Message Retention Period** determines how long SQS retains unprocessed messages before discarding them. The default is 4 days; the maximum is 14 days.

**Maximum Message Size** is 256 KB. For larger payloads, store the data in S3 and put the S3 object reference in the SQS message (the **Extended Client Library** pattern).

**Long Polling** reduces the number of empty responses when the queue is empty. With long polling, SQS waits up to 20 seconds for a message to arrive before returning an empty response. This is more efficient than **short polling**, which returns immediately (even if empty) and can cost more due to excessive API calls.

**Delay Queues** configure a delivery delay on new messages (0–15 minutes), postponing delivery to consumers. This is useful for scheduled or rate-limited processing.`,
      quiz: [
        {
          question:
            "A consumer application is making frequent SQS polling calls but the queue is often empty, resulting in high API costs. What configuration change would reduce cost and improve efficiency?",
          options: [
            "Increase the visibility timeout to reduce re-processing of messages",
            "Switch from short polling to long polling, which waits up to 20 seconds for messages before returning",
            "Increase the message retention period to keep messages in the queue longer",
            "Enable a Delay Queue to spread message arrival over a longer time window",
          ],
          correctIndex: 1,
          explanation:
            "Long polling reduces costs by having SQS wait up to 20 seconds for a message to arrive before returning an empty response. Short polling returns immediately even when the queue is empty, resulting in many empty API calls that still incur charges.",
        },
        {
          question:
            "What is the maximum message retention period for an SQS queue?",
          options: ["4 days", "7 days", "14 days", "30 days"],
          correctIndex: 2,
          explanation:
            "The maximum message retention period for an SQS queue is 14 days. The default is 4 days. Messages not consumed within the retention period are automatically deleted.",
        },
      ],
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
      quiz: [
        {
          question:
            "A message in an SQS queue consistently causes the consumer application to crash. Without a Dead Letter Queue configured, what would happen?",
          options: [
            "SQS would automatically detect the poison pill and discard it after 3 attempts",
            "The message would loop indefinitely — becoming visible again after each visibility timeout expiry and consuming all processing capacity",
            "SQS would move the message to a temporary hold queue after 5 failures",
            "The consumer would automatically skip the message and process the next one",
          ],
          correctIndex: 1,
          explanation:
            "Without a DLQ, a poison pill message would loop indefinitely — the consumer retrieves it, crashes, the visibility timeout expires, and the process repeats. This wastes processing capacity and can block other messages from being processed. A DLQ quarantines such messages after a configured number of failures.",
        },
        {
          question:
            "What configuration determines how many times a message can be received before SQS moves it to the Dead Letter Queue?",
          options: [
            "The visibility timeout duration on the source queue",
            "The message retention period on the Dead Letter Queue",
            "The maxReceiveCount setting configured on the source queue's redrive policy",
            "The message delay setting on the Dead Letter Queue",
          ],
          correctIndex: 2,
          explanation:
            "The maxReceiveCount in the source queue's redrive policy determines how many times a message can be received without being deleted before SQS automatically moves it to the Dead Letter Queue. Once this count is exceeded, the message is quarantined in the DLQ.",
        },
      ],
    },
    {
      heading: "SQS in Architecture Patterns",
      body: `SQS is a foundational building block for resilient, scalable AWS architectures. It appears in many common patterns.

**Web tier decoupling**: A web server receives a request, validates it, and places a work item in an SQS queue, then immediately returns a success response. Worker processes (EC2 or Lambda) consume messages from the queue and do the heavy processing (sending emails, generating reports, resizing images) asynchronously. Users are not blocked waiting for slow operations.

**Auto Scaling integration**: SQS queue depth is an excellent metric for Auto Scaling. When the queue grows long (processing is falling behind), Auto Scaling adds more EC2 workers. When the queue drains, it scales back in. This creates self-regulating, cost-efficient processing fleets.

**SNS + SQS fan-out**: SNS publishes one message to multiple SQS queues subscribed to a topic. Each queue is processed independently by different services. This is the standard pattern for distributing events to multiple consumers.

**Lambda integration**: Lambda can poll an SQS queue directly as an event source. When messages arrive, Lambda invokes your function with a batch of messages. Lambda automatically manages the polling and concurrency, and on success, removes the processed messages from the queue.`,
      quiz: [
        {
          question:
            "A company wants to automatically add more EC2 worker instances when the SQS queue is growing and remove them when the queue is empty. What AWS feature enables this?",
          options: [
            "SQS Long Polling, which reduces polling frequency during low traffic",
            "Auto Scaling with a scaling policy based on SQS queue depth (ApproximateNumberOfMessages)",
            "SQS FIFO queues, which process messages in order and signal when the queue is draining",
            "CloudWatch alarms that manually trigger EC2 launches via SNS",
          ],
          correctIndex: 1,
          explanation:
            "Auto Scaling can use SQS queue depth (the ApproximateNumberOfMessages CloudWatch metric) as a scaling trigger. When the queue grows long, Auto Scaling adds EC2 workers; when the queue drains, it scales in. This creates a self-regulating, cost-efficient processing fleet.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "What is the primary purpose of Amazon SQS in a distributed system?",
      options: [
        "To send real-time push notifications to mobile devices",
        "To decouple producers and consumers by buffering messages in a queue",
        "To stream large volumes of data in real-time for analytics",
        "To synchronously coordinate requests between microservices",
      ],
      correctIndex: 1,
      explanation:
        "SQS decouples producers and consumers by buffering messages in a queue. Producers place messages in the queue and continue working; consumers read at their own pace. If a consumer is down, messages accumulate and are processed when it recovers.",
    },
    {
      question:
        "Which SQS queue type should be used when message order and exactly-once processing are required?",
      options: [
        "Standard queue with message deduplication ID",
        "FIFO queue, which guarantees strict ordering and exactly-once processing",
        "Standard queue with visibility timeout set to maximum",
        "Dead Letter Queue configured as the primary queue",
      ],
      correctIndex: 1,
      explanation:
        "SQS FIFO queues guarantee strict ordering (messages are processed in the exact order they were sent) and exactly-once processing (no duplicates). They are ideal for financial transactions, inventory updates, and any use case where order and deduplication matter.",
    },
    {
      question:
        "What is the default message retention period for an SQS queue?",
      options: ["1 day", "4 days", "7 days", "14 days"],
      correctIndex: 1,
      explanation:
        "The default message retention period for an SQS queue is 4 days. The maximum is 14 days. Messages not consumed within the retention period are automatically deleted by SQS.",
    },
    {
      question:
        "A consumer processes SQS messages that each take 5 minutes to complete. The visibility timeout is set to 30 seconds. What problem will occur?",
      options: [
        "Messages will be deleted automatically after 30 seconds",
        "The consumer will be throttled and unable to receive new messages",
        "The message will become visible again after 30 seconds, causing duplicate processing by other consumers",
        "SQS will extend the visibility timeout automatically based on processing time",
      ],
      correctIndex: 2,
      explanation:
        "If the visibility timeout (30 seconds) is shorter than the processing time (5 minutes), the message will become visible again before processing completes. Another consumer will pick it up, causing duplicate processing. The visibility timeout should always be set longer than the expected processing time.",
    },
    {
      question:
        "What is the maximum size of a single message that can be sent to an SQS queue?",
      options: ["64 KB", "128 KB", "256 KB", "1 MB"],
      correctIndex: 2,
      explanation:
        "The maximum SQS message size is 256 KB. For larger payloads, the recommended pattern is to store the data in S3 and put a reference to the S3 object in the SQS message (using the Extended Client Library).",
    },
    {
      question:
        "Which SQS feature would you use to delay message delivery to consumers by up to 15 minutes after the message is published?",
      options: [
        "Long Polling — waits up to 20 seconds before returning messages",
        "Visibility Timeout — hides messages from consumers for a configurable period",
        "Delay Queues — postpones delivery of new messages by a configured delay",
        "Message Retention — keeps messages in the queue for an extended period before delivery",
      ],
      correctIndex: 2,
      explanation:
        "Delay Queues configure a delivery delay on new messages (0–15 minutes), postponing when they become visible to consumers. This is useful for scheduled or rate-limited processing where immediate delivery is not desired.",
    },
    {
      question:
        "A Lambda function is configured to process messages from an SQS queue. What happens to successfully processed messages?",
      options: [
        "Lambda marks them as processed, and they remain in the queue for audit purposes",
        "Lambda automatically deletes them from the queue upon successful processing",
        "Messages are moved to an archive queue after Lambda processes them",
        "Messages expire after the visibility timeout regardless of processing outcome",
      ],
      correctIndex: 1,
      explanation:
        "When Lambda is used as an SQS event source, Lambda automatically manages polling and deletes successfully processed messages from the queue. If a message fails processing, it becomes visible again for retry (or goes to the DLQ if maxReceiveCount is exceeded).",
    },
    {
      question:
        "What metric is commonly used to trigger Auto Scaling of EC2 worker instances consuming from an SQS queue?",
      options: [
        "CPUUtilization of the EC2 instances",
        "NumberOfMessagesSent to the queue per minute",
        "ApproximateNumberOfMessages (queue depth) in the SQS queue",
        "NetworkIn traffic on the EC2 instances",
      ],
      correctIndex: 2,
      explanation:
        "SQS queue depth (ApproximateNumberOfMessages) is the ideal Auto Scaling metric for worker fleets. When the queue is long, processing is falling behind and more workers are needed. When the queue drains, workers can scale in. This creates a self-regulating, cost-efficient fleet.",
    },
  ],
};
