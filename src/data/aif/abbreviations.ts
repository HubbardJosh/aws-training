export const AIF_ABBREVIATIONS: Record<string, string> = {
  // AI/ML foundations
  AI: "Artificial Intelligence — systems that perform tasks requiring human-like intelligence",
  ML: "Machine Learning — systems that learn patterns from data without explicit programming",
  DL: "Deep Learning — ML using multi-layered neural networks for complex pattern recognition",
  NLP: "Natural Language Processing — AI that understands and generates human language",
  CV: "Computer Vision — AI that interprets and understands images and video",
  LLM: "Large Language Model — a deep learning model trained on vast text to generate language",
  FM: "Foundation Model — large pre-trained model adaptable to many downstream tasks",
  GenAI:
    "Generative AI — AI that creates new content (text, images, audio) from learned patterns",
  RAG: "Retrieval-Augmented Generation — augments LLM responses with retrieved external knowledge",
  RL: "Reinforcement Learning — training agents via reward signals from environment interaction",
  RLHF: "Reinforcement Learning from Human Feedback — fine-tuning LLMs using human preference ratings",
  LoRA: "Low-Rank Adaptation — efficient fine-tuning technique that updates a small subset of weights",
  SFT: "Supervised Fine-Tuning — adapting a pre-trained model on labelled task-specific examples",

  // Model concepts
  API: "Application Programming Interface — contract for how software components communicate",
  SDK: "Software Development Kit — libraries and tools for building with a specific service",
  GPU: "Graphics Processing Unit — parallel processor essential for training deep learning models",
  TPU: "Tensor Processing Unit — Google's custom chip designed for ML workloads",
  FLOP: "Floating-Point Operation — unit used to measure computational cost of ML models",
  HPC: "High-Performance Computing — clusters of powerful processors for demanding workloads",
  ToT: "Temperature — parameter controlling randomness in LLM output (higher = more creative)",
  CoT: "Chain of Thought — prompting technique asking the model to reason step by step",

  // AWS AI services
  Bedrock:
    "Amazon Bedrock — fully managed service to build GenAI apps using foundation models",
  SageMaker:
    "Amazon SageMaker — end-to-end ML platform for build, train, and deploy",
  Rekognition:
    "Amazon Rekognition — image and video analysis using deep learning",
  Comprehend:
    "Amazon Comprehend — NLP service for entity recognition, sentiment, and key phrases",
  Lex: "Amazon Lex — build conversational chatbots (the technology behind Alexa)",
  Polly: "Amazon Polly — text-to-speech service with lifelike voices",
  Transcribe:
    "Amazon Transcribe — automatic speech recognition (speech to text)",
  Translate:
    "Amazon Translate — neural machine translation across 75+ languages",
  Textract:
    "Amazon Textract — extracts text, forms, and tables from scanned documents",
  Forecast: "Amazon Forecast — time-series forecasting using ML",
  Personalize:
    "Amazon Personalize — real-time personalisation and recommendation engine",
  Kendra: "Amazon Kendra — intelligent enterprise search powered by ML",
  Panorama: "AWS Panorama — brings computer vision to on-premises cameras",
  "Amazon Q":
    "Amazon Q — generative AI assistant for business productivity and coding",
  Inferentia:
    "AWS Inferentia — custom chip for cost-efficient deep learning inference",
  Trainium:
    "AWS Trainium — custom chip optimised for training deep learning models",

  // Evaluation & safety
  BLEU: "Bilingual Evaluation Understudy — metric scoring machine translation quality",
  ROUGE:
    "Recall-Oriented Understudy for Gisting Evaluation — metric for summarisation quality",
  F1: "F1 Score — harmonic mean of precision and recall; balanced classification metric",
  AUC: "Area Under the Curve — measures a classifier's ability to distinguish classes",
  ROC: "Receiver Operating Characteristic — curve plotting true vs false positive rate",
  MAE: "Mean Absolute Error — average absolute difference between predicted and actual values",
  RMSE: "Root Mean Square Error — square root of average squared prediction errors",
  MSE: "Mean Squared Error — average of squared differences between predictions and actuals",
  FP: "False Positive — model incorrectly predicts positive when the true label is negative",
  FN: "False Negative — model incorrectly predicts negative when the true label is positive",
  TP: "True Positive — model correctly predicts a positive outcome",
  TN: "True Negative — model correctly predicts a negative outcome",

  // Data & training
  ETL: "Extract, Transform, Load — pipeline for moving and reshaping data for ML use",
  EDA: "Exploratory Data Analysis — statistical analysis to understand dataset characteristics",
  PCA: "Principal Component Analysis — dimensionality reduction by projecting to key axes",
  NaN: "Not a Number — placeholder for missing or undefined numerical values in datasets",
  CSV: "Comma-Separated Values — tabular data stored as plain text rows",
  JSON: "JavaScript Object Notation — lightweight, human-readable data interchange format",
  S3: "Simple Storage Service — primary object store for ML datasets and model artefacts",
  ECR: "Elastic Container Registry — Docker image store used to deploy custom ML containers",

  // MLOps & deployment
  MLOps:
    "ML Operations — practices combining ML and DevOps to deploy and monitor models",
  CI: "Continuous Integration — automated build and test on every code commit",
  CD: "Continuous Deployment — automated release pipeline from code to production",
  API_GW:
    "API Gateway — managed service to expose ML models as REST or HTTP endpoints",
  IAM: "Identity and Access Management — controls access to AWS AI/ML services and data",
  KMS: "Key Management Service — manages encryption keys protecting model artefacts and data",
  VPC: "Virtual Private Cloud — isolated network for running ML infrastructure securely",
  CW: "CloudWatch — monitoring, logging, and alerting for SageMaker and other AI services",
  REST: "Representational State Transfer — stateless API architecture used to expose ML endpoints",
  HTTP: "HyperText Transfer Protocol — foundation of data communication on the web",
  HTTPS: "HTTP Secure — HTTP encrypted with TLS/SSL",
  TLS: "Transport Layer Security — cryptographic protocol securing network communication",
  SSH: "Secure Shell — encrypted remote access protocol used to connect to training instances",
  CLI: "Command Line Interface — text-based tool for interacting with AWS services",
  AMI: "Amazon Machine Image — template used to launch EC2 instances for ML training",
  EBS: "Elastic Block Store — persistent block storage attached to SageMaker training instances",
  EFS: "Elastic File System — shared file storage for distributed ML training jobs",
  SNS: "Simple Notification Service — pub/sub service used to alert on model drift or pipeline events",
  SQS: "Simple Queue Service — message queue used to buffer inference requests",
  DLQ: "Dead-Letter Queue — holds failed inference requests or pipeline messages for inspection",
  ARN: "Amazon Resource Name — globally unique identifier for any AWS resource",
  AZ: "Availability Zone — isolated data centre within an AWS Region",
  PaaS: "Platform as a Service — cloud model where provider manages the platform",
  SaaS: "Software as a Service — fully managed application delivered over the internet",

  // Speech & audio
  TTS: "Text-to-Speech — converts written text into spoken audio (used by Amazon Polly)",
  ASR: "Automatic Speech Recognition — converts spoken audio to text (used by Amazon Transcribe)",
  SSML: "Speech Synthesis Markup Language — XML-based language to control Polly's speech output",
  NMT: "Neural Machine Translation — deep learning approach to translating between languages",
  NLU: "Natural Language Understanding — AI capability to interpret meaning and intent in human text",
  OCR: "Optical Character Recognition — extracts printed or handwritten text from images",
  RTSP: "Real-Time Streaming Protocol — network protocol for controlling streaming media servers",

  // Security & compliance
  CMK: "Customer Master Key — KMS key that encrypts/decrypts your data keys",
  VPN: "Virtual Private Network — encrypted tunnel connecting your on-premises network to a VPC",
  SSO: "Single Sign-On — allows users to authenticate once and access multiple systems",
  RAM: "Resource Access Manager — AWS service for sharing resources across accounts",
  OWASP:
    "Open Web Application Security Project — community that maintains the Top 10 web vulnerability list",
  XSS: "Cross-Site Scripting — web attack that injects malicious scripts into pages viewed by other users",
  SMS: "Short Message Service — text messaging protocol used for mobile notifications",

  // Data formats & audio codecs
  ORC: "Optimized Row Columnar — column-oriented file format used in data lakes for efficient analytics",
  HTML: "HyperText Markup Language — standard language for structuring web page content",
  PCM: "Pulse-Code Modulation — uncompressed raw audio format used as input by Amazon Transcribe",
  OGG: "Ogg Vorbis — open-source compressed audio format supported by Amazon Polly",
  MP3: "MPEG Audio Layer 3 — compressed audio format supported by Amazon Polly for speech output",

  // ML algorithms & architectures
  ARIMA:
    "AutoRegressive Integrated Moving Average — classical statistical model for time-series forecasting",
  CNN: "Convolutional Neural Network — deep learning architecture specialised for image and signal processing",
  BERT: "Bidirectional Encoder Representations from Transformers — pre-trained NLP model for language understanding",
  LDA: "Latent Dirichlet Allocation — probabilistic topic modelling algorithm for text corpora",
  WAPE: "Weighted Absolute Percentage Error — accuracy metric used by Amazon Forecast",
  NTTS: "Neural Text-to-Speech — Polly engine that produces the most natural-sounding voices",

  // Infrastructure & hardware
  CUDA: "Compute Unified Device Architecture — NVIDIA's parallel computing platform used to train deep learning models",
  MQTT: "Message Queuing Telemetry Transport — lightweight pub/sub protocol for IoT devices",

  // Compliance & privacy
  PHI: "Protected Health Information — individually identifiable health data regulated under HIPAA",
  DTMF: "Dual-Tone Multi-Frequency — touch-tone signals used in telephony; Transcribe can detect them",

  // Responsible AI
  XAI: "Explainable AI — techniques that make model decisions interpretable to humans",
  SHAP: "SHapley Additive exPlanations — method for explaining individual model predictions",
  LIME: "Local Interpretable Model-agnostic Explanations — local surrogate model for explainability",
  PII: "Personally Identifiable Information — data that can identify a specific individual",
  GDPR: "General Data Protection Regulation — EU law governing personal data privacy",
  CCPA: "California Consumer Privacy Act — US state law granting data rights to consumers",
  HIPAA:
    "Health Insurance Portability and Accountability Act — US healthcare data privacy law",
  BiasAudit:
    "Bias Audit — systematic evaluation of an AI model for discriminatory outputs",
  ModelCard:
    "Model Card — documentation summarising a model's intended use, performance, and limitations",

  // Inference patterns
  ONNX: "Open Neural Network Exchange — open format for sharing ML models across frameworks",
  TRT: "TensorRT — NVIDIA library for optimising deep learning inference on GPUs",
  FP16: "16-bit Floating Point — half-precision format reducing memory and speeding inference",
  INT8: "8-bit Integer Quantisation — compresses model weights to reduce size and latency",
  Quantisation:
    "Quantisation — reducing numerical precision of model weights to shrink model size",
  Distillation:
    "Knowledge Distillation — training a small student model to mimic a large teacher model",
  Embedding:
    "Embedding — dense numerical vector representing text, images, or other data",
  VectorDB:
    "Vector Database — stores and retrieves embeddings by similarity (used in RAG)",

  // Exam shorthand
  AIF: "AWS Certified AI Practitioner (AIF-C01)",
  CLF: "AWS Certified Cloud Practitioner (CLF-C02)",
  DVA: "AWS Certified Developer – Associate (DVA-C02)",
  MLS: "AWS Certified Machine Learning – Specialty",
};
