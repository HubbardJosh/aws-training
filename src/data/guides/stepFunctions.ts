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
      body: `Step Functions offers two workflow types with fundamentally different execution semantics, and choosing the wrong one can lead to subtle correctness problems or unnecessary cost.

**Standard Workflows** provide exactly-once execution semantics — each state transition happens once and only once, even if the workflow is interrupted and resumed. Standard workflows can run for up to one year, making them appropriate for long-running business processes like order fulfillment, human approval workflows, or multi-day data pipelines. Every state transition is recorded in an execution history that you can query through the API or inspect in the console, providing a complete audit trail. The pricing model is per state transition, at roughly $0.025 per 1,000 transitions.

**Express Workflows** sacrifice exactly-once semantics for dramatically higher throughput and lower cost per execution. They support at-least-once execution (a state might execute more than once if the workflow retries), have a maximum duration of 5 minutes, and can handle up to 100,000 executions per second. The pricing model is per execution duration (GB-seconds, similar to Lambda) rather than per transition. Express workflows don't store execution history in the Step Functions service — you must enable CloudWatch Logs to capture execution records. They come in two invocation modes: **Synchronous Express** (the caller waits for the result via \`StartSyncExecution\`) and **Asynchronous Express** (fire-and-forget via \`StartExecution\`). Use Express for high-volume microservice orchestration, IoT event processing, and any short-lived workflow where the throughput or cost characteristics of Standard would be limiting.`,
    },
    {
      heading: "Amazon States Language (ASL)",
      body: `State machines are defined in **Amazon States Language (ASL)** — a JSON-based declarative language. The top-level structure identifies the starting state and defines all states:

\`\`\`json
{
  "Comment": "Order processing workflow",
  "StartAt": "ProcessPayment",
  "States": {
    "ProcessPayment": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123:function:ProcessPayment",
      "ResultPath": "$.paymentResult",
      "Retry": [{ "ErrorEquals": ["States.ALL"], "MaxAttempts": 2 }],
      "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "PaymentFailed" }],
      "Next": "PaymentSucceeded"
    },
    "PaymentSucceeded": {
      "Type": "Succeed"
    },
    "PaymentFailed": {
      "Type": "Fail",
      "Error": "PaymentError",
      "Cause": "Payment processing failed after retries"
    }
  }
}
\`\`\`

Each state declaration includes its \`Type\` (Task, Choice, Wait, Parallel, Map, Pass, Succeed, or Fail), a \`Next\` field pointing to the next state name, or \`End: true\` to terminate execution. States also declare their data flow configuration — \`InputPath\`, \`Parameters\`, \`ResultSelector\`, \`ResultPath\`, and \`OutputPath\` — which control how JSON data is passed between states and modified along the way. Error handling is declared inline with \`Retry\` and \`Catch\` blocks on Task states. The visual workflow designer in the Step Functions console renders ASL as a flowchart, making complex workflows understandable at a glance, and generates ASL from drag-and-drop construction.`,
    },
    {
      heading: "State Types",
      body: `Step Functions provides eight state types that cover the full range of workflow patterns. Understanding each type's behavior is essential for designing correct workflows.

**Task** is the workhorse state — it calls an AWS service and waits (optionally) for a result. Three integration patterns control the timing: request-response calls the service and immediately moves to the next state without waiting for the operation to complete; sync (\`.sync:2\`) calls the service and pauses until the service reports completion (essential for things like waiting for an ECS task to finish or a Glue job to complete); and wait-for-callback (\`.waitForTaskToken\`) pauses indefinitely until an external system calls \`SendTaskSuccess\` or \`SendTaskFailure\` with a task token that Step Functions provides. The callback pattern is how you implement human approval steps or integrate with systems outside AWS.

**Choice** implements conditional branching based on the input data, evaluating rules in declaration order — the first matching rule determines the next state. Choice states don't have retry or catch blocks. Every Choice state should have a \`Default\` transition to handle the case where no rule matches.

**Wait** pauses execution for a specified duration or until a specific timestamp. Because Standard workflows can run for up to a year, Wait states can pause for days or months — appropriate for scheduled follow-up actions or time-based business processes.

**Parallel** runs two or more branches of states simultaneously, waiting for all of them to complete before continuing. If any branch fails and the error isn't caught within that branch, the entire Parallel state fails. **Map** iterates over an array in the state input, running a sub-workflow for each element with configurable concurrency via \`MaxConcurrency\`. **Pass** passes input to output with optional transformation — useful for injecting static values during development. **Succeed** and **Fail** are terminal states that end execution successfully or with an error.`,
    },
    {
      heading: "Data Flow & I/O Processing",
      body: `Step Functions passes JSON between states, and each Task state can transform the data flowing through it using five processing steps that execute in a specific order.

**InputPath** is a JSONPath expression that selects which part of the incoming state data is passed to the task. If your input has a large JSON object but the task only needs one field, InputPath narrows it before the task sees it. **Parameters** constructs a new JSON object that becomes the task input, letting you mix static literal values with references to input data (JSONPath prefixed with \`$\`) or execution context (JSONPath prefixed with \`$$\`). This is where you reshape the input into whatever format the downstream service expects.

After the task executes, **ResultSelector** reshapes the raw task result — selecting specific fields from what can be a verbose service response. **ResultPath** controls where the (possibly reshaped) result is placed in the state data: \`$.result\` appends it as a new field alongside the original input, \`$\` replaces the entire input with just the result, and \`null\` discards the result entirely and passes the original input unchanged. Finally, **OutputPath** selects which part of the now-updated state data is passed to the next state.

The processing order is always: InputPath → Parameters → (task executes) → ResultSelector → ResultPath → OutputPath. Understanding this sequence is important because several common workflow bugs come from applying transformations in the wrong mental model. The **context object**, accessed via \`$$\`, provides execution metadata within Parameters — the execution name, start time, current state name, and the task token for callback patterns are all available through \`$$.Execution\` and \`$$.Task\`.`,
    },
    {
      heading: "Error Handling",
      body: `Step Functions builds retry and error handling logic directly into the workflow definition, rather than requiring each Lambda function to implement its own retry logic. This keeps Lambda functions simple and makes retry behavior visible in the workflow definition.

**Retry** automatically retries a failed Task state according to rules you specify per error type. **Catch** provides a fallback transition when all retries are exhausted. Both are declared together on the same Task state:

\`\`\`json
{
  "ProcessOrder": {
    "Type": "Task",
    "Resource": "arn:aws:lambda:us-east-1:123:function:ProcessOrder",
    "Retry": [
      {
        "ErrorEquals": ["Lambda.ServiceException", "Lambda.TooManyRequestsException"],
        "IntervalSeconds": 2,
        "MaxAttempts": 3,
        "BackoffRate": 2,
        "JitterStrategy": "FULL"
      }
    ],
    "Catch": [
      {
        "ErrorEquals": ["States.ALL"],
        "Next": "HandleError",
        "ResultPath": "$.errorInfo"
      }
    ],
    "Next": "ShipOrder"
  }
}
\`\`\`

\`IntervalSeconds\` is the wait before the first retry. \`BackoffRate\` multiplies the interval on each subsequent attempt (2 means 2s, 4s, 8s...). \`MaxAttempts\` limits total retries — 0 means no retries. \`JitterStrategy: FULL\` adds randomness to prevent thundering herd when many parallel executions retry at the same time. By putting error details at \`$.errorInfo\` in the Catch block, the HandleError state receives both the original input and the error information.

Common error types: \`States.ALL\` (catches everything), \`States.Timeout\` (task exceeded timeout), \`States.TaskFailed\` (task returned a failure), and \`States.Permissions\` (insufficient IAM permissions to call the target service).`,
    },
    {
      heading: "Service Integrations",
      body: `One of Step Functions' most powerful characteristics is its ability to call over 200 AWS services directly from Task states, without requiring Lambda as an intermediary. This keeps workflows leaner and reduces both cost and complexity.

**Optimized integrations** cover the most commonly orchestrated services with native support for request-response, sync, and callback patterns. You can invoke Lambda functions, run ECS tasks and wait for completion (\`.sync:2\`), query DynamoDB directly, send SQS messages, publish to SNS, put S3 objects, start Glue jobs, run Athena queries, invoke Bedrock models, and call API Gateway — all from Task states in your workflow definition. For ML workflows, Step Functions integrates with SageMaker for training and inference jobs.

**SDK integrations** extend this to literally any AWS API. Using the ARN pattern \`arn:aws:states:::aws-sdk:serviceName:apiAction\`, a Task state can call any AWS SDK method — \`dynamodb:getItem\`, \`s3:listObjects\`, \`ssm:getParameter\`, anything. This means you almost never need to write a Lambda function just to make an AWS API call.

The **callback pattern** (\`.waitForTaskToken\`) is the mechanism for integrating with anything outside the immediate AWS API surface. When a Task state uses this pattern, Step Functions generates a unique task token and passes it to the target (in an SQS message body, as a Lambda argument, or in an API call). The workflow pauses completely. The external system — a human reviewing an approval request, a long-running batch job, a third-party API — processes its work and then calls \`SendTaskSuccess\` or \`SendTaskFailure\` with the token to resume the workflow. This is how Step Functions integrates with human-in-the-loop workflows and systems with minutes-to-hours processing times.`,
    },
    {
      heading: "Step Functions with Other Services",
      body: `**Step Functions + Lambda** is the most common integration pattern. The key principle is that each Lambda function should do one specific thing, and Step Functions handles the sequencing, conditional logic, retries, and error handling. This avoids the "Lambda calling Lambda" anti-pattern — chained Lambda invocations with no retry or error recovery — and keeps functions small and independently testable.

**Step Functions + API Gateway** exposes a workflow as an HTTP API. API Gateway can start a Standard workflow asynchronously (returning the execution ARN) or start a Synchronous Express workflow and wait for the result (up to 29 seconds, matching API Gateway's timeout). This pattern is useful for API endpoints that orchestrate multiple backend services before returning a response.

**Step Functions + EventBridge** creates a bridge between reactive and procedural patterns. EventBridge rules can start Step Functions executions in response to events — a user signup event triggers an onboarding workflow, or a failed payment event starts a dunning process. Step Functions can also publish events back to EventBridge from Task states, making workflow milestones visible to other parts of the system.

**Step Functions + ECS** handles containerized batch processing through the ECS RunTask \`.sync:2\` integration. Step Functions starts an ECS task and waits for it to complete before moving to the next state — appropriate for ML inference jobs, video transcoding, or data transformation pipelines that need containers for runtime dependencies. **Nested workflows** let Step Functions start a child state machine from a Task state, either asynchronously or waiting for completion. Complex workflows can be decomposed into reusable sub-workflows that can be tested and versioned independently.`,
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
