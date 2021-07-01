import { Box, PropsOf } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

/**
 * Implements a <Box /> with simple card styles.
 */
export const Card: FunctionComponent<PropsOf<typeof Box>> = (props) => {
  return <Box bg="white" borderRadius="md" boxShadow="base" p={2} {...props} />;
};
