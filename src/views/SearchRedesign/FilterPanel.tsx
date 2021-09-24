import { Heading, Stack } from "@chakra-ui/react";
import { FunctionComponent, useState } from "react";
import { Card } from "../../components/Card";
import {
  Language,
  LANGUAGE_NAME_MAP,
  TEMP_SUPPORTED_LANGUAGES,
} from "../../constants/languages";
import { Filter } from "./Filter";

const languageOptions = Object.entries(LANGUAGE_NAME_MAP)
  .filter(([key]) => TEMP_SUPPORTED_LANGUAGES.has(key as Language))
  .map(([key, value]) => ({
    display: value,
    value: key,
  }));

export interface FilterPanelProps {}

export const FilterPanel: FunctionComponent<FilterPanelProps> = () => {
  const [cdkType, setCdkType] = useState<string | undefined>();
  const [language, setLanguage] = useState<string | undefined>();
  const [author, setAuthor] = useState<string | undefined>();

  return (
    <Card borderRadius="none" boxShadow="none" p={4}>
      <Stack color="blue.800" spacing={6}>
        <Heading as="h3" size="sm">
          Filters
        </Heading>
        <Filter
          name="CDK Type"
          onValueChange={setCdkType}
          options={[
            {
              display: "AWS CDK",
              value: "awscdk",
            },
            {
              display: "CDK for Terraform",
              value: "cdktf",
            },
            {
              display: "CDK for Kubernetes",
              value: "cdk8s",
            },
          ]}
          value={cdkType}
        />
        <Filter
          name="Programming Language"
          onValueChange={setLanguage}
          options={languageOptions}
          value={language}
        />
        <Filter
          name="Author"
          onValueChange={setAuthor}
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
          value={author}
        />
      </Stack>
    </Card>
  );
};
