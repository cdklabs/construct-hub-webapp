import { FunctionComponent, useCallback, useMemo } from "react";
import { PackageTagConfig, TagGroupConfig } from "../../api/config";
import { useConfigValue } from "../../hooks/useConfigValue";
import { CheckboxFilter } from "./CheckboxFilter";
import { RadioFilter } from "./RadioFilter";
import { useTags } from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";

interface FilterGroup extends Partial<TagGroupConfig> {
  id: string;
  tags: PackageTagConfig[];
}
interface FilterGroups {
  [group: string]: FilterGroup;
}

export const TagFilter: FunctionComponent = () => {
  const packageTags = useConfigValue("packageTags");
  const packageTagGroups = useConfigValue("packageTagGroups");

  const filterableTags = useMemo(
    () => packageTags?.filter((tag) => Boolean(tag.searchFilter)) ?? [],
    [packageTags]
  );

  const tagGroupsMap = useMemo(() => {
    const map = new Map<string, TagGroupConfig>();
    packageTagGroups?.forEach((group) => {
      map.set(group.id, group);
    });

    return map;
  }, [packageTagGroups]);

  const tagFilterGroups: FilterGroups = useMemo(
    () =>
      filterableTags.reduce(
        (accum: FilterGroups, tag: PackageTagConfig): FilterGroups => {
          const groupName = tag.searchFilter?.groupBy;
          const customGroup = groupName
            ? tagGroupsMap.get(groupName)
            : undefined;

          if (groupName && customGroup) {
            const entry = accum[groupName];
            if (entry) {
              entry.tags = [...entry.tags, tag];
              return accum;
            }

            return {
              ...accum,
              [groupName]: {
                ...customGroup,
                tags: [tag],
              },
            };
          }

          if (groupName) {
            return {
              ...accum,
              [groupName]: {
                id: groupName,
                tags: [...(accum?.[groupName]?.tags ?? []), tag],
              },
            };
          }
          return accum;
        },
        {}
      ),
    [filterableTags, tagGroupsMap]
  );

  const tags = useTags();
  const updateSearch = useUpdateSearchParam();

  const onTagsChange = (tag: string) => {
    updateSearch({
      tags: tags.includes(tag) ? tags.filter((t) => t !== tag) : [...tags, tag],
    });
  };

  const getOnRadioTagChange = useCallback(
    (groupName: string) => {
      const groupTags = new Set(
        (tagFilterGroups[groupName]?.tags ?? []).map(({ id }) => id)
      );

      return (tag: string) => {
        const filteredTags = tags.filter((t) => !groupTags.has(t));

        updateSearch({
          tags: tag ? [...filteredTags, tag] : filteredTags,
        });
      };
    },
    [tagFilterGroups, tags, updateSearch]
  );

  return (
    <>
      {Object.values(tagFilterGroups).map(
        ({ filterType, id, label, tooltip, tags: tagItems }) => {
          const sharedProps = {
            hint: tooltip,
            name: label ?? id,
            options: tagItems.map((tag) => {
              return {
                display: tag.searchFilter!.display,
                value: tag.id,
              };
            }),
          };

          if (filterType === "radio") {
            return (
              <RadioFilter
                {...sharedProps}
                key={id}
                onValueChange={getOnRadioTagChange(id)}
                options={[
                  { display: `Any ${sharedProps.name}`, value: "" },
                  ...sharedProps.options,
                ]}
                value={tagItems.find((t) => tags.includes(t.id))?.id ?? ""}
              />
            );
          }

          return (
            <CheckboxFilter
              {...sharedProps}
              key={id}
              onValueChange={onTagsChange}
              values={tags}
            />
          );
        }
      )}
    </>
  );
};
