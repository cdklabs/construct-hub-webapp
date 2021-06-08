import logo from "../../logo.svg";
import "./style.css";

export function Home() {
  return (
    <header className="App-header">
      <img alt="logo" className="App-logo" src={logo} />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        rel="noopener noreferrer"
        target="_blank"
      >
        Learn React
      </a>
    </header>
  );
}
