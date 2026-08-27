import { ServiceGuide } from "../../../types/guide";

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
      quiz: [
        {
          question:
            "What is the relationship between a task definition and a task in ECS?",
          options: [
            "A task definition is a running container; a task is the blueprint",
            "A task definition is the versioned blueprint; a task is a running instance of it",
            "They are interchangeable terms for the same concept",
            "A task definition defines the cluster; a task defines the service",
          ],
          correctIndex: 1,
          explanation:
            "A task definition is the versioned blueprint that specifies the container image, CPU/memory, ports, IAM roles, and logging. A task is a running instance of that task definition. Each change to the task definition creates a new revision.",
        },
        {
          question:
            "What ECS component keeps a specified number of tasks running continuously and integrates with an ALB?",
          options: ["Cluster", "Task", "Service", "Task definition"],
          correctIndex: 2,
          explanation:
            "An ECS service maintains the desired number of running tasks, automatically replacing failed tasks, and integrates with an ALB for load balancing. Services also manage rolling and blue/green deployments.",
        },
        {
          question:
            "Which IAM role does ECS use to pull container images from ECR?",
          options: [
            "Task role",
            "Task execution role",
            "Cluster role",
            "Service-linked role",
          ],
          correctIndex: 1,
          explanation:
            "The task execution role is used by the ECS infrastructure (not your application code) to pull images from ECR, write logs to CloudWatch, and retrieve secrets from Secrets Manager at task launch time.",
        },
      ],
    },
    {
      heading: "Launch Types: EC2 vs Fargate",
      body: `The fundamental architectural choice in ECS is whether you manage the underlying compute infrastructure.

With the **EC2 launch type**, you provision and manage EC2 instances that form the cluster. Each instance runs the ECS Agent, which registers the instance with the cluster and accepts task placement decisions. You're responsible for instance sizing, OS patching, capacity management, and Auto Scaling Group configuration. You pay for the EC2 instances whether or not they're running tasks. In return, you get more control: SSH access to the hosts, support for GPU instances, custom AMIs, and flexibility in instance types and pricing models (including Spot Instances).

With **Fargate**, AWS manages all the underlying infrastructure. You define the task's CPU and memory requirements, and Fargate places it on managed infrastructure with strong isolation — each Fargate task runs in its own isolated VM slice, with no shared kernel between tasks. You pay per second of vCPU and memory used while the task is running, with no cost when it's stopped. Fargate eliminates operational overhead at the cost of less control and slightly higher per-unit cost. **Fargate Spot** offers up to 70% savings over standard Fargate pricing but tasks can be interrupted with 2 minutes of notice — appropriate for batch jobs and fault-tolerant workloads. When you need to access a running Fargate container for debugging, use **ECS Exec** (powered by SSM Session Manager) rather than SSH — it gives you interactive shell access without opening any ports.`,
      quiz: [
        {
          question:
            "How much notice does Fargate Spot give before interrupting a task?",
          options: ["30 seconds", "1 minute", "2 minutes", "5 minutes"],
          correctIndex: 2,
          explanation:
            "Fargate Spot tasks can be interrupted with 2 minutes of notice. This makes Fargate Spot appropriate for batch jobs and fault-tolerant workloads, but not for latency-sensitive production services.",
        },
        {
          question:
            "How do you get interactive shell access to a running Fargate container for debugging?",
          options: [
            "SSH to the underlying EC2 host and docker exec into the container",
            "Use ECS Exec (powered by SSM Session Manager) without opening any ports",
            "Connect via RDP to the Fargate managed instance",
            "Use the ECS console's built-in terminal emulator",
          ],
          correctIndex: 1,
          explanation:
            "ECS Exec uses SSM Session Manager to provide interactive shell access to running containers — including Fargate — without SSH, open ports, or a bastion host. The task execution role must include SSM permissions.",
        },
        {
          question: "What billing model does AWS Fargate use?",
          options: [
            "Per EC2 instance hour, same as EC2 launch type",
            "Per second of vCPU and memory used while the task is running",
            "Per container image pulled from ECR",
            "A flat monthly fee per ECS cluster",
          ],
          correctIndex: 1,
          explanation:
            "Fargate charges per second of vCPU and memory consumed while tasks are running. There is no charge when tasks are stopped, making it cost-efficient for intermittent workloads.",
        },
      ],
    },
    {
      heading: "Networking Modes",
      body: `ECS supports several networking modes, with the right choice depending on your launch type and requirements.

**awsvpc** is the recommended mode and the only option for Fargate. In awsvpc mode, each task gets its own Elastic Network Interface (ENI) with a dedicated VPC IP address. This means each task has its own security group — you can apply fine-grained security rules per task rather than per host. The task's ENI can be referenced in security group rules by other services, and VPC flow logs capture all task-level traffic. awsvpc mode is more flexible and secure than the alternatives, and enables tasks to be targeted directly by other services.

**bridge** mode (EC2 only) uses Docker's default bridge network. Containers bind to random host ports, and the ALB uses dynamic port mapping to route traffic to the correct container on the right port. This allows multiple instances of the same service to run on the same EC2 host without port conflicts. **host** mode (EC2 only) removes the Docker network layer entirely — the container shares the host's network namespace, so container port equals host port. This has the highest performance but prevents multiple containers from binding the same port on a host.

ECS integrates with **AWS Cloud Map** for service discovery. When awsvpc mode is used, each task's IP is registered in a private DNS namespace, and other services can discover it by DNS name (like \`orders.myapp.local\`) rather than hardcoding IP addresses or using a load balancer.`,
      quiz: [
        {
          question:
            "Which ECS networking mode is the only option for Fargate tasks?",
          options: ["bridge", "host", "awsvpc", "overlay"],
          correctIndex: 2,
          explanation:
            "awsvpc is the only networking mode supported by Fargate. It gives each task its own ENI and VPC IP address, enabling per-task security groups and fine-grained network control.",
        },
        {
          question:
            "What networking advantage does awsvpc mode provide over bridge mode?",
          options: [
            "Higher network throughput due to direct kernel access",
            "Each task gets its own ENI and security group for fine-grained per-task network control",
            "Tasks can communicate across VPC peering connections",
            "No NAT is required for outbound internet access",
          ],
          correctIndex: 1,
          explanation:
            "In awsvpc mode each task gets its own ENI with its own security group. This enables fine-grained per-task security rules rather than per-host rules, and VPC flow logs capture task-level traffic.",
        },
        {
          question:
            "In ECS bridge networking mode, how does the ALB route traffic to the correct container?",
          options: [
            "By using the container's fixed IP address registered in Route 53",
            "By using dynamic port mapping — containers bind to random host ports that the ALB tracks",
            "By sending traffic to all ports and letting the container filter",
            "By using ECS service discovery with Cloud Map",
          ],
          correctIndex: 1,
          explanation:
            "In bridge mode, containers bind to random host ports. The ALB uses dynamic port mapping to route traffic to the correct container on the correct random port, allowing multiple containers of the same service on the same host.",
        },
      ],
    },
    {
      heading: "IAM Roles in ECS",
      body: `ECS uses two distinct IAM roles for each task, and confusing them is one of the most common ECS exam topics.

The **task execution role** is used by the ECS infrastructure on your behalf — not by your application code. ECS needs this role to pull your container image from ECR (which requires ECR authentication API calls), to write container logs to CloudWatch Logs, and to retrieve secrets from Secrets Manager or SSM Parameter Store at task launch time. Think of it as the "ECS plumbing" role — everything ECS needs to set up and run the task.

The **task role** is what your application code uses when it needs to call AWS services. If your container application reads from an S3 bucket, writes to a DynamoDB table, or publishes to an SQS queue, those calls use the task role. It's the equivalent of an EC2 instance profile, but for containers — the AWS SDK's credential chain automatically retrieves temporary credentials from the container metadata endpoint, so your code doesn't need to manage credentials explicitly.

The rule of thumb: if the container's *application code* is making the AWS call, it needs a task role. If *ECS itself* needs to do something on behalf of your task (image pull, log delivery, secret injection), that's the task execution role. A container that writes to both CloudWatch Logs (via the awslogs driver) and DynamoDB would have the execution role (for logs) and a separate task role (for DynamoDB).`,
      quiz: [
        {
          question:
            "Which ECS IAM role is used when a container application writes to a DynamoDB table?",
          options: [
            "Task execution role",
            "Task role",
            "Cluster service-linked role",
            "ECS agent role",
          ],
          correctIndex: 1,
          explanation:
            "The task role is used by the application code running inside the container. If the container application writes to DynamoDB, reads from S3, or publishes to SQS, those calls use the task role — equivalent to an EC2 instance profile.",
        },
        {
          question:
            "Which ECS IAM role is responsible for pulling container images from ECR?",
          options: [
            "Task role",
            "Task execution role",
            "The ECS service role",
            "The cluster administrator role",
          ],
          correctIndex: 1,
          explanation:
            "The task execution role is used by the ECS infrastructure (not application code) for operations like pulling images from ECR, writing logs to CloudWatch, and injecting secrets from Secrets Manager at task launch time.",
        },
        {
          question:
            "A container needs to both read from S3 (application code) and have its logs sent to CloudWatch (ECS infrastructure). Which roles are needed?",
          options: [
            "Only a task role with both S3 and CloudWatch permissions",
            "Only a task execution role with both S3 and CloudWatch permissions",
            "A task role with S3 permissions and a task execution role with CloudWatch permissions",
            "A single combined ECS role with all permissions",
          ],
          correctIndex: 2,
          explanation:
            "The task role grants the application code S3 access. The task execution role grants ECS infrastructure the ability to write logs to CloudWatch. These are separate roles with separate purposes.",
        },
      ],
    },
    {
      heading: "Service Deployments & Auto Scaling",
      body: `ECS services support several deployment strategies for updating running tasks to a new image or task definition revision.

The default **rolling update** replaces old tasks with new ones gradually. \`minimumHealthyPercent\` (default 100%) sets the floor — the percentage of desired tasks that must remain healthy during deployment. \`maximumPercent\` (default 200%) sets the ceiling — how many total tasks (old + new) can exist simultaneously. A minimumHealthyPercent of 50% and maximumPercent of 100% means ECS stops half the old tasks, then starts the new ones — useful when you're capacity-constrained. The ALB's health check path validates new tasks before draining connections from old ones.

**Blue/green deployment** via CodeDeploy requires two ALB target groups. ECS creates a new set of tasks (green), CodeDeploy waits for health checks, then shifts traffic from the original target group (blue) to the new one (green). Rollback is instantaneous: CodeDeploy shifts traffic back to the blue target group. This is the zero-downtime pattern for ECS, but it requires more setup than rolling updates.

**ECS Service Auto Scaling** adjusts the number of running tasks based on metrics. Target tracking policies maintain a metric at a target value (like keeping CPU utilization at 50%). Step scaling responds to threshold breaches with fixed capacity changes. Common metrics include \`ALBRequestCountPerTarget\`, \`ECSServiceAverageCPUUtilization\`, and \`ECSServiceAverageMemoryUtilization\`. For EC2 clusters, **Capacity Providers** manage the EC2 Auto Scaling Group, scaling instances up as task demand increases and down when it decreases.`,
      quiz: [
        {
          question:
            "What does minimumHealthyPercent control in an ECS rolling update?",
          options: [
            "The percentage of new tasks that must pass health checks before old tasks stop",
            "The floor — the minimum percentage of desired tasks that must remain healthy during deployment",
            "The maximum number of tasks that can be replaced at once",
            "The ALB health check threshold for determining task health",
          ],
          correctIndex: 1,
          explanation:
            "minimumHealthyPercent sets the floor — the minimum percentage of desired tasks that must remain running and healthy during a deployment. The default is 100%, ensuring full capacity is maintained throughout.",
        },
        {
          question:
            "What is required for ECS blue/green deployments (as opposed to rolling updates)?",
          options: [
            "Two ECS clusters with identical task definitions",
            "CodeDeploy and two ALB target groups",
            "Fargate launch type only",
            "ECS Service Auto Scaling enabled",
          ],
          correctIndex: 1,
          explanation:
            "ECS blue/green deployment requires CodeDeploy and two ALB target groups. CodeDeploy shifts traffic from the blue (original) target group to the green (new) target group after health checks pass, with instantaneous rollback available.",
        },
        {
          question:
            "What is the benefit of ECS blue/green deployment over rolling update?",
          options: [
            "Blue/green is cheaper because it uses fewer tasks",
            "Blue/green supports instantaneous rollback by shifting traffic back to the blue target group",
            "Blue/green deploys faster than rolling update",
            "Blue/green works without an ALB",
          ],
          correctIndex: 1,
          explanation:
            "The key benefit of blue/green deployment is instantaneous rollback — CodeDeploy can shift traffic back to the original (blue) target group immediately if the new deployment has issues, with no need to restart containers.",
        },
      ],
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
      quiz: [
        {
          question:
            "Which log driver sends ECS container stdout/stderr to CloudWatch Logs?",
          options: ["cloudwatch", "awslogs", "fluentd", "json-file"],
          correctIndex: 1,
          explanation:
            "The awslogs log driver is configured in the task definition's logConfiguration block. It forwards all container stdout and stderr to a CloudWatch Logs log group, with each container instance creating its own log stream.",
        },
        {
          question:
            "What must be done to enable Container Insights for an ECS cluster?",
          options: [
            "It is enabled by default for all ECS clusters",
            "It must be explicitly enabled per cluster and adds additional cost",
            "It is enabled automatically when the awslogs driver is configured",
            "It requires installing the CloudWatch agent as a sidecar container",
          ],
          correctIndex: 1,
          explanation:
            "Container Insights must be explicitly enabled per ECS cluster and does add cost. It provides enhanced per-container metrics (CPU and memory per container) beyond what standard CloudWatch metrics provide.",
        },
        {
          question:
            "How does X-Ray distributed tracing work in ECS with awsvpc networking?",
          options: [
            "The X-Ray SDK sends traces directly to the X-Ray service via HTTPS",
            "Application containers send UDP segments to the X-Ray daemon sidecar at localhost:2000",
            "ECS automatically captures traces without any configuration",
            "X-Ray traces are captured by the awslogs driver alongside application logs",
          ],
          correctIndex: 1,
          explanation:
            "In awsvpc mode, the application container sends UDP trace segments to the X-Ray daemon sidecar at localhost:2000. The daemon batches and forwards them to the X-Ray service. In bridge mode, the daemon's container IP is used instead.",
        },
      ],
    },
    {
      heading: "ECS with Other Services",
      body: `ECS integrates tightly with other AWS services to form production-grade container architectures.

**ECS + ECR** is the standard image management pattern. Task definitions reference ECR image URIs, and the task execution role's ECR permissions handle authentication automatically. ECR supports lifecycle policies to expire unused image tags, keeping storage costs in check, and vulnerability scanning to alert on security issues in your base images.

**ECS + ALB** is how you expose ECS services to users. The service registers task ENIs or ports in an ALB target group. The ALB routes traffic, performs health checks, and drains connections from tasks during deployments. This combination handles thousands of requests per second with automatic failover.

**ECS + Secrets Manager / SSM Parameter Store** is the recommended way to inject credentials into containers. You reference secrets in the task definition's \`secrets\` block, and ECS fetches and decrypts them at task launch time, injecting them as environment variables. Your application reads standard environment variables — no SDK code needed. The task execution role needs \`secretsmanager:GetSecretValue\` or \`ssm:GetParameters\` permission.

**ECS + Step Functions** enables orchestrated batch processing. The Step Functions ECS RunTask.sync integration starts a container task and waits for it to complete before proceeding to the next state. This is the right pattern for containerized ML inference, data transformation, or any batch job that's too complex for Lambda but needs to be part of a workflow.`,
      quiz: [
        {
          question:
            "When ECS injects a secret from Secrets Manager into a container, which IAM role needs GetSecretValue permission?",
          options: [
            "Task role",
            "Task execution role",
            "The ALB service role",
            "The ECS cluster role",
          ],
          correctIndex: 1,
          explanation:
            "The task execution role needs secretsmanager:GetSecretValue permission because ECS infrastructure (not application code) fetches and injects secrets at task launch time. The application reads them as standard environment variables.",
        },
        {
          question:
            "Which Step Functions integration pattern starts an ECS task and waits for it to complete?",
          options: [
            "ECS RunTask with request-response pattern",
            "ECS RunTask.sync integration",
            "ECS RunTask with waitForTaskToken callback",
            "ECS RunTask with EventBridge notification",
          ],
          correctIndex: 1,
          explanation:
            "The Step Functions ECS RunTask.sync integration starts an ECS task and pauses the workflow until the task completes. This is the correct pattern for containerized batch jobs that must finish before the next workflow step.",
        },
        {
          question:
            "What ECR feature automatically removes old container image versions to control storage costs?",
          options: [
            "Image vulnerability scanning",
            "ECR lifecycle policies",
            "Image tag immutability",
            "Cross-region replication",
          ],
          correctIndex: 1,
          explanation:
            "ECR lifecycle policies automatically expire and delete old image versions based on rules you configure (e.g., keep only the last 10 tagged images). This keeps storage costs in check without manual cleanup.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A Fargate container application reads from an S3 bucket. Which IAM role must have S3 read permissions?",
      options: [
        "Task execution role",
        "Task role",
        "ECS service-linked role",
        "Fargate cluster role",
      ],
      correctIndex: 1,
      explanation:
        "The task role is used by application code running inside the container. S3 reads from the application require the task role. The task execution role is for ECS infrastructure operations like image pulls and log delivery.",
    },
    {
      question: "Which ECS networking mode is required for Fargate?",
      options: ["bridge", "host", "awsvpc", "overlay"],
      correctIndex: 2,
      explanation:
        "awsvpc is the only networking mode supported by Fargate. It gives each task its own ENI with a dedicated VPC IP address and its own security group for fine-grained network control.",
    },
    {
      question:
        "A team needs zero-downtime ECS deployments with instantaneous rollback capability. Which deployment strategy should they use?",
      options: [
        "Rolling update with minimumHealthyPercent=100",
        "Blue/green deployment via CodeDeploy with two ALB target groups",
        "All-at-once replacement of all tasks simultaneously",
        "Canary deployment with gradual task replacement",
      ],
      correctIndex: 1,
      explanation:
        "Blue/green deployment with CodeDeploy provides instantaneous rollback by shifting traffic back to the original (blue) target group. Rolling update is simpler but rollback requires re-deploying the previous version.",
    },
    {
      question:
        "How do you access a running Fargate container for interactive debugging without opening inbound ports?",
      options: [
        "SSH to the underlying Fargate host using the task's public IP",
        "Use ECS Exec powered by SSM Session Manager",
        "Use the ECS console's built-in log viewer",
        "Connect via RDP to the Fargate managed instance",
      ],
      correctIndex: 1,
      explanation:
        "ECS Exec uses SSM Session Manager to provide interactive shell access to running containers — including Fargate — without SSH, open inbound ports, or a bastion host.",
    },
    {
      question:
        "A Fargate service needs database credentials injected at startup. The application reads them as environment variables. Which ECS role needs secretsmanager:GetSecretValue?",
      options: [
        "Task role — the application code fetches the secret",
        "Task execution role — ECS infrastructure fetches and injects the secret",
        "Both the task role and task execution role",
        "Neither — Fargate fetches secrets automatically without IAM permissions",
      ],
      correctIndex: 1,
      explanation:
        "When secrets are referenced in the task definition's secrets block, ECS infrastructure fetches them at task launch time using the task execution role. The application receives them as environment variables and needs no special IAM permissions.",
    },
    {
      question:
        "What does Fargate Spot offer compared to standard Fargate, and what is the tradeoff?",
      options: [
        "Up to 50% savings; tasks can be interrupted with 5 minutes notice",
        "Up to 70% savings; tasks can be interrupted with 2 minutes notice",
        "Up to 90% savings; tasks are preemptible at any time without notice",
        "Up to 30% savings; tasks have reduced CPU allocation",
      ],
      correctIndex: 1,
      explanation:
        "Fargate Spot offers up to 70% savings over standard Fargate pricing. The tradeoff is that tasks can be interrupted with 2 minutes of notice, making it appropriate for batch jobs and fault-tolerant workloads but not production services.",
    },
    {
      question:
        "Which ECS feature provides enhanced per-container CPU and memory metrics beyond standard CloudWatch metrics?",
      options: [
        "ECS service events in the console",
        "Container Insights (must be enabled per cluster, adds cost)",
        "The awslogs log driver",
        "X-Ray distributed tracing",
      ],
      correctIndex: 1,
      explanation:
        "Container Insights provides enhanced per-container metrics including CPU and memory usage at the container level. It must be explicitly enabled per cluster and does add cost, but provides the visibility needed to right-size task allocations.",
    },
    {
      question:
        "An ECS service has a rolling update configured with minimumHealthyPercent=50 and maximumPercent=100. What happens during deployment?",
      options: [
        "ECS launches new tasks first, then terminates old tasks — maintaining 100% capacity throughout",
        "ECS stops half the old tasks first, then starts new tasks — temporarily running at 50% capacity",
        "All old tasks are terminated before any new tasks start",
        "New tasks are added to double capacity before any old tasks are removed",
      ],
      correctIndex: 1,
      explanation:
        "With minimumHealthyPercent=50 and maximumPercent=100, ECS stops half the old tasks before starting new ones. This temporarily reduces capacity to 50% but avoids running more than 100% of tasks simultaneously — useful in capacity-constrained environments.",
    },
  ],
};
