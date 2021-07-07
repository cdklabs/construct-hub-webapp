import { UnorderedList, ListItem, Text, Code } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { FqnLink } from "../../../../components/FqnLink";

interface ExtensionsProps {
  prefix: string;
  items: {
    name: string;
    fqn?: string;
  }[];
}

export const Extensions: FunctionComponent<ExtensionsProps> = ({
  items,
  prefix,
}) => {
  return (
    <UnorderedList>
      <ListItem>
        <Text as="i">{prefix}: </Text>
        {items.map(({ name, fqn }) => {
          return fqn ? (
            <FqnLink fqn={fqn} key={fqn}>
              <Code p={2}>{name}</Code>
            </FqnLink>
          ) : (
            <Code key={fqn} p={2}>
              {name}
            </Code>
          );
        })}
      </ListItem>
    </UnorderedList>
  );
};
