import {
  Box,
  Divider,
  Modal,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalOverlay,
  UnorderedList,
} from "@chakra-ui/react";
import { FunctionComponent, useRef } from "react";
import { SearchInput } from "./SearchInput";
import { SearchItem } from "components/SearchItem";

export interface SearchModalProps {
  inputValue: string;
  isOpen: boolean;
  onClose: () => void;
  onInputChange: (s: string) => void;
  submodules: { name: string; to: string }[];
}

export const SearchModal: FunctionComponent<SearchModalProps> = ({
  inputValue,
  isOpen,
  onClose,
  onInputChange,
  submodules,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Modal initialFocusRef={inputRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay>
        <ModalContent mx={4}>
          <ModalCloseButton data-testid="choose-submodule-modal-close" />
          <ModalHeader
            data-testid="choose-submodule-modal-header"
            fontSize="lg"
            fontWeight="bold"
          >
            Choose a submodule
          </ModalHeader>
          <ModalBody data-testid="choose-submodule-modal-body" p={0}>
            <Box pb={4} px={4}>
              <SearchInput
                onChange={onInputChange}
                ref={inputRef}
                url={submodules[0]?.to}
                value={inputValue}
              />
            </Box>
            <Divider />
            <UnorderedList
              data-testid="choose-submodule-modal-results"
              m={0}
              maxH="50vh"
              overflow="hidden auto"
              p={0}
              role="listbox"
              tabIndex={-1}
            >
              {submodules.map(({ name, to }) => (
                <SearchItem
                  data-testid="choose-submodule-result"
                  href={to}
                  key={name}
                  name={name}
                />
              ))}
            </UnorderedList>
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
