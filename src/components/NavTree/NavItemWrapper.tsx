import { Text } from "@chakra-ui/react";
import type { FunctionComponent, ReactNode } from "react";
import { NavLink } from "../NavLink";

interface NavItemWrapperProps {
  "data-event"?: string;
  path?: string;
  title: string;
  showToggle: boolean;
  children: ReactNode;
  variant?: "sm" | "md";
}

export const NavItemWrapper: FunctionComponent<NavItemWrapperProps> = ({
  children,
  "data-event": dataEvent,
  path,
  title,
  showToggle,
  variant,
}) => {
  const smProps = {
    fontSize: "sm",
  };
  const mdProps = {
    fontSize: "md",
  };

  const sharedProps = {
    _hover: { bg: "rgba(0, 124, 253, 0.05)" },
    overflow: "hidden",
    pl: 1,
    py: showToggle ? 2 : 1,
    marginLeft: showToggle ? 0 : 1,
    fontWeight: showToggle ? "bold" : undefined,
    textOverflow: "ellipsis",
    whiteSpace: "nowrap" as const,
    w: "100%",
    ...(variant === "sm" ? smProps : mdProps),
  };

  return path ? (
    <NavLink data-event={dataEvent} title={title} to={path} {...sharedProps}>
      {children}
    </NavLink>
  ) : (
    <Text {...sharedProps}>{children}</Text>
  );
};
