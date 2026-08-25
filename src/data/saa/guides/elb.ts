import { ServiceGuide } from "../../../types/guide";

export const elbGuide: ServiceGuide = {
  id: "saa-elb",
  service: "Elastic Load Balancing",
  domain: "deployment",
  tagline:
    "Distribute traffic across targets to achieve scalability and fault tolerance",
  intro:
    "Elastic Load Balancing (ELB) automatically distributes incoming traffic across multiple targets — EC2 instances, containers, Lambda functions, or IP addresses — across multiple Availability Zones, eliminating single points of failure and enabling horizontal scaling.",

  sections: [
    {
      heading: "Application Load Balancer (ALB)",
      body: `The Application Load Balancer operates at Layer 7 (HTTP/HTTPS) and is the most feature-rich ELB type for modern web applications and microservices. ALB inspects HTTP request content to make intelligent routing decisions: path-based routing sends requests to different target groups based on the URL path (\`/api/*\` to an API target group, \`/images/*\` to a static content target group), host-based routing directs requests based on the Host header (enabling a single ALB to serve multiple domains), and query string and header-based routing enables blue/green deployments and A/B testing. ALB natively supports WebSockets and HTTP/2. It integrates with AWS WAF for Layer 7 protection, AWS Cognito for authentication offloading (adding OIDC login without changing application code), and AWS Certificate Manager (ACM) for managed TLS termination. Target groups can contain EC2 instances, ECS tasks, Lambda functions, or IP addresses, enabling mixed architectures in a single load balancer.`,
    },
    {
      heading: "Network Load Balancer (NLB)",
      body: `The Network Load Balancer operates at Layer 4 (TCP/UDP/TLS) and is engineered for extreme performance — it can handle millions of requests per second with ultra-low latency and handles sudden, volatile traffic patterns. NLB preserves the client source IP address through to the target, which is important for security groups and access logs that need the real client IP. NLB supports static IP addresses and Elastic IPs per AZ, making it suitable for whitelisting scenarios where firewall rules require known IPs. TLS termination at NLB offloads decryption from targets while preserving source IP. NLB is the right choice for non-HTTP protocols (MQTT, SMTP, custom TCP), ultra-low latency requirements, static IP requirements, and as the front end for AWS PrivateLink services. NLB target groups support EC2 instances, IP addresses, and ALB targets (the ALB-behind-NLB pattern for combining static IPs with advanced HTTP routing).`,
    },
    {
      heading: "Gateway Load Balancer (GWLB)",
      body: `The Gateway Load Balancer operates at Layer 3 (IP layer) and is purpose-built for deploying, scaling, and managing third-party virtual network appliances — firewalls, intrusion detection systems, and deep packet inspection tools. GWLB uses the GENEVE protocol to forward traffic to a fleet of appliance instances and return it to the original network path after inspection, making the appliance infrastructure horizontally scalable and highly available without requiring route table changes in every spoke VPC. GWLB endpoints, similar to PrivateLink interface endpoints, are placed in VPC subnets and integrated via route table entries that direct traffic through the appliance layer. The canonical architecture routes all ingress or egress traffic from a VPC through a centralized security VPC hosting the GWLB and appliances before returning it to the source, enabling centralized network security inspection without hair-pinning individual routing through each appliance.`,
    },
    {
      heading: "Target Groups, Health Checks, and Stickiness",
      body: `Target groups are logical groupings of targets that receive requests from a load balancer listener rule. Health checks run continuously against each registered target on a configurable protocol, port, path, and interval — unhealthy targets are removed from rotation automatically and re-added when they pass health checks again, forming the backbone of self-healing architectures. Health check thresholds (healthy threshold, unhealthy threshold, timeout, interval) must be tuned to match the application's startup time — an aggressive health check that marks newly launched instances as unhealthy before they warm up will cause unnecessary thrashing in Auto Scaling Groups. Session affinity (stickiness) binds a user's session to a specific target for the duration of a cookie, required for stateful applications that store session data locally. Stickiness reduces load balancing effectiveness during uneven traffic periods — the preferred architecture stores session state externally (ElastiCache, DynamoDB) so any target can serve any user, eliminating the need for stickiness.`,
    },
    {
      heading: "SSL/TLS Termination and Certificate Management",
      body: `ELB supports SSL/TLS termination, decrypting HTTPS traffic at the load balancer and forwarding plain HTTP to targets — this offloads CPU-intensive decryption from application servers. AWS Certificate Manager (ACM) provides free, automatically renewing SSL/TLS certificates that can be deployed directly to ALB and NLB without manual certificate management. ALB supports Server Name Indication (SNI), allowing a single listener on port 443 to serve multiple certificates for different domains — configure each certificate in the listener and ALB selects the appropriate one based on the client's requested hostname. For end-to-end encryption where compliance requires encryption between the load balancer and the targets (not just from clients), configure HTTPS listeners on both the ALB and the target EC2 instances or containers, and use your own certificates on the target side. ACM Private CA enables issuing private certificates for internal services.`,
    },
    {
      heading: "Cross-Zone Load Balancing and Availability",
      body: `Without cross-zone load balancing, each load balancer node distributes traffic only to targets in its own Availability Zone — if one AZ has fewer instances, those instances receive disproportionately more traffic. With cross-zone load balancing enabled, each node distributes requests evenly across all registered targets in all enabled AZs, ensuring even distribution regardless of how many targets exist per AZ. ALB enables cross-zone load balancing by default at no extra charge. NLB and GWLB disable it by default and charge for inter-AZ data transfer when enabled. For Auto Scaling Groups integrated with ELB, the ASG automatically registers new instances with the target group and deregisters terminating instances, maintaining the target group membership as the fleet scales. Connection draining (deregistration delay) allows in-flight requests to complete before a target is removed from rotation, preventing abrupt connection termination during rolling deployments.`,
    },
  ],

  keyFacts: [
    "ALB operates at Layer 7 (HTTP/HTTPS) with path, host, header, and query string routing",
    "NLB operates at Layer 4 (TCP/UDP/TLS) with static IPs, extreme throughput, and source IP preservation",
    "GWLB operates at Layer 3 for deploying third-party network appliances (firewalls, IDS)",
    "ALB supports WAF, Cognito authentication offloading, and native WebSocket/HTTP2",
    "NLB supports Elastic IPs per AZ — use for whitelisting and PrivateLink services",
    "Health checks remove unhealthy targets from rotation and re-add them when they recover",
    "ALB supports SNI — multiple TLS certificates on a single HTTPS listener",
    "Cross-zone load balancing is ON by default for ALB; OFF by default for NLB and GWLB",
    "Connection draining (deregistration delay) allows in-flight requests to complete before target removal",
    "Session stickiness ties a user to a specific target — avoid by externalizing session state",
  ],

  relatedServices: [
    "AWS Auto Scaling",
    "Amazon EC2",
    "AWS WAF",
    "AWS Certificate Manager",
    "Amazon Cognito",
    "AWS PrivateLink",
  ],

  examTips: [
    "Choose ALB for HTTP/HTTPS microservices, WebSocket, path-based routing, and authentication offloading",
    "Choose NLB for TCP/UDP, static IPs, extreme throughput, or as a PrivateLink front end",
    "Choose GWLB for third-party firewall/IDS appliances in a centralized security VPC",
    "Stickiness is a workaround — the preferred design externalizes session state to ElastiCache or DynamoDB",
    "ALB cross-zone is free and on by default; NLB cross-zone incurs inter-AZ data transfer costs",
    "ACM provides free auto-renewing certs deployable directly to ALB and NLB",
    "ALB + Cognito User Pools provides OIDC/OAuth authentication without application code changes",
    "Health check tuning is critical for Auto Scaling — too aggressive causes healthy instances to fail",
  ],
};
