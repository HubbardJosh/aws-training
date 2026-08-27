import { ServiceGuide } from "../../../types/guide";

export const wafGuide: ServiceGuide = {
  id: "saa-waf",
  service: "AWS WAF",
  domain: "security",
  tagline:
    "Web application firewall protecting against common exploits and bots at the edge",
  intro:
    "AWS WAF (Web Application Firewall) filters and monitors HTTP/HTTPS traffic to your web applications at Layer 7, protecting against common web exploits like SQL injection, cross-site scripting, and malicious bots without modifying application code or impacting performance.",

  sections: [
    {
      heading: "WAF Fundamentals: Web ACLs, Rules, and Rule Groups",
      body: `AWS WAF is organized around Web Access Control Lists (Web ACLs) — ordered collections of rules that inspect HTTP requests and determine whether to allow or block them. Each Web ACL is associated with one or more AWS resources: Amazon CloudFront distributions, Application Load Balancers, Amazon API Gateway REST APIs, AWS AppSync GraphQL APIs, or Amazon Cognito user pool endpoints. Rules within a Web ACL evaluate specific conditions (IP addresses, geographic origin, HTTP headers, URI strings, query string parameters, body content) and assign a numeric score or take a terminal action (Allow, Block, Count, CAPTCHA, Challenge). Rules are evaluated in priority order (lowest number first), and the first matching terminal action applies. Managed Rule Groups are pre-configured collections of rules maintained by AWS or AWS Marketplace sellers that protect against known threat categories — AWS Core Rule Set (CRS) protects against OWASP Top 10 vulnerabilities, while Bot Control and Fraud Control address automated threats.`,
      quiz: [
        {
          question:
            "AWS WAF Web ACLs can be associated with which AWS resources?",
          options: [
            "EC2 instances and RDS databases only",
            "CloudFront distributions, ALBs, API Gateway REST APIs, AppSync, and Cognito user pools",
            "Any AWS resource that processes HTTP traffic",
            "Only CloudFront distributions and Application Load Balancers",
          ],
          correctIndex: 1,
          explanation:
            "AWS WAF Web ACLs can be associated with CloudFront distributions, Application Load Balancers, API Gateway REST APIs, AWS AppSync GraphQL APIs, and Amazon Cognito user pool endpoints. WAF cannot be applied directly to EC2 instances, RDS, or other compute/database resources — it only integrates with these specific Layer 7 entry points.",
        },
        {
          question:
            "In which order does AWS WAF evaluate rules within a Web ACL?",
          options: [
            "Alphabetically by rule name",
            "Deny rules first, then Allow rules",
            "In priority order — lowest number first; first matching terminal action applies",
            "Most recently added rules first",
          ],
          correctIndex: 2,
          explanation:
            "WAF evaluates rules in ascending priority order (lowest number first). When a rule matches and has a terminal action (Allow, Block, CAPTCHA, Challenge), that action is applied and evaluation stops. Count rules are non-terminal — they log the match and continue evaluation. Rule priority order is critical for correct WAF behavior.",
        },
        {
          question:
            "Which AWS Managed Rule Group protects against the OWASP Top 10 web application vulnerabilities?",
          options: [
            "AWS Bot Control Rule Group",
            "AWS Core Rule Set (CRS)",
            "AWS Known Bad Inputs Rule Group",
            "AWS IP Reputation List",
          ],
          correctIndex: 1,
          explanation:
            "The AWS Core Rule Set (CRS) managed rule group protects against OWASP Top 10 vulnerabilities including SQL injection, cross-site scripting (XSS), command injection, and path traversal. It is the baseline protection rule group maintained by AWS security engineers and updated automatically as new threats emerge.",
        },
      ],
    },
    {
      heading: "Rule Types: Managed Rules, Custom Rules, and Rate-Based Rules",
      body: `WAF provides three categories of rules. AWS Managed Rules are maintained by AWS security engineers and updated automatically to reflect new threat patterns — they require no configuration beyond enabling them and are the fastest path to baseline protection. AWS Marketplace Managed Rules from vendors like Fortinet, F5, and Imperva provide specialized protection for specific applications (WordPress, PHP, databases) or threat categories (DDoS, bots, scanners). Custom rules allow you to write precise matching conditions using the WAF rule statement language — combining IP set match, geographic match, byte match (exact string, regex, starts with), size constraint, and SQL injection and XSS detection statements with AND/OR/NOT logic. Rate-based rules limit the number of requests from a single IP address (or other aggregation key like HTTP header or query parameter) within a five-minute sliding window, automatically blocking sources that exceed the threshold — the primary mechanism for defending against HTTP flood DDoS attacks and credential stuffing.`,
      quiz: [
        {
          question:
            "A web application is experiencing an HTTP flood attack from many IP addresses each sending thousands of requests per minute. Which WAF rule type automatically blocks IP addresses exceeding a request threshold?",
          options: [
            "AWS Managed Rule Group (Core Rule Set)",
            "Geographic match custom rule",
            "Rate-based rule with a per-IP threshold",
            "IP set match rule with a blocklist",
          ],
          correctIndex: 2,
          explanation:
            "Rate-based rules automatically block IP addresses (or other aggregation keys) that exceed a configured request threshold within a five-minute sliding window. They are the primary WAF defense against HTTP flood DDoS attacks and credential stuffing because they automatically detect and block high-rate sources without requiring manual IP blocklist maintenance.",
        },
        {
          question:
            "A team wants the fastest way to add baseline OWASP Top 10 protection to their ALB without writing any custom rules. What should they use?",
          options: [
            "Custom WAF rules using SQL injection and XSS detection statements",
            "AWS Managed Rules — specifically the AWS Core Rule Set (CRS)",
            "A rate-based rule limiting requests per IP",
            "AWS Shield Standard applied to the ALB",
          ],
          correctIndex: 1,
          explanation:
            "AWS Managed Rules (specifically the Core Rule Set) provide pre-configured, automatically maintained protection against OWASP Top 10 vulnerabilities. They require no custom rule writing — simply enable the managed rule group in the Web ACL. They are the fastest path to baseline protection and are updated by AWS as new threats emerge.",
        },
      ],
    },
    {
      heading: "Bot Control and Fraud Prevention",
      body: `AWS WAF Bot Control is a managed rule group that classifies and controls bot traffic. It identifies common bots (search engine crawlers, monitoring agents, scrapers) using behavioral analysis and browser fingerprinting, allowing you to allow benign bots, challenge suspicious bots with CAPTCHA or silent browser challenges, and block malicious bots — all without writing custom rules. Bot Control operates in two modes: Common mode inspects bots at the request level using basic detection, while Targeted mode uses advanced machine learning to detect sophisticated bots that rotate IPs and mimic human behavior. AWS WAF Fraud Control — Account Takeover Prevention (ATP) — detects credential stuffing attacks against login pages by analyzing login request patterns, response codes, and username/password usage, automatically blocking or challenging high-risk login attempts. Account Creation Fraud Prevention (ACFP) detects fake account creation at registration pages, protecting against promotion abuse and account fraud.`,
      quiz: [
        {
          question:
            "A website is experiencing credential stuffing attacks against its login page, where attackers try thousands of username/password combinations. Which WAF feature detects and blocks this?",
          options: [
            "AWS WAF Bot Control in Common mode",
            "AWS WAF Fraud Control — Account Takeover Prevention (ATP)",
            "A rate-based rule on the login endpoint",
            "AWS Core Rule Set SQL injection detection",
          ],
          correctIndex: 1,
          explanation:
            "Account Takeover Prevention (ATP) is specifically designed to detect credential stuffing attacks on login pages. It analyzes login request patterns, response codes (e.g., many 401s indicating failed logins), and username/password pair usage to identify high-risk login attempts and automatically block or challenge them. A rate-based rule could limit request volume but cannot distinguish credential stuffing patterns the way ATP can.",
        },
        {
          question:
            "Which WAF Bot Control mode uses machine learning to detect sophisticated bots that rotate IP addresses and mimic human browsing behavior?",
          options: [
            "Common mode",
            "Targeted mode",
            "Advanced mode",
            "Enterprise mode",
          ],
          correctIndex: 1,
          explanation:
            "Bot Control Targeted mode uses advanced machine learning and browser fingerprinting to detect sophisticated bots that evade basic detection by rotating IPs, using residential proxies, and mimicking human behavior patterns. Common mode uses basic signature-based detection suitable for identifying well-known bots. Targeted mode is the appropriate choice when bots are specifically designed to evade detection.",
        },
      ],
    },
    {
      heading: "WAF Logging, Metrics, and Monitoring",
      body: `WAF generates detailed logs for every evaluated request, including the Web ACL name, the action taken, the rule that matched, the request's IP, country, URI, headers, and body (sampled). Logs can be delivered to Amazon CloudWatch Logs (for real-time alerting and Logs Insights queries), Amazon S3 (for long-term retention and Athena analysis), or Amazon Kinesis Data Firehose (for streaming to third-party SIEM systems). WAF also publishes CloudWatch metrics for each rule and Web ACL — AllowedRequests, BlockedRequests, CountedRequests, and PassedRequests — enabling dashboards and alarms for traffic patterns and attack rates. The WAF console provides sampled requests (up to 100 requests per rule per time window) for inspection without enabling full logging, useful for troubleshooting rule behavior. AWS Firewall Manager centrally manages WAF Web ACLs across multiple AWS accounts in an Organization, ensuring consistent security policies are applied to all resources without manual per-account configuration.`,
      quiz: [
        {
          question:
            "A security team wants to stream WAF logs to a third-party SIEM system in near-real time. Which log delivery destination enables this?",
          options: [
            "Amazon CloudWatch Logs",
            "Amazon S3 with event notifications",
            "Amazon Kinesis Data Firehose",
            "AWS CloudTrail",
          ],
          correctIndex: 2,
          explanation:
            "Amazon Kinesis Data Firehose can stream WAF logs to third-party SIEM systems, Splunk, and other HTTP endpoints in near-real time. CloudWatch Logs is better for real-time alerting within AWS; S3 is better for long-term retention and batch analysis with Athena. Firehose is the right choice for streaming to external security analytics systems.",
        },
        {
          question:
            "Which WAF action allows a rule to log matching requests without blocking them, useful for testing new rules before enforcement?",
          options: [
            "Allow action with logging enabled",
            "Block action with a 200 response override",
            "Count action",
            "CAPTCHA action",
          ],
          correctIndex: 2,
          explanation:
            "The Count action is a non-terminal WAF action that logs the fact that a rule matched but does not block or alter the request. It is used for testing new rules — you can observe which requests would match a rule (and how many) before switching to Block. Count rules allow evaluation to continue to subsequent rules in the Web ACL.",
        },
      ],
    },
    {
      heading: "WAF Integration with CloudFront and ALB",
      body: `The placement of WAF determines where in the request path filtering occurs. WAF associated with CloudFront filters requests at edge locations before they reach your origin, providing the earliest possible interception of malicious traffic — reducing origin load and protecting against attacks even when the origin is temporarily unavailable. WAF associated with an Application Load Balancer filters requests after they reach your VPC region but before they reach EC2 instances or ECS containers, appropriate when CloudFront is not in the architecture or when regional WAF policies are needed. A defense-in-depth architecture places WAF at both CloudFront (for edge protection and geographic blocking) and the ALB (for protection against requests that bypass CloudFront), though the ALB WAF typically has less aggressive rules since edge WAF handles the bulk of malicious traffic. AWS Shield Advanced, when combined with WAF, provides DDoS protection with 24/7 DDoS response team access and cost protection against scaling charges caused by DDoS attacks.`,
      quiz: [
        {
          question:
            "Where should WAF be placed to filter malicious traffic at the earliest possible point in the request path, before it reaches the origin?",
          options: [
            "On the Application Load Balancer in the origin region",
            "On the Amazon CloudFront distribution at edge locations",
            "On API Gateway in the origin region",
            "On the EC2 instances using a WAF agent",
          ],
          correctIndex: 1,
          explanation:
            "WAF associated with a CloudFront distribution filters requests at the nearest edge location before they traverse the internet to reach the origin. This provides the earliest interception of malicious traffic, reduces origin load, lowers data transfer costs, and protects the origin even if it becomes temporarily unavailable. ALB-attached WAF only filters after traffic has already reached the AWS region.",
        },
        {
          question:
            "Which AWS service, when combined with WAF, provides DDoS cost protection (credits for scaling charges during attacks) and access to a 24/7 DDoS response team?",
          options: [
            "AWS Shield Standard",
            "AWS Shield Advanced",
            "AWS Firewall Manager",
            "Amazon GuardDuty",
          ],
          correctIndex: 1,
          explanation:
            "AWS Shield Advanced provides enhanced DDoS protection including: volumetric DDoS attack mitigation, cost protection (AWS credits for scaling charges incurred due to DDoS attacks), real-time attack visibility, and access to the AWS Shield Response Team (SRT) for 24/7 assisted mitigation during active attacks. Shield Standard is free and automatic but provides only basic L3/L4 protection without these advanced features.",
        },
      ],
    },
    {
      heading: "AWS Firewall Manager and Shield Integration",
      body: `AWS Firewall Manager provides centralized management of WAF rules, AWS Shield Advanced protections, Security Groups, Network Firewall policies, and Route 53 Resolver DNS Firewall rules across all accounts in an AWS Organization. A Firewall Manager policy for WAF specifies which Web ACL configuration (including managed rules) to enforce across all CloudFront distributions or ALBs in the organization — new resources that match the policy scope are automatically protected without manual action. AWS Shield Standard is free, always-on protection against common network and transport layer DDoS attacks (SYN floods, UDP reflection attacks) that applies to all AWS customers automatically. AWS Shield Advanced provides enhanced protection against sophisticated, volumetric DDoS attacks on EC2, ELB, CloudFront, Global Accelerator, and Route 53, with attack visibility, DDoS cost protection (credits for scaling charges during attacks), and access to the AWS Shield Response Team (SRT) for assisted attack mitigation during active events.`,
      quiz: [
        {
          question:
            "A company with 100 AWS accounts in an Organization wants to ensure all ALBs automatically get the same WAF Core Rule Set protection without manual per-account configuration. Which service enables this?",
          options: [
            "AWS Config with a WAF compliance rule",
            "AWS Firewall Manager with a WAF policy scoped to all ALBs",
            "AWS Organizations SCP restricting ALB creation without WAF",
            "AWS Security Hub with automated WAF remediation",
          ],
          correctIndex: 1,
          explanation:
            "AWS Firewall Manager allows you to define a WAF policy that specifies which Web ACL configuration to enforce across all accounts in an Organization. New ALBs that match the policy scope are automatically protected without manual action in each account. This is the correct solution for ensuring consistent WAF coverage across a large multi-account organization.",
        },
        {
          question:
            "Which AWS service provides free, always-on protection against common L3/L4 DDoS attacks for all AWS customers automatically?",
          options: [
            "AWS WAF with rate-based rules",
            "AWS Shield Advanced",
            "AWS Shield Standard",
            "Amazon GuardDuty network threat detection",
          ],
          correctIndex: 2,
          explanation:
            "AWS Shield Standard is automatically enabled for all AWS customers at no charge. It provides always-on protection against common infrastructure-layer DDoS attacks such as SYN floods and UDP reflection attacks at Layers 3 and 4. Shield Advanced adds enhanced volumetric DDoS protection, cost protection, attack visibility, and SRT access for an additional subscription cost.",
        },
      ],
    },
  ],

  keyFacts: [
    "WAF Web ACLs associate with CloudFront, ALB, API Gateway, AppSync, or Cognito user pools",
    "Rules are evaluated in priority order (lowest number first); first terminal action wins",
    "AWS Managed Rules protect against OWASP Top 10, known bad IPs, and common vulnerabilities",
    "Rate-based rules block IPs exceeding a request threshold in a 5-minute window",
    "Bot Control classifies and controls automated traffic; ATP detects credential stuffing",
    "WAF logs can be delivered to CloudWatch Logs, S3, or Kinesis Data Firehose",
    "WAF on CloudFront filters at the edge; WAF on ALB filters at the region level",
    "AWS Firewall Manager centrally enforces WAF policies across all accounts in an Organization",
    "Shield Standard: free, automatic L3/L4 DDoS protection for all AWS customers",
    "Shield Advanced: volumetric DDoS protection + SRT access + cost protection for scaling charges",
  ],

  relatedServices: [
    "Amazon CloudFront",
    "Elastic Load Balancing",
    "Amazon API Gateway",
    "AWS Firewall Manager",
    "AWS Shield",
    "Amazon CloudWatch",
  ],

  examTips: [
    "WAF operates at Layer 7 (HTTP/HTTPS); Network ACLs and Security Groups operate at Layer 3/4",
    "Rate-based rules are the primary WAF defense against HTTP flood DDoS and credential stuffing",
    "WAF on CloudFront = edge protection globally; WAF on ALB = regional protection",
    "AWS Managed Rules (CRS) protect against OWASP Top 10 with no custom rule writing required",
    "Firewall Manager is the answer for applying WAF policies consistently across all org accounts",
    "Shield Advanced provides DDoS cost protection — exam may ask about protecting against DDoS billing spikes",
    "Count action lets you observe traffic matching a rule without blocking — use for testing new rules",
    "Bot Control Common mode: basic; Targeted mode: ML-based for sophisticated bot detection",
  ],

  topicQuiz: [
    {
      question:
        "At which OSI layer does AWS WAF operate, and what type of traffic does it filter?",
      options: [
        "Layer 3/4 — IP and TCP/UDP traffic",
        "Layer 7 — HTTP/HTTPS request content",
        "Layer 2 — Ethernet frames",
        "All layers — full deep packet inspection",
      ],
      correctIndex: 1,
      explanation:
        "AWS WAF operates at Layer 7 (the application layer), inspecting HTTP and HTTPS request content including headers, URI paths, query strings, and request bodies. Network ACLs and Security Groups operate at Layers 3/4. WAF's Layer 7 visibility enables protection against application-specific attacks like SQL injection and XSS that are invisible to network-layer controls.",
    },
    {
      question:
        "A WAF Web ACL has Rule 10 (Count), Rule 20 (Block for SQL injection), and Rule 30 (Allow). An incoming request matches Rule 20. What happens?",
      options: [
        "The request is Counted by Rule 10, then Blocked by Rule 20",
        "The request is Blocked by Rule 20 — the first terminal action wins",
        "The request is Allowed by Rule 30 — Allow rules always take precedence",
        "All three rules are evaluated and the most restrictive action applies",
      ],
      correctIndex: 0,
      explanation:
        "Rules are evaluated in priority order (lowest number first). Rule 10 (Count) is non-terminal — it logs the request and continues evaluation. Rule 20 (Block) matches and is terminal — the Block action applies and evaluation stops. Rule 30 is never reached. Count rules are the exception to the 'first match stops evaluation' behavior because they are non-terminal.",
    },
    {
      question:
        "Which WAF rule type is the primary defense against HTTP flood DDoS attacks by automatically blocking high-rate IP addresses?",
      options: [
        "AWS Managed Rule Group (Core Rule Set)",
        "Geographic match custom rule",
        "Rate-based rule with a per-IP threshold",
        "IP set match rule with a static blocklist",
      ],
      correctIndex: 2,
      explanation:
        "Rate-based rules automatically block IP addresses (or other aggregation keys) that exceed a configured request count within a five-minute sliding window. They dynamically identify and block high-volume attack sources without requiring manual IP blocklist maintenance, making them the primary WAF mechanism for HTTP flood DDoS defense.",
    },
    {
      question:
        "Where should a WAF Web ACL be associated to filter attacks at the earliest possible point before requests reach the origin?",
      options: [
        "Application Load Balancer in the origin region",
        "Amazon CloudFront distribution at edge locations",
        "API Gateway in the origin region",
        "EC2 instances using a host-based WAF agent",
      ],
      correctIndex: 1,
      explanation:
        "Associating WAF with CloudFront filters requests at the nearest edge location — before traffic crosses the internet to reach the origin. This provides the earliest interception, reduces origin load, and protects the origin even during outages. ALB-attached WAF only filters after traffic has already reached the AWS region, meaning attack traffic has already consumed network capacity.",
    },
    {
      question:
        "A company wants to ensure all 200 ALBs across 50 AWS accounts automatically receive the same WAF Core Rule Set policy. Which service provides centralized enforcement?",
      options: [
        "AWS Config with WAF compliance rules and auto-remediation",
        "AWS Firewall Manager with a WAF policy scoped to the Organization",
        "AWS Security Hub with automated WAF findings",
        "AWS CloudFormation StackSets deploying WAF Web ACLs to each account",
      ],
      correctIndex: 1,
      explanation:
        "AWS Firewall Manager enforces WAF Web ACL configurations across all accounts in an AWS Organization. New ALBs that match the policy scope are automatically protected without manual per-account action. CloudFormation StackSets require manual triggers for new resources; Firewall Manager provides continuous, automatic enforcement.",
    },
    {
      question:
        "Which WAF Bot Control mode uses machine learning to detect sophisticated bots that rotate IPs and mimic human behavior?",
      options: [
        "Common mode with signature-based detection",
        "Targeted mode with advanced ML-based detection",
        "Standard mode with behavioral analysis",
        "Enterprise mode with full browser emulation",
      ],
      correctIndex: 1,
      explanation:
        "Bot Control Targeted mode uses advanced machine learning and browser fingerprinting to identify sophisticated bots that evade basic detection techniques such as rotating IP addresses, using residential proxies, and mimicking human browsing patterns. Common mode uses simpler signature-based detection appropriate for known bots that do not attempt to evade detection.",
    },
    {
      question:
        "Which AWS service provides free, automatic L3/L4 DDoS protection for all AWS customers without any configuration?",
      options: [
        "AWS WAF with default rate-based rules",
        "AWS Shield Advanced",
        "AWS Shield Standard",
        "Amazon GuardDuty",
      ],
      correctIndex: 2,
      explanation:
        "AWS Shield Standard is automatically enabled for all AWS customers at no charge. It provides always-on protection against common network and transport-layer DDoS attacks (SYN floods, UDP reflection) at Layers 3 and 4. Shield Advanced adds volumetric attack protection, cost protection, and SRT access at an additional subscription cost.",
    },
    {
      question:
        "Which WAF action should be used when testing a new rule to observe which requests would match without blocking any traffic?",
      options: [
        "Allow action with audit logging enabled",
        "Block action with a 200 status override",
        "Count action",
        "CAPTCHA action in test mode",
      ],
      correctIndex: 2,
      explanation:
        "The Count action is non-terminal — it logs that a rule matched and increments the CloudWatch CountedRequests metric, but does not block the request or stop rule evaluation. Using Count lets you validate how many real requests would be affected by a rule before switching to Block, eliminating the risk of accidentally blocking legitimate traffic during rule testing.",
    },
  ],
};
