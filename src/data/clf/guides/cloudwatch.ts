import { ServiceGuide } from "../../../types/guide";

export const cloudwatchGuide: ServiceGuide = {
  id: "clf-cloudwatch",
  service: "Amazon CloudWatch",
  domain: "deployment",
  tagline: "Monitor, log, and observe your AWS resources and applications",
  intro:
    "Amazon CloudWatch is AWS's built-in observability service, providing monitoring and management for AWS resources and applications through metrics, logs, alarms, and dashboards — giving you visibility into your entire AWS environment from a single place.",

  sections: [
    {
      heading: "Metrics and Monitoring",
      body: `CloudWatch collects **metrics** — time-series data points that measure the performance and behavior of AWS services. Every AWS service publishes metrics to CloudWatch automatically. For example, EC2 publishes \`CPUUtilization\`, \`NetworkIn\`, and \`DiskReadOps\`. RDS publishes \`DatabaseConnections\` and \`FreeStorageSpace\`. Lambda publishes \`Invocations\`, \`Duration\`, and \`Errors\`.

Metrics are organized by **namespace** (like \`AWS/EC2\` or \`AWS/Lambda\`) and **dimensions** (filters like \`InstanceId\` or \`FunctionName\`). The default resolution for CloudWatch metrics is **1-minute intervals**, though you can enable **high-resolution metrics** at 1-second intervals for some services.

By default, EC2 provides basic monitoring (5-minute intervals) for free. Enabling **detailed monitoring** switches to 1-minute intervals and provides more granular visibility, though it costs extra.

You can also publish your own **custom metrics** from your applications using the CloudWatch API or agents. For example, your application can track active user sessions, queue processing rate, or business metrics like orders per minute.`,
    },
    {
      heading: "CloudWatch Alarms",
      body: `**Alarms** are the action-taking component of CloudWatch. An alarm monitors a single metric over a time period and transitions between three states: **OK** (metric is within threshold), **ALARM** (metric breached the threshold), and **INSUFFICIENT_DATA** (not enough data to determine state).

When an alarm transitions to ALARM state, it can trigger actions:
- **SNS notification**: send an email, SMS, or trigger other AWS services via an SNS topic
- **EC2 action**: stop, terminate, reboot, or recover an EC2 instance
- **Auto Scaling action**: add or remove EC2 instances in an Auto Scaling Group
- **Systems Manager action**: run an Automation runbook

Common alarm patterns include: CPU exceeding 90% for 5 consecutive minutes triggers a scale-out event; error rate above 1% triggers a PagerDuty alert; DLQ message count above 0 triggers an investigation alert.

**Composite Alarms** combine multiple alarms using boolean logic (AND/OR), letting you create sophisticated alerting conditions like "alert only if CPU is high AND network throughput is low."`,
    },
    {
      heading: "CloudWatch Logs",
      body: `**CloudWatch Logs** is a service for collecting, storing, monitoring, and analyzing log data from your applications and infrastructure. It centralizes logs from all your AWS resources into one place.

Logs are organized into **Log Groups** (typically one per application or service) and **Log Streams** (typically one per resource instance, like one stream per EC2 instance). Log data is retained for a configurable period from 1 day to 10 years.

The **CloudWatch Logs Agent** and **CloudWatch Unified Agent** run on EC2 instances to ship logs (application logs, system logs) to CloudWatch. Lambda automatically writes to CloudWatch Logs without any configuration.

**Log Insights** provides an interactive query language to search and analyze log data. You can write queries to filter logs by error patterns, aggregate counts by time, or correlate events across log groups. This is powerful for troubleshooting and investigation.

**Metric Filters** extract metric data from log events. For example, you can define a filter that counts log lines containing "ERROR" and publish that count as a metric — allowing you to alarm when your error rate increases, even though the underlying data is in logs rather than native metrics.`,
    },
    {
      heading: "CloudWatch Dashboards and Events",
      body: `**CloudWatch Dashboards** are customizable views that display multiple metrics and alarms on a single screen. You create dashboards with widgets (graphs, numbers, text) from any metrics across any AWS service. Dashboards are cross-region — you can display metrics from multiple regions on one dashboard.

Dashboards are shared across an AWS account and can be made public (accessible without AWS credentials) for stakeholder visibility or status pages.

**CloudWatch Events** (now **Amazon EventBridge**) detects changes in your AWS environment and routes events to targets. For example, you can create a rule that runs a Lambda function every time an EC2 instance changes state, or that triggers an SNS notification when a CloudFormation stack deployment fails.

Scheduled rules in EventBridge (formerly CloudWatch Events) work like a serverless cron job — you define a schedule (e.g., every day at 8 AM UTC) and EventBridge invokes a target (Lambda, SNS, SQS, Step Functions) on that schedule without any server to manage.`,
    },
    {
      heading: "CloudWatch Agent and Container Insights",
      body: `The **CloudWatch Agent** is a unified agent you install on EC2 instances or on-premises servers to collect system-level metrics that AWS does not collect by default. These include memory utilization, disk space used, swap usage, and network connection counts.

This distinction is important for the exam: **EC2 does not report memory usage to CloudWatch by default.** You must install the CloudWatch Agent on the instance and configure it to collect memory metrics. This is a common exam question.

**Container Insights** collects, aggregates, and summarizes metrics and logs from containerized applications running on Amazon ECS and Amazon EKS. It provides pre-built dashboards for cluster, service, and task-level performance data.

**Application Insights** automatically configures monitoring for popular technologies like Java, .NET, IIS, and databases, suggesting relevant metrics and alarms based on the detected application stack.

For the Cloud Practitioner exam, the key CloudWatch concepts are: metrics for performance data, alarms for automated responses, and logs for log aggregation and search.`,
    },
  ],

  keyFacts: [
    "CloudWatch collects metrics, logs, and events from AWS services and custom sources",
    "Every AWS service publishes metrics to CloudWatch automatically",
    "EC2 basic monitoring: 5-minute intervals (free); detailed monitoring: 1-minute (paid)",
    "EC2 does NOT report memory usage by default — requires CloudWatch Agent",
    "Alarms monitor metrics and trigger actions: SNS, EC2 actions, Auto Scaling",
    "Alarms have three states: OK, ALARM, INSUFFICIENT_DATA",
    "CloudWatch Logs centralizes logs with configurable 1-day to 10-year retention",
    "Log Insights enables SQL-like queries across log groups",
    "Metric Filters extract metrics from log data (e.g., count ERROR log lines)",
    "Dashboards provide multi-metric, cross-region visibility in one view",
  ],

  relatedServices: [
    "Amazon EC2",
    "AWS Lambda",
    "Amazon EventBridge",
    "AWS CloudTrail",
    "AWS X-Ray",
  ],

  examTips: [
    "EC2 memory utilization requires the CloudWatch Agent — not reported by default",
    "Alarms trigger actions (SNS, scaling, EC2 stop/terminate) when thresholds are breached",
    "Log Groups are per-application; Log Streams are per-resource instance",
    "Lambda automatically writes to CloudWatch Logs — no configuration needed",
    "Detailed monitoring enables 1-minute metrics (vs. 5-minute for basic monitoring)",
    "Metric Filters can alarm on log patterns — useful for error rate monitoring",
    "CloudWatch Events is now Amazon EventBridge — know both names for the exam",
    "Custom metrics can be published from any application via the CloudWatch API",
  ],
};
