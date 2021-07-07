import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { InterfaceJson } from "../../../../api/docgen/api-reference";
import { Markdown } from "../../../../components/Markdown";
import { sanitize } from "../../../../util/sanitize-anchor";
import { Extensions } from "./Extensions";
import { Method } from "./Method";
import { Property } from "./Property";

interface InterfaceProps extends InterfaceJson {}

export const Interface: FunctionComponent<InterfaceProps> = ({
  id,
  docs,
  implementations,
  interfaces,
  instanceMethods,
  name,
  properties,
}) => {
  return (
    <Box>
      <Heading id={sanitize(id)} size="lg">
        {name}
      </Heading>
      {docs && <Markdown>{docs}</Markdown>}
      {interfaces.length > 0 && (
        <Extensions items={interfaces} prefix="Extends" />
      )}
      {implementations.length > 0 && (
        <Extensions items={implementations} prefix="Implemented By" />
      )}

      {properties.length > 0 && (
        <Box>
          <Heading size="md">Properties</Heading>
          {properties.map((property) => {
            return <Property key={property.id} {...property} />;
          })}
        </Box>
      )}

      {instanceMethods.length > 0 && (
        <Box>
          <Heading size="md">Methods</Heading>
          {instanceMethods.map((method) => {
            return <Method key={method.name} {...method} />;
          })}
        </Box>
      )}
    </Box>
  );
};
