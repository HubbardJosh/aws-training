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

**Celebrity recognition** identifies well-known public figures and returns their name, a confidence score, and an external URL for additional information. **Custom Labels** lets you train Rekognition on your own domain-specific images to detect objects unique to your use case — defects on a manufacturing line, specific vehicle models, branded logos — without writing any training code.

**DetectProtectiveEquipment** is a purpose-built API for workplace safety that detects personal protective equipment (PPE) on people in images. It identifies hard hats, face covers (masks), and hand covers (gloves), annotating each detected person with whether they are wearing the required PPE and a confidence score. This API is used in manufacturing, construction, and warehouse environments to automate safety compliance monitoring without requiring a Custom Labels training project.`,
      quiz: [
        {
          question:
            "Which Amazon Rekognition API would you use to automatically detect and categorize violent or explicit content in user-uploaded images?",
          options: [
            "DetectModerationLabels",
            "DetectLabels",
            "RecognizeCelebrities",
            "DetectFaces",
          ],
          correctIndex: 0,
          explanation:
            "DetectModerationLabels is the content moderation API. It identifies unsafe content including explicit adult content, violence, hate symbols, and more, organized in a taxonomy with confidence scores — purpose-built for content moderation pipelines.",
        },
        {
          question:
            "A manufacturing company wants to detect a proprietary defect type on circuit boards that Rekognition's base models do not recognize. Which feature addresses this?",
          options: [
            "DetectLabels with a confidence threshold lowered to catch novel objects",
            "Rekognition Custom Labels, which uses transfer learning on domain-specific images",
            "CompareFaces applied to defect reference images",
            "Celebrity recognition with a custom Collection of defect images",
          ],
          correctIndex: 1,
          explanation:
            "Rekognition Custom Labels allows training on your own domain-specific images using transfer learning. It fine-tunes Rekognition's pre-trained feature extractor on your labeled data, requiring only dozens to hundreds of images rather than millions.",
        },
      ],
    },
    {
      heading: "Facial Analysis and Recognition",
      body: `Rekognition's facial capabilities span three distinct tasks that are important to distinguish. **Facial analysis** extracts attributes from detected faces without identifying who they belong to: approximate age range, gender expression, emotions (happy, sad, confused, disgusted, calm, angry, surprised), whether the person is wearing glasses or a smile, whether eyes are open, and whether a face mask is present. This is useful for audience analytics, retail insights, and accessibility features.

**Facial comparison** takes two images and determines whether they contain the same person, returning a similarity score. This is the foundation of document-to-selfie verification workflows used in identity proofing.

