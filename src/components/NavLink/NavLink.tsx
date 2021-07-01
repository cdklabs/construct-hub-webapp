import { Link as ChakraLink, PropsOf } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { Link as RouterLink } from "react-router-dom";

export type NavLinkProps = PropsOf<typeof ChakraLink> &
  PropsOf<typeof RouterLink>;

export const NavLink: FunctionComponent<NavLinkProps> = (props) => {
  return <ChakraLink as={RouterLink} {...props} />;
};
