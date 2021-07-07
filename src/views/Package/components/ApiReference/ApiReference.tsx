import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { ApiReferenceJson } from "../../../../api/docgen/api-reference";
import { Class } from "./Class";
import { Enum } from "./Enum";
import { Interface } from "./Interface";
import { Section } from "./Section";
import { Struct } from "./Struct";

interface ApiReferenceProps extends ApiReferenceJson {}

export const ApiReference: FunctionComponent<ApiReferenceProps> = ({
  classes,
  constructs,
  enums,
  interfaces,
  structs,
}) => {
  return (
    <Box>
      <Heading size="2xl">Api Reference</Heading>
      <Section>
        <Heading size="xl">Constructs</Heading>
        {constructs.map((construct) => (
          <Class key={construct.id} {...construct} />
        ))}
      </Section>

      <Section>
        <Heading size="xl">Structs</Heading>
        {structs.map((struct) => (
          <Struct key={struct.id} {...struct} />
        ))}
      </Section>

      <Section>
        <Heading size="xl">Classes</Heading>
        {classes.map((construct) => (
          <Class key={construct.id} {...construct} />
        ))}
      </Section>

      <Section>
        <Heading size="xl">Interfaces</Heading>
        {interfaces.map((iface) => (
          <Interface key={iface.id} {...iface} />
        ))}
      </Section>

      <Section>
        <Heading size="xl">Enums</Heading>
        {enums.map((enu) => (
          <Enum key={enu.name} {...enu} />
        ))}
      </Section>
    </Box>
  );
};
