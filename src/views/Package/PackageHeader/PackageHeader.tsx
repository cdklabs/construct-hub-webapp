import { Box, Divider, Spinner } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { LanguageSelection } from "../LanguageSelection";
import { usePackageState } from "../PackageState";
import { Details } from "./Details";
import { HeaderContainer, GRID_AREAS } from "./HeaderContainer";
import { Heading } from "./Heading";
import { Install } from "./Install";

export const PackageHeader: FunctionComponent = () => {
  const { assembly, metadata } = usePackageState();

  const { data: asm } = assembly;
  const { data: meta } = metadata;

  return asm && meta ? (
    <HeaderContainer>
      <Heading
        description={asm.description}
        gridArea={GRID_AREAS.HEADING}
        metadata={meta}
        name={asm.name}
      />

      <Box gridArea={GRID_AREAS.META}>
        <Divider borderBottom="base" display={{ md: "none" }} />

        <Details />

        <Divider borderBottom="base" display={{ md: "none" }} mt={2} />
      </Box>

      <Box gridArea={GRID_AREAS.LANGUAGES}>
        <LanguageSelection assembly={asm} />
        <Box display={{ md: "none" }}></Box>
      </Box>

      <Install gridArea={GRID_AREAS.INSTALL} />
    </HeaderContainer>
  ) : (
    <Spinner mx="auto" my={10} size="xl" />
  );
};
