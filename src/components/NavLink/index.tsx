import { Link as ChakraLink } from "@chakra-ui/react";
import type { ReactChild } from "react";
import { Link as RouterLink } from "react-router-dom";

// These can be expanded on as needed
export interface NavLinkProps {
  children: ReactChild;
  to: string;
}

export function NavLink({ children, to }: NavLinkProps) {
  return (
    <ChakraLink as={RouterLink} to={to}>
      {children}
    </ChakraLink>
  );
}
