import type { NavPopoverItems } from "../components/NavPopover";

export const COMMUNITY: NavPopoverItems = [
  {
    display: "Slack",
    url: "https://join.slack.com/t/cdk-dev/shared_invite/zt-mso6p56d-qJp7SOTBvMaQuDrx7R2wHg",
  },
  { display: "Community Hub", url: "https://cdk.dev" },
];

export const GETTING_STARTED: NavPopoverItems = [
  {
    display: "AWS CDK",
    links: [
      { display: "Workshop", url: "https://cdkworkshop.com/" },
      {
        display: "Getting Started",
        url: "https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html",
      },
      {
        display: "Best Practices",
        url: "https://aws.amazon.com/blogs/devops/best-practices-for-developing-cloud-applications-with-aws-cdk/",
      },
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
