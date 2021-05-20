# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### CfnResourcePolicy <a name="aws-cdk-lib.aws_secretsmanager.CfnResourcePolicy"></a>

A CloudFormation `AWS::SecretsManager::ResourcePolicy`.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnResourcePolicy(scope: constructs.Construct, id: string, **kwargs)
```


##### resourcePolicy <a name="resourcePolicy"></a>

- *Type: any | **Required** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.ResourcePolicy`.


---

##### secretId <a name="secretId"></a>

- *Type: string | **Required** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.SecretId`.


---

##### blockPublicPolicy <a name="blockPublicPolicy"></a>

- *Type: [boolean](#undefined) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.BlockPublicPolicy`.


---



### CfnRotationSchedule <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule"></a>

A CloudFormation `AWS::SecretsManager::RotationSchedule`.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnRotationSchedule(scope: constructs.Construct, id: string, **kwargs)
```


##### secretId <a name="secretId"></a>

- *Type: string | **Required** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.SecretId`.


---

##### hostedRotationLambda <a name="hostedRotationLambda"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.HostedRotationLambda`.


---

##### rotationLambdaArn <a name="rotationLambdaArn"></a>

- *Type: string | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.RotationLambdaARN`.


---

##### rotationRules <a name="rotationRules"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.RotationRules`.


---



### CfnSecret <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret"></a>

A CloudFormation `AWS::SecretsManager::Secret`.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecret(scope: constructs.Construct, id: string, **kwargs)
```


##### description <a name="description"></a>

- *Type: string | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Description`.


---

##### generateSecretString <a name="generateSecretString"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty) | [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.GenerateSecretString`.


---

##### kmsKeyId <a name="kmsKeyId"></a>

- *Type: string | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.KmsKeyId`.


---

##### name <a name="name"></a>

- *Type: string | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Name`.


---

##### replicaRegions <a name="replicaRegions"></a>

