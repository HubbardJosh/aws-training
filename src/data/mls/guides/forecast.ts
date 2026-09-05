import { ServiceGuide } from "../../../types/guide";

export const forecastGuide: ServiceGuide = {
  id: "mls-forecast",
  service: "Amazon Forecast",
  domain: "services",
  tagline:
    "Fully managed time-series forecasting service using machine learning without ML expertise",
  intro:
    "Amazon Forecast applies machine learning to time-series data to generate accurate probabilistic forecasts. It combines classical statistical methods (ARIMA, ETS, Prophet) with deep learning approaches (DeepAR+, NPTS) and automatically selects the best algorithm for your data, making production-quality forecasting accessible without ML expertise.",

  sections: [
    {
      heading: "Forecast Algorithms and AutoML",
      body: `Amazon Forecast provides multiple built-in algorithms optimized for different time-series characteristics. ARIMA and ETS are classical statistical models suitable for stationary time series with clear trends and seasonality. Prophet is designed for time series with multiple seasonality periods and holiday effects. DeepAR+ is a deep learning model that trains on hundreds or thousands of related time series simultaneously — it transfers patterns across time series and is particularly effective when individual series have sparse history but the aggregate has rich patterns.

AutoML mode automatically evaluates multiple algorithms on your dataset and selects the one with the lowest Weighted Quantile Loss (wQL). This eliminates the need to manually select and tune algorithms. Forecast also supports CNN-QR (Convolutional Neural Network Quantile Regression), NPTS (Non-Parametric Time Series), and a Simple ML approach. For the MLS-C01 exam, understand that DeepAR+ is the deep learning algorithm that excels at multi-series forecasting and that AutoML selects the best algorithm automatically.`,
      quiz: [
        {
          question:
            "A retail company has 10,000 SKUs and wants to forecast demand for each. Which Amazon Forecast algorithm is best suited for learning shared patterns across all SKUs simultaneously?",
          options: [
            "ARIMA — it models each SKU's time series independently using autoregression",
            "ETS — it captures error, trend, and seasonality components per series",
            "DeepAR+ — it trains a single deep learning model on all SKUs simultaneously, transferring patterns across related series",
            "Prophet — it handles multiple seasonality periods per SKU",
          ],
          correctIndex: 2,
          explanation:
            "DeepAR+ trains on all time series simultaneously and learns shared patterns across them. This is particularly effective for multi-SKU demand forecasting where products share seasonal patterns and promotional effects. It outperforms models trained per-series when there are hundreds or thousands of related series.",
        },
      ],
    },
    {
      heading: "Forecast Datasets and Related Time Series",
      body: `Amazon Forecast requires a target time series dataset — the metric you want to forecast (sales, demand, energy consumption) indexed by item and timestamp. Optionally, you can provide related time series datasets that include external variables known to affect the target: promotions, price changes, holidays, weather conditions, or marketing spend. Related time series must be available for both historical and future periods, enabling Forecast to incorporate forward-looking covariate information.

Item metadata is a third optional dataset type providing static attributes about items — product category, brand, store location, product weight. Forecast uses metadata to improve forecasting accuracy for items with sparse history by borrowing information from similar items with rich history. The combination of target time series + related time series + item metadata gives Forecast the maximum information to produce accurate predictions, particularly for cold-start items with little historical data.`,
      quiz: [
        {
          question:
            "A retail company wants to improve demand forecasts by incorporating planned promotions and price changes for the next quarter. Which Forecast dataset type should they provide?",
          options: [
            "Additional target time series with future sales projections",
            "Related time series containing promotion and price data for both historical and future periods",
            "Item metadata with the promotion category attribute",
            "Forecast explanability data showing past feature importance",
          ],
          correctIndex: 1,
          explanation:
            "Related time series contains external variables that influence the target metric. Since promotion and price data is known for the future (planned promotions), it qualifies as a related time series — Forecast can use both the historical correlation and the future covariate values to improve predictions.",
        },
      ],
    },
    {
      heading: "Probabilistic Forecasting and Quantiles",
      body: `Amazon Forecast generates probabilistic forecasts by producing multiple quantile predictions rather than a single point estimate. A P10 prediction means the actual value will be below this prediction 10% of the time; P50 is the median prediction; P90 means the actual value will be below this 90% of the time. This probabilistic output enables risk-aware decision-making: for inventory planning, a retailer might stock based on the P90 prediction to be adequately stocked 90% of the time and avoid stockouts.

The Weighted Quantile Loss (wQL) metric evaluates forecast accuracy by measuring how well the predicted quantile intervals capture actual outcomes. Lower wQL is better. Forecast also reports RMSE and MAPE for comparison with traditional point-forecast methods. Understanding the business implications of different quantile predictions — P10 for scenarios where understocking is preferable, P90 for scenarios where overstocking is preferable — is an important concept for MLS-C01 scenario questions about forecasting applications.`,
      quiz: [
        {
          question:
            "A hospital uses Amazon Forecast to predict daily medication demand. They want to ensure they have enough supply 95% of the time to avoid shortages. Which quantile prediction should they use for ordering decisions?",
          options: [
            "P50 — the median prediction represents typical demand accurately",
            "P10 — the lower bound ensures they don't over-order",
            "P90 — the actual demand will be below this value 90% of the time, providing a buffer",
            "P95 — the actual demand will be below this value 95% of the time, matching the 95% service level requirement",
          ],
          correctIndex: 3,
          explanation:
            "P95 means the actual value will fall below the prediction 95% of the time. Ordering based on the P95 prediction ensures adequate supply in 95 out of 100 periods, directly matching the 95% service level requirement. Amazon Forecast can generate custom quantiles beyond the standard P10/P50/P90.",
        },
      ],
    },
    {
      heading: "Forecast Explainability and What-If Analysis",
      body: `Forecast Explainability uses SHAP values to identify which features (time series attributes, related time series, item metadata) most influenced each prediction. This transparency is important for regulated use cases and for diagnosing forecast errors. If a demand forecast is unexpectedly high, explainability can reveal that a planned promotion was the dominant driver — allowing planners to assess whether the promotion impact is being overestimated.

What-If Analysis allows exploring how forecast predictions change under different covariate scenarios without retraining. For example, a retailer could ask: "How does predicted demand change if we increase the price by 10%?" or "How does energy consumption change if the temperature increases by 5 degrees?" What-If creates multiple forecast scenarios from a single trained predictor, enabling scenario planning and sensitivity analysis — key capabilities for business forecasting applications built on Amazon Forecast.`,
      quiz: [
        {
          question:
            "A supply chain team wants to understand why Amazon Forecast predicted unexpectedly high demand for a product next month. Which feature provides this insight?",
          options: [
            "AutoML — it shows which algorithm was selected and why",
            "Quantile analysis — comparing P10/P50/P90 values reveals the uncertainty drivers",
            "Forecast Explainability — uses SHAP values to show which features drove each prediction",
            "What-If Analysis — tests alternative demand scenarios to find the unexpected driver",
          ],
          correctIndex: 2,
          explanation:
            "Forecast Explainability uses SHAP values to attribute each prediction to specific input features (related time series, item metadata, time series attributes). This reveals which factors drove an unexpected forecast value, enabling planners to validate or challenge the prediction.",
        },
      ],
    },
    {
      heading: "Forecast Predictor Training and Deployment",
      body: `The Amazon Forecast workflow is: create a dataset group → import datasets → create a predictor (train the model) → generate a forecast. Predictors are trained on historical data and can be retrained as new data arrives. Legacy predictors train on a single algorithm of your choice; AutoML predictors evaluate multiple algorithms and select the best. AutoPredictor (the newer option) combines multiple algorithms in an ensemble and uses explainability by default.

Forecast generates predictions via the Query Forecast API for item-level predictions or exports forecasts to S3 for batch use. The Forecast service is fully managed — you do not provision any training infrastructure. For integration with business systems, forecasts exported to S3 can be loaded into Redshift or Athena for BI dashboards, or directly consumed by downstream ML pipelines as features. Monitoring predictor accuracy over time using backtesting windows is a best practice for maintaining forecast quality as data distributions change.`,
      quiz: [
        {
          question:
            "Which Amazon Forecast predictor option evaluates multiple algorithms and creates an ensemble, providing the best overall accuracy for diverse time-series datasets?",
          options: [
            "Legacy predictor with ARIMA — the most accurate classical algorithm",
            "AutoML predictor — tests multiple algorithms and selects the single best performer",
            "AutoPredictor — ensembles multiple algorithms and uses explainability by default",
            "DeepAR+ predictor — always the most accurate for large time-series collections",
          ],
          correctIndex: 2,
          explanation:
            "AutoPredictor is the recommended option in Amazon Forecast. It combines multiple algorithms in an ensemble (rather than selecting a single best), provides built-in explainability, and typically outperforms AutoML's single-best-algorithm selection, especially on diverse time-series datasets.",
        },
      ],
    },
  ],

  keyFacts: [
    "Forecast algorithms: ARIMA, ETS, Prophet (classical) + DeepAR+, CNN-QR, NPTS (deep learning)",
    "DeepAR+ trains on all time series simultaneously — excels at multi-series forecasting",
    "AutoML evaluates all algorithms; AutoPredictor ensembles them — AutoPredictor is recommended",
    "Three dataset types: target time series (required), related time series, item metadata",
    "Related time series must include future values (known future covariates like planned promotions)",
    "Probabilistic forecasts: P10/P50/P90 quantiles — use P90 for safety stock, P50 for planning",
    "Weighted Quantile Loss (wQL) is the primary accuracy metric for probabilistic forecasts",
    "Forecast Explainability: SHAP values show which features drove each prediction",
    "What-If Analysis: scenario planning without retraining — test covariate changes",
    "Fully managed — no infrastructure to provision; export forecasts to S3 for downstream use",
  ],

  relatedServices: [
    "Amazon S3",
    "Amazon Redshift",
    "Amazon QuickSight",
    "Amazon SageMaker",
    "Amazon Athena",
    "AWS Glue",
  ],

  examTips: [
    "DeepAR+ = the deep learning algorithm for multi-series forecasting — knows cross-series patterns",
    "AutoPredictor > AutoML — it ensembles algorithms rather than selecting one",
    "P90 = stock to be adequate 90% of the time; choose quantile based on business risk tolerance",
    "Related time series = known future covariates (promotions, price, weather) — must extend into forecast horizon",
    "wQL is the forecast evaluation metric — lower is better for probabilistic forecasts",
    "Explainability uses SHAP — same concept as SageMaker Clarify, just applied to time-series predictions",
    "What-If Analysis enables scenario planning without retraining the predictor",
    "Forecast exports to S3 → Athena/Redshift → QuickSight for business dashboard integration",
  ],

  topicQuiz: [
    {
      question:
        "An energy company wants to forecast electricity consumption for 500 substations. Each substation has 3 years of hourly data. Which Amazon Forecast algorithm learns shared consumption patterns across all substations simultaneously?",
      options: [
        "ARIMA — models each substation independently with autoregression",
        "Prophet — handles multiple seasonality periods (daily, weekly, seasonal)",
        "DeepAR+ — trains on all 500 substation time series simultaneously, learning cross-series patterns",
        "ETS — captures error, trend, and seasonality for each series",
      ],
      correctIndex: 2,
      explanation:
        "DeepAR+ is a deep learning algorithm that trains on all time series simultaneously, learning cross-series patterns. For 500 related substations that likely share regional weather and demand patterns, DeepAR+ transfers knowledge across series and outperforms per-series classical models.",
    },
    {
      question:
        "A retailer generates Amazon Forecast predictions with P10, P50, and P90 quantiles for inventory planning. For seasonal items where stockouts are costly, which quantile should drive ordering decisions?",
      options: [
        "P10 — ordering the minimum protects against overstock costs",
        "P50 — the median provides the most accurate single estimate",
        "P90 — the actual demand will be below this value 90% of the time, minimizing stockout risk",
        "Average of P10 and P90 — balances overstock and understock risk equally",
      ],
      correctIndex: 2,
      explanation:
        "P90 means actual demand will fall below the prediction 90% of the time. For items where stockouts are costly (seasonal demand, high-margin products), ordering to the P90 level ensures adequate inventory in 9 out of 10 periods. Higher quantiles = more buffer stock but higher carrying cost.",
    },
  ],
};
