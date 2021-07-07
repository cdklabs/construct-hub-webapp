import {
  Box,
  Code,
  Heading,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { PropertyJson } from "../../../../api/docgen/api-reference";
import { Markdown } from "../../../../components/Markdown";
import { TypeLink } from "./TypeLink";

interface PropertyProps extends PropertyJson {}

export const Property: FunctionComponent<PropertyProps> = ({
  id,
  name,
  deprecated,
  docs,
  optional,
  type,
  default: defaultValue,
}) => {
  return (
    <Box key={id}>
      <Heading size="sm">
        <Text as="span" decoration={deprecated ? "strikethrough" : undefined}>
          <Code>{name}</Code>
        </Text>
        <Text as="sup">{optional ? "Optional" : "Required"}</Text>
      </Heading>

      <UnorderedList>
        <ListItem>
          Type: <TypeLink {...type} />
        </ListItem>

        {defaultValue && (
          <ListItem>
            <Markdown>{`Default: ${defaultValue}`}</Markdown>
          </ListItem>
        )}
      </UnorderedList>

      <Markdown>{docs}</Markdown>
    </Box>
  );
};
