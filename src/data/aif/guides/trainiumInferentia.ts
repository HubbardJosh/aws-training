import { ServiceGuide } from "../../../types/guide";

export const trainiumInferentiaGuide: ServiceGuide = {
  id: "aif-trainium-inferentia",
  service: "AWS Trainium & Inferentia",
  domain: "deployment",
  tagline:
    "Purpose-built AWS chips for cost-efficient ML training and inference",
  intro:
    "AWS Trainium and AWS Inferentia are custom silicon chips designed by AWS specifically for machine learning workloads, offering significantly better price-performance than general-purpose GPUs for deep learning training and inference respectively.",

  sections: [
    {
      heading: "Why Custom ML Chips?",
      body: `General-purpose GPUs (like NVIDIA A100 or H100) are the dominant hardware for ML workloads, but they were originally designed for graphics rendering and repurposed for ML. While GPUs are highly capable, they carry significant cost — high-end GPU instances are among the most expensive compute available. For organizations running ML at scale, the compute bill for training large models or serving high-traffic inference endpoints is substantial.

AWS designed custom chips specifically optimized for the mathematical operations that dominate ML workloads — primarily large matrix multiplications and activation functions. By tailoring the hardware architecture to these specific operations rather than supporting a broad range of graphics and compute tasks, AWS achieves dramatically better efficiency per dollar for ML-specific workloads. These chips are part of AWS's broader custom silicon strategy (alongside Graviton for general-purpose compute and Nitro for virtualization), and they represent a significant competitive differentiator for customers running large-scale AI workloads on AWS.`,
    },
    {
      heading: "AWS Trainium: Purpose-Built for Training",
      body: `**AWS Trainium** is designed for the computationally intensive workload of training deep learning models — adjusting billions of parameters through gradient descent over millions of training steps. Trainium chips are available in EC2 **Trn1** instances, which can be configured with up to 16 Trainium chips interconnected with high-bandwidth NeuronLink fabric for distributed training.

Trainium is optimized for the forward pass and backward pass (gradient computation) operations that dominate training. Each Trainium chip contains two **NeuronCores** — specialized matrix-multiply engines — and high-bandwidth memory (HBM) to feed data to those engines fast enough to keep them utilized. The NeuronLink interconnect between chips within a node achieves very high bandwidth, enabling efficient tensor parallelism and data parallelism without the bottleneck of slower network interconnects.

AWS claims Trainium delivers up to 50% cost savings compared to comparable GPU instances for training large models. Trainium2 (Trn2 instances) represents the second generation with substantially higher per-chip performance and support for larger models.`,
    },
    {
      heading: "AWS Inferentia: Purpose-Built for Inference",
      body: `**AWS Inferentia** is designed for the inference workload — running trained models to generate predictions for live requests at high throughput and low latency. While training happens once (or periodically), inference runs continuously at production scale, making inference cost a dominant component of AI operating costs. Inferentia is available in EC2 **Inf1** (first generation) and **Inf2** (second generation) instances.

Inferentia's architecture is optimized for the inference access pattern: loading a fixed trained model and running it repeatedly on new inputs. Inferentia2 chips include large on-chip memory to cache model weights, reducing expensive off-chip memory bandwidth — critical for large model inference where weight loading is often the bottleneck. Multiple Inferentia chips can be used together for model sharding, enabling inference on models too large to fit on a single chip.

AWS positions Inferentia as achieving up to 40% better price-performance than comparable GPU instances for inference workloads. At scale, this translates to meaningful cost savings for high-traffic ML endpoints. SageMaker supports deploying models to Inf1 and Inf2 instances through the standard endpoint configuration.`,
    },
    {
      heading: "AWS Neuron SDK",
      body: `Both Trainium and Inferentia are programmed through the **AWS Neuron SDK** — a software development kit that integrates with familiar ML frameworks. Neuron provides compiler, runtime, and profiling tools for PyTorch and TensorFlow (via \`torch-neuronx\` and \`tensorflow-neuron\` packages).

The **Neuron compiler** takes a standard PyTorch or TensorFlow model and compiles it to an optimized binary for the NeuronCore architecture. This compilation step performs operator fusion (combining multiple operations into single hardware-efficient kernels), data type optimization (using BF16 or FP16 where safe), and memory layout optimization. The compiled model runs through the **Neuron runtime** on the chip.

For most workloads, migrating from GPU to Trainium/Inferentia requires minimal code changes — you install the Neuron SDK packages, wrap your model compilation call with \`torch_neuronx.trace()\`, and the rest of your training or inference code remains unchanged. The Neuron SDK also includes a **profiler** for analyzing where time is spent and a **performance dashboard** for monitoring hardware utilization.`,
    },
    {
      heading: "When to Use Trainium and Inferentia",
      body: `Choosing between GPU instances and Trainium/Inferentia instances requires understanding your workload characteristics and cost sensitivity.

**Choose Trainium** when you are training large deep learning models (particularly transformer-based models for NLP, vision, or multimodal tasks) at scale and want to reduce training costs. Trainium delivers the most value for workloads that run training jobs repeatedly — continuous model updates, regular retraining cycles, or large-scale fine-tuning campaigns. If your training workload uses custom CUDA kernels that have no Neuron equivalent, GPU instances remain the better choice.

**Choose Inferentia** when you are running high-throughput, latency-sensitive inference on standard model architectures (BERT, GPT-style models, ResNet, YOLO, and other common architectures) and want to reduce per-inference cost. Inferentia is particularly well-suited for steady-state production inference where the model is stable and the primary concern is serving cost. SageMaker makes it straightforward to deploy to Inf2 instances — you specify the instance type in your endpoint configuration and the Neuron SDK handles compilation automatically if you use SageMaker Neo or the Neuron compilation pipeline.

For ad-hoc experimentation, prototype development, and workloads with unusual operator requirements, standard GPU instances (P3, P4, P5) provide broader compatibility and are still the default recommendation.`,
    },
  ],

  keyFacts: [
    "Trainium = custom chip for ML training; Inferentia = custom chip for ML inference",
    "Available as EC2 instance families: Trn1/Trn2 (Trainium), Inf1/Inf2 (Inferentia)",
    "AWS Neuron SDK integrates with PyTorch and TensorFlow for both chips",
    "Neuron compiler optimizes model graphs for NeuronCore architecture",
    "Trainium claims up to 50% cost savings vs GPU for training large models",
    "Inferentia claims up to 40% better price-performance vs GPU for inference",
    "NeuronLink fabric connects multiple Trainium chips for distributed training",
    "Inferentia2 has large on-chip memory to cache model weights for low-latency inference",
    "SageMaker supports Inf1/Inf2 instance types for managed endpoint deployment",
    "Best for standard architectures (transformers, CNNs) — custom CUDA kernels need GPUs",
  ],

  relatedServices: [
    "Amazon SageMaker",
    "Amazon EC2",
    "Amazon Bedrock",
    "AWS Deep Learning AMIs",
    "Amazon EKS",
  ],

  examTips: [
    "Trainium = training; Inferentia = inference — the names are mnemonics",
    "Both use the AWS Neuron SDK — same programming model for both chips",
    "Key benefit: cost savings vs GPU at scale — up to 50% (training) and 40% (inference)",
    "Neuron compiler compiles standard PyTorch/TensorFlow models — minimal code changes needed",
    "Trn1/Trn2 instances for Trainium; Inf1/Inf2 instances for Inferentia",
    "Not suited for workloads requiring custom CUDA kernels",
    "SageMaker can deploy to Inf2 endpoints like any other instance type",
  ],
};
