import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./routes/InGame/App.js";
import Login from "./routes/AuthLayout/Login/Login.jsx";
import Register from "./routes/AuthLayout/Register/Register.jsx";
import AuthLayout from "./routes/AuthLayout/AuthLayout.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      {/* <Route index element={<Home />} />
      <Route path="about" element={<About />} />
      */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>{" "}
      {/* <Route path="game"> */}
      <Route path="/ingame" element={<App />} />
      {/* <Route path="/result" element={<Results />} /> */}
      {/* </Route> */}
    </Routes>
  </BrowserRouter>,
);
