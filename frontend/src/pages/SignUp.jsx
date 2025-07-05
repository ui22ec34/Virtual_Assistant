import React, { useContext, useState, useEffect } from "react";
import bg from "../assets/b1.jpg";
import { IoIosEye, IoIosEyeOff } from "react-icons/io";
import { useNavigate, Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import axios from "axios";
import Navbar from "./Navbar";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(false); // 🔥 Dark mode state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

  const [nameSuggestions, setNameSuggestions] = useState([]);
  const [emailSuggestions, setEmailSuggestions] = useState([]);

  useEffect(() => {
    const savedNames = JSON.parse(localStorage.getItem("names") || "[]");
    const savedEmails = JSON.parse(localStorage.getItem("emails") || "[]");
    setNameSuggestions(savedNames);
    setEmailSuggestions(savedEmails);
  }, []);

  const getFilteredSuggestions = (input, list) => {
    if (!input) return [];
    return list.filter((item) =>
      item.toLowerCase().startsWith(input.toLowerCase())
    );
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password },
        { withCredentials: true }
      );
      setUserData(result.data);
      setSuccess("Signup successful! Redirecting...");
      setLoading(false);
      navigate("/customize")

      const names = Array.from(new Set([...(JSON.parse(localStorage.getItem("names") || "[]")), name]));
      const emails = Array.from(new Set([...(JSON.parse(localStorage.getItem("emails") || "[]")), email]));
      localStorage.setItem("names", JSON.stringify(names));
      localStorage.setItem("emails", JSON.stringify(emails));

      setTimeout(() => navigate("/customize"), 2000);
    } catch (error) {
      console.log("Signup error:", error);
      setUserData(null);
      setLoading(false);
      setErr(error.response?.data?.message || "Signup failed.");
    }
  };

  return (
    <div className={`w-screen h-screen flex items-center justify-center ${darkMode ? "bg-gray-900" : "bg-white"} transition-colors duration-500`}>
      <div
        className="w-full h-full bg-no-repeat bg-left rounded-lg shadow-lg flex items-center justify-center"
        style={{
          backgroundImage: `url(${bg}), url(${bg})`,
          backgroundPosition: "left, right",
          backgroundRepeat: "no-repeat",
          backgroundSize: "50% 100%",
        }}
      >
        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-5 right-5 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <form
          className={`w-[90%] h-[600px] max-w-[760px] p-6 rounded-md shadow-lg shadow-black flex flex-col items-center justify-center gap-[20px]
          ${darkMode ? "bg-[#1f1f1f]/80 text-white" : "bg-[#00000062] text-white"} backdrop-blur-md`}
          style={{ fontFamily: '"Times New Roman", serif' }}
          onSubmit={handleSignUp}
        >
          <h1 className="text-[30px]">
            Register to <span className="text-blue-400">Virtual Assistant</span>
          </h1>

          <div className="w-[75vh] relative">
            <input
              type="text"
              placeholder="Full Name"
              className={`w-full p-3 rounded focus:outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white/80 text-black"}`}
              required
              onChange={(e) => setName(e.target.value)}
              value={name}
              autoComplete="off"
            />
            {getFilteredSuggestions(name, nameSuggestions).length > 0 && (
              <ul className={`absolute z-10 rounded shadow-md w-full max-h-32 overflow-y-auto ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
                {getFilteredSuggestions(name, nameSuggestions).map((n, i) => (
                  <li
                    key={i}
                    onClick={() => setName(n)}
                    className="px-3 py-1 hover:bg-blue-500 cursor-pointer"
                  >
                    {n}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-[75vh] relative">
            <input
              type="email"
              placeholder="Email"
              className={`w-full p-3 rounded focus:outline-none ${darkMode ? "bg-gray-700 text-white" : "bg-white/80 text-black"}`}
              required
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              autoComplete="off"
            />
            {getFilteredSuggestions(email, emailSuggestions).length > 0 && (
              <ul className={`absolute z-10 rounded shadow-md w-full max-h-32 overflow-y-auto ${darkMode ? "bg-gray-700 text-white" : "bg-white text-black"}`}>
                {getFilteredSuggestions(email, emailSuggestions).map((e, i) => (
                  <li
                    key={i}
                    onClick={() => setEmail(e)}
                    className="px-3 py-1 hover:bg-blue-500 cursor-pointer"
                  >
                    {e}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="w-[75vh] relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full p-3 rounded focus:outline-none pr-10 ${darkMode ? "bg-gray-700 text-white" : "bg-white/80 text-black"}`}
              required
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <span
              className="absolute right-3 top-3 text-gray-400 cursor-pointer"
              onClick={togglePassword}
            >
              {showPassword ? <IoIosEyeOff size={24} /> : <IoIosEye size={24} />}
            </span>
          </div>
          
          {err && <p className="text-red-500 text-base font-medium mt-1">{err}</p>}
{success && <p className="text-green-500 text-base font-medium mt-1">{success}</p>}


          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md mt-2"
            disabled={loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          <p className="text-white mt-4 text-base">
              Already have an account?{" "}
               <Link to="/signin" className="text-blue-400 hover:underline font-medium">
              Sign In
              </Link>
           </p>

        </form>
      </div>
    </div>
  );
}

export default SignUp;
