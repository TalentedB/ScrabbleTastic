import { Auth } from "./components/Auth/auth";
import "./Login.css";

function Login() {
  return (
    <div className="h-screen bg-gradient-to-l from-baby-blue to-dark-blue flex justify-center items-center">
      <Auth />
    </div>
  );
}

export default Login;
