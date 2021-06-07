import { Link as ChakraLink, PropsOf } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

export type NavLinkProps = PropsOf<typeof ChakraLink> &
  PropsOf<typeof RouterLink>;

export function NavLink(props: NavLinkProps) {
  return <ChakraLink as={RouterLink} {...props} />;
}
