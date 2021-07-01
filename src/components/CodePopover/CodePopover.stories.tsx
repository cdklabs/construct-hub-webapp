import { Center } from "@chakra-ui/react";
import type { Story } from "@storybook/react";
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
  code: `
<div class="container">
  <h1>This is a header</h1>
  <h2>This is a smaller header</h2>
  <h3>This is a really, really, really long header</h3>
</div>
  `,
  header: "HTML",
};
