import { FunctionComponent } from "react";
import { KEYWORD_IGNORE_LIST } from "../../constants/keywords";
import { PackageTag } from "../PackageTag";
import { usePackageCard } from "./PackageCard";

// TODO: Proper tag implemenation, this is only a visual placeholder
export const Tags: FunctionComponent = () => {
  const { keywords, name } = usePackageCard();

  return (
    <>
      {[
        name.startsWith("@aws-cdk/") ? (
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
