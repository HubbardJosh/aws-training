import { ServiceGuide } from "../../../types/guide";

export const dataPreparationGuide: ServiceGuide = {
  id: "mls-data-preparation",
  service: "ML Data Preparation",
  domain: "fundamentals",
  tagline:
    "Core concepts and techniques for transforming raw data into ML-ready training datasets",
  intro:
    "Data preparation is the foundational phase of every ML project, typically consuming 70-80% of total project time. It encompasses data collection, cleaning, transformation, feature engineering, and splitting into training, validation, and test sets — and determines the upper bound of model quality.",

  sections: [
    {
      heading: "Data Collection and Labeling",
      body: `ML models learn from labeled examples — the quality and representativeness of collected data determines the ceiling of model performance. Data collection strategy must consider coverage (does the training data cover the full input distribution the model will encounter in production?), balance (are class labels proportional or will class imbalance bias the model?), and freshness (does historical data reflect current real-world patterns?). Concept drift — when the statistical properties of the target variable change over time — makes stale training data particularly dangerous.

Labeling is often the most expensive and time-consuming step. Amazon SageMaker Ground Truth provides a managed data labeling service supporting image classification, object detection, text classification, NER, and more. Ground Truth uses active learning to automatically label high-confidence examples with a model, routing only ambiguous examples to human labelers — reducing labeling cost by up to 70%. Amazon Mechanical Turk and private labeling teams integrate with Ground Truth for human annotation.`,
      quiz: [
        {
          question:
            "What is concept drift in ML, and why does it make data freshness critical?",
          options: [
            "When the model's hyperparameters drift from their optimal values over time",
            "When the statistical relationship between input features and the target variable changes over time, making models trained on stale data inaccurate in production",
            "When different annotators label data inconsistently, causing label drift in the training set",
            "When the model's architecture becomes outdated as new algorithms are developed",
          ],
          correctIndex: 1,
          explanation:
            "Concept drift occurs when the underlying statistical relationship between inputs and outputs changes in the real world — for example, customer purchase patterns shifting after an economic event. Models trained on pre-drift data become less accurate over time, making data freshness and periodic retraining critical for maintaining production ML quality.",
        },
      ],
    },
    {
      heading: "Handling Missing Values and Outliers",
      body: `Missing values are ubiquitous in real-world ML datasets and must be handled before training because most ML algorithms cannot process NaN or null values. Strategies depend on the mechanism and proportion of missingness. Deletion (dropping rows or columns with missing values) is appropriate when missingness is completely random and the proportion is small (less than 5%). Mean/median imputation replaces missing values with the column's central tendency — appropriate for low-cardinality numeric features but can distort distributions. More sophisticated methods include KNN imputation (replace with the average of K nearest neighbors in feature space) and MICE (Multiple Imputation by Chained Equations) for multivariate imputation.

Outliers are values that deviate significantly from the expected distribution. They may represent genuine extreme cases (valid but rare) or data quality errors (sensor malfunction, data entry error). Statistical outlier detection methods include Z-score (flag values more than 3 standard deviations from mean), IQR method (flag values beyond 1.5 × IQR from Q1/Q3), and isolation forest (an ML-based approach for multivariate outlier detection). Capping (Winsorization) is a common treatment — replace extreme values at a percentile boundary rather than deleting potentially valid records.`,
      quiz: [
        {
          question:
            "A training dataset has a numerical feature with 30% missing values. Why is simple deletion inappropriate here, and what is a better approach?",
          options: [
            "Deletion is always appropriate regardless of missing rate — remove all rows with missing values",
            "30% deletion would lose too much training data and could introduce bias if missingness is not random — use imputation (mean/median/KNN/MICE) to preserve sample size",
            "Replace all missing values with zero — this is always a safe default",
            "Increase the dataset size by 30% to compensate for the deleted rows",
          ],
          correctIndex: 1,
          explanation:
            "Deleting 30% of rows is excessive — it significantly reduces training data and can introduce systematic bias if the data is not missing completely at random. Imputation (mean/median for low-cardinality features, KNN or MICE for correlated features) preserves sample size while providing reasonable estimates for missing values.",
        },
      ],
    },
    {
      heading: "Feature Engineering and Transformation",
      body: `Feature engineering transforms raw data into representations that ML algorithms can effectively learn from. Numeric features typically require scaling: standardization (subtract mean, divide by std — creates zero-mean, unit-variance features) or min-max normalization (scales to [0,1]). Standardization is preferred for distance-based algorithms (KNN, SVM, neural networks) that are sensitive to feature magnitude; tree-based models (XGBoost, random forest) are scale-invariant.

Categorical features must be encoded numerically. One-hot encoding creates binary indicator columns for each category — appropriate for nominal categories with low cardinality. Ordinal encoding assigns integer ranks — appropriate for ordered categories (low=1, medium=2, high=3). Target encoding (also called mean encoding) replaces each category with the mean target value for that category — powerful for high-cardinality categoricals in tree models but prone to target leakage if not done carefully within cross-validation folds. Feature crosses combine two features into a single interaction term, capturing non-linear relationships that the model's base features cannot represent alone.`,
      quiz: [
        {
          question:
            "A dataset has a 'city' feature with 5,000 unique values. Which encoding strategy is most appropriate for a gradient boosting model?",
          options: [
            "One-hot encoding — create 5,000 binary columns, one per city",
            "Ordinal encoding — assign integers 1-5000 to each city alphabetically",
            "Target encoding — replace each city with the mean target value for that city (with cross-validation to prevent leakage)",
            "Drop the feature — high cardinality categoricals are always harmful",
          ],
          correctIndex: 2,
          explanation:
            "One-hot encoding a 5,000-cardinality feature creates 5,000 sparse binary columns, which is memory-inefficient and often degrades tree model performance. Target encoding compresses city information into a single numeric feature (the mean target value per city) that tree models can effectively use. Cross-validation within encoding is required to prevent target leakage.",
        },
      ],
    },
    {
      heading: "Train/Validation/Test Splits and Cross-Validation",
      body: `Proper dataset splitting is essential for reliable model evaluation. The training set is used to fit model parameters. The validation set (holdout set) is used to tune hyperparameters and select among models — it guides decisions during model development. The test set is held out entirely until the final evaluation and provides an unbiased estimate of generalization performance. A typical split ratio is 70/15/15 or 80/10/10 depending on dataset size; for small datasets, k-fold cross-validation replaces a fixed validation split.

K-fold cross-validation partitions the training data into K folds (typically 5 or 10), trains K models each using a different fold as validation, and averages performance. This produces a more reliable validation estimate than a single split, particularly on small datasets. Stratified k-fold preserves class proportions in each fold — critical for imbalanced datasets where a random split might put all rare-class examples in one fold. For time-series data, temporal cross-validation (walk-forward validation) must be used — future data cannot be used to train models that predict past events.`,
      quiz: [
        {
          question:
            "A model is evaluated on the test set and shows unexpectedly high performance. The team realizes they tuned hyperparameters using the test set. What problem occurred?",
          options: [
            "Data leakage — the test set was used during model development, contaminating the unbiased estimate of generalization performance",
            "Overfitting — the model memorized the training data and happens to perform well on test",
            "Underfitting — the model is too simple but performs well on this particular test set",
            "Concept drift — the test set comes from a different time period than training",
          ],
          correctIndex: 0,
          explanation:
            "Using the test set for hyperparameter tuning contaminates it — the test set's information has influenced model development decisions. The test set no longer provides an unbiased estimate of generalization. The validation set is for tuning decisions; the test set must be touched only once at the very end of model development.",
        },
      ],
    },
    {
      heading: "Handling Class Imbalance",
      body: `Class imbalance occurs when one class significantly outnumbers others in the training set — a 99:1 ratio of negative to positive examples causes a model to achieve 99% accuracy by always predicting negative. Standard accuracy is a misleading metric for imbalanced datasets; precision, recall, F1-score, AUC-ROC, and AUC-PR are more appropriate. The key MLS-C01 metrics to know: precision = TP/(TP+FP), recall = TP/(TP+FN), F1 = harmonic mean of precision and recall, AUC-ROC = discrimination ability across all thresholds.

Techniques for handling imbalance include: oversampling the minority class (SMOTE — Synthetic Minority Over-sampling Technique generates synthetic examples in feature space rather than duplicating existing ones), undersampling the majority class (random deletion of majority examples), and class weighting (assign higher loss weight to the minority class, effectively penalizing misclassification of rare examples more — supported natively by most ML frameworks via a \`class_weight\` parameter). For the MLS-C01 exam, SMOTE is a frequently tested oversampling technique and class weighting is a simple baseline.`,
      quiz: [
        {
          question:
            "A fraud detection model is trained on data where only 0.1% of transactions are fraudulent. The model achieves 99.9% accuracy but never predicts fraud. What is the core problem and best metric to use?",
          options: [
            "Overfitting — use train/validation loss curves to diagnose the issue",
            "Class imbalance — accuracy is misleading; use AUC-ROC or precision-recall AUC which better capture rare class performance",
            "Concept drift — fraud patterns have changed making old data irrelevant",
            "Data leakage — fraudulent transactions are present in both training and test sets",
          ],
          correctIndex: 1,
          explanation:
            "A model predicting majority class always achieves 99.9% accuracy on 0.1% fraud data. This is the class imbalance problem. AUC-ROC measures how well the model ranks fraudulent above non-fraudulent at all decision thresholds, while precision-recall AUC focuses specifically on performance among the minority class — both are far more informative than accuracy for severe imbalance.",
        },
      ],
    },
    {
      heading: "SageMaker Data Wrangler and Feature Store",
      body: `SageMaker Data Wrangler provides a visual interface within SageMaker Studio for importing, transforming, and analyzing datasets without writing code. It connects to S3, Athena, Redshift, Lake Formation, and SageMaker Feature Store as data sources. Data Wrangler's built-in transform library includes 300+ transforms: handle missing values, encode categoricals, scale numerics, parse dates, compute string operations, and balance imbalanced classes. The Data Quality and Insights Report automatically profiles datasets and flags potential issues (missing values, outliers, class imbalance, duplicate rows).

Data Wrangler can export directly to SageMaker Feature Store, S3 Parquet, SageMaker Training Jobs, or generate reusable Python code for Glue jobs or Processing jobs. SageMaker Feature Store provides a purpose-built storage solution for ML features with two complementary stores: the Online Store (backed by DynamoDB, providing millisecond-latency feature retrieval for real-time inference) and the Offline Store (backed by S3 Parquet, for batch training). Features are written once to a Feature Group (a logical table with a defined schema) and read by any training job or inference endpoint — enabling feature reuse and consistency across experiments. Feature groups have a record identifier (e.g., customer_id) and an event time for temporal feature versioning.`,
      quiz: [
        {
          question:
            "An ML team wants to ensure that the same feature computation logic is used for both offline training and online inference without code duplication. Which SageMaker feature enables this?",
          options: [
            "SageMaker Data Wrangler — it auto-generates inference code matching training transforms",
            "SageMaker Feature Store — features are written once to a Feature Group and read from both the online store (inference) and offline store (training)",
            "SageMaker Processing Jobs — define transformations once and deploy them to endpoints",
            "SageMaker Pipelines — share processing steps between training and inference pipelines",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker Feature Store enforces feature consistency between training and inference by providing a single source of truth: the offline store (S3) for training and the online store (DynamoDB, millisecond latency) for inference. Features written to a Feature Group are available from both stores, preventing training/serving skew from different feature computation code paths.",
        },
      ],
    },
    {
      heading: "Text and NLP Data Preparation",
      body: `Text data requires preprocessing before NLP model training. Tokenization converts raw text into tokens (the model's input units). Word tokenization splits on whitespace and punctuation — simple but fails on unknown words. Subword tokenization (Byte-Pair Encoding used by GPT, WordPiece used by BERT) builds a vocabulary of common subword units — unknown words are decomposed into known subwords, enabling the model to handle any word. Character tokenization uses individual characters — handles arbitrary text but produces very long sequences.

Stop word removal eliminates high-frequency, low-information words (the, is, a) before training traditional ML models (TF-IDF, Naive Bayes) — reducing noise and vocabulary size. Stemming reduces words to their stem (running → run) using rule-based algorithms — fast but crude (universes → univers). Lemmatization uses vocabulary and morphological analysis (running → run, better → good) — more accurate but slower. TF-IDF (Term Frequency × Inverse Document Frequency) produces sparse vector representations for traditional ML models. Word2Vec and GloVe produce dense embedding representations. For BERT/GPT fine-tuning, always use the exact tokenizer from the pre-trained model (HuggingFace \`AutoTokenizer.from_pretrained()\`) — the tokenizer must match pre-training vocabulary exactly or embeddings will be misaligned.`,
      quiz: [
        {
          question:
            "Why must the same tokenizer used during BERT pre-training be used when fine-tuning BERT on a downstream task?",
          options: [
            "Using a different tokenizer would increase the vocabulary size, requiring more GPU memory",
            "The tokenizer must match pre-training exactly — the embedding matrix maps specific token IDs to vectors learned during pre-training; different tokenization produces different token IDs that do not correspond to the learned embeddings",
            "Different tokenizers produce different sequence lengths, which are incompatible with BERT's fixed-length input",
            "The tokenizer is embedded in the BERT weights and cannot be changed after pre-training",
          ],
          correctIndex: 1,
          explanation:
            "BERT's embedding layer maps integer token IDs to learned vector representations. The tokenizer defines which word/subword gets which integer ID. If you use a different tokenizer, the same text produces different token IDs, which map to completely wrong embedding vectors. The HuggingFace AutoTokenizer.from_pretrained() ensures tokenization exactly matches what was used during pre-training.",
        },
      ],
    },
    {
      heading: "Image and Audio Data Preparation",
      body: `Image preprocessing for computer vision ML follows a standard pipeline. Resizing: resize images to the model's expected input resolution (e.g., 224×224 for ResNet). Normalization: divide by 255 to scale pixel values to [0,1], then standardize per channel using ImageNet statistics (mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]). This normalization is required for transfer learning from ImageNet pre-trained models — the model's learned weights assume this specific input distribution. Augmentation during training (not validation or test): random horizontal flip, random crop, color jitter (brightness, contrast, saturation), rotation, cutout (random patch erasure), and mixup (linear interpolation between pairs of training examples). These augmentations increase effective dataset size and reduce overfitting without additional labeled data.

Audio data preparation for speech and audio ML. Raw waveform → spectrogram (Short-Time Fourier Transform converts time-domain signal to frequency-domain representation) → mel spectrogram (frequency axis warped to mel scale, matching human auditory perception) → log mel spectrogram (log of energy, matching human loudness perception). This preprocessing chain is the standard input for ASR, speaker recognition, and audio classification models. Sample rate standardization (resample to 16kHz for speech), silence trimming, and noise augmentation (add background noise, reverb) improve model robustness. SageMaker Ground Truth handles image annotation (bounding boxes, segmentation masks, image-level labels) with managed human labeling workflows.`,
      quiz: [
        {
          question:
            "Why is ImageNet normalization (mean/std per channel) required when fine-tuning a pre-trained ResNet model on a new image classification task?",
          options: [
            "ImageNet normalization speeds up training by reducing gradient magnitudes",
            "The pre-trained ResNet's weights were learned with ImageNet-normalized inputs — providing differently normalized inputs shifts the activation distributions, requiring the model to relearn all features from scratch",
            "PyTorch requires all image inputs to be normalized to [0,1] per channel",
            "ImageNet normalization prevents overfitting by introducing controlled noise to each channel",
          ],
          correctIndex: 1,
          explanation:
            "Pre-trained models learned their internal representations from ImageNet-normalized inputs. When you normalize your new domain's images with the same ImageNet statistics (mean and std per channel), the input distribution matches what the model's weights expect — allowing the pre-trained features to transfer effectively. Using different normalization shifts activations, degrading the pre-trained features.",
        },
      ],
    },
  ],

  keyFacts: [
    "Data preparation = 70-80% of ML project time — critical foundation for model quality",
    "SageMaker Ground Truth: managed labeling with active learning (auto-labels high-confidence, routes ambiguous to humans)",
    "Missing value strategies: deletion (low rate), imputation (mean/median/KNN/MICE), or indicator flag",
    "Outliers: Z-score, IQR method, isolation forest — treatment: Winsorization (cap at percentile)",
    "Scaling: standardization for distance-based algorithms; tree models are scale-invariant",
    "One-hot encoding for low-cardinality nominals; target encoding for high-cardinality categoricals",
    "Train/Validation/Test split: train=fit, validation=tune, test=final evaluation (touch once)",
    "K-fold cross-validation: stratified k-fold for imbalanced data; temporal for time series",
    "Class imbalance techniques: SMOTE (synthetic oversampling), undersampling, class weighting",
    "Imbalanced dataset metrics: precision, recall, F1, AUC-ROC, AUC-PR — not accuracy",
    "SageMaker Feature Store: online store (DynamoDB, low-latency) for inference + offline store (S3) for training",
    "Data Wrangler: visual 300+ transforms, auto profiling, exports to Feature Store or Training Jobs",
    "Image transfer learning requires ImageNet normalization (mean/std per channel) — must match pre-training",
  ],

  relatedServices: [
    "Amazon SageMaker",
    "AWS Glue",
    "Amazon Athena",
    "Amazon SageMaker Data Wrangler",
    "Amazon SageMaker Clarify",
    "Amazon SageMaker Feature Store",
  ],

  examTips: [
    "Ground Truth active learning reduces labeling cost by 70% — auto-labels easy cases, humans handle hard ones",
    "Test set must be touched ONCE at the end — using it for tuning = data leakage",
    "Stratified k-fold preserves class proportions — required for imbalanced classification",
    "Temporal cross-validation for time series — future folds cannot inform past model training",
    "SMOTE generates synthetic minority examples in feature space — not simple duplication",
    "Class weighting is the simplest imbalance technique — built into most ML frameworks",
    "Target encoding + high cardinality categoricals = powerful but requires care to prevent leakage",
    "Concept drift = relationship between features and target changes — triggers retraining",
    "Feature Store online = inference; Feature Store offline = training — understand the two-store architecture",
    "Data Wrangler = no-code SageMaker Studio data prep; Glue = code-based Spark for engineering teams",
  ],

  topicQuiz: [
    {
      question:
        "Which technique generates synthetic minority class examples in feature space to address class imbalance, rather than simply duplicating existing examples?",
      options: [
        "Class weighting — increases the loss penalty for minority class misclassification",
        "Random oversampling — duplicates minority class examples to balance the dataset",
        "SMOTE (Synthetic Minority Over-sampling Technique) — generates new synthetic examples between existing minority class neighbors",
        "Undersampling — removes majority class examples to balance class distribution",
      ],
      correctIndex: 2,
      explanation:
        "SMOTE generates synthetic minority class examples by interpolating between existing minority examples in feature space. This adds diversity to the minority class rather than simply duplicating examples (which can cause overfitting to specific minority samples). SMOTE is the most commonly tested oversampling technique for MLS-C01.",
    },
    {
      question:
        "A team is building a time-series demand forecasting model and wants to use cross-validation. Which cross-validation strategy is correct for time-series data?",
      options: [
        "Standard k-fold cross-validation with random fold assignment",
        "Stratified k-fold to maintain the same temporal distribution in each fold",
        "Temporal (walk-forward) cross-validation — each fold uses only past data for training and a future window for validation",
        "Leave-one-out cross-validation for maximum data utilization",
      ],
      correctIndex: 2,
      explanation:
        "Time-series data has temporal ordering — future data cannot be used to train models that predict past events. Temporal (walk-forward) cross-validation creates folds where each validation period is strictly in the future relative to its training data. Standard k-fold randomly assigns records, allowing future data to inform past predictions, which produces invalid (optimistic) estimates.",
    },
  ],
};
