import {
  forwardRef,
  Image,
  ImageProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { CDKType, CDKTYPE_RENDER_MAP } from "../../constants/constructs";

interface CDKTypeIconProps extends ImageProps {
  name?: CDKType;
}

export const CDKTypeIcon = forwardRef<CDKTypeIconProps, "img">(
  ({ name, ...props }, ref) => {
    if (!name) return null;

    return (
      <Image
        alt={`${CDKTYPE_RENDER_MAP[name].name} Logo`}
        h={5}
        ref={ref}
        src={CDKTYPE_RENDER_MAP[name].imgsrc}
        w={5}
        {...props}
      />
    );
  }
);

interface CDKTypeTextProps extends TextProps {
  name?: CDKType;
  majorVersion?: number;
}

export const CDKTypeText = forwardRef<CDKTypeTextProps, "p">(
  ({ name, majorVersion, ...props }, ref) => {
    if (!name) return null;

    return (
      <Text ref={ref} {...props}>
        {CDKTYPE_RENDER_MAP[name].name}
        {majorVersion !== undefined ? ` v${majorVersion}` : ""}
      </Text>
    );
  }
);
