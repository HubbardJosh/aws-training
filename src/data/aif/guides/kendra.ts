import { ServiceGuide } from "../../../types/guide";

export const kendraGuide: ServiceGuide = {
  id: "aif-kendra",
  service: "Amazon Kendra",
  domain: "development",
  tagline: "Intelligent enterprise search powered by machine learning",
  intro:
    "Amazon Kendra is a fully managed intelligent search service that uses machine learning to index and search across unstructured enterprise content, returning highly accurate answers rather than a list of document links.",

  sections: [
    {
      heading: "What Amazon Kendra Does",
      body: `Traditional enterprise search — keyword-based search over file shares, intranets, and document repositories — returns a list of documents ranked by keyword frequency. Employees must read through results to find the actual answer. Amazon Kendra takes a fundamentally different approach: it understands the natural language meaning of a query and returns a direct answer extracted from indexed documents, along with the source document for verification.

Kendra is designed for the enterprise search use case: customer service agents finding product information, employees searching internal wikis and HR policies, researchers navigating large document libraries, and developers searching technical documentation. It understands synonyms, acronyms, and domain-specific terminology, and it can answer questions phrased naturally ("What is the return policy for electronics?") rather than requiring keyword matching ("return policy electronics").`,
    },
    {
      heading: "Indexes, Data Sources, and Connectors",
      body: `The central concept in Kendra is an **Index** — the searchable repository that stores processed document content, metadata, and the ML models used to understand and retrieve content. You create an Index, configure data sources, and Kendra crawls and indexes the content automatically on a schedule.

**Data source connectors** allow Kendra to pull content from where it already lives rather than requiring you to move documents to S3. Built-in connectors support Amazon S3, SharePoint Online, Confluence, Salesforce, ServiceNow, RDS databases, OneDrive, Google Drive, GitHub, Box, Slack, Quip, and more. Each connector handles authentication, crawling, and incremental updates, so your index stays current without manual re-ingestion. You can also use the **BatchPutDocument** API to push documents directly into the index from custom sources.

Documents can include metadata **attributes** — tags like document type, department, author, date, and access control lists — that enable faceted filtering and fine-grained permissions at query time.`,
    },
    {
      heading: "Query Types and Relevance Tuning",
      body: `Kendra supports three types of queries. **Factoid questions** are direct questions with short, factual answers ("Who is the CEO of Amazon?", "What is the maximum S3 object size?") — Kendra extracts the answer text directly from indexed content. **Descriptive questions** require longer explanatory answers drawn from a relevant document passage. **Keyword queries** work like traditional search when the user types terms rather than a natural language question.

**Relevance tuning** lets you adjust how Kendra weights different signals when ranking results. You can boost documents with certain attribute values (e.g., prioritize internal documentation over external), set recency bias so newer documents rank higher, and mark fields as "queryable" or "searchable" to control which metadata participates in ranking. Kendra also supports **Custom Document Enrichment (CDE)** — a Lambda-backed preprocessing pipeline that can modify, redact, or enrich document content and metadata before indexing.`,
    },
    {
      heading: "Kendra as a RAG Data Source for Bedrock",
      body: `One of the most important roles Kendra plays in modern AI architectures is as a **retrieval backend for Retrieval-Augmented Generation (RAG)** with Amazon Bedrock. In a RAG architecture, a user's question is first sent to a retrieval system that finds relevant document passages, then those passages are injected into the prompt of a language model to produce a grounded, accurate answer.

Kendra is well-suited for the retrieval step because it understands natural language queries and ranks results by semantic relevance rather than keyword overlap. Amazon Bedrock Knowledge Bases can use Kendra as an underlying retrieval mechanism — when a user asks a question to a Bedrock-powered application, Kendra retrieves the most relevant passages from your enterprise document corpus, and Bedrock's language model synthesizes a natural language answer grounded in that content. This combination gives you enterprise-grade document search (Kendra's strengths) with state-of-the-art language generation (Bedrock's strength).`,
    },
    {
      heading: "Access Control and Security",
      body: `Enterprise search must respect document-level permissions — an employee should only see documents they are authorized to access. Kendra supports **user context filtering** through two mechanisms. **Token-based user context** uses JWT tokens or JSON tokens that describe the user's group memberships; Kendra filters search results at query time to return only documents the user's groups are authorized to see. **Access Control Lists (ACLs)** are attached to documents during ingestion and specify which users and groups can view each document.

Kendra integrates with identity providers via AWS IAM Identity Center (SSO) and supports SAML 2.0 and OpenID Connect for federated identity. All data in the index is encrypted at rest using AWS KMS, and data in transit uses TLS. VPC endpoints allow Kendra to be accessed privately without traffic traversing the internet, supporting strict network security requirements.`,
    },
  ],

  keyFacts: [
    "Intelligent enterprise search — returns direct answers, not just document links",
    "Understands natural language queries, synonyms, and domain terminology",
    "Data source connectors: S3, SharePoint, Confluence, Salesforce, ServiceNow, and more",
    "Three query types: factoid (short answers), descriptive (passages), keyword",
    "Relevance tuning: boost by attribute value, recency, field weighting",
    "Custom Document Enrichment (CDE) preprocesses documents via Lambda before indexing",
    "Integrates with Bedrock as a RAG retrieval backend",
    "User context filtering enforces document-level access control at query time",
    "Data encrypted at rest (KMS) and in transit (TLS); VPC endpoint support",
    "Editions: Developer (for testing) and Enterprise (for production, higher limits)",
  ],

  relatedServices: [
    "Amazon Bedrock",
    "Amazon S3",
    "AWS Lambda",
    "AWS IAM Identity Center",
    "Amazon OpenSearch Service",
  ],

  examTips: [
    "Kendra = intelligent enterprise search with natural language understanding; OpenSearch = general-purpose text search",
    "Kendra as RAG retrieval + Bedrock for generation = grounded AI answers from enterprise docs",
    "Data source connectors sync from existing content systems — no need to move documents to S3",
    "User context filtering is how document-level access control is enforced at query time",
    "Relevance tuning lets you boost freshness, attribute values, or specific fields",
    "CDE = Lambda preprocessing pipeline for document enrichment or redaction before indexing",
  ],
};
