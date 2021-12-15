import { FunctionComponent } from "react";
import { useRecoilState } from "recoil";
import { PackageTagConfig } from "../../api/config";
import { useConfigValue } from "../../hooks/useConfigValue";
import { tagsState } from "../../state/search";
import { CheckboxFilter } from "./CheckboxFilter";

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

  const [tags, setTags] = useRecoilState(tagsState);

  const onTagsChange = (tag: string) => {
    setTags(
      tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag]
    );
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
