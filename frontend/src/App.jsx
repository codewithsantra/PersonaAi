import { useState } from "react";
import PersonaSwitcher from "./components/PersonaSwitcher";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

function App() {
  const [persona, setPersona] = useState("hitesh");
  const [conversations, setConversations] = useState({
    hitesh: [],
    piyush: [],
  });

  const addMessage = (personaKey, message) => {
    setConversations((prev) => ({
      ...prev,
      [personaKey]: [...prev[personaKey], message],
    }));
  };

  return (
    <div className="app-shell">
      <PersonaSwitcher activePersona={persona} onSwitch={setPersona} />
      <ChatWindow
        persona={persona}
        messages={conversations[persona]}
        onAddMessage={addMessage}
      />
    </div>
  );
}

export default App;
