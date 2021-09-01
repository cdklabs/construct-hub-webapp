import { Tag, TagLabel, TagProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Language } from "../../constants/languages";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";

export interface PackageTagProps extends TagProps {
  language?: Language;
  value: string;
  label?: string;
  zIndex?: string | number;
}

export const PackageTag: FunctionComponent<PackageTagProps> = ({
  children,
  language,
  value,
  label = value,
  zIndex,
  ...tagProps
}) => {
  return (
    <NavLink
      aria-label={`Tag: ${label}`}
      to={getSearchPath({ query: `${value}`, language })}
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
