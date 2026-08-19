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
    },
    {
      heading: "Configuration and Customization",
      body: `While Beanstalk handles most configuration automatically, you retain full control over the environment configuration.

The **Beanstalk configuration files** (\`.ebextensions\`) allow you to customize almost everything: install additional packages, configure environment variables, run commands on deployment, configure the load balancer, set up cron jobs, and modify Auto Scaling policies. These files are YAML or JSON files placed in a \`.ebextensions\` folder in your application bundle.

**Environment variables** are configured through the Beanstalk console or CLI and injected into your application at runtime. This is the correct way to supply database connection strings, API keys (stored in Secrets Manager and referenced here), and environment-specific configuration.

Beanstalk integrates with **Amazon RDS** in two ways: you can create a database within the Beanstalk environment (simpler but the database is deleted with the environment) or connect to an external RDS instance (recommended for production so the database survives independently of the Beanstalk environment).

The Beanstalk **worker tier** handles background processing tasks. A worker environment polls an SQS queue for messages and processes them, decoupling CPU-intensive background work from the web-serving tier.`,
    },
    {
      heading: "When to Use Elastic Beanstalk",
      body: `Elastic Beanstalk is not the right choice for every workload, but it shines in specific scenarios.

**Ideal use cases** include teams that want to deploy a standard web application quickly without deep AWS expertise, startups that need to go from code to production in minutes, and organizations that want a PaaS experience with the ability to access underlying AWS resources directly.

**Consider alternatives when**: you need fine-grained control over infrastructure configuration beyond what \`.ebextensions\` supports (use CloudFormation or CDK), you are deploying containerized microservices at scale (use ECS or EKS), you are building serverless APIs (use Lambda + API Gateway), or your application has unusual dependencies not supported by Beanstalk's managed platforms.

For the Cloud Practitioner exam, the key positioning of Elastic Beanstalk is: it is the **simplest way to deploy a traditional web application** on AWS. It abstracts away infrastructure complexity, supports common web platforms, and handles scaling and health monitoring automatically. You pay only for the resources it creates — Beanstalk itself costs nothing.`,
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
};
