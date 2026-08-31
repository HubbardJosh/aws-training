import { ServiceGuide } from "../../../types/guide";

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
      body: `Secrets Manager stores sensitive configuration values as **secrets** — encrypted key-value pairs (stored as JSON) or plain text strings, each with a unique ARN and optional human-readable name. The typical pattern for database credentials stores them as a JSON object:
\`\`\`
{
  "username": "admin",
  "password": "s3cr3t",
  "host": "db.example.com",
  "port": 5432
}
\`\`\`
This structured format lets your application parse the JSON and extract individual fields rather than treating the entire secret as an opaque string.

Secrets Manager versions every change to a secret's value, using **staging labels** to track which version is active. \`AWSCURRENT\` is the version returned by default when you call \`GetSecretValue\` without specifying a version. During rotation, \`AWSPENDING\` holds the new credential being set up before it becomes active. Once rotation completes, \`AWSPENDING\` becomes \`AWSCURRENT\` and the previous active version is labeled \`AWSPREVIOUS\`. Applications that always fetch \`AWSCURRENT\` automatically get the rotated credential without any code changes.

The cost model is straightforward: $0.40 per secret per month plus $0.05 per 10,000 API calls. Secrets replicated to other regions cost an additional $0.40 per region per month. For applications with many secrets or very high access rates, caching the secret value in memory (rather than calling \`GetSecretValue\` on every request) keeps API call costs manageable.`,
      quiz: [
        {
          question:
            "Which staging label does GetSecretValue return by default when no version is specified?",
          options: ["AWSLATEST", "AWSCURRENT", "AWSPENDING", "AWSPREVIOUS"],
          correctIndex: 1,
          explanation:
            "GetSecretValue returns the AWSCURRENT staging label by default — the currently active version of the secret. AWSPENDING holds the new value during rotation, and AWSPREVIOUS holds the prior active version after rotation completes.",
        },
        {
          question: "What is the cost model for AWS Secrets Manager?",
          options: [
            "$0.40 per secret per month plus $0.05 per 10,000 API calls",
            "$0.05 per secret per month with unlimited API calls",
            "Free for up to 10,000 secrets; $0.40/month per secret beyond that",
            "$0.40 per rotation event plus $0.01 per API call",
          ],
          correctIndex: 0,
          explanation:
            "Secrets Manager costs $0.40 per secret per month plus $0.05 per 10,000 API calls. Secrets replicated to other regions incur an additional $0.40 per region per month. Caching secret values in memory reduces API call costs.",
        },
      ],
    },
    {
      heading: "Automatic Rotation",
      body: `The most important capability that distinguishes Secrets Manager from simpler credential stores is **automatic rotation** — the ability to update a secret's value on a schedule without any manual intervention or application downtime.

Rotation is implemented through a **Lambda function** that Secrets Manager invokes at the configured interval (a fixed number of days or a cron expression). Secrets Manager provides built-in Lambda functions for the most common cases: Amazon RDS (MySQL, PostgreSQL, Oracle, SQL Server, MariaDB), Amazon Redshift, Amazon DocumentDB, and Amazon ElastiCache. For custom rotation scenarios — third-party APIs, on-premises databases — you write your own rotation Lambda.

The rotation process follows four phases, with Secrets Manager calling your Lambda function once for each:

1. **createSecret** — the Lambda generates a new credential and stores it as \`AWSPENDING\`.
2. **setSecret** — the Lambda sets the new credential on the actual database or service (so both old and new passwords are currently valid).
3. **testSecret** — the Lambda verifies that \`AWSPENDING\` works correctly by authenticating with it.
4. **finishSecret** — Secrets Manager promotes \`AWSPENDING\` to \`AWSCURRENT\` and labels the old version \`AWSPREVIOUS\`.

During the rotation window, both the old and new passwords are valid, which means applications using the old password continue to work through the transition. The only edge case is applications that **cache** the secret value without refreshing it. If an application caches the password and the rotation completes, the next authentication with the cached old password will fail. The correct pattern is to catch authentication failures, call \`GetSecretValue\` to refresh the cached value, and retry the authentication once.`,
      quiz: [
        {
          question:
            "In what order does Secrets Manager invoke the rotation Lambda function phases?",
          options: [
            "createSecret → setSecret → testSecret → finishSecret",
            "setSecret → createSecret → testSecret → finishSecret",
            "createSecret → testSecret → setSecret → finishSecret",
            "generateSecret → validateSecret → applySecret → confirmSecret",
          ],
          correctIndex: 0,
          explanation:
            "The four rotation phases in order are: createSecret (generate new credential as AWSPENDING), setSecret (apply new credential on the actual service), testSecret (verify AWSPENDING works), and finishSecret (promote AWSPENDING to AWSCURRENT).",
        },
        {
          question:
            "An application caches its database password and Secrets Manager rotates the secret. The next request fails with an authentication error. What should the application do?",
          options: [
            "Catch the auth failure, call GetSecretValue to refresh the cached value, then retry once",
            "Check AWSPREVIOUS staging label and fall back to the previous credential",
            "Wait 60 seconds for the old password to be re-enabled, then retry",
            "Retry immediately without refreshing — the rotation may not have completed",
          ],
          correctIndex: 0,
          explanation:
            "The correct pattern for cached secrets is: catch authentication failure → call GetSecretValue to refresh the cache → retry authentication once. This handles rotation transparently. Retrying without refreshing will fail again with the same stale credential.",
        },
      ],
    },
    {
      heading: "Accessing Secrets",
      body: `The primary API for reading a secret is \`GetSecretValue\`, which returns the \`AWSCURRENT\` version by default. The calling principal needs \`secretsmanager:GetSecretValue\` permission on the secret's ARN in their IAM policy.

Because API calls have both latency and cost implications, the recommended approach is to cache the secret value in your application's memory rather than calling \`GetSecretValue\` on every request. The AWS Secrets Manager caching client (available for Java, Python, Go, and .NET) handles caching automatically, with a configurable TTL (defaulting to one hour) and an important behavior: if authentication with the cached credential fails, the client automatically refreshes the cache and retries — detecting rotation transparently without application logic.

For **Lambda functions**, the pattern is to call \`GetSecretValue\` during initialization (outside the handler function) and store the credential in a module-level variable. This executes once per container lifecycle, not once per invocation, keeping both latency and API call costs low. If authentication fails inside the handler (indicating rotation occurred), refresh the cached value and retry once.

**ECS and Fargate** tasks have an even simpler integration: reference secrets in the task definition's \`secrets\` field by name or ARN, and ECS fetches and decrypts them at task launch time, injecting them as environment variables. Your application reads standard environment variables — no SDK code, no caching logic, no credential management needed. The **task execution role** (not the task role) needs \`secretsmanager:GetSecretValue\` permission, since it's the ECS infrastructure making the call on the task's behalf, not the application code.`,
      quiz: [
        {
          question:
            "In an ECS Fargate task definition that references Secrets Manager secrets, which IAM role needs the secretsmanager:GetSecretValue permission?",
          options: [
            "The container instance role",
            "The ECS service-linked role",
            "The task execution role (used by ECS infrastructure at task launch)",
            "The task role (used by application code at runtime)",
          ],
          correctIndex: 2,
          explanation:
            "The task execution role needs secretsmanager:GetSecretValue. This role is used by the ECS infrastructure (not the application) to fetch secrets at task launch time and inject them as environment variables. The task role is what application code uses for AWS API calls during runtime.",
        },
        {
          question:
            "Where should a Lambda function call GetSecretValue to minimize API calls and latency?",
          options: [
            "Inside the handler on every invocation to always get the freshest value",
            "Outside the handler during initialization, storing the result in a module-level variable",
            "In a separate background thread that refreshes every 5 minutes",
            "Only when the function is first deployed, baking the value into the deployment package",
          ],
          correctIndex: 1,
          explanation:
            "Calling GetSecretValue outside the handler during initialization stores the credential in a module-level variable that persists across invocations on the same container. This executes once per container lifecycle, not once per invocation, minimizing API calls and latency.",
        },
      ],
    },
    {
      heading: "Secret Policies & Access Control",
      body: `Access to a Secrets Manager secret is controlled through two complementary mechanisms that both need to allow the access for a request to succeed.

The **resource-based policy** attached directly to the secret specifies which principals can perform which actions on that secret. This is required for cross-account access: without a resource policy that explicitly allows the external account's principal, no IAM policy in that account can grant access, regardless of how permissive it is. The **IAM identity policy** on the calling principal must also grant the relevant \`secretsmanager:\` actions on the secret's ARN. For same-account access, the resource policy is optional — IAM policies alone can grant access — but it's sometimes used to restrict which services or roles within the same account can access a particularly sensitive secret.

Useful condition keys for fine-grained control include \`secretsmanager:SecretId\` (restricting access to specific secrets by ARN or name), \`secretsmanager:ResourceTag/tag-key\` (attribute-based access control using tags), and \`secretsmanager:VersionStage\` (restricting access to specific staging labels, so one role can only access \`AWSCURRENT\` while the rotation Lambda can access \`AWSPENDING\`).

The key actions to know are \`secretsmanager:GetSecretValue\` (read the current value), \`secretsmanager:PutSecretValue\` (write a new value), \`secretsmanager:RotateSecret\` (trigger rotation), \`secretsmanager:DeleteSecret\` (delete the secret, with a recovery window), and \`secretsmanager:DescribeSecret\` (read metadata without reading the value).`,
      quiz: [
        {
          question:
            "A Lambda in Account B needs to read a secret stored in Account A's Secrets Manager. What is required to enable this cross-account access?",
          options: [
            "Only an IAM policy in Account B granting GetSecretValue on the secret ARN",
            "A resource-based policy on the secret in Account A allowing Account B's principal, plus an IAM policy in Account B",
            "Only a resource-based policy on the secret in Account A",
            "A VPC peering connection between accounts and an IAM role in Account A",
          ],
          correctIndex: 1,
          explanation:
            "Cross-account access requires both: (1) a resource-based policy on the secret in Account A explicitly allowing Account B's principal, AND (2) an IAM identity policy in Account B granting the secretsmanager:GetSecretValue action. Both must allow the access for the request to succeed.",
        },
        {
          question:
            "Which IAM condition key restricts a role to only access the AWSCURRENT version of a secret?",
          options: [
            "secretsmanager:SecretId",
            "secretsmanager:VersionStage",
            "secretsmanager:CurrentVersion",
            "secretsmanager:ResourceTag",
          ],
          correctIndex: 1,
          explanation:
            "The secretsmanager:VersionStage condition key restricts which staging labels a role can access. This lets you grant one role access only to AWSCURRENT (the active credential) while the rotation Lambda can access AWSPENDING (the new credential being set up).",
        },
      ],
    },
    {
      heading: "Secrets Manager vs SSM Parameter Store",
      body: `Both Secrets Manager and SSM Parameter Store can store sensitive configuration values, but they're designed for different use cases and the wrong choice creates either unnecessary cost or missing capabilities.

**Secrets Manager** is purpose-built for credentials that need to rotate. Its defining features are built-in automatic rotation with managed Lambda functions for common AWS services, native cross-account secret sharing, versioning with staging labels for zero-downtime rotation, and comprehensive CloudTrail auditing of every access. The cost — $0.40 per secret per month — is justified when you need these capabilities for database passwords, API keys, or OAuth tokens in production environments.

**SSM Parameter Store Standard** is free (up to 10,000 parameters with 4 KB values) and is appropriate for non-rotating configuration values: feature flags, environment-specific endpoints, application settings, and any sensitive-but-stable data where the free tier's simplicity outweighs Secrets Manager's capabilities. **SecureString** parameters are encrypted with KMS, making them suitable for passwords you manage manually without automated rotation. **SSM Parameter Store Advanced** costs $0.05 per parameter per month and supports 8 KB values and parameter policies (expiration notifications, auto-deletion) but still lacks built-in rotation.

The practical decision rule: if the secret needs to rotate automatically — especially database credentials in production — use Secrets Manager. For application configuration, feature flags, infrastructure parameters, and sensitive values that don't change often, Parameter Store is free and fully functional. Many production architectures use both: Secrets Manager for database credentials and API keys, Parameter Store for everything else.`,
      quiz: [
        {
          question:
            "A team stores feature flags and non-sensitive configuration values for their application. Which service is the most cost-effective choice?",
          options: [
            "SSM Parameter Store Standard — free for up to 10,000 parameters",
            "SSM Parameter Store Advanced — required for application configuration",
            "Secrets Manager — it supports any key-value data",
            "DynamoDB — provides lower latency than Parameter Store",
          ],
          correctIndex: 0,
          explanation:
            "SSM Parameter Store Standard is free for up to 10,000 parameters with values up to 4 KB. For non-sensitive configuration values and feature flags that don't need automatic rotation, it's the most cost-effective choice. Secrets Manager ($0.40/secret/month) is justified only when automatic rotation or cross-account access is required.",
        },
        {
          question:
            "Which capability does Secrets Manager have that SSM Parameter Store lacks?",
          options: [
            "Encryption at rest with KMS",
            "Integration with ECS task definitions",
            "CloudTrail auditing of API calls",
            "Built-in automatic credential rotation with managed Lambda functions",
          ],
          correctIndex: 3,
          explanation:
            "Secrets Manager's defining differentiator is built-in automatic rotation with managed Lambda functions for RDS, Redshift, DocumentDB, and ElastiCache. Parameter Store supports KMS encryption (SecureString), ECS injection, and CloudTrail auditing — but does not have built-in automatic rotation.",
        },
      ],
    },
    {
      heading: "Multi-Region Secrets",
      body: `Secrets Manager can replicate a secret to multiple regions, with the primary region holding the authoritative source and replica regions maintaining synchronized read-only copies. When the primary secret rotates, Secrets Manager automatically pushes the new value to all replicas, so applications in secondary regions always have the current credential without any additional orchestration.

The primary use cases for multi-region secrets are global applications that need to read credentials from their local region (reducing latency and avoiding cross-region API calls), and disaster recovery scenarios where you can promote a replica to become the new primary if the original region fails. Promotion makes the replica independent, at which point it becomes a fully writable secret in that region.

Each replica costs $0.40 per month per region, the same as the primary. Replication is configured per secret, so you can replicate only the secrets that global applications need rather than replicating your entire secrets inventory.`,
      quiz: [
        {
          question:
            "A global application runs in us-east-1 and eu-west-1. The database credential is stored in Secrets Manager in us-east-1. What happens to the replica in eu-west-1 when the primary secret rotates?",
          options: [
            "The replica continues to use the old credential until its own rotation schedule triggers",
            "The replica must be manually updated after the primary rotates",
            "Secrets Manager automatically pushes the new value to all replicas after rotation",
            "The replica is temporarily unavailable during the rotation window",
          ],
          correctIndex: 2,
          explanation:
            "When a primary secret rotates, Secrets Manager automatically pushes the updated value to all replica regions. Applications in secondary regions read from their local replica and always get the current credential without any additional orchestration.",
        },
      ],
    },
    {
      heading: "Secrets Manager with Other Services",
      body: `**Secrets Manager + Lambda** is the most common integration pattern for serverless applications. Lambda functions fetch database credentials or API keys at initialization time, cache them in module-level variables, and implement a refresh-on-auth-failure retry pattern. This eliminates hard-coded credentials from code, environment variable injection of sensitive values, and the operational burden of coordinating credential updates across deployed functions.

**Secrets Manager + ECS/Fargate** uses task definition secrets injection. The \`secrets\` field in the container definition specifies which Secrets Manager ARNs to fetch at task launch, and the container receives them as environment variables. Rotating a database password becomes entirely transparent to running tasks — old tasks continue using their injected credential until they're replaced by new task launches that pick up the updated secret automatically.

**Secrets Manager + RDS** provides the tightest integration: Secrets Manager's built-in RDS rotation Lambda handles both updating the RDS user's password and updating the secret value atomically, with no downtime. The Lambda performs all four rotation phases correctly, including the step where both old and new passwords are simultaneously valid.

**Secrets Manager + CloudFormation** supports dynamic references that inject secret values directly into CloudFormation resource properties at deploy time: \`{{resolve:secretsmanager:MySecret:SecretString:password}}\`. This is useful for resources that need credentials during stack creation, like RDS master passwords. **Secrets Manager + KMS** is automatic: every secret is encrypted at rest with KMS, using the AWS managed key by default or a CMK you specify. Every \`GetSecretValue\` call triggers a KMS \`Decrypt\` internally, which is logged in CloudTrail — providing a complete audit trail of who accessed which secret and when.`,
      quiz: [
        {
          question:
            "What is the correct CloudFormation dynamic reference syntax to inject a specific field from a Secrets Manager secret?",
          options: [
            "{{resolve:secretsmanager:MySecret:SecretString:password}}",
            "${ssm:/secrets/MySecret/password}",
            "!GetSecret MySecret password",
            "{{secretsmanager:resolve:MySecret.password}}",
          ],
          correctIndex: 0,
          explanation:
            "The CloudFormation dynamic reference syntax for Secrets Manager is {{resolve:secretsmanager:SecretName:SecretString:fieldName}}. This injects the specified JSON field from the secret value directly into the CloudFormation resource property at deploy time.",
        },
        {
          question:
            "Every GetSecretValue API call triggers which AWS service internally to decrypt the secret value?",
          options: [
            "AWS CloudHSM",
            "AWS Certificate Manager",
            "AWS IAM",
            "AWS KMS",
          ],
          correctIndex: 3,
          explanation:
            "Every secret in Secrets Manager is encrypted at rest with AWS KMS. When GetSecretValue is called, Secrets Manager internally calls KMS Decrypt to decrypt the secret value. This KMS call is logged in CloudTrail, providing a complete audit trail of every secret access.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A production database password must rotate automatically every 30 days with no application downtime. Which service should manage this credential?",
      options: [
        "AWS Secrets Manager with a built-in RDS rotation Lambda",
        "SSM Parameter Store SecureString with a custom EventBridge rotation rule",
        "AWS KMS with an automatic key rotation policy",
        "SSM Parameter Store Advanced with a parameter expiration policy",
      ],
      correctIndex: 0,
      explanation:
        "Secrets Manager is designed for automatic credential rotation. Its built-in RDS rotation Lambda handles all four rotation phases (createSecret, setSecret, testSecret, finishSecret) with no downtime, since both old and new passwords are valid during the rotation window.",
    },
    {
      question:
        "In the Secrets Manager rotation process, what does the 'setSecret' phase do?",
      options: [
        "Generates the new credential and stores it as AWSPENDING",
        "Sets the new credential on the actual database or service so both old and new passwords are valid",
        "Verifies the new credential works by authenticating with it",
        "Promotes AWSPENDING to AWSCURRENT and labels the old version AWSPREVIOUS",
      ],
      correctIndex: 1,
      explanation:
        "The setSecret phase applies the new credential to the actual database or service, making both the old and new passwords simultaneously valid during the rotation window. This ensures zero downtime for applications still using the old credential.",
    },
    {
      question:
        "A Lambda function caches a database password from Secrets Manager at initialization. After rotation, the next database connection fails. What is the correct recovery pattern?",
      options: [
        "Catch the auth failure, call GetSecretValue to refresh the cached value, then retry once",
        "Fall back to the AWSPREVIOUS staging label which still has a valid credential",
        "Wait 5 minutes for the old password to be re-activated, then retry",
        "Restart the Lambda function to force re-initialization with the new secret",
      ],
      correctIndex: 0,
      explanation:
        "The standard rotation-aware caching pattern is: catch auth failure → call GetSecretValue to refresh the cache → retry once. This detects rotation transparently without requiring application restarts or manual intervention.",
    },
    {
      question:
        "An ECS Fargate task references a Secrets Manager secret in its task definition. Which IAM role needs the secretsmanager:GetSecretValue permission?",
      options: [
        "The task role, which the application code uses at runtime",
        "The task execution role, which ECS uses to fetch secrets at task launch",
        "The ECS service-linked role",
        "The container instance profile",
      ],
      correctIndex: 1,
      explanation:
        "The task execution role needs secretsmanager:GetSecretValue. ECS infrastructure uses this role to fetch and decrypt secrets at task launch time, injecting them as environment variables. The task role is what the running application uses for its own AWS API calls.",
    },
    {
      question:
        "A developer needs to inject a database password from Secrets Manager into a CloudFormation resource property. Which syntax is correct?",
      options: [
        "!Ref secretsmanager:MySecret:password",
        "{{resolve:secretsmanager:MySecret:SecretString:password}}",
        "${secretsmanager:MySecret.password}",
        "{{ssm-secure:/MySecret/password}}",
      ],
      correctIndex: 1,
      explanation:
        "The CloudFormation dynamic reference syntax for Secrets Manager is {{resolve:secretsmanager:SecretName:SecretString:fieldName}}. This injects the specified field from the secret's JSON value directly into the resource property at deploy time.",
    },
    {
      question:
        "Which staging label holds the new credential being prepared during a Secrets Manager rotation?",
      options: ["AWSPENDING", "AWSCURRENT", "AWSNEW", "AWSPREVIOUS"],
      correctIndex: 0,
      explanation:
        "AWSPENDING holds the new credential being set up during rotation. After rotation completes, AWSPENDING is promoted to AWSCURRENT, and the previously active version receives the AWSPREVIOUS label.",
    },
    {
      question:
        "A company stores feature flags and non-sensitive endpoint URLs for their microservices. Which service is the most cost-effective?",
      options: [
        "SSM Parameter Store Standard — free for up to 10,000 parameters with 4 KB values",
        "AWS AppConfig — the only service designed for feature flags",
        "SSM Parameter Store Advanced — required for microservice configuration",
        "Secrets Manager — supports any configuration data",
      ],
      correctIndex: 0,
      explanation:
        "SSM Parameter Store Standard is free for non-sensitive configuration data like feature flags and endpoint URLs. Secrets Manager ($0.40/secret/month) is only justified when automatic rotation or cross-account access is required.",
    },
    {
      question:
        "A global application runs in two regions. The database credential is stored as a Secrets Manager secret with multi-region replication enabled. When rotation occurs in the primary region, what happens to the replica?",
      options: [
        "Secrets Manager automatically pushes the rotated value to all replicas",
        "The replica must be manually rotated separately",
        "The replica is promoted to primary during the rotation window",
        "The replica becomes temporarily unavailable until replication completes",
      ],
      correctIndex: 0,
      explanation:
        "When the primary secret rotates, Secrets Manager automatically pushes the new value to all replica regions. Applications reading from their local regional replica always have the current credential without manual synchronization.",
    },
  ],
};
