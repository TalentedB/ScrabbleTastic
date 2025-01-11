import React from "react";
import { Outlet } from "react-router-dom";
import { Link } from "react-router";

function AuthLayout() {
  return (
    <div>
      <h1>ScrabbleTastic</h1>
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/ingame">Join Game</Link>
          </li>
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;
