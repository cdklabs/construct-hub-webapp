import { FunctionComponent, useState } from "react";
import { CheckboxFilter } from "./CheckboxFilter";
import testIds from "./testIds";

// TODO: This filter is currently non-functional
export const AuthorFilter: FunctionComponent = () => {
  const [authors, setAuthors] = useState<string[]>([]);

  const onAuthorsChange = (author: string) => {
    setAuthors(
      authors.includes(author)
        ? authors.filter((a) => a !== author)
        : [...authors, author]
    );
  };

  return (
    <CheckboxFilter
      data-testid={testIds.authorFilter}
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
  );
};
