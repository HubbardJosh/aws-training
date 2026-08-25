import { ServiceGuide } from "../../../types/guide";

export const iamGuide: ServiceGuide = {
  id: "saa-iam",
  service: "AWS IAM",
  domain: "security",
  tagline:
    "Identity and access management controlling who can do what in your AWS environment",
  intro:
    "AWS Identity and Access Management (IAM) is the foundation of AWS security, providing fine-grained control over authentication and authorization for every AWS API call through users, groups, roles, and policies evaluated by the IAM policy engine.",

  sections: [
    {
      heading: "IAM Principals: Users, Groups, and Roles",
      body: `IAM principals are entities that can make requests to AWS. IAM users represent individual people or applications with long-term credentials (access key ID + secret access key for programmatic access, or username/password for console access). IAM groups are collections of users that share the same permissions — attaching a policy to a group applies it to all members, simplifying permission management at scale. IAM roles are the most important principal type for architects: they provide temporary security credentials (via AWS STS) that any trusted entity can assume, including EC2 instances, Lambda functions, ECS tasks, other AWS accounts, identity providers, and even other IAM users. Roles should be preferred over users for application access — temporary credentials rotate automatically and leave no long-lived secrets to leak. The SAA-C03 exam heavily emphasizes roles as the correct mechanism for cross-service and cross-account authorization.`,
    },
    {
      heading: "IAM Policies: Structure and Evaluation Logic",
      body: `IAM policies are JSON documents that define permissions through Effect (Allow or Deny), Action (API operations like \`s3:GetObject\`), Resource (the ARN of the resource), and optional Condition elements. Identity-based policies are attached to users, groups, or roles. Resource-based policies are attached to AWS resources (S3 bucket policies, KMS key policies, Lambda resource policies) and specify a Principal — enabling cross-account access without requiring the target account to create a role. AWS evaluates all applicable policies when a principal makes an API call: an explicit Deny in any policy always overrides any Allow. If no policy grants an explicit Allow, the request is implicitly denied. For cross-account access, both the source account's role policy (Allow) and the destination resource's resource-based policy or role trust policy must permit the action — the intersection of permissions determines what is allowed.`,
    },
    {
      heading: "IAM Roles for Services and Cross-Account Access",
      body: `Service roles allow AWS services to act on your behalf. An EC2 instance profile wraps an IAM role and makes it available to the instance's applications via the instance metadata service at \`169.254.169.254/latest/meta-data/iam/security-credentials/\`. Lambda execution roles grant Lambda functions permission to write logs to CloudWatch and access other services. ECS task roles grant per-task permissions, allowing different containers in the same cluster to have different permissions. Cross-account roles enable a principal in Account A to assume a role in Account B — the role's trust policy specifies Account A as the trusted principal, and Account A's IAM policies allow the \`sts:AssumeRole\` action. This pattern is the foundation of AWS Organizations service control policies (SCPs), centralized logging architectures, and multi-account security tooling where a security account audits all member accounts.`,
    },
    {
      heading: "Permissions Boundaries and Least Privilege",
      body: `Permissions boundaries are IAM managed policies that set the maximum permissions an identity-based policy can grant to an IAM entity — they do not grant permissions themselves, they limit them. This is useful when you want to delegate permission management to developers while ensuring they cannot grant themselves or others more access than your security policy allows. Least-privilege access means granting only the permissions required to complete a task and no more. AWS provides IAM Access Analyzer to identify overly permissive policies, generate policies from CloudTrail activity, and validate policies against IAM best practices before deployment. AWS IAM Access Advisor shows which services a principal has accessed and when, helping identify and remove unused permissions. For the SAA-C03 exam, least privilege is a core Well-Architected principle — questions will often ask which policy configuration grants exactly the required access without excess.`,
    },
    {
      heading: "AWS Organizations and Service Control Policies",
      body: `AWS Organizations groups multiple AWS accounts into a hierarchy of organizational units (OUs) with a management account at the root. Service Control Policies (SCPs) are organization-level permission guardrails attached to the root, OUs, or individual accounts — they define the maximum permissions available to all IAM principals in the affected accounts, including the root user of member accounts. SCPs do not grant permissions; they restrict what identity-based and resource-based policies can allow. A common pattern is a deny-list SCP at the root that blocks services not approved for use in the organization (e.g., blocking all regions except approved ones) while allowing granular IAM policies within accounts to control specific resource access. SCPs and IAM permissions are evaluated together: the effective permission is the intersection of what SCPs allow and what IAM policies grant.`,
    },
    {
      heading: "Federation and Identity Provider Integration",
      body: `Many organizations already have an identity system (Active Directory, Okta, Google Workspace) and want to use it for AWS access rather than maintaining separate IAM users. AWS supports federation via SAML 2.0 and OpenID Connect (OIDC). SAML 2.0 federation allows corporate identity providers to assert user identity to AWS STS, which returns temporary credentials scoped to an IAM role — this is the mechanism behind AWS SSO (now AWS IAM Identity Center) for console and CLI access. OIDC federation is used for web and mobile applications (Login with Amazon, Google, Facebook) and for GitHub Actions CI/CD pipelines that need to call AWS APIs without storing long-lived access keys. AWS Cognito handles identity federation for consumer applications, providing user pools for authentication and identity pools for temporary AWS credential vending to authenticated (and unauthenticated) users.`,
    },
  ],

  keyFacts: [
    "IAM users have long-term credentials; IAM roles provide temporary credentials via STS",
    "Explicit Deny always wins regardless of any Allow policy",
    "Identity-based policies attach to principals; resource-based policies attach to resources and specify a Principal",
    "Cross-account access requires both an Allow in the source account and a trust policy in the target account",
    "Permissions boundaries limit maximum permissions — they do not grant permissions",
    "SCPs are organization-level guardrails that restrict what IAM policies can allow in member accounts",
    "IAM Access Analyzer identifies overly permissive policies and validates against best practices",
    "SAML 2.0 federation enables SSO from corporate IdPs (AD, Okta) to AWS console and CLI",
    "OIDC federation allows GitHub Actions and mobile apps to call AWS APIs without stored access keys",
    "Service control policies affect even the root user of member accounts",
  ],

  relatedServices: [
    "AWS Organizations",
    "AWS IAM Identity Center",
    "Amazon Cognito",
    "AWS STS",
    "AWS KMS",
    "AWS CloudTrail",
  ],

  examTips: [
    "Roles with temporary credentials are always preferred over IAM users with long-term access keys",
    "Explicit Deny overrides any Allow — evaluate deny policies first when analyzing access",
    "Resource-based policies (S3 bucket policy, KMS key policy) enable cross-account access without a role",
    "Permissions boundary = maximum permission ceiling, not a permission grant",
    "SCPs restrict member accounts but do not restrict the management account",
    "For EC2/Lambda/ECS service access, use instance profiles / execution roles — never embed credentials",
    "IAM Identity Center (SSO) is the recommended solution for multi-account human access",
    "OIDC federation eliminates long-lived access keys in CI/CD pipelines (GitHub Actions, GitLab CI)",
  ],
};
