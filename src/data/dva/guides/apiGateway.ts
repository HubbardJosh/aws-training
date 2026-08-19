import { ServiceGuide } from "../../../types/guide";

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
      body: `API Gateway offers three distinct API types, each suited to different scenarios.

**REST APIs** are the original, fully-featured offering. They support the complete API Gateway feature set: usage plans and API keys for monetization and rate limiting, request and response validation against JSON Schema models, response caching, WAF integration, resource-based policies for fine-grained access control, Lambda authorizers, Cognito authorizers, and VTL mapping templates for transforming payloads. REST APIs support three endpoint types: Edge-Optimized (fronted by CloudFront for global latency reduction), Regional (deployed in a single region), and Private (accessible only within a VPC via an interface endpoint).

**HTTP APIs** were introduced in 2019 as a faster, cheaper alternative — roughly 70% cheaper and 60% lower latency than REST APIs. They natively support JWT authorizers (validating OIDC and OAuth2 tokens directly), CORS configuration, and Lambda proxy integration. What they give up is the advanced feature set: no usage plans, no API keys, no resource policies, no request validation, no caching, and no WAF. For Lambda or HTTP backends where you don't need those features, HTTP APIs are almost always the better choice.

**WebSocket APIs** maintain persistent bidirectional connections. A client connects once, and either side can send messages at any time without the client polling. WebSocket APIs route messages using route keys: \`$connect\` (when a client connects), \`$disconnect\` (when it disconnects), \`$default\` (for unmatched messages), and custom routes based on message content. Common uses include chat applications, real-time dashboards, multiplayer games, and live notification feeds.`,
    },
    {
      heading: "Integration Types",
      body: `API Gateway's integration type determines how it communicates with your backend.

**Lambda Proxy Integration** is the most common pattern. API Gateway passes the entire HTTP request — headers, query parameters, path parameters, and body — as a structured JSON event to Lambda. Lambda returns a response object containing \`statusCode\`, \`headers\`, and \`body\`. The simplicity is the point: no mapping templates to write, no transformation logic to maintain.

**Lambda Non-Proxy (Custom) Integration** gives you more control through VTL (Velocity Template Language) mapping templates. You write a template that transforms the incoming request before Lambda sees it, and another template that transforms Lambda's response before the client receives it. This is more powerful but significantly more complex to maintain.

**AWS Service Integration** lets API Gateway call AWS service APIs directly — without Lambda acting as an intermediary. For example, you can configure API Gateway to write directly to an SQS queue, trigger a Step Functions state machine, or put an item in DynamoDB. Removing the Lambda hop reduces latency and eliminates the compute cost of a passthrough function.

**HTTP Proxy Integration** passes requests directly to an HTTP endpoint with no API Gateway transformation. **HTTP Custom Integration** adds VTL templates for request/response transformation when calling HTTP backends. **Mock Integration** returns a hard-coded response without calling any backend — useful for testing, CORS preflight responses, and building API stubs during development.`,
    },
    {
      heading: "Stages & Deployments",
      body: `In the REST API model, every change to your API configuration must be **deployed** before it takes effect. A deployment is a snapshot of your API's configuration at a moment in time. A **stage** is a named reference to a deployment — think of it as an environment label like \`dev\`, \`staging\`, or \`prod\`. Until you deploy your API to a stage, no one can call it.

**Stage Variables** are key-value pairs associated with a stage that you can reference in integration URIs and mapping templates as \`\${stageVariables.varName}\`. The classic use case is pointing different stages at different Lambda aliases:
\`arn:aws:lambda:us-east-1:123:function:myFn:\${stageVariables.lambdaAlias}\`

This lets a single API definition serve multiple environments by simply changing which Lambda alias each stage points to.

**Canary deployments** let you test a new deployment with a controlled percentage of traffic before committing fully. You route, say, 10% of traffic to the canary deployment while 90% stays on the base stage. Once you're satisfied with the canary's behavior, you promote it to become the base. Stage-level settings also control response caching, CloudWatch logging (ERROR or INFO level), X-Ray tracing, and method-level throttling overrides.`,
    },
    {
      heading: "Authorizers & Security",
      body: `API Gateway supports several authorization mechanisms, each suited to different trust models.

**IAM Authorization** requires callers to sign requests using AWS Signature Version 4 with valid AWS credentials. API Gateway verifies the signature and checks that the caller's IAM policies include \`execute-api:Invoke\`. This is well-suited for service-to-service calls within AWS, where calling code runs with an IAM role.

**Cognito User Pool Authorizer** validates JWTs issued by a Cognito User Pool automatically — no Lambda code required. You configure which User Pool to validate against and which token (ID token or Access token) to expect in the Authorization header. The authorizer checks the signature, expiry, and audience claim. Note that it does not validate OAuth scopes — if you need scope-based access control, you'll need a Lambda authorizer.

**Lambda Authorizers** are custom functions that validate any token format — OAuth, JWT, SAML, or a proprietary scheme. There are two subtypes: token-based (receives just the token string from the Authorization header) and request-based (receives the full request context including headers and query params, giving more flexibility). The authorizer returns an IAM policy that either allows or denies access. Lambda authorizer results can be cached for up to 3,600 seconds, keyed on the token or identity source, to avoid invoking the Lambda on every request.

**Resource Policies** are JSON policies attached to the API itself that control which principals, accounts, VPCs, or IP ranges can call the API. They're required for cross-account access and for Private APIs. **Usage Plans** combined with **API Keys** enable per-client rate limiting (requests per second and burst) and quotas (requests per day or month) — the standard mechanism for monetized APIs.`,
    },
    {
      heading: "Request/Response Processing",
      body: `For REST APIs, each method request flows through four processing phases before reaching the backend and four more on the return path. Understanding this pipeline is key to writing correct mapping templates.

The **Method Request** phase is where API Gateway validates the incoming request. You can define required headers, query parameters, and a JSON Schema model for the request body. If validation fails, API Gateway returns a 400 response without ever invoking the backend — this saves Lambda invocations and is a cost-effective way to reject malformed requests.

The **Integration Request** phase is where you transform the validated request using a VTL mapping template before sending it to the backend. VTL gives you access to the request body via \`$input.json('$.field')\`, the request context via \`$context.requestId\`, and stage variables via \`$stageVariables.varName\`.

The **Integration Response** phase receives the backend's response and applies another VTL template to transform it. The **Method Response** phase defines the HTTP status codes your API can return and optional response models. Together, these four phases give you complete control over request and response transformation at the API layer.`,
    },
    {
      heading: "Throttling & Caching",
      body: `API Gateway applies throttling using a token bucket algorithm at two levels. At the **account level**, the default limits are 10,000 requests per second steady-state with a burst of 5,000 — these apply across all APIs in the account. At the **stage and method level**, you can set lower limits per stage or even per individual method, which is useful for protecting specific endpoints.

When a client exceeds the rate limit, API Gateway returns **429 Too Many Requests**. Client code should implement exponential backoff with jitter when it receives 429 responses.

**API Caching** stores integration responses at the stage level, returning cached responses without hitting the backend for subsequent identical requests. You configure cache capacity (0.5 GB to 237 GB) and a TTL (default 300 seconds, maximum 3,600 seconds). The cache key is the URL path by default, but you can include query strings and headers to make it more specific. Clients can bypass the cache per-request by sending \`Cache-Control: max-age=0\` (if you allow it). To force all clients to see fresh data, you can flush the entire cache manually via the console or API. Caching is only available on REST APIs — HTTP APIs don't support it.`,
    },
    {
      heading: "CORS",
      body: `Cross-Origin Resource Sharing becomes necessary when a browser-based application served from one domain calls an API on a different domain. Browsers send an OPTIONS preflight request before the actual request, and the API must respond with the appropriate \`Access-Control-Allow-*\` headers, or the browser blocks the call.

For **HTTP APIs**, enabling CORS is a single toggle in the console — API Gateway handles the OPTIONS preflight response automatically and adds the required headers to all responses.

For **REST APIs**, the setup is manual. You add an OPTIONS method to each resource with a Mock integration that returns the required CORS headers: \`Access-Control-Allow-Origin\`, \`Access-Control-Allow-Methods\`, and \`Access-Control-Allow-Headers\`. You also need to add these headers to your actual method responses. The Lambda Proxy integration simplifies this if your Lambda function includes the CORS headers in its response object, but you still need the OPTIONS method on every resource.`,
    },
    {
      heading: "Private APIs",
      body: `A **Private REST API** is accessible only from within your VPC. No request from the public internet can reach it — the only path is through a **VPC Interface Endpoint** for the \`execute-api\` service, which creates an ENI with a private IP in your VPC that routes traffic to API Gateway.

Setting up a Private API requires three components working together. First, create a VPC Interface Endpoint for \`execute-api\` in your VPC. Second, set the API's endpoint type to Private when creating it. Third, attach a **resource policy** to the API that explicitly allows access — typically scoped to the specific VPC or VPC endpoint ID. Without all three elements, the API is either unreachable or reachable from the wrong source.

Private APIs are the right pattern for internal microservices that should never be exposed to the internet, or for backend-for-frontend architectures where the API only needs to be reachable from within your network.`,
    },
    {
      heading: "Monitoring & Observability",
      body: `API Gateway publishes CloudWatch metrics at the stage level and, optionally, the method level. The most important metrics are \`Count\` (total requests), \`4XXError\` (client errors like bad requests or auth failures), \`5XXError\` (server errors, including Lambda failures), \`Latency\` (total time from request receipt to response sent, including backend processing), and \`IntegrationLatency\` (time spent in the backend service alone). When \`Latency\` is high but \`IntegrationLatency\` is low, the bottleneck is in API Gateway itself — often due to mapping templates or caching misses. \`CacheHitCount\` and \`CacheMissCount\` help you evaluate caching effectiveness.

For detailed request logs, API Gateway supports two logging modes: **execution logging** (records API Gateway's processing of each request, including authorizer evaluation and mapping template application) and **access logging** (structured JSON that you define, typically including \`$context.requestId\`, \`$context.identity.sourceIp\`, \`$context.responseLength\`, and other context variables). Access logs are better for analyzing traffic patterns; execution logs are better for debugging.

Enable **X-Ray tracing** at the stage level to get end-to-end distributed traces. API Gateway adds itself as a trace segment and propagates the trace header to Lambda, giving you a unified view of latency across the full request path.`,
    },
    {
      heading: "API Gateway with Other Services",
      body: `The canonical serverless web API pattern is **API Gateway + Lambda**. Lambda Proxy integration passes all request context and returns a structured response — the combination handles essentially any REST API use case with minimal boilerplate.

**API Gateway + SQS** via AWS Service integration decouples HTTP clients from backend processing. The client POSTs to an API endpoint, API Gateway writes the message directly to SQS and returns 200 immediately, and a worker processes the message asynchronously. This is ideal for high-volume write endpoints where processing can be deferred.

**API Gateway + Cognito** is the standard way to add authentication to an API. The Cognito User Pool authorizer validates JWTs automatically — you configure it once and never write auth validation code. **API Gateway + WAF** attaches AWS WAF rules to a REST API stage or HTTP API to block SQL injection, XSS, rate-based attacks, and IP blocklists at the API layer.

Placing **CloudFront in front of API Gateway** gives you two caching layers (CloudFront at the edge, API Gateway caching in the region) and enables global acceleration for regional APIs. It also lets you apply WAF at the CloudFront level, which is cheaper per request than WAF at the API Gateway level for high-traffic APIs.`,
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
