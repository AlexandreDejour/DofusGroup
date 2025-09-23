import "./App.scss";

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Profile from "../pages/Profile/Profile";
import ModalsManager from "./modals/ModalsManager";
import EventDetails from "../pages/EventDetails/EventDetails";
import NotificationContainer from "./Notification/NotificationContainer";
import CharacterDetails from "../pages/CharacterDetails/CharacterDetails";
import PrivacyPolicy from "../pages/PrivacyPolicy/PrivacyPolicy";
import GCU from "../pages/GCU/GCU";

export default function App() {
  return (
    <div className="app_container">
      <Header />
      <ModalsManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/character/:id" element={<CharacterDetails />} />
        <Route path="/privacy_policy" element={<PrivacyPolicy />} />
        <Route path="/gcu" element={<GCU />} />
      </Routes>
      <NotificationContainer />
      <Footer />
    </div>
  );
}
