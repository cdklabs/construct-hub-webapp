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
import { CDKFilter } from "./CDKFilter";
import { KeywordsFilter } from "./KeywordsFilter";
import { LanguageFilter } from "./LanguageFilter";
import { SortFilter } from "./SortFilter";
import { TagFilter } from "./TagFilter";

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

        <DrawerContent color="blue.800" maxH="full">
          <DrawerHeader borderBottom="base">Sorting and Filters</DrawerHeader>

          <DrawerCloseButton />

          <DrawerBody>
            <Stack color="blue.800" pb={4} spacing={4}>
              <SortFilter />

              <CDKFilter />

              <LanguageFilter />

              <TagFilter />

              <KeywordsFilter />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
