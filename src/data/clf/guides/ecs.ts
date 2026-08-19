import { ServiceGuide } from "../../../types/guide";

export const ecsGuide: ServiceGuide = {
  id: "clf-ecs",
  service: "Amazon ECS",
  domain: "deployment",
  tagline: "Fully managed container orchestration service",
  intro:
    "Amazon Elastic Container Service (ECS) is a fully managed container orchestration service that makes it easy to deploy, manage, and scale containerized applications using Docker containers on AWS.",

  sections: [
    {
      heading: "What Are Containers?",
      body: `A **container** packages an application and all its dependencies (runtime, libraries, configuration) into a single, portable unit. Unlike virtual machines, containers share the host operating system kernel and are much lighter-weight — they start in seconds rather than minutes and use far less memory and storage.

**Docker** is the industry-standard container platform. You define your container image in a \`Dockerfile\`, build it into an image, and run containers from that image. The image includes everything needed to run the application, ensuring it runs identically in development, testing, and production environments.

**Container registries** store and distribute container images. **Amazon Elastic Container Registry (ECR)** is AWS's managed private container registry, tightly integrated with ECS and EKS. You push images to ECR and ECS pulls them when launching containers.

ECS is the AWS service that manages **running, scheduling, and scaling** your containers across a cluster of compute resources.`,
    },
    {
      heading: "ECS Core Concepts",
      body: `ECS has a hierarchy of objects that define how your containers run.

A **Task Definition** is the blueprint for your application — it describes which container image to use, how much CPU and memory to allocate, environment variables, networking, logging configuration, and port mappings. It is analogous to a Dockerfile for an individual container, but at the orchestration level.

A **Task** is a running instance of a Task Definition — one or more containers running together. A task is the unit of work in ECS.

A **Service** defines how many tasks to run and keeps that number healthy. If a task crashes, the ECS Service scheduler automatically replaces it. Services also integrate with Elastic Load Balancers to distribute traffic across running tasks and support rolling deployments to update your application with zero downtime.

A **Cluster** is a logical grouping of tasks and services. It is the boundary for resource pooling and networking.`,
    },
    {
      heading: "Launch Types: EC2 vs. Fargate",
      body: `ECS offers two **launch types** that differ in who manages the underlying compute.

With the **EC2 launch type**, you provision and manage EC2 instances in your ECS cluster. ECS places your tasks on these instances. You are responsible for choosing instance types, patching the OS, and ensuring there is enough capacity for your tasks. This gives you more control and visibility into the underlying hosts, and can be more cost-effective for large, steady-state workloads.

With **AWS Fargate**, there are no EC2 instances to manage. Fargate is a **serverless compute engine for containers** — you define your task's CPU and memory requirements, and Fargate provisions and manages the underlying compute automatically. You pay per task based on the vCPU and memory it uses. Fargate is ideal when you want to focus entirely on your application without managing infrastructure.

For the Cloud Practitioner exam, the key distinction is: **EC2 launch type = you manage the servers; Fargate = AWS manages everything, you just specify what the container needs.**`,
    },
    {
      heading: "Networking and Security",
      body: `ECS tasks run inside your VPC and can be placed in public or private subnets. Each task can have its own elastic network interface (ENI) in **awsvpc** networking mode, giving each task its own private IP address and security group — this provides fine-grained network control similar to EC2 instances.

**IAM Task Roles** grant ECS tasks permission to call AWS services. Just like EC2 instance profiles, a task role allows your containerized application to read from S3, write to DynamoDB, or call any other AWS service without embedding credentials in the container image or environment variables. Each task can have a different role, enforcing least-privilege at the task level.

ECS integrates natively with **Amazon CloudWatch Logs** — configure the \`awslogs\` log driver in your task definition to stream container stdout/stderr directly to a CloudWatch log group. This provides centralized logging without running a logging agent in your container.

**Secrets** (database passwords, API keys) should be stored in **AWS Secrets Manager** or **SSM Parameter Store** and referenced from your task definition by ARN. ECS fetches the secret value at task startup and injects it as an environment variable, keeping secrets out of your task definition and container images.`,
    },
    {
      heading: "ECS vs. EKS",
      body: `Both ECS and **Amazon EKS (Elastic Kubernetes Service)** are container orchestration services on AWS, but they use different orchestration engines.

ECS uses AWS's own proprietary orchestration system, which is simpler to learn and operates with tight AWS service integration. It is often the right choice for teams new to containers or who want minimal operational complexity on AWS.

EKS runs **Kubernetes** — the open-source container orchestration platform that has become the industry standard. Kubernetes has a large ecosystem of tools and is portable across cloud providers. EKS is ideal for organizations with existing Kubernetes expertise, complex workloads requiring Kubernetes features, or multi-cloud strategies.

Both services support Fargate for serverless compute. The choice between ECS and EKS often comes down to whether you need Kubernetes specifically — if not, ECS is simpler and more AWS-native. For the Cloud Practitioner exam, understand that ECS is AWS's simpler managed container service while EKS is AWS's managed Kubernetes service.`,
    },
  ],

  keyFacts: [
    "ECS is a fully managed container orchestration service for Docker containers",
    "ECR (Elastic Container Registry) is AWS's managed Docker image registry",
    "Task Definition: blueprint (image, CPU, memory, ports); Task: running instance; Service: desired count",
    "EC2 launch type: you manage the host servers; Fargate: serverless, AWS manages compute",
    "Fargate is a serverless compute engine — pay per task CPU/memory, no EC2 to manage",
    "ECS tasks run inside your VPC with their own security groups and private IPs",
    "IAM Task Roles grant containers permission to call AWS services — no embedded credentials",
    "ECS integrates with CloudWatch Logs for container log streaming",
    "ECS Services keep a desired number of tasks running and replace unhealthy tasks",
    "EKS is AWS's managed Kubernetes service; ECS uses AWS's own orchestration engine",
  ],

  relatedServices: [
    "Amazon ECR",
    "AWS Fargate",
    "Amazon EKS",
    "Elastic Load Balancing",
    "Amazon CloudWatch",
    "AWS IAM",
  ],

  examTips: [
    "ECS EC2 = you manage EC2 hosts; ECS Fargate = AWS manages compute, pay per task",
    "Fargate is serverless containers — no cluster to manage, no EC2 to patch",
    "Task Definitions define container requirements; Services define desired running count",
    "Use IAM Task Roles for service-to-service permissions — never embed credentials",
    "ECS natively integrates with ECR, CloudWatch Logs, ALB, and IAM",
    "ECS = AWS-native orchestration (simpler); EKS = managed Kubernetes (more portable)",
    "Containers provide consistent, portable environments from dev to production",
    "Secrets Manager/SSM Parameter Store should store secrets, referenced by task definitions",
  ],
};
