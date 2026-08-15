import { ServiceGuide } from "../../types/guide";

export const cognitoGuide: ServiceGuide = {
  id: "amazon-cognito",
  service: "Amazon Cognito",
  domain: "security",
  tagline:
    "Add user sign-up, sign-in, and access control to web and mobile apps",
  intro:
    "Cognito provides authentication, authorization, and user management for web and mobile apps. It has two main components: User Pools (user directory and authentication) and Identity Pools (exchange tokens for AWS credentials).",

  sections: [
    {
      heading: "User Pools",
      body: `A **User Pool** is a managed user directory. It handles:
- User sign-up (self-registration or admin creation)
- User sign-in (username/password, email/phone + OTP)
- Multi-factor authentication (TOTP, SMS)
- Password policies and account recovery
- Email and phone verification
- Hosted UI (pre-built sign-in/sign-up web pages)
- Custom domain for hosted UI (\`auth.yourdomain.com\`)
- Social identity provider federation (Google, Facebook, Apple, SAML/OIDC)

**After successful authentication**, Cognito issues three JWTs:
- **ID Token**: contains user identity claims (sub, email, name, custom attributes, groups). Used to authenticate with backend services.
- **Access Token**: contains scopes and Cognito groups. Used to call Cognito APIs and as the bearer token for API Gateway Cognito authorizers.
- **Refresh Token**: long-lived (default 30 days). Used to get new ID/Access tokens without re-authentication.

**Token lifetimes**:
- Access token: 1 hour default (5 min – 24 hours)
- ID token: 1 hour default (5 min – 24 hours)
- Refresh token: 30 days default (1 hour – 10 years)`,
    },
    {
      heading: "User Pool App Clients",
      body: `An **app client** represents an application that uses the User Pool. Configure:
- Authentication flows (SRP, USER_PASSWORD_AUTH, ALLOW_REFRESH_TOKEN_AUTH)
- Token lifetimes per client
- OAuth 2.0 flows (Authorization Code with PKCE for mobile, Implicit for SPAs — deprecated, Client Credentials for M2M)
- OAuth 2.0 scopes: openid, email, phone, profile, and custom resource server scopes
- Callback URLs and sign-out URLs (required for hosted UI)
- Client secret (for server-side apps; not suitable for mobile/SPA)

**Resource servers**: define custom OAuth 2.0 scopes for your APIs. A resource server represents your API (e.g. \`api.myapp.com\`). Scopes like \`api.myapp.com/read\`, \`api.myapp.com/write\`.

**Multiple app clients**: create separate clients for mobile app, web app, and admin console — each with different settings and allowed OAuth flows.`,
    },
    {
      heading: "Identity Pools (Federated Identities)",
      body: `An **Identity Pool** exchanges third-party tokens for **temporary AWS credentials** via STS.

**Supported identity providers**:
- Cognito User Pool tokens
- Social providers (Google, Facebook, Apple, Amazon)
- SAML and OIDC federation
- Developer authenticated identities (custom auth)
- Unauthenticated (guest) access

**Flow**:
1. User authenticates with Identity Provider → receives JWT or token
2. App calls Cognito Identity Pools \`GetId\` with the token → receives Cognito Identity ID
3. App calls \`GetCredentialsForIdentity\` → STS returns temporary AWS credentials
4. App uses credentials to call AWS services directly (S3, DynamoDB, etc.)

**Roles**:
- *Authenticated role*: IAM role assumed by verified users
- *Unauthenticated role*: IAM role for guest access (limited permissions)
- *Role-based access control*: map identity pool groups or claims to different IAM roles (requires Token-based or rules-based role selection)

**IAM role trust policy**: must trust \`cognito-identity.amazonaws.com\` with conditions on the identity pool ID and user authentication status.`,
    },
    {
      heading: "User Pool Triggers (Lambda)",
      body: `Cognito User Pools support Lambda triggers at various points in the auth lifecycle.

**Pre-sign-up**: validate/transform user attributes; auto-confirm users; auto-verify email/phone.

**Post-confirmation**: triggered after user confirms registration. Use to: create user records in DynamoDB, send welcome emails, sync with CRM.

**Pre-authentication**: validate custom auth conditions before authentication proceeds.

**Post-authentication**: triggered after successful sign-in. Log authentication events, update last-login timestamp.

**Pre-token generation**: modify claims in the ID and access tokens before they are issued. Add custom claims, remove sensitive data, inject group membership.

**Custom authentication challenge** (3 triggers): define custom auth flows (DefineAuthChallenge → CreateAuthChallenge → VerifyAuthChallengeResponse). Use for: passwordless auth (magic links, biometrics), CAPTCHA, custom OTP.

**User migration**: triggered when user doesn't exist in User Pool during sign-in. Look up user in legacy system; if found, migrate to Cognito. Transparent migration without password resets.

**Trigger timeout**: Lambda must respond within **5 seconds**. Failures block the auth flow.`,
    },
    {
      heading: "User Pool Groups",
      body: `**Groups**: organize users into logical groups. Groups can be mapped to IAM roles (for identity pool role resolution).

**Precedence**: assign numerical precedence to groups. If a user belongs to multiple groups, the group with the lowest precedence number determines the IAM role.

**Claims**: group memberships appear in the ID token and access token under \`cognito:groups\`.

**Use cases**: role-based access control in your app (admin vs user vs premium), filtering content, feature flags.`,
    },
    {
      heading: "Cognito with API Gateway",
      body: `**REST API with Cognito User Pool Authorizer**:
1. Client signs in → receives JWT (ID or Access token)
2. Client sends request to API Gateway with \`Authorization: Bearer <token>\`
3. API Gateway validates the JWT against the User Pool (checks signature, expiry, claims)
4. If valid → forwards request to Lambda with user context in \`requestContext.authorizer.claims\`

**Token validation**: API Gateway Cognito authorizer validates:
- Token signature (using User Pool's JWKS endpoint)
- Token expiry (\`exp\` claim)
- Audience (\`aud\` = app client ID for ID token; \`client_id\` for access token)

**Scope validation**: not done automatically by Cognito authorizer — use a Lambda authorizer for scope-based access control.

**HTTP API with JWT authorizer**: HTTP API natively validates JWTs. Configure issuer URL and audience. Cheaper and simpler than REST API Cognito authorizer.`,
    },
    {
      heading: "Security & Advanced Features",
      body: `**Advanced Security Features (ASF)**: compromised credential detection, adaptive authentication (risk-based MFA), threat protection. Additional cost.

**Token revocation**: Cognito supports access token and refresh token revocation. After revocation, existing tokens cannot be used (requires ASF for access token revocation; refresh token revocation always available).

**PKCE (Proof Key for Code Exchange)**: required for Authorization Code flow in mobile/SPA apps. Prevents authorization code interception attacks. No client secret needed.

**Custom domain**: use your own domain for hosted UI (requires SSL certificate in ACM us-east-1).

**Email provider**: Cognito uses SES for email in production. Configure SES for high volume and custom from-address.

**Attribute mapping**: map claims from social/SAML providers to Cognito user attributes automatically on sign-in.`,
    },
    {
      heading: "Cognito with Other Services",
      body: `**Cognito + API Gateway**: authenticate API calls with Cognito JWT. API Gateway validates token automatically — no Lambda authorizer code needed for basic auth.

**Cognito + S3**: User Pool → Identity Pool → temporary AWS credentials → direct S3 upload/download. Use \`aws:username\` or \`cognito-identity.amazonaws.com:sub\` in S3 bucket policy to restrict to user's own files: \`arn:aws:s3:::bucket/\${cognito-identity.amazonaws.com:sub}/*\`.

**Cognito + AppSync**: AppSync natively supports Cognito User Pool auth. Use \`@aws_auth(cognito_groups: ["Admin"])\` in GraphQL schema.

**Cognito + ALB**: ALB can authenticate users with Cognito hosted UI. ALB handles the OAuth 2.0 flow and passes user identity to the target (Lambda, ECS). No custom code needed.

**Cognito + Lambda triggers**: post-confirmation trigger creates DynamoDB user profile, pre-token generation injects custom claims, user migration trigger migrates legacy users.`,
    },
  ],

  keyFacts: [
    "User Pool: authentication (sign-up/sign-in, issues JWTs)",
    "Identity Pool: authorization (exchanges tokens for AWS credentials via STS)",
    "ID token: user identity claims; Access token: scopes/groups; Refresh token: renew tokens",
    "Default token expiry: 1 hour (access/ID), 30 days (refresh)",
    "Lambda triggers must respond within 5 seconds",
    "User Pool groups: appear in cognito:groups claim; mapped to IAM roles via Identity Pool",
    "ALB natively integrates with Cognito for application authentication",
    "PKCE required for Authorization Code flow in mobile/SPA (no client secret)",
    "User migration trigger: migrate legacy users transparently on first sign-in",
    "Pre-token generation trigger: add/remove claims from ID and access tokens",
  ],

  relatedServices: [
    "Amazon API Gateway",
    "AWS Lambda",
    "AWS IAM",
    "AWS STS",
    "Amazon S3",
    "AWS AppSync",
    "Elastic Load Balancing",
    "Amazon SES",
  ],

  examTips: [
    "User Pool = who are you (authentication). Identity Pool = what AWS resources can you access (authorization).",
    "ID token used for identity; Access token used for API calls and Cognito APIs.",
    "Cognito authorizer in API Gateway validates JWT automatically — no code.",
    "Lambda trigger timeout: 5 seconds. Failure blocks the auth flow.",
    "Pre-token generation trigger: customize token claims without changing app sign-in code.",
    "User migration trigger: transparent migration from legacy auth system on first sign-in.",
    "Identity Pool unauthenticated role: allow guest access to specific AWS resources.",
    "PKCE + Authorization Code flow: correct for mobile/SPA; Implicit flow is deprecated.",
    "User Pool groups in ID token under cognito:groups — use for app-level RBAC.",
  ],
};
