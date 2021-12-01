import type { tagAnatomy } from "@chakra-ui/anatomy";
import { theme } from "@chakra-ui/react";
import {
  PartsStyleInterpolation,
  StyleFunctionProps,
  transparentize,
} from "@chakra-ui/theme-tools";
import { PackageTagConfig } from "../../api/config";

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

export const makeTag = (config: PackageTagConfig[]) => {
  const customVariants = config.reduce((accum, { keyword }) => {
    return keyword?.color
      ? {
          ...accum,
          [keyword.color]: createVariant(base.variants.subtle, {
            background: transparentize(keyword.color, 0.1),
            color: keyword.color,
          }),
        }
      : accum;
  }, {});
  return {
    ...base,
    baseStyle: {
      container: {
        border: "base",
        fontWeight: "normal",
      },
    },
    variants: {
      ...base.variants,
      subtle: createVariant(base.variants.subtle, {
        background: "#F2F2F2",
        color: "blue.800",
      }),
      ...customVariants,
    },
  };
};
