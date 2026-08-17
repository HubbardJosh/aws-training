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
      body: `ECS is built from four main abstractions. A **cluster** is the logical boundary where your containers run — it's a grouping of compute capacity (EC2 instances, Fargate capacity, or both) that tasks share. A **task definition** is the blueprint for your containers: it specifies which Docker image to run (from ECR or any registry), how much CPU and memory to allocate, which ports to expose, environment variables, secrets references, logging configuration, IAM roles, and volume mounts. A task definition is versioned — each change creates a new revision.

A **task** is a running instance of a task definition. One task can run multiple containers that share networking and storage. A **service** is what keeps a specified number of tasks running continuously, replacing failed tasks automatically and integrating with an ALB for load balancing. Services support rolling updates (gradually replacing old tasks with new ones) and blue/green deployments via CodeDeploy.

**Amazon ECR** (Elastic Container Registry) is the fully managed Docker registry that stores your container images. ECS pulls images from ECR automatically using the task execution role's permissions. ECR supports image scanning for vulnerabilities on push and lifecycle policies to automatically expire old image versions.`,
    },
    {
      heading: "Launch Types: EC2 vs Fargate",
      body: `The fundamental architectural choice in ECS is whether you manage the underlying compute infrastructure.

With the **EC2 launch type**, you provision and manage EC2 instances that form the cluster. Each instance runs the ECS Agent, which registers the instance with the cluster and accepts task placement decisions. You're responsible for instance sizing, OS patching, capacity management, and Auto Scaling Group configuration. You pay for the EC2 instances whether or not they're running tasks. In return, you get more control: SSH access to the hosts, support for GPU instances, custom AMIs, and flexibility in instance types and pricing models (including Spot Instances).

With **Fargate**, AWS manages all the underlying infrastructure. You define the task's CPU and memory requirements, and Fargate places it on managed infrastructure with strong isolation — each Fargate task runs in its own isolated VM slice, with no shared kernel between tasks. You pay per second of vCPU and memory used while the task is running, with no cost when it's stopped. Fargate eliminates operational overhead at the cost of less control and slightly higher per-unit cost. **Fargate Spot** offers up to 70% savings over standard Fargate pricing but tasks can be interrupted with 2 minutes of notice — appropriate for batch jobs and fault-tolerant workloads. When you need to access a running Fargate container for debugging, use **ECS Exec** (powered by SSM Session Manager) rather than SSH — it gives you interactive shell access without opening any ports.`,
    },
    {
      heading: "Networking Modes",
      body: `ECS supports several networking modes, with the right choice depending on your launch type and requirements.

**awsvpc** is the recommended mode and the only option for Fargate. In awsvpc mode, each task gets its own Elastic Network Interface (ENI) with a dedicated VPC IP address. This means each task has its own security group — you can apply fine-grained security rules per task rather than per host. The task's ENI can be referenced in security group rules by other services, and VPC flow logs capture all task-level traffic. awsvpc mode is more flexible and secure than the alternatives, and enables tasks to be targeted directly by other services.

**bridge** mode (EC2 only) uses Docker's default bridge network. Containers bind to random host ports, and the ALB uses dynamic port mapping to route traffic to the correct container on the right port. This allows multiple instances of the same service to run on the same EC2 host without port conflicts. **host** mode (EC2 only) removes the Docker network layer entirely — the container shares the host's network namespace, so container port equals host port. This has the highest performance but prevents multiple containers from binding the same port on a host.

ECS integrates with **AWS Cloud Map** for service discovery. When awsvpc mode is used, each task's IP is registered in a private DNS namespace, and other services can discover it by DNS name (like \`orders.myapp.local\`) rather than hardcoding IP addresses or using a load balancer.`,
    },
    {
      heading: "IAM Roles in ECS",
      body: `ECS uses two distinct IAM roles for each task, and confusing them is one of the most common ECS exam topics.

The **task execution role** is used by the ECS infrastructure on your behalf — not by your application code. ECS needs this role to pull your container image from ECR (which requires ECR authentication API calls), to write container logs to CloudWatch Logs, and to retrieve secrets from Secrets Manager or SSM Parameter Store at task launch time. Think of it as the "ECS plumbing" role — everything ECS needs to set up and run the task.

The **task role** is what your application code uses when it needs to call AWS services. If your container application reads from an S3 bucket, writes to a DynamoDB table, or publishes to an SQS queue, those calls use the task role. It's the equivalent of an EC2 instance profile, but for containers — the AWS SDK's credential chain automatically retrieves temporary credentials from the container metadata endpoint, so your code doesn't need to manage credentials explicitly.

The rule of thumb: if the container's *application code* is making the AWS call, it needs a task role. If *ECS itself* needs to do something on behalf of your task (image pull, log delivery, secret injection), that's the task execution role. A container that writes to both CloudWatch Logs (via the awslogs driver) and DynamoDB would have the execution role (for logs) and a separate task role (for DynamoDB).`,
    },
    {
      heading: "Service Deployments & Auto Scaling",
      body: `ECS services support several deployment strategies for updating running tasks to a new image or task definition revision.

The default **rolling update** replaces old tasks with new ones gradually. \`minimumHealthyPercent\` (default 100%) sets the floor — the percentage of desired tasks that must remain healthy during deployment. \`maximumPercent\` (default 200%) sets the ceiling — how many total tasks (old + new) can exist simultaneously. A minimumHealthyPercent of 50% and maximumPercent of 100% means ECS stops half the old tasks, then starts the new ones — useful when you're capacity-constrained. The ALB's health check path validates new tasks before draining connections from old ones.

**Blue/green deployment** via CodeDeploy requires two ALB target groups. ECS creates a new set of tasks (green), CodeDeploy waits for health checks, then shifts traffic from the original target group (blue) to the new one (green). Rollback is instantaneous: CodeDeploy shifts traffic back to the blue target group. This is the zero-downtime pattern for ECS, but it requires more setup than rolling updates.

**ECS Service Auto Scaling** adjusts the number of running tasks based on metrics. Target tracking policies maintain a metric at a target value (like keeping CPU utilization at 50%). Step scaling responds to threshold breaches with fixed capacity changes. Common metrics include \`ALBRequestCountPerTarget\`, \`ECSServiceAverageCPUUtilization\`, and \`ECSServiceAverageMemoryUtilization\`. For EC2 clusters, **Capacity Providers** manage the EC2 Auto Scaling Group, scaling instances up as task demand increases and down when it decreases.`,
    },
    {
      heading: "Logging & Monitoring",
      body: `Container logs in ECS are sent to CloudWatch Logs using the **awslogs log driver**, configured in the task definition. Every line written to stdout or stderr by the container is forwarded to a CloudWatch Logs log group, with each container instance creating its own log stream.

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

**Container Insights** provides enhanced metrics for ECS at the container level — CPU and memory per container, not just per service. It must be enabled explicitly per cluster and adds cost, but gives you the visibility needed to right-size task CPU and memory allocations.

ECS emits events to **EventBridge** when tasks change state (starting, running, stopping, stopped). Creating an EventBridge rule that triggers a Lambda or SNS notification when a task stops unexpectedly is a simple and effective way to detect container failures in near-real-time. ECS service events are also available in the console, showing deployment progress, task placement failures, and scaling events.

For distributed tracing, run the **X-Ray daemon** as a sidecar container in your task definition. The application container sends trace segments to the daemon over UDP (localhost:2000 in awsvpc mode, or the daemon's IP in bridge mode), and the daemon batches and forwards them to the X-Ray service.`,
    },
    {
      heading: "ECS with Other Services",
      body: `ECS integrates tightly with other AWS services to form production-grade container architectures.

**ECS + ECR** is the standard image management pattern. Task definitions reference ECR image URIs, and the task execution role's ECR permissions handle authentication automatically. ECR supports lifecycle policies to expire unused image tags, keeping storage costs in check, and vulnerability scanning to alert on security issues in your base images.

**ECS + ALB** is how you expose ECS services to users. The service registers task ENIs or ports in an ALB target group. The ALB routes traffic, performs health checks, and drains connections from tasks during deployments. This combination handles thousands of requests per second with automatic failover.

**ECS + Secrets Manager / SSM Parameter Store** is the recommended way to inject credentials into containers. You reference secrets in the task definition's \`secrets\` block, and ECS fetches and decrypts them at task launch time, injecting them as environment variables. Your application reads standard environment variables — no SDK code needed. The task execution role needs \`secretsmanager:GetSecretValue\` or \`ssm:GetParameters\` permission.

**ECS + Step Functions** enables orchestrated batch processing. The Step Functions ECS RunTask.sync integration starts a container task and waits for it to complete before proceeding to the next state. This is the right pattern for containerized ML inference, data transformation, or any batch job that's too complex for Lambda but needs to be part of a workflow.`,
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
