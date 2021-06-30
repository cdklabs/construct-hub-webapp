import { Input } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { useCatalogSearch } from "../../hooks/useCatalogSearch";
import { Form } from "../Form";

export const HeaderSearch: FunctionComponent = () => {
  const { onQueryChange, onSubmit, query } = useCatalogSearch();
  return (
    <Form onSubmit={onSubmit}>
      <Input
        name="search"
        onChange={onQueryChange}
        placeholder="Search providers or modules"
        value={query}
      />
    </Form>
  );
};
