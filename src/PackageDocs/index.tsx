import { Switch, Route, useRouteMatch } from "react-router-dom";
import PackageDocsHome from "../PackageDocsHome";
import TypeDocs from "../TypeDocs";

interface PackageDocsProps {
  name: string;
  scope?: string;
  version: string;
}

export default function PackageDocs(props: PackageDocsProps) {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path}>
        <PackageDocsHome {...props} />
      </Route>
      <Route path={`${path}/:fqn`}>
        <TypeDocs {...props} />
      </Route>
    </Switch>
  );
}
