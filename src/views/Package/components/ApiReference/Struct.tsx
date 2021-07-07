import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { StructJson } from "../../../../api/docgen/api-reference";
import { Markdown } from "../../../../components/Markdown";
import { sanitize } from "../../../../util/sanitize-anchor";
import { Property } from "./Property";

interface StructProps extends StructJson {}

export const Struct: FunctionComponent<StructProps> = ({
  id,
  docs,
  initializer,
  name,
  properties,
}) => {
  return (
    <Box>
      <Heading id={sanitize(id)} size="lg">
        {name}
      </Heading>
      {docs && <Markdown>{docs}</Markdown>}
      <Heading size="md">Initializer</Heading>
      <Markdown>{initializer}</Markdown>

      {properties.length > 0 && (
        <Box>
          <Heading size="md">Properties</Heading>
          {properties.map((property) => {
            return <Property key={property.id} {...property} />;
          })}
        </Box>
      )}
    </Box>
  );
};
