import { ServiceGuide } from "../../../types/guide";

export const responsibleAIGuide: ServiceGuide = {
  id: "aif-responsible-ai",
  service: "Responsible AI",
  domain: "security",
  tagline:
    "Principles and practices for building fair, transparent, and accountable AI systems",
  intro:
    "Responsible AI encompasses the principles, tools, and processes that ensure AI systems are fair, transparent, accountable, safe, and aligned with human values — critical considerations for every organization deploying ML and AI at scale.",

  sections: [
    {
      heading: "Core Principles of Responsible AI",
      body: `AWS articulates its responsible AI principles around six pillars that should guide AI development and deployment decisions.

**Fairness** means AI systems should treat people equitably and not produce outcomes that systematically disadvantage individuals or groups based on protected characteristics such as race, gender, age, religion, or national origin. Fairness is not a single metric — it encompasses dozens of mathematical definitions (demographic parity, equalized odds, individual fairness) that can be in tension with each other, requiring explicit trade-off decisions.

**Explainability** means stakeholders can understand how a model produces its outputs. For high-stakes decisions (loan approval, hiring, medical diagnosis), black-box predictions are inadequate — decision-makers and affected individuals need to understand the basis for AI-driven conclusions. Tools like SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations) compute feature attributions that explain individual predictions.

**Robustness** means models perform reliably across diverse inputs, edge cases, and adversarial conditions. A model that performs well on average but fails catastrophically on certain subgroups or under distribution shift is not robust enough for production deployment.

**Privacy** means AI systems should respect individuals' data rights — minimizing data collection, applying differential privacy techniques, enabling right-to-deletion, and ensuring that models cannot be queried to reconstruct sensitive training data through membership inference attacks.

**Safety** means AI systems should not cause harm — physical, financial, psychological, or societal. This includes fail-safe behaviors, human oversight mechanisms, content filtering, and careful deployment planning.

**Controllability** means humans retain meaningful oversight and the ability to correct, adjust, or shut down AI systems.`,
    },
    {
      heading: "Types of Bias in ML Systems",
      body: `Bias in AI systems can arise at multiple points in the ML pipeline, and understanding its sources is essential for addressing it.

**Historical bias** is present in the training data itself: if historical decisions reflected societal prejudices (e.g., hiring data from a company that historically favored certain demographics), a model trained on that data learns those prejudices. Even removing protected attributes is insufficient because proxy variables (zip code, school attended, name) can correlate with protected characteristics.

**Selection bias** occurs when training data is not representative of the population the model will serve. A medical imaging model trained predominantly on images from one demographic may perform poorly on underrepresented groups.

**Label bias** arises when the labels (ground truth) used for training reflect human biases — annotators may consistently make different judgments for subjects of different characteristics, embedding those biases into the training signal.

**Measurement bias** occurs when features are measured differently across groups — for example, a proxy for healthcare need that systematically underestimates need for certain populations because their healthcare access is lower.

**Feedback loops** amplify existing biases: a biased model makes biased predictions, those predictions influence real-world outcomes (e.g., which neighborhoods get policed more), the resulting data feeds back into the next training cycle, reinforcing and amplifying the original bias.`,
    },
    {
      heading: "Detecting and Mitigating Bias",
      body: `AWS provides tooling for bias detection and mitigation through **Amazon SageMaker Clarify**, which integrates with SageMaker's training and deployment infrastructure.

**Pre-training bias metrics** analyze training data before any model is built, identifying statistical imbalances: Class Imbalance (CI), Difference in Positive Proportions in Labels (DPL), Jensen-Shannon Divergence, and others. These metrics quantify how differently different demographic groups are represented in the training data and labels.

**Post-training bias metrics** evaluate a trained model's predictions across demographic groups: Difference in Positive Proportions in Predicted Labels (DPPL), Disparate Impact (DI), Accuracy Difference, Recall Difference, Specificity Difference, and Treatment Equality. These metrics reveal whether the model makes systematically different errors for different groups.

**Mitigation strategies** fall into three categories. **Pre-processing** modifies training data to reduce imbalance — resampling, reweighting, relabeling. **In-processing** modifies the training algorithm to incorporate fairness constraints. **Post-processing** adjusts model outputs — thresholds, calibration — to equalize outcomes across groups. Each approach involves trade-offs: reducing one type of unfairness often reduces accuracy for the advantaged group or increases another type of unfairness, reflecting fundamental mathematical trade-offs between fairness criteria.`,
    },
    {
      heading: "Explainability Tools and Techniques",
      body: `Model explainability operates at two levels. **Global explanations** describe overall model behavior — which features are most important across all predictions. **Local explanations** describe why the model made a specific prediction for a specific instance.

**SHAP (SHapley Additive exPlanations)** is the dominant local explanation technique. SHAP values compute the marginal contribution of each feature to a prediction by averaging over all possible feature orderings, drawing from cooperative game theory. They satisfy desirable properties (local accuracy, missingness, consistency) and produce consistent, comparable explanations. SageMaker Clarify computes SHAP values at scale for batch inference.

**Feature importance** (global) measures how much each feature contributes to model performance overall. For tree-based models, Gini importance or permutation importance quantifies each feature's role. For neural networks, gradient-based attribution methods (Integrated Gradients, GradCAM for images) trace the prediction back to input features.

**Partial Dependence Plots (PDPs)** and **Individual Conditional Expectation (ICE)** plots visualize the relationship between a feature and model predictions across all instances, revealing non-linear relationships and interaction effects.

For generative AI specifically, explainability takes different forms — **prompt attribution** studies which parts of a prompt most influenced the output, while **chain-of-thought** prompting makes reasoning steps explicit and auditable.`,
    },
    {
      heading: "Governance, Accountability, and Human Oversight",
      body: `Responsible AI is not only a technical challenge — it requires organizational structures, policies, and processes to ensure accountability.

**AI governance** involves policies that define how AI systems are approved, deployed, and monitored. This includes risk classification (which use cases require higher scrutiny), review boards that evaluate high-risk AI applications before deployment, documentation requirements (model cards describing training data, intended use, known limitations, performance characteristics), and incident response processes for when AI systems cause harm.

**Model cards** are a standard documentation format for trained ML models, capturing: the model's intended use, training data characteristics, evaluation methodology, performance metrics across demographic groups, known limitations, ethical considerations, and recommended use constraints. SageMaker Model Registry supports attaching model card documents to model versions.

**Human-in-the-loop** design ensures consequential decisions have human review. **Amazon Augmented AI (A2I)** provides a managed service for routing ML predictions to human reviewers when confidence is below a threshold — applicable to any ML prediction task. For generative AI, human oversight means not allowing models to take irreversible actions autonomously, maintaining audit logs of all AI-driven decisions, and ensuring users understand they are interacting with AI.

**Accountability** requires knowing who is responsible when AI causes harm: the organization deploying the system, the team that built it, or the provider of the underlying model. AWS's **shared responsibility model** extends to AI: AWS is responsible for the foundation model and service infrastructure; customers are responsible for how they configure, deploy, and use AI systems including content filtering, access controls, and compliance.`,
    },
  ],

  keyFacts: [
    "AWS responsible AI pillars: Fairness, Explainability, Robustness, Privacy, Safety, Controllability",
    "Bias types: historical, selection, label, measurement, and feedback loop bias",
    "SageMaker Clarify detects pre-training and post-training bias using statistical metrics",
    "SHAP values explain individual predictions by computing marginal feature contributions",
    "Bias mitigation: pre-processing (data), in-processing (algorithm), post-processing (outputs)",
    "Model cards document intended use, training data, limitations, and performance metrics",
    "Amazon A2I provides human-in-the-loop review for low-confidence ML predictions",
    "Fairness metrics: Demographic Parity, Equalized Odds, Individual Fairness",
    "AI governance requires policies, review boards, documentation, and incident response",
    "AWS shared responsibility: AWS owns model/infrastructure; customers own deployment and use",
  ],

  relatedServices: [
    "Amazon SageMaker Clarify",
    "Amazon Bedrock Guardrails",
    "Amazon Augmented AI (A2I)",
    "Amazon SageMaker",
    "AWS IAM",
  ],

  examTips: [
    "Know all six AWS responsible AI pillars — the exam tests principle identification",
    "SageMaker Clarify is the primary bias detection and explainability tool",
    "Distinguish pre-training bias (data imbalance) from post-training bias (model prediction disparity)",
    "SHAP = local feature attribution; feature importance = global model explanation",
    "Removing protected attributes does NOT prevent bias if proxy variables are present",
    "Model cards document what a model can and cannot do — part of governance",
    "A2I = human review for low-confidence predictions — human-in-the-loop pattern",
    "Feedback loops amplify bias over time — a critical risk in deployed systems",
  ],
};
