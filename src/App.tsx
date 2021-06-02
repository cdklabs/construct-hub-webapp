<<<<<<< HEAD
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Theme } from "./contexts/Theme";
import { Home } from "./views/Home";
import { NotFound } from "./views/NotFound";
import { Packages } from "./views/Packages";
=======
import { Switch, Route } from "react-router-dom";
import { Header } from "./Header";
import { Home } from "./Home";
import { NotFound } from "./NotFound";
import { Packages } from "./Packages";
>>>>>>> feat: package page navigation

export function App() {
  return (
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
  );
}
