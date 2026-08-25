import { ServiceGuide } from "../../../types/guide";

export const autoscalingGuide: ServiceGuide = {
  id: "saa-autoscaling",
  service: "AWS Auto Scaling",
  domain: "deployment",
  tagline:
    "Automatically adjust compute capacity to match demand and maintain performance",
  intro:
    "AWS Auto Scaling monitors your applications and automatically adjusts capacity — EC2 instances, ECS tasks, DynamoDB throughput, Aurora replicas, and more — to maintain steady performance at the lowest possible cost as demand fluctuates.",

  sections: [
    {
      heading: "Auto Scaling Groups: Core Concepts",
      body: `An Auto Scaling Group (ASG) manages a fleet of EC2 instances, maintaining the desired count and replacing unhealthy instances automatically. Every ASG is configured with three capacity values: minimum (the floor that prevents the group from scaling below a safe baseline), maximum (the ceiling that prevents runaway scaling costs), and desired (the target count the ASG actively tries to maintain). When an instance fails its EC2 status check or ELB health check, the ASG terminates it and launches a replacement in the same or another Availability Zone, providing self-healing behavior without manual intervention. ASGs are defined by a Launch Template that specifies the AMI, instance type, key pair, security groups, and IAM instance profile for every instance launched by the group. The ASG can span multiple AZs and attempts to keep the number of instances balanced across AZs using the AZ Rebalancing feature.`,
    },
    {
      heading: "Scaling Policies",
      body: `Auto Scaling supports several policy types to match different scaling strategies. Target Tracking Scaling is the simplest and most recommended: you specify a metric and a target value (e.g., keep average CPU utilization at 50%), and Auto Scaling continuously calculates and applies the correct capacity to achieve that target, scaling out when the metric exceeds the target and scaling in when it falls below. Step Scaling triggers specific capacity adjustments based on CloudWatch alarm thresholds in steps — for example, add 2 instances when CPU is between 60–80% and add 4 when it exceeds 80%. Simple Scaling is the legacy predecessor to Step Scaling, adding or removing a fixed amount after an alarm fires, with a mandatory cooldown before the next action. Scheduled Scaling pre-provisions capacity at known times — for example, scaling up every weekday morning before business hours and scaling down at night — eliminating the lag time of reactive scaling for predictable load patterns.`,
    },
    {
      heading: "Predictive Scaling and Warm Pools",
      body: `Predictive Scaling uses machine learning to analyze historical CloudWatch metrics and forecast future demand, pre-scaling the ASG before load arrives rather than reacting to it. This is particularly valuable for applications with long instance initialization times where reactive scaling leaves a latency gap between when load arrives and when new instances are healthy and serving traffic. Warm Pools address initialization latency from a different angle: a pool of pre-initialized, stopped instances is maintained alongside the ASG. When the ASG needs to scale out, it pulls instances from the warm pool (which are already initialized to a running state) rather than launching cold instances from scratch — reducing scale-out time from minutes to seconds for applications with slow bootstrap processes. Warm Pool instances can be kept in a stopped, running, or hibernated state depending on cost and readiness requirements.`,
    },
    {
      heading: "Instance Refresh and Rolling Deployments",
      body: `Instance Refresh automates the process of replacing all instances in an ASG with new instances — typically after updating the Launch Template to a new AMI version or configuration. You specify a minimum healthy percentage (e.g., 90%) that ensures a portion of the fleet remains in service throughout the refresh, preventing full outages during updates. Auto Scaling replaces instances in batches, waiting for new instances to pass health checks before terminating old ones. Checkpoint percentages allow you to pause the refresh at specific fleet completion percentages for manual validation before proceeding. Combined with a golden AMI workflow — building a fully configured AMI from a CI/CD pipeline and updating the Launch Template — Instance Refresh provides a controlled, zero-downtime deployment mechanism for EC2-based applications without needing a separate deployment tool.`,
    },
    {
      heading: "Application Auto Scaling Beyond EC2",
      body: `Application Auto Scaling extends the same scaling policies to non-EC2 resources. ECS service scaling adjusts the number of running task replicas in an ECS service based on CPU, memory, or custom metrics — the standard approach for scaling containerized microservices. DynamoDB Auto Scaling adjusts provisioned RCUs and WCUs based on consumed capacity, keeping utilization near the target percentage without manual adjustments. Aurora Auto Scaling adds and removes Aurora Replicas based on database load metrics like replica lag and CPU utilization. These resources share the same Target Tracking, Step, and Scheduled scaling policy types as EC2 ASGs. For all scaling decisions, the scaling cooldown period prevents thrashing by blocking further scale-in actions for a configurable time after a scaling event, allowing metrics to stabilize before the next decision.`,
    },
    {
      heading: "Lifecycle Hooks and Termination Policies",
      body: `Lifecycle Hooks pause instance launches or terminations at specific points in the ASG lifecycle, allowing custom actions to complete before the process continues. A launch hook pauses a new instance in the \`Pending:Wait\` state — useful for running configuration scripts, registering the instance with external monitoring, or loading data from S3 before the instance enters service. A termination hook pauses a terminating instance in the \`Terminating:Wait\` state — useful for draining connections, archiving logs to S3, or deregistering from service discovery before the instance disappears. Hooks can send notifications to SQS or SNS and allow up to 48 hours for the custom action to complete. Termination policies control which instances the ASG terminates first during scale-in events — policies include OldestInstance, NewestInstance, OldestLaunchTemplate, and the default ClosestToNextInstanceHour (to minimize wasted On-Demand billing time).`,
    },
  ],

  keyFacts: [
    "ASG maintains minimum, desired, and maximum instance counts across specified Availability Zones",
    "ASG replaces failed instances automatically using EC2 or ELB health checks",
    "Target Tracking Scaling is the recommended policy — specify a metric target and let Auto Scaling do the math",
    "Step Scaling adds/removes capacity in steps based on CloudWatch alarm severity",
    "Scheduled Scaling pre-provisions capacity for known load patterns",
    "Predictive Scaling uses ML to forecast demand and scale proactively",
    "Warm Pools hold pre-initialized stopped instances to reduce scale-out latency",
    "Instance Refresh performs rolling AMI replacements with a configurable minimum healthy percentage",
    "Application Auto Scaling covers ECS services, DynamoDB, Aurora replicas, and more",
    "Lifecycle Hooks pause launches and terminations for custom actions (up to 48 hours)",
  ],

  relatedServices: [
    "Amazon EC2",
    "Elastic Load Balancing",
    "Amazon CloudWatch",
    "Amazon ECS",
    "Amazon Aurora",
    "AWS Lambda",
  ],

  examTips: [
    "Target Tracking is simpler and more responsive than Step or Simple Scaling — prefer it for most workloads",
    "Scheduled Scaling eliminates reactive lag for predictable traffic patterns (daily, weekly cycles)",
    "Warm Pools solve slow boot/initialization — instances are pre-warmed and ready in seconds",
    "Instance Refresh = controlled rolling deployment across the entire ASG fleet",
    "Lifecycle Hooks are the answer for questions about running scripts or draining connections during scale events",
    "ASG health checks can use EC2 status checks or ELB health checks — ELB is more thorough for web apps",
    "Cooldown period prevents thrashing — scale-in cooldown is typically longer than scale-out cooldown",
    "AZ Rebalancing maintains even distribution — ASG launches in under-represented AZs first",
  ],
};
