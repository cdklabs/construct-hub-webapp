import { PackageHighlight, PackageTagConfig } from "../api/config";
import { KEYWORD_IGNORE_LIST } from "../constants/keywords";

export interface TagObject extends PackageTagConfig {}

/**
 * Reduces package tags to only return highlight tags
 */
export const highlightsFrom = (packageTags?: PackageTagConfig[]) => {
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
      id: tag.keyword?.label!,
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
      keyword: {
        label,
      },
    }));
};

/**
 * Maps packageTags and keywords to a list of TagObjects, using mapPackageTags and mapPackageKeywords
 */
export const tagObjectsFrom = ({
  packageTags,
  keywords,
}: {
  packageTags?: PackageTagConfig[];
  keywords?: string[];
}): TagObject[] => {
  const tagObjects = new Array<TagObject>();
  const tagLabels = new Set<string>();

  for (const tag of [
    ...mapPackageTags(packageTags),
    ...mapPackageKeywords(keywords),
  ]) {
    const label = tag.keyword!.label.toLowerCase();
    if (!tagLabels.has(label)) {
      tagObjects.push(tag);
      tagLabels.add(label);
    }
  }

  return tagObjects;
};
