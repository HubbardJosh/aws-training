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
    },
    {
      heading: "Deployment Policies",
      body: `Beanstalk gives you several deployment strategies with different tradeoffs between speed, cost, and downtime.

**All at once** deploys to every instance simultaneously. It's the fastest option and has no additional cost, but all instances are updating at the same time — meaning your application is briefly unavailable during deployment. This is acceptable in development and test environments but not in production.

**Rolling** divides instances into batches and deploys to one batch at a time. During the deployment window, some instances run the old version and some run the new version — a brief period of version inconsistency. No additional instances are created, and capacity is temporarily reduced during each batch update. Configure the batch size as a percentage or fixed count.

**Rolling with additional batch** launches a new batch of instances first, then rolls through the existing ones. This maintains full capacity throughout the deployment since you always have at least the original number of instances serving traffic.

**Immutable** deployment is the safest option. Beanstalk launches a completely new Auto Scaling Group with the new version, runs health checks on the new instances, and only terminates the old instances after the new fleet is healthy. Rollback is trivial — just terminate the new Auto Scaling Group. The tradeoff is cost (you briefly run double the instances) and speed (it's the slowest option).

**Traffic Splitting (Canary)** is similar to immutable but explicitly designed for canary testing. A configurable percentage of traffic routes to the new version while the rest stays on the current version, letting you validate behavior before full rollout. **Blue/Green** is a manual pattern: create a second environment, deploy to it, test it, then use Beanstalk's "Swap Environment URLs" feature to swap the CNAMEs between environments — instant traffic shift with easy rollback.`,
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
    },
    {
      heading: "Environment Variables & Configuration",
      body: `Beanstalk injects environment-specific configuration into your application through **environment properties** — key-value pairs that become environment variables accessible in your application code. You can set these through the console, CLI, or .ebextensions \`option_settings\`.

Configuration precedence runs from highest to lowest: settings applied directly to the environment (console/CLI) override saved configurations, which override .ebextensions files, which override Beanstalk defaults. This layering lets you commit sensible defaults in .ebextensions while allowing environment-specific overrides without code changes.

A common mistake is storing database credentials, API keys, or other secrets in environment properties. They're visible in the Beanstalk console and stored in configuration history — not appropriate for secrets. Instead, fetch credentials from Secrets Manager or SSM Parameter Store in your application's startup code. Your application reads a secret name or parameter path from an environment variable (which is safe), then calls the Secrets Manager or SSM API at startup to retrieve the actual value.

The \`option_settings\` namespace system gives you access to every Beanstalk and AWS configuration option: instance type, minimum and maximum Auto Scaling capacity, health check paths, load balancer settings, and more — all without touching the console.`,
    },
    {
      heading: "Monitoring & Health",
      body: `Beanstalk provides two tiers of health monitoring. **Basic health** reports a simple status for each instance and the overall environment based on EC2 instance health and ELB health check results. **Enhanced Health Reporting** adds detailed per-instance health information with specific causes — it tells you not just that an instance is unhealthy, but *why* (like "CommandFailed" during deployment or "NoBeat" from the Beanstalk daemon). Enhanced health has an additional cost but is recommended for production.

Environment health is summarized by color: Green (all healthy), Yellow (degraded), Red (critical failures), and Grey (updating). The environment health page shows which specific instances and which specific metrics are causing the status, making it much easier to diagnose issues than the basic traffic-light indicator alone.

Beanstalk automatically publishes metrics to CloudWatch for each environment. You can create alarms on environment health, request count, and latency. For log access, Beanstalk can retrieve logs from all instances and bundle them, or you can configure log streaming to CloudWatch Logs for real-time access — the latter is strongly recommended for production, since you can query logs in CloudWatch Logs Insights without SSH access or waiting for log retrieval.`,
    },
    {
      heading: "Elastic Beanstalk with Other Services",
      body: `One of the most common Beanstalk pitfalls involves **RDS**. You can create an RDS instance inside a Beanstalk environment (coupled), but this ties the database's lifecycle to the environment — when you terminate the environment, RDS is deleted too. For production, create RDS outside Beanstalk (decoupled) and pass the connection string through environment properties. The database persists even if you rebuild the Beanstalk environment, which is the correct behavior for any stateful data store.

**Beanstalk + CodePipeline** is the most common CI/CD pattern for Beanstalk applications. CodePipeline's Deploy stage targets a Beanstalk environment, automatically deploying new application versions whenever the pipeline runs. **Beanstalk + Docker** supports both single-container mode (one Docker container per instance) and multi-container mode (multiple containers per instance using ECS under the hood, configured via \`Dockerrun.aws.json\`).

The **Worker tier + SQS** pattern decouples long-running work from your web tier. The web tier puts a task message on SQS and returns immediately to the user. Worker tier instances pick up the message, process it (generating a report, sending an email, processing an image), and delete the message when done. This architecture is clean and scalable — each tier scales independently based on its own load.

Beanstalk manages ACM certificate attachment to the load balancer through environment configuration, terminating HTTPS at the load balancer so your application instances only need to handle HTTP internally.`,
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
};
