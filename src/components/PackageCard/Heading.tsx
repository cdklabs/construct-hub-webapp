import {
  Flex,
  Image,
  Heading as ChakraHeading,
  LinkOverlay,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import { useLanguage } from "../../hooks/useLanguage";
import { getPackagePath } from "../../util/url";
import { usePackageCard } from "./PackageCard";
import testIds from "./testIds";

export const Heading: FunctionComponent = () => {
  const [currentLanguage] = useLanguage();
  const {
    comment,
    description,
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
              label={
                CDKTYPE_RENDER_MAP[cdkType].name +
                (cdkVersion !== undefined ? ` v${cdkVersion}` : "")
              }
              placement="top"
            >
              <Image
                alt={`${CDKTYPE_RENDER_MAP[cdkType].name} icon`}
                h={5}
                mr={2}
                src={CDKTYPE_RENDER_MAP[cdkType].imgsrc}
                w={5}
                zIndex={1}
              />
            </Tooltip>
          )}
          <ChakraHeading
            as="h3"
            color="blue.800"
            data-testid={testIds.title}
            fontSize="md"
            fontWeight="bold"
          >
            {name}
          </ChakraHeading>
        </Flex>
      </LinkOverlay>
      <Text
        color="blue.800"
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
