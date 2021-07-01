import {
  Box,
  Flex,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import { FunctionComponent, ReactNode, useMemo } from "react";
import type { Metadata } from "../../api/package/metadata";
import { DependencyDropdown } from "../../components/DependencyDropdown";
import { Card } from "../Card";
import { Time } from "../Time";

export interface OperatorAreaProps {
  assembly?: Assembly;
  metadata: Metadata;
}

export const OperatorArea: FunctionComponent<OperatorAreaProps> = ({
  assembly,
  metadata,
}) => {
  const details: ReactNode[] = useMemo(() => {
    if (!metadata) return [];

    const { date } = metadata;
    const username = assembly?.author.name;
    const repository = assembly?.repository.url;

    const items = [];

    if (date) {
      const publishDate = <Time date={new Date(date)} format="MMMM dd, yyyy" />;
      items.push(<>Published: {publishDate}</>);
    }

    if (username) {
      items.push(`Module managed by: ${username}`);
    }

    if (repository) {
      items.push(
        <>
          Source code:{" "}
          <Link
            color="blue.500"
            href={repository}
            rel="no-referrer"
            target="_blank"
          >
            Github
          </Link>
        </>
      );
    }

    return items.map((detail: string | ReactNode, i: number) => (
      <ListItem key={`detail-${i}`} listStyleType="none" my={1}>
        <Text color="gray.500">{detail}</Text>
      </ListItem>
    ));
  }, [metadata, assembly]);

  return (
    <Card as={Flex} direction="column">
      {details.length && <UnorderedList ml={0}>{details}</UnorderedList>}
      {assembly?.spec?.dependencies && (
        <Box mt={4}>
          <DependencyDropdown dependencies={assembly.spec.dependencies} />
        </Box>
      )}
    </Card>
  );
};
