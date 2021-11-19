import { Tag, TagLabel, TagProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";

export interface PackageTagProps extends TagProps {
  value: string;
  label?: string;
  zIndex?: string | number;
}

export const PackageTag: FunctionComponent<PackageTagProps> = ({
  children,
  value,
  label = value,
  zIndex,
  ...tagProps
}) => {
  return (
    <NavLink
      aria-label={`Tag: ${label}`}
      to={getSearchPath({ keywords: [value] })}
      zIndex={zIndex}
    >
      <Tag
        _hover={{
          textDecoration: "underline",
        }}
        {...tagProps}
      >
        <TagLabel>{children}</TagLabel>
      </Tag>
    </NavLink>
  );
};
