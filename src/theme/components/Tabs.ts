import { tabsAnatomy as parts } from "@chakra-ui/anatomy";
import { theme } from "@chakra-ui/react";
import {
  mode,
  PartsStyleFunction,
  PartsStyleInterpolation,
} from "@chakra-ui/theme-tools";

const baseTheme = theme.components.Tabs;

const variantLine: PartsStyleFunction<typeof parts> = (props) => {
  const { colorScheme: c, orientation } = props;
  const isVertical = orientation === "vertical";
  const borderProp =
    orientation === "vertical" ? "borderStart" : "borderBottom";
  const marginProp = isVertical ? "marginStart" : "marginBottom";

  return {
    tablist: {
      [borderProp]: "none",
      borderColor: "inherit",
    },
    tab: {
      [borderProp]: "4px solid",
      borderColor: "transparent",
      [marginProp]: "0",
      _selected: {
        color: mode(`${c}.500`, `${c}.300`)(props),
        borderColor: "currentColor",
        fontWeight: "semibold",
      },
      _active: {
        bg: mode("gray.200", "whiteAlpha.300")(props),
      },
      _disabled: {
        opacity: 0.4,
        cursor: "not-allowed",
      },
    },
  };
};

const variants: Record<string, PartsStyleInterpolation<typeof parts>> = {
  ...baseTheme.variants,
  line: variantLine,
};

export const Tabs: typeof baseTheme = {
  ...baseTheme,
  variants,
};
