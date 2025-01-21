import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { auth } from "src/config/firebase";
import BackgroundMusic from "./components/BackgroundMusic";
import "./Home.css";

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
      <BackgroundMusic />
      <div className="w-full flex justify-center mt-20">
        <img
          className="h-96 logo"
          src="images/logo.png"
          alt="ScrabbleTastic Logo"
        />
      </div>
      <div className="text-center">
        {auth.currentUser && <button onClick={handleLogout}>Sign Out</button>}
        {!auth.currentUser && (
          <Link
            to="Login"
            className="cursor-pointer border-2 p-3 border-black rounded-2xl hover:bg-[#6295c7] font-bold font-mono"
          >
            Login Here
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;
