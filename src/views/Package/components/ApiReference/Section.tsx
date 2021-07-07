import { Box, Divider } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
}

export const Section: FunctionComponent<SectionProps> = ({ children }) => (
  <Box>
    {children}
    <Divider />
  </Box>
);
