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
      body: `A **build project** is the configuration that tells CodeBuild how to run a build. It specifies where your source code lives (CodeCommit, GitHub, Bitbucket, or S3), which compute environment to use, where your buildspec lives, where to put build artifacts, and what IAM role the build runs as. When you trigger a **build run**, CodeBuild starts a fresh container, fetches your source, executes the buildspec, and terminates — leaving no persistent state between runs.

Billing is per build minute, based on the compute type you select. Build types range from small (3 GB RAM, 2 vCPU) through medium (7 GB) and large (15 GB) to extra-large configurations for compute-intensive workloads, as well as ARM-based options. Since each build starts a new container and you're billed only while it runs, there are no idle costs — a significant advantage over maintaining dedicated build servers.

Multiple builds can run concurrently by default. CodeBuild scales automatically to handle parallel builds from multiple developers or pipeline stages. You can configure concurrency limits per project or per account to prevent runaway build costs.`,
    },
    {
      heading: "buildspec.yml",
      body: `The **buildspec.yml** file at the root of your repository is the instruction set CodeBuild follows. It defines environment variables, build phases, artifact packaging, and caching.

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

Phases run in order: \`install\` → \`pre_build\` → \`build\` → \`post_build\`. If any phase fails, subsequent phases are skipped — but a \`finally\` block within a phase always runs even on failure, which is useful for cleanup. The \`env.parameter-store\` and \`env.secrets-manager\` sections fetch values from SSM or Secrets Manager at build time and inject them as environment variables, keeping secrets out of source control. The \`runtime-versions\` block under \`install\` specifies which language runtime version to use for the build.`,
    },
    {
      heading: "Environment & Images",
      body: `CodeBuild's managed images come pre-installed with common runtimes and tools. The \`aws/codebuild/standard:7.0\` image (Ubuntu 22.04) includes Node.js, Python, Java, Go, Ruby, .NET, PHP, and Docker — it's the standard choice for most builds. When you need a tool or runtime version not available in managed images, you can specify a custom Docker image from ECR or Docker Hub and CodeBuild will use it as the build environment.

**Docker builds** require a special consideration: to run the Docker daemon inside a CodeBuild container (Docker-in-Docker), you must enable **privileged mode** in the build project's environment settings. Without privileged mode, Docker commands will fail. The CodeBuild service role needs ECR permissions to pull your base images and push built images.

Environment variables can be set at three levels: **plaintext** variables embedded in the project or buildspec (visible in the console — never use for secrets), **SSM Parameter Store** references (fetched securely at build time), and **Secrets Manager** references (also fetched at build time). CodePipeline can also pass variables to CodeBuild actions, enabling dynamic per-execution configuration. For debugging buildspec issues locally before committing, CodeBuild Local lets you run builds on your development machine using Docker.`,
    },
    {
      heading: "Artifacts & Cache",
      body: `Build **artifacts** are the files CodeBuild produces — a JAR, a ZIP, a compiled binary, or a set of static files. You define which files to include in the artifacts section of your buildspec, and CodeBuild uploads them to S3 on success. The \`base-directory\` setting lets you specify a subdirectory as the artifact root so you don't accidentally include source files in the output. You can also configure **secondary artifacts** to produce multiple distinct output packages from a single build run — useful for producing a test report alongside the deployment package.

\`\`\`yaml
artifacts:
  files:
    - target/myapp.jar
    - '**/*.zip'
  base-directory: build/output
  name: build-$(date +%Y-%m-%d)
\`\`\`

**Caching** dramatically reduces build times by preserving dependency directories between builds. S3 caching uploads your \`node_modules\` or \`~/.m2\` directory to S3 at the end of a build and downloads it at the start of the next — slower because it crosses the network, but persistent across different build hosts. Local caching is faster but only works when the same build host is reused across sequential builds.

**Test reports** give you a visual view of test results in the CodeBuild console. If your test framework produces JUnit XML output, configure CodeBuild to collect it and you get pass/fail counts, trend charts, and individual test durations over time — without needing a separate test reporting tool.`,
    },
    {
      heading: "VPC & Security",
      body: `By default, CodeBuild builds run outside any VPC. If your build needs to access resources in private subnets — a private RDS database for integration tests, an internal npm registry, or an ElastiCache cluster — configure the build project to run inside a VPC by specifying the VPC, subnets, and security groups. CodeBuild creates ENIs in your subnets for the duration of the build.

The **service role** is the IAM role that CodeBuild assumes during the build. It needs permissions for everything the build does: S3 (to read source and write artifacts), CloudWatch Logs (to stream build output), ECR (to pull base images and push built images), and any other AWS service the build interacts with. Secrets Manager and SSM permissions are needed if the buildspec references secrets or parameters. Use least-privilege principles — only grant the permissions actually needed.

Storing secrets as plaintext environment variables is a common mistake. They're visible in the CodeBuild console and in CloudWatch Logs output. Instead, always reference secrets through \`env.secrets-manager\` or \`env.parameter-store\` in the buildspec, which fetches them at build time and doesn't expose the values in logs. Enable CloudTrail to audit which builds ran, who triggered them, and what configuration was used.`,
    },
    {
      heading: "CodeBuild with Other Services",
      body: `In a typical CI/CD pipeline, **CodePipeline invokes CodeBuild** in the Build stage. CodePipeline passes the source artifact (the code from the Source stage) as input, CodeBuild compiles and tests it, and the output artifact (the deployment package) flows to the Deploy stage. This separation of concerns — CodePipeline orchestrates, CodeBuild builds — is the standard pattern for AWS-native CI/CD.

**CodeBuild + ECR** is the standard pattern for containerized applications. The build compiles code, runs tests, builds a Docker image, and pushes it to ECR — all in one build run. The \`docker push\` command uses the CodeBuild service role's ECR permissions, so no separate credentials management is needed.

**CodeBuild + GitHub** via CodeStar connections or OAuth enables builds triggered by pull requests. This lets you run tests automatically on every PR, blocking merges if tests fail. Build status is reported back to GitHub's PR interface.

All CodeBuild build output is streamed to **CloudWatch Logs** in real time. Each build project gets its own log group, and each build run gets its own log stream. This makes debugging a failed build straightforward — you can tail the logs from the console or CLI, or use Logs Insights to search across multiple build runs.`,
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
