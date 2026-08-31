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
      body: `An Auto Scaling Group (ASG) manages a fleet of EC2 instances, maintaining the desired count and replacing unhealthy instances automatically. Every ASG is configured with three capacity values: minimum (the floor that prevents the group from scaling below a safe baseline), maximum (the ceiling that prevents runaway scaling costs), and desired (the target count the ASG actively tries to maintain). When an instance fails its EC2 status check or ELB health check, the ASG terminates it and launches a replacement in the same or another Availability Zone, providing self-healing behavior without manual intervention. EC2 status checks verify that the underlying hypervisor and operating system are running — they detect hardware failures and OS-level problems, but they cannot tell whether the application itself is healthy. ELB health checks are more thorough for web applications: they send HTTP or HTTPS requests to the application and verify that it returns the expected status code, detecting application-level failures such as a crashed web server, a deadlocked thread pool, or a misconfigured route that EC2 status checks would completely miss. For web applications behind a load balancer, enabling ELB health checks on the ASG means unhealthy application processes are replaced even when the underlying EC2 instance appears healthy at the OS level. ASGs are defined by a Launch Template that specifies the AMI, instance type, key pair, security groups, and IAM instance profile for every instance launched by the group. The ASG can span multiple AZs and attempts to keep the number of instances balanced across AZs using the AZ Rebalancing feature.`,
      quiz: [
        {
          question:
            "An ASG currently has min=2, max=10, desired=4. A health check fails on one instance. What does the ASG do?",
          options: [
            "Reduces the desired count to 3 to save cost",
            "Terminates the unhealthy instance and launches a replacement to maintain desired=4",
            "Sends an SNS alert and waits for manual intervention",
            "Marks the instance as degraded but keeps it running until the next scheduled maintenance window",
          ],
          correctIndex: 1,
          explanation:
            "ASGs provide self-healing by automatically terminating instances that fail EC2 status checks or ELB health checks and launching replacements to maintain the desired capacity. No manual intervention is needed.",
        },
        {
          question:
            "What does the AZ Rebalancing feature do when an ASG spans multiple Availability Zones?",
          options: [
            "Routes traffic equally to each AZ using Route 53",
            "Terminates all instances in over-represented AZs and relaunches them across all AZs",
            "Launches new instances preferentially in under-represented AZs to maintain even distribution",
            "Automatically increases the maximum capacity when an AZ becomes unavailable",
          ],
          correctIndex: 2,
          explanation:
            "AZ Rebalancing keeps instance counts balanced across AZs by preferring to launch in under-represented AZs. It may terminate an instance in an over-represented AZ after launching a replacement in an under-represented one, but it does not terminate all instances at once.",
        },
        {
          question:
            "Which ASG capacity value does the group actively try to maintain at all times?",
          options: [
            "Minimum capacity",
            "Maximum capacity",
            "Desired capacity",
            "Burst capacity",
          ],
          correctIndex: 2,
          explanation:
            "The desired capacity is the target count the ASG continuously tries to achieve by launching or terminating instances. Minimum is a floor and maximum is a ceiling, but desired is the active target.",
        },
      ],
    },
    {
      heading: "Scaling Policies",
      body: `Auto Scaling supports several policy types to match different scaling strategies. Target Tracking Scaling is the simplest and most recommended: you specify a metric and a target value (e.g., keep average CPU utilization at 50%), and Auto Scaling continuously calculates and applies the correct capacity to achieve that target, scaling out when the metric exceeds the target and scaling in when it falls below. Step Scaling triggers specific capacity adjustments based on CloudWatch alarm thresholds in steps — for example, add 2 instances when CPU is between 60–80% and add 4 when it exceeds 80%. Simple Scaling is the legacy predecessor to Step Scaling, adding or removing a fixed amount after an alarm fires, with a mandatory cooldown before the next action. Scheduled Scaling pre-provisions capacity at known times — for example, scaling up every weekday morning before business hours and scaling down at night — eliminating the lag time of reactive scaling for predictable load patterns.`,
      quiz: [
        {
          question:
            "Which scaling policy type is recommended as the simplest and most responsive for most workloads?",
          options: [
            "Simple Scaling",
            "Scheduled Scaling",
            "Step Scaling",
            "Target Tracking Scaling",
          ],
          correctIndex: 3,
          explanation:
            "Target Tracking Scaling is the recommended policy. You specify a metric and target value (e.g., 50% CPU), and Auto Scaling continuously adjusts capacity to maintain that target without writing multiple alarm-threshold rules.",
        },
        {
          question:
            "An application experiences predictable high traffic every Monday morning. Which scaling policy eliminates the reactive lag before new instances are healthy?",
          options: [
            "Simple Scaling",
            "Target Tracking Scaling",
            "Scheduled Scaling",
            "Step Scaling",
          ],
          correctIndex: 2,
          explanation:
            "Scheduled Scaling pre-provisions capacity at known times, so instances are already healthy and serving traffic before the predictable load arrives. Reactive policies like Target Tracking add lag because instances must launch and initialize after load increases.",
        },
        {
          question: "How does Step Scaling differ from Simple Scaling?",
          options: [
            "Step Scaling uses machine learning to predict future demand; Simple Scaling reacts to current metrics",
            "Step Scaling applies different capacity adjustments based on the severity of an alarm breach; Simple Scaling applies a fixed amount with a mandatory cooldown",
            "Step Scaling is the newer, recommended policy; Simple Scaling has been deprecated",
            "Step Scaling works with any metric; Simple Scaling only works with CPU utilization",
          ],
          correctIndex: 1,
          explanation:
            "Step Scaling triggers different capacity adjustments based on how far the metric exceeds the threshold (e.g., +2 at 60-80% CPU, +4 above 80%). Simple Scaling applies a single fixed adjustment and then waits for the cooldown period before any further action.",
        },
      ],
    },
    {
      heading: "Predictive Scaling and Warm Pools",
      body: `Predictive Scaling uses machine learning to analyze historical CloudWatch metrics and forecast future demand, pre-scaling the ASG before load arrives rather than reacting to it. This is particularly valuable for applications with long instance initialization times where reactive scaling leaves a latency gap between when load arrives and when new instances are healthy and serving traffic. Warm Pools address initialization latency from a different angle: a pool of pre-initialized, stopped instances is maintained alongside the ASG. When the ASG needs to scale out, it pulls instances from the warm pool (which are already initialized to a running state) rather than launching cold instances from scratch — reducing scale-out time from minutes to seconds for applications with slow bootstrap processes. Warm Pool instances can be kept in a stopped, running, or hibernated state depending on cost and readiness requirements.`,
      quiz: [
        {
          question:
            "An application takes 8 minutes to boot and configure before serving traffic. The team notices users experience slowness during sudden traffic spikes. Which feature addresses this without redesigning the application?",
          options: [
            "Step Scaling with aggressive thresholds",
            "Predictive Scaling",
            "Reserved Instances",
            "Warm Pools",
          ],
          correctIndex: 3,
          explanation:
            "Warm Pools maintain pre-initialized instances that can be pulled into service in seconds rather than going through the full 8-minute boot process. Predictive Scaling forecasts demand but still launches cold instances; Warm Pools solve the initialization latency directly.",
        },
        {
          question:
            "What distinguishes Predictive Scaling from Target Tracking Scaling?",
          options: [
            "Predictive Scaling sets a fixed schedule; Target Tracking adjusts dynamically",
            "Predictive Scaling is more expensive; Target Tracking is free",
            "Predictive Scaling only works with EC2; Target Tracking works with ECS and DynamoDB too",
            "Predictive Scaling uses ML to forecast and pre-scale before load arrives; Target Tracking reacts to current metrics",
          ],
          correctIndex: 3,
          explanation:
            "Predictive Scaling analyzes historical CloudWatch data and proactively scales the ASG before anticipated load peaks, eliminating the lag of reactive scaling. Target Tracking continuously adjusts capacity based on current observed metrics.",
        },
        {
          question: "In what states can instances in a Warm Pool be kept?",
          options: [
            "Stopped, Running, or Hibernated",
            "Pending or InService only",
            "Only Running",
            "Only Stopped",
          ],
          correctIndex: 0,
          explanation:
            "Warm Pool instances can be maintained in stopped, running, or hibernated states depending on cost and readiness trade-offs. Stopped instances are cheapest; running instances are most immediately available.",
        },
      ],
    },
    {
      heading: "Instance Refresh and Rolling Deployments",
      body: `Instance Refresh automates the process of replacing all instances in an ASG with new instances — typically after updating the Launch Template to a new AMI version or configuration. You specify a minimum healthy percentage (e.g., 90%) that ensures a portion of the fleet remains in service throughout the refresh, preventing full outages during updates. Auto Scaling replaces instances in batches, waiting for new instances to pass health checks before terminating old ones. Checkpoint percentages allow you to pause the refresh at specific fleet completion percentages for manual validation before proceeding. Combined with a golden AMI workflow — building a fully configured AMI from a CI/CD pipeline and updating the Launch Template — Instance Refresh provides a controlled, zero-downtime deployment mechanism for EC2-based applications without needing a separate deployment tool.`,
      quiz: [
        {
          question:
            "What does Instance Refresh use to ensure the application remains available during a rolling AMI replacement?",
          options: [
            "A scheduled maintenance window that pauses all traffic during the replacement",
            "A separate standby ASG that absorbs traffic while the primary is updated",
            "A minimum healthy percentage that keeps a portion of the fleet in service throughout the refresh",
            "Blue/green deployment using Route 53 weighted routing",
          ],
          correctIndex: 2,
          explanation:
            "Instance Refresh replaces instances in batches while maintaining at least the specified minimum healthy percentage in service, preventing full outages. New instances must pass health checks before old ones are terminated.",
        },
        {
          question:
            "What is the purpose of checkpoint percentages in an Instance Refresh?",
          options: [
            "They specify how many instances to replace per batch",
            "They allow pausing the refresh at specific completion milestones for manual validation before proceeding",
            "They define the minimum healthy percentage at each stage",
            "They set the health check grace period for new instances",
          ],
          correctIndex: 1,
          explanation:
            "Checkpoint percentages let you pause the Instance Refresh when a specified proportion of instances have been replaced, allowing manual testing or validation before the refresh continues to completion.",
        },
        {
          question:
            "After updating the Launch Template with a new AMI, which feature automates the controlled replacement of all existing ASG instances without requiring a separate deployment tool?",
          options: [
            "Instance Refresh",
            "Warm Pools",
            "Lifecycle Hooks",
            "Scheduled Scaling",
          ],
          correctIndex: 0,
          explanation:
            "Instance Refresh orchestrates the rolling replacement of all ASG instances after a Launch Template update, respecting health checks and the minimum healthy percentage to achieve zero-downtime deployments.",
        },
      ],
    },
    {
      heading: "Application Auto Scaling Beyond EC2",
      body: `Application Auto Scaling extends the same scaling policies to non-EC2 resources. ECS service scaling adjusts the number of running task replicas in an ECS service based on CPU, memory, or custom metrics — the standard approach for scaling containerized microservices. DynamoDB Auto Scaling adjusts provisioned RCUs and WCUs based on consumed capacity, keeping utilization near the target percentage without manual adjustments. Aurora Auto Scaling adds and removes Aurora Replicas based on database load metrics like replica lag and CPU utilization. These resources share the same Target Tracking, Step, and Scheduled scaling policy types as EC2 ASGs. For all scaling decisions, the scaling cooldown period prevents thrashing by blocking further scale-in actions for a configurable time after a scaling event, allowing metrics to stabilize before the next decision.`,
      quiz: [
        {
          question:
            "Which AWS resources can be scaled using Application Auto Scaling? (Select the best answer)",
          options: [
            "EC2 instances only",
            "ECS services, DynamoDB tables, and Aurora replicas",
            "S3 buckets and Lambda functions",
            "RDS Multi-AZ standbys and ElastiCache clusters",
          ],
          correctIndex: 1,
          explanation:
            "Application Auto Scaling extends scaling to non-EC2 resources including ECS tasks, DynamoDB RCU/WCU, and Aurora replicas. EC2 instances are handled by EC2 Auto Scaling Groups, not Application Auto Scaling.",
        },
        {
          question:
            "What is the purpose of the scaling cooldown period in Auto Scaling?",
          options: [
            "It delays the launch of new instances to avoid exceeding AWS service quotas",
            "It prevents scale-out during business hours",
            "It blocks further scale-in actions for a configurable time after a scaling event so metrics can stabilize",
            "It sets the minimum time an instance must run before it can be terminated",
          ],
          correctIndex: 2,
          explanation:
            "The cooldown period prevents thrashing by giving metrics time to stabilize after a scaling event before another scale-in action can occur. Without it, rapidly fluctuating metrics could trigger constant scaling up and down.",
        },
        {
          question:
            "A team wants DynamoDB read and write capacity to adjust automatically without manual intervention. Which feature handles this?",
          options: [
            "DynamoDB Auto Scaling via Application Auto Scaling",
            "DynamoDB On-Demand mode",
            "DynamoDB Streams",
            "DAX caching",
          ],
          correctIndex: 0,
          explanation:
            "DynamoDB Auto Scaling, implemented through Application Auto Scaling, monitors consumed capacity and adjusts provisioned RCUs and WCUs to stay near a target utilization percentage automatically.",
        },
      ],
    },
    {
      heading: "Lifecycle Hooks and Termination Policies",
      body: `Lifecycle Hooks pause instance launches or terminations at specific points in the ASG lifecycle, allowing custom actions to complete before the process continues. A launch hook pauses a new instance in the \`Pending:Wait\` state — useful for running configuration scripts, registering the instance with external monitoring, or loading data from S3 before the instance enters service. A termination hook pauses a terminating instance in the \`Terminating:Wait\` state — useful for draining connections, archiving logs to S3, or deregistering from service discovery before the instance disappears. Hooks can send notifications to SQS or SNS and allow up to 48 hours for the custom action to complete. Termination policies control which instances the ASG terminates first during scale-in events — policies include OldestInstance, NewestInstance, OldestLaunchTemplate, and the default ClosestToNextInstanceHour (to minimize wasted On-Demand billing time).`,
      quiz: [
        {
          question:
            "An ASG needs to deregister instances from an external service discovery registry before they are terminated. Which ASG feature enables this?",
          options: [
            "A termination lifecycle hook that pauses the instance in Terminating:Wait",
            "Target Tracking Scaling with a custom metric",
            "A scheduled scaling action timed before the termination",
            "Connection draining on the associated load balancer",
          ],
          correctIndex: 0,
          explanation:
            "A termination lifecycle hook pauses the instance in the Terminating:Wait state, giving a Lambda function or script time to perform cleanup tasks like deregistering from service discovery before the instance is actually terminated.",
        },
        {
          question:
            "What is the maximum time a lifecycle hook can hold an instance in the wait state?",
          options: ["48 hours", "5 minutes", "1 hour", "24 hours"],
          correctIndex: 0,
          explanation:
            "Lifecycle Hooks allow up to 48 hours for the custom action to complete before the ASG proceeds with the launch or termination. This accommodates long-running initialization or drain tasks.",
        },
        {
          question:
            "Which termination policy minimizes wasted On-Demand billing time during scale-in?",
          options: [
            "OldestLaunchTemplate",
            "ClosestToNextInstanceHour",
            "NewestInstance",
            "OldestInstance",
          ],
          correctIndex: 1,
          explanation:
            "ClosestToNextInstanceHour (the default) terminates instances that are closest to the end of their billing hour, minimizing wasted cost by ending instances just before they would be billed for another hour.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A company wants to scale EC2 instances to maintain 60% average CPU utilization. Which scaling policy type requires the least configuration and is most responsive?",
      options: [
        "Simple Scaling",
        "Step Scaling",
        "Target Tracking Scaling",
        "Scheduled Scaling",
      ],
      correctIndex: 2,
      explanation:
        "Target Tracking Scaling lets you specify a metric and target value; Auto Scaling continuously adjusts capacity to hit that target. It requires far less configuration than Step or Simple Scaling and responds smoothly to changing load.",
    },
    {
      question:
        "An application boots slowly (10 minutes). Traffic spikes happen unpredictably. Which feature reduces the time new instances take to become ready during a scale-out event?",
      options: [
        "Scheduled Scaling",
        "Warm Pools",
        "Predictive Scaling",
        "Instance Refresh",
      ],
      correctIndex: 1,
      explanation:
        "Warm Pools hold pre-initialized instances in a stopped or running state. When the ASG needs to scale out, it pulls from the pool instead of booting from scratch, reducing scale-out time from minutes to seconds.",
    },
    {
      question:
        "Which ASG health check type is more thorough for web applications running behind an ELB?",
      options: [
        "Systems Manager health checks",
        "Custom CloudWatch alarm checks",
        "ELB health checks",
        "EC2 status checks",
      ],
      correctIndex: 2,
      explanation:
        "ELB health checks verify that the application is responding correctly at the HTTP/HTTPS level, not just that the underlying EC2 instance is running. This catches application-level failures that EC2 status checks miss.",
    },
    {
      question:
        "After updating a Launch Template to a new AMI, which feature automatically replaces all existing ASG instances in a controlled, zero-downtime manner?",
      options: [
        "Instance Refresh",
        "Lifecycle Hooks",
        "Warm Pools",
        "Predictive Scaling",
      ],
      correctIndex: 0,
      explanation:
        "Instance Refresh replaces instances in batches, ensuring that the minimum healthy percentage remains in service throughout. It integrates with health checks to verify new instances before terminating old ones.",
    },
    {
      question:
        "A new instance in an ASG needs to run a configuration script before receiving traffic. Which feature pauses the launch process at the right point?",
      options: [
        "A scheduled scaling action",
        "A Warm Pool with hibernated instances",
        "A termination lifecycle hook in Terminating:Wait state",
        "A launch lifecycle hook in Pending:Wait state",
      ],
      correctIndex: 3,
      explanation:
        "A launch lifecycle hook pauses the instance in the Pending:Wait state before it enters InService. This window allows configuration scripts, monitoring registration, or data loading to complete before the instance receives traffic.",
    },
    {
      question:
        "Application Auto Scaling can manage which of the following resources? (Choose the most complete correct answer)",
      options: [
        "Lambda function concurrency and S3 request rates",
        "EC2 Auto Scaling Groups only",
        "RDS Multi-AZ standby instances",
        "ECS services, DynamoDB RCU/WCU, and Aurora replicas",
      ],
      correctIndex: 3,
      explanation:
        "Application Auto Scaling extends scaling policies to ECS services, DynamoDB provisioned throughput, Aurora replicas, and other non-EC2 resources. EC2 instances are managed by EC2 Auto Scaling Groups, not Application Auto Scaling.",
    },
    {
      question: "What is the primary purpose of the scaling cooldown period?",
      options: [
        "To enforce a minimum time between scheduled scaling actions",
        "To delay scale-out during low-traffic periods to save cost",
        "To allow lifecycle hooks to complete before the next instance launch",
        "To prevent a new scaling action from firing before metrics stabilize after a previous scaling event",
      ],
      correctIndex: 3,
      explanation:
        "The cooldown period blocks further scale-in actions for a configurable duration after a scaling event, preventing metric thrashing. Without it, a metric that briefly returns to normal after scaling could immediately trigger another scale-in.",
    },
    {
      question:
        "Which ASG termination policy minimizes wasted EC2 billing time during scale-in events?",
      options: [
        "ClosestToNextInstanceHour",
        "OldestInstance",
        "NewestInstance",
        "OldestLaunchTemplate",
      ],
      correctIndex: 0,
      explanation:
        "ClosestToNextInstanceHour terminates instances that are about to complete their current billing hour, avoiding paying for another hour of unused compute time. This is the default termination policy.",
    },
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
