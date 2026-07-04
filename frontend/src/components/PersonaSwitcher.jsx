import "./PersonaSwitcher.css";

const personas = [
  {
    key: "hitesh",
    name: "Hitesh",
    label: "Chai aur Code",
    accent: "var(--hitesh-accent)",
  },
  {
    key: "piyush",
    name: "Piyush",
    label: "Build & Ship",
    accent: "var(--piyush-accent)",
  },
];

export default function PersonaSwitcher({ activePersona, onSwitch }) {
  return (
    <div className="persona-switcher">
      {personas.map((p) => (
        <button
          key={p.key}
          className={`persona-tab ${activePersona === p.key ? "active" : ""}`}
          style={{ "--tab-accent": p.accent }}
          onClick={() => onSwitch(p.key)}
        >
          <span className="persona-name">{p.name}</span>
          <span className="persona-label">{p.label}</span>
        </button>
      ))}
    </div>
  );
}
