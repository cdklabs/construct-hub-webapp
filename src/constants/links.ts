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
  {
    display: "Community",
    links: [
      {
        display: "Slack",
        url: "https://join.slack.com/t/cdk-dev/shared_invite/zt-1mvwihbtu-DKhqC~KdwbO4rY837rAQRg",
      },
    ],
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
        url: "https://docs.aws.amazon.com/cdk/latest/guide/best-practices.html",
      },
    ],
  },
  {
    display: "CDK for Terraform",
    links: [
      {
        display: "Getting Started",
        url: "https://developer.hashicorp.com/terraform/cdktf",
      },
      {
        display: "Tutorials",
        url: "https://developer.hashicorp.com/terraform/tutorials/cdktf",
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
    links: [{ display: "Community Hub", url: "https://cdk.dev" }],
  },
];
