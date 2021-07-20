import { Grid } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Switch, Route } from "react-router-dom";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ROUTES } from "./constants/url";
import { Home } from "./views/Home";
import { NotFound } from "./views/NotFound";
import { Packages } from "./views/Packages";
import { SearchResults } from "./views/SearchResults";
import { SiteTerms } from "./views/SiteTerms";

export const App: FunctionComponent = () => {
  return (
    <Grid
      as="main"
      bg="gray.50"
      gridTemplateColumns="1fr"
      gridTemplateRows="auto 1fr auto"
      inset={0}
      maxW="100vw"
      overflow="hidden auto"
      position="fixed"
    >
      <Header />
      <Switch>
        <Route exact path={ROUTES.HOME}>
          <Home />
        </Route>
        <Route exact path={ROUTES.SITE_TERMS}>
          <SiteTerms />
        </Route>
        <Route path={ROUTES.PACKAGES}>
          <Packages />
        </Route>
        <Route exact path={ROUTES.SEARCH}>
          <SearchResults />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
      <Footer />
    </Grid>
  );
};
