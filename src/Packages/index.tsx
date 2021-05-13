import { Switch, Route, useRouteMatch } from "react-router-dom";
import Package from "../Package";
import PackageLatest from "../PackageLatest";

export default function Packages() {
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
