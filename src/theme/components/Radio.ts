import { radioAnatomy as parts } from "@chakra-ui/anatomy";
import {
  PartsStyleFunction,
  PartsStyleObject,
  SystemStyleFunction,
} from "@chakra-ui/theme-tools";
import { Checkbox } from "./Checkbox";

const baseStyleControl: SystemStyleFunction = (props) => {
  const { control = {} } = Checkbox.baseStyle(props) as any;

  return {
    ...control,
    borderRadius: "full",
    pos: "relative",
    _checked: {
      ...control._checked,
      _before: {
        content: `""`,
        display: "inline-block",
        pos: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        w: "50%",
        h: "50%",
        borderRadius: "50%",
        bg: "currentColor",
      },
    },
  };
};

const baseStyle: PartsStyleFunction<typeof parts> = (props) => ({
  label: Checkbox.baseStyle(props).label,
  control: baseStyleControl(props),
});

const sizes: Record<string, PartsStyleObject<typeof parts>> = {
  sm: {
    control: { h: 3, w: 3 },
    label: { fontSize: "sm" },
  },
  base: {
    control: { h: 3.5, w: 3.5 },
    label: { fontSize: "sm" },
  },
  md: {
    control: { h: 4, w: 4 },
    label: { fontSize: "md" },
  },
  lg: {
    control: { h: 5, w: 5 },
    label: { fontSize: "lg" },
  },
};

const defaultProps = {
  size: "base",
  colorScheme: "blue",
};

export const Radio = {
  parts: parts.keys,
  baseStyle,
  sizes,
  defaultProps,
};
