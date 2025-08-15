import "./App.scss";

import { Routes, Route } from "react-router-dom";

import Header from "./Header/Header";
import ModalsManager from "./modals/ModalsManager";
import Home from "../pages/Home/Home";
import Footer from "./Footer/Footer";

export default function App() {
  return (
    <div className="app_container">
      <Header />
      <ModalsManager />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </div>
  );
}
