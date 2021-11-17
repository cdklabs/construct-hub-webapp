import {
  Flex,
  Heading as ChakraHeading,
  LinkOverlay,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { getPackagePath } from "../../util/url";
import { CDKTypeIcon, CDKTypeText } from "../CDKType";
import { EditorsNote } from "./EditorsNote";
import { usePackageCard } from "./PackageCard";
import testIds from "./testIds";

export const Heading: FunctionComponent = () => {
  const [currentLanguage] = useLanguage();
  const {
    description,
    comment,
    metadata: { constructFramework },
    name,
    version,
  } = usePackageCard();

  const cdkType = constructFramework?.name;
  const cdkVersion = constructFramework?.majorVersion;

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
        <Flex align="center">
          {cdkType && (
            <Tooltip
              hasArrow
              label={<CDKTypeText majorVersion={cdkVersion} name={cdkType} />}
              placement="top"
            >
              <CDKTypeIcon mr={2} name={cdkType} zIndex={1} />
            </Tooltip>
          )}
          <ChakraHeading
            as="h3"
            color="blue.800"
            data-testid={testIds.title}
            fontSize="md"
            fontWeight="bold"
            wordBreak="break-all"
          >
            {name}
          </ChakraHeading>
        </Flex>
      </LinkOverlay>
      {comment ? (
        <EditorsNote comment={comment} />
      ) : (
        <Text
          color="blue.800"
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
