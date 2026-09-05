import { ServiceGuide } from "../../../types/guide";

export const comprehendGuide: ServiceGuide = {
  id: "mls-comprehend",
  service: "Amazon Comprehend",
  domain: "services",
  tagline:
    "Managed NLP service for extracting insights and meaning from text using pre-trained models",
  intro:
    "Amazon Comprehend provides natural language processing capabilities including sentiment analysis, entity recognition, key phrase extraction, language detection, topic modeling, and custom classification — all without requiring NLP expertise or custom model training.",

  sections: [
    {
      heading: "Core NLP Capabilities",
      body: `Comprehend's pre-trained NLP APIs analyze text and return structured insights. DetectSentiment classifies text as POSITIVE, NEGATIVE, NEUTRAL, or MIXED, with confidence scores for each — useful for product review analysis, customer support ticket classification, and social media monitoring. DetectEntities identifies named entities in text and classifies them into types: PERSON, LOCATION, ORGANIZATION, DATE, QUANTITY, TITLE, and more. This is used to extract structured information from unstructured documents.

DetectKeyPhrases extracts the most important noun phrases from text, supporting document summarization and search indexing pipelines. DetectDominantLanguage identifies the primary language in text, supporting multilingual NLP pipelines that route documents to the appropriate language-specific processing. DetectSyntax performs part-of-speech tagging, returning the grammatical role of each token. These APIs accept plain text up to 100 KB and return JSON with confidence scores for each detected entity or classification.`,
      quiz: [
        {
          question:
            "A customer support platform needs to automatically classify incoming support tickets as urgent (negative sentiment, high-priority keywords) vs. routine. Which Comprehend API combination should they use?",
          options: [
            "DetectSyntax and DetectDominantLanguage",
            "DetectSentiment and DetectKeyPhrases — combine sentiment and key phrase analysis to identify urgent tickets",
            "DetectEntities and DetectSentiment",
            "DetectDominantLanguage and DetectEntities",
          ],
          correctIndex: 1,
          explanation:
            "DetectSentiment classifies the emotional tone (NEGATIVE for urgent tickets) and DetectKeyPhrases extracts important terms (like 'system down,' 'cannot log in') that indicate priority. Combining these provides a richer signal for urgency classification than either API alone.",
        },
      ],
    },
    {
      heading: "Comprehend Custom Classification and Entity Recognition",
      body: `Comprehend Custom Classification trains a custom text classification model on your labeled documents using transfer learning. You provide training documents with their labels (multi-class or multi-label), and Comprehend automatically trains a model. This is appropriate for domain-specific classification tasks — routing legal documents to practice areas, classifying scientific papers by research domain, or categorizing support tickets by product line — where the pre-trained models don't have the necessary domain knowledge.

Comprehend Custom Entity Recognition trains a custom NER (Named Entity Recognition) model to identify domain-specific entities. For example, a pharmaceutical company could train a model to recognize drug names, dosage forms, and adverse event terms that standard Comprehend entity types don't cover. Training requires annotated text (documents with entity spans marked) or a CSV of entity examples. Both Custom Classification and Custom Entity Recognition deploy as real-time endpoints or run as asynchronous batch jobs via \`StartDocumentClassificationJob\`.`,
      quiz: [
        {
          question:
            "A financial firm needs to extract loan application terms (borrower name, loan amount, interest rate, maturity date) from unstructured contract text. Standard Comprehend entity types don't cover these. What should they use?",
          options: [
            "DetectEntities with a filter for QUANTITY and DATE entity types",
            "Comprehend Custom Entity Recognition trained on annotated loan contract examples",
            "Amazon Textract to extract all text and numbers from the contracts",
            "Comprehend topic modeling to identify loan-related topic clusters",
          ],
          correctIndex: 1,
          explanation:
            "Comprehend Custom Entity Recognition allows training a custom NER model for domain-specific entity types not covered by standard Comprehend. Training on annotated loan contracts teaches the model to recognize borrower names, loan amounts, rates, and dates in the specific context of financial documents.",
        },
      ],
    },
    {
      heading: "Comprehend Topic Modeling",
      body: `Comprehend Topic Modeling uses Latent Dirichlet Allocation (LDA) to discover abstract topics that occur in a collection of documents without labeled training data. It is an unsupervised technique that identifies co-occurring word patterns and groups them into topics. For example, analyzing a corpus of news articles might discover topics like {election, vote, candidate, poll} and {stock, market, earnings, revenue} without you specifying what the topics are.

Topic modeling via Comprehend runs as an asynchronous job: you provide an S3 bucket with input documents and a target S3 location for results. Comprehend returns a \`topic-terms.csv\` mapping topics to their most representative terms and a \`doc-topics.csv\` showing the topic mixture for each document. This is useful for EDA on large document corpora before building supervised classifiers — you discover the natural topic structure, then use that to guide label design for Custom Classification.`,
      quiz: [
        {
          question:
            "A research team has 50,000 unlabeled scientific papers and wants to understand what broad topic areas are covered before building a classifier. Which Comprehend feature is appropriate?",
          options: [
            "Comprehend Custom Classification with a multi-label model",
            "Comprehend Topic Modeling — uses LDA to discover abstract topics from unlabeled documents",
            "DetectEntities across all documents to find common entity types",
            "DetectKeyPhrases to build a word cloud of the most common terms",
          ],
          correctIndex: 1,
          explanation:
            "Comprehend Topic Modeling uses LDA to discover latent topic structure in unlabeled document collections without predefined labels. This is the correct approach for exploratory analysis before supervised training — it reveals what topics exist so you can design meaningful classification labels.",
        },
      ],
    },
    {
      heading: "Comprehend Medical and Comprehend for Healthcare",
      body: `Amazon Comprehend Medical is a specialized version of Comprehend trained on clinical and medical text. It extracts medical entities including medical conditions, medications, dosages, tests, and procedures from clinical notes, discharge summaries, and electronic health records. It also identifies PHI (Protected Health Information) entities — patient names, dates, ages, contact information — supporting HIPAA-compliant de-identification pipelines.

InferICD10CM maps detected medical conditions to ICD-10-CM codes (diagnosis codes used in medical billing). InferRxNorm maps medications to RxNorm codes (standard medication identifiers). InferSNOMEDCT maps to SNOMED CT clinical terminology. These medical code inference APIs transform unstructured clinical text into structured, codified medical records suitable for population health analytics and clinical NLP training datasets. Comprehend Medical does not require ML expertise and can process clinical text at scale as a batch job.`,
      quiz: [
        {
          question:
            "A healthcare company needs to de-identify clinical notes by removing patient names, dates of birth, and contact information before using the notes as ML training data. Which Comprehend Medical feature helps?",
          options: [
            "InferICD10CM — it maps conditions to codes, which indirectly removes patient identifiers",
            "DetectPHI (Protected Health Information) detection in Comprehend Medical — it identifies and locates patient identifiers for removal or masking",
            "Standard Comprehend DetectEntities with PERSON and DATE filters",
            "Amazon Textract with PII detection mode",
          ],
          correctIndex: 1,
          explanation:
            "Comprehend Medical's PHI detection identifies patient identifiers (names, dates, ages, addresses, phone numbers) in clinical text with their locations and types. Applications can then mask or remove these spans to de-identify clinical notes before using them as ML training data, supporting HIPAA compliance.",
        },
      ],
    },
    {
      heading: "Comprehend Integration and Batch Processing",
      body: `For large-scale text analysis, Comprehend supports asynchronous batch jobs that process S3 input files and write results to S3 output. Batch jobs support all core NLP operations and run on Comprehend's managed infrastructure without requiring instance provisioning. This model is appropriate for processing millions of documents — product reviews, support tickets, legal filings — that need NLP analysis before building ML training datasets or generating business intelligence.

Comprehend integrates naturally with the broader AWS data pipeline. S3 stores documents, Comprehend processes them, results land in S3 in JSON or CSV format, Glue or Athena queries the results, and processed features flow to SageMaker for downstream ML. Lambda can orchestrate real-time single-document analysis: an API Gateway endpoint receives text, Lambda calls Comprehend synchronously, and returns the sentiment and entities in the API response. For compliance, Comprehend supports VPC endpoints and KMS encryption of result files.`,
      quiz: [
        {
          question:
            "A company needs to run sentiment analysis on 10 million product reviews stored in S3. Which Comprehend approach is correct?",
          options: [
            "Call DetectSentiment in a Lambda loop for each review — Lambda scales automatically",
            "Use a Comprehend batch document classification job pointing to S3 input and output — it processes millions of documents asynchronously on managed infrastructure",
            "Load reviews into Redshift and use Comprehend's SQL extensions",
            "Use Comprehend Custom Classification since standard sentiment may not work for product reviews",
          ],
          correctIndex: 1,
          explanation:
            "Comprehend asynchronous batch jobs are designed for large-scale text analysis. You provide S3 input/output paths, and Comprehend processes all documents on managed infrastructure without Lambda loops or instance management. This is the correct approach for million-document scale NLP processing.",
        },
      ],
    },
  ],

  keyFacts: [
    "DetectSentiment: POSITIVE, NEGATIVE, NEUTRAL, MIXED with confidence scores",
    "DetectEntities: PERSON, LOCATION, ORGANIZATION, DATE, QUANTITY — standard types",
    "DetectKeyPhrases: extracts important noun phrases for summarization and search indexing",
    "Custom Classification: train on labeled documents for domain-specific text routing",
    "Custom Entity Recognition: train on annotated text for proprietary entity types",
    "Topic Modeling: LDA-based unsupervised topic discovery for unlabeled document collections",
    "Comprehend Medical: clinical entity extraction, PHI detection, ICD-10 and RxNorm inference",
    "Batch jobs: async processing of S3 document collections — scales to millions of documents",
    "DetectDominantLanguage: identifies language for multilingual routing pipelines",
    "Comprehend is HIPAA eligible — suitable for healthcare and clinical text workloads",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Lambda",
    "Amazon Translate",
    "Amazon Textract",
    "Amazon SageMaker",
    "AWS Glue",
  ],

  examTips: [
    "Custom Classification = labeled documents → domain-specific text classifier (multi-class or multi-label)",
    "Custom Entity Recognition = annotated text spans → domain-specific NER model",
    "Topic Modeling (LDA) = unsupervised discovery of topics from unlabeled corpus — good for EDA",
    "Comprehend Medical adds clinical entities, PHI detection, and medical code inference (ICD-10, RxNorm)",
    "Batch jobs for large-scale NLP; synchronous APIs for real-time single-document analysis",
    "DetectSentiment + DetectKeyPhrases = the combination for intelligent support ticket routing",
    "DetectDominantLanguage → Translate → language-specific NLP = the multilingual pipeline pattern",
    "PHI detection in Comprehend Medical enables HIPAA-compliant de-identification of clinical notes",
  ],

  topicQuiz: [
    {
      question:
        "A company wants to automatically categorize incoming legal contracts into one of 15 practice areas (employment, IP, M&A, etc.). Standard Comprehend entity types don't help. What should they use?",
      options: [
        "Comprehend Topic Modeling with 15 topics",
        "Comprehend Custom Classification trained on labeled legal contracts",
        "DetectKeyPhrases with 15 keyword lists for each practice area",
        "SageMaker with a custom BERT model for legal document classification",
      ],
      correctIndex: 1,
      explanation:
        "Comprehend Custom Classification uses transfer learning to train a custom text classifier on your labeled documents. You provide labeled legal contracts (each tagged with its practice area), and Comprehend fine-tunes its model to classify new contracts into the 15 categories — without requiring custom ML code.",
    },
    {
      question:
        "A data scientist is using Comprehend Topic Modeling on 100,000 customer reviews. What does the output \`doc-topics.csv\` file contain?",
      options: [
        "The top 10 terms for each discovered topic",
        "The sentiment score for each document mapped to its topic",
        "The proportion of each topic present in each document",
        "The entity types found in each document by topic",
      ],
      correctIndex: 2,
      explanation:
        "The doc-topics.csv output maps each document to the proportion of each topic it contains (topic mixture). For example, a review might be 70% Topic 3 (delivery/shipping) and 30% Topic 7 (product quality). The topic-terms.csv separately lists the most representative terms for each topic.",
    },
  ],
};
