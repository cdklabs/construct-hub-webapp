import { Heading, Stack } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { Card } from "../../components/Card";
import { CDKType, CDKTYPE_NAME_MAP } from "../../constants/constructs";
import {
  Language,
  LANGUAGE_NAME_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { Filter } from "./Filter";
import { useSearchState } from "./SearchState";

const cdkTypeOptions = Object.entries(CDKTYPE_NAME_MAP).map(([key, value]) => ({
  display: value,
  value: key,
}));

const languageOptions = Object.entries(LANGUAGE_NAME_MAP)
  .filter(([key]) => TEMP_SUPPORTED_LANGUAGES.has(key as Language))
  .map(([key, value]) => ({
    display: value,
    value: key,
  }));

export interface FilterPanelProps {}

export const FilterPanel: FunctionComponent<FilterPanelProps> = () => {
  const { cdkType, languages, setLanguages, setCdkType } =
    useSearchState().searchAPI;
  const [authors, setAuthors] = useState<string[]>([]);

  const onCdkTypeChange = (type: string) => {
    const cdk = type as CDKType;
    setCdkType(cdk === cdkType ? undefined : cdk);
  };

  const onLanguagesChange = (lang: string) => {
    const language = lang as Language;

    setLanguages(
      languages.includes(language)
        ? languages.filter((l) => l !== language)
        : [...languages, language]
    );
  };

  const onAuthorsChange = (author: string) => {
    setAuthors(
      authors.includes(author)
        ? authors.filter((a) => a !== author)
        : [...authors, author]
    );
  };

  return (
    <Card borderRadius="none" boxShadow="none" p={4}>
      <Stack color="blue.800" spacing={6}>
        <Heading as="h3" size="sm">
          Filters
        </Heading>
        <Filter
          name="CDK Type"
          onValueChange={onCdkTypeChange}
          options={cdkTypeOptions}
          values={cdkType ? [cdkType] : []}
        />
        <Filter
          name="Programming Language"
          onValueChange={onLanguagesChange}
          options={languageOptions}
          values={languages}
        />
        <Filter
          name="Author"
          onValueChange={onAuthorsChange}
          options={[
            {
              display: "Community",
              value: "community",
            },
            {
              display: "AWS",
              value: "aws",
            },
          ]}
          values={authors}
        />
      </Stack>
    </Card>
  );
};
