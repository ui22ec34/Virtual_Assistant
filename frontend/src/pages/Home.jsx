import React, { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { UserDataContext } from "../context/UserContext";
import { FaMicrophone } from "react-icons/fa";
import geminiResponse from "../../../backend/gemini";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import SystemConfig from "../SystemConfig";       
import getWeatherByCoords from "./getWeatherByCoords";
import WeatherWithMap from "../components/WeatherWithMap";


import ChatBox from "../components/ChatBox";





function Home() {
  const { userData, setUserData } = useContext(UserDataContext);
  const navigate = useNavigate();

  const [message, setMessage] = useState("Type or say to get started.");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [inputCommand, setInputCommand] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false)

  const [dateTime, setDateTime] = useState({ time: "", date: "" });
  const [weather, setWeather] = useState(null)
  const [quote, setQuote] = useState("");

  const [city, setCity] = useState("");
  

  const recognitionRef = useRef(null);
  const musicRef = useRef(null);
  const openedTabs = useRef({ telegram: null, snapchat: null, whatsapp: null, camera: null });

  const particlesInit = async (main) => await loadFull(main);

  const particlesOptions = {
    background: { color: { value: "transparent" } },
    particles: {
      number: { value: 50 },
      color: { value: "#ffffff" },
      shape: { type: "star" },
      size: { value: 4 },
      move: {
        enable: true,
        speed: 1,
        direction: "top",
        outModes: { default: "out" },
      },
      opacity: { value: 0.3 },
      links: {
        enable: true,
        distance: 150,
        color: "#ffffff",
        opacity: 0.4,
        width: 1,
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "repulse" },
        onClick: { enable: true, mode: "push" },
        resize: true,
      },
      modes: {
        repulse: { distance: 100 },
        push: { quantity: 4 },
      },
    },
    fullScreen: { enable: false },
  };

  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {};

    const bgMusic = new Audio("/bg.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    bgMusic.play().catch(() => {
      console.warn("Autoplay blocked. Will require user interaction.");
    });
    musicRef.current = bgMusic;
  }, []);


  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      const { city, weather } = await getWeatherByCoords(latitude, longitude);

      setCity(city);
      setWeather(weather);
    },
    (error) => {
      console.error("Geolocation error:", error);
      setWeather("Unable to access your location.");
      setCity("your location");
    }
  );
}, []);



  useEffect(() => {
  const updateTime = () => {
    const now = new Date();
    setDateTime({
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: now.toDateString(),
    });
  };

  updateTime();
  const interval = setInterval(updateTime, 60000); // Update every minute
  return () => clearInterval(interval);
}, []);

