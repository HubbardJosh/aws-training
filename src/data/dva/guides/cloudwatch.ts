import { ServiceGuide } from "../../../types/guide";

export const cloudwatchGuide: ServiceGuide = {
  id: "amazon-cloudwatch",
  service: "Amazon CloudWatch",
  domain: "development",
  tagline: "Observability for AWS resources and applications",
  intro:
    "CloudWatch is the native observability service for AWS. It collects metrics, logs, and events from AWS services and your applications, enables alarms, dashboards, and automated actions, and integrates with virtually every AWS service for monitoring and operational health.",

  sections: [
    {
      heading: "Metrics",
      body: `A **metric** is a time-ordered set of data points published to CloudWatch. Every AWS service publishes metrics automatically — EC2 CPU utilization, Lambda duration, DynamoDB consumed capacity — and you can publish your own custom metrics using the \`PutMetricData\` API.

Metrics are organized into **namespaces**, which are logical containers. AWS services use namespaces like \`AWS/EC2\`, \`AWS/Lambda\`, and \`AWS/DynamoDB\`. Your application's custom metrics should go in your own namespace (like \`MyApp/Orders\`) to keep them separate from AWS-managed metrics.

Within a namespace, **dimensions** are key-value pairs that identify a specific metric instance. An EC2 CPU metric has an \`InstanceId\` dimension that distinguishes metrics from different instances. Lambda metrics have \`FunctionName\` and \`Resource\` dimensions. You use dimensions to filter and aggregate metrics — for example, viewing CPU across all instances or just one specific instance.

CloudWatch offers two resolution tiers. **Standard resolution** stores metrics at 1-minute granularity, which is what most AWS services publish by default. **High resolution** stores at 1-second granularity (set \`StorageResolution=1\` when publishing), at additional cost, which is useful for applications where sub-minute anomalies matter. Metric data is retained progressively longer at lower resolutions: 1-second data for 3 hours, 1-minute data for 15 days, 5-minute data for 63 days, and 1-hour data for 15 months.

**Metric Math** lets you perform calculations across multiple metrics to derive new values — for example, computing an error rate as \`errors / requests * 100\`. Metric Math expressions can be used in dashboards and alarms just like raw metrics.`,
      quiz: [
        {
          question:
            "What is the retention period for 1-second high-resolution CloudWatch metric data?",
          options: ["3 hours", "15 days", "63 days", "15 months"],
          correctIndex: 0,
          explanation:
            "1-second high-resolution metric data is retained for only 3 hours. Data is then rolled up: 1-minute data is retained for 15 days, 5-minute data for 63 days, and 1-hour data for 15 months. Plan your alerting accordingly.",
        },
        {
          question:
            "What parameter do you set when calling PutMetricData to publish a high-resolution metric?",
          options: [
            "Resolution=HIGH",
            "StorageResolution=1",
            "Granularity=SECOND",
            "MetricResolution=1s",
          ],
          correctIndex: 1,
          explanation:
            "Setting StorageResolution=1 when calling PutMetricData publishes the metric at 1-second (high-resolution) granularity. The default is StorageResolution=60 (standard resolution, 1-minute granularity).",
        },
        {
          question: "What are CloudWatch dimensions used for?",
          options: [
            "Grouping metrics into namespaces for billing purposes",
            "Identifying a specific metric instance using key-value pairs (e.g., InstanceId=i-1234)",
            "Setting the TTL for metric data retention",
            "Defining the unit of measurement for a custom metric",
          ],
          correctIndex: 1,
          explanation:
            "Dimensions are key-value pairs that identify a specific metric instance within a namespace. For example, an EC2 CPU metric uses InstanceId as a dimension to distinguish metrics from different instances. You can filter and aggregate metrics by dimension values.",
        },
      ],
    },
    {
      heading: "Custom Metrics",
      body: `You publish custom metrics using the \`PutMetricData\` API from any code that can make AWS SDK calls — Lambda functions, EC2 instances, ECS containers, or any other compute environment. Each metric data point includes a namespace, metric name, dimensions, value, unit, and an optional timestamp. Setting \`StorageResolution\` to 1 publishes a high-resolution metric at 1-second granularity.

For EC2 instances and on-premises servers, the **CloudWatch Agent** extends what you can monitor. By default, EC2 publishes CPU, network, and disk I/O metrics — but memory utilization and disk usage at the file system level are not published by the EC2 service itself. Installing the CloudWatch Agent gives you those operating system-level metrics, plus the ability to collect application logs from files on disk.

The **Embedded Metrics Format (EMF)** is a pattern specifically optimized for Lambda. Instead of calling \`PutMetricData\` from your function, you write structured JSON to stdout that includes a special \`_aws\` envelope. The Lambda runtime (or CloudWatch Logs agent) automatically detects the EMF format and extracts the metrics, publishing them to CloudWatch without an explicit API call. This avoids adding latency to your function's response while still capturing metrics.`,
      quiz: [
        {
          question:
            "Which EC2 metric is NOT published by default and requires the CloudWatch Agent?",
          options: [
            "CPU utilization",
            "Network bytes in/out",
            "Memory utilization",
            "Disk read/write IOPS",
          ],
          correctIndex: 2,
          explanation:
            "Memory utilization is an operating-system-level metric that EC2 does not publish by default. You must install the CloudWatch Agent on the instance to collect memory metrics. CPU, network, and basic disk I/O are published by the EC2 service itself.",
        },
        {
          question:
            "What is the Embedded Metrics Format (EMF) used for in Lambda?",
          options: [
            "Streaming Lambda logs to Kinesis Data Streams",
            "Publishing CloudWatch metrics by writing structured JSON to stdout without calling PutMetricData",
            "Formatting Lambda error messages for CloudWatch Logs Insights queries",
            "Compressing Lambda log output to reduce CloudWatch Logs storage costs",
          ],
          correctIndex: 1,
          explanation:
            "EMF lets Lambda functions publish metrics by writing specially formatted JSON (with an _aws envelope) to stdout. CloudWatch automatically extracts and publishes the metrics without an explicit API call, avoiding the latency overhead of calling PutMetricData from inside the function.",
        },
      ],
    },
    {
      heading: "CloudWatch Logs",
      body: `CloudWatch Logs is the centralized logging platform for AWS. Logs are organized into **log groups** (one per application or service, where you set the retention period) and **log streams** (one per source instance — a single Lambda execution environment, a single EC2 instance, a single ECS task). Retention can be set from 1 day to 10 years, or configured to never expire. Setting appropriate retention is important — unlimited log retention accumulates cost.

**CloudWatch Logs Insights** is an interactive query engine for your logs. It uses a SQL-like syntax that supports filtering, aggregating, sorting, and visualizing log data across multiple log groups simultaneously:

\`\`\`
fields @timestamp, @message
| filter @message like /ERROR/
| stats count(*) as errorCount by bin(5m)
| sort @timestamp desc
| limit 20
\`\`\`

**Metric Filters** extract metric values from log text patterns without requiring any code changes. For example, you can configure a metric filter that counts occurrences of the string "ERROR" in your Lambda logs and publishes that count as a CloudWatch metric, which you can then alarm on.

**Subscription Filters** stream log data in near real-time to other services for processing or storage: Lambda (for real-time analysis or routing), Kinesis Data Streams (for downstream consumers), Kinesis Firehose (for delivery to S3 or OpenSearch), or OpenSearch Service directly. This is how you build log aggregation pipelines and centralized logging architectures. VPC Flow Logs and CloudTrail can both publish to CloudWatch Logs for unified analysis.`,
      quiz: [
        {
          question:
            "What is the difference between a CloudWatch Logs log group and a log stream?",
          options: [
            "Log groups contain metrics; log streams contain log events",
            "Log groups are per application/service and hold retention settings; log streams are per source instance",
            "Log streams are for structured logs; log groups are for unstructured logs",
            "Log groups are regional; log streams are global",
          ],
          correctIndex: 1,
          explanation:
            "A log group is the organizational container per application or service, where you configure retention. A log stream is created per source instance — one per Lambda execution environment, EC2 instance, or ECS task — and contains the actual log events from that source.",
        },
        {
          question:
            "What is the purpose of a CloudWatch Logs Subscription Filter?",
          options: [
            "Filtering log events before they are stored in a log group",
            "Streaming log data in near real-time to Lambda, Kinesis, or Firehose for processing",
            "Creating CloudWatch alarms based on log patterns",
            "Restricting which IAM principals can query a log group",
          ],
          correctIndex: 1,
          explanation:
            "Subscription Filters stream log data in near real-time to destinations like Lambda, Kinesis Data Streams, Kinesis Firehose, or OpenSearch Service. This enables building real-time log processing pipelines and centralized logging architectures.",
        },
        {
          question:
            "A team wants to alarm on the number of ERROR log entries in a Lambda function's logs without modifying the function's code. What is the correct CloudWatch feature?",
          options: [
            "CloudWatch Logs Insights query",
            "CloudWatch Subscription Filter",
            "CloudWatch Logs Metric Filter",
            "CloudWatch Synthetics",
          ],
          correctIndex: 2,
          explanation:
            "A Metric Filter extracts metric values from log text patterns without any code changes. You configure a filter pattern matching 'ERROR', and CloudWatch automatically publishes a count metric that you can create an alarm on. No code changes to the Lambda function are required.",
        },
      ],
    },
    {
      heading: "Alarms",
      body: `A **CloudWatch Alarm** watches a metric or Metric Math expression and changes state when the metric crosses a threshold for a configured number of consecutive evaluation periods. The three states are **OK** (metric is within the threshold), **ALARM** (metric has breached the threshold), and **INSUFFICIENT_DATA** (not enough data points to evaluate).

Alarm configuration involves several parameters that work together. The **period** is the evaluation window (60 seconds, 300 seconds, etc.). **Evaluation periods** is how many consecutive windows to check. **Datapoints to alarm** is how many of those windows must be in breach — setting this to "3 of 5" means the alarm only fires after 3 consecutive breaches within a 5-period window, reducing false positives from brief spikes. **Missing data treatment** determines how gaps in metric data affect alarm state.

When an alarm transitions to ALARM state, it can trigger actions including SNS notifications (which fan out to email, SMS, Lambda, or SQS), EC2 instance actions (stop, terminate, reboot, recover), Auto Scaling actions, and Systems Manager OpsCenter OpsItem creation.

**Composite Alarms** combine multiple alarms using AND/OR logic to create a single higher-level alarm. This reduces noise — instead of getting paged for every individual metric threshold breach, you can require that both CPU is high AND error rate is elevated before triggering an alert. **Anomaly Detection** uses ML to model the expected behavior of a metric over time (including time-of-day and day-of-week patterns) and alarms when the actual metric deviates significantly from the expected band. **CloudWatch Synthetics** lets you define canary scripts that run on a schedule and alarm if they fail, providing synthetic monitoring for your endpoints.`,
      quiz: [
        {
          question:
            "What does setting 'Datapoints to alarm' to '3 of 5' mean for a CloudWatch Alarm?",
          options: [
            "The alarm fires if the metric breaches the threshold in any 3 of the last 5 evaluation periods",
            "The alarm requires 3 consecutive breaches before firing, resetting after 5 periods",
            "The alarm samples 3 data points per evaluation period across 5 metrics",
            "The alarm fires after 3 minutes and resets after 5 minutes",
          ],
          correctIndex: 0,
          explanation:
            "Setting 'Datapoints to alarm' to '3 of 5' means the alarm fires when 3 out of the 5 most recent evaluation periods are in breach. This reduces false positives from transient spikes — a single brief spike won't trigger the alarm, but sustained elevated values will.",
        },
        {
          question: "What is a Composite Alarm in CloudWatch?",
          options: [
            "An alarm that monitors multiple metrics simultaneously using Metric Math",
            "An alarm that combines multiple individual alarms using AND/OR logic into a single higher-level alarm",
            "An alarm that automatically scales EC2 instances based on multiple conditions",
            "An alarm that aggregates metrics from multiple AWS accounts",
          ],
          correctIndex: 1,
          explanation:
            "A Composite Alarm combines the states of multiple alarms using AND/OR Boolean logic into a single alarm. This reduces noise — for example, you can require both high CPU AND high error rate before paging on-call, preventing alerts from isolated metric spikes.",
        },
        {
          question: "What are the three possible states of a CloudWatch Alarm?",
          options: [
            "Active, Inactive, Pending",
            "OK, ALARM, INSUFFICIENT_DATA",
            "Normal, Warning, Critical",
            "Healthy, Unhealthy, Unknown",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Alarms have three states: OK (metric is within threshold), ALARM (metric has breached threshold for the configured evaluation periods), and INSUFFICIENT_DATA (not enough data points to evaluate the alarm, which is common for new alarms or sparse metrics).",
        },
      ],
    },
    {
      heading: "Dashboards",
      body: `CloudWatch Dashboards are customizable views that bring multiple metrics, alarms, and log queries together in a single screen. They support a variety of widget types — line charts, stacked area charts, number widgets (for current values), bar charts, pie charts, alarm status widgets, and text blocks with markdown.

Dashboards can display metrics and alarms from multiple AWS accounts and regions in a single view, which requires setting up CloudWatch cross-account observability (where monitored accounts share metric data with a monitoring account). This is the standard approach for centralized observability in multi-account AWS environments.

CloudWatch automatically creates **service dashboards** for many AWS services — these pre-built dashboards for services like Lambda, API Gateway, and DynamoDB appear under "Service dashboards" in the console and require no configuration. Dashboards can also be shared with specific IAM users or made publicly accessible (without AWS credentials), which is useful for operations teams or NOC displays.`,
      quiz: [
        {
          question:
            "Can a single CloudWatch Dashboard display metrics from multiple AWS accounts and regions?",
          options: [
            "No — dashboards are strictly account and region scoped",
            "Yes — using CloudWatch cross-account observability to share metrics to a central monitoring account",
            "Yes — by creating a separate dashboard per account and linking them",
            "Only if all accounts are in the same AWS Organization root",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Dashboards support cross-account and cross-region views. You set up CloudWatch cross-account observability where monitored accounts share their metric data with a central monitoring account. This is the standard approach for multi-account observability.",
        },
        {
          question: "What are CloudWatch Service Dashboards?",
          options: [
            "Custom dashboards that must be manually created for each service",
            "Pre-built dashboards automatically available for services like Lambda, API Gateway, and DynamoDB — no configuration needed",
            "Dashboards that aggregate billing costs by service",
            "Dashboards created by AWS Support for troubleshooting specific services",
          ],
          correctIndex: 1,
          explanation:
            "Service dashboards are pre-built CloudWatch dashboards automatically created for many AWS services. They appear under 'Service dashboards' in the console and provide key metrics for services like Lambda, API Gateway, and DynamoDB without requiring any configuration.",
        },
      ],
    },
    {
      heading: "CloudWatch Events / EventBridge",
      body: `CloudWatch Events was the original name for what is now **Amazon EventBridge**. The underlying service is the same — the branding changed when AWS expanded it with partner event buses, schema registry, API Destinations, and Pipes. CloudWatch Events still works, but new development should use EventBridge directly.

The core capability is responding to state changes in AWS resources in near real-time. When an EC2 instance changes state, a CodePipeline execution changes status, or an S3 object is created, an event is emitted to the default EventBridge event bus. You create rules that match these events and route them to targets like Lambda functions, SQS queues, SNS topics, ECS tasks, or Step Functions state machines.

CloudWatch Alarms can publish to EventBridge when their state changes, enabling automated remediation workflows triggered by metric thresholds. See the EventBridge guide for full detail on event patterns, scheduling, and advanced routing features.`,
      quiz: [
        {
          question:
            "What is the relationship between CloudWatch Events and Amazon EventBridge?",
          options: [
            "They are completely separate services with different functionality",
            "CloudWatch Events is the newer, expanded version of EventBridge",
            "CloudWatch Events is the original name — EventBridge is the current branding of the same underlying service with added features",
            "EventBridge replaced CloudWatch Events and all existing CloudWatch Events rules were deleted",
          ],
          correctIndex: 2,
          explanation:
            "CloudWatch Events and EventBridge are the same underlying service. The branding changed to EventBridge when AWS added partner event buses, schema registry, API Destinations, and Pipes. CloudWatch Events rules still work, but new development should use EventBridge.",
        },
        {
          question:
            "How can CloudWatch Alarms trigger automated remediation workflows?",
          options: [
            "By directly invoking Lambda functions when threshold is breached",
            "By publishing state change events to EventBridge, which routes to targets like Lambda or Step Functions",
            "By writing to a CloudWatch Logs stream that a Lambda function polls",
            "By sending HTTP requests to a configured webhook URL",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Alarms publish state change events to EventBridge when they transition between OK, ALARM, and INSUFFICIENT_DATA. EventBridge rules can match these events and route them to remediation targets like Lambda functions or Step Functions state machines.",
        },
      ],
    },
    {
      heading: "CloudWatch with Other Services",
      body: `CloudWatch's integrations with other AWS services form the backbone of operational observability.

Lambda automatically publishes \`Duration\`, \`Invocations\`, \`Errors\`, \`Throttles\`, \`ConcurrentExecutions\`, and \`UnreservedConcurrentExecutions\` metrics. Alarms on error rate and throttle rate are the minimum viable monitoring for any production Lambda function.

API Gateway publishes \`Count\`, \`Latency\`, \`IntegrationLatency\`, \`4XXError\`, and \`5XXError\` per stage. Enable detailed metrics for per-route breakdowns and access logging for full request details — these are both disabled by default and must be configured explicitly.

DynamoDB emits \`ConsumedRCU\`, \`ConsumedWCU\`, \`SuccessfulRequestLatency\`, and \`ThrottledRequests\`. Alarms on \`ThrottledRequests\` are the primary signal for DynamoDB capacity issues. EC2's default metrics come at 5-minute granularity for free; enabling detailed monitoring gives 1-minute granularity at additional cost. Memory utilization and disk usage require the CloudWatch Agent to be installed.

The most commonly used CloudWatch integration is **CloudWatch Alarms driving Auto Scaling** — scaling EC2 fleets and ECS services based on CPU utilization, queue depth, or custom application metrics. Together with X-Ray (distributed traces) and CloudWatch Logs, CloudWatch metrics form the "three pillars" of observability for AWS workloads.`,
      quiz: [
        {
          question:
            "EC2 detailed monitoring vs. basic monitoring — what is the key difference?",
          options: [
            "Detailed monitoring adds memory and disk metrics; basic does not",
            "Detailed monitoring provides 1-minute metric granularity; basic provides 5-minute granularity",
            "Detailed monitoring includes CloudWatch Logs integration; basic does not",
            "Detailed monitoring sends metrics to multiple regions; basic is single-region",
          ],
          correctIndex: 1,
          explanation:
            "EC2 basic monitoring provides metrics at 5-minute granularity for free. Enabling detailed monitoring gives 1-minute granularity at additional cost. Neither includes memory metrics — those require the CloudWatch Agent regardless of the monitoring mode.",
        },
        {
          question:
            "Which API Gateway metrics are disabled by default and must be explicitly configured?",
          options: [
            "Count and Latency",
            "4XXError and 5XXError",
            "Detailed metrics (per-route) and access logging",
            "IntegrationLatency and CacheHitCount",
          ],
          correctIndex: 2,
          explanation:
            "API Gateway's detailed metrics (per-route breakdowns) and access logging are both disabled by default and must be explicitly enabled per stage. The basic stage-level metrics (Count, Latency, 4XXError, 5XXError) are published automatically.",
        },
      ],
    },
  ],

  keyFacts: [
    "Metric retention: 1s for 3hr, 1min for 15d, 5min for 63d, 1hr for 15mo",
    "High-resolution custom metrics: StorageResolution=1 (1-second granularity)",
    "CloudWatch Logs Insights: query logs with SQL-like syntax across log groups",
    "Metric filters: extract metrics from log text patterns",
    "Subscription filters: stream logs to Lambda, Kinesis, Firehose in near-real-time",
    "Composite alarms: combine alarms with AND/OR to reduce alarm noise",
    "Anomaly Detection: ML-based expected metric bands for smart alarming",
    "CloudWatch Agent: required for EC2 memory, disk I/O (not published by default)",
    "EMF (Embedded Metrics Format): publish metrics via structured logs from Lambda",
    "Synthetics Canaries: scheduled scripts monitoring endpoints, generate screenshots/HAR",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon EC2",
    "Amazon API Gateway",
    "Amazon DynamoDB",
    "Amazon RDS",
    "Amazon ECS",
    "AWS X-Ray",
    "Amazon EventBridge",
    "Amazon SNS",
    "AWS Auto Scaling",
  ],

  examTips: [
    "EC2 memory metrics: NOT published by default — requires CloudWatch Agent installation.",
    "High-resolution metrics: 1-second granularity; standard is 1-minute.",
    "Composite alarms: reduce noise by combining multiple metric alarms with AND/OR.",
    "Metric filters extract metrics from logs — no code change required to count ERRORs.",
    "Subscription filters stream logs in real-time to Lambda/Kinesis/Firehose.",
    "EMF: write structured JSON to stdout in Lambda → CloudWatch auto-extracts metrics.",
    "Alarm missing data: choose breaching/not-breaching/ignore/missing — affects alarm behavior.",
    "Logs Insights: fields, filter, stats, sort, limit — interactive log querying.",
    "CloudWatch Events = old branding; EventBridge = current branding (same service).",
  ],

  topicQuiz: [
    {
      question:
        "A team needs to monitor memory utilization on their EC2 instances. The metric is not appearing in CloudWatch. What is the most likely cause?",
      options: [
        "Memory metrics require enabling detailed EC2 monitoring",
        "Memory metrics are only available for EC2 instances in a VPC",
        "Memory metrics are not published by the EC2 service — the CloudWatch Agent must be installed",
        "Memory metrics require the instance to have an instance profile with CloudWatch permissions",
      ],
      correctIndex: 2,
      explanation:
        "EC2 does not publish memory utilization by default because it's an OS-level metric the hypervisor cannot observe. The CloudWatch Agent must be installed on the instance to collect and publish memory metrics. This is one of the most common EC2 monitoring gotchas.",
    },
    {
      question:
        "A Lambda function generates thousands of invocations per second. A developer wants to publish a custom business metric (order count) per invocation without adding latency. Which approach is correct?",
      options: [
        "Call PutMetricData in a background thread after the function returns",
        "Write structured JSON using the Embedded Metrics Format (EMF) to stdout",
        "Batch metric data and call PutMetricData every 60 seconds from a scheduled Lambda",
        "Use a Metric Filter on the Lambda log group to count invocations as a proxy",
      ],
      correctIndex: 1,
      explanation:
        "EMF allows Lambda to publish metrics by writing structured JSON to stdout — no API call, no added latency. The Lambda runtime (or CloudWatch Logs agent) automatically extracts and publishes the metrics. This is the recommended pattern for high-throughput Lambda metric publishing.",
    },
    {
      question:
        "An operations team receives too many CloudWatch alarm notifications. CPU alarms, memory alarms, and error rate alarms all fire independently. How can they reduce alert noise while still being notified when the system is truly degraded?",
      options: [
        "Increase the alarm thresholds so individual alarms fire less often",
        "Create a Composite Alarm combining CPU, memory, and error rate alarms with AND logic",
        "Disable individual alarms and rely on CloudWatch Anomaly Detection",
        "Increase the evaluation period to 1 hour so transient spikes don't trigger alarms",
      ],
      correctIndex: 1,
      explanation:
        "A Composite Alarm combines multiple alarm states using AND/OR logic. Requiring all three alarms (CPU AND memory AND error rate) to be in ALARM state before notifying eliminates false positives from isolated metric spikes, while still alerting when the system is genuinely degraded.",
    },
    {
      question:
        "A security team wants to count all failed SSH login attempts logged in /var/log/auth.log on EC2 instances and alarm when the count exceeds 10 in 5 minutes. What combination of CloudWatch features is needed?",
      options: [
        "CloudWatch Agent + Metric Filter + Alarm",
        "CloudWatch Agent + Subscription Filter + SNS",
        "CloudWatch Logs Insights + Alarm + SNS",
        "CloudWatch Synthetics + Metric Filter + Alarm",
      ],
      correctIndex: 0,
      explanation:
        "The CloudWatch Agent collects /var/log/auth.log and ships it to CloudWatch Logs. A Metric Filter on the log group counts occurrences of failed SSH patterns. A CloudWatch Alarm on the resulting metric triggers when the count exceeds 10 in a 5-minute period.",
    },
    {
      question:
        "A developer wants to query Lambda logs across multiple log groups for ERROR messages in the last hour and count them by function. Which CloudWatch feature enables this?",
      options: [
        "Metric Filters with per-function dimensions",
        "CloudWatch Logs Insights with a query spanning multiple log groups",
        "Subscription Filters streaming to Kinesis for aggregation",
        "CloudWatch Dashboards with Metric Math expressions",
      ],
      correctIndex: 1,
      explanation:
        "CloudWatch Logs Insights supports interactive queries across multiple log groups simultaneously using SQL-like syntax. You can filter for ERROR messages, aggregate by function name, and sort results — all interactively without needing to stream data elsewhere first.",
    },
    {
      question:
        "An alarm is in INSUFFICIENT_DATA state. What does this indicate?",
      options: [
        "The metric threshold has been breached",
        "There are not enough data points to evaluate the alarm's threshold",
        "The alarm was incorrectly configured with an invalid threshold",
        "The metric namespace does not exist",
      ],
      correctIndex: 1,
      explanation:
        "INSUFFICIENT_DATA means CloudWatch does not have enough data points to evaluate whether the alarm should be in OK or ALARM state. This is common for new alarms, sparse metrics, or when a service stops publishing metrics. How INSUFFICIENT_DATA is treated (as breaching or not) is configurable.",
    },
    {
      question:
        "A team needs to stream CloudWatch logs to an S3 bucket for long-term archival and to OpenSearch for real-time search. What is the most efficient architecture?",
      options: [
        "Create two separate Subscription Filters: one to Kinesis Firehose (for S3) and one to OpenSearch Service directly",
        "Create a Subscription Filter to Lambda, which fans out to both S3 and OpenSearch",
        "Use a Metric Filter to count log events and store results in S3",
        "Export log groups to S3 daily using the CreateExportTask API and configure a separate pipeline for OpenSearch",
      ],
      correctIndex: 0,
      explanation:
        "You can create multiple Subscription Filters on a log group. One filter streams to Kinesis Firehose for S3 archival; another streams directly to OpenSearch Service. This provides near-real-time delivery to both destinations without requiring a Lambda fan-out function.",
    },
    {
      question:
        "A company wants to monitor their REST API's health continuously and alert if specific user journeys break, even when there's no real user traffic. Which CloudWatch feature enables this?",
      options: [
        "CloudWatch Anomaly Detection on API Gateway latency metrics",
        "CloudWatch Synthetics canaries running scripted checks on a schedule",
        "Metric Filters on API Gateway access logs",
        "Composite Alarms combining 4XXError and 5XXError metrics",
      ],
      correctIndex: 1,
      explanation:
        "CloudWatch Synthetics allows you to define canary scripts that simulate user journeys against your API on a schedule. If the canary fails, an alarm fires — even when there's no real user traffic. This provides synthetic monitoring independent of actual traffic volume.",
    },
  ],
};
