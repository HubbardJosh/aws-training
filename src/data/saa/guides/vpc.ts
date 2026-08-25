import { ServiceGuide } from "../../../types/guide";

export const vpcGuide: ServiceGuide = {
  id: "saa-vpc",
  service: "Amazon VPC",
  domain: "deployment",
  tagline:
    "Isolated virtual networks with full control over routing and connectivity",
  intro:
    "Amazon Virtual Private Cloud (VPC) lets you provision a logically isolated section of the AWS cloud where you define your own IP address space, subnets, route tables, internet gateways, and security controls, forming the network foundation for every multi-tier and hybrid architecture.",

  sections: [
    {
      heading: "VPC Design: Subnets, CIDR Blocks, and Availability Zones",
      body: `Every VPC is defined by a primary IPv4 CIDR block, and you subdivide that block into subnets spread across Availability Zones to achieve fault tolerance. Public subnets have a route to an Internet Gateway and are used for resources that must be reachable from the internet — load balancers, NAT Gateways, and bastion hosts. Private subnets have no direct route to the Internet Gateway and host application servers, databases, and internal services. Best practice is to use a /16 VPC CIDR (65,536 addresses) and create subnets of at least /24 per AZ per tier, reserving headroom for future growth. AWS reserves five IP addresses per subnet (first four and last), so factor this into capacity planning. For dual-stack architectures, you can associate an IPv6 /56 CIDR with a VPC and /64 CIDRs with subnets, enabling native IPv6 communication without NAT.`,
    },
    {
      heading: "Internet Connectivity: IGW, NAT Gateway, and Egress-Only IGW",
      body: `An Internet Gateway (IGW) is a horizontally scaled, redundant, highly available VPC component that enables bidirectional IPv4 and IPv6 communication between a VPC and the internet — it is not a single point of failure and requires no bandwidth planning. Resources in public subnets need both a route to the IGW and an Elastic IP or auto-assigned public IP to communicate with the internet. Resources in private subnets that need outbound-only internet access (for software updates, API calls) use a NAT Gateway deployed in a public subnet. NAT Gateway is managed by AWS, scales automatically, and is highly available within an AZ — for cross-AZ fault tolerance, deploy one NAT Gateway per AZ and update each private subnet's route table to use the NAT Gateway in the same AZ. For IPv6, an Egress-Only Internet Gateway provides outbound-only IPv6 connectivity without the complexity of NAT, since IPv6 addresses are globally routable.`,
    },
    {
      heading: "Security: Security Groups and Network ACLs",
      body: `VPC security operates at two layers. Security Groups are stateful virtual firewalls applied to elastic network interfaces (ENIs) — when you allow inbound traffic on a port, the response traffic is automatically allowed outbound. Security Groups support only allow rules, and rules reference other security groups (not just IP ranges), enabling you to allow traffic from any instance in a specific security group without hardcoding IPs. Network ACLs (NACLs) are stateless subnet-level filters evaluated in numbered rule order; both inbound and outbound rules must explicitly allow desired traffic including ephemeral ports (1024–65535) for return traffic. NACLs process rules from lowest number to highest and stop at the first match, so rule order matters. The layered approach — permissive NACLs for broad network control, restrictive Security Groups for per-resource control — provides defense in depth. Security Groups referencing other Security Groups is the recommended pattern for multi-tier architectures (web tier SG allows from ALB SG, app tier SG allows from web tier SG).`,
    },
    {
      heading: "VPC Peering, Transit Gateway, and PrivateLink",
      body: `VPC Peering connects two VPCs (in the same or different accounts/regions) via a private network connection, enabling resources in either VPC to communicate as if on the same network. Peering is non-transitive — if VPC A peers with VPC B and VPC B peers with VPC C, A and C cannot communicate through B and require their own peering connection. For hub-and-spoke architectures with many VPCs, this creates an unmanageable mesh; AWS Transit Gateway solves this by acting as a regional router that any number of VPCs, VPNs, and Direct Connect connections can attach to, with transitive routing handled centrally. AWS PrivateLink (VPC Endpoint Services) creates private connectivity to AWS services or your own services in another VPC without exposing traffic to the public internet — interface endpoints place an ENI in your subnet with a private IP, and gateway endpoints route traffic via the route table for S3 and DynamoDB at no hourly cost.`,
    },
    {
      heading: "Hybrid Connectivity: VPN and Direct Connect",
      body: `Organizations connecting on-premises networks to AWS use either AWS Site-to-Site VPN or AWS Direct Connect. Site-to-Site VPN creates an encrypted IPsec tunnel over the public internet between a Customer Gateway (on-premises VPN device) and a Virtual Private Gateway (attached to the VPC); it is quick to provision but subject to internet variability and bandwidth limits. For consistent, dedicated bandwidth and lower latency, AWS Direct Connect provides a private network connection from an on-premises data center to an AWS Direct Connect location, bypassing the public internet entirely. Direct Connect connections are available in 1 Gbps, 10 Gbps, and 100 Gbps; sub-1 Gbps speeds are available through AWS Direct Connect Partners as hosted connections. For redundancy, the recommended architecture combines Direct Connect as the primary path with a Site-to-Site VPN as a failover, monitored by CloudWatch alarms on connection health.`,
    },
    {
      heading: "VPC Flow Logs and Network Monitoring",
      body: `VPC Flow Logs capture IP traffic metadata flowing to and from network interfaces in your VPC, providing visibility into traffic patterns, security analysis, and troubleshooting rejected connections. Flow logs can be enabled at the VPC, subnet, or ENI level and delivered to Amazon CloudWatch Logs or Amazon S3. Each log record includes source and destination IP and port, protocol, packet count, byte count, action (ACCEPT or REJECT), and log status. Analyzing flow logs in CloudWatch Insights or Athena (for S3-delivered logs) helps identify unexpected traffic, anomalous egress patterns, and security group misconfiguration. AWS Network Manager and Reachability Analyzer complement flow logs by providing topology visualization and automated path analysis to verify or diagnose connectivity between any two resources in your VPC without sending actual traffic.`,
    },
  ],

  keyFacts: [
    "Public subnets have a route to an Internet Gateway; private subnets do not",
    "AWS reserves 5 IP addresses per subnet (first four + last one)",
    "NAT Gateway is managed, AZ-specific — deploy one per AZ for fault tolerance",
    "Security Groups are stateful (return traffic automatic) and support only allow rules",
    "Network ACLs are stateless, ordered, and support both allow and deny rules",
    "VPC Peering is non-transitive — use Transit Gateway for hub-and-spoke topologies",
    "Interface VPC Endpoints use PrivateLink (ENI in subnet); Gateway Endpoints use route tables (S3/DynamoDB only)",
    "Site-to-Site VPN is encrypted over internet; Direct Connect is dedicated private connectivity",
    "VPC Flow Logs capture traffic metadata — delivered to CloudWatch Logs or S3",
    "Security Group referencing another SG is the multi-tier security best practice",
  ],

  relatedServices: [
    "AWS Transit Gateway",
    "AWS Direct Connect",
    "Elastic Load Balancing",
    "Amazon Route 53",
    "AWS PrivateLink",
    "Amazon CloudWatch",
  ],

  examTips: [
    "For multi-VPC connectivity at scale, always prefer Transit Gateway over full-mesh peering",
    "NAT Gateway is per-AZ — one per AZ prevents cross-AZ traffic charges and eliminates AZ dependency",
    "NACLs evaluate rules in order and stop at the first match — rule order matters critically",
    "Gateway endpoints (S3 and DynamoDB) are free; interface endpoints have hourly costs",
    "VPC peering works across regions and accounts but is always non-transitive",
    "Direct Connect + VPN failover is the recommended hybrid connectivity resilience pattern",
    "Ephemeral ports (1024–65535) must be explicitly allowed in NACL outbound rules for return traffic",
    "Egress-Only Internet Gateway is for IPv6 outbound-only — there is no IPv6 equivalent of NAT",
  ],
};
