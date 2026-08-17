import { ServiceGuide } from "../../types/guide";

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
    },
    {
      heading: "Source Stage",
      body: `The Source stage defines where CodePipeline watches for changes and what it fetches. The detection method matters significantly for pipeline responsiveness. **EventBridge (CloudWatch Events) detection** triggers the pipeline nearly instantly when a repository change occurs — this is the recommended approach. The legacy **polling** method checks for changes every minute and adds avoidable latency.

**CodeCommit** triggers on branch pushes. **GitHub** and **GitHub Enterprise** connect via OAuth or a GitHub App (using CodeStar Connections) and can trigger on push events or pull request creation. **S3** as a source triggers when a new object version is uploaded to a specific key — object versioning must be enabled on the bucket. **Bitbucket** and **GitLab** connect via CodeStar connections, which are managed connections to third-party providers that handle authentication once for use across multiple pipelines.

The source action produces an output artifact containing the source code as a ZIP file. This artifact flows to the Build stage and is the starting point for the entire pipeline's data flow.`,
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
    },
    {
      heading: "Deploy Stage",
      body: `The Deploy stage has the widest variety of providers because "deployment" means something different depending on your stack.

**CodeDeploy** handles deployments to EC2, Lambda, and ECS with full support for in-place, rolling, and blue/green strategies. **ECS (direct)** updates an ECS service with a new task definition revision using a rolling update — no CodeDeploy needed for rolling, but CodeDeploy is required for blue/green ECS. **Elastic Beanstalk** receives a new application version and deploys it to a Beanstalk environment using whatever deployment policy the environment is configured with.

**CloudFormation** is the deploy provider for infrastructure-as-code pipelines. The most important CloudFormation actions are \`CREATE_UPDATE\` (directly creates or updates a stack), \`CHANGE_SET_CREATE\` (creates a change set for review), and \`CHANGE_SET_EXECUTE\` (executes an approved change set). Splitting change set creation and execution across stages with a manual Approval action in between is the safest pattern for infrastructure changes.

The **Manual Approval** action pauses the pipeline and sends an SNS notification to reviewers. Reviewers then approve or reject the deployment through the console or via the API. The pipeline waits up to 7 days for a response before timing out.

The **Lambda Invoke** action invokes a Lambda function at any point in the pipeline — useful for custom validation logic, smoke tests, notifications, or any operation that doesn't fit another action type. The Lambda function **must** call \`PutJobSuccessResult\` or \`PutJobFailureResult\` with the job ID it receives; otherwise, the pipeline will wait indefinitely until it times out.`,
    },
    {
      heading: "Notifications & Monitoring",
      body: `CodePipeline integrates with several monitoring and notification systems. **Notification rules** send SNS messages when pipeline execution state changes — pipeline starts, succeeds, fails, or reaches an action requiring manual approval. These are configured per pipeline and can target SNS topics (which fan out to email, SMS, or Lambda).

Because CodePipeline emits state change events to **EventBridge**, you can build more sophisticated response workflows. When a pipeline fails, an EventBridge rule can trigger a Lambda function that posts to Slack, opens a ticket, or sends a PagerDuty alert. The event contains the pipeline name, stage name, action name, and failure reason, giving you enough context to build useful notifications.

**CloudTrail** records all CodePipeline API calls, providing an audit trail of who created, modified, and triggered pipelines. For debugging, the CodePipeline console shows a visual execution history — you can click into any execution, see each action's status, and retry failed stages without restarting the entire pipeline.`,
    },
    {
      heading: "CodePipeline with Other Services",
      body: `The native AWS DevOps stack is **CodeCommit → CodeBuild → CodeDeploy** orchestrated by CodePipeline. Each tool is specialized: CodeCommit is the source repository, CodeBuild compiles and tests, CodeDeploy manages deployment strategies, and CodePipeline ties them together. For teams using GitHub, the pattern shifts to GitHub as the source with CodeStar connections, but CodeBuild and CodeDeploy remain the same.

For containerized applications, a common modern pattern is **GitHub → CodeBuild → ECS**: CodeBuild builds a Docker image and pushes it to ECR, then the pipeline updates the ECS service with the new image digest. The ECS deploy action handles the rolling update, or CodeDeploy handles blue/green if that's required.

**Infrastructure pipelines** use CloudFormation as the deploy provider. A typical pattern: code change triggers pipeline, CodeBuild validates the template (using \`cfn-lint\`), a CloudFormation action creates a change set, a Manual Approval action lets a team member review the change set in the CloudFormation console, and a second CloudFormation action executes the approved change set. This gives you safe, auditable infrastructure changes with human review before any resource is modified.

For static websites, a **S3 + CloudFront** pipeline builds the frontend with CodeBuild, uploads the artifacts to S3, and uses a Lambda Invoke action to invalidate the CloudFront cache — giving you an automated, zero-downtime frontend deployment workflow.`,
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
};
