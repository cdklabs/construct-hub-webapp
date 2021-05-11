import { Redirect, useParams } from "react-router-dom";

interface RouteParams {
  name: string;
  scope?: string;
}

export default function PackageLatest() {
  const { name, scope }: RouteParams = useParams();
  const version = "latest"; // read latest version from state here

  const prefix = "/packages/";
  const packagePath = scope ? `${scope}/${name}` : `${name}`;
  const suffix = `/v/${version}`;

  return <Redirect to={`${prefix}${packagePath}${suffix}`} />;
}
