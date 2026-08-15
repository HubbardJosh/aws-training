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
      body: `**Parameter Store** stores configuration data and secrets as key-value pairs. Hierarchical naming for organization.

**Parameter types**:
- **String**: plain text value. No encryption.
- **StringList**: comma-delimited list of strings.
- **SecureString**: encrypted with KMS. Use for sensitive data (passwords, API keys).

**Parameter tiers**:
- *Standard*: free. Up to 10,000 parameters. 4 KB value size. No parameter policies.
- *Advanced*: $0.05/parameter/month. Up to 100,000 parameters. 8 KB value size. Parameter policies (expiration, notification).

**Hierarchical paths**: organize by application and environment:
\`\`\`
/myapp/prod/database/password
/myapp/prod/api/endpoint
/myapp/dev/database/password
\`\`\`

**GetParametersByPath**: retrieve all parameters under a path prefix in one API call.

**Versioning**: every update creates a new version. Retrieve specific version or latest.

**Cross-account**: parameters are account-scoped; no native cross-account sharing (unlike Secrets Manager).

**CloudFormation integration**: \`{{resolve:ssm:/myapp/param}}\` fetches at deploy time. Parameter type \`AWS::SSM::Parameter::Value<String>\` in template Parameters section.

**Lambda integration**: fetch parameters with SDK. Or use the **SSM Parameter Store extension for Lambda** — a Lambda extension that caches parameters locally, reducing API calls. Specify parameters via environment variable.`,
    },
    {
      heading: "Parameter Store vs Secrets Manager",
      body: `**Use Parameter Store when**:
- Storing non-sensitive configuration (feature flags, endpoints, version numbers)
- Cost is a concern (standard tier is free)
- You don't need automatic rotation
- Simple key-value config for Lambda/ECS/EC2

**Use Secrets Manager when**:
- Need automatic secret rotation (database passwords, API keys)
- Need cross-account access to secrets
- Storing database credentials that rotate
- Audit trail of every secret access is required (CloudTrail)
- Willing to pay $0.40/secret/month

**SecureString parameter vs Secrets Manager secret**:
- SecureString: encrypted with KMS, stored in Parameter Store, no rotation, $0 standard tier
- Secrets Manager: auto-rotation via Lambda, cross-account, $0.40/month, CloudTrail integration

**Both work with**: Lambda environment variables (reference), ECS task definition secrets injection, CloudFormation dynamic references, CodeBuild environment variables.`,
    },
    {
      heading: "Session Manager",
      body: `**Session Manager**: secure, browser-based or CLI shell access to EC2 instances (and on-premises servers) without:
- SSH keys
- Bastion hosts
- Open inbound ports (no port 22 needed)
- VPC internet connectivity

**How it works**:
1. SSM Agent running on EC2 instance (pre-installed on Amazon Linux 2, Windows Server AMIs)
2. Instance requires IAM instance profile with SSM permissions (\`AmazonSSMManagedInstanceCore\` policy)
3. User opens session via AWS console, CLI (\`aws ssm start-session\`), or VS Code extension
4. Traffic routed through SSM service (outbound HTTPS from instance to SSM endpoint)

**Port forwarding**: tunnel local port to a remote port on the instance:
\`\`\`
aws ssm start-session --target i-1234567890 \\
  --document-name AWS-StartPortForwardingSession \\
  --parameters portNumber=5432,localPortNumber=5432
\`\`\`
Use to connect to RDS or other private resources through an EC2 jump box — without opening security group ports.

**Session logging**: all session activity logged to S3 or CloudWatch Logs. Required for compliance.

**IAM control**: restrict which instances users can access via IAM policy conditions (\`ssm:resourceTag/Env: prod\`).`,
    },
    {
      heading: "AppConfig",
      body: `**AppConfig** manages application configuration separately from code deployments. Change feature flags, toggle features, adjust thresholds without redeploying.

**Key concepts**:
- **Application**: logical grouping (e.g. "OrderService")
- **Environment**: deployment target (dev, staging, prod)
- **Configuration Profile**: the config data source. Types:
  - *Freeform*: arbitrary JSON/YAML/text stored in AppConfig
  - *Feature flag*: structured boolean flags with typed attributes
  - *SSM Parameter*: reference a Parameter Store value
  - *S3*: reference a file in S3
- **Deployment Strategy**: controls how config is rolled out (immediate, linear, exponential)

**Deployment Strategies**:
- AllAtOnce: immediate, all clients get new config at once
- Linear: roll out gradually over time (e.g. 20% per 5 minutes)
- Exponential: small % first, then increasing (canary-like)

**Validators**: AppConfig validates config before deployment:
- JSON Schema validator: validates JSON structure and types
- Lambda validator: custom validation logic

**AppConfig Agent / Lambda extension**: a sidecar/extension that caches config locally and polls for updates. Your app reads from local HTTP endpoint (\`localhost:2772/applications/App/environments/Env/configurations/Config\`). Reduces API calls.

**Use cases**: feature flags, killswitches, A/B testing configuration, rate limit thresholds, maintenance mode toggles.`,
    },
    {
      heading: "Other SSM Features",
      body: `**Run Command**: run shell scripts or PowerShell on EC2 instances at scale. No SSH needed. Target by instance ID, tag, or resource group. Results logged to S3/CloudWatch.

**Patch Manager**: automate OS patching across EC2 instances. Define patch baselines (approved/rejected patches), maintenance windows. Patch instances without SSHing.

**Maintenance Windows**: define scheduled windows for operations (patching, Run Command, automation). Prevent changes during business hours.

**State Manager**: define desired state for EC2 instances (e.g. CW agent installed, software version). Continuously ensures instances match desired state.

**Inventory**: collect software, instance metadata, network config from instances. View in console or query with Athena.

**Automation**: run operational runbooks (pre-built or custom) on AWS resources. Create AMIs, patch instances, remediate compliance issues. Triggered manually, by EventBridge, or CloudWatch alarm.

**OpsCenter**: centralized view of operational issues (OpsItems). Integrates with CloudWatch alarms, EventBridge, Config rules. Similar to a lightweight ticketing system for AWS ops.`,
    },
    {
      heading: "Systems Manager with Other Services",
      body: `**SSM + Lambda**: Lambda reads parameters from Parameter Store using SDK or Lambda extension. Use SecureString for DB passwords (KMS-encrypted). Use GetParametersByPath for all config in one call.

**SSM + ECS**: ECS task definition \`secrets\` field references Parameter Store parameters. ECS fetches at task launch and injects as environment variables. Task execution role needs \`ssm:GetParameters\`.

**SSM + CloudFormation**: dynamic references \`{{resolve:ssm:/path/to/param}}\` fetch live values at deploy. Parameter type \`AWS::SSM::Parameter::Value\` for parameterized templates.

**SSM + CodeBuild**: reference Parameter Store params and Secrets Manager secrets in \`env\` section of buildspec.yml. CodeBuild fetches at build time.

**SSM + EC2**: Session Manager eliminates bastion hosts. Patch Manager automates OS updates. Run Command runs scripts across fleet. Instance profile provides SSM access.

**SSM + EventBridge**: Parameter Store changes emit events. EventBridge rule triggers Lambda or Step Functions when a parameter value changes (e.g. feature flag toggled).

**SSM + AppConfig + Lambda**: Lambda extension polls AppConfig for config changes. App reads from local endpoint. No restart needed when config changes — extension picks up new values on next poll.`,
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
