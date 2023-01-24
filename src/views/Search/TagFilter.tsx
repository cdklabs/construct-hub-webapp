import { FunctionComponent, useCallback, useMemo } from "react";
import { CheckboxFilter } from "./CheckboxFilter";
import { RadioFilter } from "./RadioFilter";
import { useTags } from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";
import { PackageTagConfig, TagGroupConfig } from "../../api/config";
import { useConfigValue } from "../../hooks/useConfigValue";

interface FilterGroup extends Partial<TagGroupConfig> {
  id: string;
  tags: PackageTagConfig[];
}
interface FilterGroups {
  [group: string]: FilterGroup;
}

/**
 * Creates a plain object map of FilterGroups keyed by group id
 */
export const mapTagsToFilterGroups = (
  packageTags: PackageTagConfig[],
  tagGroupsMap: Map<string, TagGroupConfig>
): FilterGroups => {
  return packageTags.reduce(
    (accum: FilterGroups, tag: PackageTagConfig): FilterGroups => {
      const groupIdOrName = tag.searchFilter?.groupBy;
      const customGroup = groupIdOrName
        ? tagGroupsMap.get(groupIdOrName)
        : undefined;

      if (groupIdOrName && customGroup) {
        const entry = accum[groupIdOrName];
        if (entry) {
          entry.tags = [...entry.tags, tag];
          return accum;
        }

        return {
          ...accum,
          [groupIdOrName]: {
            ...customGroup,
            tags: [tag],
          },
        };
      }

      if (groupIdOrName) {
        return {
          ...accum,
          [groupIdOrName]: {
            id: groupIdOrName,
            tags: [...(accum?.[groupIdOrName]?.tags ?? []), tag],
          },
        };
      }
      return accum;
    },
    {}
  );
};

export const TagFilter: FunctionComponent = () => {
  const packageTags = useConfigValue("packageTags");
  const packageTagGroups = useConfigValue("packageTagGroups");

  const tagFilterGroups: FilterGroups = useMemo(() => {
    const tagGroupsMap = new Map<string, TagGroupConfig>();
    packageTagGroups?.forEach((group) => {
      tagGroupsMap.set(group.id, group);
    });

    const filterableTags =
      packageTags?.filter((tag) => Boolean(tag.searchFilter)) ?? [];

    return mapTagsToFilterGroups(filterableTags, tagGroupsMap);
  }, [packageTags, packageTagGroups]);

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
