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
      quiz: [
        {
          question:
            "A publisher sends a single message to an SNS topic. How many subscribers receive the message if there are five confirmed subscriptions with no filter policies?",
          options: [
            "One subscriber receives the message (round-robin delivery)",
            "All five subscribers receive the message simultaneously",
            "Only subscribers of the same type receive the message",
            "One subscriber receives it; others receive it only if the first fails",
          ],
          correctIndex: 1,
          explanation:
            "SNS delivers a message to all confirmed subscriptions simultaneously when no filter policies are applied. This fan-out behavior is the core value of SNS — a single publish operation reaches all subscribers at once without the publisher needing any knowledge of who subscribes.",
        },
        {
          question:
            "Which SNS subscription endpoint provides durable, reliable message delivery with persistence even when the consumer is temporarily unavailable?",
          options: [
            "HTTP/HTTPS endpoint",
            "Email subscription",
            "SQS queue",
            "SMS phone number",
          ],
          correctIndex: 2,
          explanation:
            "An SQS queue subscription provides durable message delivery — messages persist in the queue for up to 14 days even if the consumer is temporarily unavailable or slow. HTTP/HTTPS, email, and SMS subscriptions require the endpoint to be available when SNS attempts delivery, with limited retry behavior compared to SQS's guaranteed durability.",
        },
      ],
    },
    {
      heading: "SNS Fan-Out Pattern with SQS",
      body: `The fan-out pattern is one of the most important architectural patterns in AWS: publish one event to an SNS topic, and SNS delivers it to multiple SQS queues in parallel. Each SQS queue has its own consumer (Lambda function, EC2 worker, ECS task) that processes the event independently. This pattern provides parallel processing, independent scaling of each consumer, failure isolation (one consumer's failure does not affect others), and the durability of SQS (messages persist in the queue even if the consumer is temporarily unavailable). A practical example: when an e-commerce order is placed, an SNS topic delivers the order event to an inventory queue (to deduct stock), a fulfillment queue (to initiate shipping), an analytics queue (to record the sale), and an email queue (to send the confirmation) — all in parallel, with each consumer scaling independently. Without SNS fan-out, the order service would need to write directly to each downstream service, creating tight coupling.`,
      quiz: [
        {
          question:
            "An e-commerce platform needs to process each new order through three independent services: inventory, fulfillment, and analytics. All three must receive every order event. Which architecture achieves this with loose coupling and independent scaling?",
          options: [
            "A single SQS queue consumed by a Lambda function that calls all three services sequentially",
            "Three separate API calls from the order service to each downstream service",
            "SNS topic with three SQS queue subscriptions, one per service",
            "Three separate S3 event notifications, one per service",
          ],
          correctIndex: 2,
          explanation:
            "The SNS fan-out pattern (SNS → multiple SQS queues) delivers the order event to all three services simultaneously and independently. Each service has its own SQS queue for durable buffering, can scale independently, and is isolated from failures in other services. The order service publishes once to SNS without knowing about downstream consumers.",
        },
        {
          question:
            "What is the primary benefit of using SQS queues as SNS subscribers (fan-out) rather than having SNS directly invoke Lambda functions?",
          options: [
            "SQS queues allow synchronous processing, which Lambda cannot do",
            "SQS queues persist messages for up to 14 days, providing durability if the consumer is temporarily unavailable",
            "SQS queues support more concurrent consumers than Lambda subscriptions",
            "SQS queues reduce the cost of SNS message delivery",
          ],
          correctIndex: 1,
          explanation:
            "SQS queues provide durable message buffering — messages persist for up to 14 days even if the consumer is temporarily down, allowing it to catch up when restored. Direct Lambda subscriptions from SNS are asynchronous with limited retry; if Lambda fails, messages may be lost without careful DLQ configuration. SQS adds durability and decoupling to the fan-out pattern.",
        },
      ],
    },
    {
      heading: "FIFO Topics",
      body: `SNS FIFO topics provide strict message ordering and deduplication for scenarios where the sequence of notifications matters. Messages published to a FIFO topic are delivered to FIFO SQS subscriptions in the exact order they were published within the same message group. FIFO topics support up to 300 published messages per second (3,000 with batching). Supported subscriber types include FIFO SQS queues, Lambda functions, HTTP/HTTPS endpoints, and Amazon Kinesis Data Firehose — standard SQS queues and email cannot subscribe to FIFO topics. Message deduplication in FIFO topics uses a MessageDeduplicationId (explicitly provided) or content-based deduplication (SNS hashes the message body), preventing duplicate deliveries within a five-minute deduplication window. FIFO topics are the right choice for financial events (account balance updates must be applied in order), inventory management (stock cannot go negative due to out-of-order processing), and any pub/sub workflow where event sequence is a correctness requirement.`,
      quiz: [
        {
          question: "Which subscriber types are supported for SNS FIFO topics?",
          options: [
            "Standard SQS queues and email only",
            "FIFO SQS queues, Lambda, HTTP/HTTPS, and Kinesis Data Firehose",
            "Any SNS subscriber type, including standard SQS and email",
            "Only FIFO SQS queues",
          ],
          correctIndex: 1,
          explanation:
            "SNS FIFO topics support FIFO SQS queues, Lambda functions, HTTP/HTTPS endpoints, and Amazon Kinesis Data Firehose as subscribers. Standard SQS queues and email subscriptions are not supported for FIFO topics. This is an important exam detail — subscribing a standard SQS queue to a FIFO SNS topic is not allowed.",
        },
        {
          question:
            "A financial application requires that account balance update events are processed in the exact order they were published. Which SNS topic type should be used?",
          options: [
            "Standard SNS topic with message attributes for sequencing",
            "SNS FIFO topic with FIFO SQS queue subscriptions",
            "Standard SNS topic with a timestamp-sorted SQS queue",
            "Standard SNS topic with Lambda processing that sorts by timestamp",
          ],
          correctIndex: 1,
          explanation:
            "SNS FIFO topics guarantee strict message ordering within a message group and deliver messages to FIFO SQS queue subscriptions in the exact order they were published. This is essential for financial applications where out-of-order processing (e.g., applying a debit before a credit) could cause incorrect account balances. Standard topics provide best-effort ordering only.",
        },
      ],
    },
    {
      heading: "Message Filtering",
      body: `SNS message filter policies are JSON documents attached to a subscription that evaluate message attributes and deliver the message only when attributes match the policy. Filter policies support exact string matching, prefix matching, numeric value ranges, and the \`anything-but\` negation operator. A subscription with no filter policy receives all messages published to the topic. Using filter policies, a single topic can replace multiple topics serving different audiences — for example, a topic for payment events with subscriptions filtered by \`paymentStatus\` attribute: the fraud detection queue subscribes with a filter for \`{"paymentStatus": ["declined"]}\`, the customer notification queue subscribes for \`{"paymentStatus": ["approved", "declined"]}\`, and the accounting queue receives all events. This design reduces topic proliferation, simplifies the publisher (one publish call instead of routing logic), and keeps all event filtering logic at the infrastructure level rather than in application code.`,
      quiz: [
        {
          question:
            "A payment processing system publishes events to a single SNS topic. The fraud team needs only declined payment events, while the accounting team needs all events. How should SNS message filtering be configured?",
          options: [
            "Create two separate SNS topics — one for declined payments and one for all payments",
            "Configure the fraud team's subscription with a filter policy for declined status; configure the accounting team's subscription with no filter policy",
            "Use a Lambda function to route messages to the appropriate queue based on payment status",
            "Publish two copies of each message — one for fraud and one for accounting",
          ],
          correctIndex: 1,
          explanation:
            'SNS filter policies on subscriptions let each subscriber specify which messages they want to receive. The fraud team\'s SQS subscription gets a filter for {"paymentStatus": ["declined"]}, and the accounting team\'s subscription has no filter (receiving all messages). This eliminates topic proliferation and keeps routing logic at the infrastructure level.',
        },
        {
          question:
            "What happens to an SNS subscriber that has no filter policy configured?",
          options: [
            "The subscriber receives no messages until a filter policy is added",
            "The subscriber receives only messages that match the default filter",
            "The subscriber receives all messages published to the topic",
            "The subscriber must manually pull messages from the topic",
          ],
          correctIndex: 2,
          explanation:
            "A subscription with no filter policy receives every message published to the topic. Filter policies are opt-in — without one, the subscriber receives all messages. This allows selective subscribers (with filters) and catch-all subscribers (without filters) to coexist on the same topic.",
        },
      ],
    },
    {
      heading: "Dead Letter Queues and Delivery Retry",
      body: `SNS attempts to deliver messages to subscribed endpoints and retries failed deliveries using an exponential backoff policy that varies by endpoint type. HTTP/HTTPS endpoints receive up to 23 retries over 23 hours with exponential backoff. Lambda and SQS subscriptions receive immediate retries (Lambda has three attempts before the event is lost without a DLQ). When all delivery attempts are exhausted, SNS can route undeliverable messages to an Amazon SQS DLQ associated with the subscription — enabling investigation and reprocessing of failed notifications. DLQs on SNS subscriptions are separate from DLQs on SQS queues or Lambda functions; they capture events that SNS itself could not deliver (e.g., the HTTP endpoint was permanently unavailable), not events that the consumer failed to process. Configuring DLQs on both the SNS subscription and the SQS/Lambda consumer creates comprehensive end-to-end message failure handling.`,
      quiz: [
        {
          question:
            "An SNS topic has an HTTP/HTTPS subscription endpoint that becomes permanently unavailable. After exhausting all retries, where do undeliverable messages go?",
          options: [
            "Back to the SNS topic for redelivery",
            "Nowhere — they are silently dropped without a DLQ configured",
            "To an SNS subscription DLQ (SQS queue) if one is configured",
            "To an S3 bucket for archival",
          ],
          correctIndex: 2,
          explanation:
            "After SNS exhausts all delivery retries, undeliverable messages are sent to an SQS DLQ configured on the SNS subscription — but only if one has been configured. Without a DLQ, messages are silently dropped after all retries fail. This is why configuring a DLQ on the SNS subscription is important for monitoring delivery failures.",
        },
        {
          question:
            "What is the difference between an SNS subscription DLQ and an SQS queue DLQ?",
          options: [
            "They capture the same failures — both record processing failures",
            "SNS subscription DLQ captures delivery failures (SNS could not reach the endpoint); SQS queue DLQ captures processing failures (consumer failed to process the message)",
            "SNS DLQ is for standard topics; SQS DLQ is for FIFO queues only",
            "SQS DLQ only works with Lambda; SNS DLQ works with all consumer types",
          ],
          correctIndex: 1,
          explanation:
            "The SNS subscription DLQ captures messages that SNS itself failed to deliver to the endpoint (e.g., the HTTP endpoint was permanently down). The SQS queue DLQ captures messages that were delivered to the SQS queue but the consumer application failed to process within the maxReceiveCount. They handle different failure modes and should both be configured for comprehensive coverage.",
        },
      ],
    },
    {
      heading: "Security and Cross-Account Publishing",
      body: `SNS topics are secured through a combination of IAM policies on the publisher's identity and resource-based SNS topic policies. Topic policies enable cross-account publishing — an SNS topic in Account A can grant \`sns:Publish\` permission to Account B, allowing services in Account B to publish events to Account A's topic without sharing credentials. This is commonly used for centralized event aggregation where microservices in different accounts publish to a shared notification topic in a monitoring or operations account. Server-side encryption (SSE) with AWS KMS encrypts message contents at rest in the SNS topic. HTTPS is used for all message delivery to HTTP endpoints and for all API interactions. For mobile push notifications, SNS integrates with Apple APNs, Google FCM, Amazon ADM, and Baidu CNS — the SNS device token management handles platform-specific push delivery without requiring the application to implement multiple push SDKs.`,
      quiz: [
        {
          question:
            "Microservices in multiple AWS accounts need to publish events to a central SNS topic in a monitoring account. What mechanism enables cross-account publishing without sharing credentials?",
          options: [
            "VPC peering between all accounts and the monitoring account",
            "SNS topic resource policy granting sns:Publish permission to the source accounts",
            "IAM roles in the monitoring account assumed by all source account services",
            "AWS Organizations SCP allowing cross-account SNS publishing",
          ],
          correctIndex: 1,
          explanation:
            "An SNS topic resource policy can grant sns:Publish permission to specific AWS accounts or IAM principals in other accounts. Services in the source accounts can publish directly to the topic using their own account credentials without assuming a cross-account role. This is simpler than role assumption for cross-account publishing use cases.",
        },
        {
          question:
            "Which AWS platforms does Amazon SNS support for mobile push notification delivery?",
          options: [
            "Apple APNs only",
            "Apple APNs and Google FCM only",
            "Apple APNs, Google FCM, Amazon ADM, and Baidu CNS",
            "All mobile platforms via a universal push protocol",
          ],
          correctIndex: 2,
          explanation:
            "Amazon SNS supports mobile push notifications for Apple APNs (iOS), Google FCM (Android), Amazon ADM (Kindle), and Baidu CNS (Chinese Android). SNS handles the platform-specific token management and delivery protocol differences, so applications can use a single SNS API to reach users across all these platforms.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "How does SNS deliver messages to subscribers compared to how SQS delivers messages to consumers?",
      options: [
        "Both SNS and SQS require consumers to poll for messages",
        "SNS pushes messages to all subscribers simultaneously; SQS holds messages until consumers poll",
        "SNS holds messages in a queue; SQS pushes messages to registered consumers",
        "Both SNS and SQS push messages to registered endpoints",
      ],
      correctIndex: 1,
      explanation:
        "SNS pushes messages to all confirmed subscriptions simultaneously when a message is published — no polling required. SQS holds messages in a queue until consumers actively poll and retrieve them. This push vs. pull distinction is a fundamental architectural difference tested frequently on the SAA-C03 exam.",
    },
    {
      question:
        "An order service needs to notify three downstream services (inventory, shipping, analytics) simultaneously when an order is placed. Which pattern achieves this with loose coupling?",
      options: [
        "The order service calls each downstream service API sequentially",
        "A single SQS queue consumed by all three services",
        "SNS topic with three SQS queue subscriptions (one per service)",
        "Three separate Lambda functions triggered directly by the order service",
      ],
      correctIndex: 2,
      explanation:
        "The SNS fan-out pattern delivers a single published event to all three SQS queue subscriptions simultaneously. Each downstream service has its own durable queue for independent processing, scaling, and failure isolation. The order service is decoupled from knowing about downstream consumers — it only publishes to SNS.",
    },
    {
      question:
        "Which SNS subscriber types are NOT supported by SNS FIFO topics?",
      options: [
        "FIFO SQS queues and Lambda functions",
        "HTTP/HTTPS endpoints and Kinesis Data Firehose",
        "Standard SQS queues and email subscriptions",
        "Lambda functions and FIFO SQS queues",
      ],
      correctIndex: 2,
      explanation:
        "SNS FIFO topics do not support standard SQS queues or email subscriptions. Supported subscriber types for FIFO topics are: FIFO SQS queues, Lambda functions, HTTP/HTTPS endpoints, and Amazon Kinesis Data Firehose. This restriction is because standard SQS and email cannot guarantee the ordering that FIFO topics are designed to provide.",
    },
    {
      question:
        "A payment topic has subscribers for fraud detection (needs only declined payments) and accounting (needs all payments). How should message filtering be configured?",
      options: [
        "Create separate SNS topics for declined and all-payment events",
        "Add a filter policy for declined status on the fraud subscription; leave the accounting subscription without a filter policy",
        "Use a Lambda function to route messages between fraud and accounting queues",
        "Configure both subscriptions with filter policies and add a catch-all third subscription",
      ],
      correctIndex: 1,
      explanation:
        "SNS filter policies are attached per subscription. The fraud team's subscription gets a filter for declined payments only; the accounting subscription has no filter and receives all messages. This eliminates topic proliferation, simplifies the publisher, and puts routing logic in SNS infrastructure rather than application code.",
    },
    {
      question:
        "After SNS exhausts all retry attempts for an HTTP/HTTPS subscriber, what happens to undeliverable messages if a DLQ is configured on the subscription?",
      options: [
        "Messages are returned to the SNS topic for redelivery",
        "Messages are silently dropped",
        "Messages are sent to the configured SQS DLQ on the subscription",
        "Messages are stored in S3 for manual review",
      ],
      correctIndex: 2,
      explanation:
        "When an SNS subscription DLQ (SQS queue) is configured, messages that SNS cannot deliver after exhausting all retries are sent to that DLQ. Without a DLQ, failed messages are silently discarded. The subscription DLQ captures SNS delivery failures (endpoint unavailable), distinct from SQS queue DLQs which capture consumer processing failures.",
    },
    {
      question:
        "Services in Account B need to publish messages to an SNS topic in Account A. What is the simplest way to grant this permission?",
      options: [
        "Create an IAM role in Account A and have Account B services assume it before publishing",
        "Configure an SNS topic resource policy in Account A granting sns:Publish to Account B",
        "Create VPC peering between Account A and Account B for direct SNS access",
        "Use AWS Organizations SCPs to allow cross-account SNS publishing",
      ],
      correctIndex: 1,
      explanation:
        "An SNS topic resource policy can grant sns:Publish permission directly to IAM principals or entire AWS accounts. Services in Account B can publish to the topic using their own credentials without role assumption. This is simpler than cross-account role assumption for publishing-only use cases.",
    },
    {
      question:
        "How many retries does SNS make for failed HTTP/HTTPS endpoint deliveries, and over what time period?",
      options: [
        "3 retries over 5 minutes",
        "10 retries over 1 hour",
        "23 retries over 23 hours with exponential backoff",
        "Unlimited retries until the endpoint becomes available",
      ],
      correctIndex: 2,
      explanation:
        "SNS retries failed HTTP/HTTPS deliveries up to 23 times over approximately 23 hours using exponential backoff. After all retries are exhausted, the message is sent to the subscription DLQ if configured, or silently dropped. Lambda and SQS subscriptions have different retry behavior managed within their own services.",
    },
    {
      question:
        "Which SNS feature allows a mobile application to send push notifications to users across iOS, Android, and Kindle devices using a single API?",
      options: [
        "SNS FIFO topic with device group subscriptions",
        "SNS mobile push integration with APNs, FCM, and ADM",
        "SNS HTTP endpoint subscriptions targeting each device platform",
        "SNS fan-out to separate SQS queues per mobile platform",
      ],
      correctIndex: 1,
      explanation:
        "Amazon SNS integrates with Apple APNs (iOS), Google FCM (Android), Amazon ADM (Kindle), and Baidu CNS (Chinese Android) for mobile push notifications. SNS manages the platform-specific token handling and delivery protocols, allowing developers to use a single SNS API to target users across all supported mobile platforms.",
    },
  ],
};
