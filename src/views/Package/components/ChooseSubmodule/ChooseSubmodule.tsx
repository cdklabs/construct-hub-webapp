import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Divider, Stack, useDisclosure } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { useRouter } from "next/router";
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { SearchModal } from "./SearchModal";
import { Language } from "constants/languages";
import { QUERY_PARAMS } from "constants/url";
import { getPackagePath } from "util/url";

export interface ChooseSubmoduleProps {
  assembly?: Assembly;
}

export const ChooseSubmodule: FunctionComponent<ChooseSubmoduleProps> = ({
  assembly,
}) => {
  const { pathname, push, query } = useRouter();

  const allSubmodules = Object.keys(assembly?.submodules ?? {});
  const { isOpen, onOpen, onClose } = useDisclosure();

  const currentSubmodule = query[QUERY_PARAMS.SUBMODULE];
  const submoduleText = currentSubmodule
    ? `Submodule: ${currentSubmodule}`
    : "Choose Submodule";

  const [filter, setFilter] = useState("");

  const onGoBack = () => {
    if (!assembly) return;

    const lang = query[QUERY_PARAMS.LANGUAGE] as Language;

    void push(
      getPackagePath({
        name: assembly.name,
        version: assembly.version,
        language: lang,
      })
    );
  };

  const getUrl = useCallback(
    (submoduleName: string) => {
      const params = new URLSearchParams(query.toString());
      params.set("submodule", submoduleName);
      return `${pathname}?${params}`;
    },
    [pathname, query]
  );

  const submodules = useMemo(() => {
    let results = allSubmodules;

    if (filter) {
      results = results.filter((fqn) =>
        fqn.toLowerCase().includes(filter.toLowerCase())
      );
    }

    return results.map((fqn) => {
      const name = fqn.split(".")[1];
      return {
        name,
        to: getUrl(name),
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
            {assembly?.name}
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
