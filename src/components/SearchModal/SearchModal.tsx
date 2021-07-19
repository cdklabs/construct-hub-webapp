import {
  Divider,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  Stack,
  UnorderedList,
} from "@chakra-ui/react";
import { FormEventHandler, FunctionComponent, useRef } from "react";
import { useHistory } from "react-router-dom";
import { QUERY_PARAMS, ROUTES } from "../../constants/url";
import { useCatalogResults } from "../../hooks/useCatalogResults";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { useDebounce } from "../../hooks/useDebounce";
import { useLanguage } from "../../hooks/useLanguage";
import { CatalogSearchInputs } from "../CatalogSearch";
import { Form } from "../Form";
import { SearchItem } from "../SearchItem";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: FunctionComponent<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { push } = useHistory();
  const [currentLanguage] = useLanguage();
  const { onSubmit: onSearchSubmit, ...searchAPI } = useCatalogSearch();
  const { query, language } = useDebounce({
    query: searchAPI.query,
    language: searchAPI.language,
  });

  const { displayable } = useCatalogResults({
    limit: 5,
    offset: 0,
    query,
    language,
  });

  const showResults = (query || language) && displayable.length > 0;
  const inputRef = useRef<HTMLInputElement>(null);

  const navigate = (to: string) => {
    onClose();
    push(to);
  };

  const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    onClose();
    onSearchSubmit(e);
  };

  return (
    <Portal>
      <Modal initialFocusRef={inputRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalCloseButton />
            <ModalHeader>Search modules or providers</ModalHeader>
            <ModalBody>
              <Form onSubmit={onSubmit} pb={4}>
                <Stack spacing={4}>
                  <CatalogSearchInputs ref={inputRef} {...searchAPI} />
                </Stack>
              </Form>
              {showResults && (
                <>
                  <Divider />
                  <Heading fontSize="md" my={4} textAlign="center">
                    Suggestions
                  </Heading>
                  <UnorderedList>
                    {displayable.map((pkg) => (
                      <SearchItem
                        key={pkg.name}
                        name={pkg.name}
                        onClick={() =>
                          navigate(
                            `${ROUTES.PACKAGES}/${pkg.name}/v/${pkg.version}?${
                              QUERY_PARAMS.LANGUAGE
                            }=${language ?? currentLanguage}`
                          )
                        }
                      />
                    ))}
                  </UnorderedList>
                </>
              )}
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Portal>
  );
};
