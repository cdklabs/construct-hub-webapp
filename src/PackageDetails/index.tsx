import * as jsii from "@jsii/spec";
import * as reflect from "jsii-reflect";
import { Grid } from "semantic-ui-react";

const spec: any = {
  author: {
    name: "Amazon Web Services",
    organization: true,
    roles: ["author"],
    url: "https://aws.amazon.com",
  },
  bundled: {
    yaml: "1.10.2",
  },
  dependencies: {
    "@aws-cdk/aws-autoscaling": "0.0.0",
    "@aws-cdk/aws-ec2": "0.0.0",
    "@aws-cdk/aws-iam": "0.0.0",
    "@aws-cdk/aws-kms": "0.0.0",
    "@aws-cdk/aws-lambda": "0.0.0",
    "@aws-cdk/aws-ssm": "0.0.0",
    "@aws-cdk/core": "0.0.0",
    "@aws-cdk/custom-resources": "0.0.0",
    "@aws-cdk/lambda-layer-awscli": "0.0.0",
    "@aws-cdk/lambda-layer-kubectl": "0.0.0",
    constructs: "^3.3.69",
  },
  dependencyClosure: {
    "@aws-cdk/assets": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.Assets",
          packageId: "Amazon.CDK.Assets",
        },
        java: {
          maven: {
            artifactId: "cdk-assets",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.assets",
        },
        js: {
          npm: "@aws-cdk/assets",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.assets",
          module: "aws_cdk.assets",
        },
      },
    },
    "@aws-cdk/aws-applicationautoscaling": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.ApplicationAutoScaling",
          packageId: "Amazon.CDK.AWS.ApplicationAutoScaling",
        },
        java: {
          maven: {
            artifactId: "applicationautoscaling",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.applicationautoscaling",
        },
        js: {
          npm: "@aws-cdk/aws-applicationautoscaling",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-applicationautoscaling",
          module: "aws_cdk.aws_applicationautoscaling",
        },
      },
    },
    "@aws-cdk/aws-autoscaling": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.AutoScaling",
          packageId: "Amazon.CDK.AWS.AutoScaling",
        },
        java: {
          maven: {
            artifactId: "autoscaling",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.autoscaling",
        },
        js: {
          npm: "@aws-cdk/aws-autoscaling",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-autoscaling",
          module: "aws_cdk.aws_autoscaling",
        },
      },
    },
    "@aws-cdk/aws-autoscaling-common": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.AutoScaling.Common",
          packageId: "Amazon.CDK.AWS.AutoScaling.Common",
        },
        java: {
          maven: {
            artifactId: "autoscaling-common",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.autoscaling.common",
        },
        js: {
          npm: "@aws-cdk/aws-autoscaling-common",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-autoscaling-common",
          module: "aws_cdk.aws_autoscaling_common",
        },
      },
    },
    "@aws-cdk/aws-certificatemanager": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.CertificateManager",
          packageId: "Amazon.CDK.AWS.CertificateManager",
        },
        java: {
          maven: {
            artifactId: "certificatemanager",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.certificatemanager",
        },
        js: {
          npm: "@aws-cdk/aws-certificatemanager",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-certificatemanager",
          module: "aws_cdk.aws_certificatemanager",
        },
      },
    },
    "@aws-cdk/aws-cloudformation": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.CloudFormation",
          packageId: "Amazon.CDK.AWS.CloudFormation",
        },
        java: {
          maven: {
            artifactId: "cloudformation",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.cloudformation",
        },
        js: {
          npm: "@aws-cdk/aws-cloudformation",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-cloudformation",
          module: "aws_cdk.aws_cloudformation",
        },
      },
    },
    "@aws-cdk/aws-cloudwatch": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.CloudWatch",
          packageId: "Amazon.CDK.AWS.CloudWatch",
        },
        java: {
          maven: {
            artifactId: "cloudwatch",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.cloudwatch",
        },
        js: {
          npm: "@aws-cdk/aws-cloudwatch",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-cloudwatch",
          module: "aws_cdk.aws_cloudwatch",
        },
      },
    },
    "@aws-cdk/aws-codeguruprofiler": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.CodeGuruProfiler",
          packageId: "Amazon.CDK.AWS.CodeGuruProfiler",
        },
        java: {
          maven: {
            artifactId: "codeguruprofiler",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.codeguruprofiler",
        },
        js: {
          npm: "@aws-cdk/aws-codeguruprofiler",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-codeguruprofiler",
          module: "aws_cdk.aws_codeguruprofiler",
        },
      },
    },
    "@aws-cdk/aws-ec2": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.EC2",
          packageId: "Amazon.CDK.AWS.EC2",
        },
        java: {
          maven: {
            artifactId: "ec2",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.ec2",
        },
        js: {
          npm: "@aws-cdk/aws-ec2",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-ec2",
          module: "aws_cdk.aws_ec2",
        },
      },
    },
    "@aws-cdk/aws-ecr": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.ECR",
          packageId: "Amazon.CDK.AWS.ECR",
        },
        java: {
          maven: {
            artifactId: "ecr",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.ecr",
        },
        js: {
          npm: "@aws-cdk/aws-ecr",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-ecr",
          module: "aws_cdk.aws_ecr",
        },
      },
    },
    "@aws-cdk/aws-ecr-assets": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.Ecr.Assets",
          packageId: "Amazon.CDK.ECR.Assets",
        },
        java: {
          maven: {
            artifactId: "ecr-assets",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.ecr.assets",
        },
        js: {
          npm: "@aws-cdk/aws-ecr-assets",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-ecr-assets",
          module: "aws_cdk.aws_ecr_assets",
        },
      },
    },
    "@aws-cdk/aws-efs": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.EFS",
          packageId: "Amazon.CDK.AWS.EFS",
        },
        java: {
          maven: {
            artifactId: "efs",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.efs",
        },
        js: {
          npm: "@aws-cdk/aws-efs",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-efs",
          module: "aws_cdk.aws_efs",
        },
      },
    },
    "@aws-cdk/aws-elasticloadbalancing": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.ElasticLoadBalancing",
          packageId: "Amazon.CDK.AWS.ElasticLoadBalancing",
        },
        java: {
          maven: {
            artifactId: "elasticloadbalancing",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.elasticloadbalancing",
        },
        js: {
          npm: "@aws-cdk/aws-elasticloadbalancing",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-elasticloadbalancing",
          module: "aws_cdk.aws_elasticloadbalancing",
        },
      },
    },
    "@aws-cdk/aws-elasticloadbalancingv2": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.ElasticLoadBalancingV2",
          packageId: "Amazon.CDK.AWS.ElasticLoadBalancingV2",
        },
        java: {
          maven: {
            artifactId: "elasticloadbalancingv2",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.elasticloadbalancingv2",
        },
        js: {
          npm: "@aws-cdk/aws-elasticloadbalancingv2",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-elasticloadbalancingv2",
          module: "aws_cdk.aws_elasticloadbalancingv2",
        },
      },
    },
    "@aws-cdk/aws-events": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.Events",
          packageId: "Amazon.CDK.AWS.Events",
        },
        java: {
          maven: {
            artifactId: "events",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.events",
        },
        js: {
          npm: "@aws-cdk/aws-events",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-events",
          module: "aws_cdk.aws_events",
        },
      },
    },
    "@aws-cdk/aws-iam": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.IAM",
          packageId: "Amazon.CDK.AWS.IAM",
        },
        java: {
          maven: {
            artifactId: "iam",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.iam",
        },
        js: {
          npm: "@aws-cdk/aws-iam",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-iam",
          module: "aws_cdk.aws_iam",
        },
      },
    },
    "@aws-cdk/aws-kms": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.KMS",
          packageId: "Amazon.CDK.AWS.KMS",
        },
        java: {
          maven: {
            artifactId: "kms",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.kms",
        },
        js: {
          npm: "@aws-cdk/aws-kms",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-kms",
          module: "aws_cdk.aws_kms",
        },
      },
    },
    "@aws-cdk/aws-lambda": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.Lambda",
          packageId: "Amazon.CDK.AWS.Lambda",
        },
        java: {
          maven: {
            artifactId: "lambda",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.lambda",
        },
        js: {
          npm: "@aws-cdk/aws-lambda",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-lambda",
          module: "aws_cdk.aws_lambda",
        },
      },
    },
    "@aws-cdk/aws-logs": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.Logs",
          packageId: "Amazon.CDK.AWS.Logs",
        },
        java: {
          maven: {
            artifactId: "logs",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.logs",
        },
        js: {
          npm: "@aws-cdk/aws-logs",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-logs",
          module: "aws_cdk.aws_logs",
        },
      },
    },
    "@aws-cdk/aws-route53": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.Route53",
          packageId: "Amazon.CDK.AWS.Route53",
        },
        java: {
          maven: {
            artifactId: "route53",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.route53",
        },
        js: {
          npm: "@aws-cdk/aws-route53",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-route53",
          module: "aws_cdk.aws_route53",
        },
      },
    },
    "@aws-cdk/aws-s3": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.S3",
          packageId: "Amazon.CDK.AWS.S3",
        },
        java: {
          maven: {
            artifactId: "s3",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.s3",
        },
        js: {
          npm: "@aws-cdk/aws-s3",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-s3",
          module: "aws_cdk.aws_s3",
        },
      },
    },
    "@aws-cdk/aws-s3-assets": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.S3.Assets",
          packageId: "Amazon.CDK.AWS.S3.Assets",
        },
        java: {
          maven: {
            artifactId: "s3-assets",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.s3.assets",
        },
        js: {
          npm: "@aws-cdk/aws-s3-assets",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-s3-assets",
          module: "aws_cdk.aws_s3_assets",
        },
      },
    },
    "@aws-cdk/aws-signer": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.Signer",
          packageId: "Amazon.CDK.AWS.Signer",
        },
        java: {
          maven: {
            artifactId: "signer",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.signer",
        },
        js: {
          npm: "@aws-cdk/aws-signer",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-signer",
          module: "aws_cdk.aws_signer",
        },
      },
    },
    "@aws-cdk/aws-sns": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.SNS",
          packageId: "Amazon.CDK.AWS.SNS",
        },
        java: {
          maven: {
            artifactId: "sns",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.sns",
        },
        js: {
          npm: "@aws-cdk/aws-sns",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-sns",
          module: "aws_cdk.aws_sns",
        },
      },
    },
    "@aws-cdk/aws-sqs": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.SQS",
          packageId: "Amazon.CDK.AWS.SQS",
        },
        java: {
          maven: {
            artifactId: "sqs",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.sqs",
        },
        js: {
          npm: "@aws-cdk/aws-sqs",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-sqs",
          module: "aws_cdk.aws_sqs",
        },
      },
    },
    "@aws-cdk/aws-ssm": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.AWS.SSM",
          packageId: "Amazon.CDK.AWS.SSM",
        },
        java: {
          maven: {
            artifactId: "ssm",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.services.ssm",
        },
        js: {
          npm: "@aws-cdk/aws-ssm",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.aws-ssm",
          module: "aws_cdk.aws_ssm",
        },
      },
    },
    "@aws-cdk/cloud-assembly-schema": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.CloudAssembly.Schema",
          packageId: "Amazon.CDK.CloudAssembly.Schema",
        },
        java: {
          maven: {
            artifactId: "cdk-cloud-assembly-schema",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.cloudassembly.schema",
        },
        js: {
          npm: "@aws-cdk/cloud-assembly-schema",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.cloud-assembly-schema",
          module: "aws_cdk.cloud_assembly_schema",
        },
      },
    },
    "@aws-cdk/core": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK",
          packageId: "Amazon.CDK",
        },
        java: {
          maven: {
            artifactId: "core",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.core",
        },
        js: {
          npm: "@aws-cdk/core",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.core",
          module: "aws_cdk.core",
        },
      },
    },
    "@aws-cdk/custom-resources": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.CustomResources",
          packageId: "Amazon.CDK.AWS.CustomResources",
        },
        java: {
          maven: {
            artifactId: "cdk-customresources",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.customresources",
        },
        js: {
          npm: "@aws-cdk/custom-resources",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.custom-resources",
          module: "aws_cdk.custom_resources",
        },
      },
    },
    "@aws-cdk/cx-api": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.CXAPI",
          packageId: "Amazon.CDK.CXAPI",
        },
        java: {
          maven: {
            artifactId: "cdk-cx-api",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.cxapi",
        },
        js: {
          npm: "@aws-cdk/cx-api",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.cx-api",
          module: "aws_cdk.cx_api",
        },
      },
    },
    "@aws-cdk/lambda-layer-awscli": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.LambdaLayer.AwsCli",
          packageId: "Amazon.CDK.LambdaLayer.AwsCli",
        },
        java: {
          maven: {
            artifactId: "cdk-lambda-layer-awscli",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.lambdalayer.awscli",
        },
        js: {
          npm: "@aws-cdk/lambda-layer-awscli",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.lambda-layer-awscli",
          module: "aws_cdk.lambda_layer_awscli",
        },
      },
    },
    "@aws-cdk/lambda-layer-kubectl": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.LambdaLayer.Kubectl",
          packageId: "Amazon.CDK.LambdaLayer.Kubectl",
        },
        java: {
          maven: {
            artifactId: "cdk-lambda-layer-kubectl",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.lambdalayer.kubectl",
        },
        js: {
          npm: "@aws-cdk/lambda-layer-kubectl",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.lambda-layer-kubectl",
          module: "aws_cdk.lambda_layer_kubectl",
        },
      },
    },
    "@aws-cdk/region-info": {
      targets: {
        dotnet: {
          iconUrl:
            "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
          namespace: "Amazon.CDK.RegionInfo",
          packageId: "Amazon.CDK.RegionInfo",
        },
        java: {
          maven: {
            artifactId: "cdk-region-info",
            groupId: "software.amazon.awscdk",
          },
          package: "software.amazon.awscdk.regioninfo",
        },
        js: {
          npm: "@aws-cdk/region-info",
        },
        python: {
          classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
          distName: "aws-cdk.region-info",
          module: "aws_cdk.region_info",
        },
      },
    },
    constructs: {
      targets: {
        dotnet: {
          namespace: "Constructs",
          packageId: "Constructs",
        },
        go: {
          moduleName: "github.com/aws/constructs-go",
        },
        java: {
          maven: {
            artifactId: "constructs",
            groupId: "software.constructs",
          },
          package: "software.constructs",
        },
        js: {
          npm: "constructs",
        },
        python: {
          distName: "constructs",
          module: "constructs",
        },
      },
    },
  },
  description: "The CDK Construct Library for AWS::EKS",
  docs: {
    stability: "stable",
  },
  homepage: "https://github.com/aws/aws-cdk",
  jsiiVersion: "1.28.0 (build 1801f4f)",
  keywords: ["aws", "cdk", "constructs", "eks"],
  license: "Apache-2.0",
  metadata: {
    jsii: {
      pacmak: {
        hasDefaultInterfaces: true,
      },
    },
  },
  name: "@aws-cdk/aws-eks",
  readme: {
    markdown:
      "# Amazon EKS Construct Library\n<!--BEGIN STABILITY BANNER-->\n\n---\n\n![cfn-resources: Stable](https://img.shields.io/badge/cfn--resources-stable-success.svg?style=for-the-badge)\n\n![cdk-constructs: Stable](https://img.shields.io/badge/cdk--constructs-stable-success.svg?style=for-the-badge)\n\n---\n\n<!--END STABILITY BANNER-->\n\nThis construct library allows you to define [Amazon Elastic Container Service for Kubernetes (EKS)](https://aws.amazon.com/eks/) clusters.\nIn addition, the library also supports defining Kubernetes resource manifests within EKS clusters.\n\n## Table Of Contents\n\n* [Quick Start](#quick-start)\n* [API Reference](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-eks-readme.html)\n* [Architectural Overview](#architectural-overview)\n* [Provisioning clusters](#provisioning-clusters)\n  * [Managed node groups](#managed-node-groups)\n  * [Fargate Profiles](#fargate-profiles)\n  * [Self-managed nodes](#self-managed-nodes)\n  * [Endpoint Access](#endpoint-access)\n  * [VPC Support](#vpc-support)\n  * [Kubectl Support](#kubectl-support)\n  * [ARM64 Support](#arm64-support)\n  * [Masters Role](#masters-role)\n  * [Encryption](#encryption)\n* [Permissions and Security](#permissions-and-security)\n* [Applying Kubernetes Resources](#applying-kubernetes-resources)\n  * [Kubernetes Manifests](#kubernetes-manifests)\n  * [Helm Charts](#helm-charts)\n  * [CDK8s Charts](#cdk8s-charts)\n* [Patching Kubernetes Resources](#patching-kubernetes-resources)\n* [Querying Kubernetes Resources](#querying-kubernetes-resources)\n* [Using existing clusters](#using-existing-clusters)\n* [Known Issues and Limitations](#known-issues-and-limitations)\n\n## Quick Start\n\nThis example defines an Amazon EKS cluster with the following configuration:\n\n* Dedicated VPC with default configuration (Implicitly created using [ec2.Vpc](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-ec2-readme.html#vpc))\n* A Kubernetes pod with a container based on the [paulbouwer/hello-kubernetes](https://github.com/paulbouwer/hello-kubernetes) image.\n\n```ts\n// provisiong a cluster\nconst cluster = new eks.Cluster(this, 'hello-eks', {\n  version: eks.KubernetesVersion.V1_19,\n});\n\n// apply a kubernetes manifest to the cluster\ncluster.addManifest('mypod', {\n  apiVersion: 'v1',\n  kind: 'Pod',\n  metadata: { name: 'mypod' },\n  spec: {\n    containers: [\n      {\n        name: 'hello',\n        image: 'paulbouwer/hello-kubernetes:1.5',\n        ports: [ { containerPort: 8080 } ]\n      }\n    ]\n  }\n});\n```\n\nIn order to interact with your cluster through `kubectl`, you can use the `aws eks update-kubeconfig` [AWS CLI command](https://docs.aws.amazon.com/cli/latest/reference/eks/update-kubeconfig.html)\nto configure your local kubeconfig. The EKS module will define a CloudFormation output in your stack which contains the command to run. For example:\n\n```plaintext\nOutputs:\nClusterConfigCommand43AAE40F = aws eks update-kubeconfig --name cluster-xxxxx --role-arn arn:aws:iam::112233445566:role/yyyyy\n```\n\nExecute the `aws eks update-kubeconfig ...` command in your terminal to create or update a local kubeconfig context:\n\n```console\n$ aws eks update-kubeconfig --name cluster-xxxxx --role-arn arn:aws:iam::112233445566:role/yyyyy\nAdded new context arn:aws:eks:rrrrr:112233445566:cluster/cluster-xxxxx to /home/boom/.kube/config\n```\n\nAnd now you can simply use `kubectl`:\n\n```console\n$ kubectl get all -n kube-system\nNAME                           READY   STATUS    RESTARTS   AGE\npod/aws-node-fpmwv             1/1     Running   0          21m\npod/aws-node-m9htf             1/1     Running   0          21m\npod/coredns-5cb4fb54c7-q222j   1/1     Running   0          23m\npod/coredns-5cb4fb54c7-v9nxx   1/1     Running   0          23m\n...\n```\n\n## Architectural Overview\n\nThe following is a qualitative diagram of the various possible components involved in the cluster deployment.\n\n```text\n +-----------------------------------------------+               +-----------------+\n |                 EKS Cluster                   |    kubectl    |                 |\n |-----------------------------------------------|<-------------+| Kubectl Handler |\n |                                               |               |                 |\n |                                               |               +-----------------+\n | +--------------------+    +-----------------+ |\n | |                    |    |                 | |\n | | Managed Node Group |    | Fargate Profile | |               +-----------------+\n | |                    |    |                 | |               |                 |\n | +--------------------+    +-----------------+ |               | Cluster Handler |\n |                                               |               |                 |\n +-----------------------------------------------+               +-----------------+\n    ^                                   ^                          +\n    |                                   |                          |\n    | connect self managed capacity     |                          | aws-sdk\n    |                                   | create/update/delete     |\n    +                                   |                          v\n +--------------------+                 +              +-------------------+\n |                    |                 --------------+| eks.amazonaws.com |\n | Auto Scaling Group |                                +-------------------+\n |                    |\n +--------------------+\n```\n\nIn a nutshell:\n\n* `EKS Cluster` - The cluster endpoint created by EKS.\n* `Managed Node Group` - EC2 worker nodes managed by EKS.\n* `Fargate Profile` - Fargate worker nodes managed by EKS.\n* `Auto Scaling Group` - EC2 worker nodes managed by the user.\n* `KubectlHandler` - Lambda function for invoking `kubectl` commands on the cluster - created by CDK.\n* `ClusterHandler` - Lambda function for interacting with EKS API to manage the cluster lifecycle - created by CDK.\n\nA more detailed breakdown of each is provided further down this README.\n\n## Provisioning clusters\n\nCreating a new cluster is done using the `Cluster` or `FargateCluster` constructs. The only required property is the kubernetes `version`.\n\n```ts\nnew eks.Cluster(this, 'HelloEKS', {\n  version: eks.KubernetesVersion.V1_19,\n});\n```\n\nYou can also use `FargateCluster` to provision a cluster that uses only fargate workers.\n\n```ts\nnew eks.FargateCluster(this, 'HelloEKS', {\n  version: eks.KubernetesVersion.V1_19,\n});\n```\n\n> **NOTE: Only 1 cluster per stack is supported.** If you have a use-case for multiple clusters per stack, or would like to understand more about this limitation, see <https://github.com/aws/aws-cdk/issues/10073>.\n\nBelow you'll find a few important cluster configuration options. First of which is Capacity.\nCapacity is the amount and the type of worker nodes that are available to the cluster for deploying resources. Amazon EKS offers 3 ways of configuring capacity, which you can combine as you like:\n\n### Managed node groups\n\nAmazon EKS managed node groups automate the provisioning and lifecycle management of nodes (Amazon EC2 instances) for Amazon EKS Kubernetes clusters.\nWith Amazon EKS managed node groups, you don’t need to separately provision or register the Amazon EC2 instances that provide compute capacity to run your Kubernetes applications. You can create, update, or terminate nodes for your cluster with a single operation. Nodes run using the latest Amazon EKS optimized AMIs in your AWS account while node updates and terminations gracefully drain nodes to ensure that your applications stay available.\n\n> For more details visit [Amazon EKS Managed Node Groups](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html).\n\n**Managed Node Groups are the recommended way to allocate cluster capacity.**\n\nBy default, this library will allocate a managed node group with 2 *m5.large* instances (this instance type suits most common use-cases, and is good value for money).\n\nAt cluster instantiation time, you can customize the number of instances and their type:\n\n```ts\nnew eks.Cluster(this, 'HelloEKS', {\n  version: eks.KubernetesVersion.V1_19,\n  defaultCapacity: 5,\n  defaultCapacityInstance: ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.SMALL),\n});\n```\n\nTo access the node group that was created on your behalf, you can use `cluster.defaultNodegroup`.\n\nAdditional customizations are available post instantiation. To apply them, set the default capacity to 0, and use the `cluster.addNodegroupCapacity` method:\n\n```ts\nconst cluster = new eks.Cluster(this, 'HelloEKS', {\n  version: eks.KubernetesVersion.V1_19,\n  defaultCapacity: 0,\n});\n\ncluster.addNodegroupCapacity('custom-node-group', {\n  instanceTypes: [new ec2.InstanceType('m5.large')],\n  minSize: 4,\n  diskSize: 100,\n  amiType: eks.NodegroupAmiType.AL2_X86_64_GPU,\n  ...\n});\n```\n\n#### Spot Instances Support\n\nUse `capacityType` to create managed node groups comprised of spot instances. To maximize the availability of your applications while using\nSpot Instances, we recommend that you configure a Spot managed node group to use multiple instance types with the `instanceTypes` property.\n\n> For more details visit [Managed node group capacity types](https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html#managed-node-group-capacity-types).\n\n\n```ts\ncluster.addNodegroupCapacity('extra-ng-spot', {\n  instanceTypes: [\n    new ec2.InstanceType('c5.large'),\n    new ec2.InstanceType('c5a.large'),\n    new ec2.InstanceType('c5d.large'),\n  ],\n  minSize: 3,\n  capacityType: eks.CapacityType.SPOT,\n});\n\n```\n\n#### Launch Template Support\n\nYou can specify a launch template that the node group will use. For example, this can be useful if you want to use\na custom AMI or add custom user data.\n\nWhen supplying a custom user data script, it must be encoded in the MIME multi-part archive format, since Amazon EKS merges with its own user data. Visit the [Launch Template Docs](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html#launch-template-user-data)\nfor mode details.\n\n```ts\nconst userData = `MIME-Version: 1.0\nContent-Type: multipart/mixed; boundary=\"==MYBOUNDARY==\"\n\n--==MYBOUNDARY==\nContent-Type: text/x-shellscript; charset=\"us-ascii\"\n\n#!/bin/bash\necho \"Running custom user data script\"\n\n--==MYBOUNDARY==--\\\\\n`;\nconst lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {\n  launchTemplateData: {\n    instanceType: 't3.small',\n    userData: Fn.base64(userData),\n  },\n});\ncluster.addNodegroupCapacity('extra-ng', {\n  launchTemplateSpec: {\n    id: lt.ref,\n    version: lt.attrLatestVersionNumber,\n  },\n});\n\n```\n\nNote that when using a custom AMI, Amazon EKS doesn't merge any user data. Which means you do not need the multi-part encoding. and are responsible for supplying the required bootstrap commands for nodes to join the cluster.\nIn the following example, `/ect/eks/bootstrap.sh` from the AMI will be used to bootstrap the node.\n\n```ts\nconst userData = ec2.UserData.forLinux();\nuserData.addCommands(\n  'set -o xtrace',\n  `/etc/eks/bootstrap.sh ${cluster.clusterName}`,\n);\nconst lt = new ec2.CfnLaunchTemplate(this, 'LaunchTemplate', {\n  launchTemplateData: {\n    imageId: 'some-ami-id', // custom AMI\n    instanceType: 't3.small',\n    userData: Fn.base64(userData.render()),\n  },\n});\ncluster.addNodegroupCapacity('extra-ng', {\n  launchTemplateSpec: {\n    id: lt.ref,\n    version: lt.attrLatestVersionNumber,\n  },\n});\n```\n\nYou may specify one `instanceType` in the launch template or multiple `instanceTypes` in the node group, **but not both**.\n\n> For more details visit [Launch Template Support](https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html).\n\nGraviton 2 instance types are supported including `c6g`, `m6g`, `r6g` and `t4g`.\n\n### Fargate profiles\n\nAWS Fargate is a technology that provides on-demand, right-sized compute\ncapacity for containers. With AWS Fargate, you no longer have to provision,\nconfigure, or scale groups of virtual machines to run containers. This removes\nthe need to choose server types, decide when to scale your node groups, or\noptimize cluster packing.\n\nYou can control which pods start on Fargate and how they run with Fargate\nProfiles, which are defined as part of your Amazon EKS cluster.\n\nSee [Fargate Considerations](https://docs.aws.amazon.com/eks/latest/userguide/fargate.html#fargate-considerations) in the AWS EKS User Guide.\n\nYou can add Fargate Profiles to any EKS cluster defined in your CDK app\nthrough the `addFargateProfile()` method. The following example adds a profile\nthat will match all pods from the \"default\" namespace:\n\n```ts\ncluster.addFargateProfile('MyProfile', {\n  selectors: [ { namespace: 'default' } ]\n});\n```\n\nYou can also directly use the `FargateProfile` construct to create profiles under different scopes:\n\n```ts\nnew eks.FargateProfile(scope, 'MyProfile', {\n  cluster,\n  ...\n});\n```\n\nTo create an EKS cluster that **only** uses Fargate capacity, you can use `FargateCluster`.\nThe following code defines an Amazon EKS cluster with a default Fargate Profile that matches all pods from the \"kube-system\" and \"default\" namespaces. It is also configured to [run CoreDNS on Fargate](https://docs.aws.amazon.com/eks/latest/userguide/fargate-getting-started.html#fargate-gs-coredns).\n\n```ts\nconst cluster = new eks.FargateCluster(this, 'MyCluster', {\n  version: eks.KubernetesVersion.V1_19,\n});\n```\n\n**NOTE**: Classic Load Balancers and Network Load Balancers are not supported on\npods running on Fargate. For ingress, we recommend that you use the [ALB Ingress\nController](https://docs.aws.amazon.com/eks/latest/userguide/alb-ingress.html)\non Amazon EKS (minimum version v1.1.4).\n\n### Self-managed nodes\n\nAnother way of allocating capacity to an EKS cluster is by using self-managed nodes.\nEC2 instances that are part of the auto-scaling group will serve as worker nodes for the cluster.\nThis type of capacity is also commonly referred to as *EC2 Capacity** or *EC2 Nodes*.\n\nFor a detailed overview please visit [Self Managed Nodes](https://docs.aws.amazon.com/eks/latest/userguide/worker.html).\n\nCreating an auto-scaling group and connecting it to the cluster is done using the `cluster.addAutoScalingGroupCapacity` method:\n\n```ts\ncluster.addAutoScalingGroupCapacity('frontend-nodes', {\n  instanceType: new ec2.InstanceType('t2.medium'),\n  minCapacity: 3,\n  vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }\n});\n```\n\nTo connect an already initialized auto-scaling group, use the `cluster.connectAutoScalingGroupCapacity()` method:\n\n```ts\nconst asg = new ec2.AutoScalingGroup(...);\ncluster.connectAutoScalingGroupCapacity(asg);\n```\n\nIn both cases, the [cluster security group](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html#cluster-sg) will be automatically attached to\nthe auto-scaling group, allowing for traffic to flow freely between managed and self-managed nodes.\n\n> **Note:** The default `updateType` for auto-scaling groups does not replace existing nodes. Since security groups are determined at launch time, self-managed nodes that were provisioned with version `1.78.0` or lower, will not be updated.\n> To apply the new configuration on all your self-managed nodes, you'll need to replace the nodes using the `UpdateType.REPLACING_UPDATE` policy for the [`updateType`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-autoscaling.AutoScalingGroup.html#updatetypespan-classapi-icon-api-icon-deprecated-titlethis-api-element-is-deprecated-its-use-is-not-recommended%EF%B8%8Fspan) property.\n\nYou can customize the [/etc/eks/boostrap.sh](https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh) script, which is responsible\nfor bootstrapping the node to the EKS cluster. For example, you can use `kubeletExtraArgs` to add custom node labels or taints.\n\n```ts\ncluster.addAutoScalingGroupCapacity('spot', {\n  instanceType: new ec2.InstanceType('t3.large'),\n  minCapacity: 2,\n  bootstrapOptions: {\n    kubeletExtraArgs: '--node-labels foo=bar,goo=far',\n    awsApiRetryAttempts: 5\n  }\n});\n```\n\nTo disable bootstrapping altogether (i.e. to fully customize user-data), set `bootstrapEnabled` to `false`.\nYou can also configure the cluster to use an auto-scaling group as the default capacity:\n\n```ts\ncluster = new eks.Cluster(this, 'HelloEKS', {\n  version: eks.KubernetesVersion.V1_19,\n  defaultCapacityType: eks.DefaultCapacityType.EC2,\n});\n```\n\nThis will allocate an auto-scaling group with 2 *m5.large* instances (this instance type suits most common use-cases, and is good value for money).\nTo access the `AutoScalingGroup` that was created on your behalf, you can use `cluster.defaultCapacity`.\nYou can also independently create an `AutoScalingGroup` and connect it to the cluster using the `cluster.connectAutoScalingGroupCapacity` method:\n\n```ts\nconst asg = new ec2.AutoScalingGroup(...)\ncluster.connectAutoScalingGroupCapacity(asg);\n```\n\nThis will add the necessary user-data to access the apiserver and configure all connections, roles, and tags needed for the instances in the auto-scaling group to properly join the cluster.\n\n#### Spot Instances\n\nWhen using self-managed nodes, you can configure the capacity to use spot instances, greatly reducing capacity cost.\nTo enable spot capacity, use the `spotPrice` property:\n\n```ts\ncluster.addAutoScalingGroupCapacity('spot', {\n  spotPrice: '0.1094',\n  instanceType: new ec2.InstanceType('t3.large'),\n  maxCapacity: 10\n});\n```\n\n> Spot instance nodes will be labeled with `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.\n\nThe [AWS Node Termination Handler](https://github.com/aws/aws-node-termination-handler) `DaemonSet` will be\ninstalled from [Amazon EKS Helm chart repository](https://github.com/aws/eks-charts/tree/master/stable/aws-node-termination-handler) on these nodes.\nThe termination handler ensures that the Kubernetes control plane responds appropriately to events that\ncan cause your EC2 instance to become unavailable, such as [EC2 maintenance events](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/monitoring-instances-status-check_sched.html)\nand [EC2 Spot interruptions](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-interruptions.html) and helps gracefully stop all pods running on spot nodes that are about to be\nterminated.\n\n> Handler Version: [1.7.0](https://github.com/aws/aws-node-termination-handler/releases/tag/v1.7.0)\n>\n> Chart Version: [0.9.5](https://github.com/aws/eks-charts/blob/v0.0.28/stable/aws-node-termination-handler/Chart.yaml)\n\nTo disable the installation of the termination handler, set the `spotInterruptHandler` property to `false`. This applies both to `addAutoScalingGroupCapacity` and `connectAutoScalingGroupCapacity`.\n\n#### Bottlerocket\n\n[Bottlerocket](https://aws.amazon.com/bottlerocket/) is a Linux-based open-source operating system that is purpose-built by Amazon Web Services for running containers on virtual machines or bare metal hosts.\nAt this moment, `Bottlerocket` is only supported when using self-managed auto-scaling groups.\n\n> **NOTICE**: Bottlerocket is only available in [some supported AWS regions](https://github.com/bottlerocket-os/bottlerocket/blob/develop/QUICKSTART-EKS.md#finding-an-ami).\n\nThe following example will create an auto-scaling group of 2 `t3.small` Linux instances running with the `Bottlerocket` AMI.\n\n```ts\ncluster.addAutoScalingGroupCapacity('BottlerocketNodes', {\n  instanceType: new ec2.InstanceType('t3.small'),\n  minCapacity:  2,\n  machineImageType: eks.MachineImageType.BOTTLEROCKET\n});\n```\n\nThe specific Bottlerocket AMI variant will be auto selected according to the k8s version for the `x86_64` architecture.\nFor example, if the Amazon EKS cluster version is `1.17`, the Bottlerocket AMI variant will be auto selected as\n`aws-k8s-1.17` behind the scene.\n\n> See [Variants](https://github.com/bottlerocket-os/bottlerocket/blob/develop/README.md#variants) for more details.\n\nPlease note Bottlerocket does not allow to customize bootstrap options and `bootstrapOptions` properties is not supported when you create the `Bottlerocket` capacity.\n\n### Endpoint Access\n\nWhen you create a new cluster, Amazon EKS creates an endpoint for the managed Kubernetes API server that you use to communicate with your cluster (using Kubernetes management tools such as `kubectl`)\n\nBy default, this API server endpoint is public to the internet, and access to the API server is secured using a combination of\nAWS Identity and Access Management (IAM) and native Kubernetes [Role Based Access Control](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) (RBAC).\n\nYou can configure the [cluster endpoint access](https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html) by using the `endpointAccess` property:\n\n```ts\nconst cluster = new eks.Cluster(this, 'hello-eks', {\n  version: eks.KubernetesVersion.V1_19,\n  endpointAccess: eks.EndpointAccess.PRIVATE // No access outside of your VPC.\n});\n```\n\nThe default value is `eks.EndpointAccess.PUBLIC_AND_PRIVATE`. Which means the cluster endpoint is accessible from outside of your VPC, but worker node traffic and `kubectl` commands issued by this library stay within your VPC.\n\n### VPC Support\n\nYou can specify the VPC of the cluster using the `vpc` and `vpcSubnets` properties:\n\n```ts\nconst vpc = new ec2.Vpc(this, 'Vpc');\n\nnew eks.Cluster(this, 'HelloEKS', {\n  version: eks.KubernetesVersion.V1_19,\n  vpc,\n  vpcSubnets: [{ subnetType: ec2.SubnetType.PRIVATE }]\n});\n```\n\n> Note: Isolated VPCs (i.e with no internet access) are not currently supported. See https://github.com/aws/aws-cdk/issues/12171\n\nIf you do not specify a VPC, one will be created on your behalf, which you can then access via `cluster.vpc`. The cluster VPC will be associated to any EKS managed capacity (i.e Managed Node Groups and Fargate Profiles).\n\nIf you allocate self managed capacity, you can specify which subnets should the auto-scaling group use:\n\n```ts\nconst vpc = new ec2.Vpc(this, 'Vpc');\ncluster.addAutoScalingGroupCapacity('nodes', {\n  vpcSubnets: { subnets: vpc.privateSubnets }\n});\n```\n\nThere are two additional components you might want to provision within the VPC.\n\n#### Kubectl Handler\n\nThe `KubectlHandler` is a Lambda function responsible to issuing `kubectl` and `helm` commands against the cluster when you add resource manifests to the cluster.\n\nThe handler association to the VPC is derived from the `endpointAccess` configuration. The rule of thumb is: *If the cluster VPC can be associated, it will be*.\n\nBreaking this down, it means that if the endpoint exposes private access (via `EndpointAccess.PRIVATE` or `EndpointAccess.PUBLIC_AND_PRIVATE`), and the VPC contains **private** subnets, the Lambda function will be provisioned inside the VPC and use the private subnets to interact with the cluster. This is the common use-case.\n\nIf the endpoint does not expose private access (via `EndpointAccess.PUBLIC`) **or** the VPC does not contain private subnets, the function will not be provisioned within the VPC.\n\n#### Cluster Handler\n\nThe `ClusterHandler` is a Lambda function responsible to interact with the EKS API in order to control the cluster lifecycle. To provision this function inside the VPC, set the `placeClusterHandlerInVpc` property to `true`. This will place the function inside the private subnets of the VPC based on the selection strategy specified in the [`vpcSubnets`](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-eks.Cluster.html#vpcsubnetsspan-classapi-icon-api-icon-experimental-titlethis-api-element-is-experimental-it-may-change-without-noticespan) property.\n\nYou can configure the environment of this function by specifying it at cluster instantiation. For example, this can be useful in order to configure an http proxy:\n\n```ts\nconst cluster = new eks.Cluster(this, 'hello-eks', {\n  version: eks.KubernetesVersion.V1_19,\n  clusterHandlerEnvironment: {\n    'http_proxy': 'http://proxy.myproxy.com'\n  }\n});\n```\n\n### Kubectl Support\n\nThe resources are created in the cluster by running `kubectl apply` from a python lambda function.\n\n#### Environment\n\nYou can configure the environment of this function by specifying it at cluster instantiation. For example, this can be useful in order to configure an http proxy:\n\n```ts\nconst cluster = new eks.Cluster(this, 'hello-eks', {\n  version: eks.KubernetesVersion.V1_19,\n  kubectlEnvironment: {\n    'http_proxy': 'http://proxy.myproxy.com'\n  }\n});\n```\n\n#### Runtime\n\nThe kubectl handler uses `kubectl`, `helm` and the `aws` CLI in order to\ninteract with the cluster. These are bundled into AWS Lambda layers included in\nthe `@aws-cdk/lambda-layer-awscli` and `@aws-cdk/lambda-layer-kubectl` modules.\n\nYou can specify a custom `lambda.LayerVersion` if you wish to use a different\nversion of these tools. The handler expects the layer to include the following\nthree executables:\n\n```text\nhelm/helm\nkubectl/kubectl\nawscli/aws\n```\n\nSee more information in the\n[Dockerfile](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/lambda-layer-awscli/layer) for @aws-cdk/lambda-layer-awscli\nand the\n[Dockerfile](https://github.com/aws/aws-cdk/tree/master/packages/%40aws-cdk/lambda-layer-kubectl/layer) for @aws-cdk/lambda-layer-kubectl.\n\n```ts\nconst layer = new lambda.LayerVersion(this, 'KubectlLayer', {\n  code: lambda.Code.fromAsset('layer.zip'),\n});\n```\n\nNow specify when the cluster is defined:\n\n```ts\nconst cluster = new eks.Cluster(this, 'MyCluster', {\n  kubectlLayer: layer,\n});\n\n// or\nconst cluster = eks.Cluster.fromClusterAttributes(this, 'MyCluster', {\n  kubectlLayer: layer,\n});\n```\n\n#### Memory\n\nBy default, the kubectl provider is configured with 1024MiB of memory. You can use the `kubectlMemory` option to specify the memory size for the AWS Lambda function:\n\n```ts\nimport { Size } from '@aws-cdk/core';\n\nnew eks.Cluster(this, 'MyCluster', {\n  kubectlMemory: Size.gibibytes(4)\n});\n\n// or\neks.Cluster.fromClusterAttributes(this, 'MyCluster', {\n  kubectlMemory: Size.gibibytes(4)\n});\n```\n\n### ARM64 Support\n\nInstance types with `ARM64` architecture are supported in both managed nodegroup and self-managed capacity. Simply specify an ARM64 `instanceType` (such as `m6g.medium`), and the latest\nAmazon Linux 2 AMI for ARM64 will be automatically selected.\n\n```ts\n// add a managed ARM64 nodegroup\ncluster.addNodegroupCapacity('extra-ng-arm', {\n  instanceTypes: [new ec2.InstanceType('m6g.medium')],\n  minSize: 2,\n});\n\n// add a self-managed ARM64 nodegroup\ncluster.addAutoScalingGroupCapacity('self-ng-arm', {\n  instanceType: new ec2.InstanceType('m6g.medium'),\n  minCapacity: 2,\n})\n```\n\n### Masters Role\n\nWhen you create a cluster, you can specify a `mastersRole`. The `Cluster` construct will associate this role with the `system:masters` [RBAC](https://kubernetes.io/docs/reference/access-authn-authz/rbac/) group, giving it super-user access to the cluster.\n\n```ts\nconst role = new iam.Role(...);\nnew eks.Cluster(this, 'HelloEKS', {\n  version: eks.KubernetesVersion.V1_19,\n  mastersRole: role,\n});\n```\n\nIf you do not specify it, a default role will be created on your behalf, that can be assumed by anyone in the account with `sts:AssumeRole` permissions for this role.\n\nThis is the role you see as part of the stack outputs mentioned in the [Quick Start](#quick-start).\n\n```console\n$ aws eks update-kubeconfig --name cluster-xxxxx --role-arn arn:aws:iam::112233445566:role/yyyyy\nAdded new context arn:aws:eks:rrrrr:112233445566:cluster/cluster-xxxxx to /home/boom/.kube/config\n```\n\n### Encryption\n\nWhen you create an Amazon EKS cluster, envelope encryption of Kubernetes secrets using the AWS Key Management Service (AWS KMS) can be enabled.\nThe documentation on [creating a cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html)\ncan provide more details about the customer master key (CMK) that can be used for the encryption.\n\nYou can use the `secretsEncryptionKey` to configure which key the cluster will use to encrypt Kubernetes secrets. By default, an AWS Managed key will be used.\n\n> This setting can only be specified when the cluster is created and cannot be updated.\n\n```ts\nconst secretsKey = new kms.Key(this, 'SecretsKey');\nconst cluster = new eks.Cluster(this, 'MyCluster', {\n  secretsEncryptionKey: secretsKey,\n  // ...\n});\n```\n\nYou can also use a similiar configuration for running a cluster built using the FargateCluster construct.\n\n```ts\nconst secretsKey = new kms.Key(this, 'SecretsKey');\nconst cluster = new eks.FargateCluster(this, 'MyFargateCluster', {\n  secretsEncryptionKey: secretsKey\n});\n```\n\nThe Amazon Resource Name (ARN) for that CMK can be retrieved.\n\n```ts\nconst clusterEncryptionConfigKeyArn = cluster.clusterEncryptionConfigKeyArn;\n```\n\n## Permissions and Security\n\nAmazon EKS provides several mechanism of securing the cluster and granting permissions to specific IAM users and roles.\n\n### AWS IAM Mapping\n\nAs described in the [Amazon EKS User Guide](https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html), you can map AWS IAM users and roles to [Kubernetes Role-based access control (RBAC)](https://kubernetes.io/docs/reference/access-authn-authz/rbac).\n\nThe Amazon EKS construct manages the *aws-auth* `ConfigMap` Kubernetes resource on your behalf and exposes an API through the `cluster.awsAuth` for mapping\nusers, roles and accounts.\n\nFurthermore, when auto-scaling group capacity is added to the cluster, the IAM instance role of the auto-scaling group will be automatically mapped to RBAC so nodes can connect to the cluster. No manual mapping is required.\n\nFor example, let's say you want to grant an IAM user administrative privileges on your cluster:\n\n```ts\nconst adminUser = new iam.User(this, 'Admin');\ncluster.awsAuth.addUserMapping(adminUser, { groups: [ 'system:masters' ]});\n```\n\nA convenience method for mapping a role to the `system:masters` group is also available:\n\n```ts\ncluster.awsAuth.addMastersRole(role)\n```\n\n### Cluster Security Group\n\nWhen you create an Amazon EKS cluster, a [cluster security group](https://docs.aws.amazon.com/eks/latest/userguide/sec-group-reqs.html)\nis automatically created as well. This security group is designed to allow all traffic from the control plane and managed node groups to flow freely\nbetween each other.\n\nThe ID for that security group can be retrieved after creating the cluster.\n\n```ts\nconst clusterSecurityGroupId = cluster.clusterSecurityGroupId;\n```\n\n### Node SSH Access\n\nIf you want to be able to SSH into your worker nodes, you must already have an SSH key in the region you're connecting to and pass it when\nyou add capacity to the cluster. You must also be able to connect to the hosts (meaning they must have a public IP and you\nshould be allowed to connect to them on port 22):\n\nSee [SSH into nodes](test/example.ssh-into-nodes.lit.ts) for a code example.\n\nIf you want to SSH into nodes in a private subnet, you should set up a bastion host in a public subnet. That setup is recommended, but is\nunfortunately beyond the scope of this documentation.\n\n### Service Accounts\n\nWith services account you can provide Kubernetes Pods access to AWS resources.\n\n```ts\n// add service account\nconst sa = cluster.addServiceAccount('MyServiceAccount');\n\nconst bucket = new Bucket(this, 'Bucket');\nbucket.grantReadWrite(serviceAccount);\n\nconst mypod = cluster.addManifest('mypod', {\n  apiVersion: 'v1',\n  kind: 'Pod',\n  metadata: { name: 'mypod' },\n  spec: {\n    serviceAccountName: sa.serviceAccountName\n    containers: [\n      {\n        name: 'hello',\n        image: 'paulbouwer/hello-kubernetes:1.5',\n        ports: [ { containerPort: 8080 } ],\n\n      }\n    ]\n  }\n});\n\n// create the resource after the service account.\nmypod.node.addDependency(sa);\n\n// print the IAM role arn for this service account\nnew cdk.CfnOutput(this, 'ServiceAccountIamRole', { value: sa.role.roleArn })\n```\n\nNote that using `sa.serviceAccountName` above **does not** translate into a resource dependency.\nThis is why an explicit dependency is needed. See <https://github.com/aws/aws-cdk/issues/9910> for more details.\n\nYou can also add service accounts to existing clusters.\nTo do so, pass the `openIdConnectProvider` property when you import the cluster into the application.\n\n```ts\n// you can import an existing provider\nconst provider = eks.OpenIdConnectProvider.fromOpenIdConnectProviderArn(this, 'Provider', 'arn:aws:iam::123456:oidc-provider/oidc.eks.eu-west-1.amazonaws.com/id/AB123456ABC');\n\n// or create a new one using an existing issuer url\nconst provider = new eks.OpenIdConnectProvider(this, 'Provider', issuerUrl);\n\nconst cluster = eks.Cluster.fromClusterAttributes({\n  clusterName: 'Cluster',\n  openIdConnectProvider: provider,\n  kubectlRoleArn: 'arn:aws:iam::123456:role/service-role/k8sservicerole',\n});\n\nconst sa = cluster.addServiceAccount('MyServiceAccount');\n\nconst bucket = new Bucket(this, 'Bucket');\nbucket.grantReadWrite(serviceAccount);\n\n// ...\n```\n\nNote that adding service accounts requires running `kubectl` commands against the cluster.\nThis means you must also pass the `kubectlRoleArn` when importing the cluster.\nSee [Using existing Clusters](https://github.com/aws/aws-cdk/tree/master/packages/@aws-cdk/aws-eks#using-existing-clusters).\n\n## Applying Kubernetes Resources\n\nThe library supports several popular resource deployment mechanisms, among which are:\n\n### Kubernetes Manifests\n\nThe `KubernetesManifest` construct or `cluster.addManifest` method can be used\nto apply Kubernetes resource manifests to this cluster.\n\n> When using `cluster.addManifest`, the manifest construct is defined within the cluster's stack scope. If the manifest contains\n> attributes from a different stack which depend on the cluster stack, a circular dependency will be created and you will get a synth time error.\n> To avoid this, directly use `new KubernetesManifest` to create the manifest in the scope of the other stack.\n\nThe following examples will deploy the [paulbouwer/hello-kubernetes](https://github.com/paulbouwer/hello-kubernetes)\nservice on the cluster:\n\n```ts\nconst appLabel = { app: \"hello-kubernetes\" };\n\nconst deployment = {\n  apiVersion: \"apps/v1\",\n  kind: \"Deployment\",\n  metadata: { name: \"hello-kubernetes\" },\n  spec: {\n    replicas: 3,\n    selector: { matchLabels: appLabel },\n    template: {\n      metadata: { labels: appLabel },\n      spec: {\n        containers: [\n          {\n            name: \"hello-kubernetes\",\n            image: \"paulbouwer/hello-kubernetes:1.5\",\n            ports: [ { containerPort: 8080 } ]\n          }\n        ]\n      }\n    }\n  }\n};\n\nconst service = {\n  apiVersion: \"v1\",\n  kind: \"Service\",\n  metadata: { name: \"hello-kubernetes\" },\n  spec: {\n    type: \"LoadBalancer\",\n    ports: [ { port: 80, targetPort: 8080 } ],\n    selector: appLabel\n  }\n};\n\n// option 1: use a construct\nnew KubernetesManifest(this, 'hello-kub', {\n  cluster,\n  manifest: [ deployment, service ]\n});\n\n// or, option2: use `addManifest`\ncluster.addManifest('hello-kub', service, deployment);\n```\n\n#### Adding resources from a URL\n\nThe following example will deploy the resource manifest hosting on remote server:\n\n```ts\nimport * as yaml from 'js-yaml';\nimport * as request from 'sync-request';\n\nconst manifestUrl = 'https://url/of/manifest.yaml';\nconst manifest = yaml.safeLoadAll(request('GET', manifestUrl).getBody());\ncluster.addManifest('my-resource', ...manifest);\n```\n\n#### Dependencies\n\nThere are cases where Kubernetes resources must be deployed in a specific order.\nFor example, you cannot define a resource in a Kubernetes namespace before the\nnamespace was created.\n\nYou can represent dependencies between `KubernetesManifest`s using\n`resource.node.addDependency()`:\n\n```ts\nconst namespace = cluster.addManifest('my-namespace', {\n  apiVersion: 'v1',\n  kind: 'Namespace',\n  metadata: { name: 'my-app' }\n});\n\nconst service = cluster.addManifest('my-service', {\n  metadata: {\n    name: 'myservice',\n    namespace: 'my-app'\n  },\n  spec: // ...\n});\n\nservice.node.addDependency(namespace); // will apply `my-namespace` before `my-service`.\n```\n\n**NOTE:** when a `KubernetesManifest` includes multiple resources (either directly\nor through `cluster.addManifest()`) (e.g. `cluster.addManifest('foo', r1, r2,\nr3,...)`), these resources will be applied as a single manifest via `kubectl`\nand will be applied sequentially (the standard behavior in `kubectl`).\n\n---\n\nSince Kubernetes manifests are implemented as CloudFormation resources in the\nCDK. This means that if the manifest is deleted from your code (or the stack is\ndeleted), the next `cdk deploy` will issue a `kubectl delete` command and the\nKubernetes resources in that manifest will be deleted.\n\n#### Resource Pruning\n\nWhen a resource is deleted from a Kubernetes manifest, the EKS module will\nautomatically delete these resources by injecting a _prune label_ to all\nmanifest resources. This label is then passed to [`kubectl apply --prune`].\n\n[`kubectl apply --prune`]: https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune-l-your-label\n\nPruning is enabled by default but can be disabled through the `prune` option\nwhen a cluster is defined:\n\n```ts\nnew Cluster(this, 'MyCluster', {\n  prune: false\n});\n```\n\n#### Manifests Validation\n\nThe `kubectl` CLI supports applying a manifest by skipping the validation.\nThis can be accomplished by setting the `skipValidation` flag to `true` in the `KubernetesManifest` props.\n\n```ts\nnew eks.KubernetesManifest(this, 'HelloAppWithoutValidation', {\n  cluster: this.cluster,\n  manifest: [ deployment, service ],\n  skipValidation: true,\n});\n```\n\n### Helm Charts\n\nThe `HelmChart` construct or `cluster.addHelmChart` method can be used\nto add Kubernetes resources to this cluster using Helm.\n\n> When using `cluster.addHelmChart`, the manifest construct is defined within the cluster's stack scope. If the manifest contains\n> attributes from a different stack which depend on the cluster stack, a circular dependency will be created and you will get a synth time error.\n> To avoid this, directly use `new HelmChart` to create the chart in the scope of the other stack.\n\nThe following example will install the [NGINX Ingress Controller](https://kubernetes.github.io/ingress-nginx/) to your cluster using Helm.\n\n```ts\n// option 1: use a construct\nnew HelmChart(this, 'NginxIngress', {\n  cluster,\n  chart: 'nginx-ingress',\n  repository: 'https://helm.nginx.com/stable',\n  namespace: 'kube-system'\n});\n\n// or, option2: use `addHelmChart`\ncluster.addHelmChart('NginxIngress', {\n  chart: 'nginx-ingress',\n  repository: 'https://helm.nginx.com/stable',\n  namespace: 'kube-system'\n});\n```\n\nHelm charts will be installed and updated using `helm upgrade --install`, where a few parameters\nare being passed down (such as `repo`, `values`, `version`, `namespace`, `wait`, `timeout`, etc).\nThis means that if the chart is added to CDK with the same release name, it will try to update\nthe chart in the cluster.\n\nHelm charts are implemented as CloudFormation resources in CDK.\nThis means that if the chart is deleted from your code (or the stack is\ndeleted), the next `cdk deploy` will issue a `helm uninstall` command and the\nHelm chart will be deleted.\n\nWhen there is no `release` defined, a unique ID will be allocated for the release based\non the construct path.\n\nBy default, all Helm charts will be installed concurrently. In some cases, this\ncould cause race conditions where two Helm charts attempt to deploy the same\nresource or if Helm charts depend on each other. You can use\n`chart.node.addDependency()` in order to declare a dependency order between\ncharts:\n\n```ts\nconst chart1 = cluster.addHelmChart(...);\nconst chart2 = cluster.addHelmChart(...);\n\nchart2.node.addDependency(chart1);\n```\n\n#### CDK8s Charts\n\n[CDK8s](https://cdk8s.io/) is an open-source library that enables Kubernetes manifest authoring using familiar programming languages. It is founded on the same technologies as the AWS CDK, such as [`constructs`](https://github.com/aws/constructs) and [`jsii`](https://github.com/aws/jsii).\n\n> To learn more about cdk8s, visit the [Getting Started](https://github.com/awslabs/cdk8s/tree/master/docs/getting-started) tutorials.\n\nThe EKS module natively integrates with cdk8s and allows you to apply cdk8s charts on AWS EKS clusters via the `cluster.addCdk8sChart` method.\n\nIn addition to `cdk8s`, you can also use [`cdk8s+`](https://github.com/awslabs/cdk8s/tree/master/packages/cdk8s-plus), which provides higher level abstraction for the core kubernetes api objects.\nYou can think of it like the `L2` constructs for Kubernetes. Any other `cdk8s` based libraries are also supported, for example [`cdk8s-debore`](https://github.com/toricls/cdk8s-debore).\n\nTo get started, add the following dependencies to your `package.json` file:\n\n```json\n\"dependencies\": {\n  \"cdk8s\": \"0.30.0\",\n  \"cdk8s-plus\": \"0.30.0\",\n  \"constructs\": \"3.0.4\"\n}\n```\n\n> Note that the version of `cdk8s` must be `>=0.30.0`.\n\nSimilarly to how you would create a stack by extending `@aws-cdk/core.Stack`, we recommend you create a chart of your own that extends `cdk8s.Chart`,\nand add your kubernetes resources to it. You can use `aws-cdk` construct attributes and properties inside your `cdk8s` construct freely.\n\nIn this example we create a chart that accepts an `s3.Bucket` and passes its name to a kubernetes pod as an environment variable.\n\nNotice that the chart must accept a `constructs.Construct` type as its scope, not an `@aws-cdk/core.Construct` as you would normally use.\nFor this reason, to avoid possible confusion, we will create the chart in a separate file:\n\n`+ my-chart.ts`\n\n```ts\nimport * as s3 from '@aws-cdk/aws-s3';\nimport * as constructs from 'constructs';\nimport * as cdk8s from 'cdk8s';\nimport * as kplus from 'cdk8s-plus';\n\nexport interface MyChartProps {\n  readonly bucket: s3.Bucket;\n}\n\nexport class MyChart extends cdk8s.Chart {\n  constructor(scope: constructs.Construct, id: string, props: MyChartProps) {\n    super(scope, id);\n\n    new kplus.Pod(this, 'Pod', {\n      spec: {\n        containers: [\n          new kplus.Container({\n            image: 'my-image',\n            env: {\n              BUCKET_NAME: kplus.EnvValue.fromValue(props.bucket.bucketName),\n            },\n          }),\n        ],\n      },\n    });\n  }\n}\n```\n\nThen, in your AWS CDK app:\n\n```ts\nimport * as s3 from '@aws-cdk/aws-s3';\nimport * as cdk8s from 'cdk8s';\nimport { MyChart } from './my-chart';\n\n// some bucket..\nconst bucket = new s3.Bucket(this, 'Bucket');\n\n// create a cdk8s chart and use `cdk8s.App` as the scope.\nconst myChart = new MyChart(new cdk8s.App(), 'MyChart', { bucket });\n\n// add the cdk8s chart to the cluster\ncluster.addCdk8sChart('my-chart', myChart);\n```\n\n##### Custom CDK8s Constructs\n\nYou can also compose a few stock `cdk8s+` constructs into your own custom construct. However, since mixing scopes between `aws-cdk` and `cdk8s` is currently not supported, the `Construct` class\nyou'll need to use is the one from the [`constructs`](https://github.com/aws/constructs) module, and not from `@aws-cdk/core` like you normally would.\nThis is why we used `new cdk8s.App()` as the scope of the chart above.\n\n```ts\nimport * as constructs from 'constructs';\nimport * as cdk8s from 'cdk8s';\nimport * as kplus from 'cdk8s-plus';\n\nexport interface LoadBalancedWebService {\n  readonly port: number;\n  readonly image: string;\n  readonly replicas: number;\n}\n\nexport class LoadBalancedWebService extends constructs.Construct {\n  constructor(scope: constructs.Construct, id: string, props: LoadBalancedWebService) {\n    super(scope, id);\n\n    const deployment = new kplus.Deployment(chart, 'Deployment', {\n      spec: {\n        replicas: props.replicas,\n        podSpecTemplate: {\n          containers: [ new kplus.Container({ image: props.image }) ]\n        }\n      },\n    });\n\n    deployment.expose({port: props.port, serviceType: kplus.ServiceType.LOAD_BALANCER})\n\n  }\n}\n```\n\n##### Manually importing k8s specs and CRD's\n\nIf you find yourself unable to use `cdk8s+`, or just like to directly use the `k8s` native objects or CRD's, you can do so by manually importing them using the `cdk8s-cli`.\n\nSee [Importing kubernetes objects](https://github.com/awslabs/cdk8s/tree/master/packages/cdk8s-cli#import) for detailed instructions.\n\n## Patching Kubernetes Resources\n\nThe `KubernetesPatch` construct can be used to update existing kubernetes\nresources. The following example can be used to patch the `hello-kubernetes`\ndeployment from the example above with 5 replicas.\n\n```ts\nnew KubernetesPatch(this, 'hello-kub-deployment-label', {\n  cluster,\n  resourceName: \"deployment/hello-kubernetes\",\n  applyPatch: { spec: { replicas: 5 } },\n  restorePatch: { spec: { replicas: 3 } }\n})\n```\n\n## Querying Kubernetes Resources\n\nThe `KubernetesObjectValue` construct can be used to query for information about kubernetes objects,\nand use that as part of your CDK application.\n\nFor example, you can fetch the address of a [`LoadBalancer`](https://kubernetes.io/docs/concepts/services-networking/service/#loadbalancer) type service:\n\n```ts\n// query the load balancer address\nconst myServiceAddress = new KubernetesObjectValue(this, 'LoadBalancerAttribute', {\n  cluster: cluster,\n  objectType: 'service',\n  objectName: 'my-service',\n  jsonPath: '.status.loadBalancer.ingress[0].hostname', // https://kubernetes.io/docs/reference/kubectl/jsonpath/\n});\n\n// pass the address to a lambda function\nconst proxyFunction = new lambda.Function(this, 'ProxyFunction', {\n  ...\n  environment: {\n    myServiceAddress: myServiceAddress.value\n  },\n})\n```\n\nSpecifically, since the above use-case is quite common, there is an easier way to access that information:\n\n```ts\nconst loadBalancerAddress = cluster.getServiceLoadBalancerAddress('my-service');\n```\n\n## Using existing clusters\n\nThe Amazon EKS library allows defining Kubernetes resources such as [Kubernetes\nmanifests](#kubernetes-resources) and [Helm charts](#helm-charts) on clusters\nthat are not defined as part of your CDK app.\n\nFirst, you'll need to \"import\" a cluster to your CDK app. To do that, use the\n`eks.Cluster.fromClusterAttributes()` static method:\n\n```ts\nconst cluster = eks.Cluster.fromClusterAttributes(this, 'MyCluster', {\n  clusterName: 'my-cluster-name',\n  kubectlRoleArn: 'arn:aws:iam::1111111:role/iam-role-that-has-masters-access',\n});\n```\n\nThen, you can use `addManifest` or `addHelmChart` to define resources inside\nyour Kubernetes cluster. For example:\n\n```ts\ncluster.addManifest('Test', {\n  apiVersion: 'v1',\n  kind: 'ConfigMap',\n  metadata: {\n    name: 'myconfigmap',\n  },\n  data: {\n    Key: 'value',\n    Another: '123454',\n  },\n});\n```\n\nAt the minimum, when importing clusters for `kubectl` management, you will need\nto specify:\n\n* `clusterName` - the name of the cluster.\n* `kubectlRoleArn` - the ARN of an IAM role mapped to the `system:masters` RBAC\n  role. If the cluster you are importing was created using the AWS CDK, the\n  CloudFormation stack has an output that includes an IAM role that can be used.\n  Otherwise, you can create an IAM role and map it to `system:masters` manually.\n  The trust policy of this role should include the the\n  `arn:aws::iam::${accountId}:root` principal in order to allow the execution\n  role of the kubectl resource to assume it.\n\nIf the cluster is configured with private-only or private and restricted public\nKubernetes [endpoint access](#endpoint-access), you must also specify:\n\n* `kubectlSecurityGroupId` - the ID of an EC2 security group that is allowed\n  connections to the cluster's control security group. For example, the EKS managed [cluster security group](#cluster-security-group).\n* `kubectlPrivateSubnetIds` - a list of private VPC subnets IDs that will be used\n  to access the Kubernetes endpoint.\n\n## Known Issues and Limitations\n\n* [One cluster per stack](https://github.com/aws/aws-cdk/issues/10073)\n* [Service Account dependencies](https://github.com/aws/aws-cdk/issues/9910)\n* [Support isolated VPCs](https://github.com/aws/aws-cdk/issues/12171)\n",
  },
  repository: {
    directory: "packages/@aws-cdk/aws-eks",
    type: "git",
    url: "https://github.com/aws/aws-cdk.git",
  },
  schema: "jsii/0.10.0",
  targets: {
    dotnet: {
      iconUrl:
        "https://raw.githubusercontent.com/aws/aws-cdk/master/logo/default-256-dark.png",
      namespace: "Amazon.CDK.AWS.EKS",
      packageId: "Amazon.CDK.AWS.EKS",
    },
    java: {
      maven: {
        artifactId: "eks",
        groupId: "software.amazon.awscdk",
      },
      package: "software.amazon.awscdk.services.eks",
    },
    js: {
      npm: "@aws-cdk/aws-eks",
    },
    python: {
      classifiers: ["Framework :: AWS CDK", "Framework :: AWS CDK :: 1"],
      distName: "aws-cdk.aws-eks",
      module: "aws_cdk.aws_eks",
    },
  },
  types: {
    "@aws-cdk/aws-eks.AutoScalingGroupCapacityOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Options for adding worker nodes.",
      },
      fqn: "@aws-cdk/aws-eks.AutoScalingGroupCapacityOptions",
      interfaces: ["@aws-cdk/aws-autoscaling.CommonAutoScalingGroupProps"],
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1556,
      },
      name: "AutoScalingGroupCapacityOptions",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "Instance type of the instances to start.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1560,
          },
          name: "instanceType",
          type: {
            fqn: "@aws-cdk/aws-ec2.InstanceType",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            remarks:
              "If you wish to provide a custom user data script, set this to `false` and\nmanually invoke `autoscalingGroup.addUserData()`.",
            stability: "stable",
            summary:
              "Configures the EC2 user-data script for instances in this autoscaling group to bootstrap the node (invoke `/etc/eks/bootstrap.sh`) and associate it with the EKS cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1582,
          },
          name: "bootstrapEnabled",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- none",
            stability: "stable",
            summary: "EKS node bootstrapping options.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1589,
          },
          name: "bootstrapOptions",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.BootstrapOptions",
          },
        },
        {
          abstract: true,
          docs: {
            default: "MachineImageType.AMAZON_LINUX_2",
            stability: "stable",
            summary: "Machine image type.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1596,
          },
          name: "machineImageType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.MachineImageType",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- true if the cluster has kubectl enabled (which is the default).",
            remarks:
              "This cannot be explicitly set to `true` if the cluster has kubectl disabled.",
            stability: "stable",
            summary:
              "Will automatically update the aws-auth ConfigMap to map the IAM instance role to RBAC.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1570,
          },
          name: "mapRole",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            remarks: "Only relevant if `spotPrice` is used.",
            stability: "stable",
            summary:
              "Installs the AWS spot instance interrupt handler on the cluster if it's not already added.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1604,
          },
          name: "spotInterruptHandler",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.AutoScalingGroupOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Options for adding an AutoScalingGroup as capacity.",
      },
      fqn: "@aws-cdk/aws-eks.AutoScalingGroupOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1671,
      },
      name: "AutoScalingGroupOptions",
      properties: [
        {
          abstract: true,
          docs: {
            default: "true",
            remarks:
              "If you wish to provide a custom user data script, set this to `false` and\nmanually invoke `autoscalingGroup.addUserData()`.",
            stability: "stable",
            summary:
              "Configures the EC2 user-data script for instances in this autoscaling group to bootstrap the node (invoke `/etc/eks/bootstrap.sh`) and associate it with the EKS cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1692,
          },
          name: "bootstrapEnabled",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- default options",
            stability: "stable",
            summary:
              "Allows options for node bootstrapping through EC2 user data.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1698,
          },
          name: "bootstrapOptions",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.BootstrapOptions",
          },
        },
        {
          abstract: true,
          docs: {
            default: "MachineImageType.AMAZON_LINUX_2",
            stability: "stable",
            summary: "Allow options to specify different machine image type.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1705,
          },
          name: "machineImageType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.MachineImageType",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- true if the cluster has kubectl enabled (which is the default).",
            remarks:
              "This cannot be explicitly set to `true` if the cluster has kubectl disabled.",
            stability: "stable",
            summary:
              "Will automatically update the aws-auth ConfigMap to map the IAM instance role to RBAC.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1680,
          },
          name: "mapRole",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            remarks:
              "Only relevant if `spotPrice` is configured on the auto-scaling group.",
            stability: "stable",
            summary:
              "Installs the AWS spot instance interrupt handler on the cluster if it's not already added.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1713,
          },
          name: "spotInterruptHandler",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.AwsAuth": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Construct",
      docs: {
        see: "https://docs.aws.amazon.com/en_us/eks/latest/userguide/add-user-role.html",
        stability: "stable",
        summary:
          "Manages mapping between IAM users and roles to Kubernetes RBAC configuration.",
      },
      fqn: "@aws-cdk/aws-eks.AwsAuth",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/aws-auth.ts",
          line: 35,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.AwsAuthProps",
            },
          },
        ],
      },
      kind: "class",
      locationInModule: {
        filename: "lib/aws-auth.ts",
        line: 29,
      },
      methods: [
        {
          docs: {
            stability: "stable",
            summary: "Additional AWS account to add to the aws-auth configmap.",
          },
          locationInModule: {
            filename: "lib/aws-auth.ts",
            line: 101,
          },
          name: "addAccount",
          parameters: [
            {
              docs: {
                summary: "account number.",
              },
              name: "accountId",
              type: {
                primitive: "string",
              },
            },
          ],
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Adds the specified IAM role to the `system:masters` RBAC group, which means that anyone that can assume it will be able to administer this Kubernetes system.",
          },
          locationInModule: {
            filename: "lib/aws-auth.ts",
            line: 68,
          },
          name: "addMastersRole",
          parameters: [
            {
              docs: {
                summary: "The IAM role to add.",
              },
              name: "role",
              type: {
                fqn: "@aws-cdk/aws-iam.IRole",
              },
            },
            {
              docs: {
                summary: "Optional user (defaults to the role ARN).",
              },
              name: "username",
              optional: true,
              type: {
                primitive: "string",
              },
            },
          ],
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Adds a mapping between an IAM role to a Kubernetes user and groups.",
          },
          locationInModule: {
            filename: "lib/aws-auth.ts",
            line: 81,
          },
          name: "addRoleMapping",
          parameters: [
            {
              docs: {
                summary: "The IAM role to map.",
              },
              name: "role",
              type: {
                fqn: "@aws-cdk/aws-iam.IRole",
              },
            },
            {
              docs: {
                summary: "Mapping to k8s user name and groups.",
              },
              name: "mapping",
              type: {
                fqn: "@aws-cdk/aws-eks.AwsAuthMapping",
              },
            },
          ],
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Adds a mapping between an IAM user to a Kubernetes user and groups.",
          },
          locationInModule: {
            filename: "lib/aws-auth.ts",
            line: 92,
          },
          name: "addUserMapping",
          parameters: [
            {
              docs: {
                summary: "The IAM user to map.",
              },
              name: "user",
              type: {
                fqn: "@aws-cdk/aws-iam.IUser",
              },
            },
            {
              docs: {
                summary: "Mapping to k8s user name and groups.",
              },
              name: "mapping",
              type: {
                fqn: "@aws-cdk/aws-eks.AwsAuthMapping",
              },
            },
          ],
        },
      ],
      name: "AwsAuth",
    },
    "@aws-cdk/aws-eks.AwsAuthMapping": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "AwsAuth mapping.",
      },
      fqn: "@aws-cdk/aws-eks.AwsAuthMapping",
      kind: "interface",
      locationInModule: {
        filename: "lib/aws-auth-mapping.ts",
        line: 4,
      },
      name: "AwsAuthMapping",
      properties: [
        {
          abstract: true,
          docs: {
            see: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings",
            stability: "stable",
            summary:
              "A list of groups within Kubernetes to which the role is mapped.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/aws-auth-mapping.ts",
            line: 17,
          },
          name: "groups",
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default: "- By default, the user name is the ARN of the IAM role.",
            stability: "stable",
            summary: "The user name within Kubernetes to map to the IAM role.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/aws-auth-mapping.ts",
            line: 10,
          },
          name: "username",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.AwsAuthProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Configuration props for the AwsAuth construct.",
      },
      fqn: "@aws-cdk/aws-eks.AwsAuthProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/aws-auth.ts",
        line: 15,
      },
      name: "AwsAuthProps",
      properties: [
        {
          abstract: true,
          docs: {
            remarks: "[disable-awslint:ref-via-interface]",
            stability: "stable",
            summary: "The EKS cluster to apply this configuration to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/aws-auth.ts",
            line: 21,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.Cluster",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.BootstrapOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "EKS node bootstrapping options.",
      },
      fqn: "@aws-cdk/aws-eks.BootstrapOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1610,
      },
      name: "BootstrapOptions",
      properties: [
        {
          abstract: true,
          docs: {
            default: "- none",
            see: "https://github.com/awslabs/amazon-eks-ami/blob/master/files/bootstrap.sh",
            stability: "stable",
            summary:
              "Additional command line arguments to pass to the `/etc/eks/bootstrap.sh` command.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1665,
          },
          name: "additionalArgs",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "3",
            stability: "stable",
            summary:
              "Number of retry attempts for AWS API call (DescribeCluster).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1630,
          },
          name: "awsApiRetryAttempts",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- 10.100.0.10 or 172.20.0.10 based on the IP\naddress of the primary interface.",
            stability: "stable",
            summary:
              "Overrides the IP address to use for DNS queries within the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1648,
          },
          name: "dnsClusterIp",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- none",
            stability: "stable",
            summary:
              "The contents of the `/etc/docker/daemon.json` file. Useful if you want a custom config differing from the default one in the EKS AMI.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1638,
          },
          name: "dockerConfigJson",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "false",
            stability: "stable",
            summary: "Restores the docker default bridge network.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1623,
          },
          name: "enableDockerBridge",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- none",
            example: "--node-labels foo=bar,goo=far",
            remarks: "Useful for adding labels or taints.",
            stability: "stable",
            summary: "Extra arguments to add to the kubelet.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1656,
          },
          name: "kubeletExtraArgs",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            stability: "stable",
            summary:
              "Sets `--max-pods` for the kubelet based on the capacity of the EC2 instance.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1616,
          },
          name: "useMaxPods",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CapacityType": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "Capacity type of the managed node group.",
      },
      fqn: "@aws-cdk/aws-eks.CapacityType",
      kind: "enum",
      locationInModule: {
        filename: "lib/managed-nodegroup.ts",
        line: 43,
      },
      members: [
        {
          docs: {
            stability: "stable",
            summary: "spot instances.",
          },
          name: "SPOT",
        },
        {
          docs: {
            stability: "stable",
            summary: "on-demand instances.",
          },
          name: "ON_DEMAND",
        },
      ],
      name: "CapacityType",
    },
    "@aws-cdk/aws-eks.CfnAddon": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.CfnResource",
      docs: {
        custom: {
          cloudformationResource: "AWS::EKS::Addon",
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html",
        },
        stability: "external",
        summary: "A CloudFormation `AWS::EKS::Addon`.",
      },
      fqn: "@aws-cdk/aws-eks.CfnAddon",
      initializer: {
        docs: {
          stability: "external",
          summary: "Create a new `AWS::EKS::Addon`.",
        },
        locationInModule: {
          filename: "lib/eks.generated.ts",
          line: 195,
        },
        parameters: [
          {
            docs: {
              summary: "- scope in which this resource is defined.",
            },
            name: "scope",
            type: {
              fqn: "@aws-cdk/core.Construct",
            },
          },
          {
            docs: {
              summary: "- scoped id of the resource.",
            },
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            docs: {
              summary: "- resource properties.",
            },
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.CfnAddonProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/core.IInspectable"],
      kind: "class",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 122,
      },
      methods: [
        {
          docs: {
            stability: "external",
            summary:
              "Examines the CloudFormation resource and discloses attributes.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 215,
          },
          name: "inspect",
          overrides: "@aws-cdk/core.IInspectable",
          parameters: [
            {
              docs: {
                summary: "- tree inspector to collect and process attributes.",
              },
              name: "inspector",
              type: {
                fqn: "@aws-cdk/core.TreeInspector",
              },
            },
          ],
        },
        {
          docs: {
            stability: "external",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 231,
          },
          name: "renderProperties",
          overrides: "@aws-cdk/core.CfnResource",
          parameters: [
            {
              name: "props",
              type: {
                collection: {
                  elementtype: {
                    primitive: "any",
                  },
                  kind: "map",
                },
              },
            },
          ],
          protected: true,
          returns: {
            type: {
              collection: {
                elementtype: {
                  primitive: "any",
                },
                kind: "map",
              },
            },
          },
        },
      ],
      name: "CfnAddon",
      properties: [
        {
          const: true,
          docs: {
            stability: "external",
            summary:
              "The CloudFormation resource type name for this resource class.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 126,
          },
          name: "CFN_RESOURCE_TYPE_NAME",
          static: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "Arn",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 150,
          },
          name: "attrArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 220,
          },
          name: "cfnProperties",
          overrides: "@aws-cdk/core.CfnResource",
          protected: true,
          type: {
            collection: {
              elementtype: {
                primitive: "any",
              },
              kind: "map",
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.Tags`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 186,
          },
          name: "tags",
          type: {
            fqn: "@aws-cdk/core.TagManager",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.AddonName`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 156,
          },
          name: "addonName",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.ClusterName`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 162,
          },
          name: "clusterName",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.AddonVersion`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 168,
          },
          name: "addonVersion",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.ResolveConflicts`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 174,
          },
          name: "resolveConflicts",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.ServiceAccountRoleArn`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 180,
          },
          name: "serviceAccountRoleArn",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnAddonProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html",
        },
        stability: "external",
        summary: "Properties for defining a `AWS::EKS::Addon`.",
      },
      fqn: "@aws-cdk/aws-eks.CfnAddonProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 17,
      },
      name: "CfnAddonProps",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonname",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.AddonName`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 23,
          },
          name: "addonName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-clustername",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.ClusterName`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 29,
          },
          name: "clusterName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-addonversion",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.AddonVersion`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 35,
          },
          name: "addonVersion",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-resolveconflicts",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.ResolveConflicts`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 41,
          },
          name: "resolveConflicts",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-serviceaccountrolearn",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.ServiceAccountRoleArn`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 47,
          },
          name: "serviceAccountRoleArn",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-addon.html#cfn-eks-addon-tags",
            },
            stability: "external",
            summary: "`AWS::EKS::Addon.Tags`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 53,
          },
          name: "tags",
          optional: true,
          type: {
            collection: {
              elementtype: {
                fqn: "@aws-cdk/core.CfnTag",
              },
              kind: "array",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnCluster": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.CfnResource",
      docs: {
        custom: {
          cloudformationResource: "AWS::EKS::Cluster",
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html",
        },
        stability: "external",
        summary: "A CloudFormation `AWS::EKS::Cluster`.",
      },
      fqn: "@aws-cdk/aws-eks.CfnCluster",
      initializer: {
        docs: {
          stability: "external",
          summary: "Create a new `AWS::EKS::Cluster`.",
        },
        locationInModule: {
          filename: "lib/eks.generated.ts",
          line: 440,
        },
        parameters: [
          {
            docs: {
              summary: "- scope in which this resource is defined.",
            },
            name: "scope",
            type: {
              fqn: "@aws-cdk/core.Construct",
            },
          },
          {
            docs: {
              summary: "- scoped id of the resource.",
            },
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            docs: {
              summary: "- resource properties.",
            },
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.CfnClusterProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/core.IInspectable"],
      kind: "class",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 347,
      },
      methods: [
        {
          docs: {
            stability: "external",
            summary:
              "Examines the CloudFormation resource and discloses attributes.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 464,
          },
          name: "inspect",
          overrides: "@aws-cdk/core.IInspectable",
          parameters: [
            {
              docs: {
                summary: "- tree inspector to collect and process attributes.",
              },
              name: "inspector",
              type: {
                fqn: "@aws-cdk/core.TreeInspector",
              },
            },
          ],
        },
        {
          docs: {
            stability: "external",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 480,
          },
          name: "renderProperties",
          overrides: "@aws-cdk/core.CfnResource",
          parameters: [
            {
              name: "props",
              type: {
                collection: {
                  elementtype: {
                    primitive: "any",
                  },
                  kind: "map",
                },
              },
            },
          ],
          protected: true,
          returns: {
            type: {
              collection: {
                elementtype: {
                  primitive: "any",
                },
                kind: "map",
              },
            },
          },
        },
      ],
      name: "CfnCluster",
      properties: [
        {
          const: true,
          docs: {
            stability: "external",
            summary:
              "The CloudFormation resource type name for this resource class.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 351,
          },
          name: "CFN_RESOURCE_TYPE_NAME",
          static: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "Arn",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 375,
          },
          name: "attrArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "CertificateAuthorityData",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 380,
          },
          name: "attrCertificateAuthorityData",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "ClusterSecurityGroupId",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 385,
          },
          name: "attrClusterSecurityGroupId",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "EncryptionConfigKeyArn",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 390,
          },
          name: "attrEncryptionConfigKeyArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "Endpoint",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 395,
          },
          name: "attrEndpoint",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 469,
          },
          name: "cfnProperties",
          overrides: "@aws-cdk/core.CfnResource",
          protected: true,
          type: {
            collection: {
              elementtype: {
                primitive: "any",
              },
              kind: "map",
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.ResourcesVpcConfig`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 401,
          },
          name: "resourcesVpcConfig",
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/aws-eks.CfnCluster.ResourcesVpcConfigProperty",
                },
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
              ],
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.RoleArn`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 407,
          },
          name: "roleArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.EncryptionConfig`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 413,
          },
          name: "encryptionConfig",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  collection: {
                    elementtype: {
                      union: {
                        types: [
                          {
                            fqn: "@aws-cdk/core.IResolvable",
                          },
                          {
                            fqn: "@aws-cdk/aws-eks.CfnCluster.EncryptionConfigProperty",
                          },
                        ],
                      },
                    },
                    kind: "array",
                  },
                },
              ],
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.KubernetesNetworkConfig`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 419,
          },
          name: "kubernetesNetworkConfig",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnCluster.KubernetesNetworkConfigProperty",
                },
              ],
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.Name`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 425,
          },
          name: "name",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.Version`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 431,
          },
          name: "version",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnCluster.EncryptionConfigProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnCluster.EncryptionConfigProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 490,
      },
      name: "EncryptionConfigProperty",
      namespace: "CfnCluster",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-provider",
            },
            stability: "external",
            summary: "`CfnCluster.EncryptionConfigProperty.Provider`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 495,
          },
          name: "provider",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnCluster.ProviderProperty",
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-encryptionconfig.html#cfn-eks-cluster-encryptionconfig-resources",
            },
            stability: "external",
            summary: "`CfnCluster.EncryptionConfigProperty.Resources`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 500,
          },
          name: "resources",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnCluster.KubernetesNetworkConfigProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnCluster.KubernetesNetworkConfigProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 557,
      },
      name: "KubernetesNetworkConfigProperty",
      namespace: "CfnCluster",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-kubernetesnetworkconfig.html#cfn-eks-cluster-kubernetesnetworkconfig-serviceipv4cidr",
            },
            stability: "external",
            summary:
              "`CfnCluster.KubernetesNetworkConfigProperty.ServiceIpv4Cidr`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 562,
          },
          name: "serviceIpv4Cidr",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnCluster.ProviderProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnCluster.ProviderProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 616,
      },
      name: "ProviderProperty",
      namespace: "CfnCluster",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-provider.html#cfn-eks-cluster-provider-keyarn",
            },
            stability: "external",
            summary: "`CfnCluster.ProviderProperty.KeyArn`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 621,
          },
          name: "keyArn",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnCluster.ResourcesVpcConfigProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnCluster.ResourcesVpcConfigProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 675,
      },
      name: "ResourcesVpcConfigProperty",
      namespace: "CfnCluster",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-subnetids",
            },
            stability: "external",
            summary: "`CfnCluster.ResourcesVpcConfigProperty.SubnetIds`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 685,
          },
          name: "subnetIds",
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-cluster-resourcesvpcconfig.html#cfn-eks-cluster-resourcesvpcconfig-securitygroupids",
            },
            stability: "external",
            summary:
              "`CfnCluster.ResourcesVpcConfigProperty.SecurityGroupIds`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 680,
          },
          name: "securityGroupIds",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnClusterProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html",
        },
        stability: "external",
        summary: "Properties for defining a `AWS::EKS::Cluster`.",
      },
      fqn: "@aws-cdk/aws-eks.CfnClusterProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 242,
      },
      name: "CfnClusterProps",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-resourcesvpcconfig",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.ResourcesVpcConfig`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 248,
          },
          name: "resourcesVpcConfig",
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/aws-eks.CfnCluster.ResourcesVpcConfigProperty",
                },
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-rolearn",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.RoleArn`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 254,
          },
          name: "roleArn",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-encryptionconfig",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.EncryptionConfig`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 260,
          },
          name: "encryptionConfig",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  collection: {
                    elementtype: {
                      union: {
                        types: [
                          {
                            fqn: "@aws-cdk/core.IResolvable",
                          },
                          {
                            fqn: "@aws-cdk/aws-eks.CfnCluster.EncryptionConfigProperty",
                          },
                        ],
                      },
                    },
                    kind: "array",
                  },
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-kubernetesnetworkconfig",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.KubernetesNetworkConfig`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 266,
          },
          name: "kubernetesNetworkConfig",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnCluster.KubernetesNetworkConfigProperty",
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-name",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.Name`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 272,
          },
          name: "name",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-cluster.html#cfn-eks-cluster-version",
            },
            stability: "external",
            summary: "`AWS::EKS::Cluster.Version`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 278,
          },
          name: "version",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnFargateProfile": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.CfnResource",
      docs: {
        custom: {
          cloudformationResource: "AWS::EKS::FargateProfile",
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html",
        },
        stability: "external",
        summary: "A CloudFormation `AWS::EKS::FargateProfile`.",
      },
      fqn: "@aws-cdk/aws-eks.CfnFargateProfile",
      initializer: {
        docs: {
          stability: "external",
          summary: "Create a new `AWS::EKS::FargateProfile`.",
        },
        locationInModule: {
          filename: "lib/eks.generated.ts",
          line: 923,
        },
        parameters: [
          {
            docs: {
              summary: "- scope in which this resource is defined.",
            },
            name: "scope",
            type: {
              fqn: "@aws-cdk/core.Construct",
            },
          },
          {
            docs: {
              summary: "- scoped id of the resource.",
            },
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            docs: {
              summary: "- resource properties.",
            },
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.CfnFargateProfileProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/core.IInspectable"],
      kind: "class",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 850,
      },
      methods: [
        {
          docs: {
            stability: "external",
            summary:
              "Examines the CloudFormation resource and discloses attributes.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 944,
          },
          name: "inspect",
          overrides: "@aws-cdk/core.IInspectable",
          parameters: [
            {
              docs: {
                summary: "- tree inspector to collect and process attributes.",
              },
              name: "inspector",
              type: {
                fqn: "@aws-cdk/core.TreeInspector",
              },
            },
          ],
        },
        {
          docs: {
            stability: "external",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 960,
          },
          name: "renderProperties",
          overrides: "@aws-cdk/core.CfnResource",
          parameters: [
            {
              name: "props",
              type: {
                collection: {
                  elementtype: {
                    primitive: "any",
                  },
                  kind: "map",
                },
              },
            },
          ],
          protected: true,
          returns: {
            type: {
              collection: {
                elementtype: {
                  primitive: "any",
                },
                kind: "map",
              },
            },
          },
        },
      ],
      name: "CfnFargateProfile",
      properties: [
        {
          const: true,
          docs: {
            stability: "external",
            summary:
              "The CloudFormation resource type name for this resource class.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 854,
          },
          name: "CFN_RESOURCE_TYPE_NAME",
          static: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "Arn",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 878,
          },
          name: "attrArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 949,
          },
          name: "cfnProperties",
          overrides: "@aws-cdk/core.CfnResource",
          protected: true,
          type: {
            collection: {
              elementtype: {
                primitive: "any",
              },
              kind: "map",
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.Tags`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 914,
          },
          name: "tags",
          type: {
            fqn: "@aws-cdk/core.TagManager",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.ClusterName`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 884,
          },
          name: "clusterName",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.PodExecutionRoleArn`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 890,
          },
          name: "podExecutionRoleArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.Selectors`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 896,
          },
          name: "selectors",
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  collection: {
                    elementtype: {
                      union: {
                        types: [
                          {
                            fqn: "@aws-cdk/core.IResolvable",
                          },
                          {
                            fqn: "@aws-cdk/aws-eks.CfnFargateProfile.SelectorProperty",
                          },
                        ],
                      },
                    },
                    kind: "array",
                  },
                },
              ],
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.FargateProfileName`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 902,
          },
          name: "fargateProfileName",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.Subnets`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 908,
          },
          name: "subnets",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnFargateProfile.LabelProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnFargateProfile.LabelProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 970,
      },
      name: "LabelProperty",
      namespace: "CfnFargateProfile",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-key",
            },
            stability: "external",
            summary: "`CfnFargateProfile.LabelProperty.Key`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 975,
          },
          name: "key",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-label.html#cfn-eks-fargateprofile-label-value",
            },
            stability: "external",
            summary: "`CfnFargateProfile.LabelProperty.Value`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 980,
          },
          name: "value",
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnFargateProfile.SelectorProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnFargateProfile.SelectorProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 1039,
      },
      name: "SelectorProperty",
      namespace: "CfnFargateProfile",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-namespace",
            },
            stability: "external",
            summary: "`CfnFargateProfile.SelectorProperty.Namespace`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1049,
          },
          name: "namespace",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-fargateprofile-selector.html#cfn-eks-fargateprofile-selector-labels",
            },
            stability: "external",
            summary: "`CfnFargateProfile.SelectorProperty.Labels`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1044,
          },
          name: "labels",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  collection: {
                    elementtype: {
                      union: {
                        types: [
                          {
                            fqn: "@aws-cdk/core.IResolvable",
                          },
                          {
                            fqn: "@aws-cdk/aws-eks.CfnFargateProfile.LabelProperty",
                          },
                        ],
                      },
                    },
                    kind: "array",
                  },
                },
              ],
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnFargateProfileProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html",
        },
        stability: "external",
        summary: "Properties for defining a `AWS::EKS::FargateProfile`.",
      },
      fqn: "@aws-cdk/aws-eks.CfnFargateProfileProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 744,
      },
      name: "CfnFargateProfileProps",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-clustername",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.ClusterName`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 750,
          },
          name: "clusterName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-podexecutionrolearn",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.PodExecutionRoleArn`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 756,
          },
          name: "podExecutionRoleArn",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-selectors",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.Selectors`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 762,
          },
          name: "selectors",
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  collection: {
                    elementtype: {
                      union: {
                        types: [
                          {
                            fqn: "@aws-cdk/core.IResolvable",
                          },
                          {
                            fqn: "@aws-cdk/aws-eks.CfnFargateProfile.SelectorProperty",
                          },
                        ],
                      },
                    },
                    kind: "array",
                  },
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-fargateprofilename",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.FargateProfileName`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 768,
          },
          name: "fargateProfileName",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-subnets",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.Subnets`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 774,
          },
          name: "subnets",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-fargateprofile.html#cfn-eks-fargateprofile-tags",
            },
            stability: "external",
            summary: "`AWS::EKS::FargateProfile.Tags`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 780,
          },
          name: "tags",
          optional: true,
          type: {
            collection: {
              elementtype: {
                fqn: "@aws-cdk/core.CfnTag",
              },
              kind: "array",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnNodegroup": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.CfnResource",
      docs: {
        custom: {
          cloudformationResource: "AWS::EKS::Nodegroup",
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html",
        },
        stability: "external",
        summary: "A CloudFormation `AWS::EKS::Nodegroup`.",
      },
      fqn: "@aws-cdk/aws-eks.CfnNodegroup",
      initializer: {
        docs: {
          stability: "external",
          summary: "Create a new `AWS::EKS::Nodegroup`.",
        },
        locationInModule: {
          filename: "lib/eks.generated.ts",
          line: 1447,
        },
        parameters: [
          {
            docs: {
              summary: "- scope in which this resource is defined.",
            },
            name: "scope",
            type: {
              fqn: "@aws-cdk/core.Construct",
            },
          },
          {
            docs: {
              summary: "- scoped id of the resource.",
            },
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            docs: {
              summary: "- resource properties.",
            },
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.CfnNodegroupProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/core.IInspectable"],
      kind: "class",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 1304,
      },
      methods: [
        {
          docs: {
            stability: "external",
            summary:
              "Examines the CloudFormation resource and discloses attributes.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1480,
          },
          name: "inspect",
          overrides: "@aws-cdk/core.IInspectable",
          parameters: [
            {
              docs: {
                summary: "- tree inspector to collect and process attributes.",
              },
              name: "inspector",
              type: {
                fqn: "@aws-cdk/core.TreeInspector",
              },
            },
          ],
        },
        {
          docs: {
            stability: "external",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1506,
          },
          name: "renderProperties",
          overrides: "@aws-cdk/core.CfnResource",
          parameters: [
            {
              name: "props",
              type: {
                collection: {
                  elementtype: {
                    primitive: "any",
                  },
                  kind: "map",
                },
              },
            },
          ],
          protected: true,
          returns: {
            type: {
              collection: {
                elementtype: {
                  primitive: "any",
                },
                kind: "map",
              },
            },
          },
        },
      ],
      name: "CfnNodegroup",
      properties: [
        {
          const: true,
          docs: {
            stability: "external",
            summary:
              "The CloudFormation resource type name for this resource class.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1308,
          },
          name: "CFN_RESOURCE_TYPE_NAME",
          static: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "Arn",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1332,
          },
          name: "attrArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "ClusterName",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1337,
          },
          name: "attrClusterName",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              cloudformationAttribute: "NodegroupName",
            },
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1342,
          },
          name: "attrNodegroupName",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "external",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1485,
          },
          name: "cfnProperties",
          overrides: "@aws-cdk/core.CfnResource",
          protected: true,
          type: {
            collection: {
              elementtype: {
                primitive: "any",
              },
              kind: "map",
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.Tags`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1432,
          },
          name: "tags",
          type: {
            fqn: "@aws-cdk/core.TagManager",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.ClusterName`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1348,
          },
          name: "clusterName",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.Labels`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1396,
          },
          name: "labels",
          type: {
            primitive: "any",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.NodeRole`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1354,
          },
          name: "nodeRole",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.Subnets`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1360,
          },
          name: "subnets",
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.AmiType`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1366,
          },
          name: "amiType",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.CapacityType`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1372,
          },
          name: "capacityType",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.DiskSize`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1378,
          },
          name: "diskSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.ForceUpdateEnabled`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1384,
          },
          name: "forceUpdateEnabled",
          optional: true,
          type: {
            union: {
              types: [
                {
                  primitive: "boolean",
                },
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
              ],
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.InstanceTypes`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1390,
          },
          name: "instanceTypes",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.LaunchTemplate`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1402,
          },
          name: "launchTemplate",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnNodegroup.LaunchTemplateSpecificationProperty",
                },
              ],
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.NodegroupName`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1408,
          },
          name: "nodegroupName",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.ReleaseVersion`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1414,
          },
          name: "releaseVersion",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.RemoteAccess`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1420,
          },
          name: "remoteAccess",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnNodegroup.RemoteAccessProperty",
                },
              ],
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.ScalingConfig`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1426,
          },
          name: "scalingConfig",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnNodegroup.ScalingConfigProperty",
                },
              ],
            },
          },
        },
        {
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.Version`.",
          },
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1438,
          },
          name: "version",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnNodegroup.LaunchTemplateSpecificationProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnNodegroup.LaunchTemplateSpecificationProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 1516,
      },
      name: "LaunchTemplateSpecificationProperty",
      namespace: "CfnNodegroup",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-id",
            },
            stability: "external",
            summary: "`CfnNodegroup.LaunchTemplateSpecificationProperty.Id`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1521,
          },
          name: "id",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-name",
            },
            stability: "external",
            summary: "`CfnNodegroup.LaunchTemplateSpecificationProperty.Name`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1526,
          },
          name: "name",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-launchtemplatespecification.html#cfn-eks-nodegroup-launchtemplatespecification-version",
            },
            stability: "external",
            summary:
              "`CfnNodegroup.LaunchTemplateSpecificationProperty.Version`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1531,
          },
          name: "version",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnNodegroup.RemoteAccessProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnNodegroup.RemoteAccessProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 1591,
      },
      name: "RemoteAccessProperty",
      namespace: "CfnNodegroup",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-ec2sshkey",
            },
            stability: "external",
            summary: "`CfnNodegroup.RemoteAccessProperty.Ec2SshKey`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1596,
          },
          name: "ec2SshKey",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html#cfn-eks-nodegroup-remoteaccess-sourcesecuritygroups",
            },
            stability: "external",
            summary:
              "`CfnNodegroup.RemoteAccessProperty.SourceSecurityGroups`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1601,
          },
          name: "sourceSecurityGroups",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnNodegroup.ScalingConfigProperty": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html",
        },
        stability: "external",
      },
      fqn: "@aws-cdk/aws-eks.CfnNodegroup.ScalingConfigProperty",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 1659,
      },
      name: "ScalingConfigProperty",
      namespace: "CfnNodegroup",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-desiredsize",
            },
            stability: "external",
            summary: "`CfnNodegroup.ScalingConfigProperty.DesiredSize`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1664,
          },
          name: "desiredSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-maxsize",
            },
            stability: "external",
            summary: "`CfnNodegroup.ScalingConfigProperty.MaxSize`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1669,
          },
          name: "maxSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-scalingconfig.html#cfn-eks-nodegroup-scalingconfig-minsize",
            },
            stability: "external",
            summary: "`CfnNodegroup.ScalingConfigProperty.MinSize`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1674,
          },
          name: "minSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CfnNodegroupProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        custom: {
          link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html",
        },
        stability: "external",
        summary: "Properties for defining a `AWS::EKS::Nodegroup`.",
      },
      fqn: "@aws-cdk/aws-eks.CfnNodegroupProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/eks.generated.ts",
        line: 1108,
      },
      name: "CfnNodegroupProps",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-clustername",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.ClusterName`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1114,
          },
          name: "clusterName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-noderole",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.NodeRole`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1120,
          },
          name: "nodeRole",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-subnets",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.Subnets`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1126,
          },
          name: "subnets",
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-amitype",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.AmiType`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1132,
          },
          name: "amiType",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-capacitytype",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.CapacityType`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1138,
          },
          name: "capacityType",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-disksize",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.DiskSize`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1144,
          },
          name: "diskSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-forceupdateenabled",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.ForceUpdateEnabled`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1150,
          },
          name: "forceUpdateEnabled",
          optional: true,
          type: {
            union: {
              types: [
                {
                  primitive: "boolean",
                },
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.InstanceTypes`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1156,
          },
          name: "instanceTypes",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-labels",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.Labels`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1162,
          },
          name: "labels",
          optional: true,
          type: {
            primitive: "any",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-launchtemplate",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.LaunchTemplate`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1168,
          },
          name: "launchTemplate",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnNodegroup.LaunchTemplateSpecificationProperty",
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-nodegroupname",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.NodegroupName`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1174,
          },
          name: "nodegroupName",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-releaseversion",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.ReleaseVersion`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1180,
          },
          name: "releaseVersion",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-remoteaccess",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.RemoteAccess`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1186,
          },
          name: "remoteAccess",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnNodegroup.RemoteAccessProperty",
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-scalingconfig",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.ScalingConfig`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1192,
          },
          name: "scalingConfig",
          optional: true,
          type: {
            union: {
              types: [
                {
                  fqn: "@aws-cdk/core.IResolvable",
                },
                {
                  fqn: "@aws-cdk/aws-eks.CfnNodegroup.ScalingConfigProperty",
                },
              ],
            },
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-tags",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.Tags`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1198,
          },
          name: "tags",
          optional: true,
          type: {
            primitive: "any",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              link: "http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-version",
            },
            stability: "external",
            summary: "`AWS::EKS::Nodegroup.Version`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/eks.generated.ts",
            line: 1204,
          },
          name: "version",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.Cluster": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Resource",
      docs: {
        remarks:
          "This is a fully managed cluster of API Servers (control-plane)\nThe user is still required to create the worker nodes.",
        stability: "stable",
        summary: "A Cluster represents a managed Kubernetes Service (EKS).",
      },
      fqn: "@aws-cdk/aws-eks.Cluster",
      initializer: {
        docs: {
          stability: "stable",
          summary: "Initiates an EKS Cluster with the supplied arguments.",
        },
        locationInModule: {
          filename: "lib/cluster.ts",
          line: 941,
        },
        parameters: [
          {
            docs: {
              summary: "a Construct, most likely a cdk.Stack created.",
            },
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            docs: {
              summary: "the id of the Construct to create.",
            },
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            docs: {
              summary: "properties in the IClusterProps interface.",
            },
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.ClusterProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/aws-eks.ICluster"],
      kind: "class",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 750,
      },
      methods: [
        {
          docs: {
            stability: "stable",
            summary: "Import an existing cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 758,
          },
          name: "fromClusterAttributes",
          parameters: [
            {
              docs: {
                summary: "the construct scope, in most cases 'this'.",
              },
              name: "scope",
              type: {
                fqn: "constructs.Construct",
              },
            },
            {
              docs: {
                summary: "the id or name to import as.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary:
                  "the cluster properties to use for importing information.",
              },
              name: "attrs",
              type: {
                fqn: "@aws-cdk/aws-eks.ClusterAttributes",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.ICluster",
            },
          },
          static: true,
        },
        {
          docs: {
            remarks:
              "The nodes will automatically be configured with the right VPC and AMI\nfor the instance type and Kubernetes version.\n\nNote that if you specify `updateType: RollingUpdate` or `updateType: ReplacingUpdate`, your nodes might be replaced at deploy\ntime without notice in case the recommended AMI for your machine image type has been updated by AWS.\nThe default behavior for `updateType` is `None`, which means only new instances will be launched using the new AMI.\n\nSpot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.\nIn addition, the [spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)\ndaemon will be installed on all spot instances to handle\n[EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).",
            stability: "stable",
            summary: "Add nodes to this EKS cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1169,
          },
          name: "addAutoScalingGroupCapacity",
          parameters: [
            {
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              name: "options",
              type: {
                fqn: "@aws-cdk/aws-eks.AutoScalingGroupCapacityOptions",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-autoscaling.AutoScalingGroup",
            },
          },
        },
        {
          docs: {
            returns: "a `KubernetesManifest` construct representing the chart.",
            stability: "stable",
            summary: "Defines a CDK8s chart in this cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 703,
          },
          name: "addCdk8sChart",
          overrides: "@aws-cdk/aws-eks.ICluster",
          parameters: [
            {
              docs: {
                summary: "logical id of this chart.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "the cdk8s chart.",
              },
              name: "chart",
              type: {
                fqn: "constructs.Construct",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.KubernetesManifest",
            },
          },
        },
        {
          docs: {
            see: "https://docs.aws.amazon.com/eks/latest/userguide/fargate-profile.html",
            stability: "stable",
            summary: "Adds a Fargate profile to this cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1367,
          },
          name: "addFargateProfile",
          parameters: [
            {
              docs: {
                summary: "the id of this profile.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "profile options.",
              },
              name: "options",
              type: {
                fqn: "@aws-cdk/aws-eks.FargateProfileOptions",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.FargateProfile",
            },
          },
        },
        {
          docs: {
            returns: "a `HelmChart` construct",
            stability: "stable",
            summary: "Defines a Helm chart in this cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 692,
          },
          name: "addHelmChart",
          overrides: "@aws-cdk/aws-eks.ICluster",
          parameters: [
            {
              docs: {
                summary: "logical id of this chart.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "options of this chart.",
              },
              name: "options",
              type: {
                fqn: "@aws-cdk/aws-eks.HelmChartOptions",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.HelmChart",
            },
          },
        },
        {
          docs: {
            remarks:
              "The manifest will be applied/deleted using kubectl as needed.",
            returns: "a `KubernetesResource` object.",
            stability: "stable",
            summary: "Defines a Kubernetes resource in this cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 681,
          },
          name: "addManifest",
          overrides: "@aws-cdk/aws-eks.ICluster",
          parameters: [
            {
              docs: {
                summary: "logical id of this manifest.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "a list of Kubernetes resource specifications.",
              },
              name: "manifest",
              type: {
                collection: {
                  elementtype: {
                    primitive: "any",
                  },
                  kind: "map",
                },
              },
              variadic: true,
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.KubernetesManifest",
            },
          },
          variadic: true,
        },
        {
          docs: {
            remarks:
              "This method will create a new managed nodegroup and add into the capacity.",
            see: "https://docs.aws.amazon.com/eks/latest/userguide/managed-node-groups.html",
            stability: "stable",
            summary: "Add managed nodegroup to this Amazon EKS cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1213,
          },
          name: "addNodegroupCapacity",
          parameters: [
            {
              docs: {
                summary: "The ID of the nodegroup.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "options for creating a new nodegroup.",
              },
              name: "options",
              optional: true,
              type: {
                fqn: "@aws-cdk/aws-eks.NodegroupOptions",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.Nodegroup",
            },
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Creates a new service account with corresponding IAM Role (IRSA).",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 715,
          },
          name: "addServiceAccount",
          overrides: "@aws-cdk/aws-eks.ICluster",
          parameters: [
            {
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              name: "options",
              optional: true,
              type: {
                fqn: "@aws-cdk/aws-eks.ServiceAccountOptions",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.ServiceAccount",
            },
          },
        },
        {
          docs: {
            remarks:
              "The AutoScalingGroup must be running an EKS-optimized AMI containing the\n/etc/eks/bootstrap.sh script. This method will configure Security Groups,\nadd the right policies to the instance role, apply the right tags, and add\nthe required user data to the instance's launch configuration.\n\nSpot instances will be labeled `lifecycle=Ec2Spot` and tainted with `PreferNoSchedule`.\nIf kubectl is enabled, the\n[spot interrupt handler](https://github.com/awslabs/ec2-spot-labs/tree/master/ec2-spot-eks-solution/spot-termination-handler)\ndaemon will be installed on all spot instances to handle\n[EC2 Spot Instance Termination Notices](https://aws.amazon.com/blogs/aws/new-ec2-spot-instance-termination-notices/).\n\nPrefer to use `addAutoScalingGroupCapacity` if possible.",
            see: "https://docs.aws.amazon.com/eks/latest/userguide/launch-workers.html",
            stability: "stable",
            summary:
              "Connect capacity in the form of an existing AutoScalingGroup to the EKS cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1240,
          },
          name: "connectAutoScalingGroupCapacity",
          parameters: [
            {
              docs: {
                summary: "[disable-awslint:ref-via-interface].",
              },
              name: "autoScalingGroup",
              type: {
                fqn: "@aws-cdk/aws-autoscaling.AutoScalingGroup",
              },
            },
            {
              docs: {
                summary:
                  "options for adding auto scaling groups, like customizing the bootstrap script.",
              },
              name: "options",
              type: {
                fqn: "@aws-cdk/aws-eks.AutoScalingGroupOptions",
              },
            },
          ],
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Fetch the load balancer address of a service of type 'LoadBalancer'.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1139,
          },
          name: "getServiceLoadBalancerAddress",
          parameters: [
            {
              docs: {
                summary: "The name of the service.",
              },
              name: "serviceName",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "Additional operation options.",
              },
              name: "options",
              optional: true,
              type: {
                fqn: "@aws-cdk/aws-eks.ServiceLoadBalancerAddressOptions",
              },
            },
          ],
          returns: {
            type: {
              primitive: "string",
            },
          },
        },
      ],
      name: "Cluster",
      properties: [
        {
          docs: {
            remarks: "This role also has `systems:master` permissions.",
            stability: "stable",
            summary:
              "An IAM role with administrative permissions to create or update the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 867,
          },
          name: "adminRole",
          type: {
            fqn: "@aws-cdk/aws-iam.Role",
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Lazily creates the AwsAuth resource, which manages AWS authentication mapping.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1314,
          },
          name: "awsAuth",
          type: {
            fqn: "@aws-cdk/aws-eks.AwsAuth",
          },
        },
        {
          docs: {
            example: "arn:aws:eks:us-west-2:666666666666:cluster/prod",
            stability: "stable",
            summary: "The AWS generated ARN for the Cluster resource.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 777,
          },
          name: "clusterArn",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "The certificate-authority-data for your cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 791,
          },
          name: "clusterCertificateAuthorityData",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Amazon Resource Name (ARN) or alias of the customer master key (CMK).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 806,
          },
          name: "clusterEncryptionConfigKeyArn",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            example:
              "https://5E1D0CEXAMPLEA591B746AFC5AB30262.yl4.us-west-2.eks.amazonaws.com",
            remarks:
              "This is the URL inside the kubeconfig file to use with kubectl",
            stability: "stable",
            summary: "The endpoint URL for the Cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 786,
          },
          name: "clusterEndpoint",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "The Name of the created EKS Cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 770,
          },
          name: "clusterName",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              attribute: "true",
            },
            remarks:
              "This is because the values is only be retrieved by the API and not exposed\nby CloudFormation. If this cluster is not kubectl-enabled (i.e. uses the\nstock `CfnCluster`), this is `undefined`.",
            stability: "stable",
            summary:
              "If this cluster is kubectl-enabled, returns the OpenID Connect issuer.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1340,
          },
          name: "clusterOpenIdConnectIssuer",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              attribute: "true",
            },
            remarks:
              "This is because the values is only be retrieved by the API and not exposed\nby CloudFormation. If this cluster is not kubectl-enabled (i.e. uses the\nstock `CfnCluster`), this is `undefined`.",
            stability: "stable",
            summary:
              "If this cluster is kubectl-enabled, returns the OpenID Connect issuer url.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1329,
          },
          name: "clusterOpenIdConnectIssuerUrl",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "The cluster security group that was created by Amazon EKS for the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 801,
          },
          name: "clusterSecurityGroup",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            fqn: "@aws-cdk/aws-ec2.ISecurityGroup",
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "The id of the cluster security group that was created by Amazon EKS for the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 796,
          },
          name: "clusterSecurityGroupId",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              memberof: "Cluster",
              type: "{ec2.Connections}",
            },
            stability: "stable",
            summary:
              "Manages connection rules (Security Group Rules) for the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 814,
          },
          name: "connections",
          overrides: "@aws-cdk/aws-ec2.IConnectable",
          type: {
            fqn: "@aws-cdk/aws-ec2.Connections",
          },
        },
        {
          docs: {
            remarks:
              "A provider will only be defined if this property is accessed (lazy initialization).",
            stability: "stable",
            summary:
              "An `OpenIdConnectProvider` resource associated with this cluster, and which can be used to link this cluster to AWS IAM.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1350,
          },
          name: "openIdConnectProvider",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            fqn: "@aws-cdk/aws-iam.IOpenIdConnectProvider",
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Determines if Kubernetes resources can be pruned automatically.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 894,
          },
          name: "prune",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            primitive: "boolean",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "IAM role assumed by the EKS Control Plane.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 819,
          },
          name: "role",
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "The VPC in which this Cluster was created.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 765,
          },
          name: "vpc",
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            fqn: "@aws-cdk/aws-ec2.IVpc",
          },
        },
        {
          docs: {
            remarks:
              "This will be `undefined` if the `defaultCapacityType` is not `EC2` or\n`defaultCapacityType` is `EC2` but default capacity is set to 0.",
            stability: "stable",
            summary:
              "The auto scaling group that hosts the default capacity for this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 826,
          },
          name: "defaultCapacity",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-autoscaling.AutoScalingGroup",
          },
        },
        {
          docs: {
            remarks:
              "This will be `undefined` if the `defaultCapacityType` is `EC2` or\n`defaultCapacityType` is `NODEGROUP` but default capacity is set to 0.",
            stability: "stable",
            summary:
              "The node group that hosts the default capacity for this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 833,
          },
          name: "defaultNodegroup",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.Nodegroup",
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Custom environment variables when running `kubectl` against this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 845,
          },
          name: "kubectlEnvironment",
          optional: true,
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "map",
            },
          },
        },
        {
          docs: {
            remarks:
              "If\nundefined, a SAR app that contains this layer will be used.",
            stability: "stable",
            summary:
              "The AWS Lambda layer that contains `kubectl`, `helm` and the AWS CLI.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 884,
          },
          name: "kubectlLayer",
          optional: true,
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            fqn: "@aws-cdk/aws-lambda.ILayerVersion",
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "The amount of memory allocated to the kubectl provider's lambda function.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 889,
          },
          name: "kubectlMemory",
          optional: true,
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            fqn: "@aws-cdk/core.Size",
          },
        },
        {
          docs: {
            default:
              "- If not specified, the k8s endpoint is expected to be accessible\npublicly.",
            stability: "stable",
            summary: "Subnets to host the `kubectl` compute resources.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 861,
          },
          name: "kubectlPrivateSubnets",
          optional: true,
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            collection: {
              elementtype: {
                fqn: "@aws-cdk/aws-ec2.ISubnet",
              },
              kind: "array",
            },
          },
        },
        {
          docs: {
            remarks:
              "The role should be mapped to the `system:masters` Kubernetes RBAC role.",
            stability: "stable",
            summary:
              "An IAM role that can perform kubectl operations against this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 840,
          },
          name: "kubectlRole",
          optional: true,
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          docs: {
            default:
              "- If not specified, the k8s endpoint is expected to be accessible\npublicly.",
            stability: "stable",
            summary: "A security group to use for `kubectl` execution.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 853,
          },
          name: "kubectlSecurityGroup",
          optional: true,
          overrides: "@aws-cdk/aws-eks.ICluster",
          type: {
            fqn: "@aws-cdk/aws-ec2.ISecurityGroup",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.ClusterAttributes": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Attributes for EKS clusters.",
      },
      fqn: "@aws-cdk/aws-eks.ClusterAttributes",
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 182,
      },
      name: "ClusterAttributes",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "The physical name of the Cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 192,
          },
          name: "clusterName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- if not specified `cluster.clusterCertificateAuthorityData` will\nthrow an error",
            stability: "stable",
            summary: "The certificate-authority-data for your cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 205,
          },
          name: "clusterCertificateAuthorityData",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- if not specified `cluster.clusterEncryptionConfigKeyArn` will\nthrow an error",
            stability: "stable",
            summary:
              "Amazon Resource Name (ARN) or alias of the customer master key (CMK).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 219,
          },
          name: "clusterEncryptionConfigKeyArn",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- if not specified `cluster.clusterEndpoint` will throw an error.",
            stability: "stable",
            summary: "The API Server endpoint URL.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 198,
          },
          name: "clusterEndpoint",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- if not specified `cluster.clusterSecurityGroupId` will throw an\nerror",
            stability: "stable",
            summary:
              "The cluster security group that was created by Amazon EKS for the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 212,
          },
          name: "clusterSecurityGroupId",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- no additional variables",
            stability: "stable",
            summary:
              "Environment variables to use when running `kubectl` against this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 239,
          },
          name: "kubectlEnvironment",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "map",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default: "- a layer bundled with this module.",
            remarks:
              "This layer\nis used by the kubectl handler to apply manifests and install helm charts.\n\nThe handler expects the layer to include the following executables:\n\n    helm/helm\n    kubectl/kubectl\n    awscli/aws",
            stability: "stable",
            summary:
              "An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 275,
          },
          name: "kubectlLayer",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-lambda.ILayerVersion",
          },
        },
        {
          abstract: true,
          docs: {
            default: "Size.gibibytes(1)",
            stability: "stable",
            summary:
              "Amount of memory to allocate to the provider's lambda function.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 282,
          },
          name: "kubectlMemory",
          optional: true,
          type: {
            fqn: "@aws-cdk/core.Size",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- k8s endpoint is expected to be accessible publicly",
            remarks:
              "If not specified, the k8s\nendpoint is expected to be accessible publicly.",
            stability: "stable",
            summary: "Subnets to host the `kubectl` compute resources.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 253,
          },
          name: "kubectlPrivateSubnetIds",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- if not specified, it not be possible to issue `kubectl` commands\nagainst an imported cluster.",
            stability: "stable",
            summary:
              'An IAM role with cluster administrator and "system:masters" permissions.',
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 233,
          },
          name: "kubectlRoleArn",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- k8s endpoint is expected to be accessible publicly",
            remarks:
              "If not specified, the k8s\nendpoint is expected to be accessible publicly.",
            stability: "stable",
            summary: "A security group to use for `kubectl` execution.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 246,
          },
          name: "kubectlSecurityGroupId",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- if not specified `cluster.openIdConnectProvider` and `cluster.addServiceAccount` will throw an error.",
            remarks:
              "You can either import an existing provider using `iam.OpenIdConnectProvider.fromProviderArn`,\nor create a new provider using `new eks.OpenIdConnectProvider`",
            stability: "stable",
            summary:
              "An Open ID Connect provider for this cluster that can be used to configure service accounts.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 261,
          },
          name: "openIdConnectProvider",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-iam.IOpenIdConnectProvider",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            remarks:
              "When this is enabled (default), prune labels will be\nallocated and injected to each resource. These labels will then be used\nwhen issuing the `kubectl apply` operation with the `--prune` switch.",
            stability: "stable",
            summary:
              "Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 292,
          },
          name: "prune",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- if not specified, no additional security groups will be\nconsidered in `cluster.connections`.",
            stability: "stable",
            summary: "Additional security groups associated with this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 226,
          },
          name: "securityGroupIds",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default: "- if not specified `cluster.vpc` will throw an error",
            stability: "stable",
            summary: "The VPC in which this Cluster was created.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 187,
          },
          name: "vpc",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.IVpc",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.ClusterOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Options for EKS clusters.",
      },
      fqn: "@aws-cdk/aws-eks.ClusterOptions",
      interfaces: ["@aws-cdk/aws-eks.CommonClusterOptions"],
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 370,
      },
      name: "ClusterOptions",
      properties: [
        {
          abstract: true,
          docs: {
            default: "- No environment variables.",
            stability: "stable",
            summary:
              "Custom environment variables when interacting with the EKS endpoint to manage the cluster lifecycle.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 420,
          },
          name: "clusterHandlerEnvironment",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "map",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "CoreDnsComputeType.EC2 (for `FargateCluster` the default is FARGATE)",
            stability: "stable",
            summary:
              'Controls the "eks.amazonaws.com/compute-type" annotation in the CoreDNS configuration on your cluster to determine which compute type to use for CoreDNS.',
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 389,
          },
          name: "coreDnsComputeType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.CoreDnsComputeType",
          },
        },
        {
          abstract: true,
          docs: {
            default: "EndpointAccess.PUBLIC_AND_PRIVATE",
            see: "https://docs.aws.amazon.com/eks/latest/userguide/cluster-endpoint.html",
            stability: "stable",
            summary: "Configure access to the Kubernetes API server endpoint..",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 406,
          },
          name: "endpointAccess",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.EndpointAccess",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- No environment variables.",
            remarks: "Only relevant for kubectl enabled clusters.",
            stability: "stable",
            summary: "Environment variables for the kubectl execution.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 413,
          },
          name: "kubectlEnvironment",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "map",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- the layer provided by the `aws-lambda-layer-kubectl` SAR app.",
            remarks:
              "By default, the provider will use the layer included in the\n\"aws-lambda-layer-kubectl\" SAR application which is available in all\ncommercial regions.\n\nTo deploy the layer locally, visit\nhttps://github.com/aws-samples/aws-lambda-layer-kubectl/blob/master/cdk/README.md\nfor instructions on how to prepare the .zip file and then define it in your\napp as follows:\n\n```ts\nconst layer = new lambda.LayerVersion(this, 'kubectl-layer', {\n   code: lambda.Code.fromAsset(`${__dirname}/layer.zip`)),\n   compatibleRuntimes: [lambda.Runtime.PROVIDED]\n})\n```",
            see: "https://github.com/aws-samples/aws-lambda-layer-kubectl",
            stability: "stable",
            summary:
              "An AWS Lambda Layer which includes `kubectl`, Helm and the AWS CLI.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 444,
          },
          name: "kubectlLayer",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-lambda.ILayerVersion",
          },
        },
        {
          abstract: true,
          docs: {
            default: "Size.gibibytes(1)",
            stability: "stable",
            summary:
              "Amount of memory to allocate to the provider's lambda function.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 451,
          },
          name: "kubectlMemory",
          optional: true,
          type: {
            fqn: "@aws-cdk/core.Size",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- a role that assumable by anyone with permissions in the same\naccount will automatically be defined",
            see: "https://kubernetes.io/docs/reference/access-authn-authz/rbac/#default-roles-and-role-bindings",
            stability: "stable",
            summary:
              "An IAM role that will be added to the `system:masters` Kubernetes RBAC group.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 380,
          },
          name: "mastersRole",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          abstract: true,
          docs: {
            default: "false",
            stability: "stable",
            summary:
              'Determines whether a CloudFormation output with the ARN of the "masters" IAM role will be synthesized (if `mastersRole` is specified).',
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 397,
          },
          name: "outputMastersRoleArn",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "false",
            stability: "stable",
            summary:
              "If set to true, the cluster handler functions will be placed in the private subnets of the cluster vpc, subject to the `vpcSubnets` selection strategy.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 469,
          },
          name: "placeClusterHandlerInVpc",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            remarks:
              "When this is enabled (default), prune labels will be\nallocated and injected to each resource. These labels will then be used\nwhen issuing the `kubectl apply` operation with the `--prune` switch.",
            stability: "stable",
            summary:
              "Indicates whether Kubernetes resources added through `addManifest()` can be automatically pruned.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 461,
          },
          name: "prune",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- By default, Kubernetes stores all secret object data within etcd and\n  all etcd volumes used by Amazon EKS are encrypted at the disk-level\n  using AWS-Managed encryption keys.",
            stability: "stable",
            summary:
              "KMS secret for envelope encryption for Kubernetes secrets.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 478,
          },
          name: "secretsEncryptionKey",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-kms.IKey",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.ClusterProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Common configuration props for EKS clusters.",
      },
      fqn: "@aws-cdk/aws-eks.ClusterProps",
      interfaces: ["@aws-cdk/aws-eks.ClusterOptions"],
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 578,
      },
      name: "ClusterProps",
      properties: [
        {
          abstract: true,
          docs: {
            default: "2",
            remarks:
              "Instance type can be configured through `defaultCapacityInstanceType`,\nwhich defaults to `m5.large`.\n\nUse `cluster.addAutoScalingGroupCapacity` to add additional customized capacity. Set this\nto `0` is you wish to avoid the initial capacity allocation.",
            stability: "stable",
            summary:
              "Number of instances to allocate as an initial capacity for this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 590,
          },
          name: "defaultCapacity",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            default: "m5.large",
            remarks:
              "This will only be taken\ninto account if `defaultCapacity` is > 0.",
            stability: "stable",
            summary: "The instance type to use for the default capacity.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 598,
          },
          name: "defaultCapacityInstance",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.InstanceType",
          },
        },
        {
          abstract: true,
          docs: {
            default: "NODEGROUP",
            stability: "stable",
            summary: "The default capacity type for the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 605,
          },
          name: "defaultCapacityType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.DefaultCapacityType",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CommonClusterOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Options for configuring an EKS cluster.",
      },
      fqn: "@aws-cdk/aws-eks.CommonClusterOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 298,
      },
      name: "CommonClusterOptions",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "The Kubernetes version to run in the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 347,
          },
          name: "version",
          type: {
            fqn: "@aws-cdk/aws-eks.KubernetesVersion",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- Automatically generated name",
            stability: "stable",
            summary: "Name for the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 335,
          },
          name: "clusterName",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "false",
            stability: "stable",
            summary:
              "Determines whether a CloudFormation output with the name of the cluster will be synthesized.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 355,
          },
          name: "outputClusterName",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            remarks:
              "This command will include\nthe cluster name and, if applicable, the ARN of the masters IAM role.",
            stability: "stable",
            summary:
              "Determines whether a CloudFormation output with the `aws eks update-kubeconfig` command will be synthesized.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 364,
          },
          name: "outputConfigCommand",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- A role is automatically created for you",
            stability: "stable",
            summary:
              "Role that provides permissions for the Kubernetes control plane to make calls to AWS API operations on your behalf.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 328,
          },
          name: "role",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- A security group is automatically created",
            stability: "stable",
            summary: "Security Group to use for Control Plane ENIs.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 342,
          },
          name: "securityGroup",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.ISecurityGroup",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- a VPC with default configuration will be created and can be accessed through `cluster.vpc`.",
            stability: "stable",
            summary: "The VPC in which to create the Cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 304,
          },
          name: "vpc",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.IVpc",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- All public and private subnets",
            remarks:
              "If you want to create public load balancers, this must include public subnets.\n\nFor example, to only select private subnets, supply the following:\n\n```ts\nvpcSubnets: [\n   { subnetType: ec2.SubnetType.Private }\n]\n```",
            stability: "stable",
            summary: "Where to place EKS Control Plane ENIs.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 321,
          },
          name: "vpcSubnets",
          optional: true,
          type: {
            collection: {
              elementtype: {
                fqn: "@aws-cdk/aws-ec2.SubnetSelection",
              },
              kind: "array",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.CoreDnsComputeType": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "The type of compute resources to use for CoreDNS.",
      },
      fqn: "@aws-cdk/aws-eks.CoreDnsComputeType",
      kind: "enum",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1916,
      },
      members: [
        {
          docs: {
            stability: "stable",
            summary: "Deploy CoreDNS on EC2 instances.",
          },
          name: "EC2",
        },
        {
          docs: {
            stability: "stable",
            summary: "Deploy CoreDNS on Fargate-managed instances.",
          },
          name: "FARGATE",
        },
      ],
      name: "CoreDnsComputeType",
    },
    "@aws-cdk/aws-eks.CpuArch": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "CPU architecture.",
      },
      fqn: "@aws-cdk/aws-eks.CpuArch",
      kind: "enum",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1901,
      },
      members: [
        {
          docs: {
            stability: "stable",
            summary: "arm64 CPU type.",
          },
          name: "ARM_64",
        },
        {
          docs: {
            stability: "stable",
            summary: "x86_64 CPU type.",
          },
          name: "X86_64",
        },
      ],
      name: "CpuArch",
    },
    "@aws-cdk/aws-eks.DefaultCapacityType": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "The default capacity type for the cluster.",
      },
      fqn: "@aws-cdk/aws-eks.DefaultCapacityType",
      kind: "enum",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1931,
      },
      members: [
        {
          docs: {
            stability: "stable",
            summary: "managed node group.",
          },
          name: "NODEGROUP",
        },
        {
          docs: {
            stability: "stable",
            summary: "EC2 autoscaling group.",
          },
          name: "EC2",
        },
      ],
      name: "DefaultCapacityType",
    },
    "@aws-cdk/aws-eks.EksOptimizedImage": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary:
          "Construct an Amazon Linux 2 image from the latest EKS Optimized AMI published in SSM.",
      },
      fqn: "@aws-cdk/aws-eks.EksOptimizedImage",
      initializer: {
        docs: {
          stability: "stable",
          summary: "Constructs a new instance of the EcsOptimizedAmi class.",
        },
        locationInModule: {
          filename: "lib/cluster.ts",
          line: 1848,
        },
        parameters: [
          {
            name: "props",
            optional: true,
            type: {
              fqn: "@aws-cdk/aws-eks.EksOptimizedImageProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/aws-ec2.IMachineImage"],
      kind: "class",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1839,
      },
      methods: [
        {
          docs: {
            stability: "stable",
            summary: "Return the correct image.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1865,
          },
          name: "getImage",
          overrides: "@aws-cdk/aws-ec2.IMachineImage",
          parameters: [
            {
              name: "scope",
              type: {
                fqn: "@aws-cdk/core.Construct",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-ec2.MachineImageConfig",
            },
          },
        },
      ],
      name: "EksOptimizedImage",
    },
    "@aws-cdk/aws-eks.EksOptimizedImageProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Properties for EksOptimizedImage.",
      },
      fqn: "@aws-cdk/aws-eks.EksOptimizedImageProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1813,
      },
      name: "EksOptimizedImageProps",
      properties: [
        {
          abstract: true,
          docs: {
            default: "CpuArch.X86_64",
            stability: "stable",
            summary:
              "What cpu architecture to retrieve the image for (arm64 or x86_64).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1826,
          },
          name: "cpuArch",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.CpuArch",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- The latest version",
            stability: "stable",
            summary: "The Kubernetes version to use.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1833,
          },
          name: "kubernetesVersion",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "NodeType.STANDARD",
            stability: "stable",
            summary:
              "What instance type to retrieve the image for (standard or GPU-optimized).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 1819,
          },
          name: "nodeType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.NodeType",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.EndpointAccess": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "Endpoint access characteristics.",
      },
      fqn: "@aws-cdk/aws-eks.EndpointAccess",
      kind: "class",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 508,
      },
      methods: [
        {
          docs: {
            remarks:
              "If public access is disabled, this method will result in an error.",
            stability: "stable",
            summary: "Restrict public access to specific CIDR blocks.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 561,
          },
          name: "onlyFrom",
          parameters: [
            {
              docs: {
                summary: "CIDR blocks.",
              },
              name: "cidr",
              type: {
                primitive: "string",
              },
              variadic: true,
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.EndpointAccess",
            },
          },
          variadic: true,
        },
      ],
      name: "EndpointAccess",
      properties: [
        {
          const: true,
          docs: {
            remarks:
              "Worker node traffic to the endpoint will stay within your VPC.",
            stability: "stable",
            summary:
              "The cluster endpoint is only accessible through your VPC.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 527,
          },
          name: "PRIVATE",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.EndpointAccess",
          },
        },
        {
          const: true,
          docs: {
            remarks:
              "Worker node traffic will leave your VPC to connect to the endpoint.\n\nBy default, the endpoint is exposed to all adresses. You can optionally limit the CIDR blocks that can access the public endpoint using the `PUBLIC.onlyFrom` method.\nIf you limit access to specific CIDR blocks, you must ensure that the CIDR blocks that you\nspecify include the addresses that worker nodes and Fargate pods (if you use them)\naccess the public endpoint from.",
            stability: "stable",
            summary:
              "The cluster endpoint is accessible from outside of your VPC.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 521,
          },
          name: "PUBLIC",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.EndpointAccess",
          },
        },
        {
          const: true,
          docs: {
            remarks:
              "Worker node traffic to the endpoint will stay within your VPC.\n\nBy default, the endpoint is exposed to all adresses. You can optionally limit the CIDR blocks that can access the public endpoint using the `PUBLIC_AND_PRIVATE.onlyFrom` method.\nIf you limit access to specific CIDR blocks, you must ensure that the CIDR blocks that you\nspecify include the addresses that worker nodes and Fargate pods (if you use them)\naccess the public endpoint from.",
            stability: "stable",
            summary:
              "The cluster endpoint is accessible from outside of your VPC.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 540,
          },
          name: "PUBLIC_AND_PRIVATE",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.EndpointAccess",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.FargateCluster": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/aws-eks.Cluster",
      docs: {
        remarks:
          'The cluster is created with a default Fargate Profile that matches the\n"default" and "kube-system" namespaces. You can add additional profiles using\n`addFargateProfile`.',
        stability: "stable",
        summary: "Defines an EKS cluster that runs entirely on AWS Fargate.",
      },
      fqn: "@aws-cdk/aws-eks.FargateCluster",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/fargate-cluster.ts",
          line: 26,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.FargateClusterProps",
            },
          },
        ],
      },
      kind: "class",
      locationInModule: {
        filename: "lib/fargate-cluster.ts",
        line: 25,
      },
      name: "FargateCluster",
    },
    "@aws-cdk/aws-eks.FargateClusterProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Configuration props for EKS Fargate.",
      },
      fqn: "@aws-cdk/aws-eks.FargateClusterProps",
      interfaces: ["@aws-cdk/aws-eks.ClusterOptions"],
      kind: "interface",
      locationInModule: {
        filename: "lib/fargate-cluster.ts",
        line: 8,
      },
      name: "FargateClusterProps",
      properties: [
        {
          abstract: true,
          docs: {
            default:
              "- A profile called \"default\" with 'default' and 'kube-system'\n  selectors will be created if this is left undefined.",
            stability: "stable",
            summary: "Fargate Profile to create along with the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-cluster.ts",
            line: 15,
          },
          name: "defaultProfile",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.FargateProfileOptions",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.FargateProfile": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Construct",
      docs: {
        remarks:
          "This declaration is done through the profile’s selectors. Each\nprofile can have up to five selectors that contain a namespace and optional\nlabels. You must define a namespace for every selector. The label field\nconsists of multiple optional key-value pairs. Pods that match a selector (by\nmatching a namespace for the selector and all of the labels specified in the\nselector) are scheduled on Fargate. If a namespace selector is defined\nwithout any labels, Amazon EKS will attempt to schedule all pods that run in\nthat namespace onto Fargate using the profile. If a to-be-scheduled pod\nmatches any of the selectors in the Fargate profile, then that pod is\nscheduled on Fargate.\n\nIf a pod matches multiple Fargate profiles, Amazon EKS picks one of the\nmatches at random. In this case, you can specify which profile a pod should\nuse by adding the following Kubernetes label to the pod specification:\neks.amazonaws.com/fargate-profile: profile_name. However, the pod must still\nmatch a selector in that profile in order to be scheduled onto Fargate.",
        stability: "stable",
        summary:
          "Fargate profiles allows an administrator to declare which pods run on Fargate.",
      },
      fqn: "@aws-cdk/aws-eks.FargateProfile",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/fargate-profile.ts",
          line: 145,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.FargateProfileProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/core.ITaggable"],
      kind: "class",
      locationInModule: {
        filename: "lib/fargate-profile.ts",
        line: 116,
      },
      name: "FargateProfile",
      properties: [
        {
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary:
              "The full Amazon Resource Name (ARN) of the Fargate profile.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 123,
          },
          name: "fargateProfileArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary: "The name of the Fargate profile.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 130,
          },
          name: "fargateProfileName",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            remarks:
              "The pod execution role allows Fargate infrastructure to\nregister with your cluster as a node, and it provides read access to Amazon\nECR image repositories.",
            stability: "stable",
            summary:
              "The pod execution role to use for pods that match the selectors in the Fargate profile.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 143,
          },
          name: "podExecutionRole",
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "Resource tags.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 135,
          },
          name: "tags",
          overrides: "@aws-cdk/core.ITaggable",
          type: {
            fqn: "@aws-cdk/core.TagManager",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.FargateProfileOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Options for defining EKS Fargate Profiles.",
      },
      fqn: "@aws-cdk/aws-eks.FargateProfileOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/fargate-profile.ts",
        line: 16,
      },
      name: "FargateProfileOptions",
      properties: [
        {
          abstract: true,
          docs: {
            remarks:
              "Each selector\nmust have an associated namespace. Optionally, you can also specify labels\nfor a namespace.\n\nAt least one selector is required and you may specify up to five selectors.",
            stability: "stable",
            summary:
              "The selectors to match for pods to use this Fargate profile.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 41,
          },
          name: "selectors",
          type: {
            collection: {
              elementtype: {
                fqn: "@aws-cdk/aws-eks.Selector",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default: "- generated",
            stability: "stable",
            summary: "The name of the Fargate profile.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 21,
          },
          name: "fargateProfileName",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- a role will be automatically created",
            remarks:
              "The pod execution role allows Fargate infrastructure to\nregister with your cluster as a node, and it provides read access to Amazon\nECR image repositories.",
            see: "https://docs.aws.amazon.com/eks/latest/userguide/pod-execution-role.html",
            stability: "stable",
            summary:
              "The pod execution role to use for pods that match the selectors in the Fargate profile.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 32,
          },
          name: "podExecutionRole",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- all private subnets of the VPC are selected.",
            remarks:
              "At this time, pods running\non Fargate are not assigned public IP addresses, so only private subnets\n(with no direct route to an Internet Gateway) are allowed.",
            stability: "stable",
            summary: "Select which subnets to launch your pods into.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 60,
          },
          name: "subnetSelection",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.SubnetSelection",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- all private subnets used by theEKS cluster",
            remarks:
              "By default, all private subnets are selected. You can customize this using\n`subnetSelection`.",
            stability: "stable",
            summary:
              "The VPC from which to select subnets to launch your pods into.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 51,
          },
          name: "vpc",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.IVpc",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.FargateProfileProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Configuration props for EKS Fargate Profiles.",
      },
      fqn: "@aws-cdk/aws-eks.FargateProfileProps",
      interfaces: ["@aws-cdk/aws-eks.FargateProfileOptions"],
      kind: "interface",
      locationInModule: {
        filename: "lib/fargate-profile.ts",
        line: 66,
      },
      name: "FargateProfileProps",
      properties: [
        {
          abstract: true,
          docs: {
            remarks: "[disable-awslint:ref-via-interface]",
            stability: "stable",
            summary: "The EKS cluster to apply the Fargate profile to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 71,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.Cluster",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.HelmChart": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Construct",
      docs: {
        remarks:
          "Applies/deletes the resources using `kubectl` in sync with the resource.",
        stability: "stable",
        summary: "Represents a helm chart within the Kubernetes system.",
      },
      fqn: "@aws-cdk/aws-eks.HelmChart",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/helm-chart.ts",
          line: 93,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.HelmChartProps",
            },
          },
        ],
      },
      kind: "class",
      locationInModule: {
        filename: "lib/helm-chart.ts",
        line: 87,
      },
      name: "HelmChart",
      properties: [
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "The CloudFormation resource type.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 91,
          },
          name: "RESOURCE_TYPE",
          static: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.HelmChartOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Helm Chart options.",
      },
      fqn: "@aws-cdk/aws-eks.HelmChartOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/helm-chart.ts",
        line: 14,
      },
      name: "HelmChartOptions",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "The name of the chart.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 18,
          },
          name: "chart",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            stability: "stable",
            summary: "create namespace if not exist.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 67,
          },
          name: "createNamespace",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "default",
            stability: "stable",
            summary: "The Kubernetes namespace scope of the requests.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 42,
          },
          name: "namespace",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- If no release name is given, it will use the last 53 characters of the node's unique id.",
            stability: "stable",
            summary: "The name of the release.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 24,
          },
          name: "release",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- No repository will be used, which means that the chart needs to be an absolute URL.",
            remarks:
              "For example: https://kubernetes-charts.storage.googleapis.com/",
            stability: "stable",
            summary: "The repository which contains the chart.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 36,
          },
          name: "repository",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "Duration.minutes(5)",
            remarks: "Maximum 15 minutes.",
            stability: "stable",
            summary:
              "Amount of time to wait for any individual Kubernetes operation.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 61,
          },
          name: "timeout",
          optional: true,
          type: {
            fqn: "@aws-cdk/core.Duration",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- No values are provided to the chart.",
            stability: "stable",
            summary: "The values to be used by the chart.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 48,
          },
          name: "values",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "any",
              },
              kind: "map",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- If this is not specified, the latest version is installed",
            stability: "stable",
            summary: "The chart version to install.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 30,
          },
          name: "version",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- Helm will not wait before marking release as successful",
            stability: "stable",
            summary:
              "Whether or not Helm should wait until all Pods, PVCs, Services, and minimum number of Pods of a Deployment, StatefulSet, or ReplicaSet are in a ready state before marking the release as successful.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 55,
          },
          name: "wait",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.HelmChartProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Helm Chart properties.",
      },
      fqn: "@aws-cdk/aws-eks.HelmChartProps",
      interfaces: ["@aws-cdk/aws-eks.HelmChartOptions"],
      kind: "interface",
      locationInModule: {
        filename: "lib/helm-chart.ts",
        line: 73,
      },
      name: "HelmChartProps",
      properties: [
        {
          abstract: true,
          docs: {
            remarks: "[disable-awslint:ref-via-interface]",
            stability: "stable",
            summary: "The EKS cluster to apply this configuration to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/helm-chart.ts",
            line: 79,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.ICluster",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.ICluster": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "An EKS cluster.",
      },
      fqn: "@aws-cdk/aws-eks.ICluster",
      interfaces: ["@aws-cdk/core.IResource", "@aws-cdk/aws-ec2.IConnectable"],
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 38,
      },
      methods: [
        {
          abstract: true,
          docs: {
            returns: "a `KubernetesManifest` construct representing the chart.",
            stability: "stable",
            summary: "Defines a CDK8s chart in this cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 175,
          },
          name: "addCdk8sChart",
          parameters: [
            {
              docs: {
                summary: "logical id of this chart.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "the cdk8s chart.",
              },
              name: "chart",
              type: {
                fqn: "constructs.Construct",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.KubernetesManifest",
            },
          },
        },
        {
          abstract: true,
          docs: {
            returns: "a `HelmChart` construct",
            stability: "stable",
            summary: "Defines a Helm chart in this cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 166,
          },
          name: "addHelmChart",
          parameters: [
            {
              docs: {
                summary: "logical id of this chart.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "options of this chart.",
              },
              name: "options",
              type: {
                fqn: "@aws-cdk/aws-eks.HelmChartOptions",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.HelmChart",
            },
          },
        },
        {
          abstract: true,
          docs: {
            remarks:
              "The manifest will be applied/deleted using kubectl as needed.",
            returns: "a `KubernetesManifest` object.",
            stability: "stable",
            summary: "Defines a Kubernetes resource in this cluster.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 157,
          },
          name: "addManifest",
          parameters: [
            {
              docs: {
                summary: "logical id of this manifest.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "a list of Kubernetes resource specifications.",
              },
              name: "manifest",
              type: {
                collection: {
                  elementtype: {
                    primitive: "any",
                  },
                  kind: "map",
                },
              },
              variadic: true,
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.KubernetesManifest",
            },
          },
          variadic: true,
        },
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary:
              "Creates a new service account with corresponding IAM Role (IRSA).",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 146,
          },
          name: "addServiceAccount",
          parameters: [
            {
              docs: {
                summary: "logical id of service account.",
              },
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              docs: {
                summary: "service account options.",
              },
              name: "options",
              optional: true,
              type: {
                fqn: "@aws-cdk/aws-eks.ServiceAccountOptions",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.ServiceAccount",
            },
          },
        },
      ],
      name: "ICluster",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary:
              "The unique ARN assigned to the service by AWS in the form of arn:aws:eks:.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 55,
          },
          name: "clusterArn",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary: "The certificate-authority-data for your cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 67,
          },
          name: "clusterCertificateAuthorityData",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary:
              "Amazon Resource Name (ARN) or alias of the customer master key (CMK).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 85,
          },
          name: "clusterEncryptionConfigKeyArn",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary: "The API Server endpoint URL.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 61,
          },
          name: "clusterEndpoint",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary: "The physical name of the Cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 48,
          },
          name: "clusterName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary:
              "The cluster security group that was created by Amazon EKS for the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 79,
          },
          name: "clusterSecurityGroup",
          type: {
            fqn: "@aws-cdk/aws-ec2.ISecurityGroup",
          },
        },
        {
          abstract: true,
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary:
              "The id of the cluster security group that was created by Amazon EKS for the cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 73,
          },
          name: "clusterSecurityGroupId",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary:
              "The Open ID Connect Provider of the cluster used to configure Service Accounts.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 90,
          },
          name: "openIdConnectProvider",
          type: {
            fqn: "@aws-cdk/aws-iam.IOpenIdConnectProvider",
          },
        },
        {
          abstract: true,
          docs: {
            remarks:
              "When\nthis is enabled (default), prune labels will be allocated and injected to\neach resource. These labels will then be used when issuing the `kubectl\napply` operation with the `--prune` switch.",
            stability: "stable",
            summary:
              "Indicates whether Kubernetes resources can be automatically pruned.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 138,
          },
          name: "prune",
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "The VPC in which this Cluster was created.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 42,
          },
          name: "vpc",
          type: {
            fqn: "@aws-cdk/aws-ec2.IVpc",
          },
        },
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary:
              "Custom environment variables when running `kubectl` against this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 102,
          },
          name: "kubectlEnvironment",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "map",
            },
          },
        },
        {
          abstract: true,
          docs: {
            remarks: "If not defined, a default layer will be used.",
            stability: "stable",
            summary:
              "An AWS Lambda layer that includes `kubectl`, `helm` and the `aws` CLI.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 125,
          },
          name: "kubectlLayer",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-lambda.ILayerVersion",
          },
        },
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary:
              "Amount of memory to allocate to the provider's lambda function.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 130,
          },
          name: "kubectlMemory",
          optional: true,
          type: {
            fqn: "@aws-cdk/core.Size",
          },
        },
        {
          abstract: true,
          docs: {
            remarks:
              "If this is undefined, the k8s endpoint is expected to be accessible\npublicly.",
            stability: "stable",
            summary: "Subnets to host the `kubectl` compute resources.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 118,
          },
          name: "kubectlPrivateSubnets",
          optional: true,
          type: {
            collection: {
              elementtype: {
                fqn: "@aws-cdk/aws-ec2.ISubnet",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            remarks:
              "The role should be mapped to the `system:masters` Kubernetes RBAC role.",
            stability: "stable",
            summary:
              "An IAM role that can perform kubectl operations against this cluster.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 97,
          },
          name: "kubectlRole",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          abstract: true,
          docs: {
            remarks:
              "If this is undefined, the k8s endpoint is expected to be accessible\npublicly.",
            stability: "stable",
            summary: "A security group to use for `kubectl` execution.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 110,
          },
          name: "kubectlSecurityGroup",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.ISecurityGroup",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.INodegroup": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "NodeGroup interface.",
      },
      fqn: "@aws-cdk/aws-eks.INodegroup",
      interfaces: ["@aws-cdk/core.IResource"],
      kind: "interface",
      locationInModule: {
        filename: "lib/managed-nodegroup.ts",
        line: 12,
      },
      name: "INodegroup",
      properties: [
        {
          abstract: true,
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary: "Name of the nodegroup.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 17,
          },
          name: "nodegroupName",
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.KubernetesManifest": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Construct",
      docs: {
        remarks:
          "Alternatively, you can use `cluster.addManifest(resource[, resource, ...])`\nto define resources on this cluster.\n\nApplies/deletes the manifest using `kubectl`.",
        stability: "stable",
        summary: "Represents a manifest within the Kubernetes system.",
      },
      fqn: "@aws-cdk/aws-eks.KubernetesManifest",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/k8s-manifest.ts",
          line: 109,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.KubernetesManifestProps",
            },
          },
        ],
      },
      kind: "class",
      locationInModule: {
        filename: "lib/k8s-manifest.ts",
        line: 103,
      },
      name: "KubernetesManifest",
      properties: [
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "The CloudFormation reosurce type.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-manifest.ts",
            line: 107,
          },
          name: "RESOURCE_TYPE",
          static: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.KubernetesManifestOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Options for `KubernetesManifest`.",
      },
      fqn: "@aws-cdk/aws-eks.KubernetesManifestOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/k8s-manifest.ts",
        line: 15,
      },
      name: "KubernetesManifestOptions",
      properties: [
        {
          abstract: true,
          docs: {
            default:
              "- based on the prune option of the cluster, which is `true` unless\notherwise specified.",
            remarks:
              'To address this, `kubectl apply` has a `--prune` option which will\nquery the cluster for all resources with a specific label and will remove\nall the labeld resources that are not part of the applied manifest. If this\noption is disabled and a resource is removed, it will become "orphaned" and\nwill not be deleted from the cluster.\n\nWhen this option is enabled (default), the construct will inject a label to\nall Kubernetes resources included in this manifest which will be used to\nprune resources when the manifest changes via `kubectl apply --prune`.\n\nThe label name will be `aws.cdk.eks/prune-<ADDR>` where `<ADDR>` is the\n42-char unique address of this construct in the construct tree. Value is\nempty.',
            see: "https://kubernetes.io/docs/tasks/manage-kubernetes-objects/declarative-config/#alternative-kubectl-apply-f-directory-prune-l-your-label",
            stability: "stable",
            summary:
              "When a resource is removed from a Kubernetes manifest, it no longer appears in the manifest, and there is no way to know that this resource needs to be deleted.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-manifest.ts",
            line: 39,
          },
          name: "prune",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "false",
            stability: "stable",
            summary:
              "A flag to signify if the manifest validation should be skipped.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-manifest.ts",
            line: 46,
          },
          name: "skipValidation",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.KubernetesManifestProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Properties for KubernetesManifest.",
      },
      fqn: "@aws-cdk/aws-eks.KubernetesManifestProps",
      interfaces: ["@aws-cdk/aws-eks.KubernetesManifestOptions"],
      kind: "interface",
      locationInModule: {
        filename: "lib/k8s-manifest.ts",
        line: 52,
      },
      name: "KubernetesManifestProps",
      properties: [
        {
          abstract: true,
          docs: {
            remarks: "[disable-awslint:ref-via-interface]",
            stability: "stable",
            summary: "The EKS cluster to apply this manifest to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-manifest.ts",
            line: 58,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.ICluster",
          },
        },
        {
          abstract: true,
          docs: {
            example:
              "[{\n  apiVersion: 'v1',\n  kind: 'Pod',\n  metadata: { name: 'mypod' },\n  spec: {\n    containers: [ { name: 'hello', image: 'paulbouwer/hello-kubernetes:1.5', ports: [ { containerPort: 8080 } ] } ]\n  }\n}]",
            remarks:
              "Consists of any number of child resources.\n\nWhen the resources are created/updated, this manifest will be applied to the\ncluster through `kubectl apply` and when the resources or the stack is\ndeleted, the resources in the manifest will be deleted through `kubectl delete`.",
            stability: "stable",
            summary: "The manifest to apply.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-manifest.ts",
            line: 81,
          },
          name: "manifest",
          type: {
            collection: {
              elementtype: {
                collection: {
                  elementtype: {
                    primitive: "any",
                  },
                  kind: "map",
                },
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default: "false",
            remarks:
              "If this is set, we will use `kubectl apply` instead of `kubectl create`\nwhen the resource is created. Otherwise, if there is already a resource\nin the cluster with the same name, the operation will fail.",
            stability: "stable",
            summary: "Overwrite any existing resources.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-manifest.ts",
            line: 92,
          },
          name: "overwrite",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.KubernetesObjectValue": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Construct",
      docs: {
        remarks:
          "Use this to fetch any information available by the `kubectl get` command.",
        stability: "stable",
        summary:
          "Represents a value of a specific object deployed in the cluster.",
      },
      fqn: "@aws-cdk/aws-eks.KubernetesObjectValue",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/k8s-object-value.ts",
          line: 66,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.KubernetesObjectValueProps",
            },
          },
        ],
      },
      kind: "class",
      locationInModule: {
        filename: "lib/k8s-object-value.ts",
        line: 58,
      },
      name: "KubernetesObjectValue",
      properties: [
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "The CloudFormation reosurce type.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-object-value.ts",
            line: 62,
          },
          name: "RESOURCE_TYPE",
          static: true,
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "The value as a string token.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-object-value.ts",
            line: 90,
          },
          name: "value",
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.KubernetesObjectValueProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Properties for KubernetesObjectValue.",
      },
      fqn: "@aws-cdk/aws-eks.KubernetesObjectValueProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/k8s-object-value.ts",
        line: 13,
      },
      name: "KubernetesObjectValueProps",
      properties: [
        {
          abstract: true,
          docs: {
            remarks: "[disable-awslint:ref-via-interface]",
            stability: "stable",
            summary: "The EKS cluster to fetch attributes from.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-object-value.ts",
            line: 19,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.ICluster",
          },
        },
        {
          abstract: true,
          docs: {
            see: "https://kubernetes.io/docs/reference/kubectl/jsonpath/",
            stability: "stable",
            summary: "JSONPath to the specific value.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-object-value.ts",
            line: 43,
          },
          name: "jsonPath",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "The name of the object to query.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-object-value.ts",
            line: 29,
          },
          name: "objectName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            remarks: "(e.g 'service', 'pod'...)",
            stability: "stable",
            summary: "The object type to query.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-object-value.ts",
            line: 24,
          },
          name: "objectType",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "'default'",
            stability: "stable",
            summary: "The namespace the object belongs to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-object-value.ts",
            line: 36,
          },
          name: "objectNamespace",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "Duration.minutes(5)",
            stability: "stable",
            summary: "Timeout for waiting on a value.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-object-value.ts",
            line: 50,
          },
          name: "timeout",
          optional: true,
          type: {
            fqn: "@aws-cdk/core.Duration",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.KubernetesPatch": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Construct",
      docs: {
        see: "https://kubernetes.io/docs/tasks/run-application/update-api-object-kubectl-patch/",
        stability: "stable",
        summary:
          "A CloudFormation resource which applies/restores a JSON patch into a Kubernetes resource.",
      },
      fqn: "@aws-cdk/aws-eks.KubernetesPatch",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/k8s-patch.ts",
          line: 75,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.KubernetesPatchProps",
            },
          },
        ],
      },
      kind: "class",
      locationInModule: {
        filename: "lib/k8s-patch.ts",
        line: 74,
      },
      name: "KubernetesPatch",
    },
    "@aws-cdk/aws-eks.KubernetesPatchProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Properties for KubernetesPatch.",
      },
      fqn: "@aws-cdk/aws-eks.KubernetesPatchProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/k8s-patch.ts",
        line: 13,
      },
      name: "KubernetesPatchProps",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary:
              "The JSON object to pass to `kubectl patch` when the resource is created/updated.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-patch.ts",
            line: 23,
          },
          name: "applyPatch",
          type: {
            collection: {
              elementtype: {
                primitive: "any",
              },
              kind: "map",
            },
          },
        },
        {
          abstract: true,
          docs: {
            remarks: "[disable-awslint:ref-via-interface]",
            stability: "stable",
            summary: "The cluster to apply the patch to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-patch.ts",
            line: 18,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.ICluster",
          },
        },
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary:
              "The full name of the resource to patch (e.g. `deployment/coredns`).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-patch.ts",
            line: 33,
          },
          name: "resourceName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary:
              "The JSON object to pass to `kubectl patch` when the resource is removed.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-patch.ts",
            line: 28,
          },
          name: "restorePatch",
          type: {
            collection: {
              elementtype: {
                primitive: "any",
              },
              kind: "map",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default: "PatchType.STRATEGIC",
            remarks: 'The default type used by `kubectl patch` is "strategic".',
            stability: "stable",
            summary: "The patch type to pass to `kubectl patch`.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-patch.ts",
            line: 48,
          },
          name: "patchType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.PatchType",
          },
        },
        {
          abstract: true,
          docs: {
            default: '"default"',
            stability: "stable",
            summary: "The kubernetes API namespace.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/k8s-patch.ts",
            line: 40,
          },
          name: "resourceNamespace",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.KubernetesVersion": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "Kubernetes cluster version.",
      },
      fqn: "@aws-cdk/aws-eks.KubernetesVersion",
      kind: "class",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 611,
      },
      methods: [
        {
          docs: {
            stability: "stable",
            summary: "Custom cluster version.",
          },
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 646,
          },
          name: "of",
          parameters: [
            {
              docs: {
                summary: "custom version number.",
              },
              name: "version",
              type: {
                primitive: "string",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.KubernetesVersion",
            },
          },
          static: true,
        },
      ],
      name: "KubernetesVersion",
      properties: [
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "Kubernetes version 1.14.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 615,
          },
          name: "V1_14",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.KubernetesVersion",
          },
        },
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "Kubernetes version 1.15.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 620,
          },
          name: "V1_15",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.KubernetesVersion",
          },
        },
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "Kubernetes version 1.16.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 625,
          },
          name: "V1_16",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.KubernetesVersion",
          },
        },
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "Kubernetes version 1.17.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 630,
          },
          name: "V1_17",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.KubernetesVersion",
          },
        },
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "Kubernetes version 1.18.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 635,
          },
          name: "V1_18",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.KubernetesVersion",
          },
        },
        {
          const: true,
          docs: {
            stability: "stable",
            summary: "Kubernetes version 1.19.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 640,
          },
          name: "V1_19",
          static: true,
          type: {
            fqn: "@aws-cdk/aws-eks.KubernetesVersion",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "cluster version number.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 651,
          },
          name: "version",
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.LaunchTemplateSpec": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Launch template property specification.",
      },
      fqn: "@aws-cdk/aws-eks.LaunchTemplateSpec",
      kind: "interface",
      locationInModule: {
        filename: "lib/managed-nodegroup.ts",
        line: 77,
      },
      name: "LaunchTemplateSpec",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "The Launch template ID.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 81,
          },
          name: "id",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- the default version of the launch template",
            stability: "stable",
            summary: "The launch template version to be used (optional).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 87,
          },
          name: "version",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.MachineImageType": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "The machine image type.",
      },
      fqn: "@aws-cdk/aws-eks.MachineImageType",
      kind: "enum",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1945,
      },
      members: [
        {
          docs: {
            stability: "stable",
            summary: "Amazon EKS-optimized Linux AMI.",
          },
          name: "AMAZON_LINUX_2",
        },
        {
          docs: {
            stability: "stable",
            summary: "Bottlerocket AMI.",
          },
          name: "BOTTLEROCKET",
        },
      ],
      name: "MachineImageType",
    },
    "@aws-cdk/aws-eks.NodeType": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary:
          "Whether the worker nodes should support GPU or just standard instances.",
      },
      fqn: "@aws-cdk/aws-eks.NodeType",
      kind: "enum",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 1881,
      },
      members: [
        {
          docs: {
            stability: "stable",
            summary: "Standard instances.",
          },
          name: "STANDARD",
        },
        {
          docs: {
            stability: "stable",
            summary: "GPU instances.",
          },
          name: "GPU",
        },
        {
          docs: {
            stability: "stable",
            summary: "Inferentia instances.",
          },
          name: "INFERENTIA",
        },
      ],
      name: "NodeType",
    },
    "@aws-cdk/aws-eks.Nodegroup": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Resource",
      docs: {
        stability: "stable",
        summary: "The Nodegroup resource class.",
      },
      fqn: "@aws-cdk/aws-eks.Nodegroup",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/managed-nodegroup.ts",
          line: 265,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.NodegroupProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/aws-eks.INodegroup"],
      kind: "class",
      locationInModule: {
        filename: "lib/managed-nodegroup.ts",
        line: 228,
      },
      methods: [
        {
          docs: {
            stability: "stable",
            summary: "Import the Nodegroup from attributes.",
          },
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 232,
          },
          name: "fromNodegroupName",
          parameters: [
            {
              name: "scope",
              type: {
                fqn: "constructs.Construct",
              },
            },
            {
              name: "id",
              type: {
                primitive: "string",
              },
            },
            {
              name: "nodegroupName",
              type: {
                primitive: "string",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-eks.INodegroup",
            },
          },
          static: true,
        },
      ],
      name: "Nodegroup",
      properties: [
        {
          docs: {
            custom: {
              attribute: "ClusterName",
            },
            stability: "stable",
            summary: "the Amazon EKS cluster resource.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 255,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.ICluster",
          },
        },
        {
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary: "ARN of the nodegroup.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 243,
          },
          name: "nodegroupArn",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            custom: {
              attribute: "true",
            },
            stability: "stable",
            summary: "Nodegroup name.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 249,
          },
          name: "nodegroupName",
          overrides: "@aws-cdk/aws-eks.INodegroup",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "IAM role of the instance profile for the nodegroup.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 259,
          },
          name: "role",
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.NodegroupAmiType": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        remarks:
          "GPU instance types should use the `AL2_x86_64_GPU` AMI type, which uses the\nAmazon EKS-optimized Linux AMI with GPU support. Non-GPU instances should use the `AL2_x86_64` AMI type, which\nuses the Amazon EKS-optimized Linux AMI.",
        stability: "stable",
        summary: "The AMI type for your node group.",
      },
      fqn: "@aws-cdk/aws-eks.NodegroupAmiType",
      kind: "enum",
      locationInModule: {
        filename: "lib/managed-nodegroup.ts",
        line: 25,
      },
      members: [
        {
          docs: {
            stability: "stable",
            summary: "Amazon Linux 2 (x86-64).",
          },
          name: "AL2_X86_64",
        },
        {
          docs: {
            stability: "stable",
            summary: "Amazon Linux 2 with GPU support.",
          },
          name: "AL2_X86_64_GPU",
        },
        {
          docs: {
            stability: "stable",
            summary: "Amazon Linux 2 (ARM-64).",
          },
          name: "AL2_ARM_64",
        },
      ],
      name: "NodegroupAmiType",
    },
    "@aws-cdk/aws-eks.NodegroupOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "The Nodegroup Options for addNodeGroup() method.",
      },
      fqn: "@aws-cdk/aws-eks.NodegroupOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/managed-nodegroup.ts",
        line: 93,
      },
      name: "NodegroupOptions",
      properties: [
        {
          abstract: true,
          docs: {
            default: "- auto-determined from the instanceTypes property.",
            stability: "stable",
            summary: "The AMI type for your node group.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 114,
          },
          name: "amiType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.NodegroupAmiType",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- ON_DEMAND",
            stability: "stable",
            summary: "The capacity type of the nodegroup.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 212,
          },
          name: "capacityType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.CapacityType",
          },
        },
        {
          abstract: true,
          docs: {
            default: "2",
            remarks:
              "If not specified,\nthe nodewgroup will initially create `minSize` instances.",
            stability: "stable",
            summary:
              "The current number of worker nodes that the managed node group should maintain.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 127,
          },
          name: "desiredSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            default: "20",
            stability: "stable",
            summary:
              "The root device disk size (in GiB) for your node group instances.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 120,
          },
          name: "diskSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            default: "true",
            remarks:
              "If an update fails because pods could not be drained, you can force the update after it fails to terminate the old\nnode whether or not any pods are\nrunning on the node.",
            stability: "stable",
            summary:
              "Force the update if the existing node group's pods are unable to be drained due to a pod disruption budget issue.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 148,
          },
          name: "forceUpdate",
          optional: true,
          type: {
            primitive: "boolean",
          },
        },
        {
          abstract: true,
          docs: {
            default: "t3.medium",
            deprecated: "Use `instanceTypes` instead.",
            remarks:
              "Currently, you can specify a single instance type for a node group.\nThe default value for this parameter is `t3.medium`. If you choose a GPU instance type, be sure to specify the\n`AL2_x86_64_GPU` with the amiType parameter.",
            stability: "deprecated",
            summary: "The instance type to use for your node group.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 157,
          },
          name: "instanceType",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.InstanceType",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "t3.medium will be used according to the cloudformation document.",
            see: "- https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-eks-nodegroup.html#cfn-eks-nodegroup-instancetypes",
            stability: "stable",
            summary: "The instance types to use for your node group.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 163,
          },
          name: "instanceTypes",
          optional: true,
          type: {
            collection: {
              elementtype: {
                fqn: "@aws-cdk/aws-ec2.InstanceType",
              },
              kind: "array",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default: "- None",
            stability: "stable",
            summary:
              "The Kubernetes labels to be applied to the nodes in the node group when they are created.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 169,
          },
          name: "labels",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "map",
            },
          },
        },
        {
          abstract: true,
          docs: {
            default: "- no launch template",
            see: "- https://docs.aws.amazon.com/eks/latest/userguide/launch-templates.html",
            stability: "stable",
            summary: "Launch template specification used for the nodegroup.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 206,
          },
          name: "launchTemplateSpec",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.LaunchTemplateSpec",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- desiredSize",
            remarks:
              "Managed node groups can support up to 100 nodes by default.",
            stability: "stable",
            summary:
              "The maximum number of worker nodes that the managed node group can scale out to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 133,
          },
          name: "maxSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            default: "1",
            remarks: "This number must be greater than zero.",
            stability: "stable",
            summary:
              "The minimum number of worker nodes that the managed node group can scale in to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 139,
          },
          name: "minSize",
          optional: true,
          type: {
            primitive: "number",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- resource ID",
            stability: "stable",
            summary: "Name of the Nodegroup.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 99,
          },
          name: "nodegroupName",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- None. Auto-generated if not specified.",
            remarks:
              "The Amazon EKS worker node kubelet daemon\nmakes calls to AWS APIs on your behalf. Worker nodes receive permissions for these API calls through\nan IAM instance profile and associated policies. Before you can launch worker nodes and register them\ninto a cluster, you must create an IAM role for those worker nodes to use when they are launched.",
            stability: "stable",
            summary: "The IAM role to associate with your node group.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 178,
          },
          name: "nodeRole",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- The latest available AMI version for the node group's current Kubernetes version is used.",
            stability: "stable",
            summary:
              "The AMI version of the Amazon EKS-optimized AMI to use with your node group (for example, `1.14.7-YYYYMMDD`).",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 184,
          },
          name: "releaseVersion",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- disabled",
            remarks:
              "Disabled by default, however, if you\nspecify an Amazon EC2 SSH key but do not specify a source security group when you create a managed node group,\nthen port 22 on the worker nodes is opened to the internet (0.0.0.0/0)",
            stability: "stable",
            summary:
              "The remote access (SSH) configuration to use with your node group.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 192,
          },
          name: "remoteAccess",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-eks.NodegroupRemoteAccess",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- private subnets",
            remarks:
              "By specifying the\nSubnetSelection, the selected subnets will automatically apply required tags i.e.\n`kubernetes.io/cluster/CLUSTER_NAME` with a value of `shared`, where `CLUSTER_NAME` is replaced with\nthe name of your cluster.",
            stability: "stable",
            summary:
              "The subnets to use for the Auto Scaling group that is created for your node group.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 108,
          },
          name: "subnets",
          optional: true,
          type: {
            fqn: "@aws-cdk/aws-ec2.SubnetSelection",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- None",
            remarks:
              "Each tag consists of\na key and an optional value, both of which you define. Node group tags do not propagate to any other resources\nassociated with the node group, such as the Amazon EC2 instances or subnets.",
            stability: "stable",
            summary:
              "The metadata to apply to the node group to assist with categorization and organization.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 200,
          },
          name: "tags",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "map",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.NodegroupProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "NodeGroup properties interface.",
      },
      fqn: "@aws-cdk/aws-eks.NodegroupProps",
      interfaces: ["@aws-cdk/aws-eks.NodegroupOptions"],
      kind: "interface",
      locationInModule: {
        filename: "lib/managed-nodegroup.ts",
        line: 218,
      },
      name: "NodegroupProps",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "Cluster resource.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 222,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.ICluster",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.NodegroupRemoteAccess": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        see: "https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-eks-nodegroup-remoteaccess.html",
        stability: "stable",
        summary:
          "The remote access (SSH) configuration to use with your node group.",
      },
      fqn: "@aws-cdk/aws-eks.NodegroupRemoteAccess",
      kind: "interface",
      locationInModule: {
        filename: "lib/managed-nodegroup.ts",
        line: 59,
      },
      name: "NodegroupRemoteAccess",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary:
              "The Amazon EC2 SSH key that provides access for SSH communication with the worker nodes in the managed node group.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 63,
          },
          name: "sshKeyName",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default:
              "- port 22 on the worker nodes is opened to the internet (0.0.0.0/0)",
            remarks:
              "If you specify an Amazon EC2 SSH\nkey but do not specify a source security group when you create a managed node group, then port 22 on the worker\nnodes is opened to the internet (0.0.0.0/0).",
            stability: "stable",
            summary:
              "The security groups that are allowed SSH access (port 22) to the worker nodes.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/managed-nodegroup.ts",
            line: 71,
          },
          name: "sourceSecurityGroups",
          optional: true,
          type: {
            collection: {
              elementtype: {
                fqn: "@aws-cdk/aws-ec2.ISecurityGroup",
              },
              kind: "array",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.OpenIdConnectProvider": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/aws-iam.OpenIdConnectProvider",
      docs: {
        custom: {
          resource: "AWS::CloudFormation::CustomResource",
        },
        remarks:
          "You use an IAM OIDC identity provider\nwhen you want to establish trust between an OIDC-compatible IdP and your AWS\naccount.\n\nThis implementation has default values for thumbprints and clientIds props\nthat will be compatible with the eks cluster",
        see: "https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles_providers_oidc.html",
        stability: "stable",
        summary:
          "IAM OIDC identity providers are entities in IAM that describe an external identity provider (IdP) service that supports the OpenID Connect (OIDC) standard, such as Google or Salesforce.",
      },
      fqn: "@aws-cdk/aws-eks.OpenIdConnectProvider",
      initializer: {
        docs: {
          stability: "stable",
          summary: "Defines an OpenID Connect provider.",
        },
        locationInModule: {
          filename: "lib/oidc-provider.ts",
          line: 43,
        },
        parameters: [
          {
            docs: {
              summary: "The definition scope.",
            },
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            docs: {
              summary: "Construct ID.",
            },
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            docs: {
              summary: "Initialization properties.",
            },
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.OpenIdConnectProviderProps",
            },
          },
        ],
      },
      kind: "class",
      locationInModule: {
        filename: "lib/oidc-provider.ts",
        line: 36,
      },
      name: "OpenIdConnectProvider",
    },
    "@aws-cdk/aws-eks.OpenIdConnectProviderProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Initialization properties for `OpenIdConnectProvider`.",
      },
      fqn: "@aws-cdk/aws-eks.OpenIdConnectProviderProps",
      kind: "interface",
      locationInModule: {
        filename: "lib/oidc-provider.ts",
        line: 7,
      },
      name: "OpenIdConnectProviderProps",
      properties: [
        {
          abstract: true,
          docs: {
            remarks:
              'The URL must begin with https:// and\nshould correspond to the iss claim in the provider\'s OpenID Connect ID\ntokens. Per the OIDC standard, path components are allowed but query\nparameters are not. Typically the URL consists of only a hostname, like\nhttps://server.example.org or https://example.com.\n\nYou can find your OIDC Issuer URL by:\naws eks describe-cluster --name %cluster_name% --query "cluster.identity.oidc.issuer" --output text',
            stability: "stable",
            summary: "The URL of the identity provider.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/oidc-provider.ts",
            line: 18,
          },
          name: "url",
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.PatchType": {
      assembly: "@aws-cdk/aws-eks",
      docs: {
        stability: "stable",
        summary: "Values for `kubectl patch` --type argument.",
      },
      fqn: "@aws-cdk/aws-eks.PatchType",
      kind: "enum",
      locationInModule: {
        filename: "lib/k8s-patch.ts",
        line: 54,
      },
      members: [
        {
          docs: {
            stability: "stable",
            summary: "JSON Patch, RFC 6902.",
          },
          name: "JSON",
        },
        {
          docs: {
            stability: "stable",
            summary: "JSON Merge patch.",
          },
          name: "MERGE",
        },
        {
          docs: {
            stability: "stable",
            summary: "Strategic merge patch.",
          },
          name: "STRATEGIC",
        },
      ],
      name: "PatchType",
    },
    "@aws-cdk/aws-eks.Selector": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Fargate profile selector.",
      },
      fqn: "@aws-cdk/aws-eks.Selector",
      kind: "interface",
      locationInModule: {
        filename: "lib/fargate-profile.ts",
        line: 77,
      },
      name: "Selector",
      properties: [
        {
          abstract: true,
          docs: {
            remarks:
              "You must specify a namespace for a selector. The selector only matches pods\nthat are created in this namespace, but you can create multiple selectors\nto target multiple namespaces.",
            stability: "stable",
            summary: "The Kubernetes namespace that the selector should match.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 85,
          },
          name: "namespace",
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "- all pods within the namespace will be selected.",
            remarks:
              "A pod must contain\nall of the labels that are specified in the selector for it to be\nconsidered a match.",
            stability: "stable",
            summary: "The Kubernetes labels that the selector should match.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/fargate-profile.ts",
            line: 94,
          },
          name: "labels",
          optional: true,
          type: {
            collection: {
              elementtype: {
                primitive: "string",
              },
              kind: "map",
            },
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.ServiceAccount": {
      assembly: "@aws-cdk/aws-eks",
      base: "@aws-cdk/core.Construct",
      docs: {
        stability: "stable",
        summary: "Service Account.",
      },
      fqn: "@aws-cdk/aws-eks.ServiceAccount",
      initializer: {
        docs: {
          stability: "stable",
        },
        locationInModule: {
          filename: "lib/service-account.ts",
          line: 61,
        },
        parameters: [
          {
            name: "scope",
            type: {
              fqn: "constructs.Construct",
            },
          },
          {
            name: "id",
            type: {
              primitive: "string",
            },
          },
          {
            name: "props",
            type: {
              fqn: "@aws-cdk/aws-eks.ServiceAccountProps",
            },
          },
        ],
      },
      interfaces: ["@aws-cdk/aws-iam.IPrincipal"],
      kind: "class",
      locationInModule: {
        filename: "lib/service-account.ts",
        line: 41,
      },
      methods: [
        {
          docs: {
            deprecated: "use `addToPrincipalPolicy()`",
            stability: "deprecated",
            summary: "(deprecated) Add to the policy of this principal.",
          },
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 113,
          },
          name: "addToPolicy",
          overrides: "@aws-cdk/aws-iam.IPrincipal",
          parameters: [
            {
              name: "statement",
              type: {
                fqn: "@aws-cdk/aws-iam.PolicyStatement",
              },
            },
          ],
          returns: {
            type: {
              primitive: "boolean",
            },
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "Add to the policy of this principal.",
          },
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 117,
          },
          name: "addToPrincipalPolicy",
          overrides: "@aws-cdk/aws-iam.IPrincipal",
          parameters: [
            {
              name: "statement",
              type: {
                fqn: "@aws-cdk/aws-iam.PolicyStatement",
              },
            },
          ],
          returns: {
            type: {
              fqn: "@aws-cdk/aws-iam.AddToPrincipalPolicyResult",
            },
          },
        },
      ],
      name: "ServiceAccount",
      properties: [
        {
          docs: {
            stability: "stable",
            summary:
              "When this Principal is used in an AssumeRole policy, the action to use.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 47,
          },
          name: "assumeRoleAction",
          overrides: "@aws-cdk/aws-iam.IPrincipal",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "The principal to grant permissions to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 48,
          },
          name: "grantPrincipal",
          overrides: "@aws-cdk/aws-iam.IGrantable",
          type: {
            fqn: "@aws-cdk/aws-iam.IPrincipal",
          },
        },
        {
          docs: {
            stability: "stable",
            summary:
              "Return the policy fragment that identifies this principal in a Policy.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 49,
          },
          name: "policyFragment",
          overrides: "@aws-cdk/aws-iam.IPrincipal",
          type: {
            fqn: "@aws-cdk/aws-iam.PrincipalPolicyFragment",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "The role which is linked to the service account.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 45,
          },
          name: "role",
          type: {
            fqn: "@aws-cdk/aws-iam.IRole",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "The name of the service account.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 54,
          },
          name: "serviceAccountName",
          type: {
            primitive: "string",
          },
        },
        {
          docs: {
            stability: "stable",
            summary: "The namespace where the service account is located in.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 59,
          },
          name: "serviceAccountNamespace",
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.ServiceAccountOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Options for `ServiceAccount`.",
      },
      fqn: "@aws-cdk/aws-eks.ServiceAccountOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/service-account.ts",
        line: 14,
      },
      name: "ServiceAccountOptions",
      properties: [
        {
          abstract: true,
          docs: {
            default:
              "- If no name is given, it will use the id of the resource.",
            stability: "stable",
            summary: "The name of the service account.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 19,
          },
          name: "name",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: '"default"',
            stability: "stable",
            summary: "The namespace of the service account.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 25,
          },
          name: "namespace",
          optional: true,
          type: {
            primitive: "string",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.ServiceAccountProps": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Properties for defining service accounts.",
      },
      fqn: "@aws-cdk/aws-eks.ServiceAccountProps",
      interfaces: ["@aws-cdk/aws-eks.ServiceAccountOptions"],
      kind: "interface",
      locationInModule: {
        filename: "lib/service-account.ts",
        line: 31,
      },
      name: "ServiceAccountProps",
      properties: [
        {
          abstract: true,
          docs: {
            stability: "stable",
            summary: "The cluster to apply the patch to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/service-account.ts",
            line: 35,
          },
          name: "cluster",
          type: {
            fqn: "@aws-cdk/aws-eks.ICluster",
          },
        },
      ],
    },
    "@aws-cdk/aws-eks.ServiceLoadBalancerAddressOptions": {
      assembly: "@aws-cdk/aws-eks",
      datatype: true,
      docs: {
        stability: "stable",
        summary: "Options for fetching a ServiceLoadBalancerAddress.",
      },
      fqn: "@aws-cdk/aws-eks.ServiceLoadBalancerAddressOptions",
      kind: "interface",
      locationInModule: {
        filename: "lib/cluster.ts",
        line: 726,
      },
      name: "ServiceLoadBalancerAddressOptions",
      properties: [
        {
          abstract: true,
          docs: {
            default: "'default'",
            stability: "stable",
            summary: "The namespace the service belongs to.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 740,
          },
          name: "namespace",
          optional: true,
          type: {
            primitive: "string",
          },
        },
        {
          abstract: true,
          docs: {
            default: "Duration.minutes(5)",
            stability: "stable",
            summary: "Timeout for waiting on the load balancer address.",
          },
          immutable: true,
          locationInModule: {
            filename: "lib/cluster.ts",
            line: 733,
          },
          name: "timeout",
          optional: true,
          type: {
            fqn: "@aws-cdk/core.Duration",
          },
        },
      ],
    },
  },
  version: "0.0.0",
  fingerprint: "J8dtAmcCSeDw4snNB6zh6v0/RuLTUXZQnc7/+4wUPXQ=",
};

interface PackageDetailsProps {
  name: string;
  scope?: string;
  version: string;
}

export default function PackageDetails({
  name,
  scope,
  version,
}: PackageDetailsProps) {
  const ts = new reflect.TypeSystem();
  ts.addAssembly(new reflect.Assembly(ts, spec as jsii.Assembly));
  return (
    <Grid celled>
      <Grid.Row>
        <Grid.Column>
          {scope}/{name}@{version}
          {ts.classes[0].fqn}
          {ts.classes[1].fqn}
          {ts.classes[2].fqn}
        </Grid.Column>
        <Grid.Column>Getting Started</Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column>Navigation</Grid.Column>
        <Grid.Column>Content</Grid.Column>
        <Grid.Column>Metadata</Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
