import { ServiceGuide } from "../../../types/guide";

export const snsGuide: ServiceGuide = {
  id: "amazon-sns",
  service: "Amazon SNS",
  domain: "development",
  tagline: "Fully managed pub/sub messaging and mobile notifications",
  intro:
    "SNS is a fully managed pub/sub (publish-subscribe) service for both application-to-application (A2A) and application-to-person (A2P) messaging. Publishers send messages to topics; subscribers receive all messages (or filtered subsets).",

  sections: [
    {
      heading: "Topics & Message Flow",
      body: `SNS is built around **topics** — logical channels where publishers send messages and subscribers receive them. When a publisher sends a message to a topic, SNS fans it out to every subscription, delivering a copy to each subscriber simultaneously. This decoupling means publishers don't need to know which systems are listening, and subscribers don't need to coordinate with each other.

SNS offers two topic types with different guarantees. **Standard topics** provide high throughput and at-least-once delivery with best-effort ordering — messages may arrive slightly out of order or be delivered more than once. **FIFO topics** provide exactly-once delivery and strict ordering within a message group, but only SQS FIFO queues can be subscribers.

Publishing uses the \`Publish\` API with the topic ARN, a message body (up to 256 KB), an optional subject, and optional message attributes. For structured messaging where different subscriber protocols need different formats — for example, HTTP subscribers need a different format than SQS subscribers — you can pass the \`Message\` parameter as a JSON object with protocol-specific keys (\`default\`, \`email\`, \`sqs\`, \`lambda\`, \`http\`, \`sms\`). SNS delivers the appropriate format to each subscriber type.

\`\`\`typescript
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});

await sns.send(new PublishCommand({
  TopicArn: process.env.TOPIC_ARN,
  Message: JSON.stringify({ orderId: "o1", total: 49.99 }),
  // MessageAttributes drive subscription filter policies
  MessageAttributes: {
    type: { DataType: "String", StringValue: "ORDER_PLACED" },
    region: { DataType: "String", StringValue: "us-west" },
  },
}));
\`\`\``,
      quiz: [
        {
          question:
            "An application needs to deliver messages to multiple downstream systems simultaneously. Some systems require strict ordering and exactly-once delivery. Which SNS topic type supports exactly-once delivery?",
          options: [
            "Standard topic with deduplication enabled",
            "Standard topic with MessageGroupId set",
            "Standard topic with at-least-once delivery disabled",
            "FIFO topic",
          ],
          correctIndex: 3,
          explanation:
            "SNS FIFO topics guarantee exactly-once delivery and strict ordering within a message group. Standard topics provide at-least-once delivery with best-effort ordering and do not offer deduplication.",
        },
        {
          question:
            "A publisher needs to send different message formats to HTTP subscribers and SQS subscribers from the same SNS topic. What feature enables this?",
          options: [
            "Subscription filter policies per subscriber",
            "Message structure with protocol-specific keys (e.g., 'sqs', 'http')",
            "Separate SNS topics per subscriber protocol",
            "MessageAttributes with protocol routing values",
          ],
          correctIndex: 1,
          explanation:
            "SNS supports structured messaging by passing the Message parameter as a JSON object with protocol-specific keys (default, email, sqs, lambda, http, sms). SNS delivers the appropriate format to each subscriber type automatically.",
        },
        {
          question:
            "What is the maximum message size for an SNS message published via the Publish API?",
          options: ["64 KB", "128 KB", "1 MB", "256 KB"],
          correctIndex: 3,
          explanation:
            "SNS supports a maximum message body size of 256 KB. This is consistent with SQS's message size limit, making the two services compatible in fan-out patterns.",
        },
      ],
    },
    {
      heading: "Subscription Types",
      body: `SNS supports a wide range of subscriber types, covering both application-to-application and application-to-person notification scenarios.

**SQS** is the most common A2A target. SNS delivers a copy of the message to each subscribed SQS queue, which the queue's consumer then processes independently. This combination — SNS for fan-out, SQS for durable buffering — is the canonical AWS pattern for reliable message delivery to multiple independent consumers. **Lambda** is the choice for real-time processing without buffering: SNS invokes the Lambda function asynchronously for each message, and Lambda's own retry and DLQ mechanisms handle failures.

**HTTP/HTTPS** subscriptions deliver messages via POST to an endpoint — useful for webhooks to third-party services. The endpoint must confirm the subscription by responding to a confirmation URL that SNS sends during subscription creation. **Email** and **Email-JSON** subscriptions deliver messages to email addresses, primarily used for alerting and human notification rather than application integration. **SMS** sends text messages to mobile phone numbers directly or through Amazon Pinpoint for advanced targeting and delivery tracking.

**Amazon Kinesis Data Firehose** lets SNS deliver high-volume events to a Firehose delivery stream without custom consumer code, from where Firehose delivers to S3, Redshift, or OpenSearch. **Mobile Push** (APNS for iOS, FCM for Android, ADM for Kindle) sends push notifications to mobile devices via platform-specific push notification services — SNS manages the platform-specific endpoints through platform application resources.`,
      quiz: [
        {
          question:
            "A team wants SNS to deliver messages to a third-party webhook endpoint. The endpoint must first verify the subscription before receiving messages. Which subscription type requires this confirmation step?",
          options: [
            "Lambda subscription",
            "HTTP/HTTPS subscription",
            "SQS subscription",
            "Email subscription",
          ],
          correctIndex: 1,
          explanation:
            "HTTP/HTTPS subscriptions require the endpoint to confirm the subscription by responding to a confirmation URL SNS sends during subscription creation. SQS and Lambda subscriptions do not require this manual confirmation step.",
        },
        {
          question:
            "A mobile application needs to send push notifications to iOS devices. Which SNS mobile push integration should be used?",
          options: [
            "SMS via Amazon Pinpoint",
            "ADM (Amazon Device Messaging)",
            "FCM (Firebase Cloud Messaging)",
            "APNS (Apple Push Notification Service)",
          ],
          correctIndex: 3,
          explanation:
            "APNS (Apple Push Notification Service) is the platform-specific push service for iOS devices. FCM is for Android and ADM is for Kindle devices. SNS manages platform endpoints through platform application resources.",
        },
        {
          question:
            "An architecture needs SNS to deliver high-volume events to Amazon S3 for archival without writing custom consumer code. Which SNS subscription type supports this?",
          options: [
            "Amazon Kinesis Data Firehose subscription",
            "SQS subscription with S3 event notification",
            "Lambda subscription writing to S3",
            "HTTP subscription posting to an S3 pre-signed URL",
          ],
          correctIndex: 0,
          explanation:
            "SNS supports Amazon Kinesis Data Firehose as a subscription target. Firehose then delivers the data to S3, Redshift, or OpenSearch without any custom consumer code needed.",
        },
      ],
    },
    {
      heading: "Message Filtering",
      body: `By default, every SNS subscriber receives every message published to the topic. **Subscription filter policies** let each subscriber declare which messages it wants, so SNS delivers only the relevant subset rather than every message.

Filter policies are JSON documents attached to the subscription (not the topic) that specify which \`MessageAttribute\` values must be present for the message to be delivered. Each subscriber can have a completely different filter policy — a single SNS topic can effectively route messages to different subscribers based on content, eliminating the need for multiple separate topics for different message types.

Filter conditions support several matching operators: exact string match (\`["value"]\`), prefix match (\`[{"prefix": "val"}]\`), numeric comparison (\`[{"numeric": [">", 100]}]\`), existence check (\`[{"exists": true}]\`), and anything-but exclusion (\`[{"anything-but": ["value"]}]\`). A practical example: an order processing topic where the fulfillment service subscribes with \`{"type": ["ORDER_PLACED"]}\`, the billing service subscribes with \`{"type": ["ORDER_PLACED", "ORDER_REFUNDED"]}\`, and the analytics service has no filter and receives all messages. Each service declares its own interest independently, and publishers don't need to know about these routing rules at all.

\`\`\`json
// Fulfillment queue — only ORDER_PLACED events
{ "type": ["ORDER_PLACED"] }

// Billing queue — placed and refunded
{ "type": ["ORDER_PLACED", "ORDER_REFUNDED"] }

// Fraud queue — high-value orders only (numeric match)
{ "type": ["ORDER_PLACED"], "total": [{ "numeric": [">", 1000] }] }
\`\`\`

The key constraint: filtering works on \`MessageAttributes\` — structured metadata attached to the message — not on the message body itself. If you need content-based routing based on fields within the message body, EventBridge is better suited, as it can match against any JSON field in the event payload.`,
      quiz: [
        {
          question: "Where is a subscription filter policy attached in SNS?",
          options: [
            "On each individual subscription",
            "On the published message itself",
            "On the IAM policy of the subscriber",
            "On the SNS topic, applying to all subscribers",
          ],
          correctIndex: 0,
          explanation:
            "Filter policies are attached per subscription, not per topic. This means each subscriber can independently declare which messages it wants, and a single topic can route different message types to different subscribers.",
        },
        {
          question:
            "A developer needs SNS to route messages to different subscribers based on fields inside the JSON message body. What is the correct approach?",
          options: [
            "Use SNS subscription filter policies with body-based matching operators",
            "Use SNS FIFO topics which support body-based filtering",
            "Use SNS MessageAttributes and filter policies, since filtering works on attributes not the body",
            "Create separate SNS topics for each message type",
          ],
          correctIndex: 2,
          explanation:
            "SNS subscription filter policies work on MessageAttributes — structured metadata — not on the message body. If routing must be based on JSON body fields, Amazon EventBridge is the better choice as it can match any JSON field in the event payload.",
        },
        {
          question:
            "A billing service should receive ORDER_PLACED and ORDER_REFUNDED events, but not ORDER_CANCELLED. Which filter policy condition achieves this?",
          options: [
            '{"type": [{"anything-but": ["ORDER_CANCELLED"]}]}',
            '{"type": ["ORDER_PLACED", "ORDER_REFUNDED"]}',
            '{"type": [{"prefix": "ORDER"}]}',
            '{"type": [{"exists": true}]}',
          ],
          correctIndex: 1,
          explanation:
            'The exact string match filter {"type": ["ORDER_PLACED", "ORDER_REFUNDED"]} delivers only messages where the type attribute matches either of those two values. The anything-but approach would also exclude ORDER_CANCELLED but would accept any other type value, making it less precise.',
        },
      ],
    },
    {
      heading: "Fan-out Pattern",
      body: `The **SNS + SQS fan-out pattern** is one of the most fundamental architectural patterns in AWS, and understanding when and why to use it is important both for designing real systems and for the exam.

The pattern works in three steps: a publisher sends one message to an SNS topic, SNS delivers a copy to each subscribed SQS queue, and each consumer processes independently from its own queue. The result is that a single publish operation creates durable, independently-consumable copies for every downstream system.

The pattern solves several problems at once. Publishers are completely decoupled from consumers — you can add a new consumer by subscribing a new SQS queue without touching publisher code or notifying it of the change. Each consumer processes at its own pace, with SQS providing the buffering so a slow consumer doesn't block other consumers or cause the publisher to wait. Each queue can have its own DLQ for messages that fail processing, so a bug in one consumer doesn't affect others. And because each consumer has its own queue, they can scale independently based on their own queue depth.

A concrete example illustrates the value: when an e-commerce order is placed, the publisher sends one message to an SNS topic. SNS delivers it simultaneously to an inventory SQS queue, a billing SQS queue, a shipping SQS queue, and an analytics SQS queue. Each of those four systems processes it independently — at different speeds, with different retry policies, using different compute resources — and none of them knows about the others.`,
      quiz: [
        {
          question:
            "An order service publishes a single event that must be processed independently by an inventory system, a billing system, and a shipping system — each at their own pace with their own retry policies. What is the correct AWS pattern?",
          options: [
            "SNS topic with three SQS queue subscriptions (fan-out pattern)",
            "One SQS queue shared by all three consumer services",
            "Three separate SNS topics, one per consumer service",
            "EventBridge bus with three Lambda targets",
          ],
          correctIndex: 0,
          explanation:
            "The SNS + SQS fan-out pattern solves this: one message to an SNS topic is delivered to each subscribed SQS queue simultaneously. Each queue provides durable buffering so consumers process independently at their own pace with their own DLQ and retry configuration.",
        },
        {
          question:
            "In the SNS + SQS fan-out pattern, what happens when you need to add a new downstream consumer service?",
          options: [
            "A new SQS queue is subscribed to the existing SNS topic — no publisher changes needed",
            "The existing SQS queue must be reconfigured to forward to the new service",
            "A new SNS topic must be created for the new consumer",
            "The publisher code must be updated to send to the new consumer",
          ],
          correctIndex: 0,
          explanation:
            "The fan-out pattern completely decouples publishers from consumers. Adding a new consumer means subscribing a new SQS queue to the SNS topic — publishers are unaware of the change and require no code modifications.",
        },
        {
          question:
            "Why does the SNS + SQS fan-out pattern use a separate SQS queue per consumer rather than one shared queue?",
          options: [
            "SQS does not support multiple consumers on a single queue",
            "Each queue gives each consumer its own durable buffer, retry policy, and DLQ so a slow or failing consumer cannot affect others",
            "SNS can only deliver to one SQS queue at a time",
            "A shared queue would violate SQS FIFO ordering requirements",
          ],
          correctIndex: 1,
          explanation:
            "Each consumer having its own queue means it processes at its own pace without blocking others, can have its own DLQ for failed messages, and can scale independently. A shared queue would mean consumers compete for messages rather than each receiving a full copy.",
        },
      ],
    },
    {
      heading: "Message Delivery & Reliability",
      body: `SNS's reliability characteristics vary by subscription type, and understanding these differences helps you choose the right architecture for your durability requirements.

For **HTTP/HTTPS** subscriptions, SNS implements a configurable retry policy with exponential backoff: an initial delivery attempt, followed by immediate retries, a pre-backoff phase, a backoff phase with increasing intervals, and post-backoff retries. The total retry period is configurable. If all retries are exhausted, SNS can route the undelivered message to a **subscription DLQ** — an SQS queue you specify at the subscription level (not the topic level). This captures messages that SNS could not deliver to a specific endpoint, letting you inspect and reprocess them.

**SQS and Lambda** subscriptions handle their own retry and DLQ logic, since those services have retry mechanisms built in. For SQS, the message sits in the queue until successfully processed, regardless of SNS's delivery behavior — once SNS delivers to the queue, the queue owns the durability guarantee. For Lambda, SNS invokes asynchronously and Lambda's own destination and DLQ configuration handles failures.

**Delivery status logging** is a useful operational feature: enable it per subscription type to have SNS log success and failure status for each delivery attempt to CloudWatch Logs. This gives you visibility into delivery failures without having to correlate consumer-side logs with SNS behavior — you can see directly that SNS attempted delivery and whether it succeeded. SNS FIFO topics also support message archiving, allowing replay of messages to new or existing subscriptions for debugging or recovery scenarios.`,
      quiz: [
        {
          question:
            "SNS fails to deliver a message to an HTTP endpoint after all retry attempts. Where can the undelivered message be captured for later inspection?",
          options: [
            "The message is automatically retried indefinitely",
            "CloudWatch Logs automatically stores failed messages",
            "The SNS topic's DLQ",
            "The subscription-level DLQ (an SQS queue specified on the subscription)",
          ],
          correctIndex: 3,
          explanation:
            "SNS supports a subscription DLQ — an SQS queue specified at the subscription level (not the topic level). When all retry attempts for an HTTP/HTTPS subscription are exhausted, SNS routes the undelivered message to this DLQ for inspection and reprocessing.",
        },
        {
          question:
            "How does SNS handle delivery failures for SQS and Lambda subscriptions compared to HTTP subscriptions?",
          options: [
            "SNS uses the same retry policy with exponential backoff for all subscription types",
            "SQS and Lambda handle their own retry and DLQ logic; SNS just delivers to them",
            "SNS does not retry for SQS or Lambda subscriptions",
            "SNS FIFO topics automatically replay failed messages to SQS subscribers",
          ],
          correctIndex: 1,
          explanation:
            "SQS and Lambda have their own built-in retry and DLQ mechanisms. Once SNS delivers a message to an SQS queue, the queue owns the durability guarantee. For Lambda, SNS invokes asynchronously and Lambda's destination/DLQ configuration handles failures independently.",
        },
        {
          question:
            "A team wants visibility into whether SNS successfully delivered messages to each subscriber type without correlating consumer-side logs. What SNS feature provides this?",
          options: [
            "SNS message archiving on FIFO topics",
            "Subscription filter policy logging",
            "CloudTrail logging of SNS Publish API calls",
            "Delivery status logging to CloudWatch Logs",
          ],
          correctIndex: 3,
          explanation:
            "Delivery status logging can be enabled per subscription type to have SNS log success and failure status for each delivery attempt to CloudWatch Logs. This provides direct visibility into SNS-side delivery behavior without needing to correlate consumer logs.",
        },
      ],
    },
    {
      heading: "Security",
      body: `SNS access control follows the same pattern as other AWS services: resource-based policies on the topic combined with IAM identity policies on the calling principal. For single-account use, IAM policies alone can control who publishes and who subscribes. For cross-account publishing — where an account in another AWS account needs to publish to your topic — the topic policy must explicitly allow that account's principal, and the publisher's IAM policy must allow the \`sns:Publish\` action.

**Encryption at rest** uses either SSE-SNS (an SNS-managed key, free) or SSE-KMS (your customer managed key). SSE-KMS adds CloudTrail audit logging of every encrypt and decrypt operation on the topic and enables cross-account key sharing for scenarios where multiple accounts share a topic. **Encryption in transit** is provided by HTTPS for all SNS API calls and for HTTPS subscriber endpoints.

For VPC-private architectures where you want to publish to SNS without internet traffic, SNS supports **VPC Interface Endpoints** via AWS PrivateLink. Creating an interface endpoint for the \`sns\` service in your VPC routes SNS API calls through the AWS private network rather than through NAT Gateway and the public internet — useful for Lambda functions and ECS tasks in private subnets that need to publish messages without exposing them to the internet.`,
      quiz: [
        {
          question:
            "An application in Account B needs to publish messages to an SNS topic owned by Account A. What access control configuration is required?",
          options: [
            "Both: a topic resource policy in Account A allowing Account B's principal, AND an IAM policy in Account B allowing sns:Publish",
            "An SNS subscription from Account B's queue to Account A's topic",
            "Only an IAM policy in Account B allowing sns:Publish",
            "Only a topic resource policy in Account A allowing Account B's principal",
          ],
          correctIndex: 0,
          explanation:
            "Cross-account SNS publishing requires both: the topic's resource-based policy in Account A must explicitly allow the Account B principal, and the IAM identity policy in Account B must grant sns:Publish. Both must allow the action for the request to succeed.",
        },
        {
          question:
            "A Lambda function in a private VPC subnet needs to publish SNS messages without routing traffic through the public internet. What is the correct solution?",
          options: [
            "Create a VPC Interface Endpoint for SNS using AWS PrivateLink",
            "Deploy the Lambda function outside the VPC",
            "Configure a NAT Gateway in the VPC",
            "Use an SNS FIFO topic which supports private routing",
          ],
          correctIndex: 0,
          explanation:
            "SNS supports VPC Interface Endpoints via AWS PrivateLink. Creating an interface endpoint for the sns service routes all SNS API calls through the AWS private network, eliminating the need for a NAT Gateway and keeping traffic off the public internet.",
        },
        {
          question:
            "What benefit does SSE-KMS provide over SSE-SNS for encrypting an SNS topic?",
          options: [
            "SSE-KMS enables FIFO topic functionality",
            "SSE-KMS is free while SSE-SNS has a per-message cost",
            "SSE-KMS supports larger message sizes than SSE-SNS",
            "SSE-KMS adds CloudTrail audit logging of every encrypt/decrypt operation and enables cross-account key sharing",
          ],
          correctIndex: 3,
          explanation:
            "SSE-KMS uses a customer managed key and adds CloudTrail audit logging of every encrypt and decrypt operation on the topic, plus enables cross-account key sharing. SSE-SNS uses an SNS-managed key and is free but lacks the audit trail and cross-account sharing capabilities.",
        },
      ],
    },
    {
      heading: "SNS with Other Services",
      body: `**SNS + SQS** is the foundational fan-out pattern: one SNS topic delivers to multiple SQS queues, giving each consumer its own durable buffer, retry policy, and DLQ. This is the most reliable way to fan out to multiple independent consumers.

**SNS + Lambda** provides real-time push delivery without the queue overhead. SNS invokes Lambda asynchronously, making it appropriate for lightweight processing that should happen immediately — sending a confirmation email, triggering a webhook, updating a real-time dashboard. Lambda's asynchronous invocation queue provides limited buffering for traffic spikes, but for sustained high throughput the SNS → SQS → Lambda pattern is more reliable.

**SNS + CloudWatch Alarms** is the standard operations notification pattern. A CloudWatch alarm for high CPU, error rate, or latency publishes to an SNS topic when it fires, which delivers email notifications to the ops team, triggers a Lambda for automated remediation, or sends an alert to a PagerDuty HTTP endpoint via direct subscription. The SNS topic becomes the single alert bus for the environment.

**SNS + EventBridge** represents a choice point in your architecture. EventBridge can target SNS topics as rule destinations, and SNS can deliver to EventBridge via HTTP subscription. In practice, EventBridge is often the better choice for A2A routing because its content-based filtering works on any JSON field in the event (not just MessageAttributes), and it supports 20+ native target types, cross-account delivery, and event archiving. SNS remains the right choice for A2P messaging (email, SMS, mobile push) and for the classic fan-out-to-SQS-queues pattern where its lower latency and higher throughput matter.`,
      quiz: [
        {
          question:
            "When should you choose SNS + Lambda directly over the SNS → SQS → Lambda pattern?",
          options: [
            "When exactly-once processing is required",
            "When the Lambda function has a long execution time exceeding 15 minutes",
            "For real-time lightweight processing that should happen immediately with low traffic volume",
            "When you need durable buffering and the processing must handle sustained high throughput",
          ],
          correctIndex: 2,
          explanation:
            "SNS + Lambda directly is appropriate for real-time lightweight processing (e.g., sending a confirmation email, triggering a webhook) where immediate delivery matters and traffic is not sustained at high volume. For sustained high throughput, SNS → SQS → Lambda is more reliable because SQS provides durable buffering.",
        },
        {
          question:
            "A team needs content-based event routing that matches on fields inside the JSON event payload, with delivery to more than 20 different target service types. Which service is better suited than SNS?",
          options: [
            "Amazon SQS with message attributes",
            "AWS Step Functions",
            "Amazon Kinesis Data Streams",
            "Amazon EventBridge",
          ],
          correctIndex: 3,
          explanation:
            "EventBridge supports content-based filtering on any JSON field in the event payload (not just MessageAttributes), supports 20+ native target types, cross-account delivery, and event archiving. SNS filtering is limited to MessageAttributes and has fewer native target types.",
        },
        {
          question:
            "A CloudWatch alarm for high Lambda error rate fires. The team wants the alarm to notify engineers by email AND trigger an automated remediation Lambda. What is the most straightforward architecture?",
          options: [
            "CloudWatch alarm → two separate SNS topics, one per action",
            "CloudWatch alarm → one SNS topic with an email subscription and a Lambda subscription",
            "CloudWatch alarm → EventBridge rule → Lambda, and a separate email notification",
            "CloudWatch alarm → SQS queue → Lambda for remediation",
          ],
          correctIndex: 1,
          explanation:
            "A single SNS topic acts as the alert bus. The CloudWatch alarm publishes to the topic when it fires, and the topic fans out simultaneously to an email subscription (notifying engineers) and a Lambda subscription (triggering remediation). This is the standard operations notification pattern.",
        },
      ],
    },
  ],

  keyFacts: [
    "Max message size: 256 KB",
    "Standard topic: high throughput, at-least-once, best-effort order",
    "FIFO topic: exactly-once, strict order; SQS FIFO subscribers only",
    "Filter policies are per subscription, not per topic",
    "Fan-out: SNS → multiple SQS queues (each gets a full copy)",
    "Subscription DLQ: SQS queue capturing failed deliveries",
    "Delivery retries configurable for HTTP/HTTPS subscribers",
    "Mobile push: APNS (iOS), FCM (Android) via platform endpoints",
    "Message attributes are key to subscription filtering",
    "SNS FIFO supports message archiving and replay",
  ],

  relatedServices: [
    "Amazon SQS",
    "AWS Lambda",
    "Amazon EventBridge",
    "Amazon Kinesis Data Firehose",
    "Amazon CloudWatch",
    "Amazon Pinpoint",
  ],

  examTips: [
    "Fan-out pattern: 1 SNS topic → multiple SQS queues. Each SQS queue = independent consumer.",
    "Subscription filter policy is on the subscription, not the topic.",
    "SNS FIFO topics only support SQS FIFO queue subscribers.",
    "SNS + SQS for durability; SNS + Lambda for real-time (no buffering).",
    "Subscription DLQ captures messages SNS could not deliver after retries.",
    "MessageAttributes on published message must match filter policy for delivery.",
    "For cross-account SNS publish, the topic policy must allow the source account principal.",
  ],

  topicQuiz: [
    {
      question:
        "What is the maximum message size that can be published to an SNS topic?",
      options: ["64 KB", "128 KB", "256 KB", "1 MB"],
      correctIndex: 2,
      explanation:
        "SNS supports a maximum message size of 256 KB, consistent with SQS. For larger payloads, store the data in S3 and include an S3 reference in the SNS message.",
    },
    {
      question:
        "A team needs to deliver the same event to an inventory service, a billing service, and a shipping service. Each service must process independently with its own retry logic. Which pattern is correct?",
      options: [
        "One SQS queue with three consumer groups",
        "SNS FIFO topic with three Lambda subscriptions",
        "SNS Standard topic with three SQS queue subscriptions (fan-out)",
        "Three separate SNS topics, one published to per service",
      ],
      correctIndex: 2,
      explanation:
        "The SNS + SQS fan-out pattern delivers one SNS message to multiple SQS queues simultaneously. Each queue is independently consumed with its own retry policy and DLQ, giving each service full isolation.",
    },
    {
      question:
        "An SNS subscription filter policy is attached to which resource?",
      options: [
        "The SNS topic, applying globally to all subscribers",
        "The published message by the publisher",
        "The subscriber's IAM role",
        "Each individual subscription",
      ],
      correctIndex: 3,
      explanation:
        "Subscription filter policies are attached per subscription, not per topic. Each subscriber independently declares which messages it wants to receive based on MessageAttribute values.",
    },
    {
      question:
        "Which SNS FIFO topic constraint must architects be aware of when designing subscribers?",
      options: [
        "FIFO topics support all subscriber types including email and SMS",
        "FIFO topics only support SQS FIFO queue subscribers",
        "FIFO topics support Lambda subscribers but not SQS subscribers",
        "FIFO topics require HTTP/HTTPS subscriber confirmation",
      ],
      correctIndex: 1,
      explanation:
        "SNS FIFO topics only support SQS FIFO queues as subscribers. This is a key constraint — if you need exactly-once ordered messaging through SNS, every downstream subscriber must use an SQS FIFO queue.",
    },
    {
      question:
        "SNS fails to deliver a message to an HTTP endpoint after exhausting all retries. What captures the undelivered message?",
      options: [
        "The SNS topic DLQ",
        "CloudWatch Logs automatically",
        "The subscription-level DLQ (SQS queue specified on the subscription)",
        "The message is discarded with no capture mechanism",
      ],
      correctIndex: 2,
      explanation:
        "SNS supports a subscription DLQ — an SQS queue configured at the subscription level. When delivery to an HTTP/HTTPS endpoint fails after all retries, SNS routes the message to this DLQ for inspection and reprocessing.",
    },
    {
      question:
        "A developer needs to route messages to different SNS subscribers based on a field inside the JSON message body. What is the recommended approach?",
      options: [
        "Use SNS FIFO topics which enable body-based routing",
        "Use SNS subscription filter policies with body-based matching",
        "Use Amazon EventBridge, which supports filtering on any JSON field in the event payload",
        "Add a separate SNS topic per message type",
      ],
      correctIndex: 2,
      explanation:
        "SNS subscription filter policies work on MessageAttributes only, not on the message body. Amazon EventBridge supports content-based filtering on any JSON field in the event payload, making it the correct choice for body-based routing.",
    },
    {
      question:
        "A Lambda function in a private VPC subnet must publish to SNS without using a NAT Gateway. What is the solution?",
      options: [
        "Enable SNS VPC Flow Logs to bypass NAT",
        "Move the Lambda function outside the VPC",
        "Use SNS FIFO topics which support VPC-native routing",
        "Create a VPC Interface Endpoint for SNS via AWS PrivateLink",
      ],
      correctIndex: 3,
      explanation:
        "SNS supports VPC Interface Endpoints via AWS PrivateLink. The interface endpoint routes SNS API calls through the AWS private network, eliminating the need for a NAT Gateway and keeping traffic private.",
    },
    {
      question:
        "Which access control components are BOTH required for cross-account SNS publishing?",
      options: [
        "Only the IAM policy in the publishing account",
        "SNS topic resource policy in the owning account AND IAM policy in the publishing account",
        "Only the SNS topic resource policy in the owning account",
        "An SQS queue subscription between the two accounts",
      ],
      correctIndex: 1,
      explanation:
        "Cross-account SNS publishing requires both: the topic's resource-based policy must explicitly allow the external account's principal, AND the publisher's IAM policy must grant sns:Publish. Both policies must allow the action for the request to succeed.",
    },
  ],
};
