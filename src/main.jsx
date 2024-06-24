import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { TxsProvider } from "./contexts/TxsContext.jsx";
import Theme from "./pfa/Theme.jsx";

document.getElementById("root") &&
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <Theme>
        <TxsProvider>
          <App />
        </TxsProvider>
      </Theme>
    </React.StrictMode>
  );
