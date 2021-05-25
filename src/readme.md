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

- *Implements:* [aws-cdk-lib.IInspectable](aws-cdk-lib.IInspectable)

A CloudFormation `AWS::SecretsManager::ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnResourcePolicy(scope: constructs.Construct, 
                  id: string, 
                  resourcePolicy: any, 
                  secretId: string, 
                  blockPublicPolicy: boolean | aws-cdk-lib.IResolvable = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

- scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

- scoped id of the resource.

---

##### `resourcePolicy`<sup>Required</sup> <a name="resourcePolicy"></a>

- *Type:* [typing.Any](https://docs.python.org/3/library/typing.html#typing.Any)

`AWS::SecretsManager::ResourcePolicy.ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy)

---

##### `secretId`<sup>Required</sup> <a name="secretId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::ResourcePolicy.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid)

---

##### `blockPublicPolicy`<sup>Optional</sup> <a name="blockPublicPolicy"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[`builtins.bool`, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::ResourcePolicy.BlockPublicPolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy)

---

#### Methods <a name="Methods"></a>

##### `inspect` <a name="inspect"></a>

```python
def inspect(inspector: aws-cdk-lib.TreeInspector)
```

###### `inspector`<sup>Required</sup> <a name="inspector"></a>

- *Type:* [aws-cdk-lib.TreeInspector](#aws-cdk-lib.TreeInspector)

- tree inspector to collect and process attributes.

---

##### `renderProperties` <a name="renderProperties"></a>

```python
def renderProperties(props: Map<string => any>)
```

###### `props`<sup>Required</sup> <a name="props"></a>

- *Type:* [typing.Mapping](https://docs.python.org/3/library/typing.html#typing.Mapping)[[typing.Any](https://docs.python.org/3/library/typing.html#typing.Any)]

---


### CfnRotationSchedule <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule"></a>

- *Implements:* [aws-cdk-lib.IInspectable](aws-cdk-lib.IInspectable)

A CloudFormation `AWS::SecretsManager::RotationSchedule`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnRotationSchedule(scope: constructs.Construct, 
                  id: string, 
                  secretId: string, 
                  hostedRotationLambda: aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty | aws-cdk-lib.IResolvable = None, 
                  rotationLambdaArn: string = None, 
                  rotationRules: aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty | aws-cdk-lib.IResolvable = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

- scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

- scoped id of the resource.

---

##### `secretId`<sup>Required</sup> <a name="secretId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::RotationSchedule.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid)

---

##### `hostedRotationLambda`<sup>Optional</sup> <a name="hostedRotationLambda"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::RotationSchedule.HostedRotationLambda`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda)

---

##### `rotationLambdaArn`<sup>Optional</sup> <a name="rotationLambdaArn"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::RotationSchedule.RotationLambdaARN`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn)

---

##### `rotationRules`<sup>Optional</sup> <a name="rotationRules"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::RotationSchedule.RotationRules`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules)

---

#### Methods <a name="Methods"></a>

##### `inspect` <a name="inspect"></a>

```python
def inspect(inspector: aws-cdk-lib.TreeInspector)
```

###### `inspector`<sup>Required</sup> <a name="inspector"></a>

- *Type:* [aws-cdk-lib.TreeInspector](#aws-cdk-lib.TreeInspector)

- tree inspector to collect and process attributes.

---

##### `renderProperties` <a name="renderProperties"></a>

```python
def renderProperties(props: Map<string => any>)
```

###### `props`<sup>Required</sup> <a name="props"></a>

- *Type:* [typing.Mapping](https://docs.python.org/3/library/typing.html#typing.Mapping)[[typing.Any](https://docs.python.org/3/library/typing.html#typing.Any)]

---


### CfnSecret <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret"></a>

- *Implements:* [aws-cdk-lib.IInspectable](aws-cdk-lib.IInspectable)

A CloudFormation `AWS::SecretsManager::Secret`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecret(scope: constructs.Construct, 
                  id: string, 
                  description: string = None, 
                  generateSecretString: aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty | aws-cdk-lib.IResolvable = None, 
                  kmsKeyId: string = None, 
                  name: string = None, 
                  replicaRegions: aws-cdk-lib.IResolvable | Array<aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty | aws-cdk-lib.IResolvable> = None, 
                  secretString: string = None, 
                  tags: Array<aws-cdk-lib.CfnTag> = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

- scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

- scoped id of the resource.

---

##### `description`<sup>Optional</sup> <a name="description"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.Description`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description)

---

##### `generateSecretString`<sup>Optional</sup> <a name="generateSecretString"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::Secret.GenerateSecretString`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring)

---

##### `kmsKeyId`<sup>Optional</sup> <a name="kmsKeyId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.KmsKeyId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid)

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.Name`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name)

---

##### `replicaRegions`<sup>Optional</sup> <a name="replicaRegions"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable), [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]]]

`AWS::SecretsManager::Secret.ReplicaRegions`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions)

---

##### `secretString`<sup>Optional</sup> <a name="secretString"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.SecretString`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.CfnTag](#aws-cdk-lib.CfnTag)]

`AWS::SecretsManager::Secret.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags)

---

#### Methods <a name="Methods"></a>

##### `inspect` <a name="inspect"></a>

```python
def inspect(inspector: aws-cdk-lib.TreeInspector)
```

###### `inspector`<sup>Required</sup> <a name="inspector"></a>

- *Type:* [aws-cdk-lib.TreeInspector](#aws-cdk-lib.TreeInspector)

- tree inspector to collect and process attributes.

---

##### `renderProperties` <a name="renderProperties"></a>

```python
def renderProperties(props: Map<string => any>)
```

###### `props`<sup>Required</sup> <a name="props"></a>

- *Type:* [typing.Mapping](https://docs.python.org/3/library/typing.html#typing.Mapping)[[typing.Any](https://docs.python.org/3/library/typing.html#typing.Any)]

---


### CfnSecretTargetAttachment <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachment"></a>

- *Implements:* [aws-cdk-lib.IInspectable](aws-cdk-lib.IInspectable)

A CloudFormation `AWS::SecretsManager::SecretTargetAttachment`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecretTargetAttachment(scope: constructs.Construct, 
                  id: string, 
                  secretId: string, 
                  targetId: string, 
                  targetType: string)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

- scope in which this resource is defined.

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

- scoped id of the resource.

---

##### `secretId`<sup>Required</sup> <a name="secretId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid)

---

##### `targetId`<sup>Required</sup> <a name="targetId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.TargetId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid)

---

##### `targetType`<sup>Required</sup> <a name="targetType"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.TargetType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype)

---

#### Methods <a name="Methods"></a>

##### `inspect` <a name="inspect"></a>

```python
def inspect(inspector: aws-cdk-lib.TreeInspector)
```

###### `inspector`<sup>Required</sup> <a name="inspector"></a>

- *Type:* [aws-cdk-lib.TreeInspector](#aws-cdk-lib.TreeInspector)

- tree inspector to collect and process attributes.

---

##### `renderProperties` <a name="renderProperties"></a>

```python
def renderProperties(props: Map<string => any>)
```

###### `props`<sup>Required</sup> <a name="props"></a>

- *Type:* [typing.Mapping](https://docs.python.org/3/library/typing.html#typing.Mapping)[[typing.Any](https://docs.python.org/3/library/typing.html#typing.Any)]

---


### ResourcePolicy <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicy"></a>

Secret Resource Policy.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.ResourcePolicy(scope: constructs.Construct, 
                  id: string, 
                  secret: aws-cdk-lib.aws_secretsmanager.ISecret)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

The secret to attach a resource-based permissions policy.

---



### RotationSchedule <a name="aws-cdk-lib.aws_secretsmanager.RotationSchedule"></a>

A rotation schedule.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.RotationSchedule(scope: constructs.Construct, 
                  id: string, 
                  automaticallyAfter: aws-cdk-lib.Duration = None, 
                  hostedRotation: aws-cdk-lib.aws_secretsmanager.HostedRotation = None, 
                  rotationLambda: aws-cdk-lib.aws_lambda.IFunction = None, 
                  secret: aws-cdk-lib.aws_secretsmanager.ISecret)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `automaticallyAfter`<sup>Optional</sup> <a name="automaticallyAfter"></a>

- *Type:* [aws-cdk-lib.Duration](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `hostedRotation`<sup>Optional</sup> <a name="hostedRotation"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

##### `rotationLambda`<sup>Optional</sup> <a name="rotationLambda"></a>

- *Type:* [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

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

- *Implements:* [aws-cdk-lib.aws_secretsmanager.ISecret](aws-cdk-lib.aws_secretsmanager.ISecret)

Creates a new secret in AWS SecretsManager.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.Secret(scope: constructs.Construct, 
                  id: string, 
                  description: string = None, 
                  encryptionKey: aws-cdk-lib.aws_kms.IKey = None, 
                  generateSecretString: aws-cdk-lib.aws_secretsmanager.SecretStringGenerator = None, 
                  removalPolicy: aws-cdk-lib.RemovalPolicy = None, 
                  replicaRegions: Array<aws-cdk-lib.aws_secretsmanager.ReplicaRegion> = None, 
                  secretName: string = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `description`<sup>Optional</sup> <a name="description"></a>

- *Type:* `builtins.str`
- *Default:* - No description.

An optional, human-friendly description of the secret.

---

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey"></a>

- *Type:* [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey)
- *Default:* - A default KMS key for the account and region is used.

The customer-managed encryption key to use for encrypting the secret value.

---

##### `generateSecretString`<sup>Optional</sup> <a name="generateSecretString"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.SecretStringGenerator](#aws-cdk-lib.aws_secretsmanager.SecretStringGenerator)
- *Default:* - 32 characters with upper-case letters, lower-case letters, punctuation and numbers (at least one from each
category), per the default values of ``SecretStringGenerator``.

Configuration for how to generate a secret value.

---

##### `removalPolicy`<sup>Optional</sup> <a name="removalPolicy"></a>

- *Type:* [aws-cdk-lib.RemovalPolicy](#aws-cdk-lib.RemovalPolicy)
- *Default:* - Not set.

Policy to apply when the secret is removed from this stack.

---

##### `replicaRegions`<sup>Optional</sup> <a name="replicaRegions"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_secretsmanager.ReplicaRegion](#aws-cdk-lib.aws_secretsmanager.ReplicaRegion)]
- *Default:* - Secret is not replicated

A list of regions where to replicate this secret.

---

##### `secretName`<sup>Optional</sup> <a name="secretName"></a>

- *Type:* `builtins.str`
- *Default:* - A name is generated by CloudFormation.

A name for the secret.

Note that deleting secrets from SecretsManager does not happen immediately, but after a 7 to
30 days blackout period. During that period, it is not possible to create another secret that shares the same name.

---

#### Methods <a name="Methods"></a>

##### `addReplicaRegion` <a name="addReplicaRegion"></a>

```python
def addReplicaRegion(region: string, 
                     encryptionKey: aws-cdk-lib.aws_kms.IKey = None)
```

###### `region`<sup>Required</sup> <a name="region"></a>

- *Type:* `builtins.str`

The name of the region.

---

###### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey"></a>

- *Type:* [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey)

The customer-managed encryption key to use for encrypting the secret value.

---

##### `addRotationSchedule` <a name="addRotationSchedule"></a>

```python
def addRotationSchedule(id: string, 
                        automaticallyAfter: aws-cdk-lib.Duration = None, 
                        hostedRotation: aws-cdk-lib.aws_secretsmanager.HostedRotation = None, 
                        rotationLambda: aws-cdk-lib.aws_lambda.IFunction = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `automaticallyAfter`<sup>Optional</sup> <a name="automaticallyAfter"></a>

- *Type:* [aws-cdk-lib.Duration](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

###### `hostedRotation`<sup>Optional</sup> <a name="hostedRotation"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

###### `rotationLambda`<sup>Optional</sup> <a name="rotationLambda"></a>

- *Type:* [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

##### `addToResourcePolicy` <a name="addToResourcePolicy"></a>

```python
def addToResourcePolicy(statement: aws-cdk-lib.aws_iam.PolicyStatement)
```

###### `statement`<sup>Required</sup> <a name="statement"></a>

- *Type:* [aws-cdk-lib.aws_iam.PolicyStatement](#aws-cdk-lib.aws_iam.PolicyStatement)

---

##### `attach` <a name="attach"></a>

```python
def attach(target: aws-cdk-lib.aws_secretsmanager.ISecretAttachmentTarget)
```

###### `target`<sup>Required</sup> <a name="target"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecretAttachmentTarget](#aws-cdk-lib.aws_secretsmanager.ISecretAttachmentTarget)

The target to attach.

---

##### `denyAccountRootDelete` <a name="denyAccountRootDelete"></a>

```python
def denyAccountRootDelete()
```

##### `grantRead` <a name="grantRead"></a>

```python
def grantRead(grantee: aws-cdk-lib.aws_iam.IGrantable, 
              versionStages: Array<string> = None)
```

###### `grantee`<sup>Required</sup> <a name="grantee"></a>

- *Type:* [aws-cdk-lib.aws_iam.IGrantable](#aws-cdk-lib.aws_iam.IGrantable)

---

###### `versionStages`<sup>Optional</sup> <a name="versionStages"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[`builtins.str`]

---

##### `grantWrite` <a name="grantWrite"></a>

```python
def grantWrite(grantee: aws-cdk-lib.aws_iam.IGrantable)
```

###### `grantee`<sup>Required</sup> <a name="grantee"></a>

- *Type:* [aws-cdk-lib.aws_iam.IGrantable](#aws-cdk-lib.aws_iam.IGrantable)

---

##### `secretValueFromJson` <a name="secretValueFromJson"></a>

```python
def secretValueFromJson(jsonField: string)
```

###### `jsonField`<sup>Required</sup> <a name="jsonField"></a>

- *Type:* `builtins.str`

---

#### Functions <a name="Functions"></a>

##### `fromSecretAttributes` <a name="fromSecretAttributes"></a>

```python
class aws-cdk-lib.aws_secretsmanager.Secret.fromSecretAttributes(scope: constructs.Construct, 
                         id: string, 
                         encryptionKey: aws-cdk-lib.aws_kms.IKey = None, 
                         secretCompleteArn: string = None, 
                         secretPartialArn: string = None)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

the scope of the import.

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

the ID of the imported Secret in the construct tree.

---

###### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey"></a>

- *Type:* [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey)

The encryption key that is used to encrypt the secret, unless the default SecretsManager key is used.

---

###### `secretCompleteArn`<sup>Optional</sup> <a name="secretCompleteArn"></a>

- *Type:* `builtins.str`

The complete ARN of the secret in SecretsManager.

This is the ARN including the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretPartialArn`.

---

###### `secretPartialArn`<sup>Optional</sup> <a name="secretPartialArn"></a>

- *Type:* `builtins.str`

The partial ARN of the secret in SecretsManager.

This is the ARN without the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretCompleteArn`.

---

##### `fromSecretCompleteArn` <a name="fromSecretCompleteArn"></a>

```python
class aws-cdk-lib.aws_secretsmanager.Secret.fromSecretCompleteArn(scope: constructs.Construct, 
                          id: string, 
                          secretCompleteArn: string)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `secretCompleteArn`<sup>Required</sup> <a name="secretCompleteArn"></a>

- *Type:* `builtins.str`

---

##### `fromSecretNameV2` <a name="fromSecretNameV2"></a>

```python
class aws-cdk-lib.aws_secretsmanager.Secret.fromSecretNameV2(scope: constructs.Construct, 
                     id: string, 
                     secretName: string)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `secretName`<sup>Required</sup> <a name="secretName"></a>

- *Type:* `builtins.str`

---

##### `fromSecretPartialArn` <a name="fromSecretPartialArn"></a>

```python
class aws-cdk-lib.aws_secretsmanager.Secret.fromSecretPartialArn(scope: constructs.Construct, 
                         id: string, 
                         secretPartialArn: string)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `secretPartialArn`<sup>Required</sup> <a name="secretPartialArn"></a>

- *Type:* `builtins.str`

---

### SecretRotation <a name="aws-cdk-lib.aws_secretsmanager.SecretRotation"></a>

Secret rotation for a service or database.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretRotation(scope: constructs.Construct, 
                  id: string, 
                  application: aws-cdk-lib.aws_secretsmanager.SecretRotationApplication, 
                  secret: aws-cdk-lib.aws_secretsmanager.ISecret, 
                  target: aws-cdk-lib.aws_ec2.IConnectable, 
                  vpc: aws-cdk-lib.aws_ec2.IVpc, 
                  automaticallyAfter: aws-cdk-lib.Duration = None, 
                  excludeCharacters: string = None, 
                  masterSecret: aws-cdk-lib.aws_secretsmanager.ISecret = None, 
                  securityGroup: aws-cdk-lib.aws_ec2.ISecurityGroup = None, 
                  vpcSubnets: aws-cdk-lib.aws_ec2.SubnetSelection = None)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `application`<sup>Required</sup> <a name="application"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.SecretRotationApplication](#aws-cdk-lib.aws_secretsmanager.SecretRotationApplication)

The serverless application for the rotation.

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

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

- *Type:* [aws-cdk-lib.aws_ec2.IConnectable](#aws-cdk-lib.aws_ec2.IConnectable)

The target service or database.

---

##### `vpc`<sup>Required</sup> <a name="vpc"></a>

- *Type:* [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc)

The VPC where the Lambda rotation function will run.

---

##### `automaticallyAfter`<sup>Optional</sup> <a name="automaticallyAfter"></a>

- *Type:* [aws-cdk-lib.Duration](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `excludeCharacters`<sup>Optional</sup> <a name="excludeCharacters"></a>

- *Type:* `builtins.str`
- *Default:* - no additional characters are explicitly excluded

Characters which should not appear in the generated password.

---

##### `masterSecret`<sup>Optional</sup> <a name="masterSecret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)
- *Default:* - single user rotation scheme

The master secret for a multi user rotation scheme.

---

##### `securityGroup`<sup>Optional</sup> <a name="securityGroup"></a>

- *Type:* [aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:* - a new security group is created

The security group for the Lambda rotation function.

---

##### `vpcSubnets`<sup>Optional</sup> <a name="vpcSubnets"></a>

- *Type:* [aws-cdk-lib.aws_ec2.SubnetSelection](#aws-cdk-lib.aws_ec2.SubnetSelection)
- *Default:* - the Vpc default strategy if not specified.

The type of subnets in the VPC where the Lambda rotation function will run.

---



### SecretTargetAttachment <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachment"></a>

- *Implements:* [aws-cdk-lib.aws_secretsmanager.ISecretTargetAttachment](aws-cdk-lib.aws_secretsmanager.ISecretTargetAttachment), [aws-cdk-lib.aws_secretsmanager.ISecret](aws-cdk-lib.aws_secretsmanager.ISecret)

An attached secret.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretTargetAttachment(scope: constructs.Construct, 
                  id: string, 
                  secret: aws-cdk-lib.aws_secretsmanager.ISecret)
```

##### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

The secret to attach to the target.

---

#### Methods <a name="Methods"></a>

##### `addRotationSchedule` <a name="addRotationSchedule"></a>

```python
def addRotationSchedule(id: string, 
                        automaticallyAfter: aws-cdk-lib.Duration = None, 
                        hostedRotation: aws-cdk-lib.aws_secretsmanager.HostedRotation = None, 
                        rotationLambda: aws-cdk-lib.aws_lambda.IFunction = None)
```

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `automaticallyAfter`<sup>Optional</sup> <a name="automaticallyAfter"></a>

- *Type:* [aws-cdk-lib.Duration](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

###### `hostedRotation`<sup>Optional</sup> <a name="hostedRotation"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

###### `rotationLambda`<sup>Optional</sup> <a name="rotationLambda"></a>

- *Type:* [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

##### `addToResourcePolicy` <a name="addToResourcePolicy"></a>

```python
def addToResourcePolicy(statement: aws-cdk-lib.aws_iam.PolicyStatement)
```

###### `statement`<sup>Required</sup> <a name="statement"></a>

- *Type:* [aws-cdk-lib.aws_iam.PolicyStatement](#aws-cdk-lib.aws_iam.PolicyStatement)

---

##### `attach` <a name="attach"></a>

```python
def attach(target: aws-cdk-lib.aws_secretsmanager.ISecretAttachmentTarget)
```

###### `target`<sup>Required</sup> <a name="target"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecretAttachmentTarget](#aws-cdk-lib.aws_secretsmanager.ISecretAttachmentTarget)

The target to attach.

---

##### `denyAccountRootDelete` <a name="denyAccountRootDelete"></a>

```python
def denyAccountRootDelete()
```

##### `grantRead` <a name="grantRead"></a>

```python
def grantRead(grantee: aws-cdk-lib.aws_iam.IGrantable, 
              versionStages: Array<string> = None)
```

###### `grantee`<sup>Required</sup> <a name="grantee"></a>

- *Type:* [aws-cdk-lib.aws_iam.IGrantable](#aws-cdk-lib.aws_iam.IGrantable)

---

###### `versionStages`<sup>Optional</sup> <a name="versionStages"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[`builtins.str`]

---

##### `grantWrite` <a name="grantWrite"></a>

```python
def grantWrite(grantee: aws-cdk-lib.aws_iam.IGrantable)
```

###### `grantee`<sup>Required</sup> <a name="grantee"></a>

- *Type:* [aws-cdk-lib.aws_iam.IGrantable](#aws-cdk-lib.aws_iam.IGrantable)

---

##### `secretValueFromJson` <a name="secretValueFromJson"></a>

```python
def secretValueFromJson(jsonField: string)
```

###### `jsonField`<sup>Required</sup> <a name="jsonField"></a>

- *Type:* `builtins.str`

---

#### Functions <a name="Functions"></a>

##### `fromSecretTargetAttachmentSecretArn` <a name="fromSecretTargetAttachmentSecretArn"></a>

```python
class aws-cdk-lib.aws_secretsmanager.SecretTargetAttachment.fromSecretTargetAttachmentSecretArn(scope: constructs.Construct, 
                                        id: string, 
                                        secretTargetAttachmentSecretArn: string)
```

###### `scope`<sup>Required</sup> <a name="scope"></a>

- *Type:* [constructs.Construct](#constructs.Construct)

---

###### `id`<sup>Required</sup> <a name="id"></a>

- *Type:* `builtins.str`

---

###### `secretTargetAttachmentSecretArn`<sup>Required</sup> <a name="secretTargetAttachmentSecretArn"></a>

- *Type:* `builtins.str`

---

## Structs <a name="Structs"></a>

### CfnResourcePolicyProps <a name="aws-cdk-lib.aws_secretsmanager.CfnResourcePolicyProps"></a>

Properties for defining a `AWS::SecretsManager::ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnResourcePolicyProps(resourcePolicy: any, 
                  secretId: string, 
                  blockPublicPolicy: boolean | aws-cdk-lib.IResolvable = None)
```

##### `resourcePolicy`<sup>Required</sup> <a name="resourcePolicy"></a>

- *Type:* [typing.Any](https://docs.python.org/3/library/typing.html#typing.Any)

`AWS::SecretsManager::ResourcePolicy.ResourcePolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-resourcepolicy)

---

##### `secretId`<sup>Required</sup> <a name="secretId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::ResourcePolicy.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-secretid)

---

##### `blockPublicPolicy`<sup>Optional</sup> <a name="blockPublicPolicy"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[`builtins.bool`, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::ResourcePolicy.BlockPublicPolicy`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-resourcepolicy.html#cfn-secretsmanager-resourcepolicy-blockpublicpolicy)

---

### CfnRotationScheduleProps <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationScheduleProps"></a>

Properties for defining a `AWS::SecretsManager::RotationSchedule`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnRotationScheduleProps(secretId: string, 
                  hostedRotationLambda: aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty | aws-cdk-lib.IResolvable = None, 
                  rotationLambdaArn: string = None, 
                  rotationRules: aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty | aws-cdk-lib.IResolvable = None)
```

##### `secretId`<sup>Required</sup> <a name="secretId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::RotationSchedule.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-secretid)

---

##### `hostedRotationLambda`<sup>Optional</sup> <a name="hostedRotationLambda"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::RotationSchedule.HostedRotationLambda`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda)

---

##### `rotationLambdaArn`<sup>Optional</sup> <a name="rotationLambdaArn"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::RotationSchedule.RotationLambdaARN`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationlambdaarn)

---

##### `rotationRules`<sup>Optional</sup> <a name="rotationRules"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty](#aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::RotationSchedule.RotationRules`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-rotationschedule.html#cfn-secretsmanager-rotationschedule-rotationrules)

---

### CfnSecretProps <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretProps"></a>

Properties for defining a `AWS::SecretsManager::Secret`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecretProps(description: string = None, 
                  generateSecretString: aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty | aws-cdk-lib.IResolvable = None, 
                  kmsKeyId: string = None, 
                  name: string = None, 
                  replicaRegions: aws-cdk-lib.IResolvable | Array<aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty | aws-cdk-lib.IResolvable> = None, 
                  secretString: string = None, 
                  tags: Array<aws-cdk-lib.CfnTag> = None)
```

##### `description`<sup>Optional</sup> <a name="description"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.Description`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-description)

---

##### `generateSecretString`<sup>Optional</sup> <a name="generateSecretString"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`AWS::SecretsManager::Secret.GenerateSecretString`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-generatesecretstring)

---

##### `kmsKeyId`<sup>Optional</sup> <a name="kmsKeyId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.KmsKeyId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-kmskeyid)

---

##### `name`<sup>Optional</sup> <a name="name"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.Name`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-name)

---

##### `replicaRegions`<sup>Optional</sup> <a name="replicaRegions"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable), [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[[aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty](#aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty), [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]]]

`AWS::SecretsManager::Secret.ReplicaRegions`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-replicaregions)

---

##### `secretString`<sup>Optional</sup> <a name="secretString"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::Secret.SecretString`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-secretstring)

---

##### `tags`<sup>Optional</sup> <a name="tags"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.CfnTag](#aws-cdk-lib.CfnTag)]

`AWS::SecretsManager::Secret.Tags`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secret.html#cfn-secretsmanager-secret-tags)

---

### CfnSecretTargetAttachmentProps <a name="aws-cdk-lib.aws_secretsmanager.CfnSecretTargetAttachmentProps"></a>

Properties for defining a `AWS::SecretsManager::SecretTargetAttachment`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.CfnSecretTargetAttachmentProps(secretId: string, 
                  targetId: string, 
                  targetType: string)
```

##### `secretId`<sup>Required</sup> <a name="secretId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.SecretId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-secretid)

---

##### `targetId`<sup>Required</sup> <a name="targetId"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.TargetId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targetid)

---

##### `targetType`<sup>Required</sup> <a name="targetType"></a>

- *Type:* `builtins.str`

`AWS::SecretsManager::SecretTargetAttachment.TargetType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-secretsmanager-secrettargetattachment.html#cfn-secretsmanager-secrettargetattachment-targettype)

---

### GenerateSecretStringProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.GenerateSecretStringProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk

aws_cdk.GenerateSecretStringProperty(excludeCharacters: string = None, 
                  excludeLowercase: boolean | aws-cdk-lib.IResolvable = None, 
                  excludeNumbers: boolean | aws-cdk-lib.IResolvable = None, 
                  excludePunctuation: boolean | aws-cdk-lib.IResolvable = None, 
                  excludeUppercase: boolean | aws-cdk-lib.IResolvable = None, 
                  generateStringKey: string = None, 
                  includeSpace: boolean | aws-cdk-lib.IResolvable = None, 
                  passwordLength: number = None, 
                  requireEachIncludedType: boolean | aws-cdk-lib.IResolvable = None, 
                  secretStringTemplate: string = None)
```

##### `excludeCharacters`<sup>Optional</sup> <a name="excludeCharacters"></a>

- *Type:* `builtins.str`

`CfnSecret.GenerateSecretStringProperty.ExcludeCharacters`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludecharacters](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludecharacters)

---

##### `excludeLowercase`<sup>Optional</sup> <a name="excludeLowercase"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[`builtins.bool`, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.ExcludeLowercase`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludelowercase](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludelowercase)

---

##### `excludeNumbers`<sup>Optional</sup> <a name="excludeNumbers"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[`builtins.bool`, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.ExcludeNumbers`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludenumbers](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludenumbers)

---

##### `excludePunctuation`<sup>Optional</sup> <a name="excludePunctuation"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[`builtins.bool`, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.ExcludePunctuation`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludepunctuation](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludepunctuation)

---

##### `excludeUppercase`<sup>Optional</sup> <a name="excludeUppercase"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[`builtins.bool`, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.ExcludeUppercase`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludeuppercase](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-excludeuppercase)

---

##### `generateStringKey`<sup>Optional</sup> <a name="generateStringKey"></a>

- *Type:* `builtins.str`

`CfnSecret.GenerateSecretStringProperty.GenerateStringKey`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-generatestringkey](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-generatestringkey)

---

##### `includeSpace`<sup>Optional</sup> <a name="includeSpace"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[`builtins.bool`, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.IncludeSpace`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-includespace](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-includespace)

---

##### `passwordLength`<sup>Optional</sup> <a name="passwordLength"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[int, float]

`CfnSecret.GenerateSecretStringProperty.PasswordLength`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-passwordlength](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-passwordlength)

---

##### `requireEachIncludedType`<sup>Optional</sup> <a name="requireEachIncludedType"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[`builtins.bool`, [aws-cdk-lib.IResolvable](#aws-cdk-lib.IResolvable)]

`CfnSecret.GenerateSecretStringProperty.RequireEachIncludedType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-requireeachincludedtype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-requireeachincludedtype)

---

##### `secretStringTemplate`<sup>Optional</sup> <a name="secretStringTemplate"></a>

- *Type:* `builtins.str`

`CfnSecret.GenerateSecretStringProperty.SecretStringTemplate`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-secretstringtemplate](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-generatesecretstring.html#cfn-secretsmanager-secret-generatesecretstring-secretstringtemplate)

---

### HostedRotationLambdaProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.HostedRotationLambdaProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk

aws_cdk.HostedRotationLambdaProperty(rotationType: string, 
                  kmsKeyArn: string = None, 
                  masterSecretArn: string = None, 
                  masterSecretKmsKeyArn: string = None, 
                  rotationLambdaName: string = None, 
                  vpcSecurityGroupIds: string = None, 
                  vpcSubnetIds: string = None)
```

##### `rotationType`<sup>Required</sup> <a name="rotationType"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.RotationType`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationtype](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationtype)

---

##### `kmsKeyArn`<sup>Optional</sup> <a name="kmsKeyArn"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.KmsKeyArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-kmskeyarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-kmskeyarn)

---

##### `masterSecretArn`<sup>Optional</sup> <a name="masterSecretArn"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.MasterSecretArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretarn)

---

##### `masterSecretKmsKeyArn`<sup>Optional</sup> <a name="masterSecretKmsKeyArn"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.MasterSecretKmsKeyArn`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretkmskeyarn](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-mastersecretkmskeyarn)

---

##### `rotationLambdaName`<sup>Optional</sup> <a name="rotationLambdaName"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.RotationLambdaName`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationlambdaname](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-rotationlambdaname)

---

##### `vpcSecurityGroupIds`<sup>Optional</sup> <a name="vpcSecurityGroupIds"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.VpcSecurityGroupIds`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsecuritygroupids](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsecuritygroupids)

---

##### `vpcSubnetIds`<sup>Optional</sup> <a name="vpcSubnetIds"></a>

- *Type:* `builtins.str`

`CfnRotationSchedule.HostedRotationLambdaProperty.VpcSubnetIds`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsubnetids](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-hostedrotationlambda.html#cfn-secretsmanager-rotationschedule-hostedrotationlambda-vpcsubnetids)

---

### MultiUserHostedRotationOptions <a name="aws-cdk-lib.aws_secretsmanager.MultiUserHostedRotationOptions"></a>

Multi user hosted rotation options.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.MultiUserHostedRotationOptions(masterSecret: aws-cdk-lib.aws_secretsmanager.ISecret, 
                  functionName: string = None, 
                  securityGroups: Array<aws-cdk-lib.aws_ec2.ISecurityGroup> = None, 
                  vpc: aws-cdk-lib.aws_ec2.IVpc = None, 
                  availabilityZones: Array<string> = None, 
                  onePerAz: boolean = None, 
                  subnetFilters: Array<aws-cdk-lib.aws_ec2.SubnetFilter> = None, 
                  subnetGroupName: string = None, 
                  subnets: Array<aws-cdk-lib.aws_ec2.ISubnet> = None, 
                  subnetType: aws-cdk-lib.aws_ec2.SubnetType = None)
```

##### `masterSecret`<sup>Required</sup> <a name="masterSecret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

The master secret for a multi user rotation scheme.

---

##### `functionName`<sup>Optional</sup> <a name="functionName"></a>

- *Type:* `builtins.str`
- *Default:* - a CloudFormation generated name

A name for the Lambda created to rotate the secret.

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup)]
- *Default:* - a new security group is created

A list of security groups for the Lambda created to rotate the secret.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:* - the Lambda is not deployed in a VPC

The VPC where the Lambda rotation function will run.

---

##### `availabilityZones`<sup>Optional</sup> <a name="availabilityZones"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `onePerAz`<sup>Optional</sup> <a name="onePerAz"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnetFilters`<sup>Optional</sup> <a name="subnetFilters"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.SubnetFilter](#aws-cdk-lib.aws_ec2.SubnetFilter)]
- *Default:* - none

List of provided subnet filters.

---

##### `subnetGroupName`<sup>Optional</sup> <a name="subnetGroupName"></a>

- *Type:* `builtins.str`
- *Default:* - Selection by type instead of by name

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

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.ISubnet](#aws-cdk-lib.aws_ec2.ISubnet)]
- *Default:* - Use all subnets in a selected group (all private subnets by default)

Explicitly select individual subnets.

Use this if you don't want to automatically use all subnets in
a group, but have a need to control selection down to
individual subnets.

Cannot be specified together with `subnetType` or `subnetGroupName`.

---

##### `subnetType`<sup>Optional</sup> <a name="subnetType"></a>

- *Type:* [aws-cdk-lib.aws_ec2.SubnetType](#aws-cdk-lib.aws_ec2.SubnetType)
- *Default:* SubnetType.PRIVATE (or ISOLATED or PUBLIC if there are no PRIVATE subnets)

Select all subnets of the given type.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

### ReplicaRegion <a name="aws-cdk-lib.aws_secretsmanager.ReplicaRegion"></a>

Secret replica region.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.ReplicaRegion(region: string, 
                  encryptionKey: aws-cdk-lib.aws_kms.IKey = None)
```

##### `region`<sup>Required</sup> <a name="region"></a>

- *Type:* `builtins.str`

The name of the region.

---

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey"></a>

- *Type:* [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey)
- *Default:* - A default KMS key for the account and region is used.

The customer-managed encryption key to use for encrypting the secret value.

---

### ReplicaRegionProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnSecret.ReplicaRegionProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk

aws_cdk.ReplicaRegionProperty(region: string, 
                  kmsKeyId: string = None)
```

##### `region`<sup>Required</sup> <a name="region"></a>

- *Type:* `builtins.str`

`CfnSecret.ReplicaRegionProperty.Region`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-region](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-region)

---

##### `kmsKeyId`<sup>Optional</sup> <a name="kmsKeyId"></a>

- *Type:* `builtins.str`

`CfnSecret.ReplicaRegionProperty.KmsKeyId`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-kmskeyid](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-secret-replicaregion.html#cfn-secretsmanager-secret-replicaregion-kmskeyid)

---

### ResourcePolicyProps <a name="aws-cdk-lib.aws_secretsmanager.ResourcePolicyProps"></a>

Construction properties for a ResourcePolicy.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.ResourcePolicyProps(secret: aws-cdk-lib.aws_secretsmanager.ISecret)
```

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

The secret to attach a resource-based permissions policy.

---

### RotationRulesProperty <a name="aws-cdk-lib.aws_secretsmanager.CfnRotationSchedule.RotationRulesProperty"></a>

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html)

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk

aws_cdk.RotationRulesProperty(automaticallyAfterDays: number = None)
```

##### `automaticallyAfterDays`<sup>Optional</sup> <a name="automaticallyAfterDays"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[int, float]

`CfnRotationSchedule.RotationRulesProperty.AutomaticallyAfterDays`.

> [http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html#cfn-secretsmanager-rotationschedule-rotationrules-automaticallyafterdays](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-secretsmanager-rotationschedule-rotationrules.html#cfn-secretsmanager-rotationschedule-rotationrules-automaticallyafterdays)

---

### RotationScheduleOptions <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleOptions"></a>

Options to add a rotation schedule to a secret.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.RotationScheduleOptions(automaticallyAfter: aws-cdk-lib.Duration = None, 
                  hostedRotation: aws-cdk-lib.aws_secretsmanager.HostedRotation = None, 
                  rotationLambda: aws-cdk-lib.aws_lambda.IFunction = None)
```

##### `automaticallyAfter`<sup>Optional</sup> <a name="automaticallyAfter"></a>

- *Type:* [aws-cdk-lib.Duration](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `hostedRotation`<sup>Optional</sup> <a name="hostedRotation"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

##### `rotationLambda`<sup>Optional</sup> <a name="rotationLambda"></a>

- *Type:* [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

### RotationScheduleProps <a name="aws-cdk-lib.aws_secretsmanager.RotationScheduleProps"></a>

Construction properties for a RotationSchedule.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.RotationScheduleProps(secret: aws-cdk-lib.aws_secretsmanager.ISecret, 
                  automaticallyAfter: aws-cdk-lib.Duration = None, 
                  hostedRotation: aws-cdk-lib.aws_secretsmanager.HostedRotation = None, 
                  rotationLambda: aws-cdk-lib.aws_lambda.IFunction = None)
```

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

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

##### `automaticallyAfter`<sup>Optional</sup> <a name="automaticallyAfter"></a>

- *Type:* [aws-cdk-lib.Duration](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `hostedRotation`<sup>Optional</sup> <a name="hostedRotation"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.HostedRotation](#aws-cdk-lib.aws_secretsmanager.HostedRotation)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

Hosted rotation.

---

##### `rotationLambda`<sup>Optional</sup> <a name="rotationLambda"></a>

- *Type:* [aws-cdk-lib.aws_lambda.IFunction](#aws-cdk-lib.aws_lambda.IFunction)
- *Default:* - either `rotationLambda` or `hostedRotation` must be specified

A Lambda function that can rotate the secret.

---

### SecretAttachmentTargetProps <a name="aws-cdk-lib.aws_secretsmanager.SecretAttachmentTargetProps"></a>

Attachment target specifications.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretAttachmentTargetProps(targetId: string, 
                  targetType: aws-cdk-lib.aws_secretsmanager.AttachmentTargetType)
```

##### `targetId`<sup>Required</sup> <a name="targetId"></a>

- *Type:* `builtins.str`

The id of the target to attach the secret to.

---

##### `targetType`<sup>Required</sup> <a name="targetType"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.AttachmentTargetType](#aws-cdk-lib.aws_secretsmanager.AttachmentTargetType)

The type of the target to attach the secret to.

---

### SecretAttributes <a name="aws-cdk-lib.aws_secretsmanager.SecretAttributes"></a>

Attributes required to import an existing secret into the Stack.

One ARN format (`secretArn`, `secretCompleteArn`, `secretPartialArn`) must be provided.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretAttributes(encryptionKey: aws-cdk-lib.aws_kms.IKey = None, 
                  secretCompleteArn: string = None, 
                  secretPartialArn: string = None)
```

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey"></a>

- *Type:* [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey)

The encryption key that is used to encrypt the secret, unless the default SecretsManager key is used.

---

##### `secretCompleteArn`<sup>Optional</sup> <a name="secretCompleteArn"></a>

- *Type:* `builtins.str`

The complete ARN of the secret in SecretsManager.

This is the ARN including the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretPartialArn`.

---

##### `secretPartialArn`<sup>Optional</sup> <a name="secretPartialArn"></a>

- *Type:* `builtins.str`

The partial ARN of the secret in SecretsManager.

This is the ARN without the Secrets Manager 6-character suffix.
Cannot be used with `secretArn` or `secretCompleteArn`.

---

### SecretProps <a name="aws-cdk-lib.aws_secretsmanager.SecretProps"></a>

The properties required to create a new secret in AWS Secrets Manager.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretProps(description: string = None, 
                  encryptionKey: aws-cdk-lib.aws_kms.IKey = None, 
                  excludeCharacters: string = None, 
                  excludeLowercase: boolean = None, 
                  excludeNumbers: boolean = None, 
                  excludePunctuation: boolean = None, 
                  excludeUppercase: boolean = None, 
                  generateStringKey: string = None, 
                  includeSpace: boolean = None, 
                  passwordLength: number = None, 
                  requireEachIncludedType: boolean = None, 
                  secretStringTemplate: string = None, 
                  removalPolicy: aws-cdk-lib.RemovalPolicy = None, 
                  replicaRegions: Array<aws-cdk-lib.aws_secretsmanager.ReplicaRegion> = None, 
                  secretName: string = None)
```

##### `description`<sup>Optional</sup> <a name="description"></a>

- *Type:* `builtins.str`
- *Default:* - No description.

An optional, human-friendly description of the secret.

---

##### `encryptionKey`<sup>Optional</sup> <a name="encryptionKey"></a>

- *Type:* [aws-cdk-lib.aws_kms.IKey](#aws-cdk-lib.aws_kms.IKey)
- *Default:* - A default KMS key for the account and region is used.

The customer-managed encryption key to use for encrypting the secret value.

---

##### `excludeCharacters`<sup>Optional</sup> <a name="excludeCharacters"></a>

- *Type:* `builtins.str`
- *Default:* no exclusions

A string that includes characters that shouldn't be included in the generated password.

The string can be a minimum
of ``0`` and a maximum of ``4096`` characters long.

---

##### `excludeLowercase`<sup>Optional</sup> <a name="excludeLowercase"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include lowercase letters.

---

##### `excludeNumbers`<sup>Optional</sup> <a name="excludeNumbers"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include digits.

---

##### `excludePunctuation`<sup>Optional</sup> <a name="excludePunctuation"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include punctuation characters.

---

##### `excludeUppercase`<sup>Optional</sup> <a name="excludeUppercase"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include uppercase letters.

---

##### `generateStringKey`<sup>Optional</sup> <a name="generateStringKey"></a>

- *Type:* `builtins.str`

The JSON key name that's used to add the generated password to the JSON structure specified by the ``secretStringTemplate`` parameter.

If you specify ``generateStringKey`` then ``secretStringTemplate``
must be also be specified.

---

##### `includeSpace`<sup>Optional</sup> <a name="includeSpace"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password can include the space character.

---

##### `passwordLength`<sup>Optional</sup> <a name="passwordLength"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[int, float]
- *Default:* 32

The desired length of the generated password.

---

##### `requireEachIncludedType`<sup>Optional</sup> <a name="requireEachIncludedType"></a>

- *Type:* `builtins.bool`
- *Default:* true

Specifies whether the generated password must include at least one of every allowed character type.

---

##### `secretStringTemplate`<sup>Optional</sup> <a name="secretStringTemplate"></a>

- *Type:* `builtins.str`

A properly structured JSON string that the generated password can be added to.

The ``generateStringKey`` is
combined with the generated random string and inserted into the JSON structure that's specified by this parameter.
The merged JSON string is returned as the completed SecretString of the secret. If you specify ``secretStringTemplate``
then ``generateStringKey`` must be also be specified.

---

##### `removalPolicy`<sup>Optional</sup> <a name="removalPolicy"></a>

- *Type:* [aws-cdk-lib.RemovalPolicy](#aws-cdk-lib.RemovalPolicy)
- *Default:* - Not set.

Policy to apply when the secret is removed from this stack.

---

##### `replicaRegions`<sup>Optional</sup> <a name="replicaRegions"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_secretsmanager.ReplicaRegion](#aws-cdk-lib.aws_secretsmanager.ReplicaRegion)]
- *Default:* - Secret is not replicated

A list of regions where to replicate this secret.

---

##### `secretName`<sup>Optional</sup> <a name="secretName"></a>

- *Type:* `builtins.str`
- *Default:* - A name is generated by CloudFormation.

A name for the secret.

Note that deleting secrets from SecretsManager does not happen immediately, but after a 7 to
30 days blackout period. During that period, it is not possible to create another secret that shares the same name.

---

### SecretRotationApplicationOptions <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationApplicationOptions"></a>

Options for a SecretRotationApplication.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretRotationApplicationOptions(isMultiUser: boolean = None)
```

##### `isMultiUser`<sup>Optional</sup> <a name="isMultiUser"></a>

- *Type:* `builtins.bool`
- *Default:* false

Whether the rotation application uses the mutli user scheme.

---

### SecretRotationProps <a name="aws-cdk-lib.aws_secretsmanager.SecretRotationProps"></a>

Construction properties for a SecretRotation.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretRotationProps(application: aws-cdk-lib.aws_secretsmanager.SecretRotationApplication, 
                  secret: aws-cdk-lib.aws_secretsmanager.ISecret, 
                  target: aws-cdk-lib.aws_ec2.IConnectable, 
                  vpc: aws-cdk-lib.aws_ec2.IVpc, 
                  automaticallyAfter: aws-cdk-lib.Duration = None, 
                  excludeCharacters: string = None, 
                  masterSecret: aws-cdk-lib.aws_secretsmanager.ISecret = None, 
                  securityGroup: aws-cdk-lib.aws_ec2.ISecurityGroup = None, 
                  availabilityZones: Array<string> = None, 
                  onePerAz: boolean = None, 
                  subnetFilters: Array<aws-cdk-lib.aws_ec2.SubnetFilter> = None, 
                  subnetGroupName: string = None, 
                  subnets: Array<aws-cdk-lib.aws_ec2.ISubnet> = None, 
                  subnetType: aws-cdk-lib.aws_ec2.SubnetType = None)
```

##### `application`<sup>Required</sup> <a name="application"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.SecretRotationApplication](#aws-cdk-lib.aws_secretsmanager.SecretRotationApplication)

The serverless application for the rotation.

---

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

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

- *Type:* [aws-cdk-lib.aws_ec2.IConnectable](#aws-cdk-lib.aws_ec2.IConnectable)

The target service or database.

---

##### `vpc`<sup>Required</sup> <a name="vpc"></a>

- *Type:* [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc)

The VPC where the Lambda rotation function will run.

---

##### `automaticallyAfter`<sup>Optional</sup> <a name="automaticallyAfter"></a>

- *Type:* [aws-cdk-lib.Duration](#aws-cdk-lib.Duration)
- *Default:* Duration.days(30)

Specifies the number of days after the previous rotation before Secrets Manager triggers the next automatic rotation.

---

##### `excludeCharacters`<sup>Optional</sup> <a name="excludeCharacters"></a>

- *Type:* `builtins.str`
- *Default:* - no additional characters are explicitly excluded

Characters which should not appear in the generated password.

---

##### `masterSecret`<sup>Optional</sup> <a name="masterSecret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)
- *Default:* - single user rotation scheme

The master secret for a multi user rotation scheme.

---

##### `securityGroup`<sup>Optional</sup> <a name="securityGroup"></a>

- *Type:* [aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup)
- *Default:* - a new security group is created

The security group for the Lambda rotation function.

---

##### `availabilityZones`<sup>Optional</sup> <a name="availabilityZones"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `onePerAz`<sup>Optional</sup> <a name="onePerAz"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnetFilters`<sup>Optional</sup> <a name="subnetFilters"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.SubnetFilter](#aws-cdk-lib.aws_ec2.SubnetFilter)]
- *Default:* - none

List of provided subnet filters.

---

##### `subnetGroupName`<sup>Optional</sup> <a name="subnetGroupName"></a>

- *Type:* `builtins.str`
- *Default:* - Selection by type instead of by name

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

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.ISubnet](#aws-cdk-lib.aws_ec2.ISubnet)]
- *Default:* - Use all subnets in a selected group (all private subnets by default)

Explicitly select individual subnets.

Use this if you don't want to automatically use all subnets in
a group, but have a need to control selection down to
individual subnets.

Cannot be specified together with `subnetType` or `subnetGroupName`.

---

##### `subnetType`<sup>Optional</sup> <a name="subnetType"></a>

- *Type:* [aws-cdk-lib.aws_ec2.SubnetType](#aws-cdk-lib.aws_ec2.SubnetType)
- *Default:* SubnetType.PRIVATE (or ISOLATED or PUBLIC if there are no PRIVATE subnets)

Select all subnets of the given type.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---

### SecretStringGenerator <a name="aws-cdk-lib.aws_secretsmanager.SecretStringGenerator"></a>

Configuration to generate secrets such as passwords automatically.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretStringGenerator(excludeCharacters: string = None, 
                  excludeLowercase: boolean = None, 
                  excludeNumbers: boolean = None, 
                  excludePunctuation: boolean = None, 
                  excludeUppercase: boolean = None, 
                  generateStringKey: string = None, 
                  includeSpace: boolean = None, 
                  passwordLength: number = None, 
                  requireEachIncludedType: boolean = None, 
                  secretStringTemplate: string = None)
```

##### `excludeCharacters`<sup>Optional</sup> <a name="excludeCharacters"></a>

- *Type:* `builtins.str`
- *Default:* no exclusions

A string that includes characters that shouldn't be included in the generated password.

The string can be a minimum
of ``0`` and a maximum of ``4096`` characters long.

---

##### `excludeLowercase`<sup>Optional</sup> <a name="excludeLowercase"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include lowercase letters.

---

##### `excludeNumbers`<sup>Optional</sup> <a name="excludeNumbers"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include digits.

---

##### `excludePunctuation`<sup>Optional</sup> <a name="excludePunctuation"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include punctuation characters.

---

##### `excludeUppercase`<sup>Optional</sup> <a name="excludeUppercase"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password shouldn't include uppercase letters.

---

##### `generateStringKey`<sup>Optional</sup> <a name="generateStringKey"></a>

- *Type:* `builtins.str`

The JSON key name that's used to add the generated password to the JSON structure specified by the ``secretStringTemplate`` parameter.

If you specify ``generateStringKey`` then ``secretStringTemplate``
must be also be specified.

---

##### `includeSpace`<sup>Optional</sup> <a name="includeSpace"></a>

- *Type:* `builtins.bool`
- *Default:* false

Specifies that the generated password can include the space character.

---

##### `passwordLength`<sup>Optional</sup> <a name="passwordLength"></a>

- *Type:* [typing.Union](https://docs.python.org/3/library/typing.html#typing.Union)[int, float]
- *Default:* 32

The desired length of the generated password.

---

##### `requireEachIncludedType`<sup>Optional</sup> <a name="requireEachIncludedType"></a>

- *Type:* `builtins.bool`
- *Default:* true

Specifies whether the generated password must include at least one of every allowed character type.

---

##### `secretStringTemplate`<sup>Optional</sup> <a name="secretStringTemplate"></a>

- *Type:* `builtins.str`

A properly structured JSON string that the generated password can be added to.

The ``generateStringKey`` is
combined with the generated random string and inserted into the JSON structure that's specified by this parameter.
The merged JSON string is returned as the completed SecretString of the secret. If you specify ``secretStringTemplate``
then ``generateStringKey`` must be also be specified.

---

### SecretTargetAttachmentProps <a name="aws-cdk-lib.aws_secretsmanager.SecretTargetAttachmentProps"></a>

Construction properties for an AttachedSecret.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SecretTargetAttachmentProps(secret: aws-cdk-lib.aws_secretsmanager.ISecret)
```

##### `secret`<sup>Required</sup> <a name="secret"></a>

- *Type:* [aws-cdk-lib.aws_secretsmanager.ISecret](#aws-cdk-lib.aws_secretsmanager.ISecret)

The secret to attach to the target.

---

### SingleUserHostedRotationOptions <a name="aws-cdk-lib.aws_secretsmanager.SingleUserHostedRotationOptions"></a>

Single user hosted rotation options.

#### Initializer <a name="Initializer"></a>

```python
import aws_cdk.aws_secretsmanager

aws_cdk.aws_secretsmanager.SingleUserHostedRotationOptions(functionName: string = None, 
                  securityGroups: Array<aws-cdk-lib.aws_ec2.ISecurityGroup> = None, 
                  vpc: aws-cdk-lib.aws_ec2.IVpc = None, 
                  availabilityZones: Array<string> = None, 
                  onePerAz: boolean = None, 
                  subnetFilters: Array<aws-cdk-lib.aws_ec2.SubnetFilter> = None, 
                  subnetGroupName: string = None, 
                  subnets: Array<aws-cdk-lib.aws_ec2.ISubnet> = None, 
                  subnetType: aws-cdk-lib.aws_ec2.SubnetType = None)
```

##### `functionName`<sup>Optional</sup> <a name="functionName"></a>

- *Type:* `builtins.str`
- *Default:* - a CloudFormation generated name

A name for the Lambda created to rotate the secret.

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.ISecurityGroup](#aws-cdk-lib.aws_ec2.ISecurityGroup)]
- *Default:* - a new security group is created

A list of security groups for the Lambda created to rotate the secret.

---

##### `vpc`<sup>Optional</sup> <a name="vpc"></a>

- *Type:* [aws-cdk-lib.aws_ec2.IVpc](#aws-cdk-lib.aws_ec2.IVpc)
- *Default:* - the Lambda is not deployed in a VPC

The VPC where the Lambda rotation function will run.

---

##### `availabilityZones`<sup>Optional</sup> <a name="availabilityZones"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[`builtins.str`]
- *Default:* no filtering on AZs is done

Select subnets only in the given AZs.

---

##### `onePerAz`<sup>Optional</sup> <a name="onePerAz"></a>

- *Type:* `builtins.bool`
- *Default:* false

If true, return at most one subnet per AZ.

---

##### `subnetFilters`<sup>Optional</sup> <a name="subnetFilters"></a>

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.SubnetFilter](#aws-cdk-lib.aws_ec2.SubnetFilter)]
- *Default:* - none

List of provided subnet filters.

---

##### `subnetGroupName`<sup>Optional</sup> <a name="subnetGroupName"></a>

- *Type:* `builtins.str`
- *Default:* - Selection by type instead of by name

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

- *Type:* [typing.List](https://docs.python.org/3/library/typing.html#typing.List)[[aws-cdk-lib.aws_ec2.ISubnet](#aws-cdk-lib.aws_ec2.ISubnet)]
- *Default:* - Use all subnets in a selected group (all private subnets by default)

Explicitly select individual subnets.

Use this if you don't want to automatically use all subnets in
a group, but have a need to control selection down to
individual subnets.

Cannot be specified together with `subnetType` or `subnetGroupName`.

---

##### `subnetType`<sup>Optional</sup> <a name="subnetType"></a>

- *Type:* [aws-cdk-lib.aws_ec2.SubnetType](#aws-cdk-lib.aws_ec2.SubnetType)
- *Default:* SubnetType.PRIVATE (or ISOLATED or PUBLIC if there are no PRIVATE subnets)

Select all subnets of the given type.

At most one of `subnetType` and `subnetGroupName` can be supplied.

---
