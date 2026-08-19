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
    },
    {
      heading: "Core Concepts: Datasets and Predictors",
      body: `Forecast organizes work around three key concepts. A **Dataset Group** is the container for all related data. Within it, you create **Datasets** of three types: the **Target Time Series** (required) contains the historical values you want to predict; **Related Time Series** contains additional time-varying features (like price or temperature) that may influence the target; and **Item Metadata** contains static attributes of your items (like category or brand).

A **Predictor** is a trained forecasting model. When you create a predictor, you specify the forecast horizon (how far into the future to predict, e.g., 12 weeks), the forecast frequency (weekly, daily, hourly), and optionally a specific algorithm. **AutoPredictor** — the recommended approach — automatically trains multiple algorithms and ensembles them to minimize error. Algorithms available include DeepAR+ (a recurrent neural network), Prophet (Facebook's open-source model), NPTS (non-parametric time series), ARIMA, ETS (exponential smoothing), and CNN-QR (quantile regression). AutoPredictor evaluates all of these and blends the best performers.`,
    },
    {
      heading: "Generating and Consuming Forecasts",
      body: `Once a predictor is trained and evaluated, you create a **Forecast** from it — this generates predictions for each item in your dataset for the specified horizon. Forecasts are probabilistic: rather than a single point estimate, Forecast returns quantiles (P10, P50, P90 by default). The P10 value means there is a 10% probability the actual value will be below this; P50 is the median; P90 means there is a 90% probability the actual value will be below this. This lets downstream systems make risk-aware decisions — a retailer might order to the P90 forecast to minimize stockouts, accepting some overstock risk.

You query forecasts via the **QueryForecast** API, specifying an item ID and optional filters. For bulk exports, Forecast can write all predictions to S3 in CSV or Parquet format via **Forecast Export Jobs**. You can also create **Explainability** reports that show which factors (related time series, item metadata) most influenced predictions for each item, improving trust and interpretability of the model's outputs.`,
    },
    {
      heading: "Accuracy Evaluation and Best Practices",
      body: `Forecast evaluates predictor accuracy using **backtesting**: it trains on a portion of your historical data and evaluates predictions against the held-out recent period. Metrics include WAPE (weighted absolute percentage error), RMSE (root mean squared error), and quantile loss for each requested quantile. Lower is better for all metrics.

Best practices for accurate forecasting: provide at least two full seasonal cycles of history (e.g., two years of weekly data if you have annual seasonality), include related time series that you can observe in the future (future promotions schedule, known holiday calendar), and use item metadata to help the model generalize across items with limited history. Cold-start items — new products with no sales history — benefit most from metadata and related time series that allow the model to borrow patterns from similar items. Forecast handles cold-start natively through its metadata integration.`,
    },
    {
      heading: "Integration with the AWS Ecosystem",
      body: `Forecast integrates naturally with the broader AWS data stack. Historical data stored in Amazon S3 (in CSV or Parquet format) is imported directly into Forecast datasets. You can orchestrate the full pipeline — import data, train predictor, generate forecast, export results — using AWS Step Functions or Amazon EventBridge Scheduler for regular retraining cycles.

Forecast outputs land back in S3, where they can be consumed by Amazon QuickSight for visualization, Amazon Redshift or Athena for analytical queries, or application services via the QueryForecast API. For operational decision systems, you can trigger downstream workflows (inventory replenishment orders, staffing adjustments) via Lambda functions that read forecast outputs. Forecast is also integrated with **Amazon SageMaker** — you can use SageMaker Pipelines to orchestrate Forecast jobs as steps in a broader ML workflow.`,
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
};
