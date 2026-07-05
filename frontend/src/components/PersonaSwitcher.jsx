import { personaMeta } from "../lib/personas";
import "./PersonaSwitcher.css";

const personaKeys = Object.keys(personaMeta);

export default function PersonaSwitcher({ activePersona, onSwitch }) {
  return (
    <div className="persona-switcher">
      {personaKeys.map((key) => {
        const p = personaMeta[key];
        return (
          <button
            key={key}
            className={`persona-tab ${activePersona === key ? "active" : ""}`}
            style={{ "--tab-accent": p.accent }}
            onClick={() => onSwitch(key)}
          >
            <span className="persona-name">{p.name}</span>
            <span className="persona-label">{p.label}</span>
          </button>
        );
      })}
    </div>
  );
}
