import { Image, ImageProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";

export const Img: FunctionComponent<ImageProps> = (props) => (
  <Image display="inline-block" {...props} />
);
