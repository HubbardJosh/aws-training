import { ServiceGuide } from "../../../types/guide";

export const transcribeGuide: ServiceGuide = {
  id: "aif-transcribe",
  service: "Amazon Transcribe",
  domain: "development",
  tagline: "Automatic speech recognition that converts audio to text",
  intro:
    "Amazon Transcribe is a fully managed automatic speech recognition (ASR) service that uses deep learning to convert speech in audio and video files into accurate text transcripts, supporting dozens of languages with features like speaker identification, custom vocabularies, and real-time streaming.",

  sections: [
    {
      heading: "How Automatic Speech Recognition Works",
      body: `Automatic speech recognition is the process of converting acoustic audio signals into written text. Modern ASR systems use deep neural networks — specifically architectures that combine acoustic models (understanding the sounds in speech) with language models (understanding the statistical patterns of words and sentences) to produce accurate transcriptions even in the presence of background noise, accents, or overlapping speakers.

Transcribe handles audio in a variety of formats (WAV, MP3, FLAC, OGG, AMR, WebM) and from multiple sources. For **batch transcription**, you store audio or video files in S3 and submit a transcription job via API. Transcribe processes the file asynchronously and stores the resulting JSON transcript in S3. The JSON includes not just the transcript text but also confidence scores for each word and precise start/end timestamps — useful for generating synchronized captions or searching within audio by keyword.

For **real-time applications**, Transcribe's **streaming API** accepts a continuous audio stream over WebSocket or HTTP/2 and returns partial and final transcription results as the speech is recognized, enabling live captioning, real-time call monitoring, and voice-driven interfaces.`,
      quiz: [
        {
          question:
            "What transport protocols does Amazon Transcribe's streaming API use for real-time transcription?",
          options: [
            "RTSP and RTP",
            "WebSocket and HTTP/2",
            "gRPC and WebSocket",
            "HTTP/1.1 with long polling and Server-Sent Events",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Transcribe's streaming API accepts continuous audio over WebSocket or HTTP/2, returning partial and final transcription results as speech is recognized. This enables real-time use cases like live captioning and real-time call monitoring.",
        },
        {
          question:
            "Beyond the transcript text, what additional data does Amazon Transcribe include in its JSON output for batch transcription jobs?",
          options: [
            "Sentiment scores and entity labels for each sentence",
            "Confidence scores and precise start/end timestamps for each word",
            "Speaker voice prints and acoustic feature vectors",
            "Language detection probability scores and dialect classification",
          ],
          correctIndex: 1,
          explanation:
            "Transcribe's JSON output includes not only the transcript text but also confidence scores for each word and precise start/end timestamps. These timestamps are valuable for generating synchronized caption files and enabling keyword search within audio recordings.",
        },
      ],
    },
    {
      heading: "Speaker Identification and Diarization",
      body: `In recordings with multiple participants — call center conversations, panel discussions, interviews, meetings — simply knowing what was said is not enough; you also need to know who said it. Transcribe addresses this with **speaker identification** (also called speaker diarization): the ability to automatically detect how many speakers are present and label each segment of speech with the speaker who produced it.

You enable diarization by setting \`ShowSpeakerLabels: true\` in your transcription job and specifying \`MaxSpeakerLabels\` (the maximum number of distinct speakers to identify). The transcript output then includes speaker label annotations with timestamps, so you can see a structured conversation log: "Speaker 1 said X, then Speaker 2 responded with Y." This is foundational for call center analytics, meeting transcription, and compliance recording analysis.

**Channel identification** is an alternative approach for stereo recordings where each participant's audio is already on a separate channel (common in telephony systems that record agent and customer on separate tracks). Transcribe transcribes each channel independently and merges them into an interlaced transcript with channel labels — often producing higher accuracy than diarization when the audio separation is clean.`,
      quiz: [
        {
          question:
            "Which Amazon Transcribe parameter enables speaker diarization in a batch transcription job?",
          options: [
            "EnableSpeakerSeparation: true",
            "ShowSpeakerLabels: true (with MaxSpeakerLabels specifying the maximum number of speakers)",
            "ChannelIdentification: true with the number of expected speakers",
            "DiarizationEnabled: true with a SpeakerCount parameter",
          ],
          correctIndex: 1,
          explanation:
            "Speaker diarization is enabled by setting ShowSpeakerLabels: true in the transcription job configuration. You also specify MaxSpeakerLabels to indicate the maximum number of distinct speakers Transcribe should identify in the recording.",
        },
        {
          question:
            "When should you use channel identification instead of speaker diarization in Amazon Transcribe?",
          options: [
            "When the recording has more than 10 speakers, which exceeds the diarization limit",
            "When you have a stereo recording where each participant's audio is already on a separate channel, providing cleaner speaker separation",
            "When you need real-time speaker identification via the streaming API",
            "When the recording contains non-English speech that diarization does not support",
          ],
          correctIndex: 1,
          explanation:
            "Channel identification is appropriate for stereo recordings where each participant's audio is already separated onto different tracks (common in telephony systems). Transcribing each channel independently typically produces higher accuracy than diarization because the audio separation is already clean.",
        },
      ],
    },
    {
      heading: "Custom Vocabulary and Language Models",
      body: `General-purpose ASR models are trained on broad text and audio corpora, which means they may perform poorly on domain-specific terminology: medical device names, pharmaceutical drug names, legal jargon, proprietary product names, internal acronyms, or technical abbreviations. Transcribe provides two mechanisms to improve accuracy for specialized vocabulary.

**Custom vocabularies** are lists of words and phrases you want Transcribe to recognize and transcribe correctly, along with optional pronunciation hints (using IPA phoneme notation) and display forms (how the word should appear in the transcript). For example, you might add the drug name "Dupixent" with its correct pronunciation so Transcribe doesn't transcribe it as "do picks it". Custom vocabularies are applied at transcription time.

**Custom language models** go further — they use your domain text (medical notes, legal briefs, call center scripts, earnings call transcripts) to fine-tune the language model component, improving accuracy across an entire domain rather than just for specific words. Training a custom language model requires providing large amounts of domain text (ideally millions of words), but the accuracy improvement in highly specialized domains can be dramatic.`,
      quiz: [
        {
          question:
            "What is the key difference between a custom vocabulary and a custom language model in Amazon Transcribe?",
          options: [
            "Custom vocabularies are for English only; custom language models support all languages",
            "Custom vocabularies add specific terms with pronunciation hints; custom language models fine-tune the entire language model component on domain text for broader accuracy improvement",
            "Custom vocabularies are applied at training time; custom language models are applied at transcription time",
            "Custom vocabularies improve accuracy for all speakers; custom language models only improve accuracy for a specific speaker's voice",
          ],
          correctIndex: 1,
          explanation:
            "Custom vocabularies add specific terms (with optional pronunciation hints and display forms) to help Transcribe recognize individual words. Custom language models fine-tune the language model component on large amounts of domain text, improving accuracy across an entire domain rather than just specific terms.",
        },
        {
          question:
            "A pharmaceutical company wants Amazon Transcribe to correctly recognize dozens of proprietary drug names in clinical trial recordings. Which feature is most appropriate?",
          options: [
            "Custom language model trained on clinical trial transcripts",
            "Custom vocabulary listing the drug names with their correct pronunciations and display forms",
            "Channel identification to separate pharmacist and patient audio",
            "Speaker diarization to identify when pharmacists vs. patients speak drug names",
          ],
          correctIndex: 1,
          explanation:
            "Custom vocabularies are the right tool for recognizing specific terms like drug names. You list the terms with optional IPA pronunciation hints and display forms (how they should appear in the transcript). Custom language models are more appropriate when you need broad domain-wide accuracy improvement, not just specific term recognition.",
        },
      ],
    },
    {
      heading: "Transcribe Call Analytics",
      body: `**Amazon Transcribe Call Analytics** is a specialized capability built on top of base Transcribe, designed specifically for contact center use cases. It goes beyond transcription to provide rich conversational analytics automatically.

Call Analytics detects **sentiment** on each speaker turn (positive, negative, neutral, mixed), tracks sentiment trends across the call timeline, and identifies **call characteristics** such as interruptions, non-talk time, talk speed, and loudness. It detects **sensitive data** (PII) and can redact it from both the transcript and the audio file. It identifies **issues** and **outcomes** mentioned in the call (customer expressing dissatisfaction, agent promising a callback, call ending with resolution vs escalation) using a built-in ML model.

**Transcribe Call Analytics with generative AI summarization** (available in newer versions) uses an LLM to produce a concise summary of each call including the reason for contact, actions taken, and resolution status — eliminating the need for agents to write after-call notes. This integrated capability makes Transcribe Call Analytics a near-complete contact center intelligence solution.`,
      quiz: [
        {
          question:
            "Which of the following is NOT a capability of Amazon Transcribe Call Analytics?",
          options: [
            "Sentiment detection on each speaker turn",
            "Real-time translation of the call into a second language for multilingual agents",
            "PII detection and redaction from both the transcript and the audio file",
            "Identification of call characteristics such as interruptions and non-talk time",
          ],
          correctIndex: 1,
          explanation:
            "Real-time translation is not a Transcribe Call Analytics capability — that would require Amazon Translate. Call Analytics provides sentiment analysis, PII redaction, call characteristic detection (interruptions, talk speed), issue and outcome detection, and optionally AI-generated call summaries.",
        },
        {
          question:
            "What is the benefit of Transcribe Call Analytics' generative AI summarization feature for contact centers?",
          options: [
            "It translates call summaries into multiple languages for global reporting",
            "It produces a concise call summary including reason for contact, actions taken, and resolution — eliminating the need for agents to write after-call notes",
            "It generates suggested responses for agents during live calls",
            "It automatically escalates calls to supervisors when sentiment is negative",
          ],
          correctIndex: 1,
          explanation:
            "Transcribe Call Analytics with generative AI summarization uses an LLM to automatically produce a concise call summary including reason for contact, actions taken, and resolution status. This eliminates manual after-call note writing, reducing agent handle time and improving consistency.",
        },
      ],
    },
    {
      heading: "Content Redaction and Compliance",
      body: `Contact centers and regulated industries face strict requirements around PII handling in recorded conversations. Transcribe's **automatic content redaction** feature automatically identifies and redacts PII entities in transcripts — replacing detected PII (names, phone numbers, Social Security numbers, credit card numbers, etc.) with \`[PII]\` placeholders. When redaction is enabled, Transcribe can produce two output variants: the original unredacted transcript (for authorized internal use) and a redacted version (for sharing, analytics, or long-term storage).

Transcribe also supports **vocabulary filtering** — a blocklist of words you want replaced or removed from transcripts. This is useful for removing profanity, competitor brand names, or any words that violate your content standards from customer-facing transcripts or public archives.

For media accessibility compliance (ADA, WCAG), Transcribe's precise word-level timestamps make it straightforward to generate WebVTT or SRT caption files for videos, with each caption segment synchronized to the exact moment the words were spoken.`,
      quiz: [
        {
          question:
            "How does Amazon Transcribe's automatic content redaction feature handle PII in transcripts?",
          options: [
            "It deletes the entire sentence containing PII and replaces it with '[REDACTED SEGMENT]'",
            "It replaces detected PII entities (names, phone numbers, SSNs, credit card numbers) with '[PII]' placeholders",
            "It encrypts PII values using KMS and stores them separately from the transcript",
            "It routes segments containing PII to Amazon Macie for classification before redaction",
          ],
          correctIndex: 1,
          explanation:
            "Transcribe's content redaction replaces detected PII entities (names, phone numbers, Social Security numbers, credit card numbers, etc.) with [PII] placeholders. Transcribe can produce both an unredacted transcript (for authorized use) and a redacted version (for sharing or analytics).",
        },
        {
          question:
            "Which Amazon Transcribe feature would you use to remove profanity from customer-facing transcript archives?",
          options: [
            "Content redaction — it supports a custom list of words to treat as PII",
            "Vocabulary filtering — a blocklist of words to replace or remove from transcripts",
            "Custom vocabulary — add the words with replacement display forms",
            "Speaker diarization — filter out segments from speakers who use prohibited language",
          ],
          correctIndex: 1,
          explanation:
            "Vocabulary filtering is the correct feature — it defines a blocklist of words that are replaced or removed from transcripts. This is designed for removing profanity, competitor brand names, or other words that violate content standards. Content redaction is specifically for PII entities.",
        },
      ],
    },
  ],

  keyFacts: [
    "ASR service: converts speech in audio/video files to text",
    "Batch transcription: S3 input → async job → S3 JSON output",
    "Streaming API: real-time transcription over WebSocket or HTTP/2",
    "Speaker diarization identifies who said what in multi-speaker recordings",
    "Channel identification transcribes stereo recordings with separate speaker channels",
    "Custom vocabularies add domain-specific terms with pronunciation hints",
    "Custom language models fine-tune on domain text for specialty accuracy",
    "Transcribe Call Analytics: sentiment, interruptions, PII redaction, issue detection",
    "Content redaction replaces PII with [PII] placeholders in transcripts",
    "Outputs include word-level timestamps suitable for caption file generation",
  ],

  relatedServices: [
    "Amazon Polly",
    "Amazon Comprehend",
    "Amazon Lex",
    "Amazon Connect",
    "Amazon S3",
  ],

  examTips: [
    "Transcribe = speech-to-text (ASR); Polly = text-to-speech (TTS)",
    "Speaker diarization labels who spoke when — key for call analytics",
    "Custom vocabulary = specific terms; Custom language model = entire domain fine-tuning",
    "Call Analytics is the specialized version for contact centers with sentiment and PII redaction",
    "Streaming API enables real-time applications; batch API for stored audio files",
    "Content redaction and vocabulary filtering are the compliance tools in Transcribe",
    "Word-level timestamps enable synchronized caption generation for media",
  ],

  topicQuiz: [
    {
      question:
        "A company needs to transcribe recorded customer service calls stored in S3 and identify which agent and which customer made each statement. Which Transcribe features should they use?",
      options: [
        "Batch transcription with custom vocabulary for agent names",
        "Batch transcription with speaker diarization (ShowSpeakerLabels: true)",
        "Streaming API with channel identification enabled",
        "Transcribe Call Analytics with sentiment detection",
      ],
      correctIndex: 1,
      explanation:
        "Batch transcription with speaker diarization (ShowSpeakerLabels: true) is the correct approach for stored S3 recordings where you need to label which speaker said what. Transcribe detects speakers and annotates each segment with a speaker label and timestamp.",
    },
    {
      question:
        "Which Amazon Transcribe feature is purpose-built for contact center intelligence, providing sentiment, interruption detection, and PII redaction beyond basic transcription?",
      options: [
        "Custom language models",
        "Transcribe Call Analytics",
        "Speaker diarization with channel identification",
        "Vocabulary filtering with content redaction",
      ],
      correctIndex: 1,
      explanation:
        "Amazon Transcribe Call Analytics is a specialized capability designed for contact centers. It provides sentiment detection per speaker turn, call characteristic analysis (interruptions, non-talk time, talk speed), PII redaction, issue and outcome detection, and optional generative AI call summarization.",
    },
    {
      question:
        "A media company needs to generate synchronized captions for thousands of video files. Which Transcribe output feature enables accurate caption timing?",
      options: [
        "Confidence scores — higher confidence words are used for caption placement",
        "Word-level timestamps — each word has precise start/end times for caption synchronization",
        "Speaker labels — each speaker's segment defines a caption block",
        "Channel identification — stereo channels define left/right caption positioning",
      ],
      correctIndex: 1,
      explanation:
        "Word-level timestamps in Transcribe's JSON output provide precise start and end times for each word, enabling accurate synchronization of caption segments to the exact moment words were spoken — suitable for generating WebVTT or SRT caption files.",
    },
    {
      question:
        "What is the correct direction of Amazon Transcribe's core function?",
      options: [
        "Text to speech — converts written text into spoken audio",
        "Speech to text — converts audio recordings into written transcripts",
        "Text to text — translates transcripts between languages",
        "Audio to audio — enhances and filters audio recordings",
      ],
      correctIndex: 1,
      explanation:
        "Amazon Transcribe is speech-to-text (ASR) — it converts audio recordings into written transcripts. The opposite direction (text-to-speech) is Amazon Polly. This distinction is a common exam question for AIF-C01.",
    },
    {
      question:
        "A legal firm needs to transcribe depositions where multiple attorneys and witnesses speak. The recording is mono (single channel). Which Transcribe feature should they use to attribute statements to individual speakers?",
      options: [
        "Channel identification — split the mono recording into separate virtual channels",
        "Speaker diarization — automatically detects and labels individual speakers in a mono recording",
        "Custom vocabulary — add attorney and witness names for better recognition",
        "Custom language model — train on deposition transcripts to improve legal terminology accuracy",
      ],
      correctIndex: 1,
      explanation:
        "Speaker diarization (ShowSpeakerLabels: true) works on mono recordings to automatically detect and label individual speakers. Channel identification requires stereo recordings where speakers are already on separate tracks. Diarization is the correct choice for mono multi-speaker recordings.",
    },
    {
      question:
        "A healthcare company wants Amazon Transcribe to correctly recognize hundreds of medical device names and drug names in physician dictation recordings. Which approach provides the broadest improvement?",
      options: [
        "Custom vocabulary — list each medical term with its correct pronunciation",
        "Custom language model — fine-tune on large amounts of clinical domain text for broad domain accuracy",
        "Transcribe Call Analytics — it includes a medical terminology module",
        "Content redaction — configure medical terms as PII to track their occurrence",
      ],
      correctIndex: 1,
      explanation:
        "Custom language models fine-tune Transcribe's language model component on large domain-specific text corpora (medical notes, drug databases, clinical trial reports), improving accuracy broadly across medical terminology. Custom vocabularies address specific individual terms but do not improve overall domain language modeling.",
    },
    {
      question:
        "A contact center must store call transcripts but cannot retain PII in the archive for compliance reasons. Which Transcribe feature addresses this?",
      options: [
        "Vocabulary filtering — add PII terms to the blocklist",
        "Automatic content redaction — replaces detected PII with [PII] placeholders in the transcript",
        "Speaker diarization — PII is automatically excluded from speaker labels",
        "Custom language model — train the model to avoid transcribing PII",
      ],
      correctIndex: 1,
      explanation:
        "Automatic content redaction replaces detected PII entities (names, phone numbers, SSNs, credit card numbers) with [PII] placeholders in the transcript. Transcribe can produce both a redacted version (for compliant archiving) and an unredacted version (for authorized internal use).",
    },
    {
      question:
        "You are building a live captioning system for a video conferencing application. Which Amazon Transcribe API should you use?",
      options: [
        "Batch transcription with StartTranscriptionJob — submit video files as they complete",
        "Streaming API over WebSocket or HTTP/2 — returns partial and final results in real time",
        "Transcribe Call Analytics — it supports real-time call monitoring",
        "Custom language model endpoint — deploy a domain-specific model for real-time use",
      ],
      correctIndex: 1,
      explanation:
        "The streaming API is required for real-time applications like live captioning. It accepts a continuous audio stream over WebSocket or HTTP/2 and returns partial and final transcription results as speech is recognized, enabling synchronous caption display during live video conferencing.",
    },
  ],
};
