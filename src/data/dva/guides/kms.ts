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

**AWS Managed Keys** are created and maintained by AWS on your behalf for specific services — you'll see these referenced as \`aws/s3\`, \`aws/lambda\`, or \`aws/dynamodb\` in the console. You cannot use them directly in your own API calls, cannot customize their policies, and cannot delete or disable them. They rotate automatically every year (365 days) and are free to use, with charges only for API calls made on your behalf.

**Customer Managed Keys (CMKs)** are keys you create and fully control. You write the key policy, set an alias, choose whether to enable automatic rotation, and can schedule deletion. CMKs cost $1 per month per key plus $0.03 per 10,000 API calls. Because you control the key policy, you can share CMKs across accounts, restrict which services can use them, and audit every usage event in CloudTrail. For compliance-sensitive workloads, CMKs are the right choice.

**Customer-Provided Keys (SSE-C in S3)** represent the extreme: you manage the key material entirely outside AWS and provide it on every API request. S3 encrypts or decrypts the object using your key but never stores the key itself — only an HMAC for verification. You must use HTTPS for all SSE-C requests. This option is rarely used because the operational burden of managing key material externally is high. **AWS CloudHSM** is a related option where you manage dedicated hardware security modules with FIPS 140-2 Level 3 certification in a single-tenant configuration; KMS can use CloudHSM as a custom key store for the highest compliance requirements.`,
      quiz: [
        {
          question:
            "What is the monthly cost of a Customer Managed Key (CMK) in AWS KMS?",
          options: [
            "Free — only API calls are charged",
            "$5 per month with unlimited API calls",
            "$0.10 per month plus API call charges",
            "$1 per month plus $0.03 per 10,000 API calls",
          ],
          correctIndex: 3,
          explanation:
            "Customer Managed Keys cost $1 per month per key plus $0.03 per 10,000 API calls. AWS Managed Keys are free to use (only API calls made on your behalf are charged).",
        },
        {
          question: "How often do AWS Managed Keys rotate automatically?",
          options: [
            "Every 90 days",
            "Every 180 days",
            "Every 365 days (1 year)",
            "They never rotate — manual rotation required",
          ],
          correctIndex: 2,
          explanation:
            "AWS Managed Keys rotate automatically every 365 days (1 year). Unlike Customer Managed Keys, you cannot customize the rotation schedule or disable rotation for AWS Managed Keys.",
        },
        {
          question:
            "Which S3 encryption option requires the customer to supply the encryption key on every API request?",
          options: ["Client-Side Encryption", "SSE-C", "SSE-KMS", "SSE-S3"],
          correctIndex: 1,
          explanation:
            "SSE-C (Server-Side Encryption with Customer-Provided Keys) requires you to supply the key material on every request. S3 uses it to encrypt or decrypt but never stores the key — only an HMAC for verification. All SSE-C requests must use HTTPS.",
        },
      ],
    },
    {
      heading: "Key Material Origin",
      body: `Beyond who manages a key, KMS distinguishes between where the key's underlying cryptographic material is generated and stored — and this choice has compliance and operational consequences.

**KMS-generated** key material is the default and most common option. KMS creates the material inside FIPS 140-2 validated hardware security modules and manages it entirely. You never see or handle the raw key bytes.

**External (BYOK — Bring Your Own Key)** lets you import key material that you generated outside of AWS into a CMK. The key material lives in KMS, but you retain ownership: you can delete it from KMS at any time, which permanently renders all data encrypted with that key inaccessible. This is both a compliance feature (you can prove you control the key material) and a risk (accidental deletion is irreversible). Automatic rotation is not available for keys with imported material — you must rotate manually by creating a new CMK and updating references.

