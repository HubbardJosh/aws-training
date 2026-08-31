import { ServiceGuide } from "../../../types/guide";

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
      body: `A **User Pool** is a managed user directory that handles the full authentication lifecycle. When you create a User Pool, Cognito manages user registration (with email or phone verification), password policies, account recovery flows, multi-factor authentication (TOTP or SMS), and social identity provider federation (Google, Facebook, Apple, SAML, OIDC). You can use Cognito's hosted UI — a pre-built set of sign-in and sign-up web pages at a Cognito or custom domain — or build your own UI using the Cognito SDK.

After a user successfully authenticates, Cognito issues three JWTs. The **ID Token** contains identity claims about the user: their \`sub\` (unique user ID), email, name, custom attributes, and group memberships. This is the token you pass to your backend to identify who the user is. The **Access Token** contains scopes and Cognito group information and is used for calling Cognito APIs directly (like \`getUser\` or \`listDevices\`) and as the bearer token for API Gateway Cognito authorizers. The **Refresh Token** is long-lived (default 30 days) and is used to get new ID and Access tokens without requiring the user to sign in again.

Token lifetimes are configurable: Access and ID tokens default to 1 hour (minimum 5 minutes, maximum 24 hours), and Refresh tokens default to 30 days (minimum 1 hour, maximum 10 years). These can be set per app client, so your mobile app and web app can have different token policies.`,
      quiz: [
        {
          question:
            "Which Cognito token contains the user's identity claims such as email, name, and group memberships?",
          options: [
            "Session Token",
            "Access Token",
            "Refresh Token",
            "ID Token",
          ],
          correctIndex: 3,
          explanation:
            "The ID Token contains identity claims about the authenticated user including their sub (unique ID), email, name, custom attributes, and group memberships. This is the token passed to your backend to identify who the user is.",
        },
        {
          question: "What is the default lifetime of a Cognito Refresh Token?",
          options: ["1 hour", "24 hours", "30 days", "1 year"],
          correctIndex: 2,
          explanation:
            "Cognito Refresh Tokens default to 30 days. They are used to obtain new ID and Access tokens without requiring the user to sign in again. The minimum is 1 hour and maximum is 10 years.",
        },
        {
          question:
            "Which Cognito token is used as the bearer token for API Gateway Cognito authorizers?",
          options: [
            "Either ID or Refresh Token",
            "Refresh Token",
            "ID Token",
            "Access Token",
          ],
          correctIndex: 3,
          explanation:
            "The Access Token is used as the bearer token for API Gateway Cognito authorizers and for calling Cognito APIs directly. The ID Token is used for identifying the user to your own backend.",
        },
      ],
    },
    {
      heading: "User Pool App Clients",
      body: `An **app client** represents an application that authenticates through the User Pool. You might have separate clients for your mobile app, web app, and admin console — each with different settings. The app client is where you configure which authentication flows are allowed (\`SRP\`, \`USER_PASSWORD_AUTH\`, \`ALLOW_REFRESH_TOKEN_AUTH\`), token lifetimes, and OAuth 2.0 settings.

For OAuth 2.0 flows, **Authorization Code with PKCE** is the correct choice for mobile apps and SPAs — PKCE (Proof Key for Code Exchange) prevents authorization code interception without requiring a client secret, which you can't securely store in client-side code. The **Client Credentials** flow is for machine-to-machine (M2M) authentication where no user is involved. The Implicit flow is deprecated.

**Resource servers** let you define custom OAuth 2.0 scopes for your own APIs. A resource server represents your API (like \`api.myapp.com\`) and has scopes (like \`api.myapp.com/read\` and \`api.myapp.com/write\`). Clients can request these scopes and use the resulting Access Token to call your API, where you validate the scope.`,
      quiz: [
        {
          question:
            "Which OAuth 2.0 flow is correct for mobile apps and SPAs authenticating with Cognito?",
          options: [
            "Authorization Code flow with PKCE",
            "Implicit flow",
            "Resource Owner Password flow",
            "Client Credentials flow",
          ],
          correctIndex: 0,
          explanation:
            "Authorization Code with PKCE is correct for mobile apps and SPAs. PKCE prevents authorization code interception without requiring a client secret, which cannot be securely stored in client-side code. The Implicit flow is deprecated.",
        },
        {
          question:
            "Which OAuth 2.0 flow should be used for machine-to-machine (M2M) authentication with Cognito where no user is involved?",
          options: [
            "Authorization Code with PKCE",
            "Implicit flow",
            "Client Credentials flow",
            "Refresh Token flow",
          ],
          correctIndex: 2,
          explanation:
            "The Client Credentials flow is designed for M2M authentication where there is no end user. The client application authenticates directly using its client ID and secret to obtain an Access Token.",
        },
        {
          question: "What is a Cognito resource server used for?",
          options: [
            "Defining custom OAuth 2.0 scopes for your own APIs",
            "Storing user profile data in DynamoDB",
            "Hosting the Cognito hosted UI on a custom domain",
            "Configuring the token lifetime for app clients",
          ],
          correctIndex: 0,
          explanation:
            "Resource servers define custom OAuth 2.0 scopes for your own APIs. A resource server represents your API and its scopes, which clients can request and include in Access Tokens for authorization.",
        },
      ],
    },
    {
      heading: "Identity Pools (Federated Identities)",
      body: `While User Pools handle authentication (who are you?), **Identity Pools** handle authorization for AWS resources (what AWS services can you access?). An Identity Pool exchanges a third-party token — from a Cognito User Pool, Google, Facebook, Apple, a SAML provider, or an OIDC provider — for **temporary AWS credentials** via STS.

The flow works in four steps: the user authenticates with their identity provider and receives a token; the app passes that token to Cognito Identity Pools \`GetId\`, which returns a Cognito Identity ID; the app then calls \`GetCredentialsForIdentity\`, which triggers an STS \`AssumeRoleWithWebIdentity\` and returns temporary AWS credentials (AccessKeyId, SecretAccessKey, SessionToken); and the app uses those credentials to call AWS services directly — for example, uploading to an S3 bucket or reading from a DynamoDB table.

Identity Pools assign different IAM roles based on authentication status. The **authenticated role** is assumed by users who have provided a valid identity provider token. The **unauthenticated role** allows limited access for guest users who haven't logged in — useful for letting anonymous users view public content stored in S3 or DynamoDB. You can also configure role-based access control that maps Cognito groups or token claims to different IAM roles, giving different tiers of users different AWS permissions.`,
      quiz: [
        {
          question:
            "What does a Cognito Identity Pool exchange a User Pool JWT for?",
          options: [
            "A new, longer-lived JWT for API Gateway",
            "Temporary AWS credentials via STS",
            "An IAM user access key and secret",
            "A Cognito-signed cookie for the hosted UI",
          ],
          correctIndex: 1,
          explanation:
            "Identity Pools call STS AssumeRoleWithWebIdentity to exchange a User Pool JWT (or other provider token) for temporary AWS credentials — an AccessKeyId, SecretAccessKey, and SessionToken — that the app uses to call AWS services directly.",
        },
        {
          question:
            "What is the purpose of the unauthenticated role in a Cognito Identity Pool?",
          options: [
            "To grant admin-level AWS access for testing purposes",
            "To handle token refresh for expired User Pool sessions",
            "To allow the Identity Pool itself to call AWS services",
            "To provide limited AWS resource access to guest users who have not logged in",
          ],
          correctIndex: 3,
          explanation:
            "The unauthenticated role is assumed by guest users who have not authenticated. It enables anonymous access to specific AWS resources such as public S3 content or DynamoDB read-only access.",
        },
        {
          question:
            "Which STS API action does a Cognito Identity Pool use internally to vend temporary credentials?",
          options: [
            "AssumeRoleWithSAML",
            "AssumeRole",
            "GetSessionToken",
            "AssumeRoleWithWebIdentity",
          ],
          correctIndex: 3,
          explanation:
            "Cognito Identity Pools call STS AssumeRoleWithWebIdentity internally when exchanging a provider token for temporary AWS credentials. This is the web identity federation mechanism.",
        },
      ],
    },
    {
      heading: "User Pool Triggers (Lambda)",
      body: `Cognito User Pools can invoke Lambda functions at key points in the authentication and registration lifecycle, allowing you to customize behavior without building a custom auth service.

The **Pre-Sign-Up** trigger fires before a user is created. You can validate custom attributes, automatically confirm users (skipping the verification email), or block registrations from certain domains. The **Post-Confirmation** trigger fires after a user confirms their account — the ideal place to create a user record in DynamoDB, send a welcome email, or sync the new user to a CRM. **Pre-Authentication** lets you validate custom conditions before authentication proceeds. **Post-Authentication** fires after successful sign-in and is useful for logging events or updating timestamps.

The **Pre-Token Generation** trigger is particularly powerful — it fires just before Cognito issues tokens and lets you modify the claims that appear in the ID Token and Access Token. You can inject custom attributes, add group memberships, or remove claims you don't want clients to see, all without changing your application's sign-in flow.

The **Custom Authentication** flow uses three triggers in sequence (DefineAuthChallenge, CreateAuthChallenge, VerifyAuthChallengeResponse) to implement completely custom authentication schemes — magic link emails, biometric verification, CAPTCHA, or custom OTP systems. The **User Migration** trigger enables transparent migration from legacy auth systems: when a user who doesn't exist in Cognito tries to sign in, the trigger fires and looks them up in the old system; if found, they're migrated to Cognito automatically without a password reset. All Lambda triggers must respond within **5 seconds** — a timeout causes the auth flow to fail.`,
      quiz: [
        {
          question:
            "Which Cognito Lambda trigger fires just before tokens are issued and allows modifying token claims?",
          options: [
            "Post-Confirmation",
            "Pre-Token Generation",
            "Post-Authentication",
            "Pre-Authentication",
          ],
          correctIndex: 1,
          explanation:
            "The Pre-Token Generation trigger fires just before Cognito issues tokens. It allows you to add, modify, or remove claims in the ID Token and Access Token without changing the application's sign-in flow.",
        },
        {
          question:
            "What is the maximum time a Cognito Lambda trigger has to respond before the auth flow fails?",
          options: ["1 second", "5 seconds", "30 seconds", "60 seconds"],
          correctIndex: 1,
          explanation:
            "All Cognito Lambda triggers must respond within 5 seconds. A timeout causes the auth flow to fail and the user receives an error. Keep trigger logic fast and lightweight.",
        },
        {
          question:
            "Which Cognito trigger enables transparent migration of users from a legacy auth system on their first sign-in?",
          options: [
            "Post-Confirmation trigger",
            "User Migration trigger",
            "Pre-Sign-Up trigger",
            "Custom Authentication trigger",
          ],
          correctIndex: 1,
          explanation:
            "The User Migration trigger fires when a user not found in Cognito attempts to sign in. The Lambda looks them up in the legacy system, and if found, migrates them to Cognito transparently — no password reset required.",
        },
      ],
    },
    {
      heading: "User Pool Groups",
      body: `Cognito User Pool groups provide a simple way to organize users into logical categories and assign them different IAM roles. When you add a user to a group, that group membership appears in both the ID Token and Access Token under the \`cognito:groups\` claim. Your application code can read this claim to implement role-based features — showing admin UI only to users in the Admin group, or enabling premium features for users in the Premium group.

Groups have a **precedence** value (a number). When a user belongs to multiple groups, the group with the lowest precedence number takes priority for IAM role assignment through the Identity Pool. This allows you to model a hierarchy — Admin (precedence 1) overrides Member (precedence 10) — without writing custom logic.`,
      quiz: [
        {
          question:
            "Where does Cognito User Pool group membership appear in the issued tokens?",
          options: [
            "In the Refresh Token as a custom claim",
            "In both the ID Token and Access Token under the cognito:groups claim",
            "In the ID Token only, not the Access Token",
            "In a separate groups token issued alongside the ID Token",
          ],
          correctIndex: 1,
          explanation:
            "Group memberships appear in both the ID Token and Access Token under the cognito:groups claim. Application code reads this claim to implement role-based UI features and access control.",
        },
        {
          question:
            "A user belongs to both the Admin group (precedence 1) and the Member group (precedence 10). Which group's IAM role is assigned via the Identity Pool?",
          options: [
            "Member, because it has the higher precedence number",
            "Admin, because it has the lower precedence number",
            "Both roles are merged into a combined permission set",
            "Neither — multi-group users cannot use Identity Pools",
          ],
          correctIndex: 1,
          explanation:
            "The group with the lowest precedence number takes priority for IAM role assignment through the Identity Pool. Precedence 1 (Admin) overrides precedence 10 (Member).",
        },
        {
          question:
            "How does an application use Cognito User Pool group membership for access control?",
          options: [
            "By calling a separate Cognito API to retrieve group membership on each request",
            "By reading the cognito:groups claim in the ID or Access Token",
            "By querying a DynamoDB table that Cognito maintains",
            "By checking a special cookie set by the Cognito hosted UI",
          ],
          correctIndex: 1,
          explanation:
            "Application code reads the cognito:groups claim from the decoded ID Token or Access Token to determine group membership and make authorization decisions such as showing admin features or enabling premium content.",
        },
      ],
    },
    {
      heading: "Cognito with API Gateway",
      body: `The most common integration pattern is using a Cognito User Pool to authenticate API Gateway calls. After signing in, the client includes the JWT (ID token or Access token) in the \`Authorization\` header as a Bearer token. API Gateway's Cognito User Pool Authorizer validates this token automatically: it checks the signature using the User Pool's JWKS endpoint, verifies the token hasn't expired, and validates the audience claim (the app client ID). No Lambda code is needed for this validation — it's built into API Gateway.

Once validated, the user's token claims are forwarded to the Lambda function in the \`requestContext.authorizer.claims\` object. Your Lambda can access the user's \`sub\`, \`email\`, group memberships, and any custom attributes to make authorization decisions.

One important limitation: the Cognito authorizer validates token authenticity but does not enforce OAuth scopes. If you need scope-based access control (for example, requiring the \`api.myapp.com/write\` scope on POST endpoints), you need a Lambda authorizer that explicitly checks for the required scope. For HTTP APIs, the JWT authorizer built into API Gateway v2 handles both token validation and scope checking natively.`,
      quiz: [
        {
          question:
            "How does API Gateway's Cognito User Pool Authorizer validate a JWT without Lambda code?",
          options: [
            "It checks the signature using the User Pool's JWKS endpoint and validates expiry and audience",
            "It decrypts the token using a KMS key shared with Cognito",
            "It calls Cognito's GetUser API on every request",
            "It forwards the token to the Lambda function for validation",
          ],
          correctIndex: 0,
          explanation:
            "API Gateway's Cognito authorizer validates JWTs by fetching the User Pool's public JWKS (JSON Web Key Set) to verify the token signature, checking expiry, and validating the audience claim (app client ID) — all without Lambda code.",
        },
        {
          question:
            "What is a key limitation of the API Gateway Cognito User Pool Authorizer compared to a Lambda authorizer?",
          options: [
            "It cannot validate ID tokens, only Access tokens",
            "It validates token authenticity but does not enforce OAuth scopes",
            "It adds more than 500ms of latency per request",
            "It only works with Cognito User Pools, not third-party JWTs",
          ],
          correctIndex: 1,
          explanation:
            "The Cognito authorizer validates that the token is authentic and not expired, but it does not check OAuth scopes. For scope-based access control you need a Lambda authorizer or the HTTP API's native JWT authorizer which supports scope enforcement.",
        },
        {
          question:
            "After Cognito authorizer validation succeeds, where are the token claims available in the Lambda function?",
          options: [
            "In the event.headers.Authorization field",
            "In the requestContext.authorizer.claims object",
            "In a separate claims event passed alongside the main event",
            "In the Lambda context object",
          ],
          correctIndex: 1,
          explanation:
            "After successful Cognito authorizer validation, the token claims are forwarded to the Lambda function in event.requestContext.authorizer.claims. The Lambda can access sub, email, cognito:groups, and custom attributes from there.",
        },
      ],
    },
    {
      heading: "Security & Advanced Features",
      body: `**Advanced Security Features (ASF)** adds a layer of adaptive authentication on top of standard Cognito. It uses machine learning to analyze each authentication attempt and assign a risk score based on signals like unusual location, new device, or impossible travel. High-risk sign-ins can be blocked, required to complete MFA, or just logged — you configure the policy. ASF also includes compromised credential detection, checking submitted passwords against known data breaches. There is an additional per-monthly-active-user cost.

**PKCE** (Proof Key for Code Exchange) is required for mobile and SPA applications using the Authorization Code flow. It prevents an attacker who intercepts the authorization code from exchanging it for tokens, because the code exchange requires knowledge of a code verifier that never leaves the client. No client secret is needed with PKCE.

Cognito uses **Amazon SES** for sending verification emails in production volumes. The default Cognito email address has a low sending limit — for production applications with significant sign-up volume, configure your User Pool to use your own SES identity. For custom domains on the hosted UI, you must provide an ACM certificate in us-east-1, similar to CloudFront.`,
      quiz: [
        {
          question:
            "What does Cognito Advanced Security Features (ASF) use to assign a risk score to each authentication attempt?",
          options: [
            "Static IP allowlists configured by the administrator",
            "Machine learning analysis of signals like unusual location, new device, or impossible travel",
            "The number of failed login attempts in the past 24 hours",
            "Custom Lambda triggers that return a risk score",
          ],
          correctIndex: 1,
          explanation:
            "ASF uses machine learning to analyze authentication signals including location anomalies, new devices, and impossible travel patterns. Based on the risk score, sign-ins can be blocked, challenged with MFA, or just logged.",
        },
        {
          question:
            "Why is PKCE required for mobile and SPA apps using the Authorization Code flow?",
          options: [
            "Because mobile apps cannot store a client secret securely",
            "Because PKCE reduces token lifetime to improve security",
            "Because mobile apps require a different token format than web apps",
            "Because PKCE is required by the Cognito hosted UI for all clients",
          ],
          correctIndex: 0,
          explanation:
            "Mobile apps and SPAs cannot securely store a client secret (it would be visible in app code or JavaScript). PKCE prevents authorization code interception attacks without requiring a client secret — making it the correct flow for public clients.",
        },
        {
          question:
            "Which AWS service does Cognito use for sending verification emails in production?",
          options: [
            "Amazon SES",
            "Amazon SNS",
            "Amazon Pinpoint",
            "AWS Lambda with SES integration",
          ],
          correctIndex: 0,
          explanation:
            "Cognito uses Amazon SES for sending verification and confirmation emails. The default Cognito email has a low sending limit, so production applications with significant sign-up volume should configure Cognito to use their own SES identity.",
        },
      ],
    },
    {
      heading: "Cognito with Other Services",
      body: `The most common Cognito integration pattern combines User Pools for authentication with Identity Pools for direct AWS resource access. A user signs in through the User Pool, receives a JWT, exchanges it through the Identity Pool for temporary AWS credentials, and then uploads directly to S3 or reads from DynamoDB without routing through a backend. S3 bucket policies can restrict access to each user's own prefix using the \`cognito-identity.amazonaws.com:sub\` identity pool claim: \`arn:aws:s3:::bucket/\${cognito-identity.amazonaws.com:sub}/*\`.

**Application Load Balancers** natively support Cognito authentication. The ALB handles the entire OAuth 2.0 Authorization Code flow — redirecting users to the Cognito hosted UI, exchanging the authorization code for tokens, and passing the user's identity to the backend target (Lambda or ECS) in HTTP headers. This requires no custom code for the authentication flow.

**AppSync** natively supports Cognito User Pools as an authorization mode. You can use \`@aws_auth(cognito_groups: ["Admin"])\` directives in your GraphQL schema to restrict access at the type or field level based on group membership. The \`$ctx.identity.claims\` context object in AppSync resolvers gives you access to all token claims for fine-grained authorization logic.`,
      quiz: [
        {
          question:
            "How can an S3 bucket policy restrict each user to their own prefix using Cognito Identity Pools?",
          options: [
            "By tagging each S3 object with the user's Cognito sub",
            "By using a Lambda authorizer on S3 API calls",
            "By using the aws:username condition key",
            "By using the cognito-identity.amazonaws.com:sub claim in the bucket policy resource ARN",
          ],
          correctIndex: 3,
          explanation:
            "S3 bucket policies can use the cognito-identity.amazonaws.com:sub condition to restrict each user to their own prefix: arn:aws:s3:::bucket/${cognito-identity.amazonaws.com:sub}/*. This is evaluated per-request using the temporary credentials from the Identity Pool.",
        },
        {
          question:
            "When an Application Load Balancer is configured with Cognito authentication, what does the ALB handle automatically?",
          options: [
            "Issuing custom JWTs for the backend application",
            "The entire OAuth 2.0 Authorization Code flow including redirect and token exchange",
            "Storing user sessions in ElastiCache",
            "MFA challenges for high-risk users",
          ],
          correctIndex: 1,
          explanation:
            "An ALB with Cognito authentication handles the full OAuth 2.0 Authorization Code flow — redirecting unauthenticated users to the Cognito hosted UI, exchanging the authorization code for tokens, and forwarding the user's identity to backend targets in HTTP headers.",
        },
        {
          question:
            "In AppSync, how can you restrict a GraphQL type to users in the Admin Cognito group?",
          options: [
            "By using the @aws_auth(cognito_groups: [\"Admin\"]) directive in the GraphQL schema",
            'By adding a Lambda authorizer that checks the cognito:groups claim',
            "By filtering the resolver response based on the user's group",
            "By creating a separate AppSync API for admin users",
          ],
          correctIndex: 0,
          explanation:
            'AppSync natively supports Cognito User Pools as an authorization mode. The @aws_auth(cognito_groups: ["Admin"]) directive restricts access to a type or field to members of the specified Cognito group without any custom code.',
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A developer needs to allow unauthenticated guest users to read public items from a DynamoDB table directly from the mobile app. Which Cognito component enables this?",
      options: [
        "Cognito Advanced Security Features guest mode",
        "User Pool with a guest app client",
        "User Pool group with precedence 0",
        "Identity Pool unauthenticated role with DynamoDB read permissions",
      ],
      correctIndex: 3,
      explanation:
        "The Identity Pool unauthenticated role is assumed by guest users who have not authenticated. By attaching DynamoDB read permissions to this role, anonymous users can access the table directly without signing in.",
    },
    {
      question:
        "A Cognito Lambda trigger takes 8 seconds to complete due to a slow DynamoDB write. What happens to the user's authentication?",
      options: [
        "The authentication succeeds but the trigger result is ignored",
        "The user is placed in a pending state until the trigger completes",
        "The authentication fails because Lambda triggers must respond within 5 seconds",
        "Cognito retries the trigger up to 3 times before failing",
      ],
      correctIndex: 2,
      explanation:
        "All Cognito Lambda triggers must respond within 5 seconds. A trigger that takes 8 seconds will time out, causing the authentication flow to fail and returning an error to the user.",
    },
    {
      question:
        "Which Cognito token should a backend API validate to identify the calling user?",
      options: [
        "Either the Access or Refresh Token — they contain the same claims",
        "ID Token, because it contains identity claims like sub and email",
        "Access Token, because it contains AWS credentials",
        "Refresh Token, because it is the longest-lived",
      ],
      correctIndex: 1,
      explanation:
        "The ID Token contains identity claims about the user — sub, email, name, group memberships, and custom attributes. Backend APIs validate the ID Token to identify who is making the request.",
    },
    {
      question:
        "A mobile app needs to let users upload photos directly to S3 using their own credentials. User Pool authentication is already in place. What is needed?",
      options: [
        "A Cognito Identity Pool to exchange the User Pool JWT for temporary AWS credentials",
        "An IAM user with S3 permissions distributed with the app",
        "A Lambda function that generates pre-signed S3 URLs",
        "An API Gateway endpoint that proxies the S3 upload",
      ],
      correctIndex: 0,
      explanation:
        "A Cognito Identity Pool exchanges the User Pool JWT for temporary AWS credentials via STS. The mobile app can then use those credentials to upload directly to S3 without routing through a backend.",
    },
    {
      question:
        "Which OAuth 2.0 flow is deprecated and should NOT be used for new Cognito integrations?",
      options: [
        "Authorization Code with PKCE",
        "Client Credentials",
        "Implicit flow",
        "Refresh Token flow",
      ],
      correctIndex: 2,
      explanation:
        "The Implicit flow is deprecated. For SPAs and mobile apps, use Authorization Code with PKCE. For machine-to-machine, use Client Credentials. The Implicit flow has security weaknesses as tokens are exposed in the URL fragment.",
    },
    {
      question:
        "A developer wants to add a custom 'subscription_tier' claim to Cognito JWTs without changing the sign-in flow. Which trigger should they use?",
      options: [
        "Pre-Authentication trigger",
        "Pre-Token Generation trigger",
        "Custom Authentication trigger",
        "Post-Confirmation trigger",
      ],
      correctIndex: 1,
      explanation:
        "The Pre-Token Generation trigger fires just before Cognito issues tokens and allows modifying the claims that appear in the ID Token and Access Token. This is the correct way to inject custom claims without changing the sign-in flow.",
    },
    {
      question:
        "A user belongs to both the Premium group (precedence 5) and the Basic group (precedence 20) in Cognito. Which IAM role does the Identity Pool assign?",
      options: [
        "Basic, because it has the higher precedence number",
        "Premium, because it has the lower precedence number",
        "A merged role combining permissions from both groups",
        "Neither — the user must be in only one group to use the Identity Pool",
      ],
      correctIndex: 1,
      explanation:
        "The Cognito group with the lowest precedence number takes priority for IAM role assignment through the Identity Pool. Premium (precedence 5) overrides Basic (precedence 20).",
    },
    {
      question:
        "What is the primary purpose of a Cognito User Pool compared to an Identity Pool?",
      options: [
        "User Pool handles authentication and issues JWTs; Identity Pool exchanges tokens for AWS credentials",
        "User Pool grants temporary AWS credentials; Identity Pool handles authentication",
        "User Pool and Identity Pool are interchangeable — either can be used for authentication",
        "User Pool stores user attributes in DynamoDB; Identity Pool manages OAuth scopes",
      ],
      correctIndex: 0,
      explanation:
        "User Pool = authentication (who are you? — handles sign-up, sign-in, MFA, issues JWTs). Identity Pool = authorization for AWS resources (what can you access? — exchanges tokens for temporary AWS credentials via STS).",
    },
  ],
};
