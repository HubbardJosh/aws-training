import { ServiceGuide } from "../../../types/guide";

export const translateGuide: ServiceGuide = {
  id: "aif-translate",
  service: "Amazon Translate",
  domain: "development",
  tagline: "Neural machine translation for fast, accurate, and affordable language translation",
  intro:
    "Amazon Translate is a neural machine translation service that provides fast, high-quality translation between 75+ language pairs, enabling applications to serve global audiences and process multilingual content at scale.",

  sections: [
    {
      heading: "Neural Machine Translation",
      body: `Machine translation has evolved through several generations. Rule-based systems encoded linguistic rules manually — slow to build and brittle. Statistical machine translation learned from aligned bilingual corpora but struggled with long-range dependencies. **Neural machine translation (NMT)** uses encoder-decoder neural networks (typically transformer architectures) that learn to represent meaning in a language-agnostic latent space, then decode that representation into the target language. This approach captures semantic context much more effectively, producing translations that are more fluent and contextually appropriate.

Translate uses NMT models trained on massive multilingual corpora. Unlike phrase-based statistical approaches, NMT generates the entire output sentence holistically, which means it handles grammatical restructuring (word order differences between languages), pronoun agreement, verb conjugation, and idiomatic expressions far better. The service currently supports over 75 languages and more than 5,000 language direction pairs — you can translate from any supported source language to any supported target language.`,
    },
    {
      heading: "Real-Time and Batch Translation",
      body: `Translate offers two invocation modes for different scale requirements. The **TranslateText** API is synchronous: you pass a source text (up to 10,000 bytes), specify the source language code (or use \`auto\` for automatic language detection), specify the target language, and receive the translated text in the response. This API is designed for real-time integration — translating a user's chat message, rendering a product description in the user's preferred language, or converting incoming support tickets to a common working language.

For large-scale translation workloads — a library of documents, a database of product listings, a corpus of customer feedback — **batch translation** is the right approach. You store input files (plain text, HTML, DOCX, PPTX, XLSX, or XML) in S3, submit a translation job specifying source and target languages, and Translate processes the files in parallel and writes translated files back to S3 preserving the original file format. Batch jobs handle up to 5 GB of input data and support multiple target languages in a single job, so you can produce translations into 10 languages simultaneously from a single job submission.`,
    },
    {
      heading: "Custom Terminology",
      body: `General-purpose translation models are trained to produce natural-sounding language, but in many business contexts you need specific terms translated in specific ways — your brand name should not be translated, a proprietary product name should appear verbatim, an industry-specific term should use a particular translation your domain experts have agreed on rather than a generic dictionary equivalent.

**Custom Terminology** (CT) lets you define a glossary of source-language terms and their required target-language translations. You upload a CSV or TMX file mapping source terms to their required equivalents in one or more target languages, and Translate applies these overrides whenever those terms appear in text being translated — regardless of what the NMT model might otherwise produce. Custom Terminology is particularly important for legal and regulatory content, technical documentation, brand communications, and pharmaceutical materials where mistranslation of a specific term could have serious consequences.`,
    },
    {
      heading: "Active Custom Translation and Parallel Data",
      body: `**Active Custom Translation** (ACT) takes customization further than terminology overrides by allowing you to fine-tune the translation model itself on your domain data. You provide **parallel data** — a collection of sentence pairs where you have both the source text and the desired translation — and Translate trains a custom model that learns the style, vocabulary, and domain conventions present in your examples.

Parallel data teaches the model patterns beyond individual term mappings: the formality level you prefer (formal vs informal register), domain-specific sentence structures, preferred phrasings, and industry idioms. The resulting custom model produces translations that are stylistically consistent with your reference translations, not just lexically correct. ACT is particularly valuable for content creators with large existing translation memories (from CAT tools like SDL Trados), as those memories become training data for a personalized translation engine.`,
    },
    {
      heading: "Language Detection and Integration Patterns",
      body: `Translate's **automatic language detection** uses the same underlying technology as Amazon Comprehend's \`DetectDominantLanguage\` to identify the source language when you specify \`auto\` as the source language code. This eliminates the need to pre-identify the language of incoming content — user-generated text, customer emails, multilingual document repositories — before translating it.

Common integration patterns include: a **content localization pipeline** where new articles are automatically translated into all supported languages using a batch job triggered by an S3 event; a **multilingual support chat system** where Translate normalizes all incoming messages to English for agent response, then translates the agent's reply back to the customer's language in real-time; and a **cross-lingual search system** where user queries are translated to match the language of stored documents, enabling search across multilingual content without requiring translation of the entire corpus.

Translate integrates naturally with Amazon Comprehend (translate → then analyze), Amazon S3, AWS Lambda, and Amazon Kendra (for multilingual enterprise search scenarios).`,
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
};
