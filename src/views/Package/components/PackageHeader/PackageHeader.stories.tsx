import { Story } from "@storybook/react";
import { PackageHeader, PackageHeaderProps } from "./PackageHeader";

export default {
  title: "Views / Package / Package Header",
  component: PackageHeader,
};

const Template: Story<PackageHeaderProps> = ({
  title,
  description,
  tags,
  version,
}) => (
  <PackageHeader
    description={description}
    tags={tags}
    title={title}
    version={version}
  />
);

export const Primary = Template.bind({});
Primary.args = {
  title: "AWS CDK Lib",
  description: "aws cdk construct library",
  tags: [],
  version: "0.1.1",
};
