import "./assets/styles/_reset.scss";
import "./index.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./components/App";
import AuthProvider from "./contexts/authContext";
import ModalProvider from "./contexts/modalContext";
import ScreenProvider from "./contexts/screenContext";
import NotificationProvider from "./contexts/notificationContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScreenProvider>
        <NotificationProvider>
          <AuthProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </AuthProvider>
        </NotificationProvider>
      </ScreenProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
