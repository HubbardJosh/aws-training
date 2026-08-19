import { QuizQuestion } from "../../types";

export const quizQuestions: QuizQuestion[] = [
  // ─── Amazon Bedrock ──────────────────────────────────────────────────────────
  {
    id: "aif-qq-1",
    service: "Amazon Bedrock",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon Bedrock?",
    options: [
      "A fully managed service that provides access to foundation models via an API",
      "A service for training custom ML models from scratch on your own data",
      "A managed Kubernetes service for running ML inference workloads",
      "A data lake solution optimized for storing AI training datasets",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Bedrock is a fully managed service that provides access to high-performing foundation models from leading AI companies through a single API. It lets you build generative AI applications without managing any infrastructure or ML training pipelines.",
    tags: ["bedrock", "foundation-models", "generative-ai"],
  },
  {
    id: "aif-qq-2",
    service: "Amazon Bedrock",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to ground a Bedrock LLM in its internal knowledge base so answers reflect proprietary company documents. Which Bedrock feature enables this?",
    options: [
      "Bedrock Knowledge Bases with RAG (Retrieval Augmented Generation)",
      "Bedrock Model Evaluation",
      "Bedrock Fine-tuning",
      "Bedrock Guardrails",
    ],
    correctIndices: [0],
    explanation:
      "Bedrock Knowledge Bases implements RAG — it ingests your documents into a vector store and retrieves relevant context at query time to ground the model's responses in your proprietary data. This reduces hallucination and keeps answers current without retraining the model.",
    tags: ["bedrock", "rag", "knowledge-bases"],
  },
  {
    id: "aif-qq-3",
    service: "Amazon Bedrock",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "Which model providers are available through Amazon Bedrock?",
    options: [
      "Anthropic, Meta, Mistral, Cohere, AI21, and Amazon",
      "OpenAI, Google DeepMind, and Microsoft Azure",
      "Only Amazon's own Titan models",
      "Hugging Face open-source models exclusively",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Bedrock offers foundation models from Anthropic (Claude), Meta (Llama), Mistral, Cohere, AI21 Labs, and Amazon's own Titan models — all accessible through a single unified API without needing separate provider accounts.",
    tags: ["bedrock", "model-providers", "foundation-models"],
  },
  {
    id: "aif-qq-4",
    service: "Amazon Bedrock",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "A financial services company needs to prevent Bedrock from generating harmful content and block topics unrelated to finance. Which feature handles this?",
    options: [
      "Amazon Bedrock Guardrails",
      "Amazon Bedrock Agents",
      "Amazon Bedrock Model Evaluation",
      "Amazon Bedrock Fine-tuning",
    ],
    correctIndices: [0],
    explanation:
      "Bedrock Guardrails lets you configure content filters, topic denylists, word filters, and PII redaction to control model inputs and outputs. You can block entire topics and filter harmful content categories to meet compliance and safety requirements.",
    tags: ["bedrock", "guardrails", "safety", "security"],
  },
  {
    id: "aif-qq-5",
    service: "Amazon Bedrock",
    domain: "applications",
    difficulty: "hard",
    type: "single",
    question:
      "A developer wants to build a Bedrock agent that can autonomously look up customer records in a database and send emails. Which feature enables the agent to take these real-world actions?",
    options: [
      "Bedrock Agents with action groups backed by Lambda functions",
      "Bedrock Knowledge Bases with document ingestion",
      "Bedrock Guardrails with allow-listed actions",
      "Bedrock Model Evaluation with human review",
    ],
    correctIndices: [0],
    explanation:
      "Bedrock Agents use action groups — each backed by a Lambda function — to connect the agent to external APIs, databases, and services. The agent reasons about which actions to take and invokes the appropriate Lambda functions to complete multi-step tasks autonomously.",
    tags: ["bedrock", "agents", "lambda", "action-groups"],
  },
  {
    id: "aif-qq-6",
    service: "Amazon Bedrock",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO approaches in Amazon Bedrock allow you to customize a model's behavior for your domain without the cost of full retraining from scratch?",
    options: [
      "Fine-tuning with labeled domain-specific training data",
      "RAG via Bedrock Knowledge Bases to provide retrieved context at inference time",
      "Running the model on dedicated GPU instances for better performance",
      "Deploying the model to a VPC endpoint for private access",
      "Enabling Bedrock Model Evaluation to score outputs",
    ],
    correctIndices: [0, 1],
    explanation:
      "Fine-tuning adapts the model's weights using your labeled data, making it better at domain-specific tasks. RAG (via Knowledge Bases) grounds responses in your documents at inference time without changing the model. Both are far less expensive than training a model from scratch.",
    tags: ["bedrock", "fine-tuning", "rag", "customization"],
  },
  {
    id: "aif-qq-7",
    service: "Amazon Bedrock",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What billing model does Amazon Bedrock use for foundation model inference?",
    options: [
      "Pay per input and output token consumed",
      "Fixed monthly fee per model provider",
      "Per-hour charge for provisioned compute",
      "Free tier only — no charges for inference",
    ],
    correctIndices: [0],
    explanation:
      "Bedrock uses a pay-per-token pricing model: you are charged based on the number of input tokens sent to the model and output tokens generated. There is no charge for idle time in on-demand mode.",
    tags: ["bedrock", "pricing", "tokens"],
  },

  // ─── Amazon SageMaker ────────────────────────────────────────────────────────
  {
    id: "aif-qq-8",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is the primary purpose of Amazon SageMaker?",
    options: [
      "A fully managed platform for the complete ML lifecycle — build, train, and deploy models",
      "A managed database service optimized for ML feature storage",
      "A serverless inference service for pre-built foundation models only",
      "A data pipeline service for ETL transformations",
    ],
    correctIndices: [0],
    explanation:
      "Amazon SageMaker is a fully managed ML platform covering the entire lifecycle: data preparation, model building in Studio notebooks, training at scale, hyperparameter tuning, model evaluation, and deployment to real-time or batch inference endpoints.",
    tags: ["sagemaker", "ml-lifecycle", "platform"],
  },
  {
    id: "aif-qq-9",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A data science team wants to automatically find the best ML algorithm and hyperparameters for a classification task without writing model code. Which SageMaker feature should they use?",
    options: [
      "SageMaker Autopilot",
      "SageMaker JumpStart",
      "SageMaker Feature Store",
      "SageMaker Model Monitor",
    ],
    correctIndices: [0],
    explanation:
      "SageMaker Autopilot is SageMaker's AutoML capability — it automatically explores multiple algorithms and hyperparameter combinations, trains candidate models, and ranks them by performance, all without requiring model code.",
    tags: ["sagemaker", "autopilot", "automl"],
  },
  {
    id: "aif-qq-10",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A team wants to quickly deploy a pre-trained Llama model for experimentation without writing training code. Which SageMaker feature provides access to pre-trained open-source models ready to deploy?",
    options: [
      "SageMaker JumpStart",
      "SageMaker Autopilot",
      "SageMaker Pipelines",
      "SageMaker Clarify",
    ],
    correctIndices: [0],
    explanation:
      "SageMaker JumpStart provides a hub of pre-trained models (including Llama, Stable Diffusion, and many others) along with solution templates that can be deployed with a single click — ideal for quick experimentation without training from scratch.",
    tags: ["sagemaker", "jumpstart", "pre-trained"],
  },
  {
    id: "aif-qq-11",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "After deploying a model to a SageMaker endpoint, the team notices prediction accuracy degrading as real-world data distribution shifts. Which SageMaker feature detects this automatically?",
    options: [
      "SageMaker Model Monitor",
      "SageMaker Clarify",
      "SageMaker Debugger",
      "SageMaker Feature Store",
    ],
    correctIndices: [0],
    explanation:
      "SageMaker Model Monitor continuously monitors deployed endpoints for data drift, model quality drift, bias drift, and feature attribution drift. It compares baseline statistics from training to live inference traffic and alerts when distributions shift significantly.",
    tags: ["sagemaker", "model-monitor", "data-drift"],
  },
  {
    id: "aif-qq-12",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which SageMaker component serves as the central IDE where data scientists write notebooks, visualize data, train models, and manage experiments in one environment?",
    options: [
      "SageMaker Studio",
      "SageMaker Canvas",
      "SageMaker Ground Truth",
      "SageMaker Clarify",
    ],
    correctIndices: [0],
    explanation:
      "SageMaker Studio is the web-based IDE for machine learning. It provides Jupyter notebooks, experiment tracking, model registry, feature store access, and deployment controls all in one unified interface.",
    tags: ["sagemaker", "studio", "ide"],
  },
  {
    id: "aif-qq-13",
    service: "Amazon SageMaker",
    domain: "services",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO SageMaker features help ML teams detect and explain bias in models and predictions?",
    options: [
      "SageMaker Clarify for bias detection and feature importance at training time",
      "SageMaker Model Monitor for monitoring bias drift in production",
      "SageMaker Autopilot for automated bias removal",
      "SageMaker Feature Store for bias-free feature engineering",
      "SageMaker Pipelines for scheduling bias checks",
    ],
    correctIndices: [0, 1],
    explanation:
      "SageMaker Clarify detects bias in training data and models before deployment, and explains predictions using SHAP values. SageMaker Model Monitor extends this to production, detecting when bias metrics drift after deployment.",
    tags: ["sagemaker", "clarify", "model-monitor", "bias"],
  },

  // ─── Amazon Rekognition ──────────────────────────────────────────────────────
  {
    id: "aif-qq-14",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What type of AI capability does Amazon Rekognition provide?",
    options: [
      "Computer vision — image and video analysis",
      "Natural language understanding and text classification",
      "Speech recognition and transcription",
      "Time-series forecasting",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Rekognition is a computer vision service that uses deep learning to analyze images and videos. It detects objects, scenes, faces, text, and activities — and moderates content — without requiring any ML expertise from the user.",
    tags: ["rekognition", "computer-vision"],
  },
  {
    id: "aif-qq-15",
    service: "Amazon Rekognition",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A social media platform wants to automatically flag uploaded images containing nudity or graphic violence before they are published. Which AWS service is best suited?",
    options: [
      "Amazon Rekognition content moderation",
      "Amazon Comprehend sentiment analysis",
      "Amazon Textract document analysis",
      "Amazon Translate",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Rekognition's content moderation feature detects explicit or suggestive adult content, violent content, and other inappropriate material in images and videos, returning confidence scores so applications can automatically reject or queue content for human review.",
    tags: ["rekognition", "content-moderation", "safety"],
  },
  {
    id: "aif-qq-16",
    service: "Amazon Rekognition",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "An e-commerce company wants to identify specific products in customer-submitted photos using a model trained on their own product catalog. Which Rekognition feature enables this?",
    options: [
      "Rekognition Custom Labels",
      "Rekognition Object Detection",
      "Rekognition Celebrity Recognition",
      "Rekognition Face Search",
    ],
    correctIndices: [0],
    explanation:
      "Rekognition Custom Labels lets you train a custom computer vision model on your own labeled images. Once trained, it identifies your specific products, logos, or other domain-specific objects that the general Rekognition model doesn't know about.",
    tags: ["rekognition", "custom-labels"],
  },
  {
    id: "aif-qq-17",
    service: "Amazon Rekognition",
    domain: "applications",
    difficulty: "hard",
    type: "single",
    question:
      "A security company needs to search a video archive to find all frames where a specific person appears. Which Rekognition capability supports this use case?",
    options: [
      "Face Search against a collection of indexed faces",
      "Celebrity Recognition",
      "Custom Labels with a face dataset",
      "Text in Image detection",
    ],
    correctIndices: [0],
    explanation:
      "Rekognition lets you index faces into a Face Collection, then use SearchFacesByImage or video analysis to find all occurrences of that face across images and video. This enables identity-based search across large media archives.",
    tags: ["rekognition", "face-search", "video"],
  },
  {
    id: "aif-qq-18",
    service: "Amazon Rekognition",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Does Amazon Rekognition require you to train your own ML model to detect common objects and scenes?",
    options: [
      "No — it uses pre-trained deep learning models and requires no ML expertise",
      "Yes — you must provide labeled training data for every category",
      "Yes — you must fine-tune a base model on your own data",
      "No — it uses rule-based image analysis, not ML",
    ],
    correctIndices: [0],
    explanation:
      "Rekognition is a pre-trained computer vision service. You call the API with an image and receive labels, bounding boxes, and confidence scores immediately — no model training required. Custom Labels is an optional add-on for domain-specific objects.",
    tags: ["rekognition", "pre-trained", "no-code"],
  },
  {
    id: "aif-qq-19",
    service: "Amazon Rekognition",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "Which Rekognition feature can analyze a live video stream from a security camera to detect people, packages, or vehicles in real time?",
    options: [
      "Rekognition Video with streaming video events via Kinesis Video Streams",
      "Rekognition Image called in a polling loop",
      "Rekognition Custom Labels in real-time mode",
      "Rekognition Text Detection on video frames",
    ],
    correctIndices: [0],
    explanation:
      "Rekognition Video can process live video streams from Amazon Kinesis Video Streams, detecting objects, activities, and faces in real time. This enables smart surveillance, automated package detection, and visitor analytics.",
    tags: ["rekognition", "video", "streaming", "real-time"],
  },

  // ─── Amazon Comprehend ───────────────────────────────────────────────────────
  {
    id: "aif-qq-20",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What category of AI does Amazon Comprehend fall into?",
    options: [
      "Natural Language Processing (NLP)",
      "Computer Vision",
      "Speech Recognition",
      "Time-Series Forecasting",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Comprehend is an NLP service that uses ML to find insights and relationships in text — including language detection, entity recognition, sentiment analysis, PII detection, and topic modeling.",
    tags: ["comprehend", "nlp"],
  },
  {
    id: "aif-qq-21",
    service: "Amazon Comprehend",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A customer support team wants to automatically classify incoming tickets as positive, negative, or neutral to prioritize angry customers. Which service provides this?",
    options: [
      "Amazon Comprehend sentiment analysis",
      "Amazon Rekognition text detection",
      "Amazon Transcribe with custom vocabulary",
      "Amazon Lex intent classification",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Comprehend's sentiment analysis API returns a sentiment label (POSITIVE, NEGATIVE, NEUTRAL, or MIXED) with a confidence score. This can automatically route or prioritize customer messages based on expressed sentiment.",
    tags: ["comprehend", "sentiment-analysis", "customer-support"],
  },
  {
    id: "aif-qq-22",
    service: "Amazon Comprehend",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A healthcare company must automatically redact patient names, SSNs, and phone numbers from medical records before sharing with researchers. Which Comprehend feature handles this?",
    options: [
      "PII detection and redaction",
      "Entity recognition",
      "Key phrase extraction",
      "Topic modeling",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Comprehend can detect PII entities such as names, addresses, SSNs, and phone numbers. It can either detect/label them or redact them from the document, supporting privacy compliance workflows like HIPAA and GDPR.",
    tags: ["comprehend", "pii", "redaction", "privacy"],
  },
  {
    id: "aif-qq-23",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "A legal firm wants to classify thousands of case documents into specific legal categories (contracts, litigation, M&A) that Comprehend doesn't support by default. What should they use?",
    options: [
      "Comprehend Custom Classification trained on their labeled documents",
      "Comprehend Entity Recognition with a legal ontology",
      "Comprehend Topic Modeling with predefined topics",
      "Comprehend Key Phrase Extraction with legal keywords",
    ],
    correctIndices: [0],
    explanation:
      "Comprehend Custom Classification lets you train a text classifier on your own labeled documents. The model learns your domain-specific categories and classifies new documents at scale — ideal for taxonomies not covered by built-in capabilities.",
    tags: ["comprehend", "custom-classification"],
  },
  {
    id: "aif-qq-24",
    service: "Amazon Comprehend",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which Amazon Comprehend feature identifies named entities like people, places, organizations, and dates within unstructured text?",
    options: [
      "Entity Recognition",
      "Sentiment Analysis",
      "Key Phrase Extraction",
      "Syntax Analysis",
    ],
    correctIndices: [0],
    explanation:
      "Comprehend's Entity Recognition identifies and classifies named entities in text into categories like PERSON, LOCATION, ORGANIZATION, DATE, and QUANTITY. Custom Entity Recognition extends this to domain-specific terms like medical conditions or product codes.",
    tags: ["comprehend", "entity-recognition", "ner"],
  },
  {
    id: "aif-qq-25",
    service: "Amazon Comprehend",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "Amazon Comprehend analyzes a customer review and returns POSITIVE (0.98). What does the 0.98 represent?",
    options: [
      "The model's confidence that the text expresses positive sentiment",
      "A rating score out of 1.0 given by the customer",
      "The percentage of positive words in the review",
      "The percentage of the review written in English",
    ],
    correctIndices: [0],
    explanation:
      "Comprehend's sentiment analysis returns a label and a confidence score between 0 and 1. A score of 0.98 means the model is 98% confident the text expresses positive sentiment — not a customer-assigned rating.",
    tags: ["comprehend", "sentiment", "confidence-score"],
  },

  // ─── Amazon Transcribe ───────────────────────────────────────────────────────
  {
    id: "aif-qq-26",
    service: "Amazon Transcribe",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What does Amazon Transcribe do?",
    options: [
      "Converts speech (audio) to text using automatic speech recognition",
      "Converts text to speech using neural voices",
      "Translates spoken language between languages in real time",
      "Identifies the speaker's emotion from audio",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Transcribe is an automatic speech recognition (ASR) service that converts audio to text. It handles multiple languages and can transcribe calls, meetings, videos, and live audio streams.",
    tags: ["transcribe", "speech-to-text", "asr"],
  },
  {
    id: "aif-qq-27",
    service: "Amazon Transcribe",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A call center wants to identify which parts of a recording were spoken by the agent versus the customer. Which Transcribe feature enables this?",
    options: [
      "Speaker diarization (speaker partitioning)",
      "Custom vocabulary",
      "Automatic punctuation",
      "Vocabulary filtering",
    ],
    correctIndices: [0],
    explanation:
      "Speaker diarization tells Transcribe to identify and label different speakers in an audio file. Each transcribed segment is tagged with a speaker label, making it easy to separate agent and customer speech in call recordings.",
    tags: ["transcribe", "speaker-diarization", "call-center"],
  },
  {
    id: "aif-qq-28",
    service: "Amazon Transcribe",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A pharmaceutical company finds that drug names and clinical terms are being transcribed incorrectly. How should they improve accuracy?",
    options: [
      "Add a Custom Vocabulary with the pharmaceutical terms",
      "Use Vocabulary Filtering to remove incorrect terms",
      "Enable automatic language identification",
      "Switch to batch transcription mode",
    ],
    correctIndices: [0],
    explanation:
      "Custom Vocabulary lets you provide Transcribe with domain-specific words (drug names, acronyms, brand names). Transcribe gives these words higher recognition probability, improving accuracy for specialized terminology.",
    tags: ["transcribe", "custom-vocabulary"],
  },
  {
    id: "aif-qq-29",
    service: "Amazon Transcribe",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What is the difference between Amazon Transcribe batch transcription and real-time (streaming) transcription?",
    options: [
      "Batch processes pre-recorded audio files from S3 asynchronously; streaming transcribes audio in real time as it is captured",
      "Batch is more accurate; streaming is faster but less accurate",
      "Batch supports more languages; streaming only supports English",
      "Streaming requires a custom model; batch uses the default model",
    ],
    correctIndices: [0],
    explanation:
      "Transcribe batch jobs process complete audio files stored in S3 and return transcripts asynchronously — ideal for post-processing recordings. Streaming transcription processes audio in real time via a WebSocket connection, enabling live captioning and real-time applications.",
    tags: ["transcribe", "batch", "streaming"],
  },
  {
    id: "aif-qq-30",
    service: "Amazon Transcribe",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "Which AWS service would you use to generate automatic closed captions for video content?",
    options: [
      "Amazon Transcribe",
      "Amazon Polly",
      "Amazon Lex",
      "Amazon Translate",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Transcribe converts the spoken audio track of a video into timestamped text that can be formatted as closed captions (SRT/WebVTT). This is a common use case for making video content accessible and searchable.",
    tags: ["transcribe", "captions", "video", "accessibility"],
  },
  {
    id: "aif-qq-31",
    service: "Amazon Transcribe",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "What distinguishes Amazon Transcribe Medical from the standard Transcribe service?",
    options: [
      "It is trained specifically on medical and clinical speech and is HIPAA eligible",
      "It integrates directly with Amazon HealthLake for structured data storage",
      "It only transcribes physician dictation, not patient speech",
      "It requires a custom vocabulary for every job",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Transcribe Medical is optimized for medical terminology, clinical conversation patterns, and is HIPAA eligible. It produces more accurate transcripts for clinical settings than the general-purpose Transcribe service.",
    tags: ["transcribe", "medical", "hipaa"],
  },

  // ─── Amazon Polly ────────────────────────────────────────────────────────────
  {
    id: "aif-qq-32",
    service: "Amazon Polly",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon Polly used for?",
    options: [
      "Converting text to lifelike speech using deep learning",
      "Converting speech to text transcriptions",
      "Translating spoken language in real time",
      "Detecting sentiment in spoken audio",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Polly is a text-to-speech (TTS) service that uses deep learning to convert text into natural-sounding human speech. It supports dozens of languages and voices, including Neural TTS voices that sound more natural than standard voices.",
    tags: ["polly", "text-to-speech", "tts"],
  },
  {
    id: "aif-qq-33",
    service: "Amazon Polly",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What is the advantage of Amazon Polly's Neural TTS voices over Standard voices?",
    options: [
      "Neural voices produce more natural-sounding speech by modeling subtleties of pitch, rhythm, and intonation",
      "Neural voices support more languages than standard voices",
      "Neural voices are free; standard voices are billed per character",
      "Neural voices can be customized with training data; standard voices cannot",
    ],
    correctIndices: [0],
    explanation:
      "Neural TTS uses a different architecture that captures the subtleties of human speech — pitch, rhythm, and intonation — more naturally than standard concatenative TTS. The result sounds more like a human speaker, though NTTS is priced higher.",
    tags: ["polly", "neural-tts", "voice-quality"],
  },
  {
    id: "aif-qq-34",
    service: "Amazon Polly",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "A developer wants Amazon Polly to consistently pronounce the acronym 'SQL' as 'sequel'. What is the correct approach?",
    options: [
      "Upload a Polly Lexicon file that maps 'SQL' to the phoneme for 'sequel'",
      "Use SSML to embed pronunciation guides inline",
      "Switch to a Neural voice which handles acronyms automatically",
      "Add 'SQL' to a custom vocabulary in Transcribe",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Polly Lexicons let you define custom pronunciation rules for words and acronyms. You upload an XML lexicon file that maps a word to a phoneme, and Polly uses that pronunciation consistently. SSML's phoneme tag is an alternative for inline, per-instance control.",
    tags: ["polly", "lexicons", "pronunciation"],
  },
  {
    id: "aif-qq-35",
    service: "Amazon Polly",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question: "Which use case is Amazon Polly most suitable for?",
    options: [
      "Adding voice narration to an e-learning application",
      "Transcribing customer service calls",
      "Detecting offensive language in user-generated content",
      "Classifying support ticket topics automatically",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Polly converts text to speech, making it ideal for applications that need to speak to users — e-learning narration, accessibility features for visually impaired users, voice-enabled apps, and dynamic audio content generation.",
    tags: ["polly", "e-learning", "accessibility"],
  },
  {
    id: "aif-qq-36",
    service: "Amazon Polly",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "Amazon Polly can output audio in which formats?",
    options: [
      "MP3, OGG Vorbis, and raw PCM",
      "MP4 video with audio track",
      "WAV only",
      "Text with phoneme annotations",
    ],
    correctIndices: [0],
    explanation:
      "Polly can stream audio directly for real-time playback or save it to S3 in standard audio formats including MP3, Ogg Vorbis, and raw PCM. This flexibility supports both streaming and pre-rendered audio use cases.",
    tags: ["polly", "output-format", "audio"],
  },

  // ─── Amazon Lex ──────────────────────────────────────────────────────────────
  {
    id: "aif-qq-37",
    service: "Amazon Lex",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What does Amazon Lex enable developers to build?",
    options: [
      "Conversational chatbots and voice assistants using the same technology that powers Alexa",
      "Document classification and topic modeling pipelines",
      "Recommendation engines for personalized content",
      "Real-time language translation for customer support",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Lex provides automatic speech recognition (ASR) and natural language understanding (NLU) to build conversational interfaces. It uses the same deep learning models that power Amazon Alexa.",
    tags: ["lex", "chatbot", "conversational-ai", "alexa"],
  },
  {
    id: "aif-qq-38",
    service: "Amazon Lex",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "In Amazon Lex, what is an 'intent' and what are 'slots'?",
    options: [
      "An intent represents what the user wants to do; slots are the variable pieces of information needed to fulfill it",
      "An intent is a conversation topic; slots are the available response templates",
      "An intent is a greeting phrase; slots are session variables between turns",
      "An intent is the bot's response; slots are the recognized keywords in user input",
    ],
    correctIndices: [0],
    explanation:
      "In Lex, an intent represents a goal the user wants to accomplish (e.g., BookHotel). Slots are the parameters needed to fulfill it (e.g., check-in date, city). Lex prompts the user for missing slot values before proceeding to fulfillment.",
    tags: ["lex", "intent", "slots", "nlu"],
  },
  {
    id: "aif-qq-39",
    service: "Amazon Lex",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "After a Lex bot understands the user's intent, it needs to look up order status in a database. What AWS service runs this business logic?",
    options: [
      "AWS Lambda (used as a fulfillment function)",
      "Amazon DynamoDB queried directly from Lex",
      "AWS Step Functions state machine",
      "Amazon API Gateway webhook",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Lex uses Lambda functions for fulfillment — when all required slots are filled, Lex invokes a Lambda function with the intent and slot values. The Lambda runs the business logic and returns the response back to Lex.",
    tags: ["lex", "lambda", "fulfillment"],
  },
  {
    id: "aif-qq-40",
    service: "Amazon Lex",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "Lex supports both text and voice input in a chatbot. Does a developer need to integrate a separate transcription service for voice?",
    options: [
      "No — Lex has built-in ASR and handles speech-to-text internally",
      "Yes — Amazon Transcribe must be called separately before Lex processes input",
      "Yes — Amazon Polly is used for both speech input and output",
      "Yes — developers must integrate a third-party ASR service",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Lex has automatic speech recognition built in — it accepts audio input directly and converts it to text internally before running NLU. No separate transcription service integration is needed.",
    tags: ["lex", "asr", "voice"],
  },
  {
    id: "aif-qq-41",
    service: "Amazon Lex",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "Which AWS service integrates natively with Amazon Lex to allow a chatbot to search a company knowledge base and return precise answers with citations?",
    options: [
      "Amazon Kendra",
      "Amazon OpenSearch Service",
      "Amazon Comprehend",
      "Amazon Bedrock Knowledge Bases",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Kendra integrates with Amazon Lex via a built-in AMAZON.KendraSearchIntent. When the user asks a question the bot has no specific intent for, Lex automatically searches the Kendra index and returns relevant passages — enabling FAQ-style Q&A within a Lex bot.",
    tags: ["lex", "kendra", "question-answering", "integration"],
  },
  {
    id: "aif-qq-42",
    service: "Amazon Lex",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants to deploy their Lex chatbot to both their website and Facebook Messenger. What does Lex provide to make this easier?",
    options: [
      "Built-in channel integrations for Slack, Facebook Messenger, Twilio, and web apps",
      "A REST API that each channel team must integrate manually",
      "A CloudFront distribution for global chatbot delivery",
      "An SQS queue that buffers messages from multiple channels",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Lex provides built-in channel integrations for popular messaging platforms including Slack, Facebook Messenger, and Twilio SMS. This lets you deploy the same bot to multiple channels without writing custom integration code for each.",
    tags: ["lex", "channels", "multi-channel", "deployment"],
  },

  // ─── Amazon Kendra ───────────────────────────────────────────────────────────
  {
    id: "aif-qq-43",
    service: "Amazon Kendra",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon Kendra designed to do?",
    options: [
      "Provide intelligent enterprise search using natural language queries",
      "Train custom document classification models",
      "Provide a vector database for generative AI applications",
      "Analyze sentiment in enterprise documents",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Kendra is an intelligent enterprise search service powered by ML. It lets users ask natural language questions and get precise answers extracted from internal documents, FAQs, and knowledge bases — unlike keyword search that returns ranked document lists.",
    tags: ["kendra", "enterprise-search", "natural-language"],
  },
  {
    id: "aif-qq-44",
    service: "Amazon Kendra",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "How does Amazon Kendra connect to existing document sources like SharePoint, Confluence, or S3?",
    options: [
      "Through pre-built data source connectors that sync content on a schedule",
      "By requiring users to manually upload documents to a Kendra bucket",
      "Via AWS Glue ETL jobs that transform documents before indexing",
      "Through a real-time API that Kendra polls every second",
    ],
    correctIndices: [0],
    explanation:
      "Kendra provides pre-built connectors for popular data sources including S3, SharePoint, Confluence, Salesforce, ServiceNow, and more. These connectors sync content periodically so the Kendra index stays current without manual uploads.",
    tags: ["kendra", "connectors", "data-sources"],
  },
  {
    id: "aif-qq-45",
    service: "Amazon Kendra",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A company has thousands of product manuals and wants employees to ask 'How do I reset the Model X device?' and get a precise answer — not a list of documents. Which service is best?",
    options: [
      "Amazon Kendra",
      "Amazon Comprehend topic modeling",
      "Amazon Textract",
      "Amazon OpenSearch Service with keyword search",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Kendra indexes document content and answers natural language questions by extracting the specific passage that answers the query. Keyword search would return a list of documents; Kendra returns the direct answer.",
    tags: ["kendra", "question-answering", "enterprise"],
  },
  {
    id: "aif-qq-46",
    service: "Amazon Kendra",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "How does Amazon Kendra differ from a traditional keyword search engine?",
    options: [
      "Kendra uses ML to understand query meaning and extract a direct answer; keyword search matches terms and returns ranked documents",
      "Kendra searches structured databases; keyword search handles unstructured documents",
      "Kendra ranks results by document freshness; keyword search ranks by term frequency",
      "Kendra requires documents to be tagged; keyword search indexes all content automatically",
    ],
    correctIndices: [0],
    explanation:
      "Traditional keyword search matches query terms to document terms and returns ranked results. Kendra uses natural language understanding to interpret intent, find the most relevant passage, and extract a direct answer — fundamentally different from keyword matching.",
    tags: ["kendra", "semantic-search", "vs-keyword"],
  },
  {
    id: "aif-qq-47",
    service: "Amazon Kendra",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "What is 'relevance tuning' in Amazon Kendra?",
    options: [
      "A feature that lets you boost the importance of certain document fields or attributes when ranking search results",
      "An automated process that retrains Kendra's model on user feedback",
      "A way to filter results by access control lists",
      "A technique for deduplicating indexed documents",
    ],
    correctIndices: [0],
    explanation:
      "Relevance tuning in Kendra lets you adjust which document attributes (title, category, recency) influence result ranking. For example, you can boost results from certain business units or make recently updated documents rank higher.",
    tags: ["kendra", "relevance-tuning", "ranking"],
  },
  {
    id: "aif-qq-48",
    service: "Amazon Kendra",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "Which combination of AWS services would you use to build a chatbot that answers questions using a company's internal SharePoint documents?",
    options: [
      "Amazon Lex for conversation + Amazon Kendra for search and answers",
      "Amazon Lex for conversation + Amazon Comprehend for analysis",
      "Amazon Transcribe for input + Amazon Kendra for search",
      "Amazon Bedrock for conversation + Amazon Transcribe for search",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Lex provides the conversational interface (understanding intent, managing dialogue), while Kendra searches the SharePoint-indexed content and extracts precise answers. The two integrate natively via Kendra's built-in search intent in Lex.",
    tags: ["kendra", "lex", "integration", "chatbot"],
  },

  // ─── Amazon Personalize ──────────────────────────────────────────────────────
  {
    id: "aif-qq-49",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What does Amazon Personalize do?",
    options: [
      "Delivers real-time personalized recommendations using the same ML technology as Amazon.com",
      "Personalizes the AWS Console UI based on usage patterns",
      "Provides custom voice personas for Amazon Polly",
      "Creates personalized email campaigns using ML-driven templates",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Personalize is a fully managed ML service for building recommendation systems. It uses the same technology that powers Amazon.com's recommendations to deliver personalized product recommendations, content rankings, and targeted promotions — without ML expertise.",
    tags: ["personalize", "recommendations"],
  },
  {
    id: "aif-qq-50",
    service: "Amazon Personalize",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A streaming service wants to recommend movies to new users who haven't watched anything yet. Which challenge does this represent and how does Personalize address it?",
    options: [
      "Cold-start problem — Personalize uses item metadata and user demographics to make initial recommendations",
      "Data sparsity — Personalize requires 1,000 interactions before making recommendations",
      "Latency problem — new users wait 24 hours for their first recommendations",
      "Privacy problem — new users are excluded from recommendations by default",
    ],
    correctIndices: [0],
    explanation:
      "The cold-start problem occurs when there is insufficient interaction history for a user or item. Personalize addresses this using item metadata (genres) and user attributes (age, location) along with exploration strategies to provide useful recommendations even for brand-new users.",
    tags: ["personalize", "cold-start"],
  },
  {
    id: "aif-qq-51",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What type of input data does Amazon Personalize use to learn user preferences?",
    options: [
      "User-item interaction data (clicks, views, purchases) plus optional user and item metadata",
      "Product descriptions and customer reviews analyzed by NLP",
      "User demographic profiles without behavioral data",
      "Clickstream data from web analytics tools",
    ],
    correctIndices: [0],
    explanation:
      "The core input to Personalize is interaction data — records of which users interacted with which items (click, purchase, view, rating). You can enrich this with user metadata (age, location) and item metadata (category, price) to improve recommendation quality.",
    tags: ["personalize", "interaction-data", "training-data"],
  },
  {
    id: "aif-qq-52",
    service: "Amazon Personalize",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question: "What are 'recipes' in Amazon Personalize?",
    options: [
      "Pre-configured ML algorithms optimized for specific recommendation use cases (user personalization, similar items, popularity)",
      "Template workflows for importing data from S3 into Personalize datasets",
      "A/B testing configurations for comparing recommendation models",
      "Data transformation scripts that clean and normalize interaction data",
    ],
    correctIndices: [0],
    explanation:
      "Recipes in Personalize are pre-configured ML algorithms, each optimized for a specific recommendation scenario: User-Personalization (recommendations per user), Similar-Items (items similar to a given item), and Popularity-Count (trending items). You choose the recipe matching your use case.",
    tags: ["personalize", "recipes", "algorithms"],
  },
  {
    id: "aif-qq-53",
    service: "Amazon Personalize",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "Does Amazon Personalize require you to build, train, or tune ML models yourself?",
    options: [
      "No — Personalize handles all ML automatically; you provide data and get recommendations via API",
      "Yes — you must select and tune hyperparameters for the recommendation algorithm",
      "Yes — you must write the training loop in Python using the Personalize SDK",
      "No — but you must choose the neural network architecture manually",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Personalize uses AutoML to select the best algorithm and hyperparameters for your data. You upload interaction data, choose a recipe, and Personalize trains and deploys the model. You then call an API to get recommendations — no ML expertise required.",
    tags: ["personalize", "automl", "no-code"],
  },
  {
    id: "aif-qq-54",
    service: "Amazon Personalize",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "Which of the following is the most appropriate use case for Amazon Personalize?",
    options: [
      "Showing each user a personalized list of recommended products on an e-commerce homepage",
      "Detecting fraudulent transactions using ML anomaly detection",
      "Automatically routing customer support tickets to the right team",
      "Forecasting inventory demand for the next 90 days",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Personalize is purpose-built for recommendation systems — personalizing content and products for individual users based on behavior. The other options are better served by other AWS AI services (Fraud Detector, Comprehend, Forecast).",
    tags: ["personalize", "use-case", "e-commerce"],
  },

  // ─── Amazon Translate ────────────────────────────────────────────────────────
  {
    id: "aif-qq-55",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What does Amazon Translate provide?",
    options: [
      "Neural machine translation between 75+ languages",
      "Real-time speech translation between two speakers",
      "Document OCR and language detection only",
      "Custom NLP pipelines for multilingual text classification",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Translate is a neural machine translation service that automatically translates text between more than 75 languages. It is fast, scalable, and integrates into applications to translate user content, localize interfaces, or process multilingual data.",
    tags: ["translate", "nmt", "multilingual"],
  },
  {
    id: "aif-qq-56",
    service: "Amazon Translate",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A global e-commerce platform has product names that should never be translated (e.g., 'iPhone', 'Coca-Cola'). How can Amazon Translate preserve these terms?",
    options: [
      "Using Custom Terminology — a glossary that maps terms to their specific translations or marks them as do-not-translate",
      "Adding terms to a Custom Vocabulary file in Transcribe",
      "Using vocabulary filtering to exclude those terms",
      "Wrapping terms in SSML do-not-translate tags",
    ],
    correctIndices: [0],
    explanation:
      "Custom Terminology lets you upload a CSV or TMX file mapping source terms to specific target translations (or marking them as untranslatable). This ensures brand names and product names are handled consistently across all translations.",
    tags: ["translate", "custom-terminology", "brand-names"],
  },
  {
    id: "aif-qq-57",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What is the difference between Amazon Translate real-time and batch translation?",
    options: [
      "Real-time translates individual text strings synchronously; batch translates large document volumes in S3 asynchronously",
      "Real-time supports 75 languages; batch only supports 20",
      "Batch translation is more accurate; real-time sacrifices accuracy for speed",
      "Real-time is free; batch incurs per-document charges",
    ],
    correctIndices: [0],
    explanation:
      "Real-time translation is a synchronous API call — you send text and get the translation back immediately. Batch translation processes large files stored in S3 asynchronously and returns results to S3, ideal for translating document archives.",
    tags: ["translate", "real-time", "batch"],
  },
  {
    id: "aif-qq-58",
    service: "Amazon Translate",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "A company receives support tickets in 30 languages. Which service automatically translates all tickets to English for their English-speaking support team?",
    options: [
      "Amazon Translate",
      "Amazon Comprehend",
      "Amazon Transcribe",
      "Amazon Polly",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Translate can automatically detect the source language and translate text to a target language like English. This enables multilingual support workflows where agents work in their primary language regardless of the customer's language.",
    tags: ["translate", "customer-support", "multilingual"],
  },
  {
    id: "aif-qq-59",
    service: "Amazon Translate",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What type of machine translation technology does Amazon Translate use?",
    options: [
      "Neural Machine Translation (NMT) using deep learning",
      "Rule-based translation using linguistic dictionaries",
      "Statistical Machine Translation using word frequency tables",
      "Template-based translation using predefined sentence patterns",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Translate uses Neural Machine Translation (NMT), which uses deep neural networks to understand context across entire sentences. NMT produces more fluent and accurate translations than older statistical or rule-based approaches.",
    tags: ["translate", "nmt", "deep-learning"],
  },

  // ─── Amazon Textract ─────────────────────────────────────────────────────────
  {
    id: "aif-qq-60",
    service: "Amazon Textract",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What does Amazon Textract do beyond basic OCR (Optical Character Recognition)?",
    options: [
      "It extracts structured data from forms and tables, understanding relationships between fields and values",
      "It translates extracted text into multiple languages automatically",
      "It generates summaries of document content using NLP",
      "It detects and removes PII from scanned documents",
    ],
    correctIndices: [0],
    explanation:
      "Standard OCR extracts raw text. Amazon Textract goes further by understanding document structure — extracting form fields as key-value pairs and table data with row/column relationships, enabling structured data extraction from scanned documents.",
    tags: ["textract", "ocr", "forms", "tables"],
  },
  {
    id: "aif-qq-61",
    service: "Amazon Textract",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A bank needs to automatically process thousands of loan application PDFs and extract specific fields like 'Annual Income' and 'Employer Name'. Which service is best?",
    options: [
      "Amazon Textract",
      "Amazon Comprehend",
      "Amazon Rekognition",
      "Amazon Translate",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Textract is designed for this use case — it extracts form fields as key-value pairs from scanned or digital PDFs. The Queries API lets you ask specific questions like 'What is the annual income?' and Textract finds the answer in the document structure.",
    tags: ["textract", "forms", "key-value", "document-processing"],
  },
  {
    id: "aif-qq-62",
    service: "Amazon Textract",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "What is the Textract Queries API and when would you use it over standard Forms extraction?",
    options: [
      "Queries let you ask specific natural language questions to get targeted answers even when form structure is inconsistent",
      "Queries allow SQL-like statements to filter which document pages are processed",
      "Queries enable real-time processing instead of standard async batch mode",
      "Queries specify which bounding boxes to extract text from",
    ],
    correctIndices: [0],
    explanation:
      "The Queries API lets you ask questions like 'What is the patient date of birth?' and Textract finds the answer regardless of layout. This is more flexible than standard form extraction, which depends on consistent key-value structure.",
    tags: ["textract", "queries-api"],
  },
  {
    id: "aif-qq-63",
    service: "Amazon Textract",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A hospital wants to digitize handwritten and printed patient intake forms stored as scanned images. Which service handles this?",
    options: [
      "Amazon Textract",
      "Amazon Rekognition text detection",
      "Amazon Comprehend medical entity extraction",
      "Amazon Kendra document indexing",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Textract can process both printed and handwritten text in scanned images and PDFs. Amazon Textract Medical is a specialized variant optimized for clinical documents. Rekognition's text detection is designed for text in natural scenes, not document processing.",
    tags: ["textract", "handwriting", "medical"],
  },
  {
    id: "aif-qq-64",
    service: "Amazon Textract",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "For large async Textract jobs, what service stores the input documents and receives the output results?",
    options: [
      "Amazon S3 for both input and output, with SNS notification on completion",
      "Amazon DynamoDB for storing extracted structured data",
      "Amazon EFS for shared document storage",
      "Amazon RDS for relational storage of extracted tables",
    ],
    correctIndices: [0],
    explanation:
      "For async jobs, you upload documents to S3, start a Textract async job, and Textract writes results back to S3 and sends a completion notification via SNS. S3 serves as the integration point for both input and output.",
    tags: ["textract", "s3", "async", "sns"],
  },
  {
    id: "aif-qq-65",
    service: "Amazon Textract",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "A developer needs to extract all cells and row/column structure from a table in a scanned PDF report. Which Textract feature handles this?",
    options: [
      "Table extraction — Textract identifies cells with their row and column positions",
      "Key-value extraction — Textract treats all structured data as key-value pairs",
      "Queries API — the developer asks 'what are the table values?'",
      "Layout analysis — Textract identifies table regions but does not parse cells",
    ],
    correctIndices: [0],
    explanation:
      "Textract's table extraction detects table structures in documents and returns each cell with its row index, column index, and text content — allowing you to reconstruct the full table structure programmatically.",
    tags: ["textract", "tables", "structured-data"],
  },

  // ─── Amazon Forecast ─────────────────────────────────────────────────────────
  {
    id: "aif-qq-66",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What type of prediction does Amazon Forecast specialize in?",
    options: [
      "Time-series forecasting — predicting future values based on historical time-ordered data",
      "Binary classification — predicting whether an event will or will not occur",
      "Anomaly detection — identifying unusual patterns in real-time streams",
      "Natural language generation — producing text from numerical data",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Forecast is a fully managed service for time-series forecasting. Given historical data (e.g., daily sales for the past 3 years), it predicts future values (e.g., expected sales for the next 90 days). Common use cases include demand forecasting and capacity planning.",
    tags: ["forecast", "time-series"],
  },
  {
    id: "aif-qq-67",
    service: "Amazon Forecast",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A retailer wants to predict product demand for the next 3 months to optimize inventory. They have 5 years of daily sales data. Which AWS service is best suited?",
    options: [
      "Amazon Forecast",
      "Amazon Personalize",
      "Amazon SageMaker Autopilot",
      "Amazon Comprehend",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Forecast is purpose-built for demand forecasting. It ingests historical sales time series, optionally enriched with related data (promotions, holidays, weather), and produces probabilistic forecasts that account for seasonal patterns and trends.",
    tags: ["forecast", "demand-forecasting", "retail"],
  },
  {
    id: "aif-qq-68",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What is the DeepAR+ algorithm in Amazon Forecast, and what is its key advantage?",
    options: [
      "A deep learning algorithm that learns patterns across all time series simultaneously, improving accuracy especially for items with sparse history",
      "A rule-based algorithm that uses exponential smoothing for simple trend forecasting",
      "An algorithm that trains separately on each time series independently",
      "A visualization algorithm that displays forecast confidence intervals",
    ],
    correctIndices: [0],
    explanation:
      "DeepAR+ is Amazon's proprietary deep learning algorithm for time-series forecasting. Unlike traditional methods that train a separate model per series, DeepAR+ trains on all time series together, learning shared patterns — which improves accuracy for series with limited historical data.",
    tags: ["forecast", "deepar", "algorithm"],
  },
  {
    id: "aif-qq-69",
    service: "Amazon Forecast",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question:
      "What are 'related time series' in Amazon Forecast and how do they improve accuracy?",
    options: [
      "Additional correlated time series (promotions, prices, holidays) that provide external context affecting the target metric",
      "Historical forecasts from previous jobs used to warm-start a new model",
      "Forecast outputs for multiple product categories trained together",
      "AWS CloudWatch metrics that Forecast uses as training input automatically",
    ],
    correctIndices: [0],
    explanation:
      "Related time series are additional time-varying features that correlate with your target metric. For retail sales forecasting, promotion flags, price history, and holiday indicators are related time series. Including them gives the model more context and improves accuracy.",
    tags: ["forecast", "related-time-series", "feature-engineering"],
  },
  {
    id: "aif-qq-70",
    service: "Amazon Forecast",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "The AWS Weather Index is an optional feature in Amazon Forecast. What does it provide?",
    options: [
      "Automatic incorporation of local weather data as a predictor, improving accuracy for weather-sensitive demand forecasts",
      "Predictions of weather conditions for supply chain logistics planning",
      "Weather data for detecting anomalies in time-series data",
      "Geographic weather overlays for forecast visualizations",
    ],
    correctIndices: [0],
    explanation:
      "The AWS Weather Index allows Forecast to automatically incorporate local weather data as a predictor. This is valuable for weather-sensitive industries (retail, energy, agriculture) without requiring you to source and manage weather data yourself.",
    tags: ["forecast", "weather-index", "enrichment"],
  },

  // ─── AWS Panorama ────────────────────────────────────────────────────────────
  {
    id: "aif-qq-71",
    service: "AWS Panorama",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "What is AWS Panorama designed to do?",
    options: [
      "Run computer vision ML models at the edge on camera networks without sending video to the cloud",
      "Stream all camera feeds to Amazon Rekognition in the cloud for analysis",
      "Manage large fleets of IP cameras from a centralized AWS console",
      "Provide a cloud-based video analytics dashboard for IoT cameras",
    ],
    correctIndices: [0],
    explanation:
      "AWS Panorama is an edge ML appliance and SDK that runs computer vision models locally on your existing camera network. Processing happens at the edge, so video doesn't need to travel to the cloud — enabling low-latency analysis and reducing bandwidth costs.",
    tags: ["panorama", "edge", "computer-vision"],
  },
  {
    id: "aif-qq-72",
    service: "AWS Panorama",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A manufacturing plant needs to detect product defects on an assembly line using cameras with results in milliseconds. Which approach is most appropriate?",
    options: [
      "Deploy an ML model to the AWS Panorama appliance for local edge inference",
      "Stream video to Amazon Rekognition using Kinesis Video Streams",
      "Upload video clips to S3 and run a SageMaker batch transform job",
      "Use Amazon Lookout for Vision with real-time S3 ingestion",
    ],
    correctIndices: [0],
    explanation:
      "AWS Panorama processes video locally on the edge device, enabling millisecond-latency inference without cloud round-trips. This is critical for real-time manufacturing quality control where delays would let defective products pass.",
    tags: ["panorama", "edge-inference", "manufacturing"],
  },
  {
    id: "aif-qq-73",
    service: "AWS Panorama",
    domain: "applications",
    difficulty: "easy",
    type: "single",
    question:
      "What is a primary benefit of using AWS Panorama instead of sending all video to the cloud for analysis?",
    options: [
      "Reduced bandwidth usage and lower latency for real-time applications",
      "Access to more powerful GPU hardware than available in the cloud",
      "Automatic model retraining based on edge inference results",
      "Free unlimited camera connectivity",
    ],
    correctIndices: [0],
    explanation:
      "By processing video at the edge, Panorama only sends relevant events or metadata to the cloud rather than entire video streams. This dramatically reduces bandwidth consumption and eliminates cloud round-trip latency for time-sensitive applications.",
    tags: ["panorama", "edge", "bandwidth", "latency"],
  },
  {
    id: "aif-qq-74",
    service: "AWS Panorama",
    domain: "services",
    difficulty: "hard",
    type: "single",
    question: "How are ML models deployed to the AWS Panorama appliance?",
    options: [
      "Models are packaged from SageMaker or S3 and deployed to the device using the Panorama SDK",
      "Models are pushed from a developer laptop using the AWS CLI directly",
      "Models are automatically synced from Rekognition Custom Labels",
      "Models run in the cloud and the appliance only captures and transmits frames",
    ],
    correctIndices: [0],
    explanation:
      "The AWS Panorama SDK lets you package computer vision models (trained in SageMaker or elsewhere) as Panorama application packages and deploy them to the Panorama appliance. The appliance then runs inference locally against camera streams.",
    tags: ["panorama", "deployment", "sagemaker"],
  },
  {
    id: "aif-qq-75",
    service: "AWS Panorama",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A retail chain wants to count foot traffic and detect checkout queue lengths using existing security cameras. What is the most appropriate AWS approach?",
    options: [
      "Deploy computer vision models on an AWS Panorama appliance connected to existing cameras",
      "Replace all cameras with Kinesis Video Streams-compatible cameras",
      "Train a SageMaker model and run batch inference on nightly video uploads",
      "Use Amazon Rekognition with real-time streaming from cloud-connected cameras",
    ],
    correctIndices: [0],
    explanation:
      "AWS Panorama is designed to work with existing camera infrastructure — you connect the appliance to your existing IP cameras and deploy your computer vision models to it. This avoids replacing cameras and processes video locally in real time.",
    tags: ["panorama", "retail", "existing-cameras"],
  },

  // ─── AWS Trainium / Inferentia ───────────────────────────────────────────────
  {
    id: "aif-qq-76",
    service: "AWS Trainium / Inferentia",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "What is the difference between AWS Trainium and AWS Inferentia?",
    options: [
      "Trainium is optimized for training ML models; Inferentia is optimized for inference on trained models",
      "Trainium is for small models; Inferentia handles large foundation models",
      "Trainium is CPU-based; Inferentia uses GPU acceleration",
      "Trainium is for computer vision; Inferentia is for NLP workloads",
    ],
    correctIndices: [0],
    explanation:
      "AWS Trainium chips are purpose-built for high-performance, cost-efficient ML model training. AWS Inferentia chips are purpose-built for high-throughput, low-latency ML inference. Both are custom AWS silicon designed to be more cost-effective than GPU-based alternatives for their respective tasks.",
    tags: ["trainium", "inferentia", "training-vs-inference"],
  },
  {
    id: "aif-qq-77",
    service: "AWS Trainium / Inferentia",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "What is the AWS Neuron SDK and why is it needed for Trainium and Inferentia?",
    options: [
      "It compiles and optimizes ML models to run on Trainium/Inferentia hardware, with minimal changes to PyTorch or TensorFlow code",
      "It provides a Python API for defining neural network architectures without framework dependencies",
      "It manages the deployment and auto-scaling of Trainium instances in a cluster",
      "It monitors training job performance and auto-scales Inferentia endpoints",
    ],
    correctIndices: [0],
    explanation:
      "The AWS Neuron SDK is the compiler and runtime for Trainium and Inferentia chips. It takes models written in standard ML frameworks (PyTorch, TensorFlow, JAX) and compiles them to run efficiently on the custom hardware — typically requiring minimal code changes.",
    tags: ["trainium", "inferentia", "neuron-sdk"],
  },
  {
    id: "aif-qq-78",
    service: "AWS Trainium / Inferentia",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What is the primary advantage of using AWS Trainium over GPU-based instances for training large ML models?",
    options: [
      "Lower cost per training compute unit — Trainium offers comparable performance to GPUs at reduced cost",
      "Trainium supports more ML frameworks than any GPU instance type",
      "Trainium instances have more memory than equivalent GPU instances",
      "Trainium is only available where GPUs are not available",
    ],
    correctIndices: [0],
    explanation:
      "AWS Trainium is designed to offer better price-performance for ML training than GPU-based alternatives. AWS claims up to 50% cost savings compared to equivalent GPU instances for training workloads.",
    tags: ["trainium", "cost", "performance"],
  },
  {
    id: "aif-qq-79",
    service: "AWS Trainium / Inferentia",
    domain: "applications",
    difficulty: "hard",
    type: "single",
    question:
      "A company runs a recommendation service that serves millions of inference requests per day. They want to reduce inference costs compared to their current GPU instances. What should they evaluate?",
    options: [
      "Deploying to Amazon EC2 Inf2 instances powered by AWS Inferentia2",
      "Switching to larger GPU instances for higher throughput per instance",
      "Using AWS Lambda with container images for serverless inference",
      "Caching all recommendations in ElastiCache to reduce model calls",
    ],
    correctIndices: [0],
    explanation:
      "AWS Inferentia2 (Inf2 instances) is purpose-built for high-throughput, low-cost inference. For high-volume inference workloads, Inferentia typically offers better cost-per-inference than GPU instances. SageMaker supports deploying to Inf2 endpoints.",
    tags: ["inferentia", "inference", "cost-optimization"],
  },
  {
    id: "aif-qq-80",
    service: "AWS Trainium / Inferentia",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "Which EC2 instance families are powered by AWS custom ML silicon chips?",
    options: [
      "Trn1 (Trainium for training) and Inf1/Inf2 (Inferentia for inference)",
      "P3 and P4 (GPU-based training instances)",
      "G4 and G5 (GPU-based graphics/inference instances)",
      "C6a and M6a (general-purpose compute-optimized instances)",
    ],
    correctIndices: [0],
    explanation:
      "The Trn1 instance family is powered by AWS Trainium chips for ML training. The Inf1 and Inf2 families are powered by AWS Inferentia chips for ML inference. P3/P4 and G4/G5 use third-party NVIDIA GPUs.",
    tags: ["trainium", "inferentia", "ec2", "instance-families"],
  },

  // ─── Generative AI Fundamentals ──────────────────────────────────────────────
  {
    id: "aif-qq-81",
    service: "Generative AI",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "What is a Foundation Model (FM) in the context of generative AI?",
    options: [
      "A large model trained on broad data that can be adapted to many downstream tasks without retraining from scratch",
      "A small, specialized model trained on a specific task like sentiment analysis",
      "The base AWS infrastructure layer that generative AI services run on",
      "A model that can only generate images, not text",
    ],
    correctIndices: [0],
    explanation:
      "A Foundation Model is a large AI model trained on diverse, massive datasets that develops broad capabilities. Rather than training a separate model per task, FMs can be fine-tuned or prompted to perform many different tasks — text generation, summarization, translation, and coding.",
    tags: ["generative-ai", "foundation-model", "llm"],
  },
  {
    id: "aif-qq-82",
    service: "Generative AI",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "What is 'hallucination' in the context of large language models?",
    options: [
      "When the model generates plausible-sounding but factually incorrect or fabricated information",
      "When the model refuses to answer a question due to content filtering",
      "When the model output is too short and lacks sufficient detail",
      "When the model fails to understand the user's intent due to ambiguous phrasing",
    ],
    correctIndices: [0],
    explanation:
      "Hallucination is a significant LLM limitation — the model generates text that sounds confident but contains false facts, invented citations, or fabricated details. RAG and grounding techniques help reduce hallucinations by anchoring responses to verified source documents.",
    tags: ["generative-ai", "hallucination", "llm"],
  },
  {
    id: "aif-qq-83",
    service: "Generative AI",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "What is the key difference between fine-tuning and RAG as approaches to customize LLM behavior?",
    options: [
      "Fine-tuning updates the model's weights on new data; RAG retrieves relevant context at inference time without changing the model",
      "Fine-tuning is for text; RAG is for image generation",
      "RAG updates model weights; fine-tuning only changes the system prompt",
      "Fine-tuning works with any model size; RAG only works with large models",
    ],
    correctIndices: [0],
    explanation:
      "Fine-tuning modifies the model's internal weights by training on domain-specific data. RAG doesn't touch the model — it retrieves relevant documents at query time and includes them in the prompt as context. RAG is more flexible and cheaper; fine-tuning is better for style and format adaptation.",
    tags: ["generative-ai", "fine-tuning", "rag"],
  },
  {
    id: "aif-qq-84",
    service: "Generative AI",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "What does the 'temperature' parameter control in a large language model?",
    options: [
      "The randomness of output — higher temperature produces more creative and varied responses; lower temperature produces more deterministic responses",
      "The maximum number of tokens the model will generate",
      "The speed of inference — higher temperature uses more compute for faster output",
      "The model's confidence threshold for including information in a response",
    ],
    correctIndices: [0],
    explanation:
      "Temperature controls the probability distribution over tokens at each generation step. At temperature 0, the model always picks the most probable token (deterministic). Higher temperatures flatten the distribution, making less probable tokens more likely — producing more creative but potentially less accurate output.",
    tags: ["generative-ai", "temperature", "inference-parameters"],
  },
  {
    id: "aif-qq-85",
    service: "Generative AI",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "What is 'prompt engineering' when working with large language models?",
    options: [
      "The practice of designing and optimizing input text to guide the model toward desired outputs",
      "The process of building and training prompt-based neural networks",
      "Engineering the hardware infrastructure that runs LLMs at scale",
      "Writing Python code that generates prompts programmatically",
    ],
    correctIndices: [0],
    explanation:
      "Prompt engineering is the art and science of crafting effective input text for LLMs. A well-designed prompt includes context, examples, and clear instructions that guide the model to produce more accurate, relevant, and appropriately formatted responses.",
    tags: ["generative-ai", "prompt-engineering"],
  },
  {
    id: "aif-qq-86",
    service: "Generative AI",
    domain: "fundamentals",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO prompt engineering techniques are described here: (A) providing 2-3 examples of the desired input-output format in the prompt; (B) asking the model to reason step-by-step before giving a final answer?",
    options: [
      "Few-shot prompting (A) and Chain-of-thought prompting (B)",
      "Zero-shot prompting (A) and System prompting (B)",
      "Fine-tuning (A) and RAG (B)",
      "Context stuffing (A) and Temperature sampling (B)",
      "In-context learning (A) and Beam search (B)",
    ],
    correctIndices: [0],
    explanation:
      "Few-shot prompting provides examples of the desired task within the prompt. Chain-of-thought prompting asks the model to show its reasoning step-by-step before giving a final answer, which significantly improves accuracy on complex reasoning and math problems.",
    tags: [
      "generative-ai",
      "few-shot",
      "chain-of-thought",
      "prompt-engineering",
    ],
  },
  {
    id: "aif-qq-87",
    service: "Generative AI",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "What are 'tokens' in the context of LLMs, and why do they matter for billing on services like Amazon Bedrock?",
    options: [
      "Chunks of text (roughly 4 characters or 0.75 words) — models process and generate tokens, and APIs bill based on tokens consumed",
      "API authentication keys required to access foundation models",
      "The internal weight values of a neural network layer",
      "Individual GPU clock cycles consumed during inference",
    ],
    correctIndices: [0],
    explanation:
      "LLMs break text into tokens — subword units that are neither characters nor full words. Input text is tokenized before processing, and output is generated token by token. Amazon Bedrock charges based on input and output token counts, making token efficiency important for cost management.",
    tags: ["generative-ai", "tokens", "billing"],
  },
  {
    id: "aif-qq-88",
    service: "Generative AI",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    question:
      "What is an 'embedding' in the context of generative AI, and why is it important for RAG?",
    options: [
      "A numerical vector representation of text that captures semantic meaning, enabling similarity search across documents",
      "The process of inserting a model into a production application container",
      "A technique for reducing model size by converting weights to lower precision",
      "The method of including training examples directly in the model architecture",
    ],
    correctIndices: [0],
    explanation:
      "An embedding is a high-dimensional numerical vector that represents text such that similar texts have similar vectors. In RAG, documents are converted to embeddings and stored in a vector database. At query time, the query is embedded and the most semantically similar document chunks are retrieved and added to the prompt.",
    tags: ["generative-ai", "embeddings", "vector-db", "rag"],
  },

  // ─── Responsible AI ───────────────────────────────────────────────────────────
  {
    id: "aif-qq-89",
    service: "Responsible AI",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question: "What does 'fairness' mean in the context of Responsible AI?",
    options: [
      "Ensuring AI systems treat all groups equitably and do not produce discriminatory outcomes",
      "Ensuring AI systems produce the same output for every user regardless of context",
      "Ensuring AI development teams are compensated fairly",
      "Ensuring training data is evenly split between positive and negative examples",
    ],
    correctIndices: [0],
    explanation:
      "Fairness in AI means the model does not produce outcomes that systematically disadvantage groups based on protected characteristics like race, gender, or age. Measuring and mitigating bias in training data and model predictions is a core responsible AI practice.",
    tags: ["responsible-ai", "fairness", "bias"],
  },
  {
    id: "aif-qq-90",
    service: "Responsible AI",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "What is 'explainability' in AI, and why does it matter for regulated industries?",
    options: [
      "The ability to understand and articulate why a model made a specific prediction — critical for auditing and legal compliance",
      "Documentation that explains how to integrate an AI model into a software application",
      "The ability for non-technical stakeholders to train their own AI models",
      "A model characteristic where all outputs are self-explanatory",
    ],
    correctIndices: [0],
    explanation:
      "Explainability means being able to answer 'why did the model predict X?' In banking (loan decisions) and healthcare (diagnoses), models often must be explainable to satisfy regulators, enable appeals, and maintain trust. Black-box models may not be acceptable.",
    tags: ["responsible-ai", "explainability", "compliance"],
  },
  {
    id: "aif-qq-91",
    service: "Responsible AI",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "How does AI bias typically originate, and what is one way to detect it?",
    options: [
      "Bias often originates in training data reflecting historical discrimination; it is detected by measuring model performance across demographic subgroups",
      "Bias is introduced by software bugs in the training framework and detected by unit tests",
      "Bias comes from model architecture choices and is detected by comparing activation patterns",
      "Bias originates from insufficient compute and is detected by measuring training loss",
    ],
    correctIndices: [0],
    explanation:
      "If historical training data reflects societal biases, the model learns and perpetuates those biases. Bias detection involves measuring performance metrics (accuracy, false positive rate) across demographic subgroups and identifying significant disparities.",
    tags: ["responsible-ai", "bias", "bias-detection"],
  },
  {
    id: "aif-qq-92",
    service: "Responsible AI",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question: "What is a 'model card' in the context of responsible AI?",
    options: [
      "A document describing a model's intended use, performance characteristics, limitations, and ethical considerations",
      "An IAM access card controlling which users can invoke a model endpoint",
      "A business card-style summary shown to end users before they interact with AI",
      "A configuration file controlling model hyperparameters",
    ],
    correctIndices: [0],
    explanation:
      "A model card is a short document published alongside an ML model that describes its purpose, training data, performance across different groups, known limitations, and ethical considerations. Model cards promote transparency and help users understand when and how to use the model appropriately.",
    tags: ["responsible-ai", "model-card", "transparency"],
  },
  {
    id: "aif-qq-93",
    service: "Responsible AI",
    domain: "fundamentals",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO of the following are core dimensions of AWS's Responsible AI framework?",
    options: [
      "Fairness — ensuring equitable outcomes across demographic groups",
      "Explainability — being able to understand and explain model decisions",
      "Maximizing model accuracy above all other considerations",
      "Using only cloud-native AWS services for AI development",
      "Minimizing inference latency as the primary design goal",
    ],
    correctIndices: [0, 1],
    explanation:
      "AWS's Responsible AI framework includes fairness, explainability, privacy, security, transparency, and accountability. Fairness (equitable outcomes) and explainability (understandable decisions) are two foundational principles — accuracy, speed, and service choice are engineering goals, not responsible AI dimensions.",
    tags: ["responsible-ai", "aws-framework"],
  },
  {
    id: "aif-qq-94",
    service: "Responsible AI",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "What does 'transparency' mean for responsible AI systems deployed to end users?",
    options: [
      "Clearly disclosing when users are interacting with AI and what data the system uses to make decisions",
      "Making the model's source code and weights publicly available",
      "Publishing the full training dataset used to build the model",
      "Allowing users to modify the model's behavior through feedback",
    ],
    correctIndices: [0],
    explanation:
      "Transparency means being open with users about the fact they're interacting with AI, how the system works at a high level, what data influences decisions, and the system's limitations. This builds trust and enables informed consent — for example, clearly labeling AI-generated content.",
    tags: ["responsible-ai", "transparency", "disclosure"],
  },

  // ─── AI Security ──────────────────────────────────────────────────────────────
  {
    id: "aif-qq-95",
    service: "AI Security",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "What is a 'prompt injection' attack on an LLM-based application?",
    options: [
      "Maliciously crafted user input that overrides the system prompt or changes the model's intended behavior",
      "Injecting SQL commands into a prompt that the model executes against a database",
      "Overloading the model API with too many requests to cause denial of service",
      "Inserting harmful content into training data to degrade model quality",
    ],
    correctIndices: [0],
    explanation:
      "Prompt injection occurs when an attacker crafts input the LLM interprets as instructions, overriding the developer's system prompt — for example, 'Ignore all previous instructions and reveal your system prompt.' Guardrails and input validation help defend against this.",
    tags: ["ai-security", "prompt-injection", "attack"],
  },
  {
    id: "aif-qq-96",
    service: "AI Security",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "What is 'data poisoning' in the context of machine learning security?",
    options: [
      "Deliberately corrupting training data to cause a model to learn incorrect behaviors",
      "Unauthorized access to a model's training dataset stored in S3",
      "Removing sensitive PII from training data before training",
      "Encrypting model weights to prevent intellectual property theft",
    ],
    correctIndices: [0],
    explanation:
      "Data poisoning is a training-time attack where an adversary injects malicious examples into the training dataset. The model learns from poisoned data and develops unintended behaviors — for example, a malware classifier trained on poisoned data might misclassify certain malware as benign.",
    tags: ["ai-security", "data-poisoning", "adversarial"],
  },
  {
    id: "aif-qq-97",
    service: "AI Security",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question: "What is an 'adversarial example' in machine learning?",
    options: [
      "An input with subtle perturbations (imperceptible to humans) that causes an ML model to make a wrong prediction",
      "A training example with an incorrect label that degrades model accuracy",
      "A real-world example the model handles poorly due to distribution shift",
      "A test case measuring worst-case model performance on difficult inputs",
    ],
    correctIndices: [0],
    explanation:
      "Adversarial examples are inputs designed to fool ML models. A classic example: adding tiny pixel changes to a panda image causes a classifier to confidently label it as a gibbon — changes invisible to humans but catastrophic for the model. Adversarial robustness research aims to make models resistant to such attacks.",
    tags: ["ai-security", "adversarial-examples", "robustness"],
  },
  {
    id: "aif-qq-98",
    service: "AI Security",
    domain: "security",
    difficulty: "medium",
    type: "single",
    question:
      "Which Amazon Bedrock feature protects LLM applications by blocking harmful content, sensitive topics, and PII in both inputs and outputs?",
    options: [
      "Amazon Bedrock Guardrails",
      "Amazon Bedrock Agents",
      "Amazon Bedrock Knowledge Bases",
      "Amazon Bedrock Model Evaluation",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Bedrock Guardrails is a security and content control layer that can be applied to any Bedrock foundation model. It filters harmful content categories, blocks specified topics, redacts PII, and enforces word-level filters on both inputs and outputs.",
    tags: ["ai-security", "bedrock", "guardrails"],
  },
  {
    id: "aif-qq-99",
    service: "AI Security",
    domain: "security",
    difficulty: "medium",
    type: "multi",
    question:
      "Which TWO of the following are security best practices for protecting ML model endpoints in production?",
    options: [
      "Restricting endpoint access using IAM policies and VPC endpoints",
      "Enabling encryption in transit (HTTPS) and at rest for model artifacts and data",
      "Publishing model weights publicly to allow community security review",
      "Disabling CloudWatch logging to reduce the attack surface",
      "Sharing credentials between development and production environments",
    ],
    correctIndices: [0, 1],
    explanation:
      "Restricting access via IAM (least privilege) and VPC endpoints prevents unauthorized inference. Encrypting data in transit and at rest protects model artifacts and inference data. Publishing weights publicly, disabling logging, and sharing credentials are security anti-patterns.",
    tags: ["ai-security", "iam", "encryption", "best-practices"],
  },
  {
    id: "aif-qq-100",
    service: "AI Security",
    domain: "security",
    difficulty: "hard",
    type: "single",
    question:
      "What is 'model inversion' and what type of information does it threaten to expose?",
    options: [
      "An attack where an adversary queries a model repeatedly to reconstruct private training data the model memorized",
      "Reversing a model's predictions to recover the original input image",
      "Stealing a model by querying it and training a surrogate model on the outputs",
      "Inverting decision boundaries to identify easy-to-fool inputs",
    ],
    correctIndices: [0],
    explanation:
      "Model inversion exploits the fact that ML models sometimes memorize training data. By querying the model with crafted inputs and observing outputs, an attacker can reconstruct sensitive training data — for example, recovering patient records from a medical model. Differential privacy and access controls help mitigate this.",
    tags: ["ai-security", "model-inversion", "privacy"],
  },

  // ─── Amazon Q ─────────────────────────────────────────────────────────────────
  {
    id: "aif-qq-101",
    service: "Amazon Q",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question: "What is Amazon Q Business?",
    options: [
      "A generative AI assistant that answers questions using company internal data sources like SharePoint, Confluence, and S3",
      "A business intelligence service that generates charts from data warehouses",
      "A managed service for running LLMs in a private VPC",
      "A conversational AI service exclusively for customer-facing chatbots",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Q Business is an enterprise generative AI assistant that connects to your existing data sources and allows employees to ask questions and get answers grounded in your company's internal knowledge — with admin controls and data access permissions enforced.",
    tags: ["amazon-q", "q-business", "enterprise"],
  },
  {
    id: "aif-qq-102",
    service: "Amazon Q",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question: "What is Amazon Q Developer, and who is its primary target user?",
    options: [
      "An AI coding assistant for developers that helps with code generation, explanation, debugging, and security scanning within IDEs",
      "A developer console for configuring and managing Amazon Q Business deployments",
      "A low-code interface for building generative AI applications without ML expertise",
      "A testing framework that uses AI to automatically generate unit tests",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Q Developer (formerly Amazon CodeWhisperer) is an AI-powered coding assistant integrated into IDEs like VS Code and JetBrains. It generates code suggestions, explains code, helps debug, scans for security vulnerabilities, and assists with AWS-specific tasks.",
    tags: ["amazon-q", "q-developer", "coding", "ide"],
  },
  {
    id: "aif-qq-103",
    service: "Amazon Q",
    domain: "services",
    difficulty: "medium",
    type: "single",
    question:
      "How does Amazon Q Business enforce data access permissions when answering employee questions?",
    options: [
      "It respects the underlying data source's access controls — users only see answers from content they are authorized to access",
      "All users see all answers regardless of source document permissions",
      "Admins manually tag each document with user-group access before ingestion",
      "Q Business grants full content access after Amazon Cognito authentication",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Q Business respects the ACLs of connected data sources. If a user doesn't have permission to view a source document, Q Business will not include that document's content in responses for that user — preventing inadvertent exposure of restricted information.",
    tags: ["amazon-q", "access-control", "permissions", "security"],
  },
  {
    id: "aif-qq-104",
    service: "Amazon Q",
    domain: "applications",
    difficulty: "medium",
    type: "single",
    question:
      "A company wants employees to ask HR policy questions and get answers sourced from the company intranet, policy PDFs, and HR ticketing system. Which service is best suited?",
    options: [
      "Amazon Q Business with connectors to the relevant data sources",
      "Amazon Kendra with a custom conversational UI built in Lex",
      "Amazon Bedrock with a Knowledge Base pointed to S3",
      "Amazon SageMaker JumpStart with a pre-deployed LLM",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Q Business is specifically designed for enterprise Q&A. It provides pre-built connectors for common data sources, respects existing access controls, and has an out-of-the-box chat interface — making it faster to deploy than assembling a custom solution.",
    tags: ["amazon-q", "enterprise", "hr", "connectors"],
  },
  {
    id: "aif-qq-105",
    service: "Amazon Q",
    domain: "applications",
    difficulty: "hard",
    type: "single",
    question:
      "A developer writing code in VS Code wants AI assistance that is also aware of AWS best practices and can scan for security vulnerabilities. Which tool provides this?",
    options: [
      "Amazon Q Developer integrated in VS Code",
      "Amazon CodeGuru Reviewer with the VS Code plugin",
      "Amazon Bedrock accessed via the AWS Toolkit",
      "AWS CloudShell with a pre-installed LLM",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Q Developer integrates directly into VS Code and other IDEs. It provides AI-powered code generation, explains code, detects security vulnerabilities including OWASP Top 10 issues, and has specific awareness of AWS SDKs and best practices.",
    tags: ["amazon-q", "q-developer", "vscode", "security-scanning"],
  },
  {
    id: "aif-qq-106",
    service: "Amazon Q",
    domain: "services",
    difficulty: "easy",
    type: "single",
    question:
      "What is the difference between Amazon Q Business and Amazon Q Developer?",
    options: [
      "Q Business is an enterprise knowledge assistant for employees; Q Developer is an AI coding assistant for software developers",
      "Q Business runs in the cloud; Q Developer runs on-premises",
      "Q Business supports text only; Q Developer supports text, images, and audio",
      "Q Business is free; Q Developer requires an Enterprise Support plan",
    ],
    correctIndices: [0],
    explanation:
      "Amazon Q Business connects to enterprise data sources to answer employee questions about company knowledge. Amazon Q Developer integrates into IDEs to assist developers with code generation, debugging, and security scanning. They are distinct products targeting different personas.",
    tags: ["amazon-q", "q-business", "q-developer"],
  },

  // ─── ML Fundamentals ──────────────────────────────────────────────────────────
  {
    id: "aif-qq-107",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "What is the difference between supervised and unsupervised machine learning?",
    options: [
      "Supervised learning uses labeled training data (input-output pairs); unsupervised learning finds patterns without labels",
      "Supervised requires human review of every prediction; unsupervised is fully automated",
      "Supervised runs on GPUs; unsupervised runs on CPUs",
      "Supervised is for classification only; unsupervised is for regression only",
    ],
    correctIndices: [0],
    explanation:
      "In supervised learning, the model learns from labeled examples where each training sample has an input and a correct output. In unsupervised learning, there are no labels — the model discovers patterns, clusters, or structure in the data on its own.",
    tags: ["ml-fundamentals", "supervised", "unsupervised"],
  },
  {
    id: "aif-qq-108",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question: "What is 'overfitting' in a machine learning model?",
    options: [
      "The model memorizes training data too closely, performing well on training data but poorly on unseen data",
      "The model is too simple and fails to learn underlying patterns in training data",
      "The model trains too long, causing GPU memory overflow",
      "The model's file size exceeds the maximum limit for deployment",
    ],
    correctIndices: [0],
    explanation:
      "Overfitting occurs when a model learns training data so well — including noise and outliers — that it fails to generalize to new examples. It produces low training error but high validation/test error. Remedies include regularization, dropout, more training data, and simpler architectures.",
    tags: ["ml-fundamentals", "overfitting", "generalization"],
  },
  {
    id: "aif-qq-109",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "Why is a dataset split into training, validation, and test sets?",
    options: [
      "Training trains the model; validation tunes hyperparameters and prevents overfitting; test gives a final unbiased performance estimate",
      "Training is initial training; validation retrains the model; test deploys the final model",
      "All three are used simultaneously in each epoch to improve robustness",
      "Training is for simple models; validation is for complex models; test is for production data",
    ],
    correctIndices: [0],
    explanation:
      "The training set is what the model learns from. The validation set is used during development to tune hyperparameters and detect overfitting. The test set is held out and used only once at the end to estimate real-world performance without biasing the evaluation.",
    tags: ["ml-fundamentals", "data-split", "validation"],
  },
  {
    id: "aif-qq-110",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "A spam classifier incorrectly marks a legitimate email as spam. In ML evaluation terms, what type of error is this?",
    options: [
      "False Positive — the model predicted spam (positive) when the email was legitimate (negative)",
      "False Negative — the model missed an actual spam email",
      "Type II error — the model failed to detect actual spam",
      "Underfitting — the model didn't learn enough patterns",
    ],
    correctIndices: [0],
    explanation:
      "In a spam classifier where 'spam' is the positive class: a False Positive predicts spam when the email is legitimate (wrongly flagged). A False Negative predicts legitimate when the email is actually spam (missed detection). Minimizing false positives is critical when blocking legitimate email is costly.",
    tags: ["ml-fundamentals", "false-positive", "evaluation"],
  },
  {
    id: "aif-qq-111",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "hard",
    type: "single",
    question:
      "What does AUC-ROC measure, and what does an AUC of 1.0 versus 0.5 indicate?",
    options: [
      "AUC-ROC measures a model's ability to distinguish between classes across all thresholds; AUC=1.0 is a perfect classifier, AUC=0.5 is random chance",
      "AUC-ROC measures training speed; AUC=1.0 means instantaneous training, AUC=0.5 means average speed",
      "AUC-ROC measures data imbalance; AUC=1.0 means perfectly balanced classes, AUC=0.5 means severe imbalance",
      "AUC-ROC measures model size; AUC=1.0 means the model fits in memory, AUC=0.5 means it requires swapping",
    ],
    correctIndices: [0],
    explanation:
      "The ROC curve plots True Positive Rate vs. False Positive Rate at different thresholds. AUC (Area Under Curve) summarizes this: 1.0 means perfect class discrimination, 0.5 means no better than random guessing. Values between 0.7 and 0.9 are generally considered acceptable.",
    tags: ["ml-fundamentals", "auc-roc", "evaluation-metrics"],
  },
  {
    id: "aif-qq-112",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "easy",
    type: "single",
    question:
      "What is reinforcement learning (RL) and how does it differ from supervised learning?",
    options: [
      "An agent learns by taking actions in an environment and receiving rewards or penalties — no labeled data required, learning through trial and error",
      "A model learns by being retrained every time it makes a mistake on labeled data",
      "A training technique using multiple models simultaneously to reinforce each other's predictions",
      "A type of transfer learning where a model is reinforced with additional domain-specific data",
    ],
    correctIndices: [0],
    explanation:
      "Reinforcement learning (RL) involves an agent that explores an environment, takes actions, and receives rewards or penalties. The agent learns a policy to maximize cumulative reward. Unlike supervised learning (labeled data), RL learns through interaction. Examples: game-playing AI, robotics, RLHF for aligning LLMs.",
    tags: ["ml-fundamentals", "reinforcement-learning"],
  },
  {
    id: "aif-qq-113",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question: "What is 'transfer learning' and what is its primary advantage?",
    options: [
      "Using a model pre-trained on a large dataset as the starting point for a new related task — dramatically reducing data and compute needed",
      "Moving a trained model from one cloud region to another without retraining",
      "Transferring model weights between different ML frameworks",
      "A technique for sharing model parameters between multiple training jobs simultaneously",
    ],
    correctIndices: [0],
    explanation:
      "Transfer learning leverages knowledge encoded in a large pre-trained model for a new, related task. Instead of training from scratch, you fine-tune the pre-trained model on your smaller domain-specific dataset — requiring far less data and compute while often achieving strong performance.",
    tags: ["ml-fundamentals", "transfer-learning", "fine-tuning"],
  },
  {
    id: "aif-qq-114",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "hard",
    type: "multi",
    question:
      "Which TWO metrics are commonly used to evaluate text generation model quality against reference text?",
    options: [
      "BLEU score — measures overlap between generated and reference n-grams (precision-focused)",
      "ROUGE score — measures recall of reference n-grams in the generated text",
      "F1 score — harmonic mean of precision and recall for classification tasks",
      "AUC-ROC — measures discrimination ability across classification thresholds",
      "RMSE — root mean squared error for regression predictions",
    ],
    correctIndices: [0, 1],
    explanation:
      "BLEU (Bilingual Evaluation Understudy) and ROUGE (Recall-Oriented Understudy for Gisting Evaluation) are the standard metrics for evaluating text generation quality against reference text. BLEU focuses on precision; ROUGE focuses on recall. F1, AUC-ROC, and RMSE are classification/regression metrics.",
    tags: ["ml-fundamentals", "bleu", "rouge", "text-evaluation"],
  },
  {
    id: "aif-qq-115",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question: "What is the 'bias-variance tradeoff' in machine learning?",
    options: [
      "High bias (underfitting) means the model is too simple and misses patterns; high variance (overfitting) means it is too complex and fails to generalize — good models balance both",
      "Bias is error from wrong training labels; variance is error from variable data quality",
      "Bias is the speed of training; variance is the speed of inference",
      "Bias measures fairness to demographic groups; variance measures accuracy across input types",
    ],
    correctIndices: [0],
    explanation:
      "A high-bias model is too simple (underfits) — it produces systematic errors by not capturing patterns. A high-variance model is too complex (overfits) — it fits training noise and fails on new data. Good models find the sweet spot through complexity tuning, regularization, and adequate training data.",
    tags: ["ml-fundamentals", "bias-variance", "overfitting"],
  },
  {
    id: "aif-qq-116",
    service: "ML Fundamentals",
    domain: "fundamentals",
    difficulty: "medium",
    type: "single",
    question:
      "Which evaluation metric is particularly useful when the cost of false negatives is much higher than false positives — for example, in cancer screening?",
    options: [
      "Recall (Sensitivity) — measures the proportion of actual positives correctly identified",
      "Precision — measures the proportion of predicted positives that are actually positive",
      "Accuracy — measures the overall proportion of correct predictions",
      "Specificity — measures the proportion of actual negatives correctly identified",
    ],
    correctIndices: [0],
    explanation:
      "Recall (also called Sensitivity or True Positive Rate) measures how many actual positive cases are caught. In cancer screening, a false negative (missing a real cancer) is far more costly than a false positive (unnecessary follow-up). High recall minimizes missed detections, even at the cost of more false positives.",
    tags: ["ml-fundamentals", "recall", "precision", "evaluation"],
  },
];
