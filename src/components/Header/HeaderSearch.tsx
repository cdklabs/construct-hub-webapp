import { SearchIcon } from "@chakra-ui/icons";
import { Box, IconButton, useDisclosure } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Switch, Route } from "react-router-dom";
import { ROUTES } from "../../constants/url";
import { SearchBar, SearchOverlay, SearchSuggestions } from "../SearchBar";
import { SearchModal } from "../SearchModal";
import { HEADER_ANALYTICS } from "./constants";
import testIds from "./testIds";

/**
 * Renders a SearchBar at desktop resolutions and shows a search icon which opens a modal on mobile resolutions
 */
export const HeaderSearch: FunctionComponent = () => {
  const searchModal = useDisclosure();

  return (
    <Switch>
      <Route exact path={[ROUTES.HOME, ROUTES.SEARCH]} />
      <Route path="*">
        {/* Desktop / Tablet Search Trigger */}
        <Box
          data-testid={testIds.searchInput}
          display={{ base: "none", lg: "initial" }}
        >
          <SearchBar bg="gray.50" data-event={HEADER_ANALYTICS.SEARCH}>
            <SearchOverlay />
            <SearchSuggestions />
          </SearchBar>
        </Box>
        {/* Mobile Search Trigger */}
        <Box display={{ base: "initial", lg: "none" }}>
          <IconButton
            aria-label="Search Icon"
            borderRadius="md"
            data-event={HEADER_ANALYTICS.SEARCH_MODAL.OPEN}
            data-testid={testIds.searchIcon}
            icon={<SearchIcon color="gray.600" />}
            onClick={searchModal.onOpen}
            variant="ghost"
          />

          <SearchModal {...searchModal} />
        </Box>
      </Route>
    </Switch>
  );
};
