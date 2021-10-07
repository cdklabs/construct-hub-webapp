import { SearchIcon } from "@chakra-ui/icons";
import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useLocation } from "react-router-dom";
import { ROUTES } from "../../constants/url";
import { SearchBar, SearchOverlay, SearchSuggestions } from "../SearchBar";
import { SearchModal } from "../SearchModal";
import testIds from "./testIds";

/**
 * Renders a SearchBar at desktop resolutions and shows a search icon which opens a modal on mobile resolutions
 */
export const HeaderSearch: FunctionComponent = () => {
  const searchModal = useDisclosure();
  const { pathname } = useLocation();

  if ([ROUTES.HOME, ROUTES.SEARCH].some((path) => path === pathname)) {
    return null;
  }

  return (
    <>
      {/* Desktop / Tablet Search Trigger */}
      <Box
        data-testid={testIds.searchInput}
        display={{ base: "none", md: "initial" }}
      >
        <SearchBar bg="gray.50">
          <SearchOverlay />
          <SearchSuggestions />
        </SearchBar>
      </Box>
      {/* Mobile Search Trigger */}
      <Box display={{ base: "initial", md: "none" }}>
        <IconButton
          aria-label="Search Icon"
          borderRadius="md"
          data-testid={testIds.searchIcon}
          icon={<SearchIcon color="gray.600" />}
          onClick={searchModal.onOpen}
          variant="ghost"
        />

        <SearchModal {...searchModal} />
      </Box>
    </>
  );
};
