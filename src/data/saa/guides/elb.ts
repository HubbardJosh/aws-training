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
      quiz: [
        {
          question:
            "An ALB needs to route /api/* requests to an ECS-based API service and /static/* requests to an S3-backed service. Which ALB feature enables this?",
          options: [
            "Host-based routing using the Host header",
            "Path-based routing using URL path patterns",
            "Query string routing using URL parameters",
            "Header-based routing using custom HTTP headers",
          ],
          correctIndex: 1,
          explanation:
            "Path-based routing in ALB routes requests to different target groups based on the URL path pattern. /api/* can route to one target group and /static/* to another, all on the same ALB listener.",
        },
        {
          question:
            "Which ALB integration allows adding OIDC authentication to a web application without modifying application code?",
          options: [
            "AWS WAF with a managed authentication rule group",
            "AWS Certificate Manager for TLS termination",
            "AWS Cognito User Pools authentication offloading at the ALB",
            "Lambda@Edge running authentication logic",
          ],
          correctIndex: 2,
          explanation:
            "ALB integrates with AWS Cognito User Pools to handle OIDC authentication at the load balancer layer. Users are redirected to Cognito for login, and only authenticated requests are forwarded to the application — no code changes required.",
        },
        {
          question:
            "Which of the following target types does ALB NOT natively support in a target group?",
          options: [
            "EC2 instances",
            "Lambda functions",
            "RDS database endpoints",
            "IP addresses",
          ],
          correctIndex: 2,
          explanation:
            "ALB target groups support EC2 instances, ECS tasks, Lambda functions, and IP addresses. RDS database endpoints are not a valid ALB target type — load balancers route application traffic, not database connections.",
        },
      ],
    },
    {
      heading: "Network Load Balancer (NLB)",
      body: `The Network Load Balancer operates at Layer 4 (TCP/UDP/TLS) and is engineered for extreme performance — it can handle millions of requests per second with ultra-low latency and handles sudden, volatile traffic patterns. NLB preserves the client source IP address through to the target, which is important for security groups and access logs that need the real client IP. NLB supports static IP addresses and Elastic IPs per AZ, making it suitable for whitelisting scenarios where firewall rules require known IPs. TLS termination at NLB offloads decryption from targets while preserving source IP. NLB is the right choice for non-HTTP protocols (MQTT, SMTP, custom TCP), ultra-low latency requirements, static IP requirements, and as the front end for AWS PrivateLink services. NLB target groups support EC2 instances, IP addresses, and ALB targets (the ALB-behind-NLB pattern for combining static IPs with advanced HTTP routing).`,
      quiz: [
        {
          question:
            "A financial services company needs a load balancer with static IP addresses that partner firms can whitelist in their firewall rules. Which ELB type supports this?",
          options: [
            "Application Load Balancer — it supports static IPs via Global Accelerator",
            "Network Load Balancer — it supports static IPs and Elastic IPs per AZ",
            "Gateway Load Balancer — it provides static IPs for all traffic",
            "Classic Load Balancer — the only type with persistent IP addresses",
          ],
          correctIndex: 1,
          explanation:
            "NLB supports static IP addresses and Elastic IPs per Availability Zone, making them suitable for scenarios where partner firewall rules require known, stable IP addresses.",
        },
        {
          question:
            "An application uses a custom TCP protocol on port 5000. Which load balancer type should be used?",
          options: [
            "Application Load Balancer — it handles all TCP traffic",
            "Network Load Balancer — it operates at Layer 4 and supports any TCP/UDP protocol",
            "Gateway Load Balancer — designed for custom protocols",
            "ALB with a custom listener protocol",
          ],
          correctIndex: 1,
          explanation:
            "Network Load Balancer operates at Layer 4 (TCP/UDP/TLS) and supports any TCP or UDP protocol, not just HTTP/HTTPS. ALB only handles HTTP and HTTPS traffic at Layer 7.",
        },
      ],
    },
    {
      heading: "Gateway Load Balancer (GWLB)",
      body: `The Gateway Load Balancer operates at Layer 3 (IP layer) and is purpose-built for deploying, scaling, and managing third-party virtual network appliances — firewalls, intrusion detection systems, and deep packet inspection tools. GWLB uses the GENEVE protocol to forward traffic to a fleet of appliance instances and return it to the original network path after inspection, making the appliance infrastructure horizontally scalable and highly available without requiring route table changes in every spoke VPC. GWLB endpoints, similar to PrivateLink interface endpoints, are placed in VPC subnets and integrated via route table entries that direct traffic through the appliance layer. The canonical architecture routes all ingress or egress traffic from a VPC through a centralized security VPC hosting the GWLB and appliances before returning it to the source, enabling centralized network security inspection without hair-pinning individual routing through each appliance.`,
      quiz: [
        {
          question:
            "A company needs to route all VPC ingress traffic through a third-party firewall appliance for deep packet inspection. Which AWS load balancer type enables this?",
          options: [
            "Application Load Balancer with WAF integration",
            "Network Load Balancer with a firewall target group",
            "Gateway Load Balancer — purpose-built for scaling third-party network appliances",
            "Classic Load Balancer with proxy protocol",
          ],
          correctIndex: 2,
          explanation:
            "Gateway Load Balancer is purpose-built for deploying and scaling third-party network appliances like firewalls and IDS systems. It operates at Layer 3, uses GENEVE protocol, and enables centralized traffic inspection without changing individual VPC route tables.",
        },
        {
          question:
            "What protocol does Gateway Load Balancer use to encapsulate and forward traffic to appliance targets?",
          options: [
            "VXLAN",
            "GENEVE",
            "GRE (Generic Routing Encapsulation)",
            "IPsec",
          ],
          correctIndex: 1,
          explanation:
            "Gateway Load Balancer uses the GENEVE protocol (Generic Network Virtualization Encapsulation) to forward original packets to appliance instances for inspection and return them to the network path after processing.",
        },
      ],
    },
    {
      heading: "Target Groups, Health Checks, and Stickiness",
      body: `Target groups are logical groupings of targets that receive requests from a load balancer listener rule. Health checks run continuously against each registered target on a configurable protocol, port, path, and interval — unhealthy targets are removed from rotation automatically and re-added when they pass health checks again, forming the backbone of self-healing architectures. Health check thresholds (healthy threshold, unhealthy threshold, timeout, interval) must be tuned to match the application's startup time — an aggressive health check that marks newly launched instances as unhealthy before they warm up will cause unnecessary thrashing in Auto Scaling Groups. Session affinity (stickiness) binds a user's session to a specific target for the duration of a cookie, required for stateful applications that store session data locally. Stickiness reduces load balancing effectiveness during uneven traffic periods — the preferred architecture stores session state externally (ElastiCache, DynamoDB) so any target can serve any user, eliminating the need for stickiness.`,
      quiz: [
        {
          question:
            "Auto Scaling is repeatedly terminating newly launched instances that appear unhealthy. The application takes 3 minutes to initialize. What should be adjusted?",
          options: [
            "Increase the Auto Scaling minimum capacity",
            "Tune the health check thresholds — increase the unhealthy threshold count and interval to give new instances time to initialize",
            "Use a longer AMI with pre-warmed JVM",
            "Switch from ELB health checks to EC2 status checks",
          ],
          correctIndex: 1,
          explanation:
            "Health check thresholds must be tuned to allow newly launched instances enough time to initialize before being marked unhealthy. Increasing the health check interval, timeout, or unhealthy threshold count prevents premature termination of warming instances.",
        },
        {
          question:
            "Why is session stickiness (affinity) considered an architectural anti-pattern?",
          options: [
            "Stickiness is not supported on Application Load Balancers",
            "Stickiness reduces load balancing effectiveness by tying users to specific targets — the preferred design externalizes session state to ElastiCache or DynamoDB",
            "Stickiness requires a paid ALB feature that increases cost",
            "Stickiness prevents Auto Scaling from terminating instances",
          ],
          correctIndex: 1,
          explanation:
            "Session stickiness ties users to specific instances, creating uneven load distribution and preventing free horizontal scaling. The preferred architecture externalizes session state (e.g., to ElastiCache Redis) so any instance can serve any user.",
        },
        {
          question:
            "What happens to a target registered with an ELB target group when it fails health checks?",
          options: [
            "ELB immediately terminates the instance",
            "ELB removes the unhealthy target from rotation and re-adds it automatically when it passes health checks again",
            "ELB sends an SNS alert but continues routing traffic to the target",
            "ELB scales out additional instances to compensate",
          ],
          correctIndex: 1,
          explanation:
            "When a target fails health checks, ELB stops routing traffic to it and removes it from rotation. When the target subsequently passes health checks, ELB automatically re-adds it to the rotation — the self-healing backbone of ELB-based architectures.",
        },
      ],
    },
    {
      heading: "SSL/TLS Termination and Certificate Management",
      body: `ELB supports SSL/TLS termination, decrypting HTTPS traffic at the load balancer and forwarding plain HTTP to targets — this offloads CPU-intensive decryption from application servers. AWS Certificate Manager (ACM) provides free, automatically renewing SSL/TLS certificates that can be deployed directly to ALB and NLB without manual certificate management. ALB supports Server Name Indication (SNI), allowing a single listener on port 443 to serve multiple certificates for different domains — configure each certificate in the listener and ALB selects the appropriate one based on the client's requested hostname. For end-to-end encryption where compliance requires encryption between the load balancer and the targets (not just from clients), configure HTTPS listeners on both the ALB and the target EC2 instances or containers, and use your own certificates on the target side. ACM Private CA enables issuing private certificates for internal services.`,
      quiz: [
        {
          question:
            "An ALB needs to serve different SSL/TLS certificates for api.company.com and app.company.com on the same port 443 listener. Which ALB feature enables this?",
          options: [
            "Multiple listeners — one per domain on different ports",
            "Server Name Indication (SNI) — ALB selects the correct certificate based on the client's requested hostname",
            "Host-based routing with separate certificates per target group",
            "CloudFront in front of the ALB handling certificate selection",
          ],
          correctIndex: 1,
          explanation:
            "ALB supports SNI, allowing multiple SSL/TLS certificates to be attached to a single HTTPS listener. ALB automatically selects the correct certificate based on the hostname in the client's TLS handshake.",
        },
        {
          question:
            "What is the benefit of using ACM certificates on ALB compared to manually managing certificates?",
          options: [
            "ACM certificates support stronger encryption algorithms than manually managed certificates",
            "ACM provides free, automatically renewing certificates — no manual renewal or private key management required",
            "ACM certificates are required for ALB; manually managed certificates are not supported",
            "ACM certificates enable end-to-end encryption between ALB and targets",
          ],
          correctIndex: 1,
          explanation:
            "ACM provides free SSL/TLS certificates that automatically renew before expiration, eliminating the operational burden of certificate rotation and the risk of expired certificate outages.",
        },
      ],
    },
    {
      heading: "Cross-Zone Load Balancing and Availability",
      body: `Without cross-zone load balancing, each load balancer node distributes traffic only to targets in its own Availability Zone — if one AZ has fewer instances, those instances receive disproportionately more traffic. With cross-zone load balancing enabled, each node distributes requests evenly across all registered targets in all enabled AZs, ensuring even distribution regardless of how many targets exist per AZ. ALB enables cross-zone load balancing by default at no extra charge. NLB and GWLB disable it by default and charge for inter-AZ data transfer when enabled. For Auto Scaling Groups integrated with ELB, the ASG automatically registers new instances with the target group and deregisters terminating instances, maintaining the target group membership as the fleet scales. Connection draining (deregistration delay) allows in-flight requests to complete before a target is removed from rotation, preventing abrupt connection termination during rolling deployments.`,
      quiz: [
        {
          question:
            "An NLB has 2 instances in us-east-1a and 8 instances in us-east-1b. Without cross-zone load balancing, what happens?",
          options: [
            "Traffic is distributed evenly across all 10 instances regardless of AZ",
            "Each AZ's NLB node distributes 50% of traffic to its local instances — the 2 instances in us-east-1a each get 25%, while the 8 in us-east-1b each get 6.25%",
            "NLB routes all traffic to the AZ with more instances",
            "NLB automatically enables cross-zone balancing when instance counts are uneven",
          ],
          correctIndex: 1,
          explanation:
            "Without cross-zone load balancing, each NLB node distributes traffic only to targets in its own AZ. With 50% of traffic going to each AZ, the 2 instances in us-east-1a each receive 25%, while the 8 instances in us-east-1b each receive only 6.25%.",
        },
        {
          question:
            "What does connection draining (deregistration delay) prevent during rolling deployments?",
          options: [
            "New instances from receiving traffic before they pass health checks",
            "Abrupt termination of in-flight requests when a target is removed from rotation",
            "The load balancer from sending traffic to instances in a different AZ",
            "Auto Scaling from terminating instances during a deployment",
          ],
          correctIndex: 1,
          explanation:
            "Connection draining (deregistration delay) allows in-flight requests to complete before a target is fully removed from rotation. Without it, active connections would be abruptly terminated when an instance is deregistered during deployments or scale-in events.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A microservices application needs HTTP routing based on URL path — /auth to an authentication service and /products to a product catalog. Which load balancer type handles this?",
      options: [
        "Network Load Balancer with path-based routing rules",
        "Application Load Balancer with path-based routing to different target groups",
        "Gateway Load Balancer with URL inspection rules",
        "Classic Load Balancer with URL-based listener rules",
      ],
      correctIndex: 1,
      explanation:
        "Application Load Balancer supports path-based routing, directing requests to different target groups based on the URL path. NLB operates at Layer 4 and cannot inspect URL paths.",
    },
    {
      question:
        "A partner company requires a load balancer with known, static IP addresses for firewall whitelisting. Which ELB type meets this requirement?",
      options: [
        "Application Load Balancer — it supports static IPs via Elastic IP association",
        "Network Load Balancer — it supports static IPs and Elastic IPs per AZ",
        "Gateway Load Balancer — it provides static IPs by default",
        "ALB behind AWS Global Accelerator for static IPs",
      ],
      correctIndex: 1,
      explanation:
        "NLB supports static IP addresses and Elastic IPs per Availability Zone. ALB does not support static IPs directly (though Global Accelerator can provide static IPs in front of an ALB).",
    },
    {
      question:
        "Which load balancer type should be used to distribute traffic through a fleet of third-party intrusion detection appliances?",
      options: [
        "Application Load Balancer with WAF rules",
        "Network Load Balancer with health checks on the appliances",
        "Gateway Load Balancer — purpose-built for scaling virtual network appliances",
        "Classic Load Balancer in TCP passthrough mode",
      ],
      correctIndex: 2,
      explanation:
        "Gateway Load Balancer is purpose-built for deploying and scaling third-party virtual network appliances (firewalls, IDS, DPI systems). It uses GENEVE encapsulation and operates at Layer 3.",
    },
    {
      question:
        "An ALB HTTPS listener needs to serve different SSL certificates for multiple customer domains on port 443. Which feature enables this?",
      options: [
        "Multiple HTTPS listeners on different ports — one per domain",
        "Server Name Indication (SNI) — multiple certificates on a single listener, selected by hostname",
        "CloudFront in front of the ALB for certificate management",
        "ACM wildcard certificates covering all domains",
      ],
      correctIndex: 1,
      explanation:
        "ALB SNI support allows multiple SSL/TLS certificates to be attached to a single port 443 listener. ALB selects the appropriate certificate based on the hostname in the client TLS handshake.",
    },
    {
      question:
        "Cross-zone load balancing is enabled by default at no extra charge for which ELB type?",
      options: [
        "Network Load Balancer",
        "Gateway Load Balancer",
        "Application Load Balancer",
        "All ELB types enable it by default",
      ],
      correctIndex: 2,
      explanation:
        "ALB enables cross-zone load balancing by default with no inter-AZ data transfer charge. NLB and GWLB have it disabled by default and charge for inter-AZ data transfer when enabled.",
    },
    {
      question:
        "A web application needs OIDC authentication added without changing application code. Which ALB integration provides this?",
      options: [
        "ALB with AWS WAF and an OIDC managed rule group",
        "ALB with AWS Cognito User Pools authentication offloading",
        "ALB with Lambda Authorizers performing OIDC validation",
        "ALB with ACM certificates and mutual TLS",
      ],
      correctIndex: 1,
      explanation:
        "ALB integrates natively with Amazon Cognito User Pools to offload OIDC authentication. The ALB handles the OIDC flow and only forwards authenticated requests to the application — zero application code changes required.",
    },
    {
      question:
        "During a rolling deployment, an instance is being deregistered from an ALB target group. What prevents active user requests from being abruptly dropped?",
      options: [
        "ALB automatically routes active users to other instances before deregistration",
        "Connection draining (deregistration delay) allows in-flight requests to complete before the target is removed",
        "ALB health checks detect active connections and delay deregistration automatically",
        "Sticky sessions keep active users connected to the deregistering instance",
      ],
      correctIndex: 1,
      explanation:
        "Connection draining (deregistration delay) gives in-flight requests time to complete before the target is fully removed from the rotation, preventing active connections from being abruptly terminated during deployments.",
    },
    {
      question:
        "An NLB has targets in two AZs but cross-zone load balancing is disabled. One AZ has 1 instance and the other has 9 instances. What traffic distribution results?",
      options: [
        "10% per instance across all 10 instances",
        "50% to the single instance in AZ-A and 50% split across 9 instances in AZ-B",
        "90% to AZ-B because it has more instances",
        "Traffic only goes to AZ-B because AZ-A is underprovisioned",
      ],
      correctIndex: 1,
      explanation:
        "Without cross-zone load balancing, each AZ receives 50% of traffic regardless of instance count. The single instance in AZ-A handles 50% of all traffic, while each of the 9 instances in AZ-B handles about 5.5%.",
    },
  ],
};
