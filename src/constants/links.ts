import type { IMenuItems } from "../components/NavPopover";

export const CONSTRUCT_HUB_REPO_URL =
  "https://github.com/cdklabs/construct-hub";

export const GETTING_STARTED: IMenuItems = [
  { display: "FAQ", isNavLink: true, url: "/faq" },
  {
    display: "Construct Hub on GitHub",
    url: CONSTRUCT_HUB_REPO_URL,
  },
  {
    display: "Issues on GitHub",
    url: `${CONSTRUCT_HUB_REPO_URL}/issues`,
  },
];

export const DOCUMENTATION: IMenuItems = [
  {
    display: "AWS CDK",
    links: [
      { display: "Home", url: "https://aws.amazon.com/cdk/" },
      {
        display: "Getting Started",
        url: "https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html",
      },
      { display: "Workshop", url: "https://cdkworkshop.com/" },
      {
        display: "Best Practices",
        url: "https://aws.amazon.com/blogs/devops/best-practices-for-developing-cloud-applications-with-aws-cdk",
      },
    ],
  },
  {
    display: "CDK for Terraform",
    links: [
      {
        display: "Getting Started",
        url: "https://learn.hashicorp.com/tutorials/terraform/cdktf",
      },
      {
        display: "Tutorials",
        url: "https://learn.hashicorp.com/collections/terraform/cdktf",
      },
    ],
  },
  {
    display: "CDK for Kubernetes",
    links: [
      { display: "Home", url: "https://cdk8s.io" },
      {
        display: "Getting Started",
        url: "https://cdk8s.io/docs/latest/getting-started",
      },
      { display: "Documentation", url: "https://cdk8s.io/docs/latest" },
      {
        display: "API Reference",
        url: "https://cdk8s.io/docs/latest/reference/index.html",
      },
    ],
  },
  {
    display: "Community",
    links: [
      {
        display: "Slack",
        url: "https://join.slack.com/t/cdk-dev/shared_invite/zt-mso6p56d-qJp7SOTBvMaQuDrx7R2wHg",
      },
      { display: "Community Hub", url: "https://cdk.dev" },
    ],
  },
];
