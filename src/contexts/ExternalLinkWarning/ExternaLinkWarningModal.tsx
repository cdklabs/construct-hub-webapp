import { ExternalLinkIcon } from "@chakra-ui/icons";
import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import {
  ChangeEventHandler,
  FunctionComponent,
  MouseEvent,
  MouseEventHandler,
  useState,
} from "react";
import {
  ExternalLinkPromptOptions,
  PREFERS_WARN_ON_EXTERNAL_LINK_CLICK,
} from "./constants";

export interface ExternalLinkWarningModalProps
  extends ExternalLinkPromptOptions {
  isOpen: boolean;
  onClose: () => void;
  setShouldWarn: (shouldWarn: boolean) => void;
}

export const ExternalLinkWarningModal: FunctionComponent<ExternalLinkWarningModalProps> =
  ({ href, isOpen, onClick, onClose, setShouldWarn }) => {
    // Track a final state for showing warnings that will only be updated if a user chooses to proceed
    const [finalShouldWarn, setFinalShouldWarn] = useState(true);

    // Update intermediate state when preference checkmark is updated
    const onPreferenceUpdated: ChangeEventHandler<HTMLInputElement> = (e) => {
      const shouldWarn = !e.target.checked;
      setFinalShouldWarn(shouldWarn);
    };

    const onCancel = () => {
      // If user cancelled the navigation, reset final warning state
      setFinalShouldWarn(true);
      onClose();
    };

    const onProceed: MouseEventHandler<HTMLButtonElement> = (e) => {
      // If a user decided to not show warnings in the future, update localStorage & state to reflect their decision
      if (!finalShouldWarn) {
        setShouldWarn(finalShouldWarn);

        try {
          localStorage.setItem(
            PREFERS_WARN_ON_EXTERNAL_LINK_CLICK,
            JSON.stringify(finalShouldWarn)
          );
        } catch {}
      }

      onClick?.(e as unknown as MouseEvent<HTMLAnchorElement>);
      onClose();
    };

    return (
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent>
            <ModalHeader>Confirm</ModalHeader>
            <ModalBody fontSize="md">
              <Text mb={4}>
                This link is taking you to an external site. Proceed?
              </Text>
              <Checkbox onChange={onPreferenceUpdated}>
                Do not show this warning again.
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onCancel} variant="ghost">
                Cancel
              </Button>

              <Button
                as="a"
                colorScheme="blue"
                href={href}
                ml={4}
                onClick={onProceed}
                rel="noopener noreferrer"
                rightIcon={<ExternalLinkIcon />}
                target="_blank"
                variant="ghost"
              >
                Proceed
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    );
  };
