import * as React from "react";
import * as ReactDOM from "react-dom";
import { StrictMode } from "react";
import { App } from "./App";
import "./style.css";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
