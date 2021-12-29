import { SearchIcon } from "@chakra-ui/icons";
import {
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  useDisclosure,
  Button,
  IconButton,
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
import { useAnalytics } from "../../contexts/Analytics";
import { clickEvent, eventName } from "../../contexts/Analytics/util";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { useSearch } from "../../hooks/useSearch";
import { Form } from "../Form";
import testIds from "./testIds";

export interface SearchBarProps
  extends Omit<InputProps, "onChange" | "value" | "onSubmit"> {
  "data-event"?: string;
  defaultQuery?: string;
  hasButton?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  onSubmit?: FormEventHandler<HTMLFormElement>;
}

const SearchBarState = createContext<
  { dataEvent?: string; query: string; isOpen: boolean } | undefined
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
  "data-event": dataEvent,
  hasButton,
  onSubmit,
  value,
  onChange,
  ...inputProps
}) => {
  const disclosure = useDisclosure();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const searchAPI = useCatalogSearch();
  const catalog = useSearch();
  const { trackCustomEvent } = useAnalytics();

  const roundedCatalogLength = Math.floor((catalog.length ?? 0) / 100) * 100;

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
      value={{
        dataEvent,
        query: value ?? searchAPI.query,
        isOpen: disclosure.isOpen,
      }}
    >
      <Form
        color="initial"
        onSubmit={onSubmit ?? searchAPI.onSubmit}
        pos="relative"
      >
        <InputGroup pos="relative" zIndex={disclosure.isOpen ? 3 : "initial"}>
          {hasButton && (
            <InputLeftElement>
              <SearchIcon
                color="textTertiary"
                data-testid={testIds.searchIcon}
              />
            </InputLeftElement>
          )}

          <Input
            bg="bgSecondary"
            boxShadow={disclosure.isOpen ? "base" : "none"}
            color="textSecondary"
            data-testid={testIds.input}
            focusBorderColor="blue.500"
            onChange={onChange ?? searchAPI.onQueryChange}
            onFocus={() => {
              disclosure.onOpen();

              if (dataEvent) {
                trackCustomEvent(
                  clickEvent({ name: eventName(dataEvent, "Input") })
                );
              }
            }}
            placeholder={placeholder}
            pr={hasButton ? { base: "none", md: "9rem" } : undefined}
            ref={inputRef}
            value={value ?? searchAPI.query}
            {...inputProps}
          />

          {hasButton ? (
            <InputRightElement
              display={{ base: "none", md: "initial" }}
              w="auto"
            >
              <Button
                _hover={{ bg: "brand.600" }}
                bg="brand.500"
                borderLeftRadius="0"
                color="white"
                data-event={
                  dataEvent ? eventName(dataEvent, "Submit Button") : undefined
                }
                data-testid={testIds.searchButton}
                fontSize="0.875rem"
                type="submit"
                w="9rem"
              >
                Find constructs
              </Button>
            </InputRightElement>
          ) : (
            <InputRightElement>
              <IconButton
                aria-label="Run search"
                data-event={
                  dataEvent ? eventName(dataEvent, "Submit Icon") : undefined
                }
                data-testid={testIds.searchIcon}
                icon={<SearchIcon />}
                type="submit"
                variant="ghost"
              ></IconButton>
            </InputRightElement>
          )}
        </InputGroup>

        {children}
      </Form>
    </SearchBarState.Provider>
  );
};
