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

  const tags: PackageTagConfig[] = [
    ...packageTags.filter((tag) => Boolean(tag.keyword)),
    ...keywords
      .filter((v) => Boolean(v) && !KEYWORD_IGNORE_LIST.has(v))
      .map((label) => ({
        id: label,
        keyword: {
          label,
        },
      })),
  ];
  return (
    <>
      {tags.slice(0, 3).map(({ id, keyword: { label, color } = {} }) => (
        <PackageTag key={id} value={id} variant={color}>
          {label}
        </PackageTag>
      ))}
    </>
  );
};
