import { HamburgerIcon } from "@chakra-ui/icons";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { MobileNav } from "./MobileNav";
import testIds from "./testIds";

export const NavButton: FunctionComponent = () => {
  const nav = useDisclosure();

  return (
    <>
      <IconButton
        aria-label="Navigation Menu"
        borderRadius="md"
        data-testid={testIds.navOpen}
        display={{ lg: "none" }}
        icon={<HamburgerIcon />}
        onClick={nav.onOpen}
        variant="ghost"
      />
      <MobileNav {...nav} />
    </>
  );
};
