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
    },
    {
      heading: "Custom Metrics",
      body: `You publish custom metrics using the \`PutMetricData\` API from any code that can make AWS SDK calls — Lambda functions, EC2 instances, ECS containers, or any other compute environment. Each metric data point includes a namespace, metric name, dimensions, value, unit, and an optional timestamp. Setting \`StorageResolution\` to 1 publishes a high-resolution metric at 1-second granularity.

For EC2 instances and on-premises servers, the **CloudWatch Agent** extends what you can monitor. By default, EC2 publishes CPU, network, and disk I/O metrics — but memory utilization and disk usage at the file system level are not published by the EC2 service itself. Installing the CloudWatch Agent gives you those operating system-level metrics, plus the ability to collect application logs from files on disk.

The **Embedded Metrics Format (EMF)** is a pattern specifically optimized for Lambda. Instead of calling \`PutMetricData\` from your function, you write structured JSON to stdout that includes a special \`_aws\` envelope. The Lambda runtime (or CloudWatch Logs agent) automatically detects the EMF format and extracts the metrics, publishing them to CloudWatch without an explicit API call. This avoids adding latency to your function's response while still capturing metrics.`,
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
    },
    {
      heading: "Alarms",
      body: `A **CloudWatch Alarm** watches a metric or Metric Math expression and changes state when the metric crosses a threshold for a configured number of consecutive evaluation periods. The three states are **OK** (metric is within the threshold), **ALARM** (metric has breached the threshold), and **INSUFFICIENT_DATA** (not enough data points to evaluate).

Alarm configuration involves several parameters that work together. The **period** is the evaluation window (60 seconds, 300 seconds, etc.). **Evaluation periods** is how many consecutive windows to check. **Datapoints to alarm** is how many of those windows must be in breach — setting this to "3 of 5" means the alarm only fires after 3 consecutive breaches within a 5-period window, reducing false positives from brief spikes. **Missing data treatment** determines how gaps in metric data affect alarm state.

When an alarm transitions to ALARM state, it can trigger actions including SNS notifications (which fan out to email, SMS, Lambda, or SQS), EC2 instance actions (stop, terminate, reboot, recover), Auto Scaling actions, and Systems Manager OpsCenter OpsItem creation.

**Composite Alarms** combine multiple alarms using AND/OR logic to create a single higher-level alarm. This reduces noise — instead of getting paged for every individual metric threshold breach, you can require that both CPU is high AND error rate is elevated before triggering an alert. **Anomaly Detection** uses ML to model the expected behavior of a metric over time (including time-of-day and day-of-week patterns) and alarms when the actual metric deviates significantly from the expected band. **CloudWatch Synthetics** lets you define canary scripts that run on a schedule and alarm if they fail, providing synthetic monitoring for your endpoints.`,
    },
    {
      heading: "Dashboards",
      body: `CloudWatch Dashboards are customizable views that bring multiple metrics, alarms, and log queries together in a single screen. They support a variety of widget types — line charts, stacked area charts, number widgets (for current values), bar charts, pie charts, alarm status widgets, and text blocks with markdown.

Dashboards can display metrics and alarms from multiple AWS accounts and regions in a single view, which requires setting up CloudWatch cross-account observability (where monitored accounts share metric data with a monitoring account). This is the standard approach for centralized observability in multi-account AWS environments.

CloudWatch automatically creates **service dashboards** for many AWS services — these pre-built dashboards for services like Lambda, API Gateway, and DynamoDB appear under "Service dashboards" in the console and require no configuration. Dashboards can also be shared with specific IAM users or made publicly accessible (without AWS credentials), which is useful for operations teams or NOC displays.`,
    },
    {
      heading: "CloudWatch Events / EventBridge",
      body: `CloudWatch Events was the original name for what is now **Amazon EventBridge**. The underlying service is the same — the branding changed when AWS expanded it with partner event buses, schema registry, API Destinations, and Pipes. CloudWatch Events still works, but new development should use EventBridge directly.

The core capability is responding to state changes in AWS resources in near real-time. When an EC2 instance changes state, a CodePipeline execution changes status, or an S3 object is created, an event is emitted to the default EventBridge event bus. You create rules that match these events and route them to targets like Lambda functions, SQS queues, SNS topics, ECS tasks, or Step Functions state machines.

CloudWatch Alarms can publish to EventBridge when their state changes, enabling automated remediation workflows triggered by metric thresholds. See the EventBridge guide for full detail on event patterns, scheduling, and advanced routing features.`,
    },
    {
      heading: "CloudWatch with Other Services",
      body: `CloudWatch's integrations with other AWS services form the backbone of operational observability.

Lambda automatically publishes \`Duration\`, \`Invocations\`, \`Errors\`, \`Throttles\`, \`ConcurrentExecutions\`, and \`UnreservedConcurrentExecutions\` metrics. Alarms on error rate and throttle rate are the minimum viable monitoring for any production Lambda function.

API Gateway publishes \`Count\`, \`Latency\`, \`IntegrationLatency\`, \`4XXError\`, and \`5XXError\` per stage. Enable detailed metrics for per-route breakdowns and access logging for full request details — these are both disabled by default and must be configured explicitly.

DynamoDB emits \`ConsumedRCU\`, \`ConsumedWCU\`, \`SuccessfulRequestLatency\`, and \`ThrottledRequests\`. Alarms on \`ThrottledRequests\` are the primary signal for DynamoDB capacity issues. EC2's default metrics come at 5-minute granularity for free; enabling detailed monitoring gives 1-minute granularity at additional cost. Memory utilization and disk usage require the CloudWatch Agent to be installed.

The most commonly used CloudWatch integration is **CloudWatch Alarms driving Auto Scaling** — scaling EC2 fleets and ECS services based on CPU utilization, queue depth, or custom application metrics. Together with X-Ray (distributed traces) and CloudWatch Logs, CloudWatch metrics form the "three pillars" of observability for AWS workloads.`,
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
};
