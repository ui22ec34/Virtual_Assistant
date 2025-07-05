import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";

function Custom() {
  const { serverUrl, selectedImage, setUserData } = useContext(UserDataContext);
  const [assistantName, setAssistantName] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedNames = JSON.parse(localStorage.getItem("assistantNames")) || [];
    setSuggestions(savedNames);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setAssistantName(value);

    const savedNames = JSON.parse(localStorage.getItem("assistantNames")) || [];
    const filtered = savedNames.filter((name) =>
      name.toLowerCase().startsWith(value.toLowerCase())
    );
    setSuggestions(filtered);
  };

  const handleSuggestionClick = (name) => {
    setAssistantName(name);
    setSuggestions([]);
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/user/update`,
        {
          assistantName,
          imageUrl: selectedImage,
        },
        { withCredentials: true }
      );
      console.log("Updated:", res.data);
      setUserData(res.data);

      const savedNames = JSON.parse(localStorage.getItem("assistantNames")) || [];
      if (!savedNames.includes(assistantName)) {
        localStorage.setItem("assistantNames", JSON.stringify([...savedNames, assistantName]));
      }

      navigate("/");
    } catch (error) {
      console.error("Error updating assistant:", error);
    }
  };

  const handleLogout = async () => {
    try {
     
      await axios.post(`${serverUrl}/api/user/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout error:", err);
    }

   
    setUserData(null);
    localStorage.removeItem("assistantNames");

    
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#020236] text-white font-[Times_New_Roman] relative p-4">
      
      
      <div className="absolute top-4 right-6 space-x-4 z-10">
        <Link to="/signin" className="px-6 py-2 bg-blue-800 rounded-full shadow-md text-base font-semibold hover:bg-blue-900 transition">
          Sign In
        </Link>
        <Link to="/signup" className="px-6 py-2 bg-blue-800 rounded-full shadow-md text-base font-semibold hover:bg-blue-900 transition">
          Sign Up
        </Link>
        <Link to="/customize" className="px-6 py-2 bg-blue-800 rounded-full shadow-md text-base font-semibold hover:bg-blue-900 transition">
          Customize
        </Link>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 rounded-full shadow-md text-base font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      
      <div className="flex flex-col items-center justify-center mt-28">
        <h1 className="text-3xl font-bold mb-6 drop-shadow-lg">Shape Your Digital Helper</h1>

        {selectedImage && (
          <img
            src={selectedImage}
            alt="Selected Assistant"
            className="w-[300px] h-[360px] object-cover rounded-md mb-6 
              shadow-[0_25px_50px_rgba(0,0,0,0.7)] 
              ring-2 ring-blue-500 ring-offset-2 ring-offset-black 
              transition-transform duration-500 ease-in-out transform 
              hover:scale-105 hover:shadow-[0_25px_60px_rgba(59,130,246,0.6)]"
          />
        )}

        <div className="relative mb-6 w-[320px]">
          <input
            type="text"
            placeholder="Enter Assistant Name"
            value={assistantName}
            onChange={handleInputChange}
            className="px-6 py-3 w-full rounded-full text-black bg-white placeholder:text-gray-700 text-center text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
          />
          {assistantName && suggestions.length > 0 && (
            <ul className="absolute z-10 left-0 right-0 mt-2 bg-white text-black rounded-md shadow-lg max-h-48 overflow-y-auto">
              {suggestions.map((name, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleSuggestionClick(name)}
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-700 rounded-full text-base font-medium hover:bg-blue-800 transition shadow-md hover:shadow-lg"
        >
          Save & Continue
        </button>
      </div>
    </div>
  );
}

export default Custom;
