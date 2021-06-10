import { Box, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useQueryParams } from "../../hooks/useQueryParams";
import { Logo } from "../../icons/Logo";

export function Header() {
  const q = useQueryParams().get("q") ?? "";
  const [searchValue, setSearchValue] = useState(q);
  const history = useHistory();
  const onSearchChange = (evt: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(evt.target.value);
  };
  const onSearchSubmit = (evt: React.FormEvent): void => {
    evt.preventDefault();
    history.push(`/search?q=${searchValue}`);
  };
  return (
    <Box
      bg="white"
      boxShadow="base"
      data-testid="header"
      position="sticky"
      px={2}
      py={3}
      top={0}
      w="100%"
      zIndex={10}
    >
      <Flex
        alignItems="center"
        as="header"
        justifyContent="space-between"
        w="100%"
      >
        <Flex>
          <Logo height={12} mr={4} width={12} />
          <Heading as="h1" size="xl">
            Construct Hub
          </Heading>
        </Flex>
        <Box width={0.3}>
          <form onSubmit={onSearchSubmit}>
            <Input
              id="search"
              name="search"
              onChange={onSearchChange}
              placeholder="search"
              value={searchValue}
            />
          </form>
        </Box>
        <Flex>
          <Box px={1}>
            <Text>Getting Started</Text>
          </Box>
          <Box px={1}>
            <Text>Browse</Text>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
