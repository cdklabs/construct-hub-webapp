import { Switch, Route, useRouteMatch, useParams } from "react-router-dom";
import PackageDetails from "../PackageDetails";
import PackageDocs from "../PackageDocs";

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

export default function Package() {
  const { path } = useRouteMatch();
  const params: PathParams = useParams();
  return (
    <Switch>
      <Route exact path={path}>
        <PackageDetails {...params} />
      </Route>
      <Route path={`${path}/docs`}>
        <PackageDocs {...params} />
      </Route>
    </Switch>
  );
}
