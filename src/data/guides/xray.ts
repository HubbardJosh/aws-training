import { ServiceGuide } from "../../types/guide";

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
    },
    {
      heading: "X-Ray SDK & Integration",
      body: `The X-Ray SDK is available for Node.js, Python, Java, Go, Ruby, and .NET, and it instruments your application in two complementary ways: automatic instrumentation of infrastructure-level calls (HTTP requests, AWS SDK calls) and manual instrumentation for custom business logic.

In Node.js, wrap the AWS SDK client so all SDK calls are automatically traced as subsegments:

\`\`\`typescript
import AWSXRay from "aws-xray-sdk-core";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// All calls through this client appear as subsegments in X-Ray
const client = AWSXRay.captureAWSv3Client(new DynamoDBClient({}));

export const handler = async (event: unknown) => {
  // Add annotations — indexed, filterable in the X-Ray console
  const segment = AWSXRay.getSegment();
  segment?.addAnnotation("orderId", "ord-123");

  // Add metadata — rich data, not indexed
  segment?.addMetadata("rawEvent", event);

  // Create a named subsegment for a block of business logic
  const sub = segment?.addNewSubsegment("validate-inventory");
  await checkInventory();
  sub?.close();
};
\`\`\`

**Lambda** is the simplest integration path: enable Active Tracing in the Lambda function configuration (or set \`Tracing: Active\` in SAM/CDK), and Lambda automatically creates a segment for each invocation and passes the trace context to the X-Ray SDK. The Lambda runtime handles the daemon communication, so no sidecar is needed.

**API Gateway** tracing is enabled per stage — API Gateway creates segments for each request and passes the Trace ID downstream to the integration target (Lambda or HTTP backend). **ECS and Fargate** run the X-Ray daemon as a sidecar container alongside your application container. The application SDK sends UDP segments to the daemon at \`localhost:2000\` (in \`awsvpc\` mode) or to the daemon container's IP (in \`bridge\` mode). **Elastic Beanstalk** has the daemon pre-installed and enables it via the console or \`.ebextensions\` configuration.`,
    },
    {
      heading: "X-Ray Daemon",
      body: `The **X-Ray daemon** is a lightweight background process that buffers trace segments locally and forwards them to the X-Ray service in batches. It listens for UDP segments on port 2000 and sends them via HTTPS to the X-Ray API. The daemon pattern exists for an important reason: it decouples your application from the latency and retry logic of making synchronous HTTP calls to the X-Ray API. The SDK sends UDP (fire-and-forget, zero blocking time) to the local daemon, and the daemon handles batching, retries, and error handling asynchronously.

For most environments — EC2 instances and ECS tasks — you run the daemon as a background process or sidecar container. If the daemon is not on \`localhost\`, set the \`AWS_XRAY_DAEMON_ADDRESS\` environment variable to point the SDK to the correct address. In ECS with \`bridge\` networking, the daemon sidecar has a container-specific IP, so this environment variable is required for the application container to find it.

The daemon's IAM principal (instance profile for EC2, task role for ECS) needs two permissions: \`xray:PutTraceSegments\` to send segment data and \`xray:PutTelemetryRecords\` to send operational metrics about the daemon itself. **Lambda is the exception**: the Lambda runtime includes built-in daemon functionality, so you don't deploy a separate daemon process and don't need to manage these IAM permissions explicitly — they're included in Lambda's managed execution model.`,
    },
    {
      heading: "Sampling Rules",
      body: `Tracing every single request in a high-traffic application would be expensive and generate more data than is practical to analyze. Sampling controls what fraction of requests are actually traced, balancing cost and observability.

X-Ray's default sampling rule traces the **first request per second** from each host (the reservoir — ensuring at least some traces even for low-traffic services) plus **5% of additional requests** beyond that. For most applications, this provides good coverage at reasonable cost without tracing every request.

**Custom sampling rules** let you override the default for specific traffic patterns. You define rules by service name, host, URL path, and HTTP method, and set a reservoir (fixed count per second, always traced) and a rate (percentage of requests beyond the reservoir). Rules are evaluated in priority order — the first matching rule applies, with the default rule as the last resort. Higher-priority rules for specific endpoints (like a high-value checkout flow) can ensure those requests are traced at 100%, while lower-priority rules reduce sampling for high-volume but less critical endpoints like health checks.

The SDK fetches current sampling rules at runtime via the \`GetSamplingRules\` API, which means you can update sampling configuration in the X-Ray console and it takes effect without redeploying your application. This is a significant operational advantage — you can increase sampling temporarily to debug a production issue and then reduce it again, all without touching your code. Sampling rules also affect cost directly, so tuning them is an important cost optimization for high-traffic services.`,
    },
    {
      heading: "Service Map & Analysis",
      body: `The **Service Map** is X-Ray's primary visual output — an automatically generated graph of all services involved in traced requests. Each node represents a service (Lambda function, API Gateway, DynamoDB table, external HTTP endpoint, or any other instrumented resource), and edges represent calls between services with latency and error rate annotations. Nodes are color-coded: green means healthy, yellow means slow, orange means there are client errors (4xx), and red means there are server errors (5xx) or faults. At a glance, the service map shows you where in your distributed system problems are occurring.

**Trace filtering** lets you narrow down which traces you're examining. You can filter by service name, URL, HTTP method, status code, and duration (e.g. \`duration > 5\` to find slow requests). Most importantly, you can filter by **annotations** — the indexed key-value pairs your application attaches to traces. If you annotate traces with \`userId\`, you can instantly retrieve all traces for a specific user who reported a problem. If you annotate with \`orderId\`, you can trace exactly what happened to a specific order through every service it touched.

**Groups** are saved filter expressions with names, appearing as separate views in the service map. A "PaymentErrors" group filtered to 5xx responses from your payment service gives you a dedicated operational view for payment reliability. Groups can have separate sampling rules — you can sample payment-related requests at a higher rate than general traffic.

**X-Ray Insights** automatically detects anomalies in your trace data — spikes in error rates, latency regressions, or sudden changes in throughput — without requiring you to define thresholds. When an anomaly is detected, Insights surfaces the likely root cause services and sends a notification via SNS. **CloudWatch ServiceLens** integrates X-Ray traces with CloudWatch metrics and logs, giving you a unified view where you can click from a latency metric spike directly to the X-Ray traces that occurred during that window.`,
    },
    {
      heading: "X-Ray with Other Services",
      body: `**X-Ray + Lambda** is the most common integration pattern for serverless architectures. Enable Active Tracing on the function configuration, import the X-Ray SDK, call \`patch_all()\` (Python) or the equivalent for your runtime, and every Lambda invocation creates a trace with automatic subsegments for all AWS SDK calls. Custom subsegments wrap business logic you want to time and annotate.

**X-Ray + API Gateway** traces requests from the moment they hit the API Gateway stage, before they reach Lambda. The API Gateway segment appears as the entry point in the service map, and its latency includes authentication, throttling checks, and request transformation — useful for diagnosing overhead that isn't visible when only tracing Lambda.

**X-Ray + Step Functions** provides end-to-end traces across workflow executions. Step Functions creates segments for each state transition, so a full execution trace shows the time spent in each state, the Lambda invocations that occurred, and any errors or retries — all in one connected view. **X-Ray + SNS/SQS** propagates trace context across asynchronous boundaries: X-Ray adds the Trace ID to SNS message attributes and SQS message attributes, and the downstream Lambda consumer picks up that trace ID to continue the trace — giving you end-to-end visibility across async fan-out patterns.

**X-Ray + CloudWatch ServiceLens** is the unified observability experience: ServiceLens shows CloudWatch metrics alongside X-Ray trace data and CloudWatch Logs in a single view. You can go from a metric alarm firing (high 5xx rate) to the X-Ray service map showing which service is failing, to individual traces showing the specific errors, to the CloudWatch Logs entries for those requests — all without switching tools or correlating data manually.`,
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
};
