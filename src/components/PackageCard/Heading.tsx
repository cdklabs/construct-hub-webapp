import {
  Flex,
  Heading as ChakraHeading,
  LinkOverlay,
  Text,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { eventName } from "../../contexts/Analytics";
import { useLanguage } from "../../hooks/useLanguage";
import { getPackagePath } from "../../util/url";
import { CDKTypeBadge } from "../CDKType";
import { EditorsNote } from "./EditorsNote";
import { usePackageCard } from "./PackageCard";
import testIds from "./testIds";

export const Heading: FunctionComponent = () => {
  const [currentLanguage] = useLanguage();
  const {
    dataEvent,
    description,
    comment,
    constructFrameworks,
    name,
    version,
  } = usePackageCard();

  return (
    <>
      <LinkOverlay
        as={Link}
        data-event={
          dataEvent ? eventName(dataEvent, "Package Card", name) : undefined
        }
        to={getPackagePath({
          name,
          version,
          language: currentLanguage,
        })}
      >
        <Flex align="center">
          <CDKTypeBadge
            constructFrameworks={constructFrameworks}
            mr={2}
            zIndex={1}
          />
          <ChakraHeading
            as="h3"
            color="textPrimary"
            data-testid={testIds.title}
            fontSize="md"
            fontWeight="bold"
            wordBreak="normal"
          >
            {name}
          </ChakraHeading>
        </Flex>
      </LinkOverlay>
      {comment ? (
        <EditorsNote comment={comment} />
      ) : (
        <Text
          color="textPrimary"
          data-testid={testIds.description}
          fontSize="md"
          lineHeight="tall"
          noOfLines={4}
        >
          {description || "No description available."}
        </Text>
      )}
    </>
  );
};
