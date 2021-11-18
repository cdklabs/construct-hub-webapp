export const KEYWORD_IGNORE_LIST = new Set(
  [
    "aws-cdk",
    "aws",
    "awscdk",
    "cdk-construct",
    "cdk",
    "cdktf",
    "cdk8s",
    "construct",
    "constructs",
  ].map((x) => x.toLocaleLowerCase())
);
