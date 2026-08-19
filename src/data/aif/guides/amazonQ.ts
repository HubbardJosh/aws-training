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
    },
    {
      heading: "Data Sources and Indexing",
      body: `Q Business connects to your organizational content through **data source connectors**. AWS provides pre-built connectors for common enterprise systems: Amazon S3, Microsoft SharePoint, Atlassian Confluence, Salesforce, ServiceNow, Microsoft OneDrive, Google Drive, Zendesk, Box, Dropbox, GitHub, GitLab, Jira, Slack, and more. Each connector handles authentication, incremental synchronization, and content extraction for its specific platform.

Content is ingested into a **Q Business index**, which chunks documents, generates embeddings, and maintains a searchable vector store for semantic retrieval. The index is managed entirely by Q Business — you don't configure the underlying vector database or embedding model. You schedule index synchronization (hourly, daily, or on-demand) to keep content fresh.

**Document enrichment** allows you to customize how documents are processed during ingestion: you can add, remove, or alter document metadata, apply Lambda functions to transform document content, or filter which documents are indexed based on metadata attributes. This enables fine-grained control over what organizational content Q Business can access and how it is represented.`,
    },
    {
      heading: "Access Control and Permissions",
      body: `Enterprise AI assistants must respect the same access controls as the underlying content systems — an employee should not be able to query Q Business to access documents they wouldn't be able to access directly. Q Business implements this through **user-level access control** integrated with your identity provider.

Q Business integrates with **AWS IAM Identity Center** (formerly AWS SSO) for authentication and supports SAML 2.0 federation with identity providers like Okta, Azure AD, and Ping Identity. When an employee queries Q Business, the system retrieves only content that the authenticated user has permission to access in the source systems. This permission propagation means Q Business respects document-level ACLs from SharePoint, space-level permissions from Confluence, and object-level permissions from S3 — without any additional configuration per document.

**Admin controls** let administrators define blocked topics (subjects Q Business should refuse to discuss), restrict Q Business to only answer questions related to specific business functions, and configure which data sources are included in the index. This governance layer ensures Q Business stays on-topic for business use.`,
    },
    {
      heading: "Plugins and Actions",
      body: `Q Business extends beyond passive question-answering through **plugins** — integrations that allow Q Business to take actions in connected business systems on behalf of the user. Built-in plugins include Jira (create issues, update tickets), ServiceNow (create incidents, check ticket status), Salesforce (look up opportunities, create cases), PagerDuty (create incidents), and Zendesk (create tickets).

With plugins enabled, an employee can tell Q Business "Create a Jira ticket for the login page bug that Sara reported" and Q Business handles the entire interaction — extracting the relevant information from conversation context and creating the ticket through the Jira API, without the employee ever leaving the Q Business chat interface. This transforms Q Business from a read-only knowledge assistant into an active productivity tool.

**Custom plugins** allow you to extend Q Business with your own internal systems by defining an OpenAPI schema for your application's API. Q Business learns which operations are available, when to invoke them based on user intent, and how to pass parameters — analogous to Bedrock Agents' Action Groups but configured within the Q Business product rather than requiring custom development.`,
    },
    {
      heading: "Deployment and Customization",
      body: `Q Business applications are deployed through the **Q Business console** or API. You create a Q Business application, configure your identity provider, add data sources, set up plugins, and configure admin controls. Q Business provides a built-in **web experience** — a ready-to-use chat interface that you can deploy to employees immediately, customizable with your company name and branding. Alternatively, you can embed Q Business into existing applications using the Q Business API.

**Q Apps** (formerly Amazon Q Quick Apps) allows non-technical employees to create lightweight no-code applications powered by Q Business. An employee might build a Q App that standardizes how the team documents meeting outcomes, generates weekly status report drafts, or creates proposal templates — all grounded in the organizational content indexed by Q Business.

Pricing is based on the number of subscribed users per month, with two tiers: **Q Business Lite** for search and basic Q&A, and **Q Business Pro** for full generative capabilities, plugins, and Q Apps. This subscription model makes cost predictable for enterprise deployments compared to per-token pricing.`,
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
};
