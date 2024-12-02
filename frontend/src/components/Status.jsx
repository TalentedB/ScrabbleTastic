import { HealthBar } from "./HealthBar";
import { Points } from "./Points";
import { useState } from "react";
import main_avatar from "../assets/main_avatar.png";
import "../css/Status.css";

export const Status = ({ user }) => {
  const [test, setTest] = useState(100);

  return (
    <div className="flex flex-col justify-center">
      <p>User {user}</p>
      <HealthBar health={test} />
      <div className="flex justify-center relative">
        <div
          className={`${user === "2" ? "absolute bg-red-500 bg-opacity-50 w-[100px] h-[100px]" : ""}`}
        ></div>
        <img
          src={main_avatar}
          width="100px"
          height="100px"
          alt="Profile Pics"
        />
      </div>
      <button
        onClick={() => {
          setTest(test - 20);
        }}
      >
        CLICK ME
      </button>
      <Points user={user} />
    </div>
  );
};
