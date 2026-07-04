import "./MessageBubble.css";

const personaMeta = {
  hitesh: { name: "Hitesh", initial: "H", accent: "var(--hitesh-accent)" },
  piyush: { name: "Piyush", initial: "P", accent: "var(--piyush-accent)" },
};

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
        {content}
      </div>
    </div>
  );
}
