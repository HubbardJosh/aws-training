import { ServiceGuide } from "../../../types/guide";

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
      quiz: [
        {
          question:
            "Which compute platforms require the CodeDeploy Agent to be installed?",
          options: [
            "EC2, Lambda, and ECS — all platforms require the agent",
            "Lambda and ECS only — EC2 uses API-based deployments",
            "EC2 and on-premises instances — Lambda and ECS do not need the agent",
            "Only on-premises instances — EC2 uses EC2 instance connect",
          ],
          correctIndex: 2,
          explanation:
            "The CodeDeploy Agent is required on EC2 and on-premises instances — it polls for deployment work, downloads the revision, and executes lifecycle hooks. Lambda and ECS deployments do not require an agent; CodeDeploy manages traffic shifting directly through Lambda aliases and ALB target groups.",
        },
        {
          question: "What is a CodeDeploy deployment group?",
          options: [
            "A set of buildspec.yml files used across multiple deployments",
            "The set of deployment targets (EC2 instances by tag, an ASG, a Lambda alias, or ECS service) within a CodeDeploy application",
            "A group of developers with permission to trigger deployments",
            "A collection of AppSpec files stored in S3",
          ],
          correctIndex: 1,
          explanation:
            "A deployment group defines the specific targets for a deployment within a CodeDeploy application. For EC2, this is instances selected by tag or ASG membership. For Lambda, it's an alias. For ECS, it's a specific service. The deployment group also holds the deployment configuration (pace of traffic shifting).",
        },
      ],
    },
    {
      heading: "Deployment Types",
      body: `CodeDeploy supports two fundamental deployment strategies, with the available options differing by compute platform.

**In-place deployment** (EC2/On-Premises only) installs the new version on each existing instance. The instances are briefly out of service during the update, though you can configure CodeDeploy to deregister instances from an ALB before updating them and re-register after — minimizing the window where users might hit an updating instance. In-place rollback means re-deploying the previous revision.

**Blue/green deployment** takes a different approach: it provisions a new set of instances (or a new ECS task revision, or a new Lambda version) with the new code, verifies that they're healthy, then shifts traffic from the old environment to the new one. The old environment stays around temporarily, making rollback as fast as redirecting traffic back.

For **Lambda**, CodeDeploy manages traffic shifting between two function versions through an alias. The three shifting strategies are Canary (shift X% for Y minutes, then all-or-rollback), Linear (shift X% more every Y minutes until 100%), and AllAtOnce (immediate full shift). For **ECS**, CodeDeploy shifts traffic between two ALB target groups — blue carries current traffic, green gets the new task revision, and traffic moves from blue to green. ECS blue/green deployments also support Canary, Linear, and AllAtOnce shifting.`,
      quiz: [
        {
          question:
            "Which deployment type is available ONLY for EC2/On-Premises in CodeDeploy?",
          options: [
            "Blue/green deployment",
            "Canary deployment",
            "In-place deployment",
            "Linear deployment",
          ],
          correctIndex: 2,
          explanation:
            "In-place deployment is available only for EC2 and on-premises targets. It installs the new version on existing instances, which are briefly out of service during the update. Lambda and ECS use blue/green strategies with traffic shifting — there is no in-place option for those platforms.",
        },
        {
          question:
            "What does the 'Canary10Percent5Minutes' Lambda deployment configuration mean?",
          options: [
            "10% of functions are replaced every 5 minutes until all are updated",
            "10% of traffic shifts to the new version for 5 minutes, then either 100% shifts or it rolls back",
            "The deployment takes 5 minutes with 10% validation checks",
            "10 canary Lambda functions test the new version for 5 minutes before production deployment",
          ],
          correctIndex: 1,
          explanation:
            "Canary10Percent5Minutes sends 10% of traffic to the new Lambda function version for 5 minutes while monitoring CloudWatch alarms. If no alarms fire, 100% of traffic shifts to the new version. If an alarm fires during those 5 minutes, CodeDeploy rolls back to the original version.",
        },
        {
          question:
            "In ECS blue/green deployments, what mechanism does CodeDeploy use to shift traffic?",
          options: [
            "Route 53 weighted routing between two ECS clusters",
            "Two ALB target groups — blue for current traffic, green for the new task revision",
            "Two separate ECS clusters with DNS failover",
            "Lambda@Edge routing requests between two ECS services",
          ],
          correctIndex: 1,
          explanation:
            "ECS blue/green deployments use two ALB target groups. The blue target group carries current live traffic; the green target group receives the new task revision. CodeDeploy shifts traffic from blue to green using the ALB listener rules, supporting Canary, Linear, and AllAtOnce strategies.",
        },
      ],
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
      quiz: [
        {
          question:
            "What is the correct EC2 lifecycle event order in a CodeDeploy AppSpec?",
          options: [
            "BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService",
            "ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService",
            "DownloadBundle → BeforeInstall → Install → ApplicationStart → ValidateService → ApplicationStop",
            "Install → BeforeInstall → AfterInstall → ApplicationStart → ValidateService",
          ],
          correctIndex: 1,
          explanation:
            "The EC2 lifecycle event order is: ApplicationStop → DownloadBundle → BeforeInstall → Install → AfterInstall → ApplicationStart → ValidateService. If any hook script fails, the deployment fails and CodeDeploy can automatically roll back.",
        },
        {
          question:
            "In a Lambda AppSpec file, what does the BeforeAllowTraffic hook allow you to do?",
          options: [
            "Validate the Lambda function's IAM permissions before deployment",
            "Run validation code (smoke tests, warmup) before any real user traffic reaches the new Lambda version",
            "Configure the Lambda alias to point to the new version",
            "Check CloudWatch alarms before the traffic shift begins",
          ],
          correctIndex: 1,
          explanation:
            "The BeforeAllowTraffic hook runs your validation code before CodeDeploy shifts any traffic to the new Lambda version. If this hook fails, CodeDeploy rolls back without ever exposing users to the new version. This is the safest point to run smoke tests and warmup requests.",
        },
      ],
    },
    {
      heading: "Rollback & Monitoring",
      body: `CodeDeploy's rollback behavior is worth understanding precisely. A **rollback does not undo changes** — it triggers a new deployment of the previously working revision. For in-place deployments, this means running the old version's installation scripts. The previous version's files must still be available in S3 or GitHub for the rollback deployment to succeed.

You can configure **automatic rollback** on two triggers: deployment failure (any lifecycle hook fails) and CloudWatch Alarm breach (a metric you care about degrades after deployment). The CloudWatch Alarm integration is particularly useful — you can alarm on your application's error rate or latency, and if those metrics spike within a configurable window after deployment, CodeDeploy automatically reverts the change. For Lambda and ECS blue/green, rollback is nearly instantaneous because it just shifts traffic back to the original version/target group.

For Lambda specifically, the **BeforeAllowTraffic** hook is especially powerful. It runs your validation code — smoke tests, warmup requests, configuration checks — before any real user traffic reaches the new version. If the hook fails, CodeDeploy rolls back without ever exposing users to the new version. The **AfterAllowTraffic** hook validates behavior after traffic has started flowing, and its failure also triggers automatic rollback.`,
      quiz: [
        {
          question: "What does a CodeDeploy rollback actually do?",
          options: [
            "Reverts all file changes and restores the previous application state",
            "Triggers a new deployment of the previously working revision — it does not undo changes",
            "Restores the EC2 instance from an EBS snapshot taken before deployment",
            "Reverts the ALB target group registration to the previous state",
          ],
          correctIndex: 1,
          explanation:
            "A CodeDeploy rollback is not an undo operation — it triggers a new deployment using the previously working revision. The old revision files must still be available in S3 or GitHub. For Lambda and ECS blue/green, rollback is nearly instantaneous since it's just a traffic shift back to the original version.",
        },
        {
          question:
            "What are the two triggers for automatic rollback in CodeDeploy?",
          options: [
            "Deployment timeout and health check failure",
            "Deployment failure (lifecycle hook fails) and CloudWatch Alarm breach",
            "SNS notification failure and EventBridge rule mismatch",
            "S3 artifact unavailability and IAM permission error",
          ],
          correctIndex: 1,
          explanation:
            "CodeDeploy supports automatic rollback on two triggers: (1) deployment failure, where any lifecycle hook script fails, and (2) CloudWatch Alarm breach, where a metric like error rate or latency spikes after deployment. The CloudWatch Alarm integration provides a safety net based on real application health.",
        },
      ],
    },
    {
      heading: "CodeDeploy for Lambda",
      body: `Lambda deployments use **alias traffic shifting** — CodeDeploy gradually moves the percentage of traffic directed at a Lambda alias from one version to another. To use this, you must have published Lambda function versions (not just \`$LATEST\`), created an alias pointing to the stable version, and have a new version to shift to.

The traffic shifting strategies have descriptive names that encode the behavior. **Canary10Percent5Minutes** sends 10% of traffic to the new version for 5 minutes, then shifts everything — or rolls back if problems are detected. **Linear10PercentEvery1Minute** adds 10% per minute until reaching 100%. **AllAtOnce** is an immediate full shift with no gradual ramp — useful when you're confident in the new version and want zero downtime from traffic splitting.

During the shift, CloudWatch monitors your configured alarms. If any alarm fires, CodeDeploy immediately shifts all traffic back to the original version. This means your Lambda deployments have an automatic safety net: deploy, let traffic flow, and if error rates or latency increase, the system automatically reverts. This is the production-grade deployment pattern for critical Lambda functions that serve live traffic.`,
      quiz: [
        {
          question:
            "What Lambda resource must exist before CodeDeploy can perform alias traffic shifting?",
          options: [
            "A Lambda layer containing the deployment configuration",
            "Published Lambda function versions and an alias — $LATEST cannot be used for traffic shifting",
            "An EventBridge rule to trigger the deployment",
            "A Lambda destination configured on the function",
          ],
          correctIndex: 1,
          explanation:
            "Lambda alias traffic shifting requires published function versions (not $LATEST) and an alias that points to the stable version. CodeDeploy shifts traffic between versions through the alias. $LATEST is not a version and cannot be used with CodeDeploy traffic shifting.",
        },
        {
          question:
            "What happens during a Lambda canary deployment if a CloudWatch alarm fires?",
          options: [
            "The deployment pauses and waits for manual approval to continue",
            "CodeDeploy immediately shifts all traffic back to the original Lambda version",
            "The alarm is ignored — CodeDeploy completes the shift regardless",
            "CodeDeploy shifts to 50% and waits for the alarm to clear",
          ],
          correctIndex: 1,
          explanation:
            "If a CloudWatch alarm fires during a Lambda canary deployment, CodeDeploy immediately shifts 100% of traffic back to the original version. This automatic rollback on alarm provides a safety net — if the new version causes elevated error rates or latency, the system reverts without manual intervention.",
        },
      ],
    },
    {
      heading: "CodeDeploy with Other Services",
      body: `CodeDeploy rarely operates in isolation — it's almost always part of a larger pipeline or automation. **CodePipeline's Deploy stage** is the most common trigger: the pipeline sources code, builds an artifact, and passes it to CodeDeploy for deployment to EC2, Lambda, or ECS. This creates the end-to-end CI/CD flow where a code commit flows through to production automatically.

For EC2 fleets managed by Auto Scaling, CodeDeploy integrates directly with the **Auto Scaling Group**. When a new instance launches due to scaling, it automatically receives the latest deployed revision — the ASG hooks into CodeDeploy's lifecycle to ensure fleet consistency. Without this integration, new instances would launch with the base AMI code rather than the currently deployed version.

**ALB and NLB integration** is how blue/green deployments achieve zero downtime. CodeDeploy registers new instances into a new target group, waits for health checks to pass, shifts traffic via the listener rules, drains the old connections, then deregisters the old instances. The entire process happens through the load balancer without any downtime to clients.

CodeDeploy publishes deployment events to **SNS** and **EventBridge**, enabling notifications and automated responses. You can receive an email when a deployment completes, trigger a Lambda function to send a Slack message, or automatically open a ServiceNow incident when a deployment fails.`,
      quiz: [
        {
          question:
            "When a new EC2 instance launches in an Auto Scaling Group integrated with CodeDeploy, what happens?",
          options: [
            "The instance launches with the base AMI and must be manually updated",
            "The instance automatically receives the latest deployed CodeDeploy revision",
            "CodeDeploy pauses the deployment until the new instance is manually registered",
            "The instance is immediately terminated and replaced by a pre-baked AMI",
          ],
          correctIndex: 1,
          explanation:
            "When CodeDeploy is integrated with an Auto Scaling Group, new instances launching due to scaling automatically receive the latest deployed revision. The ASG lifecycle hooks connect to CodeDeploy to ensure fleet consistency — without this, new instances would run the base AMI code.",
        },
        {
          question:
            "How does CodeDeploy achieve zero-downtime blue/green deployments for EC2 with an ALB?",
          options: [
            "By deploying to instances in a different availability zone first",
            "By registering new instances in a new target group, waiting for health checks, shifting ALB traffic, draining old connections, then deregistering old instances",
            "By updating instances in-place one at a time while keeping other instances serving traffic",
            "By using Route 53 weighted routing to gradually shift DNS to new instances",
          ],
          correctIndex: 1,
          explanation:
            "Blue/green deployments register new instances in a new ALB target group. Once health checks pass, CodeDeploy shifts ALB listener traffic to the new target group, drains existing connections from the old instances, then deregisters them. The entire process happens via ALB without any downtime.",
        },
      ],
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

  topicQuiz: [
    {
      question:
        "A team deploys a Lambda function using CodeDeploy with a Canary10Percent5Minutes strategy. Two minutes into the shift, the error rate alarm fires. What does CodeDeploy do?",
      options: [
        "Completes the deployment and notifies the team via SNS",
        "Pauses the deployment at 10% and waits for manual approval",
        "Immediately shifts all traffic back to the original Lambda version",
        "Reduces the canary percentage to 5% and continues monitoring",
      ],
      correctIndex: 2,
      explanation:
        "When a CloudWatch alarm fires during a CodeDeploy canary deployment, CodeDeploy immediately shifts 100% of traffic back to the original version. This automatic rollback is the key safety mechanism — no manual intervention is required to protect production.",
    },
    {
      question:
        "A developer needs to run smoke tests against a new Lambda version before any real user traffic reaches it. Which CodeDeploy hook should be used?",
      options: [
        "AfterAllowTraffic",
        "BeforeInstall",
        "BeforeAllowTraffic",
        "ValidateService",
      ],
      correctIndex: 2,
      explanation:
        "BeforeAllowTraffic runs before CodeDeploy shifts any traffic to the new Lambda version. If the hook's Lambda function fails, CodeDeploy rolls back without exposing users to the new version. AfterAllowTraffic runs after traffic is already flowing — failures still trigger rollback but users may have already been affected.",
    },
    {
      question:
        "An on-premises server needs to be managed by CodeDeploy. What prerequisite must be met?",
      options: [
        "The server must be accessible via AWS Systems Manager Session Manager",
        "The CodeDeploy Agent must be installed on the server",
        "The server must run Amazon Linux 2",
        "The server must have an IAM instance profile attached",
      ],
      correctIndex: 1,
      explanation:
        "The CodeDeploy Agent must be installed and running on on-premises servers (and EC2 instances). The agent polls CodeDeploy for deployment work, downloads the revision, and executes lifecycle hooks. No agent is needed for Lambda or ECS deployments.",
    },
    {
      question:
        "What is the key difference between blue/green rollback and in-place rollback in CodeDeploy?",
      options: [
        "Blue/green rollback is manual; in-place rollback is automatic",
        "Blue/green rollback is nearly instantaneous (shift traffic back); in-place rollback re-deploys the previous revision to existing instances",
        "In-place rollback uses snapshots; blue/green rollback uses DNS switching",
        "They are identical — both trigger a new deployment of the previous revision",
      ],
      correctIndex: 1,
      explanation:
        "Blue/green rollback is nearly instantaneous — CodeDeploy simply shifts ALB traffic back to the old target group (blue), since the old environment was kept running. In-place rollback requires re-deploying the previous revision to existing instances by running installation scripts again, which takes time.",
    },
    {
      question:
        "A company uses CodeDeploy with an Auto Scaling Group. When a new instance launches during a peak-traffic scale-out event, what version of the application does it run?",
      options: [
        "The version baked into the launch template AMI",
        "The latest deployed CodeDeploy revision, deployed automatically by the ASG-CodeDeploy integration",
        "No application — the instance must be manually enrolled in a CodeDeploy deployment group",
        "The version specified in the deployment group's minimum healthy hosts configuration",
      ],
      correctIndex: 1,
      explanation:
        "When CodeDeploy is integrated with an Auto Scaling Group, new instances automatically receive the latest deployed revision via ASG lifecycle hooks. Without this integration, new instances would run the base AMI code and not the currently deployed application version.",
    },
    {
      question:
        "Which CodeDeploy deployment strategy adds 10% of traffic to a new Lambda version every minute until reaching 100%?",
      options: [
        "Canary10Percent10Minutes",
        "AllAtOnce",
        "Linear10PercentEvery1Minute",
        "Rolling10Percent",
      ],
      correctIndex: 2,
      explanation:
        "Linear10PercentEvery1Minute increases the percentage of traffic going to the new Lambda version by 10% each minute, reaching 100% after 10 minutes. During this time, CloudWatch alarms are monitored and any alarm triggers an automatic rollback.",
    },
    {
      question:
        "A CodeDeploy deployment to EC2 fails at the AfterInstall hook. What happens next by default?",
      options: [
        "The deployment retries the AfterInstall hook up to 3 times",
        "The deployment fails and CodeDeploy can automatically roll back by re-deploying the previous revision",
        "The deployment skips AfterInstall and continues to ApplicationStart",
        "The instance is terminated and replaced by a new one from the AMI",
      ],
      correctIndex: 1,
      explanation:
        "If any lifecycle hook script fails, the deployment fails. If automatic rollback on deployment failure is configured, CodeDeploy triggers a new deployment of the previously working revision. CodeDeploy does not retry individual hooks — failure means failure.",
    },
    {
      question:
        "For an ECS blue/green deployment using CodeDeploy, what does 'green' represent?",
      options: [
        "The ECS cluster running the current stable version",
        "The new ALB target group receiving the new ECS task revision",
        "The production environment after the deployment is complete",
        "The canary percentage of traffic being tested",
      ],
      correctIndex: 1,
      explanation:
        "In CodeDeploy ECS blue/green deployments, the green target group receives the new ECS task revision. The blue target group carries current live traffic. CodeDeploy shifts traffic from blue to green, and the old blue tasks are terminated after the bake time. Rollback means shifting traffic back to blue.",
    },
  ],
};
