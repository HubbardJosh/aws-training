import { ServiceGuide } from "../../../types/guide";

export const textractGuide: ServiceGuide = {
  id: "aif-textract",
  service: "Amazon Textract",
  domain: "development",
  tagline: "Extract text, forms, and tables from documents using ML",
  intro:
    "Amazon Textract is a fully managed ML service that goes beyond simple OCR to intelligently extract printed text, handwriting, form fields (key-value pairs), table data, and document structure from images and PDFs without requiring any ML expertise.",

  sections: [
    {
      heading: "Beyond OCR: Intelligent Document Understanding",
      body: `Traditional **Optical Character Recognition (OCR)** converts pixels to characters — it reads the text on a page but has no understanding of the document's structure. It cannot distinguish between a table cell and a paragraph, cannot link a form field label to its corresponding value, and cannot identify which text is a heading versus body copy. Textract goes further: it uses ML models trained on millions of document types to understand document **structure**, not just character sequences.

When Textract processes a document, it returns a hierarchical block structure. A **Block** is the fundamental unit: blocks represent pages, lines, words, cells, key-value sets, selection elements (checkboxes), and tables. The relationships between blocks encode the document structure — which words belong to which line, which cells belong to which table, which values correspond to which form field keys. This rich structural output makes Textract suitable for complex document automation where OCR alone would require expensive post-processing to reconstruct structure.`,
      quiz: [
        {
          question:
            "What is the fundamental unit of output in Amazon Textract, and which of the following is NOT a valid Block type?",
          options: [
            "Block; SENTENCE is not a valid Block type",
            "Node; TABLE is not a valid Node type",
            "Element; WORD is not a valid Element type",
            "Token; CELL is not a valid Token type",
          ],
          correctIndex: 0,
          explanation:
            "The Block is the fundamental unit in Textract output. Valid Block types include PAGE, LINE, WORD, TABLE, CELL, KEY_VALUE_SET, and SELECTION_ELEMENT. SENTENCE is not a Block type — Textract works at the word and line level, not the sentence level.",
        },
        {
          question:
            "What key advantage does Amazon Textract have over traditional OCR for document processing?",
          options: [
            "Textract understands document structure — it links form field labels to values, preserves table grids, and identifies layout elements — rather than just recognizing characters",
            "Textract supports more languages than standard OCR engines",
            "Textract can process handwritten text, which traditional OCR cannot do at all",
            "Textract is faster at reading text from high-resolution images",
          ],
          correctIndex: 0,
          explanation:
            "Textract's key differentiator is structural understanding. Traditional OCR converts pixels to characters but cannot determine structure. Textract uses ML to understand which text belongs to a form field label vs its value, which cells belong to which table, and what the layout hierarchy is.",
        },
      ],
    },
    {
      heading: "Text Detection and Document Analysis",
      body: `Textract exposes two primary APIs. **DetectDocumentText** performs raw text detection: it finds all printed text and handwritten text in an image and returns words and lines as Block objects with bounding box coordinates and confidence scores. This is the equivalent of high-quality OCR and is the right choice when you need text locations but don't need form or table structure.

**AnalyzeDocument** is the more powerful API that also returns structured content. By specifying \`FeatureTypes\` in the request, you can enable form extraction (FORMS), table extraction (TABLES), and layout analysis (LAYOUT). With FORMS enabled, Textract identifies key-value pairs — the form field label and its corresponding value — and explicitly links them in the output. A driver's license might have \`DOB\` as a key and \`01/15/1985\` as the corresponding value. With TABLES enabled, Textract identifies tabular regions and returns cells with their row and column positions, preserving the grid structure. LAYOUT mode identifies semantic roles: titles, headers, section headers, list items, figures, and footers.`,
      quiz: [
        {
          question:
            "Which Amazon Textract API and feature type would you use to extract form field labels and their corresponding values from an insurance claim form?",
          options: [
            "DetectDocumentText — it automatically links labels to values",
            "AnalyzeDocument with FeatureTypes=['TABLES'] — form fields are stored as single-column tables",
            "AnalyzeDocument with FeatureTypes=['LAYOUT'] — it identifies all semantic regions including form fields",
            "AnalyzeDocument with FeatureTypes=['FORMS'] — it identifies and links key-value pairs",
          ],
          correctIndex: 3,
          explanation:
            "AnalyzeDocument with FORMS feature type extracts key-value pairs from documents — it identifies form field labels (keys) and their corresponding values and explicitly links them in the output. DetectDocumentText only extracts raw text without any structural linking.",
        },
        {
          question:
            "You need to extract financial data from a table in a PDF report, preserving row and column structure. Which Textract API and feature type should you use?",
          options: [
            "DetectDocumentText — it preserves spatial layout including tables",
            "AnalyzeDocument with FeatureTypes=['LAYOUT'] — LAYOUT mode captures all structural elements including tables",
            "AnalyzeDocument with FeatureTypes=['FORMS'] — financial tables are processed as multi-value form fields",
            "AnalyzeDocument with FeatureTypes=['TABLES'] — it identifies tabular regions and returns cells with row/column positions",
          ],
          correctIndex: 3,
          explanation:
            "AnalyzeDocument with TABLES feature type identifies tabular regions and returns cells with their row and column positions, preserving the grid structure. This is the correct choice when you need to extract structured tabular data with row/column relationships intact.",
        },
      ],
    },
    {
      heading: "Queries: Targeted Extraction",
      body: `One of Textract's most powerful features is **Queries** — a way to ask specific natural language questions about a document and receive direct answers. Rather than parsing through thousands of blocks to find a particular piece of information, you pose questions like "What is the patient's date of birth?" or "What is the total amount due?" and Textract locates and returns the answer.

Queries use a question-answer model fine-tuned on document understanding. They work across diverse document formats — the same question "What is the invoice number?" can be applied to invoices from different vendors with different layouts, and Textract finds the answer in each. You can submit up to 30 queries per page per AnalyzeDocument call. Queries significantly reduce the application code needed to extract targeted information compared to writing heuristics against raw Block output.`,
      quiz: [
        {
          question:
            "What is the maximum number of Queries you can submit per page in a single Amazon Textract AnalyzeDocument call?",
          options: ["20", "30", "10", "50"],
          correctIndex: 1,
          explanation:
            "Amazon Textract supports up to 30 queries per page per AnalyzeDocument call. Queries allow you to ask specific natural language questions about a document and receive direct answers without parsing raw Block output.",
        },
        {
          question:
            "What advantage does the Textract Queries feature provide over parsing raw Block output?",
          options: [
            "Queries support documents in more languages than the standard AnalyzeDocument API",
            "Queries can process documents without storing them in S3 first",
            "Queries allow you to ask natural language questions and receive direct answers, eliminating the need to write heuristics to locate specific information in thousands of Block objects",
            "Queries are faster because they skip the ML inference step",
          ],
          correctIndex: 2,
          explanation:
            "Queries let you ask specific natural language questions ('What is the invoice number?') and receive direct answers, significantly reducing application code. Without Queries, you would need to write heuristics to search through potentially thousands of Block objects to find specific information.",
        },
      ],
    },
    {
      heading: "Async Processing for Multi-Page Documents",
      body: `For multi-page PDFs and large documents, Textract provides asynchronous APIs. \`StartDocumentTextDetection\` and \`StartDocumentAnalysis\` initiate async jobs on S3-stored documents. Textract processes the document (which can be up to 3,000 pages for text detection), and when complete, publishes a notification to an SNS topic. Your application receives the SNS message, then calls \`GetDocumentTextDetection\` or \`GetDocumentAnalysis\` with pagination to retrieve the Block results page by page.

The async pattern is essential for enterprise document automation where documents may be lengthy contracts, multi-page application forms, or image-heavy reports. Textract processes these documents in parallel and at high throughput. For very high-volume pipelines, you can use **Textract Batch** to queue thousands of documents for processing with managed throughput and backoff.`,
      quiz: [
        {
          question:
            "A legal firm needs to process 500-page contract PDFs stored in S3 with Amazon Textract. Which API pattern should they use?",
          options: [
            "AnalyzeDocument with the PDF passed as raw bytes in a single synchronous call",
            "StartDocumentAnalysis to initiate an async job, receive SNS completion notification, then call GetDocumentAnalysis to retrieve results",
            "StartDocumentTextDetection with the async flag disabled for faster synchronous processing",
            "DetectDocumentText called once per page with the PDF split into individual images",
          ],
          correctIndex: 1,
          explanation:
            "Multi-page documents stored in S3 require async Textract APIs. The pattern is: StartDocumentAnalysis (or StartDocumentTextDetection) → Textract processes async → SNS notification on completion → GetDocumentAnalysis (paginated) to retrieve results. The sync APIs cannot handle multi-page PDFs.",
        },
        {
          question:
            "What is the maximum number of pages Amazon Textract can process in a single asynchronous text detection job?",
          options: ["10,000 pages", "3,000 pages", "100 pages", "500 pages"],
          correctIndex: 1,
          explanation:
            "Amazon Textract's asynchronous StartDocumentTextDetection API can process documents up to 3,000 pages. This makes it suitable for lengthy contracts, large reports, and other enterprise document types that would far exceed any synchronous API limit.",
        },
      ],
    },
    {
      heading: "Specialized APIs and Integration Patterns",
      body: `Textract offers specialized APIs for regulated document types. **AnalyzeID** is purpose-built for US identity documents — driver's licenses and passports. It extracts and normalizes fields like first name, last name, date of birth, expiration date, document number, and state, returning a structured JSON without requiring field parsing logic. **AnalyzeExpense** is purpose-built for receipts and invoices, extracting vendor name, total amount, tax amount, line items, quantities, and prices in a structured format suitable for accounts payable automation.

**AnalyzeLending** handles mortgage and lending documents — 1003 forms, pay stubs, W-2s, bank statements — and is part of the Amazon Textract for Lending solution. It classifies the document type, extracts relevant fields, and returns normalized output aligned with lending workflows.

Textract integrates naturally with **Amazon Augmented AI (A2I)** for human review: when Textract's confidence scores fall below a threshold, A2I routes the document to a human reviewer through a configurable workforce (Amazon Mechanical Turk, internal employees, or an AWS Marketplace vendor). This human-in-the-loop pattern ensures high accuracy for documents where automated extraction alone is insufficient.`,
      quiz: [
        {
          question:
            "Which Amazon Textract API is specifically designed to extract structured fields from US driver's licenses and passports?",
          options: [
            "AnalyzeID",
            "AnalyzeExpense",
            "AnalyzeDocument with FORMS feature type",
            "DetectDocumentText with post-processing for identity fields",
          ],
          correctIndex: 0,
          explanation:
            "AnalyzeID is purpose-built for US identity documents (driver's licenses and passports). It extracts and normalizes fields like first name, last name, date of birth, expiration date, and document number — returning structured JSON without requiring custom field-parsing logic.",
        },
        {
          question:
            "How does Amazon Textract integrate with Amazon Augmented AI (A2I) for document processing?",
          options: [
            "A2I routes documents to human reviewers when Textract's confidence scores fall below a configured threshold, enabling human-in-the-loop validation",
            "A2I provides a visual UI for correcting Textract output before it is stored in S3",
            "A2I trains custom Textract models using human-reviewed documents as labeled training data",
            "A2I automatically reprocesses any document where Textract returns zero blocks",
          ],
          correctIndex: 0,
          explanation:
            "When Textract's confidence scores fall below a threshold, A2I routes the document to a human reviewer through a configurable workforce. This human-in-the-loop pattern ensures high accuracy for critical documents where automated extraction alone may be insufficient.",
        },
      ],
    },
  ],

  keyFacts: [
    "Goes beyond OCR: understands document structure (forms, tables, layouts)",
    "DetectDocumentText: raw text extraction with bounding boxes",
    "AnalyzeDocument: structured extraction — FORMS, TABLES, LAYOUT feature types",
    "Key-value pairs (FORMS) link form field labels to their corresponding values",
    "Queries API: ask natural language questions and get direct answers from documents",
    "Async APIs (StartDocument*) required for multi-page PDFs stored in S3",
    "AnalyzeID: purpose-built for US driver's licenses and passports",
    "AnalyzeExpense: purpose-built for receipts and invoices",
    "Integrates with Amazon A2I for human-in-the-loop review on low-confidence results",
    "Returns Block objects with type, text, confidence, bounding box, and relationships",
  ],

  relatedServices: [
    "Amazon Comprehend",
    "Amazon Rekognition",
    "Amazon Augmented AI (A2I)",
    "Amazon S3",
    "AWS Lambda",
  ],

  examTips: [
    "Textract = structured document extraction; Rekognition = general image/video analysis",
    "AnalyzeDocument with FORMS extracts key-value pairs — the label AND its value",
    "Queries API is the most targeted extraction method — ask specific questions about documents",
    "Async APIs are required for multi-page documents stored in S3",
    "AnalyzeID and AnalyzeExpense are purpose-built for identity docs and receipts",
    "A2I integration provides human review when confidence is below threshold",
    "Block types to know: PAGE, LINE, WORD, TABLE, CELL, KEY_VALUE_SET, SELECTION_ELEMENT",
  ],

  topicQuiz: [
    {
      question:
        "A hospital needs to automatically extract patient name, date of birth, and insurance ID from scanned intake forms. Which Textract API and feature type is most appropriate?",
      options: [
        "AnalyzeDocument with FeatureTypes=['FORMS'] — it links field labels to their values as key-value pairs",
        "AnalyzeID — it is purpose-built for medical intake forms",
        "DetectDocumentText — it returns all text including form fields",
        "AnalyzeDocument with FeatureTypes=['LAYOUT'] — it identifies semantic regions including form sections",
      ],
      correctIndex: 0,
      explanation:
        "AnalyzeDocument with FORMS extracts key-value pairs — it links 'Patient Name' to 'John Smith', 'Date of Birth' to '01/15/1985', etc. AnalyzeID is specifically for US driver's licenses and passports, not general medical forms.",
    },
    {
      question:
        "What does the AnalyzeExpense API in Amazon Textract return for a scanned receipt?",
      options: [
        "Structured data including vendor name, total amount, tax amount, line items, quantities, and prices — suitable for accounts payable automation",
        "A key-value pair for every printed label on the receipt, identical to AnalyzeDocument FORMS",
        "Only the total amount and vendor name — other line items require manual parsing",
        "A list of words and lines with bounding boxes, identical to DetectDocumentText",
      ],
      correctIndex: 0,
      explanation:
        "AnalyzeExpense is purpose-built for receipts and invoices. It returns structured data including vendor name, total amount, tax amount, and line items with quantities and prices in a normalized format designed for accounts payable automation workflows.",
    },
    {
      question:
        "You want to ask 'What is the effective date of this contract?' across thousands of different contract templates with varying layouts. Which Textract feature handles this most efficiently?",
      options: [
        "Textract Queries — you pose the question and Textract locates the answer regardless of layout",
        "AnalyzeDocument with FORMS — it will find the 'Effective Date' key-value pair in each contract",
        "DetectDocumentText with downstream regex matching to find date patterns",
        "AnalyzeLending — it classifies contract types and extracts dates automatically",
      ],
      correctIndex: 0,
      explanation:
        "Textract Queries are ideal for this use case. You pose a natural language question ('What is the effective date?') and Textract finds the answer regardless of how different vendors lay out their contracts — eliminating the need to write layout-specific heuristics for each template.",
    },
    {
      question:
        "Which Textract async API pattern is correct for processing a multi-page PDF stored in S3?",
      options: [
        "StartDocumentAnalysis → receive SNS notification → GetDocumentAnalysis (paginated)",
        "AnalyzeDocument → poll GetDocumentStatus until complete → retrieve results",
        "DetectDocumentText with async=true parameter → results streamed via Kinesis",
        "StartDocumentTextDetection → poll S3 output bucket for the result file",
      ],
      correctIndex: 0,
      explanation:
        "The correct async pattern is: StartDocumentAnalysis (initiates the job) → Textract processes and sends completion to SNS → your application receives the SNS notification → GetDocumentAnalysis with pagination to retrieve Block results. This pattern applies to both StartDocumentAnalysis and StartDocumentTextDetection.",
    },
    {
      question:
        "A financial services company uses Textract to extract data from loan applications. For 5% of applications, confidence scores are low. How should they handle these?",
      options: [
        "Integrate Amazon A2I to route low-confidence documents to human reviewers for validation",
        "Lower the confidence threshold so all extractions are accepted automatically",
        "Resubmit those documents using a different Textract API for a second opinion",
        "Discard low-confidence extractions and require customers to re-submit cleaner documents",
      ],
      correctIndex: 0,
      explanation:
        "Amazon Augmented AI (A2I) is the correct integration for low-confidence Textract results. A2I routes those documents to a human review workforce, ensuring accuracy for critical decisions without discarding valid documents or lowering quality standards.",
    },
    {
      question:
        "What is the key difference between Textract's DetectDocumentText and AnalyzeDocument APIs?",
      options: [
        "DetectDocumentText is synchronous; AnalyzeDocument is asynchronous",
        "DetectDocumentText extracts raw text (words and lines); AnalyzeDocument additionally extracts structure — forms, tables, and layout — based on specified FeatureTypes",
        "DetectDocumentText supports multi-page PDFs; AnalyzeDocument is limited to single-page images",
        "DetectDocumentText is free; AnalyzeDocument is a paid feature",
      ],
      correctIndex: 1,
      explanation:
        "DetectDocumentText extracts raw text (words and lines with bounding boxes) — equivalent to high-quality OCR. AnalyzeDocument additionally extracts structural content based on specified FeatureTypes: FORMS (key-value pairs), TABLES (grid structure), and LAYOUT (semantic roles). Both are synchronous for single images.",
    },
    {
      question:
        "Which Amazon Textract API would an accounts payable team use to automatically process invoices from multiple vendors?",
      options: [
        "AnalyzeExpense — it is purpose-built for receipts and invoices with structured field extraction",
        "DetectDocumentText — the team parses vendor name and totals from raw text",
        "AnalyzeDocument with FORMS — invoices are treated as key-value form documents",
        "AnalyzeID — it handles commercial identity documents including vendor tax IDs",
      ],
      correctIndex: 0,
      explanation:
        "AnalyzeExpense is purpose-built for receipts and invoices, automatically extracting vendor name, total amount, tax amount, and line items in a structured format. This eliminates the need for custom post-processing logic to parse these fields from raw text or generic form extraction.",
    },
    {
      question:
        "In Amazon Textract output, what does a KEY_VALUE_SET Block type represent?",
      options: [
        "A database entry mapping a document ID to its S3 location",
        "A metadata block containing the document's page count and processing confidence",
        "A table cell that contains both a row key and a column value",
        "A form field consisting of a label (KEY) linked to its corresponding value (VALUE) in the document",
      ],
      correctIndex: 3,
      explanation:
        "KEY_VALUE_SET Blocks represent form fields. Each KEY_VALUE_SET contains a KEY Block (the form label, e.g., 'Date of Birth') linked via a relationship to a VALUE Block (the filled-in answer, e.g., '01/15/1985'). This is the structural output from AnalyzeDocument with FORMS enabled.",
    },
  ],
};
