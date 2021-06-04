import { Story } from "@storybook/react";
import { PackageHeader, PackageHeaderProps } from "../PackageHeader";

export default {
  title: "Package Header",
  component: PackageHeader,
};

const Template: Story<PackageHeaderProps> = ({ title, description, tags }) => (
  <PackageHeader description={description} tags={tags} title={title} />
);

export const Primary = Template.bind({});
Primary.args = {
  title: "AWS CDK Lib",
  description: "aws cdk construct library",
  tags: [],
};
