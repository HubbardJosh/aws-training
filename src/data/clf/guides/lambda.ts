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
    },
    {
      heading: "How Lambda Functions Work",
      body: `When Lambda receives an event, it finds or creates an **execution environment** — a secure, isolated container running the language runtime you specified (Node.js, Python, Java, Go, .NET, Ruby, or a custom runtime). Your handler code runs inside this environment.

If Lambda already has a warm execution environment from a previous invocation, it reuses it — this is a **warm start**, which is very fast. If no warm environment exists, Lambda must initialize a new one — this is a **cold start** that adds some latency (typically 100–500ms for interpreted languages).

Lambda functions have configurable **memory** (128 MB to 10,240 MB), and CPU scales proportionally with memory. The maximum **timeout** is 15 minutes per invocation. For workloads longer than 15 minutes, you need to use a different service like EC2, ECS, or AWS Step Functions to orchestrate multiple Lambda calls.

Lambda automatically **scales** the number of concurrent executions based on incoming event volume. There is no capacity to provision or manage — Lambda handles scaling transparently.`,
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
    },
    {
      heading: "Pricing Model",
      body: `Lambda's pricing model is one of its most attractive characteristics, particularly for workloads with variable or infrequent traffic.

You are charged for two things: the number of **requests** (invocations) and the **duration** of compute time (rounded to the nearest millisecond, measured in GB-seconds).

The **AWS Free Tier** permanently includes 1 million Lambda requests and 400,000 GB-seconds of compute time per month. This is enough for many small applications and personal projects to run entirely within the free tier.

Compare this to running an EC2 instance: a \`t3.micro\` instance running 24/7 costs roughly $8–10 per month whether it receives traffic or not. A Lambda function processing 100,000 requests per month of 200ms each costs fractions of a cent. However, for very high, sustained traffic, EC2 can be more cost-effective than Lambda.

The key exam concept is that Lambda follows a **pay-per-use** model with no idle cost, making it economical for variable workloads.`,
    },
    {
      heading: "Common Use Cases",
      body: `Lambda's combination of automatic scaling, event-driven execution, and pay-per-use pricing makes it ideal for a wide range of use cases.

**RESTful APIs**: Combined with API Gateway, Lambda powers serverless backends that scale from zero to millions of requests without managing servers. Each request invokes a Lambda function that reads from DynamoDB or another data store and returns a response.

**File Processing**: When users upload files to S3 — images, documents, videos — Lambda functions are triggered automatically to resize images, convert formats, extract text, or run virus scans, then store the results.

**Scheduled Tasks**: EventBridge can invoke Lambda on a schedule to run nightly reports, purge old records from databases, send reminder emails, or aggregate metrics.

**Real-time Stream Processing**: Lambda processes data streams from Kinesis or DynamoDB Streams for real-time analytics, fraud detection, or data transformation.

**Automation and Glue Logic**: Lambda frequently serves as the glue between AWS services — for example, triggering a CloudFormation stack update when a CodePipeline stage completes, or sending an SNS notification when a DynamoDB item changes.`,
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
};
