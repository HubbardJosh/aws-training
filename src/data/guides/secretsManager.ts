import { ServiceGuide } from "../../types/guide";

export const secretsManagerGuide: ServiceGuide = {
  id: "aws-secrets-manager",
  service: "AWS Secrets Manager",
  domain: "security",
  tagline: "Centrally manage and rotate secrets throughout their lifecycle",
  intro:
    "Secrets Manager stores, retrieves, rotates, and audits secrets (database passwords, API keys, OAuth tokens) throughout their lifecycle. It eliminates hard-coded credentials and automates rotation with no application changes.",

  sections: [
    {
      heading: "Core Concepts",
      body: `**Secret**: a protected piece of configuration data. Stored as encrypted key-value pairs (JSON) or plain text. Each secret has a unique ARN and optional human-friendly name.

**Secret value**: the actual credentials. Stored as a JSON string (recommended for structured data):
\`\`\`
{
  "username": "admin",
  "password": "s3cr3t",
  "host": "db.example.com",
  "port": 5432
}
\`\`\`

**Versioning**: Secrets Manager versions each value. Labels (staging labels) track versions:
- \`AWSCURRENT\`: the active version fetched by default
- \`AWSPENDING\`: used during rotation (new version before it becomes current)
- \`AWSPREVIOUS\`: the most recently replaced version

**Cost**: **$0.40/secret/month** + $0.05 per 10,000 API calls. Replicated secrets in other regions cost $0.40/region/month each.`,
    },
    {
      heading: "Automatic Rotation",
      body: `Secrets Manager rotates secrets automatically using a **Lambda function**. Built-in Lambda functions exist for:
- Amazon RDS (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB)
- Amazon Redshift
- Amazon DocumentDB
- Amazon ElastiCache

**Rotation schedule**: set interval (e.g. every 30 days) or cron expression. Secrets Manager invokes the Lambda at the scheduled time.

**Rotation Lambda phases** (called sequentially):
1. **createSecret**: generate a new credential in \`AWSPENDING\`
2. **setSecret**: set the new credential on the database/service
3. **testSecret**: test that \`AWSPENDING\` works
4. **finishSecret**: move \`AWSPENDING\` to \`AWSCURRENT\`; old version moves to \`AWSPREVIOUS\`

**During rotation**: the old password (\`AWSCURRENT\`) remains valid while \`AWSPENDING\` is being set and tested. After finishSecret, the old password is no longer the active version.

**Application handling during rotation**: applications that cache the secret may get a stale password. **Retry pattern**: if authentication fails, call GetSecretValue again to refresh. The AWS Secrets Manager caching client (for Java, Python, Go, .NET) handles this automatically.`,
    },
    {
      heading: "Accessing Secrets",
      body: `**GetSecretValue API**: primary way to retrieve a secret. Returns the current version (\`AWSCURRENT\`) by default.
\`\`\`
secretsmanager:GetSecretValue(SecretId="arn:aws:secretsmanager:...")
\`\`\`
The calling principal must have \`secretsmanager:GetSecretValue\` permission on the secret ARN.

**Caching**: avoid calling GetSecretValue on every request — cache the value in memory. Use the AWS Secrets Manager caching client which:
- Caches the secret value
- Automatically refreshes if authentication fails (rotation detection)
- Configurable cache TTL (default: 1 hour)

**Lambda with Secrets Manager**: call GetSecretValue in the init code (outside handler) and cache. If authentication fails inside the handler, refresh the cache and retry once.

**ECS with Secrets Manager**: reference secrets in task definition's \`secrets\` field. ECS retrieves the secret at task launch and injects as environment variable. The task execution role (not the task role) needs \`secretsmanager:GetSecretValue\`.

**SDK integration**: all major AWS SDKs support GetSecretValue. Parse the JSON string to extract individual fields.`,
    },
    {
      heading: "Secret Policies & Access Control",
      body: `**Resource-based policy**: attach a JSON policy to the secret to grant cross-account access or restrict which principals can access it.

**IAM policy**: grant \`secretsmanager:GetSecretValue\` (and other actions) in the principal's IAM policy.

**Both are needed for cross-account**: secret's resource policy must allow the external account, and the external account's IAM policy must allow the secret ARN.

**Condition keys**:
- \`secretsmanager:SecretId\`: restrict to specific secrets
- \`secretsmanager:ResourceTag/tag-key\`: restrict by tag (ABAC)
- \`secretsmanager:VersionStage\`: restrict to specific version stages

**Actions**: \`secretsmanager:GetSecretValue\`, \`secretsmanager:PutSecretValue\`, \`secretsmanager:RotateSecret\`, \`secretsmanager:DeleteSecret\`, \`secretsmanager:DescribeSecret\`.`,
    },
    {
      heading: "Secrets Manager vs SSM Parameter Store",
      body: `**Secrets Manager**:
- Built-in automatic rotation with Lambda
- Cross-account sharing
- $0.40/secret/month
- Designed for secrets (passwords, API keys, OAuth tokens)
- Versioning with staging labels
- Audit with CloudTrail

**SSM Parameter Store — Standard**:
- Free for standard parameters
- 4 KB value limit
- No automatic rotation (can trigger rotation via EventBridge + Lambda)
- No cross-account access natively
- Good for: config values, feature flags, non-sensitive settings

**SSM Parameter Store — Advanced**:
- $0.05 per parameter per month
- 8 KB value limit
- Parameter policies (expiration, notification)
- Still no built-in rotation

**Decision guide**:
- Need automatic rotation → Secrets Manager
- Need cross-account access → Secrets Manager
- Simple config or non-sensitive data → SSM Parameter Store (free)
- Cost-sensitive, many parameters → SSM Parameter Store
- DB credentials in production → Secrets Manager

**SecureString parameters** in SSM: encrypted with KMS. Used for sensitive config. Not a replacement for Secrets Manager but useful for infrastructure automation.`,
    },
    {
      heading: "Multi-Region Secrets",
      body: `Secrets Manager replicates secrets to other regions. The primary region holds the source; replicas are read-only and sync automatically.

**Use cases**: multi-region applications (read secret from local region), disaster recovery (promote replica to primary if region fails).

**Rotation**: only the primary secret rotates. Replicas sync the new value automatically.

**Cost**: $0.40/secret/month per replica region.`,
    },
    {
      heading: "Secrets Manager with Other Services",
      body: `**Secrets Manager + Lambda**: fetch DB credentials at init time, cache, retry on auth failure. Eliminates hard-coded credentials in code or environment variables.

**Secrets Manager + ECS/Fargate**: inject secrets as environment variables via task definition. Application reads standard env vars — no SDK code needed.

**Secrets Manager + RDS**: tight integration for DB credential rotation. Built-in Lambda rotates RDS passwords and updates the secret automatically.

**Secrets Manager + CodeBuild**: reference secrets in buildspec.yml environment variables. CodeBuild fetches at build time.

**Secrets Manager + CloudFormation**: resolve secrets in CloudFormation templates using dynamic references: \`{{resolve:secretsmanager:MySecret:SecretString:password}}\`.

**Secrets Manager + KMS**: all secrets encrypted at rest with KMS (AWS managed key by default, or your CMK). GetSecretValue calls KMS Decrypt internally.

**Secrets Manager + CloudTrail**: all API calls logged. Monitor for unauthorized access to sensitive secrets.`,
    },
  ],

  keyFacts: [
    "Cost: $0.40/secret/month + $0.05/10,000 API calls",
    "Rotation Lambda phases: createSecret → setSecret → testSecret → finishSecret",
    "AWSCURRENT: active version; AWSPENDING: during rotation; AWSPREVIOUS: prior version",
    "Cache secrets to avoid per-request API calls; retry on auth failure to detect rotation",
    "ECS: secretsmanager ref in task definition; task execution role needs GetSecretValue",
    "SSM Parameter Store Standard: free, 4 KB, no auto-rotation",
    "SSM Parameter Store Advanced: $0.05/param/month, 8 KB",
    "Multi-region: replicas sync automatically; primary rotates",
    "CloudFormation dynamic reference: {{resolve:secretsmanager:SecretName:SecretString:key}}",
    "KMS encrypts all secrets at rest (AWS managed key by default)",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon RDS",
    "Amazon ECS",
    "AWS KMS",
    "AWS CloudTrail",
    "AWS Systems Manager",
    "AWS CodeBuild",
    "AWS CloudFormation",
    "AWS IAM",
  ],

  examTips: [
    "Secrets Manager = auto-rotation + cross-account. SSM Parameter Store = free + config values.",
    "Cache the secret + retry on auth failure to handle rotation transparently.",
    "ECS task definition: secrets field uses task execution role, not task role.",
    "Rotation Lambda called 4 times: createSecret, setSecret, testSecret, finishSecret.",
    "CloudFormation resolve syntax: {{resolve:secretsmanager:name:SecretString:field}}.",
    "Cross-account: resource policy on secret + IAM policy in target account.",
    "AWSCURRENT is fetched by default; AWSPENDING is the new value during rotation.",
    "Secrets Manager encrypts with KMS; GetSecretValue internally calls KMS Decrypt.",
  ],
};
