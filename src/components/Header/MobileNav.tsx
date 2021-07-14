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
import { Community } from "./Community";
import { GettingStarted } from "./GettingStarted";
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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader display="flex" justifyContent="center">
            <Title />
          </DrawerHeader>
          <DrawerBody>
            <Stack align="start" justify="start" spacing={4}>
              <GettingStarted />
              <Community />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Portal>
  );
};
