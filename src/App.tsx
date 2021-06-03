import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from "./components";
import { Theme } from "./Theme";
import { Home, NotFound, Packages } from "./views";

export function App() {
  return (
    <Router>
      <Theme>
        <div className="App">
          <Header />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/packages">
              <Packages />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </div>
      </Theme>
    </Router>
  );
}
