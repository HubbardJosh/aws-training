import { ServiceGuide } from "../../types/guide";

export const systemsManagerGuide: ServiceGuide = {
  id: "aws-systems-manager",
  service: "AWS Systems Manager",
  domain: "deployment",
  tagline: "Operations hub for managing AWS and on-premises infrastructure",
  intro:
    "AWS Systems Manager (SSM) is a collection of operations tools for managing EC2 instances, on-premises servers, and AWS resources. For developers, the most exam-relevant features are Parameter Store (configuration and secrets), Session Manager (secure shell access), and AppConfig (feature flags and application configuration).",

  sections: [
    {
      heading: "Parameter Store",
      body: `**Parameter Store** is SSM's configuration management service. It stores key-value pairs of configuration data in a hierarchical namespace, making it easy to organize parameters by application, environment, and component. A typical hierarchy looks like \`/myapp/prod/database/password\` and \`/myapp/dev/database/password\`, where the path structure communicates the parameter's scope at a glance.

Parameter Store supports three types. **String** parameters store plain text with no encryption. **StringList** stores a comma-delimited list. **SecureString** parameters are encrypted with KMS, making them suitable for sensitive data like database passwords or API keys that you manage without automatic rotation.

Parameter Store has two service tiers. The **Standard tier** is free and supports up to 10,000 parameters with values up to 4 KB — sufficient for most application configuration needs. The **Advanced tier** costs $0.05 per parameter per month and raises the value limit to 8 KB, supports up to 100,000 parameters, and adds parameter policies for expiration notifications and auto-deletion. For most teams, the Standard tier is the right starting point.

\`GetParametersByPath\` retrieves all parameters under a path prefix in a single API call, which is more efficient than fetching each parameter individually. Every update creates a new version, and you can retrieve a specific version or always get the latest. A Lambda extension for Parameter Store caches parameter values locally and serves them from \`localhost\` without making API calls on every Lambda invocation, significantly reducing both latency and cost for parameter-heavy Lambda functions.`,
    },
    {
      heading: "Parameter Store vs Secrets Manager",
      body: `Choosing between Parameter Store and Secrets Manager is one of the most common architectural decisions for serverless and containerized applications, and the decision criteria are clear once you understand what each service is optimized for.

**Parameter Store** is the right choice for non-sensitive configuration and for sensitive values that don't require automatic rotation. Feature flags, environment-specific endpoints, application version numbers, database hostnames, and queue URLs all fit naturally in Parameter Store Standard — free, simple, and perfectly adequate. SecureString parameters handle sensitive values like API keys or passwords when you need encryption at rest but are willing to manage rotation manually. The lack of cross-account sharing is a limitation: Parameter Store parameters are account-scoped, and there's no native mechanism for sharing them across accounts.

**Secrets Manager** is optimized for credentials that must rotate automatically and that may need to be shared across accounts. Its built-in Lambda rotation functions for RDS, Redshift, DocumentDB, and ElastiCache handle the full rotation lifecycle — creating a new credential, setting it on the service, testing it, and promoting it — with no manual intervention. At $0.40 per secret per month, it's meaningfully more expensive than Parameter Store, but for production database credentials that need rotation, that cost is justified.

Both services integrate with Lambda (SDK calls), ECS task definitions (secrets injection), CloudFormation (dynamic references), and CodeBuild (environment variable injection). The practical rule: reach for Parameter Store as your default for configuration. Upgrade to Secrets Manager when you need automatic rotation or cross-account access. Never store database credentials in plain environment variables in either service — use SecureString or Secrets Manager, respectively.`,
    },
    {
      heading: "Session Manager",
      body: `**Session Manager** provides secure interactive shell access to EC2 instances (and on-premises servers with the SSM agent installed) without any of the traditional infrastructure that shell access requires: no SSH key pairs, no bastion hosts, no open inbound security group rules on port 22, and no VPC internet connectivity to the target instance.

The mechanism works through the SSM agent running on the instance, which maintains an outbound HTTPS connection to the SSM service. The instance doesn't need inbound connectivity at all. When you start a session — from the AWS console, the CLI (\`aws ssm start-session --target i-1234567890\`), or a VS Code extension — the connection is proxied through the SSM service over that existing outbound channel. The instance's IAM instance profile needs the \`AmazonSSMManagedInstanceCore\` managed policy. Amazon Linux 2, Windows Server AMIs, and recent Amazon Linux 2023 AMIs come with the SSM agent pre-installed.

A particularly useful capability is **port forwarding**: you can tunnel a local port to a private resource reachable from the instance — for example, tunneling \`localhost:5432\` to an RDS instance that only allows connections from the EC2 instance's security group. This lets you connect your local database client to a private RDS instance without opening any security group ports or creating a bastion host.

All session activity is logged to S3 or CloudWatch Logs, which is important for compliance auditing of who accessed which instance and what commands they ran. IAM conditions (\`ssm:resourceTag/Env: prod\`) let you restrict which users can start sessions on which instances, providing fine-grained access control beyond the basic instance-level permission.`,
    },
    {
      heading: "AppConfig",
      body: `**AppConfig** solves a specific problem in application operations: changing configuration values — feature flags, rate limit thresholds, maintenance mode toggles, A/B test configurations — without redeploying the application. Without AppConfig, changing a feature flag means updating an environment variable and redeploying the function or restarting the container. AppConfig changes take effect within a polling interval, without any deployment.

AppConfig organizes configuration around three concepts. An **Application** is the logical grouping (e.g. "OrderService"). Each application has **Environments** (dev, staging, prod). Each environment has **Configuration Profiles** that hold the actual config data — these can be free-form JSON/YAML, structured feature flag definitions with typed attributes, references to Parameter Store values, or S3 files.

Deploying a configuration change goes through a **Deployment Strategy** that controls rollout speed and risk. AllAtOnce applies immediately to all clients; Linear rolls out gradually (e.g. 20% of clients per 5 minutes); Exponential starts with a small percentage and increases (canary-like). Before deployment, **Validators** check that the new configuration is valid — a JSON Schema validator checks structure and types, or a Lambda validator runs custom logic to validate business rules.

The **AppConfig Agent** (for EC2 and containers) and **Lambda Extension** poll AppConfig for configuration changes on a schedule and cache the current configuration locally. Your application reads configuration from a local HTTP endpoint (\`localhost:2772/applications/App/environments/Env/configurations/Config\`) rather than calling AWS APIs directly. This means applications pick up configuration changes without restarts, and the local caching keeps latency low and API costs minimal.`,
    },
    {
      heading: "Other SSM Features",
      body: `SSM includes several additional operational capabilities beyond Parameter Store, Session Manager, and AppConfig that are worth knowing for the exam.

**Run Command** executes shell scripts or PowerShell commands on EC2 instances at scale, without SSH or bastion hosts. You target instances by ID, resource group, or tag (e.g. \`Environment=prod\`), and Run Command records output to S3 or CloudWatch Logs. This is the standard mechanism for running one-time operational scripts across a fleet of instances.

**Patch Manager** automates OS patching across your EC2 fleet. You define patch baselines (which patches are approved and which are rejected), configure maintenance windows that restrict when patching can occur, and Patch Manager applies approved patches during those windows. This eliminates the manual process of SSHing into instances and running update commands, and gives you a compliance view of which instances are missing patches.

**Automation** runs operational runbooks — pre-built or custom — against AWS resources. Common runbooks create AMIs from EC2 instances, restart stopped instances, remediate Security Hub findings, or run application-level health checks. Automation can be triggered manually, on a schedule via EventBridge, or in response to CloudWatch alarms. **State Manager** enforces desired state on EC2 instances — ensuring the CloudWatch agent is installed, a specific software version is present, or a configuration file has the correct contents — and continuously reapplies the desired state if drift occurs.

**OpsCenter** provides a centralized view of operational issues (OpsItems) aggregated from CloudWatch alarms, Security Hub findings, Config rule violations, and EventBridge events. It functions as a lightweight operational ticketing system where engineers can track and resolve infrastructure issues without leaving the AWS console.`,
    },
    {
      heading: "Systems Manager with Other Services",
      body: `**SSM + Lambda** is the most common developer integration. Lambda functions retrieve Parameter Store values using \`GetParameter\` or \`GetParametersByPath\` at initialization time and cache them in module-level variables. For SecureString parameters, the Lambda execution role needs \`ssm:GetParameters\` and \`kms:Decrypt\`. The Lambda extension for Parameter Store makes this even simpler — parameters are available at a local HTTP endpoint without any SDK calls in the function code.

**SSM + ECS** uses the task definition's \`secrets\` field to reference Parameter Store parameters directly. ECS fetches the values at task launch time and injects them as environment variables. The task execution role needs \`ssm:GetParameters\` permission. This keeps sensitive configuration out of your container images and Dockerfiles, and updating a Parameter Store value is reflected in the next task launch without rebuilding the image.

**SSM + CloudFormation** uses dynamic references to embed Parameter Store values in CloudFormation templates at deploy time: \`{{resolve:ssm:/myapp/param}}\` fetches the current value of that parameter. The \`AWS::SSM::Parameter::Value<String>\` type in the Parameters section lets you declare SSM parameters as CloudFormation inputs, making templates environment-aware without hardcoding values.

**SSM + CodeBuild** references Parameter Store parameters in the \`env\` section of \`buildspec.yml\`, fetching them at build time. This keeps environment-specific configuration (API endpoints, artifact bucket names) out of the buildspec itself and in Parameter Store where they can be managed independently. **SSM + EventBridge** enables reactive workflows: Parameter Store publishes change events to EventBridge when parameter values are updated, allowing you to trigger Lambda or Step Functions workflows when a feature flag is toggled or a configuration value changes — useful for automated rollout coordination and change tracking.`,
    },
  ],

  keyFacts: [
    "Parameter Store Standard: free, 4 KB, no rotation. Advanced: $0.05/mo, 8 KB, parameter policies.",
    "SecureString: KMS-encrypted parameter. Use for sensitive config when rotation not needed.",
    "GetParametersByPath: fetch all params under a hierarchy prefix in one API call",
    "Session Manager: no SSH keys, no bastion, no port 22 — outbound HTTPS from instance",
    "SSM Agent: pre-installed on Amazon Linux 2 + Windows; needs AmazonSSMManagedInstanceCore role",
    "Port forwarding via Session Manager: tunnel to private RDS/Redis without opening ports",
    "AppConfig: application configuration management with deployment strategies + validation",
    "AppConfig Lambda extension: caches config at localhost:2772; polls for updates",
    "Run Command: run scripts on EC2 fleet without SSH",
    "Patch Manager: automate OS patching with baselines and maintenance windows",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon ECS",
    "Amazon EC2",
    "AWS CloudFormation",
    "AWS CodeBuild",
    "AWS Secrets Manager",
    "AWS KMS",
    "Amazon EventBridge",
    "Amazon CloudWatch",
  ],

  examTips: [
    "Parameter Store Standard = free config storage. SecureString = KMS-encrypted (still free standard tier).",
    "Parameter Store vs Secrets Manager: rotation → Secrets Manager. Config/flags → Parameter Store.",
    "Session Manager: no open ports, no bastion hosts — requires SSM Agent + instance profile.",
    "Port forwarding via SSM: connect to private RDS using local port tunnel through EC2.",
    "AppConfig: feature flags + safe rollout strategies with validators and canary deployments.",
    "ECS secrets injection: Parameter Store → task execution role needs ssm:GetParameters.",
    "Lambda extension for Parameter Store: caches params locally, avoids per-invocation API calls.",
    "Run Command: run scripts across fleet by tag/ID — no SSH, logged to S3/CloudWatch.",
    "EventBridge + Parameter Store: react to parameter changes (feature flag toggled → Lambda notified).",
  ],
};
