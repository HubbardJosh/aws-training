import { ServiceGuide } from "../../types/guide";

export const amplifyGuide: ServiceGuide = {
  id: "aws-amplify",
  service: "AWS Amplify",
  domain: "deployment",
  tagline: "Full-stack web and mobile app platform for rapid development",
  intro:
    "AWS Amplify is a set of tools and services for building full-stack web and mobile applications. It includes Amplify Hosting (CI/CD + CDN for frontend apps), Amplify Studio (visual app builder), and Amplify Libraries (frontend SDK for Auth, API, Storage, Analytics). Amplify provisions and connects AWS services (Cognito, AppSync, S3, DynamoDB) automatically.",

  sections: [
    {
      heading: "Amplify Hosting",
      body: `**Amplify Hosting**: fully managed CI/CD + hosting for web apps (React, Next.js, Vue, Angular, Gatsby, Hugo, plain HTML).

**Connect a repository**: link GitHub, Bitbucket, GitLab, or CodeCommit. Amplify deploys on every push.

**Build settings**: \`amplify.yml\` (or auto-detected by framework):
\`\`\`yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
\`\`\`

**Branch deployments**: each Git branch gets its own URL (\`dev.d111.amplifyapp.com\`, \`main.d111.amplifyapp.com\`). Deploy previews on pull requests.

**Custom domain**: add your domain → Amplify provisions ACM certificate and configures CloudFront automatically.

**SSR support**: Next.js server-side rendering natively supported. Amplify runs the Next.js server.

**Password protection**: add basic auth to a branch deployment (e.g. protect staging from public access).

**Redirects and rewrites**: configure URL rules (SPA fallback, domain redirects, proxy rules) in the console.`,
    },
    {
      heading: "Amplify Backend (Gen 2)",
      body: `**Amplify Gen 2** (current): define backend using TypeScript code (not CLI prompts). Backend defined as code, version-controlled, and deployed with the frontend.

\`\`\`typescript
// amplify/auth/resource.ts
import { defineAuth } from '@aws-amplify/backend';

export const auth = defineAuth({
  loginWith: { email: true },
});

// amplify/data/resource.ts
import { defineData, a } from '@aws-amplify/backend';

const schema = a.schema({
  Todo: a.model({
    content: a.string(),
    isDone: a.boolean(),
  }).authorization(allow => [allow.owner()]),
});

export const data = defineData({ schema });
\`\`\`

**Amplify Gen 1**: CLI-based (\`amplify add auth\`, \`amplify add api\`). Generates CloudFormation. Still widely used.

**Resources provisioned**:
- Auth → Amazon Cognito User Pool + Identity Pool
- API (GraphQL) → AWS AppSync + DynamoDB
- API (REST) → API Gateway + Lambda
- Storage → S3
- Functions → Lambda
- Analytics → Amazon Pinpoint
- Geo → Amazon Location Service`,
    },
    {
      heading: "Amplify Libraries (Frontend SDK)",
      body: `**Amplify JavaScript/TypeScript library**: npm package (\`aws-amplify\`) for React, React Native, Vue, Angular, Next.js.

**Configure**:
\`\`\`typescript
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);
\`\`\`

**Auth**:
\`\`\`typescript
import { signIn, signUp, signOut, fetchAuthSession } from 'aws-amplify/auth';
await signIn({ username: 'user@email.com', password: 'pass' });
const { tokens } = await fetchAuthSession(); // get JWT tokens
\`\`\`

**API (GraphQL)**:
\`\`\`typescript
import { generateClient } from 'aws-amplify/api';
const client = generateClient();
const result = await client.graphql({ query: listTodos });
\`\`\`

**Storage**:
\`\`\`typescript
import { uploadData, getUrl } from 'aws-amplify/storage';
await uploadData({ key: 'photo.jpg', data: file });
const url = await getUrl({ key: 'photo.jpg' });
\`\`\`

**UI Components**: \`@aws-amplify/ui-react\` provides pre-built UI components:
- \`<Authenticator>\`: complete sign-in/sign-up UI
- \`<StorageImage>\`: display S3 images with auth
- \`<FileUploader>\`: file upload with progress`,
    },
    {
      heading: "Amplify Auth & Data",
      body: `**Auth (Cognito)**: Amplify creates a Cognito User Pool and Identity Pool. Handles:
- Email/phone sign-up with verification
- Social providers (Google, Facebook, Apple)
- SAML/OIDC federation
- MFA (TOTP, SMS)
- Custom auth flows

**Data / API (AppSync + DynamoDB)**: Amplify's Data category creates an AppSync GraphQL API with DynamoDB tables per model. Authorization rules:
- \`allow.owner()\`: users can only access their own records
- \`allow.authenticated()\`: any signed-in user
- \`allow.guest()\`: public/unauthenticated access
- \`allow.groups(['Admin'])\`: Cognito group-based access
- \`allow.custom()\`: Lambda authorizer

**Real-time subscriptions**: AppSync subscriptions via WebSocket. Amplify client subscribes to mutations automatically.

**Conflict resolution**: Amplify Data uses DynamoDB optimistic concurrency with version tracking. Configure per-model conflict handler (auto-merge, last-writer-wins, custom Lambda).`,
    },
    {
      heading: "Amplify with Other Services",
      body: `**Amplify + Cognito**: Auth category maps directly to Cognito User Pool + Identity Pool. Amplify SDK wraps Cognito APIs. Pre-built Authenticator UI component.

**Amplify + AppSync**: Data (GraphQL) category creates AppSync API. Amplify generates TypeScript client with type-safe query/mutation/subscription methods.

**Amplify + S3**: Storage category creates S3 bucket with Cognito Identity Pool credentials for per-user access. Files stored under \`public/\`, \`protected/\`, \`private/\` prefixes.

**Amplify + Lambda**: Functions category creates Lambda functions. Can be used as AppSync resolvers, API Gateway handlers, or Cognito triggers.

**Amplify + CloudFront**: Amplify Hosting uses CloudFront for CDN. Custom domains managed through Route 53 + ACM + CloudFront automatically.

**Amplify + DynamoDB**: Data models become DynamoDB tables. Auto-generated sort key patterns for relationships. Global secondary indexes created per query requirements.

**Amplify + Pinpoint**: Analytics category connects to Amazon Pinpoint for user engagement analytics (events, funnels, campaigns).`,
    },
  ],

  keyFacts: [
    "Amplify Hosting: CI/CD + CDN for frontend apps; connects to GitHub/GitLab/Bitbucket",
    "Branch deployments: each branch gets its own URL automatically",
    "Gen 2: TypeScript code-defined backend (not CLI prompts)",
    "Auth → Cognito User Pool + Identity Pool",
    "Data (GraphQL) → AppSync + DynamoDB",
    "Storage → S3 with Cognito Identity Pool credentials",
    "Amplify UI: pre-built Authenticator component with full sign-in/sign-up flow",
    "allow.owner(): per-record authorization — users only access their own data",
    "Custom domain: Amplify auto-provisions ACM cert and CloudFront",
    "Next.js SSR: natively supported in Amplify Hosting",
  ],

  relatedServices: [
    "Amazon Cognito",
    "AWS AppSync",
    "Amazon DynamoDB",
    "Amazon S3",
    "AWS Lambda",
    "Amazon CloudFront",
    "Amazon API Gateway",
    "AWS CloudFormation",
    "Amazon Pinpoint",
  ],

  examTips: [
    "Amplify Hosting = CI/CD + CDN. Amplify Libraries = frontend SDK. Amplify Studio = visual builder.",
    "Auth category provisions Cognito User Pool + Identity Pool (both).",
    "Data category = AppSync + DynamoDB — not raw REST API.",
    "allow.owner(): records are owned by the creating user — most common auth rule.",
    "Amplify uses CloudFormation under the hood — all resources visible in CF.",
    "Storage: public/ (anyone), protected/ (read others, write own), private/ (own only).",
    "Amplify Hosting: pull request previews + branch deployments automatically.",
    "Real-time: AppSync subscriptions via WebSocket — built into Amplify client.",
  ],
};
