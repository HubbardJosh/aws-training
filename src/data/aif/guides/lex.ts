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
    },
    {
      heading: "Dialog Management and Fulfillment",
      body: `Lex handles dialog management automatically. Once all required slots for an intent are filled and validated, Lex triggers **fulfillment** — the actual business logic that processes the user's request. Fulfillment is typically implemented as a **Lambda function** that receives the intent name, slot values, and session attributes as a structured JSON event, performs the necessary operations (database queries, API calls, order processing), and returns a response that Lex delivers to the user.

The **dialog codehook** is a Lambda invocation that fires before fulfillment, after each user turn, allowing custom slot validation, dynamic slot elicitation, or mid-conversation branching based on business logic. For example, if a user specifies a travel date that is in the past, the dialog codehook can reject the slot value and prompt the user to re-enter a valid date.

Lex also supports **context**: you can define input contexts (a previous intent that must have been fulfilled for this intent to activate) and output contexts (attributes set after an intent completes that influence future intent routing). This enables multi-turn conversations where the completion of one intent naturally flows into related intents.`,
    },
    {
      heading: "Voice and Telephony Integration",
      body: `Lex supports both text and voice input. For voice, Lex performs **Automatic Speech Recognition (ASR)** to convert spoken audio into text, then applies NLU to the transcribed text. For responses, Lex can synthesize speech using **Amazon Polly** integration, converting text responses into natural-sounding audio. This bidirectional audio capability makes Lex suitable for phone-based Interactive Voice Response (IVR) systems.

**Amazon Lex V2 with Amazon Connect** is the primary telephony integration path. Amazon Connect is AWS's cloud contact center service, and Lex bots serve as the automated self-service layer that handles common inquiries — checking account status, resetting passwords, looking up order information — before routing to a human agent only when necessary. Lex captures the conversation context so the human agent receives a full summary without the caller repeating information.

The **streaming API** supports bidirectional audio streaming, enabling voice assistants with barge-in capability (the user can interrupt the bot mid-sentence), natural pause detection, and low-latency audio streaming suitable for telephony applications.`,
    },
    {
      heading: "Multi-Language Support and DTMF",
      body: `Lex V2 supports multiple languages within a single bot. You define **locales** — each locale is a separate NLU model for a specific language and region (English US, Spanish US, French CA, German, Japanese, etc.). A single bot can serve users in multiple languages by detecting the session locale and routing to the appropriate intent/slot definitions. This simplifies multi-language deployments significantly compared to maintaining separate bots per language.

For telephony deployments, Lex supports **DTMF (dual-tone multi-frequency)** input — the touch-tone key presses from phone keypads. This is essential for IVR systems where some callers prefer pressing keys over speaking. Lex interprets key sequences as slot values, enabling hybrid voice/DTMF interactions.`,
    },
    {
      heading: "Integration and Deployment Channels",
      body: `Lex bots can be deployed across multiple channels. The **Lex Runtime API** (both streaming and non-streaming variants) allows any application to send user messages and receive bot responses programmatically. AWS provides first-party integrations with messaging platforms: **Slack**, **Facebook Messenger**, **Twilio SMS**, and **Amazon Connect** — these integrations handle the channel-specific protocol translation and media handling, so your bot code remains channel-agnostic.

For web and mobile applications, AWS Amplify includes a Lex UI component (Amplify Chatbot component) that renders a chat interface and manages the Lex session automatically. **AWS CloudFormation** and the **AWS CDK** support Lex bot definitions as infrastructure-as-code, enabling bot versioning and environment promotion (dev → staging → production) as part of a deployment pipeline.

Lex integrates with **Amazon Kendra** for FAQ-style question answering: if an utterance doesn't match any intent but might be a factual question, Lex can query a Kendra index and return the retrieved answer. This hybrid intent-plus-search architecture handles both task completion (intents) and open-ended questions (Kendra) in a single conversational experience.`,
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
};
