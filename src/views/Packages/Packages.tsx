import type { FunctionComponent } from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import { NotFound } from "../NotFound";
import { Package } from "../Package";
import { PackageLatest } from "../PackageLatest";

const nameRegexp = "[^@\\/]+";
const scopeRegexp = "@[^\\/]+";

export const Packages: FunctionComponent = () => {
  const { path } = useRouteMatch();

  return (
    <Switch>
      <Route
        exact
        path={`${path}/:scope(${scopeRegexp})?/:name(${nameRegexp})`}
      >
        <PackageLatest />
      </Route>
      <Route
        path={`${path}/:scope(${scopeRegexp})?/:name(${nameRegexp})/v/:version`}
      >
        <Package />
      </Route>
      <Route path="*">
        <NotFound />
      </Route>
    </Switch>
  );
};
