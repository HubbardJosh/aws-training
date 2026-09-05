import { ServiceGuide } from "../../../types/guide";

export const sagemakerGuide: ServiceGuide = {
  id: "mls-sagemaker",
  service: "Amazon SageMaker",
  domain: "services",
  tagline:
    "Fully managed end-to-end ML platform for building, training, and deploying models at scale",
  intro:
    "Amazon SageMaker is the central service on the MLS-C01 exam, providing integrated tools for every phase of the ML lifecycle: data preparation with Data Wrangler and Processing, feature management with Feature Store, distributed training, hyperparameter tuning, model evaluation, deployment, and production monitoring.",

  sections: [
    {
      heading: "SageMaker Studio and Notebook Environments",
      body: `SageMaker Studio is the web-based integrated development environment that consolidates all SageMaker capabilities into a single interface. It provides managed Jupyter notebooks backed by dedicated kernel instances, removing the need to provision and maintain separate notebook servers. Studio also integrates directly with SageMaker Experiments for tracking runs, SageMaker Pipelines for workflow orchestration, and the Model Registry for governance, making it the primary workspace for ML practitioners on AWS.

SageMaker Notebooks (outside Studio) are fully managed Jupyter notebook instances with pre-installed ML frameworks including TensorFlow, PyTorch, Scikit-learn, and MXNet. You choose instance type (including GPU instances), and the notebook persists on EBS storage between sessions. For collaborative teams, Studio is preferred because it allows multiple users to share projects in a managed domain backed by EFS.`,
      quiz: [
        {
          question:
            "What is the primary advantage of Amazon SageMaker Studio over standalone SageMaker Notebook instances?",
          options: [
            "Studio provides cheaper compute because it uses Spot Instances by default",
            "Studio consolidates all SageMaker capabilities (Experiments, Pipelines, Model Registry) into a single IDE with shared project storage on EFS",
            "Studio automatically trains and deploys models without requiring any code",
            "Studio supports only Python, while Notebook instances support any language",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Studio provides a unified web IDE that integrates Experiments, Pipelines, Feature Store, and Model Registry into one workspace backed by EFS for collaboration. This eliminates context switching between separate tools and enables shared project environments for teams.",
        },
      ],
    },
    {
      heading:
        "Data Preparation: Processing Jobs, Data Wrangler, and Feature Store",
      body: `SageMaker Processing runs containerized data transformation jobs at scale. You specify a container (built-in Scikit-learn, Spark, or custom), input data paths in S3, and output destinations. Processing Jobs are stateless — they pull data from S3, transform it, and write results back — making them suitable for ETL, feature engineering, and model evaluation scoring pipelines. They integrate natively with SageMaker Pipelines as \`ProcessingStep\` nodes.

SageMaker Data Wrangler provides a no-code visual interface with over 300 built-in transforms for exploring and preparing tabular, text, and image data. You can profile distributions, detect class imbalance, impute missing values, and encode categoricals visually, then export the transformation recipe as Python or PySpark code for production use. Feature Store maintains versioned feature groups in both an online store (DynamoDB-backed, millisecond reads) and an offline store (S3-backed Parquet, for training). This dual architecture prevents training-serving skew by ensuring the exact same feature logic serves both training datasets and real-time inference.`,
      quiz: [
        {
          question:
            "A team wants to prevent training-serving skew in their ML pipeline. Which SageMaker feature best addresses this?",
          options: [
            "SageMaker Data Wrangler — it exports transformation code for use in both training and serving",
            "SageMaker Feature Store — it maintains a single versioned feature definition used by both the offline training store and the online inference store",
            "SageMaker Processing — it runs the same preprocessing container in both training and inference",
            "SageMaker Clarify — it detects when training data features diverge from serving data",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Feature Store prevents training-serving skew by maintaining a single versioned feature definition. The offline store (S3/Parquet) serves training, and the online store (DynamoDB-backed) serves real-time inference — both consuming identical feature logic.",
        },
      ],
    },
    {
      heading:
        "Model Training: Built-in Algorithms, Script Mode, and Distributed Training",
      body: `SageMaker Training Jobs abstract infrastructure management: you specify the algorithm or script, instance type and count, input S3 paths, and hyperparameters, and SageMaker provisions instances, streams data, runs training, saves the \`model.tar.gz\` artifact to S3, and terminates instances. You pay only for actual training compute time. SageMaker's library of built-in algorithms (XGBoost, Linear Learner, K-Means, BlazingText, Object Detection, Semantic Segmentation) are highly optimized and support distributed training without code changes.

Script mode lets you use standard PyTorch, TensorFlow, Scikit-learn, or MXNet training scripts with minimal SageMaker-specific code — you supply the script, and SageMaker wraps it in a managed container. For maximum control, BYOC (Bring Your Own Container) supports fully custom training environments. Distributed training strategies include data parallelism (dataset sharded across GPUs, each running a full model copy, gradients averaged) and model parallelism (model layers split across GPUs when the model exceeds single-GPU memory). The SageMaker Data Parallel and Model Parallel libraries integrate with PyTorch and TensorFlow. Spot Training uses EC2 Spot Instances for up to 90% cost reduction, with checkpointing required for resilience.`,
      quiz: [
        {
          question:
            "When should you use model parallelism instead of data parallelism in SageMaker distributed training?",
          options: [
            "When you want to reduce training time by processing more data per step",
            "When your model is too large to fit in a single GPU's memory",
            "When your dataset is too large to fit in the instance's storage",
            "When you want to run multiple training jobs simultaneously",
          ],
          correctIndex: 1,
          explanation:
            "Model parallelism splits the model itself across multiple GPUs, solving the problem of models that exceed single-GPU memory. Data parallelism splits the dataset and is about training speed. These are complementary strategies addressing different bottlenecks.",
        },
      ],
    },
    {
      heading: "Hyperparameter Tuning and Automatic Model Tuning",
      body: `SageMaker Automatic Model Tuning (AMT) automates hyperparameter optimization by running multiple training jobs and intelligently exploring the hyperparameter search space. The default strategy is Bayesian optimization, which builds a surrogate model of the objective metric as a function of hyperparameters and uses it to select the most promising configurations for subsequent trials — outperforming grid and random search for continuous or large search spaces. You configure the objective metric (e.g., validation:accuracy), the metric definition regex, and the ranges for each hyperparameter (continuous, integer, categorical).

When using AMT, keep the number of concurrent jobs low relative to total jobs so the Bayesian optimizer can learn from prior results. Warm starting allows a new tuning job to reuse the exploration from a previous job, accelerating convergence. SageMaker Experiments automatically tracks every training run — its Experiment/Trial/Trial Component hierarchy captures parameters, metrics, and artifact lineage for comparison and reproducibility.`,
      quiz: [
        {
          question:
            "Which hyperparameter tuning strategy does SageMaker Automatic Model Tuning use by default, and why is it preferred over grid search?",
          options: [
            "Random search — it samples hyperparameters randomly, which is unbiased and covers the space evenly",
            "Bayesian optimization — it uses results from prior trials to focus search on the most promising hyperparameter regions, requiring fewer total trials",
            "Grid search — it exhaustively tests all combinations, guaranteeing the global optimum",
            "Genetic algorithms — it evolves hyperparameter combinations across generations",
          ],
          correctIndex: 1,
          explanation:
            "Bayesian optimization builds a surrogate model of the objective function and uses it to predict which hyperparameter configurations will yield the best results. This results in convergence with far fewer training jobs than grid search, making it the default and preferred strategy for SageMaker AMT.",
        },
      ],
    },
    {
      heading: "Model Deployment, Monitoring, and MLOps",
      body: `SageMaker offers multiple inference deployment patterns. Real-Time Endpoints are persistent HTTPS endpoints backed by managed instances supporting Blue/Green deployments and auto-scaling. Batch Transform runs asynchronous bulk inference over S3 datasets — optimal for nightly scoring jobs with no persistent endpoint needed. Serverless Inference provisions compute only per request and scales to zero, minimizing cost for low-traffic or bursty workloads. Asynchronous Inference queues requests and writes results to S3 for large payload or long-running inference jobs. Multi-Model Endpoints share one endpoint across thousands of models, loading models on demand.

SageMaker Model Monitor continuously baselines live inference traffic and detects data quality drift, model quality drift, bias drift, and feature attribution drift, publishing metrics to CloudWatch. SageMaker Pipelines provides a DAG-based MLOps orchestration engine with versioned, repeatable steps. The Model Registry provides a versioned catalog with approval workflows — models move from Pending to Approved before automated deployment systems promote them. SageMaker Clarify performs bias detection pre- and post-training and generates SHAP-based model explanations.`,
      quiz: [
        {
          question:
            "A company must run inference on 100 million records stored in S3 each weekend. No real-time access is needed. Which SageMaker deployment option is correct?",
          options: [
            "Real-Time Endpoint with auto-scaling to handle peak load",
            "Serverless Inference with provisioned concurrency",
            "Batch Transform — asynchronous bulk inference reading from S3 and writing results back to S3",
            "Asynchronous Inference Endpoint to queue all 100 million requests",
          ],
          correctIndex: 2,
          explanation:
            "Batch Transform is purpose-built for bulk offline inference. It reads from S3, distributes work across a fleet of instances, and writes results back to S3 without a persistent endpoint. It is the correct and cost-efficient choice for scheduled large-scale scoring jobs.",
        },
      ],
    },
    {
      heading: "SageMaker Clarify: Bias Detection and Explainability",
      body: `SageMaker Clarify analyzes training data and model predictions to detect statistical bias and generate model explanations. Pre-training bias analysis measures imbalance in training data — metrics like Class Imbalance (CI), Difference in Positive Proportions (DPP), and Label Imbalance help identify whether certain demographic groups are underrepresented before any model is trained. Post-training bias analysis runs against model predictions, computing metrics like Disparate Impact (DI) and Conditional Demographic Disparity to quantify whether the trained model treats groups differently.

Clarify generates SHAP (SHapley Additive exPlanations) values to explain individual predictions — quantifying each feature's contribution to a specific prediction. These explanations are available both as a one-time post-training analysis job and as continuous monitoring through SageMaker Model Monitor's bias and feature attribution drift monitors on live endpoints. Model cards generated from Clarify analysis provide a standardized documentation artifact capturing model performance, intended use, and fairness assessments.`,
      quiz: [
        {
          question:
            "A company needs to prove their credit scoring model does not disadvantage applicants based on protected attributes. Which SageMaker feature provides both pre-training bias detection and post-deployment bias monitoring?",
          options: [
            "SageMaker Debugger — it captures model internals during training to detect bias",
            "SageMaker Clarify — it measures bias metrics pre-training and post-training, and integrates with Model Monitor for continuous drift detection",
            "SageMaker Model Monitor — it detects data quality changes that could introduce bias",
            "SageMaker Experiments — it tracks model performance across different demographic slices",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Clarify provides pre-training bias analysis (data imbalance), post-training bias analysis (prediction disparity), SHAP-based feature attribution, and integrates with Model Monitor for ongoing bias drift detection on live endpoints — making it the complete solution for fairness requirements.",
        },
      ],
    },
    {
      heading: "SageMaker Debugger: Training Observability",
      body: `SageMaker Debugger captures tensors, gradients, weights, and activations emitted during training without modifying training code. Built-in rules automatically detect training problems: vanishing gradients (gradients approaching zero, stalling learning), exploding gradients (gradients growing uncontrollably), overfitting (train loss decreasing while validation loss increases), dead ReLU neurons, and poor weight initialization. When a rule fires, Debugger can automatically stop the training job to prevent wasted compute.

Debugger also profiles system resource utilization — CPU, GPU, memory, network, and I/O — through its Profiler component. Profiler identifies bottlenecks like GPU underutilization (often caused by CPU data loading bottlenecks) and helps right-size instance selection. All captured tensor data is stored in S3, and the SageMaker Studio Debugger dashboard visualizes training metrics and tensor histograms over time.`,
      quiz: [
        {
          question:
            "A training job shows GPU utilization consistently below 30%. Which SageMaker Debugger component helps diagnose whether the bottleneck is CPU-side data loading?",
          options: [
            "Debugger built-in rules for vanishing gradients",
            "Debugger Profiler — it captures CPU, GPU, memory, network, and I/O utilization to identify system bottlenecks",
            "SageMaker Model Monitor — it analyzes inference latency after deployment",
            "SageMaker Clarify — it identifies feature attribution causing slow training",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Debugger Profiler captures detailed system metrics including CPU and GPU utilization, I/O throughput, and network activity. Low GPU utilization with high CPU activity is a classic sign of a data loading bottleneck, which Profiler surfaces so you can optimize the data pipeline.",
        },
      ],
    },
    {
      heading: "SageMaker Ground Truth: Data Labeling",
      body: `SageMaker Ground Truth manages the human labeling workflow for supervised ML training data. It supports built-in task types including image classification, object detection (bounding boxes), semantic segmentation, text classification, named entity recognition, and video object tracking. Ground Truth routes annotation tasks to human workforces — private workforces (your own employees via Amazon Cognito), vendor-managed workforces, or Amazon Mechanical Turk for large-scale public labeling.

Automated data labeling uses active learning to reduce labeling cost: Ground Truth trains a model on labeled examples and uses it to auto-label high-confidence examples, sending only ambiguous examples to human reviewers. This typically reduces the number of examples requiring human review by 70–80%. Ground Truth Plus is a fully managed turnkey service where AWS manages the labeling workflow and workforce, requiring only data upload and task specification.`,
      quiz: [
        {
          question:
            "A company needs to label 500,000 images for object detection while minimizing human labeling cost. Which Ground Truth capability reduces the volume of examples requiring human review?",
          options: [
            "Private workforce routing — company employees label faster than Mechanical Turk",
            "Automated data labeling — Ground Truth trains an active learning model to auto-label high-confidence examples, routing only ambiguous ones to humans",
            "Ground Truth Plus — AWS labels all images automatically with no human involvement",
            "Consolidation — multiple labelers vote on each image, reducing per-image cost",
          ],
          correctIndex: 1,
          explanation:
            "Ground Truth's automated data labeling trains a classification model on already-labeled examples and uses it to assign labels to high-confidence examples automatically. Only examples the model is uncertain about are sent to human reviewers — typically reducing human labeling volume by 70-80%.",
        },
      ],
    },
    {
      heading: "SageMaker Canvas and JumpStart",
      body: `SageMaker Canvas is a no-code ML interface that enables business analysts without ML expertise to build and deploy models using a point-and-click interface. Users import data from S3, RDS, Redshift, or Snowflake, and Canvas automatically runs data profiling, feature analysis, and model training using AutoML. Canvas supports tabular classification, regression, time-series forecasting, and natural language text classification. Predictions can be exported to S3 or shared with SageMaker Studio users for collaboration.

SageMaker JumpStart provides a hub of pre-trained foundation models and ML solutions that can be deployed or fine-tuned with one click. It includes models from providers like Hugging Face, Stability AI, and AI21 Labs, as well as AWS's own models. JumpStart solutions package end-to-end ML use cases — fraud detection, demand forecasting, churn prediction — with pre-built notebooks, training scripts, and deployment configurations. This accelerates time-to-value for common ML problems without starting from scratch.`,
      quiz: [
        {
          question:
            "A business analyst needs to build a sales forecasting model without writing code. Which SageMaker feature is most appropriate?",
          options: [
            "SageMaker JumpStart — provides pre-built solutions for time-series forecasting",
            "SageMaker Canvas — provides a no-code interface for building ML models including time-series forecasting from tabular data",
            "SageMaker Autopilot — automatically trains models but requires Python SDK configuration",
            "SageMaker Studio — provides a notebook IDE for running forecasting code",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Canvas is explicitly designed for non-technical users to build ML models without writing code. It supports time-series forecasting along with classification and regression, and can connect directly to business data sources like Redshift and Snowflake.",
        },
      ],
    },
    {
      heading: "SageMaker Lineage Tracking",
      body: `SageMaker ML Lineage Tracking automatically records the provenance relationships between all artifacts in the ML workflow: datasets, processing jobs, training jobs, model artifacts, model packages, and endpoints. The lineage graph is bidirectional — you can trace forward from a dataset to find which models it produced, or trace backward from a deployed endpoint to find exactly which training data and code produced it. This is essential for regulatory compliance, audit requirements, and impact analysis when a data issue is discovered.

Lineage entities include Artifacts (datasets, model artifacts), Actions (training jobs, deployments), Contexts (experiment contexts, endpoint contexts), and Associations (relationships between entities). The \`sagemaker.lineage\` SDK provides programmatic access to query lineage graphs. Model cards, integrated with lineage, capture model documentation including intended use, evaluation results, and training details — providing a complete audit package for governed ML environments.`,
      quiz: [
        {
          question:
            "A financial institution discovers that training data used six months ago contained errors. They need to identify all currently deployed models trained on that dataset. Which SageMaker feature enables this impact analysis?",
          options: [
            "SageMaker Experiments — query trials that used that dataset as input",
            "SageMaker ML Lineage Tracking — trace forward from the dataset artifact to all downstream model artifacts and endpoints",
            "SageMaker Model Monitor — it tracks data sources used by deployed endpoints",
            "SageMaker Model Registry — filter model versions by training data metadata",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker ML Lineage Tracking maintains a directed graph of relationships between datasets, training jobs, models, and endpoints. Tracing forward from the problematic dataset artifact surfaces all downstream models and deployments, enabling targeted remediation without manually auditing every model.",
        },
      ],
    },
    {
      heading: "SageMaker Inference Pipelines and Multi-Model Endpoints",
      body: `SageMaker Inference Pipelines chain up to 15 containers in sequence on a single endpoint. A request flows through each container in order — typically a preprocessing container (feature scaling, tokenization), one or more model containers, and a postprocessing container (result formatting, business logic). This eliminates client-side orchestration and ensures preprocessing logic is versioned alongside the model. Inference Pipelines work with both real-time and batch Transform deployments.

Multi-Model Endpoints (MME) host thousands of models behind a single endpoint by dynamically loading models into memory from S3 on demand. When a request arrives targeting a specific model, SageMaker loads it from S3 into the container's memory (with an LRU eviction policy for less-frequently used models). MME dramatically reduces endpoint costs when serving many customer-specific models that each receive infrequent traffic — instead of one endpoint per model, a single endpoint serves all. Multi-Container Endpoints (MCE) differ from MME in that they run multiple distinct containers simultaneously rather than loading models dynamically.`,
      quiz: [
        {
          question:
            "A SaaS company serves 10,000 customer-specific models, each receiving a few requests per hour. Deploying one endpoint per model would cost too much. Which SageMaker deployment pattern solves this?",
          options: [
            "Inference Pipelines — chain all 10,000 models in sequence on one endpoint",
            "Serverless Inference with one endpoint per model — scales to zero between requests",
            "Multi-Model Endpoints — host all 10,000 models on a single endpoint, loading them on demand from S3",
            "Batch Transform — run all customer models as nightly batch jobs",
          ],
          correctIndex: 2,
          explanation:
            "Multi-Model Endpoints host thousands of models on a single endpoint by loading the requested model from S3 into memory on demand and evicting infrequently used models via LRU. This is the canonical cost-reduction pattern for many low-traffic per-customer models.",
        },
      ],
    },
  ],

  keyFacts: [
    "SageMaker covers the full ML lifecycle: data prep, feature engineering, training, tuning, deployment, monitoring",
    "Feature Store has online (DynamoDB, ms latency) and offline (S3 Parquet) tiers — prevents training-serving skew",
    "Built-in algorithms: XGBoost, Linear Learner, K-Means, BlazingText, Object Detection, Factorization Machines",
    "Spot Training reduces training cost up to 90% — requires checkpointing enabled",
    "AMT uses Bayesian optimization to find optimal hyperparameters across parallel training jobs",
    "Model Monitor detects 4 drift types: data quality, model quality, bias, and feature attribution",
    "Batch Transform = bulk offline inference from S3; Serverless = scale-to-zero low-traffic endpoints",
    "SageMaker Clarify = bias detection + SHAP-based model explainability",
    "Pipelines = DAG workflow engine for reproducible, versioned ML workflows",
    "Model Registry = versioned catalog with Pending/Approved workflow for controlled production promotion",
    "Ground Truth automates labeling with active learning — auto-labels high-confidence examples, routes ambiguous ones to humans",
    "Debugger captures tensors and gradients; Profiler captures CPU/GPU utilization to find training bottlenecks",
    "Multi-Model Endpoints host thousands of models on one endpoint via on-demand S3 loading",
    "Lineage Tracking records bidirectional provenance: dataset → training job → model → endpoint",
    "JumpStart provides one-click deployable foundation models and end-to-end ML solution templates",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Glue",
    "Amazon CloudWatch",
    "Amazon ECR",
    "AWS Step Functions",
    "Amazon Kinesis",
  ],

  examTips: [
    "SageMaker is the highest-weight service on MLS-C01 — know every sub-feature deeply",
    "Training-serving skew = Feature Store is the answer; it standardizes feature definitions across both stores",
    "Model Monitor detects 4 drift types — data quality, model quality, bias, feature attribution — know all four",
    "Spot Training requires checkpointing; without it, interrupted jobs restart from scratch",
    "Batch Transform for bulk S3 scoring; Serverless for low/spiky traffic; Real-Time for persistent low-latency",
    "AMT Bayesian optimization converges faster than grid search — low concurrency helps the optimizer learn",
    "Script mode = bring your training script, SageMaker wraps it in a container",
    "SageMaker Clarify = bias detection AND explainability (SHAP) — not just one or the other",
    "Ground Truth automated labeling reduces human labeling cost ~70-80% via active learning",
    "Debugger stops training automatically when rules fire — prevents wasted compute on broken jobs",
    "Multi-Model Endpoints = cost solution for thousands of low-traffic models; do not confuse with Inference Pipelines (sequential containers)",
    "Lineage Tracking is the answer for compliance/audit questions asking which data produced which model",
  ],

  topicQuiz: [
    {
      question:
        "Which SageMaker feature prevents training-serving skew by maintaining versioned feature definitions accessible by both training pipelines and real-time inference?",
      options: [
        "SageMaker Data Wrangler",
        "SageMaker Feature Store",
        "SageMaker Processing",
        "SageMaker Experiments",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker Feature Store maintains a single versioned feature definition with an offline store (S3/Parquet for training) and an online store (DynamoDB for real-time inference), ensuring consistent feature computation across both pipelines.",
    },
    {
      question:
        "A data scientist wants to reduce the cost of a long-running GPU training job by 80%. Which SageMaker feature enables this with the least operational overhead?",
      options: [
        "Use Reserved Instances for the training instance type",
        "Enable Spot Training in the Training Job configuration with checkpointing",
        "Switch to a smaller instance type to reduce cost",
        "Use SageMaker Serverless Inference for training",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker Spot Training uses EC2 Spot Instances for up to 90% cost reduction. Checkpointing must be enabled so that if a Spot Instance is interrupted, training can resume from the last checkpoint rather than starting over.",
    },
    {
      question:
        "What is the correct hierarchy of tracking objects in SageMaker Experiments?",
      options: [
        "Project → Pipeline → Run",
        "Experiment → Trial → Trial Component",
        "Run → Job → Artifact",
        "Experiment → Model → Version",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker Experiments uses Experiment (top-level grouping) → Trial (individual run) → Trial Component (individual jobs within a trial such as training, processing, or transform steps). This hierarchy enables comparison across many runs and full lineage tracking.",
    },
  ],
};
