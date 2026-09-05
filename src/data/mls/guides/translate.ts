import { ServiceGuide } from "../../../types/guide";

export const translateGuide: ServiceGuide = {
  id: "mls-translate",
  service: "Amazon Translate",
  domain: "services",
  tagline:
    "Neural machine translation service for real-time and batch language translation",
  intro:
    "Amazon Translate is a neural machine translation service that delivers fast, high-quality, and affordable language translation between 75+ languages. It supports real-time translation for user-facing applications and batch translation for large document corpora, with customization through custom terminology and parallel data for domain-specific translation quality.",

  sections: [
    {
      heading: "Neural Machine Translation and Language Support",
      body: `Amazon Translate uses deep learning neural machine translation (NMT) models trained on large multilingual corpora. NMT models produce more fluent, contextually accurate translations than older statistical phrase-based translation systems because they process the entire sentence context rather than substituting phrases. Translate supports 75+ languages and language variants (e.g., zh (Chinese Simplified) vs. zh-TW (Chinese Traditional)), and can auto-detect the source language using integrated language detection.

For ML pipelines, Translate is particularly valuable for creating multilingual training datasets from monolingual sources. If you have a labeled training dataset in English and need to serve users in 20 languages, Translate can produce training data translations that bootstrap models for those languages. Importantly, machine-translated training data introduces noise and should be validated or post-edited for high-quality ML training, especially for sentiment analysis or fine-grained NLP tasks where translation errors materially affect label accuracy.`,
      quiz: [
        {
          question:
            "An NLP team has 50,000 labeled English training examples and needs equivalent labeled data in Spanish and French for multilingual model training. What is the fastest approach?",
          options: [
            "Collect new training data natively in Spanish and French",
            "Use Amazon Translate to translate the English training examples to Spanish and French, creating multilingual training datasets",
            "Use Amazon Comprehend to detect the language and route examples to language-specific models",
            "Use Amazon Polly to convert text to speech in each language for audio model training",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Translate can batch-translate labeled English training examples to Spanish and French, rapidly creating multilingual training datasets. This approach bootstraps multilingual ML without native data collection. The translated data may need human validation for high-quality NLP tasks, but is a fast and scalable starting point.",
        },
      ],
    },
    {
      heading: "Real-Time and Batch Translation",
      body: `Amazon Translate offers two modes of operation. Real-time translation via the \`TranslateText\` API processes up to 10,000 bytes of text per request and returns the translated text immediately, with typical latencies of 100-500ms. This is appropriate for user-facing applications — translating support chat messages, rendering product descriptions in the user's language, or translating UI strings.

Batch translation jobs process large volumes of documents stored in S3, writing translations back to S3 asynchronously. Batch jobs support multiple input formats (plain text, HTML, Word documents, PowerPoint, Excel) and can translate millions of documents in parallel. For ML data preparation, batch translation is used to translate entire document collections — product catalogs, support ticket archives, legal document repositories — from one language to many target languages simultaneously. Batch jobs support parallel data customization for domain-specific terminology consistency.`,
      quiz: [
        {
          question:
            "A global e-commerce company needs to translate 5 million product descriptions stored in S3 from English to 10 target languages for ML training data. Which Translate feature should they use?",
          options: [
            "Call TranslateText in a Lambda loop for each product description",
            "Use a Translate batch translation job pointing to S3 input and output with multiple target languages",
            "Use Amazon Polly to convert the product descriptions to audio in each language",
            "Use Amazon Comprehend to detect the products and then translate their names",
          ],
          correctIndex: 1,
          explanation:
            "Translate batch translation jobs are designed for large-scale document translation. You specify S3 input/output, source language, target languages, and optional customization. The job processes documents in parallel and writes translations to S3 — far more efficient than looping over individual API calls.",
        },
      ],
    },
    {
      heading: "Custom Terminology for Domain-Specific Translation",
      body: `AWS Custom Terminology allows you to specify exact translations for domain-specific terms that should not be modified by the neural model. For example, a pharmaceutical company can ensure that the drug name "Humira" is always translated as "Humira" (not substituted with a generic description), or a technology company can ensure that "Cloud Formation" is translated literally rather than as "cloud formation" (the weather phenomenon). Custom terminology provides a lexicon of source terms and their required target-language translations.

Custom terminology is essential for ML applications where precise terminology affects downstream model quality. In a medical NLP pipeline, consistent drug name translation ensures entity recognition models trained on translated data encounter the same terminology they will see in production. Terminology files are uploaded as CSV or TMX format and applied to both real-time and batch translation requests by specifying the terminology ARN in the translation request.`,
      quiz: [
        {
          question:
            "A legal document processing company needs to ensure that specific Latin legal terms are always translated literally (not interpreted) across 20 language pairs. How should they configure Amazon Translate?",
          options: [
            "Use Translate with Profanity masking enabled to prevent interpretation of legal terms",
            "Create a Custom Terminology file mapping each Latin term to its literal translation in each target language",
            "Use Translate with Auto Language Detection disabled",
            "Train a custom Translate model using parallel data containing the legal terms",
          ],
          correctIndex: 1,
          explanation:
            "Custom Terminology provides exact translation mappings for specific terms that the neural model should not modify. This ensures domain-specific legal, medical, or technical terms are translated exactly as specified rather than being interpreted by the NMT model.",
        },
      ],
    },
    {
      heading: "Parallel Data and Active Custom Translation",
      body: `Parallel data is a customization mechanism that provides Translate with example sentence pairs (source and target) that show how your specific content should be translated. Unlike custom terminology (which controls individual terms), parallel data teaches Translate the style, tone, and domain conventions of your translations. For example, a customer service platform can provide examples of how support responses should be translated in formal vs. informal registers for different regional markets.

Parallel data is more powerful than custom terminology for adapting translation style, but requires more examples (hundreds to thousands of sentence pairs per language). When combined with custom terminology, parallel data customization produces translations that both use the correct terminology and match the desired tone and style. For ML, parallel data enables creating higher-quality translated training datasets that better reflect the domain-specific language patterns in production data.`,
      quiz: [
        {
          question:
            "A company finds that Amazon Translate produces technically correct translations of their marketing copy but the tone is too formal for their brand voice. What Translate customization feature addresses tone adaptation?",
          options: [
            "Custom Terminology — specify formal vs. informal variants for each term",
            "Parallel Data — provide example sentence pairs showing the desired informal tone and register",
            "Profanity Masking — it controls the formality level of translations",
            "Language Detection — detect formal vs. informal language in the source",
          ],
          correctIndex: 1,
          explanation:
            "Parallel Data teaches Amazon Translate the desired translation style by providing example sentence pairs in the source and target languages. Unlike custom terminology (which controls specific terms), parallel data adapts the overall tone, register, and style of translations to match your brand voice or domain conventions.",
        },
      ],
    },
    {
      heading: "Translate in the ML Data Pipeline",
      body: `Amazon Translate integrates with the broader AWS ML pipeline to enable multilingual data preparation and inference. A common pattern for multilingual ML is: user input text → Comprehend DetectDominantLanguage → Translate to English → English-language NLP model → Translate response back to user's language. This architecture enables a single English-trained model to serve global users without training separate models for each language.

For multilingual training data creation, the pipeline is: English labeled dataset → S3 → Translate batch job → translated datasets in 10 languages → SageMaker training jobs for each language model. Translate's API is integrated with Lambda for real-time pipelines and with Glue for batch data preparation. Understanding where Translate fits in the end-to-end ML pipeline — as both a data preparation tool and a runtime inference component for multilingual applications — is key for the MLS-C01 exam.`,
      quiz: [
        {
          question:
            "A company has an English-only sentiment analysis model. Users submit reviews in 25 languages. What is the most efficient architecture for multilingual sentiment analysis?",
          options: [
            "Train 25 separate sentiment models, one for each language",
            "Use Amazon Comprehend which natively handles 25 languages without translation",
            "Translate user input to English → apply the existing English sentiment model → return results",
            "Use Amazon Comprehend to detect language, then route to a language-specific endpoint",
          ],
          correctIndex: 2,
          explanation:
            "Translating user input to English and applying a single English-trained model is more cost-efficient than training 25 separate models. Comprehend natively handles some languages, but for custom ML models, the translate-then-infer pattern maximizes model reuse. Translate + single model is the standard pattern for multilingual inference in AWS.",
        },
      ],
    },
  ],

  keyFacts: [
    "75+ languages and language variants supported — source language can be auto-detected",
    "NMT (Neural Machine Translation) produces more fluent, contextual translations than phrase-based MT",
    "Real-time: TranslateText API, up to 10,000 bytes — 100-500ms latency for user-facing applications",
    "Batch: S3 input → translated documents in S3 — supports HTML, Word, PowerPoint, Excel, plain text",
    "Custom Terminology: exact term translations that override the neural model — CSVor TMX format",
    "Parallel Data: sentence-pair examples that adapt translation style, tone, and register",
    "Translate → English → single model is the multilingual inference pattern for custom ML models",
    "Batch jobs support multiple target languages simultaneously in a single job",
    "Machine-translated training data introduces noise — validate for high-quality NLP tasks",
    "HIPAA eligible and PCI compliant — suitable for regulated multilingual document processing",
  ],

  relatedServices: [
    "Amazon Comprehend",
    "Amazon Polly",
    "Amazon Transcribe",
    "Amazon S3",
    "AWS Lambda",
    "Amazon SageMaker",
  ],

  examTips: [
    "Custom Terminology = exact term mappings for proper nouns, brand names, domain jargon",
    "Parallel Data = style/tone/register adaptation through example sentence pairs",
    "Translate-then-infer: translate to English → single model = most efficient multilingual inference pattern",
    "Batch translation for large datasets; TranslateText API for real-time user-facing translation",
    "Machine-translated training data needs validation for high-stakes NLP models",
    "Comprehend DetectDominantLanguage feeds into Translate for automatic language routing",
    "Custom Terminology is applied to both real-time and batch translation by specifying its ARN",
    "Translate is a building block — it sits between user input and NLP models in multilingual pipelines",
  ],

  topicQuiz: [
    {
      question:
        "What is the key difference between Amazon Translate Custom Terminology and Parallel Data?",
      options: [
        "Custom Terminology is for batch translation; Parallel Data is for real-time translation only",
        "Custom Terminology specifies exact translations for specific terms; Parallel Data adapts overall translation style and tone through example sentence pairs",
        "Custom Terminology uses CSV format; Parallel Data requires XML — they are functionally equivalent",
        "Custom Terminology supports 10 languages; Parallel Data supports all 75+ Translate languages",
      ],
      correctIndex: 1,
      explanation:
        "Custom Terminology provides exact mappings for specific terms (proper nouns, brand names, technical jargon) that override the neural model's choices. Parallel Data provides example sentence pairs that teach the model the desired translation style, tone, and domain conventions at a sentence level — more powerful for style adaptation but requiring more examples.",
    },
    {
      question:
        "A developer wants to build a customer support chatbot that accepts messages in any of 50 languages and responds using a single English NLP model. What is the correct architecture?",
      options: [
        "Train 50 language-specific NLP models and route based on detected language",
        "Use Amazon Comprehend's multilingual support which covers all 50 languages natively",
        "Detect source language with Comprehend → Translate input to English → NLP model → Translate response back to source language",
        "Use Amazon Lex which natively handles multilingual input without translation",
      ],
      correctIndex: 2,
      explanation:
        "The translate-infer-translate pattern: detect source language (Comprehend), translate to English (Translate), apply the English NLP/chatbot model, translate response back to source language (Translate). This maximizes reuse of a single trained model across all 50 languages without training language-specific models.",
    },
  ],
};
