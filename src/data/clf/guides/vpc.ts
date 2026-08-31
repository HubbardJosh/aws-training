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
      quiz: [
        {
          question: "What is an Amazon VPC?",
          options: [
            "A dedicated physical server reserved exclusively for one AWS customer",
            "A logically isolated virtual network within an AWS region where you control IP ranges, subnets, and routing",
            "A global content delivery network that spans all AWS regions",
            "A managed service that automatically configures networking for EC2 instances",
          ],
          correctIndex: 1,
          explanation:
            "A VPC is a logically isolated virtual network within an AWS region. You define a CIDR block for the IP address range, create subnets across Availability Zones, and control routing and security. It resembles a traditional data center network but hosted in AWS.",
        },
        {
          question:
            "What scope does an Amazon VPC have within the AWS infrastructure?",
          options: [
            "Regional — a VPC spans all Availability Zones within one region but not across regions",
            "Global — a single VPC can span multiple AWS regions",
            "Availability Zone — each VPC is confined to a single AZ",
            "Account-level — a single VPC spans all regions in an AWS account",
          ],
          correctIndex: 0,
          explanation:
            "VPCs are region-scoped: a single VPC spans all Availability Zones within its region but does not extend across regions. You create subnets in specific AZs within the VPC to place resources in different AZs for high availability.",
        },
      ],
    },
    {
      heading: "Subnets, Route Tables, and Gateways",
      body: `A **subnet** is a subdivision of a VPC's CIDR block, and it is always associated with a single Availability Zone. You create multiple subnets in different AZs to achieve high availability.

Subnets are classified as **public** or **private** based on their routing:
- A **public subnet** has a route in its route table pointing to an **Internet Gateway (IGW)**, allowing resources inside to communicate directly with the internet.
- A **private subnet** has no direct internet route. Resources here can reach the internet through a **NAT Gateway** (for outbound-only traffic), but are not directly reachable from the internet.

A **route table** defines how traffic flows within and out of a subnet. Each subnet is associated with one route table, though multiple subnets can share the same table. The route table contains rules like "traffic destined for 0.0.0.0/0 (any internet address) goes to the Internet Gateway."

An **Internet Gateway** is a horizontally scaled, redundant, and highly available VPC component that allows communication between your VPC and the internet. Attaching an IGW to a VPC and adding the appropriate route to a subnet's route table makes that subnet public.`,
      quiz: [
        {
          question: "What makes a VPC subnet 'public' as opposed to 'private'?",
          options: [
            "The subnet has a larger CIDR block than private subnets",
            "The subnet's route table has a route pointing to an Internet Gateway (IGW)",
            "The subnet is located in a specific Availability Zone that AWS designates as public",
            "The subnet has a security group that allows inbound traffic from the internet",
          ],
          correctIndex: 1,
          explanation:
            "A subnet is classified as public when its route table contains a route pointing to an Internet Gateway (IGW). This allows resources in the subnet to communicate directly with the internet. Without an IGW route, the subnet is private.",
        },
        {
          question:
            "A company needs to deploy a web application where the web servers are publicly accessible but the database servers are not directly reachable from the internet. What VPC architecture achieves this?",
          options: [
            "Place all resources in a single public subnet with security groups restricting database access",
            "Place web servers in a public subnet (with IGW route) and database servers in a private subnet (no IGW route)",
            "Place all resources in a private subnet and use an Internet Gateway for selective public access",
            "Use two separate VPCs — one for public resources and one for private resources",
          ],
          correctIndex: 1,
          explanation:
            "The standard architecture is to place web servers in public subnets (with an IGW route for internet access) and database servers in private subnets (no IGW route, not directly reachable from the internet). Security groups provide additional access control between tiers.",
        },
      ],
    },
    {
      heading: "Security: Security Groups and NACLs",
      body: `VPC provides two layers of network security: **Security Groups** and **Network Access Control Lists (NACLs)**.

**Security Groups** operate at the instance level (EC2, RDS, etc.). They are **stateful** — if an inbound rule allows traffic, the return traffic is automatically allowed regardless of outbound rules. Security groups only have allow rules; you cannot explicitly deny traffic. You typically define rules like "allow TCP port 80 from anywhere" or "allow port 5432 from the application security group."

**Network ACLs (NACLs)** operate at the subnet level and are **stateless** — you must explicitly allow both inbound and outbound traffic for each connection. NACLs support both allow and deny rules, processed in order by rule number. They are useful for blocking specific IP ranges across an entire subnet.

For most workloads, security groups are sufficient and NACLs provide an additional layer. The Cloud Practitioner exam often tests the stateful vs. stateless distinction.`,
      quiz: [
        {
          question:
            "What is the key difference between Security Groups and Network ACLs (NACLs) in a VPC?",
          options: [
            "Security Groups support deny rules; NACLs only support allow rules",
            "Security Groups are free; NACLs incur additional charges per rule",
            "Security Groups are stateful (return traffic automatic); NACLs are stateless (must explicitly allow both directions)",
            "Security Groups are applied at the subnet level; NACLs are applied at the instance level",
          ],
          correctIndex: 2,
          explanation:
            "Security Groups are stateful — allowing inbound traffic automatically allows the return traffic. NACLs are stateless — you must explicitly allow both inbound and outbound traffic for each connection. Security Groups operate at the instance level; NACLs at the subnet level.",
        },
        {
          question:
            "A security team wants to block all traffic from a specific IP range at the network level across an entire subnet. Which VPC security mechanism is most appropriate?",
          options: [
            "A VPC endpoint policy that blocks traffic from the IP range",
            "A Security Group deny rule applied to all instances in the subnet",
            "A Network ACL (NACL) deny rule, which can block IP ranges at the subnet level",
            "An IAM policy that restricts network access from the specified IP range",
          ],
          correctIndex: 2,
          explanation:
            "NACLs are the right tool for blocking specific IP ranges at the subnet level. Unlike Security Groups (which only support allow rules), NACLs support both allow and deny rules, and they operate at the subnet level — applying to all resources within the subnet.",
        },
      ],
    },
    {
      heading: "NAT Gateway and Internet Connectivity",
      body: `Resources in private subnets often need outbound internet access — for example, to download software updates or call external APIs — without being directly accessible from the internet. A **NAT Gateway** (Network Address Translation) enables this pattern.

A NAT Gateway is deployed in a **public subnet** and has an Elastic IP. Private subnet instances route internet-bound traffic to the NAT Gateway, which translates the private source IP to its own Elastic IP before forwarding the packet. The response comes back to the NAT Gateway, which translates it back and delivers it to the private instance. The internet sees only the NAT Gateway's public IP, never the private instance.

NAT Gateways are **managed by AWS** — you do not need to patch or maintain them. For high availability, deploy a NAT Gateway in each Availability Zone you use, with private subnets in each AZ routing to the NAT Gateway in the same AZ.

An older approach used **NAT Instances** — EC2 instances you managed yourself configured to perform NAT. NAT Gateways are preferred because they are managed, scalable, and highly available.`,
      quiz: [
        {
          question:
            "A private subnet EC2 instance needs to download security patches from the internet, but should not be directly reachable from the internet. What should be configured?",
          options: [
            "An Elastic IP attached directly to the private EC2 instance",
            "A VPC Endpoint for the software repository the instance downloads from",
            "An Internet Gateway attached to the private subnet's route table",
            "A NAT Gateway in a public subnet, with the private subnet's route table pointing to it",
          ],
          correctIndex: 3,
          explanation:
            "A NAT Gateway deployed in a public subnet allows private subnet instances to initiate outbound internet connections (for patch downloads, API calls, etc.) while remaining unreachable from the internet. The private subnet route table directs internet-bound traffic to the NAT Gateway.",
        },
      ],
    },
    {
      heading: "VPC Connectivity Options",
      body: `You often need to connect your VPC to other networks — other VPCs, your on-premises data center, or AWS services.

**VPC Peering** creates a direct, private network connection between two VPCs (in the same or different accounts and regions). Traffic flows over the AWS backbone, not the internet. Peering is not transitive: if VPC A peers with B and B peers with C, A cannot reach C through B.

**AWS Transit Gateway** is a hub-and-spoke service that connects thousands of VPCs and on-premises networks through a single gateway, solving the complexity of managing many peering connections.

**AWS Site-to-Site VPN** creates an encrypted tunnel between your on-premises network and your VPC over the public internet. It is quick to set up and cost-effective for lower-bandwidth needs.

**AWS Direct Connect** provides a dedicated, private physical connection from your data center to AWS, bypassing the public internet. It offers consistent bandwidth, lower latency, and potentially lower data transfer costs for high-volume workloads.

**VPC Endpoints** allow resources inside your VPC to communicate with AWS services (like S3 or DynamoDB) privately, without going through the internet or a NAT Gateway. Gateway endpoints (for S3 and DynamoDB) are free; Interface endpoints (for most other services) use AWS PrivateLink.`,
      quiz: [
        {
          question:
            "What is a key limitation of VPC Peering that AWS Transit Gateway solves?",
          options: [
            "VPC Peering is not transitive — A-to-B and B-to-C peering does not allow A to reach C; Transit Gateway provides hub-and-spoke connectivity",
            "VPC Peering has a maximum bandwidth of 1 Gbps; Transit Gateway supports higher throughput",
            "VPC Peering requires both VPCs to be in the same AWS account; Transit Gateway supports cross-account connections",
            "VPC Peering only works within a single AWS region; Transit Gateway enables cross-region connectivity",
          ],
          correctIndex: 0,
          explanation:
            "VPC Peering is not transitive — if VPC A is peered with B, and B is peered with C, A cannot reach C through B. Managing many VPCs with peering requires N*(N-1)/2 connections. Transit Gateway solves this with a hub-and-spoke model that connects thousands of VPCs through a single gateway.",
        },
        {
          question:
            "A company wants to connect their on-premises data center to AWS with a dedicated private connection that bypasses the public internet for consistent bandwidth and lower latency. Which service should they use?",
          options: [
            "AWS Transit Gateway — a hub connecting VPCs and on-premises networks",
            "AWS Direct Connect — a dedicated private physical connection to AWS",
            "VPC Peering — a private connection between two VPCs",
            "AWS Site-to-Site VPN — an encrypted tunnel over the public internet",
          ],
          correctIndex: 1,
          explanation:
            "AWS Direct Connect provides a dedicated, private physical connection from a customer's data center to AWS, bypassing the public internet. It offers consistent bandwidth, lower latency, and potentially lower data transfer costs — ideal for high-volume workloads with strict performance requirements.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "An EC2 instance in a private subnet needs to access the Amazon S3 API without routing traffic through the internet or a NAT Gateway. What should be configured?",
      options: [
        "A NAT Gateway in the private subnet with an S3 route",
        "A Site-to-Site VPN tunnel from the VPC to the S3 service endpoint",
        "An Internet Gateway attached to the private subnet",
        "A VPC Endpoint (Gateway type) for S3, which routes traffic privately to S3",
      ],
      correctIndex: 3,
      explanation:
        "A VPC Gateway Endpoint for S3 allows resources in a VPC to communicate with S3 privately without going through the internet or a NAT Gateway. Gateway endpoints for S3 and DynamoDB are free and simply require adding a route to the subnet's route table.",
    },
    {
      question:
        "What AWS service would you use to connect hundreds of VPCs and multiple on-premises networks through a single managed hub?",
      options: [
        "AWS Direct Connect — a physical connection to each VPC",
        "VPC Peering — creating direct connections between each pair of VPCs",
        "AWS PrivateLink — for privately accessing services across VPCs",
        "AWS Transit Gateway — a hub-and-spoke service for connecting many VPCs and networks",
      ],
      correctIndex: 3,
      explanation:
        "AWS Transit Gateway is a hub-and-spoke service that connects thousands of VPCs and on-premises networks through a single gateway. It eliminates the need for complex peering meshes and greatly simplifies network management at scale.",
    },
    {
      question:
        "Which VPC security feature operates at the subnet level and is stateless?",
      options: [
        "Security Groups — stateless, subnet level",
        "Network ACLs (NACLs) — stateless, subnet level",
        "Security Groups — stateful, instance level",
        "Network ACLs (NACLs) — stateful, instance level",
      ],
      correctIndex: 1,
      explanation:
        "Network ACLs (NACLs) operate at the subnet level and are stateless — you must explicitly allow both inbound and outbound traffic. Security Groups operate at the instance level and are stateful — allowing inbound traffic automatically permits return traffic.",
    },
    {
      question:
        "A company wants to establish a fast, private connection from their data center to AWS with consistent throughput, but needs it deployed within days rather than weeks. Which option should they choose?",
      options: [
        "AWS Direct Connect — the fastest and most reliable option available immediately",
        "AWS Transit Gateway — connects on-premises to AWS without any physical setup",
        "VPC Peering — a private connection that can be configured rapidly",
        "AWS Site-to-Site VPN — an encrypted connection over the internet that can be set up quickly",
      ],
      correctIndex: 3,
      explanation:
        "AWS Site-to-Site VPN can be set up quickly (minutes to hours) using software configuration and internet infrastructure. AWS Direct Connect requires physical fiber installation at a colocation facility which takes weeks to months. VPN is the right choice for speed of deployment.",
    },
    {
      question:
        "Where must a NAT Gateway be deployed, and what does it enable?",
      options: [
        "In a private subnet; it enables inbound internet connections to private instances",
        "In a public subnet; it enables private subnet instances to make outbound internet connections without being directly reachable from the internet",
        "In any subnet; it provides network address translation for both inbound and outbound connections",
        "In a private subnet; it translates between IPv4 and IPv6 addresses for VPC resources",
      ],
      correctIndex: 1,
      explanation:
        "A NAT Gateway must be deployed in a public subnet (where it has a route to the Internet Gateway). It enables instances in private subnets to initiate outbound internet connections while remaining unreachable from the internet — the internet sees only the NAT Gateway's Elastic IP.",
    },
    {
      question:
        "A company has three VPCs (A, B, C). VPC A is peered with VPC B, and VPC B is peered with VPC C. Can resources in VPC A communicate with resources in VPC C?",
      options: [
        "No — VPC Peering is not transitive; A cannot reach C through B without a direct A-to-C peering connection",
        "No — VPC Peering is limited to two VPCs and cannot involve a third VPC",
        "Yes — traffic is automatically routed through VPC B via transitive peering",
        "Yes — but only if VPC B has routing rules explicitly forwarding traffic between A and C",
      ],
      correctIndex: 0,
      explanation:
        "VPC Peering is NOT transitive. Even though A-B and B-C peering connections exist, resources in VPC A cannot communicate with resources in VPC C through VPC B. A direct peering connection between A and C would be required, or AWS Transit Gateway should be used for hub-and-spoke connectivity.",
    },
    {
      question:
        "Which of the following correctly describes how Security Groups handle return traffic?",
      options: [
        "Security Groups are stateful — if an inbound rule allows traffic, the return traffic is automatically allowed without a separate outbound rule",
        "Security Groups block all return traffic by default — you must configure bidirectional allow rules",
        "Security Groups are stateless — you must add explicit outbound rules to allow return traffic for inbound connections",
        "Security Groups delegate return traffic decisions to the Network ACL associated with the subnet",
      ],
      correctIndex: 0,
      explanation:
        "Security Groups are stateful — when an inbound rule allows traffic, the return traffic for that connection is automatically allowed regardless of outbound rules. This differs from NACLs, which are stateless and require explicit rules for both inbound and outbound traffic.",
    },
    {
      question: "What does the default VPC in an AWS region provide?",
      options: [
        "A shared VPC that all AWS customers in the region use for their public-facing resources",
        "A VPC with no subnets that must be fully configured before any resources can be launched",
        "A pre-configured VPC with public subnets in each AZ, an Internet Gateway, and default route tables so EC2 instances can launch with internet access immediately",
        "A pre-configured VPC with private subnets only, requiring manual IGW configuration for public access",
      ],
      correctIndex: 2,
      explanation:
        "AWS automatically creates a default VPC in each region with public subnets in each AZ, an Internet Gateway already attached, and default route tables configured. This allows EC2 instances to launch with internet connectivity immediately without any network configuration.",
    },
  ],
};
