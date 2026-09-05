import { ServiceGuide } from "../../../types/guide";

export const modelEvaluationGuide: ServiceGuide = {
  id: "mls-model-evaluation",
  service: "ML Model Evaluation",
  domain: "fundamentals",
  tagline:
    "Metrics, validation strategies, and diagnostic techniques for assessing ML model performance",
  intro:
    "ML model evaluation determines how well a trained model generalizes to unseen data. MLS-C01 heavily tests knowledge of classification metrics (confusion matrix, precision, recall, F1, AUC-ROC), regression metrics (RMSE, MAE, R²), and diagnostic tools for identifying model failure modes.",

  sections: [
    {
      heading: "Classification Metrics and the Confusion Matrix",
      body: `The confusion matrix is the foundation of classification evaluation. For binary classification, it contains four cells: True Positives (TP — correctly predicted positive), True Negatives (TN — correctly predicted negative), False Positives (FP — predicted positive, actually negative; Type I error), and False Negatives (FN — predicted negative, actually positive; Type II error). All classification metrics derive from these four values.

Accuracy = (TP + TN) / (TP + TN + FP + FN) — misleading for imbalanced datasets. Precision = TP / (TP + FP) — of all predicted positives, how many are actually positive? High precision matters when false positives are costly (spam filter — don't want to mark real email as spam). Recall (Sensitivity) = TP / (TP + FN) — of all actual positives, how many did the model catch? High recall matters when false negatives are costly (cancer screening — don't want to miss a case). F1 = 2 × (Precision × Recall) / (Precision + Recall) — harmonic mean, balances precision and recall. Specificity = TN / (TN + FP) — true negative rate.`,
      quiz: [
        {
          question:
            "A medical diagnostic model for a dangerous disease misses 30% of true cases (FN rate = 30%). Which metric captures this failure mode, and why is it critical here?",
          options: [
            "Precision — measures what fraction of positive predictions are correct",
            "Accuracy — measures overall correctness across all predictions",
            "Recall (Sensitivity) = TP/(TP+FN) — captures how many actual positive cases the model detects; missing 30% means recall = 70%, which is dangerously low for a serious disease",
            "Specificity — measures how many negative cases are correctly identified",
          ],
          correctIndex: 2,
          explanation:
            "Recall (Sensitivity) measures what fraction of actual positive cases the model correctly identifies. A recall of 70% means 30% of actual disease cases are missed (false negatives). For life-threatening conditions, maximizing recall is critical — the cost of missing a true case far exceeds the cost of a false alarm that triggers further testing.",
        },
      ],
    },
    {
      heading: "AUC-ROC and Threshold Selection",
      body: `The ROC (Receiver Operating Characteristic) curve plots recall (sensitivity) on the y-axis against the false positive rate (1 - specificity) on the x-axis at every decision threshold from 0 to 1. AUC-ROC (Area Under the ROC Curve) summarizes this curve into a single number: AUC = 0.5 means the model performs no better than random chance; AUC = 1.0 means perfect discrimination. AUC-ROC is threshold-independent and measures the model's ability to rank positive examples above negative examples.

For severely imbalanced datasets, AUC-PR (Area Under the Precision-Recall Curve) is more informative than AUC-ROC. The PR curve plots precision on the y-axis and recall on the x-axis — a model that achieves high AUC-ROC on 1:100 imbalanced data may still have very low precision when predicting the minority class. AUC-PR focuses specifically on minority class performance. Threshold selection after training allows trading off precision vs. recall based on the business cost of false positives vs. false negatives — lower thresholds increase recall (catch more positives) at the cost of more false alarms.`,
      quiz: [
        {
          question:
            "Model A has AUC-ROC of 0.92 and Model B has AUC-ROC of 0.88 on a fraud detection task with 0.1% fraud rate. Model B has higher precision-recall AUC. Which model is better for this task?",
          options: [
            "Model A — higher AUC-ROC always means better model performance",
            "Model B — for severely imbalanced datasets, AUC-PR is more informative; higher PR AUC means better minority class performance",
            "Neither model is acceptable — both should achieve AUC > 0.95 for fraud detection",
            "Model A — AUC-ROC is specifically designed for imbalanced datasets",
          ],
          correctIndex: 1,
          explanation:
            "For severely imbalanced datasets like fraud (0.1% rate), AUC-PR is more informative than AUC-ROC. AUC-ROC can be misleadingly high because the model can achieve high true-negative rates easily (correctly classifying the abundant negatives). AUC-PR focuses on how well the model identifies the rare positive class. Model B's superior PR AUC indicates better fraud detection performance.",
        },
      ],
    },
    {
      heading: "Regression Metrics",
      body: `Regression evaluation metrics measure the magnitude and pattern of prediction errors. Mean Absolute Error (MAE) is the average absolute difference between predictions and actual values — in the same units as the target, robust to outliers. Mean Squared Error (MSE) squares the errors before averaging — penalizes large errors more heavily than MAE, sensitive to outliers. Root Mean Squared Error (RMSE) is the square root of MSE — also in the same units as the target, more interpretable than MSE but still outlier-sensitive.

R² (coefficient of determination) measures what fraction of the variance in the target variable is explained by the model. R² = 1 means perfect predictions; R² = 0 means the model does no better than predicting the mean; R² < 0 means the model performs worse than the mean baseline. Adjusted R² penalizes adding features that don't improve the model, making it more appropriate for comparing models with different numbers of features. For MLS-C01, know that RMSE penalizes large errors more than MAE — choose RMSE when large errors are particularly unacceptable (demand forecasting where large stockouts are disruptive).`,
      quiz: [
        {
          question:
            "A demand forecasting model's errors occasionally spike to 10x the typical error magnitude due to outlier events. Which regression metric should be minimized to reduce the impact of these rare large errors?",
          options: [
            "MAE — it treats all errors equally regardless of magnitude",
            "RMSE — by squaring errors, it penalizes large errors more heavily, making it the metric to optimize when large errors are unacceptable",
            "R² — it measures explained variance, directly penalizing large prediction errors",
            "MAPE — it measures percentage errors, normalizing for scale",
          ],
          correctIndex: 1,
          explanation:
            "RMSE squares errors before averaging, which heavily penalizes large prediction spikes. Minimizing RMSE focuses model training on reducing the large errors (10x spikes) more than the small ones. MAE treats all error magnitudes equally — minimizing MAE would not specifically address the large error events.",
        },
      ],
    },
    {
      heading: "Model Diagnostics: Learning Curves and Residual Analysis",
      body: `Learning curves plot training and validation loss (or accuracy) as a function of training data size or training epochs. For diagnosing underfitting (high bias): both train and validation error remain high as training progresses — adding more data will not help much; the model needs more complexity. For overfitting (high variance): training error decreases while validation error increases (the gap widens) — the model needs regularization, more data, or reduced complexity. Learning curves are the primary visual diagnostic for diagnosing model issues without changing the model.

Residual analysis for regression models plots prediction errors (residuals = actual - predicted) to check assumptions. Patterns in residuals indicate model problems: a funnel shape indicates heteroskedasticity (non-constant variance — may need log-transforming the target), a systematic curve indicates missing non-linear features, and clusters indicate the model misses a categorical segment of data. The SageMaker Debugger provides automated training job instrumentation — it captures gradients, activations, and losses at configurable intervals and runs built-in rules (e.g., vanishing gradient, overfit, class imbalance) to detect training issues automatically.`,
      quiz: [
        {
          question:
            "A learning curve shows that both training and validation loss are high and similar throughout training. What does this indicate, and what is the correct fix?",
          options: [
            "Overfitting — apply L2 regularization to reduce the validation loss",
            "High variance — add more training data to close the train/validation gap",
            "High bias (underfitting) — increase model complexity: add features, increase model capacity, or use a more complex algorithm",
            "Data leakage — training and validation loss should differ; similar values indicate contamination",
          ],
          correctIndex: 2,
          explanation:
            "When both training AND validation loss are high and similar, the model has high bias — it is too simple to capture the patterns in the data. The fix is to increase model complexity (more features, larger model, deeper network, or a different algorithm). If only validation loss were high (with low training loss), that would indicate overfitting requiring regularization.",
        },
      ],
    },
    {
      heading: "SageMaker Debugger and Model Monitor for Evaluation",
      body: `Amazon SageMaker Debugger automates training job analysis. You configure rules that run during training to detect issues: vanishing gradients (early layers receive negligible gradient signal), exploding gradients (gradients grow unboundedly, causing NaN losses), overfit tensors (training loss diverges significantly from validation), and class imbalance (training data class distribution). Debugger hooks capture tensors at configurable intervals and stores them in S3 for analysis. When a rule triggers, Debugger can stop the training job automatically, saving compute cost on training runs that won't converge.

SageMaker Clarify evaluates model bias at both the data preparation level (pre-training bias — class representation imbalance) and model prediction level (post-training bias — differential prediction accuracy across demographic groups). Bias metrics include Class Imbalance (CI), Difference in Positive Proportions in Predicted Labels (DPPL), and Disparate Impact (DI). Clarify also generates SHAP-based feature importance explanations, showing which features most influence individual predictions — critical for model transparency in regulated industries.`,
      quiz: [
        {
          question:
            "A SageMaker training job detects that gradients in early layers are approximately 1e-10 while later layers have gradients of order 1.0. Which Debugger rule detects this, and what does it indicate?",
          options: [
            "Overfit rule — the model is memorizing training data",
            "Vanishing gradient rule — early layers receive negligible gradient signal, preventing them from learning useful representations",
            "Class imbalance rule — unequal gradient magnitudes indicate class skew",
            "Loss not decreasing rule — the gradient values indicate the loss is not converging",
          ],
          correctIndex: 1,
          explanation:
            "Vanishing gradients occur when gradient magnitudes shrink exponentially through the network layers, particularly in deep networks with sigmoid activations. SageMaker Debugger's vanishing gradient rule detects when early layer gradients are orders of magnitude smaller than later layers, alerting teams before the training job wastes many hours on a non-converging model.",
        },
      ],
    },
    {
      heading: "Cross-Validation Strategies and A/B Testing",
      body: `K-Fold cross-validation splits the training data into K folds, trains K models each using a different fold as validation, and averages metrics across all folds. This produces a more reliable performance estimate than a single train/validation split. Stratified k-fold preserves class proportions in each fold — mandatory for imbalanced classification. Leave-One-Out (LOO): K=N, appropriate for very small datasets but computationally expensive. Nested cross-validation addresses a subtle problem: if you tune hyperparameters using the same cross-validation loop that evaluates the model, you optimistically bias the estimate. Nested CV uses an outer loop for model evaluation and an inner loop for hyperparameter tuning, providing an unbiased estimate of generalizable performance.

For time series, TimeSeriesSplit (walk-forward validation) creates folds where each training period ends before the corresponding validation period begins — future data can never inform past-period models. A/B testing in production uses SageMaker production variants to split live traffic (e.g., 90% current model, 10% new model). Statistical significance requires calculating the minimum detectable effect (MDE), desired power (80%), and significance level (5%) to determine the required sample size before declaring a winner. Shadow testing deploys a new model to receive real production traffic, but its responses are suppressed — only the shadow model's outputs are captured to S3 for offline comparison, with zero user impact.`,
      quiz: [
        {
          question:
            "Why is nested cross-validation recommended when both hyperparameter tuning and model evaluation are needed?",
          options: [
            "Nested CV is faster because it runs inner and outer loops in parallel",
            "Nested CV prevents optimistic bias by using separate inner (tuning) and outer (evaluation) loops — avoiding information leakage between hyperparameter selection and model evaluation",
            "Nested CV eliminates the need for a separate test set by using K folds for final evaluation",
            "Nested CV is required for time-series data where temporal ordering must be preserved",
          ],
          correctIndex: 1,
          explanation:
            "When the same cross-validation loop is used for both hyperparameter tuning and model evaluation, the selected hyperparameters are optimized for that specific cross-validation split, producing an optimistically biased performance estimate. Nested CV separates these: the outer loop evaluates generalization, the inner loop tunes hyperparameters — preventing information leakage.",
        },
      ],
    },
    {
      heading: "Evaluation for Ranking and Recommendation Models",
      body: `Recommendation system evaluation uses ranking-aware metrics that differ from classification metrics. Mean Reciprocal Rank (MRR) measures how highly ranked the first relevant item is: MRR = 1/rank of first relevant item, averaged across queries. If the first relevant result is always at rank 1, MRR = 1.0; if it's always at rank 5, MRR = 0.2. Mean Average Precision (MAP) averages precision at each rank position where a relevant item appears — it considers all relevant items, not just the first.

Normalized Discounted Cumulative Gain (NDCG) measures ranking quality with position-weighted relevance: relevant items at the top of the list are valued more than relevant items further down. DCG applies a log(rank) discount; NDCG normalizes DCG by the ideal DCG (if all relevant items were at the top). NDCG ranges from 0 to 1.0 and is the dominant ranking metric in information retrieval and recommendation systems. Precision@K and Recall@K measure the fraction of top-K items that are relevant and the fraction of all relevant items in the top-K, respectively. Coverage is the fraction of the total item catalog that appears in recommendations across all users — low coverage indicates popularity bias where the model recommends the same popular items to everyone.`,
      quiz: [
        {
          question:
            "A recommendation system always puts the single most relevant item at rank 3 and no other relevant items in the top 10. What is its MRR?",
          options: [
            "1.0 — the relevant item is in the top 10",
            "0.33 — MRR = 1/rank of first relevant item = 1/3",
            "0.1 — Precision@10 = 1 relevant item / 10 positions",
            "0.0 — the relevant item is not at rank 1",
          ],
          correctIndex: 1,
          explanation:
            "MRR = 1/rank of the first relevant result, averaged across queries. If the first relevant item is always at rank 3, MRR = 1/3 ≈ 0.33. MRR only considers the rank of the first relevant item, not subsequent relevant items — use MAP or NDCG when multiple relevant items per query exist.",
        },
      ],
    },
    {
      heading: "SageMaker Experiments and Model Registry",
      body: `SageMaker Experiments provides structured tracking for ML runs. Every SageMaker Training Job can be associated with an Experiment and Trial. Metrics logged during training (via the SageMaker SDK trial API, or automatically captured from CloudWatch) are queryable across all runs for comparison — enabling data scientists to find which hyperparameter combination produced the best validation metric across hundreds of runs. Experiment components track parameters, metrics, and artifacts for each run. ML Lineage Tracking automatically records the full provenance chain: which dataset + code + container produced which model artifact.

SageMaker Model Registry is a centralized catalog of trained model versions with metadata (metrics, environment, description). Models are registered as Model Package Groups containing versioned Model Packages. Each package has an approval status: PendingManualApproval, Approved, or Rejected. Only Approved model packages can be deployed to production endpoints via SageMaker Pipelines CI/CD rules — providing a mandatory quality gate between training and production. An ML engineer or data scientist reviews the trained model's metrics and approves or rejects it. EventBridge rules can trigger deployment pipelines when a model is Approved. This approval workflow is the governance layer of MLOps.`,
      quiz: [
        {
          question:
            "A SageMaker Pipeline trains a model and registers it to the Model Registry. How can the pipeline be configured to only deploy the model if its validation accuracy exceeds 0.90?",
          options: [
            "Set a CloudWatch alarm on the training job metric and trigger deployment if it fires",
            "Use a SageMaker Pipelines ConditionStep that checks the validation accuracy metric and only proceeds to registration if the condition is met; then require manual approval in Model Registry before deployment",
            "Configure the Training Job to fail automatically if accuracy is below threshold",
            "Use Model Monitor to compare the new model to the previous version before deployment",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Pipelines ConditionStep evaluates a metric condition (e.g., validation accuracy > 0.90) and branches the pipeline accordingly — only registering and deploying the model if the condition is met. The Model Registry approval workflow then provides a second gate requiring human sign-off before production deployment.",
        },
      ],
    },
  ],

  keyFacts: [
    "Confusion matrix: TP, TN, FP (Type I error), FN (Type II error) — foundation of all classification metrics",
    "Precision = TP/(TP+FP) — minimize FP when false alarms are costly (spam filter)",
    "Recall = TP/(TP+FN) — minimize FN when missing positives is costly (cancer screening)",
    "F1 = harmonic mean of precision and recall — balanced metric for imbalanced datasets",
    "AUC-ROC: threshold-independent discrimination metric; 0.5=random, 1.0=perfect",
    "AUC-PR: better metric than AUC-ROC for severely imbalanced datasets (fraud, anomaly)",
    "RMSE penalizes large errors more than MAE — choose RMSE when large errors are unacceptable",
    "R²: 1=perfect, 0=mean baseline, <0=worse than mean",
    "Learning curves: both train+val high = underfitting; train low/val high = overfitting",
    "SageMaker Debugger: auto-detects vanishing gradients, exploding gradients, overfit — can stop training jobs",
    "Nested cross-validation: outer loop evaluates, inner loop tunes — prevents hyperparameter leakage",
    "NDCG is the primary ranking metric for recommendation systems — discounts by log(rank)",
    "SageMaker Model Registry: approval workflow gates production deployment — PendingManualApproval → Approved → Rejected",
  ],

  relatedServices: [
    "Amazon SageMaker Debugger",
    "Amazon SageMaker Clarify",
    "Amazon SageMaker Experiments",
    "Amazon SageMaker Model Monitor",
    "Amazon CloudWatch",
    "Amazon SageMaker Autopilot",
  ],

  examTips: [
    "Recall = sensitivity = catches true positives — use when FN is costly (medical, fraud)",
    "Precision = use when FP is costly — spam filter, flagging content for removal",
    "AUC-PR > AUC-ROC for evaluating models on severely imbalanced datasets",
    "Both train and val high = high bias → more complexity; val high/train low = overfitting → regularize",
    "SageMaker Debugger: know vanishing gradient, exploding gradient, overfit rules — can stop training early",
    "SageMaker Clarify: pre-training bias (data imbalance) AND post-training bias (model prediction disparity)",
    "SHAP values in Clarify = feature attribution — which features drove a specific prediction",
    "Threshold tuning post-training allows trading off precision vs. recall based on business cost",
    "NDCG > Precision@K for ranking: NDCG considers position-weighted relevance across all top-K items",
    "Model Registry approval is the gate between training and production deployment in SageMaker MLOps",
  ],

  topicQuiz: [
    {
      question:
        "A fraud model has high AUC-ROC (0.95) but investigators complain that for every 10 fraud alerts they investigate, only 1 is actually fraud. Which metric reflects this problem?",
      options: [
        "Recall — the model misses too many fraud cases",
        "Precision = TP/(TP+FP) = 1/10 = 0.10 — only 10% of predicted fraud cases are actually fraud",
        "Specificity — the model has too many true negatives",
        "F1 score — the harmonic mean of precision and recall captures this imbalance",
      ],
      correctIndex: 1,
      explanation:
        "The scenario describes precision of 1/10 = 10% — 9 out of 10 fraud alerts are false positives. High AUC-ROC can coexist with low precision on imbalanced data because AUC-ROC is not sensitive to class imbalance. The business complaint is about false positive rate, which is the complement of precision.",
    },
    {
      question:
        "Which SageMaker service automatically detects bias in both training data and model predictions, and also provides SHAP-based feature explanations?",
      options: [
        "SageMaker Debugger — instructs training jobs to capture and analyze tensors",
        "SageMaker Model Monitor — detects drift in production inference data",
        "SageMaker Clarify — detects pre- and post-training bias and generates SHAP explanations",
        "SageMaker Experiments — tracks metrics across training runs for comparison",
      ],
      correctIndex: 2,
      explanation:
        "SageMaker Clarify performs bias detection at two stages: pre-training (data imbalance metrics like Class Imbalance, Difference in Positive Proportions) and post-training (prediction disparity metrics across demographic groups). It also generates SHAP feature importance values explaining individual predictions — the responsible AI tooling layer of SageMaker.",
    },
  ],
};
