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
    },
    {
      heading: "Model Evaluation: Metrics and Validation",
      body: `Knowing how to measure model performance correctly is as important as building the model. Different tasks require different metrics.

For **classification**, key metrics include **accuracy** (fraction of correct predictions — misleading on imbalanced datasets), **precision** (of all positive predictions, what fraction were correct — minimizes false positives), **recall** (of all actual positives, what fraction did the model catch — minimizes false negatives), **F1 score** (harmonic mean of precision and recall — balances both), and **AUC-ROC** (Area Under the Receiver Operating Characteristic curve — measures discrimination across all thresholds; 0.5 = random, 1.0 = perfect).

For **regression**, common metrics include **RMSE** (Root Mean Squared Error — penalizes large errors heavily), **MAE** (Mean Absolute Error — equally weights all errors), and **R²** (coefficient of determination — proportion of variance explained).

**Train/validation/test split** is the standard evaluation protocol: you split your labeled data into three sets. The **training set** is used to fit the model. The **validation set** is used to tune hyperparameters and select the best model configuration (the model never trains on validation data). The **test set** is used only once at the very end to estimate real-world performance — using it for hyperparameter tuning inflates apparent performance. **k-Fold cross-validation** rotates the validation fold across k partitions, producing a more robust performance estimate for small datasets.`,
    },
    {
      heading: "Overfitting, Underfitting, and the Bias-Variance Tradeoff",
      body: `Understanding model failure modes is critical for diagnosing and fixing poor-performing models.

**Overfitting** occurs when a model learns the training data too well — including noise and idiosyncratic patterns — and fails to generalize to new data. Signs: very low training error but high validation/test error (a large train-test gap). Overfitting is caused by models that are too complex for the amount of training data. Remedies: reduce model complexity, add regularization (L1/Lasso, L2/Ridge, Dropout), gather more training data, use data augmentation, apply early stopping.

**Underfitting** occurs when a model is too simple to capture the underlying patterns in the data. Signs: high error on both training and test sets. Remedies: use a more complex model, add more features, train for more epochs, reduce regularization.

The **bias-variance tradeoff** formalizes this: model error decomposes into bias (error from wrong assumptions — underfitting causes high bias), variance (error from sensitivity to training data fluctuations — overfitting causes high variance), and irreducible noise. The goal is to find the sweet spot where total error is minimized. Regularization techniques directly address this tradeoff by penalizing model complexity to reduce variance at the cost of a slight increase in bias.`,
    },
    {
      heading: "Feature Engineering and Data Quality",
      body: `"Garbage in, garbage out" is the most important principle in ML. The quality of input features and data often matters more than the choice of algorithm. Feature engineering is the process of transforming raw data into informative input representations that help the model learn.

Common feature engineering techniques include: **normalization/standardization** (scaling features to similar ranges so that no single feature dominates by magnitude); **one-hot encoding** (converting categorical variables to binary indicator columns); **feature interaction terms** (creating new features as products of existing ones to capture non-linear relationships); **log transformation** (compressing skewed distributions); **binning** (converting continuous variables to categorical bins); and **embedding** (representing categorical variables as dense learned vectors).

**Missing data** is a pervasive real-world problem. Strategies include: deletion (drop rows with missing values — only appropriate if data is missing completely at random and the proportion is small), mean/median/mode imputation (fill missing values with a central tendency statistic), model-based imputation (predict missing values using other features), and using algorithms that handle missingness natively (gradient boosting trees can handle NaN values directly).

**Data leakage** is a critical trap: when information that would not be available at prediction time accidentally appears in training features. For example, including a "fraud investigation opened" flag in features for a fraud detection model — in production that flag doesn't exist until after the prediction is needed. Leakage causes artificially inflated model performance during evaluation that collapses in production.`,
    },
    {
      heading: "Common Algorithm Families",
      body: `The AIF-C01 exam expects familiarity with major algorithm categories and when each is appropriate.

**Linear models** (Linear Regression, Logistic Regression) are fast, interpretable, and effective when the relationship between features and target is approximately linear. They are baseline models to try first. **Decision trees** partition the feature space using a sequence of threshold rules, producing interpretable if-then logic. They tend to overfit when deep; regularization through pruning addresses this.

**Ensemble methods** combine multiple models for better generalization. **Random Forest** trains many decision trees on bootstrapped data subsets and averages their predictions — high variance is reduced through averaging. **Gradient Boosting** (XGBoost, LightGBM, CatBoost) builds trees sequentially, each correcting the errors of the previous — typically the highest-performing algorithm on tabular data.

**Neural networks** learn hierarchical representations from raw data. **Convolutional Neural Networks (CNNs)** use shared local filters to learn spatial patterns — ideal for images. **Recurrent Neural Networks (RNNs)** and **Long Short-Term Memory (LSTM)** networks process sequences, maintaining state across time steps — suitable for time series and NLP. **Transformer** models use self-attention to process sequences in parallel and have become the dominant architecture for NLP and increasingly for vision and other domains.

**k-Nearest Neighbors (k-NN)** classifies new points by the majority vote of their k closest training points — simple, no training phase, but slow at inference and sensitive to irrelevant features.`,
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
};
