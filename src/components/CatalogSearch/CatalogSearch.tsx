import { Grid } from "@chakra-ui/react";
import type { FormEventHandler, FunctionComponent } from "react";
import { Form } from "../Form";
import {
  CatalogSearchInputs,
  CatalogSearchInputsProps,
} from "./CatalogSearchInputs";
import testIds from "./testIds";

export interface CatalogSearchProps extends CatalogSearchInputsProps {
  /**
   * Called when the catalog search form is submitted (via enter keypress or submit click)
   */
  onSubmit: FormEventHandler<HTMLFormElement>;
}

export const CatalogSearch: FunctionComponent<CatalogSearchProps> = ({
  onSubmit,
  ...props
}) => {
  return (
    <Form data-testid={testIds.form} onSubmit={onSubmit}>
      <Grid
        autoRows="1fr"
        gap={4}
        templateColumns={{ sm: "1fr", md: "3fr 1fr 1fr" }}
        width="full"
      >
        <CatalogSearchInputs {...props} />
      </Grid>
    </Form>
  );
};