**Custom Key Store (CloudHSM)** stores key material in your own CloudHSM cluster rather than in KMS-managed HSMs. This gives you single-tenant HSM isolation with FIPS 140-2 Level 3 compliance. The operational overhead is significantly higher — you manage the CloudHSM cluster — but some regulatory frameworks specifically require this level of isolation.`,
      quiz: [
        {
          question:
            "What is a critical limitation of Customer Managed Keys with imported (BYOK) key material?",
          options: [
            "Automatic rotation is not available — manual rotation required",
            "They cannot be used in cross-account scenarios",
            "They cost twice as much as KMS-generated keys",
            "They cannot be used with S3 encryption",
          ],
          correctIndex: 0,
          explanation:
            "Keys with imported (BYOK) material do not support automatic rotation. You must rotate manually by creating a new CMK and updating all aliases and application references. Additionally, deleting the imported material is irreversible and permanently locks out encrypted data.",
        },
        {
          question:
            "What happens if you delete imported key material from a BYOK CMK?",
          options: [
            "The key falls back to KMS-generated material",
            "All data encrypted with that key becomes permanently inaccessible",
            "The key is disabled for 30 days before permanent deletion",
            "AWS creates a backup of the key material automatically",
          ],
          correctIndex: 1,
          explanation:
            "Deleting imported key material from a BYOK CMK permanently renders all data encrypted with that key inaccessible — there is no recovery. This irreversibility is both a compliance feature (proving you can destroy access to data) and a significant operational risk.",
        },
        {
          question:
            "Which key material origin provides FIPS 140-2 Level 3 single-tenant HSM isolation?",
          options: [
            "KMS-generated (default)",
            "AWS Managed Keys",
            "External (BYOK)",
            "Custom Key Store (CloudHSM)",
          ],
          correctIndex: 3,
          explanation:
            "Custom Key Store backed by CloudHSM stores key material in your own dedicated CloudHSM cluster, providing single-tenant HSM isolation with FIPS 140-2 Level 3 certification. KMS-managed HSMs are FIPS 140-2 validated but multi-tenant.",
        },
      ],
    },
    {
      heading: "Envelope Encryption",
      body: `KMS's direct \`Encrypt\` and \`Decrypt\` APIs are limited to data of 4 KB or less. For encrypting application data of any size, the standard approach is **envelope encryption**, which solves the size problem while keeping the master key material safely inside KMS.

