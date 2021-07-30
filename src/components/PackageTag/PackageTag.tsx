import { Tag, TagProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Language } from "../../constants/languages";
import { getSearchPath } from "../../util/url";

export interface PackageTagProps extends TagProps {
  language?: Language;
  value: string;
}

export const PackageTag: FunctionComponent<PackageTagProps> = ({
  children,
  language,
  value,
  ...tagProps
}) => {
  return (
    <Link
      aria-label={`Tag: ${value}`}
      to={getSearchPath({ query: `"${value}"`, language })}
    >
      <Tag {...tagProps}>{children}</Tag>
    </Link>
  );
};
