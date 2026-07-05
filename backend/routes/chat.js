const express = require("express");
const OpenAI = require("openai");
const hiteshPrompt = require("../prompts/hitesh");
const piyushPrompt = require("../prompts/piyush");

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const PERSONA_PROMPTS = {
  hitesh: hiteshPrompt,
  piyush: piyushPrompt,
};

const MAX_CONTEXT_MESSAGES = 20;

router.post("/", async (req, res) => {
  try {
    const { persona, messages } = req.body;

    if (!persona || !PERSONA_PROMPTS[persona]) {
      return res.status(400).json({ error: "Invalid persona. Use 'hitesh' or 'piyush'." });
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      max_tokens: 500,
      messages: [
        { role: "system", content: PERSONA_PROMPTS[persona] },
        ...recentMessages,
      ],
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write("data: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error(err);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: "Stream interrupted." })}\n\n`);
      return res.end();
    }
    if (err.status === 401) {
      return res.status(500).json({ error: "Invalid API key." });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: "Rate limit reached. Try again shortly." });
    }
    res.status(500).json({ error: "Something went wrong." });
  }
});

module.exports = router;
