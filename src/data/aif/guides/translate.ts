import { ServiceGuide } from "../../../types/guide";

export const translateGuide: ServiceGuide = {
  id: "aif-translate",
  service: "Amazon Translate",
  domain: "development",
  tagline:
    "Neural machine translation for fast, accurate, and affordable language translation",
  intro:
    "Amazon Translate is a neural machine translation service that provides fast, high-quality translation between 75+ language pairs, enabling applications to serve global audiences and process multilingual content at scale.",

  sections: [
    {
      heading: "Neural Machine Translation",
      body: `Machine translation has evolved through several generations. Rule-based systems encoded linguistic rules manually — slow to build and brittle. Statistical machine translation learned from aligned bilingual corpora but struggled with long-range dependencies. **Neural machine translation (NMT)** uses encoder-decoder neural networks (typically transformer architectures) that learn to represent meaning in a language-agnostic latent space, then decode that representation into the target language. This approach captures semantic context much more effectively, producing translations that are more fluent and contextually appropriate.

Translate uses NMT models trained on massive multilingual corpora. Unlike phrase-based statistical approaches, NMT generates the entire output sentence holistically, which means it handles grammatical restructuring (word order differences between languages), pronoun agreement, verb conjugation, and idiomatic expressions far better. The service currently supports over 75 languages and more than 5,000 language direction pairs — you can translate from any supported source language to any supported target language.`,
      quiz: [
        {
          question:
            "What neural architecture does Amazon Translate use, and what key advantage does it have over phrase-based statistical translation?",
          options: [
            "Recurrent neural networks (RNNs); they are faster than transformer models for short texts",
            "Encoder-decoder transformer networks; NMT generates the full output sentence holistically, handling grammatical restructuring, pronoun agreement, and idiomatic expressions far better",
            "Convolutional neural networks (CNNs); they process both source and target languages in parallel",
            "Large language models (LLMs); they can generate free-form translations with no structure constraints",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Translate uses encoder-decoder neural networks (transformer architectures). The key advantage of NMT over statistical phrase-based approaches is that it generates the entire output sentence holistically, handling grammatical restructuring, word order differences, pronoun agreement, verb conjugation, and idiomatic expressions far more effectively.",
        },
        {
          question:
            "How many languages and language direction pairs does Amazon Translate currently support?",
          options: [
            "30 languages and 900 language pairs",
            "50 languages and 2,500 language pairs",
            "75+ languages and 5,000+ language direction pairs",
            "100+ languages and 10,000+ language direction pairs",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Translate supports over 75 languages and more than 5,000 language direction pairs. You can translate between any supported source and target language combination within these pairs.",
        },
      ],
    },
    {
      heading: "Real-Time and Batch Translation",
      body: `Translate offers two invocation modes for different scale requirements. The **TranslateText** API is synchronous: you pass a source text (up to 10,000 bytes), specify the source language code (or use \`auto\` for automatic language detection), specify the target language, and receive the translated text in the response. This API is designed for real-time integration — translating a user's chat message, rendering a product description in the user's preferred language, or converting incoming support tickets to a common working language.

For large-scale translation workloads — a library of documents, a database of product listings, a corpus of customer feedback — **batch translation** is the right approach. You store input files (plain text, HTML, DOCX, PPTX, XLSX, or XML) in S3, submit a translation job specifying source and target languages, and Translate processes the files in parallel and writes translated files back to S3 preserving the original file format. Batch jobs handle up to 5 GB of input data and support multiple target languages in a single job, so you can produce translations into 10 languages simultaneously from a single job submission.`,
      quiz: [
        {
          question:
            "What is the maximum input size for a single Amazon Translate batch translation job?",
          options: ["500 MB", "1 GB", "5 GB", "10 GB"],
          correctIndex: 2,
          explanation:
            "Amazon Translate batch translation jobs handle up to 5 GB of input data. This makes batch translation suitable for large-scale document libraries, product catalogs, and customer feedback corpora that would be impractical to translate synchronously.",
        },
        {
          question:
            "A global e-commerce company wants to translate their entire product catalog (100,000 DOCX files) into 8 languages simultaneously. Which Translate feature enables this in a single job?",
          options: [
            "TranslateText called in parallel with 8 concurrent API invocations per document",
            "Batch translation with multiple target languages specified — a single job produces all 8 language versions",
            "Active Custom Translation with parallel data for each of the 8 target languages",
            "Custom Terminology with 8 separate language-specific glossaries applied sequentially",
          ],
          correctIndex: 1,
          explanation:
            "Batch translation supports multiple target languages in a single job submission. You specify the source language and all target languages, and Translate processes the documents in parallel and writes translated files for each target language back to S3 — preserving the original DOCX format.",
        },
      ],
    },
    {
      heading: "Custom Terminology",
      body: `General-purpose translation models are trained to produce natural-sounding language, but in many business contexts you need specific terms translated in specific ways — your brand name should not be translated, a proprietary product name should appear verbatim, an industry-specific term should use a particular translation your domain experts have agreed on rather than a generic dictionary equivalent.

**Custom Terminology** (CT) lets you define a glossary of source-language terms and their required target-language translations. You upload a CSV or TMX file mapping source terms to their required equivalents in one or more target languages, and Translate applies these overrides whenever those terms appear in text being translated — regardless of what the NMT model might otherwise produce. Custom Terminology is particularly important for legal and regulatory content, technical documentation, brand communications, and pharmaceutical materials where mistranslation of a specific term could have serious consequences.`,
      quiz: [
        {
          question:
            "In which file formats can you upload Custom Terminology glossaries to Amazon Translate?",
          options: [
            "JSON and XML",
            "CSV and TMX",
            "XLSX and CSV",
            "TSV and YAML",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Translate Custom Terminology glossaries are uploaded as CSV (comma-separated values) or TMX (Translation Memory eXchange) files. TMX is a standard format used by professional translation tools (CAT tools) like SDL Trados.",
        },
        {
          question:
            "When is Custom Terminology applied in Amazon Translate, and what does it override?",
          options: [
            "At training time — it modifies the NMT model's weights to prefer the specified translations",
            "At inference time — it overrides the NMT model's translation for specified source terms, ensuring they are always translated as defined in the glossary",
            "At post-processing time — it scans the completed translation and substitutes terms that differ from the glossary",
            "At import time — it modifies the source document before it is submitted for translation",
          ],
          correctIndex: 1,
          explanation:
            "Custom Terminology is applied at inference time — when a translation request is made. Translate overrides the NMT model's output for specified terms, ensuring they always appear as defined in the glossary regardless of what the model might otherwise produce.",
        },
      ],
    },
    {
      heading: "Active Custom Translation and Parallel Data",
      body: `**Active Custom Translation** (ACT) takes customization further than terminology overrides by allowing you to fine-tune the translation model itself on your domain data. You provide **parallel data** — a collection of sentence pairs where you have both the source text and the desired translation — and Translate trains a custom model that learns the style, vocabulary, and domain conventions present in your examples.

Parallel data teaches the model patterns beyond individual term mappings: the formality level you prefer (formal vs informal register), domain-specific sentence structures, preferred phrasings, and industry idioms. The resulting custom model produces translations that are stylistically consistent with your reference translations, not just lexically correct. ACT is particularly valuable for content creators with large existing translation memories (from CAT tools like SDL Trados), as those memories become training data for a personalized translation engine.`,
      quiz: [
        {
          question:
            "What type of training data is required for Amazon Translate's Active Custom Translation (ACT)?",
          options: [
            "Monolingual domain text in the source language only",
            "Parallel data — sentence pairs containing both the source text and the desired target translation",
            "A glossary of key terms in CSV format with their preferred translations",
            "Audio recordings of professional translators reading the source text",
          ],
          correctIndex: 1,
          explanation:
            "Active Custom Translation requires parallel data — collections of sentence pairs containing both the source text and the desired translation. This is the training signal the model uses to learn domain-specific style, formality, and phrasing beyond individual term mappings.",
        },
        {
          question:
            "How does Active Custom Translation (ACT) differ from Custom Terminology in Amazon Translate?",
          options: [
            "Custom Terminology fine-tunes the model; ACT applies term overrides at inference time",
            "Custom Terminology overrides specific terms at inference time; ACT fine-tunes the underlying translation model on parallel data to learn domain-wide style and vocabulary",
            "They are equivalent — ACT is just the newer API name for Custom Terminology",
            "Custom Terminology supports more language pairs; ACT is limited to English source language",
          ],
          correctIndex: 1,
          explanation:
            "Custom Terminology applies specific term overrides at inference time — it doesn't change the model. Active Custom Translation fine-tunes the underlying NMT model on parallel data, teaching it domain-specific style, formality, phrasing, and vocabulary — a deeper customization that affects all translations, not just specific terms.",
        },
      ],
    },
    {
      heading: "Language Detection and Integration Patterns",
      body: `Translate's **automatic language detection** uses the same underlying technology as Amazon Comprehend's \`DetectDominantLanguage\` to identify the source language when you specify \`auto\` as the source language code. This eliminates the need to pre-identify the language of incoming content — user-generated text, customer emails, multilingual document repositories — before translating it.

Common integration patterns include: a **content localization pipeline** where new articles are automatically translated into all supported languages using a batch job triggered by an S3 event; a **multilingual support chat system** where Translate normalizes all incoming messages to English for agent response, then translates the agent's reply back to the customer's language in real-time; and a **cross-lingual search system** where user queries are translated to match the language of stored documents, enabling search across multilingual content without requiring translation of the entire corpus.

Translate integrates naturally with Amazon Comprehend (translate → then analyze), Amazon S3, AWS Lambda, and Amazon Kendra (for multilingual enterprise search scenarios).`,
      quiz: [
        {
          question:
            "How do you enable automatic source language detection in Amazon Translate's TranslateText API?",
          options: [
            "Set AutoDetect: true in the API request parameters",
            "Specify 'auto' as the source language code",
            "Omit the SourceLanguageCode parameter — Translate detects it automatically by default",
            "Call Amazon Comprehend DetectDominantLanguage first and pass its output as a required parameter",
          ],
          correctIndex: 1,
          explanation:
            "Automatic language detection is enabled by specifying 'auto' as the SourceLanguageCode in the TranslateText API call. Translate uses the same underlying technology as Amazon Comprehend's DetectDominantLanguage to identify the source language automatically.",
        },
        {
          question:
            "Which AWS service does Amazon Translate integrate with for multilingual enterprise search scenarios?",
          options: [
            "Amazon OpenSearch Service",
            "Amazon Kendra",
            "Amazon CloudSearch",
            "AWS Glue",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Translate integrates with Amazon Kendra for multilingual enterprise search. Translate can convert user queries to the language of stored documents (or vice versa), enabling search across multilingual content repositories without requiring full corpus translation.",
        },
      ],
    },
  ],

  keyFacts: [
    "Neural machine translation supporting 75+ languages and 5,000+ language pairs",
    "TranslateText API: synchronous, up to 10,000 bytes, returns translation immediately",
    "Batch translation: S3 input → async job → S3 output, up to 5 GB",
    "Supports plain text, HTML, DOCX, PPTX, XLSX, XML format preservation in batch",
    "Custom Terminology: glossary overrides for specific term-to-term mappings",
    "Active Custom Translation: fine-tune model on parallel data (translation memory)",
    "Auto language detection available when source language is unknown",
    "Multiple target languages supported in a single batch job",
    "Custom Terminology uploaded as CSV or TMX format",
    "Integrates with Comprehend, Kendra, and S3 for multilingual workflows",
  ],

  relatedServices: [
    "Amazon Comprehend",
    "Amazon Kendra",
    "Amazon S3",
    "AWS Lambda",
    "Amazon Transcribe",
  ],

  examTips: [
    "Translate = translation between languages; Comprehend = analysis within one language",
    "Custom Terminology = specific term overrides; Active Custom Translation = model fine-tuning on parallel data",
    "Batch translation preserves file format (DOCX, HTML, etc.) in output",
    "Auto language detection uses Comprehend-style language identification under the hood",
    "Custom Terminology is applied at inference time; ACT changes the underlying model",
    "Know the batch job pattern: S3 input → submit job → S3 output in translated format",
    "Multiple target languages in one batch job — efficient for content localization pipelines",
  ],

  topicQuiz: [
    {
      question:
        "A global SaaS company wants to automatically translate their help documentation (DOCX files) from English into French, German, Spanish, and Japanese simultaneously. What is the correct Amazon Translate approach?",
      options: [
        "Call TranslateText four times (once per target language) for each document",
        "Submit a single batch translation job specifying all four target languages — Translate produces all four translated versions in one job",
        "Use Active Custom Translation with parallel data for each target language",
        "Use Custom Terminology with a multilingual glossary covering all four target languages",
      ],
      correctIndex: 1,
      explanation:
        "Batch translation supports multiple target languages in a single job. You submit one job specifying English as the source and all four target languages, and Translate processes the DOCX files in parallel, writing translated versions for each language back to S3 while preserving the DOCX format.",
    },
    {
      question:
        "A pharmaceutical company requires that a proprietary compound name always appears in its original form (untranslated) across all languages in their regulatory filings. Which Translate feature ensures this?",
      options: [
        "Active Custom Translation — train the model to pass through the compound name unchanged",
        "Auto language detection — the compound name will be identified as a proper noun and preserved",
        "Custom Terminology — define the compound name with the same term as both source and target",
        "Batch translation with DOCX format preservation — proper nouns are automatically retained",
      ],
      correctIndex: 2,
      explanation:
        "Custom Terminology is the correct tool. You define the compound name in the glossary mapping it to the same term (or the exact desired form) in each target language. Translate applies this override at inference time, ensuring the term always appears as specified regardless of what the NMT model would otherwise produce.",
    },
    {
      question:
        "What is the key difference between Custom Terminology and Active Custom Translation (ACT) in Amazon Translate?",
      options: [
        "Custom Terminology supports more languages; ACT is limited to 10 language pairs",
        "Custom Terminology overrides specific terms at inference time; ACT fine-tunes the NMT model on parallel data to improve domain-wide translation quality",
        "Custom Terminology modifies the NMT model; ACT applies post-processing to completed translations",
        "They are functionally identical — ACT is the batch-mode version of Custom Terminology",
      ],
      correctIndex: 1,
      explanation:
        "Custom Terminology applies specific term-level overrides at inference time without changing the model. Active Custom Translation fine-tunes the underlying NMT model on parallel data (source-target sentence pairs), teaching it domain-specific style, formality, and vocabulary — a deeper customization affecting all translations.",
    },
    {
      question:
        "A customer support platform receives messages in unknown languages from global customers. How should they configure Amazon Translate to handle this?",
      options: [
        "Call Amazon Comprehend DetectDominantLanguage first, then pass the result to TranslateText",
        "Specify 'auto' as the SourceLanguageCode in TranslateText — Translate detects the language automatically",
        "Use batch translation with a language detection pre-processing Lambda",
        "Configure Translate to attempt all 75 supported languages and use the highest-confidence result",
      ],
      correctIndex: 1,
      explanation:
        "Specifying 'auto' as the SourceLanguageCode in TranslateText enables automatic language detection. Translate identifies the source language using the same technology as Amazon Comprehend's DetectDominantLanguage, eliminating the need for a separate detection step.",
    },
    {
      question:
        "Amazon Translate is best described as which type of AI service?",
      options: [
        "Automatic speech recognition — converts multilingual audio to text",
        "Natural language understanding — extracts entities and sentiment from multilingual text",
        "Neural machine translation — converts text from one language to another",
        "Text-to-speech — reads text aloud in the target language",
      ],
      correctIndex: 2,
      explanation:
        "Amazon Translate is a neural machine translation (NMT) service — it converts text from one language to another. It is distinct from Transcribe (ASR), Comprehend (NLU/text analysis), and Polly (TTS).",
    },
    {
      question:
        "A media company has a large existing translation memory from SDL Trados containing thousands of professionally translated sentence pairs. How can they leverage this for Amazon Translate?",
      options: [
        "Import it as a Custom Terminology glossary by extracting key-value term pairs",
        "Use it as parallel data for Active Custom Translation to fine-tune a domain-specific translation model",
        "Store it in Amazon Kendra and use it for cross-lingual search instead of translation",
        "Convert it to a custom vocabulary for Amazon Transcribe to improve multilingual ASR",
      ],
      correctIndex: 1,
      explanation:
        "A translation memory from a CAT tool like SDL Trados consists of source-target sentence pairs — exactly the parallel data format required for Active Custom Translation. These high-quality professional translations become training data for a personalized translation model that learns the company's style and vocabulary.",
    },
    {
      question:
        "Which Amazon Translate API is appropriate for translating a user's chat message in real time, and what is its character limit?",
      options: [
        "TranslateText — synchronous, up to 10,000 bytes",
        "StartTextTranslationJob — asynchronous, processes real-time messages with low latency",
        "TranslateText — synchronous, up to 100,000 bytes",
        "TranslateDocument — synchronous, optimized for short conversational text",
      ],
      correctIndex: 0,
      explanation:
        "TranslateText is the synchronous API for real-time translation. It accepts up to 10,000 bytes of text and returns the translation immediately — making it suitable for chat messages, product descriptions, and other real-time translation use cases.",
    },
    {
      question:
        "Amazon Translate's batch translation preserves the original file format in the output. Which of the following formats does it support for format-preserving batch translation?",
      options: [
        "PDF, DOCX, PPTX, and RTF",
        "Plain text, HTML, DOCX, PPTX, XLSX, and XML",
        "DOCX, PDF, and Markdown",
        "HTML, JSON, and plain text only",
      ],
      correctIndex: 1,
      explanation:
        "Amazon Translate batch translation supports format-preserving translation for: plain text, HTML, DOCX (Word), PPTX (PowerPoint), XLSX (Excel), and XML. The translated output files maintain the original format — a DOCX in becomes a translated DOCX out.",
    },
  ],
};
