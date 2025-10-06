import axios from "axios";
import "../../App.css";
import { useState, useContext, useEffect } from "react";
import { Navigate, useLocation, Link, useNavigate } from "react-router-dom";
import { FaRegEye } from "react-icons/fa";
import { IoIosEyeOff } from "react-icons/io";
import { FaGoogle } from "react-icons/fa6";
import { SiDash } from "react-icons/si";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { authContext } from "../../contexts/authContext";

let BASE_URL = import.meta.env.VITE_SERVER_BASE_URL;

export function Login() {
  const { user, setUser } = useContext(authContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ role: "client", email: "", password: "" });
  const roles = ["admin", "client", "vendor"];
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/login";
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/auth/login`, formData)
      .then((res) => {
        if (res.data.token) {
          if (res.data.user.isSuspended) {
            toast.error("Your account is suspended");
            return;
          }
          setUser(res.data.user);
          localStorage.setItem("token", res.data.token);
          navigate(formData.role !== "client" ? `/${formData.role}/` : from, { replace: true });
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || "Login failed"));
  };

  const googleLogin = () => {
    const CLIENT_ID = "486170631932-5s4abs9lgv958ptc06ho5705r50i2ccb.apps.googleusercontent.com";
    const REDIRECT_URI = "http://localhost:5000/auth/google/callback";
    const SCOPE = "openid email profile";
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(
      SCOPE
    )}`;
  };

  const dauthLogin = () => {
    const CLIENT_ID = "lAOrfPy9uph9nGYe";
    const REDIRECT_URI = "http://localhost:5000/auth/dauth/callback";
    const SCOPE = "email+user+profile+openid";
    window.location.href = `https://auth.delta.nitt.edu/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(
      SCOPE
    )}&state=xyz&nonce=abc`;
  };

  if (user) return <Navigate to={from} replace />;

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black text-white">
      <div className="backdrop-blur-xl bg-white/10 border border-white/20 w-full max-w-[400px] rounded-2xl p-8 flex flex-col items-center gap-6 transition-all hover:shadow-[#ff3333]/30">
        <h1 className="text-2xl font-bold text-[#ff3333]">Welcome Back</h1>
        <p className="text-gray-300 text-sm">Login to continue your journey</p>

  
        <div className="flex justify-around w-3/4 border border-gray-500 rounded-xl p-1">
          {roles.map((role) => (
            <span
              key={role}
              className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                formData.role === role ? "bg-[#ff3333] text-white" : "text-gray-300 hover:bg-[#ff3333]/20"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, role }))}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          ))}
        </div>

        <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-transparent border border-gray-400 rounded-lg p-2 w-full text-sm focus:outline-none text-white placeholder-gray-400"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            value={formData.email}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="bg-transparent border border-gray-400 rounded-lg p-2 w-full text-sm focus:outline-none text-white placeholder-gray-400 pr-8"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              value={formData.password}
              required
            />
            <span
              className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoIosEyeOff size={18} /> : <FaRegEye size={18} />}
            </span>
          </div>

          <div className="text-right">
            <Link to="/ForgotPassword" className="text-[#ff3333] text-sm hover:underline">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff3333] rounded-lg py-2 mt-2 font-semibold hover:bg-[#ff4d4d] transition-all"
          >
            Login
          </button>
        </form>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="flex-1 h-[1px] bg-gray-600" /> OR <span className="flex-1 h-[1px] bg-gray-600" />
        </div>

        <div className="flex gap-6">
          <FaGoogle
            className="bg-white text-black p-2 rounded-full text-4xl cursor-pointer hover:scale-110 transition-all"
            onClick={googleLogin}
          />
          <SiDash
            className="bg-white text-black p-2 rounded-full text-4xl cursor-pointer hover:scale-110 transition-all"
            onClick={dauthLogin}
          />
        </div>

        <p className="text-gray-400 text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-[#ff3333] font-semibold hover:underline">
            Sign up
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}


