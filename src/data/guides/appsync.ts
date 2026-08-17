import { ServiceGuide } from "../../types/guide";

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
    },
    {
      heading: "Authorization",
      body: `AppSync supports four authorization modes, and you can enable multiple simultaneously on a single API. Different clients or different operations can use different modes depending on your use case.

**API Key** authorization is the simplest — clients include the key in the \`x-api-key\` header. Keys last up to 365 days and are appropriate for public APIs or development environments where you want easy access without setting up auth infrastructure.

**Amazon Cognito User Pools** is the most common choice for user-facing applications. AppSync validates the Cognito JWT on every request and makes the user's identity available in resolvers via \`$ctx.identity.claims\`. You can access any claim — \`sub\`, \`email\`, \`cognito:groups\`, or custom attributes — to make per-user authorization decisions.

**IAM** authorization uses AWS Signature V4. It's suited for server-side or service-to-service calls where the caller already has an IAM role. The role must have \`appsync:GraphQL\` permission on the API.

**Lambda (custom)** authorization invokes a Lambda function on every request. The function receives the full request context and returns an authorization decision plus any additional context to pass to resolvers. This gives you the most flexibility for complex or non-standard auth logic.

Authorization can be applied at the type level with schema directives like \`@aws_auth(cognito_groups: ["Admin"])\` or at the individual field level, allowing you to expose sensitive fields only to specific auth modes or user groups.`,
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
    },
    {
      heading: "Caching & Performance",
      body: `AppSync supports server-side caching to reduce the load on your data sources for read-heavy APIs. Caching is backed by ElastiCache managed by AppSync, so you get the performance benefits without provisioning or managing cache infrastructure.

You can configure caching at two levels. **Full request caching** (\`FULL_REQUEST_CACHING\`) caches the entire GraphQL response for identical requests — same query, same variables, same auth context. This is effective for public or lightly authenticated data. **Per-resolver caching** (\`PER_RESOLVER_CACHING\`) caches individual resolver responses. You configure TTL and cache key per resolver, which lets you cache some resolvers (like a product catalog lookup) while leaving others uncached (like a user-specific cart query).

Cache TTL is configurable from 1 second to 3,600 seconds per resolver. You can scope the cache key by field arguments (to cache per-query parameters), by request headers (to cache per-user), or by both. For APIs where certain data is frequently read and rarely written, resolver caching can dramatically reduce DynamoDB read costs and improve p50 latency.`,
    },
    {
      heading: "AppSync with Other Services",
      body: `AppSync's most natural data source is **DynamoDB**. The DynamoDB data source type includes pre-built operation templates for GetItem, PutItem, UpdateItem, DeleteItem, Query, and Scan — you can auto-generate these for entire types. For complex relationships across multiple DynamoDB tables, pipeline resolvers let you chain multiple DynamoDB operations in a single resolver.

When you need custom business logic, a non-DynamoDB backend, or data aggregation across multiple sources, a **Lambda** data source is the answer. Lambda resolvers receive the full GraphQL context and can return any shape of data, call any downstream service, or query any database.

**RDS Aurora Serverless** via the RDS Data API is the right data source when your data model is relational and you want to write SQL rather than DynamoDB access patterns. **OpenSearch** as a data source enables full-text search and analytics — a common pattern is to write to DynamoDB as the primary store, stream changes via DynamoDB Streams to OpenSearch, and serve search queries from OpenSearch through AppSync.

AppSync integrates directly with **EventBridge** as a target data source, letting GraphQL mutations trigger event-driven workflows downstream. When using **Amplify**, the Data category builds on AppSync and generates a strongly typed TypeScript client, DynamoDB tables, and IAM permissions — reducing the AppSync setup to schema definition.`,
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
};
