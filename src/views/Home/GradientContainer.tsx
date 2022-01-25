import { Box, BoxProps, forwardRef, keyframes } from "@chakra-ui/react";

const animation = keyframes`
  0% {
    background-position:0% 50%;
  }

  50% {
    background-position:100% 50%;
  }

  100% {
    background-position:0% 50%;
  }
`;

export const GradientContainer = forwardRef<BoxProps, "div">((props, ref) => (
  <Box
    animation={`${animation} 10s linear infinite`}
    bgGradient="linear(to-bl, brand.900, brand.500)"
    bgSize="200% 200%"
    ref={ref}
    {...props}
  />
));
