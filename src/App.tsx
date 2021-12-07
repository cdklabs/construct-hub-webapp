import { Grid } from "@chakra-ui/react";
import { FunctionComponent, lazy } from "react";
import { Switch } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { LazyRoute } from "./components/LazyRoute";
import { ROUTES } from "./constants/url";

const Contribute = lazy(() => import("./views/Contribute"));
const FAQ = lazy(() => import("./views/FAQ"));
const Home = lazy(() => import("./views/Home"));
const NotFound = lazy(() => import("./views/NotFound"));
const Packages = lazy(() => import("./views/Packages"));
const SearchRedesign = lazy(() => import("./views/SearchRedesign"));
const SiteTerms = lazy(() => import("./views/SiteTerms"));

export const App: FunctionComponent = () => {
  return (
    <Grid
      as="main"
      bg="bgPrimary"
      gridTemplateColumns="1fr"
      gridTemplateRows="auto 1fr auto"
      h="100%"
      maxW="100%"
      minH="100vh"
    >
      <Header />
      <Switch>
        <LazyRoute component={Contribute} exact path={ROUTES.CONTRIBUTE} />
        <LazyRoute component={FAQ} exact path={ROUTES.FAQ} />
        <LazyRoute component={Home} exact path={ROUTES.HOME} />
        <LazyRoute component={SiteTerms} exact path={ROUTES.SITE_TERMS} />
        <LazyRoute component={Packages} path={ROUTES.PACKAGES} />
        <LazyRoute component={SearchRedesign} exact path={ROUTES.SEARCH} />
        <LazyRoute component={NotFound} path="*" />
      </Switch>
      <Footer />
    </Grid>
  );
};
