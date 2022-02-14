import {
  Badge,
  BadgeProps,
  forwardRef,
  Text,
  TextProps,
  Tooltip,
} from "@chakra-ui/react";
import { CDKType, CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";

interface CDKTypeTextProps extends TextProps {
  name?: CDKType;
  majorVersion?: number;
}

const getText = ({
  name,
  majorVersion,
}: {
  name: CDKType;
  majorVersion?: number;
}) =>
  `${CDKTYPE_RENDER_MAP[name].name}${
    majorVersion !== undefined ? ` v${majorVersion}` : ""
  }`;

const CDKTypeText = forwardRef<CDKTypeTextProps, "p">(
  ({ name, majorVersion, ...props }, ref) => {
    if (!name) return null;

    return (
      <Text ref={ref} {...props}>
        {getText({ name, majorVersion })}
      </Text>
    );
  }
);

export interface CDKTypeBadgeProps extends BadgeProps {
  constructFrameworks?: Map<CDKType, number | null>;
}

const badgeColorMap = {
  [CDKType.awscdk]: "#CF4A02",
  [CDKType.cdk8s]: "#005797",
  [CDKType.cdktf]: "#5C4EE5",
};

const sharedProps = {
  alignItems: "center",
  borderRadius: "md",
  display: "flex",
  h: "1.5rem",
  maxW: "5.5rem",
  px: 1.5,
  textTransform: "none" as const,
};

export const CDKTypeBadge = forwardRef<CDKTypeBadgeProps, "span">(
  ({ constructFrameworks, ...badgeProps }, ref) => {
    if (!constructFrameworks?.size) return null;

    // If "multi-cdk" library, show a Multi-CDK badge with tooltip which lists supported libraries
    if (constructFrameworks.size > 1) {
      const frameworks = [...constructFrameworks.entries()];
      return (
        <Tooltip
          hasArrow
          label={`Supports: ${frameworks
            .map(([name, majorVersion]) =>
              getText({ name, majorVersion: majorVersion ?? undefined })
            )
            .join(", ")}`}
        >
          <Badge {...sharedProps} colorScheme="brand" {...badgeProps}>
            Multi-CDK
          </Badge>
        </Tooltip>
      );
    }

    const [[name, majorVersion]] = constructFrameworks;
    const bg = badgeColorMap[name];

    return (
      <Badge
        {...sharedProps}
        as={NavLink}
        bg={bg}
        color="white"
        ref={ref}
        to={getSearchPath({
          cdkType: name,
          cdkMajor: majorVersion ?? undefined,
        })}
        {...badgeProps}
      >
        <CDKTypeText majorVersion={majorVersion ?? undefined} name={name} />
      </Badge>
    );
  }
);
