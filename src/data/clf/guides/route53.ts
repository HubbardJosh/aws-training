import { ServiceGuide } from "../../../types/guide";

export const route53Guide: ServiceGuide = {
  id: "clf-route53",
  service: "Amazon Route 53",
  domain: "development",
  tagline: "Scalable and highly available Domain Name System (DNS) service",
  intro:
    "Amazon Route 53 is a highly available and scalable Domain Name System (DNS) service that translates human-readable domain names into IP addresses, and also provides domain registration and health checking capabilities.",

  sections: [
    {
      heading: "What Is DNS and Route 53?",
      body: `The **Domain Name System (DNS)** is the internet's phonebook. When you type \`www.example.com\` in a browser, DNS translates that human-readable name into an IP address (like \`93.184.216.34\`) that computers use to communicate. Without DNS, you would need to memorize IP addresses for every website.

**Amazon Route 53** is AWS's managed DNS service. The name "Route 53" refers to TCP/UDP port 53, which is the standard port for DNS traffic.

Route 53 serves three main functions:
- **DNS service**: resolves domain names to IP addresses (and other resource types)
- **Domain registration**: you can purchase and manage domain names directly through Route 53
- **Health checking**: monitors the health of your endpoints and routes traffic away from unhealthy ones

Route 53 operates from a global network of DNS servers with 100% availability SLA — it is one of the few AWS services with a full 100% uptime commitment.`,
      quiz: [
        {
          question: "What are the three main functions of Amazon Route 53?",
          options: [
            "DNS service, domain registration, and health checking",
            "Load balancing, firewall, and content delivery",
            "Traffic monitoring, DDoS protection, and DNS caching",
            "IP management, VPN tunneling, and certificate issuance",
          ],
          correctIndex: 0,
          explanation:
            "Route 53 provides DNS resolution (translating domain names to IPs), domain registration (purchasing and managing domain names), and health checking (monitoring endpoints and routing away from unhealthy ones).",
        },
        {
          question:
            "What is the availability SLA for Amazon Route 53, making it unique among major AWS services?",
          options: ["100%", "99.99%", "99.9%", "99.999%"],
          correctIndex: 0,
          explanation:
            "Route 53 operates with a 100% availability SLA — it is one of the very few AWS services with a full 100% uptime commitment, backed by a global network of DNS servers.",
        },
      ],
    },
    {
      heading: "DNS Record Types",
      body: `Route 53 supports all standard DNS record types. The most important ones for the Cloud Practitioner exam are:

**A record**: maps a domain name to an IPv4 address. \`www.example.com\` → \`93.184.216.34\`. This is the most common record type.

**AAAA record**: maps a domain name to an IPv6 address.

**CNAME record** (Canonical Name): maps one domain name to another domain name. \`blog.example.com\` → \`www.example.com\`. CNAME records cannot be used at the zone apex (the root domain itself, like \`example.com\`).

**Alias record**: Route 53's special record type that maps a domain name to an AWS resource (like a CloudFront distribution, S3 website endpoint, ELB, or another Route 53 hosted zone). Unlike CNAME, Alias records can be used at the zone apex. Alias records are also free — Route 53 does not charge for queries to Alias records pointing to AWS resources.

**MX record**: specifies mail servers for a domain.

**TXT record**: stores text information, commonly used for domain ownership verification and email authentication (SPF, DKIM).`,
      quiz: [
        {
          question:
            "A company wants to point their root domain (example.com) directly to an Application Load Balancer. Which Route 53 record type should they use?",
          options: [
            "CNAME record, because it maps domain names to other domain names",
            "A record, because it maps to an IPv4 address",
            "Alias record, because it can be used at the zone apex and maps to AWS resources",
            "MX record, because it handles traffic routing",
          ],
          correctIndex: 2,
          explanation:
            "Alias records are Route 53's special record type that can be used at the zone apex (root domain) and map directly to AWS resources like ELBs, CloudFront, and S3. CNAME records cannot be used at the zone apex.",
        },
        {
          question:
            "What is a key advantage of Route 53 Alias records over CNAME records when pointing to AWS resources?",
          options: [
            "Alias records support IPv6 while CNAME records do not",
            "Alias records automatically enable health checks",
            "Alias records provide faster DNS resolution globally",
            "Alias records are free and work at the zone apex; CNAME records are charged and cannot be used at the apex",
          ],
          correctIndex: 3,
          explanation:
            "Alias records have two key advantages: they are free (Route 53 does not charge for queries to Alias records pointing to AWS resources) and they can be used at the zone apex (root domain), which CNAME records cannot.",
        },
      ],
    },
    {
      heading: "Routing Policies",
      body: `Route 53's routing policies determine how it responds to DNS queries. Choosing the right policy enables powerful traffic management without changing your application code.

**Simple routing**: returns a single resource for each query. No health checks. Use for single-server setups or when you have one resource for a domain.

**Weighted routing**: distributes traffic across multiple resources according to assigned weights. You can send 90% of traffic to one endpoint and 10% to another — useful for gradual rollouts (canary deployments) or A/B testing.

**Latency-based routing**: routes users to the AWS region with the lowest network latency for their location. If you run your application in \`us-east-1\` and \`eu-west-1\`, US users automatically go to \`us-east-1\` and European users go to \`eu-west-1\`.

**Failover routing**: configures a primary and secondary endpoint. Route 53 monitors the primary with health checks and automatically routes traffic to the secondary if the primary fails — enabling active-passive disaster recovery.

**Geolocation routing**: routes traffic based on the geographic location of the user. You can route European users to EU servers and US users to US servers, which is useful for content localization or data residency requirements.

**Geoproximity routing**: routes traffic based on geographic location of users and resources, with optional bias to expand or shrink the geographic region for each resource.`,
      quiz: [
        {
          question:
            "A development team wants to gradually roll out a new application version by sending 10% of traffic to the new version and 90% to the existing version. Which Route 53 routing policy should they use?",
          options: [
            "Latency-based routing, to route users to the lowest-latency endpoint",
            "Weighted routing, to distribute traffic by assigned percentage weights",
            "Failover routing, to fall back to the old version if the new one fails",
            "Geolocation routing, to route users by their geographic location",
          ],
          correctIndex: 1,
          explanation:
            "Weighted routing distributes traffic across multiple resources according to assigned weights, making it ideal for canary deployments and A/B testing. You can send a specific percentage of traffic to each endpoint.",
        },
        {
          question:
            "A company runs its application in us-east-1 and eu-west-1. They want users to automatically be routed to whichever region provides the best experience. Which routing policy achieves this?",
          options: [
            "Simple routing, which always returns the same endpoint",
            "Latency-based routing, which routes to the region with the lowest network latency",
            "Weighted routing, which splits traffic evenly",
            "Geolocation routing, which routes by the user's country",
          ],
          correctIndex: 1,
          explanation:
            "Latency-based routing routes users to the AWS region with the lowest network latency for their location — not just the geographically closest region, but the one with the best measured network performance.",
        },
      ],
    },
    {
      heading: "Health Checks",
      body: `Route 53 **health checks** monitor the health of your endpoints (web servers, load balancers, or other resources) and can automatically route traffic away from unhealthy endpoints.

A health check periodically sends requests to your endpoint (HTTP, HTTPS, or TCP) and marks it as healthy or unhealthy based on whether it receives a successful response. If an endpoint fails health checks, Route 53 stops routing traffic to it and redirects to healthy alternatives — this happens automatically without manual intervention.

Health checks can monitor:
- An endpoint (specific IP address or domain name)
- A CloudWatch alarm (mark the endpoint unhealthy when an alarm is in ALARM state)
- Other health checks (calculated health checks — healthy if N of M children are healthy)

**Route 53 Application Recovery Controller** extends this concept to enable fast, reliable application recovery with readiness checks and routing controls that help you recover applications across multiple AZs and regions.

For the Cloud Practitioner exam, the key concept is that Route 53 health checks combined with failover routing policies provide **automatic DNS failover** — if your primary server fails, Route 53 automatically redirects users to your backup without manual intervention.`,
      quiz: [
        {
          question:
            "A company has a primary web server and a backup server. They want Route 53 to automatically redirect traffic to the backup if the primary becomes unhealthy. Which combination achieves this?",
          options: [
            "Failover routing combined with Route 53 health checks",
            "Simple routing with a CloudWatch alarm",
            "Geolocation routing with a secondary endpoint configured",
            "Weighted routing with health checks enabled",
          ],
          correctIndex: 0,
          explanation:
            "Failover routing combined with health checks enables automatic DNS failover. Route 53 monitors the primary endpoint with health checks and automatically routes traffic to the secondary endpoint if the primary fails — no manual intervention needed.",
        },
      ],
    },
    {
      heading: "Domain Registration and Hosted Zones",
      body: `Route 53 is a full-service domain registrar, meaning you can register new domain names (like \`myapp.com\`) directly through AWS. Route 53 supports hundreds of TLDs (\`.com\`, \`.net\`, \`.org\`, \`.io\`, and many more). Domain registration fees vary by TLD.

Once you have a domain (either registered through Route 53 or transferred from another registrar), you manage its DNS records in a **hosted zone**. A hosted zone is a container for DNS records for a specific domain. Route 53 automatically creates two records in every hosted zone: an **NS record** (name servers — the Route 53 servers authoritative for your domain) and an **SOA record** (start of authority).

A **public hosted zone** manages DNS records accessible from the internet. A **private hosted zone** manages DNS records accessible only within one or more specified VPCs — useful for internal service discovery where you do not want your service endpoints publicly resolvable.

Route 53's integration with other AWS services makes it the natural DNS solution for AWS architectures. Using Alias records, you can point your domain directly to CloudFront distributions, Application Load Balancers, S3 website endpoints, and Elastic Beanstalk environments without managing changing IP addresses.`,
      quiz: [
        {
          question:
            "A company wants to create DNS records for internal microservices that should only be resolvable from within their VPC and not from the public internet. What should they create in Route 53?",
          options: [
            "A public hosted zone with restricted bucket policies",
            "A weighted routing policy with VPC-only targets",
            "A private hosted zone associated with their VPC",
            "A CNAME record pointing to the VPC's internal IP range",
          ],
          correctIndex: 2,
          explanation:
            "A private hosted zone in Route 53 manages DNS records accessible only within one or more specified VPCs. This is ideal for internal service discovery where endpoints should not be publicly resolvable.",
        },
      ],
    },
  ],

  keyFacts: [
    "Route 53 is AWS's highly available DNS service with a 100% uptime SLA",
    "Route 53 provides DNS resolution, domain registration, and health checking",
    "Alias records map domains to AWS resources (ELB, CloudFront, S3) — free, works at zone apex",
    "CNAME records cannot be used at the zone apex (root domain)",
    "Routing policies: Simple, Weighted, Latency-based, Failover, Geolocation, Geoproximity",
    "Health checks monitor endpoints and trigger automatic failover routing",
    "Failover routing: primary + secondary endpoint; Route 53 fails over automatically on health check failure",
    "Latency-based routing routes users to the AWS region with lowest latency for them",
    "Weighted routing enables canary deployments and A/B testing at the DNS level",
    "Private hosted zones resolve DNS only within specified VPCs — not from the public internet",
  ],

  relatedServices: [
    "Amazon CloudFront",
    "Elastic Load Balancing",
    "AWS Elastic Beanstalk",
    "Amazon S3",
    "Amazon VPC",
  ],

  examTips: [
    "Route 53 has a 100% uptime SLA — the only major AWS service with this guarantee",
    "Alias records are free and work at the zone apex; CNAME records do not work at the apex",
    "Failover routing + health checks = automatic disaster recovery at the DNS level",
    "Latency-based routing chooses the AWS region with lowest latency — not just closest geography",
    "Weighted routing is useful for canary deployments — send 10% to new version, 90% to old",
    "Geolocation routing is by user location; Geoproximity is by location with adjustable bias",
    "Private hosted zones provide DNS resolution only within your VPC",
    "Route 53 can also register domain names — full registrar, not just DNS",
  ],

  topicQuiz: [
    {
      question: "What does the '53' in Amazon Route 53 refer to?",
      options: [
        "The number of global edge locations in the original network",
        "The TCP/UDP port number used for DNS traffic",
        "The year the DNS protocol was standardized",
        "The maximum number of routing policies available",
      ],
      correctIndex: 1,
      explanation:
        "The name 'Route 53' refers to TCP/UDP port 53, which is the standard port for DNS traffic.",
    },
    {
      question:
        "Which Route 53 record type maps a domain name to an IPv4 address?",
      options: ["MX record", "Alias record", "CNAME record", "A record"],
      correctIndex: 3,
      explanation:
        "An A record maps a domain name to an IPv4 address (e.g., www.example.com → 93.184.216.34). It is the most common DNS record type.",
    },
    {
      question:
        "A company must route users in Germany to servers in the EU to comply with data residency laws. Which Route 53 routing policy should they use?",
      options: [
        "Failover routing",
        "Geolocation routing",
        "Latency-based routing",
        "Weighted routing",
      ],
      correctIndex: 1,
      explanation:
        "Geolocation routing routes traffic based on the geographic location of the user. It is ideal for data residency requirements, content localization, or legal compliance that requires users from specific countries to hit specific servers.",
    },
    {
      question: "What is a Route 53 hosted zone?",
      options: [
        "A security boundary that restricts DNS access to VPC resources",
        "A caching layer that accelerates DNS resolution for frequently queried domains",
        "A physical server that stores DNS records for a domain",
        "A container for DNS records for a specific domain managed in Route 53",
      ],
      correctIndex: 3,
      explanation:
        "A hosted zone is a container for DNS records for a specific domain. Route 53 automatically creates an NS record and an SOA record in every new hosted zone.",
    },
    {
      question:
        "Which Route 53 routing policy would you use to implement active-passive disaster recovery?",
      options: [
        "Failover routing with health checks monitoring the primary endpoint",
        "Simple routing with two IP addresses listed",
        "Latency-based routing with health checks enabled",
        "Weighted routing with weight 0 on the secondary",
      ],
      correctIndex: 0,
      explanation:
        "Failover routing is designed for active-passive disaster recovery. Route 53 monitors the primary endpoint with health checks and automatically routes traffic to the secondary endpoint when the primary becomes unhealthy.",
    },
    {
      question:
        "Route 53 health checks can monitor which of the following? (Choose the most complete answer)",
      options: [
        "Endpoints, CloudWatch alarms, and other health checks (calculated health checks)",
        "Only HTTP endpoints reachable from the public internet",
        "Only HTTPS endpoints with valid SSL certificates",
        "Only EC2 instances running in the same region as the hosted zone",
      ],
      correctIndex: 0,
      explanation:
        "Route 53 health checks can monitor an endpoint (IP or domain), a CloudWatch alarm (marking the endpoint unhealthy when the alarm fires), or other health checks (calculated health checks that are healthy when N of M child checks are healthy).",
    },
    {
      question:
        "A company registered their domain with a third-party registrar but wants to manage DNS in Route 53. What must they do?",
      options: [
        "Create a hosted zone in Route 53 and update the domain's name servers at the registrar to point to Route 53",
        "Create Alias records at their current registrar pointing to the Route 53 service",
        "Enable domain bridging in the Route 53 console",
        "Transfer the domain registration to Route 53 before creating any DNS records",
      ],
      correctIndex: 0,
      explanation:
        "You can manage DNS in Route 53 without transferring registration. Create a public hosted zone in Route 53, then update the NS (name server) records at your current registrar to the four Route 53 name servers provided for your hosted zone.",
    },
    {
      question:
        "Which statement correctly describes the difference between Geolocation routing and Geoproximity routing in Route 53?",
      options: [
        "Geolocation routes by the IP address; Geoproximity routes by the physical GPS location",
        "Geolocation uses DNS to route; Geoproximity uses BGP routing protocols",
        "Geolocation is for global traffic; Geoproximity is only for traffic within a single AWS region",
        "Geolocation routes based on the user's geographic location; Geoproximity routes based on location with an optional adjustable bias to expand or shrink coverage areas",
      ],
      correctIndex: 3,
      explanation:
        "Geolocation routing routes traffic based on the user's geographic location (e.g., country or continent). Geoproximity routing also considers geographic location but adds a bias parameter that lets you expand or shrink the geographic region served by each resource.",
    },
  ],
};
