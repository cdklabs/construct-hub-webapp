import { DownloadIcon } from "@chakra-ui/icons";
import { Text } from "@chakra-ui/react";
import { FunctionComponent, ReactChild } from "react";
import { useStats } from "../../contexts/Stats";
import { useLanguage } from "../../hooks/useLanguage";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";
import { Time } from "../Time";
import { usePackageCard } from "./PackageCard";
import testIds from "./testIds";

interface DetailProps {
  "data-testid": string;
  icon?: ReactChild;
  label: string;
  value: ReactChild;
}

const Detail: FunctionComponent<DetailProps> = ({
  "data-testid": dataTestid,
  icon,
  label,
  value,
}) => (
  <Text data-testid={dataTestid} fontSize="xs">
    {icon}
    {icon ? " " : ""}
    <strong>{label}</strong> {value}
  </Text>
);

export const Details: FunctionComponent = () => {
  const [currentLanguage] = useLanguage();

  const {
    author,
    metadata: { date },
    version,
    name,
  } = usePackageCard();

  const { data } = useStats();
  const downloads: number | undefined = data?.packages?.[name]?.downloads?.npm;

  const authorName = typeof author === "string" ? author : author.name;

  return (
    <>
      {downloads !== undefined && downloads >= 10 ? (
        <Detail
          data-testid={testIds.downloads}
          icon={<DownloadIcon />}
          label={downloads.toLocaleString()}
          value={"Downloads"}
        />
      ) : (
        <Detail data-testid={testIds.version} label="Version" value={version} />
      )}
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
            color="blue.500"
            to={getSearchPath({
              query: authorName,
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
