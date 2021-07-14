import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, ButtonProps, forwardRef } from "@chakra-ui/react";
import { testIds } from "./CodePopover";

export interface CodePopoverTriggerProps extends ButtonProps {}

/**
 * A default trigger button for the code popover
 */
export const CodePopoverTrigger = forwardRef<CodePopoverTriggerProps, "button">(
  (props, ref) => (
    <Button
      color="white"
      colorScheme="blue"
      data-testid={testIds.trigger}
      ref={ref}
      rightIcon={<ChevronDownIcon h={5} w={5} />}
      {...props}
    >
      {props.children}
    </Button>
  )
);

CodePopoverTrigger.displayName = "CodePopoverTrigger";
