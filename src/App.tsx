import { Grid } from "@chakra-ui/react";
import { FunctionComponent, lazy } from "react";
import { Switch } from "react-router-dom";
import { DevPreviewBanner } from "./components/DevPreviewBanner";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LazyRoute } from "./components/LazyRoute";
import { PageLoader } from "./components/PageLoader";
import { ROUTES } from "./constants/url";
import { useConfig } from "./contexts/Config";

const FAQ = lazy(() => import("./views/FAQ"));
const Home = lazy(() => import("./views/Home"));
const NotFound = lazy(() => import("./views/NotFound"));
const Packages = lazy(() => import("./views/Packages"));
const SearchResults = lazy(() => import("./views/SearchResults"));
const SearchRedesign = lazy(() => import("./views/SearchRedesign"));
const SiteTerms = lazy(() => import("./views/SiteTerms"));

export const App: FunctionComponent = () => {
  const { data, loading } = useConfig();
  const featureFlags = data?.featureFlags ?? {};

  return (
    <Grid
      as="main"
      bg="bgPrimary"
      gridTemplateColumns="1fr"
      gridTemplateRows="auto auto 1fr auto"
      h="100%"
      inset={0}
      maxW="100vw"
      overflow="hidden auto"
      position="fixed"
    >
      <Header />
      <DevPreviewBanner />
      {loading ? (
        <PageLoader />
      ) : (
        <Switch>
          <LazyRoute component={FAQ} exact path={ROUTES.FAQ} />
          <LazyRoute component={Home} exact path={ROUTES.HOME} />
          <LazyRoute component={SiteTerms} exact path={ROUTES.SITE_TERMS} />
          <LazyRoute component={Packages} path={ROUTES.PACKAGES} />
          <LazyRoute
            component={
              featureFlags?.searchRedesign ? SearchRedesign : SearchResults
            }
            exact
            path={ROUTES.SEARCH}
          />
          <LazyRoute component={NotFound} path="*" />
        </Switch>
      )}
      <Footer />
    </Grid>
  );
};
