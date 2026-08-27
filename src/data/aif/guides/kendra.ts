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
      quiz: [
        {
          question:
            "How does Amazon Kendra differ from traditional keyword-based enterprise search?",
          options: [
            "Kendra returns more documents per query than keyword search",
            "Kendra understands the natural language meaning of queries and returns direct answers extracted from documents",
            "Kendra only searches structured database records, not unstructured documents",
            "Kendra requires users to use Boolean operators like AND and OR",
          ],
          correctIndex: 1,
          explanation:
            "Kendra uses ML to understand the semantic meaning of natural language queries and returns direct answers extracted from indexed documents, rather than a ranked list of documents for users to read through. Traditional search ranks documents by keyword frequency and requires users to find the answer themselves.",
        },
        {
          question:
            "Which of the following is a primary use case for Amazon Kendra?",
          options: [
            "Training custom ML models on enterprise data",
            "Customer service agents searching internal product documentation to answer customer questions",
            "Streaming real-time analytics from IoT sensors",
            "Automating ETL pipelines for data warehouses",
          ],
          correctIndex: 1,
          explanation:
            "Amazon Kendra is designed for enterprise search use cases like customer service agents finding product information, employees searching HR policies, and researchers navigating document libraries. It is not an ML training platform, streaming analytics service, or ETL tool.",
        },
        {
          question:
            "Which linguistic capabilities does Amazon Kendra use to improve search quality beyond keyword matching?",
          options: [
            "Only exact phrase matching with stemming",
            "Understanding of synonyms, acronyms, and domain-specific terminology in natural language queries",
            "Sentiment analysis on search queries",
            "Machine translation of queries into English before searching",
          ],
          correctIndex: 1,
          explanation:
            "Kendra understands synonyms (different words with same meaning), acronyms, and domain-specific terminology, allowing it to match queries to relevant documents even when exact keywords don't appear. Stemming is a basic keyword search technique. Sentiment analysis and machine translation are separate NLP capabilities.",
        },
      ],
    },
    {
      heading: "Indexes, Data Sources, and Connectors",
      body: `The central concept in Kendra is an **Index** — the searchable repository that stores processed document content, metadata, and the ML models used to understand and retrieve content. You create an Index, configure data sources, and Kendra crawls and indexes the content automatically on a schedule.

**Data source connectors** allow Kendra to pull content from where it already lives rather than requiring you to move documents to S3. Built-in connectors support Amazon S3, SharePoint Online, Confluence, Salesforce, ServiceNow, RDS databases, OneDrive, Google Drive, GitHub, Box, Slack, Quip, and more. Each connector handles authentication, crawling, and incremental updates, so your index stays current without manual re-ingestion. You can also use the **BatchPutDocument** API to push documents directly into the index from custom sources.

Documents can include metadata **attributes** — tags like document type, department, author, date, and access control lists — that enable faceted filtering and fine-grained permissions at query time.`,
      quiz: [
        {
          question:
            "What is the central concept in Amazon Kendra that stores processed document content and ML models for search?",
          options: ["Data source", "Index", "Connector", "Collection"],
          correctIndex: 1,
          explanation:
            "The Kendra Index is the central searchable repository that stores processed document content, embeddings, metadata, and the ML models used to understand and retrieve content. Data sources and connectors feed content into the index. 'Collection' is terminology used by other services like OpenSearch.",
        },
        {
          question:
            "A company wants Kendra to search its existing Confluence wiki and SharePoint site without moving documents to S3. Which feature enables this?",
          options: [
            "BatchPutDocument API",
            "Custom Document Enrichment",
            "Data source connectors",
            "User context filtering",
          ],
          correctIndex: 2,
          explanation:
            "Data source connectors allow Kendra to crawl and index content from where it already lives — Confluence, SharePoint, Salesforce, ServiceNow, and many others — without requiring document migration to S3. BatchPutDocument is for pushing documents from custom sources. CDE preprocesses documents. User context filtering enforces permissions.",
        },
        {
          question:
            "What does Kendra's BatchPutDocument API enable that data source connectors do not?",
          options: [
            "Scheduling automatic incremental updates from standard enterprise systems",
            "Pushing documents from custom or non-supported source systems directly into the Kendra index",
            "Applying Lambda-based preprocessing to documents before indexing",
            "Enforcing document-level access control at query time",
          ],
          correctIndex: 1,
          explanation:
            "BatchPutDocument allows you to programmatically push documents from custom or non-standard sources directly into the index, providing flexibility for sources without a pre-built connector. Automatic scheduled incremental updates are a feature of the pre-built connectors. Lambda preprocessing is Custom Document Enrichment. ACL enforcement is user context filtering.",
        },
      ],
    },
    {
      heading: "Query Types and Relevance Tuning",
      body: `Kendra supports three types of queries. **Factoid questions** are direct questions with short, factual answers ("Who is the CEO of Amazon?", "What is the maximum S3 object size?") — Kendra extracts the answer text directly from indexed content. **Descriptive questions** require longer explanatory answers drawn from a relevant document passage. **Keyword queries** work like traditional search when the user types terms rather than a natural language question.

**Relevance tuning** lets you adjust how Kendra weights different signals when ranking results. You can boost documents with certain attribute values (e.g., prioritize internal documentation over external), set recency bias so newer documents rank higher, and mark fields as "queryable" or "searchable" to control which metadata participates in ranking. Kendra also supports **Custom Document Enrichment (CDE)** — a Lambda-backed preprocessing pipeline that can modify, redact, or enrich document content and metadata before indexing.`,
      quiz: [
        {
          question:
            "A user asks Kendra: 'What is the maximum file size for S3 objects?' Which Kendra query type handles this?",
          options: [
            "Keyword query",
            "Descriptive question",
            "Factoid question",
            "Semantic query",
          ],
          correctIndex: 2,
          explanation:
            "A factoid question is a direct question with a short, specific factual answer — like a size limit or a person's name. Kendra extracts the answer text directly from indexed content. A descriptive question would ask for a longer explanation. A keyword query uses terms without a natural language question structure.",
        },
        {
          question:
            "A company wants Kendra search results to prioritize recently published internal documents over older external ones. Which feature achieves this?",
          options: [
            "Custom Document Enrichment with Lambda",
            "User context filtering with JWT tokens",
            "Relevance tuning with recency bias and attribute value boosting",
            "BatchPutDocument with priority metadata",
          ],
          correctIndex: 2,
          explanation:
            "Relevance tuning allows you to set recency bias (newer documents rank higher) and boost documents based on attribute values (e.g., source=internal ranks above source=external). CDE modifies documents during ingestion. User context filtering enforces access control. BatchPutDocument is for pushing documents into the index.",
        },
        {
          question:
            "What is Custom Document Enrichment (CDE) in Amazon Kendra?",
          options: [
            "A feature that translates documents into multiple languages before indexing",
            "A Lambda-backed preprocessing pipeline that modifies, redacts, or enriches document content and metadata before indexing",
            "A relevance tuning feature that boosts certain documents in search results",
            "An access control mechanism for document-level permissions",
          ],
          correctIndex: 1,
          explanation:
            "Custom Document Enrichment is a Lambda-backed pipeline invoked during document ingestion, allowing you to modify metadata, redact sensitive content, enrich documents with additional attributes, or filter which documents are indexed. It runs before documents enter the Kendra index. It is not for translation, relevance tuning, or access control.",
        },
      ],
    },
    {
      heading: "Kendra as a RAG Data Source for Bedrock",
      body: `One of the most important roles Kendra plays in modern AI architectures is as a **retrieval backend for Retrieval-Augmented Generation (RAG)** with Amazon Bedrock. In a RAG architecture, a user's question is first sent to a retrieval system that finds relevant document passages, then those passages are injected into the prompt of a language model to produce a grounded, accurate answer.

Kendra is well-suited for the retrieval step because it understands natural language queries and ranks results by semantic relevance rather than keyword overlap. Amazon Bedrock Knowledge Bases can use Kendra as an underlying retrieval mechanism — when a user asks a question to a Bedrock-powered application, Kendra retrieves the most relevant passages from your enterprise document corpus, and Bedrock's language model synthesizes a natural language answer grounded in that content. This combination gives you enterprise-grade document search (Kendra's strengths) with state-of-the-art language generation (Bedrock's strength).`,
      quiz: [
        {
          question:
            "In a RAG architecture combining Kendra and Bedrock, what is Kendra's role?",
          options: [
            "Kendra generates the final natural language answer",
            "Kendra acts as the retrieval backend, finding relevant document passages that are injected into the Bedrock model's prompt",
            "Kendra fine-tunes the Bedrock foundation model on enterprise documents",
            "Kendra handles user authentication before Bedrock generates responses",
          ],
          correctIndex: 1,
          explanation:
            "In a Kendra + Bedrock RAG architecture, Kendra performs the retrieval step — finding semantically relevant document passages from the enterprise corpus. Those passages are injected into the Bedrock model's prompt as context. Bedrock's foundation model then synthesizes a natural language answer grounded in Kendra's retrieved content.",
        },
        {
          question:
            "Why is Kendra particularly well-suited as the retrieval component in a RAG pipeline compared to simple keyword search?",
          options: [
            "Kendra stores documents in a vector database that Bedrock can query directly",
            "Kendra understands natural language queries and ranks results by semantic relevance rather than keyword overlap",
            "Kendra automatically generates embeddings that Bedrock uses for fine-tuning",
            "Kendra eliminates the need for document chunking in RAG pipelines",
          ],
          correctIndex: 1,
          explanation:
            "Kendra uses ML to understand the semantic meaning of queries, ranking results by relevance even when exact keywords don't match. This makes it a stronger retrieval component than keyword search for natural language questions. Kendra uses its own index structure, not a vector database that Bedrock queries directly.",
        },
        {
          question:
            "What benefit does combining Kendra (retrieval) with Bedrock (generation) provide over using either service alone?",
          options: [
            "It eliminates the need for user authentication",
            "Enterprise-grade document search accuracy (Kendra) combined with state-of-the-art natural language answer generation (Bedrock)",
            "It reduces the cost of both services by 50%",
            "Bedrock can fine-tune its model on Kendra's index automatically",
          ],
          correctIndex: 1,
          explanation:
            "The Kendra + Bedrock combination provides enterprise-grade retrieval accuracy from Kendra's ML-powered search with natural language answer synthesis from Bedrock's foundation models — grounded answers expressed fluently. Neither service alone delivers both: Kendra retrieves but doesn't generate; Bedrock generates but needs retrieval to ground answers in proprietary documents.",
        },
      ],
    },
    {
      heading: "Access Control and Security",
      body: `Enterprise search must respect document-level permissions — an employee should only see documents they are authorized to access. Kendra supports **user context filtering** through two mechanisms. **Token-based user context** uses JWT tokens or JSON tokens that describe the user's group memberships; Kendra filters search results at query time to return only documents the user's groups are authorized to see. **Access Control Lists (ACLs)** are attached to documents during ingestion and specify which users and groups can view each document.

Kendra integrates with identity providers via AWS IAM Identity Center (SSO) and supports SAML 2.0 and OpenID Connect for federated identity. All data in the index is encrypted at rest using AWS KMS, and data in transit uses TLS. VPC endpoints allow Kendra to be accessed privately without traffic traversing the internet, supporting strict network security requirements.`,
      quiz: [
        {
          question:
            "How does Kendra enforce document-level access control so employees only see authorized documents?",
          options: [
            "By creating separate indexes for each employee",
            "Through user context filtering using JWT tokens or ACLs attached to documents",
            "By requiring users to authenticate with the source system before each search",
            "By encrypting documents so only authorized users can decrypt them",
          ],
          correctIndex: 1,
          explanation:
            "Kendra enforces document-level access control through user context filtering: JWT/JSON tokens describing the user's group memberships filter results at query time, or ACLs attached to documents during ingestion define who can view each document. Separate indexes per user would be impractical. Source system re-authentication and encryption are not how Kendra filters results.",
        },
        {
          question:
            "Which identity federation standards does Amazon Kendra support for enterprise authentication?",
          options: [
            "Only AWS IAM roles",
            "AWS IAM Identity Center, SAML 2.0, and OpenID Connect",
            "Only LDAP directory integration",
            "Kerberos and Active Directory only",
          ],
          correctIndex: 1,
          explanation:
            "Kendra integrates with AWS IAM Identity Center (SSO) and supports SAML 2.0 and OpenID Connect for federated identity with enterprise identity providers. It is not limited to IAM roles alone, LDAP, or Kerberos/Active Directory.",
        },
        {
          question:
            "Which security feature allows Amazon Kendra to be accessed from within a VPC without traffic traversing the public internet?",
          options: [
            "AWS PrivateLink / VPC endpoints",
            "AWS WAF integration",
            "Network ACLs on the Kendra index",
            "S3 bucket policies on the document store",
          ],
          correctIndex: 0,
          explanation:
            "VPC endpoints (powered by AWS PrivateLink) allow Kendra to be accessed from within a VPC without traffic traversing the public internet, meeting strict network isolation requirements. AWS WAF protects web applications. Network ACLs and S3 bucket policies are not mechanisms for private Kendra access.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "An employee asks their internal search system 'What is the company's parental leave policy?' and receives the exact policy text extracted from the HR handbook rather than a list of documents. Which AWS service powers this?",
      options: [
        "Amazon OpenSearch Service with keyword ranking",
        "Amazon Kendra with natural language understanding",
        "Amazon Comprehend with entity extraction",
        "Amazon Lex with intent recognition",
      ],
      correctIndex: 1,
      explanation:
        "Amazon Kendra understands natural language questions and returns direct answers extracted from indexed documents — exactly the behavior described. OpenSearch ranks documents by keywords. Comprehend extracts entities from text. Lex builds conversational chatbots with intent/slot modeling.",
    },
    {
      question:
        "A company wants Kendra to search its SharePoint site and Confluence wiki simultaneously. What is the most efficient way to accomplish this?",
      options: [
        "Export all documents to S3 daily and use S3 connectors",
        "Use BatchPutDocument API to push copies of all documents into Kendra",
        "Configure data source connectors for SharePoint and Confluence directly in Kendra",
        "Create separate Kendra indexes for each content system",
      ],
      correctIndex: 2,
      explanation:
        "Pre-built data source connectors for SharePoint and Confluence allow Kendra to crawl and index content directly from those systems without moving documents. This is more efficient than daily S3 exports or BatchPutDocument, and a single index can serve multiple data source connectors without needing separate indexes.",
    },
    {
      question:
        "Which Kendra feature would a company use to automatically redact sensitive employee data from HR documents before they are indexed and made searchable?",
      options: [
        "User context filtering with ACLs",
        "Relevance tuning with attribute boosting",
        "Custom Document Enrichment (CDE) with a Lambda function",
        "Factoid query type with confidence filtering",
      ],
      correctIndex: 2,
      explanation:
        "Custom Document Enrichment invokes a Lambda function during document ingestion, allowing content modification (including redaction of sensitive data) before the document enters the Kendra index. User context filtering controls who can see documents at query time. Relevance tuning affects search ranking. Factoid queries affect answer type, not content.",
    },
    {
      question:
        "In a Kendra + Bedrock RAG architecture, what happens in the correct sequence when a user submits a query?",
      options: [
        "Bedrock generates an answer → Kendra validates it against documents",
        "Kendra retrieves relevant passages → passages are injected into Bedrock's prompt → Bedrock generates a grounded answer",
        "Bedrock embeds the query → Kendra stores the embedding → Bedrock retrieves similar queries",
        "Kendra indexes Bedrock's training data → Bedrock queries Kendra at training time",
      ],
      correctIndex: 1,
      explanation:
        "The correct RAG sequence is: (1) Kendra retrieves semantically relevant document passages, (2) those passages are injected into the Bedrock model's prompt as context, (3) Bedrock generates a natural language answer grounded in that context. Bedrock does not validate Kendra results, and Kendra does not store Bedrock embeddings.",
    },
    {
      question:
        "A Kendra user searches for 'How do I reset my password?' A document uses the phrase 'change your login credentials.' Will Kendra find it?",
      options: [
        "No — Kendra uses keyword matching and 'reset password' doesn't appear in the document",
        "Yes — Kendra understands synonyms and semantic meaning, so 'reset password' maps to 'change login credentials'",
        "Only if the document is boosted using relevance tuning",
        "Only if a custom vocabulary is configured mapping 'reset' to 'change'",
      ],
      correctIndex: 1,
      explanation:
        "Kendra uses ML-based semantic understanding, so it recognizes that 'reset password' and 'change login credentials' express the same intent even without shared keywords. This semantic understanding is a key differentiator from keyword-based search, which would miss the document entirely.",
    },
    {
      question:
        "How does Kendra ensure a contractor searching the internal knowledge base cannot see confidential executive documents they are not authorized to view?",
      options: [
        "By creating a separate Kendra index for contractors",
        "Through user context filtering — JWT tokens or ACLs on documents filter results to only authorized content at query time",
        "By encrypting executive documents with contractor-specific KMS keys",
        "By restricting the contractor's IAM role from making Kendra API calls",
      ],
      correctIndex: 1,
      explanation:
        "User context filtering enforces document-level permissions at query time — Kendra uses the authenticated user's JWT token (describing group memberships) or document-level ACLs to return only content the user is authorized to see. Separate indexes, encryption, and IAM role restrictions are not the mechanism for per-document access control in Kendra.",
    },
    {
      question:
        "What is the difference between a Factoid question and a Descriptive question in Amazon Kendra?",
      options: [
        "Factoid questions search structured databases; descriptive questions search unstructured documents",
        "Factoid questions have short, specific answers extracted from text; descriptive questions require longer explanatory passages",
        "Factoid questions use keyword matching; descriptive questions use semantic search",
        "There is no difference — Kendra treats all question types the same way",
      ],
      correctIndex: 1,
      explanation:
        "Factoid questions have short, factual answers ('What is the maximum S3 object size?') that Kendra extracts as a brief text span. Descriptive questions require longer explanatory answers drawn from a relevant document passage. Both use Kendra's semantic understanding — the difference is the expected answer length and format.",
    },
    {
      question:
        "A company's Kendra search results rank old policy documents above recently updated ones. Which feature corrects this?",
      options: [
        "Custom Document Enrichment with a Lambda that adds timestamps",
        "Relevance tuning with recency bias enabled",
        "User context filtering with document date ACLs",
        "BatchPutDocument with a priority field",
      ],
      correctIndex: 1,
      explanation:
        "Relevance tuning includes a recency bias setting that causes newer documents to rank higher in search results. Custom Document Enrichment can add metadata (including timestamps) during ingestion, but recency bias in relevance tuning is the direct mechanism for prioritizing freshness. User context filtering controls access, not ranking.",
    },
  ],
};
