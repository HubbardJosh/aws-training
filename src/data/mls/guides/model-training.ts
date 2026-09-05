import { ServiceGuide } from "../../../types/guide";

export const modelTrainingGuide: ServiceGuide = {
  id: "mls-model-training",
  service: "ML Model Training",
  domain: "fundamentals",
  tagline:
    "Core ML algorithms, training paradigms, and optimization techniques for MLS-C01",
  intro:
    "ML model training covers the algorithms, optimization methods, and training strategies that transform prepared datasets into predictive models. MLS-C01 tests knowledge of algorithm selection, bias-variance tradeoff, regularization, gradient descent variants, and neural network fundamentals.",

  sections: [
    {
      heading: "Supervised Learning Algorithms",
      body: `Supervised learning trains models on labeled (input, output) pairs. Linear regression models the relationship between continuous inputs and a continuous output using a linear function — optimal for interpreting feature effects and for datasets where the linear assumption holds. Logistic regression maps inputs to binary class probabilities using a sigmoid function — commonly used as a baseline classifier and where interpretability matters. Decision trees learn hierarchical if-then rules partitioning feature space — highly interpretable but prone to overfitting without pruning.

Ensemble methods combine multiple weak learners. Random Forest builds many trees on random feature subsets and bootstrapped data samples (bagging) — averages predictions for regression, majority vote for classification. Gradient Boosted Trees (XGBoost, LightGBM) build trees sequentially, each correcting the errors of the previous — currently the dominant algorithm for structured/tabular ML competitions. Neural networks learn hierarchical feature representations through layers of weighted connections — mandatory for unstructured data (images, text, audio) and competitive with tree ensembles on large tabular datasets when properly regularized.`,
      quiz: [
        {
          question:
            "For a tabular classification problem with mixed numeric and categorical features, which algorithm class consistently achieves state-of-the-art performance in practice?",
          options: [
            "Linear models — they are fast and interpretable, making them the best practical choice",
            "Gradient boosted trees (XGBoost, LightGBM) — they dominate tabular ML benchmarks and handle mixed feature types natively",
            "Neural networks — deep learning is the best approach for all ML problems",
            "K-nearest neighbors — it makes no distributional assumptions about the data",
          ],
          correctIndex: 1,
          explanation:
            "Gradient boosted trees (XGBoost, LightGBM, CatBoost) consistently achieve top performance on tabular/structured data with mixed feature types. They handle missing values, scale to large datasets efficiently, and are robust to feature scaling. Neural networks require more data and tuning to match gradient boosted trees on tabular benchmarks.",
        },
      ],
    },
    {
      heading: "Unsupervised Learning: Clustering and Dimensionality Reduction",
      body: `Unsupervised learning discovers structure in unlabeled data. K-Means clustering partitions N data points into K clusters by minimizing within-cluster variance, iterating between assigning points to the nearest centroid and recomputing centroids. K must be specified in advance — the elbow method (plot inertia vs. K) or silhouette score help select K. K-Means is efficient and scalable but assumes spherical clusters and is sensitive to initialization and outliers.

Hierarchical clustering builds a tree of clusters (dendrogram) without specifying K in advance — DBSCAN discovers arbitrarily shaped clusters and identifies outliers (noise points). Principal Component Analysis (PCA) is the primary dimensionality reduction technique: it finds orthogonal directions (principal components) of maximum variance in the data and projects data onto the top K components. PCA is used to reduce high-dimensional features for visualization, remove multicollinearity before linear models, and compress data for faster training. t-SNE and UMAP are nonlinear dimensionality reduction methods used for 2D visualization of high-dimensional embeddings.`,
      quiz: [
        {
          question:
            "A data scientist has a 500-feature dataset and wants to reduce dimensionality for visualization and to remove multicollinearity before logistic regression. Which technique is appropriate?",
          options: [
            "K-Means clustering — it reduces the feature space by grouping similar features",
            "PCA (Principal Component Analysis) — projects data onto top K principal components of maximum variance",
            "DBSCAN — identifies dense regions and removes outlier features",
            "Random Forest feature importance — select only the top N features",
          ],
          correctIndex: 1,
          explanation:
            "PCA is the standard dimensionality reduction technique for removing multicollinearity and reducing feature space before linear models. It projects data onto orthogonal principal components ranked by explained variance. Random Forest feature selection is also valid but doesn't address multicollinearity — correlated features can both have high importance.",
        },
      ],
    },
    {
      heading: "Bias-Variance Tradeoff and Regularization",
      body: `The bias-variance tradeoff is a central concept in ML. Bias is error from incorrect assumptions — a high-bias model (underfit) is too simple and misses patterns in both training and test data (high training error AND high test error). Variance is error from sensitivity to training data fluctuations — a high-variance model (overfit) fits training data perfectly but fails to generalize (low training error, high test error). The goal is to find a model complexity that minimizes total error (bias² + variance + irreducible noise).

Regularization techniques reduce variance by penalizing model complexity. L2 regularization (Ridge) adds the sum of squared weights to the loss function, shrinking all weights toward zero — prevents any single feature from dominating. L1 regularization (Lasso) adds the sum of absolute weights, driving some weights exactly to zero — performs implicit feature selection. Elastic Net combines L1 and L2. Dropout (for neural networks) randomly zeros out neurons during training, preventing co-adaptation and acting as an ensemble of sub-networks. Early stopping monitors validation loss and stops training when it begins to increase — preventing the model from memorizing noise in training data.`,
      quiz: [
        {
          question:
            "A neural network achieves 99% training accuracy but only 65% validation accuracy. What is the most likely cause and the best corrective techniques?",
          options: [
            "High bias (underfitting) — increase model capacity, add layers, train longer",
            "High variance (overfitting) — apply regularization: dropout, L2 weight decay, early stopping, or reduce model complexity",
            "Data leakage — the training set contains validation labels",
            "Class imbalance — the training set is dominated by one class",
          ],
          correctIndex: 1,
          explanation:
            "99% training accuracy vs. 65% validation accuracy is the hallmark of high variance (overfitting) — the model memorized training data but fails to generalize. Corrective techniques include dropout (neural network regularization), L2 weight decay, early stopping (stop when validation loss increases), data augmentation, and reducing model complexity.",
        },
      ],
    },
    {
      heading: "Gradient Descent and Optimization",
      body: `Gradient descent is the optimization algorithm that minimizes the loss function by iteratively updating model parameters in the direction opposite to the gradient (the direction of steepest descent). Batch gradient descent computes the gradient on the full training set — accurate but slow for large datasets. Stochastic gradient descent (SGD) computes the gradient on a single example per step — fast but noisy (high gradient variance). Mini-batch gradient descent (the standard) computes the gradient on a small batch (typically 32-256 examples) — balancing speed and accuracy.

Advanced optimizers improve upon vanilla SGD. Adam (Adaptive Moment Estimation) maintains per-parameter learning rate adaptations using momentum (first moment) and RMSprop (second moment) — the most widely used optimizer for deep learning. Learning rate scheduling reduces the learning rate over training (step decay, exponential decay, cosine annealing) — preventing overshooting the minimum later in training. The learning rate is the most sensitive hyperparameter: too high causes divergence, too low causes slow convergence or getting stuck in local minima.`,
      quiz: [
        {
          question:
            "Which gradient descent variant balances training speed and gradient accuracy by computing updates on small random subsets of training data?",
          options: [
            "Batch gradient descent — uses the full training set for each update",
            "Stochastic gradient descent — uses one example per update for maximum speed",
            "Mini-batch gradient descent — uses small batches (32-256 examples) for balanced speed and accuracy",
            "Coordinate descent — updates one parameter at a time for maximum stability",
          ],
          correctIndex: 2,
          explanation:
            "Mini-batch gradient descent is the standard approach: it processes small batches of examples (typically 32-256), providing more frequent updates than batch gradient descent and less noisy gradients than pure stochastic gradient descent. It is the de facto optimizer implementation in all major deep learning frameworks.",
        },
      ],
    },
    {
      heading: "Neural Networks and Deep Learning Architectures",
      body: `Convolutional Neural Networks (CNNs) are the primary architecture for image and video processing. They use convolutional filters that learn local spatial features — early layers detect edges and textures, deeper layers detect complex objects. Pooling layers reduce spatial dimensions, controlling model size. CNNs are the foundation of computer vision tasks including object detection, segmentation, and image classification. Transfer learning is standard practice: start with a pre-trained CNN (ResNet, VGG, EfficientNet) and fine-tune on your domain-specific data rather than training from scratch.

Recurrent Neural Networks (RNNs) and their variants LSTM and GRU are designed for sequential data — text, time series, speech — where the order of inputs matters. LSTMs add memory cells with gating mechanisms that address the vanishing gradient problem in vanilla RNNs, enabling the model to retain relevant information over long sequences. Transformer architectures (the basis of modern language models like BERT and GPT) use self-attention mechanisms that model dependencies between all positions in a sequence simultaneously, outperforming RNNs on most NLP tasks and now increasingly on time series as well.`,
      quiz: [
        {
          question:
            "A team wants to build an image classifier with limited training data (10,000 examples). Which approach achieves the best performance with minimal training time?",
          options: [
            "Train a CNN from scratch with random initialization on the 10,000 examples",
            "Use transfer learning — start with a pre-trained CNN (ResNet, EfficientNet) and fine-tune the final layers on the 10,000 examples",
            "Use a random forest on raw pixel values — it handles small datasets better than CNNs",
            "Use a simple logistic regression on PCA-reduced pixel features",
          ],
          correctIndex: 1,
          explanation:
            "Transfer learning with a pre-trained CNN is the standard approach for limited labeled data. The pre-trained model has already learned rich image features (edges, textures, shapes) from millions of images. Fine-tuning only the final layers on 10,000 domain-specific examples achieves far better performance than training from scratch, which would severely overfit on this small dataset.",
        },
      ],
    },
    {
      heading: "Built-In SageMaker Algorithms for Common ML Tasks",
      body: `SageMaker provides managed built-in algorithm containers that require no custom code — you supply hyperparameters and training data and SageMaker handles the rest. XGBoost (built-in): gradient boosted trees for classification and regression — supports CSV and LibSVM input, GPU training, L1/L2 regularization. Linear Learner: scalable linear and logistic regression supporting both L1 and L2 regularization, with multiple optimization algorithms. K-Nearest Neighbors (KNN): for classification and regression using exact or approximate (FAISS) nearest neighbor search. K-Means: clustering using an ElKan variant optimized for speed. PCA: dimensionality reduction producing principal components.

Factorization Machines: for sparse data recommendations and click prediction (user-item interactions). DeepAR: probabilistic time-series forecasting using an autoregressive RNN — trains on hundreds of related time series simultaneously. BlazingText: fast Word2Vec-style embeddings and text classification — the fastest option for training word embeddings at scale. Object2Vec: general-purpose sequence and sentence embeddings. Neural Topic Model (NTM): unsupervised topic discovery equivalent to LDA. For the MLS-C01 exam, the most frequently tested built-in algorithms are XGBoost (tabular), Linear Learner (regression/classification), DeepAR (time series), and BlazingText (NLP).`,
      quiz: [
        {
          question:
            "A team needs to train a time-series demand forecasting model on 500 related product SKUs using a managed SageMaker algorithm with no custom code. Which built-in algorithm is most appropriate?",
          options: [
            "XGBoost — it handles time-series natively with lag features",
            "DeepAR — it trains on all related time series simultaneously using an autoregressive RNN",
            "Linear Learner — it applies linear regression to each time series independently",
            "BlazingText — it models sequential dependencies in the demand signal",
          ],
          correctIndex: 1,
          explanation:
            "DeepAR is SageMaker's built-in algorithm for time-series forecasting. It trains a single RNN on all related time series simultaneously, learning shared seasonal patterns and transferring knowledge across series. This makes it superior to per-series models for large catalogs of related time series.",
        },
      ],
    },
    {
      heading: "Ensemble Methods and Boosting Deep Dive",
      body: `Bagging (Bootstrap AGGregating) reduces variance by training B models on independently bootstrapped datasets and aggregating their predictions. Because models are trained independently and in parallel, bagging does not reduce bias — it only reduces the variance of an already-low-bias model. Random Forest extends bagging by also randomly selecting a subset of features at each split, further decorrelating the individual trees. Random Forest is the canonical low-variance, robust ensemble.

Boosting trains models sequentially where each model corrects the errors of its predecessors. AdaBoost reweights misclassified training examples so subsequent trees focus on hard cases. Gradient Boosting fits each new tree to the residuals (gradient of the loss function) of the previous ensemble. XGBoost improves on Gradient Boosting by adding L1/L2 regularization, second-order gradient approximation (Newton's method for faster convergence), and column subsampling. Key XGBoost hyperparameters: \`n_estimators\` (number of trees), \`max_depth\` (controls overfitting), \`learning_rate\`/\`eta\` (shrinkage factor), \`subsample\` and \`colsample_bytree\` (stochasticity). Stacking uses a meta-learner trained on base model outputs — the most complex ensemble method.`,
      quiz: [
        {
          question:
            "What is the fundamental difference in how bagging and boosting address model error?",
          options: [
            "Bagging reduces bias by aggregating different models; boosting reduces variance by training on bootstrapped samples",
            "Bagging reduces variance by averaging independent models trained in parallel; boosting reduces bias by training models sequentially where each corrects predecessor errors",
            "Bagging and boosting both reduce variance but use different aggregation methods",
            "Boosting reduces variance by training on different subsets; bagging reduces bias through sequential correction",
          ],
          correctIndex: 1,
          explanation:
            "Bagging reduces variance — it trains multiple independent models and averages their predictions, which cancels out individual model noise. Boosting reduces bias — it builds models sequentially, each one fitting the residual errors of the previous ensemble, progressively correcting systematic mistakes that a single model couldn't capture.",
        },
      ],
    },
    {
      heading: "Regularization Techniques for Neural Networks",
      body: `Beyond L1/L2 weight decay, neural networks have specialized regularization techniques. Batch Normalization (BatchNorm) normalizes layer activations to zero mean and unit variance across each mini-batch, then applies learned scale and shift parameters. This stabilizes training, allows higher learning rates, reduces sensitivity to initialization, and acts as mild regularization. BatchNorm is applied between the linear transformation and the activation function in each layer.

Layer Normalization normalizes across features for each individual example (not across the batch) — preferred for transformers, recurrent networks, and small batch sizes where batch statistics are unreliable. Dropout randomly zeros out neurons with probability p during each forward pass; at inference, weights are scaled by (1-p). Residual connections (skip connections) in ResNets allow gradients to shortcut through layers, directly addressing vanishing gradients in very deep networks — the identity shortcut ensures gradient magnitude is at least 1 even when the learned residual has small gradient. Data augmentation is typically the most impactful regularization for computer vision: random horizontal flip, random crop, color jitter, cutout (random patch erasure), and mixup (linear interpolation between training examples) all reduce overfitting with effectively no additional labeled data.`,
      quiz: [
        {
          question:
            "A transformer model with small batch sizes (batch size = 4) shows training instability. Batch Normalization is already applied. What normalization alternative is recommended for transformer architectures?",
          options: [
            "Instance Normalization — normalizes each channel independently for stable small-batch training",
            "Layer Normalization — normalizes across features for each example independently of batch size, preferred for transformers",
            "Group Normalization — groups channels and normalizes each group",
            "Weight Normalization — normalizes weight vectors rather than activations",
          ],
          correctIndex: 1,
          explanation:
            "Layer Normalization normalizes across all features for each individual example, making it independent of batch size. For transformers (and RNNs) where sequence position and batch size vary, LayerNorm is the standard normalization choice. BatchNorm's batch-dimension statistics become unreliable at very small batch sizes.",
        },
      ],
    },
    {
      heading: "Hyperparameter Tuning Strategies",
      body: `Hyperparameter tuning finds the best configuration of hyperparameters that maximizes a validation metric. Manual tuning relies on expert intuition — effective but slow and not reproducible. Grid search exhaustively evaluates all combinations on a defined grid — accurate but exponentially expensive (10 hyperparameters × 10 values each = 10 billion combinations). Random search samples random points in the hyperparameter space — empirically shown to outperform grid search when only a few hyperparameters strongly affect performance, because it explores each dimension more densely than grid search's fixed grid.

Bayesian optimization builds a probabilistic surrogate model of the objective function (typically a Gaussian Process), then uses an acquisition function (Expected Improvement or Upper Confidence Bound) to select the next hyperparameter configuration to evaluate — focusing search on promising regions while maintaining exploration. Bayesian optimization is significantly more sample-efficient than grid or random search, converging in fewer evaluations. Amazon SageMaker Automatic Model Tuning uses Bayesian optimization by default. Key SageMaker HPO parameters: objective metric (the validation metric to optimize), hyperparameter ranges (continuous, integer, categorical), \`MaxNumberOfTrainingJobs\` and \`MaxParallelTrainingJobs\` (budget), warm starting from previous jobs (reuses prior results).`,
      quiz: [
        {
          question:
            "Why does Bayesian optimization outperform random search for hyperparameter tuning in most practical ML scenarios?",
          options: [
            "Bayesian optimization samples more configurations per unit time using parallel evaluation",
            "Bayesian optimization builds a surrogate model of the objective and uses it to select configurations likely to improve performance — focusing evaluations on promising regions rather than sampling uniformly",
            "Bayesian optimization evaluates all configurations in the search space unlike random search",
            "Bayesian optimization uses gradient descent to directly optimize hyperparameters",
          ],
          correctIndex: 1,
          explanation:
            "Bayesian optimization maintains a probabilistic surrogate model (typically a Gaussian Process) that approximates the objective function. An acquisition function guides the next evaluation to balance exploration (high uncertainty regions) and exploitation (known high-value regions). This targeted sampling converges to good hyperparameters in far fewer evaluations than random search's uninformed sampling.",
        },
      ],
    },
  ],

  keyFacts: [
    "Gradient boosted trees (XGBoost, LightGBM): dominant for tabular/structured data",
    "Random Forest: bagging + random feature subsets — parallel training, robust to overfitting",
    "K-Means: specify K in advance; elbow method or silhouette score helps select K",
    "PCA: dimensionality reduction via orthogonal components of maximum variance",
    "Bias-variance tradeoff: high bias = underfit, high variance = overfit",
    "L1 (Lasso): feature selection via zero weights; L2 (Ridge): shrinks all weights toward zero",
    "Dropout: randomly zeros neurons during training — neural network regularization",
    "Early stopping: stop when validation loss begins increasing — prevents memorizing noise",
    "Adam optimizer: adaptive learning rates with momentum — default for deep learning",
    "Transfer learning: pre-trained CNN + fine-tune for image tasks with limited data",
    "SageMaker built-in XGBoost: pass hyperparameters directly — no Python code needed; supports GPU training",
    "Bagging reduces variance (parallel models); boosting reduces bias (sequential, each corrects predecessor)",
    "SageMaker Automatic Model Tuning: Bayesian optimization of hyperparameters — more efficient than grid search",
  ],

  relatedServices: [
    "Amazon SageMaker",
    "Amazon SageMaker Autopilot",
    "Amazon SageMaker Experiments",
    "Amazon SageMaker Clarify",
    "Amazon SageMaker Debugger",
    "Amazon EMR",
  ],

  examTips: [
    "High train accuracy + low val accuracy = overfitting = high variance → regularize",
    "High train error + high val error = underfitting = high bias → increase model capacity",
    "XGBoost is tested heavily on MLS-C01 — know it handles missing values, requires feature scaling? No, it doesn't",
    "L1 = feature selection (sparse weights); L2 = coefficient shrinkage (all non-zero weights)",
    "Adam is the most common deep learning optimizer; SGD with momentum is the alternative",
    "CNN = images; RNN/LSTM = sequences; Transformer = state of the art for NLP",
    "Transfer learning answer: when you have limited labeled data for image/NLP tasks",
    "Early stopping requires a validation set to monitor — another reason the val set exists",
    "Built-in algorithms = managed containers with default hyperparameters; XGBoost and Linear Learner are most tested",
    "SageMaker HPO uses Bayesian optimization by default — sample-efficient vs. grid search",
  ],

  topicQuiz: [
    {
      question:
        "A logistic regression model has 1,000 features but you suspect many are irrelevant. Which regularization technique performs implicit feature selection by driving irrelevant feature weights to exactly zero?",
      options: [
        "L2 regularization (Ridge) — shrinks all feature weights toward zero but keeps all non-zero",
        "L1 regularization (Lasso) — drives irrelevant feature weights to exactly zero, performing feature selection",
        "Dropout — randomly drops feature weights during training",
        "Elastic Net — only selects features when combined with manual thresholding",
      ],
      correctIndex: 1,
      explanation:
        "L1 (Lasso) regularization adds the sum of absolute weight values to the loss function. The gradient of L1 is constant (not proportional to weight magnitude), which causes small weights to be driven exactly to zero — effectively removing those features. L2 shrinks all weights proportionally but rarely to exactly zero.",
    },
    {
      question:
        "What is the vanishing gradient problem in RNNs, and which architecture was specifically designed to address it?",
      options: [
        "The gradient becomes infinite as it propagates back through time — addressed by gradient clipping in vanilla RNNs",
        "The gradient shrinks exponentially as it propagates back through long sequences, making it impossible to learn long-range dependencies — addressed by LSTM with gating mechanisms",
        "The gradient is too large for deep networks — addressed by batch normalization",
        "The gradient changes sign alternately during training — addressed by the Adam optimizer",
      ],
      correctIndex: 1,
      explanation:
        "In vanilla RNNs, gradients are multiplied by the same weight matrix at each time step during backpropagation through time. If this matrix has eigenvalues less than 1, gradients shrink exponentially over long sequences — the vanishing gradient problem. LSTMs introduce input, forget, and output gates that control information flow, allowing gradients to propagate over long sequences without vanishing.",
    },
  ],
};
