import { ServiceGuide } from "../../../types/guide";

export const rekognitionGuide: ServiceGuide = {
  id: "mls-rekognition",
  service: "Amazon Rekognition",
  domain: "services",
  tagline:
    "Managed computer vision service for image and video analysis without ML expertise",
  intro:
    "Amazon Rekognition provides pre-trained and customizable computer vision capabilities through a simple API, covering object detection, facial analysis, text extraction, content moderation, and celebrity recognition. It enables applications to add visual intelligence without training custom models.",

  sections: [
    {
      heading: "Core Rekognition Capabilities",
      body: `Rekognition offers a broad set of image analysis APIs that invoke pre-trained deep learning models hosted by AWS. DetectLabels identifies objects and scenes in images with confidence scores — a photo of a beach might return labels like "Beach," "Ocean," "Sand," and "Person" with 98%, 95%, 90%, and 85% confidence respectively. DetectFaces locates faces in images and returns attributes including emotion (happy, sad, surprised), estimated age range, gender, glasses, and facial landmarks (eye position, nose, mouth corners).

RecognizeCelebrities identifies public figures in images. DetectText uses OCR to extract text from images including street signs, product labels, and documents. DetectModerationLabels identifies inappropriate content (explicit nudity, violence, drugs) using a two-level taxonomy, enabling automated content filtering pipelines. All these APIs accept images from S3 or as base64-encoded bytes, and return structured JSON responses with bounding boxes and confidence scores.`,
      quiz: [
        {
          question:
            "A media company wants to automatically flag potentially inappropriate images uploaded by users before they are published. Which Rekognition API should they use?",
          options: [
            "DetectLabels — it identifies all objects in the image including inappropriate ones",
            "DetectFaces — it identifies the people in the image for content attribution",
            "DetectModerationLabels — it identifies explicit, suggestive, or violent content using a hierarchical taxonomy",
            "CompareFaces — it verifies the uploader's identity before publishing",
          ],
          correctIndex: 2,
          explanation:
            "DetectModerationLabels is specifically designed for content moderation. It identifies explicit, suggestive, and violent content using a two-level taxonomy (e.g., 'Explicit Nudity' → 'Nudity') with confidence scores, enabling automated flagging pipelines for user-generated content platforms.",
        },
      ],
    },
    {
      heading: "Rekognition Custom Labels",
      body: `Rekognition Custom Labels extends the pre-trained models with domain-specific object recognition using transfer learning. You provide labeled training images (minimum 10 per label, recommended 100+), and Rekognition fine-tunes its base model on your dataset without requiring ML expertise. Custom Labels is appropriate for identifying proprietary objects — manufacturing defects, specific product SKUs, branded logos, or specialized medical imaging findings — that the base Rekognition models were not trained on.

The training process uses AutoML: you upload labeled images, Rekognition selects the appropriate model architecture and training hyperparameters automatically, and returns a custom model endpoint you call with the same API signature as standard Rekognition. Custom Labels supports both image-level labels (the whole image contains X) and bounding-box labels (object X is at coordinates [x1,y1,x2,y2]). This is Amazon's implementation of transfer learning as a managed service.`,
      quiz: [
        {
          question:
            "A manufacturer wants to detect a specific proprietary circuit board defect that standard Rekognition models don't recognize. What is the correct approach?",
          options: [
            "Use DetectLabels with a low confidence threshold to detect any anomalies",
            "Train a custom SageMaker model from scratch using defect images",
            "Use Rekognition Custom Labels with labeled training images of defective and non-defective boards",
            "Use Amazon Lookout for Vision which automatically detects visual defects",
          ],
          correctIndex: 2,
          explanation:
            "Rekognition Custom Labels uses transfer learning to fine-tune Rekognition's base model on your domain-specific labeled images without requiring ML expertise. It is the correct approach for recognizing proprietary objects not covered by the pre-trained Rekognition APIs. Amazon Lookout for Vision is also valid for anomaly detection, but Custom Labels is the direct Rekognition answer.",
        },
      ],
    },
    {
      heading: "Rekognition Video Analysis",
      body: `Rekognition Video extends image analysis capabilities to video content. Asynchronous video analysis uses \`StartLabelDetection\`, \`StartFaceDetection\`, \`StartPersonTracking\`, and similar APIs. You provide an S3 video URI, and Rekognition processes the video asynchronously, notifying you via SNS when complete. You then call the corresponding \`Get*\` API to retrieve timestamped results. This asynchronous model handles long videos (up to 8 hours) efficiently without blocking.

Rekognition Video Streaming Analysis processes live video from Kinesis Video Streams for real-time use cases like security surveillance (detecting persons at restricted locations), broadcast monitoring (identifying logos or content in live streams), and real-time attendance systems (identifying enrolled persons at events). Streaming analysis uses Rekognition Stream Processor, which continuously analyzes the Kinesis Video Stream and emits events when detected objects meet specified criteria.`,
      quiz: [
        {
          question:
            "A security system needs to detect unauthorized persons entering a restricted facility in a live camera feed. Which Rekognition feature supports this real-time use case?",
          options: [
            "StartFaceDetection with an S3-stored video file for batch analysis",
            "Rekognition Stream Processor analyzing a Kinesis Video Stream in real time",
            "Rekognition Custom Labels deployed on a real-time endpoint",
            "DetectFaces API called every 5 seconds on captured video frames",
          ],
          correctIndex: 1,
          explanation:
            "Rekognition Stream Processor connects to a Kinesis Video Stream and analyzes live video in real time, emitting events when detected objects or faces match specified criteria. This is the correct architecture for real-time security monitoring, rather than periodic API polling or asynchronous batch processing.",
        },
      ],
    },
    {
      heading: "Rekognition Face Search and Collections",
      body: `Rekognition Faces Collections enable scalable face search across a database of indexed faces. You create a collection, index face images using IndexFaces (which extracts facial feature vectors and stores them), then use SearchFacesByImage to find matching faces in the collection given a query image. Collections can store millions of faces and are used for identity verification, employee time-and-attendance systems, missing persons searches, and VIP customer recognition.

Rekognition stores face feature vectors (embeddings) in the collection — not the original images — which has privacy implications for GDPR and biometric data regulations. CompareFaces compares two specific face images without a collection, returning a similarity score — useful for one-to-one identity verification (verify a selfie matches a passport photo) without maintaining a database of faces. For the exam, understand the difference between SearchFacesByImage (one-to-many, requires collection) and CompareFaces (one-to-one, no collection required).`,
      quiz: [
        {
          question:
            "An HR system needs to verify that the person presenting an ID badge matches the photo on file for that employee. Which Rekognition API is most appropriate?",
          options: [
            "SearchFacesByImage — search the company's face collection for the employee",
            "CompareFaces — compare the badge photo directly against the employee's photo on file for one-to-one similarity scoring",
            "DetectFaces — detect whether a face is present in the badge image",
            "IndexFaces — add the badge scan to the face collection for future matching",
          ],
          correctIndex: 1,
          explanation:
            "CompareFaces performs one-to-one face comparison between two specific images, returning a similarity score. This is appropriate for identity verification (badge vs. file photo) without maintaining a collection. SearchFacesByImage is for one-to-many search across a collection of indexed faces.",
        },
      ],
    },
    {
      heading: "Rekognition Integration Patterns and Limitations",
      body: `Rekognition integrates with Lambda for event-driven image analysis — an S3 PutObject event triggers Lambda, which calls Rekognition and writes results to DynamoDB or publishes to SNS. This serverless pattern is common for processing user-uploaded images at scale. Rekognition results can feed into Step Functions workflows for multi-step content moderation pipelines: detect labels, check moderation, extract text, compare faces, and make a publish/reject decision.

Rekognition operates as a pre-trained managed service and is appropriate when the target objects are well-represented in its training data. It does not replace custom training for highly specialized or proprietary visual recognition tasks — those require Rekognition Custom Labels or SageMaker with a custom computer vision model. Know the confidence score threshold concept: in content moderation, a lower threshold (e.g., 50%) is more conservative (flags more content), while a higher threshold (e.g., 90%) is more permissive (only flags high-confidence violations).`,
      quiz: [
        {
          question:
            "A content platform uses Rekognition DetectModerationLabels and wants to be very conservative, flagging even low-confidence potentially inappropriate content for human review. What should they set?",
          options: [
            "A high confidence threshold (e.g., 90%) — high confidence means more certain violations",
            "A low confidence threshold (e.g., 50%) — flags more content for review, catching borderline cases",
            "The confidence threshold does not affect what Rekognition returns — it always returns all labels",
            "A threshold of exactly 75% — the AWS recommended setting for conservative moderation",
          ],
          correctIndex: 1,
          explanation:
            "Setting a lower confidence threshold causes more labels to pass the threshold and be flagged for review, resulting in conservative moderation (more flags, fewer misses). A higher threshold means only high-confidence violations are flagged, letting borderline content through. For conservative moderation requiring human review, lower the threshold.",
        },
      ],
    },
  ],

  keyFacts: [
    "DetectLabels: identifies objects and scenes with confidence scores and bounding boxes",
    "DetectFaces: returns emotions, age range, gender, facial landmarks, and quality attributes",
    "DetectModerationLabels: two-level taxonomy for explicit, suggestive, and violent content",
    "RecognizeCelebrities: identifies public figures in images",
    "Custom Labels: transfer learning for domain-specific object recognition with labeled images",
    "SearchFacesByImage: one-to-many face search in a collection of indexed face vectors",
    "CompareFaces: one-to-one face similarity scoring — no collection required",
    "Video analysis: async (S3 video + SNS notification) or real-time (Kinesis Video Streams)",
    "Stream Processor: real-time video analysis for surveillance and live broadcast use cases",
    "Rekognition stores face feature vectors (embeddings), not original images, in collections",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS Lambda",
    "Amazon Kinesis Video Streams",
    "Amazon SNS",
    "Amazon SageMaker",
    "AWS Step Functions",
  ],

  examTips: [
    "Custom Labels = transfer learning as a service for proprietary objects not in pre-trained models",
    "SearchFacesByImage = one-to-many (collection required); CompareFaces = one-to-one (no collection)",
    "DetectModerationLabels is the content moderation API — lower threshold = more conservative",
    "Video analysis: async for S3 files (StartX → SNS → GetX); real-time for Kinesis Video Streams",
    "Stream Processor = the real-time video monitoring pattern for security/surveillance scenarios",
    "Rekognition uses confidence scores — always filter on a minimum confidence appropriate to the use case",
    "Lambda + S3 trigger + Rekognition = the standard serverless image processing integration pattern",
    "Rekognition stores face embeddings, not raw images — relevant for privacy and data residency compliance",
  ],

  topicQuiz: [
    {
      question:
        "A news aggregator needs to automatically identify well-known politicians and athletes in uploaded photos. Which Rekognition API handles this?",
      options: [
        "DetectLabels — it identifies all persons in the image with confidence scores",
        "SearchFacesByImage — search a pre-built collection of politician face photos",
        "RecognizeCelebrities — it identifies public figures directly from its pre-trained knowledge base",
        "DetectFaces — it returns the faces found in the image for manual identification",
      ],
      correctIndex: 2,
      explanation:
        "RecognizeCelebrities uses Rekognition's pre-trained knowledge base to identify well-known public figures directly from an image, returning their name and links to information. This requires no custom collection setup — it works on the pre-trained model.",
    },
    {
      question:
        "What does Amazon Rekognition store in a Face Collection when you call IndexFaces?",
      options: [
        "The original face images resized to a standard resolution",
        "Facial feature vectors (embeddings) extracted from the images — not the original images themselves",
        "Encrypted versions of the original images stored in the associated S3 bucket",
        "Metadata about the images including labels and bounding boxes",
      ],
      correctIndex: 1,
      explanation:
        "Rekognition stores facial feature vectors (mathematical embeddings of facial geometry) in collections, not the original images. This has implications for privacy regulation compliance — the original biometric images are not stored by Rekognition, but the vectors are still considered biometric identifiers under many regulations.",
    },
  ],
};
