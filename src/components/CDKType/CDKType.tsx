import {
  Badge,
  BadgeProps,
  forwardRef,
  Image,
  ImageProps,
  Text,
  TextProps,
} from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { CDKType, CDKTYPE_RENDER_MAP } from "../../constants/constructs";
import { cdkMajorState, cdkTypeState } from "../../state/search";
import { getSearchPath } from "../../util/url";
import { NavLink } from "../NavLink";

interface CDKTypeIconProps extends ImageProps {
  name?: CDKType;
  majorVersion?: number;
}

export const CDKTypeIcon = forwardRef<CDKTypeIconProps, "img">(
  ({ name, majorVersion, ...props }, ref) => {
    if (!name) return null;

    return (
      <Image
        alt={`${CDKTYPE_RENDER_MAP[name].name} Logo`}
        h={5}
        ref={ref}
        src={CDKTYPE_RENDER_MAP[name].imgsrc}
        w={5}
        {...props}
      />
    );
  }
);

interface CDKTypeTextProps extends TextProps {
  name?: CDKType;
  majorVersion?: number;
}

export const CDKTypeText = forwardRef<CDKTypeTextProps, "p">(
  ({ name, majorVersion, ...props }, ref) => {
    if (!name) return null;

    return (
      <Text ref={ref} {...props}>
        {CDKTYPE_RENDER_MAP[name].name}
        {majorVersion !== undefined ? ` v${majorVersion}` : ""}
      </Text>
    );
  }
);

interface CDKTypeBadgeProps extends BadgeProps {
  name?: CDKType;
  majorVersion?: number;
}

const badgeColorMap = {
  [CDKType.awscdk]: "#CF4A02",
  [CDKType.cdk8s]: "#005797",
  [CDKType.cdktf]: "#5C4EE5",
};

export const CDKTypeBadge = forwardRef<CDKTypeBadgeProps, "span">(
  ({ name, majorVersion, ...badgeProps }, ref) => {
    const setCdkType = useSetRecoilState(cdkTypeState);
    const setCdkMajor = useSetRecoilState(cdkMajorState);

    if (!name) return null;

    const bg = badgeColorMap[name];

    return (
      <Badge
        alignItems="center"
        as={NavLink}
        bg={bg}
        borderRadius="md"
        color="white"
        display="flex"
        h="1.5rem"
        maxW="5.5rem"
        onClick={() => {
          setCdkType(name);
          setCdkMajor(majorVersion);
        }}
        px={1.5}
        ref={ref}
        textTransform="none"
        to={getSearchPath({ cdkType: name, cdkMajor: majorVersion })}
        {...badgeProps}
      >
        <CDKTypeText majorVersion={majorVersion} name={name} />
      </Badge>
    );
  }
);
