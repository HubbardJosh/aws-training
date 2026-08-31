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
      quiz: [
        {
          question:
            "How does Amazon Comprehend handle large-scale text processing across millions of documents?",
          options: [
            "You must split documents into batches and call the synchronous API repeatedly",
            "You store text files in S3, submit an async batch job, and Comprehend writes JSON results back to S3",
            "Comprehend reads directly from DynamoDB tables for batch processing",
            "You must provision an EMR cluster for distributed NLP processing",
          ],
          correctIndex: 1,
          explanation:
            "For batch processing, you store text files in S3, submit an asynchronous batch job specifying the S3 location and analysis type, and Comprehend processes files in parallel, writing JSON results back to S3. No EMR cluster, DynamoDB integration, or manual batching of synchronous API calls is required.",
        },
        {
          question:
            "Which API pattern does Comprehend use for real-time single-document analysis?",
          options: [
            "Synchronous single-document APIs",
            "Kinesis Data Streams ingestion",
            "WebSocket streaming",
            "Asynchronous batch jobs with S3 output",
          ],
          correctIndex: 0,
          explanation:
            "Comprehend exposes synchronous single-document APIs for real-time use cases where you need an immediate response for one document at a time. Asynchronous batch APIs are used for large-scale processing. Comprehend does not use WebSocket streaming or Kinesis Data Streams for its NLP analysis.",
        },
        {
          question: "What type of data does Amazon Comprehend process?",
          options: [
            "Structured relational data in databases",
            "Image and video content",
            "Unstructured text such as reviews, tickets, and documents",
            "Time-series numerical data",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Comprehend is an NLP service specifically designed for unstructured text — customer reviews, support tickets, social media posts, medical notes, legal contracts, etc. It does not process images, video, relational database records, or time-series numerical data.",
        },
      ],
    },
    {
      heading: "Core NLP Capabilities",
      body: `Comprehend's built-in capabilities cover the most common NLP tasks. **Sentiment analysis** classifies the overall emotional tone of a piece of text as Positive, Negative, Neutral, or Mixed, with a confidence score for each category. **Targeted sentiment** goes further, identifying individual entities mentioned in a text and assigning sentiment to each one — so a hotel review that praises the food but criticizes the service returns separate sentiment scores for each aspect.

**Entity recognition** identifies and classifies named real-world objects in text: Person, Organization, Location, Date, Quantity, Event, Title, and more. Each detected entity includes the text span, type, and confidence score. **Key phrase extraction** identifies the most meaningful noun phrases — the "main ideas" — in a document, useful for summarization and indexing.

**Dominant language detection** identifies the primary language of a document from 100 supported languages. **Syntax analysis** performs part-of-speech tagging and dependency parsing, annotating each token with its grammatical role (noun, verb, adjective, etc.).`,
      quiz: [
        {
          question:
            "A hotel review reads: 'The food was excellent but the front desk staff was rude.' Standard sentiment analysis returns Mixed. Which Comprehend feature provides separate sentiment scores for 'food' and 'front desk staff' individually?",
          options: [
            "Targeted sentiment",
            "Entity recognition",
            "Key phrase extraction",
            "Syntax analysis",
          ],
          correctIndex: 0,
          explanation:
            "Targeted sentiment identifies individual entities mentioned in text and assigns sentiment to each one separately, so 'food' can be positive while 'front desk staff' is negative in the same document. Standard sentiment gives one overall score. Entity recognition identifies entities but does not assign sentiment. Key phrase extraction identifies main ideas, not sentiment.",
        },
        {
          question:
            "Which Comprehend capability identifies named real-world objects in text such as Person, Organization, Location, and Date?",
          options: [
            "Dominant language detection",
            "Key phrase extraction",
            "Sentiment analysis",
            "Entity recognition",
          ],
          correctIndex: 3,
          explanation:
            "Entity recognition identifies and classifies named real-world objects — Persons, Organizations, Locations, Dates, Quantities, Events, Titles, and more. Sentiment analysis classifies emotional tone. Key phrase extraction identifies main noun phrases. Language detection identifies the document's primary language.",
        },
        {
          question:
            "What are the four sentiment categories returned by Amazon Comprehend's sentiment analysis?",
          options: [
            "Positive, Negative, Neutral, Mixed",
            "Good, Bad, Neutral, Ambiguous",
            "Positive, Negative, Neutral, Unknown",
            "Happy, Sad, Angry, Surprised",
          ],
          correctIndex: 0,
          explanation:
            "Comprehend's sentiment analysis classifies text into four categories: Positive, Negative, Neutral, and Mixed, each with a confidence score. Mixed is returned when the text contains both positive and negative signals. The other option sets use different terminology not used by Comprehend.",
        },
      ],
    },
    {
      heading: "PII Detection and Redaction",
      body: `One of Comprehend's most important enterprise capabilities is **Personally Identifiable Information (PII) detection and redaction**. Comprehend can scan text for PII entities — names, addresses, phone numbers, email addresses, Social Security numbers, credit card numbers, bank account numbers, passport numbers, and more — and return their positions in the text along with entity type.

Critically, Comprehend can also **redact** PII by replacing detected entities with a placeholder like \`[NAME]\` or \`[SSN]\`, producing a sanitized version of the document. This makes Comprehend central to data governance workflows: before storing customer communications, before feeding text to a language model, or before sharing datasets with analysts, you can run Comprehend PII redaction to remove sensitive data automatically. The \`ContainsPiiEntities\` API provides a quick check for whether a document contains any PII at all, useful as a fast first-pass filter.`,
      quiz: [
        {
          question:
            "A company wants to sanitize customer support chat logs before feeding them to an LLM, replacing names, phone numbers, and SSNs with placeholders. Which Comprehend capability does this?",
          options: [
            "Entity recognition with post-processing",
            "Custom entity recognition",
            "PII detection and redaction",
            "Topic modeling",
          ],
          correctIndex: 2,
          explanation:
            "Comprehend's PII detection and redaction feature automatically identifies PII entities (names, phone numbers, SSNs, etc.) and replaces them with typed placeholders like [NAME] or [SSN], producing a sanitized document. Entity recognition identifies but does not redact. Topic modeling finds themes. Custom entity recognition is for domain-specific entities, not standard PII.",
        },
        {
          question:
            "Which Comprehend API provides a quick check to determine if a document contains any PII at all, before running full redaction?",
          options: [
            "ContainsPiiEntities",
            "DetectSentiment",
            "DetectPiiEntities",
            "DetectEntities",
          ],
          correctIndex: 0,
          explanation:
            "ContainsPiiEntities is a fast first-pass API that checks whether a document contains any PII entities without doing full extraction. This is useful for filtering large volumes of documents before applying the more detailed PII detection or redaction. DetectEntities identifies general entities, not specifically PII.",
        },
        {
          question:
            "What types of PII entities can Amazon Comprehend detect and redact?",
          options: [
            "Only names and email addresses",
            "Names, addresses, phone numbers, email addresses, SSNs, credit card numbers, bank account numbers, passport numbers, and more",
            "Only structured data like SSNs and credit card numbers with fixed formats",
            "Any entity recognized by the custom entity recognizer",
          ],
          correctIndex: 1,
          explanation:
            "Comprehend detects a broad range of PII entity types including names, addresses, phone numbers, email addresses, Social Security numbers, credit card numbers, bank account numbers, and passport numbers. It is not limited to names and emails, nor to fixed-format structured fields only.",
        },
      ],
    },
    {
      heading: "Topic Modeling",
      body: `**Topic modeling** is an unsupervised NLP technique that discovers hidden thematic structure across a corpus of documents. Comprehend's topic modeling API takes a collection of documents (stored in S3) and uses **Latent Dirichlet Allocation (LDA)** to infer a specified number of topics, each represented as a weighted list of terms. Documents are then scored against each topic to show how strongly each document relates to each theme.

This is useful for understanding a large collection of documents at scale: What are the recurring themes in 50,000 customer support tickets? What topics dominate product reviews? Rather than reading every document, topic modeling surfaces the main themes automatically. Results are stored in S3 and include a topic-terms matrix (what words define each topic) and a document-topics matrix (how much each document relates to each topic).`,
      quiz: [
        {
          question:
            "Which algorithm does Amazon Comprehend use for topic modeling?",
          options: [
            "Latent Dirichlet Allocation (LDA)",
            "TF-IDF with hierarchical clustering",
            "BERT embeddings with k-NN clustering",
            "K-Means clustering",
          ],
          correctIndex: 0,
          explanation:
            "Comprehend's topic modeling uses Latent Dirichlet Allocation (LDA), a probabilistic model that infers topics as distributions over words and documents as mixtures of topics. K-Means, BERT with k-NN, and TF-IDF hierarchical clustering are different approaches not used by Comprehend's topic modeling.",
        },
        {
          question:
            "What does a customer need to specify when submitting a topic modeling job to Amazon Comprehend?",
          options: [
            "The exact topics and their definitions",
            "An embedding model to use for semantic similarity",
            "A labeled training dataset mapping documents to topics",
            "The number of topics to infer — Comprehend discovers the topics automatically",
          ],
          correctIndex: 3,
          explanation:
            "Topic modeling is unsupervised — you specify the number of topics you want, and Comprehend automatically discovers what those topics are from the document corpus. You do not define the topics in advance, provide labeled training data, or specify an embedding model. This is what makes it unsupervised.",
        },
        {
          question:
            "What two output matrices does a Comprehend topic modeling job produce?",
          options: [
            "A word-frequency matrix and a document-similarity matrix",
            "A sentiment matrix and an entity matrix",
            "A topic-terms matrix and a document-topics matrix",
            "A feature-importance matrix and a document-classification matrix",
          ],
          correctIndex: 2,
          explanation:
            "Topic modeling results include a topic-terms matrix (which words most define each discovered topic) and a document-topics matrix (how strongly each document relates to each topic). These together allow you to understand both what the topics are and how your documents distribute across them.",
        },
      ],
    },
    {
      heading: "Custom Classification and Custom Entity Recognition",
      body: `While Comprehend's built-in entity types cover common categories, real-world applications often need custom classifications specific to their domain. Comprehend supports two types of custom models trained on your data.

**Custom Classification** trains a text classifier using your labeled examples. You provide a CSV or Augmented Manifest file with text samples and their correct category labels, submit a training job, and Comprehend fine-tunes a classification model on your data. Once trained, you deploy the custom classifier to a **real-time endpoint** or use it in asynchronous batch jobs. Classifying support tickets into product categories, routing documents to the correct department, or categorizing news articles are typical use cases.

**Custom Entity Recognition** trains a named entity recognizer to detect entity types specific to your domain — medical drug names, proprietary product codes, internal project names, or financial instrument identifiers that Comprehend's base model doesn't recognize. Training requires annotated documents with entity spans marked. Custom entity recognition is particularly valuable in regulated industries like healthcare (Amazon Comprehend Medical, a separate but related service, is purpose-built for medical text).`,
      quiz: [
        {
          question:
            "A company wants to automatically route incoming support tickets to the correct product team by classifying the ticket text into product categories. Which Comprehend feature is appropriate?",
          options: [
            "Custom Entity Recognition",
            "Topic modeling",
            "Targeted sentiment analysis",
            "Custom Classification",
          ],
          correctIndex: 3,
          explanation:
            "Custom Classification trains a text classifier on labeled examples (ticket text → product category) and deploys it to a real-time endpoint or batch job for automatic routing. Custom Entity Recognition identifies specific named entities, not document-level categories. Topic modeling discovers themes unsupervised. Targeted sentiment assigns sentiment, not categories.",
        },
        {
          question:
            "What type of training data is required for Comprehend Custom Entity Recognition?",
          options: [
            "Annotated documents with entity spans marked, identifying the specific text positions of custom entities",
            "A CSV file with document text and document-level category labels",
            "Unlabeled documents for unsupervised entity discovery",
            "A list of entity names without annotations",
          ],
          correctIndex: 0,
          explanation:
            "Custom Entity Recognition requires annotated training documents where the specific text spans of custom entity types are marked (span-level labels). This differs from Custom Classification, which uses document-level labels. Entity recognition cannot be trained on entity lists alone or unlabeled documents.",
        },
        {
          question:
            "What is the key difference between Comprehend Custom Classification and Custom Entity Recognition?",
          options: [
            "Custom Classification works on images; Custom Entity Recognition works on text",
            "Custom Classification requires more training data; Custom Entity Recognition requires less",
            "Custom Classification assigns document-level category labels; Custom Entity Recognition identifies specific entity spans within text",
            "Custom Classification is unsupervised; Custom Entity Recognition is supervised",
          ],
          correctIndex: 2,
          explanation:
            "Custom Classification assigns a label to an entire document (e.g., 'this ticket belongs to the billing team'). Custom Entity Recognition identifies specific text spans within a document that match custom entity types (e.g., 'this phrase is a drug name'). Both are supervised — they require labeled training data.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A company processes thousands of customer emails and wants to identify the primary theme of each email (billing issue, technical problem, general inquiry) and route them automatically. Which Comprehend feature handles this?",
      options: [
        "Targeted sentiment analysis",
        "Entity recognition with post-processing rules",
        "Topic modeling with LDA",
        "Custom Classification with a trained classifier endpoint",
      ],
      correctIndex: 3,
      explanation:
        "Custom Classification trains a text classifier on labeled examples (email text → category) and deploys it for real-time or batch routing. Topic modeling is unsupervised and discovers unknown themes rather than classifying into predefined categories. Entity recognition identifies named objects. Targeted sentiment assigns sentiment, not routing categories.",
    },
    {
      question:
        "Which Comprehend capability would you use to discover the recurring themes across 100,000 product reviews without having predefined categories?",
      options: [
        "Targeted sentiment",
        "Custom Classification",
        "Entity recognition",
        "Topic modeling",
      ],
      correctIndex: 3,
      explanation:
        "Topic modeling is the unsupervised technique for discovering hidden thematic structure across a document corpus when themes are not known in advance. You specify how many topics to find, and Comprehend (using LDA) discovers what those topics are. Custom Classification requires predefined labeled categories.",
    },
    {
      question:
        "Before sharing customer support chat logs with an analytics team, a company wants to automatically remove all names, phone numbers, and credit card numbers from the text. Which Comprehend API type should they use?",
      options: [
        "ContainsPiiEntities for detection, then manual removal",
        "DetectEntities with a Person type filter",
        "PII redaction to replace detected PII with typed placeholders automatically",
        "Custom Entity Recognition trained on PII examples",
      ],
      correctIndex: 2,
      explanation:
        "PII redaction automatically detects and replaces PII entities with placeholders ([NAME], [PHONE], [CREDIT_DEBIT_NUMBER], etc.) in a single API call, producing sanitized text without manual post-processing. ContainsPiiEntities only checks presence. DetectEntities covers general entities not just PII. Custom Entity Recognition is for domain-specific entities, not standard PII.",
    },
    {
      question:
        "A pharmaceutical company wants Comprehend to recognize drug names and medical device identifiers that its base model does not know. What should they build?",
      options: [
        "A Custom Entity Recognizer trained on annotated documents with drug name spans marked",
        "A sentiment analyzer tuned for medical text",
        "A Custom Classifier with drug name categories",
        "A topic model focused on medical terminology",
      ],
      correctIndex: 0,
      explanation:
        "Custom Entity Recognition trains a named entity recognizer on annotated documents where custom entity spans (drug names, device identifiers) are marked. This teaches Comprehend to detect entity types its base model doesn't recognize. Custom Classification assigns document-level labels, not span-level entity detection.",
    },
    {
      question:
        "What does the 'Mixed' sentiment classification in Amazon Comprehend indicate?",
      options: [
        "The model is uncertain and the confidence score is below threshold",
        "The document is written in multiple languages",
        "The text contains no clear emotional content",
        "The text contains both positive and negative signals",
      ],
      correctIndex: 3,
      explanation:
        "Mixed sentiment indicates that the text contains both positive and negative signals — for example, 'The food was great but the service was terrible.' It is not an uncertainty indicator, not related to multilingual content (that's language detection), and not the same as Neutral (which indicates no strong emotional signal).",
    },
    {
      question:
        "What is the output format of an Amazon Comprehend batch analysis job?",
      options: [
        "CSV files stored in an RDS database",
        "JSON files written back to an S3 bucket",
        "XML files delivered to an SQS queue",
        "Parquet files stored in Amazon Redshift",
      ],
      correctIndex: 1,
      explanation:
        "Comprehend batch jobs read input text files from S3 and write analysis results as JSON files back to a specified S3 output location. Results are not stored in RDS, SQS, or Redshift, and the format is JSON, not CSV, XML, or Parquet.",
    },
    {
      question:
        "Amazon Comprehend Medical is described as a separate but related service. What makes it distinct from standard Comprehend?",
      options: [
        "Comprehend Medical uses GPT-4 while standard Comprehend uses Amazon's own models",
        "Comprehend Medical supports batch processing; standard Comprehend only supports real-time",
        "Comprehend Medical is purpose-built for medical text, including clinical notes and ICD-10 codes and medication extraction",
        "Comprehend Medical performs image analysis of medical scans",
      ],
      correctIndex: 2,
      explanation:
        "Amazon Comprehend Medical is a specialized NLP service trained specifically on medical and clinical text, enabling extraction of medical conditions, medications, dosages, ICD-10 codes, and other clinical entities with higher accuracy than the general Comprehend service. Both support batch and real-time processing. It does not use GPT-4 or process medical images.",
    },
    {
      question:
        "What distinguishes targeted sentiment from standard document-level sentiment analysis in Comprehend?",
      options: [
        "Targeted sentiment is faster and cheaper than document-level sentiment",
        "Targeted sentiment works on longer documents while document-level is limited to short texts",
        "Targeted sentiment uses a neural network while document-level uses rules",
        "Targeted sentiment identifies individual entities mentioned in the text and assigns separate sentiment scores to each",
      ],
      correctIndex: 3,
      explanation:
        "Targeted sentiment goes beyond a single document-level score by identifying entities mentioned in the text and assigning individual sentiment scores to each. A review can be positive about 'room size' and negative about 'price' simultaneously. Document-level sentiment collapses this into one overall score.",
    },
  ],
};
