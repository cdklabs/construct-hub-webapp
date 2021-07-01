import { Story } from "@storybook/react";
import { OperatorArea, OperatorAreaProps } from "./OperatorArea";

export default {
  title: "Views / Package / OperatorArea",
  component: OperatorArea,
};

export const Primary: Story<OperatorAreaProps> = ({ assembly, metadata }) => {
  return <OperatorArea assembly={assembly} metadata={metadata} />;
};

Primary.args = {
  assembly: {
    author: {
      name: "Amazon Web Services",
    },
    repository: {
      url: "https://github.com/awslabs/aws-cdk.git",
    },
  } as any,
  metadata: {
    date: new Date().toDateString(),
    links: {
      npm: "https://www.npmjs.com/package/@aws-cdk/aws-eks/v/1.6.1",
    },
  },
};
