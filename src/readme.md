# AWS Secrets Manager Construct Library
<!--BEGIN STABILITY BANNER-->

---

![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)

![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)

---

<!--END STABILITY BANNER-->


```ts
import { aws_secretsmanager as secretsmanager } from 'aws-cdk-lib';
```

## Create a new Secret in a Stack

In order to have SecretsManager generate a new secret value automatically,
you can get started with the following:

[example of creating a secret](test/integ.secret.lit.ts)

The `Secret` construct does not allow specifying the `SecretString` property
of the `AWS::SecretsManager::Secret` resource (as this will almost always
lead to the secret being surfaced in plain text and possibly committed to
your source control).

If you need to use a pre-existing secret, the recommended way is to manually
provision the secret in *AWS SecretsManager* and use the `Secret.fromSecretArn`
or `Secret.fromSecretAttributes` method to make it available in your CDK Application:

```ts
const secret = secretsmanager.Secret.fromSecretAttributes(scope, 'ImportedSecret', {
  secretArn: 'arn:aws:secretsmanager:<region>:<account-id-number>:secret:<secret-name>-<random-6-characters>',
  // If the secret is encrypted using a KMS-hosted CMK, either import or reference that key:
  encryptionKey,
});
```

SecretsManager secret values can only be used in select set of properties. For the
list of properties, see [the CloudFormation Dynamic References documentation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/dynamic-references.html).

A secret can set `RemovalPolicy`. If it set to `RETAIN`, that removing a secret will fail.

## Grant permission to use the secret to a role

You must grant permission to a resource for that resource to be allowed to
use a secret. This can be achieved with the `Secret.grantRead` and/or `Secret.grantUpdate`
 method, depending on your need:

```ts
const role = new iam.Role(stack, 'SomeRole', { assumedBy: new iam.AccountRootPrincipal() });
const secret = new secretsmanager.Secret(stack, 'Secret');
secret.grantRead(role);
secret.grantWrite(role);
```

If, as in the following example, your secret was created with a KMS key:

```ts
const key = new kms.Key(stack, 'KMS');
const secret = new secretsmanager.Secret(stack, 'Secret', { encryptionKey: key });
secret.grantRead(role);
secret.grantWrite(role);
```

then `Secret.grantRead` and `Secret.grantWrite` will also grant the role the
relevant encrypt and decrypt permissions to the KMS key through the
SecretsManager service principal.

## Rotating a Secret

### Using a Custom Lambda Function

A rotation schedule can be added to a Secret using a custom Lambda function:

```ts
const fn = new lambda.Function(...);
const secret = new secretsmanager.Secret(this, 'Secret');

secret.addRotationSchedule('RotationSchedule', {
  rotationLambda: fn,
  automaticallyAfter: Duration.days(15)
});
```

Note: The required permissions for Lambda to call SecretsManager and the other way round are automatically granted based on [AWS Documentation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-required-permissions.html) as long as the Lambda is not imported.

See [Overview of the Lambda Rotation Function](https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets-lambda-function-overview.html) on how to implement a Lambda Rotation Function.

### Using a Hosted Lambda Function

Use the `hostedRotation` prop to rotate a secret with a hosted Lambda function:

```ts
const secret = new secretsmanager.Secret(this, 'Secret');

secret.addRotationSchedule('RotationSchedule', {
  hostedRotation: secretsmanager.HostedRotation.mysqlSingleUser(),
});
```

Hosted rotation is available for secrets representing credentials for MySQL, PostgreSQL, Oracle,
MariaDB, SQLServer, Redshift and MongoDB (both for the single and multi user schemes).

When deployed in a VPC, the hosted rotation implements `ec2.IConnectable`:

```ts
const myHostedRotation = secretsmanager.HostedRotation.mysqlSingleUser({ vpc: myVpc });
secret.addRotationSchedule('RotationSchedule', { hostedRotation: myHostedRotation });
dbConnections.allowDefaultPortFrom(hostedRotation);
```

