import { ServiceGuide } from "../../../types/guide";

export const xrayGuide: ServiceGuide = {
  id: "aws-x-ray",
  service: "AWS X-Ray",
  domain: "development",
  tagline: "Analyze and debug distributed applications",
  intro:
    "X-Ray provides distributed tracing for applications, letting you trace requests as they travel through Lambda, API Gateway, EC2, ECS, microservices, and databases. It visualizes service maps, identifies bottlenecks, and surfaces errors across complex architectures.",

  sections: [
    {
      heading: "Core Concepts",
      body: `X-Ray's tracing model is built around a hierarchy of data structures that together represent a single request's journey through your system.

A **trace** is the top-level container — it represents one end-to-end request and is identified by a unique **Trace ID** that propagates via the \`X-Amzn-Trace-Id\` HTTP header. Every service that processes the request adds its data to the trace by submitting segments. When you look at a trace in the X-Ray console, you see the entire request's lifecycle stitched together across all services.

A **segment** is the data block that one service emits for its participation in a request — including timing, HTTP request and response metadata, errors, and any downstream calls. A **subsegment** provides finer-grained detail within a segment: individual DynamoDB queries, outbound HTTP calls to third-party APIs, SQL queries, or any block of code you want to time and annotate. The SDK creates subsegments automatically for AWS SDK calls and HTTP requests, and you can create custom subsegments in your application code.

**Annotations** and **metadata** are two ways to attach additional information to segments and subsegments. Annotations are indexed key-value pairs (strings, numbers, or booleans) that you can filter by in the X-Ray console — for example, filtering all traces by \`userId\` or \`orderId\`. Metadata is arbitrary JSON-serializable data that appears in trace details but is not indexed, so it can't be used for filtering but can contain rich debugging information. The **service map** is X-Ray's visual output: an automatically generated graph showing every service that participated in recent traces, with edges representing calls between services, color-coded by health (green, yellow, orange, red), and annotated with request rates, error rates, and latency percentiles.`,
      quiz: [
        {
          question:
            "A customer reports a problem with a specific order. The development team wants to find all X-Ray traces related to that order ID. What type of data must the application attach to traces to enable filtering by order ID?",
          options: [
            "Tags — AWS resource tags applied to the X-Ray group",
            "Metadata — rich JSON data that can be searched in the X-Ray console",
            "Annotations — indexed key-value pairs that can be used as filter expressions",
            "Subsegments — named code blocks that appear in trace timelines",
          ],
          correctIndex: 2,
          explanation:
            "Annotations are indexed key-value pairs (strings, numbers, or booleans) that can be used to filter traces in the X-Ray console. By annotating traces with `orderId`, the team can instantly retrieve all traces for that specific order. Metadata is not indexed and cannot be used for filtering — it is only visible when viewing individual trace details.",
        },
        {
          question:
            "How does the X-Ray Trace ID propagate across HTTP service boundaries so that downstream services can contribute to the same trace?",
          options: [
            "The Trace ID is stored in a DynamoDB table and each service looks it up by request timestamp",
            "The Trace ID propagates via the `X-Amzn-Trace-Id` HTTP header, which the SDK reads and continues automatically",
            "Each service generates its own Trace ID; X-Ray correlates them by matching timestamps",
            "The Trace ID is embedded in the JWT token and extracted by each downstream service",
          ],
          correctIndex: 1,
          explanation:
            "X-Ray propagates the Trace ID via the `X-Amzn-Trace-Id` HTTP header. When the X-Ray SDK instruments an outbound HTTP call, it automatically adds this header. Downstream services with the SDK installed read the header, extract the Trace ID, and emit their segments with the same ID — stitching all service participation into a single trace.",
        },
        {
          question:
            "What is the difference between a segment and a subsegment in X-Ray?",
          options: [
            "A segment represents one AWS account's participation; a subsegment represents one service within that account",
            "A segment is the data one service emits for a request; a subsegment provides finer-grained detail within that segment (individual DB queries, outbound HTTP calls, custom code blocks)",
            "Segments are created automatically by the SDK; subsegments must always be created manually in application code",
            "A segment is the top-level trace container; a subsegment is the data one service emits",
          ],
          correctIndex: 1,
          explanation:
            "A segment is the data block emitted by one service for its participation in a request, capturing overall timing, HTTP metadata, and errors. Subsegments provide granular detail within a segment — individual DynamoDB queries, outbound API calls, SQL queries, or custom-named code blocks. The SDK automatically creates subsegments for AWS SDK calls; developers create additional custom subsegments to time specific business logic.",
        },
      ],
    },
    {
      heading: "X-Ray SDK & Integration",
      body: `The X-Ray SDK is available for Node.js, Python, Java, Go, Ruby, and .NET, and it instruments your application in two complementary ways: automatic instrumentation of infrastructure-level calls (HTTP requests, AWS SDK calls) and manual instrumentation for custom business logic.

In Python, \`patch_all()\` automatically wraps the \`boto3\` library, the \`requests\` library, and other supported libraries so that all AWS SDK calls and outbound HTTP requests are automatically traced as subsegments without any additional code:
\`\`\`python
from aws_xray_sdk.core import xray_recorder, patch_all
patch_all()  # patches boto3, requests, etc.

@xray_recorder.capture('process_order')
def process_order(order_id):
    # This block creates a subsegment named 'process_order'
    ...
\`\`\`
The \`@xray_recorder.capture\` decorator creates a named subsegment for any function, and \`xray_recorder.begin_subsegment\` / \`end_subsegment\` provides the same capability without decorators.

**Lambda** is the simplest integration path: enable Active Tracing in the Lambda function configuration (or set \`Tracing: Active\` in SAM/CDK), and Lambda automatically creates a segment for each invocation and passes the trace context to the X-Ray SDK. The Lambda runtime handles the daemon communication, so no sidecar is needed.

**API Gateway** tracing is enabled per stage — API Gateway creates segments for each request and passes the Trace ID downstream to the integration target (Lambda or HTTP backend). **ECS and Fargate** run the X-Ray daemon as a sidecar container alongside your application container. The application SDK sends UDP segments to the daemon at \`localhost:2000\` (in \`awsvpc\` mode) or to the daemon container's IP (in \`bridge\` mode). **Elastic Beanstalk** has the daemon pre-installed and enables it via the console or \`.ebextensions\` configuration.`,
      quiz: [
        {
          question:
            "A Python Lambda function uses boto3 to call DynamoDB. The developer wants all DynamoDB calls to appear as subsegments in X-Ray traces automatically, without wrapping each call manually. What single function call achieves this?",
          options: [
            "`patch_all()` from the aws_xray_sdk.core module, which automatically instruments boto3 and other supported libraries",
            "`xray_recorder.capture('dynamodb')` as a decorator on the handler function",
            "No code change is needed — Lambda automatically traces all boto3 calls when Active Tracing is enabled",
            "`xray_recorder.begin_subsegment('dynamodb')` before each boto3 call",
          ],
          correctIndex: 0,
          explanation:
            "`patch_all()` patches supported libraries including boto3, requests, and others so that all their calls automatically create X-Ray subsegments. Without `patch_all()`, boto3 calls are not traced even if Active Tracing is enabled on the Lambda function. Active Tracing creates the top-level segment for the invocation, but `patch_all()` is required for automatic subsegment creation for downstream calls.",
        },
        {
          question: "How is X-Ray tracing enabled for a Lambda function?",
          options: [
            "Set `Tracing: Active` in the Lambda configuration (console, SAM, or CDK) — the Lambda runtime handles daemon communication automatically",
            "Install the X-Ray daemon as a Lambda layer and configure the daemon address",
            "Attach an IAM policy with `xray:PutTraceSegments` to the Lambda execution role and tracing enables automatically",
            "Add an X-Ray SDK initialization call in the Lambda handler before any other code",
          ],
          correctIndex: 0,
          explanation:
            "Enabling X-Ray on Lambda requires setting Active Tracing in the function configuration (`Tracing: Active` in SAM/CDK or the equivalent console toggle). The Lambda runtime has built-in daemon functionality — it creates a segment for each invocation and handles sending data to X-Ray. No separate daemon process is needed, unlike ECS where a sidecar container is required.",
        },
        {
          question:
            "An ECS Fargate task uses `awsvpc` networking mode and has an X-Ray daemon sidecar container. Where should the application SDK send UDP segment data?",
          options: [
            "To `127.0.0.1:4000` — Fargate uses a non-standard daemon port",
            "To the daemon container's task IP address, discovered via the ECS metadata endpoint",
            "To `localhost:2000` — in `awsvpc` mode, the sidecar shares the task's network namespace",
            "To the X-Ray service endpoint directly — ECS does not require a daemon sidecar",
          ],
          correctIndex: 2,
          explanation:
            "In `awsvpc` networking mode, each ECS task gets its own network namespace, so all containers in the task share the same localhost interface. The application SDK sends UDP segment data to `localhost:2000` where the X-Ray daemon sidecar is listening. In `bridge` networking mode, containers have separate network namespaces, so the SDK must use the daemon container's specific IP address and the `AWS_XRAY_DAEMON_ADDRESS` environment variable must be set.",
        },
      ],
    },
    {
      heading: "X-Ray Daemon",
      body: `The **X-Ray daemon** is a lightweight background process that buffers trace segments locally and forwards them to the X-Ray service in batches. It listens for UDP segments on port 2000 and sends them via HTTPS to the X-Ray API. The daemon pattern exists for an important reason: it decouples your application from the latency and retry logic of making synchronous HTTP calls to the X-Ray API. The SDK sends UDP (fire-and-forget, zero blocking time) to the local daemon, and the daemon handles batching, retries, and error handling asynchronously.

For most environments — EC2 instances and ECS tasks — you run the daemon as a background process or sidecar container. If the daemon is not on \`localhost\`, set the \`AWS_XRAY_DAEMON_ADDRESS\` environment variable to point the SDK to the correct address. In ECS with \`bridge\` networking, the daemon sidecar has a container-specific IP, so this environment variable is required for the application container to find it.

The daemon's IAM principal (instance profile for EC2, task role for ECS) needs two permissions: \`xray:PutTraceSegments\` to send segment data and \`xray:PutTelemetryRecords\` to send operational metrics about the daemon itself. **Lambda is the exception**: the Lambda runtime includes built-in daemon functionality, so you don't deploy a separate daemon process and don't need to manage these IAM permissions explicitly — they're included in Lambda's managed execution model.`,
      quiz: [
        {
          question:
            "Why does the X-Ray SDK send segment data via UDP to the local daemon rather than making direct HTTPS calls to the X-Ray API?",
          options: [
            "The X-Ray API does not support HTTPS — UDP is the only supported protocol",
            "UDP is fire-and-forget with zero blocking time, decoupling the application from the latency and retry logic of synchronous API calls",
            "The daemon compresses segment data before sending, reducing bandwidth costs",
            "Direct API calls require VPC endpoints, which are not available in all regions",
          ],
          correctIndex: 1,
          explanation:
            "The daemon pattern exists to keep tracing overhead invisible to application latency. UDP is fire-and-forget — the SDK sends the segment and immediately continues without waiting for acknowledgment. The daemon handles batching, retries, and HTTPS communication with the X-Ray API asynchronously. If the application made synchronous HTTPS calls directly, every traced request would incur the latency of an API round-trip.",
        },
        {
          question:
            "An ECS task running in `bridge` networking mode cannot send trace data to the X-Ray daemon sidecar. The daemon is running but the application SDK cannot find it. What is the most likely fix?",
          options: [
            "Restart the daemon sidecar container to re-register its UDP listener on port 2000",
            "Add `xray:PutTraceSegments` to the application container's IAM task role",
            "Set the `AWS_XRAY_DAEMON_ADDRESS` environment variable to the daemon container's IP address, since bridge mode containers have separate network namespaces",
            "Switch to `awsvpc` networking mode — bridge mode does not support X-Ray",
          ],
          correctIndex: 2,
          explanation:
            "In `bridge` networking mode, ECS containers have separate network namespaces and cannot communicate via `localhost`. The application container needs to know the daemon container's specific IP address. Setting `AWS_XRAY_DAEMON_ADDRESS` to that IP (and port 2000) tells the SDK where to send UDP segment data. In `awsvpc` mode, all containers share the task's network namespace, so `localhost:2000` works without any additional configuration.",
        },
        {
          question:
            "Which two IAM permissions does the X-Ray daemon's IAM principal require to operate correctly?",
          options: [
            "`xray:CreateGroup` and `xray:PutTraceSegments`",
            "`xray:GetTraceSummaries` and `xray:BatchGetTraces`",
            "`xray:PutTraceSegments` and `xray:GetSamplingRules`",
            "`xray:PutTraceSegments` and `xray:PutTelemetryRecords`",
          ],
          correctIndex: 3,
          explanation:
            "`xray:PutTraceSegments` allows the daemon to send buffered segment data to the X-Ray service. `xray:PutTelemetryRecords` allows the daemon to send operational metrics about itself (segments received, sent, dropped). Both permissions are required for the daemon to function correctly. Note that `xray:GetSamplingRules` is fetched by the SDK (not the daemon) to retrieve current sampling configuration.",
        },
      ],
    },
    {
      heading: "Sampling Rules",
      body: `Tracing every single request in a high-traffic application would be expensive and generate more data than is practical to analyze. Sampling controls what fraction of requests are actually traced, balancing cost and observability.

X-Ray's default sampling rule traces the **first request per second** from each host (the reservoir — ensuring at least some traces even for low-traffic services) plus **5% of additional requests** beyond that. For most applications, this provides good coverage at reasonable cost without tracing every request.

**Custom sampling rules** let you override the default for specific traffic patterns. You define rules by service name, host, URL path, and HTTP method, and set a reservoir (fixed count per second, always traced) and a rate (percentage of requests beyond the reservoir). Rules are evaluated in priority order — the first matching rule applies, with the default rule as the last resort. Higher-priority rules for specific endpoints (like a high-value checkout flow) can ensure those requests are traced at 100%, while lower-priority rules reduce sampling for high-volume but less critical endpoints like health checks.

The SDK fetches current sampling rules at runtime via the \`GetSamplingRules\` API, which means you can update sampling configuration in the X-Ray console and it takes effect without redeploying your application. This is a significant operational advantage — you can increase sampling temporarily to debug a production issue and then reduce it again, all without touching your code. Sampling rules also affect cost directly, so tuning them is an important cost optimization for high-traffic services.`,
      quiz: [
        {
          question: "What does X-Ray's default sampling rule trace?",
          options: [
            "10% of all requests with a minimum of 1 request per minute",
            "100% of all requests — sampling is opt-in only",
            "The first request per minute plus 1% of additional requests",
            "The first request per second (reservoir) plus 5% of additional requests beyond that",
          ],
          correctIndex: 3,
          explanation:
            "X-Ray's default sampling rule traces the first request per second from each host (the reservoir, ensuring at least some traces even for very low-traffic services) plus 5% of all additional requests beyond that. This balances observability with cost — enough traces to identify issues without recording every request in high-traffic services.",
        },
        {
          question:
            "A production application has a `/health` endpoint receiving 10,000 requests per minute. Tracing all health check requests is wasteful. A `/checkout` endpoint handles 100 requests per minute and must be traced at 100%. How should custom sampling rules be configured?",
          options: [
            "Create a high-priority rule for `/checkout` with 100% rate, and a lower-priority rule for `/health` with 0% rate (or very low reservoir/rate)",
            "Sampling rules cannot target specific URL paths — use annotations to filter in post-processing",
            "Set a single global rule to 100% sampling, then add a `/health` exclusion filter in CloudWatch Logs",
            "Set the default rule to 0% and create individual rules for every endpoint that should be traced",
          ],
          correctIndex: 0,
          explanation:
            "Custom sampling rules target specific URL paths, HTTP methods, service names, and hosts. Create a high-priority rule matching `/checkout` with a rate of 1.0 (100%) to ensure all checkout requests are traced. Create a lower-priority rule (evaluated after the checkout rule) matching `/health` with a reservoir of 0 and rate of 0 to suppress tracing. The default rule handles all other unmatched traffic.",
        },
        {
          question:
            "A team discovers a production issue and needs to immediately increase X-Ray sampling to 100% for a specific service to capture all traces. They do not want to redeploy the service. Is this possible, and how?",
          options: [
            "No — sampling rules are baked into the application code and require a redeploy to change",
            "Yes — update the sampling rule in the X-Ray console; the SDK fetches rules via GetSamplingRules at runtime and the change takes effect without redeployment",
            "Yes — but only by setting the `AWS_XRAY_SAMPLING_RATE` environment variable and restarting the function",
            "No — sampling rate changes require a CloudFormation stack update to take effect",
          ],
          correctIndex: 1,
          explanation:
            "The X-Ray SDK fetches current sampling rules at runtime via the `GetSamplingRules` API. Updating a sampling rule in the X-Ray console takes effect within seconds without any application redeployment. This operational flexibility allows teams to increase sampling during incident investigation and reduce it again afterward — all without touching code or triggering a deployment.",
        },
      ],
    },
    {
      heading: "Service Map & Analysis",
      body: `The **Service Map** is X-Ray's primary visual output — an automatically generated graph of all services involved in traced requests. Each node represents a service (Lambda function, API Gateway, DynamoDB table, external HTTP endpoint, or any other instrumented resource), and edges represent calls between services with latency and error rate annotations. Nodes are color-coded: green means healthy, yellow means slow, orange means there are client errors (4xx), and red means there are server errors (5xx) or faults. At a glance, the service map shows you where in your distributed system problems are occurring.

**Trace filtering** lets you narrow down which traces you're examining. You can filter by service name, URL, HTTP method, status code, and duration (e.g. \`duration > 5\` to find slow requests). Most importantly, you can filter by **annotations** — the indexed key-value pairs your application attaches to traces. If you annotate traces with \`userId\`, you can instantly retrieve all traces for a specific user who reported a problem. If you annotate with \`orderId\`, you can trace exactly what happened to a specific order through every service it touched.

**Groups** are saved filter expressions with names, appearing as separate views in the service map. A "PaymentErrors" group filtered to 5xx responses from your payment service gives you a dedicated operational view for payment reliability. Groups can have separate sampling rules — you can sample payment-related requests at a higher rate than general traffic.

**X-Ray Insights** automatically detects anomalies in your trace data — spikes in error rates, latency regressions, or sudden changes in throughput — without requiring you to define thresholds. When an anomaly is detected, Insights surfaces the likely root cause services and sends a notification via SNS. **CloudWatch ServiceLens** integrates X-Ray traces with CloudWatch metrics and logs, giving you a unified view where you can click from a latency metric spike directly to the X-Ray traces that occurred during that window.`,
      quiz: [
        {
          question:
            "A service map node for the payment service turns red. What does this indicate?",
          options: [
            "The service's latency has exceeded the configured SLA threshold",
            "The service is receiving too many requests and is being throttled",
            "The service has server errors (5xx responses) or faults in recent traces",
            "The service has not emitted any traces in the past 5 minutes",
          ],
          correctIndex: 2,
          explanation:
            "In the X-Ray service map, node colors indicate health: green = healthy, yellow = slow (latency), orange = client errors (4xx), red = server errors (5xx) or faults. A red node on the payment service means it is returning 5xx errors or experiencing faults, which immediately directs the investigation to that service without needing to examine individual traces first.",
        },
        {
          question:
            "A team wants a persistent, named view in the X-Ray console that always shows traces with 5xx errors from the payment service, with a higher sampling rate for payment traffic. Which X-Ray feature provides this?",
          options: [
            "A CloudWatch Dashboard widget displaying X-Ray trace data filtered by service",
            "A custom sampling rule targeting the payment service URL path at 100%",
            "An X-Ray Group with a filter expression for payment 5xx errors; groups can have dedicated sampling rules",
            "A saved CloudWatch Logs Insights query targeting payment service log groups",
          ],
          correctIndex: 2,
          explanation:
            "X-Ray Groups are named, saved filter expressions that appear as separate views in the service map and trace list. A group for payment errors (filtered to 5xx responses from the payment service) gives the team a persistent operational view. Groups can also have their own sampling rules, allowing payment traffic to be sampled at a higher rate than general traffic — ensuring payment issues are well-represented in trace data.",
        },
        {
          question:
            "X-Ray Insights detects an anomaly in error rates. How does it notify the operations team?",
          options: [
            "It creates a CloudWatch alarm that the team must configure in advance",
            "It updates the service map node color to red and requires manual acknowledgment",
            "It automatically sends a notification via Amazon SNS when an anomaly is detected",
            "It writes an entry to CloudTrail that the team can subscribe to via EventBridge",
          ],
          correctIndex: 2,
          explanation:
            "X-Ray Insights automatically detects anomalies (error rate spikes, latency regressions, throughput changes) without requiring pre-defined thresholds. When an anomaly is detected, Insights sends a notification via Amazon SNS. This proactive alerting means the team is notified of emerging problems without needing to watch dashboards continuously or define specific alarm conditions.",
        },
      ],
    },
    {
      heading: "X-Ray with Other Services",
      body: `**X-Ray + Lambda** is the most common integration pattern for serverless architectures. Enable Active Tracing on the function configuration, import the X-Ray SDK, call \`patch_all()\` (Python) or the equivalent for your runtime, and every Lambda invocation creates a trace with automatic subsegments for all AWS SDK calls. Custom subsegments wrap business logic you want to time and annotate.

**X-Ray + API Gateway** traces requests from the moment they hit the API Gateway stage, before they reach Lambda. The API Gateway segment appears as the entry point in the service map, and its latency includes authentication, throttling checks, and request transformation — useful for diagnosing overhead that isn't visible when only tracing Lambda.

**X-Ray + Step Functions** provides end-to-end traces across workflow executions. Step Functions creates segments for each state transition, so a full execution trace shows the time spent in each state, the Lambda invocations that occurred, and any errors or retries — all in one connected view. **X-Ray + SNS/SQS** propagates trace context across asynchronous boundaries: X-Ray adds the Trace ID to SNS message attributes and SQS message attributes, and the downstream Lambda consumer picks up that trace ID to continue the trace — giving you end-to-end visibility across async fan-out patterns.

**X-Ray + CloudWatch ServiceLens** is the unified observability experience: ServiceLens shows CloudWatch metrics alongside X-Ray trace data and CloudWatch Logs in a single view. You can go from a metric alarm firing (high 5xx rate) to the X-Ray service map showing which service is failing, to individual traces showing the specific errors, to the CloudWatch Logs entries for those requests — all without switching tools or correlating data manually.`,
      quiz: [
        {
          question:
            "An API Gateway + Lambda architecture shows high overall request latency in X-Ray. The Lambda segment shows fast execution, but total request latency is high. What does the API Gateway segment reveal that the Lambda segment alone cannot?",
          options: [
            "Network latency between the client and the API Gateway edge location",
            "The number of Lambda cold starts occurring during the measurement window",
            "The Lambda function's memory allocation and whether it is under-provisioned",
            "Overhead from API Gateway authentication, throttling checks, and request transformation that occurs before the Lambda invocation",
          ],
          correctIndex: 3,
          explanation:
            "The API Gateway segment in X-Ray captures the time spent in API Gateway before the request reaches Lambda — including authentication (Cognito or Lambda authorizer), throttling checks, request mapping, and other Gateway-level processing. If Lambda is fast but total latency is high, the API Gateway segment reveals whether the overhead is occurring at the Gateway layer, which is invisible when only tracing Lambda.",
        },
        {
          question:
            "A request enters an SNS topic and is delivered to a Lambda subscriber. How does X-Ray maintain trace continuity across this asynchronous boundary?",
          options: [
            "X-Ray adds the Trace ID to SNS message attributes; the Lambda consumer SDK reads the attribute and continues the same trace",
            "CloudWatch ServiceLens correlates the publisher and subscriber traces by timestamp",
            "The subscriber Lambda must call `xray_recorder.begin_segment()` with the publisher's Trace ID explicitly",
            "X-Ray cannot trace across SNS — separate traces are created for the publisher and subscriber",
          ],
          correctIndex: 0,
          explanation:
            "X-Ray propagates trace context across asynchronous boundaries by embedding the Trace ID in SNS message attributes (and SQS message attributes). When the downstream Lambda consumer processes the message, the X-Ray SDK reads the trace context from the message attributes and continues the same trace — creating a connected end-to-end view across the async boundary without manual correlation.",
        },
        {
          question:
            "What does CloudWatch ServiceLens add to the X-Ray experience?",
          options: [
            "It replaces the X-Ray console with a more feature-rich interface for trace analysis",
            "It adds automatic sampling rule management based on CloudWatch alarm states",
            "It provides a unified view combining CloudWatch metrics, X-Ray traces, and CloudWatch Logs so you can navigate from a metric spike to the specific traces and logs for that window",
            "It enables cross-account trace aggregation for multi-account architectures",
          ],
          correctIndex: 2,
          explanation:
            "CloudWatch ServiceLens is a unified observability experience that combines CloudWatch metrics, X-Ray service map and traces, and CloudWatch Logs in a single view. When a metric alarm fires (e.g., high 5xx rate), you can click through to the X-Ray service map to identify the failing service, then drill into individual traces to see the specific errors, then open the correlated CloudWatch Logs entries — all without switching between separate consoles.",
        },
      ],
    },
  ],

  keyFacts: [
    "Trace = end-to-end request; Segment = one service; Subsegment = one operation within a service",
    "Annotations: indexed key-value → filterable in console. Metadata: not indexed → only visible in detail",
    "Default sampling: 1 req/s reservoir + 5% rate",
    "X-Ray daemon: UDP port 2000, batches segments to X-Ray API. Not needed in Lambda.",
    "Lambda: enable Active Tracing in function config; SDK adds subsegments",
    "ECS: X-Ray daemon as sidecar container; set AWS_XRAY_DAEMON_ADDRESS env var",
    "patch_all() in Python SDK instruments boto3, requests, etc. automatically",
    "Trace ID propagated via X-Amzn-Trace-Id HTTP header across services",
    "X-Ray Insights: automatic anomaly detection with SNS notifications",
    "GetSamplingRules: SDK fetches rules at runtime — update rules without redeploy",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon API Gateway",
    "Amazon ECS",
    "AWS Step Functions",
    "Amazon CloudWatch",
    "Amazon DynamoDB",
    "Amazon SQS",
    "Amazon SNS",
    "AWS Elastic Beanstalk",
  ],

  examTips: [
    "Annotations = indexed → filter traces. Metadata = not indexed → just for detail.",
    "Active Tracing on Lambda = required to enable X-Ray from the console/config.",
    "ECS daemon: sidecar container, app sends UDP to localhost:2000 (or daemon's IP).",
    "patch_all() instruments all supported libraries automatically in Python.",
    "Sampling rules: lower sampling rate for high-traffic to control costs.",
    "X-Ray daemon IAM: needs xray:PutTraceSegments and xray:PutTelemetryRecords.",
    "Trace ID header: X-Amzn-Trace-Id — propagated automatically by SDK across HTTP calls.",
    "Service Map: automatically generated from traces — no config needed.",
    "CloudWatch ServiceLens: unified metrics + traces + logs view using X-Ray data.",
  ],

  topicQuiz: [
    {
      question:
        "A developer adds detailed order processing data (a large nested JSON object) to an X-Ray trace for debugging purposes, but does not need to filter traces by this data. Which data attachment type should they use?",
      options: [
        "Annotations — indexed and searchable, suitable for large JSON data",
        "Metadata — not indexed, can hold arbitrary JSON-serializable data for detail viewing",
        "Tags — key-value pairs attached at the trace group level",
        "Subsegments — named code blocks that can carry arbitrary payload data",
      ],
      correctIndex: 1,
      explanation:
        "Metadata is the correct choice for rich debugging data that does not need to be searchable. It accepts arbitrary JSON-serializable data, appears in trace detail views, but is not indexed and cannot be used in filter expressions. Annotations are indexed key-value pairs limited to strings, numbers, and booleans — appropriate for filterable identifiers like userId or orderId, not large nested objects.",
    },
    {
      question:
        "What must be configured on a Lambda function to enable X-Ray tracing?",
      options: [
        "Deploy the X-Ray daemon as a Lambda layer alongside the function code",
        "Add `xray:PutTraceSegments` to the execution role and the SDK initializes tracing automatically",
        "Set Active Tracing in the Lambda function configuration — the runtime handles daemon communication automatically",
        "Set the `AWS_XRAY_CONTEXT_MISSING` environment variable to `LOG_ERROR`",
      ],
      correctIndex: 2,
      explanation:
        "Enabling X-Ray on Lambda requires setting Active Tracing (`Tracing: Active`) in the function configuration. The Lambda runtime includes built-in daemon functionality and automatically creates a segment for each invocation. No separate daemon process or layer is needed. The execution role does need `xray:PutTraceSegments`, but that permission alone without enabling Active Tracing does not activate tracing.",
    },
    {
      question:
        "The X-Ray SDK sends segment data via UDP to the daemon instead of making direct HTTPS calls to the X-Ray API. What is the primary architectural reason for this design?",
      options: [
        "UDP is fire-and-forget with zero application blocking time, preventing tracing overhead from adding latency to request processing",
        "The X-Ray API has rate limits that UDP helps circumvent by allowing packet loss",
        "Direct HTTPS calls to X-Ray require IAM signing, which the application SDK cannot perform",
        "HTTPS connections to X-Ray require VPC endpoints, which are not available in all environments",
      ],
      correctIndex: 0,
      explanation:
        "The daemon pattern exists to keep tracing overhead invisible to request latency. UDP is fire-and-forget — the SDK sends the segment without waiting for acknowledgment and immediately continues processing. The daemon handles batching, retries, and HTTPS communication asynchronously. If the SDK made synchronous HTTPS calls to X-Ray for every traced operation, the latency of those API calls would directly affect application response times.",
    },
    {
      question:
        "A development team updates a custom sampling rule in the X-Ray console to increase the sampling rate for their checkout service from 5% to 100% during an incident. How quickly does this change take effect?",
      options: [
        "Changes to sampling rules take effect on the next calendar day to prevent configuration thrashing",
        "The change requires a Lambda function redeploy to pick up the new sampling configuration",
        "The change takes effect at the next application restart or container redeployment",
        "The SDK fetches sampling rules via GetSamplingRules at runtime, so the change takes effect within seconds without redeployment",
      ],
      correctIndex: 3,
      explanation:
        "The X-Ray SDK fetches current sampling rules from the `GetSamplingRules` API at runtime and periodically refreshes them. When a rule is updated in the X-Ray console, the SDK picks up the change within seconds on its next refresh cycle — no redeployment is required. This is a key operational advantage for incident response: increase sampling to capture all traces, debug the issue, then reduce sampling again, all without touching code.",
    },
    {
      question:
        "A service map node for a DynamoDB table is colored orange. What does this indicate?",
      options: [
        "DynamoDB is throttling requests from this service (server-side 5xx errors)",
        "DynamoDB latency has exceeded the service's SLA threshold",
        "DynamoDB has not received any requests from this service in the past minute",
        "The service is making client-side errors (4xx) against DynamoDB — likely bad requests or access denied",
      ],
      correctIndex: 3,
      explanation:
        "Orange nodes in the X-Ray service map indicate client errors (4xx responses). For a DynamoDB node, orange suggests the calling service is making requests that DynamoDB is rejecting with 4xx errors — such as `AccessDeniedException` (403), `ResourceNotFoundException` (404), or `ValidationException` (400). Red would indicate server-side errors (5xx) like throttling exceptions. Orange versus red helps distinguish whether the problem is in how the client is making requests (orange) or a server-side issue (red).",
    },
    {
      question:
        "An application publishes messages to SQS and a Lambda function consumes them. A developer wants a single end-to-end X-Ray trace connecting the publisher and consumer. What enables this across the async SQS boundary?",
      options: [
        "The developer must manually pass the Trace ID in the SQS message body and call `xray_recorder.begin_segment()` in the consumer with that ID",
        "Enable X-Ray on the SQS queue using the console; this links publisher and consumer traces automatically",
        "X-Ray automatically adds the Trace ID to SQS message attributes, and the consumer SDK reads it to continue the same trace",
        "SQS does not support trace propagation — separate traces are created for publisher and consumer",
      ],
      correctIndex: 2,
      explanation:
        "X-Ray propagates trace context across SQS (and SNS) boundaries automatically by embedding the Trace ID in message attributes. When the Lambda consumer SDK processes the message, it reads the trace context from the attributes and continues the same trace — creating an end-to-end connected view that spans the async boundary. This works without manual Trace ID passing in the message body.",
    },
    {
      question:
        "Which X-Ray feature automatically detects anomalies like error rate spikes or latency regressions without requiring pre-defined alarm thresholds?",
      options: [
        "X-Ray Groups — named filter expressions that highlight unusual traffic patterns",
        "CloudWatch ServiceLens — correlates metrics and traces to surface anomalies",
        "X-Ray Insights — automatically detects anomalies and sends notifications via SNS",
        "Custom sampling rules — high-rate sampling ensures anomalies appear in trace data",
      ],
      correctIndex: 2,
      explanation:
        "X-Ray Insights automatically analyzes trace data to detect anomalies — error rate spikes, latency regressions, and throughput changes — without requiring pre-defined thresholds. When an anomaly is detected, Insights identifies the likely root cause services and sends a notification via Amazon SNS. This proactive detection complements metric-based alarms, surfacing issues that might not have triggered a CloudWatch alarm threshold.",
    },
    {
      question:
        "A Python application running on EC2 makes boto3 calls to S3 and DynamoDB. The developer enables X-Ray but none of the AWS SDK calls appear as subsegments in the traces. What is the most likely cause?",
      options: [
        "Boto3 subsegments require manual `begin_subsegment()` calls for each AWS API call",
        "Active Tracing must be enabled in the EC2 console to instrument boto3",
        "`patch_all()` was not called — without it, boto3 calls are not instrumented automatically",
        "The X-Ray daemon is not running on the EC2 instance",
      ],
      correctIndex: 2,
      explanation:
        "`patch_all()` is required to automatically instrument boto3, requests, and other supported libraries in the Python X-Ray SDK. Without calling `patch_all()` at application startup, boto3 calls are not wrapped and no subsegments are created for them — even if the X-Ray daemon is running and the top-level segment is being created. The daemon running correctly is necessary but not sufficient for boto3 subsegments to appear.",
    },
  ],
};
