import { Box, Flex, Button, Text } from "@chakra-ui/react";
import type { Language } from "../../constants/languages";
import { useLanguage } from "../../contexts/Language";
import { LanguageBar } from "../LanguageBar";

/**
 * Represents markup for the "Client Libraries" card in the Getting Started section.
 */
export function ClientLibraries({ targets }: { targets: Language[] }) {
  const [language, setLanguage] = useLanguage();

  return (
    <Flex
      border="1px solid"
      borderColor="gray.100"
      borderRadius="md"
      boxShadow="base"
      direction="column"
      m={4}
    >
      <Box px={2}>
        <Text
          color="gray.500"
          fontWeight="semibold"
          my={2}
          textTransform="uppercase"
        >
          Client Libraries
        </Text>
        <LanguageBar
          selectedLanguage={targets.includes(language) ? language : targets[0]}
          setSelectedLanguage={setLanguage}
          showDisabled
          targetLanguages={targets}
        />
      </Box>
      {/* TODO: "Use Construct" Button */}
      <Flex
        bg="gray.50"
        borderTop="1px solid"
        // eslint-disable-next-line react/jsx-sort-props
        borderColor="gray.100"
        justify="end"
        p={2}
      >
        <Button colorScheme="blue" disabled>
          Use Construct
        </Button>
      </Flex>
    </Flex>
  );
}