export function Signup() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(authContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ role: "client", username: "", email: "", password: "" });
  const roles = ["client", "vendor"];
  const location = useLocation();
  const from = location.state?.from || "/";

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) errors.push("Min 6 chars");
    if (!/[a-z]/.test(password)) errors.push("1 lowercase");
    if (!/[A-Z]/.test(password)) errors.push("1 uppercase");
    if (!/\d/.test(password)) errors.push("1 number");
    if (!/[@$!%*?&]/.test(password)) errors.push("1 special char");
    return errors;
  };

  const handleValidation = (e) => {
    e.preventDefault();
    const { email, password } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return toast.error("Invalid email");
    const errs = validatePassword(password);
    if (errs.length) return toast.error(errs.join(", "));
    handleSubmit(e);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(`${BASE_URL}/auth/register`, formData)
      .then((res) => {
        if (res.data.token) {
          setUser(res.data.user);
          localStorage.setItem("token", res.data.token);
          navigate(formData.role !== "client" ? `/${formData.role}/` : from, { replace: true });
        }
      })
      .catch((err) => toast.error(err.response?.data?.message || "Signup failed"));
  };

  if (user) return <Navigate to={from} replace />;

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black to-[#1a0000] text-white">
      <div className="bg-white/10 border border-white/20 w-full max-w-[400px] rounded-2xl p-8 flex flex-col items-center gap-6 transition-all hover:shadow-[#ff3333]/30">
        <h1 className="text-2xl font-bold text-[#ff3333]">Create Account</h1>
        <p className="text-gray-300 text-sm">Join us today!</p>

        <div className="flex justify-around w-3/4 border border-gray-500 rounded-xl p-1">
          {roles.map((role) => (
            <span
              key={role}
              className={`px-3 py-1 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                formData.role === role ? "bg-[#ff3333] text-white" : "text-gray-300 hover:bg-[#ff3333]/20"
              }`}
              onClick={() => setFormData((prev) => ({ ...prev, role }))}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          ))}
        </div>

        <form className="w-full flex flex-col gap-3" onSubmit={handleValidation}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            className="bg-transparent border border-gray-400 rounded-lg p-2 w-full text-sm text-white placeholder-gray-400 focus:outline-none"
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="bg-transparent border border-gray-400 rounded-lg p-2 w-full text-sm text-white placeholder-gray-400 focus:outline-none"
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="bg-transparent border border-gray-400 rounded-lg p-2 w-full text-sm text-white placeholder-gray-400 focus:outline-none pr-8"
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
            <span
              className="absolute right-3 top-2.5 text-gray-400 cursor-pointer hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <IoIosEyeOff size={18} /> : <FaRegEye size={18} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-[#ff3333] rounded-lg py-2 mt-2 font-semibold hover:bg-[#ff4d4d] transition-all"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span className="flex-1 h-[1px] bg-gray-600" /> OR <span className="flex-1 h-[1px] bg-gray-600" />
        </div>

        <div className="flex gap-6">
          <FaGoogle
            className="bg-white text-black p-2 rounded-full text-4xl cursor-pointer hover:scale-110 transition-all"
            onClick={() => {
              const CLIENT_ID = "486170631932-5s4abs9lgv958ptc06ho5705r50i2ccb.apps.googleusercontent.com";
              const REDIRECT_URI = "http://localhost:5000/auth/google/callback";
              const SCOPE = "openid email profile";
              window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${encodeURIComponent(
                SCOPE
              )}`;
            }}
          />
          <SiDash
            className="bg-white text-black p-2 rounded-full text-4xl cursor-pointer hover:scale-110 transition-all"
            onClick={() => {
              const CLIENT_ID = "lAOrfPy9uph9nGYe";
              const REDIRECT_URI = "http://localhost:5000/auth/dauth/callback";
              const SCOPE = "email+user+profile+openid";
              window.location.href = `https://auth.delta.nitt.edu/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=${encodeURIComponent(
                SCOPE
              )}&state=xyz&nonce=abc`;
            }}
          />
        </div>

        <p className="text-gray-400 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-[#ff3333] font-semibold hover:underline">
            Login
          </Link>
        </p>
        <ToastContainer />
      </div>
    </div>
  );
}
