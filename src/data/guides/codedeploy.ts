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
      body: `**Application**: logical grouping of a deployment configuration. Specifies the compute platform (EC2/On-Premises, Lambda, ECS).

**Deployment Group**: a set of targets to deploy to. For EC2: instances tagged with specific key-value pairs or within an Auto Scaling Group. For Lambda: a function alias. For ECS: a service.

**Deployment Configuration**: determines how traffic is shifted during deployment. Options vary by compute platform.

**Revision**: the version of the application to deploy. For EC2: an AppSpec file + application files (from S3 or GitHub). For Lambda: AppSpec file referencing function version. For ECS: AppSpec file referencing task definition.

**AppSpec file (appspec.yml or appspec.json)**: defines what CodeDeploy deploys and lifecycle hooks to run.

**CodeDeploy Agent**: daemon running on EC2/on-premises instances. Polls CodeDeploy for work, executes deployment instructions. Not needed for Lambda or ECS.`,
    },
    {
      heading: "Deployment Types",
      body: `**In-Place (EC2/On-Premises only)**:
- CodeDeploy installs the new version on existing instances
- Instances are briefly out of service during deployment
- ALB: optionally deregister instance from ALB before update, re-register after
- Rollback: re-deploy the previous version
- Lower cost (no new instances)

**Blue/Green**:
- New instances provisioned with new version (green)
- After health checks pass, traffic shifts from old (blue) to new (green)
- Blue instances remain temporarily for rollback
- Higher cost temporarily (two sets of instances)

**For EC2 Blue/Green**: Auto Scaling Group launches new instances, traffic shifted via ALB.

**For Lambda**: shift traffic between two function versions via an alias.
- Canary: send X% to new version for Y minutes, then all-or-nothing
- Linear: shift X% more every Y minutes until 100%
- All-at-once: immediate full shift

**For ECS**: shift traffic between two ALB target groups (blue/green ECS-specific pattern).
- Canary, Linear, All-at-once traffic shifting
- Rollback: shift traffic back to original target group`,
    },
    {
      heading: "AppSpec File",
      body: `**EC2 AppSpec (appspec.yml)**:
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

**Lambda AppSpec**:
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

**ECS AppSpec**: similar to Lambda; references task definition ARN and container/port info.

**Lifecycle hooks** (EC2): ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService.`,
    },
    {
      heading: "Rollback & Monitoring",
      body: `**Automatic Rollback**: configure CodeDeploy to automatically roll back when:
- Deployment fails
- CloudWatch Alarm fires (e.g. error rate increases after deploy)

**Manual Rollback**: trigger a new deployment with the previous revision.

**Rollback behavior**: CodeDeploy does NOT undo changes — it re-deploys the last known good revision. For in-place, this means running the previous version's scripts.

**CloudWatch Alarms integration**: attach CloudWatch alarms to a deployment group. If an alarm fires during or after deployment, CodeDeploy automatically rolls back.

**Deployment lifecycle events**: each phase logged in CodeDeploy console with success/failure. View script output, error messages.

**Notifications**: SNS notifications for deployment success, failure, rollback events.

**CloudTrail**: all CodeDeploy API calls logged for audit.`,
    },
    {
      heading: "CodeDeploy for Lambda",
      body: `Lambda deployments use **alias traffic shifting** — CodeDeploy shifts the percentage of traffic directed to a Lambda alias between two versions.

**Prerequisites**:
1. Publish Lambda function versions (not just $LATEST)
2. Create an alias pointing to the stable version
3. Create an AppSpec referencing the new version

**Traffic shifting strategies**:
- **Canary10Percent5Minutes**: 10% for 5 minutes, then 100% or rollback
- **Canary10Percent30Minutes**: 10% for 30 minutes, then 100%
- **Linear10PercentEvery1Minute**: increase 10% per minute
- **Linear10PercentEvery10Minutes**: increase 10% per 10 minutes
- **AllAtOnce**: immediate 100% (no traffic shifting, just version swap)

**Pre/Post traffic hooks**: Lambda functions called before and after traffic shift.
- BeforeAllowTraffic: validate new version (check config, warmup, smoke test)
- AfterAllowTraffic: validate after traffic shifted (monitor error rate)

**Automatic rollback**: if BeforeAllowTraffic hook fails OR CloudWatch alarm fires → CodeDeploy shifts traffic back to original version immediately.

**Use case**: safe Lambda deployments with automatic rollback on errors — critical for production APIs.`,
    },
    {
      heading: "CodeDeploy with Other Services",
      body: `**CodeDeploy + CodePipeline**: CodePipeline's Deploy stage invokes CodeDeploy. Pipeline passes the deployment package from CodeBuild; CodeDeploy deploys it.

**CodeDeploy + EC2 Auto Scaling**: deployment group targets an ASG. New instances launched by ASG automatically get the latest deployed revision (via auto-scaling hook). Ensures fleet consistency.

**CodeDeploy + ALB / NLB**: traffic shifting uses ALB target groups. CodeDeploy registers/deregisters instances from ALB during deployment. Enables zero-downtime deploys.

**CodeDeploy + CloudWatch Alarms**: attach alarms to deployment group. CodeDeploy monitors alarms post-deployment and rolls back automatically on alarm state.

**CodeDeploy + Lambda**: orchestrates canary/linear traffic shifting between Lambda versions via alias. Works with CloudWatch alarms for automatic rollback.

**CodeDeploy + ECS**: blue/green deployments for ECS services. Two target groups; CodeDeploy manages traffic shift. Instant rollback by reverting target group routing.

**CodeDeploy + SNS**: notifications on deployment events (started, succeeded, failed, rolled back).`,
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
