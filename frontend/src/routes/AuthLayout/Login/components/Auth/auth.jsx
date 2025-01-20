import { auth, signInWithGooglePopup } from "src/config/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useCallback, useState } from "react";
import "./auth.css";

function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidMessage, setInvalidMessage] = useState("");
  const [pageAction, setPageAction] = useState("Login");
  const setInvalidEmailDebounce = useCallback(
    debounce(() => {
      setInvalidMessage("");
    }, 5000),
    [],
  ); // Empty dependency array ensures this function is only created once

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const errorCode = error.code;

      if (errorCode === "auth/email-already-in-use") {
        setInvalidMessage("Email is already in use.");
      } else if (errorCode === "auth/invalid-email") {
        setInvalidMessage("Email is invalid.");
      } else if (errorCode === "auth/weak-password") {
        setInvalidMessage("Password is too weak.");
      } else if (errorCode === "auth/too-many-requests") {
        setInvalidMessage("Too many sign-in attempts.");
      } else {
        setInvalidMessage("An error occurred in the system.");
      }
      setInvalidEmailDebounce();
    }
  };

  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
  };

  return (
    <div className="registerForm bg-black">
      <div className="flex flex-row justify-center w-[399px] font-bold border-black align-middle">
        <button
          className={`w-1/4 border-[1px] ${pageAction === "Login" ? "bg-[#97bdccbd]" : ""} border-black hover:bg-[#97bdccbd]`}
          onClick={() => {
            setPageAction("Login");
          }}
        >
          Login
        </button>
        <button
          className={`w-1/4 border-[1px] ${pageAction === "Register" ? "bg-[#97bdccbd]" : ""} border-black hover:bg-[#97bdccbd]`}
          onClick={() => {
            setPageAction("Register");
          }}
        >
          Register
        </button>
      </div>
      <img className="h-48" src="logo.png" alt="ScrabbleTastic Logo" />
      <h1 className="registerHeader">{pageAction}</h1>

      <h1 className={`text-red-600`}>
        {invalidMessage.length === 0 ? "\u00A0" : invalidMessage}
      </h1>

      <input
        className="registerInput"
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        className="registerInput"
        placeholder="Password..."
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-white register-button" onClick={register}>
        {pageAction}
      </button>
      <div className="flex w-full">
        <div className="h-1 bg-black w-full m-auto"></div>
        <div className="inline-block p-1 font-semibold">OR</div>
        <div className="h-1 bg-black w-full inline-block m-auto"></div>
        <div></div>
      </div>
      <button onClick={logGoogleUser} class="register-with-google">
        <img class="google-logo" src="google-icon.svg" alt="Google logo" />
        Register with Google
      </button>
    </div>
  );
};
