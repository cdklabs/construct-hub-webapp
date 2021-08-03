import { Link as ChakraLink, LinkProps, forwardRef } from "@chakra-ui/react";
import Link from "next/link";

export interface NavLinkProps extends LinkProps {
  href: string;
  shallow?: boolean;
}

/**
 * A Link component intended for client-side navigation. Do not use this
 * for pages that rely on dynamic data
 */
export const NavLink = forwardRef<NavLinkProps, "a">(
  ({ children, href, shallow, ...props }, ref) => {
    return (
      <Link href={href} passHref shallow={shallow}>
        <ChakraLink ref={ref} {...props}>
          {children}
        </ChakraLink>
      </Link>
    );
  }
);
