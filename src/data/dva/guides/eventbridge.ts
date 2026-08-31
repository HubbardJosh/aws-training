import { ServiceGuide } from "../../../types/guide";

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
      quiz: [
        {
          question:
            "Which EventBridge event bus automatically receives events from AWS services like EC2, S3, and CodePipeline?",
          options: [
            "Service event bus",
            "Custom event bus",
            "Partner event bus",
            "Default event bus",
          ],
          correctIndex: 3,
          explanation:
            "The default event bus automatically receives events from over 90 AWS services without any configuration. Custom event buses are for your own application events, and partner event buses receive events from SaaS providers.",
        },
        {
          question:
            "What is the maximum number of targets a single EventBridge rule can have?",
          options: ["1", "3", "10", "5"],
          correctIndex: 3,
          explanation:
            "Each EventBridge rule can have up to 5 targets. A single event can match multiple rules, allowing it to be delivered to many targets — but each individual rule is limited to 5.",
        },
        {
          question:
            "How do you publish custom application events to EventBridge?",
          options: [
            "By calling the PutEvents API on a custom event bus",
            "By registering a webhook with the EventBridge service",
            "By configuring a subscription on the default event bus",
            "By writing events to an SQS queue that EventBridge polls",
          ],
          correctIndex: 0,
          explanation:
            "Applications publish custom events by calling the PutEvents API and specifying a custom event bus. The event must include source, detail-type, and detail fields following the EventBridge event envelope structure.",
        },
      ],
    },
    {
      heading: "Event Patterns & Filtering",
      body: `EventBridge's content-based filtering is one of its most powerful features. An event pattern is a JSON structure that specifies which fields to match and what values they must have. Only events where every specified field matches are routed to the rule's targets — unspecified fields are ignored.

Matching is more expressive than simple equality. You can match on exact values (\`{"source": ["com.myapp"]}\`), prefix (\`{"detail": {"key": [{"prefix": "val"}]}}\`), anything-but exclusion (\`{"detail": {"status": [{"anything-but": ["ERROR"]}]}}\`), numeric ranges (\`{"detail": {"price": [{"numeric": [">", 100, "<=", 500]}]}}\`), and existence checks (\`{"detail": {"field": [{"exists": true}]}}\`). Multiple conditions in the same pattern are AND-ed together.

The key advantage over SNS filter policies is scope: EventBridge patterns match against any field in the entire event, including deeply nested fields in the \`detail\` object. SNS filter policies only match against \`MessageAttributes\` — a flat set of key-value pairs that must be attached separately to each message. This makes EventBridge far more powerful for routing logic based on business event content, while SNS is better for simple push notification fan-out.`,
      quiz: [
        {
          question:
            "What is a key advantage of EventBridge event pattern filtering over SNS subscription filter policies?",
          options: [
            "EventBridge patterns support more target types than SNS",
            "EventBridge patterns can match any field in the entire event JSON including nested detail fields; SNS only matches MessageAttributes",
            "EventBridge patterns support regular expressions; SNS does not",
            "EventBridge patterns are evaluated faster than SNS filter policies",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge patterns can match against any JSON field in the event, including deeply nested fields in the detail object. SNS filter policies can only match against MessageAttributes — a flat set of key-value pairs attached to the message.",
        },
        {
          question:
            "How are multiple conditions in an EventBridge event pattern combined?",
          options: [
            "They are AND-ed — the event must match every specified condition",
            "The developer specifies AND or OR using a logical operator field",
            "The first matching condition determines the result",
            "They are OR-ed — the event matches if any condition is true",
          ],
          correctIndex: 0,
          explanation:
            "Multiple conditions in an EventBridge event pattern are AND-ed together — an event must match every specified field and value for the rule to trigger. Unspecified fields are ignored.",
        },
        {
          question:
            "Which EventBridge filter operator matches events where a field value is NOT in a specified list?",
          options: ["anything-but", "prefix", "exists", "not-equals"],
          correctIndex: 0,
          explanation:
            'The anything-but operator matches events where the field value is NOT in the specified list. For example, {"status": [{"anything-but": ["ERROR"]}]} matches events where status is anything except ERROR.',
        },
      ],
    },
    {
      heading: "EventBridge Scheduler",
      body: `**EventBridge Scheduler** is a fully managed scheduling service that replaces the older CloudWatch Events scheduled rules. It's more capable and the preferred choice for new development.

Scheduler supports three schedule expression types. **Rate expressions** repeat on a fixed interval: \`rate(5 minutes)\`, \`rate(1 hour)\`, \`rate(7 days)\`. **Cron expressions** fire at specific times: \`cron(0 9 ? * MON-FRI *)\` triggers at 9 AM UTC on weekdays. **One-time schedules** fire exactly once at a specific datetime — useful for scheduled future actions like sending a reminder or triggering a delayed process.

Unlike EventBridge rules, which only target EventBridge event buses, Scheduler can invoke over 200 AWS service APIs directly via the Universal Target. You can schedule Lambda invocations, SQS message sends, Step Functions executions, or even DynamoDB writes — any AWS API call becomes schedulable. The **flexible time window** feature lets Scheduler deliver the event within a time window (like "within 15 minutes of the scheduled time") to spread load rather than triggering a thundering herd.`,
      quiz: [
        {
          question:
            "Which EventBridge Scheduler schedule type fires exactly once at a specific future datetime?",
          options: [
            "Rate expression",
            "Cron expression",
            "One-time schedule",
            "Fixed-window schedule",
          ],
          correctIndex: 2,
          explanation:
            "One-time schedules fire exactly once at a specific datetime. This is useful for delayed or future-scheduled actions like sending a reminder email or triggering a process at a known future time.",
        },
        {
          question: "What is the Universal Target in EventBridge Scheduler?",
          options: [
            "The ability to invoke over 200 AWS service APIs directly without an intermediary Lambda",
            "An EventBridge bus that receives events from all AWS services",
            "A target that routes events to all registered subscribers simultaneously",
            "A catch-all target that handles events not matched by any rule",
          ],
          correctIndex: 0,
          explanation:
            "The Universal Target allows EventBridge Scheduler to invoke over 200 AWS service APIs directly — Lambda, SQS, Step Functions, DynamoDB, and more — making any AWS API call schedulable without a Lambda intermediary.",
        },
        {
          question:
            "What does the EventBridge Scheduler flexible time window feature do?",
          options: [
            "It allows schedules to drift by up to 15 minutes to compensate for clock skew",
            "It delivers events within a time window around the scheduled time to spread load and avoid thundering herds",
            "It retries failed invocations within a flexible window",
            "It adjusts the schedule automatically based on target service availability",
          ],
          correctIndex: 1,
          explanation:
            "The flexible time window feature delivers the scheduled event within a configured window around the scheduled time (e.g., within 15 minutes). This spreads load across time rather than causing all scheduled events to trigger simultaneously.",
        },
      ],
    },
    {
      heading: "Archive & Replay",
      body: `EventBridge's Archive and Replay capability solves a class of problems that would otherwise require significant custom infrastructure.

An **archive** continuously stores copies of events that match an optional filter pattern. You configure retention as indefinite or a specific number of days. Once events are archived, you can **replay** them — re-sending the archived events back onto an event bus, filtered by a time range. Events are replayed at approximately their original rate.

The practical value is recovery from failures. Suppose a bug in your event consumer corrupts data for 2 hours before you catch it. With archive and replay, you fix the consumer, deploy it, then replay the events from before the bug window through to the current time. Your system recovers to a consistent state without any manual intervention. Replay is also valuable for testing a new event consumer against real production data before going live, or for debugging event-driven pipelines by examining what events actually occurred in a time window.`,
      quiz: [
        {
          question:
            "What is the primary use case for EventBridge Archive and Replay?",
          options: [
            "Recovering from consumer failures by replaying missed events after fixing the consumer",
            "Scheduling events to be delivered at a future time",
            "Storing events permanently for compliance auditing",
            "Routing events to multiple targets simultaneously",
          ],
          correctIndex: 0,
          explanation:
            "Archive and Replay enables recovery from consumer bugs or failures. Fix the consumer, then replay the archived events from before the failure window. The system recovers to a consistent state without manual re-processing.",
        },
        {
          question:
            "When replaying archived EventBridge events, at what rate are they re-sent?",
          options: [
            "As fast as possible — EventBridge replays events at maximum throughput",
            "One event per second regardless of the original rate",
            "At a configurable rate set by the developer",
            "At approximately their original rate of occurrence",
          ],
          correctIndex: 3,
          explanation:
            "EventBridge replays archived events at approximately their original rate of occurrence, preserving the temporal distribution of events during recovery.",
        },
        {
          question:
            "Which EventBridge feature allows testing a new event consumer against real historical production data?",
          options: [
            "Schema Registry code bindings",
            "Archive and Replay filtered by a historical time range",
            "EventBridge Pipes with an enrichment step",
            "EventBridge Scheduler with a one-time schedule",
          ],
          correctIndex: 1,
          explanation:
            "Archive and Replay can replay historical events filtered by a time range onto an event bus. This allows testing a new consumer against real production event data before going live.",
        },
      ],
    },
    {
      heading: "Schema Registry",
      body: `EventBridge's **Schema Registry** addresses a common pain point in event-driven architectures: how do consumers know the structure of events they receive?

When you enable **schema discovery** on an event bus, EventBridge samples events flowing through and automatically infers their JSON schema. Schemas are versioned automatically as events evolve. The AWS service schemas registry comes pre-populated with schemas for all AWS service events.

From any schema, you can generate **code bindings** in Java, Python, or TypeScript. These are typed classes that represent the event structure, giving your consumer compile-time type safety. Instead of accessing event fields with string keys and hoping you got the path right, you work with type-safe objects where the IDE can autocomplete field names and the compiler catches typos. This dramatically reduces schema drift bugs — the mismatch between what a producer sends and what a consumer expects.`,
      quiz: [
        {
          question:
            "What does enabling schema discovery on an EventBridge event bus do?",
          options: [
            "It encrypts event payloads using the schema as a key",
            "It blocks events that don't match the registered schema",
            "It validates all incoming events against a pre-defined schema",
            "It samples events flowing through and automatically infers their JSON schema",
          ],
          correctIndex: 3,
          explanation:
            "Schema discovery samples events flowing through the event bus and automatically infers JSON schemas from them. Schemas are versioned as events evolve over time.",
        },
        {
          question:
            "What languages are supported for EventBridge Schema Registry code binding generation?",
          options: [
            "Python only",
            "Java, Python, and TypeScript",
            "JavaScript, Go, and Ruby",
            "All languages supported by the AWS SDK",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge Schema Registry generates typed code bindings in Java, Python, and TypeScript. These bindings provide compile-time type safety for event consumers, reducing schema drift bugs.",
        },
        {
          question:
            "What problem do EventBridge Schema Registry code bindings solve?",
          options: [
            "They enable faster event routing by pre-compiling filter patterns",
            "They compress event payloads to reduce data transfer costs",
            "They provide compile-time type safety for event consumers, reducing schema drift bugs",
            "They validate event schemas at the producer before publishing",
          ],
          correctIndex: 2,
          explanation:
            "Code bindings generate typed classes from event schemas, allowing consumers to work with type-safe objects instead of string-keyed JSON. This gives compile-time detection of field name typos and schema drift.",
        },
      ],
    },
    {
      heading: "API Destinations",
      body: `**API Destinations** let EventBridge call external HTTP endpoints as rule targets — webhooks, third-party APIs, SaaS services, or on-premises systems — without writing any Lambda code to handle the HTTP call.

An API Destination has two components. A **Connection** stores authentication credentials (API key, OAuth2 client credentials, or basic auth) in Secrets Manager, and EventBridge manages the auth token refresh automatically. An **API Destination** specifies the endpoint URL, the Connection to use, and a rate limit (maximum invocations per second) to respect the target API's rate limits.

When an event matches a rule with an API Destination target, you can use an **Input Transformer** to reshape the EventBridge event JSON into whatever format the external API expects — transforming field names, extracting nested values, or wrapping the payload in a specific structure. EventBridge queues events and respects the rate limit, so a traffic spike doesn't cause 429 errors from the downstream API. This makes integrations with Salesforce, ServiceNow, PagerDuty, and Slack straightforward without maintaining webhook relay infrastructure.`,
      quiz: [
        {
          question:
            "What does an EventBridge API Destination Connection store?",
          options: [
            "The rate limit and retry configuration",
            "The event pattern filter for the destination",
            "The target endpoint URL and HTTP method",
            "Authentication credentials (API key, OAuth2, or basic auth) managed in Secrets Manager",
          ],
          correctIndex: 3,
          explanation:
            "A Connection stores authentication credentials for the external API — API key, OAuth2 client credentials, or basic auth — in Secrets Manager. EventBridge manages token refresh automatically.",
        },
        {
          question:
            "How does EventBridge API Destinations handle traffic spikes that would exceed the target API's rate limit?",
          options: [
            "It routes excess events to an SQS dead-letter queue",
            "It automatically increases the rate limit by calling the target API's admin endpoint",
            "It drops excess events and logs them to CloudWatch",
            "It queues events and delivers them respecting the configured rate limit",
          ],
          correctIndex: 3,
          explanation:
            "EventBridge queues events and respects the configured rate limit (max invocations per second). This prevents 429 errors from the downstream API during traffic spikes without dropping events.",
        },
        {
          question:
            "What EventBridge feature reshapes the event JSON into the format expected by an external API?",
          options: [
            "Schema Registry transformation",
            "Input Transformer",
            "Event pattern mapping",
            "API Destination formatter",
          ],
          correctIndex: 1,
          explanation:
            "An Input Transformer reshapes the EventBridge event JSON into whatever format the external API expects — renaming fields, extracting nested values, or wrapping the payload in a specific structure.",
        },
      ],
    },
    {
      heading: "Cross-Account & Cross-Region",
      body: `EventBridge makes cross-account and cross-region event routing straightforward through its resource-based policy model.

For **cross-account routing**, you add a resource-based policy to the target event bus in the receiving account that allows the sending account to \`PutEvents\`. The sending account then creates a rule with the target account's event bus as the target. Events flow from one account's bus to another's without any intermediary infrastructure. This is the standard pattern for multi-account architectures where a platform account receives events from all application accounts for centralized processing.

**Cross-region routing** works the same way: create a rule in one region with an event bus in another region as the target. This enables multi-region event-driven architectures and disaster recovery patterns where events from a primary region can be processed in a backup region.

**Event bus policies** control not just which accounts can send events, but also which accounts can create rules on the bus — allowing you to delegate rule management to specific accounts or organizational units.`,
      quiz: [
        {
          question:
            "What must be configured on the target event bus to allow cross-account event routing from another AWS account?",
          options: [
            "An IAM role in the target account that the source account assumes",
            "A resource-based policy on the target event bus that allows the source account to PutEvents",
            "A VPC peering connection between the source and target accounts",
            "An SNS topic subscription between the two accounts",
          ],
          correctIndex: 1,
          explanation:
            "For cross-account routing, add a resource-based policy to the target event bus that explicitly allows the source account to call PutEvents. The source account then creates a rule targeting that event bus ARN.",
        },
        {
          question:
            "Cross-region EventBridge routing is useful for which architecture pattern?",
          options: [
            "Disaster recovery — routing events from a primary region to a backup region for processing",
            "Reducing event latency by routing to the nearest region",
            "Consolidating all events into a single region for cost savings",
            "Encrypting events during cross-region transfer",
          ],
          correctIndex: 0,
          explanation:
            "Cross-region routing enables disaster recovery patterns where events from a primary region are processed in a backup region. It also supports multi-region event-driven architectures.",
        },
        {
          question:
            "In a multi-account AWS architecture, what is the standard EventBridge pattern for centralized event processing?",
          options: [
            "Each account has its own EventBridge rules that process events independently",
            "Application accounts send events to a central platform account's event bus using cross-account routing",
            "All accounts share a single default event bus in the organization's management account",
            "Events are aggregated via CloudTrail and forwarded to EventBridge",
          ],
          correctIndex: 1,
          explanation:
            "The standard multi-account pattern is for application accounts to send events to a central platform account's custom event bus using cross-account routing. The platform account processes events centrally without each application account needing its own processing logic.",
        },
      ],
    },
    {
      heading: "EventBridge Pipes",
      body: `**EventBridge Pipes** provide a simpler alternative to Lambda-based polling patterns for moving data between a source and a target.

A Pipe connects a single **source** to a single **target**, with optional **filtering** and **enrichment** steps in between. Sources include SQS queues, Kinesis streams, DynamoDB Streams, MSK (Kafka), RabbitMQ, and ActiveMQ — all of which previously required you to write polling Lambda functions to consume and forward events. The enrichment step can invoke a Lambda function, a Step Functions state machine, an API Gateway endpoint, or an API Destination to augment events before they reach the target. The target receives the processed events and can be any of the 200+ services that EventBridge rules can target.

The key distinction from EventBridge rules is the topology: Pipes are point-to-point (one source, one target), while rules can fan out a single event pattern to multiple targets. Pipes include built-in source polling (like Lambda event source mapping) and handle backpressure, batching, and filtering at the infrastructure level. The practical effect is that DynamoDB Streams → filter → enrich → EventBridge bus becomes a configuration exercise rather than a Lambda development exercise.`,
      quiz: [
        {
          question:
            "What is the key topological difference between EventBridge Pipes and EventBridge Rules?",
          options: [
            "Pipes require Lambda for enrichment; Rules can call services directly",
            "Pipes support more target types than Rules",
            "Rules support filtering; Pipes do not",
            "Pipes are point-to-point (one source, one target); Rules can fan out to multiple targets",
          ],
          correctIndex: 3,
          explanation:
            "EventBridge Pipes are point-to-point — one source connects to one target with optional filtering and enrichment. EventBridge Rules can fan out a single event pattern to up to 5 targets simultaneously.",
        },
        {
          question:
            "Which of the following is a valid EventBridge Pipes source?",
          options: [
            "Amazon CloudFront",
            "Amazon S3",
            "AWS CloudTrail",
            "Amazon SQS queue",
          ],
          correctIndex: 3,
          explanation:
            "EventBridge Pipes sources include SQS queues, Kinesis streams, DynamoDB Streams, MSK (Kafka), RabbitMQ, and ActiveMQ. Pipes handle the polling and batching for these sources without requiring custom Lambda polling code.",
        },
        {
          question:
            "What problem do EventBridge Pipes solve compared to a custom Lambda polling function?",
          options: [
            "They provide lower latency for event delivery",
            "They replace the need to write and maintain custom Lambda polling code for sources like Kinesis and DynamoDB Streams",
            "They enable filtering of events before they reach the source",
            "They support more programming languages than Lambda",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge Pipes handle source polling, batching, filtering, and enrichment at the infrastructure level as configuration — replacing the need to write, deploy, and maintain custom Lambda polling functions for event sources like Kinesis and DynamoDB Streams.",
        },
      ],
    },
    {
      heading: "EventBridge with Other Services",
      body: `EventBridge's role in a modern AWS architecture is often the connective tissue between services that don't directly call each other.

**EventBridge + Lambda** is the most common integration — Lambda functions are triggered by event patterns without any polling code. A Lambda function registered as a rule target receives events, processes them, and returns. EventBridge retries failed deliveries, so Lambda failures are handled without consumer-side retry logic. **EventBridge + Step Functions** is the pattern for triggering workflows on business events — an order placed event triggers an order fulfillment workflow, or a failed payment event starts a dunning process.

**EventBridge + SQS** is the pattern when you need buffering and independent processing rates. Instead of Lambda processing events immediately, EventBridge routes them to SQS, and a separate consumer (Lambda or ECS) processes them at its own pace with backpressure and DLQ support. This is more resilient than direct EventBridge → Lambda for high-volume workloads.

Over 90 AWS services emit events to the default event bus automatically. You can react to EC2 instance terminations, RDS failovers, CodeBuild build completions, ECS task state changes, and CloudWatch alarm transitions — all through EventBridge rules, without polling or custom integrations. CloudWatch Alarm state changes are particularly useful: create a rule that triggers a remediation Lambda when an alarm fires, automating incident response.`,
      quiz: [
        {
          question:
            "Why might you route EventBridge events to SQS instead of directly to Lambda?",
          options: [
            "SQS provides buffering and backpressure for high-volume workloads with independent processing rates and DLQ support",
            "EventBridge cannot retry Lambda invocations on failure",
            "Lambda cannot be a target for EventBridge rules",
            "SQS is cheaper than Lambda for event processing",
          ],
          correctIndex: 0,
          explanation:
            "EventBridge → SQS → Lambda adds a buffer layer with backpressure and DLQ support. For high-volume workloads where you need independent processing rates or guaranteed at-least-once delivery with retry, this is more resilient than direct EventBridge → Lambda.",
        },
        {
          question:
            "How many AWS services emit events to the EventBridge default event bus automatically?",
          options: ["About 10", "About 30", "Over 90", "All 200+ AWS services"],
          correctIndex: 2,
          explanation:
            "Over 90 AWS services emit events to the default event bus automatically — including EC2, RDS, CodeBuild, ECS, CloudWatch Alarms, and many others — without any configuration on your part.",
        },
        {
          question:
            "Which EventBridge integration pattern is used to trigger a business workflow (like order fulfillment) in response to a business event?",
          options: [
            "EventBridge + SQS for buffered processing",
            "EventBridge + Step Functions for orchestrated workflow execution",
            "EventBridge + SNS for fan-out notification",
            "EventBridge + Kinesis for stream processing",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge + Step Functions is the pattern for triggering orchestrated workflows on business events. An event rule starts a Step Functions execution, which then orchestrates the multi-step business process with retries, error handling, and state management.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A consumer bug corrupts data for 2 hours before being discovered and fixed. After deploying the fix, how can you recover the missed events using EventBridge?",
      options: [
        "Use Archive and Replay to re-send the archived events from the affected time window",
        "Re-trigger all upstream services to re-emit their events",
        "Use EventBridge Pipes to backfill events from the source",
        "Query CloudTrail for the lost events and republish them manually",
      ],
      correctIndex: 0,
      explanation:
        "Archive and Replay is designed for this exact scenario. Enable archiving, fix the consumer, then replay the archived events from before the bug window. The system recovers to a consistent state without manual intervention.",
    },
    {
      question:
        "Which EventBridge feature allows calling external APIs like Salesforce or PagerDuty as rule targets without writing Lambda code?",
      options: [
        "EventBridge Scheduler with Universal Target",
        "Schema Registry with code bindings",
        "API Destinations with a Connection for auth",
        "EventBridge Pipes with enrichment",
      ],
      correctIndex: 2,
      explanation:
        "API Destinations allow EventBridge to call external HTTP endpoints directly as rule targets. A Connection stores authentication credentials, and the rate limit prevents overwhelming the external API — no Lambda relay code needed.",
    },
    {
      question:
        "A team wants to route events from a development account to a central security account for processing. What must be configured on the security account's event bus?",
      options: [
        "An IAM role that the development account can assume",
        "A resource-based policy allowing the development account to PutEvents",
        "A VPC peering connection between accounts",
        "An SNS subscription to the development account's event bus",
      ],
      correctIndex: 1,
      explanation:
        "For cross-account routing, the target event bus needs a resource-based policy that allows the source account to call PutEvents. The source account then creates a rule targeting the security account's event bus ARN.",
    },
    {
      question:
        "Which EventBridge Scheduler expression type would you use to trigger a Lambda every weekday at 9 AM UTC?",
      options: [
        "rate(1 day)",
        "cron(0 9 ? * MON-FRI *)",
        "one-time schedule for each weekday",
        "rate(5 days) with a start time of Monday",
      ],
      correctIndex: 1,
      explanation:
        "A cron expression like cron(0 9 ? * MON-FRI *) triggers at 9 AM UTC on Monday through Friday. Rate expressions repeat on a fixed interval regardless of day of week.",
    },
    {
      question:
        "You need to move records from a DynamoDB Stream to an EventBridge bus with filtering and enrichment — with no custom Lambda polling code. Which EventBridge feature should you use?",
      options: [
        "An EventBridge rule targeting DynamoDB Streams",
        "EventBridge Pipes with DynamoDB Streams as the source",
        "EventBridge Scheduler polling DynamoDB every minute",
        "API Destinations connected to DynamoDB",
      ],
      correctIndex: 1,
      explanation:
        "EventBridge Pipes natively supports DynamoDB Streams as a source. Pipes handle polling, batching, filtering, and enrichment as configuration — replacing the need for custom Lambda polling code.",
    },
    {
      question:
        "How does EventBridge event pattern matching differ from SNS subscription filter policies?",
      options: [
        "EventBridge patterns match any JSON field in the event including nested detail fields; SNS filters only match MessageAttributes",
        "EventBridge patterns are applied after delivery; SNS filters before delivery",
        "SNS filter policies support more operators than EventBridge patterns",
        "EventBridge patterns use regex; SNS uses exact matches only",
      ],
      correctIndex: 0,
      explanation:
        "EventBridge patterns can match any field in the event JSON including deeply nested fields in the detail object. SNS filter policies can only match against MessageAttributes — a flat set of key-value pairs attached separately to each message.",
    },
    {
      question:
        "What does the EventBridge Schema Registry's code binding feature provide?",
      options: [
        "Automatic event routing based on the schema version",
        "Runtime validation that events conform to the registered schema",
        "Compile-time type-safe classes for event consumers in Java, Python, or TypeScript",
        "Schema versioning with automatic backward compatibility checks",
      ],
      correctIndex: 2,
      explanation:
        "Code bindings generate typed classes from event schemas in Java, Python, or TypeScript. Consumers work with type-safe objects where the IDE can autocomplete fields and the compiler catches typos and schema drift at compile time.",
    },
    {
      question:
        "A CloudWatch Alarm fires for high error rate. What EventBridge pattern automates incident response?",
      options: [
        "Use EventBridge Pipes to stream CloudWatch metrics to Lambda",
        "Configure CloudWatch to directly invoke Lambda — EventBridge is not needed",
        "Subscribe Lambda to an SNS topic that CloudWatch publishes to",
        "Create an EventBridge rule matching the alarm state change event that triggers a remediation Lambda",
      ],
      correctIndex: 3,
      explanation:
        "CloudWatch Alarms emit state change events to the EventBridge default event bus. An EventBridge rule matching the alarm state change (e.g., from OK to ALARM) can trigger a Lambda for automated remediation — no polling or webhook configuration needed.",
    },
  ],
};
