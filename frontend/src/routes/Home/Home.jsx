import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "src/config/firebase";
import Login from "./components/Login/Login";
import Dashboard from "./components/Dashboard/Dashboard";

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

  return (
    <div className="h-screen overflow-hidden bg-blue-200">
      <div className="text-center">
        {auth.currentUser && <Dashboard />}
        {!auth.currentUser && <Login />}
      </div>
    </div>
  );
}

export default Home;
