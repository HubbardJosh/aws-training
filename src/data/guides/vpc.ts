import { ServiceGuide } from "../../types/guide";

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
    },
    {
      heading: "Security Groups vs NACLs",
      body: `VPC provides two distinct firewall mechanisms at different levels of the network stack, and they work together to provide defense in depth.

**Security Groups** operate at the instance level — specifically at the Elastic Network Interface attached to each instance, task, or Lambda function. They are **stateful**, meaning that if you allow an inbound connection, the return traffic is automatically allowed without any explicit outbound rule. Security groups only have allow rules; there is no way to explicitly deny traffic to a specific source with a security group. When a packet arrives, all rules are evaluated simultaneously and the connection is allowed if any rule matches. The ability to reference another security group as a source (rather than a CIDR range) is particularly powerful: you can write rules like "allow inbound on port 5432 from the application-tier security group" which automatically covers all instances in that group regardless of their IP addresses.

**Network ACLs (NACLs)** operate at the subnet level, applying to all traffic entering or leaving the subnet regardless of which instance it's destined for. NACLs are **stateless**: a rule allowing inbound traffic does not automatically allow the response — you must explicitly add outbound rules for return traffic. NACLs support both allow and deny rules, and rules are evaluated in order from lowest rule number to highest, with the first matching rule applied. This rule-ordering behavior is important: a deny rule at rule number 100 blocks traffic even if an allow rule at rule number 200 would otherwise permit it.

In practice, security groups handle the day-to-day traffic filtering for most architectures, and NACLs serve as an additional layer for subnet-wide restrictions — particularly useful for blocking known malicious IP ranges at the subnet level with explicit deny rules that security groups can't express.`,
    },
    {
      heading: "VPC Peering & Connectivity",
      body: `When you need to connect multiple VPCs or connect your on-premises network to AWS, several connectivity options exist with different performance, cost, and complexity characteristics.

**VPC Peering** establishes a private connection between two VPCs, allowing traffic to flow between them using private IP addresses without traversing the public internet. Traffic stays on the AWS backbone. After creating the peering connection, you must add route table entries in both VPCs and update security groups to allow traffic from the peer's CIDR range. The critical limitation is that peering is not transitive: if VPC A peers with VPC B and VPC B peers with VPC C, traffic from A cannot reach C via B. For architectures with many VPCs that need full connectivity, **AWS Transit Gateway** solves the transitivity problem by acting as a regional hub. Every VPC connects to the Transit Gateway, and routes flow through it to any other connected VPC or on-premises network. Transit Gateway supports thousands of attachments and enables complex routing topologies that VPC peering can't express.

For connecting on-premises networks to AWS, two options exist with very different characteristics. **VPN** creates an encrypted tunnel over the public internet between your on-premises Customer Gateway and an AWS Virtual Private Gateway. It's quick to provision (hours to days), costs much less than Direct Connect, but is limited to about 1.25 Gbps per tunnel and subject to public internet variability. **Direct Connect** is a dedicated physical fiber connection from your data center to an AWS Direct Connect location, providing speeds of 1, 10, or 100 Gbps with consistent latency and without public internet variability. Direct Connect takes weeks to months to provision and costs significantly more, but for workloads that need consistent throughput or move large amounts of data regularly, it's the right choice. Importantly, Direct Connect traffic is not encrypted by default — you must run a VPN over the Direct Connect connection to get encryption.`,
    },
    {
      heading: "Subnets & IP Addressing",
      body: `Designing your VPC's IP address space requires a few key considerations about how subnets work and how AWS allocates addresses within them.

VPC CIDR blocks must be between /16 (65,536 addresses) and /28 (16 addresses). Subnets are carved from the VPC's range and must fit within it without overlapping. AWS **reserves 5 IP addresses in every subnet**: the network address (first), the VPC router (second), the DNS server (third), a reserved address for future use (fourth), and the broadcast address (last). A /28 subnet with 16 total addresses therefore provides only 11 usable host addresses — important to factor in when sizing subnets for services that consume many IPs (like Lambda VPC functions, which create ENIs per execution environment).

**Elastic IP addresses (EIPs)** are static public IPv4 addresses you can associate with NAT Gateways, EC2 instances, or load balancers. An EIP associated with a running, in-use resource is free; an allocated EIP that's not associated with an active resource incurs a small hourly charge — AWS's mechanism for encouraging efficient use of the scarce public IPv4 address pool.

VPCs support **IPv6** in a dual-stack configuration where both IPv4 and IPv6 addresses are assigned. IPv6 addresses are globally routable by default (no NAT for IPv6), which means private subnets that want IPv6 outbound connectivity without accepting inbound connections use an **Egress-Only Internet Gateway** — the IPv6 equivalent of a NAT Gateway. When your VPC's CIDR range is exhausted, you can attach **secondary CIDR blocks** (like \`100.64.0.0/16\`) to expand the address space without creating a new VPC.`,
    },
    {
      heading: "Flow Logs & Monitoring",
      body: `**VPC Flow Logs** capture metadata about IP traffic flowing through your VPC — not the packet contents, but the source, destination, ports, protocol, packet counts, byte counts, and whether each flow was accepted or rejected. Flow logs can be enabled at the VPC level (all traffic), subnet level, or individual ENI level, and they publish records to CloudWatch Logs, S3, or Kinesis Firehose.

The most operationally useful fields in each flow log record are \`srcaddr\` (source IP), \`dstaddr\` (destination IP), \`srcport\` and \`dstport\`, \`protocol\`, \`action\` (ACCEPT or REJECT), and \`bytes\`. The \`action\` field is particularly valuable for debugging security group rules: if traffic that should be allowed is failing, a flow log showing REJECT from the expected source IP tells you immediately that a security group or NACL is blocking it. You can search and analyze flow logs with CloudWatch Logs Insights (SQL-like syntax) or export to S3 and query with Athena.

VPC DNS is provided by a resolver at the VPC's second IP address (the VPC CIDR base + 2, so \`10.0.0.2\` for a \`10.0.0.0/16\` VPC). Two VPC settings control DNS behavior: \`enableDnsSupport\` must be enabled for the AWS-provided DNS to work, and \`enableDnsHostnames\` makes private DNS names resolvable within the VPC. Both must be enabled for VPC endpoints with private DNS names (the default for interface endpoints) to function correctly — a common misconfiguration that causes interface endpoint failures.`,
    },
    {
      heading: "VPC with Other Services",
      body: `**VPC + Lambda** is one of the more nuanced configurations. By default, Lambda functions run outside your VPC and cannot reach private resources like RDS or ElastiCache. Configuring a Lambda function with a VPC attaches it to subnets in your VPC via ENIs, giving it access to private resources. The tradeoffs are meaningful: outbound internet access from a VPC-attached Lambda requires a NAT Gateway (or VPC endpoints for AWS services), ENI provisioning adds some cold start latency, and you need to provision subnets across multiple Availability Zones to avoid single-AZ failure scenarios.

**VPC + RDS** always places the database in private subnets with no public endpoint. The database security group allows inbound on the database port only from the application tier's security group, and nothing else. Multi-AZ RDS requires the DB subnet group to have subnets in at least two Availability Zones so the standby can be placed in a different AZ.

**VPC + ECS/Fargate** uses the \`awsvpc\` networking mode, which assigns each task its own ENI and private IP address in your subnets. Tasks in private subnets access ECR to pull images via either a NAT Gateway or VPC endpoints for ECR and S3 (ECR image layers are stored in S3). **VPC + ALB** places the load balancer in public subnets across multiple AZs, forwarding traffic to targets in private subnets. The ALB security group accepts inbound on ports 80 and 443 from the internet; the target security group accepts inbound only from the ALB security group — not from the internet directly.

**VPC Endpoints + S3/DynamoDB** eliminate the need for a NAT Gateway for Lambda, EC2, and ECS tasks that only need to access S3 and DynamoDB. Adding gateway endpoints for both services and adding route table entries pointing to those endpoints keeps all S3 and DynamoDB traffic on the AWS private network, reducing both NAT Gateway data processing costs and egress charges.`,
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
};
