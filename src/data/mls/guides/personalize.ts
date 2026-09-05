import { ServiceGuide } from "../../../types/guide";

export const personalizeGuide: ServiceGuide = {
  id: "mls-personalize",
  service: "Amazon Personalize",
  domain: "services",
  tagline:
    "Fully managed real-time personalization and recommendation service using ML",
  intro:
    "Amazon Personalize provides ML-powered personalization capabilities — recommendations, rankings, and user segmentation — using the same deep learning technology that powers Amazon.com recommendations, made available as a managed API service without requiring ML expertise.",

  sections: [
    {
      heading: "Personalize Concepts: Datasets, Recipes, and Solutions",
      body: `Amazon Personalize organizes resources into Dataset Groups. Each Dataset Group contains three optional dataset types: Interactions (the most critical — user-item interaction events like clicks, purchases, ratings), Items (item metadata like category, price, genre), and Users (user metadata like age group, membership tier). Interactions must include at minimum a USER_ID, ITEM_ID, and TIMESTAMP; other attributes like EVENT_TYPE (click, purchase, view) and EVENT_VALUE enrich the model.

A Recipe is Personalize's term for a pre-built ML algorithm template. Recipes are categorized: USER_PERSONALIZATION recipes (HRNN, HRNN-Coldstart, User-Personalization) recommend items to individual users based on their history; RELATED_ITEMS recipes (SIMS, Item-Attribute-Affinity) find items similar to a given item; USER_SEGMENTATION recipes (Item-Affinity, Item-Attribute-Affinity) create user segments based on item affinity. A Solution is a trained model produced by applying a Recipe to your datasets. Understanding this terminology — Dataset Group, Recipe, Solution, Campaign — is foundational for MLS-C01.`,
      quiz: [
        {
          question:
            "What is the most critical dataset type required for Amazon Personalize to generate user recommendations?",
          options: [
            "Items dataset — Personalize needs item metadata to understand what to recommend",
            "Users dataset — Personalize needs user profiles to understand preferences",
            "Interactions dataset — contains user-item interaction history (clicks, purchases) which is the primary signal for collaborative filtering",
            "All three datasets are equally required to train any Personalize model",
          ],
          correctIndex: 2,
          explanation:
            "The Interactions dataset is the most critical and the only required dataset in Amazon Personalize. It contains the user-item interaction history (clicks, purchases, views, ratings) that enables collaborative filtering. Items and Users datasets are optional but improve cold-start handling and recommendation diversity.",
        },
      ],
    },
    {
      heading: "User-Personalization Recipe and Cold Start",
      body: `The User-Personalization recipe is Personalize's primary recipe for generating personalized item recommendations for individual users. It uses a hierarchical recurrent neural network (HRNN) that models both short-term and long-term user interest. It includes built-in exploration for cold-start items — when new items are added to the catalog, Personalize automatically explores them with a configurable exploration weight, balancing exploitation of known good items with exploration of new items.

Cold start is a fundamental challenge in recommendation systems: new users have no interaction history (cold-start users) and new items have no interaction data (cold-start items). Personalize addresses cold-start users with metadata-based recommendations using the Users dataset and the HRNN-Metadata recipe. Cold-start items are addressed through the exploration mechanism in User-Personalization and the HRNN-Coldstart recipe. For the MLS-C01 exam, understand that cold-start is the key challenge Personalize is designed to handle through metadata and exploration.`,
      quiz: [
        {
          question:
            "An e-commerce platform launches 100 new products and wants Amazon Personalize to recommend them to users before any interaction data exists. Which mechanism handles this cold-start item problem?",
          options: [
            "Manually boost new items by assigning them higher weights in the Interactions dataset",
            "Use the Item-Attribute-Affinity recipe which can recommend items purely based on metadata",
            "User-Personalization's built-in exploration mechanism automatically presents new items with a configurable exploration weight",
            "Retrain the Solution from scratch after collecting initial interactions for the new items",
          ],
          correctIndex: 2,
          explanation:
            "User-Personalization has a built-in exploration mechanism specifically for cold-start items. It automatically recommends new items (with no or few interactions) according to a configurable exploration weight — balancing exploration of new items with exploitation of proven items without requiring retraining.",
        },
      ],
    },
    {
      heading: "Campaigns, Real-Time Events, and Batch Recommendations",
      body: `A Campaign deploys a trained Solution Version to a real-time HTTPS endpoint. Applications call the \`GetRecommendations\` API (for user-item recommendations) or \`GetPersonalizedRanking\` API (to rerank a provided list of items for a user) against the Campaign endpoint. Campaign provisioned throughput (minimum transactions per second) controls capacity and cost. Campaigns support automatic scaling based on actual traffic.

Real-time event tracking is a critical Personalize capability: as users interact with your application, you send events to a Personalize Event Tracker, which updates the user's interaction model in real time without requiring a full retraining cycle. This means recommendations adapt immediately to recent behavior — a user who just purchased a camera will immediately see camera accessories recommended rather than cameras. Batch inference jobs provide offline recommendations for all users in the dataset, written to S3, for use cases like email personalization or push notification campaigns where pre-computed recommendations are sufficient.`,
      quiz: [
        {
          question:
            "A streaming service uses Amazon Personalize for recommendations. When a user watches a new movie, they want the next recommendation to immediately reflect this new preference. What feature enables this?",
          options: [
            "Retrain the Solution Version after each viewing event",
            "Real-time event tracking — send the viewing event to a Personalize Event Tracker to update the model immediately",
            "Set a low campaign provisioned TPS to trigger frequent model updates",
            "Use the SIMS recipe which updates item similarity in real time",
          ],
          correctIndex: 1,
          explanation:
            "Personalize Event Trackers accept real-time user interaction events and immediately update the user's interaction model in the recommendation engine. This enables recommendations to reflect the most recent user behavior without retraining the Solution, which would take hours.",
        },
      ],
    },
    {
      heading: "Filtering and Business Rules",
      body: `Amazon Personalize supports filters that apply business rules to recommendations at inference time. Filters are defined using a domain-specific language that can exclude items based on metadata attributes (e.g., exclude out-of-stock items), exclude items the user has already purchased, filter by category (only recommend action movies), or filter by time constraints (only recommend current-year releases). Filters are applied server-side by Personalize before returning recommendations, removing the need for client-side filtering.

Dynamic filters accept runtime parameters — for example, a filter that excludes items in a specific category can accept the category as a parameter at inference time, enabling context-aware filtering without creating a separate filter per category. This is important for platforms where filtering context varies per request (different region, different age group, different subscription tier). Promotions allow boosting specific items in the recommendation list — for example, ensuring sponsored items appear in the top N positions while maintaining personalization quality for the remaining positions.`,
      quiz: [
        {
          question:
            "A music streaming service wants Personalize to never recommend songs the user has already added to their library. How should they implement this?",
          options: [
            "Remove listened songs from the Interactions dataset before each retraining",
            "Apply client-side filtering to remove known songs from recommendations after calling GetRecommendations",
            "Create a Personalize filter using the interaction history to exclude items the current user has already interacted with",
            "Use the SIMS recipe which automatically avoids recommending items similar to those already in the user's library",
          ],
          correctIndex: 2,
          explanation:
            "Personalize filters can exclude items based on the user's interaction history — for example, excluding items where the user has an 'added_to_library' event. Filters run server-side before returning recommendations, which is more efficient and reliable than client-side filtering.",
        },
      ],
    },
    {
      heading: "Personalize Metrics and Evaluation",
      body: `Amazon Personalize evaluates Solution quality using offline metrics computed by holding out a portion of interactions as a test set. Key metrics include coverage (what percentage of the catalog the model recommends across users), mean reciprocal rank (MRR, how highly ranked the first relevant item is), normalized discounted cumulative gain (NDCG, quality of ranking), and precision@K (fraction of top-K recommendations that are relevant). Higher is better for all these metrics.

Understanding these offline metrics is important for the MLS-C01 exam, but a critical insight is that offline metrics don't always predict real-world A/B test results. A model with higher NDCG may not actually produce higher clickthrough rate in production because offline test sets can't perfectly simulate real user behavior. For this reason, A/B testing Personalize campaigns and measuring business KPIs (clickthrough rate, conversion rate, session duration) before fully deploying a new model is a best practice for ML model evaluation on the exam and in practice.`,
      quiz: [
        {
          question:
            "Which Amazon Personalize metric measures the percentage of the total item catalog that appears in recommendations across all users — important for diversity and discovery?",
          options: [
            "NDCG — measures ranking quality of recommended items",
            "Precision@K — measures the fraction of top-K recommendations that are relevant",
            "Mean Reciprocal Rank — measures how highly ranked the first relevant item is",
            "Coverage — measures the fraction of the catalog recommended across all users",
          ],
          correctIndex: 3,
          explanation:
            "Coverage measures what percentage of the total item catalog the recommendation model surfaces across all users. Low coverage means the model recommends the same popular items repeatedly, missing long-tail discovery. Higher coverage indicates better catalog exploration and diversity.",
        },
      ],
    },
  ],

  keyFacts: [
    "Dataset Group contains three dataset types: Interactions (required), Items, Users",
    "Recipe = algorithm template: USER_PERSONALIZATION, RELATED_ITEMS, USER_SEGMENTATION categories",
    "User-Personalization is the primary recipe — HRNN with built-in cold-start exploration",
    "Cold start: new items are handled by exploration weight; new users by metadata-based recommendations",
    "Campaign = deployed Solution Version with a real-time GetRecommendations endpoint",
    "Event Tracker: sends real-time events to update user model without retraining",
    "Batch inference: pre-computed recommendations for all users written to S3",
    "Filters: business rules applied server-side — exclude out-of-stock, already-purchased, or wrong-category items",
    "Dynamic filters accept runtime parameters for context-aware filtering",
    "Offline metrics: coverage, NDCG, precision@K, MRR — always validate with A/B testing",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Lambda",
    "Amazon CloudWatch",
    "Amazon Kinesis",
    "Amazon SageMaker",
    "Amazon EventBridge",
  ],

  examTips: [
    "Interactions dataset is the ONLY required dataset — Items and Users are optional enhancements",
    "Recipe → Solution → Solution Version → Campaign is the workflow order",
    "Event Tracker = real-time interaction updates without retraining — enables immediate personalization",
    "User-Personalization's exploration handles cold-start items automatically via configurable weight",
    "Filters apply server-side business rules — more efficient than client-side post-processing",
    "Dynamic filters accept runtime parameters — one filter covers multiple context scenarios",
    "Offline metrics (NDCG, coverage) don't guarantee real-world performance — validate with A/B testing",
    "GetRecommendations = recommendations for a user; GetPersonalizedRanking = rerank a provided list",
  ],

  topicQuiz: [
    {
      question:
        "An e-commerce site uses Amazon Personalize with daily retraining. Between retraining cycles, users are making purchases. How can recommendations reflect these purchases immediately?",
      options: [
        "Increase retraining frequency to hourly",
        "Use real-time event tracking — send purchase events to a Personalize Event Tracker to update the model immediately",
        "Use a batch inference job that runs after each purchase",
        "Enable automatic campaign scaling to process events faster",
      ],
      correctIndex: 1,
      explanation:
        "Real-time event tracking via the Personalize Event Tracker updates user interaction models immediately when events are received. Recommendations adapt to recent behavior without waiting for the next retraining cycle, which could be hours or days away.",
    },
    {
      question:
        "A video streaming platform wants recommendations to only include content available in the user's subscription tier (Basic, Standard, Premium). How should they implement this?",
      options: [
        "Train separate Solutions for each subscription tier",
        "Apply client-side filtering after receiving recommendations from GetRecommendations",
        "Use a Personalize dynamic filter that accepts the subscription tier as a runtime parameter",
        "Add subscription tier as a feature in the Interactions dataset",
      ],
      correctIndex: 2,
      explanation:
        "A Personalize dynamic filter that accepts the subscription tier as a runtime parameter allows a single filter to enforce tier-based content access across all tiers. At inference time, you pass the user's tier, and Personalize filters out ineligible content server-side before returning recommendations.",
    },
  ],
};
