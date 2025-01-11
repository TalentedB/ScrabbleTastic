import React from "react";
import { Link } from "react-router";

function Home() {
  return (
    <div className="h-screen overflow-hidden bg-blue-200">
      <h1 className="text-center">ScrabbleTastic</h1>
      <div className="text-center justify-around h-full flex flex-col">
        <Link to="Register">Register Here</Link>
        <Link to="Login">Login Here</Link>
      </div>
    </div>
  );
}

export default Home;
