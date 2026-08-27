import { ServiceGuide } from "../../../types/guide";

export const lexGuide: ServiceGuide = {
  id: "aif-lex",
  service: "Amazon Lex",
  domain: "development",
  tagline: "Build conversational interfaces using voice and text",
  intro:
    "Amazon Lex is a fully managed service for building conversational AI chatbots and voice assistants, using the same deep learning technology that powers Amazon Alexa to understand natural language and manage conversational flows.",

  sections: [
    {
      heading: "Core Concepts: Bots, Intents, and Slots",
      body: `Lex models a conversation as a **bot** composed of **intents** and **slots**. An **intent** represents a goal a user wants to accomplish — "book a flight", "check account balance", "cancel an order". Each intent has **sample utterances**: example phrases a user might say to invoke that intent. Lex uses these utterances to train a natural language understanding (NLU) model that can recognize when a user is expressing a particular intent, even in phrasing not explicitly listed as a sample.

**Slots** are the pieces of information needed to fulfill an intent, analogous to function parameters. A "book flight" intent might require slots for departure city, destination city, departure date, and number of passengers. Lex manages the conversational loop of eliciting slot values: it asks for missing information, validates responses, re-prompts on invalid input, and confirms values before fulfillment. Each slot is associated with a **slot type** — either built-in (dates, times, numbers, cities, US states, email addresses) or custom (a list of your product names, order statuses, or any enumerated values). Slot types can use exact matches or fuzzy matching with synonyms.`,
      quiz: [
        {
          question:
            "In Amazon Lex, what term describes the goal a user wants to accomplish, such as 'book a flight' or 'check account balance'?",
          options: ["Slot", "Utterance", "Intent", "Fulfillment"],
          correctIndex: 2,
          explanation:
            "An intent represents the goal a user wants to accomplish. Slots are the required data pieces, utterances are sample phrases that trigger the intent, and fulfillment is the business logic that executes once slots are collected.",
        },
        {
          question:
            "A Lex bot needs to collect a departure city, destination city, and travel date before booking a flight. What are these data requirements called?",
          options: ["Intents", "Slots", "Utterances", "Contexts"],
          correctIndex: 1,
          explanation:
            "Slots are the pieces of information needed to fulfill an intent, analogous to function parameters. Lex manages the conversational loop of eliciting slot values from the user.",
        },
        {
          question:
            "Which built-in Lex slot type would you use to capture a user-supplied date such as 'next Friday'?",
          options: [
            "Custom slot type with date synonyms",
            "A built-in date slot type",
            "A fulfillment Lambda function",
            "An output context",
          ],
          correctIndex: 1,
          explanation:
            "Lex provides built-in slot types for dates, times, numbers, cities, US states, and email addresses — so you do not need to create a custom slot type for common data types like dates.",
        },
      ],
    },
    {
      heading: "Dialog Management and Fulfillment",
      body: `Lex handles dialog management automatically. Once all required slots for an intent are filled and validated, Lex triggers **fulfillment** — the actual business logic that processes the user's request. Fulfillment is typically implemented as a **Lambda function** that receives the intent name, slot values, and session attributes as a structured JSON event, performs the necessary operations (database queries, API calls, order processing), and returns a response that Lex delivers to the user.

The **dialog codehook** is a Lambda invocation that fires before fulfillment, after each user turn, allowing custom slot validation, dynamic slot elicitation, or mid-conversation branching based on business logic. For example, if a user specifies a travel date that is in the past, the dialog codehook can reject the slot value and prompt the user to re-enter a valid date.

Lex also supports **context**: you can define input contexts (a previous intent that must have been fulfilled for this intent to activate) and output contexts (attributes set after an intent completes that influence future intent routing). This enables multi-turn conversations where the completion of one intent naturally flows into related intents.`,
      quiz: [
        {
          question:
            "A Lex bot receives a travel date in the past and must reject it and re-prompt the user. Which Lambda hook should handle this per-turn validation?",
          options: [
            "Fulfillment Lambda",
            "Dialog codehook Lambda",
            "Input context handler",
            "Slot type validation Lambda",
          ],
          correctIndex: 1,
          explanation:
            "The dialog codehook fires after each user turn, before fulfillment, enabling custom slot validation, dynamic re-prompting, and mid-conversation branching based on business logic.",
        },
        {
          question:
            "When does the fulfillment Lambda in a Lex bot get invoked?",
          options: [
            "After every user message regardless of slot completion",
            "Before the dialog codehook on each turn",
            "Once all required slots are filled and validated",
            "Only when a DTMF input is detected",
          ],
          correctIndex: 2,
          explanation:
            "The fulfillment Lambda is triggered once all required slots for an intent are filled and validated. It executes the business logic (database queries, API calls) and returns a response to the user.",
        },
        {
          question:
            "In Amazon Lex, what feature allows a completed intent to influence which intents are available in the next conversational turn?",
          options: [
            "Slot fuzzy matching",
            "Output context",
            "Dialog codehook",
            "Session attribute override",
          ],
          correctIndex: 1,
          explanation:
            "Output contexts are attributes set after an intent completes that influence future intent routing. This enables multi-turn conversations where one intent naturally flows into related intents.",
        },
      ],
    },
    {
      heading: "Voice and Telephony Integration",
      body: `Lex supports both text and voice input. For voice, Lex performs **Automatic Speech Recognition (ASR)** to convert spoken audio into text, then applies NLU to the transcribed text. For responses, Lex can synthesize speech using **Amazon Polly** integration, converting text responses into natural-sounding audio. This bidirectional audio capability makes Lex suitable for phone-based Interactive Voice Response (IVR) systems.

**Amazon Lex V2 with Amazon Connect** is the primary telephony integration path. Amazon Connect is AWS's cloud contact center service, and Lex bots serve as the automated self-service layer that handles common inquiries — checking account status, resetting passwords, looking up order information — before routing to a human agent only when necessary. Lex captures the conversation context so the human agent receives a full summary without the caller repeating information.

The **streaming API** supports bidirectional audio streaming, enabling voice assistants with barge-in capability (the user can interrupt the bot mid-sentence), natural pause detection, and low-latency audio streaming suitable for telephony applications.`,
      quiz: [
        {
          question:
            "Which AWS service converts text bot responses into spoken audio for Lex voice interactions?",
          options: [
            "Amazon Transcribe",
            "Amazon Comprehend",
            "Amazon Polly",
            "Amazon Connect",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Polly integrates with Lex to convert text responses into natural-sounding audio. Transcribe does the reverse (speech-to-text), while Connect is the contact center platform.",
        },
        {
          question:
            "A company wants to deploy a Lex bot to handle common phone inquiries before routing to human agents. Which AWS service provides the cloud contact center integration?",
          options: [
            "Amazon Pinpoint",
            "Amazon Chime",
            "Amazon Connect",
            "Amazon SNS",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Connect is AWS's cloud contact center service and the primary telephony integration for Lex V2. Lex bots serve as the automated self-service layer, with Connect handling the routing to human agents.",
        },
        {
          question:
            "Which Lex API capability allows a user to interrupt the bot mid-sentence during a voice interaction?",
          options: [
            "DTMF input handling",
            "Streaming API with barge-in support",
            "Dialog codehook Lambda",
            "Output context routing",
          ],
          correctIndex: 1,
          explanation:
            "The Lex streaming API supports barge-in capability, allowing users to interrupt the bot mid-sentence. It also provides natural pause detection and low-latency audio streaming suitable for telephony.",
        },
      ],
    },
    {
      heading: "Multi-Language Support and DTMF",
      body: `Lex V2 supports multiple languages within a single bot. You define **locales** — each locale is a separate NLU model for a specific language and region (English US, Spanish US, French CA, German, Japanese, etc.). A single bot can serve users in multiple languages by detecting the session locale and routing to the appropriate intent/slot definitions. This simplifies multi-language deployments significantly compared to maintaining separate bots per language.

For telephony deployments, Lex supports **DTMF (dual-tone multi-frequency)** input — the touch-tone key presses from phone keypads. This is essential for IVR systems where some callers prefer pressing keys over speaking. Lex interprets key sequences as slot values, enabling hybrid voice/DTMF interactions.`,
      quiz: [
        {
          question:
            "In Lex V2, what term describes a language-specific NLU model configuration within a single bot that enables multi-language support?",
          options: ["Intent", "Slot type", "Locale", "Session context"],
          correctIndex: 2,
          explanation:
            "A locale in Lex V2 is a separate NLU model for a specific language and region. A single bot can contain multiple locales, enabling multi-language support without maintaining separate bots.",
        },
        {
          question:
            "What does DTMF stand for in the context of Lex telephony deployments?",
          options: [
            "Dynamic Text Matching Framework",
            "Dual-Tone Multi-Frequency",
            "Dialog Transfer Management Function",
            "Digital Telephony Modulation Format",
          ],
          correctIndex: 1,
          explanation:
            "DTMF stands for dual-tone multi-frequency — the signal produced by pressing touch-tone keys on a phone keypad. Lex supports DTMF input, allowing callers to press keys instead of speaking.",
        },
        {
          question:
            "How does Lex V2 simplify deploying a chatbot that must serve customers in English, Spanish, and French?",
          options: [
            "Automatic real-time translation between languages using Amazon Translate",
            "Multiple locales within a single bot, each with its own NLU model",
            "Separate bot instances that share a common fulfillment Lambda",
            "A global intent model that handles all languages simultaneously",
          ],
          correctIndex: 1,
          explanation:
            "Lex V2 supports multiple locales within a single bot. Each locale is a separate NLU model for a specific language, enabling multi-language deployments without maintaining completely separate bots.",
        },
      ],
    },
    {
      heading: "Integration and Deployment Channels",
      body: `Lex bots can be deployed across multiple channels. The **Lex Runtime API** (both streaming and non-streaming variants) allows any application to send user messages and receive bot responses programmatically. AWS provides first-party integrations with messaging platforms: **Slack**, **Facebook Messenger**, **Twilio SMS**, and **Amazon Connect** — these integrations handle the channel-specific protocol translation and media handling, so your bot code remains channel-agnostic.

For web and mobile applications, AWS Amplify includes a Lex UI component (Amplify Chatbot component) that renders a chat interface and manages the Lex session automatically. **AWS CloudFormation** and the **AWS CDK** support Lex bot definitions as infrastructure-as-code, enabling bot versioning and environment promotion (dev → staging → production) as part of a deployment pipeline.

Lex integrates with **Amazon Kendra** for FAQ-style question answering: if an utterance doesn't match any intent but might be a factual question, Lex can query a Kendra index and return the retrieved answer. This hybrid intent-plus-search architecture handles both task completion (intents) and open-ended questions (Kendra) in a single conversational experience.`,
      quiz: [
        {
          question:
            "A Lex bot must handle both 'book a flight' task completion AND open-ended factual questions like 'what are your baggage fees?' Which integration enables the FAQ fallback capability?",
          options: [
            "Amazon Comprehend entity detection",
            "Amazon Kendra",
            "AWS Lambda custom intent handler",
            "Amazon Translate auto-detection",
          ],
          correctIndex: 1,
          explanation:
            "Lex integrates with Amazon Kendra for FAQ-style question answering. When an utterance doesn't match any intent, Lex queries a Kendra index to answer the factual question, enabling a hybrid intent-plus-search architecture.",
        },
        {
          question:
            "Which of the following are first-party channel integrations supported by Amazon Lex? (Choose the most complete answer)",
          options: [
            "Slack and Microsoft Teams",
            "Slack, Facebook Messenger, Twilio SMS, and Amazon Connect",
            "Facebook Messenger and WhatsApp",
            "Amazon Connect and Zoom",
          ],
          correctIndex: 1,
          explanation:
            "Lex provides first-party integrations with Slack, Facebook Messenger, Twilio SMS, and Amazon Connect. These integrations handle protocol translation so bot code remains channel-agnostic.",
        },
        {
          question:
            "A developer wants to define a Lex bot configuration as code and promote it through dev, staging, and production environments. Which AWS tools support this?",
          options: [
            "AWS Config and Systems Manager",
            "AWS CloudFormation and the AWS CDK",
            "AWS CodeDeploy and Elastic Beanstalk",
            "Amazon EventBridge and Step Functions",
          ],
          correctIndex: 1,
          explanation:
            "AWS CloudFormation and the AWS CDK support Lex bot definitions as infrastructure-as-code, enabling bot versioning and environment promotion as part of a deployment pipeline.",
        },
      ],
    },
  ],

  keyFacts: [
    "Uses same ASR and NLU technology as Amazon Alexa",
    "Intents = user goals; Slots = required information pieces; Utterances = example phrases",
    "Dialog codehook Lambda fires on each turn for custom validation and branching",
    "Fulfillment Lambda executes business logic when all slots are filled",
    "Built-in slot types: dates, times, numbers, cities, US states, email addresses",
    "Lex V2 supports multiple languages (locales) within a single bot",
    "Integrates natively with Amazon Connect for cloud contact center IVR",
    "Supports DTMF (touch-tone) input for telephony deployments",
    "Can connect to Kendra for FAQ/question-answering fallback",
    "Channel integrations: Slack, Facebook Messenger, Twilio SMS, Amazon Connect",
  ],

  relatedServices: [
    "Amazon Polly",
    "Amazon Connect",
    "Amazon Kendra",
    "AWS Lambda",
    "Amazon Transcribe",
  ],

  examTips: [
    "Lex = intent-based NLU chatbot; Polly = text-to-speech; Transcribe = speech-to-text",
    "Dialog codehook runs on each turn; fulfillment codehook runs once when slots are all filled",
    "Lex V2 is the current version — supports multi-language locales in one bot",
    "Amazon Connect is the telephony/contact center integration for Lex voice bots",
    "Slots are validated by slot types — custom slot types for domain-specific values",
    "Lex + Kendra enables hybrid: task completion (intents) + open-ended Q&A (Kendra)",
    "Know the difference between ASR (audio to text) and NLU (text to intent/slots)",
  ],

  topicQuiz: [
    {
      question:
        "A Lex bot must collect a product name from a list of 50 proprietary SKUs not found in any built-in slot type. What should you use?",
      options: [
        "A built-in AMAZON.Product slot type",
        "A custom slot type with the SKUs as enumerated values",
        "A dialog codehook Lambda that validates any free-text input",
        "An output context that carries the SKU from a prior intent",
      ],
      correctIndex: 1,
      explanation:
        "Custom slot types are used for domain-specific values like proprietary product names or order statuses. You define the enumerated values and Lex trains to recognize them, with optional synonym matching.",
    },
    {
      question:
        "Which technology powers Amazon Lex's ability to understand natural language and is also used by Amazon Alexa?",
      options: [
        "Rule-based pattern matching",
        "Statistical phrase tables",
        "Deep learning ASR and NLU",
        "Deterministic finite automata",
      ],
      correctIndex: 2,
      explanation:
        "Amazon Lex uses the same deep learning ASR and NLU technology that powers Amazon Alexa, enabling it to understand natural language even when phrasing differs from the sample utterances.",
    },
    {
      question:
        "What happens in a Lex conversation when the dialog codehook Lambda returns a 'Failed' dialog action?",
      options: [
        "Lex immediately invokes the fulfillment Lambda",
        "Lex terminates the session and closes the conversation",
        "Lex re-prompts the user for the offending slot value",
        "Lex routes the conversation to Amazon Connect",
      ],
      correctIndex: 2,
      explanation:
        "When the dialog codehook returns a validation failure, Lex can re-prompt the user to correct the invalid slot value. This is the standard pattern for rejecting past dates, invalid selections, or business-rule violations.",
    },
    {
      question:
        "A call center bot handles English and Spanish callers. Using Lex V2, what is the most efficient deployment architecture?",
      options: [
        "Two separate Lex bots, one per language, behind an API Gateway router",
        "One Lex V2 bot with English and Spanish locales",
        "One bot with a custom Lambda that translates Spanish to English before sending to Lex",
        "Amazon Translate preprocessing all Spanish input before passing to a single-language Lex bot",
      ],
      correctIndex: 1,
      explanation:
        "Lex V2 supports multiple locales within a single bot. Each locale has its own NLU model for that language, which is far simpler than maintaining separate bots or adding translation middleware.",
    },
    {
      question:
        "Which Amazon Lex integration allows a caller to press '1' for account balance or '2' for payments instead of speaking?",
      options: [
        "Streaming barge-in API",
        "DTMF input support",
        "Custom slot type with numeric values",
        "Dialog codehook key-press detection",
      ],
      correctIndex: 1,
      explanation:
        "DTMF (dual-tone multi-frequency) support allows callers to press phone keypad keys as input. Lex interprets key sequences as slot values, enabling hybrid voice/DTMF IVR interactions.",
    },
    {
      question:
        "A developer is building a customer service bot. A user asks 'What are your store hours?' — a question that matches no intent. How can Lex answer it automatically?",
      options: [
        "Create a generic fallback intent with a hardcoded response",
        "Integrate Lex with Amazon Kendra to query an FAQ index",
        "Use a dialog codehook to perform a web search",
        "Enable DTMF and ask the user to press a key for FAQ",
      ],
      correctIndex: 1,
      explanation:
        "Lex integrates with Amazon Kendra so that when an utterance doesn't match any intent, Lex queries a Kendra FAQ index and returns the retrieved answer, handling open-ended factual questions automatically.",
    },
    {
      question:
        "In Amazon Lex, what is the difference between the dialog codehook and the fulfillment codehook?",
      options: [
        "Dialog codehook fires once when deployment completes; fulfillment codehook fires per turn",
        "Dialog codehook fires after each user turn for validation; fulfillment codehook fires once when all slots are filled",
        "Dialog codehook handles voice input; fulfillment codehook handles text input",
        "They are synonyms for the same Lambda invocation",
      ],
      correctIndex: 1,
      explanation:
        "The dialog codehook fires after each user turn for custom validation and branching. The fulfillment codehook fires once when all required slots are filled, executing the actual business logic of the intent.",
    },
    {
      question: "Amazon Polly's role in a Lex voice bot is to:",
      options: [
        "Transcribe the user's spoken audio into text for Lex to process",
        "Detect the user's intent from the transcribed text",
        "Convert Lex's text response into spoken audio delivered to the user",
        "Route the voice call to a human agent in Amazon Connect",
      ],
      correctIndex: 2,
      explanation:
        "Polly handles text-to-speech conversion: it takes Lex's text response and synthesizes natural-sounding audio for delivery to the user. Transcribe handles the opposite direction (speech-to-text for user input).",
    },
  ],
};
