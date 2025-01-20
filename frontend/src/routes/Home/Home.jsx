import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { auth } from "src/config/firebase";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
      } else {
        console.log("user is logged out");
      }
    });
  });

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
        console.log("Signed out successfully");
      })
      .catch((error) => {});
  };

  return (
    <div className="h-screen overflow-hidden bg-blue-200">
      <h1 className="text-center">ScrabbleTastic</h1>
      <div className="text-center justify-around h-full flex flex-col">
        {auth.currentUser && <button onClick={handleLogout}>Sign Out</button>}
        {!auth.currentUser && <Link to="Login">Login/Register Here</Link>}
      </div>
    </div>
  );
}

export default Home;
