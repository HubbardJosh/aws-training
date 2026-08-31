import { ServiceGuide } from "../../../types/guide";

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
      quiz: [
        {
          question:
            "A Lambda function reads 12 configuration parameters on every invocation, causing high SSM API call volume and added latency. Which approach eliminates per-invocation API calls while keeping configuration current?",
          options: [
            "Use the Lambda extension for Parameter Store, which caches parameters locally and serves them from localhost",
            "Store all parameters as a single JSON StringList and parse it in the function",
            "Switch to the Advanced tier, which includes built-in caching for Lambda",
            "Use environment variables baked into the Lambda deployment package at deploy time",
          ],
          correctIndex: 0,
          explanation:
            "The Lambda extension for Parameter Store runs as a companion process in the Lambda execution environment. It caches parameter values locally and exposes them via a local HTTP endpoint (`localhost:2772`), so the function reads configuration without making any SSM API calls on each invocation. The extension polls for updates in the background, keeping values fresh without per-invocation network round-trips.",
        },
        {
          question:
            "A developer needs to store a database password in Parameter Store. The password must be encrypted at rest. Which parameter type should they use?",
          options: [
            "StringList — splits the password into a list for additional obfuscation",
            "Advanced String — the Advanced tier adds encryption to plain String parameters",
            "String — the default type, which encrypts values automatically",
            "SecureString — encrypts the value with KMS and is suitable for sensitive data",
          ],
          correctIndex: 3,
          explanation:
            "SecureString parameters are encrypted at rest using AWS KMS. This is the correct choice for sensitive values like database passwords, API keys, and credentials stored in Parameter Store. Standard String parameters store plaintext with no encryption. StringList is for comma-separated non-sensitive values. There is no 'Advanced String' type.",
        },
        {
          question:
            "A team wants to retrieve all configuration parameters for their `prod` environment in a single API call instead of fetching each one individually. Which API action supports this?",
          options: [
            "GetParameter with a wildcard path pattern",
            "DescribeParameters filtered by the environment tag",
            "GetParametersByPath with the `/myapp/prod/` prefix",
            "BatchGetParameters, which is available in the Advanced tier",
          ],
          correctIndex: 2,
          explanation:
            "`GetParametersByPath` retrieves all parameters under a specified path prefix in a single API call. For example, `/myapp/prod/` returns all parameters stored under that hierarchy. This is more efficient than calling `GetParameter` for each value individually and is the standard pattern for initializing application configuration at startup.",
        },
      ],
    },
    {
      heading: "Parameter Store vs Secrets Manager",
      body: `Choosing between Parameter Store and Secrets Manager is one of the most common architectural decisions for serverless and containerized applications, and the decision criteria are clear once you understand what each service is optimized for.

**Parameter Store** is the right choice for non-sensitive configuration and for sensitive values that don't require automatic rotation. Feature flags, environment-specific endpoints, application version numbers, database hostnames, and queue URLs all fit naturally in Parameter Store Standard — free, simple, and perfectly adequate. SecureString parameters handle sensitive values like API keys or passwords when you need encryption at rest but are willing to manage rotation manually. The lack of cross-account sharing is a limitation: Parameter Store parameters are account-scoped, and there's no native mechanism for sharing them across accounts.

**Secrets Manager** is optimized for credentials that must rotate automatically and that may need to be shared across accounts. Its built-in Lambda rotation functions for RDS, Redshift, DocumentDB, and ElastiCache handle the full rotation lifecycle — creating a new credential, setting it on the service, testing it, and promoting it — with no manual intervention. At $0.40 per secret per month, it's meaningfully more expensive than Parameter Store, but for production database credentials that need rotation, that cost is justified.

Both services integrate with Lambda (SDK calls), ECS task definitions (secrets injection), CloudFormation (dynamic references), and CodeBuild (environment variable injection). The practical rule: reach for Parameter Store as your default for configuration. Upgrade to Secrets Manager when you need automatic rotation or cross-account access. Never store database credentials in plain environment variables in either service — use SecureString or Secrets Manager, respectively.`,
      quiz: [
        {
          question:
            "A production RDS database uses credentials that must automatically rotate every 30 days, with no manual intervention. Which service handles this requirement?",
          options: [
            "Systems Manager Automation with a runbook that rotates the RDS password on a maintenance window schedule",
            "Parameter Store Advanced tier with a parameter policy set to expire every 30 days",
            "Secrets Manager with a built-in rotation Lambda that manages the full RDS credential rotation lifecycle",
            "Parameter Store SecureString with a scheduled Lambda function that updates the value monthly",
          ],
          correctIndex: 2,
          explanation:
            "Secrets Manager provides built-in automatic rotation for RDS, Redshift, DocumentDB, and ElastiCache using managed Lambda rotation functions. The rotation lifecycle — creating a new credential, updating the database, testing the new credential, and promoting it — is fully automated with no manual steps. Parameter Store has no native automatic rotation capability.",
        },
        {
          question:
            "A microservices team needs to share a third-party API key across three AWS accounts. Which service natively supports cross-account secret sharing?",
          options: [
            "Both services support cross-account sharing with the same mechanism",
            "Parameter Store, by using resource-based policies on the parameter",
            "Secrets Manager, which supports resource-based policies enabling cross-account access",
            "Neither service supports cross-account sharing — the key must be replicated to each account",
          ],
          correctIndex: 2,
          explanation:
            "Secrets Manager supports resource-based policies that allow cross-account access to secrets. Parameter Store parameters are account-scoped with no native cross-account sharing mechanism. This is one of the two key reasons to choose Secrets Manager over Parameter Store (the other being automatic rotation).",
        },
        {
          question:
            'A developer stores a feature flag value (a plain string `"true"` or `"false"`) in Parameter Store. Which tier and type is the most cost-effective choice?',
          options: [
            "Advanced tier String, for the higher 8 KB value limit",
            "Advanced tier SecureString, for maximum security",
            "Standard tier String, because it is free and plaintext feature flags need no encryption",
            "Standard tier SecureString, because all production values should be encrypted",
          ],
          correctIndex: 2,
          explanation:
            "Feature flags are non-sensitive configuration values — there is no reason to encrypt them with KMS (which adds cost for decryption API calls) or to pay for the Advanced tier. Standard tier String parameters are free and fully sufficient for plaintext configuration like feature flags, endpoint URLs, and version numbers.",
        },
      ],
    },
    {
      heading: "Session Manager",
      body: `**Session Manager** provides secure interactive shell access to EC2 instances (and on-premises servers with the SSM agent installed) without any of the traditional infrastructure that shell access requires: no SSH key pairs, no bastion hosts, no open inbound security group rules on port 22, and no VPC internet connectivity to the target instance.

The mechanism works through the SSM agent running on the instance, which maintains an outbound HTTPS connection to the SSM service. The instance doesn't need inbound connectivity at all. When you start a session — from the AWS console, the CLI (\`aws ssm start-session --target i-1234567890\`), or a VS Code extension — the connection is proxied through the SSM service over that existing outbound channel. The instance's IAM instance profile needs the \`AmazonSSMManagedInstanceCore\` managed policy. Amazon Linux 2, Windows Server AMIs, and recent Amazon Linux 2023 AMIs come with the SSM agent pre-installed.

A particularly useful capability is **port forwarding**: you can tunnel a local port to a private resource reachable from the instance — for example, tunneling \`localhost:5432\` to an RDS instance that only allows connections from the EC2 instance's security group. This lets you connect your local database client to a private RDS instance without opening any security group ports or creating a bastion host.

All session activity is logged to S3 or CloudWatch Logs, which is important for compliance auditing of who accessed which instance and what commands they ran. IAM conditions (\`ssm:resourceTag/Env: prod\`) let you restrict which users can start sessions on which instances, providing fine-grained access control beyond the basic instance-level permission.`,
      quiz: [
        {
          question:
            "A security team wants to remove all SSH key pairs and close port 22 on their EC2 instances while still allowing engineers to access instance shells. Which SSM feature enables this?",
          options: [
            "Patch Manager — automates shell access for patching operations",
            "SSM Agent port forwarding — tunnels SSH traffic through port 443 to avoid port 22",
            "Run Command — executes commands remotely without SSH, though interactive access is not available",
            "Session Manager — provides interactive shell access via an outbound HTTPS tunnel, requiring no SSH keys or open inbound ports",
          ],
          correctIndex: 3,
          explanation:
            "Session Manager provides interactive shell access without SSH keys, bastion hosts, or inbound security group rules. The SSM agent on the instance maintains an outbound HTTPS connection to the SSM service, and sessions are proxied through that channel. Engineers start sessions from the console or CLI (`aws ssm start-session`) and the instance never needs inbound connectivity.",
        },
        {
          question:
            "A developer needs to connect their local database client to a private RDS instance that only accepts connections from a specific EC2 instance's security group. No bastion host exists. Which Session Manager capability solves this?",
          options: [
            "Open port 5432 on the RDS security group to the developer's IP address temporarily",
            "Use Run Command to export the RDS data and download it via S3",
            "Create a VPC peering connection between the developer's local network and the VPC",
            "Use Session Manager port forwarding to tunnel a local port through the EC2 instance to the RDS endpoint",
          ],
          correctIndex: 3,
          explanation:
            "Session Manager port forwarding tunnels a local port (e.g., localhost:5432) through the EC2 instance to a private resource the instance can reach — in this case the RDS endpoint. The RDS security group only needs to allow connections from the EC2 instance's security group, and no inbound ports need to be opened for the developer. This is a common pattern for accessing private databases without a bastion host.",
        },
        {
          question:
            "Which IAM managed policy must be attached to an EC2 instance profile for Session Manager to function?",
          options: [
            "AmazonSSMFullAccess",
            "AmazonEC2RoleforSSM",
            "AmazonSSMManagedInstanceCore",
            "AWSSystemsManagerSessionManagerAccess",
          ],
          correctIndex: 2,
          explanation:
            "`AmazonSSMManagedInstanceCore` is the AWS-managed policy that grants the minimum permissions required for the SSM agent to register with the SSM service, communicate with Session Manager, and enable Run Command. Without this policy (or equivalent permissions) on the instance profile, Session Manager connections cannot be established.",
        },
      ],
    },
    {
      heading: "AppConfig",
      body: `**AppConfig** solves a specific problem in application operations: changing configuration values — feature flags, rate limit thresholds, maintenance mode toggles, A/B test configurations — without redeploying the application. Without AppConfig, changing a feature flag means updating an environment variable and redeploying the function or restarting the container. AppConfig changes take effect within a polling interval, without any deployment.

AppConfig organizes configuration around three concepts. An **Application** is the logical grouping (e.g. "OrderService"). Each application has **Environments** (dev, staging, prod). Each environment has **Configuration Profiles** that hold the actual config data — these can be free-form JSON/YAML, structured feature flag definitions with typed attributes, references to Parameter Store values, or S3 files.

Deploying a configuration change goes through a **Deployment Strategy** that controls rollout speed and risk. AllAtOnce applies immediately to all clients; Linear rolls out gradually (e.g. 20% of clients per 5 minutes); Exponential starts with a small percentage and increases (canary-like). Before deployment, **Validators** check that the new configuration is valid — a JSON Schema validator checks structure and types, or a Lambda validator runs custom logic to validate business rules.

The **AppConfig Agent** (for EC2 and containers) and **Lambda Extension** poll AppConfig for configuration changes on a schedule and cache the current configuration locally. Your application reads configuration from a local HTTP endpoint (\`localhost:2772/applications/App/environments/Env/configurations/Config\`) rather than calling AWS APIs directly. This means applications pick up configuration changes without restarts, and the local caching keeps latency low and API costs minimal.`,
      quiz: [
        {
          question:
            "A team wants to enable a new feature flag for 20% of users and gradually increase coverage over 20 minutes without redeploying their Lambda functions. Which AppConfig feature supports this?",
          options: [
            "AllAtOnce deployment strategy with a Lambda validator to gate access",
            "A Linear deployment strategy that rolls out the new configuration gradually over the specified time window",
            "Update the feature flag in Parameter Store; Lambda functions pick it up automatically",
            "Use an Exponential deployment strategy starting at 100% and decreasing based on error rate",
          ],
          correctIndex: 1,
          explanation:
            "AppConfig's Linear deployment strategy rolls out configuration changes gradually — for example, 20% of clients receive the new value every 5 minutes. The Lambda Extension polls for changes on a schedule, so functions pick up the updated flag within the polling interval without redeployment. AllAtOnce applies immediately to all clients, which doesn't satisfy the gradual rollout requirement.",
        },
        {
          question:
            "Before deploying a new AppConfig configuration, a team wants to validate that the JSON structure matches their schema AND that business rules (like rate limits being within acceptable bounds) are satisfied. Which validator types can they combine?",
          options: [
            "JSON Schema validator for structure/type checking and a Lambda validator for custom business logic validation",
            "CloudWatch alarms act as validators by rolling back deployments when metrics degrade",
            "JSON Schema validator only — Lambda validators are not supported for AppConfig",
            "Lambda validator only — JSON Schema is not natively supported in AppConfig",
          ],
          correctIndex: 0,
          explanation:
            "AppConfig supports two validator types that can be used together: a JSON Schema validator checks that the new configuration conforms to a defined schema (structure and types), and a Lambda validator runs custom code for business rule validation (e.g., ensuring rate limits are within acceptable bounds). Both validators must pass before the deployment proceeds.",
        },
        {
          question:
            "A Lambda function reads its AppConfig configuration via the Lambda Extension. Where does the function read the configuration from at runtime?",
          options: [
            "From an environment variable injected at deploy time by AppConfig",
            "From a local HTTP endpoint at `localhost:2772` served by the Lambda Extension",
            "Directly from the AppConfig API using `GetConfiguration` SDK calls",
            "From an S3 bucket that AppConfig updates when configuration changes are deployed",
          ],
          correctIndex: 1,
          explanation:
            "The AppConfig Lambda Extension serves the current cached configuration from a local HTTP endpoint at `localhost:2772/applications/{app}/environments/{env}/configurations/{profile}`. The function reads from this local endpoint rather than calling the AppConfig API directly, which keeps latency low and eliminates per-invocation API costs. The extension polls AppConfig in the background and updates the cache when changes are deployed.",
        },
      ],
    },
    {
      heading: "Other SSM Features",
      body: `SSM includes several additional operational capabilities beyond Parameter Store, Session Manager, and AppConfig that are worth knowing for the exam.

**Run Command** executes shell scripts or PowerShell commands on EC2 instances at scale, without SSH or bastion hosts. You target instances by ID, resource group, or tag (e.g. \`Environment=prod\`), and Run Command records output to S3 or CloudWatch Logs. This is the standard mechanism for running one-time operational scripts across a fleet of instances.

**Patch Manager** automates OS patching across your EC2 fleet. You define patch baselines (which patches are approved and which are rejected), configure maintenance windows that restrict when patching can occur, and Patch Manager applies approved patches during those windows. This eliminates the manual process of SSHing into instances and running update commands, and gives you a compliance view of which instances are missing patches.

**Automation** runs operational runbooks — pre-built or custom — against AWS resources. Common runbooks create AMIs from EC2 instances, restart stopped instances, remediate Security Hub findings, or run application-level health checks. Automation can be triggered manually, on a schedule via EventBridge, or in response to CloudWatch alarms. **State Manager** enforces desired state on EC2 instances — ensuring the CloudWatch agent is installed, a specific software version is present, or a configuration file has the correct contents — and continuously reapplies the desired state if drift occurs.

**OpsCenter** provides a centralized view of operational issues (OpsItems) aggregated from CloudWatch alarms, Security Hub findings, Config rule violations, and EventBridge events. It functions as a lightweight operational ticketing system where engineers can track and resolve infrastructure issues without leaving the AWS console.`,
      quiz: [
        {
          question:
            "An operations team needs to run a security script on all EC2 instances tagged `Environment=prod` without logging into each instance. Which SSM feature is designed for this?",
          options: [
            "Session Manager with a script attachment",
            "Run Command, targeting instances by tag and recording output to S3 or CloudWatch Logs",
            "State Manager with a script-based desired state document",
            "Patch Manager with a custom patch baseline containing the security script",
          ],
          correctIndex: 1,
          explanation:
            "Run Command executes shell scripts or PowerShell commands on EC2 instances at scale without SSH. You can target instances by tag (e.g., `Environment=prod`), by ID, or by resource group, and command output is recorded to S3 or CloudWatch Logs. It is the standard mechanism for running one-time operational scripts across a fleet.",
        },
        {
          question:
            "A compliance team wants to ensure the CloudWatch agent is always installed and running on every EC2 instance, and automatically re-install it if drift is detected. Which SSM feature enforces this continuous desired state?",
          options: [
            "State Manager, which continuously enforces desired state and reapplies it when drift is detected",
            "Automation runbooks triggered by CloudWatch alarms when the agent stops sending metrics",
            "Run Command scheduled with EventBridge to check every hour",
            "Patch Manager with a custom baseline that includes the CloudWatch agent package",
          ],
          correctIndex: 0,
          explanation:
            "State Manager is designed for continuous desired state enforcement. You define an association that specifies the desired state (e.g., CloudWatch agent installed and running), and State Manager applies it on a schedule and re-applies it whenever drift is detected. Run Command is for one-time execution; Patch Manager is for OS patch management.",
        },
        {
          question:
            "Which SSM feature provides a centralized operational view of issues aggregated from CloudWatch alarms, Security Hub findings, and Config rule violations, functioning as a lightweight ticketing system?",
          options: [
            "Systems Manager Explorer",
            "Systems Manager OpsCenter",
            "CloudWatch ServiceLens",
            "AWS Health Dashboard",
          ],
          correctIndex: 1,
          explanation:
            "OpsCenter aggregates operational issues (OpsItems) from CloudWatch alarms, Security Hub findings, Config rule violations, and EventBridge events into a single view. Engineers can track, investigate, and resolve infrastructure issues through OpsItems without leaving the AWS console. It functions as a lightweight operational ticketing system integrated with the broader AWS service ecosystem.",
        },
      ],
    },
    {
      heading: "Systems Manager with Other Services",
      body: `**SSM + Lambda** is the most common developer integration. Lambda functions retrieve Parameter Store values using \`GetParameter\` or \`GetParametersByPath\` at initialization time and cache them in module-level variables. For SecureString parameters, the Lambda execution role needs \`ssm:GetParameters\` and \`kms:Decrypt\`. The Lambda extension for Parameter Store makes this even simpler — parameters are available at a local HTTP endpoint without any SDK calls in the function code.

**SSM + ECS** uses the task definition's \`secrets\` field to reference Parameter Store parameters directly. ECS fetches the values at task launch time and injects them as environment variables. The task execution role needs \`ssm:GetParameters\` permission. This keeps sensitive configuration out of your container images and Dockerfiles, and updating a Parameter Store value is reflected in the next task launch without rebuilding the image.

**SSM + CloudFormation** uses dynamic references to embed Parameter Store values in CloudFormation templates at deploy time: \`{{resolve:ssm:/myapp/param}}\` fetches the current value of that parameter. The \`AWS::SSM::Parameter::Value<String>\` type in the Parameters section lets you declare SSM parameters as CloudFormation inputs, making templates environment-aware without hardcoding values.

**SSM + CodeBuild** references Parameter Store parameters in the \`env\` section of \`buildspec.yml\`, fetching them at build time. This keeps environment-specific configuration (API endpoints, artifact bucket names) out of the buildspec itself and in Parameter Store where they can be managed independently. **SSM + EventBridge** enables reactive workflows: Parameter Store publishes change events to EventBridge when parameter values are updated, allowing you to trigger Lambda or Step Functions workflows when a feature flag is toggled or a configuration value changes — useful for automated rollout coordination and change tracking.`,
      quiz: [
        {
          question:
            "An ECS task definition needs to inject a database password from Parameter Store as an environment variable at task launch time without hardcoding it in the image. Which ECS task definition field and IAM permission are required?",
          options: [
            "The `environment` field referencing the parameter ARN; the task role needs `ssm:GetParameter`",
            "The `secrets` field referencing the parameter ARN; the task execution role needs `ssm:GetParameters`",
            "The `environmentFiles` field pointing to a Parameter Store path; no extra IAM is needed",
            "The `volumes` field mounting a Parameter Store path into the container filesystem",
          ],
          correctIndex: 1,
          explanation:
            "The ECS task definition's `secrets` field is used to inject Parameter Store values (and Secrets Manager secrets) as environment variables. ECS fetches the values at task launch time using the task execution role, which needs `ssm:GetParameters` permission. The `environment` field is for plaintext key-value pairs hardcoded in the task definition.",
        },
        {
          question:
            "A CloudFormation template needs to read the current value of a Parameter Store parameter at deployment time without hardcoding the value. Which dynamic reference syntax achieves this?",
          options: [
            "`!Ref /myapp/prod/param` — the CloudFormation Ref function resolves SSM paths",
            "`Fn::ImportValue: /myapp/prod/param` — cross-stack exports work with Parameter Store paths",
            "`{{resolve:ssm:/myapp/prod/param}}` — the SSM dynamic reference fetches the value at deploy time",
            "`${ssm:/myapp/prod/param}` — the shell variable syntax is supported in CloudFormation",
          ],
          correctIndex: 2,
          explanation:
            "CloudFormation dynamic references use the syntax `{{resolve:ssm:/path/to/parameter}}` to fetch the current value of a Parameter Store parameter at deployment time. For SecureString parameters, use `{{resolve:ssm-secure:/path}}`. This keeps environment-specific values out of templates and allows the same template to deploy differently across environments.",
        },
        {
          question:
            "A team wants a Lambda function to be invoked automatically whenever the value of a specific Parameter Store parameter changes (e.g., a feature flag is toggled). Which AWS service integration enables this reactive pattern?",
          options: [
            "CloudWatch alarms monitoring the parameter's access metrics",
            "Parameter Store supports Lambda triggers directly, similar to DynamoDB Streams",
            "Parameter Store publishes change events to EventBridge, which can trigger a Lambda function rule",
            "Lambda must poll Parameter Store on a schedule using CloudWatch Events",
          ],
          correctIndex: 2,
          explanation:
            "Parameter Store publishes change events (parameter created, updated, deleted) to Amazon EventBridge. You can create an EventBridge rule that matches these events and targets a Lambda function, enabling reactive workflows when configuration values change. This is how you implement automated rollout coordination when a feature flag is toggled.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A developer needs to store a plain-text application version number and a KMS-encrypted database password in Parameter Store. Which parameter types should they use for each?",
      options: [
        "String for the version number; SecureString for the database password",
        "String for both — Parameter Store encrypts all parameters at rest automatically",
        "SecureString for both — all production parameters should be encrypted",
        "StringList for the version number; SecureString for the database password",
      ],
      correctIndex: 0,
      explanation:
        "String parameters store plaintext and are appropriate for non-sensitive values like version numbers, endpoint URLs, and feature flags. SecureString parameters are encrypted with KMS and are the correct choice for sensitive values like database passwords. There is no reason to encrypt a plaintext version number, and doing so adds unnecessary KMS API call costs.",
    },
    {
      question:
        "A team is deciding between Parameter Store and Secrets Manager for their RDS database credentials. The credentials must rotate automatically every 90 days. Which service should they choose and why?",
      options: [
        "Parameter Store Advanced tier, because parameter policies support automatic expiration",
        "Parameter Store SecureString, because KMS encryption satisfies the rotation requirement",
        "Either service; both support automatic rotation with the same configuration effort",
        "Secrets Manager, because it provides built-in automatic rotation for RDS with managed Lambda rotation functions",
      ],
      correctIndex: 3,
      explanation:
        "Secrets Manager is the correct choice when automatic rotation is required. It provides built-in managed rotation Lambda functions for RDS, Redshift, DocumentDB, and ElastiCache that handle the full rotation lifecycle automatically. Parameter Store has no native automatic rotation capability — Advanced tier parameter policies support expiration notifications and auto-deletion, but not credential rotation.",
    },
    {
      question:
        "An EC2 instance needs to use Session Manager but cannot establish a session. The SSM agent is installed and running. What is the most likely missing configuration?",
      options: [
        "Port 22 is not open in the security group",
        "The instance does not have an IAM instance profile with the AmazonSSMManagedInstanceCore policy",
        "The instance is in a private subnet without an internet gateway",
        "Session Manager requires an SSH key pair to be configured on the instance",
      ],
      correctIndex: 1,
      explanation:
        "The SSM agent communicates with the SSM service over outbound HTTPS, so no inbound ports or internet gateway are required for Session Manager. The most common cause of session failure when the agent is running is a missing or incorrect IAM instance profile — the instance needs `AmazonSSMManagedInstanceCore` (or equivalent permissions) to register with the SSM service.",
    },
    {
      question:
        "AppConfig's Lambda Extension caches configuration locally. What is the primary operational benefit of this caching approach?",
      options: [
        "It encrypts configuration values at rest within the Lambda execution environment",
        "It prevents configuration changes from taking effect until the Lambda function is redeployed",
        "It eliminates per-invocation AppConfig API calls, reducing latency and cost while still polling for updates in the background",
        "It stores configuration in the Lambda deployment package, making cold starts faster",
      ],
      correctIndex: 2,
      explanation:
        "The Lambda Extension serves cached configuration from a local HTTP endpoint (`localhost:2772`), so each function invocation reads configuration without making an AppConfig API call. The extension polls AppConfig in the background and updates the cache when changes are deployed, ensuring the function picks up new configuration within the polling interval without per-invocation API costs.",
    },
    {
      question:
        "A CloudFormation stack needs different parameter values for dev, staging, and prod environments without duplicating template code. Which approach uses Parameter Store to achieve environment-aware templates?",
      options: [
        "Create three separate CloudFormation templates, each with hardcoded values for its environment",
        "Use CloudFormation dynamic references (`{{resolve:ssm:/myapp/{env}/param}}`) to fetch environment-specific values from Parameter Store at deploy time",
        "Use CloudFormation cross-stack outputs to share parameter values between stacks",
        "Store all environment values in CloudFormation template parameters and pass them at deploy time",
      ],
      correctIndex: 1,
      explanation:
        "CloudFormation dynamic references with the `{{resolve:ssm:path}}` syntax fetch the current value from Parameter Store at deployment time. By organizing parameters in environment-specific paths (e.g., `/myapp/prod/dbHost` vs `/myapp/dev/dbHost`), the same template can be deployed to multiple environments by pointing to different Parameter Store hierarchies, without duplicating template code.",
    },
    {
      question:
        "A Run Command execution needs to target all EC2 instances in the production environment. Which targeting method achieves this without specifying individual instance IDs?",
      options: [
        "Use an SSM Resource Group or target by tag (e.g., `Environment=prod`) to select all matching instances",
        "Create an SSM Automation runbook that discovers instances and passes them to Run Command",
        "Use a CloudWatch alarm to trigger Run Command across all instances simultaneously",
        "Run Command does not support bulk targeting — instance IDs must be specified individually",
      ],
      correctIndex: 0,
      explanation:
        "Run Command supports targeting instances by tag key-value pairs (e.g., `Environment=prod`), by resource group, or by individual instance IDs. Tag-based targeting is the most practical approach for fleet operations because it automatically includes new instances that have the tag and excludes terminated instances, without requiring the command to be updated each time the fleet changes.",
    },
    {
      question:
        "A Lambda function reads a SecureString parameter from Parameter Store. Which two IAM permissions does the execution role require?",
      options: [
        "`ssm:GetParameter` only — KMS decryption is handled transparently by SSM",
        "`ssm:GetParameter` and `ssm:PutParameter`",
        "`ssm:DescribeParameters` and `kms:GenerateDataKey`",
        "`ssm:GetParameter` and `kms:Decrypt`",
      ],
      correctIndex: 3,
      explanation:
        "Reading a SecureString parameter requires two permissions: `ssm:GetParameters` (to fetch the encrypted value from Parameter Store) and `kms:Decrypt` (to decrypt the value using the KMS key that encrypted it). Without `kms:Decrypt`, the API call will fail with an access denied error from KMS even though the SSM permission is present.",
    },
    {
      question:
        "Which AppConfig deployment strategy should a team use when they want to apply a configuration change to all clients simultaneously with no gradual rollout?",
      options: [
        "Exponential — starts small and increases, reaching 100% at the end",
        "Canary — tests with 10% of clients before full deployment",
        "Linear — applies changes at a fixed rate across the deployment window",
        "AllAtOnce — immediately applies the new configuration to all polling clients",
      ],
      correctIndex: 3,
      explanation:
        "The AllAtOnce deployment strategy applies the new configuration immediately to all clients on their next poll. It is appropriate when the change is low-risk and a gradual rollout is not needed. Linear and Exponential strategies spread the change over time, which is useful for higher-risk changes where you want to detect problems before all clients are affected.",
    },
  ],
};
