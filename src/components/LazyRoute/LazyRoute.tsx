import { FunctionComponent, LazyExoticComponent, Suspense } from "react";
import { Route, RouteProps } from "react-router-dom";
import { PageLoader } from "../PageLoader";

export interface LazyRouteProps extends RouteProps {
  component: LazyExoticComponent<FunctionComponent>;
}

/**
 * A wrapper around the react-router-dom which takes in a lazy loaded component
 * and wraps it with <Suspense /> and a generic <PageLoader /> fallback
 *
 * Usage:
 * ```tsx
 * import { lazy } from "react";
 *
 * const MyComponent = lazy(() => import("./path/to/MyComponent"));
 *
 * <LazyRoute path="/" component={MyComponent} />
 *
 * ```
 */
export const LazyRoute: FunctionComponent<LazyRouteProps> = ({
  component: Component,
  ...routeProps
}) => (
  <Route {...routeProps}>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </Route>
);
