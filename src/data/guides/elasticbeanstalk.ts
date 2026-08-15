import { ServiceGuide } from "../../types/guide";

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
      body: `**Application**: logical container for environments and versions. Like a project or repository.

**Application Version**: a specific, labeled deployment of your code. Stored as a ZIP/WAR file in S3. You can deploy any version to any environment.

**Environment**: a running deployment of an application version. Has its own EC2 instances, load balancer, Auto Scaling group. Each environment is independent.

**Environment Tier**:
- *Web Server tier*: handles HTTP requests. ALB + Auto Scaling Group + EC2 instances.
- *Worker tier*: processes tasks from an SQS queue. No load balancer. EC2 instances poll SQS. Use for background job processing.

**Platform**: the runtime for your application. Examples:
- Node.js, Python, Java, Go, Ruby, PHP, .NET, Docker
- Amazon Linux 2023-based platforms (current)

**Managed Platform Updates**: Beanstalk can automatically apply platform patches (OS, runtime) during a maintenance window. You control minor vs major version updates.`,
    },
    {
      heading: "Deployment Policies",
      body: `Beanstalk offers multiple deployment strategies with different trade-offs:

**All at once** (default):
- Deploy to all instances simultaneously
- Fastest
- Downtime during deployment (all instances updating at once)
- Use for dev/test only

**Rolling**:
- Deploy to a batch of instances, then the next batch
- No additional instances created
- Some old, some new versions running simultaneously (version inconsistency window)
- Configurable batch size (% or count)

**Rolling with additional batch**:
- Launch a new batch of instances first, deploy to them, then roll through existing
- Maintains full capacity during deployment
- Brief additional cost for extra instances

**Immutable**:
- Launch a completely new Auto Scaling Group with new instances
- Switch traffic when all new instances pass health checks
- Old instances terminated after successful switch
- Zero downtime; easy rollback (just terminate new ASG)
- Slowest; highest cost temporarily

**Traffic splitting (Canary)**:
- Deploy to new instances and route a % of traffic to them
- Monitor for errors; shift more traffic gradually
- Rollback: redirect 100% back to old instances

**Blue/Green** (manual via swap URLs):
- Create new environment (green) alongside existing (blue)
- Deploy new version to green; test it
- Swap CNAMEs between blue and green → instant traffic shift
- Old environment (blue) preserved for rollback by swapping back`,
    },
    {
      heading: ".ebextensions Configuration",
      body: `**.ebextensions**: directory in your application bundle containing configuration files (YAML/JSON with \`.config\` extension). Customize environment resources, install software, run commands.

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

**Resources**: add CloudFormation resources to the environment:
\`\`\`yaml
Resources:
  MyQueue:
    Type: AWS::SQS::Queue
    Properties:
      VisibilityTimeout: 300
\`\`\`

**hooks**: run scripts at specific lifecycle events (pre-deploy, post-deploy).

**Execution order**: numbered config files run in lexicographic order (01-..., 02-...).

**Procfile**: specify multiple process types for your application. Beanstalk starts each process.`,
    },
    {
      heading: "Environment Variables & Configuration",
      body: `**Environment properties**: key-value pairs set in Beanstalk console, CLI, or .ebextensions. Injected as environment variables in the application.

**Precedence** (highest to lowest):
1. Settings applied directly to the environment (console/CLI)
2. Saved configurations
3. .ebextensions config files
4. Default values

**Saved configurations**: snapshot of environment settings stored in S3. Apply to recreate identical environments (dev/staging/prod parity).

**Configuration files** (.ebextensions option_settings): set any Beanstalk namespace option:
- \`aws:elasticbeanstalk:application:environment\`: environment variables
- \`aws:autoscaling:launchconfiguration\`: instance type, key pair, security groups
- \`aws:elasticbeanstalk:environment\`: environment type (LoadBalanced vs SingleInstance)
- \`aws:elasticbeanstalk:environment:process:default\`: health check path, port

**Secrets**: do NOT store secrets in environment properties (visible in console). Instead: fetch from Secrets Manager or SSM in application startup code.`,
    },
    {
      heading: "Monitoring & Health",
      body: `**Enhanced Health Reporting**: detailed health information beyond basic EC2/ELB checks. Reports health at instance, environment, and overall level. Shows causes (e.g. "CommandFailed", "NoBeat"). Costs extra.

**Health states**:
- Green: all instances healthy
- Yellow: some instances unhealthy or degraded
- Red: environment not responding / most instances unhealthy / deployment failed
- Grey: environment updating

**CloudWatch integration**: automatically publishes metrics per environment. Alarm on environment health, request count, latency.

**Managed Updates**: Beanstalk can automatically apply platform updates (OS patches, runtime minor versions) during a maintenance window. Configure allowed impact for updates.

**Log access**: request logs from the environment. Beanstalk retrieves logs from all instances and bundles them. Or configure log streaming to CloudWatch Logs.

**Event history**: view all environment events in console (deployments, scaling, health changes).`,
    },
    {
      heading: "Elastic Beanstalk with Other Services",
      body: `**Beanstalk + RDS**: you can create an RDS instance inside a Beanstalk environment (coupled) or use an external RDS (decoupled — recommended for production). Coupling means RDS deleted with environment; decoupling means DB persists.

**Beanstalk + S3**: application versions stored in S3. Beanstalk manages a versioning bucket automatically. Logs streamed to S3.

**Beanstalk + CodePipeline**: Deploy stage in CodePipeline targets a Beanstalk environment. Automatic deployments on code changes.

**Beanstalk + Docker**: deploy Docker containers. Single container mode (one container per instance) or multi-container mode (ECS cluster on each instance — uses ECS under the hood, Dockerrun.aws.json config).

**Beanstalk + Worker Tier + SQS**: web tier sends tasks to SQS; worker tier polls SQS, processes tasks. Decoupled architecture for async workloads. Worker daemon handles SQS message visibility and deletion.

**Beanstalk + CloudWatch Logs**: enable log streaming to CloudWatch Logs in environment configuration. View logs in CloudWatch Logs Insights without SSHing into instances.

**Beanstalk + ACM**: attach an SSL certificate from ACM to the load balancer via environment configuration. Terminate HTTPS at the load balancer.`,
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
