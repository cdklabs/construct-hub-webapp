import type { Story } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { Header } from "./Header";

export default {
  title: "Components / Header",
  component: Header,
};

export const Primary: Story = () => (
  <MemoryRouter>
    <Header />
  </MemoryRouter>
);

export const WithSearch: Story = () => (
  <MemoryRouter initialEntries={["/packages"]}>
    <Header />
  </MemoryRouter>
);
