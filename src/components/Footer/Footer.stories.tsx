import type { Story } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Footer, FooterProps } from "./Footer";

export default {
  title: "Components / Footer",
  component: Footer,
};

export const Primary: Story<FooterProps> = () => (
  <MemoryRouter>
    <Footer />
  </MemoryRouter>
);
