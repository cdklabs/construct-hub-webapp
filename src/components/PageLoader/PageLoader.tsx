import { Center, Spinner } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export const PageLoader: FunctionComponent = () => (
  <Center>
    <Spinner size="xl" />
  </Center>
);
