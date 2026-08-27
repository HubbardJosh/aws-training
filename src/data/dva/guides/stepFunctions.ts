import { ServiceGuide } from "../../../types/guide";

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
      quiz: [
        {
          question:
            "A financial application requires that each step in an order fulfillment workflow executes exactly once, with a complete audit trail of every state transition. The workflow can run for up to 90 days. Which Step Functions workflow type should you use?",
          options: [
            "Synchronous Express Workflow, because it waits for the result",
            "Standard Workflow, because it provides exactly-once semantics and up to 1-year execution duration",
            "Asynchronous Express Workflow, because it supports long-running processes",
            "Standard Workflow is not appropriate; you should use Lambda directly for audit requirements",
          ],
          correctIndex: 1,
          explanation:
            "Standard Workflows provide exactly-once execution semantics and retain a full execution history (audit trail), making them the correct choice for compliance-sensitive processes. They support durations up to one year, so 90 days is well within range. Express Workflows use at-least-once semantics and have a 5-minute maximum duration.",
        },
        {
          question:
            "An IoT platform needs to process up to 50,000 short-lived device events per second, each completing within 30 seconds. Cost efficiency is critical. Which Step Functions configuration is the best fit?",
          options: [
            "Standard Workflows, because they provide the most reliable execution guarantees",
            "Standard Workflows with CloudWatch Logs enabled for event tracking",
            "Express Workflows (Asynchronous), because they support high throughput and are priced per duration",
            "Express Workflows (Synchronous), but only if each event handler Lambda returns a result",
          ],
          correctIndex: 2,
          explanation:
            "Express Workflows support up to 100,000 executions per second and are priced per GB-second of duration (like Lambda), making them far more cost-effective than Standard Workflows (priced per state transition) for high-volume, short-lived workloads. Asynchronous invocation is appropriate since the IoT platform fires events without waiting for a response.",
        },
        {
          question:
            "A team switches from Standard to Express Workflows to reduce cost. They notice that execution history is no longer available in the Step Functions console. What must they do to retain execution records?",
          options: [
            "Enable X-Ray Active Tracing on the state machine",
            "Set the execution retention period to 90 days in the state machine settings",
            "Enable CloudWatch Logs on the Express Workflow, as Express Workflows do not store history in the service",
            "Create an EventBridge rule to capture state machine events and write them to DynamoDB",
          ],
          correctIndex: 2,
          explanation:
            "Express Workflows do not store execution history in the Step Functions service — this is a deliberate design trade-off for throughput. To retain execution records you must enable CloudWatch Logs on the workflow. X-Ray provides tracing data but not the full execution history that Standard Workflows store natively.",
        },
      ],
    },
    {
      heading: "Amazon States Language (ASL)",
      body: `State machines are defined in **Amazon States Language (ASL)** — a JSON-based declarative language. The top-level structure identifies the starting state and defines all states:
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

Each state declaration includes its \`Type\` (Task, Choice, Wait, Parallel, Map, Pass, Succeed, or Fail), a \`Next\` field pointing to the next state name, or \`End: true\` to terminate execution. States also declare their data flow configuration — \`InputPath\`, \`Parameters\`, \`ResultSelector\`, \`ResultPath\`, and \`OutputPath\` — which control how JSON data is passed between states and modified along the way. Error handling is declared inline with \`Retry\` and \`Catch\` blocks on Task states. The visual workflow designer in the Step Functions console renders ASL as a flowchart, making complex workflows understandable at a glance, and generates ASL from drag-and-drop construction.`,
      quiz: [
        {
          question:
            'In Amazon States Language (ASL), what does setting `"End": true` on a state accomplish?',
          options: [
            "It marks the state as the starting point of the state machine",
            "It terminates the current branch in a Parallel state but allows other branches to continue",
            "It ends the execution of the state machine successfully from that state",
            "It is equivalent to adding a Fail state — the execution is marked as failed",
          ],
          correctIndex: 2,
          explanation:
            'In ASL, `"End": true` on a state signals that execution terminates successfully at that state — it is equivalent to a Succeed terminal state when used on a non-terminal state type. The alternative is to specify a `"Next"` field pointing to the next state name. `"End": true` does not indicate failure; the Fail state type is used for that purpose.',
        },
        {
          question:
            "Which ASL state types use `Retry` and `Catch` blocks for error handling?",
          options: [
            "All state types, including Choice, Wait, and Pass",
            "Only Task states, because they call external services that can fail",
            "Task and Parallel states only",
            "Task, Parallel, and Map states",
          ],
          correctIndex: 3,
          explanation:
            "Retry and Catch blocks are supported on Task, Parallel, and Map states — the three state types that can fail due to external calls or sub-workflow errors. Choice, Wait, Pass, Succeed, and Fail states do not support Retry or Catch because they don't make external calls that might fail transiently.",
        },
        {
          question:
            "A developer wants to render the visual flowchart of an existing ASL state machine definition in the AWS console. Where is this visualization generated from?",
          options: [
            "A separate CloudFormation template that describes the workflow topology",
            "X-Ray trace data collected during past executions",
            "The ASL JSON definition itself — the console renders it automatically as a flowchart",
            "An exported Workflow Studio file that must be uploaded separately",
          ],
          correctIndex: 2,
          explanation:
            "The Step Functions console automatically renders any valid ASL JSON definition as a visual flowchart — no separate file or historical execution data is required. The visual designer (Workflow Studio) can also generate ASL from drag-and-drop construction, making the two representations bi-directional.",
        },
      ],
    },
    {
      heading: "State Types",
      body: `Step Functions provides eight state types that cover the full range of workflow patterns. Understanding each type's behavior is essential for designing correct workflows.

**Task** is the workhorse state — it calls an AWS service and waits (optionally) for a result. Three integration patterns control the timing: request-response calls the service and immediately moves to the next state without waiting for the operation to complete; sync (\`.sync:2\`) calls the service and pauses until the service reports completion (essential for things like waiting for an ECS task to finish or a Glue job to complete); and wait-for-callback (\`.waitForTaskToken\`) pauses indefinitely until an external system calls \`SendTaskSuccess\` or \`SendTaskFailure\` with a task token that Step Functions provides. The callback pattern is how you implement human approval steps or integrate with systems outside AWS.

**Choice** implements conditional branching based on the input data, evaluating rules in declaration order — the first matching rule determines the next state. Choice states don't have retry or catch blocks. Every Choice state should have a \`Default\` transition to handle the case where no rule matches.

**Wait** pauses execution for a specified duration or until a specific timestamp. Because Standard workflows can run for up to a year, Wait states can pause for days or months — appropriate for scheduled follow-up actions or time-based business processes.

**Parallel** runs two or more branches of states simultaneously, waiting for all of them to complete before continuing. If any branch fails and the error isn't caught within that branch, the entire Parallel state fails. **Map** iterates over an array in the state input, running a sub-workflow for each element with configurable concurrency via \`MaxConcurrency\`. **Pass** passes input to output with optional transformation — useful for injecting static values during development. **Succeed** and **Fail** are terminal states that end execution successfully or with an error.`,
      quiz: [
        {
          question:
            "A workflow needs to wait for a human manager to approve an expense report before continuing. The approval may take hours or days. Which Task state integration pattern is designed for this use case?",
          options: [
            "Request-response, because it moves to the next state immediately after sending the notification",
            ".sync:2, because it polls the approval service until a response is received",
            ".waitForTaskToken, because the workflow pauses indefinitely until the external system calls SendTaskSuccess or SendTaskFailure",
            "Map state with MaxConcurrency 1, iterating over pending approvals",
          ],
          correctIndex: 2,
          explanation:
            "The `.waitForTaskToken` integration pattern is specifically designed for human-in-the-loop and external system integrations. Step Functions generates a unique task token, pauses the workflow indefinitely, and resumes only when `SendTaskSuccess` or `SendTaskFailure` is called with that token. This can wait for hours or days without consuming resources.",
        },
        {
          question:
            "A Step Functions workflow uses a Parallel state with three branches. Branch 2 encounters an unhandled error. What happens to the overall Parallel state?",
          options: [
            "The Parallel state skips Branch 2 and waits for Branches 1 and 3 to complete",
            "The Parallel state completes successfully using only the results from Branches 1 and 3",
            "The entire Parallel state fails, and any Catch blocks on the Parallel state are evaluated",
            "The workflow pauses and waits for manual intervention before deciding whether to retry Branch 2",
          ],
          correctIndex: 2,
          explanation:
            "If any branch in a Parallel state fails with an uncaught error, the entire Parallel state fails immediately. Step Functions then evaluates any Catch blocks on the Parallel state itself. This behavior enforces an all-or-nothing contract — if any parallel path fails, the combined result is unavailable and the failure must be handled at the Parallel state level.",
        },
        {
          question:
            "A developer needs to process each item in a list of 500 S3 objects, running the same sub-workflow for each. Which state type is the correct choice, and what field controls concurrency?",
          options: [
            "Parallel state; add 500 branches manually in the ASL definition",
            "Map state; set MaxConcurrency to control how many items are processed simultaneously",
            "Task state with a Lambda function that loops internally over the list",
            "Choice state with 500 rules, one per item",
          ],
          correctIndex: 1,
          explanation:
            "The Map state is designed exactly for this pattern — it iterates over an array in the state input and runs a defined sub-workflow for each element. `MaxConcurrency` controls how many items are processed in parallel (0 means unlimited concurrency). This replaces the anti-pattern of a Lambda function looping over items internally, which loses Step Functions' retry and error handling benefits.",
        },
      ],
    },
    {
      heading: "Data Flow & I/O Processing",
      body: `Step Functions passes JSON between states, and each Task state can transform the data flowing through it using five processing steps that execute in a specific order.

**InputPath** is a JSONPath expression that selects which part of the incoming state data is passed to the task. If your input has a large JSON object but the task only needs one field, InputPath narrows it before the task sees it. **Parameters** constructs a new JSON object that becomes the task input, letting you mix static literal values with references to input data (JSONPath prefixed with \`$\`) or execution context (JSONPath prefixed with \`$$\`). This is where you reshape the input into whatever format the downstream service expects.

After the task executes, **ResultSelector** reshapes the raw task result — selecting specific fields from what can be a verbose service response. **ResultPath** controls where the (possibly reshaped) result is placed in the state data: \`$.result\` appends it as a new field alongside the original input, \`$\` replaces the entire input with just the result, and \`null\` discards the result entirely and passes the original input unchanged. Finally, **OutputPath** selects which part of the now-updated state data is passed to the next state.

The processing order is always: InputPath → Parameters → (task executes) → ResultSelector → ResultPath → OutputPath. Understanding this sequence is important because several common workflow bugs come from applying transformations in the wrong mental model. The **context object**, accessed via \`$$\`, provides execution metadata within Parameters — the execution name, start time, current state name, and the task token for callback patterns are all available through \`$$.Execution\` and \`$$.Task\`.`,
      quiz: [
        {
          question:
            "What is the correct order of data flow processing steps for a Task state in Step Functions?",
          options: [
            "Parameters → InputPath → task executes → ResultPath → ResultSelector → OutputPath",
            "InputPath → Parameters → task executes → ResultSelector → ResultPath → OutputPath",
            "InputPath → ResultSelector → task executes → Parameters → ResultPath → OutputPath",
            "Parameters → task executes → InputPath → ResultSelector → OutputPath → ResultPath",
          ],
          correctIndex: 1,
          explanation:
            "The processing order is always InputPath → Parameters → (task executes) → ResultSelector → ResultPath → OutputPath. InputPath and Parameters shape the data before it reaches the task; ResultSelector and ResultPath place the result back into the state data; OutputPath selects what is forwarded to the next state.",
        },
        {
          question:
            "A Task state calls a Lambda function and receives a verbose response object. The developer wants to discard the Lambda result entirely and pass the original state input unchanged to the next state. Which ResultPath value achieves this?",
          options: [
            '`"ResultPath": "$"`',
            '`"ResultPath": "$.lambdaResult"`',
            '`"ResultPath": null`',
            "Omitting ResultPath entirely, which defaults to discarding the result",
          ],
          correctIndex: 2,
          explanation:
            '`"ResultPath": null` tells Step Functions to discard the task result and pass the original state input unchanged to the next state. `"ResultPath": "$"` replaces the entire input with the result; `"ResultPath": "$.lambdaResult"` appends the result as a new field. Omitting ResultPath defaults to replacing the entire input with the task output.',
        },
        {
          question:
            "Inside a Parameters block, a developer wants to include the current Step Functions execution name in the task input. Which JSONPath prefix is used to access the execution context object?",
          options: [
            "`$` — all JSONPath references use a single dollar sign",
            "`$$` — the double dollar sign prefix accesses the context object",
            "`@` — the at-sign is the ASL convention for context references",
            "`#` — the hash prefix accesses execution metadata",
          ],
          correctIndex: 1,
          explanation:
            "In ASL Parameters blocks, `$$` is the prefix for accessing the context object, which contains execution metadata like `$$.Execution.Name`, `$$.Execution.StartTime`, and `$$.Task.Token`. A single `$` prefix references the current state input data. This distinction is important when embedding execution metadata in task inputs.",
        },
      ],
    },
    {
      heading: "Error Handling",
      body: `Step Functions builds retry and error handling logic directly into the workflow definition, rather than requiring each Lambda function to implement its own retry logic. This keeps Lambda functions simple and makes retry behavior visible in the workflow definition.

**Retry** automatically retries a failed Task state according to rules you specify per error type. A typical retry configuration looks like:
\`\`\`
"Retry": [{
  "ErrorEquals": ["Lambda.ServiceException", "Lambda.TooManyRequestsException"],
  "IntervalSeconds": 2,
  "MaxAttempts": 3,
  "BackoffRate": 2,
  "JitterStrategy": "FULL"
}]
\`\`\`
\`IntervalSeconds\` is the wait before the first retry. \`BackoffRate\` multiplies the interval on each subsequent attempt (2 means 2s, 4s, 8s, ...). \`MaxAttempts\` limits total retries — 0 means no retries. \`JitterStrategy: FULL\` adds randomness to the calculated delay to prevent multiple parallel executions from retrying in lockstep, which would create thundering herd pressure on a downstream service.

**Catch** provides a fallback transition when all retries are exhausted or when no retry is configured for the error. A catch block routes execution to a fallback state, optionally preserving the error details in a specified path:
\`\`\`
"Catch": [{
  "ErrorEquals": ["States.ALL"],
  "Next": "HandleError",
  "ResultPath": "$.errorInfo"
}]
\`\`\`
By putting the error information at \`$.errorInfo\`, the HandleError state has access to both the original input and the error details. Common error types you'll see on the exam include \`States.ALL\` (catches everything), \`States.Timeout\` (task exceeded its configured timeout), \`States.TaskFailed\` (task returned a failure), and \`States.Permissions\` (insufficient IAM permissions to call the target service).`,
      quiz: [
        {
          question:
            "A Step Functions workflow has a Retry block with `IntervalSeconds: 2`, `BackoffRate: 2`, and `MaxAttempts: 3`. How long does Step Functions wait before the second retry (third attempt)?",
          options: [
            "2 seconds — the interval is fixed",
            "4 seconds — BackoffRate doubles the interval after the first retry",
            "6 seconds — BackoffRate adds 2 seconds per attempt",
            "8 seconds — BackoffRate doubles the interval twice for the second retry",
          ],
          correctIndex: 3,
          explanation:
            "With BackoffRate: 2 and IntervalSeconds: 2, the waits are: first retry after 2s, second retry after 2×2=4s, third retry after 4×2=8s. The BackoffRate multiplies the previous interval on each subsequent attempt, producing exponential backoff. So the second retry (third total attempt) waits 8 seconds.",
        },
        {
          question:
            "Why does `JitterStrategy: FULL` help when many parallel Step Functions executions are retrying the same downstream service simultaneously?",
          options: [
            "It reduces the total number of retries across all executions by coordinating retry schedules",
            "It adds randomness to each execution's retry delay, spreading retries over time and preventing a synchronized surge (thundering herd) on the downstream service",
            "It prioritizes retries for executions that have been waiting longest, implementing fair queuing",
            "It limits total concurrent retries to one per second regardless of the number of executions",
          ],
          correctIndex: 1,
          explanation:
            "Without jitter, many parallel executions hitting the same error will all retry at the same calculated interval, creating a synchronized wave of requests that can overwhelm the downstream service. `JitterStrategy: FULL` randomizes the delay within the calculated window, spreading retries over time and preventing the thundering herd problem.",
        },
        {
          question:
            'A Task state\'s Catch block uses `"ResultPath": "$.errorInfo"`. What does this achieve when the Catch handler fires?',
          options: [
            "The error details replace the entire state input, so the HandleError state only sees error data",
            "The error details are discarded; only the original input is forwarded to the HandleError state",
            "The error details are appended to the original state input at the `$.errorInfo` key, so the HandleError state has access to both",
            "The error details are written to CloudWatch Logs but not included in the state input",
          ],
          correctIndex: 2,
          explanation:
            'Using `"ResultPath": "$.errorInfo"` in a Catch block merges the error details into the existing state input under the `$.errorInfo` key. The HandleError state receives the original input plus the error information — useful for logging the error context alongside the business data that was being processed when the failure occurred.',
        },
      ],
    },
    {
      heading: "Service Integrations",
      body: `One of Step Functions' most powerful characteristics is its ability to call over 200 AWS services directly from Task states, without requiring Lambda as an intermediary. This keeps workflows leaner and reduces both cost and complexity.

**Optimized integrations** cover the most commonly orchestrated services with native support for request-response, sync, and callback patterns. You can invoke Lambda functions, run ECS tasks and wait for completion (\`.sync:2\`), query DynamoDB directly, send SQS messages, publish to SNS, put S3 objects, start Glue jobs, run Athena queries, invoke Bedrock models, and call API Gateway — all from Task states in your workflow definition. For ML workflows, Step Functions integrates with SageMaker for training and inference jobs.

**SDK integrations** extend this to literally any AWS API. Using the ARN pattern \`arn:aws:states:::aws-sdk:serviceName:apiAction\`, a Task state can call any AWS SDK method — \`dynamodb:getItem\`, \`s3:listObjects\`, \`ssm:getParameter\`, anything. This means you almost never need to write a Lambda function just to make an AWS API call.

The **callback pattern** (\`.waitForTaskToken\`) is the mechanism for integrating with anything outside the immediate AWS API surface. When a Task state uses this pattern, Step Functions generates a unique task token and passes it to the target (in an SQS message body, as a Lambda argument, or in an API call). The workflow pauses completely. The external system — a human reviewing an approval request, a long-running batch job, a third-party API — processes its work and then calls \`SendTaskSuccess\` or \`SendTaskFailure\` with the token to resume the workflow. This is how Step Functions integrates with human-in-the-loop workflows and systems with minutes-to-hours processing times.`,
      quiz: [
        {
          question:
            "A Step Functions workflow needs to fetch a parameter from SSM Parameter Store without using a Lambda function. Which Task state resource ARN format enables this?",
          options: [
            "`arn:aws:lambda:::function:ssm-getter` — a pre-built Lambda for SSM access",
            "`arn:aws:states:::aws-sdk:ssm:getParameter` — the SDK integration ARN format",
            "`arn:aws:ssm:::parameter/myapp/config` — the parameter ARN directly",
            "SSM can only be accessed from Task states via an intermediary Lambda function",
          ],
          correctIndex: 1,
          explanation:
            "SDK integrations use the ARN pattern `arn:aws:states:::aws-sdk:serviceName:apiAction`. For SSM GetParameter, the resource ARN is `arn:aws:states:::aws-sdk:ssm:getParameter`. This allows Task states to call any AWS SDK method directly without a Lambda intermediary, reducing cost and complexity.",
        },
        {
          question:
            "A workflow starts an ECS Fargate task to process a video file, which takes 10–30 minutes. The next workflow state should only run after the ECS task completes. Which Task state integration pattern achieves this?",
          options: [
            "Request-response — Step Functions sends the RunTask call and immediately moves on",
            ".sync:2 — Step Functions starts the ECS task and polls until it reports completion",
            ".waitForTaskToken — the ECS task must call SendTaskSuccess when it finishes",
            "Parallel state with ECS in one branch and a Wait state in another",
          ],
          correctIndex: 1,
          explanation:
            "The `.sync:2` integration pattern starts an ECS task and pauses the workflow until ECS reports the task has completed (succeeded or failed). This is the correct pattern when a downstream service has a long-running job and Step Functions should wait for its completion before advancing. `.waitForTaskToken` requires the ECS task itself to call back with the token, which is more complex to implement.",
        },
        {
          question:
            "What is the primary advantage of Step Functions' 200+ direct service integrations over the alternative of writing Lambda functions to make AWS API calls?",
          options: [
            "Direct integrations bypass IAM permissions, reducing security configuration overhead",
            "Direct integrations eliminate the Lambda function cost and cold start latency for simple API calls, keeping workflows leaner",
            "Direct integrations automatically retry on all error types, while Lambda-based calls must implement their own retry logic",
            "Direct integrations are faster because they run inside the Step Functions service rather than in a separate compute environment",
          ],
          correctIndex: 1,
          explanation:
            "The main benefit of direct service integrations is eliminating the overhead of a Lambda function — no function cost, no cold start latency, no code to write and maintain — for operations that are simply AWS API calls. Retry logic is still configured in the Task state's Retry block regardless of whether the integration is direct or Lambda-based. IAM permissions are still required for direct integrations.",
        },
      ],
    },
    {
      heading: "Step Functions with Other Services",
      body: `**Step Functions + Lambda** is the most common integration pattern. The key principle is that each Lambda function should do one specific thing, and Step Functions handles the sequencing, conditional logic, retries, and error handling. This avoids the "Lambda calling Lambda" anti-pattern — chained Lambda invocations with no retry or error recovery — and keeps functions small and independently testable.

**Step Functions + API Gateway** exposes a workflow as an HTTP API. API Gateway can start a Standard workflow asynchronously (returning the execution ARN) or start a Synchronous Express workflow and wait for the result (up to 29 seconds, matching API Gateway's timeout). This pattern is useful for API endpoints that orchestrate multiple backend services before returning a response.

**Step Functions + EventBridge** creates a bridge between reactive and procedural patterns. EventBridge rules can start Step Functions executions in response to events — a user signup event triggers an onboarding workflow, or a failed payment event starts a dunning process. Step Functions can also publish events back to EventBridge from Task states, making workflow milestones visible to other parts of the system.

**Step Functions + ECS** handles containerized batch processing through the ECS RunTask \`.sync:2\` integration. Step Functions starts an ECS task and waits for it to complete before moving to the next state — appropriate for ML inference jobs, video transcoding, or data transformation pipelines that need containers for runtime dependencies. **Nested workflows** let Step Functions start a child state machine from a Task state, either asynchronously or waiting for completion. Complex workflows can be decomposed into reusable sub-workflows that can be tested and versioned independently.`,
      quiz: [
        {
          question:
            "An API Gateway endpoint must orchestrate three backend services and return the combined result to the caller within 25 seconds. Which Step Functions integration achieves this?",
          options: [
            "API Gateway starts a Standard Workflow asynchronously and returns the execution ARN; the client polls for completion",
            "API Gateway starts a Synchronous Express Workflow and waits for the result, up to the 29-second API Gateway timeout",
            "API Gateway cannot integrate with Step Functions — use a single Lambda function that calls all three services",
            "API Gateway starts an Asynchronous Express Workflow and pushes the result to an SQS queue for the client to consume",
          ],
          correctIndex: 1,
          explanation:
            "API Gateway can start a Synchronous Express Workflow (`StartSyncExecution`) and block until the workflow completes, returning the result directly to the API caller. The maximum wait is bounded by API Gateway's 29-second integration timeout. This is the correct pattern for synchronous API responses that require multi-service orchestration.",
        },
        {
          question:
            "A team currently has Lambda function A calling Lambda function B, which calls Lambda function C, with no retry logic at any level. What is the Step Functions-recommended replacement for this pattern?",
          options: [
            "Combine all three functions into one larger Lambda function to eliminate the call chain",
            "Use a Standard Workflow where each Lambda function is a Task state, with Step Functions handling sequencing and retries",
            "Add SQS queues between each Lambda function for decoupling and retry behavior",
            "Use EventBridge to trigger each Lambda function in sequence based on the previous function's output",
          ],
          correctIndex: 1,
          explanation:
            "The 'Lambda calling Lambda' anti-pattern lacks retry logic, error handling, and observability. The Step Functions replacement is a Standard Workflow where each Lambda function becomes a Task state. Step Functions handles the sequencing, retry configuration, Catch blocks, and execution history — keeping each Lambda function simple and the orchestration logic visible in the workflow definition.",
        },
        {
          question:
            "An EventBridge rule detects a failed payment event and needs to trigger a dunning (retry billing) workflow. Which integration pattern supports this?",
          options: [
            "EventBridge cannot start Step Functions executions — use a Lambda function to call StartExecution",
            "EventBridge rules can target Step Functions state machines directly, starting a new execution for each matching event",
            "The Step Functions workflow must poll EventBridge for new events using a Wait state",
            "EventBridge can only trigger Lambda functions; Lambda must then start the Step Functions execution",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge rules support Step Functions state machines as direct targets — a matching event starts a new Step Functions execution without requiring an intermediary Lambda function. This bridges the reactive (event-driven) and procedural (workflow) patterns, allowing events to trigger multi-step orchestrated processes automatically.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A Standard Workflow state machine is interrupted mid-execution and then resumed. Which behavior distinguishes Standard from Express Workflows in this scenario?",
      options: [
        "Standard Workflows restart from the beginning; Express Workflows resume from the last checkpoint",
        "Standard Workflows provide exactly-once execution semantics — each state transition occurs only once even after interruption",
        "Standard Workflows fail permanently on interruption; Express Workflows retry automatically",
        "Both workflow types behave identically after interruption — the difference is only in pricing",
      ],
      correctIndex: 1,
      explanation:
        "Standard Workflows guarantee exactly-once execution semantics: each state transition happens once and only once, even if the workflow is interrupted and later resumed. Express Workflows provide at-least-once semantics — a state may execute more than once. This makes Standard Workflows appropriate for payment processing or order fulfillment where duplicate execution would cause correctness problems.",
    },
    {
      question:
        "A developer defines a Choice state but does not include a Default transition. What happens when no rule in the Choice state matches the input?",
      options: [
        "The workflow transitions to the first state defined in the States object",
        "The workflow ends successfully using an implicit Succeed state",
        "The execution fails with a States.NoChoiceMatched error",
        "Step Functions retries the Choice state evaluation up to three times",
      ],
      correctIndex: 2,
      explanation:
        "When no rule in a Choice state matches and no Default transition is defined, the execution fails with a `States.NoChoiceMatched` error. Best practice is to always include a Default transition in every Choice state to handle unexpected input values gracefully.",
    },
    {
      question:
        "Which Step Functions feature allows you to run the same sub-workflow over each item in an array with controlled parallelism?",
      options: [
        "Parallel state with one branch per array element",
        "Map state with the MaxConcurrency field set to the desired concurrency level",
        "Task state with a Lambda function that internally loops over the array",
        "Choice state with a rule for each array index",
      ],
      correctIndex: 1,
      explanation:
        "The Map state iterates over an array and executes a sub-workflow for each element. `MaxConcurrency` controls how many elements are processed simultaneously (0 means unlimited concurrency). This is the correct replacement for Lambda functions that loop internally over arrays, as it preserves Step Functions' retry and error handling for each individual element.",
    },
    {
      question:
        "A Task state calls DynamoDB GetItem and returns a large response object. The developer wants only the `Item` field from the response to be passed forward. Which processing step is used to reshape the raw task result before it is placed back into the state data?",
      options: [
        "InputPath — narrows the input before the task executes",
        "Parameters — constructs the task input from the state data",
        "ResultSelector — reshapes the raw task result after execution",
        "OutputPath — selects which part of the final state data is forwarded",
      ],
      correctIndex: 2,
      explanation:
        "ResultSelector is applied immediately after the task executes and before ResultPath. It reshapes the raw service response — in this case selecting only the `Item` field from DynamoDB's verbose GetItem response. This is distinct from OutputPath, which selects from the full state data after ResultPath has merged the result.",
    },
    {
      question:
        "A workflow's Retry block has `MaxAttempts: 0`. What does this mean?",
      options: [
        "The task will retry indefinitely until it succeeds",
        "The task will retry up to the service default (3 times)",
        "No retries will occur — the first failure immediately triggers Catch evaluation",
        "The retry block is disabled and has no effect on the task",
      ],
      correctIndex: 2,
      explanation:
        "`MaxAttempts: 0` means zero retries — on the first failure, Step Functions immediately moves to evaluate any Catch blocks without retrying the task. This is useful when idempotency cannot be guaranteed and retrying would cause harm, or when you want to fail fast and route to error handling immediately.",
    },
    {
      question:
        "An Express Workflow needs to be invoked from an API endpoint where the client expects a response body with the workflow result. Which API call and workflow type combination supports this?",
      options: [
        "StartExecution on an Asynchronous Express Workflow; poll DescribeExecution for the result",
        "StartSyncExecution on a Synchronous Express Workflow; the API call blocks until the workflow completes and returns the result",
        "StartExecution on a Standard Workflow; the execution ARN is returned and the client polls",
        "Synchronous results are not possible with Express Workflows; use Standard Workflows",
      ],
      correctIndex: 1,
      explanation:
        "`StartSyncExecution` is available only for Synchronous Express Workflows. The API call blocks until the workflow finishes (within the 5-minute Express maximum) and returns the execution result directly in the response body. This is the appropriate pattern for API Gateway integrations where the client needs a synchronous response.",
    },
    {
      question:
        "A Step Functions workflow needs to call the S3 ListObjectsV2 API. No Lambda function exists for this purpose. What is the simplest way to add this capability?",
      options: [
        "Create a Lambda function that calls `s3.listObjectsV2()` and invoke it from a Task state",
        "Use a Task state with resource ARN `arn:aws:states:::aws-sdk:s3:listObjectsV2` to call the S3 API directly",
        "Use an EventBridge rule to trigger an S3 inventory job and wait for the result with a callback token",
        "SDK integrations only support DynamoDB and Lambda; S3 requires a Lambda intermediary",
      ],
      correctIndex: 1,
      explanation:
        "SDK integrations allow Task states to call any AWS API using the ARN pattern `arn:aws:states:::aws-sdk:serviceName:apiAction`. For S3 ListObjectsV2, the resource is `arn:aws:states:::aws-sdk:s3:listObjectsV2`. This eliminates the need for a Lambda function whose sole purpose is making an AWS API call.",
    },
    {
      question:
        "Which error type in a Catch block catches all unhandled errors, regardless of the specific error name thrown?",
      options: [
        "`States.TaskFailed` — catches all task-level failures",
        "`Lambda.AWSLambdaException` — catches all Lambda errors",
        "`States.ALL` — matches any error type not matched by earlier Catch rules",
        "`States.Timeout` — catches both timeout and general failure errors",
      ],
      correctIndex: 2,
      explanation:
        "`States.ALL` is the catch-all error type that matches any error not handled by more specific Catch rules earlier in the array. It is best placed as the last entry in a Catch array so specific error types can be handled with tailored logic while `States.ALL` serves as the final fallback. `States.TaskFailed` only matches task failures, and `States.Timeout` only matches timeout errors.",
    },
  ],
};
