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
      body: `A **pipeline** is a series of **stages**. Each stage has one or more **actions**. Actions in a stage can run in parallel or sequentially.

**Stages**: logical groupings (e.g. Source, Build, Test, Deploy, Approval).

**Actions**: the actual work. Each action has:
- Category: Source, Build, Test, Deploy, Invoke, Approval
- Provider: CodeCommit, GitHub, S3, CodeBuild, CodeDeploy, ECS, Lambda, CloudFormation, Elastic Beanstalk, etc.
- Input/output artifacts: files passed between stages (stored in S3)

**Artifacts**: files produced by one action and consumed by the next. Stored in an S3 bucket (CodePipeline manages this). Example: source code → build output → deployment package.

**Pipeline transitions**: connections between stages. Can be disabled to pause the pipeline at a stage (useful for manual gates).

**Execution**: each code change triggers one execution. If a new change arrives while one is in progress, CodePipeline can queue it (superceded mode) or run them in parallel (queued mode).`,
    },
    {
      heading: "Source Stage",
      body: `**Source providers**:
- **CodeCommit**: AWS-managed Git repository. Triggers on branch push.
- **GitHub / GitHub Enterprise**: OAuth or GitHub App connection. Trigger on push or PR.
- **S3**: trigger when a new object version is uploaded (object versioning must be enabled).
- **Bitbucket, GitLab**: via CodeStar connections.

**Detection method**:
- CloudWatch Events (EventBridge): recommended. Near-instant trigger when repo changes.
- Polling: CodePipeline polls the source every minute (legacy, not recommended).

**Source output artifact**: the source code zip uploaded to S3. Passed to the Build stage.

**CodeStar Connections**: manage connections to third-party source providers (GitHub, Bitbucket, GitLab) from AWS. Auth handled once; used by multiple pipelines.`,
    },
    {
      heading: "Build Stage (CodeBuild)",
      body: `CodeBuild is the most common build action. It compiles, tests, and packages code.

**Input**: source artifact from Source stage.
**Output**: build output artifact (JAR, ZIP, Docker image, etc.).

**buildspec.yml**: YAML file in repo root (or inline in CodeBuild project) defining build commands:
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

**Cache**: CodeBuild can cache dependencies in S3 or locally to speed up builds.

**Environment**: select managed image (Ubuntu, Amazon Linux) or custom Docker image from ECR. Set environment variables (plain or from SSM/Secrets Manager).

**Concurrent builds**: multiple builds can run simultaneously. Configure concurrency limits.`,
    },
    {
      heading: "Deploy Stage",
      body: `**CodeDeploy**: deploy to EC2, Lambda, or ECS. Supports in-place and blue/green strategies.

**ECS (direct)**: update ECS service with new task definition (rolling update). No CodeDeploy required for rolling. Use CodeDeploy for blue/green ECS.

**Lambda**: deploy new function version. CodeDeploy shifts traffic between aliases (canary, linear, all-at-once).

**Elastic Beanstalk**: deploy new application version to an environment.

**CloudFormation**: deploy or update a CloudFormation stack. Actions: CREATE_UPDATE, DELETE_ONLY, REPLACE_ON_FAILURE, CHANGE_SET_EXECUTE. Used for infrastructure-as-code pipelines.

**S3**: upload artifact to S3 bucket (for static website deployments via CloudFront + S3).

**Approval Action**: manual approval step. CodePipeline sends SNS notification. Reviewer approves or rejects in console or via API. Pipeline waits up to 7 days.

**Lambda Action (Invoke)**: invoke a Lambda function from within the pipeline. Use for custom logic: smoke tests, notifications, conditional gates. Lambda must call \`PutJobSuccessResult\` or \`PutJobFailureResult\` to continue/fail the pipeline.`,
    },
    {
      heading: "Notifications & Monitoring",
      body: `**Pipeline notifications**: configure notification rules to send SNS messages on pipeline events (start, success, failure, approval needed).

**CloudWatch Events (EventBridge)**: pipeline state changes emit events. Trigger Lambda, Step Functions, or other targets. Example: on pipeline failure → trigger a Lambda that posts to Slack.

**CloudTrail**: all CodePipeline API calls logged in CloudTrail for audit.

**CloudWatch Metrics**: pipeline execution metrics (PipelineExecutionAttempts, SucceededPipelineExecutions, FailedPipelineExecutions) available per pipeline.

**Retry**: failed actions can be retried from the failed stage without restarting the whole pipeline.`,
    },
    {
      heading: "CodePipeline with Other Services",
      body: `**CodePipeline + CodeCommit + CodeBuild + CodeDeploy**: the native AWS DevOps stack. Full CI/CD without leaving AWS. CodeCommit as SCM → CodeBuild for build/test → CodeDeploy for deployment.

**CodePipeline + GitHub + CodeBuild + ECS**: common modern pattern. GitHub for source, CodeBuild for Docker build and ECR push, ECS service update for deployment.

**CodePipeline + CloudFormation**: infrastructure pipeline. Code change → CloudFormation change set → manual approval → execute change set → infrastructure updated.

**CodePipeline + Lambda (Invoke action)**: custom gates, smoke tests, notifications within the pipeline. Lambda checks external system, sends notification, or validates deployment.

**CodePipeline + Elastic Beanstalk**: simplest deployment. Developer pushes code → pipeline deploys to Beanstalk environment automatically.

**CodePipeline + S3 + CloudFront**: static site deployment. Build output → S3 → invalidate CloudFront cache via Lambda action.`,
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
