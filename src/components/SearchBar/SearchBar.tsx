import { SearchIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  useDisclosure,
  Button,
} from "@chakra-ui/react";
import {
  useContext,
  createContext,
  FunctionComponent,
  useEffect,
  useRef,
  ChangeEventHandler,
  FormEventHandler,
} from "react";
import { useCatalog } from "../../contexts/Catalog";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { Form } from "../Form";
import testIds from "./testIds";

export interface SearchBarProps
  extends Omit<InputProps, "onChange" | "value" | "onSubmit"> {
  defaultQuery?: string;
  hasButton?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

const SearchBarState = createContext<
  { query: string; isOpen: boolean } | undefined
>(undefined);

export const useSearchBarState = () => {
  const state = useContext(SearchBarState);

  if (!state) {
    throw new Error("This component must be a child of a <SearchBar />");
  }

  return state;
};

/**
 * Exposes a Search component that provides a default search implementation. This behavior can be overridden by defining `value`, `onChange`, and `onSubmit` props.
 * Additionally, it's behavior can be extended with `<SearchOverlay />` and `<SearchSuggestions />`
 * ```tsx
 * // Minimal use-case
 * import { SearchBar } from "components/SearchBar";
 * <SearchBar />
 *
 * // With extended behavior
 * import { SearchBar, SearchOverlay, SearchSuggestions } from "components/SearchBar";
 *
 * <SearchBar>
 *   <SearchOverlay />
 *   <SearchSuggestions />
 * </SearchBar>
 * ```
 */
export const SearchBar: FunctionComponent<SearchBarProps> = ({
  children,
  hasButton,
  onSubmit,
  value,
  onChange,
  ...inputProps
}) => {
  const disclosure = useDisclosure();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchAPI = useCatalogSearch();
  const catalog = useCatalog();

  const roundedCatalogLength =
    Math.round((catalog?.data?.packages?.length ?? 0) / 100) * 100;

  const placeholder = `Search ${
    roundedCatalogLength > 0 ? `${roundedCatalogLength}+ ` : ""
  }construct libraries`;

  useEffect(() => {
    // Handle closing disclosures when user clicks outside of input.
    // We cannot rely on the input's onBlur due to left & right elements (icon / button) triggering it
    const clickListener = (e: MouseEvent) => {
      if (!inputRef.current || !e.target) {
        return;
      }

      if (!inputRef.current.contains(e.target as Node)) {
        disclosure.onClose();
      }
    };

    // Closes disclosures when Esc key is pressed
    const kbdListener = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        inputRef.current?.blur?.();
        disclosure.onClose();
      }
    };

    window.addEventListener("keyup", kbdListener);
    window.addEventListener("click", clickListener);

    return () => {
      window.removeEventListener("keyup", kbdListener);
      window.removeEventListener("click", clickListener);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SearchBarState.Provider
      value={{ query: value ?? searchAPI.query, isOpen: disclosure.isOpen }}
    >
      <Form
        color="initial"
        onSubmit={onSubmit ?? searchAPI.onSubmit}
        pos="relative"
      >
        <InputGroup pos="relative" zIndex={disclosure.isOpen ? 3 : "initial"}>
          {hasButton && (
            <InputLeftElement>
              <SearchIcon data-testid={testIds.searchIcon} />
            </InputLeftElement>
          )}

          <Input
            _focus={{
              boxShadow: "base",
              borderColor: "inherit", // To avoid taking @chakra's border color on focus
            }}
            bg="white"
            boxShadow={disclosure.isOpen ? "base" : "none"}
            data-testid={testIds.input}
            onChange={onChange ?? searchAPI.onQueryChange}
            onFocus={disclosure.onOpen}
            placeholder={placeholder}
            ref={inputRef}
            value={value ?? searchAPI.query}
            {...inputProps}
          />

          {hasButton ? (
            <InputRightElement
              display={{ base: "none", md: "initial" }}
              w="9rem"
            >
              <Button
                borderLeftRadius="0"
                colorScheme="blue"
                data-testid={testIds.searchButton}
                type="submit"
              >
                Find Constructs
              </Button>
            </InputRightElement>
          ) : (
            <InputRightElement>
              <SearchIcon data-testid={testIds.searchIcon} />
            </InputRightElement>
          )}
        </InputGroup>

        {children}
      </Form>
    </SearchBarState.Provider>
  );
};
