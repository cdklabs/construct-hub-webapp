import { Tag, TagLabel, TagProps } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Language } from "../../constants/languages";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";

export interface PackageTagProps extends TagProps {
  isKeyword?: boolean;
  language?: Language;
  value: string;
  label?: string;
  zIndex?: string | number;
}

export const PackageTag: FunctionComponent<PackageTagProps> = ({
  children,
  isKeyword = false,
  language,
  value,
  label = value,
  zIndex,
  ...tagProps
}) => {
  const prop = isKeyword ? "keywords" : "tags";

  return (
    <NavLink
      aria-label={`Tag: ${label}`}
      to={getSearchPath({ [prop]: [value], language })}
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
