import React, { useState, useEffect, useRef, useContext } from "react";
import geminiResponse from "../../../backend/gemini";
import { UserDataContext } from "../context/UserContext";

const ChatBox = () => {
  const [input, setInput] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [assistantName, setAssistantName] = useState("Maya");
  const [userName, setUserName] = useState("User");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const synthRef = useRef(window.speechSynthesis);

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = synthRef.current.getVoices();
      setVoices(allVoices);
      if (allVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(allVoices[0]);
      }
    };

    if (synthRef.current.onvoiceschanged !== undefined) {
      synthRef.current.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  const speak = (text) => {
    if (!selectedVoice) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    synthRef.current.speak(utterance);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setChatLog([...chatLog, userMessage]);

    const response = await geminiResponse(input, assistantName, userName);
    const mayaMessage = {
      from: "maya",
      text: response.response,
      details: response.details || ""
    };

    setChatLog((prev) => [...prev, mayaMessage]);
    speak(response.response);
    setInput("");
  };

  return (
    <div style={{ padding: 20, color: "#fff", backgroundColor: "#1a1a2e", borderRadius: 15, maxWidth: 800, margin: "auto", boxShadow: "0 0 10px blue" }}>
      <h2 style={{ textAlign: "center", color: "#fff", marginBottom: 10 }}>{assistantName} - AI Assistant</h2>

      <input
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
        placeholder="Assistant Name"
        style={{ marginBottom: 10, padding: 8, width: "100%", borderRadius: 6, border: "1px solid #ccc", color: "#fff", backgroundColor: "#333" }}
      />

      <input
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
        placeholder="Your Name"
        style={{ marginBottom: 20, padding: 8, width: "100%", borderRadius: 6, border: "1px solid #ccc", color: "#fff", backgroundColor: "#333" }}
      />

      <div style={{ backgroundColor: "#0f0f1f", padding: 15, borderRadius: 10, marginTop: 10, height: 300, overflowY: "auto" }}>
        {chatLog.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              margin: "8px 0",
              color: msg.from === "user" ? "#0ff" : "#ff9"
            }}
          >
            <strong>{msg.from === "user" ? userName : assistantName}:</strong> {msg.text}
            {msg.details && <div style={{ fontSize: 16, color: "#ccc" }}>{msg.details}</div>}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${assistantName} anything...`}
          style={{ flexGrow: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc", color: "#fff", backgroundColor: "#333" }}
        />
        <button onClick={handleSend} style={{ padding: "8px 16px", borderRadius: 6, border: "none", backgroundColor: "#4fc3f7", color: "#000", fontWeight: "bold" }}>Send</button>
      </div>

      <div style={{ marginTop: 20 }}>
        <label htmlFor="voiceSelect" style={{ color: "#fff" }}>Choose Voice: </label>
        <select
          id="voiceSelect"
          value={selectedVoice?.name || ""}
          onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
          style={{
            color: "#000",
            backgroundColor: "#fff",
            padding: "6px",
            borderRadius: "6px",
            appearance: "menulist"
          }}
        >
          {voices.map((voice, i) => (
            <option
              key={i}
              value={voice.name}
              style={{ color: "#000", backgroundColor: "#fff" }}
            >
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
        <button onClick={() => speak("Testing voice output.")} style={{ marginLeft: 10 }}>Test Voice</button>
      </div>
    </div>
  );
};

export default ChatBox;
