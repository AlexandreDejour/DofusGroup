import "./assets/styles/_reset.scss";
import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";
import ModalProvider from "./contexts/modalContext";
import fontAwesomeLibrary from "./assets/icons/fontAwesomeLibrary";
import NotificationProvider from "./contexts/notificationContext";

fontAwesomeLibrary();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NotificationProvider>
        <ModalProvider>
          <App />
        </ModalProvider>
      </NotificationProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
