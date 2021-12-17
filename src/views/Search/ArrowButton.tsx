import { IconButton, IconProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";

export interface ArrowButtonProps {
  "data-event"?: string;
  "data-testid"?: string;
  icon: FunctionComponent<IconProps>;
  label: string;
  onClick?: () => void;
}

export const ArrowButton: FunctionComponent<ArrowButtonProps> = ({
  "data-event": dataEvent,
  "data-testid": dataTestid,
  icon: Icon,
  label,
  onClick,
}) => {
  const props = {
    "aria-label": label,
    borderRadius: "md",
    borderColor: "blue.500",
    colorScheme: "blue",
    "data-event": dataEvent,
    "data-testid": dataTestid,
    icon: <Icon color="blue.500" h={5} w={5} />,
    mx: 2,
    h: 10,
    w: 10,
    variant: "outline",
  };

  return <IconButton {...props} disabled={!onClick} onClick={onClick} />;
};
