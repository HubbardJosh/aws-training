import { ServiceGuide } from "../../types/guide";

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
      body: `**Users**: long-term identities for human users or service accounts. Have permanent credentials (password + access keys). Prefer roles over long-term access keys wherever possible.

**Groups**: collection of users. Attach policies to groups; users inherit group permissions. Cannot nest groups. Cannot use groups as principals in resource policies.

**Roles**: identities assumed temporarily by principals (users, services, AWS services, federated identities). Return temporary credentials via STS. Best practice for EC2, Lambda, ECS — no long-term keys stored on instances.

**Policies**: JSON documents defining permissions. Attached to users, groups, or roles.

**Principal**: the entity making the request. Can be an IAM user, IAM role, AWS service, federated user, or AWS account root user.`,
    },
    {
      heading: "Policy Types",
      body: `**Identity-based policies**: attached to users, groups, or roles. Define what actions the identity can perform on which resources.
- *AWS Managed*: created and managed by AWS. Updated by AWS when services change.
- *Customer Managed*: you create and manage. Version-controlled.
- *Inline*: embedded directly in a single user/group/role. Not reusable. Deleted with the principal.

**Resource-based policies**: attached to resources (S3 buckets, SQS queues, KMS keys, Lambda, etc.). Define which principals can perform which actions on the resource. Support cross-account access.

**Permission boundaries**: managed policy that sets the *maximum* permissions an identity can have. Does not grant permissions — only limits them. Effective permissions = intersection of identity policy and boundary. Used to safely delegate IAM creation.

**Session policies**: passed during role assumption or federation. Further restrict the session. Effective permissions = minimum of identity policy, permission boundary, and session policy.

**Organizations Service Control Policies (SCPs)**: applied to OUs or accounts in AWS Organizations. Set the maximum available permissions for all identities in the account (except management account root). Like a permission boundary at the account level.

**Access Control Lists (ACLs)**: legacy mechanism for cross-account access to S3 and other services. Not recommended — use resource-based policies instead.`,
    },
    {
      heading: "Policy Evaluation Logic",
      body: `When a request is made, IAM evaluates all applicable policies in this order:

1. **Explicit Deny**: if any policy has an explicit \`Effect: Deny\` matching the request → **DENY** (always wins, no exceptions)
2. **SCPs** (if using AWS Organizations): if the SCP does not allow the action → **DENY**
3. **Resource-based policy**: if it has an explicit allow → **ALLOW** (for same-account access)
4. **Permission boundaries**: if the boundary does not allow → **DENY**
5. **Session policies**: if the session policy does not allow → **DENY**
6. **Identity-based policies**: if an allow exists → **ALLOW**
7. **Default**: **IMPLICIT DENY** (if nothing grants access)

**Key rules**:
- Explicit Deny always beats any Allow
- Without any explicit Allow, the result is implicit Deny
- Cross-account: both the identity policy (source account) AND resource policy (target account) must allow

**Not Action vs Deny**: \`NotAction\` with \`Effect: Allow\` allows everything except the listed actions (not a deny — other policies can still allow those actions). \`Effect: Deny\` with \`Action\` explicitly denies.`,
    },
    {
      heading: "Policy Structure",
      body: `Every IAM policy is a JSON document with:

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

**Wildcards**: \`*\` matches any action/resource. \`s3:*\` = all S3 actions. \`arn:aws:s3:::bucket/*\` = all objects in bucket.

**Variables**: \`\${aws:username}\`, \`\${aws:userid}\`, \`\${aws:PrincipalTag/team}\` — dynamic values resolved at evaluation time. Enables attribute-based access control (ABAC).

**Conditions**: over 40 condition operators. Common keys: \`aws:RequestedRegion\`, \`aws:SourceIp\`, \`aws:SecureTransport\`, \`aws:MultiFactorAuthPresent\`, \`aws:CurrentTime\`, \`s3:prefix\`, \`kms:ViaService\`.`,
    },
    {
      heading: "Roles & STS",
      body: `**Role assumption**: call \`sts:AssumeRole\` with the role ARN. STS returns temporary credentials: \`AccessKeyId\`, \`SecretAccessKey\`, \`SessionToken\`. Valid for 15 minutes – 12 hours (configurable per role). Use these credentials for subsequent API calls.

**Trust policy**: resource-based policy on a role that specifies who can assume it (the principal). Required for role assumption to work.

**Cross-account**:
1. Role in Account B has trust policy allowing Account A principal
2. Account A principal's identity policy allows \`sts:AssumeRole\` on the role ARN
3. Caller in Account A assumes the role → gets Account B credentials

**ExternalId**: a secret value required by trust policy condition for third-party role assumption. Prevents confused deputy attacks. Third party provides ExternalId; you add it to trust policy condition.

**Session duration**: \`DurationSeconds\` in AssumeRole call. Max depends on role's \`MaxSessionDuration\` setting (1–12 hours).

**Chaining roles**: assuming a role from another role (role A → role B). Session duration capped at 1 hour for chained assumptions.`,
    },
    {
      heading: "IAM Roles for Services",
      body: `AWS services use roles to access other AWS services on your behalf.

**EC2 Instance Profile**: attach a role to an EC2 instance. The instance metadata service (IMDS) provides temporary credentials automatically. Application code uses the SDK credential chain — credentials are auto-refreshed.

**Lambda Execution Role**: role Lambda assumes when running. Grants Lambda permission to write CloudWatch Logs, access DynamoDB, read S3, etc.

**ECS Task Role**: separate from the ECS task *execution* role. The task role is what the container's application code uses (DynamoDB access, S3 access). The execution role is what ECS uses to pull images from ECR and write logs.

**Service-linked roles**: pre-defined roles created by AWS services (e.g. \`AWSServiceRoleForECS\`). You cannot edit the trust policy. AWS manages them.`,
    },
    {
      heading: "Attribute-Based Access Control (ABAC)",
      body: `ABAC uses tags (attributes) on both the IAM principal and the resource to make access control decisions.

**Pattern**: tag the role with \`team: payments\`. Tag the DynamoDB table with \`team: payments\`. Write a policy with condition \`aws:PrincipalTag/team == aws:ResourceTag/team\`. Now the policy automatically grants the payments team access to payments resources — no policy update needed when you add new resources.

**Benefits**: scale access control without updating policies. One policy handles many users/resources.

**IAM policy with ABAC example**:
\`\`\`
"Condition": {
  "StringEquals": {
    "aws:PrincipalTag/Team": "\${aws:ResourceTag/Team}"
  }
}
\`\`\``,
    },
    {
      heading: "IAM Best Practices",
      body: `- **Least privilege**: grant only the permissions needed. Start with deny-all, add specific allows.
- **No root user for daily tasks**: create IAM users/roles. Enable MFA on root. Delete root access keys.
- **Roles > long-term credentials**: use IAM roles for EC2, Lambda, ECS. Avoid access keys on instances.
- **Rotate access keys**: if you must use access keys, rotate regularly. Disable old keys before deleting.
- **Permission boundaries**: when delegating IAM administration, use boundaries to prevent privilege escalation.
- **Enable MFA**: for console users and for sensitive API operations (condition: \`aws:MultiFactorAuthPresent\`).
- **Use conditions**: restrict by IP, region, time, MFA, and more to add defense in depth.
- **CloudTrail**: all IAM API calls logged in CloudTrail — monitor for suspicious activity.
- **Access Analyzer**: identify resources shared externally, validate policies, check for unused permissions.`,
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
