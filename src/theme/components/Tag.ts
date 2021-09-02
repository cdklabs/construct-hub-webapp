import type { tagAnatomy } from "@chakra-ui/anatomy";
import { theme } from "@chakra-ui/react";
import type {
  PartsStyleInterpolation,
  StyleFunctionProps,
} from "@chakra-ui/theme-tools";

const createVariant =
  (
    variant: PartsStyleInterpolation<typeof tagAnatomy>,
    overrides: Record<string, any>
  ) =>
  (props: StyleFunctionProps) => {
    const varBase = typeof variant === "function" ? variant(props) : variant;
    return {
      ...varBase,
      container: {
        ...varBase.container,
        ...overrides,
      },
    };
  };

const {
  components: { Tag: base },
} = theme;

export const Tag = {
  ...base,
  baseStyle: {
    container: {
      fontWeight: "normal",
    },
  },
  variants: {
    ...base.variants,
    subtle: createVariant(base.variants.subtle, {
      background: "#F2F2F2",
      color: "blue.800",
    }),
    official: createVariant(base.variants.subtle, {
      background: "rgba(33, 150, 83, 0.1)",
      color: "#219653",
    }),
  },
};
