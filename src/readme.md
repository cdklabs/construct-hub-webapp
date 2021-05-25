# Amazon EKS Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->

This construct library allows you to define [Amazon Elastic Container Service for Kubernetes (EKS)](https://aws.amazon.com/eks/) clusters.
In addition, the library also supports defining Kubernetes resource manifests within EKS clusters.

## Table Of Contents

* [Quick Start](#quick-start)
* [API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-eks-readme.html)
* [Architectural Overview](#architectural-overview)
* [Provisioning clusters](#provisioning-clusters)
  * [Managed node groups](#managed-node-groups)
  * [Fargate Profiles](#fargate-profiles)
  * [Self-managed nodes](#self-managed-nodes)
  * [Endpoint Access](#endpoint-access)
  * [VPC Support](#vpc-support)
  * [Kubectl Support](#kubectl-support)
  * [ARM64 Support](#arm64-support)
  * [Masters Role](#masters-role)
  * [Encryption](#encryption)
* [Permissions and Security](#permissions-and-security)
* [Applying Kubernetes Resources](#applying-kubernetes-resources)
  * [Kubernetes Manifests](#kubernetes-manifests)
  * [Helm Charts](#helm-charts)
  * [CDK8s Charts](#cdk8s-charts)
* [Patching Kubernetes Resources](#patching-kubernetes-resources)
* [Querying Kubernetes Resources](#querying-kubernetes-resources)
* [Using existing clusters](#using-existing-clusters)
* [Known Issues and Limitations](#known-issues-and-limitations)

## Quick Start

This example defines an Amazon EKS cluster with the following configuration:

* Dedicated VPC with default configuration (Implicitly created using [ec2.Vpc](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-ec2-readme.html#vpc))
* A Kubernetes pod with a container based on the [paulbouwer/hello-kubernetes](https://github.com/paulbouwer/hello-kubernetes) image.

```ts
// provisiong a cluster
const cluster = new eks.Cluster(this, 'hello-eks', {
  version: eks.KubernetesVersion.V1_19,
});

// apply a kubernetes manifest to the cluster
cluster.addManifest('mypod', {
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: { name: 'mypod' },
  spec: {
    containers: [
      {
        name: 'hello',
        image: 'paulbouwer/hello-kubernetes:1.5',
        ports: [ { containerPort: 8080 } ]
      }
    ]
  }
});
```

In order to interact with your cluster through `kubectl`, you can use the `aws eks update-kubeconfig` [AWS CLI command](https://docs.aws.amazon.com/cli/latest/reference/eks/update-kubeconfig.html)
to configure your local kubeconfig. The EKS module will define a CloudFormation output in your stack which contains the command to run. For example:

```plaintext
Outputs:
ClusterConfigCommand43AAE40F = aws eks update-kubeconfig --name cluster-xxxxx --role-arn arn:aws:iam::112233445566:role/yyyyy
```

Execute the `aws eks update-kubeconfig ...` command in your terminal to create or update a local kubeconfig context:

```console
$ aws eks update-kubeconfig --name cluster-xxxxx --role-arn arn:aws:iam::112233445566:role/yyyyy
Added new context arn:aws:eks:rrrrr:112233445566:cluster/cluster-xxxxx to /home/boom/.kube/config
```

And now you can simply use `kubectl`:

```console
$ kubectl get all -n kube-system
NAME                           READY   STATUS    RESTARTS   AGE
pod/aws-node-fpmwv             1/1     Running   0          21m
pod/aws-node-m9htf             1/1     Running   0          21m
pod/coredns-5cb4fb54c7-q222j   1/1     Running   0          23m
pod/coredns-5cb4fb54c7-v9nxx   1/1     Running   0          23m
...
```

## Architectural Overview

The following is a qualitative diagram of the various possible components involved in the cluster deployment.

```text
 +-----------------------------------------------+               +-----------------+
 |                 EKS Cluster                   |    kubectl    |                 |
 |-----------------------------------------------|<-------------+| Kubectl Handler |
 |                                               |               |                 |
 |                                               |               +-----------------+
 | +--------------------+    +-----------------+ |
 | |                    |    |                 | |
 | | Managed Node Group |    | Fargate Profile | |               +-----------------+
 | |                    |    |                 | |               |                 |
 | +--------------------+    +-----------------+ |               | Cluster Handler |
 |                                               |               |                 |
 +-----------------------------------------------+               +-----------------+
    ^                                   ^                          +
    |                                   |                          |
    | connect self managed capacity     |                          | aws-sdk
    |                                   | create/update/delete     |
    +                                   |                          v
 +--------------------+                 +              +-------------------+
 |                    |                 --------------+| eks.amazonaws.com |
 | Auto Scaling Group |                                +-------------------+
 |                    |
 +--------------------+
```

In a nutshell:

* `EKS Cluster` - The cluster endpoint created by EKS.
* `Managed Node Group` - EC2 worker nodes managed by EKS.
* `Fargate Profile` - Fargate worker nodes managed by EKS.
* `Auto Scaling Group` - EC2 worker nodes managed by the user.
* `KubectlHandler` - Lambda function for invoking `kubectl` commands on the cluster - created by CDK.
* `ClusterHandler` - Lambda function for interacting with EKS API to manage the cluster lifecycle - created by CDK.

A more detailed breakdown of each is provided further down this README.

## Provisioning clusters

Creating a new cluster is done using the `Cluster` or `FargateCluster` constructs. The only required property is the kubernetes `version`.

```ts
new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_19,
});
```

You can also use `FargateCluster` to provision a cluster that uses only fargate workers.

```ts
new eks.FargateCluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_19,
});
```

> **NOTE: Only 1 cluster per stack is supported.** If you have a use-case for multiple clusters per stack, or would like to understand more about this limitation, see <https://github.com/aws/aws-cdk/issues/10073>.

Below you'll find a few important cluster configuration options. First of which is Capacity.
Capacity is the amount and the type of worker nodes that are available to the cluster for deploying resources. Amazon EKS offers 3 ways of configuring capacity, which you can combine as you like:

### Managed node groups

Amazon EKS managed node groups automate the provisioning and lifecycle management of nodes (Amazon EC2 instances) for Amazon EKS Kubernetes clusters.
With Amazon EKS managed node groups, you don’t need to separately provision or register the Amazon EC2 instances that provide compute capacity to run your Kubernetes applications. You can create, update, or terminate nodes for your cluster with a single operation. Nodes run using the latest Amazon EKS optimized AMIs in your AWS account while node updates and terminations gracefully drain nodes to ensure that your applications stay available.

> For more details visit [Amazon EKS Managed Node Groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html).

**Managed Node Groups are the recommended way to allocate cluster capacity.**

By default, this library will allocate a managed node group with 2 *m5.large* instances (this instance type suits most common use-cases, and is good value for money).

At cluster instantiation time, you can customize the number of instances and their type:

```ts
new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_19,
  defaultCapacity: 5,
  defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.SMALL),
});
```

To access the node group that was created on your behalf, you can use `cluster.defaultNodegroup`.

Additional customizations are available post instantiation. To apply them, set the default capacity to 0, and use the `cluster.addNodegroupCapacity` method:

```ts
const cluster = new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_19,
  defaultCapacity: 0,
});

cluster.addNodegroupCapacity('custom-node-group', {
  instanceTypes: [new ec2.InstanceType('m5.large')],
  minSize: 4,
  diskSize: 100,
  amiType: eks.NodegroupAmiType.AL2_X86_64_GPU,
  ...
});
```

#### Spot Instances Support

Use `capacityType` to create managed node groups comprised of spot instances. To maximize the availability of your applications while using
Spot Instances, we recommend that you configure a Spot managed node group to use multiple instance types with the `instanceTypes` property.

> For more details visit [Managed node group capacity types](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html#managed-node-group-capacity-types).


```ts
cluster.addNodegroupCapacity('extra-ng-spot', {
  instanceTypes: [
    new ec2.InstanceType('c5.large'),
    new ec2.InstanceType('c5a.large'),
    new ec2.InstanceType('c5d.large'),
  ],
  minSize: 3,
  capacityType: eks.CapacityType.SPOT,
});

```

#### Launch Template Support

You can specify a launch template that the node group will use. For example, this can be useful if you want to use
a custom AMI or add custom user data.

When supplying a custom user data script, it must be encoded in the MIME multi-part archive format, since Amazon EKS merges with its own user data. Visit the [Launch Template Docs](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html#launch-template-user-data)
for mode details.

```ts
const userData = `MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="==MYBOUNDARY=="

--==MYBOUNDARY==
Content-Type: text/x-shellscript; charset="us-ascii"

#!/bin/bash
echo "Running custom user data script"

--==MYBOUNDARY==--\\
`;
const lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
  launchTemplateData: {
    instanceType: 't3.small',
    userData: Fn.base64(userData),
  },
});
cluster.addNodegroupCapacity('extra-ng', {
  launchTemplateSpec: {
    id: lt.ref,
    version: lt.attrLatestVersionNumber,
  },
});

```

Note that when using a custom AMI, Amazon EKS doesn't merge any user data. Which means you do not need the multi-part encoding. and are responsible for supplying the required bootstrap commands for nodes to join the cluster.
In the following example, `/ect/eks/bootstrap.sh` from the AMI will be used to bootstrap the node.

```ts
const userData = ec2.UserData.forLinux();
userData.addCommands(
  'set -o xtrace',
  `/etc/eks/bootstrap.sh ${cluster.clusterName}`,
);
const lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {
  launchTemplateData: {
    imageId: 'some-ami-id', // custom AMI
    instanceType: 't3.small',
    userData: Fn.base64(userData.render()),
  },
});
cluster.addNodegroupCapacity('extra-ng', {
  launchTemplateSpec: {
    id: lt.ref,
    version: lt.attrLatestVersionNumber,
  },
});
```

You may specify one `instanceType` in the launch template or multiple `instanceTypes` in the node group, **but not both**.

> For more details visit [Launch Template Support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html).

Graviton 2 instance types are supported including `c6g`, `m6g`, `r6g` and `t4g`.

### Fargate profiles

AWS Fargate is a technology that provides on-demand, right-sized compute
capacity for containers. With AWS Fargate, you no longer have to provision,
configure, or scale groups of virtual machines to run containers. This removes
the need to choose server types, decide when to scale your node groups, or
optimize cluster packing.

You can control which pods start on Fargate and how they run with Fargate
Profiles, which are defined as part of your Amazon EKS cluster.

See [Fargate Considerations](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html#fargate-considerations) in the AWS EKS User Guide.

You can add Fargate Profiles to any EKS cluster defined in your CDK app
through the `addFargateProfile()` method. The following example adds a profile
that will match all pods from the "default" namespace:

```ts
cluster.addFargateProfile('MyProfile', {
  selectors: [ { namespace: 'default' } ]
});
```

You can also directly use the `FargateProfile` construct to create profiles under different scopes:

```ts
new eks.FargateProfile(scope, 'MyProfile', {
  cluster,
  ...
});
```

To create an EKS cluster that **only** uses Fargate capacity, you can use `FargateCluster`.
The following code defines an Amazon EKS cluster with a default Fargate Profile that matches all pods from the "kube-system" and "default" namespaces. It is also configured to [run CoreDNS on Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate-getting-started.html#fargate-gs-coredns).

```ts
const cluster = new eks.FargateCluster(this, 'MyCluster', {
  version: eks.KubernetesVersion.V1_19,
});
```

**NOTE**: Classic Load Balancers and Network Load Balancers are not supported on
pods running on Fargate. For ingress, we recommend that you use the [ALB Ingress
Controller](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)
on Amazon EKS (minimum version v1.1.4).

### Self-managed nodes

Another way of allocating capacity to an EKS cluster is by using self-managed nodes.
EC2 instances that are part of the auto-scaling group will serve as worker nodes for the cluster.
This type of capacity is also commonly referred to as *EC2 Capacity** or *EC2 Nodes*.

For a detailed overview please visit [Self Managed Nodes](https://docs.aws.amazon.com/eks/latest/userguide/worker.html).

Creating an auto-scaling group and connecting it to the cluster is done using the `cluster.addAutoScalingGroupCapacity` method:

```ts
cluster.addAutoScalingGroupCapacity('frontend-nodes', {
  instanceType: new ec2.InstanceType('t2.medium'),
  minCapacity: 3,
  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
});
```

To connect an already initialized auto-scaling group, use the `cluster.connectAutoScalingGroupCapacity()` method:

```ts
const asg = new ec2.AutoScalingGroup(...);
cluster.connectAutoScalingGroupCapacity(asg);
```

In both cases, the [cluster security group](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html#cluster-sg) will be automatically attached to
the auto-scaling group, allowing for traffic to flow freely between managed and self-managed nodes.

> **Note:** The default `updateType` for auto-scaling groups does not replace existing nodes. Since security groups are determined at launch time, self-managed nodes that were provisioned with version `1.78.0` or lower, will not be updated.
> To apply the new configuration on all your self-managed nodes, you'll need to replace the nodes using the `UpdateType.REPLACING_UPDATE` policy for the [`updateType`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-autoscaling.AutoScalingGroup.html#updatetypespan-classapi-icon-api-icon-deprecated-titlethis-api-element-is-deprecated-its-use-is-not-recommended%EF%B8%8Fspan) property.

You can customize the [/etc/eks/boostrap.sh](https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh) script, which is responsible
for bootstrapping the node to the EKS cluster. For example, you can use `kubeletExtraArgs` to add custom node labels or taints.

```ts
cluster.addAutoScalingGroupCapacity('spot', {
  instanceType: new ec2.InstanceType('t3.large'),
  minCapacity: 2,
  bootstrapOptions: {
    kubeletExtraArgs: '--node-labels foo=bar,goo=far',
    awsApiRetryAttempts: 5
  }
});
```

To disable bootstrapping altogether (i.e. to fully customize user-data), set `bootstrapEnabled` to `false`.
You can also configure the cluster to use an auto-scaling group as the default capacity:

```ts
cluster = new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_19,
  defaultCapacityType: eks.DefaultCapacityType.EC2,
});
```

This will allocate an auto-scaling group with 2 *m5.large* instances (this instance type suits most common use-cases, and is good value for money).
To access the `AutoScalingGroup` that was created on your behalf, you can use `cluster.defaultCapacity`.
You can also independently create an `AutoScalingGroup` and connect it to the cluster using the `cluster.connectAutoScalingGroupCapacity` method:

```ts
const asg = new ec2.AutoScalingGroup(...)
cluster.connectAutoScalingGroupCapacity(asg);
```

This will add the necessary user-data to access the apiserver and configure all connections, roles, and tags needed for the instances in the auto-scaling group to properly join the cluster.

#### Spot Instances

When using self-managed nodes, you can configure the capacity to use spot instances, greatly reducing capacity cost.
To enable spot capacity, use the `spotPrice` property:

```ts
cluster.addAutoScalingGroupCapacity('spot', {
  spotPrice: '0.1094',
  instanceType: new ec2.InstanceType('t3.large'),
  maxCapacity: 10
});
```

> Spot instance nodes will be labeled with `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.

The [AWS Node Termination Handler](https://github.com/aws/aws-node-termination-handler) `DaemonSet` will be
installed from [Amazon EKS Helm chart repository](https://github.com/aws/eks-charts/tree/master/stable/aws-node-termination-handler) on these nodes.
The termination handler ensures that the Kubernetes control plane responds appropriately to events that
can cause your EC2 instance to become unavailable, such as [EC2 maintenance events](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-instances-status-check_sched.html)
and [EC2 Spot interruptions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-interruptions.html) and helps gracefully stop all pods running on spot nodes that are about to be
terminated.

> Handler Version: [1.7.0](https://github.com/aws/aws-node-termination-handler/releases/tag/v1.7.0)
>
> Chart Version: [0.9.5](https://github.com/aws/eks-charts/blob/v0.0.28/stable/aws-node-termination-handler/Chart.yaml)

To disable the installation of the termination handler, set the `spotInterruptHandler` property to `false`. This applies both to `addAutoScalingGroupCapacity` and `connectAutoScalingGroupCapacity`.

#### Bottlerocket

[Bottlerocket](https://aws.amazon.com/bottlerocket/) is a Linux-based open-source operating system that is purpose-built by Amazon Web Services for running containers on virtual machines or bare metal hosts.
At this moment, `Bottlerocket` is only supported when using self-managed auto-scaling groups.

> **NOTICE**: Bottlerocket is only available in [some supported AWS regions](https://github.com/bottlerocket-os/bottlerocket/blob/develop/QUICKSTART-EKS.md#finding-an-ami).

The following example will create an auto-scaling group of 2 `t3.small` Linux instances running with the `Bottlerocket` AMI.

```ts
cluster.addAutoScalingGroupCapacity('BottlerocketNodes', {
  instanceType: new ec2.InstanceType('t3.small'),
  minCapacity:  2,
  machineImageType: eks.MachineImageType.BOTTLEROCKET
});
```

The specific Bottlerocket AMI variant will be auto selected according to the k8s version for the `x86_64` architecture.
For example, if the Amazon EKS cluster version is `1.17`, the Bottlerocket AMI variant will be auto selected as
`aws-k8s-1.17` behind the scene.

> See [Variants](https://github.com/bottlerocket-os/bottlerocket/blob/develop/README.md#variants) for more details.

Please note Bottlerocket does not allow to customize bootstrap options and `bootstrapOptions` properties is not supported when you create the `Bottlerocket` capacity.

### Endpoint Access

When you create a new cluster, Amazon EKS creates an endpoint for the managed Kubernetes API server that you use to communicate with your cluster (using Kubernetes management tools such as `kubectl`)

By default, this API server endpoint is public to the internet, and access to the API server is secured using a combination of
AWS Identity and Access Management (IAM) and native Kubernetes [Role Based Access Control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC).

You can configure the [cluster endpoint access](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) by using the `endpointAccess` property:

```ts
const cluster = new eks.Cluster(this, 'hello-eks', {
  version: eks.KubernetesVersion.V1_19,
  endpointAccess: eks.EndpointAccess.PRIVATE // No access outside of your VPC.
});
```

The default value is `eks.EndpointAccess.PUBLIC_AND_PRIVATE`. Which means the cluster endpoint is accessible from outside of your VPC, but worker node traffic and `kubectl` commands issued by this library stay within your VPC.

### VPC Support

You can specify the VPC of the cluster using the `vpc` and `vpcSubnets` properties:

```ts
const vpc = new ec2.Vpc(this, 'Vpc');

new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_19,
  vpc,
  vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE }]
});
```

> Note: Isolated VPCs (i.e with no internet access) are not currently supported. See https://github.com/aws/aws-cdk/issues/12171

If you do not specify a VPC, one will be created on your behalf, which you can then access via `cluster.vpc`. The cluster VPC will be associated to any EKS managed capacity (i.e Managed Node Groups and Fargate Profiles).

If you allocate self managed capacity, you can specify which subnets should the auto-scaling group use:

```ts
const vpc = new ec2.Vpc(this, 'Vpc');
cluster.addAutoScalingGroupCapacity('nodes', {
  vpcSubnets: { subnets: vpc.privateSubnets }
});
```

There are two additional components you might want to provision within the VPC.

#### Kubectl Handler

The `KubectlHandler` is a Lambda function responsible to issuing `kubectl` and `helm` commands against the cluster when you add resource manifests to the cluster.

The handler association to the VPC is derived from the `endpointAccess` configuration. The rule of thumb is: *If the cluster VPC can be associated, it will be*.

Breaking this down, it means that if the endpoint exposes private access (via `EndpointAccess.PRIVATE` or `EndpointAccess.PUBLIC_AND_PRIVATE`), and the VPC contains **private** subnets, the Lambda function will be provisioned inside the VPC and use the private subnets to interact with the cluster. This is the common use-case.

If the endpoint does not expose private access (via `EndpointAccess.PUBLIC`) **or** the VPC does not contain private subnets, the function will not be provisioned within the VPC.

#### Cluster Handler

The `ClusterHandler` is a Lambda function responsible to interact with the EKS API in order to control the cluster lifecycle. To provision this function inside the VPC, set the `placeClusterHandlerInVpc` property to `true`. This will place the function inside the private subnets of the VPC based on the selection strategy specified in the [`vpcSubnets`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-eks.Cluster.html#vpcsubnetsspan-classapi-icon-api-icon-experimental-titlethis-api-element-is-experimental-it-may-change-without-noticespan) property.

You can configure the environment of this function by specifying it at cluster instantiation. For example, this can be useful in order to configure an http proxy:

```ts
const cluster = new eks.Cluster(this, 'hello-eks', {
  version: eks.KubernetesVersion.V1_19,
  clusterHandlerEnvironment: {
    'http_proxy': 'http://proxy.myproxy.com'
  }
});
```

### Kubectl Support

The resources are created in the cluster by running `kubectl apply` from a python lambda function.

#### Environment

You can configure the environment of this function by specifying it at cluster instantiation. For example, this can be useful in order to configure an http proxy:

```ts
const cluster = new eks.Cluster(this, 'hello-eks', {
  version: eks.KubernetesVersion.V1_19,
  kubectlEnvironment: {
    'http_proxy': 'http://proxy.myproxy.com'
  }
});
```

#### Runtime

The kubectl handler uses `kubectl`, `helm` and the `aws` CLI in order to
interact with the cluster. These are bundled into AWS Lambda layers included in
the `@aws-cdk/lambda-layer-awscli` and `@aws-cdk/lambda-layer-kubectl` modules.

You can specify a custom `lambda.LayerVersion` if you wish to use a different
version of these tools. The handler expects the layer to include the following
three executables:

```text
helm/helm
kubectl/kubectl
awscli/aws
```

See more information in the
[Dockerfile](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/lambda-layer-awscli/layer) for @aws-cdk/lambda-layer-awscli
and the
[Dockerfile](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/lambda-layer-kubectl/layer) for @aws-cdk/lambda-layer-kubectl.

```ts
const layer = new lambda.LayerVersion(this, 'KubectlLayer', {
  code: lambda.Code.fromAsset('layer.zip'),
});
```

Now specify when the cluster is defined:

```ts
const cluster = new eks.Cluster(this, 'MyCluster', {
  kubectlLayer: layer,
});

// or
const cluster = eks.Cluster.fromClusterAttributes(this, 'MyCluster', {
  kubectlLayer: layer,
});
```

#### Memory

By default, the kubectl provider is configured with 1024MiB of memory. You can use the `kubectlMemory` option to specify the memory size for the AWS Lambda function:

```ts
import { Size } from 'aws-cdk-lib';

new eks.Cluster(this, 'MyCluster', {
  kubectlMemory: Size.gibibytes(4)
});

// or
eks.Cluster.fromClusterAttributes(this, 'MyCluster', {
  kubectlMemory: Size.gibibytes(4)
});
```

### ARM64 Support

Instance types with `ARM64` architecture are supported in both managed nodegroup and self-managed capacity. Simply specify an ARM64 `instanceType` (such as `m6g.medium`), and the latest
Amazon Linux 2 AMI for ARM64 will be automatically selected.

```ts
// add a managed ARM64 nodegroup
cluster.addNodegroupCapacity('extra-ng-arm', {
  instanceTypes: [new ec2.InstanceType('m6g.medium')],
  minSize: 2,
});

// add a self-managed ARM64 nodegroup
cluster.addAutoScalingGroupCapacity('self-ng-arm', {
  instanceType: new ec2.InstanceType('m6g.medium'),
  minCapacity: 2,
})
```

### Masters Role

When you create a cluster, you can specify a `mastersRole`. The `Cluster` construct will associate this role with the `system:masters` [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) group, giving it super-user access to the cluster.

```ts
const role = new iam.Role(...);
new eks.Cluster(this, 'HelloEKS', {
  version: eks.KubernetesVersion.V1_19,
  mastersRole: role,
});
```

If you do not specify it, a default role will be created on your behalf, that can be assumed by anyone in the account with `sts:AssumeRole` permissions for this role.

This is the role you see as part of the stack outputs mentioned in the [Quick Start](#quick-start).

```console
$ aws eks update-kubeconfig --name cluster-xxxxx --role-arn arn:aws:iam::112233445566:role/yyyyy
Added new context arn:aws:eks:rrrrr:112233445566:cluster/cluster-xxxxx to /home/boom/.kube/config
```

### Encryption

When you create an Amazon EKS cluster, envelope encryption of Kubernetes secrets using the AWS Key Management Service (AWS KMS) can be enabled.
The documentation on [creating a cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)
can provide more details about the customer master key (CMK) that can be used for the encryption.

You can use the `secretsEncryptionKey` to configure which key the cluster will use to encrypt Kubernetes secrets. By default, an AWS Managed key will be used.

> This setting can only be specified when the cluster is created and cannot be updated.

```ts
const secretsKey = new kms.Key(this, 'SecretsKey');
const cluster = new eks.Cluster(this, 'MyCluster', {
  secretsEncryptionKey: secretsKey,
  // ...
});
```

You can also use a similar configuration for running a cluster built using the FargateCluster construct.

```ts
const secretsKey = new kms.Key(this, 'SecretsKey');
const cluster = new eks.FargateCluster(this, 'MyFargateCluster', {
  secretsEncryptionKey: secretsKey
});
```

The Amazon Resource Name (ARN) for that CMK can be retrieved.

```ts
const clusterEncryptionConfigKeyArn = cluster.clusterEncryptionConfigKeyArn;
```

## Permissions and Security

Amazon EKS provides several mechanism of securing the cluster and granting permissions to specific IAM users and roles.

### AWS IAM Mapping

As described in the [Amazon EKS User Guide](https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html), you can map AWS IAM users and roles to [Kubernetes Role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac).

The Amazon EKS construct manages the *aws-auth* `ConfigMap` Kubernetes resource on your behalf and exposes an API through the `cluster.awsAuth` for mapping
users, roles and accounts.

Furthermore, when auto-scaling group capacity is added to the cluster, the IAM instance role of the auto-scaling group will be automatically mapped to RBAC so nodes can connect to the cluster. No manual mapping is required.

For example, let's say you want to grant an IAM user administrative privileges on your cluster:

```ts
const adminUser = new iam.User(this, 'Admin');
cluster.awsAuth.addUserMapping(adminUser, { groups: [ 'system:masters' ]});
```

A convenience method for mapping a role to the `system:masters` group is also available:

```ts
cluster.awsAuth.addMastersRole(role)
```

### Cluster Security Group

When you create an Amazon EKS cluster, a [cluster security group](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html)
is automatically created as well. This security group is designed to allow all traffic from the control plane and managed node groups to flow freely
between each other.

The ID for that security group can be retrieved after creating the cluster.

```ts
const clusterSecurityGroupId = cluster.clusterSecurityGroupId;
```

### Node SSH Access

If you want to be able to SSH into your worker nodes, you must already have an SSH key in the region you're connecting to and pass it when
you add capacity to the cluster. You must also be able to connect to the hosts (meaning they must have a public IP and you
should be allowed to connect to them on port 22):

See [SSH into nodes](test/example.ssh-into-nodes.lit.ts) for a code example.

If you want to SSH into nodes in a private subnet, you should set up a bastion host in a public subnet. That setup is recommended, but is
unfortunately beyond the scope of this documentation.

### Service Accounts

With services account you can provide Kubernetes Pods access to AWS resources.

```ts
// add service account
const sa = cluster.addServiceAccount('MyServiceAccount');

const bucket = new Bucket(this, 'Bucket');
bucket.grantReadWrite(serviceAccount);

const mypod = cluster.addManifest('mypod', {
  apiVersion: 'v1',
  kind: 'Pod',
  metadata: { name: 'mypod' },
  spec: {
    serviceAccountName: sa.serviceAccountName
    containers: [
      {
        name: 'hello',
        image: 'paulbouwer/hello-kubernetes:1.5',
        ports: [ { containerPort: 8080 } ],

      }
    ]
  }
});

// create the resource after the service account.
mypod.node.addDependency(sa);

// print the IAM role arn for this service account
new cdk.CfnOutput(this, 'ServiceAccountIamRole', { value: sa.role.roleArn })
```

Note that using `sa.serviceAccountName` above **does not** translate into a resource dependency.
This is why an explicit dependency is needed. See <https://github.com/aws/aws-cdk/issues/9910> for more details.

You can also add service accounts to existing clusters.
To do so, pass the `openIdConnectProvider` property when you import the cluster into the application.

```ts
// you can import an existing provider
const provider = eks.OpenIdConnectProvider.fromOpenIdConnectProviderArn(this, 'Provider', 'arn:aws:iam::123456:oidc-provider/oidc.eks.eu-west-1.amazonaws.com/id/AB123456ABC');

// or create a new one using an existing issuer url
const provider = new eks.OpenIdConnectProvider(this, 'Provider', issuerUrl);

const cluster = eks.Cluster.fromClusterAttributes({
  clusterName: 'Cluster',
  openIdConnectProvider: provider,
  kubectlRoleArn: 'arn:aws:iam::123456:role/service-role/k8sservicerole',
});

const sa = cluster.addServiceAccount('MyServiceAccount');

const bucket = new Bucket(this, 'Bucket');
bucket.grantReadWrite(serviceAccount);

// ...
```

Note that adding service accounts requires running `kubectl` commands against the cluster.
This means you must also pass the `kubectlRoleArn` when importing the cluster.
See [Using existing Clusters](https://github.com/aws/aws-cdk/tree/master/packages/@aws-cdk/aws-eks#using-existing-clusters).

## Applying Kubernetes Resources

The library supports several popular resource deployment mechanisms, among which are:

### Kubernetes Manifests

The `KubernetesManifest` construct or `cluster.addManifest` method can be used
to apply Kubernetes resource manifests to this cluster.

> When using `cluster.addManifest`, the manifest construct is defined within the cluster's stack scope. If the manifest contains
> attributes from a different stack which depend on the cluster stack, a circular dependency will be created and you will get a synth time error.
> To avoid this, directly use `new KubernetesManifest` to create the manifest in the scope of the other stack.

The following examples will deploy the [paulbouwer/hello-kubernetes](https://github.com/paulbouwer/hello-kubernetes)
service on the cluster:

```ts
const appLabel = { app: "hello-kubernetes" };

const deployment = {
  apiVersion: "apps/v1",
  kind: "Deployment",
  metadata: { name: "hello-kubernetes" },
  spec: {
    replicas: 3,
    selector: { matchLabels: appLabel },
    template: {
      metadata: { labels: appLabel },
      spec: {
        containers: [
          {
            name: "hello-kubernetes",
            image: "paulbouwer/hello-kubernetes:1.5",
            ports: [ { containerPort: 8080 } ]
          }
        ]
      }
    }
  }
};

const service = {
  apiVersion: "v1",
  kind: "Service",
  metadata: { name: "hello-kubernetes" },
  spec: {
    type: "LoadBalancer",
    ports: [ { port: 80, targetPort: 8080 } ],
    selector: appLabel
  }
};

// option 1: use a construct
new KubernetesManifest(this, 'hello-kub', {
  cluster,
  manifest: [ deployment, service ]
});

// or, option2: use `addManifest`
cluster.addManifest('hello-kub', service, deployment);
```

#### Adding resources from a URL

The following example will deploy the resource manifest hosting on remote server:

```ts
import * as yaml from 'js-yaml';
import * as request from 'sync-request';

const manifestUrl = 'https://url/of/manifest.yaml';
const manifest = yaml.safeLoadAll(request('GET', manifestUrl).getBody());
cluster.addManifest('my-resource', ...manifest);
```

#### Dependencies

There are cases where Kubernetes resources must be deployed in a specific order.
For example, you cannot define a resource in a Kubernetes namespace before the
namespace was created.

You can represent dependencies between `KubernetesManifest`s using
`resource.node.addDependency()`:

```ts
const namespace = cluster.addManifest('my-namespace', {
  apiVersion: 'v1',
  kind: 'Namespace',
  metadata: { name: 'my-app' }
});

const service = cluster.addManifest('my-service', {
  metadata: {
    name: 'myservice',
    namespace: 'my-app'
  },
  spec: // ...
});

service.node.addDependency(namespace); // will apply `my-namespace` before `my-service`.
```

**NOTE:** when a `KubernetesManifest` includes multiple resources (either directly
or through `cluster.addManifest()`) (e.g. `cluster.addManifest('foo', r1, r2,
r3,...)`), these resources will be applied as a single manifest via `kubectl`
and will be applied sequentially (the standard behavior in `kubectl`).

---

Since Kubernetes manifests are implemented as CloudFormation resources in the
CDK. This means that if the manifest is deleted from your code (or the stack is
deleted), the next `cdk deploy` will issue a `kubectl delete` command and the
Kubernetes resources in that manifest will be deleted.

#### Resource Pruning

When a resource is deleted from a Kubernetes manifest, the EKS module will
automatically delete these resources by injecting a _prune label_ to all
manifest resources. This label is then passed to [`kubectl apply --prune`].

[`kubectl apply --prune`]: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune-l-your-label

Pruning is enabled by default but can be disabled through the `prune` option
when a cluster is defined:

```ts
new Cluster(this, 'MyCluster', {
  prune: false
});
```

#### Manifests Validation

The `kubectl` CLI supports applying a manifest by skipping the validation.
This can be accomplished by setting the `skipValidation` flag to `true` in the `KubernetesManifest` props.

```ts
new eks.KubernetesManifest(this, 'HelloAppWithoutValidation', {
  cluster: this.cluster,
  manifest: [ deployment, service ],
  skipValidation: true,
});
```

### Helm Charts

The `HelmChart` construct or `cluster.addHelmChart` method can be used
to add Kubernetes resources to this cluster using Helm.

> When using `cluster.addHelmChart`, the manifest construct is defined within the cluster's stack scope. If the manifest contains
> attributes from a different stack which depend on the cluster stack, a circular dependency will be created and you will get a synth time error.
> To avoid this, directly use `new HelmChart` to create the chart in the scope of the other stack.

The following example will install the [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/) to your cluster using Helm.

```ts
// option 1: use a construct
new HelmChart(this, 'NginxIngress', {
  cluster,
  chart: 'nginx-ingress',
  repository: 'https://helm.nginx.com/stable',
  namespace: 'kube-system'
});

// or, option2: use `addHelmChart`
cluster.addHelmChart('NginxIngress', {
  chart: 'nginx-ingress',
  repository: 'https://helm.nginx.com/stable',
  namespace: 'kube-system'
});
```

Helm charts will be installed and updated using `helm upgrade --install`, where a few parameters
are being passed down (such as `repo`, `values`, `version`, `namespace`, `wait`, `timeout`, etc).
This means that if the chart is added to CDK with the same release name, it will try to update
the chart in the cluster.

Helm charts are implemented as CloudFormation resources in CDK.
This means that if the chart is deleted from your code (or the stack is
deleted), the next `cdk deploy` will issue a `helm uninstall` command and the
Helm chart will be deleted.

When there is no `release` defined, a unique ID will be allocated for the release based
on the construct path.

By default, all Helm charts will be installed concurrently. In some cases, this
could cause race conditions where two Helm charts attempt to deploy the same
resource or if Helm charts depend on each other. You can use
`chart.node.addDependency()` in order to declare a dependency order between
charts:

```ts
const chart1 = cluster.addHelmChart(...);
const chart2 = cluster.addHelmChart(...);

chart2.node.addDependency(chart1);
```

#### CDK8s Charts

[CDK8s](https://cdk8s.io/) is an open-source library that enables Kubernetes manifest authoring using familiar programming languages. It is founded on the same technologies as the AWS CDK, such as [`constructs`](https://github.com/aws/constructs) and [`jsii`](https://github.com/aws/jsii).

> To learn more about cdk8s, visit the [Getting Started](https://github.com/awslabs/cdk8s/tree/master/docs/getting-started) tutorials.

The EKS module natively integrates with cdk8s and allows you to apply cdk8s charts on AWS EKS clusters via the `cluster.addCdk8sChart` method.

In addition to `cdk8s`, you can also use [`cdk8s+`](https://github.com/awslabs/cdk8s/tree/master/packages/cdk8s-plus), which provides higher level abstraction for the core kubernetes api objects.
You can think of it like the `L2` constructs for Kubernetes. Any other `cdk8s` based libraries are also supported, for example [`cdk8s-debore`](https://github.com/toricls/cdk8s-debore).

To get started, add the following dependencies to your `package.json` file:

```json
"dependencies": {
  "cdk8s": "0.30.0",
  "cdk8s-plus": "0.30.0",
  "constructs": "3.0.4"
}
```

> Note that the version of `cdk8s` must be `>=0.30.0`.

Similarly to how you would create a stack by extending `@aws-cdk/core.Stack`, we recommend you create a chart of your own that extends `cdk8s.Chart`,
and add your kubernetes resources to it. You can use `aws-cdk` construct attributes and properties inside your `cdk8s` construct freely.

In this example we create a chart that accepts an `s3.Bucket` and passes its name to a kubernetes pod as an environment variable.

Notice that the chart must accept a `constructs.Construct` type as its scope, not an `@aws-cdk/core.Construct` as you would normally use.
For this reason, to avoid possible confusion, we will create the chart in a separate file:

`+ my-chart.ts`

```ts
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as constructs from 'constructs';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export interface MyChartProps {
  readonly bucket: s3.Bucket;
}

export class MyChart extends cdk8s.Chart {
  constructor(scope: constructs.Construct, id: string, props: MyChartProps) {
    super(scope, id);

    new kplus.Pod(this, 'Pod', {
      spec: {
        containers: [
          new kplus.Container({
            image: 'my-image',
            env: {
              BUCKET_NAME: kplus.EnvValue.fromValue(props.bucket.bucketName),
            },
          }),
        ],
      },
    });
  }
}
```

Then, in your AWS CDK app:

```ts
import { aws_s3 as s3 } from 'aws-cdk-lib';
import * as cdk8s from 'cdk8s';
import { MyChart } from './my-chart';

// some bucket..
const bucket = new s3.Bucket(this, 'Bucket');

// create a cdk8s chart and use `cdk8s.App` as the scope.
const myChart = new MyChart(new cdk8s.App(), 'MyChart', { bucket });

// add the cdk8s chart to the cluster
cluster.addCdk8sChart('my-chart', myChart);
```

##### Custom CDK8s Constructs

You can also compose a few stock `cdk8s+` constructs into your own custom construct. However, since mixing scopes between `aws-cdk` and `cdk8s` is currently not supported, the `Construct` class
you'll need to use is the one from the [`constructs`](https://github.com/aws/constructs) module, and not from `@aws-cdk/core` like you normally would.
This is why we used `new cdk8s.App()` as the scope of the chart above.

```ts
import * as constructs from 'constructs';
import * as cdk8s from 'cdk8s';
import * as kplus from 'cdk8s-plus';

export interface LoadBalancedWebService {
  readonly port: number;
  readonly image: string;
  readonly replicas: number;
}

export class LoadBalancedWebService extends constructs.Construct {
  constructor(scope: constructs.Construct, id: string, props: LoadBalancedWebService) {
    super(scope, id);

    const deployment = new kplus.Deployment(chart, 'Deployment', {
      spec: {
        replicas: props.replicas,
        podSpecTemplate: {
          containers: [ new kplus.Container({ image: props.image }) ]
        }
      },
    });

    deployment.expose({port: props.port, serviceType: kplus.ServiceType.LOAD_BALANCER})

  }
}
```

##### Manually importing k8s specs and CRD's

If you find yourself unable to use `cdk8s+`, or just like to directly use the `k8s` native objects or CRD's, you can do so by manually importing them using the `cdk8s-cli`.

See [Importing kubernetes objects](https://github.com/awslabs/cdk8s/tree/master/packages/cdk8s-cli#import) for detailed instructions.

## Patching Kubernetes Resources

The `KubernetesPatch` construct can be used to update existing kubernetes
resources. The following example can be used to patch the `hello-kubernetes`
deployment from the example above with 5 replicas.

```ts
new KubernetesPatch(this, 'hello-kub-deployment-label', {
  cluster,
  resourceName: "deployment/hello-kubernetes",
  applyPatch: { spec: { replicas: 5 } },
  restorePatch: { spec: { replicas: 3 } }
})
```

## Querying Kubernetes Resources

The `KubernetesObjectValue` construct can be used to query for information about kubernetes objects,
and use that as part of your CDK application.

For example, you can fetch the address of a [`LoadBalancer`](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) type service:

```ts
// query the load balancer address
const myServiceAddress = new KubernetesObjectValue(this, 'LoadBalancerAttribute', {
  cluster: cluster,
  objectType: 'service',
  objectName: 'my-service',
  jsonPath: '.status.loadBalancer.ingress[0].hostname', // https://kubernetes.io/docs/reference/kubectl/jsonpath/
});

// pass the address to a lambda function
const proxyFunction = new lambda.Function(this, 'ProxyFunction', {
  ...
  environment: {
    myServiceAddress: myServiceAddress.value
  },
})
```

Specifically, since the above use-case is quite common, there is an easier way to access that information:

```ts
const loadBalancerAddress = cluster.getServiceLoadBalancerAddress('my-service');
```

## Using existing clusters

The Amazon EKS library allows defining Kubernetes resources such as [Kubernetes
manifests](#kubernetes-resources) and [Helm charts](#helm-charts) on clusters
that are not defined as part of your CDK app.

First, you'll need to "import" a cluster to your CDK app. To do that, use the
`eks.Cluster.fromClusterAttributes()` static method:

```ts
const cluster = eks.Cluster.fromClusterAttributes(this, 'MyCluster', {
  clusterName: 'my-cluster-name',
  kubectlRoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',
});
```

Then, you can use `addManifest` or `addHelmChart` to define resources inside
your Kubernetes cluster. For example:

```ts
cluster.addManifest('Test', {
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    name: 'myconfigmap',
  },
  data: {
    Key: 'value',
    Another: '123454',
  },
});
```

At the minimum, when importing clusters for `kubectl` management, you will need
to specify:

* `clusterName` - the name of the cluster.
* `kubectlRoleArn` - the ARN of an IAM role mapped to the `system:masters` RBAC
  role. If the cluster you are importing was created using the AWS CDK, the
  CloudFormation stack has an output that includes an IAM role that can be used.
  Otherwise, you can create an IAM role and map it to `system:masters` manually.
  The trust policy of this role should include the the
  `arn:aws::iam::${accountId}:root` principal in order to allow the execution
  role of the kubectl resource to assume it.

If the cluster is configured with private-only or private and restricted public
Kubernetes [endpoint access](#endpoint-access), you must also specify:

* `kubectlSecurityGroupId` - the ID of an EC2 security group that is allowed
  connections to the cluster's control security group. For example, the EKS managed [cluster security group](#cluster-security-group).
* `kubectlPrivateSubnetIds` - a list of private VPC subnets IDs that will be used
  to access the Kubernetes endpoint.

## Known Issues and Limitations

* [One cluster per stack](https://github.com/aws/aws-cdk/issues/10073)
* [Service Account dependencies](https://github.com/aws/aws-cdk/issues/9910)
* [Support isolated VPCs](https://github.com/aws/aws-cdk/issues/12171)

# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### AwsAuth <a name="aws-cdk-lib.aws_eks.AwsAuth"></a>

Manages mapping between IAM users and roles to Kubernetes RBAC configuration.

> https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html

#### Initializer <a name="aws-cdk-lib.aws_eks.AwsAuth.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.AwsAuth(scope: constructs..Construct, 
                        id: builtins.str, 
                        cluster: aws_cdk.aws_eks.Cluster)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.Cluster`](#aws-cdk-lib.aws_eks.Cluster)

The EKS cluster to apply this configuration to.

[disable-awslint:ref-via-interface]

---

#### Methods <a name="Methods"></a>

##### `add_account` <a name="add_account"></a>

```python
def add_account(account_id: builtins.str)
```

###### `account_id`<sup>Required</sup> <a name="account_id"></a>

- *Type:* `builtins.str`

account number.

---

##### `add_masters_role` <a name="add_masters_role"></a>

```python
def add_masters_role(role: aws_cdk.aws_iam.IRole, 
                     username: builtins.str = None)
```

###### `role`<sup>Required</sup> <a name="role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)

The IAM role to add.

---

###### `username`<sup>Optional</sup> <a name="username"></a>

- *Type:* `builtins.str`

Optional user (defaults to the role ARN).

---

##### `add_role_mapping` <a name="add_role_mapping"></a>

```python
def add_role_mapping(role: aws_cdk.aws_iam.IRole, 
                     groups: typing.List[builtins.str], 
                     username: builtins.str = None)
```

###### `role`<sup>Required</sup> <a name="role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)

The IAM role to map.

---

###### `groups`<sup>Required</sup> <a name="groups"></a>

- *Type:* **typing.List**[`builtins.str`]

A list of groups within Kubernetes to which the role is mapped.

> https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings

---

###### `username`<sup>Optional</sup> <a name="username"></a>

- *Type:* `builtins.str`
- *Default:*  By default, the user name is the ARN of the IAM role.

The user name within Kubernetes to map to the IAM role.

---

##### `add_user_mapping` <a name="add_user_mapping"></a>

```python
def add_user_mapping(user: aws_cdk.aws_iam.IUser, 
                     groups: typing.List[builtins.str], 
                     username: builtins.str = None)
```

###### `user`<sup>Required</sup> <a name="user"></a>

- *Type:* [`aws_cdk.aws_iam.IUser`](#aws-cdk-lib.aws_iam.IUser)

The IAM user to map.

---

###### `groups`<sup>Required</sup> <a name="groups"></a>

- *Type:* **typing.List**[`builtins.str`]

A list of groups within Kubernetes to which the role is mapped.

> https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings

---

###### `username`<sup>Optional</sup> <a name="username"></a>

- *Type:* `builtins.str`
- *Default:*  By default, the user name is the ARN of the IAM role.

The user name within Kubernetes to map to the IAM role.

---



### CfnAddon <a name="aws-cdk-lib.aws_eks.CfnAddon"></a>

- *Implements:* [`aws_cdk..IInspectable`](#aws-cdk-lib.IInspectable)

A CloudFormation `AWS::EKS::Addon`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnAddon.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnAddon(scope: constructs..Construct, 
                         id: builtins.str, 
                         addon_name: builtins.str, 
                         cluster_name: builtins.str, 
                         addon_version: builtins.str = None, 
                         resolve_conflicts: builtins.str = None, 
                         service_account_role_arn: builtins.str = None, 
                         tags: typing.List[aws_cdk..CfnTag] = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

 scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

 scoped id of the resource.

---

##### `addon_name`<sup>Required</sup> <a name="addon_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.AddonName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname)

---

##### `cluster_name`<sup>Required</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.ClusterName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername)

---

##### `addon_version`<sup>Optional</sup> <a name="addon_version"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.AddonVersion`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion)

---

##### `resolve_conflicts`<sup>Optional</sup> <a name="resolve_conflicts"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.ResolveConflicts`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts)

---

##### `service_account_role_arn`<sup>Optional</sup> <a name="service_account_role_arn"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.ServiceAccountRoleArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* **typing.List**[[`aws_cdk..CfnTag`](#aws-cdk-lib.CfnTag)]

`AWS::EKS::Addon.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags)

---

#### Methods <a name="Methods"></a>

##### `inspect` <a name="inspect"></a>

```python
def inspect(inspector: aws_cdk..TreeInspector)
```

###### `inspector`<sup>Required</sup> <a name="inspector"></a>

- *Type:* [`aws_cdk..TreeInspector`](#aws-cdk-lib.TreeInspector)

 tree inspector to collect and process attributes.

---


#### Constants <a name="Constants"></a>

##### `CFN_RESOURCE_TYPE_NAME` <a name="CFN_RESOURCE_TYPE_NAME"></a>

- *Type:* `builtins.str`

The CloudFormation resource type name for this resource class.

---

### CfnCluster <a name="aws-cdk-lib.aws_eks.CfnCluster"></a>

- *Implements:* [`aws_cdk..IInspectable`](#aws-cdk-lib.IInspectable)

A CloudFormation `AWS::EKS::Cluster`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnCluster.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnCluster(scope: constructs..Construct, 
                           id: builtins.str, 
                           resources_vpc_config: typing.Union[aws_cdk.aws_eks.CfnCluster.ResourcesVpcConfigProperty, aws_cdk..IResolvable], 
                           role_arn: builtins.str, 
                           encryption_config: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_eks.CfnCluster.EncryptionConfigProperty, aws_cdk..IResolvable]]] = None, 
                           kubernetes_network_config: typing.Union[aws_cdk.aws_eks.CfnCluster.KubernetesNetworkConfigProperty, aws_cdk..IResolvable] = None, 
                           name: builtins.str = None, 
                           version: builtins.str = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

 scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

 scoped id of the resource.

---

##### `resources_vpc_config`<sup>Required</sup> <a name="resources_vpc_config"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnCluster.ResourcesVpcConfigProperty`](#aws-cdk-lib.aws_eks.CfnCluster.ResourcesVpcConfigProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Cluster.ResourcesVpcConfig`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig)

---

##### `role_arn`<sup>Required</sup> <a name="role_arn"></a>

- *Type:* `builtins.str`

`AWS::EKS::Cluster.RoleArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn)

---

##### `encryption_config`<sup>Optional</sup> <a name="encryption_config"></a>

- *Type:* **typing.Union**[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable), **typing.List**[**typing.Union**[[`aws_cdk.aws_eks.CfnCluster.EncryptionConfigProperty`](#aws-cdk-lib.aws_eks.CfnCluster.EncryptionConfigProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`AWS::EKS::Cluster.EncryptionConfig`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig)

---

##### `kubernetes_network_config`<sup>Optional</sup> <a name="kubernetes_network_config"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnCluster.KubernetesNetworkConfigProperty`](#aws-cdk-lib.aws_eks.CfnCluster.KubernetesNetworkConfigProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Cluster.KubernetesNetworkConfig`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig)

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Cluster.Name`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name)

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`

`AWS::EKS::Cluster.Version`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version)

---

#### Methods <a name="Methods"></a>

##### `inspect` <a name="inspect"></a>

```python
def inspect(inspector: aws_cdk..TreeInspector)
```

###### `inspector`<sup>Required</sup> <a name="inspector"></a>

- *Type:* [`aws_cdk..TreeInspector`](#aws-cdk-lib.TreeInspector)

 tree inspector to collect and process attributes.

---


#### Constants <a name="Constants"></a>

##### `CFN_RESOURCE_TYPE_NAME` <a name="CFN_RESOURCE_TYPE_NAME"></a>

- *Type:* `builtins.str`

The CloudFormation resource type name for this resource class.

---

### CfnFargateProfile <a name="aws-cdk-lib.aws_eks.CfnFargateProfile"></a>

- *Implements:* [`aws_cdk..IInspectable`](#aws-cdk-lib.IInspectable)

A CloudFormation `AWS::EKS::FargateProfile`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnFargateProfile.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnFargateProfile(scope: constructs..Construct, 
                                  id: builtins.str, 
                                  cluster_name: builtins.str, 
                                  pod_execution_role_arn: builtins.str, 
                                  selectors: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_eks.CfnFargateProfile.SelectorProperty, aws_cdk..IResolvable]]], 
                                  fargate_profile_name: builtins.str = None, 
                                  subnets: typing.List[builtins.str] = None, 
                                  tags: typing.List[aws_cdk..CfnTag] = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

 scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

 scoped id of the resource.

---

##### `cluster_name`<sup>Required</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::FargateProfile.ClusterName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername)

---

##### `pod_execution_role_arn`<sup>Required</sup> <a name="pod_execution_role_arn"></a>

- *Type:* `builtins.str`

`AWS::EKS::FargateProfile.PodExecutionRoleArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn)

---

##### `selectors`<sup>Required</sup> <a name="selectors"></a>

- *Type:* **typing.Union**[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable), **typing.List**[**typing.Union**[[`aws_cdk.aws_eks.CfnFargateProfile.SelectorProperty`](#aws-cdk-lib.aws_eks.CfnFargateProfile.SelectorProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`AWS::EKS::FargateProfile.Selectors`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors)

---

##### `fargate_profile_name`<sup>Optional</sup> <a name="fargate_profile_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::FargateProfile.FargateProfileName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename)

---

##### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* **typing.List**[`builtins.str`]

`AWS::EKS::FargateProfile.Subnets`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* **typing.List**[[`aws_cdk..CfnTag`](#aws-cdk-lib.CfnTag)]

`AWS::EKS::FargateProfile.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags)

---

#### Methods <a name="Methods"></a>

##### `inspect` <a name="inspect"></a>

```python
def inspect(inspector: aws_cdk..TreeInspector)
```

###### `inspector`<sup>Required</sup> <a name="inspector"></a>

- *Type:* [`aws_cdk..TreeInspector`](#aws-cdk-lib.TreeInspector)

 tree inspector to collect and process attributes.

---


#### Constants <a name="Constants"></a>

##### `CFN_RESOURCE_TYPE_NAME` <a name="CFN_RESOURCE_TYPE_NAME"></a>

- *Type:* `builtins.str`

The CloudFormation resource type name for this resource class.

---

### CfnNodegroup <a name="aws-cdk-lib.aws_eks.CfnNodegroup"></a>

- *Implements:* [`aws_cdk..IInspectable`](#aws-cdk-lib.IInspectable)

A CloudFormation `AWS::EKS::Nodegroup`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnNodegroup.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnNodegroup(scope: constructs..Construct, 
                             id: builtins.str, 
                             cluster_name: builtins.str, 
                             node_role: builtins.str, 
                             subnets: typing.List[builtins.str], 
                             ami_type: builtins.str = None, 
                             capacity_type: builtins.str = None, 
                             disk_size: typing.Union[int, float] = None, 
                             force_update_enabled: typing.Union[builtins.bool, aws_cdk..IResolvable] = None, 
                             instance_types: typing.List[builtins.str] = None, 
                             labels: typing.Any = None, 
                             launch_template: typing.Union[aws_cdk.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty, aws_cdk..IResolvable] = None, 
                             nodegroup_name: builtins.str = None, 
                             release_version: builtins.str = None, 
                             remote_access: typing.Union[aws_cdk.aws_eks.CfnNodegroup.RemoteAccessProperty, aws_cdk..IResolvable] = None, 
                             scaling_config: typing.Union[aws_cdk.aws_eks.CfnNodegroup.ScalingConfigProperty, aws_cdk..IResolvable] = None, 
                             tags: typing.Any = None, 
                             taints: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_eks.CfnNodegroup.TaintProperty, aws_cdk..IResolvable]]] = None, 
                             version: builtins.str = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

 scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

 scoped id of the resource.

---

##### `cluster_name`<sup>Required</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.ClusterName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername)

---

##### `node_role`<sup>Required</sup> <a name="node_role"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.NodeRole`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole)

---

##### `subnets`<sup>Required</sup> <a name="subnets"></a>

- *Type:* **typing.List**[`builtins.str`]

`AWS::EKS::Nodegroup.Subnets`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets)

---

##### `ami_type`<sup>Optional</sup> <a name="ami_type"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.AmiType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype)

---

##### `capacity_type`<sup>Optional</sup> <a name="capacity_type"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.CapacityType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype)

---

##### `disk_size`<sup>Optional</sup> <a name="disk_size"></a>

- *Type:* **typing.Union**[`int`, `float`]

`AWS::EKS::Nodegroup.DiskSize`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize)

---

##### `force_update_enabled`<sup>Optional</sup> <a name="force_update_enabled"></a>

- *Type:* **typing.Union**[`builtins.bool`, [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Nodegroup.ForceUpdateEnabled`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled)

---

##### `instance_types`<sup>Optional</sup> <a name="instance_types"></a>

- *Type:* **typing.List**[`builtins.str`]

`AWS::EKS::Nodegroup.InstanceTypes`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes)

---

##### `labels`<sup>Optional</sup> <a name="labels"></a>

- *Type:* `typing.Any`

`AWS::EKS::Nodegroup.Labels`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels)

---

##### `launch_template`<sup>Optional</sup> <a name="launch_template"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty`](#aws-cdk-lib.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Nodegroup.LaunchTemplate`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate)

---

##### `nodegroup_name`<sup>Optional</sup> <a name="nodegroup_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.NodegroupName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname)

---

##### `release_version`<sup>Optional</sup> <a name="release_version"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.ReleaseVersion`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion)

---

##### `remote_access`<sup>Optional</sup> <a name="remote_access"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnNodegroup.RemoteAccessProperty`](#aws-cdk-lib.aws_eks.CfnNodegroup.RemoteAccessProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Nodegroup.RemoteAccess`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess)

---

##### `scaling_config`<sup>Optional</sup> <a name="scaling_config"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnNodegroup.ScalingConfigProperty`](#aws-cdk-lib.aws_eks.CfnNodegroup.ScalingConfigProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Nodegroup.ScalingConfig`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* `typing.Any`

`AWS::EKS::Nodegroup.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags)

---

##### `taints`<sup>Optional</sup> <a name="taints"></a>

- *Type:* **typing.Union**[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable), **typing.List**[**typing.Union**[[`aws_cdk.aws_eks.CfnNodegroup.TaintProperty`](#aws-cdk-lib.aws_eks.CfnNodegroup.TaintProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`AWS::EKS::Nodegroup.Taints`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-taints](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-taints)

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.Version`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version)

---

#### Methods <a name="Methods"></a>

##### `inspect` <a name="inspect"></a>

```python
def inspect(inspector: aws_cdk..TreeInspector)
```

###### `inspector`<sup>Required</sup> <a name="inspector"></a>

- *Type:* [`aws_cdk..TreeInspector`](#aws-cdk-lib.TreeInspector)

 tree inspector to collect and process attributes.

---


#### Constants <a name="Constants"></a>

##### `CFN_RESOURCE_TYPE_NAME` <a name="CFN_RESOURCE_TYPE_NAME"></a>

- *Type:* `builtins.str`

The CloudFormation resource type name for this resource class.

---

### Cluster <a name="aws-cdk-lib.aws_eks.Cluster"></a>

- *Implements:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

A Cluster represents a managed Kubernetes Service (EKS).

This is a fully managed cluster of API Servers (control-plane)
The user is still required to create the worker nodes.

#### Initializer <a name="aws-cdk-lib.aws_eks.Cluster.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.Cluster(scope: constructs..Construct, 
                        id: builtins.str, 
                        version: aws_cdk.aws_eks.KubernetesVersion, 
                        cluster_name: builtins.str = None, 
                        output_cluster_name: builtins.bool = None, 
                        output_config_command: builtins.bool = None, 
                        role: aws_cdk.aws_iam.IRole = None, 
                        security_group: aws_cdk.aws_ec2.ISecurityGroup = None, 
                        vpc: aws_cdk.aws_ec2.IVpc = None, 
                        vpc_subnets: typing.List[aws_cdk.aws_ec2.SubnetSelection] = None, 
                        cluster_handler_environment: typing.Mapping[#builtins.str] = None, 
                        core_dns_compute_type: aws_cdk.aws_eks.CoreDnsComputeType = None, 
                        endpoint_access: aws_cdk.aws_eks.EndpointAccess = None, 
                        kubectl_environment: typing.Mapping[#builtins.str] = None, 
                        kubectl_layer: aws_cdk.aws_lambda.ILayerVersion = None, 
                        kubectl_memory: aws_cdk..Size = None, 
                        masters_role: aws_cdk.aws_iam.IRole = None, 
                        output_masters_role_arn: builtins.bool = None, 
                        place_cluster_handler_in_vpc: builtins.bool = None, 
                        prune: builtins.bool = None, 
                        secrets_encryption_key: aws_cdk.aws_kms.IKey = None, 
                        default_capacity: typing.Union[int, float] = None, 
                        default_capacity_instance: aws_cdk.aws_ec2.InstanceType = None, 
                        default_capacity_type: aws_cdk.aws_eks.DefaultCapacityType = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

a Construct, most likely a cdk.Stack created.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

the id of the Construct to create.

---

##### `version`<sup>Required</sup> <a name="version"></a>

- *Type:* [`aws_cdk.aws_eks.KubernetesVersion`](#aws-cdk-lib.aws_eks.KubernetesVersion)

The Kubernetes version to run in the cluster.

---

##### `cluster_name`<sup>Optional</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`
- *Default:*  Automatically generated name

Name for the cluster.

---

##### `output_cluster_name`<sup>Optional</sup> <a name="output_cluster_name"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the name of the cluster will be synthesized.

---

##### `output_config_command`<sup>Optional</sup> <a name="output_config_command"></a>

- *Type:* `builtins.bool`
- *Default:* true

Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.

This command will include
the cluster name and, if applicable, the ARN of the masters IAM role.

---

##### `role`<sup>Optional</sup> <a name="role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  A role is automatically created for you

Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.

---

##### `security_group`<sup>Optional</sup> <a name="security_group"></a>

- *Type:* [`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:*  A security group is automatically created

Security Group to use for Control Plane ENIs.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  a VPC with default configuration will be created and can be accessed through `cluster.vpc`.

The VPC in which to create the Cluster.

---

##### `vpc_subnets`<sup>Optional</sup> <a name="vpc_subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)]
- *Default:*  All public and private subnets

Where to place EKS Control Plane ENIs.

If you want to create public load balancers, this must include public subnets.

For example, to only select private subnets, supply the following:

```ts
vpcSubnets: [
   { subnetType: ec2.SubnetType.Private }
]
```

---

##### `cluster_handler_environment`<sup>Optional</sup> <a name="cluster_handler_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.

---

##### `core_dns_compute_type`<sup>Optional</sup> <a name="core_dns_compute_type"></a>

- *Type:* [`aws_cdk.aws_eks.CoreDnsComputeType`](#aws-cdk-lib.aws_eks.CoreDnsComputeType)
- *Default:* CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)

Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS configuration on your cluster to determine which compute type to use for CoreDNS.

---

##### `endpoint_access`<sup>Optional</sup> <a name="endpoint_access"></a>

- *Type:* [`aws_cdk.aws_eks.EndpointAccess`](#aws-cdk-lib.aws_eks.EndpointAccess)
- *Default:* EndpointAccess.PUBLIC_AND_PRIVATE

Configure access to the Kubernetes API server endpoint..

> https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html

---

##### `kubectl_environment`<sup>Optional</sup> <a name="kubectl_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Environment variables for the kubectl execution.

Only relevant for kubectl enabled clusters.

---

##### `kubectl_layer`<sup>Optional</sup> <a name="kubectl_layer"></a>

- *Type:* [`aws_cdk.aws_lambda.ILayerVersion`](#aws-cdk-lib.aws_lambda.ILayerVersion)
- *Default:*  the layer provided by the `aws-lambda-layer-kubectl` SAR app.

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

By default, the provider will use the layer included in the
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

> https://github.com/aws-samples/aws-lambda-layer-kubectl

---

##### `kubectl_memory`<sup>Optional</sup> <a name="kubectl_memory"></a>

- *Type:* [`aws_cdk..Size`](#aws-cdk-lib.Size)
- *Default:* Size.gibibytes(1)

Amount of memory to allocate to the provider's lambda function.

---

##### `masters_role`<sup>Optional</sup> <a name="masters_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role that assumable by anyone with permissions in the same
account will automatically be defined

An IAM role that will be added to the `system:masters` Kubernetes RBAC group.

> https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings

---

##### `output_masters_role_arn`<sup>Optional</sup> <a name="output_masters_role_arn"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the ARN of the "masters" IAM role will be synthesized (if `mastersRole` is specified).

---

##### `place_cluster_handler_in_vpc`<sup>Optional</sup> <a name="place_cluster_handler_in_vpc"></a>

- *Type:* `builtins.bool`
- *Default:* false

If set to true, the cluster handler functions will be placed in the private subnets of the cluster vpc, subject to the `vpcSubnets` selection strategy.

---

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:* true

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

##### `secrets_encryption_key`<sup>Optional</sup> <a name="secrets_encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)
- *Default:*  By default, Kubernetes stores all secret object data within etcd and
  all etcd volumes used by Amazon EKS are encrypted at the disk-level
  using AWS-Managed encryption keys.

KMS secret for envelope encryption for Kubernetes secrets.

---

##### `default_capacity`<sup>Optional</sup> <a name="default_capacity"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 2

Number of instances to allocate as an initial capacity for this cluster.

Instance type can be configured through `defaultCapacityInstanceType`,
which defaults to `m5.large`.

Use `cluster.addAutoScalingGroupCapacity` to add additional customized capacity. Set this
to `0` is you wish to avoid the initial capacity allocation.

---

##### `default_capacity_instance`<sup>Optional</sup> <a name="default_capacity_instance"></a>

- *Type:* [`aws_cdk.aws_ec2.InstanceType`](#aws-cdk-lib.aws_ec2.InstanceType)
- *Default:* m5.large

The instance type to use for the default capacity.

This will only be taken
into account if `defaultCapacity` is > 0.

---

##### `default_capacity_type`<sup>Optional</sup> <a name="default_capacity_type"></a>

- *Type:* [`aws_cdk.aws_eks.DefaultCapacityType`](#aws-cdk-lib.aws_eks.DefaultCapacityType)
- *Default:* NODEGROUP

The default capacity type for the cluster.

---

#### Methods <a name="Methods"></a>

##### `add_auto_scaling_group_capacity` <a name="add_auto_scaling_group_capacity"></a>

```python
def add_auto_scaling_group_capacity(id: builtins.str, 
                                    allow_all_outbound: builtins.bool = None, 
                                    associate_public_ip_address: builtins.bool = None, 
                                    auto_scaling_group_name: builtins.str = None, 
                                    block_devices: typing.List[aws_cdk.aws_autoscaling.BlockDevice] = None, 
                                    cooldown: aws_cdk..Duration = None, 
                                    desired_capacity: typing.Union[int, float] = None, 
                                    group_metrics: typing.List[aws_cdk.aws_autoscaling.GroupMetrics] = None, 
                                    health_check: aws_cdk.aws_autoscaling.HealthCheck = None, 
                                    ignore_unmodified_size_properties: builtins.bool = None, 
                                    instance_monitoring: aws_cdk.aws_autoscaling.Monitoring = None, 
                                    key_name: builtins.str = None, 
                                    max_capacity: typing.Union[int, float] = None, 
                                    max_instance_lifetime: aws_cdk..Duration = None, 
                                    min_capacity: typing.Union[int, float] = None, 
                                    new_instances_protected_from_scale_in: builtins.bool = None, 
                                    notifications: typing.List[aws_cdk.aws_autoscaling.NotificationConfiguration] = None, 
                                    signals: aws_cdk.aws_autoscaling.Signals = None, 
                                    spot_price: builtins.str = None, 
                                    update_policy: aws_cdk.aws_autoscaling.UpdatePolicy = None, 
                                    vpc_subnets: aws_cdk.aws_ec2.SubnetSelection = None, 
                                    instance_type: aws_cdk.aws_ec2.InstanceType, 
                                    bootstrap_enabled: builtins.bool = None, 
                                    bootstrap_options: aws_cdk.aws_eks.BootstrapOptions = None, 
                                    machine_image_type: aws_cdk.aws_eks.MachineImageType = None, 
                                    map_role: builtins.bool = None, 
                                    spot_interrupt_handler: builtins.bool = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `allow_all_outbound`<sup>Optional</sup> <a name="allow_all_outbound"></a>

- *Type:* `builtins.bool`
- *Default:* true

Whether the instances can initiate connections to anywhere by default.

---

###### `associate_public_ip_address`<sup>Optional</sup> <a name="associate_public_ip_address"></a>

- *Type:* `builtins.bool`
- *Default:*  Use subnet setting.

Whether instances in the Auto Scaling Group should have public IP addresses associated with them.

---

###### `auto_scaling_group_name`<sup>Optional</sup> <a name="auto_scaling_group_name"></a>

- *Type:* `builtins.str`
- *Default:*  Auto generated by CloudFormation

The name of the Auto Scaling group.

This name must be unique per Region per account.

---

###### `block_devices`<sup>Optional</sup> <a name="block_devices"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_autoscaling.BlockDevice`](#aws-cdk-lib.aws_autoscaling.BlockDevice)]
- *Default:*  Uses the block device mapping of the AMI

Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.

Each instance that is launched has an associated root device volume,
either an Amazon EBS volume or an instance store volume.
You can use block device mappings to specify additional EBS volumes or
instance store volumes to attach to an instance when it is launched.

> https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html

---

###### `cooldown`<sup>Optional</sup> <a name="cooldown"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Default scaling cooldown for this AutoScalingGroup.

---

###### `desired_capacity`<sup>Optional</sup> <a name="desired_capacity"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* minCapacity, and leave unchanged during deployment

Initial amount of instances in the fleet.

If this is set to a number, every deployment will reset the amount of
instances to this number. It is recommended to leave this value blank.

> https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-desiredcapacity

---

###### `group_metrics`<sup>Optional</sup> <a name="group_metrics"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_autoscaling.GroupMetrics`](#aws-cdk-lib.aws_autoscaling.GroupMetrics)]
- *Default:*  no group metrics will be reported

Enable monitoring for group metrics, these metrics describe the group rather than any of its instances.

To report all group metrics use `GroupMetrics.all()`
Group metrics are reported in a granularity of 1 minute at no additional charge.

---

###### `health_check`<sup>Optional</sup> <a name="health_check"></a>

- *Type:* [`aws_cdk.aws_autoscaling.HealthCheck`](#aws-cdk-lib.aws_autoscaling.HealthCheck)
- *Default:*  HealthCheck.ec2 with no grace period

Configuration for health checks.

---

###### `ignore_unmodified_size_properties`<sup>Optional</sup> <a name="ignore_unmodified_size_properties"></a>

- *Type:* `builtins.bool`
- *Default:* true

If the ASG has scheduled actions, don't reset unchanged group sizes.

Only used if the ASG has scheduled actions (which may scale your ASG up
or down regardless of cdk deployments). If true, the size of the group
will only be reset if it has been changed in the CDK app. If false, the
sizes will always be changed back to what they were in the CDK app
on deployment.

---

###### `instance_monitoring`<sup>Optional</sup> <a name="instance_monitoring"></a>

- *Type:* [`aws_cdk.aws_autoscaling.Monitoring`](#aws-cdk-lib.aws_autoscaling.Monitoring)
- *Default:*  Monitoring.DETAILED

Controls whether instances in this group are launched with detailed or basic monitoring.

When detailed monitoring is enabled, Amazon CloudWatch generates metrics every minute and your account
is charged a fee. When you disable detailed monitoring, CloudWatch generates metrics every 5 minutes.

> https://docs.aws.amazon.com/autoscaling/latest/userguide/as-instance-monitoring.html#enable-as-instance-metrics

---

###### `key_name`<sup>Optional</sup> <a name="key_name"></a>

- *Type:* `builtins.str`
- *Default:*  No SSH access will be possible.

Name of SSH keypair to grant access to instances.

---

###### `max_capacity`<sup>Optional</sup> <a name="max_capacity"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* desiredCapacity

Maximum number of instances in the fleet.

---

###### `max_instance_lifetime`<sup>Optional</sup> <a name="max_instance_lifetime"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* none

The maximum amount of time that an instance can be in service.

The maximum duration applies
to all current and future instances in the group. As an instance approaches its maximum duration,
it is terminated and replaced, and cannot be used again.

You must specify a value of at least 604,800 seconds (7 days). To clear a previously set value,
leave this property undefined.

> https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html

---

###### `min_capacity`<sup>Optional</sup> <a name="min_capacity"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 1

Minimum number of instances in the fleet.

---

###### `new_instances_protected_from_scale_in`<sup>Optional</sup> <a name="new_instances_protected_from_scale_in"></a>

- *Type:* `builtins.bool`
- *Default:* false

Whether newly-launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in.

By default, Auto Scaling can terminate an instance at any time after launch
when scaling in an Auto Scaling Group, subject to the group's termination
policy. However, you may wish to protect newly-launched instances from
being scaled in if they are going to run critical applications that should
not be prematurely terminated.

This flag must be enabled if the Auto Scaling Group will be associated with
an ECS Capacity Provider with managed termination protection.

---

###### `notifications`<sup>Optional</sup> <a name="notifications"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_autoscaling.NotificationConfiguration`](#aws-cdk-lib.aws_autoscaling.NotificationConfiguration)]
- *Default:*  No fleet change notifications will be sent.

Configure autoscaling group to send notifications about fleet changes to an SNS topic(s).

> https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-notificationconfigurations

---

###### `signals`<sup>Optional</sup> <a name="signals"></a>

- *Type:* [`aws_cdk.aws_autoscaling.Signals`](#aws-cdk-lib.aws_autoscaling.Signals)
- *Default:*  Do not wait for signals

Configure waiting for signals during deployment.

Use this to pause the CloudFormation deployment to wait for the instances
in the AutoScalingGroup to report successful startup during
creation and updates. The UserData script needs to invoke `cfn-signal`
with a success or failure code after it is done setting up the instance.

Without waiting for signals, the CloudFormation deployment will proceed as
soon as the AutoScalingGroup has been created or updated but before the
instances in the group have been started.

For example, to have instances wait for an Elastic Load Balancing health check before
they signal success, add a health-check verification by using the
cfn-init helper script. For an example, see the verify_instance_health
command in the Auto Scaling rolling updates sample template:

https://github.com/awslabs/aws-cloudformation-templates/blob/master/aws/services/AutoScaling/AutoScalingRollingUpdates.yaml

---

###### `spot_price`<sup>Optional</sup> <a name="spot_price"></a>

- *Type:* `builtins.str`
- *Default:* none

The maximum hourly price (in USD) to be paid for any Spot Instance launched to fulfill the request.

Spot Instances are
launched when the price you specify exceeds the current Spot market price.

---

###### `update_policy`<sup>Optional</sup> <a name="update_policy"></a>

- *Type:* [`aws_cdk.aws_autoscaling.UpdatePolicy`](#aws-cdk-lib.aws_autoscaling.UpdatePolicy)
- *Default:*  `UpdatePolicy.rollingUpdate()` if using `init`, `UpdatePolicy.none()` otherwise

What to do when an AutoScalingGroup's instance configuration is changed.

This is applied when any of the settings on the ASG are changed that
affect how the instances should be created (VPC, instance type, startup
scripts, etc.). It indicates how the existing instances should be
replaced with new instances matching the new config. By default, nothing
is done and only new instances are launched with the new config.

---

###### `vpc_subnets`<sup>Optional</sup> <a name="vpc_subnets"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)
- *Default:*  All Private subnets.

Where to place instances within the VPC.

---

###### `instance_type`<sup>Required</sup> <a name="instance_type"></a>

- *Type:* [`aws_cdk.aws_ec2.InstanceType`](#aws-cdk-lib.aws_ec2.InstanceType)

Instance type of the instances to start.

---

###### `bootstrap_enabled`<sup>Optional</sup> <a name="bootstrap_enabled"></a>

- *Type:* `builtins.bool`
- *Default:* true

Configures the EC2 user-data script for instances in this autoscaling group to bootstrap the node (invoke `/etc/eks/bootstrap.sh`) and associate it with the EKS cluster.

If you wish to provide a custom user data script, set this to `false` and
manually invoke `autoscalingGroup.addUserData()`.

---

###### `bootstrap_options`<sup>Optional</sup> <a name="bootstrap_options"></a>

- *Type:* [`aws_cdk.aws_eks.BootstrapOptions`](#aws-cdk-lib.aws_eks.BootstrapOptions)
- *Default:*  none

EKS node bootstrapping options.

---

###### `machine_image_type`<sup>Optional</sup> <a name="machine_image_type"></a>

- *Type:* [`aws_cdk.aws_eks.MachineImageType`](#aws-cdk-lib.aws_eks.MachineImageType)
- *Default:* MachineImageType.AMAZON_LINUX_2

Machine image type.

---

###### `map_role`<sup>Optional</sup> <a name="map_role"></a>

- *Type:* `builtins.bool`
- *Default:*  true if the cluster has kubectl enabled (which is the default).

Will automatically update the aws-auth ConfigMap to map the IAM instance role to RBAC.

This cannot be explicitly set to `true` if the cluster has kubectl disabled.

---

###### `spot_interrupt_handler`<sup>Optional</sup> <a name="spot_interrupt_handler"></a>

- *Type:* `builtins.bool`
- *Default:* true

Installs the AWS spot instance interrupt handler on the cluster if it's not already added.

Only relevant if `spotPrice` is used.

---

##### `add_cdk8s_chart` <a name="add_cdk8s_chart"></a>

```python
def add_cdk8s_chart(id: builtins.str, 
                    chart: constructs..Construct)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

logical id of this chart.

---

###### `chart`<sup>Required</sup> <a name="chart"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

the cdk8s chart.

---

##### `add_fargate_profile` <a name="add_fargate_profile"></a>

```python
def add_fargate_profile(id: builtins.str, 
                        selectors: typing.List[aws_cdk.aws_eks.Selector], 
                        fargate_profile_name: builtins.str = None, 
                        pod_execution_role: aws_cdk.aws_iam.IRole = None, 
                        subnet_selection: aws_cdk.aws_ec2.SubnetSelection = None, 
                        vpc: aws_cdk.aws_ec2.IVpc = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

the id of this profile.

---

###### `selectors`<sup>Required</sup> <a name="selectors"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_eks.Selector`](#aws-cdk-lib.aws_eks.Selector)]

The selectors to match for pods to use this Fargate profile.

Each selector
must have an associated namespace. Optionally, you can also specify labels
for a namespace.

At least one selector is required and you may specify up to five selectors.

---

###### `fargate_profile_name`<sup>Optional</sup> <a name="fargate_profile_name"></a>

- *Type:* `builtins.str`
- *Default:*  generated

The name of the Fargate profile.

---

###### `pod_execution_role`<sup>Optional</sup> <a name="pod_execution_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role will be automatically created

The pod execution role to use for pods that match the selectors in the Fargate profile.

The pod execution role allows Fargate infrastructure to
register with your cluster as a node, and it provides read access to Amazon
ECR image repositories.

> https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html

---

###### `subnet_selection`<sup>Optional</sup> <a name="subnet_selection"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)
- *Default:*  all private subnets of the VPC are selected.

Select which subnets to launch your pods into.

At this time, pods running
on Fargate are not assigned public IP addresses, so only private subnets
(with no direct route to an Internet Gateway) are allowed.

---

###### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  all private subnets used by theEKS cluster

The VPC from which to select subnets to launch your pods into.

By default, all private subnets are selected. You can customize this using
`subnetSelection`.

---

##### `add_helm_chart` <a name="add_helm_chart"></a>

```python
def add_helm_chart(id: builtins.str, 
                   chart: builtins.str, 
                   create_namespace: builtins.bool = None, 
                   namespace: builtins.str = None, 
                   release: builtins.str = None, 
                   repository: builtins.str = None, 
                   timeout: aws_cdk..Duration = None, 
                   values: typing.Mapping[#typing.Any] = None, 
                   version: builtins.str = None, 
                   wait: builtins.bool = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

logical id of this chart.

---

###### `chart`<sup>Required</sup> <a name="chart"></a>

- *Type:* `builtins.str`

The name of the chart.

---

###### `create_namespace`<sup>Optional</sup> <a name="create_namespace"></a>

- *Type:* `builtins.bool`
- *Default:* true

create namespace if not exist.

---

###### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* default

The Kubernetes namespace scope of the requests.

---

###### `release`<sup>Optional</sup> <a name="release"></a>

- *Type:* `builtins.str`
- *Default:*  If no release name is given, it will use the last 53 characters of the node's unique id.

The name of the release.

---

###### `repository`<sup>Optional</sup> <a name="repository"></a>

- *Type:* `builtins.str`
- *Default:*  No repository will be used, which means that the chart needs to be an absolute URL.

The repository which contains the chart.

For example: https://kubernetes-charts.storage.googleapis.com/

---

###### `timeout`<sup>Optional</sup> <a name="timeout"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Amount of time to wait for any individual Kubernetes operation.

Maximum 15 minutes.

---

###### `values`<sup>Optional</sup> <a name="values"></a>

- *Type:* **typing.Mapping**[`typing.Any`]
- *Default:*  No values are provided to the chart.

The values to be used by the chart.

---

###### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`
- *Default:*  If this is not specified, the latest version is installed

The chart version to install.

---

###### `wait`<sup>Optional</sup> <a name="wait"></a>

- *Type:* `builtins.bool`
- *Default:*  Helm will not wait before marking release as successful

Whether or not Helm should wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.

---

##### `add_manifest` <a name="add_manifest"></a>

```python
def add_manifest(id: builtins.str, 
                 manifest: typing.Mapping[#typing.Any])
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

logical id of this manifest.

---

###### `manifest`<sup>Required</sup> <a name="manifest"></a>

- *Type:* **typing.Mapping**[`typing.Any`]

a list of Kubernetes resource specifications.

---

##### `add_nodegroup_capacity` <a name="add_nodegroup_capacity"></a>

```python
def add_nodegroup_capacity(id: builtins.str, 
                           ami_type: aws_cdk.aws_eks.NodegroupAmiType = None, 
                           capacity_type: aws_cdk.aws_eks.CapacityType = None, 
                           desired_size: typing.Union[int, float] = None, 
                           disk_size: typing.Union[int, float] = None, 
                           force_update: builtins.bool = None, 
                           instance_types: typing.List[aws_cdk.aws_ec2.InstanceType] = None, 
                           labels: typing.Mapping[#builtins.str] = None, 
                           launch_template_spec: aws_cdk.aws_eks.LaunchTemplateSpec = None, 
                           max_size: typing.Union[int, float] = None, 
                           min_size: typing.Union[int, float] = None, 
                           nodegroup_name: builtins.str = None, 
                           node_role: aws_cdk.aws_iam.IRole = None, 
                           release_version: builtins.str = None, 
                           remote_access: aws_cdk.aws_eks.NodegroupRemoteAccess = None, 
                           subnets: aws_cdk.aws_ec2.SubnetSelection = None, 
                           tags: typing.Mapping[#builtins.str] = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

The ID of the nodegroup.

---

###### `ami_type`<sup>Optional</sup> <a name="ami_type"></a>

- *Type:* [`aws_cdk.aws_eks.NodegroupAmiType`](#aws-cdk-lib.aws_eks.NodegroupAmiType)
- *Default:*  auto-determined from the instanceTypes property.

The AMI type for your node group.

---

###### `capacity_type`<sup>Optional</sup> <a name="capacity_type"></a>

- *Type:* [`aws_cdk.aws_eks.CapacityType`](#aws-cdk-lib.aws_eks.CapacityType)
- *Default:*  ON_DEMAND

The capacity type of the nodegroup.

---

###### `desired_size`<sup>Optional</sup> <a name="desired_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 2

The current number of worker nodes that the managed node group should maintain.

If not specified,
the nodewgroup will initially create `minSize` instances.

---

###### `disk_size`<sup>Optional</sup> <a name="disk_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 20

The root device disk size (in GiB) for your node group instances.

---

###### `force_update`<sup>Optional</sup> <a name="force_update"></a>

- *Type:* `builtins.bool`
- *Default:* true

Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue.

If an update fails because pods could not be drained, you can force the update after it fails to terminate the old
node whether or not any pods are
running on the node.

---

###### `instance_types`<sup>Optional</sup> <a name="instance_types"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.InstanceType`](#aws-cdk-lib.aws_ec2.InstanceType)]
- *Default:* t3.medium will be used according to the cloudformation document.

The instance types to use for your node group.

> - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes

---

###### `labels`<sup>Optional</sup> <a name="labels"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  None

The Kubernetes labels to be applied to the nodes in the node group when they are created.

---

###### `launch_template_spec`<sup>Optional</sup> <a name="launch_template_spec"></a>

- *Type:* [`aws_cdk.aws_eks.LaunchTemplateSpec`](#aws-cdk-lib.aws_eks.LaunchTemplateSpec)
- *Default:*  no launch template

Launch template specification used for the nodegroup.

> - https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html

---

###### `max_size`<sup>Optional</sup> <a name="max_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:*  desiredSize

The maximum number of worker nodes that the managed node group can scale out to.

Managed node groups can support up to 100 nodes by default.

---

###### `min_size`<sup>Optional</sup> <a name="min_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 1

The minimum number of worker nodes that the managed node group can scale in to.

This number must be greater than zero.

---

###### `nodegroup_name`<sup>Optional</sup> <a name="nodegroup_name"></a>

- *Type:* `builtins.str`
- *Default:*  resource ID

Name of the Nodegroup.

---

###### `node_role`<sup>Optional</sup> <a name="node_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  None. Auto-generated if not specified.

The IAM role to associate with your node group.

The Amazon EKS worker node kubelet daemon
makes calls to AWS APIs on your behalf. Worker nodes receive permissions for these API calls through
an IAM instance profile and associated policies. Before you can launch worker nodes and register them
into a cluster, you must create an IAM role for those worker nodes to use when they are launched.

---

###### `release_version`<sup>Optional</sup> <a name="release_version"></a>

- *Type:* `builtins.str`
- *Default:*  The latest available AMI version for the node group's current Kubernetes version is used.

The AMI version of the Amazon EKS-optimized AMI to use with your node group (for example, `1.14.7-YYYYMMDD`).

---

###### `remote_access`<sup>Optional</sup> <a name="remote_access"></a>

- *Type:* [`aws_cdk.aws_eks.NodegroupRemoteAccess`](#aws-cdk-lib.aws_eks.NodegroupRemoteAccess)
- *Default:*  disabled

The remote access (SSH) configuration to use with your node group.

Disabled by default, however, if you
specify an Amazon EC2 SSH key but do not specify a source security group when you create a managed node group,
then port 22 on the worker nodes is opened to the internet (0.0.0.0/0)

---

###### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)
- *Default:*  private subnets

The subnets to use for the Auto Scaling group that is created for your node group.

By specifying the
SubnetSelection, the selected subnets will automatically apply required tags i.e.
`kubernetes.io/cluster/CLUSTER_NAME` with a value of `shared`, where `CLUSTER_NAME` is replaced with
the name of your cluster.

---

###### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  None

The metadata to apply to the node group to assist with categorization and organization.

Each tag consists of
a key and an optional value, both of which you define. Node group tags do not propagate to any other resources
associated with the node group, such as the Amazon EC2 instances or subnets.

---

##### `add_service_account` <a name="add_service_account"></a>

```python
def add_service_account(id: builtins.str, 
                        name: builtins.str = None, 
                        namespace: builtins.str = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`
- *Default:*  If no name is given, it will use the id of the resource.

The name of the service account.

---

###### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* "default"

The namespace of the service account.

---

##### `connect_auto_scaling_group_capacity` <a name="connect_auto_scaling_group_capacity"></a>

```python
def connect_auto_scaling_group_capacity(auto_scaling_group: aws_cdk.aws_autoscaling.AutoScalingGroup, 
                                        bootstrap_enabled: builtins.bool = None, 
                                        bootstrap_options: aws_cdk.aws_eks.BootstrapOptions = None, 
                                        machine_image_type: aws_cdk.aws_eks.MachineImageType = None, 
                                        map_role: builtins.bool = None, 
                                        spot_interrupt_handler: builtins.bool = None)
```

###### `auto_scaling_group`<sup>Required</sup> <a name="auto_scaling_group"></a>

- *Type:* [`aws_cdk.aws_autoscaling.AutoScalingGroup`](#aws-cdk-lib.aws_autoscaling.AutoScalingGroup)

[disable-awslint:ref-via-interface].

---

###### `bootstrap_enabled`<sup>Optional</sup> <a name="bootstrap_enabled"></a>

- *Type:* `builtins.bool`
- *Default:* true

Configures the EC2 user-data script for instances in this autoscaling group to bootstrap the node (invoke `/etc/eks/bootstrap.sh`) and associate it with the EKS cluster.

If you wish to provide a custom user data script, set this to `false` and
manually invoke `autoscalingGroup.addUserData()`.

---

###### `bootstrap_options`<sup>Optional</sup> <a name="bootstrap_options"></a>

- *Type:* [`aws_cdk.aws_eks.BootstrapOptions`](#aws-cdk-lib.aws_eks.BootstrapOptions)
- *Default:*  default options

Allows options for node bootstrapping through EC2 user data.

---

###### `machine_image_type`<sup>Optional</sup> <a name="machine_image_type"></a>

- *Type:* [`aws_cdk.aws_eks.MachineImageType`](#aws-cdk-lib.aws_eks.MachineImageType)
- *Default:* MachineImageType.AMAZON_LINUX_2

Allow options to specify different machine image type.

---

###### `map_role`<sup>Optional</sup> <a name="map_role"></a>

- *Type:* `builtins.bool`
- *Default:*  true if the cluster has kubectl enabled (which is the default).

Will automatically update the aws-auth ConfigMap to map the IAM instance role to RBAC.

This cannot be explicitly set to `true` if the cluster has kubectl disabled.

---

###### `spot_interrupt_handler`<sup>Optional</sup> <a name="spot_interrupt_handler"></a>

- *Type:* `builtins.bool`
- *Default:* true

Installs the AWS spot instance interrupt handler on the cluster if it's not already added.

Only relevant if `spotPrice` is configured on the auto-scaling group.

---

##### `get_service_load_balancer_address` <a name="get_service_load_balancer_address"></a>

```python
def get_service_load_balancer_address(service_name: builtins.str, 
                                      namespace: builtins.str = None, 
                                      timeout: aws_cdk..Duration = None)
```

###### `service_name`<sup>Required</sup> <a name="service_name"></a>

- *Type:* `builtins.str`

The name of the service.

---

###### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* 'default'

The namespace the service belongs to.

---

###### `timeout`<sup>Optional</sup> <a name="timeout"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Timeout for waiting on the load balancer address.

---

#### Static Functions <a name="Static Functions"></a>

##### `from_cluster_attributes` <a name="from_cluster_attributes"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.Cluster(scope: constructs..Construct, 
                        id: builtins.str, 
                        cluster_name: builtins.str, 
                        cluster_certificate_authority_data: builtins.str = None, 
                        cluster_encryption_config_key_arn: builtins.str = None, 
                        cluster_endpoint: builtins.str = None, 
                        cluster_security_group_id: builtins.str = None, 
                        kubectl_environment: typing.Mapping[#builtins.str] = None, 
                        kubectl_layer: aws_cdk.aws_lambda.ILayerVersion = None, 
                        kubectl_memory: aws_cdk..Size = None, 
                        kubectl_private_subnet_ids: typing.List[builtins.str] = None, 
                        kubectl_role_arn: builtins.str = None, 
                        kubectl_security_group_id: builtins.str = None, 
                        open_id_connect_provider: aws_cdk.aws_iam.IOpenIdConnectProvider = None, 
                        prune: builtins.bool = None, 
                        security_group_ids: typing.List[builtins.str] = None, 
                        vpc: aws_cdk.aws_ec2.IVpc = None)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

the construct scope, in most cases 'this'.

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

the id or name to import as.

---

###### `cluster_name`<sup>Required</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`

The physical name of the Cluster.

---

###### `cluster_certificate_authority_data`<sup>Optional</sup> <a name="cluster_certificate_authority_data"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified `cluster.clusterCertificateAuthorityData` will
throw an error

The certificate-authority-data for your cluster.

---

###### `cluster_encryption_config_key_arn`<sup>Optional</sup> <a name="cluster_encryption_config_key_arn"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified `cluster.clusterEncryptionConfigKeyArn` will
throw an error

Amazon Resource Name (ARN) or alias of the customer master key (CMK).

---

###### `cluster_endpoint`<sup>Optional</sup> <a name="cluster_endpoint"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified `cluster.clusterEndpoint` will throw an error.

The API Server endpoint URL.

---

###### `cluster_security_group_id`<sup>Optional</sup> <a name="cluster_security_group_id"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified `cluster.clusterSecurityGroupId` will throw an
error

The cluster security group that was created by Amazon EKS for the cluster.

---

###### `kubectl_environment`<sup>Optional</sup> <a name="kubectl_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  no additional variables

Environment variables to use when running `kubectl` against this cluster.

---

###### `kubectl_layer`<sup>Optional</sup> <a name="kubectl_layer"></a>

- *Type:* [`aws_cdk.aws_lambda.ILayerVersion`](#aws-cdk-lib.aws_lambda.ILayerVersion)
- *Default:*  a layer bundled with this module.

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

This layer
is used by the kubectl handler to apply manifests and install helm charts.

The handler expects the layer to include the following executables:

    helm/helm
    kubectl/kubectl
    awscli/aws

---

###### `kubectl_memory`<sup>Optional</sup> <a name="kubectl_memory"></a>

- *Type:* [`aws_cdk..Size`](#aws-cdk-lib.Size)
- *Default:* Size.gibibytes(1)

Amount of memory to allocate to the provider's lambda function.

---

###### `kubectl_private_subnet_ids`<sup>Optional</sup> <a name="kubectl_private_subnet_ids"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:*  k8s endpoint is expected to be accessible publicly

Subnets to host the `kubectl` compute resources.

If not specified, the k8s
endpoint is expected to be accessible publicly.

---

###### `kubectl_role_arn`<sup>Optional</sup> <a name="kubectl_role_arn"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified, it not be possible to issue `kubectl` commands
against an imported cluster.

An IAM role with cluster administrator and "system:masters" permissions.

---

###### `kubectl_security_group_id`<sup>Optional</sup> <a name="kubectl_security_group_id"></a>

- *Type:* `builtins.str`
- *Default:*  k8s endpoint is expected to be accessible publicly

A security group to use for `kubectl` execution.

If not specified, the k8s
endpoint is expected to be accessible publicly.

---

###### `open_id_connect_provider`<sup>Optional</sup> <a name="open_id_connect_provider"></a>

- *Type:* [`aws_cdk.aws_iam.IOpenIdConnectProvider`](#aws-cdk-lib.aws_iam.IOpenIdConnectProvider)
- *Default:*  if not specified `cluster.openIdConnectProvider` and `cluster.addServiceAccount` will throw an error.

An Open ID Connect provider for this cluster that can be used to configure service accounts.

You can either import an existing provider using `iam.OpenIdConnectProvider.fromProviderArn`,
or create a new provider using `new eks.OpenIdConnectProvider`

---

###### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:* true

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

###### `security_group_ids`<sup>Optional</sup> <a name="security_group_ids"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:*  if not specified, no additional security groups will be
considered in `cluster.connections`.

Additional security groups associated with this cluster.

---

###### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  if not specified `cluster.vpc` will throw an error

The VPC in which this Cluster was created.

---


### FargateCluster <a name="aws-cdk-lib.aws_eks.FargateCluster"></a>

Defines an EKS cluster that runs entirely on AWS Fargate.

The cluster is created with a default Fargate Profile that matches the
"default" and "kube-system" namespaces. You can add additional profiles using
`addFargateProfile`.

#### Initializer <a name="aws-cdk-lib.aws_eks.FargateCluster.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.FargateCluster(scope: constructs..Construct, 
                               id: builtins.str, 
                               version: aws_cdk.aws_eks.KubernetesVersion, 
                               cluster_name: builtins.str = None, 
                               output_cluster_name: builtins.bool = None, 
                               output_config_command: builtins.bool = None, 
                               role: aws_cdk.aws_iam.IRole = None, 
                               security_group: aws_cdk.aws_ec2.ISecurityGroup = None, 
                               vpc: aws_cdk.aws_ec2.IVpc = None, 
                               vpc_subnets: typing.List[aws_cdk.aws_ec2.SubnetSelection] = None, 
                               cluster_handler_environment: typing.Mapping[#builtins.str] = None, 
                               core_dns_compute_type: aws_cdk.aws_eks.CoreDnsComputeType = None, 
                               endpoint_access: aws_cdk.aws_eks.EndpointAccess = None, 
                               kubectl_environment: typing.Mapping[#builtins.str] = None, 
                               kubectl_layer: aws_cdk.aws_lambda.ILayerVersion = None, 
                               kubectl_memory: aws_cdk..Size = None, 
                               masters_role: aws_cdk.aws_iam.IRole = None, 
                               output_masters_role_arn: builtins.bool = None, 
                               place_cluster_handler_in_vpc: builtins.bool = None, 
                               prune: builtins.bool = None, 
                               secrets_encryption_key: aws_cdk.aws_kms.IKey = None, 
                               default_profile: aws_cdk.aws_eks.FargateProfileOptions = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `version`<sup>Required</sup> <a name="version"></a>

- *Type:* [`aws_cdk.aws_eks.KubernetesVersion`](#aws-cdk-lib.aws_eks.KubernetesVersion)

The Kubernetes version to run in the cluster.

---

##### `cluster_name`<sup>Optional</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`
- *Default:*  Automatically generated name

Name for the cluster.

---

##### `output_cluster_name`<sup>Optional</sup> <a name="output_cluster_name"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the name of the cluster will be synthesized.

---

##### `output_config_command`<sup>Optional</sup> <a name="output_config_command"></a>

- *Type:* `builtins.bool`
- *Default:* true

Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.

This command will include
the cluster name and, if applicable, the ARN of the masters IAM role.

---

##### `role`<sup>Optional</sup> <a name="role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  A role is automatically created for you

Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.

---

##### `security_group`<sup>Optional</sup> <a name="security_group"></a>

- *Type:* [`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:*  A security group is automatically created

Security Group to use for Control Plane ENIs.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  a VPC with default configuration will be created and can be accessed through `cluster.vpc`.

The VPC in which to create the Cluster.

---

##### `vpc_subnets`<sup>Optional</sup> <a name="vpc_subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)]
- *Default:*  All public and private subnets

Where to place EKS Control Plane ENIs.

If you want to create public load balancers, this must include public subnets.

For example, to only select private subnets, supply the following:

```ts
vpcSubnets: [
   { subnetType: ec2.SubnetType.Private }
]
```

---

##### `cluster_handler_environment`<sup>Optional</sup> <a name="cluster_handler_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.

---

##### `core_dns_compute_type`<sup>Optional</sup> <a name="core_dns_compute_type"></a>

- *Type:* [`aws_cdk.aws_eks.CoreDnsComputeType`](#aws-cdk-lib.aws_eks.CoreDnsComputeType)
- *Default:* CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)

Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS configuration on your cluster to determine which compute type to use for CoreDNS.

---

##### `endpoint_access`<sup>Optional</sup> <a name="endpoint_access"></a>

- *Type:* [`aws_cdk.aws_eks.EndpointAccess`](#aws-cdk-lib.aws_eks.EndpointAccess)
- *Default:* EndpointAccess.PUBLIC_AND_PRIVATE

Configure access to the Kubernetes API server endpoint..

> https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html

---

##### `kubectl_environment`<sup>Optional</sup> <a name="kubectl_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Environment variables for the kubectl execution.

Only relevant for kubectl enabled clusters.

---

##### `kubectl_layer`<sup>Optional</sup> <a name="kubectl_layer"></a>

- *Type:* [`aws_cdk.aws_lambda.ILayerVersion`](#aws-cdk-lib.aws_lambda.ILayerVersion)
- *Default:*  the layer provided by the `aws-lambda-layer-kubectl` SAR app.

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

By default, the provider will use the layer included in the
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

> https://github.com/aws-samples/aws-lambda-layer-kubectl

---

##### `kubectl_memory`<sup>Optional</sup> <a name="kubectl_memory"></a>

- *Type:* [`aws_cdk..Size`](#aws-cdk-lib.Size)
- *Default:* Size.gibibytes(1)

Amount of memory to allocate to the provider's lambda function.

---

##### `masters_role`<sup>Optional</sup> <a name="masters_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role that assumable by anyone with permissions in the same
account will automatically be defined

An IAM role that will be added to the `system:masters` Kubernetes RBAC group.

> https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings

---

##### `output_masters_role_arn`<sup>Optional</sup> <a name="output_masters_role_arn"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the ARN of the "masters" IAM role will be synthesized (if `mastersRole` is specified).

---

##### `place_cluster_handler_in_vpc`<sup>Optional</sup> <a name="place_cluster_handler_in_vpc"></a>

- *Type:* `builtins.bool`
- *Default:* false

If set to true, the cluster handler functions will be placed in the private subnets of the cluster vpc, subject to the `vpcSubnets` selection strategy.

---

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:* true

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

##### `secrets_encryption_key`<sup>Optional</sup> <a name="secrets_encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)
- *Default:*  By default, Kubernetes stores all secret object data within etcd and
  all etcd volumes used by Amazon EKS are encrypted at the disk-level
  using AWS-Managed encryption keys.

KMS secret for envelope encryption for Kubernetes secrets.

---

##### `default_profile`<sup>Optional</sup> <a name="default_profile"></a>

- *Type:* [`aws_cdk.aws_eks.FargateProfileOptions`](#aws-cdk-lib.aws_eks.FargateProfileOptions)
- *Default:*  A profile called "default" with 'default' and 'kube-system'
  selectors will be created if this is left undefined.

Fargate Profile to create along with the cluster.

---




### FargateProfile <a name="aws-cdk-lib.aws_eks.FargateProfile"></a>

- *Implements:* [`aws_cdk..ITaggable`](#aws-cdk-lib.ITaggable)

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

#### Initializer <a name="aws-cdk-lib.aws_eks.FargateProfile.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.FargateProfile(scope: constructs..Construct, 
                               id: builtins.str, 
                               selectors: typing.List[aws_cdk.aws_eks.Selector], 
                               fargate_profile_name: builtins.str = None, 
                               pod_execution_role: aws_cdk.aws_iam.IRole = None, 
                               subnet_selection: aws_cdk.aws_ec2.SubnetSelection = None, 
                               vpc: aws_cdk.aws_ec2.IVpc = None, 
                               cluster: aws_cdk.aws_eks.Cluster)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `selectors`<sup>Required</sup> <a name="selectors"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_eks.Selector`](#aws-cdk-lib.aws_eks.Selector)]

The selectors to match for pods to use this Fargate profile.

Each selector
must have an associated namespace. Optionally, you can also specify labels
for a namespace.

At least one selector is required and you may specify up to five selectors.

---

##### `fargate_profile_name`<sup>Optional</sup> <a name="fargate_profile_name"></a>

- *Type:* `builtins.str`
- *Default:*  generated

The name of the Fargate profile.

---

##### `pod_execution_role`<sup>Optional</sup> <a name="pod_execution_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role will be automatically created

The pod execution role to use for pods that match the selectors in the Fargate profile.

The pod execution role allows Fargate infrastructure to
register with your cluster as a node, and it provides read access to Amazon
ECR image repositories.

> https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html

---

##### `subnet_selection`<sup>Optional</sup> <a name="subnet_selection"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)
- *Default:*  all private subnets of the VPC are selected.

Select which subnets to launch your pods into.

At this time, pods running
on Fargate are not assigned public IP addresses, so only private subnets
(with no direct route to an Internet Gateway) are allowed.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  all private subnets used by theEKS cluster

The VPC from which to select subnets to launch your pods into.

By default, all private subnets are selected. You can customize this using
`subnetSelection`.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.Cluster`](#aws-cdk-lib.aws_eks.Cluster)

The EKS cluster to apply the Fargate profile to.

[disable-awslint:ref-via-interface]

---




### HelmChart <a name="aws-cdk-lib.aws_eks.HelmChart"></a>

Represents a helm chart within the Kubernetes system.

Applies/deletes the resources using `kubectl` in sync with the resource.

#### Initializer <a name="aws-cdk-lib.aws_eks.HelmChart.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.HelmChart(scope: constructs..Construct, 
                          id: builtins.str, 
                          chart: builtins.str, 
                          create_namespace: builtins.bool = None, 
                          namespace: builtins.str = None, 
                          release: builtins.str = None, 
                          repository: builtins.str = None, 
                          timeout: aws_cdk..Duration = None, 
                          values: typing.Mapping[#typing.Any] = None, 
                          version: builtins.str = None, 
                          wait: builtins.bool = None, 
                          cluster: aws_cdk.aws_eks.ICluster)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `chart`<sup>Required</sup> <a name="chart"></a>

- *Type:* `builtins.str`

The name of the chart.

---

##### `create_namespace`<sup>Optional</sup> <a name="create_namespace"></a>

- *Type:* `builtins.bool`
- *Default:* true

create namespace if not exist.

---

##### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* default

The Kubernetes namespace scope of the requests.

---

##### `release`<sup>Optional</sup> <a name="release"></a>

- *Type:* `builtins.str`
- *Default:*  If no release name is given, it will use the last 53 characters of the node's unique id.

The name of the release.

---

##### `repository`<sup>Optional</sup> <a name="repository"></a>

- *Type:* `builtins.str`
- *Default:*  No repository will be used, which means that the chart needs to be an absolute URL.

The repository which contains the chart.

For example: https://kubernetes-charts.storage.googleapis.com/

---

##### `timeout`<sup>Optional</sup> <a name="timeout"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Amount of time to wait for any individual Kubernetes operation.

Maximum 15 minutes.

---

##### `values`<sup>Optional</sup> <a name="values"></a>

- *Type:* **typing.Mapping**[`typing.Any`]
- *Default:*  No values are provided to the chart.

The values to be used by the chart.

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`
- *Default:*  If this is not specified, the latest version is installed

The chart version to install.

---

##### `wait`<sup>Optional</sup> <a name="wait"></a>

- *Type:* `builtins.bool`
- *Default:*  Helm will not wait before marking release as successful

Whether or not Helm should wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The EKS cluster to apply this configuration to.

[disable-awslint:ref-via-interface]

---



#### Constants <a name="Constants"></a>

##### `RESOURCE_TYPE` <a name="RESOURCE_TYPE"></a>

- *Type:* `builtins.str`

The CloudFormation resource type.

---

### KubernetesManifest <a name="aws-cdk-lib.aws_eks.KubernetesManifest"></a>

Represents a manifest within the Kubernetes system.

Alternatively, you can use `cluster.addManifest(resource[, resource, ...])`
to define resources on this cluster.

Applies/deletes the manifest using `kubectl`.

#### Initializer <a name="aws-cdk-lib.aws_eks.KubernetesManifest.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesManifest(scope: constructs..Construct, 
                                   id: builtins.str, 
                                   prune: builtins.bool = None, 
                                   skip_validation: builtins.bool = None, 
                                   cluster: aws_cdk.aws_eks.ICluster, 
                                   manifest: typing.List[typing.Mapping[#typing.Any]], 
                                   overwrite: builtins.bool = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:*  based on the prune option of the cluster, which is `true` unless
otherwise specified.

When a resource is removed from a Kubernetes manifest, it no longer appears in the manifest, and there is no way to know that this resource needs to be deleted.

To address this, `kubectl apply` has a `--prune` option which will
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

> https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune-l-your-label

---

##### `skip_validation`<sup>Optional</sup> <a name="skip_validation"></a>

- *Type:* `builtins.bool`
- *Default:* false

A flag to signify if the manifest validation should be skipped.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The EKS cluster to apply this manifest to.

[disable-awslint:ref-via-interface]

---

##### `manifest`<sup>Required</sup> <a name="manifest"></a>

- *Type:* **typing.List**[**typing.Mapping**[`typing.Any`]]

The manifest to apply.

Consists of any number of child resources.

When the resources are created/updated, this manifest will be applied to the
cluster through `kubectl apply` and when the resources or the stack is
deleted, the resources in the manifest will be deleted through `kubectl delete`.

---

##### `overwrite`<sup>Optional</sup> <a name="overwrite"></a>

- *Type:* `builtins.bool`
- *Default:* false

Overwrite any existing resources.

If this is set, we will use `kubectl apply` instead of `kubectl create`
when the resource is created. Otherwise, if there is already a resource
in the cluster with the same name, the operation will fail.

---



#### Constants <a name="Constants"></a>

##### `RESOURCE_TYPE` <a name="RESOURCE_TYPE"></a>

- *Type:* `builtins.str`

The CloudFormation reosurce type.

---

### KubernetesObjectValue <a name="aws-cdk-lib.aws_eks.KubernetesObjectValue"></a>

Represents a value of a specific object deployed in the cluster.

Use this to fetch any information available by the `kubectl get` command.

#### Initializer <a name="aws-cdk-lib.aws_eks.KubernetesObjectValue.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesObjectValue(scope: constructs..Construct, 
                                      id: builtins.str, 
                                      cluster: aws_cdk.aws_eks.ICluster, 
                                      json_path: builtins.str, 
                                      object_name: builtins.str, 
                                      object_type: builtins.str, 
                                      object_namespace: builtins.str = None, 
                                      timeout: aws_cdk..Duration = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The EKS cluster to fetch attributes from.

[disable-awslint:ref-via-interface]

---

##### `json_path`<sup>Required</sup> <a name="json_path"></a>

- *Type:* `builtins.str`

JSONPath to the specific value.

> https://kubernetes.io/docs/reference/kubectl/jsonpath/

---

##### `object_name`<sup>Required</sup> <a name="object_name"></a>

- *Type:* `builtins.str`

The name of the object to query.

---

##### `object_type`<sup>Required</sup> <a name="object_type"></a>

- *Type:* `builtins.str`

The object type to query.

(e.g 'service', 'pod'...)

---

##### `object_namespace`<sup>Optional</sup> <a name="object_namespace"></a>

- *Type:* `builtins.str`
- *Default:* 'default'

The namespace the object belongs to.

---

##### `timeout`<sup>Optional</sup> <a name="timeout"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Timeout for waiting on a value.

---



#### Constants <a name="Constants"></a>

##### `RESOURCE_TYPE` <a name="RESOURCE_TYPE"></a>

- *Type:* `builtins.str`

The CloudFormation reosurce type.

---

### KubernetesPatch <a name="aws-cdk-lib.aws_eks.KubernetesPatch"></a>

A CloudFormation resource which applies/restores a JSON patch into a Kubernetes resource.

> https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/

#### Initializer <a name="aws-cdk-lib.aws_eks.KubernetesPatch.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesPatch(scope: constructs..Construct, 
                                id: builtins.str, 
                                apply_patch: typing.Mapping[#typing.Any], 
                                cluster: aws_cdk.aws_eks.ICluster, 
                                resource_name: builtins.str, 
                                restore_patch: typing.Mapping[#typing.Any], 
                                patch_type: aws_cdk.aws_eks.PatchType = None, 
                                resource_namespace: builtins.str = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `apply_patch`<sup>Required</sup> <a name="apply_patch"></a>

- *Type:* **typing.Mapping**[`typing.Any`]

The JSON object to pass to `kubectl patch` when the resource is created/updated.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The cluster to apply the patch to.

[disable-awslint:ref-via-interface]

---

##### `resource_name`<sup>Required</sup> <a name="resource_name"></a>

- *Type:* `builtins.str`

The full name of the resource to patch (e.g. `deployment/coredns`).

---

##### `restore_patch`<sup>Required</sup> <a name="restore_patch"></a>

- *Type:* **typing.Mapping**[`typing.Any`]

The JSON object to pass to `kubectl patch` when the resource is removed.

---

##### `patch_type`<sup>Optional</sup> <a name="patch_type"></a>

- *Type:* [`aws_cdk.aws_eks.PatchType`](#aws-cdk-lib.aws_eks.PatchType)
- *Default:* PatchType.STRATEGIC

The patch type to pass to `kubectl patch`.

The default type used by `kubectl patch` is "strategic".

---

##### `resource_namespace`<sup>Optional</sup> <a name="resource_namespace"></a>

- *Type:* `builtins.str`
- *Default:* "default"

The kubernetes API namespace.

---




### Nodegroup <a name="aws-cdk-lib.aws_eks.Nodegroup"></a>

- *Implements:* [`aws_cdk.aws_eks.INodegroup`](#aws-cdk-lib.aws_eks.INodegroup)

The Nodegroup resource class.

#### Initializer <a name="aws-cdk-lib.aws_eks.Nodegroup.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.Nodegroup(scope: constructs..Construct, 
                          id: builtins.str, 
                          ami_type: aws_cdk.aws_eks.NodegroupAmiType = None, 
                          capacity_type: aws_cdk.aws_eks.CapacityType = None, 
                          desired_size: typing.Union[int, float] = None, 
                          disk_size: typing.Union[int, float] = None, 
                          force_update: builtins.bool = None, 
                          instance_types: typing.List[aws_cdk.aws_ec2.InstanceType] = None, 
                          labels: typing.Mapping[#builtins.str] = None, 
                          launch_template_spec: aws_cdk.aws_eks.LaunchTemplateSpec = None, 
                          max_size: typing.Union[int, float] = None, 
                          min_size: typing.Union[int, float] = None, 
                          nodegroup_name: builtins.str = None, 
                          node_role: aws_cdk.aws_iam.IRole = None, 
                          release_version: builtins.str = None, 
                          remote_access: aws_cdk.aws_eks.NodegroupRemoteAccess = None, 
                          subnets: aws_cdk.aws_ec2.SubnetSelection = None, 
                          tags: typing.Mapping[#builtins.str] = None, 
                          cluster: aws_cdk.aws_eks.ICluster)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `ami_type`<sup>Optional</sup> <a name="ami_type"></a>

- *Type:* [`aws_cdk.aws_eks.NodegroupAmiType`](#aws-cdk-lib.aws_eks.NodegroupAmiType)
- *Default:*  auto-determined from the instanceTypes property.

The AMI type for your node group.

---

##### `capacity_type`<sup>Optional</sup> <a name="capacity_type"></a>

- *Type:* [`aws_cdk.aws_eks.CapacityType`](#aws-cdk-lib.aws_eks.CapacityType)
- *Default:*  ON_DEMAND

The capacity type of the nodegroup.

---

##### `desired_size`<sup>Optional</sup> <a name="desired_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 2

The current number of worker nodes that the managed node group should maintain.

If not specified,
the nodewgroup will initially create `minSize` instances.

---

##### `disk_size`<sup>Optional</sup> <a name="disk_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 20

The root device disk size (in GiB) for your node group instances.

---

##### `force_update`<sup>Optional</sup> <a name="force_update"></a>

- *Type:* `builtins.bool`
- *Default:* true

Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue.

If an update fails because pods could not be drained, you can force the update after it fails to terminate the old
node whether or not any pods are
running on the node.

---

##### `instance_types`<sup>Optional</sup> <a name="instance_types"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.InstanceType`](#aws-cdk-lib.aws_ec2.InstanceType)]
- *Default:* t3.medium will be used according to the cloudformation document.

The instance types to use for your node group.

> - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes

---

##### `labels`<sup>Optional</sup> <a name="labels"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  None

The Kubernetes labels to be applied to the nodes in the node group when they are created.

---

##### `launch_template_spec`<sup>Optional</sup> <a name="launch_template_spec"></a>

- *Type:* [`aws_cdk.aws_eks.LaunchTemplateSpec`](#aws-cdk-lib.aws_eks.LaunchTemplateSpec)
- *Default:*  no launch template

Launch template specification used for the nodegroup.

> - https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html

---

##### `max_size`<sup>Optional</sup> <a name="max_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:*  desiredSize

The maximum number of worker nodes that the managed node group can scale out to.

Managed node groups can support up to 100 nodes by default.

---

##### `min_size`<sup>Optional</sup> <a name="min_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 1

The minimum number of worker nodes that the managed node group can scale in to.

This number must be greater than zero.

---

##### `nodegroup_name`<sup>Optional</sup> <a name="nodegroup_name"></a>

- *Type:* `builtins.str`
- *Default:*  resource ID

Name of the Nodegroup.

---

##### `node_role`<sup>Optional</sup> <a name="node_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  None. Auto-generated if not specified.

The IAM role to associate with your node group.

The Amazon EKS worker node kubelet daemon
makes calls to AWS APIs on your behalf. Worker nodes receive permissions for these API calls through
an IAM instance profile and associated policies. Before you can launch worker nodes and register them
into a cluster, you must create an IAM role for those worker nodes to use when they are launched.

---

##### `release_version`<sup>Optional</sup> <a name="release_version"></a>

- *Type:* `builtins.str`
- *Default:*  The latest available AMI version for the node group's current Kubernetes version is used.

The AMI version of the Amazon EKS-optimized AMI to use with your node group (for example, `1.14.7-YYYYMMDD`).

---

##### `remote_access`<sup>Optional</sup> <a name="remote_access"></a>

- *Type:* [`aws_cdk.aws_eks.NodegroupRemoteAccess`](#aws-cdk-lib.aws_eks.NodegroupRemoteAccess)
- *Default:*  disabled

The remote access (SSH) configuration to use with your node group.

Disabled by default, however, if you
specify an Amazon EC2 SSH key but do not specify a source security group when you create a managed node group,
then port 22 on the worker nodes is opened to the internet (0.0.0.0/0)

---

##### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)
- *Default:*  private subnets

The subnets to use for the Auto Scaling group that is created for your node group.

By specifying the
SubnetSelection, the selected subnets will automatically apply required tags i.e.
`kubernetes.io/cluster/CLUSTER_NAME` with a value of `shared`, where `CLUSTER_NAME` is replaced with
the name of your cluster.

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  None

The metadata to apply to the node group to assist with categorization and organization.

Each tag consists of
a key and an optional value, both of which you define. Node group tags do not propagate to any other resources
associated with the node group, such as the Amazon EC2 instances or subnets.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

Cluster resource.

---


#### Static Functions <a name="Static Functions"></a>

##### `from_nodegroup_name` <a name="from_nodegroup_name"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.Nodegroup(scope: constructs..Construct, 
                          id: builtins.str, 
                          nodegroup_name: builtins.str)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `nodegroup_name`<sup>Required</sup> <a name="nodegroup_name"></a>

- *Type:* `builtins.str`

---


### OpenIdConnectProvider <a name="aws-cdk-lib.aws_eks.OpenIdConnectProvider"></a>

IAM OIDC identity providers are entities in IAM that describe an external identity provider (IdP) service that supports the OpenID Connect (OIDC) standard, such as Google or Salesforce.

You use an IAM OIDC identity provider
when you want to establish trust between an OIDC-compatible IdP and your AWS
account.

This implementation has default values for thumbprints and clientIds props
that will be compatible with the eks cluster

> https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html

#### Initializer <a name="aws-cdk-lib.aws_eks.OpenIdConnectProvider.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.OpenIdConnectProvider(scope: constructs..Construct, 
                                      id: builtins.str, 
                                      url: builtins.str)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

The definition scope.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

Construct ID.

---

##### `url`<sup>Required</sup> <a name="url"></a>

- *Type:* `builtins.str`

The URL of the identity provider.

The URL must begin with https:// and
should correspond to the iss claim in the provider's OpenID Connect ID
tokens. Per the OIDC standard, path components are allowed but query
parameters are not. Typically the URL consists of only a hostname, like
https://server.example.org or https://example.com.

You can find your OIDC Issuer URL by:
aws eks describe-cluster --name %cluster_name% --query "cluster.identity.oidc.issuer" --output text

---




### ServiceAccount <a name="aws-cdk-lib.aws_eks.ServiceAccount"></a>

- *Implements:* [`aws_cdk.aws_iam.IPrincipal`](#aws-cdk-lib.aws_iam.IPrincipal)

Service Account.

#### Initializer <a name="aws-cdk-lib.aws_eks.ServiceAccount.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.ServiceAccount(scope: constructs..Construct, 
                               id: builtins.str, 
                               name: builtins.str = None, 
                               namespace: builtins.str = None, 
                               cluster: aws_cdk.aws_eks.ICluster)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`
- *Default:*  If no name is given, it will use the id of the resource.

The name of the service account.

---

##### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* "default"

The namespace of the service account.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The cluster to apply the patch to.

---

#### Methods <a name="Methods"></a>

##### `add_to_principal_policy` <a name="add_to_principal_policy"></a>

```python
def add_to_principal_policy(statement: aws_cdk.aws_iam.PolicyStatement)
```

###### `statement`<sup>Required</sup> <a name="statement"></a>

- *Type:* [`aws_cdk.aws_iam.PolicyStatement`](#aws-cdk-lib.aws_iam.PolicyStatement)

---



## Structs <a name="Structs"></a>

### AutoScalingGroupCapacityOptions <a name="aws-cdk-lib.aws_eks.AutoScalingGroupCapacityOptions"></a>

Options for adding worker nodes.

#### Initializer <a name="aws-cdk-lib.aws_eks.AutoScalingGroupCapacityOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.AutoScalingGroupCapacityOptions(min_capacity: typing.Union[int, float] = None, 
                                                allow_all_outbound: builtins.bool = None, 
                                                auto_scaling_group_name: builtins.str = None, 
                                                block_devices: typing.List[aws_cdk.aws_autoscaling.BlockDevice] = None, 
                                                cooldown: aws_cdk..Duration = None, 
                                                desired_capacity: typing.Union[int, float] = None, 
                                                group_metrics: typing.List[aws_cdk.aws_autoscaling.GroupMetrics] = None, 
                                                health_check: aws_cdk.aws_autoscaling.HealthCheck = None, 
                                                ignore_unmodified_size_properties: builtins.bool = None, 
                                                instance_monitoring: aws_cdk.aws_autoscaling.Monitoring = None, 
                                                key_name: builtins.str = None, 
                                                max_capacity: typing.Union[int, float] = None, 
                                                max_instance_lifetime: aws_cdk..Duration = None, 
                                                associate_public_ip_address: builtins.bool = None, 
                                                new_instances_protected_from_scale_in: builtins.bool = None, 
                                                notifications: typing.List[aws_cdk.aws_autoscaling.NotificationConfiguration] = None, 
                                                signals: aws_cdk.aws_autoscaling.Signals = None, 
                                                spot_price: builtins.str = None, 
                                                update_policy: aws_cdk.aws_autoscaling.UpdatePolicy = None, 
                                                availability_zones: typing.List[builtins.str] = None, 
                                                one_per_az: builtins.bool = None, 
                                                subnet_filters: typing.List[aws_cdk.aws_ec2.SubnetFilter] = None, 
                                                subnet_group_name: builtins.str = None, 
                                                subnets: typing.List[aws_cdk.aws_ec2.ISubnet] = None, 
                                                subnet_type: aws_cdk.aws_ec2.SubnetType = None, 
                                                instance_type: aws_cdk.aws_ec2.InstanceType, 
                                                bootstrap_enabled: builtins.bool = None, 
                                                additional_args: builtins.str = None, 
                                                aws_api_retry_attempts: typing.Union[int, float] = None, 
                                                dns_cluster_ip: builtins.str = None, 
                                                docker_config_json: builtins.str = None, 
                                                enable_docker_bridge: builtins.bool = None, 
                                                kubelet_extra_args: builtins.str = None, 
                                                use_max_pods: builtins.bool = None, 
                                                machine_image_type: aws_cdk.aws_eks.MachineImageType = None, 
                                                map_role: builtins.bool = None, 
                                                spot_interrupt_handler: builtins.bool = None)
```

##### `min_capacity`<sup>Optional</sup> <a name="min_capacity"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 1

Minimum number of instances in the fleet.

---

##### `allow_all_outbound`<sup>Optional</sup> <a name="allow_all_outbound"></a>

- *Type:* `builtins.bool`
- *Default:* true

Whether the instances can initiate connections to anywhere by default.

---

##### `auto_scaling_group_name`<sup>Optional</sup> <a name="auto_scaling_group_name"></a>

- *Type:* `builtins.str`
- *Default:*  Auto generated by CloudFormation

The name of the Auto Scaling group.

This name must be unique per Region per account.

---

##### `block_devices`<sup>Optional</sup> <a name="block_devices"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_autoscaling.BlockDevice`](#aws-cdk-lib.aws_autoscaling.BlockDevice)]
- *Default:*  Uses the block device mapping of the AMI

Specifies how block devices are exposed to the instance. You can specify virtual devices and EBS volumes.

Each instance that is launched has an associated root device volume,
either an Amazon EBS volume or an instance store volume.
You can use block device mappings to specify additional EBS volumes or
instance store volumes to attach to an instance when it is launched.

> https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/block-device-mapping-concepts.html

---

##### `cooldown`<sup>Optional</sup> <a name="cooldown"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Default scaling cooldown for this AutoScalingGroup.

---

##### `desired_capacity`<sup>Optional</sup> <a name="desired_capacity"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* minCapacity, and leave unchanged during deployment

Initial amount of instances in the fleet.

If this is set to a number, every deployment will reset the amount of
instances to this number. It is recommended to leave this value blank.

> https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-desiredcapacity

---

##### `group_metrics`<sup>Optional</sup> <a name="group_metrics"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_autoscaling.GroupMetrics`](#aws-cdk-lib.aws_autoscaling.GroupMetrics)]
- *Default:*  no group metrics will be reported

Enable monitoring for group metrics, these metrics describe the group rather than any of its instances.

To report all group metrics use `GroupMetrics.all()`
Group metrics are reported in a granularity of 1 minute at no additional charge.

---

##### `health_check`<sup>Optional</sup> <a name="health_check"></a>

- *Type:* [`aws_cdk.aws_autoscaling.HealthCheck`](#aws-cdk-lib.aws_autoscaling.HealthCheck)
- *Default:*  HealthCheck.ec2 with no grace period

Configuration for health checks.

---

##### `ignore_unmodified_size_properties`<sup>Optional</sup> <a name="ignore_unmodified_size_properties"></a>

- *Type:* `builtins.bool`
- *Default:* true

If the ASG has scheduled actions, don't reset unchanged group sizes.

Only used if the ASG has scheduled actions (which may scale your ASG up
or down regardless of cdk deployments). If true, the size of the group
will only be reset if it has been changed in the CDK app. If false, the
sizes will always be changed back to what they were in the CDK app
on deployment.

---

##### `instance_monitoring`<sup>Optional</sup> <a name="instance_monitoring"></a>

- *Type:* [`aws_cdk.aws_autoscaling.Monitoring`](#aws-cdk-lib.aws_autoscaling.Monitoring)
- *Default:*  Monitoring.DETAILED

Controls whether instances in this group are launched with detailed or basic monitoring.

When detailed monitoring is enabled, Amazon CloudWatch generates metrics every minute and your account
is charged a fee. When you disable detailed monitoring, CloudWatch generates metrics every 5 minutes.

> https://docs.aws.amazon.com/autoscaling/latest/userguide/as-instance-monitoring.html#enable-as-instance-metrics

---

##### `key_name`<sup>Optional</sup> <a name="key_name"></a>

- *Type:* `builtins.str`
- *Default:*  No SSH access will be possible.

Name of SSH keypair to grant access to instances.

---

##### `max_capacity`<sup>Optional</sup> <a name="max_capacity"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* desiredCapacity

Maximum number of instances in the fleet.

---

##### `max_instance_lifetime`<sup>Optional</sup> <a name="max_instance_lifetime"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* none

The maximum amount of time that an instance can be in service.

The maximum duration applies
to all current and future instances in the group. As an instance approaches its maximum duration,
it is terminated and replaced, and cannot be used again.

You must specify a value of at least 604,800 seconds (7 days). To clear a previously set value,
leave this property undefined.

> https://docs.aws.amazon.com/autoscaling/ec2/userguide/asg-max-instance-lifetime.html

---

##### `associate_public_ip_address`<sup>Optional</sup> <a name="associate_public_ip_address"></a>

- *Type:* `builtins.bool`
- *Default:*  Use subnet setting.

Whether instances in the Auto Scaling Group should have public IP addresses associated with them.

---

##### `new_instances_protected_from_scale_in`<sup>Optional</sup> <a name="new_instances_protected_from_scale_in"></a>

- *Type:* `builtins.bool`
- *Default:* false

Whether newly-launched instances are protected from termination by Amazon EC2 Auto Scaling when scaling in.

By default, Auto Scaling can terminate an instance at any time after launch
when scaling in an Auto Scaling Group, subject to the group's termination
policy. However, you may wish to protect newly-launched instances from
being scaled in if they are going to run critical applications that should
not be prematurely terminated.

This flag must be enabled if the Auto Scaling Group will be associated with
an ECS Capacity Provider with managed termination protection.

---

##### `notifications`<sup>Optional</sup> <a name="notifications"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_autoscaling.NotificationConfiguration`](#aws-cdk-lib.aws_autoscaling.NotificationConfiguration)]
- *Default:*  No fleet change notifications will be sent.

Configure autoscaling group to send notifications about fleet changes to an SNS topic(s).

> https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-as-group.html#cfn-as-group-notificationconfigurations

---

##### `signals`<sup>Optional</sup> <a name="signals"></a>

- *Type:* [`aws_cdk.aws_autoscaling.Signals`](#aws-cdk-lib.aws_autoscaling.Signals)
- *Default:*  Do not wait for signals

Configure waiting for signals during deployment.

Use this to pause the CloudFormation deployment to wait for the instances
in the AutoScalingGroup to report successful startup during
creation and updates. The UserData script needs to invoke `cfn-signal`
with a success or failure code after it is done setting up the instance.

Without waiting for signals, the CloudFormation deployment will proceed as
soon as the AutoScalingGroup has been created or updated but before the
instances in the group have been started.

For example, to have instances wait for an Elastic Load Balancing health check before
they signal success, add a health-check verification by using the
cfn-init helper script. For an example, see the verify_instance_health
command in the Auto Scaling rolling updates sample template:

https://github.com/awslabs/aws-cloudformation-templates/blob/master/aws/services/AutoScaling/AutoScalingRollingUpdates.yaml

---

##### `spot_price`<sup>Optional</sup> <a name="spot_price"></a>

- *Type:* `builtins.str`
- *Default:* none

The maximum hourly price (in USD) to be paid for any Spot Instance launched to fulfill the request.

Spot Instances are
launched when the price you specify exceeds the current Spot market price.

---

##### `update_policy`<sup>Optional</sup> <a name="update_policy"></a>

- *Type:* [`aws_cdk.aws_autoscaling.UpdatePolicy`](#aws-cdk-lib.aws_autoscaling.UpdatePolicy)
- *Default:*  `UpdatePolicy.rollingUpdate()` if using `init`, `UpdatePolicy.none()` otherwise

What to do when an AutoScalingGroup's instance configuration is changed.

This is applied when any of the settings on the ASG are changed that
affect how the instances should be created (VPC, instance type, startup
scripts, etc.). It indicates how the existing instances should be
replaced with new instances matching the new config. By default, nothing
is done and only new instances are launched with the new config.

---

##### `availability_zones`<sup>Optional</sup> <a name="availability_zones"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `one_per_az`<sup>Optional</sup> <a name="one_per_az"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnet_filters`<sup>Optional</sup> <a name="subnet_filters"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetFilter`](#aws-cdk-lib.aws_ec2.SubnetFilter)]
- *Default:*  none

List of provided subnet filters.

---

##### `subnet_group_name`<sup>Optional</sup> <a name="subnet_group_name"></a>

- *Type:* `builtins.str`
- *Default:*  Selection by type instead of by name

Select the subnet group with the given name.

Select the subnet group with the given name. This only needs
to be used if you have multiple subnet groups of the same type
and you need to distinguish between them. Otherwise, prefer
`subnetType`.

This field does not select individual subnets, it selects all subnets that
share the given subnet group name. This is the name supplied in
`subnetConfiguration`.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.ISubnet`](#aws-cdk-lib.aws_ec2.ISubnet)]
- *Default:*  Use all subnets in a selected group (all private subnets by default)

Explicitly select individual subnets.

Use this if you don't want to automatically use all subnets in
a group, but have a need to control selection down to
individual subnets.

Cannot be specified together with `subnetType` or `subnetGroupName`.

---

##### `subnet_type`<sup>Optional</sup> <a name="subnet_type"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetType`](#aws-cdk-lib.aws_ec2.SubnetType)
- *Default:* SubnetType.PRIVATE (or ISOLATED or PUBLIC if there are no PRIVATE subnets)

Select all subnets of the given type.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `instance_type`<sup>Required</sup> <a name="instance_type"></a>

- *Type:* [`aws_cdk.aws_ec2.InstanceType`](#aws-cdk-lib.aws_ec2.InstanceType)

Instance type of the instances to start.

---

##### `bootstrap_enabled`<sup>Optional</sup> <a name="bootstrap_enabled"></a>

- *Type:* `builtins.bool`
- *Default:* true

Configures the EC2 user-data script for instances in this autoscaling group to bootstrap the node (invoke `/etc/eks/bootstrap.sh`) and associate it with the EKS cluster.

If you wish to provide a custom user data script, set this to `false` and
manually invoke `autoscalingGroup.addUserData()`.

---

##### `additional_args`<sup>Optional</sup> <a name="additional_args"></a>

- *Type:* `builtins.str`
- *Default:*  none

Additional command line arguments to pass to the `/etc/eks/bootstrap.sh` command.

> https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh

---

##### `aws_api_retry_attempts`<sup>Optional</sup> <a name="aws_api_retry_attempts"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 3

Number of retry attempts for AWS API call (DescribeCluster).

---

##### `dns_cluster_ip`<sup>Optional</sup> <a name="dns_cluster_ip"></a>

- *Type:* `builtins.str`
- *Default:*  10.100.0.10 or 172.20.0.10 based on the IP
address of the primary interface.

Overrides the IP address to use for DNS queries within the cluster.

---

##### `docker_config_json`<sup>Optional</sup> <a name="docker_config_json"></a>

- *Type:* `builtins.str`
- *Default:*  none

The contents of the `/etc/docker/daemon.json` file. Useful if you want a custom config differing from the default one in the EKS AMI.

---

##### `enable_docker_bridge`<sup>Optional</sup> <a name="enable_docker_bridge"></a>

- *Type:* `builtins.bool`
- *Default:* false

Restores the docker default bridge network.

---

##### `kubelet_extra_args`<sup>Optional</sup> <a name="kubelet_extra_args"></a>

- *Type:* `builtins.str`
- *Default:*  none

Extra arguments to add to the kubelet.

Useful for adding labels or taints.

---

##### `use_max_pods`<sup>Optional</sup> <a name="use_max_pods"></a>

- *Type:* `builtins.bool`
- *Default:* true

Sets `--max-pods` for the kubelet based on the capacity of the EC2 instance.

---

##### `machine_image_type`<sup>Optional</sup> <a name="machine_image_type"></a>

- *Type:* [`aws_cdk.aws_eks.MachineImageType`](#aws-cdk-lib.aws_eks.MachineImageType)
- *Default:* MachineImageType.AMAZON_LINUX_2

Machine image type.

---

##### `map_role`<sup>Optional</sup> <a name="map_role"></a>

- *Type:* `builtins.bool`
- *Default:*  true if the cluster has kubectl enabled (which is the default).

Will automatically update the aws-auth ConfigMap to map the IAM instance role to RBAC.

This cannot be explicitly set to `true` if the cluster has kubectl disabled.

---

##### `spot_interrupt_handler`<sup>Optional</sup> <a name="spot_interrupt_handler"></a>

- *Type:* `builtins.bool`
- *Default:* true

Installs the AWS spot instance interrupt handler on the cluster if it's not already added.

Only relevant if `spotPrice` is used.

---

### AutoScalingGroupOptions <a name="aws-cdk-lib.aws_eks.AutoScalingGroupOptions"></a>

Options for adding an AutoScalingGroup as capacity.

#### Initializer <a name="aws-cdk-lib.aws_eks.AutoScalingGroupOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.AutoScalingGroupOptions(bootstrap_enabled: builtins.bool = None, 
                                        additional_args: builtins.str = None, 
                                        aws_api_retry_attempts: typing.Union[int, float] = None, 
                                        dns_cluster_ip: builtins.str = None, 
                                        docker_config_json: builtins.str = None, 
                                        enable_docker_bridge: builtins.bool = None, 
                                        kubelet_extra_args: builtins.str = None, 
                                        use_max_pods: builtins.bool = None, 
                                        machine_image_type: aws_cdk.aws_eks.MachineImageType = None, 
                                        map_role: builtins.bool = None, 
                                        spot_interrupt_handler: builtins.bool = None)
```

##### `bootstrap_enabled`<sup>Optional</sup> <a name="bootstrap_enabled"></a>

- *Type:* `builtins.bool`
- *Default:* true

Configures the EC2 user-data script for instances in this autoscaling group to bootstrap the node (invoke `/etc/eks/bootstrap.sh`) and associate it with the EKS cluster.

If you wish to provide a custom user data script, set this to `false` and
manually invoke `autoscalingGroup.addUserData()`.

---

##### `additional_args`<sup>Optional</sup> <a name="additional_args"></a>

- *Type:* `builtins.str`
- *Default:*  none

Additional command line arguments to pass to the `/etc/eks/bootstrap.sh` command.

> https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh

---

##### `aws_api_retry_attempts`<sup>Optional</sup> <a name="aws_api_retry_attempts"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 3

Number of retry attempts for AWS API call (DescribeCluster).

---

##### `dns_cluster_ip`<sup>Optional</sup> <a name="dns_cluster_ip"></a>

- *Type:* `builtins.str`
- *Default:*  10.100.0.10 or 172.20.0.10 based on the IP
address of the primary interface.

Overrides the IP address to use for DNS queries within the cluster.

---

##### `docker_config_json`<sup>Optional</sup> <a name="docker_config_json"></a>

- *Type:* `builtins.str`
- *Default:*  none

The contents of the `/etc/docker/daemon.json` file. Useful if you want a custom config differing from the default one in the EKS AMI.

---

##### `enable_docker_bridge`<sup>Optional</sup> <a name="enable_docker_bridge"></a>

- *Type:* `builtins.bool`
- *Default:* false

Restores the docker default bridge network.

---

##### `kubelet_extra_args`<sup>Optional</sup> <a name="kubelet_extra_args"></a>

- *Type:* `builtins.str`
- *Default:*  none

Extra arguments to add to the kubelet.

Useful for adding labels or taints.

---

##### `use_max_pods`<sup>Optional</sup> <a name="use_max_pods"></a>

- *Type:* `builtins.bool`
- *Default:* true

Sets `--max-pods` for the kubelet based on the capacity of the EC2 instance.

---

##### `machine_image_type`<sup>Optional</sup> <a name="machine_image_type"></a>

- *Type:* [`aws_cdk.aws_eks.MachineImageType`](#aws-cdk-lib.aws_eks.MachineImageType)
- *Default:* MachineImageType.AMAZON_LINUX_2

Allow options to specify different machine image type.

---

##### `map_role`<sup>Optional</sup> <a name="map_role"></a>

- *Type:* `builtins.bool`
- *Default:*  true if the cluster has kubectl enabled (which is the default).

Will automatically update the aws-auth ConfigMap to map the IAM instance role to RBAC.

This cannot be explicitly set to `true` if the cluster has kubectl disabled.

---

##### `spot_interrupt_handler`<sup>Optional</sup> <a name="spot_interrupt_handler"></a>

- *Type:* `builtins.bool`
- *Default:* true

Installs the AWS spot instance interrupt handler on the cluster if it's not already added.

Only relevant if `spotPrice` is configured on the auto-scaling group.

---

### AwsAuthMapping <a name="aws-cdk-lib.aws_eks.AwsAuthMapping"></a>

AwsAuth mapping.

#### Initializer <a name="aws-cdk-lib.aws_eks.AwsAuthMapping.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.AwsAuthMapping(groups: typing.List[builtins.str], 
                               username: builtins.str = None)
```

##### `groups`<sup>Required</sup> <a name="groups"></a>

- *Type:* **typing.List**[`builtins.str`]

A list of groups within Kubernetes to which the role is mapped.

> https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings

---

##### `username`<sup>Optional</sup> <a name="username"></a>

- *Type:* `builtins.str`
- *Default:*  By default, the user name is the ARN of the IAM role.

The user name within Kubernetes to map to the IAM role.

---

### AwsAuthProps <a name="aws-cdk-lib.aws_eks.AwsAuthProps"></a>

Configuration props for the AwsAuth construct.

#### Initializer <a name="aws-cdk-lib.aws_eks.AwsAuthProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.AwsAuthProps(cluster: aws_cdk.aws_eks.Cluster)
```

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.Cluster`](#aws-cdk-lib.aws_eks.Cluster)

The EKS cluster to apply this configuration to.

[disable-awslint:ref-via-interface]

---

### BootstrapOptions <a name="aws-cdk-lib.aws_eks.BootstrapOptions"></a>

EKS node bootstrapping options.

#### Initializer <a name="aws-cdk-lib.aws_eks.BootstrapOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.BootstrapOptions(additional_args: builtins.str = None, 
                                 aws_api_retry_attempts: typing.Union[int, float] = None, 
                                 dns_cluster_ip: builtins.str = None, 
                                 docker_config_json: builtins.str = None, 
                                 enable_docker_bridge: builtins.bool = None, 
                                 kubelet_extra_args: builtins.str = None, 
                                 use_max_pods: builtins.bool = None)
```

##### `additional_args`<sup>Optional</sup> <a name="additional_args"></a>

- *Type:* `builtins.str`
- *Default:*  none

Additional command line arguments to pass to the `/etc/eks/bootstrap.sh` command.

> https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh

---

##### `aws_api_retry_attempts`<sup>Optional</sup> <a name="aws_api_retry_attempts"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 3

Number of retry attempts for AWS API call (DescribeCluster).

---

##### `dns_cluster_ip`<sup>Optional</sup> <a name="dns_cluster_ip"></a>

- *Type:* `builtins.str`
- *Default:*  10.100.0.10 or 172.20.0.10 based on the IP
address of the primary interface.

Overrides the IP address to use for DNS queries within the cluster.

---

##### `docker_config_json`<sup>Optional</sup> <a name="docker_config_json"></a>

- *Type:* `builtins.str`
- *Default:*  none

The contents of the `/etc/docker/daemon.json` file. Useful if you want a custom config differing from the default one in the EKS AMI.

---

##### `enable_docker_bridge`<sup>Optional</sup> <a name="enable_docker_bridge"></a>

- *Type:* `builtins.bool`
- *Default:* false

Restores the docker default bridge network.

---

##### `kubelet_extra_args`<sup>Optional</sup> <a name="kubelet_extra_args"></a>

- *Type:* `builtins.str`
- *Default:*  none

Extra arguments to add to the kubelet.

Useful for adding labels or taints.

---

##### `use_max_pods`<sup>Optional</sup> <a name="use_max_pods"></a>

- *Type:* `builtins.bool`
- *Default:* true

Sets `--max-pods` for the kubelet based on the capacity of the EC2 instance.

---

### CfnAddonProps <a name="aws-cdk-lib.aws_eks.CfnAddonProps"></a>

Properties for defining a `AWS::EKS::Addon`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnAddonProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnAddonProps(addon_name: builtins.str, 
                              cluster_name: builtins.str, 
                              addon_version: builtins.str = None, 
                              resolve_conflicts: builtins.str = None, 
                              service_account_role_arn: builtins.str = None, 
                              tags: typing.List[aws_cdk..CfnTag] = None)
```

##### `addon_name`<sup>Required</sup> <a name="addon_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.AddonName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname)

---

##### `cluster_name`<sup>Required</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.ClusterName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername)

---

##### `addon_version`<sup>Optional</sup> <a name="addon_version"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.AddonVersion`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion)

---

##### `resolve_conflicts`<sup>Optional</sup> <a name="resolve_conflicts"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.ResolveConflicts`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts)

---

##### `service_account_role_arn`<sup>Optional</sup> <a name="service_account_role_arn"></a>

- *Type:* `builtins.str`

`AWS::EKS::Addon.ServiceAccountRoleArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* **typing.List**[[`aws_cdk..CfnTag`](#aws-cdk-lib.CfnTag)]

`AWS::EKS::Addon.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags)

---

### CfnClusterProps <a name="aws-cdk-lib.aws_eks.CfnClusterProps"></a>

Properties for defining a `AWS::EKS::Cluster`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnClusterProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnClusterProps(resources_vpc_config: typing.Union[aws_cdk.aws_eks.CfnCluster.ResourcesVpcConfigProperty, aws_cdk..IResolvable], 
                                role_arn: builtins.str, 
                                encryption_config: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_eks.CfnCluster.EncryptionConfigProperty, aws_cdk..IResolvable]]] = None, 
                                kubernetes_network_config: typing.Union[aws_cdk.aws_eks.CfnCluster.KubernetesNetworkConfigProperty, aws_cdk..IResolvable] = None, 
                                name: builtins.str = None, 
                                version: builtins.str = None)
```

##### `resources_vpc_config`<sup>Required</sup> <a name="resources_vpc_config"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnCluster.ResourcesVpcConfigProperty`](#aws-cdk-lib.aws_eks.CfnCluster.ResourcesVpcConfigProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Cluster.ResourcesVpcConfig`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig)

---

##### `role_arn`<sup>Required</sup> <a name="role_arn"></a>

- *Type:* `builtins.str`

`AWS::EKS::Cluster.RoleArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn)

---

##### `encryption_config`<sup>Optional</sup> <a name="encryption_config"></a>

- *Type:* **typing.Union**[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable), **typing.List**[**typing.Union**[[`aws_cdk.aws_eks.CfnCluster.EncryptionConfigProperty`](#aws-cdk-lib.aws_eks.CfnCluster.EncryptionConfigProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`AWS::EKS::Cluster.EncryptionConfig`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig)

---

##### `kubernetes_network_config`<sup>Optional</sup> <a name="kubernetes_network_config"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnCluster.KubernetesNetworkConfigProperty`](#aws-cdk-lib.aws_eks.CfnCluster.KubernetesNetworkConfigProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Cluster.KubernetesNetworkConfig`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig)

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Cluster.Name`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name)

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`

`AWS::EKS::Cluster.Version`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version)

---

### CfnFargateProfileProps <a name="aws-cdk-lib.aws_eks.CfnFargateProfileProps"></a>

Properties for defining a `AWS::EKS::FargateProfile`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnFargateProfileProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnFargateProfileProps(cluster_name: builtins.str, 
                                       pod_execution_role_arn: builtins.str, 
                                       selectors: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_eks.CfnFargateProfile.SelectorProperty, aws_cdk..IResolvable]]], 
                                       fargate_profile_name: builtins.str = None, 
                                       subnets: typing.List[builtins.str] = None, 
                                       tags: typing.List[aws_cdk..CfnTag] = None)
```

##### `cluster_name`<sup>Required</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::FargateProfile.ClusterName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername)

---

##### `pod_execution_role_arn`<sup>Required</sup> <a name="pod_execution_role_arn"></a>

- *Type:* `builtins.str`

`AWS::EKS::FargateProfile.PodExecutionRoleArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn)

---

##### `selectors`<sup>Required</sup> <a name="selectors"></a>

- *Type:* **typing.Union**[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable), **typing.List**[**typing.Union**[[`aws_cdk.aws_eks.CfnFargateProfile.SelectorProperty`](#aws-cdk-lib.aws_eks.CfnFargateProfile.SelectorProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`AWS::EKS::FargateProfile.Selectors`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors)

---

##### `fargate_profile_name`<sup>Optional</sup> <a name="fargate_profile_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::FargateProfile.FargateProfileName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename)

---

##### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* **typing.List**[`builtins.str`]

`AWS::EKS::FargateProfile.Subnets`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* **typing.List**[[`aws_cdk..CfnTag`](#aws-cdk-lib.CfnTag)]

`AWS::EKS::FargateProfile.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags)

---

### CfnNodegroupProps <a name="aws-cdk-lib.aws_eks.CfnNodegroupProps"></a>

Properties for defining a `AWS::EKS::Nodegroup`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnNodegroupProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnNodegroupProps(labels: typing.Any = None, 
                                  cluster_name: builtins.str, 
                                  subnets: typing.List[builtins.str], 
                                  node_role: builtins.str, 
                                  nodegroup_name: builtins.str = None, 
                                  capacity_type: builtins.str = None, 
                                  force_update_enabled: typing.Union[builtins.bool, aws_cdk..IResolvable] = None, 
                                  instance_types: typing.List[builtins.str] = None, 
                                  ami_type: builtins.str = None, 
                                  launch_template: typing.Union[aws_cdk.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty, aws_cdk..IResolvable] = None, 
                                  disk_size: typing.Union[int, float] = None, 
                                  release_version: builtins.str = None, 
                                  remote_access: typing.Union[aws_cdk.aws_eks.CfnNodegroup.RemoteAccessProperty, aws_cdk..IResolvable] = None, 
                                  scaling_config: typing.Union[aws_cdk.aws_eks.CfnNodegroup.ScalingConfigProperty, aws_cdk..IResolvable] = None, 
                                  tags: typing.Any = None, 
                                  taints: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_eks.CfnNodegroup.TaintProperty, aws_cdk..IResolvable]]] = None, 
                                  version: builtins.str = None)
```

##### `labels`<sup>Optional</sup> <a name="labels"></a>

- *Type:* `typing.Any`

`AWS::EKS::Nodegroup.Labels`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels)

---

##### `cluster_name`<sup>Required</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.ClusterName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername)

---

##### `subnets`<sup>Required</sup> <a name="subnets"></a>

- *Type:* **typing.List**[`builtins.str`]

`AWS::EKS::Nodegroup.Subnets`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets)

---

##### `node_role`<sup>Required</sup> <a name="node_role"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.NodeRole`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole)

---

##### `nodegroup_name`<sup>Optional</sup> <a name="nodegroup_name"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.NodegroupName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname)

---

##### `capacity_type`<sup>Optional</sup> <a name="capacity_type"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.CapacityType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype)

---

##### `force_update_enabled`<sup>Optional</sup> <a name="force_update_enabled"></a>

- *Type:* **typing.Union**[`builtins.bool`, [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Nodegroup.ForceUpdateEnabled`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled)

---

##### `instance_types`<sup>Optional</sup> <a name="instance_types"></a>

- *Type:* **typing.List**[`builtins.str`]

`AWS::EKS::Nodegroup.InstanceTypes`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes)

---

##### `ami_type`<sup>Optional</sup> <a name="ami_type"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.AmiType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype)

---

##### `launch_template`<sup>Optional</sup> <a name="launch_template"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty`](#aws-cdk-lib.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Nodegroup.LaunchTemplate`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate)

---

##### `disk_size`<sup>Optional</sup> <a name="disk_size"></a>

- *Type:* **typing.Union**[`int`, `float`]

`AWS::EKS::Nodegroup.DiskSize`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize)

---

##### `release_version`<sup>Optional</sup> <a name="release_version"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.ReleaseVersion`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion)

---

##### `remote_access`<sup>Optional</sup> <a name="remote_access"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnNodegroup.RemoteAccessProperty`](#aws-cdk-lib.aws_eks.CfnNodegroup.RemoteAccessProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Nodegroup.RemoteAccess`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess)

---

##### `scaling_config`<sup>Optional</sup> <a name="scaling_config"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnNodegroup.ScalingConfigProperty`](#aws-cdk-lib.aws_eks.CfnNodegroup.ScalingConfigProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::EKS::Nodegroup.ScalingConfig`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* `typing.Any`

`AWS::EKS::Nodegroup.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags)

---

##### `taints`<sup>Optional</sup> <a name="taints"></a>

- *Type:* **typing.Union**[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable), **typing.List**[**typing.Union**[[`aws_cdk.aws_eks.CfnNodegroup.TaintProperty`](#aws-cdk-lib.aws_eks.CfnNodegroup.TaintProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`AWS::EKS::Nodegroup.Taints`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-taints](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-taints)

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`

`AWS::EKS::Nodegroup.Version`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version)

---

### ClusterAttributes <a name="aws-cdk-lib.aws_eks.ClusterAttributes"></a>

Attributes for EKS clusters.

#### Initializer <a name="aws-cdk-lib.aws_eks.ClusterAttributes.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.ClusterAttributes(kubectl_memory: aws_cdk..Size = None, 
                                  cluster_name: builtins.str, 
                                  kubectl_private_subnet_ids: typing.List[builtins.str] = None, 
                                  cluster_encryption_config_key_arn: builtins.str = None, 
                                  cluster_security_group_id: builtins.str = None, 
                                  kubectl_environment: typing.Mapping[#builtins.str] = None, 
                                  kubectl_layer: aws_cdk.aws_lambda.ILayerVersion = None, 
                                  cluster_certificate_authority_data: builtins.str = None, 
                                  cluster_endpoint: builtins.str = None, 
                                  kubectl_role_arn: builtins.str = None, 
                                  kubectl_security_group_id: builtins.str = None, 
                                  open_id_connect_provider: aws_cdk.aws_iam.IOpenIdConnectProvider = None, 
                                  prune: builtins.bool = None, 
                                  security_group_ids: typing.List[builtins.str] = None, 
                                  vpc: aws_cdk.aws_ec2.IVpc = None)
```

##### `kubectl_memory`<sup>Optional</sup> <a name="kubectl_memory"></a>

- *Type:* [`aws_cdk..Size`](#aws-cdk-lib.Size)
- *Default:* Size.gibibytes(1)

Amount of memory to allocate to the provider's lambda function.

---

##### `cluster_name`<sup>Required</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`

The physical name of the Cluster.

---

##### `kubectl_private_subnet_ids`<sup>Optional</sup> <a name="kubectl_private_subnet_ids"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:*  k8s endpoint is expected to be accessible publicly

Subnets to host the `kubectl` compute resources.

If not specified, the k8s
endpoint is expected to be accessible publicly.

---

##### `cluster_encryption_config_key_arn`<sup>Optional</sup> <a name="cluster_encryption_config_key_arn"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified `cluster.clusterEncryptionConfigKeyArn` will
throw an error

Amazon Resource Name (ARN) or alias of the customer master key (CMK).

---

##### `cluster_security_group_id`<sup>Optional</sup> <a name="cluster_security_group_id"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified `cluster.clusterSecurityGroupId` will throw an
error

The cluster security group that was created by Amazon EKS for the cluster.

---

##### `kubectl_environment`<sup>Optional</sup> <a name="kubectl_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  no additional variables

Environment variables to use when running `kubectl` against this cluster.

---

##### `kubectl_layer`<sup>Optional</sup> <a name="kubectl_layer"></a>

- *Type:* [`aws_cdk.aws_lambda.ILayerVersion`](#aws-cdk-lib.aws_lambda.ILayerVersion)
- *Default:*  a layer bundled with this module.

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

This layer
is used by the kubectl handler to apply manifests and install helm charts.

The handler expects the layer to include the following executables:

    helm/helm
    kubectl/kubectl
    awscli/aws

---

##### `cluster_certificate_authority_data`<sup>Optional</sup> <a name="cluster_certificate_authority_data"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified `cluster.clusterCertificateAuthorityData` will
throw an error

The certificate-authority-data for your cluster.

---

##### `cluster_endpoint`<sup>Optional</sup> <a name="cluster_endpoint"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified `cluster.clusterEndpoint` will throw an error.

The API Server endpoint URL.

---

##### `kubectl_role_arn`<sup>Optional</sup> <a name="kubectl_role_arn"></a>

- *Type:* `builtins.str`
- *Default:*  if not specified, it not be possible to issue `kubectl` commands
against an imported cluster.

An IAM role with cluster administrator and "system:masters" permissions.

---

##### `kubectl_security_group_id`<sup>Optional</sup> <a name="kubectl_security_group_id"></a>

- *Type:* `builtins.str`
- *Default:*  k8s endpoint is expected to be accessible publicly

A security group to use for `kubectl` execution.

If not specified, the k8s
endpoint is expected to be accessible publicly.

---

##### `open_id_connect_provider`<sup>Optional</sup> <a name="open_id_connect_provider"></a>

- *Type:* [`aws_cdk.aws_iam.IOpenIdConnectProvider`](#aws-cdk-lib.aws_iam.IOpenIdConnectProvider)
- *Default:*  if not specified `cluster.openIdConnectProvider` and `cluster.addServiceAccount` will throw an error.

An Open ID Connect provider for this cluster that can be used to configure service accounts.

You can either import an existing provider using `iam.OpenIdConnectProvider.fromProviderArn`,
or create a new provider using `new eks.OpenIdConnectProvider`

---

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:* true

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

##### `security_group_ids`<sup>Optional</sup> <a name="security_group_ids"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:*  if not specified, no additional security groups will be
considered in `cluster.connections`.

Additional security groups associated with this cluster.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  if not specified `cluster.vpc` will throw an error

The VPC in which this Cluster was created.

---

### ClusterOptions <a name="aws-cdk-lib.aws_eks.ClusterOptions"></a>

Options for EKS clusters.

#### Initializer <a name="aws-cdk-lib.aws_eks.ClusterOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.ClusterOptions(core_dns_compute_type: aws_cdk.aws_eks.CoreDnsComputeType = None, 
                               version: aws_cdk.aws_eks.KubernetesVersion, 
                               endpoint_access: aws_cdk.aws_eks.EndpointAccess = None, 
                               output_cluster_name: builtins.bool = None, 
                               role: aws_cdk.aws_iam.IRole = None, 
                               security_group: aws_cdk.aws_ec2.ISecurityGroup = None, 
                               vpc: aws_cdk.aws_ec2.IVpc = None, 
                               vpc_subnets: typing.List[aws_cdk.aws_ec2.SubnetSelection] = None, 
                               cluster_handler_environment: typing.Mapping[#builtins.str] = None, 
                               cluster_name: builtins.str = None, 
                               output_config_command: builtins.bool = None, 
                               kubectl_environment: typing.Mapping[#builtins.str] = None, 
                               kubectl_layer: aws_cdk.aws_lambda.ILayerVersion = None, 
                               kubectl_memory: aws_cdk..Size = None, 
                               masters_role: aws_cdk.aws_iam.IRole = None, 
                               output_masters_role_arn: builtins.bool = None, 
                               place_cluster_handler_in_vpc: builtins.bool = None, 
                               prune: builtins.bool = None, 
                               secrets_encryption_key: aws_cdk.aws_kms.IKey = None)
```

##### `core_dns_compute_type`<sup>Optional</sup> <a name="core_dns_compute_type"></a>

- *Type:* [`aws_cdk.aws_eks.CoreDnsComputeType`](#aws-cdk-lib.aws_eks.CoreDnsComputeType)
- *Default:* CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)

Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS configuration on your cluster to determine which compute type to use for CoreDNS.

---

##### `version`<sup>Required</sup> <a name="version"></a>

- *Type:* [`aws_cdk.aws_eks.KubernetesVersion`](#aws-cdk-lib.aws_eks.KubernetesVersion)

The Kubernetes version to run in the cluster.

---

##### `endpoint_access`<sup>Optional</sup> <a name="endpoint_access"></a>

- *Type:* [`aws_cdk.aws_eks.EndpointAccess`](#aws-cdk-lib.aws_eks.EndpointAccess)
- *Default:* EndpointAccess.PUBLIC_AND_PRIVATE

Configure access to the Kubernetes API server endpoint..

> https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html

---

##### `output_cluster_name`<sup>Optional</sup> <a name="output_cluster_name"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the name of the cluster will be synthesized.

---

##### `role`<sup>Optional</sup> <a name="role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  A role is automatically created for you

Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.

---

##### `security_group`<sup>Optional</sup> <a name="security_group"></a>

- *Type:* [`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:*  A security group is automatically created

Security Group to use for Control Plane ENIs.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  a VPC with default configuration will be created and can be accessed through `cluster.vpc`.

The VPC in which to create the Cluster.

---

##### `vpc_subnets`<sup>Optional</sup> <a name="vpc_subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)]
- *Default:*  All public and private subnets

Where to place EKS Control Plane ENIs.

If you want to create public load balancers, this must include public subnets.

For example, to only select private subnets, supply the following:

```ts
vpcSubnets: [
   { subnetType: ec2.SubnetType.Private }
]
```

---

##### `cluster_handler_environment`<sup>Optional</sup> <a name="cluster_handler_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.

---

##### `cluster_name`<sup>Optional</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`
- *Default:*  Automatically generated name

Name for the cluster.

---

##### `output_config_command`<sup>Optional</sup> <a name="output_config_command"></a>

- *Type:* `builtins.bool`
- *Default:* true

Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.

This command will include
the cluster name and, if applicable, the ARN of the masters IAM role.

---

##### `kubectl_environment`<sup>Optional</sup> <a name="kubectl_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Environment variables for the kubectl execution.

Only relevant for kubectl enabled clusters.

---

##### `kubectl_layer`<sup>Optional</sup> <a name="kubectl_layer"></a>

- *Type:* [`aws_cdk.aws_lambda.ILayerVersion`](#aws-cdk-lib.aws_lambda.ILayerVersion)
- *Default:*  the layer provided by the `aws-lambda-layer-kubectl` SAR app.

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

By default, the provider will use the layer included in the
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

> https://github.com/aws-samples/aws-lambda-layer-kubectl

---

##### `kubectl_memory`<sup>Optional</sup> <a name="kubectl_memory"></a>

- *Type:* [`aws_cdk..Size`](#aws-cdk-lib.Size)
- *Default:* Size.gibibytes(1)

Amount of memory to allocate to the provider's lambda function.

---

##### `masters_role`<sup>Optional</sup> <a name="masters_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role that assumable by anyone with permissions in the same
account will automatically be defined

An IAM role that will be added to the `system:masters` Kubernetes RBAC group.

> https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings

---

##### `output_masters_role_arn`<sup>Optional</sup> <a name="output_masters_role_arn"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the ARN of the "masters" IAM role will be synthesized (if `mastersRole` is specified).

---

##### `place_cluster_handler_in_vpc`<sup>Optional</sup> <a name="place_cluster_handler_in_vpc"></a>

- *Type:* `builtins.bool`
- *Default:* false

If set to true, the cluster handler functions will be placed in the private subnets of the cluster vpc, subject to the `vpcSubnets` selection strategy.

---

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:* true

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

##### `secrets_encryption_key`<sup>Optional</sup> <a name="secrets_encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)
- *Default:*  By default, Kubernetes stores all secret object data within etcd and
  all etcd volumes used by Amazon EKS are encrypted at the disk-level
  using AWS-Managed encryption keys.

KMS secret for envelope encryption for Kubernetes secrets.

---

### ClusterProps <a name="aws-cdk-lib.aws_eks.ClusterProps"></a>

Common configuration props for EKS clusters.

#### Initializer <a name="aws-cdk-lib.aws_eks.ClusterProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.ClusterProps(kubectl_environment: typing.Mapping[#builtins.str] = None, 
                             version: aws_cdk.aws_eks.KubernetesVersion, 
                             kubectl_layer: aws_cdk.aws_lambda.ILayerVersion = None, 
                             output_cluster_name: builtins.bool = None, 
                             role: aws_cdk.aws_iam.IRole = None, 
                             security_group: aws_cdk.aws_ec2.ISecurityGroup = None, 
                             vpc: aws_cdk.aws_ec2.IVpc = None, 
                             vpc_subnets: typing.List[aws_cdk.aws_ec2.SubnetSelection] = None, 
                             cluster_handler_environment: typing.Mapping[#builtins.str] = None, 
                             core_dns_compute_type: aws_cdk.aws_eks.CoreDnsComputeType = None, 
                             endpoint_access: aws_cdk.aws_eks.EndpointAccess = None, 
                             cluster_name: builtins.str = None, 
                             output_config_command: builtins.bool = None, 
                             kubectl_memory: aws_cdk..Size = None, 
                             masters_role: aws_cdk.aws_iam.IRole = None, 
                             output_masters_role_arn: builtins.bool = None, 
                             place_cluster_handler_in_vpc: builtins.bool = None, 
                             prune: builtins.bool = None, 
                             secrets_encryption_key: aws_cdk.aws_kms.IKey = None, 
                             default_capacity: typing.Union[int, float] = None, 
                             default_capacity_instance: aws_cdk.aws_ec2.InstanceType = None, 
                             default_capacity_type: aws_cdk.aws_eks.DefaultCapacityType = None)
```

##### `kubectl_environment`<sup>Optional</sup> <a name="kubectl_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Environment variables for the kubectl execution.

Only relevant for kubectl enabled clusters.

---

##### `version`<sup>Required</sup> <a name="version"></a>

- *Type:* [`aws_cdk.aws_eks.KubernetesVersion`](#aws-cdk-lib.aws_eks.KubernetesVersion)

The Kubernetes version to run in the cluster.

---

##### `kubectl_layer`<sup>Optional</sup> <a name="kubectl_layer"></a>

- *Type:* [`aws_cdk.aws_lambda.ILayerVersion`](#aws-cdk-lib.aws_lambda.ILayerVersion)
- *Default:*  the layer provided by the `aws-lambda-layer-kubectl` SAR app.

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

By default, the provider will use the layer included in the
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

> https://github.com/aws-samples/aws-lambda-layer-kubectl

---

##### `output_cluster_name`<sup>Optional</sup> <a name="output_cluster_name"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the name of the cluster will be synthesized.

---

##### `role`<sup>Optional</sup> <a name="role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  A role is automatically created for you

Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.

---

##### `security_group`<sup>Optional</sup> <a name="security_group"></a>

- *Type:* [`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:*  A security group is automatically created

Security Group to use for Control Plane ENIs.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  a VPC with default configuration will be created and can be accessed through `cluster.vpc`.

The VPC in which to create the Cluster.

---

##### `vpc_subnets`<sup>Optional</sup> <a name="vpc_subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)]
- *Default:*  All public and private subnets

Where to place EKS Control Plane ENIs.

If you want to create public load balancers, this must include public subnets.

For example, to only select private subnets, supply the following:

```ts
vpcSubnets: [
   { subnetType: ec2.SubnetType.Private }
]
```

---

##### `cluster_handler_environment`<sup>Optional</sup> <a name="cluster_handler_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.

---

##### `core_dns_compute_type`<sup>Optional</sup> <a name="core_dns_compute_type"></a>

- *Type:* [`aws_cdk.aws_eks.CoreDnsComputeType`](#aws-cdk-lib.aws_eks.CoreDnsComputeType)
- *Default:* CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)

Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS configuration on your cluster to determine which compute type to use for CoreDNS.

---

##### `endpoint_access`<sup>Optional</sup> <a name="endpoint_access"></a>

- *Type:* [`aws_cdk.aws_eks.EndpointAccess`](#aws-cdk-lib.aws_eks.EndpointAccess)
- *Default:* EndpointAccess.PUBLIC_AND_PRIVATE

Configure access to the Kubernetes API server endpoint..

> https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html

---

##### `cluster_name`<sup>Optional</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`
- *Default:*  Automatically generated name

Name for the cluster.

---

##### `output_config_command`<sup>Optional</sup> <a name="output_config_command"></a>

- *Type:* `builtins.bool`
- *Default:* true

Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.

This command will include
the cluster name and, if applicable, the ARN of the masters IAM role.

---

##### `kubectl_memory`<sup>Optional</sup> <a name="kubectl_memory"></a>

- *Type:* [`aws_cdk..Size`](#aws-cdk-lib.Size)
- *Default:* Size.gibibytes(1)

Amount of memory to allocate to the provider's lambda function.

---

##### `masters_role`<sup>Optional</sup> <a name="masters_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role that assumable by anyone with permissions in the same
account will automatically be defined

An IAM role that will be added to the `system:masters` Kubernetes RBAC group.

> https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings

---

##### `output_masters_role_arn`<sup>Optional</sup> <a name="output_masters_role_arn"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the ARN of the "masters" IAM role will be synthesized (if `mastersRole` is specified).

---

##### `place_cluster_handler_in_vpc`<sup>Optional</sup> <a name="place_cluster_handler_in_vpc"></a>

- *Type:* `builtins.bool`
- *Default:* false

If set to true, the cluster handler functions will be placed in the private subnets of the cluster vpc, subject to the `vpcSubnets` selection strategy.

---

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:* true

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

##### `secrets_encryption_key`<sup>Optional</sup> <a name="secrets_encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)
- *Default:*  By default, Kubernetes stores all secret object data within etcd and
  all etcd volumes used by Amazon EKS are encrypted at the disk-level
  using AWS-Managed encryption keys.

KMS secret for envelope encryption for Kubernetes secrets.

---

##### `default_capacity`<sup>Optional</sup> <a name="default_capacity"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 2

Number of instances to allocate as an initial capacity for this cluster.

Instance type can be configured through `defaultCapacityInstanceType`,
which defaults to `m5.large`.

Use `cluster.addAutoScalingGroupCapacity` to add additional customized capacity. Set this
to `0` is you wish to avoid the initial capacity allocation.

---

##### `default_capacity_instance`<sup>Optional</sup> <a name="default_capacity_instance"></a>

- *Type:* [`aws_cdk.aws_ec2.InstanceType`](#aws-cdk-lib.aws_ec2.InstanceType)
- *Default:* m5.large

The instance type to use for the default capacity.

This will only be taken
into account if `defaultCapacity` is > 0.

---

##### `default_capacity_type`<sup>Optional</sup> <a name="default_capacity_type"></a>

- *Type:* [`aws_cdk.aws_eks.DefaultCapacityType`](#aws-cdk-lib.aws_eks.DefaultCapacityType)
- *Default:* NODEGROUP

The default capacity type for the cluster.

---

### CommonClusterOptions <a name="aws-cdk-lib.aws_eks.CommonClusterOptions"></a>

Options for configuring an EKS cluster.

#### Initializer <a name="aws-cdk-lib.aws_eks.CommonClusterOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CommonClusterOptions(version: aws_cdk.aws_eks.KubernetesVersion, 
                                     cluster_name: builtins.str = None, 
                                     output_cluster_name: builtins.bool = None, 
                                     output_config_command: builtins.bool = None, 
                                     role: aws_cdk.aws_iam.IRole = None, 
                                     security_group: aws_cdk.aws_ec2.ISecurityGroup = None, 
                                     vpc: aws_cdk.aws_ec2.IVpc = None, 
                                     vpc_subnets: typing.List[aws_cdk.aws_ec2.SubnetSelection] = None)
```

##### `version`<sup>Required</sup> <a name="version"></a>

- *Type:* [`aws_cdk.aws_eks.KubernetesVersion`](#aws-cdk-lib.aws_eks.KubernetesVersion)

The Kubernetes version to run in the cluster.

---

##### `cluster_name`<sup>Optional</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`
- *Default:*  Automatically generated name

Name for the cluster.

---

##### `output_cluster_name`<sup>Optional</sup> <a name="output_cluster_name"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the name of the cluster will be synthesized.

---

##### `output_config_command`<sup>Optional</sup> <a name="output_config_command"></a>

- *Type:* `builtins.bool`
- *Default:* true

Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.

This command will include
the cluster name and, if applicable, the ARN of the masters IAM role.

---

##### `role`<sup>Optional</sup> <a name="role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  A role is automatically created for you

Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.

---

##### `security_group`<sup>Optional</sup> <a name="security_group"></a>

- *Type:* [`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:*  A security group is automatically created

Security Group to use for Control Plane ENIs.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  a VPC with default configuration will be created and can be accessed through `cluster.vpc`.

The VPC in which to create the Cluster.

---

##### `vpc_subnets`<sup>Optional</sup> <a name="vpc_subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)]
- *Default:*  All public and private subnets

Where to place EKS Control Plane ENIs.

If you want to create public load balancers, this must include public subnets.

For example, to only select private subnets, supply the following:

```ts
vpcSubnets: [
   { subnetType: ec2.SubnetType.Private }
]
```

---

### EksOptimizedImageProps <a name="aws-cdk-lib.aws_eks.EksOptimizedImageProps"></a>

Properties for EksOptimizedImage.

#### Initializer <a name="aws-cdk-lib.aws_eks.EksOptimizedImageProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.EksOptimizedImageProps(cpu_arch: aws_cdk.aws_eks.CpuArch = None, 
                                       kubernetes_version: builtins.str = None, 
                                       node_type: aws_cdk.aws_eks.NodeType = None)
```

##### `cpu_arch`<sup>Optional</sup> <a name="cpu_arch"></a>

- *Type:* [`aws_cdk.aws_eks.CpuArch`](#aws-cdk-lib.aws_eks.CpuArch)
- *Default:* CpuArch.X86_64

What cpu architecture to retrieve the image for (arm64 or x86_64).

---

##### `kubernetes_version`<sup>Optional</sup> <a name="kubernetes_version"></a>

- *Type:* `builtins.str`
- *Default:*  The latest version

The Kubernetes version to use.

---

##### `node_type`<sup>Optional</sup> <a name="node_type"></a>

- *Type:* [`aws_cdk.aws_eks.NodeType`](#aws-cdk-lib.aws_eks.NodeType)
- *Default:* NodeType.STANDARD

What instance type to retrieve the image for (standard or GPU-optimized).

---

### EncryptionConfigProperty <a name="aws-cdk-lib.aws_eks.CfnCluster.EncryptionConfigProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnCluster.EncryptionConfigProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnCluster.EncryptionConfigProperty(provider: typing.Union[aws_cdk.aws_eks.CfnCluster.ProviderProperty, aws_cdk..IResolvable] = None, 
                                                    resources: typing.List[builtins.str] = None)
```

##### `provider`<sup>Optional</sup> <a name="provider"></a>

- *Type:* **typing.Union**[[`aws_cdk.aws_eks.CfnCluster.ProviderProperty`](#aws-cdk-lib.aws_eks.CfnCluster.ProviderProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`CfnCluster.EncryptionConfigProperty.Provider`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-provider](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-provider)

---

##### `resources`<sup>Optional</sup> <a name="resources"></a>

- *Type:* **typing.List**[`builtins.str`]

`CfnCluster.EncryptionConfigProperty.Resources`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-resources](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-resources)

---

### FargateClusterProps <a name="aws-cdk-lib.aws_eks.FargateClusterProps"></a>

Configuration props for EKS Fargate.

#### Initializer <a name="aws-cdk-lib.aws_eks.FargateClusterProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.FargateClusterProps(endpoint_access: aws_cdk.aws_eks.EndpointAccess = None, 
                                    version: aws_cdk.aws_eks.KubernetesVersion, 
                                    kubectl_environment: typing.Mapping[#builtins.str] = None, 
                                    output_cluster_name: builtins.bool = None, 
                                    role: aws_cdk.aws_iam.IRole = None, 
                                    security_group: aws_cdk.aws_ec2.ISecurityGroup = None, 
                                    vpc: aws_cdk.aws_ec2.IVpc = None, 
                                    vpc_subnets: typing.List[aws_cdk.aws_ec2.SubnetSelection] = None, 
                                    cluster_handler_environment: typing.Mapping[#builtins.str] = None, 
                                    core_dns_compute_type: aws_cdk.aws_eks.CoreDnsComputeType = None, 
                                    cluster_name: builtins.str = None, 
                                    output_config_command: builtins.bool = None, 
                                    kubectl_layer: aws_cdk.aws_lambda.ILayerVersion = None, 
                                    kubectl_memory: aws_cdk..Size = None, 
                                    masters_role: aws_cdk.aws_iam.IRole = None, 
                                    output_masters_role_arn: builtins.bool = None, 
                                    place_cluster_handler_in_vpc: builtins.bool = None, 
                                    prune: builtins.bool = None, 
                                    secrets_encryption_key: aws_cdk.aws_kms.IKey = None, 
                                    selectors: typing.List[aws_cdk.aws_eks.Selector], 
                                    fargate_profile_name: builtins.str = None, 
                                    pod_execution_role: aws_cdk.aws_iam.IRole = None, 
                                    subnet_selection: aws_cdk.aws_ec2.SubnetSelection = None, 
                                    vpc: aws_cdk.aws_ec2.IVpc = None)
```

##### `endpoint_access`<sup>Optional</sup> <a name="endpoint_access"></a>

- *Type:* [`aws_cdk.aws_eks.EndpointAccess`](#aws-cdk-lib.aws_eks.EndpointAccess)
- *Default:* EndpointAccess.PUBLIC_AND_PRIVATE

Configure access to the Kubernetes API server endpoint..

> https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html

---

##### `version`<sup>Required</sup> <a name="version"></a>

- *Type:* [`aws_cdk.aws_eks.KubernetesVersion`](#aws-cdk-lib.aws_eks.KubernetesVersion)

The Kubernetes version to run in the cluster.

---

##### `kubectl_environment`<sup>Optional</sup> <a name="kubectl_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Environment variables for the kubectl execution.

Only relevant for kubectl enabled clusters.

---

##### `output_cluster_name`<sup>Optional</sup> <a name="output_cluster_name"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the name of the cluster will be synthesized.

---

##### `role`<sup>Optional</sup> <a name="role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  A role is automatically created for you

Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.

---

##### `security_group`<sup>Optional</sup> <a name="security_group"></a>

- *Type:* [`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:*  A security group is automatically created

Security Group to use for Control Plane ENIs.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  a VPC with default configuration will be created and can be accessed through `cluster.vpc`.

The VPC in which to create the Cluster.

---

##### `vpc_subnets`<sup>Optional</sup> <a name="vpc_subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)]
- *Default:*  All public and private subnets

Where to place EKS Control Plane ENIs.

If you want to create public load balancers, this must include public subnets.

For example, to only select private subnets, supply the following:

```ts
vpcSubnets: [
   { subnetType: ec2.SubnetType.Private }
]
```

---

##### `cluster_handler_environment`<sup>Optional</sup> <a name="cluster_handler_environment"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  No environment variables.

Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.

---

##### `core_dns_compute_type`<sup>Optional</sup> <a name="core_dns_compute_type"></a>

- *Type:* [`aws_cdk.aws_eks.CoreDnsComputeType`](#aws-cdk-lib.aws_eks.CoreDnsComputeType)
- *Default:* CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)

Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS configuration on your cluster to determine which compute type to use for CoreDNS.

---

##### `cluster_name`<sup>Optional</sup> <a name="cluster_name"></a>

- *Type:* `builtins.str`
- *Default:*  Automatically generated name

Name for the cluster.

---

##### `output_config_command`<sup>Optional</sup> <a name="output_config_command"></a>

- *Type:* `builtins.bool`
- *Default:* true

Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.

This command will include
the cluster name and, if applicable, the ARN of the masters IAM role.

---

##### `kubectl_layer`<sup>Optional</sup> <a name="kubectl_layer"></a>

- *Type:* [`aws_cdk.aws_lambda.ILayerVersion`](#aws-cdk-lib.aws_lambda.ILayerVersion)
- *Default:*  the layer provided by the `aws-lambda-layer-kubectl` SAR app.

An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.

By default, the provider will use the layer included in the
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

> https://github.com/aws-samples/aws-lambda-layer-kubectl

---

##### `kubectl_memory`<sup>Optional</sup> <a name="kubectl_memory"></a>

- *Type:* [`aws_cdk..Size`](#aws-cdk-lib.Size)
- *Default:* Size.gibibytes(1)

Amount of memory to allocate to the provider's lambda function.

---

##### `masters_role`<sup>Optional</sup> <a name="masters_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role that assumable by anyone with permissions in the same
account will automatically be defined

An IAM role that will be added to the `system:masters` Kubernetes RBAC group.

> https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings

---

##### `output_masters_role_arn`<sup>Optional</sup> <a name="output_masters_role_arn"></a>

- *Type:* `builtins.bool`
- *Default:* false

Determines whether a CloudFormation output with the ARN of the "masters" IAM role will be synthesized (if `mastersRole` is specified).

---

##### `place_cluster_handler_in_vpc`<sup>Optional</sup> <a name="place_cluster_handler_in_vpc"></a>

- *Type:* `builtins.bool`
- *Default:* false

If set to true, the cluster handler functions will be placed in the private subnets of the cluster vpc, subject to the `vpcSubnets` selection strategy.

---

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:* true

Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.

When this is enabled (default), prune labels will be
allocated and injected to each resource. These labels will then be used
when issuing the `kubectl apply` operation with the `--prune` switch.

---

##### `secrets_encryption_key`<sup>Optional</sup> <a name="secrets_encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)
- *Default:*  By default, Kubernetes stores all secret object data within etcd and
  all etcd volumes used by Amazon EKS are encrypted at the disk-level
  using AWS-Managed encryption keys.

KMS secret for envelope encryption for Kubernetes secrets.

---

##### `selectors`<sup>Required</sup> <a name="selectors"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_eks.Selector`](#aws-cdk-lib.aws_eks.Selector)]

The selectors to match for pods to use this Fargate profile.

Each selector
must have an associated namespace. Optionally, you can also specify labels
for a namespace.

At least one selector is required and you may specify up to five selectors.

---

##### `fargate_profile_name`<sup>Optional</sup> <a name="fargate_profile_name"></a>

- *Type:* `builtins.str`
- *Default:*  generated

The name of the Fargate profile.

---

##### `pod_execution_role`<sup>Optional</sup> <a name="pod_execution_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role will be automatically created

The pod execution role to use for pods that match the selectors in the Fargate profile.

The pod execution role allows Fargate infrastructure to
register with your cluster as a node, and it provides read access to Amazon
ECR image repositories.

> https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html

---

##### `subnet_selection`<sup>Optional</sup> <a name="subnet_selection"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)
- *Default:*  all private subnets of the VPC are selected.

Select which subnets to launch your pods into.

At this time, pods running
on Fargate are not assigned public IP addresses, so only private subnets
(with no direct route to an Internet Gateway) are allowed.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  all private subnets used by theEKS cluster

The VPC from which to select subnets to launch your pods into.

By default, all private subnets are selected. You can customize this using
`subnetSelection`.

---

### FargateProfileOptions <a name="aws-cdk-lib.aws_eks.FargateProfileOptions"></a>

Options for defining EKS Fargate Profiles.

#### Initializer <a name="aws-cdk-lib.aws_eks.FargateProfileOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.FargateProfileOptions(selectors: typing.List[aws_cdk.aws_eks.Selector], 
                                      fargate_profile_name: builtins.str = None, 
                                      pod_execution_role: aws_cdk.aws_iam.IRole = None, 
                                      availability_zones: typing.List[builtins.str] = None, 
                                      one_per_az: builtins.bool = None, 
                                      subnet_filters: typing.List[aws_cdk.aws_ec2.SubnetFilter] = None, 
                                      subnet_group_name: builtins.str = None, 
                                      subnets: typing.List[aws_cdk.aws_ec2.ISubnet] = None, 
                                      subnet_type: aws_cdk.aws_ec2.SubnetType = None, 
                                      vpc: aws_cdk.aws_ec2.IVpc = None)
```

##### `selectors`<sup>Required</sup> <a name="selectors"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_eks.Selector`](#aws-cdk-lib.aws_eks.Selector)]

The selectors to match for pods to use this Fargate profile.

Each selector
must have an associated namespace. Optionally, you can also specify labels
for a namespace.

At least one selector is required and you may specify up to five selectors.

---

##### `fargate_profile_name`<sup>Optional</sup> <a name="fargate_profile_name"></a>

- *Type:* `builtins.str`
- *Default:*  generated

The name of the Fargate profile.

---

##### `pod_execution_role`<sup>Optional</sup> <a name="pod_execution_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role will be automatically created

The pod execution role to use for pods that match the selectors in the Fargate profile.

The pod execution role allows Fargate infrastructure to
register with your cluster as a node, and it provides read access to Amazon
ECR image repositories.

> https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html

---

##### `availability_zones`<sup>Optional</sup> <a name="availability_zones"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `one_per_az`<sup>Optional</sup> <a name="one_per_az"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnet_filters`<sup>Optional</sup> <a name="subnet_filters"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetFilter`](#aws-cdk-lib.aws_ec2.SubnetFilter)]
- *Default:*  none

List of provided subnet filters.

---

##### `subnet_group_name`<sup>Optional</sup> <a name="subnet_group_name"></a>

- *Type:* `builtins.str`
- *Default:*  Selection by type instead of by name

Select the subnet group with the given name.

Select the subnet group with the given name. This only needs
to be used if you have multiple subnet groups of the same type
and you need to distinguish between them. Otherwise, prefer
`subnetType`.

This field does not select individual subnets, it selects all subnets that
share the given subnet group name. This is the name supplied in
`subnetConfiguration`.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.ISubnet`](#aws-cdk-lib.aws_ec2.ISubnet)]
- *Default:*  Use all subnets in a selected group (all private subnets by default)

Explicitly select individual subnets.

Use this if you don't want to automatically use all subnets in
a group, but have a need to control selection down to
individual subnets.

Cannot be specified together with `subnetType` or `subnetGroupName`.

---

##### `subnet_type`<sup>Optional</sup> <a name="subnet_type"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetType`](#aws-cdk-lib.aws_ec2.SubnetType)
- *Default:* SubnetType.PRIVATE (or ISOLATED or PUBLIC if there are no PRIVATE subnets)

Select all subnets of the given type.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  all private subnets used by theEKS cluster

The VPC from which to select subnets to launch your pods into.

By default, all private subnets are selected. You can customize this using
`subnetSelection`.

---

### FargateProfileProps <a name="aws-cdk-lib.aws_eks.FargateProfileProps"></a>

Configuration props for EKS Fargate Profiles.

#### Initializer <a name="aws-cdk-lib.aws_eks.FargateProfileProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.FargateProfileProps(selectors: typing.List[aws_cdk.aws_eks.Selector], 
                                    cluster: aws_cdk.aws_eks.Cluster, 
                                    fargate_profile_name: builtins.str = None, 
                                    pod_execution_role: aws_cdk.aws_iam.IRole = None, 
                                    availability_zones: typing.List[builtins.str] = None, 
                                    one_per_az: builtins.bool = None, 
                                    subnet_filters: typing.List[aws_cdk.aws_ec2.SubnetFilter] = None, 
                                    subnet_group_name: builtins.str = None, 
                                    subnets: typing.List[aws_cdk.aws_ec2.ISubnet] = None, 
                                    subnet_type: aws_cdk.aws_ec2.SubnetType = None, 
                                    vpc: aws_cdk.aws_ec2.IVpc = None)
```

##### `selectors`<sup>Required</sup> <a name="selectors"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_eks.Selector`](#aws-cdk-lib.aws_eks.Selector)]

The selectors to match for pods to use this Fargate profile.

Each selector
must have an associated namespace. Optionally, you can also specify labels
for a namespace.

At least one selector is required and you may specify up to five selectors.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.Cluster`](#aws-cdk-lib.aws_eks.Cluster)

The EKS cluster to apply the Fargate profile to.

[disable-awslint:ref-via-interface]

---

##### `fargate_profile_name`<sup>Optional</sup> <a name="fargate_profile_name"></a>

- *Type:* `builtins.str`
- *Default:*  generated

The name of the Fargate profile.

---

##### `pod_execution_role`<sup>Optional</sup> <a name="pod_execution_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  a role will be automatically created

The pod execution role to use for pods that match the selectors in the Fargate profile.

The pod execution role allows Fargate infrastructure to
register with your cluster as a node, and it provides read access to Amazon
ECR image repositories.

> https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html

---

##### `availability_zones`<sup>Optional</sup> <a name="availability_zones"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `one_per_az`<sup>Optional</sup> <a name="one_per_az"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnet_filters`<sup>Optional</sup> <a name="subnet_filters"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetFilter`](#aws-cdk-lib.aws_ec2.SubnetFilter)]
- *Default:*  none

List of provided subnet filters.

---

##### `subnet_group_name`<sup>Optional</sup> <a name="subnet_group_name"></a>

- *Type:* `builtins.str`
- *Default:*  Selection by type instead of by name

Select the subnet group with the given name.

Select the subnet group with the given name. This only needs
to be used if you have multiple subnet groups of the same type
and you need to distinguish between them. Otherwise, prefer
`subnetType`.

This field does not select individual subnets, it selects all subnets that
share the given subnet group name. This is the name supplied in
`subnetConfiguration`.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.ISubnet`](#aws-cdk-lib.aws_ec2.ISubnet)]
- *Default:*  Use all subnets in a selected group (all private subnets by default)

Explicitly select individual subnets.

Use this if you don't want to automatically use all subnets in
a group, but have a need to control selection down to
individual subnets.

Cannot be specified together with `subnetType` or `subnetGroupName`.

---

##### `subnet_type`<sup>Optional</sup> <a name="subnet_type"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetType`](#aws-cdk-lib.aws_ec2.SubnetType)
- *Default:* SubnetType.PRIVATE (or ISOLATED or PUBLIC if there are no PRIVATE subnets)

Select all subnets of the given type.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  all private subnets used by theEKS cluster

The VPC from which to select subnets to launch your pods into.

By default, all private subnets are selected. You can customize this using
`subnetSelection`.

---

### HelmChartOptions <a name="aws-cdk-lib.aws_eks.HelmChartOptions"></a>

Helm Chart options.

#### Initializer <a name="aws-cdk-lib.aws_eks.HelmChartOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.HelmChartOptions(chart: builtins.str, 
                                 create_namespace: builtins.bool = None, 
                                 namespace: builtins.str = None, 
                                 release: builtins.str = None, 
                                 repository: builtins.str = None, 
                                 timeout: aws_cdk..Duration = None, 
                                 values: typing.Mapping[#typing.Any] = None, 
                                 version: builtins.str = None, 
                                 wait: builtins.bool = None)
```

##### `chart`<sup>Required</sup> <a name="chart"></a>

- *Type:* `builtins.str`

The name of the chart.

---

##### `create_namespace`<sup>Optional</sup> <a name="create_namespace"></a>

- *Type:* `builtins.bool`
- *Default:* true

create namespace if not exist.

---

##### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* default

The Kubernetes namespace scope of the requests.

---

##### `release`<sup>Optional</sup> <a name="release"></a>

- *Type:* `builtins.str`
- *Default:*  If no release name is given, it will use the last 53 characters of the node's unique id.

The name of the release.

---

##### `repository`<sup>Optional</sup> <a name="repository"></a>

- *Type:* `builtins.str`
- *Default:*  No repository will be used, which means that the chart needs to be an absolute URL.

The repository which contains the chart.

For example: https://kubernetes-charts.storage.googleapis.com/

---

##### `timeout`<sup>Optional</sup> <a name="timeout"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Amount of time to wait for any individual Kubernetes operation.

Maximum 15 minutes.

---

##### `values`<sup>Optional</sup> <a name="values"></a>

- *Type:* **typing.Mapping**[`typing.Any`]
- *Default:*  No values are provided to the chart.

The values to be used by the chart.

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`
- *Default:*  If this is not specified, the latest version is installed

The chart version to install.

---

##### `wait`<sup>Optional</sup> <a name="wait"></a>

- *Type:* `builtins.bool`
- *Default:*  Helm will not wait before marking release as successful

Whether or not Helm should wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.

---

### HelmChartProps <a name="aws-cdk-lib.aws_eks.HelmChartProps"></a>

Helm Chart properties.

#### Initializer <a name="aws-cdk-lib.aws_eks.HelmChartProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.HelmChartProps(chart: builtins.str, 
                               cluster: aws_cdk.aws_eks.ICluster, 
                               create_namespace: builtins.bool = None, 
                               namespace: builtins.str = None, 
                               release: builtins.str = None, 
                               repository: builtins.str = None, 
                               timeout: aws_cdk..Duration = None, 
                               values: typing.Mapping[#typing.Any] = None, 
                               version: builtins.str = None, 
                               wait: builtins.bool = None)
```

##### `chart`<sup>Required</sup> <a name="chart"></a>

- *Type:* `builtins.str`

The name of the chart.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The EKS cluster to apply this configuration to.

[disable-awslint:ref-via-interface]

---

##### `create_namespace`<sup>Optional</sup> <a name="create_namespace"></a>

- *Type:* `builtins.bool`
- *Default:* true

create namespace if not exist.

---

##### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* default

The Kubernetes namespace scope of the requests.

---

##### `release`<sup>Optional</sup> <a name="release"></a>

- *Type:* `builtins.str`
- *Default:*  If no release name is given, it will use the last 53 characters of the node's unique id.

The name of the release.

---

##### `repository`<sup>Optional</sup> <a name="repository"></a>

- *Type:* `builtins.str`
- *Default:*  No repository will be used, which means that the chart needs to be an absolute URL.

The repository which contains the chart.

For example: https://kubernetes-charts.storage.googleapis.com/

---

##### `timeout`<sup>Optional</sup> <a name="timeout"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Amount of time to wait for any individual Kubernetes operation.

Maximum 15 minutes.

---

##### `values`<sup>Optional</sup> <a name="values"></a>

- *Type:* **typing.Mapping**[`typing.Any`]
- *Default:*  No values are provided to the chart.

The values to be used by the chart.

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`
- *Default:*  If this is not specified, the latest version is installed

The chart version to install.

---

##### `wait`<sup>Optional</sup> <a name="wait"></a>

- *Type:* `builtins.bool`
- *Default:*  Helm will not wait before marking release as successful

Whether or not Helm should wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.

---

### KubernetesManifestOptions <a name="aws-cdk-lib.aws_eks.KubernetesManifestOptions"></a>

Options for `KubernetesManifest`.

#### Initializer <a name="aws-cdk-lib.aws_eks.KubernetesManifestOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesManifestOptions(prune: builtins.bool = None, 
                                          skip_validation: builtins.bool = None)
```

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:*  based on the prune option of the cluster, which is `true` unless
otherwise specified.

When a resource is removed from a Kubernetes manifest, it no longer appears in the manifest, and there is no way to know that this resource needs to be deleted.

To address this, `kubectl apply` has a `--prune` option which will
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

> https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune-l-your-label

---

##### `skip_validation`<sup>Optional</sup> <a name="skip_validation"></a>

- *Type:* `builtins.bool`
- *Default:* false

A flag to signify if the manifest validation should be skipped.

---

### KubernetesManifestProps <a name="aws-cdk-lib.aws_eks.KubernetesManifestProps"></a>

Properties for KubernetesManifest.

#### Initializer <a name="aws-cdk-lib.aws_eks.KubernetesManifestProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesManifestProps(cluster: aws_cdk.aws_eks.ICluster, 
                                        manifest: typing.List[typing.Mapping[#typing.Any]], 
                                        prune: builtins.bool = None, 
                                        skip_validation: builtins.bool = None, 
                                        overwrite: builtins.bool = None)
```

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The EKS cluster to apply this manifest to.

[disable-awslint:ref-via-interface]

---

##### `manifest`<sup>Required</sup> <a name="manifest"></a>

- *Type:* **typing.List**[**typing.Mapping**[`typing.Any`]]

The manifest to apply.

Consists of any number of child resources.

When the resources are created/updated, this manifest will be applied to the
cluster through `kubectl apply` and when the resources or the stack is
deleted, the resources in the manifest will be deleted through `kubectl delete`.

---

##### `prune`<sup>Optional</sup> <a name="prune"></a>

- *Type:* `builtins.bool`
- *Default:*  based on the prune option of the cluster, which is `true` unless
otherwise specified.

When a resource is removed from a Kubernetes manifest, it no longer appears in the manifest, and there is no way to know that this resource needs to be deleted.

To address this, `kubectl apply` has a `--prune` option which will
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

> https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune-l-your-label

---

##### `skip_validation`<sup>Optional</sup> <a name="skip_validation"></a>

- *Type:* `builtins.bool`
- *Default:* false

A flag to signify if the manifest validation should be skipped.

---

##### `overwrite`<sup>Optional</sup> <a name="overwrite"></a>

- *Type:* `builtins.bool`
- *Default:* false

Overwrite any existing resources.

If this is set, we will use `kubectl apply` instead of `kubectl create`
when the resource is created. Otherwise, if there is already a resource
in the cluster with the same name, the operation will fail.

---

### KubernetesNetworkConfigProperty <a name="aws-cdk-lib.aws_eks.CfnCluster.KubernetesNetworkConfigProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnCluster.KubernetesNetworkConfigProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnCluster.KubernetesNetworkConfigProperty(service_ipv4_cidr: builtins.str = None)
```

##### `service_ipv4_cidr`<sup>Optional</sup> <a name="service_ipv4_cidr"></a>

- *Type:* `builtins.str`

`CfnCluster.KubernetesNetworkConfigProperty.ServiceIpv4Cidr`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-serviceipv4cidr](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-serviceipv4cidr)

---

### KubernetesObjectValueProps <a name="aws-cdk-lib.aws_eks.KubernetesObjectValueProps"></a>

Properties for KubernetesObjectValue.

#### Initializer <a name="aws-cdk-lib.aws_eks.KubernetesObjectValueProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesObjectValueProps(cluster: aws_cdk.aws_eks.ICluster, 
                                           json_path: builtins.str, 
                                           object_name: builtins.str, 
                                           object_type: builtins.str, 
                                           object_namespace: builtins.str = None, 
                                           timeout: aws_cdk..Duration = None)
```

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The EKS cluster to fetch attributes from.

[disable-awslint:ref-via-interface]

---

##### `json_path`<sup>Required</sup> <a name="json_path"></a>

- *Type:* `builtins.str`

JSONPath to the specific value.

> https://kubernetes.io/docs/reference/kubectl/jsonpath/

---

##### `object_name`<sup>Required</sup> <a name="object_name"></a>

- *Type:* `builtins.str`

The name of the object to query.

---

##### `object_type`<sup>Required</sup> <a name="object_type"></a>

- *Type:* `builtins.str`

The object type to query.

(e.g 'service', 'pod'...)

---

##### `object_namespace`<sup>Optional</sup> <a name="object_namespace"></a>

- *Type:* `builtins.str`
- *Default:* 'default'

The namespace the object belongs to.

---

##### `timeout`<sup>Optional</sup> <a name="timeout"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Timeout for waiting on a value.

---

### KubernetesPatchProps <a name="aws-cdk-lib.aws_eks.KubernetesPatchProps"></a>

Properties for KubernetesPatch.

#### Initializer <a name="aws-cdk-lib.aws_eks.KubernetesPatchProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.KubernetesPatchProps(apply_patch: typing.Mapping[#typing.Any], 
                                     cluster: aws_cdk.aws_eks.ICluster, 
                                     resource_name: builtins.str, 
                                     restore_patch: typing.Mapping[#typing.Any], 
                                     patch_type: aws_cdk.aws_eks.PatchType = None, 
                                     resource_namespace: builtins.str = None)
```

##### `apply_patch`<sup>Required</sup> <a name="apply_patch"></a>

- *Type:* **typing.Mapping**[`typing.Any`]

The JSON object to pass to `kubectl patch` when the resource is created/updated.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The cluster to apply the patch to.

[disable-awslint:ref-via-interface]

---

##### `resource_name`<sup>Required</sup> <a name="resource_name"></a>

- *Type:* `builtins.str`

The full name of the resource to patch (e.g. `deployment/coredns`).

---

##### `restore_patch`<sup>Required</sup> <a name="restore_patch"></a>

- *Type:* **typing.Mapping**[`typing.Any`]

The JSON object to pass to `kubectl patch` when the resource is removed.

---

##### `patch_type`<sup>Optional</sup> <a name="patch_type"></a>

- *Type:* [`aws_cdk.aws_eks.PatchType`](#aws-cdk-lib.aws_eks.PatchType)
- *Default:* PatchType.STRATEGIC

The patch type to pass to `kubectl patch`.

The default type used by `kubectl patch` is "strategic".

---

##### `resource_namespace`<sup>Optional</sup> <a name="resource_namespace"></a>

- *Type:* `builtins.str`
- *Default:* "default"

The kubernetes API namespace.

---

### LabelProperty <a name="aws-cdk-lib.aws_eks.CfnFargateProfile.LabelProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnFargateProfile.LabelProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnFargateProfile.LabelProperty(key: builtins.str, 
                                                value: builtins.str)
```

##### `key`<sup>Required</sup> <a name="key"></a>

- *Type:* `builtins.str`

`CfnFargateProfile.LabelProperty.Key`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-key](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-key)

---

##### `value`<sup>Required</sup> <a name="value"></a>

- *Type:* `builtins.str`

`CfnFargateProfile.LabelProperty.Value`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-value](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-value)

---

### LaunchTemplateSpec <a name="aws-cdk-lib.aws_eks.LaunchTemplateSpec"></a>

Launch template property specification.

#### Initializer <a name="aws-cdk-lib.aws_eks.LaunchTemplateSpec.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.LaunchTemplateSpec(id: builtins.str, 
                                   version: builtins.str = None)
```

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

The Launch template ID.

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`
- *Default:*  the default version of the launch template

The launch template version to be used (optional).

---

### LaunchTemplateSpecificationProperty <a name="aws-cdk-lib.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnNodegroup.LaunchTemplateSpecificationProperty(id: builtins.str = None, 
                                                                 name: builtins.str = None, 
                                                                 version: builtins.str = None)
```

##### `id`<sup>Optional</sup> <a name="id"></a>

- *Type:* `builtins.str`

`CfnNodegroup.LaunchTemplateSpecificationProperty.Id`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-id](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-id)

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`

`CfnNodegroup.LaunchTemplateSpecificationProperty.Name`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-name](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-name)

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`

`CfnNodegroup.LaunchTemplateSpecificationProperty.Version`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-version](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-version)

---

### NodegroupOptions <a name="aws-cdk-lib.aws_eks.NodegroupOptions"></a>

The Nodegroup Options for addNodeGroup() method.

#### Initializer <a name="aws-cdk-lib.aws_eks.NodegroupOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.NodegroupOptions(max_size: typing.Union[int, float] = None, 
                                 ami_type: aws_cdk.aws_eks.NodegroupAmiType = None, 
                                 desired_size: typing.Union[int, float] = None, 
                                 disk_size: typing.Union[int, float] = None, 
                                 force_update: builtins.bool = None, 
                                 instance_types: typing.List[aws_cdk.aws_ec2.InstanceType] = None, 
                                 labels: typing.Mapping[#builtins.str] = None, 
                                 id: builtins.str, 
                                 version: builtins.str = None, 
                                 capacity_type: aws_cdk.aws_eks.CapacityType = None, 
                                 min_size: typing.Union[int, float] = None, 
                                 nodegroup_name: builtins.str = None, 
                                 node_role: aws_cdk.aws_iam.IRole = None, 
                                 release_version: builtins.str = None, 
                                 ssh_key_name: builtins.str, 
                                 source_security_groups: typing.List[aws_cdk.aws_ec2.ISecurityGroup] = None, 
                                 availability_zones: typing.List[builtins.str] = None, 
                                 one_per_az: builtins.bool = None, 
                                 subnet_filters: typing.List[aws_cdk.aws_ec2.SubnetFilter] = None, 
                                 subnet_group_name: builtins.str = None, 
                                 subnets: typing.List[aws_cdk.aws_ec2.ISubnet] = None, 
                                 subnet_type: aws_cdk.aws_ec2.SubnetType = None, 
                                 tags: typing.Mapping[#builtins.str] = None)
```

##### `max_size`<sup>Optional</sup> <a name="max_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:*  desiredSize

The maximum number of worker nodes that the managed node group can scale out to.

Managed node groups can support up to 100 nodes by default.

---

##### `ami_type`<sup>Optional</sup> <a name="ami_type"></a>

- *Type:* [`aws_cdk.aws_eks.NodegroupAmiType`](#aws-cdk-lib.aws_eks.NodegroupAmiType)
- *Default:*  auto-determined from the instanceTypes property.

The AMI type for your node group.

---

##### `desired_size`<sup>Optional</sup> <a name="desired_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 2

The current number of worker nodes that the managed node group should maintain.

If not specified,
the nodewgroup will initially create `minSize` instances.

---

##### `disk_size`<sup>Optional</sup> <a name="disk_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 20

The root device disk size (in GiB) for your node group instances.

---

##### `force_update`<sup>Optional</sup> <a name="force_update"></a>

- *Type:* `builtins.bool`
- *Default:* true

Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue.

If an update fails because pods could not be drained, you can force the update after it fails to terminate the old
node whether or not any pods are
running on the node.

---

##### `instance_types`<sup>Optional</sup> <a name="instance_types"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.InstanceType`](#aws-cdk-lib.aws_ec2.InstanceType)]
- *Default:* t3.medium will be used according to the cloudformation document.

The instance types to use for your node group.

> - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes

---

##### `labels`<sup>Optional</sup> <a name="labels"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  None

The Kubernetes labels to be applied to the nodes in the node group when they are created.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

The Launch template ID.

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`
- *Default:*  the default version of the launch template

The launch template version to be used (optional).

---

##### `capacity_type`<sup>Optional</sup> <a name="capacity_type"></a>

- *Type:* [`aws_cdk.aws_eks.CapacityType`](#aws-cdk-lib.aws_eks.CapacityType)
- *Default:*  ON_DEMAND

The capacity type of the nodegroup.

---

##### `min_size`<sup>Optional</sup> <a name="min_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 1

The minimum number of worker nodes that the managed node group can scale in to.

This number must be greater than zero.

---

##### `nodegroup_name`<sup>Optional</sup> <a name="nodegroup_name"></a>

- *Type:* `builtins.str`
- *Default:*  resource ID

Name of the Nodegroup.

---

##### `node_role`<sup>Optional</sup> <a name="node_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  None. Auto-generated if not specified.

The IAM role to associate with your node group.

The Amazon EKS worker node kubelet daemon
makes calls to AWS APIs on your behalf. Worker nodes receive permissions for these API calls through
an IAM instance profile and associated policies. Before you can launch worker nodes and register them
into a cluster, you must create an IAM role for those worker nodes to use when they are launched.

---

##### `release_version`<sup>Optional</sup> <a name="release_version"></a>

- *Type:* `builtins.str`
- *Default:*  The latest available AMI version for the node group's current Kubernetes version is used.

The AMI version of the Amazon EKS-optimized AMI to use with your node group (for example, `1.14.7-YYYYMMDD`).

---

##### `ssh_key_name`<sup>Required</sup> <a name="ssh_key_name"></a>

- *Type:* `builtins.str`

The Amazon EC2 SSH key that provides access for SSH communication with the worker nodes in the managed node group.

---

##### `source_security_groups`<sup>Optional</sup> <a name="source_security_groups"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)]
- *Default:*  port 22 on the worker nodes is opened to the internet (0.0.0.0/0)

The security groups that are allowed SSH access (port 22) to the worker nodes.

If you specify an Amazon EC2 SSH
key but do not specify a source security group when you create a managed node group, then port 22 on the worker
nodes is opened to the internet (0.0.0.0/0).

---

##### `availability_zones`<sup>Optional</sup> <a name="availability_zones"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `one_per_az`<sup>Optional</sup> <a name="one_per_az"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnet_filters`<sup>Optional</sup> <a name="subnet_filters"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetFilter`](#aws-cdk-lib.aws_ec2.SubnetFilter)]
- *Default:*  none

List of provided subnet filters.

---

##### `subnet_group_name`<sup>Optional</sup> <a name="subnet_group_name"></a>

- *Type:* `builtins.str`
- *Default:*  Selection by type instead of by name

Select the subnet group with the given name.

Select the subnet group with the given name. This only needs
to be used if you have multiple subnet groups of the same type
and you need to distinguish between them. Otherwise, prefer
`subnetType`.

This field does not select individual subnets, it selects all subnets that
share the given subnet group name. This is the name supplied in
`subnetConfiguration`.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.ISubnet`](#aws-cdk-lib.aws_ec2.ISubnet)]
- *Default:*  Use all subnets in a selected group (all private subnets by default)

Explicitly select individual subnets.

Use this if you don't want to automatically use all subnets in
a group, but have a need to control selection down to
individual subnets.

Cannot be specified together with `subnetType` or `subnetGroupName`.

---

##### `subnet_type`<sup>Optional</sup> <a name="subnet_type"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetType`](#aws-cdk-lib.aws_ec2.SubnetType)
- *Default:* SubnetType.PRIVATE (or ISOLATED or PUBLIC if there are no PRIVATE subnets)

Select all subnets of the given type.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  None

The metadata to apply to the node group to assist with categorization and organization.

Each tag consists of
a key and an optional value, both of which you define. Node group tags do not propagate to any other resources
associated with the node group, such as the Amazon EC2 instances or subnets.

---

### NodegroupProps <a name="aws-cdk-lib.aws_eks.NodegroupProps"></a>

NodeGroup properties interface.

#### Initializer <a name="aws-cdk-lib.aws_eks.NodegroupProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.NodegroupProps(max_size: typing.Union[int, float] = None, 
                               cluster: aws_cdk.aws_eks.ICluster, 
                               min_size: typing.Union[int, float] = None, 
                               desired_size: typing.Union[int, float] = None, 
                               force_update: builtins.bool = None, 
                               instance_types: typing.List[aws_cdk.aws_ec2.InstanceType] = None, 
                               labels: typing.Mapping[#builtins.str] = None, 
                               id: builtins.str, 
                               version: builtins.str = None, 
                               capacity_type: aws_cdk.aws_eks.CapacityType = None, 
                               disk_size: typing.Union[int, float] = None, 
                               nodegroup_name: builtins.str = None, 
                               node_role: aws_cdk.aws_iam.IRole = None, 
                               release_version: builtins.str = None, 
                               ssh_key_name: builtins.str, 
                               source_security_groups: typing.List[aws_cdk.aws_ec2.ISecurityGroup] = None, 
                               availability_zones: typing.List[builtins.str] = None, 
                               one_per_az: builtins.bool = None, 
                               subnet_filters: typing.List[aws_cdk.aws_ec2.SubnetFilter] = None, 
                               subnet_group_name: builtins.str = None, 
                               subnets: typing.List[aws_cdk.aws_ec2.ISubnet] = None, 
                               subnet_type: aws_cdk.aws_ec2.SubnetType = None, 
                               tags: typing.Mapping[#builtins.str] = None, 
                               ami_type: aws_cdk.aws_eks.NodegroupAmiType = None)
```

##### `max_size`<sup>Optional</sup> <a name="max_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:*  desiredSize

The maximum number of worker nodes that the managed node group can scale out to.

Managed node groups can support up to 100 nodes by default.

---

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

Cluster resource.

---

##### `min_size`<sup>Optional</sup> <a name="min_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 1

The minimum number of worker nodes that the managed node group can scale in to.

This number must be greater than zero.

---

##### `desired_size`<sup>Optional</sup> <a name="desired_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 2

The current number of worker nodes that the managed node group should maintain.

If not specified,
the nodewgroup will initially create `minSize` instances.

---

##### `force_update`<sup>Optional</sup> <a name="force_update"></a>

- *Type:* `builtins.bool`
- *Default:* true

Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue.

If an update fails because pods could not be drained, you can force the update after it fails to terminate the old
node whether or not any pods are
running on the node.

---

##### `instance_types`<sup>Optional</sup> <a name="instance_types"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.InstanceType`](#aws-cdk-lib.aws_ec2.InstanceType)]
- *Default:* t3.medium will be used according to the cloudformation document.

The instance types to use for your node group.

> - https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes

---

##### `labels`<sup>Optional</sup> <a name="labels"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  None

The Kubernetes labels to be applied to the nodes in the node group when they are created.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

The Launch template ID.

---

##### `version`<sup>Optional</sup> <a name="version"></a>

- *Type:* `builtins.str`
- *Default:*  the default version of the launch template

The launch template version to be used (optional).

---

##### `capacity_type`<sup>Optional</sup> <a name="capacity_type"></a>

- *Type:* [`aws_cdk.aws_eks.CapacityType`](#aws-cdk-lib.aws_eks.CapacityType)
- *Default:*  ON_DEMAND

The capacity type of the nodegroup.

---

##### `disk_size`<sup>Optional</sup> <a name="disk_size"></a>

- *Type:* **typing.Union**[`int`, `float`]
- *Default:* 20

The root device disk size (in GiB) for your node group instances.

---

##### `nodegroup_name`<sup>Optional</sup> <a name="nodegroup_name"></a>

- *Type:* `builtins.str`
- *Default:*  resource ID

Name of the Nodegroup.

---

##### `node_role`<sup>Optional</sup> <a name="node_role"></a>

- *Type:* [`aws_cdk.aws_iam.IRole`](#aws-cdk-lib.aws_iam.IRole)
- *Default:*  None. Auto-generated if not specified.

The IAM role to associate with your node group.

The Amazon EKS worker node kubelet daemon
makes calls to AWS APIs on your behalf. Worker nodes receive permissions for these API calls through
an IAM instance profile and associated policies. Before you can launch worker nodes and register them
into a cluster, you must create an IAM role for those worker nodes to use when they are launched.

---

##### `release_version`<sup>Optional</sup> <a name="release_version"></a>

- *Type:* `builtins.str`
- *Default:*  The latest available AMI version for the node group's current Kubernetes version is used.

The AMI version of the Amazon EKS-optimized AMI to use with your node group (for example, `1.14.7-YYYYMMDD`).

---

##### `ssh_key_name`<sup>Required</sup> <a name="ssh_key_name"></a>

- *Type:* `builtins.str`

The Amazon EC2 SSH key that provides access for SSH communication with the worker nodes in the managed node group.

---

##### `source_security_groups`<sup>Optional</sup> <a name="source_security_groups"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)]
- *Default:*  port 22 on the worker nodes is opened to the internet (0.0.0.0/0)

The security groups that are allowed SSH access (port 22) to the worker nodes.

If you specify an Amazon EC2 SSH
key but do not specify a source security group when you create a managed node group, then port 22 on the worker
nodes is opened to the internet (0.0.0.0/0).

---

##### `availability_zones`<sup>Optional</sup> <a name="availability_zones"></a>

- *Type:* **typing.List**[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `one_per_az`<sup>Optional</sup> <a name="one_per_az"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnet_filters`<sup>Optional</sup> <a name="subnet_filters"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.SubnetFilter`](#aws-cdk-lib.aws_ec2.SubnetFilter)]
- *Default:*  none

List of provided subnet filters.

---

##### `subnet_group_name`<sup>Optional</sup> <a name="subnet_group_name"></a>

- *Type:* `builtins.str`
- *Default:*  Selection by type instead of by name

Select the subnet group with the given name.

Select the subnet group with the given name. This only needs
to be used if you have multiple subnet groups of the same type
and you need to distinguish between them. Otherwise, prefer
`subnetType`.

This field does not select individual subnets, it selects all subnets that
share the given subnet group name. This is the name supplied in
`subnetConfiguration`.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `subnets`<sup>Optional</sup> <a name="subnets"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.ISubnet`](#aws-cdk-lib.aws_ec2.ISubnet)]
- *Default:*  Use all subnets in a selected group (all private subnets by default)

Explicitly select individual subnets.

Use this if you don't want to automatically use all subnets in
a group, but have a need to control selection down to
individual subnets.

Cannot be specified together with `subnetType` or `subnetGroupName`.

---

##### `subnet_type`<sup>Optional</sup> <a name="subnet_type"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetType`](#aws-cdk-lib.aws_ec2.SubnetType)
- *Default:* SubnetType.PRIVATE (or ISOLATED or PUBLIC if there are no PRIVATE subnets)

Select all subnets of the given type.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  None

The metadata to apply to the node group to assist with categorization and organization.

Each tag consists of
a key and an optional value, both of which you define. Node group tags do not propagate to any other resources
associated with the node group, such as the Amazon EC2 instances or subnets.

---

##### `ami_type`<sup>Optional</sup> <a name="ami_type"></a>

- *Type:* [`aws_cdk.aws_eks.NodegroupAmiType`](#aws-cdk-lib.aws_eks.NodegroupAmiType)
- *Default:*  auto-determined from the instanceTypes property.

The AMI type for your node group.

---

### NodegroupRemoteAccess <a name="aws-cdk-lib.aws_eks.NodegroupRemoteAccess"></a>

The remote access (SSH) configuration to use with your node group.

> https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html

#### Initializer <a name="aws-cdk-lib.aws_eks.NodegroupRemoteAccess.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.NodegroupRemoteAccess(ssh_key_name: builtins.str, 
                                      source_security_groups: typing.List[aws_cdk.aws_ec2.ISecurityGroup] = None)
```

##### `ssh_key_name`<sup>Required</sup> <a name="ssh_key_name"></a>

- *Type:* `builtins.str`

The Amazon EC2 SSH key that provides access for SSH communication with the worker nodes in the managed node group.

---

##### `source_security_groups`<sup>Optional</sup> <a name="source_security_groups"></a>

- *Type:* **typing.List**[[`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)]
- *Default:*  port 22 on the worker nodes is opened to the internet (0.0.0.0/0)

The security groups that are allowed SSH access (port 22) to the worker nodes.

If you specify an Amazon EC2 SSH
key but do not specify a source security group when you create a managed node group, then port 22 on the worker
nodes is opened to the internet (0.0.0.0/0).

---

### OpenIdConnectProviderProps <a name="aws-cdk-lib.aws_eks.OpenIdConnectProviderProps"></a>

Initialization properties for `OpenIdConnectProvider`.

#### Initializer <a name="aws-cdk-lib.aws_eks.OpenIdConnectProviderProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.OpenIdConnectProviderProps(url: builtins.str)
```

##### `url`<sup>Required</sup> <a name="url"></a>

- *Type:* `builtins.str`

The URL of the identity provider.

The URL must begin with https:// and
should correspond to the iss claim in the provider's OpenID Connect ID
tokens. Per the OIDC standard, path components are allowed but query
parameters are not. Typically the URL consists of only a hostname, like
https://server.example.org or https://example.com.

You can find your OIDC Issuer URL by:
aws eks describe-cluster --name %cluster_name% --query "cluster.identity.oidc.issuer" --output text

---

### ProviderProperty <a name="aws-cdk-lib.aws_eks.CfnCluster.ProviderProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnCluster.ProviderProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnCluster.ProviderProperty(key_arn: builtins.str = None)
```

##### `key_arn`<sup>Optional</sup> <a name="key_arn"></a>

- *Type:* `builtins.str`

`CfnCluster.ProviderProperty.KeyArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html#cfn-eks-cluster-provider-keyarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html#cfn-eks-cluster-provider-keyarn)

---

### RemoteAccessProperty <a name="aws-cdk-lib.aws_eks.CfnNodegroup.RemoteAccessProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnNodegroup.RemoteAccessProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnNodegroup.RemoteAccessProperty(ec2_ssh_key: builtins.str, 
                                                  source_security_groups: typing.List[builtins.str] = None)
```

##### `ec2_ssh_key`<sup>Required</sup> <a name="ec2_ssh_key"></a>

- *Type:* `builtins.str`

`CfnNodegroup.RemoteAccessProperty.Ec2SshKey`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-ec2sshkey](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-ec2sshkey)

---

##### `source_security_groups`<sup>Optional</sup> <a name="source_security_groups"></a>

- *Type:* **typing.List**[`builtins.str`]

`CfnNodegroup.RemoteAccessProperty.SourceSecurityGroups`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-sourcesecuritygroups](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-sourcesecuritygroups)

---

### ResourcesVpcConfigProperty <a name="aws-cdk-lib.aws_eks.CfnCluster.ResourcesVpcConfigProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnCluster.ResourcesVpcConfigProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnCluster.ResourcesVpcConfigProperty(subnet_ids: typing.List[builtins.str], 
                                                      security_group_ids: typing.List[builtins.str] = None)
```

##### `subnet_ids`<sup>Required</sup> <a name="subnet_ids"></a>

- *Type:* **typing.List**[`builtins.str`]

`CfnCluster.ResourcesVpcConfigProperty.SubnetIds`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-subnetids](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-subnetids)

---

##### `security_group_ids`<sup>Optional</sup> <a name="security_group_ids"></a>

- *Type:* **typing.List**[`builtins.str`]

`CfnCluster.ResourcesVpcConfigProperty.SecurityGroupIds`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-securitygroupids](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-securitygroupids)

---

### ScalingConfigProperty <a name="aws-cdk-lib.aws_eks.CfnNodegroup.ScalingConfigProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnNodegroup.ScalingConfigProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnNodegroup.ScalingConfigProperty(desired_size: typing.Union[int, float] = None, 
                                                   max_size: typing.Union[int, float] = None, 
                                                   min_size: typing.Union[int, float] = None)
```

##### `desired_size`<sup>Optional</sup> <a name="desired_size"></a>

- *Type:* **typing.Union**[`int`, `float`]

`CfnNodegroup.ScalingConfigProperty.DesiredSize`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-desiredsize](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-desiredsize)

---

##### `max_size`<sup>Optional</sup> <a name="max_size"></a>

- *Type:* **typing.Union**[`int`, `float`]

`CfnNodegroup.ScalingConfigProperty.MaxSize`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-maxsize](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-maxsize)

---

##### `min_size`<sup>Optional</sup> <a name="min_size"></a>

- *Type:* **typing.Union**[`int`, `float`]

`CfnNodegroup.ScalingConfigProperty.MinSize`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-minsize](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-minsize)

---

### Selector <a name="aws-cdk-lib.aws_eks.Selector"></a>

Fargate profile selector.

#### Initializer <a name="aws-cdk-lib.aws_eks.Selector.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.Selector(namespace: builtins.str, 
                         labels: typing.Mapping[#builtins.str] = None)
```

##### `namespace`<sup>Required</sup> <a name="namespace"></a>

- *Type:* `builtins.str`

The Kubernetes namespace that the selector should match.

You must specify a namespace for a selector. The selector only matches pods
that are created in this namespace, but you can create multiple selectors
to target multiple namespaces.

---

##### `labels`<sup>Optional</sup> <a name="labels"></a>

- *Type:* **typing.Mapping**[`builtins.str`]
- *Default:*  all pods within the namespace will be selected.

The Kubernetes labels that the selector should match.

A pod must contain
all of the labels that are specified in the selector for it to be
considered a match.

---

### SelectorProperty <a name="aws-cdk-lib.aws_eks.CfnFargateProfile.SelectorProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnFargateProfile.SelectorProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnFargateProfile.SelectorProperty(namespace: builtins.str, 
                                                   labels: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_eks.CfnFargateProfile.LabelProperty, aws_cdk..IResolvable]]] = None)
```

##### `namespace`<sup>Required</sup> <a name="namespace"></a>

- *Type:* `builtins.str`

`CfnFargateProfile.SelectorProperty.Namespace`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-namespace](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-namespace)

---

##### `labels`<sup>Optional</sup> <a name="labels"></a>

- *Type:* **typing.Union**[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable), **typing.List**[**typing.Union**[[`aws_cdk.aws_eks.CfnFargateProfile.LabelProperty`](#aws-cdk-lib.aws_eks.CfnFargateProfile.LabelProperty), [`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`CfnFargateProfile.SelectorProperty.Labels`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-labels](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-labels)

---

### ServiceAccountOptions <a name="aws-cdk-lib.aws_eks.ServiceAccountOptions"></a>

Options for `ServiceAccount`.

#### Initializer <a name="aws-cdk-lib.aws_eks.ServiceAccountOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.ServiceAccountOptions(name: builtins.str = None, 
                                      namespace: builtins.str = None)
```

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`
- *Default:*  If no name is given, it will use the id of the resource.

The name of the service account.

---

##### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* "default"

The namespace of the service account.

---

### ServiceAccountProps <a name="aws-cdk-lib.aws_eks.ServiceAccountProps"></a>

Properties for defining service accounts.

#### Initializer <a name="aws-cdk-lib.aws_eks.ServiceAccountProps.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.ServiceAccountProps(cluster: aws_cdk.aws_eks.ICluster, 
                                    name: builtins.str = None, 
                                    namespace: builtins.str = None)
```

##### `cluster`<sup>Required</sup> <a name="cluster"></a>

- *Type:* [`aws_cdk.aws_eks.ICluster`](#aws-cdk-lib.aws_eks.ICluster)

The cluster to apply the patch to.

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`
- *Default:*  If no name is given, it will use the id of the resource.

The name of the service account.

---

##### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* "default"

The namespace of the service account.

---

### ServiceLoadBalancerAddressOptions <a name="aws-cdk-lib.aws_eks.ServiceLoadBalancerAddressOptions"></a>

Options for fetching a ServiceLoadBalancerAddress.

#### Initializer <a name="aws-cdk-lib.aws_eks.ServiceLoadBalancerAddressOptions.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.ServiceLoadBalancerAddressOptions(namespace: builtins.str = None, 
                                                  timeout: aws_cdk..Duration = None)
```

##### `namespace`<sup>Optional</sup> <a name="namespace"></a>

- *Type:* `builtins.str`
- *Default:* 'default'

The namespace the service belongs to.

---

##### `timeout`<sup>Optional</sup> <a name="timeout"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.minutes(5)

Timeout for waiting on the load balancer address.

---

### TaintProperty <a name="aws-cdk-lib.aws_eks.CfnNodegroup.TaintProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html)

#### Initializer <a name="aws-cdk-lib.aws_eks.CfnNodegroup.TaintProperty.Initializer"></a>

```python
import aws_cdk.aws_eks

aws_cdk.aws_eks.CfnNodegroup.TaintProperty(effect: builtins.str = None, 
                                           key: builtins.str = None, 
                                           value: builtins.str = None)
```

##### `effect`<sup>Optional</sup> <a name="effect"></a>

- *Type:* `builtins.str`

`CfnNodegroup.TaintProperty.Effect`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-effect](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-effect)

---

##### `key`<sup>Optional</sup> <a name="key"></a>

- *Type:* `builtins.str`

`CfnNodegroup.TaintProperty.Key`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-key](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-key)

---

##### `value`<sup>Optional</sup> <a name="value"></a>

- *Type:* `builtins.str`

`CfnNodegroup.TaintProperty.Value`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-value](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-taint.html#cfn-eks-nodegroup-taint-value)

---
