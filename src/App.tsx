import { Flex } from "@chakra-ui/react";
import type { FunctionComponent } from "react";
import { Switch, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { NotFound } from "./views/NotFound";
import { Packages } from "./views/Packages";
import { SearchResults } from "./views/SearchResults";

export const App: FunctionComponent = () => {
  return (
    <Flex
      as="main"
      bg="gray.50"
      direction="column"
      inset={0}
      overflow="auto"
      position="fixed"
    >
      <Header />
      <Switch>
        <Route path="/packages">
          <Packages />
        </Route>
        <Route exact path="/">
          <SearchResults />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Flex>
  );
};
