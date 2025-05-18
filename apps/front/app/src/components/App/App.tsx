import "./App.scss"

import React from "react";
import { Routes, Route } from "react-router-dom";

import { Home } from "./Routes/Home/Home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
    </Routes>
  )
}

export { App };
