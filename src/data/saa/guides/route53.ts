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
    },
    {
      heading: "Routing Policies",
      body: `Route 53 supports several routing policies that determine how DNS queries are answered. Simple routing returns a single resource with no health check integration — appropriate for single-resource configurations. Weighted routing distributes traffic across multiple resources proportionally by weight, enabling A/B testing and gradual traffic shifting between application versions. Latency-based routing directs users to the AWS region that provides the lowest latency for their location, improving global application response times. Failover routing actively monitors health checks and routes traffic to a primary resource; if the primary is unhealthy, traffic automatically switches to a secondary resource. Geolocation routing sends users to specific endpoints based on the geographic location of the DNS query, enabling content localization and data residency compliance. Geoproximity routing (part of Traffic Flow) routes based on geographic location with a configurable bias to shift more or less traffic to specific resources. Multi-value answer routing returns multiple healthy IP addresses (up to eight), improving availability through client-side load balancing.`,
    },
    {
      heading: "Health Checks and DNS Failover",
      body: `Route 53 health checks monitor the health of endpoints and can trigger automatic DNS failover. HTTP, HTTPS, and TCP health checks probe a specified endpoint at configurable intervals (30 seconds or 10 seconds for fast checks) from Route 53 health checking locations distributed globally — an endpoint is considered healthy only if a threshold percentage of health checkers report it as healthy. Calculated health checks aggregate the health of multiple child health checks using Boolean logic (AND/OR), enabling complex health evaluation across multiple components. CloudWatch alarm health checks monitor a CloudWatch metric (like a DLQ depth or error rate) rather than an HTTP endpoint, enabling health-check-based failover for non-HTTP workloads. For private resources inside a VPC that Route 53 health checkers cannot reach, use CloudWatch alarms that monitor the resource and a health check that evaluates the alarm state. Active-active failover uses weighted or latency routing with health checks on all endpoints; active-passive failover uses explicit failover routing with a primary and a standby.`,
    },
    {
      heading: "Multi-Region Architecture Patterns",
      body: `Route 53 is the global traffic manager that ties together multi-region active-active and active-passive architectures. In an active-active architecture, latency-based routing directs users to the nearest healthy region — both regions serve traffic simultaneously, and if one region's health checks fail, Route 53 automatically routes all traffic to the remaining healthy region. In an active-passive architecture, failover routing designates one region as primary and another as secondary; the secondary only receives traffic when the primary's health checks fail. For disaster recovery, the combination of Route 53 failover routing, Aurora Global Database, and S3 Cross-Region Replication provides a comprehensive strategy with RPO in seconds and RTO in minutes. Route 53 also enables blue/green deployments at the DNS level by shifting weighted routing from 100% to the old environment to 100% to the new environment gradually while monitoring error rates.`,
    },
    {
      heading: "Private Hosted Zones and Hybrid DNS",
      body: `Private hosted zones resolve DNS queries only within associated VPCs, enabling custom domain names for internal services (e.g., \`api.internal.mycompany.com\`) without exposing them to the public internet. A private hosted zone can be associated with VPCs in multiple accounts using cross-account associations. Hybrid DNS extends on-premises name resolution to Route 53 and vice versa using Route 53 Resolver. Route 53 Resolver Inbound Endpoints accept DNS queries from on-premises networks forwarded through Direct Connect or VPN, allowing on-premises systems to resolve AWS private hosted zone records. Route 53 Resolver Outbound Endpoints forward DNS queries for specific domains from within VPCs to on-premises DNS servers, enabling EC2 instances to resolve on-premises hostnames without deploying a custom DNS forwarder. Resolver DNS Firewall filters outbound DNS queries from VPCs, blocking resolution of known-malicious domains for DNS-layer security.`,
    },
    {
      heading: "Domain Registration and Route 53 Resolver",
      body: `Route 53 functions as a domain registrar, allowing you to purchase and manage domain names directly from the AWS console. Route 53 automatically creates a hosted zone when you register a domain and configures the domain's NS records to point to the Route 53 name servers for that zone. Domain registration is separate from hosted zone management — you can register a domain with Route 53 but use another DNS provider for the hosted zone, or vice versa (register with another registrar and delegate to Route 53 name servers). Route 53's 100% availability SLA for hosted zones is backed by the anycast routing of Route 53 name servers — queries are answered by the geographically nearest Route 53 name server, reducing DNS query latency globally. DNSSEC signing is supported for both registered domains and hosted zones to protect against DNS spoofing attacks.`,
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
};
