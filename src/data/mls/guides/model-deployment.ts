import { ServiceGuide } from "../../../types/guide";

export const modelDeploymentGuide: ServiceGuide = {
  id: "mls-model-deployment",
  service: "ML Model Deployment",
  domain: "deployment",
  tagline:
    "Strategies and patterns for deploying ML models to production on AWS",
  intro:
    "ML model deployment converts a trained model artifact into a live inference service. MLS-C01 covers SageMaker deployment options (real-time, serverless, async, batch), deployment strategies (Blue/Green, canary), auto-scaling, and container-based deployment patterns.",

  sections: [
    {
      heading: "SageMaker Real-Time Endpoints",
      body: `SageMaker Real-Time Endpoints are persistent HTTPS inference endpoints backed by one or more EC2 instances. Creating an endpoint requires a Model (pointing to the model artifact in S3 and the container image), an Endpoint Configuration (instance type, instance count, and optional variant configuration), and the Endpoint itself. The endpoint URL is stable — it doesn't change when you update the underlying model or instances. Real-Time Endpoints support auto-scaling via Application Auto Scaling policies — you define target tracking metrics (e.g., \`SageMakerVariantInvocationsPerInstance\`) and Auto Scaling adds or removes instances based on current invocation rate.

Endpoint updates use Blue/Green deployment: SageMaker provisions a new fleet of instances (Green), warms it up, then shifts traffic from the old fleet (Blue) to Green — either all at once or gradually via canary shifts. This eliminates downtime during model updates. A/B testing is implemented using production variants — one endpoint can host multiple model variants simultaneously, splitting traffic by configured weight (e.g., 90% to current model, 10% to new model). This enables statistical comparison of model performance in production before fully promoting a new model.`,
      quiz: [
        {
          question:
            "A team wants to test a new model version on 5% of production traffic while keeping 95% on the current model. Which SageMaker feature enables this?",
          options: [
            "Deploy two separate endpoints and use Route 53 weighted routing",
            "Use SageMaker production variants — configure two model variants on one endpoint with 95%/5% traffic weights",
            "Use SageMaker Pipelines to route 5% of inference requests to the new model",
            "Use SageMaker Model Registry approval workflow to gradually promote the new model",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker production variants allow hosting multiple model versions on a single endpoint with configurable traffic weights. Setting variant weights to 95/5 sends 95% of traffic to the current model and 5% to the new model, enabling A/B testing in production without a separate endpoint or infrastructure.",
        },
      ],
    },
    {
      heading: "Serverless and Asynchronous Inference",
      body: `SageMaker Serverless Inference provisions compute only when inference requests arrive, scaling to zero during idle periods. You configure a memory size (1 GB to 6 GB) and maximum concurrency, and SageMaker handles instance provisioning and load balancing. Serverless is optimal for low-traffic or bursty endpoints where a persistent instance would sit idle most of the time. Cold start latency (200ms-5s for the first request after a period of inactivity) makes Serverless inappropriate for strict latency SLAs but acceptable for asynchronous workflows.

SageMaker Asynchronous Inference is designed for inference requests with large payloads (up to 1 GB) or long processing times (up to 1 hour). You submit a request that references an S3 input URI, receive an output S3 URI, and poll or receive an SNS notification when processing completes. Asynchronous Inference scales to zero when there is no queue, minimizing idle cost. It is the correct choice for video analysis, large document processing, or long-running model inference that cannot fit within the 60-second timeout of real-time endpoints.`,
      quiz: [
        {
          question:
            "A company needs to run ML inference on 500 MB video files. Processing takes 45 minutes per video. Which SageMaker deployment option is appropriate?",
          options: [
            "Real-Time Endpoint — increase timeout to 60 minutes",
            "Serverless Inference — it handles any payload size with automatic scaling",
            "Asynchronous Inference — designed for large payloads and long-running inference with S3 input/output",
            "Batch Transform — run a batch job for each video file",
          ],
          correctIndex: 2,
          explanation:
            "Asynchronous Inference supports payloads up to 1 GB and processing times up to 1 hour, making it ideal for large video files requiring 45-minute processing. You submit the request with an S3 input URI, and SageMaker processes it and writes results to S3, notifying you via SNS when done. Real-Time Endpoints have a 60-second timeout.",
        },
      ],
    },
    {
      heading: "Batch Transform for Bulk Inference",
      body: `SageMaker Batch Transform runs inference on large datasets stored in S3 without a persistent endpoint. You specify the model, instance type and count, input S3 prefix, output S3 prefix, and the batch strategy (SingleRecord or MultiRecord). Batch Transform distributes S3 objects across instances, runs predictions, and writes results back to S3 — each output file corresponds to an input file. Instances are terminated after the job completes, so you pay only for actual inference compute.

Batch Transform uses the same Model resource and container as real-time endpoints but without the persistent endpoint overhead. It is the standard approach for: nightly re-scoring of all customers (churn, LTV predictions), generating recommendation lists offline for email campaigns, running regression tests on a model against a labeled test set, and producing feature predictions that will be stored as pre-computed features. The \`MaxConcurrentTransforms\` parameter controls how many records are processed in parallel per instance, and \`BatchStrategy\` controls whether records are batched together for efficiency.`,
      quiz: [
        {
          question:
            "A company needs to predict customer lifetime value for all 50 million customers each Sunday night and store results in their data warehouse. Which SageMaker deployment option is correct?",
          options: [
            "Real-Time Endpoint with auto-scaling for Sunday night traffic spike",
            "Serverless Inference triggered by a CloudWatch Events rule each Sunday",
            "Batch Transform — runs inference on all 50 million customers from S3, writes results back to S3, and terminates instances after completion",
            "Asynchronous Inference with one request per customer per week",
          ],
          correctIndex: 2,
          explanation:
            "Batch Transform is designed for scheduled bulk inference. It reads all customer records from S3, distributes inference across a fleet of instances, writes results to S3, and terminates instances — no persistent endpoint, no idle cost. Results in S3 can then be loaded into the data warehouse. This is the canonical weekend batch scoring pattern.",
        },
      ],
    },
    {
      heading: "Multi-Model and Multi-Container Endpoints",
      body: `SageMaker Multi-Model Endpoints (MME) host thousands of models behind a single endpoint. When a request arrives, SageMaker looks up the requested model name, checks if it is loaded in memory, and if not, downloads it from S3 and loads it. Less-recently-used models are evicted from memory under pressure. MME is designed for multi-tenant SaaS platforms where each customer or use case has a separately trained model — dramatically reducing endpoint cost compared to one endpoint per model. MME works best when models share the same container framework (e.g., all PyTorch or all XGBoost).

SageMaker Multi-Container Endpoints (MCE) run different containers sequentially on the same endpoint. You define a pipeline of containers (preprocessing → inference → postprocessing), and inference requests flow through each container in order. This is useful when your inference pipeline has distinct stages running different frameworks — for example, a Scikit-learn preprocessing container followed by a PyTorch model container followed by a business logic postprocessing container. MCE eliminates network hops between separate endpoints for chained inference.`,
      quiz: [
        {
          question:
            "A SaaS platform has 10,000 enterprise customers, each with a separate XGBoost model trained on their data. Hosting one endpoint per model is too expensive. What is the correct architecture?",
          options: [
            "Use one large Real-Time Endpoint and route requests to the correct model in application code",
            "Use SageMaker Multi-Model Endpoint — one endpoint hosts all 10,000 XGBoost models, loading each from S3 on demand",
            "Use SageMaker Multi-Container Endpoint — one endpoint runs 10,000 containers simultaneously",
            "Use SageMaker Batch Transform — run all 10,000 models as a daily batch job",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Multi-Model Endpoints host multiple models behind one endpoint. When a request specifies a model name, SageMaker loads it from S3 if not already in memory. This is the exact use case MME was designed for — 10,000 models sharing one endpoint with on-demand loading, far cheaper than 10,000 individual endpoints.",
        },
      ],
    },
    {
      heading: "Model Deployment Best Practices and Monitoring",
      body: `Production model deployment requires more than creating an endpoint. Auto-scaling policies should be configured for Real-Time Endpoints to handle traffic spikes — target tracking policies based on \`SageMakerVariantInvocationsPerInstance\` scale out when invocations per instance exceed a threshold. Scale-in cooldown periods prevent rapid oscillation. Endpoint data capture (available on Real-Time and Async endpoints) writes a sample of inference requests and responses to S3 for Model Monitor analysis.

SageMaker Model Monitor continuously compares live inference data against a baseline established from training data. Data quality monitoring detects when input feature distributions drift from training — a common cause of silent model degradation. Model quality monitoring (for classification and regression) measures prediction accuracy against ground truth labels when they become available with a delay. Alerts are published to CloudWatch, enabling EventBridge rules to trigger retraining pipelines when drift exceeds configured thresholds. This closed-loop architecture — deploy, monitor, detect drift, retrain — is the target state for production ML systems and is heavily tested on MLS-C01.`,
      quiz: [
        {
          question:
            "A SageMaker Real-Time Endpoint handles variable traffic — low during weekdays, high on weekends. What should be configured to automatically adjust instance count?",
          options: [
            "Manually update the endpoint configuration each Friday and Monday",
            "Configure Application Auto Scaling with a target tracking policy on SageMakerVariantInvocationsPerInstance",
            "Use SageMaker Batch Transform instead for weekend processing",
            "Set a high initial instance count to handle peak weekend traffic at all times",
          ],
          correctIndex: 1,
          explanation:
            "Application Auto Scaling with a target tracking policy on SageMakerVariantInvocationsPerInstance automatically adds instances when the invocations-per-instance metric exceeds the target and removes instances during low traffic. This eliminates manual resizing and optimizes cost without over-provisioning for peak traffic.",
        },
      ],
    },
    {
      heading: "SageMaker Pipelines for CI/CD ML",
      body: `SageMaker Pipelines is the native CI/CD orchestration service for ML workflows. A Pipeline is a directed acyclic graph (DAG) of steps: ProcessingStep (run a SageMaker Processing job for data preparation), TrainingStep (run a Training job), TuningStep (hyperparameter optimization), EvaluationStep (run a Processing job to compute metrics), RegisterModel (register to Model Registry), ConditionStep (branch the pipeline based on a metric condition — e.g., only register if validation F1 > 0.85), CreateModelStep, EndpointConfigStep, and EndpointStep.

Pipelines are defined in the SageMaker Python SDK and compiled to a JSON definition that SageMaker stores and executes. Pipelines are triggered manually via the SDK/console, on a schedule via EventBridge Scheduler, or by S3 events (new training data uploaded → EventBridge rule → StartPipelineExecution). The ConditionStep is the quality gate: it evaluates a comparison condition on a metric from a previous step and branches to different paths (register model, or log failure and stop). Model Registry + Pipelines = the complete MLOps CI/CD pattern: new code commit triggers pipeline, pipeline trains and evaluates, ConditionStep gates Model Registry registration, manual approval gates production endpoint deployment.`,
      quiz: [
        {
          question:
            "A SageMaker Pipeline trains a model and should only register it in the Model Registry if validation accuracy exceeds 0.85. Which Pipeline step implements this quality gate?",
          options: [
            "EvaluationStep — it automatically compares metrics against a configured threshold",
            "TrainingStep with an early stopping condition on validation accuracy",
            "ConditionStep — it evaluates a condition expression and branches the pipeline, registering the model only if the condition is true",
            "RegisterModel step with a minimum accuracy parameter",
          ],
          correctIndex: 2,
          explanation:
            "ConditionStep evaluates a condition (e.g., validation accuracy > 0.85) and branches to different pipeline paths based on the result. If the condition is true, it proceeds to RegisterModel; if false, it routes to a different step (e.g., a notification or failure path). This is the standard quality gate pattern in SageMaker Pipelines CI/CD.",
        },
      ],
    },
    {
      heading: "Shadow Testing and Safe Deployment Patterns",
      body: `Safe deployment of new model versions requires validation on real traffic before full rollout. Shadow mode deployment runs a new model version alongside the current production model — both receive identical real traffic requests, but only the production model's responses are returned to users. Shadow responses are captured to S3 for offline comparison. This allows validating the new model's behavior on real production distributions without any user impact. SageMaker supports shadow testing natively via the UpdateEndpoint API with a \`ShadowProductionVariant\` configuration — you specify the shadow model and the percentage of traffic to mirror (up to 100%).

Canary deployments gradually shift traffic using production variant weight updates: deploy new model at 5% weight, monitor error rate and latency for 24 hours, increase to 25%, monitor again, then shift to 100%. Rollback is instantaneous: update variant weights back to 100% on the current (stable) model. Blue/Green deployment provisions a new endpoint fleet (Green) before switching traffic from the old fleet (Blue) — SageMaker handles this automatically during endpoint updates. For risk-averse deployments of high-traffic production models, the sequence is: shadow test → canary at 5% → canary at 25% → canary at 100% → Blue/Green switch. Each stage validates the new model before increasing exposure.`,
      quiz: [
        {
          question:
            "What is the key difference between shadow testing and canary deployment of a new ML model version?",
          options: [
            "Shadow testing is for classification models; canary deployment is for regression models",
            "Shadow testing sends traffic to the new model but suppresses its responses — validating behavior with zero user impact; canary deployment gradually shifts a percentage of real traffic to the new model with users seeing its responses",
            "Shadow testing requires a separate endpoint; canary deployment uses production variants on the same endpoint",
            "Shadow testing is faster; canary deployment provides more accurate performance estimates",
          ],
          correctIndex: 1,
          explanation:
            "Shadow testing mirrors traffic to the new model but discards its responses — users only see the production model's outputs. This enables validation on real traffic with zero user impact. Canary deployment actually serves the new model's responses to a percentage of real users, so the new model's quality directly affects user experience during the rollout.",
        },
      ],
    },
    {
      heading: "Cost Optimization for ML Inference",
      body: `ML inference cost optimization balances latency SLA, throughput, and instance cost. Right-sizing is the highest-impact optimization: use SageMaker Inference Recommender to automatically benchmark your model across dozens of instance types, measuring latency percentiles and throughput at varying loads. Inference Recommender generates a ranked list of instance types by cost/performance, eliminating manual benchmarking. Serverless Inference eliminates idle instance cost by scaling to zero during inactivity — appropriate when cold start latency (200ms to 5s) is acceptable and traffic is low-volume or bursty.

SageMaker Savings Plans provide 1-year or 3-year commitment discounts on SageMaker real-time endpoint instance hours — up to 64% savings versus On-Demand pricing. SageMaker Neo compiles models to hardware-optimized native code for specific target platforms (x86, ARM, GPU, AWS Inferentia). Compilation reduces latency by 10-75% and reduces the required instance size, lowering both latency and cost simultaneously. AWS Inferentia (ml.inf1, ml.inf2 instances) provides the best price-performance for deep learning inference — up to 40% lower cost per inference than GPU instances for standard architectures. Multi-Model Endpoints reduce cost for multi-tenant workloads by sharing one endpoint fleet across thousands of models.`,
      quiz: [
        {
          question:
            "A team has a production SageMaker Real-Time Endpoint but doesn't know if they're using the right instance type. What SageMaker feature automates instance selection for optimal cost/performance?",
          options: [
            "SageMaker Debugger — it profiles endpoint performance and recommends instance changes",
            "SageMaker Model Monitor — it detects when the endpoint is over-provisioned based on invocation patterns",
            "SageMaker Inference Recommender — it benchmarks the model across instance types and reports latency, throughput, and cost",
            "SageMaker Autopilot — it selects the optimal model and deployment configuration",
          ],
          correctIndex: 2,
          explanation:
            "SageMaker Inference Recommender performs load testing of your model across multiple instance types, measuring p50/p99 latency, maximum throughput, and cost per inference. It returns a ranked list of instance recommendations so you can select the instance type that meets your latency SLA at minimum cost — without manual benchmarking.",
        },
      ],
    },
  ],

  keyFacts: [
    "Real-Time Endpoint: persistent HTTPS endpoint — Blue/Green updates, production variants for A/B testing",
    "Serverless Inference: scale to zero, cold start latency — best for low/bursty traffic",
    "Asynchronous Inference: payloads up to 1 GB, processing up to 1 hour — S3 input/output + SNS notification",
    "Batch Transform: bulk inference from S3 — no persistent endpoint, pay per job, best for periodic scoring",
    "Multi-Model Endpoint: thousands of models on one endpoint, on-demand S3 loading — multi-tenant SaaS",
    "Multi-Container Endpoint: sequential container pipeline on one endpoint — preprocessing + inference + postprocessing",
    "Auto Scaling: SageMakerVariantInvocationsPerInstance target tracking — automatic scale-out on traffic spikes",
    "Data capture: samples inference requests/responses to S3 for Model Monitor analysis",
    "Production variants: split traffic by weight between model versions — A/B testing on one endpoint",
    "Model Monitor: data quality, model quality, bias drift, feature attribution drift — four monitored drift types",
  ],

  relatedServices: [
    "Amazon SageMaker Model Monitor",
    "Amazon CloudWatch",
    "Amazon S3",
    "Amazon SNS",
    "AWS Lambda",
    "Amazon EventBridge",
  ],

  examTips: [
    "Batch Transform = offline bulk scoring; Async = large payload/long-running; Serverless = low/bursty traffic",
    "Real-Time Endpoint 60s timeout — anything longer needs Async Inference",
    "MME = thousands of models, one endpoint, on-demand loading — multi-tenant cost reduction",
    "MCE = sequential container pipeline — preprocessing → inference → postprocessing on one endpoint",
    "Production variants = A/B testing on one endpoint with configurable traffic weights",
    "Data capture + Model Monitor = the drift detection architecture — required for production ML",
    "Auto Scaling on SageMakerVariantInvocationsPerInstance is the standard Real-Time Endpoint scaling metric",
    "Blue/Green deployment on endpoint update = zero-downtime model updates",
  ],

  topicQuiz: [
    {
      question:
        "Which SageMaker inference option should you choose for a model that processes 800 MB medical imaging files, where inference takes 20 minutes and results can be delivered asynchronously?",
      options: [
        "Real-Time Endpoint with increased timeout",
        "Serverless Inference with 6 GB memory configuration",
        "Asynchronous Inference — supports payloads up to 1 GB and processing up to 1 hour with S3-based I/O",
        "Batch Transform — process all imaging files as a daily batch",
      ],
      correctIndex: 2,
      explanation:
        "Asynchronous Inference is designed for large payloads (up to 1 GB) and long processing times (up to 1 hour). The request submits an S3 input URI, SageMaker processes asynchronously, and writes results to S3, notifying via SNS. Real-Time Endpoints have a 60-second timeout and cannot handle 800 MB payloads efficiently.",
    },
    {
      question:
        "A model deployed to a SageMaker Real-Time Endpoint is receiving significantly different input feature distributions than during training. Which feature detects this drift and triggers a retraining pipeline?",
      options: [
        "SageMaker Debugger — it monitors tensors during training for drift indicators",
        "SageMaker Experiments — it compares metric distributions across training runs",
        "SageMaker Model Monitor data quality monitoring — baselines training data and detects drift in live inference inputs, publishing CloudWatch alerts",
        "SageMaker Clarify — it measures bias drift in prediction distributions",
      ],
      correctIndex: 2,
      explanation:
        "SageMaker Model Monitor data quality monitoring continuously compares live inference input feature distributions against a baseline established from training data. When drift metrics exceed configured thresholds, it publishes CloudWatch alerts. EventBridge rules can react to these alerts to trigger SageMaker Pipelines retraining jobs — completing the closed-loop MLOps cycle.",
    },
  ],
};
