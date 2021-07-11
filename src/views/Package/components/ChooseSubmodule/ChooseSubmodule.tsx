import { ArrowBackIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Flex, useDisclosure, useToken } from "@chakra-ui/react";
import type { Assembly } from "@jsii/spec";
import { FunctionComponent, useCallback, useMemo, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { QUERY_PARAMS } from "../../../../constants/url";
import { useQueryParams } from "../../../../hooks/useQueryParams";
import { SearchModal } from "./SearchModal";

export interface ChooseSubmoduleProps {
  assembly?: Assembly;
}

export const ChooseSubmodule: FunctionComponent<ChooseSubmoduleProps> = ({
  assembly,
}) => {
  const { pathname } = useLocation();
  const { push } = useHistory();
  const query = useQueryParams();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [borderColor, textColor] = useToken("colors", ["gray.100", "gray.800"]);
  const btnHeight = useToken("space", "16");

  const currentSubmodule = query.get(QUERY_PARAMS.SUBMODULE);
  const submoduleText = currentSubmodule ?? "Submodules";

  const [filter, setFilter] = useState("");

  const onGoBack = () => {
    const lang = query.get(QUERY_PARAMS.LANGUAGE);
    push(`${pathname}${lang ? `?${QUERY_PARAMS.LANGUAGE}=${lang}` : ""}`);
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
    let results = Object.keys(assembly?.submodules ?? {});

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
  }, [assembly?.submodules, filter, getUrl]);

  return (
    <Flex>
      {currentSubmodule && (
        <Button
          borderRadius="none"
          borderRight={`1px solid ${borderColor}`}
          color={textColor}
          data-testid="choose-submodule-go-back"
          h={btnHeight}
          onClick={onGoBack}
          title="Back to construct root"
          variant="ghost"
        >
          <ArrowBackIcon aria-label="Back to construct root" />
        </Button>
      )}
      <Button
        borderRadius="none"
        color={textColor}
        data-testid="choose-submodule-search-trigger"
        disabled={!Object.keys(assembly?.submodules ?? {}).length}
        flexGrow={1}
        h={btnHeight}
        onClick={onOpen}
        rightIcon={<ChevronDownIcon />}
        title="Choose Submodule"
        variant="ghost"
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
    </Flex>
  );
};
