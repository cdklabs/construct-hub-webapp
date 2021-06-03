import {
  Center,
  Flex,
  Link,
  ListItem,
  Text,
  Spinner,
  UnorderedList,
} from "@chakra-ui/react";
import { ReactNode, useMemo } from "react";
import type { Metadata } from "../../api/package";
import { UseRequestResponse } from "../../hooks/useRequest";

export interface OperatorAreaProps {
  metadata: UseRequestResponse<Metadata>;
}

export function OperatorArea({ metadata }: OperatorAreaProps) {
  const { data, loading } = metadata;

  const details: ReactNode[] = useMemo(() => {
    if (!data) return [];

    const {
      date,
      publisher: { username },
      links: { repository },
    } = data;

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
  }, [data]);

  if (!data || loading) {
    return (
      <Center>
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Flex>{details.length && <UnorderedList>{details}</UnorderedList>}</Flex>
  );
}
