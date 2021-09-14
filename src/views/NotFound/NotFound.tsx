import { Button, Center, Flex } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { Page } from "../../components/Page";
import { Picture } from "../../components/Picture";

const bgSources = {
  optimal: [
    { media: "(max-width:1024px)", srcSet: "/assets/404-hive@50.webp" },
    { media: "(min-width:1024px)", srcSet: "/assets/404-hive@100.webp" },
    { media: "(min-width:1024px)", srcSet: "/assets/404-hive@100.png" },
  ],
  fallback: "/assets/404-hive@50.png",
};

export const NotFound: FunctionComponent = () => {
  return (
    <Page
      meta={{
        title: "Not Found",
        description: "Oops! The page you were looking for does not exist",
      }}
      pageName="notFound"
    >
      <Center h="100%" position="relative" w="100%">
        <Picture
          alt=""
          inset={0}
          position="absolute"
          sources={bgSources.optimal}
          src={bgSources.fallback}
          zIndex="hide"
        />
        <Flex align="center" direction="column" justify="center">
          <Picture
            alt="404 Image"
            sources={[{ srcSet: "/assets/robot.webp" }]}
            src="/assets/robot.png"
          />
          <Button as={Link} colorScheme="blue" to="/">
            Take Me Home
          </Button>
        </Flex>
      </Center>
    </Page>
  );
};
