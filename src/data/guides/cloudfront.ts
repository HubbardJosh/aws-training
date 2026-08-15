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
      body: `**Distribution**: the unit of CloudFront configuration. A distribution has a domain name (e.g. \`d111111abcdef8.cloudfront.net\`) or custom domain (with ACM certificate).

**Origin**: where CloudFront fetches content from when not cached. Types:
- S3 bucket (static files, images, videos)
- ALB or EC2 (dynamic content)
- API Gateway (REST APIs)
- Any HTTP server (on-premises, third-party)

**Cache Behavior**: rules for how CloudFront handles requests matching a URL pattern. Configure per path pattern (\`/api/*\`, \`/images/*\`, \`/\*\`). Settings: TTL, compression, allowed HTTP methods, cache keys, Lambda@Edge associations.

**Edge Locations**: 400+ points of presence (PoPs) globally. Serve cached content and run Lambda@Edge.

**Regional Edge Caches**: intermediate cache between edge locations and your origin. Larger cache capacity. Reduces hits going all the way to the origin.

**Cache Hit Ratio**: percentage of requests served from cache. Higher = better (less origin load, lower latency). Improve by: consistent cache keys, appropriate TTLs, compressing responses.`,
    },
    {
      heading: "Caching & TTL",
      body: `**Cache Key**: determines if a request is a cache hit. By default: the URL path. Customize to include query strings, headers, cookies.

**Cache Policy**: CloudFront managed or custom policies controlling:
- Which query strings to include in cache key
- Which headers to include in cache key
- Which cookies to include in cache key
- TTL settings (min, max, default)

**Origin Request Policy**: controls what CloudFront forwards to the origin (query strings, headers, cookies) *without* including them in the cache key. Use for auth headers you need at origin but shouldn't vary cache by.

**TTL settings**:
- Default TTL: time an object is cached if origin doesn't set Cache-Control/Expires
- Minimum TTL: override short origin TTLs
- Maximum TTL: cap origin's long TTLs

**Cache-Control headers from origin**: CloudFront respects \`Cache-Control: max-age\`, \`Cache-Control: s-maxage\`, and \`Expires\`. \`s-maxage\` overrides \`max-age\` for CloudFront specifically.

**Cache Invalidation**: force CloudFront to remove cached objects. Submit an invalidation request with path(s) (e.g. \`/images/*\`, \`/index.html\`). First 1,000 paths per month free; charged after. Propagates to all edge locations.`,
    },
    {
      heading: "Origins & Origin Groups",
      body: `**S3 Origin**:
- Static website hosting mode: use S3 website endpoint as origin (supports redirects/error docs)
- S3 REST API mode: use S3 bucket as origin (use OAC for private bucket access)
- **Origin Access Control (OAC)**: newer way to restrict S3 access to CloudFront only. Replaces Origin Access Identity (OAI). S3 bucket policy allows CloudFront service principal.

**Custom Origin** (ALB, EC2, HTTP server):
- CloudFront connects via HTTP or HTTPS to your origin
- Set origin protocol (HTTP/HTTPS)
- Custom headers: add secret header that origin validates (ensures requests come through CloudFront, not directly)

**Origin Groups**: configure two origins for failover. Primary + secondary. If primary returns 5xx or timeout, CloudFront retries on secondary. Use for high availability (S3 primary → different region S3 secondary).

**Multiple Origins per Distribution**: route \`/api/*\` to ALB, \`/static/*\` to S3, \`/*\` to S3 default. Single CloudFront distribution handles all content types.`,
    },
    {
      heading: "Security",
      body: `**HTTPS / TLS**: serve content over HTTPS. Use ACM (Certificate Manager) for SSL certificate. Certificate must be in **us-east-1** for CloudFront (even for global distributions).

**Viewer Protocol Policy**:
- Allow all (HTTP + HTTPS)
- Redirect HTTP to HTTPS (recommended)
- HTTPS only

**Field-Level Encryption**: encrypt specific POST request fields at the edge using a public key. Only application with private key can decrypt. Use for sensitive data (credit card numbers).

**AWS WAF**: attach WAF web ACL to CloudFront distribution. Block/rate-limit by IP, geo, headers, body patterns. WAF rules evaluated at edge before content is served.

**Geo Restriction (Geo Blocking)**: restrict content to specific countries (allowlist) or block specific countries (blocklist). Coarse-grained; uses IP-based geo-lookup.

**Signed URLs**: grant time-limited access to a specific private file. Useful for: paid content, download links that expire. URL contains signature, expiry, and IP restrictions.

**Signed Cookies**: grant time-limited access to multiple files matching a pattern. Set a cookie instead of modifying each URL. Useful for protecting an entire section of a site.

**Trusted Key Groups**: define which key pairs can sign URLs/cookies. Replaces the older CloudFront Key Pairs approach.`,
    },
    {
      heading: "Lambda@Edge & CloudFront Functions",
      body: `**Lambda@Edge**: run Lambda functions at edge locations triggered by CloudFront events.

**4 trigger points**:
1. *Viewer Request*: when CloudFront receives request from user (before cache check)
2. *Viewer Response*: before CloudFront forwards response to user (after cache hit)
3. *Origin Request*: when CloudFront forwards request to origin (on cache miss)
4. *Origin Response*: when CloudFront receives response from origin (before caching)

**Use cases**: A/B testing, auth token validation, URL rewriting/redirects, adding security headers, personalizing content at edge, device detection.

**Constraints**: Lambda@Edge runs in us-east-1 but is replicated to all edges. No VPC access, no EFS, limited memory (128MB viewer, 128MB origin), limited package size.

**CloudFront Functions**: lightweight JavaScript functions running at edge. Faster and cheaper than Lambda@Edge. Only at Viewer Request and Viewer Response events. Nanosecond latency, 2MB memory limit. Good for: simple URL rewrites, HTTP header manipulation, request normalization.

**When to use which**:
- Simple header manipulation → CloudFront Functions
- Complex auth, A/B with external state, large computation → Lambda@Edge`,
    },
    {
      heading: "CloudFront with Other Services",
      body: `**CloudFront + S3**: serve static websites from S3 via CloudFront. Use OAC to keep bucket private. Set appropriate cache TTLs. Use S3 versioning + cache invalidation for deployments.

**CloudFront + API Gateway**: put CloudFront in front of API Gateway to add WAF, geo restriction, caching of API responses, and custom domain management. API Gateway regional endpoint + CloudFront is a common pattern.

**CloudFront + ALB**: CloudFront in front of ALB for global acceleration. Add custom header from CloudFront → ALB security group only allows CloudFront IPs (or validates custom header). Protects origin from direct access.

**CloudFront + Lambda@Edge**: process requests at edge — auth validation, A/B testing, content personalization — without going back to origin.

**CloudFront + ACM**: free TLS certificates from ACM. Certificate must be in us-east-1. CloudFront handles HTTPS termination at edge.

**CloudFront + WAF**: block malicious traffic at the CDN layer before it reaches origin. Protects against OWASP Top 10, bots, DDoS.

**CloudFront + Route 53**: use Route 53 ALIAS record pointing to CloudFront distribution domain. Enables custom domain (www.example.com) for distribution.`,
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
