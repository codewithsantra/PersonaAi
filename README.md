# PersonaAI — Chat with Hitesh & Piyush

An AI-powered chat application that simulates conversations with two popular Indian tech educators — **Hitesh Choudhary** (Chai aur Code) and **Piyush Garg**. Built with React, Express, and OpenAI's GPT-4o-mini.

Switch between personas and experience their unique teaching styles, vocabulary, and personality in real-time.

## Live Demo

> _[Add deployed URL here]_

## Features

- Chat with AI versions of Hitesh Choudhary and Piyush Garg
- Seamless persona switching with independent conversation history
- Markdown rendering for code blocks, lists, tables, and formatted text
- Typing indicator with persona-themed animations
- Context-aware responses that maintain personality across long conversations
- Mobile-responsive dark theme with persona-specific accent colors
- Streaming responses (token-by-token, like ChatGPT)
- Chat history persisted in localStorage across page refreshes
- Clear chat button per persona
- Rate limiting (5 requests/minute per IP) to prevent API abuse
- Input validation and error handling
- Code generation guardrail — personas teach, not write code for you

---

## Setup & Run Instructions

### Prerequisites

- Node.js 18+
- An OpenAI API key ([get one here](https://platform.openai.com/api-keys))

### 1. Clone the repository

```bash
git clone https://github.com/codewithsantra/PersonaAi.git
cd PersonaAi
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:

```
OPENAI_API_KEY=sk-your-key-here
PORT=5000
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Variables

| Variable | Location | Description |
|---|---|---|
| `OPENAI_API_KEY` | `backend/.env` | Your OpenAI API key |
| `PORT` | `backend/.env` | Backend server port (default: 5000) |
| `VITE_API_URL` | `frontend/.env` | Backend URL (default: `http://localhost:5000`) |

---

## Documentation

### How Persona Data Was Collected and Prepared

Persona data was gathered exclusively from **publicly available sources**:

1. **YouTube channels**: Watched and analyzed multiple videos from both creators to capture:
   - Speaking patterns and vocabulary (Hinglish code-switching, signature phrases)
   - Teaching methodology and how they structure explanations
   - Humor style, tone, and energy level

2. **Official websites** ([hitesh.ai](https://hitesh.ai/), [piyushgarg.dev](https://www.piyushgarg.dev/)):
   - Career history and current roles
   - Course offerings, pricing, and platform details
   - Professional background and areas of expertise

3. **Social media and community presence**:
   - Twitter/X posts for communication style
   - Discord community interactions
   - GitHub profiles for technical interests

This data was synthesized into structured system prompts — no private data or copyrighted content is reproduced verbatim.

### Prompt Engineering Strategy

Each persona prompt follows a structured format with five sections:

1. **Identity & Background**: Establishes who the persona is, their career history, courses, platforms, and areas of expertise. This gives the model factual grounding so it can answer logistical questions accurately.

2. **Response Calibration**: A pre-processing step that classifies incoming questions into three types:
   - **Factual/logistical** → answered directly, no teaching detours
   - **Conceptual/skill-building** → teaching philosophy applies
   - **Casual/small talk** → brief, natural responses

   This prevents the common failure mode where persona bots apply their "personality quirks" to every message regardless of context.

3. **Speech Style**: Defines the linguistic patterns — Hinglish mixing for Hitesh, fast-paced dev-speak for Piyush — with explicit rules about frequency of signature phrases (max 1 per response, only in ~25% of messages). This prevents the "flanderization" effect where every response becomes a caricature.

4. **Teaching Philosophy**: Applied only to conceptual questions. Hitesh emphasizes fundamentals-first and guided discovery. Piyush emphasizes project-first learning and understanding tools in context.

5. **Boundaries & Examples**: Hard rules (never break character, don't guess pricing) plus few-shot examples that demonstrate the expected tone and length calibration.

**Key design decisions:**
- The "response calibration" section is placed first because LLMs weight earlier instructions more heavily
- Signature phrases are rate-limited to prevent repetitive, robotic-sounding responses
- User override rules (e.g., "reply in English") are given highest priority to prevent frustrating loops
- Markdown formatting is explicitly encouraged for technical explanations
- Each prompt includes a "what to do when you don't know" instruction to prevent hallucination of course prices or links

### Context Management Approach

Context management is handled at three levels:

1. **Frontend**: The full conversation history for each persona is maintained independently in React state. When switching personas, the user returns to their previous conversation without losing context.

2. **API layer**: The entire conversation history is sent with each request, allowing the model to reference earlier parts of the conversation for coherent multi-turn dialogue.

3. **Backend truncation**: A sliding window of the most recent **20 messages** is sent to the OpenAI API. This prevents token limit errors on long conversations while keeping enough context for coherent responses. The system prompt is always included outside this window, ensuring persona consistency regardless of conversation length. Output is capped at **500 tokens** per response to control cost.

4. **Persistence**: Conversations are saved to **localStorage** per browser, so users can refresh or return later without losing history. A clear chat button allows resetting a persona's conversation.

This approach balances three concerns:
- **Coherence**: 20 messages (~10 exchanges) is enough for the model to maintain conversation threads
- **Cost**: Token cap + context truncation prevents runaway usage
- **Reliability**: Avoids 4xx errors from exceeding the model's context window

---

### Sample Conversations

#### Hitesh Choudhary

```
User: What is the best way to learn JavaScript?

Hitesh: Dekho, sabse pehle ek cheez clear karo — JavaScript sirf ek 
scripting language nahi hai, yeh ek full-fledged programming language hai. 
Best way? **Project banao.** Tutorial dekhna band karo ek point ke baad. 
Ek todo app banao, phir ek weather app, phir ek full-stack app. Har 
project mein kuch naya seekhoge — DOM manipulation, async/await, APIs. 
Aur haan, **vanilla JS pehle**, framework baad mein.

User: Which framework should I learn first — React or Angular?

Hitesh: React. Industry demand zyada hai, learning curve comparatively 
easier hai, aur ecosystem bohot rich hai. Angular bhi accha hai — 
enterprise mein bahut use hota hai — but agar ek choose karna hai toh 
React se start karo. Lekin pehle make sure your vanilla JS is solid, 
warna koi bhi framework struggle dega.

User: Do you have a React course?

Hitesh: Haan, mere YouTube channel "Chai aur Code" pe React ka full 
series hai — free hai. Aur agar structured learning chahiye toh 
courses.chaicode.com pe check karo, wahan cohort-based courses milenge.
```

#### Piyush Garg

```
User: Should I learn Docker?

Piyush: Docker is dead. Just kidding — obviously learn it, it's 
literally everywhere. Here's the thing though — don't just memorize 
Dockerfile syntax. Take a Node.js app you've already built, containerize 
it, push it to a registry, deploy it. You'll learn more in 2 hours of 
doing that than a week of reading docs.

User: How does WebSocket work?

Piyush: So basically, a normal HTTP request is like sending a letter — 
you send one, you get one back, connection closed. WebSocket is like a 
phone call — once connected, both sides can talk whenever they want.

Technically:
1. Client sends an HTTP request with an `Upgrade: websocket` header
2. Server agrees → connection "upgrades" to WebSocket
3. Now both sides can send messages anytime over the same TCP connection

That's it. If you want to see it in action, build a real-time chat — 
`ws` library in Node, you'll have it working in 30 minutes.

User: Do you have a WebSocket course?

Piyush: Yeah, I have a "Realtime Communication Masterclass" on 
piyushgarg.dev that covers WebRTC, Socket.IO, and WebSockets in depth. 
Check it out there for the latest pricing.
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 8, CSS3 (custom properties) |
| Backend | Express 5, Node.js |
| AI Model | OpenAI GPT-4o-mini |
| Markdown | react-markdown, remark-gfm |

## Project Structure

```
PersonaAi/
├── backend/
│   ├── server.js            # Express server entry point
│   ├── routes/
│   │   └── chat.js          # POST /api/chat — validates, truncates, calls OpenAI
│   ├── prompts/
│   │   ├── hitesh.js        # Hitesh Choudhary system prompt
│   │   └── piyush.js        # Piyush Garg system prompt
│   ├── .env.example         # Environment variable template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Root component — state & persona routing
│   │   ├── lib/
│   │   │   └── personas.js  # Shared persona metadata
│   │   ├── components/
│   │   │   ├── PersonaSwitcher.jsx  # Persona tab selector
│   │   │   ├── ChatWindow.jsx       # Chat UI with input & message list
│   │   │   └── MessageBubble.jsx    # Individual message with markdown
│   │   ├── index.css        # Global theme & CSS variables
│   │   └── main.jsx         # React entry point
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## License

ISC
