import { ServiceGuide } from "../../types/guide";

export const codedeployGuide: ServiceGuide = {
  id: "aws-codedeploy",
  service: "AWS CodeDeploy",
  domain: "deployment",
  tagline: "Automated application deployments to EC2, Lambda, and ECS",
  intro:
    "CodeDeploy automates application deployments to Amazon EC2, on-premises servers, AWS Lambda, and Amazon ECS. It handles rolling updates, blue/green deployments, rollbacks on failure, and traffic shifting — enabling zero-downtime deployments with fine-grained control.",

  sections: [
    {
      heading: "Core Concepts",
      body: `CodeDeploy is organized around a few key abstractions. An **application** is a logical container that groups deployment configurations for a specific compute platform — you create one application per deployable unit, and you specify upfront whether it targets EC2/On-Premises, Lambda, or ECS, because each platform has a different deployment model.

A **deployment group** defines the targets within an application. For EC2, targets are instances selected by tag (like \`Environment: production\`) or Auto Scaling Group membership. For Lambda, it's an alias pointing to two function versions. For ECS, it's a specific service.

The **deployment configuration** controls the pace of deployment — how traffic shifts from the old version to the new. A **revision** is the specific version to deploy: for EC2, it's an AppSpec file plus application files (stored in S3 or GitHub); for Lambda and ECS, it's an AppSpec file that references the new version.

The **CodeDeploy Agent** is a daemon that runs on EC2 and on-premises instances. It polls CodeDeploy for deployment work, downloads the revision, and executes the AppSpec lifecycle hooks. For Lambda and ECS deployments, no agent is needed — CodeDeploy manages the traffic shifting directly through the Lambda aliases and ALB target groups.`,
    },
    {
      heading: "Deployment Types",
      body: `CodeDeploy supports two fundamental deployment strategies, with the available options differing by compute platform.

**In-place deployment** (EC2/On-Premises only) installs the new version on each existing instance. The instances are briefly out of service during the update, though you can configure CodeDeploy to deregister instances from an ALB before updating them and re-register after — minimizing the window where users might hit an updating instance. In-place rollback means re-deploying the previous revision.

**Blue/green deployment** takes a different approach: it provisions a new set of instances (or a new ECS task revision, or a new Lambda version) with the new code, verifies that they're healthy, then shifts traffic from the old environment to the new one. The old environment stays around temporarily, making rollback as fast as redirecting traffic back.

For **Lambda**, CodeDeploy manages traffic shifting between two function versions through an alias. The three shifting strategies are Canary (shift X% for Y minutes, then all-or-rollback), Linear (shift X% more every Y minutes until 100%), and AllAtOnce (immediate full shift). For **ECS**, CodeDeploy shifts traffic between two ALB target groups — blue carries current traffic, green gets the new task revision, and traffic moves from blue to green. ECS blue/green deployments also support Canary, Linear, and AllAtOnce shifting.`,
    },
    {
      heading: "AppSpec File",
      body: `The **appspec.yml** file is the deployment manifest that tells CodeDeploy what to deploy and what lifecycle hooks to run. The structure differs significantly between compute platforms.

For EC2 deployments, the AppSpec specifies which files to copy where and hooks to run at each lifecycle event:

\`\`\`yaml
version: 0.0
os: linux
files:
  - source: /
    destination: /var/www/myapp
hooks:
  BeforeInstall:
    - location: scripts/stop_server.sh
      timeout: 60
      runas: root
  AfterInstall:
    - location: scripts/start_server.sh
      timeout: 60
  ApplicationStart:
    - location: scripts/healthcheck.sh
      timeout: 300
  ValidateService:
    - location: scripts/smoke_test.sh
      timeout: 300
\`\`\`

For Lambda deployments, the AppSpec references the function name, alias, and the two versions to shift traffic between:

\`\`\`yaml
version: 0.0
Resources:
  - MyLambdaFunction:
      Type: AWS::Lambda::Function
      Properties:
        Name: myFunction
        Alias: live
        CurrentVersion: 1
        TargetVersion: 2
Hooks:
  - BeforeAllowTraffic: validateBeforeTraffic
  - AfterAllowTraffic: validateAfterTraffic
\`\`\`

The EC2 lifecycle event order is: ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService. Each event can have one or more scripts attached with individual timeout settings. If any script fails, the deployment fails and CodeDeploy can roll back automatically.`,
    },
    {
      heading: "Rollback & Monitoring",
      body: `CodeDeploy's rollback behavior is worth understanding precisely. A **rollback does not undo changes** — it triggers a new deployment of the previously working revision. For in-place deployments, this means running the old version's installation scripts. The previous version's files must still be available in S3 or GitHub for the rollback deployment to succeed.

You can configure **automatic rollback** on two triggers: deployment failure (any lifecycle hook fails) and CloudWatch Alarm breach (a metric you care about degrades after deployment). The CloudWatch Alarm integration is particularly useful — you can alarm on your application's error rate or latency, and if those metrics spike within a configurable window after deployment, CodeDeploy automatically reverts the change. For Lambda and ECS blue/green, rollback is nearly instantaneous because it just shifts traffic back to the original version/target group.

For Lambda specifically, the **BeforeAllowTraffic** hook is especially powerful. It runs your validation code — smoke tests, warmup requests, configuration checks — before any real user traffic reaches the new version. If the hook fails, CodeDeploy rolls back without ever exposing users to the new version. The **AfterAllowTraffic** hook validates behavior after traffic has started flowing, and its failure also triggers automatic rollback.`,
    },
    {
      heading: "CodeDeploy for Lambda",
      body: `Lambda deployments use **alias traffic shifting** — CodeDeploy gradually moves the percentage of traffic directed at a Lambda alias from one version to another. To use this, you must have published Lambda function versions (not just \`$LATEST\`), created an alias pointing to the stable version, and have a new version to shift to.

The traffic shifting strategies have descriptive names that encode the behavior. **Canary10Percent5Minutes** sends 10% of traffic to the new version for 5 minutes, then shifts everything — or rolls back if problems are detected. **Linear10PercentEvery1Minute** adds 10% per minute until reaching 100%. **AllAtOnce** is an immediate full shift with no gradual ramp — useful when you're confident in the new version and want zero downtime from traffic splitting.

During the shift, CloudWatch monitors your configured alarms. If any alarm fires, CodeDeploy immediately shifts all traffic back to the original version. This means your Lambda deployments have an automatic safety net: deploy, let traffic flow, and if error rates or latency increase, the system automatically reverts. This is the production-grade deployment pattern for critical Lambda functions that serve live traffic.`,
    },
    {
      heading: "CodeDeploy with Other Services",
      body: `CodeDeploy rarely operates in isolation — it's almost always part of a larger pipeline or automation. **CodePipeline's Deploy stage** is the most common trigger: the pipeline sources code, builds an artifact, and passes it to CodeDeploy for deployment to EC2, Lambda, or ECS. This creates the end-to-end CI/CD flow where a code commit flows through to production automatically.

For EC2 fleets managed by Auto Scaling, CodeDeploy integrates directly with the **Auto Scaling Group**. When a new instance launches due to scaling, it automatically receives the latest deployed revision — the ASG hooks into CodeDeploy's lifecycle to ensure fleet consistency. Without this integration, new instances would launch with the base AMI code rather than the currently deployed version.

**ALB and NLB integration** is how blue/green deployments achieve zero downtime. CodeDeploy registers new instances into a new target group, waits for health checks to pass, shifts traffic via the listener rules, drains the old connections, then deregisters the old instances. The entire process happens through the load balancer without any downtime to clients.

CodeDeploy publishes deployment events to **SNS** and **EventBridge**, enabling notifications and automated responses. You can receive an email when a deployment completes, trigger a Lambda function to send a Slack message, or automatically open a ServiceNow incident when a deployment fails.`,
    },
  ],

  keyFacts: [
    "Compute platforms: EC2/On-Premises, Lambda, ECS (each has different AppSpec format)",
    "In-place: update existing instances. Blue/Green: new instances, traffic shift, rollback-ready.",
    "CodeDeploy Agent: required on EC2/on-premises. Not needed for Lambda or ECS.",
    "Lambda traffic shifting: Canary (X% → 100%), Linear (X% per interval), AllAtOnce",
    "BeforeAllowTraffic / AfterAllowTraffic hooks: validate before/after Lambda traffic shift",
    "Automatic rollback: on deployment failure OR CloudWatch alarm firing",
    "AppSpec hooks (EC2): ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService",
    "Rollback deploys previous revision — does not undo, just re-deploys old version",
    "ECS blue/green: two ALB target groups; instant rollback by switching target group",
    "ASG integration: new Auto Scaling instances automatically get latest deployed revision",
  ],

  relatedServices: [
    "AWS CodePipeline",
    "AWS CodeBuild",
    "Amazon EC2",
    "AWS Lambda",
    "Amazon ECS",
    "Elastic Load Balancing",
    "Amazon CloudWatch",
    "Amazon SNS",
    "AWS Auto Scaling",
  ],

  examTips: [
    "CodeDeploy Agent needed for EC2/on-premises. NOT needed for Lambda or ECS.",
    "Lambda canary: 10% to new version → monitor → all-or-rollback. No fleet to manage.",
    "Blue/green rollback = instantaneous (switch traffic back). In-place rollback = re-deploy old version.",
    "CloudWatch alarm + deployment group = automatic rollback on post-deploy metric spike.",
    "BeforeAllowTraffic hook failure → automatic rollback before any traffic shifted to new Lambda.",
    "ECS blue/green = two ALB target groups (not two clusters).",
    "ASG + CodeDeploy: new ASG instances automatically receive the latest deployment.",
    "AppSpec must be at root of deployment package or specify path in deployment group.",
  ],
};
