import { ServiceGuide } from "../../../types/guide";

export const comprehendGuide: ServiceGuide = {
  id: "aif-comprehend",
  service: "Amazon Comprehend",
  domain: "development",
  tagline: "Natural language processing to extract insights from text",
  intro:
    "Amazon Comprehend is a fully managed NLP service that uses machine learning to find meaning and structure in unstructured text — detecting sentiment, entities, key phrases, language, and topics without requiring any ML expertise.",

  sections: [
    {
      heading: "What Amazon Comprehend Does",
      body: `Unstructured text — customer reviews, support tickets, social media posts, medical notes, legal contracts — is among the most valuable and most underutilized data in any organization. Comprehend applies pre-trained NLP models to extract structured information from that text, turning raw prose into actionable data points your applications and analytics pipelines can consume.

The service exposes its capabilities through synchronous single-document APIs for real-time use cases and asynchronous batch APIs for large-scale text processing. For batch jobs, you store text files in S3, submit a batch job specifying the S3 location and the desired analysis type, and Comprehend processes the files in parallel and writes results (JSON) back to S3. This makes it straightforward to run NLP analysis across millions of documents without building a distributed processing cluster.`,
    },
    {
      heading: "Core NLP Capabilities",
      body: `Comprehend's built-in capabilities cover the most common NLP tasks. **Sentiment analysis** classifies the overall emotional tone of a piece of text as Positive, Negative, Neutral, or Mixed, with a confidence score for each category. **Targeted sentiment** goes further, identifying individual entities mentioned in a text and assigning sentiment to each one — so a hotel review that praises the food but criticizes the service returns separate sentiment scores for each aspect.

**Entity recognition** identifies and classifies named real-world objects in text: Person, Organization, Location, Date, Quantity, Event, Title, and more. Each detected entity includes the text span, type, and confidence score. **Key phrase extraction** identifies the most meaningful noun phrases — the "main ideas" — in a document, useful for summarization and indexing.

**Dominant language detection** identifies the primary language of a document from 100 supported languages. **Syntax analysis** performs part-of-speech tagging and dependency parsing, annotating each token with its grammatical role (noun, verb, adjective, etc.).`,
    },
    {
      heading: "PII Detection and Redaction",
      body: `One of Comprehend's most important enterprise capabilities is **Personally Identifiable Information (PII) detection and redaction**. Comprehend can scan text for PII entities — names, addresses, phone numbers, email addresses, Social Security numbers, credit card numbers, bank account numbers, passport numbers, and more — and return their positions in the text along with entity type.

Critically, Comprehend can also **redact** PII by replacing detected entities with a placeholder like \`[NAME]\` or \`[SSN]\`, producing a sanitized version of the document. This makes Comprehend central to data governance workflows: before storing customer communications, before feeding text to a language model, or before sharing datasets with analysts, you can run Comprehend PII redaction to remove sensitive data automatically. The \`ContainsPiiEntities\` API provides a quick check for whether a document contains any PII at all, useful as a fast first-pass filter.`,
    },
    {
      heading: "Topic Modeling",
      body: `**Topic modeling** is an unsupervised NLP technique that discovers hidden thematic structure across a corpus of documents. Comprehend's topic modeling API takes a collection of documents (stored in S3) and uses **Latent Dirichlet Allocation (LDA)** to infer a specified number of topics, each represented as a weighted list of terms. Documents are then scored against each topic to show how strongly each document relates to each theme.

This is useful for understanding a large collection of documents at scale: What are the recurring themes in 50,000 customer support tickets? What topics dominate product reviews? Rather than reading every document, topic modeling surfaces the main themes automatically. Results are stored in S3 and include a topic-terms matrix (what words define each topic) and a document-topics matrix (how much each document relates to each topic).`,
    },
    {
      heading: "Custom Classification and Custom Entity Recognition",
      body: `While Comprehend's built-in entity types cover common categories, real-world applications often need custom classifications specific to their domain. Comprehend supports two types of custom models trained on your data.

**Custom Classification** trains a text classifier using your labeled examples. You provide a CSV or Augmented Manifest file with text samples and their correct category labels, submit a training job, and Comprehend fine-tunes a classification model on your data. Once trained, you deploy the custom classifier to a **real-time endpoint** or use it in asynchronous batch jobs. Classifying support tickets into product categories, routing documents to the correct department, or categorizing news articles are typical use cases.

**Custom Entity Recognition** trains a named entity recognizer to detect entity types specific to your domain — medical drug names, proprietary product codes, internal project names, or financial instrument identifiers that Comprehend's base model doesn't recognize. Training requires annotated documents with entity spans marked. Custom entity recognition is particularly valuable in regulated industries like healthcare (Amazon Comprehend Medical, a separate but related service, is purpose-built for medical text).`,
    },
  ],

  keyFacts: [
    "Fully managed NLP — no ML expertise or infrastructure required",
    "Sentiment analysis: Positive, Negative, Neutral, Mixed with confidence scores",
    "Targeted sentiment assigns sentiment to individual entities within a document",
    "Entity recognition types: Person, Organization, Location, Date, Quantity, and more",
    "PII detection and redaction for names, SSNs, credit cards, addresses, etc.",
    "Topic modeling uses LDA to discover themes across a document corpus",
    "Custom Classification trains document categorizers on your labeled data",
    "Custom Entity Recognition detects domain-specific entity types",
    "Batch jobs read from S3 and write JSON results back to S3",
    "Amazon Comprehend Medical is a separate service for medical-specific NLP",
  ],

  relatedServices: [
    "Amazon Textract",
    "Amazon Transcribe",
    "Amazon S3",
    "Amazon Bedrock",
    "AWS Glue",
  ],

  examTips: [
    "Comprehend is NLP; Rekognition is computer vision — don't confuse their use cases",
    "PII redaction is the key compliance use case — Comprehend can sanitize documents automatically",
    "Targeted sentiment = sentiment per entity, not just per document",
    "Topic modeling is unsupervised — you specify number of topics, Comprehend finds them",
    "Custom Classifier vs Custom Entity Recognizer: classification = whole-document labels; entities = span-level labels",
    "Batch jobs are async: submit job → S3 output — no real-time endpoint needed",
    "Comprehend Medical is separate — used for clinical text, ICD-10 codes, medications",
  ],
};
