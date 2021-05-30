import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from "./Header";
import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { Packages } from "./Packages";
import { Theme } from "./Theme";

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
