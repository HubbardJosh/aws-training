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
      quiz: [
        {
          question:
            "EC2 basic monitoring reports metrics at what interval by default, and what is required for 1-minute intervals?",
          options: [
            "1-minute intervals by default; 30-second intervals require detailed monitoring",
            "5-minute intervals by default; detailed monitoring enables 1-minute intervals",
            "1-minute intervals by default; high-resolution monitoring enables 1-second intervals",
            "15-minute intervals by default; detailed monitoring enables 5-minute intervals",
          ],
          correctIndex: 1,
          explanation:
            "EC2 basic monitoring (free) reports metrics at 5-minute intervals. Enabling detailed monitoring switches to 1-minute intervals for more granular visibility, though it incurs an additional cost.",
        },
        {
          question:
            "Which of the following metrics does EC2 NOT report to CloudWatch by default without additional configuration?",
          options: [
            "CPUUtilization",
            "NetworkIn",
            "Memory utilization",
            "DiskReadOps",
          ],
          correctIndex: 2,
          explanation:
            "EC2 does not report memory utilization to CloudWatch by default. You must install the CloudWatch Agent on the instance and configure it to collect memory metrics. This is a frequently tested exam topic.",
        },
        {
          question: "What are CloudWatch custom metrics used for?",
          options: [
            "Replacing default AWS service metrics with more accurate measurements",
            "Publishing application-specific data like active user sessions or orders per minute",
            "Creating metrics from CloudTrail audit logs",
            "Monitoring metrics from non-AWS cloud providers",
          ],
          correctIndex: 1,
          explanation:
            "Custom metrics allow you to publish application-specific data to CloudWatch using the CloudWatch API or agents. Examples include tracking active user sessions, queue processing rates, or business metrics like orders per minute.",
        },
      ],
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
      quiz: [
        {
          question: "What are the three states a CloudWatch Alarm can be in?",
          options: [
            "Active, Inactive, Pending",
            "OK, ALARM, INSUFFICIENT_DATA",
            "Healthy, Unhealthy, Unknown",
            "Normal, Warning, Critical",
          ],
          correctIndex: 1,
          explanation:
            "A CloudWatch Alarm transitions between three states: OK (metric is within threshold), ALARM (metric has breached the threshold), and INSUFFICIENT_DATA (not enough data points to determine the state).",
        },
        {
          question:
            "When a CloudWatch Alarm enters the ALARM state because CPU utilization exceeded 90%, which of the following actions can it trigger?",
          options: [
            "Only send an email notification",
            "SNS notification, EC2 actions, or Auto Scaling actions",
            "Automatically terminate the EC2 instance",
            "Create a CloudFormation Change Set",
          ],
          correctIndex: 1,
          explanation:
            "When an alarm enters the ALARM state it can trigger: SNS notifications (email, SMS, other AWS services), EC2 actions (stop, terminate, reboot, recover), Auto Scaling actions (add or remove instances), or Systems Manager Automation runbooks.",
        },
        {
          question: "What is the purpose of a CloudWatch Composite Alarm?",
          options: [
            "To monitor multiple metrics simultaneously by averaging their values",
            "To combine multiple alarms with boolean logic (AND/OR) for sophisticated alerting conditions",
            "To create alarms that span multiple AWS accounts",
            "To automatically resolve alarms after a configurable timeout period",
          ],
          correctIndex: 1,
          explanation:
            "Composite Alarms combine multiple alarms using boolean logic (AND/OR). This allows sophisticated alerting like 'alert only if CPU is high AND network throughput is low,' reducing alert noise from individual metric fluctuations.",
        },
      ],
    },
    {
      heading: "CloudWatch Logs",
      body: `**CloudWatch Logs** is a service for collecting, storing, monitoring, and analyzing log data from your applications and infrastructure. It centralizes logs from all your AWS resources into one place.

Logs are organized into **Log Groups** (typically one per application or service) and **Log Streams** (typically one per resource instance, like one stream per EC2 instance). Log data is retained for a configurable period from 1 day to 10 years.

The **CloudWatch Logs Agent** and **CloudWatch Unified Agent** run on EC2 instances to ship logs (application logs, system logs) to CloudWatch. Lambda automatically writes to CloudWatch Logs without any configuration.

**Log Insights** provides an interactive query language to search and analyze log data. You can write queries to filter logs by error patterns, aggregate counts by time, or correlate events across log groups. This is powerful for troubleshooting and investigation.

**Metric Filters** extract metric data from log events. For example, you can define a filter that counts log lines containing "ERROR" and publish that count as a metric — allowing you to alarm when your error rate increases, even though the underlying data is in logs rather than native metrics.`,
      quiz: [
        {
          question:
            "In CloudWatch Logs, what is the difference between a Log Group and a Log Stream?",
          options: [
            "Log Groups store raw logs; Log Streams store parsed and indexed logs",
            "Log Groups are typically per application or service; Log Streams are typically per resource instance",
            "Log Groups are for AWS service logs; Log Streams are for application logs",
            "Log Groups can span multiple regions; Log Streams are region-specific",
          ],
          correctIndex: 1,
          explanation:
            "Log Groups are containers for related logs, typically one per application or service. Log Streams are sequences of log events from a specific source, typically one per resource instance (e.g., one stream per EC2 instance).",
        },
        {
          question:
            "Lambda functions automatically send their logs to which service without any additional configuration?",
          options: [
            "Amazon S3",
            "Amazon Kinesis Data Firehose",
            "Amazon CloudWatch Logs",
            "AWS CloudTrail",
          ],
          correctIndex: 2,
          explanation:
            "Lambda functions automatically write their logs (stdout/stderr and invocation details) to Amazon CloudWatch Logs without any configuration. Each Lambda function gets its own Log Group.",
        },
        {
          question: "What do CloudWatch Metric Filters enable you to do?",
          options: [
            "Filter CloudWatch metrics so only the most important ones appear in dashboards",
            "Extract metric data from log events, such as counting ERROR log lines as a metric",
            "Automatically create alarms on all metrics that exceed baseline thresholds",
            "Convert CloudWatch metrics into log events for long-term storage in S3",
          ],
          correctIndex: 1,
          explanation:
            "Metric Filters extract metric data from CloudWatch Logs events. For example, a filter that counts log lines containing 'ERROR' publishes that count as a metric, allowing you to alarm when error rates increase even though the data originates in logs.",
        },
      ],
    },
    {
      heading: "CloudWatch Dashboards and Events",
      body: `**CloudWatch Dashboards** are customizable views that display multiple metrics and alarms on a single screen. You create dashboards with widgets (graphs, numbers, text) from any metrics across any AWS service. Dashboards are cross-region — you can display metrics from multiple regions on one dashboard.

Dashboards are shared across an AWS account and can be made public (accessible without AWS credentials) for stakeholder visibility or status pages.

**CloudWatch Events** (now **Amazon EventBridge**) detects changes in your AWS environment and routes events to targets. For example, you can create a rule that runs a Lambda function every time an EC2 instance changes state, or that triggers an SNS notification when a CloudFormation stack deployment fails.

Scheduled rules in EventBridge (formerly CloudWatch Events) work like a serverless cron job — you define a schedule (e.g., every day at 8 AM UTC) and EventBridge invokes a target (Lambda, SNS, SQS, Step Functions) on that schedule without any server to manage.`,
      quiz: [
        {
          question:
            "CloudWatch Dashboards support which of the following capabilities?",
          options: [
            "Displaying metrics from only a single AWS service per dashboard",
            "Displaying metrics from multiple services and multiple regions on a single dashboard",
            "Automatically resolving alarms when metrics return to normal",
            "Storing metric data for long-term analysis in Amazon S3",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Dashboards are cross-region and can display metrics and alarms from multiple AWS services across multiple regions on a single screen, providing a unified operational view.",
        },
        {
          question: "Amazon EventBridge was formerly known as which service?",
          options: [
            "Amazon CloudWatch Alarms",
            "AWS CloudTrail",
            "Amazon CloudWatch Events",
            "AWS SNS",
          ],
          correctIndex: 2,
          explanation:
            "Amazon EventBridge was formerly known as Amazon CloudWatch Events. Both names may appear on the exam. EventBridge detects changes in AWS environments and routes events to target services like Lambda, SNS, and SQS.",
        },
        {
          question:
            "Which EventBridge feature works like a serverless cron job to invoke targets on a defined schedule?",
          options: [
            "Event buses",
            "Scheduled rules",
            "Event patterns",
            "Dead letter queues",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge scheduled rules allow you to define a schedule (e.g., every day at 8 AM UTC) and automatically invoke a target (Lambda, SNS, SQS, Step Functions) on that schedule without managing any servers.",
        },
      ],
    },
    {
      heading: "CloudWatch Agent and Container Insights",
      body: `The **CloudWatch Agent** is a unified agent you install on EC2 instances or on-premises servers to collect system-level metrics that AWS does not collect by default. These include memory utilization, disk space used, swap usage, and network connection counts.

This distinction is important for the exam: **EC2 does not report memory usage to CloudWatch by default.** You must install the CloudWatch Agent on the instance and configure it to collect memory metrics. This is a common exam question.

**Container Insights** collects, aggregates, and summarizes metrics and logs from containerized applications running on Amazon ECS and Amazon EKS. It provides pre-built dashboards for cluster, service, and task-level performance data.

**Application Insights** automatically configures monitoring for popular technologies like Java, .NET, IIS, and databases, suggesting relevant metrics and alarms based on the detected application stack.

For the Cloud Practitioner exam, the key CloudWatch concepts are: metrics for performance data, alarms for automated responses, and logs for log aggregation and search.`,
      quiz: [
        {
          question:
            "Why must you install the CloudWatch Agent on EC2 instances to monitor memory utilization?",
          options: [
            "The CloudWatch Agent is required to monitor any EC2 metrics",
            "Memory utilization is not reported to CloudWatch by EC2 by default",
            "The CloudWatch Agent enables more frequent metric reporting for all metrics",
            "Memory metrics require encryption that only the agent provides",
          ],
          correctIndex: 1,
          explanation:
            "EC2 does not report memory utilization to CloudWatch by default because memory data requires an agent running inside the OS. You must install the CloudWatch Agent and configure it to collect memory metrics. This is a frequently tested exam fact.",
        },
        {
          question: "What does CloudWatch Container Insights provide?",
          options: [
            "Security scanning of container images stored in Amazon ECR",
            "Metrics and logs collection for containerized applications on ECS and EKS",
            "Automated right-sizing recommendations for ECS task definitions",
            "Cost reporting for individual containers running on Fargate",
          ],
          correctIndex: 1,
          explanation:
            "Container Insights collects, aggregates, and summarizes metrics and logs from containerized applications on Amazon ECS and EKS. It provides pre-built dashboards for cluster, service, and task-level performance data.",
        },
        {
          question:
            "Which of the following metrics can the CloudWatch Agent collect from EC2 instances that are NOT available by default?",
          options: [
            "CPU utilization and network traffic",
            "Memory utilization, disk space used, and swap usage",
            "Instance state changes and termination events",
            "EBS volume throughput and IOPS",
          ],
          correctIndex: 1,
          explanation:
            "The CloudWatch Agent collects system-level metrics not available by default, including memory utilization, disk space used, swap usage, and network connection counts. CPU utilization and network traffic are available in basic EC2 monitoring.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "An operations team wants to receive an email alert when an EC2 instance's CPU utilization exceeds 80% for 5 consecutive minutes. Which services should they use?",
      options: [
        "AWS CloudTrail and Amazon SES",
        "Amazon CloudWatch Alarm and Amazon SNS",
        "Amazon CloudWatch Dashboard and Amazon SQS",
        "AWS Config and Amazon EventBridge",
      ],
      correctIndex: 1,
      explanation:
        "A CloudWatch Alarm monitors CPU utilization and transitions to ALARM state when the threshold is breached. It then triggers an SNS notification, which can send an email to the operations team.",
    },
    {
      question:
        "A developer notices that memory utilization is not appearing in CloudWatch metrics for their EC2 instances. What is the most likely cause?",
      options: [
        "Memory metrics require the Enterprise support plan to access",
        "EC2 does not report memory utilization by default; the CloudWatch Agent must be installed",
        "Memory metrics are only available in the us-east-1 region",
        "Detailed monitoring must be enabled to see memory utilization",
      ],
      correctIndex: 1,
      explanation:
        "EC2 does not report memory utilization to CloudWatch by default. The CloudWatch Agent must be installed on the instance and configured to collect memory metrics. Enabling detailed monitoring only increases CPU and other default metric frequency, not memory.",
    },
    {
      question:
        "Which CloudWatch feature allows you to search and analyze log data using an interactive query language?",
      options: [
        "Metric Filters",
        "CloudWatch Dashboards",
        "CloudWatch Log Insights",
        "CloudWatch Contributor Insights",
      ],
      correctIndex: 2,
      explanation:
        "CloudWatch Log Insights provides an interactive query language to search and analyze log data. You can filter logs by error patterns, aggregate counts by time, and correlate events across log groups.",
    },
    {
      question:
        "What is the maximum retention period for logs stored in Amazon CloudWatch Logs?",
      options: [
        "30 days",
        "1 year",
        "10 years",
        "Indefinitely (never expires)",
      ],
      correctIndex: 2,
      explanation:
        "CloudWatch Logs supports configurable retention periods from 1 day to 10 years. You set the retention policy on each Log Group. Without a retention policy, logs are kept indefinitely but you pay for ongoing storage.",
    },
    {
      question:
        "Amazon EventBridge (formerly CloudWatch Events) can be used to invoke a Lambda function on a recurring schedule. This is analogous to which traditional computing concept?",
      options: [
        "A message queue consumer",
        "A cron job",
        "A web server process",
        "A background daemon",
      ],
      correctIndex: 1,
      explanation:
        "EventBridge scheduled rules work like a serverless cron job. You define a schedule (e.g., every day at 8 AM UTC) and EventBridge automatically invokes a target like Lambda on that schedule without any server to manage.",
    },
    {
      question:
        "A team wants to create a CloudWatch alarm that only fires when BOTH CPU utilization is high AND available memory is low simultaneously. Which feature enables this?",
      options: [
        "Metric math expressions",
        "Composite Alarms",
        "Multi-dimension alarms",
        "Anomaly detection alarms",
      ],
      correctIndex: 1,
      explanation:
        "Composite Alarms combine multiple alarms using boolean logic (AND/OR). This allows sophisticated conditions like 'alert only if CPU is high AND memory is low,' reducing false positives from individual metric fluctuations.",
    },
    {
      question:
        "What is the difference between EC2 basic monitoring and detailed monitoring in CloudWatch?",
      options: [
        "Basic monitoring is free with 5-minute intervals; detailed monitoring costs extra and provides 1-minute intervals",
        "Basic monitoring provides 1-minute intervals; detailed monitoring provides 1-second intervals",
        "Basic monitoring only tracks CPU; detailed monitoring tracks all available metrics",
        "Basic monitoring is automatic; detailed monitoring requires the CloudWatch Agent",
      ],
      correctIndex: 0,
      explanation:
        "EC2 basic monitoring is free and reports metrics at 5-minute intervals. Detailed monitoring costs extra and switches to 1-minute intervals for more granular visibility, which is useful for Auto Scaling and troubleshooting.",
    },
    {
      question:
        "Which CloudWatch feature extracts numeric data from log events so you can set alarms on patterns found in log files?",
      options: [
        "Log Insights queries",
        "Metric Filters",
        "Container Insights",
        "Log subscriptions",
      ],
      correctIndex: 1,
      explanation:
        "Metric Filters scan log events for specified patterns and increment a CloudWatch metric when a match is found. For example, a filter counting log lines containing 'ERROR' creates a metric you can alarm on, bridging logs and metrics.",
    },
  ],
};
