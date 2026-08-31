import { ServiceGuide } from "../../../types/guide";

export const elasticBeanstalkGuide: ServiceGuide = {
  id: "aws-elastic-beanstalk",
  service: "AWS Elastic Beanstalk",
  domain: "deployment",
  tagline: "Easy application deployment without managing infrastructure",
  intro:
    "Elastic Beanstalk is a Platform-as-a-Service (PaaS) that deploys and scales web applications automatically. You upload your code and Beanstalk handles provisioning EC2 instances, load balancers, Auto Scaling groups, and CloudWatch monitoring. You retain full control of the underlying resources.",

  sections: [
    {
      heading: "Core Concepts",
      body: `Elastic Beanstalk organizes deployments around three concepts. An **application** is the logical container for all the versions and environments of a single project — think of it as the equivalent of a repository. An **application version** is a specific labeled release of your code, stored as a ZIP or WAR file in S3. You can deploy any version to any environment, making rollbacks as simple as deploying an older version. An **environment** is a running deployment of an application version — it has its own EC2 instances, load balancer, Auto Scaling group, and security groups, all independent from other environments.

Environments come in two tiers. The **Web Server tier** handles HTTP requests through an ALB and Auto Scaling Group — this is your internet-facing application. The **Worker tier** processes tasks from an SQS queue without a load balancer. EC2 instances in the worker tier poll SQS, and Beanstalk's daemon handles message visibility and deletion. This makes the worker tier ideal for background jobs, email sending, report generation, or any workload that should be decoupled from the web tier.

Beanstalk supports a wide range of runtimes through **platforms**: Node.js, Python, Java, Go, Ruby, PHP, .NET, and Docker are all available on Amazon Linux 2023-based platforms. Beanstalk can automatically apply platform updates (OS patches, runtime minor versions) during a configured maintenance window, reducing the operational burden of keeping instances current.`,
      quiz: [
        {
          question:
            "Where does Elastic Beanstalk store application version ZIP/WAR files?",
          options: [
            "In an S3 bucket",
            "In an ECR container registry",
            "In a CodeCommit repository",
            "In an EFS file system",
          ],
          correctIndex: 0,
          explanation:
            "Elastic Beanstalk stores each application version as a ZIP or WAR file in S3. You can deploy any stored version to any environment, making rollbacks straightforward.",
        },
        {
          question: "What is the purpose of the Elastic Beanstalk Worker tier?",
          options: [
            "To handle HTTP requests from internet users via an ALB",
            "To host static assets separately from the application",
            "To run database migrations before the web tier starts",
            "To process background tasks from an SQS queue without a load balancer",
          ],
          correctIndex: 3,
          explanation:
            "The Worker tier polls an SQS queue for background tasks. Beanstalk's daemon handles message visibility and deletion. It has no load balancer and is ideal for decoupled background processing like email sending or report generation.",
        },
        {
          question:
            "How does rolling back a deployment work in Elastic Beanstalk?",
          options: [
            "You redeploy a previous application version stored in S3",
            "You use the 'undo' button in the Beanstalk console",
            "Beanstalk automatically reverts on any health check failure",
            "Beanstalk snapshots the environment before each deployment",
          ],
          correctIndex: 0,
          explanation:
            "Rolling back in Elastic Beanstalk means deploying a previous application version. Since all versions are stored in S3, you can deploy any labeled version to any environment at any time.",
        },
      ],
    },
    {
      heading: "Deployment Policies",
      body: `Beanstalk gives you several deployment strategies with different tradeoffs between speed, cost, and downtime.

**All at once** deploys to every instance simultaneously. It's the fastest option and has no additional cost, but all instances are updating at the same time — meaning your application is briefly unavailable during deployment. This is acceptable in development and test environments but not in production.

**Rolling** divides instances into batches and deploys to one batch at a time. During the deployment window, some instances run the old version and some run the new version — a brief period of version inconsistency. No additional instances are created, and capacity is temporarily reduced during each batch update. Configure the batch size as a percentage or fixed count.

**Rolling with additional batch** launches a new batch of instances first, then rolls through the existing ones. This maintains full capacity throughout the deployment since you always have at least the original number of instances serving traffic.

**Immutable** deployment is the safest option. Beanstalk launches a completely new Auto Scaling Group with the new version, runs health checks on the new instances, and only terminates the old instances after the new fleet is healthy. Rollback is trivial — just terminate the new Auto Scaling Group. The tradeoff is cost (you briefly run double the instances) and speed (it's the slowest option).

**Traffic Splitting (Canary)** is similar to immutable but explicitly designed for canary testing. A configurable percentage of traffic routes to the new version while the rest stays on the current version, letting you validate behavior before full rollout. **Blue/Green** is a manual pattern: create a second environment, deploy to it, test it, then use Beanstalk's "Swap Environment URLs" feature to swap the CNAMEs between environments — instant traffic shift with easy rollback.`,
      quiz: [
        {
          question:
            "Which Elastic Beanstalk deployment policy is the safest with the easiest rollback?",
          options: [
            "Rolling",
            "All at once",
            "Rolling with additional batch",
            "Immutable",
          ],
          correctIndex: 3,
          explanation:
            "Immutable deployment launches a new Auto Scaling Group with the new version and only terminates old instances after health checks pass. Rollback is trivial — just terminate the new ASG. It is the safest option, though the slowest and most expensive.",
        },
        {
          question:
            "What is a key disadvantage of the 'All at once' Elastic Beanstalk deployment policy?",
          options: [
            "The application is briefly unavailable while all instances update simultaneously",
            "It does not support rollback",
            "It requires double the instances during deployment",
            "It is the most expensive deployment policy",
          ],
          correctIndex: 0,
          explanation:
            "All at once deploys to every instance simultaneously, causing a brief period where the application is unavailable. It is the fastest and cheapest option but is not suitable for production environments.",
        },
        {
          question:
            "How is Blue/Green deployment achieved in Elastic Beanstalk?",
          options: [
            "By enabling traffic splitting with a 50/50 split",
            "By configuring CodeDeploy with two ALB target groups",
            "By using immutable deployment with two simultaneous ASGs",
            "By creating a second environment, deploying to it, and using Swap Environment URLs to swap CNAMEs",
          ],
          correctIndex: 3,
          explanation:
            "Blue/Green in Beanstalk is a manual pattern: create a second environment, deploy and test the new version, then use Swap Environment URLs to instantly redirect traffic. The old environment becomes the rollback target.",
        },
      ],
    },
    {
      heading: ".ebextensions Configuration",
      body: `The **.ebextensions** directory in your application bundle contains configuration files (YAML or JSON with a \`.config\` extension) that customize the environment. These run during environment creation and during deployments, letting you install packages, write files, run commands, and add CloudFormation resources.

\`\`\`yaml
# .ebextensions/01-packages.config
packages:
  yum:
    git: []
    jq: []

commands:
  01_setup:
    command: "echo 'Setup complete' >> /var/log/setup.log"
    ignoreErrors: false

files:
  "/etc/nginx/conf.d/proxy.conf":
    mode: "000644"
    owner: root
    group: root
    content: |
      client_max_body_size 20M;

option_settings:
  aws:elasticbeanstalk:application:environment:
    NODE_ENV: production
  aws:autoscaling:asg:
    MinSize: 2
    MaxSize: 10
\`\`\`

You can add CloudFormation resources to the environment (like an SQS queue or a DynamoDB table) by adding a \`Resources\` section. These resources become part of the environment's CloudFormation stack and are deleted when the environment is terminated. Configuration files are processed in lexicographic order by filename — the naming convention \`01-...\`, \`02-...\` makes the ordering explicit.

Beanstalk uses CloudFormation under the hood for all resource management, so all created resources are visible in the CloudFormation console. **Saved configurations** snapshot your entire environment's settings and can be used to recreate identical environments — the right tool for maintaining dev/staging/prod parity.`,
      quiz: [
        {
          question:
            "In what order are .ebextensions configuration files processed?",
          options: [
            "In lexicographic (alphabetical) order by filename",
            "In the order they were created (oldest first)",
            "In reverse alphabetical order",
            "Simultaneously — order does not matter",
          ],
          correctIndex: 0,
          explanation:
            "Beanstalk processes .ebextensions config files in lexicographic (alphabetical) order by filename. The naming convention 01-..., 02-... makes the processing order explicit and predictable.",
        },
        {
          question:
            "What happens to CloudFormation resources added via .ebextensions when the Beanstalk environment is terminated?",
          options: [
            "They are deleted along with the environment as part of the CloudFormation stack",
            "They are exported to S3 before deletion",
            "They are retained indefinitely until manually deleted",
            "They are moved to a separate CloudFormation stack for retention",
          ],
          correctIndex: 0,
          explanation:
            "Resources added via .ebextensions become part of the environment's CloudFormation stack. When the environment is terminated, all those resources are deleted as part of the stack teardown.",
        },
        {
          question: "What is a Beanstalk 'saved configuration' used for?",
          options: [
            "Saving application code versions to S3",
            "Storing deployment history for compliance auditing",
            "Snapshotting the entire environment's settings to recreate identical environments",
            "Backing up the RDS database associated with the environment",
          ],
          correctIndex: 2,
          explanation:
            "Saved configurations snapshot the complete environment settings — instance type, capacity, load balancer settings, environment properties, and all option_settings. They are the right tool for maintaining dev/staging/prod environment parity.",
        },
      ],
    },
    {
      heading: "Environment Variables & Configuration",
      body: `Beanstalk injects environment-specific configuration into your application through **environment properties** — key-value pairs that become environment variables accessible in your application code. You can set these through the console, CLI, or .ebextensions \`option_settings\`.

Configuration precedence runs from highest to lowest: settings applied directly to the environment (console/CLI) override saved configurations, which override .ebextensions files, which override Beanstalk defaults. This layering lets you commit sensible defaults in .ebextensions while allowing environment-specific overrides without code changes.

A common mistake is storing database credentials, API keys, or other secrets in environment properties. They're visible in the Beanstalk console and stored in configuration history — not appropriate for secrets. Instead, fetch credentials from Secrets Manager or SSM Parameter Store in your application's startup code. Your application reads a secret name or parameter path from an environment variable (which is safe), then calls the Secrets Manager or SSM API at startup to retrieve the actual value.

The \`option_settings\` namespace system gives you access to every Beanstalk and AWS configuration option: instance type, minimum and maximum Auto Scaling capacity, health check paths, load balancer settings, and more — all without touching the console.`,
      quiz: [
        {
          question:
            "Why should database credentials NOT be stored in Elastic Beanstalk environment properties?",
          options: [
            "They are visible in the Beanstalk console and stored in configuration history — not appropriate for secrets",
            "Environment properties are deleted on each deployment",
            "Beanstalk environment properties are not accessible as environment variables",
            "Environment properties are limited to 256 characters",
          ],
          correctIndex: 0,
          explanation:
            "Beanstalk environment properties are visible in the console and stored in configuration history, making them unsuitable for secrets. Use Secrets Manager or SSM Parameter Store instead, and read a secret name (not the value) from an environment property.",
        },
        {
          question:
            "What is the highest priority configuration source in Elastic Beanstalk's precedence order?",
          options: [
            "Saved configurations",
            "Beanstalk defaults",
            ".ebextensions config files committed to the repository",
            "Settings applied directly to the environment via console or CLI",
          ],
          correctIndex: 3,
          explanation:
            "Settings applied directly to the environment via the console or CLI have the highest precedence. They override saved configurations, which override .ebextensions files, which override Beanstalk defaults.",
        },
        {
          question:
            "How can you configure the Auto Scaling group's minimum and maximum instance count in Elastic Beanstalk without using the console?",
          options: [
            "By creating a separate CloudFormation stack for the ASG",
            "By using option_settings in .ebextensions with the aws:autoscaling:asg namespace",
            "By modifying the EC2 Auto Scaling Group directly in the EC2 console",
            "By setting ASG parameters in the buildspec.yml file",
          ],
          correctIndex: 1,
          explanation:
            "The option_settings system in .ebextensions provides access to all Beanstalk configuration namespaces including aws:autoscaling:asg for MinSize and MaxSize. This allows infrastructure configuration to be version-controlled alongside application code.",
        },
      ],
    },
    {
      heading: "Monitoring & Health",
      body: `Beanstalk provides two tiers of health monitoring. **Basic health** reports a simple status for each instance and the overall environment based on EC2 instance health and ELB health check results. **Enhanced Health Reporting** adds detailed per-instance health information with specific causes — it tells you not just that an instance is unhealthy, but *why* (like "CommandFailed" during deployment or "NoBeat" from the Beanstalk daemon). Enhanced health has an additional cost but is recommended for production.

Environment health is summarized by color: Green (all healthy), Yellow (degraded), Red (critical failures), and Grey (updating). The environment health page shows which specific instances and which specific metrics are causing the status, making it much easier to diagnose issues than the basic traffic-light indicator alone.

Beanstalk automatically publishes metrics to CloudWatch for each environment. You can create alarms on environment health, request count, and latency. For log access, Beanstalk can retrieve logs from all instances and bundle them, or you can configure log streaming to CloudWatch Logs for real-time access — the latter is strongly recommended for production, since you can query logs in CloudWatch Logs Insights without SSH access or waiting for log retrieval.`,
      quiz: [
        {
          question:
            "What does Elastic Beanstalk Enhanced Health Reporting provide that Basic health does not?",
          options: [
            "More frequent health check intervals",
            "Detailed per-instance health information with specific failure causes",
            "Automatic remediation of unhealthy instances",
            "Integration with AWS Health Dashboard",
          ],
          correctIndex: 1,
          explanation:
            "Enhanced Health Reporting provides detailed per-instance health information including specific failure causes like 'CommandFailed' or 'NoBeat'. Basic health only reports a simple OK/WARN/CRITICAL status without explaining why.",
        },
        {
          question:
            "What does a Grey health status indicate in an Elastic Beanstalk environment?",
          options: [
            "The environment has critical failures",
            "The environment is degraded",
            "The environment is updating",
            "The environment has no instances running",
          ],
          correctIndex: 2,
          explanation:
            "Grey indicates the environment is updating (e.g., during a deployment). Green = healthy, Yellow = degraded, Red = critical failures, Grey = updating.",
        },
        {
          question:
            "What is the recommended approach for accessing application logs from Elastic Beanstalk instances in production?",
          options: [
            "SSH into each instance and tail the log files",
            "Use the Beanstalk console to retrieve bundled logs periodically",
            "Configure log streaming to CloudWatch Logs for real-time access via Logs Insights",
            "Enable S3 access logging on the Beanstalk bucket",
          ],
          correctIndex: 2,
          explanation:
            "Streaming logs to CloudWatch Logs is recommended for production. It enables real-time log access via CloudWatch Logs Insights queries without SSH or waiting for log bundle retrieval from multiple instances.",
        },
      ],
    },
    {
      heading: "Elastic Beanstalk with Other Services",
      body: `One of the most common Beanstalk pitfalls involves **RDS**. You can create an RDS instance inside a Beanstalk environment (coupled), but this ties the database's lifecycle to the environment — when you terminate the environment, RDS is deleted too. For production, create RDS outside Beanstalk (decoupled) and pass the connection string through environment properties. The database persists even if you rebuild the Beanstalk environment, which is the correct behavior for any stateful data store.

**Beanstalk + CodePipeline** is the most common CI/CD pattern for Beanstalk applications. CodePipeline's Deploy stage targets a Beanstalk environment, automatically deploying new application versions whenever the pipeline runs. **Beanstalk + Docker** supports both single-container mode (one Docker container per instance) and multi-container mode (multiple containers per instance using ECS under the hood, configured via \`Dockerrun.aws.json\`).

The **Worker tier + SQS** pattern decouples long-running work from your web tier. The web tier puts a task message on SQS and returns immediately to the user. Worker tier instances pick up the message, process it (generating a report, sending an email, processing an image), and delete the message when done. This architecture is clean and scalable — each tier scales independently based on its own load.

Beanstalk manages ACM certificate attachment to the load balancer through environment configuration, terminating HTTPS at the load balancer so your application instances only need to handle HTTP internally.`,
      quiz: [
        {
          question:
            "What is the risk of creating an RDS instance inside an Elastic Beanstalk environment?",
          options: [
            "RDS cannot be accessed from instances in the same environment",
            "The RDS instance uses a different VPC than the Beanstalk environment",
            "RDS inside Beanstalk is not supported",
            "The RDS instance is deleted when the environment is terminated",
          ],
          correctIndex: 3,
          explanation:
            "When RDS is created inside a Beanstalk environment (coupled), it becomes part of the environment's CloudFormation stack. Terminating the environment deletes the RDS instance. For production, create RDS outside Beanstalk (decoupled) so it persists independently.",
        },
        {
          question:
            "How does the Elastic Beanstalk Worker tier receive tasks to process?",
          options: [
            "By reading from a DynamoDB Streams feed",
            "Via HTTP requests from the web tier's load balancer",
            "Via EventBridge events from the web tier",
            "By polling an SQS queue — Beanstalk's daemon handles message visibility and deletion",
          ],
          correctIndex: 3,
          explanation:
            "The Worker tier's EC2 instances poll an SQS queue for tasks. Beanstalk's built-in daemon manages message visibility and deletion, so your application code only needs to process the task and return a successful response.",
        },
        {
          question:
            "What infrastructure tool does Elastic Beanstalk use under the hood for all resource management?",
          options: ["AWS OpsWorks", "AWS CloudFormation", "AWS SAM", "AWS CDK"],
          correctIndex: 1,
          explanation:
            "Beanstalk uses CloudFormation under the hood. All provisioned resources — EC2 instances, load balancers, ASGs, security groups — are visible in the CloudFormation console as a stack, and .ebextensions can add custom CloudFormation resources.",
        },
      ],
    },
  ],

  keyFacts: [
    "Web server tier: ALB + ASG. Worker tier: SQS polling + ASG (no load balancer).",
    "Deployment policies: All-at-once (fast, downtime), Rolling, Rolling+batch, Immutable, Traffic-splitting",
    "Immutable deployment: new ASG + instances; zero downtime; easiest rollback",
    "Blue/Green in Beanstalk: create separate environment, deploy, swap CNAMEs",
    ".ebextensions: customize environment with packages, commands, files, CloudFormation resources",
    "RDS in environment vs external: coupled = deleted with env; decoupled = persists",
    "Saved configurations: snapshot of settings; reuse for environment parity",
    "Enhanced Health: detailed health causes (beyond OK/WARN/CRITICAL); extra cost",
    "Worker tier processes SQS messages; Beanstalk daemon handles visibility/delete",
    "Secrets: do NOT put in environment properties; use Secrets Manager or SSM in code",
  ],

  relatedServices: [
    "Amazon EC2",
    "Elastic Load Balancing",
    "AWS Auto Scaling",
    "Amazon RDS",
    "Amazon S3",
    "Amazon SQS",
    "AWS CodePipeline",
    "Amazon CloudWatch",
    "AWS ACM",
  ],

  examTips: [
    "Immutable deployment = new ASG; zero downtime; rollback = terminate new ASG.",
    "Blue/Green in Beanstalk = separate environments + CNAME swap (not built-in like ECS blue/green).",
    "Worker tier: SQS queue + EC2 instances — no ALB. Use for background jobs.",
    "RDS inside Beanstalk environment: deleted when environment is deleted — decouple for production.",
    ".ebextensions option_settings: configure any Beanstalk namespace without console.",
    "Rolling deployment: mixed versions simultaneously (old + new). Immutable: clean cutover.",
    "Enhanced Health Reporting: adds detailed health causes — helpful for debugging deploy failures.",
    "Beanstalk uses CloudFormation under the hood — all resources visible in CF console.",
  ],

  topicQuiz: [
    {
      question:
        "A team wants to deploy a new Beanstalk application version with zero downtime and the easiest possible rollback. Which deployment policy should they choose?",
      options: [
        "All at once",
        "Immutable",
        "Rolling with additional batch",
        "Rolling",
      ],
      correctIndex: 1,
      explanation:
        "Immutable deployment launches a new Auto Scaling Group with the new version and only terminates the old ASG after health checks pass. Rollback is instant — just terminate the new ASG. It is the safest option with zero downtime.",
    },
    {
      question:
        "A Beanstalk environment has an RDS instance created inside it. What happens when the environment is terminated?",
      options: [
        "The RDS instance is transferred to the default VPC",
        "The RDS instance is moved to a standalone state and preserved",
        "The RDS instance is deleted along with the environment",
        "The RDS instance is automatically backed up to S3 before deletion",
      ],
      correctIndex: 2,
      explanation:
        "RDS created inside a Beanstalk environment is part of the environment's CloudFormation stack. When the environment is terminated, the RDS instance is deleted. For production, always create RDS outside Beanstalk (decoupled).",
    },
    {
      question:
        "Where should sensitive database credentials be stored for a Beanstalk application?",
      options: [
        "In AWS Secrets Manager or SSM Parameter Store, fetched at application startup",
        "In .ebextensions config files committed to the repository",
        "In Beanstalk environment properties — they are encrypted at rest",
        "In the application's web.config or application.properties file",
      ],
      correctIndex: 0,
      explanation:
        "Secrets should be stored in Secrets Manager or SSM Parameter Store, not in Beanstalk environment properties (visible in console and configuration history). The application reads a secret name from an environment variable and fetches the actual value at startup.",
    },
    {
      question: "How is Blue/Green deployment performed in Elastic Beanstalk?",
      options: [
        "By creating a second environment, deploying to it, and using Swap Environment URLs",
        "By enabling the built-in Blue/Green deployment policy in the console",
        "By using the immutable deployment policy with a traffic split configured",
        "By configuring CodeDeploy with two ALB target groups",
      ],
      correctIndex: 0,
      explanation:
        "Blue/Green is a manual pattern in Beanstalk — create a second environment, deploy and test the new version there, then use Swap Environment URLs to swap CNAMEs for instant traffic redirection. The original environment remains for rollback.",
    },
    {
      question:
        "In what order does Elastic Beanstalk process .ebextensions configuration files?",
      options: [
        "In the order they are listed in the application's manifest",
        "In lexicographic (alphabetical) order by filename",
        "All files are processed simultaneously",
        "In reverse alphabetical order",
      ],
      correctIndex: 1,
      explanation:
        "Beanstalk processes .ebextensions files in lexicographic (alphabetical) order. Naming them 01-packages.config, 02-commands.config, etc. makes the processing order explicit and predictable.",
    },
    {
      question:
        "What does the Elastic Beanstalk Worker tier do with SQS messages after processing?",
      options: [
        "Messages expire automatically after the visibility timeout",
        "Messages are moved to a dead-letter queue after processing",
        "Beanstalk's built-in daemon handles message visibility and deletion automatically",
        "The application code must manually call DeleteMessage on each processed message",
      ],
      correctIndex: 2,
      explanation:
        "Beanstalk's built-in daemon manages SQS message visibility and deletion for the Worker tier. The application only needs to process the task and return a successful HTTP response — the daemon handles the SQS mechanics.",
    },
    {
      question:
        "Which Elastic Beanstalk health status color indicates the environment is currently updating?",
      options: ["Grey", "Red", "Yellow", "Green"],
      correctIndex: 0,
      explanation:
        "Grey indicates the environment is updating (e.g., during a deployment or configuration change). Green = healthy, Yellow = degraded, Red = critical failures, Grey = updating.",
    },
    {
      question:
        "Which Elastic Beanstalk deployment policy temporarily reduces capacity by deploying to one batch of instances at a time without launching additional instances?",
      options: [
        "Rolling",
        "All at once",
        "Rolling with additional batch",
        "Immutable",
      ],
      correctIndex: 0,
      explanation:
        "Rolling deployment updates one batch at a time without creating extra instances. This temporarily reduces capacity during each batch update. Rolling with additional batch maintains full capacity by launching a new batch first before rolling through existing instances.",
    },
  ],
};
