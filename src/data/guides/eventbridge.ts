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
      body: `**Event**: a JSON object representing a change in state. All events have a standard envelope: \`source\`, \`detail-type\`, \`detail\`, \`account\`, \`region\`, \`time\`, \`id\`.

**Event Bus**: receives events and applies rules. Three types:
- *Default event bus*: receives events from AWS services (EC2 state changes, S3 events, CodePipeline, etc.)
- *Custom event bus*: receive events from your own applications (\`PutEvents\` API)
- *Partner event bus*: receive events from SaaS partners (Zendesk, Datadog, PagerDuty, Shopify, etc.)

**Rules**: match incoming events using an **event pattern** (content-based filter) and route matching events to one or more **targets**.

**Targets**: where matched events are sent. Up to 5 targets per rule. Includes Lambda, SQS, SNS, Step Functions, ECS tasks, API Gateway, Kinesis, EventBridge API destinations, and more.`,
    },
    {
      heading: "Event Patterns & Filtering",
      body: `Event patterns are JSON filters that match against the event structure. EventBridge supports **content-based filtering** on any field in the event, including nested fields in the \`detail\` object.

**Matching operators**:
- Exact match: \`{"source": ["com.myapp"]}\`
- Prefix: \`{"detail": {"key": [{"prefix": "val"}]}}\`
- Anything-but: \`{"detail": {"status": [{"anything-but": ["ERROR"]}]}}\`
- Numeric range: \`{"detail": {"price": [{"numeric": [">", 100, "<=", 500]}]}}\`
- Exists: \`{"detail": {"field": [{"exists": true}]}}\`
- IP address CIDR: match on IP fields
- Combination: multiple conditions in the same pattern are ANDed

**vs SNS filter policies**: EventBridge pattern matches on the full event body (any field). SNS filter policies only match on MessageAttributes. EventBridge is far more powerful for routing logic.`,
    },
    {
      heading: "EventBridge Scheduler",
      body: `Scheduler creates one-time or recurring scheduled invocations of targets — a fully managed cron/rate service.

**Schedule types**:
- *Rate expression*: \`rate(5 minutes)\`, \`rate(1 hour)\`, \`rate(7 days)\`
- *Cron expression*: \`cron(0 9 ? * MON-FRI *)\` — 9 AM UTC weekdays
- *One-time*: fire once at a specific datetime

**Targets**: any AWS API via the Universal Target (Lambda, SQS, Step Functions, EventBridge PutEvents, and 200+ other service APIs).

**Flexible time window**: allow Scheduler to deliver the event within a time window (e.g. within 15 minutes of scheduled time) — useful for spreading load.

**Timezone support**: schedule in any timezone.

**vs EventBridge Rules with schedule**: Scheduler is the newer, preferred approach. Supports more targets, one-time schedules, flexible windows, and per-schedule IAM roles.`,
    },
    {
      heading: "Archive & Replay",
      body: `**Archive**: store all events (or a filtered subset) matching an event pattern to an archive. Retention: indefinite or a specified number of days.

**Replay**: re-send archived events to an event bus within a time range. Events are replayed at the original rate. Useful for:
- Recovering from a consumer bug (fix the consumer, replay the events)
- Testing new event consumers against real production data
- Debugging event-driven pipelines

**Setup**: create an archive on an event bus with an optional filter pattern. Start a replay by specifying source archive, destination event bus, and time range.`,
    },
    {
      heading: "Schema Registry",
      body: `EventBridge can automatically discover and register the schemas of events flowing through event buses.

**Schema discovery**: enable on an event bus. EventBridge samples events and infers JSON schemas. Schemas versioned automatically.

**Code bindings**: generate strongly-typed code (Java, Python, TypeScript) for event schemas. Download and use in your consumers for compile-time correctness.

**AWS service schemas**: pre-built schemas for all AWS service events available in the registry.

**Use cases**: documentation, auto-complete in IDEs, catch schema drift at compile time.`,
    },
    {
      heading: "API Destinations",
      body: `API Destinations let EventBridge call external HTTP endpoints (SaaS services, on-prem systems, third-party APIs) as event targets.

**Components**:
- *Connection*: stores authentication credentials (API key, OAuth2, basic auth) in Secrets Manager
- *API Destination*: the endpoint URL + connection + rate limit (invocations per second)

**Rate limiting**: set max invocations/s to respect third-party API limits. EventBridge queues events and respects the limit.

**Transformation**: use **Input Transformer** to reshape the event JSON into the format the third-party API expects.

**Use cases**: send events to Salesforce, ServiceNow, Slack, PagerDuty, or any webhook endpoint without writing integration Lambda code.`,
    },
    {
      heading: "Cross-Account & Cross-Region",
      body: `**Cross-account event routing**: add resource-based policy to the target event bus allowing the source account to send events. Use EventBridge rules to forward events from one bus to another account's bus.

**Cross-region**: forward events to an event bus in another region. EventBridge → EventBridge rule → cross-region bus. Used for multi-region architectures and disaster recovery.

**Event bus policies**: control which principals (accounts, organizations) can publish events to or create rules on an event bus.`,
    },
    {
      heading: "EventBridge Pipes",
      body: `Pipes create point-to-point integrations between a **source** and a **target** with optional **filtering** and **enrichment** — without writing code.

**Sources**: SQS, Kinesis, DynamoDB Streams, Kafka (MSK), RabbitMQ, ActiveMQ.
**Enrichment**: invoke Lambda, Step Functions, API Gateway, or API Destination to enrich events before delivery.
**Targets**: same as EventBridge rules targets (200+ services).

**vs EventBridge rules**: Pipes are point-to-point (one source, one target). Rules are one-to-many (one event pattern, multiple targets). Pipes include built-in source polling (like Lambda event source mapping).

**Use cases**: DynamoDB Streams → filter → enrich → SQS; Kinesis → transform → EventBridge bus.`,
    },
    {
      heading: "EventBridge with Other Services",
      body: `**EventBridge + Lambda**: most common target. EventBridge routes events to Lambda for processing. Decouples event producers from consumers.

**EventBridge + Step Functions**: trigger workflows on events. EventBridge → Step Functions state machine. Useful for complex event-driven orchestration.

**EventBridge + SQS**: route events to SQS for buffering and async processing. Event bus → SQS → worker Lambda.

**EventBridge + API Gateway**: call an API endpoint on an event. Internal HTTP APIs triggered by events.

**AWS services → EventBridge**: S3, EC2, CodePipeline, CodeBuild, Glue, RDS, ECS, and 90+ other services emit events to the default bus automatically. Create rules to act on these events without polling.

**EventBridge + CloudWatch**: CloudWatch alarm state changes appear on the default bus. Create rules to trigger remediation workflows.`,
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
