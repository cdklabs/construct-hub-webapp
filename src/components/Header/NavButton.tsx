import { HamburgerIcon } from "@chakra-ui/icons";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { MobileNav } from "./MobileNav";

export const NavButton: FunctionComponent = () => {
  const nav = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Navigation Menu"
        borderRadius="md"
        display={{ md: "none" }}
        icon={<HamburgerIcon />}
        onClick={nav.onOpen}
        variant="ghost"
      />
      <MobileNav {...nav} />
    </>
  );
};
