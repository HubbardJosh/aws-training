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
      body: `**Trace**: a collection of segments representing a single end-to-end request across all services it touches. A trace has a unique **Trace ID** propagated via HTTP header (\`X-Amzn-Trace-Id\`).

**Segment**: data block emitted by a single service/resource for one request. Includes timing, HTTP metadata, error info.

**Subsegment**: additional granularity within a segment. Use to trace downstream calls: DynamoDB queries, HTTP calls to third-party APIs, SQL queries.

**Annotations**: key-value pairs indexed by X-Ray for **filtering** traces. Limited to primitive types (string, number, boolean). Use to filter by user ID, order ID, environment, etc.

**Metadata**: arbitrary key-value data attached to segments/subsegments. Not indexed — cannot filter by metadata, but visible in trace details.

**Service Map**: visual graph of services and their connections. Shows request counts, error rates, and latency for each service and edge. Generated automatically from trace data.

**Sampling**: X-Ray does not record every request by default (would be expensive/noisy). Default rule: first request per second + 5% of additional requests. Configure custom sampling rules by service name, URL, method.`,
    },
    {
      heading: "X-Ray SDK & Integration",
      body: `**X-Ray SDK**: available for Node.js, Python, Java, Go, Ruby, .NET. Wrap your application code to:
- Automatically instrument incoming HTTP requests
- Trace outgoing HTTP/HTTPS calls (wrapping \`http\`/\`https\` modules)
- Trace AWS SDK calls (DynamoDB, S3, SQS, etc.)
- Create custom subsegments for business logic

**Lambda integration**: enable Active Tracing in Lambda function configuration (or via SAM/CDK). Lambda automatically creates a segment per invocation. Import the X-Ray SDK to add subsegments.

\`\`\`python
from aws_xray_sdk.core import xray_recorder, patch_all
patch_all()  # patches boto3, requests, etc.

@xray_recorder.capture('process_order')
def process_order(order_id):
    # This block creates a subsegment named 'process_order'
    ...
\`\`\`

**API Gateway integration**: enable X-Ray tracing per stage. API Gateway creates segments and passes the trace ID to the backend (Lambda, HTTP integration).

**ECS/Fargate**: run X-Ray daemon as a sidecar container. SDK in your app container sends UDP segments to the daemon (localhost:2000). Daemon batches and sends to X-Ray service.

**EC2**: install and run X-Ray daemon as a background process. SDK sends to localhost:2000.

**Beanstalk**: X-Ray daemon is pre-installed. Enable via console or .ebextensions config.`,
    },
    {
      heading: "X-Ray Daemon",
      body: `The **X-Ray daemon** is a lightweight process that listens for UDP traffic on port 2000, buffers segments, and forwards them to the X-Ray service. Required for EC2, ECS, and on-premises; Lambda has a built-in equivalent.

**Why a daemon?**: avoids blocking application threads on HTTP calls to X-Ray. The SDK sends UDP (fire-and-forget) to the local daemon, which handles batching and retries.

**Daemon configuration**: set \`AWS_XRAY_DAEMON_ADDRESS\` environment variable if the daemon is not on localhost (e.g. for ECS sidecar on a different host).

**IAM**: the daemon's IAM role/instance profile needs \`xray:PutTraceSegments\` and \`xray:PutTelemetryRecords\`.

**Lambda**: no separate daemon needed. Lambda runtime captures and sends segments automatically.`,
    },
    {
      heading: "Sampling Rules",
      body: `Sampling controls which requests are traced. Too many traces = high cost. Too few = miss issues.

**Default rule**: reservoir = 1 req/s + 5% fixed rate.

**Custom rules**: define rules by service name, host, URL path, HTTP method. Set reservoir (fixed count per second) and rate (percentage beyond reservoir).

**Rule evaluation**: X-Ray evaluates rules in priority order. First matching rule applies. Default rule is last resort.

**Reservoir**: the number of requests per second that are always traced regardless of rate (helps ensure at least some traces per second for low-traffic services).

**Cost implication**: more traces = higher cost. Tune sampling for high-traffic services to avoid paying for 100% of traces.

**GetSamplingRules API**: SDK calls this to get current rules. Rules can be updated in the X-Ray console or via API without redeploying your application.`,
    },
    {
      heading: "Service Map & Analysis",
      body: `The **Service Map** in the X-Ray console shows a visual graph where:
- Circles = services (Lambda, API Gateway, DynamoDB, external)
- Arrows = calls between services
- Color coding: green (OK), yellow (slow), orange (error), red (fault)
- Each node shows request rate, error rate, latency distribution

**Trace filtering**: filter traces by:
- Service name, URL, HTTP method, status code
- Annotations (indexed key-value pairs you set in code)
- Duration (find slow requests: \`duration > 5\`)
- Error, fault, or throttle flags

**Groups**: create named filter expressions to segment traces (e.g. group for admin API calls). Groups appear in the service map and can have separate sampling rules.

**Insights**: X-Ray Insights automatically detects anomalies (spikes in error rate, latency) and surfaces root cause candidates. Sends notifications via SNS.

**CloudWatch integration**: X-Ray trace data surfaces in CloudWatch ServiceLens — combined metrics + traces + logs view.`,
    },
    {
      heading: "X-Ray with Other Services",
      body: `**X-Ray + Lambda**: enable active tracing on function → Lambda creates root segment. SDK adds subsegments for DynamoDB/S3/etc. calls.

**X-Ray + API Gateway**: tracing per stage. API Gateway segment visible on service map as the entry point. Pass-through of trace header to Lambda.

**X-Ray + ECS**: sidecar daemon pattern. App containers send to daemon. Service map shows ECS tasks as nodes.

**X-Ray + Step Functions**: Step Functions creates segments for each state (Task, Choice, Wait). Full end-to-end trace from API Gateway → Step Functions → Lambda → DynamoDB visible on one trace.

**X-Ray + SNS / SQS**: trace propagation across async boundaries. X-Ray adds trace header to SNS/SQS message attributes. Downstream Lambda picks up and continues the trace.

**X-Ray + CloudWatch ServiceLens**: ServiceLens integrates CloudWatch metrics + X-Ray traces + CloudWatch Logs. See latency SLO compliance, error budgets, and click through to traces from a metric alarm.

**X-Ray + Synthetics Canaries**: canary runs create synthetic traces. Use to monitor golden path end-to-end.`,
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
