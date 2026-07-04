import { useState, useRef, useEffect } from "react";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

const personaMeta = {
  hitesh: { name: "Hitesh", accent: "var(--hitesh-accent)" },
  piyush: { name: "Piyush", accent: "var(--piyush-accent)" },
};

export default function ChatWindow({ persona, messages, onAddMessage }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", content: trimmed };
    onAddMessage(persona, userMessage);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          messages: [...messages, userMessage],
        }),
      });

      const data = await res.json();
      onAddMessage(persona, { role: "assistant", content: data.reply });
    } catch (err) {
      onAddMessage(persona, {
        role: "assistant",
        content: "Kuch gadbad ho gayi — try again in a bit.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-empty">
            Start a conversation with {personaMeta[persona].name}
          </div>
        )}
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            persona={persona}
          />
        ))}
        {loading && (
          <div
            className="typing-indicator"
            style={{ "--tab-accent": personaMeta[persona].accent }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${personaMeta[persona].name}...`}
          rows={1}
        />
        <button
          className="send-btn"
          style={{ "--tab-accent": personaMeta[persona].accent }}
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
