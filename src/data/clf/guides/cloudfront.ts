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
      quiz: [
        {
          question:
            "What is the primary purpose of CloudFront's edge locations?",
          options: [
            "To host EC2 instances closer to users",
            "To cache content near users, reducing latency and origin load",
            "To provide additional storage capacity for S3 buckets",
            "To run Lambda functions with lower cold start times",
          ],
          correctIndex: 1,
          explanation:
            "Edge locations cache content near users so subsequent requests are served locally rather than traveling back to the origin server. This dramatically reduces latency and reduces the load on your origin.",
        },
        {
          question:
            "When a user requests content that is already cached at the nearest CloudFront edge location, this is called a:",
          options: [
            "Cache miss",
            "Origin fetch",
            "Cache hit",
            "Distribution hit",
          ],
          correctIndex: 2,
          explanation:
            "A cache hit occurs when requested content is already present at the edge location and can be served directly, without going back to the origin server. Cache hits result in dramatically lower latency for users.",
        },
        {
          question: "Which of the following can serve as a CloudFront origin?",
          options: [
            "Only Amazon S3 buckets",
            "Only EC2 instances",
            "S3, EC2, Application Load Balancers, or any HTTP server",
            "Only AWS-managed services, not on-premises servers",
          ],
          correctIndex: 2,
          explanation:
            "CloudFront supports multiple origin types: Amazon S3 buckets, EC2 instances, Application Load Balancers, and any custom HTTP/HTTPS server including on-premises servers.",
        },
      ],
    },
    {
      heading: "Caching and Cache Behavior",
      body: `Caching is the core value proposition of CloudFront. By keeping frequently requested content at the edge, CloudFront reduces the load on your origin and delivers content faster to users worldwide.

**Cache behaviors** define how CloudFront handles requests matching specific URL patterns. For example, you might configure CloudFront to cache image files for 7 days, cache HTML files for 10 minutes, and never cache API requests. Each behavior specifies:
- The **path pattern** (e.g., \`/images/*\`)
- The **TTL** (Time To Live) — how long objects stay in the edge cache before being refreshed from the origin
- Whether to **forward query strings, headers, or cookies** to the origin (forwarding more parameters reduces cache efficiency)

**Cache invalidation** lets you remove objects from the edge cache before their TTL expires. This is useful after deploying new content — you can invalidate specific paths like \`/index.html\` or all paths with \`/*\`. Invalidations cost money per path beyond a free monthly limit, so versioning file names (e.g., \`app.v2.js\`) is often a better approach.`,
      quiz: [
        {
          question: "What does TTL (Time To Live) control in CloudFront?",
          options: [
            "How long a CloudFront distribution stays active before expiring",
            "How long objects remain in the edge cache before being refreshed from the origin",
            "How long it takes for a cache invalidation to propagate globally",
            "The maximum age of SSL certificates attached to a distribution",
          ],
          correctIndex: 1,
          explanation:
            "TTL (Time To Live) controls how long objects stay in the CloudFront edge cache before CloudFront fetches a fresh copy from the origin. Different cache behaviors can have different TTL values for different URL patterns.",
        },
        {
          question:
            "Why is versioning file names (e.g., app.v2.js) often preferred over cache invalidation when deploying new content?",
          options: [
            "Versioned files bypass CloudFront and are served directly from S3",
            "Cache invalidation is not supported for JavaScript files",
            "Invalidations cost money per path beyond a free monthly limit; versioned names avoid this cost",
            "Versioned files have a longer TTL by default than invalidated files",
          ],
          correctIndex: 2,
          explanation:
            "Cache invalidations cost money per path beyond a free monthly limit. By versioning file names (app.v1.js → app.v2.js), the new file is simply fetched fresh from the origin as a new cache key, avoiding invalidation costs entirely.",
        },
        {
          question: "How do cache behaviors in a CloudFront distribution work?",
          options: [
            "A single behavior applies to all content in the distribution",
            "Different behaviors can apply different caching rules to different URL patterns",
            "Cache behaviors are set at the origin level, not the distribution level",
            "Behaviors only control whether content is cached, not how long",
          ],
          correctIndex: 1,
          explanation:
            "Cache behaviors match specific URL patterns (like /images/* or /api/*) and allow different caching rules — TTL, header forwarding, query string handling — to apply to different types of content within the same distribution.",
        },
      ],
    },
    {
      heading: "Origins and Custom Origins",
      body: `A **CloudFront origin** is the source of truth for your content. CloudFront supports multiple types of origins:

**Amazon S3 origins** are the most common for static content. CloudFront fetches files from an S3 bucket and caches them at the edge. Using an **Origin Access Control (OAC)**, you can keep the S3 bucket private and allow only CloudFront to read from it, preventing direct S3 access that bypasses your CDN.

**Custom origins** are any HTTP server: an EC2 instance, an Elastic Load Balancer, your on-premises server, or a third-party web host. CloudFront forwards requests to the custom origin using HTTP or HTTPS.

**Origin Groups** enable **origin failover**: you configure a primary origin and a secondary origin. If CloudFront receives a 5xx error from the primary, it automatically retries the request against the secondary. This improves availability for dynamic content.

You can also configure **multiple behaviors** in a single distribution, routing different URL patterns to different origins — for example, routing \`/api/*\` to an Application Load Balancer and \`/*\` to S3.`,
      quiz: [
        {
          question:
            "What is the purpose of Origin Access Control (OAC) when using an S3 origin with CloudFront?",
          options: [
            "It allows users to access S3 content directly without going through CloudFront",
            "It keeps the S3 bucket private so only CloudFront can read from it",
            "It encrypts data as it travels from S3 to CloudFront edge locations",
            "It enables cross-region replication of S3 content to edge locations",
          ],
          correctIndex: 1,
          explanation:
            "Origin Access Control (OAC) keeps the S3 bucket private and grants only CloudFront permission to read from it. This prevents users from bypassing CloudFront and accessing S3 directly, ensuring all traffic goes through your CDN.",
        },
        {
          question:
            "CloudFront Origin Groups are used to accomplish which of the following?",
          options: [
            "Group multiple distributions under a single domain name",
            "Aggregate content from multiple S3 buckets into one cache",
            "Configure a primary and secondary origin for automatic failover on 5xx errors",
            "Route traffic based on geographic location of the viewer",
          ],
          correctIndex: 2,
          explanation:
            "Origin Groups enable origin failover. You configure a primary and secondary origin; if CloudFront receives a 5xx error from the primary, it automatically retries the request against the secondary origin, improving availability.",
        },
      ],
    },
    {
      heading: "Security Features",
      body: `CloudFront provides several security features that make it suitable for production workloads beyond simple content caching.

**HTTPS** is fully supported. CloudFront can use a **custom SSL certificate** stored in AWS Certificate Manager (ACM) to serve your content over \`https://yoursite.com\`. CloudFront supports modern TLS protocols and can enforce HTTPS-only access, automatically redirecting HTTP requests.

**AWS WAF (Web Application Firewall)** integrates directly with CloudFront distributions. WAF lets you define rules to block common web exploits like SQL injection and cross-site scripting (XSS), filter traffic by IP reputation or geographic location, and set rate limits to mitigate DDoS attacks.

**AWS Shield** is enabled automatically at no cost for all CloudFront distributions, protecting against common DDoS attacks. **AWS Shield Advanced** provides enhanced protection and access to the AWS DDoS Response Team.

**Geo-restriction** (geographic blocking) lets you allow or deny access to your content based on the viewer's country, which can be required for content licensing compliance or export control regulations.

**Signed URLs and Signed Cookies** restrict access to private content. You generate a signed URL with an expiration time and optionally an IP restriction, ensuring only authorized users can access specific files.`,
      quiz: [
        {
          question:
            "Which AWS service integrates with CloudFront to protect against SQL injection, XSS, and DDoS attacks at the application layer?",
          options: [
            "AWS Shield Advanced",
            "AWS WAF (Web Application Firewall)",
            "AWS GuardDuty",
            "Amazon Inspector",
          ],
          correctIndex: 1,
          explanation:
            "AWS WAF integrates directly with CloudFront distributions and lets you define rules to block web exploits like SQL injection and cross-site scripting (XSS), filter by IP reputation, and set rate limits to mitigate DDoS attacks.",
        },
        {
          question:
            "A media company needs to restrict access to their video content based on the viewer's country due to licensing agreements. Which CloudFront feature should they use?",
          options: [
            "Signed URLs",
            "Origin Access Control",
            "Geo-restriction",
            "Cache behaviors",
          ],
          correctIndex: 2,
          explanation:
            "Geo-restriction (geographic blocking) lets you allow or deny access to CloudFront content based on the viewer's country. This is commonly required for content licensing compliance where distribution rights are limited to specific countries.",
        },
        {
          question:
            "AWS Shield Standard is included with CloudFront at what cost?",
          options: [
            "$0.008 per GB of data transferred",
            "A flat $3,000 per month",
            "No cost — it is automatically enabled for all CloudFront distributions",
            "It is only available with AWS Shield Advanced",
          ],
          correctIndex: 2,
          explanation:
            "AWS Shield Standard is automatically enabled at no cost for all CloudFront distributions. It protects against common DDoS attacks. AWS Shield Advanced provides enhanced protection for an additional cost.",
        },
      ],
    },
    {
      heading: "Common Architectures",
      body: `CloudFront is frequently combined with other AWS services to build scalable, performant architectures.

The most common pattern is **CloudFront + S3 for static websites**. You store your HTML, CSS, JavaScript, and image files in S3, configure a CloudFront distribution pointing to the S3 bucket, and optionally connect a custom domain via Route 53. This delivers your site globally with millisecond latency while keeping origin costs low.

For **dynamic web applications**, CloudFront can cache what it can (static assets, some API responses) and forward the rest to an origin like an Application Load Balancer or API Gateway. Using CloudFront in front of API Gateway reduces latency for API consumers worldwide.

**Lambda@Edge** allows you to run Lambda functions at CloudFront edge locations, enabling you to customize request and response handling without round-tripping to your origin — for use cases like A/B testing, URL rewriting, header manipulation, and authentication enforcement at the edge.

For the Cloud Practitioner exam, the key understanding is that CloudFront reduces latency by caching content near users, and it integrates with AWS security services like WAF and Shield.`,
      quiz: [
        {
          question:
            "What is the standard AWS architecture for serving a static website globally with low latency?",
          options: [
            "EC2 instances deployed in every region with Route 53 latency routing",
            "CloudFront distribution in front of an S3 bucket, with Route 53 for custom domain",
            "Elastic Load Balancer distributing traffic across S3 buckets in multiple regions",
            "API Gateway serving static files from Lambda functions at the edge",
          ],
          correctIndex: 1,
          explanation:
            "The standard pattern for globally serving a static website is: store files in S3, put a CloudFront distribution in front, and use Route 53 for a custom domain. CloudFront caches the content at edge locations worldwide for low latency.",
        },
        {
          question:
            "Lambda@Edge enables which capability in CloudFront architectures?",
          options: [
            "Running Lambda functions in your VPC without internet access",
            "Automatically scaling Lambda functions based on CloudFront request volume",
            "Running Lambda functions at CloudFront edge locations to customize request/response handling",
            "Deploying Lambda function code directly from CloudFront distributions",
          ],
          correctIndex: 2,
          explanation:
            "Lambda@Edge allows you to run Lambda functions at CloudFront edge locations. This enables use cases like A/B testing, URL rewriting, header manipulation, and authentication enforcement at the edge without a round-trip to the origin.",
        },
        {
          question: "CloudFront reduces latency for users primarily by:",
          options: [
            "Compressing content at the origin before sending it to users",
            "Caching content at edge locations near users so requests don't travel to the origin",
            "Upgrading TCP connections to HTTP/3 automatically",
            "Routing traffic through AWS backbone network instead of the public internet",
          ],
          correctIndex: 1,
          explanation:
            "CloudFront's primary mechanism for reducing latency is caching content at edge locations near users. When content is cached, user requests are served locally from the edge rather than traveling all the way back to the origin server.",
        },
      ],
    },
  ],

  keyFacts: [
    "CloudFront is AWS's global CDN, serving content from 600+ Points of Presence (edge locations) worldwide",
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

  topicQuiz: [
    {
      question:
        "What is the primary benefit of using Amazon CloudFront in front of an S3 bucket hosting a static website?",
      options: [
        "It adds automatic versioning to S3 objects",
        "It caches content at edge locations globally, reducing latency for users worldwide",
        "It encrypts S3 data at rest using CloudFront-managed keys",
        "It automatically scales S3 storage capacity based on traffic",
      ],
      correctIndex: 1,
      explanation:
        "CloudFront caches content at edge locations near users worldwide. Instead of every request going back to S3 in a single region, content is served locally from the nearest edge location, dramatically reducing latency.",
    },
    {
      question:
        "A company wants to keep their S3 bucket completely private but still serve its content through CloudFront. What should they configure?",
      options: [
        "Make the S3 bucket public and restrict access via WAF rules",
        "Use Origin Access Control (OAC) to allow only CloudFront to access the bucket",
        "Enable Cross-Origin Resource Sharing (CORS) on the S3 bucket",
        "Create a signed URL for every object in the bucket",
      ],
      correctIndex: 1,
      explanation:
        "Origin Access Control (OAC) keeps the S3 bucket private and grants only CloudFront permission to read from it. This prevents users from bypassing CloudFront and accessing S3 directly.",
    },
    {
      question:
        "Which CloudFront feature allows you to preview and expire cached content before its TTL expires?",
      options: [
        "Cache behaviors",
        "Cache invalidation",
        "Origin Groups",
        "Geo-restriction",
      ],
      correctIndex: 1,
      explanation:
        "Cache invalidation lets you remove specific objects from the edge cache before their TTL expires. This is useful when deploying new content and you need the edge to serve the updated version immediately.",
    },
    {
      question:
        "Which security feature should you use to allow only paying subscribers to access private video files distributed through CloudFront?",
      options: [
        "Geo-restriction",
        "AWS WAF rate limiting",
        "Signed URLs or Signed Cookies",
        "Origin Access Control",
      ],
      correctIndex: 2,
      explanation:
        "Signed URLs and Signed Cookies restrict access to private content by generating time-limited, optionally IP-restricted access tokens. Only users with a valid signed URL or cookie can access the protected content.",
    },
    {
      question:
        "AWS Shield Standard is included with CloudFront at what cost, and what does it protect against?",
      options: [
        "Included free; protects against common DDoS attacks",
        "$3,000/month; protects against SQL injection and XSS",
        "Included free; protects against SQL injection and XSS",
        "$0.008/GB; protects against common DDoS attacks",
      ],
      correctIndex: 0,
      explanation:
        "AWS Shield Standard is automatically enabled at no cost for all CloudFront distributions. It protects against common DDoS attacks. AWS WAF (not Shield) is the service that protects against SQL injection and XSS.",
    },
    {
      question: "What does geo-restriction in CloudFront allow you to do?",
      options: [
        "Route users to the nearest AWS region based on geographic location",
        "Allow or deny access to your content based on the viewer's country",
        "Restrict which edge locations serve your distribution",
        "Limit data transfer speeds for users in specific countries",
      ],
      correctIndex: 1,
      explanation:
        "Geo-restriction lets you configure an allowlist or blocklist of countries. Viewers from blocked countries receive a 403 Forbidden response. This is commonly used for content licensing compliance and export control regulations.",
    },
    {
      question:
        "Which AWS service integrates with CloudFront to provide application-layer protection including rules against SQL injection and cross-site scripting?",
      options: [
        "AWS Shield Advanced",
        "Amazon GuardDuty",
        "AWS WAF",
        "Amazon Inspector",
      ],
      correctIndex: 2,
      explanation:
        "AWS WAF (Web Application Firewall) integrates directly with CloudFront and lets you define rules to block web exploits like SQL injection and XSS, filter by IP reputation, and set rate limits.",
    },
    {
      question:
        "Lambda@Edge in the context of CloudFront is used for which purpose?",
      options: [
        "Running Lambda functions to process S3 events before CloudFront caches them",
        "Running Lambda functions at edge locations to customize request and response handling without round-trips to the origin",
        "Automatically creating CloudFront distributions when Lambda functions are deployed",
        "Using Lambda to generate signed URLs for private CloudFront content",
      ],
      correctIndex: 1,
      explanation:
        "Lambda@Edge runs Lambda functions at CloudFront edge locations, enabling use cases like A/B testing, URL rewriting, header manipulation, and authentication enforcement at the edge without requiring a full round-trip to the origin server.",
    },
  ],
};
