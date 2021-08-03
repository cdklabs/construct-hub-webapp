import { Box, HTMLChakraProps, forwardRef, Image } from "@chakra-ui/react";

export interface PictureProps extends HTMLChakraProps<"img"> {
  alt: string;
  src: string;
  sources?: {
    media?: string;
    srcSet: string;
  }[];
}

export const Picture = forwardRef<PictureProps, "img">(
  ({ alt, sources, ...props }, ref) => (
    <Box as="picture">
      {sources?.map((source, idx) => (
        <source key={idx} media={source.media} srcSet={source.srcSet} />
      ))}
      <Image alt={alt} ref={ref} {...props} />
    </Box>
  )
);

Picture.displayName = "Picture";