useEffect(() => {
  const fetchQuote = async () => {
    try {
      const res = await axios.get("https://api.quotable.io/random");
      setQuote(`${res.data.content} — ${res.data.author}`);
    } catch {
      setQuote("Stay positive and keep going!");
    }
  };

  fetchQuote();
}, []);




  const toggleMusic = () => {
    if (musicRef.current) {
      if (musicMuted) {
        musicRef.current.play();
      } else {
        musicRef.current.pause();
      }
      setMusicMuted(!musicMuted);
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice =
      voices.find((v) => v.name.toLowerCase().includes("female")) ||
      voices.find((v) => v.lang === "en-US");
    if (femaleVoice) utterance.voice = femaleVoice;
    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleLogout = () => {
    setUserData({});
    navigate("/signup");
  };

  const handleCommand = async (command) => {
    setIsLoading(true);
    setMessage(`Hi. I am ${userData?.assistantName || "Maya"}`);
    try {
      const result = await geminiResponse(command, userData?.assistantName || "Maya", userData?.name || "Nirjala");
      const { type, userInput, response } = result;
      setMessage(response);
      speak(response);
      setIsLoading(false);

      switch (type) {
        case "google-search": window.open(`https://www.google.com/search?q=${encodeURIComponent(userInput)}`, "_blank"); break;
        case "youtube-search": {
  const query = encodeURIComponent(userInput);
  window.open(`https://www.youtube.com/results?search_query=${query}`, "_blank");
  speak("Here are the YouTube results.");
  break;
}
 

case "youtube-play": {
  const apiKey = "AIzaSyBzRozQxMhko0pY_Uut2st-3iTV-OYolAg";
  let query = userInput.toLowerCase();

  // Detect language (e.g., "in Hindi")
  const langMatch = query.match(/in ([a-zA-Z]+)/);
  const language = langMatch ? langMatch[1] : "";

  // Type checks
  const isMovieQuery = /\b(movie|film|cinema|picture)\b/i.test(query);
  const isTrailerQuery = /\btrailer\b/i.test(query);
  const isShortsQuery = /\bshorts?\b/i.test(query);

  // Words to strip
  const noiseWords = [
    "play", "launch", "start", "open", "watch", "please", "now",
    "on youtube", "in youtube", "youtube", "video", "song"
  ];
  noiseWords.forEach(word => {
    query = query.replace(new RegExp(`\\b${word}\\b`, "gi"), "");
  });

  // Remove detected language part
  query = query.replace(/in [a-zA-Z]+\b/i, "").trim();

  // Build final query
  let finalQuery = query;
  if (language) finalQuery += ` ${language}`;
  if (isMovieQuery) finalQuery += ` full movie`;
  if (isTrailerQuery) finalQuery += ` trailer`;
  if (isShortsQuery) finalQuery += ` shorts`;

  // Choose duration filter
  let duration = "any";
  if (isMovieQuery) duration = "long";
  else if (isShortsQuery) duration = "short";
  else if (isTrailerQuery) duration = "any";

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(finalQuery.trim())}&type=video&videoDuration=${duration}&videoEmbeddable=true&key=${apiKey}&maxResults=1`
    );
    const data = await res.json();
    const videoId = data.items[0]?.id?.videoId;

    if (videoId) {
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}&autoplay=1`;
      window.open(videoUrl, "_blank");
      speak("Playing it on YouTube now.");
    } else {
      speak("Sorry, I couldn't find a suitable video.");
    }
  } catch (err) {
    console.error("YouTube error:", err);
    speak("Something went wrong while fetching from YouTube.");
  }

  break;
}

         case "youtube-open": {
  const youtubeTab = window.open("https://www.youtube.com", "_blank");
  if (youtubeTab) {
    openedTabs.current.youtube = youtubeTab; // store the tab reference
    speak("Opening YouTube for you.");
  } else {
    speak("Popup was blocked. Please allow popups for this site.");
  }
  break;
}

        case "youtube-open": {
  const youtubeTab = window.open("https://www.youtube.com", "_blank");
  if (youtubeTab) {
    openedTabs.current.youtube = youtubeTab; // store the tab reference
    speak("Opening YouTube for you.");
  } else {
    speak("Popup was blocked. Please allow popups for this site.");
  }
  break;
}
        
      



        case "calculator-open": window.open("https://www.google.com/search?q=calculator", "_blank"); break;
        case "instagram-open": window.open("https://www.instagram.com", "_blank"); break;
        case "instagram-reels": window.open("https://www.instagram.com/reels/", "_blank"); break;
        case "instagram-user-reels": {
          const username = userInput.toLowerCase().split(" ").filter(word => !["instagram", "reels", "of", "play"].includes(word)).join("");
          if (username) window.open(`https://www.instagram.com/${username}/reels/`, "_blank");
          else speak("Sorry, I couldn't figure out the username.");
          break;
        }
        case "facebook-open": window.open("https://www.facebook.com", "_blank"); break;
        case "weather-show": const weatherInfo = await getWeather(userInput); setMessage(weatherInfo); speak(weatherInfo); break;
        case "open-camera": openedTabs.current.camera = window.open("https://webcamera.io/", "_blank"); break;
        case "open-telegram": openedTabs.current.telegram = window.open("https://web.telegram.org/", "_blank"); break;
        case "open-snapchat": openedTabs.current.snapchat = window.open("https://web.snapchat.com/", "_blank"); break;
        case "open-whatsapp": openedTabs.current.whatsapp = window.open("https://web.whatsapp.com/", "_blank"); break;
        case "open-files": speak("Sorry, I can't access your local files for security reasons."); break;
        case "close-telegram": if (openedTabs.current.telegram) openedTabs.current.telegram.close(); break;
        case "close-snapchat": if (openedTabs.current.snapchat) openedTabs.current.snapchat.close(); break;
        case "close-whatsapp": if (openedTabs.current.whatsapp) openedTabs.current.whatsapp.close(); break;
        case "close-camera": if (openedTabs.current.camera) openedTabs.current.camera.close(); break;
        default: break;
      }
    } catch (err) {
      console.error("Error:", err);
      const fallback = "Sorry, I couldn't understand that.";
      setMessage(fallback);
      speak(fallback);
      setIsLoading(false);
    }
  };

  const startListening = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return alert("Speech Recognition not supported.");
    const recognition = new SR();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.trim().toLowerCase();
      if (!transcript.includes("maya")) return;
      const command = transcript.replace(/maya/, "").trim();
      handleCommand(command);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const handleInputSubmit = (e) => {
    e.preventDefault();
    const cmd = inputCommand.trim().toLowerCase();
    setInputCommand("");
    handleCommand(cmd);
  };

  return (
    <div className="min-h-screen bg-gradient-to-t from-black to-[#020236] text-white font-[Times_New_Roman] p-4 relative overflow-hidden">
      <Particles id="tsparticles" init={particlesInit} options={particlesOptions} className="absolute top-0 left-0 w-full h-full z-0" />
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="animate-pulse bg-purple-900/20 w-full h-full rounded-full blur-3xl" />
      </div>
  
      <div className="relative z-10 min-h-screen">
        <div className="fixed top-6 right-6 flex space-x-4 z-20">
          <button onClick={() => navigate("/custom")} className="bg-blue-700 px-4 py-2 rounded-full hover:bg-blue-800 text-sm">Customize Assistant</button>
          <button onClick={toggleMusic} className="bg-yellow-600 px-4 py-2 rounded-full hover:bg-yellow-700 text-sm">{musicMuted ? "Unmute Music" : "Mute Music"}</button>
          <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded-full hover:bg-red-700 text-sm">Logout</button>
        </div>
      

      <div className="fixed top-40 left-6 space-y-6 z-20 text-sm w-60">
  {/* Time & Date */}
  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-md">
    <div className="text-lg font-semibold text-purple-300">🕒 {dateTime.time}</div>
    <div className="text-gray-300">{dateTime.date}</div>
  </div>
   

   
  {weather && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-md">
          <div className="text-purple-300 font-medium">🌤️ Weather</div>
          <div className="text-white text-sm">
            {city && <strong>{city}:</strong>} {weather}
          </div>
        </div>
      )}


  {/* Quote */}
  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-md">
    <div className="text-purple-300 font-medium">💡 Quote</div>
    <div className="text-white text-sm">{quote}</div>
  </div>
