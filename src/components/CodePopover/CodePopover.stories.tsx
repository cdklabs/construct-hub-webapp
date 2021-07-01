import { Center } from "@chakra-ui/react";
import type { Story } from "@storybook/react";
import { LANGUAGE_NAME_MAP } from "../../constants/languages";
import { CodePopover, CodePopoverProps } from "./CodePopover";
import { CodePopoverTrigger } from "./CodePopoverTrigger";

export default {
  title: "Components / CodePopover",
  component: CodePopover,
};

export const Primary: Story<CodePopoverProps> = ({ header, code }) => (
  <Center>
    <CodePopover
      code={code}
      header={header}
      trigger={<CodePopoverTrigger>Show Code</CodePopoverTrigger>}
    />
  </Center>
);

Primary.args = {
  code: "npm install @aws-cdk/core",
  header: LANGUAGE_NAME_MAP.ts,
};
