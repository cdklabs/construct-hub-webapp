import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./Home";
import NotFound from "./NotFound";
import Packages from "./Packages";

function App() {
  return (
    <Router>
      <div className="App">
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
    </Router>
  );
}

export default App;
