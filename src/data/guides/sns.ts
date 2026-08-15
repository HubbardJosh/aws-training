import { ServiceGuide } from "../../types/guide";

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
      body: `**Topics**: logical access points and communication channels. Publishers send messages to topics; SNS fans out to all subscribers.

**Standard Topics**: high throughput, at-least-once delivery, best-effort ordering.
**FIFO Topics**: exactly-once delivery, strict message ordering (works only with SQS FIFO queues as subscribers).

**Publishing**: use the \`Publish\` API with the topic ARN, message body (up to **256 KB**), optional subject, and optional message attributes. For large messages, publish a reference to S3.

**Message structure**: message body is a string. For **structured messaging** (different formats per protocol), use the \`Message\` parameter as a JSON object with keys matching subscription protocols (\`default\`, \`email\`, \`sqs\`, \`lambda\`, \`http\`, \`sms\`).`,
    },
    {
      heading: "Subscription Types",
      body: `**SQS**: most common A2A target. SNS delivers to one or more SQS queues. Enables fan-out + buffering + retry.

**Lambda**: SNS invokes Lambda asynchronously. Lambda retries on failure. No message buffering — Lambda must be available.

**HTTP/HTTPS**: SNS delivers via POST to an endpoint. Must confirm subscription by visiting a confirmation URL. Good for webhooks to third-party services.

**Email / Email-JSON**: deliver messages to email addresses. Requires subscription confirmation. Used for alerting; not for application integration.

**SMS**: send text messages to mobile phones. Directly via SNS or via Amazon Pinpoint for advanced targeting.

**Amazon Kinesis Data Firehose**: deliver SNS messages to Kinesis Firehose for streaming to S3, Redshift, or OpenSearch.

**Mobile Push (APNS, FCM, ADM)**: send push notifications to iOS (Apple Push Notification Service), Android (Firebase Cloud Messaging), and other mobile platforms via platform application endpoints.`,
    },
    {
      heading: "Message Filtering",
      body: `**Subscription filter policies**: JSON policy on the subscription (not the topic). Subscribers receive only messages whose **MessageAttributes** match the filter.

Each subscriber can have a different filter — fine-grained routing without multiple topics.

**Filter conditions**:
- String: exact match \`["value"]\`, prefix \`[{"prefix": "val"}]\`
- Numeric: range \`[{"numeric": [">", 100]}]\`, equality
- Exists: \`[{"exists": true/false}]\`
- Anything-but: \`[{"anything-but": ["value"]}]\`

**Example**: order topic with filter — fulfillment service gets \`{"type": ["ORDER_PLACED"]}\`, billing gets \`{"type": ["ORDER_PLACED", "ORDER_REFUNDED"]}\`, analytics gets no filter (all messages).

Without filtering, every subscriber receives every message. Filtering reduces unnecessary deliveries and costs.`,
    },
    {
      heading: "Fan-out Pattern",
      body: `The **SNS + SQS fan-out pattern** is one of the most important patterns in AWS architecture:

1. Publisher sends one message to an SNS topic.
2. SNS delivers a copy to each subscribed SQS queue.
3. Each consumer independently processes from its own queue.

**Benefits**:
- Publishers don't know about consumers (loose coupling).
- Each consumer processes at its own pace (independent scaling).
- SQS provides buffering, retry, and DLQ for each consumer.
- Add new consumers by subscribing a new SQS queue — no publisher changes needed.

**Example**: e-commerce order placed → SNS → [inventory SQS, billing SQS, shipping SQS, analytics SQS]. Each service processes independently.`,
    },
    {
      heading: "Message Delivery & Reliability",
      body: `**Delivery retries**: SNS retries failed HTTP/HTTPS deliveries with exponential backoff. Configure retry policy (immediate retries, pre-backoff phase, backoff phase, post-backoff retries).

**Dead Letter Queue for subscriptions**: attach an SQS queue as a DLQ for an SNS subscription. Messages that fail delivery after all retries go to the DLQ. Set per subscription.

**Message durability**: SNS stores messages across multiple AZs during delivery. If a subscriber is unavailable, SNS retries (for HTTP/HTTPS; SQS and Lambda handle their own retry/DLQ).

**Delivery status logging**: enable for Lambda, SQS, HTTP, and mobile push. SNS logs success/failure to CloudWatch Logs. Monitor delivery rates and identify failures.

**Message archiving**: SNS FIFO topics support message archiving. Replay messages to new or existing subscriptions.`,
    },
    {
      heading: "Security",
      body: `**Access control**: SNS topic policy (resource-based) + IAM identity policies. For cross-account publishing or subscribing, use topic policy with explicit account principal.

**Encryption at rest**: SSE-SNS (managed) or SSE-KMS (your CMK). KMS adds audit trail and cross-account key sharing capability.

**VPC access**: SNS does not have a VPC endpoint by default but you can create an Interface Endpoint for \`sns\` to publish from within a VPC without NAT Gateway.

**HTTPS**: SNS supports HTTPS for all communication. Enforce HTTPS for HTTP subscribers via subscription policy.`,
    },
    {
      heading: "SNS with Other Services",
      body: `**SNS + SQS**: fan-out. Multiple SQS queues subscribe to one SNS topic. Each gets all (or filtered) messages.

**SNS + Lambda**: event-driven processing. SNS async invokes Lambda. Lambda retries on failure. Good for lightweight real-time processing.

**SNS + CloudWatch Alarms**: CloudWatch alarms publish to SNS topics when thresholds are breached. SNS sends email, SMS, or triggers Lambda for auto-remediation.

**SNS + EventBridge**: SNS can deliver to EventBridge (via HTTP subscription). Alternatively, EventBridge rules can target SNS topics. EventBridge is often preferred over SNS for A2A routing due to richer filtering.

**SNS + Kinesis Firehose**: SNS delivers high-volume events to Firehose for streaming delivery to S3, Redshift, or OpenSearch without custom consumer code.`,
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
};
