import { ServiceGuide } from "../../types/guide";

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
      body: `A **metric** is a time-ordered set of data points published to CloudWatch. Every AWS service publishes metrics automatically (EC2 CPU, Lambda Duration, DynamoDB ConsumedRCU).

**Namespace**: logical container for metrics. AWS services use namespaces like \`AWS/EC2\`, \`AWS/Lambda\`, \`AWS/DynamoDB\`. Your custom metrics go in your own namespace (e.g. \`MyApp/Orders\`).

**Dimensions**: key-value pairs that identify a metric. EC2 metrics have a \`InstanceId\` dimension. Lambda metrics have \`FunctionName\` and \`Resource\`. You can filter and aggregate by dimension.

**Resolution**:
- *Standard resolution*: 1-minute granularity (default for AWS service metrics)
- *High resolution*: 1-second granularity (for custom metrics published with StorageResolution=1). Stored for 3 hours at 1-second, 1 hour at 60-second, then downsampled further.

**Metric retention**:
- 3 hours: 1-second data
- 15 days: 1-minute data
- 63 days: 5-minute data
- 15 months: 1-hour data

**Statistics**: Sum, Average, Minimum, Maximum, SampleCount, Percentile (p90, p99). Percentile statistics require sufficient data points.

**Metric Math**: perform calculations across multiple metrics (e.g. \`error_rate = errors / requests * 100\`). Use in dashboards and alarms.`,
    },
    {
      heading: "Custom Metrics",
      body: `Publish custom metrics using **PutMetricData** API. Use from Lambda, EC2, ECS tasks, or any service with SDK access.

\`\`\`
cloudwatch.put_metric_data(
  Namespace='MyApp/Orders',
  MetricData=[{
    'MetricName': 'OrdersPlaced',
    'Dimensions': [{'Name': 'Environment', 'Value': 'production'}],
    'Value': 1,
    'Unit': 'Count',
    'StorageResolution': 60  # standard; use 1 for high-res
  }]
)
\`\`\`

**CloudWatch Agent**: install on EC2 or on-premises servers to collect:
- System-level metrics not available by default: memory utilization, disk I/O, swap
- Application logs from files on disk
- Custom application metrics via StatsD or collectd

**Embedded Metrics Format (EMF)**: write metrics as structured JSON logs to stdout. CloudWatch Logs agent or Lambda runtime automatically extracts them as CloudWatch Metrics. No explicit PutMetricData call needed. Ideal for Lambda:
\`\`\`
{ "_aws": { "Timestamp": 1234567890000, "CloudWatchMetrics": [{ "Namespace": "MyApp", "Dimensions": [["FunctionName"]], "Metrics": [{"Name": "OrdersProcessed", "Unit": "Count"}] }] }, "FunctionName": "order-processor", "OrdersProcessed": 5 }
\`\`\``,
    },
    {
      heading: "CloudWatch Logs",
      body: `CloudWatch Logs stores, monitors, and provides access to log files from AWS services and your applications.

**Log Group**: container for log streams. Set retention (1 day to never). Associate metric filters and subscription filters at this level.

**Log Stream**: sequence of log events from a single source (one Lambda function instance, one EC2 instance, one ECS task).

**Log Insights**: interactive query language for logs. SQL-like syntax:
\`\`\`
fields @timestamp, @message
| filter @message like /ERROR/
| stats count(*) as errorCount by bin(5m)
| sort @timestamp desc
| limit 20
\`\`\`
Queries run across multiple log groups. Results exportable.

**Metric Filters**: extract metric data from log text patterns. Example: count occurrences of "ERROR" in Lambda logs → publish as a CloudWatch metric → alarm on it.

**Subscription Filters**: stream log data in near real-time to:
- Lambda (process/analyze)
- Kinesis Data Streams (downstream consumers)
- Kinesis Firehose (S3, Elasticsearch)
- OpenSearch Service

**Log retention**: set per log group (1 day to 10 years or never expire). Cost increases with storage — set appropriate retention.

**VPC Flow Logs / CloudTrail**: both can publish to CloudWatch Logs for analysis.`,
    },
    {
      heading: "Alarms",
      body: `A **CloudWatch Alarm** watches a single metric or metric math expression and triggers actions when the metric crosses a threshold.

**States**: OK, ALARM, INSUFFICIENT_DATA (not enough data points to evaluate).

**Alarm types**:
- *Metric alarm*: single metric vs threshold
- *Composite alarm*: combines multiple alarms with AND/OR logic. Reduces alarm noise.

**Alarm configuration**:
- Period: evaluation window (60s, 300s, etc.)
- Evaluation periods: how many consecutive periods must be in breach
- Datapoints to alarm: of the evaluation periods, how many must breach (e.g. 3 of 5 to avoid flapping)
- Missing data treatment: breaching, not-breaching, ignore, missing

**Alarm actions**:
- SNS notification → email, SMS, Lambda, SQS
- EC2 actions: stop, terminate, reboot, recover instance
- Auto Scaling: scale out/in
- Systems Manager OpsCenter: create OpsItem

**Anomaly Detection**: use ML to model expected metric behavior and alarm when actual deviates from the band. Accounts for time-of-day and day-of-week patterns.

**CloudWatch Synthetics (Canaries)**: configurable scripts that run on schedule and monitor endpoints or APIs. Alarm if canary fails. Generates detailed HAR files and screenshots.`,
    },
    {
      heading: "Dashboards",
      body: `CloudWatch Dashboards are customizable home pages in the CloudWatch console for monitoring your resources in a single view.

**Widget types**: line chart, stacked area, number, bar chart, pie chart, text (markdown), alarm status, logs table.

**Cross-account/cross-region**: dashboards can display metrics from multiple AWS accounts and regions in one view (requires CloudWatch cross-account observability setup).

**Automatic dashboards**: CloudWatch automatically creates service-level dashboards for many AWS services. Available in the CloudWatch console under "Service dashboards."

**Dashboard sharing**: share dashboards publicly or with specific IAM roles/users. Useful for NOC/ops teams who don't have full console access.

**Cost**: $3/dashboard/month (first 3 dashboards free). Widgets within a dashboard are free.`,
    },
    {
      heading: "CloudWatch Events / EventBridge",
      body: `CloudWatch Events has been superseded by **Amazon EventBridge** (the same underlying service, now branded separately). CloudWatch Events is still functional but new development should use EventBridge.

**What it does**: respond to state changes in AWS resources. Schedule automated actions (cron). Route events to targets (Lambda, SQS, SNS, ECS, Step Functions).

See the EventBridge guide for full detail. The CloudWatch-side integration: CloudWatch Alarms can publish to EventBridge when alarm state changes.`,
    },
    {
      heading: "CloudWatch with Other Services",
      body: `**CloudWatch + Lambda**: Lambda automatically publishes Duration, Invocations, Errors, Throttles, ConcurrentExecutions, UnreservedConcurrentExecutions metrics. Alarm on Errors rate or throttle rate for Lambda health.

**CloudWatch + API Gateway**: publishes Count, Latency, IntegrationLatency, 4XXError, 5XXError per stage and route. Enable detailed metrics per resource for per-route breakdown. Enable access logging to a log group for full request details.

**CloudWatch + DynamoDB**: ConsumedRCU/WCU, SuccessfulRequestLatency, ThrottledRequests, SystemErrors. Alarm on throttles to detect capacity issues.

**CloudWatch + ECS**: Task CPU/memory utilization, service metrics. Install CloudWatch agent as sidecar for container-level metrics and logs.

**CloudWatch + EC2**: basic monitoring = 5-min metrics (free). Detailed monitoring = 1-min metrics ($). Memory and disk require CloudWatch agent.

**CloudWatch + RDS**: CPU, FreeStorageSpace, DatabaseConnections, ReadIOPS, WriteIOPS. Enhanced Monitoring: 1-second OS-level metrics (separate cost).

**CloudWatch + Alarms → Auto Scaling**: the most common CloudWatch integration. Scale EC2/ECS based on CPU, queue depth, custom metric.

**CloudWatch + X-Ray**: X-Ray provides trace data; CloudWatch Logs Insights can query X-Ray trace logs. Use together for full observability (metrics + traces + logs = three pillars).`,
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
