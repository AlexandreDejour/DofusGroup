import "./assets/styles/_reset.scss";
import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";
import ModalProvider from "./contexts/modalContext";
import fontAwesomeLibrary from "./assets/icons/fontAwesomeLibrary";

fontAwesomeLibrary();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ModalProvider>
        <App />
      </ModalProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
