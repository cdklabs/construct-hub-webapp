import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Portal,
  Stack,
} from "@chakra-ui/react";
import { FormEventHandler, FunctionComponent, useRef } from "react";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { CatalogSearchInputs } from "../CatalogSearch";
import { Form } from "../Form";

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: FunctionComponent<SearchModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { onSubmit: onSearchSubmit, ...searchAPI } = useCatalogSearch();

  const inputRef = useRef<HTMLInputElement>(null);

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
            </ModalBody>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    </Portal>
  );
};
