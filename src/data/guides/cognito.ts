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
      body: `A **User Pool** is a managed user directory that handles the full authentication lifecycle. When you create a User Pool, Cognito manages user registration (with email or phone verification), password policies, account recovery flows, multi-factor authentication (TOTP or SMS), and social identity provider federation (Google, Facebook, Apple, SAML, OIDC). You can use Cognito's hosted UI — a pre-built set of sign-in and sign-up web pages at a Cognito or custom domain — or build your own UI using the Cognito SDK.

After a user successfully authenticates, Cognito issues three JWTs. The **ID Token** contains identity claims about the user: their \`sub\` (unique user ID), email, name, custom attributes, and group memberships. This is the token you pass to your backend to identify who the user is. The **Access Token** contains scopes and Cognito group information and is used for calling Cognito APIs directly (like \`getUser\` or \`listDevices\`) and as the bearer token for API Gateway Cognito authorizers. The **Refresh Token** is long-lived (default 30 days) and is used to get new ID and Access tokens without requiring the user to sign in again.

Token lifetimes are configurable: Access and ID tokens default to 1 hour (minimum 5 minutes, maximum 24 hours), and Refresh tokens default to 30 days (minimum 1 hour, maximum 10 years). These can be set per app client, so your mobile app and web app can have different token policies.`,
    },
    {
      heading: "User Pool App Clients",
      body: `An **app client** represents an application that authenticates through the User Pool. You might have separate clients for your mobile app, web app, and admin console — each with different settings. The app client is where you configure which authentication flows are allowed (\`SRP\`, \`USER_PASSWORD_AUTH\`, \`ALLOW_REFRESH_TOKEN_AUTH\`), token lifetimes, and OAuth 2.0 settings.

For OAuth 2.0 flows, **Authorization Code with PKCE** is the correct choice for mobile apps and SPAs — PKCE (Proof Key for Code Exchange) prevents authorization code interception without requiring a client secret, which you can't securely store in client-side code. The **Client Credentials** flow is for machine-to-machine (M2M) authentication where no user is involved. The Implicit flow is deprecated.

**Resource servers** let you define custom OAuth 2.0 scopes for your own APIs. A resource server represents your API (like \`api.myapp.com\`) and has scopes (like \`api.myapp.com/read\` and \`api.myapp.com/write\`). Clients can request these scopes and use the resulting Access Token to call your API, where you validate the scope.`,
    },
    {
      heading: "Identity Pools (Federated Identities)",
      body: `While User Pools handle authentication (who are you?), **Identity Pools** handle authorization for AWS resources (what AWS services can you access?). An Identity Pool exchanges a third-party token — from a Cognito User Pool, Google, Facebook, Apple, a SAML provider, or an OIDC provider — for **temporary AWS credentials** via STS.

The flow works in four steps: the user authenticates with their identity provider and receives a token; the app passes that token to Cognito Identity Pools \`GetId\`, which returns a Cognito Identity ID; the app then calls \`GetCredentialsForIdentity\`, which triggers an STS \`AssumeRoleWithWebIdentity\` and returns temporary AWS credentials (AccessKeyId, SecretAccessKey, SessionToken); and the app uses those credentials to call AWS services directly — for example, uploading to an S3 bucket or reading from a DynamoDB table.

\`\`\`typescript
import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const identityClient = new CognitoIdentityClient({ region: "us-east-1" });

async function uploadWithFederatedCredentials(idToken: string) {
  const IDENTITY_POOL_ID = "us-east-1:abc-123";
  const USER_POOL_ID = "cognito-idp.us-east-1.amazonaws.com/us-east-1_XYZ";

  // Step 1: exchange User Pool JWT for a Cognito Identity ID
  const { IdentityId } = await identityClient.send(
    new GetIdCommand({
      IdentityPoolId: IDENTITY_POOL_ID,
      Logins: { [USER_POOL_ID]: idToken },
    })
  );

  // Step 2: exchange Identity ID + JWT for temporary AWS credentials
  const { Credentials } = await identityClient.send(
    new GetCredentialsForIdentityCommand({
      IdentityId: IdentityId!,
      Logins: { [USER_POOL_ID]: idToken },
    })
  );

  // Step 3: use temporary credentials to call AWS directly from the client
  const s3 = new S3Client({
    credentials: {
      accessKeyId: Credentials!.AccessKeyId!,
      secretAccessKey: Credentials!.SecretKey!,
      sessionToken: Credentials!.SessionToken,
    },
  });

  await s3.send(
    new PutObjectCommand({ Bucket: "my-bucket", Key: "file.txt", Body: "hi" })
  );
}
\`\`\`

Identity Pools assign different IAM roles based on authentication status. The **authenticated role** is assumed by users who have provided a valid identity provider token. The **unauthenticated role** allows limited access for guest users who haven't logged in — useful for letting anonymous users view public content stored in S3 or DynamoDB. You can also configure role-based access control that maps Cognito groups or token claims to different IAM roles, giving different tiers of users different AWS permissions.`,
    },
    {
      heading: "User Pool Triggers (Lambda)",
      body: `Cognito User Pools can invoke Lambda functions at key points in the authentication and registration lifecycle, allowing you to customize behavior without building a custom auth service.

The **Pre-Sign-Up** trigger fires before a user is created. You can validate custom attributes, automatically confirm users (skipping the verification email), or block registrations from certain domains. The **Post-Confirmation** trigger fires after a user confirms their account — the ideal place to create a user record in DynamoDB, send a welcome email, or sync the new user to a CRM. **Pre-Authentication** lets you validate custom conditions before authentication proceeds. **Post-Authentication** fires after successful sign-in and is useful for logging events or updating timestamps.

The **Pre-Token Generation** trigger is particularly powerful — it fires just before Cognito issues tokens and lets you modify the claims that appear in the ID Token and Access Token. You can inject custom attributes, add group memberships, or remove claims you don't want clients to see, all without changing your application's sign-in flow.

\`\`\`typescript
// Pre-Token Generation trigger — must respond within 5 seconds
export const handler = async (event: {
  request: { userAttributes: Record<string, string> };
  response: {
    claimsOverrideDetails?: {
      claimsToAddOrOverride?: Record<string, string>;
      claimsToSuppress?: string[];
    };
  };
}) => {
  // Add a custom claim to the ID token
  event.response.claimsOverrideDetails = {
    claimsToAddOrOverride: {
      tier: event.request.userAttributes["custom:tier"] ?? "free",
    },
    // Remove phone_number from the token if not needed by clients
    claimsToSuppress: ["phone_number"],
  };

  return event; // must return the modified event object
};
\`\`\`

The **Custom Authentication** flow uses three triggers in sequence (DefineAuthChallenge, CreateAuthChallenge, VerifyAuthChallengeResponse) to implement completely custom authentication schemes — magic link emails, biometric verification, CAPTCHA, or custom OTP systems. The **User Migration** trigger enables transparent migration from legacy auth systems: when a user who doesn't exist in Cognito tries to sign in, the trigger fires and looks them up in the old system; if found, they're migrated to Cognito automatically without a password reset. All Lambda triggers must respond within **5 seconds** — a timeout causes the auth flow to fail.`,
    },
    {
      heading: "User Pool Groups",
      body: `Cognito User Pool groups provide a simple way to organize users into logical categories and assign them different IAM roles. When you add a user to a group, that group membership appears in both the ID Token and Access Token under the \`cognito:groups\` claim. Your application code can read this claim to implement role-based features — showing admin UI only to users in the Admin group, or enabling premium features for users in the Premium group.

Groups have a **precedence** value (a number). When a user belongs to multiple groups, the group with the lowest precedence number takes priority for IAM role assignment through the Identity Pool. This allows you to model a hierarchy — Admin (precedence 1) overrides Member (precedence 10) — without writing custom logic.`,
    },
    {
      heading: "Cognito with API Gateway",
      body: `The most common integration pattern is using a Cognito User Pool to authenticate API Gateway calls. After signing in, the client includes the JWT (ID token or Access token) in the \`Authorization\` header as a Bearer token. API Gateway's Cognito User Pool Authorizer validates this token automatically: it checks the signature using the User Pool's JWKS endpoint, verifies the token hasn't expired, and validates the audience claim (the app client ID). No Lambda code is needed for this validation — it's built into API Gateway.

Once validated, the user's token claims are forwarded to the Lambda function in the \`requestContext.authorizer.claims\` object. Your Lambda can access the user's \`sub\`, \`email\`, group memberships, and any custom attributes to make authorization decisions.

One important limitation: the Cognito authorizer validates token authenticity but does not enforce OAuth scopes. If you need scope-based access control (for example, requiring the \`api.myapp.com/write\` scope on POST endpoints), you need a Lambda authorizer that explicitly checks for the required scope. For HTTP APIs, the JWT authorizer built into API Gateway v2 handles both token validation and scope checking natively.`,
    },
    {
      heading: "Security & Advanced Features",
      body: `**Advanced Security Features (ASF)** adds a layer of adaptive authentication on top of standard Cognito. It uses machine learning to analyze each authentication attempt and assign a risk score based on signals like unusual location, new device, or impossible travel. High-risk sign-ins can be blocked, required to complete MFA, or just logged — you configure the policy. ASF also includes compromised credential detection, checking submitted passwords against known data breaches. There is an additional per-monthly-active-user cost.

**PKCE** (Proof Key for Code Exchange) is required for mobile and SPA applications using the Authorization Code flow. It prevents an attacker who intercepts the authorization code from exchanging it for tokens, because the code exchange requires knowledge of a code verifier that never leaves the client. No client secret is needed with PKCE.

Cognito uses **Amazon SES** for sending verification emails in production volumes. The default Cognito email address has a low sending limit — for production applications with significant sign-up volume, configure your User Pool to use your own SES identity. For custom domains on the hosted UI, you must provide an ACM certificate in us-east-1, similar to CloudFront.`,
    },
    {
      heading: "Cognito with Other Services",
      body: `The most common Cognito integration pattern combines User Pools for authentication with Identity Pools for direct AWS resource access. A user signs in through the User Pool, receives a JWT, exchanges it through the Identity Pool for temporary AWS credentials, and then uploads directly to S3 or reads from DynamoDB without routing through a backend. S3 bucket policies can restrict access to each user's own prefix using the \`cognito-identity.amazonaws.com:sub\` identity pool claim: \`arn:aws:s3:::bucket/\${cognito-identity.amazonaws.com:sub}/*\`.

**Application Load Balancers** natively support Cognito authentication. The ALB handles the entire OAuth 2.0 Authorization Code flow — redirecting users to the Cognito hosted UI, exchanging the authorization code for tokens, and passing the user's identity to the backend target (Lambda or ECS) in HTTP headers. This requires no custom code for the authentication flow.

**AppSync** natively supports Cognito User Pools as an authorization mode. You can use \`@aws_auth(cognito_groups: ["Admin"])\` directives in your GraphQL schema to restrict access at the type or field level based on group membership. The \`$ctx.identity.claims\` context object in AppSync resolvers gives you access to all token claims for fine-grained authorization logic.`,
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
