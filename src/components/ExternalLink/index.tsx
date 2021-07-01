import { Link, PropsOf } from "@chakra-ui/react";

export function ExternalLink(props: PropsOf<typeof Link>) {
  return <Link {...props} target="_blank" rel="noopener noreferrer" />;
}
