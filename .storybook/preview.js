import { withPerformance } from "storybook-addon-performance";
import { Theme } from "../src/contexts/Theme";

export const decorators = [
  withPerformance,
  (Story) => (
    <Theme>
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
