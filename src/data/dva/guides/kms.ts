import { ServiceGuide } from "../../../types/guide";

export const kmsGuide: ServiceGuide = {
  id: "aws-kms",
  service: "AWS KMS",
  domain: "security",
  tagline: "Create and control encryption keys used to encrypt your data",
  intro:
    "KMS (Key Management Service) is a managed service for creating and controlling cryptographic keys used to encrypt data across AWS services and in your applications. It integrates with CloudTrail to log all key usage.",

  sections: [
    {
      heading: "Key Types",
      body: `KMS provides three tiers of key management, each with different control and responsibility tradeoffs.

**AWS Managed Keys** are created and maintained by AWS on your behalf for specific services — you'll see these referenced as \`aws/s3\`, \`aws/lambda\`, or \`aws/dynamodb\` in the console. You cannot use them directly in your own API calls, cannot customize their policies, and cannot delete or disable them. They rotate automatically every year (recently extended to three years for some services) and are free to use, with charges only for API calls made on your behalf.

**Customer Managed Keys (CMKs)** are keys you create and fully control. You write the key policy, set an alias, choose whether to enable automatic rotation, and can schedule deletion. CMKs cost $1 per month per key plus $0.03 per 10,000 API calls. Because you control the key policy, you can share CMKs across accounts, restrict which services can use them, and audit every usage event in CloudTrail. For compliance-sensitive workloads, CMKs are the right choice.

**Customer-Provided Keys (SSE-C in S3)** represent the extreme: you manage the key material entirely outside AWS and provide it on every API request. S3 encrypts or decrypts the object using your key but never stores the key itself — only an HMAC for verification. You must use HTTPS for all SSE-C requests. This option is rarely used because the operational burden of managing key material externally is high. **AWS CloudHSM** is a related option where you manage dedicated hardware security modules with FIPS 140-2 Level 3 certification in a single-tenant configuration; KMS can use CloudHSM as a custom key store for the highest compliance requirements.`,
    },
    {
      heading: "Key Material Origin",
      body: `Beyond who manages a key, KMS distinguishes between where the key's underlying cryptographic material is generated and stored — and this choice has compliance and operational consequences.

**KMS-generated** key material is the default and most common option. KMS creates the material inside FIPS 140-2 validated hardware security modules and manages it entirely. You never see or handle the raw key bytes.

**External (BYOK — Bring Your Own Key)** lets you import key material that you generated outside of AWS into a CMK. The key material lives in KMS, but you retain ownership: you can delete it from KMS at any time, which permanently renders all data encrypted with that key inaccessible. This is both a compliance feature (you can prove you control the key material) and a risk (accidental deletion is irreversible). Automatic rotation is not available for keys with imported material — you must rotate manually by creating a new CMK and updating references.

**Custom Key Store (CloudHSM)** stores key material in your own CloudHSM cluster rather than in KMS-managed HSMs. This gives you single-tenant HSM isolation with FIPS 140-2 Level 3 compliance. The operational overhead is significantly higher — you manage the CloudHSM cluster — but some regulatory frameworks specifically require this level of isolation.`,
    },
    {
      heading: "Envelope Encryption",
      body: `KMS's direct \`Encrypt\` and \`Decrypt\` APIs are limited to data of 4 KB or less. For encrypting application data of any size, the standard approach is **envelope encryption**, which solves the size problem while keeping the master key material safely inside KMS.

The encryption flow has three steps. First, call \`KMS:GenerateDataKey\` with your CMK's ARN — KMS returns both a **plaintext Data Encryption Key (DEK)** and an **encrypted DEK** (a ciphertext blob). Second, use the plaintext DEK to encrypt your data locally using AES-256-GCM — this happens entirely in your application's memory without any network call. Third, discard the plaintext DEK from memory and store the encrypted DEK alongside the encrypted data, in the same object metadata, database row, or S3 object.

Decryption reverses the process: call \`KMS:Decrypt\` with the encrypted DEK to recover the plaintext DEK, then decrypt the data locally, then discard the plaintext DEK again. The CMK never leaves KMS and is never directly applied to your data — KMS only ever decrypts the small DEK blob.

The practical benefits are significant: there's no size limit on the data you encrypt, you make only one KMS API call per object (not per operation), and the encrypted DEK is useless without KMS access, so your data is protected even if the encrypted bytes are leaked. \`GenerateDataKeyWithoutPlaintext\` is a variant that returns only the encrypted DEK — useful for pre-generating keys for future encryption operations without returning plaintext material that must be immediately handled.`,
    },
    {
      heading: "Key Policies & Access Control",
      body: `Every CMK has a **key policy** — a resource-based policy document that is the primary mechanism controlling access to the key. The most important thing to understand about key policies is that **IAM policies alone cannot grant access to a KMS key**. Even if an IAM policy grants \`kms:Decrypt\` on a key ARN, that permission is useless unless the key policy also allows it. Both must align.

The default key policy that KMS creates when you make a new CMK grants the AWS account's root user full access to the key, and it explicitly allows IAM policies to delegate access to other principals in the account. This is the delegation statement — without it, IAM policies for IAM users and roles would have no effect on the key.

**Grants** are a programmatic mechanism for delegating specific permissions on a key to AWS services or other principals. When Secrets Manager or EBS needs to use your CMK to encrypt data on your behalf, it creates a grant on the key. Grants are more granular than key policies and can be retired when the delegated work is complete.

For **cross-account key sharing**, two things must both be true: the key policy must include the external account's principal, and the external account must have an IAM policy granting the relevant \`kms:*\` actions on the key ARN. The \`kms:ViaService\` condition key lets you restrict a key so it can only be used when the API call comes through a specific AWS service — for example, \`"kms:ViaService": "s3.us-east-1.amazonaws.com"\` ensures the key can only be used for S3 encryption, preventing direct \`Decrypt\` calls from application code.`,
    },
    {
      heading: "Key Rotation",
      body: `Key rotation is an important part of cryptographic hygiene, and KMS handles automatic rotation in a way that is transparent to your application — no re-encryption of existing data is required.

When you enable **automatic rotation** on a CMK with KMS-generated material, KMS creates new key material once a year and begins using it for all new encryption operations. Critically, the old key material is never deleted — KMS retains every version of the key material and uses the correct version automatically when decrypting ciphertext encrypted with that version. The key ID, ARN, aliases, and key policy all remain the same, so your application code that references the key ARN requires no changes. The rotation is entirely transparent.

**Manual rotation** is required for keys with imported material (BYOK) or when you want to rotate on a different schedule. The process is to create a new CMK, update all aliases and application configurations to point to the new key, and keep the old key enabled (but not actively used) until you've re-encrypted all data protected by it. Only then can you disable the old key.

**Key deletion** must be handled carefully because it is irreversible. When you schedule a CMK for deletion, you set a waiting period of 7 to 30 days. During that window, the key is disabled and cannot be used, but you can cancel the deletion. After the waiting period, the key and all of its material are permanently gone — any data encrypted with it becomes permanently inaccessible. Always verify that no data depends on a key before scheduling deletion, and use CloudTrail to check recent usage.`,
    },
    {
      heading: "Encryption Context",
      body: `An **encryption context** is an optional set of key-value pairs you can include with any KMS encrypt or decrypt operation. It's a powerful mechanism for binding encrypted data to its intended use case and preventing ciphertext from being misused out of context.

The encryption context itself is not a secret — it's stored as additional authenticated data (AAD) and is not encrypted. Its security value comes from the fact that KMS cryptographically binds the context to the ciphertext: you must provide the exact same context on decrypt that you used on encrypt. If the context doesn't match — even a single character difference — KMS returns \`InvalidCiphertextException\` and the decryption fails.

A practical example: encrypt a session token with context \`{"userId": "123", "purpose": "session"}\`. Even if an attacker captures the ciphertext and moves it to a different user's session store, they cannot decrypt it without knowing the exact context — and even with the context, they still need KMS access. This prevents ciphertext from being replayed in a different context than intended.

Encryption context is also logged verbatim in CloudTrail, which makes it a useful audit tool. By including meaningful context values like environment, application name, or resource ID, you make your CloudTrail logs much more informative. You can enforce required context values in key policies using \`kms:EncryptionContextKeys\` or \`kms:EncryptionContext\` condition keys.`,
    },
    {
      heading: "KMS with Other Services",
      body: `KMS integrates with virtually every AWS service for encryption at rest, and understanding the mechanics of each integration helps avoid surprises around cost and permissions.

**S3** with SSE-KMS encrypts each object with a unique DEK; the DEK is encrypted with your CMK. Because KMS is called on every S3 \`GET\` and \`PUT\`, high-traffic S3 workloads can generate significant KMS API call counts. **S3 Bucket Keys** mitigate this: S3 generates a short-lived bucket-level DEK within S3 itself, uses that to encrypt objects without calling KMS per-object, and only calls KMS to refresh the bucket-level DEK periodically. This can reduce KMS call volume by 99% for heavily accessed buckets.

**DynamoDB** handles envelope encryption internally when you configure a CMK — DynamoDB calls KMS on your behalf and your application code requires no changes. **Lambda** encrypts environment variables with a CMK, decrypting them once per cold start — keeping KMS calls minimal. **Secrets Manager** always encrypts secrets with either an AWS managed key or your CMK; every \`GetSecretValue\` call triggers a KMS \`Decrypt\` internally, which counts against your KMS quota.

**EBS** volume encryption uses a CMK to protect both the volume data and all snapshots. Sharing encrypted EBS snapshots cross-account requires sharing both the snapshot and the CMK. **RDS** encryption with a CMK must be configured at database creation time — you cannot encrypt an existing unencrypted RDS instance in place. The standard migration path is to take a snapshot, copy it with encryption enabled, and restore a new encrypted instance from the copy. **CloudTrail** records every KMS API call, including the caller identity and which key was used — essential for compliance auditing and investigating unexpected decryption activity.`,
    },
  ],

  keyFacts: [
    "CMK cost: $1/month + $0.03 per 10,000 API calls",
    "KMS Encrypt/Decrypt direct limit: 4 KB",
    "Envelope encryption: GenerateDataKey → encrypt locally → store encrypted DEK",
    "Automatic rotation: every 365 days; old material retained for decryption",
    "Key deletion waiting period: 7–30 days (configurable); irreversible after",
    "Key policy must allow access — IAM policy alone is not sufficient",
    "Encryption context: AAD logged in CloudTrail; must match on decrypt",
    "kms:ViaService: restrict key use to specific AWS services",
    "S3 Bucket Keys: reduce KMS API calls by caching bucket-level DEK in S3",
    "BYOK: import own key material; cannot auto-rotate; delete material = permanent data loss",
  ],

  relatedServices: [
    "Amazon S3",
    "Amazon DynamoDB",
    "AWS Lambda",
    "AWS Secrets Manager",
    "AWS Systems Manager",
    "Amazon RDS",
    "Amazon EBS",
    "AWS CloudTrail",
    "AWS CloudHSM",
  ],

  examTips: [
    "Envelope encryption: GenerateDataKey (not Encrypt) for data > 4 KB.",
    "Key policy + IAM policy must both allow access to a CMK (key policy is required).",
    "Automatic rotation keeps old key material for decryption — no re-encryption needed.",
    "kms:ViaService restricts key to calls from a specific AWS service.",
    "Encryption context mismatch on decrypt → InvalidCiphertextException.",
    "S3 Bucket Key: reduces KMS API calls by generating a short-lived bucket-level DEK.",
    "RDS: can only encrypt at creation. Encrypt snapshot → restore to encrypt existing unencrypted DB.",
    "GenerateDataKeyWithoutPlaintext: encrypted DEK only, no plaintext — for deferred encryption.",
    "Cross-account: key policy allows external account + external account IAM policy allows key.",
  ],
};
