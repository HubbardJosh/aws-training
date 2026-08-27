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
      quiz: [
        {
          question:
            "What is the key difference between Amazon SNS and Amazon SQS in terms of message delivery?",
          options: [
            "SNS delivers messages to one consumer at a time; SQS delivers to all subscribers",
            "SNS delivers a message to all subscribers simultaneously (fan-out); SQS delivers each message to only one consumer",
            "SNS requires consumers to poll for messages; SQS pushes messages to subscribers",
            "SNS stores messages for up to 14 days; SQS delivers immediately with no retention",
          ],
          correctIndex: 1,
          explanation:
            "In SNS (pub/sub), a single message published to a topic is delivered to ALL subscribers simultaneously — this is fan-out. In SQS (queue), each message is consumed by only one consumer. SNS is push-based; SQS is pull-based.",
        },
        {
          question: "In Amazon SNS, what is a 'topic'?",
          options: [
            "A filter that determines which subscribers receive which messages",
            "A logical channel to which publishers send messages and from which subscribers receive them",
            "A dead letter queue for messages that fail delivery after all retries",
            "A policy document that defines message routing rules",
          ],
          correctIndex: 1,
          explanation:
            "An SNS topic is a logical channel for messages. Publishers send messages to a topic, and all subscribers to that topic receive every message published to it. Topics have an ARN and can be referenced across AWS accounts.",
        },
      ],
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
      quiz: [
        {
          question:
            "A company wants to send automated alerts via email to their operations team whenever a CloudWatch alarm triggers. Which AWS service and subscription type should they use?",
          options: [
            "SQS with an email endpoint, polling the queue for new messages",
            "SNS with an Email subscription, which sends notifications directly to the team's email addresses",
            "Lambda with an SES integration to send emails programmatically",
            "EventBridge with an email destination rule",
          ],
          correctIndex: 1,
          explanation:
            "SNS with an Email subscription sends notifications directly to email addresses. CloudWatch alarms can publish to SNS topics, which then deliver the alert to subscribed email addresses. Recipients must confirm the subscription first.",
        },
        {
          question:
            "Which SNS subscription type requires the recipient to click a confirmation link before they begin receiving messages?",
          options: [
            "SQS subscriptions",
            "Lambda subscriptions",
            "Email subscriptions",
            "HTTP/HTTPS subscriptions",
          ],
          correctIndex: 2,
          explanation:
            "Email subscriptions in SNS require the recipient to confirm the subscription by clicking a confirmation link sent to their email address. This prevents unauthorized email delivery and ensures the recipient agrees to receive notifications.",
        },
      ],
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
      quiz: [
        {
          question:
            "An e-commerce platform publishes a single 'order placed' event and needs three independent services (inventory, fulfillment, notifications) to each process it. Which pattern best achieves this?",
          options: [
            "Send the event to three separate SQS queues using three separate API calls",
            "Use SNS + SQS fan-out: publish once to an SNS topic that delivers to three SQS queues",
            "Use a single SQS FIFO queue shared by all three services",
            "Store the event in S3 and have each service poll for new objects",
          ],
          correctIndex: 1,
          explanation:
            "The SNS + SQS fan-out pattern is ideal here. The producer publishes a single message to an SNS topic, which delivers a copy to each of three SQS queues — one per service. Each service processes independently, providing loose coupling, scalability, and resilience.",
        },
      ],
    },
    {
      heading: "Message Filtering",
      body: `By default, every subscriber to an SNS topic receives every message. **Message filtering** allows subscribers to receive only the messages relevant to them, reducing unnecessary processing.

You configure a **filter policy** on a subscription as a JSON document. The policy specifies attribute values that must match for the message to be delivered. For example, an e-commerce topic might publish order events with attributes like \`{"orderType": "wholesale"}\` or \`{"orderType": "retail"}\`. A subscriber interested only in wholesale orders attaches a filter policy \`{"orderType": ["wholesale"]}\` and only receives those messages.

This allows a single topic to serve diverse consumers without requiring publishers to route messages to different topics per subscriber type. It simplifies architecture and reduces the number of SNS topics you need to maintain.`,
      quiz: [
        {
          question:
            "An SNS topic receives order events with an attribute 'orderType' set to either 'wholesale' or 'retail'. A Lambda function should only process wholesale orders. How can this be achieved?",
          options: [
            "Create a separate SNS topic for each order type and publish to the correct topic",
            "Configure a filter policy on the Lambda subscription to only deliver messages where orderType is 'wholesale'",
            "Add an if-statement in the Lambda function to discard retail orders after they are delivered",
            "Use an SQS FIFO queue between SNS and Lambda to filter messages by order type",
          ],
          correctIndex: 1,
          explanation:
            "SNS filter policies let subscribers receive only the messages relevant to them. Configuring a filter policy on the Lambda subscription to match orderType='wholesale' means SNS will only invoke the Lambda function for wholesale orders, reducing unnecessary invocations.",
        },
      ],
    },
    {
      heading: "Reliability and Delivery",
      body: `SNS is designed for reliable delivery with automatic retry logic. For most subscription types, if delivery fails, SNS retries delivery according to a configurable retry policy — with immediate retries, then backing off with delays between attempts.

**Dead Letter Queues (DLQs)** can be configured on individual subscriptions. If SNS exhausts all retry attempts without successful delivery, the message is sent to the DLQ (an SQS queue you specify). This prevents message loss and allows you to investigate and replay failed deliveries.

**SNS FIFO topics** (First In, First Out) guarantee strict message ordering and exactly-once delivery, similar to SQS FIFO queues. FIFO topics can only deliver to SQS FIFO queues and are used when ordering is critical.

For the Cloud Practitioner exam, the key concepts are: SNS is pub/sub messaging that fans out to multiple subscribers, it decouples producers from consumers, and the SNS+SQS fan-out pattern is a fundamental distributed systems building block.`,
      quiz: [
        {
          question:
            "What happens to an SNS message if delivery to a subscriber endpoint fails after all retry attempts are exhausted?",
          options: [
            "SNS automatically re-publishes the message to the topic for redelivery",
            "The message is permanently lost unless a Dead Letter Queue (DLQ) is configured on the subscription",
            "SNS stores the message for 14 days and retries delivery indefinitely",
            "SNS sends an alert to the AWS account root email address",
          ],
          correctIndex: 1,
          explanation:
            "If SNS exhausts all retry attempts without successful delivery, the message is permanently lost unless a Dead Letter Queue (DLQ) is configured on the subscription. With a DLQ, failed messages are sent there so they can be inspected and replayed.",
        },
      ],
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

  topicQuiz: [
    {
      question: "What messaging pattern does Amazon SNS implement?",
      options: [
        "Point-to-point queuing, where each message goes to exactly one consumer",
        "Publish/subscribe (pub/sub), where messages are delivered to all subscribers of a topic",
        "Request/reply, where the publisher waits for each subscriber to respond",
        "Streaming, where messages are stored in an ordered log for replay",
      ],
      correctIndex: 1,
      explanation:
        "SNS implements the publish/subscribe (pub/sub) pattern. A publisher sends a message to a topic and SNS delivers it to all subscribers simultaneously (fan-out). The publisher does not know who subscribes or how many subscribers exist.",
    },
    {
      question:
        "Which of the following is NOT a valid SNS subscription protocol?",
      options: ["Amazon SQS", "AWS Lambda", "Amazon RDS", "HTTP/HTTPS"],
      correctIndex: 2,
      explanation:
        "Amazon RDS is not an SNS subscription protocol. Valid SNS subscription types include Email, Email-JSON, HTTP/HTTPS, Amazon SQS, AWS Lambda, SMS, and Mobile Push (APNs, FCM).",
    },
    {
      question:
        "A company publishes events to an SNS topic. They want multiple independent services to each receive and process every event without affecting one another. Which architecture should they use?",
      options: [
        "Subscribe all services directly to the SNS topic using Lambda subscriptions",
        "Use a single SQS FIFO queue with all services polling the same queue",
        "Use SNS + SQS fan-out: subscribe one SQS queue per service to the SNS topic",
        "Configure SNS message filtering so each service receives only its own events",
      ],
      correctIndex: 2,
      explanation:
        "The SNS + SQS fan-out pattern is the standard approach. Each service has its own SQS queue subscribed to the SNS topic. SNS delivers a copy of every message to each queue, and each service consumes its queue independently — ensuring isolation and resilience.",
    },
    {
      question: "What is the purpose of an SNS filter policy?",
      options: [
        "To encrypt messages before they are delivered to subscribers",
        "To limit the rate at which messages are published to a topic",
        "To allow subscribers to receive only messages that match specific attribute criteria",
        "To route messages to different topics based on their content",
      ],
      correctIndex: 2,
      explanation:
        "An SNS filter policy is a JSON document configured on a subscription that specifies attribute values that must match for a message to be delivered. This lets subscribers receive only the messages relevant to them from a single topic.",
    },
    {
      question:
        "How does Amazon SNS deliver messages to subscribers — push or pull?",
      options: [
        "Pull-based — subscribers poll the SNS topic for new messages",
        "Push-based — SNS pushes messages to subscriber endpoints automatically",
        "Both — subscribers can choose push or pull at subscription time",
        "Batch-based — SNS collects messages and delivers them in scheduled batches",
      ],
      correctIndex: 1,
      explanation:
        "SNS is push-based — it pushes messages to subscriber endpoints automatically when a message is published. This is the opposite of SQS, which is pull-based (consumers poll the queue for messages).",
    },
    {
      question:
        "A company needs to send the same order event to an inventory service, a fulfillment service, and a notification service simultaneously when an order is placed. What is the recommended AWS architecture?",
      options: [
        "Three separate SQS queues, with the order service making three separate API calls",
        "One SNS topic subscribed to by three SQS queues (fan-out pattern)",
        "One SQS FIFO queue shared by all three services",
        "AWS EventBridge with three separate event buses",
      ],
      correctIndex: 1,
      explanation:
        "The SNS + SQS fan-out pattern is ideal: the order service publishes once to an SNS topic, and SNS delivers the message to three SQS queues simultaneously. Each service consumes its own queue independently, providing loose coupling and resilience.",
    },
    {
      question:
        "Which SNS topic type guarantees strict message ordering and exactly-once delivery?",
      options: [
        "Standard topics with message deduplication enabled",
        "FIFO topics, which guarantee ordering and exactly-once delivery",
        "Ordered topics with sequence numbers assigned at publish time",
        "Priority topics with weighted delivery to subscribers",
      ],
      correctIndex: 1,
      explanation:
        "SNS FIFO (First In, First Out) topics guarantee strict message ordering and exactly-once delivery, similar to SQS FIFO queues. FIFO topics can only deliver to SQS FIFO queues.",
    },
    {
      question:
        "A team configures a Dead Letter Queue (DLQ) on an SNS subscription. When does SNS send a message to the DLQ?",
      options: [
        "When a message is published but no subscribers are currently active",
        "When SNS exhausts all retry attempts and still cannot deliver the message to the subscriber",
        "When a message exceeds the maximum message size limit for the subscription protocol",
        "When the subscriber explicitly rejects the message with an error response",
      ],
      correctIndex: 1,
      explanation:
        "SNS sends a message to the Dead Letter Queue when it exhausts all retry attempts without successfully delivering the message to the subscriber endpoint. This prevents message loss and allows failed deliveries to be inspected and replayed.",
    },
  ],
};
