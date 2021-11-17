import { FunctionComponent } from "react";
import { tagObjectsFrom } from "../../util/package";
import { PackageTag } from "../PackageTag";
import { usePackageCard } from "./PackageCard";

export const Tags: FunctionComponent = () => {
  const {
    keywords = [],
    metadata: { packageTags = [] },
  } = usePackageCard();

  const tags = tagObjectsFrom({
    packageTags,
    keywords,
  });

  return (
    <>
      {tags
        .slice(0, 3)
        .map(({ id, isKeyword, keyword: { label, color } = {} }) => (
          <PackageTag isKeyword={isKeyword} key={id} value={id} variant={color}>
            {label}
          </PackageTag>
        ))}
    </>
  );
};
