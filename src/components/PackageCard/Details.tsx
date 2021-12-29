import { Text, Tooltip } from "@chakra-ui/react";
import { formatDistanceToNowStrict } from "date-fns";
import { FunctionComponent, ReactChild } from "react";
import { useStats } from "../../hooks/useStats";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";
import { Time } from "../Time";
import { usePackageCard } from "./PackageCard";
import testIds from "./testIds";

interface DetailProps {
  "data-testid": string;
  tooltip?: string;
  value: ReactChild;
}

const Detail: FunctionComponent<DetailProps> = ({
  "data-testid": dataTestid,
  tooltip,
  value,
}) => (
  <Tooltip hasArrow isDisabled={!tooltip} label={tooltip} placement="left">
    {/* zIndex required to allow tooltip to display due to card link overlay */}
    <Text data-testid={dataTestid} fontSize="xs" zIndex={1}>
      {value}
    </Text>
  </Tooltip>
);

export const Details: FunctionComponent = () => {
  const {
    author,
    metadata: { date },
    name,
  } = usePackageCard();

  const { data } = useStats();
  const downloads: number | undefined = data?.packages?.[name]?.downloads?.npm;

  const authorName = typeof author === "string" ? author : author.name;
  const publishDate = new Date(date);

  return (
    <>
      {downloads !== undefined && (
        <Detail
          data-testid={testIds.downloads}
          tooltip="Download numbers are periodically sourced from the npm registry"
          value={`${downloads.toLocaleString()} weekly downloads`}
        />
      )}
      <Detail
        data-testid={testIds.published}
        value={
          <Time
            date={publishDate}
            fontSize="xs"
            formattedDate={formatDistanceToNowStrict(publishDate, {
              addSuffix: true,
            })}
          />
        }
      />
      <Detail
        data-testid={testIds.author}
        value={
          <>
            By{" "}
            <NavLink
              color="link"
              to={getSearchPath({
                query: authorName,
              })}
            >
              {authorName}
            </NavLink>
          </>
        }
      />
    </>
  );
};
