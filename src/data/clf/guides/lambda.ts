import { ServiceGuide } from "../../../types/guide";

export const lambdaGuide: ServiceGuide = {
  id: "clf-lambda",
  service: "AWS Lambda",
  domain: "development",
  tagline: "Run code without managing servers",
  intro:
    "AWS Lambda is a serverless compute service that runs your code in response to events and automatically manages the underlying infrastructure — you pay only for the compute time you actually use, with no servers to provision or maintain.",

  sections: [
    {
      heading: "What Is Serverless Computing?",
      body: `**Serverless** computing does not mean there are no servers — it means you do not manage them. AWS handles all the infrastructure: provisioning, scaling, patching, and availability. You provide the code and AWS takes care of everything else.

Lambda is the core AWS serverless compute service. You write a **function** — a piece of code with a defined entry point called a **handler** — and Lambda executes it in response to **events**. An event might be an HTTP request through API Gateway, a file uploaded to S3, a message in an SQS queue, a timer (scheduled event), or many other triggers.

Because Lambda scales automatically and you pay only for invocations and compute time (measured in milliseconds), it can dramatically reduce costs for workloads that are variable, infrequent, or event-driven.`,
      quiz: [
        {
          question: "What does 'serverless' mean in the context of AWS Lambda?",
          options: [
            "Serverless means the code runs in the user's browser, not on AWS servers",
            "Lambda runs code without any physical servers anywhere",
            "You do not manage the servers — AWS handles provisioning, scaling, patching, and availability",
            "Lambda functions run only on virtual machines, not physical servers",
          ],
          correctIndex: 2,
          explanation:
            "Serverless does not mean there are no servers — it means you don't manage them. AWS handles all infrastructure (provisioning, scaling, patching, availability). You provide only the code, and AWS takes care of everything else.",
        },
        {
          question: "What is the entry point of a Lambda function called?",
          options: ["Trigger", "Invoker", "Runtime", "Handler"],
          correctIndex: 3,
          explanation:
            "The entry point of a Lambda function is called the handler. It is a defined function in your code that Lambda calls when an event occurs. The handler receives the event data and a context object as parameters.",
        },
        {
          question:
            "Which workload type benefits most from Lambda's pay-per-use pricing model?",
          options: [
            "A web application with highly variable or infrequent traffic",
            "A relational database with complex multi-table join queries",
            "A video transcoding system that runs at 100% CPU 24 hours a day",
            "A database that must be available 24/7 with consistent query patterns",
          ],
          correctIndex: 0,
          explanation:
            "Lambda's pay-per-use model (pay only for invocations and compute duration) is most cost-effective for variable or infrequent workloads. There are no idle costs — if the function isn't invoked, you pay nothing. For sustained high-traffic workloads, EC2 may be cheaper.",
        },
      ],
    },
    {
      heading: "How Lambda Functions Work",
      body: `When Lambda receives an event, it finds or creates an **execution environment** — a secure, isolated container running the language runtime you specified (Node.js, Python, Java, Go, .NET, Ruby, or a custom runtime). Your handler code runs inside this environment.

If Lambda already has a warm execution environment from a previous invocation, it reuses it — this is a **warm start**, which is very fast. If no warm environment exists, Lambda must initialize a new one — this is a **cold start** that adds some latency (typically 100–500ms for interpreted languages).

Lambda functions have configurable **memory** (128 MB to 10,240 MB), and CPU scales proportionally with memory. The maximum **timeout** is 15 minutes per invocation. For workloads longer than 15 minutes, you need to use a different service like EC2, ECS, or AWS Step Functions to orchestrate multiple Lambda calls.

Lambda automatically **scales** the number of concurrent executions based on incoming event volume. There is no capacity to provision or manage — Lambda handles scaling transparently.`,
      quiz: [
        {
          question: "What is a 'cold start' in AWS Lambda?",
          options: [
            "When Lambda fails to find the correct runtime for the function",
            "When Lambda scales down to zero instances during low traffic",
            "When Lambda must initialize a new execution environment, adding latency to the invocation",
            "When a Lambda function times out after 15 minutes of execution",
          ],
          correctIndex: 2,
          explanation:
            "A cold start occurs when Lambda has no warm execution environment available and must create a new one — downloading the code, initializing the runtime, and running any initialization code. This adds latency (typically 100–500ms). Warm starts reuse existing environments and are much faster.",
        },
        {
          question:
            "What is the maximum execution timeout for a single AWS Lambda invocation?",
          options: ["24 hours", "5 minutes", "1 hour", "15 minutes"],
          correctIndex: 3,
          explanation:
            "The maximum timeout per Lambda invocation is 15 minutes. For workloads that run longer than 15 minutes, you need to use EC2, ECS, or AWS Step Functions to orchestrate multiple Lambda calls or use a long-running compute service.",
        },
        {
          question:
            "How does Lambda handle sudden increases in incoming event volume?",
          options: [
            "Lambda queues excess events and processes them sequentially with a fixed number of workers",
            "Lambda automatically scales the number of concurrent executions to match incoming volume",
            "Lambda rejects events beyond a fixed concurrency limit and returns an error",
            "You must pre-configure the number of instances Lambda should scale to",
          ],
          correctIndex: 1,
          explanation:
            "Lambda automatically scales the number of concurrent executions based on incoming event volume. There is no capacity to provision or manage — Lambda handles scaling transparently, from zero to thousands of concurrent executions.",
        },
      ],
    },
    {
      heading: "Event Sources and Triggers",
      body: `Lambda integrates with dozens of AWS services as event sources. The most common triggers for the Cloud Practitioner exam are:

**API Gateway** triggers Lambda synchronously on each HTTP request, enabling you to build REST or WebSocket APIs entirely on managed infrastructure without running web servers.

**Amazon S3** triggers Lambda when objects are created, modified, or deleted. This enables event-driven processing: generate thumbnails when an image is uploaded, scan files for viruses, or kick off an ETL pipeline.

**Amazon SQS** polls a queue and invokes Lambda with batches of messages. Lambda processes the messages and SQS removes successfully processed items. This decouples message producers from consumers.

**Amazon DynamoDB Streams** triggers Lambda when table data changes, enabling real-time reactions to database events — syncing data, sending notifications, or updating caches.

**Amazon EventBridge (CloudWatch Events)** can invoke Lambda on a schedule (like a cron job) or when specific events happen in your AWS environment.

The core concept is that Lambda is **event-driven** — it does nothing until an event occurs, making it a natural fit for building reactive, loosely coupled systems.`,
      quiz: [
        {
          question:
            "Which AWS service is combined with Lambda to build serverless REST APIs?",
          options: [
            "Amazon API Gateway",
            "Amazon Route 53",
            "Amazon CloudFront",
            "Amazon SQS",
          ],
          correctIndex: 0,
          explanation:
            "Amazon API Gateway triggers Lambda synchronously on each HTTP request. Together they form the standard serverless API architecture — API Gateway handles routing, authentication, and throttling while Lambda executes the business logic.",
        },
        {
          question:
            "A company wants to automatically generate thumbnail images whenever users upload photos to an S3 bucket. Which architecture achieves this?",
          options: [
            "A CloudWatch alarm that fires when S3 bucket size increases",
            "An EC2 instance that polls S3 every minute for new objects",
            "An S3 event trigger that invokes a Lambda function when objects are created",
            "An EventBridge scheduled rule that processes new S3 objects every hour",
          ],
          correctIndex: 2,
          explanation:
            "S3 can trigger Lambda when objects are created, modified, or deleted. Configuring an S3 event notification to invoke Lambda on object creation is the standard event-driven pattern for processing uploads — no polling or scheduling needed.",
        },
        {
          question:
            "What makes Lambda well-suited for building reactive, loosely coupled systems?",
          options: [
            "Lambda is event-driven — it does nothing until triggered by an event, then responds automatically",
            "Lambda pre-allocates compute capacity so it is always ready for any event",
            "Lambda functions run continuously and check for events in a tight loop",
            "Lambda maintains persistent connections to all event sources simultaneously",
          ],
          correctIndex: 0,
          explanation:
            "Lambda is fundamentally event-driven — it only executes when an event occurs, then terminates. This makes it a natural fit for reactive systems where components respond to events from S3, SQS, API Gateway, DynamoDB Streams, and many other sources.",
        },
      ],
    },
    {
      heading: "Pricing Model",
      body: `Lambda's pricing model is one of its most attractive characteristics, particularly for workloads with variable or infrequent traffic.

You are charged for two things: the number of **requests** (invocations) and the **duration** of compute time (rounded to the nearest millisecond, measured in GB-seconds).

The **AWS Free Tier** permanently includes 1 million Lambda requests and 400,000 GB-seconds of compute time per month. This is enough for many small applications and personal projects to run entirely within the free tier.

Compare this to running an EC2 instance: a \`t3.micro\` instance running 24/7 costs roughly $8–10 per month whether it receives traffic or not. A Lambda function processing 100,000 requests per month of 200ms each costs fractions of a cent. However, for very high, sustained traffic, EC2 can be more cost-effective than Lambda.

The key exam concept is that Lambda follows a **pay-per-use** model with no idle cost, making it economical for variable workloads.`,
      quiz: [
        {
          question:
            "What two dimensions does AWS charge for with Lambda functions?",
          options: [
            "Storage used and network bandwidth consumed",
            "Number of requests (invocations) and duration of compute time",
            "Memory allocated and number of concurrent executions",
            "Data transferred and number of code deployments",
          ],
          correctIndex: 1,
          explanation:
            "Lambda charges for the number of requests (invocations) and the duration of compute time (measured in GB-seconds, rounded to the nearest millisecond). There are no charges when the function is not running.",
        },
        {
          question:
            "What does the AWS Lambda Free Tier permanently include each month?",
          options: [
            "100,000 requests and 40,000 GB-seconds",
            "1 million requests and 400,000 GB-seconds",
            "10 million requests and 4 million GB-seconds",
            "Unlimited requests for functions under 128 MB memory",
          ],
          correctIndex: 1,
          explanation:
            "The Lambda Free Tier permanently includes 1 million requests and 400,000 GB-seconds of compute time per month. This is not a 12-month trial — it is a permanent free tier that allows many small applications to run at no cost.",
        },
        {
          question: "When might EC2 be more cost-effective than Lambda?",
          options: [
            "For workloads that run for less than 15 minutes",
            "For workloads with unpredictable traffic spikes",
            "For very high, sustained traffic where Lambda's per-request costs exceed EC2's hourly rate",
            "EC2 is always more expensive than Lambda",
          ],
          correctIndex: 2,
          explanation:
            "Lambda's pay-per-use model is economical for variable or infrequent traffic. For very high, sustained traffic where a function runs nearly continuously, EC2's flat hourly rate may be more cost-effective than paying per-invocation with Lambda.",
        },
      ],
    },
    {
      heading: "Permissions and Execution Roles",
      body: `Every Lambda function runs with an **IAM execution role** — an IAM role that grants the function permission to interact with other AWS services. For example, if your function needs to read from S3 or write to DynamoDB, the execution role must include those permissions.

AWS automatically provides temporary, short-lived credentials to the function from the execution role at runtime. This means you **never need to hardcode AWS access keys** in your code or environment variables — doing so is a security anti-pattern that can expose credentials if the code is ever leaked.

The execution role follows the **Principle of Least Privilege**: grant only the permissions the function actually needs, nothing more. For example, a function that only reads from one DynamoDB table should have read-only access to that specific table, not write access or access to other tables.

This is the same IAM model used throughout AWS — Lambda is just one of many services that assumes a role to perform actions on your behalf.`,
      quiz: [
        {
          question:
            "How should a Lambda function be granted permission to write to a DynamoDB table?",
          options: [
            "Hardcode AWS access keys in the function's environment variables",
            "Create an IAM user for the function and embed credentials in the code",
            "Make the DynamoDB table public so Lambda can write without authentication",
            "Attach an IAM execution role with DynamoDB write permissions to the function",
          ],
          correctIndex: 3,
          explanation:
            "Lambda functions are granted permissions via an IAM execution role. AWS automatically provides temporary credentials from the role at runtime — no hardcoded keys needed. Embedding access keys in code or environment variables is a security anti-pattern.",
        },
        {
          question:
            "What security principle should guide which permissions are added to a Lambda execution role?",
          options: [
            "Grant all permissions so the function never fails due to access errors",
            "Principle of Least Privilege — grant only the permissions the function actually needs",
            "Copy the permissions from another function in the same account",
            "Use a single shared execution role for all Lambda functions in the account",
          ],
          correctIndex: 1,
          explanation:
            "The Principle of Least Privilege means granting only the minimum permissions required for the function to do its job. This limits the blast radius if a function is compromised and is a core AWS security best practice.",
        },
      ],
    },
    {
      heading: "Common Use Cases",
      body: `Lambda's combination of automatic scaling, event-driven execution, and pay-per-use pricing makes it ideal for a wide range of use cases.

**RESTful APIs**: Combined with API Gateway, Lambda powers serverless backends that scale from zero to millions of requests without managing servers. Each request invokes a Lambda function that reads from DynamoDB or another data store and returns a response.

**File Processing**: When users upload files to S3 — images, documents, videos — Lambda functions are triggered automatically to resize images, convert formats, extract text, or run virus scans, then store the results.

**Scheduled Tasks**: EventBridge can invoke Lambda on a schedule to run nightly reports, purge old records from databases, send reminder emails, or aggregate metrics.

**Real-time Stream Processing**: Lambda processes data streams from Kinesis or DynamoDB Streams for real-time analytics, fraud detection, or data transformation.

**Automation and Glue Logic**: Lambda frequently serves as the glue between AWS services — for example, triggering a CloudFormation stack update when a CodePipeline stage completes, or sending an SNS notification when a DynamoDB item changes.`,
      quiz: [
        {
          question:
            "Which combination of services represents the standard serverless API architecture on AWS?",
          options: [
            "API Gateway + Lambda + DynamoDB",
            "CloudFront + S3 + Route 53",
            "ECS + Fargate + Aurora",
            "EC2 + Elastic Load Balancer + RDS",
          ],
          correctIndex: 0,
          explanation:
            "The standard serverless API architecture is API Gateway (handles HTTP routing, auth, throttling) + Lambda (executes business logic) + DynamoDB (stores data). This combination scales automatically from zero to millions of requests with no server management.",
        },
        {
          question:
            "EventBridge is used with Lambda to accomplish which use case?",
          options: [
            "Serving static website content with low latency",
            "Running Lambda functions on a schedule, like nightly reports or database cleanup",
            "Processing images uploaded to S3 by users",
            "Distributing messages from Lambda to multiple SQS queues",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge scheduled rules invoke Lambda on a cron-like schedule — for example, every night at midnight to run reports, purge old records, or aggregate metrics. This replaces traditional cron jobs with a serverless, managed alternative.",
        },
        {
          question:
            "Lambda is described as 'glue logic' between AWS services. Which example best illustrates this role?",
          options: [
            "Lambda triggers an SNS notification when a DynamoDB item changes via DynamoDB Streams",
            "Lambda manages routing rules in Amazon Route 53",
            "Lambda serves as the database layer for API Gateway requests",
            "Lambda stores application data in DynamoDB tables",
          ],
          correctIndex: 0,
          explanation:
            "Lambda frequently connects AWS services together — like receiving DynamoDB Stream events when a table item changes and sending an SNS notification in response. This 'glue' role connects services without requiring dedicated infrastructure.",
        },
      ],
    },
  ],

  keyFacts: [
    "Lambda is a serverless, event-driven compute service — no servers to manage",
    "You pay only for invocations and compute duration — no idle costs",
    "Supported runtimes: Node.js, Python, Java, Go, .NET, Ruby, and custom runtimes",
    "Maximum timeout is 15 minutes per invocation",
    "Memory configurable from 128 MB to 10,240 MB; CPU scales proportionally",
    "Lambda scales automatically — no capacity provisioning needed",
    "Free Tier: 1 million requests and 400,000 GB-seconds per month (permanent)",
    "Cold starts occur when no warm execution environment is available (adds latency)",
    "Integrates with API Gateway, S3, SQS, DynamoDB, EventBridge, and many more",
    "Lambda execution roles (IAM) grant the function permission to access other AWS services",
  ],

  relatedServices: [
    "Amazon API Gateway",
    "Amazon S3",
    "Amazon DynamoDB",
    "Amazon SQS",
    "Amazon EventBridge",
    "AWS Step Functions",
  ],

  examTips: [
    "Lambda = serverless, event-driven, pay-per-use — no idle costs",
    "Maximum execution time is 15 minutes — use Step Functions for longer workflows",
    "Lambda scales automatically — you never configure capacity",
    "Cold starts add latency when no warm environment exists; warm starts are faster",
    "Free Tier includes 1M requests/month permanently — good for dev and small apps",
    "Use IAM execution roles on Lambda — never embed access keys in function code",
    "API Gateway + Lambda is the standard serverless API architecture",
    "Lambda is cost-effective for variable workloads; EC2 may be cheaper for sustained high traffic",
  ],

  topicQuiz: [
    {
      question:
        "A company runs a function that processes expense reports submitted through a web form. The function is invoked about 500 times per month and takes 2 seconds to run. Which compute service is most cost-effective?",
      options: [
        "EC2 t3.micro running 24/7",
        "AWS Lambda",
        "Amazon ECS with Fargate",
        "EC2 with Auto Scaling",
      ],
      correctIndex: 1,
      explanation:
        "With only 500 invocations per month, Lambda's pay-per-use model (and permanent free tier of 1 million requests/month) makes it essentially free for this workload. An EC2 instance running 24/7 would cost $8-10/month even with zero usage.",
    },
    {
      question:
        "What is the maximum amount of time a single Lambda function invocation can run?",
      options: ["15 minutes", "1 hour", "5 minutes", "There is no limit"],
      correctIndex: 0,
      explanation:
        "Lambda has a maximum timeout of 15 minutes per invocation. Workloads that require longer execution times must use EC2, ECS, or AWS Step Functions to orchestrate multiple Lambda calls or run on long-lived compute.",
    },
    {
      question:
        "Which statement correctly describes Lambda's scaling behavior?",
      options: [
        "You configure a minimum and maximum number of Lambda instances in advance",
        "Lambda scales automatically based on incoming event volume — no capacity provisioning needed",
        "Lambda is limited to 10 concurrent executions per function by default",
        "Lambda scales by increasing the memory and CPU of the function during high traffic",
      ],
      correctIndex: 1,
      explanation:
        "Lambda scales automatically by running more concurrent executions as event volume increases. There is no capacity to provision or pre-configure — Lambda handles scaling transparently, from zero to thousands of concurrent executions.",
    },
    {
      question:
        "A Lambda function is invoked for the first time after being idle for several hours. Users report slightly higher response times than usual. What is the likely cause?",
      options: [
        "A cold start occurred — Lambda had to initialize a new execution environment",
        "The function's memory allocation was automatically reduced during the idle period",
        "Lambda throttled the request due to account-level concurrency limits",
        "Lambda applied additional security scanning to the first invocation after a long idle period",
      ],
      correctIndex: 0,
      explanation:
        "A cold start occurs when Lambda has no warm execution environment available and must initialize a new one. This adds latency (typically 100–500ms for interpreted languages). Subsequent invocations within the warm window are much faster (warm starts).",
    },
    {
      question:
        "A developer needs to run a data migration job that will take approximately 45 minutes. Can Lambda be used for this?",
      options: [
        "Yes — Lambda supports execution times up to 2 hours",
        "Yes — but only if the function uses more than 1 GB of memory",
        "No — Lambda's maximum timeout is 15 minutes; use EC2, ECS, or Step Functions instead",
        "No — Lambda cannot be used for data migration tasks of any length",
      ],
      correctIndex: 2,
      explanation:
        "Lambda has a hard limit of 15 minutes per invocation. A 45-minute migration cannot run in a single Lambda invocation. Alternatives include EC2, ECS/Fargate, or AWS Step Functions to orchestrate the migration across multiple Lambda invocations.",
    },
    {
      question:
        "The AWS Lambda permanent Free Tier includes which resources each month?",
      options: [
        "100,000 requests and 40,000 GB-seconds (available for 12 months after signup)",
        "1 million requests only — compute time is always charged",
        "Unlimited requests for functions under 512 MB memory",
        "1 million requests and 400,000 GB-seconds (permanently, not just 12 months)",
      ],
      correctIndex: 3,
      explanation:
        "The Lambda Free Tier permanently includes 1 million requests and 400,000 GB-seconds of compute time per month. Unlike many Free Tier offers, this is not limited to the first 12 months after account creation — it is a permanent ongoing benefit.",
    },
    {
      question:
        "A Lambda function needs to read objects from an S3 bucket. A developer suggests hardcoding AWS access keys in the function's environment variables. What is wrong with this approach?",
      options: [
        "Lambda environment variables are limited to 4 KB and cannot store access keys",
        "Hardcoded credentials are a security risk — use an IAM execution role instead so AWS provides temporary credentials automatically",
        "Lambda cannot read from S3 regardless of how credentials are provided",
        "Environment variables are deleted when the function scales up, losing the credentials",
      ],
      correctIndex: 1,
      explanation:
        "Hardcoding credentials in environment variables is a security anti-pattern — if the code or config is ever exposed, the keys are compromised. The correct approach is an IAM execution role attached to the function. AWS automatically injects short-lived temporary credentials at runtime, with no keys to manage or rotate manually.",
    },
    {
      question:
        "Which set of services represents event sources that can trigger Lambda functions?",
      options: [
        "CloudFormation, AWS Config, and AWS Organizations",
        "EC2 instances, EBS volumes, and VPC subnets",
        "IAM, KMS, and AWS Certificate Manager",
        "API Gateway, S3, SQS, DynamoDB Streams, and EventBridge",
      ],
      correctIndex: 3,
      explanation:
        "Lambda integrates with dozens of event sources including API Gateway (HTTP requests), S3 (object events), SQS (queue messages), DynamoDB Streams (table changes), and EventBridge (scheduled or AWS events). These make Lambda the glue of event-driven architectures.",
    },
  ],
};
