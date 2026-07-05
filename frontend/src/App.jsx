import { useState, useEffect } from "react";
import PersonaSwitcher from "./components/PersonaSwitcher";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

const STORAGE_KEY = "personaai-conversations";

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return { hitesh: [], piyush: [] };
}

function App() {
  const [persona, setPersona] = useState("hitesh");
  const [conversations, setConversations] = useState(loadConversations);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  }, [conversations]);

  const addMessage = (personaKey, message) => {
    setConversations((prev) => ({
      ...prev,
      [personaKey]: [...prev[personaKey], message],
    }));
  };

  const clearChat = () => {
    setConversations((prev) => ({
      ...prev,
      [persona]: [],
    }));
  };

  return (
    <div className="app-shell">
      <PersonaSwitcher activePersona={persona} onSwitch={setPersona} />
      <ChatWindow
        persona={persona}
        messages={conversations[persona]}
        onAddMessage={addMessage}
        onClearChat={clearChat}
      />
    </div>
  );
}

export default App;
