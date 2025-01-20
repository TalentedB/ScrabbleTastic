import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router";
import "./AuthLayout.css";

function AuthLayout() {
  return (
    <div>
      {/* <h1 className="inline-block">ScrabbleTastic</h1> */}
      {/* <nav>
        <ul className="flex justify-center">
          <li className="p-4">
            <Link to="/" className="links">
              Home
            </Link>
          </li>
          <li className="p-4">
            <Link to="/register" className="links">
              Register
            </Link>
          </li>
          <li className="p-4">
            <Link to="/login" className="links">
              Login
            </Link>
          </li>
          <li className="p-4">
            <Link to="/ingame" className="links">
              Join Game
            </Link>
          </li>
        </ul>
      </nav> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
