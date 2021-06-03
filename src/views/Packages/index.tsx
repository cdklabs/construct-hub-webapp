import { Switch, Route, useRouteMatch } from "react-router-dom";
import { PackageLatest } from "../../components";
import { Package } from "../Package";

export function Packages() {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={`${path}/:name`}>
        <PackageLatest />
      </Route>
      <Route exact path={`${path}/:scope/:name`}>
        <PackageLatest />
      </Route>
      <Route path={`${path}/:name/v/:version`}>
        <Package />
      </Route>
      <Route path={`${path}/:scope/:name/v/:version`}>
        <Package />
      </Route>
    </Switch>
  );
}
