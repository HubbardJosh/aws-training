import { ServiceGuide } from "../../../types/guide";

export const sagemakerGuide: ServiceGuide = {
  id: "aif-sagemaker",
  service: "Amazon SageMaker",
  domain: "development",
  tagline: "Fully managed platform to build, train, and deploy ML models at scale",
  intro:
    "Amazon SageMaker is AWS's comprehensive machine learning platform, providing every tool a data scientist or ML engineer needs to prepare data, build algorithms, train models at scale, evaluate results, and deploy models into production — all within a single managed service.",

  sections: [
    {
      heading: "Platform Overview and Core Philosophy",
      body: `SageMaker's design philosophy is that ML projects follow a predictable lifecycle — data preparation, feature engineering, model training, evaluation, deployment, and monitoring — and each phase has distinct infrastructure requirements. Historically, teams stitched together separate tools for each phase, creating brittle pipelines and environment inconsistencies. SageMaker integrates all of these phases into a coherent platform so that a model developed in a notebook can flow through training, evaluation, and deployment without leaving the service.

At the highest level, SageMaker provides **managed compute** (you specify instance types and counts; SageMaker provisions, runs your job, and terminates the instances automatically), **integrated storage** (S3 for datasets and model artifacts, EFS for shared file systems in training clusters), and **managed networking** (VPC support, private endpoints, no public internet required). This managed infrastructure model means data scientists spend time on algorithms rather than DevOps.`,
    },
    {
      heading: "Data Preparation and Feature Engineering",
      body: `Data preparation is typically 70-80% of the work in any ML project. SageMaker addresses this with several tools. **SageMaker Data Wrangler** provides a visual interface for exploring, transforming, and validating datasets — you can profile data distributions, detect class imbalances, apply over 300 built-in transforms, and export the resulting pipeline as code. This is particularly useful for analysts who need to clean data without writing Spark jobs from scratch.

**SageMaker Feature Store** is a purpose-built repository for ML features — the processed, derived values computed from raw data that your model actually trains on. Feature Store maintains both an **online store** (low-latency reads for real-time inference, backed by DynamoDB) and an **offline store** (historical features for training, stored in S3 in Parquet format). The separation ensures training and serving use consistent feature definitions, eliminating training-serving skew. Features are versioned and discoverable across teams, promoting reuse.

**SageMaker Processing** runs distributed data processing jobs using your own container or a built-in framework (Scikit-learn, Spark, TensorFlow). Processing jobs scale horizontally, keep your data in VPCs, and integrate with S3 for input/output.`,
    },
    {
      heading: "Model Training",
      body: `SageMaker's training infrastructure is its most mature capability. A **Training Job** specifies the algorithm or training script, the instance type and count, input data locations in S3, and hyperparameters. SageMaker provisions the instances, copies data from S3, runs your training script, and saves the resulting **model artifact** (typically a \`model.tar.gz\`) back to S3. Instances are terminated automatically, so you pay only for actual compute time.

SageMaker offers a library of **built-in algorithms** (XGBoost, Linear Learner, K-Means, Neural Topic Model, BlazingText, etc.) that are highly optimized and support distributed training out of the box. For custom models, SageMaker supports **script mode** — you write a standard training script in TensorFlow, PyTorch, Scikit-learn, or MXNet, and SageMaker wraps it in a managed container. For maximum flexibility, you can bring your own container.

**Distributed training** options include data parallelism (splitting the dataset across GPUs/instances, each running a full model copy) and model parallelism (splitting the model itself across GPUs when it exceeds single-GPU memory). The **SageMaker Model Parallel Library** and **SageMaker Data Parallel Library** are AWS-built implementations integrated with PyTorch and TensorFlow. **Spot Training** uses EC2 Spot Instances to reduce training costs by up to 90%, with automatic checkpointing to handle interruptions.`,
    },
    {
      heading: "Hyperparameter Tuning and Experiments",
      body: `Finding the best hyperparameters (learning rate, batch size, network depth, regularization strength) typically requires running many training jobs with different configurations — a process called hyperparameter optimization (HPO). **SageMaker Automatic Model Tuning** (AMT) automates this using **Bayesian optimization** or random search: it runs parallel training jobs, observes which configurations produce better metrics, and focuses subsequent trials on the most promising hyperparameter regions. You define the metric to optimize (validation loss, accuracy, AUC) and the search ranges for each hyperparameter.

**SageMaker Experiments** tracks every training run — parameters, metrics, artifacts, and metadata — in a searchable repository. Each run is an **Experiment** containing **Trials**, each Trial containing **Trial Components** (individual training jobs, processing jobs, or notebook runs). This makes it easy to compare dozens of runs, reproduce any previous result, and audit model lineage from raw data through final deployment. Experiments integrates with SageMaker Pipelines for automated tracking.`,
    },
    {
      heading: "Model Deployment and Serving",
      body: `After training, SageMaker offers multiple deployment options depending on latency, throughput, and cost requirements. A **Real-Time Endpoint** is a persistent HTTPS endpoint backed by one or more instances. You specify the model artifact location, container image, and instance type, and SageMaker handles the serving infrastructure, load balancing, and health checks. You can update the endpoint with new model versions using **Blue/Green deployment** without downtime.

**Multi-Model Endpoints** host thousands of models behind a single endpoint, loading models on demand and evicting less-used ones from memory — ideal for multi-tenant SaaS where each tenant has its own model. **Multi-Container Endpoints** run different containers in sequence (a preprocessing container, an inference container, a post-processing container) as a pipeline.

**Batch Transform** runs inference on large datasets asynchronously — you point it at an S3 input location, it runs predictions in parallel across a fleet of instances, and writes results back to S3. This avoids the need for a persistent endpoint when you only need periodic bulk scoring. **Serverless Inference** provisions compute only during active requests and scales to zero when idle, making it cost-effective for spiky or low-traffic workloads.`,
    },
    {
      heading: "MLOps: Pipelines, Model Registry, and Model Monitor",
      body: `Production ML requires automation and governance beyond one-off training runs. **SageMaker Pipelines** provides a directed acyclic graph (DAG) workflow engine for ML. You define Pipeline Steps (Processing, Training, Evaluation, Condition, Register, etc.) using a Python SDK, and SageMaker orchestrates them in order, passing artifacts between steps. Pipelines are versioned, auditable, and can be triggered from EventBridge or called from CI/CD systems like CodePipeline.

**SageMaker Model Registry** is a versioned catalog of trained models with approval workflows. When a Pipelines training run produces a satisfactory model, you register it with metadata (metrics, training job ARN, data lineage) and set its status to \`Pending\` or \`Approved\`. Deployment systems can query the Registry for the latest \`Approved\` model and deploy it automatically.

**SageMaker Model Monitor** continuously evaluates live traffic against a baseline you establish at deployment time. It detects **data quality drift** (input feature distributions diverging from training data), **model quality drift** (predictions degrading relative to ground truth labels), **bias drift** (protected attribute distributions shifting), and **feature attribution drift** (SHAP values changing). Alerts integrate with CloudWatch, allowing automated retraining pipelines to trigger when drift thresholds are breached.`,
    },
  ],

  keyFacts: [
    "End-to-end ML platform: data prep, training, tuning, deployment, monitoring",
    "SageMaker Studio is the web-based IDE for all SageMaker features",
    "Built-in algorithms: XGBoost, Linear Learner, K-Means, BlazingText, and more",
    "Spot Training reduces training costs up to 90% with automatic checkpointing",
    "Feature Store has online (low-latency) and offline (historical) tiers",
    "Automatic Model Tuning uses Bayesian optimization for hyperparameter search",
    "Model Registry provides version control and approval workflows for trained models",
    "Model Monitor detects data drift, model drift, bias drift, and feature attribution drift",
    "SageMaker Pipelines provides DAG-based ML workflow orchestration",
    "Supports BYOC (Bring Your Own Container) for maximum algorithm flexibility",
  ],

  relatedServices: [
    "Amazon S3",
    "Amazon Bedrock",
    "AWS Step Functions",
    "Amazon CloudWatch",
    "AWS CodePipeline",
    "Amazon ECR",
  ],

  examTips: [
    "SageMaker = the ML platform; Bedrock = managed access to pre-built foundation models",
    "Feature Store prevents training-serving skew by standardizing feature definitions",
    "Model Monitor is how you detect drift in production — know all four drift types",
    "Batch Transform is for bulk offline inference; Real-Time Endpoints are for live requests",
    "Pipelines is SageMaker's MLOps workflow engine — creates reproducible, auditable pipelines",
    "Spot Training requires checkpointing enabled to survive instance interruptions",
    "Multi-Model Endpoints reduce cost for many similar models sharing an endpoint",
    "SageMaker Clarify detects bias and explains model predictions using SHAP values",
  ],
};
