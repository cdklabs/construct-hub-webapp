import { PackageHighlight, PackageTagConfig } from "../api/config";
import { KEYWORD_IGNORE_LIST } from "../constants/keywords";

export interface TagObject extends PackageTagConfig {
  isKeyword?: boolean;
}

/**
 * Reduces package tags to only return highlight tags
 */
export const reduceHighlights = (packageTags?: PackageTagConfig[]) => {
  if (!packageTags || packageTags.length < 1) return [];

  return packageTags.reduce(
    (accum: PackageHighlight[], tag: PackageTagConfig): PackageHighlight[] => {
      if (tag.highlight) {
        return [...accum, tag.highlight];
      }

      return accum;
    },
    []
  );
};

/**
 * Maps packageTags to an array of TagObjects, which can be rendered by the PackageTags Component
 */
export const mapPackageTags = (
  packageTags?: PackageTagConfig[]
): TagObject[] => {
  return (packageTags ?? [])
    .filter((tag) => {
      return Boolean(tag.keyword?.label);
    })
    .map((tag) => ({
      ...tag,
      isKeyword: false,
    }));
};

/**
 * Maps keywords to an array of TagObjects, which can be rendered by the PackageTags component
 */
export const mapPackageKeywords = (keywords?: string[]): TagObject[] => {
  if (!keywords || keywords.length < 1) return [];

  return keywords
    .filter((label) => Boolean(label) && !KEYWORD_IGNORE_LIST.has(label))
    .map((label) => ({
      id: label,
      isKeyword: true,
      keyword: {
        label,
      },
    }));
};

/**
 * Maps packageTags and keywords to a list of TagObjects, using mapPackageTags and mapPackageKeywords
 */
export const mapPackageTagsAndKeywords = ({
  packageTags,
  keywords,
}: {
  packageTags?: PackageTagConfig[];
  keywords?: string[];
}): TagObject[] => {
  return [...mapPackageTags(packageTags), ...mapPackageKeywords(keywords)];
};
