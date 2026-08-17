import { ServiceGuide } from "../../types/guide";

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
    },
    {
      heading: "Caching & TTL",
      body: `CloudFront's caching behavior is driven by two concepts: the **cache key** and the **TTL**. The cache key is the set of values that uniquely identify a cacheable response — by default it's just the URL path, but you can expand it to include specific query strings, headers, or cookies using a **Cache Policy**. Adding values to the cache key makes caching more precise but reduces the cache hit ratio, because more unique combinations must be stored separately.

The **Origin Request Policy** is a related concept that often causes confusion: it controls what CloudFront forwards to your origin (query strings, headers, cookies) *without* including them in the cache key. Use this for values your origin needs (like an auth header) that shouldn't cause cache fragmentation.

TTL settings give you fine-grained control over freshness. You set a default TTL (used when the origin sends no \`Cache-Control\` or \`Expires\` header), a minimum TTL (which overrides the origin if the origin sends a shorter TTL), and a maximum TTL (which caps what the origin can request). For CloudFront specifically, the \`Cache-Control: s-maxage\` directive overrides \`max-age\` — it lets you set a different cache duration for CDN caches versus browser caches.

When you need to force CloudFront to stop serving stale content immediately, submit a **cache invalidation** request specifying one or more paths (like \`/index.html\` or \`/images/*\`). The first 1,000 invalidation paths per month are free; beyond that, there's a per-path charge.`,
    },
    {
      heading: "Origins & Origin Groups",
      body: `S3 origins come in two modes. When you use the S3 website endpoint as your origin, CloudFront can leverage S3's static website features like redirects and custom error documents. When you use the S3 REST API endpoint as your origin (the standard mode), you should pair it with **Origin Access Control (OAC)** — the modern way to restrict bucket access to CloudFront only. OAC uses the CloudFront service principal in the bucket policy, replacing the older Origin Access Identity (OAI) approach.

For custom origins (ALB, EC2, HTTP servers), CloudFront connects over HTTP or HTTPS. A useful security pattern is to add a secret custom header to all CloudFront requests and configure your origin to reject requests that don't include it — this ensures traffic can only reach your origin through CloudFront, not by hitting the origin directly.

**Origin Groups** provide failover: you configure a primary origin and a secondary origin. If the primary returns a 5xx error or times out, CloudFront automatically retries the request on the secondary origin. This enables high-availability patterns like a primary S3 bucket in one region with a replica in another region as the failover origin.

A single distribution can have **multiple origins and multiple cache behaviors**, letting CloudFront act as the single entry point for an entire application — routing API calls to an ALB, static assets to S3, and everything else to a default S3 bucket, all from one CloudFront domain.`,
    },
    {
      heading: "Security",
      body: `HTTPS is the foundation of CloudFront security. You attach an ACM certificate to the distribution to enable HTTPS. A critical detail: the ACM certificate for CloudFront **must be provisioned in the us-east-1 region**, regardless of where your distribution serves content or where your origins are located. This is one of the most common exam pitfalls.

The **Viewer Protocol Policy** controls whether CloudFront accepts HTTP, HTTPS, or both from viewers. The recommended setting is "Redirect HTTP to HTTPS" — this ensures all traffic is encrypted without breaking clients that use HTTP.

**AWS WAF** can be attached to a CloudFront distribution to evaluate requests at the edge before any content is served or any backend is called. WAF rules can block SQL injection and XSS patterns, rate-limit specific IPs or paths, and use geographic blocking. Running WAF at CloudFront is typically cheaper per request than running it at the load balancer level.

**Signed URLs** grant time-limited, optionally IP-restricted access to a single specific file. They're the right choice for content like video downloads or generated reports that should only be accessible for a limited time. **Signed Cookies** grant the same kind of time-limited access but to multiple files matching a path pattern — useful for protecting an entire content section without modifying every URL. Both use **Trusted Key Groups** to specify which key pairs can generate valid signatures.

**Geo Restriction** lets you allow or block content delivery to specific countries using IP-based geolocation. It's coarse-grained and should not be relied upon as a security control, but it works for compliance requirements that prohibit serving content in certain jurisdictions. **Field-Level Encryption** goes further — it encrypts specific POST request fields at the edge using a public key, so only the application with the private key can decrypt them, even from CloudFront's perspective.`,
    },
    {
      heading: "Lambda@Edge & CloudFront Functions",
      body: `CloudFront lets you run code at the edge to customize request and response processing without sending requests back to your origin. Two execution environments are available, suited to different complexity levels.

**Lambda@Edge** runs full Lambda functions at edge locations. Your Lambda functions are deployed to us-east-1 and CloudFront replicates them to all edge locations automatically. Lambda@Edge can trigger at four points in the request lifecycle: **Viewer Request** (when CloudFront receives a request from the user, before checking the cache), **Origin Request** (when CloudFront is about to forward a cache miss to the origin), **Origin Response** (when CloudFront receives the response from the origin, before caching it), and **Viewer Response** (before CloudFront sends the response to the user). The Origin Request and Origin Response triggers are particularly powerful because they can modify what's sent to and received from the origin. Lambda@Edge supports complex logic, external API calls, and larger payloads, but it has constraints: no VPC access, no EFS, limited memory (128 MB for viewer triggers), and limited package size.

**CloudFront Functions** are lighter-weight JavaScript functions that run only at the Viewer Request and Viewer Response stages. They execute in nanoseconds, support 2 MB of memory, and are significantly cheaper than Lambda@Edge. They're the right choice for simple transformations: URL normalization, HTTP header manipulation, request routing decisions, and A/B testing redirects. Use CloudFront Functions when simplicity and speed matter; use Lambda@Edge when you need the Origin Request/Response triggers or more complex logic.`,
    },
    {
      heading: "CloudFront with Other Services",
      body: `The most common CloudFront integration is **CloudFront + S3**, which is the standard pattern for serving static websites and application assets globally. Use OAC to keep the S3 bucket private (blocking direct public access) and let CloudFront be the only path to the content. Combine with S3 versioning and cache invalidation for zero-downtime deployments.

**CloudFront + API Gateway** is useful when you want to add WAF protection, geographic restrictions, or edge caching to an API that's otherwise served from a single region. A Regional API Gateway endpoint is the correct type to use behind CloudFront — Edge-Optimized API Gateway already uses CloudFront internally, so putting another CloudFront in front of it is redundant.

**CloudFront + ALB** follows a security pattern: CloudFront sends a secret custom header, and the ALB is configured with a WAF rule or security group rule that only accepts traffic including that header. This prevents attackers from bypassing CloudFront by hitting the ALB directly. Because CloudFront's IP ranges are published, you could also restrict the ALB's security group to CloudFront's IP ranges.

**CloudFront + Route 53** enables custom domains through a Route 53 ALIAS record pointing to the CloudFront distribution's domain name. ALIAS records (unlike CNAMEs) work at the zone apex, so you can use a bare domain like \`example.com\` rather than \`www.example.com\`.`,
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
};
