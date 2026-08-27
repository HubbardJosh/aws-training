import { ServiceGuide } from "../../../types/guide";

export const route53Guide: ServiceGuide = {
  id: "saa-route53",
  service: "Amazon Route 53",
  domain: "services",
  tagline:
    "Highly available DNS and traffic routing for global application architectures",
  intro:
    "Amazon Route 53 is a highly available and scalable DNS web service that translates human-readable domain names to IP addresses, and provides advanced traffic routing policies to distribute traffic across regions, availability zones, and weighted endpoints for resilient global architectures.",

  sections: [
    {
      heading: "DNS Record Types and Hosted Zones",
      body: `Route 53 hosted zones are containers for DNS records for a domain. A public hosted zone answers DNS queries from the internet, while a private hosted zone answers queries only from within associated VPCs. The most common DNS record types are: A records mapping a hostname to an IPv4 address, AAAA records mapping to IPv6, CNAME records creating an alias for another hostname, MX records for mail servers, TXT records for domain verification and SPF, and NS records identifying the name servers for a zone. Route 53 also supports Alias records, which are a Route 53 extension to DNS — they map a hostname to an AWS resource (ALB, CloudFront distribution, S3 website endpoint, API Gateway) and are free, update automatically when the resource's IP changes, and can be used at the zone apex (root domain) where CNAME records are not permitted. For the SAA-C03 exam, Alias records are preferred over CNAMEs for AWS resources, especially at the zone apex.`,
      quiz: [
        {
          question:
            "A company wants to point their root domain (example.com) to an Application Load Balancer. Why can't they use a CNAME record?",
          options: [
            "CNAMEs do not support ALB endpoints",
            "CNAME records are not permitted at the zone apex (root domain)",
            "CNAMEs are only supported for IPv6 addresses",
            "CNAMEs require a static IP, which ALBs do not provide",
          ],
          correctIndex: 1,
          explanation:
            "CNAME records cannot be used at the zone apex (root domain like example.com) — this is a DNS standard restriction. To point a root domain to an AWS resource like an ALB, you must use a Route 53 Alias record, which is a Route 53 extension that works at the zone apex, is free, and automatically tracks the ALB's changing IP addresses.",
        },
        {
          question:
            "What is a key advantage of Route 53 Alias records over CNAME records for AWS resources?",
          options: [
            "Alias records support more DNS record types than CNAMEs",
            "Alias records are free and automatically update when the AWS resource's IP changes",
            "Alias records support both IPv4 and IPv6, while CNAMEs support only IPv4",
            "Alias records have lower TTL, resulting in faster DNS propagation",
          ],
          correctIndex: 1,
          explanation:
            "Route 53 Alias records are free (no charge per DNS query for Alias records pointing to AWS resources), automatically track IP changes when the underlying AWS resource changes (e.g., ALB scales), and can be used at the zone apex. CNAME records have a per-query charge and cannot be used at the apex.",
        },
        {
          question:
            "Which type of Route 53 hosted zone answers DNS queries only from within associated VPCs?",
          options: [
            "Public hosted zone",
            "Private hosted zone",
            "Internal hosted zone",
            "VPC-scoped hosted zone",
          ],
          correctIndex: 1,
          explanation:
            "A private hosted zone answers DNS queries only from within the VPCs it is associated with. This allows you to use custom domain names for internal services (like api.internal.mycompany.com) without exposing them to the public internet. Public hosted zones answer queries from anywhere on the internet.",
        },
      ],
    },
    {
      heading: "Routing Policies",
      body: `Route 53 supports several routing policies that determine how DNS queries are answered. Simple routing returns a single resource with no health check integration — appropriate for single-resource configurations. Weighted routing distributes traffic across multiple resources proportionally by weight, enabling A/B testing and gradual traffic shifting between application versions. Latency-based routing directs users to the AWS region that provides the lowest latency for their location, improving global application response times. Failover routing actively monitors health checks and routes traffic to a primary resource; if the primary is unhealthy, traffic automatically switches to a secondary resource. Geolocation routing sends users to specific endpoints based on the geographic location of the DNS query, enabling content localization and data residency compliance. Geoproximity routing (part of Traffic Flow) routes based on geographic location with a configurable bias to shift more or less traffic to specific resources. Multi-value answer routing returns multiple healthy IP addresses (up to eight), improving availability through client-side load balancing.`,
      quiz: [
        {
          question:
            "A company wants to gradually shift 10% of traffic to a new application version while keeping 90% on the current version, without downtime. Which Route 53 routing policy should they use?",
          options: [
            "Latency-based routing",
            "Weighted routing",
            "Failover routing",
            "Geolocation routing",
          ],
          correctIndex: 1,
          explanation:
            "Weighted routing distributes traffic proportionally based on assigned weights. Setting the new version's record weight to 10 and the current version's weight to 90 routes 10% of traffic to the new version. This enables gradual traffic shifting (canary/blue-green deployments) at the DNS level without any downtime.",
        },
        {
          question:
            "Which Route 53 routing policy directs users to endpoints based on their geographic country or continent to support data residency requirements?",
          options: [
            "Latency-based routing",
            "Geoproximity routing",
            "Geolocation routing",
            "Multi-value answer routing",
          ],
          correctIndex: 2,
          explanation:
            "Geolocation routing directs DNS queries to specific endpoints based on the geographic origin of the query (country or continent). This is used for content localization (serving region-specific content) and data residency compliance (ensuring data stays within specific geographic boundaries). Latency-based routing optimizes for performance, not geographic compliance.",
        },
        {
          question:
            "Which Route 53 routing policy sends users to the AWS region with the lowest network latency for their location?",
          options: [
            "Geolocation routing",
            "Geoproximity routing",
            "Latency-based routing",
            "Weighted routing",
          ],
          correctIndex: 2,
          explanation:
            "Latency-based routing measures the latency between the user's DNS resolver and each configured AWS region and directs traffic to the region with the lowest measured latency. This optimizes global application performance. Note: the lowest-latency region is not always the geographically closest region — routing is based on network latency measurements.",
        },
      ],
    },
    {
      heading: "Health Checks and DNS Failover",
      body: `Route 53 health checks monitor the health of endpoints and can trigger automatic DNS failover. HTTP, HTTPS, and TCP health checks probe a specified endpoint at configurable intervals (30 seconds or 10 seconds for fast checks) from Route 53 health checking locations distributed globally — an endpoint is considered healthy only if a threshold percentage of health checkers report it as healthy. Calculated health checks aggregate the health of multiple child health checks using Boolean logic (AND/OR), enabling complex health evaluation across multiple components. CloudWatch alarm health checks monitor a CloudWatch metric (like a DLQ depth or error rate) rather than an HTTP endpoint, enabling health-check-based failover for non-HTTP workloads. For private resources inside a VPC that Route 53 health checkers cannot reach, use CloudWatch alarms that monitor the resource and a health check that evaluates the alarm state. Active-active failover uses weighted or latency routing with health checks on all endpoints; active-passive failover uses explicit failover routing with a primary and a standby.`,
      quiz: [
        {
          question:
            "A Route 53 health check needs to monitor an RDS database in a private VPC subnet. Route 53 health checkers cannot reach private IP addresses. What is the correct approach?",
          options: [
            "Place the RDS instance in a public subnet so Route 53 can reach it",
            "Use a CloudWatch alarm that monitors the RDS database and configure a Route 53 health check that evaluates the alarm state",
            "Use a Calculated health check that combines multiple TCP probes",
            "Configure Route 53 to use the NAT Gateway IP for health checking",
          ],
          correctIndex: 1,
          explanation:
            "Route 53 health checkers are external to your VPC and cannot reach private IP addresses. For private resources, the recommended pattern is to create a CloudWatch alarm that monitors the resource (via CloudWatch metrics), then create a Route 53 health check that evaluates the state of that CloudWatch alarm. If the alarm fires, Route 53 considers the endpoint unhealthy and triggers failover.",
        },
        {
          question:
            "What is the difference between active-active and active-passive failover in Route 53?",
          options: [
            "Active-active uses weighted routing with health checks on all endpoints; active-passive uses failover routing with a designated primary and secondary",
            "Active-active uses failover routing; active-passive uses weighted routing",
            "Active-active requires Direct Connect; active-passive uses VPN connections",
            "Both patterns use the same routing policy, differing only in region count",
          ],
          correctIndex: 0,
          explanation:
            "Active-active failover uses weighted or latency-based routing with health checks on all endpoints — all endpoints serve traffic simultaneously, and unhealthy ones are automatically removed. Active-passive failover uses Route 53 Failover routing, designating one endpoint as primary and another as secondary; the secondary only receives traffic when the primary's health checks fail.",
        },
      ],
    },
    {
      heading: "Multi-Region Architecture Patterns",
      body: `Route 53 is the global traffic manager that ties together multi-region active-active and active-passive architectures. In an active-active architecture, latency-based routing directs users to the nearest healthy region — both regions serve traffic simultaneously, and if one region's health checks fail, Route 53 automatically routes all traffic to the remaining healthy region. In an active-passive architecture, failover routing designates one region as primary and another as secondary; the secondary only receives traffic when the primary's health checks fail. For disaster recovery, the combination of Route 53 failover routing, Aurora Global Database, and S3 Cross-Region Replication provides a comprehensive strategy with RPO in seconds and RTO in minutes. Route 53 also enables blue/green deployments at the DNS level by shifting weighted routing from 100% to the old environment to 100% to the new environment gradually while monitoring error rates.`,
      quiz: [
        {
          question:
            "A company deploys its application in two AWS regions and wants both regions to serve traffic simultaneously, with automatic failover if one region becomes unhealthy. Which Route 53 routing policy supports this active-active pattern?",
          options: [
            "Failover routing with a primary and secondary designation",
            "Geolocation routing directing all traffic to one region",
            "Latency-based routing with health checks on both regional endpoints",
            "Simple routing with both regional endpoints in a single record",
          ],
          correctIndex: 2,
          explanation:
            "Latency-based routing with health checks enabled on all endpoints creates an active-active multi-region architecture. Both regions serve traffic based on lowest latency for each user, and if one region's health checks fail, Route 53 automatically routes all traffic to the remaining healthy region. Simple routing does not support health checks for automatic failover.",
        },
        {
          question:
            "For a comprehensive multi-region disaster recovery strategy, which combination of services provides the lowest RPO and RTO?",
          options: [
            "Route 53 failover routing + S3 versioning + RDS Multi-AZ",
            "Route 53 failover routing + Aurora Global Database + S3 Cross-Region Replication",
            "Route 53 weighted routing + DynamoDB Global Tables + CloudFront",
            "Route 53 latency routing + RDS read replicas + ElastiCache replication",
          ],
          correctIndex: 1,
          explanation:
            "Route 53 failover routing provides automatic DNS-level failover, Aurora Global Database provides sub-second cross-region database replication with managed regional failover in under a minute, and S3 Cross-Region Replication keeps object storage synchronized. This combination enables RPO in seconds and RTO in minutes — the key metrics for a comprehensive DR strategy.",
        },
      ],
    },
    {
      heading: "Private Hosted Zones and Hybrid DNS",
      body: `Private hosted zones resolve DNS queries only within associated VPCs, enabling custom domain names for internal services (e.g., \`api.internal.mycompany.com\`) without exposing them to the public internet. A private hosted zone can be associated with VPCs in multiple accounts using cross-account associations. Hybrid DNS extends on-premises name resolution to Route 53 and vice versa using Route 53 Resolver. Route 53 Resolver Inbound Endpoints accept DNS queries from on-premises networks forwarded through Direct Connect or VPN, allowing on-premises systems to resolve AWS private hosted zone records. Route 53 Resolver Outbound Endpoints forward DNS queries for specific domains from within VPCs to on-premises DNS servers, enabling EC2 instances to resolve on-premises hostnames without deploying a custom DNS forwarder. Resolver DNS Firewall filters outbound DNS queries from VPCs, blocking resolution of known-malicious domains for DNS-layer security.`,
      quiz: [
        {
          question:
            "An on-premises application needs to resolve AWS private hosted zone DNS records over a Direct Connect connection. Which Route 53 Resolver feature enables this?",
          options: [
            "Route 53 Resolver Outbound Endpoints",
            "Route 53 Resolver Inbound Endpoints",
            "Route 53 private hosted zone with VPN association",
            "Route 53 Resolver DNS Firewall",
          ],
          correctIndex: 1,
          explanation:
            "Route 53 Resolver Inbound Endpoints accept DNS queries forwarded from on-premises networks via Direct Connect or VPN. The on-premises DNS server is configured to forward queries for the private hosted zone domain to the inbound endpoint IP addresses, enabling resolution of AWS private DNS records from on-premises systems.",
        },
        {
          question:
            "EC2 instances in a VPC need to resolve hostnames from the company's on-premises Active Directory DNS. Which Route 53 Resolver feature enables this?",
          options: [
            "Route 53 Resolver Inbound Endpoints for on-premises query forwarding",
            "Route 53 Resolver Outbound Endpoints that forward specific domain queries to on-premises DNS",
            "A private hosted zone that mirrors the on-premises DNS records",
            "Route 53 Resolver DNS Firewall with AD integration",
          ],
          correctIndex: 1,
          explanation:
            "Route 53 Resolver Outbound Endpoints forward DNS queries for specified domains from within the VPC to on-premises DNS servers. A forwarding rule maps the on-premises domain (e.g., corp.example.com) to the on-premises DNS server IPs via the outbound endpoint. This enables EC2 instances to resolve on-premises hostnames without deploying custom DNS infrastructure in the VPC.",
        },
      ],
    },
    {
      heading: "Domain Registration and Route 53 Resolver",
      body: `Route 53 functions as a domain registrar, allowing you to purchase and manage domain names directly from the AWS console. Route 53 automatically creates a hosted zone when you register a domain and configures the domain's NS records to point to the Route 53 name servers for that zone. Domain registration is separate from hosted zone management — you can register a domain with Route 53 but use another DNS provider for the hosted zone, or vice versa (register with another registrar and delegate to Route 53 name servers). Route 53's 100% availability SLA for hosted zones is backed by the anycast routing of Route 53 name servers — queries are answered by the geographically nearest Route 53 name server, reducing DNS query latency globally. DNSSEC signing is supported for both registered domains and hosted zones to protect against DNS spoofing attacks.`,
      quiz: [
        {
          question:
            "Route 53's high availability for hosted zones is achieved through which mechanism?",
          options: [
            "Multi-AZ replication of DNS records across availability zones",
            "Anycast routing where queries are answered by the nearest Route 53 name server globally",
            "Active-passive failover between two Route 53 name server clusters",
            "DNS record caching at all CloudFront edge locations",
          ],
          correctIndex: 1,
          explanation:
            "Route 53 name servers use anycast routing, meaning DNS queries are automatically directed to the geographically nearest Route 53 name server. This distributes query load globally and provides high availability — if one name server location is unavailable, queries are automatically routed to the next nearest. This architecture backs Route 53's 100% availability SLA for hosted zones.",
        },
        {
          question:
            "A company registered their domain with GoDaddy but wants to use Route 53 for DNS management. What must be configured at GoDaddy?",
          options: [
            "Update GoDaddy's MX records to point to Route 53",
            "Update the domain's NS records at GoDaddy to point to the Route 53 name servers",
            "Enable GoDaddy's DNS forwarding to Route 53",
            "Create a CNAME record at GoDaddy pointing to the Route 53 hosted zone",
          ],
          correctIndex: 1,
          explanation:
            "To delegate DNS management to Route 53 for a domain registered with another registrar, you must update the domain's NS (Name Server) records at the registrar (GoDaddy) to point to the Route 53 name servers assigned to the hosted zone. This tells the global DNS system to use Route 53 for authoritative answers for that domain.",
        },
      ],
    },
  ],

  keyFacts: [
    "Alias records map to AWS resources for free, auto-update with resource IP changes, and work at zone apex",
    "CNAME records cannot be used at the zone apex (root domain) — use Alias instead",
    "Routing policies: Simple, Weighted, Latency, Failover, Geolocation, Geoproximity, Multi-value",
    "Health checks monitor HTTP/HTTPS/TCP endpoints or CloudWatch alarms for non-HTTP workloads",
    "Active-active = weighted/latency routing with health checks; Active-passive = failover routing",
    "Private hosted zones resolve only within associated VPCs",
    "Resolver Inbound Endpoints: on-premises → Route 53; Outbound Endpoints: VPC → on-premises DNS",
    "Failover routing designates explicit primary and secondary resources with health check monitoring",
    "Geolocation routing directs based on query origin country/continent for data residency compliance",
    "Route 53 name servers use anycast — queries go to the geographically nearest name server",
  ],

  relatedServices: [
    "Amazon CloudFront",
    "Elastic Load Balancing",
    "AWS Global Accelerator",
    "Amazon VPC",
    "AWS Direct Connect",
    "Amazon Aurora",
  ],

  examTips: [
    "Alias records are preferred over CNAMEs for all AWS resources — they are free and work at apex",
    "CNAME at zone apex is invalid — always use an Alias record for root domain routing to AWS resources",
    "Latency routing sends to lowest-latency region, not necessarily the geographically closest",
    "Geolocation routing is for content localization and data residency — not performance optimization",
    "Private hosted zone health checks need CloudWatch alarms because Route 53 checkers cannot reach private IPs",
    "Weighted routing at 0 weight stops traffic to an endpoint without removing the record",
    "Route 53 failover requires health checks — without them, failover routing does not switch automatically",
    "Multi-value answer routing is not a replacement for ELB — it is DNS-level best-effort load distribution",
  ],

  topicQuiz: [
    {
      question:
        "A company wants to map their root domain (example.com) to an Application Load Balancer. Which DNS record type must be used?",
      options: [
        "CNAME record pointing to the ALB DNS name",
        "A record with the ALB's static IP",
        "Route 53 Alias record pointing to the ALB",
        "TXT record with the ALB ARN",
      ],
      correctIndex: 2,
      explanation:
        "CNAME records cannot be used at the zone apex (root domain). A Route 53 Alias record is required to map a root domain to an AWS resource like an ALB. Alias records work at the zone apex, are free, and automatically track the ALB's IP addresses as they change.",
    },
    {
      question:
        "Which Route 53 routing policy is best for gradually shifting traffic from an old application version to a new one?",
      options: [
        "Failover routing",
        "Weighted routing",
        "Latency-based routing",
        "Geolocation routing",
      ],
      correctIndex: 1,
      explanation:
        "Weighted routing distributes traffic proportionally based on configured weights. By adjusting weights between the old and new versions (e.g., 90/10 then 80/20, etc.), you can perform a gradual canary or blue/green deployment at the DNS level without downtime.",
    },
    {
      question:
        "A global application should direct each user to the AWS region with the lowest network latency. Which routing policy achieves this?",
      options: [
        "Geolocation routing",
        "Geoproximity routing",
        "Latency-based routing",
        "Multi-value answer routing",
      ],
      correctIndex: 2,
      explanation:
        "Latency-based routing measures network latency between the user's DNS resolver and each configured AWS region and routes queries to the region with the lowest latency. This optimizes performance for global users. Geolocation routing routes based on geographic origin, not measured latency.",
    },
    {
      question:
        "A Route 53 health check must monitor an internal service running in a private VPC subnet. How should this be configured?",
      options: [
        "Use an HTTP health check with the private IP address of the service",
        "Create a CloudWatch alarm monitoring the service and configure a Route 53 health check to evaluate the alarm state",
        "Use a Calculated health check aggregating multiple TCP probes",
        "Place the service in a public subnet temporarily for health check configuration",
      ],
      correctIndex: 1,
      explanation:
        "Route 53 health checkers are external to VPCs and cannot reach private IP addresses. The correct approach is to use a CloudWatch alarm that monitors the private resource (via CloudWatch metrics or a proxy endpoint), then configure a Route 53 health check that evaluates that CloudWatch alarm's state.",
    },
    {
      question:
        "Which Route 53 routing policy designates an explicit primary and secondary endpoint, with the secondary only receiving traffic when the primary's health check fails?",
      options: [
        "Weighted routing with weights 100 and 0",
        "Failover routing",
        "Latency-based routing",
        "Multi-value answer routing",
      ],
      correctIndex: 1,
      explanation:
        "Failover routing explicitly designates one record as primary and another as secondary. Route 53 monitors the primary with a health check and automatically routes traffic to the secondary only when the primary is unhealthy. This is the active-passive pattern. Weighted routing at 100/0 could approximate this but requires manual intervention to switch.",
    },
    {
      question:
        "An on-premises application needs to resolve DNS records in an AWS private hosted zone. Which Route 53 Resolver feature enables this over a Direct Connect connection?",
      options: [
        "Resolver Outbound Endpoints",
        "Resolver Inbound Endpoints",
        "Resolver DNS Firewall",
        "Private hosted zone cross-account association",
      ],
      correctIndex: 1,
      explanation:
        "Route 53 Resolver Inbound Endpoints provide IP addresses within a VPC that on-premises DNS servers can forward queries to over Direct Connect or VPN. The on-premises DNS server is configured to forward queries for the private hosted zone domain to these endpoint IPs, enabling on-premises systems to resolve AWS private DNS records.",
    },
    {
      question:
        "Which Route 53 routing policy should be used to route users to endpoints based on the country or continent of their DNS query for data residency compliance?",
      options: [
        "Latency-based routing",
        "Geoproximity routing with bias adjustment",
        "Geolocation routing",
        "Multi-value answer routing",
      ],
      correctIndex: 2,
      explanation:
        "Geolocation routing directs DNS queries to specific endpoints based on the geographic origin of the query (country or continent). This is the correct policy for data residency requirements where users from specific countries must be served by endpoints in specific regions. Latency-based routing optimizes for performance, not geographic compliance.",
    },
    {
      question:
        "EC2 instances in a VPC need to resolve hostnames from an on-premises Active Directory domain. Which Route 53 Resolver component is required?",
      options: [
        "Resolver Inbound Endpoints to accept queries from EC2",
        "Resolver Outbound Endpoints with forwarding rules for the on-premises domain",
        "A private hosted zone mirroring the AD records",
        "Resolver DNS Firewall with AD domain allowlist",
      ],
      correctIndex: 1,
      explanation:
        "Route 53 Resolver Outbound Endpoints forward DNS queries from within the VPC to specified DNS servers (the on-premises AD DNS in this case) for configured domains. A forwarding rule maps the on-premises domain to the on-premises DNS server IPs via the outbound endpoint. This enables EC2 instances to resolve on-premises hostnames without custom DNS infrastructure in the VPC.",
    },
  ],
};
