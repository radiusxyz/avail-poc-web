import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { TxsProvider } from "./contexts/TxsContext.jsx";
import Theme from "./Theme.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MetaMaskProvider } from "@metamask/sdk-react";
import { config } from "./config.js";

import { WagmiProvider } from "wagmi";
const queryClient = new QueryClient();

document.getElementById("root") &&
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </WagmiProvider>
    </React.StrictMode>
  );
