import { Box, Text, Select } from "@chakra-ui/react";
import { FunctionComponent } from "react";
import { useHistory } from "react-router-dom";
import { useCatalogResults } from "../../../hooks/useCatalogResults";
import { getPackagePath } from "../../../util/url";
import { usePackageState } from "../PackageState";

export const SelectVersion: FunctionComponent = () => {
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

  const onChangeVersion: React.ChangeEventHandler<HTMLSelectElement> = (
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
    <Box
      display="flex"
      ml={{ base: "0", md: "2" }}
      mt={{ base: "0", md: "2" }}
      my="1"
    >
      <Text color="gray.700">Version</Text>
      <Select
        fontSize="sm"
        // fontWeight="semibold"
        ml="2"
        onChange={onChangeVersion}
        size="xs"
        value={defaultMajor?.major}
        variant="filled"
        width="8rem"
      >
        {packageMajorVersions.map((mv) => (
          <option key={mv.major} value={mv.major}>
            {`v${mv.version}`}
          </option>
        ))}
      </Select>
    </Box>
  );
};
