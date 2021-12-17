import { FunctionComponent } from "react";
import { PackageTagConfig } from "../../api/config";
import { useConfigValue } from "../../hooks/useConfigValue";
import { CheckboxFilter } from "./CheckboxFilter";
import { useTags } from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";

interface FilterGroups {
  [group: string]: PackageTagConfig[];
}

export const TagFilter: FunctionComponent = () => {
  const filterableTags =
    useConfigValue("packageTags")?.filter((tag) => Boolean(tag.searchFilter)) ??
    [];

  const tagFilterGroups: FilterGroups = filterableTags.reduce(
    (accum: FilterGroups, tag: PackageTagConfig): FilterGroups => {
      const groupName = tag.searchFilter?.groupBy;
      if (groupName) {
        return {
          ...accum,
          [groupName]: [...(accum[groupName] ?? []), tag],
        };
      }
      return accum;
    },
    {}
  );

  const tags = useTags();
  const updateSearch = useUpdateSearchParam();

  const onTagsChange = (tag: string) => {
    updateSearch({
      tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    });
  };

  return (
    <>
      {Object.entries(tagFilterGroups).map(([title, tagItems]) => {
        return (
          <CheckboxFilter
            key={title}
            name={title}
            onValueChange={onTagsChange}
            options={tagItems.map((tag) => {
              return {
                display: tag.searchFilter!.display,
                value: tag.id,
              };
            })}
            values={tags}
          />
        );
      })}
    </>
  );
};
