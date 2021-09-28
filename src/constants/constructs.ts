export enum CDKType {
  awscdk = "aws-cdk",
  cdktf = "cdktf",
  cdk8s = "cdk8s",
}

export const CDKTYPE_NAME_MAP = {
  [CDKType.awscdk]: "AWS CDK",
  [CDKType.cdktf]: "CDK for Terraform",
  [CDKType.cdk8s]: "CDK for Kubernetes",
};
