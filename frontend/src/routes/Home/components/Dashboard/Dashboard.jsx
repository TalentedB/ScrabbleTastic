import React from "react";
import { Link } from "react-router";
import BackgroundMusic from "./BackgroundMusic";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "src/config/firebase";

function Dashboard() {
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("Signed out successfully");
      })
      .catch((error) => {});
  };

  return (
    <div className="h-screen overflow-hidden bg-blue-200">
      <div className="w-full flex justify-center absolute top-5">
        <img className="h-36" src="images/logo.png" alt="ScrabbleTastic Logo" />
      </div>
      <BackgroundMusic />

      <Link
        to="/"
        className="cursor-pointer border-2 p-3 border-black rounded-2xl hover:bg-[#c73b3b] font-bold font-mono top-5 absolute right-5"
        onClick={handleLogout}
      >
        Sign Out
      </Link>

      <div className="justify-center align-middle flex h-full">
        <section className="flex flex-col w-40 h-full justify-center align-middle gap-10">
          <button className="border-2 border-black rounded-2xl hover:bg-[#6295c7]">
            Queue Up
          </button>
          <button className="border-2 border-black rounded-2xl hover:bg-[#6295c7]">
            Statistics
          </button>
          <button className="border-2 border-black rounded-2xl hover:bg-[#6295c7]">
            Leaderboard
          </button>
          <button className="border-2 border-black rounded-2xl hover:bg-[#6295c7]">
            Set Username
          </button>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
