import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Button, ButtonProps } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface ToggleButtonProps extends ButtonProps {
  isOpen: boolean;
  openText: string;
  closeText: string;
}

export const ToggleButton: FunctionComponent<ToggleButtonProps> = ({
  openText,
  closeText,
  isOpen,
  ...buttonProps
}) => (
  <Button
    color="link"
    colorScheme="blue"
    leftIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
    variant="link"
    {...buttonProps}
  >
    {isOpen ? closeText : openText}
  </Button>
);
