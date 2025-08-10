import "./App.scss";

import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./Header/Header";
import Home from "../pages/Home/Home";
import Footer from "./Footer/Footer";

export default function App() {
  return (
    <div className="app_container">
      <Header></Header>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer></Footer>
    </div>
  );
}
