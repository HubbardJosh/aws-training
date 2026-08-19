import { ServiceGuide } from "../../../types/guide";

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
      body: `**Amplify Hosting** is a fully managed CI/CD and hosting platform for web applications. You connect a Git repository — GitHub, Bitbucket, GitLab, or CodeCommit — and Amplify automatically builds and deploys your app on every push. It supports virtually every major framework including React, Next.js, Vue, Angular, Gatsby, Hugo, and plain HTML.

Build behavior is controlled by an \`amplify.yml\` file at the root of your repository (or Amplify auto-detects the framework and generates sensible defaults). Each Git branch gets its own unique URL automatically — for example, your \`dev\` branch might be at \`dev.d111.amplifyapp.com\` while \`main\` is at \`main.d111.amplifyapp.com\`. Pull requests also get their own preview URLs, making it easy to share staging environments before merging.

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

Custom domains are fully managed: connect your domain and Amplify automatically provisions an ACM certificate and configures the CloudFront distribution. For Next.js applications, Amplify natively supports server-side rendering. You can also add basic auth password protection to specific branch deployments to restrict staging access. URL redirects, rewrites, and SPA fallback rules are configurable through the Amplify console.`,
    },
    {
      heading: "Amplify Backend (Gen 2)",
      body: `**Amplify Gen 2** is the current approach to defining your backend: instead of running CLI prompts, you write TypeScript code that describes your backend resources. This code is version-controlled alongside your frontend and deployed automatically when you push to your repository.

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

The TypeScript definitions map to real AWS services under the hood: Auth provisions a Cognito User Pool and Identity Pool, Data provisions an AppSync GraphQL API with DynamoDB tables, Storage provisions an S3 bucket, and Functions provision Lambda functions. Amplify Gen 1 used a CLI-based workflow (\`amplify add auth\`, \`amplify add api\`) that generated CloudFormation templates — it's still widely used and you'll see both approaches in production codebases.`,
    },
    {
      heading: "Amplify Libraries (Frontend SDK)",
      body: `The **Amplify JavaScript/TypeScript library** (the \`aws-amplify\` npm package) provides a unified SDK for React, React Native, Vue, Angular, and Next.js. You configure it once with your backend's generated config file, and then import individual categories as you need them.

\`\`\`typescript
import { Amplify } from 'aws-amplify';
import config from './amplifyconfiguration.json';
Amplify.configure(config);
\`\`\`

The Auth category wraps Cognito, providing sign-up, sign-in, sign-out, and token management through a clean API. \`fetchAuthSession()\` retrieves current JWT tokens without forcing you to understand the underlying Cognito flows. The API category wraps AppSync — \`generateClient()\` returns a typed client that infers query and mutation types from your schema, catching type errors at compile time. The Storage category wraps S3 with Cognito Identity Pool credentials for per-user access.

\`\`\`typescript
import { signIn, fetchAuthSession } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/api';
import { uploadData, getUrl } from 'aws-amplify/storage';

await signIn({ username: 'user@email.com', password: 'pass' });
const { tokens } = await fetchAuthSession();
const client = generateClient();
const result = await client.graphql({ query: listTodos });
await uploadData({ key: 'photo.jpg', data: file });
\`\`\`

The \`@aws-amplify/ui-react\` package provides pre-built UI components. The \`<Authenticator>\` component delivers a complete sign-in and sign-up flow in a single import — it handles all the state management, error messages, and verification code screens for you.`,
    },
    {
      heading: "Amplify Auth & Data",
      body: `Amplify's Auth category creates two Cognito resources: a **User Pool** (the user directory, handling sign-up, sign-in, MFA, password policies, and social provider federation) and an **Identity Pool** (which exchanges User Pool tokens for temporary AWS credentials, enabling direct access to S3, DynamoDB, and other AWS services from the client).

The Data category creates an **AppSync GraphQL API** backed by **DynamoDB tables** — one table per model in your schema. Authorization is declared at the schema level using authorization rules that Amplify translates into AppSync resolvers and DynamoDB access patterns:

- \`allow.owner()\` — users can only read and write their own records, identified by a Cognito user ID stored on each item
- \`allow.authenticated()\` — any signed-in user can access the resource
- \`allow.guest()\` — unauthenticated (public) access, using the Identity Pool's unauthenticated role
- \`allow.groups(['Admin'])\` — access restricted to members of a specific Cognito User Pool group
- \`allow.custom()\` — a Lambda authorizer handles the decision

AppSync subscriptions work automatically with the Amplify client — when you perform a mutation, subscribed clients receive real-time updates over WebSocket without any additional configuration. Conflict resolution for offline sync uses optimistic concurrency with version tracking; you can configure per-model handlers for auto-merge, last-writer-wins, or custom Lambda logic.`,
    },
    {
      heading: "Amplify with Other Services",
      body: `Every Amplify backend resource corresponds to a real AWS service, and you can often interact with those services directly when Amplify's abstractions don't meet your needs. Amplify uses CloudFormation under the hood — all provisioned resources are visible in the CloudFormation console and can be inspected, and in Gen 1 you can add raw CloudFormation to extend any environment.

Amplify Hosting uses CloudFront for CDN delivery. When you connect a custom domain, Amplify manages the ACM certificate (in us-east-1), the CloudFront distribution, and the Route 53 records automatically. The Storage category creates an S3 bucket and organizes objects under \`public/\`, \`protected/\`, and \`private/\` prefixes, where public objects are readable by anyone, protected objects are readable by all authenticated users but writable only by the owner, and private objects are accessible only to the owning user.

Amplify Functions are Lambda functions that you can use as AppSync resolvers, API Gateway handlers, or Cognito triggers. The Analytics category connects to Amazon Pinpoint for user engagement analytics — recording events, tracking funnels, and powering targeted campaigns. The Geo category connects to Amazon Location Service for maps, geocoding, and place search.`,
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
