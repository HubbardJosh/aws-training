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
      quiz: [
        {
          question:
            "How many IP addresses does AWS reserve in every VPC subnet?",
          options: [
            "5 addresses (first four and last)",
            "8 addresses for network overhead",
            "2 addresses (first and last)",
            "3 addresses (first, second, and last)",
          ],
          correctIndex: 0,
          explanation:
            "AWS reserves 5 IP addresses in every subnet: the network address (first), the VPC router (second), the DNS server (third), reserved for future use (fourth), and the broadcast address (last). A /28 subnet with 16 addresses only has 11 usable addresses after these 5 are reserved. This must be factored into subnet sizing.",
        },
        {
          question:
            "What distinguishes a public subnet from a private subnet in a VPC?",
          options: [
            "Public subnets are in different Availability Zones than private subnets",
            "Public subnets use larger CIDR blocks than private subnets",
            "Public subnets have a route to an Internet Gateway; private subnets do not",
            "Public subnets allow all inbound traffic; private subnets block all inbound traffic",
          ],
          correctIndex: 2,
          explanation:
            "The defining characteristic of a public subnet is a route to an Internet Gateway (IGW) in its route table. This route allows resources with public IP addresses to communicate bidirectionally with the internet. Private subnets have no route to the IGW, making their resources inaccessible from the internet directly.",
        },
      ],
    },
    {
      heading: "Internet Connectivity: IGW, NAT Gateway, and Egress-Only IGW",
      body: `An Internet Gateway (IGW) is a horizontally scaled, redundant, highly available VPC component that enables bidirectional IPv4 and IPv6 communication between a VPC and the internet — it is not a single point of failure and requires no bandwidth planning. Resources in public subnets need both a route to the IGW and an Elastic IP or auto-assigned public IP to communicate with the internet. Resources in private subnets that need outbound-only internet access (for software updates, API calls) use a NAT Gateway deployed in a public subnet. NAT Gateway is managed by AWS, scales automatically, and is highly available within an AZ — for cross-AZ fault tolerance, deploy one NAT Gateway per AZ and update each private subnet's route table to use the NAT Gateway in the same AZ. For IPv6, an Egress-Only Internet Gateway provides outbound-only IPv6 connectivity without the complexity of NAT, since IPv6 addresses are globally routable.`,
      quiz: [
        {
          question:
            "EC2 instances in private subnets across three Availability Zones need outbound internet access for software updates. How should NAT Gateways be deployed for high availability and cost efficiency?",
          options: [
            "One NAT Gateway per AZ, each in a public subnet, with each AZ's private subnets routing to their local NAT Gateway",
            "One NAT Gateway in a single public subnet shared by all private subnets",
            "One NAT Gateway per private subnet for maximum redundancy",
            "No NAT Gateway needed — use VPC endpoints for all internet traffic",
          ],
          correctIndex: 0,
          explanation:
            "Deploying one NAT Gateway per AZ ensures that each AZ's private subnets route outbound traffic to their local NAT Gateway. If one AZ fails, the other AZs' NAT Gateways continue working independently. A single shared NAT Gateway creates an AZ dependency — if its AZ fails, all private subnets lose internet access and cross-AZ traffic incurs data transfer costs.",
        },
        {
          question:
            "Which VPC component provides outbound-only IPv6 internet connectivity for resources in private subnets?",
          options: [
            "NAT Gateway with IPv6 support enabled",
            "Internet Gateway with IPv6 routing",
            "IPv6 VPC endpoint",
            "Egress-Only Internet Gateway",
          ],
          correctIndex: 3,
          explanation:
            "An Egress-Only Internet Gateway provides outbound-only IPv6 connectivity for resources in private subnets. Since IPv6 addresses are globally routable (unlike IPv4 private addresses), NAT is not needed — but you still want to prevent unsolicited inbound connections. The Egress-Only IGW allows outbound IPv6 traffic while blocking inbound-initiated connections.",
        },
        {
          question:
            "An Internet Gateway is attached to a VPC, but an EC2 instance in a public subnet cannot communicate with the internet. What is the most likely missing configuration?",
          options: [
            "The instance needs an Elastic IP or public IP address assigned",
            "The VPC needs a second Internet Gateway for redundancy",
            "The instance needs a security group rule allowing all outbound traffic",
            "The instance needs to be in a different Availability Zone",
          ],
          correctIndex: 0,
          explanation:
            "For an EC2 instance in a public subnet to communicate with the internet, it needs both a route to the Internet Gateway in the subnet's route table AND a public IP address (either auto-assigned or an Elastic IP). Without a public IP, the instance has no internet-routable address even though the route exists.",
        },
      ],
    },
    {
      heading: "Security: Security Groups and Network ACLs",
      body: `VPC security operates at two layers. Security Groups are stateful virtual firewalls applied to elastic network interfaces (ENIs) — when you allow inbound traffic on a port, the response traffic is automatically allowed outbound. Security Groups support only allow rules, and rules reference other security groups (not just IP ranges), enabling you to allow traffic from any instance in a specific security group without hardcoding IPs. Network ACLs (NACLs) are stateless subnet-level filters evaluated in numbered rule order; both inbound and outbound rules must explicitly allow desired traffic including ephemeral ports (1024–65535) for return traffic. NACLs process rules from lowest number to highest and stop at the first match, so rule order matters. The layered approach — permissive NACLs for broad network control, restrictive Security Groups for per-resource control — provides defense in depth. Security Groups referencing other Security Groups is the recommended pattern for multi-tier architectures (web tier SG allows from ALB SG, app tier SG allows from web tier SG).`,
      quiz: [
        {
          question:
            "An administrator adds an inbound rule to a Security Group allowing TCP port 443. Does she also need to add an outbound rule for the response traffic?",
          options: [
            "Yes — Security Groups require both inbound and outbound rules for bidirectional traffic",
            "Yes — only HTTPS requires explicit outbound rules; HTTP does not",
            "No — Security Groups are stateful; response traffic is automatically allowed",
            "No — but only if the default outbound allow-all rule has not been modified",
          ],
          correctIndex: 2,
          explanation:
            "Security Groups are stateful — they track connection state and automatically allow return traffic for established connections. An inbound allow rule on port 443 means the response traffic is automatically allowed outbound without an explicit outbound rule. This is the key difference from NACLs, which are stateless and require explicit rules in both directions.",
        },
        {
          question:
            "A Network ACL has two rules: Rule 100 allows all TCP traffic, and Rule 200 denies all TCP traffic. A new inbound request arrives on port 80. What is the result?",
          options: [
            "Denied — the deny rule takes precedence regardless of order",
            "Denied — NACLs always process deny rules before allow rules",
            "Allowed — Rule 100 matches first and its action (Allow) applies",
            "Allowed — NACLs require explicit denies that override all allows",
          ],
          correctIndex: 2,
          explanation:
            "NACLs evaluate rules in ascending numeric order and stop at the first matching rule. Rule 100 (Allow all TCP) is evaluated before Rule 200 (Deny all TCP). Since Rule 100 matches port 80 traffic, the Allow action applies and Rule 200 is never evaluated. Rule ordering is critical in NACL design.",
        },
        {
          question:
            "Why must NACL outbound rules explicitly allow ephemeral ports (1024–65535) for return traffic from web servers?",
          options: [
            "Because Security Groups block ephemeral ports by default",
            "Because NACLs are stateless and do not track connection state — both directions must be explicitly allowed",
            "Because web servers use ephemeral ports for initial connection establishment",
            "Because the Internet Gateway blocks ephemeral ports unless explicitly allowed",
          ],
          correctIndex: 1,
          explanation:
            "NACLs are stateless — they do not track connection state and evaluate each packet independently. When a client connects to a web server on port 80, the server's response goes back on the client's ephemeral port (1024–65535). Without an outbound NACL rule allowing these ephemeral ports, the response packets are blocked. Security Groups handle this automatically due to statefulness.",
        },
      ],
    },
    {
      heading: "VPC Peering, Transit Gateway, and PrivateLink",
      body: `VPC Peering connects two VPCs (in the same or different accounts/regions) via a private network connection, enabling resources in either VPC to communicate as if on the same network. Peering is non-transitive — if VPC A peers with VPC B and VPC B peers with VPC C, A and C cannot communicate through B and require their own peering connection. For hub-and-spoke architectures with many VPCs, this creates an unmanageable mesh; AWS Transit Gateway solves this by acting as a regional router that any number of VPCs, VPNs, and Direct Connect connections can attach to, with transitive routing handled centrally. AWS PrivateLink (VPC Endpoint Services) creates private connectivity to AWS services or your own services in another VPC without exposing traffic to the public internet — interface endpoints place an ENI in your subnet with a private IP, and gateway endpoints route traffic via the route table for S3 and DynamoDB at no hourly cost.`,
      quiz: [
        {
          question:
            "VPC A is peered with VPC B, and VPC B is peered with VPC C. Can resources in VPC A communicate with resources in VPC C through VPC B?",
          options: [
            "No — VPC peering is non-transitive; A and C need their own direct peering connection",
            "Yes — VPC peering supports transitive routing through intermediate VPCs",
            "Yes — if Transit Gateway is enabled on VPC B",
            "No — transitive routing requires Direct Connect, not VPC peering",
          ],
          correctIndex: 0,
          explanation:
            "VPC peering is non-transitive. Even though A-B and B-C are peered, traffic from A cannot route through B to reach C. For A to communicate with C, a direct peering connection between A and C must be established. For architectures with many VPCs, this creates a complex full-mesh requirement — Transit Gateway is the solution for hub-and-spoke topologies.",
        },
        {
          question:
            "A company has 50 VPCs across multiple accounts and needs all of them to communicate with each other and with on-premises networks. Which service avoids a complex full-mesh peering topology?",
          options: [
            "VPN connections between each pair of VPCs",
            "AWS PrivateLink with interface endpoints in each VPC",
            "AWS Transit Gateway acting as a central regional router",
            "VPC Peering with 50×49/2 = 1,225 peering connections",
          ],
          correctIndex: 2,
          explanation:
            "AWS Transit Gateway acts as a central hub that all VPCs, VPN connections, and Direct Connect attachments connect to. It handles transitive routing, eliminating the need for full-mesh peering. With 50 VPCs, a full mesh would require 1,225 peering connections; Transit Gateway requires only 50 attachments.",
        },
        {
          question:
            "Which VPC endpoint type is available for Amazon S3 and Amazon DynamoDB and adds no hourly cost?",
          options: [
            "Interface endpoint (PrivateLink)",
            "Gateway endpoint",
            "Service endpoint",
            "Transit endpoint",
          ],
          correctIndex: 1,
          explanation:
            "Gateway endpoints for S3 and DynamoDB are free — there is no hourly charge. They add an entry to the route table directing S3 or DynamoDB traffic through the gateway endpoint, keeping it within the AWS network. Interface endpoints (PrivateLink) are used for most other AWS services and have an hourly charge per AZ plus data processing fees.",
        },
      ],
    },
    {
      heading: "Hybrid Connectivity: VPN and Direct Connect",
      body: `Organizations connecting on-premises networks to AWS use either AWS Site-to-Site VPN or AWS Direct Connect. Site-to-Site VPN creates an encrypted IPsec tunnel over the public internet between a Customer Gateway (on-premises VPN device) and a Virtual Private Gateway (attached to the VPC); it is quick to provision but subject to internet variability and bandwidth limits. For consistent, dedicated bandwidth and lower latency, AWS Direct Connect provides a private network connection from an on-premises data center to an AWS Direct Connect location, bypassing the public internet entirely. Direct Connect connections are available in 1 Gbps, 10 Gbps, and 100 Gbps; sub-1 Gbps speeds are available through AWS Direct Connect Partners as hosted connections. For redundancy, the recommended architecture combines Direct Connect as the primary path with a Site-to-Site VPN as a failover, monitored by CloudWatch alarms on connection health.`,
      quiz: [
        {
          question:
            "A company needs a dedicated private network connection to AWS with consistent bandwidth and low latency for a mission-critical application. Which hybrid connectivity option provides this?",
          options: [
            "AWS Site-to-Site VPN over the public internet",
            "AWS Client VPN for individual user access",
            "VPC peering with the on-premises network",
            "AWS Direct Connect with a dedicated private circuit",
          ],
          correctIndex: 3,
          explanation:
            "AWS Direct Connect provides a dedicated, private physical connection from an on-premises data center to an AWS Direct Connect location, bypassing the public internet. This delivers consistent bandwidth, low latency, and predictable network performance required for mission-critical applications. Site-to-Site VPN uses the public internet and is subject to variability and bandwidth limits.",
        },
        {
          question:
            "What is the recommended architecture for hybrid connectivity that provides both performance and redundancy?",
          options: [
            "Multiple Direct Connect connections without any VPN backup",
            "Direct Connect only — VPN adds unnecessary complexity",
            "Two Site-to-Site VPN connections for active-active redundancy",
            "Direct Connect as the primary path with Site-to-Site VPN as a failover",
          ],
          correctIndex: 3,
          explanation:
            "The recommended pattern combines Direct Connect as the primary path (for consistent performance) with a Site-to-Site VPN as an automatic failover. CloudWatch alarms monitor the Direct Connect connection health and trigger failover to the VPN if the Direct Connect circuit fails. This provides both performance (Direct Connect) and resilience (VPN backup).",
        },
      ],
    },
    {
      heading: "VPC Flow Logs and Network Monitoring",
      body: `VPC Flow Logs capture IP traffic metadata flowing to and from network interfaces in your VPC, providing visibility into traffic patterns, security analysis, and troubleshooting rejected connections. Flow logs can be enabled at the VPC, subnet, or ENI level and delivered to Amazon CloudWatch Logs or Amazon S3. Each log record includes source and destination IP and port, protocol, packet count, byte count, action (ACCEPT or REJECT), and log status. Analyzing flow logs in CloudWatch Insights or Athena (for S3-delivered logs) helps identify unexpected traffic, anomalous egress patterns, and security group misconfiguration. AWS Network Manager and Reachability Analyzer complement flow logs by providing topology visualization and automated path analysis to verify or diagnose connectivity between any two resources in your VPC without sending actual traffic.`,
      quiz: [
        {
          question:
            "A security team needs to investigate rejected connection attempts to EC2 instances over the past week. Which VPC feature provides this visibility?",
          options: [
            "AWS Config rules tracking security group changes",
            "CloudWatch metrics for EC2 network I/O",
            "CloudTrail logs for EC2 API calls",
            "VPC Flow Logs with REJECT records delivered to CloudWatch Logs or S3",
          ],
          correctIndex: 3,
          explanation:
            "VPC Flow Logs capture metadata for all traffic to and from ENIs, including the action field (ACCEPT or REJECT). Rejected connection attempts appear as REJECT records and can be queried in CloudWatch Logs Insights or Amazon Athena (for S3-delivered logs) to investigate the source IPs, ports, and timing of rejected traffic.",
        },
        {
          question: "At which levels can VPC Flow Logs be enabled?",
          options: [
            "Only at the VPC level",
            "At the region or Availability Zone level",
            "Only at the security group level",
            "At the VPC, subnet, or individual ENI level",
          ],
          correctIndex: 3,
          explanation:
            "VPC Flow Logs can be enabled at three granularity levels: the entire VPC (captures all ENIs in the VPC), a specific subnet (captures all ENIs in that subnet), or an individual ENI. Finer granularity allows you to focus on specific resources for cost control and targeted troubleshooting.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "How many IP addresses does AWS reserve in a /24 subnet (256 total addresses)?",
      options: ["8 addresses", "5 addresses", "3 addresses", "2 addresses"],
      correctIndex: 1,
      explanation:
        "AWS reserves 5 IP addresses in every subnet regardless of size: the network address, VPC router, DNS server, one reserved for future use, and the broadcast address. A /24 subnet has 256 total addresses minus 5 reserved = 251 usable addresses.",
    },
    {
      question:
        "Private subnets in three AZs need outbound internet access. How should NAT Gateways be deployed for fault tolerance?",
      options: [
        "One NAT Gateway in a single public subnet, shared across all AZs",
        "NAT Gateways are not needed — use VPC endpoints instead",
        "One NAT Gateway per private subnet for maximum redundancy",
        "One NAT Gateway per AZ in a public subnet, each AZ's private subnets routing locally",
      ],
      correctIndex: 3,
      explanation:
        "Deploying one NAT Gateway per AZ ensures each AZ's private subnets use a local NAT Gateway. If one AZ fails, only that AZ loses internet access — other AZs continue operating independently. A single shared NAT Gateway creates a single point of failure and causes cross-AZ data transfer charges.",
    },
    {
      question:
        "A Security Group has an inbound rule allowing port 443. Is an explicit outbound rule needed for HTTPS response traffic?",
      options: [
        "Yes — Security Groups require matching outbound rules",
        "Yes — only for NACLs is response traffic automatic",
        "No — but only if the default outbound allow-all rule is present",
        "No — Security Groups are stateful and automatically allow response traffic",
      ],
      correctIndex: 3,
      explanation:
        "Security Groups are stateful — they track connection state and automatically allow response traffic for established connections. An inbound allow on port 443 means HTTPS responses are automatically permitted outbound. This contrasts with NACLs, which are stateless and require explicit rules in both directions.",
    },
    {
      question:
        "VPC A is peered with VPC B, and VPC B is peered with VPC C. Can VPC A reach VPC C?",
      options: [
        "Yes — if Transit Gateway is enabled in VPC B",
        "No — peering only works within the same account",
        "Yes — peering is transitive through intermediate VPCs",
        "No — VPC peering is non-transitive; direct peering between A and C is required",
      ],
      correctIndex: 3,
      explanation:
        "VPC peering is non-transitive. A-B and B-C peering connections do not allow A to reach C through B. A separate A-C peering connection is required. For architectures with many VPCs, Transit Gateway is the scalable solution as it handles transitive routing centrally.",
    },
    {
      question:
        "Which AWS service acts as a central regional router enabling transitive routing between many VPCs and on-premises networks?",
      options: [
        "AWS Direct Connect with multiple virtual interfaces",
        "VPC Peering with route propagation",
        "AWS PrivateLink with interface endpoints",
        "AWS Transit Gateway",
      ],
      correctIndex: 3,
      explanation:
        "AWS Transit Gateway is a regional network hub that VPCs, VPN connections, and Direct Connect attachments connect to. It enables transitive routing so any attached network can communicate with any other, eliminating the need for complex full-mesh peering topologies. It significantly simplifies multi-VPC and hybrid architectures.",
    },
    {
      question:
        "What is the key difference between Security Groups and Network ACLs?",
      options: [
        "NACLs apply to individual ENIs; Security Groups apply to entire subnets",
        "Security Groups are evaluated after NACLs in the traffic flow",
        "Security Groups support deny rules; NACLs support only allow rules",
        "Security Groups are stateful (auto-allow return traffic); NACLs are stateless (both directions must be explicitly allowed)",
      ],
      correctIndex: 3,
      explanation:
        "The fundamental difference is statefulness: Security Groups track connection state and automatically allow response traffic; NACLs do not track state and require explicit rules for both inbound and outbound traffic (including ephemeral ports for return traffic). Security Groups apply to ENIs; NACLs apply to subnets. Both are evaluated — NACLs at the subnet boundary, Security Groups at the ENI.",
    },
    {
      question:
        "Which VPC endpoint type is free and available only for Amazon S3 and Amazon DynamoDB?",
      options: [
        "Gateway endpoint",
        "Interface endpoint (PrivateLink)",
        "Regional endpoint",
        "Service endpoint",
      ],
      correctIndex: 0,
      explanation:
        "Gateway endpoints for S3 and DynamoDB are free — there is no hourly charge or data processing fee. They work by adding a route to the subnet route table directing S3/DynamoDB traffic through the endpoint, keeping it on the AWS network. Interface endpoints (PrivateLink) serve all other AWS services and have per-AZ hourly charges.",
    },
    {
      question:
        "What is the recommended hybrid connectivity architecture that provides consistent performance AND redundancy for on-premises to AWS connectivity?",
      options: [
        "Direct Connect as primary with Site-to-Site VPN as automatic failover",
        "Two Site-to-Site VPN tunnels in active-active mode",
        "Direct Connect only — additional VPN connections add cost without benefit",
        "Two Direct Connect connections without any VPN backup",
      ],
      correctIndex: 0,
      explanation:
        "The recommended pattern is Direct Connect as the primary path (for consistent bandwidth and low latency) with a Site-to-Site VPN as an automatic failover. CloudWatch alarms monitor Direct Connect health and trigger automatic BGP failover to the VPN if the Direct Connect circuit fails. This provides both performance and resilience.",
    },
  ],
};
