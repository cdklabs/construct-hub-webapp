import { withPerformance } from "storybook-addon-performance";
import { RouterContext } from "next/dist/shared/lib/router-context"; // next 11.2
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
  backgrounds: {
    default: "primary",
    values: [
      { name: "primary", value: "#F7FAFC" },
    ],
  },
  nextRouter: {
    Provider: RouterContext.Provider,
  }
};
