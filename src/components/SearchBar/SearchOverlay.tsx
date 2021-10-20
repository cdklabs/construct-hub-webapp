import { Box, BoxProps, forwardRef } from "@chakra-ui/react";
import { useSearchBarState } from "./SearchBar";
import testIds from "./testIds";

/**
 * An overlay component which can be used to extend the `<SearchBar />` presentational behavior
 * ```tsx
 * import { SearchBar, SearchOverlay } from "components/SearchBar";
 *
 * <SearchBar>
 *   <SearchOverlay />
 * </SearchBar>
 * ```
 */
export const SearchOverlay = forwardRef<BoxProps, "div">((props, ref) => {
  const { isOpen } = useSearchBarState();

  return (
    <Box
      bg="gray.700"
      data-testid={testIds.overlay}
      display={isOpen ? "initial" : "none"}
      inset="0"
      opacity="0.5"
      pos="fixed"
      ref={ref}
      zIndex="1"
      {...props}
    />
  );
});
