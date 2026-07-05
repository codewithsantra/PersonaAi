const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const chatRoute = require("./routes/chat");

const app = express();
app.use(cors());
app.use(express.json());

const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests — slow down and try again in a minute." },
});

app.get("/", (req, res) => {
  res.json({ status: "PersonaAI API is running" });
});

app.use("/api/chat", chatLimiter, chatRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
