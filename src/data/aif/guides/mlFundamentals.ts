import { ServiceGuide } from "../../../types/guide";

export const mlFundamentalsGuide: ServiceGuide = {
  id: "aif-ml-fundamentals",
  service: "ML Fundamentals",
  domain: "troubleshooting",
  tagline:
    "Core machine learning concepts every AI practitioner must understand",
  intro:
    "Machine learning is a branch of artificial intelligence where systems learn patterns from data rather than being explicitly programmed. Understanding the foundational concepts — learning paradigms, model evaluation, common pitfalls, and algorithm families — is essential for the AIF-C01 exam.",

  sections: [
    {
      heading: "The Three Paradigms of Machine Learning",
      body: `Machine learning is typically divided into three major learning paradigms based on the nature of the training data and the learning signal.

**Supervised learning** is the most common paradigm. The training dataset consists of input-output pairs (X, y): features (X) and labels (y). The algorithm learns a mapping function f(X) → y that generalizes to new inputs. Classification (predicting discrete categories) and regression (predicting continuous values) are both supervised learning tasks. Examples: spam detection, image classification, house price prediction, fraud detection. Key requirement: labeled data, which can be expensive to obtain.

**Unsupervised learning** uses datasets with no labels — only features (X). The algorithm discovers hidden structure, patterns, or groupings in the data without any predefined targets. Clustering (K-Means, DBSCAN) groups similar data points; dimensionality reduction (PCA, t-SNE, autoencoders) compresses data into lower-dimensional representations; anomaly detection identifies outliers; association rule learning finds co-occurring patterns (market basket analysis).

**Reinforcement learning** trains an **agent** to make sequential decisions in an **environment** to maximize a cumulative **reward** signal. The agent takes actions, observes state transitions and reward signals, and learns a **policy** (a mapping from states to actions) that maximizes long-term reward. Examples: game-playing AIs (AlphaGo, Atari), robotic control, recommendation system optimization, autonomous driving. AWS offers **SageMaker RL** and integration with simulation environments for RL workloads.`,
      quiz: [
        {
          question:
            "A data scientist trains a model to predict house prices using historical sales data with known prices. Which ML paradigm is this?",
          options: [
            "Unsupervised learning",
            "Reinforcement learning",
            "Supervised learning",
            "Self-supervised learning",
          ],
          correctIndex: 2,
          explanation:
            "This is supervised learning — the training data contains input-output pairs (house features and known prices). The algorithm learns a mapping function to predict prices for new houses.",
        },
        {
          question:
            "A model groups customer purchase histories into segments without any predefined categories. Which ML paradigm does this represent?",
          options: [
            "Supervised learning",
            "Reinforcement learning",
            "Transfer learning",
            "Unsupervised learning",
          ],
          correctIndex: 3,
          explanation:
            "Unsupervised learning discovers hidden structure in unlabeled data. Clustering (e.g., K-Means) groups similar data points without predefined target categories.",
        },
        {
          question:
            "In reinforcement learning, what term describes the mapping from observed states to actions that an agent learns to maximize cumulative reward?",
          options: ["Feature vector", "Policy", "Gradient", "Hyperparameter"],
          correctIndex: 1,
          explanation:
            "A policy is the mapping from states to actions that the RL agent learns. The goal of reinforcement learning is to find the optimal policy that maximizes cumulative reward over time.",
        },
      ],
    },
    {
      heading: "Model Evaluation: Metrics and Validation",
      body: `Knowing how to measure model performance correctly is as important as building the model. Different tasks require different metrics.

For **classification**, key metrics include **accuracy** (fraction of correct predictions — misleading on imbalanced datasets), **precision** (of all positive predictions, what fraction were correct — minimizes false positives), **recall** (of all actual positives, what fraction did the model catch — minimizes false negatives), **F1 score** (harmonic mean of precision and recall — balances both), and **AUC-ROC** (Area Under the Receiver Operating Characteristic curve — measures discrimination across all thresholds; 0.5 = random, 1.0 = perfect).

For **regression**, common metrics include **RMSE** (Root Mean Squared Error — penalizes large errors heavily), **MAE** (Mean Absolute Error — equally weights all errors), and **R²** (coefficient of determination — proportion of variance explained).

**Train/validation/test split** is the standard evaluation protocol: you split your labeled data into three sets. The **training set** is used to fit the model. The **validation set** is used to tune hyperparameters and select the best model configuration (the model never trains on validation data). The **test set** is used only once at the very end to estimate real-world performance — using it for hyperparameter tuning inflates apparent performance. **k-Fold cross-validation** rotates the validation fold across k partitions, producing a more robust performance estimate for small datasets.`,
      quiz: [
        {
          question:
            "A fraud detection model must catch as many actual fraud cases as possible, even at the cost of some false alarms. Which metric should be prioritized?",
          options: ["Accuracy", "Precision", "Recall", "RMSE"],
          correctIndex: 2,
          explanation:
            "Recall measures what fraction of actual positives the model catches. When missing true positives (false negatives) is more costly than false alarms, recall is the metric to optimize.",
        },
        {
          question:
            "An AUC-ROC score of 0.5 for a binary classifier indicates:",
          options: [
            "Perfect discrimination between classes",
            "Performance equivalent to random chance",
            "The model has severe overfitting",
            "High precision but low recall",
          ],
          correctIndex: 1,
          explanation:
            "An AUC-ROC of 0.5 means the model discriminates no better than random chance. A perfect classifier has AUC-ROC of 1.0; values above 0.5 indicate better-than-random discrimination.",
        },
        {
          question:
            "Why should the test set be used only once at the very end of model development?",
          options: [
            "Test sets are too small to use more than once",
            "Using it for hyperparameter tuning inflates apparent performance",
            "The test set contains unlabeled data that cannot be reused",
            "Repeated use causes data leakage into the training set",
          ],
          correctIndex: 1,
          explanation:
            "Using the test set to make model decisions inflates apparent performance — the model effectively trains on the test set indirectly. It should be used only once to get an unbiased estimate of real-world performance.",
        },
      ],
    },
    {
      heading: "Overfitting, Underfitting, and the Bias-Variance Tradeoff",
      body: `Understanding model failure modes is critical for diagnosing and fixing poor-performing models.

**Overfitting** occurs when a model learns the training data too well — including noise and idiosyncratic patterns — and fails to generalize to new data. Signs: very low training error but high validation/test error (a large train-test gap). Overfitting is caused by models that are too complex for the amount of training data. Remedies: reduce model complexity, add regularization (L1/Lasso, L2/Ridge, Dropout), gather more training data, use data augmentation, apply early stopping.

**Underfitting** occurs when a model is too simple to capture the underlying patterns in the data. Signs: high error on both training and test sets. Remedies: use a more complex model, add more features, train for more epochs, reduce regularization.

The **bias-variance tradeoff** formalizes this: model error decomposes into bias (error from wrong assumptions — underfitting causes high bias), variance (error from sensitivity to training data fluctuations — overfitting causes high variance), and irreducible noise. The goal is to find the sweet spot where total error is minimized. Regularization techniques directly address this tradeoff by penalizing model complexity to reduce variance at the cost of a slight increase in bias.`,
      quiz: [
        {
          question:
            "A model achieves 99% accuracy on training data but only 62% on validation data. What does this indicate?",
          options: [
            "Underfitting — the model is too simple",
            "Overfitting — the model memorized the training data",
            "Data leakage in the training pipeline",
            "The validation set is too small",
          ],
          correctIndex: 1,
          explanation:
            "A large gap between training accuracy (99%) and validation accuracy (62%) is the classic sign of overfitting. The model has memorized training data including noise, and fails to generalize.",
        },
        {
          question:
            "Which of the following is the correct remedy for a model that shows high error on BOTH the training set and the test set?",
          options: [
            "Add L2 regularization to reduce complexity",
            "Apply dropout layers to prevent memorization",
            "Use a more complex model or add more features",
            "Gather more training data",
          ],
          correctIndex: 2,
          explanation:
            "High error on both training and test sets indicates underfitting — the model is too simple to capture the patterns. Remedies include using a more complex model, adding more features, or training for more epochs.",
        },
        {
          question:
            "In the bias-variance tradeoff, what does overfitting cause?",
          options: [
            "High bias and low variance",
            "High bias and high variance",
            "Low bias and high variance",
            "Low bias and low variance",
          ],
          correctIndex: 2,
          explanation:
            "Overfitting causes low bias (the model fits training data very well) but high variance (predictions vary significantly with different training data). Regularization reduces variance at the cost of a slight bias increase.",
        },
      ],
    },
    {
      heading: "Feature Engineering and Data Quality",
      body: `"Garbage in, garbage out" is the most important principle in ML. The quality of input features and data often matters more than the choice of algorithm. Feature engineering is the process of transforming raw data into informative input representations that help the model learn.

Common feature engineering techniques include: **normalization/standardization** (scaling features to similar ranges so that no single feature dominates by magnitude); **one-hot encoding** (converting categorical variables to binary indicator columns); **feature interaction terms** (creating new features as products of existing ones to capture non-linear relationships); **log transformation** (compressing skewed distributions); **binning** (converting continuous variables to categorical bins); and **embedding** (representing categorical variables as dense learned vectors).

**Missing data** is a pervasive real-world problem. Strategies include: deletion (drop rows with missing values — only appropriate if data is missing completely at random and the proportion is small), mean/median/mode imputation (fill missing values with a central tendency statistic), model-based imputation (predict missing values using other features), and using algorithms that handle missingness natively (gradient boosting trees can handle NaN values directly).

**Data leakage** is a critical trap: when information that would not be available at prediction time accidentally appears in training features. For example, including a "fraud investigation opened" flag in features for a fraud detection model — in production that flag doesn't exist until after the prediction is needed. Leakage causes artificially inflated model performance during evaluation that collapses in production.`,
      quiz: [
        {
          question:
            "A fraud detection model is trained with a feature called 'fraud_case_opened'. Evaluation metrics look excellent, but the model fails in production. What is the most likely cause?",
          options: [
            "Overfitting to the training data",
            "Data leakage — the feature wouldn't exist at prediction time",
            "Underfitting due to too few features",
            "Class imbalance in the training set",
          ],
          correctIndex: 1,
          explanation:
            "Data leakage occurs when features contain information unavailable at prediction time. A 'fraud_case_opened' flag only exists after fraud is confirmed, not at the moment a transaction needs to be scored — this leaks future information into training.",
        },
        {
          question:
            "A dataset contains a 'city' column with 200 unique values. Which feature engineering technique would convert this into a format suitable for a linear model?",
          options: [
            "Log transformation",
            "Binning",
            "One-hot encoding",
            "Normalization",
          ],
          correctIndex: 2,
          explanation:
            "One-hot encoding converts categorical variables (like city names) into binary indicator columns. Each unique category becomes a column with 1 or 0, making it usable in linear models that require numeric inputs.",
        },
        {
          question:
            "Why does normalizing features matter for gradient-descent-based algorithms?",
          options: [
            "It prevents data leakage between features",
            "It ensures no single feature dominates by magnitude, helping gradient descent converge faster",
            "It converts categorical features to numeric form",
            "It handles missing values automatically",
          ],
          correctIndex: 1,
          explanation:
            "Normalization/standardization scales features to similar ranges. Without this, features with large magnitudes dominate gradient updates, causing slow convergence or poor model performance in distance-based and gradient-descent algorithms.",
        },
      ],
    },
    {
      heading: "Common Algorithm Families",
      body: `The AIF-C01 exam expects familiarity with major algorithm categories and when each is appropriate.

**Linear models** (Linear Regression, Logistic Regression) are fast, interpretable, and effective when the relationship between features and target is approximately linear. They are baseline models to try first. **Decision trees** partition the feature space using a sequence of threshold rules, producing interpretable if-then logic. They tend to overfit when deep; regularization through pruning addresses this.

**Ensemble methods** combine multiple models for better generalization. **Random Forest** trains many decision trees on bootstrapped data subsets and averages their predictions — high variance is reduced through averaging. **Gradient Boosting** (XGBoost, LightGBM, CatBoost) builds trees sequentially, each correcting the errors of the previous — typically the highest-performing algorithm on tabular data.

**Neural networks** learn hierarchical representations from raw data. **Convolutional Neural Networks (CNNs)** use shared local filters to learn spatial patterns — ideal for images. **Recurrent Neural Networks (RNNs)** and **Long Short-Term Memory (LSTM)** networks process sequences, maintaining state across time steps — suitable for time series and NLP. **Transformer** models use self-attention to process sequences in parallel and have become the dominant architecture for NLP and increasingly for vision and other domains.

**k-Nearest Neighbors (k-NN)** classifies new points by the majority vote of their k closest training points — simple, no training phase, but slow at inference and sensitive to irrelevant features.`,
      quiz: [
        {
          question:
            "Which algorithm family is generally the highest-performing on structured tabular data according to the guide?",
          options: [
            "k-Nearest Neighbors",
            "Linear models",
            "Gradient Boosting (XGBoost, LightGBM)",
            "Convolutional Neural Networks",
          ],
          correctIndex: 2,
          explanation:
            "Gradient Boosting methods (XGBoost, LightGBM, CatBoost) typically achieve the highest performance on tabular data. They build trees sequentially, each correcting the errors of the previous tree.",
        },
        {
          question:
            "Which neural network architecture is specifically designed for processing image data through shared local filters?",
          options: [
            "Recurrent Neural Network (RNN)",
            "Transformer",
            "Convolutional Neural Network (CNN)",
            "Long Short-Term Memory (LSTM)",
          ],
          correctIndex: 2,
          explanation:
            "CNNs use shared local filters (convolutions) to learn spatial patterns in data. They are ideal for image tasks because the same filter detects features like edges regardless of where they appear in the image.",
        },
        {
          question:
            "A Random Forest reduces overfitting compared to a single decision tree primarily by:",
          options: [
            "Using deeper trees with more splits",
            "Averaging predictions across many trees trained on bootstrapped data subsets",
            "Applying L2 regularization to each tree",
            "Training on the full dataset without resampling",
          ],
          correctIndex: 1,
          explanation:
            "Random Forest trains many decision trees on bootstrapped (randomly sampled) data subsets and averages their predictions. Averaging reduces variance (overfitting) even though individual trees may overfit their subset.",
        },
      ],
    },
  ],

  keyFacts: [
    "Supervised: labeled data (X, y); Unsupervised: unlabeled data (X only); Reinforcement: agent + reward",
    "Classification metrics: accuracy, precision, recall, F1, AUC-ROC",
    "Regression metrics: RMSE, MAE, R-squared",
    "Overfitting: low train error, high test error — model too complex",
    "Underfitting: high error on both train and test — model too simple",
    "Train/validation/test split: train to fit, validation to tune, test to evaluate once",
    "Regularization (L1, L2, Dropout) reduces overfitting by penalizing complexity",
    "Data leakage: future information in training features → inflated metrics, production failure",
    "Gradient Boosting (XGBoost) typically outperforms other algorithms on tabular data",
    "Transformer architecture underlies modern LLMs and foundation models",
  ],

  relatedServices: [
    "Amazon SageMaker",
    "Amazon Bedrock",
    "Amazon Rekognition",
    "Amazon Comprehend",
    "AWS AI/ML Services",
  ],

  examTips: [
    "Know supervised vs unsupervised vs reinforcement — the exam tests scenario-based identification",
    "Overfitting = large train-test gap; Underfitting = high error on both sets",
    "Precision minimizes false positives; recall minimizes false negatives — know when each matters",
    "AUC-ROC of 0.5 = random; 1.0 = perfect — higher is better",
    "Data leakage is a common trap question — watch for test-time unavailable features in training",
    "Feature engineering often matters more than algorithm choice",
    "k-Fold cross-validation is more robust than single train/test split on small datasets",
    "Regularization reduces variance (overfitting) at cost of slight bias increase",
  ],

  topicQuiz: [
    {
      question:
        "An autonomous robot learns to navigate a warehouse by receiving positive rewards for successful deliveries and negative rewards for collisions. Which ML paradigm is this?",
      options: [
        "Supervised learning with labeled trajectories",
        "Unsupervised clustering of navigation paths",
        "Reinforcement learning with a reward signal",
        "Semi-supervised learning with partial labels",
      ],
      correctIndex: 2,
      explanation:
        "Reinforcement learning trains an agent to maximize cumulative reward through trial-and-error interaction with an environment. The robot (agent) learns a policy from rewards and penalties without labeled examples.",
    },
    {
      question:
        "A medical imaging model shows 98% accuracy but doctors report it misses many cancer cases. What metric should be examined?",
      options: ["RMSE", "R-squared", "Recall", "Precision"],
      correctIndex: 2,
      explanation:
        "Missing cancer cases are false negatives — recall measures what fraction of actual positives the model catches. High accuracy on imbalanced datasets can hide poor recall if negative cases dominate.",
    },
    {
      question:
        "Which technique addresses a model that overfits by being too complex?",
      options: [
        "Add more features to the model",
        "Increase model depth",
        "Apply L2 regularization",
        "Remove the validation set",
      ],
      correctIndex: 2,
      explanation:
        "L2 (Ridge) regularization penalizes large model weights, reducing model complexity and variance. Other overfitting remedies include gathering more data, applying dropout, or using early stopping.",
    },
    {
      question:
        "A product recommendation model is trained on data that includes a 'purchased_recommended_item' flag. Offline metrics are great, but live recommendations are poor. What is the likely cause?",
      options: [
        "The model underfits because training data is too small",
        "Data leakage — the purchase flag doesn't exist at recommendation time",
        "Class imbalance in recommendation categories",
        "Overfitting to the test set",
      ],
      correctIndex: 1,
      explanation:
        "Data leakage occurs when the training data contains information unavailable at prediction time. The 'purchased_recommended_item' flag only exists after a recommendation is accepted, not when making recommendations.",
    },
    {
      question:
        "k-Fold cross-validation is preferred over a single train/test split primarily when:",
      options: [
        "The dataset is very large and training is computationally expensive",
        "The dataset is small and a single split would produce an unreliable estimate",
        "The model is a deep neural network requiring GPU training",
        "The task is reinforcement learning with an environment simulator",
      ],
      correctIndex: 1,
      explanation:
        "k-Fold cross-validation rotates the validation fold across k partitions, producing a more robust performance estimate. It is especially valuable for small datasets where any single split may produce an unrepresentative sample.",
    },
    {
      question:
        "The Transformer architecture is described as dominant for which type of task?",
      options: [
        "Image classification using spatial filters",
        "Tabular data regression",
        "Natural language processing and sequence modeling",
        "Anomaly detection in time series",
      ],
      correctIndex: 2,
      explanation:
        "Transformers use self-attention to process sequences in parallel and have become the dominant architecture for NLP. They underlie modern large language models and foundation models, and are increasingly applied to vision tasks.",
    },
    {
      question:
        "Which regression metric penalizes large prediction errors more heavily than small ones?",
      options: [
        "MAE (Mean Absolute Error)",
        "R-squared",
        "RMSE (Root Mean Squared Error)",
        "Accuracy",
      ],
      correctIndex: 2,
      explanation:
        "RMSE squares the errors before averaging, which penalizes large errors disproportionately. MAE equally weights all errors regardless of magnitude. RMSE is preferred when large errors are particularly undesirable.",
    },
    {
      question:
        "A company trains a customer churn model. The dataset has 95% non-churners and 5% churners. Which metric would be MOST misleading as the sole evaluation criterion?",
      options: ["F1 score", "AUC-ROC", "Accuracy", "Recall"],
      correctIndex: 2,
      explanation:
        "On highly imbalanced datasets, accuracy is misleading — a model that always predicts 'non-churner' would achieve 95% accuracy without detecting any actual churners. F1, AUC-ROC, and recall are better metrics for imbalanced problems.",
    },
  ],
};
