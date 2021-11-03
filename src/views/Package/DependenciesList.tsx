import { Center, Stack } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { sanitizeVersion } from "../../api/package/util";
import { NavLink } from "../../components/NavLink";
import { PageLoader } from "../../components/PageLoader";
import { getPackagePath } from "../../util/url";
import { usePackageState } from "./PackageState";
import testIds from "./testIds";

export const DependenciesList: FunctionComponent = () => {
  const assembly = usePackageState().assembly.data;

  if (!assembly) {
    return <PageLoader />;
  }

  const depEntries = Object.entries(assembly.dependencies ?? {});

  if (!depEntries.length) {
    return <Center>This library does not have any known dependencies</Center>;
  }

  return (
    <Stack
      data-testid={testIds.dependenciesList}
      direction="row"
      justify="center"
      mx="auto"
      spacing={4}
      wrap="wrap"
    >
      {depEntries.map(([name, version]) => (
        <NavLink
          _first={{ ml: 4 }}
          data-testid={testIds.dependenciesLink}
          fontWeight="semibold"
          key={`${name}-${version}`}
          p={2}
          to={getPackagePath({ name, version: sanitizeVersion(version) })}
        >
          {name}
        </NavLink>
      ))}
    </Stack>
  );
};
