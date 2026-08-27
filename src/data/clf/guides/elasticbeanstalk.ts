import { ServiceGuide } from "../../../types/guide";

export const elasticBeanstalkGuide: ServiceGuide = {
  id: "clf-elasticbeanstalk",
  service: "AWS Elastic Beanstalk",
  domain: "deployment",
  tagline: "Deploy and scale web applications without managing infrastructure",
  intro:
    "AWS Elastic Beanstalk is a fully managed platform-as-a-service (PaaS) that handles the deployment, capacity provisioning, load balancing, auto scaling, and health monitoring of your web applications — letting you focus on writing code rather than managing infrastructure.",

  sections: [
    {
      heading: "What Is Elastic Beanstalk?",
      body: `Elastic Beanstalk is often described as the easiest way to deploy an application on AWS. You upload your application code, Beanstalk handles the rest: choosing and configuring the appropriate AWS resources (EC2 instances, load balancers, Auto Scaling groups), deploying your code, and monitoring the environment's health.

Beanstalk is a **Platform as a Service (PaaS)** — AWS manages the platform (the compute, networking, and runtime environment), while you manage only the application code and its configuration. This is in contrast to **Infrastructure as a Service (IaaS)** like bare EC2 instances, where you manage everything from the OS up.

The key insight is that Beanstalk does not introduce new infrastructure types — it creates and configures standard AWS resources (EC2, ELB, ASG, RDS, CloudWatch) on your behalf. You still own and can access all those resources; Beanstalk simply automates their configuration and management.

Importantly, **Elastic Beanstalk itself is free** — you pay only for the underlying AWS resources it provisions.`,
      quiz: [
        {
          question:
            "How is AWS Elastic Beanstalk classified in the cloud service model?",
          options: [
            "Infrastructure as a Service (IaaS)",
            "Software as a Service (SaaS)",
            "Platform as a Service (PaaS)",
            "Function as a Service (FaaS)",
          ],
          correctIndex: 2,
          explanation:
            "Elastic Beanstalk is a Platform as a Service (PaaS). AWS manages the platform (compute, networking, runtime environment) while you manage only your application code and configuration — unlike IaaS (e.g., bare EC2) where you manage everything from the OS up.",
        },
        {
          question: "How much does AWS Elastic Beanstalk itself cost?",
          options: [
            "A flat monthly fee based on the number of environments",
            "Nothing — Beanstalk is free; you pay only for the underlying resources it provisions",
            "A percentage of the total cost of provisioned resources",
            "Per application deployment, charged per GB of code uploaded",
          ],
          correctIndex: 1,
          explanation:
            "Elastic Beanstalk itself is free. You pay only for the underlying AWS resources it creates on your behalf — EC2 instances, load balancers, RDS databases, etc. The orchestration and management layer costs nothing.",
        },
        {
          question:
            "When Elastic Beanstalk deploys an application, what resources does it create?",
          options: [
            "It creates its own proprietary resource types that are separate from standard AWS services",
            "Standard AWS resources like EC2, ELB, Auto Scaling Groups, and CloudWatch that you can access directly",
            "Only Lambda functions and API Gateway endpoints",
            "Isolated resources that are hidden from the AWS console",
          ],
          correctIndex: 1,
          explanation:
            "Elastic Beanstalk creates and configures standard AWS resources — EC2 instances, Elastic Load Balancers, Auto Scaling Groups, RDS, CloudWatch — on your behalf. You retain full access to these resources through the AWS console.",
        },
      ],
    },
    {
      heading: "Supported Platforms",
      body: `Elastic Beanstalk supports a wide range of popular programming languages and application servers, called **managed platforms**. Supported platforms include:
- **Node.js** (JavaScript/TypeScript applications)
- **Python** (Django, Flask)
- **Java** (Tomcat, Corretto)
- **PHP**
- **Ruby** (Passenger, Puma)
- **.NET** (Windows Server with IIS)
- **Go**
- **Docker** (single-container and multi-container)

For each platform, AWS maintains and automatically applies runtime security patches. This is a key operational benefit: you do not need to manually patch your EC2 instances' runtime environment.

If your application uses a stack not natively supported, the **Docker platform** allows you to package your application in a container and run it on Beanstalk, effectively giving you the flexibility to use any language or framework while still benefiting from Beanstalk's automation.`,
      quiz: [
        {
          question:
            "Which of the following is NOT a managed platform natively supported by Elastic Beanstalk?",
          options: ["Node.js", "Python", "Ruby", "COBOL"],
          correctIndex: 3,
          explanation:
            "Elastic Beanstalk natively supports Node.js, Python, Java, PHP, Ruby, .NET, Go, and Docker. COBOL is not a supported platform. For unsupported languages, the Docker platform allows you to package and run any application.",
        },
        {
          question:
            "What operational benefit does Elastic Beanstalk provide for managed platform runtimes?",
          options: [
            "AWS automatically scales the application based on user traffic",
            "AWS automatically applies runtime security patches to the managed platform",
            "AWS provides 24/7 application support and debugging",
            "AWS automatically optimizes the application code for better performance",
          ],
          correctIndex: 1,
          explanation:
            "For each managed platform (Node.js, Python, Java, etc.), AWS automatically applies runtime security patches. You do not need to manually patch your EC2 instances' runtime environment — this is a key operational benefit of using Beanstalk.",
        },
        {
          question:
            "An application uses a niche programming language not natively supported by Elastic Beanstalk. How can the team still use Beanstalk?",
          options: [
            "They cannot use Beanstalk and must manage EC2 instances directly",
            "They can use the Docker platform to package the application as a container and run it on Beanstalk",
            "They must rewrite the application in a supported language",
            "They can request AWS to add support for the language within 30 days",
          ],
          correctIndex: 1,
          explanation:
            "The Docker platform allows you to package any application as a container and run it on Elastic Beanstalk, regardless of the programming language or framework. This gives flexibility while still benefiting from Beanstalk's deployment automation.",
        },
      ],
    },
    {
      heading: "Environments and Deployment",
      body: `Your application code runs in an **Elastic Beanstalk environment** — a collection of AWS resources configured by Beanstalk to run your application. You can have multiple environments: typically one for development, one for staging, and one for production.

Each environment has a unique URL (like \`myapp.us-east-1.elasticbeanstalk.com\`) where your application is accessible. You can map a custom domain to this URL via Route 53.

Beanstalk supports multiple **deployment policies** that control how new versions are rolled out to your environment:
- **All at once**: deploys to all instances simultaneously — fastest but causes downtime
- **Rolling**: deploys to a batch of instances at a time — reduces capacity during deployment
- **Rolling with additional batch**: adds new instances before removing old ones — maintains full capacity
- **Immutable**: launches a completely new set of instances, then swaps them — safest, no downtime
- **Blue/Green**: uses environment URLs swapping — a deployment to a parallel environment with instant cutover

For production environments, **Immutable** or **Blue/Green** deployments are safest because they allow easy rollback by switching back to the previous version.`,
      quiz: [
        {
          question:
            "Which Elastic Beanstalk deployment policy causes downtime because it deploys to all instances simultaneously?",
          options: ["Immutable", "Rolling", "All at once", "Blue/Green"],
          correctIndex: 2,
          explanation:
            "The 'All at once' deployment policy updates all instances simultaneously — it is the fastest option but causes downtime during the deployment. It should not be used for production environments where availability is critical.",
        },
        {
          question:
            "Which two Elastic Beanstalk deployment policies are considered safest for production and allow easy rollback?",
          options: [
            "All at once and Rolling",
            "Rolling and Rolling with additional batch",
            "Immutable and Blue/Green",
            "All at once and Immutable",
          ],
          correctIndex: 2,
          explanation:
            "Immutable and Blue/Green deployments are safest for production. Immutable launches entirely new instances before swapping, and Blue/Green deploys to a parallel environment with instant URL-swap cutover. Both allow easy rollback without downtime.",
        },
        {
          question:
            "In a Blue/Green deployment on Elastic Beanstalk, how does the traffic cutover happen?",
          options: [
            "Traffic is gradually shifted using weighted routing over 24 hours",
            "The environment URLs are swapped, instantly redirecting all traffic to the new environment",
            "Individual EC2 instances are replaced one at a time in the existing environment",
            "A new load balancer is created and DNS is manually updated",
          ],
          correctIndex: 1,
          explanation:
            "In a Blue/Green deployment, you deploy to a parallel environment (green) while the original (blue) continues serving traffic. The cutover happens by swapping the environment URLs — an instant, atomic switch that allows immediate rollback by swapping back.",
        },
      ],
    },
    {
      heading: "Configuration and Customization",
      body: `While Beanstalk handles most configuration automatically, you retain full control over the environment configuration.

The **Beanstalk configuration files** (\`.ebextensions\`) allow you to customize almost everything: install additional packages, configure environment variables, run commands on deployment, configure the load balancer, set up cron jobs, and modify Auto Scaling policies. These files are YAML or JSON files placed in a \`.ebextensions\` folder in your application bundle.

**Environment variables** are configured through the Beanstalk console or CLI and injected into your application at runtime. This is the correct way to supply database connection strings, API keys (stored in Secrets Manager and referenced here), and environment-specific configuration.

Beanstalk integrates with **Amazon RDS** in two ways: you can create a database within the Beanstalk environment (simpler but the database is deleted with the environment) or connect to an external RDS instance (recommended for production so the database survives independently of the Beanstalk environment).

The Beanstalk **worker tier** handles background processing tasks. A worker environment polls an SQS queue for messages and processes them, decoupling CPU-intensive background work from the web-serving tier.`,
      quiz: [
        {
          question:
            "What is the purpose of the .ebextensions folder in an Elastic Beanstalk application bundle?",
          options: [
            "It stores the application's source code and dependencies",
            "It contains YAML or JSON configuration files that customize the Beanstalk environment",
            "It holds SSL certificates for HTTPS configuration",
            "It is required for Docker deployments to specify the container image",
          ],
          correctIndex: 1,
          explanation:
            ".ebextensions files (YAML or JSON) placed in the .ebextensions folder allow you to customize almost everything: install packages, run deployment commands, configure the load balancer, set up cron jobs, and modify Auto Scaling policies.",
        },
        {
          question:
            "For a production application, how should the RDS database be configured in relation to Elastic Beanstalk?",
          options: [
            "Create the RDS instance inside the Beanstalk environment so it scales automatically",
            "Create a separate external RDS instance outside Beanstalk so the database persists independently",
            "Use DynamoDB instead, as RDS cannot integrate with Beanstalk",
            "Create a new RDS instance for each deployment to ensure a clean state",
          ],
          correctIndex: 1,
          explanation:
            "For production, create RDS outside the Beanstalk environment and connect to it as an external database. If the database is created inside the Beanstalk environment, it will be deleted when the environment is deleted — a serious risk for production data.",
        },
        {
          question: "What is the Elastic Beanstalk worker tier used for?",
          options: [
            "Running the primary web application that serves HTTP requests",
            "Polling an SQS queue and processing background tasks decoupled from the web tier",
            "Monitoring application health and sending alerts to CloudWatch",
            "Managing database connections for the web application",
          ],
          correctIndex: 1,
          explanation:
            "The worker tier polls an SQS queue for messages and processes them in the background. This decouples CPU-intensive or slow background work (like sending emails or generating reports) from the web-serving tier, improving responsiveness.",
        },
      ],
    },
    {
      heading: "When to Use Elastic Beanstalk",
      body: `Elastic Beanstalk is not the right choice for every workload, but it shines in specific scenarios.

**Ideal use cases** include teams that want to deploy a standard web application quickly without deep AWS expertise, startups that need to go from code to production in minutes, and organizations that want a PaaS experience with the ability to access underlying AWS resources directly.

**Consider alternatives when**: you need fine-grained control over infrastructure configuration beyond what \`.ebextensions\` supports (use CloudFormation or CDK), you are deploying containerized microservices at scale (use ECS or EKS), you are building serverless APIs (use Lambda + API Gateway), or your application has unusual dependencies not supported by Beanstalk's managed platforms.

For the Cloud Practitioner exam, the key positioning of Elastic Beanstalk is: it is the **simplest way to deploy a traditional web application** on AWS. It abstracts away infrastructure complexity, supports common web platforms, and handles scaling and health monitoring automatically. You pay only for the resources it creates — Beanstalk itself costs nothing.`,
      quiz: [
        {
          question: "Which scenario is Elastic Beanstalk best suited for?",
          options: [
            "Deploying hundreds of containerized microservices with complex interdependencies",
            "Deploying a traditional web application quickly without requiring deep AWS infrastructure expertise",
            "Running serverless event-driven functions in response to S3 uploads",
            "Managing multi-account AWS Organizations with governance controls",
          ],
          correctIndex: 1,
          explanation:
            "Elastic Beanstalk is ideal for teams wanting to deploy a standard web application quickly without deep AWS expertise. It abstracts infrastructure complexity, supports common web platforms, and handles scaling and health monitoring automatically.",
        },
        {
          question:
            "When should you consider using ECS or EKS instead of Elastic Beanstalk?",
          options: [
            "When you want AWS to manage all infrastructure automatically",
            "When you are deploying containerized microservices at scale requiring orchestration features",
            "When your application is written in Node.js or Python",
            "When you need auto scaling and load balancing for your application",
          ],
          correctIndex: 1,
          explanation:
            "ECS or EKS are better choices when deploying containerized microservices at scale, as they provide the container orchestration features (service discovery, rolling deploys, task scheduling) that Beanstalk does not natively support at scale.",
        },
      ],
    },
  ],

  keyFacts: [
    "Elastic Beanstalk is a PaaS — you provide code, AWS manages the infrastructure",
    "Elastic Beanstalk itself is free — you pay only for EC2, ELB, RDS, etc. it creates",
    "Supported platforms: Node.js, Python, Java, PHP, Ruby, .NET, Go, Docker",
    "Creates standard AWS resources (EC2, ELB, ASG, CloudWatch) — you can still access them directly",
    "Multiple deployment policies: All at once, Rolling, Immutable, Blue/Green",
    "Immutable and Blue/Green deployments are safest for production — easy rollback",
    ".ebextensions folder customizes the environment with YAML/JSON configuration files",
    "Worker tier handles background tasks by polling an SQS queue",
    "Multiple environments (dev, staging, prod) from the same application code",
    "AWS patches the managed runtime platform automatically",
  ],

  relatedServices: [
    "Amazon EC2",
    "Elastic Load Balancing",
    "AWS Auto Scaling",
    "Amazon RDS",
    "Amazon CloudWatch",
    "Amazon SQS",
  ],

  examTips: [
    "Beanstalk = PaaS — upload code, AWS handles infrastructure; you still own the resources",
    "Beanstalk is free — cost comes from EC2, ELB, RDS, and other provisioned resources",
    "All at once deployment causes downtime; Immutable/Blue-Green do not",
    "Blue/Green swaps environment URLs for zero-downtime with instant rollback",
    "For production databases, use an external RDS not tied to the Beanstalk environment",
    "Worker tier + SQS = background job processing decoupled from the web tier",
    ".ebextensions customizes environment settings without AWS Console clicks",
    "AWS patches the managed runtime — you still patch OS of custom AMI instances",
  ],

  topicQuiz: [
    {
      question:
        "A startup wants to deploy their Node.js web application on AWS as quickly as possible without learning how to configure EC2, load balancers, and Auto Scaling. Which service is most appropriate?",
      options: [
        "Amazon ECS with Fargate",
        "AWS CloudFormation",
        "AWS Elastic Beanstalk",
        "Amazon EC2 with manual configuration",
      ],
      correctIndex: 2,
      explanation:
        "Elastic Beanstalk is designed exactly for this use case. You upload your Node.js code and Beanstalk automatically configures EC2, ELB, Auto Scaling, and health monitoring. No infrastructure expertise required.",
    },
    {
      question:
        "What is the correct description of the Elastic Beanstalk pricing model?",
      options: [
        "A flat monthly fee plus per-deployment charges",
        "Elastic Beanstalk itself is free; you pay for the underlying resources it provisions",
        "Pay per request processed by the web application",
        "A percentage of EC2 On-Demand pricing for managed resources",
      ],
      correctIndex: 1,
      explanation:
        "Elastic Beanstalk itself has no additional cost. You pay only for the underlying AWS resources it provisions — EC2 instances, load balancers, RDS databases, etc. The management and orchestration layer is free.",
    },
    {
      question:
        "Which Elastic Beanstalk deployment policy is fastest but causes application downtime?",
      options: ["Rolling", "Immutable", "Blue/Green", "All at once"],
      correctIndex: 3,
      explanation:
        "The 'All at once' policy deploys to all instances simultaneously — it is the fastest policy but takes the entire application offline during the deployment. It is not appropriate for production environments that require high availability.",
    },
    {
      question:
        "A production Elastic Beanstalk application uses an RDS database created inside the Beanstalk environment. What is the risk of this configuration?",
      options: [
        "The database will not support Multi-AZ in this configuration",
        "The database will be deleted if the Beanstalk environment is deleted",
        "RDS inside a Beanstalk environment cannot be encrypted",
        "The database will not auto-scale with the application tier",
      ],
      correctIndex: 1,
      explanation:
        "When RDS is created inside a Beanstalk environment, it is tied to that environment's lifecycle. Deleting the environment deletes the database — a serious risk for production data. Best practice is to create RDS separately and connect it as an external database.",
    },
    {
      question: "What does the Elastic Beanstalk worker tier do?",
      options: [
        "It serves as the primary web server for HTTP requests",
        "It polls an SQS queue and processes background tasks decoupled from the web tier",
        "It monitors application health and restarts failed instances",
        "It manages database connection pooling for the web application",
      ],
      correctIndex: 1,
      explanation:
        "The worker tier polls an SQS queue for messages and processes them asynchronously. This decouples long-running or CPU-intensive background work from the web-serving tier, preventing background tasks from slowing down user-facing requests.",
    },
    {
      question:
        "Which file/folder mechanism in Elastic Beanstalk allows you to install additional packages and configure environment settings as part of deployment?",
      options: [
        "buildspec.yml in the application root",
        ".beanstalkignore file",
        ".ebextensions folder with YAML or JSON config files",
        "Procfile for process configuration",
      ],
      correctIndex: 2,
      explanation:
        "The .ebextensions folder contains YAML or JSON configuration files that customize the Beanstalk environment during deployment. You can install packages, run commands, configure the load balancer, set up cron jobs, and modify Auto Scaling policies.",
    },
    {
      question:
        "Which Elastic Beanstalk deployment method deploys to a completely new set of instances and then swaps them in, providing zero downtime with easy rollback?",
      options: [
        "All at once",
        "Rolling",
        "Rolling with additional batch",
        "Immutable",
      ],
      correctIndex: 3,
      explanation:
        "Immutable deployment launches a completely new set of instances with the new version, verifies health, and then swaps them into service. The old instances remain until the swap is confirmed. This provides zero downtime and allows rollback by keeping the old instances available.",
    },
    {
      question:
        "Elastic Beanstalk supports which of the following programming platforms natively?",
      options: [
        "Node.js, Python, Java, PHP, Ruby, .NET, Go, and Docker",
        "Only languages that compile to native binaries",
        "Only web frameworks that use HTTP/2",
        "Node.js and Python only",
      ],
      correctIndex: 0,
      explanation:
        "Elastic Beanstalk supports Node.js, Python, Java (Tomcat/Corretto), PHP, Ruby, .NET (Windows Server with IIS), Go, and Docker. For unsupported languages, the Docker platform provides flexibility to run any application.",
    },
  ],
};
