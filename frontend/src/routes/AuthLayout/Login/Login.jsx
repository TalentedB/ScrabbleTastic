import { signInWithGooglePopup } from "../../../config/firebase.js";

function Login() {
  const logGoogleUser = async () => {
    const response = await signInWithGooglePopup();
    console.log(response);
  };
  return (
    <div>
      <button className="bg-white" onClick={logGoogleUser}>
        Sign In With Google
      </button>
    </div>
  );
}
export default Login;
