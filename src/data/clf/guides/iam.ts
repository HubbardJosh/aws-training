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
    },
    {
      heading: "Policies and the Principle of Least Privilege",
      body: `IAM policies are the mechanism through which permissions are granted and denied. Understanding how policies work is fundamental to AWS security.

A policy document contains one or more **statements**, each with an **Effect** (Allow or Deny), an **Action** (the API operation), and a **Resource** (the ARN of the AWS resource). An optional **Condition** can restrict when the policy applies (e.g., only from a specific IP, only when MFA is used).

**Managed Policies** are standalone policies you can attach to multiple users, groups, or roles. AWS provides **AWS Managed Policies** (maintained by AWS, like \`AdministratorAccess\` or \`ReadOnlyAccess\`) and you can create **Customer Managed Policies** for your specific needs.

**Inline Policies** are embedded directly into a single user, group, or role. They are tightly coupled and cannot be reused, so managed policies are generally preferred.

The **Principle of Least Privilege** is the foundational security concept that every user or service should have only the minimum permissions necessary to perform its function. Start with no permissions and grant only what is specifically needed. IAM helps enforce this with **IAM Access Analyzer** and **IAM Credentials Report**, which identify unused permissions and credentials.`,
    },
    {
      heading: "IAM Roles for Services",
      body: `One of IAM's most important patterns is using **roles** to grant AWS services permission to access other AWS services on your behalf. This eliminates the need to embed long-term credentials in code or configuration files.

When an EC2 instance needs to read from S3, you create a role with an S3 read policy, attach it to the instance as an **instance profile**, and the application running on EC2 can then call S3 without any access keys. The instance automatically retrieves temporary credentials from the instance metadata endpoint.

Similarly, when a Lambda function needs to write to DynamoDB, you attach a role with DynamoDB write permissions to the Lambda function. AWS rotates the temporary credentials automatically.

This pattern — **services assuming roles with least-privilege permissions** — is the AWS-recommended approach for service-to-service authentication and is far more secure than distributing access keys.`,
    },
    {
      heading: "Root Account and Account Security",
      body: `Every AWS account has a **root user** created with the email address used to sign up. The root user has unrestricted access to everything in the account and cannot be restricted by policies. For this reason, AWS strongly recommends:

- **Never use the root user for daily tasks** — use it only for a small set of account management tasks (like changing account email or enabling certain services)
- **Enable MFA on the root user immediately** — multi-factor authentication requires a second factor beyond the password
- **Delete or do not create root user access keys** — use IAM users or roles instead

**Multi-Factor Authentication (MFA)** adds a second layer of authentication requiring a hardware token or authenticator app code in addition to a password. MFA should be enabled for all human users, especially those with elevated privileges.

**IAM Credentials Report** is an account-level report listing all IAM users and the status of their credentials (password, access keys, MFA). Use it for auditing and compliance.`,
    },
    {
      heading: "Cross-Account Access and Federation",
      body: `IAM supports sophisticated scenarios beyond simple user-to-resource access within a single account.

**Cross-Account Access** uses IAM roles to allow principals in one AWS account to access resources in another. For example, a developer in account A can assume a role in account B to deploy infrastructure there, without needing separate credentials for account B.

**Identity Federation** allows users who already have identities in an external identity provider (like Microsoft Active Directory, Google, or Okta) to assume IAM roles and access AWS resources. This is often called **Single Sign-On (SSO)**.

**AWS IAM Identity Center** (formerly AWS SSO) is the recommended service for centrally managing access across multiple AWS accounts and applications. It integrates with existing identity providers and provides a portal where users sign in once to access all their permitted AWS accounts.

The key insight for the exam is that you should **not create IAM users for every person in a large organization** — instead, federate your existing corporate directory, granting users temporary role-based access to AWS.`,
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
};
