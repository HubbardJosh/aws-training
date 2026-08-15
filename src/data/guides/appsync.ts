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
      body: `**GraphQL Schema**: defines your API's types, queries, mutations, and subscriptions. AppSync uses this schema to generate resolvers and route requests.

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

**Resolvers**: connect schema fields to data sources. Each field in Query, Mutation, Subscription has a resolver.

**Data Sources**: DynamoDB, Lambda, RDS (via RDS Data API), OpenSearch, HTTP, EventBridge, None (local resolvers).

**Pipeline Resolvers**: chain multiple functions (request → function1 → function2 → response). Enables complex logic before/after data source calls.

**Unit Resolvers**: simple single-step resolvers (request → data source → response).`,
    },
    {
      heading: "Resolvers & Mapping Templates",
      body: `**VTL (Velocity Template Language)**: AppSync's original resolver language. Transforms request/response between GraphQL and data source format.

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

**JavaScript resolvers** (current): write resolvers in JavaScript instead of VTL. More readable and testable.

\`\`\`javascript
// Request handler
export function request(ctx) {
  return {
    operation: 'GetItem',
    key: util.dynamodb.toMapValues({ id: ctx.args.id }),
  };
}

// Response handler
export function response(ctx) {
  return ctx.result;
}
\`\`\`

**$ctx (context object)**: available in all resolvers.
- \`$ctx.args\`: GraphQL field arguments
- \`$ctx.identity\`: caller identity (Cognito claims, IAM principal, etc.)
- \`$ctx.result\`: data source response
- \`$ctx.error\`: error from data source
- \`$ctx.request\`: HTTP request headers

**$util helpers**: \`$util.dynamodb.toDynamoDBJson\`, \`$util.time.nowISO8601\`, \`$util.validate\`, \`$util.unauthorized\`.`,
    },
    {
      heading: "Authorization",
      body: `AppSync supports four authorization modes (multiple can be active simultaneously per API):

**API Key**: simple, for public APIs or development. Key included in \`x-api-key\` header. Short-lived (max 365 days). Not for production.

**Amazon Cognito User Pools**: validates Cognito JWT. Most common for user-facing apps. Access claims in resolver via \`$ctx.identity.claims\`.

**IAM**: AWS Signature V4. For service-to-service or server-side calls. IAM role must have \`appsync:GraphQL\` permission.

**Lambda (custom)**: invoke a Lambda function for every request. Lambda returns authorization decision + context. Flexible for custom auth logic.

**Fine-grained authorization in schema**:
\`\`\`graphql
type Todo @aws_auth(cognito_groups: ["Admin"])
         @aws_iam {
  id: ID!
  content: String!
}
\`\`\`

**Per-field authorization**: apply auth directives to individual fields, not just types. Hide sensitive fields from certain auth modes.

**Amplify Data authorization rules** (when using Amplify):
\`allow.owner()\`, \`allow.authenticated()\`, \`allow.groups(['Admin'])\`, \`allow.public()\`, \`allow.custom()\`.`,
    },
    {
      heading: "Subscriptions & Real-Time",
      body: `**Subscriptions**: AppSync supports real-time data over WebSocket (MQTT over WebSocket or pure WebSocket). Clients subscribe to mutations.

**How it works**:
1. Client connects to AppSync WebSocket endpoint
2. Client sends subscription operation
3. When matching mutation occurs, AppSync pushes update to subscribed clients

**@aws_subscribe directive**: links a subscription field to one or more mutations:
\`\`\`graphql
type Subscription {
  onTodoUpdated: Todo
    @aws_subscribe(mutations: ["updateTodo", "createTodo"])
}
\`\`\`

**Filtering**: filter which subscription events a client receives. Configure server-side filters based on mutation arguments or identity.

**Enhanced subscriptions**: use Lambda resolvers to push custom events to subscribers. Publish from any source (EventBridge, SNS, etc.) via AppSync Pub/Sub API.

**Amplify client**: Amplify's \`generateClient()\` automatically manages WebSocket connections, reconnection, and subscription lifecycle.

**Use cases**: collaborative apps (Google Docs-like), live dashboards, chat applications, IoT status updates, leaderboards.`,
    },
    {
      heading: "Caching & Performance",
      body: `**Server-side caching**: AppSync can cache resolver responses. Configure at API level or per resolver.
- Cache TTL: 1 second to 3600 seconds
- Cache key: by GraphQL field arguments, by request headers (for per-user caching), or full request
- Caching unit: Elasticache under the hood (managed by AppSync)
- Improves performance for read-heavy APIs

**Caching modes**:
- \`FULL_REQUEST_CACHING\`: cache entire GraphQL response for identical requests
- \`PER_RESOLVER_CACHING\`: cache individual resolver responses. Configure per resolver.

**Per-resolver caching with TTL**: only cache specific resolvers (e.g. cache catalog queries but not user-specific data).

**Private API**: deploy AppSync within a VPC (using interface VPC endpoint). Not accessible from public internet.

**Batching**: use DynamoDB batch operations or Lambda batching in resolvers to reduce data source calls for list queries.`,
    },
    {
      heading: "AppSync with Other Services",
      body: `**AppSync + DynamoDB**: most common data source. Auto-generate CRUD resolvers. Single-table design with DynamoDB works well with pipeline resolvers.

**AppSync + Lambda**: Lambda resolver for complex business logic, joins across multiple data sources, or non-DynamoDB backends. Lambda gets the full GraphQL context.

**AppSync + RDS (Aurora Serverless)**: use RDS Data API as a data source. Write SQL in resolvers. Good for relational data models.

**AppSync + Cognito**: Cognito User Pool as default auth mode. Access user claims (\`sub\`, \`email\`, \`cognito:groups\`) in resolvers for data filtering.

**AppSync + EventBridge**: AppSync can publish to EventBridge as a data source. Trigger downstream processing from GraphQL mutations.

**AppSync + Amplify**: Amplify's Data category builds on AppSync. Amplify generates the schema, creates resolvers, provisions DynamoDB, and generates a typed TypeScript client.

**AppSync + OpenSearch**: search and analytics data source. Resolver maps GraphQL query to OpenSearch query. Common for search features alongside DynamoDB (write to DynamoDB → stream to OpenSearch).

**AppSync + CloudWatch**: API metrics (Requests, Errors, Latency, 4xx, 5xx) and subscription connection metrics. Enable detailed request logs for debugging.`,
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
