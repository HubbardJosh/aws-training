import { ServiceGuide } from "../../../types/guide";

export const pollyGuide: ServiceGuide = {
  id: "aif-polly",
  service: "Amazon Polly",
  domain: "development",
  tagline: "Turn text into lifelike speech using deep learning",
  intro:
    "Amazon Polly is a text-to-speech (TTS) service that converts written text into natural-sounding audio, enabling applications to speak to users in dozens of voices and languages using either standard or neural synthesis technology.",

  sections: [
    {
      heading: "How Text-to-Speech Works in Polly",
      body: `Text-to-speech synthesis is the process of converting written text into spoken audio. Traditional TTS systems concatenate pre-recorded phoneme fragments, producing recognizable but robotic-sounding speech. Polly offers two synthesis technologies that go well beyond this.

**Standard voices** use a concatenative approach enhanced with prosody models and signal processing to produce clear, intelligible speech. They are fast, cost-effective, and suitable for applications where naturalness is less critical — navigation instructions, simple notifications, accessibility features for the visually impaired.

**Neural TTS (NTTS)** voices use a deep learning model to generate the mel-spectrogram representation of speech from scratch, rather than assembling fragments. This produces dramatically more natural-sounding audio — smoother intonation, appropriate emphasis, fewer artifacts. Neural voices better handle nuance: they distinguish between a statement and a question, stress the right words in a sentence, and produce more human-like pauses. Neural voices are the right choice for customer-facing applications, e-learning content, and conversational interfaces where listener experience matters.`,
    },
    {
      heading: "Voice Selection and Languages",
      body: `Polly supports over 60 voices across more than 30 languages and language variants (US English, UK English, Australian English, Brazilian Portuguese, Castilian Spanish, Latin American Spanish, etc.). Each voice has a unique name (Matthew, Joanna, Amy, Brian, Celine, etc.) and is associated with a specific language code.

For NTTS voices, AWS has introduced **brand voice** capabilities — custom voices trained to specific timbre and personality characteristics for enterprise branding. Some NTTS voices also support **conversational speaking style**, which produces more casual, informal speech appropriate for chatbot interactions, and **news speaking style**, which produces the clear, authoritative cadence typical of news anchors. The \`Engine\` parameter in API calls specifies \`standard\` or \`neural\`.

**Bilingual voices** exist for some languages — a voice trained on both English and Spanish can code-switch fluidly within a single text input, handling mixed-language content without switching voices mid-sentence.`,
    },
    {
      heading: "SSML for Fine-Grained Control",
      body: `**Speech Synthesis Markup Language (SSML)** is an XML-based language that gives you precise control over how Polly speaks text. Instead of plain text, you wrap your input in SSML tags to control pronunciation, emphasis, speed, pitch, volume, pauses, and more.

Key SSML tags include: \`<break time="500ms"/>\` inserts a pause of specified duration; \`<emphasis level="strong">word</emphasis>\` stresses a word; \`<prosody rate="slow" pitch="+10%">text</prosody>\` adjusts speaking rate and pitch; \`<say-as interpret-as="digits">12345</say-as>\` controls how numbers and special strings are verbalized (as digits vs a number, as a phone number, as a date); \`<phoneme alphabet="ipa" ph="pɪˈkɑːn">pecan</phoneme>\` specifies exact pronunciation using IPA or X-SAMPA phoneme notation.

For applications that repeatedly speak the same text, **lexicons** allow you to define custom pronunciations — mapping a word or phrase to a specific pronunciation string — and attach those lexicons to synthesis requests. This is useful for proper nouns, brand names, medical terminology, or technical abbreviations that Polly's default pronunciation model handles incorrectly.`,
    },
    {
      heading: "Real-Time vs Asynchronous Synthesis",
      body: `Polly offers two synthesis modes depending on whether you need audio immediately or are processing large volumes of text.

**SynthesizeSpeech** is the synchronous API that accepts text (plain or SSML) up to 3,000 billing characters and returns an audio stream in MP3, OGG Vorbis, or PCM format. The audio can be streamed directly to a media player for immediate playback, making this the API for real-time TTS in conversational applications, voice assistants, and notification systems.

**StartSpeechSynthesisTask** is the asynchronous API for longer texts (up to 100,000 billing characters). You submit the synthesis request, Polly processes it asynchronously, stores the resulting audio file in S3, and optionally publishes a completion notification to an SNS topic. This mode is ideal for generating audio versions of articles, e-learning modules, podcast-style content, or large-batch narration jobs. You can query the task status with \`GetSpeechSynthesisTask\` or list tasks with \`ListSpeechSynthesisTasks\`.`,
    },
    {
      heading: "Integration Patterns",
      body: `Polly fits naturally into several architectural patterns. In **conversational AI pipelines**, Polly sits downstream of Amazon Lex: after Lex determines the bot's text response, that text is passed to Polly to synthesize audio, which is streamed back to the user. Amazon Lex V2 can invoke Polly directly within the bot runtime, simplifying the integration.

For **accessibility** use cases, Polly can be embedded in e-readers, web applications, and mobile apps to provide text-to-speech for users with visual impairments or reading disabilities. The AWS JavaScript SDK includes a Polly pre-signer for generating presigned URLs to audio streams, enabling browser-side audio playback without exposing AWS credentials.

**Content generation** workflows use the async API to produce audio versions of written content at scale — converting a library of articles or training materials to audio format for podcast or audio-book delivery. Combined with S3 event notifications and Lambda, you can build a fully automated pipeline: text files dropped to S3 trigger a Lambda that calls Polly's async API, and the resulting MP3 files are stored back in S3 for distribution via CloudFront.`,
    },
  ],

  keyFacts: [
    "Two synthesis engines: Standard (concatenative) and Neural (deep learning, more natural)",
    "60+ voices in 30+ languages including regional variants",
    "Neural voices support conversational and news speaking styles",
    "SSML enables precise control: pauses, emphasis, pronunciation, prosody",
    "Lexicons define custom pronunciations for brand names and technical terms",
    "SynthesizeSpeech: synchronous, up to 3,000 characters, returns audio stream",
    "StartSpeechSynthesisTask: async, up to 100,000 characters, output stored in S3",
    "Output formats: MP3, OGG Vorbis, PCM",
    "Integrates directly with Amazon Lex for voice bot responses",
    "Used in accessibility, e-learning, contact centers, and content narration",
  ],

  relatedServices: [
    "Amazon Lex",
    "Amazon Transcribe",
    "Amazon S3",
    "Amazon Connect",
    "AWS Lambda",
  ],

  examTips: [
    "Polly = text-to-speech; Transcribe = speech-to-text — opposite directions",
    "Neural TTS produces more natural speech than Standard; preferred for customer-facing apps",
    "SSML is key for controlling pronunciation, pauses, and speaking style",
    "SynthesizeSpeech is synchronous (real-time); StartSpeechSynthesisTask is async (large batch)",
    "Lexicons solve custom pronunciation problems for brand names and technical terms",
    "Polly + Lex = complete voice bot stack (NLU + TTS)",
    "Know the output formats: MP3, OGG Vorbis, PCM (for telephony systems)",
  ],
};
