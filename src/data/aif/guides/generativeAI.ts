import { ServiceGuide } from "../../../types/guide";

export const generativeAIGuide: ServiceGuide = {
  id: "aif-generative-ai",
  service: "Generative AI",
  domain: "development",
  tagline:
    "Core concepts behind large language models, prompting, and generative AI applications",
  intro:
    "Generative AI refers to AI systems that create new content — text, images, audio, code — rather than simply classifying or predicting from existing data. Understanding how large language models work, how to prompt them effectively, and their limitations is foundational for the AIF-C01 exam.",

  sections: [
    {
      heading: "What Generative AI Is",
      body: `Generative AI models learn the statistical distribution of their training data and can sample from that distribution to produce novel outputs. The most prominent category today is **Large Language Models (LLMs)** — neural networks trained on enormous text corpora to predict the next token in a sequence. Because next-token prediction over enough data requires learning deep patterns of language, reasoning, and world knowledge, LLMs emerge with surprisingly broad capabilities.

The transformer architecture, introduced in the 2017 "Attention Is All You Need" paper, underlies virtually all modern LLMs. Transformers use **self-attention** mechanisms that allow every token in a sequence to attend to every other token simultaneously, capturing long-range dependencies far more effectively than earlier recurrent architectures. Pre-training on internet-scale text (hundreds of billions to trillions of tokens) produces a **foundation model** — a general-purpose capability base that can be adapted to specific tasks through fine-tuning or prompting.

Beyond text, generative AI encompasses **image generation** (diffusion models like Stable Diffusion, DALL-E), **audio synthesis**, **code generation** (GitHub Copilot, Amazon CodeWhisperer/Q Developer), and **multimodal** models that work across text, images, and other modalities simultaneously.`,
      quiz: [
        {
          question:
            "What is the core training objective of a Large Language Model (LLM)?",
          options: [
            "Classifying input text into predefined categories",
            "Predicting the next token in a sequence",
            "Detecting objects in images with bounding boxes",
            "Clustering similar documents together",
          ],
          correctIndex: 1,
          explanation:
            "LLMs are trained to predict the next token in a sequence — a self-supervised objective applied over massive text corpora. This simple objective, scaled to internet-scale data, enables LLMs to develop broad language, reasoning, and world knowledge capabilities. Classification, object detection, and clustering are different ML tasks.",
        },
        {
          question:
            "What key innovation did the transformer architecture introduce that made it superior to earlier recurrent architectures for language modeling?",
          options: [
            "The ability to process images alongside text",
            "Self-attention mechanisms that allow every token to attend to every other token simultaneously",
            "Larger parameter counts than previous models",
            "The use of reinforcement learning from human feedback",
          ],
          correctIndex: 1,
          explanation:
            "The transformer's self-attention mechanism allows every token in a sequence to attend to every other token simultaneously, capturing long-range dependencies far more effectively than recurrent networks (RNNs/LSTMs) which process tokens sequentially. Multimodality, parameter count, and RLHF are separate developments from the transformer architecture itself.",
        },
        {
          question:
            "A foundation model is best described as which of the following?",
          options: [
            "A small, task-specific model trained on labeled data for one use case",
            "A general-purpose capability base pre-trained on large-scale data that can be adapted through fine-tuning or prompting",
            "A rules-based system that encodes expert knowledge",
            "A model that can only be used for the task it was explicitly trained on",
          ],
          correctIndex: 1,
          explanation:
            "A foundation model is a large general-purpose model pre-trained on massive data that serves as a capability base adaptable to many downstream tasks through prompting or fine-tuning. It is the opposite of a narrow task-specific model. Foundation models are probabilistic, not rules-based, and are designed for broad adaptability.",
        },
      ],
    },
    {
      heading: "Tokens, Context Windows, and Parameters",
      body: `**Tokens** are the fundamental units LLMs process. A token is approximately 3/4 of a word in English — "fantastic" might be one token, while "unfantastic" might be two. Punctuation, spaces, and special characters are separate tokens. The tokenizer (a component that converts text to token IDs) varies by model — the same text can produce different token counts with different models.

The **context window** is the maximum number of tokens a model can process in a single inference call, encompassing both the input (prompt) and output (completion). Early models had context windows of 2K-4K tokens; modern models support 128K, 200K, or even 1M+ tokens. Larger context windows allow processing entire books, long conversations, or large codebases in a single call, but they increase computational cost (attention computation scales quadratically with sequence length in vanilla transformers).

**Parameters** are the learnable weights in the neural network. Model size is often described in parameter counts: 7B parameters, 70B parameters, 405B parameters. More parameters generally (though not always) mean greater capability, but also greater cost and memory requirements. **Quantization** compresses model weights from 32-bit or 16-bit floats to 8-bit integers or lower precision, dramatically reducing memory footprint at modest accuracy cost, enabling deployment of large models on smaller hardware.`,
      quiz: [
        {
          question: "What does the context window of an LLM represent?",
          options: [
            "The maximum number of parameters the model can use during inference",
            "The maximum number of tokens the model can process in a single inference call, including both input and output",
            "The number of training examples used to build the model",
            "The time window during which the model was trained",
          ],
          correctIndex: 1,
          explanation:
            "The context window is the maximum total token count for a single inference call, encompassing both the input prompt and the generated output. It is not related to parameter count, training examples, or the training time period. Exceeding the context window causes earlier content to be dropped.",
        },
        {
          question: "What does quantization do to a large language model?",
          options: [
            "It increases model accuracy by adding more training data",
            "It compresses model weights to lower numerical precision, reducing memory footprint at modest accuracy cost",
            "It splits the model across multiple GPUs for parallel inference",
            "It removes unnecessary layers from the model to speed up inference",
          ],
          correctIndex: 1,
          explanation:
            "Quantization compresses model weights from high-precision floats (32-bit or 16-bit) to lower-precision integers (8-bit or lower), dramatically reducing the memory required to run the model. This enables deploying large models on smaller or fewer GPUs. It trades a modest accuracy reduction for significantly lower resource requirements.",
        },
        {
          question:
            "Approximately how many words does a single token represent in English for most LLMs?",
          options: [
            "Exactly one word",
            "Approximately 3/4 of a word",
            "Approximately 4 words",
            "Exactly one character",
          ],
          correctIndex: 1,
          explanation:
            "A token is approximately 3/4 of a word in English on average — common short words may be one token, while longer or unusual words may be split into multiple tokens. Punctuation and spaces are also separate tokens. This means 100 tokens is roughly 75 words of English text.",
        },
      ],
    },
    {
      heading: "Prompt Engineering",
      body: `**Prompt engineering** is the practice of designing input text that elicits the desired output from an LLM. Because LLMs are sensitive to how instructions are phrased and contextualized, prompt design is a significant determinant of output quality — often more impactful than model choice for a given task.

**Zero-shot prompting** asks the model to perform a task with no examples: "Classify this customer review as positive or negative: [review]". **Few-shot prompting** provides a small number of examples before the actual task: you show the model 3-5 input-output pairs that demonstrate the desired format and reasoning pattern, and the model generalizes to the new input. Few-shot prompting often dramatically improves performance on structured tasks.

**Chain-of-thought (CoT) prompting** asks the model to reason step-by-step before giving a final answer: "Let's think step by step..." This technique, discovered empirically, improves performance on multi-step reasoning tasks because the intermediate reasoning steps help the model avoid errors. **Structured output prompting** instructs the model to format its response as JSON, XML, or a specific schema — combining this with function calling (tool use) enables reliable extraction of structured data from unstructured model outputs.

Key prompt design principles: be specific and explicit, provide context, specify the desired output format, use system prompts to set role and constraints, and iterate — prompt engineering is inherently experimental.`,
      quiz: [
        {
          question:
            "A developer provides three example input-output pairs before asking an LLM to classify a new customer review. Which prompting technique is this?",
          options: [
            "Zero-shot prompting",
            "Chain-of-thought prompting",
            "Few-shot prompting",
            "Structured output prompting",
          ],
          correctIndex: 2,
          explanation:
            "Few-shot prompting provides a small number of example input-output pairs (typically 3-5) before the actual task, helping the model understand the desired format and pattern. Zero-shot provides no examples. Chain-of-thought asks the model to reason step-by-step. Structured output specifies a response format like JSON.",
        },
        {
          question:
            "Which prompting technique is most effective for improving LLM performance on multi-step reasoning problems like math word problems?",
          options: [
            "Zero-shot prompting",
            "Few-shot prompting with answer-only examples",
            "Chain-of-thought (CoT) prompting",
            "Structured output prompting with JSON schema",
          ],
          correctIndex: 2,
          explanation:
            "Chain-of-thought prompting asks the model to reason step-by-step before giving a final answer, making intermediate reasoning steps explicit. This empirically improves performance on multi-step reasoning tasks (math, logic, multi-hop QA) because the explicit steps prevent reasoning errors. Zero-shot and few-shot without explicit reasoning steps are less effective for complex reasoning.",
        },
        {
          question: "What is zero-shot prompting?",
          options: [
            "Prompting with zero system prompt context",
            "Asking the model to perform a task with no examples provided",
            "Prompting a model that has not been fine-tuned",
            "A technique that uses temperature=0 for deterministic outputs",
          ],
          correctIndex: 1,
          explanation:
            "Zero-shot prompting asks the model to perform a task with no examples — just the instruction and the input. It relies entirely on the model's pre-trained knowledge and instruction-following ability. It is not related to system prompts, fine-tuning status, or temperature settings.",
        },
      ],
    },
    {
      heading: "Hallucinations, Grounding, and RAG",
      body: `**Hallucination** is one of the most critical limitations of LLMs: the tendency to generate confident-sounding but factually incorrect, fabricated, or internally inconsistent content. Hallucination occurs because LLMs are optimized to produce plausible-sounding text, not factually verified statements. They may invent citations, fabricate statistics, misremember facts from training data, or confabulate when asked about topics outside their training distribution.

Several strategies address hallucination. **Retrieval-Augmented Generation (RAG)** is the most widely deployed approach: instead of relying on the model's parametric memory alone, you retrieve relevant documents from a knowledge base at query time and inject them into the prompt as context. The model is instructed to base its answer on the provided context, not generate from memory. This grounds the model's outputs in verifiable source material.

**Temperature** controls randomness in generation. Temperature = 0 makes the model deterministic (always choosing the highest-probability token), minimizing hallucination risk but also creativity. Higher temperatures increase diversity and creativity at the cost of coherence and factual reliability. For factual Q&A applications, lower temperatures (0.0-0.3) are appropriate; for creative writing, higher temperatures (0.7-1.0) produce more varied output.

**Grounding checks** (supported in Bedrock Guardrails) automatically evaluate whether model responses are supported by the provided context, flagging or blocking responses that include claims not grounded in the retrieved documents.`,
      quiz: [
        {
          question:
            "What is hallucination in the context of large language models?",
          options: [
            "A model generating outputs that are too short or truncated",
            "A model generating confident-sounding but factually incorrect or fabricated content",
            "A model that refuses to answer questions outside its training domain",
            "A model producing inconsistent outputs due to high temperature settings",
          ],
          correctIndex: 1,
          explanation:
            "Hallucination refers to the LLM tendency to generate confident, plausible-sounding content that is factually incorrect, fabricated, or inconsistent with reality. LLMs are optimized for plausibility, not verified truth. It is distinct from truncation, refusals, or randomness — it specifically involves false but confident assertions.",
        },
        {
          question:
            "Which strategy is the most widely deployed approach to reduce LLM hallucinations in production applications?",
          options: [
            "Fine-tuning the model on factual data",
            "Retrieval-Augmented Generation (RAG)",
            "Setting temperature to 0",
            "Using a larger model with more parameters",
          ],
          correctIndex: 1,
          explanation:
            "RAG is the most widely deployed hallucination mitigation strategy — it retrieves relevant documents at query time and instructs the model to base its answer on the provided context rather than parametric memory. Fine-tuning can introduce knowledge but it becomes stale. Temperature=0 reduces randomness but doesn't prevent hallucinations. Larger models still hallucinate.",
        },
        {
          question:
            "For a factual question-answering application where accuracy is critical, what temperature range is most appropriate?",
          options: [
            "0.7–1.0 for maximum diversity",
            "0.0–0.3 for more deterministic, factual outputs",
            "Exactly 0.5 as a balanced midpoint",
            "Temperature does not affect factual accuracy",
          ],
          correctIndex: 1,
          explanation:
            "Lower temperatures (0.0–0.3) make the model more deterministic by favoring higher-probability tokens, reducing hallucination risk for factual tasks. Higher temperatures (0.7–1.0) increase creativity and diversity but can introduce factual errors. Temperature does meaningfully affect factual reliability.",
        },
      ],
    },
    {
      heading: "Fine-Tuning vs Prompting vs RAG",
      body: `A key architectural decision in generative AI applications is when to use prompting, when to use RAG, and when to fine-tune. These are not mutually exclusive — they address different problems and are often combined.

**Prompting** (including few-shot and chain-of-thought) is the starting point. It requires no training, no data collection, and is fast to iterate. Use prompting when the task is within the model's existing capabilities and can be adequately described in the prompt. Limitation: prompt tokens count toward context window costs, and complex instructions may still produce inconsistent results.

**RAG** addresses the knowledge currency problem — when the model's training data is outdated, or when you need to answer questions about private or domain-specific documents not in the training corpus. RAG adds factual grounding but adds latency (retrieval step) and requires building and maintaining a vector index. Use RAG when answers should be traceable to source documents.

**Fine-tuning** modifies the model's weights to specialize it for a specific task, format, or domain. It is the right choice when: you need consistent output formatting that prompting cannot reliably achieve, you have hundreds of examples of desired behavior, you want to reduce prompt token costs by removing lengthy system prompts, or you need to adapt a model's style or persona deeply. Fine-tuning is not a good solution for injecting new factual knowledge — that knowledge can become stale, and RAG is better suited for dynamic information. The combination of RAG for knowledge and fine-tuning for behavior/style is powerful.`,
      quiz: [
        {
          question:
            "A company wants an LLM to consistently output responses in a specific JSON format and adopt a formal corporate tone. They have 500 examples of ideal responses. Which approach is most appropriate?",
          options: [
            "RAG with a vector index of the example responses",
            "Zero-shot prompting with format instructions",
            "Fine-tuning the model on the labeled examples",
            "Increasing the model's context window",
          ],
          correctIndex: 2,
          explanation:
            "Fine-tuning is the right choice when you need consistent output formatting and style that prompting alone cannot reliably achieve, and when you have examples of desired behavior. RAG addresses knowledge retrieval, not format consistency. Zero-shot prompting is less reliable for strict formatting. Context window size is unrelated.",
        },
        {
          question:
            "A customer service application needs to answer questions about internal product manuals that change frequently and are not in any model's training data. Which approach best addresses this?",
          options: [
            "Fine-tuning the model on product manuals quarterly",
            "RAG — retrieving relevant manual sections at query time and injecting them into the prompt",
            "Prompting the model to generate product information from its training data",
            "Using a larger foundation model with more recent training data",
          ],
          correctIndex: 1,
          explanation:
            "RAG is ideal when content is private (not in training data), frequently updated, and answers must be traceable to source documents. Fine-tuning on manuals requires retraining when content changes. Prompting the model to generate product info from training data would produce hallucinations about proprietary content. A larger model still lacks proprietary, current data.",
        },
        {
          question:
            "Why is fine-tuning generally NOT recommended as a solution for injecting new factual knowledge into an LLM?",
          options: [
            "Fine-tuning is too expensive to perform more than once",
            "The knowledge embedded through fine-tuning can become stale as facts change, and RAG is better suited for dynamic information",
            "Fine-tuning cannot modify the knowledge stored in model weights",
            "Fine-tuning always reduces model performance on factual tasks",
          ],
          correctIndex: 1,
          explanation:
            "Knowledge injected through fine-tuning becomes part of the model's static weights and cannot be updated without retraining. As facts change over time, this knowledge becomes stale. RAG retrieves current documents at query time, making it better for dynamic or frequently updated information. Fine-tuning does embed knowledge into weights — it's the staleness that's the problem.",
        },
      ],
    },
  ],

  keyFacts: [
    "LLMs are trained to predict the next token over massive text corpora",
    "Transformer architecture with self-attention underlies all modern LLMs",
    "Tokens are approximately 3/4 of a word; context window limits total input+output tokens",
    "Parameters = model weight count; more parameters generally means greater capability",
    "Hallucination = confidently generating false or fabricated content",
    "RAG = retrieve relevant documents at query time and inject into prompt for grounding",
    "Temperature: 0 = deterministic, higher = more random/creative output",
    "Few-shot prompting provides examples; chain-of-thought prompting elicits step-by-step reasoning",
    "Fine-tuning changes model weights; RAG adds knowledge without changing weights",
    "Quantization reduces model memory footprint by reducing weight precision",
  ],

  relatedServices: [
    "Amazon Bedrock",
    "Amazon SageMaker",
    "Amazon Kendra",
    "Amazon OpenSearch Serverless",
    "AWS Lambda",
  ],

  examTips: [
    "Hallucination = model generates false content confidently — RAG and grounding checks mitigate it",
    "RAG vs fine-tuning: RAG for dynamic/factual knowledge; fine-tuning for behavior/format/style",
    "Temperature = 0 for deterministic factual tasks; higher for creative tasks",
    "Few-shot prompting > zero-shot for structured tasks with consistent patterns",
    "Context window encompasses both input prompt AND output completion tokens",
    "Chain-of-thought prompting improves multi-step reasoning by making steps explicit",
    "LLMs are next-token predictors — they generate plausible text, not verified truth",
    "Foundation models are general-purpose; fine-tuning specializes them for specific tasks",
  ],

  topicQuiz: [
    {
      question: "What is the fundamental reason LLMs hallucinate?",
      options: [
        "They have insufficient parameters to store all human knowledge",
        "They are optimized to produce plausible-sounding text, not factually verified statements",
        "They lack access to the internet during inference",
        "They were trained on intentionally incorrect data",
      ],
      correctIndex: 1,
      explanation:
        "LLMs are trained to maximize the likelihood of plausible next tokens — they generate text that sounds right statistically, not text that has been verified against a ground-truth knowledge base. This is why they can fabricate citations, invent statistics, or confabulate with high confidence. More parameters, internet access, or better training data reduce but don't eliminate this tendency.",
    },
    {
      question:
        "A developer needs to build a legal document analysis tool that answers attorney questions about specific case files stored in S3. The files change weekly. Which architecture is most appropriate?",
      options: [
        "Fine-tune a legal LLM on the case files quarterly",
        "RAG using Bedrock Knowledge Bases pointing at the S3 case files",
        "Zero-shot prompting of a large general-purpose LLM",
        "Continued pre-training on legal text corpora",
      ],
      correctIndex: 1,
      explanation:
        "RAG with Bedrock Knowledge Bases is ideal: it retrieves the specific, current case file content at query time without requiring retraining when files change. Fine-tuning quarterly would produce stale knowledge. Zero-shot prompting cannot access the private case files. Continued pre-training adds domain vocabulary but not specific case content.",
    },
    {
      question:
        "Which two prompting techniques can be combined to get the best performance on complex, multi-step structured tasks?",
      options: [
        "Zero-shot and temperature=0",
        "Few-shot examples and chain-of-thought reasoning",
        "Structured output and temperature=1.0",
        "System prompt and quantization",
      ],
      correctIndex: 1,
      explanation:
        "Combining few-shot examples (showing the desired format and reasoning pattern) with chain-of-thought prompting (eliciting step-by-step reasoning) is highly effective for complex structured tasks — the examples demonstrate the pattern and the CoT prompting ensures the model reasons through each step carefully. Temperature and quantization are inference parameters, not prompting techniques.",
    },
    {
      question:
        "A model with 7 billion parameters is compared to a model with 70 billion parameters. What is generally true, with caveats?",
      options: [
        "The 7B model is always more capable because smaller models are more focused",
        "The 70B model generally has greater capability but requires more compute and memory",
        "Parameter count has no relationship to model capability",
        "The 70B model is always faster because it processes more information in parallel",
      ],
      correctIndex: 1,
      explanation:
        "More parameters generally (though not always) produce greater capability, as the model has more capacity to store patterns and knowledge. However, larger models require more memory and compute, increasing cost and latency. Modern techniques like quantization and architectural improvements mean smaller models can sometimes match larger ones on specific tasks.",
    },
    {
      question:
        "Why does attention computation in vanilla transformers scale quadratically with sequence length?",
      options: [
        "Because each attention head processes input twice",
        "Because every token must attend to every other token, so attention computations grow as the square of the number of tokens",
        "Because training requires two forward passes per batch",
        "Because the embedding dimension doubles with sequence length",
      ],
      correctIndex: 1,
      explanation:
        "In self-attention, every token computes attention scores against every other token. For a sequence of N tokens, this requires N×N attention computations — quadratic scaling. This is why longer context windows dramatically increase computational cost and why various efficient attention approximations have been developed.",
    },
    {
      question:
        "What is the key advantage of RAG over fine-tuning for incorporating new information into an LLM application?",
      options: [
        "RAG is always cheaper to implement than fine-tuning",
        "RAG allows knowledge to be updated by changing the document store without retraining the model",
        "RAG improves the model's ability to follow formatting instructions",
        "RAG eliminates the need for a system prompt",
      ],
      correctIndex: 1,
      explanation:
        "RAG's key advantage is that the knowledge base (document store) can be updated independently of the model — add a new document, remove an outdated one, and the model immediately has access to current information at the next query. Fine-tuning embeds knowledge in weights that require retraining to update. RAG does not inherently improve formatting or eliminate system prompts.",
    },
    {
      question:
        "Which prompting technique is most suitable when you need to extract structured data (like a JSON object with specific fields) from unstructured model output reliably?",
      options: [
        "Chain-of-thought prompting",
        "Structured output prompting combined with function calling (tool use)",
        "Few-shot prompting with narrative examples",
        "Zero-shot prompting with high temperature",
      ],
      correctIndex: 1,
      explanation:
        "Structured output prompting — instructing the model to format its response as JSON, XML, or a specific schema — combined with function calling/tool use enables reliable extraction of structured data. Chain-of-thought elicits reasoning steps, not structured output. Few-shot with narrative examples helps understanding but doesn't enforce schemas. High temperature increases variability, which is counterproductive for structured output.",
    },
    {
      question:
        "A creative writing assistant should generate diverse, varied story continuations. A factual medical Q&A bot should give consistent, accurate answers. How should temperature be set for each?",
      options: [
        "High temperature for both to maximize model capability",
        "Low temperature for both to ensure consistency",
        "High temperature for creative writing; low temperature for medical Q&A",
        "Temperature does not affect creative vs factual output quality",
      ],
      correctIndex: 2,
      explanation:
        "Higher temperatures (0.7–1.0) increase token sampling randomness, producing more varied and creative outputs suitable for creative writing. Lower temperatures (0.0–0.3) make the model more deterministic and factually reliable, appropriate for medical Q&A where accuracy and consistency are critical. Temperature is one of the most important inference parameters to tune per use case.",
    },
  ],
};
