import { ServiceGuide } from "../../../types/guide";

export const snsGuide: ServiceGuide = {
  id: "clf-sns",
  service: "Amazon SNS",
  domain: "development",
  tagline: "Managed publish/subscribe messaging for fan-out notifications",
  intro:
    "Amazon Simple Notification Service (SNS) is a fully managed pub/sub messaging service that enables you to decouple and scale microservices, distributed systems, and serverless applications by sending messages to multiple subscribers simultaneously.",

  sections: [
    {
      heading: "Pub/Sub Messaging Model",
      body: `SNS follows a **publish/subscribe (pub/sub)** messaging pattern. A **publisher** sends a message to an SNS **topic** — a logical channel for messages. One or more **subscribers** receive every message published to that topic. This decouples the producer (publisher) from the consumers (subscribers) — the publisher does not know who is listening or how many subscribers exist.

Contrast this with a queue-based system like SQS, where each message is consumed by only one consumer. In SNS, a single message published to a topic is delivered to **all subscribers simultaneously** — this is called **fan-out**.

Topics have an Amazon Resource Name (ARN) and can be referenced across AWS accounts. Publishing a message is a single API call, and SNS handles delivery to all subscribers, retrying on failure for supported protocols.`,
    },
    {
      heading: "Subscription Types",
      body: `SNS topics support a variety of subscription protocols, making SNS flexible for different notification and integration needs.

**Email and Email-JSON**: SNS sends notifications to email addresses. The recipient must confirm the subscription by clicking a link in a confirmation email. Useful for sending alerts to operations teams or stakeholders. Email-JSON delivers the raw SNS message in JSON format.

**HTTP/HTTPS**: SNS delivers messages to a web endpoint (your server, a webhook, or an API). SNS includes a confirmation step where it sends a subscription confirmation request that your endpoint must respond to.

**Amazon SQS**: SNS delivers messages to an SQS queue. This is the classic **fan-out pattern** — SNS publishes once to a topic, and multiple SQS queues receive copies of the message for independent processing. This combination is used extensively in distributed systems.

**AWS Lambda**: SNS can invoke a Lambda function for each message, enabling real-time serverless processing of notifications.

**SMS**: SNS sends text messages to mobile phone numbers in supported countries. Useful for two-factor authentication codes or operational alerts.

**Mobile Push**: SNS integrates with mobile push notification services (APNs for iOS, FCM for Android) to deliver push notifications to mobile apps.`,
    },
    {
      heading: "SNS and SQS Fan-Out Pattern",
      body: `One of the most important patterns in AWS architecture is **SNS + SQS fan-out**. It solves the problem of delivering one message to multiple independent systems without coupling the producer to each consumer.

The pattern works like this: a producer publishes a single message to an SNS topic. That topic has multiple SQS queue subscriptions — one per downstream system. SNS delivers the message to each SQS queue, and each queue is independently consumed by its own application or service.

For example, when a new order is placed in an e-commerce system, publishing the order event to an SNS topic can simultaneously trigger:
- An SQS queue consumed by the inventory service to reserve stock
- An SQS queue consumed by the fulfillment service to initiate shipping
- An SQS queue consumed by the notifications service to send a confirmation email

Each service operates independently and at its own pace. If the notifications service is temporarily down, its SQS queue buffers the messages. This pattern provides **loose coupling, scalability, and resilience** — the hallmarks of good distributed system design.`,
    },
    {
      heading: "Message Filtering",
      body: `By default, every subscriber to an SNS topic receives every message. **Message filtering** allows subscribers to receive only the messages relevant to them, reducing unnecessary processing.

You configure a **filter policy** on a subscription as a JSON document. The policy specifies attribute values that must match for the message to be delivered. For example, an e-commerce topic might publish order events with attributes like \`{"orderType": "wholesale"}\` or \`{"orderType": "retail"}\`. A subscriber interested only in wholesale orders attaches a filter policy \`{"orderType": ["wholesale"]}\` and only receives those messages.

This allows a single topic to serve diverse consumers without requiring publishers to route messages to different topics per subscriber type. It simplifies architecture and reduces the number of SNS topics you need to maintain.`,
    },
    {
      heading: "Reliability and Delivery",
      body: `SNS is designed for reliable delivery with automatic retry logic. For most subscription types, if delivery fails, SNS retries delivery according to a configurable retry policy — with immediate retries, then backing off with delays between attempts.

**Dead Letter Queues (DLQs)** can be configured on individual subscriptions. If SNS exhausts all retry attempts without successful delivery, the message is sent to the DLQ (an SQS queue you specify). This prevents message loss and allows you to investigate and replay failed deliveries.

**SNS FIFO topics** (First In, First Out) guarantee strict message ordering and exactly-once delivery, similar to SQS FIFO queues. FIFO topics can only deliver to SQS FIFO queues and are used when ordering is critical.

For the Cloud Practitioner exam, the key concepts are: SNS is pub/sub messaging that fans out to multiple subscribers, it decouples producers from consumers, and the SNS+SQS fan-out pattern is a fundamental distributed systems building block.`,
    },
  ],

  keyFacts: [
    "SNS is a fully managed pub/sub (publish/subscribe) messaging service",
    "Messages published to a topic are delivered to ALL subscribers simultaneously (fan-out)",
    "Subscription types: Email, HTTP/HTTPS, SQS, Lambda, SMS, Mobile Push",
    "SNS + SQS fan-out: publish once, deliver to multiple queues for independent processing",
    "Message filtering lets subscribers receive only relevant messages via filter policies",
    "FIFO topics guarantee strict ordering and exactly-once delivery",
    "Dead Letter Queues capture undeliverable messages after all retry attempts are exhausted",
    "SNS decouples producers from consumers — publishers do not know who subscribes",
    "One SNS message can trigger email, SMS, Lambda, and SQS all at once",
    "Topics are region-specific but can deliver to cross-account subscribers",
  ],

  relatedServices: [
    "Amazon SQS",
    "AWS Lambda",
    "Amazon CloudWatch",
    "Amazon EventBridge",
  ],

  examTips: [
    "SNS = pub/sub, one message to MANY subscribers; SQS = one consumer per message",
    "SNS + SQS fan-out is the standard pattern for event-driven distributed systems",
    "Email subscriptions require confirmation click from the recipient",
    "Filter policies let subscribers receive only the messages they care about",
    "FIFO topics guarantee ordering; standard topics do not guarantee order",
    "SNS is push-based (it pushes to subscribers); SQS is pull-based (consumers poll)",
    "DLQs on SNS subscriptions capture failed deliveries after retries are exhausted",
  ],
};
