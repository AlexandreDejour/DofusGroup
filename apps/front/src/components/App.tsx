import "./App.scss";

import { Routes, Route } from "react-router-dom";
import { CookieManager } from "react-cookie-manager";

import GCU from "../pages/GCU/GCU";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Profile from "../pages/Profile/Profile";
import ModalsManager from "./modals/ModalsManager";
import EventDetails from "../pages/EventDetails/EventDetails";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import NotificationContainer from "./Notification/NotificationContainer";
import CharacterDetails from "../pages/CharacterDetails/CharacterDetails";
import NotFound from "../pages/NotFound/NotFound";
import { useTranslation } from "react-i18next";
import i18n from "../i18n/i18n";

export default function App() {
  const { t } = useTranslation();

  return (
    <CookieManager
      translations={i18n.getResourceBundle(i18n.language, "cookies")}
      translationI18NextPrefix="cookies."
      theme={
        window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
      }
    >
      <div className="app_container">
        <Header />
        <ModalsManager />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/event/:id" element={<EventDetails />} />
          <Route path="/character/:id" element={<CharacterDetails />} />
          <Route path="/privacy_policy" element={<PrivacyPolicy />} />
          <Route path="/about" element={<About />} />
          <Route path="/gcu" element={<GCU />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <NotificationContainer />
        <Footer />
      </div>
    </CookieManager>
  );
}
