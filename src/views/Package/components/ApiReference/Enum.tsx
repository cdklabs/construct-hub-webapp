import { Box, Heading } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { EnumJson } from "../../../../api/docgen/api-reference";
import { Markdown } from "../../../../components/Markdown";
import { sanitize } from "../../../../util/sanitize-anchor";
import { EnumMember } from "./EnumMember";

interface EnumProps extends EnumJson {}

export const Enum: FunctionComponent<EnumProps> = ({ name, docs, members }) => {
  return (
    <Box>
      <Heading id={sanitize(name)} size="lg">
        {name}
      </Heading>
      {docs && <Markdown>{docs}</Markdown>}
      {members.length > 0 && (
        <Box>
          {members.map((member) => {
            return <EnumMember key={member.id} {...member} />;
          })}
        </Box>
      )}
    </Box>
  );
};
