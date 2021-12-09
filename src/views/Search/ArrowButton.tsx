import { IconButton, IconProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";

export interface ArrowButtonProps {
  "data-event"?: string;
  "data-testid"?: string;
  icon: FunctionComponent<IconProps>;
  offset?: number;
  getPageUrl: (params: { offset: number }) => string;
}

export const ArrowButton: FunctionComponent<ArrowButtonProps> = ({
  "data-event": dataEvent,
  "data-testid": dataTestid,
  icon: Icon,
  offset,
  getPageUrl,
}) => {
  const label = `Page ${offset} link`;

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

  if (offset !== undefined) {
    return <IconButton {...props} as={Link} to={getPageUrl({ offset })} />;
  }

  return <IconButton {...props} disabled />;
};
