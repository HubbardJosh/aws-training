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
      body: `AWS articulates its responsible AI principles around eight dimensions that should guide AI development and deployment decisions.

**Fairness** means AI systems should treat people equitably and not produce outcomes that systematically disadvantage individuals or groups based on protected characteristics such as race, gender, age, religion, or national origin. Fairness is not a single metric — it encompasses dozens of mathematical definitions (demographic parity, equalized odds, individual fairness) that can be in tension with each other, requiring explicit trade-off decisions.

**Explainability** means stakeholders can understand how a model produces its outputs. For high-stakes decisions (loan approval, hiring, medical diagnosis), black-box predictions are inadequate — decision-makers and affected individuals need to understand the basis for AI-driven conclusions. Tools like SHAP (SHapley Additive exPlanations) and LIME (Local Interpretable Model-agnostic Explanations) compute feature attributions that explain individual predictions.

**Robustness** means models perform reliably across diverse inputs, edge cases, and adversarial conditions. A model that performs well on average but fails catastrophically on certain subgroups or under distribution shift is not robust enough for production deployment.

**Privacy and Security** means AI systems should respect individuals' data rights — minimizing data collection, applying differential privacy techniques, enabling right-to-deletion, and ensuring that models cannot be queried to reconstruct sensitive training data through membership inference attacks.

**Safety** means AI systems should not cause harm — physical, financial, psychological, or societal. This includes fail-safe behaviors, human oversight mechanisms, content filtering, and careful deployment planning.

**Controllability** means humans retain meaningful oversight and the ability to correct, adjust, or shut down AI systems.

**Transparency** means being open about how AI systems work, what data they were trained on, what their limitations are, and when AI is being used to make or influence decisions affecting people.

**Veracity and Robustness** means AI outputs should be accurate and that the system behaves consistently and predictably across a wide range of inputs, resisting attempts to cause failures through adversarial manipulation.`,
      quiz: [
        {
          question:
            "Which AWS responsible AI principle specifically addresses ensuring that stakeholders can understand how a model produces its outputs?",
          options: [
            "Fairness",
            "Explainability",
            "Controllability",
            "Transparency",
          ],
          correctIndex: 1,
          explanation:
            "Explainability means stakeholders can understand how a model arrives at its outputs. For high-stakes decisions like loan approvals or hiring, this requires tools like SHAP or LIME to compute feature attributions that explain individual predictions.",
        },
        {
          question:
            "How many core responsible AI dimensions does AWS articulate, and which of the following is NOT one of them?",
          options: [
            "Eight dimensions; Profitability is not one of them",
            "Six dimensions; Controllability is not one of them",
            "Eight dimensions; Scalability is not one of them",
            "Ten dimensions; Safety is not one of them",
          ],
          correctIndex: 2,
          explanation:
            "AWS articulates eight responsible AI dimensions: Fairness, Explainability, Robustness, Privacy & Security, Safety, Controllability, Transparency, and Veracity & Robustness. Scalability is not one of them — it is an engineering concern, not a responsible AI principle.",
        },
      ],
    },
    {
      heading: "Types of Bias in ML Systems",
      body: `Bias in AI systems can arise at multiple points in the ML pipeline, and understanding its sources is essential for addressing it.

**Historical bias** is present in the training data itself: if historical decisions reflected societal prejudices (e.g., hiring data from a company that historically favored certain demographics), a model trained on that data learns those prejudices. Even removing protected attributes is insufficient because proxy variables (zip code, school attended, name) can correlate with protected characteristics.

**Selection bias** occurs when training data is not representative of the population the model will serve. A medical imaging model trained predominantly on images from one demographic may perform poorly on underrepresented groups.

**Label bias** arises when the labels (ground truth) used for training reflect human biases — annotators may consistently make different judgments for subjects of different characteristics, embedding those biases into the training signal.

**Measurement bias** occurs when features are measured differently across groups — for example, a proxy for healthcare need that systematically underestimates need for certain populations because their healthcare access is lower.

**Feedback loops** amplify existing biases: a biased model makes biased predictions, those predictions influence real-world outcomes (e.g., which neighborhoods get policed more), the resulting data feeds back into the next training cycle, reinforcing and amplifying the original bias.`,
      quiz: [
        {
          question:
            "A hiring model was trained on a company's historical promotion data from a period when leadership roles were disproportionately awarded to one demographic group. Which type of bias does this represent?",
          options: [
            "Selection bias",
            "Label bias",
            "Historical bias",
            "Measurement bias",
          ],
          correctIndex: 2,
          explanation:
            "Historical bias is present when training data reflects past societal prejudices or discriminatory decisions. A model trained on historically biased promotion data will learn and perpetuate those prejudices — even if protected attributes are removed, proxy variables may remain.",
        },
        {
          question:
            "Why is simply removing protected attributes (race, gender, age) from training data insufficient to eliminate bias in ML models?",
          options: [
            "Because protected attributes are required by law to be included in model training",
            "Because proxy variables like zip code, school attended, or name can correlate with protected characteristics and carry the same bias",
            "Because the model will randomly assign protected attributes during inference",
            "Because fairness metrics require protected attribute columns to compute",
          ],
          correctIndex: 1,
          explanation:
            "Removing protected attributes does not eliminate bias because proxy variables remain. Features like zip code, school name, or even first name can correlate strongly with race, gender, or socioeconomic status, allowing the model to discriminate indirectly through these proxies.",
        },
      ],
    },
    {
      heading: "Detecting and Mitigating Bias",
      body: `AWS provides tooling for bias detection and mitigation through **Amazon SageMaker Clarify**, which integrates with SageMaker's training and deployment infrastructure.

**Pre-training bias metrics** analyze training data before any model is built, identifying statistical imbalances: Class Imbalance (CI), Difference in Positive Proportions in Labels (DPL), Jensen-Shannon Divergence, and others. These metrics quantify how differently different demographic groups are represented in the training data and labels.

**Post-training bias metrics** evaluate a trained model's predictions across demographic groups: Difference in Positive Proportions in Predicted Labels (DPPL), Disparate Impact (DI), Accuracy Difference, Recall Difference, Specificity Difference, and Treatment Equality. These metrics reveal whether the model makes systematically different errors for different groups.

**Mitigation strategies** fall into three categories. **Pre-processing** modifies training data to reduce imbalance — resampling, reweighting, relabeling. **In-processing** modifies the training algorithm to incorporate fairness constraints. **Post-processing** adjusts model outputs — thresholds, calibration — to equalize outcomes across groups. Each approach involves trade-offs: reducing one type of unfairness often reduces accuracy for the advantaged group or increases another type of unfairness, reflecting fundamental mathematical trade-offs between fairness criteria.`,
      quiz: [
        {
          question:
            "Which AWS service provides pre-training and post-training bias detection metrics integrated with the SageMaker ML platform?",
          options: [
            "Amazon Augmented AI (A2I)",
            "Amazon SageMaker Clarify",
            "Amazon SageMaker Model Monitor",
            "AWS Trusted Advisor",
          ],
          correctIndex: 1,
          explanation:
            "Amazon SageMaker Clarify is the primary tool for bias detection and explainability in the AWS ML platform. It provides pre-training bias metrics (analyzing data imbalance before training) and post-training bias metrics (evaluating model prediction disparities across groups).",
        },
        {
          question:
            "A post-training bias analysis shows that a credit scoring model approves loans at significantly different rates for two demographic groups with similar creditworthiness. Which post-training bias metric most directly captures this?",
          options: [
            "Class Imbalance (CI)",
            "Difference in Positive Proportions in Labels (DPL)",
            "Disparate Impact (DI)",
            "Jensen-Shannon Divergence",
          ],
          correctIndex: 2,
          explanation:
            "Disparate Impact (DI) measures the ratio of positive prediction rates between demographic groups. A DI significantly different from 1.0 indicates the model approves or denies at systematically different rates across groups — a key post-training bias metric for lending and hiring models.",
        },
      ],
    },
    {
      heading: "Explainability Tools and Techniques",
      body: `Model explainability operates at two levels. **Global explanations** describe overall model behavior — which features are most important across all predictions. **Local explanations** describe why the model made a specific prediction for a specific instance.

**SHAP (SHapley Additive exPlanations)** is the dominant local explanation technique. SHAP values compute the marginal contribution of each feature to a prediction by averaging over all possible feature orderings, drawing from cooperative game theory. They satisfy desirable properties (local accuracy, missingness, consistency) and produce consistent, comparable explanations. SageMaker Clarify computes SHAP values at scale for batch inference.

**Feature importance** (global) measures how much each feature contributes to model performance overall. For tree-based models, Gini importance or permutation importance quantifies each feature's role. For neural networks, gradient-based attribution methods (Integrated Gradients, GradCAM for images) trace the prediction back to input features.

**Partial Dependence Plots (PDPs)** and **Individual Conditional Expectation (ICE)** plots visualize the relationship between a feature and model predictions across all instances, revealing non-linear relationships and interaction effects.

For generative AI specifically, explainability takes different forms — **prompt attribution** studies which parts of a prompt most influenced the output, while **chain-of-thought** prompting makes reasoning steps explicit and auditable.`,
      quiz: [
        {
          question:
            "What does a SHAP value represent in the context of ML model explainability?",
          options: [
            "The overall importance of a feature across all predictions in the dataset",
            "The marginal contribution of a specific feature to a specific individual prediction",
            "The probability that a model prediction is correct for a given input",
            "The difference in model accuracy between two demographic groups",
          ],
          correctIndex: 1,
          explanation:
            "SHAP (SHapley Additive exPlanations) values are a local explanation technique. Each SHAP value represents the marginal contribution of a specific feature to a specific individual prediction, computed by averaging over all possible feature orderings using cooperative game theory.",
        },
        {
          question:
            "What is the difference between global and local model explainability?",
          options: [
            "Global explainability covers all models in production; local explainability covers a single model",
            "Global explainability describes overall feature importance across all predictions; local explainability explains a specific prediction for a specific instance",
            "Global explainability uses SHAP values; local explainability uses feature importance",
            "Global explainability applies to neural networks; local explainability applies to tree-based models",
          ],
          correctIndex: 1,
          explanation:
            "Global explainability describes overall model behavior — which features matter most across all predictions. Local explainability explains why the model made a specific decision for a specific individual instance. SHAP provides local explanations; feature importance provides global explanations.",
        },
      ],
    },
    {
      heading: "Governance, Accountability, and Human Oversight",
      body: `Responsible AI is not only a technical challenge — it requires organizational structures, policies, and processes to ensure accountability.

**AI governance** involves policies that define how AI systems are approved, deployed, and monitored. This includes risk classification (which use cases require higher scrutiny), review boards that evaluate high-risk AI applications before deployment, documentation requirements (model cards describing training data, intended use, known limitations, performance characteristics), and incident response processes for when AI systems cause harm.

**Model cards** are a standard documentation format for trained ML models, capturing: the model's intended use, training data characteristics, evaluation methodology, performance metrics across demographic groups, known limitations, ethical considerations, and recommended use constraints. SageMaker Model Registry supports attaching model card documents to model versions.

**Human-in-the-loop** design ensures consequential decisions have human review. **Amazon Augmented AI (A2I)** provides a managed service for routing ML predictions to human reviewers when confidence is below a threshold — applicable to any ML prediction task. For generative AI, human oversight means not allowing models to take irreversible actions autonomously, maintaining audit logs of all AI-driven decisions, and ensuring users understand they are interacting with AI.

**Accountability** requires knowing who is responsible when AI causes harm: the organization deploying the system, the team that built it, or the provider of the underlying model. AWS's **shared responsibility model** extends to AI: AWS is responsible for the foundation model and service infrastructure; customers are responsible for how they configure, deploy, and use AI systems including content filtering, access controls, and compliance.`,
      quiz: [
        {
          question:
            "Which AWS service provides human-in-the-loop review for ML predictions when model confidence falls below a defined threshold?",
          options: [
            "Amazon SageMaker Clarify",
            "Amazon SageMaker Model Monitor",
            "Amazon Augmented AI (A2I)",
            "Amazon SageMaker Ground Truth",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Augmented AI (A2I) routes low-confidence ML predictions to human reviewers through a configurable workforce. It is the managed human-in-the-loop service, applicable to any ML prediction task where automated confidence is insufficient.",
        },
        {
          question:
            "According to AWS's shared responsibility model applied to AI, which of the following is the CUSTOMER's responsibility?",
          options: [
            "Security and reliability of the underlying foundation model infrastructure",
            "Training data quality and bias characteristics built into the foundation model",
            "Configuration, deployment, content filtering, access controls, and compliance for AI systems they deploy",
            "Publishing safety evaluations and red-team findings for foundation models",
          ],
          correctIndex: 2,
          explanation:
            "In the AI shared responsibility model, AWS is responsible for the foundation model and service infrastructure. Customers are responsible for how they configure and deploy AI systems, including content filtering, access controls, compliance with applicable laws, and how they use model outputs.",
        },
      ],
    },
  ],

  keyFacts: [
    "AWS responsible AI dimensions (8): Fairness, Explainability, Robustness, Privacy & Security, Safety, Controllability, Transparency, Veracity & Robustness",
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
    "Know all eight AWS responsible AI dimensions — the exam tests principle identification (Fairness, Explainability, Robustness, Privacy & Security, Safety, Controllability, Transparency, Veracity & Robustness)",
    "SageMaker Clarify is the primary bias detection and explainability tool",
    "Distinguish pre-training bias (data imbalance) from post-training bias (model prediction disparity)",
    "SHAP = local feature attribution; feature importance = global model explanation",
    "Removing protected attributes does NOT prevent bias if proxy variables are present",
    "Model cards document what a model can and cannot do — part of governance",
    "A2I = human review for low-confidence predictions — human-in-the-loop pattern",
    "Feedback loops amplify bias over time — a critical risk in deployed systems",
  ],

  topicQuiz: [
    {
      question:
        "Which of the following best describes the responsible AI principle of Controllability?",
      options: [
        "AI outputs are accurate and the system behaves consistently across inputs",
        "Humans retain meaningful oversight and the ability to correct, adjust, or shut down AI systems",
        "AI systems treat people equitably regardless of protected characteristics",
        "Stakeholders can understand how a model produces its outputs",
      ],
      correctIndex: 1,
      explanation:
        "Controllability means humans retain meaningful oversight and the ability to correct, adjust, or shut down AI systems. This is distinct from Transparency (openness about how systems work) and Explainability (understanding model outputs).",
    },
    {
      question:
        "A medical imaging AI performs well overall but has significantly lower accuracy for patients from certain ethnic backgrounds due to underrepresentation in training data. Which type of bias is this?",
      options: [
        "Label bias — annotators assigned incorrect diagnoses for underrepresented groups",
        "Feedback loop bias — the model's errors cause reduced healthcare access for those groups",
        "Selection bias — the training data is not representative of the full population the model serves",
        "Measurement bias — imaging equipment measures differently across demographic groups",
      ],
      correctIndex: 2,
      explanation:
        "Selection bias occurs when training data is not representative of the population the model will serve. A medical imaging model trained predominantly on one demographic will underperform on underrepresented groups — a classic example of selection bias.",
    },
    {
      question:
        "What is the purpose of model cards in responsible AI governance?",
      options: [
        "They are credit-card-sized summaries printed for non-technical stakeholders at model launch events",
        "They document a model's intended use, training data characteristics, performance metrics, limitations, and ethical considerations",
        "They define the API contract for model endpoints including input/output schemas",
        "They store model weights and hyperparameters for reproducible training runs",
      ],
      correctIndex: 1,
      explanation:
        "Model cards are a standard documentation format that captures a model's intended use, training data characteristics, evaluation methodology, performance metrics across demographic groups, known limitations, and ethical considerations — a key governance artifact in responsible AI.",
    },
    {
      question:
        "SageMaker Clarify computes pre-training bias metrics before a model is trained. What do these metrics evaluate?",
      options: [
        "Whether the deployed model makes systematically different errors across demographic groups",
        "Statistical imbalances in the training data — how differently demographic groups are represented in data and labels",
        "Whether SHAP values are consistent across different model versions",
        "The model's performance on held-out test data stratified by demographic group",
      ],
      correctIndex: 1,
      explanation:
        "Pre-training bias metrics in SageMaker Clarify analyze the training dataset before any model is built, identifying statistical imbalances such as Class Imbalance and Difference in Positive Proportions in Labels — quantifying how differently groups are represented in the data and labels.",
    },
    {
      question:
        "A predictive policing model is deployed and makes more arrests in certain neighborhoods. This data is fed back into the model's next training cycle, causing it to focus even more on those neighborhoods. Which responsible AI risk does this illustrate?",
      options: [
        "Historical bias — the original training data reflected past discrimination",
        "Measurement bias — crime rates are measured differently across neighborhoods",
        "Feedback loop bias — biased predictions influence outcomes that become new training data, amplifying the original bias",
        "Label bias — human annotators labeled certain neighborhoods as higher risk",
      ],
      correctIndex: 2,
      explanation:
        "Feedback loops amplify existing bias: a biased model makes biased predictions → those predictions influence real-world outcomes → the resulting data feeds back into the next training cycle → reinforcing and amplifying the original bias. This is a critical responsible AI risk in deployed systems.",
    },
    {
      question:
        "Which bias mitigation strategy modifies the training algorithm itself to incorporate fairness constraints during learning?",
      options: [
        "Pre-processing — resampling or reweighting training data",
        "In-processing — modifying the training algorithm to optimize for fairness alongside accuracy",
        "Post-processing — adjusting model output thresholds to equalize outcomes",
        "Meta-processing — training a second model to correct for bias in the first model's outputs",
      ],
      correctIndex: 1,
      explanation:
        "In-processing bias mitigation modifies the training algorithm to incorporate fairness constraints during the learning process itself. The three categories are pre-processing (data modification), in-processing (algorithm modification), and post-processing (output adjustment).",
    },
    {
      question:
        "For the AIF-C01 exam, which tool is specifically used to compute SHAP values at scale for batch inference in the AWS ML platform?",
      options: [
        "Amazon SageMaker Model Monitor",
        "Amazon Augmented AI (A2I)",
        "Amazon SageMaker Clarify",
        "Amazon Bedrock Guardrails",
      ],
      correctIndex: 2,
      explanation:
        "Amazon SageMaker Clarify computes SHAP values at scale for batch inference, providing local feature attributions that explain individual model predictions. It is the primary explainability and bias detection tool in the SageMaker platform.",
    },
    {
      question:
        "Under the AWS shared responsibility model for AI, which party is responsible for ensuring content filtering and access controls are properly configured for a generative AI application?",
      options: [
        "AWS — as the provider of the foundation model and infrastructure",
        "The customer — who is responsible for deployment configuration, content filtering, access controls, and compliance",
        "The end user — who consents to AI-generated content through terms of service",
        "A shared responsibility split 50/50 between AWS and the customer",
      ],
      correctIndex: 1,
      explanation:
        "In the AI shared responsibility model, customers are responsible for how they configure, deploy, and use AI systems — including content filtering, access controls, compliance with applicable laws, and ensuring appropriate use. AWS is responsible for the foundation model infrastructure.",
    },
  ],
};
