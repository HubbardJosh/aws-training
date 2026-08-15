import { ServiceGuide } from "../../types/guide";

export const codebuildGuide: ServiceGuide = {
  id: "aws-codebuild",
  service: "AWS CodeBuild",
  domain: "deployment",
  tagline: "Fully managed build service for compiling, testing, and packaging",
  intro:
    "CodeBuild is a fully managed continuous integration service that compiles source code, runs tests, and produces deployable artifacts. There are no servers to provision or maintain — CodeBuild scales automatically and you pay per build minute. It integrates with CodePipeline, GitHub Actions, and ECR for Docker builds.",

  sections: [
    {
      heading: "How CodeBuild Works",
      body: `**Build Project**: configuration defining how CodeBuild runs a build. Specifies:
- Source: CodeCommit, GitHub, S3, Bitbucket
- Environment: OS, runtime, compute type
- buildspec.yml location
- Artifacts: where to put output
- Cache: S3 or local cache for dependencies
- VPC: if build needs access to private resources
- Service role: IAM role the build runs as

**Build Run**: a single execution of a build project. Each run starts a fresh container, runs the buildspec, and terminates.

**Pay per minute**: billed per build minute based on compute type. No idle costs.

**Compute types**:
- BUILD_GENERAL1_SMALL: 3 GB RAM, 2 vCPU
- BUILD_GENERAL1_MEDIUM: 7 GB RAM, 4 vCPU
- BUILD_GENERAL1_LARGE: 15 GB RAM, 8 vCPU
- BUILD_GENERAL1_XLARGE / 2XLARGE: for heavy workloads
- ARM-based: ARM_LAMBDA_1GB, etc.

**Concurrent builds**: by default, builds run concurrently. Configure concurrency limit per project or account.`,
    },
    {
      heading: "buildspec.yml",
      body: `The **buildspec.yml** is a YAML file at the root of your source that defines build commands.

\`\`\`yaml
version: 0.2

env:
  variables:
    NODE_ENV: production
  parameter-store:
    DB_URL: /myapp/db-url
  secrets-manager:
    API_KEY: MyApp/ApiKey:api_key

phases:
  install:
    runtime-versions:
      nodejs: 20
    commands:
      - npm ci
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_URI
  build:
    commands:
      - npm run test
      - npm run build
      - docker build -t $IMAGE_TAG .
      - docker push $IMAGE_TAG
  post_build:
    commands:
      - echo Build completed

artifacts:
  files:
    - '**/*'
  base-directory: dist
  discard-paths: no

cache:
  paths:
    - node_modules/**/*
\`\`\`

**Phases**: install → pre_build → build → post_build. If any phase fails, subsequent phases don't run.

**finally block**: commands that always run, even if the phase fails (for cleanup).

**env.secrets-manager**: fetch secrets at build time. Service role needs GetSecretValue.

**runtime-versions**: specify language runtime version (nodejs, python, java, etc.).`,
    },
    {
      heading: "Environment & Images",
      body: `**Managed images**: AWS-provided Docker images with common runtimes pre-installed:
- aws/codebuild/standard:7.0 (Ubuntu 22.04, latest runtimes)
- Includes: Node.js, Python, Java, Go, Ruby, .NET, PHP, Docker

**Custom images**: use your own Docker image from ECR or Docker Hub. Full control over the build environment. Required for specialized tools or specific versions not in managed images.

**Environment variables**:
- Plaintext: set directly in project or buildspec (visible in logs/console)
- SSM Parameter Store: reference as \`/myapp/param-name\` in env.parameter-store
- Secrets Manager: reference as \`SecretName:json-key\` in env.secrets-manager
- Variables from CodePipeline: CodePipeline can pass variables to CodeBuild actions

**Docker support**: CodeBuild supports Docker builds. Enable privileged mode in the build environment (required to run Docker daemon inside build container). Push images to ECR using the build service role.

**Local builds**: run CodeBuild builds locally using CodeBuild Local. Useful for debugging buildspec without committing and triggering a build.`,
    },
    {
      heading: "Artifacts & Cache",
      body: `**Artifacts**: output files from a successful build. Uploaded to S3. Defined in buildspec:
\`\`\`yaml
artifacts:
  files:
    - target/myapp.jar
    - '**/*.zip'
  base-directory: build/output
  name: build-$(date +%Y-%m-%d)
\`\`\`

**Secondary artifacts**: produce multiple artifact outputs from a single build (e.g. test reports, build artifacts, lambda packages).

**S3 artifacts encryption**: artifacts can be encrypted with KMS.

**Cache**: store dependencies between builds to reduce build time.
- **S3 cache**: upload/download dependency directories to S3 between builds. Slower but persistent across different build hosts.
- **Local cache**: faster, stored on the build host. Useful for same-host sequential builds. Types: LOCAL_SOURCE_CACHE, LOCAL_DOCKER_LAYER_CACHE, LOCAL_CUSTOM_CACHE.

**Test reports**: CodeBuild can publish test results (JUnit XML format) to CodeBuild test reports. View pass/fail, trends, test duration in console.`,
    },
    {
      heading: "VPC & Security",
      body: `**VPC access**: run CodeBuild in a VPC to access resources in private subnets (RDS, ElastiCache, internal services). Configure VPC, subnets, and security groups on the build project.

**Service role**: IAM role assumed by the CodeBuild service. Must grant permissions for:
- S3: artifact uploads, cache
- CloudWatch Logs: build logs
- ECR: pull base images, push built images
- Secrets Manager / SSM: fetch secrets/parameters
- Any AWS service the build interacts with

**Security best practices**:
- Avoid storing secrets in plaintext environment variables — use SSM or Secrets Manager
- Use least-privilege service roles
- Enable CloudTrail for build audit

**CodeBuild + Secrets Manager**: reference secrets in buildspec env section. Secrets injected as environment variables at build time. Not visible in plain text in the console.

**Build badges**: public status badge (passing/failing) embeddable in README files. Shows current build status.`,
    },
    {
      heading: "CodeBuild with Other Services",
      body: `**CodeBuild + CodePipeline**: CodePipeline invokes CodeBuild in the Build stage. CodePipeline passes source artifact as input; CodeBuild returns build artifact as output.

**CodeBuild + ECR**: build Docker images and push to ECR. Enable privileged mode. Service role needs ECR push permissions (\`ecr:BatchCheckLayerAvailability\`, \`ecr:InitiateLayerUpload\`, \`ecr:PutImage\`, etc.).

**CodeBuild + GitHub**: connect via CodeStar connection or OAuth. Webhook triggers build on push/PR. Can run tests on PRs before merge.

**CodeBuild + CloudWatch Logs**: all build output streamed to CloudWatch Logs in real time. Log group per build project. Useful for debugging failed builds.

**CodeBuild + S3**: pull source from S3 (ZIP file); push artifacts to S3.

**CodeBuild + Lambda**: build Lambda deployment packages. Zip code + dependencies → upload to S3 → deploy via CodeDeploy or SAM.

**CodeBuild + SonarQube / third-party**: install and run static analysis tools in build phases. Fail build if quality gate fails.`,
    },
  ],

  keyFacts: [
    "Pay per build minute, per compute type — no idle cost",
    "buildspec.yml phases: install → pre_build → build → post_build",
    "Privileged mode required for Docker builds inside CodeBuild",
    "Secrets in buildspec: use env.secrets-manager or env.parameter-store (not plaintext)",
    "VPC mode: enables build access to private subnets (RDS, ElastiCache)",
    "Local cache: faster (same host). S3 cache: persistent across hosts.",
    "Test reports: publish JUnit XML results; view pass/fail trends in console",
    "Service role: grants CodeBuild permissions (S3, ECR, CloudWatch Logs, Secrets Manager)",
    "Custom Docker image: use own image from ECR/Docker Hub for specialized environments",
    "Build badge: embeddable SVG showing current build status for repo README",
  ],

  relatedServices: [
    "AWS CodePipeline",
    "AWS CodeDeploy",
    "Amazon ECR",
    "Amazon S3",
    "AWS Secrets Manager",
    "AWS Systems Manager",
    "Amazon CloudWatch",
    "Amazon VPC",
    "AWS IAM",
  ],

  examTips: [
    "Privileged mode: required to run Docker daemon inside CodeBuild (Docker-in-Docker).",
    "buildspec.yml must be at repo root or specify path in build project config.",
    "Plaintext env vars visible in console — use SSM Parameter Store or Secrets Manager instead.",
    "VPC: build project in VPC to access private resources like RDS/ElastiCache.",
    "Test reports: JUnit XML output → CodeBuild parses → shows trends in console.",
    "Cache reduces build time but is not guaranteed (builds are ephemeral).",
    "Phases: if install fails, pre_build/build/post_build don't run.",
    "Service role needs ECR permissions for Docker image push (not just CodeBuild trust).",
  ],
};
