import { HamburgerIcon } from "@chakra-ui/icons";
import { IconButton, useDisclosure } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { HEADER_ANALYTICS } from "./constants";
import { MobileNav } from "./MobileNav";
import testIds from "./testIds";
import { useAnalytics } from "../../contexts/Analytics";
import { clickEvent } from "../../contexts/Analytics/util";

export const NavButton: FunctionComponent = () => {
  const { trackCustomEvent } = useAnalytics();
  const nav = useDisclosure({
    onOpen: () =>
      trackCustomEvent(clickEvent({ name: HEADER_ANALYTICS.MOBILE_NAV.OPEN })),
    onClose: () =>
      trackCustomEvent(clickEvent({ name: HEADER_ANALYTICS.MOBILE_NAV.CLOSE })),
  });

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
