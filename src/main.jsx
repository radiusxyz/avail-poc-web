import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { TxsProvider } from "./contexts/TxsContext.jsx";
import Theme from "./pfa/Theme.jsx";
import { MetaMaskProvider } from "@metamask/sdk-react";

document.getElementById("root") &&
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Theme>
        <TxsProvider>
          <MetaMaskProvider
            debug={false}
            sdkOptions={{
              dappMetadata: {
                name: "Radius bridge",
                url: window.location.href,
              },
            }}
          >
            <App />
          </MetaMaskProvider>
        </TxsProvider>
      </Theme>
    </React.StrictMode>
  );
