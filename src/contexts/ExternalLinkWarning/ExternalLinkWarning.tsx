import { useDisclosure } from "@chakra-ui/react";
import {
  useContext,
  useState,
  createContext,
  FunctionComponent,
  MouseEventHandler,
  useCallback,
} from "react";
import {
  PREFERS_WARN_ON_EXTERNAL_LINK_CLICK,
  ExternalLinkPrompt,
  ExternalLinkPromptOptions,
} from "./constants";
import { ExternalLinkWarningModal } from "./ExternaLinkWarningModal";

const ExternalLinkWarningContext = createContext<ExternalLinkPrompt>(
  ({ onClick }) => onClick
);

export const useExternalLinkWarning = () =>
  useContext(ExternalLinkWarningContext);

export const ExternalLinkWarningProvider: FunctionComponent = ({
  children,
}) => {
  const [modalOption, setModalOptions] =
    useState<ExternalLinkPromptOptions | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure({
    // Reset the modal options when closed
    onClose: () => {
      setModalOptions(null);
    },
  });

  // Determines initial state from localStorage. If no value is found, default to showing warning
  const [shouldWarn, setShouldWarn] = useState(() => {
    try {
      const saved =
        localStorage.getItem(PREFERS_WARN_ON_EXTERNAL_LINK_CLICK) ?? "true";
      return JSON.parse(saved);
    } catch {
      return true;
    }
  });

  // Takes in an href & onClick to set options for modal. If it should warn the user, it will wrap the onClick
  // With additional logic to show the modal
  const withPrompt = useCallback<ExternalLinkPrompt>(
    ({ href, onClick }) => {
      if (!shouldWarn) return onClick;

      const handler: MouseEventHandler<HTMLAnchorElement> = (e) => {
        setModalOptions({ href, onClick });
        e.preventDefault();
        onOpen();
      };

      return handler;
    },
    [onOpen, shouldWarn]
  );

  return (
    <ExternalLinkWarningContext.Provider value={withPrompt}>
      {children}
      <ExternalLinkWarningModal
        isOpen={isOpen}
        onClose={onClose}
        setShouldWarn={setShouldWarn}
        {...modalOption}
      />
    </ExternalLinkWarningContext.Provider>
  );
};
