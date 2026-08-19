import { ServiceGuide } from "../../../types/guide";

export const cloudfrontGuide: ServiceGuide = {
  id: "clf-cloudfront",
  service: "Amazon CloudFront",
  domain: "development",
  tagline: "Global content delivery network for low-latency distribution",
  intro:
    "Amazon CloudFront is a fast content delivery network (CDN) that securely delivers data, videos, applications, and APIs globally with low latency and high transfer speeds by serving content from edge locations near your users.",

  sections: [
    {
      heading: "How CloudFront Works",
      body: `CloudFront operates through a global network of **edge locations** — data centers distributed around the world in major cities and metropolitan areas. When a user requests content (a web page, image, video, or API response), CloudFront routes the request to the nearest edge location rather than all the way back to your origin server.

When content is requested at an edge location for the first time, CloudFront fetches it from the **origin** (an S3 bucket, an EC2 instance, an Application Load Balancer, or any HTTP server) and caches a copy at the edge. Subsequent requests for the same content are served directly from the edge cache — a **cache hit** — with dramatically lower latency for your users.

You configure CloudFront through a **distribution**, which defines your origin, caching behavior, security settings, and which edge locations serve traffic. A distribution has a domain name (e.g., \`d1234abcd.cloudfront.net\`) that your application or DNS records point to.`,
    },
    {
      heading: "Caching and Cache Behavior",
      body: `Caching is the core value proposition of CloudFront. By keeping frequently requested content at the edge, CloudFront reduces the load on your origin and delivers content faster to users worldwide.

**Cache behaviors** define how CloudFront handles requests matching specific URL patterns. For example, you might configure CloudFront to cache image files for 7 days, cache HTML files for 10 minutes, and never cache API requests. Each behavior specifies:
- The **path pattern** (e.g., \`/images/*\`)
- The **TTL** (Time To Live) — how long objects stay in the edge cache before being refreshed from the origin
- Whether to **forward query strings, headers, or cookies** to the origin (forwarding more parameters reduces cache efficiency)

**Cache invalidation** lets you remove objects from the edge cache before their TTL expires. This is useful after deploying new content — you can invalidate specific paths like \`/index.html\` or all paths with \`/*\`. Invalidations cost money per path beyond a free monthly limit, so versioning file names (e.g., \`app.v2.js\`) is often a better approach.`,
    },
    {
      heading: "Origins and Custom Origins",
      body: `A **CloudFront origin** is the source of truth for your content. CloudFront supports multiple types of origins:

**Amazon S3 origins** are the most common for static content. CloudFront fetches files from an S3 bucket and caches them at the edge. Using an **Origin Access Control (OAC)**, you can keep the S3 bucket private and allow only CloudFront to read from it, preventing direct S3 access that bypasses your CDN.

**Custom origins** are any HTTP server: an EC2 instance, an Elastic Load Balancer, your on-premises server, or a third-party web host. CloudFront forwards requests to the custom origin using HTTP or HTTPS.

**Origin Groups** enable **origin failover**: you configure a primary origin and a secondary origin. If CloudFront receives a 5xx error from the primary, it automatically retries the request against the secondary. This improves availability for dynamic content.

You can also configure **multiple behaviors** in a single distribution, routing different URL patterns to different origins — for example, routing \`/api/*\` to an Application Load Balancer and \`/*\` to S3.`,
    },
    {
      heading: "Security Features",
      body: `CloudFront provides several security features that make it suitable for production workloads beyond simple content caching.

**HTTPS** is fully supported. CloudFront can use a **custom SSL certificate** stored in AWS Certificate Manager (ACM) to serve your content over \`https://yoursite.com\`. CloudFront supports modern TLS protocols and can enforce HTTPS-only access, automatically redirecting HTTP requests.

**AWS WAF (Web Application Firewall)** integrates directly with CloudFront distributions. WAF lets you define rules to block common web exploits like SQL injection and cross-site scripting (XSS), filter traffic by IP reputation or geographic location, and set rate limits to mitigate DDoS attacks.

**AWS Shield** is enabled automatically at no cost for all CloudFront distributions, protecting against common DDoS attacks. **AWS Shield Advanced** provides enhanced protection and access to the AWS DDoS Response Team.

**Geo-restriction** (geographic blocking) lets you allow or deny access to your content based on the viewer's country, which can be required for content licensing compliance or export control regulations.

**Signed URLs and Signed Cookies** restrict access to private content. You generate a signed URL with an expiration time and optionally an IP restriction, ensuring only authorized users can access specific files.`,
    },
    {
      heading: "Common Architectures",
      body: `CloudFront is frequently combined with other AWS services to build scalable, performant architectures.

The most common pattern is **CloudFront + S3 for static websites**. You store your HTML, CSS, JavaScript, and image files in S3, configure a CloudFront distribution pointing to the S3 bucket, and optionally connect a custom domain via Route 53. This delivers your site globally with millisecond latency while keeping origin costs low.

For **dynamic web applications**, CloudFront can cache what it can (static assets, some API responses) and forward the rest to an origin like an Application Load Balancer or API Gateway. Using CloudFront in front of API Gateway reduces latency for API consumers worldwide.

**Lambda@Edge** allows you to run Lambda functions at CloudFront edge locations, enabling you to customize request and response handling without round-tripping to your origin — for use cases like A/B testing, URL rewriting, header manipulation, and authentication enforcement at the edge.

For the Cloud Practitioner exam, the key understanding is that CloudFront reduces latency by caching content near users, and it integrates with AWS security services like WAF and Shield.`,
    },
  ],

  keyFacts: [
    "CloudFront is AWS's global CDN, serving content from 400+ edge locations worldwide",
    "Reduces latency by caching content at edge locations close to users",
    "Origin can be S3, EC2, ALB, API Gateway, or any HTTP server",
    "Origin Access Control (OAC) keeps S3 buckets private — only CloudFront can access them",
    "Cache TTL controls how long content stays at the edge before refreshing from origin",
    "Integrates with AWS WAF for application-layer protection (SQLi, XSS, rate limiting)",
    "AWS Shield Standard is included for free, protecting against DDoS attacks",
    "Geo-restriction can allow or deny content by viewer country",
    "Signed URLs and Signed Cookies restrict access to private content",
    "HTTPS with custom SSL certificates via AWS Certificate Manager (ACM)",
  ],

  relatedServices: [
    "Amazon S3",
    "AWS WAF",
    "Amazon Route 53",
    "AWS Certificate Manager",
    "AWS Shield",
    "Amazon API Gateway",
  ],

  examTips: [
    "CloudFront caches content at edge locations — reduces latency AND origin load",
    "Use OAC to keep S3 bucket private and only allow CloudFront access",
    "Cache invalidation removes content from edge before TTL expires (costs money)",
    "Versioning file names (app.v2.js) is often better than invalidation",
    "WAF on CloudFront protects against web exploits and enables rate limiting",
    "Shield Standard is free and auto-enabled; Shield Advanced adds DDoS response team",
    "Geo-restriction is for content licensing compliance — block or allow by country",
    "CloudFront + S3 is the standard architecture for serving static websites globally",
  ],
};
