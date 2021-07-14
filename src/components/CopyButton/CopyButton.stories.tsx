import { Story } from "@storybook/react";
import { CopyButton } from "./CopyButton";

export default {
  title: "Components / CopyButton",
  component: CopyButton,
};

export const Primary: Story<{ value: string }> = ({ value }) => (
  <CopyButton value={value} />
);

Primary.args = {
  value: "The quick brown fox jumped over the lazy dog.",
};
