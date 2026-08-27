import { ServiceGuide } from "../../../types/guide";

export const sagemakerGuide: ServiceGuide = {
  id: "aif-sagemaker",
  service: "Amazon SageMaker",
  domain: "development",
  tagline:
    "Fully managed platform to build, train, and deploy ML models at scale",
  intro:
    "Amazon SageMaker is AWS's comprehensive machine learning platform, providing every tool a data scientist or ML engineer needs to prepare data, build algorithms, train models at scale, evaluate results, and deploy models into production — all within a single managed service.",

  sections: [
    {
      heading: "Platform Overview and Core Philosophy",
      body: `SageMaker's design philosophy is that ML projects follow a predictable lifecycle — data preparation, feature engineering, model training, evaluation, deployment, and monitoring — and each phase has distinct infrastructure requirements. Historically, teams stitched together separate tools for each phase, creating brittle pipelines and environment inconsistencies. SageMaker integrates all of these phases into a coherent platform so that a model developed in a notebook can flow through training, evaluation, and deployment without leaving the service.

At the highest level, SageMaker provides **managed compute** (you specify instance types and counts; SageMaker provisions, runs your job, and terminates the instances automatically), **integrated storage** (S3 for datasets and model artifacts, EFS for shared file systems in training clusters), and **managed networking** (VPC support, private endpoints, no public internet required). This managed infrastructure model means data scientists spend time on algorithms rather than DevOps.`,
      quiz: [
        {
          question:
            "What is the core design philosophy behind Amazon SageMaker as an ML platform?",
          options: [
            "To provide pre-trained foundation models that customers can use without any training",
            "To integrate all phases of the ML lifecycle (data prep, training, evaluation, deployment, monitoring) into a single managed service",
            "To replace data scientists with automated AutoML pipelines that require no human involvement",
            "To provide a serverless inference platform for models trained outside of AWS",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker's design philosophy is that ML projects follow a predictable lifecycle, and each phase has distinct infrastructure needs. By integrating all phases (data preparation, feature engineering, training, evaluation, deployment, monitoring) into one platform, it eliminates the brittle pipelines created by stitching together separate tools.",
        },
        {
          question:
            "Where does Amazon SageMaker store datasets and trained model artifacts?",
          options: [
            "Amazon DynamoDB for datasets; Amazon ECR for model artifacts",
            "Amazon EFS exclusively for both datasets and model artifacts",
            "Amazon S3 for datasets and model artifacts; Amazon EFS for shared file systems in training clusters",
            "Amazon RDS for structured datasets; Amazon S3 for unstructured model artifacts",
          ],
          correctIndex: 2,
          explanation:
            "SageMaker uses Amazon S3 as the primary storage for both training datasets and model artifacts (model.tar.gz files). Amazon EFS is used for shared file systems in distributed training clusters where multiple nodes need simultaneous access to the same files.",
        },
      ],
    },
    {
      heading: "Data Preparation and Feature Engineering",
      body: `Data preparation is typically 70-80% of the work in any ML project. SageMaker addresses this with several tools. **SageMaker Data Wrangler** provides a visual interface for exploring, transforming, and validating datasets — you can profile data distributions, detect class imbalances, apply over 300 built-in transforms, and export the resulting pipeline as code. This is particularly useful for analysts who need to clean data without writing Spark jobs from scratch.

**SageMaker Feature Store** is a purpose-built repository for ML features — the processed, derived values computed from raw data that your model actually trains on. Feature Store maintains both an **online store** (low-latency reads for real-time inference, backed by DynamoDB) and an **offline store** (historical features for training, stored in S3 in Parquet format). The separation ensures training and serving use consistent feature definitions, eliminating training-serving skew. Features are versioned and discoverable across teams, promoting reuse.

**SageMaker Processing** runs distributed data processing jobs using your own container or a built-in framework (Scikit-learn, Spark, TensorFlow). Processing jobs scale horizontally, keep your data in VPCs, and integrate with S3 for input/output.`,
      quiz: [
        {
          question:
            "What problem does Amazon SageMaker Feature Store's dual online/offline architecture solve?",
          options: [
            "It reduces storage costs by tiering features between hot and cold storage",
            "It eliminates training-serving skew by ensuring both training jobs and real-time inference use consistent, versioned feature definitions",
            "It allows multiple ML models to share the same training dataset without data duplication",
            "It provides automatic feature importance ranking to identify which features to include",
          ],
          correctIndex: 1,
          explanation:
            "Training-serving skew occurs when the features used during training are computed differently than those used at inference time. Feature Store eliminates this by maintaining a single versioned feature definition used by both the offline store (for training) and the online store (for real-time inference).",
        },
        {
          question:
            "Which SageMaker Feature Store tier provides low-latency reads for real-time inference, and what backs it?",
          options: [
            "The offline store, backed by Amazon S3 in Parquet format",
            "The online store, backed by Amazon DynamoDB",
            "The online store, backed by Amazon ElastiCache for Redis",
            "The real-time store, backed by Amazon Kinesis Data Streams",
          ],
          correctIndex: 1,
          explanation:
            "The Feature Store online store provides low-latency reads for real-time inference and is backed by Amazon DynamoDB. The offline store (backed by S3 in Parquet format) is used for training, where high throughput matters more than low latency.",
        },
      ],
    },
    {
      heading: "Model Training",
      body: `SageMaker's training infrastructure is its most mature capability. A **Training Job** specifies the algorithm or training script, the instance type and count, input data locations in S3, and hyperparameters. SageMaker provisions the instances, copies data from S3, runs your training script, and saves the resulting **model artifact** (typically a \`model.tar.gz\`) back to S3. Instances are terminated automatically, so you pay only for actual compute time.

SageMaker offers a library of **built-in algorithms** (XGBoost, Linear Learner, K-Means, Neural Topic Model, BlazingText, etc.) that are highly optimized and support distributed training out of the box. For custom models, SageMaker supports **script mode** — you write a standard training script in TensorFlow, PyTorch, Scikit-learn, or MXNet, and SageMaker wraps it in a managed container. For maximum flexibility, you can bring your own container.

**Distributed training** options include data parallelism (splitting the dataset across GPUs/instances, each running a full model copy) and model parallelism (splitting the model itself across GPUs when it exceeds single-GPU memory). The **SageMaker Model Parallel Library** and **SageMaker Data Parallel Library** are AWS-built implementations integrated with PyTorch and TensorFlow. **Spot Training** uses EC2 Spot Instances to reduce training costs by up to 90%, with automatic checkpointing to handle interruptions.`,
      quiz: [
        {
          question:
            "What is required when using SageMaker Spot Training to ensure training can resume if a Spot Instance is interrupted?",
          options: [
            "Using only SageMaker built-in algorithms, which handle interruptions automatically",
            "Enabling automatic checkpointing so training progress is saved and can be resumed",
            "Using a minimum of two instances so training continues on the remaining instance",
            "Setting a maximum training duration that is shorter than typical Spot interruption windows",
          ],
          correctIndex: 1,
          explanation:
            "Spot Training requires checkpointing to be enabled. When a Spot Instance is reclaimed, the training job saves its state as a checkpoint to S3. When a new Spot Instance becomes available, training resumes from the checkpoint rather than starting over.",
        },
        {
          question:
            "When would you choose model parallelism over data parallelism in SageMaker distributed training?",
          options: [
            "When your dataset is too large to fit in the memory of a single instance",
            "When your model is too large to fit in the memory of a single GPU",
            "When you want to reduce training time by using more instances",
            "When you are using a built-in algorithm that does not support script mode",
          ],
          correctIndex: 1,
          explanation:
            "Model parallelism splits the model itself across multiple GPUs, and is the correct approach when the model is too large to fit in a single GPU's memory. Data parallelism splits the dataset across instances (each running a full model copy) and is for accelerating training speed, not for memory-constrained models.",
        },
      ],
    },
    {
      heading: "Hyperparameter Tuning and Experiments",
      body: `Finding the best hyperparameters (learning rate, batch size, network depth, regularization strength) typically requires running many training jobs with different configurations — a process called hyperparameter optimization (HPO). **SageMaker Automatic Model Tuning** (AMT) automates this using **Bayesian optimization** or random search: it runs parallel training jobs, observes which configurations produce better metrics, and focuses subsequent trials on the most promising hyperparameter regions. You define the metric to optimize (validation loss, accuracy, AUC) and the search ranges for each hyperparameter.

**SageMaker Experiments** tracks every training run — parameters, metrics, artifacts, and metadata — in a searchable repository. Each run is an **Experiment** containing **Trials**, each Trial containing **Trial Components** (individual training jobs, processing jobs, or notebook runs). This makes it easy to compare dozens of runs, reproduce any previous result, and audit model lineage from raw data through final deployment. Experiments integrates with SageMaker Pipelines for automated tracking.`,
      quiz: [
        {
          question:
            "Which optimization strategy does SageMaker Automatic Model Tuning use by default to focus hyperparameter search on the most promising regions?",
          options: [
            "Grid search — exhaustively testing every combination in the defined ranges",
            "Genetic algorithms — evolving hyperparameter configurations across generations",
            "Bayesian optimization — using results from previous trials to guide the search toward better configurations",
            "Simulated annealing — gradually narrowing the search space based on a temperature schedule",
          ],
          correctIndex: 2,
          explanation:
            "SageMaker Automatic Model Tuning uses Bayesian optimization by default. It runs parallel training jobs, observes which configurations produce better metrics, and uses a probabilistic model to focus subsequent trials on the most promising hyperparameter regions — more efficient than grid or random search.",
        },
        {
          question:
            "What is the hierarchy of tracking objects in Amazon SageMaker Experiments?",
          options: [
            "Experiment → Run → Artifact",
            "Experiment → Trial → Trial Component",
            "Project → Experiment → Training Job",
            "Pipeline → Experiment → Model Version",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Experiments uses the hierarchy: Experiment (top-level grouping) → Trials (individual runs within the experiment) → Trial Components (individual jobs such as training, processing, or notebook runs that make up a trial).",
        },
      ],
    },
    {
      heading: "Model Deployment and Serving",
      body: `After training, SageMaker offers multiple deployment options depending on latency, throughput, and cost requirements. A **Real-Time Endpoint** is a persistent HTTPS endpoint backed by one or more instances. You specify the model artifact location, container image, and instance type, and SageMaker handles the serving infrastructure, load balancing, and health checks. You can update the endpoint with new model versions using **Blue/Green deployment** without downtime.

**Multi-Model Endpoints** host thousands of models behind a single endpoint, loading models on demand and evicting less-used ones from memory — ideal for multi-tenant SaaS where each tenant has its own model. **Multi-Container Endpoints** run different containers in sequence (a preprocessing container, an inference container, a post-processing container) as a pipeline.

**Batch Transform** runs inference on large datasets asynchronously — you point it at an S3 input location, it runs predictions in parallel across a fleet of instances, and writes results back to S3. This avoids the need for a persistent endpoint when you only need periodic bulk scoring. **Serverless Inference** provisions compute only during active requests and scales to zero when idle, making it cost-effective for spiky or low-traffic workloads.`,
      quiz: [
        {
          question:
            "You need to run predictions on 50 million records in S3 overnight. No real-time inference is needed. Which SageMaker deployment option is most appropriate?",
          options: [
            "Real-Time Endpoint — scale it up for the overnight job then scale it back down",
            "Batch Transform — runs inference on large S3 datasets asynchronously and writes results back to S3",
            "Serverless Inference — it automatically scales to handle large burst workloads",
            "Multi-Model Endpoint — it can load all 50 million records as individual models",
          ],
          correctIndex: 1,
          explanation:
            "Batch Transform is designed for bulk offline inference. It reads input data from S3, runs predictions in parallel across a fleet of instances, and writes results back to S3 — without requiring a persistent endpoint. It is the correct choice for periodic bulk scoring jobs.",
        },
        {
          question:
            "Which SageMaker deployment option is best for a SaaS application where each of thousands of customers has their own separately trained model?",
          options: [
            "Real-Time Endpoints — one endpoint per customer model",
            "Batch Transform — run all customer models as a nightly batch job",
            "Multi-Model Endpoints — host thousands of models behind one endpoint, loading on demand",
            "Serverless Inference — it automatically routes requests to the correct model",
          ],
          correctIndex: 2,
          explanation:
            "Multi-Model Endpoints are specifically designed for multi-tenant scenarios where thousands of models share a single endpoint. SageMaker loads models into memory on demand and evicts less-used ones, avoiding the cost of running one endpoint per customer.",
        },
      ],
    },
    {
      heading: "MLOps: Pipelines, Model Registry, and Model Monitor",
      body: `Production ML requires automation and governance beyond one-off training runs. **SageMaker Pipelines** provides a directed acyclic graph (DAG) workflow engine for ML. You define Pipeline Steps (Processing, Training, Evaluation, Condition, Register, etc.) using a Python SDK, and SageMaker orchestrates them in order, passing artifacts between steps. Pipelines are versioned, auditable, and can be triggered from EventBridge or called from CI/CD systems like CodePipeline.

**SageMaker Model Registry** is a versioned catalog of trained models with approval workflows. When a Pipelines training run produces a satisfactory model, you register it with metadata (metrics, training job ARN, data lineage) and set its status to \`Pending\` or \`Approved\`. Deployment systems can query the Registry for the latest \`Approved\` model and deploy it automatically.

**SageMaker Model Monitor** continuously evaluates live traffic against a baseline you establish at deployment time. It detects **data quality drift** (input feature distributions diverging from training data), **model quality drift** (predictions degrading relative to ground truth labels), **bias drift** (protected attribute distributions shifting), and **feature attribution drift** (SHAP values changing). Alerts integrate with CloudWatch, allowing automated retraining pipelines to trigger when drift thresholds are breached.`,
      quiz: [
        {
          question:
            "Which of the following drift types does Amazon SageMaker Model Monitor detect?",
          options: [
            "Infrastructure drift, cost drift, latency drift, and availability drift",
            "Data quality drift, model quality drift, bias drift, and feature attribution drift",
            "Training data drift, validation data drift, test data drift, and production data drift",
            "Label drift, feature drift, prediction drift, and accuracy drift",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Model Monitor detects four drift types: data quality drift (input features diverging from training baseline), model quality drift (prediction quality degrading), bias drift (protected attribute distributions shifting), and feature attribution drift (SHAP values changing). All four are exam-relevant.",
        },
        {
          question:
            "What is the purpose of SageMaker Model Registry in an MLOps workflow?",
          options: [
            "It stores training datasets and feature definitions for model reproducibility",
            "It is a versioned catalog of trained models with approval workflows, enabling controlled promotion of models to production",
            "It provides a marketplace of pre-trained models available for immediate deployment",
            "It tracks experiment results and hyperparameter configurations across training runs",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Model Registry is a versioned catalog of trained models with approval workflows. Models are registered with metadata (metrics, lineage) and given a status (Pending/Approved). Deployment pipelines query the Registry for the latest Approved model — enabling controlled, auditable model promotion.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A data science team is running hundreds of training experiments with different hyperparameter configurations. Which SageMaker feature should they use to automatically find the best configuration?",
      options: [
        "SageMaker Experiments — it compares runs and selects the best hyperparameters",
        "SageMaker Automatic Model Tuning (AMT) — it uses Bayesian optimization to efficiently search hyperparameter space",
        "SageMaker Pipelines — it runs all configurations in parallel and registers the best model",
        "SageMaker Data Wrangler — it profiles data to recommend optimal hyperparameters",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker Automatic Model Tuning (AMT) automates hyperparameter optimization using Bayesian optimization. It runs parallel training jobs, observes which configurations produce better metrics, and focuses subsequent trials on the most promising regions — far more efficient than manual grid search.",
    },
    {
      question:
        "What triggers an automated retraining pipeline in a SageMaker MLOps setup when model performance degrades in production?",
      options: [
        "SageMaker Pipelines detects accuracy drops and automatically retrains the model",
        "SageMaker Model Monitor detects drift and sends alerts to CloudWatch, which can trigger EventBridge rules to kick off retraining",
        "SageMaker Model Registry marks the current model as Deprecated when accuracy falls below threshold",
        "SageMaker Experiments automatically initiates a new experiment when validation metrics worsen",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker Model Monitor continuously monitors live traffic for drift. When drift thresholds are breached, it sends alerts to CloudWatch. CloudWatch alarms can trigger EventBridge rules that kick off retraining pipelines — creating a closed-loop MLOps system.",
    },
    {
      question:
        "Which SageMaker feature would you use to build a reproducible, versioned, end-to-end ML workflow that includes data processing, training, evaluation, and conditional model registration steps?",
      options: [
        "SageMaker Experiments",
        "SageMaker Automatic Model Tuning",
        "SageMaker Pipelines",
        "SageMaker Model Registry",
      ],
      correctIndex: 2,
      explanation:
        "SageMaker Pipelines provides a DAG-based workflow engine for ML. You define steps (Processing, Training, Evaluation, Condition, Register) using a Python SDK, and SageMaker orchestrates them in order. Pipelines are versioned, auditable, and can be triggered from CI/CD systems.",
    },
    {
      question:
        "A company runs a low-traffic ML inference endpoint that handles occasional burst requests. They want to minimize cost when there is no traffic. Which deployment option is most appropriate?",
      options: [
        "Real-Time Endpoint with a small instance type",
        "Batch Transform job scheduled during peak hours",
        "Serverless Inference — provisions compute only for active requests and scales to zero",
        "Multi-Model Endpoint to share infrastructure across multiple low-traffic models",
      ],
      correctIndex: 2,
      explanation:
        "Serverless Inference is designed for spiky or low-traffic workloads. It provisions compute only when requests arrive and scales to zero during idle periods, eliminating the cost of running instances 24/7 for low-utilization endpoints.",
    },
    {
      question:
        "What is training-serving skew, and which SageMaker feature is designed to prevent it?",
      options: [
        "When training takes longer than expected; prevented by Spot Training with checkpointing",
        "When model performance at training time differs from production due to inconsistent feature computation; prevented by SageMaker Feature Store",
        "When hyperparameters used in training differ from those registered in the Model Registry; prevented by Experiments",
        "When training data is distributed across multiple S3 buckets; prevented by Data Wrangler",
      ],
      correctIndex: 1,
      explanation:
        "Training-serving skew occurs when features are computed differently during training vs. real-time inference, causing the model to perform differently in production than it did in evaluation. SageMaker Feature Store prevents this by maintaining a single versioned feature definition used by both the offline store (training) and online store (inference).",
    },
    {
      question:
        "Which SageMaker built-in algorithm would you use for an NLP text classification task on large document corpora?",
      options: [
        "K-Means — it clusters documents into categories",
        "BlazingText — it provides fast Word2Vec and text classification implementations",
        "Linear Learner — it applies linear models to text feature vectors",
        "XGBoost — it provides gradient boosting for structured NLP features",
      ],
      correctIndex: 1,
      explanation:
        "BlazingText is SageMaker's built-in algorithm for NLP tasks including Word2Vec embeddings and text classification. It is highly optimized for speed and scale. XGBoost and Linear Learner work on structured features rather than raw text, and K-Means is for unsupervised clustering.",
    },
    {
      question:
        "A model registered in SageMaker Model Registry has a status of 'Pending'. What does this mean in an MLOps workflow?",
      options: [
        "The model is currently being trained and results are not yet available",
        "The model has been registered but has not yet been approved for production deployment",
        "The model failed evaluation and is pending investigation before deletion",
        "The model is deployed to a staging endpoint pending load testing results",
      ],
      correctIndex: 1,
      explanation:
        "In SageMaker Model Registry, 'Pending' means the model has been registered (with metrics and lineage) but has not yet been approved for production deployment. Deployment pipelines query for 'Approved' models — the approval workflow provides a human governance gate before production promotion.",
    },
    {
      question:
        "What does SageMaker Clarify specifically add to the SageMaker platform?",
      options: [
        "Automated data labeling and human review workflows for training data preparation",
        "Bias detection (pre- and post-training) and model explainability using SHAP values",
        "Real-time monitoring of model drift in production endpoints",
        "Hyperparameter optimization using Bayesian search across training jobs",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker Clarify provides bias detection (pre-training data imbalance metrics and post-training prediction disparity metrics) and model explainability (SHAP values for feature attribution). It is the responsible AI tooling layer within the SageMaker platform.",
    },
  ],
};