The encryption flow has three steps. First, call \`KMS:GenerateDataKey\` with your CMK's ARN — KMS returns both a **plaintext Data Encryption Key (DEK)** and an **encrypted DEK** (a ciphertext blob). Second, use the plaintext DEK to encrypt your data locally using AES-256-GCM — this happens entirely in your application's memory without any network call. Third, discard the plaintext DEK from memory and store the encrypted DEK alongside the encrypted data, in the same object metadata, database row, or S3 object.

Decryption reverses the process: call \`KMS:Decrypt\` with the encrypted DEK to recover the plaintext DEK, then decrypt the data locally, then discard the plaintext DEK again. The CMK never leaves KMS and is never directly applied to your data — KMS only ever decrypts the small DEK blob.

The practical benefits are significant: there's no size limit on the data you encrypt, you make only one KMS API call per object (not per operation), and the encrypted DEK is useless without KMS access, so your data is protected even if the encrypted bytes are leaked. \`GenerateDataKeyWithoutPlaintext\` is a variant that returns only the encrypted DEK — useful for pre-generating keys for future encryption operations without returning plaintext material that must be immediately handled.`,
      quiz: [
        {
          question:
            "What is the maximum data size that KMS can directly encrypt with the Encrypt API?",
          options: ["64 KB", "1 MB", "4 KB", "1 KB"],
          correctIndex: 2,
          explanation:
            "KMS's direct Encrypt API is limited to 4 KB. For data larger than 4 KB, use envelope encryption: call GenerateDataKey to get a Data Encryption Key, use the DEK to encrypt your data locally, then store the encrypted DEK alongside the ciphertext.",
        },
        {
          question:
            "In envelope encryption, what does KMS:GenerateDataKey return?",
          options: [
            "Only an encrypted Data Encryption Key (DEK)",
            "Both a plaintext DEK and an encrypted DEK",
            "A master key that you use to encrypt data locally",
            "An encrypted copy of your data",
          ],
          correctIndex: 1,
          explanation:
            "GenerateDataKey returns two items: a plaintext DEK (used immediately to encrypt data in memory) and an encrypted DEK (stored alongside the ciphertext). After encrypting, you discard the plaintext DEK and only keep the encrypted DEK.",
        },
        {
          question:
            "What KMS API variant returns only the encrypted DEK without the plaintext, suitable for deferred encryption?",
          options: [
            "GenerateDataKeyWithoutPlaintext",
            "GenerateDataKeyPair",
            "GenerateDataKey",
            "CreateDataKey",
          ],
          correctIndex: 0,
          explanation:
            "GenerateDataKeyWithoutPlaintext returns only the encrypted DEK with no plaintext version. This is useful for pre-generating keys that will be used for future encryption operations, avoiding the security risk of having plaintext key material in memory when not immediately needed.",
        },
      ],
    },
    {
      heading: "Key Policies & Access Control",
      body: `Every CMK has a **key policy** — a resource-based policy document that is the primary mechanism controlling access to the key. The most important thing to understand about key policies is that **IAM policies alone cannot grant access to a KMS key**. Even if an IAM policy grants \`kms:Decrypt\` on a key ARN, that permission is useless unless the key policy also allows it. Both must align.

The default key policy that KMS creates when you make a new CMK grants the AWS account's root user full access to the key, and it explicitly allows IAM policies to delegate access to other principals in the account. This is the delegation statement — without it, IAM policies for IAM users and roles would have no effect on the key.

**Grants** are a programmatic mechanism for delegating specific permissions on a key to AWS services or other principals. When Secrets Manager or EBS needs to use your CMK to encrypt data on your behalf, it creates a grant on the key. Grants are more granular than key policies and can be retired when the delegated work is complete.

For **cross-account key sharing**, two things must both be true: the key policy must include the external account's principal, and the external account must have an IAM policy granting the relevant \`kms:*\` actions on the key ARN. The \`kms:ViaService\` condition key lets you restrict a key so it can only be used when the API call comes through a specific AWS service — for example, \`"kms:ViaService": "s3.us-east-1.amazonaws.com"\` ensures the key can only be used for S3 encryption, preventing direct \`Decrypt\` calls from application code.`,
      quiz: [
        {
          question:
            "An IAM policy grants kms:Decrypt on a CMK ARN, but the key policy does not mention the IAM principal. Can the principal decrypt data?",
          options: [
            "No, the key policy must also allow access for IAM policies to be effective",
            "Yes, IAM policies are sufficient for KMS access",
            "Yes, if the principal is in the same account as the key",
            "No, but only because cross-account access is not configured",
          ],
          correctIndex: 0,
          explanation:
            "IAM policies alone cannot grant access to a KMS CMK. The key policy is the primary access control mechanism and must also allow the action. The default key policy includes a delegation statement that allows IAM policies to work, but without it, IAM policies have no effect.",
        },
        {
          question:
            "What condition key restricts a KMS key so it can only be used through a specific AWS service (e.g., S3)?",
          options: [
            "aws:SourceService",
            "kms:AllowedService",
            "kms:CallerService",
            "kms:ViaService",
          ],
          correctIndex: 3,
          explanation:
            "kms:ViaService restricts key usage to calls originating from a specific AWS service. For example, setting kms:ViaService to 's3.us-east-1.amazonaws.com' prevents direct KMS API calls and allows the key only when S3 is calling KMS on the caller's behalf.",
        },
        {
          question:
            "For cross-account KMS key sharing, what two things must both be true?",
          options: [
            "The key must be a symmetric key and the external account must be in the same Organization",
            "The key policy must include the external account's principal AND the external account must have an IAM policy granting kms:* on the key ARN",
            "The key must be shared via Resource Access Manager and the external account must accept the share",
            "Both accounts must have CloudTrail enabled and the key alias must match",
          ],
          correctIndex: 1,
          explanation:
            "Cross-account KMS access requires both: the key policy must explicitly allow the external account's principal (or the account itself), AND the IAM principal in the external account must have an IAM policy granting the relevant kms: actions on the key ARN.",
        },
      ],
    },
    {
      heading: "Key Rotation",
      body: `Key rotation is an important part of cryptographic hygiene, and KMS handles automatic rotation in a way that is transparent to your application — no re-encryption of existing data is required.

When you enable **automatic rotation** on a CMK with KMS-generated material, KMS creates new key material once a year and begins using it for all new encryption operations. Critically, the old key material is never deleted — KMS retains every version of the key material and uses the correct version automatically when decrypting ciphertext encrypted with that version. The key ID, ARN, aliases, and key policy all remain the same, so your application code that references the key ARN requires no changes. The rotation is entirely transparent.

**Manual rotation** is required for keys with imported material (BYOK) or when you want to rotate on a different schedule. The process is to create a new CMK, update all aliases and application configurations to point to the new key, and keep the old key enabled (but not actively used) until you've re-encrypted all data protected by it. Only then can you disable the old key.

**Key deletion** must be handled carefully because it is irreversible. When you schedule a CMK for deletion, you set a waiting period of 7 to 30 days. During that window, the key is disabled and cannot be used, but you can cancel the deletion. After the waiting period, the key and all of its material are permanently gone — any data encrypted with it becomes permanently inaccessible. Always verify that no data depends on a key before scheduling deletion, and use CloudTrail to check recent usage.`,
      quiz: [
        {
          question:
            "When automatic KMS key rotation occurs, what happens to data that was encrypted with the old key material?",
          options: [
            "It is automatically re-encrypted with the new key material in the background",
            "It becomes inaccessible until re-encrypted",
            "It must be manually re-encrypted with the new key material",
            "It can still be decrypted — KMS retains all old key material versions",
          ],
          correctIndex: 3,
          explanation:
            "KMS retains all historical key material versions and automatically uses the correct version when decrypting. Data encrypted with old key material remains fully accessible without any re-encryption. The key ID, ARN, and aliases remain unchanged, so applications require no updates.",
        },
        {
          question:
            "What is the minimum waiting period when scheduling a KMS key for deletion?",
          options: ["14 days", "30 days", "7 days", "1 day"],
          correctIndex: 2,
          explanation:
            "The minimum waiting period for scheduled KMS key deletion is 7 days (maximum is 30 days). During this window the key is disabled and cannot be used, but deletion can be cancelled. After the waiting period, deletion is permanent and irreversible.",
        },
        {
          question:
            "You need to rotate a BYOK (imported key material) CMK. What is the correct approach?",
          options: [
            "Import new key material under the same CMK ARN",
            "Create a new CMK, update aliases and application references, then re-encrypt data",
            "Use the RotateKey API to rotate the imported material",
            "Enable automatic rotation in the KMS console",
          ],
          correctIndex: 1,
          explanation:
            "Keys with imported material do not support automatic rotation. Manual rotation requires creating a new CMK, updating all aliases and application configurations to point to the new key, keeping the old key enabled until all data is re-encrypted, then disabling the old key.",
        },
      ],
    },
    {
      heading: "Encryption Context",
      body: `An **encryption context** is an optional set of key-value pairs you can include with any KMS encrypt or decrypt operation. It's a powerful mechanism for binding encrypted data to its intended use case and preventing ciphertext from being misused out of context.

The encryption context itself is not a secret — it's stored as additional authenticated data (AAD) and is not encrypted. Its security value comes from the fact that KMS cryptographically binds the context to the ciphertext: you must provide the exact same context on decrypt that you used on encrypt. If the context doesn't match — even a single character difference — KMS returns \`InvalidCiphertextException\` and the decryption fails.

A practical example: encrypt a session token with context \`{"userId": "123", "purpose": "session"}\`. Even if an attacker captures the ciphertext and moves it to a different user's session store, they cannot decrypt it without knowing the exact context — and even with the context, they still need KMS access. This prevents ciphertext from being replayed in a different context than intended.

Encryption context is also logged verbatim in CloudTrail, which makes it a useful audit tool. By including meaningful context values like environment, application name, or resource ID, you make your CloudTrail logs much more informative. You can enforce required context values in key policies using \`kms:EncryptionContextKeys\` or \`kms:EncryptionContext\` condition keys.`,
      quiz: [
        {
          question:
            "What exception does KMS return when decryption is attempted with a different encryption context than was used during encryption?",
          options: [
            "InvalidCiphertextException",
            "ContextMismatchException",
            "AccessDeniedException",
            "InvalidKeyUsageException",
          ],
          correctIndex: 0,
          explanation:
            "KMS returns InvalidCiphertextException when the encryption context provided during decryption does not match the context used during encryption. The context must be exactly identical — even a single character difference causes decryption to fail.",
        },
        {
          question: "Is the encryption context itself encrypted in KMS?",
          options: [
            "Yes, it is encrypted along with the data",
            "No, but it is hashed and stored securely",
            "No, it is stored as plaintext additional authenticated data (AAD)",
            "Yes, but only the values — keys are stored in plaintext",
          ],
          correctIndex: 2,
          explanation:
            "The encryption context is NOT encrypted — it is stored and logged as plaintext additional authenticated data (AAD). Its security value comes from being cryptographically bound to the ciphertext, not from being secret. It is logged verbatim in CloudTrail.",
        },
        {
          question:
            "What is the primary security benefit of using encryption context?",
          options: [
            "It prevents ciphertext from being used in a different context than intended",
            "It allows decryption without KMS access in an emergency",
            "It reduces the cost of KMS API calls by caching context",
            "It enables automatic key rotation when context values change",
          ],
          correctIndex: 0,
          explanation:
            "Encryption context cryptographically binds ciphertext to its intended use case. Even if an attacker captures the ciphertext and the correct context values, they still need KMS access — and the ciphertext cannot be decrypted in a different context (e.g., moved to a different user's session store).",
        },
      ],
    },
    {
      heading: "KMS with Other Services",
      body: `KMS integrates with virtually every AWS service for encryption at rest, and understanding the mechanics of each integration helps avoid surprises around cost and permissions.

**S3** with SSE-KMS encrypts each object with a unique DEK; the DEK is encrypted with your CMK. Because KMS is called on every S3 \`GET\` and \`PUT\`, high-traffic S3 workloads can generate significant KMS API call counts. **S3 Bucket Keys** mitigate this: S3 generates a short-lived bucket-level DEK within S3 itself, uses that to encrypt objects without calling KMS per-object, and only calls KMS to refresh the bucket-level DEK periodically. This can reduce KMS call volume by 99% for heavily accessed buckets.

**DynamoDB** handles envelope encryption internally when you configure a CMK — DynamoDB calls KMS on your behalf and your application code requires no changes. **Lambda** encrypts environment variables with a CMK, decrypting them once per cold start — keeping KMS calls minimal. **Secrets Manager** always encrypts secrets with either an AWS managed key or your CMK; every \`GetSecretValue\` call triggers a KMS \`Decrypt\` internally, which counts against your KMS quota.

**EBS** volume encryption uses a CMK to protect both the volume data and all snapshots. Sharing encrypted EBS snapshots cross-account requires sharing both the snapshot and the CMK. **RDS** encryption with a CMK must be configured at database creation time — you cannot encrypt an existing unencrypted RDS instance in place. The standard migration path is to take a snapshot, copy it with encryption enabled, and restore a new encrypted instance from the copy. **CloudTrail** records every KMS API call, including the caller identity and which key was used — essential for compliance auditing and investigating unexpected decryption activity.`,
      quiz: [
        {
          question:
            "What does the S3 Bucket Key feature do to reduce KMS costs?",
          options: [
            "It generates a short-lived bucket-level DEK in S3, reducing per-object KMS API calls by up to 99%",
            "It switches from SSE-KMS to SSE-S3 for low-value objects automatically",
            "It compresses objects before encrypting them",
            "It caches decrypted objects in memory to avoid repeated KMS calls",
          ],
          correctIndex: 0,
          explanation:
            "S3 Bucket Keys reduce KMS API call volume by generating a short-lived bucket-level DEK within S3. S3 uses this bucket-level DEK to encrypt individual objects without calling KMS per-object, only refreshing the bucket DEK periodically. This reduces KMS calls by up to 99% for heavily accessed buckets.",
        },
        {
          question:
            "An existing unencrypted RDS instance needs to be encrypted with KMS. What is the correct migration path?",
          options: [
            "Enable encryption in the RDS console — it applies immediately",
            "Take a snapshot, copy it with encryption enabled, restore from the encrypted copy",
            "Modify the DB instance to add a KMS key",
            "Enable encryption on the underlying EBS volumes directly",
          ],
          correctIndex: 1,
          explanation:
            "RDS encryption must be configured at creation time and cannot be enabled on a running instance. The three-step migration path is: take a snapshot, copy the snapshot with encryption enabled (specifying the KMS key), then restore a new encrypted instance from the encrypted copy.",
        },
        {
          question:
            "Every call to GetSecretValue on an AWS Secrets Manager secret triggers what KMS action?",
          options: [
            "kms:Decrypt",
            "kms:Encrypt",
            "kms:GenerateDataKey",
            "kms:DescribeKey",
          ],
          correctIndex: 0,
          explanation:
            "Secrets Manager encrypts secrets at rest using KMS. Every GetSecretValue call internally triggers a kms:Decrypt operation to decrypt the secret value. This counts against your KMS request quota and can add cost for high-frequency secret access patterns.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "You need to encrypt a 10 MB file using KMS. Which approach is correct?",
      options: [
        "Call kms:Encrypt directly with the file contents",
        "Use envelope encryption: GenerateDataKey, encrypt locally with DEK, store encrypted DEK",
        "Split the file into 4 KB chunks and encrypt each chunk separately",
        "Use kms:EncryptLargeObject API designed for files over 4 KB",
      ],
      correctIndex: 1,
      explanation:
        "KMS direct Encrypt is limited to 4 KB. For larger data, use envelope encryption: call GenerateDataKey to get a plaintext DEK and encrypted DEK, use the plaintext DEK to encrypt the file locally with AES-256, discard the plaintext DEK, and store the encrypted DEK alongside the ciphertext.",
    },
    {
      question:
        "A KMS key policy does not include a delegation statement allowing IAM policies to work. A developer's IAM role has kms:Decrypt permission on the key. Can the developer decrypt data?",
      options: [
        "Yes, IAM policies always override key policies",
        "No, but only because the developer needs kms:DescribeKey permission first",
        "Yes, if the developer is in the same AWS account as the key",
        "No, without the delegation statement in the key policy, IAM policies have no effect",
      ],
      correctIndex: 3,
      explanation:
        "The key policy is the primary access control for KMS CMKs. IAM policies can only grant KMS access if the key policy includes a delegation statement allowing the account to use IAM for access control. Without this statement, IAM policies are ineffective regardless of what they grant.",
    },
    {
      question:
        "What happens to existing ciphertext when a CMK's automatic key rotation creates new key material?",
      options: [
        "It must be re-encrypted with the new key material within 30 days",
        "It becomes inaccessible and must be restored from backup",
        "It can still be decrypted — KMS automatically uses the correct historical key material version",
        "It is automatically re-encrypted in the background during off-peak hours",
      ],
      correctIndex: 2,
      explanation:
        "KMS retains all historical key material versions and tracks which version was used for each encryption operation. When decrypting, KMS automatically selects the correct key material version. No re-encryption is required, and existing ciphertext remains fully accessible.",
    },
    {
      question: "What does kms:ViaService allow you to enforce?",
      options: [
        "That a KMS key can only be called through a specific AWS service (e.g., S3 or Secrets Manager)",
        "That a KMS key can only be used during business hours",
        "That a KMS key can only be used by principals in specific VPCs",
        "That KMS calls must originate from specific IP addresses",
      ],
      correctIndex: 0,
      explanation:
        "kms:ViaService restricts a KMS key so it can only be used when the API call originates from a specific AWS service. For example, setting it to 's3.us-east-1.amazonaws.com' allows the key only for S3 encryption operations, blocking direct kms:Decrypt calls from application code.",
    },
    {
      question:
        "Which KMS operation should you use to pre-generate an encrypted DEK for future use, without exposing plaintext key material?",
      options: [
        "kms:GenerateDataKey",
        "kms:GenerateDataKeyWithoutPlaintext",
        "kms:CreateDataKey",
        "kms:Encrypt",
      ],
      correctIndex: 1,
      explanation:
        "GenerateDataKeyWithoutPlaintext returns only the encrypted DEK, with no plaintext version. This is ideal for pre-generating keys that will be used for future encryption — the plaintext is never in memory, reducing the risk of exposure.",
    },
    {
      question:
        "You need to ensure your S3 SSE-KMS bucket can handle millions of object reads per day without incurring excessive KMS API costs. What feature should you enable?",
      options: [
        "KMS key caching in your application",
        "S3 Bucket Keys",
        "SSE-S3 instead of SSE-KMS",
        "KMS request rate increase via support ticket",
      ],
      correctIndex: 1,
      explanation:
        "S3 Bucket Keys reduce KMS API calls by up to 99% by generating a short-lived bucket-level DEK within S3. Instead of calling KMS for every object GET/PUT, S3 uses the bucket-level DEK for object encryption and only calls KMS periodically to refresh it.",
    },
    {
      question:
        "A compliance requirement mandates that you can prove you control the key material and can permanently revoke access to encrypted data. Which key material origin satisfies this?",
      options: [
        "Any key type — all CMKs support this",
        "External (BYOK — Bring Your Own Key)",
        "AWS Managed Keys",
        "KMS-generated (default)",
      ],
      correctIndex: 1,
      explanation:
        "BYOK (imported key material) satisfies this requirement: you generated the key material outside AWS, you can prove ownership, and you can permanently delete the key material from KMS at any time, rendering all encrypted data inaccessible — proving you can revoke access.",
    },
    {
      question:
        "What is the minimum key deletion waiting period you can configure for a KMS CMK?",
      options: ["7 days", "1 day", "3 days", "14 days"],
      correctIndex: 0,
      explanation:
        "The minimum waiting period for scheduled KMS key deletion is 7 days (configurable up to 30 days). During this window the key is disabled and deletion can be cancelled. After the waiting period expires, deletion is permanent and irreversible.",
    },
  ],
};
