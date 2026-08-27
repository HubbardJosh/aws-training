import { ServiceGuide } from "../../../types/guide";

export const personalizeGuide: ServiceGuide = {
  id: "aif-personalize",
  service: "Amazon Personalize",
  domain: "development",
  tagline: "Real-time personalization and recommendations using ML",
  intro:
    "Amazon Personalize is a fully managed ML service that enables developers to add personalization and recommendation capabilities to their applications using the same technology powering Amazon.com recommendations — without requiring ML expertise.",

  sections: [
    {
      heading: "What Personalization Is and Why It Matters",
      body: `Personalization is the process of tailoring content, product recommendations, or experiences to individual users based on their behavior, preferences, and context. The difference between a generic "Top Products" list and a genuinely personalized recommendation engine is the difference between an impersonal catalog and a knowledgeable advisor who knows your taste. Amazon famously built personalization into its core strategy, and studies consistently show that personalized recommendations drive significantly higher engagement, conversion, and customer lifetime value.

Building a recommendation engine from scratch requires expertise in collaborative filtering, matrix factorization, deep learning, real-time feature engineering, and low-latency serving infrastructure — a multi-year investment for most engineering teams. Personalize packages this expertise into a managed service: you provide your interaction data (user events), optional item metadata, and optional user metadata, and Personalize trains recommendation models and serves personalized results through a low-latency API.`,
      quiz: [
        {
          question:
            "Which type of data is required to use Amazon Personalize, and cannot be omitted?",
          options: [
            "Items dataset containing catalog metadata",
            "Users dataset containing demographic information",
            "Interactions dataset containing user-item events",
            "Context dataset containing device and time signals",
          ],
          correctIndex: 2,
          explanation:
            "The Interactions dataset is the only required dataset in Amazon Personalize. It records user-item interaction events (clicks, purchases, watches) with timestamps. Items and Users datasets are optional enrichments.",
        },
        {
          question:
            "What is the primary business reason organizations use Amazon Personalize instead of building a recommendation engine from scratch?",
          options: [
            "Personalize automatically sources product catalog data from Amazon.com",
            "It packages ML expertise (collaborative filtering, deep learning, low-latency serving) into a managed service, avoiding a multi-year engineering investment",
            "Personalize provides pre-built user profiles based on public social media data",
            "It guarantees higher revenue than any custom-built recommendation system",
          ],
          correctIndex: 1,
          explanation:
            "The key value proposition is that Personalize packages complex ML expertise — collaborative filtering, matrix factorization, deep learning, real-time feature engineering, and low-latency serving — into a managed service that does not require ML expertise to operate.",
        },
      ],
    },
    {
      heading: "Core Concepts: Datasets, Recipes, and Campaigns",
      body: `Personalize organizes everything into a **Dataset Group** — a container for all the data and models related to a single personalization use case. Within a Dataset Group, you create **Datasets** of three types: **Interactions** (the core dataset — records of user-item interactions with timestamps, event types like "click", "purchase", "watch"), **Items** (optional catalog metadata — item ID, category, price, genre, tags), and **Users** (optional user metadata — user ID, age, location, membership tier).

A **Recipe** is a pre-built algorithm template for a specific recommendation task. Recipes include \`aws-user-personalization\` (personalized rankings for a specific user), \`aws-similar-items\` (items similar to a given item), \`aws-personalized-ranking\` (reranking a provided list by user affinity), \`aws-popularity-count\` (non-personalized popularity baseline), and \`aws-trending-now\` (recently trending items). Each recipe is optimized for a different recommendation scenario.

A **Solution** trains a recommendation model by applying a Recipe to your data. Training produces a **Solution Version** (a trained model artifact). When you're satisfied with a Solution Version's metrics, you create a **Campaign** — a hosted, low-latency recommendation endpoint that serves real-time recommendations for your users.`,
      quiz: [
        {
          question: "In Amazon Personalize, what is a Campaign?",
          options: [
            "A batch job that pre-computes recommendation lists and stores them in S3",
            "A marketing automation workflow that sends personalized emails to users",
            "A hosted, low-latency recommendation endpoint that serves real-time recommendations",
            "A set of filter expressions that exclude certain items from results",
          ],
          correctIndex: 2,
          explanation:
            "A Campaign is the real-time serving endpoint in Amazon Personalize. It is created from a trained Solution Version and exposes a low-latency API for getting recommendations. Batch inference jobs are a separate mechanism for offline scoring.",
        },
        {
          question:
            "Which Amazon Personalize recipe would you use to rerank a pre-selected list of items by how relevant they are to a specific user?",
          options: [
            "aws-user-personalization",
            "aws-similar-items",
            "aws-personalized-ranking",
            "aws-popularity-count",
          ],
          correctIndex: 2,
          explanation:
            "aws-personalized-ranking accepts a user ID and a provided list of items, then returns them reordered by predicted relevance to that specific user. This is ideal for reranking search results or editorial curated lists.",
        },
        {
          question:
            "What is the correct hierarchy of Personalize artifacts, from broadest to most specific?",
          options: [
            "Campaign → Solution → Solution Version → Recipe",
            "Dataset Group → Recipe → Solution → Solution Version → Campaign",
            "Recipe → Dataset Group → Solution → Campaign",
            "Solution Version → Solution → Dataset Group → Campaign",
          ],
          correctIndex: 1,
          explanation:
            "The hierarchy is: Dataset Group (container) → Recipe (algorithm template) applied during training → Solution (trained model) → Solution Version (specific artifact) → Campaign (serving endpoint).",
        },
      ],
    },
    {
      heading: "Real-Time Events and User Context",
      body: `Personalization systems need to adapt rapidly to new user behavior. If a user just clicked on jazz albums, the recommendation engine should immediately understand this new signal and adjust recommendations — not wait until the next daily batch retraining cycle. Personalize handles this through **real-time event ingestion** via the \`PutEvents\` API.

As users interact with your application, you call \`PutEvents\` with each interaction event (the user ID, item ID, event type, and timestamp). Personalize ingests these events and incorporates them into real-time recommendations without waiting for a full model retraining. This means recommendations improve continuously throughout a session based on fresh signals.

**Contextual metadata** further refines recommendations by incorporating request-time context: what device the user is on, what time of day it is, what their current location is. By passing this context in the \`GetRecommendations\` call, the model can learn that users request action movies on weekend evenings on their TVs but watch cooking videos on weekday mornings on mobile — and serve contextually appropriate recommendations.`,
      quiz: [
        {
          question:
            "Which API do you call to stream real-time interaction events into Amazon Personalize so recommendations update immediately without full retraining?",
          options: [
            "GetRecommendations",
            "PutEvents",
            "CreateDatasetImportJob",
            "UpdateSolution",
          ],
          correctIndex: 1,
          explanation:
            "PutEvents is the real-time event ingestion API. It accepts individual interaction events (user ID, item ID, event type, timestamp) and Personalize incorporates them into recommendations immediately without waiting for a full model retraining cycle.",
        },
        {
          question:
            "How does contextual metadata improve Amazon Personalize recommendations?",
          options: [
            "It replaces the Interactions dataset, reducing data collection requirements",
            "It is passed at request time in GetRecommendations, allowing the model to serve context-aware recommendations based on device, time, or location",
            "It automatically filters out items that are unavailable in the user's geographic region",
            "It enables the model to predict future user behavior using historical context windows",
          ],
          correctIndex: 1,
          explanation:
            "Contextual metadata (device type, time of day, location) is passed in the GetRecommendations API call at request time. The model learns context-specific patterns — for example, different recommendations for mobile vs TV or morning vs evening — and applies them in real time.",
        },
      ],
    },
    {
      heading: "Inference APIs",
      body: `Personalize exposes several inference APIs depending on the recommendation task. \`GetRecommendations\` takes a user ID (for user-personalization) or an item ID (for similar-items) and returns a ranked list of item recommendations. For scenarios where you have a pre-selected list that needs to be reranked by personal affinity (search results, editorial curated lists, promotional catalogs), \`GetPersonalizedRanking\` accepts a user ID and a list of items and returns them reordered by predicted relevance to that specific user.

**Batch recommendations** are available for offline scoring — instead of real-time API calls, you provide an input JSON file in S3 listing user IDs or item IDs, submit a batch inference job, and Personalize writes recommendation lists for each user or item back to S3. This is useful for pre-computing recommendation lists, populating email personalization, or feeding downstream batch analytics.`,
      quiz: [
        {
          question:
            "You need to pre-compute personalized email recommendation lists for 2 million users nightly. Which Amazon Personalize feature should you use?",
          options: [
            "GetRecommendations called in parallel for each user",
            "Batch inference jobs that read user IDs from S3 and write results back to S3",
            "PutEvents with a scheduled batch of user interaction events",
            "A Campaign endpoint called from a scheduled Lambda function",
          ],
          correctIndex: 1,
          explanation:
            "Batch inference jobs are purpose-built for offline, large-scale scoring. You provide an S3 input file of user IDs, submit the job, and Personalize writes recommendation lists for every user back to S3 — ideal for email personalization and other pre-computed use cases.",
        },
        {
          question:
            "What is the difference between GetRecommendations and GetPersonalizedRanking in Amazon Personalize?",
          options: [
            "GetRecommendations is synchronous; GetPersonalizedRanking is asynchronous",
            "GetRecommendations generates a list of items for a user; GetPersonalizedRanking reorders a provided list by that user's affinity",
            "GetRecommendations requires a Campaign; GetPersonalizedRanking uses batch inference only",
            "GetRecommendations uses the aws-similar-items recipe; GetPersonalizedRanking uses aws-user-personalization",
          ],
          correctIndex: 1,
          explanation:
            "GetRecommendations generates a ranked item list from scratch for a user or item. GetPersonalizedRanking takes a pre-selected list you provide (e.g., search results) and reorders it by the specific user's predicted affinity — useful when the candidate set is already constrained.",
        },
      ],
    },
    {
      heading: "Filters, Promotions, and Cold Start",
      body: `In real recommendation systems, you often need to exclude certain items from results: out-of-stock products, items the user has already purchased, content the user has already watched, or items outside the user's subscription tier. Personalize **Filters** define exclusion rules using a filter expression language — for example, \`EXCLUDE itemId WHERE Items.CATEGORY IN ("adult")\` or \`EXCLUDE itemId WHERE Interactions.event_type = "purchase"\`. Filters are applied at inference time and dynamically respect your item catalog state.

**Promotions** allow you to boost certain items into recommendations — for example, ensuring that at least 2 of the top 10 recommendations are from a sponsored brand or a seasonal promotional category. Promotions define a minimum count and a filter expression identifying eligible items.

The **cold start problem** is a fundamental challenge in recommendation systems: how do you recommend items that have no interaction history (new items) or for users who have no interaction history (new users)? Personalize addresses new users by falling back to popularity-based recommendations until sufficient interaction data accumulates. For new items, Personalize supports **item exploration** — deliberately recommending some new items to gather data — and the \`aws-user-personalization\` recipe includes automatic item exploration with a configurable exploration rate.`,
      quiz: [
        {
          question:
            "How does Amazon Personalize handle new users who have no interaction history (the cold start problem)?",
          options: [
            "It refuses to generate recommendations until at least 10 interactions are recorded",
            "It falls back to popularity-based recommendations until sufficient interaction data accumulates",
            "It uses demographic data from the Users dataset to infer preferences immediately",
            "It applies the aws-trending-now recipe automatically for all new users",
          ],
          correctIndex: 1,
          explanation:
            "For new users (cold start), Personalize falls back to popularity-based recommendations until enough interaction events are recorded to personalize results. For new items, item exploration deliberately surfaces them to gather interaction data.",
        },
        {
          question:
            "You want to ensure that items a user has already purchased never appear in their recommendations. Which Amazon Personalize feature should you use?",
          options: [
            "Promotions with a negative boost weight",
            "Filters with an EXCLUDE expression based on the purchase event type",
            "Custom item metadata that flags purchased items",
            "A post-processing Lambda that removes purchased items from GetRecommendations results",
          ],
          correctIndex: 1,
          explanation:
            "Filters are the correct tool. You define a filter expression such as EXCLUDE itemId WHERE Interactions.event_type = 'purchase', and Personalize applies it at inference time to remove already-purchased items from recommendation results.",
        },
      ],
    },
  ],

  keyFacts: [
    "Managed ML service for personalized product and content recommendations",
    "Three dataset types: Interactions (required), Items (optional), Users (optional)",
    "Recipes are algorithm templates: user-personalization, similar-items, personalized-ranking",
    "Solution = trained model; Solution Version = specific trained artifact; Campaign = serving endpoint",
    "PutEvents enables real-time event ingestion for immediate recommendation updates",
    "GetRecommendations and GetPersonalizedRanking are the primary inference APIs",
    "Filters exclude items from results using expression-based rules",
    "Promotions boost specific items into recommendation results",
    "Cold start: new users get popularity-based fallback; new items can be explored",
    "Batch inference jobs pre-compute recommendations for large user/item sets",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Lambda",
    "Amazon EventBridge",
    "Amazon CloudWatch",
    "Amazon Kinesis Data Streams",
  ],

  examTips: [
    "Personalize uses your interaction data — not generic Amazon.com data",
    "PutEvents is for real-time event streaming; batch import is for historical data loading",
    "Campaign = the real-time inference endpoint to call for recommendations",
    "Filters use expression syntax to exclude items at inference time",
    "aws-user-personalization is the most common recipe for personalized user recommendations",
    "Cold start handling: popularity fallback for new users, exploration for new items",
    "Contextual metadata in GetRecommendations enables context-aware personalization",
  ],

  topicQuiz: [
    {
      question:
        "A media streaming company wants to recommend shows to users based on their watch history. Which Amazon Personalize recipe is MOST appropriate?",
      options: [
        "aws-popularity-count",
        "aws-similar-items",
        "aws-user-personalization",
        "aws-trending-now",
      ],
      correctIndex: 2,
      explanation:
        "aws-user-personalization is the primary recipe for generating personalized recommendations for a specific user based on their interaction history. It is the most common recipe for this use case and includes automatic item exploration for new content.",
    },
    {
      question:
        "What is the purpose of the Dataset Group in Amazon Personalize?",
      options: [
        "It is the trained model artifact that gets deployed to a Campaign",
        "It is a container that holds all datasets, solutions, and campaigns for a single personalization use case",
        "It is the API endpoint for serving real-time recommendations",
        "It is the algorithm template that defines how recommendations are computed",
      ],
      correctIndex: 1,
      explanation:
        "A Dataset Group is the top-level container in Amazon Personalize. It holds all the Datasets (Interactions, Items, Users), Solutions, Solution Versions, and Campaigns for one personalization use case, keeping resources logically isolated.",
    },
    {
      question:
        "You want to guarantee that at least 3 of the top 10 recommendations returned for each user are from a new sponsored product category. Which Amazon Personalize feature enables this?",
      options: [
        "Filters with an INCLUDE expression for the sponsored category",
        "Promotions, which define a minimum item count from a filter-identified eligible set",
        "Custom Terminology overrides applied at inference time",
        "Item exploration with the exploration rate set to 30%",
      ],
      correctIndex: 1,
      explanation:
        "Promotions allow you to guarantee a minimum number of items from a specific set (identified by a filter expression) appear in recommendation results. This is the correct mechanism for boosting sponsored or promotional items into results.",
    },
    {
      question:
        "Which statement correctly describes the relationship between a Solution and a Campaign in Amazon Personalize?",
      options: [
        "A Campaign contains multiple Solutions and selects the best one automatically",
        "A Solution is the algorithm template; a Campaign is the trained model",
        "A Solution is trained from a Recipe and produces a Solution Version; a Campaign deploys a Solution Version as a live endpoint",
        "A Campaign trains new Solution Versions automatically when new interaction data arrives",
      ],
      correctIndex: 2,
      explanation:
        "A Solution trains a model by applying a Recipe to your data, producing a Solution Version (the artifact). A Campaign deploys a specific Solution Version as a low-latency HTTPS endpoint for real-time inference.",
    },
    {
      question:
        "A developer wants to personalize search results by reordering them based on each user's preferences. Which API should they call?",
      options: [
        "GetRecommendations with the user ID and an item filter",
        "GetPersonalizedRanking with the user ID and the pre-selected list of search result items",
        "PutEvents with the search query as a contextual metadata field",
        "StartBatchInferenceJob with the search index as the input source",
      ],
      correctIndex: 1,
      explanation:
        "GetPersonalizedRanking is designed exactly for this use case. You pass a user ID and your pre-selected candidate list (e.g., search results), and Personalize returns them reordered by the user's predicted affinity.",
    },
    {
      question:
        "How does Amazon Personalize differ from simply hardcoding popular items into a recommendation section?",
      options: [
        "Personalize always returns the same top items for all users, but updates them daily",
        "Personalize uses each individual user's interaction history to produce personalized rankings, rather than a single global popularity list",
        "Personalize sources recommendations from Amazon.com's catalog rather than your own data",
        "Personalize requires users to explicitly rate items before generating recommendations",
      ],
      correctIndex: 1,
      explanation:
        "The core value of Personalize is individual personalization — each user receives recommendations tailored to their own interaction history. The aws-popularity-count recipe does provide non-personalized popularity, but the main recipes (aws-user-personalization, aws-personalized-ranking) are user-specific.",
    },
    {
      question:
        "Which dataset type in Amazon Personalize would you use to store attributes like item category, price, and genre?",
      options: [
        "Interactions dataset",
        "Context dataset",
        "Items dataset",
        "Features dataset",
      ],
      correctIndex: 2,
      explanation:
        "The Items dataset stores catalog metadata such as item ID, category, price, genre, and tags. This optional dataset enriches recommendations by providing additional item attributes that the model can use alongside interaction signals.",
    },
    {
      question:
        "An e-commerce site imports historical purchase data into Amazon Personalize and also calls PutEvents as users browse. What is the purpose of each approach?",
      options: [
        "Historical import sets the model's exploration rate; PutEvents configures item filters",
        "Historical import loads training data for model training; PutEvents streams real-time signals that update recommendations immediately during active sessions",
        "Both do the same thing — PutEvents is just a faster version of batch import",
        "Historical import is required for Campaigns; PutEvents is only used for batch inference jobs",
      ],
      correctIndex: 1,
      explanation:
        "Batch import via CreateDatasetImportJob loads historical interaction data to train the model. PutEvents streams real-time interaction events that Personalize incorporates immediately into recommendations without retraining — enabling session-level personalization.",
    },
  ],
};
