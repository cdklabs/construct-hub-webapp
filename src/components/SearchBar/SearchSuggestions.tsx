import {
  Box,
  UnorderedList,
  ListProps,
  forwardRef,
  Divider,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { useSearchBarState } from "./SearchBar";
import testIds from "./testIds";
import { ExtendedCatalogPackage } from "../../api/catalog-search";
import { eventName } from "../../contexts/Analytics/util";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useDebounce } from "../../hooks/useDebounce";
import { getPackagePath } from "../../util/url";
import { Card, CardProps } from "../Card";
import { CDKTypeBadge } from "../CDKType";
import { SearchItem } from "../SearchItem";

/**
 * A suggestion component which can be used to extend the `<SearchBar />` behavior with a list of
 * recommended results
 * ```tsx
 * import { SearchBar, SearchSuggestions } from "components/SearchBar";
 *
 * <SearchBar>
 *   <SearchSuggestions />
 * </SearchBar>
 * ```
 */
export const SearchSuggestions: FunctionComponent = forwardRef<
  CardProps & ListProps,
  "ul"
>((props, ref) => {
  const { dataEvent, query, isOpen } = useSearchBarState();
  const debouncedQuery = useDebounce(query);

  const { push } = useHistory();

  const { page: recommendations } = useCatalogResults({
    limit: 5,
    offset: 0,
    query: debouncedQuery,
  });

  if (!isOpen || recommendations.length < 1 || !debouncedQuery) {
    return null;
  }

  return (
    <Card
      as={UnorderedList}
      data-testid={testIds.suggestionsList}
      left={0}
      ml={0}
      pos="absolute"
      pt={10}
      px={0}
      ref={ref}
      right={0}
      top={0}
      zIndex={2}
      {...props}
    >
      {recommendations.map((pkg: ExtendedCatalogPackage, i) => {
        const navigate = () => push(getPackagePath(pkg));
        const { constructFrameworks } = pkg;

        return (
          <>
            {i > 0 && <Divider mx={4} w="auto" />}
            <SearchItem
              data-event={
                dataEvent
                  ? eventName(dataEvent, "Suggestion", pkg.name)
                  : undefined
              }
              data-testid={testIds.suggestion}
              key={pkg.id}
              name={
                <Stack align="center" direction="row" spacing={4}>
                  <Box w="5.5rem">
                    <CDKTypeBadge
                      constructFrameworks={constructFrameworks}
                      w="min-content"
                    />
                  </Box>
                  <Text color="textPrimary">{pkg.name}</Text>
                </Stack>
              }
              onClick={navigate}
              py={2}
              textAlign="left"
            />
          </>
        );
      })}
    </Card>
  );
});
