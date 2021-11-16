import { Box, Text, Select } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { useCatalogResults } from "../../../hooks/useCatalogResults";
import { getPackagePath } from "../../../util/url";
import { usePackageState } from "../PackageState";

export const SelectMajorVersion: FunctionComponent = () => {
  const { scope, name, version, language } = usePackageState();
  const pkgName = scope ? `${scope}/${name}` : name;
  const packages = useCatalogResults({
    query: pkgName,
    exactQuery: true,
    limit: 20,
  });
  const { push } = useHistory();

  const packageMajorVersions = packages.results.map((pkg) => ({
    major: pkg.major,
    version: pkg.version,
  }));
  packageMajorVersions.sort((a, b) => a.major - b.major);
  const defaultMajor = packageMajorVersions.find(
    (mv) => mv.version === version
  );

  const onChangeMajorVersion: React.ChangeEventHandler<HTMLSelectElement> = (
    evt
  ) => {
    const selectedVersion = packageMajorVersions.find(
      (mv) => mv.major.toString() === evt.target.value
    )?.version;
    if (selectedVersion) {
      push(
        getPackagePath({
          name: pkgName,
          version: selectedVersion,
          language,
        })
      );
    }
  };

  return (
    <Box as="span" display="flex">
      <Text color="gray.700" fontSize="0.9rem" fontWeight="semibold" mb="0">
        Select package major version:
      </Text>
      <Select
        fontWeight="bold"
        ml="3"
        onChange={onChangeMajorVersion}
        size="xs"
        value={defaultMajor?.major}
        variant="filled"
        width="6rem"
      >
        {packageMajorVersions.map((mv) => (
          <option key={mv.major} value={mv.major}>
            {`v${mv.major}`}
          </option>
        ))}
      </Select>
    </Box>
  );
};
