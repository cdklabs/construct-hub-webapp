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
import { useSearchState } from "./SearchState";

const SORT_RENDER_MAP = {
  [CatalogSearchSort.NameAsc]: "Alphabetical - Ascending",
  [CatalogSearchSort.NameDesc]: "Alphabetical - Descending",
  [CatalogSearchSort.PublishDateAsc]: "Oldest",
  [CatalogSearchSort.PublishDateDesc]: "Newest",
};

export const SortedBy: FunctionComponent = () => {
  const { searchAPI } = useSearchState();
  const { sort, setSort } = searchAPI;

  const selected = sort ? SORT_RENDER_MAP[sort] : "Recommended";

  return (
    <Flex align="center">
      <Text>Sorted by</Text>
      <Menu>
        <MenuButton
          as={Button}
          color="blue.500"
          ml={2}
          pl={2} // For some reason, the px shorthand doesn't work on this Button
          pr={2}
          py={1}
          rightIcon={<ChevronDownIcon />}
          variant="link"
        >
          {selected}
        </MenuButton>
        <MenuList zIndex="sticky">
          <MenuItem key="recommended" onClick={() => setSort(undefined)}>
            Recommended
          </MenuItem>
          {Object.entries(SORT_RENDER_MAP).map(([value, display]) => (
            <MenuItem
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
