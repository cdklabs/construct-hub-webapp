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
  Tooltip,
} from "@chakra-ui/react";
import {
  ChangeEventHandler,
  FunctionComponent,
  MouseEventHandler,
  useState,
} from "react";
import { ExternalLink } from "../../components/ExternalLink";
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

    const onProceed: MouseEventHandler<HTMLAnchorElement> = (e) => {
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

      onClick?.(e);
      onClose();
    };

    return (
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay>
          <ModalContent color="blue.800">
            <ModalHeader>Confirm</ModalHeader>
            <ModalBody>
              <Text fontSize="lg" mb={2}>
                This link is taking you to an external site
              </Text>
              <Text
                bg="gray.100"
                borderRadius="sm"
                color="blue.500"
                fontSize="sm"
                mb={4}
                p={1}
              >
                {href}
              </Text>
              <Checkbox onChange={onPreferenceUpdated}>
                Do not show this warning again.
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button onClick={onCancel} variant="ghost">
                Cancel
              </Button>

              <Tooltip hasArrow label={href} placement="top">
                <ExternalLink
                  hasIcon={false}
                  hasWarning={false}
                  href={href}
                  noFollow
                  onClick={onProceed}
                >
                  <Button
                    colorScheme="blue"
                    ml={4}
                    rightIcon={<ExternalLinkIcon />}
                    tabIndex={0}
                    variant="ghost"
                  >
                    Proceed
                  </Button>
                </ExternalLink>
              </Tooltip>
            </ModalFooter>
          </ModalContent>
        </ModalOverlay>
      </Modal>
    );
  };
