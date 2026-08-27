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
      quiz: [
        {
          question:
            "An EC2 instance is running with basic monitoring enabled. At what interval does CloudWatch receive CPU utilization metrics?",
          options: [
            "Every 10 seconds",
            "Every 1 minute",
            "Every 5 minutes",
            "Every 15 minutes",
          ],
          correctIndex: 2,
          explanation:
            "EC2 basic monitoring (the default) publishes metrics every 5 minutes. Detailed monitoring must be explicitly enabled to receive 1-minute granularity, which is required for faster-responding Auto Scaling policies.",
        },
        {
          question:
            "A team wants to track the error rate of their application as a percentage of total requests. Which CloudWatch feature enables this without storing a separate derived metric?",
          options: [
            "Custom metrics published via PutMetricData",
            "Log metric filters",
            "Metric math expressions combining errors and total requests",
            "CloudWatch Contributor Insights",
          ],
          correctIndex: 2,
          explanation:
            "Metric math expressions combine multiple existing metrics into computed values (e.g., errors/total_requests * 100) without storing the result as a separate metric. This is efficient for ratio-based monitoring.",
        },
        {
          question:
            "How are CloudWatch metrics scoped to a specific resource within a namespace?",
          options: [
            "By the AWS account ID attached to each metric",
            "By dimensions — key-value pairs like InstanceId or DBInstanceIdentifier",
            "By metric name alone — each resource uses a unique metric name",
            "By the AWS region where the resource is deployed",
          ],
          correctIndex: 1,
          explanation:
            "Dimensions are key-value pairs (e.g., InstanceId=i-12345) that scope metrics to a specific resource within a namespace. A namespace like AWS/EC2 can contain metrics for thousands of instances, differentiated by dimensions.",
        },
      ],
    },
    {
      heading: "CloudWatch Alarms and Automated Responses",
      body: `CloudWatch Alarms continuously evaluate metric data against defined thresholds and transition between three states: OK (metric is within threshold), ALARM (metric breaches threshold), and INSUFFICIENT_DATA (not enough data to evaluate). When an alarm enters the ALARM state, it can trigger one or more actions: sending a notification to an SNS topic (which in turn notifies operators via email/SMS or triggers Lambda), executing an EC2 Auto Scaling policy (scaling out or in based on load), stopping or terminating an EC2 instance, or creating a Systems Manager OpsItem. Composite alarms combine multiple alarms using AND/OR logic, reducing alarm noise by alerting only when multiple conditions are simultaneously true — for example, triggering only when both CPU is high AND disk I/O is high, avoiding false positives from transient CPU spikes. Alarm math and anomaly detection use machine learning to establish a dynamic baseline from historical metric patterns, triggering alarms when the metric deviates beyond a configurable band rather than a fixed threshold.`,
      quiz: [
        {
          question:
            "A CloudWatch alarm has not received any metric data for 10 minutes. What state is the alarm in?",
          options: [
            "OK — no data means no breach",
            "ALARM — the absence of data is treated as a threshold breach",
            "INSUFFICIENT_DATA — not enough data to evaluate the threshold",
            "DISABLED — alarms automatically disable when data stops flowing",
          ],
          correctIndex: 2,
          explanation:
            "CloudWatch alarms enter the INSUFFICIENT_DATA state when there is not enough metric data to evaluate the threshold. This is distinct from OK (metric is within bounds) and ALARM (metric breaches the threshold).",
        },
        {
          question:
            "A noisy alarm fires frequently due to brief CPU spikes that are not actually problematic. Which CloudWatch feature reduces false positives by alerting only when CPU is high AND disk I/O is simultaneously high?",
          options: [
            "High-resolution metrics with 1-second granularity",
            "Anomaly detection with a dynamic baseline band",
            "A composite alarm combining the CPU alarm and disk I/O alarm with AND logic",
            "A metric math expression averaging CPU and disk I/O",
          ],
          correctIndex: 2,
          explanation:
            "Composite alarms combine multiple child alarms using AND/OR logic, alerting only when all specified conditions are simultaneously true. This reduces noise from individual transient spikes that don't indicate a real problem.",
        },
        {
          question:
            "When a CloudWatch alarm enters the ALARM state, which of the following actions can it trigger? (Choose the best answer)",
          options: [
            "Only SNS notifications",
            "SNS notifications, EC2 Auto Scaling policies, stopping/terminating EC2 instances, or creating Systems Manager OpsItems",
            "Only Auto Scaling policy execution",
            "SNS notifications and Lambda invocations directly",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch alarms can trigger: SNS topic notifications, EC2 Auto Scaling policy execution (scale-out/in), EC2 instance actions (stop, terminate, reboot), and Systems Manager OpsItem creation. Lambda is typically invoked indirectly via SNS.",
        },
      ],
    },
    {
      heading: "CloudWatch Logs and Log Insights",
      body: `CloudWatch Logs collects, stores, and analyzes log data from EC2 instances (via the CloudWatch Logs Agent or the newer unified CloudWatch Agent), Lambda functions, API Gateway, VPC Flow Logs, CloudTrail, and custom applications. Log data is organized into Log Groups (one per application or service) containing Log Streams (one per source instance or execution). Log retention is configurable from 1 day to 10 years; logs are retained indefinitely by default at increasing cost. CloudWatch Logs Insights provides an interactive query interface with a purpose-built query language for filtering, aggregating, and visualizing log data — you can calculate statistics, identify top contributors, and correlate log events across multiple log groups in a single query. Log metric filters extract numeric values from log events and publish them as CloudWatch metrics — for example, counting the occurrences of the word \`ERROR\` in application logs and creating an alarm when the count exceeds a threshold.`,
      quiz: [
        {
          question:
            "A team needs to query application logs from the past 7 days to find the top 10 error messages across multiple microservices. Which CloudWatch feature enables this?",
          options: [
            "CloudWatch Dashboards with log widget panels",
            "CloudWatch Logs Insights, which queries across multiple log groups with a purpose-built query language",
            "Log metric filters that count ERROR occurrences",
            "CloudWatch Contributor Insights for log-based anomaly detection",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Logs Insights provides an interactive query interface to filter, aggregate, and visualize log data across multiple log groups. It can calculate statistics, find top contributors, and correlate events in a single query.",
        },
        {
          question:
            "A team wants to trigger a CloudWatch alarm whenever the word ERROR appears more than 50 times in 5 minutes in application logs. How is this configured?",
          options: [
            "Create a CloudWatch Logs subscription filter that delivers logs to an alarm-checking Lambda function",
            "Create a log metric filter that counts ERROR occurrences and publishes the count as a CloudWatch metric, then create an alarm on that metric",
            "Enable CloudWatch Logs Insights and create an alert on the query results",
            "Use AWS X-Ray to detect error patterns and trigger alarms via EventBridge",
          ],
          correctIndex: 1,
          explanation:
            "Log metric filters extract values from log events and publish them as CloudWatch metrics. Creating a filter that counts ERROR occurrences produces a metric that a standard CloudWatch alarm can evaluate against a threshold.",
        },
      ],
    },
    {
      heading: "CloudWatch Agent and Custom Metrics",
      body: `The CloudWatch Unified Agent collects both system-level metrics and log files from EC2 instances and on-premises servers, publishing data that EC2 basic monitoring does not capture. Critically, memory utilization and disk space utilization are not published by EC2 basic monitoring — they must be collected by the CloudWatch Agent, which reads them from the OS and publishes them as custom metrics. The agent is configured via a JSON configuration file (or via SSM Parameter Store for centralized management) that specifies which metrics to collect at what intervals and which log files to tail. The \`collectd\` plugin allows arbitrary application metrics to be forwarded through the agent. Custom metrics can be published directly to CloudWatch via the \`PutMetricData\` API call from any application, enabling business metrics (orders per minute, active sessions) to be monitored alongside infrastructure metrics in the same dashboards and alarms.`,
      quiz: [
        {
          question:
            "Which EC2 metrics are NOT available in CloudWatch by default without installing the CloudWatch Agent?",
          options: [
            "CPU utilization and network bytes in/out",
            "Memory utilization and disk space utilization",
            "Status check failures",
            "EBS read and write IOPS",
          ],
          correctIndex: 1,
          explanation:
            "Memory utilization and disk space utilization are OS-level metrics that EC2 basic monitoring does not expose. The CloudWatch Unified Agent must be installed and configured to collect these from the operating system and publish them as custom metrics.",
        },
        {
          question:
            "A company wants to monitor orders per minute as a CloudWatch metric from their application. How is this accomplished?",
          options: [
            "Enable detailed monitoring on the EC2 instances running the application",
            "Configure a log metric filter on the application log group",
            "Call the PutMetricData API from the application to publish a custom metric",
            "Use X-Ray to trace order processing and generate CloudWatch metrics automatically",
          ],
          correctIndex: 2,
          explanation:
            "Custom metrics are published to CloudWatch using the PutMetricData API call from any application. This enables business-level metrics (orders/min, sessions) to be monitored alongside AWS infrastructure metrics.",
        },
      ],
    },
    {
      heading: "CloudWatch Dashboards and EventBridge Integration",
      body: `CloudWatch Dashboards provide customizable, shareable views of metrics and alarms across services and regions in a single pane of glass. Dashboards are JSON documents that define widgets (line graphs, bar charts, numbers, text) and can display metrics from multiple AWS accounts and regions in cross-account, cross-region setups when CloudWatch Observability Access Manager sharing is configured. Amazon EventBridge (formerly CloudWatch Events) receives near-real-time events from AWS services and custom applications and routes them to targets using event pattern rules. Events include AWS API calls (logged via CloudTrail), scheduled expressions (cron syntax for periodic Lambda invocations), and service state changes (EC2 instance state changes, RDS snapshot completion, CodePipeline failures). EventBridge is the recommended integration for event-driven automation, replacing CloudWatch Events with additional features including a schema registry, cross-account event buses, and third-party SaaS integrations.`,
      quiz: [
        {
          question:
            "A team needs to automatically invoke a Lambda function every weekday at 8 AM UTC. Which AWS service handles this scheduled trigger?",
          options: [
            "CloudWatch Alarms with a scheduled action",
            "Amazon EventBridge with a scheduled expression (cron rule)",
            "AWS Step Functions with a wait state",
            "CloudWatch Logs with a subscription filter",
          ],
          correctIndex: 1,
          explanation:
            "Amazon EventBridge supports scheduled expressions using cron or rate syntax, making it the standard mechanism for periodic Lambda invocations. This is the successor to CloudWatch Events scheduled rules.",
        },
        {
          question:
            "Which statement best describes the relationship between Amazon EventBridge and CloudWatch Events?",
          options: [
            "They are completely separate services with different pricing models",
            "EventBridge replaces CloudWatch Events with additional features: schema registry, cross-account buses, and SaaS integrations",
            "CloudWatch Events is the newer service, offering advanced filtering that EventBridge lacks",
            "EventBridge is only for third-party SaaS integrations; CloudWatch Events handles AWS service events",
          ],
          correctIndex: 1,
          explanation:
            "Amazon EventBridge is the evolution of CloudWatch Events, offering all the same functionality plus additional features like a schema registry, cross-account event buses, and third-party SaaS source integrations. All new event-driven automation should use EventBridge.",
        },
      ],
    },
    {
      heading: "CloudWatch Container Insights and X-Ray Integration",
      body: `CloudWatch Container Insights collects, aggregates, and summarizes metrics and logs from containerized applications on Amazon ECS, EKS, and Kubernetes on EC2. It provides CPU, memory, disk, and network usage at the cluster, service, task, and container level, along with diagnostic information like container restart counts. Lambda Insights provides enhanced operational metrics for Lambda functions — initialization duration, memory usage, CPU time, and cold start rate — beyond the standard Lambda CloudWatch metrics. AWS X-Ray integrates with CloudWatch to provide distributed tracing, allowing you to follow a single request as it flows through multiple Lambda functions, API Gateways, DynamoDB calls, and downstream HTTP services. CloudWatch ServiceLens combines X-Ray traces with CloudWatch metrics and logs into a service map that shows dependencies between components and highlights where latency and errors originate — essential for troubleshooting microservice architectures.`,
      quiz: [
        {
          question:
            "A team running microservices on ECS wants to monitor CPU and memory usage at the individual container level. Which CloudWatch feature provides this?",
          options: [
            "CloudWatch standard EC2 metrics with the CloudWatch Agent",
            "CloudWatch Container Insights, which provides metrics at the cluster, service, task, and container level",
            "AWS X-Ray traces filtered by container ID",
            "CloudWatch Logs Insights querying ECS task logs",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch Container Insights collects and aggregates metrics from ECS, EKS, and Kubernetes at the cluster, service, task, and container level, including CPU, memory, disk, network, and container restart counts.",
        },
        {
          question:
            "CloudWatch ServiceLens combines which data sources to create a service dependency map for microservice troubleshooting?",
          options: [
            "CloudWatch metrics and VPC Flow Logs",
            "AWS X-Ray traces combined with CloudWatch metrics and logs",
            "CloudTrail API logs and CloudWatch Logs Insights",
            "Container Insights metrics and ALB access logs",
          ],
          correctIndex: 1,
          explanation:
            "CloudWatch ServiceLens integrates AWS X-Ray distributed traces with CloudWatch metrics and logs to create a service map, showing dependencies between components and identifying where latency and errors originate in microservice architectures.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "An EC2 instance's memory utilization is not appearing in CloudWatch. What is the most likely cause and fix?",
      options: [
        "Memory metrics require Detailed Monitoring — enable it in the EC2 console",
        "Memory utilization is not published by EC2 by default — install and configure the CloudWatch Unified Agent to collect it",
        "Memory metrics are in the AWS/MemoryDB namespace, not AWS/EC2",
        "The EC2 instance IAM role needs the cloudwatch:GetMetricData permission",
      ],
      correctIndex: 1,
      explanation:
        "Memory utilization is an OS-level metric not captured by EC2 basic or detailed monitoring. The CloudWatch Unified Agent must be installed and configured to read memory from the OS and publish it as a custom metric.",
    },
    {
      question:
        "A CloudWatch alarm should fire only when both CPU utilization exceeds 80% AND available disk space drops below 10%. How is this implemented?",
      options: [
        "Create a single alarm on a metric math expression combining CPU and disk",
        "Create separate alarms for each metric and trigger an SNS topic from both",
        "Create a composite alarm that combines the CPU alarm and the disk alarm with AND logic",
        "Use CloudWatch Anomaly Detection on a combined metric",
      ],
      correctIndex: 2,
      explanation:
        "Composite alarms combine multiple child alarms using AND/OR logic. Using AND means the composite alarm only enters ALARM state when both child alarms are simultaneously in ALARM, reducing noise from individual transient conditions.",
    },
    {
      question:
        "Which CloudWatch feature is the correct tool for interactively querying application logs to find the top 10 slowest API calls in the last hour?",
      options: [
        "Log metric filters",
        "CloudWatch Container Insights",
        "CloudWatch Logs Insights",
        "CloudWatch Dashboards with a log widget",
      ],
      correctIndex: 2,
      explanation:
        "CloudWatch Logs Insights provides a purpose-built query language for filtering, aggregating, and analyzing log data. It can calculate statistics, find top contributors, and correlate events across multiple log groups interactively.",
    },
    {
      question:
        "A team needs to invoke a Lambda function whenever an EC2 instance changes state (e.g., from running to stopped). Which service handles this automatically?",
      options: [
        "CloudWatch Alarms monitoring EC2 status checks",
        "Amazon EventBridge with an EC2 state change event pattern rule",
        "CloudWatch Log metric filters on EC2 system logs",
        "AWS Config rules triggering Lambda on configuration changes",
      ],
      correctIndex: 1,
      explanation:
        "Amazon EventBridge receives near-real-time events from AWS services including EC2 state change notifications. An event pattern rule matching EC2 instance state changes can automatically invoke a Lambda function.",
    },
    {
      question:
        "What is the minimum granularity available for CloudWatch high-resolution custom metrics?",
      options: ["5 minutes", "1 minute", "10 seconds", "1 second"],
      correctIndex: 3,
      explanation:
        "High-resolution metrics support down to 1-second granularity. Standard metrics have 1-minute minimum granularity. High-resolution metrics are valuable for detecting short-lived spikes that 1-minute averages would smooth over.",
    },
    {
      question:
        "A distributed application spans Lambda, API Gateway, and DynamoDB. A team wants to visualize the end-to-end request path and identify where latency is introduced. Which tooling provides this?",
      options: [
        "CloudWatch Logs Insights querying logs from all three services",
        "AWS X-Ray with CloudWatch ServiceLens providing a service dependency map",
        "VPC Flow Logs analyzed with Amazon Athena",
        "CloudWatch Container Insights for Lambda and ECS workloads",
      ],
      correctIndex: 1,
      explanation:
        "AWS X-Ray traces requests across distributed services, and CloudWatch ServiceLens combines these traces with CloudWatch metrics and logs into a service map that visually shows dependencies and latency sources.",
    },
    {
      question:
        "A company wants to monitor how many orders per minute their e-commerce application processes as a CloudWatch metric. How should this metric be collected?",
      options: [
        "Enable Detailed Monitoring on the EC2 instances running the application",
        "Create a log metric filter on the application log group counting order completion log lines",
        "Use the CloudWatch Agent collectd plugin to forward JVM metrics",
        "Call PutMetricData from the application code after each order is processed",
      ],
      correctIndex: 3,
      explanation:
        "Business metrics like orders per minute are published using the PutMetricData API directly from application code. This places custom metrics in a custom namespace alongside AWS service metrics for unified monitoring.",
    },
    {
      question:
        "Which CloudWatch alarm state indicates that the alarm has not received sufficient metric data to make a determination?",
      options: ["OK", "ALARM", "INSUFFICIENT_DATA", "PENDING"],
      correctIndex: 2,
      explanation:
        "The INSUFFICIENT_DATA state means CloudWatch does not have enough data points to evaluate the alarm's threshold — this occurs during initial setup, metric gaps, or when the metric has not been published. It is distinct from OK (within bounds) and ALARM (threshold breached).",
    },
  ],
};
