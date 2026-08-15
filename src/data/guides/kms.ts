import { ServiceGuide } from "../../types/guide";

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
      body: `**AWS Managed Keys**
- Created and managed by AWS on your behalf for specific services (e.g. \`aws/s3\`, \`aws/lambda\`, \`aws/dynamodb\`)
- Cannot be used directly in your code
- Automatically rotated every **year** (recently extended to 3 years for some)
- Free to use; you pay for API calls
- Cannot be deleted, disabled, or have custom key policies

**Customer Managed Keys (CMK)**
- You create and manage these keys
- Full control: custom key policy, aliases, rotation, deletion schedule
- Cost: **$1/month per key** + $0.03 per 10,000 API calls
- Enable **automatic rotation** (every year) or rotate manually
- Can be shared cross-account via key policy
- Audit all usage in CloudTrail

**Customer Provided Keys (SSE-C in S3)**
- You manage key material entirely outside AWS
- Provide the key on every API request
- S3 encrypts/decrypts but does not store your key
- S3 stores an HMAC of the key for verification only
- Must use HTTPS

**AWS CloudHSM** (related): you manage hardware security modules. FIPS 140-2 Level 3 compliance. Single-tenant. KMS can use CloudHSM as a custom key store.`,
    },
    {
      heading: "Key Material Origin",
      body: `**KMS-generated**: KMS creates key material in FIPS 140-2 validated HSMs. Default. Most common.

**External (BYOK — Bring Your Own Key)**: you import your own key material into KMS. You own the key material and can delete it from KMS at any time (renders data encrypted with it permanently inaccessible). Automatic rotation not available for imported keys. Use for compliance requirements mandating control over key material.

**Custom Key Store (CloudHSM)**: KMS key material stored in your CloudHSM cluster. Highest compliance requirements (FIPS 140-2 Level 3). You manage the HSM cluster.`,
    },
    {
      heading: "Envelope Encryption",
      body: `KMS can only encrypt data up to **4 KB** directly. For larger data, use **envelope encryption**:

**Encrypt flow**:
1. Call \`KMS:GenerateDataKey\` with CMK ARN → returns **plaintext DEK** + **encrypted DEK** (ciphertext blob)
2. Use plaintext DEK to encrypt your data locally (AES-256-GCM)
3. Discard the plaintext DEK from memory
4. Store the **encrypted DEK alongside the encrypted data**

**Decrypt flow**:
1. Call \`KMS:Decrypt\` with the **encrypted DEK** → returns plaintext DEK
2. Use plaintext DEK to decrypt your data locally
3. Discard the plaintext DEK

**Why this pattern?**
- No data size limit (data encrypted locally)
- Fewer KMS API calls (one per object, not one per API call)
- KMS manages the CMK; you never handle the master key directly
- Works even without network access if you have the encrypted DEK (decrypt the DEK first)

**GenerateDataKeyWithoutPlaintext**: generates an encrypted DEK only (no plaintext returned). Use when you want to pre-generate encrypted DEKs for future encryption without immediate use.`,
    },
    {
      heading: "Key Policies & Access Control",
      body: `Every CMK has a **key policy** — a resource-based policy that controls access. **Unlike IAM policies, IAM policies alone cannot grant access to a KMS key** — the key policy must also allow it (or allow IAM to delegate access).

**Default key policy**: grants the AWS account root user full access. Allows IAM policies to control access. Grants the key creator full access.

**Key policy structure**: same as IAM policy JSON. Principal specifies who gets access. Actions: \`kms:Encrypt\`, \`kms:Decrypt\`, \`kms:GenerateDataKey\`, \`kms:DescribeKey\`, \`kms:ReEncrypt*\`, \`kms:CreateGrant\`.

**Grants**: programmatically delegate specific key usage to AWS services (e.g. allowing Secrets Manager to use a key to encrypt a secret). More granular than key policies; can be retired.

**Cross-account key sharing**:
1. Add the external account principal to the key policy (AllowExternalAccount)
2. The external account's IAM policy must allow \`kms:*\` actions on the key ARN
Both must align for cross-account use.

**kms:ViaService condition**: restrict key usage to specific AWS services only. Example: only allow Decrypt when the call comes through S3 (\`"kms:ViaService": "s3.us-east-1.amazonaws.com"\`).`,
    },
    {
      heading: "Key Rotation",
      body: `**Automatic rotation** (CMK with KMS-generated material):
- Enable per key. Rotates every **365 days**.
- KMS creates new key material; old material retained to decrypt existing ciphertext.
- Key ID, ARN, aliases, and key policies remain unchanged.
- Applications need no changes — they always use the key ARN/alias.
- Re-encryption of existing data is NOT required (old material decrypts old ciphertext).

**Manual rotation**:
- Create a new CMK → update alias to point to new key.
- Old key: keep enabled to decrypt data encrypted with it. Disable after all data re-encrypted.
- Required for imported key material (no automatic rotation).

**Key deletion**: schedule deletion with a waiting period (7–30 days). During waiting period, key is disabled and cannot be used. Cancel deletion if needed. **Irreversible after waiting period** — data encrypted with deleted key is permanently inaccessible.`,
    },
    {
      heading: "Encryption Context",
      body: `An **encryption context** is an optional set of key-value pairs associated with a KMS encrypt/decrypt operation.

- Not secret — not encrypted
- Provides additional authenticated data (AAD) for additional security
- Must supply the **same context** on decrypt as used on encrypt
- Context is logged in CloudTrail — useful for audit
- Use to bind encrypted data to its context (e.g. \`{"userId": "123", "purpose": "session"}\`)

**If wrong context on decrypt**: KMS returns an error (InvalidCiphertextException), preventing decryption of moved/misused ciphertext.

**Enforcement**: include context in key policy conditions (\`kms:EncryptionContextKeys\`, \`kms:EncryptionContext\`) to require specific context for key usage.`,
    },
    {
      heading: "KMS with Other Services",
      body: `KMS integrates with virtually every AWS service for encryption at rest.

**S3**: SSE-KMS uses a CMK. Each object encrypted with a unique DEK; DEK encrypted with CMK. KMS called on every S3 GET/PUT (counts against KMS quota). S3 Bucket Keys reduce KMS calls by generating a bucket-level DEK in S3.

**DynamoDB**: encrypt table with CMK. DynamoDB handles envelope encryption internally. KMS called on DynamoDB operations.

**Lambda**: encrypt environment variables with CMK. Lambda decrypts at container init — one KMS call per cold start.

**Secrets Manager**: secrets encrypted with CMK (or AWS managed key). Every GetSecretValue calls KMS Decrypt.

**EBS**: encrypt volumes with CMK. Snapshots encrypted with same key. Share encrypted snapshots cross-account by sharing CMK.

**RDS**: encrypt database with CMK at creation. All snapshots encrypted. Cannot encrypt an unencrypted RDS instance in-place — must encrypt snapshot → restore to new encrypted instance.

**CloudTrail**: log all KMS API calls including who called Decrypt and with which key. Essential for compliance auditing.`,
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
