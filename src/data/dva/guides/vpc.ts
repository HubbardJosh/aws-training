import { ServiceGuide } from "../../../types/guide";

export const vpcGuide: ServiceGuide = {
  id: "amazon-vpc",
  service: "Amazon VPC",
  domain: "development",
  tagline: "Isolated virtual network for your AWS resources",
  intro:
    "Amazon VPC (Virtual Private Cloud) lets you launch AWS resources into a logically isolated virtual network that you define. You control IP address ranges, subnets, route tables, internet gateways, NAT gateways, security groups, and network ACLs — providing full control over your network topology.",

  sections: [
    {
      heading: "Core Components",
      body: `A **VPC** is a logically isolated virtual network tied to a specific region. You define a CIDR block (typically something like \`10.0.0.0/16\`) that provides the IP address range for everything inside the VPC. You can have up to 5 VPCs per region by default, though this limit can be raised.

Within a VPC, **subnets** carve the address space into smaller ranges, each tied to a single Availability Zone. A subnet is **public** if its route table has a route sending internet-bound traffic (\`0.0.0.0/0\`) to an **Internet Gateway (IGW)** — the managed resource that enables bidirectional communication between the VPC and the public internet. A subnet is **private** if no such route exists: instances in a private subnet cannot receive inbound traffic from the internet and cannot initiate outbound connections to it directly.

Private subnets need a **NAT Gateway** to initiate outbound internet connections — for software updates, calling external APIs, or pulling container images from DockerHub. The NAT Gateway lives in a public subnet and translates private IP addresses to its own public IP for outbound connections, while blocking all unsolicited inbound traffic. For high availability, deploy one NAT Gateway per Availability Zone — a single NAT Gateway is a single point of failure for outbound connectivity from private subnets in its AZ.

**VPC Endpoints** allow resources inside your VPC to reach AWS services without the traffic ever leaving the AWS network. **Gateway endpoints** add a route table entry pointing to S3 or DynamoDB — the only two services they support — and are completely free. **Interface endpoints** (AWS PrivateLink) create an Elastic Network Interface with a private IP in your subnet for most other AWS services. Interface endpoints cost per hour and per GB of data processed but eliminate the need for NAT Gateway for traffic to AWS services, which can result in meaningful cost savings at scale.`,
      quiz: [
        {
          question: "What makes a subnet 'public' in a VPC?",
          options: [
            "The subnet is explicitly tagged with `Type=Public` in the AWS console",
            "The subnet's route table has a route for `0.0.0.0/0` pointing to an Internet Gateway",
            "The subnet is assigned public IPv4 addresses automatically by AWS",
            "The subnet has a Network ACL rule allowing all inbound traffic",
          ],
          correctIndex: 1,
          explanation:
            "A subnet is public when its associated route table contains a route sending internet-bound traffic (`0.0.0.0/0`) to an Internet Gateway. The IGW enables bidirectional communication with the public internet. Without this route, instances in the subnet cannot send or receive internet traffic regardless of their IP addresses, making the subnet private.",
        },
        {
          question:
            "A company runs workloads in three Availability Zones, all in private subnets. They deploy a single NAT Gateway in AZ-A. What is the risk of this configuration?",
          options: [
            "Traffic from AZ-B and AZ-C crosses AZ boundaries to reach the NAT Gateway, adding latency and cross-AZ data transfer costs; AZ-A failure eliminates outbound internet for all three AZs",
            "NAT Gateways cannot serve traffic from other Availability Zones by design",
            "The single NAT Gateway will be throttled because it serves three AZs simultaneously",
            "Private subnets in AZ-B and AZ-C will not be able to route to the NAT Gateway without VPC peering",
          ],
          correctIndex: 0,
          explanation:
            "A single NAT Gateway in one AZ is a single point of failure: if that AZ experiences an outage, instances in all three AZs lose outbound internet connectivity. Additionally, traffic from AZ-B and AZ-C must cross AZ boundaries to reach the NAT Gateway, incurring cross-AZ data transfer charges. Best practice is to deploy one NAT Gateway per AZ.",
        },
        {
          question:
            "Which two AWS services are supported by VPC Gateway endpoints, and what is the cost?",
          options: [
            "S3 and EC2; gateway endpoints cost $0.01 per GB processed",
            "S3 and DynamoDB; gateway endpoints are free",
            "S3 and SQS; gateway endpoints cost per hour like interface endpoints",
            "DynamoDB and RDS; gateway endpoints are free but require PrivateLink",
          ],
          correctIndex: 1,
          explanation:
            "Gateway endpoints support only Amazon S3 and Amazon DynamoDB, and they are completely free — there is no hourly charge and no data processing fee. They work by adding a route table entry in the VPC, keeping all traffic to these services on the AWS private network without requiring a NAT Gateway. Interface endpoints (PrivateLink) support most other AWS services but cost per hour and per GB.",
        },
      ],
    },
    {
      heading: "Security Groups vs NACLs",
      body: `VPC provides two distinct firewall mechanisms at different levels of the network stack, and they work together to provide defense in depth.

**Security Groups** operate at the instance level — specifically at the Elastic Network Interface attached to each instance, task, or Lambda function. They are **stateful**, meaning that if you allow an inbound connection, the return traffic is automatically allowed without any explicit outbound rule. Security groups only have allow rules; there is no way to explicitly deny traffic to a specific source with a security group. When a packet arrives, all rules are evaluated simultaneously and the connection is allowed if any rule matches. The ability to reference another security group as a source (rather than a CIDR range) is particularly powerful: you can write rules like "allow inbound on port 5432 from the application-tier security group" which automatically covers all instances in that group regardless of their IP addresses.

**Network ACLs (NACLs)** operate at the subnet level, applying to all traffic entering or leaving the subnet regardless of which instance it's destined for. NACLs are **stateless**: a rule allowing inbound traffic does not automatically allow the response — you must explicitly add outbound rules for return traffic. NACLs support both allow and deny rules, and rules are evaluated in order from lowest rule number to highest, with the first matching rule applied. This rule-ordering behavior is important: a deny rule at rule number 100 blocks traffic even if an allow rule at rule number 200 would otherwise permit it.

In practice, security groups handle the day-to-day traffic filtering for most architectures, and NACLs serve as an additional layer for subnet-wide restrictions — particularly useful for blocking known malicious IP ranges at the subnet level with explicit deny rules that security groups can't express.`,
      quiz: [
        {
          question:
            "A security group allows inbound TCP on port 443. A user makes an HTTPS request to an EC2 instance in that security group. Do you need an explicit outbound rule to allow the response traffic?",
          options: [
            "Yes — security groups are stateless, so return traffic must be explicitly allowed",
            "No — security groups are stateful, so return traffic for allowed inbound connections is automatically permitted",
            "Yes — you need an outbound rule allowing TCP on ephemeral ports 1024–65535",
            "No — but only if the default outbound rule (allow all) is present",
          ],
          correctIndex: 1,
          explanation:
            "Security groups are stateful: when an inbound connection is allowed, the corresponding return traffic is automatically permitted without any explicit outbound rule. This is a fundamental difference from NACLs, which are stateless and require explicit rules for both directions. The statefulness of security groups makes them easier to manage for typical application traffic patterns.",
        },
        {
          question:
            "A NACL has rule 100 that denies all traffic from `203.0.113.0/24` and rule 200 that allows all traffic. A request arrives from `203.0.113.5`. What happens?",
          options: [
            "The request is allowed because rule 200 permits all traffic and overrides the deny",
            "The request is denied because NACL rules are evaluated lowest-number-first and rule 100 (deny) matches before rule 200 (allow)",
            "The request is allowed because deny rules require explicit confirmation before taking effect",
            "The behavior is undefined — conflicting NACL rules are resolved by the subnet's route table",
          ],
          correctIndex: 1,
          explanation:
            "NACL rules are evaluated in ascending order by rule number, and the first matching rule is applied — no further rules are checked. Rule 100 (deny `203.0.113.0/24`) matches first for traffic from `203.0.113.5`, so the request is denied. Rule 200 is never reached. This ordered evaluation makes the placement of deny rules critical — they must have lower rule numbers than the allow rules they are meant to override.",
        },
        {
          question:
            "An application security group needs to allow its RDS database to accept connections from the application tier, regardless of which specific IP addresses the application instances use. What is the most robust way to configure the RDS security group's inbound rule?",
          options: [
            "Allow inbound on port 5432 from the VPC CIDR block (e.g., `10.0.0.0/16`)",
            "Allow inbound on port 5432 from each application instance's private IP address",
            "Allow inbound on port 5432 referencing the application tier's security group ID as the source",
            "Allow all inbound traffic from within the VPC and rely on the application-tier NACL for filtering",
          ],
          correctIndex: 2,
          explanation:
            "Referencing another security group as the source (rather than a CIDR block or specific IP addresses) is the most robust approach. The rule automatically covers all current and future instances in the application-tier security group, regardless of their IP addresses. This is more precise than using the VPC CIDR (which would allow any resource in the VPC to connect) and eliminates the maintenance burden of tracking individual IP addresses.",
        },
      ],
    },
    {
      heading: "VPC Peering & Connectivity",
      body: `When you need to connect multiple VPCs or connect your on-premises network to AWS, several connectivity options exist with different performance, cost, and complexity characteristics.

**VPC Peering** establishes a private connection between two VPCs, allowing traffic to flow between them using private IP addresses without traversing the public internet. Traffic stays on the AWS backbone. After creating the peering connection, you must add route table entries in both VPCs and update security groups to allow traffic from the peer's CIDR range. The critical limitation is that peering is not transitive: if VPC A peers with VPC B and VPC B peers with VPC C, traffic from A cannot reach C via B. For architectures with many VPCs that need full connectivity, **AWS Transit Gateway** solves the transitivity problem by acting as a regional hub. Every VPC connects to the Transit Gateway, and routes flow through it to any other connected VPC or on-premises network. Transit Gateway supports thousands of attachments and enables complex routing topologies that VPC peering can't express.

For connecting on-premises networks to AWS, two options exist with very different characteristics. **VPN** creates an encrypted tunnel over the public internet between your on-premises Customer Gateway and an AWS Virtual Private Gateway. It's quick to provision (hours to days), costs much less than Direct Connect, but is limited to about 1.25 Gbps per tunnel and subject to public internet variability. **Direct Connect** is a dedicated physical fiber connection from your data center to an AWS Direct Connect location, providing speeds of 1, 10, or 100 Gbps with consistent latency and without public internet variability. Direct Connect takes weeks to months to provision and costs significantly more, but for workloads that need consistent throughput or move large amounts of data regularly, it's the right choice. Importantly, Direct Connect traffic is not encrypted by default — you must run a VPN over the Direct Connect connection to get encryption.`,
      quiz: [
        {
          question:
            "VPC A is peered with VPC B, and VPC B is peered with VPC C. Can a resource in VPC A communicate with a resource in VPC C?",
          options: [
            "Yes — VPC peering is transitive; traffic routes through VPC B automatically",
            "No — VPC peering is not transitive; A cannot reach C through B without a direct peering connection between A and C",
            "Yes — but only if VPC B has route table entries for both VPC A and VPC C",
            "No — peering connections do not allow multi-hop routing even with explicit routes",
          ],
          correctIndex: 1,
          explanation:
            "VPC peering is explicitly non-transitive. Even though A peers with B and B peers with C, traffic from A cannot travel through B to reach C. A direct peering connection between A and C is required. For architectures where many VPCs need full connectivity, Transit Gateway solves this by acting as a hub — every VPC connects to it and can reach any other connected VPC.",
        },
        {
          question:
            "A company needs a dedicated 10 Gbps private connection from their data center to AWS with consistent, low-latency throughput. They are concerned about data encryption in transit. Which combination of services meets both requirements?",
          options: [
            "Direct Connect alone — dedicated fiber provides encryption as part of the physical layer",
            "VPN alone — encrypts all traffic and provides up to 10 Gbps throughput",
            "Direct Connect for the private dedicated connection, with a VPN tunnel over Direct Connect for encryption",
            "Transit Gateway with VPN attachments for both encryption and high throughput",
          ],
          correctIndex: 2,
          explanation:
            "Direct Connect provides the dedicated 10 Gbps private connection with consistent latency, but it does not encrypt traffic by default. To add encryption, you run an IPSec VPN tunnel over the Direct Connect connection. This combination provides both the throughput and consistency of Direct Connect and the encryption of VPN. A VPN alone is limited to approximately 1.25 Gbps per tunnel.",
        },
        {
          question:
            "A company has 15 VPCs that all need to communicate with each other and with an on-premises data center. Which connectivity approach scales most efficiently?",
          options: [
            "VPC peering between every pair of VPCs (105 peering connections) plus a VPN to each VPC",
            "Transit Gateway, with each VPC and the on-premises network connecting to it as attachments",
            "A hub VPC that peers with all 14 other VPCs, routing on-premises traffic through the hub",
            "Direct Connect to each VPC individually using separate virtual interfaces",
          ],
          correctIndex: 1,
          explanation:
            "Transit Gateway is the correct solution for hub-and-spoke connectivity at scale. Each VPC and the on-premises network connects to the Transit Gateway as an attachment. Routes flow through the Transit Gateway to any other attachment, eliminating the need for individual peering connections (which would be non-transitive and require N*(N-1)/2 connections). Transit Gateway supports thousands of attachments.",
        },
      ],
    },
    {
      heading: "Subnets & IP Addressing",
      body: `Designing your VPC's IP address space requires a few key considerations about how subnets work and how AWS allocates addresses within them.

VPC CIDR blocks must be between /16 (65,536 addresses) and /28 (16 addresses). Subnets are carved from the VPC's range and must fit within it without overlapping. AWS **reserves 5 IP addresses in every subnet**: the network address (first), the VPC router (second), the DNS server (third), a reserved address for future use (fourth), and the broadcast address (last). A /28 subnet with 16 total addresses therefore provides only 11 usable host addresses — important to factor in when sizing subnets for services that consume many IPs (like Lambda VPC functions, which create ENIs per execution environment).

**Elastic IP addresses (EIPs)** are static public IPv4 addresses you can associate with NAT Gateways, EC2 instances, or load balancers. An EIP associated with a running, in-use resource is free; an allocated EIP that's not associated with an active resource incurs a small hourly charge — AWS's mechanism for encouraging efficient use of the scarce public IPv4 address pool.

VPCs support **IPv6** in a dual-stack configuration where both IPv4 and IPv6 addresses are assigned. IPv6 addresses are globally routable by default (no NAT for IPv6), which means private subnets that want IPv6 outbound connectivity without accepting inbound connections use an **Egress-Only Internet Gateway** — the IPv6 equivalent of a NAT Gateway. When your VPC's CIDR range is exhausted, you can attach **secondary CIDR blocks** (like \`100.64.0.0/16\`) to expand the address space without creating a new VPC.`,
      quiz: [
        {
          question:
            "How many usable host IP addresses are available in a /28 subnet in a VPC?",
          options: [
            "16 — all addresses in the subnet are available for hosts",
            "14 — AWS reserves the first and last address",
            "11 — AWS reserves 5 addresses (network, router, DNS, reserved, broadcast)",
            "13 — AWS reserves only the network and broadcast addresses",
          ],
          correctIndex: 2,
          explanation:
            "AWS reserves 5 IP addresses in every subnet: the network address (first), the VPC router (second), the DNS server (third), a future-use reserved address (fourth), and the broadcast address (last). A /28 subnet has 16 total addresses minus 5 reserved = 11 usable host addresses. This reservation applies to every subnet size, which significantly impacts small subnets.",
        },
        {
          question:
            "An Elastic IP address is allocated but not associated with any running resource. What is the billing implication?",
          options: [
            "EIPs are always free regardless of their association status",
            "EIPs are free when associated with a running resource but incur an hourly charge when unassociated",
            "EIPs incur a charge per hour regardless of whether they are associated with a resource",
            "EIPs are charged only for data transfer, not for allocation",
          ],
          correctIndex: 1,
          explanation:
            "AWS charges a small hourly fee for Elastic IP addresses that are allocated but not associated with a running, in-use resource. This pricing model discourages hoarding of public IPv4 addresses, which are a scarce global resource. An EIP associated with an active EC2 instance or NAT Gateway is free. You should release EIPs when no longer needed to avoid unnecessary charges.",
        },
        {
          question:
            "A VPC subnet needs outbound IPv6 internet connectivity for its instances but should not accept any unsolicited inbound IPv6 connections. Which gateway type provides this?",
          options: [
            "NAT Gateway — handles both IPv4 and IPv6 outbound traffic",
            "Internet Gateway — blocks inbound IPv6 by default when no inbound route exists",
            "Egress-Only Internet Gateway — allows outbound IPv6 traffic while blocking unsolicited inbound connections",
            "Virtual Private Gateway — routes IPv6 traffic to on-premises networks",
          ],
          correctIndex: 2,
          explanation:
            "The Egress-Only Internet Gateway is the IPv6 equivalent of a NAT Gateway. IPv6 addresses are globally routable (no NAT), so an Egress-Only IGW is required to allow IPv6 instances to initiate outbound connections while preventing unsolicited inbound connections. A standard Internet Gateway allows bidirectional IPv6 traffic, which would expose the instances to inbound connections.",
        },
      ],
    },
    {
      heading: "Flow Logs & Monitoring",
      body: `**VPC Flow Logs** capture metadata about IP traffic flowing through your VPC — not the packet contents, but the source, destination, ports, protocol, packet counts, byte counts, and whether each flow was accepted or rejected. Flow logs can be enabled at the VPC level (all traffic), subnet level, or individual ENI level, and they publish records to CloudWatch Logs, S3, or Kinesis Firehose.

The most operationally useful fields in each flow log record are \`srcaddr\` (source IP), \`dstaddr\` (destination IP), \`srcport\` and \`dstport\`, \`protocol\`, \`action\` (ACCEPT or REJECT), and \`bytes\`. The \`action\` field is particularly valuable for debugging security group rules: if traffic that should be allowed is failing, a flow log showing REJECT from the expected source IP tells you immediately that a security group or NACL is blocking it. You can search and analyze flow logs with CloudWatch Logs Insights (SQL-like syntax) or export to S3 and query with Athena.

VPC DNS is provided by a resolver at the VPC's second IP address (the VPC CIDR base + 2, so \`10.0.0.2\` for a \`10.0.0.0/16\` VPC). Two VPC settings control DNS behavior: \`enableDnsSupport\` must be enabled for the AWS-provided DNS to work, and \`enableDnsHostnames\` makes private DNS names resolvable within the VPC. Both must be enabled for VPC endpoints with private DNS names (the default for interface endpoints) to function correctly — a common misconfiguration that causes interface endpoint failures.`,
      quiz: [
        {
          question:
            "An EC2 instance is failing to receive traffic that should be allowed by its security group. A developer enables VPC Flow Logs to investigate. Which field in the flow log record immediately indicates whether traffic is being blocked?",
          options: [
            "`protocol` — shows whether the traffic type matches the security group rule",
            "`bytes` — a value of 0 indicates blocked traffic",
            "`action` — shows ACCEPT or REJECT for each flow",
            "`srcport` — a blocked port shows as 0 in the flow log",
          ],
          correctIndex: 2,
          explanation:
            "The `action` field in a VPC Flow Log record shows either ACCEPT or REJECT for each traffic flow. A REJECT entry for traffic from an expected source IP confirms that a security group or NACL rule is blocking the connection. This is the primary field used to debug network connectivity issues — it directly answers whether the traffic was allowed or denied by the network controls.",
        },
        {
          question:
            "VPC Flow Logs capture which type of information about network traffic?",
          options: [
            "Full packet contents including headers and payload, stored encrypted in S3",
            "Metadata only: source/destination IPs, ports, protocol, byte counts, and ACCEPT/REJECT action — not packet contents",
            "HTTP request and response bodies for traffic on port 80 and 443",
            "Only traffic that is rejected by security groups or NACLs",
          ],
          correctIndex: 1,
          explanation:
            "VPC Flow Logs capture traffic metadata — source IP, destination IP, source port, destination port, protocol, packet count, byte count, and the ACCEPT/REJECT action. They do not capture packet contents or payloads. Flow logs are published for all traffic (accepted and rejected) unless filtered. They are used for network monitoring, security analysis, and troubleshooting, not for application-level request/response inspection.",
        },
        {
          question:
            "An interface VPC endpoint is configured for a service but DNS resolution is failing inside the VPC. Which two VPC settings must both be enabled for interface endpoint private DNS to work?",
          options: [
            "`enablePublicDns` and `enablePrivateHostedZone`",
            "`enableDnsSupport` and `enableDnsHostnames`",
            "`enableVpcDns` and `enablePrivateDns`",
            "`enableDnsResolution` and `enableDnsHostnames`",
          ],
          correctIndex: 1,
          explanation:
            "Both `enableDnsSupport` (enables the AWS-provided DNS resolver in the VPC) and `enableDnsHostnames` (makes private DNS names resolvable within the VPC) must be enabled for interface endpoint private DNS names to function. If either setting is disabled, the endpoint's private DNS name will not resolve correctly, causing connection failures even though the endpoint exists. This is a common misconfiguration.",
        },
      ],
    },
    {
      heading: "VPC with Other Services",
      body: `**VPC + Lambda** is one of the more nuanced configurations. By default, Lambda functions run outside your VPC and cannot reach private resources like RDS or ElastiCache. Configuring a Lambda function with a VPC attaches it to subnets in your VPC via ENIs, giving it access to private resources. The tradeoffs are meaningful: outbound internet access from a VPC-attached Lambda requires a NAT Gateway (or VPC endpoints for AWS services), ENI provisioning adds some cold start latency, and you need to provision subnets across multiple Availability Zones to avoid single-AZ failure scenarios.

**VPC + RDS** always places the database in private subnets with no public endpoint. The database security group allows inbound on the database port only from the application tier's security group, and nothing else. Multi-AZ RDS requires the DB subnet group to have subnets in at least two Availability Zones so the standby can be placed in a different AZ.

**VPC + ECS/Fargate** uses the \`awsvpc\` networking mode, which assigns each task its own ENI and private IP address in your subnets. Tasks in private subnets access ECR to pull images via either a NAT Gateway or VPC endpoints for ECR and S3 (ECR image layers are stored in S3). **VPC + ALB** places the load balancer in public subnets across multiple AZs, forwarding traffic to targets in private subnets. The ALB security group accepts inbound on ports 80 and 443 from the internet; the target security group accepts inbound only from the ALB security group — not from the internet directly.

**VPC Endpoints + S3/DynamoDB** eliminate the need for a NAT Gateway for Lambda, EC2, and ECS tasks that only need to access S3 and DynamoDB. Adding gateway endpoints for both services and adding route table entries pointing to those endpoints keeps all S3 and DynamoDB traffic on the AWS private network, reducing both NAT Gateway data processing costs and egress charges.`,
      quiz: [
        {
          question:
            "A Lambda function in a VPC private subnet needs to call the DynamoDB API. What is the most cost-effective way to enable this without routing traffic through the public internet?",
          options: [
            "Add a NAT Gateway in a public subnet and update the private subnet's route table",
            "Move the Lambda function to a public subnet so it can reach DynamoDB directly",
            "Add a VPC Gateway Endpoint for DynamoDB — it is free and keeps traffic on the AWS private network",
            "Add a VPC Interface Endpoint for DynamoDB — it provides the lowest latency",
          ],
          correctIndex: 2,
          explanation:
            "A VPC Gateway Endpoint for DynamoDB is free and routes DynamoDB traffic through the AWS private network without requiring a NAT Gateway. Gateway endpoints work by adding a route table entry, so no ENI is created and there are no per-hour or per-GB charges. This is the most cost-effective option for Lambda or EC2 traffic to S3 and DynamoDB from private subnets.",
        },
        {
          question:
            "A VPC-attached Lambda function needs to access both a private RDS database and the public Stripe API. What network configuration is required?",
          options: [
            "Attach the Lambda to a public subnet so it has both internet access and can reach the RDS via VPC routing",
            "Place the Lambda in a private subnet; use a NAT Gateway for outbound internet access to Stripe and private VPC routing for RDS",
            "Lambda cannot simultaneously access private VPC resources and public internet endpoints",
            "Attach the Lambda to both a private subnet (for RDS) and a public subnet (for Stripe) simultaneously",
          ],
          correctIndex: 1,
          explanation:
            "A VPC-attached Lambda in a private subnet can reach private resources (like RDS) via VPC routing. For outbound internet access (like the Stripe API), the private subnet's route table must point `0.0.0.0/0` to a NAT Gateway in a public subnet. Lambda functions in public subnets still cannot initiate internet traffic — VPC-attached Lambda always needs a NAT Gateway for outbound internet access.",
        },
        {
          question:
            "An ALB serves traffic to ECS Fargate tasks in private subnets. How should the security groups be configured to ensure the tasks are not directly reachable from the internet?",
          options: [
            "ALB security group: allow inbound 80/443 from the internet. Task security group: allow inbound on the app port only from the ALB's security group",
            "ALB security group: allow all traffic. Task security group: allow inbound 80/443 from the internet",
            "Both security groups should allow inbound 80/443 from the internet for redundancy",
            "NACLs on the private subnet should block all internet traffic; no security group changes are needed",
          ],
          correctIndex: 0,
          explanation:
            "The standard pattern is: the ALB security group allows inbound HTTP/HTTPS from the internet (0.0.0.0/0), and the task security group allows inbound on the application port only from the ALB security group ID (not from the internet). This ensures tasks are only reachable through the ALB — direct internet access to the tasks is blocked because no internet route exists to the private subnet and the task security group doesn't allow it.",
        },
      ],
    },
  ],

  keyFacts: [
    "Security groups: stateful, instance-level, allow-only rules",
    "NACLs: stateless, subnet-level, allow + deny rules, evaluated in rule number order",
    "Internet Gateway: enables public subnet (route 0.0.0.0/0 → igw). One per VPC.",
    "NAT Gateway: private subnet outbound internet. Deploy one per AZ for HA.",
    "VPC Peering: not transitive. Transit Gateway solves multi-VPC hub-and-spoke.",
    "Gateway endpoint: S3 and DynamoDB, free. Interface endpoint: PrivateLink, most services.",
    "AWS reserves 5 IPs per subnet (network, router, DNS, reserved, broadcast)",
    "Flow Logs: capture ACCEPT/REJECT traffic; published to CloudWatch Logs, S3, Firehose",
    "Lambda in VPC: needs private subnets + NAT for outbound internet",
    "Direct Connect: dedicated private link; not encrypted by default",
  ],

  relatedServices: [
    "Amazon EC2",
    "AWS Lambda",
    "Amazon RDS",
    "Amazon ElastiCache",
    "Amazon ECS",
    "Elastic Load Balancing",
    "Amazon S3",
    "Amazon DynamoDB",
    "AWS Transit Gateway",
    "Amazon CloudWatch",
  ],

  examTips: [
    "Security groups = stateful (return traffic auto-allowed). NACLs = stateless (must allow return).",
    "NACLs: rule numbers evaluated lowest-first; first match wins. Add deny before allow-all.",
    "Public subnet = has route 0.0.0.0/0 → internet gateway in route table.",
    "NAT Gateway in public subnet, route private subnet 0.0.0.0/0 → NAT.",
    "VPC peering is not transitive — use Transit Gateway for mesh connectivity.",
    "Gateway endpoint for S3/DynamoDB = free and no NAT Gateway needed.",
    "Lambda in VPC: cold starts are longer; needs multiple AZ subnets for resilience.",
    "Flow Logs action field: ACCEPT or REJECT — use to debug security group rules.",
    "Direct Connect does NOT encrypt traffic by default — add VPN on top for encryption.",
  ],

  topicQuiz: [
    {
      question:
        "A security group allows inbound on port 3306. A NACL on the same subnet has rule 100 denying all traffic from `10.0.1.0/24`. An RDS client at `10.0.1.50` tries to connect on port 3306. What happens?",
      options: [
        "The connection is allowed because the security group permit takes precedence over the NACL deny",
        "The connection is denied because NACLs are evaluated before security groups and rule 100 rejects the traffic at the subnet boundary",
        "The connection is allowed because security groups and NACLs are evaluated simultaneously and the allow wins",
        "The NACL deny only applies to outbound traffic; inbound traffic is controlled solely by security groups",
      ],
      correctIndex: 1,
      explanation:
        "NACLs are evaluated at the subnet boundary before traffic reaches the instance and its security group. If a NACL rule denies the traffic, it never reaches the security group. NACL rule 100 (deny `10.0.1.0/24`) is evaluated first (lowest number), matches the source IP, and the connection is rejected before the security group's port 3306 allow rule is even consulted.",
    },
    {
      question:
        "Which statement correctly describes the difference between security groups and NACLs regarding return traffic?",
      options: [
        "Both security groups and NACLs are stateful — return traffic is automatically allowed for both",
        "Security groups are stateful (return traffic auto-allowed); NACLs are stateless (return traffic needs an explicit allow rule)",
        "NACLs are stateful; security groups are stateless and require explicit outbound rules for every inbound connection",
        "Neither is stateful — both require explicit rules for inbound and outbound traffic",
      ],
      correctIndex: 1,
      explanation:
        "Security groups are stateful: an allowed inbound connection automatically permits the return traffic without any explicit outbound rule. NACLs are stateless: you must add explicit outbound rules for return traffic (typically allowing ephemeral ports 1024–65535) or responses will be blocked. This is the most commonly tested distinction between the two mechanisms.",
    },
    {
      question:
        "A company wants to connect 20 VPCs and their on-premises data center so every network can communicate with every other network. What is the most scalable architecture?",
      options: [
        "Create VPC peering connections between every pair of VPCs (190 connections) and a VPN to each VPC",
        "Use Transit Gateway as a central hub; attach all 20 VPCs and the on-premises network as Transit Gateway attachments",
        "Use a hub-and-spoke model with VPC peering where one VPC peers with all others",
        "Use AWS Direct Connect with multiple virtual interfaces, one per VPC",
      ],
      correctIndex: 1,
      explanation:
        "Transit Gateway is the scalable solution for hub-and-spoke connectivity. Each VPC and the on-premises network attaches to the Transit Gateway, and all traffic is routed through it. VPC peering is non-transitive and would require 190 individual connections for 20 VPCs — unmanageable at scale. Transit Gateway supports thousands of attachments and enables complex routing policies.",
    },
    {
      question:
        "A Lambda function is deployed inside a VPC to access a private RDS database. After deployment, the function cannot reach public AWS APIs like S3. What is the missing network component?",
      options: [
        "An Internet Gateway route in the Lambda function's subnet",
        "A NAT Gateway in a public subnet, with a route from the Lambda function's private subnet to the NAT Gateway",
        "A VPC peering connection between the Lambda function's VPC and the S3 service VPC",
        "An elastic IP address attached to the Lambda function's ENI",
      ],
      correctIndex: 1,
      explanation:
        "VPC-attached Lambda functions in private subnets have no outbound internet access by default. To reach public endpoints (S3, external APIs, etc.), the private subnet's route table must point `0.0.0.0/0` to a NAT Gateway deployed in a public subnet. Alternatively, for AWS services like S3, a Gateway VPC Endpoint is a free option that avoids the NAT Gateway entirely.",
    },
    {
      question:
        "A /24 subnet is created in a VPC. How many IP addresses are available for EC2 instances?",
      options: [
        "256 — all addresses in the /24 block are usable",
        "254 — only the first and last addresses are reserved",
        "251 — AWS reserves 5 IP addresses in every subnet",
        "252 — AWS reserves 4 IP addresses (no broadcast reservation in VPC)",
      ],
      correctIndex: 2,
      explanation:
        "A /24 subnet has 256 total addresses. AWS reserves 5: the network address (first), VPC router (second), DNS server (third), future use (fourth), and broadcast address (last). 256 - 5 = 251 usable IP addresses for hosts. This reservation applies to every subnet regardless of size.",
    },
    {
      question:
        "Traffic from an on-premises data center connects to AWS via Direct Connect. A security audit requires that all traffic between the data center and AWS be encrypted. What must be done?",
      options: [
        "Nothing — Direct Connect encrypts traffic by default using MACsec",
        "Enable encryption in the Direct Connect console — it is an opt-in feature",
        "Run an IPSec VPN tunnel over the Direct Connect connection to add encryption",
        "Switch from Direct Connect to a VPN connection, which encrypts traffic by default",
      ],
      correctIndex: 2,
      explanation:
        "Direct Connect is a dedicated private fiber connection but does not encrypt traffic in transit by default. To encrypt traffic over Direct Connect, you run an IPSec VPN tunnel on top of the Direct Connect connection. This provides the throughput and consistency of Direct Connect combined with the encryption of IPSec VPN. (MACsec is a separate layer-2 encryption option available on some Direct Connect connections, but the standard exam answer is IPSec VPN over Direct Connect.)",
    },
    {
      question:
        "A developer needs to debug why an EC2 instance cannot receive traffic on port 8080 from another instance. VPC Flow Logs are enabled. What should the developer look for in the logs?",
      options: [
        "Flow log entries from the source instance's IP with `action: REJECT` on port 8080",
        "Flow log entries with `bytes: 0` indicating no data was transferred",
        "CloudWatch metrics showing dropped packets at the instance level",
        "Flow log entries with `protocol: ICMP` showing connectivity test failures",
      ],
      correctIndex: 0,
      explanation:
        "Flow logs record each traffic flow with an `action` field of either ACCEPT or REJECT. To debug a blocked connection, look for flow log entries from the source instance's IP address to the destination on port 8080 with `action: REJECT`. A REJECT entry confirms that a security group or NACL is blocking the traffic, which narrows the investigation to the specific rule causing the block.",
    },
    {
      question:
        "An ECS Fargate task in a private subnet needs to pull a Docker image from ECR without routing through the public internet. Which combination of VPC endpoints is required?",
      options: [
        "A single interface endpoint for ECR is sufficient",
        "Interface endpoints for ECR (both `ecr.api` and `ecr.dkr`) and a Gateway endpoint for S3, because ECR image layers are stored in S3",
        "A Gateway endpoint for ECR and S3 — both are supported by Gateway endpoints",
        "Only a NAT Gateway is needed — VPC endpoints are not supported for ECR image pulls",
      ],
      correctIndex: 1,
      explanation:
        "Pulling an image from ECR requires three endpoints: `com.amazonaws.{region}.ecr.api` (for the ECR API), `com.amazonaws.{region}.ecr.dkr` (for the Docker registry protocol), and a Gateway endpoint for S3 (because ECR stores image layers in S3 and the pull fetches those layers). Missing any of these endpoints causes the image pull to fail or fall back to the NAT Gateway.",
    },
  ],
};
