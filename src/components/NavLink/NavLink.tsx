import { Link as ChakraLink, PropsOf, forwardRef } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export type NavLinkProps = PropsOf<typeof ChakraLink> &
  PropsOf<typeof RouterLink>;

export const NavLink = forwardRef<NavLinkProps, "a">((props, ref) => (
  <ChakraLink as={RouterLink} ref={ref} {...props} />
));
