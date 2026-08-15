import { ServiceGuide } from "../../types/guide";

export const stepFunctionsGuide: ServiceGuide = {
  id: "aws-step-functions",
  service: "AWS Step Functions",
  domain: "development",
  tagline: "Visual serverless orchestration for distributed workflows",
  intro:
    "Step Functions lets you coordinate multiple AWS services into serverless workflows (state machines) using a visual designer or JSON/YAML (Amazon States Language). It handles retries, error handling, and state management so your Lambda functions stay simple.",

  sections: [
    {
      heading: "Workflow Types",
      body: `**Standard Workflows**
- Exactly-once execution semantics
- Up to **1-year** duration
- Execution history stored and queryable (audit trail in console/API)
- Priced per **state transition** (~$0.025 per 1,000 transitions)
- Max 2,000 open executions/s per account (quota)
- Use for: long-running workflows, human approval steps, financial transactions, anything needing audit trail

**Express Workflows**
- At-least-once execution (not exactly-once)
- Max **5 minutes** duration
- High throughput: up to **100,000 executions/s**
- Priced per **execution duration** (GB-seconds — like Lambda)
- No built-in execution history in console (use CloudWatch Logs)
- Two modes:
  - *Synchronous*: caller waits for result (StartSyncExecution API)
  - *Asynchronous*: fire-and-forget (StartExecution API)
- Use for: IoT pipelines, streaming data processing, high-volume microservice orchestration`,
    },
    {
      heading: "Amazon States Language (ASL)",
      body: `State machines are defined in **Amazon States Language** — a JSON-based language.

**Top-level structure**:
\`\`\`
{
  "Comment": "Description",
  "StartAt": "FirstStateName",
  "States": {
    "FirstStateName": { ... },
    "SecondStateName": { ... }
  }
}
\`\`\`

**Each state** has:
- \`Type\`: Task, Choice, Wait, Parallel, Map, Pass, Succeed, Fail
- \`Next\`: next state name (or \`End: true\` for terminal)
- \`InputPath\`, \`Parameters\`, \`ResultSelector\`, \`ResultPath\`, \`OutputPath\`: control data flow
- \`Retry\` and \`Catch\`: error handling`,
    },
    {
      heading: "State Types",
      body: `**Task**: calls an AWS service or resource. Supports 200+ AWS service integrations (Lambda, ECS, SQS, SNS, DynamoDB, Bedrock, etc.). Two integration patterns:
- *Request-Response*: Step Functions calls the service and immediately moves to next state (async fire-and-forget)
- *Sync* (.sync:2): Step Functions waits for the service to complete before proceeding (e.g. ECS task completion)
- *Wait for Callback* (.waitForTaskToken): Step Functions pauses until an external system calls SendTaskSuccess/SendTaskFailure with the task token

**Choice**: conditional branching based on input data. Evaluates rules (comparison operators) in order; first match wins. No retry/catch. Must have a Default rule.

**Wait**: pause execution for a duration (\`Seconds\`, \`SecondsPath\`) or until a timestamp (\`Timestamp\`, \`TimestampPath\`). Up to 1 year for Standard.

**Parallel**: execute two or more branches **simultaneously**. All branches must complete before proceeding. If any branch fails (and isn't caught), the whole Parallel state fails.

**Map**: iterate over an **array** in the input, running a sub-state-machine for each element. Configure \`MaxConcurrency\` to limit parallel iterations. Replaces recursive Lambda patterns.

**Pass**: passes input to output with optional transformation. Used for injecting static data or reshaping during development/testing.

**Succeed**: terminates execution successfully. Terminal state.

**Fail**: terminates execution with error and cause. Terminal state.`,
    },
    {
      heading: "Data Flow & I/O Processing",
      body: `Step Functions passes JSON between states. Control the data using:

**InputPath**: JSONPath selecting which part of state input is passed to the task.
**Parameters**: construct a new JSON object (can mix literals and JSONPath references with \`$$\` for context or \`$\` for input).
**ResultSelector**: reshape the task result before combining with state input.
**ResultPath**: where to put the task result in the state input. \`$.result\` appends; \`$\` replaces entire input; \`null\` discards result.
**OutputPath**: which part of the updated state data to pass to the next state.

**Processing order**: InputPath → Parameters → (task runs) → ResultSelector → ResultPath → OutputPath

**Context object**: \`$$\` gives access to execution metadata (execution name, start time, state name, task token).`,
    },
    {
      heading: "Error Handling",
      body: `**Retry**: automatically retry a failed state. Per error type or catch-all (\`States.ALL\`).
\`\`\`
"Retry": [{
  "ErrorEquals": ["Lambda.ServiceException", "Lambda.TooManyRequestsException"],
  "IntervalSeconds": 2,
  "MaxAttempts": 3,
  "BackoffRate": 2,
  "JitterStrategy": "FULL"
}]
\`\`\`
- \`IntervalSeconds\`: wait before first retry
- \`BackoffRate\`: multiplier per retry (2 = exponential backoff)
- \`MaxAttempts\`: max retry count (0 = no retries)
- \`JitterStrategy\`: add randomness to prevent thundering herd

**Catch**: if all retries exhausted (or no retry configured), catch the error and transition to a fallback state. Can match specific error types or \`States.ALL\`.
\`\`\`
"Catch": [{
  "ErrorEquals": ["States.ALL"],
  "Next": "HandleError",
  "ResultPath": "$.errorInfo"
}]
\`\`\`

**Common error types**: \`States.ALL\`, \`States.Timeout\`, \`States.TaskFailed\`, \`States.Permissions\`, \`Lambda.ServiceException\`, \`Lambda.AWSLambdaException\`.`,
    },
    {
      heading: "Service Integrations",
      body: `Step Functions integrates with 200+ AWS services natively — **no Lambda required** for many operations.

**Optimized integrations** (request-response, sync, or callback):
- Lambda (invoke, sync)
- ECS/Fargate (RunTask.sync — wait for task completion)
- DynamoDB (GetItem, PutItem, UpdateItem)
- SQS (SendMessage)
- SNS (Publish)
- S3 (PutObject, GetObject)
- Glue (StartJobRun.sync)
- Athena (StartQueryExecution.sync)
- Bedrock (InvokeModel)
- API Gateway (invoke)
- SageMaker (training, inference)

**SDK integrations**: call any AWS SDK API directly from a Task state using \`arn:aws:states:::aws-sdk:serviceName:apiAction\`.

**Callback pattern** (.waitForTaskToken): pass a task token to an external system (SQS message, Lambda arg, HTTP call). External system processes and calls \`SendTaskSuccess\` or \`SendTaskFailure\` when done. Step Functions resumes from where it paused. Perfect for: human approval workflows, long-running batch jobs, third-party integrations.`,
    },
    {
      heading: "Step Functions with Other Services",
      body: `**Step Functions + Lambda**: most common. Each Lambda does one thing; Step Functions orchestrates the sequence, retries, and branching. Avoids "Lambda calling Lambda" anti-pattern.

**Step Functions + API Gateway**: expose a Step Functions workflow as an HTTP API. API Gateway → StartExecution (async) or StartSyncExecution (sync).

**Step Functions + EventBridge**: EventBridge rule triggers a Step Functions execution on an event. Step Functions publishes events back to EventBridge from tasks.

**Step Functions + ECS**: run containerized tasks in a workflow. ECS RunTask.sync waits for task completion. Useful for batch ML inference, data processing.

**Step Functions + DynamoDB**: read/write workflow state directly without Lambda. Choice state reads DynamoDB; Map state processes items.

**Nested workflows**: Step Functions can start a child state machine (StartExecution or StartExecution.sync) from a Task state. Decompose complex workflows into reusable sub-workflows.`,
    },
  ],

  keyFacts: [
    "Standard: exactly-once, 1-year max, per-state-transition pricing, audit history",
    "Express: at-least-once, 5-min max, high throughput, per-duration pricing",
    "Synchronous Express: caller waits for result (StartSyncExecution)",
    "Map state: iterate over array, configurable MaxConcurrency",
    "Parallel state: all branches run concurrently, all must succeed",
    "Wait for Callback: pauses until SendTaskSuccess/SendTaskFailure called with task token",
    "Retry: BackoffRate multiplies interval per attempt; JitterStrategy adds randomness",
    "SDK integrations: call any AWS API without Lambda using aws-sdk resource ARN",
    "InputPath→Parameters→ResultSelector→ResultPath→OutputPath: data flow order",
    "200+ native service integrations without Lambda",
  ],

  relatedServices: [
    "AWS Lambda",
    "Amazon ECS",
    "Amazon DynamoDB",
    "Amazon SQS",
    "Amazon SNS",
    "Amazon EventBridge",
    "Amazon API Gateway",
    "AWS Glue",
    "Amazon Bedrock",
  ],

  examTips: [
    "Standard vs Express: Standard = exactly-once + audit trail + 1yr. Express = high-throughput + 5min.",
    "Callback pattern (.waitForTaskToken): workflow pauses until external system responds.",
    'Map state replaces "Lambda calling Lambda in a loop" anti-pattern.',
    "Parallel state: any branch failure (uncaught) fails the entire Parallel state.",
    "ResultPath: null discards task result; $.result appends; $ replaces input.",
    "Express workflows are priced like Lambda (duration) not like Standard (transitions).",
    "Retry JitterStrategy: FULL adds randomness to prevent concurrent retries overwhelming downstream.",
    "SDK integrations: arn:aws:states:::aws-sdk:dynamodb:getItem — no Lambda needed.",
  ],
};
