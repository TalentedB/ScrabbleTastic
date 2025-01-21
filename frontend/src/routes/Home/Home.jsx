import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { auth } from "src/config/firebase";
import Login from "./components/Login/Login";

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
      <div className="text-center">
        {auth.currentUser && <button onClick={handleLogout}>Sign Out</button>}
        {!auth.currentUser && <Login />}
      </div>
    </div>
  );
}

export default Home;
