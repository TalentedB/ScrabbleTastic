import { auth, signInWithGooglePopup } from "src/config/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import "./auth.css";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };
  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
  };
  return (
    <div className="registerForm bg-black">
      <h1 className="registerHeader">Register</h1>

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
        Register
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
