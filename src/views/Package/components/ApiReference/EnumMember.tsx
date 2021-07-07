import { Box, Code, Heading, Text } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { EnumMemberJson } from "../../../../api/docgen/api-reference";
import { Markdown } from "../../../../components/Markdown";

interface EnumMemberProps extends EnumMemberJson {}

export const EnumMember: FunctionComponent<EnumMemberProps> = ({
  id,
  name,
  deprecated,
  docs,
}) => {
  return (
    <Box key={id}>
      <Heading size="sm">
        <Text as="span" decoration={deprecated ? "strikethrough" : undefined}>
          <Code>{name}</Code>
        </Text>
      </Heading>
      <Markdown>{docs}</Markdown>
    </Box>
  );
};
