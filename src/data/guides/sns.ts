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
      body: `SNS is built around **topics** — logical channels where publishers send messages and subscribers receive them. When a publisher sends a message to a topic, SNS fans it out to every subscription, delivering a copy to each subscriber simultaneously. This decoupling means publishers don't need to know which systems are listening, and subscribers don't need to coordinate with each other.

SNS offers two topic types with different guarantees. **Standard topics** provide high throughput and at-least-once delivery with best-effort ordering — messages may arrive slightly out of order or be delivered more than once. **FIFO topics** provide exactly-once delivery and strict ordering within a message group, but only SQS FIFO queues can be subscribers.

Publishing uses the \`Publish\` API with the topic ARN, a message body (up to 256 KB), an optional subject, and optional message attributes. For structured messaging where different subscriber protocols need different formats — for example, HTTP subscribers need a different format than SQS subscribers — you can pass the \`Message\` parameter as a JSON object with protocol-specific keys (\`default\`, \`email\`, \`sqs\`, \`lambda\`, \`http\`, \`sms\`). SNS delivers the appropriate format to each subscriber type.

\`\`\`typescript
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const client = new SNSClient({});

// MessageAttributes are the values subscription filter policies match against
await client.send(
  new PublishCommand({
    TopicArn: process.env.TOPIC_ARN,
    Message: JSON.stringify({ orderId: "ord-123", total: 49.99 }),
    MessageAttributes: {
      type: { DataType: "String", StringValue: "ORDER_PLACED" },
      region: { DataType: "String", StringValue: "us-east" },
    },
  })
);
\`\`\``,
    },
    {
      heading: "Subscription Types",
      body: `SNS supports a wide range of subscriber types, covering both application-to-application and application-to-person notification scenarios.

**SQS** is the most common A2A target. SNS delivers a copy of the message to each subscribed SQS queue, which the queue's consumer then processes independently. This combination — SNS for fan-out, SQS for durable buffering — is the canonical AWS pattern for reliable message delivery to multiple independent consumers. **Lambda** is the choice for real-time processing without buffering: SNS invokes the Lambda function asynchronously for each message, and Lambda's own retry and DLQ mechanisms handle failures.

**HTTP/HTTPS** subscriptions deliver messages via POST to an endpoint — useful for webhooks to third-party services. The endpoint must confirm the subscription by responding to a confirmation URL that SNS sends during subscription creation. **Email** and **Email-JSON** subscriptions deliver messages to email addresses, primarily used for alerting and human notification rather than application integration. **SMS** sends text messages to mobile phone numbers directly or through Amazon Pinpoint for advanced targeting and delivery tracking.

**Amazon Kinesis Data Firehose** lets SNS deliver high-volume events to a Firehose delivery stream without custom consumer code, from where Firehose delivers to S3, Redshift, or OpenSearch. **Mobile Push** (APNS for iOS, FCM for Android, ADM for Kindle) sends push notifications to mobile devices via platform-specific push notification services — SNS manages the platform-specific endpoints through platform application resources.`,
    },
    {
      heading: "Message Filtering",
      body: `By default, every SNS subscriber receives every message published to the topic. **Subscription filter policies** let each subscriber declare which messages it wants, so SNS delivers only the relevant subset rather than every message.

Filter policies are JSON documents attached to the subscription (not the topic) that specify which \`MessageAttribute\` values must be present for the message to be delivered. Each subscriber can have a completely different filter policy — a single SNS topic can effectively route messages to different subscribers based on content, eliminating the need for multiple separate topics for different message types.

Filter conditions support several matching operators: exact string match (\`["value"]\`), prefix match (\`[{"prefix": "val"}]\`), numeric comparison (\`[{"numeric": [">", 100]}]\`), existence check (\`[{"exists": true}]\`), and anything-but exclusion (\`[{"anything-but": ["value"]}]\`). A practical example: an order processing topic where the fulfillment service subscribes with \`{"type": ["ORDER_PLACED"]}\`, the billing service subscribes with \`{"type": ["ORDER_PLACED", "ORDER_REFUNDED"]}\`, and the analytics service has no filter and receives all messages. Each service declares its own interest independently, and publishers don't need to know about these routing rules at all.

The key constraint: filtering works on \`MessageAttributes\` — structured metadata attached to the message — not on the message body itself. If you need content-based routing based on fields within the message body, EventBridge is better suited, as it can match against any JSON field in the event payload.`,
    },
    {
      heading: "Fan-out Pattern",
      body: `The **SNS + SQS fan-out pattern** is one of the most fundamental architectural patterns in AWS, and understanding when and why to use it is important both for designing real systems and for the exam.

The pattern works in three steps: a publisher sends one message to an SNS topic, SNS delivers a copy to each subscribed SQS queue, and each consumer processes independently from its own queue. The result is that a single publish operation creates durable, independently-consumable copies for every downstream system.

The pattern solves several problems at once. Publishers are completely decoupled from consumers — you can add a new consumer by subscribing a new SQS queue without touching publisher code or notifying it of the change. Each consumer processes at its own pace, with SQS providing the buffering so a slow consumer doesn't block other consumers or cause the publisher to wait. Each queue can have its own DLQ for messages that fail processing, so a bug in one consumer doesn't affect others. And because each consumer has its own queue, they can scale independently based on their own queue depth.

A concrete example illustrates the value: when an e-commerce order is placed, the publisher sends one message to an SNS topic. SNS delivers it simultaneously to an inventory SQS queue, a billing SQS queue, a shipping SQS queue, and an analytics SQS queue. Each of those four systems processes it independently — at different speeds, with different retry policies, using different compute resources — and none of them knows about the others.`,
    },
    {
      heading: "Message Delivery & Reliability",
      body: `SNS's reliability characteristics vary by subscription type, and understanding these differences helps you choose the right architecture for your durability requirements.

For **HTTP/HTTPS** subscriptions, SNS implements a configurable retry policy with exponential backoff: an initial delivery attempt, followed by immediate retries, a pre-backoff phase, a backoff phase with increasing intervals, and post-backoff retries. The total retry period is configurable. If all retries are exhausted, SNS can route the undelivered message to a **subscription DLQ** — an SQS queue you specify at the subscription level (not the topic level). This captures messages that SNS could not deliver to a specific endpoint, letting you inspect and reprocess them.

**SQS and Lambda** subscriptions handle their own retry and DLQ logic, since those services have retry mechanisms built in. For SQS, the message sits in the queue until successfully processed, regardless of SNS's delivery behavior — once SNS delivers to the queue, the queue owns the durability guarantee. For Lambda, SNS invokes asynchronously and Lambda's own destination and DLQ configuration handles failures.

**Delivery status logging** is a useful operational feature: enable it per subscription type to have SNS log success and failure status for each delivery attempt to CloudWatch Logs. This gives you visibility into delivery failures without having to correlate consumer-side logs with SNS behavior — you can see directly that SNS attempted delivery and whether it succeeded. SNS FIFO topics also support message archiving, allowing replay of messages to new or existing subscriptions for debugging or recovery scenarios.`,
    },
    {
      heading: "Security",
      body: `SNS access control follows the same pattern as other AWS services: resource-based policies on the topic combined with IAM identity policies on the calling principal. For single-account use, IAM policies alone can control who publishes and who subscribes. For cross-account publishing — where an account in another AWS account needs to publish to your topic — the topic policy must explicitly allow that account's principal, and the publisher's IAM policy must allow the \`sns:Publish\` action.

**Encryption at rest** uses either SSE-SNS (an SNS-managed key, free) or SSE-KMS (your customer managed key). SSE-KMS adds CloudTrail audit logging of every encrypt and decrypt operation on the topic and enables cross-account key sharing for scenarios where multiple accounts share a topic. **Encryption in transit** is provided by HTTPS for all SNS API calls and for HTTPS subscriber endpoints.

For VPC-private architectures where you want to publish to SNS without internet traffic, SNS supports **VPC Interface Endpoints** via AWS PrivateLink. Creating an interface endpoint for the \`sns\` service in your VPC routes SNS API calls through the AWS private network rather than through NAT Gateway and the public internet — useful for Lambda functions and ECS tasks in private subnets that need to publish messages without exposing them to the internet.`,
    },
    {
      heading: "SNS with Other Services",
      body: `**SNS + SQS** is the foundational fan-out pattern: one SNS topic delivers to multiple SQS queues, giving each consumer its own durable buffer, retry policy, and DLQ. This is the most reliable way to fan out to multiple independent consumers.

**SNS + Lambda** provides real-time push delivery without the queue overhead. SNS invokes Lambda asynchronously, making it appropriate for lightweight processing that should happen immediately — sending a confirmation email, triggering a webhook, updating a real-time dashboard. Lambda's asynchronous invocation queue provides limited buffering for traffic spikes, but for sustained high throughput the SNS → SQS → Lambda pattern is more reliable.

**SNS + CloudWatch Alarms** is the standard operations notification pattern. A CloudWatch alarm for high CPU, error rate, or latency publishes to an SNS topic when it fires, which delivers email notifications to the ops team, triggers a Lambda for automated remediation, or sends an alert to a PagerDuty HTTP endpoint via direct subscription. The SNS topic becomes the single alert bus for the environment.

**SNS + EventBridge** represents a choice point in your architecture. EventBridge can target SNS topics as rule destinations, and SNS can deliver to EventBridge via HTTP subscription. In practice, EventBridge is often the better choice for A2A routing because its content-based filtering works on any JSON field in the event (not just MessageAttributes), and it supports 20+ native target types, cross-account delivery, and event archiving. SNS remains the right choice for A2P messaging (email, SMS, mobile push) and for the classic fan-out-to-SQS-queues pattern where its lower latency and higher throughput matter.`,
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
