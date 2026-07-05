import { useState, useRef, useEffect } from "react";
import { personaMeta } from "../lib/personas";
import MessageBubble from "./MessageBubble";
import "./ChatWindow.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function ChatWindow({ persona, messages, onAddMessage, onClearChat }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, streamingContent]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMessage = { role: "user", content: trimmed };
    onAddMessage(persona, userMessage);
    setInput("");
    setLoading(true);
    setStreamingContent("");

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          messages: [...messages, userMessage],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Request failed");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value, { stream: true });
        const lines = text.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const payload = line.slice(6);
            if (payload === "[DONE]") break;

            try {
              const parsed = JSON.parse(payload);
              if (parsed.error) throw new Error(parsed.error);
              fullContent += parsed.content;
              setStreamingContent(fullContent);
            } catch (e) {
              if (e.message === "Stream interrupted.") throw e;
            }
          }
        }
      }

      onAddMessage(persona, { role: "assistant", content: fullContent });
      setStreamingContent("");
    } catch (err) {
      onAddMessage(persona, {
        role: "assistant",
        content: `Error: ${err.message}. Try again in a bit.`,
      });
      setStreamingContent("");
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

  const meta = personaMeta[persona];

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.length === 0 && !loading && (
          <div className="chat-empty">
            Start a conversation with {meta.name}
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
        {loading && streamingContent && (
          <MessageBubble
            role="assistant"
            content={streamingContent}
            persona={persona}
          />
        )}
        {loading && !streamingContent && (
          <div
            className="typing-indicator"
            style={{ "--tab-accent": meta.accent }}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-row">
        {messages.length > 0 && (
          <button
            className="clear-btn"
            onClick={onClearChat}
            disabled={loading}
            title="Clear chat"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        )}
        <textarea
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Message ${meta.name}...`}
          rows={1}
        />
        <button
          className="send-btn"
          style={{ "--tab-accent": meta.accent }}
          onClick={sendMessage}
          disabled={loading}
        >
          Send
        </button>
      </div>
    </div>
  );
}
