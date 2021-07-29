import { Tag, TagLabel, TagProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Language } from "../../constants/languages";
import { getSearchPath } from "../../util/url";

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
    <Link
      aria-label={`Tag: ${label}`}
      to={getSearchPath({ query: `${value}`, language })}
    >
      <Tag {...tagProps}>
        <TagLabel>{children}</TagLabel>
      </Tag>
    </Link>
  );
};
