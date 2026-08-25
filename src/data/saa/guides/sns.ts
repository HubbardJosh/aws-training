import { ServiceGuide } from "../../../types/guide";

export const snsGuide: ServiceGuide = {
  id: "saa-sns",
  service: "Amazon SNS",
  domain: "applications",
  tagline: "Fully managed pub/sub messaging for fan-out and push notifications",
  intro:
    "Amazon Simple Notification Service (SNS) is a fully managed publish-subscribe messaging service that decouples message producers from multiple consumers by pushing notifications simultaneously to all subscribed endpoints — SQS queues, Lambda functions, HTTP endpoints, email addresses, SMS, and mobile push.",

  sections: [
    {
      heading: "Topics, Publishers, and Subscribers",
      body: `SNS is organized around topics — named communication channels to which publishers send messages and subscribers receive them. A publisher sends a single message to a topic, and SNS delivers it to all confirmed subscriptions simultaneously, enabling fan-out to multiple independent consumers without the publisher needing to know who the subscribers are. Subscriptions can target SQS queues (for durable, reliable processing), Lambda functions (for immediate serverless processing), HTTP/HTTPS endpoints (for webhooks), email addresses (for human notification), SMS phone numbers (for text alerts), and Amazon Kinesis Data Firehose (for streaming to S3, Redshift, or Elasticsearch). Each subscription can apply a filter policy so that a subscriber only receives messages matching specific message attribute criteria — without filter policies, all subscribers receive all messages; with filters, a single topic can serve multiple consumers each interested in different message types, reducing unnecessary invocations and processing costs.`,
    },
    {
      heading: "SNS Fan-Out Pattern with SQS",
      body: `The fan-out pattern is one of the most important architectural patterns in AWS: publish one event to an SNS topic, and SNS delivers it to multiple SQS queues in parallel. Each SQS queue has its own consumer (Lambda function, EC2 worker, ECS task) that processes the event independently. This pattern provides parallel processing, independent scaling of each consumer, failure isolation (one consumer's failure does not affect others), and the durability of SQS (messages persist in the queue even if the consumer is temporarily unavailable). A practical example: when an e-commerce order is placed, an SNS topic delivers the order event to an inventory queue (to deduct stock), a fulfillment queue (to initiate shipping), an analytics queue (to record the sale), and an email queue (to send the confirmation) — all in parallel, with each consumer scaling independently. Without SNS fan-out, the order service would need to write directly to each downstream service, creating tight coupling.`,
    },
    {
      heading: "FIFO Topics",
      body: `SNS FIFO topics provide strict message ordering and deduplication for scenarios where the sequence of notifications matters. Messages published to a FIFO topic are delivered to FIFO SQS subscriptions in the exact order they were published within the same message group. FIFO topics support up to 300 published messages per second (3,000 with batching). Supported subscriber types include FIFO SQS queues, Lambda functions, HTTP/HTTPS endpoints, and Amazon Kinesis Data Firehose — standard SQS queues and email cannot subscribe to FIFO topics. Message deduplication in FIFO topics uses a MessageDeduplicationId (explicitly provided) or content-based deduplication (SNS hashes the message body), preventing duplicate deliveries within a five-minute deduplication window. FIFO topics are the right choice for financial events (account balance updates must be applied in order), inventory management (stock cannot go negative due to out-of-order processing), and any pub/sub workflow where event sequence is a correctness requirement.`,
    },
    {
      heading: "Message Filtering",
      body: `SNS message filter policies are JSON documents attached to a subscription that evaluate message attributes and deliver the message only when attributes match the policy. Filter policies support exact string matching, prefix matching, numeric value ranges, and the \`anything-but\` negation operator. A subscription with no filter policy receives all messages published to the topic. Using filter policies, a single topic can replace multiple topics serving different audiences — for example, a topic for payment events with subscriptions filtered by \`paymentStatus\` attribute: the fraud detection queue subscribes with a filter for \`{"paymentStatus": ["declined"]}\`, the customer notification queue subscribes for \`{"paymentStatus": ["approved", "declined"]}\`, and the accounting queue receives all events. This design reduces topic proliferation, simplifies the publisher (one publish call instead of routing logic), and keeps all event filtering logic at the infrastructure level rather than in application code.`,
    },
    {
      heading: "Dead Letter Queues and Delivery Retry",
      body: `SNS attempts to deliver messages to subscribed endpoints and retries failed deliveries using an exponential backoff policy that varies by endpoint type. HTTP/HTTPS endpoints receive up to 23 retries over 23 hours with exponential backoff. Lambda and SQS subscriptions receive immediate retries (Lambda has three attempts before the event is lost without a DLQ). When all delivery attempts are exhausted, SNS can route undeliverable messages to an Amazon SQS DLQ associated with the subscription — enabling investigation and reprocessing of failed notifications. DLQs on SNS subscriptions are separate from DLQs on SQS queues or Lambda functions; they capture events that SNS itself could not deliver (e.g., the HTTP endpoint was permanently unavailable), not events that the consumer failed to process. Configuring DLQs on both the SNS subscription and the SQS/Lambda consumer creates comprehensive end-to-end message failure handling.`,
    },
    {
      heading: "Security and Cross-Account Publishing",
      body: `SNS topics are secured through a combination of IAM policies on the publisher's identity and resource-based SNS topic policies. Topic policies enable cross-account publishing — an SNS topic in Account A can grant \`sns:Publish\` permission to Account B, allowing services in Account B to publish events to Account A's topic without sharing credentials. This is commonly used for centralized event aggregation where microservices in different accounts publish to a shared notification topic in a monitoring or operations account. Server-side encryption (SSE) with AWS KMS encrypts message contents at rest in the SNS topic. HTTPS is used for all message delivery to HTTP endpoints and for all API interactions. For mobile push notifications, SNS integrates with Apple APNs, Google FCM, Amazon ADM, and Baidu CNS — the SNS device token management handles platform-specific push delivery without requiring the application to implement multiple push SDKs.`,
    },
  ],

  keyFacts: [
    "SNS pushes to all subscriptions simultaneously; SQS consumers pull — fundamental distinction",
    "Fan-out: one SNS topic → multiple SQS queues for parallel, decoupled processing",
    "Filter policies on subscriptions route only matching messages — reduces unnecessary processing",
    "FIFO topics provide ordered, exactly-once delivery to FIFO SQS queues, Lambda, HTTP/S, and Kinesis Firehose subscribers",
    "SNS retries HTTP endpoints up to 23 times over 23 hours with exponential backoff",
    "Subscription DLQs capture messages SNS could not deliver after all retries",
    "Cross-account topic policies allow services in other accounts to publish to your topic",
    "SNS supports SQS, Lambda, HTTP/S, Email, SMS, and Kinesis Firehose as subscription endpoints",
    "FIFO topics max 300 TPS (3,000 with batching) — same limits as FIFO SQS queues",
    "SSE-KMS encrypts SNS message contents at rest",
  ],

  relatedServices: [
    "Amazon SQS",
    "AWS Lambda",
    "Amazon EventBridge",
    "Amazon Kinesis Data Firehose",
    "AWS KMS",
    "Amazon CloudWatch",
  ],

  examTips: [
    "SNS pushes; SQS polls — exam questions test this distinction for architecture design",
    "Fan-out (SNS → multiple SQS) is the canonical pattern for parallel decoupled processing",
    "Filter policies eliminate the need for multiple topics serving different consumers",
    "FIFO topic → FIFO SQS, Lambda, HTTP/S, Kinesis Firehose — standard SQS and email cannot subscribe",
    "SNS DLQ captures delivery failures (SNS could not reach the endpoint); Lambda/SQS DLQ captures processing failures",
    "Cross-account SNS publishing uses topic resource policies — no role assumption required",
    "For mobile push at scale, SNS device token management simplifies multi-platform delivery",
    "EventBridge is more powerful than SNS for event routing — use EventBridge for complex rule-based routing",
  ],
};
