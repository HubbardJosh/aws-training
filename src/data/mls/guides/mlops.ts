import { ServiceGuide } from "../../../types/guide";

export const mlopsGuide: ServiceGuide = {
  id: "mls-mlops",
  service: "ML Pipeline & MLOps",
  domain: "deployment",
  tagline:
    "Automating, versioning, and governing the ML lifecycle with SageMaker Pipelines and MLOps practices",
  intro:
    "MLOps applies DevOps principles to machine learning: automation of training, evaluation, and deployment workflows; version control for data, code, and models; monitoring for drift; and governance through approval workflows. SageMaker Pipelines, Model Registry, and Step Functions are the primary AWS tools for MLOps.",

  sections: [
    {
      heading: "SageMaker Pipelines: DAG-Based ML Workflows",
      body: `SageMaker Pipelines defines ML workflows as directed acyclic graphs (DAGs) using a Python SDK. Step types include: ProcessingStep (run a SageMaker Processing Job for data prep or evaluation), TrainingStep (run a SageMaker Training Job), TuningStep (run Automatic Model Tuning), TransformStep (run Batch Transform), RegisterModel step (register the model in Model Registry), ConditionStep (branch based on a metric threshold — e.g., only register if accuracy > 0.85), and CreateModelStep (create a deployable Model resource). Steps can run in parallel where there are no dependencies, and pass artifacts to downstream steps via SageMaker Properties.

Pipelines are versioned — each execution has a unique run ID with parameters, metrics, and artifacts stored in the pipeline run history. Executions can be parameterized: the same pipeline definition runs with different training instance types, hyperparameters, or dataset paths. Pipelines integrate with EventBridge for triggering on schedule (cron) or on event (new data lands in S3). CI/CD systems (CodePipeline, GitHub Actions) can trigger pipeline executions as part of the ML delivery workflow, implementing GitOps for ML.`,
      quiz: [
        {
          question:
            "Which SageMaker Pipelines step type prevents model registration unless a validation metric exceeds a required threshold?",
          options: [
            "ProcessingStep — evaluates model metrics in a processing job",
            "RegisterModel step — it has a built-in accuracy threshold parameter",
            "ConditionStep — branches the pipeline: registers the model if the condition passes, stops if it fails",
            "TuningStep — only produces models that meet the tuning objective",
          ],
          correctIndex: 2,
          explanation:
            "ConditionStep evaluates a condition (e.g., model accuracy > 0.85) and branches the pipeline based on the result. If the condition passes, downstream steps like RegisterModel run; if it fails, an alternative branch (or pipeline termination) is followed. This is the gating mechanism that prevents low-quality models from being registered.",
        },
      ],
    },
    {
      heading: "Model Registry and Approval Workflows",
      body: `SageMaker Model Registry is a versioned catalog of trained model packages. Each registered model version contains metadata including training job ARN, evaluation metrics, container image, model artifacts, and lineage to the dataset version used for training. Models are registered with an approval status of \`PendingManualApproval\` or \`Approved\`. Automated deployment pipelines query the registry for the latest \`Approved\` model and deploy it — the approval gate provides a human governance checkpoint before production.

Model Registry integrates with CI/CD: when a pipeline run produces a model that passes the ConditionStep threshold and registers as \`Approved\`, EventBridge can trigger a deployment pipeline (CodePipeline or Lambda) that creates a new endpoint configuration and updates the SageMaker endpoint. This creates a fully automated path from data change → training → evaluation → registration → deployment, with human approval as the only manual step. Model packages support A/B testing configurations, multi-model endpoints, and shadow deployment modes.`,
      quiz: [
        {
          question:
            "In a SageMaker MLOps workflow, a model has been registered in Model Registry with status PendingManualApproval. What happens after a human approves it?",
          options: [
            "SageMaker automatically retrains the model with the latest data",
            "The model status changes to Approved, and an EventBridge rule triggers the deployment pipeline to update the production endpoint",
            "The model is automatically deleted after 30 days if no endpoint is created",
            "SageMaker Clarify runs bias analysis on the approved model before deployment",
          ],
          correctIndex: 1,
          explanation:
            "When a model's approval status changes to Approved in Model Registry, EventBridge detects the status change event and triggers a downstream deployment pipeline (CodePipeline, Lambda, or SageMaker Pipelines). This pipeline creates/updates the SageMaker endpoint with the new model version — completing the automated deployment path.",
        },
      ],
    },
    {
      heading: "MLOps Maturity and CI/CD for ML",
      body: `ML maturity levels describe how automated an ML workflow is. Level 0: manual process — data scientists manually run experiments, train models, and deploy. Level 1: ML pipeline automation — automated training and evaluation pipelines, but model deployment is manual. Level 2: CI/CD pipeline automation — code changes trigger automated testing of the ML pipeline itself (integration tests on pipeline steps), and successful pipelines automatically deploy to production. The MLS-C01 exam may ask you to identify what maturity level is implemented or what is needed to advance to the next level.

CI/CD for ML uses the same tools as software CI/CD. A pull request to the ML training codebase triggers a CodePipeline or GitHub Actions workflow that: runs unit tests on preprocessing and postprocessing code, runs the SageMaker Pipeline with a small subset of data (integration test), evaluates the model on a validation set, and if all checks pass, registers the model as Approved and deploys it. AWS CodeBuild is used for running unit tests and packaging container images; CodePipeline orchestrates the stages. SageMaker Projects provides pre-built CI/CD templates for common MLOps patterns.`,
      quiz: [
        {
          question:
            "A team has automated model training and evaluation with SageMaker Pipelines, but a human must still manually review metrics and click 'Deploy' to push to production. What MLOps maturity level are they at, and what would advance them to Level 2?",
          options: [
            "Level 2 — they just need to add more models to fully automate",
            "Level 1 — they need to implement CI/CD for their ML pipeline code so code changes automatically trigger training, evaluation, and deployment without manual steps",
            "Level 0 — any manual step means no automation",
            "Level 3 — automated pipelines with human approval is the highest maturity level",
          ],
          correctIndex: 1,
          explanation:
            "Level 1 has automated ML pipelines (training + evaluation) but manual deployment triggers. Level 2 adds CI/CD automation: code changes trigger pipeline testing, and successful evaluations automatically deploy without manual intervention. The team needs to connect their code repository to a CI/CD system that triggers the full pipeline including automatic deployment.",
        },
      ],
    },
    {
      heading: "AWS Step Functions for ML Orchestration",
      body: `AWS Step Functions is an alternative to SageMaker Pipelines for orchestrating ML workflows, particularly when the pipeline includes non-SageMaker steps: Lambda functions, ECS tasks, DynamoDB writes, SNS notifications, or API calls to external systems. Step Functions state machines define workflows as JSON or YAML state definitions with built-in retry logic, error handling, parallel execution, and wait states. The SageMaker SDK for Step Functions provides pre-built states for training, tuning, endpoint creation, and batch transform.

Step Functions integrates natively with SageMaker via direct API integration — no Lambda intermediary required. The \`SageMaker:CreateTrainingJob\` and \`SageMaker:CreateModel\` resource integrations allow Step Functions to call SageMaker APIs and wait for completion synchronously. Step Functions is more appropriate than SageMaker Pipelines when the ML workflow spans multiple AWS services, requires complex branching or retry logic, or needs to coordinate human approval via manual tasks and callbacks. Step Functions Express Workflows support high-throughput, event-driven ML workflows.`,
      quiz: [
        {
          question:
            "An ML workflow needs to: train a SageMaker model, write model metrics to DynamoDB, send a Slack notification via API Gateway, and conditionally deploy to a SageMaker endpoint. Which orchestration service is most appropriate?",
          options: [
            "SageMaker Pipelines — it supports all AWS service integrations natively",
            "AWS Step Functions — it orchestrates multi-service workflows including Lambda, DynamoDB, API Gateway, and SageMaker with built-in retry and branching",
            "Amazon EventBridge — create rules that chain each step to the next based on events",
            "AWS Glue Workflows — they orchestrate ETL and ML steps across services",
          ],
          correctIndex: 1,
          explanation:
            "Step Functions is the correct choice when the ML workflow spans multiple services beyond SageMaker (DynamoDB, API Gateway, Lambda for Slack). SageMaker Pipelines is optimized for SageMaker-native steps and does not natively integrate with DynamoDB or external APIs. Step Functions provides native SDK integrations and built-in retry/error handling across all these services.",
        },
      ],
    },
    {
      heading: "Monitoring, Retraining, and Closed-Loop MLOps",
      body: `The most mature MLOps architectures close the loop between production monitoring and retraining. SageMaker Model Monitor detects four drift types (data quality, model quality, bias, feature attribution) and publishes alerts to CloudWatch. EventBridge rules react to CloudWatch alarms by triggering SageMaker Pipelines retraining executions. When retraining completes and the new model passes evaluation, it is automatically registered as Approved and deployed — requiring no human intervention until the next approval cycle.

Data versioning is a prerequisite for reproducible MLOps. S3 versioning links model artifacts to the exact dataset version used for training. DVC (Data Version Control) or SageMaker Feature Store's offline store (which timestamps all feature versions) provides dataset lineage. Code versioning via Git links training runs to specific algorithm versions. Model Registry links the trained model to the training job, data version, and evaluation metrics. This lineage chain (data version → code version → training run → model version → deployed endpoint) enables complete auditability of any production model.`,
      quiz: [
        {
          question:
            "A SageMaker Model Monitor alert fires because input feature distributions have drifted from the training baseline. What is the correct automated response in a closed-loop MLOps architecture?",
          options: [
            "Send an email to the data science team to investigate the drift manually",
            "Model Monitor automatically retrains the model when drift is detected",
            "CloudWatch alarm triggers an EventBridge rule that invokes a SageMaker Pipelines retraining execution, which evaluates the new model and auto-deploys if it passes",
            "SageMaker automatically rolls back to the previous model version stored in Model Registry",
          ],
          correctIndex: 2,
          explanation:
            "In a closed-loop MLOps architecture: Model Monitor detects drift → CloudWatch alarm triggers → EventBridge rule fires → SageMaker Pipelines retraining execution starts → new model trained and evaluated → if it passes the ConditionStep threshold, registered as Approved → EventBridge triggers deployment pipeline → production endpoint updated. This is the fully automated MLOps response.",
        },
      ],
    },
    {
      heading: "Feature Drift vs. Concept Drift",
      body: `Feature drift (also called data drift or covariate shift) occurs when the statistical distribution of input features changes compared to training data — for example, average customer age in incoming requests shifts upward after a new marketing campaign targets older demographics. The model's internal decision boundaries remain unchanged, but the inputs no longer match what the model was trained on, degrading prediction accuracy. SageMaker Model Monitor's data quality monitor detects feature drift by comparing live feature statistics against a baseline captured at training time.

Concept drift is a deeper problem: the underlying relationship between features and the target label changes. A fraud detection model trained on pre-pandemic transaction patterns may become obsolete as fraud tactics evolve — the same features now predict different outcomes. Concept drift is detected by model quality monitoring (comparing live predictions against ground truth labels when they become available) rather than feature statistics alone. Both drift types require retraining, but concept drift often requires fresh labeled data and potentially a different model architecture.`,
      quiz: [
        {
          question:
            "A recommendation model's click-through rate drops significantly after user behavior changed during a seasonal event. Feature distributions look similar but ground-truth labels are now misaligned with predictions. Which type of drift is this?",
          options: [
            "Feature drift — input distributions have changed from the training baseline",
            "Concept drift — the relationship between features and target labels has changed, even though input distributions appear stable",
            "Model quality drift — the model's accuracy metric has degraded on recent data",
            "Bias drift — the model now performs differently across user demographic groups",
          ],
          correctIndex: 1,
          explanation:
            "Concept drift occurs when the underlying statistical relationship between inputs and outputs changes — the same features now predict different outcomes. When features look similar but model performance degrades (ground-truth labels diverge from predictions), concept drift is the cause. Retraining on recent data with updated labels is the remedy.",
        },
      ],
    },
    {
      heading: "Infrastructure as Code for ML",
      body: `Treating ML infrastructure as code ensures reproducible environments across dev, staging, and production. AWS CloudFormation or AWS CDK define SageMaker endpoints, endpoint configurations, IAM roles, S3 buckets, KMS keys, and EventBridge rules as version-controlled templates. Changes to infrastructure go through pull request review before being applied, preventing ad-hoc configuration drift. CloudFormation StackSets deploy identical ML infrastructure across multiple AWS accounts (dev/staging/prod) with a single template.

AWS CDK (Cloud Development Kit) allows ML infrastructure to be defined using Python, TypeScript, or Java — enabling the same unit testing practices applied to ML code to be applied to infrastructure code. The \`aws-cdk-lib.aws_sagemaker\` module provides constructs for Endpoints, EndpointConfigs, Models, and Pipelines. CDK Pipelines (a CDK construct for CI/CD) can deploy ML infrastructure updates automatically when infrastructure code changes. Combining CDK for infrastructure with SageMaker Pipelines for ML workflows gives a fully code-first, reproducible MLOps stack.`,
      quiz: [
        {
          question:
            "A team wants to ensure their SageMaker endpoint configuration is identical across dev, staging, and production accounts. Which approach achieves this with the least risk of configuration drift?",
          options: [
            "Document the endpoint configuration in a wiki and apply it manually to each account",
            "Use CloudFormation StackSets to deploy the same template across all three accounts, with environment-specific parameters",
            "Clone the production endpoint configuration to staging and dev after each production deployment",
            "Use AWS Config to detect drift and alert the team when configurations diverge",
          ],
          correctIndex: 1,
          explanation:
            "CloudFormation StackSets deploy a single template to multiple accounts simultaneously, ensuring identical infrastructure with only environment-specific parameters (instance type, endpoint name) differing. This eliminates manual configuration drift by making infrastructure declarative and version-controlled.",
        },
      ],
    },
    {
      heading: "ML Governance, Audit, and Compliance",
      body: `ML governance addresses accountability: who trained which model, on what data, and why was it approved for production. AWS provides several layers: SageMaker ML Lineage Tracking records provenance graphs (dataset → training job → model → endpoint); Model Registry stores approval decisions with timestamps and approver identity; CloudTrail logs every API call to SageMaker, including model approval changes, endpoint updates, and pipeline executions; and SageMaker Model Cards document model purpose, training data, evaluation results, and known limitations.

For regulated industries (finance, healthcare), governance requirements often mandate demonstrating model fairness and explainability. SageMaker Clarify generates bias reports and SHAP explanations that can be attached to Model Registry entries as metadata. AWS Audit Manager can include SageMaker governance checks in compliance frameworks. IAM permission boundaries and Service Control Policies (SCPs) enforce who can approve, deploy, or delete models — preventing unauthorized changes to production ML systems.`,
      quiz: [
        {
          question:
            "A bank's compliance team requires proof that every deployed credit model was trained only on approved datasets and passed bias testing. Which combination of AWS services provides this audit trail?",
          options: [
            "CloudWatch Logs and SageMaker Experiments — they track all training metrics",
            "SageMaker ML Lineage Tracking (provenance from dataset to endpoint) + Model Registry (approval records) + Clarify bias reports attached as model metadata",
            "AWS Config and CloudTrail — they record all API calls and configuration changes",
            "SageMaker Model Monitor and CloudWatch — they demonstrate ongoing model fairness post-deployment",
          ],
          correctIndex: 1,
          explanation:
            "The complete compliance package requires: Lineage Tracking to prove which dataset was used; Model Registry to show the approval decision and who approved it; Clarify bias reports as evidence of fairness testing. Together these create an end-to-end audit trail from data to deployed model to approval decision.",
        },
      ],
    },
    {
      heading: "SageMaker Model Monitor Deep Dive",
      body: `SageMaker Model Monitor runs scheduled monitoring jobs against live endpoint traffic captured in S3. The four monitor types each require a baseline: the data quality monitor baselines feature statistics (mean, std, missing values, distributions) from the training dataset; the model quality monitor baselines predictions against ground-truth labels (requiring a label join step); the bias monitor baselines fairness metrics computed by Clarify; and the feature attribution monitor baselines SHAP values per feature. All monitors compare live statistics against their respective baselines and publish violations to CloudWatch.

Configuring Model Monitor involves three artifacts: a baseline job (run once to compute statistics from training data), a monitoring schedule (cron expression — typically hourly), and an output S3 location for reports and violations. The \`DefaultModelMonitor\` class handles data quality; \`ModelQualityMonitor\`, \`BiasMonitor\`, and \`ExplainabilityMonitor\` handle the others. Violations appear in CloudWatch as custom metrics under the \`aws/sagemaker/Endpoints/data-metrics\` namespace, where CloudWatch Alarms trigger downstream actions.`,
      quiz: [
        {
          question:
            "SageMaker Model Monitor is configured on a production endpoint. The bias monitor fires a violation. What is the correct sequence of events in an automated remediation pipeline?",
          options: [
            "Model Monitor retrains the model automatically when a bias violation is detected",
            "Model Monitor publishes the violation to CloudWatch → CloudWatch Alarm triggers → EventBridge rule fires → SageMaker Pipelines retraining execution starts with updated fairness constraints",
            "Model Monitor sends an email via SES to the data science team for manual investigation",
            "Model Monitor automatically rolls back the endpoint to the previous model version in Model Registry",
          ],
          correctIndex: 1,
          explanation:
            "Model Monitor does not take direct action — it publishes violations as CloudWatch metrics. The automation is external: a CloudWatch Alarm detects the violation metric exceeding a threshold, triggers an EventBridge rule, which starts a SageMaker Pipelines execution for retraining. This event-driven chain is the standard closed-loop MLOps pattern.",
        },
      ],
    },
  ],

  keyFacts: [
    "SageMaker Pipelines: DAG-based ML workflow with ProcessingStep, TrainingStep, TuningStep, ConditionStep, RegisterModel",
    "ConditionStep gates model registration based on metric thresholds (e.g., accuracy > 0.85)",
    "Model Registry: versioned catalog with PendingManualApproval and Approved statuses",
    "EventBridge triggers deployment pipeline when Model Registry status changes to Approved",
    "MLOps Level 0=manual; Level 1=automated pipelines; Level 2=CI/CD triggers full automation",
    "Step Functions: multi-service ML orchestration (DynamoDB, Lambda, SNS, SageMaker, API Gateway)",
    "SageMaker Projects: pre-built MLOps CI/CD templates for common patterns",
    "Model lineage: data version → code version → training run → model version → deployed endpoint",
    "Closed-loop MLOps: Monitor detects drift → EventBridge → retraining Pipeline → auto-deploy",
    "SageMaker Pipelines parameters: same pipeline runs with different instance types or dataset paths",
  ],

  relatedServices: [
    "Amazon SageMaker Model Monitor",
    "Amazon EventBridge",
    "AWS CodePipeline",
    "AWS Step Functions",
    "Amazon CloudWatch",
    "Amazon S3",
  ],

  examTips: [
    "ConditionStep is the quality gate — prevents bad models from reaching Model Registry",
    "Model Registry status Approved → EventBridge → deployment pipeline is the standard auto-deploy pattern",
    "SageMaker Pipelines for SageMaker-native steps; Step Functions when other services are involved",
    "MLOps Level 2 requires CI/CD so code changes automatically trigger training → evaluation → deployment",
    "Closed-loop MLOps: drift detection → EventBridge → retraining pipeline → auto-deploy",
    "SageMaker Projects = pre-built MLOps templates — use them to bootstrap CI/CD for ML",
    "Pipelines can be parameterized — same definition, different inputs per execution",
    "Model lineage (data → code → model → endpoint) enables full auditability of production models",
  ],

  topicQuiz: [
    {
      question:
        "A SageMaker Pipeline completes training but should only register the model if validation AUC exceeds 0.90. Which step type implements this logic?",
      options: [
        "ProcessingStep — run evaluation and write a metric file",
        "ConditionStep — evaluate the AUC condition and branch to RegisterModel if true, or terminate if false",
        "RegisterModel with a minimum_score parameter set to 0.90",
        "TuningStep — it only produces models that meet the AUC objective",
      ],
      correctIndex: 1,
      explanation:
        "ConditionStep in SageMaker Pipelines evaluates boolean conditions on pipeline properties or metrics. You define a condition (AUC > 0.90) and two branches — if true, continue to RegisterModel; if false, end the pipeline or take an alternative path. This is the quality gate that prevents sub-threshold models from entering the Model Registry.",
    },
    {
      question:
        "A team's ML pipeline takes 4 hours to run. They want code changes to the training script to automatically trigger the pipeline and deploy if successful. What MLOps maturity level does this represent, and which AWS services implement it?",
      options: [
        "Level 1 — CodePipeline is not needed for automated ML pipelines",
        "Level 2 — CodePipeline triggers SageMaker Pipelines on git commit; successful evaluation auto-deploys via Model Registry approval and EventBridge",
        "Level 0 — the team still writes code changes manually",
        "Level 3 — fully automated pipelines are the highest maturity level",
      ],
      correctIndex: 1,
      explanation:
        "MLOps Level 2 connects code versioning to automated training and deployment: a git commit triggers CodePipeline, which runs the SageMaker Pipeline (training + evaluation). A successful pipeline auto-registers the model as Approved, EventBridge triggers the deployment pipeline, and the production endpoint is updated — all without manual intervention. This is the target state for mature MLOps.",
    },
  ],
};
