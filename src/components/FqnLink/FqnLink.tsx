import { FunctionComponent, ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../../hooks/useLanguage";
import { sanitize } from "../../util/sanitize-anchor";

interface FqnLinkProps {
  fqn: string;
  children: ReactNode;
}

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

export const FqnLink: FunctionComponent<FqnLinkProps> = ({ fqn, children }) => {
  const { version }: PathParams = useParams();
  const [language] = useLanguage();
  const [targetModule] = fqn.split(".");

  const hash = sanitize(fqn);
  const path = `/packages/${targetModule}/v/${version}?language=${language}#${hash}`;
  return <Link to={path}>{children}</Link>;
};
