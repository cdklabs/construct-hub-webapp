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

- *Implements:* [`aws_cdk..IInspectable`](#aws-cdk-lib.IInspectable)

A CloudFormation `AWS::SecretsManager::ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnResourcePolicy.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnResourcePolicy(scope: constructs..Construct, 
                                             id: builtins.str, 
                                             resource_policy: typing.Any, 
                                             secret_id: builtins.str, 
                                             block_public_policy: typing.Union[builtins.bool, aws_cdk..IResolvable] = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

 scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

 scoped id of the resource.

---

##### `resource_policy`<sup>Required</sup> <a name="resource_policy"></a>

- *Type:* `typing.Any`

`AWS::SecretsManager::ResourcePolicy.ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy)

---

##### `secret_id`<sup>Required</sup> <a name="secret_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::ResourcePolicy.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid)

---

##### `block_public_policy`<sup>Optional</sup> <a name="block_public_policy"></a>

- *Type:* typing.Union[`builtins.bool`,[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::ResourcePolicy.BlockPublicPolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy)

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


### CfnRotationSchedule <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule"></a>

- *Implements:* [`aws_cdk..IInspectable`](#aws-cdk-lib.IInspectable)

A CloudFormation `AWS::SecretsManager::RotationSchedule`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnRotationSchedule(scope: constructs..Construct, 
                                               id: builtins.str, 
                                               secret_id: builtins.str, 
                                               hosted_rotation_lambda: typing.Union[aws_cdk.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty, aws_cdk..IResolvable] = None, 
                                               rotation_lambda_arn: builtins.str = None, 
                                               rotation_rules: typing.Union[aws_cdk.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty, aws_cdk..IResolvable] = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

 scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

 scoped id of the resource.

---

##### `secret_id`<sup>Required</sup> <a name="secret_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::RotationSchedule.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid)

---

##### `hosted_rotation_lambda`<sup>Optional</sup> <a name="hosted_rotation_lambda"></a>

- *Type:* typing.Union[[`aws_cdk.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty`](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty),[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::RotationSchedule.HostedRotationLambda`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda)

---

##### `rotation_lambda_arn`<sup>Optional</sup> <a name="rotation_lambda_arn"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::RotationSchedule.RotationLambdaARN`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn)

---

##### `rotation_rules`<sup>Optional</sup> <a name="rotation_rules"></a>

- *Type:* typing.Union[[`aws_cdk.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty`](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty),[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::RotationSchedule.RotationRules`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules)

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


### CfnSecret <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret"></a>

- *Implements:* [`aws_cdk..IInspectable`](#aws-cdk-lib.IInspectable)

A CloudFormation `AWS::SecretsManager::Secret`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecret(scope: constructs..Construct, 
                                     id: builtins.str, 
                                     description: builtins.str = None, 
                                     generate_secret_string: typing.Union[aws_cdk.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty, aws_cdk..IResolvable] = None, 
                                     kms_key_id: builtins.str = None, 
                                     name: builtins.str = None, 
                                     replica_regions: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_secretsmanager.CfnSecret.ReplicaRegionProperty, aws_cdk..IResolvable]]] = None, 
                                     secret_string: builtins.str = None, 
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

##### `description`<sup>Optional</sup> <a name="description"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.Description`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description)

---

##### `generate_secret_string`<sup>Optional</sup> <a name="generate_secret_string"></a>

- *Type:* typing.Union[[`aws_cdk.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty`](#aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty),[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::Secret.GenerateSecretString`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring)

---

##### `kms_key_id`<sup>Optional</sup> <a name="kms_key_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.KmsKeyId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid)

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.Name`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name)

---

##### `replica_regions`<sup>Optional</sup> <a name="replica_regions"></a>

- *Type:* typing.Union[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable),typing.List[typing.Union[[`aws_cdk.aws_secretsmanager.CfnSecret.ReplicaRegionProperty`](#aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty),[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`AWS::SecretsManager::Secret.ReplicaRegions`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions)

---

##### `secret_string`<sup>Optional</sup> <a name="secret_string"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.SecretString`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* typing.List[[`aws_cdk..CfnTag`](#aws-cdk-lib.CfnTag)]

`AWS::SecretsManager::Secret.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags)

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


### CfnSecretTargetAttachment <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachment"></a>

- *Implements:* [`aws_cdk..IInspectable`](#aws-cdk-lib.IInspectable)

A CloudFormation `AWS::SecretsManager::SecretTargetAttachment`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachment.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecretTargetAttachment(scope: constructs..Construct, 
                                                     id: builtins.str, 
                                                     secret_id: builtins.str, 
                                                     target_id: builtins.str, 
                                                     target_type: builtins.str)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

 scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

 scoped id of the resource.

---

##### `secret_id`<sup>Required</sup> <a name="secret_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid)

---

##### `target_id`<sup>Required</sup> <a name="target_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.TargetId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid)

---

##### `target_type`<sup>Required</sup> <a name="target_type"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.TargetType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype)

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


### ResourcePolicy <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicy"></a>

Secret Resource Policy.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicy.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.ResourcePolicy(scope: constructs..Construct, 
                                          id: builtins.str, 
                                          secret: aws_cdk.aws_secretsmanager.ISecret)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

The secret to attach a resource-based permissions policy.

---



### RotationSchedule <a name="aws-cdk-lib.aws_secretsmanager.RotationSchedule"></a>

A rotation schedule.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.RotationSchedule.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.RotationSchedule(scope: constructs..Construct, 
                                            id: builtins.str, 
                                            automatically_after: aws_cdk..Duration = None, 
                                            hosted_rotation: aws_cdk.aws_secretsmanager.HostedRotation = None, 
                                            rotation_lambda: aws_cdk.aws_lambda.IFunction = None, 
                                            secret: aws_cdk.aws_secretsmanager.ISecret)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `automatically_after`<sup>Optional</sup> <a name="automatically_after"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `hosted_rotation`<sup>Optional</sup> <a name="hosted_rotation"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.HostedRotation`](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

##### `rotation_lambda`<sup>Optional</sup> <a name="rotation_lambda"></a>

- *Type:* [`aws_cdk.aws_lambda.IFunction`](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

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

- *Implements:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

Creates a new secret in AWS SecretsManager.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.Secret.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.Secret(scope: constructs..Construct, 
                                  id: builtins.str, 
                                  description: builtins.str = None, 
                                  encryption_key: aws_cdk.aws_kms.IKey = None, 
                                  generate_secret_string: aws_cdk.aws_secretsmanager.SecretStringGenerator = None, 
                                  removal_policy: aws_cdk..RemovalPolicy = None, 
                                  replica_regions: typing.List[aws_cdk.aws_secretsmanager.ReplicaRegion] = None, 
                                  secret_name: builtins.str = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `description`<sup>Optional</sup> <a name="description"></a>

- *Type:* `builtins.str`
- *Default:*  No description.

An optional, human-friendly description of the secret.

---

##### `encryption_key`<sup>Optional</sup> <a name="encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)
- *Default:*  A default KMS key for the account and region is used.

The customer-managed encryption key to use for encrypting the secret value.

---

##### `generate_secret_string`<sup>Optional</sup> <a name="generate_secret_string"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.SecretStringGenerator`](#aws-cdk-lib.aws_secretsmanager.SecretStringGenerator)
- *Default:*  32 characters with upper-case letters, lower-case letters, punctuation and numbers (at least one from each
category), per the default values of ``SecretStringGenerator``.

Configuration for how to generate a secret value.

---

##### `removal_policy`<sup>Optional</sup> <a name="removal_policy"></a>

- *Type:* [`aws_cdk..RemovalPolicy`](#aws-cdk-lib.RemovalPolicy)
- *Default:*  Not set.

Policy to apply when the secret is removed from this stack.

---

##### `replica_regions`<sup>Optional</sup> <a name="replica_regions"></a>

- *Type:* typing.List[[`aws_cdk.aws_secretsmanager.ReplicaRegion`](#aws-cdk-lib.aws_secretsmanager.ReplicaRegion)]
- *Default:*  Secret is not replicated

A list of regions where to replicate this secret.

---

##### `secret_name`<sup>Optional</sup> <a name="secret_name"></a>

- *Type:* `builtins.str`
- *Default:*  A name is generated by CloudFormation.

A name for the secret.

Note that deleting secrets from SecretsManager does not happen immediately, but after a 7 to
30 days blackout period. During that period, it is not possible to create another secret that shares the same name.

---

#### Methods <a name="Methods"></a>

##### `add_replica_region` <a name="add_replica_region"></a>

```python
def add_replica_region(region: builtins.str, 
                       encryption_key: aws_cdk.aws_kms.IKey = None)
```

###### `region`<sup>Required</sup> <a name="region"></a>

- *Type:* `builtins.str`

The name of the region.

---

###### `encryption_key`<sup>Optional</sup> <a name="encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)

The customer-managed encryption key to use for encrypting the secret value.

---

##### `add_rotation_schedule` <a name="add_rotation_schedule"></a>

```python
def add_rotation_schedule(id: builtins.str, 
                          automatically_after: aws_cdk..Duration = None, 
                          hosted_rotation: aws_cdk.aws_secretsmanager.HostedRotation = None, 
                          rotation_lambda: aws_cdk.aws_lambda.IFunction = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `automatically_after`<sup>Optional</sup> <a name="automatically_after"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

###### `hosted_rotation`<sup>Optional</sup> <a name="hosted_rotation"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.HostedRotation`](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

###### `rotation_lambda`<sup>Optional</sup> <a name="rotation_lambda"></a>

- *Type:* [`aws_cdk.aws_lambda.IFunction`](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

##### `add_to_resource_policy` <a name="add_to_resource_policy"></a>

```python
def add_to_resource_policy(statement: aws_cdk.aws_iam.PolicyStatement)
```

###### `statement`<sup>Required</sup> <a name="statement"></a>

- *Type:* [`aws_cdk.aws_iam.PolicyStatement`](#aws-cdk-lib.aws_iam.PolicyStatement)

---

##### `attach` <a name="attach"></a>

```python
def attach(target: aws_cdk.aws_secretsmanager.ISecretAttachmentTarget)
```

###### `target`<sup>Required</sup> <a name="target"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecretAttachmentTarget`](#aws-cdk-lib.aws_secretsmanager.ISecretAttachmentTarget)

The target to attach.

---

##### `deny_account_root_delete` <a name="deny_account_root_delete"></a>

```python
def deny_account_root_delete()
```

##### `grant_read` <a name="grant_read"></a>

```python
def grant_read(grantee: aws_cdk.aws_iam.IGrantable, 
               version_stages: typing.List[builtins.str] = None)
```

###### `grantee`<sup>Required</sup> <a name="grantee"></a>

- *Type:* [`aws_cdk.aws_iam.IGrantable`](#aws-cdk-lib.aws_iam.IGrantable)

---

###### `version_stages`<sup>Optional</sup> <a name="version_stages"></a>

- *Type:* typing.List[`builtins.str`]

---

##### `grant_write` <a name="grant_write"></a>

```python
def grant_write(grantee: aws_cdk.aws_iam.IGrantable)
```

###### `grantee`<sup>Required</sup> <a name="grantee"></a>

- *Type:* [`aws_cdk.aws_iam.IGrantable`](#aws-cdk-lib.aws_iam.IGrantable)

---

##### `secret_value_from_json` <a name="secret_value_from_json"></a>

```python
def secret_value_from_json(json_field: builtins.str)
```

###### `json_field`<sup>Required</sup> <a name="json_field"></a>

- *Type:* `builtins.str`

---

#### Functions <a name="Functions"></a>

##### `from_secret_attributes` <a name="from_secret_attributes"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.Secret(scope: constructs..Construct, 
                                  id: builtins.str, 
                                  encryption_key: aws_cdk.aws_kms.IKey = None, 
                                  secret_complete_arn: builtins.str = None, 
                                  secret_partial_arn: builtins.str = None)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

the scope of the import.

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

the ID of the imported Secret in the construct tree.

---

###### `encryption_key`<sup>Optional</sup> <a name="encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)

The encryption key that is used to encrypt the secret, unless the default SecretsManager key is used.

---

###### `secret_complete_arn`<sup>Optional</sup> <a name="secret_complete_arn"></a>

- *Type:* `builtins.str`

The complete ARN of the secret in SecretsManager.

This is the ARN including the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretPartialArn`.

---

###### `secret_partial_arn`<sup>Optional</sup> <a name="secret_partial_arn"></a>

- *Type:* `builtins.str`

The partial ARN of the secret in SecretsManager.

This is the ARN without the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretCompleteArn`.

---

##### `from_secret_complete_arn` <a name="from_secret_complete_arn"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.Secret(scope: constructs..Construct, 
                                  id: builtins.str, 
                                  secret_complete_arn: builtins.str)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `secret_complete_arn`<sup>Required</sup> <a name="secret_complete_arn"></a>

- *Type:* `builtins.str`

---

##### `from_secret_name_v2` <a name="from_secret_name_v2"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.Secret(scope: constructs..Construct, 
                                  id: builtins.str, 
                                  secret_name: builtins.str)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `secret_name`<sup>Required</sup> <a name="secret_name"></a>

- *Type:* `builtins.str`

---

##### `from_secret_partial_arn` <a name="from_secret_partial_arn"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.Secret(scope: constructs..Construct, 
                                  id: builtins.str, 
                                  secret_partial_arn: builtins.str)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `secret_partial_arn`<sup>Required</sup> <a name="secret_partial_arn"></a>

- *Type:* `builtins.str`

---

### SecretRotation <a name="aws-cdk-lib.aws_secretsmanager.SecretRotation"></a>

Secret rotation for a service or database.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretRotation.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretRotation(scope: constructs..Construct, 
                                          id: builtins.str, 
                                          application: aws_cdk.aws_secretsmanager.SecretRotationApplication, 
                                          secret: aws_cdk.aws_secretsmanager.ISecret, 
                                          target: aws_cdk.aws_ec2.IConnectable, 
                                          vpc: aws_cdk.aws_ec2.IVpc, 
                                          automatically_after: aws_cdk..Duration = None, 
                                          exclude_characters: builtins.str = None, 
                                          master_secret: aws_cdk.aws_secretsmanager.ISecret = None, 
                                          security_group: aws_cdk.aws_ec2.ISecurityGroup = None, 
                                          vpc_subnets: aws_cdk.aws_ec2.SubnetSelection = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `application`<sup>Required</sup> <a name="application"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.SecretRotationApplication`](#aws-cdk-lib.aws_secretsmanager.SecretRotationApplication)

The serverless application for the rotation.

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

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

> https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html

---

##### `target`<sup>Required</sup> <a name="target"></a>

- *Type:* [`aws_cdk.aws_ec2.IConnectable`](#aws-cdk-lib.aws_ec2.IConnectable)

The target service or database.

---

##### `vpc`<sup>Required</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)

The VPC where the Lambda rotation function will run.

---

##### `automatically_after`<sup>Optional</sup> <a name="automatically_after"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `exclude_characters`<sup>Optional</sup> <a name="exclude_characters"></a>

- *Type:* `builtins.str`
- *Default:*  no additional characters are explicitly excluded

Characters which should not appear in the generated password.

---

##### `master_secret`<sup>Optional</sup> <a name="master_secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)
- *Default:*  single user rotation scheme

The master secret for a multi user rotation scheme.

---

##### `security_group`<sup>Optional</sup> <a name="security_group"></a>

- *Type:* [`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:*  a new security group is created

The security group for the Lambda rotation function.

---

##### `vpc_subnets`<sup>Optional</sup> <a name="vpc_subnets"></a>

- *Type:* [`aws_cdk.aws_ec2.SubnetSelection`](#aws-cdk-lib.aws_ec2.SubnetSelection)
- *Default:*  the Vpc default strategy if not specified.

The type of subnets in the VPC where the Lambda rotation function will run.

---



### SecretTargetAttachment <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachment"></a>

- *Implements:* [`aws_cdk.aws_secretsmanager.ISecretTargetAttachment`](#aws-cdk-lib.aws_secretsmanager.ISecretTargetAttachment), [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

An attached secret.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachment.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretTargetAttachment(scope: constructs..Construct, 
                                                  id: builtins.str, 
                                                  secret: aws_cdk.aws_secretsmanager.ISecret)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

The secret to attach to the target.

---

#### Methods <a name="Methods"></a>

##### `add_rotation_schedule` <a name="add_rotation_schedule"></a>

```python
def add_rotation_schedule(id: builtins.str, 
                          automatically_after: aws_cdk..Duration = None, 
                          hosted_rotation: aws_cdk.aws_secretsmanager.HostedRotation = None, 
                          rotation_lambda: aws_cdk.aws_lambda.IFunction = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `automatically_after`<sup>Optional</sup> <a name="automatically_after"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

###### `hosted_rotation`<sup>Optional</sup> <a name="hosted_rotation"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.HostedRotation`](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

###### `rotation_lambda`<sup>Optional</sup> <a name="rotation_lambda"></a>

- *Type:* [`aws_cdk.aws_lambda.IFunction`](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

##### `add_to_resource_policy` <a name="add_to_resource_policy"></a>

```python
def add_to_resource_policy(statement: aws_cdk.aws_iam.PolicyStatement)
```

###### `statement`<sup>Required</sup> <a name="statement"></a>

- *Type:* [`aws_cdk.aws_iam.PolicyStatement`](#aws-cdk-lib.aws_iam.PolicyStatement)

---

##### `attach` <a name="attach"></a>

```python
def attach(target: aws_cdk.aws_secretsmanager.ISecretAttachmentTarget)
```

###### `target`<sup>Required</sup> <a name="target"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecretAttachmentTarget`](#aws-cdk-lib.aws_secretsmanager.ISecretAttachmentTarget)

The target to attach.

---

##### `deny_account_root_delete` <a name="deny_account_root_delete"></a>

```python
def deny_account_root_delete()
```

##### `grant_read` <a name="grant_read"></a>

```python
def grant_read(grantee: aws_cdk.aws_iam.IGrantable, 
               version_stages: typing.List[builtins.str] = None)
```

###### `grantee`<sup>Required</sup> <a name="grantee"></a>

- *Type:* [`aws_cdk.aws_iam.IGrantable`](#aws-cdk-lib.aws_iam.IGrantable)

---

###### `version_stages`<sup>Optional</sup> <a name="version_stages"></a>

- *Type:* typing.List[`builtins.str`]

---

##### `grant_write` <a name="grant_write"></a>

```python
def grant_write(grantee: aws_cdk.aws_iam.IGrantable)
```

###### `grantee`<sup>Required</sup> <a name="grantee"></a>

- *Type:* [`aws_cdk.aws_iam.IGrantable`](#aws-cdk-lib.aws_iam.IGrantable)

---

##### `secret_value_from_json` <a name="secret_value_from_json"></a>

```python
def secret_value_from_json(json_field: builtins.str)
```

###### `json_field`<sup>Required</sup> <a name="json_field"></a>

- *Type:* `builtins.str`

---

#### Functions <a name="Functions"></a>

##### `from_secret_target_attachment_secret_arn` <a name="from_secret_target_attachment_secret_arn"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretTargetAttachment(scope: constructs..Construct, 
                                                  id: builtins.str, 
                                                  secret_target_attachment_secret_arn: builtins.str)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [`constructs..Construct`](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `secret_target_attachment_secret_arn`<sup>Required</sup> <a name="secret_target_attachment_secret_arn"></a>

- *Type:* `builtins.str`

---

## Structs <a name="Structs"></a>

### CfnResourcePolicyProps <a name="aws-cdk-lib.aws_secretsmanager.CfnResourcePolicyProps"></a>

Properties for defining a `AWS::SecretsManager::ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnResourcePolicyProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnResourcePolicyProps(resource_policy: typing.Any, 
                                                  secret_id: builtins.str, 
                                                  block_public_policy: typing.Union[builtins.bool, aws_cdk..IResolvable] = None)
```

##### `resource_policy`<sup>Required</sup> <a name="resource_policy"></a>

- *Type:* `typing.Any`

`AWS::SecretsManager::ResourcePolicy.ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy)

---

##### `secret_id`<sup>Required</sup> <a name="secret_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::ResourcePolicy.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid)

---

##### `block_public_policy`<sup>Optional</sup> <a name="block_public_policy"></a>

- *Type:* typing.Union[`builtins.bool`,[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::ResourcePolicy.BlockPublicPolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy)

---

### CfnRotationScheduleProps <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationScheduleProps"></a>

Properties for defining a `AWS::SecretsManager::RotationSchedule`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationScheduleProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnRotationScheduleProps(secret_id: builtins.str, 
                                                    hosted_rotation_lambda: typing.Union[aws_cdk.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty, aws_cdk..IResolvable] = None, 
                                                    rotation_lambda_arn: builtins.str = None, 
                                                    rotation_rules: typing.Union[aws_cdk.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty, aws_cdk..IResolvable] = None)
```

##### `secret_id`<sup>Required</sup> <a name="secret_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::RotationSchedule.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid)

---

##### `hosted_rotation_lambda`<sup>Optional</sup> <a name="hosted_rotation_lambda"></a>

- *Type:* typing.Union[[`aws_cdk.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty`](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty),[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::RotationSchedule.HostedRotationLambda`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda)

---

##### `rotation_lambda_arn`<sup>Optional</sup> <a name="rotation_lambda_arn"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::RotationSchedule.RotationLambdaARN`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn)

---

##### `rotation_rules`<sup>Optional</sup> <a name="rotation_rules"></a>

- *Type:* typing.Union[[`aws_cdk.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty`](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty),[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::RotationSchedule.RotationRules`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules)

---

### CfnSecretProps <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretProps"></a>

Properties for defining a `AWS::SecretsManager::Secret`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecretProps(description: builtins.str = None, 
                                          generate_secret_string: typing.Union[aws_cdk.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty, aws_cdk..IResolvable] = None, 
                                          kms_key_id: builtins.str = None, 
                                          name: builtins.str = None, 
                                          replica_regions: typing.Union[aws_cdk..IResolvable, typing.List[typing.Union[aws_cdk.aws_secretsmanager.CfnSecret.ReplicaRegionProperty, aws_cdk..IResolvable]]] = None, 
                                          secret_string: builtins.str = None, 
                                          tags: typing.List[aws_cdk..CfnTag] = None)
```

##### `description`<sup>Optional</sup> <a name="description"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.Description`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description)

---

##### `generate_secret_string`<sup>Optional</sup> <a name="generate_secret_string"></a>

- *Type:* typing.Union[[`aws_cdk.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty`](#aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty),[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::Secret.GenerateSecretString`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring)

---

##### `kms_key_id`<sup>Optional</sup> <a name="kms_key_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.KmsKeyId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid)

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.Name`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name)

---

##### `replica_regions`<sup>Optional</sup> <a name="replica_regions"></a>

- *Type:* typing.Union[[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable),typing.List[typing.Union[[`aws_cdk.aws_secretsmanager.CfnSecret.ReplicaRegionProperty`](#aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty),[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]]]

`AWS::SecretsManager::Secret.ReplicaRegions`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions)

---

##### `secret_string`<sup>Optional</sup> <a name="secret_string"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.SecretString`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* typing.List[[`aws_cdk..CfnTag`](#aws-cdk-lib.CfnTag)]

`AWS::SecretsManager::Secret.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags)

---

### CfnSecretTargetAttachmentProps <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachmentProps"></a>

Properties for defining a `AWS::SecretsManager::SecretTargetAttachment`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachmentProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecretTargetAttachmentProps(secret_id: builtins.str, 
                                                          target_id: builtins.str, 
                                                          target_type: builtins.str)
```

##### `secret_id`<sup>Required</sup> <a name="secret_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid)

---

##### `target_id`<sup>Required</sup> <a name="target_id"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.TargetId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid)

---

##### `target_type`<sup>Required</sup> <a name="target_type"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.TargetType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype)

---

### GenerateSecretStringProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty(exclude_characters: builtins.str = None, 
                                                                  exclude_lowercase: typing.Union[builtins.bool, aws_cdk..IResolvable] = None, 
                                                                  exclude_numbers: typing.Union[builtins.bool, aws_cdk..IResolvable] = None, 
                                                                  exclude_punctuation: typing.Union[builtins.bool, aws_cdk..IResolvable] = None, 
                                                                  exclude_uppercase: typing.Union[builtins.bool, aws_cdk..IResolvable] = None, 
                                                                  generate_string_key: builtins.str = None, 
                                                                  include_space: typing.Union[builtins.bool, aws_cdk..IResolvable] = None, 
                                                                  password_length: typing.Union[int, float] = None, 
                                                                  require_each_included_type: typing.Union[builtins.bool, aws_cdk..IResolvable] = None, 
                                                                  secret_string_template: builtins.str = None)
```

##### `exclude_characters`<sup>Optional</sup> <a name="exclude_characters"></a>

- *Type:* `builtins.str`

`CfnSecret.GenerateSecretStringProperty.ExcludeCharacters`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludecharacters](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludecharacters)

---

##### `exclude_lowercase`<sup>Optional</sup> <a name="exclude_lowercase"></a>

- *Type:* typing.Union[`builtins.bool`,[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.ExcludeLowercase`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludelowercase](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludelowercase)

---

##### `exclude_numbers`<sup>Optional</sup> <a name="exclude_numbers"></a>

- *Type:* typing.Union[`builtins.bool`,[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.ExcludeNumbers`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludenumbers](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludenumbers)

---

##### `exclude_punctuation`<sup>Optional</sup> <a name="exclude_punctuation"></a>

- *Type:* typing.Union[`builtins.bool`,[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.ExcludePunctuation`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludepunctuation](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludepunctuation)

---

##### `exclude_uppercase`<sup>Optional</sup> <a name="exclude_uppercase"></a>

- *Type:* typing.Union[`builtins.bool`,[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.ExcludeUppercase`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludeuppercase](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludeuppercase)

---

##### `generate_string_key`<sup>Optional</sup> <a name="generate_string_key"></a>

- *Type:* `builtins.str`

`CfnSecret.GenerateSecretStringProperty.GenerateStringKey`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-generatestringkey](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-generatestringkey)

---

##### `include_space`<sup>Optional</sup> <a name="include_space"></a>

- *Type:* typing.Union[`builtins.bool`,[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.IncludeSpace`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-includespace](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-includespace)

---

##### `password_length`<sup>Optional</sup> <a name="password_length"></a>

- *Type:* typing.Union[`int`, `float`]

`CfnSecret.GenerateSecretStringProperty.PasswordLength`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-passwordlength](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-passwordlength)

---

##### `require_each_included_type`<sup>Optional</sup> <a name="require_each_included_type"></a>

- *Type:* typing.Union[`builtins.bool`,[`aws_cdk..IResolvable`](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.RequireEachIncludedType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-requireeachincludedtype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-requireeachincludedtype)

---

##### `secret_string_template`<sup>Optional</sup> <a name="secret_string_template"></a>

- *Type:* `builtins.str`

`CfnSecret.GenerateSecretStringProperty.SecretStringTemplate`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-secretstringtemplate](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-secretstringtemplate)

---

### HostedRotationLambdaProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty(rotation_type: builtins.str, 
                                                                            kms_key_arn: builtins.str = None, 
                                                                            master_secret_arn: builtins.str = None, 
                                                                            master_secret_kms_key_arn: builtins.str = None, 
                                                                            rotation_lambda_name: builtins.str = None, 
                                                                            vpc_security_group_ids: builtins.str = None, 
                                                                            vpc_subnet_ids: builtins.str = None)
```

##### `rotation_type`<sup>Required</sup> <a name="rotation_type"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.RotationType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationtype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationtype)

---

##### `kms_key_arn`<sup>Optional</sup> <a name="kms_key_arn"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.KmsKeyArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-kmskeyarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-kmskeyarn)

---

##### `master_secret_arn`<sup>Optional</sup> <a name="master_secret_arn"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.MasterSecretArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretarn)

---

##### `master_secret_kms_key_arn`<sup>Optional</sup> <a name="master_secret_kms_key_arn"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.MasterSecretKmsKeyArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretkmskeyarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretkmskeyarn)

---

##### `rotation_lambda_name`<sup>Optional</sup> <a name="rotation_lambda_name"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.RotationLambdaName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationlambdaname](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationlambdaname)

---

##### `vpc_security_group_ids`<sup>Optional</sup> <a name="vpc_security_group_ids"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.VpcSecurityGroupIds`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsecuritygroupids](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsecuritygroupids)

---

##### `vpc_subnet_ids`<sup>Optional</sup> <a name="vpc_subnet_ids"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.VpcSubnetIds`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsubnetids](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsubnetids)

---

### MultiUserHostedRotationOptions <a name="aws-cdk-lib.aws_secretsmanager.MultiUserHostedRotationOptions"></a>

Multi user hosted rotation options.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.MultiUserHostedRotationOptions.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.MultiUserHostedRotationOptions(master_secret: aws_cdk.aws_secretsmanager.ISecret, 
                                                          function_name: builtins.str = None, 
                                                          security_groups: typing.List[aws_cdk.aws_ec2.ISecurityGroup] = None, 
                                                          vpc: aws_cdk.aws_ec2.IVpc = None, 
                                                          availability_zones: typing.List[builtins.str] = None, 
                                                          one_per_az: builtins.bool = None, 
                                                          subnet_filters: typing.List[aws_cdk.aws_ec2.SubnetFilter] = None, 
                                                          subnet_group_name: builtins.str = None, 
                                                          subnets: typing.List[aws_cdk.aws_ec2.ISubnet] = None, 
                                                          subnet_type: aws_cdk.aws_ec2.SubnetType = None)
```

##### `master_secret`<sup>Required</sup> <a name="master_secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

The master secret for a multi user rotation scheme.

---

##### `function_name`<sup>Optional</sup> <a name="function_name"></a>

- *Type:* `builtins.str`
- *Default:*  a CloudFormation generated name

A name for the Lambda created to rotate the secret.

---

##### `security_groups`<sup>Optional</sup> <a name="security_groups"></a>

- *Type:* typing.List[[`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)]
- *Default:*  a new security group is created

A list of security groups for the Lambda created to rotate the secret.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  the Lambda is not deployed in a VPC

The VPC where the Lambda rotation function will run.

---

##### `availability_zones`<sup>Optional</sup> <a name="availability_zones"></a>

- *Type:* typing.List[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `one_per_az`<sup>Optional</sup> <a name="one_per_az"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnet_filters`<sup>Optional</sup> <a name="subnet_filters"></a>

- *Type:* typing.List[[`aws_cdk.aws_ec2.SubnetFilter`](#aws-cdk-lib.aws_ec2.SubnetFilter)]
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

- *Type:* typing.List[[`aws_cdk.aws_ec2.ISubnet`](#aws-cdk-lib.aws_ec2.ISubnet)]
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

### ReplicaRegion <a name="aws-cdk-lib.aws_secretsmanager.ReplicaRegion"></a>

Secret replica region.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.ReplicaRegion.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.ReplicaRegion(region: builtins.str, 
                                         encryption_key: aws_cdk.aws_kms.IKey = None)
```

##### `region`<sup>Required</sup> <a name="region"></a>

- *Type:* `builtins.str`

The name of the region.

---

##### `encryption_key`<sup>Optional</sup> <a name="encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)
- *Default:*  A default KMS key for the account and region is used.

The customer-managed encryption key to use for encrypting the secret value.

---

### ReplicaRegionProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecret.ReplicaRegionProperty(region: builtins.str, 
                                                           kms_key_id: builtins.str = None)
```

##### `region`<sup>Required</sup> <a name="region"></a>

- *Type:* `builtins.str`

`CfnSecret.ReplicaRegionProperty.Region`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-region](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-region)

---

##### `kms_key_id`<sup>Optional</sup> <a name="kms_key_id"></a>

- *Type:* `builtins.str`

`CfnSecret.ReplicaRegionProperty.KmsKeyId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-kmskeyid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-kmskeyid)

---

### ResourcePolicyProps <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicyProps"></a>

Construction properties for a ResourcePolicy.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicyProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.ResourcePolicyProps(secret: aws_cdk.aws_secretsmanager.ISecret)
```

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

The secret to attach a resource-based permissions policy.

---

### RotationRulesProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html)

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty(automatically_after_days: typing.Union[int, float] = None)
```

##### `automatically_after_days`<sup>Optional</sup> <a name="automatically_after_days"></a>

- *Type:* typing.Union[`int`, `float`]

`CfnRotationSchedule.RotationRulesProperty.AutomaticallyAfterDays`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html#cfn-secretsmanager-rotationschedule-rotationrules-automaticallyafterdays](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html#cfn-secretsmanager-rotationschedule-rotationrules-automaticallyafterdays)

---

### RotationScheduleOptions <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleOptions"></a>

Options to add a rotation schedule to a secret.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleOptions.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.RotationScheduleOptions(automatically_after: aws_cdk..Duration = None, 
                                                   hosted_rotation: aws_cdk.aws_secretsmanager.HostedRotation = None, 
                                                   rotation_lambda: aws_cdk.aws_lambda.IFunction = None)
```

##### `automatically_after`<sup>Optional</sup> <a name="automatically_after"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `hosted_rotation`<sup>Optional</sup> <a name="hosted_rotation"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.HostedRotation`](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

##### `rotation_lambda`<sup>Optional</sup> <a name="rotation_lambda"></a>

- *Type:* [`aws_cdk.aws_lambda.IFunction`](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

### RotationScheduleProps <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleProps"></a>

Construction properties for a RotationSchedule.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.RotationScheduleProps(secret: aws_cdk.aws_secretsmanager.ISecret, 
                                                 automatically_after: aws_cdk..Duration = None, 
                                                 hosted_rotation: aws_cdk.aws_secretsmanager.HostedRotation = None, 
                                                 rotation_lambda: aws_cdk.aws_lambda.IFunction = None)
```

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

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

##### `automatically_after`<sup>Optional</sup> <a name="automatically_after"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `hosted_rotation`<sup>Optional</sup> <a name="hosted_rotation"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.HostedRotation`](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

##### `rotation_lambda`<sup>Optional</sup> <a name="rotation_lambda"></a>

- *Type:* [`aws_cdk.aws_lambda.IFunction`](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:*  either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

### SecretAttachmentTargetProps <a name="aws-cdk-lib.aws_secretsmanager.SecretAttachmentTargetProps"></a>

Attachment target specifications.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretAttachmentTargetProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretAttachmentTargetProps(target_id: builtins.str, 
                                                       target_type: aws_cdk.aws_secretsmanager.AttachmentTargetType)
```

##### `target_id`<sup>Required</sup> <a name="target_id"></a>

- *Type:* `builtins.str`

The id of the target to attach the secret to.

---

##### `target_type`<sup>Required</sup> <a name="target_type"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.AttachmentTargetType`](#aws-cdk-lib.aws_secretsmanager.AttachmentTargetType)

The type of the target to attach the secret to.

---

### SecretAttributes <a name="aws-cdk-lib.aws_secretsmanager.SecretAttributes"></a>

Attributes required to import an existing secret into the Stack.

One ARN format (`secretArn`, `secretCompleteArn`, `secretPartialArn`) must be provided.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretAttributes.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretAttributes(encryption_key: aws_cdk.aws_kms.IKey = None, 
                                            secret_complete_arn: builtins.str = None, 
                                            secret_partial_arn: builtins.str = None)
```

##### `encryption_key`<sup>Optional</sup> <a name="encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)

The encryption key that is used to encrypt the secret, unless the default SecretsManager key is used.

---

##### `secret_complete_arn`<sup>Optional</sup> <a name="secret_complete_arn"></a>

- *Type:* `builtins.str`

The complete ARN of the secret in SecretsManager.

This is the ARN including the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretPartialArn`.

---

##### `secret_partial_arn`<sup>Optional</sup> <a name="secret_partial_arn"></a>

- *Type:* `builtins.str`

The partial ARN of the secret in SecretsManager.

This is the ARN without the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretCompleteArn`.

---

### SecretProps <a name="aws-cdk-lib.aws_secretsmanager.SecretProps"></a>

The properties required to create a new secret in AWS Secrets Manager.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretProps(description: builtins.str = None, 
                                       encryption_key: aws_cdk.aws_kms.IKey = None, 
                                       exclude_characters: builtins.str = None, 
                                       exclude_lowercase: builtins.bool = None, 
                                       exclude_numbers: builtins.bool = None, 
                                       exclude_punctuation: builtins.bool = None, 
                                       exclude_uppercase: builtins.bool = None, 
                                       generate_string_key: builtins.str = None, 
                                       include_space: builtins.bool = None, 
                                       password_length: typing.Union[int, float] = None, 
                                       require_each_included_type: builtins.bool = None, 
                                       secret_string_template: builtins.str = None, 
                                       removal_policy: aws_cdk..RemovalPolicy = None, 
                                       replica_regions: typing.List[aws_cdk.aws_secretsmanager.ReplicaRegion] = None, 
                                       secret_name: builtins.str = None)
```

##### `description`<sup>Optional</sup> <a name="description"></a>

- *Type:* `builtins.str`
- *Default:*  No description.

An optional, human-friendly description of the secret.

---

##### `encryption_key`<sup>Optional</sup> <a name="encryption_key"></a>

- *Type:* [`aws_cdk.aws_kms.IKey`](#aws-cdk-lib.aws_kms.IKey)
- *Default:*  A default KMS key for the account and region is used.

The customer-managed encryption key to use for encrypting the secret value.

---

##### `exclude_characters`<sup>Optional</sup> <a name="exclude_characters"></a>

- *Type:* `builtins.str`
- *Default:* no exclusions

A string that includes characters that shouldn't be included in the generated password.

The string can be a minimum
of ``0`` and a maximum of ``4096`` characters long.

---

##### `exclude_lowercase`<sup>Optional</sup> <a name="exclude_lowercase"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include lowercase letters.

---

##### `exclude_numbers`<sup>Optional</sup> <a name="exclude_numbers"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include digits.

---

##### `exclude_punctuation`<sup>Optional</sup> <a name="exclude_punctuation"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include punctuation characters.

---

##### `exclude_uppercase`<sup>Optional</sup> <a name="exclude_uppercase"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include uppercase letters.

---

##### `generate_string_key`<sup>Optional</sup> <a name="generate_string_key"></a>

- *Type:* `builtins.str`

The JSON key name that's used to add the generated password to the JSON structure specified by the ``secretStringTemplate`` parameter.

If you specify ``generateStringKey`` then ``secretStringTemplate``
must be also be specified.

---

##### `include_space`<sup>Optional</sup> <a name="include_space"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password can include the space character.

---

##### `password_length`<sup>Optional</sup> <a name="password_length"></a>

- *Type:* typing.Union[`int`, `float`]
- *Default:* 32

The desired length of the generated password.

---

##### `require_each_included_type`<sup>Optional</sup> <a name="require_each_included_type"></a>

- *Type:* `builtins.bool`
- *Default:* true

Specifies whether the generated password must include at least one of every allowed character type.

---

##### `secret_string_template`<sup>Optional</sup> <a name="secret_string_template"></a>

- *Type:* `builtins.str`

A properly structured JSON string that the generated password can be added to.

The ``generateStringKey`` is
combined with the generated random string and inserted into the JSON structure that's specified by this parameter.
The merged JSON string is returned as the completed SecretString of the secret. If you specify ``secretStringTemplate``
then ``generateStringKey`` must be also be specified.

---

##### `removal_policy`<sup>Optional</sup> <a name="removal_policy"></a>

- *Type:* [`aws_cdk..RemovalPolicy`](#aws-cdk-lib.RemovalPolicy)
- *Default:*  Not set.

Policy to apply when the secret is removed from this stack.

---

##### `replica_regions`<sup>Optional</sup> <a name="replica_regions"></a>

- *Type:* typing.List[[`aws_cdk.aws_secretsmanager.ReplicaRegion`](#aws-cdk-lib.aws_secretsmanager.ReplicaRegion)]
- *Default:*  Secret is not replicated

A list of regions where to replicate this secret.

---

##### `secret_name`<sup>Optional</sup> <a name="secret_name"></a>

- *Type:* `builtins.str`
- *Default:*  A name is generated by CloudFormation.

A name for the secret.

Note that deleting secrets from SecretsManager does not happen immediately, but after a 7 to
30 days blackout period. During that period, it is not possible to create another secret that shares the same name.

---

### SecretRotationApplicationOptions <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationApplicationOptions"></a>

Options for a SecretRotationApplication.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationApplicationOptions.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretRotationApplicationOptions(is_multi_user: builtins.bool = None)
```

##### `is_multi_user`<sup>Optional</sup> <a name="is_multi_user"></a>

- *Type:* `builtins.bool`
- *Default:* false

Whether the rotation application uses the mutli user scheme.

---

### SecretRotationProps <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationProps"></a>

Construction properties for a SecretRotation.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretRotationProps(application: aws_cdk.aws_secretsmanager.SecretRotationApplication, 
                                               secret: aws_cdk.aws_secretsmanager.ISecret, 
                                               target: aws_cdk.aws_ec2.IConnectable, 
                                               vpc: aws_cdk.aws_ec2.IVpc, 
                                               automatically_after: aws_cdk..Duration = None, 
                                               exclude_characters: builtins.str = None, 
                                               master_secret: aws_cdk.aws_secretsmanager.ISecret = None, 
                                               security_group: aws_cdk.aws_ec2.ISecurityGroup = None, 
                                               availability_zones: typing.List[builtins.str] = None, 
                                               one_per_az: builtins.bool = None, 
                                               subnet_filters: typing.List[aws_cdk.aws_ec2.SubnetFilter] = None, 
                                               subnet_group_name: builtins.str = None, 
                                               subnets: typing.List[aws_cdk.aws_ec2.ISubnet] = None, 
                                               subnet_type: aws_cdk.aws_ec2.SubnetType = None)
```

##### `application`<sup>Required</sup> <a name="application"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.SecretRotationApplication`](#aws-cdk-lib.aws_secretsmanager.SecretRotationApplication)

The serverless application for the rotation.

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

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

> https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html

---

##### `target`<sup>Required</sup> <a name="target"></a>

- *Type:* [`aws_cdk.aws_ec2.IConnectable`](#aws-cdk-lib.aws_ec2.IConnectable)

The target service or database.

---

##### `vpc`<sup>Required</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)

The VPC where the Lambda rotation function will run.

---

##### `automatically_after`<sup>Optional</sup> <a name="automatically_after"></a>

- *Type:* [`aws_cdk..Duration`](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `exclude_characters`<sup>Optional</sup> <a name="exclude_characters"></a>

- *Type:* `builtins.str`
- *Default:*  no additional characters are explicitly excluded

Characters which should not appear in the generated password.

---

##### `master_secret`<sup>Optional</sup> <a name="master_secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)
- *Default:*  single user rotation scheme

The master secret for a multi user rotation scheme.

---

##### `security_group`<sup>Optional</sup> <a name="security_group"></a>

- *Type:* [`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:*  a new security group is created

The security group for the Lambda rotation function.

---

##### `availability_zones`<sup>Optional</sup> <a name="availability_zones"></a>

- *Type:* typing.List[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `one_per_az`<sup>Optional</sup> <a name="one_per_az"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnet_filters`<sup>Optional</sup> <a name="subnet_filters"></a>

- *Type:* typing.List[[`aws_cdk.aws_ec2.SubnetFilter`](#aws-cdk-lib.aws_ec2.SubnetFilter)]
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

- *Type:* typing.List[[`aws_cdk.aws_ec2.ISubnet`](#aws-cdk-lib.aws_ec2.ISubnet)]
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

### SecretStringGenerator <a name="aws-cdk-lib.aws_secretsmanager.SecretStringGenerator"></a>

Configuration to generate secrets such as passwords automatically.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretStringGenerator.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretStringGenerator(exclude_characters: builtins.str = None, 
                                                 exclude_lowercase: builtins.bool = None, 
                                                 exclude_numbers: builtins.bool = None, 
                                                 exclude_punctuation: builtins.bool = None, 
                                                 exclude_uppercase: builtins.bool = None, 
                                                 generate_string_key: builtins.str = None, 
                                                 include_space: builtins.bool = None, 
                                                 password_length: typing.Union[int, float] = None, 
                                                 require_each_included_type: builtins.bool = None, 
                                                 secret_string_template: builtins.str = None)
```

##### `exclude_characters`<sup>Optional</sup> <a name="exclude_characters"></a>

- *Type:* `builtins.str`
- *Default:* no exclusions

A string that includes characters that shouldn't be included in the generated password.

The string can be a minimum
of ``0`` and a maximum of ``4096`` characters long.

---

##### `exclude_lowercase`<sup>Optional</sup> <a name="exclude_lowercase"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include lowercase letters.

---

##### `exclude_numbers`<sup>Optional</sup> <a name="exclude_numbers"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include digits.

---

##### `exclude_punctuation`<sup>Optional</sup> <a name="exclude_punctuation"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include punctuation characters.

---

##### `exclude_uppercase`<sup>Optional</sup> <a name="exclude_uppercase"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include uppercase letters.

---

##### `generate_string_key`<sup>Optional</sup> <a name="generate_string_key"></a>

- *Type:* `builtins.str`

The JSON key name that's used to add the generated password to the JSON structure specified by the ``secretStringTemplate`` parameter.

If you specify ``generateStringKey`` then ``secretStringTemplate``
must be also be specified.

---

##### `include_space`<sup>Optional</sup> <a name="include_space"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password can include the space character.

---

##### `password_length`<sup>Optional</sup> <a name="password_length"></a>

- *Type:* typing.Union[`int`, `float`]
- *Default:* 32

The desired length of the generated password.

---

##### `require_each_included_type`<sup>Optional</sup> <a name="require_each_included_type"></a>

- *Type:* `builtins.bool`
- *Default:* true

Specifies whether the generated password must include at least one of every allowed character type.

---

##### `secret_string_template`<sup>Optional</sup> <a name="secret_string_template"></a>

- *Type:* `builtins.str`

A properly structured JSON string that the generated password can be added to.

The ``generateStringKey`` is
combined with the generated random string and inserted into the JSON structure that's specified by this parameter.
The merged JSON string is returned as the completed SecretString of the secret. If you specify ``secretStringTemplate``
then ``generateStringKey`` must be also be specified.

---

### SecretTargetAttachmentProps <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachmentProps"></a>

Construction properties for an AttachedSecret.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachmentProps.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretTargetAttachmentProps(secret: aws_cdk.aws_secretsmanager.ISecret)
```

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [`aws_cdk.aws_secretsmanager.ISecret`](#aws-cdk-lib.aws_secretsmanager.ISecret)

The secret to attach to the target.

---

### SingleUserHostedRotationOptions <a name="aws-cdk-lib.aws_secretsmanager.SingleUserHostedRotationOptions"></a>

Single user hosted rotation options.

#### Initializer <a name="aws-cdk-lib.aws_secretsmanager.SingleUserHostedRotationOptions.Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SingleUserHostedRotationOptions(function_name: builtins.str = None, 
                                                           security_groups: typing.List[aws_cdk.aws_ec2.ISecurityGroup] = None, 
                                                           vpc: aws_cdk.aws_ec2.IVpc = None, 
                                                           availability_zones: typing.List[builtins.str] = None, 
                                                           one_per_az: builtins.bool = None, 
                                                           subnet_filters: typing.List[aws_cdk.aws_ec2.SubnetFilter] = None, 
                                                           subnet_group_name: builtins.str = None, 
                                                           subnets: typing.List[aws_cdk.aws_ec2.ISubnet] = None, 
                                                           subnet_type: aws_cdk.aws_ec2.SubnetType = None)
```

##### `function_name`<sup>Optional</sup> <a name="function_name"></a>

- *Type:* `builtins.str`
- *Default:*  a CloudFormation generated name

A name for the Lambda created to rotate the secret.

---

##### `security_groups`<sup>Optional</sup> <a name="security_groups"></a>

- *Type:* typing.List[[`aws_cdk.aws_ec2.ISecurityGroup`](#aws-cdk-lib.aws_ec2.ISecurityGroup)]
- *Default:*  a new security group is created

A list of security groups for the Lambda created to rotate the secret.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [`aws_cdk.aws_ec2.IVpc`](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:*  the Lambda is not deployed in a VPC

The VPC where the Lambda rotation function will run.

---

##### `availability_zones`<sup>Optional</sup> <a name="availability_zones"></a>

- *Type:* typing.List[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `one_per_az`<sup>Optional</sup> <a name="one_per_az"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnet_filters`<sup>Optional</sup> <a name="subnet_filters"></a>

- *Type:* typing.List[[`aws_cdk.aws_ec2.SubnetFilter`](#aws-cdk-lib.aws_ec2.SubnetFilter)]
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

- *Type:* typing.List[[`aws_cdk.aws_ec2.ISubnet`](#aws-cdk-lib.aws_ec2.ISubnet)]
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
