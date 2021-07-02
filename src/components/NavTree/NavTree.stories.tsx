import { Story } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { NavTree, NavTreeProps } from "./NavTree";

export default {
  title: "Components / NavTree",
  component: NavTree,
};

export const Primary: Story<NavTreeProps> = ({ items }) => (
  <MemoryRouter initialEntries={["/#contents-item-1"]}>
    <NavTree items={items} />
  </MemoryRouter>
);

Primary.args = {
  items: [
    {
      display: "README",
      url: "#readme",
      items: [
        {
          display: "Header",
          url: "#header",
          items: [
            {
              display: "Subheader",
              url: "#subheader",
            },
          ],
        },
        {
          display: "Contents",
          url: "#contents",
          items: [
            {
              display: "Item 1",
              url: "#contents-item-1",
            },
            {
              display: "Item 2",
              url: "#contents-item-2",
            },
            {
              display: "Item 3",
              url: "#contents-item-3",
              items: [
                {
                  display: "Child 1",
                  url: "#contents-item-3-child-1",
                },
                {
                  display: "Child 2",
                  url: "#contents-item-3-child-2",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      display: "Api Reference",
      url: "#api-reference",
      items: [
        {
          display: "Header",
          url: "#api-reference-header",
        },
        {
          display: "Contents",
          url: "#api-reference-contents",
        },
      ],
    },
  ],
};
