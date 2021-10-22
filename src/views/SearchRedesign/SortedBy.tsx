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
import { SORT_RENDER_MAP } from "./constants";
import { useSearchState } from "./SearchState";
import testIds from "./testIds";

export const SortedBy: FunctionComponent = () => {
  const { searchAPI } = useSearchState();
  const { sort, setSort } = searchAPI;

  const selected = sort ? SORT_RENDER_MAP[sort] : "Relevance";

  return (
    <Flex align="center">
      <Text>Sorted by</Text>
      <Menu>
        <MenuButton
          as={Button}
          color="blue.500"
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
            data-testid={testIds.sortItem}
            data-value=""
            key="Relevance"
            onClick={() => setSort(undefined)}
          >
            Relevance
          </MenuItem>
          {Object.entries(SORT_RENDER_MAP).map(([value, display]) => (
            <MenuItem
              data-testid={testIds.sortItem}
              data-value={value}
              key={value}
              onClick={() => setSort(value as CatalogSearchSort)}
            >
              {display}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    </Flex>
  );
};
