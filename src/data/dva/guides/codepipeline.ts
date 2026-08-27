import { ServiceGuide } from "../../../types/guide";

export const codepipelineGuide: ServiceGuide = {
  id: "aws-codepipeline",
  service: "AWS CodePipeline",
  domain: "deployment",
  tagline: "Fully managed CI/CD pipeline for fast and reliable delivery",
  intro:
    "CodePipeline automates the build, test, and deploy phases of your release process. It orchestrates CodeCommit/GitHub → CodeBuild → CodeDeploy (or ECS/Lambda) in a visual workflow. Each code change flows through the pipeline automatically, enabling continuous delivery.",

  sections: [
    {
      heading: "Pipeline Structure",
      body: `A CodePipeline **pipeline** is a sequence of **stages**, and each stage contains one or more **actions**. Actions within a stage can run in parallel or sequentially — you control this by assigning actions to run order groups within the stage. Between stages, CodePipeline transfers **artifacts**: ZIP files stored in an S3 bucket that CodePipeline manages. The output artifact of one action becomes the input artifact of the next.

Stages represent the logical phases of your delivery process — Source, Build, Test, Deploy, and Approval are common names, but you can name them anything. Actions are the actual work units. Each action has a category (Source, Build, Test, Deploy, Invoke, Approval), a provider (the specific tool that does the work), and input/output artifact references. The provider list includes CodeCommit, GitHub, S3, CodeBuild, CodeDeploy, ECS, Lambda, CloudFormation, Elastic Beanstalk, and many more.

**Pipeline transitions** are the connections between stages. You can disable a transition to pause the pipeline at a specific stage — this is useful for creating manual gates without using the formal Approval action type. Each pipeline execution represents one code change flowing through. If a new change arrives while one execution is in progress, CodePipeline can queue it (superseded mode) or run them in parallel.`,
      quiz: [
        {
          question: "Where does CodePipeline store artifacts between stages?",
          options: [
            "In an EFS file system shared across stages",
            "In an S3 bucket managed by CodePipeline",
            "In a CodeCommit repository",
            "In an ECR image registry",
          ],
          correctIndex: 1,
          explanation:
            "CodePipeline stores artifacts (ZIP files) in an S3 bucket that it manages automatically. The output artifact of one action becomes the input artifact of the next stage.",
        },
        {
          question:
            "What happens when you disable a pipeline transition between stages?",
          options: [
            "The pipeline is permanently deleted",
            "The pipeline pauses at that stage, acting as a manual gate",
            "All running executions are rolled back",
            "Artifacts from prior stages are deleted",
          ],
          correctIndex: 1,
          explanation:
            "Disabling a pipeline transition pauses the pipeline at that point without stopping it entirely. This creates a manual gate that lets you control when changes proceed to the next stage.",
        },
        {
          question:
            "Within a single CodePipeline stage, how can actions be ordered?",
          options: [
            "Actions in a stage always run sequentially in declaration order",
            "Actions can run in parallel or sequentially based on their run order group",
            "Actions always run in parallel within a stage",
            "Only one action per stage is allowed",
          ],
          correctIndex: 1,
          explanation:
            "Within a stage, actions are assigned run order numbers. Actions with the same run order number execute in parallel; actions with higher numbers wait for lower-numbered actions to complete first.",
        },
      ],
    },
    {
      heading: "Source Stage",
      body: `The Source stage defines where CodePipeline watches for changes and what it fetches. The detection method matters significantly for pipeline responsiveness. **EventBridge (CloudWatch Events) detection** triggers the pipeline nearly instantly when a repository change occurs — this is the recommended approach. The legacy **polling** method checks for changes every minute and adds avoidable latency.

**CodeCommit** triggers on branch pushes. **GitHub** and **GitHub Enterprise** connect via OAuth or a GitHub App (using CodeStar Connections) and can trigger on push events or pull request creation. **S3** as a source triggers when a new object version is uploaded to a specific key — object versioning must be enabled on the bucket. **Bitbucket** and **GitLab** connect via CodeStar connections, which are managed connections to third-party providers that handle authentication once for use across multiple pipelines.

The source action produces an output artifact containing the source code as a ZIP file. This artifact flows to the Build stage and is the starting point for the entire pipeline's data flow.`,
      quiz: [
        {
          question:
            "What is the recommended source detection method in CodePipeline for near-instant pipeline triggers?",
          options: [
            "Polling the repository every minute",
            "EventBridge (CloudWatch Events) detection",
            "Webhook from the CodePipeline console",
            "Scheduled CloudWatch Events rule",
          ],
          correctIndex: 1,
          explanation:
            "EventBridge detection triggers the pipeline nearly instantly when a repository change occurs. The legacy polling method checks every minute and adds unnecessary latency.",
        },
        {
          question:
            "What is required on an S3 bucket for it to be used as a CodePipeline source?",
          options: [
            "The bucket must be publicly accessible",
            "Object versioning must be enabled on the bucket",
            "The bucket must be in the same region as the pipeline",
            "The bucket must have a lifecycle policy configured",
          ],
          correctIndex: 1,
          explanation:
            "When using S3 as a CodePipeline source, object versioning must be enabled. CodePipeline detects new object versions and uses them to trigger the pipeline.",
        },
        {
          question:
            "How does CodePipeline connect to third-party source providers like GitHub, Bitbucket, and GitLab?",
          options: [
            "By storing repository credentials in Secrets Manager",
            "Via CodeStar Connections, which manage authentication once for reuse across pipelines",
            "By polling the provider's API with an IAM access key",
            "Through a dedicated VPN tunnel to the provider",
          ],
          correctIndex: 1,
          explanation:
            "CodeStar Connections provide managed OAuth connections to third-party source providers. You configure the connection once and reference it across multiple pipelines without storing credentials.",
        },
      ],
    },
    {
      heading: "Build Stage (CodeBuild)",
      body: `CodeBuild is the most common build provider. It takes the source artifact, compiles the code, runs tests, and produces a build artifact. The build is defined by a \`buildspec.yml\` in your repository or inline in the CodeBuild project configuration:

\`\`\`yaml
version: 0.2
phases:
  install:
    commands:
      - npm install
  build:
    commands:
      - npm run build
      - npm test
artifacts:
  files:
    - '**/*'
  base-directory: dist
\`\`\`

CodePipeline passes environment variables and artifact information to CodeBuild automatically. CodeBuild can also receive **pipeline variables** — values passed from earlier stages that CodeBuild uses to customize the build. For example, the source commit SHA could be passed as a variable and used to tag Docker images.

The build output artifact — a JAR, ZIP, Docker image digest, or whatever your build produces — flows to the Deploy stage. The artifact is stored in CodePipeline's S3 bucket between stages, maintaining the integrity of what was built and ensuring reproducibility.`,
      quiz: [
        {
          question:
            "Where is a CodeBuild project's build configuration defined when used within CodePipeline?",
          options: [
            "In the CodePipeline console only",
            "In a buildspec.yml file in the repository or inline in the CodeBuild project",
            "In a Dockerfile at the root of the repository",
            "In an appspec.yml file",
          ],
          correctIndex: 1,
          explanation:
            "CodeBuild reads its build instructions from a buildspec.yml file at the root of the repository, or from an inline buildspec defined directly in the CodeBuild project configuration.",
        },
        {
          question:
            "What are CodePipeline pipeline variables used for in a CodeBuild action?",
          options: [
            "To configure the pipeline's IAM role permissions",
            "To pass values from earlier stages to customize the build (e.g., commit SHA for image tags)",
            "To define which S3 bucket stores artifacts",
            "To set the CodeBuild environment type",
          ],
          correctIndex: 1,
          explanation:
            "Pipeline variables allow values from earlier stages — such as the source commit SHA or a version number — to be passed into CodeBuild so the build can be customized without hardcoding values.",
        },
        {
          question:
            "After a CodeBuild action completes, where is the build output artifact stored?",
          options: [
            "In the CodeBuild project's log group in CloudWatch",
            "In CodePipeline's managed S3 bucket",
            "In the source code repository",
            "In an ECR repository automatically",
          ],
          correctIndex: 1,
          explanation:
            "CodePipeline stores build output artifacts in its managed S3 bucket between stages. This ensures reproducibility and allows the artifact to be passed to subsequent deploy stages.",
        },
      ],
    },
    {
      heading: "Deploy Stage",
      body: `The Deploy stage has the widest variety of providers because "deployment" means something different depending on your stack.

**CodeDeploy** handles deployments to EC2, Lambda, and ECS with full support for in-place, rolling, and blue/green strategies. **ECS (direct)** updates an ECS service with a new task definition revision using a rolling update — no CodeDeploy needed for rolling, but CodeDeploy is required for blue/green ECS. **Elastic Beanstalk** receives a new application version and deploys it to a Beanstalk environment using whatever deployment policy the environment is configured with.

**CloudFormation** is the deploy provider for infrastructure-as-code pipelines. The most important CloudFormation actions are \`CREATE_UPDATE\` (directly creates or updates a stack), \`CHANGE_SET_CREATE\` (creates a change set for review), and \`CHANGE_SET_EXECUTE\` (executes an approved change set). Splitting change set creation and execution across stages with a manual Approval action in between is the safest pattern for infrastructure changes.

The **Manual Approval** action pauses the pipeline and sends an SNS notification to reviewers. Reviewers then approve or reject the deployment through the console or via the API. The pipeline waits up to 7 days for a response before timing out.

The **Lambda Invoke** action invokes a Lambda function at any point in the pipeline — useful for custom validation logic, smoke tests, notifications, or any operation that doesn't fit another action type. The Lambda function **must** call \`PutJobSuccessResult\` or \`PutJobFailureResult\` with the job ID it receives; otherwise, the pipeline will wait indefinitely until it times out.`,
      quiz: [
        {
          question:
            "What must a Lambda function invoked by a CodePipeline Lambda Invoke action do to prevent the pipeline from hanging?",
          options: [
            "Return an HTTP 200 status code within 30 seconds",
            "Call PutJobSuccessResult or PutJobFailureResult with the job ID",
            "Write a success marker to the CodePipeline S3 artifact bucket",
            "Publish a success message to the pipeline's SNS topic",
          ],
          correctIndex: 1,
          explanation:
            "A Lambda function invoked by CodePipeline must call PutJobSuccessResult or PutJobFailureResult with the job ID it receives. If it doesn't, CodePipeline waits indefinitely until the action times out.",
        },
        {
          question:
            "What is the safest CloudFormation deploy pattern in CodePipeline for infrastructure changes?",
          options: [
            "CREATE_UPDATE directly on every push",
            "CHANGE_SET_CREATE, then Manual Approval, then CHANGE_SET_EXECUTE",
            "DELETE_STACK followed by CREATE_UPDATE",
            "Deploy directly to production using a Lambda function",
          ],
          correctIndex: 1,
          explanation:
            "The safest pattern is to create a change set, pause with a Manual Approval action so a team member can review the proposed changes in the CloudFormation console, then execute the approved change set.",
        },
        {
          question:
            "How long does a CodePipeline Manual Approval action wait before timing out?",
          options: ["24 hours", "3 days", "7 days", "30 days"],
          correctIndex: 2,
          explanation:
            "A Manual Approval action pauses the pipeline and waits up to 7 days for a reviewer to approve or reject the deployment via the console or API.",
        },
      ],
    },
    {
      heading: "Notifications & Monitoring",
      body: `CodePipeline integrates with several monitoring and notification systems. **Notification rules** send SNS messages when pipeline execution state changes — pipeline starts, succeeds, fails, or reaches an action requiring manual approval. These are configured per pipeline and can target SNS topics (which fan out to email, SMS, or Lambda).

Because CodePipeline emits state change events to **EventBridge**, you can build more sophisticated response workflows. When a pipeline fails, an EventBridge rule can trigger a Lambda function that posts to Slack, opens a ticket, or sends a PagerDuty alert. The event contains the pipeline name, stage name, action name, and failure reason, giving you enough context to build useful notifications.

**CloudTrail** records all CodePipeline API calls, providing an audit trail of who created, modified, and triggered pipelines. For debugging, the CodePipeline console shows a visual execution history — you can click into any execution, see each action's status, and retry failed stages without restarting the entire pipeline.`,
      quiz: [
        {
          question:
            "Which AWS service does CodePipeline emit state change events to, enabling sophisticated notification workflows?",
          options: [
            "Amazon SQS",
            "Amazon SNS",
            "Amazon EventBridge",
            "AWS CloudTrail",
          ],
          correctIndex: 2,
          explanation:
            "CodePipeline emits state change events to EventBridge. You can create rules that trigger Lambda, post to Slack, or send alerts when a pipeline succeeds, fails, or requires approval.",
        },
        {
          question:
            "When a CodePipeline stage fails, what can you do without restarting the entire pipeline?",
          options: [
            "Nothing — the entire pipeline must be re-triggered from the source stage",
            "Retry the failed stage directly from the pipeline execution history",
            "Revert to the previous successful pipeline version",
            "Manually replay only the source action",
          ],
          correctIndex: 1,
          explanation:
            "CodePipeline allows you to retry a failed stage without restarting the entire pipeline. The execution history in the console lets you click into any execution and retry from the failed stage.",
        },
        {
          question: "What does CloudTrail record for CodePipeline?",
          options: [
            "Container logs from CodeBuild build executions",
            "All CodePipeline API calls including who created, modified, and triggered pipelines",
            "CloudWatch metrics for pipeline execution duration",
            "S3 artifact access logs",
          ],
          correctIndex: 1,
          explanation:
            "CloudTrail records all CodePipeline API calls, providing an audit trail of every action taken — who created pipelines, who triggered them, and who modified configurations.",
        },
      ],
    },
    {
      heading: "CodePipeline with Other Services",
      body: `The native AWS DevOps stack is **CodeCommit → CodeBuild → CodeDeploy** orchestrated by CodePipeline. Each tool is specialized: CodeCommit is the source repository, CodeBuild compiles and tests, CodeDeploy manages deployment strategies, and CodePipeline ties them together. For teams using GitHub, the pattern shifts to GitHub as the source with CodeStar connections, but CodeBuild and CodeDeploy remain the same.

For containerized applications, a common modern pattern is **GitHub → CodeBuild → ECS**: CodeBuild builds a Docker image and pushes it to ECR, then the pipeline updates the ECS service with the new image digest. The ECS deploy action handles the rolling update, or CodeDeploy handles blue/green if that's required.

**Infrastructure pipelines** use CloudFormation as the deploy provider. A typical pattern: code change triggers pipeline, CodeBuild validates the template (using \`cfn-lint\`), a CloudFormation action creates a change set, a Manual Approval action lets a team member review the change set in the CloudFormation console, and a second CloudFormation action executes the approved change set. This gives you safe, auditable infrastructure changes with human review before any resource is modified.

For static websites, a **S3 + CloudFront** pipeline builds the frontend with CodeBuild, uploads the artifacts to S3, and uses a Lambda Invoke action to invalidate the CloudFront cache — giving you an automated, zero-downtime frontend deployment workflow.`,
      quiz: [
        {
          question:
            "In a containerized CodePipeline workflow using ECS, what does the CodeBuild stage typically do?",
          options: [
            "Directly update the ECS task definition",
            "Build a Docker image and push it to ECR",
            "Run integration tests against the live ECS service",
            "Scale the ECS cluster before deployment",
          ],
          correctIndex: 1,
          explanation:
            "In a GitHub → CodeBuild → ECS pipeline, CodeBuild builds the Docker image, pushes it to ECR, and produces the image digest or task definition as an artifact. The ECS deploy action then updates the service.",
        },
        {
          question:
            "Which tool in the native AWS DevOps stack is responsible for managing deployment strategies like in-place and blue/green?",
          options: ["CodePipeline", "CodeBuild", "CodeDeploy", "CodeCommit"],
          correctIndex: 2,
          explanation:
            "CodeDeploy manages deployment strategies including in-place, rolling, and blue/green deployments to EC2, Lambda, and ECS. CodePipeline orchestrates the flow; CodeDeploy handles the actual deployment mechanics.",
        },
        {
          question:
            "When deploying a static website with CodePipeline, what must happen after uploading new files to S3?",
          options: [
            "Nothing — S3 updates are immediately visible to all users",
            "The CloudFront cache must be invalidated to serve the new content",
            "The S3 bucket versioning must be updated",
            "Route 53 DNS records must be refreshed",
          ],
          correctIndex: 1,
          explanation:
            "After uploading new static files to S3, the CloudFront cache must be invalidated so edge locations serve the updated content. A Lambda Invoke action in the pipeline can perform this invalidation automatically.",
        },
      ],
    },
  ],

  keyFacts: [
    "Pipeline = stages → actions. Actions in a stage can run parallel or sequential.",
    "Artifacts stored in S3 between stages. Each action has input/output artifacts.",
    "Source providers: CodeCommit, GitHub, S3, Bitbucket, GitLab (via CodeStar connections)",
    "EventBridge detection: near-instant trigger. Polling: every minute (legacy).",
    "Manual Approval action: SNS notification; pipeline waits up to 7 days",
    "Lambda Invoke action: must call PutJobSuccessResult or PutJobFailureResult to resume",
    "Retry failed stage without restarting entire pipeline",
    "CloudFormation action: CREATE_UPDATE, CHANGE_SET_CREATE, CHANGE_SET_EXECUTE for IaC pipelines",
    "CodePipeline is the orchestrator; CodeBuild is the builder; CodeDeploy is the deployer",
    "Pipeline transition: can be disabled to gate at a stage (manual control point)",
  ],

  relatedServices: [
    "AWS CodeCommit",
    "AWS CodeBuild",
    "AWS CodeDeploy",
    "Amazon ECS",
    "AWS Lambda",
    "AWS Elastic Beanstalk",
    "AWS CloudFormation",
    "Amazon S3",
    "Amazon SNS",
    "Amazon EventBridge",
  ],

  examTips: [
    "Lambda Invoke action: must call PutJobSuccessResult/PutJobFailureResult — pipeline hangs otherwise.",
    "Manual Approval: SNS notification required; reviewer acts in console or API.",
    "EventBridge for source detection (not polling) for near-instant pipeline trigger.",
    "Artifacts = S3 objects — CodePipeline manages the bucket automatically.",
    "Disable pipeline transition = manual gate between stages (pause without stopping).",
    "CloudFormation stage: use CHANGE_SET_CREATE then CHANGE_SET_EXECUTE with approval in between.",
    "CodePipeline is regional — pipelines exist per region.",
    "Failed action retry: retry from stage without full re-run.",
  ],

  topicQuiz: [
    {
      question:
        "A Lambda function is invoked by a CodePipeline Lambda Invoke action. The function completes its work but the pipeline remains stuck. What is the most likely cause?",
      options: [
        "The Lambda function exceeded its memory limit",
        "The Lambda function did not call PutJobSuccessResult or PutJobFailureResult",
        "The Lambda function is in a different region from the pipeline",
        "The pipeline's S3 artifact bucket is full",
      ],
      correctIndex: 1,
      explanation:
        "CodePipeline waits for a Lambda Invoke action to call PutJobSuccessResult or PutJobFailureResult with the job ID. If the function returns without making this call, the pipeline waits indefinitely until the action times out.",
    },
    {
      question:
        "A team wants the safest way to deploy CloudFormation infrastructure changes through CodePipeline with human review. What is the recommended action sequence?",
      options: [
        "CREATE_UPDATE → deploy directly",
        "CHANGE_SET_CREATE → Manual Approval → CHANGE_SET_EXECUTE",
        "DELETE_STACK → CREATE_UPDATE",
        "Manual Approval → CREATE_UPDATE → CHANGE_SET_CREATE",
      ],
      correctIndex: 1,
      explanation:
        "The safest pattern is CHANGE_SET_CREATE (preview the changes), then a Manual Approval action (reviewer examines the change set), then CHANGE_SET_EXECUTE (apply the approved changes). This prevents accidental infrastructure changes.",
    },
    {
      question:
        "Which source detection method should be used in CodePipeline for near-instant pipeline triggers?",
      options: [
        "Polling every 60 seconds",
        "EventBridge (CloudWatch Events) detection",
        "Manual pipeline trigger from the console",
        "S3 bucket notification",
      ],
      correctIndex: 1,
      explanation:
        "EventBridge detection triggers the pipeline almost instantly when a repository change occurs. The legacy polling method checks every minute and adds unnecessary latency to the delivery cycle.",
    },
    {
      question:
        "A CodePipeline stage fails during a deploy. What is the most efficient way to resume without losing previously built artifacts?",
      options: [
        "Create a new pipeline with updated configuration",
        "Retry the failed stage directly from the pipeline execution history",
        "Re-push the source commit to re-trigger from the beginning",
        "Manually re-run the CodeBuild project",
      ],
      correctIndex: 1,
      explanation:
        "CodePipeline allows retrying a failed stage without restarting the entire pipeline. This preserves the artifacts from earlier stages and resumes from the point of failure.",
    },
    {
      question:
        "How long does a CodePipeline Manual Approval action wait before timing out if no action is taken?",
      options: ["1 day", "3 days", "7 days", "30 days"],
      correctIndex: 2,
      explanation:
        "A Manual Approval action waits up to 7 days for a reviewer to approve or reject the deployment. After 7 days with no response, the action times out and the pipeline fails.",
    },
    {
      question:
        "A team uses GitHub as the source for CodePipeline. What mechanism handles authentication to GitHub?",
      options: [
        "An IAM access key stored in Secrets Manager",
        "CodeStar Connections, which manage OAuth authentication to GitHub",
        "A bastion host in the pipeline's VPC",
        "A GitHub webhook that sends credentials to CodePipeline",
      ],
      correctIndex: 1,
      explanation:
        "CodeStar Connections provide managed OAuth connections to GitHub and other third-party providers. You configure the connection once and reference it across multiple pipelines without storing credentials.",
    },
    {
      question: "In the native AWS DevOps stack, what is CodePipeline's role?",
      options: [
        "It compiles code and runs unit tests",
        "It orchestrates the flow between CodeCommit, CodeBuild, and CodeDeploy",
        "It manages blue/green deployment strategies for EC2",
        "It stores source code in a managed Git repository",
      ],
      correctIndex: 1,
      explanation:
        "CodePipeline is the orchestrator — it ties together CodeCommit (source), CodeBuild (build/test), and CodeDeploy (deployment) into an automated delivery pipeline. Each tool is specialized; CodePipeline coordinates them.",
    },
    {
      question:
        "What is the effect of disabling a pipeline transition between two stages?",
      options: [
        "The pipeline is deleted and must be recreated",
        "The pipeline pauses at that transition, acting as a manual gate until re-enabled",
        "All artifacts between those stages are deleted",
        "The source detection stops and no new pipeline executions start",
      ],
      correctIndex: 1,
      explanation:
        "Disabling a pipeline transition pauses the flow at that point. New executions still start and proceed up to the disabled transition, but they wait there until the transition is re-enabled — acting as a manual gate.",
    },
  ],
};
