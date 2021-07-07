import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent, ReactNode } from "react";
import { MethodJson } from "../../../../api/docgen/api-reference";
import { Markdown } from "../../../../components/Markdown";
import { Property } from "./Property";

interface MethodProps extends Omit<MethodJson, "name"> {
  name: ReactNode;
}

export const Method: FunctionComponent<MethodProps> = ({
  name,
  parameters,
  snippet,
}) => {
  return (
    <Box>
      <Heading size="md">{name}</Heading>
      <Markdown>{snippet}</Markdown>
      {parameters.map((props) => (
        <Property key={props.id} {...props} />
      ))}
    </Box>
  );
};
