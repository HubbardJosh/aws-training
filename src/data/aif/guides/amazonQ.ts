import { ServiceGuide } from "../../../types/guide";

export const amazonQGuide: ServiceGuide = {
  id: "aif-amazon-q-business",
  service: "Amazon Q Business",
  domain: "development",
  tagline:
    "Generative AI-powered assistant for enterprise knowledge and productivity",
  intro:
    "Amazon Q Business is a fully managed generative AI assistant that connects to your organization's data sources, documents, and applications to answer questions, generate content, and automate tasks — without requiring ML expertise to deploy.",

  sections: [
    {
      heading: "What Amazon Q Business Is",
      body: `Amazon Q Business is AWS's enterprise generative AI assistant, purpose-built for workplace productivity. Unlike general-purpose AI chatbots that rely solely on pre-training knowledge, Q Business connects to your organization's actual content — documents stored in S3, SharePoint sites, Confluence wikis, Salesforce records, ServiceNow tickets, Google Drive files, and dozens of other data sources — and answers employee questions grounded in that real organizational knowledge.

The core value proposition is eliminating the "who knows about X?" problem in large organizations. Instead of searching through intranet wikis, emailing colleagues, or spending hours locating the right document, employees ask Q Business in natural language and receive a cited, accurate answer drawn from the actual authoritative source. Q Business is distinct from Amazon Q Developer (the coding assistant) and Amazon Bedrock (the foundation model platform) — it is specifically aimed at knowledge worker productivity rather than software development or custom AI development.`,
      quiz: [
        {
          question:
            "What is the primary purpose of Amazon Q Business, and how does it differ from Amazon Q Developer?",
          options: [
            "Q Business is a foundation model platform; Q Developer answers employee questions",
            "Q Business is for software development assistance; Q Developer is for enterprise knowledge management",
            "Q Business is for enterprise knowledge worker productivity; Q Developer is a coding assistant",
            "Q Business and Q Developer are two names for the same service",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Q Business is purpose-built for workplace productivity — answering employee questions grounded in organizational content. Amazon Q Developer is the coding assistant for software developers. Amazon Bedrock is the foundation model platform. These are distinct services with different use cases.",
        },
        {
          question:
            "Unlike general-purpose AI chatbots, what is the key differentiator of Amazon Q Business?",
          options: [
            "It is available at no cost to AWS customers",
            "It can generate images and audio in addition to text",
            "It uses a larger language model than competitors",
            "It answers questions grounded in your organization's actual content from connected data sources",
          ],
          correctIndex: 3,
          explanation:
            "Q Business connects to your organization's real content (documents, wikis, tickets, etc.) and grounds its answers in that actual data, providing cited, authoritative answers rather than relying solely on pre-training knowledge. This is its core differentiator from general-purpose chatbots.",
        },
        {
          question:
            "Which of the following data sources does Amazon Q Business support through pre-built connectors?",
          options: [
            "Only structured databases like RDS and Redshift",
            "Only Amazon S3 and on-premises file shares",
            "Only AWS-native data sources like S3 and DynamoDB",
            "S3, SharePoint, Confluence, Salesforce, ServiceNow, Google Drive, Slack, and more",
          ],
          correctIndex: 3,
          explanation:
            "Amazon Q Business provides pre-built connectors for a wide range of enterprise systems including Amazon S3, Microsoft SharePoint, Atlassian Confluence, Salesforce, ServiceNow, Google Drive, Slack, Jira, Box, Dropbox, and many more — not limited to AWS-native or structured sources.",
        },
      ],
    },
    {
      heading: "Data Sources and Indexing",
      body: `Q Business connects to your organizational content through **data source connectors**. AWS provides pre-built connectors for common enterprise systems: Amazon S3, Microsoft SharePoint, Atlassian Confluence, Salesforce, ServiceNow, Microsoft OneDrive, Google Drive, Zendesk, Box, Dropbox, GitHub, GitLab, Jira, Slack, and more. Each connector handles authentication, incremental synchronization, and content extraction for its specific platform.

Content is ingested into a **Q Business index**, which chunks documents, generates embeddings, and maintains a searchable vector store for semantic retrieval. The index is managed entirely by Q Business — you don't configure the underlying vector database or embedding model. You schedule index synchronization (hourly, daily, or on-demand) to keep content fresh.

**Document enrichment** allows you to customize how documents are processed during ingestion: you can add, remove, or alter document metadata, apply Lambda functions to transform document content, or filter which documents are indexed based on metadata attributes. This enables fine-grained control over what organizational content Q Business can access and how it is represented.`,
      quiz: [
        {
          question:
            "What does the Q Business index manage automatically without requiring user configuration?",
          options: [
            "Document chunking, embedding generation, and the underlying vector store",
            "Plugin integrations with third-party systems",
            "User authentication with identity providers",
            "IAM permissions for each document",
          ],
          correctIndex: 0,
          explanation:
            "The Q Business index handles document chunking, embedding generation, and vector store management entirely as a managed service — you do not configure the underlying vector database or select the embedding model. IAM permissions, identity provider integration, and plugins are configured separately.",
        },
        {
          question:
            "A company wants to apply a custom Lambda function to transform and redact document content before it is indexed by Q Business. Which feature enables this?",
          options: [
            "Q Apps",
            "Document enrichment",
            "Blocked topics configuration",
            "IAM Identity Center integration",
          ],
          correctIndex: 1,
          explanation:
            "Document enrichment allows you to apply Lambda functions to transform document content and metadata during ingestion, as well as add, remove, or filter documents. Q Apps are for non-technical users to build no-code tools. Blocked topics restrict what Q Business discusses. IAM Identity Center handles authentication.",
        },
        {
          question:
            "How does Q Business keep its index current with changes in connected data sources?",
          options: [
            "Users must manually re-sync when documents change",
            "The index is rebuilt from scratch daily at midnight",
            "Scheduled incremental synchronization (hourly, daily, or on-demand) via data source connectors",
            "Q Business monitors source systems in real time via webhooks only",
          ],
          correctIndex: 2,
          explanation:
            "Data source connectors handle incremental synchronization on a configurable schedule (hourly, daily, or on-demand), picking up changes in source systems without re-indexing all content from scratch. Manual re-sync and midnight rebuilds are not the standard mechanism.",
        },
      ],
    },
    {
      heading: "Access Control and Permissions",
      body: `Enterprise AI assistants must respect the same access controls as the underlying content systems — an employee should not be able to query Q Business to access documents they wouldn't be able to access directly. Q Business implements this through **user-level access control** integrated with your identity provider.

Q Business integrates with **AWS IAM Identity Center** (formerly AWS SSO) for authentication and supports SAML 2.0 federation with identity providers like Okta, Azure AD, and Ping Identity. When an employee queries Q Business, the system retrieves only content that the authenticated user has permission to access in the source systems. This permission propagation means Q Business respects document-level ACLs from SharePoint, space-level permissions from Confluence, and object-level permissions from S3 — without any additional configuration per document.

**Admin controls** let administrators define blocked topics (subjects Q Business should refuse to discuss), restrict Q Business to only answer questions related to specific business functions, and configure which data sources are included in the index. This governance layer ensures Q Business stays on-topic for business use.`,
      quiz: [
        {
          question:
            "How does Amazon Q Business ensure that employees cannot access documents they are not authorized to see?",
          options: [
            "By integrating with AWS IAM Identity Center and propagating source system ACLs to retrieval results",
            "By creating separate Q Business applications for each team",
            "By requiring administrators to manually whitelist documents for each user",
            "By encrypting all documents with user-specific keys",
          ],
          correctIndex: 0,
          explanation:
            "Q Business integrates with AWS IAM Identity Center (and SAML 2.0 identity providers) to authenticate users, then propagates document-level ACLs from source systems (SharePoint, Confluence, S3, etc.) at query time — retrieving only content the authenticated user is permitted to access. No per-document manual configuration is needed.",
        },
        {
          question:
            "An administrator wants to prevent Q Business from answering questions about competitor pricing or legal disputes. Which admin control achieves this?",
          options: [
            "Document enrichment with metadata filtering",
            "Custom plugin definition",
            "IAM Identity Center group policies",
            "Blocked topics configuration",
          ],
          correctIndex: 3,
          explanation:
            "Blocked topics let administrators define subjects that Q Business should refuse to discuss, keeping the assistant on-topic for appropriate business use. Document enrichment modifies indexing behavior. Custom plugins add action capabilities. IAM Identity Center manages authentication, not topic restrictions.",
        },
        {
          question:
            "Which identity federation standard does Amazon Q Business support for integration with external identity providers like Okta and Azure AD?",
          options: ["Kerberos", "OAuth 2.0 only", "LDAP only", "SAML 2.0"],
          correctIndex: 3,
          explanation:
            "Q Business supports SAML 2.0 federation for integration with enterprise identity providers like Okta, Azure AD, and Ping Identity, in addition to native AWS IAM Identity Center integration. This enables employees to use existing corporate credentials to authenticate.",
        },
      ],
    },
    {
      heading: "Plugins and Actions",
      body: `Q Business extends beyond passive question-answering through **plugins** — integrations that allow Q Business to take actions in connected business systems on behalf of the user. Built-in plugins include Jira (create issues, update tickets), ServiceNow (create incidents, check ticket status), Salesforce (look up opportunities, create cases), PagerDuty (create incidents), and Zendesk (create tickets).

With plugins enabled, an employee can tell Q Business "Create a Jira ticket for the login page bug that Sara reported" and Q Business handles the entire interaction — extracting the relevant information from conversation context and creating the ticket through the Jira API, without the employee ever leaving the Q Business chat interface. This transforms Q Business from a read-only knowledge assistant into an active productivity tool.

**Custom plugins** allow you to extend Q Business with your own internal systems by defining an OpenAPI schema for your application's API. Q Business learns which operations are available, when to invoke them based on user intent, and how to pass parameters — analogous to Bedrock Agents' Action Groups but configured within the Q Business product rather than requiring custom development.`,
      quiz: [
        {
          question:
            "What is the primary purpose of Q Business plugins, and how do they differ from data source connectors?",
          options: [
            "Plugins index documents; connectors take actions in external systems",
            "Plugins handle authentication; connectors handle content retrieval",
            "Plugins enable Q Business to take actions in external systems; connectors pull content for indexing",
            "Plugins and connectors are different names for the same functionality",
          ],
          correctIndex: 2,
          explanation:
            "Plugins enable Q Business to take actions in external business systems (create Jira tickets, open ServiceNow incidents, etc.), transforming it from a read-only assistant into an action-capable productivity tool. Data source connectors pull content from those same systems for indexing and retrieval. They serve opposite directions of data flow.",
        },
        {
          question:
            "A developer wants to integrate Q Business with an internal HR system using a custom integration. Which mechanism should they use?",
          options: [
            "A blocked topics configuration",
            "Document enrichment with Lambda",
            "A custom plugin defined using an OpenAPI schema",
            "A built-in connector for HR systems",
          ],
          correctIndex: 2,
          explanation:
            "Custom plugins allow you to extend Q Business to any internal system by defining an OpenAPI schema for the system's API. Q Business uses this schema to understand available operations and invoke them based on user intent. Built-in connectors exist only for common enterprise platforms. Document enrichment transforms ingested content, not outbound actions.",
        },
        {
          question:
            "Which statement best describes how Q Business plugins compare to Amazon Bedrock Agents' Action Groups?",
          options: [
            "They are identical services with different names",
            "Both enable LLM-driven actions but plugins are configured within Q Business as a product; Action Groups require custom Bedrock Agents development",
            "Action Groups are more powerful but require no coding; Q Business plugins require extensive development",
            "Q Business plugins only work with AWS services; Action Groups work with any API",
          ],
          correctIndex: 1,
          explanation:
            "Both Q Business plugins and Bedrock Agents' Action Groups enable LLM-driven actions via OpenAPI schemas, but they operate in different contexts. Q Business plugins are configured within the Q Business product for enterprise productivity. Bedrock Action Groups require custom Agents development and offer more architectural flexibility.",
        },
      ],
    },
    {
      heading: "Deployment and Customization",
      body: `Q Business applications are deployed through the **Q Business console** or API. You create a Q Business application, configure your identity provider, add data sources, set up plugins, and configure admin controls. Q Business provides a built-in **web experience** — a ready-to-use chat interface that you can deploy to employees immediately, customizable with your company name and branding. Alternatively, you can embed Q Business into existing applications using the Q Business API.

**Q Apps** (formerly Amazon Q Quick Apps) allows non-technical employees to create lightweight no-code applications powered by Q Business. An employee might build a Q App that standardizes how the team documents meeting outcomes, generates weekly status report drafts, or creates proposal templates — all grounded in the organizational content indexed by Q Business.

Pricing is based on the number of subscribed users per month, with two tiers: **Q Business Lite** for search and basic Q&A, and **Q Business Pro** for full generative capabilities, plugins, and Q Apps. This subscription model makes cost predictable for enterprise deployments compared to per-token pricing.`,
      quiz: [
        {
          question: "What is the purpose of Q Apps in Amazon Q Business?",
          options: [
            "Q Apps are the plugin framework for technical developers to build integrations",
            "Q Apps are pre-built connectors for third-party data sources",
            "Q Apps allow non-technical employees to create lightweight no-code applications powered by Q Business",
            "Q Apps are the billing management interface for Q Business subscriptions",
          ],
          correctIndex: 2,
          explanation:
            "Q Apps (formerly Amazon Q Quick Apps) enables non-technical employees to create lightweight no-code AI-powered applications grounded in Q Business content — for example, meeting documentation templates or status report generators. They are not connectors, billing tools, or a technical developer framework.",
        },
        {
          question:
            "How does Amazon Q Business pricing differ from typical generative AI services like Amazon Bedrock?",
          options: [
            "Q Business charges per API call; Bedrock charges per user per month",
            "Q Business charges per user per month (subscription); Bedrock charges per token consumed",
            "Both charge per token consumed with no user-based pricing",
            "Q Business is free; only Bedrock charges",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Q Business uses a subscription model — a monthly fee per subscribed user (Lite or Pro tier) — making costs predictable for enterprise deployments. Bedrock uses consumption-based pricing per token processed. This distinction matters for cost modeling when choosing between them.",
        },
        {
          question:
            "Which Q Business tier includes full generative AI capabilities, plugins, and Q Apps?",
          options: [
            "Q Business Pro",
            "Q Business Premium",
            "Q Business Lite",
            "Q Business Enterprise",
          ],
          correctIndex: 0,
          explanation:
            "Q Business Pro includes full generative AI capabilities, plugin integrations, and Q Apps. Q Business Lite covers search and basic Q&A at a lower price point. There are no Enterprise or Premium tiers — only Lite and Pro.",
        },
      ],
    },
  ],

  keyFacts: [
    "Enterprise AI assistant grounded in your organizational content — not just model training data",
    "Pre-built connectors: S3, SharePoint, Confluence, Salesforce, ServiceNow, Google Drive, Slack, and more",
    "Integrates with IAM Identity Center for user-level access control respecting source system permissions",
    "Plugins enable actions in Jira, ServiceNow, Salesforce — not just answering questions",
    "Blocked topics and admin controls govern what Q Business will discuss",
    "Q Apps lets non-technical users build lightweight no-code AI-powered apps",
    "Web experience is a ready-to-use branded chat interface deployable without coding",
    "Subscription pricing per user: Q Business Lite vs Q Business Pro tiers",
    "Distinct from Amazon Q Developer (coding assistant) and Amazon Bedrock (foundation model platform)",
    "Document enrichment with Lambda allows content transformation during ingestion",
  ],

  relatedServices: [
    "Amazon Kendra",
    "Amazon Bedrock",
    "AWS IAM Identity Center",
    "Amazon S3",
    "AWS Lambda",
  ],

  examTips: [
    "Q Business = enterprise knowledge assistant; Q Developer = coding assistant — know the distinction",
    "Q Business respects source system ACLs through IAM Identity Center integration",
    "Plugins let Q Business take actions — not just retrieve information",
    "Compare to Bedrock: Q Business is a finished product; Bedrock is a platform for building AI apps",
    "Data source connectors handle sync automatically — no custom ETL required",
    "Admin controls include blocked topics to keep Q Business on-topic for business use",
    "Q Apps enable non-technical users to create no-code generative AI tools",
  ],

  topicQuiz: [
    {
      question:
        "A company wants an AI assistant that answers employee questions grounded in internal documents stored in SharePoint and Confluence without requiring ML expertise to deploy. Which AWS service is the best fit?",
      options: [
        "Amazon Kendra with a custom LLM integration",
        "Amazon Bedrock with Knowledge Bases",
        "Amazon Q Business",
        "Amazon Q Developer",
      ],
      correctIndex: 2,
      explanation:
        "Amazon Q Business is specifically designed as a fully managed enterprise AI assistant that connects to organizational data sources (SharePoint, Confluence, and many others) and answers questions grounded in that content without requiring ML expertise. Bedrock Knowledge Bases requires building a custom application. Kendra requires additional LLM integration. Q Developer is for coding assistance.",
    },
    {
      question:
        "An employee asks Q Business to 'Create a Jira ticket for the authentication bug.' What Q Business feature makes this possible?",
      options: [
        "Blocked topics configuration",
        "Document enrichment",
        "A data source connector for Jira",
        "A Jira plugin that enables actions",
      ],
      correctIndex: 3,
      explanation:
        "Q Business plugins enable the assistant to take actions in external systems like Jira. A Jira plugin allows Q Business to create issues, update tickets, etc. Data source connectors pull content from Jira for indexing (read-only). Document enrichment modifies ingestion. Blocked topics restrict discussion topics.",
    },
    {
      question:
        "Why does Q Business require integration with AWS IAM Identity Center or a SAML 2.0 identity provider?",
      options: [
        "To enforce user-level access control so employees only see documents they are authorized to access",
        "To allow Q Business to index documents from AWS-native services",
        "To enable billing on a per-user basis",
        "To enable the web experience to be branded with company logos",
      ],
      correctIndex: 0,
      explanation:
        "Identity provider integration allows Q Business to authenticate each user and propagate their permissions to search results — employees only retrieve content they are authorized to access in the underlying source systems. This is the core enterprise security requirement. Per-user billing, indexing, and branding are separate features.",
    },
    {
      question:
        "A non-technical marketing manager wants to build a tool that generates weekly campaign status reports using the team's indexed project documents. Which Q Business feature should they use?",
      options: [
        "Document enrichment with AWS Lambda",
        "Q Apps for a no-code AI-powered application",
        "Blocked topics configuration",
        "A custom plugin with an OpenAPI schema",
      ],
      correctIndex: 1,
      explanation:
        "Q Apps allows non-technical users to create lightweight no-code applications grounded in Q Business content. This is ideal for the marketing manager's use case. Custom plugins require OpenAPI schema development. Document enrichment is for ingestion-time content transformation. Blocked topics restrict what Q Business discusses.",
    },
    {
      question:
        "How does Amazon Q Business differ from Amazon Bedrock when it comes to building AI-powered enterprise applications?",
      options: [
        "Q Business uses Bedrock internally and they are architecturally equivalent from the user's perspective",
        "Bedrock is a finished product; Q Business is a foundation model platform",
        "Both are foundation model platforms with different pricing",
        "Q Business is a finished product for knowledge workers; Bedrock is a platform for building custom AI applications",
      ],
      correctIndex: 3,
      explanation:
        "Amazon Q Business is a ready-to-deploy enterprise AI assistant (a finished product) requiring no ML expertise. Amazon Bedrock is a platform providing API access to foundation models for building custom AI applications. They serve different audiences and require different levels of technical involvement.",
    },
    {
      question:
        "A company indexes its Confluence wiki in Q Business. Two months later, a document is deleted in Confluence. How does Q Business handle this?",
      options: [
        "The document remains in the Q Business index permanently until manually removed",
        "Q Business requires a full re-index to detect deletions",
        "Q Business detects the deletion during the next scheduled incremental synchronization and removes it from the index",
        "Deleted documents are archived, not removed, from the Q Business index",
      ],
      correctIndex: 2,
      explanation:
        "Data source connectors perform incremental synchronization on a schedule, detecting changes including deletions in the source system and updating the Q Business index accordingly. Documents are removed when the connector detects they no longer exist in the source. No full re-index or manual intervention is needed for routine changes.",
    },
    {
      question:
        "Which Q Business pricing tier supports plugins and Q Apps in addition to basic search and Q&A?",
      options: [
        "Q Business Lite",
        "Q Business Enterprise",
        "Q Business Pro",
        "Q Business Developer",
      ],
      correctIndex: 2,
      explanation:
        "Q Business Pro includes full generative AI capabilities, plugins for taking actions in external systems, and Q Apps for no-code application building. Q Business Lite covers search and basic Q&A only. There are no Enterprise or Developer tiers for Q Business.",
    },
    {
      question: "What is the role of Document Enrichment in Amazon Q Business?",
      options: [
        "It translates documents into multiple languages for multilingual search",
        "It generates embeddings for documents before indexing",
        "It enables plugins to read document content at inference time",
        "It allows you to transform document content and metadata during ingestion using Lambda functions",
      ],
      correctIndex: 3,
      explanation:
        "Document enrichment allows you to customize ingestion by applying Lambda functions to transform or redact document content and metadata, add or remove metadata attributes, and filter which documents get indexed. Embedding generation is handled automatically by the Q Business index. Translation is a separate AWS service. Plugins handle actions, not document ingestion.",
    },
  ],
};
