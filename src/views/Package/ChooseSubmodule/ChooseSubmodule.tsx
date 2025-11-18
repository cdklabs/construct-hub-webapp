import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Divider, Stack, useDisclosure } from "@chakra-ui/react";
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { SearchModal } from "./SearchModal";
import { QUERY_PARAMS } from "../../../constants/url";
import { useQueryParams } from "../../../hooks/useQueryParams";
import { getPackagePath } from "../../../util/url";
import { usePackageState } from "../PackageState";

export const ChooseSubmodule: FunctionComponent = () => {
  const { assembly, name, language, scope, version } = usePackageState();
  const { push } = useHistory();
  const query = useQueryParams();

  const allSubmodules = Object.keys(assembly?.data?.submodules ?? {});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentSubmodule = query.get(QUERY_PARAMS.SUBMODULE);
  const submoduleText = currentSubmodule
    ? `Submodule: ${currentSubmodule}`
    : "Choose Submodule";

  const [filter, setFilter] = useState("");

  const packageName = scope ? `${scope}/${name}` : name;

  const onGoBack = () => {
    push(
      getPackagePath({
        name: packageName,
        version,
        language,
      })
    );
  };

  const getUrl = useCallback(
    (submoduleName: string) => {
      return getPackagePath({
        name: packageName,
        version,
        language,
        submodule: submoduleName,
      });
    },
    [language, packageName, version]
  );

  const submodules = useMemo(() => {
    let results = allSubmodules;

    if (filter) {
      results = results.filter((submodule) =>
        submodule.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return results.map((submodule) => {
      // Extract submodule name from FQN by removing package prefix
      // 1. Split FQN by dots: "aws-cdk-lib.aws_s3.bucket" → ["aws-cdk-lib", "aws_s3", "bucket"]
      //                       "aws-cdk-lib.interfaces.aws_s3" → ["aws-cdk-lib", "interfaces", "aws_s3"]
      // 2. Remove first element (package name): ["aws_s3", "bucket"], ["interfaces", "aws_s3"]
      // 3. Rejoin with dots: "aws_s3.bucket", "interfaces.aws_s3"
      const submoduleDisplayName = submodule.substring(
        submodule.indexOf(".") + 1
      );

      return {
        name: submoduleDisplayName,
        to: getUrl(submoduleDisplayName),
      };
    });
  }, [allSubmodules, filter, getUrl]);

  if (allSubmodules.length === 0) {
    return null;
  }

  return (
    <Stack spacing={4} w="100%">
      {currentSubmodule && (
        <>
          <Button
            borderRadius="none"
            data-testid="choose-submodule-go-back"
            leftIcon={<ArrowBackIcon aria-label="Back to construct root" />}
            onClick={onGoBack}
            title="Back to construct root"
            variant="link"
          >
            {assembly?.data?.name}
          </Button>
          <Divider />
        </>
      )}
      <Button
        borderRadius="none"
        color="blue.500"
        data-testid="choose-submodule-search-trigger"
        flexGrow={1}
        onClick={onOpen}
        rightIcon={<ChevronDownIcon />}
        title="Choose Submodule"
        variant="link"
      >
        {submoduleText}
      </Button>
      <SearchModal
        inputValue={filter}
        isOpen={isOpen}
        onClose={onClose}
        onInputChange={setFilter}
        submodules={submodules}
      />
    </Stack>
  );
};
