import React from "react";
import { Link } from "react-router";
import BackgroundMusic from "../BackgroundMusic";
import "./animation.css";

function Login() {
  return (
    <div className="h-screen overflow-hidden bg-blue-200">
      <BackgroundMusic />
      <div className="w-full flex justify-center mt-20">
        <img
          className="h-96 logo"
          src="images/logo.png"
          alt="ScrabbleTastic Logo"
        />
      </div>
      <div className="text-center">
        <Link
          to="Login"
          className="cursor-pointer border-2 p-3 border-black rounded-2xl hover:bg-[#6295c7] font-bold font-mono"
        >
          Login Here
        </Link>
      </div>
    </div>
  );
}

export default Login;
