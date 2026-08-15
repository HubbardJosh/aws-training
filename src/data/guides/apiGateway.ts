import { ServiceGuide } from "../../types/guide";

export const apiGatewayGuide: ServiceGuide = {
  id: "api-gateway",
  service: "Amazon API Gateway",
  domain: "development",
  tagline: "Create, publish, and secure APIs at any scale",
  intro:
    'API Gateway is a fully managed service for creating RESTful, HTTP, and WebSocket APIs that act as the "front door" to backend services including Lambda, EC2, ECS, and any HTTP endpoint.',

  sections: [
    {
      heading: "API Types",
      body: `**REST API**
Full-featured: usage plans, API keys, request/response validation, caching, WAF integration, resource policies, Lambda authorizers, Cognito authorizers, VTL mapping templates. Three endpoint types: Edge-Optimized (CloudFront), Regional, Private (VPC only).

**HTTP API**
Launched 2019. ~70% cheaper and ~60% lower latency than REST API. Natively supports JWT authorizers (OIDC/OAuth2), CORS, and Lambda proxy integration. Missing: usage plans, API keys, resource policies (use IAM auth instead), request validation, caching, WAF. Best choice for Lambda/HTTP backends when you don't need REST API's advanced features.

**WebSocket API**
Persistent bidirectional connections. Clients connect once; server pushes data anytime. Uses route keys: \`$connect\`, \`$disconnect\`, \`$default\`, and custom routes based on message content. Common for: chat apps, real-time dashboards, multiplayer games, live notifications.`,
    },
    {
      heading: "Integration Types",
      body: `**Lambda Proxy Integration** (most common)
API Gateway passes the entire HTTP request (headers, query params, body, path params) as a structured JSON event to Lambda. Lambda returns a JSON response with \`statusCode\`, \`headers\`, and \`body\`. Simple — no mapping templates needed.

**Lambda Non-Proxy (Custom) Integration**
You write VTL (Velocity Template Language) mapping templates to transform the request before it hits Lambda, and transform Lambda's response before returning it. More control; more complexity.

**HTTP Proxy Integration**
Passes request directly to an HTTP endpoint. API Gateway adds no logic. Good for wrapping existing HTTP services.

**HTTP Custom Integration**
Use VTL templates to transform request/response when calling HTTP backends.

**AWS Service Integration**
Call AWS service APIs directly from API Gateway without Lambda. Example: PUT directly to SQS, trigger Step Functions, write to DynamoDB. Reduces latency and cost by eliminating a Lambda hop.

**Mock Integration**
Returns a hard-coded response without calling any backend. Used for testing, CORS preflight responses, and building API stubs.`,
    },
    {
      heading: "Stages & Deployments",
      body: `A **deployment** is a snapshot of the API configuration. A **stage** is a named reference to a deployment (e.g. \`dev\`, \`staging\`, \`prod\`). You must deploy your API to a stage before it is callable.

**Stage Variables**: key-value pairs per stage referenced in integration URIs and mapping templates as \`\${stageVariables.varName}\`. Classic pattern: point Lambda ARN to different aliases per stage:
\`arn:aws:lambda:us-east-1:123:function:myFn:\${stageVariables.lambdaAlias}\`

**Canary Deployments**: split traffic between current stage (base) and a canary (new deployment) at a configurable percentage. Promote canary to base when satisfied.

**Stage settings**: enable caching, set throttle limits, enable CloudWatch logging (ERROR or INFO), enable X-Ray tracing, set default method throttling.`,
    },
    {
      heading: "Authorizers & Security",
      body: `**IAM Authorization**
Caller signs requests with SigV4 using AWS credentials. API Gateway verifies the signature. Good for service-to-service calls within AWS. Caller needs \`execute-api:Invoke\` permission.

**Cognito User Pool Authorizer**
API Gateway validates the JWT (ID or Access token) from a Cognito User Pool. No Lambda required. Set the token source (Authorization header). Supports multiple user pools. Does not validate scopes — use Lambda authorizer for scope-based access.

**Lambda Authorizer (Custom Authorizer)**
Lambda function validates a bearer token (JWT, OAuth, SAML) or request parameters and returns an IAM policy. Two types:
- *Token-based*: receives the token string (from Authorization header)
- *Request-based*: receives full request context (headers, query params, path) — more flexible

Result can be cached (TTL 0–3600s) to avoid hitting the Lambda on every request. Cache key is the token or identity source.

**Resource Policies**
JSON policy attached to the API (not a stage). Controls which principals (accounts, VPCs, IP ranges) can call the API. Required for cross-account access and private APIs.

**Usage Plans & API Keys**
API Keys identify callers. Usage Plans set throttle limits (requests per second, burst) and quota (requests per day/week/month) per API key. Required for monetization and client-specific rate limiting.`,
    },
    {
      heading: "Request/Response Processing",
      body: `For REST APIs, each method has four phases:

1. **Method Request**: validate headers, query params, body (against JSON Schema model). Reject bad requests before hitting the backend — saves Lambda invocations.
2. **Integration Request**: transform the validated request using VTL mapping template before sending to backend.
3. **Integration Response**: transform the backend response using VTL mapping template.
4. **Method Response**: define HTTP status codes and response models.

**VTL (Velocity Template Language)**: template language for mapping. Access input with \`$input.json('$.field')\`, context with \`$context.requestId\`, stage variables with \`$stageVariables.varName\`.

**Models**: JSON Schema definitions for request/response bodies. Used for validation and SDK generation.`,
    },
    {
      heading: "Throttling & Caching",
      body: `**Throttling**: API Gateway has two levels:
- *Account-level*: 10,000 RPS steady-state, 5,000 burst (token bucket)
- *Stage/method-level*: override per stage or per method

When throttled, clients receive **429 Too Many Requests**. Implement exponential backoff with jitter in clients.

**API Caching**: cache integration responses at the stage level. Cache capacity: 0.5 GB – 237 GB. Default TTL: 300s (max 3600s). Cache key: URL path + optionally headers/query strings. Per-request cache bypass: \`Cache-Control: max-age=0\` header (if allowed). Cache invalidation: flush entire cache via console/API.

Caching is REST API only — HTTP API does not support caching.`,
    },
    {
      heading: "CORS",
      body: `Cross-Origin Resource Sharing must be configured when a browser calls your API from a different domain.

**HTTP API**: enable CORS with a single toggle — API Gateway handles preflight OPTIONS responses automatically.

**REST API**: add an OPTIONS method with a Mock integration returning the required \`Access-Control-Allow-*\` headers. Also add the headers to your actual method responses. Alternatively, configure CORS in the Lambda function response and use a catch-all OPTIONS Mock.

**Required headers**: \`Access-Control-Allow-Origin\`, \`Access-Control-Allow-Methods\`, \`Access-Control-Allow-Headers\`.`,
    },
    {
      heading: "Private APIs",
      body: `A private REST API is only accessible from within a VPC via a **VPC Interface Endpoint** (PrivateLink) for \`execute-api\`.

Setup:
1. Create a VPC endpoint for \`execute-api\` in your VPC.
2. Set the API endpoint type to **Private**.
3. Attach a **resource policy** allowing access from the specific VPC or VPC endpoint.

Use cases: internal microservices, backend-for-frontend patterns where the API should never be reachable from the internet.`,
    },
    {
      heading: "Monitoring & Observability",
      body: `**CloudWatch Metrics** (per stage, per method):
- \`Count\`: total API calls
- \`4XXError\` / \`5XXError\`: client/server errors
- \`Latency\`: total round-trip time (includes integration)
- \`IntegrationLatency\`: time spent in the backend (Lambda, HTTP)
- \`CacheHitCount\` / \`CacheMissCount\`: caching effectiveness

**CloudWatch Logs**: enable execution logging (ERROR or INFO) and access logging. Access logs are structured JSON you define — include \`$context.requestId\`, \`$context.identity.sourceIp\`, \`$context.responseLength\`, etc.

**X-Ray**: enable tracing at the stage level. Traces the API Gateway segment and propagates the trace header to Lambda for end-to-end distributed tracing.`,
    },
    {
      heading: "API Gateway with Other Services",
      body: `**API Gateway + Lambda**: the canonical serverless web API. Lambda Proxy integration passes all request context. Lambda returns structured response with statusCode, headers, body.

**API Gateway + SQS (direct)**: use AWS Service integration to PUT messages to SQS without Lambda. Decouples HTTP clients from downstream processing. API returns 200 immediately; worker processes SQS asynchronously.

**API Gateway + DynamoDB (direct)**: PUT/GET items in DynamoDB without Lambda. Useful for simple CRUD where no business logic is needed.

**API Gateway + Cognito**: authenticate users with Cognito User Pool tokens. API Gateway validates JWT automatically — no custom authorizer code needed.

**API Gateway + WAF**: attach AWS WAF to a REST API stage or HTTP API to protect against SQL injection, XSS, rate-based rules, and IP block lists.

**API Gateway + CloudFront**: use CloudFront in front of a Regional API Gateway for global edge caching and DDoS protection. CloudFront caches API responses at edge; API Gateway caches at the regional level (two layers).`,
    },
  ],

  keyFacts: [
    "REST API: full features, higher cost; HTTP API: cheaper, fewer features",
    "Account throttle default: 10,000 RPS, 5,000 burst",
    "Caching: REST API only, 300s default TTL, 0.5–237 GB capacity",
    "Lambda authorizer result cached up to 3,600 seconds",
    "Stage variables let one API definition serve multiple environments",
    "Private APIs require a VPC Interface Endpoint for execute-api",
    "WebSocket uses $connect, $disconnect, $default route keys",
    "HTTP API natively supports JWT (OIDC/OAuth2) authorizers",
    "Canary deployments split traffic between base and new deployment",
    "429 = throttled; 502 = bad response from integration; 504 = integration timeout",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon Cognito",
    "AWS WAF",
    "Amazon CloudFront",
    "Amazon SQS",
    "Amazon DynamoDB",
    "AWS X-Ray",
    "Amazon CloudWatch",
    "AWS Step Functions",
  ],

  examTips: [
    "HTTP API is cheaper but lacks: usage plans, API keys, resource policies, caching, WAF.",
    "Lambda Proxy integration passes full request; non-proxy uses VTL mapping templates.",
    "Cognito authorizer validates JWT automatically; Lambda authorizer for custom token logic.",
    "Stage variables are the key pattern for one API → multiple Lambda aliases.",
    "Request validation rejects bad input at API Gateway level — no Lambda invocation needed.",
    "Cache invalidation: flush via console or Cache-Control: max-age=0 per request.",
    "Private API + resource policy + VPC endpoint = locked-down internal API.",
    "504 Integration Timeout: Lambda/backend took too long (>29s REST, >30s HTTP API).",
  ],
};