</div>


{/* 3D Glassy Title Without Wave Animation */}
<div className="relative mx-auto mt-10 w-fit group perspective-3d">
  <div
    className="text-center text-2xl md:text-4xl font-[Audiowide] text-white 
               bg-white/5 backdrop-blur-md px-6 py-4 rounded-2xl 
               shadow-[0_0_30px_rgba(255,255,255,0.1)] transform-gpu 
               transition-transform duration-500 ease-in-out group-hover:rotate-x-6 group-hover:rotate-y-6"
    style={{
      textShadow: `
        0 0 5px #b388ff,
        0 0 10px #b388ff,
        0 0 15px #a855f7,
        0 0 25px #9333ea,
        0 0 35px #7e22ce,
        0 0 50px rgba(194,127,255,0.8)
      `,
      perspective: "800px"
    }}
  >
    {"Hello, Commander! Awaiting Your Command.".split(" ").map((word, index) => (
      <span key={index} className="inline-block mr-2">
        {word}
      </span>
    ))}
  </div>
</div>



        <div className="flex flex-col items-center justify-center h-full mt-12">
          <div className={`w-60 h-80 overflow-hidden rounded-3xl mb-6 relative transition duration-300 ${isSpeaking ? "shadow-[0_0_30px_10px_rgba(255,0,255,0.6)] animate-pulse" : "shadow-lg"}`}>
            {userData?.assistantImage ? (
              <img src={userData.assistantImage} alt="Assistant" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">No image</div>
            )}
          </div>
          {userData?.assistantName && <h2 className="text-xl font-semibold mb-4">Hello! I’m {userData.assistantName}</h2>}
         <div className="max-w-md text-center text-gray-300 mb-4 bg-white/10 p-3 rounded-lg border border-white/20 backdrop-blur-sm">
  <p>{message}</p>
  {isLoading && (
    <div className="flex justify-center mt-2 space-x-1">
      <span className="w-2 h-2 bg-white rounded-full animate-bounce" />
      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-150" />
      <span className="w-2 h-2 bg-white rounded-full animate-bounce delay-300" />
    </div>
  )}
</div>

      <button onClick={startListening} className="text-purple-500 text-3xl animate-pulse" title="Click to speak">
            <FaMicrophone />
          </button>
    <div className="mb-6"> 
  <ChatBox />
</div>

  

          
          {isListening && <p className="mt-2 text-xs text-green-400 animate-pulse">Listening...</p>}
          <form onSubmit={handleInputSubmit} className="mt-4 flex gap-2">
            <input type="text" value={inputCommand} onChange={(e) => setInputCommand(e.target.value)} placeholder="Type a command..." className="px-4 py-3 rounded-lg text-white bg-white/10 border border-white/20 placeholder-white w-[300px] sm:w-[400px]" />
            <button className="bg-purple-700 px-3 py-2 rounded-lg text-sm text-white transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">Send</button>
          </form>
        </div>
      </div>
      <WeatherWithMap />
    </div>
  
    
  );
}

export default Home;