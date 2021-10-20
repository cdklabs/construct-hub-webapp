import {
  UnorderedList,
  ListProps,
  forwardRef,
  Divider,
  Stack,
  Image,
  Text,
} from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { ExtendedCatalogPackage } from "../../api/catalog-search";
import { CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useDebounce } from "../../hooks/useDebounce";
import { getPackagePath } from "../../util/url";
import { Card, CardProps } from "../Card";
import { SearchItem } from "../SearchItem";
import { useSearchBarState } from "./SearchBar";
import testIds from "./testIds";

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
  const { query, isOpen } = useSearchBarState();
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

  const getSuggestionIcon = (pkg: ExtendedCatalogPackage): ReactNode => {
    const { metadata } = pkg;
    let icon = null;
    const cdkType = metadata?.constructFramework?.name;

    if (cdkType && cdkType in CDKTYPE_RENDER_MAP) {
      icon = (
        <Image
          alt={`${cdkType} Logo`}
          h={5}
          src={CDKTYPE_RENDER_MAP[cdkType].imgsrc}
          w={5}
        />
      );
    }

    return icon;
  };

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
        const icon = getSuggestionIcon(pkg);

        return (
          <>
            {i > 0 && <Divider mx={4} w="auto" />}
            <SearchItem
              data-testid={testIds.suggestion}
              key={pkg.id}
              name={
                <Stack align="center" direction="row" spacing={4}>
                  {icon}
                  <Text ml={icon ? 0 : 9}>{pkg.name}</Text>
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
