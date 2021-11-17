import { FunctionComponent } from "react";
import { PackageTagConfig } from "../../api/config";
import { KEYWORD_IGNORE_LIST } from "../../constants/keywords";
import { PackageTag } from "../PackageTag";
import { usePackageCard } from "./PackageCard";

interface TagObject extends PackageTagConfig {
  isKeyword?: boolean;
}

export const Tags: FunctionComponent = () => {
  const {
    keywords = [],
    metadata: { packageTags = [] },
  } = usePackageCard();

  const tags: TagObject[] = [
    ...packageTags
      .filter((tag) => Boolean(tag.keyword))
      .map((t) => ({ ...t, isKeyword: false })),

    ...keywords
      .filter((label) => Boolean(label) && !KEYWORD_IGNORE_LIST.has(label))
      .map((label) => ({
        id: label,
        isKeyword: true,
        keyword: {
          label,
        },
      })),
  ];
  return (
    <>
      {tags
        .slice(0, 10)
        .map(({ id, isKeyword, keyword: { label, color } = {} }) => (
          <PackageTag isKeyword={isKeyword} key={id} value={id} variant={color}>
            {label}
          </PackageTag>
        ))}
    </>
  );
};
