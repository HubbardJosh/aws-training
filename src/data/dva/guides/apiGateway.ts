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
      quiz: [
        {
          question:
            "Which API Gateway type supports response caching, usage plans, and WAF integration?",
          options: ["HTTP API", "WebSocket API", "REST API", "All API types"],
          correctIndex: 2,
          explanation:
            "REST APIs support the full feature set including caching, usage plans, API keys, WAF, and resource policies. HTTP APIs are cheaper but lack these features.",
        },
        {
          question:
            "An application needs JWT (OIDC/OAuth2) authorization and the lowest cost per request. Which API type should you choose?",
          options: [
            "REST API with Cognito authorizer",
            "HTTP API",
            "WebSocket API",
            "REST API with Lambda authorizer",
          ],
          correctIndex: 1,
          explanation:
            "HTTP APIs natively support JWT authorizers for OIDC/OAuth2 and are roughly 70% cheaper than REST APIs — the right choice when you don't need REST API's advanced features.",
        },
        {
          question:
            "Which WebSocket API route key fires when a client first establishes a connection?",
          options: ["$default", "$disconnect", "$connect", "$open"],
          correctIndex: 2,
          explanation:
            "$connect fires when a client establishes a WebSocket connection. $disconnect fires on disconnection, and $default handles unmatched messages.",
        },
      ],
    },
    {
      heading: "Integration Types",
      body: `API Gateway's integration type determines how it communicates with your backend.

**Lambda Proxy Integration** is the most common pattern. API Gateway passes the entire HTTP request — headers, query parameters, path parameters, and body — as a structured JSON event to Lambda. Lambda returns a response object containing \`statusCode\`, \`headers\`, and \`body\`. The simplicity is the point: no mapping templates to write, no transformation logic to maintain.

**Lambda Non-Proxy (Custom) Integration** gives you more control through VTL (Velocity Template Language) mapping templates. You write a template that transforms the incoming request before Lambda sees it, and another template that transforms Lambda's response before the client receives it. This is more powerful but significantly more complex to maintain.

**AWS Service Integration** lets API Gateway call AWS service APIs directly — without Lambda acting as an intermediary. For example, you can configure API Gateway to write directly to an SQS queue, trigger a Step Functions state machine, or put an item in DynamoDB. Removing the Lambda hop reduces latency and eliminates the compute cost of a passthrough function.

**HTTP Proxy Integration** passes requests directly to an HTTP endpoint with no API Gateway transformation. **HTTP Custom Integration** adds VTL templates for request/response transformation when calling HTTP backends. **Mock Integration** returns a hard-coded response without calling any backend — useful for testing, CORS preflight responses, and building API stubs during development.`,
      quiz: [
        {
          question:
            "Which API Gateway integration type allows you to write directly to an SQS queue without a Lambda function?",
          options: [
            "Lambda Proxy Integration",
            "Mock Integration",
            "AWS Service Integration",
            "HTTP Proxy Integration",
          ],
          correctIndex: 2,
          explanation:
            "AWS Service Integration lets API Gateway call AWS service APIs (SQS, DynamoDB, Step Functions) directly, eliminating the Lambda passthrough function and reducing latency and cost.",
        },
        {
          question:
            "Lambda Proxy Integration vs Lambda Non-Proxy Integration: what does the Non-Proxy (Custom) integration add?",
          options: [
            "Faster response times",
            "VTL mapping templates to transform request and response",
            "JWT authorization support",
            "Built-in caching at the integration layer",
          ],
          correctIndex: 1,
          explanation:
            "Lambda Non-Proxy (Custom) integration uses VTL mapping templates to transform the request before Lambda receives it and the response before the client receives it — more power, more complexity.",
        },
        {
          question: "What is the best use case for a Mock Integration?",
          options: [
            "High-performance production endpoints",
            "Testing, CORS preflight responses, and API stubs during development",
            "Direct calls to DynamoDB without Lambda",
            "Forwarding requests to an on-premises HTTP server",
          ],
          correctIndex: 1,
          explanation:
            "Mock Integration returns a hard-coded response without calling any backend — ideal for CORS preflight responses, development stubs, and testing API consumers before the backend is built.",
        },
      ],
    },
    {
      heading: "Stages & Deployments",
      body: `In the REST API model, every change to your API configuration must be **deployed** before it takes effect. A deployment is a snapshot of your API's configuration at a moment in time. A **stage** is a named reference to a deployment — think of it as an environment label like \`dev\`, \`staging\`, or \`prod\`. Until you deploy your API to a stage, no one can call it.

**Stage Variables** are key-value pairs associated with a stage that you can reference in integration URIs and mapping templates as \`\${stageVariables.varName}\`. The classic use case is pointing different stages at different Lambda aliases:
\`arn:aws:lambda:us-east-1:123:function:myFn:\${stageVariables.lambdaAlias}\`

This lets a single API definition serve multiple environments by simply changing which Lambda alias each stage points to.

**Canary deployments** let you test a new deployment with a controlled percentage of traffic before committing fully. You route, say, 10% of traffic to the canary deployment while 90% stays on the base stage. Once you're satisfied with the canary's behavior, you promote it to become the base. Stage-level settings also control response caching, CloudWatch logging (ERROR or INFO level), X-Ray tracing, and method-level throttling overrides.`,
      quiz: [
        {
          question:
            "What is the primary use of stage variables in API Gateway?",
          options: [
            "Store secret credentials securely",
            "Point different stages at different Lambda aliases or backends",
            "Enable caching per environment",
            "Configure WAF rules per stage",
          ],
          correctIndex: 1,
          explanation:
            "Stage variables let a single API definition serve multiple environments by referencing ${stageVariables.varName} in integration URIs, typically to point dev/staging/prod at different Lambda aliases.",
        },
        {
          question:
            "A canary deployment in API Gateway sends 10% of traffic to a new version. What must you do to fully adopt the canary?",
          options: [
            "Delete the old stage",
            "Promote the canary to become the base stage",
            "Create a new API from scratch",
            "Update the stage variable",
          ],
          correctIndex: 1,
          explanation:
            "Once you are satisfied with the canary's behavior, you promote it to become the base deployment, shifting all traffic to the new version.",
        },
        {
          question:
            "In API Gateway, a change to an API configuration does not take effect until you:",
          options: [
            "Restart the API",
            "Update the stage variable",
            "Create a deployment to a stage",
            "Clear the API cache",
          ],
          correctIndex: 2,
          explanation:
            "API Gateway REST APIs require an explicit deployment to a stage before any configuration changes are visible to callers. The stage references the deployment snapshot.",
        },
      ],
    },
    {
      heading: "Authorizers & Security",
      body: `API Gateway supports several authorization mechanisms, each suited to different trust models.

**IAM Authorization** requires callers to sign requests using AWS Signature Version 4 with valid AWS credentials. API Gateway verifies the signature and checks that the caller's IAM policies include \`execute-api:Invoke\`. This is well-suited for service-to-service calls within AWS, where calling code runs with an IAM role.

**Cognito User Pool Authorizer** validates JWTs issued by a Cognito User Pool automatically — no Lambda code required. You configure which User Pool to validate against and which token (ID token or Access token) to expect in the Authorization header. The authorizer checks the signature, expiry, and audience claim. Note that it does not validate OAuth scopes — if you need scope-based access control, you'll need a Lambda authorizer.

**Lambda Authorizers** are custom functions that validate any token format — OAuth, JWT, SAML, or a proprietary scheme. There are two subtypes: token-based (receives just the token string from the Authorization header) and request-based (receives the full request context including headers and query params, giving more flexibility). The authorizer returns an IAM policy that either allows or denies access. Lambda authorizer results can be cached for up to 3,600 seconds, keyed on the token or identity source, to avoid invoking the Lambda on every request.

**Resource Policies** are JSON policies attached to the API itself that control which principals, accounts, VPCs, or IP ranges can call the API. They're required for cross-account access and for Private APIs. **Usage Plans** combined with **API Keys** enable per-client rate limiting (requests per second and burst) and quotas (requests per day or month) — the standard mechanism for monetized APIs.`,
      quiz: [
        {
          question:
            "The Cognito User Pool Authorizer validates a JWT, but which feature does it NOT support?",
          options: [
            "Token signature validation",
            "Token expiry check",
            "Audience (app client ID) validation",
            "OAuth scope enforcement",
          ],
          correctIndex: 3,
          explanation:
            "The Cognito authorizer validates the JWT signature, expiry, and audience, but does NOT enforce OAuth scopes. You need a Lambda authorizer or HTTP API's native JWT authorizer (which does check scopes) for scope-based control.",
        },
        {
          question:
            "How long can a Lambda authorizer result be cached to reduce repeated invocations?",
          options: [
            "60 seconds",
            "300 seconds",
            "1,800 seconds",
            "3,600 seconds",
          ],
          correctIndex: 3,
          explanation:
            "Lambda authorizer results can be cached for up to 3,600 seconds (1 hour), keyed on the token or identity source, avoiding a Lambda call on every API request.",
        },
        {
          question:
            "Which authorization mechanism is required for cross-account API Gateway access?",
          options: [
            "Cognito User Pool Authorizer",
            "Lambda Authorizer",
            "Resource Policy",
            "IAM Authorization only",
          ],
          correctIndex: 2,
          explanation:
            "Resource Policies are required for cross-account access and for Private APIs. They are JSON policies attached to the API itself that specify which principals or accounts can call it.",
        },
      ],
    },
    {
      heading: "Request/Response Processing",
      body: `For REST APIs, each method request flows through four processing phases before reaching the backend and four more on the return path. Understanding this pipeline is key to writing correct mapping templates.

The **Method Request** phase is where API Gateway validates the incoming request. You can define required headers, query parameters, and a JSON Schema model for the request body. If validation fails, API Gateway returns a 400 response without ever invoking the backend — this saves Lambda invocations and is a cost-effective way to reject malformed requests.

The **Integration Request** phase is where you transform the validated request using a VTL mapping template before sending it to the backend. VTL gives you access to the request body via \`$input.json('$.field')\`, the request context via \`$context.requestId\`, and stage variables via \`$stageVariables.varName\`.

The **Integration Response** phase receives the backend's response and applies another VTL template to transform it. The **Method Response** phase defines the HTTP status codes your API can return and optional response models. Together, these four phases give you complete control over request and response transformation at the API layer.`,
      quiz: [
        {
          question:
            "API Gateway request validation fails because a required query parameter is missing. What HTTP status does API Gateway return — and does it invoke Lambda?",
          options: [
            "400, and Lambda is still invoked",
            "400, and Lambda is NOT invoked",
            "404, and Lambda is NOT invoked",
            "500, and Lambda is NOT invoked",
          ],
          correctIndex: 1,
          explanation:
            "Request validation failures return 400 Bad Request without invoking the backend Lambda, saving compute cost and protecting downstream services from malformed input.",
        },
        {
          question:
            "In VTL mapping templates, which variable gives you access to the incoming request body?",
          options: [
            "$context.body",
            "$input.json('$')",
            "$stageVariables.body",
            "$request.payload",
          ],
          correctIndex: 1,
          explanation:
            "$input.json('$') returns the entire request body as a JSON string. $input.json('$.field') extracts a specific field. $context provides request context metadata; $stageVariables provides stage variable values.",
        },
      ],
    },
    {
      heading: "Throttling & Caching",
      body: `API Gateway applies throttling using a token bucket algorithm at two levels. At the **account level**, the default limits are 10,000 requests per second steady-state with a burst of 5,000 — these apply across all APIs in the account. At the **stage and method level**, you can set lower limits per stage or even per individual method, which is useful for protecting specific endpoints.

When a client exceeds the rate limit, API Gateway returns **429 Too Many Requests**. Client code should implement exponential backoff with jitter when it receives 429 responses.

**API Caching** stores integration responses at the stage level, returning cached responses without hitting the backend for subsequent identical requests. You configure cache capacity (0.5 GB to 237 GB) and a TTL (default 300 seconds, maximum 3,600 seconds). The cache key is the URL path by default, but you can include query strings and headers to make it more specific. Clients can bypass the cache per-request by sending \`Cache-Control: max-age=0\` (if you allow it). To force all clients to see fresh data, you can flush the entire cache manually via the console or API. Caching is only available on REST APIs — HTTP APIs don't support it.`,
      quiz: [
        {
          question:
            "What is the default account-level rate limit for API Gateway?",
          options: [
            "1,000 RPS with 500 burst",
            "5,000 RPS with 10,000 burst",
            "10,000 RPS with 5,000 burst",
            "Unlimited",
          ],
          correctIndex: 2,
          explanation:
            "The default account-level throttle is 10,000 requests per second steady-state with a burst of 5,000. These limits apply across all APIs in the account and can be raised via Service Quotas.",
        },
        {
          question:
            "API caching in API Gateway is available on which API type?",
          options: [
            "HTTP APIs only",
            "WebSocket APIs only",
            "REST APIs only",
            "All API types",
          ],
          correctIndex: 2,
          explanation:
            "Caching is only available on REST APIs. HTTP APIs do not support response caching — one of the key feature gaps compared to REST APIs.",
        },
        {
          question:
            "A client wants to bypass the API Gateway cache for a specific request. What header should it send?",
          options: [
            "Cache-Control: no-cache",
            "Cache-Control: max-age=0",
            "X-Cache-Bypass: true",
            "Pragma: no-cache",
          ],
          correctIndex: 1,
          explanation:
            "Clients can bypass the cache per-request by sending Cache-Control: max-age=0 (if the API is configured to allow it). The cache can also be fully flushed via the console or API.",
        },
      ],
    },
    {
      heading: "CORS",
      body: `Cross-Origin Resource Sharing becomes necessary when a browser-based application served from one domain calls an API on a different domain. Browsers send an OPTIONS preflight request before the actual request, and the API must respond with the appropriate \`Access-Control-Allow-*\` headers, or the browser blocks the call.

For **HTTP APIs**, enabling CORS is a single toggle in the console — API Gateway handles the OPTIONS preflight response automatically and adds the required headers to all responses.

For **REST APIs**, the setup is manual. You add an OPTIONS method to each resource with a Mock integration that returns the required CORS headers: \`Access-Control-Allow-Origin\`, \`Access-Control-Allow-Methods\`, and \`Access-Control-Allow-Headers\`. You also need to add these headers to your actual method responses. The Lambda Proxy integration simplifies this if your Lambda function includes the CORS headers in its response object, but you still need the OPTIONS method on every resource.`,
      quiz: [
        {
          question:
            "For a REST API, what is required to handle CORS preflight requests?",
          options: [
            "Enable the CORS toggle in the console",
            "Add an OPTIONS method with a Mock integration returning CORS headers on each resource",
            "Add a WAF rule to allow OPTIONS requests",
            "Nothing — REST API handles CORS automatically",
          ],
          correctIndex: 1,
          explanation:
            "REST APIs require manual CORS setup: an OPTIONS method with a Mock integration returning Access-Control-Allow-* headers on each resource. HTTP APIs have a CORS toggle that handles this automatically.",
        },
        {
          question:
            "Which HTTP method do browsers send as a CORS preflight before the actual cross-origin request?",
          options: ["GET", "POST", "OPTIONS", "HEAD"],
          correctIndex: 2,
          explanation:
            "Browsers send an OPTIONS preflight request to check if the server allows the cross-origin request. The API must respond with appropriate Access-Control-Allow-* headers or the browser blocks the request.",
        },
      ],
    },
    {
      heading: "Private APIs",
      body: `A **Private REST API** is accessible only from within your VPC. No request from the public internet can reach it — the only path is through a **VPC Interface Endpoint** for the \`execute-api\` service, which creates an ENI with a private IP in your VPC that routes traffic to API Gateway.

Setting up a Private API requires three components working together. First, create a VPC Interface Endpoint for \`execute-api\` in your VPC. Second, set the API's endpoint type to Private when creating it. Third, attach a **resource policy** to the API that explicitly allows access — typically scoped to the specific VPC or VPC endpoint ID. Without all three elements, the API is either unreachable or reachable from the wrong source.

Private APIs are the right pattern for internal microservices that should never be exposed to the internet, or for backend-for-frontend architectures where the API only needs to be reachable from within your network.`,
      quiz: [
        {
          question:
            "What three components are required to set up a Private API in API Gateway?",
          options: [
            "NAT Gateway, private subnet, and API key",
            "VPC Interface Endpoint for execute-api, Private endpoint type, and resource policy",
            "VPN connection, security group, and Lambda authorizer",
            "Direct Connect, VPC Peering, and WAF",
          ],
          correctIndex: 1,
          explanation:
            "A Private API requires: (1) a VPC Interface Endpoint for execute-api, (2) the API endpoint type set to Private, and (3) a resource policy explicitly allowing access. All three must be in place.",
        },
        {
          question:
            "What creates the private network path to a Private REST API from within a VPC?",
          options: [
            "NAT Gateway",
            "VPC Peering",
            "VPC Interface Endpoint for execute-api",
            "Internet Gateway",
          ],
          correctIndex: 2,
          explanation:
            "A VPC Interface Endpoint for the execute-api service creates an ENI with a private IP in your VPC. This is the only network path to a Private API — no internet routing is involved.",
        },
      ],
    },
    {
      heading: "Monitoring & Observability",
      body: `API Gateway publishes CloudWatch metrics at the stage level and, optionally, the method level. The most important metrics are \`Count\` (total requests), \`4XXError\` (client errors like bad requests or auth failures), \`5XXError\` (server errors, including Lambda failures), \`Latency\` (total time from request receipt to response sent, including backend processing), and \`IntegrationLatency\` (time spent in the backend service alone). When \`Latency\` is high but \`IntegrationLatency\` is low, the bottleneck is in API Gateway itself — often due to mapping templates or caching misses. \`CacheHitCount\` and \`CacheMissCount\` help you evaluate caching effectiveness.

For detailed request logs, API Gateway supports two logging modes: **execution logging** (records API Gateway's processing of each request, including authorizer evaluation and mapping template application) and **access logging** (structured JSON that you define, typically including \`$context.requestId\`, \`$context.identity.sourceIp\`, \`$context.responseLength\`, and other context variables). Access logs are better for analyzing traffic patterns; execution logs are better for debugging.

Enable **X-Ray tracing** at the stage level to get end-to-end distributed traces. API Gateway adds itself as a trace segment and propagates the trace header to Lambda, giving you a unified view of latency across the full request path.`,
      quiz: [
        {
          question:
            "Latency is high but IntegrationLatency is low in CloudWatch metrics. Where is the bottleneck?",
          options: [
            "The Lambda function is slow",
            "The database is throttled",
            "API Gateway itself — likely mapping templates or cache misses",
            "The client network connection is slow",
          ],
          correctIndex: 2,
          explanation:
            "IntegrationLatency measures time in the backend only. If Latency is high but IntegrationLatency is low, the extra time is being spent in API Gateway — often VTL mapping template processing or cache misses.",
        },
        {
          question:
            "Which API Gateway logging mode is better for debugging authorizer evaluation and mapping template issues?",
          options: [
            "Access logging",
            "Execution logging",
            "CloudWatch metrics",
            "X-Ray tracing",
          ],
          correctIndex: 1,
          explanation:
            "Execution logging records API Gateway's internal processing including authorizer evaluation and mapping template application. Access logging captures structured request/response data better for traffic analysis.",
        },
      ],
    },
    {
      heading: "API Gateway with Other Services",
      body: `The canonical serverless web API pattern is **API Gateway + Lambda**. Lambda Proxy integration passes all request context and returns a structured response — the combination handles essentially any REST API use case with minimal boilerplate.

**API Gateway + SQS** via AWS Service integration decouples HTTP clients from backend processing. The client POSTs to an API endpoint, API Gateway writes the message directly to SQS and returns 200 immediately, and a worker processes the message asynchronously. This is ideal for high-volume write endpoints where processing can be deferred.

**API Gateway + Cognito** is the standard way to add authentication to an API. The Cognito User Pool authorizer validates JWTs automatically — you configure it once and never write auth validation code. **API Gateway + WAF** attaches AWS WAF rules to a REST API stage or HTTP API to block SQL injection, XSS, rate-based attacks, and IP blocklists at the API layer.

Placing **CloudFront in front of API Gateway** gives you two caching layers (CloudFront at the edge, API Gateway caching in the region) and enables global acceleration for regional APIs. It also lets you apply WAF at the CloudFront level, which is cheaper per request than WAF at the API Gateway level for high-traffic APIs.`,
      quiz: [
        {
          question:
            "A high-volume write endpoint must accept requests instantly and process them asynchronously. Which integration pattern achieves this?",
          options: [
            "API Gateway + Lambda (synchronous)",
            "API Gateway + SQS via AWS Service integration",
            "API Gateway + DynamoDB direct write",
            "API Gateway + Step Functions synchronous express",
          ],
          correctIndex: 1,
          explanation:
            "API Gateway + SQS via AWS Service integration accepts the request, writes it to SQS, and returns 200 immediately. Workers then process the messages asynchronously without the client waiting.",
        },
        {
          question:
            "When placing CloudFront in front of API Gateway, which API Gateway endpoint type is correct to use as the origin?",
          options: [
            "Edge-Optimized",
            "Regional",
            "Private",
            "Any type works equally well",
          ],
          correctIndex: 1,
          explanation:
            "A Regional API Gateway endpoint is the correct type to use behind CloudFront. Edge-Optimized already uses CloudFront internally, so adding another CloudFront distribution in front of it would be redundant.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "Which API Gateway type is roughly 70% cheaper than REST APIs and natively supports JWT authorizers?",
      options: [
        "REST API (Edge-Optimized)",
        "HTTP API",
        "WebSocket API",
        "REST API (Private)",
      ],
      correctIndex: 1,
      explanation:
        "HTTP APIs are approximately 70% cheaper and 60% lower latency than REST APIs, and natively support JWT (OIDC/OAuth2) authorizers. They trade the advanced REST API feature set for lower cost.",
    },
    {
      question:
        "A Lambda authorizer returns an IAM policy. How long can this result be cached?",
      options: [
        "60 seconds",
        "300 seconds",
        "3,600 seconds",
        "It cannot be cached",
      ],
      correctIndex: 2,
      explanation:
        "Lambda authorizer results can be cached for up to 3,600 seconds (1 hour), keyed on the token or identity source, avoiding repeated Lambda invocations for every API request.",
    },
    {
      question:
        "Request validation fails at API Gateway for a missing required header. Which statement is correct?",
      options: [
        "API Gateway returns 500 and invokes Lambda",
        "API Gateway returns 400 and Lambda is not invoked",
        "API Gateway returns 403 and Lambda is not invoked",
        "Lambda is invoked and handles the validation error",
      ],
      correctIndex: 1,
      explanation:
        "Request validation rejections return HTTP 400 without invoking the backend Lambda, saving compute cost and keeping invalid requests from reaching downstream services.",
    },
    {
      question:
        "Which API type requires a VPC Interface Endpoint and a resource policy to be accessible?",
      options: [
        "Edge-Optimized REST API",
        "Regional REST API",
        "HTTP API",
        "Private REST API",
      ],
      correctIndex: 3,
      explanation:
        "Private REST APIs require a VPC Interface Endpoint for execute-api, the endpoint type set to Private, and a resource policy explicitly allowing access — three components that must all be in place.",
    },
    {
      question:
        "API Gateway Latency is 800ms but IntegrationLatency is 50ms. What does this indicate?",
      options: [
        "Lambda function is slow",
        "DynamoDB is throttled",
        "The bottleneck is within API Gateway itself",
        "Client connection is slow",
      ],
      correctIndex: 2,
      explanation:
        "IntegrationLatency measures time in the backend. If Latency >> IntegrationLatency, the excess time is spent in API Gateway — likely VTL mapping template processing or cache misses.",
    },
    {
      question:
        "Which integration type allows API Gateway to write directly to SQS without a Lambda function?",
      options: [
        "Lambda Proxy Integration",
        "HTTP Proxy Integration",
        "AWS Service Integration",
        "Mock Integration",
      ],
      correctIndex: 2,
      explanation:
        "AWS Service Integration enables API Gateway to call AWS service APIs directly — SQS, DynamoDB, Step Functions — without a Lambda passthrough, reducing latency and cost.",
    },
    {
      question:
        "Stage variables in API Gateway are most commonly used for which purpose?",
      options: [
        "Storing database passwords",
        "Configuring WAF rules",
        "Pointing stages at different Lambda aliases or backends",
        "Setting cache TTL values",
      ],
      correctIndex: 2,
      explanation:
        "Stage variables let a single API definition serve multiple environments by referencing ${stageVariables.varName} in integration URIs — the classic pattern points dev/staging/prod at different Lambda aliases.",
    },
    {
      question:
        "What HTTP status code does API Gateway return when a client exceeds the rate limit?",
      options: [
        "400 Bad Request",
        "403 Forbidden",
        "429 Too Many Requests",
        "503 Service Unavailable",
      ],
      correctIndex: 2,
      explanation:
        "API Gateway returns HTTP 429 Too Many Requests when a client exceeds the configured rate limit. Clients should implement exponential backoff with jitter when receiving 429 responses.",
    },
  ],
};
