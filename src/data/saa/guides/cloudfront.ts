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
    },
    {
      heading: "Cache Behaviors and TTL Configuration",
      body: `Cache behaviors map URL path patterns to specific origin configurations and caching policies, allowing a single distribution to route different request types appropriately. For example, \`/api/*\` can be routed to an ALB with caching disabled and all headers forwarded, while \`/static/*\` routes to S3 with aggressive caching and header stripping to maximize cache hit rate. The Time to Live (TTL) controls how long CloudFront caches a response before checking the origin for a fresh copy. The minimum, default, and maximum TTL values interact with the \`Cache-Control\` and \`Expires\` headers sent by the origin — CloudFront respects the origin's headers within the configured bounds. Setting long TTLs improves cache hit rates and reduces origin load, but requires explicit cache invalidation (or versioned URLs like \`/app.v2.js\`) when content changes. CloudFront charges per invalidation path beyond the first 1,000 paths per month, making versioned filenames more cost-effective for frequent deployments.`,
    },
    {
      heading: "Security: HTTPS, WAF, and Geo-Restriction",
      body: `CloudFront enforces HTTPS between viewers and edge locations using certificates from AWS Certificate Manager (which must be provisioned in the us-east-1 region for CloudFront use). The Viewer Protocol Policy can redirect HTTP to HTTPS or require HTTPS only. Between CloudFront and the origin, the Origin Protocol Policy controls whether communication uses HTTP, HTTPS, or matches the viewer protocol. AWS WAF can be associated with a CloudFront distribution to filter malicious requests — SQL injection, cross-site scripting, and rate-based rules — at the edge before they reach the origin, reducing both security exposure and unnecessary origin load. Geographic restrictions (geo-blocking) allow or deny access to content based on the viewer's country, determined from the viewer's IP address using a geolocation database. Field-level encryption adds an additional layer by encrypting specific POST fields (like credit card numbers) at the edge using public key cryptography, so they remain encrypted even from your own application servers until decrypted by the designated microservice.`,
    },
    {
      heading: "Lambda@Edge and CloudFront Functions",
      body: `CloudFront supports two compute-at-edge options for customizing request and response behavior without round-tripping to the origin. Lambda@Edge runs full Lambda functions (Node.js or Python) at Regional Edge Caches in response to CloudFront events: viewer request (before cache lookup), origin request (on cache miss, before forwarding to origin), origin response (after origin responds, before caching), and viewer response (before returning to viewer). Lambda@Edge is appropriate for A/B testing, authentication and authorization, URL rewriting and redirects, and dynamically generating responses. CloudFront Functions are a lighter, faster alternative for simple request/response transformations — URL normalization, header manipulation, and simple redirects — running at the edge location itself (not just Regional Edge Caches) with sub-millisecond execution time and lower cost. For the SAA-C03 exam, choose Lambda@Edge for complex logic requiring full Lambda capabilities and CloudFront Functions for high-frequency, lightweight transformations.`,
    },
    {
      heading: "Signed URLs and Signed Cookies",
      body: `Private content distribution requires restricting access to authenticated or authorized users. CloudFront Signed URLs grant time-limited access to a specific object — each URL contains a signature, expiration time, and optional IP restriction. Signed URLs are appropriate for granting access to individual files, such as a software download after purchase or a streaming video after subscription verification. CloudFront Signed Cookies grant access to multiple objects (entire content libraries) without requiring a unique URL per file — users receive a signed cookie that CloudFront validates for each request. Signed URLs take precedence over signed cookies for the same request. Both mechanisms require a CloudFront Key Group with an RSA key pair — the private key signs URLs/cookies, the public key is registered with CloudFront for verification. S3 presigned URLs bypass CloudFront entirely; for content served through CloudFront, use CloudFront signed mechanisms, not S3 presigned URLs.`,
    },
    {
      heading: "CloudFront and API Gateway Integration",
      body: `Placing CloudFront in front of API Gateway accelerates REST and HTTP APIs by caching API responses at the edge, reducing latency for repeated identical requests and reducing load on backend Lambda functions or services. CloudFront supports custom domain names for API Gateway endpoints, providing a consistent domain experience. Cache-Control headers from API Gateway control CloudFront caching behavior — responses with \`Cache-Control: no-cache\` are never cached, while responses with long max-age values are aggressively cached. WAF rules associated with the CloudFront distribution protect the API before requests reach API Gateway's own WAF, providing defense in depth. For globally distributed APIs, CloudFront combined with API Gateway in multiple regions and Route 53 latency-based routing creates a multi-region active-active API architecture.`,
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
};
