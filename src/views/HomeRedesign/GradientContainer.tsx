import { Box, BoxProps, forwardRef, keyframes } from "@chakra-ui/react";

const gradient = "linear-gradient(274.2deg, #143870 20.69%, #1F50A1 84.17%)";

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
    bg={gradient}
    bgSize="200% 200%"
    ref={ref}
    {...props}
  />
));
