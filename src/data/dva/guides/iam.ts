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
      quiz: [
        {
          question:
            "Which IAM entity CANNOT be used as a principal in a resource-based policy?",
          options: ["IAM User", "IAM Group", "IAM Role", "AWS Service"],
          correctIndex: 1,
          explanation:
            "IAM Groups cannot appear as principals in resource-based policies. They are purely an administrative convenience for attaching identity-based policies to multiple users at once.",
        },
        {
          question:
            "An EC2 application needs to call S3. What is the recommended approach for providing AWS credentials?",
          options: [
            "Store access keys in the application's environment variables",
            "Embed access keys in the application code",
            "Attach an IAM role via an EC2 instance profile",
            "Create an IAM user and store its access keys in a config file",
          ],
          correctIndex: 2,
          explanation:
            "IAM roles attached via EC2 instance profiles are the recommended approach. They provide temporary credentials via STS that are rotated automatically, eliminating the need to store long-term access keys on the instance.",
        },
        {
          question:
            "What type of credentials does STS return when a role is assumed?",
          options: [
            "An X.509 certificate",
            "A permanent access key and secret key",
            "An AccessKeyId, SecretAccessKey, and SessionToken",
            "A username and password",
          ],
          correctIndex: 2,
          explanation:
            "STS AssumeRole returns three pieces: an AccessKeyId, a SecretAccessKey, and a SessionToken. These temporary credentials expire automatically based on the configured session duration.",
        },
      ],
    },
    {
      heading: "Policy Types",
      body: `IAM supports several policy types, each serving a distinct purpose.

**Identity-based policies** are attached to users, groups, or roles and define what that identity can do. AWS provides **AWS Managed Policies** that it creates and updates as services change — these are convenient but broad. **Customer Managed Policies** are policies you create and control, with version history. **Inline policies** are embedded directly in a single user, group, or role — they're deleted when the principal is deleted and can't be reused, so they're only appropriate when you need a strict one-to-one binding.

**Resource-based policies** are attached to resources like S3 buckets, SQS queues, Lambda functions, and KMS keys. They specify which principals can perform which actions on that resource. Unlike identity-based policies, resource-based policies can grant cross-account access without requiring the external principal to have a matching identity policy.

**Permission boundaries** are a guardrail mechanism — they define the *maximum* permissions an identity can have, not the permissions they actually have. A developer's permission boundary might allow only S3 and Lambda actions; even if their identity policy grants DynamoDB access, the boundary blocks it. This makes it safe to delegate IAM creation to developers, because they can't grant themselves more access than their boundary allows.

**Session policies** are passed at the moment of role assumption or federation. They further restrict what the temporary session can do, without changing the role's underlying policies. **Service Control Policies (SCPs)** in AWS Organizations operate at the account level, setting the maximum permissions available to any identity in the account — except the management account root user.`,
      quiz: [
        {
          question:
            "A developer has a permission boundary that allows only S3 and Lambda actions, but their identity policy also grants DynamoDB access. Can the developer access DynamoDB?",
          options: [
            "Yes, because the identity policy explicitly allows it",
            "Yes, if a resource policy on the DynamoDB table also allows it",
            "No, because DynamoDB is not a supported service for identity policies",
            "No, because the permission boundary blocks it",
          ],
          correctIndex: 3,
          explanation:
            "Permission boundaries define the maximum permissions an identity can have. Even if the identity policy grants DynamoDB access, the permission boundary acts as a ceiling and blocks any permissions not included in it.",
        },
        {
          question:
            "Which policy type is the most appropriate for granting cross-account access to an S3 bucket?",
          options: [
            "Identity-based policy on the source account's user",
            "Permission boundary on the target account's role",
            "Resource-based policy (bucket policy) on the S3 bucket",
            "Service Control Policy (SCP) on the target account",
          ],
          correctIndex: 2,
          explanation:
            "Resource-based policies can grant cross-account access directly. A bucket policy on the S3 bucket can specify principals from other accounts, allowing access without requiring a matching identity policy in the source account (for same-account requests through the resource policy).",
        },
        {
          question:
            "What distinguishes an inline policy from a managed policy?",
          options: [
            "Inline policies support conditions; managed policies do not",
            "Inline policies apply to all principals in an account; managed policies apply to one",
            "Inline policies are embedded in a single principal and deleted with it; managed policies are reusable",
            "Managed policies can only be created by AWS; inline policies are customer-created",
          ],
          correctIndex: 2,
          explanation:
            "Inline policies are embedded directly in a single user, group, or role and are deleted when that principal is deleted. Managed policies (both AWS-managed and customer-managed) exist independently and can be attached to multiple principals.",
        },
      ],
    },
    {
      heading: "Policy Evaluation Logic",
      body: `When AWS evaluates whether to allow a request, it processes all applicable policies in a specific order. Understanding this order is essential for debugging access issues.

The evaluation starts by checking for an **explicit Deny** across all applicable policies. An explicit deny always wins — no Allow in any policy can override it. Next, if the account is in an AWS Organization, **SCPs** must permit the action, or the request is denied. For same-account requests, an explicit Allow in a **resource-based policy** grants access. If a **permission boundary** applies, it must also permit the action. **Session policies**, if present, must permit the action. Finally, an explicit Allow in an **identity-based policy** grants access.

If none of the above results in an explicit Allow, the default outcome is an **implicit Deny**. The rule of thumb: without an explicit Allow somewhere in the chain, access is denied.

One subtlety worth understanding is \`NotAction\`. Using \`Effect: Allow\` with \`NotAction\` allows everything *except* the listed actions — but it's not a deny. Other policies can still explicitly allow those actions. This differs from using \`Effect: Deny\` with \`Action\`, which creates a true deny that no Allow can override. For cross-account access, both the identity policy in the source account *and* the resource policy in the target account must allow the action.`,
      quiz: [
        {
          question:
            "A user has an IAM policy that explicitly allows s3:DeleteObject on a bucket, but a bucket policy explicitly denies s3:DeleteObject for that user. What happens when the user tries to delete an object?",
          options: [
            "The delete succeeds because the identity policy allows it",
            "The delete fails because the explicit deny in the bucket policy wins",
            "The delete succeeds because identity policies take precedence over resource policies",
            "The delete fails because two conflicting policies result in an implicit deny",
          ],
          correctIndex: 1,
          explanation:
            "An explicit Deny always wins regardless of any Allow policies. The explicit deny in the bucket policy overrides the explicit allow in the identity policy.",
        },
        {
          question:
            "For cross-account access to an S3 bucket, what must be true?",
          options: [
            "Only the bucket policy in the target account needs to allow access",
            "Only the identity policy in the source account needs to allow access",
            "Both the identity policy (source account) and the bucket policy (target account) must allow the action",
            "A Service Control Policy must explicitly allow the action",
          ],
          correctIndex: 2,
          explanation:
            "For cross-account access, both policies must allow the action: the identity policy in the source account must grant the relevant actions, and the resource-based policy in the target account must also allow the source principal.",
        },
        {
          question:
            "What is the default outcome if no policy explicitly allows a requested action?",
          options: [
            "Implicit Deny",
            "Depends on the resource type",
            "Explicit Deny",
            "Allow (default-open)",
          ],
          correctIndex: 0,
          explanation:
            "The default outcome when no policy explicitly allows an action is an implicit deny. AWS defaults to denying access — there must be an explicit Allow somewhere in the applicable policies for access to be granted.",
        },
      ],
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
      quiz: [
        {
          question:
            "Which condition key should you use in a Deny statement to enforce HTTPS-only access to an S3 bucket?",
          options: [
            "s3:TlsVersion",
            "aws:SecureTransport",
            "aws:SourceIp",
            "aws:RequestedRegion",
          ],
          correctIndex: 1,
          explanation:
            "aws:SecureTransport evaluates to true when the request uses HTTPS/TLS. A Deny statement with Condition: {Bool: {aws:SecureTransport: false}} blocks all HTTP (non-TLS) requests to the bucket.",
        },
        {
          question:
            "What IAM policy variable resolves to the username of the IAM user making the request?",
          options: [
            "${iam:username}",
            "${aws:username}",
            "${aws:userId}",
            "${aws:PrincipalArn}",
          ],
          correctIndex: 1,
          explanation:
            "${aws:username} is the correct policy variable that resolves to the username of the IAM user making the request. This is commonly used in policies that grant users access only to their own resources.",
        },
        {
          question:
            "The Principal element in an IAM policy document is only valid in which type of policy?",
          options: [
            "Permission boundaries",
            "Session policies",
            "Identity-based policies",
            "Resource-based policies",
          ],
          correctIndex: 3,
          explanation:
            "The Principal element is only used in resource-based policies (like S3 bucket policies, KMS key policies, and SQS queue policies) to specify who can perform actions on the resource. Identity-based policies don't have a Principal element because the policy is attached to the principal directly.",
        },
      ],
    },
    {
      heading: "Roles & STS",
      body: `Role assumption works through the AWS Security Token Service. A principal calls \`sts:AssumeRole\` with the target role's ARN, and STS returns a set of temporary credentials: an \`AccessKeyId\`, a \`SecretAccessKey\`, and a \`SessionToken\`. These credentials are valid for a configurable duration between 15 minutes and 12 hours (bounded by the role's \`MaxSessionDuration\` setting). All subsequent API calls use these temporary credentials.

Every role has a **trust policy** — a resource-based policy on the role itself that specifies who is allowed to assume it. The trust policy is what makes a role assumable. For an EC2 instance to use a role, the trust policy must trust the EC2 service. For a cross-account assumption, the trust policy must trust the source account or a specific principal within it, and the source account's identity policy must grant \`sts:AssumeRole\` on the role ARN.

For third-party integrations, the **ExternalId** condition in the trust policy prevents confused deputy attacks. The third party provides an ExternalId value; you add it as a required condition on your trust policy. An attacker who discovers your role ARN cannot assume it without also knowing the ExternalId. When roles are chained — assuming a role from within another role session — the session duration is automatically capped at 1 hour regardless of the individual role settings.`,
      quiz: [
        {
          question:
            "What is the maximum session duration when roles are chained (role assumed from within another role session)?",
          options: ["15 minutes", "1 hour", "12 hours", "24 hours"],
          correctIndex: 1,
          explanation:
            "When roles are chained, the session duration is automatically capped at 1 hour, regardless of the MaxSessionDuration setting on either role. This prevents indefinite extension of temporary credential lifetime through chaining.",
        },
        {
          question:
            "What is the purpose of the ExternalId condition in a role's trust policy?",
          options: [
            "To specify the maximum session duration for role assumption",
            "To restrict role assumption to specific AWS regions",
            "To prevent confused deputy attacks when third parties assume your role",
            "To require MFA for role assumption",
          ],
          correctIndex: 2,
          explanation:
            "ExternalId prevents confused deputy attacks. A third party provides an ExternalId value, which you add as a required condition on the trust policy. An attacker who discovers the role ARN cannot assume it without knowing the ExternalId.",
        },
        {
          question:
            "What document on a role specifies which principals are allowed to assume it?",
          options: [
            "Permission boundary",
            "Trust policy",
            "Identity-based policy",
            "Session policy",
          ],
          correctIndex: 1,
          explanation:
            "The trust policy is a resource-based policy on the role itself that specifies which principals (users, roles, services, or accounts) are allowed to call sts:AssumeRole on that role.",
        },
      ],
    },
    {
      heading: "IAM Roles for Services",
      body: `AWS services use IAM roles to access other services on your behalf, and the mechanics vary subtly between services.

An **EC2 instance profile** associates a role with an EC2 instance. The AWS SDK's credential chain automatically retrieves temporary credentials from the **instance metadata service (IMDS)** at \`169.254.169.254\`. The credentials are refreshed automatically before they expire, so your application code never needs to handle credential rotation.

A **Lambda execution role** is assumed by the Lambda service when running your function. It grants Lambda permission to write logs to CloudWatch, access DynamoDB tables, read from S3 buckets, and any other AWS service your function calls. Every Lambda function must have an execution role.

In ECS, there are two separate roles to understand. The **task execution role** is used by the ECS agent — it grants ECS permission to pull container images from ECR and write logs to CloudWatch. The **task role** is used by the application code running *inside* the container — it's the equivalent of an EC2 instance profile, granting the application permission to call DynamoDB, S3, or whatever AWS services the application needs. Getting these two roles confused is a common source of ECS permission errors.`,
      quiz: [
        {
          question:
            "An ECS Fargate task needs to read from a DynamoDB table. Which role needs DynamoDB permissions?",
          options: [
            "The service role, because ECS services manage task permissions",
            "The task execution role, because it manages all task permissions",
            "The task role, because it governs what the application code can access",
            "The container instance role, because Fargate uses EC2 underneath",
          ],
          correctIndex: 2,
          explanation:
            "The task role is used by the application code running inside the container and must have the DynamoDB permissions. The task execution role is separate and only grants ECS agent permissions to pull images from ECR and write logs to CloudWatch.",
        },
        {
          question:
            "Where does the AWS SDK on an EC2 instance automatically retrieve temporary credentials from?",
          options: [
            "The instance metadata service (IMDS) at 169.254.169.254",
            "AWS Systems Manager Parameter Store",
            "A locally cached credentials file at ~/.aws/credentials",
            "AWS Secrets Manager",
          ],
          correctIndex: 0,
          explanation:
            "The AWS SDK's credential chain automatically retrieves temporary credentials from the instance metadata service (IMDS) at 169.254.169.254 when running on EC2 with an instance profile. The credentials are refreshed automatically before expiration.",
        },
        {
          question:
            "Which role does the ECS agent use to pull container images from ECR?",
          options: [
            "Task execution role",
            "Service-linked role",
            "Instance profile role",
            "Task role",
          ],
          correctIndex: 0,
          explanation:
            "The task execution role is used by the ECS agent (not the application code) and must have permissions to pull images from ECR and write logs to CloudWatch. The task role is what the application code uses to call other AWS services.",
        },
      ],
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
      quiz: [
        {
          question:
            "What is the primary advantage of Attribute-Based Access Control (ABAC) over traditional RBAC in large organizations?",
          options: [
            "ABAC eliminates the need to update policies when new resources or team members are added",
            "ABAC supports more AWS services than RBAC",
            "ABAC policies are evaluated faster than RBAC policies",
            "ABAC does not require IAM policy documents",
          ],
          correctIndex: 0,
          explanation:
            "ABAC uses tags on principals and resources to make authorization decisions. When resources and users are consistently tagged, a single policy automatically governs access without needing updates when new resources or team members are added.",
        },
        {
          question:
            "Which condition key compares a tag on the principal (caller) to a tag on the resource being accessed?",
          options: [
            "aws:ResourceTag/key vs aws:RequestTag/key",
            "aws:CallerTag/key vs aws:TargetTag/key",
            "iam:PrincipalTag/key vs aws:ResourceTag/key",
            "aws:PrincipalTag/key vs aws:ResourceTag/key",
          ],
          correctIndex: 3,
          explanation:
            "aws:PrincipalTag/key resolves to a tag on the principal making the request, and aws:ResourceTag/key resolves to a tag on the resource being accessed. Comparing them in a condition implements ABAC.",
        },
        {
          question:
            "What is the main operational risk of ABAC compared to explicit resource ARN policies?",
          options: [
            "ABAC cannot be used with managed policies",
            "Inconsistent or missing tags can lead to over-granting or under-granting access",
            "ABAC is not supported for S3 and DynamoDB",
            "ABAC requires more API calls and has higher latency",
          ],
          correctIndex: 1,
          explanation:
            "ABAC requires disciplined, consistent tagging of both principals and resources. If resources are missing tags or have incorrect tags, ABAC policies can unintentionally deny access (under-grant) or allow access to the wrong resources (over-grant).",
        },
      ],
    },
    {
      heading: "IAM Best Practices",
      body: `The foundation of IAM security is **least privilege** — grant only the permissions a principal actually needs to do its job, and nothing more. The practical approach is to start with a deny-all baseline and add specific allows as they become necessary, rather than starting broad and trying to restrict later. Auditing tools like **IAM Access Analyzer** help by identifying unused permissions and resources shared externally.

The AWS root user has unrestricted access to your entire account and cannot be locked down with IAM policies. For this reason, you should enable MFA on the root user immediately, delete its access keys, and then use it only for tasks that specifically require root (like changing support plan tier). Create named IAM identities with only the permissions they need for everything else.

Wherever possible, prefer **IAM roles over long-term access keys**. Roles provide temporary credentials that expire automatically, reducing the blast radius if credentials are ever leaked. If you must use access keys — for example, in CI/CD systems that don't support IAM roles — rotate them regularly and disable old keys before deleting them. Enable MFA for console users and for sensitive API operations using the \`aws:MultiFactorAuthPresent\` condition. Enable CloudTrail to log all IAM API calls, and monitor for suspicious activity like unexpected AssumeRole calls or permission policy changes.`,
      quiz: [
        {
          question:
            "Which AWS service helps identify unused IAM permissions and externally shared resources?",
          options: [
            "IAM Access Analyzer",
            "AWS Config",
            "Amazon GuardDuty",
            "AWS Security Hub",
          ],
          correctIndex: 0,
          explanation:
            "IAM Access Analyzer analyzes resource policies to identify resources that are shared with external principals and can identify unused permissions, helping enforce least privilege.",
        },
        {
          question:
            "Which condition key should you use to require MFA for sensitive API operations in an IAM policy?",
          options: [
            "aws:MfaAuthenticated",
            "aws:MultiFactorAuthPresent",
            "iam:MFARequired",
            "aws:RequireMFA",
          ],
          correctIndex: 1,
          explanation:
            "aws:MultiFactorAuthPresent evaluates to true when the caller authenticated with MFA. Using this in a condition on sensitive operations requires users to have authenticated with MFA before those operations are permitted.",
        },
        {
          question:
            "What is the recommended approach for the AWS root user after initial account setup?",
          options: [
            "Create access keys for the root user for programmatic access",
            "Enable MFA, delete root access keys, and use it only when root is specifically required",
            "Share the root credentials with senior administrators",
            "Attach a restrictive IAM policy to limit the root user's permissions",
          ],
          correctIndex: 1,
          explanation:
            "The root user cannot be restricted by IAM policies. The best practice is to enable MFA, delete its access keys, and then lock it away — using it only for the small number of tasks that specifically require root access (like changing account support plan).",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "What is the correct order of IAM policy evaluation for a same-account request?",
      options: [
        "Explicit Deny → SCP → Resource policy → Permission boundary → Session policy → Identity policy → Implicit Deny",
        "Permission boundary → Identity policy → Resource policy → Explicit Deny",
        "Identity policy → Resource policy → Permission boundary → Explicit Deny",
        "SCP → Explicit Deny → Identity policy → Resource policy",
      ],
      correctIndex: 0,
      explanation:
        "IAM policy evaluation always starts with Explicit Deny (which always wins), then checks SCPs, resource-based policies, permission boundaries, session policies, and finally identity-based policies. If no explicit Allow is found, the result is an implicit deny.",
    },
    {
      question:
        "A developer's IAM role has a permission boundary that allows only EC2 and S3 actions. The role's identity policy grants full DynamoDB access. Can the developer access DynamoDB?",
      options: [
        "No, because permission boundaries set the maximum allowed permissions",
        "No, because DynamoDB access always requires a separate role",
        "Yes, if the DynamoDB table's resource policy allows the role",
        "Yes, because the identity policy explicitly grants DynamoDB access",
      ],
      correctIndex: 0,
      explanation:
        "Permission boundaries set the ceiling (maximum permissions) for an identity. Even if the identity policy grants DynamoDB access, the permission boundary limits what can actually be used. The effective permissions are the intersection of identity policy and permission boundary.",
    },
    {
      question:
        "Which of the following is the most secure way to provide AWS credentials to an application running on EC2?",
      options: [
        "Store access keys in /etc/aws/credentials on the instance",
        "Use an IAM role attached via an EC2 instance profile",
        "Store access keys in AWS Secrets Manager and fetch them at startup",
        "Pass access keys as environment variables in the launch template",
      ],
      correctIndex: 1,
      explanation:
        "IAM roles via EC2 instance profiles are the most secure approach. The SDK automatically retrieves temporary credentials from IMDS, credentials rotate automatically before expiry, and no long-term credentials are stored anywhere on the instance.",
    },
    {
      question:
        "An ECS task fails when trying to pull an image from ECR. Which role is most likely missing the required permissions?",
      options: [
        "Service role — it governs ECS service operations",
        "Task role — it governs what the application can access",
        "Task execution role — it governs what the ECS agent can do",
        "Container instance profile — it governs the EC2 host",
      ],
      correctIndex: 2,
      explanation:
        "The task execution role is used by the ECS agent to pull container images from ECR and write logs to CloudWatch. Missing ecr:GetAuthorizationToken or ecr:BatchGetImage permissions on the task execution role is a common cause of image pull failures.",
    },
    {
      question:
        "A third-party vendor needs to assume a role in your account. How do you prevent the confused deputy attack?",
      options: [
        "Add an ExternalId condition to the role's trust policy",
        "Use a permission boundary on the role",
        "Rotate the role ARN frequently",
        "Require MFA for role assumption using aws:MultiFactorAuthPresent",
      ],
      correctIndex: 0,
      explanation:
        "ExternalId in the trust policy prevents confused deputy attacks. The third party provides a secret ExternalId value; you add it as a required condition. An attacker who discovers your role ARN cannot assume it without also knowing the ExternalId.",
    },
    {
      question:
        "Which IAM policy type can grant cross-account access without requiring the external principal to have a matching identity policy?",
      options: [
        "Identity-based policy",
        "Resource-based policy",
        "Permission boundary",
        "Service Control Policy (SCP)",
      ],
      correctIndex: 1,
      explanation:
        "Resource-based policies (like S3 bucket policies and KMS key policies) can grant cross-account access by explicitly allowing a principal from another account. The external principal does not need a matching identity policy for resource-based policy access grants.",
    },
    {
      question:
        "Which condition key is used to enforce HTTPS-only connections to an S3 bucket?",
      options: [
        "aws:RequestedProtocol",
        "s3:RequireTLS",
        "aws:EncryptionRequired",
        "aws:SecureTransport",
      ],
      correctIndex: 3,
      explanation:
        "aws:SecureTransport evaluates to true when the connection uses HTTPS. A bucket policy Deny statement with Condition: {Bool: {aws:SecureTransport: false}} blocks all unencrypted HTTP requests to the bucket.",
    },
    {
      question:
        "What happens to an inline policy when the IAM user, group, or role it is attached to is deleted?",
      options: [
        "It is moved to an archive for 30 days before permanent deletion",
        "It is converted to a customer managed policy and preserved",
        "It must be manually detached before the principal can be deleted",
        "It is deleted along with the principal",
      ],
      correctIndex: 3,
      explanation:
        "Inline policies are embedded directly in a principal and are deleted when the principal is deleted. This is the key difference from managed policies, which exist independently and can be attached to multiple principals.",
    },
  ],
};
