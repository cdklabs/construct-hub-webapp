import {
  forwardRef,
  Image,
  ImageProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import type { Metadata } from "../../api/package/metadata";
import { CDKTYPE_RENDER_MAP } from "../../constants/constructs";

type WithMetadata<T> = T & { metadata?: Metadata };

export const CDKTypeIcon = forwardRef<WithMetadata<ImageProps>, "img">(
  ({ metadata, ...props }, ref) => {
    const name = metadata?.constructFramework?.name;

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

export const CDKTypeText = forwardRef<WithMetadata<TextProps>, "p">(
  ({ metadata, ...props }, ref) => {
    const name = metadata?.constructFramework?.name;
    const majorVersion = metadata?.constructFramework?.majorVersion;

    if (!name) return null;

    return (
      <Text ref={ref} {...props}>
        {CDKTYPE_RENDER_MAP[name].name}
        {majorVersion !== undefined ? ` v${majorVersion}` : ""}
      </Text>
    );
  }
);
