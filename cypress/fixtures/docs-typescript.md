# Construct Hub

This project maintains a [AWS Cloud Development Kit][aws-cdk] construct library
that can be used to deploy instances of the Construct Hub in any AWS Account.

This software backs the public instance of the
[ConstructHub](https://constructs.dev), and can be used to deploy a self-hosted
instance with personalized configuration.

[aws-cdk]: https://github.com/aws/aws-cdk

## :question: Getting Started

> :warning: Disclaimer
>
> The [public instance of ConstructHub](https://constructs.dev) is currently in
> _Developer Preview_.
>
> Self-hosted ConstructHub instances are however in active development and
> should be considered _experimental_. Breaking changes to the public API of
> this package are expected to be released without prior notice, and the
> infrastructure and operational posture of ConstructHub instances may also
> significantly change.
>
> You are welcome to deploy self-hosted instances of ConstructHub for evaluation
> purposes, and we welcome any feedback (good or bad) from your experience in
> doing so.

### Quick Start

Once you have installed the `construct-hub` library in your project, the
simplest way to get started is to create an instance of the `ConstructHub`
construct:

```ts
import { App, Stack } from "@aws-cdk/core";
import { ConstructHub } from "construct-hub";

// The usual... you might have used `cdk init app` instead!
const app = new App();
const stack = new Stack(app, "StackName", {
  /* ... */
});

// Now to business!
new ConstructHub(stack, "ConstructHub");
```

### Personalization

#### Using a custom domain name

In order to use a custom domain for your ConstructHub instance instead of the
default CloudFront domain name, specify the `domain` property with the following
elements:

| Attribute                      | Description                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `zone`                         | A Route53 Hosted Zone, where DNS records will be added.                                           |
| `cert`                         | An Amazon Certificate Manager certificate, which must be in the `us-east-1` region.               |
| `monitorCertificateExpiration` | Set to `false` if you do not want an alarm to be created when the certificate is close to expiry. |

Your self-hosted ConstructHub instance will be served from the root of the
provided `zone`, so the certificate must match this name.

#### Alternate package sources

By default, ConstructHub has a single package source configured: the public
`npmjs.com` registry. Self-hosted instances typically should list packages from
alternate sources, either in addition to packages from `npmjs.com`, or instead
of those.

The `packageSources` property can be used to replace the default set of package
sources configured on the instance. ConstructHub provides `IPackageSource`
implementations for the public `npmjs.com` registry as well as for private
CodeArtifact repositories:

```ts
import * as codeartifact from "@aws-cdk/aws-codeartifact";
import { App, Stack } from "@aws-cdk/core";
import { sources, ConstructHub } from "construct-hub";

// The usual... you might have used `cdk init app` instead!
const app = new App();
const stack = new Stack(app, "StackName", {
  /* ... */
});

// Now to business!
const registry = new codeartifact.CfnRegistry(stack, "Registry", {
  // ....
});
new ConstructHub(stack, "ConstructHub", {
  packageSources: [
    new sources.NpmJs(), // Remove if you do NOT want npmjs.com packages
    new sources.CodeArtifact({ registry }),
  ],
});
```

You may also implement a custom `IPackageSource` if you want to index packages
from alternate locations. In this case, the component you provide will be
responsible for sending notifications to an SQS Queue about newly discovered
packages. You may refer to the [sources.NpmJs] and [sources.CodeArtifact]
implementations as a reference for hos this can be done.

[sources.npmjs]: src/package-sources/npmjs.ts
[sources.codeartifact]: src/package-sources/code-artifact.ts

#### Package deny list

Certain packages may be undesirable to show in your self-hosted ConstructHub
instance. In order to prevent a package from ever being listed in construct hub,
the `denyList` property can be configured with a set of `DenyListRule` objects
that specify which package or package versions should never be lested:

```ts
import { App, Stack } from "@aws-cdk/core";
import { ConstructHub } from "construct-hub";

// The usual... you might have used `cdk init app` instead!
const app = new App();
const stack = new Stack(app, "StackName", {
  /* ... */
});

// Now to business!
new ConstructHub(stack, "ConstructHub", {
  denyList: [
    // Denying _all_ versions of the "sneaky-hackery" package
    {
      packageName: "sneaky-hackery",
      reason: "Mines bitcoins wherever it gets installed",
    },
    // Denying _a specific_ version of the "bad-release" package
    { packageName: "bad-release", version: "1.2.3", reason: "CVE-####-#####" },
  ],
});
```

#### Decrease deployment footprint

By default, ConstructHub executes the documentation rendering process in the
context of isolated subnets. This is a defense-in-depth mechanism to mitigate
the risks associated with downloading aribtrary (un-trusted) _npm packages_ and
their dependency closures.

This layer of security implies the creation of a number of resources that can
increase the operating cost of your self-hosted instance: several VPC endpoints
are created, an internal CodeArtifact repository needs to be provisioned, etc...

While we generally recommend leaving these features enabled, if your self-hosted
ConstructHub instance only indexes _trusted_ packages (as could be the case for
an instance that does not list packages from the public `npmjs.com` registry),
you may set the `isolateLambdas` setting to `false`.

## :gear: Operating a self-hosted instance

1. [Application Overview](./docs/application-overview.md) provides a high-level
   description of the components that make a ConstructHub instance. This is a
   great starting point for people who consider operating a self-hosted instance
   of ConstructHub; and for new operators on-boarding the platform.

1. [Operator Runbook](./docs/operator-runbook.md) is a series of diagnostics and
   troubleshooting guides indended for operators to have a quick and easy way to
   navigate a ConstructHub instance when they are reacting to an alarm or bug
   report.

### :nail_care: Customizing the frontend

There are a number of customizations available in order to make your private
construct hub better tailored to your organization.

#### Package Tags

Configuring package tags allows you to compute additional labels to be applied
to packages. These can be used to indicate to users which packages are owned by
trusted organizations, or any other arbitrary conditions, and can be referenced
while searching.

For example:

```ts
new ConstructHub(this, "ConstructHub", {
  ...myProps,
  packageTags: [
    {
      label: "Official",
      color: "#00FF00",
      condition: TagCondition.field("name").eq("construct-hub"),
    },
  ],
});
```

The above example will result in packages with the `name` of `construct-hub` to
receive the `Official` tag, which is colored green.

Combinations of conditions are also supported:

```ts
new ConstructHub(this, "ConstructHub", {
  ...myProps,
  packageTags: [{
    label: 'Official',
    color: '#00FF00',
    condition: TagCondition.or(
      TagCondition.field('name').eq('construct-hub'),
      TagCondition.field('name').eq('construct-hub-webapp'),
    ),
  }]
});

// or more succintly if you have a long list
condition: TagCondition.or(
  ...['construct-hub', 'construct-hub-webapp', '...',]
    .map(name => TagCondition.field('name').eq(name))
),
```

You can assert against any value within package json including nested ones.

```ts
TagCondition.field("constructHub", "nested", "key").eq("value");

// checks
packageJson?.constructHub?.nested?.key === value;
```

#### Package Links

Configuring package links allows you to replace the `Repository`, `License`,
and `Registry` links on the package details page with whatever you choose.

For example:

```ts
new ConstructHub(this, "ConstructHub", {
  ...myProps,
  packageLinks: [
    {
      linkLabel: "Service Level Agreement",
      configKey: "SLA",
    },
    {
      linkLabel: "Contact",
      configKey: "Contact",
      linkText: "Email Me!",
      allowedDomains: ["me.com"],
    },
  ],
});
```

This would allow publishers to add the following to their package.json:

```json
"constructHub": {
  "packageLinks": {
    "SLA": "https://support.mypackage.com",
    "Contact": "me.com/contact"
  }
}
```

Then the links on the corresponding package page would show these items as
configured.

#### Home Page

The home page is divided into sections, each with a header and list of packages.
Currently, for a given section you can display either the most recently updated
packages, or a curated list of packages.

For example:

```ts
new ConstructHub(this, "ConstructHub", {
  ...myProps,
  featuredPackages: {
    sections: [
      {
        name: "Recently updated",
        showLastUpdated: 4
      },
      {
        name: "From the AWS CDK",
        showPackages: [
          {
            name: "@aws-cdk/core"
          },
          {
            name: "@aws-cdk/aws-s3",
            comment: "One of the most popular AWS CDK libraries!"
          },
          {
            name: "@aws-cdk/aws-lambda"
          },
          {
            name: "@aws-cdk/pipelines"
            comment: "The pipelines L3 construct library abstracts away many of the details of managing software deployment within AWS."
          }
        ]
      }
    ]
  }
});
```

## :raised_hand: Contributing

If you are looking to contribute to this project, but don't know where to start,
have a look at our [contributing guide](CONTRIBUTING.md)!

## :cop: Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more
information.

## :balance_scale: License

This project is licensed under the Apache-2.0 License.

# API Reference <span data-heading-title="API Reference" data-heading-id="api-reference"></span>

## Constructs <span data-heading-title="Constructs" data-heading-id="constructs"></span>

### ConstructHub <span data-heading-title="ConstructHub" data-heading-id="constructhubconstructhub"></span>

- _Implements:_ [`@aws-cdk/aws-iam.IGrantable`](/packages/@aws-cdk/aws-iam/v/1.126.0?lang=typescript#awscdkawsiamigrantable)

Construct Hub.

#### Initializers <span data-heading-title="Initializers" data-heading-id="constructhubconstructhubinitializer"></span>

```typescript
import { ConstructHub } from 'construct-hub'

new ConstructHub(scope: Construct, id: string, props?: ConstructHubProps)
```

##### `scope`<sup>Required</sup> <span data-heading-title="`scope`<sup>Required</sup>" data-heading-id="constructhubconstructhubparameterscope"></span>

- _Type:_ [`constructs.Construct`](/packages/constructs/v/3.3.161?lang=typescript#constructsconstruct)

---

##### `id`<sup>Required</sup> <span data-heading-title="`id`<sup>Required</sup>" data-heading-id="constructhubconstructhubparameterid"></span>

- _Type:_ `string`

---

##### `props`<sup>Optional</sup> <span data-heading-title="`props`<sup>Optional</sup>" data-heading-id="constructhubconstructhubparameterprops"></span>

- _Type:_ [`construct-hub.ConstructHubProps`](#constructhubconstructhubprops)

---

#### Properties <span data-heading-title="Properties" data-heading-id="properties"></span>

##### `grantPrincipal`<sup>Required</sup> <span data-heading-title="`grantPrincipal`<sup>Required</sup>" data-heading-id="constructhubconstructhubpropertygrantprincipal"></span>

```typescript
public readonly grantPrincipal: IPrincipal;
```

- _Type:_ [`@aws-cdk/aws-iam.IPrincipal`](/packages/@aws-cdk/aws-iam/v/1.126.0?lang=typescript#awscdkawsiamiprincipal)

The principal to grant permissions to.

---

##### `ingestionQueue`<sup>Required</sup> <span data-heading-title="`ingestionQueue`<sup>Required</sup>" data-heading-id="constructhubconstructhubpropertyingestionqueue"></span>

```typescript
public readonly ingestionQueue: IQueue;
```

- _Type:_ [`@aws-cdk/aws-sqs.IQueue`](/packages/@aws-cdk/aws-sqs/v/1.126.0?lang=typescript#awscdkawssqsiqueue)

---

## Structs <span data-heading-title="Structs" data-heading-id="structs"></span>

### AlarmActions <span data-heading-title="AlarmActions" data-heading-id="constructhubalarmactions"></span>

CloudWatch alarm actions to perform.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { AlarmActions } from 'construct-hub'

const alarmActions: AlarmActions = { ... }
```

##### `highSeverity`<sup>Optional</sup> <span data-heading-title="`highSeverity`<sup>Optional</sup>" data-heading-id="constructhubalarmactionspropertyhighseverity"></span>

```typescript
public readonly highSeverity: string;
```

- _Type:_ `string`

The ARN of the CloudWatch alarm action to take for alarms of high-severity alarms.

This must be an ARN that can be used with CloudWatch alarms.

> https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-actions

---

##### `highSeverityAction`<sup>Optional</sup> <span data-heading-title="`highSeverityAction`<sup>Optional</sup>" data-heading-id="constructhubalarmactionspropertyhighseverityaction"></span>

```typescript
public readonly highSeverityAction: IAlarmAction;
```

- _Type:_ [`@aws-cdk/aws-cloudwatch.IAlarmAction`](/packages/@aws-cdk/aws-cloudwatch/v/1.126.0?lang=typescript#awscdkawscloudwatchialarmaction)

The CloudWatch alarm action to take for alarms of high-severity alarms.

This must be an ARN that can be used with CloudWatch alarms.

> https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-actions

---

##### `normalSeverity`<sup>Optional</sup> <span data-heading-title="`normalSeverity`<sup>Optional</sup>" data-heading-id="constructhubalarmactionspropertynormalseverity"></span>

```typescript
public readonly normalSeverity: string;
```

- _Type:_ `string`
- _Default:_ no actions are taken in response to alarms of normal severity

The ARN of the CloudWatch alarm action to take for alarms of normal severity.

This must be an ARN that can be used with CloudWatch alarms.

> https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-actions

---

##### `normalSeverityAction`<sup>Optional</sup> <span data-heading-title="`normalSeverityAction`<sup>Optional</sup>" data-heading-id="constructhubalarmactionspropertynormalseverityaction"></span>

```typescript
public readonly normalSeverityAction: IAlarmAction;
```

- _Type:_ [`@aws-cdk/aws-cloudwatch.IAlarmAction`](/packages/@aws-cdk/aws-cloudwatch/v/1.126.0?lang=typescript#awscdkawscloudwatchialarmaction)
- _Default:_ no actions are taken in response to alarms of normal severity

The CloudWatch alarm action to take for alarms of normal severity.

This must be an ARN that can be used with CloudWatch alarms.

> https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html#alarms-and-actions

---

### CodeArtifactDomainProps <span data-heading-title="CodeArtifactDomainProps" data-heading-id="constructhubcodeartifactdomainprops"></span>

Information pertaining to an existing CodeArtifact Domain.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { CodeArtifactDomainProps } from 'construct-hub'

const codeArtifactDomainProps: CodeArtifactDomainProps = { ... }
```

##### `name`<sup>Required</sup> <span data-heading-title="`name`<sup>Required</sup>" data-heading-id="constructhubcodeartifactdomainpropspropertyname"></span>

```typescript
public readonly name: string;
```

- _Type:_ `string`

The name of the CodeArtifact domain.

---

##### `upstreams`<sup>Optional</sup> <span data-heading-title="`upstreams`<sup>Optional</sup>" data-heading-id="constructhubcodeartifactdomainpropspropertyupstreams"></span>

```typescript
public readonly upstreams: string[];
```

- _Type:_ `string`[]

Any upstream repositories in this CodeArtifact domain that should be configured on the internal CodeArtifact repository.

---

### ConstructHubProps <span data-heading-title="ConstructHubProps" data-heading-id="constructhubconstructhubprops"></span>

Props for `ConstructHub`.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { ConstructHubProps } from 'construct-hub'

const constructHubProps: ConstructHubProps = { ... }
```

##### `alarmActions`<sup>Optional</sup> <span data-heading-title="`alarmActions`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertyalarmactions"></span>

```typescript
public readonly alarmActions: AlarmActions;
```

- _Type:_ [`construct-hub.AlarmActions`](#constructhubalarmactions)

Actions to perform when alarms are set.

---

##### `allowedLicenses`<sup>Optional</sup> <span data-heading-title="`allowedLicenses`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertyallowedlicenses"></span>

```typescript
public readonly allowedLicenses: SpdxLicense[];
```

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)[]
- _Default:_ [...SpdxLicense.apache(),...SpdxLicense.bsd(),...SpdxLicense.mit()]

The allowed licenses for packages indexed by this instance of ConstructHub.

---

##### `backendDashboardName`<sup>Optional</sup> <span data-heading-title="`backendDashboardName`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertybackenddashboardname"></span>

```typescript
public readonly backendDashboardName: string;
```

- _Type:_ `string`

The name of the CloudWatch dashboard that represents the health of backend systems.

---

##### `codeArtifactDomain`<sup>Optional</sup> <span data-heading-title="`codeArtifactDomain`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertycodeartifactdomain"></span>

```typescript
public readonly codeArtifactDomain: CodeArtifactDomainProps;
```

- _Type:_ [`construct-hub.CodeArtifactDomainProps`](#constructhubcodeartifactdomainprops)
- _Default:_ none.

When using a CodeArtifact package source, it is often desirable to have ConstructHub provision it's internal CodeArtifact repository in the same CodeArtifact domain, and to configure the package source repository as an upstream of the internal repository.

This way, all packages in the source
are available to ConstructHub's backend processing.

---

##### `denyList`<sup>Optional</sup> <span data-heading-title="`denyList`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertydenylist"></span>

```typescript
public readonly denyList: DenyListRule[];
```

- _Type:_ [`construct-hub.DenyListRule`](#constructhubdenylistrule)[]
- _Default:_ []

A list of packages to block from the construct hub.

---

##### `domain`<sup>Optional</sup> <span data-heading-title="`domain`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertydomain"></span>

```typescript
public readonly domain: Domain;
```

- _Type:_ [`construct-hub.Domain`](#constructhubdomain)

Connect the hub to a domain (requires a hosted zone and a certificate).

---

##### `featuredPackages`<sup>Optional</sup> <span data-heading-title="`featuredPackages`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertyfeaturedpackages"></span>

```typescript
public readonly featuredPackages: FeaturedPackages;
```

- _Type:_ [`construct-hub.FeaturedPackages`](#constructhubfeaturedpackages)
- _Default:_ Display the 10 most recently updated packages

Configuration for packages to feature on the home page.

---

##### `isolateSensitiveTasks`<sup>Optional</sup> <span data-heading-title="`isolateSensitiveTasks`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertyisolatesensitivetasks"></span>

```typescript
public readonly isolateSensitiveTasks: boolean;
```

- _Type:_ `boolean`
- _Default:_ true

Whether compute environments for sensitive tasks (which operate on un-trusted complex data, such as the transliterator, which operates with externally-sourced npm package tarballs) should run in network-isolated environments.

This implies the creation of additonal resources, including:

- A VPC with only isolated subnets.
- VPC Endpoints (CloudWatch Logs, CodeArtifact, CodeArtifact API, S3, ...)
- A CodeArtifact Repository with an external connection to npmjs.com

---

##### `logRetention`<sup>Optional</sup> <span data-heading-title="`logRetention`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertylogretention"></span>

```typescript
public readonly logRetention: RetentionDays;
```

- _Type:_ [`@aws-cdk/aws-logs.RetentionDays`](/packages/@aws-cdk/aws-logs/v/1.126.0?lang=typescript#awscdkawslogsretentiondays)

How long to retain CloudWatch logs for.

---

##### `packageLinks`<sup>Optional</sup> <span data-heading-title="`packageLinks`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertypackagelinks"></span>

```typescript
public readonly packageLinks: PackageLinkConfig[];
```

- _Type:_ [`construct-hub.PackageLinkConfig`](#constructhubpackagelinkconfig)[]

Configuration for custom package page links.

---

##### `packageSources`<sup>Optional</sup> <span data-heading-title="`packageSources`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertypackagesources"></span>

```typescript
public readonly packageSources: IPackageSource[];
```

- _Type:_ [`construct-hub.IPackageSource`](#constructhubipackagesource)[]
- _Default:_ a standard npmjs.com package source will be configured.

The package sources to register with this ConstructHub instance.

---

##### `packageTags`<sup>Optional</sup> <span data-heading-title="`packageTags`<sup>Optional</sup>" data-heading-id="constructhubconstructhubpropspropertypackagetags"></span>

```typescript
public readonly packageTags: PackageTag[];
```

- _Type:_ [`construct-hub.PackageTag`](#constructhubpackagetag)[]

Configuration for custom package tags.

---

### DenyListMap <span data-heading-title="DenyListMap" data-heading-id="constructhubdenylistmap"></span>

The contents of the deny list file in S3.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { DenyListMap } from 'construct-hub'

const denyListMap: DenyListMap = { ... }
```

### DenyListRule <span data-heading-title="DenyListRule" data-heading-id="constructhubdenylistrule"></span>

An entry in the list of packages blocked from display in the construct hub.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { DenyListRule } from 'construct-hub'

const denyListRule: DenyListRule = { ... }
```

##### `packageName`<sup>Required</sup> <span data-heading-title="`packageName`<sup>Required</sup>" data-heading-id="constructhubdenylistrulepropertypackagename"></span>

```typescript
public readonly packageName: string;
```

- _Type:_ `string`

The name of the package to block (npm).

---

##### `reason`<sup>Required</sup> <span data-heading-title="`reason`<sup>Required</sup>" data-heading-id="constructhubdenylistrulepropertyreason"></span>

```typescript
public readonly reason: string;
```

- _Type:_ `string`

The reason why this package/version is denied.

This information will be
emitted to the construct hub logs.

---

##### `version`<sup>Optional</sup> <span data-heading-title="`version`<sup>Optional</sup>" data-heading-id="constructhubdenylistrulepropertyversion"></span>

```typescript
public readonly version: string;
```

- _Type:_ `string`
- _Default:_ all versions of this package are blocked.

The package version to block (must be a valid version such as "1.0.3").

---

### Domain <span data-heading-title="Domain" data-heading-id="constructhubdomain"></span>

Domain configuration for the website.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { Domain } from 'construct-hub'

const domain: Domain = { ... }
```

##### `cert`<sup>Required</sup> <span data-heading-title="`cert`<sup>Required</sup>" data-heading-id="constructhubdomainpropertycert"></span>

```typescript
public readonly cert: ICertificate;
```

- _Type:_ [`@aws-cdk/aws-certificatemanager.ICertificate`](/packages/@aws-cdk/aws-certificatemanager/v/1.126.0?lang=typescript#awscdkawscertificatemanagericertificate)
- _Default:_ a DNS-Validated certificate will be provisioned using the
  provided `hostedZone`.

The certificate to use for serving the Construct Hub over a custom domain.

---

##### `zone`<sup>Required</sup> <span data-heading-title="`zone`<sup>Required</sup>" data-heading-id="constructhubdomainpropertyzone"></span>

```typescript
public readonly zone: IHostedZone;
```

- _Type:_ [`@aws-cdk/aws-route53.IHostedZone`](/packages/@aws-cdk/aws-route53/v/1.126.0?lang=typescript#awscdkawsroute53ihostedzone)

The root domain name where this instance of Construct Hub will be served.

---

##### `monitorCertificateExpiration`<sup>Optional</sup> <span data-heading-title="`monitorCertificateExpiration`<sup>Optional</sup>" data-heading-id="constructhubdomainpropertymonitorcertificateexpiration"></span>

```typescript
public readonly monitorCertificateExpiration: boolean;
```

- _Type:_ `boolean`
- _Default:_ true

Whether the certificate should be monitored for expiration, meaning high severity alarms will be raised if it is due to expire in less than 45 days.

---

### FeaturedPackages <span data-heading-title="FeaturedPackages" data-heading-id="constructhubfeaturedpackages"></span>

Configuration for packages to feature on the home page.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { FeaturedPackages } from 'construct-hub'

const featuredPackages: FeaturedPackages = { ... }
```

##### `sections`<sup>Required</sup> <span data-heading-title="`sections`<sup>Required</sup>" data-heading-id="constructhubfeaturedpackagespropertysections"></span>

```typescript
public readonly sections: FeaturedPackagesSection[];
```

- _Type:_ [`construct-hub.FeaturedPackagesSection`](#constructhubfeaturedpackagessection)[]

Grouped sections of packages on the homepage.

---

### FeaturedPackagesDetail <span data-heading-title="FeaturedPackagesDetail" data-heading-id="constructhubfeaturedpackagesdetail"></span>

Customization options for a specific package on the home page.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { FeaturedPackagesDetail } from 'construct-hub'

const featuredPackagesDetail: FeaturedPackagesDetail = { ... }
```

##### `name`<sup>Required</sup> <span data-heading-title="`name`<sup>Required</sup>" data-heading-id="constructhubfeaturedpackagesdetailpropertyname"></span>

```typescript
public readonly name: string;
```

- _Type:_ `string`

The name of the package.

---

##### `comment`<sup>Optional</sup> <span data-heading-title="`comment`<sup>Optional</sup>" data-heading-id="constructhubfeaturedpackagesdetailpropertycomment"></span>

```typescript
public readonly comment: string;
```

- _Type:_ `string`

An additional comment to include with the package.

---

### FeaturedPackagesSection <span data-heading-title="FeaturedPackagesSection" data-heading-id="constructhubfeaturedpackagessection"></span>

Customization options for one section of the home page.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { FeaturedPackagesSection } from 'construct-hub'

const featuredPackagesSection: FeaturedPackagesSection = { ... }
```

##### `name`<sup>Required</sup> <span data-heading-title="`name`<sup>Required</sup>" data-heading-id="constructhubfeaturedpackagessectionpropertyname"></span>

```typescript
public readonly name: string;
```

- _Type:_ `string`

The name of the section (displayed as a header).

---

##### `showLastUpdated`<sup>Optional</sup> <span data-heading-title="`showLastUpdated`<sup>Optional</sup>" data-heading-id="constructhubfeaturedpackagessectionpropertyshowlastupdated"></span>

```typescript
public readonly showLastUpdated: number;
```

- _Type:_ `number`

Show the N most recently updated packages in this section.

Cannot be used with `showPackages`.

---

##### `showPackages`<sup>Optional</sup> <span data-heading-title="`showPackages`<sup>Optional</sup>" data-heading-id="constructhubfeaturedpackagessectionpropertyshowpackages"></span>

```typescript
public readonly showPackages: FeaturedPackagesDetail[];
```

- _Type:_ [`construct-hub.FeaturedPackagesDetail`](#constructhubfeaturedpackagesdetail)[]

Show an explicit list of packages.

Cannot be used with `showLastUpdated`.

---

### LinkedResource <span data-heading-title="LinkedResource" data-heading-id="constructhublinkedresource"></span>

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { LinkedResource } from 'construct-hub'

const linkedResource: LinkedResource = { ... }
```

##### `name`<sup>Required</sup> <span data-heading-title="`name`<sup>Required</sup>" data-heading-id="constructhublinkedresourcepropertyname"></span>

```typescript
public readonly name: string;
```

- _Type:_ `string`

The name of the linked resource.

---

##### `url`<sup>Required</sup> <span data-heading-title="`url`<sup>Required</sup>" data-heading-id="constructhublinkedresourcepropertyurl"></span>

```typescript
public readonly url: string;
```

- _Type:_ `string`

The URL where the linked resource can be found.

---

##### `primary`<sup>Optional</sup> <span data-heading-title="`primary`<sup>Optional</sup>" data-heading-id="constructhublinkedresourcepropertyprimary"></span>

```typescript
public readonly primary: boolean;
```

- _Type:_ `boolean`

Whether this is the primary resource of the bound package source.

It is not
necessary that there is one, and there could be multiple primary resources.
The buttons for those will be rendered with a different style on the
dashboard.

---

### PackageLinkConfig <span data-heading-title="PackageLinkConfig" data-heading-id="constructhubpackagelinkconfig"></span>

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { PackageLinkConfig } from 'construct-hub'

const packageLinkConfig: PackageLinkConfig = { ... }
```

##### `configKey`<sup>Required</sup> <span data-heading-title="`configKey`<sup>Required</sup>" data-heading-id="constructhubpackagelinkconfigpropertyconfigkey"></span>

```typescript
public readonly configKey: string;
```

- _Type:_ `string`

The location of the value inside the constructHub.packageLinks key of a module's package.json.

---

##### `linkLabel`<sup>Required</sup> <span data-heading-title="`linkLabel`<sup>Required</sup>" data-heading-id="constructhubpackagelinkconfigpropertylinklabel"></span>

```typescript
public readonly linkLabel: string;
```

- _Type:_ `string`

The name of the link, appears before the ":" on the website.

---

##### `allowedDomains`<sup>Optional</sup> <span data-heading-title="`allowedDomains`<sup>Optional</sup>" data-heading-id="constructhubpackagelinkconfigpropertyalloweddomains"></span>

```typescript
public readonly allowedDomains: string[];
```

- _Type:_ `string`[]
- _Default:_ all domains allowed

allowList of domains for this link.

---

##### `linkText`<sup>Optional</sup> <span data-heading-title="`linkText`<sup>Optional</sup>" data-heading-id="constructhubpackagelinkconfigpropertylinktext"></span>

```typescript
public readonly linkText: string;
```

- _Type:_ `string`
- _Default:_ the url of the link

optional text to display as the hyperlink text.

---

### PackageSourceBindOptions <span data-heading-title="PackageSourceBindOptions" data-heading-id="constructhubpackagesourcebindoptions"></span>

Options for binding a package source.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { PackageSourceBindOptions } from 'construct-hub'

const packageSourceBindOptions: PackageSourceBindOptions = { ... }
```

##### `ingestion`<sup>Required</sup> <span data-heading-title="`ingestion`<sup>Required</sup>" data-heading-id="constructhubpackagesourcebindoptionspropertyingestion"></span>

```typescript
public readonly ingestion: IGrantable;
```

- _Type:_ [`@aws-cdk/aws-iam.IGrantable`](/packages/@aws-cdk/aws-iam/v/1.126.0?lang=typescript#awscdkawsiamigrantable)

The `IGrantable` that will process downstream messages from the bound package source.

It needs to be granted permissions to read package data
from the URLs sent to the `queue`.

---

##### `licenseList`<sup>Required</sup> <span data-heading-title="`licenseList`<sup>Required</sup>" data-heading-id="constructhubpackagesourcebindoptionspropertylicenselist"></span>

```typescript
public readonly licenseList: ILicenseList;
```

- _Type:_ [`construct-hub.ILicenseList`](#constructhubilicenselist)

The license list applied by the bound Construct Hub instance.

This can be
used to filter down the package only to those which will pass the license
filter.

---

##### `monitoring`<sup>Required</sup> <span data-heading-title="`monitoring`<sup>Required</sup>" data-heading-id="constructhubpackagesourcebindoptionspropertymonitoring"></span>

```typescript
public readonly monitoring: IMonitoring;
```

- _Type:_ [`construct-hub.IMonitoring`](#constructhubimonitoring)

The monitoring instance to use for registering alarms, etc.

---

##### `queue`<sup>Required</sup> <span data-heading-title="`queue`<sup>Required</sup>" data-heading-id="constructhubpackagesourcebindoptionspropertyqueue"></span>

```typescript
public readonly queue: IQueue;
```

- _Type:_ [`@aws-cdk/aws-sqs.IQueue`](/packages/@aws-cdk/aws-sqs/v/1.126.0?lang=typescript#awscdkawssqsiqueue)

The SQS queue to which messages should be sent.

Sent objects should match
the package discovery schema.

---

##### `denyList`<sup>Optional</sup> <span data-heading-title="`denyList`<sup>Optional</sup>" data-heading-id="constructhubpackagesourcebindoptionspropertydenylist"></span>

```typescript
public readonly denyList: IDenyList;
```

- _Type:_ [`construct-hub.IDenyList`](#constructhubidenylist)

The configured `DenyList` for the bound Construct Hub instance, if any.

---

##### `repository`<sup>Optional</sup> <span data-heading-title="`repository`<sup>Optional</sup>" data-heading-id="constructhubpackagesourcebindoptionspropertyrepository"></span>

```typescript
public readonly repository: IRepository;
```

- _Type:_ [`construct-hub.IRepository`](#constructhubirepository)

The CodeArtifact repository that is internally used by ConstructHub.

This
may be undefined if no CodeArtifact repository is internally used.

---

### PackageSourceBindResult <span data-heading-title="PackageSourceBindResult" data-heading-id="constructhubpackagesourcebindresult"></span>

The result of binding a package source.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { PackageSourceBindResult } from 'construct-hub'

const packageSourceBindResult: PackageSourceBindResult = { ... }
```

##### `dashboardWidgets`<sup>Required</sup> <span data-heading-title="`dashboardWidgets`<sup>Required</sup>" data-heading-id="constructhubpackagesourcebindresultpropertydashboardwidgets"></span>

```typescript
public readonly dashboardWidgets: IWidget[][];
```

- _Type:_ [`@aws-cdk/aws-cloudwatch.IWidget`](/packages/@aws-cdk/aws-cloudwatch/v/1.126.0?lang=typescript#awscdkawscloudwatchiwidget)[][]

Widgets to add to the operator dashbaord for monitoring the health of the bound package source.

It is not necessary for this list of widgets to
include a title section (this will be added automatically). One array
represents a row of widgets on the dashboard.

---

##### `name`<sup>Required</sup> <span data-heading-title="`name`<sup>Required</sup>" data-heading-id="constructhubpackagesourcebindresultpropertyname"></span>

```typescript
public readonly name: string;
```

- _Type:_ `string`

The name of the bound package source.

It will be used to render operator
dashboards (so it should be a meaningful identification of the source).

---

##### `links`<sup>Optional</sup> <span data-heading-title="`links`<sup>Optional</sup>" data-heading-id="constructhubpackagesourcebindresultpropertylinks"></span>

```typescript
public readonly links: LinkedResource[];
```

- _Type:_ [`construct-hub.LinkedResource`](#constructhublinkedresource)[]

An optional list of linked resources to be displayed on the monitoring dashboard.

---

### PackageTag <span data-heading-title="PackageTag" data-heading-id="constructhubpackagetag"></span>

Configuration for applying custom tags to relevant packages.

Custom tags are
displayed on the package details page, and can be used for searching.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { PackageTag } from 'construct-hub'

const packageTag: PackageTag = { ... }
```

##### `condition`<sup>Required</sup> <span data-heading-title="`condition`<sup>Required</sup>" data-heading-id="constructhubpackagetagpropertycondition"></span>

```typescript
public readonly condition: TagCondition;
```

- _Type:_ [`construct-hub.TagCondition`](#constructhubtagcondition)

The description of the logic that dictates whether the package has the tag applied.

---

##### `label`<sup>Required</sup> <span data-heading-title="`label`<sup>Required</sup>" data-heading-id="constructhubpackagetagpropertylabel"></span>

```typescript
public readonly label: string;
```

- _Type:_ `string`

The label for the tag being applied.

---

##### `color`<sup>Optional</sup> <span data-heading-title="`color`<sup>Optional</sup>" data-heading-id="constructhubpackagetagpropertycolor"></span>

```typescript
public readonly color: string;
```

- _Type:_ `string`

The hex value string for the color of the tag when displayed.

---

### PackageTagConfig <span data-heading-title="PackageTagConfig" data-heading-id="constructhubpackagetagconfig"></span>

Serialized tag declaration to be passed to lambdas via environment variables.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { PackageTagConfig } from 'construct-hub'

const packageTagConfig: PackageTagConfig = { ... }
```

##### `condition`<sup>Required</sup> <span data-heading-title="`condition`<sup>Required</sup>" data-heading-id="constructhubpackagetagconfigpropertycondition"></span>

```typescript
public readonly condition: TagConditionConfig;
```

- _Type:_ [`construct-hub.TagConditionConfig`](#constructhubtagconditionconfig)

---

##### `label`<sup>Required</sup> <span data-heading-title="`label`<sup>Required</sup>" data-heading-id="constructhubpackagetagconfigpropertylabel"></span>

```typescript
public readonly label: string;
```

- _Type:_ `string`

The label for the tag being applied.

---

##### `color`<sup>Optional</sup> <span data-heading-title="`color`<sup>Optional</sup>" data-heading-id="constructhubpackagetagconfigpropertycolor"></span>

```typescript
public readonly color: string;
```

- _Type:_ `string`

The hex value string for the color of the tag when displayed.

---

### TagConditionConfig <span data-heading-title="TagConditionConfig" data-heading-id="constructhubtagconditionconfig"></span>

Serialized config for a tag condition.

#### Initializer <span data-heading-title="Initializer" data-heading-id="object-objectinitializer"></span>

```typescript
import { TagConditionConfig } from 'construct-hub'

const tagConditionConfig: TagConditionConfig = { ... }
```

##### `type`<sup>Required</sup> <span data-heading-title="`type`<sup>Required</sup>" data-heading-id="constructhubtagconditionconfigpropertytype"></span>

```typescript
public readonly type: TagConditionLogicType;
```

- _Type:_ [`construct-hub.TagConditionLogicType`](#constructhubtagconditionlogictype)

---

##### `children`<sup>Optional</sup> <span data-heading-title="`children`<sup>Optional</sup>" data-heading-id="constructhubtagconditionconfigpropertychildren"></span>

```typescript
public readonly children: TagConditionConfig[];
```

- _Type:_ [`construct-hub.TagConditionConfig`](#constructhubtagconditionconfig)[]

---

##### `key`<sup>Optional</sup> <span data-heading-title="`key`<sup>Optional</sup>" data-heading-id="constructhubtagconditionconfigpropertykey"></span>

```typescript
public readonly key: string[];
```

- _Type:_ `string`[]

---

##### `value`<sup>Optional</sup> <span data-heading-title="`value`<sup>Optional</sup>" data-heading-id="constructhubtagconditionconfigpropertyvalue"></span>

```typescript
public readonly value: string;
```

- _Type:_ `string`

---

## Classes <span data-heading-title="Classes" data-heading-id="classes"></span>

### SpdxLicense <span data-heading-title="SpdxLicense" data-heading-id="constructhubspdxlicense"></span>

Valid SPDX License identifiers.

#### Static Functions <span data-heading-title="Static Functions" data-heading-id="static-functions"></span>

##### `all` <span data-heading-title="`all`" data-heading-id="constructhubspdxlicenseall"></span>

```typescript
import { SpdxLicense } from "construct-hub";

SpdxLicense.all();
```

##### `apache` <span data-heading-title="`apache`" data-heading-id="constructhubspdxlicenseapache"></span>

```typescript
import { SpdxLicense } from "construct-hub";

SpdxLicense.apache();
```

##### `bsd` <span data-heading-title="`bsd`" data-heading-id="constructhubspdxlicensebsd"></span>

```typescript
import { SpdxLicense } from "construct-hub";

SpdxLicense.bsd();
```

##### `mit` <span data-heading-title="`mit`" data-heading-id="constructhubspdxlicensemit"></span>

```typescript
import { SpdxLicense } from "construct-hub";

SpdxLicense.mit();
```

##### `osiApproved` <span data-heading-title="`osiApproved`" data-heading-id="constructhubspdxlicenseosiapproved"></span>

```typescript
import { SpdxLicense } from "construct-hub";

SpdxLicense.osiApproved();
```

#### Properties <span data-heading-title="Properties" data-heading-id="properties"></span>

##### `id`<sup>Required</sup> <span data-heading-title="`id`<sup>Required</sup>" data-heading-id="constructhubspdxlicensepropertyid"></span>

```typescript
public readonly id: string;
```

- _Type:_ `string`

---

#### Constants <span data-heading-title="Constants" data-heading-id="constants"></span>

##### `AAL` <span data-heading-title="`AAL`" data-heading-id="constructhubspdxlicensepropertyaal"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Attribution Assurance License.

> https://opensource.org/licenses/attribution

---

##### `ABSTYLES` <span data-heading-title="`ABSTYLES`" data-heading-id="constructhubspdxlicensepropertyabstyles"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Abstyles License.

> https://fedoraproject.org/wiki/Licensing/Abstyles

---

##### `ADOBE_2006` <span data-heading-title="`ADOBE_2006`" data-heading-id="constructhubspdxlicensepropertyadobe2006"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Adobe Systems Incorporated Source Code License Agreement.

> https://fedoraproject.org/wiki/Licensing/AdobeLicense

---

##### `ADOBE_GLYPH` <span data-heading-title="`ADOBE_GLYPH`" data-heading-id="constructhubspdxlicensepropertyadobeglyph"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Adobe Glyph List License.

> https://fedoraproject.org/wiki/Licensing/MIT#AdobeGlyph

---

##### `ADSL` <span data-heading-title="`ADSL`" data-heading-id="constructhubspdxlicensepropertyadsl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Amazon Digital Services License.

> https://fedoraproject.org/wiki/Licensing/AmazonDigitalServicesLicense

---

##### `AFL_1_1` <span data-heading-title="`AFL_1_1`" data-heading-id="constructhubspdxlicensepropertyafl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Academic Free License v1.1.

> http://opensource.linux-mirror.org/licenses/afl-1.1.txt

---

##### `AFL_1_2` <span data-heading-title="`AFL_1_2`" data-heading-id="constructhubspdxlicensepropertyafl12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Academic Free License v1.2.

> http://opensource.linux-mirror.org/licenses/afl-1.2.txt

---

##### `AFL_2_0` <span data-heading-title="`AFL_2_0`" data-heading-id="constructhubspdxlicensepropertyafl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Academic Free License v2.0.

> http://wayback.archive.org/web/20060924134533/http://www.opensource.org/licenses/afl-2.0.txt

---

##### `AFL_2_1` <span data-heading-title="`AFL_2_1`" data-heading-id="constructhubspdxlicensepropertyafl21"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Academic Free License v2.1.

> http://opensource.linux-mirror.org/licenses/afl-2.1.txt

---

##### `AFL_3_0` <span data-heading-title="`AFL_3_0`" data-heading-id="constructhubspdxlicensepropertyafl30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Academic Free License v3.0.

> http://www.rosenlaw.com/AFL3.0.htm

---

##### `AFMPARSE` <span data-heading-title="`AFMPARSE`" data-heading-id="constructhubspdxlicensepropertyafmparse"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Afmparse License.

> https://fedoraproject.org/wiki/Licensing/Afmparse

---

##### `AGPL_1_0` <span data-heading-title="`AGPL_1_0`" data-heading-id="constructhubspdxlicensepropertyagpl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Affero General Public License v1.0.

> http://www.affero.org/oagpl.html

---

##### `AGPL_1_0_ONLY` <span data-heading-title="`AGPL_1_0_ONLY`" data-heading-id="constructhubspdxlicensepropertyagpl10only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Affero General Public License v1.0 only.

> http://www.affero.org/oagpl.html

---

##### `AGPL_1_0_OR_LATER` <span data-heading-title="`AGPL_1_0_OR_LATER`" data-heading-id="constructhubspdxlicensepropertyagpl10orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Affero General Public License v1.0 or later.

> http://www.affero.org/oagpl.html

---

##### `AGPL_3_0` <span data-heading-title="`AGPL_3_0`" data-heading-id="constructhubspdxlicensepropertyagpl30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Affero General Public License v3.0.

> https://www.gnu.org/licenses/agpl.txt

---

##### `AGPL_3_0_ONLY` <span data-heading-title="`AGPL_3_0_ONLY`" data-heading-id="constructhubspdxlicensepropertyagpl30only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Affero General Public License v3.0 only.

> https://www.gnu.org/licenses/agpl.txt

---

##### `AGPL_3_0_OR_LATER` <span data-heading-title="`AGPL_3_0_OR_LATER`" data-heading-id="constructhubspdxlicensepropertyagpl30orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Affero General Public License v3.0 or later.

> https://www.gnu.org/licenses/agpl.txt

---

##### `ALADDIN` <span data-heading-title="`ALADDIN`" data-heading-id="constructhubspdxlicensepropertyaladdin"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Aladdin Free Public License.

> http://pages.cs.wisc.edu/~ghost/doc/AFPL/6.01/Public.htm

---

##### `AMDPLPA` <span data-heading-title="`AMDPLPA`" data-heading-id="constructhubspdxlicensepropertyamdplpa"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

AMD's plpa_map.c License.

> https://fedoraproject.org/wiki/Licensing/AMD_plpa_map_License

---

##### `AML` <span data-heading-title="`AML`" data-heading-id="constructhubspdxlicensepropertyaml"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Apple MIT License.

> https://fedoraproject.org/wiki/Licensing/Apple_MIT_License

---

##### `AMPAS` <span data-heading-title="`AMPAS`" data-heading-id="constructhubspdxlicensepropertyampas"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Academy of Motion Picture Arts and Sciences BSD.

> https://fedoraproject.org/wiki/Licensing/BSD#AMPASBSD

---

##### `ANTLR_PD` <span data-heading-title="`ANTLR_PD`" data-heading-id="constructhubspdxlicensepropertyantlrpd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

ANTLR Software Rights Notice.

> http://www.antlr2.org/license.html

---

##### `ANTLR_PD_FALLBACK` <span data-heading-title="`ANTLR_PD_FALLBACK`" data-heading-id="constructhubspdxlicensepropertyantlrpdfallback"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

ANTLR Software Rights Notice with license fallback.

> http://www.antlr2.org/license.html

---

##### `APACHE_1_0` <span data-heading-title="`APACHE_1_0`" data-heading-id="constructhubspdxlicensepropertyapache10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Apache License 1.0.

> http://www.apache.org/licenses/LICENSE-1.0

---

##### `APACHE_1_1` <span data-heading-title="`APACHE_1_1`" data-heading-id="constructhubspdxlicensepropertyapache11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Apache License 1.1.

> http://apache.org/licenses/LICENSE-1.1

---

##### `APACHE_2_0` <span data-heading-title="`APACHE_2_0`" data-heading-id="constructhubspdxlicensepropertyapache20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Apache License 2.0.

> http://www.apache.org/licenses/LICENSE-2.0

---

##### `APAFML` <span data-heading-title="`APAFML`" data-heading-id="constructhubspdxlicensepropertyapafml"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Adobe Postscript AFM License.

> https://fedoraproject.org/wiki/Licensing/AdobePostscriptAFM

---

##### `APL_1_0` <span data-heading-title="`APL_1_0`" data-heading-id="constructhubspdxlicensepropertyapl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Adaptive Public License 1.0.

> https://opensource.org/licenses/APL-1.0

---

##### `APSL_1_0` <span data-heading-title="`APSL_1_0`" data-heading-id="constructhubspdxlicensepropertyapsl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Apple Public Source License 1.0.

> https://fedoraproject.org/wiki/Licensing/Apple_Public_Source_License_1.0

---

##### `APSL_1_1` <span data-heading-title="`APSL_1_1`" data-heading-id="constructhubspdxlicensepropertyapsl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Apple Public Source License 1.1.

> http://www.opensource.apple.com/source/IOSerialFamily/IOSerialFamily-7/APPLE_LICENSE

---

##### `APSL_1_2` <span data-heading-title="`APSL_1_2`" data-heading-id="constructhubspdxlicensepropertyapsl12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Apple Public Source License 1.2.

> http://www.samurajdata.se/opensource/mirror/licenses/apsl.php

---

##### `APSL_2_0` <span data-heading-title="`APSL_2_0`" data-heading-id="constructhubspdxlicensepropertyapsl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Apple Public Source License 2.0.

> http://www.opensource.apple.com/license/apsl/

---

##### `ARTISTIC_1_0` <span data-heading-title="`ARTISTIC_1_0`" data-heading-id="constructhubspdxlicensepropertyartistic10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Artistic License 1.0.

> https://opensource.org/licenses/Artistic-1.0

---

##### `ARTISTIC_1_0_CL8` <span data-heading-title="`ARTISTIC_1_0_CL8`" data-heading-id="constructhubspdxlicensepropertyartistic10cl8"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Artistic License 1.0 w/clause 8.

> https://opensource.org/licenses/Artistic-1.0

---

##### `ARTISTIC_1_0_PERL` <span data-heading-title="`ARTISTIC_1_0_PERL`" data-heading-id="constructhubspdxlicensepropertyartistic10perl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Artistic License 1.0 (Perl).

> http://dev.perl.org/licenses/artistic.html

---

##### `ARTISTIC_2_0` <span data-heading-title="`ARTISTIC_2_0`" data-heading-id="constructhubspdxlicensepropertyartistic20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Artistic License 2.0.

> http://www.perlfoundation.org/artistic_license_2_0

---

##### `BAHYPH` <span data-heading-title="`BAHYPH`" data-heading-id="constructhubspdxlicensepropertybahyph"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Bahyph License.

> https://fedoraproject.org/wiki/Licensing/Bahyph

---

##### `BARR` <span data-heading-title="`BARR`" data-heading-id="constructhubspdxlicensepropertybarr"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Barr License.

> https://fedoraproject.org/wiki/Licensing/Barr

---

##### `BEERWARE` <span data-heading-title="`BEERWARE`" data-heading-id="constructhubspdxlicensepropertybeerware"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Beerware License.

> https://fedoraproject.org/wiki/Licensing/Beerware

---

##### `BITTORRENT_1_0` <span data-heading-title="`BITTORRENT_1_0`" data-heading-id="constructhubspdxlicensepropertybittorrent10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BitTorrent Open Source License v1.0.

> http://sources.gentoo.org/cgi-bin/viewvc.cgi/gentoo-x86/licenses/BitTorrent?r1=1.1&r2=1.1.1.1&diff_format=s

---

##### `BITTORRENT_1_1` <span data-heading-title="`BITTORRENT_1_1`" data-heading-id="constructhubspdxlicensepropertybittorrent11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BitTorrent Open Source License v1.1.

> http://directory.fsf.org/wiki/License:BitTorrentOSL1.1

---

##### `BLESSING` <span data-heading-title="`BLESSING`" data-heading-id="constructhubspdxlicensepropertyblessing"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SQLite Blessing.

> https://www.sqlite.org/src/artifact/e33a4df7e32d742a?ln=4-9

---

##### `BLUEOAK_1_0_0` <span data-heading-title="`BLUEOAK_1_0_0`" data-heading-id="constructhubspdxlicensepropertyblueoak100"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Blue Oak Model License 1.0.0.

> https://blueoakcouncil.org/license/1.0.0

---

##### `BORCEUX` <span data-heading-title="`BORCEUX`" data-heading-id="constructhubspdxlicensepropertyborceux"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Borceux license.

> https://fedoraproject.org/wiki/Licensing/Borceux

---

##### `BSD_1_CLAUSE` <span data-heading-title="`BSD_1_CLAUSE`" data-heading-id="constructhubspdxlicensepropertybsd1clause"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 1-Clause License.

> https://svnweb.freebsd.org/base/head/include/ifaddrs.h?revision=326823

---

##### `BSD_2_CLAUSE` <span data-heading-title="`BSD_2_CLAUSE`" data-heading-id="constructhubspdxlicensepropertybsd2clause"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 2-Clause "Simplified" License.

> https://opensource.org/licenses/BSD-2-Clause

---

##### `BSD_2_CLAUSE_FREEBSD` <span data-heading-title="`BSD_2_CLAUSE_FREEBSD`" data-heading-id="constructhubspdxlicensepropertybsd2clausefreebsd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 2-Clause FreeBSD License.

> http://www.freebsd.org/copyright/freebsd-license.html

---

##### `BSD_2_CLAUSE_NETBSD` <span data-heading-title="`BSD_2_CLAUSE_NETBSD`" data-heading-id="constructhubspdxlicensepropertybsd2clausenetbsd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 2-Clause NetBSD License.

> http://www.netbsd.org/about/redistribution.html#default

---

##### `BSD_2_CLAUSE_PATENT` <span data-heading-title="`BSD_2_CLAUSE_PATENT`" data-heading-id="constructhubspdxlicensepropertybsd2clausepatent"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD-2-Clause Plus Patent License.

> https://opensource.org/licenses/BSDplusPatent

---

##### `BSD_2_CLAUSE_VIEWS` <span data-heading-title="`BSD_2_CLAUSE_VIEWS`" data-heading-id="constructhubspdxlicensepropertybsd2clauseviews"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 2-Clause with views sentence.

> http://www.freebsd.org/copyright/freebsd-license.html

---

##### `BSD_3_CLAUSE` <span data-heading-title="`BSD_3_CLAUSE`" data-heading-id="constructhubspdxlicensepropertybsd3clause"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 3-Clause "New" or "Revised" License.

> https://opensource.org/licenses/BSD-3-Clause

---

##### `BSD_3_CLAUSE_ATTRIBUTION` <span data-heading-title="`BSD_3_CLAUSE_ATTRIBUTION`" data-heading-id="constructhubspdxlicensepropertybsd3clauseattribution"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD with attribution.

> https://fedoraproject.org/wiki/Licensing/BSD_with_Attribution

---

##### `BSD_3_CLAUSE_CLEAR` <span data-heading-title="`BSD_3_CLAUSE_CLEAR`" data-heading-id="constructhubspdxlicensepropertybsd3clauseclear"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 3-Clause Clear License.

> http://labs.metacarta.com/license-explanation.html#license

---

##### `BSD_3_CLAUSE_LBNL` <span data-heading-title="`BSD_3_CLAUSE_LBNL`" data-heading-id="constructhubspdxlicensepropertybsd3clauselbnl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Lawrence Berkeley National Labs BSD variant license.

> https://fedoraproject.org/wiki/Licensing/LBNLBSD

---

##### `BSD_3_CLAUSE_NO_NUCLEAR_LICENSE` <span data-heading-title="`BSD_3_CLAUSE_NO_NUCLEAR_LICENSE`" data-heading-id="constructhubspdxlicensepropertybsd3clausenonuclearlicense"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 3-Clause No Nuclear License.

> http://download.oracle.com/otn-pub/java/licenses/bsd.txt?AuthParam=1467140197_43d516ce1776bd08a58235a7785be1cc

---

##### `BSD_3_CLAUSE_NO_NUCLEAR_LICENSE_2014` <span data-heading-title="`BSD_3_CLAUSE_NO_NUCLEAR_LICENSE_2014`" data-heading-id="constructhubspdxlicensepropertybsd3clausenonuclearlicense2014"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 3-Clause No Nuclear License 2014.

> https://java.net/projects/javaeetutorial/pages/BerkeleyLicense

---

##### `BSD_3_CLAUSE_NO_NUCLEAR_WARRANTY` <span data-heading-title="`BSD_3_CLAUSE_NO_NUCLEAR_WARRANTY`" data-heading-id="constructhubspdxlicensepropertybsd3clausenonuclearwarranty"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 3-Clause No Nuclear Warranty.

> https://jogamp.org/git/?p=gluegen.git;a=blob_plain;f=LICENSE.txt

---

##### `BSD_3_CLAUSE_OPEN_MPI` <span data-heading-title="`BSD_3_CLAUSE_OPEN_MPI`" data-heading-id="constructhubspdxlicensepropertybsd3clauseopenmpi"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 3-Clause Open MPI variant.

> https://www.open-mpi.org/community/license.php

---

##### `BSD_4_CLAUSE` <span data-heading-title="`BSD_4_CLAUSE`" data-heading-id="constructhubspdxlicensepropertybsd4clause"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD 4-Clause "Original" or "Old" License.

> http://directory.fsf.org/wiki/License:BSD_4Clause

---

##### `BSD_4_CLAUSE_UC` <span data-heading-title="`BSD_4_CLAUSE_UC`" data-heading-id="constructhubspdxlicensepropertybsd4clauseuc"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD-4-Clause (University of California-Specific).

> http://www.freebsd.org/copyright/license.html

---

##### `BSD_PROTECTION` <span data-heading-title="`BSD_PROTECTION`" data-heading-id="constructhubspdxlicensepropertybsdprotection"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD Protection License.

> https://fedoraproject.org/wiki/Licensing/BSD_Protection_License

---

##### `BSD_SOURCE_CODE` <span data-heading-title="`BSD_SOURCE_CODE`" data-heading-id="constructhubspdxlicensepropertybsdsourcecode"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD Source Code Attribution.

> https://github.com/robbiehanson/CocoaHTTPServer/blob/master/LICENSE.txt

---

##### `BSL_1_0` <span data-heading-title="`BSL_1_0`" data-heading-id="constructhubspdxlicensepropertybsl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Boost Software License 1.0.

> http://www.boost.org/LICENSE_1_0.txt

---

##### `BUSL_1_1` <span data-heading-title="`BUSL_1_1`" data-heading-id="constructhubspdxlicensepropertybusl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Business Source License 1.1.

> https://mariadb.com/bsl11/

---

##### `BZIP2_1_0_5` <span data-heading-title="`BZIP2_1_0_5`" data-heading-id="constructhubspdxlicensepropertybzip2105"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

bzip2 and libbzip2 License v1.0.5.

> https://sourceware.org/bzip2/1.0.5/bzip2-manual-1.0.5.html

---

##### `BZIP2_1_0_6` <span data-heading-title="`BZIP2_1_0_6`" data-heading-id="constructhubspdxlicensepropertybzip2106"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

bzip2 and libbzip2 License v1.0.6.

> https://sourceware.org/git/?p=bzip2.git;a=blob;f=LICENSE;hb=bzip2-1.0.6

---

##### `CAL_1_0` <span data-heading-title="`CAL_1_0`" data-heading-id="constructhubspdxlicensepropertycal10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Cryptographic Autonomy License 1.0.

> http://cryptographicautonomylicense.com/license-text.html

---

##### `CAL_1_0_COMBINED_WORK_EXCEPTION` <span data-heading-title="`CAL_1_0_COMBINED_WORK_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertycal10combinedworkexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Cryptographic Autonomy License 1.0 (Combined Work Exception).

> http://cryptographicautonomylicense.com/license-text.html

---

##### `CALDERA` <span data-heading-title="`CALDERA`" data-heading-id="constructhubspdxlicensepropertycaldera"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Caldera License.

> http://www.lemis.com/grog/UNIX/ancient-source-all.pdf

---

##### `CATOSL_1_1` <span data-heading-title="`CATOSL_1_1`" data-heading-id="constructhubspdxlicensepropertycatosl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Computer Associates Trusted Open Source License 1.1.

> https://opensource.org/licenses/CATOSL-1.1

---

##### `CC_BY_1_0` <span data-heading-title="`CC_BY_1_0`" data-heading-id="constructhubspdxlicensepropertyccby10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution 1.0 Generic.

> https://creativecommons.org/licenses/by/1.0/legalcode

---

##### `CC_BY_2_0` <span data-heading-title="`CC_BY_2_0`" data-heading-id="constructhubspdxlicensepropertyccby20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution 2.0 Generic.

> https://creativecommons.org/licenses/by/2.0/legalcode

---

##### `CC_BY_2_5` <span data-heading-title="`CC_BY_2_5`" data-heading-id="constructhubspdxlicensepropertyccby25"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution 2.5 Generic.

> https://creativecommons.org/licenses/by/2.5/legalcode

---

##### `CC_BY_3_0` <span data-heading-title="`CC_BY_3_0`" data-heading-id="constructhubspdxlicensepropertyccby30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution 3.0 Unported.

> https://creativecommons.org/licenses/by/3.0/legalcode

---

##### `CC_BY_3_0_AT` <span data-heading-title="`CC_BY_3_0_AT`" data-heading-id="constructhubspdxlicensepropertyccby30at"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution 3.0 Austria.

> https://creativecommons.org/licenses/by/3.0/at/legalcode

---

##### `CC_BY_3_0_US` <span data-heading-title="`CC_BY_3_0_US`" data-heading-id="constructhubspdxlicensepropertyccby30us"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution 3.0 United States.

> https://creativecommons.org/licenses/by/3.0/us/legalcode

---

##### `CC_BY_4_0` <span data-heading-title="`CC_BY_4_0`" data-heading-id="constructhubspdxlicensepropertyccby40"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution 4.0 International.

> https://creativecommons.org/licenses/by/4.0/legalcode

---

##### `CC_BY_NC_1_0` <span data-heading-title="`CC_BY_NC_1_0`" data-heading-id="constructhubspdxlicensepropertyccbync10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial 1.0 Generic.

> https://creativecommons.org/licenses/by-nc/1.0/legalcode

---

##### `CC_BY_NC_2_0` <span data-heading-title="`CC_BY_NC_2_0`" data-heading-id="constructhubspdxlicensepropertyccbync20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial 2.0 Generic.

> https://creativecommons.org/licenses/by-nc/2.0/legalcode

---

##### `CC_BY_NC_2_5` <span data-heading-title="`CC_BY_NC_2_5`" data-heading-id="constructhubspdxlicensepropertyccbync25"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial 2.5 Generic.

> https://creativecommons.org/licenses/by-nc/2.5/legalcode

---

##### `CC_BY_NC_3_0` <span data-heading-title="`CC_BY_NC_3_0`" data-heading-id="constructhubspdxlicensepropertyccbync30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial 3.0 Unported.

> https://creativecommons.org/licenses/by-nc/3.0/legalcode

---

##### `CC_BY_NC_4_0` <span data-heading-title="`CC_BY_NC_4_0`" data-heading-id="constructhubspdxlicensepropertyccbync40"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial 4.0 International.

> https://creativecommons.org/licenses/by-nc/4.0/legalcode

---

##### `CC_BY_NC_ND_1_0` <span data-heading-title="`CC_BY_NC_ND_1_0`" data-heading-id="constructhubspdxlicensepropertyccbyncnd10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial No Derivatives 1.0 Generic.

> https://creativecommons.org/licenses/by-nd-nc/1.0/legalcode

---

##### `CC_BY_NC_ND_2_0` <span data-heading-title="`CC_BY_NC_ND_2_0`" data-heading-id="constructhubspdxlicensepropertyccbyncnd20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial No Derivatives 2.0 Generic.

> https://creativecommons.org/licenses/by-nc-nd/2.0/legalcode

---

##### `CC_BY_NC_ND_2_5` <span data-heading-title="`CC_BY_NC_ND_2_5`" data-heading-id="constructhubspdxlicensepropertyccbyncnd25"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial No Derivatives 2.5 Generic.

> https://creativecommons.org/licenses/by-nc-nd/2.5/legalcode

---

##### `CC_BY_NC_ND_3_0` <span data-heading-title="`CC_BY_NC_ND_3_0`" data-heading-id="constructhubspdxlicensepropertyccbyncnd30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial No Derivatives 3.0 Unported.

> https://creativecommons.org/licenses/by-nc-nd/3.0/legalcode

---

##### `CC_BY_NC_ND_3_0_IGO` <span data-heading-title="`CC_BY_NC_ND_3_0_IGO`" data-heading-id="constructhubspdxlicensepropertyccbyncnd30igo"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial No Derivatives 3.0 IGO.

> https://creativecommons.org/licenses/by-nc-nd/3.0/igo/legalcode

---

##### `CC_BY_NC_ND_4_0` <span data-heading-title="`CC_BY_NC_ND_4_0`" data-heading-id="constructhubspdxlicensepropertyccbyncnd40"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial No Derivatives 4.0 International.

> https://creativecommons.org/licenses/by-nc-nd/4.0/legalcode

---

##### `CC_BY_NC_SA_1_0` <span data-heading-title="`CC_BY_NC_SA_1_0`" data-heading-id="constructhubspdxlicensepropertyccbyncsa10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial Share Alike 1.0 Generic.

> https://creativecommons.org/licenses/by-nc-sa/1.0/legalcode

---

##### `CC_BY_NC_SA_2_0` <span data-heading-title="`CC_BY_NC_SA_2_0`" data-heading-id="constructhubspdxlicensepropertyccbyncsa20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial Share Alike 2.0 Generic.

> https://creativecommons.org/licenses/by-nc-sa/2.0/legalcode

---

##### `CC_BY_NC_SA_2_5` <span data-heading-title="`CC_BY_NC_SA_2_5`" data-heading-id="constructhubspdxlicensepropertyccbyncsa25"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial Share Alike 2.5 Generic.

> https://creativecommons.org/licenses/by-nc-sa/2.5/legalcode

---

##### `CC_BY_NC_SA_3_0` <span data-heading-title="`CC_BY_NC_SA_3_0`" data-heading-id="constructhubspdxlicensepropertyccbyncsa30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial Share Alike 3.0 Unported.

> https://creativecommons.org/licenses/by-nc-sa/3.0/legalcode

---

##### `CC_BY_NC_SA_4_0` <span data-heading-title="`CC_BY_NC_SA_4_0`" data-heading-id="constructhubspdxlicensepropertyccbyncsa40"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Non Commercial Share Alike 4.0 International.

> https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode

---

##### `CC_BY_ND_1_0` <span data-heading-title="`CC_BY_ND_1_0`" data-heading-id="constructhubspdxlicensepropertyccbynd10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution No Derivatives 1.0 Generic.

> https://creativecommons.org/licenses/by-nd/1.0/legalcode

---

##### `CC_BY_ND_2_0` <span data-heading-title="`CC_BY_ND_2_0`" data-heading-id="constructhubspdxlicensepropertyccbynd20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution No Derivatives 2.0 Generic.

> https://creativecommons.org/licenses/by-nd/2.0/legalcode

---

##### `CC_BY_ND_2_5` <span data-heading-title="`CC_BY_ND_2_5`" data-heading-id="constructhubspdxlicensepropertyccbynd25"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution No Derivatives 2.5 Generic.

> https://creativecommons.org/licenses/by-nd/2.5/legalcode

---

##### `CC_BY_ND_3_0` <span data-heading-title="`CC_BY_ND_3_0`" data-heading-id="constructhubspdxlicensepropertyccbynd30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution No Derivatives 3.0 Unported.

> https://creativecommons.org/licenses/by-nd/3.0/legalcode

---

##### `CC_BY_ND_4_0` <span data-heading-title="`CC_BY_ND_4_0`" data-heading-id="constructhubspdxlicensepropertyccbynd40"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution No Derivatives 4.0 International.

> https://creativecommons.org/licenses/by-nd/4.0/legalcode

---

##### `CC_BY_SA_1_0` <span data-heading-title="`CC_BY_SA_1_0`" data-heading-id="constructhubspdxlicensepropertyccbysa10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Share Alike 1.0 Generic.

> https://creativecommons.org/licenses/by-sa/1.0/legalcode

---

##### `CC_BY_SA_2_0` <span data-heading-title="`CC_BY_SA_2_0`" data-heading-id="constructhubspdxlicensepropertyccbysa20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Share Alike 2.0 Generic.

> https://creativecommons.org/licenses/by-sa/2.0/legalcode

---

##### `CC_BY_SA_2_0_UK` <span data-heading-title="`CC_BY_SA_2_0_UK`" data-heading-id="constructhubspdxlicensepropertyccbysa20uk"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Share Alike 2.0 England and Wales.

> https://creativecommons.org/licenses/by-sa/2.0/uk/legalcode

---

##### `CC_BY_SA_2_5` <span data-heading-title="`CC_BY_SA_2_5`" data-heading-id="constructhubspdxlicensepropertyccbysa25"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Share Alike 2.5 Generic.

> https://creativecommons.org/licenses/by-sa/2.5/legalcode

---

##### `CC_BY_SA_3_0` <span data-heading-title="`CC_BY_SA_3_0`" data-heading-id="constructhubspdxlicensepropertyccbysa30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Share Alike 3.0 Unported.

> https://creativecommons.org/licenses/by-sa/3.0/legalcode

---

##### `CC_BY_SA_3_0_AT` <span data-heading-title="`CC_BY_SA_3_0_AT`" data-heading-id="constructhubspdxlicensepropertyccbysa30at"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution-Share Alike 3.0 Austria.

> https://creativecommons.org/licenses/by-sa/3.0/at/legalcode

---

##### `CC_BY_SA_4_0` <span data-heading-title="`CC_BY_SA_4_0`" data-heading-id="constructhubspdxlicensepropertyccbysa40"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Attribution Share Alike 4.0 International.

> https://creativecommons.org/licenses/by-sa/4.0/legalcode

---

##### `CC_PDDC` <span data-heading-title="`CC_PDDC`" data-heading-id="constructhubspdxlicensepropertyccpddc"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Public Domain Dedication and Certification.

> https://creativecommons.org/licenses/publicdomain/

---

##### `CC0_1_0` <span data-heading-title="`CC0_1_0`" data-heading-id="constructhubspdxlicensepropertycc010"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Creative Commons Zero v1.0 Universal.

> https://creativecommons.org/publicdomain/zero/1.0/legalcode

---

##### `CDDL_1_0` <span data-heading-title="`CDDL_1_0`" data-heading-id="constructhubspdxlicensepropertycddl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Common Development and Distribution License 1.0.

> https://opensource.org/licenses/cddl1

---

##### `CDDL_1_1` <span data-heading-title="`CDDL_1_1`" data-heading-id="constructhubspdxlicensepropertycddl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Common Development and Distribution License 1.1.

> http://glassfish.java.net/public/CDDL+GPL_1_1.html

---

##### `CDLA_PERMISSIVE_1_0` <span data-heading-title="`CDLA_PERMISSIVE_1_0`" data-heading-id="constructhubspdxlicensepropertycdlapermissive10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Community Data License Agreement Permissive 1.0.

> https://cdla.io/permissive-1-0

---

##### `CDLA_SHARING_1_0` <span data-heading-title="`CDLA_SHARING_1_0`" data-heading-id="constructhubspdxlicensepropertycdlasharing10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Community Data License Agreement Sharing 1.0.

> https://cdla.io/sharing-1-0

---

##### `CECILL_1_0` <span data-heading-title="`CECILL_1_0`" data-heading-id="constructhubspdxlicensepropertycecill10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CeCILL Free Software License Agreement v1.0.

> http://www.cecill.info/licences/Licence_CeCILL_V1-fr.html

---

##### `CECILL_1_1` <span data-heading-title="`CECILL_1_1`" data-heading-id="constructhubspdxlicensepropertycecill11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CeCILL Free Software License Agreement v1.1.

> http://www.cecill.info/licences/Licence_CeCILL_V1.1-US.html

---

##### `CECILL_2_0` <span data-heading-title="`CECILL_2_0`" data-heading-id="constructhubspdxlicensepropertycecill20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CeCILL Free Software License Agreement v2.0.

> http://www.cecill.info/licences/Licence_CeCILL_V2-en.html

---

##### `CECILL_2_1` <span data-heading-title="`CECILL_2_1`" data-heading-id="constructhubspdxlicensepropertycecill21"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CeCILL Free Software License Agreement v2.1.

> http://www.cecill.info/licences/Licence_CeCILL_V2.1-en.html

---

##### `CECILL_B` <span data-heading-title="`CECILL_B`" data-heading-id="constructhubspdxlicensepropertycecillb"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CeCILL-B Free Software License Agreement.

> http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.html

---

##### `CECILL_C` <span data-heading-title="`CECILL_C`" data-heading-id="constructhubspdxlicensepropertycecillc"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CeCILL-C Free Software License Agreement.

> http://www.cecill.info/licences/Licence_CeCILL-C_V1-en.html

---

##### `CERN_OHL_1_1` <span data-heading-title="`CERN_OHL_1_1`" data-heading-id="constructhubspdxlicensepropertycernohl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CERN Open Hardware Licence v1.1.

> https://www.ohwr.org/project/licenses/wikis/cern-ohl-v1.1

---

##### `CERN_OHL_1_2` <span data-heading-title="`CERN_OHL_1_2`" data-heading-id="constructhubspdxlicensepropertycernohl12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CERN Open Hardware Licence v1.2.

> https://www.ohwr.org/project/licenses/wikis/cern-ohl-v1.2

---

##### `CERN_OHL_P_2_0` <span data-heading-title="`CERN_OHL_P_2_0`" data-heading-id="constructhubspdxlicensepropertycernohlp20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CERN Open Hardware Licence Version 2 - Permissive.

> https://www.ohwr.org/project/cernohl/wikis/Documents/CERN-OHL-version-2

---

##### `CERN_OHL_S_2_0` <span data-heading-title="`CERN_OHL_S_2_0`" data-heading-id="constructhubspdxlicensepropertycernohls20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CERN Open Hardware Licence Version 2 - Strongly Reciprocal.

> https://www.ohwr.org/project/cernohl/wikis/Documents/CERN-OHL-version-2

---

##### `CERN_OHL_W_2_0` <span data-heading-title="`CERN_OHL_W_2_0`" data-heading-id="constructhubspdxlicensepropertycernohlw20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CERN Open Hardware Licence Version 2 - Weakly Reciprocal.

> https://www.ohwr.org/project/cernohl/wikis/Documents/CERN-OHL-version-2

---

##### `CL_ARTISTIC` <span data-heading-title="`CL_ARTISTIC`" data-heading-id="constructhubspdxlicensepropertyclartistic"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Clarified Artistic License.

> http://gianluca.dellavedova.org/2011/01/03/clarified-artistic-license/

---

##### `CNRI_JYTHON` <span data-heading-title="`CNRI_JYTHON`" data-heading-id="constructhubspdxlicensepropertycnrijython"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CNRI Jython License.

> http://www.jython.org/license.html

---

##### `CNRI_PYTHON` <span data-heading-title="`CNRI_PYTHON`" data-heading-id="constructhubspdxlicensepropertycnripython"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CNRI Python License.

> https://opensource.org/licenses/CNRI-Python

---

##### `CNRI_PYTHON_GPL_COMPATIBLE` <span data-heading-title="`CNRI_PYTHON_GPL_COMPATIBLE`" data-heading-id="constructhubspdxlicensepropertycnripythongplcompatible"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CNRI Python Open Source GPL Compatible License Agreement.

> http://www.python.org/download/releases/1.6.1/download_win/

---

##### `CONDOR_1_1` <span data-heading-title="`CONDOR_1_1`" data-heading-id="constructhubspdxlicensepropertycondor11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Condor Public License v1.1.

> http://research.cs.wisc.edu/condor/license.html#condor

---

##### `COPYLEFT_NEXT_0_3_0` <span data-heading-title="`COPYLEFT_NEXT_0_3_0`" data-heading-id="constructhubspdxlicensepropertycopyleftnext030"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

copyleft-next 0.3.0.

> https://github.com/copyleft-next/copyleft-next/blob/master/Releases/copyleft-next-0.3.0

---

##### `COPYLEFT_NEXT_0_3_1` <span data-heading-title="`COPYLEFT_NEXT_0_3_1`" data-heading-id="constructhubspdxlicensepropertycopyleftnext031"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

copyleft-next 0.3.1.

> https://github.com/copyleft-next/copyleft-next/blob/master/Releases/copyleft-next-0.3.1

---

##### `CPAL_1_0` <span data-heading-title="`CPAL_1_0`" data-heading-id="constructhubspdxlicensepropertycpal10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Common Public Attribution License 1.0.

> https://opensource.org/licenses/CPAL-1.0

---

##### `CPL_1_0` <span data-heading-title="`CPL_1_0`" data-heading-id="constructhubspdxlicensepropertycpl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Common Public License 1.0.

> https://opensource.org/licenses/CPL-1.0

---

##### `CPOL_1_02` <span data-heading-title="`CPOL_1_02`" data-heading-id="constructhubspdxlicensepropertycpol102"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Code Project Open License 1.02.

> http://www.codeproject.com/info/cpol10.aspx

---

##### `CROSSWORD` <span data-heading-title="`CROSSWORD`" data-heading-id="constructhubspdxlicensepropertycrossword"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Crossword License.

> https://fedoraproject.org/wiki/Licensing/Crossword

---

##### `CRYSTAL_STACKER` <span data-heading-title="`CRYSTAL_STACKER`" data-heading-id="constructhubspdxlicensepropertycrystalstacker"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CrystalStacker License.

> https://fedoraproject.org/wiki/Licensing:CrystalStacker?rd=Licensing/CrystalStacker

---

##### `CUA_OPL_1_0` <span data-heading-title="`CUA_OPL_1_0`" data-heading-id="constructhubspdxlicensepropertycuaopl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CUA Office Public License v1.0.

> https://opensource.org/licenses/CUA-OPL-1.0

---

##### `CUBE` <span data-heading-title="`CUBE`" data-heading-id="constructhubspdxlicensepropertycube"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Cube License.

> https://fedoraproject.org/wiki/Licensing/Cube

---

##### `CURL` <span data-heading-title="`CURL`" data-heading-id="constructhubspdxlicensepropertycurl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

curl License.

> https://github.com/bagder/curl/blob/master/COPYING

---

##### `D_FSL_1_0` <span data-heading-title="`D_FSL_1_0`" data-heading-id="constructhubspdxlicensepropertydfsl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Deutsche Freie Software Lizenz.

> http://www.dipp.nrw.de/d-fsl/lizenzen/

---

##### `DIFFMARK` <span data-heading-title="`DIFFMARK`" data-heading-id="constructhubspdxlicensepropertydiffmark"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

diffmark license.

> https://fedoraproject.org/wiki/Licensing/diffmark

---

##### `DOC` <span data-heading-title="`DOC`" data-heading-id="constructhubspdxlicensepropertydoc"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

DOC License.

> http://www.cs.wustl.edu/~schmidt/ACE-copying.html

---

##### `DOTSEQN` <span data-heading-title="`DOTSEQN`" data-heading-id="constructhubspdxlicensepropertydotseqn"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Dotseqn License.

> https://fedoraproject.org/wiki/Licensing/Dotseqn

---

##### `DSDP` <span data-heading-title="`DSDP`" data-heading-id="constructhubspdxlicensepropertydsdp"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

DSDP License.

> https://fedoraproject.org/wiki/Licensing/DSDP

---

##### `DVIPDFM` <span data-heading-title="`DVIPDFM`" data-heading-id="constructhubspdxlicensepropertydvipdfm"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

dvipdfm License.

> https://fedoraproject.org/wiki/Licensing/dvipdfm

---

##### `E_GENIX` <span data-heading-title="`E_GENIX`" data-heading-id="constructhubspdxlicensepropertyegenix"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

eGenix.com Public License 1.1.0.

> http://www.egenix.com/products/eGenix.com-Public-License-1.1.0.pdf

---

##### `ECL_1_0` <span data-heading-title="`ECL_1_0`" data-heading-id="constructhubspdxlicensepropertyecl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Educational Community License v1.0.

> https://opensource.org/licenses/ECL-1.0

---

##### `ECL_2_0` <span data-heading-title="`ECL_2_0`" data-heading-id="constructhubspdxlicensepropertyecl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Educational Community License v2.0.

> https://opensource.org/licenses/ECL-2.0

---

##### `ECOS_2_0` <span data-heading-title="`ECOS_2_0`" data-heading-id="constructhubspdxlicensepropertyecos20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

eCos license version 2.0.

> https://www.gnu.org/licenses/ecos-license.html

---

##### `EFL_1_0` <span data-heading-title="`EFL_1_0`" data-heading-id="constructhubspdxlicensepropertyefl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Eiffel Forum License v1.0.

> http://www.eiffel-nice.org/license/forum.txt

---

##### `EFL_2_0` <span data-heading-title="`EFL_2_0`" data-heading-id="constructhubspdxlicensepropertyefl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Eiffel Forum License v2.0.

> http://www.eiffel-nice.org/license/eiffel-forum-license-2.html

---

##### `ENTESSA` <span data-heading-title="`ENTESSA`" data-heading-id="constructhubspdxlicensepropertyentessa"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Entessa Public License v1.0.

> https://opensource.org/licenses/Entessa

---

##### `EPICS` <span data-heading-title="`EPICS`" data-heading-id="constructhubspdxlicensepropertyepics"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

EPICS Open License.

> https://epics.anl.gov/license/open.php

---

##### `EPL_1_0` <span data-heading-title="`EPL_1_0`" data-heading-id="constructhubspdxlicensepropertyepl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Eclipse Public License 1.0.

> http://www.eclipse.org/legal/epl-v10.html

---

##### `EPL_2_0` <span data-heading-title="`EPL_2_0`" data-heading-id="constructhubspdxlicensepropertyepl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Eclipse Public License 2.0.

> https://www.eclipse.org/legal/epl-2.0

---

##### `ERLPL_1_1` <span data-heading-title="`ERLPL_1_1`" data-heading-id="constructhubspdxlicensepropertyerlpl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Erlang Public License v1.1.

> http://www.erlang.org/EPLICENSE

---

##### `ETALAB_2_0` <span data-heading-title="`ETALAB_2_0`" data-heading-id="constructhubspdxlicensepropertyetalab20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Etalab Open License 2.0.

> https://github.com/DISIC/politique-de-contribution-open-source/blob/master/LICENSE.pdf

---

##### `EUDATAGRID` <span data-heading-title="`EUDATAGRID`" data-heading-id="constructhubspdxlicensepropertyeudatagrid"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

EU DataGrid Software License.

> http://eu-datagrid.web.cern.ch/eu-datagrid/license.html

---

##### `EUPL_1_0` <span data-heading-title="`EUPL_1_0`" data-heading-id="constructhubspdxlicensepropertyeupl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

European Union Public License 1.0.

> http://ec.europa.eu/idabc/en/document/7330.html

---

##### `EUPL_1_1` <span data-heading-title="`EUPL_1_1`" data-heading-id="constructhubspdxlicensepropertyeupl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

European Union Public License 1.1.

> https://joinup.ec.europa.eu/software/page/eupl/licence-eupl

---

##### `EUPL_1_2` <span data-heading-title="`EUPL_1_2`" data-heading-id="constructhubspdxlicensepropertyeupl12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

European Union Public License 1.2.

> https://joinup.ec.europa.eu/page/eupl-text-11-12

---

##### `EUROSYM` <span data-heading-title="`EUROSYM`" data-heading-id="constructhubspdxlicensepropertyeurosym"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Eurosym License.

> https://fedoraproject.org/wiki/Licensing/Eurosym

---

##### `FAIR` <span data-heading-title="`FAIR`" data-heading-id="constructhubspdxlicensepropertyfair"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Fair License.

> http://fairlicense.org/

---

##### `FRAMEWORX_1_0` <span data-heading-title="`FRAMEWORX_1_0`" data-heading-id="constructhubspdxlicensepropertyframeworx10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Frameworx Open License 1.0.

> https://opensource.org/licenses/Frameworx-1.0

---

##### `FREE_IMAGE` <span data-heading-title="`FREE_IMAGE`" data-heading-id="constructhubspdxlicensepropertyfreeimage"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

FreeImage Public License v1.0.

> http://freeimage.sourceforge.net/freeimage-license.txt

---

##### `FSFAP` <span data-heading-title="`FSFAP`" data-heading-id="constructhubspdxlicensepropertyfsfap"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

FSF All Permissive License.

> https://www.gnu.org/prep/maintain/html_node/License-Notices-for-Other-Files.html

---

##### `FSFUL` <span data-heading-title="`FSFUL`" data-heading-id="constructhubspdxlicensepropertyfsful"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

FSF Unlimited License.

> https://fedoraproject.org/wiki/Licensing/FSF_Unlimited_License

---

##### `FSFULLR` <span data-heading-title="`FSFULLR`" data-heading-id="constructhubspdxlicensepropertyfsfullr"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

FSF Unlimited License (with License Retention).

> https://fedoraproject.org/wiki/Licensing/FSF_Unlimited_License#License_Retention_Variant

---

##### `FTL` <span data-heading-title="`FTL`" data-heading-id="constructhubspdxlicensepropertyftl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Freetype Project License.

> http://freetype.fis.uniroma2.it/FTL.TXT

---

##### `GFDL_1_1` <span data-heading-title="`GFDL_1_1`" data-heading-id="constructhubspdxlicensepropertygfdl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.1.

> https://www.gnu.org/licenses/old-licenses/fdl-1.1.txt

---

##### `GFDL_1_1_INVARIANTS_ONLY` <span data-heading-title="`GFDL_1_1_INVARIANTS_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl11invariantsonly"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.1 only - invariants.

> https://www.gnu.org/licenses/old-licenses/fdl-1.1.txt

---

##### `GFDL_1_1_INVARIANTS_OR_LATER` <span data-heading-title="`GFDL_1_1_INVARIANTS_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl11invariantsorlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.1 or later - invariants.

> https://www.gnu.org/licenses/old-licenses/fdl-1.1.txt

---

##### `GFDL_1_1_NO_INVARIANTS_ONLY` <span data-heading-title="`GFDL_1_1_NO_INVARIANTS_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl11noinvariantsonly"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.1 only - no invariants.

> https://www.gnu.org/licenses/old-licenses/fdl-1.1.txt

---

##### `GFDL_1_1_NO_INVARIANTS_OR_LATER` <span data-heading-title="`GFDL_1_1_NO_INVARIANTS_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl11noinvariantsorlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.1 or later - no invariants.

> https://www.gnu.org/licenses/old-licenses/fdl-1.1.txt

---

##### `GFDL_1_1_ONLY` <span data-heading-title="`GFDL_1_1_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl11only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.1 only.

> https://www.gnu.org/licenses/old-licenses/fdl-1.1.txt

---

##### `GFDL_1_1_OR_LATER` <span data-heading-title="`GFDL_1_1_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl11orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.1 or later.

> https://www.gnu.org/licenses/old-licenses/fdl-1.1.txt

---

##### `GFDL_1_2` <span data-heading-title="`GFDL_1_2`" data-heading-id="constructhubspdxlicensepropertygfdl12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.2.

> https://www.gnu.org/licenses/old-licenses/fdl-1.2.txt

---

##### `GFDL_1_2_INVARIANTS_ONLY` <span data-heading-title="`GFDL_1_2_INVARIANTS_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl12invariantsonly"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.2 only - invariants.

> https://www.gnu.org/licenses/old-licenses/fdl-1.2.txt

---

##### `GFDL_1_2_INVARIANTS_OR_LATER` <span data-heading-title="`GFDL_1_2_INVARIANTS_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl12invariantsorlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.2 or later - invariants.

> https://www.gnu.org/licenses/old-licenses/fdl-1.2.txt

---

##### `GFDL_1_2_NO_INVARIANTS_ONLY` <span data-heading-title="`GFDL_1_2_NO_INVARIANTS_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl12noinvariantsonly"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.2 only - no invariants.

> https://www.gnu.org/licenses/old-licenses/fdl-1.2.txt

---

##### `GFDL_1_2_NO_INVARIANTS_OR_LATER` <span data-heading-title="`GFDL_1_2_NO_INVARIANTS_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl12noinvariantsorlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.2 or later - no invariants.

> https://www.gnu.org/licenses/old-licenses/fdl-1.2.txt

---

##### `GFDL_1_2_ONLY` <span data-heading-title="`GFDL_1_2_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl12only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.2 only.

> https://www.gnu.org/licenses/old-licenses/fdl-1.2.txt

---

##### `GFDL_1_2_OR_LATER` <span data-heading-title="`GFDL_1_2_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl12orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.2 or later.

> https://www.gnu.org/licenses/old-licenses/fdl-1.2.txt

---

##### `GFDL_1_3` <span data-heading-title="`GFDL_1_3`" data-heading-id="constructhubspdxlicensepropertygfdl13"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.3.

> https://www.gnu.org/licenses/fdl-1.3.txt

---

##### `GFDL_1_3_INVARIANTS_ONLY` <span data-heading-title="`GFDL_1_3_INVARIANTS_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl13invariantsonly"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.3 only - invariants.

> https://www.gnu.org/licenses/fdl-1.3.txt

---

##### `GFDL_1_3_INVARIANTS_OR_LATER` <span data-heading-title="`GFDL_1_3_INVARIANTS_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl13invariantsorlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.3 or later - invariants.

> https://www.gnu.org/licenses/fdl-1.3.txt

---

##### `GFDL_1_3_NO_INVARIANTS_ONLY` <span data-heading-title="`GFDL_1_3_NO_INVARIANTS_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl13noinvariantsonly"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.3 only - no invariants.

> https://www.gnu.org/licenses/fdl-1.3.txt

---

##### `GFDL_1_3_NO_INVARIANTS_OR_LATER` <span data-heading-title="`GFDL_1_3_NO_INVARIANTS_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl13noinvariantsorlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.3 or later - no invariants.

> https://www.gnu.org/licenses/fdl-1.3.txt

---

##### `GFDL_1_3_ONLY` <span data-heading-title="`GFDL_1_3_ONLY`" data-heading-id="constructhubspdxlicensepropertygfdl13only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.3 only.

> https://www.gnu.org/licenses/fdl-1.3.txt

---

##### `GFDL_1_3_OR_LATER` <span data-heading-title="`GFDL_1_3_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygfdl13orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Free Documentation License v1.3 or later.

> https://www.gnu.org/licenses/fdl-1.3.txt

---

##### `GIFTWARE` <span data-heading-title="`GIFTWARE`" data-heading-id="constructhubspdxlicensepropertygiftware"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Giftware License.

> http://liballeg.org/license.html#allegro-4-the-giftware-license

---

##### `GL2_P_S` <span data-heading-title="`GL2_P_S`" data-heading-id="constructhubspdxlicensepropertygl2ps"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GL2PS License.

> http://www.geuz.org/gl2ps/COPYING.GL2PS

---

##### `GLIDE` <span data-heading-title="`GLIDE`" data-heading-id="constructhubspdxlicensepropertyglide"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

3dfx Glide License.

> http://www.users.on.net/~triforce/glidexp/COPYING.txt

---

##### `GLULXE` <span data-heading-title="`GLULXE`" data-heading-id="constructhubspdxlicensepropertyglulxe"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Glulxe License.

> https://fedoraproject.org/wiki/Licensing/Glulxe

---

##### `GLWTPL` <span data-heading-title="`GLWTPL`" data-heading-id="constructhubspdxlicensepropertyglwtpl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Good Luck With That Public License.

> https://github.com/me-shaon/GLWTPL/commit/da5f6bc734095efbacb442c0b31e33a65b9d6e85

---

##### `GNUPLOT` <span data-heading-title="`GNUPLOT`" data-heading-id="constructhubspdxlicensepropertygnuplot"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

gnuplot License.

> https://fedoraproject.org/wiki/Licensing/Gnuplot

---

##### `GPL_1_0` <span data-heading-title="`GPL_1_0`" data-heading-id="constructhubspdxlicensepropertygpl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v1.0 only.

> https://www.gnu.org/licenses/old-licenses/gpl-1.0-standalone.html

---

##### `GPL_1_0_ONLY` <span data-heading-title="`GPL_1_0_ONLY`" data-heading-id="constructhubspdxlicensepropertygpl10only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v1.0 only.

> https://www.gnu.org/licenses/old-licenses/gpl-1.0-standalone.html

---

##### `GPL_1_0_OR_LATER` <span data-heading-title="`GPL_1_0_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygpl10orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v1.0 or later.

> https://www.gnu.org/licenses/old-licenses/gpl-1.0-standalone.html

---

##### `GPL_1_0_PLUS` <span data-heading-title="`GPL_1_0_PLUS`" data-heading-id="constructhubspdxlicensepropertygpl10plus"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v1.0 or later.

> https://www.gnu.org/licenses/old-licenses/gpl-1.0-standalone.html

---

##### `GPL_2_0` <span data-heading-title="`GPL_2_0`" data-heading-id="constructhubspdxlicensepropertygpl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 only.

> https://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html

---

##### `GPL_2_0_ONLY` <span data-heading-title="`GPL_2_0_ONLY`" data-heading-id="constructhubspdxlicensepropertygpl20only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 only.

> https://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html

---

##### `GPL_2_0_OR_LATER` <span data-heading-title="`GPL_2_0_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygpl20orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 or later.

> https://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html

---

##### `GPL_2_0_PLUS` <span data-heading-title="`GPL_2_0_PLUS`" data-heading-id="constructhubspdxlicensepropertygpl20plus"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 or later.

> https://www.gnu.org/licenses/old-licenses/gpl-2.0-standalone.html

---

##### `GPL_2_0_WITH_AUTOCONF_EXCEPTION` <span data-heading-title="`GPL_2_0_WITH_AUTOCONF_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertygpl20withautoconfexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 w/Autoconf exception.

> http://ac-archive.sourceforge.net/doc/copyright.html

---

##### `GPL_2_0_WITH_BISON_EXCEPTION` <span data-heading-title="`GPL_2_0_WITH_BISON_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertygpl20withbisonexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 w/Bison exception.

> http://git.savannah.gnu.org/cgit/bison.git/tree/data/yacc.c?id=193d7c7054ba7197b0789e14965b739162319b5e#n141

---

##### `GPL_2_0_WITH_CLASSPATH_EXCEPTION` <span data-heading-title="`GPL_2_0_WITH_CLASSPATH_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertygpl20withclasspathexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 w/Classpath exception.

> https://www.gnu.org/software/classpath/license.html

---

##### `GPL_2_0_WITH_FONT_EXCEPTION` <span data-heading-title="`GPL_2_0_WITH_FONT_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertygpl20withfontexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 w/Font exception.

> https://www.gnu.org/licenses/gpl-faq.html#FontException

---

##### `GPL_2_0_WITH_GCC_EXCEPTION` <span data-heading-title="`GPL_2_0_WITH_GCC_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertygpl20withgccexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v2.0 w/GCC Runtime Library exception.

> https://gcc.gnu.org/git/?p=gcc.git;a=blob;f=gcc/libgcc1.c;h=762f5143fc6eed57b6797c82710f3538aa52b40b;hb=cb143a3ce4fb417c68f5fa2691a1b1b1053dfba9#l10

---

##### `GPL_3_0` <span data-heading-title="`GPL_3_0`" data-heading-id="constructhubspdxlicensepropertygpl30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v3.0 only.

> https://www.gnu.org/licenses/gpl-3.0-standalone.html

---

##### `GPL_3_0_ONLY` <span data-heading-title="`GPL_3_0_ONLY`" data-heading-id="constructhubspdxlicensepropertygpl30only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v3.0 only.

> https://www.gnu.org/licenses/gpl-3.0-standalone.html

---

##### `GPL_3_0_OR_LATER` <span data-heading-title="`GPL_3_0_OR_LATER`" data-heading-id="constructhubspdxlicensepropertygpl30orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v3.0 or later.

> https://www.gnu.org/licenses/gpl-3.0-standalone.html

---

##### `GPL_3_0_PLUS` <span data-heading-title="`GPL_3_0_PLUS`" data-heading-id="constructhubspdxlicensepropertygpl30plus"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v3.0 or later.

> https://www.gnu.org/licenses/gpl-3.0-standalone.html

---

##### `GPL_3_0_WITH_AUTOCONF_EXCEPTION` <span data-heading-title="`GPL_3_0_WITH_AUTOCONF_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertygpl30withautoconfexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v3.0 w/Autoconf exception.

> https://www.gnu.org/licenses/autoconf-exception-3.0.html

---

##### `GPL_3_0_WITH_GCC_EXCEPTION` <span data-heading-title="`GPL_3_0_WITH_GCC_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertygpl30withgccexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU General Public License v3.0 w/GCC Runtime Library exception.

> https://www.gnu.org/licenses/gcc-exception-3.1.html

---

##### `GSOAP_1_3B` <span data-heading-title="`GSOAP_1_3B`" data-heading-id="constructhubspdxlicensepropertygsoap13b"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

gSOAP Public License v1.3b.

> http://www.cs.fsu.edu/~engelen/license.html

---

##### `HASKELL_REPORT` <span data-heading-title="`HASKELL_REPORT`" data-heading-id="constructhubspdxlicensepropertyhaskellreport"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Haskell Language Report License.

> https://fedoraproject.org/wiki/Licensing/Haskell_Language_Report_License

---

##### `HIPPOCRATIC_2_1` <span data-heading-title="`HIPPOCRATIC_2_1`" data-heading-id="constructhubspdxlicensepropertyhippocratic21"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Hippocratic License 2.1.

> https://firstdonoharm.dev/version/2/1/license.html

---

##### `HPND` <span data-heading-title="`HPND`" data-heading-id="constructhubspdxlicensepropertyhpnd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Historical Permission Notice and Disclaimer.

> https://opensource.org/licenses/HPND

---

##### `HPND_SELL_VARIANT` <span data-heading-title="`HPND_SELL_VARIANT`" data-heading-id="constructhubspdxlicensepropertyhpndsellvariant"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Historical Permission Notice and Disclaimer - sell variant.

> https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/net/sunrpc/auth_gss/gss_generic_token.c?h=v4.19

---

##### `HTMLTIDY` <span data-heading-title="`HTMLTIDY`" data-heading-id="constructhubspdxlicensepropertyhtmltidy"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

HTML Tidy License.

> https://github.com/htacg/tidy-html5/blob/next/README/LICENSE.md

---

##### `I_MATIX` <span data-heading-title="`I_MATIX`" data-heading-id="constructhubspdxlicensepropertyimatix"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

iMatix Standard Function Library Agreement.

> http://legacy.imatix.com/html/sfl/sfl4.htm#license

---

##### `IBM_PIBS` <span data-heading-title="`IBM_PIBS`" data-heading-id="constructhubspdxlicensepropertyibmpibs"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

IBM PowerPC Initialization and Boot Software.

> http://git.denx.de/?p=u-boot.git;a=blob;f=arch/powerpc/cpu/ppc4xx/miiphy.c;h=297155fdafa064b955e53e9832de93bfb0cfb85b;hb=9fab4bf4cc077c21e43941866f3f2c196f28670d

---

##### `ICU` <span data-heading-title="`ICU`" data-heading-id="constructhubspdxlicensepropertyicu"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

ICU License.

> http://source.icu-project.org/repos/icu/icu/trunk/license.html

---

##### `IJG` <span data-heading-title="`IJG`" data-heading-id="constructhubspdxlicensepropertyijg"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Independent JPEG Group License.

> http://dev.w3.org/cvsweb/Amaya/libjpeg/Attic/README?rev=1.2

---

##### `IMAGE_MAGICK` <span data-heading-title="`IMAGE_MAGICK`" data-heading-id="constructhubspdxlicensepropertyimagemagick"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

ImageMagick License.

> http://www.imagemagick.org/script/license.php

---

##### `IMLIB2` <span data-heading-title="`IMLIB2`" data-heading-id="constructhubspdxlicensepropertyimlib2"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Imlib2 License.

> http://trac.enlightenment.org/e/browser/trunk/imlib2/COPYING

---

##### `INFO_ZIP` <span data-heading-title="`INFO_ZIP`" data-heading-id="constructhubspdxlicensepropertyinfozip"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Info-ZIP License.

> http://www.info-zip.org/license.html

---

##### `INTEL` <span data-heading-title="`INTEL`" data-heading-id="constructhubspdxlicensepropertyintel"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Intel Open Source License.

> https://opensource.org/licenses/Intel

---

##### `INTEL_ACPI` <span data-heading-title="`INTEL_ACPI`" data-heading-id="constructhubspdxlicensepropertyintelacpi"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Intel ACPI Software License Agreement.

> https://fedoraproject.org/wiki/Licensing/Intel_ACPI_Software_License_Agreement

---

##### `INTERBASE_1_0` <span data-heading-title="`INTERBASE_1_0`" data-heading-id="constructhubspdxlicensepropertyinterbase10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Interbase Public License v1.0.

> https://web.archive.org/web/20060319014854/http://info.borland.com/devsupport/interbase/opensource/IPL.html

---

##### `IPA` <span data-heading-title="`IPA`" data-heading-id="constructhubspdxlicensepropertyipa"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

IPA Font License.

> https://opensource.org/licenses/IPA

---

##### `IPL_1_0` <span data-heading-title="`IPL_1_0`" data-heading-id="constructhubspdxlicensepropertyipl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

IBM Public License v1.0.

> https://opensource.org/licenses/IPL-1.0

---

##### `ISC` <span data-heading-title="`ISC`" data-heading-id="constructhubspdxlicensepropertyisc"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

ISC License.

> https://www.isc.org/downloads/software-support-policy/isc-license/

---

##### `JASPER_2_0` <span data-heading-title="`JASPER_2_0`" data-heading-id="constructhubspdxlicensepropertyjasper20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

JasPer License.

> http://www.ece.uvic.ca/~mdadams/jasper/LICENSE

---

##### `JPNIC` <span data-heading-title="`JPNIC`" data-heading-id="constructhubspdxlicensepropertyjpnic"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Japan Network Information Center License.

> https://gitlab.isc.org/isc-projects/bind9/blob/master/COPYRIGHT#L366

---

##### `JSON` <span data-heading-title="`JSON`" data-heading-id="constructhubspdxlicensepropertyjson"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

JSON License.

> http://www.json.org/license.html

---

##### `LAL_1_2` <span data-heading-title="`LAL_1_2`" data-heading-id="constructhubspdxlicensepropertylal12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Licence Art Libre 1.2.

> http://artlibre.org/licence/lal/licence-art-libre-12/

---

##### `LAL_1_3` <span data-heading-title="`LAL_1_3`" data-heading-id="constructhubspdxlicensepropertylal13"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Licence Art Libre 1.3.

> https://artlibre.org/

---

##### `LATEX2_E` <span data-heading-title="`LATEX2_E`" data-heading-id="constructhubspdxlicensepropertylatex2e"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Latex2e License.

> https://fedoraproject.org/wiki/Licensing/Latex2e

---

##### `LEPTONICA` <span data-heading-title="`LEPTONICA`" data-heading-id="constructhubspdxlicensepropertyleptonica"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Leptonica License.

> https://fedoraproject.org/wiki/Licensing/Leptonica

---

##### `LGPL_2_0` <span data-heading-title="`LGPL_2_0`" data-heading-id="constructhubspdxlicensepropertylgpl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Library General Public License v2 only.

> https://www.gnu.org/licenses/old-licenses/lgpl-2.0-standalone.html

---

##### `LGPL_2_0_ONLY` <span data-heading-title="`LGPL_2_0_ONLY`" data-heading-id="constructhubspdxlicensepropertylgpl20only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Library General Public License v2 only.

> https://www.gnu.org/licenses/old-licenses/lgpl-2.0-standalone.html

---

##### `LGPL_2_0_OR_LATER` <span data-heading-title="`LGPL_2_0_OR_LATER`" data-heading-id="constructhubspdxlicensepropertylgpl20orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Library General Public License v2 or later.

> https://www.gnu.org/licenses/old-licenses/lgpl-2.0-standalone.html

---

##### `LGPL_2_0_PLUS` <span data-heading-title="`LGPL_2_0_PLUS`" data-heading-id="constructhubspdxlicensepropertylgpl20plus"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Library General Public License v2 or later.

> https://www.gnu.org/licenses/old-licenses/lgpl-2.0-standalone.html

---

##### `LGPL_2_1` <span data-heading-title="`LGPL_2_1`" data-heading-id="constructhubspdxlicensepropertylgpl21"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Lesser General Public License v2.1 only.

> https://www.gnu.org/licenses/old-licenses/lgpl-2.1-standalone.html

---

##### `LGPL_2_1_ONLY` <span data-heading-title="`LGPL_2_1_ONLY`" data-heading-id="constructhubspdxlicensepropertylgpl21only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Lesser General Public License v2.1 only.

> https://www.gnu.org/licenses/old-licenses/lgpl-2.1-standalone.html

---

##### `LGPL_2_1_OR_LATER` <span data-heading-title="`LGPL_2_1_OR_LATER`" data-heading-id="constructhubspdxlicensepropertylgpl21orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Lesser General Public License v2.1 or later.

> https://www.gnu.org/licenses/old-licenses/lgpl-2.1-standalone.html

---

##### `LGPL_2_1_PLUS` <span data-heading-title="`LGPL_2_1_PLUS`" data-heading-id="constructhubspdxlicensepropertylgpl21plus"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Library General Public License v2.1 or later.

> https://www.gnu.org/licenses/old-licenses/lgpl-2.1-standalone.html

---

##### `LGPL_3_0` <span data-heading-title="`LGPL_3_0`" data-heading-id="constructhubspdxlicensepropertylgpl30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Lesser General Public License v3.0 only.

> https://www.gnu.org/licenses/lgpl-3.0-standalone.html

---

##### `LGPL_3_0_ONLY` <span data-heading-title="`LGPL_3_0_ONLY`" data-heading-id="constructhubspdxlicensepropertylgpl30only"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Lesser General Public License v3.0 only.

> https://www.gnu.org/licenses/lgpl-3.0-standalone.html

---

##### `LGPL_3_0_OR_LATER` <span data-heading-title="`LGPL_3_0_OR_LATER`" data-heading-id="constructhubspdxlicensepropertylgpl30orlater"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Lesser General Public License v3.0 or later.

> https://www.gnu.org/licenses/lgpl-3.0-standalone.html

---

##### `LGPL_3_0_PLUS` <span data-heading-title="`LGPL_3_0_PLUS`" data-heading-id="constructhubspdxlicensepropertylgpl30plus"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

GNU Lesser General Public License v3.0 or later.

> https://www.gnu.org/licenses/lgpl-3.0-standalone.html

---

##### `LGPLLR` <span data-heading-title="`LGPLLR`" data-heading-id="constructhubspdxlicensepropertylgpllr"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Lesser General Public License For Linguistic Resources.

> http://www-igm.univ-mlv.fr/~unitex/lgpllr.html

---

##### `LIBPNG` <span data-heading-title="`LIBPNG`" data-heading-id="constructhubspdxlicensepropertylibpng"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

libpng License.

> http://www.libpng.org/pub/png/src/libpng-LICENSE.txt

---

##### `LIBPNG_2_0` <span data-heading-title="`LIBPNG_2_0`" data-heading-id="constructhubspdxlicensepropertylibpng20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

PNG Reference Library version 2.

> http://www.libpng.org/pub/png/src/libpng-LICENSE.txt

---

##### `LIBSELINUX_1_0` <span data-heading-title="`LIBSELINUX_1_0`" data-heading-id="constructhubspdxlicensepropertylibselinux10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

libselinux public domain notice.

> https://github.com/SELinuxProject/selinux/blob/master/libselinux/LICENSE

---

##### `LIBTIFF` <span data-heading-title="`LIBTIFF`" data-heading-id="constructhubspdxlicensepropertylibtiff"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

libtiff License.

> https://fedoraproject.org/wiki/Licensing/libtiff

---

##### `LILIQ_P_1_1` <span data-heading-title="`LILIQ_P_1_1`" data-heading-id="constructhubspdxlicensepropertyliliqp11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Licence Libre du Québec – Permissive version 1.1.

> https://forge.gouv.qc.ca/licence/fr/liliq-v1-1/

---

##### `LILIQ_R_1_1` <span data-heading-title="`LILIQ_R_1_1`" data-heading-id="constructhubspdxlicensepropertyliliqr11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Licence Libre du Québec – Réciprocité version 1.1.

> https://www.forge.gouv.qc.ca/participez/licence-logicielle/licence-libre-du-quebec-liliq-en-francais/licence-libre-du-quebec-reciprocite-liliq-r-v1-1/

---

##### `LILIQ_RPLUS_1_1` <span data-heading-title="`LILIQ_RPLUS_1_1`" data-heading-id="constructhubspdxlicensepropertyliliqrplus11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Licence Libre du Québec – Réciprocité forte version 1.1.

> https://www.forge.gouv.qc.ca/participez/licence-logicielle/licence-libre-du-quebec-liliq-en-francais/licence-libre-du-quebec-reciprocite-forte-liliq-r-v1-1/

---

##### `LINUX_OPENIB` <span data-heading-title="`LINUX_OPENIB`" data-heading-id="constructhubspdxlicensepropertylinuxopenib"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Linux Kernel Variant of OpenIB.org license.

> https://git.kernel.org/pub/scm/linux/kernel/git/torvalds/linux.git/tree/drivers/infiniband/core/sa.h

---

##### `LPL_1_0` <span data-heading-title="`LPL_1_0`" data-heading-id="constructhubspdxlicensepropertylpl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Lucent Public License Version 1.0.

> https://opensource.org/licenses/LPL-1.0

---

##### `LPL_1_02` <span data-heading-title="`LPL_1_02`" data-heading-id="constructhubspdxlicensepropertylpl102"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Lucent Public License v1.02.

> http://plan9.bell-labs.com/plan9/license.html

---

##### `LPPL_1_0` <span data-heading-title="`LPPL_1_0`" data-heading-id="constructhubspdxlicensepropertylppl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

LaTeX Project Public License v1.0.

> http://www.latex-project.org/lppl/lppl-1-0.txt

---

##### `LPPL_1_1` <span data-heading-title="`LPPL_1_1`" data-heading-id="constructhubspdxlicensepropertylppl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

LaTeX Project Public License v1.1.

> http://www.latex-project.org/lppl/lppl-1-1.txt

---

##### `LPPL_1_2` <span data-heading-title="`LPPL_1_2`" data-heading-id="constructhubspdxlicensepropertylppl12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

LaTeX Project Public License v1.2.

> http://www.latex-project.org/lppl/lppl-1-2.txt

---

##### `LPPL_1_3A` <span data-heading-title="`LPPL_1_3A`" data-heading-id="constructhubspdxlicensepropertylppl13a"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

LaTeX Project Public License v1.3a.

> http://www.latex-project.org/lppl/lppl-1-3a.txt

---

##### `LPPL_1_3C` <span data-heading-title="`LPPL_1_3C`" data-heading-id="constructhubspdxlicensepropertylppl13c"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

LaTeX Project Public License v1.3c.

> http://www.latex-project.org/lppl/lppl-1-3c.txt

---

##### `MAKE_INDEX` <span data-heading-title="`MAKE_INDEX`" data-heading-id="constructhubspdxlicensepropertymakeindex"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

MakeIndex License.

> https://fedoraproject.org/wiki/Licensing/MakeIndex

---

##### `MIR_O_S` <span data-heading-title="`MIR_O_S`" data-heading-id="constructhubspdxlicensepropertymiros"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

The MirOS Licence.

> https://opensource.org/licenses/MirOS

---

##### `MIT` <span data-heading-title="`MIT`" data-heading-id="constructhubspdxlicensepropertymit"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

MIT License.

> https://opensource.org/licenses/MIT

---

##### `MIT_0` <span data-heading-title="`MIT_0`" data-heading-id="constructhubspdxlicensepropertymit0"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

MIT No Attribution.

> https://github.com/aws/mit-0

---

##### `MIT_ADVERTISING` <span data-heading-title="`MIT_ADVERTISING`" data-heading-id="constructhubspdxlicensepropertymitadvertising"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Enlightenment License (e16).

> https://fedoraproject.org/wiki/Licensing/MIT_With_Advertising

---

##### `MIT_CMU` <span data-heading-title="`MIT_CMU`" data-heading-id="constructhubspdxlicensepropertymitcmu"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

CMU License.

> https://fedoraproject.org/wiki/Licensing:MIT?rd=Licensing/MIT#CMU_Style

---

##### `MIT_ENNA` <span data-heading-title="`MIT_ENNA`" data-heading-id="constructhubspdxlicensepropertymitenna"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

enna License.

> https://fedoraproject.org/wiki/Licensing/MIT#enna

---

##### `MIT_FEH` <span data-heading-title="`MIT_FEH`" data-heading-id="constructhubspdxlicensepropertymitfeh"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

feh License.

> https://fedoraproject.org/wiki/Licensing/MIT#feh

---

##### `MIT_OPEN_GROUP` <span data-heading-title="`MIT_OPEN_GROUP`" data-heading-id="constructhubspdxlicensepropertymitopengroup"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

MIT Open Group variant.

> https://gitlab.freedesktop.org/xorg/app/iceauth/-/blob/master/COPYING

---

##### `MITNFA` <span data-heading-title="`MITNFA`" data-heading-id="constructhubspdxlicensepropertymitnfa"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

MIT +no-false-attribs license.

> https://fedoraproject.org/wiki/Licensing/MITNFA

---

##### `MOTOSOTO` <span data-heading-title="`MOTOSOTO`" data-heading-id="constructhubspdxlicensepropertymotosoto"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Motosoto License.

> https://opensource.org/licenses/Motosoto

---

##### `MPICH2` <span data-heading-title="`MPICH2`" data-heading-id="constructhubspdxlicensepropertympich2"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

mpich2 License.

> https://fedoraproject.org/wiki/Licensing/MIT

---

##### `MPL_1_0` <span data-heading-title="`MPL_1_0`" data-heading-id="constructhubspdxlicensepropertympl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Mozilla Public License 1.0.

> http://www.mozilla.org/MPL/MPL-1.0.html

---

##### `MPL_1_1` <span data-heading-title="`MPL_1_1`" data-heading-id="constructhubspdxlicensepropertympl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Mozilla Public License 1.1.

> http://www.mozilla.org/MPL/MPL-1.1.html

---

##### `MPL_2_0` <span data-heading-title="`MPL_2_0`" data-heading-id="constructhubspdxlicensepropertympl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Mozilla Public License 2.0.

> http://www.mozilla.org/MPL/2.0/

---

##### `MPL_2_0_NO_COPYLEFT_EXCEPTION` <span data-heading-title="`MPL_2_0_NO_COPYLEFT_EXCEPTION`" data-heading-id="constructhubspdxlicensepropertympl20nocopyleftexception"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Mozilla Public License 2.0 (no copyleft exception).

> http://www.mozilla.org/MPL/2.0/

---

##### `MS_PL` <span data-heading-title="`MS_PL`" data-heading-id="constructhubspdxlicensepropertymspl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Microsoft Public License.

> http://www.microsoft.com/opensource/licenses.mspx

---

##### `MS_RL` <span data-heading-title="`MS_RL`" data-heading-id="constructhubspdxlicensepropertymsrl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Microsoft Reciprocal License.

> http://www.microsoft.com/opensource/licenses.mspx

---

##### `MTLL` <span data-heading-title="`MTLL`" data-heading-id="constructhubspdxlicensepropertymtll"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Matrix Template Library License.

> https://fedoraproject.org/wiki/Licensing/Matrix_Template_Library_License

---

##### `MULANPSL_1_0` <span data-heading-title="`MULANPSL_1_0`" data-heading-id="constructhubspdxlicensepropertymulanpsl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Mulan Permissive Software License, Version 1.

> https://license.coscl.org.cn/MulanPSL/

---

##### `MULANPSL_2_0` <span data-heading-title="`MULANPSL_2_0`" data-heading-id="constructhubspdxlicensepropertymulanpsl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Mulan Permissive Software License, Version 2.

> https://license.coscl.org.cn/MulanPSL2/

---

##### `MULTICS` <span data-heading-title="`MULTICS`" data-heading-id="constructhubspdxlicensepropertymultics"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Multics License.

> https://opensource.org/licenses/Multics

---

##### `MUP` <span data-heading-title="`MUP`" data-heading-id="constructhubspdxlicensepropertymup"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Mup License.

> https://fedoraproject.org/wiki/Licensing/Mup

---

##### `NASA_1_3` <span data-heading-title="`NASA_1_3`" data-heading-id="constructhubspdxlicensepropertynasa13"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

NASA Open Source Agreement 1.3.

> http://ti.arc.nasa.gov/opensource/nosa/

---

##### `NAUMEN` <span data-heading-title="`NAUMEN`" data-heading-id="constructhubspdxlicensepropertynaumen"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Naumen Public License.

> https://opensource.org/licenses/Naumen

---

##### `NBPL_1_0` <span data-heading-title="`NBPL_1_0`" data-heading-id="constructhubspdxlicensepropertynbpl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Net Boolean Public License v1.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=37b4b3f6cc4bf34e1d3dec61e69914b9819d8894

---

##### `NCGL_UK_2_0` <span data-heading-title="`NCGL_UK_2_0`" data-heading-id="constructhubspdxlicensepropertyncgluk20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Non-Commercial Government Licence.

> https://github.com/spdx/license-list-XML/blob/master/src/Apache-2.0.xml

---

##### `NCSA` <span data-heading-title="`NCSA`" data-heading-id="constructhubspdxlicensepropertyncsa"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

University of Illinois/NCSA Open Source License.

> http://otm.illinois.edu/uiuc_openSource

---

##### `NET_CD_F` <span data-heading-title="`NET_CD_F`" data-heading-id="constructhubspdxlicensepropertynetcdf"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

NetCDF license.

> http://www.unidata.ucar.edu/software/netcdf/copyright.html

---

##### `NET_SNMP` <span data-heading-title="`NET_SNMP`" data-heading-id="constructhubspdxlicensepropertynetsnmp"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Net-SNMP License.

> http://net-snmp.sourceforge.net/about/license.html

---

##### `NEWSLETR` <span data-heading-title="`NEWSLETR`" data-heading-id="constructhubspdxlicensepropertynewsletr"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Newsletr License.

> https://fedoraproject.org/wiki/Licensing/Newsletr

---

##### `NGPL` <span data-heading-title="`NGPL`" data-heading-id="constructhubspdxlicensepropertyngpl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Nethack General Public License.

> https://opensource.org/licenses/NGPL

---

##### `NIST_PD` <span data-heading-title="`NIST_PD`" data-heading-id="constructhubspdxlicensepropertynistpd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

NIST Public Domain Notice.

> https://github.com/tcheneau/simpleRPL/blob/e645e69e38dd4e3ccfeceb2db8cba05b7c2e0cd3/LICENSE.txt

---

##### `NIST_PD_FALLBACK` <span data-heading-title="`NIST_PD_FALLBACK`" data-heading-id="constructhubspdxlicensepropertynistpdfallback"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

NIST Public Domain Notice with license fallback.

> https://github.com/usnistgov/jsip/blob/59700e6926cbe96c5cdae897d9a7d2656b42abe3/LICENSE

---

##### `NLOD_1_0` <span data-heading-title="`NLOD_1_0`" data-heading-id="constructhubspdxlicensepropertynlod10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Norwegian Licence for Open Government Data.

> http://data.norge.no/nlod/en/1.0

---

##### `NLPL` <span data-heading-title="`NLPL`" data-heading-id="constructhubspdxlicensepropertynlpl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

No Limit Public License.

> https://fedoraproject.org/wiki/Licensing/NLPL

---

##### `NOKIA` <span data-heading-title="`NOKIA`" data-heading-id="constructhubspdxlicensepropertynokia"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Nokia Open Source License.

> https://opensource.org/licenses/nokia

---

##### `NOSL` <span data-heading-title="`NOSL`" data-heading-id="constructhubspdxlicensepropertynosl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Netizen Open Source License.

> http://bits.netizen.com.au/licenses/NOSL/nosl.txt

---

##### `NOWEB` <span data-heading-title="`NOWEB`" data-heading-id="constructhubspdxlicensepropertynoweb"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Noweb License.

> https://fedoraproject.org/wiki/Licensing/Noweb

---

##### `NPL_1_0` <span data-heading-title="`NPL_1_0`" data-heading-id="constructhubspdxlicensepropertynpl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Netscape Public License v1.0.

> http://www.mozilla.org/MPL/NPL/1.0/

---

##### `NPL_1_1` <span data-heading-title="`NPL_1_1`" data-heading-id="constructhubspdxlicensepropertynpl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Netscape Public License v1.1.

> http://www.mozilla.org/MPL/NPL/1.1/

---

##### `NPOSL_3_0` <span data-heading-title="`NPOSL_3_0`" data-heading-id="constructhubspdxlicensepropertynposl30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Non-Profit Open Software License 3.0.

> https://opensource.org/licenses/NOSL3.0

---

##### `NRL` <span data-heading-title="`NRL`" data-heading-id="constructhubspdxlicensepropertynrl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

NRL License.

> http://web.mit.edu/network/isakmp/nrllicense.html

---

##### `NTP` <span data-heading-title="`NTP`" data-heading-id="constructhubspdxlicensepropertyntp"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

NTP License.

> https://opensource.org/licenses/NTP

---

##### `NTP_0` <span data-heading-title="`NTP_0`" data-heading-id="constructhubspdxlicensepropertyntp0"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

NTP No Attribution.

> https://github.com/tytso/e2fsprogs/blob/master/lib/et/et_name.c

---

##### `NUNIT` <span data-heading-title="`NUNIT`" data-heading-id="constructhubspdxlicensepropertynunit"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Nunit License.

> https://fedoraproject.org/wiki/Licensing/Nunit

---

##### `O_UDA_1_0` <span data-heading-title="`O_UDA_1_0`" data-heading-id="constructhubspdxlicensepropertyouda10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Use of Data Agreement v1.0.

> https://github.com/microsoft/Open-Use-of-Data-Agreement/blob/v1.0/O-UDA-1.0.md

---

##### `OCCT_PL` <span data-heading-title="`OCCT_PL`" data-heading-id="constructhubspdxlicensepropertyocctpl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open CASCADE Technology Public License.

> http://www.opencascade.com/content/occt-public-license

---

##### `OCLC_2_0` <span data-heading-title="`OCLC_2_0`" data-heading-id="constructhubspdxlicensepropertyoclc20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

OCLC Research Public License 2.0.

> http://www.oclc.org/research/activities/software/license/v2final.htm

---

##### `ODBL_1_0` <span data-heading-title="`ODBL_1_0`" data-heading-id="constructhubspdxlicensepropertyodbl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

ODC Open Database License v1.0.

> http://www.opendatacommons.org/licenses/odbl/1.0/

---

##### `ODC_BY_1_0` <span data-heading-title="`ODC_BY_1_0`" data-heading-id="constructhubspdxlicensepropertyodcby10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Data Commons Attribution License v1.0.

> https://opendatacommons.org/licenses/by/1.0/

---

##### `OFL_1_0` <span data-heading-title="`OFL_1_0`" data-heading-id="constructhubspdxlicensepropertyofl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SIL Open Font License 1.0.

> http://scripts.sil.org/cms/scripts/page.php?item_id=OFL10_web

---

##### `OFL_1_0_NO_RFN` <span data-heading-title="`OFL_1_0_NO_RFN`" data-heading-id="constructhubspdxlicensepropertyofl10norfn"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SIL Open Font License 1.0 with no Reserved Font Name.

> http://scripts.sil.org/cms/scripts/page.php?item_id=OFL10_web

---

##### `OFL_1_0_RFN` <span data-heading-title="`OFL_1_0_RFN`" data-heading-id="constructhubspdxlicensepropertyofl10rfn"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SIL Open Font License 1.0 with Reserved Font Name.

> http://scripts.sil.org/cms/scripts/page.php?item_id=OFL10_web

---

##### `OFL_1_1` <span data-heading-title="`OFL_1_1`" data-heading-id="constructhubspdxlicensepropertyofl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SIL Open Font License 1.1.

> http://scripts.sil.org/cms/scripts/page.php?item_id=OFL_web

---

##### `OFL_1_1_NO_RFN` <span data-heading-title="`OFL_1_1_NO_RFN`" data-heading-id="constructhubspdxlicensepropertyofl11norfn"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SIL Open Font License 1.1 with no Reserved Font Name.

> http://scripts.sil.org/cms/scripts/page.php?item_id=OFL_web

---

##### `OFL_1_1_RFN` <span data-heading-title="`OFL_1_1_RFN`" data-heading-id="constructhubspdxlicensepropertyofl11rfn"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SIL Open Font License 1.1 with Reserved Font Name.

> http://scripts.sil.org/cms/scripts/page.php?item_id=OFL_web

---

##### `OGC_1_0` <span data-heading-title="`OGC_1_0`" data-heading-id="constructhubspdxlicensepropertyogc10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

OGC Software License, Version 1.0.

> https://www.ogc.org/ogc/software/1.0

---

##### `OGL_CANADA_2_0` <span data-heading-title="`OGL_CANADA_2_0`" data-heading-id="constructhubspdxlicensepropertyoglcanada20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Government Licence - Canada.

> https://open.canada.ca/en/open-government-licence-canada

---

##### `OGL_UK_1_0` <span data-heading-title="`OGL_UK_1_0`" data-heading-id="constructhubspdxlicensepropertyogluk10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Government Licence v1.0.

> http://www.nationalarchives.gov.uk/doc/open-government-licence/version/1/

---

##### `OGL_UK_2_0` <span data-heading-title="`OGL_UK_2_0`" data-heading-id="constructhubspdxlicensepropertyogluk20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Government Licence v2.0.

> http://www.nationalarchives.gov.uk/doc/open-government-licence/version/2/

---

##### `OGL_UK_3_0` <span data-heading-title="`OGL_UK_3_0`" data-heading-id="constructhubspdxlicensepropertyogluk30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Government Licence v3.0.

> http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/

---

##### `OGTSL` <span data-heading-title="`OGTSL`" data-heading-id="constructhubspdxlicensepropertyogtsl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Group Test Suite License.

> http://www.opengroup.org/testing/downloads/The_Open_Group_TSL.txt

---

##### `OLDAP_1_1` <span data-heading-title="`OLDAP_1_1`" data-heading-id="constructhubspdxlicensepropertyoldap11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v1.1.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=806557a5ad59804ef3a44d5abfbe91d706b0791f

---

##### `OLDAP_1_2` <span data-heading-title="`OLDAP_1_2`" data-heading-id="constructhubspdxlicensepropertyoldap12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v1.2.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=42b0383c50c299977b5893ee695cf4e486fb0dc7

---

##### `OLDAP_1_3` <span data-heading-title="`OLDAP_1_3`" data-heading-id="constructhubspdxlicensepropertyoldap13"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v1.3.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=e5f8117f0ce088d0bd7a8e18ddf37eaa40eb09b1

---

##### `OLDAP_1_4` <span data-heading-title="`OLDAP_1_4`" data-heading-id="constructhubspdxlicensepropertyoldap14"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v1.4.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=c9f95c2f3f2ffb5e0ae55fe7388af75547660941

---

##### `OLDAP_2_0` <span data-heading-title="`OLDAP_2_0`" data-heading-id="constructhubspdxlicensepropertyoldap20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.0 (or possibly 2.0A and 2.0B).

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=cbf50f4e1185a21abd4c0a54d3f4341fe28f36ea

---

##### `OLDAP_2_0_1` <span data-heading-title="`OLDAP_2_0_1`" data-heading-id="constructhubspdxlicensepropertyoldap201"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.0.1.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=b6d68acd14e51ca3aab4428bf26522aa74873f0e

---

##### `OLDAP_2_1` <span data-heading-title="`OLDAP_2_1`" data-heading-id="constructhubspdxlicensepropertyoldap21"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.1.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=b0d176738e96a0d3b9f85cb51e140a86f21be715

---

##### `OLDAP_2_2` <span data-heading-title="`OLDAP_2_2`" data-heading-id="constructhubspdxlicensepropertyoldap22"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.2.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=470b0c18ec67621c85881b2733057fecf4a1acc3

---

##### `OLDAP_2_2_1` <span data-heading-title="`OLDAP_2_2_1`" data-heading-id="constructhubspdxlicensepropertyoldap221"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.2.1.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=4bc786f34b50aa301be6f5600f58a980070f481e

---

##### `OLDAP_2_2_2` <span data-heading-title="`OLDAP_2_2_2`" data-heading-id="constructhubspdxlicensepropertyoldap222"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License 2.2.2.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=df2cc1e21eb7c160695f5b7cffd6296c151ba188

---

##### `OLDAP_2_3` <span data-heading-title="`OLDAP_2_3`" data-heading-id="constructhubspdxlicensepropertyoldap23"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.3.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=d32cf54a32d581ab475d23c810b0a7fbaf8d63c3

---

##### `OLDAP_2_4` <span data-heading-title="`OLDAP_2_4`" data-heading-id="constructhubspdxlicensepropertyoldap24"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.4.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=cd1284c4a91a8a380d904eee68d1583f989ed386

---

##### `OLDAP_2_5` <span data-heading-title="`OLDAP_2_5`" data-heading-id="constructhubspdxlicensepropertyoldap25"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.5.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=6852b9d90022e8593c98205413380536b1b5a7cf

---

##### `OLDAP_2_6` <span data-heading-title="`OLDAP_2_6`" data-heading-id="constructhubspdxlicensepropertyoldap26"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.6.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=1cae062821881f41b73012ba816434897abf4205

---

##### `OLDAP_2_7` <span data-heading-title="`OLDAP_2_7`" data-heading-id="constructhubspdxlicensepropertyoldap27"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.7.

> http://www.openldap.org/devel/gitweb.cgi?p=openldap.git;a=blob;f=LICENSE;hb=47c2415c1df81556eeb39be6cad458ef87c534a2

---

##### `OLDAP_2_8` <span data-heading-title="`OLDAP_2_8`" data-heading-id="constructhubspdxlicensepropertyoldap28"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open LDAP Public License v2.8.

> http://www.openldap.org/software/release/license.html

---

##### `OML` <span data-heading-title="`OML`" data-heading-id="constructhubspdxlicensepropertyoml"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Market License.

> https://fedoraproject.org/wiki/Licensing/Open_Market_License

---

##### `OPEN_SS_L` <span data-heading-title="`OPEN_SS_L`" data-heading-id="constructhubspdxlicensepropertyopenssl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

OpenSSL License.

> http://www.openssl.org/source/license.html

---

##### `OPL_1_0` <span data-heading-title="`OPL_1_0`" data-heading-id="constructhubspdxlicensepropertyopl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Public License v1.0.

> http://old.koalateam.com/jackaroo/OPL_1_0.TXT

---

##### `OSET_PL_2_1` <span data-heading-title="`OSET_PL_2_1`" data-heading-id="constructhubspdxlicensepropertyosetpl21"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

OSET Public License version 2.1.

> http://www.osetfoundation.org/public-license

---

##### `OSL_1_0` <span data-heading-title="`OSL_1_0`" data-heading-id="constructhubspdxlicensepropertyosl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Software License 1.0.

> https://opensource.org/licenses/OSL-1.0

---

##### `OSL_1_1` <span data-heading-title="`OSL_1_1`" data-heading-id="constructhubspdxlicensepropertyosl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Software License 1.1.

> https://fedoraproject.org/wiki/Licensing/OSL1.1

---

##### `OSL_2_0` <span data-heading-title="`OSL_2_0`" data-heading-id="constructhubspdxlicensepropertyosl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Software License 2.0.

> http://web.archive.org/web/20041020171434/http://www.rosenlaw.com/osl2.0.html

---

##### `OSL_2_1` <span data-heading-title="`OSL_2_1`" data-heading-id="constructhubspdxlicensepropertyosl21"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Software License 2.1.

> http://web.archive.org/web/20050212003940/http://www.rosenlaw.com/osl21.htm

---

##### `OSL_3_0` <span data-heading-title="`OSL_3_0`" data-heading-id="constructhubspdxlicensepropertyosl30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Open Software License 3.0.

> https://web.archive.org/web/20120101081418/http://rosenlaw.com:80/OSL3.0.htm

---

##### `PARITY_6_0_0` <span data-heading-title="`PARITY_6_0_0`" data-heading-id="constructhubspdxlicensepropertyparity600"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

The Parity Public License 6.0.0.

> https://paritylicense.com/versions/6.0.0.html

---

##### `PARITY_7_0_0` <span data-heading-title="`PARITY_7_0_0`" data-heading-id="constructhubspdxlicensepropertyparity700"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

The Parity Public License 7.0.0.

> https://paritylicense.com/versions/7.0.0.html

---

##### `PDDL_1_0` <span data-heading-title="`PDDL_1_0`" data-heading-id="constructhubspdxlicensepropertypddl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

ODC Public Domain Dedication & License 1.0.

> http://opendatacommons.org/licenses/pddl/1.0/

---

##### `PHP_3_0` <span data-heading-title="`PHP_3_0`" data-heading-id="constructhubspdxlicensepropertyphp30"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

PHP License v3.0.

> http://www.php.net/license/3_0.txt

---

##### `PHP_3_01` <span data-heading-title="`PHP_3_01`" data-heading-id="constructhubspdxlicensepropertyphp301"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

PHP License v3.01.

> http://www.php.net/license/3_01.txt

---

##### `PLEXUS` <span data-heading-title="`PLEXUS`" data-heading-id="constructhubspdxlicensepropertyplexus"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Plexus Classworlds License.

> https://fedoraproject.org/wiki/Licensing/Plexus_Classworlds_License

---

##### `POLYFORM_NONCOMMERCIAL_1_0_0` <span data-heading-title="`POLYFORM_NONCOMMERCIAL_1_0_0`" data-heading-id="constructhubspdxlicensepropertypolyformnoncommercial100"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

PolyForm Noncommercial License 1.0.0.

> https://polyformproject.org/licenses/noncommercial/1.0.0

---

##### `POLYFORM_SMALL_BUSINESS_1_0_0` <span data-heading-title="`POLYFORM_SMALL_BUSINESS_1_0_0`" data-heading-id="constructhubspdxlicensepropertypolyformsmallbusiness100"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

PolyForm Small Business License 1.0.0.

> https://polyformproject.org/licenses/small-business/1.0.0

---

##### `POSTGRE_SQ_L` <span data-heading-title="`POSTGRE_SQ_L`" data-heading-id="constructhubspdxlicensepropertypostgresql"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

PostgreSQL License.

> http://www.postgresql.org/about/licence

---

##### `PSF_2_0` <span data-heading-title="`PSF_2_0`" data-heading-id="constructhubspdxlicensepropertypsf20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Python Software Foundation License 2.0.

> https://opensource.org/licenses/Python-2.0

---

##### `PSFRAG` <span data-heading-title="`PSFRAG`" data-heading-id="constructhubspdxlicensepropertypsfrag"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

psfrag License.

> https://fedoraproject.org/wiki/Licensing/psfrag

---

##### `PSUTILS` <span data-heading-title="`PSUTILS`" data-heading-id="constructhubspdxlicensepropertypsutils"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

psutils License.

> https://fedoraproject.org/wiki/Licensing/psutils

---

##### `PYTHON_2_0` <span data-heading-title="`PYTHON_2_0`" data-heading-id="constructhubspdxlicensepropertypython20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Python License 2.0.

> https://opensource.org/licenses/Python-2.0

---

##### `QHULL` <span data-heading-title="`QHULL`" data-heading-id="constructhubspdxlicensepropertyqhull"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Qhull License.

> https://fedoraproject.org/wiki/Licensing/Qhull

---

##### `QPL_1_0` <span data-heading-title="`QPL_1_0`" data-heading-id="constructhubspdxlicensepropertyqpl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Q Public License 1.0.

> http://doc.qt.nokia.com/3.3/license.html

---

##### `RDISC` <span data-heading-title="`RDISC`" data-heading-id="constructhubspdxlicensepropertyrdisc"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Rdisc License.

> https://fedoraproject.org/wiki/Licensing/Rdisc_License

---

##### `RHECOS_1_1` <span data-heading-title="`RHECOS_1_1`" data-heading-id="constructhubspdxlicensepropertyrhecos11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Red Hat eCos Public License v1.1.

> http://ecos.sourceware.org/old-license.html

---

##### `RPL_1_1` <span data-heading-title="`RPL_1_1`" data-heading-id="constructhubspdxlicensepropertyrpl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Reciprocal Public License 1.1.

> https://opensource.org/licenses/RPL-1.1

---

##### `RPL_1_5` <span data-heading-title="`RPL_1_5`" data-heading-id="constructhubspdxlicensepropertyrpl15"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Reciprocal Public License 1.5.

> https://opensource.org/licenses/RPL-1.5

---

##### `RPSL_1_0` <span data-heading-title="`RPSL_1_0`" data-heading-id="constructhubspdxlicensepropertyrpsl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

RealNetworks Public Source License v1.0.

> https://helixcommunity.org/content/rpsl

---

##### `RSA_MD` <span data-heading-title="`RSA_MD`" data-heading-id="constructhubspdxlicensepropertyrsamd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

RSA Message-Digest License.

> http://www.faqs.org/rfcs/rfc1321.html

---

##### `RSCPL` <span data-heading-title="`RSCPL`" data-heading-id="constructhubspdxlicensepropertyrscpl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Ricoh Source Code Public License.

> http://wayback.archive.org/web/20060715140826/http://www.risource.org/RPL/RPL-1.0A.shtml

---

##### `RUBY` <span data-heading-title="`RUBY`" data-heading-id="constructhubspdxlicensepropertyruby"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Ruby License.

> http://www.ruby-lang.org/en/LICENSE.txt

---

##### `SAX_PD` <span data-heading-title="`SAX_PD`" data-heading-id="constructhubspdxlicensepropertysaxpd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Sax Public Domain Notice.

> http://www.saxproject.org/copying.html

---

##### `SAXPATH` <span data-heading-title="`SAXPATH`" data-heading-id="constructhubspdxlicensepropertysaxpath"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Saxpath License.

> https://fedoraproject.org/wiki/Licensing/Saxpath_License

---

##### `SCEA` <span data-heading-title="`SCEA`" data-heading-id="constructhubspdxlicensepropertyscea"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SCEA Shared Source License.

> http://research.scea.com/scea_shared_source_license.html

---

##### `SENDMAIL` <span data-heading-title="`SENDMAIL`" data-heading-id="constructhubspdxlicensepropertysendmail"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Sendmail License.

> http://www.sendmail.com/pdfs/open_source/sendmail_license.pdf

---

##### `SENDMAIL_8_23` <span data-heading-title="`SENDMAIL_8_23`" data-heading-id="constructhubspdxlicensepropertysendmail823"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Sendmail License 8.23.

> https://www.proofpoint.com/sites/default/files/sendmail-license.pdf

---

##### `SGI_B_1_0` <span data-heading-title="`SGI_B_1_0`" data-heading-id="constructhubspdxlicensepropertysgib10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SGI Free Software License B v1.0.

> http://oss.sgi.com/projects/FreeB/SGIFreeSWLicB.1.0.html

---

##### `SGI_B_1_1` <span data-heading-title="`SGI_B_1_1`" data-heading-id="constructhubspdxlicensepropertysgib11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SGI Free Software License B v1.1.

> http://oss.sgi.com/projects/FreeB/

---

##### `SGI_B_2_0` <span data-heading-title="`SGI_B_2_0`" data-heading-id="constructhubspdxlicensepropertysgib20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SGI Free Software License B v2.0.

> http://oss.sgi.com/projects/FreeB/SGIFreeSWLicB.2.0.pdf

---

##### `SHL_0_5` <span data-heading-title="`SHL_0_5`" data-heading-id="constructhubspdxlicensepropertyshl05"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Solderpad Hardware License v0.5.

> https://solderpad.org/licenses/SHL-0.5/

---

##### `SHL_0_51` <span data-heading-title="`SHL_0_51`" data-heading-id="constructhubspdxlicensepropertyshl051"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Solderpad Hardware License, Version 0.51.

> https://solderpad.org/licenses/SHL-0.51/

---

##### `SIMPL_2_0` <span data-heading-title="`SIMPL_2_0`" data-heading-id="constructhubspdxlicensepropertysimpl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Simple Public License 2.0.

> https://opensource.org/licenses/SimPL-2.0

---

##### `SISSL` <span data-heading-title="`SISSL`" data-heading-id="constructhubspdxlicensepropertysissl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Sun Industry Standards Source License v1.1.

> http://www.openoffice.org/licenses/sissl_license.html

---

##### `SISSL_1_2` <span data-heading-title="`SISSL_1_2`" data-heading-id="constructhubspdxlicensepropertysissl12"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Sun Industry Standards Source License v1.2.

> http://gridscheduler.sourceforge.net/Gridengine_SISSL_license.html

---

##### `SLEEPYCAT` <span data-heading-title="`SLEEPYCAT`" data-heading-id="constructhubspdxlicensepropertysleepycat"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Sleepycat License.

> https://opensource.org/licenses/Sleepycat

---

##### `SMLNJ` <span data-heading-title="`SMLNJ`" data-heading-id="constructhubspdxlicensepropertysmlnj"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Standard ML of New Jersey License.

> https://www.smlnj.org/license.html

---

##### `SMPPL` <span data-heading-title="`SMPPL`" data-heading-id="constructhubspdxlicensepropertysmppl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Secure Messaging Protocol Public License.

> https://github.com/dcblake/SMP/blob/master/Documentation/License.txt

---

##### `SNIA` <span data-heading-title="`SNIA`" data-heading-id="constructhubspdxlicensepropertysnia"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SNIA Public License 1.1.

> https://fedoraproject.org/wiki/Licensing/SNIA_Public_License

---

##### `SPENCER_86` <span data-heading-title="`SPENCER_86`" data-heading-id="constructhubspdxlicensepropertyspencer86"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Spencer License 86.

> https://fedoraproject.org/wiki/Licensing/Henry_Spencer_Reg-Ex_Library_License

---

##### `SPENCER_94` <span data-heading-title="`SPENCER_94`" data-heading-id="constructhubspdxlicensepropertyspencer94"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Spencer License 94.

> https://fedoraproject.org/wiki/Licensing/Henry_Spencer_Reg-Ex_Library_License

---

##### `SPENCER_99` <span data-heading-title="`SPENCER_99`" data-heading-id="constructhubspdxlicensepropertyspencer99"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Spencer License 99.

> http://www.opensource.apple.com/source/tcl/tcl-5/tcl/generic/regfronts.c

---

##### `SPL_1_0` <span data-heading-title="`SPL_1_0`" data-heading-id="constructhubspdxlicensepropertyspl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Sun Public License v1.0.

> https://opensource.org/licenses/SPL-1.0

---

##### `SSH_OPENSSH` <span data-heading-title="`SSH_OPENSSH`" data-heading-id="constructhubspdxlicensepropertysshopenssh"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SSH OpenSSH license.

> https://github.com/openssh/openssh-portable/blob/1b11ea7c58cd5c59838b5fa574cd456d6047b2d4/LICENCE#L10

---

##### `SSH_SHORT` <span data-heading-title="`SSH_SHORT`" data-heading-id="constructhubspdxlicensepropertysshshort"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SSH short notice.

> https://github.com/openssh/openssh-portable/blob/1b11ea7c58cd5c59838b5fa574cd456d6047b2d4/pathnames.h

---

##### `SSPL_1_0` <span data-heading-title="`SSPL_1_0`" data-heading-id="constructhubspdxlicensepropertysspl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Server Side Public License, v 1.

> https://www.mongodb.com/licensing/server-side-public-license

---

##### `STANDARDML_NJ` <span data-heading-title="`STANDARDML_NJ`" data-heading-id="constructhubspdxlicensepropertystandardmlnj"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Standard ML of New Jersey License.

> http://www.smlnj.org//license.html

---

##### `SUGARCRM_1_1_3` <span data-heading-title="`SUGARCRM_1_1_3`" data-heading-id="constructhubspdxlicensepropertysugarcrm113"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

SugarCRM Public License v1.1.3.

> http://www.sugarcrm.com/crm/SPL

---

##### `SWL` <span data-heading-title="`SWL`" data-heading-id="constructhubspdxlicensepropertyswl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Scheme Widget Library (SWL) Software License Agreement.

> https://fedoraproject.org/wiki/Licensing/SWL

---

##### `TAPR_OHL_1_0` <span data-heading-title="`TAPR_OHL_1_0`" data-heading-id="constructhubspdxlicensepropertytaprohl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

TAPR Open Hardware License v1.0.

> https://www.tapr.org/OHL

---

##### `TCL` <span data-heading-title="`TCL`" data-heading-id="constructhubspdxlicensepropertytcl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

TCL/TK License.

> http://www.tcl.tk/software/tcltk/license.html

---

##### `TCP_WRAPPERS` <span data-heading-title="`TCP_WRAPPERS`" data-heading-id="constructhubspdxlicensepropertytcpwrappers"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

TCP Wrappers License.

> http://rc.quest.com/topics/openssh/license.php#tcpwrappers

---

##### `TMATE` <span data-heading-title="`TMATE`" data-heading-id="constructhubspdxlicensepropertytmate"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

TMate Open Source License.

> http://svnkit.com/license.html

---

##### `TORQUE_1_1` <span data-heading-title="`TORQUE_1_1`" data-heading-id="constructhubspdxlicensepropertytorque11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

TORQUE v2.5+ Software License v1.1.

> https://fedoraproject.org/wiki/Licensing/TORQUEv1.1

---

##### `TOSL` <span data-heading-title="`TOSL`" data-heading-id="constructhubspdxlicensepropertytosl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Trusster Open Source License.

> https://fedoraproject.org/wiki/Licensing/TOSL

---

##### `TU_BERLIN_1_0` <span data-heading-title="`TU_BERLIN_1_0`" data-heading-id="constructhubspdxlicensepropertytuberlin10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Technische Universitaet Berlin License 1.0.

> https://github.com/swh/ladspa/blob/7bf6f3799fdba70fda297c2d8fd9f526803d9680/gsm/COPYRIGHT

---

##### `TU_BERLIN_2_0` <span data-heading-title="`TU_BERLIN_2_0`" data-heading-id="constructhubspdxlicensepropertytuberlin20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Technische Universitaet Berlin License 2.0.

> https://github.com/CorsixTH/deps/blob/fd339a9f526d1d9c9f01ccf39e438a015da50035/licences/libgsm.txt

---

##### `UCL_1_0` <span data-heading-title="`UCL_1_0`" data-heading-id="constructhubspdxlicensepropertyucl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Upstream Compatibility License v1.0.

> https://opensource.org/licenses/UCL-1.0

---

##### `UNICODE_DFS_2015` <span data-heading-title="`UNICODE_DFS_2015`" data-heading-id="constructhubspdxlicensepropertyunicodedfs2015"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Unicode License Agreement - Data Files and Software (2015).

> https://web.archive.org/web/20151224134844/http://unicode.org/copyright.html

---

##### `UNICODE_DFS_2016` <span data-heading-title="`UNICODE_DFS_2016`" data-heading-id="constructhubspdxlicensepropertyunicodedfs2016"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Unicode License Agreement - Data Files and Software (2016).

> http://www.unicode.org/copyright.html

---

##### `UNICODE_TOU` <span data-heading-title="`UNICODE_TOU`" data-heading-id="constructhubspdxlicensepropertyunicodetou"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Unicode Terms of Use.

> http://www.unicode.org/copyright.html

---

##### `UNLICENSE` <span data-heading-title="`UNLICENSE`" data-heading-id="constructhubspdxlicensepropertyunlicense"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

The Unlicense.

> https://unlicense.org/

---

##### `UNLICENSED` <span data-heading-title="`UNLICENSED`" data-heading-id="constructhubspdxlicensepropertyunlicensed"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Packages that have not been licensed.

---

##### `UPL_1_0` <span data-heading-title="`UPL_1_0`" data-heading-id="constructhubspdxlicensepropertyupl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Universal Permissive License v1.0.

> https://opensource.org/licenses/UPL

---

##### `VIM` <span data-heading-title="`VIM`" data-heading-id="constructhubspdxlicensepropertyvim"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Vim License.

> http://vimdoc.sourceforge.net/htmldoc/uganda.html

---

##### `VOSTROM` <span data-heading-title="`VOSTROM`" data-heading-id="constructhubspdxlicensepropertyvostrom"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

VOSTROM Public License for Open Source.

> https://fedoraproject.org/wiki/Licensing/VOSTROM

---

##### `VSL_1_0` <span data-heading-title="`VSL_1_0`" data-heading-id="constructhubspdxlicensepropertyvsl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Vovida Software License v1.0.

> https://opensource.org/licenses/VSL-1.0

---

##### `W3_C` <span data-heading-title="`W3_C`" data-heading-id="constructhubspdxlicensepropertyw3c"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

W3C Software Notice and License (2002-12-31).

> http://www.w3.org/Consortium/Legal/2002/copyright-software-20021231.html

---

##### `W3C_19980720` <span data-heading-title="`W3C_19980720`" data-heading-id="constructhubspdxlicensepropertyw3c19980720"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

W3C Software Notice and License (1998-07-20).

> http://www.w3.org/Consortium/Legal/copyright-software-19980720.html

---

##### `W3C_20150513` <span data-heading-title="`W3C_20150513`" data-heading-id="constructhubspdxlicensepropertyw3c20150513"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

W3C Software Notice and Document License (2015-05-13).

> https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document

---

##### `WATCOM_1_0` <span data-heading-title="`WATCOM_1_0`" data-heading-id="constructhubspdxlicensepropertywatcom10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Sybase Open Watcom Public License 1.0.

> https://opensource.org/licenses/Watcom-1.0

---

##### `WSUIPA` <span data-heading-title="`WSUIPA`" data-heading-id="constructhubspdxlicensepropertywsuipa"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Wsuipa License.

> https://fedoraproject.org/wiki/Licensing/Wsuipa

---

##### `WTFPL` <span data-heading-title="`WTFPL`" data-heading-id="constructhubspdxlicensepropertywtfpl"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Do What The F\*ck You Want To Public License.

> http://www.wtfpl.net/about/

---

##### `WX_WINDOWS` <span data-heading-title="`WX_WINDOWS`" data-heading-id="constructhubspdxlicensepropertywxwindows"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

wxWindows Library License.

> https://opensource.org/licenses/WXwindows

---

##### `X11` <span data-heading-title="`X11`" data-heading-id="constructhubspdxlicensepropertyx11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

X11 License.

> http://www.xfree86.org/3.3.6/COPYRIGHT2.html#3

---

##### `XEROX` <span data-heading-title="`XEROX`" data-heading-id="constructhubspdxlicensepropertyxerox"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Xerox License.

> https://fedoraproject.org/wiki/Licensing/Xerox

---

##### `XFREE86_1_1` <span data-heading-title="`XFREE86_1_1`" data-heading-id="constructhubspdxlicensepropertyxfree8611"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

XFree86 License 1.1.

> http://www.xfree86.org/current/LICENSE4.html

---

##### `XINETD` <span data-heading-title="`XINETD`" data-heading-id="constructhubspdxlicensepropertyxinetd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

xinetd License.

> https://fedoraproject.org/wiki/Licensing/Xinetd_License

---

##### `XNET` <span data-heading-title="`XNET`" data-heading-id="constructhubspdxlicensepropertyxnet"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

X.Net License.

> https://opensource.org/licenses/Xnet

---

##### `XPP` <span data-heading-title="`XPP`" data-heading-id="constructhubspdxlicensepropertyxpp"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

XPP License.

> https://fedoraproject.org/wiki/Licensing/xpp

---

##### `XSKAT` <span data-heading-title="`XSKAT`" data-heading-id="constructhubspdxlicensepropertyxskat"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

XSkat License.

> https://fedoraproject.org/wiki/Licensing/XSkat_License

---

##### `YPL_1_0` <span data-heading-title="`YPL_1_0`" data-heading-id="constructhubspdxlicensepropertyypl10"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Yahoo!

Public License v1.0

> http://www.zimbra.com/license/yahoo_public_license_1.0.html

---

##### `YPL_1_1` <span data-heading-title="`YPL_1_1`" data-heading-id="constructhubspdxlicensepropertyypl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Yahoo!

Public License v1.1

> http://www.zimbra.com/license/yahoo_public_license_1.1.html

---

##### `ZED` <span data-heading-title="`ZED`" data-heading-id="constructhubspdxlicensepropertyzed"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Zed License.

> https://fedoraproject.org/wiki/Licensing/Zed

---

##### `ZEND_2_0` <span data-heading-title="`ZEND_2_0`" data-heading-id="constructhubspdxlicensepropertyzend20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Zend License v2.0.

> https://web.archive.org/web/20130517195954/http://www.zend.com/license/2_00.txt

---

##### `ZERO_BSD` <span data-heading-title="`ZERO_BSD`" data-heading-id="constructhubspdxlicensepropertyzerobsd"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

BSD Zero Clause License.

> http://landley.net/toybox/license.html

---

##### `ZIMBRA_1_3` <span data-heading-title="`ZIMBRA_1_3`" data-heading-id="constructhubspdxlicensepropertyzimbra13"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Zimbra Public License v1.3.

> http://web.archive.org/web/20100302225219/http://www.zimbra.com/license/zimbra-public-license-1-3.html

---

##### `ZIMBRA_1_4` <span data-heading-title="`ZIMBRA_1_4`" data-heading-id="constructhubspdxlicensepropertyzimbra14"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Zimbra Public License v1.4.

> http://www.zimbra.com/legal/zimbra-public-license-1-4

---

##### `ZLIB` <span data-heading-title="`ZLIB`" data-heading-id="constructhubspdxlicensepropertyzlib"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

zlib License.

> http://www.zlib.net/zlib_license.html

---

##### `ZLIB_ACKNOWLEDGEMENT` <span data-heading-title="`ZLIB_ACKNOWLEDGEMENT`" data-heading-id="constructhubspdxlicensepropertyzlibacknowledgement"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

zlib/libpng License with Acknowledgement.

> https://fedoraproject.org/wiki/Licensing/ZlibWithAcknowledgement

---

##### `ZPL_1_1` <span data-heading-title="`ZPL_1_1`" data-heading-id="constructhubspdxlicensepropertyzpl11"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Zope Public License 1.1.

> http://old.zope.org/Resources/License/ZPL-1.1

---

##### `ZPL_2_0` <span data-heading-title="`ZPL_2_0`" data-heading-id="constructhubspdxlicensepropertyzpl20"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Zope Public License 2.0.

> http://old.zope.org/Resources/License/ZPL-2.0

---

##### `ZPL_2_1` <span data-heading-title="`ZPL_2_1`" data-heading-id="constructhubspdxlicensepropertyzpl21"></span>

- _Type:_ [`construct-hub.SpdxLicense`](#constructhubspdxlicense)

Zope Public License 2.1.

> http://old.zope.org/Resources/ZPL/

---

### TagCondition <span data-heading-title="TagCondition" data-heading-id="constructhubtagcondition"></span>

Condition for applying a custom tag to a package.

#### Initializers <span data-heading-title="Initializers" data-heading-id="constructhubtagconditioninitializer"></span>

```typescript
import { TagCondition } from "construct-hub";

new TagCondition();
```

#### Methods <span data-heading-title="Methods" data-heading-id="methods"></span>

##### `bind` <span data-heading-title="`bind`" data-heading-id="constructhubtagconditionbind"></span>

```typescript
public bind()
```

#### Static Functions <span data-heading-title="Static Functions" data-heading-id="static-functions"></span>

##### `and` <span data-heading-title="`and`" data-heading-id="constructhubtagconditionand"></span>

```typescript
import { TagCondition } from 'construct-hub'

TagCondition.and(conds: TagCondition)
```

###### `conds`<sup>Required</sup> <span data-heading-title="`conds`<sup>Required</sup>" data-heading-id="constructhubtagconditionparameterconds"></span>

- _Type:_ [`construct-hub.TagCondition`](#constructhubtagcondition)

---

##### `field` <span data-heading-title="`field`" data-heading-id="constructhubtagconditionfield"></span>

```typescript
import { TagCondition } from 'construct-hub'

TagCondition.field(keys: string)
```

###### `keys`<sup>Required</sup> <span data-heading-title="`keys`<sup>Required</sup>" data-heading-id="constructhubtagconditionparameterkeys"></span>

- _Type:_ `string`

---

##### `not` <span data-heading-title="`not`" data-heading-id="constructhubtagconditionnot"></span>

```typescript
import { TagCondition } from 'construct-hub'

TagCondition.not(conds: TagCondition)
```

###### `conds`<sup>Required</sup> <span data-heading-title="`conds`<sup>Required</sup>" data-heading-id="constructhubtagconditionparameterconds"></span>

- _Type:_ [`construct-hub.TagCondition`](#constructhubtagcondition)

---

##### `or` <span data-heading-title="`or`" data-heading-id="constructhubtagconditionor"></span>

```typescript
import { TagCondition } from 'construct-hub'

TagCondition.or(conds: TagCondition)
```

###### `conds`<sup>Required</sup> <span data-heading-title="`conds`<sup>Required</sup>" data-heading-id="constructhubtagconditionparameterconds"></span>

- _Type:_ [`construct-hub.TagCondition`](#constructhubtagcondition)

---

### TagConditionField <span data-heading-title="TagConditionField" data-heading-id="constructhubtagconditionfield"></span>

Target a field to use in logic to dictate whether a tag is relevant.

#### Initializers <span data-heading-title="Initializers" data-heading-id="constructhubtagconditionfieldinitializer"></span>

```typescript
import { TagConditionField } from 'construct-hub'

new TagConditionField(field: string[])
```

##### `field`<sup>Required</sup> <span data-heading-title="`field`<sup>Required</sup>" data-heading-id="constructhubtagconditionfieldparameterfield"></span>

- _Type:_ `string`[]

---

#### Methods <span data-heading-title="Methods" data-heading-id="methods"></span>

##### `eq` <span data-heading-title="`eq`" data-heading-id="constructhubtagconditionfieldeq"></span>

```typescript
public eq(value: any)
```

###### `value`<sup>Required</sup> <span data-heading-title="`value`<sup>Required</sup>" data-heading-id="constructhubtagconditionfieldparametervalue"></span>

- _Type:_ `any`

---

## Protocols <span data-heading-title="Protocols" data-heading-id="protocols"></span>

### IDenyList <span data-heading-title="IDenyList" data-heading-id="constructhubidenylist"></span>

- _Implemented By:_ [`construct-hub.IDenyList`](#constructhubidenylist)

DenyList features exposed to extension points.

#### Methods <span data-heading-title="Methods" data-heading-id="methods"></span>

##### `grantRead` <span data-heading-title="`grantRead`" data-heading-id="constructhubidenylistgrantread"></span>

```typescript
public grantRead(handler: Function)
```

###### `handler`<sup>Required</sup> <span data-heading-title="`handler`<sup>Required</sup>" data-heading-id="constructhubidenylistparameterhandler"></span>

- _Type:_ [`@aws-cdk/aws-lambda.Function`](/packages/@aws-cdk/aws-lambda/v/1.126.0?lang=typescript#awscdkawslambdafunction)

---

### ILicenseList <span data-heading-title="ILicenseList" data-heading-id="constructhubilicenselist"></span>

- _Implemented By:_ [`construct-hub.ILicenseList`](#constructhubilicenselist)

#### Methods <span data-heading-title="Methods" data-heading-id="methods"></span>

##### `grantRead` <span data-heading-title="`grantRead`" data-heading-id="constructhubilicenselistgrantread"></span>

```typescript
public grantRead(handler: Function)
```

###### `handler`<sup>Required</sup> <span data-heading-title="`handler`<sup>Required</sup>" data-heading-id="constructhubilicenselistparameterhandler"></span>

- _Type:_ [`@aws-cdk/aws-lambda.Function`](/packages/@aws-cdk/aws-lambda/v/1.126.0?lang=typescript#awscdkawslambdafunction)

---

### IMonitoring <span data-heading-title="IMonitoring" data-heading-id="constructhubimonitoring"></span>

- _Implemented By:_ [`construct-hub.IMonitoring`](#constructhubimonitoring)

ConstructHub monitoring features exposed to extension points.

#### Methods <span data-heading-title="Methods" data-heading-id="methods"></span>

##### `addHighSeverityAlarm` <span data-heading-title="`addHighSeverityAlarm`" data-heading-id="constructhubimonitoringaddhighseverityalarm"></span>

```typescript
public addHighSeverityAlarm(title: string, alarm: Alarm)
```

###### `title`<sup>Required</sup> <span data-heading-title="`title`<sup>Required</sup>" data-heading-id="constructhubimonitoringparametertitle"></span>

- _Type:_ `string`

a user-friendly title for the alarm (will be rendered on the high-severity CloudWatch dashboard).

---

###### `alarm`<sup>Required</sup> <span data-heading-title="`alarm`<sup>Required</sup>" data-heading-id="constructhubimonitoringparameteralarm"></span>

- _Type:_ [`@aws-cdk/aws-cloudwatch.Alarm`](/packages/@aws-cdk/aws-cloudwatch/v/1.126.0?lang=typescript#awscdkawscloudwatchalarm)

the alarm to be added to the high-severity dashboard.

---

##### `addLowSeverityAlarm` <span data-heading-title="`addLowSeverityAlarm`" data-heading-id="constructhubimonitoringaddlowseverityalarm"></span>

```typescript
public addLowSeverityAlarm(title: string, alarm: Alarm)
```

###### `title`<sup>Required</sup> <span data-heading-title="`title`<sup>Required</sup>" data-heading-id="constructhubimonitoringparametertitle"></span>

- _Type:_ `string`

a user-friendly title for the alarm (not currently used).

---

###### `alarm`<sup>Required</sup> <span data-heading-title="`alarm`<sup>Required</sup>" data-heading-id="constructhubimonitoringparameteralarm"></span>

- _Type:_ [`@aws-cdk/aws-cloudwatch.Alarm`](/packages/@aws-cdk/aws-cloudwatch/v/1.126.0?lang=typescript#awscdkawscloudwatchalarm)

the alarm to be added.

---

### IPackageSource <span data-heading-title="IPackageSource" data-heading-id="constructhubipackagesource"></span>

- _Implemented By:_ [`construct-hub.sources.CodeArtifact`](#constructhubsourcescodeartifact), [`construct-hub.sources.NpmJs`](#constructhubsourcesnpmjs), [`construct-hub.IPackageSource`](#constructhubipackagesource)

A package source for ConstructHub.

#### Methods <span data-heading-title="Methods" data-heading-id="methods"></span>

##### `bind` <span data-heading-title="`bind`" data-heading-id="constructhubipackagesourcebind"></span>

```typescript
public bind(scope: Construct, opts: PackageSourceBindOptions)
```

###### `scope`<sup>Required</sup> <span data-heading-title="`scope`<sup>Required</sup>" data-heading-id="constructhubipackagesourceparameterscope"></span>

- _Type:_ [`@aws-cdk/core.Construct`](/packages/@aws-cdk/core/v/1.126.0?lang=typescript#awscdkcoreconstruct)

the construct scope in which the binding happens.

---

###### `opts`<sup>Required</sup> <span data-heading-title="`opts`<sup>Required</sup>" data-heading-id="constructhubipackagesourceparameteropts"></span>

- _Type:_ [`construct-hub.PackageSourceBindOptions`](#constructhubpackagesourcebindoptions)

options for binding the package source.

---

### IRepository <span data-heading-title="IRepository" data-heading-id="constructhubirepository"></span>

- _Implemented By:_ [`construct-hub.IRepository`](#constructhubirepository)

The CodeArtifact repository API exposed to extensions.

#### Methods <span data-heading-title="Methods" data-heading-id="methods"></span>

##### `addExternalConnection` <span data-heading-title="`addExternalConnection`" data-heading-id="constructhubirepositoryaddexternalconnection"></span>

```typescript
public addExternalConnection(id: string)
```

###### `id`<sup>Required</sup> <span data-heading-title="`id`<sup>Required</sup>" data-heading-id="constructhubirepositoryparameterid"></span>

- _Type:_ `string`

the id of the external connection (i.e: `public:npmjs`).

---

## Enums <span data-heading-title="Enums" data-heading-id="enums"></span>

### TagConditionLogicType <span data-heading-title="TagConditionLogicType" data-heading-id="tagconditionlogictype"></span>

Logic operators for performing specific conditional logic.

#### `AND` <span data-heading-title="`AND`" data-heading-id="constructhubtagconditionlogictypeand"></span>

---

#### `OR` <span data-heading-title="`OR`" data-heading-id="constructhubtagconditionlogictypeor"></span>

---

#### `NOT` <span data-heading-title="`NOT`" data-heading-id="constructhubtagconditionlogictypenot"></span>

---

#### `EQUALS` <span data-heading-title="`EQUALS`" data-heading-id="constructhubtagconditionlogictypeequals"></span>

---
