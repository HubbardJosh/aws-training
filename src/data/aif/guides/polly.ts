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
      quiz: [
        {
          question:
            "What is the fundamental difference between Amazon Polly Standard voices and Neural TTS voices?",
          options: [
            "Standard voices support more languages; Neural voices support fewer but higher-quality ones",
            "Standard voices use concatenative phoneme assembly; Neural TTS uses deep learning to generate speech from scratch, producing more natural-sounding audio",
            "Standard voices are synchronous only; Neural voices support both synchronous and asynchronous synthesis",
            "Standard voices support SSML; Neural voices do not",
          ],
          correctIndex: 1,
          explanation:
            "Standard voices concatenate pre-recorded phoneme fragments (producing clear but somewhat robotic speech), while Neural TTS voices use a deep learning model to generate the full mel-spectrogram of speech from scratch, resulting in dramatically more natural intonation, emphasis, and pacing.",
        },
        {
          question:
            "Which Amazon Polly voice engine would you choose for a customer-facing e-learning platform where listener experience is paramount?",
          options: [
            "Standard engine — it is faster and lower cost",
            "Neural engine — it produces more natural-sounding speech appropriate for customer-facing applications",
            "Conversational engine — it is specifically designed for educational content",
            "PCM engine — it provides uncompressed audio for the highest fidelity",
          ],
          correctIndex: 1,
          explanation:
            "Neural TTS (NTTS) voices produce significantly more natural-sounding audio with smoother intonation and appropriate emphasis. They are the recommended choice for customer-facing applications, e-learning, and any context where listener experience matters.",
        },
      ],
    },
    {
      heading: "Voice Selection and Languages",
      body: `Polly supports over 60 voices across more than 30 languages and language variants (US English, UK English, Australian English, Brazilian Portuguese, Castilian Spanish, Latin American Spanish, etc.). Each voice has a unique name (Matthew, Joanna, Amy, Brian, Celine, etc.) and is associated with a specific language code.

For NTTS voices, AWS has introduced **brand voice** capabilities — custom voices trained to specific timbre and personality characteristics for enterprise branding. Some NTTS voices also support **conversational speaking style**, which produces more casual, informal speech appropriate for chatbot interactions, and **news speaking style**, which produces the clear, authoritative cadence typical of news anchors. The \`Engine\` parameter in API calls specifies \`standard\` or \`neural\`.

**Bilingual voices** exist for some languages — a voice trained on both English and Spanish can code-switch fluidly within a single text input, handling mixed-language content without switching voices mid-sentence.`,
      quiz: [
        {
          question:
            "You are building a voice chatbot and want the TTS output to sound casual and conversational rather than formal. Which Amazon Polly capability supports this?",
          options: [
            "Standard engine with a custom lexicon applied",
            "Neural TTS voices with conversational speaking style",
            "SSML prosody tags set to an informal rate and pitch",
            "Bilingual voices configured with an informal language code",
          ],
          correctIndex: 1,
          explanation:
            "Some Neural TTS voices support a conversational speaking style, which produces more casual, informal speech appropriate for chatbot interactions. This is a specific Neural engine feature distinct from SSML prosody adjustments.",
        },
        {
          question:
            "How do you specify whether to use the Standard or Neural synthesis engine when calling Amazon Polly APIs?",
          options: [
            "By selecting a voice name — Standard and Neural voices have different naming conventions",
            "By using the Engine parameter set to 'standard' or 'neural' in the API call",
            "By choosing a different API endpoint URL for each engine type",
            "By specifying the OutputFormat — MP3 uses Standard; OGG uses Neural",
          ],
          correctIndex: 1,
          explanation:
            "The Engine parameter in Polly API calls specifies 'standard' or 'neural'. The voice name alone does not determine the engine; you must explicitly set Engine in your request.",
        },
      ],
    },
    {
      heading: "SSML for Fine-Grained Control",
      body: `**Speech Synthesis Markup Language (SSML)** is an XML-based language that gives you precise control over how Polly speaks text. Instead of plain text, you wrap your input in SSML tags to control pronunciation, emphasis, speed, pitch, volume, pauses, and more.

Key SSML tags include: \`<break time="500ms"/>\` inserts a pause of specified duration; \`<emphasis level="strong">word</emphasis>\` stresses a word; \`<prosody rate="slow" pitch="+10%">text</prosody>\` adjusts speaking rate and pitch; \`<say-as interpret-as="digits">12345</say-as>\` controls how numbers and special strings are verbalized (as digits vs a number, as a phone number, as a date); \`<phoneme alphabet="ipa" ph="pɪˈkɑːn">pecan</phoneme>\` specifies exact pronunciation using IPA or X-SAMPA phoneme notation.

For applications that repeatedly speak the same text, **lexicons** allow you to define custom pronunciations — mapping a word or phrase to a specific pronunciation string — and attach those lexicons to synthesis requests. This is useful for proper nouns, brand names, medical terminology, or technical abbreviations that Polly's default pronunciation model handles incorrectly.`,
      quiz: [
        {
          question:
            "A pharmaceutical company wants Amazon Polly to always pronounce a proprietary drug name consistently across thousands of TTS requests. What is the most efficient solution?",
          options: [
            "Use an SSML <phoneme> tag inline in every text document submitted for synthesis",
            "Define a Polly lexicon with the correct pronunciation and attach it to all synthesis requests",
            "Switch to a Neural voice, which has better pronunciation of medical terminology",
            "Use the <say-as interpret-as='spell-out'> SSML tag to spell out the drug name letter by letter",
          ],
          correctIndex: 1,
          explanation:
            "Lexicons are the efficient solution for consistent custom pronunciations across many requests. You define the pronunciation mapping once in a lexicon and attach it to synthesis requests, rather than embedding SSML phoneme tags in every document.",
        },
        {
          question:
            "Which SSML tag would you use to instruct Amazon Polly to read '12345' as individual digits ('one two three four five') rather than as the number 'twelve thousand three hundred forty-five'?",
          options: [
            "<phoneme alphabet='ipa' ph='wʌn tuː θriː fɔːr faɪv'>12345</phoneme>",
            "<emphasis level='strong'>12345</emphasis>",
            "<say-as interpret-as='digits'>12345</say-as>",
            "<prosody rate='slow'>12345</prosody>",
          ],
          correctIndex: 2,
          explanation:
            "The <say-as interpret-as='digits'> SSML tag instructs Polly to read each digit individually. Other interpret-as values include 'cardinal' (as a whole number), 'telephone', 'date', and more.",
        },
      ],
    },
    {
      heading: "Real-Time vs Asynchronous Synthesis",
      body: `Polly offers two synthesis modes depending on whether you need audio immediately or are processing large volumes of text.

**SynthesizeSpeech** is the synchronous API that accepts text (plain or SSML) up to 3,000 billing characters and returns an audio stream in MP3, OGG Vorbis, or PCM format. The audio can be streamed directly to a media player for immediate playback, making this the API for real-time TTS in conversational applications, voice assistants, and notification systems.

**StartSpeechSynthesisTask** is the asynchronous API for longer texts (up to 100,000 billing characters). You submit the synthesis request, Polly processes it asynchronously, stores the resulting audio file in S3, and optionally publishes a completion notification to an SNS topic. This mode is ideal for generating audio versions of articles, e-learning modules, podcast-style content, or large-batch narration jobs. You can query the task status with \`GetSpeechSynthesisTask\` or list tasks with \`ListSpeechSynthesisTasks\`.`,
      quiz: [
        {
          question:
            "You need to generate audio versions of 10,000 news articles nightly. Which Amazon Polly API is appropriate?",
          options: [
            "SynthesizeSpeech called in a tight loop for each article",
            "StartSpeechSynthesisTask, which processes asynchronously and stores results in S3",
            "GetSpeechSynthesisTask, which retrieves pre-generated audio from Polly's cache",
            "SynthesizeSpeech with streaming enabled and a large character limit override",
          ],
          correctIndex: 1,
          explanation:
            "StartSpeechSynthesisTask is the asynchronous API for large-batch synthesis. It handles up to 100,000 billing characters per task, processes asynchronously, stores output in S3, and optionally notifies via SNS — ideal for bulk content narration jobs.",
        },
        {
          question:
            "What are the character limits for SynthesizeSpeech (synchronous) and StartSpeechSynthesisTask (asynchronous) in Amazon Polly?",
          options: [
            "SynthesizeSpeech: 1,000 characters; StartSpeechSynthesisTask: 50,000 characters",
            "SynthesizeSpeech: 3,000 billing characters; StartSpeechSynthesisTask: 100,000 billing characters",
            "SynthesizeSpeech: 5,000 characters; StartSpeechSynthesisTask: unlimited",
            "Both APIs share a 10,000 character limit per request",
          ],
          correctIndex: 1,
          explanation:
            "SynthesizeSpeech (synchronous) accepts up to 3,000 billing characters and returns an audio stream immediately. StartSpeechSynthesisTask (asynchronous) accepts up to 100,000 billing characters and stores the result in S3.",
        },
      ],
    },
    {
      heading: "Integration Patterns",
      body: `Polly fits naturally into several architectural patterns. In **conversational AI pipelines**, Polly sits downstream of Amazon Lex: after Lex determines the bot's text response, that text is passed to Polly to synthesize audio, which is streamed back to the user. Amazon Lex V2 can invoke Polly directly within the bot runtime, simplifying the integration.

For **accessibility** use cases, Polly can be embedded in e-readers, web applications, and mobile apps to provide text-to-speech for users with visual impairments or reading disabilities. The AWS JavaScript SDK includes a Polly pre-signer for generating presigned URLs to audio streams, enabling browser-side audio playback without exposing AWS credentials.

**Content generation** workflows use the async API to produce audio versions of written content at scale — converting a library of articles or training materials to audio format for podcast or audio-book delivery. Combined with S3 event notifications and Lambda, you can build a fully automated pipeline: text files dropped to S3 trigger a Lambda that calls Polly's async API, and the resulting MP3 files are stored back in S3 for distribution via CloudFront.`,
      quiz: [
        {
          question:
            "In a voice bot architecture using Amazon Lex and Amazon Polly, what is Polly's role?",
          options: [
            "Polly performs natural language understanding to extract intents from user speech",
            "Polly converts the bot's text responses into spoken audio that is returned to the user",
            "Polly transcribes the user's spoken input so Lex can process it as text",
            "Polly manages conversation state and session context between turns",
          ],
          correctIndex: 1,
          explanation:
            "In a Lex + Polly voice bot, Lex handles NLU (understanding the user's intent) and generates a text response. Polly then synthesizes that text response into spoken audio for the user. Transcribe would handle the speech-to-text input side.",
        },
        {
          question:
            "Which output formats does Amazon Polly support for synthesized audio?",
          options: [
            "MP3, WAV, and FLAC",
            "MP3, OGG Vorbis, and PCM",
            "AAC, MP3, and OGG Vorbis",
            "MP3, OGG Vorbis, and WebM",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Polly supports three output formats: MP3 (most common), OGG Vorbis, and PCM (uncompressed, commonly used for telephony systems). WAV and FLAC are not supported output formats.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A developer is building a real-time voice notification system that converts short alert messages (under 200 characters) to audio and plays them immediately. Which Polly API should they use?",
      options: [
        "StartSpeechSynthesisTask — it provides better quality for real-time audio",
        "SynthesizeSpeech — it is synchronous and returns an audio stream immediately",
        "GetSpeechSynthesisTask — it retrieves pre-synthesized audio from S3",
        "ListSpeechSynthesisTasks — it streams audio from queued synthesis jobs",
      ],
      correctIndex: 1,
      explanation:
        "SynthesizeSpeech is the synchronous API that returns an audio stream immediately, making it ideal for real-time applications. StartSpeechSynthesisTask is asynchronous and stores results in S3, which adds latency unsuitable for real-time notifications.",
    },
    {
      question: "What is the purpose of SSML lexicons in Amazon Polly?",
      options: [
        "They define which voice and engine to use for each segment of text",
        "They map source-language words to target-language equivalents for translation",
        "They define custom pronunciations for specific words or phrases, applied to synthesis requests",
        "They specify the output audio format and bitrate for synthesized speech",
      ],
      correctIndex: 2,
      explanation:
        "Lexicons in Polly define custom pronunciation mappings — for brand names, medical terminology, abbreviations, or proper nouns that the default pronunciation model handles incorrectly. They are attached to synthesis requests and applied at synthesis time.",
    },
    {
      question:
        "Which Amazon Polly feature would you use to make a Neural TTS voice sound like a news anchor reading headlines?",
      options: [
        "Standard engine with a <prosody rate='fast'> SSML tag",
        "Neural TTS voice with news speaking style",
        "A custom brand voice trained on news broadcast audio",
        "The <emphasis level='strong'> SSML tag applied to every sentence",
      ],
      correctIndex: 1,
      explanation:
        "Some Neural TTS voices support a news speaking style, which produces the clear, authoritative cadence typical of news anchors. This is a built-in Neural engine feature selected via the speaking style parameter.",
    },
    {
      question: "Amazon Polly is best described as which type of AI service?",
      options: [
        "Automatic speech recognition (ASR) — converts audio to text",
        "Natural language understanding (NLU) — extracts intents from text",
        "Text-to-speech (TTS) — converts text to spoken audio",
        "Neural machine translation (NMT) — converts text between languages",
      ],
      correctIndex: 2,
      explanation:
        "Amazon Polly is a text-to-speech (TTS) service. It converts written text into spoken audio. The opposite direction — speech to text — is Amazon Transcribe (ASR).",
    },
    {
      question:
        "You are converting a 50,000-word technical manual into an audio book using Amazon Polly. Which API and workflow should you use?",
      options: [
        "SynthesizeSpeech in a loop, splitting the text into 3,000-character chunks",
        "StartSpeechSynthesisTask with the full text stored in S3, storing the output MP3 back to S3",
        "SynthesizeSpeech with the Engine set to 'batch' for large text inputs",
        "GetSpeechSynthesisTask to retrieve a pre-synthesized version from Polly's cache",
      ],
      correctIndex: 1,
      explanation:
        "StartSpeechSynthesisTask handles up to 100,000 billing characters asynchronously, stores output in S3, and can notify via SNS on completion. It is designed exactly for large-batch narration jobs like audio books.",
    },
    {
      question:
        "A contact center application uses Amazon Lex for the conversational bot and needs to speak responses to callers. What is Polly's role in this architecture?",
      options: [
        "Polly detects the caller's intent from their speech",
        "Polly converts Lex's text responses into spoken audio for the caller",
        "Polly transcribes the caller's speech so Lex can understand it",
        "Polly manages the conversation flow and session attributes",
      ],
      correctIndex: 1,
      explanation:
        "In a Lex + Polly integration, Lex handles conversation logic and generates text responses, and Polly synthesizes those text responses into spoken audio. Amazon Transcribe (or Lex's built-in ASR) handles the speech-to-text direction.",
    },
    {
      question:
        "Which SSML tag inserts a timed pause between sentences in a Polly synthesis request?",
      options: [
        "<pause duration='500ms'/>",
        "<break time='500ms'/>",
        "<prosody rate='x-slow'> </prosody>",
        "<silence length='500'/>",
      ],
      correctIndex: 1,
      explanation:
        "The <break time='500ms'/> SSML tag inserts a pause of the specified duration. It is the standard SSML tag for controlling timing between spoken segments.",
    },
    {
      question:
        "PCM is one of the output formats supported by Amazon Polly. In which use case is PCM output most commonly used?",
      options: [
        "Streaming audio to web browsers via HTML5 audio players",
        "Storing audio files in S3 for podcast distribution",
        "Telephony systems that require uncompressed audio for processing",
        "Mobile applications that need the smallest possible file size",
      ],
      correctIndex: 2,
      explanation:
        "PCM (Pulse-Code Modulation) is uncompressed audio commonly required by telephony systems (like Amazon Connect or traditional PSTN gateways) that process raw audio samples. MP3 and OGG Vorbis are compressed formats more suitable for streaming and storage.",
    },
  ],
};
