import "./assets/styles/_reset.scss";
import "./index.scss";

import "./i18n/i18n";
import i18n from "./i18n/i18n";

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import {
  initProfanity,
  loadProfanityDictionary,
} from "./contexts/utils/profanity";

import App from "./components/App";
import AuthProvider from "./contexts/authContext";
import ModalProvider from "./contexts/modalContext";
import ScreenProvider from "./contexts/screenContext";
import NotificationProvider from "./contexts/notificationContext";

initProfanity(i18n.language);

i18n.on("languageChanged", (lng) => {
  loadProfanityDictionary(lng);
});

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
