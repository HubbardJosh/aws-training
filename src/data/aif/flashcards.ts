import { FlashCard } from "../../types";

export const flashcards: FlashCard[] = [
  // ── Amazon Bedrock ──────────────────────────────────────────────────────────
  {
    id: "aif-bedrock-1",
    service: "Amazon Bedrock",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Bedrock?",
    answer:
      "Amazon Bedrock is a fully managed, serverless service that provides access to high-performing foundation models (FMs) from leading AI companies via a single API. It requires no infrastructure management and lets you build generative AI applications without training your own models.",
    keyPoints: [
      "Serverless — no infrastructure to manage",
      "Single API for multiple model providers",
      "Providers include Anthropic, AI21, Cohere, Meta, Mistral, Amazon",
      "Pay per token consumed",
    ],
    tags: ["bedrock", "foundation-models", "serverless", "generative-ai"],
  },
  {
    id: "aif-bedrock-2",
    service: "Amazon Bedrock",
    domain: "deployment",
    difficulty: "easy",
    question:
      "Which foundation model providers are available through Amazon Bedrock?",
    answer:
      "Bedrock offers models from Anthropic (Claude), AI21 Labs (Jurassic), Cohere (Command/Embed), Meta (Llama), Mistral AI, Stability AI (Stable Diffusion), and Amazon's own Titan and Nova model families.",
    keyPoints: [
      "Anthropic Claude — strong reasoning and safety",
      "Amazon Titan — AWS-native text and embeddings",
      "Stability AI — image generation",
      "Selection grows as new providers are added",
    ],
    tags: ["bedrock", "model-providers", "anthropic", "titan"],
  },
  {
    id: "aif-bedrock-3",
    service: "Amazon Bedrock",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is Amazon Bedrock Knowledge Bases and how does it implement RAG?",
    answer:
      "Bedrock Knowledge Bases is a managed RAG (Retrieval-Augmented Generation) feature that connects an FM to your private data. It automatically chunks documents, generates embeddings, stores them in a vector store (e.g., OpenSearch, Aurora, Pinecone), and retrieves relevant context at query time — grounding model responses in your data.",
    keyPoints: [
      "Manages the full RAG pipeline automatically",
      "Supports S3 as the data source",
      "Integrates with multiple vector databases",
      "Reduces hallucination by grounding responses in real data",
    ],
    tags: ["bedrock", "knowledge-bases", "rag", "vector-store"],
  },
  {
    id: "aif-bedrock-4",
    service: "Amazon Bedrock",
    domain: "deployment",
    difficulty: "medium",
    question: "What are Amazon Bedrock Agents and what problems do they solve?",
    answer:
      "Bedrock Agents are managed orchestrators that enable FMs to break down complex tasks, call external APIs (via Action Groups), and use Knowledge Bases to complete multi-step workflows. They handle the reasoning loop (plan → act → observe) without requiring custom orchestration code.",
    keyPoints: [
      "Action Groups define which APIs the agent can call",
      "Agents maintain conversation context across steps",
      "Supports function calling and code interpretation",
      "Built on chain-of-thought reasoning",
    ],
    tags: ["bedrock", "agents", "orchestration", "multi-step"],
  },
  {
    id: "aif-bedrock-5",
    service: "Amazon Bedrock",
    domain: "security",
    difficulty: "medium",
    question: "What is Amazon Bedrock Guardrails?",
    answer:
      "Bedrock Guardrails is a configurable safety layer that filters harmful content, blocks denied topics, redacts PII, and detects prompt injection attacks across all models in Bedrock. It applies consistently regardless of which underlying FM you use.",
    keyPoints: [
      "Content filters for hate, violence, sexual content",
      "Denied topic policies to block off-topic use",
      "PII redaction before responses reach users",
      "Grounding checks to reduce hallucinations",
    ],
    tags: ["bedrock", "guardrails", "safety", "pii", "responsible-ai"],
  },
  {
    id: "aif-bedrock-6",
    service: "Amazon Bedrock",
    domain: "deployment",
    difficulty: "hard",
    question:
      "How does fine-tuning in Amazon Bedrock differ from using a model via Provisioned Throughput?",
    answer:
      "Fine-tuning customizes a base FM on your labeled dataset to improve performance for a specific task, producing a custom model stored privately in your account. Provisioned Throughput reserves dedicated model capacity (measured in Model Units) for consistent, low-latency inference — required for custom fine-tuned models in production and optional for base models.",
    keyPoints: [
      "Fine-tuning requires labeled training data in S3",
      "Custom models are private and not shared across accounts",
      "Provisioned Throughput is billed per hour regardless of usage",
      "On-demand inference uses base models only",
    ],
    tags: ["bedrock", "fine-tuning", "provisioned-throughput", "custom-model"],
  },
  {
    id: "aif-bedrock-7",
    service: "Amazon Bedrock",
    domain: "deployment",
    difficulty: "hard",
    question: "What is Bedrock Model Evaluation and why would you use it?",
    answer:
      "Bedrock Model Evaluation lets you benchmark and compare FMs using your own prompt datasets with either automatic metrics (ROUGE, BERTScore, accuracy) or human review workflows. Use it to select the best model for your use case before committing to production deployment.",
    keyPoints: [
      "Supports automatic and human-based evaluation",
      "Compare multiple models side-by-side",
      "Evaluation jobs run on your private data in S3",
      "Helps justify model selection decisions",
    ],
    tags: ["bedrock", "model-evaluation", "benchmarking"],
  },

  // ── Amazon SageMaker ────────────────────────────────────────────────────────
  {
    id: "aif-sagemaker-1",
    service: "Amazon SageMaker",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon SageMaker?",
    answer:
      "Amazon SageMaker is a fully managed platform that covers the entire ML lifecycle — from data preparation and model training to deployment and monitoring. It provides purpose-built tools for every step so data scientists and developers can build, train, and deploy ML models at scale.",
    keyPoints: [
      "Covers the full ML lifecycle end-to-end",
      "Managed infrastructure for training and inference",
      "Includes Studio IDE, notebooks, and pipelines",
      "Integrates with S3, IAM, CloudWatch",
    ],
    tags: ["sagemaker", "ml-lifecycle", "managed"],
  },
  {
    id: "aif-sagemaker-2",
    service: "Amazon SageMaker",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon SageMaker Autopilot?",
    answer:
      "SageMaker Autopilot is an AutoML feature that automatically explores different algorithms and hyperparameters, trains and tunes models, and produces the best-performing model for your tabular dataset with minimal manual effort. It provides full visibility and explainability into what was tried.",
    keyPoints: [
      "AutoML for tabular data (classification and regression)",
      "Generates notebooks showing all candidate pipelines",
      "Explainability reports via SageMaker Clarify",
      "No ML expertise required to get started",
    ],
    tags: ["sagemaker", "autopilot", "automl"],
  },
  {
    id: "aif-sagemaker-3",
    service: "Amazon SageMaker",
    domain: "deployment",
    difficulty: "medium",
    question: "What is Amazon SageMaker JumpStart?",
    answer:
      "SageMaker JumpStart is a model hub that provides one-click access to hundreds of pre-trained, publicly available foundation models and ML models. You can deploy them directly to SageMaker Endpoints or fine-tune them on your own data without writing training code from scratch.",
    keyPoints: [
      "Pre-built solutions for common ML tasks",
      "Includes models from Hugging Face, Stability AI, and others",
      "Supports one-click fine-tuning",
      "Faster path to deployment than training from scratch",
    ],
    tags: ["sagemaker", "jumpstart", "pre-trained", "fine-tuning"],
  },
  {
    id: "aif-sagemaker-4",
    service: "Amazon SageMaker",
    domain: "deployment",
    difficulty: "medium",
    question: "What is SageMaker Feature Store?",
    answer:
      "SageMaker Feature Store is a purpose-built repository for storing, discovering, and sharing ML features. It has an online store (low-latency real-time reads) and an offline store (historical data in S3 for training). It prevents feature duplication across teams and ensures training/serving consistency.",
    keyPoints: [
      "Online store: millisecond latency for real-time inference",
      "Offline store: S3-backed for batch training",
      "Prevents training-serving skew",
      "Features are versioned and discoverable",
    ],
    tags: ["sagemaker", "feature-store", "mlops"],
  },
  {
    id: "aif-sagemaker-5",
    service: "Amazon SageMaker",
    domain: "deployment",
    difficulty: "medium",
    question: "What is SageMaker Model Monitor?",
    answer:
      "SageMaker Model Monitor continuously monitors deployed models for data quality drift, model quality degradation, bias drift, and feature attribution drift. It compares live inference data against a baseline captured during training and sends alerts via CloudWatch when anomalies are detected.",
    keyPoints: [
      "Detects data drift and model performance degradation",
      "Baseline is captured from training data statistics",
      "Alerts via CloudWatch alarms",
      "Supports bias and explainability monitoring",
    ],
    tags: ["sagemaker", "model-monitor", "drift", "mlops"],
  },
  {
    id: "aif-sagemaker-6",
    service: "Amazon SageMaker",
    domain: "deployment",
    difficulty: "hard",
    question: "What is Amazon SageMaker Pipelines?",
    answer:
      "SageMaker Pipelines is a purpose-built CI/CD service for ML workflows. It lets you define, automate, and track end-to-end ML workflows as directed acyclic graphs (DAGs) — from data processing and training to model evaluation and conditional deployment — with full lineage tracking.",
    keyPoints: [
      "DAG-based ML workflow orchestration",
      "Steps include Processing, Training, Evaluation, Register, Deploy",
      "Integrates with SageMaker Model Registry",
      "Tracks experiment lineage automatically",
    ],
    tags: ["sagemaker", "pipelines", "mlops", "ci-cd"],
  },
  {
    id: "aif-sagemaker-7",
    service: "Amazon SageMaker",
    domain: "deployment",
    difficulty: "hard",
    question: "How do SageMaker Training Jobs differ from SageMaker Endpoints?",
    answer:
      "Training Jobs provision managed compute clusters to run a training script against data in S3 and produce a model artifact; the cluster is terminated when training finishes. Endpoints are persistent, always-on HTTPS APIs that host the trained model for real-time inference, billed continuously while running.",
    keyPoints: [
      "Training Jobs are ephemeral — billed only while running",
      "Endpoints are persistent — billed per hour",
      "Batch Transform is for large-scale offline scoring",
      "Multi-model endpoints can serve many models on shared hardware",
    ],
    tags: ["sagemaker", "training-jobs", "endpoints", "inference"],
  },

  // ── Amazon Rekognition ──────────────────────────────────────────────────────
  {
    id: "aif-rekognition-1",
    service: "Amazon Rekognition",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Rekognition?",
    answer:
      "Amazon Rekognition is a fully managed computer vision service that analyzes images and videos to detect objects, scenes, faces, text, and unsafe content. It requires no ML expertise — you call an API with your image or video and receive structured results.",
    keyPoints: [
      "Pre-trained deep learning models, no training required",
      "Analyzes images and videos (including stored and streaming)",
      "Returns labels, bounding boxes, and confidence scores",
      "Integrates with S3 and Kinesis Video Streams",
    ],
    tags: ["rekognition", "computer-vision", "image-analysis"],
  },
  {
    id: "aif-rekognition-2",
    service: "Amazon Rekognition",
    domain: "deployment",
    difficulty: "easy",
    question:
      "What types of detection does Amazon Rekognition Image support out of the box?",
    answer:
      "Rekognition Image supports object and scene labeling, face detection and analysis (age range, emotions, landmarks), face comparison/search, text detection in images, celebrity recognition, and unsafe content moderation.",
    keyPoints: [
      "DetectLabels — thousands of object and scene categories",
      "DetectFaces — facial attributes like emotions and landmarks",
      "CompareFaces — similarity between two faces",
      "DetectModerationLabels — explicit/suggestive content",
    ],
    tags: ["rekognition", "labels", "faces", "content-moderation"],
  },
  {
    id: "aif-rekognition-3",
    service: "Amazon Rekognition",
    domain: "deployment",
    difficulty: "medium",
    question: "What is Rekognition Custom Labels?",
    answer:
      "Rekognition Custom Labels lets you train a custom object and scene detection model using your own labeled images — without writing ML code. You upload labeled images to S3, start a training job in Rekognition, and deploy the resulting model as an API endpoint for specialized detection tasks.",
    keyPoints: [
      "No ML expertise required — label images in the console",
      "Minimum ~10 images per label to get started",
      "Model is hosted as a Rekognition project version endpoint",
      "Billed per hour the endpoint is running",
    ],
    tags: ["rekognition", "custom-labels", "computer-vision"],
  },
  {
    id: "aif-rekognition-4",
    service: "Amazon Rekognition",
    domain: "deployment",
    difficulty: "medium",
    question:
      "How does Amazon Rekognition Video analysis differ from Rekognition Image?",
    answer:
      "Rekognition Video can analyze stored videos asynchronously via StartLabelDetection/GetLabelDetection or analyze live streaming video via Kinesis Video Streams in real time. It tracks objects and persons across frames with temporal information that Rekognition Image cannot provide.",
    keyPoints: [
      "Stored video: async API — start job, poll for results",
      "Streaming video: real-time analysis via Kinesis Video Streams",
      "Person tracking and path analysis across frames",
      "Segment detection — find scenes, credits, black frames",
    ],
    tags: ["rekognition", "video", "streaming", "async"],
  },
  {
    id: "aif-rekognition-5",
    service: "Amazon Rekognition",
    domain: "applications",
    difficulty: "medium",
    question:
      "A media company wants to automatically block adult content from user-uploaded images. Which Rekognition API should they use?",
    answer:
      "They should use DetectModerationLabels, which returns a taxonomy of explicit and suggestive content categories (e.g., Explicit Nudity, Violence, Visually Disturbing) with confidence scores, allowing the application to reject images above a chosen threshold.",
    keyPoints: [
      "Returns hierarchical moderation taxonomy",
      "Confidence threshold is set by the application",
      "Supports both image and video moderation",
      "Does not store images — stateless API call",
    ],
    tags: ["rekognition", "content-moderation", "use-case"],
  },
  {
    id: "aif-rekognition-6",
    service: "Amazon Rekognition",
    domain: "applications",
    difficulty: "hard",
    question:
      "What is the Rekognition Face Collection and how is it used for face search?",
    answer:
      "A Face Collection is an index of facial feature vectors stored in Rekognition. You index faces with IndexFaces (each face gets a FaceId), then call SearchFacesByImage to find matching faces in the collection. Common use cases include building access control systems or finding persons of interest across photos.",
    keyPoints: [
      "Faces are indexed as mathematical feature vectors, not raw images",
      "SearchFacesByImage returns match percentage and FaceId",
      "Collections are scoped to an AWS account and region",
      "Associate FaceIds with your own user metadata in a database",
    ],
    tags: ["rekognition", "face-collection", "face-search", "identity"],
  },

  // ── Amazon Comprehend ───────────────────────────────────────────────────────
  {
    id: "aif-comprehend-1",
    service: "Amazon Comprehend",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Comprehend?",
    answer:
      "Amazon Comprehend is a managed NLP service that uses pre-trained deep learning models to extract insights from text — including entities, key phrases, language, sentiment, and PII. No ML expertise is required; you send text and receive structured JSON results.",
    keyPoints: [
      "Pre-trained on vast amounts of text, no model training needed",
      "Supports real-time single-document and batch async analysis",
      "Detects language automatically",
      "Integrates with S3 for large-scale batch jobs",
    ],
    tags: ["comprehend", "nlp", "text-analysis"],
  },
  {
    id: "aif-comprehend-2",
    service: "Amazon Comprehend",
    domain: "deployment",
    difficulty: "easy",
    question: "What built-in NLP features does Amazon Comprehend provide?",
    answer:
      "Comprehend provides sentiment analysis (positive/negative/neutral/mixed), entity recognition (people, places, organizations, dates, quantities), key phrase extraction, language detection, PII detection and redaction, and syntax analysis (parts of speech).",
    keyPoints: [
      "Sentiment: document and per-entity sentiment",
      "Entities: 14+ built-in entity types",
      "PII: detect/redact SSN, credit cards, email, phone",
      "Language detection: 100+ languages",
    ],
    tags: ["comprehend", "sentiment", "entities", "pii"],
  },
  {
    id: "aif-comprehend-3",
    service: "Amazon Comprehend",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What are Comprehend Custom Classifiers and Custom Entity Recognizers?",
    answer:
      "Custom Classifiers train Comprehend to categorize documents into your own categories (e.g., support ticket types). Custom Entity Recognizers train it to identify domain-specific entities (e.g., product codes, internal terminology) not covered by built-in entity types. Both require labeled training data.",
    keyPoints: [
      "Custom Classifiers: multi-class or multi-label document classification",
      "Custom Entity Recognizers: domain-specific NER",
      "Training data provided as CSV or augmented manifests in S3",
      "Models are deployed as custom endpoints or used for async jobs",
    ],
    tags: ["comprehend", "custom-classifier", "custom-entities", "training"],
  },
  {
    id: "aif-comprehend-4",
    service: "Amazon Comprehend",
    domain: "deployment",
    difficulty: "medium",
    question: "What is Comprehend topic modeling?",
    answer:
      "Comprehend topic modeling uses Latent Dirichlet Allocation (LDA) to automatically discover hidden thematic topics across a large collection of documents. It groups documents by topic and identifies the most representative terms per topic — useful for content organization and trend analysis.",
    keyPoints: [
      "Unsupervised — no labeled data required",
      "Batch async job only (not real-time)",
      "Specify number of topics to discover (1–100)",
      "Output: topic-document mappings and term lists in S3",
    ],
    tags: ["comprehend", "topic-modeling", "lda", "unsupervised"],
  },
  {
    id: "aif-comprehend-5",
    service: "Amazon Comprehend",
    domain: "applications",
    difficulty: "medium",
    question:
      "A customer service platform wants to automatically route support tickets by product category. Which Comprehend feature should they use?",
    answer:
      "They should train a Comprehend Custom Classifier using labeled historical tickets. Once trained, the classifier can predict the category for incoming tickets in real time via a custom endpoint, enabling automatic routing without keyword rules.",
    keyPoints: [
      "Requires labeled training data (ticket text + category)",
      "Supports multi-class (one category) or multi-label (multiple)",
      "Real-time inference via endpoint, or batch via async job",
      "No ML code required — managed service",
    ],
    tags: ["comprehend", "custom-classifier", "use-case", "routing"],
  },
  {
    id: "aif-comprehend-6",
    service: "Amazon Comprehend",
    domain: "security",
    difficulty: "hard",
    question: "How does Amazon Comprehend detect and redact PII in documents?",
    answer:
      "Comprehend's ContainsPiiEntities API identifies PII entity types present in text. DetectPiiEntities returns character offsets for each PII instance. For batch jobs, the redaction mode replaces PII with entity-type labels (e.g., [NAME], [SSN]) in the output, creating sanitized versions of documents.",
    keyPoints: [
      "100+ PII entity types: SSN, credit card, phone, DOB, etc.",
      "Real-time detection with DetectPiiEntities",
      "Batch redaction via async StartPiiEntitiesDetectionJob",
      "Redaction replaces PII with labels, preserving document structure",
    ],
    tags: ["comprehend", "pii", "redaction", "data-privacy"],
  },

  // ── Amazon Transcribe ───────────────────────────────────────────────────────
  {
    id: "aif-transcribe-1",
    service: "Amazon Transcribe",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Transcribe?",
    answer:
      "Amazon Transcribe is a managed automatic speech recognition (ASR) service that converts speech in audio and video files to text. It supports batch transcription jobs for stored files and streaming real-time transcription for live audio.",
    keyPoints: [
      "Batch: submit audio file in S3, receive transcript JSON",
      "Streaming: real-time WebSocket/HTTP2 transcription",
      "Supports 100+ languages",
      "Returns word-level timestamps and confidence scores",
    ],
    tags: ["transcribe", "speech-to-text", "asr"],
  },
  {
    id: "aif-transcribe-2",
    service: "Amazon Transcribe",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is speaker diarization in Amazon Transcribe and when would you use it?",
    answer:
      "Speaker diarization (ShowSpeakerLabels) segments a transcript to identify which speaker said each portion of audio. It is useful for meeting transcription, call center recordings, and interviews where you need to attribute statements to individual speakers.",
    keyPoints: [
      "Detects 2–10 speakers per audio file",
      "Labels speakers as 'spk_0', 'spk_1', etc.",
      "Enabled via ShowSpeakerLabels parameter in batch jobs",
      "Works with streaming transcription too",
    ],
    tags: ["transcribe", "diarization", "speakers", "call-analytics"],
  },
  {
    id: "aif-transcribe-3",
    service: "Amazon Transcribe",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is a Custom Vocabulary in Amazon Transcribe and when should you use one?",
    answer:
      "A Custom Vocabulary is a list of domain-specific words — brand names, technical terms, acronyms, or unusual proper nouns — that you provide to improve transcription accuracy for specialized content. Words in the vocabulary are given higher recognition weight during decoding.",
    keyPoints: [
      "Provided as a plain-text list of words/phrases",
      "Helps with jargon not in the base ASR model",
      "Can include pronunciation hints (Sounds-Like field)",
      "DisplayAs field controls how words appear in the transcript",
    ],
    tags: ["transcribe", "custom-vocabulary", "accuracy"],
  },
  {
    id: "aif-transcribe-4",
    service: "Amazon Transcribe",
    domain: "deployment",
    difficulty: "medium",
    question: "What is Amazon Transcribe Medical?",
    answer:
      "Transcribe Medical is a specialized version of Transcribe optimized for clinical and medical speech, including anatomical terms, drug names, and procedural language. It is HIPAA-eligible and designed for physician dictation, clinical documentation, and telehealth transcription.",
    keyPoints: [
      "HIPAA-eligible — can process PHI",
      "Optimized for medical terminology",
      "Supports Primary Care and specialty vocabularies",
      "Separate API from standard Transcribe",
    ],
    tags: ["transcribe", "medical", "hipaa", "healthcare"],
  },
  {
    id: "aif-transcribe-5",
    service: "Amazon Transcribe",
    domain: "applications",
    difficulty: "medium",
    question:
      "What is Amazon Transcribe Call Analytics and what does it provide beyond basic transcription?",
    answer:
      "Transcribe Call Analytics is purpose-built for contact center calls. It adds sentiment analysis per turn, talk time statistics, interruption detection, loudness scores, issue/action item detection, and call categories — all built on top of the base transcript.",
    keyPoints: [
      "Per-turn speaker sentiment (positive/negative/neutral)",
      "Non-talk time and interruption metrics",
      "Issue detection and call summarization",
      "Supports real-time and post-call analysis modes",
    ],
    tags: ["transcribe", "call-analytics", "contact-center", "sentiment"],
  },
  {
    id: "aif-transcribe-6",
    service: "Amazon Transcribe",
    domain: "deployment",
    difficulty: "easy",
    question:
      "What is automatic punctuation in Amazon Transcribe and why does it matter?",
    answer:
      "Automatic punctuation uses a model to insert periods, commas, and question marks into the transcript based on speech patterns. It makes transcripts human-readable without manual editing, which is essential for downstream NLP processing and document generation.",
    keyPoints: [
      "Enabled via EnableAutomaticPunctuation parameter",
      "Supported for English and several other languages",
      "Reduces post-processing effort significantly",
      "Particularly useful before sending transcripts to Comprehend",
    ],
    tags: ["transcribe", "punctuation", "transcript-quality"],
  },

  // ── Amazon Polly ────────────────────────────────────────────────────────────
  {
    id: "aif-polly-1",
    service: "Amazon Polly",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Polly?",
    answer:
      "Amazon Polly is a managed text-to-speech (TTS) service that converts text into lifelike spoken audio. It offers standard (concatenative) and Neural TTS (NTTS) voices across 60+ languages, and returns audio in formats like MP3, OGG, and PCM.",
    keyPoints: [
      "Standard voices: fast, low cost",
      "Neural TTS: more natural, higher quality, higher cost",
      "Supports SSML for fine-grained speech control",
      "Audio can be streamed or stored in S3",
    ],
    tags: ["polly", "text-to-speech", "tts", "audio"],
  },
  {
    id: "aif-polly-2",
    service: "Amazon Polly",
    domain: "deployment",
    difficulty: "medium",
    question: "What is SSML and how is it used in Amazon Polly?",
    answer:
      "Speech Synthesis Markup Language (SSML) is an XML-based standard for controlling speech synthesis. In Polly, SSML tags let you adjust speaking rate, pitch, volume, pronunciation, add pauses, emphasize words, and insert sound effects — giving fine-grained control over the output audio.",
    keyPoints: [
      "<break> — insert pauses of specific durations",
      "<prosody> — control rate, pitch, and volume",
      "<phoneme> — specify exact pronunciation",
      "<emphasis> — stress specific words",
    ],
    tags: ["polly", "ssml", "speech-control"],
  },
  {
    id: "aif-polly-3",
    service: "Amazon Polly",
    domain: "deployment",
    difficulty: "medium",
    question: "What is a Polly Lexicon and when would you use it?",
    answer:
      "A Polly Lexicon (PLS format) is a pronunciation dictionary that maps words or phrases to custom pronunciations. Use it when the default Polly pronunciation is incorrect — for brand names, acronyms, product codes, or foreign terms that the base TTS model mispronounces.",
    keyPoints: [
      "Stored as PLS (Pronunciation Lexicon Specification) XML",
      "Applied at synthesis time via lexiconNames parameter",
      "Up to 5 lexicons per SynthesizeSpeech call",
      "Lexicons are region-specific",
    ],
    tags: ["polly", "lexicon", "pronunciation", "custom"],
  },
  {
    id: "aif-polly-4",
    service: "Amazon Polly",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is the difference between Neural TTS and standard voices in Amazon Polly?",
    answer:
      "Standard voices use concatenative synthesis — splicing recorded speech units — producing intelligible but less natural audio. Neural TTS uses a neural network pipeline (including a neural vocoder) trained on human speech, producing significantly more natural-sounding, expressive output with better prosody.",
    keyPoints: [
      "Neural TTS sounds more human and expressive",
      "Neural TTS costs ~4x more per character than standard",
      "Not all languages/voices have a neural option",
      "Newscaster and conversational speaking styles available for select NTTS voices",
    ],
    tags: ["polly", "neural-tts", "standard", "quality"],
  },
  {
    id: "aif-polly-5",
    service: "Amazon Polly",
    domain: "applications",
    difficulty: "easy",
    question:
      "A developer wants to add voice narration to a mobile app that reads articles aloud. Which Polly API pattern should they use?",
    answer:
      "For short text, call SynthesizeSpeech synchronously and stream the audio directly to the device. For long articles, use StartSpeechSynthesisTask (async) which saves the audio to an S3 bucket, avoiding timeout limits imposed on synchronous API calls.",
    keyPoints: [
      "SynthesizeSpeech: up to 3,000 billed characters, synchronous",
      "StartSpeechSynthesisTask: async, no character limit per call",
      "Long-form TTS recommended for articles and books",
      "Output formats: MP3, OGG Vorbis, PCM",
    ],
    tags: ["polly", "api", "long-form", "use-case"],
  },
  {
    id: "aif-polly-6",
    service: "Amazon Polly",
    domain: "deployment",
    difficulty: "hard",
    question: "What is the Polly Brand Voice feature?",
    answer:
      "Brand Voice is a custom voice creation service where AWS works with you to train a neural TTS voice that sounds like a specific person or branded persona using recorded speech data. The resulting custom voice is exclusive to your account and not shared with other customers.",
    keyPoints: [
      "Custom neural voice trained on your audio recordings",
      "Requires a commercial agreement with AWS",
      "Voice is private and exclusive to the account",
      "Used for unique brand identity in voice experiences",
    ],
    tags: ["polly", "brand-voice", "custom-voice"],
  },

  // ── Amazon Lex ──────────────────────────────────────────────────────────────
  {
    id: "aif-lex-1",
    service: "Amazon Lex",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Lex?",
    answer:
      "Amazon Lex is a managed service for building conversational chatbots and voice assistants using the same deep learning technology that powers Amazon Alexa. It provides automatic speech recognition (ASR) and natural language understanding (NLU) to interpret user intent and manage dialogue.",
    keyPoints: [
      "Powers Alexa — same NLU and ASR technology",
      "Supports both text (chatbot) and voice (IVR) channels",
      "Manages conversation state and multi-turn dialogues",
      "Integrates with Lambda for fulfillment logic",
    ],
    tags: ["lex", "chatbot", "nlu", "conversational-ai"],
  },
  {
    id: "aif-lex-2",
    service: "Amazon Lex",
    domain: "deployment",
    difficulty: "medium",
    question: "What are Intents and Slots in Amazon Lex?",
    answer:
      "An Intent represents an action the user wants to perform (e.g., BookFlight). Slots are the parameters required to fulfill the intent (e.g., departure city, destination, date). Lex extracts slot values from user utterances and prompts for any missing values before invoking the fulfillment Lambda.",
    keyPoints: [
      "Intents have sample utterances to train NLU",
      "Slots have types (built-in or custom) and validation",
      "Lex manages the slot-filling dialogue automatically",
      "Built-in slot types: dates, cities, numbers, Amazon.AlphaNumeric",
    ],
    tags: ["lex", "intents", "slots", "nlu"],
  },
  {
    id: "aif-lex-3",
    service: "Amazon Lex",
    domain: "deployment",
    difficulty: "medium",
    question: "How does Amazon Lex integrate with AWS Lambda for fulfillment?",
    answer:
      "Lex invokes a Lambda function at two points: during dialogue (for slot validation and conditional branching via code hooks) and after all slots are filled (for fulfillment). The Lambda receives a structured JSON event with intent name, slot values, and session attributes, and returns a response directing Lex's next action.",
    keyPoints: [
      "Initialization/validation hook: runs per utterance, can re-prompt",
      "Fulfillment hook: runs when all slots are collected",
      "Lambda can elicit more slots, delegate back to Lex, or close",
      "Session attributes persist context across turns",
    ],
    tags: ["lex", "lambda", "fulfillment", "integration"],
  },
  {
    id: "aif-lex-4",
    service: "Amazon Lex",
    domain: "applications",
    difficulty: "medium",
    question:
      "Which AWS service connects Amazon Lex to enterprise knowledge bases for FAQ-style question answering?",
    answer:
      "Amazon Kendra integrates with Lex via the AMAZON.KendraSearchIntent built-in intent. When a user's utterance doesn't match a configured intent, Lex can automatically query a Kendra index and return the most relevant document excerpt as the answer, enabling FAQ-style fallback responses.",
    keyPoints: [
      "AMAZON.KendraSearchIntent is a built-in Lex intent",
      "No custom code needed for the Lex-Kendra integration",
      "Kendra returns a structured answer with document attribution",
      "Useful for HR portals, IT help desks, and FAQ bots",
    ],
    tags: ["lex", "kendra", "faq", "integration"],
  },
  {
    id: "aif-lex-5",
    service: "Amazon Lex",
    domain: "applications",
    difficulty: "easy",
    question: "What channels does Amazon Lex support for deploying chatbots?",
    answer:
      "Lex bots can be deployed to Slack, Facebook Messenger, Twilio SMS, Amazon Connect (contact center), Kik, and any custom application via the runtime API. This lets you build one bot and deploy it across multiple channels without rebuilding the NLU layer.",
    keyPoints: [
      "Amazon Connect for voice IVR use cases",
      "Facebook Messenger, Slack, Twilio for messaging",
      "Custom channel via runtime API (PostText, PostContent)",
      "One bot definition, multiple deployment channels",
    ],
    tags: ["lex", "channels", "deployment", "omnichannel"],
  },
  {
    id: "aif-lex-6",
    service: "Amazon Lex",
    domain: "deployment",
    difficulty: "hard",
    question:
      "What is the difference between Lex V1 and Lex V2, and what is the conversation paradigm shift in V2?",
    answer:
      "Lex V2 introduced a bot with multiple locales in a single bot definition, a conversation flow designer (visual builder), and a streaming API for real-time voice conversations. V2 uses a conversation flow model (via Conditional Branches and Dialog Code Hook) instead of V1's intent/slot elicitation hooks, giving more control over dialogue management.",
    keyPoints: [
      "V2: single bot, multiple language locales",
      "V2: visual conversation flow designer in console",
      "V2: streaming API for bidirectional audio",
      "V1 is in maintenance mode — new bots should use V2",
    ],
    tags: ["lex", "v2", "conversation-flow", "streaming"],
  },

  // ── Amazon Kendra ───────────────────────────────────────────────────────────
  {
    id: "aif-kendra-1",
    service: "Amazon Kendra",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Kendra?",
    answer:
      "Amazon Kendra is a managed intelligent enterprise search service powered by ML. Unlike keyword search, Kendra understands natural language queries and returns precise answers extracted from documents, not just a list of links. It indexes content from multiple repositories via data source connectors.",
    keyPoints: [
      "Natural language understanding — understands intent, not just keywords",
      "Returns answers with document attribution (passage highlighting)",
      "Pre-built connectors for SharePoint, S3, RDS, Confluence, etc.",
      "Relevance tuning without ML expertise",
    ],
    tags: ["kendra", "enterprise-search", "nlp", "search"],
  },
  {
    id: "aif-kendra-2",
    service: "Amazon Kendra",
    domain: "deployment",
    difficulty: "medium",
    question: "What types of data sources does Amazon Kendra support?",
    answer:
      "Kendra has pre-built connectors for S3, RDS (via JDBC), SharePoint Online, Confluence, ServiceNow, Salesforce, Microsoft Teams, Google Drive, and more. You can also use the BatchPutDocument API to push documents directly into the index programmatically.",
    keyPoints: [
      "40+ pre-built data source connectors",
      "Sync schedules: on-demand or scheduled crawls",
      "Supports PDF, Word, HTML, JSON, CSV, and more",
      "Documents can include metadata for faceted filtering",
    ],
    tags: ["kendra", "connectors", "data-sources", "indexing"],
  },
  {
    id: "aif-kendra-3",
    service: "Amazon Kendra",
    domain: "deployment",
    difficulty: "medium",
    question: "How does Kendra handle FAQ ingestion?",
    answer:
      "You can directly upload FAQ pairs (question-answer CSV or JSON) to a Kendra index as a data source. Kendra uses these as high-confidence, curated answers that are prioritized in search results when a user's query closely matches a FAQ question.",
    keyPoints: [
      "FAQ data source: CSV with Question and Answer columns",
      "FAQs appear above document-extracted answers in results",
      "Useful for known high-frequency questions",
      "Can also include metadata like category or source URL",
    ],
    tags: ["kendra", "faq", "ingestion", "curated-answers"],
  },
  {
    id: "aif-kendra-4",
    service: "Amazon Kendra",
    domain: "deployment",
    difficulty: "medium",
    question: "What is relevance tuning in Amazon Kendra?",
    answer:
      "Relevance tuning lets you adjust which document attributes (e.g., freshness, document type, custom metadata fields) influence result ranking, without training an ML model. You can boost or demote results based on field values to align search behavior with business requirements.",
    keyPoints: [
      "Tuning is done via the console or API — no ML expertise needed",
      "Freshness boost: prefer recently updated documents",
      "Attribute-based filtering: restrict results by metadata",
      "User feedback via relevance signals improves ranking over time",
    ],
    tags: ["kendra", "relevance-tuning", "ranking"],
  },
  {
    id: "aif-kendra-5",
    service: "Amazon Kendra",
    domain: "applications",
    difficulty: "hard",
    question:
      "What are the two Kendra index editions and when would you choose each?",
    answer:
      "Developer Edition: up to 10,000 documents, 4,000 queries/day, lower cost — for prototyping and small deployments. Enterprise Edition: millions of documents, 8,000 queries/day (scalable), 99.9% SLA, and HA across multiple AZs — for production enterprise workloads.",
    keyPoints: [
      "Developer Edition: max 5 data sources, 10K documents",
      "Enterprise Edition: 50 data sources, millions of documents",
      "Only Enterprise supports high availability",
      "Enterprise required for production SLA guarantees",
    ],
    tags: ["kendra", "editions", "enterprise", "developer"],
  },
  {
    id: "aif-kendra-6",
    service: "Amazon Kendra",
    domain: "applications",
    difficulty: "medium",
    question:
      "An organization wants to let employees search across their SharePoint, Confluence, and S3 documentation in natural language. Which service should they use?",
    answer:
      "Amazon Kendra with its pre-built connectors for SharePoint Online, Confluence, and S3. Kendra will index all three sources, understand natural language queries, and return precise answers with source attribution — giving employees a single search experience across all repositories.",
    keyPoints: [
      "Pre-built connectors eliminate custom ETL code",
      "Kendra surfaces the exact passage, not just the document",
      "Access control lists (ACL) from source systems are respected",
      "Single index can span multiple heterogeneous sources",
    ],
    tags: ["kendra", "enterprise-search", "use-case", "connectors"],
  },

  // ── Amazon Personalize ──────────────────────────────────────────────────────
  {
    id: "aif-personalize-1",
    service: "Amazon Personalize",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Personalize?",
    answer:
      "Amazon Personalize is a managed ML service for building real-time personalization and recommendation systems. It uses the same technology as Amazon.com's recommendation engine, and requires no ML expertise — you provide user-item interaction data and Personalize automatically trains and deploys recommendation models.",
    keyPoints: [
      "AutoML selects the best algorithm for your data",
      "Supports real-time and batch recommendations",
      "Integrates via campaign endpoints or batch inference jobs",
      "No ML expertise required",
    ],
    tags: ["personalize", "recommendations", "automl"],
  },
  {
    id: "aif-personalize-2",
    service: "Amazon Personalize",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What are the core data types Personalize uses to train recommendation models?",
    answer:
      "Personalize requires Interactions data (user-item events like clicks, purchases, ratings — the minimum required dataset). Optionally, you can add an Items dataset (item metadata like genre, price) and Users dataset (user attributes like age, membership tier) to improve recommendation quality.",
    keyPoints: [
      "Interactions: required — userId, itemId, timestamp, eventType",
      "Items: optional — item metadata for content-based signals",
      "Users: optional — user demographics and attributes",
      "More data types = richer, more personalized recommendations",
    ],
    tags: ["personalize", "datasets", "interactions", "items"],
  },
  {
    id: "aif-personalize-3",
    service: "Amazon Personalize",
    domain: "deployment",
    difficulty: "medium",
    question: "What is a Personalize Recipe?",
    answer:
      "A Recipe is a pre-configured ML algorithm optimized for a specific recommendation use case. Personalize offers recipes for user personalization (HRNN, User-Personalization), similar items (SIMS), popularity-based ranking, trending items, and user segmentation — each with different optimization objectives.",
    keyPoints: [
      "User-Personalization: top-N item recommendations per user",
      "SIMS (Similar Items): items similar to a given item",
      "Personalized-Ranking: re-rank a curated list for a user",
      "AutoML can select the best recipe automatically",
    ],
    tags: ["personalize", "recipes", "algorithms", "use-cases"],
  },
  {
    id: "aif-personalize-4",
    service: "Amazon Personalize",
    domain: "deployment",
    difficulty: "medium",
    question: "How does Amazon Personalize handle the cold-start problem?",
    answer:
      "For new items (item cold-start), Personalize uses item metadata from the Items dataset to recommend new items before they accumulate interaction history. For new users (user cold-start), it falls back to popular item recommendations until sufficient interactions are captured. The User-Personalization recipe explicitly handles both cases.",
    keyPoints: [
      "Item cold-start: metadata-based recommendations for new items",
      "User cold-start: popularity-based fallback for new users",
      "Exploration weight parameter controls new-item discovery rate",
      "Real-time event streaming via PutEvents quickly warms new users",
    ],
    tags: ["personalize", "cold-start", "new-items", "new-users"],
  },
  {
    id: "aif-personalize-5",
    service: "Amazon Personalize",
    domain: "applications",
    difficulty: "medium",
    question:
      "What is the difference between a Personalize Campaign and a Batch Inference Job?",
    answer:
      "A Campaign is a deployed, always-on endpoint that returns real-time recommendations for individual users via the GetRecommendations API — suitable for website/app personalization. A Batch Inference Job processes a bulk list of users/items offline and outputs recommendations to S3 — suitable for email campaigns or pre-computed caches.",
    keyPoints: [
      "Campaign: real-time, per-user API, billed per TPS provisioned",
      "Batch Job: offline, bulk output to S3, billed per input row",
      "Use Campaign for interactive UX; Batch for scheduled jobs",
      "Campaigns need minimum 1 TPS capacity",
    ],
    tags: ["personalize", "campaign", "batch-inference", "real-time"],
  },
  {
    id: "aif-personalize-6",
    service: "Amazon Personalize",
    domain: "deployment",
    difficulty: "hard",
    question:
      "How do real-time event streams improve Personalize recommendations?",
    answer:
      "By calling PutEvents to send user interactions (clicks, views, purchases) to Personalize in real time via an Event Tracker, the model can update recommendations immediately — reflecting a user's current session behavior without waiting for a full model retraining cycle.",
    keyPoints: [
      "Event Tracker captures real-time clickstream data",
      "PutEvents API accepts interaction events per user session",
      "Model incorporates recent events without full retraining",
      "Dramatically improves relevance for users with changing interests",
    ],
    tags: ["personalize", "event-tracker", "real-time", "streaming"],
  },

  // ── Amazon Translate ────────────────────────────────────────────────────────
  {
    id: "aif-translate-1",
    service: "Amazon Translate",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Translate?",
    answer:
      "Amazon Translate is a managed neural machine translation (NMT) service that provides fast, high-quality translation between 75+ languages. It supports real-time translation via the TranslateText API and asynchronous batch translation of large document sets via translation jobs.",
    keyPoints: [
      "Neural machine translation — context-aware, not word-for-word",
      "75+ supported languages and language pairs",
      "Real-time API for interactive applications",
      "Batch translation for large document volumes",
    ],
    tags: ["translate", "nmt", "machine-translation"],
  },
  {
    id: "aif-translate-2",
    service: "Amazon Translate",
    domain: "deployment",
    difficulty: "medium",
    question: "What is Active Custom Translation (ACT) in Amazon Translate?",
    answer:
      "Active Custom Translation lets you supply a parallel data corpus (source-target sentence pairs) as a customization. Translate uses this corpus at inference time to bias translations toward your preferred terminology and style — without the cost and time of fine-tuning a full custom model.",
    keyPoints: [
      "Parallel data: CSV/TMX pairs of source and target sentences",
      "Applied at translation time, not pre-trained",
      "Improves terminology consistency for domain-specific content",
      "Faster and cheaper than full custom model training",
    ],
    tags: ["translate", "active-custom-translation", "terminology"],
  },
  {
    id: "aif-translate-3",
    service: "Amazon Translate",
    domain: "deployment",
    difficulty: "medium",
    question:
      "How does Translate handle batch translation of large document sets?",
    answer:
      "You start a Translate batch translation job by pointing at an S3 prefix containing input documents (TXT, HTML, DOCX, XLSX, PPTX, XLIFF). The service processes all documents asynchronously and writes translated output to a designated S3 output prefix, preserving the original file format where supported.",
    keyPoints: [
      "Input and output stored in S3",
      "Supports multiple file formats",
      "Job runs asynchronously — no timeout concerns",
      "Multiple target languages in a single job",
    ],
    tags: ["translate", "batch", "s3", "async"],
  },
  {
    id: "aif-translate-4",
    service: "Amazon Translate",
    domain: "deployment",
    difficulty: "easy",
    question: "What is automatic language detection in Amazon Translate?",
    answer:
      "When you set the SourceLanguageCode to 'auto', Translate automatically detects the source language using Amazon Comprehend's language detection under the hood. This eliminates the need to know the source language in advance, enabling dynamic multilingual applications.",
    keyPoints: [
      "Set SourceLanguageCode='auto' to enable auto-detection",
      "Uses Comprehend language detection internally",
      "Detected language is returned in the response",
      "Supports the same 100+ languages as Comprehend detection",
    ],
    tags: ["translate", "language-detection", "auto-detect"],
  },
  {
    id: "aif-translate-5",
    service: "Amazon Translate",
    domain: "applications",
    difficulty: "medium",
    question:
      "A global SaaS company wants to display their customer reviews in the user's preferred language in real time. How should they implement this?",
    answer:
      "Use the Amazon Translate TranslateText API synchronously on page load or via an API gateway. Store the original text in the database and call Translate on demand per user locale. Cache translated results for common content to reduce API calls and cost.",
    keyPoints: [
      "TranslateText: synchronous, sub-second latency",
      "Cache translated results to avoid redundant API calls",
      "Language detection for user-generated content with unknown source language",
      "Cost: per character translated",
    ],
    tags: ["translate", "real-time", "use-case", "localization"],
  },
  {
    id: "aif-translate-6",
    service: "Amazon Translate",
    domain: "deployment",
    difficulty: "hard",
    question:
      "What is a Translate Custom Terminology and how does it differ from Active Custom Translation?",
    answer:
      "Custom Terminology is a glossary of specific terms that must be translated exactly as specified (e.g., brand names, product names that should not be localized). ACT uses full sentence pairs to influence style and phrasing broadly. Custom Terminology enforces term-level overrides; ACT influences overall translation style.",
    keyPoints: [
      "Custom Terminology: CSV of source term → exact target term",
      "Terms in the glossary are never translated by the model",
      "ACT: sentence-pair corpus influencing broader style",
      "Both can be used together for maximum control",
    ],
    tags: ["translate", "custom-terminology", "glossary", "act"],
  },

  // ── Amazon Textract ─────────────────────────────────────────────────────────
  {
    id: "aif-textract-1",
    service: "Amazon Textract",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Textract?",
    answer:
      "Amazon Textract is a managed ML service that goes beyond simple OCR to automatically extract text, handwriting, tables, and form fields (key-value pairs) from scanned documents and images. It understands document structure without template configuration.",
    keyPoints: [
      "Extracts printed text, handwriting, tables, and forms",
      "No templates required — understands document structure",
      "Supports PDF, PNG, JPG, TIFF input formats",
      "Returns structured JSON with positional bounding boxes",
    ],
    tags: ["textract", "ocr", "document-extraction"],
  },
  {
    id: "aif-textract-2",
    service: "Amazon Textract",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What are the key Textract feature types and what does each extract?",
    answer:
      "TABLES: extracts tabular data with cell coordinates and relationships. FORMS: extracts key-value pairs from form fields (e.g., 'Name: John'). SIGNATURES: detects signature presence. LAYOUT: understands page structure (headers, paragraphs, lists). Each feature type is requested explicitly to control cost and latency.",
    keyPoints: [
      "TABLES — structured rows and columns",
      "FORMS — key-value pairs from checkboxes and fields",
      "LAYOUT — structural elements like headers and paragraphs",
      "Combine feature types in a single API call",
    ],
    tags: ["textract", "tables", "forms", "features"],
  },
  {
    id: "aif-textract-3",
    service: "Amazon Textract",
    domain: "deployment",
    difficulty: "medium",
    question: "What is the Textract Queries feature and when is it useful?",
    answer:
      "The Queries API lets you ask natural language questions about a document (e.g., 'What is the patient date of birth?') and Textract returns the specific answer from the document. This is useful when you know exactly what fields you need without parsing the full document structure.",
    keyPoints: [
      "Ask targeted questions to extract specific fields",
      "Returns the extracted value and its location on the page",
      "More efficient than parsing the full document response",
      "Useful for semi-structured documents with variable layouts",
    ],
    tags: ["textract", "queries", "extraction", "targeted"],
  },
  {
    id: "aif-textract-4",
    service: "Amazon Textract",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is the difference between Textract synchronous and asynchronous operations?",
    answer:
      "Synchronous operations (AnalyzeDocument, DetectDocumentText) process a single-page image in real time and return results immediately. Asynchronous operations (StartDocumentAnalysis, GetDocumentAnalysis) process multi-page PDFs and larger files, returning a JobId to poll for results — required for documents with 2+ pages.",
    keyPoints: [
      "Synchronous: single page, real-time, JPEG/PNG only for direct upload",
      "Asynchronous: multi-page PDFs, S3 required as input",
      "Poll GetDocumentAnalysis with JobId until SUCCEEDED",
      "SNS notification available when async job completes",
    ],
    tags: ["textract", "synchronous", "asynchronous", "pdf"],
  },
  {
    id: "aif-textract-5",
    service: "Amazon Textract",
    domain: "applications",
    difficulty: "medium",
    question:
      "A healthcare company needs to extract patient name, DOB, and diagnosis codes from scanned clinical forms. Which Textract approach is best?",
    answer:
      "Use Textract Queries with specific questions like 'What is the patient name?' and 'What is the date of birth?'. This targeted extraction is simpler than parsing full FORMS output and handles variable form layouts gracefully, returning only the needed fields.",
    keyPoints: [
      "Queries handle variable document layouts",
      "No need to parse the full document structure",
      "Textract Medical (via HealthLake) available for clinical NLP",
      "HIPAA-eligible service for PHI processing",
    ],
    tags: ["textract", "healthcare", "queries", "use-case"],
  },
  {
    id: "aif-textract-6",
    service: "Amazon Textract",
    domain: "security",
    difficulty: "hard",
    question:
      "How does Textract handle HIPAA compliance, and what should you do with PHI extracted from medical documents?",
    answer:
      "Amazon Textract is a HIPAA-eligible service, meaning AWS will sign a BAA and PHI can be processed. However, you are responsible for encrypting extracted text at rest (use SSE-KMS for S3 output), restricting IAM permissions to Textract and downstream resources, and not logging sensitive output to CloudWatch Logs.",
    keyPoints: [
      "Textract is HIPAA-eligible — BAA required",
      "Encrypt S3 buckets storing extracted PHI with KMS",
      "Avoid logging PHI in Lambda or API Gateway logs",
      "Combine with Comprehend Medical for clinical NLP on extracted text",
    ],
    tags: ["textract", "hipaa", "phi", "security"],
  },

  // ── Amazon Forecast ─────────────────────────────────────────────────────────
  {
    id: "aif-forecast-1",
    service: "Amazon Forecast",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Forecast?",
    answer:
      "Amazon Forecast is a managed ML service for time-series forecasting. It automatically trains state-of-the-art forecasting models on your historical data and produces probabilistic predictions (with prediction intervals) — requiring no ML expertise.",
    keyPoints: [
      "Probabilistic forecasting: P10, P50, P90 quantiles",
      "AutoML selects the best algorithm automatically",
      "Built-in algorithms: DeepAR+, CNN-QR, ETS, ARIMA, NPTS",
      "Use cases: demand forecasting, capacity planning, financial projections",
    ],
    tags: ["forecast", "time-series", "automl", "probabilistic"],
  },
  {
    id: "aif-forecast-2",
    service: "Amazon Forecast",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is the DeepAR+ algorithm in Amazon Forecast and why is it powerful?",
    answer:
      "DeepAR+ is a deep learning RNN-based algorithm that learns patterns across many related time series simultaneously rather than modeling each series independently. This transfer of knowledge between related series makes it especially accurate when individual series have limited history or high volatility.",
    keyPoints: [
      "Learns from hundreds or thousands of related time series at once",
      "Excellent for 'cold-start' series with little history",
      "Produces probabilistic forecasts natively",
      "Amazon's production forecasting algorithm",
    ],
    tags: ["forecast", "deepar", "deep-learning", "algorithm"],
  },
  {
    id: "aif-forecast-3",
    service: "Amazon Forecast",
    domain: "deployment",
    difficulty: "medium",
    question: "What are Related Time Series in Amazon Forecast?",
    answer:
      "Related Time Series are additional time-series variables beyond the target metric that influence the forecast — for example, price history, promotional events, or weather data. Providing related time series allows Forecast algorithms to learn causal relationships and improve accuracy.",
    keyPoints: [
      "Examples: price, promotion flags, holiday indicators",
      "Must overlap with the target time series in time",
      "Can extend into the future (forward-fill or provided future values)",
      "Supported by DeepAR+, CNN-QR, and some other algorithms",
    ],
    tags: ["forecast", "related-time-series", "feature-engineering"],
  },
  {
    id: "aif-forecast-4",
    service: "Amazon Forecast",
    domain: "deployment",
    difficulty: "medium",
    question:
      "What is the Amazon Forecast Weather Index and how does it improve predictions?",
    answer:
      "The Weather Index is a built-in feature in Forecast that automatically incorporates weather data (temperature, precipitation, wind speed) into the model without you having to source or manage weather data yourself. It uses AWS's proprietary weather datasets matched to your geographic locations.",
    keyPoints: [
      "Enable via a single parameter — no weather data ETL required",
      "AWS sources and maintains the weather data",
      "Significant accuracy improvement for weather-sensitive demand",
      "Useful for retail, energy, transportation forecasting",
    ],
    tags: ["forecast", "weather-index", "external-data"],
  },
  {
    id: "aif-forecast-5",
    service: "Amazon Forecast",
    domain: "applications",
    difficulty: "medium",
    question:
      "A grocery chain wants to predict weekly product demand for the next 12 weeks to optimize inventory. How should Amazon Forecast be configured?",
    answer:
      "Create a Dataset Group with the target time series (historical weekly sales), item metadata (category, price), and a related time series (promotions, holidays). Train a predictor with AutoML or DeepAR+ at a weekly frequency with a forecast horizon of 12. Generate Forecast exports to S3 for consumption by the inventory system.",
    keyPoints: [
      "Forecast horizon = 12 (weeks)",
      "Frequency = W (weekly)",
      "Include promotions as related time series",
      "P50 for expected demand; P90 for safety stock calculations",
    ],
    tags: ["forecast", "demand-forecasting", "retail", "use-case"],
  },
  {
    id: "aif-forecast-6",
    service: "Amazon Forecast",
    domain: "deployment",
    difficulty: "hard",
    question:
      "How does Amazon Forecast evaluate predictor accuracy and what metrics does it use?",
    answer:
      "Forecast uses backtest evaluations — it withholds the last N time steps of each series as a hold-out set and evaluates predictions against actuals. Metrics include RMSE (root mean squared error), wQL (weighted quantile loss at each quantile), MAPE (mean absolute percentage error), and MASE.",
    keyPoints: [
      "Backtesting is automatic and built into predictor training",
      "wQL measures quantile accuracy (for probabilistic forecasts)",
      "Multiple backtesting windows improve statistical reliability",
      "Lower RMSE and wQL = better predictor",
    ],
    tags: ["forecast", "backtesting", "evaluation-metrics", "rmse"],
  },

  // ── Amazon Panorama / Lookout ───────────────────────────────────────────────
  {
    id: "aif-panorama-1",
    service: "AWS Panorama",
    domain: "deployment",
    difficulty: "medium",
    question: "What is AWS Panorama?",
    answer:
      "AWS Panorama is an ML service that brings computer vision inference to the edge — directly on-premises at cameras. The AWS Panorama Appliance (or compatible third-party devices) runs your CV models locally, enabling real-time video analysis without streaming all footage to the cloud.",
    keyPoints: [
      "Edge inference on camera feeds — no cloud streaming required",
      "Panorama Appliance: AWS-provided hardware device",
      "Models deployed from SageMaker or S3",
      "Results sent to cloud for storage, alerting, dashboards",
    ],
    tags: ["panorama", "edge-inference", "computer-vision", "iot"],
  },
  {
    id: "aif-panorama-2",
    service: "AWS Panorama",
    domain: "applications",
    difficulty: "medium",
    question:
      "What are the primary use cases for AWS Panorama in industrial and retail settings?",
    answer:
      "In manufacturing: detecting defects on production lines, monitoring worker safety (PPE compliance, restricted area access). In retail: counting shoppers, detecting empty shelves, queue length monitoring. Panorama enables these use cases with low-latency local inference rather than cloud-dependent analysis.",
    keyPoints: [
      "Manufacturing: quality control, safety monitoring",
      "Retail: footfall analysis, shelf monitoring",
      "Reduces bandwidth costs vs. cloud video streaming",
      "Real-time alerting via local processing",
    ],
    tags: ["panorama", "manufacturing", "retail", "use-case"],
  },
  {
    id: "aif-panorama-3",
    service: "AWS Panorama",
    domain: "deployment",
    difficulty: "medium",
    question: "What is Amazon Lookout for Vision?",
    answer:
      "Amazon Lookout for Vision is a managed computer vision service for automated industrial visual inspection. It uses ML to detect product defects and anomalies from images with very small labeled datasets (as few as 30 normal images to get started), without requiring ML expertise.",
    keyPoints: [
      "Anomaly detection from as few as 30 images",
      "No ML expertise required",
      "Integrates with IoT Greengrass for edge deployment",
      "Use case: manufacturing quality control at scale",
    ],
    tags: ["panorama", "lookout-vision", "anomaly-detection", "manufacturing"],
  },
  {
    id: "aif-panorama-4",
    service: "AWS Panorama",
    domain: "applications",
    difficulty: "hard",
    question:
      "How does Amazon Lookout for Equipment differ from Lookout for Vision?",
    answer:
      "Lookout for Equipment analyzes sensor time-series data (vibration, temperature, pressure) from industrial machinery to detect anomalies indicating imminent failure — enabling predictive maintenance. Lookout for Vision analyzes images/video for visual defects. One is sensor-based; the other is vision-based.",
    keyPoints: [
      "Lookout for Equipment: time-series sensor data, predictive maintenance",
      "Lookout for Vision: image/video data, visual defect detection",
      "Both require labeled normal/anomaly data for training",
      "Both target industrial manufacturing use cases",
    ],
    tags: [
      "panorama",
      "lookout-equipment",
      "predictive-maintenance",
      "sensors",
    ],
  },
  {
    id: "aif-panorama-5",
    service: "AWS Panorama",
    domain: "security",
    difficulty: "medium",
    question:
      "What privacy and security considerations apply to AWS Panorama deployments?",
    answer:
      "Video footage contains sensitive personal data. Best practices: process video locally and send only metadata/results to the cloud (minimizing data exposure), encrypt data in transit and at rest, implement IAM roles for the Panorama device, and ensure compliance with local privacy laws (GDPR, CCPA) regarding video surveillance.",
    keyPoints: [
      "Process locally — avoid sending raw video to cloud",
      "Encrypt inference results sent to cloud (TLS/HTTPS)",
      "Restrict Panorama device IAM role to least privilege",
      "Consult legal/compliance for employee surveillance regulations",
    ],
    tags: ["panorama", "privacy", "security", "compliance"],
  },
  {
    id: "aif-panorama-6",
    service: "AWS Panorama",
    domain: "deployment",
    difficulty: "easy",
    question: "What types of cameras does AWS Panorama support?",
    answer:
      "AWS Panorama supports IP cameras that output RTSP (Real-Time Streaming Protocol) streams. The Panorama Appliance connects to these cameras over the local network and runs ML inference on the streams without requiring camera replacement or firmware changes.",
    keyPoints: [
      "Requires IP cameras with RTSP stream output",
      "No camera replacement needed — works with existing cameras",
      "Appliance connects over local network",
      "Supports multiple camera feeds simultaneously",
    ],
    tags: ["panorama", "cameras", "rtsp", "hardware"],
  },

  // ── AWS Trainium / Inferentia ───────────────────────────────────────────────
  {
    id: "aif-trainium-1",
    service: "AWS Trainium / Inferentia",
    domain: "deployment",
    difficulty: "medium",
    question: "What is AWS Trainium and what problem does it solve?",
    answer:
      "AWS Trainium is a purpose-built ML training chip designed by AWS. It delivers high throughput for training large deep learning models (especially transformers) at lower cost than GPU instances. Trainium2 chips power Trn1/Trn2 EC2 instances, which can be 50% cheaper than comparable GPU instances for training.",
    keyPoints: [
      "Purpose-built for ML training (not inference)",
      "Powers Trn1 and Trn2 EC2 instance families",
      "Optimized for large transformer and generative AI models",
      "Cost-effective alternative to GPU instances for training",
    ],
    tags: ["trainium", "ml-training", "custom-chip", "cost"],
  },
  {
    id: "aif-trainium-2",
    service: "AWS Trainium / Inferentia",
    domain: "deployment",
    difficulty: "medium",
    question: "What is AWS Inferentia and how does it differ from Trainium?",
    answer:
      "AWS Inferentia is a purpose-built ML inference chip. While Trainium is optimized for the training phase (gradient computation, large batch processing), Inferentia is optimized for inference (low-latency, high-throughput prediction at production scale). Inferentia2 powers Inf2 EC2 instances.",
    keyPoints: [
      "Inferentia: optimized for inference, not training",
      "Powers Inf1 and Inf2 EC2 instance families",
      "Up to 40% better price-performance vs GPU for inference",
      "Supports models in TensorFlow, PyTorch, MXNet via Neuron SDK",
    ],
    tags: ["trainium", "inferentia", "inference", "custom-chip"],
  },
  {
    id: "aif-trainium-3",
    service: "AWS Trainium / Inferentia",
    domain: "deployment",
    difficulty: "medium",
    question: "What is the AWS Neuron SDK?",
    answer:
      "The AWS Neuron SDK is the software stack for compiling and running ML models on Trainium and Inferentia hardware. It includes a compiler that converts PyTorch or TensorFlow models to optimized machine code for the Neuron chips, and runtime libraries for executing the compiled models.",
    keyPoints: [
      "Compiler converts ML models to Neuron-native code",
      "Integrates with PyTorch (torch-neuron) and TensorFlow",
      "Neuron-compiled models stored and deployed like regular models",
      "Required to use Trn1/Inf2 instances effectively",
    ],
    tags: ["trainium", "neuron-sdk", "compiler", "runtime"],
  },
  {
    id: "aif-trainium-4",
    service: "AWS Trainium / Inferentia",
    domain: "applications",
    difficulty: "hard",
    question:
      "When should you choose Inferentia (Inf2) over a GPU instance for production inference?",
    answer:
      "Choose Inf2 when running large-scale inference on transformer models (BERT, LLMs, diffusion models) where cost and throughput matter more than maximum model flexibility. Inf2 is best for well-established production workloads with stable model architectures; GPU instances offer more flexibility for research and models with unusual operations not yet supported by Neuron.",
    keyPoints: [
      "Inf2: better cost per inference for high-volume production",
      "GPU: better for research, prototyping, or unusual model ops",
      "Neuron SDK compilation is a one-time step per model version",
      "SageMaker supports Inf2 instances natively for endpoints",
    ],
    tags: ["trainium", "inferentia", "gpu", "cost-optimization"],
  },
  {
    id: "aif-trainium-5",
    service: "AWS Trainium / Inferentia",
    domain: "deployment",
    difficulty: "easy",
    question:
      "What EC2 instance families are powered by AWS Trainium and Inferentia chips?",
    answer:
      "Trainium powers the Trn1 and Trn2 instance families (for training). Inferentia powers the Inf1 (Inferentia1) and Inf2 (Inferentia2) instance families (for inference). These instances are available in SageMaker Training Jobs and Endpoints, and directly as EC2 instances.",
    keyPoints: [
      "Trn1/Trn2: Trainium — training workloads",
      "Inf1/Inf2: Inferentia — inference workloads",
      "Available in EC2, SageMaker, and EKS",
      "Inf2 significantly more powerful than Inf1 for LLMs",
    ],
    tags: ["trainium", "inferentia", "ec2-instances", "trn1", "inf2"],
  },
  {
    id: "aif-trainium-6",
    service: "AWS Trainium / Inferentia",
    domain: "deployment",
    difficulty: "hard",
    question:
      "How do Trn2 instances support large generative AI model training that doesn't fit in a single chip's memory?",
    answer:
      "Trn2 instances support NeuronLink, a high-bandwidth, low-latency interconnect between chips within an instance and across instances in a Trn2.48xlarge Ultra Cluster. Combined with tensor parallelism and pipeline parallelism via the Neuron SDK, this allows training models with hundreds of billions of parameters that exceed single-chip memory.",
    keyPoints: [
      "NeuronLink: inter-chip high-bandwidth interconnect",
      "Supports tensor and pipeline parallelism",
      "Ultra Clusters: scale to thousands of Trainium chips",
      "Essential for training frontier-scale LLMs cost-effectively",
    ],
    tags: ["trainium", "trn2", "parallelism", "large-models"],
  },

  // ── Generative AI Fundamentals ──────────────────────────────────────────────
  {
    id: "aif-genai-1",
    service: "Generative AI",
    domain: "development",
    difficulty: "easy",
    question: "What is a Foundation Model (FM)?",
    answer:
      "A Foundation Model is a large ML model trained on broad, diverse datasets at massive scale that can be adapted to a wide range of downstream tasks via prompting, fine-tuning, or RAG — without being retrained from scratch for each task. Examples include GPT-4, Claude, and Amazon Titan.",
    keyPoints: [
      "Trained once on vast data; adapted for many tasks",
      "Emergent capabilities not explicitly trained for",
      "Scale: billions to trillions of parameters",
      "Foundation for generative AI applications",
    ],
    tags: ["genai", "foundation-model", "llm", "fundamentals"],
  },
  {
    id: "aif-genai-2",
    service: "Generative AI",
    domain: "development",
    difficulty: "easy",
    question: "What is prompt engineering and why does it matter?",
    answer:
      "Prompt engineering is the practice of designing and optimizing the input text (prompt) given to an LLM to elicit the desired output. Since FMs are sensitive to how instructions are phrased, a well-crafted prompt dramatically improves accuracy, relevance, and safety without any model retraining.",
    keyPoints: [
      "No model retraining required — just text input design",
      "Includes system prompts, role-setting, and examples",
      "Major techniques: zero-shot, few-shot, chain-of-thought",
      "Critical skill for building reliable FM-powered applications",
    ],
    tags: ["genai", "prompt-engineering", "llm", "fundamentals"],
  },
  {
    id: "aif-genai-3",
    service: "Generative AI",
    domain: "development",
    difficulty: "medium",
    question:
      "What is the difference between zero-shot, few-shot, and chain-of-thought prompting?",
    answer:
      "Zero-shot: ask the model to perform a task with no examples — relies entirely on pre-trained knowledge. Few-shot: include 1-5 labeled examples in the prompt, demonstrating the desired input-output format. Chain-of-thought: instruct the model to reason step by step before answering, improving accuracy on complex reasoning tasks.",
    keyPoints: [
      "Zero-shot: no examples, fast, works for simple tasks",
      "Few-shot: examples in prompt, better for structured outputs",
      "Chain-of-thought: 'think step by step' improves reasoning",
      "Combine techniques for best results on hard tasks",
    ],
    tags: ["genai", "zero-shot", "few-shot", "chain-of-thought"],
  },
  {
    id: "aif-genai-4",
    service: "Generative AI",
    domain: "development",
    difficulty: "medium",
    question: "What is Retrieval-Augmented Generation (RAG)?",
    answer:
      "RAG is a pattern where relevant documents are retrieved from an external knowledge base and injected into the prompt context before the FM generates a response. This grounds the model's answer in specific, up-to-date information rather than relying solely on training data, reducing hallucination.",
    keyPoints: [
      "Retrieve: embed query, search vector store for similar chunks",
      "Augment: inject retrieved chunks into the prompt",
      "Generate: FM produces grounded answer using the context",
      "Keeps knowledge current without model retraining",
    ],
    tags: ["genai", "rag", "retrieval", "hallucination"],
  },
  {
    id: "aif-genai-5",
    service: "Generative AI",
    domain: "development",
    difficulty: "medium",
    question: "What is hallucination in LLMs and why does it occur?",
    answer:
      "Hallucination is when an LLM generates plausible-sounding but factually incorrect or fabricated information. It occurs because LLMs are trained to predict statistically likely next tokens, not to retrieve verified facts — they 'fill in the gaps' with confident-sounding text even when uncertain.",
    keyPoints: [
      "Model outputs confident but false information",
      "Root cause: next-token prediction, not fact retrieval",
      "Mitigation: RAG, grounding, output validation, guardrails",
      "Hallucination rate varies by model size and training quality",
    ],
    tags: ["genai", "hallucination", "reliability", "llm"],
  },
  {
    id: "aif-genai-6",
    service: "Generative AI",
    domain: "development",
    difficulty: "medium",
    question:
      "What are tokens in the context of LLMs and why do they matter for cost?",
    answer:
      "Tokens are the basic units of text that LLMs process — roughly 4 characters or 3/4 of a word in English. LLMs have a context window (token limit) for input + output, and API pricing is typically per 1,000 input and output tokens. Understanding tokenization helps optimize prompts for cost and context length.",
    keyPoints: [
      "~1 token ≈ 4 characters ≈ 0.75 words in English",
      "Context window: max total tokens (input + output) per call",
      "Cost scales with input tokens + output tokens",
      "Longer prompts cost more and consume context space",
    ],
    tags: ["genai", "tokens", "context-window", "cost"],
  },
  {
    id: "aif-genai-7",
    service: "Generative AI",
    domain: "development",
    difficulty: "hard",
    question:
      "What is the temperature parameter in LLM inference and how does it affect output?",
    answer:
      "Temperature controls the randomness of an LLM's output by scaling the probability distribution over tokens before sampling. Temperature = 0 makes the model deterministic (always picks the most likely token). Higher temperature (e.g., 1.0–2.0) increases diversity and creativity but also increases the chance of errors or incoherence.",
    keyPoints: [
      "Temperature = 0: deterministic, best for factual Q&A",
      "Temperature 0.7: balanced creativity and coherence",
      "High temperature: more diverse but less reliable output",
      "Works alongside top-p (nucleus sampling) for output control",
    ],
    tags: ["genai", "temperature", "sampling", "inference-params"],
  },

  // ── Responsible AI ──────────────────────────────────────────────────────────
  {
    id: "aif-responsible-ai-1",
    service: "Responsible AI",
    domain: "security",
    difficulty: "easy",
    question: "What is responsible AI and what are its core dimensions?",
    answer:
      "Responsible AI is the practice of building and deploying AI systems that are fair, transparent, accountable, safe, and privacy-preserving. AWS's Responsible AI framework emphasizes fairness (no discriminatory outcomes), explainability, robustness, privacy, safety, and controllability.",
    keyPoints: [
      "Fairness: no discrimination based on protected attributes",
      "Explainability: understand why the model made a decision",
      "Privacy: protect personal data used in training and inference",
      "Safety: prevent harmful outputs and real-world harms",
    ],
    tags: ["responsible-ai", "fairness", "explainability", "ethics"],
  },
  {
    id: "aif-responsible-ai-2",
    service: "Responsible AI",
    domain: "security",
    difficulty: "medium",
    question: "What is AI bias and what are its main sources?",
    answer:
      "AI bias occurs when a model produces systematically unfair or skewed outputs, often disadvantaging protected groups. Main sources: historical bias in training data (reflecting past discrimination), representation bias (underrepresented groups in data), and measurement bias (flawed proxies for the true target variable).",
    keyPoints: [
      "Historical bias: training data reflects past human biases",
      "Representation bias: some groups underrepresented in data",
      "Measurement bias: poor choice of features or labels",
      "Mitigation: diverse data, bias audits, fairness metrics",
    ],
    tags: ["responsible-ai", "bias", "fairness", "training-data"],
  },
  {
    id: "aif-responsible-ai-3",
    service: "Responsible AI",
    domain: "security",
    difficulty: "medium",
    question:
      "What are Model Cards and why are they important for responsible AI?",
    answer:
      "A Model Card is a standardized document that describes a model's intended use, training data, performance across demographic groups, known limitations, and ethical considerations. They enable transparency by giving users the information needed to assess whether a model is appropriate for their use case.",
    keyPoints: [
      "Discloses training data sources and known biases",
      "Reports performance metrics across different subgroups",
      "Lists intended use cases and out-of-scope uses",
      "AWS publishes Model Cards for Amazon AI services",
    ],
    tags: ["responsible-ai", "model-cards", "transparency", "documentation"],
  },
  {
    id: "aif-responsible-ai-4",
    service: "Responsible AI",
    domain: "security",
    difficulty: "medium",
    question:
      "What is SageMaker Clarify and what responsible AI problems does it address?",
    answer:
      "SageMaker Clarify detects statistical bias in training data and model predictions, and generates feature importance explanations (SHAP values) for model decisions. It integrates with SageMaker Model Monitor to continuously detect bias drift and explanation drift in production models.",
    keyPoints: [
      "Pre-training bias metrics: class imbalance, label correlation",
      "Post-training bias metrics: disparate impact across subgroups",
      "SHAP-based explainability: which features drove each prediction",
      "Bias monitoring in production via Model Monitor integration",
    ],
    tags: ["responsible-ai", "sagemaker-clarify", "bias", "explainability"],
  },
  {
    id: "aif-responsible-ai-5",
    service: "Responsible AI",
    domain: "security",
    difficulty: "hard",
    question:
      "What is the difference between AI explainability and AI interpretability?",
    answer:
      "Interpretability refers to models that are inherently understandable by design — like decision trees or linear models where the logic can be read directly. Explainability refers to post-hoc techniques that explain the behavior of complex black-box models (neural networks, ensemble models) using approximate methods like SHAP or LIME.",
    keyPoints: [
      "Interpretable models: linear regression, decision trees",
      "Explainable (black-box + explanation): XGBoost + SHAP",
      "SHAP: Shapley values attributing prediction to each feature",
      "LIME: local approximation of model behavior around a single prediction",
    ],
    tags: ["responsible-ai", "explainability", "interpretability", "shap"],
  },
  {
    id: "aif-responsible-ai-6",
    service: "Responsible AI",
    domain: "security",
    difficulty: "medium",
    question:
      "What AWS services and features support responsible AI governance?",
    answer:
      "Key AWS governance tools: SageMaker Clarify (bias/explainability), SageMaker Model Cards (documentation), Bedrock Guardrails (content safety), Model Monitor (drift detection), SageMaker Model Registry (version control and approval workflows), and AWS Audit Manager (compliance evidence collection).",
    keyPoints: [
      "Clarify: bias detection and SHAP explainability",
      "Model Registry: model versioning and approval gates",
      "Bedrock Guardrails: content filtering for GenAI outputs",
      "Audit Manager: collects evidence for AI compliance audits",
    ],
    tags: ["responsible-ai", "governance", "sagemaker", "bedrock"],
  },

  // ── AI Security ─────────────────────────────────────────────────────────────
  {
    id: "aif-ai-security-1",
    service: "AI Security",
    domain: "security",
    difficulty: "medium",
    question:
      "What is prompt injection and why is it a risk in LLM applications?",
    answer:
      "Prompt injection occurs when a user crafts malicious input that overrides or bypasses the system prompt's instructions, causing the LLM to perform unauthorized actions (e.g., ignoring safety guidelines, leaking system prompt contents, or taking unintended actions). It is a top security risk for LLM-powered applications.",
    keyPoints: [
      "Direct injection: user prompt overrides system prompt",
      "Indirect injection: malicious content in retrieved documents (RAG)",
      "Mitigation: input validation, output filtering, Bedrock Guardrails",
      "Principle of least privilege for agentic AI systems",
    ],
    tags: ["ai-security", "prompt-injection", "llm", "attack"],
  },
  {
    id: "aif-ai-security-2",
    service: "AI Security",
    domain: "security",
    difficulty: "medium",
    question: "What is data poisoning in the context of ML security?",
    answer:
      "Data poisoning is an attack where an adversary injects malicious or manipulated training examples into the training dataset, causing the model to learn incorrect patterns. This can lead to targeted misclassifications (backdoor attacks) or general model degradation.",
    keyPoints: [
      "Attack surface: training data collection and preprocessing pipeline",
      "Backdoor attack: model behaves normally except on specific trigger inputs",
      "Mitigation: data provenance tracking, anomaly detection in training sets",
      "Particularly concerning for models trained on web-scraped or user-generated data",
    ],
    tags: ["ai-security", "data-poisoning", "adversarial", "training"],
  },
  {
    id: "aif-ai-security-3",
    service: "AI Security",
    domain: "security",
    difficulty: "medium",
    question:
      "What is a model inversion attack and what data does it risk exposing?",
    answer:
      "A model inversion attack exploits a model's outputs to reconstruct private training data. By querying the model and analyzing confidence scores, an attacker can infer information about individuals in the training set. This is a privacy risk when models are trained on sensitive data like medical records or financial information.",
    keyPoints: [
      "Attacker uses model outputs to reconstruct training samples",
      "Higher risk when model returns confidence scores rather than just labels",
      "Mitigation: differential privacy during training, output confidence rate limiting",
      "AWS PrivacyBridge and differential privacy techniques help mitigate",
    ],
    tags: ["ai-security", "model-inversion", "privacy", "attack"],
  },
  {
    id: "aif-ai-security-4",
    service: "AI Security",
    domain: "security",
    difficulty: "hard",
    question:
      "How should you apply the principle of least privilege to an AI agent built with Amazon Bedrock Agents?",
    answer:
      "The Bedrock Agent's execution role should only have permissions to the exact APIs it needs (specific Lambda functions, specific S3 prefixes, specific DynamoDB tables). Action Groups should be scoped to only the operations required. Guardrails should restrict the agent's topic scope. Audit agent invocations via CloudTrail.",
    keyPoints: [
      "IAM role for agent: grant only necessary resource permissions",
      "Action Groups: expose only needed API operations",
      "Guardrails: restrict topics and block harmful actions",
      "CloudTrail: log all agent invocations for audit",
    ],
    tags: ["ai-security", "least-privilege", "bedrock-agents", "iam"],
  },
  {
    id: "aif-ai-security-5",
    service: "AI Security",
    domain: "security",
    difficulty: "medium",
    question:
      "What controls should be applied to S3 buckets containing ML training data?",
    answer:
      "Apply server-side encryption (SSE-KMS with customer-managed keys), enforce S3 Block Public Access, use S3 bucket policies to restrict access to specific IAM roles (SageMaker training role, data scientists' role). Enable S3 access logging and CloudTrail data events to audit who accessed what and when.",
    keyPoints: [
      "SSE-KMS: encrypt at rest with CMK for key control",
      "Block Public Access: prevent accidental public exposure",
      "Resource-based bucket policies: least-privilege access",
      "Access logging + CloudTrail: full audit trail for compliance",
    ],
    tags: ["ai-security", "s3", "encryption", "training-data"],
  },
  {
    id: "aif-ai-security-6",
    service: "AI Security",
    domain: "security",
    difficulty: "hard",
    question:
      "What is adversarial machine learning and how do adversarial examples attack computer vision models?",
    answer:
      "Adversarial ML involves crafting inputs specifically designed to fool ML models. Adversarial examples for CV models are images with imperceptible pixel-level perturbations (noise added to individual pixels) that cause the model to misclassify the image with high confidence while appearing identical to humans.",
    keyPoints: [
      "Perturbations are invisible to humans but highly effective against models",
      "FGSM (Fast Gradient Sign Method) is a common attack technique",
      "Mitigation: adversarial training, input preprocessing, ensemble detection",
      "Critical risk in safety-sensitive applications: autonomous vehicles, medical imaging",
    ],
    tags: ["ai-security", "adversarial-ml", "computer-vision", "attack"],
  },

  // ── Amazon Q ────────────────────────────────────────────────────────────────
  {
    id: "aif-amazon-q-1",
    service: "Amazon Q",
    domain: "deployment",
    difficulty: "easy",
    question: "What is Amazon Q and what are its two main product variants?",
    answer:
      "Amazon Q is AWS's generative AI assistant. Amazon Q Business is an enterprise assistant that answers questions using your company's internal data (documents, wikis, ticketing systems). Amazon Q Developer is a coding assistant integrated into IDEs that generates, explains, and transforms code.",
    keyPoints: [
      "Q Business: enterprise Q&A grounded in your organization's data",
      "Q Developer: AI coding assistant for IDEs (VS Code, JetBrains)",
      "Both built on AWS's own FMs",
      "Different products, different use cases, same brand",
    ],
    tags: ["amazon-q", "q-business", "q-developer", "genai-assistant"],
  },
  {
    id: "aif-amazon-q-2",
    service: "Amazon Q",
    domain: "deployment",
    difficulty: "medium",
    question: "How does Amazon Q Business connect to enterprise data sources?",
    answer:
      "Amazon Q Business uses data source connectors (similar to Kendra) to index content from SharePoint, Confluence, Salesforce, S3, Google Drive, ServiceNow, and 40+ other repositories. It also respects access control lists (ACLs) from the source systems so users only see documents they're already authorized to view.",
    keyPoints: [
      "40+ pre-built connectors for enterprise repositories",
      "ACL enforcement: users see only what they're permitted to see",
      "Indexes are kept current via scheduled sync jobs",
      "Integrates with IAM Identity Center for user authentication",
    ],
    tags: ["amazon-q", "q-business", "connectors", "access-control"],
  },
  {
    id: "aif-amazon-q-3",
    service: "Amazon Q",
    domain: "deployment",
    difficulty: "medium",
    question: "What is Amazon Q Developer and what can it do?",
    answer:
      "Amazon Q Developer is an AI-powered coding assistant available in VS Code, JetBrains IDEs, and the AWS console. It provides inline code completions, generates code from natural language descriptions, explains existing code, finds security vulnerabilities, optimizes code, and can transform legacy code (e.g., Java 8 → Java 17).",
    keyPoints: [
      "Inline code completions as you type",
      "Natural language to code generation",
      "Security vulnerability scanning (integrated with CodeGuru)",
      "Code transformation: Java upgrades, mainframe migration",
    ],
    tags: ["amazon-q", "q-developer", "coding-assistant", "ide"],
  },
  {
    id: "aif-amazon-q-4",
    service: "Amazon Q",
    domain: "security",
    difficulty: "medium",
    question:
      "What admin controls does Amazon Q Business provide for enterprise governance?",
    answer:
      "Q Business admins can configure topic-level restrictions (block or allow specific topics), set up global controls to govern all responses, enforce document-level access permissions from source systems, and configure guardrails to prevent the assistant from responding to questions outside the intended scope.",
    keyPoints: [
      "Global controls: organization-wide topic restrictions",
      "Topic-level controls: allow or block specific subject areas",
      "ACL enforcement: prevents data leakage across permission boundaries",
      "Audit logs via CloudTrail for compliance monitoring",
    ],
    tags: ["amazon-q", "admin-controls", "governance", "security"],
  },
  {
    id: "aif-amazon-q-5",
    service: "Amazon Q",
    domain: "applications",
    difficulty: "easy",
    question:
      "A company wants their employees to ask questions about HR policies, IT procedures, and internal wikis in natural language. Which AWS service is the best fit?",
    answer:
      "Amazon Q Business is the best fit. It connects to the company's internal data sources via pre-built connectors, respects existing access permissions, and provides an enterprise chatbot interface that answers questions grounded in internal documents — all without building a custom RAG pipeline.",
    keyPoints: [
      "Pre-built connectors for common enterprise data sources",
      "Permission-aware — users only see authorized content",
      "No custom ML or RAG pipeline required",
      "Managed service with built-in admin controls",
    ],
    tags: ["amazon-q", "q-business", "enterprise", "use-case"],
  },
  {
    id: "aif-amazon-q-6",
    service: "Amazon Q",
    domain: "applications",
    difficulty: "hard",
    question:
      "What is the Amazon Q Apps feature and how does it extend Q Business?",
    answer:
      "Amazon Q Apps (part of Q Business) allows employees to create lightweight, shareable generative AI applications from Q Business conversations — for example, a 'Draft a job description' app or 'Summarize a meeting' app — without writing code. Apps can be shared within the organization via an app library.",
    keyPoints: [
      "Build apps from Q Business chat conversations",
      "No coding required — natural language configuration",
      "Published to an internal app library for team reuse",
      "Governed by the same Q Business admin controls",
    ],
    tags: ["amazon-q", "q-apps", "low-code", "enterprise"],
  },
  {
    id: "aif-amazon-q-7",
    service: "Amazon Q",
    domain: "deployment",
    difficulty: "medium",
    question:
      "How does Amazon Q Developer help with security in the software development lifecycle?",
    answer:
      "Q Developer scans code for security vulnerabilities using its built-in security scanning capability (powered by Amazon CodeGuru Security). It identifies issues like SQL injection, hardcoded credentials, insecure cryptography, and open-source dependency vulnerabilities, and suggests remediations inline in the IDE.",
    keyPoints: [
      "Detects OWASP Top 10 and CWE vulnerabilities",
      "Identifies hardcoded secrets and credentials",
      "Suggests code fixes inline in the IDE",
      "Powered by Amazon CodeGuru Security ML models",
    ],
    tags: ["amazon-q", "q-developer", "security-scanning", "devsecops"],
  },

  // ── ML Fundamentals ─────────────────────────────────────────────────────────
  {
    id: "aif-ml-fundamentals-1",
    service: "ML Fundamentals",
    domain: "development",
    difficulty: "easy",
    question:
      "What is the difference between supervised, unsupervised, and reinforcement learning?",
    answer:
      "Supervised learning trains on labeled data (input-output pairs) to predict outputs for new inputs — used for classification and regression. Unsupervised learning finds patterns in unlabeled data — used for clustering and dimensionality reduction. Reinforcement learning trains an agent to maximize reward through trial-and-error interaction with an environment.",
    keyPoints: [
      "Supervised: labeled data, predict output (classification/regression)",
      "Unsupervised: unlabeled data, discover structure (clustering/PCA)",
      "Reinforcement: agent-environment loop, maximize cumulative reward",
      "Most real-world ML tasks are supervised",
    ],
    tags: ["ml-fundamentals", "supervised", "unsupervised", "reinforcement"],
  },
  {
    id: "aif-ml-fundamentals-2",
    service: "ML Fundamentals",
    domain: "development",
    difficulty: "easy",
    question:
      "What is the difference between classification and regression in supervised learning?",
    answer:
      "Classification predicts a discrete category label (e.g., spam/not-spam, dog/cat/bird). Regression predicts a continuous numerical value (e.g., house price, stock return). The choice of algorithm, loss function, and evaluation metrics differ between the two task types.",
    keyPoints: [
      "Classification: categorical output — logistic regression, random forest, SVM",
      "Regression: numerical output — linear regression, gradient boosting",
      "Classification metrics: accuracy, precision, recall, F1, AUC-ROC",
      "Regression metrics: RMSE, MAE, R²",
    ],
    tags: ["ml-fundamentals", "classification", "regression", "supervised"],
  },
  {
    id: "aif-ml-fundamentals-3",
    service: "ML Fundamentals",
    domain: "development",
    difficulty: "medium",
    question: "What is overfitting, and how can it be detected and mitigated?",
    answer:
      "Overfitting occurs when a model learns the training data too well — including noise and quirks — and performs poorly on unseen data. Detected by a large gap between training accuracy (high) and validation accuracy (low). Mitigated by more training data, regularization (L1/L2), dropout, simpler model architecture, or early stopping.",
    keyPoints: [
      "Symptom: high train accuracy, low validation accuracy",
      "Regularization: L1 (Lasso) and L2 (Ridge) penalize large weights",
      "Dropout: randomly disables neurons during training",
      "Early stopping: halt training when validation loss stops improving",
    ],
    tags: ["ml-fundamentals", "overfitting", "regularization", "validation"],
  },
  {
    id: "aif-ml-fundamentals-4",
    service: "ML Fundamentals",
    domain: "development",
    difficulty: "medium",
    question: "What is the purpose of train/validation/test splits in ML?",
    answer:
      "Training set: used to fit the model parameters. Validation set: used to tune hyperparameters and select the best model — acts as a proxy for unseen data during development. Test set: held out completely until final evaluation, providing an unbiased estimate of real-world performance.",
    keyPoints: [
      "Typical split: 70/15/15 or 80/10/10",
      "Validation set prevents hyperparameter overfitting",
      "Test set must never influence model or hyperparameter decisions",
      "Cross-validation (k-fold) is used when data is limited",
    ],
    tags: ["ml-fundamentals", "train-test-split", "validation", "evaluation"],
  },
  {
    id: "aif-ml-fundamentals-5",
    service: "ML Fundamentals",
    domain: "development",
    difficulty: "medium",
    question: "What is the bias-variance tradeoff in ML?",
    answer:
      "Bias is error from incorrect assumptions — high-bias models underfit (too simple). Variance is sensitivity to fluctuations in training data — high-variance models overfit (too complex). The tradeoff: reducing bias (adding complexity) tends to increase variance, and vice versa. The optimal model balances both to minimize total error.",
    keyPoints: [
      "High bias = underfitting (model too simple)",
      "High variance = overfitting (model too complex)",
      "Total error = bias² + variance + irreducible noise",
      "Ensemble methods (bagging, boosting) help manage this tradeoff",
    ],
    tags: ["ml-fundamentals", "bias-variance", "underfitting", "overfitting"],
  },
  {
    id: "aif-ml-fundamentals-6",
    service: "ML Fundamentals",
    domain: "development",
    difficulty: "hard",
    question:
      "What do precision, recall, F1, and AUC-ROC measure, and when do you prioritize each?",
    answer:
      "Precision = TP/(TP+FP): of predicted positives, how many are correct — prioritize when false positives are costly (e.g., spam filter). Recall = TP/(TP+FN): of actual positives, how many were caught — prioritize when false negatives are costly (e.g., cancer screening). F1 = harmonic mean of both. AUC-ROC measures overall discriminability across all classification thresholds.",
    keyPoints: [
      "Precision: minimize false positives",
      "Recall (Sensitivity): minimize false negatives",
      "F1: balance when both FP and FN costs matter equally",
      "AUC-ROC: threshold-independent overall model quality (0.5 = random, 1.0 = perfect)",
    ],
    tags: ["ml-fundamentals", "precision", "recall", "f1", "auc-roc"],
  },
  {
    id: "aif-ml-fundamentals-7",
    service: "ML Fundamentals",
    domain: "development",
    difficulty: "medium",
    question:
      "What are embeddings and why are they foundational to modern NLP and GenAI?",
    answer:
      "Embeddings are dense, fixed-size vector representations of data (text, images, audio) in a continuous vector space where semantically similar items are geometrically close. In NLP, word or sentence embeddings allow ML models to work with text numerically. In RAG, embeddings enable semantic similarity search in vector databases.",
    keyPoints: [
      "Words/sentences mapped to high-dimensional vectors",
      "Semantic similarity = small cosine distance between vectors",
      "Generated by encoder models (e.g., Amazon Titan Embeddings)",
      "Stored in vector databases (OpenSearch, Pinecone, pgvector) for RAG",
    ],
    tags: ["ml-fundamentals", "embeddings", "vector", "nlp", "rag"],
  },
];
