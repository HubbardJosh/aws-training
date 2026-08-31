import { ServiceGuide } from "../../../types/guide";

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
      quiz: [
        {
          question: "How is CodeBuild billed?",
          options: [
            "Per month per build project, regardless of usage",
            "Per artifact uploaded to S3",
            "Per build minute based on the compute type selected",
            "Per line of code compiled",
          ],
          correctIndex: 2,
          explanation:
            "CodeBuild is billed per build minute based on the compute type (small, medium, large, etc.). Since each build starts a fresh container and terminates when done, there are no idle costs — you only pay while a build is actually running.",
        },
        {
          question: "What happens to state between CodeBuild build runs?",
          options: [
            "There is no persistent state — each build starts in a fresh container",
            "State is preserved in EFS mounts shared across builds",
            "State is persisted in the build project's S3 cache bucket",
            "State is stored in the CodeBuild build history for 90 days",
          ],
          correctIndex: 0,
          explanation:
            "Each CodeBuild build run starts in a fresh container. There is no persistent state between runs — the container is created at the start and terminated at the end. This ensures reproducible builds but means dependencies must be installed each time (or cached via S3/local cache).",
        },
      ],
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
      quiz: [
        {
          question: "What is the correct order of buildspec.yml phases?",
          options: [
            "pre_build → install → build → post_build",
            "install → pre_build → build → post_build",
            "build → install → pre_build → post_build",
            "install → build → pre_build → post_build",
          ],
          correctIndex: 1,
          explanation:
            "The buildspec.yml phases run in order: install → pre_build → build → post_build. If any phase fails, subsequent phases are skipped. A 'finally' block within a phase runs even on failure, which is useful for cleanup tasks.",
        },
        {
          question:
            "How should database passwords and API keys be provided to a CodeBuild build?",
          options: [
            "Via env.parameter-store or env.secrets-manager in buildspec.yml",
            "Via a .env file committed to the source repository",
            "As plaintext environment variables in the build project configuration",
            "Hardcoded in the buildspec.yml file in the repository",
          ],
          correctIndex: 0,
          explanation:
            "Secrets should be referenced via env.parameter-store (SSM Parameter Store) or env.secrets-manager (Secrets Manager) in buildspec.yml. These are fetched securely at build time. Plaintext env vars are visible in the CodeBuild console and CloudWatch Logs, and should never be used for secrets.",
        },
        {
          question:
            "What does the 'runtime-versions' block in the install phase of buildspec.yml specify?",
          options: [
            "The CodeBuild agent version to use for the build",
            "Which language runtime version (e.g., nodejs: 20) to use during the build",
            "The minimum and maximum compute sizes allowed for the build",
            "The AWS SDK version injected into the build environment",
          ],
          correctIndex: 1,
          explanation:
            "The runtime-versions block in the install phase specifies which language runtime version CodeBuild should use, such as nodejs: 20 or python: 3.11. This controls the runtime available in the build environment.",
        },
      ],
    },
    {
      heading: "Environment & Images",
      body: `CodeBuild's managed images come pre-installed with common runtimes and tools. The \`aws/codebuild/standard:7.0\` image (Ubuntu 22.04) includes Node.js, Python, Java, Go, Ruby, .NET, PHP, and Docker — it's the standard choice for most builds. When you need a tool or runtime version not available in managed images, you can specify a custom Docker image from ECR or Docker Hub and CodeBuild will use it as the build environment.

**Docker builds** require a special consideration: to run the Docker daemon inside a CodeBuild container (Docker-in-Docker), you must enable **privileged mode** in the build project's environment settings. Without privileged mode, Docker commands will fail. The CodeBuild service role needs ECR permissions to pull your base images and push built images.

Environment variables can be set at three levels: **plaintext** variables embedded in the project or buildspec (visible in the console — never use for secrets), **SSM Parameter Store** references (fetched securely at build time), and **Secrets Manager** references (also fetched at build time). CodePipeline can also pass variables to CodeBuild actions, enabling dynamic per-execution configuration. For debugging buildspec issues locally before committing, CodeBuild Local lets you run builds on your development machine using Docker.`,
      quiz: [
        {
          question:
            "What must be enabled in a CodeBuild project to run Docker commands (Docker-in-Docker)?",
          options: [
            "VPC mode with a private subnet",
            "Extended compute mode",
            "Custom Docker image from ECR",
            "Privileged mode in the environment settings",
          ],
          correctIndex: 3,
          explanation:
            "Privileged mode must be enabled in the CodeBuild environment settings to run the Docker daemon inside a CodeBuild container. Without it, Docker commands will fail with permission errors. This is required for building and pushing Docker images from CodeBuild.",
        },
        {
          question:
            "A developer wants to use a specific version of a build tool not available in CodeBuild's managed images. What is the correct approach?",
          options: [
            "Use a custom Docker image from ECR or Docker Hub as the build environment",
            "Use CodeBuild Local to install the tool and sync it to the cloud environment",
            "Request AWS to add the tool to the next managed image release",
            "Install the tool in the install phase of buildspec.yml using apt-get",
          ],
          correctIndex: 0,
          explanation:
            "When a required tool or runtime version isn't available in CodeBuild's managed images, specify a custom Docker image from ECR or Docker Hub in the build project's environment settings. CodeBuild will use that image as the build container. You can also install tools in the install phase, but a custom image is more reliable for complex dependencies.",
        },
      ],
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
      quiz: [
        {
          question:
            "What is the difference between S3 caching and local caching in CodeBuild?",
          options: [
            "S3 caching is free; local caching has additional costs",
            "Local caching supports Docker layers; S3 caching supports dependency directories only",
            "S3 caching is faster; local caching persists across different build hosts",
            "S3 caching persists across different build hosts; local caching is faster but only works when the same host is reused",
          ],
          correctIndex: 3,
          explanation:
            "S3 caching uploads dependency directories (like node_modules) to S3 and downloads them at the start of the next build — persistent across any build host but slower due to network transfer. Local caching is faster since it's on-host storage, but only works when CodeBuild reuses the same build host.",
        },
        {
          question:
            "What type of test output does CodeBuild's Test Reports feature require?",
          options: [
            "Plain text log output",
            "JSON-formatted test results",
            "HTML test reports uploaded to S3",
            "JUnit XML output from the test framework",
          ],
          correctIndex: 3,
          explanation:
            "CodeBuild Test Reports parse JUnit XML output from test frameworks. Configure the reports section of buildspec.yml to point to your JUnit XML files, and CodeBuild shows pass/fail counts, trend charts, and individual test durations in the console.",
        },
      ],
    },
    {
      heading: "VPC & Security",
      body: `By default, CodeBuild builds run outside any VPC. If your build needs to access resources in private subnets — a private RDS database for integration tests, an internal npm registry, or an ElastiCache cluster — configure the build project to run inside a VPC by specifying the VPC, subnets, and security groups. CodeBuild creates ENIs in your subnets for the duration of the build.

The **service role** is the IAM role that CodeBuild assumes during the build. It needs permissions for everything the build does: S3 (to read source and write artifacts), CloudWatch Logs (to stream build output), ECR (to pull base images and push built images), and any other AWS service the build interacts with. Secrets Manager and SSM permissions are needed if the buildspec references secrets or parameters. Use least-privilege principles — only grant the permissions actually needed.

Storing secrets as plaintext environment variables is a common mistake. They're visible in the CodeBuild console and in CloudWatch Logs output. Instead, always reference secrets through \`env.secrets-manager\` or \`env.parameter-store\` in the buildspec, which fetches them at build time and doesn't expose the values in logs. Enable CloudTrail to audit which builds ran, who triggered them, and what configuration was used.`,
      quiz: [
        {
          question:
            "Why would you configure a CodeBuild project to run inside a VPC?",
          options: [
            "To access private resources like RDS databases or internal registries in private subnets",
            "To enable privileged mode for Docker builds",
            "To allow builds to run in multiple AWS regions simultaneously",
            "To reduce build costs by using private networking",
          ],
          correctIndex: 0,
          explanation:
            "By default, CodeBuild runs outside any VPC. Configuring VPC mode lets the build access private resources in your subnets — such as a private RDS database for integration tests, an internal package registry, or an ElastiCache cluster. CodeBuild creates ENIs in the specified subnets for network connectivity.",
        },
        {
          question:
            "What IAM permissions does the CodeBuild service role need to push a Docker image to ECR?",
          options: [
            "No permissions needed — CodeBuild has built-in ECR access",
            "ECR permissions must be explicitly added to the service role (ecr:GetAuthorizationToken, ecr:BatchCheckLayerAvailability, ecr:PutImage, etc.)",
            "The service role only needs s3:PutObject for artifact uploads",
            "ECR access is granted automatically when privileged mode is enabled",
          ],
          correctIndex: 1,
          explanation:
            "The CodeBuild service role must explicitly include ECR permissions to pull base images and push built images. Required actions include ecr:GetAuthorizationToken, ecr:BatchCheckLayerAvailability, ecr:InitiateLayerUpload, ecr:UploadLayerPart, ecr:CompleteLayerUpload, and ecr:PutImage. These are not granted automatically.",
        },
      ],
    },
    {
      heading: "CodeBuild with Other Services",
      body: `In a typical CI/CD pipeline, **CodePipeline invokes CodeBuild** in the Build stage. CodePipeline passes the source artifact (the code from the Source stage) as input, CodeBuild compiles and tests it, and the output artifact (the deployment package) flows to the Deploy stage. This separation of concerns — CodePipeline orchestrates, CodeBuild builds — is the standard pattern for AWS-native CI/CD.

**CodeBuild + ECR** is the standard pattern for containerized applications. The build compiles code, runs tests, builds a Docker image, and pushes it to ECR — all in one build run. The \`docker push\` command uses the CodeBuild service role's ECR permissions, so no separate credentials management is needed.

**CodeBuild + GitHub** via CodeStar connections or OAuth enables builds triggered by pull requests. This lets you run tests automatically on every PR, blocking merges if tests fail. Build status is reported back to GitHub's PR interface.

All CodeBuild build output is streamed to **CloudWatch Logs** in real time. Each build project gets its own log group, and each build run gets its own log stream. This makes debugging a failed build straightforward — you can tail the logs from the console or CLI, or use Logs Insights to search across multiple build runs.`,
      quiz: [
        {
          question:
            "In a CodePipeline + CodeBuild integration, what does CodePipeline pass to CodeBuild?",
          options: [
            "The IAM credentials for the build to use",
            "The CloudFormation template for the deployment",
            "The buildspec.yml file directly",
            "The source artifact (source code ZIP) as input to the CodeBuild action",
          ],
          correctIndex: 3,
          explanation:
            "CodePipeline passes the source artifact — the source code ZIP produced by the Source stage — as input to the CodeBuild action. CodeBuild compiles and tests the code and produces an output artifact (deployment package) that flows to the Deploy stage.",
        },
        {
          question:
            "Where is all CodeBuild build output streamed for real-time debugging?",
          options: [
            "CloudWatch Logs — each build project has its own log group and each run has its own log stream",
            "S3 bucket configured in the build project",
            "CodeBuild build history stored for 90 days in the CodeBuild console",
            "An SNS topic configured in the build project notifications",
          ],
          correctIndex: 0,
          explanation:
            "All CodeBuild build output is streamed to CloudWatch Logs in real time. Each build project gets a dedicated log group, and each build run gets its own log stream. You can view logs in the console, tail them via the CLI, or use CloudWatch Logs Insights to search across multiple build runs.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A developer runs 'docker build' in a CodeBuild build and receives a 'Cannot connect to the Docker daemon' error. What is the most likely cause?",
      options: [
        "Privileged mode is not enabled in the build project's environment settings",
        "The buildspec.yml is missing the pre_build phase",
        "The CodeBuild service role lacks ECR permissions",
        "The build is running in VPC mode, which blocks Docker access",
      ],
      correctIndex: 0,
      explanation:
        "Running Docker commands inside CodeBuild requires privileged mode to be enabled in the build project's environment settings. Without it, the Docker daemon cannot start inside the container and Docker commands fail with the 'Cannot connect to the Docker daemon' error.",
    },
    {
      question:
        "A team stores their database password as a plaintext environment variable in a CodeBuild project. What is the risk?",
      options: [
        "The password will be rotated automatically by Secrets Manager, breaking the build",
        "Plaintext environment variables are not supported in buildspec.yml",
        "The password is visible in the CodeBuild console and in CloudWatch Logs build output",
        "The password will be included in the build artifact uploaded to S3",
      ],
      correctIndex: 2,
      explanation:
        "Plaintext environment variables in CodeBuild are visible in the console and can appear in CloudWatch Logs. Use env.secrets-manager or env.parameter-store in buildspec.yml to securely fetch secrets at build time without exposing them in logs or the console.",
    },
    {
      question:
        "A CI/CD pipeline needs CodeBuild to run integration tests against a private RDS database in a private subnet. What configuration is required?",
      options: [
        "Configure the CodeBuild project to run in VPC mode, specifying the VPC, private subnets, and security groups",
        "Create a VPC Endpoint for RDS and configure CodeBuild to use it",
        "Enable privileged mode and grant the service role RDS permissions",
        "Use a NAT Gateway in the VPC and configure CodeBuild to route through it",
      ],
      correctIndex: 0,
      explanation:
        "VPC mode must be configured in the CodeBuild project to access private resources. You specify the VPC, subnets, and security groups — CodeBuild then creates ENIs in those subnets, giving the build network access to private resources like RDS.",
    },
    {
      question:
        "After a CodeBuild deployment, test failures are difficult to investigate because all builds share the same log group. What is a developer's best option for investigating a specific failed build?",
      options: [
        "Enable X-Ray tracing on the CodeBuild project",
        "View the specific build run's log stream in CloudWatch Logs — each run gets its own log stream",
        "Download the build artifacts from S3 and inspect the embedded logs",
        "Enable detailed monitoring on the CodeBuild project",
      ],
      correctIndex: 1,
      explanation:
        "Each CodeBuild build run creates its own CloudWatch Logs log stream within the project's log group. Navigate to the specific run's log stream to see only that build's output, making it easy to investigate failures for a particular execution.",
    },
    {
      question:
        "A build that installs npm packages takes 4 minutes. Most of the time is spent downloading node_modules. How can build time be reduced?",
      options: [
        "Configure S3 caching in buildspec.yml to cache the node_modules directory between builds",
        "Use the install phase to skip npm install when node_modules already exists",
        "Switch to a custom Docker image with node_modules pre-installed",
        "Increase the compute type to large for faster network speeds",
      ],
      correctIndex: 0,
      explanation:
        "S3 caching in buildspec.yml saves specified directories (like node_modules/**/*) to S3 at the end of a build and restores them at the start of the next. This avoids re-downloading dependencies on every build, significantly reducing build time when package.json hasn't changed.",
    },
    {
      question:
        "Which CodeBuild feature allows developers to test buildspec.yml changes locally before pushing to a repository?",
      options: [
        "CodePipeline manual approval with a test stage",
        "CodeBuild dry-run mode",
        "Inline buildspec testing in the CodeBuild console",
        "CodeBuild Local — runs builds locally using Docker",
      ],
      correctIndex: 3,
      explanation:
        "CodeBuild Local allows developers to run the CodeBuild agent locally using Docker. This enables testing buildspec.yml changes on a developer's machine before committing, avoiding unnecessary build failures in the actual CodeBuild service.",
    },
    {
      question:
        "A build produces two outputs: a deployment JAR and a test coverage report. How can both be delivered from a single build run?",
      options: [
        "Run two separate CodeBuild builds — one for each output",
        "Configure secondary artifacts in buildspec.yml to define multiple distinct output packages",
        "Upload both files to the same S3 path and differentiate by filename",
        "Use the post_build phase to copy the test report to a different S3 bucket",
      ],
      correctIndex: 1,
      explanation:
        "Secondary artifacts allow a single CodeBuild build to produce multiple distinct output packages. Configure the primary artifact for the deployment JAR and a secondary artifact for the test coverage report — both are uploaded to S3 at the end of the build.",
    },
    {
      question:
        "A team wants to automatically run unit tests on every pull request to their GitHub repository and have the pass/fail result displayed on the PR. What combination enables this?",
      options: [
        "GitHub Actions calling the CodeBuild API via the AWS CLI",
        "CodePipeline with a Source stage watching the main branch",
        "A Lambda function triggered by GitHub webhooks that calls the CodeBuild API",
        "CodeBuild connected to GitHub via CodeStar connections, with build status reported back to GitHub",
      ],
      correctIndex: 3,
      explanation:
        "CodeBuild can connect to GitHub via CodeStar connections and trigger builds on pull request events. CodeBuild automatically reports the build status (pass/fail) back to the GitHub PR interface. This enables blocking PR merges when tests fail without any additional infrastructure.",
    },
  ],
};
