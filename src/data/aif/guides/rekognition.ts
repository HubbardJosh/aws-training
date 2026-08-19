import { ServiceGuide } from "../../../types/guide";

export const rekognitionGuide: ServiceGuide = {
  id: "aif-rekognition",
  service: "Amazon Rekognition",
  domain: "development",
  tagline: "Deep learning-powered image and video analysis",
  intro:
    "Amazon Rekognition is a fully managed computer vision service that uses deep learning to analyze images and videos, detecting objects, scenes, faces, text, and unsafe content without requiring any ML expertise.",

  sections: [
    {
      heading: "Core Capabilities",
      body: `Rekognition exposes computer vision capabilities through simple API calls. Under the hood it runs deep neural networks trained on massive image and video datasets, but you interact with it purely through AWS SDK calls — you pass an image (as raw bytes or an S3 reference) and receive structured JSON containing detected labels, faces, text, and more.

**Object and scene detection** identifies thousands of objects, activities, and concepts in an image with confidence scores. A photo of a beach might return labels like \`Beach\`, \`Ocean\`, \`Person\`, \`Umbrella\`, each with a confidence percentage. **Unsafe content detection** identifies explicit or suggestive adult content, violent content, hate symbols, and more — organized into a taxonomy with confidence scores — making it useful for content moderation pipelines.

**Celebrity recognition** identifies well-known public figures and returns their name, a confidence score, and an external URL for additional information. **Custom Labels** lets you train Rekognition on your own domain-specific images to detect objects unique to your use case — defects on a manufacturing line, specific vehicle models, branded logos — without writing any training code.`,
    },
    {
      heading: "Facial Analysis and Recognition",
      body: `Rekognition's facial capabilities span three distinct tasks that are important to distinguish. **Facial analysis** extracts attributes from detected faces without identifying who they belong to: approximate age range, gender expression, emotions (happy, sad, confused, disgusted, calm, angry, surprised), whether the person is wearing glasses or a smile, whether eyes are open, and whether a face mask is present. This is useful for audience analytics, retail insights, and accessibility features.

**Facial comparison** takes two images and determines whether they contain the same person, returning a similarity score. This is the foundation of document-to-selfie verification workflows used in identity proofing.

**Face search** (facial recognition) uses a **Collection** — a persistent server-side index of face vectors you build by calling \`IndexFaces\`. You add faces to a Collection with an associated external ID (a user ID from your system), then call \`SearchFacesByImage\` to find which indexed faces a query image matches. Collections are stored in Rekognition's infrastructure and can hold millions of faces. Facial recognition raises significant privacy and ethical considerations; AWS requires customers to comply with applicable laws and has published use-case restrictions.`,
    },
    {
      heading: "Text Detection and Document Analysis",
      body: `Rekognition's **text detection** capability finds and reads printed and handwritten text in natural scene images and documents. It returns each detected word and line with bounding box coordinates and confidence scores. This differs from Amazon Textract, which is purpose-built for structured document extraction with form field and table understanding — Rekognition text detection is better suited for reading text on signs, license plates, product labels, and other scene text.

The **DetectText** API handles images; for video, Rekognition uses the asynchronous video API pattern (described in the video analysis section). Text detection supports text in multiple orientations and works on low-contrast or partially occluded text, though performance degrades with very small or stylized fonts.`,
    },
    {
      heading: "Video Analysis",
      body: `Rekognition supports both stored video analysis (asynchronous, for videos already in S3) and streaming video analysis (real-time, for live streams).

For **stored video**, you submit a \`StartLabelDetection\`, \`StartFaceDetection\`, \`StartPersonTracking\`, or other Start* API call with an S3 video path. Rekognition processes the video asynchronously and sends a completion notification to an SNS topic. You then call the corresponding \`GetLabelDetection\` call to retrieve timestamped results. This is the standard pattern for analyzing recorded content — video moderation, compliance archiving, sports highlight detection.

**Streaming video analysis** uses **Rekognition Video Stream Processors** connected to Kinesis Video Streams. You create a Stream Processor that watches a Kinesis Video Stream and emits detection events (face matches against a Collection, connected home labels) to a Kinesis Data Stream or S3. This enables real-time use cases: security camera monitoring, access control, people counting in retail environments. The stream processor model supports fragment-level or second-level granularity.`,
    },
    {
      heading: "Custom Labels",
      body: `While Rekognition's base models cover a broad range of general objects, many enterprise use cases require domain-specific object detection — detecting corrosion on oil pipelines, identifying specific pharmaceutical packaging, or recognizing proprietary product models on a factory floor. **Rekognition Custom Labels** addresses this without requiring ML expertise.

The workflow starts in the **Rekognition Custom Labels console**, where you create a project, upload training images to an S3 dataset, and draw bounding boxes or apply image-level labels. Rekognition uses **transfer learning** — it takes its existing pre-trained feature extractor and fine-tunes it on your labeled data — so you typically need only dozens to hundreds of images rather than the millions required to train from scratch. After training, you evaluate performance metrics (average precision, recall) and deploy the model to a dedicated endpoint. Custom Labels models support both object localization (bounding boxes) and image classification.`,
    },
  ],

  keyFacts: [
    "No ML expertise required — all capabilities exposed as API calls",
    "DetectLabels identifies objects, scenes, activities with confidence scores",
    "DetectModerationLabels categorizes unsafe content (adult, violence, hate symbols)",
    "Facial analysis extracts attributes; facial recognition requires a Collection index",
    "Collections store face embeddings server-side for SearchFacesByImage queries",
    "Stored video analysis is asynchronous; streaming uses Kinesis Video Streams + Stream Processors",
    "Custom Labels uses transfer learning — needs only dozens to hundreds of images",
    "DetectText reads scene text; Textract is for structured document extraction",
    "Celebrity recognition identifies public figures without a custom Collection",
    "CompareFaces compares two images for same-person verification",
  ],

  relatedServices: [
    "Amazon Textract",
    "Amazon S3",
    "Amazon Kinesis Video Streams",
    "Amazon SNS",
    "AWS Lambda",
  ],

  examTips: [
    "Rekognition vs Textract: Rekognition = general images and video; Textract = structured document extraction",
    "Collections must be created and populated before SearchFacesByImage works",
    "Video analysis is async: Start* call → SNS notification → Get* call to retrieve results",
    "Custom Labels = transfer learning on your domain images, not training from scratch",
    "Facial analysis (attributes) is different from facial recognition (identity matching)",
    "DetectModerationLabels is the content moderation API for images",
    "Know the ethical/legal considerations around facial recognition — exam may test responsible AI here",
  ],
};
