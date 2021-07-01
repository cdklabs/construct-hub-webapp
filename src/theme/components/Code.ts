import { theme } from "@chakra-ui/react";

const {
  components: { Code: base },
} = theme;

export const Code = {
  ...base,
  variants: {
    ...base.variants,
    "code-block": {
      ...base.variants.subtle,
      display: "block",
      whiteSpace: "pre",
    },
  },
};
