import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Flex,
  Text,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { QUERY_PARAMS } from "../../constants/url";
import { eventName } from "../../contexts/Analytics";
import { SEARCH_ANALYTICS, SORT_RENDER_MAP } from "./constants";
import testIds from "./testIds";
import { useSearchParam } from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";

export const SortedBy: FunctionComponent = () => {
  const sort = useSearchParam(QUERY_PARAMS.SORT) as CatalogSearchSort;
  const updateSearch = useUpdateSearchParam();

  const selected = sort ? SORT_RENDER_MAP[sort] : "Relevance";

  return (
    <Flex align="center">
      <Text>Sorted by</Text>
      <Menu>
        <MenuButton
          as={Button}
          color="blue.500"
          data-event={eventName(SEARCH_ANALYTICS.SORT, "Menu")}
          data-testid={testIds.sortButton}
          ml={2}
          pl={2} // For some reason, the px shorthand doesn't work on this Button
          pr={2}
          py={1}
          rightIcon={<ChevronDownIcon />}
          variant="link"
        >
          {selected}
        </MenuButton>
        <MenuList data-testid={testIds.sortDropdown} minW="180" zIndex="sticky">
          <MenuItem
            data-event={eventName(SEARCH_ANALYTICS.SORT, "Option", "Relevance")}
            data-testid={testIds.sortItem}
            data-value=""
            key="Relevance"
            onClick={() => updateSearch({ sort: undefined })}
          >
            Relevance
          </MenuItem>
          {Object.entries(SORT_RENDER_MAP).map(([value, display]) => (
            <MenuItem
              data-event={eventName(SEARCH_ANALYTICS.SORT, "Option", display)}
              data-testid={testIds.sortItem}
              data-value={value}
              key={value}
              onClick={() => updateSearch({ sort: value as CatalogSearchSort })}
            >
              {display}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};
