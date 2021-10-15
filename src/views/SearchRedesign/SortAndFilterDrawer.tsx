import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Drawer,
  Stack,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { AuthorFilter } from "./AuthorFilter";
import { CDKFilter } from "./CDKFilter";
import { LanguageFilter } from "./LanguageFilter";
import { SortFilter } from "./SortFilter";

/**
 * The mobile filter Drawer (Bottomsheet in iOS terminology)
 */
export const SortAndFilterDrawer: FunctionComponent = () => {
  const drawer = useDisclosure();

  return (
    <>
      <Button
        colorScheme="blue"
        display={{ md: "none" }}
        onClick={drawer.onOpen}
        rightIcon={<ChevronDownIcon />}
        variant="link"
      >
        Sorting and Filters
      </Button>
      <Drawer {...drawer} placement="bottom">
        <DrawerOverlay />

        <DrawerContent color="blue.800">
          <DrawerHeader>Sorting and Filters</DrawerHeader>

          <DrawerCloseButton />

          <DrawerBody>
            <Stack color="blue.800" pb={4} spacing={4}>
              <SortFilter />

              <CDKFilter />

              <LanguageFilter />

              <AuthorFilter />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
