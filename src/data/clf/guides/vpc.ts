import { ServiceGuide } from "../../../types/guide";

export const vpcGuide: ServiceGuide = {
  id: "clf-vpc",
  service: "Amazon VPC",
  domain: "deployment",
  tagline: "Your own isolated virtual network inside AWS",
  intro:
    "Amazon Virtual Private Cloud (VPC) lets you provision a logically isolated section of the AWS cloud where you can launch AWS resources in a virtual network that you define, with full control over IP ranges, subnets, routing, and security.",

  sections: [
    {
      heading: "What Is a VPC?",
      body: `A **VPC** is a virtual network that resembles a traditional data center network, but hosted in AWS. When you create an AWS account, AWS automatically creates a **default VPC** in each region so you can launch resources immediately without network configuration.

You define a VPC by choosing a **CIDR block** — an IP address range expressed in notation like \`10.0.0.0/16\`. This gives the VPC 65,536 private IP addresses. All resources you launch inside the VPC (EC2 instances, RDS databases, Lambda functions in a VPC, etc.) receive private IP addresses from this range.

VPCs are **region-scoped** — a single VPC spans all Availability Zones within its region, but does not extend across regions. Each region can have up to 5 VPCs by default.`,
    },
    {
      heading: "Subnets, Route Tables, and Gateways",
      body: `A **subnet** is a subdivision of a VPC's CIDR block, and it is always associated with a single Availability Zone. You create multiple subnets in different AZs to achieve high availability.

Subnets are classified as **public** or **private** based on their routing:
- A **public subnet** has a route in its route table pointing to an **Internet Gateway (IGW)**, allowing resources inside to communicate directly with the internet.
- A **private subnet** has no direct internet route. Resources here can reach the internet through a **NAT Gateway** (for outbound-only traffic), but are not directly reachable from the internet.

A **route table** defines how traffic flows within and out of a subnet. Each subnet is associated with one route table, though multiple subnets can share the same table. The route table contains rules like "traffic destined for 0.0.0.0/0 (any internet address) goes to the Internet Gateway."

An **Internet Gateway** is a horizontally scaled, redundant, and highly available VPC component that allows communication between your VPC and the internet. Attaching an IGW to a VPC and adding the appropriate route to a subnet's route table makes that subnet public.`,
    },
    {
      heading: "Security: Security Groups and NACLs",
      body: `VPC provides two layers of network security: **Security Groups** and **Network Access Control Lists (NACLs)**.

**Security Groups** operate at the instance level (EC2, RDS, etc.). They are **stateful** — if an inbound rule allows traffic, the return traffic is automatically allowed regardless of outbound rules. Security groups only have allow rules; you cannot explicitly deny traffic. You typically define rules like "allow TCP port 80 from anywhere" or "allow port 5432 from the application security group."

**Network ACLs (NACLs)** operate at the subnet level and are **stateless** — you must explicitly allow both inbound and outbound traffic for each connection. NACLs support both allow and deny rules, processed in order by rule number. They are useful for blocking specific IP ranges across an entire subnet.

For most workloads, security groups are sufficient and NACLs provide an additional layer. The Cloud Practitioner exam often tests the stateful vs. stateless distinction.`,
    },
    {
      heading: "NAT Gateway and Internet Connectivity",
      body: `Resources in private subnets often need outbound internet access — for example, to download software updates or call external APIs — without being directly accessible from the internet. A **NAT Gateway** (Network Address Translation) enables this pattern.

A NAT Gateway is deployed in a **public subnet** and has an Elastic IP. Private subnet instances route internet-bound traffic to the NAT Gateway, which translates the private source IP to its own Elastic IP before forwarding the packet. The response comes back to the NAT Gateway, which translates it back and delivers it to the private instance. The internet sees only the NAT Gateway's public IP, never the private instance.

NAT Gateways are **managed by AWS** — you do not need to patch or maintain them. For high availability, deploy a NAT Gateway in each Availability Zone you use, with private subnets in each AZ routing to the NAT Gateway in the same AZ.

An older approach used **NAT Instances** — EC2 instances you managed yourself configured to perform NAT. NAT Gateways are preferred because they are managed, scalable, and highly available.`,
    },
    {
      heading: "VPC Connectivity Options",
      body: `You often need to connect your VPC to other networks — other VPCs, your on-premises data center, or AWS services.

**VPC Peering** creates a direct, private network connection between two VPCs (in the same or different accounts and regions). Traffic flows over the AWS backbone, not the internet. Peering is not transitive: if VPC A peers with B and B peers with C, A cannot reach C through B.

**AWS Transit Gateway** is a hub-and-spoke service that connects thousands of VPCs and on-premises networks through a single gateway, solving the complexity of managing many peering connections.

**AWS Site-to-Site VPN** creates an encrypted tunnel between your on-premises network and your VPC over the public internet. It is quick to set up and cost-effective for lower-bandwidth needs.

**AWS Direct Connect** provides a dedicated, private physical connection from your data center to AWS, bypassing the public internet. It offers consistent bandwidth, lower latency, and potentially lower data transfer costs for high-volume workloads.

**VPC Endpoints** allow resources inside your VPC to communicate with AWS services (like S3 or DynamoDB) privately, without going through the internet or a NAT Gateway. Gateway endpoints (for S3 and DynamoDB) are free; Interface endpoints (for most other services) use AWS PrivateLink.`,
    },
  ],

  keyFacts: [
    "A VPC is a logically isolated virtual network within an AWS region",
    "VPCs are divided into subnets; each subnet belongs to one Availability Zone",
    "Public subnets route to an Internet Gateway; private subnets do not",
    "Security Groups are stateful (return traffic automatic); NACLs are stateless",
    "NAT Gateway allows private instances to reach the internet without being publicly exposed",
    "VPC Peering connects two VPCs privately; it is not transitive",
    "AWS Transit Gateway connects many VPCs and on-premises networks through a hub",
    "Direct Connect is a dedicated private physical connection to AWS",
    "Site-to-Site VPN uses encrypted tunnels over the public internet",
    "VPC Endpoints allow private access to AWS services without internet routing",
  ],

  relatedServices: [
    "Amazon EC2",
    "Amazon RDS",
    "AWS Direct Connect",
    "AWS Transit Gateway",
    "Amazon Route 53",
  ],

  examTips: [
    "Security Groups = stateful, instance level; NACLs = stateless, subnet level",
    "A public subnet has a route to an Internet Gateway; that is what makes it public",
    "NAT Gateway goes in a public subnet and enables outbound internet for private instances",
    "VPC Peering is not transitive — you need Transit Gateway for mesh connectivity",
    "Direct Connect is private, dedicated bandwidth; VPN is encrypted over the internet",
    "VPC Endpoints let you access S3 or DynamoDB without internet traffic or NAT",
    "Default VPC is created automatically in each region for quick use",
  ],
};
