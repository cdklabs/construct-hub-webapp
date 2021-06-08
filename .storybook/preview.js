import { withPerformance } from "storybook-addon-performance";
import { Theme } from "../src/Theme";
import { CSSReset } from "@chakra-ui/react";

export const decorators = [
  withPerformance,
  (Story) => (
    <Theme>
      <CSSReset />
      <Story />
    </Theme>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
