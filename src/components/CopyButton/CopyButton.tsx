import { CopyIcon, CheckIcon } from "@chakra-ui/icons";
import {
  forwardRef,
  IconButton,
  IconButtonProps,
  useClipboard,
} from "@chakra-ui/react";

export interface CopyButtonProps extends Omit<IconButtonProps, "aria-label"> {
  // Optional since we set a default
  "aria-label"?: string;
  value: string;
}

export const CopyButton = forwardRef<CopyButtonProps, "button">(
  ({ value, ...btnProps }, ref) => {
    const { hasCopied, onCopy } = useClipboard(value);

    return (
      <IconButton
        aria-label="Copy Button"
        h={6}
        icon={hasCopied ? <CheckIcon color="green.300" /> : <CopyIcon />}
        minW="auto"
        onClick={onCopy}
        ref={ref}
        variant="ghost"
        w={6}
        {...btnProps}
      />
    );
  }
);

CopyButton.displayName = "CopyButton";
