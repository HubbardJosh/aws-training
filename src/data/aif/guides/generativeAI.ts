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
    },
    {
      heading: "Tokens, Context Windows, and Parameters",
      body: `**Tokens** are the fundamental units LLMs process. A token is approximately 3/4 of a word in English — "fantastic" might be one token, while "unfantastic" might be two. Punctuation, spaces, and special characters are separate tokens. The tokenizer (a component that converts text to token IDs) varies by model — the same text can produce different token counts with different models.

The **context window** is the maximum number of tokens a model can process in a single inference call, encompassing both the input (prompt) and output (completion). Early models had context windows of 2K-4K tokens; modern models support 128K, 200K, or even 1M+ tokens. Larger context windows allow processing entire books, long conversations, or large codebases in a single call, but they increase computational cost (attention computation scales quadratically with sequence length in vanilla transformers).

**Parameters** are the learnable weights in the neural network. Model size is often described in parameter counts: 7B parameters, 70B parameters, 405B parameters. More parameters generally (though not always) mean greater capability, but also greater cost and memory requirements. **Quantization** compresses model weights from 32-bit or 16-bit floats to 8-bit integers or lower precision, dramatically reducing memory footprint at modest accuracy cost, enabling deployment of large models on smaller hardware.`,
    },
    {
      heading: "Prompt Engineering",
      body: `**Prompt engineering** is the practice of designing input text that elicits the desired output from an LLM. Because LLMs are sensitive to how instructions are phrased and contextualized, prompt design is a significant determinant of output quality — often more impactful than model choice for a given task.

**Zero-shot prompting** asks the model to perform a task with no examples: "Classify this customer review as positive or negative: [review]". **Few-shot prompting** provides a small number of examples before the actual task: you show the model 3-5 input-output pairs that demonstrate the desired format and reasoning pattern, and the model generalizes to the new input. Few-shot prompting often dramatically improves performance on structured tasks.

**Chain-of-thought (CoT) prompting** asks the model to reason step-by-step before giving a final answer: "Let's think step by step..." This technique, discovered empirically, improves performance on multi-step reasoning tasks because the intermediate reasoning steps help the model avoid errors. **Structured output prompting** instructs the model to format its response as JSON, XML, or a specific schema — combining this with function calling (tool use) enables reliable extraction of structured data from unstructured model outputs.

Key prompt design principles: be specific and explicit, provide context, specify the desired output format, use system prompts to set role and constraints, and iterate — prompt engineering is inherently experimental.`,
    },
    {
      heading: "Hallucinations, Grounding, and RAG",
      body: `**Hallucination** is one of the most critical limitations of LLMs: the tendency to generate confident-sounding but factually incorrect, fabricated, or internally inconsistent content. Hallucination occurs because LLMs are optimized to produce plausible-sounding text, not factually verified statements. They may invent citations, fabricate statistics, misremember facts from training data, or confabulate when asked about topics outside their training distribution.

Several strategies address hallucination. **Retrieval-Augmented Generation (RAG)** is the most widely deployed approach: instead of relying on the model's parametric memory alone, you retrieve relevant documents from a knowledge base at query time and inject them into the prompt as context. The model is instructed to base its answer on the provided context, not generate from memory. This grounds the model's outputs in verifiable source material.

**Temperature** controls randomness in generation. Temperature = 0 makes the model deterministic (always choosing the highest-probability token), minimizing hallucination risk but also creativity. Higher temperatures increase diversity and creativity at the cost of coherence and factual reliability. For factual Q&A applications, lower temperatures (0.0-0.3) are appropriate; for creative writing, higher temperatures (0.7-1.0) produce more varied output.

**Grounding checks** (supported in Bedrock Guardrails) automatically evaluate whether model responses are supported by the provided context, flagging or blocking responses that include claims not grounded in the retrieved documents.`,
    },
    {
      heading: "Fine-Tuning vs Prompting vs RAG",
      body: `A key architectural decision in generative AI applications is when to use prompting, when to use RAG, and when to fine-tune. These are not mutually exclusive — they address different problems and are often combined.

**Prompting** (including few-shot and chain-of-thought) is the starting point. It requires no training, no data collection, and is fast to iterate. Use prompting when the task is within the model's existing capabilities and can be adequately described in the prompt. Limitation: prompt tokens count toward context window costs, and complex instructions may still produce inconsistent results.

**RAG** addresses the knowledge currency problem — when the model's training data is outdated, or when you need to answer questions about private or domain-specific documents not in the training corpus. RAG adds factual grounding but adds latency (retrieval step) and requires building and maintaining a vector index. Use RAG when answers should be traceable to source documents.

**Fine-tuning** modifies the model's weights to specialize it for a specific task, format, or domain. It is the right choice when: you need consistent output formatting that prompting cannot reliably achieve, you have hundreds of examples of desired behavior, you want to reduce prompt token costs by removing lengthy system prompts, or you need to adapt a model's style or persona deeply. Fine-tuning is not a good solution for injecting new factual knowledge — that knowledge can become stale, and RAG is better suited for dynamic information. The combination of RAG for knowledge and fine-tuning for behavior/style is powerful.`,
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
};
