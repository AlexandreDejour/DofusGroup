import "./App.scss";

import { Routes, Route } from "react-router-dom";

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
        <Route path="/about" element={<About />} />
        <Route path="/gcu" element={<GCU />} />
      </Routes>
      <NotificationContainer />
      <Footer />
    </div>
  );
}
