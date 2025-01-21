import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router";
import "./AuthLayout.css";

function AuthLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

export default AuthLayout;
