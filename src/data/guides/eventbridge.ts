import { ServiceGuide } from "../../types/guide";

export const eventbridgeGuide: ServiceGuide = {
  id: "amazon-eventbridge",
  service: "Amazon EventBridge",
  domain: "development",
  tagline: "Serverless event bus for building event-driven architectures",
  intro:
    "EventBridge is a serverless event bus that makes it easy to connect application components using events. It routes events from sources (AWS services, SaaS apps, custom apps) to targets based on rules, enabling loosely coupled, event-driven architectures.",

  sections: [
    {
      heading: "Core Concepts",
      body: `EventBridge's data model starts with an **event** — a JSON object representing a state change somewhere in your system. Every event follows a standard envelope structure with fields for \`source\` (who sent it), \`detail-type\` (a human-readable event name), \`detail\` (the event-specific payload), \`account\`, \`region\`, \`time\`, and \`id\`. This consistent structure is what makes content-based filtering powerful.

Events flow into **event buses**, which are the routing layer. The **default event bus** receives events from AWS services automatically — EC2 instance state changes, S3 object lifecycle events, CodePipeline execution state changes, and events from over 90 other AWS services all land here without any configuration. **Custom event buses** are where your application publishes its own events using the \`PutEvents\` API. **Partner event buses** receive events from SaaS partners — Zendesk, Datadog, PagerDuty, Shopify, and others — without you needing to manage webhooks.

**Rules** are the core routing logic. Each rule has an **event pattern** (a filter that matches against incoming events) and up to 5 **targets** (where matching events are sent). A single event can match multiple rules and be delivered to multiple targets simultaneously. Rules are evaluated against every event that arrives on the bus — there's no subscription model where consumers must register interest. Targets include Lambda, SQS, SNS, Step Functions, ECS tasks, API Gateway, Kinesis, and many more.`,
    },
    {
      heading: "Event Patterns & Filtering",
      body: `EventBridge's content-based filtering is one of its most powerful features. An event pattern is a JSON structure that specifies which fields to match and what values they must have. Only events where every specified field matches are routed to the rule's targets — unspecified fields are ignored.

Matching is more expressive than simple equality. You can match on exact values (\`{"source": ["com.myapp"]}\`), prefix (\`{"detail": {"key": [{"prefix": "val"}]}}\`), anything-but exclusion (\`{"detail": {"status": [{"anything-but": ["ERROR"]}]}}\`), numeric ranges (\`{"detail": {"price": [{"numeric": [">", 100, "<=", 500]}]}}\`), and existence checks (\`{"detail": {"field": [{"exists": true}]}}\`). Multiple conditions in the same pattern are AND-ed together.

The key advantage over SNS filter policies is scope: EventBridge patterns match against any field in the entire event, including deeply nested fields in the \`detail\` object. SNS filter policies only match against \`MessageAttributes\` — a flat set of key-value pairs that must be attached separately to each message. This makes EventBridge far more powerful for routing logic based on business event content, while SNS is better for simple push notification fan-out.`,
    },
    {
      heading: "EventBridge Scheduler",
      body: `**EventBridge Scheduler** is a fully managed scheduling service that replaces the older CloudWatch Events scheduled rules. It's more capable and the preferred choice for new development.

Scheduler supports three schedule expression types. **Rate expressions** repeat on a fixed interval: \`rate(5 minutes)\`, \`rate(1 hour)\`, \`rate(7 days)\`. **Cron expressions** fire at specific times: \`cron(0 9 ? * MON-FRI *)\` triggers at 9 AM UTC on weekdays. **One-time schedules** fire exactly once at a specific datetime — useful for scheduled future actions like sending a reminder or triggering a delayed process.

Unlike EventBridge rules, which only target EventBridge event buses, Scheduler can invoke over 200 AWS service APIs directly via the Universal Target. You can schedule Lambda invocations, SQS message sends, Step Functions executions, or even DynamoDB writes — any AWS API call becomes schedulable. The **flexible time window** feature lets Scheduler deliver the event within a time window (like "within 15 minutes of the scheduled time") to spread load rather than triggering a thundering herd.`,
    },
    {
      heading: "Archive & Replay",
      body: `EventBridge's Archive and Replay capability solves a class of problems that would otherwise require significant custom infrastructure.

An **archive** continuously stores copies of events that match an optional filter pattern. You configure retention as indefinite or a specific number of days. Once events are archived, you can **replay** them — re-sending the archived events back onto an event bus, filtered by a time range. Events are replayed at approximately their original rate.

The practical value is recovery from failures. Suppose a bug in your event consumer corrupts data for 2 hours before you catch it. With archive and replay, you fix the consumer, deploy it, then replay the events from before the bug window through to the current time. Your system recovers to a consistent state without any manual intervention. Replay is also valuable for testing a new event consumer against real production data before going live, or for debugging event-driven pipelines by examining what events actually occurred in a time window.`,
    },
    {
      heading: "Schema Registry",
      body: `EventBridge's **Schema Registry** addresses a common pain point in event-driven architectures: how do consumers know the structure of events they receive?

When you enable **schema discovery** on an event bus, EventBridge samples events flowing through and automatically infers their JSON schema. Schemas are versioned automatically as events evolve. The AWS service schemas registry comes pre-populated with schemas for all AWS service events.

From any schema, you can generate **code bindings** in Java, Python, or TypeScript. These are typed classes that represent the event structure, giving your consumer compile-time type safety. Instead of accessing event fields with string keys and hoping you got the path right, you work with type-safe objects where the IDE can autocomplete field names and the compiler catches typos. This dramatically reduces schema drift bugs — the mismatch between what a producer sends and what a consumer expects.`,
    },
    {
      heading: "API Destinations",
      body: `**API Destinations** let EventBridge call external HTTP endpoints as rule targets — webhooks, third-party APIs, SaaS services, or on-premises systems — without writing any Lambda code to handle the HTTP call.

An API Destination has two components. A **Connection** stores authentication credentials (API key, OAuth2 client credentials, or basic auth) in Secrets Manager, and EventBridge manages the auth token refresh automatically. An **API Destination** specifies the endpoint URL, the Connection to use, and a rate limit (maximum invocations per second) to respect the target API's rate limits.

When an event matches a rule with an API Destination target, you can use an **Input Transformer** to reshape the EventBridge event JSON into whatever format the external API expects — transforming field names, extracting nested values, or wrapping the payload in a specific structure. EventBridge queues events and respects the rate limit, so a traffic spike doesn't cause 429 errors from the downstream API. This makes integrations with Salesforce, ServiceNow, PagerDuty, and Slack straightforward without maintaining webhook relay infrastructure.`,
    },
    {
      heading: "Cross-Account & Cross-Region",
      body: `EventBridge makes cross-account and cross-region event routing straightforward through its resource-based policy model.

For **cross-account routing**, you add a resource-based policy to the target event bus in the receiving account that allows the sending account to \`PutEvents\`. The sending account then creates a rule with the target account's event bus as the target. Events flow from one account's bus to another's without any intermediary infrastructure. This is the standard pattern for multi-account architectures where a platform account receives events from all application accounts for centralized processing.

**Cross-region routing** works the same way: create a rule in one region with an event bus in another region as the target. This enables multi-region event-driven architectures and disaster recovery patterns where events from a primary region can be processed in a backup region.

**Event bus policies** control not just which accounts can send events, but also which accounts can create rules on the bus — allowing you to delegate rule management to specific accounts or organizational units.`,
    },
    {
      heading: "EventBridge Pipes",
      body: `**EventBridge Pipes** provide a simpler alternative to Lambda-based polling patterns for moving data between a source and a target.

A Pipe connects a single **source** to a single **target**, with optional **filtering** and **enrichment** steps in between. Sources include SQS queues, Kinesis streams, DynamoDB Streams, MSK (Kafka), RabbitMQ, and ActiveMQ — all of which previously required you to write polling Lambda functions to consume and forward events. The enrichment step can invoke a Lambda function, a Step Functions state machine, an API Gateway endpoint, or an API Destination to augment events before they reach the target. The target receives the processed events and can be any of the 200+ services that EventBridge rules can target.

The key distinction from EventBridge rules is the topology: Pipes are point-to-point (one source, one target), while rules can fan out a single event pattern to multiple targets. Pipes include built-in source polling (like Lambda event source mapping) and handle backpressure, batching, and filtering at the infrastructure level. The practical effect is that DynamoDB Streams → filter → enrich → EventBridge bus becomes a configuration exercise rather than a Lambda development exercise.`,
    },
    {
      heading: "EventBridge with Other Services",
      body: `EventBridge's role in a modern AWS architecture is often the connective tissue between services that don't directly call each other.

**EventBridge + Lambda** is the most common integration — Lambda functions are triggered by event patterns without any polling code. A Lambda function registered as a rule target receives events, processes them, and returns. EventBridge retries failed deliveries, so Lambda failures are handled without consumer-side retry logic. **EventBridge + Step Functions** is the pattern for triggering workflows on business events — an order placed event triggers an order fulfillment workflow, or a failed payment event triggers a dunning process.

**EventBridge + SQS** is the pattern when you need buffering and independent processing rates. Instead of Lambda processing events immediately, EventBridge routes them to SQS, and a separate consumer (Lambda or ECS) processes them at its own pace with backpressure and DLQ support. This is more resilient than direct EventBridge → Lambda for high-volume workloads.

Over 90 AWS services emit events to the default event bus automatically. You can react to EC2 instance terminations, RDS failovers, CodeBuild build completions, ECS task state changes, and CloudWatch alarm transitions — all through EventBridge rules, without polling or custom integrations. CloudWatch Alarm state changes are particularly useful: create a rule that triggers a remediation Lambda when an alarm fires, automating incident response.`,
    },
  ],

  keyFacts: [
    "Default bus: AWS service events; Custom bus: your app events; Partner bus: SaaS events",
    "Event pattern filters on any JSON field (not just attributes like SNS)",
    "Up to 5 targets per rule",
    "Archive retention: configurable or indefinite",
    "Replay: re-send archived events within a time range",
    "Scheduler supports cron, rate, and one-time schedules with 200+ targets",
    "API Destinations: call external HTTP endpoints with rate limiting and auth",
    "Pipes: point-to-point source→filter→enrich→target without code",
    "Cross-account: resource policy on target bus allows source account",
    "Schema registry: auto-discovers event schemas and generates typed code",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon SQS",
    "Amazon SNS",
    "AWS Step Functions",
    "Amazon API Gateway",
    "Amazon Kinesis",
    "Amazon CloudWatch",
  ],

  examTips: [
    "EventBridge content-based filtering works on any JSON field; SNS filter policies only on MessageAttributes.",
    "Archive + Replay: fix broken consumer, then replay missed events.",
    "Scheduler replaced CloudWatch Events scheduled rules — more features, more targets.",
    "API Destinations invoke external HTTP APIs with rate limiting — no Lambda needed.",
    "Cross-account routing: resource policy on target bus must allow source account PutEvents.",
    "Default event bus receives AWS service events automatically.",
    "Pipes replace custom polling Lambda code for Kinesis/SQS/DynamoDB → target pipelines.",
  ],
};
