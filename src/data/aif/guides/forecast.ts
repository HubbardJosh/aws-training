import { ServiceGuide } from "../../../types/guide";

export const forecastGuide: ServiceGuide = {
  id: "aif-forecast",
  service: "Amazon Forecast",
  domain: "development",
  tagline: "Fully managed time-series forecasting using machine learning",
  intro:
    "Amazon Forecast is a fully managed service that uses machine learning to produce highly accurate forecasts from time-series data, without requiring ML expertise. It automatically selects the best algorithm for your data and combines statistical and deep learning methods.",

  sections: [
    {
      heading: "What Amazon Forecast Does",
      body: `Time-series forecasting — predicting future values based on historical patterns — is one of the most common and commercially valuable ML applications. Businesses need to forecast product demand, energy consumption, web traffic, staffing needs, and financial metrics. Traditionally this required statisticians who could select and tune models like ARIMA or exponential smoothing. Amazon Forecast democratizes this by automating the entire process: you bring your historical data, and Forecast selects, trains, and evaluates the best model automatically.

Forecast is purpose-built for time series, which means it understands concepts like seasonality (weekly peaks, holiday spikes), trends (gradual increase in demand), and the relationship between a target metric and related variables. You provide your historical target data (e.g., weekly sales units) and optionally **related time series** (price, promotions, weather) and **item metadata** (product category, region). Forecast incorporates all of these signals into a single model.`,
      quiz: [
        {
          question:
            "Which of the following use cases is Amazon Forecast specifically designed for?",
          options: [
            "Classifying customer sentiment from product reviews",
            "Predicting future values from historical time-series data such as demand, energy consumption, or web traffic",
            "Detecting anomalies in log files using unsupervised learning",
            "Recommending products based on user interaction history",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Forecast is purpose-built for time-series forecasting — predicting future values (demand, energy, traffic, staffing) from historical patterns. Sentiment classification is Amazon Comprehend. Log anomaly detection uses different services. Product recommendations are Amazon Personalize.",
        },
        {
          question:
            "Besides the required target time series, what two optional dataset types can Amazon Forecast incorporate to improve predictions?",
          options: [
            "User interaction data and item embeddings",
            "Related time series and item metadata",
            "Labeled annotations and validation sets",
            "External APIs and webhook data",
          ],
          correctIndex: 1,
          explanation:
            "Forecast supports three dataset types: the required Target Time Series (historical values to predict), optional Related Time Series (time-varying features like price, promotions, weather), and optional Item Metadata (static attributes like product category or region). User interactions and embeddings are Personalize concepts.",
        },
        {
          question:
            "What does Amazon Forecast understand about time-series data that general ML services do not natively handle?",
          options: [
            "Feature importance using SHAP values",
            "Seasonality, trends, and the relationships between target metrics and related variables",
            "Cluster structure in unlabeled datasets",
            "Image and audio modalities alongside numerical data",
          ],
          correctIndex: 1,
          explanation:
            "Forecast is purpose-built for time series and natively understands seasonality (weekly peaks, holiday spikes), trends (gradual demand changes), and how related variables (promotions, weather) influence the target metric. SHAP values are for explainability (Clarify). Clustering is unsupervised ML. Image/audio are different modalities.",
        },
      ],
    },
    {
      heading: "Core Concepts: Datasets and Predictors",
      body: `Forecast organizes work around three key concepts. A **Dataset Group** is the container for all related data. Within it, you create **Datasets** of three types: the **Target Time Series** (required) contains the historical values you want to predict; **Related Time Series** contains additional time-varying features (like price or temperature) that may influence the target; and **Item Metadata** contains static attributes of your items (like category or brand).

A **Predictor** is a trained forecasting model. When you create a predictor, you specify the forecast horizon (how far into the future to predict, e.g., 12 weeks), the forecast frequency (weekly, daily, hourly), and optionally a specific algorithm. **AutoPredictor** — the recommended approach — automatically trains multiple algorithms and ensembles them to minimize error. Algorithms available include DeepAR+ (a recurrent neural network), Prophet (Facebook's open-source model), NPTS (non-parametric time series), ARIMA, ETS (exponential smoothing), and CNN-QR (quantile regression). AutoPredictor evaluates all of these and blends the best performers.`,
      quiz: [
        {
          question:
            "What is the recommended approach for creating a Predictor in Amazon Forecast?",
          options: [
            "Manually selecting ARIMA for all time-series workloads",
            "AutoPredictor, which trains multiple algorithms and ensembles the best performers",
            "DeepAR+ because it always outperforms statistical models",
            "Prophet because it is the most widely used open-source forecasting model",
          ],
          correctIndex: 1,
          explanation:
            "AutoPredictor is the recommended approach — it automatically trains multiple algorithms (DeepAR+, Prophet, ARIMA, ETS, NPTS, CNN-QR), evaluates each, and ensembles the best performers to minimize forecast error. No single algorithm is universally best; AutoPredictor selects the optimal combination for your specific data.",
        },
        {
          question:
            "What does the 'forecast horizon' specify when creating a Predictor in Amazon Forecast?",
          options: [
            "The number of historical data points required for training",
            "How far into the future the model will generate predictions",
            "The number of algorithms AutoPredictor will evaluate",
            "The granularity of the time-series data (daily, weekly, hourly)",
          ],
          correctIndex: 1,
          explanation:
            "The forecast horizon specifies how far into the future predictions are generated (e.g., 12 weeks ahead). Forecast frequency (daily, weekly, hourly) is specified separately. The number of historical data points and algorithms evaluated are separate configuration aspects not called the 'horizon'.",
        },
        {
          question:
            "Which algorithm available in Amazon Forecast is based on a recurrent neural network architecture?",
          options: ["ARIMA", "ETS (exponential smoothing)", "DeepAR+", "NPTS"],
          correctIndex: 2,
          explanation:
            "DeepAR+ is a deep learning algorithm based on recurrent neural networks, capable of learning complex patterns across many related time series simultaneously. ARIMA and ETS are classical statistical models. NPTS (non-parametric time series) is a non-parametric statistical approach.",
        },
      ],
    },
    {
      heading: "Generating and Consuming Forecasts",
      body: `Once a predictor is trained and evaluated, you create a **Forecast** from it — this generates predictions for each item in your dataset for the specified horizon. Forecasts are probabilistic: rather than a single point estimate, Forecast returns quantiles (P10, P50, P90 by default). The P10 value means there is a 10% probability the actual value will be below this; P50 is the median; P90 means there is a 90% probability the actual value will be below this. This lets downstream systems make risk-aware decisions — a retailer might order to the P90 forecast to minimize stockouts, accepting some overstock risk.

You query forecasts via the **QueryForecast** API, specifying an item ID and optional filters. For bulk exports, Forecast can write all predictions to S3 in CSV or Parquet format via **Forecast Export Jobs**. You can also create **Explainability** reports that show which factors (related time series, item metadata) most influenced predictions for each item, improving trust and interpretability of the model's outputs.`,
      quiz: [
        {
          question:
            "Amazon Forecast returns P10, P50, and P90 quantile predictions. What does P90 represent?",
          options: [
            "The model is 90% confident the prediction is correct",
            "There is a 90% probability the actual value will be below this prediction",
            "The prediction uses 90% of the training data",
            "The model achieves 90% accuracy on the validation set",
          ],
          correctIndex: 1,
          explanation:
            "P90 means there is a 90% probability the actual value will be at or below this value. A retailer ordering to P90 minimizes stockout risk (accepting some overstock). P50 is the median estimate. P10 means only 10% probability the actual falls below this. These are quantile predictions, not accuracy metrics.",
        },
        {
          question:
            "A retailer wants to minimize the risk of stockouts (running out of inventory) and is willing to accept some overstock. Which quantile should they order to?",
          options: ["P10", "P50", "P90", "The mean prediction"],
          correctIndex: 2,
          explanation:
            "Ordering to P90 means stocking enough to cover demand 90% of the time, minimizing stockouts at the cost of some overstock. P10 would frequently result in stockouts (only covers 10% of scenarios). P50 is the median and balances over/understocking. P90 is the appropriate choice for stockout-averse strategies.",
        },
        {
          question:
            "How do you query predictions for a specific item in Amazon Forecast?",
          options: [
            "Export all predictions to S3 and query from there",
            "Use the QueryForecast API specifying the item ID",
            "Query the Predictor directly using the model ARN",
            "Subscribe to an SNS topic that publishes predictions per item",
          ],
          correctIndex: 1,
          explanation:
            "The QueryForecast API allows real-time querying of predictions for a specific item ID (with optional filters). Forecast Export Jobs write all predictions to S3 in bulk for batch consumption. There is no direct Predictor query API or SNS subscription mechanism for individual item predictions.",
        },
      ],
    },
    {
      heading: "Accuracy Evaluation and Best Practices",
      body: `Forecast evaluates predictor accuracy using **backtesting**: it trains on a portion of your historical data and evaluates predictions against the held-out recent period. Metrics include WAPE (weighted absolute percentage error), RMSE (root mean squared error), and quantile loss for each requested quantile. Lower is better for all metrics.

Best practices for accurate forecasting: provide at least two full seasonal cycles of history (e.g., two years of weekly data if you have annual seasonality), include related time series that you can observe in the future (future promotions schedule, known holiday calendar), and use item metadata to help the model generalize across items with limited history. Cold-start items — new products with no sales history — benefit most from metadata and related time series that allow the model to borrow patterns from similar items. Forecast handles cold-start natively through its metadata integration.`,
      quiz: [
        {
          question:
            "How does Amazon Forecast evaluate Predictor accuracy without a separate test dataset you provide?",
          options: [
            "It uses cross-validation on the entire training dataset",
            "It uses backtesting — training on a portion of historical data and evaluating against the held-out recent period",
            "It compares predictions against a synthetic benchmark dataset",
            "It requires you to provide a separate labeled test set",
          ],
          correctIndex: 1,
          explanation:
            "Forecast evaluates accuracy through backtesting — it holds out the most recent period of your historical data as a test set and measures how well predictions for that period match actual values. You do not need to provide a separate test dataset; Forecast creates the test split from your historical data automatically.",
        },
        {
          question:
            "What are the primary accuracy metrics reported by Amazon Forecast for Predictor evaluation?",
          options: [
            "Accuracy, Precision, Recall, and F1 score",
            "WAPE, RMSE, and quantile loss",
            "MAE, R-squared, and AUC-ROC",
            "Cross-entropy loss and perplexity",
          ],
          correctIndex: 1,
          explanation:
            "Forecast reports WAPE (weighted absolute percentage error), RMSE (root mean squared error), and quantile loss for each requested quantile. Lower values are better for all metrics. Accuracy/Precision/Recall/F1 are classification metrics. MAE and R-squared are regression metrics but not the primary Forecast metrics. Cross-entropy and perplexity are language model metrics.",
        },
        {
          question:
            "How does Amazon Forecast handle 'cold-start' items — new products with no sales history?",
          options: [
            "Cold-start items are excluded from predictions until they accumulate at least 30 data points",
            "Cold-start items get a zero-forecast until manual history is provided",
            "Item metadata and related time series allow the model to borrow patterns from similar items with history",
            "Cold-start requires a separate custom model trained on similar items",
          ],
          correctIndex: 2,
          explanation:
            "Forecast handles cold-start natively by using item metadata (category, brand, region) and related time series to find similar items with history and borrow their patterns. This allows useful predictions even for brand-new items. Cold-start items are not excluded, zeroed out, or requiring separate custom models.",
        },
      ],
    },
    {
      heading: "Integration with the AWS Ecosystem",
      body: `Forecast integrates naturally with the broader AWS data stack. Historical data stored in Amazon S3 (in CSV or Parquet format) is imported directly into Forecast datasets. You can orchestrate the full pipeline — import data, train predictor, generate forecast, export results — using AWS Step Functions or Amazon EventBridge Scheduler for regular retraining cycles.

Forecast outputs land back in S3, where they can be consumed by Amazon QuickSight for visualization, Amazon Redshift or Athena for analytical queries, or application services via the QueryForecast API. For operational decision systems, you can trigger downstream workflows (inventory replenishment orders, staffing adjustments) via Lambda functions that read forecast outputs. Forecast is also integrated with **Amazon SageMaker** — you can use SageMaker Pipelines to orchestrate Forecast jobs as steps in a broader ML workflow.`,
      quiz: [
        {
          question:
            "What input data format does Amazon Forecast accept when importing historical data from S3?",
          options: [
            "JSON and XML only",
            "CSV and Parquet",
            "Avro and ORC",
            "JSONL and TSV",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Forecast accepts historical data stored in S3 in CSV or Parquet format. JSON, XML, Avro, ORC, JSONL, and TSV are not supported input formats for Forecast dataset imports.",
        },
        {
          question:
            "Which AWS service can be used to orchestrate a recurring Forecast pipeline (import data → train predictor → generate forecast → export results) on a schedule?",
          options: [
            "Amazon Kinesis Data Streams",
            "AWS Step Functions or Amazon EventBridge Scheduler",
            "Amazon SQS with Lambda triggers",
            "AWS Glue workflows only",
          ],
          correctIndex: 1,
          explanation:
            "AWS Step Functions (for complex DAG workflows) or Amazon EventBridge Scheduler (for cron-based triggering) are the recommended services for orchestrating recurring Forecast pipeline cycles. Kinesis is for real-time streaming. SQS/Lambda can trigger jobs but are not the primary orchestration mechanism. Glue is for ETL, not Forecast orchestration.",
        },
        {
          question:
            "A business analyst wants to visualize Amazon Forecast output predictions in a dashboard. Which AWS service is the most natural integration?",
          options: [
            "Amazon SageMaker Studio",
            "Amazon QuickSight",
            "Amazon Comprehend",
            "AWS Glue DataBrew",
          ],
          correctIndex: 1,
          explanation:
            "Amazon QuickSight is AWS's BI and visualization service, and Forecast outputs (written to S3 in CSV/Parquet) can be consumed by QuickSight for dashboard visualization. SageMaker Studio is a ML development IDE. Comprehend is NLP. Glue DataBrew is for data preparation, not visualization.",
        },
      ],
    },
  ],

  keyFacts: [
    "Fully managed time-series forecasting — no ML expertise required",
    "AutoPredictor automatically selects and ensembles multiple algorithms",
    "Algorithms: DeepAR+, Prophet, ARIMA, ETS, NPTS, CNN-QR",
    "Three dataset types: Target Time Series, Related Time Series, Item Metadata",
    "Forecasts are probabilistic — returns P10, P50, P90 quantiles by default",
    "Backtesting evaluates accuracy on held-out historical data",
    "Accuracy metrics: WAPE, RMSE, quantile loss",
    "Cold-start support via metadata and related time series",
    "Export forecasts to S3 in CSV or Parquet; query via QueryForecast API",
    "Integrates with S3, Step Functions, QuickSight, SageMaker",
  ],

  relatedServices: [
    "Amazon SageMaker",
    "Amazon S3",
    "AWS Step Functions",
    "Amazon QuickSight",
    "Amazon Redshift",
  ],

  examTips: [
    "Forecast = time-series only; for general ML use SageMaker",
    "AutoPredictor is the recommended approach — it ensembles multiple algorithms",
    "Probabilistic forecasts (quantiles) let businesses make risk-aware decisions",
    "Related Time Series = future-known variables (promotions, holidays) — must be available at forecast time",
    "Item Metadata helps cold-start items borrow patterns from similar items",
    "Backtesting uses held-out historical data — not a separate test dataset you provide",
    "WAPE and RMSE are the primary accuracy metrics to know",
  ],

  topicQuiz: [
    {
      question:
        "A retailer has weekly sales data for 5,000 products over 3 years, with known promotion schedules and product category metadata. Which Amazon Forecast dataset types should they use?",
      options: [
        "Target Time Series only",
        "Target Time Series and Item Metadata only",
        "Target Time Series, Related Time Series (promotions), and Item Metadata (category)",
        "Related Time Series and Item Metadata only",
      ],
      correctIndex: 2,
      explanation:
        "They should use all three dataset types: Target Time Series (weekly sales history), Related Time Series (promotion schedule — a time-varying feature known in advance), and Item Metadata (product category — a static attribute). Using all available data generally improves forecast accuracy.",
    },
    {
      question:
        "A company wants Amazon Forecast to automatically select the best forecasting algorithm rather than choosing one manually. What should they use?",
      options: [
        "DeepAR+ with default hyperparameters",
        "ARIMA with manual hyperparameter tuning",
        "AutoPredictor",
        "A SageMaker HPO job over Forecast algorithms",
      ],
      correctIndex: 2,
      explanation:
        "AutoPredictor is specifically designed to automatically train, evaluate, and ensemble multiple Forecast algorithms (DeepAR+, Prophet, ARIMA, ETS, NPTS, CNN-QR) and select the best combination for the data. Manual algorithm selection and SageMaker HPO are unnecessary when AutoPredictor is available.",
    },
    {
      question:
        "An energy company needs to forecast electricity consumption for the next 30 days. Their historical data shows strong weekly and annual seasonality. What best practice should they follow for training data?",
      options: [
        "Provide at least 30 days of history matching the forecast horizon",
        "Provide at least two full seasonal cycles — at least two years of data given annual seasonality",
        "Provide exactly one year of history regardless of seasonal patterns",
        "Use only the most recent 90 days for recency bias",
      ],
      correctIndex: 1,
      explanation:
        "Forecast best practice recommends at least two full seasonal cycles of history. With annual seasonality, that means at least two years of data so the model can learn consistent year-over-year patterns. Using only the forecast horizon length (30 days) or only recent data would severely limit model accuracy.",
    },
    {
      question:
        "A logistics company queries Amazon Forecast for shipment volume predictions. They want to plan conservatively to avoid capacity shortfalls. Which quantile should they use for planning purposes?",
      options: ["P10", "P50", "P90", "Mean prediction"],
      correctIndex: 2,
      explanation:
        "P90 means there is a 90% probability actual volume will be at or below this value — planning to P90 ensures capacity for the vast majority of scenarios, minimizing the risk of shortfalls. P10 would frequently be insufficient (only covers low-demand scenarios). P50 is the median and less conservative.",
    },
    {
      question:
        "What is the difference between Related Time Series and Item Metadata in Amazon Forecast?",
      options: [
        "Related Time Series is required; Item Metadata is required for all datasets",
        "Related Time Series contains time-varying features (price, promotions); Item Metadata contains static item attributes (category, brand)",
        "Related Time Series is for training only; Item Metadata is used only at prediction time",
        "There is no difference — they are two names for the same dataset type",
      ],
      correctIndex: 1,
      explanation:
        "Related Time Series contains features that change over time (price per week, promotional flags, temperature) that influence the target metric. Item Metadata contains static, non-time-varying attributes of items (product category, brand, region). Both are optional but improve accuracy. Neither is required — only Target Time Series is required.",
    },
    {
      question:
        "Which Amazon Forecast accuracy metric is described as the 'weighted absolute percentage error'?",
      options: ["RMSE", "WAPE", "R-squared", "Quantile loss"],
      correctIndex: 1,
      explanation:
        "WAPE (weighted absolute percentage error) measures forecast accuracy as a percentage, weighting errors by the magnitude of the actual values. RMSE (root mean squared error) penalizes large errors more heavily. R-squared measures explained variance. Quantile loss measures accuracy for a specific quantile prediction.",
    },
    {
      question:
        "A company launches a brand new product with no sales history. How does Amazon Forecast generate predictions for this cold-start item?",
      options: [
        "Forecast returns zero predictions until the item accumulates 12 data points",
        "Forecast uses item metadata and related time series to borrow patterns from similar items with history",
        "Cold-start items must use a separate manually trained SageMaker model",
        "Forecast uses the average of all other items as the cold-start prediction",
      ],
      correctIndex: 1,
      explanation:
        "Amazon Forecast handles cold-start natively by using item metadata (category, brand) and related time series to identify similar items with history and borrow their forecasting patterns. Zero predictions, mandatory SageMaker models, and simple averages are not the correct approach — Forecast's metadata integration handles this automatically.",
    },
    {
      question:
        "After Amazon Forecast exports predictions to S3, which AWS service would a business analyst use to create an interactive dashboard visualizing forecast vs actual demand?",
      options: [
        "Amazon SageMaker Canvas",
        "AWS Glue DataBrew",
        "Amazon QuickSight",
        "Amazon Athena",
      ],
      correctIndex: 2,
      explanation:
        "Amazon QuickSight is the AWS BI visualization service for creating interactive dashboards and charts. Forecast S3 outputs can be connected to QuickSight as a data source. Athena can query the S3 data with SQL but is not a visualization tool. SageMaker Canvas and Glue DataBrew are for ML and data preparation, not dashboarding.",
    },
  ],
};
