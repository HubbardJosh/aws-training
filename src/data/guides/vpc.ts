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
      body: `**VPC**: isolated virtual network. Tied to a region. You define a CIDR block (e.g. 10.0.0.0/16). Up to 5 VPCs per region (soft limit, can be increased).

**Subnet**: a range of IP addresses within your VPC. Tied to one Availability Zone. Can be public (has route to internet gateway) or private (no route to internet gateway).

**Route Table**: rules that determine where network traffic is directed. Each subnet must be associated with one route table. The main route table is created by default.

**Internet Gateway (IGW)**: allows communication between your VPC and the internet. Attached to the VPC, not a subnet. A subnet is "public" when its route table has a route to an IGW.

**NAT Gateway**: allows instances in private subnets to initiate outbound internet connections without allowing inbound internet connections. Managed service; deployed in a public subnet; high availability per AZ (deploy one per AZ for HA).

**Bastion Host (Jump Box)**: EC2 instance in a public subnet used to SSH/RDP into instances in private subnets. Controlled via security groups.

**VPC Endpoints**: private connectivity to AWS services without internet traffic. Two types:
- *Gateway endpoint*: for S3 and DynamoDB (free)
- *Interface endpoint* (AWS PrivateLink): for most other services (hourly + data charge)`,
    },
    {
      heading: "Security Groups vs NACLs",
      body: `**Security Groups**:
- Virtual firewalls at the **instance** (ENI) level
- **Stateful**: return traffic is automatically allowed (track connection state)
- Only **Allow** rules (no explicit deny)
- Rules evaluated as a whole — any matching allow rule permits the traffic
- Applied to individual instances/ENIs
- Can reference other security groups (same or peered VPC) as source/destination
- Default: deny all inbound, allow all outbound

**Network ACLs (NACLs)**:
- Virtual firewalls at the **subnet** level
- **Stateless**: must explicitly allow return traffic (both inbound and outbound rules needed)
- Both **Allow** and **Deny** rules
- Rules evaluated in **order by rule number** (lowest first); first match wins
- Applied to all instances in a subnet
- Default NACL: allow all inbound and outbound
- Custom NACL: deny all by default

**Comparison**:
| Feature | Security Group | NACL |
|---------|---------------|------|
| Level | Instance (ENI) | Subnet |
| State | Stateful | Stateless |
| Rules | Allow only | Allow + Deny |
| Evaluation | All rules | Rule number order |`,
    },
    {
      heading: "VPC Peering & Connectivity",
      body: `**VPC Peering**: private connection between two VPCs (same or different accounts/regions). Traffic stays on AWS backbone. Routes must be configured in both VPCs' route tables. Security groups must allow traffic from peer CIDR.

Limitations:
- No transitive peering: A↔B, B↔C does NOT mean A↔C
- No overlapping CIDR blocks

**AWS Transit Gateway**: hub-and-spoke model for connecting many VPCs and on-premises networks. Solves transitive peering limitation. VPCs connect to the TGW; traffic routes through it. Supports up to thousands of VPC attachments.

**VPN (Virtual Private Network)**: encrypted tunnel over the internet connecting your on-premises network to your VPC. Uses Customer Gateway (on-prem) and Virtual Private Gateway (AWS side). 1.25 Gbps max per tunnel.

**AWS Direct Connect**: dedicated private network connection from your data center to AWS. Not encrypted by default (add VPN for encryption). Speeds: 1 Gbps, 10 Gbps, 100 Gbps. More reliable and lower latency than internet VPN. Takes weeks to provision.

**VPC Endpoints**:
- Gateway endpoint: adds entry in route table for S3/DynamoDB. Free.
- Interface endpoint (PrivateLink): creates ENI in your subnet with private IP. DNS resolves AWS service to this IP. Hourly + data charge.`,
    },
    {
      heading: "Subnets & IP Addressing",
      body: `**Public subnet**: subnet with a route \`0.0.0.0/0 → igw-xxx\`. Instances need a public IP or Elastic IP to receive inbound internet traffic.

**Private subnet**: no route to IGW. Instances access internet via NAT Gateway in public subnet.

**CIDR blocks**: VPC CIDR must be /16 to /28. Subnet CIDR within the VPC's range. AWS reserves 5 IPs per subnet: network, VPC router, DNS, reserved for future, broadcast.

**Elastic IP (EIP)**: static public IPv4 address. Charged when not associated with a running instance. Used for NAT Gateway, Bastion hosts, load balancers.

**IPv6**: VPCs support dual-stack. IPv6 addresses are public by default (no NAT for IPv6). Egress-only Internet Gateway for IPv6 outbound (like NAT for IPv4 private subnets).

**Secondary CIDR blocks**: add additional CIDR blocks to an existing VPC (e.g. add 100.64.0.0/16 when 10.0.0.0/16 is full).`,
    },
    {
      heading: "Flow Logs & Monitoring",
      body: `**VPC Flow Logs**: capture IP traffic information for VPCs, subnets, or ENIs. Published to CloudWatch Logs, S3, or Kinesis Firehose.

**Flow log record fields**: srcaddr, dstaddr, srcport, dstport, protocol, packets, bytes, start, end, action (ACCEPT/REJECT), log-status.

**Use cases**: diagnose security group rules (see REJECT traffic), monitor bandwidth, detect unusual traffic patterns, compliance.

**Cost**: Flow Logs data ingestion and storage. CloudWatch Logs charges for ingestion; S3 charges for storage.

**DNS**: each VPC gets a default DNS server at VPC_CIDR+2 (e.g. 10.0.0.2). Enable \`enableDnsSupport\` and \`enableDnsHostnames\` for private DNS to work properly with VPC endpoints and Route 53 private hosted zones.`,
    },
    {
      heading: "VPC with Other Services",
      body: `**VPC + Lambda**: deploy Lambda in a VPC to access RDS, ElastiCache, or other private resources. Lambda creates ENIs in your subnets. Requires subnets in multiple AZs. Outbound internet requires NAT Gateway. Cold start slightly longer due to ENI attachment.

**VPC + RDS**: RDS instances run in private subnets. Security group allows inbound from application tier SG only. Multi-AZ RDS spans subnets in different AZs.

**VPC + ElastiCache**: ElastiCache clusters in private subnets. Access via application SG → ElastiCache SG on Redis port 6379.

**VPC + ECS/Fargate**: Fargate tasks run in subnets. Use awsvpc network mode for each task to get its own ENI and IP. Private tasks use NAT Gateway for outbound ECR pulls (or VPC endpoints).

**VPC + ALB**: ALB deployed in public subnets across multiple AZs. Forwards traffic to targets in private subnets. Security group: ALB allows 80/443 from internet; target SG allows from ALB SG.

**VPC Endpoints + S3/DynamoDB**: Lambda, EC2, ECS in private subnets access S3/DynamoDB without NAT Gateway — reduces cost and keeps traffic on AWS network.`,
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
