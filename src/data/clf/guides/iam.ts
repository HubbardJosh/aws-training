import { ServiceGuide } from "../../../types/guide";

export const iamGuide: ServiceGuide = {
  id: "clf-iam",
  service: "AWS IAM",
  domain: "security",
  tagline: "Control who can do what in your AWS account",
  intro:
    "AWS Identity and Access Management (IAM) enables you to securely control access to AWS services and resources, defining who is authenticated (signed in) and authorized (has permissions) to use resources in your account.",

  sections: [
    {
      heading: "Core IAM Concepts",
      body: `IAM is a global service — it is not region-specific. Every interaction with AWS goes through IAM, which evaluates whether the requesting principal has permission to perform the requested action on the target resource.

The four fundamental building blocks of IAM are **Users**, **Groups**, **Roles**, and **Policies**.

An **IAM User** represents a person or application with long-term credentials (username/password or access keys). Users are best suited for human administrators and developers who need console or programmatic access. For applications, roles are strongly preferred over users.

An **IAM Group** is a collection of users. You attach policies to groups rather than individual users, making permission management scalable — adding a user to the Developers group automatically grants them all developer permissions.

An **IAM Role** is an identity with permissions that can be assumed by trusted entities: AWS services (like EC2 or Lambda), users from another account, or federated identities. Roles issue temporary security credentials rather than long-term access keys, making them more secure.

An **IAM Policy** is a JSON document that defines permissions. Policies state which **actions** (e.g., \`s3:GetObject\`) are allowed or denied on which **resources** (e.g., a specific S3 bucket ARN).`,
      quiz: [
        {
          question:
            "IAM is described as a global service. What does this mean?",
          options: [
            "IAM replicates your resources across all regions automatically",
            "IAM users, groups, roles, and policies are not tied to a specific region and are available everywhere",
            "IAM can manage access to resources in any cloud provider, not just AWS",
            "IAM policies automatically apply to all AWS accounts in an organization",
          ],
          correctIndex: 1,
          explanation:
            "IAM is a global service — your users, groups, roles, and policies are not region-specific. They exist at the account level and are available in every AWS region. You don't create separate IAM configurations per region.",
        },
        {
          question:
            "What is the key advantage of using IAM Roles over IAM Users for applications running on AWS services?",
          options: [
            "Roles support more permission types than users",
            "Roles can be used across multiple AWS accounts while users cannot",
            "Roles have no cost while IAM users have a monthly fee",
            "Roles issue temporary, automatically rotated credentials instead of long-term access keys",
          ],
          correctIndex: 3,
          explanation:
            "IAM Roles issue temporary security credentials that are automatically rotated. This is more secure than long-term access keys associated with IAM users, which can be leaked and misused indefinitely if compromised.",
        },
        {
          question:
            "Why should you attach policies to IAM Groups rather than directly to individual IAM Users?",
          options: [
            "Policies attached to groups have higher priority than user-level policies",
            "User-level policies are limited to 5 statements, while group policies have no limit",
            "Group policies apply to all AWS accounts while user policies are account-specific",
            "It is more scalable — adding a user to a group automatically grants all group permissions",
          ],
          correctIndex: 3,
          explanation:
            "Attaching policies to groups is more scalable. Adding a user to a group automatically grants all the group's permissions. When permissions change, you update the group policy once instead of updating each individual user.",
        },
      ],
    },
    {
      heading: "Policies and the Principle of Least Privilege",
      body: `IAM policies are the mechanism through which permissions are granted and denied. Understanding how policies work is fundamental to AWS security.

A policy document contains one or more **statements**, each with an **Effect** (Allow or Deny), an **Action** (the API operation), and a **Resource** (the ARN of the AWS resource). An optional **Condition** can restrict when the policy applies (e.g., only from a specific IP, only when MFA is used).

**Managed Policies** are standalone policies you can attach to multiple users, groups, or roles. AWS provides **AWS Managed Policies** (maintained by AWS, like \`AdministratorAccess\` or \`ReadOnlyAccess\`) and you can create **Customer Managed Policies** for your specific needs.

**Inline Policies** are embedded directly into a single user, group, or role. They are tightly coupled and cannot be reused, so managed policies are generally preferred.

The **Principle of Least Privilege** is the foundational security concept that every user or service should have only the minimum permissions necessary to perform its function. Start with no permissions and grant only what is specifically needed. IAM helps enforce this with **IAM Access Analyzer** and **IAM Credentials Report**, which identify unused permissions and credentials.`,
      quiz: [
        {
          question: "What is the Principle of Least Privilege in IAM?",
          options: [
            "Grant every user Administrator access so they can do their job without being blocked",
            "Use only AWS Managed Policies and never create custom policies",
            "Always use the root account for administrative tasks to ensure full access",
            "Grant users and services only the minimum permissions needed to perform their function",
          ],
          correctIndex: 3,
          explanation:
            "The Principle of Least Privilege states that every user or service should have only the minimum permissions necessary to perform its function. Start with no permissions and add only what is specifically required, reducing the blast radius if credentials are compromised.",
        },
        {
          question:
            "What is the difference between an AWS Managed Policy and a Customer Managed Policy?",
          options: [
            "AWS Managed Policies are maintained by AWS; Customer Managed Policies are created and maintained by you",
            "AWS Managed Policies apply account-wide; Customer Managed Policies are region-specific",
            "AWS Managed Policies can only be attached to roles; Customer Managed Policies can be attached to users and groups",
            "AWS Managed Policies are free; Customer Managed Policies have a cost per policy",
          ],
          correctIndex: 0,
          explanation:
            "AWS Managed Policies are created and maintained by AWS (like AdministratorAccess or ReadOnlyAccess) and updated when services add new actions. Customer Managed Policies are created and managed by you for your specific permission requirements.",
        },
        {
          question:
            "In an IAM policy statement, an explicit Deny and an explicit Allow exist for the same action. What is the result?",
          options: [
            "The result depends on which policy (user or group) has higher priority",
            "Allow takes precedence because it was configured most recently",
            "Deny takes precedence — an explicit Deny always overrides any Allow",
            "The action is neither allowed nor denied — it requires manual review",
          ],
          correctIndex: 2,
          explanation:
            "In IAM policy evaluation, an explicit Deny always overrides any Allow. This is a fundamental rule of IAM — if there is any Deny statement applicable to an action, the action is denied regardless of any Allow statements.",
        },
      ],
    },
    {
      heading: "IAM Roles for Services",
      body: `One of IAM's most important patterns is using **roles** to grant AWS services permission to access other AWS services on your behalf. This eliminates the need to embed long-term credentials in code or configuration files.

When an EC2 instance needs to read from S3, you create a role with an S3 read policy, attach it to the instance as an **instance profile**, and the application running on EC2 can then call S3 without any access keys. The instance automatically retrieves temporary credentials from the instance metadata endpoint.

Similarly, when a Lambda function needs to write to DynamoDB, you attach a role with DynamoDB write permissions to the Lambda function. AWS rotates the temporary credentials automatically.

This pattern — **services assuming roles with least-privilege permissions** — is the AWS-recommended approach for service-to-service authentication and is far more secure than distributing access keys.`,
      quiz: [
        {
          question:
            "An application running on an EC2 instance needs to read objects from an S3 bucket. What is the AWS-recommended approach?",
          options: [
            "Make the S3 bucket publicly readable to avoid authentication overhead",
            "Create an IAM user, generate access keys, and hardcode them in the application",
            "Store AWS access keys in the application's environment variables on the EC2 instance",
            "Attach an IAM Instance Profile with an S3 read role to the EC2 instance",
          ],
          correctIndex: 3,
          explanation:
            "Attaching an IAM Instance Profile (with an appropriate role) to the EC2 instance is the recommended approach. The application retrieves temporary, automatically rotated credentials from the instance metadata endpoint. No hardcoded access keys are needed.",
        },
        {
          question: "What is an IAM Instance Profile?",
          options: [
            "A collection of EC2 configuration settings stored in IAM",
            "A container that passes an IAM role to an EC2 instance so the instance can assume that role",
            "A security group template stored in IAM for reuse across instances",
            "An IAM user created specifically for an EC2 instance",
          ],
          correctIndex: 1,
          explanation:
            "An IAM Instance Profile is a container for an IAM role that is attached to an EC2 instance. It allows the application code running on the instance to assume the role and receive temporary credentials to call AWS services.",
        },
      ],
    },
    {
      heading: "Root Account and Account Security",
      body: `Every AWS account has a **root user** created with the email address used to sign up. The root user has unrestricted access to everything in the account and cannot be restricted by policies. For this reason, AWS strongly recommends:

- **Never use the root user for daily tasks** — use it only for a small set of account management tasks (like changing account email or enabling certain services)
- **Enable MFA on the root user immediately** — multi-factor authentication requires a second factor beyond the password
- **Delete or do not create root user access keys** — use IAM users or roles instead

**Multi-Factor Authentication (MFA)** adds a second layer of authentication requiring a hardware token or authenticator app code in addition to a password. MFA should be enabled for all human users, especially those with elevated privileges.

**IAM Credentials Report** is an account-level report listing all IAM users and the status of their credentials (password, access keys, MFA). Use it for auditing and compliance.`,
      quiz: [
        {
          question:
            "What should you do with the AWS root user account after initial setup?",
          options: [
            "Use it daily for all administrative tasks since it has the most permissions",
            "Delete it and use only IAM users going forward",
            "Share the credentials with your team so everyone has full account access",
            "Enable MFA, avoid daily use, and do not create root user access keys",
          ],
          correctIndex: 3,
          explanation:
            "AWS strongly recommends: enable MFA on the root user immediately, use it only for account management tasks that require it (like changing the account email), and never create root user access keys. Create IAM users or use federation for daily work.",
        },
        {
          question: "What does the IAM Credentials Report contain?",
          options: [
            "An account-level report listing all IAM users and the status of their passwords, access keys, and MFA",
            "A cost report showing charges associated with IAM API calls",
            "A list of all API calls made using IAM credentials in the past 90 days",
            "A security score for each IAM user based on their recent activity",
          ],
          correctIndex: 0,
          explanation:
            "The IAM Credentials Report is an account-level report that lists all IAM users and the status of their credentials — including whether passwords are active, when access keys were last rotated, and whether MFA is enabled. Use it for auditing and compliance.",
        },
        {
          question:
            "Why is Multi-Factor Authentication (MFA) important for IAM accounts?",
          options: [
            "MFA speeds up authentication by pre-verifying users",
            "MFA is required by AWS to create IAM users in new accounts",
            "MFA encrypts all API calls made by the IAM user",
            "MFA adds a second authentication factor so a stolen password alone cannot grant access",
          ],
          correctIndex: 3,
          explanation:
            "MFA requires a second factor (hardware token or authenticator app code) in addition to a password. If a password is stolen or leaked, an attacker still cannot access the account without the physical MFA device or app, significantly improving security.",
        },
      ],
    },
    {
      heading: "Cross-Account Access and Federation",
      body: `IAM supports sophisticated scenarios beyond simple user-to-resource access within a single account.

**Cross-Account Access** uses IAM roles to allow principals in one AWS account to access resources in another. For example, a developer in account A can assume a role in account B to deploy infrastructure there, without needing separate credentials for account B.

**Identity Federation** allows users who already have identities in an external identity provider (like Microsoft Active Directory, Google, or Okta) to assume IAM roles and access AWS resources. This is often called **Single Sign-On (SSO)**.

**AWS IAM Identity Center** (formerly AWS SSO) is the recommended service for centrally managing access across multiple AWS accounts and applications. It integrates with existing identity providers and provides a portal where users sign in once to access all their permitted AWS accounts.

The key insight for the exam is that you should **not create IAM users for every person in a large organization** — instead, federate your existing corporate directory, granting users temporary role-based access to AWS.`,
      quiz: [
        {
          question: "What is Identity Federation in the context of AWS IAM?",
          options: [
            "Linking multiple IAM users under a single master user account",
            "Allowing users with external identities (Active Directory, Google, Okta) to assume IAM roles and access AWS",
            "Federating IAM policies across multiple AWS regions simultaneously",
            "Sharing IAM credentials between multiple AWS accounts",
          ],
          correctIndex: 1,
          explanation:
            "Identity Federation allows users who already have identities in external providers (like Microsoft Active Directory, Google, or Okta) to assume IAM roles and access AWS resources without creating separate IAM users. This is the foundation of Single Sign-On (SSO).",
        },
        {
          question:
            "A large organization has 5,000 employees who need AWS access. What is the recommended approach?",
          options: [
            "Use identity federation with AWS IAM Identity Center to grant employees role-based AWS access via their existing corporate directory",
            "Create 5,000 individual IAM users, one for each employee",
            "Share a single powerful IAM user account among all employees",
            "Grant all employees root user access for simplicity",
          ],
          correctIndex: 0,
          explanation:
            "For large organizations, the recommended approach is identity federation using AWS IAM Identity Center (formerly AWS SSO). Employees sign in with their existing corporate credentials (Active Directory, etc.) and receive temporary, role-based access — no individual IAM users needed.",
        },
      ],
    },
  ],

  keyFacts: [
    "IAM is global — not region-specific",
    "Core components: Users (long-term credentials), Groups, Roles (temporary credentials), Policies",
    "Root user has unrestricted account access — never use for daily tasks, always enable MFA",
    "Policies are JSON documents defining Allow/Deny for Actions on Resources",
    "Principle of Least Privilege: grant only the minimum permissions needed",
    "IAM Roles issue temporary credentials — preferred over long-term access keys",
    "EC2 Instance Profiles and Lambda execution roles use IAM roles for service-to-service access",
    "AWS Managed Policies are maintained by AWS; Customer Managed Policies are custom",
    "MFA adds a second authentication factor — enable it on all human users",
    "IAM Credentials Report audits all users and their credential status",
  ],

  relatedServices: [
    "AWS Organizations",
    "AWS IAM Identity Center",
    "Amazon Cognito",
    "AWS CloudTrail",
    "AWS Config",
  ],

  examTips: [
    "Never use the root account for daily work — create IAM users or use federation",
    "Always enable MFA on the root account and all privileged users",
    "Roles use temporary credentials — more secure than long-term access keys",
    "Apply the Principle of Least Privilege — start with no permissions and grant only what is needed",
    "Attach policies to groups, not individual users, for scalable permission management",
    "IAM roles are the correct way to grant EC2/Lambda permissions to other AWS services",
    "Explicit Deny always overrides Allow in IAM policy evaluation",
    "IAM Identity Center is the recommended approach for multi-account or federated access",
  ],

  topicQuiz: [
    {
      question:
        "Which IAM component is a collection of users that simplifies permission management?",
      options: ["IAM Role", "IAM Group", "IAM Instance Profile", "IAM Policy"],
      correctIndex: 1,
      explanation:
        "An IAM Group is a collection of users. By attaching policies to groups rather than individuals, you can manage permissions at scale — adding a user to a group automatically grants all group permissions, and permission changes only need to be made once.",
    },
    {
      question:
        "A Lambda function needs to write logs to CloudWatch and read from an S3 bucket. How should you grant these permissions?",
      options: [
        "Hardcode access keys in the Lambda function's environment variables",
        "Attach an IAM execution role with the required permissions to the Lambda function",
        "Create an IAM user for the Lambda function and generate access keys",
        "Grant the Lambda function root user credentials at runtime",
      ],
      correctIndex: 1,
      explanation:
        "Lambda functions should be granted permissions via an IAM execution role. AWS automatically provides the function with temporary credentials from the role, so no access keys need to be hardcoded or stored anywhere.",
    },
    {
      question:
        "What happens if both an explicit Allow and an explicit Deny exist for the same IAM action?",
      options: [
        "The most recently created policy wins",
        "Deny takes precedence — an explicit Deny always overrides any Allow",
        "Allow takes precedence — permissions always win over denials",
        "The result is undefined and must be manually resolved",
      ],
      correctIndex: 1,
      explanation:
        "In IAM policy evaluation, explicit Deny always overrides any Allow. This is a fundamental IAM rule — if any applicable policy contains a Deny for an action, that action is denied regardless of Allow statements in other policies.",
    },
    {
      question:
        "Which AWS service is the recommended solution for centrally managing employee access across dozens of AWS accounts in a large organization?",
      options: [
        "Creating individual IAM users in each account",
        "AWS CloudTrail",
        "AWS IAM Identity Center (formerly AWS SSO)",
        "Amazon Cognito",
      ],
      correctIndex: 2,
      explanation:
        "AWS IAM Identity Center (formerly AWS SSO) centrally manages access across multiple AWS accounts and applications. It integrates with existing identity providers and provides a single portal where users sign in once to access all permitted accounts.",
    },
    {
      question:
        "What are the immediate security steps AWS recommends after creating a new AWS account?",
      options: [
        "Create 100 IAM users so work can be distributed immediately",
        "Delete all default VPCs and security groups",
        "Enable MFA on the root user and avoid using root for daily tasks",
        "Enable all AWS services in the account to ensure availability",
      ],
      correctIndex: 2,
      explanation:
        "AWS recommends immediately enabling MFA on the root user account and avoiding its use for daily tasks. The root user has unrestricted access and cannot be restricted by policies, so protecting it with MFA and using IAM users/roles for day-to-day work is critical.",
    },
    {
      question:
        "What type of IAM policy is embedded directly into a single user, group, or role and cannot be reused?",
      options: [
        "Service Control Policy",
        "Inline Policy",
        "Customer Managed Policy",
        "AWS Managed Policy",
      ],
      correctIndex: 1,
      explanation:
        "Inline Policies are embedded directly into a single IAM principal (user, group, or role). They are tightly coupled to that entity and cannot be attached to others. Managed policies (AWS or Customer) are standalone and can be attached to multiple principals.",
    },
    {
      question:
        "The Principle of Least Privilege in IAM means which of the following?",
      options: [
        "Grant only the minimum permissions necessary to perform a function, starting from no permissions",
        "Only AWS administrators should have access to IAM",
        "Avoid creating custom policies and rely only on AWS Managed Policies",
        "Use the fewest number of IAM users to minimize management overhead",
      ],
      correctIndex: 0,
      explanation:
        "The Principle of Least Privilege means starting with no permissions and granting only what is specifically needed for the task. This minimizes the damage if credentials are compromised — a restricted account can do far less harm than an over-privileged one.",
    },
    {
      question:
        "Cross-account access in IAM is achieved using which mechanism?",
      options: [
        "IAM Roles — a principal in one account assumes a role in another account",
        "Merging two AWS accounts into a single organizational account",
        "Sharing IAM user credentials between accounts",
        "Copying IAM policies from one account to another",
      ],
      correctIndex: 0,
      explanation:
        "Cross-account access uses IAM roles. A principal in account A is granted permission to assume a role defined in account B. When they assume the role, they receive temporary credentials to access resources in account B — no credential sharing needed.",
    },
  ],
};
