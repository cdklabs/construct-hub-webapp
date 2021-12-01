import { Flex, Text, Tag, TagLabel, TagCloseButton } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useSearchState } from "./SearchState";
import testIds from "./testIds";

export interface SearchDetailsProps {
  limit: number;
  offset: number;
  count: number;
  filtered: boolean;
}

const Em: FunctionComponent = ({ children }) => (
  <Text as="strong" color="gray.700">
    {children}
  </Text>
);

const Count: FunctionComponent<{
  first: number;
  count: number;
  last: number;
}> = ({ first, count, last }) => {
  if (!first && last >= count) {
    return (
      <>
        <Em>{count}</Em> of <Em>{count}</Em>
      </>
    );
  }

  return (
    <>
      <Em>
        {count ? first + 1 : count} - {last > count ? count : last}
      </Em>{" "}
      of <Em>{count}</Em>
    </>
  );
};

export const SearchDetails: FunctionComponent<SearchDetailsProps> = ({
  limit,
  offset,
  count,
  filtered,
}) => {
  const { query, searchAPI } = useSearchState();

  const { keywords, setKeywords } = searchAPI;
  const first = limit * offset;
  const last = first + limit;
  const hasResults = count > 0;
  const hasQuery = Boolean(query);
  const hasKeywords = Boolean(keywords?.length);
  const keywordTerm = (keywords?.length ?? 0) > 1 ? "keywords" : "keyword";

  const getOnKeywordClick = (kw: string) => () => {
    setKeywords((currentKeywords) => currentKeywords.filter((k) => k !== kw));
  };

  return (
    <Text data-testid={testIds.searchDetails}>
      {hasResults ? (
        <>
          Displaying <Count count={count} first={first} last={last} />{" "}
          {filtered ? "search results" : "constructs"}
        </>
      ) : (
        <>{filtered ? "There were no search results" : "No constructs found"}</>
      )}
      {hasQuery && (
        <>
          {" for "}
          <Em>{query}</Em>
        </>
      )}
      {hasKeywords && (
        <>
          {" with "}
          {keywordTerm}{" "}
          <Flex
            align="center"
            display="inline-flex"
            maxW="full"
            overflow="hidden"
            sx={{ gap: "0.5rem" }}
            wrap="wrap"
          >
            {keywords!.map((kw) => (
              <Tag key={kw}>
                <TagLabel>{kw}</TagLabel>
                <TagCloseButton onClick={getOnKeywordClick(kw)} />
              </Tag>
            ))}
          </Flex>
        </>
      )}
      {!hasResults && filtered && <> Try a different term.</>}
    </Text>
  );
};
