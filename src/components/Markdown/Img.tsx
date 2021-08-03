import { Image, ImageProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export const Img: FunctionComponent<ImageProps> = ({ alt, ...props }) => (
  <Image alt={alt} display="inline-block" {...props} />
);
