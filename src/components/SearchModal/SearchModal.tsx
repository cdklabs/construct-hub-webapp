import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  Stack,
  Button,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { SearchBar } from "../SearchBar";
import testIds from "./testIds";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: FunctionComponent<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { query, onQueryChange, onSubmit, onSearch } = useCatalogSearch();

  return (
    <Portal>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent data-testid={testIds.container} mx={4}>
            <ModalCloseButton />
            <ModalHeader>Search</ModalHeader>
            <ModalBody>
              <Stack pb={4} spacing={4}>
                <SearchBar
                  onChange={onQueryChange}
                  onSubmit={(e) => {
                    onClose();
                    onSubmit(e);
                  }}
                  value={query}
                ></SearchBar>
                <Button colorScheme="blue" onClick={() => onSearch()}>
                  Find Constructs
                </Button>
              </Stack>
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Portal>
  );
};
