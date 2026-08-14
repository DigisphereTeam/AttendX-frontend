import React from "react";
import ReactDOM from "react-dom/client";

import "bootstrap/dist/css/bootstrap.min.css";
// import "./styles/variables.css";
// import "./styles/global.css";

import App from "./app/App";
import Providers from "./app/providers";
import ErrorBoundary from "./components/common/ErrorBoundary";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Providers>
        <App />
      </Providers>
    </ErrorBoundary>
  </React.StrictMode>,
);
