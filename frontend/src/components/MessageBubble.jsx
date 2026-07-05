import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { personaMeta } from "../lib/personas";
import "./MessageBubble.css";

export default function MessageBubble({ role, content, persona }) {
  const isUser = role === "user";
  const meta = personaMeta[persona];

  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      {!isUser && (
        <div className="avatar" style={{ "--tab-accent": meta.accent }}>
          {meta.initial}
        </div>
      )}
      <div
        className={`bubble ${isUser ? "user-bubble" : "assistant-bubble"}`}
        style={!isUser ? { "--tab-accent": meta.accent } : undefined}
      >
        {isUser ? (
          content
        ) : (
          <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        )}
      </div>
    </div>
  );
}
