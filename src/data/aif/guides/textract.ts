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
    },
    {
      heading: "Text Detection and Document Analysis",
      body: `Textract exposes two primary APIs. **DetectDocumentText** performs raw text detection: it finds all printed text and handwritten text in an image and returns words and lines as Block objects with bounding box coordinates and confidence scores. This is the equivalent of high-quality OCR and is the right choice when you need text locations but don't need form or table structure.

**AnalyzeDocument** is the more powerful API that also returns structured content. By specifying \`FeatureTypes\` in the request, you can enable form extraction (FORMS), table extraction (TABLES), and layout analysis (LAYOUT). With FORMS enabled, Textract identifies key-value pairs — the form field label and its corresponding value — and explicitly links them in the output. A driver's license might have \`DOB\` as a key and \`01/15/1985\` as the corresponding value. With TABLES enabled, Textract identifies tabular regions and returns cells with their row and column positions, preserving the grid structure. LAYOUT mode identifies semantic roles: titles, headers, section headers, list items, figures, and footers.`,
    },
    {
      heading: "Queries: Targeted Extraction",
      body: `One of Textract's most powerful features is **Queries** — a way to ask specific natural language questions about a document and receive direct answers. Rather than parsing through thousands of blocks to find a particular piece of information, you pose questions like "What is the patient's date of birth?" or "What is the total amount due?" and Textract locates and returns the answer.

Queries use a question-answer model fine-tuned on document understanding. They work across diverse document formats — the same question "What is the invoice number?" can be applied to invoices from different vendors with different layouts, and Textract finds the answer in each. You can submit up to 30 queries per page per AnalyzeDocument call. Queries significantly reduce the application code needed to extract targeted information compared to writing heuristics against raw Block output.`,
    },
    {
      heading: "Async Processing for Multi-Page Documents",
      body: `For multi-page PDFs and large documents, Textract provides asynchronous APIs. \`StartDocumentTextDetection\` and \`StartDocumentAnalysis\` initiate async jobs on S3-stored documents. Textract processes the document (which can be up to 3,000 pages for text detection), and when complete, publishes a notification to an SNS topic. Your application receives the SNS message, then calls \`GetDocumentTextDetection\` or \`GetDocumentAnalysis\` with pagination to retrieve the Block results page by page.

The async pattern is essential for enterprise document automation where documents may be lengthy contracts, multi-page application forms, or image-heavy reports. Textract processes these documents in parallel and at high throughput. For very high-volume pipelines, you can use **Textract Batch** to queue thousands of documents for processing with managed throughput and backoff.`,
    },
    {
      heading: "Specialized APIs and Integration Patterns",
      body: `Textract offers specialized APIs for regulated document types. **AnalyzeID** is purpose-built for US identity documents — driver's licenses and passports. It extracts and normalizes fields like first name, last name, date of birth, expiration date, document number, and state, returning a structured JSON without requiring field parsing logic. **AnalyzeExpense** is purpose-built for receipts and invoices, extracting vendor name, total amount, tax amount, line items, quantities, and prices in a structured format suitable for accounts payable automation.

**AnalyzeLending** handles mortgage and lending documents — 1003 forms, pay stubs, W-2s, bank statements — and is part of the Amazon Textract for Lending solution. It classifies the document type, extracts relevant fields, and returns normalized output aligned with lending workflows.

Textract integrates naturally with **Amazon Augmented AI (A2I)** for human review: when Textract's confidence scores fall below a threshold, A2I routes the document to a human reviewer through a configurable workforce (Amazon Mechanical Turk, internal employees, or an AWS Marketplace vendor). This human-in-the-loop pattern ensures high accuracy for documents where automated extraction alone is insufficient.`,
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
};
