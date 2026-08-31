import { ServiceGuide } from "../../../types/guide";

export const bedrockGuide: ServiceGuide = {
  id: "aif-bedrock",
  service: "Amazon Bedrock",
  domain: "development",
  tagline:
    "Fully managed access to foundation models for generative AI applications",
  intro:
    "Amazon Bedrock is a fully managed service that provides access to high-performing foundation models (FMs) from leading AI companies through a single API, enabling you to build and scale generative AI applications without managing any infrastructure.",

  sections: [
    {
      heading: "What Amazon Bedrock Is",
      body: `Amazon Bedrock sits at the center of AWS's generative AI strategy. Rather than forcing you to train your own large language models from scratch — an endeavor that requires massive compute clusters, petabytes of data, and months of time — Bedrock gives you immediate API access to a curated catalog of **foundation models** built by companies such as Anthropic (Claude), Meta (Llama), Mistral AI, Cohere, AI21 Labs, and Amazon itself (Titan and Nova families). These models are already trained on enormous corpora of text, code, and imagery, so they arrive with broad capabilities out of the box.

The service is fully serverless. You don't provision EC2 instances, manage GPU clusters, or worry about model serving infrastructure. You make an API call, Bedrock routes your request to the appropriate model endpoint, and you receive a response. This abstraction means your team can focus on the application layer — prompt design, retrieval pipelines, output validation — rather than ML infrastructure.`,
      quiz: [
        {
          question:
            "Which of the following foundation model providers is available in the Amazon Bedrock model catalog?",
          options: [
            "Anthropic (Claude)",
            "OpenAI (GPT-4)",
            "Google (Gemini)",
            "Hugging Face (Mistral only)",
          ],
          correctIndex: 0,
          explanation:
            "Amazon Bedrock includes models from Anthropic (Claude), Meta (Llama), Mistral AI, Cohere, AI21 Labs, and Amazon (Titan and Nova). OpenAI GPT and Google Gemini are not available through Bedrock. Mistral AI models are available directly (not only through Hugging Face).",
        },
        {
          question:
            "What infrastructure does a developer need to provision to use Amazon Bedrock for inference?",
          options: [
            "EC2 GPU instances with CUDA drivers installed",
            "No infrastructure — Bedrock is fully serverless",
            "A SageMaker endpoint with a selected instance type",
            "An ECS cluster with model-serving containers",
          ],
          correctIndex: 1,
          explanation:
            "Bedrock is fully serverless — you make API calls and Bedrock handles all model-serving infrastructure. No EC2 instances, GPU clusters, ECS clusters, or SageMaker endpoints need to be provisioned. This is a core value proposition distinguishing Bedrock from self-managed model serving.",
        },
        {
          question:
            "What is the Amazon Nova model family in the context of Amazon Bedrock?",
          options: [
            "A fine-tuning service for custom model training",
            "A specialized embedding model for vector search",
            "Amazon's own family of foundation models available in Bedrock",
            "A third-party model provider integrated into Bedrock",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Nova (along with Amazon Titan) is Amazon's own family of foundation models available through Bedrock. Third-party providers in Bedrock include Anthropic, Meta, Mistral, Cohere, and AI21 Labs. Nova is not an embedding-only model or a fine-tuning service.",
        },
      ],
    },
    {
      heading: "Foundation Model Catalog and Invocation",
      body: `Bedrock's model catalog is accessed through the **InvokeModel** and **InvokeModelWithResponseStream** APIs. Each model has a unique **model ID** (for example, \`anthropic.claude-3-5-sonnet-20241022-v2:0\`) and a request/response schema specific to that model provider. The **Converse API** offers a unified interface that normalizes input and output formats across providers, making it easier to swap models without rewriting application code.

\`\`\`typescript
import { BedrockRuntimeClient, ConverseCommand } from "@aws-sdk/client-bedrock-runtime";

const bedrock = new BedrockRuntimeClient({ region: "us-east-1" });

const response = await bedrock.send(new ConverseCommand({
  modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
  messages: [{ role: "user", content: [{ text: "Summarize the key benefits of Amazon S3." }] }],
  inferenceConfig: { maxTokens: 512, temperature: 0.5, topP: 0.9 },
}));

const reply = response.output?.message?.content?.[0]?.text;
\`\`\`

**Streaming responses** are critical for conversational applications: instead of waiting for the full response to generate before returning anything, the model streams tokens as they are produced, dramatically reducing perceived latency. Bedrock supports streaming natively via the \`InvokeModelWithResponseStream\` call or through the Converse API's streaming variant.

You control model behavior through **inference parameters** such as \`temperature\` (randomness), \`top_p\` (nucleus sampling), \`top_k\` (vocabulary restriction), and \`maxTokens\` (output length cap). Different providers expose different subsets of these parameters, so the Converse API helps abstract away provider-specific naming.`,
      quiz: [
        {
          question:
            "What is the key benefit of using the Bedrock Converse API instead of the InvokeModel API directly?",
          options: [
            "The Converse API is faster and has lower latency than InvokeModel",
            "The Converse API is required for streaming responses",
            "The Converse API supports more models than InvokeModel",
            "The Converse API normalizes input and output formats across providers, making it easier to swap models",
          ],
          correctIndex: 3,
          explanation:
            "The Converse API provides a unified interface that normalizes request and response schemas across all model providers, so you can swap models (e.g., from Claude to Llama) without rewriting application code. InvokeModel uses provider-specific schemas. Both support streaming, and latency is determined by the model, not the API.",
        },
        {
          question:
            "Which inference parameter controls the randomness of Bedrock model responses — where a value of 0 makes the model deterministic?",
          options: ["maxTokens", "temperature", "top_k", "top_p"],
          correctIndex: 1,
          explanation:
            "Temperature controls randomness in generation. Temperature = 0 makes the model always choose the highest-probability token (deterministic). Higher temperatures produce more random, creative output. top_p controls nucleus sampling, top_k restricts vocabulary size, and maxTokens caps output length.",
        },
        {
          question:
            "Why are streaming responses important for conversational AI applications built on Amazon Bedrock?",
          options: [
            "Streaming allows the model to use a larger context window",
            "Streaming reduces the cost per token compared to non-streaming calls",
            "Streaming is required for Bedrock Guardrails to function",
            "Streaming returns tokens as they are generated, dramatically reducing perceived latency",
          ],
          correctIndex: 3,
          explanation:
            "Streaming responses return tokens to the application as they are generated rather than waiting for the full response. This dramatically reduces perceived latency in conversational UIs because users see text appearing immediately. Streaming does not reduce cost, expand context windows, or enable Guardrails.",
        },
      ],
    },
    {
      heading: "Knowledge Bases and Retrieval-Augmented Generation",
      body: `One of Bedrock's most powerful features is **Knowledge Bases**, which implements Retrieval-Augmented Generation (RAG) as a managed service. RAG addresses a fundamental limitation of foundation models: their knowledge is frozen at training time and they cannot access your proprietary, real-time, or domain-specific information. Knowledge Bases solves this by letting you connect Bedrock to your own document repositories.

The workflow is: you point a Knowledge Base at an S3 bucket containing your documents (PDFs, Word files, HTML, CSV, and more). Bedrock's managed data ingestion pipeline chunks the documents, generates **vector embeddings** using a selected embedding model (Amazon Titan Embeddings or Cohere Embed), and stores those embeddings in a connected **vector store** — Amazon OpenSearch Serverless, Aurora with the pgvector extension, Pinecone, Redis Enterprise Cloud, or MongoDB Atlas. At query time, the user's question is embedded and compared against the stored vectors; the most semantically similar chunks are retrieved and injected into the model's prompt as context, allowing the model to answer questions grounded in your data.

This pattern dramatically reduces hallucination risk on domain-specific questions and eliminates the need to fine-tune a model just to inject new knowledge.`,
      quiz: [
        {
          question:
            "What problem does Bedrock Knowledge Bases (RAG) solve that fine-tuning does not address well?",
          options: [
            "Enabling multi-step task completion with tools",
            "Teaching a model a specific output format or style",
            "Reducing the cost of model inference",
            "Providing access to current, proprietary, or domain-specific knowledge not in the model's training data",
          ],
          correctIndex: 3,
          explanation:
            "RAG via Knowledge Bases provides the model access to current, private, or domain-specific documents at query time — addressing the frozen-knowledge limitation of foundation models. Fine-tuning is better for teaching format, style, or behavior. RAG doesn't directly reduce inference cost or enable multi-step task completion (that's Agents).",
        },
        {
          question:
            "Which vector store options can Amazon Bedrock Knowledge Bases use to store document embeddings?",
          options: [
            "Amazon OpenSearch Serverless, Aurora pgvector, Pinecone, Redis Enterprise Cloud, MongoDB Atlas",
            "Only Amazon OpenSearch Serverless",
            "Only Amazon DynamoDB and S3",
            "Any relational database that supports JSON storage",
          ],
          correctIndex: 0,
          explanation:
            "Bedrock Knowledge Bases supports multiple vector store backends: Amazon OpenSearch Serverless, Aurora with the pgvector extension, Pinecone, Redis Enterprise Cloud, and MongoDB Atlas. It does not use DynamoDB or standard S3 as vector stores, and standard relational databases (without vector extensions) are not supported.",
        },
        {
          question:
            "In a Bedrock Knowledge Base RAG workflow, what happens at query time?",
          options: [
            "The entire document corpus is sent to the model as context",
            "The user's question is embedded, compared against stored vectors, and the most semantically similar document chunks are retrieved and injected into the model's prompt",
            "The model searches S3 directly using keyword matching",
            "A Lambda function retrieves the document and summarizes it before passing to the model",
          ],
          correctIndex: 1,
          explanation:
            "At query time, the user's question is converted to a vector embedding, then compared against stored document embeddings to find semantically similar chunks. Those chunks are injected into the model's prompt as context. The entire corpus is never sent (too large), S3 keyword search is not used, and no Lambda summarization step is required by default.",
        },
      ],
    },
    {
      heading: "Agents for Bedrock",
      body: `**Bedrock Agents** extends foundation models from passive text generators into active systems that can reason, plan, and take actions. An Agent receives a natural language goal from a user and uses a **ReAct** (Reasoning + Acting) loop to break the goal into steps, decide which tools to call, call them, observe results, and iterate until the task is complete.

Tools are defined as **Action Groups** — you write an OpenAPI schema describing the operations available (such as querying a database, placing an order, or checking inventory), back each operation with a Lambda function, and Bedrock handles the loop automatically. Agents can also query Knowledge Bases mid-task to retrieve relevant documents.

**Session management** maintains conversational context across multiple turns so users can have natural back-and-forth interactions. Agents support **memory** features that can persist facts about a user across sessions. For long-running tasks, you can use multi-agent collaboration where a supervisor agent orchestrates specialized sub-agents — one expert in product search, another in order management, for example.`,
      quiz: [
        {
          question: "What is the ReAct loop in the context of Bedrock Agents?",
          options: [
            "A method for fine-tuning agents on historical conversation data",
            "A safety mechanism that reviews agent actions before execution",
            "A real-time event streaming protocol for agent responses",
            "A Reasoning + Acting loop where the agent plans steps, calls tools, observes results, and iterates",
          ],
          correctIndex: 3,
          explanation:
            "ReAct (Reasoning + Acting) is the loop pattern used by Bedrock Agents: the agent reasons about the goal, decides which tool (Action Group) to call, executes it, observes the result, and iterates until the task is complete. It is not a streaming protocol, safety review mechanism, or fine-tuning approach.",
        },
        {
          question:
            "How are tools (operations) made available to a Bedrock Agent?",
          options: [
            "By connecting the agent to a Bedrock Knowledge Base only",
            "By listing allowed tools in the Bedrock Guardrails configuration",
            "By writing an OpenAPI schema for the operations and backing each with a Lambda function in an Action Group",
            "By configuring IAM permissions for the agent role",
          ],
          correctIndex: 2,
          explanation:
            "Action Groups define available tools for a Bedrock Agent: you write an OpenAPI schema describing the operations, and each operation is backed by a Lambda function. Bedrock manages the agent loop automatically. IAM permissions control access but don't define tools. Knowledge Bases provide document retrieval, not action execution. Guardrails handles safety, not tool definitions.",
        },
        {
          question:
            "A company wants to build an agent that handles complex customer requests requiring product search AND order management, with specialists for each domain. Which Bedrock feature supports this?",
          options: [
            "Multi-agent collaboration with a supervisor agent orchestrating specialized sub-agents",
            "Bedrock Guardrails with custom topic policies",
            "Knowledge Bases with multiple data sources",
            "A single agent with multiple Action Groups",
          ],
          correctIndex: 0,
          explanation:
            "Multi-agent collaboration allows a supervisor agent to orchestrate specialized sub-agents (e.g., one for product search, one for order management), enabling complex tasks to be decomposed across domain experts. A single agent with multiple Action Groups could work but is less scalable. Knowledge Bases are for document retrieval, not task orchestration. Guardrails handles safety.",
        },
      ],
    },
    {
      heading: "Model Customization: Fine-Tuning and Continued Pre-Training",
      body: `While base foundation models are general-purpose, some applications require domain-specific behavior or vocabulary that cannot be achieved through prompt engineering alone. Bedrock supports two customization approaches.

**Fine-tuning** (supervised fine-tuning) adjusts a model's weights using a labeled dataset of input-output pairs. You prepare a JSONL training file, upload it to S3, and submit a fine-tuning job specifying the base model, hyperparameters (epochs, learning rate, batch size), and optional validation data. Bedrock runs the job on managed GPU infrastructure, and the resulting **custom model** is stored privately in your account. Fine-tuning is ideal when you want the model to follow a specific format, adopt a particular tone, or learn task-specific patterns from examples.

**Continued pre-training** is an unsupervised approach where you expose the model to a large corpus of domain text (medical literature, legal documents, internal wikis) to deepen its familiarity with specialized vocabulary and concepts before fine-tuning or deployment. Both customization types produce private model variants that are not shared across accounts and are encrypted at rest in your account.`,
      quiz: [
        {
          question:
            "Which Bedrock customization approach uses labeled input-output pairs to teach a model a specific format, tone, or task pattern?",
          options: [
            "Retrieval-Augmented Generation",
            "Continued pre-training",
            "Prompt engineering",
            "Fine-tuning (supervised fine-tuning)",
          ],
          correctIndex: 3,
          explanation:
            "Fine-tuning uses labeled JSONL training data (input-output pairs) to adjust model weights for specific formats, tones, or task patterns. Continued pre-training uses unlabeled domain text. RAG provides knowledge via retrieval without changing weights. Prompt engineering changes inputs, not the model itself.",
        },
        {
          question:
            "What is the primary use case for continued pre-training in Amazon Bedrock?",
          options: [
            "Reducing the model's response latency through weight compression",
            "Adding new tool-use capabilities to the model",
            "Teaching the model a specific output format using labeled examples",
            "Exposing the model to large domain-specific text corpora to deepen vocabulary and concept familiarity",
          ],
          correctIndex: 3,
          explanation:
            "Continued pre-training is an unsupervised technique that deepens a model's familiarity with specialized vocabulary and domain concepts (e.g., medical literature, legal texts) without labeled data. It differs from fine-tuning, which uses labeled pairs for specific tasks. It does not compress weights or add tool capabilities.",
        },
        {
          question:
            "What happens to fine-tuned custom models created in Amazon Bedrock from a privacy perspective?",
          options: [
            "They must be deleted after 90 days due to storage constraints",
            "They are stored in a shared model registry accessible to other AWS accounts",
            "They are stored privately in the customer's account, encrypted at rest, and not shared across accounts",
            "They are uploaded to AWS and used to improve foundation models for all users",
          ],
          correctIndex: 2,
          explanation:
            "Custom models created through Bedrock fine-tuning or continued pre-training are stored privately in the customer's own account, encrypted at rest with KMS, and never shared across accounts or used to train foundation models. This is Bedrock's privacy-by-default guarantee for customer data and customizations.",
        },
      ],
    },
    {
      heading: "Security, Governance, and Guardrails",
      body: `Bedrock is built with enterprise security requirements in mind. All API calls are authenticated via **AWS IAM**, and you can control access at the model level using IAM policies. Data in transit is encrypted with TLS, and data at rest (custom model weights, Knowledge Base contents) is encrypted with AWS-managed or customer-managed KMS keys. Bedrock does **not** use your prompts or completions to train its foundation models — your data remains private.

**Bedrock Guardrails** provides a content filtering and safety layer you configure independently of the underlying model. You define policies for denied topics (subjects the model should refuse to discuss), content filters (hate speech, violence, sexual content, prompt injection attacks), word filters, PII redaction, and grounding checks (detecting hallucinations). Guardrails can be applied at inference time to both input prompts and model outputs, and they work across all models in the catalog including your fine-tuned custom models. This is a key exam topic: Guardrails is how you implement **responsible AI** controls in a Bedrock application.`,
      quiz: [
        {
          question:
            "Does Amazon Bedrock use customer prompts or completions to train its foundation models?",
          options: [
            "Only prompts from the free tier are used for training",
            "Yes, all prompts are used to improve models unless the customer opts out",
            "Yes, but only anonymous aggregate data is used",
            "No — customer data is never used to train foundation models",
          ],
          correctIndex: 3,
          explanation:
            "Amazon Bedrock explicitly does not use customer prompts or completions to train foundation models. Customer data remains private by default. This is a key privacy guarantee and a frequent exam topic — there is no opt-out needed because data is never used for training.",
        },
        {
          question:
            "Which Bedrock Guardrails feature detects when model responses include claims not supported by the retrieved context documents?",
          options: [
            "PII redaction",
            "Grounding checks",
            "Denied topics policy",
            "Content filters",
          ],
          correctIndex: 1,
          explanation:
            "Grounding checks in Bedrock Guardrails evaluate whether model responses are supported by the provided context (e.g., retrieved RAG documents), flagging or blocking responses that include ungrounded claims — i.e., hallucinations. Denied topics restrict subjects. Content filters block harmful content. PII redaction removes personal information.",
        },
        {
          question:
            "Bedrock Guardrails is configured independently of the underlying foundation model. What does this mean in practice?",
          options: [
            "Guardrails must be retrained whenever the underlying model changes",
            "Guardrails only works with Amazon's Titan and Nova models",
            "The same Guardrails configuration can be applied across all models in the catalog, including fine-tuned custom models",
            "Guardrails configuration is tied to a specific model version and cannot be reused",
          ],
          correctIndex: 2,
          explanation:
            "Bedrock Guardrails is model-agnostic — you configure it once and apply it to any model in the Bedrock catalog, including third-party models (Claude, Llama, Mistral) and your own fine-tuned custom models. It does not need to be retrained and is not tied to a specific model or version.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A developer wants to build a customer support chatbot that answers questions about internal policies stored in PDF documents in S3, without managing any ML infrastructure. Which Bedrock feature is most appropriate?",
      options: [
        "Bedrock Knowledge Bases with RAG",
        "Bedrock Agents with custom Action Groups",
        "Continued pre-training on policy documents",
        "Fine-tuning a foundation model on policy documents",
      ],
      correctIndex: 0,
      explanation:
        "Bedrock Knowledge Bases implements RAG as a managed service — it ingests S3 documents, generates embeddings, and retrieves relevant chunks at query time, enabling the model to answer questions grounded in your documents without managing any infrastructure. Fine-tuning changes model behavior/format, not knowledge. Agents are for multi-step task completion. Continued pre-training adds domain vocabulary, not specific document retrieval.",
    },
    {
      question:
        "What is the correct data format for a Bedrock fine-tuning training file?",
      options: ["CSV with headers", "XML", "Parquet", "JSONL (JSON Lines)"],
      correctIndex: 3,
      explanation:
        "Bedrock fine-tuning requires a JSONL (JSON Lines) training file containing input-output pairs, uploaded to S3 before submitting the fine-tuning job. CSV, Parquet, and XML are not the required formats for Bedrock fine-tuning.",
    },
    {
      question:
        "A company needs to prevent their Bedrock-powered application from discussing competitor products and from generating harmful content. Which feature addresses both concerns in a single configuration?",
      options: [
        "IAM policies restricting model access",
        "A custom system prompt with restrictions",
        "Bedrock Guardrails with denied topics and content filters",
        "Bedrock Agents with validation Action Groups",
      ],
      correctIndex: 2,
      explanation:
        "Bedrock Guardrails allows you to define denied topics (e.g., competitor products) and content filters (hate speech, violence, harmful content) in a single configuration applied across models. IAM controls access but doesn't filter content. System prompts can be bypassed through prompt injection. Agents with validation steps require custom development and don't provide the same managed guarantees.",
    },
    {
      question:
        "Which Bedrock feature allows a model to autonomously place an order on behalf of a user by calling your order management API?",
      options: [
        "The Converse API with tool definitions",
        "Bedrock Agents with Action Groups",
        "Bedrock Knowledge Bases",
        "Bedrock Guardrails Action Groups",
      ],
      correctIndex: 1,
      explanation:
        "Bedrock Agents with Action Groups enables autonomous task completion — the agent uses a ReAct loop to call your Lambda-backed API operations (like placing an order). Knowledge Bases provide document retrieval. Guardrails enforce safety policies. The Converse API supports tool definitions but does not orchestrate autonomous multi-step reasoning loops like Agents does.",
    },
    {
      question:
        "What is the difference between fine-tuning and continued pre-training in Amazon Bedrock?",
      options: [
        "They are the same process with different names in Bedrock",
        "Fine-tuning is unsupervised; continued pre-training is supervised",
        "Fine-tuning creates shared models; continued pre-training creates private models",
        "Fine-tuning uses labeled input-output pairs to adjust model behavior; continued pre-training uses unlabeled domain text to deepen domain familiarity",
      ],
      correctIndex: 3,
      explanation:
        "Fine-tuning (supervised) uses labeled JSONL input-output pairs to teach specific behaviors, formats, or task patterns. Continued pre-training (unsupervised) uses large unlabeled text corpora to deepen the model's domain vocabulary and concept understanding before deployment or fine-tuning. Both produce private custom models in the customer's account.",
    },
    {
      question:
        "A company switches from Claude to Llama for cost reasons and wants to minimize code changes. Which Bedrock API makes this easiest?",
      options: [
        "The Bedrock Batch Inference API",
        "The StartModelInvocationJob API",
        "The Converse API, which normalizes input/output formats across providers",
        "InvokeModel API with provider-specific schemas",
      ],
      correctIndex: 2,
      explanation:
        "The Converse API provides a unified, normalized interface across all Bedrock model providers, so switching from Claude to Llama requires only changing the model ID, not the request/response handling code. InvokeModel requires provider-specific schemas that differ across providers. Batch inference and StartModelInvocationJob are for asynchronous batch workloads.",
    },
    {
      question:
        "Which vector store is a native AWS managed service option for Bedrock Knowledge Bases?",
      options: [
        "Amazon DynamoDB",
        "Amazon ElastiCache",
        "Amazon Redshift",
        "Amazon Aurora with pgvector",
      ],
      correctIndex: 3,
      explanation:
        "Amazon Aurora with the pgvector extension is one of the supported vector store options for Bedrock Knowledge Bases. Amazon OpenSearch Serverless is also a native AWS option. DynamoDB, ElastiCache, and Redshift are not supported as Bedrock Knowledge Base vector stores.",
    },
    {
      question:
        "What does the grounding check feature in Bedrock Guardrails detect?",
      options: [
        "Whether the user's input contains prompt injection attempts",
        "Whether the model's response includes claims not supported by the provided context documents",
        "Whether the model is using too many tokens in its response",
        "Whether the content violates hate speech policies",
      ],
      correctIndex: 1,
      explanation:
        "Grounding checks evaluate whether the model's response is supported by the retrieved context documents, flagging or blocking ungrounded claims (hallucinations). Prompt injection detection is a separate Guardrails feature. Token counting is an inference concern, not a Guardrails policy. Hate speech is handled by content filters.",
    },
  ],
};