- *Type: [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable) | [Array<aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty | aws-cdk-lib.IResolvable>](#undefined) | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.ReplicaRegions`.


---

##### secretString <a name="secretString"></a>

- *Type: string | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.SecretString`.


---

##### tags <a name="tags"></a>

- *Type: Array<aws-cdk-lib.CfnTag> | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Tags`.


---



### CfnSecretTargetAttachment <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachment"></a>

A CloudFormation `AWS::SecretsManager::SecretTargetAttachment`.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecretTargetAttachment(scope: constructs.Construct, id: string, **kwargs)
```


##### secretId <a name="secretId"></a>

- *Type: string | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.SecretId`.


---

##### targetId <a name="targetId"></a>

- *Type: string | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.TargetId`.


---

##### targetType <a name="targetType"></a>

- *Type: string | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.TargetType`.


---



### ResourcePolicy <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicy"></a>

Secret Resource Policy.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.ResourcePolicy(scope: constructs.Construct, id: string, **kwargs)
```


##### secret <a name="secret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Required** | Default: undefined*

The secret to attach a resource-based permissions policy.


---



### RotationSchedule <a name="aws-cdk-lib.aws_secretsmanager.RotationSchedule"></a>

A rotation schedule.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.RotationSchedule(scope: constructs.Construct, id: string, **kwargs)
```


##### automaticallyAfter <a name="automaticallyAfter"></a>

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.days(30)*

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.


---

##### hostedRotation <a name="hostedRotation"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation) | **Optional** | Default: - either `rotationLambda` or `hostedRotation` must be specified*

Hosted rotation.


---

##### rotationLambda <a name="rotationLambda"></a>

- *Type: [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction) | **Optional** | Default: - either `rotationLambda` or `hostedRotation` must be specified*

A Lambda function that can rotate the secret.


---

##### secret <a name="secret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Required** | Default: undefined*

The secret to rotate.

If hosted rotation is used, this must be a JSON string with the following format:

```
{
   "engine": <required: database engine>,
   "host": <required: instance host name>,
   "username": <required: username>,
   "password": <required: password>,
   "dbname": <optional: database name>,
   "port": <optional: if not specified, default port will be used>,
   "masterarn": <required for multi user rotation: the arn of the master secret which will be used to create users/change passwords>
}
```

This is typically the case for a secret referenced from an `AWS::SecretsManager::SecretTargetAttachment`
or an `ISecret` returned by the `attach()` method of `Secret`.


---



### Secret <a name="aws-cdk-lib.aws_secretsmanager.Secret"></a>

Creates a new secret in AWS SecretsManager.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.Secret(scope: constructs.Construct, id: string, **kwargs)
```


##### description <a name="description"></a>

- *Type: string | **Optional** | Default: - No description.*

An optional, human-friendly description of the secret.


---

##### encryptionKey <a name="encryptionKey"></a>

- *Type: [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey) | **Optional** | Default: - A default KMS key for the account and region is used.*

The customer-managed encryption key to use for encrypting the secret value.


---

##### generateSecretString <a name="generateSecretString"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.SecretStringGenerator](#aws-cdk-lib.aws_secretsmanager.SecretStringGenerator) | **Optional** | Default: - 32 characters with upper-case letters, lower-case letters, punctuation and numbers (at least one from each
category), per the default values of ``SecretStringGenerator``.*

Configuration for how to generate a secret value.


---

##### removalPolicy <a name="removalPolicy"></a>

- *Type: [aws-cdk-lib.RemovalPolicy](#aws-cdk-lib.RemovalPolicy) | **Optional** | Default: - Not set.*

Policy to apply when the secret is removed from this stack.


---

##### replicaRegions <a name="replicaRegions"></a>

- *Type: Array<aws-cdk-lib.aws_secretsmanager.ReplicaRegion> | **Optional** | Default: - Secret is not replicated*

A list of regions where to replicate this secret.


---

##### secretName <a name="secretName"></a>

- *Type: string | **Optional** | Default: - A name is generated by CloudFormation.*

A name for the secret.

Note that deleting secrets from SecretsManager does not happen immediately, but after a 7 to
30 days blackout period. During that period, it is not possible to create another secret that shares the same name.


---



### SecretRotation <a name="aws-cdk-lib.aws_secretsmanager.SecretRotation"></a>

Secret rotation for a service or database.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretRotation(scope: constructs.Construct, id: string, **kwargs)
```


##### application <a name="application"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.SecretRotationApplication](#aws-cdk-lib.aws_secretsmanager.SecretRotationApplication) | **Required** | Default: undefined*

The serverless application for the rotation.


---

##### secret <a name="secret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Required** | Default: undefined*

The secret to rotate. It must be a JSON string with the following format:.

```
{
   "engine": <required: database engine>,
   "host": <required: instance host name>,
   "username": <required: username>,
   "password": <required: password>,
   "dbname": <optional: database name>,
   "port": <optional: if not specified, default port will be used>,
   "masterarn": <required for multi user rotation: the arn of the master secret which will be used to create users/change passwords>
}
```

This is typically the case for a secret referenced from an `AWS::SecretsManager::SecretTargetAttachment`
or an `ISecret` returned by the `attach()` method of `Secret`.


---

##### target <a name="target"></a>

- *Type: [aws-cdk-lib.aws_ec2.IConnectable](#aws-cdk-lib.aws_ec2.IConnectable) | **Required** | Default: undefined*

The target service or database.


---

##### vpc <a name="vpc"></a>

- *Type: [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc) | **Required** | Default: undefined*

The VPC where the Lambda rotation function will run.


---

##### automaticallyAfter <a name="automaticallyAfter"></a>

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.days(30)*

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.


---

##### excludeCharacters <a name="excludeCharacters"></a>

- *Type: string | **Optional** | Default: - no additional characters are explicitly excluded*

Characters which should not appear in the generated password.


---

##### masterSecret <a name="masterSecret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Optional** | Default: - single user rotation scheme*

The master secret for a multi user rotation scheme.


---

##### securityGroup <a name="securityGroup"></a>

- *Type: [aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup) | **Optional** | Default: - a new security group is created*

The security group for the Lambda rotation function.


---

##### vpcSubnets <a name="vpcSubnets"></a>

- *Type: [aws-cdk-lib.aws_ec2.SubnetSelection](#aws-cdk-lib.aws_ec2.SubnetSelection) | **Optional** | Default: - the Vpc default strategy if not specified.*

The type of subnets in the VPC where the Lambda rotation function will run.


---



### SecretTargetAttachment <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachment"></a>

An attached secret.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretTargetAttachment(scope: constructs.Construct, id: string, **kwargs)
```


##### secret <a name="secret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Required** | Default: undefined*

The secret to attach to the target.


---




## Structs <a name="Structs"></a>

### CfnResourcePolicyProps <a name="aws-cdk-lib.aws_secretsmanager.CfnResourcePolicyProps"></a>

Properties for defining a `AWS::SecretsManager::ResourcePolicy`.


### HostedRotationLambdaProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty"></a>


### RotationRulesProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty"></a>


### CfnRotationScheduleProps <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationScheduleProps"></a>

Properties for defining a `AWS::SecretsManager::RotationSchedule`.


### GenerateSecretStringProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty"></a>


### ReplicaRegionProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty"></a>


### CfnSecretProps <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretProps"></a>

Properties for defining a `AWS::SecretsManager::Secret`.


### CfnSecretTargetAttachmentProps <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachmentProps"></a>

Properties for defining a `AWS::SecretsManager::SecretTargetAttachment`.


### MultiUserHostedRotationOptions <a name="aws-cdk-lib.aws_secretsmanager.MultiUserHostedRotationOptions"></a>

Multi user hosted rotation options.


### ReplicaRegion <a name="aws-cdk-lib.aws_secretsmanager.ReplicaRegion"></a>

Secret replica region.


### ResourcePolicyProps <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicyProps"></a>

Construction properties for a ResourcePolicy.


### RotationScheduleOptions <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleOptions"></a>

Options to add a rotation schedule to a secret.


### RotationScheduleProps <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleProps"></a>

Construction properties for a RotationSchedule.


### SecretAttachmentTargetProps <a name="aws-cdk-lib.aws_secretsmanager.SecretAttachmentTargetProps"></a>

Attachment target specifications.


### SecretAttributes <a name="aws-cdk-lib.aws_secretsmanager.SecretAttributes"></a>

Attributes required to import an existing secret into the Stack.

One ARN format (`secretArn`, `secretCompleteArn`, `secretPartialArn`) must be provided.


### SecretProps <a name="aws-cdk-lib.aws_secretsmanager.SecretProps"></a>

The properties required to create a new secret in AWS Secrets Manager.


### SecretRotationApplicationOptions <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationApplicationOptions"></a>

Options for a SecretRotationApplication.


### SecretRotationProps <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationProps"></a>

Construction properties for a SecretRotation.


### SecretStringGenerator <a name="aws-cdk-lib.aws_secretsmanager.SecretStringGenerator"></a>

Configuration to generate secrets such as passwords automatically.


### SecretTargetAttachmentProps <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachmentProps"></a>

Construction properties for an AttachedSecret.


### SingleUserHostedRotationOptions <a name="aws-cdk-lib.aws_secretsmanager.SingleUserHostedRotationOptions"></a>

Single user hosted rotation options.


