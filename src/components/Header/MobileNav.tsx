import {
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { HEADER_ANALYTICS } from "./constants";
import { MobileNavLinks } from "./MobileNavLinks";
import testIds from "./testIds";
import { Title } from "./Title";
import { GETTING_STARTED, DOCUMENTATION } from "../../constants/links";
import { ROUTES } from "../../constants/url";
import { NavLink } from "../NavLink";
export interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNav: FunctionComponent<MobileNavProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Portal>
      <Drawer isOpen={isOpen} onClose={onClose} placement="left" size="xs">
        <DrawerOverlay />

        <DrawerContent data-testid={testIds.mobileNav}>
          <DrawerCloseButton />

          <DrawerHeader display="flex" justifyContent="start">
            <Title />
          </DrawerHeader>

          <DrawerBody>
            <Stack align="start" justify="start" spacing={0}>
              <MobileNavLinks
                sections={[
                  {
                    dataEvent: HEADER_ANALYTICS.GETTING_STARTED,
                    title: "Getting Started",
                    items: GETTING_STARTED,
                    testId: testIds.gettingStartedMenu,
                  },
                  {
                    dataEvent: HEADER_ANALYTICS.DOCUMENTATION,
                    title: "Documentation",
                    items: DOCUMENTATION,
                    testId: testIds.documentationMenu,
                  },
                ]}
              />

              <NavLink
                _hover={{ bg: "blackAlpha.50" }}
                borderBottom="base"
                color="textPrimary"
                fontSize="1rem"
                fontWeight="bold"
                h="3.25rem"
                lineHeight="3.25rem"
                to={ROUTES.CONTRIBUTE}
                w="full"
              >
                Contribute
              </NavLink>
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Portal>
  );
};
