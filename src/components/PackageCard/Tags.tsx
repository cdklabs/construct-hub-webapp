import { FunctionComponent } from "react";
import { usePackageCard } from "./PackageCard";
import { tagObjectsFrom } from "../../util/package";
import { PackageTag } from "../PackageTag";

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
      {tags.slice(0, 10).map(({ id, keyword: { label, color } = {} }) => (
        <PackageTag key={id} value={id} variant={color}>
          {label}
        </PackageTag>
      ))}
    </>
  );
};
