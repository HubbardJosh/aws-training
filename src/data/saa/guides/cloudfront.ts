import { ServiceGuide } from "../../../types/guide";

export const cloudfrontGuide: ServiceGuide = {
  id: "saa-cloudfront",
  service: "Amazon CloudFront",
  domain: "services",
  tagline:
    "Global content delivery network that accelerates static and dynamic content",
  intro:
    "Amazon CloudFront is a globally distributed Content Delivery Network (CDN) with over 600 Points of Presence (edge locations and regional edge caches) worldwide that caches and delivers content — static assets, APIs, video streams, and dynamic web pages — with low latency by serving requests from the edge closest to the user.",

  sections: [
    {
      heading: "Distributions, Origins, and Edge Locations",
      body: `A CloudFront distribution defines how content is delivered: you configure one or more origins (the authoritative source of your content), cache behaviors (rules mapping URL patterns to origins and caching settings), and the geographic scope of edge locations to use. Origins can be Amazon S3 buckets, Application Load Balancers, EC2 instances, API Gateway endpoints, or any HTTP server accessible via DNS. CloudFront's global network of edge locations (Points of Presence) and Regional Edge Caches (larger intermediate caches between edges and origins) dramatically reduce the number of requests that reach the origin by serving cached responses from the nearest edge. For origins that are S3 buckets, Origin Access Control (OAC) restricts bucket access so that only CloudFront can retrieve objects, preventing users from bypassing the CDN and accessing S3 directly, which also enables WAF and other CloudFront security features to apply uniformly.`,
      quiz: [
        {
          question:
            "Which CloudFront feature prevents users from accessing S3 bucket content directly, bypassing the CDN?",
          options: [
            "Signed URLs",
            "Origin Access Control (OAC)",
            "Geographic restrictions",
            "Field-level encryption",
          ],
          correctIndex: 1,
          explanation:
            "Origin Access Control (OAC) restricts S3 bucket access so that only CloudFront can retrieve objects. This prevents users from bypassing the CDN and ensures WAF and other CloudFront security features apply uniformly.",
        },
        {
          question:
            "What is the role of Regional Edge Caches in CloudFront's architecture?",
          options: [
            "They replace edge locations in regions where CloudFront has no PoPs",
            "They sit between edge locations and origins, reducing origin load for less popular content",
            "They store only static assets and never dynamic content",
            "They are used exclusively for Lambda@Edge function execution",
          ],
          correctIndex: 1,
          explanation:
            "Regional Edge Caches are larger intermediate caches positioned between edge locations and origins. They cache content that is not popular enough to remain in edge location caches, significantly reducing origin requests.",
        },
        {
          question:
            "Which origin types can be configured for a CloudFront distribution?",
          options: [
            "Only Amazon S3 buckets",
            "S3 buckets and EC2 instances only",
            "S3 buckets, ALBs, EC2 instances, API Gateway endpoints, and any HTTP server",
            "Only AWS-managed services; on-premises servers cannot be origins",
          ],
          correctIndex: 2,
          explanation:
            "CloudFront supports a wide variety of origins: Amazon S3 buckets, Application Load Balancers, EC2 instances, API Gateway endpoints, or any HTTP server accessible via DNS.",
        },
      ],
    },
    {
      heading: "Cache Behaviors and TTL Configuration",
      body: `Cache behaviors map URL path patterns to specific origin configurations and caching policies, allowing a single distribution to route different request types appropriately. For example, \`/api/*\` can be routed to an ALB with caching disabled and all headers forwarded, while \`/static/*\` routes to S3 with aggressive caching and header stripping to maximize cache hit rate. The Time to Live (TTL) controls how long CloudFront caches a response before checking the origin for a fresh copy. The minimum, default, and maximum TTL values interact with the \`Cache-Control\` and \`Expires\` headers sent by the origin — CloudFront respects the origin's headers within the configured bounds. Setting long TTLs improves cache hit rates and reduces origin load, but requires explicit cache invalidation (or versioned URLs like \`/app.v2.js\`) when content changes. CloudFront charges per invalidation path beyond the first 1,000 paths per month, making versioned filenames more cost-effective for frequent deployments.`,
      quiz: [
        {
          question:
            "A CloudFront distribution serves both a REST API at /api/* and static assets at /static/*. How should cache behaviors be configured?",
          options: [
            "Use a single cache behavior with a TTL of 0 to disable caching for all content",
            "Configure /api/* with caching disabled and headers forwarded; configure /static/* with aggressive caching",
            "Configure separate distributions — one for the API and one for static content",
            "Use Lambda@Edge to dynamically set TTL based on the request path",
          ],
          correctIndex: 1,
          explanation:
            "Cache behaviors map URL path patterns to different origins and caching policies. /api/* should have caching disabled with headers forwarded to the ALB, while /static/* should aggressively cache content from S3 to maximize hit rates.",
        },
        {
          question:
            "Why are versioned filenames (e.g., /app.v2.js) preferred over cache invalidation for frequent deployments?",
          options: [
            "CloudFront does not support cache invalidation for JavaScript files",
            "Cache invalidation is limited to 10 paths per month; versioned names have no limit",
            "CloudFront charges for invalidation paths beyond 1,000 per month, making versioned names more cost-effective",
            "Versioned filenames bypass CDN caching entirely, ensuring users always get the latest file",
          ],
          correctIndex: 2,
          explanation:
            "CloudFront charges per invalidation path beyond the first 1,000 paths per month. Versioned filenames (e.g., app.v2.js) allow CloudFront to serve new content as a new cache object without incurring invalidation costs.",
        },
      ],
    },
    {
      heading: "Security: HTTPS, WAF, and Geo-Restriction",
      body: `CloudFront enforces HTTPS between viewers and edge locations using certificates from AWS Certificate Manager (which must be provisioned in the us-east-1 region for CloudFront use). The Viewer Protocol Policy can redirect HTTP to HTTPS or require HTTPS only. Between CloudFront and the origin, the Origin Protocol Policy controls whether communication uses HTTP, HTTPS, or matches the viewer protocol. AWS WAF can be associated with a CloudFront distribution to filter malicious requests — SQL injection, cross-site scripting, and rate-based rules — at the edge before they reach the origin, reducing both security exposure and unnecessary origin load. Geographic restrictions (geo-blocking) allow or deny access to content based on the viewer's country, determined from the viewer's IP address using a geolocation database. Field-level encryption adds an additional layer by encrypting specific POST fields (like credit card numbers) at the edge using public key cryptography, so they remain encrypted even from your own application servers until decrypted by the designated microservice.`,
      quiz: [
        {
          question:
            "An ACM certificate is needed for a CloudFront distribution. In which AWS region must the certificate be provisioned?",
          options: [
            "The same region as the CloudFront origin",
            "us-west-2 (Oregon), which is the default AWS region",
            "us-east-1 (N. Virginia), regardless of the distribution region",
            "Any region — CloudFront replicates certificates globally",
          ],
          correctIndex: 2,
          explanation:
            "ACM certificates used with CloudFront must be provisioned in us-east-1 (N. Virginia), regardless of where the origin or users are located. This is a common exam trap for architects working with non-US regions.",
        },
        {
          question:
            "What does Field-Level Encryption provide that standard HTTPS does not?",
          options: [
            "End-to-end encryption between CloudFront and the origin using TLS 1.3",
            "Encryption of specific POST fields at the edge that remains in place even within the application layer until decrypted by a designated microservice",
            "Encryption of S3 objects at rest using customer-managed KMS keys",
            "Automatic key rotation for CloudFront SSL/TLS certificates",
          ],
          correctIndex: 1,
          explanation:
            "Field-level encryption encrypts specific POST fields (e.g., credit card numbers) at the edge using public key cryptography. The data remains encrypted as it passes through your application servers and is only decrypted by the designated microservice that holds the private key.",
        },
        {
          question:
            "Which CloudFront feature restricts content access based on the viewer's country?",
          options: [
            "Signed URLs with IP restrictions",
            "Origin Access Control",
            "Geographic restrictions (geo-blocking)",
            "WAF IP set match rules",
          ],
          correctIndex: 2,
          explanation:
            "Geographic restrictions (geo-blocking) allow or deny access to CloudFront content based on the country determined from the viewer's IP address using a geolocation database.",
        },
      ],
    },
    {
      heading: "Lambda@Edge and CloudFront Functions",
      body: `CloudFront supports two compute-at-edge options for customizing request and response behavior without round-tripping to the origin. Lambda@Edge runs full Lambda functions (Node.js or Python) at Regional Edge Caches in response to CloudFront events: viewer request (before cache lookup), origin request (on cache miss, before forwarding to origin), origin response (after origin responds, before caching), and viewer response (before returning to viewer). Lambda@Edge is appropriate for A/B testing, authentication and authorization, URL rewriting and redirects, and dynamically generating responses. CloudFront Functions are a lighter, faster alternative for simple request/response transformations — URL normalization, header manipulation, and simple redirects — running at the edge location itself (not just Regional Edge Caches) with sub-millisecond execution time and lower cost. For the SAA-C03 exam, choose Lambda@Edge for complex logic requiring full Lambda capabilities and CloudFront Functions for high-frequency, lightweight transformations.`,
      quiz: [
        {
          question:
            "A team needs to perform JWT authentication for CloudFront requests, potentially calling an external service. Which compute-at-edge option is appropriate?",
          options: [
            "CloudFront Functions, because they run at every edge location",
            "Lambda@Edge, because it supports full Lambda capabilities including external calls and complex logic",
            "CloudFront Functions, because they have lower latency than Lambda@Edge",
            "Neither — authentication must be handled at the origin, not the edge",
          ],
          correctIndex: 1,
          explanation:
            "Lambda@Edge supports full Lambda capabilities including external HTTP calls, complex logic, and multiple runtimes (Node.js, Python). It is the correct choice for authentication and authorization logic. CloudFront Functions are too limited for this use case.",
        },
        {
          question:
            "CloudFront Functions run at which layer of the CloudFront network?",
          options: [
            "Regional Edge Caches only",
            "The origin server",
            "Edge locations (Points of Presence) closest to the viewer",
            "AWS Global Accelerator endpoints",
          ],
          correctIndex: 2,
          explanation:
            "CloudFront Functions run at edge locations (Points of Presence) closest to the viewer, providing sub-millisecond execution. Lambda@Edge runs at Regional Edge Caches, which are further from the viewer but support more powerful compute.",
        },
      ],
    },
    {
      heading: "Signed URLs and Signed Cookies",
      body: `Private content distribution requires restricting access to authenticated or authorized users. CloudFront Signed URLs grant time-limited access to a specific object — each URL contains a signature, expiration time, and optional IP restriction. Signed URLs are appropriate for granting access to individual files, such as a software download after purchase or a streaming video after subscription verification. CloudFront Signed Cookies grant access to multiple objects (entire content libraries) without requiring a unique URL per file — users receive a signed cookie that CloudFront validates for each request. Signed URLs take precedence over signed cookies for the same request. Both mechanisms require a CloudFront Key Group with an RSA key pair — the private key signs URLs/cookies, the public key is registered with CloudFront for verification. S3 presigned URLs bypass CloudFront entirely; for content served through CloudFront, use CloudFront signed mechanisms, not S3 presigned URLs.`,
      quiz: [
        {
          question:
            "A streaming service needs to grant authenticated users access to an entire video course library (hundreds of files) through CloudFront. Which mechanism is most appropriate?",
          options: [
            "CloudFront Signed URLs — one per file",
            "S3 Presigned URLs — they work transparently through CloudFront",
            "CloudFront Signed Cookies — they grant access to multiple objects without a unique URL per file",
            "Origin Access Control — it restricts S3 access to authenticated users",
          ],
          correctIndex: 2,
          explanation:
            "CloudFront Signed Cookies grant access to multiple objects using a single cookie, making them ideal for content libraries where generating a unique signed URL per file is impractical. S3 Presigned URLs bypass CloudFront entirely.",
        },
        {
          question:
            "What happens if both a CloudFront Signed URL and a Signed Cookie are present for the same request?",
          options: [
            "CloudFront rejects the request as ambiguous",
            "CloudFront uses the Signed Cookie and ignores the Signed URL",
            "CloudFront uses the Signed URL, which takes precedence over Signed Cookies",
            "Both are validated and both must be valid for the request to succeed",
          ],
          correctIndex: 2,
          explanation:
            "Signed URLs take precedence over Signed Cookies for the same request. If a Signed URL is present, CloudFront validates it and ignores any Signed Cookies.",
        },
      ],
    },
    {
      heading: "CloudFront and API Gateway Integration",
      body: `Placing CloudFront in front of API Gateway accelerates REST and HTTP APIs by caching API responses at the edge, reducing latency for repeated identical requests and reducing load on backend Lambda functions or services. CloudFront supports custom domain names for API Gateway endpoints, providing a consistent domain experience. Cache-Control headers from API Gateway control CloudFront caching behavior — responses with \`Cache-Control: no-cache\` are never cached, while responses with long max-age values are aggressively cached. WAF rules associated with the CloudFront distribution protect the API before requests reach API Gateway's own WAF, providing defense in depth. For globally distributed APIs, CloudFront combined with API Gateway in multiple regions and Route 53 latency-based routing creates a multi-region active-active API architecture.`,
      quiz: [
        {
          question:
            "What controls whether CloudFront caches API Gateway responses?",
          options: [
            "The CloudFront default TTL, which always overrides origin headers",
            "Cache-Control headers returned by API Gateway — no-cache prevents caching; long max-age enables it",
            "The API Gateway stage settings, not CloudFront configuration",
            "WAF rules attached to the CloudFront distribution",
          ],
          correctIndex: 1,
          explanation:
            "Cache-Control headers from API Gateway determine CloudFront caching behavior. Responses with Cache-Control: no-cache are never cached; responses with long max-age values are aggressively cached at the edge.",
        },
        {
          question:
            "How does placing CloudFront in front of API Gateway improve security in a multi-layer architecture?",
          options: [
            "CloudFront encrypts all traffic between API Gateway and Lambda using client-managed KMS keys",
            "WAF rules on the CloudFront distribution filter malicious requests at the edge before they reach API Gateway",
            "CloudFront adds mutual TLS authentication between the edge and API Gateway",
            "CloudFront automatically applies the OWASP Core Rule Set without WAF configuration",
          ],
          correctIndex: 1,
          explanation:
            "Associating WAF with a CloudFront distribution protects the API at the edge, filtering malicious requests (SQL injection, XSS, rate limits) before they reach API Gateway's own WAF, providing defense in depth.",
        },
      ],
    },
  ],

  keyFacts: [
    "CloudFront has 600+ Points of Presence (edge locations) and Regional Edge Caches for tiered caching",
    "Origin Access Control (OAC) restricts S3 bucket access to CloudFront only",
    "ACM certificates for CloudFront must be created in us-east-1 regardless of distribution region",
    "Cache behaviors map URL path patterns to different origins and caching policies",
    "WAF integrates with CloudFront to filter attacks at the edge before reaching the origin",
    "Lambda@Edge runs at Regional Edge Caches; CloudFront Functions run at edge locations",
    "Signed URLs grant access to a single file; Signed Cookies grant access to multiple files",
    "Geo-restriction allows or denies access based on viewer country",
    "Field-level encryption encrypts sensitive POST fields at the edge with public key cryptography",
    "Cache invalidation costs money beyond 1,000 paths/month — prefer versioned filenames",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS WAF",
    "AWS Certificate Manager",
    "Amazon API Gateway",
    "AWS Lambda",
    "Amazon Route 53",
  ],

  examTips: [
    "CloudFront ACM certs must be in us-east-1 — a common exam trap for non-US regions",
    "OAC is the modern replacement for OAI for restricting S3 origin access to CloudFront",
    "S3 presigned URLs bypass CloudFront — use CloudFront Signed URLs for CDN-gated content",
    "Lambda@Edge for complex logic; CloudFront Functions for lightweight, high-frequency transformations",
    "Signed URLs = one file; Signed Cookies = multiple files (e.g., an entire course library)",
    "WAF on CloudFront filters attacks at the edge — cheaper and faster than filtering at the origin",
    "Set long TTLs and use versioned filenames for static assets to maximize cache hit rates",
    "Regional Edge Caches sit between edges and origins — they reduce origin load for less popular content",
  ],

  topicQuiz: [
    {
      question:
        "A company wants to serve private video content through CloudFront so that only paying subscribers can access individual videos. Which mechanism should be used?",
      options: [
        "S3 Presigned URLs embedded in the video player",
        "CloudFront Signed URLs with an expiration time",
        "CloudFront Signed Cookies covering the entire video library",
        "Origin Access Control on the S3 bucket",
      ],
      correctIndex: 1,
      explanation:
        "CloudFront Signed URLs grant time-limited access to a specific individual object, making them appropriate for per-video access control. Signed Cookies are better for granting access to an entire library. S3 Presigned URLs bypass CloudFront entirely.",
    },
    {
      question:
        "An ACM certificate is required for a new CloudFront distribution serving a European audience. Where must the certificate be provisioned?",
      options: [
        "eu-west-1 (Ireland) to minimize latency to European viewers",
        "us-east-1 (N. Virginia) regardless of viewer or origin location",
        "The same region as the CloudFront origin",
        "Any region — CloudFront automatically discovers ACM certificates",
      ],
      correctIndex: 1,
      explanation:
        "ACM certificates for CloudFront must always be provisioned in us-east-1, regardless of the viewer or origin region. This is a frequently tested CloudFront exam fact.",
    },
    {
      question:
        "What is the recommended approach for updating static assets frequently without incurring cache invalidation costs?",
      options: [
        "Set a very short TTL (e.g., 1 second) on all cache behaviors",
        "Use versioned filenames (e.g., app.v2.js) so new content is treated as a new cache object",
        "Disable caching for static assets and always serve from S3",
        "Use S3 Object Versioning to automatically invalidate CloudFront on each PUT",
      ],
      correctIndex: 1,
      explanation:
        "Versioned filenames cause CloudFront to treat each deployment as a new object, avoiding invalidation costs (which are charged beyond 1,000 paths/month). Short TTLs increase origin load and do not eliminate invalidation costs.",
    },
    {
      question:
        "A CloudFront distribution needs lightweight URL normalization (lowercasing query strings) on every viewer request. Which compute option provides the best performance and lowest cost?",
      options: [
        "Lambda@Edge at the viewer request event",
        "Lambda@Edge at the origin request event",
        "CloudFront Functions at the viewer request event",
        "An ALB Lambda target that normalizes URLs before caching",
      ],
      correctIndex: 2,
      explanation:
        "CloudFront Functions are designed for simple, high-frequency transformations like URL normalization. They run at every edge location with sub-millisecond latency and lower cost than Lambda@Edge, which is better suited for complex logic.",
    },
    {
      question:
        "Which CloudFront security feature encrypts specific HTTP POST form fields (e.g., credit card numbers) at the edge so they remain protected throughout the application stack?",
      options: [
        "HTTPS with the Origin Protocol Policy set to HTTPS-only",
        "AWS WAF with SQL injection detection rules",
        "Field-level encryption using a public/private RSA key pair",
        "Origin Access Control restricting access to the backend",
      ],
      correctIndex: 2,
      explanation:
        "Field-level encryption encrypts specific POST fields at the CloudFront edge using public key cryptography. The data remains encrypted as it traverses your application stack and is only decrypted by the designated microservice holding the private key.",
    },
    {
      question:
        "A company's application uses CloudFront in front of API Gateway. API responses should be cached at the edge for 5 minutes. How is this configured?",
      options: [
        "Set the CloudFront default TTL to 300 seconds in the cache behavior",
        "Enable API Gateway caching with a 300-second TTL in the stage settings",
        "API Gateway returns Cache-Control: max-age=300, and CloudFront respects this header within the configured TTL bounds",
        "Configure an Origin Request Policy to forward the Cache-Control header to API Gateway",
      ],
      correctIndex: 2,
      explanation:
        "CloudFront caching behavior is driven by Cache-Control headers from the origin (within the distribution's configured min/max/default TTL bounds). API Gateway returning Cache-Control: max-age=300 causes CloudFront to cache responses for 5 minutes.",
    },
    {
      question:
        "A website is hosted on S3 and served through CloudFront. Users accessing the site via HTTPS are getting certificate errors. What is the most likely cause?",
      options: [
        "The S3 bucket does not have versioning enabled",
        "The ACM certificate was provisioned in a region other than us-east-1",
        "CloudFront does not support HTTPS for S3 origins",
        "The CloudFront distribution needs to be redeployed after adding the certificate",
      ],
      correctIndex: 1,
      explanation:
        "ACM certificates used with CloudFront must be provisioned in us-east-1. A certificate provisioned in any other region cannot be attached to a CloudFront distribution, causing HTTPS failures.",
    },
    {
      question:
        "Which CloudFront configuration prevents end users from accessing S3 bucket objects by constructing direct S3 URLs?",
      options: [
        "Setting the S3 bucket to private and using Signed URLs for every request",
        "Enabling S3 Block Public Access and configuring Origin Access Control (OAC) on the distribution",
        "Using an S3 bucket policy that allows access only from CloudFront IP ranges",
        "Configuring the Viewer Protocol Policy to HTTPS-only",
      ],
      correctIndex: 1,
      explanation:
        "Origin Access Control (OAC) restricts S3 bucket access so that only CloudFront can retrieve objects. Combined with S3 Block Public Access, this ensures all requests flow through CloudFront and direct S3 URL access is denied.",
    },
  ],
};
