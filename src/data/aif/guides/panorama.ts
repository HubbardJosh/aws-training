import { ServiceGuide } from "../../../types/guide";

export const panoramaGuide: ServiceGuide = {
  id: "aif-panorama",
  service: "AWS Panorama",
  domain: "deployment",
  tagline:
    "Add computer vision to on-premises cameras without cloud connectivity",
  intro:
    "AWS Panorama is a machine learning service that enables you to run computer vision models on network-connected cameras at the edge — on-premises, in factories, stores, or other physical environments — without requiring those cameras to stream video to the cloud.",

  sections: [
    {
      heading: "The Edge Computer Vision Problem",
      body: `Many organizations have fleets of on-premises cameras — factory floor cameras monitoring assembly lines, retail cameras tracking foot traffic, warehouse cameras watching conveyor belts — where they want to apply computer vision to detect defects, count people, identify safety violations, or measure operational metrics. The naive approach is streaming all video to the cloud for analysis, but this creates multiple problems: high bandwidth costs, latency (cloud round-trips take hundreds of milliseconds), and data privacy concerns around continuously streaming video of employees and customers to remote servers.

AWS Panorama solves this by bringing ML inference to the camera. Models are deployed to on-premises hardware that connects to local cameras, processes video frames locally, and sends only inference results (not raw video) to the cloud. This reduces bandwidth dramatically, reduces latency to milliseconds, and keeps sensitive video data on-premises.`,
      quiz: [
        {
          question:
            "What key advantage does AWS Panorama provide over streaming camera video to the cloud for analysis?",
          options: [
            "It provides more accurate computer vision models than cloud services",
            "It integrates with Amazon Rekognition for real-time facial recognition",
            "It reduces bandwidth, lowers latency, and keeps sensitive video data on-premises",
            "It enables training new ML models directly on the camera hardware",
          ],
          correctIndex: 2,
          explanation:
            "Panorama brings ML inference to the edge, reducing bandwidth costs, achieving millisecond latency (vs. hundreds of milliseconds for cloud round-trips), and keeping sensitive video data on-premises for privacy.",
        },
        {
          question:
            "A factory wants to apply computer vision to existing IP cameras to detect defects without streaming video to AWS. Which service solves this?",
          options: [
            "Amazon Rekognition with Kinesis Video Streams",
            "Amazon SageMaker real-time endpoints",
            "AWS IoT Greengrass with custom inference containers",
            "AWS Panorama with the Panorama Appliance",
          ],
          correctIndex: 3,
          explanation:
            "AWS Panorama is designed exactly for this scenario — running ML inference on-premises using existing IP cameras without streaming raw video to the cloud. Only inference results are sent to AWS.",
        },
        {
          question:
            "What does AWS Panorama send to the cloud from its on-premises deployment?",
          options: [
            "Compressed video streams at reduced resolution",
            "Raw video frames for all cameras",
            "Audio and video combined streams",
            "Only inference results and device telemetry",
          ],
          correctIndex: 3,
          explanation:
            "A core design principle of Panorama is that only inference results (e.g., defect detected, person count) and device telemetry travel to AWS — raw video never leaves the on-premises environment.",
        },
      ],
    },
    {
      heading: "The Panorama Appliance",
      body: `The **AWS Panorama Appliance** is an edge hardware device that connects to your local network and to your existing IP cameras via RTSP streams. The appliance runs the Panorama software stack, which manages model deployment, video ingestion from multiple camera streams, inference execution, and result reporting. A single appliance can process streams from multiple cameras simultaneously.

You manage Panorama Appliances through the **AWS Panorama console** in the cloud. From the console, you register appliances, deploy computer vision applications (packaged as **Panorama Applications**), update models, and monitor device health. The appliance communicates with the cloud control plane for management operations but does not send video frames to the cloud — only inference results and device telemetry travel to AWS.

The Panorama Appliance Developer Kit (a development board) allows you to build and test Panorama applications before deploying to production appliances.`,
      quiz: [
        {
          question:
            "How does the AWS Panorama Appliance connect to existing on-premises IP cameras?",
          options: [
            "RTSP streams over the local network",
            "HDMI capture cards on the appliance",
            "USB direct connection to camera hardware",
            "WiFi direct peer-to-peer connection",
          ],
          correctIndex: 0,
          explanation:
            "The Panorama Appliance connects to existing IP cameras via RTSP (Real-Time Streaming Protocol) streams over the local network. No camera replacement is needed — it works with existing camera infrastructure.",
        },
        {
          question:
            "Where are Panorama Appliances registered, configured, and monitored?",
          options: [
            "Through the AWS Panorama console in the cloud",
            "Via AWS Systems Manager Agent installed on the appliance",
            "Through Amazon CloudWatch Logs only",
            "Directly on the appliance's local web interface",
          ],
          correctIndex: 0,
          explanation:
            "Panorama Appliances are managed through the AWS Panorama console in the cloud. From there you register devices, deploy applications, update models, and monitor device health — the appliance communicates with the cloud control plane for management.",
        },
        {
          question:
            "What tool does AWS provide for developers to build and test Panorama applications before production deployment?",
          options: [
            "Amazon Rekognition Custom Labels console",
            "AWS Panorama Simulator in SageMaker Studio",
            "AWS CloudFormation Panorama stack template",
            "AWS Panorama Appliance Developer Kit",
          ],
          correctIndex: 3,
          explanation:
            "The Panorama Appliance Developer Kit is a development board that allows building and testing Panorama applications locally before deploying to production appliances.",
        },
      ],
    },
    {
      heading: "Panorama Applications and Models",
      body: `A **Panorama Application** is the unit of deployment. It consists of a **computer vision model** and **application code** that processes model outputs and generates results. Models can be trained in Amazon SageMaker, imported from SageMaker, or brought from third-party training environments — Panorama supports models in TensorFlow, PyTorch, and ONNX formats via the SageMaker Neo compilation toolchain, which compiles models for the specific hardware on the appliance.

The application code (written in Python) receives video frames, preprocesses them for the model, runs inference, postprocesses outputs (bounding boxes, classification labels, confidence scores), and decides what to do with results. Results might be sent to an IoT message (via AWS IoT Greengrass or direct MQTT), an S3 bucket, or a custom API endpoint. A factory defect detection application might send an alert to a manufacturing execution system; a people-counting application might write occupancy metrics to Amazon CloudWatch.`,
      quiz: [
        {
          question:
            "Which compilation toolchain is used to prepare ML models for deployment on the AWS Panorama Appliance?",
          options: [
            "ONNX Runtime Optimizer",
            "AWS Graviton compiler toolchain",
            "AWS Deep Learning Compiler (DLC)",
            "SageMaker Neo",
          ],
          correctIndex: 3,
          explanation:
            "SageMaker Neo compiles models for the specific hardware on the Panorama Appliance. It supports TensorFlow, PyTorch, and ONNX models and optimizes them for efficient inference on the edge device.",
        },
        {
          question:
            "A Panorama application detects unsafe PPE conditions and must alert a manufacturing execution system in real time. Which output mechanism would be most appropriate?",
          options: [
            "Sending an IoT message via MQTT or AWS IoT Greengrass",
            "Streaming to Amazon Kinesis Video Streams",
            "Calling Amazon Rekognition APIs directly from the appliance",
            "Writing raw video frames to Amazon S3",
          ],
          correctIndex: 0,
          explanation:
            "Panorama applications can send inference results as IoT messages via MQTT or AWS IoT Greengrass. This enables real-time alerting to downstream systems like manufacturing execution systems.",
        },
        {
          question:
            "Which model formats does AWS Panorama support for deployment to the appliance?",
          options: [
            "PyTorch and Scikit-learn only",
            "Only models exported from Amazon Rekognition Custom Labels",
            "TensorFlow, PyTorch, and ONNX",
            "Only SageMaker built-in algorithm artifacts",
          ],
          correctIndex: 2,
          explanation:
            "Panorama supports TensorFlow, PyTorch, and ONNX format models. These are compiled for the appliance hardware via SageMaker Neo. Models can come from SageMaker or third-party training environments.",
        },
      ],
    },
    {
      heading: "Deployment and Management",
      body: `Panorama uses an **over-the-air update** model. You package your application and model, create a deployment in the console, and Panorama pushes the update to your registered appliances automatically. This means you can update models on dozens of edge devices from a single cloud control plane action without physically accessing the devices.

**Model versioning** allows you to test new model versions on a subset of appliances before rolling out broadly — similar to a blue/green deployment for edge ML. You can monitor appliance health, application logs, and inference metrics through CloudWatch. Panorama integrates with AWS IoT for bidirectional messaging — the appliance can receive configuration updates and send inference results as IoT messages that trigger downstream Lambda functions or Step Functions workflows.`,
      quiz: [
        {
          question:
            "A company has 50 Panorama Appliances in warehouses across the country and needs to update the defect detection model. How does Panorama handle this?",
          options: [
            "A technician must physically visit each appliance to install the update",
            "Appliances pull updates from an S3 bucket on a weekly schedule",
            "Models are updated over-the-air from the cloud console to all registered appliances",
            "Models are only updated when the appliance is rebooted",
          ],
          correctIndex: 2,
          explanation:
            "Panorama uses an over-the-air update model. You create a deployment in the cloud console and Panorama pushes the update to all registered appliances automatically — no physical access required.",
        },
        {
          question:
            "How can Panorama model deployments be rolled out cautiously to minimize risk?",
          options: [
            "Test new model versions on a subset of appliances before broad rollout",
            "Deploy to cloud endpoints first, then push to appliances",
            "Deploy to all appliances simultaneously and roll back if errors occur",
            "Use A/B testing within a single appliance by alternating models",
          ],
          correctIndex: 0,
          explanation:
            "Panorama supports model versioning, allowing you to deploy a new model version to a subset of appliances first — similar to a blue/green deployment. This limits risk before a full fleet rollout.",
        },
        {
          question:
            "Which AWS service does Panorama integrate with to trigger downstream workflows based on inference results?",
          options: [
            "Amazon Kinesis Data Firehose",
            "Amazon SQS only",
            "AWS Batch",
            "AWS IoT with Lambda and Step Functions",
          ],
          correctIndex: 3,
          explanation:
            "Panorama integrates with AWS IoT for bidirectional messaging. Inference results sent as IoT messages can trigger downstream Lambda functions or Step Functions workflows for automated responses.",
        },
      ],
    },
    {
      heading: "Use Cases and Positioning",
      body: `Panorama is designed for **industrial and operational computer vision** — scenarios where cameras are already deployed on-premises, video must stay local for privacy or bandwidth reasons, and real-time (sub-second) inference is needed. Common use cases include manufacturing quality inspection (detecting defects on production lines), workplace safety monitoring (detecting missing PPE, unsafe postures), retail analytics (foot traffic counting, shelf occupancy detection), and logistics (package sorting validation, vehicle detection in loading docks).

Panorama is distinct from Rekognition (cloud-based, works on images/video already in AWS) and SageMaker (model training and cloud-based inference). The key differentiator is **edge deployment to existing cameras** — you do not need to replace your camera infrastructure, and your video stays on-premises. The trade-off is that Panorama requires managing physical hardware and is limited to the compute capacity of the appliance.`,
      quiz: [
        {
          question:
            "A retail chain wants to count foot traffic in stores using existing security cameras without uploading video to the cloud. Which service is most appropriate?",
          options: [
            "Amazon Rekognition with Kinesis Video Streams",
            "Amazon SageMaker real-time endpoint behind API Gateway",
            "AWS Panorama deployed to existing camera infrastructure",
            "Amazon Comprehend with custom entity detection",
          ],
          correctIndex: 2,
          explanation:
            "AWS Panorama is purpose-built for this scenario — edge computer vision on existing cameras without streaming video to the cloud. It handles people counting and other operational CV tasks on-premises.",
        },
        {
          question:
            "What is the primary trade-off of using AWS Panorama compared to cloud-based Rekognition?",
          options: [
            "Panorama does not integrate with SageMaker for model training",
            "Panorama cannot detect defects as accurately as Rekognition Custom Labels",
            "Panorama supports fewer model architectures than Rekognition",
            "Panorama requires physical hardware management and is limited to appliance compute capacity",
          ],
          correctIndex: 3,
          explanation:
            "The trade-off for Panorama's edge benefits (privacy, low latency, reduced bandwidth) is that it requires managing physical hardware and is constrained by the compute capacity of the appliance.",
        },
        {
          question:
            "Which scenario is the BEST fit for AWS Panorama rather than Amazon Rekognition?",
          options: [
            "Detecting safety violations in real time using cameras already installed in a factory",
            "Running facial recognition on pre-recorded video stored in S3",
            "Moderating content in videos uploaded to a streaming platform",
            "Analyzing images uploaded by users to an S3 bucket",
          ],
          correctIndex: 0,
          explanation:
            "Panorama is designed for real-time on-premises inference using existing cameras. Rekognition is cloud-based and processes images/video already in AWS. Real-time factory floor analysis requiring video privacy is Panorama's sweet spot.",
        },
      ],
    },
  ],

  keyFacts: [
    "Edge computer vision — runs ML inference on-premises, not in the cloud",
    "Connects to existing IP cameras via RTSP streams; no camera replacement needed",
    "Video stays on-premises; only inference results sent to cloud",
    "Panorama Appliance is the edge hardware device",
    "Panorama Applications package model + Python inference code",
    "Supports TensorFlow, PyTorch, ONNX models via SageMaker Neo compilation",
    "Over-the-air model updates from cloud console to all registered appliances",
    "Integrates with CloudWatch for monitoring and IoT for messaging",
    "Use cases: defect detection, safety monitoring, retail analytics, logistics",
    "Developer Kit available for local testing before production deployment",
  ],

  relatedServices: [
    "Amazon SageMaker",
    "Amazon Rekognition",
    "AWS IoT Greengrass",
    "Amazon CloudWatch",
    "AWS IoT Core",
  ],

  examTips: [
    "Panorama = edge CV on existing cameras; Rekognition = cloud CV on images/video in AWS",
    "Key benefit: video stays on-premises (privacy/bandwidth) — only results go to cloud",
    "Panorama Appliance connects to IP cameras via RTSP — no hardware replacement needed",
    "Models must be compiled for the appliance hardware via SageMaker Neo",
    "Over-the-air updates allow fleet-wide model rollouts from the console",
    "For real-time on-premises inference (< 100ms), Panorama beats cloud round-trips",
  ],

  topicQuiz: [
    {
      question:
        "What is the primary architectural difference between AWS Panorama and Amazon Rekognition?",
      options: [
        "Panorama uses ONNX models only; Rekognition uses TensorFlow only",
        "Panorama supports more object categories than Rekognition",
        "Panorama requires custom model training; Rekognition uses pre-built models only",
        "Panorama runs inference on-premises at the edge; Rekognition processes images/video in the cloud",
      ],
      correctIndex: 3,
      explanation:
        "Panorama runs ML inference on-premises using the Panorama Appliance connected to local cameras. Rekognition is a cloud service that processes images and video already stored in or streamed to AWS.",
    },
    {
      question:
        "A logistics company needs sub-100ms inference on conveyor belt cameras to reject defective packages. Which deployment pattern achieves this?",
      options: [
        "Amazon Rekognition streaming video analysis via Kinesis",
        "SageMaker real-time endpoint behind a VPN tunnel",
        "AWS Panorama with on-premises inference on the Panorama Appliance",
        "Lambda function triggered by S3 uploads of camera snapshots",
      ],
      correctIndex: 2,
      explanation:
        "Panorama achieves millisecond latency by running inference locally on the Panorama Appliance. Cloud-based approaches like Rekognition or SageMaker endpoints add hundreds of milliseconds for the round-trip.",
    },
    {
      question:
        "Which compilation step is mandatory before deploying a PyTorch model to the AWS Panorama Appliance?",
      options: [
        "Converting the model to ONNX format manually",
        "Compiling the model using SageMaker Neo for the appliance hardware",
        "Quantizing the model to INT4 using TensorRT",
        "Packaging the model into a SageMaker built-in algorithm container",
      ],
      correctIndex: 1,
      explanation:
        "SageMaker Neo compiles models for the specific hardware on the Panorama Appliance. This step optimizes the model graph for the NeuronCore-based hardware and is required before deployment.",
    },
    {
      question:
        "A Panorama application detects occupancy counts and must write metrics for dashboarding and alerting. Which AWS service is the natural destination for these metrics?",
      options: [
        "Amazon DynamoDB",
        "Amazon Redshift",
        "Amazon CloudWatch",
        "AWS Glue Data Catalog",
      ],
      correctIndex: 2,
      explanation:
        "Panorama integrates with Amazon CloudWatch for monitoring appliance health, application logs, and inference metrics. CloudWatch is the natural destination for operational metrics and alerting.",
    },
    {
      question:
        "Why does AWS Panorama connect to cameras via RTSP rather than requiring proprietary hardware?",
      options: [
        "RTSP provides higher video quality than other protocols",
        "RTSP is a standard protocol used by most IP cameras, so no camera replacement is needed",
        "RTSP is the only protocol supported by the SageMaker Neo compiler",
        "RTSP encrypts video streams end-to-end for security",
      ],
      correctIndex: 1,
      explanation:
        "RTSP (Real-Time Streaming Protocol) is a standard protocol supported by most IP cameras. By using RTSP, Panorama connects to existing camera infrastructure without requiring organizations to replace their cameras.",
    },
    {
      question:
        "A company wants to test a new defect detection model on 5 out of 100 factory appliances before a full rollout. How does Panorama support this?",
      options: [
        "A separate Panorama application must be created for test appliances",
        "Panorama does not support partial rollouts — all appliances must update together",
        "Model versioning allows deploying a new version to a subset of appliances first",
        "The Developer Kit is used to simulate production appliances before rollout",
      ],
      correctIndex: 2,
      explanation:
        "Panorama's model versioning capability supports deploying new versions to a subset of registered appliances, similar to a blue/green deployment. This limits risk before a full fleet rollout.",
    },
    {
      question: "What does the AWS Panorama Appliance Developer Kit enable?",
      options: [
        "Building and testing Panorama applications before deploying to production appliances",
        "Converting ONNX models to Panorama-compatible format",
        "Simulating camera streams in the AWS cloud without physical hardware",
        "Training new CV models using on-device compute",
      ],
      correctIndex: 0,
      explanation:
        "The Panorama Appliance Developer Kit is a development board that allows building and testing Panorama applications locally before deploying to production appliances — reducing development cycle time.",
    },
    {
      question: "Which scenario is NOT a typical AWS Panorama use case?",
      options: [
        "Analyzing sentiment in customer service call recordings",
        "Counting foot traffic in retail stores using existing security cameras",
        "Detecting missing PPE on a factory floor in real time",
        "Validating package sorting on warehouse conveyor belts",
      ],
      correctIndex: 0,
      explanation:
        "Panorama is a computer vision service for camera-based video analysis. Sentiment analysis in audio is handled by Amazon Transcribe (for speech-to-text) and Amazon Comprehend (for sentiment). Panorama has no audio analysis capability.",
    },
  ],
};
