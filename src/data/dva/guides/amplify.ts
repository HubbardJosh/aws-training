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
      quiz: [
        {
          question:
            "What file controls Amplify Hosting build behavior in a repository?",
          options: [
            "buildspec.yml",
            "amplify.yml",
            "appspec.yml",
            "deploy.yml",
          ],
          correctIndex: 1,
          explanation:
            "amplify.yml at the root of your repository defines the build phases, artifacts, and cache paths for Amplify Hosting. Amplify can also auto-detect the framework and generate defaults if the file is absent.",
        },
        {
          question:
            "What does Amplify Hosting automatically create for each connected Git branch?",
          options: [
            "A separate AWS account",
            "A unique deployment URL for that branch",
            "A standalone CloudFront distribution",
            "A dedicated S3 bucket per developer",
          ],
          correctIndex: 1,
          explanation:
            "Each Git branch connected to Amplify Hosting receives its own unique URL automatically, enabling independent staging environments without any manual configuration.",
        },
        {
          question:
            "Which AWS service does Amplify use to provision TLS certificates when you connect a custom domain?",
          options: [
            "AWS Certificate Manager (ACM)",
            "AWS CloudHSM",
            "AWS IAM",
            "AWS Secrets Manager",
          ],
          correctIndex: 0,
          explanation:
            "When you connect a custom domain to Amplify Hosting, Amplify automatically provisions an ACM certificate in us-east-1 and configures the CloudFront distribution to use it.",
        },
      ],
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
      quiz: [
        {
          question: "In Amplify Gen 2, how is the backend defined?",
          options: [
            "By uploading CloudFormation JSON files to S3",
            "By running interactive CLI prompts such as 'amplify add auth'",
            "By configuring resources in the AWS console and exporting them",
            "By writing TypeScript code that is version-controlled alongside the frontend",
          ],
          correctIndex: 3,
          explanation:
            "Amplify Gen 2 moves from CLI-based prompts to code-first TypeScript definitions. The backend resource files live in the amplify/ directory alongside frontend code and are deployed automatically on push.",
        },
        {
          question:
            "What AWS services does the Amplify Gen 2 'Data' category provision under the hood?",
          options: [
            "Lambda and S3",
            "API Gateway and RDS",
            "Kinesis and DynamoDB",
            "AppSync and DynamoDB",
          ],
          correctIndex: 3,
          explanation:
            "The Amplify Data category provisions an AppSync GraphQL API with DynamoDB tables — one table per model in your schema. Authorization rules are declared at the schema level and translated into AppSync resolvers.",
        },
        {
          question:
            "What infrastructure tool does Amplify use under the hood for all resource management?",
          options: ["AWS CDK", "AWS SAM", "AWS CloudFormation", "Terraform"],
          correctIndex: 2,
          explanation:
            "Amplify uses CloudFormation under the hood for all provisioned resources. All created resources are visible in the CloudFormation console, and in Gen 1 you can add raw CloudFormation to extend any environment.",
        },
      ],
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
      quiz: [
        {
          question:
            "What does the Amplify Library's fetchAuthSession() function return?",
          options: [
            "A pre-signed S3 URL for the authenticated user",
            "An IAM access key and secret for the current user",
            "The current user's JWT tokens (ID, Access, Refresh)",
            "The Cognito Identity Pool credentials only",
          ],
          correctIndex: 2,
          explanation:
            "fetchAuthSession() retrieves the current user's JWT tokens from Cognito without requiring you to understand the underlying Cognito flows. It returns the ID token, Access token, and Refresh token.",
        },
        {
          question:
            "Which Amplify UI component provides a complete sign-in and sign-up flow in a single import?",
          options: [
            "<Authenticator>",
            "<AuthProvider>",
            "<CognitoLogin>",
            "<SignInForm>",
          ],
          correctIndex: 0,
          explanation:
            "The <Authenticator> component from @aws-amplify/ui-react delivers a complete sign-in and sign-up flow including state management, error messages, and verification code screens — all from one import.",
        },
        {
          question: "What does generateClient() from 'aws-amplify/api' return?",
          options: [
            "A REST API client pre-configured with API Gateway endpoints",
            "An SQS client for sending messages to queues",
            "A typed GraphQL client that infers types from the Amplify schema",
            "A DynamoDB DocumentClient for direct table access",
          ],
          correctIndex: 2,
          explanation:
            "generateClient() returns a typed AppSync GraphQL client that infers query and mutation types from your Amplify schema at compile time, catching type errors before deployment.",
        },
      ],
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
      quiz: [
        {
          question:
            "Which Amplify authorization rule restricts access so that users can only read and write their own records?",
          options: [
            "allow.private()",
            "allow.authenticated()",
            "allow.owner()",
            "allow.groups(['Users'])",
          ],
          correctIndex: 2,
          explanation:
            "allow.owner() is the most common authorization rule. It stores the creating user's Cognito user ID on each item and restricts read/write access to that owner only.",
        },
        {
          question:
            "What transport protocol do AppSync subscriptions use for real-time updates in Amplify?",
          options: [
            "Server-Sent Events",
            "HTTP long polling",
            "UDP",
            "WebSocket",
          ],
          correctIndex: 3,
          explanation:
            "AppSync subscriptions use WebSocket connections to push real-time updates to subscribed clients when mutations occur. The Amplify client handles this automatically with no additional configuration.",
        },
        {
          question:
            "What two Cognito resources does the Amplify Auth category create?",
          options: [
            "User Pool and Hosted UI only",
            "User Pool and IAM Role",
            "Identity Pool and STS endpoint",
            "User Pool and Identity Pool",
          ],
          correctIndex: 3,
          explanation:
            "The Amplify Auth category provisions both a Cognito User Pool (the user directory for authentication) and an Identity Pool (which exchanges tokens for temporary AWS credentials for direct AWS service access).",
        },
      ],
    },
    {
      heading: "Amplify with Other Services",
      body: `Every Amplify backend resource corresponds to a real AWS service, and you can often interact with those services directly when Amplify's abstractions don't meet your needs. Amplify uses CloudFormation under the hood — all provisioned resources are visible in the CloudFormation console and can be inspected, and in Gen 1 you can add raw CloudFormation to extend any environment.

Amplify Hosting uses CloudFront for CDN delivery. When you connect a custom domain, Amplify manages the ACM certificate (in us-east-1), the CloudFront distribution, and the Route 53 records automatically. The Storage category creates an S3 bucket and organizes objects under \`public/\`, \`protected/\`, and \`private/\` prefixes, where public objects are readable by anyone, protected objects are readable by all authenticated users but writable only by the owner, and private objects are accessible only to the owning user.

Amplify Functions are Lambda functions that you can use as AppSync resolvers, API Gateway handlers, or Cognito triggers. The Analytics category connects to Amazon Pinpoint for user engagement analytics — recording events, tracking funnels, and powering targeted campaigns. The Geo category connects to Amazon Location Service for maps, geocoding, and place search.`,
      quiz: [
        {
          question:
            "In Amplify Storage, which prefix allows all authenticated users to read an object but only the owner to write it?",
          options: ["shared/", "public/", "protected/", "private/"],
          correctIndex: 2,
          explanation:
            "The protected/ prefix in Amplify Storage makes objects readable by all authenticated users but writable only by the owning user. public/ is world-readable, and private/ is accessible only to the owner.",
        },
        {
          question:
            "Which AWS service does the Amplify Analytics category connect to for user engagement tracking?",
          options: [
            "Amazon QuickSight",
            "Amazon Pinpoint",
            "Amazon CloudWatch",
            "Amazon Kinesis",
          ],
          correctIndex: 1,
          explanation:
            "The Amplify Analytics category connects to Amazon Pinpoint for user engagement analytics — recording events, tracking conversion funnels, and powering targeted notification campaigns.",
        },
        {
          question:
            "What AWS service does Amplify Hosting use for CDN delivery of frontend assets?",
          options: [
            "AWS Global Accelerator",
            "Amazon S3 static website hosting",
            "Amazon API Gateway",
            "Amazon CloudFront",
          ],
          correctIndex: 3,
          explanation:
            "Amplify Hosting uses CloudFront as its CDN layer. When you connect a custom domain, Amplify manages the CloudFront distribution, ACM certificate, and Route 53 records automatically.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A developer wants to restrict a DynamoDB-backed AppSync model so that each user can only access records they created. Which Amplify authorization rule should they use?",
      options: [
        "allow.authenticated()",
        "allow.owner()",
        "allow.groups(['Users'])",
        "allow.guest()",
      ],
      correctIndex: 1,
      explanation:
        "allow.owner() stores the creating user's Cognito sub on each item and restricts access to that owner only. allow.authenticated() would allow any signed-in user to access all records.",
    },
    {
      question:
        "An Amplify Hosting project has a main branch deployed to production. A developer pushes to a feature branch. What does Amplify automatically create?",
      options: [
        "A CloudFormation stack that must be manually approved",
        "A new AWS account for the feature branch",
        "A pull request in the connected GitHub repository",
        "A unique preview URL for the feature branch deployment",
      ],
      correctIndex: 3,
      explanation:
        "Amplify Hosting automatically creates a unique URL for each branch deployment. Feature branches and pull requests each get their own preview URL without any manual configuration.",
    },
    {
      question:
        "Which component from @aws-amplify/ui-react delivers a complete authentication UI including sign-up, sign-in, and MFA in a single import?",
      options: [
        "<CognitoAuth>",
        "<Authenticator>",
        "<SignInWidget>",
        "<AuthFlow>",
      ],
      correctIndex: 1,
      explanation:
        "The <Authenticator> component provides a complete sign-in and sign-up flow — including state management, error messages, and verification code screens — in a single import from @aws-amplify/ui-react.",
    },
    {
      question:
        "A team uses Amplify Storage. They want objects uploaded by users to be readable by any authenticated user but only modifiable by the uploader. Which S3 prefix should they use?",
      options: ["public/", "shared/", "private/", "protected/"],
      correctIndex: 3,
      explanation:
        "The protected/ prefix allows all authenticated users to read objects but only the owner to write. public/ allows anyone to read; private/ restricts all access to the owner only.",
    },
    {
      question:
        "In Amplify Gen 2, what happens to backend resources when a developer pushes code to their repository?",
      options: [
        "Resources are manually deployed by running 'amplify push' in the CLI",
        "Amplify automatically builds and deploys the backend resources defined in TypeScript",
        "Resources are only updated during scheduled maintenance windows",
        "A pull request must be approved before backend resources are updated",
      ],
      correctIndex: 1,
      explanation:
        "In Amplify Gen 2, backend TypeScript resource definitions are deployed automatically on every push to the connected repository — the same CI/CD pipeline that deploys the frontend also deploys the backend.",
    },
    {
      question:
        "Which two Cognito resources does the Amplify Auth category provision for every application?",
      options: [
        "An Identity Pool and an STS endpoint",
        "A User Pool and a Hosted Zone",
        "A User Pool and an Identity Pool",
        "A User Pool and an IAM Role",
      ],
      correctIndex: 2,
      explanation:
        "The Amplify Auth category always provisions both a Cognito User Pool (authentication — handles sign-up, sign-in, MFA) and an Identity Pool (authorization — exchanges tokens for temporary AWS credentials for direct service access).",
    },
    {
      question:
        "What underlying AWS service does Amplify use to manage all provisioned backend resources?",
      options: [
        "AWS CDK",
        "AWS Elastic Beanstalk",
        "AWS CloudFormation",
        "AWS OpsWorks",
      ],
      correctIndex: 2,
      explanation:
        "Amplify uses CloudFormation under the hood for all resource management. All provisioned resources are visible in the CloudFormation console, and advanced users can add raw CloudFormation resources to extend Amplify environments.",
    },
    {
      question:
        "A developer calls fetchAuthSession() from the Amplify Auth library. What does this return?",
      options: [
        "The user's IAM access key and secret key",
        "A pre-signed URL for the user's S3 folder",
        "The user's current JWT tokens without requiring a new sign-in",
        "The user's Cognito Identity Pool unique identifier only",
      ],
      correctIndex: 2,
      explanation:
        "fetchAuthSession() retrieves the current user's JWT tokens (ID token, Access token, and session metadata) without requiring re-authentication. It handles token refresh automatically if the current tokens are expired.",
    },
  ],
};
