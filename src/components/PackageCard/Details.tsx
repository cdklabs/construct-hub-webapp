import { Text } from "@chakra-ui/react";
import type { FunctionComponent, ReactChild } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";
import { Time } from "../Time";
import { usePackageCard } from "./PackageCard";
import testIds from "./testIds";

interface DetailProps {
  "data-testid": string;
  label: string;
  value: ReactChild;
}

const Detail: FunctionComponent<DetailProps> = ({
  "data-testid": dataTestid,
  label,
  value,
}) => (
  <Text data-testid={dataTestid} fontSize="xs">
    <strong>{label}</strong> {value}
  </Text>
);

export const Details: FunctionComponent = () => {
  const [currentLanguage] = useLanguage();

  const {
    author,
    metadata: { date },
    version,
  } = usePackageCard();

  const authorName = typeof author === "string" ? author : author.name;

  return (
    <>
      <Detail data-testid={testIds.version} label="Version" value={version} />
      <Detail
        data-testid={testIds.published}
        label="Published"
        value={
          <Time date={new Date(date)} fontSize="xs" format="MMM dd, yyyy" />
        }
      />
      <Detail
        data-testid={testIds.author}
        label="Author"
        value={
          <NavLink
            to={getSearchPath({
              query: `"${authorName}"`,
              language: currentLanguage,
            })}
          >
            {authorName}
          </NavLink>
        }
      />
    </>
  );
};
