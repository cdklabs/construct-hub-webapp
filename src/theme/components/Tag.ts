import { theme } from "@chakra-ui/react";

const createVariant =
  (
    variant: (props: Record<string, any>) => {
      container: { [key: string]: any };
    },
    overrides: Record<string, any>
  ) =>
  (props: Record<string, any>) => {
    const varBase = variant(props);
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
