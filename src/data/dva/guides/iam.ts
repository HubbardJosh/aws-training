import { ServiceGuide } from "../../../types/guide";

export const iamGuide: ServiceGuide = {
  id: "aws-iam",
  service: "AWS IAM",
  domain: "security",
  tagline: "Manage access to AWS services and resources securely",
  intro:
    "IAM (Identity and Access Management) controls who can do what in your AWS account. It provides authentication (who are you?) and authorization (what can you do?) for every AWS API call.",

  sections: [
    {
      heading: "Core Components",
      body: `IAM is built around four fundamental entities. **Users** are long-term identities representing individual humans or service accounts. They authenticate with a password (for console access) or access keys (for API access), and because those credentials are permanent, you should prefer roles over long-term access keys whenever possible.

**Groups** are collections of users that share the same policies. Attaching a policy to a group propagates it to every member, which makes managing permissions at scale much easier than attaching policies individually. Groups cannot be nested, and they cannot appear as principals in resource-based policies — they're purely an administrative convenience for identity-based policies.

**Roles** are the recommended way to grant permissions to applications and AWS services. Unlike users, roles don't have permanent credentials — they issue **temporary credentials via STS** that expire automatically. EC2 instance profiles, Lambda execution roles, and ECS task roles all use this model, eliminating the need to store long-term access keys anywhere.

**Policies** are JSON documents that define what actions are allowed or denied on which resources. They're attached to users, groups, or roles. The **principal** in any IAM context is the entity making the request — a user, role, AWS service, or federated identity.`,
    },
    {
      heading: "Policy Types",
      body: `IAM supports several policy types, each serving a distinct purpose.

**Identity-based policies** are attached to users, groups, or roles and define what that identity can do. AWS provides **AWS Managed Policies** that it creates and updates as services change — these are convenient but broad. **Customer Managed Policies** are policies you create and control, with version history. **Inline policies** are embedded directly in a single user, group, or role — they're deleted when the principal is deleted and can't be reused, so they're only appropriate when you need a strict one-to-one binding.

**Resource-based policies** are attached to resources like S3 buckets, SQS queues, Lambda functions, and KMS keys. They specify which principals can perform which actions on that resource. Unlike identity-based policies, resource-based policies can grant cross-account access without requiring the external principal to have a matching identity policy.

**Permission boundaries** are a guardrail mechanism — they define the *maximum* permissions an identity can have, not the permissions they actually have. A developer's permission boundary might allow only S3 and Lambda actions; even if their identity policy grants DynamoDB access, the boundary blocks it. This makes it safe to delegate IAM creation to developers, because they can't grant themselves more access than their boundary allows.

**Session policies** are passed at the moment of role assumption or federation. They further restrict what the temporary session can do, without changing the role's underlying policies. **Service Control Policies (SCPs)** in AWS Organizations operate at the account level, setting the maximum permissions available to any identity in the account — except the management account root user.`,
    },
    {
      heading: "Policy Evaluation Logic",
      body: `When AWS evaluates whether to allow a request, it processes all applicable policies in a specific order. Understanding this order is essential for debugging access issues.

The evaluation starts by checking for an **explicit Deny** across all applicable policies. An explicit deny always wins — no Allow in any policy can override it. Next, if the account is in an AWS Organization, **SCPs** must permit the action, or the request is denied. For same-account requests, an explicit Allow in a **resource-based policy** grants access. If a **permission boundary** applies, it must also permit the action. **Session policies**, if present, must permit the action. Finally, an explicit Allow in an **identity-based policy** grants access.

If none of the above results in an explicit Allow, the default outcome is an **implicit Deny**. The rule of thumb: without an explicit Allow somewhere in the chain, access is denied.

One subtlety worth understanding is \`NotAction\`. Using \`Effect: Allow\` with \`NotAction\` allows everything *except* the listed actions — but it's not a deny. Other policies can still explicitly allow those actions. This differs from using \`Effect: Deny\` with \`Action\`, which creates a true deny that no Allow can override. For cross-account access, both the identity policy in the source account *and* the resource policy in the target account must allow the action.`,
    },
    {
      heading: "Policy Structure",
      body: `Every IAM policy is a JSON document. The \`Version\` field should always be \`"2012-10-17"\` (the current policy language version). The \`Statement\` array contains one or more statement objects, each with an \`Effect\` of Allow or Deny, one or more \`Action\` values, one or more \`Resource\` ARNs, and an optional \`Condition\` block.

\`\`\`
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "OptionalStatementId",
    "Effect": "Allow" | "Deny",
    "Principal": { "AWS": "arn:..." },  // resource-based only
    "Action": ["s3:GetObject", "s3:PutObject"],
    "Resource": ["arn:aws:s3:::mybucket/*"],
    "Condition": {
      "StringEquals": {
        "aws:RequestedRegion": "us-east-1"
      }
    }
  }]
}
\`\`\`

Wildcards let you express broad permissions concisely — \`s3:*\` grants all S3 actions, and \`arn:aws:s3:::bucket/*\` matches every object in a bucket. **Policy variables** let you write dynamic policies that adapt to the caller's identity: \`\${aws:username}\` resolves to the calling user's name, and \`\${aws:PrincipalTag/team}\` resolves to a tag on the principal. This is the foundation of **attribute-based access control (ABAC)**, where a single policy governs access for many users based on their attributes rather than requiring per-user policies.

The \`Condition\` block supports over 40 operators and condition keys. Commonly used keys include \`aws:RequestedRegion\`, \`aws:SourceIp\`, \`aws:SecureTransport\` (enforce HTTPS), \`aws:MultiFactorAuthPresent\`, and service-specific keys like \`s3:prefix\` and \`kms:ViaService\`.`,
    },
    {
      heading: "Roles & STS",
      body: `Role assumption works through the AWS Security Token Service. A principal calls \`sts:AssumeRole\` with the target role's ARN, and STS returns a set of temporary credentials: an \`AccessKeyId\`, a \`SecretAccessKey\`, and a \`SessionToken\`. These credentials are valid for a configurable duration between 15 minutes and 12 hours (bounded by the role's \`MaxSessionDuration\` setting). All subsequent API calls use these temporary credentials.

Every role has a **trust policy** — a resource-based policy on the role itself that specifies who is allowed to assume it. The trust policy is what makes a role assumable. For an EC2 instance to use a role, the trust policy must trust the EC2 service. For a cross-account assumption, the trust policy must trust the source account or a specific principal within it, and the source account's identity policy must grant \`sts:AssumeRole\` on the role ARN.

For third-party integrations, the **ExternalId** condition in the trust policy prevents confused deputy attacks. The third party provides an ExternalId value; you add it as a required condition on your trust policy. An attacker who discovers your role ARN cannot assume it without also knowing the ExternalId. When roles are chained — assuming a role from within another role session — the session duration is automatically capped at 1 hour regardless of the individual role settings.`,
    },
    {
      heading: "IAM Roles for Services",
      body: `AWS services use IAM roles to access other services on your behalf, and the mechanics vary subtly between services.

An **EC2 instance profile** associates a role with an EC2 instance. The AWS SDK's credential chain automatically retrieves temporary credentials from the **instance metadata service (IMDS)** at \`169.254.169.254\`. The credentials are refreshed automatically before they expire, so your application code never needs to handle credential rotation.

A **Lambda execution role** is assumed by the Lambda service when running your function. It grants Lambda permission to write logs to CloudWatch, access DynamoDB tables, read from S3 buckets, and any other AWS service your function calls. Every Lambda function must have an execution role.

In ECS, there are two separate roles to understand. The **task execution role** is used by the ECS agent — it grants ECS permission to pull container images from ECR and write logs to CloudWatch. The **task role** is used by the application code running *inside* the container — it's the equivalent of an EC2 instance profile, granting the application permission to call DynamoDB, S3, or whatever AWS services the application needs. Getting these two roles confused is a common source of ECS permission errors.`,
    },
    {
      heading: "Attribute-Based Access Control (ABAC)",
      body: `ABAC is a scaling strategy for IAM that uses tags on both principals and resources to make authorization decisions, rather than explicit per-resource permissions. The core idea is to write one policy that says "grant access when the principal's team tag matches the resource's team tag" — then you never need to update the policy when you add new resources or new team members.

In practice, you tag a role with \`team: payments\`, tag a DynamoDB table with \`team: payments\`, and write a policy with a condition that compares these tags:

\`\`\`
"Condition": {
  "StringEquals": {
    "aws:PrincipalTag/Team": "\${aws:ResourceTag/Team}"
  }
}
\`\`\`

Now any principal tagged \`payments\` automatically has access to any resource tagged \`payments\`, and access is automatically revoked if either tag changes. This approach scales well in large organizations where managing explicit resource ARNs in policies becomes unmanageable. The tradeoff is that it requires disciplined tagging — if resources aren't consistently tagged, ABAC policies can either over-grant or under-grant access.`,
    },
    {
      heading: "IAM Best Practices",
      body: `The foundation of IAM security is **least privilege** — grant only the permissions a principal actually needs to do its job, and nothing more. The practical approach is to start with a deny-all baseline and add specific allows as they become necessary, rather than starting broad and trying to restrict later. Auditing tools like **IAM Access Analyzer** help by identifying unused permissions and resources shared externally.

The AWS root user has unrestricted access to your entire account and cannot be locked down with IAM policies. For this reason, you should enable MFA on the root user immediately, delete its access keys, and then use it only for tasks that specifically require root (like changing support plan tier). Create named IAM identities with only the permissions they need for everything else.

Wherever possible, prefer **IAM roles over long-term access keys**. Roles provide temporary credentials that expire automatically, reducing the blast radius if credentials are ever leaked. If you must use access keys — for example, in CI/CD systems that don't support IAM roles — rotate them regularly and disable old keys before deleting them. Enable MFA for console users and for sensitive API operations using the \`aws:MultiFactorAuthPresent\` condition. Enable CloudTrail to log all IAM API calls, and monitor for suspicious activity like unexpected AssumeRole calls or permission policy changes.`,
    },
  ],

  keyFacts: [
    "Explicit Deny always wins — no exceptions, no overrides",
    "Default is implicit deny — must explicitly allow",
    "Permission boundary = maximum permissions (ceiling, not floor)",
    "SCP = permission boundary at AWS account level (affects all identities)",
    "STS AssumeRole returns AccessKeyId + SecretAccessKey + SessionToken",
    "Session duration: 15 min – 12 hours (role MaxSessionDuration)",
    "Chained role assumptions: session capped at 1 hour",
    "ExternalId in trust policy prevents confused deputy attacks",
    "ECS: task execution role (ECR/logs) is separate from task role (app permissions)",
    "ABAC: use principal tags + resource tags to scale access control",
  ],

  relatedServices: [
    "AWS STS",
    "Amazon Cognito",
    "AWS Organizations",
    "AWS CloudTrail",
    "AWS IAM Access Analyzer",
    "AWS KMS",
    "AWS Secrets Manager",
  ],

  examTips: [
    "Evaluation order: Explicit Deny → SCP → Resource policy → Permission boundary → Session policy → Identity policy → Implicit Deny.",
    "Cross-account access: BOTH identity policy (source) AND resource policy (target) must allow.",
    "Permission boundary limits max permissions — does not grant any on its own.",
    "Trust policy on role = who can assume it. Identity policy = what they can do after assuming.",
    "Use aws:SecureTransport: false in Deny condition to enforce HTTPS on S3/SQS.",
    "Groups cannot be used as principals in resource-based policies.",
    "aws:PrincipalTag and aws:ResourceTag enable attribute-based access control (ABAC).",
    "Access keys on EC2 = bad. Use instance profiles (IAM role) instead.",
  ],
};
