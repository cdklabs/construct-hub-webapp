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

export const CDKTYPE_RENDER_MAP = {
  [CDKType.awscdk]: {
    name: CDKTYPE_NAME_MAP[CDKType.awscdk],
    imgsrc: "/assets/awscdk-icon.png",
  },
  [CDKType.cdk8s]: {
    name: CDKTYPE_NAME_MAP[CDKType.cdk8s],
    imgsrc: "/assets/cdk8s-icon.png",
  },
  [CDKType.cdktf]: {
    name: CDKTYPE_NAME_MAP[CDKType.cdktf],
    imgsrc: "/assets/cdktf-icon.png",
  },
};
