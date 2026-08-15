import { ServiceGuide } from "../../types/guide";

export const ecsGuide: ServiceGuide = {
  id: "amazon-ecs",
  service: "Amazon ECS",
  domain: "deployment",
  tagline: "Fully managed container orchestration service",
  intro:
    "Amazon ECS (Elastic Container Service) is a fully managed container orchestration service for running Docker containers at scale. It supports two launch types: EC2 (you manage the instances) and Fargate (serverless containers). ECS integrates with ALB, IAM, CloudWatch, ECR, and Secrets Manager for production-grade deployments.",

  sections: [
    {
      heading: "Core Components",
      body: `**Cluster**: logical grouping of compute resources where tasks and services run. Can contain EC2 instances or Fargate capacity.

**Task Definition**: blueprint for your container(s). Defines:
- Docker image (from ECR, Docker Hub, or any registry)
- CPU and memory (hard/soft limits)
- Port mappings
- Environment variables
- IAM roles (task role + task execution role)
- Logging configuration (awslogs, Splunk, Fluentd)
- Secrets (from Secrets Manager or SSM Parameter Store)
- Volume mounts
- Health check

**Task**: a running instance of a task definition. One or more containers running together on the same host.

**Service**: runs and maintains a specified number of tasks simultaneously. Handles task replacement if a task fails. Integrates with ALB target groups for load balancing. Supports rolling updates, blue/green deployments.

**Container Registry (ECR)**: fully managed Docker image registry. Integrated with ECS for image pulls. Images scanned for vulnerabilities.`,
    },
    {
      heading: "Launch Types: EC2 vs Fargate",
      body: `**EC2 Launch Type**:
- You manage EC2 instances in the cluster (AMI, instance type, auto scaling)
- ECS Agent runs on each EC2 instance, registers with the cluster
- Pay for EC2 instances whether tasks run or not
- More control over the underlying hosts (SSH access, custom AMIs, GPU instances)
- ECS-optimized AMI: pre-configured with ECS Agent and Docker

**Fargate Launch Type**:
- Serverless containers — no EC2 instances to manage
- AWS manages the underlying infrastructure
- Pay per vCPU and memory per second while task runs
- Each task gets its own isolated VM slice (strong isolation)
- No SSH into the host
- Fargate Spot: up to 70% discount but tasks can be interrupted
- **Use when**: variable traffic, don't want to manage EC2, microservices, batch jobs

**Comparison**:
| | EC2 | Fargate |
|--|-----|---------|
| Infra management | You | AWS |
| Cost model | Per instance | Per task (vCPU/mem) |
| Isolation | Shared host | Per-task VM |
| GPU | Yes | No |
| SSH | Yes | No (use ECS Exec) |

**ECS Exec**: run commands directly in a running Fargate or EC2 container via SSM Session Manager. Replaces the need for SSH.`,
    },
    {
      heading: "Networking Modes",
      body: `**awsvpc** (recommended):
- Each task gets its own ENI (Elastic Network Interface) with its own VPC IP
- Full VPC networking features: security groups, VPC flow logs
- Required for Fargate
- Task security group can reference other security groups (not just CIDR)
- More flexible than bridge/host modes

**bridge** (EC2 only):
- Docker's default bridge network
- Ports mapped from container to host with dynamic port mapping
- Load balancer uses dynamic port mapping (ALB registers container port via target group)

**host** (EC2 only):
- Container shares host's network namespace
- No port translation; container port = host port
- Not supported by Fargate

**none**:
- No external connectivity

**Service Discovery**: ECS integrates with AWS Cloud Map for service discovery. Each task's ENI registered in a private DNS namespace. Other services discover using DNS (e.g. \`orders.myapp.local\`).`,
    },
    {
      heading: "IAM Roles in ECS",
      body: `ECS uses two distinct IAM roles — a common exam topic:

**Task Execution Role**: used by the ECS agent (not your application code) to:
- Pull images from ECR (\`ecr:GetAuthorizationToken\`, \`ecr:BatchGetImage\`, etc.)
- Write logs to CloudWatch Logs (\`logs:CreateLogGroup\`, \`logs:PutLogEvents\`)
- Fetch secrets from Secrets Manager or SSM Parameter Store at task launch

**Task Role**: assumed by your application code running inside the container. Grants permissions for the app to call AWS services (DynamoDB, S3, SQS, etc.). Think of it like an EC2 instance profile but for containers.

**Rule of thumb**: if the container needs to call AWS, give it a Task Role. If ECS needs to do something on behalf of your task (ECR pull, logging), that's the Task Execution Role.

**ECS Task Role trust policy**: trusts \`ecs-tasks.amazonaws.com\`. Credentials accessed via IMDS-like endpoint inside the container.`,
    },
    {
      heading: "Service Deployments & Auto Scaling",
      body: `**Rolling Update** (default):
- ECS replaces old tasks with new tasks gradually
- Configure \`minimumHealthyPercent\` (floor) and \`maximumPercent\` (ceiling) during update
- ALB health checks determine when new tasks are healthy before draining old ones

**Blue/Green Deployment** (with CodeDeploy):
- Two environments: blue (current) and green (new)
- Traffic shifts from blue to green (all-at-once, linear, canary)
- Instant rollback: shift traffic back to blue
- Requires ALB target groups for each color

**ECS Service Auto Scaling**:
- Scales number of tasks based on CloudWatch metrics
- Scaling policies: target tracking (maintain metric at target), step scaling
- Common metrics: ALBRequestCountPerTarget, CPUUtilization, MemoryUtilization
- Works with Fargate and EC2

**EC2 Cluster Auto Scaling** (EC2 launch type):
- Capacity Providers manage EC2 instance scaling
- EC2 Auto Scaling Group attached to cluster
- ECS scales instances up/down as task demand changes

**Spot Capacity Provider**: use EC2 Spot Instances for cost savings. Handle interruptions with graceful shutdown (SIGTERM → SIGKILL).`,
    },
    {
      heading: "Logging & Monitoring",
      body: `**awslogs log driver**: sends container stdout/stderr to CloudWatch Logs. Configure in task definition:
\`\`\`
"logConfiguration": {
  "logDriver": "awslogs",
  "options": {
    "awslogs-group": "/ecs/my-app",
    "awslogs-region": "us-east-1",
    "awslogs-stream-prefix": "ecs"
  }
}
\`\`\`

**Container Insights**: enable per cluster for enhanced container-level metrics (task count, CPU, memory per container). Published to CloudWatch. Additional cost.

**X-Ray**: run X-Ray daemon as a sidecar container. Set \`AWS_XRAY_DAEMON_ADDRESS\` in application container to point to sidecar.

**Health Checks**: ECS supports two health check layers:
- ELB health check: ALB probes task on health check path
- Container health check: Docker HEALTHCHECK in task definition
- ECS stops and replaces unhealthy tasks

**ECS Service Events**: view deployment events, task placement failures, and service scaling events in the ECS console or CloudTrail.`,
    },
    {
      heading: "ECS with Other Services",
      body: `**ECS + ECR**: store and pull images securely. Task Execution Role grants ECR pull permissions. Image scanning on push for vulnerability detection.

**ECS + ALB**: service registers tasks in ALB target group. ALB routes traffic. Dynamic port mapping (bridge mode) or awsvpc mode with task-level security groups.

**ECS + Secrets Manager / SSM**: reference secrets in task definition. ECS injects as environment variables at task launch. Task Execution Role needs GetSecretValue permission.

**ECS + CloudWatch**: awslogs driver for logs. CloudWatch metrics for alarms and auto scaling. Container Insights for enhanced metrics.

**ECS + CodePipeline / CodeDeploy**: CI/CD pipeline deploys new task definition revision to ECS service. CodeDeploy blue/green for zero-downtime deployments.

**ECS + Step Functions**: Step Functions ECS RunTask.sync integration runs a containerized job and waits for completion. Common for batch ML processing, data transformation.

**ECS + EventBridge**: ECS emits events to EventBridge for task state changes (RUNNING, STOPPED). Trigger Lambda or SNS on container failures.

**ECS + X-Ray**: sidecar daemon container in task definition. App container sends traces to daemon (localhost:2000 with awsvpc or sidecar IP).`,
    },
  ],

  keyFacts: [
    "Task Execution Role: ECS agent uses (ECR pull, CloudWatch logs, Secrets Manager injection)",
    "Task Role: application code inside container uses (DynamoDB, S3, SQS access)",
    "Fargate: serverless containers, pay per vCPU/memory, each task isolated VM",
    "awsvpc mode: each task gets its own ENI — required for Fargate",
    "Rolling update: minimumHealthyPercent floor, maximumPercent ceiling during deploy",
    "Blue/green with CodeDeploy: instant rollback by shifting traffic back to blue target group",
    "ECS Exec: run commands in container via SSM Session Manager (no SSH needed)",
    "awslogs driver: ships container stdout/stderr to CloudWatch Logs",
    "Container Insights: enhanced per-container metrics (additional cost)",
    "Fargate Spot: up to 70% savings; tasks can be interrupted",
  ],

  relatedServices: [
    "Amazon ECR",
    "Elastic Load Balancing",
    "AWS IAM",
    "AWS Fargate",
    "Amazon CloudWatch",
    "AWS Secrets Manager",
    "AWS CodeDeploy",
    "AWS CodePipeline",
    "Amazon EventBridge",
    "AWS X-Ray",
    "AWS Step Functions",
  ],

  examTips: [
    "Task Execution Role = ECS infrastructure (ECR, logs). Task Role = your app code (AWS calls).",
    "Fargate requires awsvpc network mode — each task gets its own ENI.",
    "Blue/green needs CodeDeploy + two ALB target groups; rolling update built into ECS service.",
    "Secrets in task definition: injected as env vars at launch using Task Execution Role.",
    "ECS Exec uses SSM Session Manager — no SSH, no open inbound ports needed.",
    "Container Insights: must be explicitly enabled per cluster; adds cost.",
    "Step Functions + ECS RunTask.sync: waits for container to finish before proceeding.",
    "Fargate Spot: cost-optimized but interruptible — not for latency-sensitive workloads.",
  ],
};
