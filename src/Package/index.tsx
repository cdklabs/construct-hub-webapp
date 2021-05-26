import {
  Switch,
  Route,
  useRouteMatch,
  useParams,
  useLocation,
} from "react-router-dom";
import PackageDetails from "../PackageDetails";
import PackageDocs from "../PackageDocs";

function queryParams(search: string) {
  const params: any = {};
  const keyValues = search.substring(1, search.length).split("&");

  for (const kv of keyValues) {
    const parts = kv.split("=");
    params[parts[0]] = parts[1];
  }

  return params;
}

interface PathParams {
  name: string;
  scope?: string;
  version: string;
}

export default function Package() {
  const { path } = useRouteMatch();
  const params: PathParams = useParams();
  const q = queryParams(useLocation().search);
  return (
    <Switch>
      <Route exact path={path}>
        <PackageDetails
          {...{
            submodule: q.submodule,
            ...params,
          }}
        />
      </Route>
      <Route path={`${path}/docs`}>
        <PackageDocs {...params} />
      </Route>
    </Switch>
  );
}
