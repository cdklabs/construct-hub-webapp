import {
  Box,
  Flex,
  Link,
  ListItem,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import type { Assembly } from "jsii-reflect";
import { ReactNode, useMemo } from "react";
import type { Metadata } from "../../api/package/metadata";
import { DependencyDropdown } from "../DependencyDropdown";

export interface OperatorAreaProps {
  assembly?: Assembly;
  metadata: Metadata;
}

export function OperatorArea({ assembly, metadata }: OperatorAreaProps) {
  const details: ReactNode[] = useMemo(() => {
    if (!metadata) return [];

    const {
      date,
      publisher: { username },
      links: { repository },
    } = metadata;

    const items = [];

    if (date) {
      items.push(`Published ${date}`);
    }

    if (username) {
      items.push(`Module managed by ${username}`);
    }

    if (repository) {
      items.push(
        <>
          Source code:{" "}
          <Link
            color="blue.500"
            href={repository}
            target="_blank"
            rel="no-referrer"
          >
            github.
          </Link>
        </>
      );
    }

    return items.map((detail: string | ReactNode, i: number) => (
      <ListItem key={`detail-${i}`} listStyleType="none" my={1}>
        <Text>{detail}</Text>
      </ListItem>
    ));
  }, [metadata]);

  return (
    <Flex direction="column">
      {details.length && <UnorderedList ml={0}>{details}</UnorderedList>}
      {assembly?.spec?.dependencies && (
        <Box my={4}>
          <DependencyDropdown dependencies={assembly.spec.dependencies} />
        </Box>
      )}
    </Flex>
  );
}
