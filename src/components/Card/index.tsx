import { Box, PropsOf } from "@chakra-ui/react";

/**
 * Implements a <Box /> with simple card styles.
 */
export function Card(props: PropsOf<typeof Box>) {
  return <Box bg="white" borderRadius="md" boxShadow="base" p={2} {...props} />;
}
