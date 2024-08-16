import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { PvdeProvider } from "./contexts/PvdeContext.jsx";
import Theme from "./Theme.jsx";
import { MetaMaskProvider } from "@metamask/sdk-react";

document.getElementById("root") &&
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Theme>
        <PvdeProvider>
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
        </PvdeProvider>
      </Theme>
    </React.StrictMode>
  );
