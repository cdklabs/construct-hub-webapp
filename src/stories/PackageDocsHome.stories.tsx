import { Story } from "@storybook/react";
import PackageDocsHome, { PackageDocsHomeProps } from "../PackageDocsHome";

export default {
  title: "PackageDocsHome",
  component: PackageDocsHome,
};

const Template: Story<PackageDocsHomeProps> = (args) => (
  <PackageDocsHome {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  name: "aws-cdk-lib",
  version: "1.0.0",
};
