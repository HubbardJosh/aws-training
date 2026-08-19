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
    },
    {
      heading: "Domain Registration and Hosted Zones",
      body: `Route 53 is a full-service domain registrar, meaning you can register new domain names (like \`myapp.com\`) directly through AWS. Route 53 supports hundreds of TLDs (\`.com\`, \`.net\`, \`.org\`, \`.io\`, and many more). Domain registration fees vary by TLD.

Once you have a domain (either registered through Route 53 or transferred from another registrar), you manage its DNS records in a **hosted zone**. A hosted zone is a container for DNS records for a specific domain. Route 53 automatically creates two records in every hosted zone: an **NS record** (name servers — the Route 53 servers authoritative for your domain) and an **SOA record** (start of authority).

A **public hosted zone** manages DNS records accessible from the internet. A **private hosted zone** manages DNS records accessible only within one or more specified VPCs — useful for internal service discovery where you do not want your service endpoints publicly resolvable.

Route 53's integration with other AWS services makes it the natural DNS solution for AWS architectures. Using Alias records, you can point your domain directly to CloudFront distributions, Application Load Balancers, S3 website endpoints, and Elastic Beanstalk environments without managing changing IP addresses.`,
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
};
