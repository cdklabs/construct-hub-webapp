import { Box, BoxProps, forwardRef } from "@chakra-ui/react";

export interface CardProps extends BoxProps {}

/**
 * Implements a <Box /> with simple card styles.
 */
export const Card = forwardRef<CardProps, "div">((props, ref) => {
  return (
    <Box
      bg="white"
      border="1px solid"
      borderColor="blue.100"
      borderRadius="md"
      boxShadow="md"
      p={2}
      ref={ref}
      {...props}
    />
  );
});

Card.displayName = "Card";
