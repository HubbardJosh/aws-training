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
      quiz: [
        {
          question: "How do containers differ from virtual machines (VMs)?",
          options: [
            "Containers share the host OS kernel and are lighter-weight; VMs include a full OS",
            "Containers are slower to start but provide stronger isolation than VMs",
            "Containers require dedicated physical hardware; VMs can share hardware",
            "Containers can only run on Linux; VMs support both Linux and Windows",
          ],
          correctIndex: 0,
          explanation:
            "Containers share the host operating system kernel and are much lighter-weight than VMs — they start in seconds and use far less memory and storage. VMs include a full OS and hypervisor, making them heavier but with stronger isolation.",
        },
        {
          question: "What is Amazon ECR (Elastic Container Registry)?",
          options: [
            "AWS's managed private container image registry, integrated with ECS and EKS",
            "A container orchestration service that runs and schedules Docker containers",
            "A service for monitoring container performance metrics",
            "A serverless compute engine for running containers without managing servers",
          ],
          correctIndex: 0,
          explanation:
            "Amazon ECR is AWS's managed private container registry for storing and distributing Docker container images. It integrates tightly with ECS and EKS — you push images to ECR and the orchestration services pull them when launching containers.",
        },
        {
          question:
            "What is the key advantage of packaging an application as a Docker container?",
          options: [
            "Containers are automatically distributed across multiple AWS regions",
            "Containers eliminate the need for any networking configuration",
            "The container image includes all dependencies, ensuring the application runs identically across all environments",
            "Docker containers are inherently more secure than traditional application deployments",
          ],
          correctIndex: 2,
          explanation:
            "A Docker container image includes the application and all its dependencies (runtime, libraries, configuration). This ensures the application runs identically in development, testing, and production environments, eliminating 'works on my machine' issues.",
        },
      ],
    },
    {
      heading: "ECS Core Concepts",
      body: `ECS has a hierarchy of objects that define how your containers run.

A **Task Definition** is the blueprint for your application — it describes which container image to use, how much CPU and memory to allocate, environment variables, networking, logging configuration, and port mappings. It is analogous to a Dockerfile for an individual container, but at the orchestration level.

A **Task** is a running instance of a Task Definition — one or more containers running together. A task is the unit of work in ECS.

A **Service** defines how many tasks to run and keeps that number healthy. If a task crashes, the ECS Service scheduler automatically replaces it. Services also integrate with Elastic Load Balancers to distribute traffic across running tasks and support rolling deployments to update your application with zero downtime.

A **Cluster** is a logical grouping of tasks and services. It is the boundary for resource pooling and networking.`,
      quiz: [
        {
          question: "In Amazon ECS, what is a Task Definition?",
          options: [
            "The scaling policy that determines how many tasks to run",
            "A running instance of containers in ECS",
            "A blueprint describing the container image, CPU, memory, ports, and other configuration",
            "A logical grouping of ECS tasks and services",
          ],
          correctIndex: 2,
          explanation:
            "A Task Definition is the blueprint for your application in ECS. It specifies the container image to use, CPU and memory allocation, environment variables, networking, logging configuration, and port mappings.",
        },
        {
          question: "What does an ECS Service do?",
          options: [
            "It stores container logs in Amazon CloudWatch",
            "It builds container images from Dockerfiles and pushes them to ECR",
            "It manages the underlying EC2 instances in an ECS cluster",
            "It defines how many tasks to run and automatically replaces crashed tasks",
          ],
          correctIndex: 3,
          explanation:
            "An ECS Service maintains a desired number of running tasks. If a task crashes or becomes unhealthy, the Service scheduler automatically replaces it. Services also integrate with load balancers and support rolling deployments.",
        },
        {
          question:
            "What is the relationship between Task Definitions and Tasks in ECS?",
          options: [
            "Tasks are templates; Task Definitions are running instances",
            "They are different names for the same concept in ECS",
            "Task Definitions define the cluster; Tasks define the service",
            "Task Definitions are blueprints; Tasks are running instances of those blueprints",
          ],
          correctIndex: 3,
          explanation:
            "A Task Definition is the blueprint (like a recipe) and a Task is a running instance of that blueprint (like a meal made from the recipe). Multiple tasks can run from the same Task Definition.",
        },
      ],
    },
    {
      heading: "Launch Types: EC2 vs. Fargate",
      body: `ECS offers two **launch types** that differ in who manages the underlying compute.

With the **EC2 launch type**, you provision and manage EC2 instances in your ECS cluster. ECS places your tasks on these instances. You are responsible for choosing instance types, patching the OS, and ensuring there is enough capacity for your tasks. This gives you more control and visibility into the underlying hosts, and can be more cost-effective for large, steady-state workloads.

With **AWS Fargate**, there are no EC2 instances to manage. Fargate is a **serverless compute engine for containers** — you define your task's CPU and memory requirements, and Fargate provisions and manages the underlying compute automatically. You pay per task based on the vCPU and memory it uses. Fargate is ideal when you want to focus entirely on your application without managing infrastructure.

For the Cloud Practitioner exam, the key distinction is: **EC2 launch type = you manage the servers; Fargate = AWS manages everything, you just specify what the container needs.**`,
      quiz: [
        {
          question:
            "What is the key difference between ECS with the EC2 launch type and ECS with Fargate?",
          options: [
            "EC2 launch type supports Docker containers; Fargate only supports non-Docker runtimes",
            "EC2 launch type requires you to manage the underlying servers; Fargate is serverless and AWS manages all compute",
            "EC2 launch type is more expensive; Fargate is always cheaper",
            "EC2 launch type supports all AWS regions; Fargate is limited to us-east-1",
          ],
          correctIndex: 1,
          explanation:
            "With the EC2 launch type, you provision and manage EC2 instances in your cluster — you choose instance types, patch the OS, and manage capacity. With Fargate, you specify CPU and memory requirements and AWS manages all the underlying compute. Fargate is serverless for containers.",
        },
        {
          question: "AWS Fargate is best described as:",
          options: [
            "A container image registry service",
            "A serverless compute engine for containers where AWS manages the underlying infrastructure",
            "An EC2 instance type optimized for container workloads",
            "A tool for building Docker images from source code",
          ],
          correctIndex: 1,
          explanation:
            "AWS Fargate is a serverless compute engine for containers. You specify the CPU and memory your task needs, and Fargate provisions and manages the underlying compute automatically. There are no EC2 instances to patch or manage.",
        },
      ],
    },
    {
      heading: "Networking and Security",
      body: `ECS tasks run inside your VPC and can be placed in public or private subnets. Each task can have its own elastic network interface (ENI) in **awsvpc** networking mode, giving each task its own private IP address and security group — this provides fine-grained network control similar to EC2 instances.

**IAM Task Roles** grant ECS tasks permission to call AWS services. Just like EC2 instance profiles, a task role allows your containerized application to read from S3, write to DynamoDB, or call any other AWS service without embedding credentials in the container image or environment variables. Each task can have a different role, enforcing least-privilege at the task level.

ECS integrates natively with **Amazon CloudWatch Logs** — configure the \`awslogs\` log driver in your task definition to stream container stdout/stderr directly to a CloudWatch log group. This provides centralized logging without running a logging agent in your container.

**Secrets** (database passwords, API keys) should be stored in **AWS Secrets Manager** or **SSM Parameter Store** and referenced from your task definition by ARN. ECS fetches the secret value at task startup and injects it as an environment variable, keeping secrets out of your task definition and container images.`,
      quiz: [
        {
          question: "What is the purpose of an IAM Task Role in Amazon ECS?",
          options: [
            "To specify which IAM users can pull images from Amazon ECR",
            "To define the network security rules for ECS task traffic",
            "To grant the containerized application permission to call AWS services without embedding credentials",
            "To control which users can deploy tasks to an ECS cluster",
          ],
          correctIndex: 2,
          explanation:
            "IAM Task Roles grant ECS tasks permission to call AWS services (S3, DynamoDB, etc.) using automatically rotated temporary credentials — the same concept as EC2 instance profiles. This is the secure approach; never embed credentials in container images.",
        },
        {
          question:
            "How should sensitive secrets like database passwords be handled in ECS task definitions?",
          options: [
            "Store them in AWS Secrets Manager or SSM Parameter Store and reference them by ARN in the task definition",
            "Pass them as command-line arguments when launching the task",
            "Bake them into the Docker container image at build time",
            "Hardcode them directly in the task definition as plain-text environment variables",
          ],
          correctIndex: 0,
          explanation:
            "Secrets should be stored in AWS Secrets Manager or SSM Parameter Store and referenced from the task definition by ARN. ECS retrieves the secret at task startup and injects it as an environment variable, keeping secrets out of code, images, and task definitions.",
        },
        {
          question:
            "How does ECS integrate with CloudWatch Logs for container logging?",
          options: [
            "ECS automatically captures all logs without any configuration",
            "Configure the awslogs log driver in the task definition to stream container stdout/stderr to CloudWatch",
            "Install the CloudWatch Agent inside each container image",
            "Logs are only available through the ECS console, not CloudWatch",
          ],
          correctIndex: 1,
          explanation:
            "Configuring the awslogs log driver in the task definition tells ECS to stream container stdout/stderr directly to a CloudWatch Log Group. This provides centralized logging without running a separate logging agent inside the container.",
        },
      ],
    },
    {
      heading: "ECS vs. EKS",
      body: `Both ECS and **Amazon EKS (Elastic Kubernetes Service)** are container orchestration services on AWS, but they use different orchestration engines.

ECS uses AWS's own proprietary orchestration system, which is simpler to learn and operates with tight AWS service integration. It is often the right choice for teams new to containers or who want minimal operational complexity on AWS.

EKS runs **Kubernetes** — the open-source container orchestration platform that has become the industry standard. Kubernetes has a large ecosystem of tools and is portable across cloud providers. EKS is ideal for organizations with existing Kubernetes expertise, complex workloads requiring Kubernetes features, or multi-cloud strategies.

Both services support Fargate for serverless compute. The choice between ECS and EKS often comes down to whether you need Kubernetes specifically — if not, ECS is simpler and more AWS-native. For the Cloud Practitioner exam, understand that ECS is AWS's simpler managed container service while EKS is AWS's managed Kubernetes service.`,
      quiz: [
        {
          question:
            "What is the key difference between Amazon ECS and Amazon EKS?",
          options: [
            "ECS requires Fargate; EKS requires EC2 instances",
            "ECS is only available in us-east-1; EKS is available globally",
            "ECS uses AWS's own orchestration engine; EKS runs Kubernetes, the open-source standard",
            "ECS supports Docker containers; EKS only supports OCI containers",
          ],
          correctIndex: 2,
          explanation:
            "ECS uses AWS's proprietary orchestration engine (simpler, AWS-native). EKS runs Kubernetes, the open-source industry-standard orchestration platform with a large ecosystem and portability across cloud providers.",
        },
        {
          question:
            "An organization already has deep Kubernetes expertise and wants to run containers on AWS with their existing tooling. Which service should they use?",
          options: [
            "AWS Lambda with container images",
            "Amazon ECS with Fargate",
            "Amazon ECS with EC2 launch type",
            "Amazon EKS (Elastic Kubernetes Service)",
          ],
          correctIndex: 3,
          explanation:
            "Amazon EKS is AWS's managed Kubernetes service, ideal for organizations with existing Kubernetes expertise. It runs standard Kubernetes, preserving familiarity with existing tools and supporting multi-cloud strategies.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A team wants to run Docker containers on AWS without managing any EC2 instances. Which ECS launch type should they choose?",
      options: [
        "EC2 launch type with Auto Scaling",
        "AWS Fargate",
        "Amazon EKS with managed node groups",
        "AWS Lambda with container image support",
      ],
      correctIndex: 1,
      explanation:
        "AWS Fargate is a serverless compute engine for containers. You specify CPU and memory requirements for your task and Fargate provisions and manages all underlying compute — no EC2 instances to configure, patch, or scale.",
    },
    {
      question:
        "Which ECS object is the blueprint that defines the container image, CPU, memory, and port mappings for an application?",
      options: ["Task Definition", "Cluster", "Service", "Task"],
      correctIndex: 0,
      explanation:
        "A Task Definition is the blueprint for your containerized application. It defines which image to use, how much CPU and memory to allocate, environment variables, networking, logging, and port mappings. Tasks are running instances of a Task Definition.",
    },
    {
      question:
        "A containerized application running in ECS needs to write data to an S3 bucket. What is the correct way to grant this permission?",
      options: [
        "Assign an IAM Task Role with S3 write permissions to the ECS task",
        "Store the access keys in an environment variable in the task definition",
        "Hardcode AWS access keys in the container image",
        "Set the S3 bucket to public access",
      ],
      correctIndex: 0,
      explanation:
        "IAM Task Roles grant ECS tasks temporary, automatically rotated credentials to call AWS services. Assigning a task role with S3 write permissions is the secure approach — hardcoding credentials in images or environment variables is a security risk.",
    },
    {
      question:
        "What is the purpose of Amazon ECR in a containerized application workflow?",
      options: [
        "To store and distribute Docker container images securely",
        "To monitor container performance and send alerts",
        "To orchestrate and schedule Docker containers across a cluster",
        "To provide serverless compute for running containers",
      ],
      correctIndex: 0,
      explanation:
        "Amazon ECR (Elastic Container Registry) is AWS's managed private container image registry. You push Docker images to ECR, and ECS or EKS pulls them when launching containers. It integrates natively with IAM for access control.",
    },
    {
      question:
        "An ECS Service currently runs 3 tasks, but one task crashes due to an application error. What happens?",
      options: [
        "CloudWatch sends an alert and waits for operator intervention",
        "The service remains at 2 tasks until manually restarted",
        "Fargate automatically switches to a different container image",
        "The ECS Service scheduler automatically launches a replacement task to maintain the desired count",
      ],
      correctIndex: 3,
      explanation:
        "ECS Services maintain a desired number of running tasks. If a task crashes or fails health checks, the Service scheduler automatically launches a replacement task to restore the desired count.",
    },
    {
      question:
        "Which service should an organization with existing Kubernetes expertise and a multi-cloud strategy choose for container orchestration on AWS?",
      options: [
        "AWS Elastic Beanstalk with Docker platform",
        "Amazon EKS (Elastic Kubernetes Service)",
        "Amazon ECS with Fargate",
        "Amazon ECS with EC2 launch type",
      ],
      correctIndex: 1,
      explanation:
        "Amazon EKS runs standard Kubernetes, making it ideal for organizations with existing Kubernetes expertise. Kubernetes is portable across cloud providers, supporting multi-cloud strategies with consistent tooling.",
    },
    {
      question:
        "How should a database password be provided to a containerized application running in ECS?",
      options: [
        "Store it in AWS Secrets Manager and reference it by ARN in the ECS task definition",
        "Hardcode it in the Dockerfile so it is baked into the container image",
        "Pass it as a command-line argument when starting the container",
        "Store it in an S3 bucket and have the application download it at startup",
      ],
      correctIndex: 0,
      explanation:
        "Secrets should be stored in AWS Secrets Manager (or SSM Parameter Store) and referenced from the ECS task definition by ARN. ECS retrieves the secret at startup and injects it as an environment variable, keeping sensitive data out of images and task definitions.",
    },
    {
      question:
        "What distinguishes containers from virtual machines in terms of startup time and resource usage?",
      options: [
        "Containers start in seconds and use far less memory than VMs, which include a full OS",
        "VMs start faster because they use hardware virtualization",
        "Containers and VMs have identical startup times but containers use more storage",
        "Containers are slower to start but use fewer resources than VMs",
      ],
      correctIndex: 0,
      explanation:
        "Containers share the host OS kernel, so they start in seconds and use far less memory and storage than VMs. VMs include a full guest OS with a hypervisor, making them heavier — typically taking minutes to start and consuming significantly more resources.",
    },
  ],
};
