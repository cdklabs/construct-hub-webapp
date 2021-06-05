import { Story } from "@storybook/react";
import { PackageHeader, PackageHeaderProps } from "../components/PackageHeader";

export default {
  title: "Package Header",
  component: PackageHeader,
};

const Template: Story<PackageHeaderProps> = (args) => (
  <PackageHeader {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: "AWS CDK Lib",
  description: "aws cdk construct library",
  tags: [],
};
