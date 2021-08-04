import { SearchIcon } from "@chakra-ui/icons";
import { Button, IconButton, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import type { FunctionComponent } from "react";
import { ROUTES } from "../../constants/url";
import { SearchModal } from "../SearchModal";
import { testIds } from "./constants";

export const SearchButton: FunctionComponent = () => {
  const searchModal = useDisclosure();
  const { pathname } = useRouter();

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
        data-testid={testIds.searchButton}
        display={{ base: "none", md: "flex" }}
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
        data-testid={testIds.searchIcon}
        display={{ base: "initial", md: "none" }}
        icon={<SearchIcon color="gray.600" />}
        onClick={searchModal.onOpen}
        variant="ghost"
      />
      <SearchModal {...searchModal} />
    </>
  );
};
