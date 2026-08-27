import { ServiceGuide } from "../../../types/guide";

export const cloudfrontGuide: ServiceGuide = {
  id: "amazon-cloudfront",
  service: "Amazon CloudFront",
  domain: "development",
  tagline: "Global CDN for low-latency content delivery",
  intro:
    "CloudFront is AWS's Content Delivery Network (CDN). It caches content at 400+ edge locations worldwide, reducing latency for users by serving content from the nearest location. It integrates tightly with S3, API Gateway, ALB, EC2, and Lambda@Edge for both static and dynamic content delivery.",

  sections: [
    {
      heading: "Core Concepts",
      body: `A CloudFront **distribution** is the configuration unit — it has a domain name (like \`d111111abcdef8.cloudfront.net\`) or a custom domain backed by an ACM certificate. Within a distribution, you configure **origins** (where CloudFront fetches content when it's not cached) and **cache behaviors** (rules for how CloudFront handles requests matching a given URL pattern).

Origins can be S3 buckets, Application Load Balancers, EC2 instances, API Gateway endpoints, or any HTTP server including on-premises systems. Cache behaviors are matched by path pattern — for example, you might send \`/api/*\` to an ALB origin with no caching, \`/images/*\` to S3 with a long TTL, and \`/*\` to S3 for everything else. Each behavior can have its own TTL settings, allowed HTTP methods, cache key configuration, and Lambda@Edge associations.

Content is served from **edge locations** — 400+ points of presence globally. Between edge locations and your origin sit **Regional Edge Caches**, which have larger storage capacity and absorb content that's too infrequently accessed for edge locations but would still benefit from caching rather than going all the way back to the origin. The key metric to optimize is your **cache hit ratio**: the higher it is, the less load your origin receives and the lower the latency for users.`,
      quiz: [
        {
          question: "What is a CloudFront cache behavior used for?",
          options: [
            "Defining which AWS region the distribution serves",
            "Specifying rules for how CloudFront handles requests matching a URL pattern",
            "Configuring the SSL certificate for the distribution",
            "Setting the maximum number of concurrent connections to the origin",
          ],
          correctIndex: 1,
          explanation:
            "Cache behaviors define rules for requests matching a given URL path pattern, including TTL settings, allowed HTTP methods, cache key configuration, and Lambda@Edge associations. Each behavior can route to a different origin.",
        },
        {
          question:
            "What is the purpose of Regional Edge Caches in CloudFront?",
          options: [
            "They store content closer to AWS regions to reduce origin load for less popular content",
            "They replace edge locations for premium customers",
            "They handle SSL termination for custom domains",
            "They run Lambda@Edge functions at reduced latency",
          ],
          correctIndex: 0,
          explanation:
            "Regional Edge Caches sit between edge locations and your origin. They have larger storage capacity and serve content that's too infrequently accessed for edge locations, reducing round trips all the way to the origin.",
        },
        {
          question:
            "Which metric best indicates how effectively CloudFront is reducing origin load?",
          options: [
            "4XX error rate",
            "Origin response time",
            "Cache hit ratio",
            "Number of edge locations serving the distribution",
          ],
          correctIndex: 2,
          explanation:
            "The cache hit ratio measures what percentage of requests are served from cache versus fetched from the origin. A higher cache hit ratio means less load on your origin and lower latency for users.",
        },
      ],
    },
    {
      heading: "Caching & TTL",
      body: `CloudFront's caching behavior is driven by two concepts: the **cache key** and the **TTL**. The cache key is the set of values that uniquely identify a cacheable response — by default it's just the URL path, but you can expand it to include specific query strings, headers, or cookies using a **Cache Policy**. Adding values to the cache key makes caching more precise but reduces the cache hit ratio, because more unique combinations must be stored separately.

The **Origin Request Policy** is a related concept that often causes confusion: it controls what CloudFront forwards to your origin (query strings, headers, cookies) *without* including them in the cache key. Use this for values your origin needs (like an auth header) that shouldn't cause cache fragmentation.

TTL settings give you fine-grained control over freshness. You set a default TTL (used when the origin sends no \`Cache-Control\` or \`Expires\` header), a minimum TTL (which overrides the origin if the origin sends a shorter TTL), and a maximum TTL (which caps what the origin can request). For CloudFront specifically, the \`Cache-Control: s-maxage\` directive overrides \`max-age\` — it lets you set a different cache duration for CDN caches versus browser caches.

When you need to force CloudFront to stop serving stale content immediately, submit a **cache invalidation** request specifying one or more paths (like \`/index.html\` or \`/images/*\`). The first 1,000 invalidation paths per month are free; beyond that, there's a per-path charge.`,
      quiz: [
        {
          question:
            "What is the difference between a Cache Policy and an Origin Request Policy in CloudFront?",
          options: [
            "Cache Policy sets TTL; Origin Request Policy sets allowed HTTP methods",
            "Cache Policy defines the cache key; Origin Request Policy forwards values to origin without adding them to the cache key",
            "Cache Policy is for S3 origins; Origin Request Policy is for ALB origins",
            "They are synonymous — both control what is included in the cache key",
          ],
          correctIndex: 1,
          explanation:
            "A Cache Policy defines what constitutes the cache key (path, query strings, headers, cookies). An Origin Request Policy controls what CloudFront forwards to the origin without including those values in the cache key — useful for forwarding auth headers without fragmenting the cache.",
        },
        {
          question:
            "Which Cache-Control directive specifically controls CDN cache TTL separately from browser cache TTL?",
          options: [
            "max-age",
            "no-cache",
            "s-maxage",
            "stale-while-revalidate",
          ],
          correctIndex: 2,
          explanation:
            "The Cache-Control: s-maxage directive is honored by shared caches (like CloudFront) and overrides max-age for CDN caching purposes. This lets you set a longer TTL in CloudFront while keeping a shorter browser cache TTL using max-age.",
        },
        {
          question: "How much does CloudFront charge for cache invalidations?",
          options: [
            "Always free, regardless of the number of paths",
            "Per-path charge starting from the first invalidation",
            "First 1,000 invalidation paths per month are free; charged per path beyond that",
            "Flat monthly fee based on the number of distributions",
          ],
          correctIndex: 2,
          explanation:
            "CloudFront provides 1,000 invalidation paths per month at no charge. Each additional path beyond 1,000 incurs a per-path charge. Wildcard paths like /images/* count as one path.",
        },
      ],
    },
    {
      heading: "Origins & Origin Groups",
      body: `S3 origins come in two modes. When you use the S3 website endpoint as your origin, CloudFront can leverage S3's static website features like redirects and custom error documents. When you use the S3 REST API endpoint as your origin (the standard mode), you should pair it with **Origin Access Control (OAC)** — the modern way to restrict bucket access to CloudFront only. OAC uses the CloudFront service principal in the bucket policy, replacing the older Origin Access Identity (OAI) approach.

For custom origins (ALB, EC2, HTTP servers), CloudFront connects over HTTP or HTTPS. A useful security pattern is to add a secret custom header to all CloudFront requests and configure your origin to reject requests that don't include it — this ensures traffic can only reach your origin through CloudFront, not by hitting the origin directly.

**Origin Groups** provide failover: you configure a primary origin and a secondary origin. If the primary returns a 5xx error or times out, CloudFront automatically retries the request on the secondary origin. This enables high-availability patterns like a primary S3 bucket in one region with a replica in another region as the failover origin.

A single distribution can have **multiple origins and multiple cache behaviors**, letting CloudFront act as the single entry point for an entire application — routing API calls to an ALB, static assets to S3, and everything else to a default S3 bucket, all from one CloudFront domain.`,
      quiz: [
        {
          question:
            "What is Origin Access Control (OAC) used for in CloudFront?",
          options: [
            "Restricting viewer access by country",
            "Restricting S3 bucket access so only CloudFront can read objects",
            "Enabling HTTPS between CloudFront and the origin",
            "Configuring custom headers sent from viewers to CloudFront",
          ],
          correctIndex: 1,
          explanation:
            "OAC is the modern mechanism to restrict S3 bucket access so only CloudFront can retrieve objects. It replaces the older Origin Access Identity (OAI) and uses the CloudFront service principal in the S3 bucket policy.",
        },
        {
          question: "What does an Origin Group provide in CloudFront?",
          options: [
            "Load balancing across multiple origins",
            "Automatic failover from a primary origin to a secondary origin on 5xx errors",
            "Grouping cache behaviors for centralized TTL management",
            "Aggregating metrics from multiple origins into one CloudWatch dashboard",
          ],
          correctIndex: 1,
          explanation:
            "An Origin Group provides high-availability failover: if the primary origin returns a 5xx error or times out, CloudFront automatically retries the request on the secondary origin. This is not load balancing — all traffic goes to the primary unless it fails.",
        },
      ],
    },
    {
      heading: "Security",
      body: `HTTPS is the foundation of CloudFront security. You attach an ACM certificate to the distribution to enable HTTPS. A critical detail: the ACM certificate for CloudFront **must be provisioned in the us-east-1 region**, regardless of where your distribution serves content or where your origins are located. This is one of the most common exam pitfalls.

The **Viewer Protocol Policy** controls whether CloudFront accepts HTTP, HTTPS, or both from viewers. The recommended setting is "Redirect HTTP to HTTPS" — this ensures all traffic is encrypted without breaking clients that use HTTP.

**AWS WAF** can be attached to a CloudFront distribution to evaluate requests at the edge before any content is served or any backend is called. WAF rules can block SQL injection and XSS patterns, rate-limit specific IPs or paths, and use geographic blocking. Running WAF at CloudFront is typically cheaper per request than running it at the load balancer level.

**Signed URLs** grant time-limited, optionally IP-restricted access to a single specific file. They're the right choice for content like video downloads or generated reports that should only be accessible for a limited time. **Signed Cookies** grant the same kind of time-limited access but to multiple files matching a path pattern — useful for protecting an entire content section without modifying every URL. Both use **Trusted Key Groups** to specify which key pairs can generate valid signatures.

**Geo Restriction** lets you allow or block content delivery to specific countries using IP-based geolocation. It's coarse-grained and should not be relied upon as a security control, but it works for compliance requirements that prohibit serving content in certain jurisdictions. **Field-Level Encryption** goes further — it encrypts specific POST request fields at the edge using a public key, so only the application with the private key can decrypt them, even from CloudFront's perspective.`,
      quiz: [
        {
          question:
            "In which AWS region must an ACM certificate be provisioned to use with CloudFront?",
          options: [
            "The same region as the primary origin",
            "Any region — CloudFront replicates ACM certificates automatically",
            "us-east-1",
            "us-west-2",
          ],
          correctIndex: 2,
          explanation:
            "ACM certificates for CloudFront must be provisioned in us-east-1 (N. Virginia) regardless of where the distribution serves content or where origins are located. This is one of the most common exam traps.",
        },
        {
          question:
            "When should you use Signed Cookies instead of Signed URLs in CloudFront?",
          options: [
            "When you need to grant access to a single specific file",
            "When you need to grant access to multiple files matching a path pattern without changing every URL",
            "When you want to restrict access by country",
            "When using Lambda@Edge for request authorization",
          ],
          correctIndex: 1,
          explanation:
            "Signed Cookies are used to grant time-limited access to multiple files matching a path pattern without requiring individual signed URLs for each file. Signed URLs are for single-file access. Both provide time-limited, optionally IP-restricted access.",
        },
        {
          question:
            "What does Field-Level Encryption in CloudFront accomplish?",
          options: [
            "Encrypts the entire HTTP request body at the edge",
            "Encrypts specific POST request fields at the edge using a public key so only the app with the private key can decrypt them",
            "Encrypts cache objects stored at edge locations",
            "Enables end-to-end TLS between the viewer and origin",
          ],
          correctIndex: 1,
          explanation:
            "Field-Level Encryption encrypts specific POST fields at the CloudFront edge using a public key. Even CloudFront cannot read these fields — only the application holding the corresponding private key can decrypt them, providing an extra layer of protection for sensitive data.",
        },
      ],
    },
    {
      heading: "Lambda@Edge & CloudFront Functions",
      body: `CloudFront lets you run code at the edge to customize request and response processing without sending requests back to your origin. Two execution environments are available, suited to different complexity levels.

**Lambda@Edge** runs full Lambda functions at edge locations. Your Lambda functions are deployed to us-east-1 and CloudFront replicates them to all edge locations automatically. Lambda@Edge can trigger at four points in the request lifecycle: **Viewer Request** (when CloudFront receives a request from the user, before checking the cache), **Origin Request** (when CloudFront is about to forward a cache miss to the origin), **Origin Response** (when CloudFront receives the response from the origin, before caching it), and **Viewer Response** (before CloudFront sends the response to the user). The Origin Request and Origin Response triggers are particularly powerful because they can modify what's sent to and received from the origin. Lambda@Edge supports complex logic, external API calls, and larger payloads, but it has constraints: no VPC access, no EFS, limited memory (128 MB for viewer triggers), and limited package size.

**CloudFront Functions** are lighter-weight JavaScript functions that run only at the Viewer Request and Viewer Response stages. They execute in nanoseconds, support 2 MB of memory, and are significantly cheaper than Lambda@Edge. They're the right choice for simple transformations: URL normalization, HTTP header manipulation, request routing decisions, and A/B testing redirects. Use CloudFront Functions when simplicity and speed matter; use Lambda@Edge when you need the Origin Request/Response triggers or more complex logic.`,
      quiz: [
        {
          question:
            "At which trigger points can Lambda@Edge run but CloudFront Functions cannot?",
          options: [
            "Viewer Request and Viewer Response",
            "Origin Request and Origin Response",
            "All four trigger points — they have the same capabilities",
            "CloudFront Functions run at all four points; Lambda@Edge runs at two",
          ],
          correctIndex: 1,
          explanation:
            "CloudFront Functions only run at Viewer Request and Viewer Response. Lambda@Edge additionally supports Origin Request and Origin Response triggers, which are more powerful because they can modify requests sent to and responses received from the origin.",
        },
        {
          question:
            "Where are Lambda@Edge functions deployed, and how do they reach all edge locations?",
          options: [
            "Deployed to every edge location individually by the developer",
            "Deployed to us-east-1, and CloudFront replicates them to all edge locations automatically",
            "Deployed to the same region as the origin, then cached at edge locations",
            "Deployed to multiple regions using Lambda global endpoints",
          ],
          correctIndex: 1,
          explanation:
            "Lambda@Edge functions are deployed in us-east-1. CloudFront automatically replicates them to all edge locations. Developers only manage the function in us-east-1 — the global distribution is handled by CloudFront.",
        },
        {
          question:
            "Which is the correct use case for CloudFront Functions over Lambda@Edge?",
          options: [
            "Calling an external API to validate authentication tokens",
            "Modifying response headers from the origin before caching",
            "Normalizing URL paths by removing trailing slashes for better cache hit ratios",
            "Processing large request payloads exceeding 40 KB",
          ],
          correctIndex: 2,
          explanation:
            "CloudFront Functions are ideal for simple, fast transformations like URL normalization, header manipulation, and A/B test redirects. They run at Viewer Request/Response only. Lambda@Edge is needed for Origin triggers, external API calls, or processing larger payloads.",
        },
      ],
    },
    {
      heading: "CloudFront with Other Services",
      body: `The most common CloudFront integration is **CloudFront + S3**, which is the standard pattern for serving static websites and application assets globally. Use OAC to keep the S3 bucket private (blocking direct public access) and let CloudFront be the only path to the content. Combine with S3 versioning and cache invalidation for zero-downtime deployments.

**CloudFront + API Gateway** is useful when you want to add WAF protection, geographic restrictions, or edge caching to an API that's otherwise served from a single region. A Regional API Gateway endpoint is the correct type to use behind CloudFront — Edge-Optimized API Gateway already uses CloudFront internally, so putting another CloudFront in front of it is redundant.

**CloudFront + ALB** follows a security pattern: CloudFront sends a secret custom header, and the ALB is configured with a WAF rule or security group rule that only accepts traffic including that header. This prevents attackers from bypassing CloudFront by hitting the ALB directly. Because CloudFront's IP ranges are published, you could also restrict the ALB's security group to CloudFront's IP ranges.

**CloudFront + Route 53** enables custom domains through a Route 53 ALIAS record pointing to the CloudFront distribution's domain name. ALIAS records (unlike CNAMEs) work at the zone apex, so you can use a bare domain like \`example.com\` rather than \`www.example.com\`.`,
      quiz: [
        {
          question:
            "Which type of API Gateway endpoint should be placed behind CloudFront?",
          options: [
            "Edge-Optimized, because it has lower latency",
            "Regional, because Edge-Optimized already uses CloudFront internally",
            "Private, because it provides the most security",
            "WebSocket, because HTTP APIs don't support CloudFront",
          ],
          correctIndex: 1,
          explanation:
            "A Regional API Gateway endpoint is the correct choice to place behind CloudFront. Edge-Optimized API Gateway already uses CloudFront internally — adding another CloudFront distribution in front of it would be redundant and add unnecessary cost.",
        },
        {
          question:
            "How does the CloudFront + ALB security pattern prevent direct access to the ALB?",
          options: [
            "The ALB is placed in a private subnet with no internet gateway",
            "CloudFront sends a secret custom header; the ALB rejects requests without that header",
            "The ALB uses IAM authentication that only CloudFront's service principal can satisfy",
            "CloudFront places the ALB behind a NAT Gateway",
          ],
          correctIndex: 1,
          explanation:
            "CloudFront is configured to add a secret custom header to all requests. The ALB (via WAF or listener rules) rejects any request that doesn't include the header. This prevents attackers who know the ALB's DNS name from bypassing CloudFront.",
        },
      ],
    },
  ],

  keyFacts: [
    "ACM certificate for CloudFront: must be in us-east-1 (regardless of distribution regions)",
    "OAC (Origin Access Control): restricts S3 bucket access to CloudFront only (replaces OAI)",
    "Cache invalidation: first 1,000 paths/month free; charged after",
    "s-maxage header: controls CDN cache TTL (separate from client Cache-Control max-age)",
    "Signed URLs: time-limited access to one file. Signed Cookies: access to multiple files/pattern",
    "Lambda@Edge: 4 trigger points (viewer request/response, origin request/response)",
    "CloudFront Functions: viewer request/response only; cheaper/faster than Lambda@Edge",
    "Origin Group: primary + failover origin for high availability",
    "WAF on CloudFront: evaluated at edge before traffic reaches origin",
    "Geo restriction: country-level allowlist/blocklist using IP-based lookup",
  ],

  relatedServices: [
    "Amazon S3",
    "Elastic Load Balancing",
    "Amazon API Gateway",
    "AWS Lambda",
    "AWS WAF",
    "AWS Certificate Manager",
    "Amazon Route 53",
    "AWS Shield",
  ],

  examTips: [
    "ACM certificate for CloudFront MUST be in us-east-1 — a common exam trap.",
    "OAC replaces OAI for restricting S3 access to CloudFront only.",
    "Signed URLs vs Signed Cookies: URLs for single file, Cookies for multiple files.",
    "Lambda@Edge can access origin request/response — CloudFront Functions cannot.",
    "s-maxage overrides max-age for CDN caches specifically.",
    "Origin Group = primary + secondary for failover (not load balancing).",
    "Field-Level Encryption: edge encrypts specific fields; only app with private key decrypts.",
    "Cache invalidation propagates to all edges but takes time — not instant.",
    "WAF at CloudFront level = cheaper than WAF at ALB for global protection.",
  ],

  topicQuiz: [
    {
      question:
        "A company needs to serve private S3 content through CloudFront while blocking all direct S3 access. What is the recommended modern approach?",
      options: [
        "Enable S3 Transfer Acceleration and configure CloudFront to use the accelerated endpoint",
        "Use Origin Access Identity (OAI) with a bucket policy granting OAI read permissions",
        "Use Origin Access Control (OAC) with a bucket policy granting the CloudFront service principal access",
        "Set the S3 bucket as a website endpoint and enable static website hosting",
      ],
      correctIndex: 2,
      explanation:
        "OAC is the modern replacement for OAI. It uses the CloudFront service principal in the S3 bucket policy to restrict access to CloudFront only. OAI is the legacy approach and should not be used for new distributions.",
    },
    {
      question:
        "A developer deploys a new version of a static website to S3 with the same file names. Users are still seeing the old content from CloudFront. What is the most direct solution?",
      options: [
        "Update the Cache-Control headers on the S3 objects to max-age=0",
        "Submit a cache invalidation request for the affected paths in CloudFront",
        "Create a new CloudFront distribution pointing to the same S3 bucket",
        "Disable the CloudFront distribution and re-enable it",
      ],
      correctIndex: 1,
      explanation:
        "Submitting a cache invalidation request forces CloudFront to stop serving the cached version and fetch fresh content from S3. The first 1,000 paths per month are free. Simply updating S3 objects doesn't clear CloudFront's cache — invalidation is required.",
    },
    {
      question:
        "A video streaming company needs to grant temporary, time-limited access to individual video files for paying users. Which CloudFront feature should they use?",
      options: [
        "Signed Cookies",
        "Signed URLs",
        "Geo Restriction",
        "Field-Level Encryption",
      ],
      correctIndex: 1,
      explanation:
        "Signed URLs provide time-limited (and optionally IP-restricted) access to a single specific file. Signed Cookies would be used if you need to grant access to multiple files matching a path pattern without modifying every URL.",
    },
    {
      question:
        "A team wants to implement A/B testing by routing 50% of CloudFront viewers to different URL paths based on a cookie value. Which edge compute option is most cost-effective?",
      options: [
        "Lambda@Edge at the Origin Request trigger",
        "Lambda@Edge at the Viewer Request trigger",
        "CloudFront Functions at the Viewer Request trigger",
        "Lambda@Edge at the Origin Response trigger",
      ],
      correctIndex: 2,
      explanation:
        "CloudFront Functions at the Viewer Request trigger is the most cost-effective solution for simple routing logic like A/B testing. CloudFront Functions are significantly cheaper than Lambda@Edge and run in nanoseconds. Since A/B testing based on cookies is simple logic, Lambda@Edge is overkill.",
    },
    {
      question:
        "An organization requires an SSL certificate for their CloudFront distribution's custom domain. The certificate is currently in eu-west-1. What must they do?",
      options: [
        "Nothing — CloudFront automatically replicates ACM certificates across regions",
        "Move the certificate to us-east-1 by requesting a new certificate in that region",
        "Move the certificate to the same region as the CloudFront origin",
        "Use a self-signed certificate instead since ACM certificates are regional",
      ],
      correctIndex: 1,
      explanation:
        "ACM certificates used with CloudFront must be in us-east-1 regardless of where origins or viewers are located. A certificate in eu-west-1 cannot be attached to a CloudFront distribution. The team must request a new certificate in us-east-1.",
    },
    {
      question:
        "A company wants to ensure that WAF rules are evaluated before any traffic reaches their backend, at the lowest cost. Where should they attach AWS WAF?",
      options: [
        "On the Application Load Balancer",
        "On the CloudFront distribution",
        "On the API Gateway",
        "On individual Lambda functions",
      ],
      correctIndex: 1,
      explanation:
        "Attaching WAF to CloudFront evaluates rules at edge locations before any traffic reaches the origin or backend. This is typically cheaper per request than WAF at the ALB level and provides the earliest possible blocking of malicious traffic.",
    },
    {
      question:
        "A developer needs to modify the origin request URL path based on query parameters before CloudFront forwards a cache miss to S3. Which solution allows this?",
      options: [
        "CloudFront Functions at the Viewer Request trigger",
        "Lambda@Edge at the Origin Request trigger",
        "Lambda@Edge at the Viewer Response trigger",
        "CloudFront Functions at the Viewer Response trigger",
      ],
      correctIndex: 1,
      explanation:
        "Lambda@Edge at the Origin Request trigger fires when CloudFront is about to forward a cache miss to the origin. This is the correct point to modify the request URL, headers, or query parameters before they reach the origin. CloudFront Functions cannot run at the Origin Request trigger.",
    },
    {
      question:
        "A company needs high availability for their CloudFront distribution, automatically failing over from a primary S3 bucket to a secondary S3 bucket in another region on errors. Which feature enables this?",
      options: [
        "Multiple cache behaviors pointing to different origins",
        "CloudFront Origin Group with primary and secondary origins",
        "Route 53 health checks with failover routing",
        "S3 Cross-Region Replication with CloudFront's automatic origin selection",
      ],
      correctIndex: 1,
      explanation:
        "A CloudFront Origin Group defines a primary origin and a secondary failover origin. If the primary returns a 5xx error or times out, CloudFront automatically retries on the secondary. This is the built-in CloudFront failover mechanism, distinct from Route 53 health check routing.",
    },
  ],
};
