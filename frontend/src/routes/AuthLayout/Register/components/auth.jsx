// import { auth } from "../../../../config/firebase.js";
import { auth } from "src/config/firebase.js";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";

export const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    console.log("here");
    console.log(auth);
    await createUserWithEmailAndPassword(auth, email, password);
  };
  return (
    <div>
      <input
        placeholder="Email..."
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        placeholder="Password..."
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-white" onClick={register}>
        Register
      </button>
    </div>
  );
};
