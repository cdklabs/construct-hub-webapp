import { SearchIcon } from "@chakra-ui/icons";
import { Button, IconButton, useDisclosure } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/url";
import { SearchModal } from "../SearchModal";

export const SearchButton: FunctionComponent = () => {
  const searchModal = useDisclosure();
  const { pathname } = useLocation();

  if ([ROUTES.HOME, ROUTES.SEARCH].some((path) => path === pathname)) {
    return null;
  }

  return (
    <>
      {/* Desktop / Tablet Search Trigger */}
      <Button
        align="center"
        color="gray.600"
        colorScheme="gray"
        display={["none", null, "flex"]}
        fontWeight="medium"
        justifyContent="space-between"
        m="0 auto"
        maxW="500px"
        onClick={searchModal.onOpen}
        rightIcon={<SearchIcon color="gray.600" ml={4} />}
        variant="outline"
        w="100%"
      >
        Search Constructs...
      </Button>
      {/* Mobile Search Trigger */}
      <IconButton
        aria-label="Search Icon"
        borderRadius="md"
        display={["initial", null, "none"]}
        icon={<SearchIcon color="gray.600" />}
        onClick={searchModal.onOpen}
        variant="ghost"
      />
      <SearchModal {...searchModal} />
    </>
  );
};
