import { ServiceGuide } from "../../../types/guide";

export const pollyTranscribeGuide: ServiceGuide = {
  id: "mls-polly-transcribe",
  service: "Amazon Polly & Transcribe",
  domain: "services",
  tagline:
    "Text-to-speech and speech-to-text services for voice-enabled ML applications",
  intro:
    "Amazon Polly converts text to lifelike speech using neural text-to-speech technology, while Amazon Transcribe converts audio to text using automatic speech recognition. Together they enable the voice layer of ML applications — Polly synthesizes spoken responses and Transcribe processes spoken input.",

  sections: [
    {
      heading: "Amazon Transcribe: Automatic Speech Recognition",
      body: `Amazon Transcribe converts audio recordings to text using deep learning ASR (Automatic Speech Recognition) models. It supports real-time transcription (streaming audio via WebSocket or HTTP/2) and batch transcription (S3 audio files submitted as transcription jobs). Transcribe handles 100+ languages, automatically punctuates transcripts, supports speaker identification (speaker diarization — attributing speech segments to different speakers), and produces word-level timestamps and confidence scores.

Transcribe's features critical for ML data creation include vocabulary filters (masking or removing profanity or domain-specific terms), custom vocabularies (improving accuracy for proper nouns, technical terms, and domain jargon the base model struggles with), and custom language models (fine-tuned ASR models trained on domain-specific text corpora that represent the language distribution of your target audio). Custom language models dramatically improve transcription accuracy for specialized domains like medical, legal, or financial audio.`,
      quiz: [
        {
          question:
            "A medical company needs highly accurate transcription of physician dictation containing specialized medical terminology. Which Transcribe feature improves accuracy for these specialized terms?",
          options: [
            "Speaker diarization — attribute speech to the correct physician",
            "Custom vocabulary — list domain-specific medical terms and their pronunciations to guide ASR",
            "Vocabulary filter — remove non-medical terms from the transcript",
            "Redaction — mask PHI terms in the transcript",
          ],
          correctIndex: 1,
          explanation:
            "Custom vocabulary allows you to provide a list of domain-specific terms (drug names, procedures, medical abbreviations) with hints about their pronunciation. The Transcribe ASR model uses these hints to improve recognition accuracy for terms it rarely encountered in its general training data.",
        },
      ],
    },
    {
      heading: "Transcribe Medical and PII Redaction",
      body: `Amazon Transcribe Medical is a specialized Transcribe service trained on medical conversations and clinical terminology. It is HIPAA eligible and optimized for physician-patient conversations, radiology reports, clinical notes dictation, and pharmacy medication lists. It identifies medical terms with higher accuracy than standard Transcribe and produces a clinical note output format recognized by EHR systems.

Transcribe supports automatic PII (Personally Identifiable Information) redaction, replacing PII entities — names, phone numbers, social security numbers, addresses — in the transcript with \`[PII]\` placeholders. This is critical for ML pipelines where audio transcripts become training data for NLP models — you must de-identify the data before storage and training. Transcribe also supports content redaction that can redact PII from both the transcript text and the underlying audio, producing clean versions of both for compliant storage.`,
      quiz: [
        {
          question:
            "A company transcribes customer service calls to create NLP training data. They must remove customer names, phone numbers, and account numbers before the data can be used for training. Which Transcribe feature handles this?",
          options: [
            "Custom vocabulary — specify the terms to remove",
            "Vocabulary filter — filter out known PII terms",
            "Automatic PII redaction — replaces PII entities with [PII] placeholders in the transcript",
            "Speaker diarization — separates customer speech from agent speech for targeted removal",
          ],
          correctIndex: 2,
          explanation:
            "Transcribe's automatic PII redaction identifies and replaces PII entities (names, phone numbers, SSNs, addresses, account numbers) with [PII] placeholders in the output transcript. This enables compliant de-identification of audio transcripts before use as ML training data without manual annotation.",
        },
      ],
    },
    {
      heading: "Amazon Polly: Neural Text-to-Speech",
      body: `Amazon Polly converts text to speech using neural TTS (NTTS) and standard TTS engines. Neural voices produce more natural, human-like speech by modeling prosody and intonation at a deeper level than concatenative or parametric TTS. Polly supports 60+ voices in 30+ languages. Output can be delivered as an MP3 or OGG audio stream for real-time playback, or synthesized to S3 as an asynchronous job for long documents.

SSML (Speech Synthesis Markup Language) controls speech characteristics in Polly: \`<break>\` adds pauses, \`<emphasis>\` stresses words, \`<prosody rate="slow">\` changes speaking rate, \`<phoneme>\` controls pronunciation of specific words, and \`<say-as interpret-as="digits">\` controls how numbers and abbreviations are spoken. SSML is essential for creating natural-sounding TTS output in ML applications — particularly voice assistants, audiobook generation, and accessibility features.`,
      quiz: [
        {
          question:
            "A developer building a voice assistant wants Amazon Polly to pause for 500ms after saying 'Welcome' and then speak the user's name slowly. Which markup language controls this behavior?",
          options: [
            "HTML — use <span delay='500ms'> and <slow> tags",
            "JSON — specify prosody and pause in the API request body",
            "SSML — use <break time='500ms'/> and <prosody rate='slow'> tags in the input text",
            "Markdown — use pause and rate annotations in the TTS input",
          ],
          correctIndex: 2,
          explanation:
            "SSML (Speech Synthesis Markup Language) is an XML-based language supported by Amazon Polly for controlling speech characteristics. The <break> element adds pauses and <prosody rate='slow'> controls speaking speed. SSML tags are embedded in the input text and processed by Polly to produce natural, controlled speech output.",
        },
      ],
    },
    {
      heading: "Polly Custom Lexicons and Brand Voices",
      body: `Polly Custom Lexicons allow you to control how specific words are pronounced using PLS (Pronunciation Lexicon Specification) or IPA (International Phonetic Alphabet) notation. For ML applications involving brand names, product names, or technical acronyms, custom lexicons ensure consistent, correct pronunciation. For example, ensuring that "AWS" is spoken as "Amazon Web Services" or that "GIF" is pronounced with a hard G rather than a soft G.

Polly Brand Voice (available through AWS professional services) allows organizations to create a completely custom neural voice trained on recordings of a real human voice, providing a unique, branded audio identity. For ML applications, Brand Voice enables building products where the voice is a differentiating feature. Standard Neural voices and Brand Voices can be mixed in the same application — using Neural for dynamic content and a Brand Voice for specific branded touchpoints.`,
      quiz: [
        {
          question:
            "A company wants Amazon Polly to pronounce their brand name 'Xenith' correctly (with a Z sound) rather than with an X sound. What feature should they use?",
          options: [
            "SSML phoneme tag in every TTS call to specify pronunciation",
            "Create a Custom Lexicon mapping 'Xenith' to its correct phonetic pronunciation using IPA notation",
            "Use a Neural voice which has better pronunciation of unusual brand names",
            "Submit a pronunciation correction request to the AWS Polly team",
          ],
          correctIndex: 1,
          explanation:
            "Polly Custom Lexicons map specific words to their correct phonetic pronunciations using PLS or IPA notation. Once uploaded, the lexicon applies to all TTS calls that reference it, ensuring consistent correct pronunciation of brand names and technical terms without requiring SSML in every request.",
        },
      ],
    },
    {
      heading: "Transcribe and Polly in ML Pipelines",
      body: `Transcribe and Polly are commonly used together to build voice-enabled ML inference pipelines. The pattern for a voice assistant is: microphone → Transcribe streaming (ASR) → text → NLP model or LLM (understanding and response generation) → Polly (TTS) → speaker. This pipeline converts spoken language to text, processes it with ML, and converts the ML response back to speech — enabling fully voice-driven AI applications.

For training data creation, Transcribe generates labeled text corpora from existing audio archives. Call center recordings transcribed with Transcribe and labeled for intent can train call routing classification models. Medical dictation transcribed with Transcribe Medical can train clinical NLP models. Polly generates synthetic training data for speech recognition models — by varying voice, rate, and pronunciation, you can augment ASR training datasets to improve model robustness to different speakers and accents.`,
      quiz: [
        {
          question:
            "A developer is building a voice-enabled customer service bot. What is the correct AWS service sequence for processing a spoken customer query and responding with speech?",
          options: [
            "Polly → NLP model → Transcribe",
            "Transcribe → NLP model → Polly",
            "Lex → Transcribe → Polly",
            "Kinesis Video → Transcribe → Polly → Kinesis",
          ],
          correctIndex: 1,
          explanation:
            "The voice-enabled ML pipeline flows: Transcribe converts spoken audio to text (ASR) → NLP model processes the text and generates a response → Polly converts the response text to speech (TTS). Transcribe is the input layer, Polly is the output layer, and the NLP model is the understanding layer in between.",
        },
      ],
    },
  ],

  keyFacts: [
    "Transcribe: ASR supporting 100+ languages, real-time streaming, and batch S3 jobs",
    "Transcribe: speaker diarization attributes speech to different speakers in the audio",
    "Custom vocabulary: improve ASR accuracy for domain-specific terms and proper nouns",
    "Custom language models: fine-tune ASR on domain-specific text corpus for specialized domains",
    "Transcribe Medical: HIPAA-eligible ASR trained on clinical terminology",
    "Automatic PII redaction: replaces PII with [PII] placeholders in transcripts",
    "Polly: 60+ voices, 30+ languages — Neural TTS produces more natural, human-like speech",
    "SSML: controls pauses, emphasis, rate, pitch, and pronunciation in Polly output",
    "Custom Lexicons: specify phonetic pronunciation of brand names and technical terms",
    "Voice assistant pattern: Transcribe (speech→text) → model → Polly (text→speech)",
  ],

  relatedServices: [
    "Amazon Lex",
    "Amazon Comprehend",
    "Amazon Translate",
    "Amazon S3",
    "AWS Lambda",
    "Amazon Kinesis Video Streams",
  ],

  examTips: [
    "Transcribe = speech-to-text; Polly = text-to-speech — get the direction right",
    "Custom vocabulary = improve recognition of specific terms; custom language model = full domain adaptation",
    "PII redaction in Transcribe is critical for HIPAA-compliant NLP training data pipelines",
    "Transcribe Medical: purpose-built for clinical terminology — HIPAA eligible",
    "SSML controls Polly output characteristics: pauses, rate, emphasis, phoneme pronunciation",
    "Speaker diarization labels each speech segment with the speaker ID — useful for call analytics",
    "Polly Brand Voice = custom neural voice trained on human recordings for branded products",
    "Polly can generate synthetic audio training data for ASR model augmentation",
  ],

  topicQuiz: [
    {
      question:
        "A company transcribes 10,000 customer service calls per day using Amazon Transcribe. They need to ensure no customer PII appears in the transcript files stored for NLP model training. Which feature handles this?",
      options: [
        "Custom vocabulary — list all PII terms to suppress in transcription",
        "Vocabulary filter — filter PII words from the output transcript",
        "Automatic PII redaction — detects and replaces PII entities with [PII] placeholders",
        "Speaker diarization — separate customer speech so it can be deleted",
      ],
      correctIndex: 2,
      explanation:
        "Transcribe automatic PII redaction identifies PII entities (names, phone numbers, SSNs, account numbers) using NLP and replaces them with [PII] placeholders in the output transcript. This de-identifies call transcripts at scale without manual review, enabling their safe use as NLP training data.",
    },
    {
      question:
        "A medical transcription company needs to improve Amazon Transcribe's accuracy on drug names and medical procedures for physician dictation. What is the most effective approach?",
      options: [
        "Use standard Transcribe with a high confidence threshold filter",
        "Switch to Amazon Transcribe Medical with a custom vocabulary listing domain-specific terms",
        "Use custom vocabulary in standard Transcribe to list all medical terms",
        "Use a custom language model trained on a large corpus of medical text",
      ],
      correctIndex: 1,
      explanation:
        "Amazon Transcribe Medical is purpose-built for clinical terminology and physician dictation, with baseline accuracy far exceeding standard Transcribe for medical content. Adding a custom vocabulary for specific drug names and procedures further improves accuracy for the organization's particular domain.",
    },
  ],
};
