import { FunctionComponent, useState } from "react";
import { Filter } from "./Filter";

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
  );
};
