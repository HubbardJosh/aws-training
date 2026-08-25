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
    },
    {
      heading: "Rule Types: Managed Rules, Custom Rules, and Rate-Based Rules",
      body: `WAF provides three categories of rules. AWS Managed Rules are maintained by AWS security engineers and updated automatically to reflect new threat patterns — they require no configuration beyond enabling them and are the fastest path to baseline protection. AWS Marketplace Managed Rules from vendors like Fortinet, F5, and Imperva provide specialized protection for specific applications (WordPress, PHP, databases) or threat categories (DDoS, bots, scanners). Custom rules allow you to write precise matching conditions using the WAF rule statement language — combining IP set match, geographic match, byte match (exact string, regex, starts with), size constraint, and SQL injection and XSS detection statements with AND/OR/NOT logic. Rate-based rules limit the number of requests from a single IP address (or other aggregation key like HTTP header or query parameter) within a five-minute sliding window, automatically blocking sources that exceed the threshold — the primary mechanism for defending against HTTP flood DDoS attacks and credential stuffing.`,
    },
    {
      heading: "Bot Control and Fraud Prevention",
      body: `AWS WAF Bot Control is a managed rule group that classifies and controls bot traffic. It identifies common bots (search engine crawlers, monitoring agents, scrapers) using behavioral analysis and browser fingerprinting, allowing you to allow benign bots, challenge suspicious bots with CAPTCHA or silent browser challenges, and block malicious bots — all without writing custom rules. Bot Control operates in two modes: Common mode inspects bots at the request level using basic detection, while Targeted mode uses advanced machine learning to detect sophisticated bots that rotate IPs and mimic human behavior. AWS WAF Fraud Control — Account Takeover Prevention (ATP) — detects credential stuffing attacks against login pages by analyzing login request patterns, response codes, and username/password usage, automatically blocking or challenging high-risk login attempts. Account Creation Fraud Prevention (ACFP) detects fake account creation at registration pages, protecting against promotion abuse and account fraud.`,
    },
    {
      heading: "WAF Logging, Metrics, and Monitoring",
      body: `WAF generates detailed logs for every evaluated request, including the Web ACL name, the action taken, the rule that matched, the request's IP, country, URI, headers, and body (sampled). Logs can be delivered to Amazon CloudWatch Logs (for real-time alerting and Logs Insights queries), Amazon S3 (for long-term retention and Athena analysis), or Amazon Kinesis Data Firehose (for streaming to third-party SIEM systems). WAF also publishes CloudWatch metrics for each rule and Web ACL — AllowedRequests, BlockedRequests, CountedRequests, and PassedRequests — enabling dashboards and alarms for traffic patterns and attack rates. The WAF console provides sampled requests (up to 100 requests per rule per time window) for inspection without enabling full logging, useful for troubleshooting rule behavior. AWS Firewall Manager centrally manages WAF Web ACLs across multiple AWS accounts in an Organization, ensuring consistent security policies are applied to all resources without manual per-account configuration.`,
    },
    {
      heading: "WAF Integration with CloudFront and ALB",
      body: `The placement of WAF determines where in the request path filtering occurs. WAF associated with CloudFront filters requests at edge locations before they reach your origin, providing the earliest possible interception of malicious traffic — reducing origin load and protecting against attacks even when the origin is temporarily unavailable. WAF associated with an Application Load Balancer filters requests after they reach your VPC region but before they reach EC2 instances or ECS containers, appropriate when CloudFront is not in the architecture or when regional WAF policies are needed. A defense-in-depth architecture places WAF at both CloudFront (for edge protection and geographic blocking) and the ALB (for protection against requests that bypass CloudFront), though the ALB WAF typically has less aggressive rules since edge WAF handles the bulk of malicious traffic. AWS Shield Advanced, when combined with WAF, provides DDoS protection with 24/7 DDoS response team access and cost protection against scaling charges caused by DDoS attacks.`,
    },
    {
      heading: "AWS Firewall Manager and Shield Integration",
      body: `AWS Firewall Manager provides centralized management of WAF rules, AWS Shield Advanced protections, Security Groups, Network Firewall policies, and Route 53 Resolver DNS Firewall rules across all accounts in an AWS Organization. A Firewall Manager policy for WAF specifies which Web ACL configuration (including managed rules) to enforce across all CloudFront distributions or ALBs in the organization — new resources that match the policy scope are automatically protected without manual action. AWS Shield Standard is free, always-on protection against common network and transport layer DDoS attacks (SYN floods, UDP reflection attacks) that applies to all AWS customers automatically. AWS Shield Advanced provides enhanced protection against sophisticated, volumetric DDoS attacks on EC2, ELB, CloudFront, Global Accelerator, and Route 53, with attack visibility, DDoS cost protection (credits for scaling charges during attacks), and access to the AWS Shield Response Team (SRT) for assisted attack mitigation during active events.`,
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
};
