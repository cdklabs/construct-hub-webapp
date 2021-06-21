import { IconButton, IconProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";

export interface ArrowButtonProps {
  icon: FunctionComponent<IconProps>;
  offset?: number;
  getPageUrl: (params: { offset: number }) => string;
}

export const ArrowButton: FunctionComponent<ArrowButtonProps> = ({
  icon: Icon,
  offset,
  getPageUrl,
}) => {
  const label = `Page ${offset} link`;

  const props = {
    "aria-label": label,
    colorScheme: "blue",
    icon: <Icon h={4} w={4} />,
    mx: 2,
  };

  if (offset !== undefined) {
    return <IconButton {...props} as={Link} to={getPageUrl({ offset })} />;
  }

  return <IconButton {...props} disabled />;
};
