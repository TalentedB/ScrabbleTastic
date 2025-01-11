import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./routes/InGame/App.js";
import Login from "./routes/AuthLayout/Login/Login.jsx";
import AuthLayout from "./routes/AuthLayout/AuthLayout.jsx";
import Home from "./routes/Home/Home.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route index element={<Home />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="/ingame" element={<App />} />
    </Routes>
  </BrowserRouter>,
);
