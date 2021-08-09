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
import { Documentation } from "./Documentation";
import { Resources } from "./Resources";
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
          <DrawerHeader display="flex" justifyContent="center">
            <Title />
          </DrawerHeader>
          <DrawerBody>
            <Stack align="start" justify="start" spacing={4}>
              <Documentation />
              <Resources />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Portal>
  );
};
