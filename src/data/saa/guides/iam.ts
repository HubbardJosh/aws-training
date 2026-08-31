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
      quiz: [
        {
          question:
            "An EC2 instance needs to write objects to an S3 bucket. What is the most secure way to grant this permission?",
          options: [
            "Store the access key in an environment variable on the EC2 instance",
            "Create an IAM user and embed the access key in the application code",
            "Use the root account credentials for maximum permissions",
            "Attach an IAM role with the required S3 permissions to the EC2 instance",
          ],
          correctIndex: 3,
          explanation:
            "An IAM role attached to an EC2 instance (via an instance profile) provides temporary credentials that rotate automatically and require no long-lived secrets to be stored. Embedding access keys in code or environment variables creates a credential leakage risk. Root credentials should never be used for application access.",
        },
        {
          question:
            "What is the primary advantage of IAM roles over IAM users for application access?",
          options: [
            "Roles can be used by multiple regions simultaneously",
            "Roles bypass IAM policy evaluation for faster access",
            "Roles provide temporary credentials that rotate automatically, eliminating long-lived secrets",
            "Roles provide more permissions than users",
          ],
          correctIndex: 2,
          explanation:
            "IAM roles issue temporary security credentials via AWS STS that rotate automatically, leaving no persistent secrets that could be leaked or compromised. IAM users have long-term access keys that must be manually rotated and create a larger attack surface if exposed.",
        },
        {
          question:
            "Which IAM principal type can be used to group users and apply the same permissions to all members at once?",
          options: [
            "IAM Group",
            "IAM Role",
            "IAM Policy",
            "AWS Organizations OU",
          ],
          correctIndex: 0,
          explanation:
            "IAM Groups are collections of IAM users that share the same policies. Attaching a policy to a group automatically applies it to all members, simplifying permission management at scale. Roles are for temporary access; policies are permission documents, not containers for users; OUs are in AWS Organizations.",
        },
      ],
    },
    {
      heading: "IAM Policies: Structure and Evaluation Logic",
      body: `IAM policies are JSON documents that define permissions through Effect (Allow or Deny), Action (API operations like \`s3:GetObject\`), Resource (the ARN of the resource), and optional Condition elements. Identity-based policies are attached to users, groups, or roles. Resource-based policies are attached to AWS resources (S3 bucket policies, KMS key policies, Lambda resource policies) and specify a Principal — enabling cross-account access without requiring the target account to create a role. AWS evaluates all applicable policies when a principal makes an API call: an explicit Deny in any policy always overrides any Allow. If no policy grants an explicit Allow, the request is implicitly denied. For cross-account access, both the source account's role policy (Allow) and the destination resource's resource-based policy or role trust policy must permit the action — the intersection of permissions determines what is allowed.`,
      quiz: [
        {
          question:
            "An IAM user has a policy that allows s3:DeleteObject, but a bucket policy explicitly denies s3:DeleteObject for all principals. What is the effective permission?",
          options: [
            "Allow — the identity-based policy takes precedence over resource-based policies",
            "Deny — resource-based policies always take precedence over identity-based policies",
            "Deny — an explicit Deny always overrides any Allow",
            "Allow — the most permissive policy wins",
          ],
          correctIndex: 2,
          explanation:
            "An explicit Deny in any policy always overrides any Allow, regardless of where the Allow comes from. This is the most important rule in IAM policy evaluation: Deny beats Allow. The bucket policy's explicit Deny makes the effective permission a Deny, even though the identity-based policy grants Allow.",
        },
        {
          question:
            "What is the difference between identity-based policies and resource-based policies?",
          options: [
            "Identity-based policies use Allow only; resource-based policies use Deny only",
            "Identity-based policies are evaluated first; resource-based policies are only evaluated if the first allows access",
            "Identity-based policies attach to users/groups/roles; resource-based policies attach to resources and specify a Principal",
            "Resource-based policies are managed by AWS; identity-based policies are customer-managed",
          ],
          correctIndex: 2,
          explanation:
            "Identity-based policies are attached to IAM principals (users, groups, roles) and define what those principals can do. Resource-based policies are attached to AWS resources (S3 buckets, KMS keys, Lambda functions) and specify a Principal element to define who can access the resource. Both types are evaluated simultaneously when determining effective permissions.",
        },
      ],
    },
    {
      heading: "IAM Roles for Services and Cross-Account Access",
      body: `Service roles allow AWS services to act on your behalf. An EC2 instance profile wraps an IAM role and makes it available to the instance's applications via the instance metadata service at \`169.254.169.254/latest/meta-data/iam/security-credentials/\`. Lambda execution roles grant Lambda functions permission to write logs to CloudWatch and access other services. ECS task roles grant per-task permissions, allowing different containers in the same cluster to have different permissions. Cross-account roles enable a principal in Account A to assume a role in Account B — the role's trust policy specifies Account A as the trusted principal, and Account A's IAM policies allow the \`sts:AssumeRole\` action. This pattern is the foundation of AWS Organizations service control policies (SCPs), centralized logging architectures, and multi-account security tooling where a security account audits all member accounts.`,
      quiz: [
        {
          question:
            "Account A needs to access resources in Account B. Which two elements must be configured for cross-account role assumption?",
          options: [
            "A VPC peering connection and a shared S3 bucket",
            "Account A's IAM policy allowing sts:AssumeRole AND Account B's role trust policy specifying Account A as a trusted principal",
            "An AWS Organizations SCP in Account B and a service endpoint in Account A",
            "A Direct Connect link between accounts and IAM identity federation",
          ],
          correctIndex: 1,
          explanation:
            "Cross-account role assumption requires two things: (1) the role in Account B must have a trust policy that specifies Account A as a trusted principal, and (2) the IAM principal in Account A must have a policy that allows the sts:AssumeRole action for the target role's ARN. Both conditions must be met for the assumption to succeed.",
        },
        {
          question:
            "How does an EC2 instance access the IAM role credentials it has been assigned?",
          options: [
            "Through the instance metadata service at 169.254.169.254",
            "Through an S3 bucket configured as a credentials store",
            "Through environment variables set at launch time",
            "Through the AWS Secrets Manager API",
          ],
          correctIndex: 0,
          explanation:
            "EC2 instances retrieve their IAM role credentials from the instance metadata service (IMDS) at the link-local address 169.254.169.254/latest/meta-data/iam/security-credentials/. The AWS SDK automatically retrieves and refreshes these temporary credentials from IMDS, so application code does not need to handle credential management explicitly.",
        },
      ],
    },
    {
      heading: "Permissions Boundaries and Least Privilege",
      body: `Permissions boundaries are IAM managed policies that set the maximum permissions an identity-based policy can grant to an IAM entity — they do not grant permissions themselves, they limit them. This is useful when you want to delegate permission management to developers while ensuring they cannot grant themselves or others more access than your security policy allows. Least-privilege access means granting only the permissions required to complete a task and no more. AWS provides IAM Access Analyzer to identify overly permissive policies, generate policies from CloudTrail activity, and validate policies against IAM best practices before deployment. AWS IAM Access Advisor shows which services a principal has accessed and when, helping identify and remove unused permissions. For the SAA-C03 exam, least privilege is a core Well-Architected principle — questions will often ask which policy configuration grants exactly the required access without excess.`,
      quiz: [
        {
          question:
            "A security team wants to allow developers to create IAM roles but prevent them from granting permissions beyond what the security team has approved. Which IAM feature should be used?",
          options: [
            "A bucket policy that restricts IAM operations",
            "Service Control Policies applied to the developers' OU",
            "IAM Permissions Boundaries on the roles developers create",
            "AWS Config rules that alert when excessive permissions are granted",
          ],
          correctIndex: 2,
          explanation:
            "Permissions Boundaries set the maximum permissions that can be granted by an identity-based policy. When developers create roles with permissions boundaries applied, those roles cannot exceed the permissions defined in the boundary, even if the developer tries to attach a more permissive policy. This enables safe delegation of IAM management.",
        },
        {
          question: "What does a Permissions Boundary do?",
          options: [
            "It sets the maximum permissions an identity-based policy can grant — it does not grant permissions itself",
            "It creates a VPC boundary that limits which resources an IAM principal can access",
            "It grants permissions to IAM principals up to the boundary limit",
            "It replaces the need for identity-based policies for the bounded principal",
          ],
          correctIndex: 0,
          explanation:
            "A Permissions Boundary is a ceiling on permissions — it limits what identity-based policies can grant, but does not itself grant any permissions. The effective permissions are the intersection of what the identity-based policy allows AND what the permissions boundary allows. Both must allow an action for it to be permitted.",
        },
        {
          question:
            "Which AWS tool analyzes CloudTrail activity to generate a least-privilege IAM policy for a principal?",
          options: [
            "AWS Config",
            "IAM Access Advisor",
            "IAM Access Analyzer policy generation",
            "AWS Trusted Advisor",
          ],
          correctIndex: 2,
          explanation:
            "IAM Access Analyzer can generate IAM policies based on actual CloudTrail activity, producing a least-privilege policy that grants only the permissions the principal has actually used. IAM Access Advisor shows last-accessed information but does not generate policies. AWS Config assesses compliance but does not generate IAM policies.",
        },
      ],
    },
    {
      heading: "AWS Organizations and Service Control Policies",
      body: `AWS Organizations groups multiple AWS accounts into a hierarchy of organizational units (OUs) with a management account at the root. Service Control Policies (SCPs) are organization-level permission guardrails attached to the root, OUs, or individual accounts — they define the maximum permissions available to all IAM principals in the affected accounts, including the root user of member accounts. SCPs do not grant permissions; they restrict what identity-based and resource-based policies can allow. A common pattern is a deny-list SCP at the root that blocks services not approved for use in the organization (e.g., blocking all regions except approved ones) while allowing granular IAM policies within accounts to control specific resource access. SCPs and IAM permissions are evaluated together: the effective permission is the intersection of what SCPs allow and what IAM policies grant.`,
      quiz: [
        {
          question:
            "An SCP attached to an OU explicitly denies the use of all AWS services in non-approved regions. An IAM administrator in a member account grants a user full AdministratorAccess. What is the effective permission for services in non-approved regions?",
          options: [
            "Deny — SCPs restrict what IAM policies can allow",
            "Allow — AdministratorAccess bypasses SCPs",
            "Allow — IAM policies override SCPs",
            "Deny — SCPs always override all IAM policies and roles",
          ],
          correctIndex: 0,
          explanation:
            "SCPs act as permission guardrails that restrict what IAM policies can allow. Even with AdministratorAccess, a user in a member account cannot perform actions explicitly denied by an SCP. The effective permissions are the intersection of SCP permissions and IAM policy permissions — both must allow the action.",
        },
        {
          question:
            "Do SCPs apply to the management (master) account of an AWS Organization?",
          options: [
            "Yes, SCPs apply to all accounts including the management account",
            "No, SCPs do not restrict the management account",
            "Yes, but only if the management account is in an OU",
            "No, SCPs only apply to accounts created after the SCP was applied",
          ],
          correctIndex: 1,
          explanation:
            "SCPs do not restrict the management account of an AWS Organization, regardless of which root or OU they are attached to. This is an important exam distinction: SCPs restrict all member accounts, including the root user of member accounts, but the management account itself is exempt from SCP restrictions.",
        },
      ],
    },
    {
      heading: "Federation and Identity Provider Integration",
      body: `Many organizations already have an identity system (Active Directory, Okta, Google Workspace) and want to use it for AWS access rather than maintaining separate IAM users. AWS supports federation via SAML 2.0 and OpenID Connect (OIDC). SAML 2.0 federation allows corporate identity providers to assert user identity to AWS STS, which returns temporary credentials scoped to an IAM role — this is the mechanism behind AWS SSO (now AWS IAM Identity Center) for console and CLI access. OIDC federation is used for web and mobile applications (Login with Amazon, Google, Facebook) and for GitHub Actions CI/CD pipelines that need to call AWS APIs without storing long-lived access keys. AWS Cognito handles identity federation for consumer applications, providing user pools for authentication and identity pools for temporary AWS credential vending to authenticated (and unauthenticated) users.`,
      quiz: [
        {
          question:
            "A company uses Active Directory and wants to allow employees to access the AWS Management Console using their AD credentials. Which AWS service provides this capability?",
          options: [
            "AWS IAM with long-term access keys",
            "AWS IAM Identity Center (formerly AWS SSO) with SAML 2.0 federation",
            "Amazon Cognito User Pools",
            "AWS Directory Service for Microsoft AD with direct console access",
          ],
          correctIndex: 1,
          explanation:
            "AWS IAM Identity Center (formerly AWS SSO) uses SAML 2.0 federation to allow corporate identity providers like Active Directory to authenticate users and grant temporary AWS credentials scoped to IAM roles. This enables SSO to the AWS console and CLI without maintaining separate IAM users. Cognito is for consumer-facing applications, not enterprise SSO.",
        },
        {
          question:
            "A GitHub Actions CI/CD pipeline needs to deploy to AWS without storing long-lived access keys in GitHub secrets. Which federation mechanism enables this?",
          options: [
            "IAM user with access key stored in GitHub Secrets",
            "SAML 2.0 federation with AWS STS",
            "OIDC federation allowing GitHub to assume an IAM role",
            "AWS Cognito identity pool for GitHub Actions",
          ],
          correctIndex: 2,
          explanation:
            "OIDC federation allows GitHub Actions to assume an IAM role by presenting an OIDC token issued by GitHub. AWS STS validates the token and issues temporary credentials scoped to the IAM role. This eliminates the need to store long-lived access keys in GitHub, reducing credential exposure risk.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "An IAM user has an Allow policy for s3:PutObject. An SCP on the OU denies s3:PutObject. What is the effective permission?",
      options: [
        "Allow — the user's explicit Allow takes precedence",
        "Depends on whether the bucket has a resource-based policy",
        "Allow — identity-based policies override SCPs",
        "Deny — an SCP deny overrides IAM Allow",
      ],
      correctIndex: 3,
      explanation:
        "SCPs act as permission guardrails that restrict what IAM policies can grant. The effective permissions are the intersection of SCP permissions and IAM policy permissions. An SCP denial overrides any IAM Allow for principals in the affected accounts.",
    },
    {
      question:
        "Which IAM feature provides temporary security credentials for AWS services like EC2, Lambda, and ECS tasks?",
      options: [
        "IAM Users with access keys",
        "IAM Roles via AWS STS",
        "IAM Policies with time-limited conditions",
        "IAM Groups with shared credentials",
      ],
      correctIndex: 1,
      explanation:
        "IAM Roles provide temporary security credentials via AWS STS. Services like EC2 (via instance profiles), Lambda (via execution roles), and ECS tasks assume roles to get automatically rotating temporary credentials, eliminating the need for long-lived access keys.",
    },
    {
      question:
        "A developer wants to allow other developers to create IAM roles but prevent them from granting more permissions than the security team has approved. Which IAM feature enforces this limit?",
      options: [
        "AWS Config rule alerting on excessive permissions",
        "SCP on the developer OU",
        "IAM policy with a Condition limiting actions",
        "IAM Permissions Boundaries on newly created roles",
      ],
      correctIndex: 3,
      explanation:
        "Permissions Boundaries set the maximum permissions that identity-based policies can grant to an IAM principal. When applied to roles that developers create, the boundary ensures those roles cannot exceed the approved permission ceiling, enabling safe delegation of IAM role creation.",
    },
    {
      question:
        "What happens when there is no explicit Allow for an IAM principal making an API call?",
      options: [
        "The request is forwarded to the resource owner for approval",
        "The root account's permissions are applied",
        "The request is allowed by default",
        "The request is implicitly denied",
      ],
      correctIndex: 3,
      explanation:
        "IAM follows a default-deny model. If no policy explicitly allows an action, the request is implicitly denied. An explicit Allow is required in an applicable policy for the request to succeed. An explicit Deny in any policy overrides any Allow.",
    },
    {
      question:
        "An organization wants employees to access multiple AWS accounts using their Okta credentials without maintaining separate IAM users. Which solution should be used?",
      options: [
        "AWS IAM Identity Center with SAML 2.0 federation to Okta",
        "Amazon Cognito User Pools with Okta integration",
        "Cross-account IAM roles with Okta-managed access keys",
        "IAM users with rotating access keys synchronized with Okta",
      ],
      correctIndex: 0,
      explanation:
        "AWS IAM Identity Center (formerly AWS SSO) supports SAML 2.0 federation with identity providers like Okta, allowing employees to use their existing credentials to access multiple AWS accounts through a single portal. Temporary credentials are issued automatically without requiring separate IAM users.",
    },
    {
      question:
        "Resource-based policies differ from identity-based policies in which key way?",
      options: [
        "Resource-based policies are managed exclusively by AWS and cannot be customized",
        "Resource-based policies are evaluated after identity-based policies in the authorization flow",
        "Resource-based policies can only contain Deny statements",
        "Resource-based policies attach to AWS resources and include a Principal element to specify who can access them",
      ],
      correctIndex: 3,
      explanation:
        "Resource-based policies are JSON policy documents attached directly to AWS resources (S3 buckets, KMS keys, Lambda functions, etc.) and include a Principal element specifying who can access the resource. This enables cross-account access directly without requiring the caller to have a role in the target account.",
    },
    {
      question:
        "A GitHub Actions workflow needs to deploy infrastructure to AWS. What is the most secure approach?",
      options: [
        "Use OIDC federation to allow GitHub Actions to assume an IAM role without stored credentials",
        "Generate a temporary access key from the AWS console before each deployment",
        "Use AWS Cognito to authenticate GitHub Actions as an application user",
        "Store an IAM user's access key and secret in GitHub Secrets",
      ],
      correctIndex: 0,
      explanation:
        "OIDC federation allows GitHub Actions to present an OIDC token to AWS STS and assume an IAM role, receiving short-lived temporary credentials without storing any access keys in GitHub. This eliminates the risk of credential exposure from stored secrets and is the AWS-recommended approach for CI/CD pipeline access.",
    },
    {
      question:
        "SCPs applied to an OU restrict which entities within member accounts?",
      options: [
        "All IAM principals across all accounts including the management account",
        "Only service-linked roles and execution roles",
        "Only IAM users, not IAM roles or the root user",
        "All IAM principals including the root user of member accounts, but not the management account",
      ],
      correctIndex: 3,
      explanation:
        "SCPs restrict all IAM principals in affected member accounts, including the root user of those accounts. However, SCPs do not restrict the management account itself. This is a critical exam distinction: the management account's root user and IAM principals are exempt from SCP restrictions.",
    },
  ],
};
