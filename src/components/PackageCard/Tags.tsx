import { FunctionComponent } from "react";
import { OFFICIAL_SCOPES } from "../../constants/constructs";
import { KEYWORD_IGNORE_LIST } from "../../constants/keywords";
import { PackageTag } from "../PackageTag";
import { usePackageCard } from "./PackageCard";

// TODO: Proper tag implemenation, this is only a visual placeholder
export const Tags: FunctionComponent = () => {
  const { keywords, name } = usePackageCard();

  return (
    <>
      {[
        OFFICIAL_SCOPES.some((scope) => name.includes(scope)) ? (
          <PackageTag
            key="official"
            label="official"
            mr={1}
            value="@aws-cdk"
            variant="official"
          >
            Official
          </PackageTag>
        ) : null,
        ...(keywords ?? [])
          .filter((v) => Boolean(v) && !KEYWORD_IGNORE_LIST.has(v))
          .slice(0, 3)
          .map((tag) => {
            return (
              <PackageTag
                key={tag}
                mr={1}
                value={`"${tag}"`}
                zIndex="0 !important"
              >
                {tag}
              </PackageTag>
            );
          }),
      ]}
    </>
  );
};
