import { Text } from "@chakra-ui/react";
import type { FunctionComponent, ReactChild } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";
import { Time } from "../Time";
import { usePackageCard } from "./PackageCard";

interface DetailProps {
  label: string;
  value: ReactChild;
}

const Detail: FunctionComponent<DetailProps> = ({ label, value }) => (
  <Text fontSize="xs">
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
      <Detail label="Version" value={version} />
      <Detail
        label="Published"
        value={
          <Time date={new Date(date)} fontSize="xs" format="MMM dd, yyyy" />
        }
      />
      <Detail
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
