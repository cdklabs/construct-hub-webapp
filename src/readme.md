# Constructs

<h2 id="aws-cdk-lib.aws_eks.AwsAuth">AwsAuth</h2>

Manages mapping between IAM users and roles to Kubernetes RBAC configuration.



### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.AwsAuth(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `cluster`

- *Type: [aws-cdk-lib.aws_eks.Cluster](#aws-cdk-lib.aws_eks.Cluster) | **Required** | Default: undefined*

The EKS cluster to apply this configuration to.

> [disable-awslint:ref-via-interface]

---

<h2 id="aws-cdk-lib.aws_eks.CfnAddon">CfnAddon</h2>

A CloudFormation `AWS::EKS::Addon`.



### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnAddon(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `addonName`

- *Type: string | **Required** | Default: undefined*

`AWS::EKS::Addon.AddonName`.

---

##### `clusterName`

- *Type: string | **Required** | Default: undefined*

`AWS::EKS::Addon.ClusterName`.

---

##### `addonVersion`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Addon.AddonVersion`.

---

##### `resolveConflicts`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Addon.ResolveConflicts`.

---

##### `serviceAccountRoleArn`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Addon.ServiceAccountRoleArn`.

---

##### `tags`

- *Type: Array<aws-cdk-lib.CfnTag> | **Optional** | Default: undefined*

`AWS::EKS::Addon.Tags`.

---

<h2 id="aws-cdk-lib.aws_eks.CfnCluster">CfnCluster</h2>

A CloudFormation `AWS::EKS::Cluster`.



### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnCluster(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `resourcesVpcConfig`

- *Type: [aws-cdk-lib.aws_eks.CfnCluster.ResourcesVpcConfigProperty](#aws-cdk-lib.aws_eks.CfnCluster.ResourcesVpcConfigProperty) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Required** | Default: undefined*

`AWS::EKS::Cluster.ResourcesVpcConfig`.

---

##### `roleArn`

- *Type: string | **Required** | Default: undefined*

`AWS::EKS::Cluster.RoleArn`.

---

##### `encryptionConfig`

- *Type: [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | [Array<aws-cdk-lib.aws_eks.CfnCluster.EncryptionConfigProperty | aws-cdk-lib.IResolvable>](#undefined) | **Optional** | Default: undefined*

`AWS::EKS::Cluster.EncryptionConfig`.

---

##### `kubernetesNetworkConfig`

- *Type: [aws-cdk-lib.aws_eks.CfnCluster.KubernetesNetworkConfigProperty](#aws-cdk-lib.aws_eks.CfnCluster.KubernetesNetworkConfigProperty) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::EKS::Cluster.KubernetesNetworkConfig`.

---

##### `name`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Cluster.Name`.

---

##### `version`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Cluster.Version`.

---

<h2 id="aws-cdk-lib.aws_eks.CfnFargateProfile">CfnFargateProfile</h2>

A CloudFormation `AWS::EKS::FargateProfile`.



### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnFargateProfile(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `clusterName`

- *Type: string | **Required** | Default: undefined*

`AWS::EKS::FargateProfile.ClusterName`.

---

##### `podExecutionRoleArn`

- *Type: string | **Required** | Default: undefined*

`AWS::EKS::FargateProfile.PodExecutionRoleArn`.

---

##### `selectors`

- *Type: [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | [Array<aws-cdk-lib.aws_eks.CfnFargateProfile.SelectorProperty | aws-cdk-lib.IResolvable>](#undefined) | **Required** | Default: undefined*

`AWS::EKS::FargateProfile.Selectors`.

---

##### `fargateProfileName`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::FargateProfile.FargateProfileName`.

---

##### `subnets`

- *Type: Array<string> | **Optional** | Default: undefined*

`AWS::EKS::FargateProfile.Subnets`.

---

##### `tags`

- *Type: Array<aws-cdk-lib.CfnTag> | **Optional** | Default: undefined*

`AWS::EKS::FargateProfile.Tags`.

---

<h2 id="aws-cdk-lib.aws_eks.CfnNodegroup">CfnNodegroup</h2>

A CloudFormation `AWS::EKS::Nodegroup`.



### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnNodegroup(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `clusterName`

- *Type: string | **Required** | Default: undefined*

`AWS::EKS::Nodegroup.ClusterName`.

---

##### `nodeRole`

- *Type: string | **Required** | Default: undefined*

`AWS::EKS::Nodegroup.NodeRole`.

---

##### `subnets`

- *Type: Array<string> | **Required** | Default: undefined*

`AWS::EKS::Nodegroup.Subnets`.

---

##### `amiType`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.AmiType`.

---

##### `capacityType`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.CapacityType`.

---

##### `diskSize`

- *Type: number | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.DiskSize`.

---

##### `forceUpdateEnabled`

- *Type: [boolean](#undefined) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.ForceUpdateEnabled`.

---

##### `instanceTypes`

- *Type: Array<string> | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.InstanceTypes`.

---

##### `labels`

- *Type: any | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.Labels`.

---

##### `launchTemplate`

- *Type: [aws-cdk-lib.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty](#aws-cdk-lib.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.LaunchTemplate`.

---

##### `nodegroupName`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.NodegroupName`.

---

##### `releaseVersion`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.ReleaseVersion`.

---

##### `remoteAccess`

- *Type: [aws-cdk-lib.aws_eks.CfnNodegroup.RemoteAccessProperty](#aws-cdk-lib.aws_eks.CfnNodegroup.RemoteAccessProperty) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.RemoteAccess`.

---

##### `scalingConfig`

- *Type: [aws-cdk-lib.aws_eks.CfnNodegroup.ScalingConfigProperty](#aws-cdk-lib.aws_eks.CfnNodegroup.ScalingConfigProperty) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.ScalingConfig`.

---

##### `tags`

- *Type: any | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.Tags`.

---

##### `taints`

- *Type: [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | [Array<aws-cdk-lib.aws_eks.CfnNodegroup.TaintProperty | aws-cdk-lib.IResolvable>](#undefined) | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.Taints`.

---

##### `version`

- *Type: string | **Optional** | Default: undefined*

`AWS::EKS::Nodegroup.Version`.

---

<h2 id="aws-cdk-lib.aws_eks.Cluster">Cluster</h2>

A Cluster represents a managed Kubernetes Service (EKS).

This is a fully managed cluster of API Servers (control-plane)
The user is still required to create the worker nodes.

### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.Cluster(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `version`

- *Type: [aws-cdk-lib.aws_eks.KubernetesVersion](#aws-cdk-lib.aws_eks.KubernetesVersion) | **Required** | Default: undefined*

The Kubernetes version to run in the cluster.

---

##### `clusterName`

- *Type: string | **Optional** | Default: - Automatically generated name*

Name for the cluster.

---

##### `outputClusterName`

- *Type: boolean | **Optional** | Default: false*

Determines whether a CloudFormation output with the name of the cluster will be synthesized.

---

##### `outputConfigCommand`

- *Type: boolean | **Optional** | Default: true*

Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.

> This command will include
the cluster name and, if applicable, the ARN of the masters IAM role.

---

##### `role`

- *Type: [aws-cdk-lib.aws_iam.IRole](#aws-cdk-lib.aws_iam.IRole) | **Optional** | Default: - A role is automatically created for you*

Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.

---

##### `securityGroup`

- *Type: [aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup) | **Optional** | Default: - A security group is automatically created*

Security Group to use for Control Plane ENIs.

---

##### `vpc`

- *Type: [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc) | **Optional** | Default: - a VPC with default configuration will be created and can be accessed through `cluster.vpc`.*

The VPC in which to create the Cluster.

---

##### `vpcSubnets`

- *Type: Array<aws-cdk-lib.aws_ec2.SubnetSelection> | **Optional** | Default: - All public and private subnets*

Where to place EKS Control Plane ENIs.

> If you want to create public load balancers, this must include public subnets.

For example, to only select private subnets, supply the following:

```ts
vpcSubnets: [
   { subnetType: ec2.SubnetType.Private }
]
```

---

##### `clusterHandlerEnvironment`

- *Type: Map<string => string> | **Optional** | Default: - No environment variables.*

Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.

---

##### `coreDnsComputeType`

- *Type: [aws-cdk-lib.aws_eks.CoreDnsComputeType](#aws-cdk-lib.aws_eks.CoreDnsComputeType) | **Optional** | Default: CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)*

Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS configuration on your cluster to determine which compute type to use for CoreDNS.

---

##### `endpointAccess`

- *Type: [aws-cdk-lib.aws_eks.EndpointAccess](#aws-cdk-lib.aws_eks.EndpointAccess) | **Optional** | Default: EndpointAccess.PUBLIC_AND_PRIVATE*

Configure access to the Kubernetes API server endpoint..

---

##### `kubectlEnvironment`

- *Type: Map<string => string> | **Optional** | Default: - No environment variables.*

Environment variables for the kubectl execution.

> Only relevant for kubectl enabled clusters.

---

##### `kubectlLayer`

- *Type: [aws-cdk-lib.aws_lambda.ILayerVersion](#aws-cdk-lib.aws_lambda.ILayerVersion) | **Optional** | Default: - the layer provided by the `aws-lambda-layer-kubectl` SAR app.*

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

> By default, the provider will use the layer included in the
"aws-lambda-layer-kubectl" SAR application which is available in all
commercial regions.

To deploy the layer locally, visit
https://github.com/aws-samples/aws-lambda-layer-kubectl/blob/master/cdk/README.md
for instructions on how to prepare the .zip file and then define it in your
app as follows:

```ts
const layer = new lambda.LayerVersion(this, 'kubectl-layer', {
   code: lambda.Code.fromAsset(`${__dirname}/layer.zip`)),
   compatibleRuntimes: [lambda.Runtime.PROVIDED]
})
```

---

##### `kubectlMemory`

- *Type: [aws-cdk-lib.Size](#aws-cdk-lib.Size) | **Optional** | Default: Size.gibibytes(1)*

Amount of memory to allocate to the provider's lambda function.

---

##### `mastersRole`

- *Type: [aws-cdk-lib.aws_iam.IRole](#aws-cdk-lib.aws_iam.IRole) | **Optional** | Default: - a role that assumable by anyone with permissions in the same
account will automatically be defined*

An IAM role that will be added to the `system:masters` Kubernetes RBAC group.

---

##### `outputMastersRoleArn`

- *Type: boolean | **Optional** | Default: false*

Determines whether a CloudFormation output with the ARN of the "masters" IAM role will be synthesized (if `mastersRole` is specified).

---

##### `placeClusterHandlerInVpc`

- *Type: boolean | **Optional** | Default: false*

If set to true, the cluster handler functions will be placed in the private subnets of the cluster vpc, subject to the `vpcSubnets` selection strategy.

---

##### `prune`

- *Type: boolean | **Optional** | Default: true*

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

> When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

##### `secretsEncryptionKey`

- *Type: [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey) | **Optional** | Default: - By default, Kubernetes stores all secret object data within etcd and
  all etcd volumes used by Amazon EKS are encrypted at the disk-level
  using AWS-Managed encryption keys.*

KMS secret for envelope encryption for Kubernetes secrets.

---

##### `defaultCapacity`

- *Type: number | **Optional** | Default: 2*

Number of instances to allocate as an initial capacity for this cluster.

> Instance type can be configured through `defaultCapacityInstanceType`,
which defaults to `m5.large`.

Use `cluster.addAutoScalingGroupCapacity` to add additional customized capacity. Set this
to `0` is you wish to avoid the initial capacity allocation.

---

##### `defaultCapacityInstance`

- *Type: [aws-cdk-lib.aws_ec2.InstanceType](#aws-cdk-lib.aws_ec2.InstanceType) | **Optional** | Default: m5.large*

The instance type to use for the default capacity.

> This will only be taken
into account if `defaultCapacity` is > 0.

---

##### `defaultCapacityType`

- *Type: [aws-cdk-lib.aws_eks.DefaultCapacityType](#aws-cdk-lib.aws_eks.DefaultCapacityType) | **Optional** | Default: NODEGROUP*

The default capacity type for the cluster.

---

<h2 id="aws-cdk-lib.aws_eks.FargateCluster">FargateCluster</h2>

Defines an EKS cluster that runs entirely on AWS Fargate.

The cluster is created with a default Fargate Profile that matches the
"default" and "kube-system" namespaces. You can add additional profiles using
`addFargateProfile`.

### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.FargateCluster(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `version`

- *Type: [aws-cdk-lib.aws_eks.KubernetesVersion](#aws-cdk-lib.aws_eks.KubernetesVersion) | **Required** | Default: undefined*

The Kubernetes version to run in the cluster.

---

##### `clusterName`

- *Type: string | **Optional** | Default: - Automatically generated name*

Name for the cluster.

---

##### `outputClusterName`

- *Type: boolean | **Optional** | Default: false*

Determines whether a CloudFormation output with the name of the cluster will be synthesized.

---

##### `outputConfigCommand`

- *Type: boolean | **Optional** | Default: true*

Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.

> This command will include
the cluster name and, if applicable, the ARN of the masters IAM role.

---

##### `role`

- *Type: [aws-cdk-lib.aws_iam.IRole](#aws-cdk-lib.aws_iam.IRole) | **Optional** | Default: - A role is automatically created for you*

Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.

---

##### `securityGroup`

- *Type: [aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup) | **Optional** | Default: - A security group is automatically created*

Security Group to use for Control Plane ENIs.

---

##### `vpc`

- *Type: [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc) | **Optional** | Default: - a VPC with default configuration will be created and can be accessed through `cluster.vpc`.*

The VPC in which to create the Cluster.

---

##### `vpcSubnets`

- *Type: Array<aws-cdk-lib.aws_ec2.SubnetSelection> | **Optional** | Default: - All public and private subnets*

Where to place EKS Control Plane ENIs.

> If you want to create public load balancers, this must include public subnets.

For example, to only select private subnets, supply the following:

```ts
vpcSubnets: [
   { subnetType: ec2.SubnetType.Private }
]
```

---

##### `clusterHandlerEnvironment`

- *Type: Map<string => string> | **Optional** | Default: - No environment variables.*

Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.

---

##### `coreDnsComputeType`

- *Type: [aws-cdk-lib.aws_eks.CoreDnsComputeType](#aws-cdk-lib.aws_eks.CoreDnsComputeType) | **Optional** | Default: CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)*

Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS configuration on your cluster to determine which compute type to use for CoreDNS.

---

##### `endpointAccess`

- *Type: [aws-cdk-lib.aws_eks.EndpointAccess](#aws-cdk-lib.aws_eks.EndpointAccess) | **Optional** | Default: EndpointAccess.PUBLIC_AND_PRIVATE*

Configure access to the Kubernetes API server endpoint..

---

##### `kubectlEnvironment`

- *Type: Map<string => string> | **Optional** | Default: - No environment variables.*

Environment variables for the kubectl execution.

> Only relevant for kubectl enabled clusters.

---

##### `kubectlLayer`

- *Type: [aws-cdk-lib.aws_lambda.ILayerVersion](#aws-cdk-lib.aws_lambda.ILayerVersion) | **Optional** | Default: - the layer provided by the `aws-lambda-layer-kubectl` SAR app.*

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

> By default, the provider will use the layer included in the
"aws-lambda-layer-kubectl" SAR application which is available in all
commercial regions.

To deploy the layer locally, visit
https://github.com/aws-samples/aws-lambda-layer-kubectl/blob/master/cdk/README.md
for instructions on how to prepare the .zip file and then define it in your
app as follows:

```ts
const layer = new lambda.LayerVersion(this, 'kubectl-layer', {
   code: lambda.Code.fromAsset(`${__dirname}/layer.zip`)),
   compatibleRuntimes: [lambda.Runtime.PROVIDED]
})
```

---

##### `kubectlMemory`

- *Type: [aws-cdk-lib.Size](#aws-cdk-lib.Size) | **Optional** | Default: Size.gibibytes(1)*

Amount of memory to allocate to the provider's lambda function.

---

##### `mastersRole`

- *Type: [aws-cdk-lib.aws_iam.IRole](#aws-cdk-lib.aws_iam.IRole) | **Optional** | Default: - a role that assumable by anyone with permissions in the same
account will automatically be defined*

An IAM role that will be added to the `system:masters` Kubernetes RBAC group.

---

##### `outputMastersRoleArn`

- *Type: boolean | **Optional** | Default: false*

Determines whether a CloudFormation output with the ARN of the "masters" IAM role will be synthesized (if `mastersRole` is specified).

---

##### `placeClusterHandlerInVpc`

- *Type: boolean | **Optional** | Default: false*

If set to true, the cluster handler functions will be placed in the private subnets of the cluster vpc, subject to the `vpcSubnets` selection strategy.

---

##### `prune`

- *Type: boolean | **Optional** | Default: true*

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

> When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

##### `secretsEncryptionKey`

- *Type: [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey) | **Optional** | Default: - By default, Kubernetes stores all secret object data within etcd and
  all etcd volumes used by Amazon EKS are encrypted at the disk-level
  using AWS-Managed encryption keys.*

KMS secret for envelope encryption for Kubernetes secrets.

---

##### `defaultProfile`

- *Type: [aws-cdk-lib.aws_eks.FargateProfileOptions](#aws-cdk-lib.aws_eks.FargateProfileOptions) | **Optional** | Default: - A profile called "default" with 'default' and 'kube-system'
  selectors will be created if this is left undefined.*

Fargate Profile to create along with the cluster.

---

<h2 id="aws-cdk-lib.aws_eks.FargateProfile">FargateProfile</h2>

Fargate profiles allows an administrator to declare which pods run on Fargate.

This declaration is done through the profile’s selectors. Each
profile can have up to five selectors that contain a namespace and optional
labels. You must define a namespace for every selector. The label field
consists of multiple optional key-value pairs. Pods that match a selector (by
matching a namespace for the selector and all of the labels specified in the
selector) are scheduled on Fargate. If a namespace selector is defined
without any labels, Amazon EKS will attempt to schedule all pods that run in
that namespace onto Fargate using the profile. If a to-be-scheduled pod
matches any of the selectors in the Fargate profile, then that pod is
scheduled on Fargate.

If a pod matches multiple Fargate profiles, Amazon EKS picks one of the
matches at random. In this case, you can specify which profile a pod should
use by adding the following Kubernetes label to the pod specification:
eks.amazonaws.com/fargate-profile: profile_name. However, the pod must still
match a selector in that profile in order to be scheduled onto Fargate.

### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.FargateProfile(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `selectors`

- *Type: Array<aws-cdk-lib.aws_eks.Selector> | **Required** | Default: undefined*

The selectors to match for pods to use this Fargate profile.

> Each selector
must have an associated namespace. Optionally, you can also specify labels
for a namespace.

At least one selector is required and you may specify up to five selectors.

---

##### `fargateProfileName`

- *Type: string | **Optional** | Default: - generated*

The name of the Fargate profile.

---

##### `podExecutionRole`

- *Type: [aws-cdk-lib.aws_iam.IRole](#aws-cdk-lib.aws_iam.IRole) | **Optional** | Default: - a role will be automatically created*

The pod execution role to use for pods that match the selectors in the Fargate profile.

> The pod execution role allows Fargate infrastructure to
register with your cluster as a node, and it provides read access to Amazon
ECR image repositories.

---

##### `subnetSelection`

- *Type: [aws-cdk-lib.aws_ec2.SubnetSelection](#aws-cdk-lib.aws_ec2.SubnetSelection) | **Optional** | Default: - all private subnets of the VPC are selected.*

Select which subnets to launch your pods into.

> At this time, pods running
on Fargate are not assigned public IP addresses, so only private subnets
(with no direct route to an Internet Gateway) are allowed.

---

##### `vpc`

- *Type: [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc) | **Optional** | Default: - all private subnets used by theEKS cluster*

The VPC from which to select subnets to launch your pods into.

> By default, all private subnets are selected. You can customize this using
`subnetSelection`.

---

##### `cluster`

- *Type: [aws-cdk-lib.aws_eks.Cluster](#aws-cdk-lib.aws_eks.Cluster) | **Required** | Default: undefined*

The EKS cluster to apply the Fargate profile to.

> [disable-awslint:ref-via-interface]

---

<h2 id="aws-cdk-lib.aws_eks.HelmChart">HelmChart</h2>

Represents a helm chart within the Kubernetes system.

Applies/deletes the resources using `kubectl` in sync with the resource.

### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.HelmChart(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `chart`

- *Type: string | **Required** | Default: undefined*

The name of the chart.

---

##### `createNamespace`

- *Type: boolean | **Optional** | Default: true*

create namespace if not exist.

---

##### `namespace`

- *Type: string | **Optional** | Default: default*

The Kubernetes namespace scope of the requests.

---

##### `release`

- *Type: string | **Optional** | Default: - If no release name is given, it will use the last 53 characters of the node's unique id.*

The name of the release.

---

##### `repository`

- *Type: string | **Optional** | Default: - No repository will be used, which means that the chart needs to be an absolute URL.*

The repository which contains the chart.

> For example: https://kubernetes-charts.storage.googleapis.com/

---

##### `timeout`

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.minutes(5)*

Amount of time to wait for any individual Kubernetes operation.

> Maximum 15 minutes.

---

##### `values`

- *Type: Map<string => any> | **Optional** | Default: - No values are provided to the chart.*

The values to be used by the chart.

---

##### `version`

- *Type: string | **Optional** | Default: - If this is not specified, the latest version is installed*

The chart version to install.

---

##### `wait`

- *Type: boolean | **Optional** | Default: - Helm will not wait before marking release as successful*

Whether or not Helm should wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.

---

##### `cluster`

- *Type: [aws-cdk-lib.aws_eks.ICluster](#aws-cdk-lib.aws_eks.ICluster) | **Required** | Default: undefined*

The EKS cluster to apply this configuration to.

> [disable-awslint:ref-via-interface]

---

<h2 id="aws-cdk-lib.aws_eks.KubernetesManifest">KubernetesManifest</h2>

Represents a manifest within the Kubernetes system.

Alternatively, you can use `cluster.addManifest(resource[, resource, ...])`
to define resources on this cluster.

Applies/deletes the manifest using `kubectl`.

### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesManifest(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `prune`

- *Type: boolean | **Optional** | Default: - based on the prune option of the cluster, which is `true` unless
otherwise specified.*

When a resource is removed from a Kubernetes manifest, it no longer appears in the manifest, and there is no way to know that this resource needs to be deleted.

> To address this, `kubectl apply` has a `--prune` option which will
query the cluster for all resources with a specific label and will remove
all the labeld resources that are not part of the applied manifest. If this
option is disabled and a resource is removed, it will become "orphaned" and
will not be deleted from the cluster.

When this option is enabled (default), the construct will inject a label to
all Kubernetes resources included in this manifest which will be used to
prune resources when the manifest changes via `kubectl apply --prune`.

The label name will be `aws.cdk.eks/prune-<ADDR>` where `<ADDR>` is the
42-char unique address of this construct in the construct tree. Value is
empty.

---

##### `skipValidation`

- *Type: boolean | **Optional** | Default: false*

A flag to signify if the manifest validation should be skipped.

---

##### `cluster`

- *Type: [aws-cdk-lib.aws_eks.ICluster](#aws-cdk-lib.aws_eks.ICluster) | **Required** | Default: undefined*

The EKS cluster to apply this manifest to.

> [disable-awslint:ref-via-interface]

---

##### `manifest`

- *Type: Array<Map<string => any>> | **Required** | Default: undefined*

The manifest to apply.

> Consists of any number of child resources.

When the resources are created/updated, this manifest will be applied to the
cluster through `kubectl apply` and when the resources or the stack is
deleted, the resources in the manifest will be deleted through `kubectl delete`.

---

##### `overwrite`

- *Type: boolean | **Optional** | Default: false*

Overwrite any existing resources.

> If this is set, we will use `kubectl apply` instead of `kubectl create`
when the resource is created. Otherwise, if there is already a resource
in the cluster with the same name, the operation will fail.

---

<h2 id="aws-cdk-lib.aws_eks.KubernetesObjectValue">KubernetesObjectValue</h2>

Represents a value of a specific object deployed in the cluster.

Use this to fetch any information available by the `kubectl get` command.

### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesObjectValue(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `cluster`

- *Type: [aws-cdk-lib.aws_eks.ICluster](#aws-cdk-lib.aws_eks.ICluster) | **Required** | Default: undefined*

The EKS cluster to fetch attributes from.

> [disable-awslint:ref-via-interface]

---

##### `jsonPath`

- *Type: string | **Required** | Default: undefined*

JSONPath to the specific value.

---

##### `objectName`

- *Type: string | **Required** | Default: undefined*

The name of the object to query.

---

##### `objectType`

- *Type: string | **Required** | Default: undefined*

The object type to query.

> (e.g 'service', 'pod'...)

---

##### `objectNamespace`

- *Type: string | **Optional** | Default: 'default'*

The namespace the object belongs to.

---

##### `timeout`

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.minutes(5)*

Timeout for waiting on a value.

---

<h2 id="aws-cdk-lib.aws_eks.KubernetesPatch">KubernetesPatch</h2>

A CloudFormation resource which applies/restores a JSON patch into a Kubernetes resource.



### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesPatch(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `applyPatch`

- *Type: Map<string => any> | **Required** | Default: undefined*

The JSON object to pass to `kubectl patch` when the resource is created/updated.

---

##### `cluster`

- *Type: [aws-cdk-lib.aws_eks.ICluster](#aws-cdk-lib.aws_eks.ICluster) | **Required** | Default: undefined*

The cluster to apply the patch to.

> [disable-awslint:ref-via-interface]

---

##### `resourceName`

- *Type: string | **Required** | Default: undefined*

The full name of the resource to patch (e.g. `deployment/coredns`).

---

##### `restorePatch`

- *Type: Map<string => any> | **Required** | Default: undefined*

The JSON object to pass to `kubectl patch` when the resource is removed.

---

##### `patchType`

- *Type: [aws-cdk-lib.aws_eks.PatchType](#aws-cdk-lib.aws_eks.PatchType) | **Optional** | Default: PatchType.STRATEGIC*

The patch type to pass to `kubectl patch`.

> The default type used by `kubectl patch` is "strategic".

---

##### `resourceNamespace`

- *Type: string | **Optional** | Default: "default"*

The kubernetes API namespace.

---

<h2 id="aws-cdk-lib.aws_eks.Nodegroup">Nodegroup</h2>

The Nodegroup resource class.



### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.Nodegroup(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `amiType`

- *Type: [aws-cdk-lib.aws_eks.NodegroupAmiType](#aws-cdk-lib.aws_eks.NodegroupAmiType) | **Optional** | Default: - auto-determined from the instanceTypes property.*

The AMI type for your node group.

---

##### `capacityType`

- *Type: [aws-cdk-lib.aws_eks.CapacityType](#aws-cdk-lib.aws_eks.CapacityType) | **Optional** | Default: - ON_DEMAND*

The capacity type of the nodegroup.

---

##### `desiredSize`

- *Type: number | **Optional** | Default: 2*

The current number of worker nodes that the managed node group should maintain.

> If not specified,
the nodewgroup will initially create `minSize` instances.

---

##### `diskSize`

- *Type: number | **Optional** | Default: 20*

The root device disk size (in GiB) for your node group instances.

---

##### `forceUpdate`

- *Type: boolean | **Optional** | Default: true*

Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue.

> If an update fails because pods could not be drained, you can force the update after it fails to terminate the old
node whether or not any pods are
running on the node.

---

##### `instanceTypes`

- *Type: Array<aws-cdk-lib.aws_ec2.InstanceType> | **Optional** | Default: t3.medium will be used according to the cloudformation document.*

The instance types to use for your node group.

---

##### `labels`

- *Type: Map<string => string> | **Optional** | Default: - None*

The Kubernetes labels to be applied to the nodes in the node group when they are created.

---

##### `launchTemplateSpec`

- *Type: [aws-cdk-lib.aws_eks.LaunchTemplateSpec](#aws-cdk-lib.aws_eks.LaunchTemplateSpec) | **Optional** | Default: - no launch template*

Launch template specification used for the nodegroup.

---

##### `maxSize`

- *Type: number | **Optional** | Default: - desiredSize*

The maximum number of worker nodes that the managed node group can scale out to.

> Managed node groups can support up to 100 nodes by default.

---

##### `minSize`

- *Type: number | **Optional** | Default: 1*

The minimum number of worker nodes that the managed node group can scale in to.

> This number must be greater than zero.

---

##### `nodegroupName`

- *Type: string | **Optional** | Default: - resource ID*

Name of the Nodegroup.

---

##### `nodeRole`

- *Type: [aws-cdk-lib.aws_iam.IRole](#aws-cdk-lib.aws_iam.IRole) | **Optional** | Default: - None. Auto-generated if not specified.*

The IAM role to associate with your node group.

> The Amazon EKS worker node kubelet daemon
makes calls to AWS APIs on your behalf. Worker nodes receive permissions for these API calls through
an IAM instance profile and associated policies. Before you can launch worker nodes and register them
into a cluster, you must create an IAM role for those worker nodes to use when they are launched.

---

##### `releaseVersion`

- *Type: string | **Optional** | Default: - The latest available AMI version for the node group's current Kubernetes version is used.*

The AMI version of the Amazon EKS-optimized AMI to use with your node group (for example, `1.14.7-YYYYMMDD`).

---

##### `remoteAccess`

- *Type: [aws-cdk-lib.aws_eks.NodegroupRemoteAccess](#aws-cdk-lib.aws_eks.NodegroupRemoteAccess) | **Optional** | Default: - disabled*

The remote access (SSH) configuration to use with your node group.

> Disabled by default, however, if you
specify an Amazon EC2 SSH key but do not specify a source security group when you create a managed node group,
then port 22 on the worker nodes is opened to the internet (0.0.0.0/0)

---

##### `subnets`

- *Type: [aws-cdk-lib.aws_ec2.SubnetSelection](#aws-cdk-lib.aws_ec2.SubnetSelection) | **Optional** | Default: - private subnets*

The subnets to use for the Auto Scaling group that is created for your node group.

> By specifying the
SubnetSelection, the selected subnets will automatically apply required tags i.e.
`kubernetes.io/cluster/CLUSTER_NAME` with a value of `shared`, where `CLUSTER_NAME` is replaced with
the name of your cluster.

---

##### `tags`

- *Type: Map<string => string> | **Optional** | Default: - None*

The metadata to apply to the node group to assist with categorization and organization.

> Each tag consists of
a key and an optional value, both of which you define. Node group tags do not propagate to any other resources
associated with the node group, such as the Amazon EC2 instances or subnets.

---

##### `cluster`

- *Type: [aws-cdk-lib.aws_eks.ICluster](#aws-cdk-lib.aws_eks.ICluster) | **Required** | Default: undefined*

Cluster resource.

---

<h2 id="aws-cdk-lib.aws_eks.OpenIdConnectProvider">OpenIdConnectProvider</h2>

IAM OIDC identity providers are entities in IAM that describe an external identity provider (IdP) service that supports the OpenID Connect (OIDC) standard, such as Google or Salesforce.

You use an IAM OIDC identity provider
when you want to establish trust between an OIDC-compatible IdP and your AWS
account.

This implementation has default values for thumbprints and clientIds props
that will be compatible with the eks cluster

### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.OpenIdConnectProvider(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `url`

- *Type: string | **Required** | Default: undefined*

The URL of the identity provider.

> The URL must begin with https:// and
should correspond to the iss claim in the provider's OpenID Connect ID
tokens. Per the OIDC standard, path components are allowed but query
parameters are not. Typically the URL consists of only a hostname, like
https://server.example.org or https://example.com.

You can find your OIDC Issuer URL by:
aws eks describe-cluster --name %cluster_name% --query "cluster.identity.oidc.issuer" --output text

---

<h2 id="aws-cdk-lib.aws_eks.ServiceAccount">ServiceAccount</h2>

Service Account.



### Initializer

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.ServiceAccount(scope: constructs.Construct, id: string, **kwargs)
```

#### kwargs

##### `name`

- *Type: string | **Optional** | Default: - If no name is given, it will use the id of the resource.*

The name of the service account.

---

##### `namespace`

- *Type: string | **Optional** | Default: "default"*

The namespace of the service account.

---

##### `cluster`

- *Type: [aws-cdk-lib.aws_eks.ICluster](#aws-cdk-lib.aws_eks.ICluster) | **Required** | Default: undefined*

The cluster to apply the patch to.

---

# Structs

## `AutoScalingGroupCapacityOptions` <a id="aws-cdk-lib.aws_eks.AutoScalingGroupCapacityOptions"></a>

Options for adding worker nodes.



## `AutoScalingGroupOptions` <a id="aws-cdk-lib.aws_eks.AutoScalingGroupOptions"></a>

Options for adding an AutoScalingGroup as capacity.



## `AwsAuthMapping` <a id="aws-cdk-lib.aws_eks.AwsAuthMapping"></a>

AwsAuth mapping.



## `AwsAuthProps` <a id="aws-cdk-lib.aws_eks.AwsAuthProps"></a>

Configuration props for the AwsAuth construct.



## `BootstrapOptions` <a id="aws-cdk-lib.aws_eks.BootstrapOptions"></a>

EKS node bootstrapping options.



## `CfnAddonProps` <a id="aws-cdk-lib.aws_eks.CfnAddonProps"></a>

Properties for defining a `AWS::EKS::Addon`.



## `CfnClusterProps` <a id="aws-cdk-lib.aws_eks.CfnClusterProps"></a>

Properties for defining a `AWS::EKS::Cluster`.



## `CfnFargateProfileProps` <a id="aws-cdk-lib.aws_eks.CfnFargateProfileProps"></a>

Properties for defining a `AWS::EKS::FargateProfile`.



## `CfnNodegroupProps` <a id="aws-cdk-lib.aws_eks.CfnNodegroupProps"></a>

Properties for defining a `AWS::EKS::Nodegroup`.



## `ClusterAttributes` <a id="aws-cdk-lib.aws_eks.ClusterAttributes"></a>

Attributes for EKS clusters.



## `ClusterOptions` <a id="aws-cdk-lib.aws_eks.ClusterOptions"></a>

Options for EKS clusters.



## `ClusterProps` <a id="aws-cdk-lib.aws_eks.ClusterProps"></a>

Common configuration props for EKS clusters.



## `CommonClusterOptions` <a id="aws-cdk-lib.aws_eks.CommonClusterOptions"></a>

Options for configuring an EKS cluster.



## `EksOptimizedImageProps` <a id="aws-cdk-lib.aws_eks.EksOptimizedImageProps"></a>

Properties for EksOptimizedImage.



## `FargateClusterProps` <a id="aws-cdk-lib.aws_eks.FargateClusterProps"></a>

Configuration props for EKS Fargate.



## `FargateProfileOptions` <a id="aws-cdk-lib.aws_eks.FargateProfileOptions"></a>

Options for defining EKS Fargate Profiles.



## `FargateProfileProps` <a id="aws-cdk-lib.aws_eks.FargateProfileProps"></a>

Configuration props for EKS Fargate Profiles.



## `HelmChartOptions` <a id="aws-cdk-lib.aws_eks.HelmChartOptions"></a>

Helm Chart options.



## `HelmChartProps` <a id="aws-cdk-lib.aws_eks.HelmChartProps"></a>

Helm Chart properties.



## `KubernetesManifestOptions` <a id="aws-cdk-lib.aws_eks.KubernetesManifestOptions"></a>

Options for `KubernetesManifest`.



## `KubernetesManifestProps` <a id="aws-cdk-lib.aws_eks.KubernetesManifestProps"></a>

Properties for KubernetesManifest.



## `KubernetesObjectValueProps` <a id="aws-cdk-lib.aws_eks.KubernetesObjectValueProps"></a>

Properties for KubernetesObjectValue.



## `KubernetesPatchProps` <a id="aws-cdk-lib.aws_eks.KubernetesPatchProps"></a>

Properties for KubernetesPatch.



## `LaunchTemplateSpec` <a id="aws-cdk-lib.aws_eks.LaunchTemplateSpec"></a>

Launch template property specification.



## `NodegroupOptions` <a id="aws-cdk-lib.aws_eks.NodegroupOptions"></a>

The Nodegroup Options for addNodeGroup() method.



## `NodegroupProps` <a id="aws-cdk-lib.aws_eks.NodegroupProps"></a>

NodeGroup properties interface.



## `NodegroupRemoteAccess` <a id="aws-cdk-lib.aws_eks.NodegroupRemoteAccess"></a>

The remote access (SSH) configuration to use with your node group.



## `OpenIdConnectProviderProps` <a id="aws-cdk-lib.aws_eks.OpenIdConnectProviderProps"></a>

Initialization properties for `OpenIdConnectProvider`.



## `Selector` <a id="aws-cdk-lib.aws_eks.Selector"></a>

Fargate profile selector.



## `ServiceAccountOptions` <a id="aws-cdk-lib.aws_eks.ServiceAccountOptions"></a>

Options for `ServiceAccount`.



## `ServiceAccountProps` <a id="aws-cdk-lib.aws_eks.ServiceAccountProps"></a>

Properties for defining service accounts.



## `ServiceLoadBalancerAddressOptions` <a id="aws-cdk-lib.aws_eks.ServiceLoadBalancerAddressOptions"></a>

Options for fetching a ServiceLoadBalancerAddress.


