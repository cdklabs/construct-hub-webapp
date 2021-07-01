export interface ILink {
  display: string;
  url: string;
}

export interface IGroup {
  display: string;
  links: ILink[];
}

export const isIGroup = (item: ILink | IGroup) => {
  return "links" in item;
};

export type MenuContent = (ILink | IGroup)[];

export const GETTING_STARTED: MenuContent = [
  {
    display: "CDK",
    links: [
      { display: "Quick Start", url: "https://cdkworkshop.com/" },
      {
        display: "Developer Guide",
        url: "https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html",
      },
      {
        display: "CLI",
        url: "https://docs.aws.amazon.com/cdk/latest/guide/cli.html",
      },
      {
        display: "Best Practices",
        url: "https://aws.amazon.com/blogs/devops/best-practices-for-developing-cloud-applications-with-aws-cdk/",
      },
      { display: "Slack", url: "https://cdk.dev/" },
    ],
  },
  {
    display: "CDK8s",
    links: [{ display: "Getting Started", url: "https://cdk8s.io/" }],
  },
  {
    display: "CDKtf",
    links: [
      {
        display: "Getting Started",
        url: "https://learn.hashicorp.com/tutorials/terraform/cdktf",
      },
    ],
  },
];
