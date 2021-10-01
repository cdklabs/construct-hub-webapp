import { Heading as ChakraHeading, LinkOverlay, Text } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { getPackagePath } from "../../util/url";
import { usePackageCard } from "./PackageCard";
import testIds from "./testIds";

export const Heading: FunctionComponent = () => {
  const [currentLanguage] = useLanguage();
  const { name, description, version, comment } = usePackageCard();

  return (
    <>
      <LinkOverlay
        as={Link}
        to={getPackagePath({
          name,
          version,
          language: currentLanguage,
        })}
      >
        <ChakraHeading
          as="h3"
          color="blue.800"
          data-testid={testIds.title}
          fontSize="md"
          fontWeight="bold"
        >
          {name}
        </ChakraHeading>
      </LinkOverlay>
      <Text
        data-testid={testIds.description}
        fontSize="md"
        lineHeight="tall"
        noOfLines={4}
      >
        {description || "No description available."}
      </Text>
      {comment && (
        <Text
          data-testid={testIds.comment}
          fontSize="md"
          lineHeight="tall"
          noOfLines={4}
        >
          <Text
            as="span"
            color="blue.500"
            fontSize="md"
            fontWeight="bold"
            lineHeight="tall"
          >
            Editor&apos;s note:{" "}
          </Text>
          {comment}
        </Text>
      )}
    </>
  );
};