See also [Automating secret creation in AWS CloudFormation](https://docs.aws.amazon.com/secretsmanager/latest/userguide/integrating_cloudformation.html).

## Rotating database credentials

Define a `SecretRotation` to rotate database credentials:

```ts
new secretsmanager.SecretRotation(this, 'SecretRotation', {
  application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_SINGLE_USER, // MySQL single user scheme
  secret: mySecret,
  target: myDatabase, // a Connectable
  vpc: myVpc, // The VPC where the secret rotation application will be deployed
  excludeCharacters: ' %+:;{}', // characters to never use when generating new passwords;
                                // by default, no characters are excluded,
                                // which might cause problems with some services, like DMS
});
```

The secret must be a JSON string with the following format:

```json
{
  "engine": "<required: database engine>",
  "host": "<required: instance host name>",
  "username": "<required: username>",
  "password": "<required: password>",
  "dbname": "<optional: database name>",
  "port": "<optional: if not specified, default port will be used>",
  "masterarn": "<required for multi user rotation: the arn of the master secret which will be used to create users/change passwords>"
}
```

For the multi user scheme, a `masterSecret` must be specified:

```ts
new secretsmanager.SecretRotation(stack, 'SecretRotation', {
  application: secretsmanager.SecretRotationApplication.MYSQL_ROTATION_MULTI_USER,
  secret: myUserSecret, // The secret that will be rotated
  masterSecret: myMasterSecret, // The secret used for the rotation
  target: myDatabase,
  vpc: myVpc,
});
```

See also [aws-rds](https://github.com/aws/aws-cdk/blob/master/packages/%40aws-cdk/aws-rds/README.md) where
credentials generation and rotation is integrated.

## Importing Secrets

Existing secrets can be imported by ARN, name, and other attributes (including the KMS key used to encrypt the secret).
Secrets imported by name should use the short-form of the name (without the SecretsManager-provided suffx);
the secret name must exist in the same account and region as the stack.
Importing by name makes it easier to reference secrets created in different regions, each with their own suffix and ARN.

```ts
import { aws_kms as kms } from 'aws-cdk-lib';

const secretCompleteArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret-f3gDy9';
const secretPartialArn = 'arn:aws:secretsmanager:eu-west-1:111111111111:secret:MySecret'; // No Secrets Manager suffix
const encryptionKey = kms.Key.fromKeyArn(stack, 'MyEncKey', 'arn:aws:kms:eu-west-1:111111111111:key/21c4b39b-fde2-4273-9ac0-d9bb5c0d0030');
const mySecretFromCompleteArn = secretsmanager.Secret.fromSecretCompleteArn(stack, 'SecretFromCompleteArn', secretCompleteArn);
const mySecretFromPartialArn = secretsmanager.Secret.fromSecretPartialArn(stack, 'SecretFromPartialArn', secretPartialArn);
const mySecretFromName = secretsmanager.Secret.fromSecretNameV2(stack, 'SecretFromName', 'MySecret')
const mySecretFromAttrs = secretsmanager.Secret.fromSecretAttributes(stack, 'SecretFromAttributes', {
  secretCompleteArn,
  encryptionKey,
});
```

## Replicating secrets

Secrets can be replicated to multiple regions by specifying `replicaRegions`:

```ts
new secretsmanager.Secret(this, 'Secret', {
  replicaRegions: [
    {
      region: 'eu-west-1',
    },
    {
      region: 'eu-central-1',
      encryptionKey: myKey,
    }
  ]
});
```

Alternatively, use `addReplicaRegion()`:

```ts
const secret = new secretsmanager.Secret(this, 'Secret');
secret.addReplicaRegion('eu-west-1');
```

# API Reference <a name="API Reference"></a>

## Constructs <a name="Constructs"></a>

### CfnResourcePolicy <a name="aws-cdk-lib.aws_secretsmanager.CfnResourcePolicy"></a>

A CloudFormation `AWS::SecretsManager::ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnResourcePolicy(scope: constructs.Construct, id: string, **kwargs)
```

##### `resourcePolicy` <a name="resourcePolicy"></a>

- *Type: [typing.Any](https://docs.python.org/3/library/typing.html#typing.Any) | **Required** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.ResourcePolicy`.

---

##### `secretId` <a name="secretId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.SecretId`.

---

##### `blockPublicPolicy` <a name="blockPublicPolicy"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[builtins.bool, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.BlockPublicPolicy`.

---

### CfnRotationSchedule <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule"></a>

A CloudFormation `AWS::SecretsManager::RotationSchedule`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnRotationSchedule(scope: constructs.Construct, id: string, **kwargs)
```

##### `secretId` <a name="secretId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.SecretId`.

---

##### `hostedRotationLambda` <a name="hostedRotationLambda"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.HostedRotationLambda`.

---

##### `rotationLambdaArn` <a name="rotationLambdaArn"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.RotationLambdaARN`.

---

##### `rotationRules` <a name="rotationRules"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.RotationRules`.

---

### CfnSecret <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret"></a>

A CloudFormation `AWS::SecretsManager::Secret`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecret(scope: constructs.Construct, id: string, **kwargs)
```

##### `description` <a name="description"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Description`.

---

##### `generateSecretString` <a name="generateSecretString"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.GenerateSecretString`.

---

##### `kmsKeyId` <a name="kmsKeyId"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.KmsKeyId`.

---

##### `name` <a name="name"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Name`.

---

##### `replicaRegions` <a name="replicaRegions"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable), [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]]] | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.ReplicaRegions`.

---

##### `secretString` <a name="secretString"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.SecretString`.

---

##### `tags` <a name="tags"></a>

- *Type: [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.CfnTag](#aws-cdk-lib.CfnTag)] | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Tags`.

---

### CfnSecretTargetAttachment <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachment"></a>

A CloudFormation `AWS::SecretsManager::SecretTargetAttachment`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecretTargetAttachment(scope: constructs.Construct, id: string, **kwargs)
```

##### `secretId` <a name="secretId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.SecretId`.

---

##### `targetId` <a name="targetId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.TargetId`.

---

##### `targetType` <a name="targetType"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.TargetType`.

---

### ResourcePolicy <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicy"></a>

Secret Resource Policy.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.ResourcePolicy(scope: constructs.Construct, id: string, **kwargs)
```

##### `secret` <a name="secret"></a>

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

##### `automaticallyAfter` <a name="automaticallyAfter"></a>

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.days(30)*

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `hostedRotation` <a name="hostedRotation"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation) | **Optional** | Default: - either `rotationLambda` or `hostedRotation` must be specified*

Hosted rotation.

---

##### `rotationLambda` <a name="rotationLambda"></a>

- *Type: [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction) | **Optional** | Default: - either `rotationLambda` or `hostedRotation` must be specified*

A Lambda function that can rotate the secret.

---

##### `secret` <a name="secret"></a>

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

##### `description` <a name="description"></a>

- *Type: builtins.str | **Optional** | Default: - No description.*

An optional, human-friendly description of the secret.

---

##### `encryptionKey` <a name="encryptionKey"></a>

- *Type: [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey) | **Optional** | Default: - A default KMS key for the account and region is used.*

The customer-managed encryption key to use for encrypting the secret value.

---

##### `generateSecretString` <a name="generateSecretString"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.SecretStringGenerator](#aws-cdk-lib.aws_secretsmanager.SecretStringGenerator) | **Optional** | Default: - 32 characters with upper-case letters, lower-case letters, punctuation and numbers (at least one from each
category), per the default values of ``SecretStringGenerator``.*

Configuration for how to generate a secret value.

---

##### `removalPolicy` <a name="removalPolicy"></a>

- *Type: [aws-cdk-lib.RemovalPolicy](#aws-cdk-lib.RemovalPolicy) | **Optional** | Default: - Not set.*

Policy to apply when the secret is removed from this stack.

---

##### `replicaRegions` <a name="replicaRegions"></a>

- *Type: [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_secretsmanager.ReplicaRegion](#aws-cdk-lib.aws_secretsmanager.ReplicaRegion)] | **Optional** | Default: - Secret is not replicated*

A list of regions where to replicate this secret.

---

##### `secretName` <a name="secretName"></a>

- *Type: builtins.str | **Optional** | Default: - A name is generated by CloudFormation.*

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

##### `application` <a name="application"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.SecretRotationApplication](#aws-cdk-lib.aws_secretsmanager.SecretRotationApplication) | **Required** | Default: undefined*

The serverless application for the rotation.

---

##### `secret` <a name="secret"></a>

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

##### `target` <a name="target"></a>

- *Type: [aws-cdk-lib.aws_ec2.IConnectable](#aws-cdk-lib.aws_ec2.IConnectable) | **Required** | Default: undefined*

The target service or database.

---

##### `vpc` <a name="vpc"></a>

- *Type: [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc) | **Required** | Default: undefined*

The VPC where the Lambda rotation function will run.

---

##### `automaticallyAfter` <a name="automaticallyAfter"></a>

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.days(30)*

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `excludeCharacters` <a name="excludeCharacters"></a>

- *Type: builtins.str | **Optional** | Default: - no additional characters are explicitly excluded*

Characters which should not appear in the generated password.

---

##### `masterSecret` <a name="masterSecret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Optional** | Default: - single user rotation scheme*

The master secret for a multi user rotation scheme.

---

##### `securityGroup` <a name="securityGroup"></a>

- *Type: [aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup) | **Optional** | Default: - a new security group is created*

The security group for the Lambda rotation function.

---

##### `vpcSubnets` <a name="vpcSubnets"></a>

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

##### `secret` <a name="secret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Required** | Default: undefined*

The secret to attach to the target.

---

## Structs <a name="Structs"></a>

### CfnResourcePolicyProps <a name="aws-cdk-lib.aws_secretsmanager.CfnResourcePolicyProps"></a>

Properties for defining a `AWS::SecretsManager::ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html)

#### `resourcePolicy` <a name="resourcePolicy"></a>

- *Type: [typing.Any](https://docs.python.org/3/library/typing.html#typing.Any) | **Required** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.ResourcePolicy`.

---

#### `secretId` <a name="secretId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.SecretId`.

---

#### `blockPublicPolicy` <a name="blockPublicPolicy"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[builtins.bool, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`AWS::SecretsManager::ResourcePolicy.BlockPublicPolicy`.

---

### CfnRotationScheduleProps <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationScheduleProps"></a>

Properties for defining a `AWS::SecretsManager::RotationSchedule`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html)

#### `secretId` <a name="secretId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.SecretId`.

---

#### `hostedRotationLambda` <a name="hostedRotationLambda"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.HostedRotationLambda`.

---

#### `rotationLambdaArn` <a name="rotationLambdaArn"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.RotationLambdaARN`.

---

#### `rotationRules` <a name="rotationRules"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`AWS::SecretsManager::RotationSchedule.RotationRules`.

---

### CfnSecretProps <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretProps"></a>

Properties for defining a `AWS::SecretsManager::Secret`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html)

#### `description` <a name="description"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Description`.

---

#### `generateSecretString` <a name="generateSecretString"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.GenerateSecretString`.

---

#### `kmsKeyId` <a name="kmsKeyId"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.KmsKeyId`.

---

#### `name` <a name="name"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Name`.

---

#### `replicaRegions` <a name="replicaRegions"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable), [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]]] | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.ReplicaRegions`.

---

#### `secretString` <a name="secretString"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.SecretString`.

---

#### `tags` <a name="tags"></a>

- *Type: [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.CfnTag](#aws-cdk-lib.CfnTag)] | **Optional** | Default: undefined*

`AWS::SecretsManager::Secret.Tags`.

---

### CfnSecretTargetAttachmentProps <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachmentProps"></a>

Properties for defining a `AWS::SecretsManager::SecretTargetAttachment`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html)

#### `secretId` <a name="secretId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.SecretId`.

---

#### `targetId` <a name="targetId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.TargetId`.

---

#### `targetType` <a name="targetType"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`AWS::SecretsManager::SecretTargetAttachment.TargetType`.

---

### GenerateSecretStringProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html)

#### `excludeCharacters` <a name="excludeCharacters"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.ExcludeCharacters`.

---

#### `excludeLowercase` <a name="excludeLowercase"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[builtins.bool, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.ExcludeLowercase`.

---

#### `excludeNumbers` <a name="excludeNumbers"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[builtins.bool, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.ExcludeNumbers`.

---

#### `excludePunctuation` <a name="excludePunctuation"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[builtins.bool, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.ExcludePunctuation`.

---

#### `excludeUppercase` <a name="excludeUppercase"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[builtins.bool, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.ExcludeUppercase`.

---

#### `generateStringKey` <a name="generateStringKey"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.GenerateStringKey`.

---

#### `includeSpace` <a name="includeSpace"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[builtins.bool, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.IncludeSpace`.

---

#### `passwordLength` <a name="passwordLength"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[int, float] | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.PasswordLength`.

---

#### `requireEachIncludedType` <a name="requireEachIncludedType"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[builtins.bool, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)] | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.RequireEachIncludedType`.

---

#### `secretStringTemplate` <a name="secretStringTemplate"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnSecret.GenerateSecretStringProperty.SecretStringTemplate`.

---

### HostedRotationLambdaProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html)

#### `rotationType` <a name="rotationType"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`CfnRotationSchedule.HostedRotationLambdaProperty.RotationType`.

---

#### `kmsKeyArn` <a name="kmsKeyArn"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnRotationSchedule.HostedRotationLambdaProperty.KmsKeyArn`.

---

#### `masterSecretArn` <a name="masterSecretArn"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnRotationSchedule.HostedRotationLambdaProperty.MasterSecretArn`.

---

#### `masterSecretKmsKeyArn` <a name="masterSecretKmsKeyArn"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnRotationSchedule.HostedRotationLambdaProperty.MasterSecretKmsKeyArn`.

---

#### `rotationLambdaName` <a name="rotationLambdaName"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnRotationSchedule.HostedRotationLambdaProperty.RotationLambdaName`.

---

#### `vpcSecurityGroupIds` <a name="vpcSecurityGroupIds"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnRotationSchedule.HostedRotationLambdaProperty.VpcSecurityGroupIds`.

---

#### `vpcSubnetIds` <a name="vpcSubnetIds"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnRotationSchedule.HostedRotationLambdaProperty.VpcSubnetIds`.

---

### MultiUserHostedRotationOptions <a name="aws-cdk-lib.aws_secretsmanager.MultiUserHostedRotationOptions"></a>

Multi user hosted rotation options.

#### `functionName` <a name="functionName"></a>

- *Type: builtins.str | **Optional** | Default: - a CloudFormation generated name*

A name for the Lambda created to rotate the secret.

---

#### `securityGroups` <a name="securityGroups"></a>

- *Type: [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup)] | **Optional** | Default: - a new security group is created*

A list of security groups for the Lambda created to rotate the secret.

---

#### `vpc` <a name="vpc"></a>

- *Type: [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc) | **Optional** | Default: - the Lambda is not deployed in a VPC*

The VPC where the Lambda rotation function will run.

---

#### `vpcSubnets` <a name="vpcSubnets"></a>

- *Type: [aws-cdk-lib.aws_ec2.SubnetSelection](#aws-cdk-lib.aws_ec2.SubnetSelection) | **Optional** | Default: - the Vpc default strategy if not specified.*

The type of subnets in the VPC where the Lambda rotation function will run.

---

#### `masterSecret` <a name="masterSecret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Required** | Default: undefined*

The master secret for a multi user rotation scheme.

---

### ReplicaRegion <a name="aws-cdk-lib.aws_secretsmanager.ReplicaRegion"></a>

Secret replica region.

#### `region` <a name="region"></a>

- *Type: builtins.str | **Required** | Default: undefined*

The name of the region.

---

#### `encryptionKey` <a name="encryptionKey"></a>

- *Type: [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey) | **Optional** | Default: - A default KMS key for the account and region is used.*

The customer-managed encryption key to use for encrypting the secret value.

---

### ReplicaRegionProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html)

#### `region` <a name="region"></a>

- *Type: builtins.str | **Required** | Default: undefined*

`CfnSecret.ReplicaRegionProperty.Region`.

---

#### `kmsKeyId` <a name="kmsKeyId"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

`CfnSecret.ReplicaRegionProperty.KmsKeyId`.

---

### ResourcePolicyProps <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicyProps"></a>

Construction properties for a ResourcePolicy.

#### `secret` <a name="secret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Required** | Default: undefined*

The secret to attach a resource-based permissions policy.

---

### RotationRulesProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html)

#### `automaticallyAfterDays` <a name="automaticallyAfterDays"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[int, float] | **Optional** | Default: undefined*

`CfnRotationSchedule.RotationRulesProperty.AutomaticallyAfterDays`.

---

### RotationScheduleOptions <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleOptions"></a>

Options to add a rotation schedule to a secret.

#### `automaticallyAfter` <a name="automaticallyAfter"></a>

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.days(30)*

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

#### `hostedRotation` <a name="hostedRotation"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation) | **Optional** | Default: - either `rotationLambda` or `hostedRotation` must be specified*

Hosted rotation.

---

#### `rotationLambda` <a name="rotationLambda"></a>

- *Type: [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction) | **Optional** | Default: - either `rotationLambda` or `hostedRotation` must be specified*

A Lambda function that can rotate the secret.

---

### RotationScheduleProps <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleProps"></a>

Construction properties for a RotationSchedule.

#### `automaticallyAfter` <a name="automaticallyAfter"></a>

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.days(30)*

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

#### `hostedRotation` <a name="hostedRotation"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation) | **Optional** | Default: - either `rotationLambda` or `hostedRotation` must be specified*

Hosted rotation.

---

#### `rotationLambda` <a name="rotationLambda"></a>

- *Type: [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction) | **Optional** | Default: - either `rotationLambda` or `hostedRotation` must be specified*

A Lambda function that can rotate the secret.

---

#### `secret` <a name="secret"></a>

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

### SecretAttachmentTargetProps <a name="aws-cdk-lib.aws_secretsmanager.SecretAttachmentTargetProps"></a>

Attachment target specifications.

#### `targetId` <a name="targetId"></a>

- *Type: builtins.str | **Required** | Default: undefined*

The id of the target to attach the secret to.

---

#### `targetType` <a name="targetType"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.AttachmentTargetType](#aws-cdk-lib.aws_secretsmanager.AttachmentTargetType) | **Required** | Default: undefined*

The type of the target to attach the secret to.

---

### SecretAttributes <a name="aws-cdk-lib.aws_secretsmanager.SecretAttributes"></a>

Attributes required to import an existing secret into the Stack.

One ARN format (`secretArn`, `secretCompleteArn`, `secretPartialArn`) must be provided.

#### `encryptionKey` <a name="encryptionKey"></a>

- *Type: [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey) | **Optional** | Default: undefined*

The encryption key that is used to encrypt the secret, unless the default SecretsManager key is used.

---

#### `secretCompleteArn` <a name="secretCompleteArn"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

The complete ARN of the secret in SecretsManager.

This is the ARN including the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretPartialArn`.

---

#### `secretPartialArn` <a name="secretPartialArn"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

The partial ARN of the secret in SecretsManager.

This is the ARN without the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretCompleteArn`.

---

### SecretProps <a name="aws-cdk-lib.aws_secretsmanager.SecretProps"></a>

The properties required to create a new secret in AWS Secrets Manager.

#### `description` <a name="description"></a>

- *Type: builtins.str | **Optional** | Default: - No description.*

An optional, human-friendly description of the secret.

---

#### `encryptionKey` <a name="encryptionKey"></a>

- *Type: [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey) | **Optional** | Default: - A default KMS key for the account and region is used.*

The customer-managed encryption key to use for encrypting the secret value.

---

#### `generateSecretString` <a name="generateSecretString"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.SecretStringGenerator](#aws-cdk-lib.aws_secretsmanager.SecretStringGenerator) | **Optional** | Default: - 32 characters with upper-case letters, lower-case letters, punctuation and numbers (at least one from each
category), per the default values of ``SecretStringGenerator``.*

Configuration for how to generate a secret value.

---

#### `removalPolicy` <a name="removalPolicy"></a>

- *Type: [aws-cdk-lib.RemovalPolicy](#aws-cdk-lib.RemovalPolicy) | **Optional** | Default: - Not set.*

Policy to apply when the secret is removed from this stack.

---

#### `replicaRegions` <a name="replicaRegions"></a>

- *Type: [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_secretsmanager.ReplicaRegion](#aws-cdk-lib.aws_secretsmanager.ReplicaRegion)] | **Optional** | Default: - Secret is not replicated*

A list of regions where to replicate this secret.

---

#### `secretName` <a name="secretName"></a>

- *Type: builtins.str | **Optional** | Default: - A name is generated by CloudFormation.*

A name for the secret.

Note that deleting secrets from SecretsManager does not happen immediately, but after a 7 to
30 days blackout period. During that period, it is not possible to create another secret that shares the same name.

---

### SecretRotationApplicationOptions <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationApplicationOptions"></a>

Options for a SecretRotationApplication.

#### `isMultiUser` <a name="isMultiUser"></a>

- *Type: builtins.bool | **Optional** | Default: false*

Whether the rotation application uses the mutli user scheme.

---

### SecretRotationProps <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationProps"></a>

Construction properties for a SecretRotation.

#### `application` <a name="application"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.SecretRotationApplication](#aws-cdk-lib.aws_secretsmanager.SecretRotationApplication) | **Required** | Default: undefined*

The serverless application for the rotation.

---

#### `secret` <a name="secret"></a>

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

#### `target` <a name="target"></a>

- *Type: [aws-cdk-lib.aws_ec2.IConnectable](#aws-cdk-lib.aws_ec2.IConnectable) | **Required** | Default: undefined*

The target service or database.

---

#### `vpc` <a name="vpc"></a>

- *Type: [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc) | **Required** | Default: undefined*

The VPC where the Lambda rotation function will run.

---

#### `automaticallyAfter` <a name="automaticallyAfter"></a>

- *Type: [aws-cdk-lib.Duration](#aws-cdk-lib.Duration) | **Optional** | Default: Duration.days(30)*

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

#### `excludeCharacters` <a name="excludeCharacters"></a>

- *Type: builtins.str | **Optional** | Default: - no additional characters are explicitly excluded*

Characters which should not appear in the generated password.

---

#### `masterSecret` <a name="masterSecret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Optional** | Default: - single user rotation scheme*

The master secret for a multi user rotation scheme.

---

#### `securityGroup` <a name="securityGroup"></a>

- *Type: [aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup) | **Optional** | Default: - a new security group is created*

The security group for the Lambda rotation function.

---

#### `vpcSubnets` <a name="vpcSubnets"></a>

- *Type: [aws-cdk-lib.aws_ec2.SubnetSelection](#aws-cdk-lib.aws_ec2.SubnetSelection) | **Optional** | Default: - the Vpc default strategy if not specified.*

The type of subnets in the VPC where the Lambda rotation function will run.

---

### SecretStringGenerator <a name="aws-cdk-lib.aws_secretsmanager.SecretStringGenerator"></a>

Configuration to generate secrets such as passwords automatically.

#### `excludeCharacters` <a name="excludeCharacters"></a>

- *Type: builtins.str | **Optional** | Default: no exclusions*

A string that includes characters that shouldn't be included in the generated password.

The string can be a minimum
of ``0`` and a maximum of ``4096`` characters long.

---

#### `excludeLowercase` <a name="excludeLowercase"></a>

- *Type: builtins.bool | **Optional** | Default: false*

Specifies that the generated password shouldn't include lowercase letters.

---

#### `excludeNumbers` <a name="excludeNumbers"></a>

- *Type: builtins.bool | **Optional** | Default: false*

Specifies that the generated password shouldn't include digits.

---

#### `excludePunctuation` <a name="excludePunctuation"></a>

- *Type: builtins.bool | **Optional** | Default: false*

Specifies that the generated password shouldn't include punctuation characters.

---

#### `excludeUppercase` <a name="excludeUppercase"></a>

- *Type: builtins.bool | **Optional** | Default: false*

Specifies that the generated password shouldn't include uppercase letters.

---

#### `generateStringKey` <a name="generateStringKey"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

The JSON key name that's used to add the generated password to the JSON structure specified by the ``secretStringTemplate`` parameter.

If you specify ``generateStringKey`` then ``secretStringTemplate``
must be also be specified.

---

#### `includeSpace` <a name="includeSpace"></a>

- *Type: builtins.bool | **Optional** | Default: false*

Specifies that the generated password can include the space character.

---

#### `passwordLength` <a name="passwordLength"></a>

- *Type: [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[int, float] | **Optional** | Default: 32*

The desired length of the generated password.

---

#### `requireEachIncludedType` <a name="requireEachIncludedType"></a>

- *Type: builtins.bool | **Optional** | Default: true*

Specifies whether the generated password must include at least one of every allowed character type.

---

#### `secretStringTemplate` <a name="secretStringTemplate"></a>

- *Type: builtins.str | **Optional** | Default: undefined*

A properly structured JSON string that the generated password can be added to.

The ``generateStringKey`` is
combined with the generated random string and inserted into the JSON structure that's specified by this parameter.
The merged JSON string is returned as the completed SecretString of the secret. If you specify ``secretStringTemplate``
then ``generateStringKey`` must be also be specified.

---

### SecretTargetAttachmentProps <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachmentProps"></a>

Construction properties for an AttachedSecret.

#### `secret` <a name="secret"></a>

- *Type: [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret) | **Required** | Default: undefined*

The secret to attach to the target.

---

### SingleUserHostedRotationOptions <a name="aws-cdk-lib.aws_secretsmanager.SingleUserHostedRotationOptions"></a>

Single user hosted rotation options.

#### `functionName` <a name="functionName"></a>

- *Type: builtins.str | **Optional** | Default: - a CloudFormation generated name*

A name for the Lambda created to rotate the secret.

---

#### `securityGroups` <a name="securityGroups"></a>

- *Type: [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup)] | **Optional** | Default: - a new security group is created*

A list of security groups for the Lambda created to rotate the secret.

---

#### `vpc` <a name="vpc"></a>

- *Type: [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc) | **Optional** | Default: - the Lambda is not deployed in a VPC*

The VPC where the Lambda rotation function will run.

---

#### `vpcSubnets` <a name="vpcSubnets"></a>

- *Type: [aws-cdk-lib.aws_ec2.SubnetSelection](#aws-cdk-lib.aws_ec2.SubnetSelection) | **Optional** | Default: - the Vpc default strategy if not specified.*

The type of subnets in the VPC where the Lambda rotation function will run.

---
