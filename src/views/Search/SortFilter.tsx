import { FunctionComponent } from "react";
import { CatalogSearchSort } from "../../api/catalog-search/constants";
import { SORT_RENDER_MAP } from "./constants";
import { RadioFilter } from "./RadioFilter";
import { useSort } from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";

export const SortFilter: FunctionComponent = () => {
  const sort = useSort();
  const updateSearch = useUpdateSearchParam();

  const onSortChange = (newSort: string) => {
    updateSearch({
      sort: newSort ? (newSort as CatalogSearchSort) : undefined,
    });
  };

  return (
    <RadioFilter
      hint="Sets the order of search results"
      name="Sorted By"
      onValueChange={onSortChange}
      options={[
        { display: "Relevance", value: "" },
        ...Object.entries(SORT_RENDER_MAP).map(([value, display]) => ({
          display,
          value,
        })),
      ]}
      value={sort ?? ""}
    />
  );
};
