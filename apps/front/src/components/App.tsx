import "./App.scss";

import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import ModalsManager from "./modals/ModalsManager";
import NotificationContainer from "./Notification/NotificationContainer";

export default function App() {
  return (
    <div className="app_container">
      <Header />
      <ModalsManager />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <NotificationContainer />
      <Footer />
    </div>
  );
}
