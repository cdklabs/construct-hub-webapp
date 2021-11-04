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
import { GETTING_STARTED, DOCUMENTATION } from "../../constants/links";
import { MobileNavLinks } from "./MobileNavLinks";
import testIds from "./testIds";
import { Title } from "./Title";
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
            <Stack align="start" justify="start" spacing={4}>
              <MobileNavLinks
                sections={[
                  {
                    title: "Getting Started",
                    items: GETTING_STARTED,
                    testId: testIds.gettingStartedMenu,
                  },
                  {
                    title: "Documentation",
                    items: DOCUMENTATION,
                    testId: testIds.documentationMenu,
                  },
                ]}
              />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Portal>
  );
};
