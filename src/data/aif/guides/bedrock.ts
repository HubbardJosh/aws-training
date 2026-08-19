import { ServiceGuide } from "../../../types/guide";

export const bedrockGuide: ServiceGuide = {
  id: "aif-bedrock",
  service: "Amazon Bedrock",
  domain: "development",
  tagline: "Fully managed access to foundation models for generative AI applications",
  intro:
    "Amazon Bedrock is a fully managed service that provides access to high-performing foundation models (FMs) from leading AI companies through a single API, enabling you to build and scale generative AI applications without managing any infrastructure.",

  sections: [
    {
      heading: "What Amazon Bedrock Is",
      body: `Amazon Bedrock sits at the center of AWS's generative AI strategy. Rather than forcing you to train your own large language models from scratch — an endeavor that requires massive compute clusters, petabytes of data, and months of time — Bedrock gives you immediate API access to a curated catalog of **foundation models** built by companies such as Anthropic (Claude), Meta (Llama), Mistral AI, Cohere, AI21 Labs, and Amazon itself (Titan and Nova families). These models are already trained on enormous corpora of text, code, and imagery, so they arrive with broad capabilities out of the box.

The service is fully serverless. You don't provision EC2 instances, manage GPU clusters, or worry about model serving infrastructure. You make an API call, Bedrock routes your request to the appropriate model endpoint, and you receive a response. This abstraction means your team can focus on the application layer — prompt design, retrieval pipelines, output validation — rather than ML infrastructure.`,
    },
    {
      heading: "Foundation Model Catalog and Invocation",
      body: `Bedrock's model catalog is accessed through the **InvokeModel** and **InvokeModelWithResponseStream** APIs. Each model has a unique **model ID** (for example, \`anthropic.claude-3-5-sonnet-20241022-v2:0\`) and a request/response schema specific to that model provider. The **Converse API** offers a unified interface that normalizes input and output formats across providers, making it easier to swap models without rewriting application code.

**Streaming responses** are critical for conversational applications: instead of waiting for the full response to generate before returning anything, the model streams tokens as they are produced, dramatically reducing perceived latency. Bedrock supports streaming natively via the \`InvokeModelWithResponseStream\` call or through the Converse API's streaming variant.

You control model behavior through **inference parameters** such as \`temperature\` (randomness), \`top_p\` (nucleus sampling), \`top_k\` (vocabulary restriction), and \`maxTokens\` (output length cap). Different providers expose different subsets of these parameters, so the Converse API helps abstract away provider-specific naming.`,
    },
    {
      heading: "Knowledge Bases and Retrieval-Augmented Generation",
      body: `One of Bedrock's most powerful features is **Knowledge Bases**, which implements Retrieval-Augmented Generation (RAG) as a managed service. RAG addresses a fundamental limitation of foundation models: their knowledge is frozen at training time and they cannot access your proprietary, real-time, or domain-specific information. Knowledge Bases solves this by letting you connect Bedrock to your own document repositories.

The workflow is: you point a Knowledge Base at an S3 bucket containing your documents (PDFs, Word files, HTML, CSV, and more). Bedrock's managed data ingestion pipeline chunks the documents, generates **vector embeddings** using a selected embedding model (Amazon Titan Embeddings or Cohere Embed), and stores those embeddings in a connected **vector store** — Amazon OpenSearch Serverless, Aurora with the pgvector extension, Pinecone, Redis Enterprise Cloud, or MongoDB Atlas. At query time, the user's question is embedded and compared against the stored vectors; the most semantically similar chunks are retrieved and injected into the model's prompt as context, allowing the model to answer questions grounded in your data.

This pattern dramatically reduces hallucination risk on domain-specific questions and eliminates the need to fine-tune a model just to inject new knowledge.`,
    },
    {
      heading: "Agents for Bedrock",
      body: `**Bedrock Agents** extends foundation models from passive text generators into active systems that can reason, plan, and take actions. An Agent receives a natural language goal from a user and uses a **ReAct** (Reasoning + Acting) loop to break the goal into steps, decide which tools to call, call them, observe results, and iterate until the task is complete.

Tools are defined as **Action Groups** — you write an OpenAPI schema describing the operations available (such as querying a database, placing an order, or checking inventory), back each operation with a Lambda function, and Bedrock handles the loop automatically. Agents can also query Knowledge Bases mid-task to retrieve relevant documents.

**Session management** maintains conversational context across multiple turns so users can have natural back-and-forth interactions. Agents support **memory** features that can persist facts about a user across sessions. For long-running tasks, you can use multi-agent collaboration where a supervisor agent orchestrates specialized sub-agents — one expert in product search, another in order management, for example.`,
    },
    {
      heading: "Model Customization: Fine-Tuning and Continued Pre-Training",
      body: `While base foundation models are general-purpose, some applications require domain-specific behavior or vocabulary that cannot be achieved through prompt engineering alone. Bedrock supports two customization approaches.

**Fine-tuning** (supervised fine-tuning) adjusts a model's weights using a labeled dataset of input-output pairs. You prepare a JSONL training file, upload it to S3, and submit a fine-tuning job specifying the base model, hyperparameters (epochs, learning rate, batch size), and optional validation data. Bedrock runs the job on managed GPU infrastructure, and the resulting **custom model** is stored privately in your account. Fine-tuning is ideal when you want the model to follow a specific format, adopt a particular tone, or learn task-specific patterns from examples.

**Continued pre-training** is an unsupervised approach where you expose the model to a large corpus of domain text (medical literature, legal documents, internal wikis) to deepen its familiarity with specialized vocabulary and concepts before fine-tuning or deployment. Both customization types produce private model variants that are not shared across accounts and are encrypted at rest in your account.`,
    },
    {
      heading: "Security, Governance, and Guardrails",
      body: `Bedrock is built with enterprise security requirements in mind. All API calls are authenticated via **AWS IAM**, and you can control access at the model level using IAM policies. Data in transit is encrypted with TLS, and data at rest (custom model weights, Knowledge Base contents) is encrypted with AWS-managed or customer-managed KMS keys. Bedrock does **not** use your prompts or completions to train its foundation models — your data remains private.

**Bedrock Guardrails** provides a content filtering and safety layer you configure independently of the underlying model. You define policies for denied topics (subjects the model should refuse to discuss), content filters (hate speech, violence, sexual content, prompt injection attacks), word filters, PII redaction, and grounding checks (detecting hallucinations). Guardrails can be applied at inference time to both input prompts and model outputs, and they work across all models in the catalog including your fine-tuned custom models. This is a key exam topic: Guardrails is how you implement **responsible AI** controls in a Bedrock application.`,
    },
  ],

  keyFacts: [
    "Fully managed — no GPU or ML infrastructure to manage",
    "Model catalog includes Anthropic Claude, Meta Llama, Mistral, Cohere, AI21, Amazon Titan/Nova",
    "Converse API provides a unified interface across all model providers",
    "Knowledge Bases implements managed RAG with automatic chunking, embedding, and vector storage",
    "Bedrock Agents uses ReAct loop to plan and execute multi-step tasks with Lambda-backed tools",
    "Fine-tuning and continued pre-training create private custom model variants",
    "Guardrails provides content filtering, topic denial, PII redaction, and grounding checks",
    "Does NOT use customer prompts or completions for model training",
    "Supports streaming responses for low-latency conversational applications",
    "Integrated with CloudWatch, CloudTrail, VPC endpoints, and KMS",
  ],

  relatedServices: [
    "Amazon OpenSearch Serverless",
    "AWS Lambda",
    "Amazon S3",
    "Amazon Kendra",
    "Amazon SageMaker",
    "AWS IAM",
  ],

  examTips: [
    "Guardrails is the Bedrock-native way to enforce responsible AI — know its policy types",
    "Knowledge Bases = managed RAG; no custom embedding pipeline code required",
    "Bedrock Agents automates multi-step tasks; Action Groups are backed by Lambda functions",
    "Converse API normalizes request/response schemas across different model providers",
    "Fine-tuning requires labeled JSONL data; continued pre-training uses unlabeled text corpora",
    "Customer data is NOT used to train foundation models — privacy by default",
    "Model IDs are provider-namespaced: anthropic.claude-*, amazon.titan-*, meta.llama3-*",
    "Use Provisioned Throughput to guarantee capacity for high-volume production workloads",
  ],
};