**Face search** (facial recognition) uses a **Collection** — a persistent server-side index of face vectors you build by calling \`IndexFaces\`. You add faces to a Collection with an associated external ID (a user ID from your system), then call \`SearchFacesByImage\` to find which indexed faces a query image matches. Collections are stored in Rekognition's infrastructure and can hold millions of faces. Facial recognition raises significant privacy and ethical considerations; AWS requires customers to comply with applicable laws and has published use-case restrictions.`,
      quiz: [
        {
          question:
            "What must you create and populate before you can use SearchFacesByImage in Amazon Rekognition?",
          options: [
            "An SNS topic to receive face match notifications",
            "A Custom Labels project trained on face images",
            "A Stream Processor connected to Kinesis Video Streams",
            "A Collection — a persistent server-side index of face vectors built with IndexFaces",
          ],
          correctIndex: 3,
          explanation:
            "SearchFacesByImage requires a pre-built Collection. A Collection is a server-side index of face vectors that you populate by calling IndexFaces for each person, associating each face with an external ID from your system.",
        },
        {
          question:
            "What is the difference between Rekognition facial analysis and facial recognition?",
          options: [
            "Facial analysis identifies who a person is; facial recognition extracts their emotional attributes",
            "Facial analysis extracts attributes (age, emotion, glasses) without identifying the person; facial recognition matches a face against a Collection to identify the individual",
            "Facial analysis requires a Collection; facial recognition works on any image without setup",
            "They are the same capability — the terms are used interchangeably in the AWS documentation",
          ],
          correctIndex: 1,
          explanation:
            "Facial analysis (DetectFaces) extracts attributes like age range, emotions, and accessories without identifying who the person is. Facial recognition (SearchFacesByImage) matches a face against a pre-built Collection index to identify the specific individual.",
        },
      ],
    },
    {
      heading: "Text Detection and Document Analysis",
      body: `Rekognition's **text detection** capability finds and reads printed and handwritten text in natural scene images and documents. It returns each detected word and line with bounding box coordinates and confidence scores. This differs from Amazon Textract, which is purpose-built for structured document extraction with form field and table understanding — Rekognition text detection is better suited for reading text on signs, license plates, product labels, and other scene text.

The **DetectText** API handles images; for video, Rekognition uses the asynchronous video API pattern (described in the video analysis section). Text detection supports text in multiple orientations and works on low-contrast or partially occluded text, though performance degrades with very small or stylized fonts.`,
      quiz: [
        {
          question:
            "You need to read the text on road signs in dashcam images. Which AWS service is most appropriate?",
          options: [
            "Amazon Comprehend — it extracts entities and key phrases from text in images",
            "Amazon Textract — it provides the highest text extraction accuracy",
            "Amazon Rekognition DetectText — it is designed for scene text in natural images",
            "Amazon Translate — it identifies and translates text found in images",
          ],
          correctIndex: 2,
          explanation:
            "Rekognition DetectText is designed for scene text — text appearing in natural images on signs, license plates, product labels, and similar surfaces. Textract is purpose-built for structured document extraction (forms, tables) and is not optimized for scene text.",
        },
        {
          question:
            "When should you use Amazon Textract instead of Rekognition's text detection for reading text?",
          options: [
            "When you need to extract structured data from documents such as form field key-value pairs or table data",
            "When the image is stored in S3 rather than passed as raw bytes",
            "When the text appears on outdoor signs or in photographs of physical scenes",
            "When the document contains more than 1,000 words",
          ],
          correctIndex: 0,
          explanation:
            "Textract is purpose-built for structured document understanding — it extracts form field key-value pairs, table data, and layout structure from documents. Rekognition text detection is better for unstructured scene text on signs, labels, and photos.",
        },
      ],
    },
    {
      heading: "Video Analysis",
      body: `Rekognition supports both stored video analysis (asynchronous, for videos already in S3) and streaming video analysis (real-time, for live streams).

For **stored video**, you submit a \`StartLabelDetection\`, \`StartFaceDetection\`, \`StartPersonTracking\`, or other Start* API call with an S3 video path. Rekognition processes the video asynchronously and sends a completion notification to an SNS topic. You then call the corresponding \`GetLabelDetection\` call to retrieve timestamped results. This is the standard pattern for analyzing recorded content — video moderation, compliance archiving, sports highlight detection.

**Streaming video analysis** uses **Rekognition Video Stream Processors** connected to Kinesis Video Streams. You create a Stream Processor that watches a Kinesis Video Stream and emits detection events (face matches against a Collection, connected home labels) to a Kinesis Data Stream or S3. This enables real-time use cases: security camera monitoring, access control, people counting in retail environments. The stream processor model supports fragment-level or second-level granularity.`,
      quiz: [
        {
          question:
            "What is the correct pattern for analyzing a video file stored in S3 using Amazon Rekognition?",
          options: [
            "Call DetectLabels directly with the S3 URI — Rekognition handles video frames automatically",
            "Upload the video to a Kinesis Video Stream and create a Stream Processor",
            "Call a Start* API (e.g., StartLabelDetection), wait for SNS notification, then call the corresponding Get* API",
            "Use Rekognition Custom Labels with video input to detect objects frame by frame",
          ],
          correctIndex: 2,
          explanation:
            "Stored video analysis in Rekognition follows an async pattern: call Start* (e.g., StartLabelDetection) with the S3 path → Rekognition processes asynchronously → publishes completion to SNS → you call Get* (e.g., GetLabelDetection) to retrieve timestamped results.",
        },
        {
          question:
            "Which AWS service must you connect to Amazon Rekognition Stream Processors for real-time video analysis?",
          options: [
            "Amazon S3 — video files must be stored there before streaming analysis",
            "Amazon Kinesis Video Streams — provides the live video feed to the Stream Processor",
            "Amazon SNS — delivers real-time frame-level detection results",
            "AWS Elemental MediaConvert — transcodes live video for Rekognition compatibility",
          ],
          correctIndex: 1,
          explanation:
            "Rekognition Stream Processors connect to Kinesis Video Streams as the live video input source. The processor watches the stream and emits detection events to a Kinesis Data Stream or S3 — enabling real-time use cases like security monitoring and access control.",
        },
      ],
    },
    {
      heading: "Custom Labels",
      body: `While Rekognition's base models cover a broad range of general objects, many enterprise use cases require domain-specific object detection — detecting corrosion on oil pipelines, identifying specific pharmaceutical packaging, or recognizing proprietary product models on a factory floor. **Rekognition Custom Labels** addresses this without requiring ML expertise.

The workflow starts in the **Rekognition Custom Labels console**, where you create a project, upload training images to an S3 dataset, and draw bounding boxes or apply image-level labels. Rekognition uses **transfer learning** — it takes its existing pre-trained feature extractor and fine-tunes it on your labeled data — so you typically need only dozens to hundreds of images rather than the millions required to train from scratch. After training, you evaluate performance metrics (average precision, recall) and deploy the model to a dedicated endpoint. Custom Labels models support both object localization (bounding boxes) and image classification.`,
      quiz: [
        {
          question:
            "Why does Rekognition Custom Labels require far fewer training images than training a computer vision model from scratch?",
          options: [
            "Custom Labels uses crowdsourced labeling to automatically expand small datasets",
            "Custom Labels only performs image classification, which requires less data than object detection",
            "Custom Labels applies transfer learning, fine-tuning Rekognition's pre-trained feature extractor on your labeled data",
            "Custom Labels uses synthetic data augmentation to multiply a small image set into millions of samples",
          ],
          correctIndex: 2,
          explanation:
            "Rekognition Custom Labels uses transfer learning — it starts from Rekognition's existing pre-trained feature extractor (already trained on massive image datasets) and fine-tunes only the final layers on your labeled domain images. This means dozens to hundreds of images are often sufficient.",
        },
        {
          question:
            "Which two output types does Rekognition Custom Labels support?",
          options: [
            "Object localization (bounding boxes) and image classification",
            "Sentiment analysis and named entity recognition",
            "Scene description and activity detection",
            "Text detection and face recognition",
          ],
          correctIndex: 0,
          explanation:
            "Rekognition Custom Labels models support object localization (detecting objects and drawing bounding boxes around them) and image classification (assigning an overall label to an image). Both are available for custom domain-specific use cases.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A social media platform needs to automatically block user-uploaded images containing explicit content before they are published. Which Rekognition API should they use?",
      options: [
        "DetectLabels with a filter for adult-related labels",
        "DetectModerationLabels, which categorizes unsafe content including adult and violent material",
        "DetectFaces with an age range filter to block minors",
        "Custom Labels trained on a dataset of explicit images",
      ],
      correctIndex: 1,
      explanation:
        "DetectModerationLabels is the purpose-built content moderation API. It returns a taxonomy of unsafe content categories (explicit adult, suggestive, violence, hate symbols) with confidence scores, enabling automated content filtering pipelines.",
    },
    {
      question:
        "An airport security application needs to match faces from live camera feeds against a watchlist of thousands of individuals. Which Rekognition components are required?",
      options: [
        "A Collection populated with IndexFaces + a Stream Processor connected to Kinesis Video Streams",
        "DetectFaces + CompareFaces applied to each pair of camera frames",
        "Celebrity recognition with a custom external URL list",
        "Custom Labels trained on the watchlist images + DetectLabels for real-time detection",
      ],
      correctIndex: 0,
      explanation:
        "This requires a Collection (server-side face index populated with IndexFaces for each watchlist individual) and a Rekognition Stream Processor connected to Kinesis Video Streams for real-time face matching against the Collection.",
    },
    {
      question: "What does CompareFaces return when called with two images?",
      options: [
        "A similarity score indicating how likely the two images contain the same person",
        "Bounding boxes for all faces in both images along with emotion analysis",
        "The identity of the person if they are in Rekognition's celebrity database",
        "A list of all faces detected in both images with their attributes",
      ],
      correctIndex: 0,
      explanation:
        "CompareFaces takes two images and returns a similarity score representing how likely it is that both images show the same person. It is the foundation for document-to-selfie identity verification workflows.",
    },
    {
      question:
        "Which statement correctly describes the async video analysis pattern in Amazon Rekognition?",
      options: [
        "You create a Stream Processor that analyzes stored S3 video and writes results to DynamoDB",
        "You call DetectLabels with a video S3 URI and receive timestamped results synchronously",
        "You upload video to Kinesis Video Streams and poll GetStreamResults until complete",
        "You call Start* with an S3 video path, receive an SNS notification on completion, then call the corresponding Get* API",
      ],
      correctIndex: 3,
      explanation:
        "Stored video analysis is asynchronous: call a Start* API (StartLabelDetection, StartFaceDetection, etc.) → Rekognition processes and sends completion to SNS → your application calls the corresponding Get* API to retrieve timestamped results.",
    },
    {
      question:
        "A retail company wants to detect whether customers are wearing hard hats in warehouse security camera footage. Rekognition's base models don't recognize this specific item. What should they use?",
      options: [
        "A Kinesis Video Stream Processor with face detection enabled",
        "DetectProtectiveEquipment — Rekognition has a built-in PPE detection API",
        "DetectLabels with a confidence threshold of 99% to improve precision",
        "Rekognition Custom Labels trained on labeled images of workers with and without hard hats",
      ],
      correctIndex: 1,
      explanation:
        "Amazon Rekognition has a built-in DetectProtectiveEquipment API that specifically detects personal protective equipment including hard hats, face covers, and hand covers on people in images. This is a purpose-built API for workplace safety use cases.",
    },
    {
      question:
        "What is the key distinction between Rekognition's facial analysis and facial recognition capabilities for the AIF-C01 exam?",
      options: [
        "Facial analysis is more accurate; facial recognition is a legacy feature",
        "Facial analysis extracts attributes (age, emotion, accessories) without identifying identity; facial recognition matches against a Collection to identify specific individuals",
        "Facial analysis requires a Collection; facial recognition works on any image",
        "They are the same — facial analysis is the AWS term for what others call facial recognition",
      ],
      correctIndex: 1,
      explanation:
        "This is a critical distinction: facial analysis (DetectFaces) extracts non-identifying attributes like age range, emotions, glasses, and masks. Facial recognition (SearchFacesByImage against a Collection) identifies who a person is. The ethical and legal implications differ significantly.",
    },
    {
      question:
        "Which Rekognition capability would you use to build a 'find similar products' feature that shows items visually similar to one a user is viewing?",
      options: [
        "DetectLabels comparing label overlap between product images",
        "Rekognition Custom Labels with image classification for product categories",
        "CompareFaces applied to product images",
        "Rekognition Custom Labels with object localization for visual similarity scoring",
      ],
      correctIndex: 1,
      explanation:
        "For domain-specific visual similarity (product images not covered by base models), Rekognition Custom Labels trained on your product catalog is the appropriate approach. It can classify images into product categories, which can then be used to surface visually similar items.",
    },
    {
      question:
        "A sports broadcaster wants to automatically detect which athletes appear in archived game footage stored in S3. What is the correct workflow?",
      options: [
        "Create a Stream Processor and point it at the S3 video bucket",
        "Use Celebrity recognition — professional athletes are automatically indexed",
        "Call StartFaceSearch with the S3 video path and a Collection of athlete faces, then GetFaceSearch after SNS notification",
        "Call DetectFaces on each video frame in a Lambda loop",
      ],
      correctIndex: 2,
      explanation:
        "For stored video face recognition, you call StartFaceSearch with the S3 video path and a pre-built Collection (populated with the athletes' faces via IndexFaces). After receiving an SNS completion notification, call GetFaceSearch to retrieve timestamped results showing when each athlete appears.",
    },
  ],
};
