import { Tag, TagLabel, TagProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Language } from "../../constants/languages";
import { getSearchPath } from "../../util/url";
import { NavLink } from "components/NavLink";

export interface PackageTagProps extends TagProps {
  language?: Language;
  value: string;
  label?: string;
}

export const PackageTag: FunctionComponent<PackageTagProps> = ({
  children,
  language,
  value,
  label = value,
  ...tagProps
}) => {
  return (
    <Tag {...tagProps}>
      <NavLink
        aria-label={`Tag: ${label}`}
        href={getSearchPath({ query: `${value}`, language })}
      >
        <TagLabel>{children}</TagLabel>
      </NavLink>
    </Tag>
  );
};
