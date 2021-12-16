import { FunctionComponent, useMemo } from "react";
import { QUERY_PARAMS } from "../../constants/url";
import { useSearchContext } from "../../contexts/Search";
import { CheckboxFilter } from "./CheckboxFilter";
import testIds from "./testIds";
import { useSearchParam } from "./useSearchParam";
import { useUpdateSearchParam } from "./useUpdateSearchParam";
import { parseQueryArray } from "./util";

export const KeywordsFilter: FunctionComponent = () => {
  const keywords = useSearchParam(QUERY_PARAMS.KEYWORDS, parseQueryArray);
  const keywordMap = useSearchContext()!.keywords;
  const updateSearch = useUpdateSearchParam();

  const onKeywordChange = (keyword: string) => {
    updateSearch({
      keywords: keywords.includes(keyword)
        ? keywords.filter((k) => k !== keyword)
        : [...keywords, keyword],
    });
  };

  const keywordOptions = useMemo(() => {
    const baseOptions = [...keywordMap.entries()]
      .sort(([, count1], [, count2]) => {
        return count1 < count2 ? 1 : -1;
      })
      .filter(([keyword]) => !keywords.includes(keyword))
      .map(([keyword]) => ({
        display: keyword,
        value: keyword,
      }))
      .slice(0, 25);

    const keywordsNotInOptions = keywords.filter(
      (k) => !baseOptions.some((opt) => opt.value === k)
    );

    return [
      ...keywordsNotInOptions.map((k) => ({ display: k, value: k })),
      ...baseOptions,
    ];
  }, [keywordMap, keywords]);

  return (
    <CheckboxFilter
      data-testid={testIds.languagesFilter}
      hint="Focus the results by choosing one or more keywords reflecting the kind of construct you're looking for. Keywords are provided by construct authors."
      initialItemCount={5}
      name="Keywords"
      onValueChange={onKeywordChange}
      options={keywordOptions}
      values={keywords}
    />
  );
};
