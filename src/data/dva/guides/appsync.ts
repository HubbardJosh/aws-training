import { ServiceGuide } from "../../../types/guide";

export const appsyncGuide: ServiceGuide = {
  id: "aws-appsync",
  service: "AWS AppSync",
  domain: "development",
  tagline:
    "Managed GraphQL API service with real-time and offline capabilities",
  intro:
    "AppSync is a fully managed GraphQL API service. It connects your GraphQL schema to data sources (DynamoDB, Lambda, RDS, OpenSearch, HTTP APIs) via resolvers. AppSync supports real-time subscriptions via WebSocket, offline data sync, and fine-grained authorization with Cognito, IAM, API keys, and custom Lambda authorizers.",

  sections: [
    {
      heading: "Core Concepts",
      body: `AppSync is built around a **GraphQL schema** — a typed definition of all the queries, mutations, and subscriptions your API exposes. Clients use this schema to request exactly the data they need, nothing more and nothing less. AppSync uses the schema to route requests to the appropriate data sources.

\`\`\`graphql
type Todo {
  id: ID!
  content: String!
  isDone: Boolean!
  owner: String
}

type Query {
  getTodo(id: ID!): Todo
  listTodos: [Todo]
}

type Mutation {
  createTodo(content: String!): Todo
  updateTodo(id: ID!, isDone: Boolean!): Todo
  deleteTodo(id: ID!): Todo
}

type Subscription {
  onCreateTodo: Todo
    @aws_subscribe(mutations: ["createTodo"])
}
\`\`\`

Each field in a Query, Mutation, or Subscription type is wired to a **resolver** that knows how to fetch or modify the data. Resolvers connect schema fields to **data sources** — AppSync supports DynamoDB, Lambda, RDS (via the RDS Data API), OpenSearch, HTTP endpoints, EventBridge, and a "None" type for local resolvers that don't call external services.

**Unit resolvers** handle a single data source call. **Pipeline resolvers** chain multiple functions in sequence, allowing you to call multiple data sources, apply business logic, or perform authorization checks before and after the primary data operation.`,
      quiz: [
        {
          question:
            "Which AppSync resolver type chains multiple functions to call multiple data sources in sequence?",
          options: [
            "Batch resolver",
            "Unit resolver",
            "Pipeline resolver",
            "Proxy resolver",
          ],
          correctIndex: 2,
          explanation:
            "Pipeline resolvers chain multiple functions in sequence, enabling calls to multiple data sources, business logic application, and authorization checks before and after the primary operation. Unit resolvers handle a single data source call.",
        },
        {
          question:
            "What does the @aws_subscribe directive do in an AppSync schema?",
          options: [
            "Links a subscription field to the mutations that trigger it",
            "Creates a webhook for external systems",
            "Enables caching for the subscribed field",
            "Restricts access to authenticated users only",
          ],
          correctIndex: 0,
          explanation:
            "@aws_subscribe links a subscription field to the mutations that cause real-time updates to be pushed to subscribed clients. When the listed mutations execute, AppSync pushes results over WebSocket.",
        },
        {
          question:
            "Which AppSync data source type should you use when you need custom business logic or to query a non-DynamoDB backend?",
          options: [
            "None (local resolver)",
            "HTTP endpoint",
            "Lambda",
            "RDS Data API",
          ],
          correctIndex: 2,
          explanation:
            "A Lambda data source receives the full GraphQL context and can call any downstream service, run any business logic, or query any database — making it the most flexible option for custom requirements.",
        },
      ],
    },
    {
      heading: "Resolvers & Mapping Templates",
      body: `AppSync resolvers transform the GraphQL request into a data source call and transform the response back into a GraphQL-shaped result. AppSync supports two languages for writing this transformation logic.

**VTL (Velocity Template Language)** is the original approach. Request and response mapping templates are written in VTL and evaluate to the parameters for the data source operation:

\`\`\`vtl
## Request mapping template (DynamoDB GetItem)
{
  "version": "2018-05-29",
  "operation": "GetItem",
  "key": {
    "id": $util.dynamodb.toDynamoDBJson($ctx.args.id)
  }
}

## Response mapping template
$util.toJson($ctx.result)
\`\`\`

**JavaScript resolvers** are the current recommended approach. The same logic is expressed in JavaScript, which is more readable, easier to test locally, and familiar to most developers:

\`\`\`javascript
export function request(ctx) {
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues({ id: ctx.args.id }),
  };
}

export function response(ctx) {
  return ctx.result;
}
\`\`\`

Both approaches have access to the **\`$ctx\` context object**, which is the central data structure in every resolver. \`$ctx.args\` contains the GraphQL field arguments, \`$ctx.identity\` contains the caller's identity (Cognito claims, IAM principal, or API key), \`$ctx.result\` contains the data source response, and \`$ctx.error\` contains any error from the data source. The \`$util\` helper namespace provides utility functions for DynamoDB type conversion, time formatting, input validation, and authorization enforcement.`,
      quiz: [
        {
          question:
            "In an AppSync resolver, where do you find the caller's Cognito JWT claims?",
          options: [
            "$ctx.identity.claims",
            "$ctx.args.claims",
            "$ctx.request.headers",
            "$ctx.source.identity",
          ],
          correctIndex: 0,
          explanation:
            "$ctx.identity contains the caller's identity information — Cognito claims, IAM principal, or API key depending on the auth mode configured. $ctx.args holds GraphQL field arguments.",
        },
        {
          question:
            "Which AppSync resolver language is currently recommended for new development?",
          options: [
            "VTL (Velocity Template Language)",
            "JSON mapping documents",
            "JavaScript resolvers",
            "Python resolvers",
          ],
          correctIndex: 2,
          explanation:
            "JavaScript resolvers are the current recommended approach — they are more readable, easier to test locally, and familiar to most developers. VTL is the legacy approach still supported for existing resolvers.",
        },
        {
          question:
            "After a data source call, where does AppSync store the raw result for the response mapping template?",
          options: ["$ctx.args", "$ctx.prev", "$ctx.source", "$ctx.result"],
          correctIndex: 3,
          explanation:
            "$ctx.result contains the data source response after the request completes. The response mapping template transforms this into the GraphQL result shape. $ctx.error contains any error from the data source.",
        },
      ],
    },
    {
      heading: "Authorization",
      body: `AppSync supports four authorization modes, and you can enable multiple simultaneously on a single API. Different clients or different operations can use different modes depending on your use case.

**API Key** authorization is the simplest — clients include the key in the \`x-api-key\` header. Keys last up to 365 days and are appropriate for public APIs or development environments where you want easy access without setting up auth infrastructure.

**Amazon Cognito User Pools** is the most common choice for user-facing applications. AppSync validates the Cognito JWT on every request and makes the user's identity available in resolvers via \`$ctx.identity.claims\`. You can access any claim — \`sub\`, \`email\`, \`cognito:groups\`, or custom attributes — to make per-user authorization decisions.

**IAM** authorization uses AWS Signature V4. It's suited for server-side or service-to-service calls where the caller already has an IAM role. The role must have \`appsync:GraphQL\` permission on the API.

**Lambda (custom)** authorization invokes a Lambda function on every request. The function receives the full request context and returns an authorization decision plus any additional context to pass to resolvers. This gives you the most flexibility for complex or non-standard auth logic.

Authorization can be applied at the type level with schema directives like \`@aws_auth(cognito_groups: ["Admin"])\` or at the individual field level, allowing you to expose sensitive fields only to specific auth modes or user groups.`,
      quiz: [
        {
          question:
            "An AppSync API needs to support both public (unauthenticated) access and authenticated user access with different permissions. How do you handle this?",
          options: [
            "Create two separate AppSync APIs",
            "Enable multiple authorization modes simultaneously on one API",
            "Use a Lambda authorizer to handle both cases",
            "This is not possible with AppSync",
          ],
          correctIndex: 1,
          explanation:
            "AppSync supports enabling multiple authorization modes simultaneously on a single API. Different clients can use different modes (API Key for public, Cognito for users), and you can apply different modes at the type or field level.",
        },
        {
          question:
            "What IAM permission does a role need to call an AppSync API using IAM authorization?",
          options: [
            "appsync:Query",
            "appsync:GraphQL",
            "appsync:Invoke",
            "execute-api:Invoke",
          ],
          correctIndex: 1,
          explanation:
            "For IAM authorization, the calling role must have appsync:GraphQL permission on the API ARN. This is analogous to execute-api:Invoke for API Gateway IAM auth.",
        },
        {
          question:
            "How do you restrict an AppSync type to only users in the 'Admin' Cognito group?",
          options: [
            '@aws_auth(cognito_groups: ["Admin"])',
            '@aws_restrict(group: "Admin")',
            '@aws_iam(roles: ["Admin"])',
            '@aws_cognito(group: "Admin")',
          ],
          correctIndex: 0,
          explanation:
            '@aws_auth(cognito_groups: ["Admin"]) is the schema directive for type-level authorization by Cognito group. It can also be applied at the individual field level for fine-grained control.',
        },
      ],
    },
    {
      heading: "Subscriptions & Real-Time",
      body: `AppSync's subscription system lets clients receive real-time updates over WebSocket whenever data changes. The model is straightforward: a client subscribes to a subscription field, and whenever a matching mutation occurs, AppSync pushes the mutation's result to all subscribed clients.

The \`@aws_subscribe\` directive links a subscription field to the mutations that trigger it:

\`\`\`graphql
type Subscription {
  onTodoUpdated: Todo
    @aws_subscribe(mutations: ["updateTodo", "createTodo"])
}
\`\`\`

When a client subscribes to \`onTodoUpdated\`, AppSync maintains a WebSocket connection. Every time \`updateTodo\` or \`createTodo\` is called and succeeds, AppSync pushes the result to that client. The Amplify client library manages WebSocket connections, reconnection, and subscription lifecycle automatically.

Server-side subscription filters let you control which events each subscriber receives — for example, a client might only want updates for todos belonging to them. Enhanced subscriptions allow publishing events from any source (EventBridge, SNS, etc.) via the AppSync Pub/Sub API, not just from GraphQL mutations. This makes AppSync suitable for collaborative applications (like real-time document editors), live dashboards, IoT status displays, and chat systems.`,
      quiz: [
        {
          question:
            "What transport protocol does AppSync use for real-time subscriptions?",
          options: [
            "HTTP long-polling",
            "WebSocket",
            "Server-Sent Events",
            "gRPC streaming",
          ],
          correctIndex: 1,
          explanation:
            "AppSync subscriptions use WebSocket connections. The Amplify client library manages WebSocket connections, reconnection, and subscription lifecycle automatically.",
        },
        {
          question:
            "An AppSync subscription fires when a matching mutation occurs. What happens if no mutation occurs?",
          options: [
            "AppSync sends a heartbeat with the last known data",
            "Nothing — subscriptions are push-only and only fire on mutations",
            "The WebSocket connection times out immediately",
            "AppSync polls the data source every 30 seconds",
          ],
          correctIndex: 1,
          explanation:
            "AppSync subscriptions are purely push-based. Subscribed clients only receive updates when a mutation that matches the @aws_subscribe directive executes — no polling or periodic delivery occurs.",
        },
      ],
    },
    {
      heading: "Caching & Performance",
      body: `AppSync supports server-side caching to reduce the load on your data sources for read-heavy APIs. Caching is backed by ElastiCache managed by AppSync, so you get the performance benefits without provisioning or managing cache infrastructure.

You can configure caching at two levels. **Full request caching** (\`FULL_REQUEST_CACHING\`) caches the entire GraphQL response for identical requests — same query, same variables, same auth context. This is effective for public or lightly authenticated data. **Per-resolver caching** (\`PER_RESOLVER_CACHING\`) caches individual resolver responses. You configure TTL and cache key per resolver, which lets you cache some resolvers (like a product catalog lookup) while leaving others uncached (like a user-specific cart query).

Cache TTL is configurable from 1 second to 3,600 seconds per resolver. You can scope the cache key by field arguments (to cache per-query parameters), by request headers (to cache per-user), or by both. For APIs where certain data is frequently read and rarely written, resolver caching can dramatically reduce DynamoDB read costs and improve p50 latency.`,
      quiz: [
        {
          question:
            "What backing infrastructure does AppSync use for server-side caching?",
          options: [
            "DynamoDB DAX",
            "CloudFront edge caches",
            "ElastiCache managed by AppSync",
            "In-memory caching on the AppSync service itself",
          ],
          correctIndex: 2,
          explanation:
            "AppSync's server-side caching is backed by ElastiCache that AppSync manages for you. You get the performance benefits without provisioning or managing the cache cluster yourself.",
        },
        {
          question:
            "Which AppSync caching mode caches individual resolver responses rather than the entire API response?",
          options: [
            "FULL_REQUEST_CACHING",
            "PER_RESOLVER_CACHING",
            "SELECTIVE_CACHING",
            "FIELD_LEVEL_CACHING",
          ],
          correctIndex: 1,
          explanation:
            "PER_RESOLVER_CACHING caches individual resolver responses with per-resolver TTL and cache key configuration. FULL_REQUEST_CACHING caches the entire GraphQL response for identical requests.",
        },
        {
          question:
            "What is the maximum TTL you can configure for AppSync resolver caching?",
          options: [
            "300 seconds",
            "1,800 seconds",
            "3,600 seconds",
            "600 seconds",
          ],
          correctIndex: 2,
          explanation:
            "AppSync resolver cache TTL is configurable from 1 second to 3,600 seconds (1 hour). The right TTL depends on how frequently the data changes and how stale you can tolerate.",
        },
      ],
    },
    {
      heading: "AppSync with Other Services",
      body: `AppSync's most natural data source is **DynamoDB**. The DynamoDB data source type includes pre-built operation templates for GetItem, PutItem, UpdateItem, DeleteItem, Query, and Scan — you can auto-generate these for entire types. For complex relationships across multiple DynamoDB tables, pipeline resolvers let you chain multiple DynamoDB operations in a single resolver.

When you need custom business logic, a non-DynamoDB backend, or data aggregation across multiple sources, a **Lambda** data source is the answer. Lambda resolvers receive the full GraphQL context and can return any shape of data, call any downstream service, or query any database.

**RDS Aurora Serverless** via the RDS Data API is the right data source when your data model is relational and you want to write SQL rather than DynamoDB access patterns. **OpenSearch** as a data source enables full-text search and analytics — a common pattern is to write to DynamoDB as the primary store, stream changes via DynamoDB Streams to OpenSearch, and serve search queries from OpenSearch through AppSync.

AppSync integrates directly with **EventBridge** as a target data source, letting GraphQL mutations trigger event-driven workflows downstream. When using **Amplify**, the Data category builds on AppSync and generates a strongly typed TypeScript client, DynamoDB tables, and IAM permissions — reducing the AppSync setup to schema definition.`,
      quiz: [
        {
          question:
            "A team wants to add full-text search to their AppSync + DynamoDB app. What is the recommended pattern?",
          options: [
            "Use CloudSearch as an AppSync data source",
            "Use DynamoDB's built-in search feature",
            "Use Lambda resolvers to scan DynamoDB on every search query",
            "Write to DynamoDB, stream changes via DynamoDB Streams to OpenSearch, serve search queries from OpenSearch through AppSync",
          ],
          correctIndex: 3,
          explanation:
            "The recommended pattern: DynamoDB as the primary store, DynamoDB Streams to sync changes to OpenSearch, and an AppSync OpenSearch data source to serve full-text search queries.",
        },
        {
          question:
            "When using Amplify's Data category, what AWS services are automatically provisioned behind the scenes?",
          options: [
            "AppSync and DynamoDB",
            "ElasticSearch and Lambda",
            "API Gateway and Lambda",
            "RDS and API Gateway",
          ],
          correctIndex: 0,
          explanation:
            "Amplify's Data category provisions an AppSync GraphQL API and DynamoDB tables (one per model). It also generates a strongly typed TypeScript client and configures IAM permissions.",
        },
      ],
    },
  ],

  keyFacts: [
    "AppSync = managed GraphQL. Supports Query, Mutation, Subscription.",
    "Data sources: DynamoDB, Lambda, RDS (Data API), OpenSearch, HTTP, EventBridge, None",
    "Resolvers: VTL (legacy) or JavaScript (current) mapping templates",
    "Auth modes: API Key, Cognito User Pools, IAM, Lambda custom — multiple active simultaneously",
    "Subscriptions: WebSocket-based real-time updates; @aws_subscribe links to mutations",
    "$ctx.identity: caller identity in resolvers (Cognito claims, IAM principal)",
    "Pipeline resolvers: chain multiple functions for complex logic",
    "Server-side caching: cache resolver responses (backed by ElastiCache)",
    "@aws_auth(cognito_groups: ['Admin']): type-level authorization by group",
    "Amplify Data: generates AppSync + DynamoDB + typed TypeScript client",
  ],

  relatedServices: [
    "Amazon DynamoDB",
    "AWS Lambda",
    "Amazon Cognito",
    "Amazon RDS Aurora",
    "Amazon OpenSearch",
    "Amazon EventBridge",
    "Amazon ElastiCache",
    "AWS Amplify",
    "Amazon CloudWatch",
  ],

  examTips: [
    "AppSync = GraphQL (not REST). Use when clients need to request exactly what they want.",
    "Subscription trigger: mutation must occur for subscribers to receive update.",
    "@aws_subscribe: links subscription field to mutations that trigger it.",
    "Multiple auth modes: one API can use Cognito + IAM + API Key simultaneously.",
    "$ctx.identity.claims: access Cognito JWT claims in resolvers for authorization.",
    "Lambda data source: resolver receives full GraphQL context; can query any backend.",
    "Pipeline resolvers: sequence of functions — use for multi-step logic.",
    "Server-side caching: reduces DynamoDB reads for frequently queried data.",
    "Per-field authorization: hide sensitive fields from certain auth modes/users.",
  ],

  topicQuiz: [
    {
      question:
        "AppSync subscriptions push updates to clients when which event occurs?",
      options: [
        "The WebSocket TTL expires",
        "A client polls the subscription endpoint",
        "A scheduled CloudWatch event fires",
        "A matching mutation executes",
      ],
      correctIndex: 3,
      explanation:
        "AppSync subscriptions are triggered by mutations. The @aws_subscribe directive links a subscription field to the mutations that cause real-time updates to be pushed over WebSocket.",
    },
    {
      question:
        "Which AppSync resolver language is currently recommended for new development?",
      options: [
        "VTL (Velocity Template Language)",
        "Java",
        "Python",
        "JavaScript",
      ],
      correctIndex: 3,
      explanation:
        "JavaScript resolvers are the current recommended approach — more readable, easier to test locally, and familiar to most developers compared to VTL.",
    },
    {
      question:
        "An AppSync API must serve both anonymous public users and authenticated Cognito users with different data access. What is the correct configuration?",
      options: [
        "Create two separate AppSync APIs",
        "Use IAM authorization with public and private roles",
        "Enable both API Key and Cognito User Pools authorization modes simultaneously",
        "Use a Lambda authorizer to route between modes",
      ],
      correctIndex: 2,
      explanation:
        "AppSync supports enabling multiple authorization modes simultaneously. API Key can serve anonymous users while Cognito User Pools serves authenticated users, with field-level directives controlling access.",
    },
    {
      question: "A pipeline resolver in AppSync is used when you need to:",
      options: [
        "Call multiple data sources or apply multi-step logic in a single resolver",
        "Enable real-time subscriptions",
        "Connect to an on-premises database",
        "Cache resolver responses for better performance",
      ],
      correctIndex: 0,
      explanation:
        "Pipeline resolvers chain multiple functions in sequence, enabling calls to multiple data sources and complex business logic within a single resolver execution.",
    },
    {
      question:
        "What does $ctx.identity.claims contain in an AppSync resolver using Cognito?",
      options: [
        "The JWT claims from the Cognito token (sub, email, groups, etc.)",
        "The GraphQL field arguments",
        "The raw API key value",
        "The IAM role ARN of the caller",
      ],
      correctIndex: 0,
      explanation:
        "$ctx.identity.claims contains the JWT claims from the Cognito token — including sub, email, cognito:groups, and custom attributes — available for authorization decisions in resolvers.",
    },
    {
      question: "AppSync server-side caching is backed by which AWS service?",
      options: ["CloudFront", "ElastiCache", "DynamoDB DAX", "Lambda@Edge"],
      correctIndex: 1,
      explanation:
        "AppSync's server-side caching is backed by ElastiCache managed by AppSync. You configure TTL and caching mode without provisioning or managing the cache infrastructure yourself.",
    },
    {
      question:
        "A team stores data in DynamoDB and needs full-text search via AppSync. What data source enables search queries?",
      options: [
        "DynamoDB with FilterExpression",
        "OpenSearch",
        "RDS Data API",
        "Lambda with Scan",
      ],
      correctIndex: 1,
      explanation:
        "OpenSearch is the AppSync data source for full-text search. The typical pattern: write to DynamoDB, stream changes via DynamoDB Streams to OpenSearch, serve search through an AppSync OpenSearch data source.",
    },
  ],
};
