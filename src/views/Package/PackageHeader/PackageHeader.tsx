import { Divider, Flex, Spinner } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { LanguageSelection } from "../LanguageSelection";
import { usePackageState } from "../PackageState";
import { Details } from "./Details";
import { HeaderContainer, GRID_AREAS } from "./HeaderContainer";
import { Heading } from "./Heading";
import { Install } from "./Install";

export const PackageHeader: FunctionComponent = () => {
  const { assembly, metadata, version } = usePackageState();

  const { data: asm } = assembly;
  const { data: meta } = metadata;

  return asm && meta ? (
    <HeaderContainer>
      <Heading
        assembly={asm}
        description={asm.description}
        gridArea={GRID_AREAS.HEADING}
        metadata={meta}
        name={asm.name}
        version={version}
      />
      <Flex align="start" gridArea={GRID_AREAS.LANGUAGES}>
        <LanguageSelection />
      </Flex>

      <Flex direction="column" gridArea={GRID_AREAS.META}>
        <Divider borderBottom="base" display={{ md: "none" }} mb={2} />

        <Details />

        <Divider borderBottom="base" display={{ md: "none" }} mt={2} />
      </Flex>

      <Flex align="start" gridArea={GRID_AREAS.INSTALL}>
        <Install />
      </Flex>
    </HeaderContainer>
  ) : (
    <Spinner mx="auto" my={10} size="xl" />
  );
};
