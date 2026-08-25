import { ServiceGuide } from "../../../types/guide";

export const cloudwatchGuide: ServiceGuide = {
  id: "saa-cloudwatch",
  service: "Amazon CloudWatch",
  domain: "troubleshooting",
  tagline:
    "Unified observability for metrics, logs, alarms, and dashboards across AWS",
  intro:
    "Amazon CloudWatch is the native AWS observability platform that collects metrics, logs, and traces from AWS services and custom applications, enabling architects to monitor system health, detect anomalies, trigger automated responses, and troubleshoot performance issues across their entire infrastructure.",

  sections: [
    {
      heading: "Metrics, Namespaces, and Dimensions",
      body: `CloudWatch metrics are time-series data points representing the behavior of AWS resources and custom applications. Every AWS service publishes metrics to CloudWatch automatically — EC2 publishes CPU utilization, network I/O, and disk I/O at one-minute granularity (five-minute for basic monitoring), while services like RDS, Lambda, and ALB publish their own service-specific metrics. Metrics are organized by namespace (e.g., \`AWS/EC2\`, \`AWS/RDS\`) and scoped by dimensions — key-value pairs like \`InstanceId\` or \`DBInstanceIdentifier\` that identify the specific resource. Custom metrics published by applications use a custom namespace and can include any dimensions needed for filtering. High-resolution metrics support sub-minute granularity down to one second, enabling detection of short-lived spikes that a one-minute metric period would smooth over. Metric math expressions combine multiple metrics into computed metrics — for example, calculating error rate as errors divided by total requests — without storing derived data separately.`,
    },
    {
      heading: "CloudWatch Alarms and Automated Responses",
      body: `CloudWatch Alarms continuously evaluate metric data against defined thresholds and transition between three states: OK (metric is within threshold), ALARM (metric breaches threshold), and INSUFFICIENT_DATA (not enough data to evaluate). When an alarm enters the ALARM state, it can trigger one or more actions: sending a notification to an SNS topic (which in turn notifies operators via email/SMS or triggers Lambda), executing an EC2 Auto Scaling policy (scaling out or in based on load), stopping or terminating an EC2 instance, or creating a Systems Manager OpsItem. Composite alarms combine multiple alarms using AND/OR logic, reducing alarm noise by alerting only when multiple conditions are simultaneously true — for example, triggering only when both CPU is high AND disk I/O is high, avoiding false positives from transient CPU spikes. Alarm math and anomaly detection use machine learning to establish a dynamic baseline from historical metric patterns, triggering alarms when the metric deviates beyond a configurable band rather than a fixed threshold.`,
    },
    {
      heading: "CloudWatch Logs and Log Insights",
      body: `CloudWatch Logs collects, stores, and analyzes log data from EC2 instances (via the CloudWatch Logs Agent or the newer unified CloudWatch Agent), Lambda functions, API Gateway, VPC Flow Logs, CloudTrail, and custom applications. Log data is organized into Log Groups (one per application or service) containing Log Streams (one per source instance or execution). Log retention is configurable from 1 day to 10 years; logs are retained indefinitely by default at increasing cost. CloudWatch Logs Insights provides an interactive query interface with a purpose-built query language for filtering, aggregating, and visualizing log data — you can calculate statistics, identify top contributors, and correlate log events across multiple log groups in a single query. Log metric filters extract numeric values from log events and publish them as CloudWatch metrics — for example, counting the occurrences of the word \`ERROR\` in application logs and creating an alarm when the count exceeds a threshold.`,
    },
    {
      heading: "CloudWatch Agent and Custom Metrics",
      body: `The CloudWatch Unified Agent collects both system-level metrics and log files from EC2 instances and on-premises servers, publishing data that EC2 basic monitoring does not capture. Critically, memory utilization and disk space utilization are not published by EC2 basic monitoring — they must be collected by the CloudWatch Agent, which reads them from the OS and publishes them as custom metrics. The agent is configured via a JSON configuration file (or via SSM Parameter Store for centralized management) that specifies which metrics to collect at what intervals and which log files to tail. The \`collectd\` plugin allows arbitrary application metrics to be forwarded through the agent. Custom metrics can be published directly to CloudWatch via the \`PutMetricData\` API call from any application, enabling business metrics (orders per minute, active sessions) to be monitored alongside infrastructure metrics in the same dashboards and alarms.`,
    },
    {
      heading: "CloudWatch Dashboards and EventBridge Integration",
      body: `CloudWatch Dashboards provide customizable, shareable views of metrics and alarms across services and regions in a single pane of glass. Dashboards are JSON documents that define widgets (line graphs, bar charts, numbers, text) and can display metrics from multiple AWS accounts and regions in cross-account, cross-region setups when CloudWatch Observability Access Manager sharing is configured. Amazon EventBridge (formerly CloudWatch Events) receives near-real-time events from AWS services and custom applications and routes them to targets using event pattern rules. Events include AWS API calls (logged via CloudTrail), scheduled expressions (cron syntax for periodic Lambda invocations), and service state changes (EC2 instance state changes, RDS snapshot completion, CodePipeline failures). EventBridge is the recommended integration for event-driven automation, replacing CloudWatch Events with additional features including a schema registry, cross-account event buses, and third-party SaaS integrations.`,
    },
    {
      heading: "CloudWatch Container Insights and X-Ray Integration",
      body: `CloudWatch Container Insights collects, aggregates, and summarizes metrics and logs from containerized applications on Amazon ECS, EKS, and Kubernetes on EC2. It provides CPU, memory, disk, and network usage at the cluster, service, task, and container level, along with diagnostic information like container restart counts. Lambda Insights provides enhanced operational metrics for Lambda functions — initialization duration, memory usage, CPU time, and cold start rate — beyond the standard Lambda CloudWatch metrics. AWS X-Ray integrates with CloudWatch to provide distributed tracing, allowing you to follow a single request as it flows through multiple Lambda functions, API Gateways, DynamoDB calls, and downstream HTTP services. CloudWatch ServiceLens combines X-Ray traces with CloudWatch metrics and logs into a service map that shows dependencies between components and highlights where latency and errors originate — essential for troubleshooting microservice architectures.`,
    },
  ],

  keyFacts: [
    "EC2 basic monitoring publishes metrics every 5 minutes; detailed monitoring every 1 minute",
    "Memory and disk utilization are NOT published by EC2 automatically — requires CloudWatch Agent",
    "Alarms have three states: OK, ALARM, INSUFFICIENT_DATA",
    "Composite alarms use AND/OR logic across multiple child alarms to reduce noise",
    "Log metric filters extract custom metrics from log text — enables alarms on log patterns",
    "CloudWatch Logs Insights queries log groups with a purpose-built query language",
    "EventBridge (CloudWatch Events) routes AWS service events and scheduled expressions to targets",
    "High-resolution metrics support down to 1-second granularity for detecting short spikes",
    "CloudWatch Agent collects OS-level metrics (memory, disk) and log files from EC2 and on-premises",
    "Container Insights provides cluster/service/task/container metrics for ECS and EKS",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon EC2",
    "Amazon EventBridge",
    "AWS X-Ray",
    "AWS CloudTrail",
    "AWS Auto Scaling",
  ],

  examTips: [
    "Memory and disk usage not in CloudWatch by default — install the CloudWatch Agent to get them",
    "Composite alarms reduce noise — alarm only when multiple conditions are simultaneously true",
    "Log metric filters turn log patterns into metrics and alarms — key for application-level monitoring",
    "EventBridge replaces CloudWatch Events — use EventBridge for all new event-driven automation",
    "Detailed monitoring (1 min) must be explicitly enabled — basic monitoring (5 min) is the default",
    "CloudWatch Logs Insights is the answer for querying and analyzing log data at scale",
    "Anomaly detection creates dynamic baselines — better than fixed thresholds for variable workloads",
    "X-Ray + CloudWatch = end-to-end observability from infrastructure metrics to distributed traces",
  ],
};
