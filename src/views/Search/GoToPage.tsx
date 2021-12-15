import { Flex, Input, Text } from "@chakra-ui/react";
import {
  FormEventHandler,
  FunctionComponent,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { clickEvent, useAnalytics } from "../../contexts/Analytics";
import { offsetState, pageLimitState } from "../../state/search";

export interface GoToPageProps {
  "data-event"?: string;
  "data-testid"?: string;
}

export const GoToPage: FunctionComponent<GoToPageProps> = ({
  "data-event": dataEvent,
  "data-testid": dataTestid,
}) => {
  const { trackCustomEvent } = useAnalytics();
  const [offset, setOffset] = useRecoilState(offsetState);
  const [inputValue, setInputValue] = useState((offset + 1).toString());
  const pageLimit = useRecoilValue(pageLimitState);

  useEffect(() => {
    setInputValue((offset + 1).toString());
  }, [offset]);

  const onInputChange = (e: SyntheticEvent<HTMLInputElement>) => {
    e.preventDefault();
    setInputValue((e.target as HTMLInputElement).value);
  };

  const onSubmit: FormEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();

    // Handle submitting an empty input
    if (!inputValue) {
      setInputValue("1");
      setOffset(0);
      return;
    }

    setOffset(parseInt(inputValue) - 1);
  };

  return (
    <Flex align="center" as="form" mx={2} onSubmit={onSubmit}>
      <Input
        colorScheme="blue"
        data-testid={dataTestid}
        h={10}
        max={pageLimit + 1}
        min={1}
        name="page"
        onChange={onInputChange}
        onFocus={() => {
          if (dataEvent) {
            trackCustomEvent(clickEvent({ name: dataEvent }));
          }
        }}
        p={0}
        textAlign="center"
        type="number"
        value={inputValue}
        w={10}
      />
      <Text ml={2} w="max-content">
        of {pageLimit + 1}
      </Text>
    </Flex>
  );
};
