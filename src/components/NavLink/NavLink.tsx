import { Link as ChakraLink, PropsOf } from "@chakra-ui/react";
import Link from "next/link";
import { FunctionComponent } from "react";

export type NavLinkProps = PropsOf<typeof ChakraLink> & {
  href: string;
};

export const NavLink: FunctionComponent<NavLinkProps> = ({
  children,
  href,
  ...props
}) => {
  return (
    <Link href={href} passHref>
      <ChakraLink {...props}>{children}</ChakraLink>
    </Link>
  );
};
