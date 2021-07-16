import React from "react";
import ReactDOM from "react-dom";
import theme from "theme";
import App from "App";
import { ThemeProvider } from "theme-ui";
import { BrowserRouter } from "react-router-dom";
import { ContractKitProvider } from "@celo-tools/use-contractkit";
import { BrowserRouter as Router } from "react-router-dom";

import "@celo-tools/use-contractkit/lib/styles.css";
import 'react-toastify/dist/ReactToastify.min.css';
import "index.css";

declare global {
  interface Window {
    // TODO no-any
    genZKSnarkProofAndWitness: any;
  }
}

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <ContractKitProvider
          dapp={{
            name: "Rewards Studio",
            description: "Create an manage wrapped CELO tokens",
            url: window.location.href.slice(0, window.location.href.length - 1),
          }}
        >
          <Router>
            <App />
          </Router>
        </ContractKitProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
