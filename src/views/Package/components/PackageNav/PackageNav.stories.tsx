import { Story } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { PackageNav, PackageNavProps, PackageNavItem } from "./PackageNav";

export default {
  title: "Views / Package / Package Navigation",
  component: PackageNav,
  decorators: [
    (ComponentStory: any) => (
      <MemoryRouter>
        <ComponentStory />
      </MemoryRouter>
    ),
  ],
};

const Template: Story<PackageNavProps> = (props) => <PackageNav {...props} />;

const makeTestItems = (
  length: number,
  level: number,
  isActive = false,
  currentLevel: number = 1
): PackageNavItem[] => {
  return [...Array(length)].map((_, i) => ({
    title: `item${currentLevel}-${i + 1}`,
    path: `#${currentLevel}-${i + 1}`,
    isActive,
    level,
    children:
      currentLevel === level
        ? []
        : makeTestItems(length, level, isActive, currentLevel + 1),
  }));
};

export const Primary = Template.bind({});
Primary.args = {
  items: makeTestItems(3, 2),
};

export const Active = Template.bind({
  decorators: [
    (ComponentStory: any) => (
      <MemoryRouter>
        <ComponentStory />
      </MemoryRouter>
    ),
  ],
});

Active.args = {
  items: makeTestItems(3, 2).map((x) => ({ ...x, isActive: true })),
};
