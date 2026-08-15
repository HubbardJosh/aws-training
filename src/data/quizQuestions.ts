import { QuizQuestion } from "../types";

export const quizQuestions: QuizQuestion[] = [
  // ─── DOMAIN 1: DEVELOPMENT ──────────────────────────────────────────────────

  {
    id: "qq-001",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Lambda",
    question:
      "A developer needs to share a common set of Python libraries across 10 Lambda functions without bundling the libraries into each deployment package. What is the MOST efficient approach?",
    options: [
      "Create a Lambda Layer containing the libraries and attach it to all functions",
      "Package the libraries into each function deployment ZIP",
      "Use an S3 bucket to store libraries and download them at runtime",
      "Store libraries in an EFS file system mounted to all functions",
    ],
    correctIndices: [0],
    explanation:
      "Lambda Layers are the purpose-built solution for sharing code and dependencies across functions. Each function can reference up to 5 layers. The layer is extracted to /opt in the execution environment. Packaging into each ZIP wastes space and makes updates tedious. EFS mounting works but adds latency and cost. S3 downloads at runtime adds cold start time.",
    tags: ["lambda", "layers", "dependencies"],
  },
  {
    id: "qq-002",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Lambda",
    question:
      "A Lambda function processes messages from an SQS queue. After deployment, the team notices that some messages are being processed multiple times. What is the MOST likely cause?",
    options: [
      "The function execution time exceeds the SQS visibility timeout",
      "The SQS queue is configured as a FIFO queue",
      "The Lambda function has reserved concurrency set to 0",
      "The SQS queue has long polling disabled",
    ],
    correctIndices: [0],
    explanation:
      "When a Lambda function takes longer than the SQS visibility timeout to process a message, the message becomes visible again and can be picked up by another invocation — causing duplicate processing. The fix is to set the visibility timeout to at least 6× the function timeout. FIFO queues actually prevent duplicates. Reserved concurrency of 0 would disable the function entirely. Long polling affects how fast messages are received, not duplicates.",
    tags: ["lambda", "sqs", "visibility-timeout", "duplicate"],
  },
  {
    id: "qq-003",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    service: "AWS Lambda",
    question:
      "A Lambda function is experiencing cold start latency issues. Which TWO approaches will MOST effectively reduce cold start times? (Select TWO)",
    options: [
      "Enable Provisioned Concurrency for the function",
      "Increase the function memory allocation",
      "Move initialization code inside the handler function",
      "Minimize the deployment package size",
      "Set reserved concurrency to a high value",
    ],
    correctIndices: [0, 3],
    explanation:
      "Provisioned Concurrency pre-warms execution environments, eliminating cold starts entirely (at extra cost). Minimizing package size reduces the time to download and extract code during environment initialization. Moving initialization inside the handler actually makes cold starts worse (re-running init on every invocation). Increasing memory speeds up CPU but does not eliminate the cold start. Reserved concurrency only limits max concurrency — it does not pre-warm environments.",
    tags: ["lambda", "cold-start", "provisioned-concurrency", "performance"],
  },
  {
    id: "qq-004",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "AWS Lambda",
    question:
      "A developer wants to route failed asynchronous Lambda invocations to an SQS queue for later reprocessing, while also routing successful invocations to another Lambda function. Which Lambda feature should they use?",
    options: [
      "Lambda Destinations",
      "Dead Letter Queue (DLQ)",
      "SQS Event Source Mapping",
      "Lambda Aliases",
    ],
    correctIndices: [0],
    explanation:
      "Lambda Destinations support routing both OnSuccess and OnFailure outcomes of asynchronous invocations to SQS, SNS, another Lambda, or EventBridge. DLQ only handles failures and only supports SQS or SNS. SQS Event Source Mapping is for Lambda consuming from SQS, not routing results. Lambda Aliases are for traffic shifting between versions.",
    tags: ["lambda", "destinations", "dlq", "async"],
  },
  {
    id: "qq-005",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      'A DynamoDB table stores user sessions. The partition key is "status" with values "active" or "inactive". The team is experiencing throttling. What is the ROOT CAUSE?',
    options: [
      "Low-cardinality partition key causing hot partitions",
      "Insufficient provisioned write capacity units",
      "Missing Global Secondary Index on the status attribute",
      "DynamoDB Streams is enabled and consuming read capacity",
    ],
    correctIndices: [0],
    explanation:
      'Using "status" with only two possible values (active/inactive) as a partition key creates extreme hot partitions — nearly all traffic hits one or two physical partitions. Each partition can only handle 3000 RCU and 1000 WCU. Increasing capacity would help temporarily but not fix the root cause. The fix is to redesign the partition key to use a high-cardinality attribute like user_id. DynamoDB Streams does not consume table capacity.',
    tags: ["dynamodb", "hot-partition", "partition-key", "throttling"],
  },
  {
    id: "qq-006",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon DynamoDB",
    question:
      "A developer needs to query DynamoDB items for a specific user (partition key = userId) filtered by date range on the sort key. Which DynamoDB operation should they use?",
    options: [
      "Query with a KeyConditionExpression on userId and date range",
      "Scan with a FilterExpression on userId and date",
      "GetItem with projection expression",
      "BatchGetItem with multiple user IDs",
    ],
    correctIndices: [0],
    explanation:
      "Query is the correct operation — it requires the partition key and supports sort key conditions like BETWEEN, begins_with, and comparison operators. This reads only the relevant partition. Scan reads the entire table and is extremely inefficient and costly for this use case. GetItem retrieves a single item by full primary key. BatchGetItem retrieves multiple specific items by key.",
    tags: ["dynamodb", "query", "sort-key", "keyconditionexpression"],
  },
  {
    id: "qq-007",
    domain: "development",
    difficulty: "hard",
    type: "multi",
    service: "Amazon DynamoDB",
    question:
      "A developer needs to create a DynamoDB table that supports two additional query patterns beyond the primary key. Which TWO options are available? (Select TWO)",
    options: [
      "Create a Global Secondary Index (GSI) for each additional query pattern",
      "Create a Local Secondary Index (LSI) for each additional query pattern",
      "Use DynamoDB Streams to replicate data to a separate table for each query pattern",
      "Use DynamoDB Accelerator (DAX) to support additional query patterns",
      "Use a Scan with FilterExpression for the additional query patterns",
    ],
    correctIndices: [0, 1],
    explanation:
      "GSIs and LSIs are the built-in mechanisms for supporting additional query patterns. GSIs can have different partition and sort keys (added anytime, up to 20 per table). LSIs share the same partition key but have a different sort key (must be created at table creation time, up to 5 per table). DynamoDB Streams is for change data capture, not query optimization. DAX improves read performance but does not enable new query patterns. Scan+FilterExpression is very inefficient.",
    tags: ["dynamodb", "gsi", "lsi", "query-patterns", "indexes"],
  },
  {
    id: "qq-008",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SQS",
    question:
      "An application publishes messages to an SQS Standard queue. A consumer processes messages and deletes them after successful processing. Some messages appear to be processed twice. What should the developer do to investigate?",
    options: [
      "Check if the consumer processing time exceeds the visibility timeout and extend it",
      "Switch to a FIFO queue to ensure exactly-once processing",
      "Increase the message retention period",
      "Enable server-side encryption on the queue",
    ],
    correctIndices: [0],
    explanation:
      "The most common cause of duplicate processing with SQS is that the consumer takes longer to process a message than the visibility timeout, causing the message to reappear. Extending the visibility timeout (or calling ChangeMessageVisibility during processing) fixes this. While switching to FIFO adds exactly-once processing, it also limits throughput. SQS Standard inherently delivers at-least-once — idempotent consumers are the right design. Retention period and encryption are unrelated.",
    tags: ["sqs", "visibility-timeout", "duplicate", "idempotent"],
  },
  {
    id: "qq-009",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon Kinesis",
    question:
      "A Kinesis Data Stream has 4 shards. A producer is writing 5 MB/s of data. What will happen and what is the correct fix?",
    options: [
      "ProvisionedThroughputExceededException will occur; add more shards via shard splitting",
      "The stream will automatically scale to accommodate the additional throughput",
      "The data will be buffered and delivered eventually with no errors",
      "The producer should switch to Kinesis Data Firehose instead",
    ],
    correctIndices: [0],
    explanation:
      "Each Kinesis shard supports 1 MB/s write throughput. 4 shards = 4 MB/s maximum write capacity. Writing 5 MB/s exceeds this and causes ProvisionedThroughputExceededException. The fix is to split shards (add capacity) to reach at least 5 shards. Kinesis Data Streams does NOT auto-scale — you must manually scale or use on-demand mode. Firehose is a different service with different use cases.",
    tags: ["kinesis", "shards", "throughput", "scaling"],
  },
  {
    id: "qq-010",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon S3",
    question:
      "A developer needs to allow an unauthenticated user to upload a file directly to S3 from a browser without exposing AWS credentials. What is the BEST approach?",
    options: [
      "Generate a pre-signed URL with PUT method and provide it to the client",
      "Create an IAM user with S3 write permissions and embed credentials in the frontend",
      "Enable public write access on the S3 bucket",
      "Use an API Gateway proxy to forward uploads to S3",
    ],
    correctIndices: [0],
    explanation:
      "Pre-signed URLs grant temporary, time-limited access to perform a specific S3 operation (PUT for upload) without requiring the user to have AWS credentials. The server generates the URL using AWS credentials and the client uses it directly. Embedding IAM credentials in frontend code is a severe security vulnerability. Enabling public write access would allow anyone to upload anything to your bucket. API Gateway proxy adds unnecessary complexity and cost for large file uploads.",
    tags: ["s3", "presigned-url", "security", "upload"],
  },
  {
    id: "qq-011",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon S3",
    question:
      "A developer needs to upload a 10 GB file to S3. The upload is failing midway through. Which approach ensures the MOST reliable upload?",
    options: [
      "Use multipart upload with individual part retries on failure",
      "Compress the file to under 5 GB before uploading as a single PUT",
      "Use S3 Transfer Acceleration for more reliable uploads",
      "Use the AWS CLI sync command which handles retries automatically",
    ],
    correctIndices: [0],
    explanation:
      "Multipart upload is required for objects over 5 GB and strongly recommended for objects over 100 MB. It uploads the file in parts that can be retried individually on failure — you do not need to restart the entire upload. S3 Transfer Acceleration improves speed over long distances but does not change reliability for mid-upload failures. AWS CLI sync does retry, but multipart with individual part retries is the underlying mechanism that makes large uploads reliable.",
    tags: ["s3", "multipart-upload", "reliability", "large-files"],
  },
  {
    id: "qq-012",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "A developer needs to use one API Gateway REST API definition across development, staging, and production environments with different Lambda function versions. What is the BEST approach?",
    options: [
      "Use stage variables to reference different Lambda aliases per stage",
      "Create a separate API Gateway for each environment",
      "Use query parameters to determine which Lambda version to invoke",
      "Use API Gateway canary deployments to split traffic between versions",
    ],
    correctIndices: [0],
    explanation:
      "Stage variables allow you to parameterize the integration target per stage. For example, the Lambda function ARN can include a stage variable: arn:aws:lambda:region:account:function:myFunction:${stageVariables.lambdaAlias}. Each stage (dev/staging/prod) sets lambdaAlias to the appropriate Lambda alias. This maintains one API definition while routing to different function versions per environment. Creating separate APIs is duplication. Query parameters would require application logic changes. Canary deployments are for gradual traffic shifting, not environment isolation.",
    tags: ["api-gateway", "stage-variables", "lambda", "environments"],
  },
  {
    id: "qq-013",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "AWS Step Functions",
    question:
      "A workflow orchestrates 5 Lambda functions in sequence and must run 10,000 times per second. Total execution time per run is under 2 minutes. Which Step Functions workflow type is MOST cost-effective?",
    options: [
      "Express Workflows (Asynchronous)",
      "Standard Workflows",
      "Express Workflows (Synchronous)",
      "Nested Standard Workflows",
    ],
    correctIndices: [0],
    explanation:
      "Express Workflows support up to 100,000 executions per second and are billed per execution duration (GB-seconds), making them far cheaper for high-volume, short-duration workflows. Standard Workflows are billed per state transition and have a limit of 2,000 executions/s — at 10,000/s they would require quota increases and cost far more. Synchronous Express Workflows wait for the caller, which is fine here, but Asynchronous is fine when the caller does not need to wait for the result. The key differentiator is the high throughput requirement.",
    tags: ["step-functions", "express", "standard", "cost", "throughput"],
  },
  {
    id: "qq-014",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon SNS",
    question:
      "An application publishes order events to an SNS topic. Three different services need to process each order: inventory, billing, and shipping. Each service must receive every order. What is the BEST architecture?",
    options: [
      "SNS topic with three SQS queue subscriptions (fan-out pattern)",
      "Three separate SNS topics, one per service",
      "A single SQS queue with all three services polling from it",
      "SNS topic with three Lambda subscriptions",
    ],
    correctIndices: [0],
    explanation:
      "The fan-out pattern uses one SNS topic subscribed by three SQS queues — each queue belongs to one service. Every service gets a copy of every message. SQS queues provide buffering, retry, and decoupling. Using three separate topics would require the publisher to know about all consumers. A single SQS queue shared by three services means each message is processed by only one service (messages are consumed, not broadcast). Lambda subscriptions work but lack buffering and retry capabilities of SQS.",
    tags: ["sns", "sqs", "fan-out", "decoupling", "pattern"],
  },

  // ─── DOMAIN 2: SECURITY ─────────────────────────────────────────────────────

  {
    id: "qq-015",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS IAM",
    question:
      "A developer's IAM policy explicitly allows s3:PutObject on a bucket. An SCP on the AWS Organization OU does not include s3:PutObject in its allowed actions. What is the result when the developer attempts to upload a file?",
    options: [
      "Access denied — SCP must allow the action for it to succeed",
      "Access granted — the identity policy explicit Allow overrides the SCP",
      "Access denied — only SCPs determine access, not identity policies",
      "Access granted — SCPs only apply to root accounts",
    ],
    correctIndices: [0],
    explanation:
      "SCPs work as a filter on the maximum permissions available to accounts in an AWS Organization. If an SCP does not allow an action, no identity-based or resource-based policy in that account can grant it. The effective permissions are the intersection of what the SCP permits and what the identity policy allows. SCPs apply to all principals in the account except the management account root user.",
    tags: ["iam", "scp", "organizations", "policy-evaluation"],
  },
  {
    id: "qq-016",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon Cognito",
    question:
      "A mobile app uses Cognito User Pools for authentication and needs to grant users temporary AWS credentials to access an S3 bucket directly from the app. Which Cognito feature provides the temporary AWS credentials?",
    options: [
      "Cognito Identity Pools (Federated Identities)",
      "Cognito User Pool built-in token exchange",
      "Cognito hosted UI with IAM integration",
      "Cognito User Pool app client credentials",
    ],
    correctIndices: [0],
    explanation:
      "Cognito Identity Pools exchange third-party tokens (including Cognito User Pool JWTs) for temporary AWS credentials via STS. The app authenticates with the User Pool to get a JWT, then exchanges it with the Identity Pool to get temporary IAM credentials scoped to a role. This allows the app to call AWS services directly. User Pools handle authentication only — they do not issue AWS credentials.",
    tags: ["cognito", "identity-pool", "user-pool", "credentials", "sts"],
  },
  {
    id: "qq-017",
    domain: "security",
    difficulty: "hard",
    type: "single",
    service: "AWS KMS",
    question:
      "A Lambda function needs to encrypt a 50 MB file before storing it in S3. Using KMS Encrypt API directly is failing because the file exceeds the 4 KB limit. What is the correct approach?",
    options: [
      "Use KMS GenerateDataKey to get a DEK, encrypt the file locally with the DEK, store the encrypted DEK alongside the file",
      "Split the file into 4 KB chunks and encrypt each chunk separately with KMS",
      "Use SSE-KMS on S3 to encrypt the file automatically during upload",
      "Base64 encode the file to work within KMS limits",
    ],
    correctIndices: [0],
    explanation:
      "KMS Encrypt is limited to 4 KB. Envelope encryption solves this: call GenerateDataKey to get a plaintext DEK and an encrypted DEK. Use the plaintext DEK with a local encryption library (AES-256) to encrypt the large file. Discard the plaintext DEK. Store the encrypted DEK alongside the encrypted data. To decrypt: call KMS Decrypt on the encrypted DEK, then use the plaintext DEK locally. Splitting into 4 KB chunks is impractical and inefficient. SSE-KMS is for S3-managed encryption, not Lambda-side encryption.",
    tags: ["kms", "envelope-encryption", "dek", "lambda", "encryption"],
  },
  {
    id: "qq-018",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS Secrets Manager",
    question:
      "A Lambda function connects to an RDS database using credentials stored in Secrets Manager. The credentials are rotated every 30 days. How should the developer write the Lambda code to handle rotation without downtime?",
    options: [
      "Retrieve the secret from Secrets Manager at each invocation and implement retry logic for authentication failures",
      "Cache the secret in a Lambda Layer updated during rotation",
      "Store the secret in an environment variable and update it manually after each rotation",
      "Use a DynamoDB table to store credentials and update it via a rotation Lambda",
    ],
    correctIndices: [0],
    explanation:
      "The recommended pattern is to retrieve the secret from Secrets Manager on each invocation (or cache with a short TTL) and implement retry logic: if authentication fails, refresh the cached secret and retry once. This handles the brief window during rotation when old credentials are invalidated. Secrets Manager caching libraries (AWS SDK) handle this automatically. Environment variables require manual updates — defeating the purpose of auto-rotation. Lambda Layers are for code/dependencies, not runtime secrets.",
    tags: ["secrets-manager", "rotation", "lambda", "rds", "caching"],
  },
  {
    id: "qq-019",
    domain: "security",
    difficulty: "hard",
    type: "multi",
    service: "AWS IAM",
    question:
      "A developer needs an EC2 instance to access DynamoDB and S3 without storing long-term credentials. Which TWO steps are required? (Select TWO)",
    options: [
      "Create an IAM role with policies granting DynamoDB and S3 access",
      "Attach the IAM role to the EC2 instance as an instance profile",
      "Create an IAM user and store the access key in ~/.aws/credentials on the instance",
      "Set the AWS_ACCESS_KEY_ID environment variable on the EC2 instance",
      "Add the EC2 instance IP to the DynamoDB resource policy",
    ],
    correctIndices: [0, 1],
    explanation:
      "The correct approach for EC2 is to use IAM roles via instance profiles. Step 1: create an IAM role with the required permissions. Step 2: attach the role to the EC2 instance as an instance profile. The instance metadata service (IMDS) automatically provides temporary credentials to code running on the instance — no long-term keys needed. Storing access keys on the instance is a security anti-pattern. DynamoDB does not support resource-based policies.",
    tags: ["iam", "ec2", "instance-profile", "roles", "credentials"],
  },
  {
    id: "qq-020",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "AWS STS",
    question:
      "A developer in Account A needs to access resources in Account B. The developer has IAM credentials in Account A. What must be configured to allow cross-account access via role assumption?",
    options: [
      "A trust policy on the IAM role in Account B that allows Account A principal to assume it, and the developer must call sts:AssumeRole",
      "A resource-based policy in Account B that grants the Account A user access directly",
      "VPC peering between Account A and Account B",
      "AWS Organizations must be enabled with both accounts in the same OU",
    ],
    correctIndices: [0],
    explanation:
      "Cross-account role assumption requires: 1) An IAM role in Account B with a trust policy (principal = Account A user/role ARN) allowing sts:AssumeRole. 2) The Account A user's identity policy must allow sts:AssumeRole on the Account B role ARN. The developer calls sts:AssumeRole and gets temporary credentials scoped to the Account B role. Resource-based policies can grant cross-account access for some services (S3, Lambda, etc.) but not via STS. VPC peering and Organizations are unrelated.",
    tags: ["sts", "cross-account", "assume-role", "trust-policy"],
  },

  // ─── DOMAIN 3: DEPLOYMENT ───────────────────────────────────────────────────

  {
    id: "qq-021",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodeDeploy",
    question:
      "A team wants to deploy a new Lambda function version where 10% of traffic goes to the new version for 5 minutes before shifting 100% of traffic. Which CodeDeploy deployment configuration achieves this?",
    options: [
      "CodeDeployDefault.LambdaCanary10Percent5Minutes",
      "CodeDeployDefault.LambdaLinear10PercentEvery5Minutes",
      "CodeDeployDefault.LambdaAllAtOnce",
      "CodeDeployDefault.LambdaBlueGreen",
    ],
    correctIndices: [0],
    explanation:
      'Canary deployments shift a small percentage of traffic to the new version, wait, then shift the remainder. LambdaCanary10Percent5Minutes shifts 10% for 5 minutes, then 90% at once. Linear deployments shift traffic incrementally over time (e.g., 10% every 5 minutes until 100%). AllAtOnce shifts immediately with no safety period. There is no "BlueGreen" configuration for Lambda — blue/green is used for EC2.',
    tags: [
      "codedeploy",
      "lambda",
      "canary",
      "deployment-strategy",
      "traffic-shifting",
    ],
  },
  {
    id: "qq-022",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CodeBuild",
    question:
      'A CodeBuild project is failing with "BUILD_CONTAINER_UNABLE_TO_PULL_IMAGE." The project uses a custom Docker image in Amazon ECR. What is the MOST likely cause?',
    options: [
      "The CodeBuild service role does not have ECR pull permissions (ecr:GetAuthorizationToken, ecr:BatchGetImage)",
      "The ECR repository is in a different region than CodeBuild",
      "The Docker image is too large for CodeBuild to pull",
      "CodeBuild does not support custom Docker images from ECR",
    ],
    correctIndices: [0],
    explanation:
      "CodeBuild must authenticate to ECR to pull the custom image. The CodeBuild service role needs ecr:GetAuthorizationToken, ecr:BatchCheckLayerAvailability, and ecr:GetDownloadUrlForLayer permissions (or the AmazonEC2ContainerRegistryReadOnly managed policy). Cross-region ECR is supported. CodeBuild has a 15 GB limit per build for images but pulling fails at authentication before size is an issue. CodeBuild fully supports ECR custom images.",
    tags: ["codebuild", "ecr", "iam", "permissions", "docker"],
  },
  {
    id: "qq-023",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS SAM",
    question:
      "A developer wants to test a Lambda function locally before deploying to AWS. Which SAM CLI command should they use?",
    options: [
      "sam local invoke",
      "sam deploy --dry-run",
      "sam build --local",
      "sam validate --local",
    ],
    correctIndices: [0],
    explanation:
      "sam local invoke runs a Lambda function locally in a Docker container that simulates the Lambda runtime. You can pass an event JSON file with -e event.json. sam local start-api starts a local API Gateway. sam deploy performs actual deployment. sam build compiles/packages the application. sam validate checks the template syntax.",
    tags: ["sam", "local-testing", "lambda", "cli"],
  },
  {
    id: "qq-024",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CloudFormation",
    question:
      "A CloudFormation stack update fails and enters UPDATE_ROLLBACK_FAILED state. What should the developer do to recover?",
    options: [
      "Use the ContinueUpdateRollback API to skip the failed resources and complete the rollback",
      "Delete the stack and recreate it from scratch",
      "Use the stack policy to override the failed resource update",
      "Manually fix the resource in the console and the stack will automatically recover",
    ],
    correctIndices: [0],
    explanation:
      'UPDATE_ROLLBACK_FAILED means CloudFormation tried to roll back changes but failed. The ContinueUpdateRollback API (or "Continue rollback" in console) lets you retry the rollback, optionally skipping specific resources that cannot be rolled back. After specifying resources to skip, CloudFormation completes the rollback and the stack enters UPDATE_ROLLBACK_COMPLETE. Deleting a failed stack is possible but loses all resources. Manually fixing resources without telling CloudFormation creates drift.',
    tags: ["cloudformation", "rollback", "update-rollback-failed", "recovery"],
  },
  {
    id: "qq-025",
    domain: "deployment",
    difficulty: "medium",
    type: "multi",
    service: "AWS Elastic Beanstalk",
    question:
      "A team needs to deploy updates to an Elastic Beanstalk environment with ZERO downtime and the ability to quickly roll back. Which TWO deployment policies meet these requirements? (Select TWO)",
    options: [
      "Immutable deployment",
      "Blue/Green deployment (swap environment URLs)",
      "All at once deployment",
      "Rolling deployment",
      "Rolling with additional batch",
    ],
    correctIndices: [0, 1],
    explanation:
      "Immutable deployment launches a fresh set of instances in a new ASG, deploys the new version, then terminates the old instances. Rollback is instant — terminate new ASG. Zero downtime as old instances serve traffic until swap. Blue/Green uses two separate environments — swap URLs via CNAME for instant cutover; rollback by swapping back. All at once has downtime. Rolling reduces capacity during deployment. Rolling with additional batch maintains capacity but is slower to roll back.",
    tags: [
      "elastic-beanstalk",
      "zero-downtime",
      "rollback",
      "immutable",
      "blue-green",
    ],
  },
  {
    id: "qq-026",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS CDK",
    question:
      "A developer uses AWS CDK to define infrastructure. After running cdk synth, they want to preview what will change in the AWS account before deploying. Which command should they run?",
    options: ["cdk diff", "cdk preview", "cdk plan", "cdk validate"],
    correctIndices: [0],
    explanation:
      "cdk diff compares the synthesized CloudFormation template against the currently deployed stack and shows what resources will be added, modified, or deleted — similar to terraform plan. cdk synth generates the CloudFormation template. cdk deploy deploys the changes. cdk validate is not a standard CDK command (CloudFormation has cfn validate). cdk plan and cdk preview do not exist.",
    tags: ["cdk", "diff", "cloudformation", "preview"],
  },
  {
    id: "qq-027",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "Amazon ECS",
    question:
      "An ECS task running on Fargate needs to retrieve database credentials from Secrets Manager at startup. How should this be configured?",
    options: [
      "Reference the Secrets Manager secret ARN in the task definition secrets section; grant the task execution role GetSecretValue permission",
      "Store credentials in the container image environment variables",
      "Use the task role to call Secrets Manager at runtime in application code",
      "Mount an EFS volume containing the credentials file",
    ],
    correctIndices: [0],
    explanation:
      "ECS injects secrets from Secrets Manager (or SSM Parameter Store) as environment variables at container startup when referenced in the task definition's secrets section. The task execution role (not the task role) must have secretsmanager:GetSecretValue. This is more secure than baking credentials into the image or passing them as plaintext environment variables. The task role is for the application to make AWS API calls — a different IAM role.",
    tags: ["ecs", "fargate", "secrets-manager", "task-definition", "security"],
  },

  // ─── DOMAIN 4: TROUBLESHOOTING & OPTIMIZATION ───────────────────────────────

  {
    id: "qq-028",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "AWS X-Ray",
    question:
      "A developer wants to track custom business data (e.g., orderId, userId) in X-Ray traces to filter and search for specific traces. Which X-Ray mechanism should they use?",
    options: [
      "Annotations — indexed key-value pairs searchable in the X-Ray console",
      "Metadata — non-indexed key-value pairs for additional context",
      "Subsegments — child segments for capturing additional trace data",
      "Sampling rules — configurable trace collection rates",
    ],
    correctIndices: [0],
    explanation:
      "X-Ray Annotations are indexed key-value pairs that you can use to filter and search traces in the X-Ray console and API. Use annotations for data you will query (orderId, userId, environment). Metadata stores additional non-indexed information visible in trace details but not searchable. Subsegments capture timing for downstream calls. Sampling rules control what percentage of requests are traced.",
    tags: ["x-ray", "annotations", "metadata", "tracing", "filtering"],
  },
  {
    id: "qq-029",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "Amazon CloudWatch",
    question:
      "A Lambda function is invoked thousands of times per minute. The team needs custom business metrics (e.g., orders processed per minute) without making PutMetricData API calls on every invocation, which would be too costly. What is the BEST solution?",
    options: [
      "Use CloudWatch Embedded Metric Format (EMF) to embed metrics in structured log output",
      "Write metrics to DynamoDB and query them with CloudWatch",
      "Aggregate metrics in Lambda and call PutMetricData once per hour",
      "Use X-Ray annotations to capture metric values",
    ],
    correctIndices: [0],
    explanation:
      "CloudWatch Embedded Metric Format (EMF) lets functions write metric data as part of structured JSON log output. CloudWatch Logs automatically extracts and publishes the metrics — no PutMetricData API call needed. This works with the existing logging infrastructure and costs nothing extra beyond log storage. Aggregating in Lambda state is not possible at scale because Lambda is stateless. X-Ray annotations are for trace filtering, not metrics.",
    tags: ["cloudwatch", "emf", "custom-metrics", "lambda", "cost"],
  },
  {
    id: "qq-030",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon ElastiCache",
    question:
      "An application's DynamoDB reads are causing latency. The read pattern is highly repetitive — the same items are requested frequently. Which solution provides the LOWEST latency improvement?",
    options: [
      "Add a DAX (DynamoDB Accelerator) cluster in front of DynamoDB",
      "Enable DynamoDB auto-scaling to add capacity",
      "Switch to eventually consistent reads to reduce latency",
      "Add ElastiCache Redis as an application-level cache",
    ],
    correctIndices: [0],
    explanation:
      "DAX provides microsecond read latency for DynamoDB and is a drop-in compatible cache — the application uses the DAX client instead of the DynamoDB client with minimal code changes. It provides lower latency than ElastiCache because it is designed specifically for DynamoDB and is API-compatible. ElastiCache Redis requires application-level cache logic (check cache → miss → read DB → write cache). Auto-scaling helps with throughput but not latency. Eventually consistent reads reduce cost but have minimal impact on latency.",
    tags: ["dynamodb", "dax", "elasticache", "caching", "latency"],
  },
  {
    id: "qq-031",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "AWS Lambda",
    question:
      'A Lambda function connected to a Kinesis Data Stream is processing data slowly. A single "poison pill" message keeps causing the function to fail, blocking all other messages in the shard. What is the BEST fix?',
    options: [
      "Enable BisectBatchOnFunctionError and configure an OnFailure destination to route failed records to SQS",
      "Increase the function timeout and retry the failed batch indefinitely",
      "Switch to a Standard SQS queue as the event source",
      "Add a Dead Letter Queue to the Lambda function",
    ],
    correctIndices: [0],
    explanation:
      "BisectBatchOnFunctionError splits a failing batch in half recursively to isolate the poison-pill record. Combined with an OnFailure destination (SQS or SNS), the isolated bad record is routed out of the stream so processing can continue. MaximumRetryAttempts controls how many times a batch is retried before routing to the destination. Simply increasing timeout keeps retrying the same bad message indefinitely. Lambda DLQs only apply to asynchronous invocations, not stream-based event sources.",
    tags: ["lambda", "kinesis", "poison-pill", "bisect", "error-handling"],
  },
  {
    id: "qq-032",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudWatch",
    question:
      "A developer needs to search CloudWatch Logs for all ERROR-level log entries across all Lambda functions in an account and view them in a single query. Which CloudWatch feature enables this?",
    options: [
      "CloudWatch Logs Insights with a cross-log-group query",
      "CloudWatch Metrics with a custom namespace filter",
      "CloudWatch Contributor Insights with error pattern matching",
      "CloudWatch Synthetics with error detection canaries",
    ],
    correctIndices: [0],
    explanation:
      "CloudWatch Logs Insights supports querying multiple log groups simultaneously using cross-log-group queries. You can specify multiple log groups or use a prefix pattern to match all Lambda log groups. Logs Insights uses a purpose-built query language to filter, aggregate, and visualize log data. Metrics do not contain log content. Contributor Insights analyzes log patterns to identify top contributors. Synthetics monitors application endpoints, not Lambda logs.",
    tags: [
      "cloudwatch",
      "logs-insights",
      "lambda",
      "debugging",
      "cross-log-group",
    ],
  },
  {
    id: "qq-033",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "multi",
    service: "AWS X-Ray",
    question:
      "A microservices application has intermittent latency spikes. The team wants to trace requests end-to-end across Lambda, API Gateway, and DynamoDB. Which TWO actions are required? (Select TWO)",
    options: [
      "Enable X-Ray active tracing on the Lambda function",
      "Enable X-Ray tracing on the API Gateway stage",
      "Install the X-Ray daemon as a Lambda layer on each function",
      "Add X-Ray annotations to every DynamoDB API call",
      "Create a CloudWatch Logs subscription filter for X-Ray data",
    ],
    correctIndices: [0, 1],
    explanation:
      "To get end-to-end traces through API Gateway → Lambda → DynamoDB: enable X-Ray tracing on the API Gateway stage (adds trace header to requests) and enable active tracing on Lambda (Lambda automatically runs the X-Ray daemon and sends traces). DynamoDB calls are automatically captured as subsegments by the AWS SDK when tracing is enabled — no manual annotations needed for basic tracing. Lambda manages the X-Ray daemon automatically — no Layer needed. X-Ray data is not sent via CloudWatch Logs.",
    tags: ["x-ray", "api-gateway", "lambda", "tracing", "microservices"],
  },
  {
    id: "qq-034",
    domain: "troubleshooting",
    difficulty: "medium",
    type: "single",
    service: "Amazon CloudFront",
    question:
      "An application returns stale data from CloudFront even after the origin was updated. The developer needs to immediately invalidate specific cached objects. Which action should they take?",
    options: [
      "Create a CloudFront invalidation for the specific paths (e.g., /api/products/*)",
      "Increase the CloudFront origin TTL to force more frequent origin fetches",
      "Disable caching on the CloudFront distribution temporarily",
      "Update the S3 object metadata to trigger CloudFront cache refresh",
    ],
    correctIndices: [0],
    explanation:
      "CloudFront invalidations remove specific objects from edge caches immediately. You specify path patterns (e.g., /images/*, /api/v1/products). First 1,000 invalidation paths per month are free; thereafter $0.005 per path. Increasing TTL makes caching worse, not better. Disabling caching impacts all users. Updating S3 metadata does not trigger CloudFront invalidation — CloudFront caches based on TTL, not object modification time.",
    tags: ["cloudfront", "cache-invalidation", "cdn", "stale-cache"],
  },
  {
    id: "qq-035",
    domain: "troubleshooting",
    difficulty: "hard",
    type: "single",
    service: "Amazon ElastiCache",
    question:
      "An application uses ElastiCache Redis for session storage. After a Redis primary node failure, users are being logged out. The team wants automatic failover with minimal data loss. What should be configured?",
    options: [
      "Enable Multi-AZ with automatic failover on the Redis replication group",
      "Switch to ElastiCache Memcached for better high availability",
      "Use Redis Cluster Mode with multiple shards",
      "Configure an Application Load Balancer in front of Redis",
    ],
    correctIndices: [0],
    explanation:
      "ElastiCache Redis supports Multi-AZ with automatic failover: a read replica in another AZ is promoted to primary within seconds of a primary failure. This minimizes data loss (replica lag is typically milliseconds) and downtime. Memcached does not support replication or automatic failover — it is strictly for simple caching. Redis Cluster Mode adds sharding (horizontal scaling) but the question is about availability, not capacity. Load balancers do not solve Redis failover.",
    tags: ["elasticache", "redis", "multi-az", "failover", "high-availability"],
  },
  {
    id: "qq-036",
    domain: "deployment",
    difficulty: "hard",
    type: "single",
    service: "AWS AppConfig",
    question:
      "A team uses AWS AppConfig to manage feature flags. After deploying a new configuration, a CloudWatch alarm fires indicating increased error rates. What does AppConfig do automatically?",
    options: [
      "Rolls back to the previous configuration if a CloudWatch alarm is linked as a rollback trigger",
      "Sends an SNS notification to the team but continues the deployment",
      "Pauses the deployment and waits for manual approval to continue",
      "Increases the deployment interval to slow down the rollout",
    ],
    correctIndices: [0],
    explanation:
      "AppConfig supports CloudWatch alarm-based rollback triggers. If a linked alarm enters ALARM state during a deployment, AppConfig automatically stops the deployment and rolls back to the previously deployed configuration. This provides automated safety for configuration changes — similar to CodeDeploy rollback triggers. AppConfig does not pause and wait or adjust intervals automatically.",
    tags: ["appconfig", "rollback", "cloudwatch", "alarms", "feature-flags"],
  },
  {
    id: "qq-037",
    domain: "security",
    difficulty: "medium",
    type: "single",
    service: "Amazon API Gateway",
    question:
      "An API Gateway REST API must only be accessible from a specific VPC. What is the MOST restrictive and correct configuration?",
    options: [
      "Create a private API Gateway endpoint and attach a resource policy that allows access only from the specific VPC",
      "Use a WAF rule to block all traffic not originating from the VPC IP range",
      "Enable API Gateway usage plans with IP-based throttling",
      "Place API Gateway behind a Network Load Balancer inside the VPC",
    ],
    correctIndices: [0],
    explanation:
      "Private API Gateway endpoints are accessible only via VPC interface endpoints (PrivateLink). Combined with a resource policy that restricts access to a specific VPC ID or VPC endpoint ID, this ensures the API is only reachable from within the VPC. WAF operates at the network level and cannot enforce VPC-based access. Usage plans throttle by API key, not network origin. API Gateway cannot be placed behind an NLB in the traditional sense.",
    tags: [
      "api-gateway",
      "private-endpoint",
      "vpc",
      "resource-policy",
      "security",
    ],
  },
  {
    id: "qq-038",
    domain: "development",
    difficulty: "medium",
    type: "single",
    service: "Amazon EventBridge",
    question:
      "A developer wants to trigger a Lambda function every weekday at 9:00 AM UTC. Which EventBridge feature enables this?",
    options: [
      "EventBridge Scheduler with a cron expression: cron(0 9 ? * MON-FRI *)",
      "EventBridge Rule with an event pattern matching a custom time event",
      "EventBridge Pipe connected to a CloudWatch alarm",
      "EventBridge Archive with a replay schedule",
    ],
    correctIndices: [0],
    explanation:
      "EventBridge Scheduler (or EventBridge Rules with schedule expressions) supports cron and rate expressions for time-based triggers. cron(0 9 ? * MON-FRI *) fires at 9:00 AM UTC Monday through Friday. The target can be a Lambda function, SQS queue, Step Functions, or 200+ other AWS services. EventBridge Pipes connect event sources to targets with filtering and enrichment. Archives are for replaying past events.",
    tags: ["eventbridge", "scheduler", "cron", "lambda", "scheduled-tasks"],
  },
  {
    id: "qq-039",
    domain: "development",
    difficulty: "hard",
    type: "single",
    service: "Amazon RDS",
    question:
      'A serverless application with unpredictable traffic spikes uses Lambda functions connecting to an RDS MySQL database. During spikes, the application experiences "too many connections" errors. What is the BEST solution?',
    options: [
      "Add an RDS Proxy between Lambda and RDS to pool and manage database connections",
      "Increase the max_connections parameter on the RDS instance",
      "Switch to DynamoDB for better serverless scaling",
      "Use connection pooling libraries in the Lambda function code",
    ],
    correctIndices: [0],
    explanation:
      "RDS Proxy solves the Lambda connection exhaustion problem. Lambda can create thousands of concurrent invocations each trying to open a database connection — quickly exceeding RDS max_connections. RDS Proxy maintains a connection pool and multiplexes thousands of application connections into a smaller set of long-lived database connections. It handles connection reuse, reduces connection overhead, and improves failover time. Increasing max_connections has hard limits. Connection pooling in Lambda is limited because Lambda environments are short-lived and pooling is per-environment.",
    tags: ["rds", "rds-proxy", "lambda", "connection-pooling", "serverless"],
  },
  {
    id: "qq-040",
    domain: "deployment",
    difficulty: "medium",
    type: "single",
    service: "AWS CodePipeline",
    question:
      "A CodePipeline pipeline must not proceed to production deployment without a senior engineer approving the change. Which action type should be added between the staging and production stages?",
    options: [
      "Manual Approval action",
      "Lambda Invoke action with approval logic",
      "Test action with a quality gate",
      "Source action with a branch protection rule",
    ],
    correctIndices: [0],
    explanation:
      "CodePipeline Manual Approval actions pause the pipeline and send an SNS notification to approvers. The pipeline waits (up to 7 days) for an approve or reject decision via the console, CLI, or API before proceeding. Lambda Invoke could implement custom logic but adds unnecessary complexity. Test actions run automated tests — they do not provide human approval gates. Source actions relate to code retrieval.",
    tags: ["codepipeline", "manual-approval", "ci-cd", "governance"],
  },
];
