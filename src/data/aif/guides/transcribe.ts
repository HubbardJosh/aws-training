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
    },
    {
      heading: "Speaker Identification and Diarization",
      body: `In recordings with multiple participants — call center conversations, panel discussions, interviews, meetings — simply knowing what was said is not enough; you also need to know who said it. Transcribe addresses this with **speaker identification** (also called speaker diarization): the ability to automatically detect how many speakers are present and label each segment of speech with the speaker who produced it.

You enable diarization by setting \`ShowSpeakerLabels: true\` in your transcription job and specifying \`MaxSpeakerLabels\` (the maximum number of distinct speakers to identify). The transcript output then includes speaker label annotations with timestamps, so you can see a structured conversation log: "Speaker 1 said X, then Speaker 2 responded with Y." This is foundational for call center analytics, meeting transcription, and compliance recording analysis.

**Channel identification** is an alternative approach for stereo recordings where each participant's audio is already on a separate channel (common in telephony systems that record agent and customer on separate tracks). Transcribe transcribes each channel independently and merges them into an interlaced transcript with channel labels — often producing higher accuracy than diarization when the audio separation is clean.`,
    },
    {
      heading: "Custom Vocabulary and Language Models",
      body: `General-purpose ASR models are trained on broad text and audio corpora, which means they may perform poorly on domain-specific terminology: medical device names, pharmaceutical drug names, legal jargon, proprietary product names, internal acronyms, or technical abbreviations. Transcribe provides two mechanisms to improve accuracy for specialized vocabulary.

**Custom vocabularies** are lists of words and phrases you want Transcribe to recognize and transcribe correctly, along with optional pronunciation hints (using IPA phoneme notation) and display forms (how the word should appear in the transcript). For example, you might add the drug name "Dupixent" with its correct pronunciation so Transcribe doesn't transcribe it as "do picks it". Custom vocabularies are applied at transcription time.

**Custom language models** go further — they use your domain text (medical notes, legal briefs, call center scripts, earnings call transcripts) to fine-tune the language model component, improving accuracy across an entire domain rather than just for specific words. Training a custom language model requires providing large amounts of domain text (ideally millions of words), but the accuracy improvement in highly specialized domains can be dramatic.`,
    },
    {
      heading: "Transcribe Call Analytics",
      body: `**Amazon Transcribe Call Analytics** is a specialized capability built on top of base Transcribe, designed specifically for contact center use cases. It goes beyond transcription to provide rich conversational analytics automatically.

Call Analytics detects **sentiment** on each speaker turn (positive, negative, neutral, mixed), tracks sentiment trends across the call timeline, and identifies **call characteristics** such as interruptions, non-talk time, talk speed, and loudness. It detects **sensitive data** (PII) and can redact it from both the transcript and the audio file. It identifies **issues** and **outcomes** mentioned in the call (customer expressing dissatisfaction, agent promising a callback, call ending with resolution vs escalation) using a built-in ML model.

**Transcribe Call Analytics with generative AI summarization** (available in newer versions) uses an LLM to produce a concise summary of each call including the reason for contact, actions taken, and resolution status — eliminating the need for agents to write after-call notes. This integrated capability makes Transcribe Call Analytics a near-complete contact center intelligence solution.`,
    },
    {
      heading: "Content Redaction and Compliance",
      body: `Contact centers and regulated industries face strict requirements around PII handling in recorded conversations. Transcribe's **automatic content redaction** feature automatically identifies and redacts PII entities in transcripts — replacing detected PII (names, phone numbers, Social Security numbers, credit card numbers, etc.) with \`[PII]\` placeholders. When redaction is enabled, Transcribe can produce two output variants: the original unredacted transcript (for authorized internal use) and a redacted version (for sharing, analytics, or long-term storage).

Transcribe also supports **vocabulary filtering** — a blocklist of words you want replaced or removed from transcripts. This is useful for removing profanity, competitor brand names, or any words that violate your content standards from customer-facing transcripts or public archives.

For media accessibility compliance (ADA, WCAG), Transcribe's precise word-level timestamps make it straightforward to generate WebVTT or SRT caption files for videos, with each caption segment synchronized to the exact moment the words were spoken.`,
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
};
