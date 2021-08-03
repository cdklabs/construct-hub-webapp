import type { Story } from "@storybook/react";
import { Header } from "./Header";

export default {
  title: "Components / Header",
  component: Header,
};

export const Primary: Story = () => <Header />;

export const WithSearch: Story = () => <Header />;
