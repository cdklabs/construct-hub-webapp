import { ChevronUpIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
  Flex,
  useDisclosure,
  Portal,
} from "@chakra-ui/react";
import { FunctionComponent, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { NavTree } from "../../components/NavTree";
import { ChooseSubmodule } from "./ChooseSubmodule";
import { usePackageState } from "./PackageState";

export const NavDrawer: FunctionComponent = () => {
  const { assembly, menuItems } = usePackageState();
  const drawer = useDisclosure();
  const location = useLocation();

  const hasSubmodules = Object.keys(assembly.data?.submodules ?? {}).length > 0;

  // Close NavDrawer when URL updates
  useEffect(() => {
    if (drawer.isOpen) {
      drawer.onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <Box bottom={0} display={{ lg: "none" }} left={0} pos="fixed" right={0}>
      <Button
        bg="bgPrimary"
        borderTop="base"
        boxShadow="base"
        fontSize="xl"
        fontWeight="semibold"
        h="3.5rem"
        onClick={drawer.onOpen}
        variant="unstyled"
        w="full"
      >
        <Flex align="center" justify="space-between" px={6}>
          Table of contents
          <ChevronUpIcon />
        </Flex>
      </Button>

      <Portal>
        <Drawer {...drawer} blockScrollOnMount={false} placement="bottom">
          <DrawerOverlay />
          <DrawerContent maxH="60vh">
            <DrawerHeader>Table of contents</DrawerHeader>
            <DrawerCloseButton />

            <DrawerBody>
              {hasSubmodules && (
                <Box mb={4} sx={{ button: { justifyContent: "initial" } }}>
                  <ChooseSubmodule />
                </Box>
              )}
              <NavTree items={menuItems} />
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Portal>
    </Box>
  );
};
