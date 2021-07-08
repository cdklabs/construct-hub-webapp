import { Box, HTMLChakraProps, forwardRef, Image } from "@chakra-ui/react";

export interface PictureProps extends HTMLChakraProps<"img"> {
  alt: string;
  src: string;
  sources?: {
    media?: string;
    srcSet: string;
  }[];
}

export const Picture = forwardRef<PictureProps, "picture">(
  ({ sources, ...props }, ref) => (
    <Box as="picture" ref={ref}>
      {sources?.map((source, idx) => (
        <source key={idx} media={source.media} srcSet={source.srcSet} />
      ))}
      <Image {...props} />
    </Box>
  )
);
