import type { Story } from "@storybook/react";
import { Footer, FooterProps } from "./Footer";

export default {
  title: "Components / Footer",
  component: Footer,
};

export const Primary: Story<FooterProps> = () => <Footer />;
