import { ServiceGuide } from "../../../types/guide";

export const mlSecurityGuide: ServiceGuide = {
  id: "mls-ml-security",
  service: "ML Security & IAM",
  domain: "security",
  tagline:
    "IAM roles, encryption, network security, and compliance patterns for ML workloads on AWS",
  intro:
    "ML security on AWS covers IAM roles for SageMaker, encryption of training data and model artifacts, VPC isolation for training jobs, compliance with HIPAA and PCI requirements, and preventing adversarial attacks on ML models. MLS-C01 tests both AWS security services and ML-specific security concepts.",

  sections: [
    {
      heading: "IAM Roles for SageMaker",
      body: `SageMaker uses IAM roles to control what actions are allowed and which resources can be accessed. The SageMaker Execution Role is assumed by SageMaker service when running training jobs, processing jobs, and endpoints. It must grant permission to read training data from S3, write model artifacts to S3, pull container images from ECR, write logs to CloudWatch, and access other services like KMS and Feature Store. Principle of least privilege applies — the execution role should only have the permissions required for the specific job, not broad AdministratorAccess.

The SageMaker Studio domain user role is a separate IAM role assumed by users within Studio, controlling which SageMaker APIs they can invoke and which S3 paths they can access. Resource-based policies on S3 buckets can add a second layer: \`aws:SourceAccount\` and \`aws:SourceArn\` conditions restrict bucket access to specific SageMaker execution roles. Service control policies (SCPs) at the AWS Organization level can enforce guardrails across all ML accounts — for example, requiring VPC configuration on all training jobs or restricting deployment to specific regions.`,
      quiz: [
        {
          question:
            "A SageMaker training job fails with an AccessDeniedException when trying to read training data from an S3 bucket. What is the most likely cause?",
          options: [
            "The S3 bucket is in a different region than the training job",
            "The SageMaker execution role does not have s3:GetObject permission on the training data bucket",
            "SageMaker does not support reading from S3 — data must be in EFS",
            "The training data must be encrypted before SageMaker can access it",
          ],
          correctIndex: 1,
          explanation:
            "SageMaker training jobs assume the SageMaker execution role to access S3. An AccessDeniedException on S3 reads means the execution role's IAM policy does not grant s3:GetObject (and s3:ListBucket) on the training data bucket and prefix. Adding these permissions to the execution role resolves the issue.",
        },
      ],
    },
    {
      heading: "Encryption for ML Data and Artifacts",
      body: `ML workloads have multiple encryption requirements: data at rest in S3 (training datasets, model artifacts, Feature Store), data in transit between services, and data on training instance local storage. S3 SSE-KMS encrypts training data at rest using AWS KMS customer-managed keys (CMKs). SageMaker Training Jobs encrypt the instance's attached EBS volume (used for temporary data during training) using KMS. Feature Store encrypts both the online store (DynamoDB, encrypted at rest) and the offline store (S3 SSE-KMS). All SageMaker API calls and inter-service communications use TLS in transit.

KMS key policies control which principals can use CMKs for encryption and decryption. The SageMaker execution role must have \`kms:GenerateDataKey\` and \`kms:Decrypt\` permissions on the CMK used to encrypt training data, or training jobs will fail. For regulated workloads, KMS CloudTrail integration logs every encryption and decryption event with the calling IAM principal — providing the audit trail required for HIPAA Business Associate Agreements and PCI DSS compliance. KMS key rotation should be enabled for long-lived CMKs.`,
      quiz: [
        {
          question:
            "A SageMaker training job fails with a KMS decryption error when reading SSE-KMS encrypted training data. What permission must the SageMaker execution role have?",
          options: [
            "kms:CreateKey permission to create a new key for decryption",
            "kms:Decrypt and kms:GenerateDataKey permissions on the specific CMK used to encrypt the training data",
            "kms:DescribeKey permission to discover which key was used for encryption",
            "s3:GetEncryptionConfiguration to retrieve the encryption settings for the bucket",
          ],
          correctIndex: 1,
          explanation:
            "When SageMaker reads SSE-KMS encrypted data from S3, it must call KMS to decrypt the data encryption key. The execution role needs kms:Decrypt (to decrypt the data key) and kms:GenerateDataKey (to write encrypted outputs). These permissions must be granted in both the IAM role policy and the KMS key policy.",
        },
      ],
    },
    {
      heading: "VPC Isolation for Training and Inference",
      body: `Running SageMaker Training Jobs and Endpoints in a VPC provides network isolation — training instances communicate with S3 via VPC Gateway Endpoints rather than the public internet, preventing data exfiltration through internet-accessible paths. VPC configuration for training jobs requires specifying SubnetIds and SecurityGroupIds. The security group must allow outbound traffic to S3 (via Gateway Endpoint), ECR (via Interface Endpoint), CloudWatch Logs (via Interface Endpoint), and SageMaker API (via Interface Endpoint) — or configure NAT Gateway for access to AWS services.

The \`EnableInterContainerTrafficEncryption\` parameter encrypts communication between distributed training instances within the VPC using TLS. This is required for some compliance frameworks (HIPAA) where any data in transit must be encrypted, including intra-cluster communication that might include model gradients or intermediate activation values. The \`EnableNetworkIsolation\` parameter (set to true) prevents training containers from making any outbound network calls — useful for running training on sensitive data where any internet access is prohibited.`,
      quiz: [
        {
          question:
            "A financial company requires that SageMaker training jobs accessing sensitive customer data have no outbound internet access. Which parameter enforces this?",
          options: [
            "VpcConfig with a private subnet that has no NAT Gateway or internet gateway",
            "EnableNetworkIsolation=true — prevents the training container from making any network calls outside the VPC",
            "EnableInterContainerTrafficEncryption=true — encrypts all network traffic from the container",
            "SageMaker Resource Policies that restrict training to specific VPC endpoints only",
          ],
          correctIndex: 1,
          explanation:
            "EnableNetworkIsolation=true prevents the training container from making any outbound network calls, including to the internet, other AWS services, or even within the VPC (except for S3 via the VPC Gateway Endpoint). This is the strongest isolation setting for sensitive ML training workloads requiring no internet access.",
        },
      ],
    },
    {
      heading: "Data Privacy and ML Compliance",
      body: `ML workloads frequently process personal data, making privacy compliance critical. For HIPAA-compliant ML workloads, AWS offers a HIPAA BAA (Business Associate Agreement) covering SageMaker, S3, Glue, Lambda, and other services. Key HIPAA technical safeguards for ML: encrypt PHI at rest (SSE-KMS), encrypt PHI in transit (TLS), audit all access (CloudTrail), implement least-privilege IAM, and de-identify PHI before training where possible. Amazon Comprehend Medical supports PHI detection for de-identification pipelines.

Data residency requirements (GDPR Article 17, various national regulations) restrict where personal data can be processed geographically. For ML, this means training jobs must run in approved AWS regions. Service Control Policies (SCPs) can enforce region restrictions organization-wide. GDPR's right to erasure (right to be forgotten) creates ML-specific challenges — if a user requests data deletion, their data may have been used in model training, and the model's weights may encode information about them. Techniques like federated learning (train on device, only share gradients) and differential privacy (add calibrated noise to training gradients) are emerging approaches for privacy-preserving ML.`,
      quiz: [
        {
          question:
            "A company wants to use patient medical records for ML training but must comply with HIPAA. Which combination of measures is required?",
          options: [
            "Encrypt data in S3 with SSE-S3 and run training in a public subnet",
            "Encrypt PHI at rest with SSE-KMS, encrypt in transit with TLS, audit all access with CloudTrail, use least-privilege IAM, run training in a VPC, and sign a HIPAA BAA with AWS",
            "Store training data in DynamoDB instead of S3 to use DynamoDB's built-in HIPAA compliance",
            "Use only SageMaker Serverless Inference since serverless resources are automatically HIPAA compliant",
          ],
          correctIndex: 1,
          explanation:
            "HIPAA compliance requires a signed BAA with AWS plus implementation of all required technical safeguards: encryption at rest (SSE-KMS), encryption in transit (TLS), audit logging (CloudTrail), access controls (IAM least privilege), and network controls (VPC isolation). No single measure is sufficient — all must be implemented together.",
        },
      ],
    },
    {
      heading: "Adversarial Attacks and ML Model Security",
      body: `ML models themselves are attack surfaces. Adversarial examples are inputs crafted to fool a model — slight perturbations to input data (imperceptible to humans) can cause a neural network to misclassify with high confidence. This is particularly dangerous for safety-critical applications like autonomous vehicle vision or medical image diagnosis. Defense techniques include adversarial training (training on adversarial examples), input preprocessing (smoothing or denoising inputs), and certified defenses (mathematical guarantees of robustness within perturbation bounds).

Model inversion attacks attempt to reconstruct training data from a deployed model's predictions — calling the model API repeatedly with varied inputs to deduce private training data features. Membership inference attacks determine whether a specific record was in the training set. These attacks are relevant for ML models trained on sensitive data (medical records, financial transactions). Mitigation strategies include output perturbation (adding calibrated noise to predictions), API rate limiting, prediction confidence masking (return only the class label, not the confidence score), and differential privacy in training.`,
      quiz: [
        {
          question:
            "A deployed ML model API returns confidence scores along with predictions. A security researcher notes this enables membership inference attacks. What is the simplest mitigation?",
          options: [
            "Encrypt the model artifact in S3 so the weights cannot be extracted",
            "Rate-limit API calls to 10 per second per client",
            "Return only the predicted class label without confidence scores — confidence masking prevents the probabilistic information needed for membership inference",
            "Move the model to a private VPC endpoint accessible only within the organization",
          ],
          correctIndex: 2,
          explanation:
            "Membership inference attacks use the model's confidence scores to determine whether a record was in the training set (training examples typically get higher confidence). Returning only the class label without confidence scores (confidence masking) removes the probabilistic information needed for the attack. This is the simplest mitigation, though not perfect — more robust solutions include differential privacy.",
        },
      ],
    },
  ],

  keyFacts: [
    "SageMaker Execution Role: must grant S3, ECR, CloudWatch, KMS, and SageMaker API permissions",
    "SSE-KMS for S3 requires kms:Decrypt and kms:GenerateDataKey in both IAM role and KMS key policy",
    "VPC isolation: route S3 traffic via Gateway Endpoint, ECR/CloudWatch via Interface Endpoints",
    "EnableNetworkIsolation=true: prevents container from making ANY outbound network calls",
    "EnableInterContainerTrafficEncryption=true: encrypts intra-cluster communication with TLS",
    "HIPAA BAA: covers SageMaker, S3, Glue, Lambda — requires encryption, audit, access controls, VPC",
    "SCPs enforce organization-wide guardrails: require VPC config, restrict to approved regions",
    "Adversarial examples: imperceptible input perturbations causing model misclassification",
    "Membership inference: determining if a record was in training set using prediction confidence",
    "Confidence masking: return only class label, not score — reduces attack surface for inference attacks",
  ],

  relatedServices: [
    "AWS IAM",
    "AWS KMS",
    "AWS CloudTrail",
    "Amazon VPC",
    "AWS Organizations",
    "Amazon Macie",
  ],

  examTips: [
    "SageMaker execution role needs both IAM permission AND KMS key policy grant for SSE-KMS access",
    "EnableNetworkIsolation=true is stronger than VPC private subnet — blocks ALL outbound network",
    "HIPAA = BAA + SSE-KMS + TLS + CloudTrail + IAM least privilege + VPC — all required together",
    "SCP at Organization level enforces ML security guardrails across all accounts and regions",
    "Adversarial examples = perturbed inputs for misclassification — adversarial training is the defense",
    "Membership inference uses confidence scores — confidence masking is the mitigation",
    "CloudTrail + KMS = audit trail for every encryption/decryption of ML training data",
    "Federated learning = train on device, share gradients — privacy-preserving ML for sensitive data",
  ],

  topicQuiz: [
    {
      question:
        "A SageMaker training job in a VPC private subnet fails because it cannot pull the training container from ECR. NAT Gateway is not configured. What is the correct solution?",
      options: [
        "Add a NAT Gateway to the subnet to allow ECR access through the internet",
        "Move the training job to a public subnet",
        "Create a VPC Interface Endpoint for ECR (com.amazonaws.region.ecr.dkr) in the VPC",
        "Store the container image in S3 instead of ECR",
      ],
      correctIndex: 2,
      explanation:
        "VPC Interface Endpoints for ECR (ecr.dkr and ecr.api) allow instances in private subnets to pull container images from ECR without internet access. This is the correct solution for VPC-isolated training environments — no NAT Gateway or internet gateway required, which is often a compliance requirement.",
    },
    {
      question:
        "An organization wants to ensure all SageMaker training jobs across all AWS accounts in their organization use VPC configuration and encrypt training volumes with KMS. What is the most scalable enforcement mechanism?",
      options: [
        "IAM policies on each SageMaker execution role requiring VPC and KMS",
        "Service Control Policies (SCPs) at the AWS Organization level denying CreateTrainingJob without VPC and KMS parameters",
        "AWS Config rules that detect non-compliant training jobs and terminate them",
        "SageMaker lifecycle configurations that automatically add VPC and KMS to all jobs",
      ],
      correctIndex: 1,
      explanation:
        "Service Control Policies (SCPs) apply guardrails at the AWS Organization level — they affect all IAM principals in all member accounts. An SCP that denies CreateTrainingJob without VPC subnets and KMS volume encryption ensures compliance across every account without requiring per-account IAM policy changes.",
    },
  ],
};
