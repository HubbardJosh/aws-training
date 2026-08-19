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
    },
    {
      heading: "Core Concepts: Datasets, Recipes, and Campaigns",
      body: `Personalize organizes everything into a **Dataset Group** — a container for all the data and models related to a single personalization use case. Within a Dataset Group, you create **Datasets** of three types: **Interactions** (the core dataset — records of user-item interactions with timestamps, event types like "click", "purchase", "watch"), **Items** (optional catalog metadata — item ID, category, price, genre, tags), and **Users** (optional user metadata — user ID, age, location, membership tier).

A **Recipe** is a pre-built algorithm template for a specific recommendation task. Recipes include \`aws-user-personalization\` (personalized rankings for a specific user), \`aws-similar-items\` (items similar to a given item), \`aws-personalized-ranking\` (reranking a provided list by user affinity), \`aws-popularity-count\` (non-personalized popularity baseline), and \`aws-trending-now\` (recently trending items). Each recipe is optimized for a different recommendation scenario.

A **Solution** trains a recommendation model by applying a Recipe to your data. Training produces a **Solution Version** (a trained model artifact). When you're satisfied with a Solution Version's metrics, you create a **Campaign** — a hosted, low-latency recommendation endpoint that serves real-time recommendations for your users.`,
    },
    {
      heading: "Real-Time Events and User Context",
      body: `Personalization systems need to adapt rapidly to new user behavior. If a user just clicked on jazz albums, the recommendation engine should immediately understand this new signal and adjust recommendations — not wait until the next daily batch retraining cycle. Personalize handles this through **real-time event ingestion** via the \`PutEvents\` API.

As users interact with your application, you call \`PutEvents\` with each interaction event (the user ID, item ID, event type, and timestamp). Personalize ingests these events and incorporates them into real-time recommendations without waiting for a full model retraining. This means recommendations improve continuously throughout a session based on fresh signals.

**Contextual metadata** further refines recommendations by incorporating request-time context: what device the user is on, what time of day it is, what their current location is. By passing this context in the \`GetRecommendations\` call, the model can learn that users request action movies on weekend evenings on their TVs but watch cooking videos on weekday mornings on mobile — and serve contextually appropriate recommendations.`,
    },
    {
      heading: "Inference APIs",
      body: `Personalize exposes several inference APIs depending on the recommendation task. \`GetRecommendations\` takes a user ID (for user-personalization) or an item ID (for similar-items) and returns a ranked list of item recommendations. For scenarios where you have a pre-selected list that needs to be reranked by personal affinity (search results, editorial curated lists, promotional catalogs), \`GetPersonalizedRanking\` accepts a user ID and a list of items and returns them reordered by predicted relevance to that specific user.

**Batch recommendations** are available for offline scoring — instead of real-time API calls, you provide an input JSON file in S3 listing user IDs or item IDs, submit a batch inference job, and Personalize writes recommendation lists for each user or item back to S3. This is useful for pre-computing recommendation lists, populating email personalization, or feeding downstream batch analytics.`,
    },
    {
      heading: "Filters, Promotions, and Cold Start",
      body: `In real recommendation systems, you often need to exclude certain items from results: out-of-stock products, items the user has already purchased, content the user has already watched, or items outside the user's subscription tier. Personalize **Filters** define exclusion rules using a filter expression language — for example, \`EXCLUDE itemId WHERE Items.CATEGORY IN ("adult")\` or \`EXCLUDE itemId WHERE Interactions.event_type = "purchase"\`. Filters are applied at inference time and dynamically respect your item catalog state.

**Promotions** allow you to boost certain items into recommendations — for example, ensuring that at least 2 of the top 10 recommendations are from a sponsored brand or a seasonal promotional category. Promotions define a minimum count and a filter expression identifying eligible items.

The **cold start problem** is a fundamental challenge in recommendation systems: how do you recommend items that have no interaction history (new items) or for users who have no interaction history (new users)? Personalize addresses new users by falling back to popularity-based recommendations until sufficient interaction data accumulates. For new items, Personalize supports **item exploration** — deliberately recommending some new items to gather data — and the \`aws-user-personalization\` recipe includes automatic item exploration with a configurable exploration rate.`,
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
};
