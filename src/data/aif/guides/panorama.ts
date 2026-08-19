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
    },
    {
      heading: "The Panorama Appliance",
      body: `The **AWS Panorama Appliance** is an edge hardware device that connects to your local network and to your existing IP cameras via RTSP streams. The appliance runs the Panorama software stack, which manages model deployment, video ingestion from multiple camera streams, inference execution, and result reporting. A single appliance can process streams from multiple cameras simultaneously.

You manage Panorama Appliances through the **AWS Panorama console** in the cloud. From the console, you register appliances, deploy computer vision applications (packaged as **Panorama Applications**), update models, and monitor device health. The appliance communicates with the cloud control plane for management operations but does not send video frames to the cloud — only inference results and device telemetry travel to AWS.

The Panorama Appliance Developer Kit (a development board) allows you to build and test Panorama applications before deploying to production appliances.`,
    },
    {
      heading: "Panorama Applications and Models",
      body: `A **Panorama Application** is the unit of deployment. It consists of a **computer vision model** and **application code** that processes model outputs and generates results. Models can be trained in Amazon SageMaker, imported from SageMaker, or brought from third-party training environments — Panorama supports models in TensorFlow, PyTorch, and ONNX formats via the SageMaker Neo compilation toolchain, which compiles models for the specific hardware on the appliance.

The application code (written in Python) receives video frames, preprocesses them for the model, runs inference, postprocesses outputs (bounding boxes, classification labels, confidence scores), and decides what to do with results. Results might be sent to an IoT message (via AWS IoT Greengrass or direct MQTT), an S3 bucket, or a custom API endpoint. A factory defect detection application might send an alert to a manufacturing execution system; a people-counting application might write occupancy metrics to Amazon CloudWatch.`,
    },
    {
      heading: "Deployment and Management",
      body: `Panorama uses an **over-the-air update** model. You package your application and model, create a deployment in the console, and Panorama pushes the update to your registered appliances automatically. This means you can update models on dozens of edge devices from a single cloud control plane action without physically accessing the devices.

**Model versioning** allows you to test new model versions on a subset of appliances before rolling out broadly — similar to a blue/green deployment for edge ML. You can monitor appliance health, application logs, and inference metrics through CloudWatch. Panorama integrates with AWS IoT for bidirectional messaging — the appliance can receive configuration updates and send inference results as IoT messages that trigger downstream Lambda functions or Step Functions workflows.`,
    },
    {
      heading: "Use Cases and Positioning",
      body: `Panorama is designed for **industrial and operational computer vision** — scenarios where cameras are already deployed on-premises, video must stay local for privacy or bandwidth reasons, and real-time (sub-second) inference is needed. Common use cases include manufacturing quality inspection (detecting defects on production lines), workplace safety monitoring (detecting missing PPE, unsafe postures), retail analytics (foot traffic counting, shelf occupancy detection), and logistics (package sorting validation, vehicle detection in loading docks).

Panorama is distinct from Rekognition (cloud-based, works on images/video already in AWS) and SageMaker (model training and cloud-based inference). The key differentiator is **edge deployment to existing cameras** — you do not need to replace your camera infrastructure, and your video stays on-premises. The trade-off is that Panorama requires managing physical hardware and is limited to the compute capacity of the appliance.`,
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
};
