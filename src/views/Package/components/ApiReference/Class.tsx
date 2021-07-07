import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { ClassJson } from "../../../../api/docgen/api-reference";
import { Markdown } from "../../../../components/Markdown";
import { sanitize } from "../../../../util/sanitize-anchor";
import { Extensions } from "./Extensions";
import { Method } from "./Method";
import { Property } from "./Property";

interface ClassProps extends ClassJson {}

export const Class: FunctionComponent<ClassProps> = ({
  id,
  docs,
  initializer,
  interfaces,
  instanceMethods,
  name,
  properties,
  staticMethods,
}) => {
  return (
    <Box>
      <Heading id={sanitize(id)} size="lg">
        {name}
      </Heading>
      {interfaces.length > 0 && (
        <Extensions items={interfaces} prefix="Implements" />
      )}
      {docs && <Markdown>{docs}</Markdown>}
      {initializer && (
        <Method key={initializer.id} name="Initializer" {...initializer} />
      )}

      {instanceMethods.length > 0 && (
        <Box>
          <Heading size="md">Methods</Heading>
          {instanceMethods.map((method) => {
            return <Method key={method.name} {...method} />;
          })}
        </Box>
      )}

      {staticMethods.length > 0 && (
        <Box>
          <Heading size="md">StaticMethods</Heading>
          {staticMethods.map((method) => {
            return <Method key={method.name} {...method} />;
          })}
        </Box>
      )}

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
