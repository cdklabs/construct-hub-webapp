import { FunctionComponent } from "react";
import { PackageTagConfig } from "../../api/config";
import { KEYWORD_IGNORE_LIST } from "../../constants/keywords";
import { PackageTag } from "../PackageTag";
import { usePackageCard } from "./PackageCard";

export const Tags: FunctionComponent = () => {
  const {
    keywords = [],
    metadata: { packageTags = [] },
  } = usePackageCard();

  // Official is special cased and shown in the Highlight
  const tags: PackageTagConfig[] = [
    ...packageTags.filter((t) => t.label !== "Official"),
    ...keywords
      .filter((v) => Boolean(v) && !KEYWORD_IGNORE_LIST.has(v))
      .map((label) => ({
        label,
      })),
  ];
  return (
    <>
      {tags.slice(0, 3).map(({ label, color }) => (
        <PackageTag key={label} mr={1} value={label} variant={color}>
          {label}
        </PackageTag>
      ))}
    </>
  );
};
